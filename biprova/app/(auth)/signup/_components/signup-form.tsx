'use client';

import { useState, useTransition } from 'react';
import { z } from 'zod';
import { signup } from '@/features/auth/actions';

const signupSchema = z.object({
  name:     z.string().min(2, 'Ad en az 2 karakter olmalı'),
  email:    z.string().email('Geçerli bir e-posta gir'),
  password: z.string().min(8, 'Şifre en az 8 karakter olmalı'),
  linkedin: z
    .string()
    .url('Geçerli bir URL gir')
    .refine((v) => v.includes('linkedin.com/in/'), 'linkedin.com/in/ içermeli'),
});

type Field = 'name' | 'email' | 'password' | 'linkedin';

export function SignupForm() {
  const [values, setValues]     = useState({ name: '', email: '', password: '', linkedin: '' });
  const [errors, setErrors]     = useState<Partial<Record<Field, string>>>({});
  const [serverError, setServerError] = useState('');
  const [success, setSuccess]   = useState(false);
  const [isPending, startTransition] = useTransition();

  function handleSubmit() {
    const result = signupSchema.safeParse(values);
    if (!result.success) {
      const fieldErrors: Partial<Record<Field, string>> = {};
      for (const issue of result.error.issues) {
        const field = issue.path[0] as Field;
        if (!fieldErrors[field]) fieldErrors[field] = issue.message;
      }
      setErrors(fieldErrors);
      return;
    }
    setErrors({});
    setServerError('');

    startTransition(async () => {
      const res = await signup({
        name:         values.name,
        email:        values.email,
        password:     values.password,
        linkedin_url: values.linkedin,
      });
      if ('error' in res) {
        setServerError(res.error);
      } else {
        setSuccess(true);
      }
    });
  }

  if (success) {
    return (
      <div className="flex flex-col items-center text-center py-4 gap-3">
        <div className="text-5xl">📬</div>
        <p className="font-nunito font-black text-xl text-slate-900">E-postanı kontrol et!</p>
        <p className="text-[0.85rem] text-slate-500 leading-relaxed">
          Doğrulama linki gönderildi.<br />Linke tıklayınca hesabın aktif olur.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <Field
        id="name"
        label="Ad Soyad"
        type="text"
        placeholder="Ahmet Yılmaz"
        value={values.name}
        error={errors.name}
        onChange={(v) => setValues({ ...values, name: v })}
      />
      <Field
        id="email"
        label="E-posta"
        type="email"
        placeholder="ornek@mail.com"
        value={values.email}
        error={errors.email}
        onChange={(v) => setValues({ ...values, email: v })}
      />
      <Field
        id="password"
        label="Şifre"
        type="password"
        placeholder="En az 8 karakter"
        value={values.password}
        error={errors.password}
        onChange={(v) => setValues({ ...values, password: v })}
      />
      <Field
        id="linkedin"
        label={<>LinkedIn Profil URL <span className="text-blue-600">*</span></>}
        type="url"
        placeholder="https://linkedin.com/in/kullanici"
        value={values.linkedin}
        error={errors.linkedin}
        onChange={(v) => setValues({ ...values, linkedin: v })}
      />

      {serverError && (
        <p className="text-[0.8rem] text-red-500 text-center">{serverError}</p>
      )}

      <button
        onClick={handleSubmit}
        disabled={isPending}
        className="
          w-full mt-1 py-4 rounded-[14px]
          bg-blue-600 hover:bg-blue-700 disabled:opacity-60
          text-white font-nunito font-extrabold text-base
          transition-colors cursor-pointer border-none
        "
      >
        {isPending ? 'Kaydediliyor...' : 'Kayıt Ol →'}
      </button>
    </div>
  );
}

function Field({
  id, label, type, placeholder, value, error, onChange,
}: {
  id: string;
  label: React.ReactNode;
  type: string;
  placeholder: string;
  value: string;
  error?: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-[0.82rem] font-bold text-slate-900">
        {label}
      </label>
      <input
        id={id}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`
          w-full bg-[#f8faff] border-[1.5px] rounded-[12px]
          px-4 py-3 text-[0.95rem] font-jakarta text-slate-900
          placeholder:text-slate-400 outline-none
          focus:bg-white transition-colors
          ${error ? 'border-red-400 focus:border-red-400' : 'border-slate-200 focus:border-blue-600'}
        `}
      />
      {error && <p className="text-[0.75rem] text-red-500">{error}</p>}
    </div>
  );
}
