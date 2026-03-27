import { TeamBar } from "@/components/shared/team-bar";

type ProjectStatus = "open" | "almost" | "full";

interface Role {
  name: string;
  filled: boolean;
}

interface Poster {
  name: string;
  initials: string;
  color: string;
}

interface ProjectCardProps {
  city: string;
  isRemote?: boolean;
  status: ProjectStatus;
  category: string;
  postedAt: string;
  title: string;
  description: string;
  poster: Poster;
  roles: Role[];
}

const STATUS_STYLES: Record<ProjectStatus, string> = {
  open: "bg-green-100 text-green-700",
  almost: "bg-amber-100 text-amber-700",
  full: "bg-red-100 text-red-700",
};

const STATUS_LABELS: Record<ProjectStatus, string> = {
  open: "Açık",
  almost: "Neredeyse Doldu",
  full: "Doldu",
};

export function ProjectCard({
  city,
  isRemote,
  status,
  category,
  postedAt,
  title,
  description,
  poster,
  roles,
}: ProjectCardProps) {
  const filled = roles.filter((r) => r.filled).length;

  return (
    <div className="bg-white border-[1.5px] border-slate-200 rounded-2xl p-[1.4rem] mb-4 hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(0,0,0,0.07)] transition-all duration-150 cursor-pointer">
      {/* Üst satır: etiketler + zaman */}
      <div className="flex items-start justify-between gap-2 mb-[0.9rem]">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-[0.72rem] font-bold px-[0.65rem] py-[0.25rem] rounded-full bg-blue-50 text-blue-600">
            {isRemote ? "🌐 Remote" : `📍 ${city}`}
          </span>
          <span
            className={`text-[0.72rem] font-bold px-[0.65rem] py-[0.25rem] rounded-full ${STATUS_STYLES[status]}`}
          >
            {STATUS_LABELS[status]}
          </span>
          <span className="text-[0.72rem] font-bold px-[0.65rem] py-[0.25rem] rounded-full bg-slate-100 text-slate-500">
            {category}
          </span>
        </div>
        <span className="text-[0.75rem] text-slate-400 whitespace-nowrap flex-shrink-0">
          {postedAt}
        </span>
      </div>

      {/* Başlık */}
      <div className="font-nunito font-black text-[1.05rem] leading-[1.3] text-slate-900 mb-[0.35rem]">
        {title}
      </div>

      {/* Açıklama */}
      <div className="text-[0.84rem] text-slate-500 mb-4 leading-[1.55]">{description}</div>

      {/* Açan kişi */}
      <div className="flex items-center gap-2 mb-4">
        <div
          className="w-6 h-6 rounded-full flex items-center justify-center text-[0.65rem] font-nunito font-black text-white flex-shrink-0"
          style={{ background: poster.color }}
        >
          {poster.initials}
        </div>
        <span className="text-[0.8rem] font-semibold text-slate-500">
          <span className="text-slate-900">{poster.name}</span> tarafından açıldı
        </span>
      </div>

      {/* Rol chipleri */}
      <div className="flex flex-wrap gap-[0.4rem] mb-4">
        {roles.map((role, i) => (
          <span
            key={i}
            className={`text-[0.75rem] font-semibold px-[0.7rem] py-[0.28rem] rounded-full border-[1.5px] flex items-center gap-[0.3rem] ${
              role.filled
                ? "border-blue-200 bg-blue-50 text-blue-600"
                : "border-slate-200 text-slate-500"
            }`}
          >
            <span
              className="w-1.5 h-1.5 rounded-full flex-shrink-0"
              style={{ background: role.filled ? "#22c55e" : "#cbd5e1" }}
            />
            {role.name}
          </span>
        ))}
      </div>

      {/* Ekip doluluk barı */}
      <div className="mb-4">
        <TeamBar filled={filled} total={roles.length} />
      </div>

      {/* Aksiyon butonları */}
      <div className="flex gap-[0.6rem]">
        <button className="bg-blue-600 text-white border-none rounded-lg font-nunito font-extrabold text-[0.84rem] px-5 py-[0.55rem] cursor-pointer hover:bg-blue-700 transition-colors duration-150">
          Başvur →
        </button>
        <button className="bg-transparent text-slate-500 border-[1.5px] border-slate-200 rounded-lg font-nunito font-bold text-[0.84rem] px-4 py-[0.55rem] cursor-pointer hover:border-blue-600 hover:text-blue-600 transition-all duration-150">
          🔖 Kaydet
        </button>
      </div>
    </div>
  );
}
