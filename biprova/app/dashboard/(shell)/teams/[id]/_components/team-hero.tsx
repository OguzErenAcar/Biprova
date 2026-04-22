import Image from "next/image";
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
  active: "bg-success-surface text-success border-success-surface",
  pending: "bg-warning-surface text-warning border-warning-surface",
  no_project: "bg-slate-100 text-ink-muted border-edge",
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
      <div className="h-[120px] bg-gradient-to-br from-brand-hover via-indigo-500 to-violet-500" />

      <div className="px-6 pb-5 pt-4">
        <div className="flex items-start justify-between gap-2 mb-3">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-full flex items-center justify-center bg-white border border-gray-100 overflow-hidden shrink-0">
              <Image
                src="/images/432-4329071_team-icon-png-transparent-png.png"
                alt="team"
                width={32}
                height={32}
                className="object-contain"
              />
            </div>
            <h1 className="font-nunito font-black text-h2 text-ink leading-tight">
              {team.name}
            </h1>
          </div>
          <Badge
            variant="outline"
            className={`shrink-0 mt-1 font-bold ${STATUS_STYLES[team.status] ?? STATUS_STYLES.active}`}
          >
            {STATUS_LABELS[team.status] ?? team.status}
          </Badge>
        </div>

        <div className="flex flex-wrap gap-4 text-caption text-ink-muted">
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
    </Card>
  );
}
