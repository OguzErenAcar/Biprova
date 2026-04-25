"use client";

import { useState } from "react";
import { BellRing, Mail, Smartphone } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import {
  saveNotificationPreference,
  type NotificationPreferences,
  type NotifKey,
} from "@/features/users/actions";

interface ItemDef {
  icon: typeof BellRing;
  label: string;
  description: string;
  key: NotifKey;
}

const ITEMS: ItemDef[] = [
  {
    icon: BellRing,
    label: "Uygulama içi",
    description: "Başvuru, ekip ve mesaj bildirimleri",
    key: "notif_inapp",
  },
  {
    icon: Mail,
    label: "E-posta",
    description: "Önemli güncellemeler e-posta ile gelsin",
    key: "notif_email",
  },
  {
    icon: Smartphone,
    label: "Mobil (Push)",
    description: "Telefona anlık bildirim gönder",
    key: "notif_push",
  },
];

interface NotificationTogglesProps {
  initialPrefs: NotificationPreferences;
}

export function NotificationToggles({ initialPrefs }: NotificationTogglesProps) {
  const [prefs, setPrefs] = useState<NotificationPreferences>(initialPrefs);

  async function handleToggle(key: NotifKey, checked: boolean) {
    setPrefs((prev) => ({ ...prev, [key]: checked }));
    await saveNotificationPreference(key, checked);
  }

  return (
    <div className="flex flex-col gap-3">
      {ITEMS.map(({ icon: Icon, label, description, key }) => (
        <div
          key={key}
          className="flex items-center justify-between bg-slate-50 border-[1.5px] border-slate-200 rounded-[11px] px-3 py-2.5 md:px-4 md:py-3"
        >
          <div className="flex items-center gap-2">
            <Icon size={14} className="text-slate-400 shrink-0" />
            <div>
              <div className="text-sm md:text-base font-bold text-slate-900">{label}</div>
              <div className="text-xs md:text-sm text-slate-400 mt-0.5">{description}</div>
            </div>
          </div>
          <Switch
            checked={prefs[key]}
            onCheckedChange={(checked) => handleToggle(key, checked)}
          />
        </div>
      ))}
    </div>
  );
}
