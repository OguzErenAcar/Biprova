"use client";

import { useState, useTransition } from "react";
import { z } from "zod";
import { joinWaitlist } from "@/features/waitlist/actions";

const emailSchema = z.string().email();

interface WaitlistFormProps {
  variant?: "hero" | "cta";
}

interface ToastState {
  status: "joined" | "already";
  position: number;
}

function WaitlistToast({ toast, onClose }: { toast: ToastState; onClose: () => void }) {
  const isFirst100 = toast.position <= 100;
  const isAlready  = toast.status === "already";

  return (
    <div className="fixed top-[65px] left-1/2 -translate-x-1/2 z-[200] w-[calc(100%-2rem)] max-w-[420px] animate-bp-fade-up">
      <div className="flex items-start gap-3 bg-white border border-slate-200 rounded-2xl px-5 py-4 shadow-xl">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className={`w-2 h-2 rounded-full flex-shrink-0 ${isAlready ? "bg-amber-400" : "bg-green-500"}`} />
            <p className="font-nunito font-black text-[0.95rem] text-slate-900">
              {isAlready ? "Zaten listedeydin!" : "Kayıt Edildi!"}
            </p>
          </div>

          {isAlready ? (
            <p className="text-[0.82rem] text-slate-500 mt-0.5">
              Bu e-posta zaten bekleme listesinde. Hazır olunca haber vereceğiz.
            </p>
          ) : isFirst100 ? (
            <div className="flex items-center gap-1.5 mt-1.5">
              <span className="text-[0.85rem]">🏅</span>
              <p className="text-[0.82rem] text-blue-600 font-semibold">
                İlk 100&apos;ün içindesin — erken erişim rozeti kazandın!
              </p>
            </div>
          ) : (
            <p className="text-[0.82rem] text-slate-500 mt-0.5">
              Hazır olunca sana haber vereceğiz.
            </p>
          )}

          <p className="text-[0.75rem] text-slate-400 mt-1">#{toast.position}. kayıt</p>
        </div>

        <button
          onClick={onClose}
          className="text-slate-400 hover:text-slate-600 transition-colors text-lg leading-none cursor-pointer bg-transparent border-none p-0 flex-shrink-0"
        >
          ×
        </button>
      </div>
    </div>
  );
}

export function WaitlistForm({ variant = "hero" }: WaitlistFormProps) {
  const [email, setEmail]       = useState("");
  const [hasError, setHasError] = useState(false);
  const [serverError, setServerError] = useState("");
  const [toast, setToast]       = useState<ToastState | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleSubmit() {
    const result = emailSchema.safeParse(email);
    if (!result.success) {
      setHasError(true);
      setTimeout(() => setHasError(false), 1200);
      return;
    }

    setServerError("");
    startTransition(async () => {
      const res = await joinWaitlist(email);
      if ("error" in res) {
        setServerError(res.error);
        return;
      }
      setEmail("");
      setToast({ status: res.status, position: res.position });
    });
  }

  return (
    <>
      {toast && <WaitlistToast toast={toast} onClose={() => setToast(null)} />}

      <div className="flex max-w-[440px] mx-auto rounded-[14px] overflow-hidden shadow-[0_8px_30px_rgba(37,99,235,0.18)]">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
          placeholder="E-posta adresin"
          disabled={isPending}
          className={`flex-1 border-none outline-none bg-white font-jakarta text-[0.95rem] px-[1.3rem] py-4 text-slate-900 placeholder:text-slate-400 transition-[outline] disabled:opacity-60 ${hasError ? "outline outline-2 outline-red-400" : ""}`}
        />
        <button
          onClick={handleSubmit}
          disabled={isPending}
          className={`font-nunito font-extrabold text-[0.9rem] px-[1.4rem] py-4 text-white whitespace-nowrap transition-colors cursor-pointer border-none disabled:opacity-60 ${variant === "cta" ? "bg-slate-900 hover:bg-slate-800" : "bg-blue-600 hover:bg-blue-700"}`}
        >
          {isPending ? "..." : variant === "cta" ? "Gir →" : "Katıl →"}
        </button>
      </div>

      {serverError && (
        <p className="text-[0.8rem] text-red-500 text-center mt-2">{serverError}</p>
      )}
    </>
  );
}
