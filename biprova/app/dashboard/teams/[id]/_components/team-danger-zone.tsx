'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import type { TeamMemberDetail } from '@/features/teams/actions';
import { transferLeadership, disbandTeam } from '@/features/teams/actions';

interface Props {
  teamId: string;
  members: TeamMemberDetail[];
}

export function TeamDangerZone({ teamId, members }: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string>('');
  const [disbandConfirm, setDisbandConfirm] = useState(false);

  const otherMembers = members.filter((m) => !m.is_leader);
  const [target, setTarget] = useState<string>(otherMembers[0]?.user_id ?? '');

  function handleTransfer() {
    if (!target) return;
    setError('');
    startTransition(async () => {
      const result = await transferLeadership(teamId, target);
      if (result?.error) { setError(result.error); return; }
      router.refresh();
    });
  }

  return (
    <div id="team-danger-zone" className="bg-white border-[1.5px] border-red-200 rounded-2xl overflow-hidden mb-[1.2rem]">
      <div className="px-5 py-4 border-b border-slate-200 bg-red-50">
        <span className="font-nunito font-black text-[0.9rem] text-red-500">⚠️ Tehlike Zonu</span>
      </div>
      <div className="px-5 py-3">
        {/* Transfer */}
        <div className="py-3">
          <div className="flex items-center justify-between flex-wrap gap-3 mb-3">
            <div>
              <div className="text-[0.86rem] font-bold text-slate-900 mb-0.5">Liderliği Devret</div>
              <div className="text-[0.76rem] text-slate-400">Başka bir üyeyi lider yap</div>
            </div>
          </div>
          {otherMembers.length > 0 ? (
            <div className="flex gap-2 items-center">
              <select
                className="flex-1 px-3 py-[0.6rem] rounded-[8px] border-[1.5px] border-slate-200 font-[inherit] text-[0.86rem] outline-none bg-white"
                value={target}
                onChange={(e) => { setTarget(e.target.value); setError(''); }}
                disabled={isPending}
              >
                {otherMembers.map((m) => (
                  <option key={m.user_id} value={m.user_id}>
                    {m.name}{m.role_name ? ` — ${m.role_name}` : ''}
                  </option>
                ))}
              </select>
              <button
                onClick={handleTransfer}
                disabled={isPending || !target}
                className="bg-white text-slate-700 border-[1.5px] border-slate-200 rounded-[9px] font-nunito font-extrabold text-[0.82rem] px-[1.1rem] py-[0.6rem] cursor-pointer transition-all hover:border-blue-600 hover:text-blue-600 disabled:opacity-50 whitespace-nowrap"
              >
                {isPending ? '...' : 'Devret'}
              </button>
            </div>
          ) : (
            <p className="text-[0.78rem] text-slate-400">Devredecek başka üye yok.</p>
          )}
          {error && <p className="text-[0.76rem] text-red-500 mt-2">{error}</p>}
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
