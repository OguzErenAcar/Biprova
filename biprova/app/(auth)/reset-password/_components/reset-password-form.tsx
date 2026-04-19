'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { z } from 'zod';
import { updatePassword } from '@/features/auth/actions';

const schema = z.object({
  password:        z.string().min(8, 'Şifre en az 8 karakter olmalı').max(128),
  passwordConfirm: z.string(),
}).refine((d) => d.password === d.passwordConfirm, {
  message: 'Şifreler eşleşmiyor',
  path: ['passwordConfirm'],
});

export function ResetPasswordForm() {
  const router = useRouter();
  const [values, setValues]          = useState({ password: '', passwordConfirm: '' });
  const [errors, setErrors]          = useState<{ password?: string; passwordConfirm?: string }>({});
  const [serverError, setServerError] = useState('');
  const [isPending, startTransition]  = useTransition();

  function handleSubmit() {
    const result = schema.safeParse(values);
    if (!result.success) {
      const fieldErrors: { password?: string; passwordConfirm?: string } = {};
      for (const issue of result.error.issues) {
        const field = issue.path[0] as 'password' | 'passwordConfirm';
        if (!fieldErrors[field]) fieldErrors[field] = issue.message;
      }
      setErrors(fieldErrors);
      return;
    }
    setErrors({});
    setServerError('');

    startTransition(async () => {
      const res = await updatePassword(values.password);
      if ('error' in res) {
        setServerError(res.error);
      } else {
        router.push('/dashboard');
      }
    });
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <label htmlFor="password" className="text-[0.82rem] font-bold text-slate-900">
          Yeni Şifre
        </label>
        <input
          id="password"
          type="password"
          placeholder="En az 8 karakter"
          value={values.password}
          onChange={(e) => setValues({ ...values, password: e.target.value })}
          disabled={isPending}
          className={`
            w-full bg-[#f8faff] border-[1.5px] rounded-[12px]
            px-4 py-3 text-[0.95rem] font-jakarta text-slate-900
            placeholder:text-slate-400 outline-none focus:bg-white transition-colors
            ${errors.password ? 'border-red-400 focus:border-red-400' : 'border-slate-200 focus:border-blue-600'}
          `}
        />
        {errors.password && <p className="text-[0.75rem] text-red-500">{errors.password}</p>}
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="passwordConfirm" className="text-[0.82rem] font-bold text-slate-900">
          Şifre Tekrar
        </label>
        <input
          id="passwordConfirm"
          type="password"
          placeholder="••••••••"
          value={values.passwordConfirm}
          onChange={(e) => setValues({ ...values, passwordConfirm: e.target.value })}
          disabled={isPending}
          className={`
            w-full bg-[#f8faff] border-[1.5px] rounded-[12px]
            px-4 py-3 text-[0.95rem] font-jakarta text-slate-900
            placeholder:text-slate-400 outline-none focus:bg-white transition-colors
            ${errors.passwordConfirm ? 'border-red-400 focus:border-red-400' : 'border-slate-200 focus:border-blue-600'}
          `}
        />
        {errors.passwordConfirm && <p className="text-[0.75rem] text-red-500">{errors.passwordConfirm}</p>}
      </div>

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
        {isPending ? 'Kaydediliyor...' : 'Şifreyi Güncelle →'}
      </button>
    </div>
  );
}
