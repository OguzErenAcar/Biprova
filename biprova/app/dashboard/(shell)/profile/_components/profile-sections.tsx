import Link from "next/link";
import {
  UserProjectEntry,
  ProjectStatus,
  UserApplicationEntry,
  ApplicationStatus,
  UserTeamEntry,
  TeamStatus,
} from "@/features/users/actions";
import { VisibilityToggle } from "./visibility-toggle";
import { WithdrawApplicationButton } from "./withdraw-application-button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LottieIcon } from "@/components/shared/lottie-icon";
import layersIcon from "@/app/icons/wired-outline-12-layers-hover-slide.json";
import avatarIcon from "@/app/icons/wired-outline-268-avatar-man-hover-glance.json";
import documentIcon from "@/app/icons/wired-outline-245-edit-document-hover-pinch.json";

interface ProfileSectionsProps {
  projects: UserProjectEntry[];
  applications: UserApplicationEntry[];
  teams: UserTeamEntry[];
  projectsPublic: boolean;
  teamsPublic: boolean;
  applicationsPublic: boolean;
  isOwner?: boolean;
}

const PROJECT_STATUS_STYLES: Record<ProjectStatus, string> = {
  active: "bg-success-surface text-success border-success-surface",
  done: "bg-brand-surface text-brand border-brand-surface",
  dissolved: "bg-slate-100 text-ink-muted border-edge",
};

const PROJECT_STATUS_LABELS: Record<ProjectStatus, string> = {
  active: "Aktif",
  done: "Tamamlandı",
  dissolved: "Dağıldı",
};

const APP_STATUS_STYLES: Record<ApplicationStatus, string> = {
  pending: "bg-warning-surface text-warning border-warning-surface",
  accepted: "bg-success-surface text-success border-success-surface",
  rejected: "bg-danger-surface text-danger border-danger-surface",
};

const APP_STATUS_LABELS: Record<ApplicationStatus, string> = {
  pending: "Bekliyor",
  accepted: "Kabul Edildi",
  rejected: "Reddedildi",
};

const TEAM_STATUS_STYLES: Record<TeamStatus, string> = {
  pending: "bg-warning-surface text-warning border-warning-surface",
  active: "bg-success-surface text-success border-success-surface",
  no_project: "bg-slate-100 text-ink-muted border-edge",
};

const TEAM_STATUS_LABELS: Record<TeamStatus, string> = {
  pending: "Kuruluyor",
  active: "Aktif",
  no_project: "Projesiz",
};

function formatRelativeDate(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const days = Math.floor(diff / 86400000);
  if (days === 0) return "Bugün başvuruldu";
  if (days === 1) return "1 gün önce başvuruldu";
  if (days < 7) return `${days} gün önce başvuruldu`;
  const weeks = Math.floor(days / 7);
  if (weeks === 1) return "1 hafta önce başvuruldu";
  return `${weeks} hafta önce başvuruldu`;
}

function SectionCard({
  id,
  title,
  action,
  children,
}: {
  id?: string;
  title: string;
  action?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <Card id={id} className="mb-5">
      <CardHeader className="pb-0">
        <div className="flex items-center justify-between">
          <CardTitle className="font-nunito font-black text-xl md:text-2xl text-ink">
            {title}
          </CardTitle>
          {action}
        </div>
      </CardHeader>
      <CardContent className="pt-4">{children}</CardContent>
    </Card>
  );
}

