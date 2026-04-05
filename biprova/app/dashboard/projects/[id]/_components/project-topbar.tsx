"use client";

import { useRouter } from 'next/navigation';

const STATUS_LABEL: Record<string, { label: string; className: string }> = {
  open:      { label: '● Rol Aranıyor', className: 'bg-blue-50 text-blue-700 border-blue-200' },
  full:      { label: '● Ekip Tam',     className: 'bg-yellow-50 text-yellow-700 border-yellow-200' },
  active:    { label: '✓ Aktif',        className: 'bg-green-50 text-green-700 border-green-200' },
  completed: { label: '● Tamamlandı',   className: 'bg-slate-50 text-slate-500 border-slate-200' },
  cancelled: { label: '● İptal',        className: 'bg-red-50 text-red-500 border-red-200' },
};

interface Props {
  title: string;
  status: string;
  hasTeam: boolean;
}

export function ProjectTopbar({ title, status, hasTeam }: Props) {
  const router = useRouter();
  const s = STATUS_LABEL[status] ?? STATUS_LABEL.open;

  return (
    <div
      id="project-topbar"
      className="sticky top-0 z-40 bg-slate-100/92 backdrop-blur-[12px] border-b border-slate-200 px-6 py-[0.8rem] flex items-center gap-3"
    >
      <button
        onClick={() => router.back()}
        className="text-[0.82rem] font-bold text-slate-400 hover:text-blue-600 transition-colors cursor-pointer"
      >
        ← Geri
      </button>

      <span className="font-nunito font-black text-[1rem] text-slate-900">{title}</span>

      <span className={`text-[0.7rem] font-bold px-2.5 py-[0.2rem] rounded-full border-[1.5px] ${s.className}`}>
        {s.label}
      </span>

      <div className="ml-auto flex items-center gap-2">
        <button
          disabled={!hasTeam}
          title={!hasTeam ? 'Ekip kurulduktan sonra aktif olur' : undefined}
          className="w-[34px] h-[34px] rounded-[9px] bg-white border-[1.5px] border-slate-200 flex items-center justify-center text-[0.9rem] transition-colors disabled:opacity-30 disabled:cursor-not-allowed hover:enabled:border-blue-600 cursor-pointer"
        >
          🔔
        </button>
        <button
          disabled={!hasTeam}
          title={!hasTeam ? 'Ekip kurulduktan sonra aktif olur' : undefined}
          className="w-[34px] h-[34px] rounded-[9px] bg-white border-[1.5px] border-slate-200 flex items-center justify-center text-[0.9rem] transition-colors disabled:opacity-30 disabled:cursor-not-allowed hover:enabled:border-blue-600 cursor-pointer"
        >
          ⚙️
        </button>
      </div>
    </div>
  );
}
