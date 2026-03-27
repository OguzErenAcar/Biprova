"use client";

import { useState } from "react";

interface Role {
  id: number;
  name: string;
  count: number;
}

const CATEGORIES = [
  { em: "🎨", label: "Sanat" },
  { em: "🎬", label: "Medya" },
  { em: "💻", label: "Teknoloji" },
  { em: "🌍", label: "Sosyal" },
  { em: "🌱", label: "Çevre" },
  { em: "🎓", label: "Eğitim" },
  { em: "🎵", label: "Müzik" },
  { em: "🍽️", label: "Yemek" },
  { em: "⚽", label: "Spor" },
];

const ROLE_SUGGESTIONS = [
  "Grafik Tasarımcı",
  "Yazılımcı",
  "Pazarlama",
  "İçerik Üretici",
  "Fotoğrafçı",
  "Editör",
];

const DURATION_OPTIONS = [
  "Belirtilmemiş",
  "1–4 hafta",
  "1–3 ay",
  "3–6 ay",
  "Uzun vadeli",
];

export function CreateProjectLeftCol() {
  const [isRemote, setIsRemote] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [roles, setRoles] = useState<Role[]>([]);
  const [newRole, setNewRole] = useState("");
  const [nextId, setNextId] = useState(1);

  function addRole(name: string) {
    const trimmed = name.trim();
    if (!trimmed) return;
    setRoles((prev) => [...prev, { id: nextId, name: trimmed, count: 1 }]);
    setNextId((n) => n + 1);
    setNewRole("");
  }

  function removeRole(id: number) {
    setRoles((prev) => prev.filter((r) => r.id !== id));
  }

  function changeCount(id: number, delta: number) {
    setRoles((prev) =>
      prev.map((r) =>
        r.id === id ? { ...r, count: Math.max(1, r.count + delta) } : r
      )
    );
  }

  return (
    <div className="flex flex-col gap-5">
      {/* STEPS */}
      <div className="hidden sm:flex items-center gap-0">
        <StepItem state="done" label="Temel Bilgiler" num="✓" />
        <div className="flex-1 h-0.5 bg-green-500 mx-2 min-w-7" />
        <StepItem state="active" label="Roller" num="2" />
        <div className="flex-1 h-0.5 bg-slate-200 mx-2 min-w-7" />
        <StepItem state="idle" label="Detaylar" num="3" />
      </div>

      {/* TEMEL BİLGİLER */}
      <FormCard title="📋 Temel Bilgiler" sub="Projenin ne olduğunu ve ne aradığını kısaca anlat.">
        <FormGroup label="Proje Başlığı" required>
          <div className="relative">
            <span className="absolute left-[0.85rem] top-1/2 -translate-y-1/2 text-base pointer-events-none">✏️</span>
            <input
              className="form-input pl-10"
              type="text"
              placeholder="örn. İklim Değişikliği Farkındalık Belgeseli"
              maxLength={80}
            />
          </div>
        </FormGroup>

        <FormGroup label="Ne İhtiyacın Var?" required hint="— Fikir değil, ihtiyaç yaz">
          <textarea
            className="form-input resize-y min-h-[100px] leading-relaxed"
            placeholder="Hangi sorunu çözüyorsun, ekiple ne yapmak istiyorsun? İnsanlar başvurmadan önce bunu okuyacak."
            maxLength={500}
          />
        </FormGroup>
      </FormCard>

      {/* KONUM & KATEGORİ */}
      <FormCard title="📍 Konum & Kategori" sub="Ekibini nerede ve hangi alanda arıyorsun?">
        <FormGroup label="">
          <div className="flex items-center justify-between bg-slate-50 border-[1.5px] border-slate-200 rounded-[11px] px-4 py-3">
            <div>
              <div className="text-[0.88rem] font-bold text-slate-900">🌐 Remote Uyumlu</div>
              <div className="text-[0.74rem] text-slate-400 mt-0.5">Uzaktan çalışmaya açıksanız işaretle</div>
            </div>
            <label className="relative w-11 h-6 cursor-pointer">
              <input
                type="checkbox"
                className="opacity-0 w-0 h-0 absolute"
                checked={isRemote}
                onChange={(e) => setIsRemote(e.target.checked)}
              />
              <div
                className={`absolute inset-0 rounded-full transition-colors ${
                  isRemote ? "bg-blue-600" : "bg-slate-200"
                }`}
              />
              <div
                className={`absolute top-[3px] w-[18px] h-[18px] bg-white rounded-full shadow-sm transition-transform ${
                  isRemote ? "translate-x-[23px]" : "translate-x-[3px]"
                }`}
              />
            </label>
          </div>
        </FormGroup>

        <div className="grid grid-cols-2 gap-3.5">
          <FormGroup label="Şehir" required>
            <div className="relative">
              <span className="absolute left-[0.85rem] top-1/2 -translate-y-1/2 pointer-events-none">📍</span>
              <input className="form-input pl-10" type="text" placeholder="İstanbul, Ankara..." />
            </div>
          </FormGroup>
          <FormGroup label="İlçe" hint="— opsiyonel">
            <div className="relative">
              <span className="absolute left-[0.85rem] top-1/2 -translate-y-1/2 pointer-events-none">🗺️</span>
              <input className="form-input pl-10" type="text" placeholder="Beykoz, Kadıköy..." />
            </div>
          </FormGroup>
        </div>

        <FormGroup label="Kategori" required>
          <div className="grid grid-cols-3 gap-2">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.label}
                type="button"
                onClick={() => setSelectedCategory(cat.label)}
                className={`border-[1.5px] rounded-[10px] py-2.5 px-2 text-center text-[0.8rem] font-bold cursor-pointer transition-all ${
                  selectedCategory === cat.label
                    ? "border-blue-600 text-blue-600 bg-blue-50"
                    : "border-slate-200 text-slate-400 hover:border-blue-600 hover:text-blue-600 hover:bg-blue-50"
                }`}
              >
                <span className="block text-[1.3rem] mb-0.5">{cat.em}</span>
                {cat.label}
              </button>
            ))}
          </div>
        </FormGroup>
      </FormCard>

      {/* ROLLER */}
      <FormCard title="👥 Roller" sub="Ekibinde hangi rollere ihtiyaç var? En az 1, en fazla 6 rol ekleyebilirsin.">
        {roles.length > 0 && (
          <div className="flex flex-col gap-2.5 mb-3.5">
            {roles.map((role) => (
              <div
                key={role.id}
                className="flex items-center gap-2.5 bg-slate-50 border-[1.5px] border-slate-200 rounded-[11px] px-4 py-3 transition-colors hover:border-slate-300"
              >
                <span className="text-slate-300 cursor-grab text-base">⠿</span>
                <span className="flex-1 text-[0.88rem] font-bold text-slate-900">{role.name}</span>
                <div className="flex items-center gap-1 bg-white border-[1.5px] border-slate-200 rounded-[8px] p-0.5">
                  <button
                    type="button"
                    onClick={() => changeCount(role.id, -1)}
                    className="w-6 h-6 rounded-[6px] border-none bg-transparent cursor-pointer text-[0.9rem] text-slate-400 flex items-center justify-center transition-colors hover:bg-slate-50 hover:text-slate-900"
                  >
                    −
                  </button>
                  <span className="font-nunito font-black text-[0.88rem] min-w-[18px] text-center">
                    {role.count}
                  </span>
                  <button
                    type="button"
                    onClick={() => changeCount(role.id, 1)}
                    className="w-6 h-6 rounded-[6px] border-none bg-transparent cursor-pointer text-[0.9rem] text-slate-400 flex items-center justify-center transition-colors hover:bg-slate-50 hover:text-slate-900"
                  >
                    +
                  </button>
                </div>
                <button
                  type="button"
                  onClick={() => removeRole(role.id)}
                  className="w-7 h-7 rounded-[7px] border-none bg-transparent cursor-pointer text-slate-300 flex items-center justify-center text-base transition-all hover:bg-red-50 hover:text-red-500"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}

        <div className="flex gap-2.5 mb-3">
          <input
            className="flex-1 border-[1.5px] border-dashed border-slate-200 rounded-[11px] px-4 py-[0.7rem] font-[inherit] text-[0.88rem] text-slate-900 outline-none bg-transparent transition-colors placeholder:text-slate-400 focus:border-blue-600 focus:border-solid"
            type="text"
            placeholder="Yeni rol ekle..."
            value={newRole}
            onChange={(e) => setNewRole(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addRole(newRole)}
          />
          <button
            type="button"
            onClick={() => addRole(newRole)}
            className="bg-blue-50 text-blue-600 border-[1.5px] border-blue-200 rounded-[10px] font-nunito font-extrabold text-[0.86rem] px-4 py-[0.7rem] cursor-pointer whitespace-nowrap transition-all flex items-center gap-1 hover:bg-blue-600 hover:text-white hover:border-blue-600"
          >
            ＋ Ekle
          </button>
        </div>

        <div className="flex flex-wrap gap-1.5">
          {ROLE_SUGGESTIONS.map((sug) => (
            <button
              key={sug}
              type="button"
              onClick={() => addRole(sug)}
              className="bg-white border-[1.5px] border-slate-200 rounded-full px-3 py-1 text-[0.75rem] font-semibold text-slate-400 cursor-pointer transition-all hover:border-blue-600 hover:text-blue-600 hover:bg-blue-50"
            >
              {sug}
            </button>
          ))}
        </div>
      </FormCard>

      {/* ZAMAN DİLİMİ */}
      <FormCard title="⏳ Zaman Dilimi" sub="Projenin ne zaman başlayacağını belirt. Bu ekip bulmayı hızlandırır.">
        <div className="grid grid-cols-2 gap-3.5">
          <FormGroup label="Tahmini Başlangıç">
            <input className="form-input" type="date" />
          </FormGroup>
          <FormGroup label="Süre" hint="— opsiyonel">
            <div className="relative">
              <select className="form-input appearance-none pr-8">
                {DURATION_OPTIONS.map((opt) => (
                  <option key={opt}>{opt}</option>
                ))}
              </select>
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none text-[0.8rem]">
                ▾
              </span>
            </div>
          </FormGroup>
        </div>

        <FormGroup label="Bağlantı" hint="— opsiyonel">
          <div className="relative">
            <span className="absolute left-[0.85rem] top-1/2 -translate-y-1/2 pointer-events-none">🔗</span>
            <input
              className="form-input pl-10"
              type="url"
              placeholder="Proje dosyası, Notion, Drive linki..."
            />
          </div>
        </FormGroup>
      </FormCard>
    </div>
  );
}

/* ---- Alt bileşenler ---- */

interface StepItemProps {
  state: "done" | "active" | "idle";
  label: string;
  num: string;
}

function StepItem({ state, label, num }: StepItemProps) {
  const colors = {
    done: { text: "text-green-600", ring: "border-green-500 bg-green-500 text-white" },
    active: { text: "text-blue-600", ring: "border-blue-600 bg-blue-600 text-white" },
    idle: { text: "text-slate-400", ring: "border-slate-200 text-slate-400" },
  };
  const c = colors[state];

  return (
    <div className={`flex items-center gap-2 text-[0.8rem] font-bold ${c.text}`}>
      <div
        className={`w-[26px] h-[26px] rounded-full border-2 flex items-center justify-center font-nunito font-black text-[0.78rem] flex-shrink-0 ${c.ring}`}
      >
        {num}
      </div>
      <span>{label}</span>
    </div>
  );
}

interface FormCardProps {
  title: string;
  sub: string;
  children: React.ReactNode;
}

function FormCard({ title, sub, children }: FormCardProps) {
  return (
    <div className="bg-white border-[1.5px] border-slate-200 rounded-[18px] p-[1.8rem]">
      <div className="font-nunito font-black text-[1.05rem] text-slate-900 mb-1 flex items-center gap-[0.45rem]">
        {title}
      </div>
      <div className="text-[0.81rem] text-slate-400 mb-5">{sub}</div>
      <div className="flex flex-col gap-4">{children}</div>
    </div>
  );
}

interface FormGroupProps {
  label: string;
  required?: boolean;
  hint?: string;
  children: React.ReactNode;
}

function FormGroup({ label, required, hint, children }: FormGroupProps) {
  return (
    <div>
      {label && (
        <label className="block text-[0.82rem] font-bold text-slate-900 mb-1.5">
          {label}
          {required && <span className="text-red-500 ml-0.5">*</span>}
          {hint && <span className="text-[0.72rem] text-slate-400 font-normal ml-1">{hint}</span>}
        </label>
      )}
      {children}
    </div>
  );
}