export function ProfileSections({
  projects,
  applications,
  teams,
  projectsPublic,
  teamsPublic,
  applicationsPublic,
  isOwner = false,
}: ProfileSectionsProps) {
  return (
    <>
      {(isOwner || projectsPublic) && (
        <SectionCard
          id="profile-projects"
          title="Projelerim"
          action={
            isOwner ? (
              <VisibilityToggle
                section="projects"
                initialValue={projectsPublic}
              />
            ) : undefined
          }
        >
          {projects.length === 0 ? (
            <p className="text-body text-ink-subtle">Henüz proje yok.</p>
          ) : (
            projects.map((p, i) => {
              const meta: string[] = [];
              if (p.city) meta.push(`${p.city}`);
              else if (p.is_remote) meta.push("🌐 Remote");
              meta.push(
                p.isLeader
                  ? "Lider: Sen"
                  : p.userRole
                    ? `${p.userRole} rolünde`
                    : "Üye",
              );

              return (
                <Link
                  key={p.id}
                  href={`/dashboard/posts/projects/${p.id}`}
                  className={`flex gap-4 items-start py-3.5 hover:bg-slate-50 rounded-lg px-1 -mx-1 transition-colors ${i < projects.length - 1 ? "border-b border-edge border-white" : ""} ${i === 0 ? "pt-0" : ""}`}
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <LottieIcon animationData={layersIcon} size={22} />
                      <div className="text-base md:text-lg font-bold text-ink">{p.title}</div>
                    </div>
                    <div className="flex   text-sm text-ink-muted justify-between">
                      <div>
                        {meta.map((m, i) => (
                          <span key={m}>
                            {m}
                            {i < meta.length - 1 && " - "}
                          </span>
                        ))}
                      </div>
                      <Badge
                        variant="outline"
                        className={`text-meta font-bold whitespace-nowrap self-start mt-0.5 ms-2 ${PROJECT_STATUS_STYLES[p.status as ProjectStatus] ?? PROJECT_STATUS_STYLES.active}`}
                      >
                        {PROJECT_STATUS_LABELS[p.status as ProjectStatus] ??
                          p.status}
                      </Badge>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </SectionCard>
      )}

      {(isOwner || teamsPublic) && (
        <SectionCard
          id="profile-teams"
          title="Ekiplerim"
          action={
            isOwner ? (
              <VisibilityToggle section="teams" initialValue={teamsPublic} />
            ) : undefined
          }
        >
          {teams.length === 0 ? (
            <p className="text-body text-ink-subtle">Henüz ekip yok.</p>
          ) : (
            teams.map((t, i) => {
              const title: string | null = t.projectTitle;

              return (
                <Link
                  key={t.id}
                  href={`/dashboard/teams/${t.id}`}
                  className={`relative flex gap-4 items-start py-3.5 hover:bg-slate-50 rounded-lg px-1 -mx-1 transition-colors ${i < teams.length - 1 ? "border-b border-edge border-white" : ""} ${i === 0 ? "pt-0" : ""}`}
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <LottieIcon animationData={avatarIcon} size={22} />
                      <div className="text-base md:text-lg font-bold text-ink">{t.name ?? t.projectTitle ?? "Ekip"}</div>
                    </div>
                    <div className="flex  gap-4.5 text-sm text-ink-muted justify-between">
                      {title}
                      {/* rol de belirtilebilir */}
                      <Badge
                        variant="outline"
                        className={`  right-0 bottom-0 text-meta font-bold whitespace-nowrap self-start mt-0.5 ${TEAM_STATUS_STYLES[t.status]}`}
                      >
                        {TEAM_STATUS_LABELS[t.status]}
                      </Badge>
                    </div>
                  </div>
                </Link>
              );
            })
          )}
        </SectionCard>
      )}

      {(isOwner || applicationsPublic) && (
        <SectionCard
          id="profile-applications"
          title="Başvurularım"
          action={
            isOwner ? (
              <VisibilityToggle
                section="applications"
                initialValue={applicationsPublic}
              />
            ) : undefined
          }
        >
          {applications.length === 0 ? (
            <p className="text-body text-ink">Henüz başvuru yok.</p>
          ) : (
            applications.map((a, i) => (
              <Link
                key={a.id}
                href={a.projectId ? `/dashboard/posts/projects/${a.projectId}` : '#'}
                className={`flex gap-4 items-center py-3.5 hover:bg-slate-50 rounded-lg px-1 -mx-1 transition-colors ${i < applications.length - 1 ? "border-b border-edge border-white" : ""} ${i === 0 ? "pt-0" : ""}`}
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <LottieIcon animationData={documentIcon} size={22} />
                    <div className="text-base md:text-lg font-bold text-ink">{a.projectTitle}</div>
                  </div>
                  <div className="text-sm text-ink-muted flex justify-between">
                    {a.roleName ? `Rol: ${a.roleName} · ` : ""}
                    {formatRelativeDate(a.createdAt)}

                    <div className="flex items-center gap-2 flex-shrink-0">
                      <Badge
                        variant="outline"
                        className={`text-meta font-bold whitespace-nowrap ${APP_STATUS_STYLES[a.status]}`}
                      >
                        {APP_STATUS_LABELS[a.status]}
                      </Badge>
                      {isOwner && a.status === "pending" && (
                        <WithdrawApplicationButton applicationId={a.id} />
                      )}
                    </div>
                  </div>
                </div>
              </Link>
            ))
          )}
        </SectionCard>
      )}
    </>
  );
}
