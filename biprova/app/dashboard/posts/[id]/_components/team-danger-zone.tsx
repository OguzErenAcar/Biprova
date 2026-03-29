import type { TeamMemberDetail } from '@/features/teams/actions';

interface Props {
  members: TeamMemberDetail[];
  onTransfer: () => void;
  onDisband: () => void;
}

export function TeamDangerZone({ onTransfer, onDisband }: Props) {
  return (
    <div id="team-danger-zone" className="bg-white border-[1.5px] border-red-200 rounded-2xl overflow-hidden mb-[1.2rem]">
      <div className="px-5 py-4 border-b border-slate-200 bg-red-50">
        <span className="font-nunito font-black text-[0.9rem] text-red-500">⚠️ Tehlike Zonu</span>
      </div>
      <div className="px-5 py-3">
        {/* Transfer */}
        <div className="flex items-center justify-between flex-wrap gap-3 py-3">
          <div>
            <div className="text-[0.86rem] font-bold text-slate-900 mb-0.5">Liderliği Devret</div>
            <div className="text-[0.76rem] text-slate-400">Başka bir üyeyi lider yap</div>
          </div>
          <button
            onClick={onTransfer}
            className="bg-white text-slate-700 border-[1.5px] border-slate-200 rounded-[9px] font-nunito font-extrabold text-[0.82rem] px-[1.1rem] py-2 cursor-pointer transition-all hover:border-blue-600 hover:text-blue-600"
          >
            Devret
          </button>
        </div>

        <div className="border-t border-slate-100" />

        {/* Disband */}
        <div className="flex items-center justify-between flex-wrap gap-3 py-3">
          <div>
            <div className="text-[0.86rem] font-bold text-slate-900 mb-0.5">Ekibi Dağıt</div>
            <div className="text-[0.76rem] text-slate-400">Tüm üyeler ayrılır, geri alınamaz</div>
          </div>
          <button
            onClick={onDisband}
            className="bg-red-50 text-red-500 border-[1.5px] border-red-200 rounded-[9px] font-nunito font-extrabold text-[0.82rem] px-[1.1rem] py-2 cursor-pointer transition-all hover:bg-red-100"
          >
            Dağıt
          </button>
        </div>
      </div>
    </div>
  );
}
