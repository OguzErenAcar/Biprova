"use client";

import { useRouter } from 'next/navigation';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const STATUS_LABEL: Record<string, { label: string; className: string }> = {
  open:      { label: '● Rol Aranıyor', className: 'bg-brand-surface text-brand border-brand-surface' },
  full:      { label: '● Ekip Tam',     className: 'bg-warning-surface text-warning border-warning-surface' },
  active:    { label: '✓ Aktif',        className: 'bg-success-surface text-success border-success-surface' },
  completed: { label: '● Tamamlandı',   className: 'bg-canvas text-ink-muted border-edge' },
  cancelled: { label: '● İptal',        className: 'bg-danger-surface text-danger border-danger-surface' },
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
      className="sticky top-0 z-40 bg-slate-100/92 backdrop-blur-[12px] border-b border-edge px-6 py-[0.8rem] flex items-center gap-3"
    >
      <Button
        variant="ghost"
        size="sm"
        onClick={() => router.back()}
        className="text-caption font-bold text-ink-subtle hover:text-brand h-auto px-2 py-1"
      >
        ← Geri
      </Button>

      <span className="font-nunito font-black text-base text-ink">{title}</span>

      <Badge variant="outline" className={`text-label font-bold ${s.className}`}>
        {s.label}
      </Badge>
    </div>
  );
}
