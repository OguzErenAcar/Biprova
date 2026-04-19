import { TeamDetail } from "@/features/teams/actions";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface TeamHeroProps {
  team: TeamDetail;
}

const STATUS_STYLES: Record<string, string> = {
  active: "bg-white/20 text-white border-white/30",
  pending: "bg-white/20 text-white border-white/30",
  no_project: "bg-white/20 text-white border-white/30",
};

const STATUS_LABELS: Record<string, string> = {
  active: "Aktif",
  pending: "Kuruluyor",
  no_project: "Projesiz",
};

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("tr-TR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function TeamAvatar({ name }: { name: string }) {
  const initials = name
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("");

  return (
    <div className="w-16 h-16 rounded-2xl bg-white/20 border-2 border-white/30 flex items-center justify-center shrink-0">
      <span className="font-nunito font-black text-white text-xl leading-none">
        {initials}
      </span>
    </div>
  );
}

export function TeamHero({ team }: TeamHeroProps) {
  const leader = team.members.find((m) => m.is_leader);

  return (
    <Card className="mb-5 overflow-hidden">
      <div className="bg-gradient-to-br from-brand-hover via-indigo-500 to-violet-500 px-6 py-6">
        <div className="flex items-center gap-4">
          <TeamAvatar name={team.name} />

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2 mb-2">
              <h1 className="font-nunito font-black text-h2 text-white leading-tight">
                {team.name}
              </h1>
              <Badge
                variant="outline"
                className={`shrink-0 mt-1 font-bold ${STATUS_STYLES[team.status] ?? STATUS_STYLES.active}`}
              >
                {STATUS_LABELS[team.status] ?? team.status}
              </Badge>
            </div>

            <div className="flex flex-wrap gap-x-4 gap-y-1 text-caption text-white/80">
              <span>{formatDate(team.formed_at)} kuruldu</span>
              {leader && <span>Lider: {leader.name}</span>}
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
