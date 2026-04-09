'use client';

import { useState, useEffect } from 'react';
import { SignupStep1 } from './signup-step1';
import { SignupStep2 } from './signup-step2';
import { SignupStep3 } from './signup-step3';
import { SignupStep4 } from './signup-step4';
import { getCities } from '@/features/auth/actions';

interface FormData {
  name: string;
  email: string;
  password: string;
  city: string;
  is_remote: boolean;
}

const INITIAL: FormData = {
  name: '',
  email: '',
  password: '',
  city: '',
  is_remote: false,
};

export function SignupForm() {
  const [step, setStep]       = useState<1 | 2 | 3>(1);
  const [data, setData]       = useState<FormData>(INITIAL);
  const [success, setSuccess] = useState(false);
  const [cities, setCities]   = useState<{ id: string; name: string }[]>([]);

  useEffect(() => {
    getCities().then(setCities);
  }, []);

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
    <div className="flex flex-col gap-5">
      {/* Progress dots */}
      <div className="flex items-center justify-center gap-2">
        {([1, 2, 3] as const).map((s) => (
          <div
            key={s}
            className={`rounded-full transition-all duration-300 ${
              s === step
                ? 'w-6 h-2 bg-blue-600'
                : s < step
                ? 'w-2 h-2 bg-blue-300'
                : 'w-2 h-2 bg-slate-200'
            }`}
          />
        ))}
      </div>

      {step === 1 && (
        <SignupStep1
          initial={{ name: data.name, email: data.email, password: data.password }}
          onNext={(values) => {
            setData({ ...data, ...values });
            setStep(2);
          }}
        />
      )}

      {step === 2 && (
        <SignupStep2
          initial={{ city: data.city, is_remote: data.is_remote }}
          cities={cities}
          onNext={(values) => {
            setData({ ...data, ...values });
            setStep(3);
          }}
          onBack={() => setStep(1)}
        />
      )}

      {step === 3 && (
        <SignupStep3
          allData={data}
          onBack={() => setStep(2)}
          onSuccess={() => setSuccess(true)}
        />
      )}
    </div>
  );
}
