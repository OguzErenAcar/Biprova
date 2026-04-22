'use client';

import { useState } from 'react';
import { z } from 'zod';

const emailSchema = z.string().email();

export function WaitlistFormCard() {
  const [email, setEmail] = useState('');
  const [hasError, setHasError] = useState(false);
  const [success, setSuccess] = useState(false);

  function handleSubmit() {
    const result = emailSchema.safeParse(email);
    if (!result.success) {
      setHasError(true);
      setTimeout(() => setHasError(false), 1200);
      return;
    }
    // TODO (Faz 2): Supabase waitlist insert
    setSuccess(true);
    setEmail('');
  }

  return (
    <div className="
      bg-white border-[1.5px] border-slate-200
      rounded-[24px] p-10
      w-full max-w-[460px]
      shadow-[0_8px_40px_rgba(37,99,235,0.1)]
      animate-[fadeUp_0.4s_0.15s_ease_both]
      mb-12
    ">
      {success ? (
        <div className="flex flex-col items-center text-center py-4">
          <div className="text-5xl mb-4">🎉</div>
          <div className="font-nunito font-black text-xl text-slate-900 mb-2">Listeye alındın!</div>
          <p className="text-[0.85rem] text-slate-600 leading-relaxed">
            Platform açıldığında seni haberdar edeceğiz.<br />Şimdilik arkadaşlarına anlat!
          </p>
        </div>
      ) : (
        <>
          <label htmlFor="waitlist-email" className="block text-[0.82rem] font-bold text-slate-900 mb-2">
            E-posta adresin
          </label>
          <div className="flex rounded-[14px] overflow-hidden shadow-[0_4px_20px_rgba(37,99,235,0.15)] mb-4 max-sm:flex-col">
            <input
              id="waitlist-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
              placeholder="ornek@mail.com"
              autoComplete="email"
              className={`
                flex-1 bg-[#f8faff] font-jakarta text-[0.95rem] px-5 py-4
                text-slate-900 placeholder:text-slate-500 outline-none
                border-[1.5px] border-r-0 rounded-l-[14px]
                focus:border-blue-600 focus:bg-white
                max-sm:border-r-[1.5px] max-sm:border-b-0 max-sm:rounded-l-[14px] max-sm:rounded-tr-[14px] max-sm:rounded-bl-none
                transition-colors
                ${hasError ? 'border-red-400' : 'border-slate-200'}
              `}
            />
            <button
              onClick={handleSubmit}
              className="
                bg-blue-600 hover:bg-blue-700
                text-white font-nunito font-extrabold text-[0.9rem]
                px-[1.4rem] py-4 whitespace-nowrap border-none cursor-pointer
                rounded-r-[14px]
                max-sm:rounded-r-none max-sm:rounded-b-[14px]
                transition-colors
              "
            >
              Listeye Katıl →
            </button>
          </div>
          <p className="text-[0.76rem] text-slate-600 flex items-center gap-1.5">
            🔒 Spam yok. İstediğin zaman çıkabilirsin.
          </p>
        </>
      )}
    </div>
  );
}
