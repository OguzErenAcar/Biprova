import type { TeamDetail } from '@/features/teams/actions';
import { TeamHero } from './team-hero';
import { TeamStats } from './team-stats';
import { TeamMembersCard } from './team-members-card';
import { TeamDangerZone } from './team-danger-zone';
import { TeamLatestProject } from './team-latest-project';
import { TeamQuickActions } from './team-quick-actions';

interface Props {
  team: TeamDetail;
  onNewProject: () => void;
  onSettings: () => void;
  onInvite: () => void;
  onGrantBiprova: (userId: string, name: string) => void;
  onKick: (userId: string, name: string) => void;
  onTransfer: () => void;
  onDisband: () => void;
  onViewAllProjects: () => void;
}

export function PanelGenel({
  team, onNewProject, onSettings, onInvite,
  onGrantBiprova, onKick, onTransfer, onDisband, onViewAllProjects,
}: Props) {
  const hasActiveProject = team.projects.some((p) => ['active', 'open'].includes(p.status));
  const latestProject = team.projects[0] ?? null;
  const canCreateProject = team.viewer.is_leader || team.viewer.has_biprova;

  return (
    <div id="panel-genel">
      {/* No project banner */}
      {!hasActiveProject && (
        <div
          id="no-proj-banner"
          className="bg-orange-50 border-[1.5px] border-orange-200 rounded-2xl px-5 py-4 flex items-center gap-3 mb-[1.2rem]"
        >
          <span className="text-2xl shrink-0">⚠️</span>
          <div className="flex-1">
            <div className="font-nunito font-extrabold text-[0.9rem] text-orange-800">Aktif proje yok</div>
            <div className="text-[0.76rem] text-orange-600 mt-0.5">Ekibinizin şu an aktif bir projesi bulunmuyor. Yeni bir proje açın!</div>
          </div>
          {canCreateProject && (
            <button
              onClick={onNewProject}
              className="bg-white border-[1.5px] border-orange-200 rounded-[8px] font-nunito font-extrabold text-[0.78rem] text-orange-700 px-[0.9rem] py-[0.38rem] cursor-pointer whitespace-nowrap hover:bg-orange-100 transition-colors"
            >
              + Proje Aç
            </button>
          )}
        </div>
      )}

      <TeamHero team={team} onNewProject={onNewProject} onSettings={onSettings} />
      <TeamStats team={team} />

      {/* 2-col grid */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-[1.2rem] items-start">
        {/* Left */}
        <div>
          <TeamMembersCard
            members={team.members}
            viewerId={team.viewer.id}
            isLeader={team.viewer.is_leader}
            onGrantBiprova={onGrantBiprova}
            onKick={onKick}
            onInvite={onInvite}
          />
          {team.viewer.is_leader && (
            <TeamDangerZone
              members={team.members}
              onTransfer={onTransfer}
              onDisband={onDisband}
            />
          )}
        </div>

        {/* Right */}
        <div>
          <TeamLatestProject project={latestProject} onViewAll={onViewAllProjects} />
          <TeamQuickActions canCreateProject={canCreateProject} onNewProject={onNewProject} />
        </div>
      </div>
    </div>
  );
}
