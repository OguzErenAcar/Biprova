import type { TeamDetail } from '@/features/teams/actions';

interface Props {
  team: TeamDetail;
}

export function TeamStats({ team }: Props) {
  const completedProjects = team.projects.filter((p) => p.status === 'completed').length;
  const activeDays = Math.floor((Date.now() - new Date(team.formed_at).getTime()) / 86_400_000);

  return (
    <div id="team-stats" className="grid grid-cols-3 gap-[0.8rem] mb-[1.2rem]">
      <div className="bg-white border-[1.5px] border-slate-200 rounded-2xl p-4 text-center">
        <div className="font-nunito font-black text-[1.5rem] text-blue-600">{completedProjects}</div>
        <div className="text-[0.72rem] text-slate-400 mt-0.5 font-semibold">Tamamlanan Proje</div>
      </div>
      <div className="bg-white border-[1.5px] border-slate-200 rounded-2xl p-4 text-center">
        <div className="font-nunito font-black text-[1.5rem] text-blue-600">{team.members.length}</div>
        <div className="text-[0.72rem] text-slate-400 mt-0.5 font-semibold">Ekip Üyesi</div>
      </div>
      <div className="bg-white border-[1.5px] border-slate-200 rounded-2xl p-4 text-center">
        <div className="font-nunito font-black text-[1.5rem] text-blue-600">{activeDays}</div>
        <div className="text-[0.72rem] text-slate-400 mt-0.5 font-semibold">Aktif Gün</div>
      </div>
    </div>
  );
}
