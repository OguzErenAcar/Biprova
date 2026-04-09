import type { ReactNode } from 'react';

interface FieldProps {
  id: string;
  label: ReactNode;
  type: string;
  placeholder: string;
  value: string;
  error?: string;
  hint?: string;
  onChange: (v: string) => void;
  onBlur?: () => void;
}

export function Field({ id, label, type, placeholder, value, error, hint, onChange, onBlur }: FieldProps) {
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
        onBlur={onBlur}
        className={`
          w-full bg-[#f8faff] border-[1.5px] rounded-[12px]
          px-4 py-3 text-[0.95rem] font-jakarta text-slate-900
          placeholder:text-slate-400 outline-none
          focus:bg-white transition-colors
          ${error ? 'border-red-400 focus:border-red-400' : hint ? 'border-green-400 focus:border-green-500' : 'border-slate-200 focus:border-blue-600'}
        `}
      />
      {error && <p className="text-[0.75rem] text-red-500">{error}</p>}
      {!error && hint && <p className="text-[0.75rem] text-green-600">{hint}</p>}
    </div>
  );
}
