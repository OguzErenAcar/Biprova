type ProjectStatus = "active" | "done" | "dissolved";
type ApplicationStatus = "pending" | "accepted" | "rejected";

const PROJECT_STATUS_STYLES: Record<ProjectStatus, string> = {
  active:    "bg-green-50 text-green-700",
  done:      "bg-blue-50 text-blue-600",
  dissolved: "bg-slate-100 text-slate-500",
};

const PROJECT_STATUS_LABELS: Record<ProjectStatus, string> = {
  active:    "Aktif",
  done:      "Tamamlandı",
  dissolved: "Dağıldı",
};

const APP_STATUS_STYLES: Record<ApplicationStatus, string> = {
  pending:  "bg-amber-50 text-amber-800",
  accepted: "bg-green-50 text-green-700",
  rejected: "bg-red-50 text-red-700",
};

const APP_STATUS_LABELS: Record<ApplicationStatus, string> = {
  pending:  "Bekliyor",
  accepted: "Kabul Edildi",
  rejected: "Reddedildi",
};

const SKILLS = [
  "Figma", "UI/UX", "Ürün Yönetimi", "Kullanıcı Araştırması",
  "Prototipleme", "Framer", "Design System", "Tailwind CSS",
];

const PROJECTS: { emoji: string; bg: string; name: string; meta: string[]; status: ProjectStatus }[] = [
  { emoji: "🎬", bg: "#eff6ff", name: "Kısa Film Projesi",        meta: ["📍 İstanbul", "4 kişi", "Lider: Sen"],              status: "active"    },
  { emoji: "🌱", bg: "#dcfce7", name: "Mahalle Bostanı Girişimi", meta: ["📍 Ankara",   "3 kişi", "UI Tasarımcı rolünde"],    status: "done"      },
  { emoji: "🎙️", bg: "#fef3c7", name: "Girişimcilik Podcast'i",   meta: ["🌐 Remote",  "4 kişi", "Lider: Sen"],              status: "done"      },
  { emoji: "📱", bg: "#f1f5f9", name: "Yerel Haber Uygulaması",   meta: ["📍 İzmir",   "5 kişi", "Lider: Sen"],              status: "dissolved" },
];

const APPLICATIONS: { emoji: string; bg: string; project: string; role: string; status: ApplicationStatus }[] = [
  { emoji: "🐾", bg: "#ede9fe", project: "Sokak Hayvanlarına Yardım",    role: "Rol: Fotoğrafçı · 1 gün önce başvuruldu",         status: "pending"  },
  { emoji: "🌍", bg: "#dcfce7", project: "Çevre Farkındalık Kampanyası", role: "Rol: UI Tasarımcı · 5 gün önce başvuruldu",        status: "accepted" },
  { emoji: "🎓", bg: "#fee2e2", project: "Online Eğitim Platformu",      role: "Rol: Ürün Tasarımcısı · 2 hafta önce başvuruldu", status: "rejected" },
];

function SectionCard({ title, action, children }: { title: string; action?: string; children: React.ReactNode }) {
  return (
    <div className="bg-white border border-slate-200 rounded-[16px] p-[1.4rem] mb-5">
      <div className="flex items-center justify-between mb-4">
        <div className="font-nunito font-black text-[1rem] text-slate-900">{title}</div>
        {action && (
          <span className="text-[0.8rem] text-blue-600 font-semibold cursor-pointer hover:underline">
            {action}
          </span>
        )}
      </div>
      {children}
    </div>
  );
}

export function ProfileSections() {
  return (
    <>
      {/* Skills */}
      <SectionCard title="🛠 Yetenekler" action="+ Ekle">
        <div className="flex flex-wrap gap-2">
          {SKILLS.map((skill) => (
            <span
              key={skill}
              className="bg-blue-50 text-blue-600 text-[0.8rem] font-bold px-3 py-1.5 rounded-[8px] font-nunito"
            >
              {skill}
            </span>
          ))}
        </div>
      </SectionCard>

      {/* Projects */}
      <SectionCard title="🗂 Projelerim" action="Tümünü gör">
        {PROJECTS.map((p, i) => (
          <div
            key={p.name}
            className={`flex gap-4 items-start py-3.5 ${i < PROJECTS.length - 1 ? "border-b border-slate-100" : ""} ${i === 0 ? "pt-0" : ""}`}
          >
            <div
              className="w-10 h-10 rounded-[11px] flex items-center justify-center text-[1.15rem] flex-shrink-0"
              style={{ background: p.bg }}
            >
              {p.emoji}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-[0.9rem] font-bold text-slate-900 mb-1">{p.name}</div>
              <div className="flex flex-wrap gap-2.5 text-[0.77rem] text-slate-500">
                {p.meta.map((m) => <span key={m}>{m}</span>)}
              </div>
            </div>
            <span className={`text-[0.72rem] font-bold px-2.5 py-1 rounded-[6px] whitespace-nowrap self-start mt-0.5 ${PROJECT_STATUS_STYLES[p.status]}`}>
              {PROJECT_STATUS_LABELS[p.status]}
            </span>
          </div>
        ))}
      </SectionCard>

      {/* Applications */}
      <SectionCard title="📨 Başvurularım" action="Tümünü gör">
        {APPLICATIONS.map((a, i) => (
          <div
            key={a.project}
            className={`flex gap-4 items-center py-3.5 ${i < APPLICATIONS.length - 1 ? "border-b border-slate-100" : ""} ${i === 0 ? "pt-0" : ""}`}
          >
            <div
              className="w-10 h-10 rounded-[11px] flex items-center justify-center text-[1.15rem] flex-shrink-0"
              style={{ background: a.bg }}
            >
              {a.emoji}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-[0.88rem] font-bold text-slate-900 mb-0.5">{a.project}</div>
              <div className="text-[0.78rem] text-slate-500">{a.role}</div>
            </div>
            <span className={`text-[0.72rem] font-bold px-2.5 py-1 rounded-[6px] whitespace-nowrap ${APP_STATUS_STYLES[a.status]}`}>
              {APP_STATUS_LABELS[a.status]}
            </span>
          </div>
        ))}
      </SectionCard>
    </>
  );
}
