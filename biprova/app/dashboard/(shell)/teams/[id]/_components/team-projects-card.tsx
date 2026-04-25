import { TeamProjectItem } from "@/features/teams/actions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LottieIcon } from "@/components/shared/lottie-icon";
import layersIcon from "@/app/icons/wired-outline-12-layers-hover-slide.json";

interface TeamProjectsCardProps {
  projects: TeamProjectItem[];
}

const STATUS_STYLES: Record<string, string> = {
  active: "bg-success-surface text-success border-success-surface",
  done: "bg-brand-surface text-brand border-brand-surface",
  dissolved: "bg-slate-100 text-ink-muted border-edge",
};

const STATUS_LABELS: Record<string, string> = {
  active: "Aktif",
  done: "Tamamlandı",
  dissolved: "Dağıldı",
};

export function TeamProjectsCard({ projects }: TeamProjectsCardProps) {
  return (
    <Card className="mb-5">
      <CardHeader className="pb-0">
        <CardTitle className="font-nunito font-black text-base text-ink">
          Projeler
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-4">
        {projects.length === 0 ? (
          <p className="text-body text-ink-subtle">Henüz proje yok.</p>
        ) : (
          projects.map((project, i) => (
            <div
              key={project.id}
              className={`flex items-start gap-3 py-3 ${i < projects.length - 1 ? "border-b border-edge" : ""} ${i === 0 ? "pt-0" : ""}`}
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <LottieIcon animationData={layersIcon} size={20} />
                  <div className="text-lead font-bold text-ink">{project.title}</div>
                </div>
                <div className="text-caption text-ink-muted">
                  {project.city ?? (project.is_remote ? "🌐 Uzaktan" : null)}
                </div>
              </div>
              <Badge
                variant="outline"
                className={`shrink-0 font-bold text-meta mt-0.5 ${STATUS_STYLES[project.status] ?? STATUS_STYLES.active}`}
              >
                {STATUS_LABELS[project.status] ?? project.status}
              </Badge>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}
