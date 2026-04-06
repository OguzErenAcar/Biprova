"use client";

import { useRouter } from 'next/navigation';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

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

export function ProjectTopbar({ title, status }: Props) {
  const router = useRouter();
  const s = STATUS_LABEL[status] ?? STATUS_LABEL.open;

  return (
    <div
      id="project-topbar"
      className="sticky top-0 z-40 bg-slate-100/92 backdrop-blur-[12px] border-b border-slate-200 px-6 py-[0.8rem] flex items-center gap-3"
    >
      <Button
        variant="ghost"
        size="sm"
        onClick={() => router.back()}
        className="text-[0.82rem] font-bold text-slate-400 hover:text-blue-600 h-auto px-2 py-1"
      >
        ← Geri
      </Button>

      <span className="font-nunito font-black text-[1rem] text-slate-900">{title}</span>

      <Badge variant="outline" className={`text-[0.7rem] font-bold ${s.className}`}>
        {s.label}
      </Badge>
    </div>
  );
}
