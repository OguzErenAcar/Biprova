'use client';

import { useState } from 'react';
import { z } from 'zod';

const schema = z.object({
  city:      z.string().min(2, 'Şehir en az 2 karakter olmalı'),
  is_remote: z.boolean(),
});

type Values = z.infer<typeof schema>;
type Errors = Partial<Record<'city', string>>;

interface Props {
  initial: Values;
  cities: { id: string; name: string }[];
  onNext: (values: Values) => void;
  onBack: () => void;
}

export function SignupStep2({ initial, cities, onNext, onBack }: Props) {
  const [values, setValues] = useState<Values>(initial);
  const [errors, setErrors] = useState<Errors>({});

  function handleNext() {
    const result = schema.safeParse(values);
    if (!result.success) {
      const fieldErrors: Errors = {};
      for (const issue of result.error.issues) {
        const field = issue.path[0] as 'city';
        if (!fieldErrors[field]) fieldErrors[field] = issue.message;
      }
      setErrors(fieldErrors);
      return;
    }
    setErrors({});
    onNext(result.data);
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="mb-1">
        <p className="font-nunito font-black text-[1.1rem] text-slate-900">Neredesin?</p>
        <p className="text-[0.8rem] text-slate-500 mt-0.5">Ekip kurarken konum önemli.</p>
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="city" className="text-[0.82rem] font-bold text-slate-900">Şehir</label>
        <select
          id="city"
          value={values.city}
          onChange={(e) => setValues({ ...values, city: e.target.value })}
          className={`
            w-full bg-[#f8faff] border-[1.5px] rounded-[12px]
            px-4 py-3 text-[0.95rem] font-jakarta text-slate-900
            outline-none focus:bg-white transition-colors appearance-none cursor-pointer
            ${errors.city ? 'border-red-400 focus:border-red-400' : 'border-slate-200 focus:border-blue-600'}
            ${values.city === '' ? 'text-slate-400' : 'text-slate-900'}
          `}
        >
          <option value="" disabled>Şehir seç...</option>
          {cities.length === 0 && (
            <option disabled>Yükleniyor...</option>
          )}
          {cities.map((c) => (
            <option key={c.id} value={c.name}>{c.name}</option>
          ))}
        </select>
        {errors.city && <p className="text-[0.75rem] text-red-500">{errors.city}</p>}
      </div>

      <button
        type="button"
        onClick={() => setValues({ ...values, is_remote: !values.is_remote })}
        className={`
          flex items-center justify-between w-full px-4 py-3.5
          rounded-[12px] border-[1.5px] transition-colors cursor-pointer
          ${values.is_remote
            ? 'bg-blue-50 border-blue-400'
            : 'bg-[#f8faff] border-slate-200 hover:border-slate-300'
          }
        `}
      >
        <div className="flex items-center gap-3 min-w-0 flex-1">
          <span className="text-[1.2rem] flex-shrink-0">🌐</span>
          <div className="text-left min-w-0">
            <p className={`text-[0.9rem] font-semibold ${values.is_remote ? 'text-blue-700' : 'text-slate-700'}`}>
              Uzaktan çalışabilirim
            </p>
            <p className="text-[0.75rem] text-slate-400 truncate">Farklı şehirlerden ekip üyeleri kabul ederim</p>
          </div>
        </div>
        <div className={`
          w-11 h-6 rounded-full transition-colors flex-shrink-0 relative
          ${values.is_remote ? 'bg-blue-600' : 'bg-slate-200'}
        `}>
          <span className={`
            absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform
            ${values.is_remote ? 'translate-x-[22px]' : 'translate-x-0'}
          `} />
        </div>
      </button>

      <div className="flex gap-2 mt-1">
        <button
          onClick={onBack}
          className="flex-none px-5 py-4 rounded-[14px] border-[1.5px] border-slate-200 text-slate-600 font-nunito font-bold text-base hover:bg-slate-50 transition-colors cursor-pointer bg-transparent"
        >
          ← Geri
        </button>
        <button
          onClick={handleNext}
          className="flex-1 py-4 rounded-[14px] bg-blue-600 hover:bg-blue-700 text-white font-nunito font-extrabold text-base transition-colors cursor-pointer border-none"
        >
          Devam Et →
        </button>
      </div>
    </div>
  );
}
