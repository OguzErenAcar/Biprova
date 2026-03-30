"use client";

import { useRouter } from 'next/navigation';

interface Props {
  teamName: string;
  teamStatus: string;
  projectCount: number;
  isLeader: boolean;
  isMember: boolean;
  onLeave: () => void;
}

const STATUS_LABEL: Record<string, { label: string; className: string }> = {
  active:     { label: '● Aktif',       className: 'bg-green-50 text-green-700 border-green-200' },
  pending:    { label: '● Kuruldu',     className: 'bg-yellow-50 text-yellow-700 border-yellow-200' },
  no_project: { label: '⚠ Projesi Yok', className: 'bg-orange-50 text-orange-700 border-orange-200' },
  disbanded:  { label: '● Dağıtıldı',   className: 'bg-red-50 text-red-600 border-red-200' },
};

export function TeamTopbar({ teamName, teamStatus, projectCount, isLeader, isMember, onLeave }: Props) {
  const router = useRouter();
  const status = STATUS_LABEL[teamStatus] ?? STATUS_LABEL.pending;

  return (
    <div
      id="team-topbar"
      className="sticky top-0 z-40 bg-slate-100/92 backdrop-blur-[12px] border-b border-slate-200 px-6 py-[0.8rem] flex items-center gap-3"
    >
      <button
        onClick={() => router.back()}
        className="text-[0.82rem] font-bold text-slate-400 hover:text-blue-600 transition-colors cursor-pointer"
      >
        ← Geri
      </button>

      <span className="font-nunito font-black text-[1rem] text-slate-900">{teamName}</span>

      <span className={`text-[0.7rem] font-bold px-2.5 py-[0.2rem] rounded-full border-[1.5px] ${status.className}`}>
        {status.label}
      </span>

      {projectCount > 0 && (
        <span className="text-[0.7rem] font-bold px-2.5 py-[0.2rem] rounded-full border-[1.5px] bg-slate-50 text-slate-500 border-slate-200">
          📌 {projectCount} Proje
        </span>
      )}

      <div className="ml-auto flex items-center gap-2">
        {isMember && !isLeader && (
          <button
            onClick={onLeave}
            className="bg-red-50 text-red-500 border-[1.5px] border-red-200 rounded-[9px] font-nunito font-extrabold text-[0.82rem] px-4 py-[0.45rem] cursor-pointer transition-all hover:bg-red-100"
          >
            Ekipten Ayrıl
          </button>
        )}
      </div>
    </div>
  );
}
