import { UserProjectEntry, ProjectStatus, UserApplicationEntry, ApplicationStatus, UserTeamEntry, TeamStatus } from '@/features/users/actions';
import { VisibilityToggle } from './visibility-toggle';
import { WithdrawApplicationButton } from './withdraw-application-button';

interface ProfileSectionsProps {
  projects: UserProjectEntry[];
  applications: UserApplicationEntry[];
  teams: UserTeamEntry[];
  isOwner?: boolean;
}

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

const PROJECT_BG_COLORS = ["#eff6ff", "#dcfce7", "#fef3c7", "#f1f5f9", "#ede9fe", "#fee2e2"];
const APP_BG_COLORS     = ["#ede9fe", "#dcfce7", "#fef3c7", "#eff6ff", "#fee2e2", "#f1f5f9"];
const TEAM_BG_COLORS    = ["#fef3c7", "#eff6ff", "#dcfce7", "#fee2e2", "#f1f5f9", "#ede9fe"];

const TEAM_STATUS_STYLES: Record<TeamStatus, string> = {
  pending:    "bg-amber-50 text-amber-800",
  active:     "bg-green-50 text-green-700",
  no_project: "bg-slate-100 text-slate-500",
};

const TEAM_STATUS_LABELS: Record<TeamStatus, string> = {
  pending:    "Kuruluyor",
  active:     "Aktif",
  no_project: "Projesiz",
};

function formatRelativeDate(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const days = Math.floor(diff / 86400000);
  if (days === 0) return 'Bugün başvuruldu';
  if (days === 1) return '1 gün önce başvuruldu';
  if (days < 7) return `${days} gün önce başvuruldu`;
  const weeks = Math.floor(days / 7);
  if (weeks === 1) return '1 hafta önce başvuruldu';
  return `${weeks} hafta önce başvuruldu`;
}

function SectionCard({ id, title, action, children }: {
  id?: string;
  title: string;
  action?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div id={id} className="bg-white border border-slate-200 rounded-[16px] p-[1.4rem] mb-5">
      <div className="flex items-center justify-between mb-4">
        <div className="font-nunito font-black text-[1rem] text-slate-900">{title}</div>
        {action}
      </div>
      {children}
    </div>
  );
}

export function ProfileSections({ projects, applications, teams, isOwner = false }: ProfileSectionsProps) {
  return (
    <>
      <SectionCard
        id="profile-projects"
        title="🗂 Projelerim"
        action={isOwner ? <VisibilityToggle storageKey="profile_projects_public" /> : undefined}
      >
        {projects.length === 0 ? (
          <p className="text-[0.85rem] text-slate-400">Henüz proje yok.</p>
        ) : (
          projects.map((p, i) => {
            const bg = PROJECT_BG_COLORS[i % PROJECT_BG_COLORS.length];
            const meta: string[] = [];
            if (p.city) meta.push(`📍 ${p.city}`);
            else if (p.is_remote) meta.push('🌐 Remote');
            meta.push(p.isLeader ? 'Lider: Sen' : p.userRole ? `${p.userRole} rolünde` : 'Üye');

            return (
              <div
                key={p.id}
                className={`flex gap-4 items-start py-3.5 ${i < projects.length - 1 ? "border-b border-slate-100" : ""} ${i === 0 ? "pt-0" : ""}`}
              >
                <div
                  className="w-10 h-10 rounded-[11px] flex items-center justify-center text-[1.15rem] flex-shrink-0"
                  style={{ background: bg }}
                >
                  📁
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-[0.9rem] font-bold text-slate-900 mb-1">{p.title}</div>
                  <div className="flex flex-wrap gap-2.5 text-[0.77rem] text-slate-500">
                    {meta.map((m) => <span key={m}>{m}</span>)}
                  </div>
                </div>
                <span className={`text-[0.72rem] font-bold px-2.5 py-1 rounded-[6px] whitespace-nowrap self-start mt-0.5 ${PROJECT_STATUS_STYLES[p.status as ProjectStatus] ?? PROJECT_STATUS_STYLES.active}`}>
                  {PROJECT_STATUS_LABELS[p.status as ProjectStatus] ?? p.status}
                </span>
              </div>
            );
          })
        )}
      </SectionCard>

      <SectionCard
        id="profile-applications"
        title="📨 Başvurularım"
        action={isOwner ? <VisibilityToggle storageKey="profile_applications_public" defaultValue={false} /> : undefined}
      >
        {applications.length === 0 ? (
          <p className="text-[0.85rem] text-slate-400">Henüz başvuru yok.</p>
        ) : (
          applications.map((a, i) => (
            <div
              key={a.id}
              className={`flex gap-4 items-center py-3.5 ${i < applications.length - 1 ? "border-b border-slate-100" : ""} ${i === 0 ? "pt-0" : ""}`}
            >
              <div
                className="w-10 h-10 rounded-[11px] flex items-center justify-center text-[1.15rem] flex-shrink-0"
                style={{ background: APP_BG_COLORS[i % APP_BG_COLORS.length] }}
              >
                📨
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-[0.88rem] font-bold text-slate-900 mb-0.5">{a.projectTitle}</div>
                <div className="text-[0.78rem] text-slate-500">
                  {a.roleName ? `Rol: ${a.roleName} · ` : ''}{formatRelativeDate(a.createdAt)}
                </div>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <span className={`text-[0.72rem] font-bold px-2.5 py-1 rounded-[6px] whitespace-nowrap ${APP_STATUS_STYLES[a.status]}`}>
                  {APP_STATUS_LABELS[a.status]}
                </span>
                {isOwner && a.status === 'pending' && (
                  <WithdrawApplicationButton applicationId={a.id} />
                )}
              </div>
            </div>
          ))
        )}
      </SectionCard>
    </>
  );
}
