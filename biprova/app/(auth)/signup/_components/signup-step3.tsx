'use client';

import { useState, useRef, useEffect } from 'react';
import { z } from 'zod';
import { Field } from './field';
import { searchSkills } from '@/features/auth/actions';

const MAX_SKILLS = 3;

const schema = z.object({
  skills:       z.array(z.string()),
  linkedin_url: z
    .string()
    .url('Geçerli bir URL gir')
    .refine((v) => v.includes('linkedin.com/in/'), 'linkedin.com/in/ içermeli'),
});

type Errors = Partial<Record<'skills' | 'linkedin_url', string>>;

interface AllData {
  name: string;
  email: string;
  password: string;
  city: string;
  is_remote: boolean;
}

interface StepData {
  skill_ids:    string[];
  linkedin_url: string;
}

interface Props {
  allData: AllData;
  onBack: () => void;
  onNext: (values: StepData) => void;
}

function toDisplayName(name: string): string {
  return name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
}

export function SignupStep3({ allData, onBack, onNext }: Props) {
  const [selectedSkills, setSelectedSkills] = useState<{ id: string; name: string }[]>([]);
  const [query, setQuery]                   = useState('');
  const [results, setResults]               = useState<{ id: string; name: string }[]>([]);
  const [showDropdown, setShowDropdown]     = useState(false);
  const [linkedin, setLinkedin]             = useState('');
  const [errors, setErrors]   = useState<Errors>({});
  const debounceRef           = useRef<ReturnType<typeof setTimeout> | null>(null);
  const containerRef                        = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  function handleQueryChange(value: string) {
    const upper = value.toLocaleUpperCase('tr-TR');
    setQuery(upper);
    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (upper.length < 1) {
      setResults([]);
      setShowDropdown(false);
      return;
    }

    debounceRef.current = setTimeout(async () => {
      const data = await searchSkills(upper);
      setResults(data);
      setShowDropdown(true);
    }, 250);
  }

  function selectSkill(skill: { id: string; name: string }) {
    if (selectedSkills.length >= MAX_SKILLS) return;
    if (selectedSkills.find((s) => s.id === skill.id)) return;
    setSelectedSkills([...selectedSkills, skill]);
    setQuery('');
    setResults([]);
    setShowDropdown(false);
  }

  function removeSkill(id: string) {
    setSelectedSkills(selectedSkills.filter((s) => s.id !== id));
  }

  function handleSubmit() {
    const result = schema.safeParse({
      skills:       selectedSkills.map((s) => s.name),
      linkedin_url: linkedin,
    });
    if (!result.success) {
      const fieldErrors: Errors = {};
      for (const issue of result.error.issues) {
        const field = issue.path[0] as keyof Errors;
        if (!fieldErrors[field]) fieldErrors[field] = issue.message;
      }
      setErrors(fieldErrors);
      return;
    }
    setErrors({});
    setServerError('');

    startTransition(async () => {
      const res = await signup({
        ...allData,
        skill_ids:    selectedSkills.map((s) => s.id),
        linkedin_url: linkedin,
      });
      if ('error' in res) {
        setServerError(res.error);
      } else {
        onSuccess();
      }
    });
  }

  const canAddMore = selectedSkills.length < MAX_SKILLS;

  return (
    <div className="flex flex-col gap-4">
      <div className="mb-1">
        <p className="font-nunito font-black text-[1.1rem] text-slate-900">Yeteneklerin</p>
        <p className="text-[0.8rem] text-slate-500 mt-0.5">
          En fazla {MAX_SKILLS} yetenek seçebilirsin.
        </p>
      </div>

      {/* Skill search */}
      <div className="flex flex-col gap-1.5" ref={containerRef}>
        <label className="text-[0.82rem] font-bold text-slate-900">Yetenekler</label>

        {/* Selected tags */}
        {selectedSkills.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {selectedSkills.map((skill) => (
              <span
                key={skill.id}
                className="flex items-center gap-1 bg-blue-100 text-blue-700 text-[0.78rem] font-semibold px-2.5 py-1 rounded-full"
              >
                {toDisplayName(skill.name)}
                <button
                  type="button"
                  onClick={() => removeSkill(skill.id)}
                  className="text-blue-400 hover:text-blue-700 leading-none cursor-pointer bg-transparent border-none p-0"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        )}

        {/* Input */}
        <div className="relative">
          <input
            type="text"
            placeholder={canAddMore ? 'Ara... (en az 2 karakter)' : `${MAX_SKILLS} yetenek seçildi`}
            value={query}
            disabled={!canAddMore}
            onChange={(e) => handleQueryChange(e.target.value)}
            onFocus={() => results.length > 0 && setShowDropdown(true)}
            className={`
              w-full bg-[#f8faff] border-[1.5px] rounded-[12px]
              px-4 py-3 text-[0.95rem] font-jakarta text-slate-900
              placeholder:text-slate-400 outline-none focus:bg-white transition-colors
              disabled:opacity-50 disabled:cursor-not-allowed
              ${errors.skills ? 'border-red-400 focus:border-red-400' : 'border-slate-200 focus:border-blue-600'}
            `}
          />

          {showDropdown && results.length > 0 && (
            <ul className="absolute z-10 w-full mt-1 bg-white border border-slate-200 rounded-[12px] shadow-lg overflow-hidden">
              {results
                .filter((r) => !selectedSkills.find((s) => s.id === r.id))
                .map((skill) => (
                  <li key={skill.id}>
                    <button
                      type="button"
                      onMouseDown={(e) => { e.preventDefault(); selectSkill(skill); }}
                      className="w-full text-left px-4 py-2.5 text-[0.9rem] text-slate-700 hover:bg-blue-50 hover:text-blue-700 transition-colors cursor-pointer"
                    >
                      {toDisplayName(skill.name)}
                    </button>
                  </li>
                ))}
            </ul>
          )}

          {showDropdown && results.length === 0 && query.length >= 2 && (
            <div className="absolute z-10 w-full mt-1 bg-white border border-slate-200 rounded-[12px] shadow-lg px-4 py-3 text-[0.85rem] text-slate-400">
              Sonuç bulunamadı
            </div>
          )}
        </div>

        {errors.skills && <p className="text-[0.75rem] text-red-500">{errors.skills}</p>}
      </div>

      <Field
        id="linkedin"
        label={<>LinkedIn Profil URL <span className="text-blue-600">*</span></>}
        type="url"
        placeholder="https://linkedin.com/in/kullanici"
        value={linkedin}
        error={errors.linkedin_url}
        onChange={(v) => setLinkedin(v)}
      />

      {serverError && (
        <p className="text-[0.8rem] text-red-500 text-center">{serverError}</p>
      )}

      <div className="flex gap-2 mt-1">
        <button
          onClick={onBack}
          disabled={isPending}
          className="flex-none px-5 py-4 rounded-[14px] border-[1.5px] border-slate-200 text-slate-600 font-nunito font-bold text-base hover:bg-slate-50 transition-colors cursor-pointer bg-transparent disabled:opacity-50"
        >
          ← Geri
        </button>
        <button
          onClick={handleSubmit}
          disabled={isPending}
          className="flex-1 py-4 rounded-[14px] bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-nunito font-extrabold text-base transition-colors cursor-pointer border-none"
        >
          {isPending ? 'Kaydediliyor...' : 'Kayıt Ol →'}
        </button>
      </div>
    </div>
  );
}
