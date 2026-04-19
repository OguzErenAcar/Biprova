'use client';

import { useState, useTransition } from 'react';
import { z } from 'zod';
import { requestPasswordReset } from '@/features/auth/actions';

const schema = z.object({
  email: z.string().email('Geçerli bir e-posta gir'),
});

export function ForgotPasswordForm() {
  const [email, setEmail]           = useState('');
  const [emailError, setEmailError] = useState('');
  const [serverMsg, setServerMsg]   = useState('');
  const [isError, setIsError]       = useState(false);
  const [isPending, startTransition] = useTransition();

  function handleSubmit() {
    const result = schema.safeParse({ email });
    if (!result.success) {
      setEmailError(result.error.issues[0]?.message ?? 'Geçersiz e-posta');
      return;
    }
    setEmailError('');
    setServerMsg('');

    startTransition(async () => {
      const res = await requestPasswordReset(email);
      if ('error' in res) {
        setIsError(true);
        setServerMsg(res.error);
      } else {
        setIsError(false);
        setServerMsg('Eğer bu e-posta kayıtlıysa, sıfırlama bağlantısı gönderildi. Gelen kutunuzu kontrol edin.');
      }
    });
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <label htmlFor="email" className="text-[0.82rem] font-bold text-slate-900">
          E-posta
        </label>
        <input
          id="email"
          type="email"
          placeholder="ornek@mail.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={isPending}
          className={`
            w-full bg-[#f8faff] border-[1.5px] rounded-[12px]
            px-4 py-3 text-[0.95rem] font-jakarta text-slate-900
            placeholder:text-slate-400 outline-none
            focus:bg-white transition-colors
            ${emailError ? 'border-red-400 focus:border-red-400' : 'border-slate-200 focus:border-blue-600'}
          `}
        />
        {emailError && <p className="text-[0.75rem] text-red-500">{emailError}</p>}
      </div>

      {serverMsg && (
        <p className={`text-[0.8rem] text-center ${isError ? 'text-red-500' : 'text-green-600'}`}>
          {serverMsg}
        </p>
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
        {isPending ? 'Gönderiliyor...' : 'Sıfırlama Bağlantısı Gönder →'}
      </button>
    </div>
  );
}
