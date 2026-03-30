import type { TeamDetail } from '@/features/teams/actions';

interface Props {
  team: TeamDetail;
  isLeader: boolean;
  onNewProject: () => void;
  onSettings: () => void;
}

function getInitials(name: string): string {
  return name.split(' ').slice(0, 2).map((w) => w[0]).join('').toUpperCase();
}

const STATUS_CHIP: Record<string, string> = {
  active:     'bg-green-50 text-green-700 border-green-200',
  pending:    'bg-yellow-50 text-yellow-700 border-yellow-200',
  no_project: 'bg-orange-50 text-orange-700 border-orange-200',
  disbanded:  'bg-red-50 text-red-600 border-red-200',
};

const STATUS_LABEL: Record<string, string> = {
  active: '● Aktif', pending: '● Kuruldu', no_project: '⚠ Projesi Yok', disbanded: '● Dağıtıldı',
};

export function TeamHero({ team, onNewProject, onSettings }: Props) {
  const initials = getInitials(team.name);
  const completedCount = team.projects.filter((p) => p.status === 'completed').length;
  const activeDays = Math.floor((Date.now() - new Date(team.formed_at).getTime()) / 86_400_000);

  return (
    <div id="team-hero" className="bg-white border-[1.5px] border-slate-200 rounded-[20px] overflow-hidden mb-[1.2rem]">
      {/* Cover */}
      <div className="h-20 bg-gradient-to-br from-blue-900 via-indigo-600 to-violet-600 relative">
        <div className="absolute inset-0 opacity-5 bg-[radial-gradient(circle,white_1px,transparent_1px)] bg-[length:20px_20px]" />
      </div>

      {/* Body */}
      <div className="px-6 pb-6">
        {/* Avatar */}
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-violet-500 flex items-center justify-center font-nunito font-black text-xl text-white border-[3px] border-white -mt-8 mb-3">
          {initials}
        </div>

        <div className="flex items-start justify-between flex-wrap gap-3">
          <div>
            <div className="font-nunito font-black text-[1.3rem] text-slate-900 mb-1">{team.name}</div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className={`text-[0.72rem] font-bold px-[0.65rem] py-[0.22rem] rounded-full border-[1.5px] ${STATUS_CHIP[team.status] ?? STATUS_CHIP.pending}`}>
                {STATUS_LABEL[team.status] ?? team.status}
              </span>
              <span className="text-[0.72rem] font-bold px-[0.65rem] py-[0.22rem] rounded-full border-[1.5px] border-slate-200 text-slate-500">
                {team.members.length} üye
              </span>
              {completedCount > 0 && (
                <span className="text-[0.72rem] font-bold px-[0.65rem] py-[0.22rem] rounded-full border-[1.5px] border-slate-200 text-slate-500">
                  {completedCount} proje tamamlandı
                </span>
              )}
              <span className="text-[0.72rem] font-bold px-[0.65rem] py-[0.22rem] rounded-full border-[1.5px] border-slate-200 text-slate-500">
                {activeDays} gün önce kuruldu
              </span>
            </div>
          </div>

          <div className="flex gap-2 flex-wrap">
            <button
              onClick={onSettings}
              className="bg-white text-slate-700 border-[1.5px] border-slate-200 rounded-[9px] font-nunito font-extrabold text-[0.82rem] px-[1.1rem] py-2 cursor-pointer transition-all hover:border-blue-600 hover:text-blue-600"
            >
              ⚙️ Ekip Ayarları
            </button>
            <button
              onClick={onNewProject}
              className="bg-blue-600 text-white rounded-[9px] font-nunito font-extrabold text-[0.82rem] px-[1.1rem] py-2 cursor-pointer transition-all hover:bg-blue-700 shadow-[0_3px_10px_rgba(37,99,235,0.25)]"
            >
              + Yeni Proje Aç
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
