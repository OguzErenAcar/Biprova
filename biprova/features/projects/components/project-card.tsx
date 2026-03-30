import { TeamBar } from "@/components/shared/team-bar";
import { RoleJoinButton } from "@/features/applications/components/apply-button";

type ProjectStatus = "open" | "almost" | "full";

interface Role {
  id: string;
  name: string;
  filled: boolean;
  skills: string[];
}

interface ProjectCardProps {
  projectId: string;
  isOwnProject: boolean;
  city: string;
  isRemote?: boolean;
  status: ProjectStatus;
  category: string;
  postedAt: string;
  title: string;
  description: string;
  poster: { name: string; initials: string; color: string };
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
  projectId,
  isOwnProject,
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
  const total = roles.length;

  const openRoles = roles.filter((r) => !r.filled);
  const filledRoles = roles.filter((r) => r.filled);

  return (
    <div id={`project-card-${projectId}`} className="bg-white border-[1.5px] border-slate-200 rounded-2xl p-[1.4rem] mb-4 hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(0,0,0,0.07)] transition-all duration-150 cursor-pointer">
      {/* Üst satır: etiketler + zaman */}
      <div className="flex items-start justify-between gap-2 mb-[0.9rem]">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-[0.72rem] font-bold px-[0.65rem] py-[0.25rem] rounded-full bg-blue-50 text-blue-600">
            {isRemote ? "🌐 Remote" : `📍 ${city}`}
          </span>
          <span className={`text-[0.72rem] font-bold px-[0.65rem] py-[0.25rem] rounded-full ${STATUS_STYLES[status]}`}>
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

      {/* Aranan pozisyonlar */}
      {openRoles.length > 0 && (
        <div className="mb-4">
          <p className="text-[0.7rem] font-bold text-slate-400 uppercase tracking-wider mb-2">
            Aranan Pozisyonlar
          </p>
          <div className="flex flex-col gap-2">
            {openRoles.map((role, i) => (
              <div
                key={i}
                className="rounded-xl border-[1.5px] border-amber-100 bg-amber-50/50 px-3 py-2.5"
              >
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="w-2 h-2 rounded-full bg-amber-400 flex-shrink-0" />
                  <span className="text-[0.82rem] font-bold text-slate-700">{role.name}</span>
                </div>
                {role.skills.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {role.skills.map((skill) => (
                      <span
                        key={skill}
                        className="text-[0.68rem] font-semibold px-2 py-0.5 rounded-full bg-white text-blue-600 border border-blue-100"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Dolu roller */}
      {filledRoles.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-4">
          {filledRoles.map((role, i) => (
            <span
              key={i}
              className="text-[0.72rem] font-semibold px-3 py-1 rounded-full bg-green-50 text-green-600 border border-green-100 flex items-center gap-1.5"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 flex-shrink-0" />
              {role.name}
            </span>
          ))}
        </div>
      )}

      {/* Ekip doluluk barı */}
      <div className="mb-4">
        <TeamBar filled={filled} total={total} />
      </div>

      {/* Aksiyon butonları */}
      <div className="flex gap-[0.6rem] items-start">
        {isOwnProject ? (
          <span className="text-[0.84rem] font-nunito font-bold text-slate-400 px-5 py-[0.55rem] border-[1.5px] border-slate-200 rounded-lg">
            Senin projen
          </span>
        ) : (
          <ApplyButton
            projectId={projectId}
            openRoles={openRoles.map((r) => ({ id: r.id, name: r.name, skills: r.skills }))}
          />
        )}
        <button className="bg-transparent text-slate-500 border-[1.5px] border-slate-200 rounded-lg font-nunito font-bold text-[0.84rem] px-4 py-[0.55rem] cursor-pointer hover:border-blue-600 hover:text-blue-600 transition-all duration-150">
          🔖 Kaydet
        </button>
      </div>
    </div>
  );
}
