"use client";

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import type { ProjectDetail } from '@/features/projects/actions';
import { leaveProject, transferProjectLeader } from '@/features/projects/actions';

function getInitials(name: string) {
  return name
    .split(' ')
    .map((w) => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
}

interface Props {
  project: ProjectDetail;
}

export function PanelEkip({ project }: Props) {
  return (
    <div id="panel-ekip" className="flex flex-col gap-[1.2rem]">
      <MembersSection members={project.members} />
      <AktivitelerSection />
      <LeaveProjectSection
        projectId={project.id}
        isProjectLeader={project.viewer.is_project_leader}
        members={project.members}
        viewerId={project.viewer.id}
      />
    </div>
  );
}

/* ─── Üyeler (read-only) ─────────────────────────────────────── */

function MembersSection({ members }: { members: ProjectDetail['members'] }) {
  return (
    <div className="bg-white border-[1.5px] border-slate-200 rounded-2xl overflow-hidden">
      <div className="px-[1.4rem] py-[1rem] border-b border-slate-200">
        <span className="font-nunito text-[0.9rem] font-black">👥 Ekip Üyeleri</span>
        <span className="ml-2 text-[0.72rem] font-bold text-slate-400 bg-slate-100 rounded-full px-2 py-0.5">
          {members.length}
        </span>
      </div>

      <div className="divide-y divide-slate-100">
        {members.length === 0 ? (
          <div className="px-[1.4rem] py-[1.2rem] text-[0.82rem] text-slate-400">
            Henüz üye yok.
          </div>
        ) : (
          members.map((member) => (
            <div key={member.user_id} className="flex items-center gap-3 px-[1.4rem] py-[0.9rem]">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center font-nunito font-black text-[0.72rem] text-white shrink-0">
                {getInitials(member.name)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-[0.84rem] font-bold text-slate-900">{member.name}</span>
                  {member.is_project_leader && (
                    <span className="text-[0.65rem] font-bold text-blue-600 bg-blue-50 border border-blue-200 rounded-full px-1.5 py-0.5">
                      Lider
                    </span>
                  )}
                  {member.has_biprova && (
                    <span className="text-[0.65rem] font-bold text-purple-600 bg-purple-50 border border-purple-200 rounded-full px-1.5 py-0.5">
                      Yetkili
                    </span>
                  )}
                </div>
                {member.role_name && (
                  <span className="text-[0.74rem] text-slate-400">{member.role_name}</span>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

/* ─── Aktiviteler ────────────────────────────────────────────── */

const MOCK_ACTIVITIES = [
  {
    id: '1',
    type: 'join',
    user: 'Ahmet Yılmaz',
    text: 'projeye katıldı',
    role: 'Frontend Developer',
    time: '2 saat önce',
  },
  {
    id: '2',
    type: 'apply',
    user: 'Selin Kaya',
    text: 'Backend Developer rolüne başvurdu',
    role: null,
    time: '5 saat önce',
  },
  {
    id: '3',
    type: 'team',
    user: null,
    text: 'Ekip kuruldu 🎉',
    role: null,
    time: '1 gün önce',
  },
  {
    id: '4',
    type: 'join',
    user: 'Mert Demir',
    text: 'projeye katıldı',
    role: 'UI/UX Tasarımcı',
    time: '2 gün önce',
  },
  {
    id: '5',
    type: 'create',
    user: null,
    text: 'Proje oluşturuldu',
    role: null,
    time: '3 gün önce',
  },
];

const ACTIVITY_ICONS: Record<string, string> = {
  join: '👤',
  apply: '📬',
  team: '🚀',
  create: '✨',
};

function AktivitelerSection() {
  return (
    <div className="bg-white border-[1.5px] border-slate-200 rounded-2xl overflow-hidden">
      <div className="px-[1.4rem] py-[1rem] border-b border-slate-200 flex items-center justify-between">
        <span className="font-nunito text-[0.9rem] font-black">⚡ Aktiviteler</span>
        <span className="text-[0.7rem] text-slate-400 font-semibold">Son 7 gün</span>
      </div>

      <div className="divide-y divide-slate-100">
        {MOCK_ACTIVITIES.map((activity) => (
          <div key={activity.id} className="flex items-start gap-3 px-[1.4rem] py-[0.9rem]">
            <div className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center text-[0.8rem] shrink-0 mt-0.5">
              {ACTIVITY_ICONS[activity.type] ?? '•'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[0.82rem] text-slate-700 leading-snug">
                {activity.user && (
                  <span className="font-bold text-slate-900">{activity.user} </span>
                )}
                {activity.text}
                {activity.role && (
                  <span className="ml-1 text-[0.72rem] font-semibold text-blue-600 bg-blue-50 rounded-full px-1.5 py-0.5">
                    {activity.role}
                  </span>
                )}
              </p>
              <span className="text-[0.72rem] text-slate-400">{activity.time}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── Projeden Ayrıl ─────────────────────────────────────────── */

interface LeaveProjectSectionProps {
  projectId: string;
  isProjectLeader: boolean;
  members: ProjectDetail['members'];
  viewerId: string;
}

function LeaveProjectSection({ projectId, isProjectLeader, members, viewerId }: LeaveProjectSectionProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [confirm, setConfirm] = useState(false);
  const [error, setError] = useState('');

  const [showTransferDialog, setShowTransferDialog] = useState(false);
  const [selectedId, setSelectedId] = useState('');
  const [transferError, setTransferError] = useState('');

  const candidates = members.filter((m) => m.user_id !== viewerId);

  function handleLeaveClick() {
    if (isProjectLeader) {
      setShowTransferDialog(true);
    } else {
      setConfirm(true);
    }
  }

  function handleLeave() {
    startTransition(async () => {
      const result = await leaveProject(projectId);
      if (result?.error) {
        setError(result.error);
        setConfirm(false);
      }
    });
  }

  function handleTransfer() {
    if (!selectedId) return;
    startTransition(async () => {
      const result = await transferProjectLeader(projectId, selectedId);
      if (result.error) {
        setTransferError(result.error);
      } else {
        setShowTransferDialog(false);
        setSelectedId('');
        router.refresh();
      }
    });
  }

  return (
    <>
      <div className="bg-white border-[1.5px] border-slate-200 rounded-2xl overflow-hidden">
        <div className="px-[1.4rem] py-[1rem] border-b border-slate-200">
          <span className="font-nunito text-[0.9rem] font-black">🚪 Projeden Ayrıl</span>
        </div>
        <div className="px-[1.4rem] py-[1.2rem]">
          {!confirm ? (
            <button
              onClick={handleLeaveClick}
              className="flex items-center gap-3 px-4 py-3 rounded-xl border-[1.5px] border-red-200 text-left w-full hover:bg-red-50 transition-colors cursor-pointer"
            >
              <span className="text-base">🚪</span>
              <div>
                <div className="text-[0.84rem] font-bold text-red-600">Projeden Ayrıl</div>
                <div className="text-[0.72rem] text-slate-400">
                  Ekipten çıkarsın, geri dönmek için tekrar başvurman gerekir
                </div>
              </div>
            </button>
          ) : (
            <div className="px-4 py-3 rounded-xl border-[1.5px] border-red-300 bg-red-50">
              <p className="text-[0.82rem] font-semibold text-red-700 mb-3">
                Projeden ayrılmak istediğine emin misin?
              </p>
              {error && <p className="text-[0.75rem] text-red-500 mb-2">{error}</p>}
              <div className="flex gap-2">
                <button
                  disabled={isPending}
                  onClick={handleLeave}
                  className="text-[0.78rem] font-bold px-3 py-1.5 rounded-lg bg-red-600 text-white hover:bg-red-700 transition-colors disabled:opacity-50 cursor-pointer"
                >
                  {isPending ? 'Ayrılıyor…' : 'Evet, Ayrıl'}
                </button>
                <button
                  disabled={isPending}
                  onClick={() => setConfirm(false)}
                  className="text-[0.78rem] font-bold px-3 py-1.5 rounded-lg border-[1.5px] border-slate-200 text-slate-500 hover:border-slate-400 transition-colors cursor-pointer"
                >
                  İptal
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {showTransferDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm mx-4 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-200">
              <h2 className="font-nunito text-[1rem] font-black">Lider Seç</h2>
            </div>
            <div className="px-6 py-5 flex flex-col gap-3">
              <p className="text-[0.82rem] text-slate-500">
                Projeden ayrılmadan önce liderliği devredecek bir üye seçmelisin.
              </p>
              {candidates.length === 0 ? (
                <p className="text-[0.82rem] text-amber-600 font-semibold">
                  Projede başka üye yok. Liderliği devretmek için önce projeye üye eklemen gerekiyor.
                </p>
              ) : (
                <select
                  value={selectedId}
                  onChange={(e) => { setSelectedId(e.target.value); setTransferError(''); }}
                  className="text-[0.82rem] px-3 py-2 rounded-lg border-[1.5px] border-slate-200 outline-none focus:border-blue-500 transition-colors text-slate-700 bg-white cursor-pointer"
                >
                  <option value="">— Üye seç —</option>
                  {candidates.map((m) => (
                    <option key={m.user_id} value={m.user_id}>{m.name}</option>
                  ))}
                </select>
              )}
              {transferError && <p className="text-[0.75rem] text-red-500">{transferError}</p>}
            </div>
            <div className="px-6 py-4 border-t border-slate-100 flex gap-2 justify-end">
              <button
                disabled={isPending}
                onClick={() => { setShowTransferDialog(false); setSelectedId(''); setTransferError(''); }}
                className="text-[0.78rem] font-bold px-4 py-2 rounded-lg border-[1.5px] border-slate-200 text-slate-500 hover:border-slate-400 transition-colors cursor-pointer"
              >
                İptal
              </button>
              {candidates.length > 0 && (
                <button
                  disabled={!selectedId || isPending}
                  onClick={handleTransfer}
                  className="text-[0.78rem] font-bold px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                >
                  {isPending ? 'Devrediliyor…' : 'Devret'}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
