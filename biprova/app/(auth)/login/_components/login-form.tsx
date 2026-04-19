'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { z } from 'zod';
import { login } from '@/features/auth/actions';

const loginSchema = z.object({
  email:    z.string().email('Geçerli bir e-posta gir'),
  password: z.string().min(8, 'Şifre en az 8 karakter olmalı'),
});

type FieldKey = 'email' | 'password';

export function LoginForm() {
  const router = useRouter();
  const [values, setValues]           = useState({ email: '', password: '' });
  const [errors, setErrors]           = useState<Partial<Record<FieldKey, string>>>({});
  const [serverError, setServerError] = useState('');
  const [isPending, startTransition]  = useTransition();

  function handleSubmit() {
    const result = loginSchema.safeParse(values);
    if (!result.success) {
      const fieldErrors: Partial<Record<FieldKey, string>> = {};
      for (const issue of result.error.issues) {
        const field = issue.path[0] as FieldKey;
        if (!fieldErrors[field]) fieldErrors[field] = issue.message;
      }
      setErrors(fieldErrors);
      return;
    }
    setErrors({});
    setServerError('');

    startTransition(async () => {
      const res = await login(values);
      if (res && 'error' in res) {
        setServerError(res.error);
      } else {
        router.push('/dashboard');
      }
    });
  }

  return (
    <div className="flex flex-col gap-4">
      <FieldInput
        id="email"
        label="E-posta"
        type="email"
        placeholder="ornek@mail.com"
        value={values.email}
        error={errors.email}
        onChange={(v) => setValues({ ...values, email: v })}
      />
      <FieldInput
        id="password"
        label="Şifre"
        type="password"
        placeholder="••••••••"
        value={values.password}
        error={errors.password}
        onChange={(v) => setValues({ ...values, password: v })}
      />

      {serverError && (
        <p className="text-[0.8rem] text-red-500 text-center">{serverError}</p>
      )}

      <button
        type="button"
        onClick={handleSubmit}
        onTouchEnd={(e) => { e.preventDefault(); handleSubmit(); }}
        disabled={isPending}
        className="
          w-full mt-1 py-4 rounded-[14px]
          bg-blue-600 hover:bg-blue-700 active:bg-blue-800 disabled:opacity-60
          text-white font-nunito font-extrabold text-base
          transition-colors cursor-pointer border-none touch-manipulation
        "
      >
        {isPending ? 'Giriş yapılıyor...' : 'Giriş Yap →'}
      </button>
    </div>
  );
}

function FieldInput({
  id, label, type, placeholder, value, error, onChange,
}: {
  id: string;
  label: string;
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
