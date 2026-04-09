'use client';

import { useState, useTransition, useRef, useCallback } from 'react';
import { z } from 'zod';
import { Field } from './field';
import { checkEmailAvailable } from '@/features/auth/actions';

const schema = z.object({
  name:  z.string().min(2, 'Ad en az 2 karakter olmalı'),
  email: z.string().email('Geçerli bir e-posta gir'),
  password: z
    .string()
    .min(8, 'Şifre en az 8 karakter olmalı')
    .regex(/[0-9]/, 'En az 1 rakam içermeli')
    .regex(/[^a-zA-Z0-9]/, 'En az 1 özel karakter içermeli (!@#$ vb.)'),
});

type Values = z.infer<typeof schema>;
type Errors = Partial<Record<keyof Values, string>>;

interface Props {
  initial: Values;
  onNext: (values: Values) => void;
}

export function SignupStep1({ initial, onNext }: Props) {
  const [values, setValues] = useState<Values>(initial);
  const [errors, setErrors] = useState<Errors>({});
  const [isPending, startTransition] = useTransition();

  function handleNext() {
    const result = schema.safeParse(values);
    if (!result.success) {
      const fieldErrors: Errors = {};
      for (const issue of result.error.issues) {
        const field = issue.path[0] as keyof Values;
        if (!fieldErrors[field]) fieldErrors[field] = issue.message;
      }
      setErrors(fieldErrors);
      return;
    }
    setErrors({});

    startTransition(async () => {
      const res = await checkEmailAvailable(values.email);
      if ('error' in res) {
        setErrors({ email: res.error });
        return;
      }
      onNext(result.data);
    });
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="mb-1">
        <p className="font-nunito font-black text-[1.1rem] text-slate-900">Hesap bilgilerin</p>
        <p className="text-[0.8rem] text-slate-500 mt-0.5">Temel bilgilerle başlayalım.</p>
      </div>

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

      <div className="flex flex-col gap-1.5">
        <Field
          id="password"
          label="Şifre"
          type="password"
          placeholder="En az 8 karakter"
          value={values.password}
          error={errors.password}
          onChange={(v) => setValues({ ...values, password: v })}
        />
        <PasswordHints password={values.password} />
      </div>

      <button
        onClick={handleNext}
        disabled={isPending}
        className="w-full mt-1 py-4 rounded-[14px] bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-nunito font-extrabold text-base transition-colors cursor-pointer border-none"
      >
        {isPending ? 'Kontrol ediliyor...' : 'Devam Et →'}
      </button>
    </div>
  );
}

function PasswordHints({ password }: { password: string }) {
  const rules = [
    { label: 'En az 8 karakter',         met: password.length >= 8 },
    { label: 'En az 1 rakam',            met: /[0-9]/.test(password) },
    { label: 'En az 1 özel karakter',    met: /[^a-zA-Z0-9]/.test(password) },
  ];

  if (!password) return null;

  return (
    <div className="flex flex-col gap-1 px-1">
      {rules.map((rule) => (
        <div key={rule.label} className="flex items-center gap-1.5">
          <span className={`text-[0.7rem] ${rule.met ? 'text-green-500' : 'text-slate-300'}`}>
            {rule.met ? '✓' : '○'}
          </span>
          <span className={`text-[0.72rem] ${rule.met ? 'text-green-600' : 'text-slate-400'}`}>
            {rule.label}
          </span>
        </div>
      ))}
    </div>
  );
}
