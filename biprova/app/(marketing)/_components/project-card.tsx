import { TeamBar } from "@/components/shared/team-bar";

type ProjectStatus = "open" | "almost" | "full";

interface Role {
  name: string;
  filled: boolean;
}

interface ProjectCardProps {
  city: string;
  status: ProjectStatus;
  title: string;
  roles: Role[];
}

const STATUS_STYLES: Record<ProjectStatus, string> = {
  open:   "bg-green-100 text-green-700",
  almost: "bg-amber-100 text-amber-700",
  full:   "bg-red-100 text-red-700",
};

const STATUS_LABELS: Record<ProjectStatus, string> = {
  open:   "Açık",
  almost: "Neredeyse Doldu",
  full:   "Doldu",
};

export function ProjectCard({ city, status, title, roles }: ProjectCardProps) {
  const filled = roles.filter((r) => r.filled).length;

  return (
    <div className="bg-white border-y border-x-0 sm:border-x border-slate-200 rounded-none sm:rounded-[20px] p-[1.6rem] hover:-translate-y-0.5 hover:shadow-[0_10px_28px_rgba(37,99,235,0.1)] transition-all duration-200 cursor-pointer">
      <div className="flex justify-between items-start mb-3">
        <span className="text-[0.72rem] font-bold tracking-[1.5px] uppercase bg-sky-100 text-blue-800 px-3 py-1 rounded-full">
          {city}
        </span>
        <span className={`text-[0.72rem] font-bold px-3 py-1 rounded-full ${STATUS_STYLES[status]}`}>
          {STATUS_LABELS[status]}
        </span>
      </div>

      <div className="font-nunito font-extrabold text-[1.05rem] leading-[1.3] mb-4">
        {title}
      </div>

      <div className="flex flex-wrap gap-1.5 mb-5">
        {roles.map((role, i) => (
          <span
            key={i}
            className={`text-[0.75rem] font-semibold px-3 py-1 rounded-full border ${
              role.filled
                ? "border-blue-200 bg-blue-50 text-blue-600"
                : "border-slate-200 text-slate-500"
            }`}
          >
            {role.filled ? `✓ ${role.name}` : role.name}
          </span>
        ))}
      </div>

      <TeamBar filled={filled} total={roles.length} />
    </div>
  );
}
