"use client";

import { useState } from "react";
import { z } from "zod";

const emailSchema = z.string().email();

interface WaitlistFormProps {
  variant?: "hero" | "cta";
}

export function WaitlistForm({ variant = "hero" }: WaitlistFormProps) {
  const [email, setEmail] = useState("");
  const [hasError, setHasError] = useState(false);
  const [success, setSuccess] = useState(false);

  function handleSubmit() {
    const result = emailSchema.safeParse(email);
    if (!result.success) {
      setHasError(true);
      setTimeout(() => setHasError(false), 1200);
      return;
    }
    setSuccess(true);
    setEmail("");
  }

  if (success) {
    const color = variant === "cta" ? "text-cyan-300" : "text-green-500";
    return (
      <p className={`${color} text-sm font-semibold mt-3.5`}>
        🎉 Harika! Hazır olunca seni arayacağız.
      </p>
    );
  }

  return (
    <div className="flex max-w-[440px] mx-auto rounded-[14px] overflow-hidden shadow-[0_8px_30px_rgba(37,99,235,0.18)]">
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
        placeholder="E-posta adresin"
        className={`flex-1 border-none outline-none bg-white font-jakarta text-[0.95rem] px-[1.3rem] py-4 text-slate-900 placeholder:text-slate-400 transition-[outline] ${hasError ? "outline outline-2 outline-red-400" : ""}`}
      />
      <button
        onClick={handleSubmit}
        className={`font-nunito font-extrabold text-[0.9rem] px-[1.4rem] py-4 text-white whitespace-nowrap transition-colors cursor-pointer border-none ${variant === "cta" ? "bg-slate-900 hover:bg-slate-800" : "bg-blue-600 hover:bg-blue-700"}`}
      >
        {variant === "cta" ? "Gir →" : "Katıl →"}
      </button>
    </div>
  );
}
