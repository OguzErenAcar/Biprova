import { TeamDetail } from "@/features/teams/actions";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LottieIcon } from "@/components/shared/lottie-icon";
import clockIcon from "@/app/icons/wired-outline-236-alarm-clock-hover-pinch.json";
import avatarIcon from "@/app/icons/wired-outline-268-avatar-man-hover-glance.json";

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

export function TeamHero({ team }: TeamHeroProps) {
  const leader = team.members.find((m) => m.is_leader);

  return (
    <Card className="mb-5 overflow-hidden">
      <div className="bg-gradient-to-br from-brand-hover via-indigo-500 to-violet-500">
        <div className="h-[120px]" />

        <div className="px-6 pb-5 pt-4">
          <div className="flex items-start justify-between gap-2 mb-3">
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

          <div className="flex flex-wrap gap-4 text-caption text-white/80">
            <span className="flex items-center gap-1">
              <LottieIcon animationData={clockIcon} size={18} />
              {formatDate(team.formed_at)} kuruldu
            </span>
            {leader && (
              <span className="flex items-center gap-1">
                <LottieIcon animationData={avatarIcon} size={18} />
                Lider: {leader.name}
              </span>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}
