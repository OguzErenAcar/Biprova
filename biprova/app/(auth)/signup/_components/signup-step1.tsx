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

type EmailStatus = 'idle' | 'checking' | 'available' | 'taken';

export function SignupStep1({ initial, onNext }: Props) {
  const [values, setValues]           = useState<Values>(initial);
  const [errors, setErrors]           = useState<Errors>({});
  const [isPending, startTransition]  = useTransition();
  const [emailStatus, setEmailStatus] = useState<EmailStatus>('idle');
  const debounceRef                   = useRef<ReturnType<typeof setTimeout> | null>(null);
  const checkedEmailRef               = useRef<string>('');

  const checkEmail = useCallback(async (email: string) => {
    const emailSchema = z.string().email();
    if (!emailSchema.safeParse(email).success) return;

    setEmailStatus('checking');
    setErrors((prev) => ({ ...prev, email: undefined }));

    const res = await checkEmailAvailable(email);
    checkedEmailRef.current = email;

    if ('error' in res) {
      setEmailStatus('taken');
      setErrors((prev) => ({ ...prev, email: res.error }));
    } else {
      setEmailStatus('available');
    }
  }, []);

  function handleEmailChange(email: string) {
    setValues((prev) => ({ ...prev, email }));
    setEmailStatus('idle');
    setErrors((prev) => ({ ...prev, email: undefined }));

    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => checkEmail(email), 700);
  }

  function handleEmailBlur() {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (values.email && values.email !== checkedEmailRef.current) {
      checkEmail(values.email);
    }
  }

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

    // Zaten kontrol edildi ve müsaitse direkt ilerle
    if (emailStatus === 'available' && checkedEmailRef.current === values.email) {
      onNext(result.data);
      return;
    }

    startTransition(async () => {
      const res = await checkEmailAvailable(values.email);
      if ('error' in res) {
        setEmailStatus('taken');
        setErrors({ email: res.error });
        return;
      }
      setEmailStatus('available');
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
        label={
          <span className="flex items-center gap-1.5">
            E-posta
            {emailStatus === 'checking' && (
              <span className="text-[0.7rem] text-slate-400 font-normal">Kontrol ediliyor...</span>
            )}
          </span>
        }
        type="email"
        placeholder="ornek@mail.com"
        value={values.email}
        error={errors.email}
        hint={emailStatus === 'available' ? '✓ Kullanılabilir' : undefined}
        onChange={handleEmailChange}
        onBlur={handleEmailBlur}
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
        type="button"
        onClick={handleNext}
        disabled={isPending}
        className="w-full mt-1 py-4 rounded-[14px] bg-blue-600 hover:bg-blue-700 active:bg-blue-800 disabled:opacity-60 text-white font-nunito font-extrabold text-base transition-colors cursor-pointer border-none touch-manipulation"
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
