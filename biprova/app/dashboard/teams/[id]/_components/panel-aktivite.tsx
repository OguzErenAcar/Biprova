import type { TeamDetail } from '@/features/teams/actions';

interface Props {
  team: TeamDetail;
}

interface ActivityItem {
  id: string;
  icon: string;
  iconBg: string;
  html: string;
  time: string;
}

function relativeTime(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const minutes = Math.floor(diff / 60_000);
  if (minutes < 60) return `${minutes} dk önce`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} saat önce`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days} gün önce`;
  return `${Math.floor(days / 30)} ay önce`;
}

function deriveActivity(team: TeamDetail): ActivityItem[] {
  const items: ActivityItem[] = [];

  // Team formed
  items.push({
    id: `team-formed`,
    icon: '⚡',
    iconBg: 'bg-yellow-50',
    html: `<strong>${team.name}</strong> kuruldu`,
    time: team.formed_at,
  });

  // Members joined
  for (const member of team.members) {
    items.push({
      id: `member-${member.id}`,
      icon: '👋',
      iconBg: 'bg-purple-50',
      html: `<strong>${member.name}</strong> ekibe katıldı`,
      time: member.joined_at,
    });
  }

  // Projects
  for (const project of team.projects) {
    if (project.status === 'completed') {
      items.push({
        id: `proj-done-${project.id}`,
        icon: '✅',
        iconBg: 'bg-green-50',
        html: `<strong>${project.title}</strong> tamamlandı!`,
        time: project.created_at,
      });
    } else if (project.status === 'cancelled') {
      items.push({
        id: `proj-cancel-${project.id}`,
        icon: '❌',
        iconBg: 'bg-red-50',
        html: `<strong>${project.title}</strong> projesi feshedildi`,
        time: project.created_at,
      });
    } else {
      items.push({
        id: `proj-open-${project.id}`,
        icon: '📌',
        iconBg: 'bg-blue-50',
        html: `<strong>${project.leader_name}</strong> yeni proje açtı — <em>${project.title}</em>`,
        time: project.created_at,
      });
    }
  }

  return items.sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime());
}

export function PanelAktivite({ team }: Props) {
  const activities = deriveActivity(team);

  return (
    <div id="panel-aktivite">
      <div className="bg-white border-[1.5px] border-slate-200 rounded-2xl overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-200">
          <span className="font-nunito font-black text-[0.9rem]">📊 Ekip Aktivitesi</span>
        </div>
        <div className="px-5 py-1">
          {activities.map((item) => (
            <div
              key={item.id}
              className="flex gap-3 py-[0.7rem] border-b border-slate-100 last:border-0 items-start"
            >
              <div className={`w-[30px] h-[30px] rounded-[8px] flex items-center justify-center text-[0.85rem] shrink-0 ${item.iconBg}`}>
                {item.icon}
              </div>
              <div
                className="flex-1 text-[0.82rem] leading-[1.45] text-slate-700"
                dangerouslySetInnerHTML={{ __html: item.html }}
              />
              <div className="text-[0.7rem] text-slate-400 whitespace-nowrap mt-px">
                {relativeTime(item.time)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
