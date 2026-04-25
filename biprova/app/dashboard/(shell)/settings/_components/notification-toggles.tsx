"use client";

import { BellRing, Mail, Smartphone } from "lucide-react";
import { Switch } from "@/components/ui/switch";

const ITEMS = [
  {
    icon: BellRing,
    label: "Uygulama içi",
    description: "Başvuru, ekip ve mesaj bildirimleri",
  },
  {
    icon: Mail,
    label: "E-posta",
    description: "Önemli güncellemeler e-posta ile gelsin",
  },
  {
    icon: Smartphone,
    label: "Mobil (Push)",
    description: "Telefona anlık bildirim gönder",
  },
] as const;

export function NotificationToggles() {
  return (
    <div className="flex flex-col gap-3">
      {ITEMS.map(({ icon: Icon, label, description }) => (
        <div
          key={label}
          className="flex items-center justify-between bg-slate-50 border-[1.5px] border-slate-200 rounded-[11px] px-3 py-2.5 md:px-4 md:py-3"
        >
          <div className="flex items-center gap-2">
            <Icon size={14} className="text-slate-400 shrink-0" />
            <div>
              <div className="text-sm md:text-base font-bold text-slate-900">{label}</div>
              <div className="text-xs md:text-sm text-slate-400 mt-0.5">{description}</div>
            </div>
          </div>
          <Switch disabled />
        </div>
      ))}
    </div>
  );
}
