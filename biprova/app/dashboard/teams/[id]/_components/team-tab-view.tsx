"use client";

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import type { TeamDetail, TeamMemberDetail } from '@/features/teams/actions';
import {
  leaveTeam, disbandTeam, kickMember, grantBiprova, renameTeam,
} from '@/features/teams/actions';
import { TeamTopbar } from './team-topbar';
import { PanelGenel } from './panel-genel';
import { PanelProjeler } from './panel-projeler';
import { PanelAktivite } from './panel-aktivite';

type Tab = 'genel' | 'projeler' | 'aktivite';

type ModalType =
  | { type: 'leave' }
  | { type: 'disband' }
  | { type: 'invite' }
  | { type: 'settings' }
  | { type: 'biprova'; userId: string; name: string }
  | { type: 'kick'; userId: string; name: string }
  | null;

interface Props {
  team: TeamDetail;
}

export function TeamTabView({ team }: Props) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<Tab>('genel');
  const [modal, setModal] = useState<ModalType>(null);
  const [newTeamName, setNewTeamName] = useState<string>(team.name);
  const [isPending, startTransition] = useTransition();
  const [modalError, setModalError] = useState<string>('');

  const otherMembers = team.members.filter((m) => !m.is_leader);

  function handleConfirm() {
    if (!modal) return;
    setModalError('');
    startTransition(async () => {
      switch (modal.type) {
        case 'leave': {
          const result = await leaveTeam(team.id);
          if (result?.error) { setModalError(result.error); return; }
          break;
        }
        case 'disband':
          await disbandTeam(team.id);
          break;
        case 'kick':
          await kickMember(team.id, modal.userId);
          router.refresh();
          break;
        case 'biprova':
          await grantBiprova(team.id, modal.userId);
          router.refresh();
          break;
        case 'settings':
          await renameTeam(team.id, newTeamName);
          router.refresh();
          break;
        default:
          break;
      }
      setModal(null);
    });
  }

  const MODAL_CONFIG: Record<string, { title: string; desc: string; confirmLabel: string; danger?: boolean }> = {
    leave:    { title: 'Ekipten Ayrıl', desc: 'Bu ekipten ayrılmak istediğine emin misin? Ekip senin olmadan devam edecek.', confirmLabel: 'Ayrıl', danger: true },
    disband:  { title: 'Ekibi Dağıt', desc: 'Tüm üyeler ekipten çıkarılacak, ekibe bağlı proje silinecek ve ekip kalıcı olarak kapatılacak. Bu işlem geri alınamaz!', confirmLabel: 'Evet, Dağıt', danger: true },
    transfer: { title: 'Liderliği Devret', desc: 'Hangi üyeye liderliği devretmek istiyorsun?', confirmLabel: 'Devret' },
    invite:   { title: 'Üye Davet Et', desc: 'Davet linki oluşturulacak ve ekibinize katılmak isteyen kişiyle paylaşabilirsiniz.', confirmLabel: 'Linki Kopyala' },
    settings: { title: 'Ekip Ayarları', desc: 'Ekip bilgilerini düzenle.', confirmLabel: 'Kaydet' },
    biprova:  { title: 'biprova Yetkisi Ver', desc: '', confirmLabel: 'Yetki Ver' },
    kick:     { title: '', desc: '', confirmLabel: 'Çıkar', danger: true },
  };

  const modalConfig = modal ? MODAL_CONFIG[modal.type] : null;
  const modalTitle = modal?.type === 'biprova' ? 'biprova Yetkisi Ver'
    : modal?.type === 'kick' ? `${(modal as { name: string }).name}'ı Çıkar`
    : modalConfig?.title ?? '';
  const modalDesc = modal?.type === 'biprova' ? `${(modal as { name: string }).name}'a biprova yetkisi verince ekip adına proje açabilecek.`
    : modal?.type === 'kick' ? `${(modal as { name: string }).name} ekipten çıkarılacak.`
    : modalConfig?.desc ?? '';

  return (
    <>
      {/* Topbar */}
      <TeamTopbar
        teamName={team.name}
        teamStatus={team.status}
        projectCount={team.projects.length}
        isLeader={team.viewer.is_leader}
        isMember={team.viewer.is_member}
        onLeave={() => setModal({ type: 'leave' })}
      />

      {/* Tabs */}
      <div
        id="team-tabs"
        className="flex border-b border-slate-200 bg-white px-6 sticky top-[53px] z-30"
      >
        {(['genel', 'projeler', 'aktivite'] as Tab[]).map((tab) => {
          const labels: Record<Tab, string> = 
          { genel: '👥 Genel', projeler: '📌 Projeler', aktivite: '📊 Aktivite' };
          return (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`text-[0.82rem] font-bold px-4 py-3 cursor-pointer border-b-2 transition-all whitespace-nowrap flex items-center gap-1 bg-transparent ${
                activeTab === tab
                  ? 'text-blue-600 border-blue-600'
                  : 'text-slate-400 border-transparent hover:text-slate-700'
              }`}
            >
              {labels[tab]}
            </button>
          );
        })}
      </div>

      {/* Content */}
      <div className="p-6">
        {activeTab === 'genel' && (
          <PanelGenel
            team={team}
            onSettings={() => setModal({ type: 'settings' })}
            onInvite={() => setModal({ type: 'invite' })}
            onLeave={() => setModal({ type: 'leave' })}
            onGrantBiprova={(userId, name) => setModal({ type: 'biprova', userId, name })}
            onKick={(userId, name) => setModal({ type: 'kick', userId, name })}
            onTransfer={() => { setTransferTarget(otherMembers[0]?.user_id ?? ''); setModal({ type: 'transfer' }); }}
            onDisband={() => setModal({ type: 'disband' })}
            onViewAllProjects={() => setActiveTab('projeler')}
          />
        )}
        {activeTab === 'projeler' && (
          <PanelProjeler projects={team.projects} />
        )}
        {activeTab === 'aktivite' && <PanelAktivite team={team} />}
      </div>

      {/* Modal overlay */}
      {modal && modalConfig && (
        <div
          className="fixed inset-0 bg-black/35 z-[200] flex items-center justify-center p-4"
          onClick={(e) => { if (e.target === e.currentTarget) { setModal(null); setModalError(''); } }}
        >
          <div className="bg-white rounded-[18px] p-[1.8rem] w-full max-w-[420px] shadow-[0_20px_50px_rgba(0,0,0,0.12)]">
            <h3 className="font-nunito font-black text-[1.1rem] mb-1">{modalTitle}</h3>
            <p className="text-[0.84rem] text-slate-400 mb-5">{modalDesc}</p>
            {modalError && <p className="text-[0.78rem] text-red-500 -mt-3 mb-4">{modalError}</p>}

            {/* Transfer: member select */}
            {modal.type === 'transfer' && otherMembers.length > 0 && (
              <select
                className="w-full px-3 py-[0.6rem] rounded-[8px] border-[1.5px] border-slate-200 font-[inherit] text-[0.86rem] mb-4 outline-none"
                value={transferTarget}
                onChange={(e) => setTransferTarget(e.target.value)}
              >
                {otherMembers.map((m: TeamMemberDetail) => (
                  <option key={m.user_id} value={m.user_id}>
                    {m.name}{m.role_name ? ` — ${m.role_name}` : ''}
                  </option>
                ))}
              </select>
            )}

            {/* Leave: involved projects list */}
            {modal.type === 'leave' && modalError && team.projects.length > 0 && (
              <div className="mb-4">
                <p className="text-[0.78rem] font-bold text-slate-500 mb-2">Bu ekibe bağlı projeler:</p>
                <div className="flex flex-col gap-1.5">
                  {team.projects.map((p) => (
                    <button
                      key={p.id}
                      onClick={() => { setModal(null); setModalError(''); router.push(`/dashboard/projects/${p.id}`); }}
                      className="flex items-center justify-between px-3 py-2 rounded-[8px] border-[1.5px] border-slate-200 hover:border-blue-300 hover:bg-blue-50 transition-colors text-left group"
                    >
                      <div>
                        <span className="text-[0.83rem] font-bold text-slate-700 group-hover:text-blue-600 block">{p.title}</span>
                        {p.leader_id === team.viewer.id && (
                          <span className="text-[0.72rem] text-amber-500 font-semibold">Lider</span>
                        )}
                      </div>
                      <svg className="w-3.5 h-3.5 text-slate-300 group-hover:text-blue-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Invite: link display */}
            {modal.type === 'invite' && (
              <div className="bg-slate-50 border-[1.5px] border-slate-200 rounded-[8px] px-3 py-[0.6rem] font-mono text-[0.78rem] text-slate-400 mb-4 break-all">
                biprova.app/join/{team.id.slice(0, 8)}
              </div>
            )}

            {/* Settings: team name input */}
            {modal.type === 'settings' && (
              <input
                type="text"
                value={newTeamName}
                onChange={(e) => setNewTeamName(e.target.value)}
                className="w-full px-3 py-[0.65rem] rounded-[8px] border-[1.5px] border-slate-200 font-[inherit] text-[0.86rem] outline-none mb-4 focus:border-blue-600"
              />
            )}

            <div className="flex gap-2 mt-2">
              <button
                onClick={() => { setModal(null); setModalError(''); }}
                className="flex-1 bg-white text-slate-700 border-[1.5px] border-slate-200 rounded-[9px] font-nunito font-extrabold text-[0.82rem] py-[0.7rem] cursor-pointer hover:border-slate-300 transition-colors"
              >
                İptal
              </button>
              <button
                onClick={handleConfirm}
                disabled={isPending}
                className={`flex-1 rounded-[9px] font-nunito font-extrabold text-[0.82rem] py-[0.7rem] cursor-pointer transition-colors disabled:opacity-50 ${
                  modalConfig.danger
                    ? 'bg-red-50 text-red-500 border-[1.5px] border-red-200 hover:bg-red-100'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
              >
                {isPending ? '...' : modalConfig.confirmLabel}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
