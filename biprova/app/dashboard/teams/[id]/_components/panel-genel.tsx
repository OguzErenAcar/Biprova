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
  const recentProjects = team.projects.slice(0, 3);
  const canCreateProject = team.viewer.is_leader || team.viewer.has_biprova;

  return (
    <div id="panel-genel">
      <TeamHero team={team} isLeader={team.viewer.is_leader} onNewProject={onNewProject} onSettings={onSettings} />
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
          <TeamLatestProject projects={recentProjects} onViewAll={onViewAllProjects} />
          <TeamQuickActions canCreateProject={canCreateProject} onNewProject={onNewProject} />
        </div>
      </div>
    </div>
  );
}
