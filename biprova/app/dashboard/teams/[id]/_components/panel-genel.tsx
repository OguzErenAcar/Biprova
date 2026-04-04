import type { TeamDetail } from '@/features/teams/actions';
import { TeamHero } from './team-hero';
import { TeamStats } from './team-stats';
import { TeamMembersCard } from './team-members-card';
import { TeamDangerZone } from './team-danger-zone';
import { TeamLatestProject } from './team-latest-project';

interface Props {
  team: TeamDetail;
  onSettings: () => void;
  onInvite: () => void;
  onLeave: () => void;
  onGrantBiprova: (userId: string, name: string) => void;
  onKick: (userId: string, name: string) => void;
  onViewAllProjects: () => void;
}

export function PanelGenel({
  team, onSettings, onInvite, onLeave,
  onGrantBiprova, onKick, onViewAllProjects,
}: Props) {
  const recentProjects = team.projects.slice(0, 3);

  return (
    <div id="panel-genel">
      <TeamHero team={team} isLeader={team.viewer.is_leader} isMember={team.viewer.is_member} onSettings={onSettings} onLeave={onLeave} />
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
              teamId={team.id}
              members={team.members}
              onDisband={onDisband}
            />
          )}
        </div>

        {/* Right */}
        <div>
          <TeamLatestProject projects={recentProjects} onViewAll={onViewAllProjects} />
        </div>
      </div>
    </div>
  );
}
