"use client";

import { useState, useTransition, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import type { ProjectDetail, SkillOption } from '@/features/projects/actions';
import { deleteProject, getSkills, transferProjectLeader } from '@/features/projects/actions';
import { reviewApplication } from '@/features/applications/actions';
import { kickMember, renameTeam } from '@/features/teams/actions';
import { inviteToProject, removeFromProject } from '@/features/projects/actions';
import { notify } from '@/lib/notify';

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

export function PanelAdmin({ project }: Props) {
  const { applications } = project;
  const pending = applications.filter((a) => a.status === 'pending');
  const reviewed = applications.filter((a) => a.status !== 'pending');

  return (
    <div id="panel-admin" className="flex flex-col gap-[1.2rem]">
      <ApplicationsSection
        projectId={project.id}
        pending={pending}
        reviewed={reviewed}
        members={project.members}
      />
      <MemberManagementSection
        projectId={project.id}
        teamId={project.team_id}
        members={project.members}
        viewerId={project.viewer.id}
      />
      {project.team_id && (
        <TeamNameSection
          teamId={project.team_id}
          currentName={project.team_name ?? ''}
        />
      )}
      <ProjectManagementSection projectId={project.id} />
    </div>
  );
}

/* ─── Başvurular ─────────────────────────────────────────────── */

interface ApplicationsSectionProps {
  projectId: string;
  pending: ProjectDetail['applications'];
  reviewed: ProjectDetail['applications'];
  members: ProjectDetail['members'];
}

function ApplicationsSection({ projectId: _projectId, pending, reviewed, members }: ApplicationsSectionProps) {
  return (
    <div className="bg-white border-[1.5px] border-slate-200 rounded-2xl overflow-hidden">
      <div className="flex items-center justify-between px-[1.4rem] py-[1rem] border-b border-slate-200">
        <span className="font-nunito text-[0.9rem] font-black">📬 Başvurular</span>
        {pending.length > 0 && (
          <span className="text-[0.68rem] font-extrabold bg-blue-600 text-white rounded-full px-2 py-0.5">
            {pending.length} bekliyor
          </span>
        )}
      </div>

      <div className="divide-y divide-slate-100">
        {pending.length === 0 && reviewed.length === 0 && (
          <div className="px-[1.4rem] py-[1.2rem] text-[0.82rem] text-slate-400">
            Henüz başvuru yok.
          </div>
        )}

        {pending.map((app) => (
          <ApplicationRow
            key={app.id}
            app={app}
            isPending
            isAlreadyMember={members.some((m) => m.user_id === app.user_id)}
          />
        ))}

        {reviewed.length > 0 && (
          <>
            {pending.length > 0 && (
              <div className="px-[1.4rem] py-[0.5rem] bg-slate-50">
                <span className="text-[0.68rem] font-bold text-slate-400 uppercase tracking-wider">
                  Değerlendirilenler
                </span>
              </div>
            )}
            {reviewed.map((app) => (
              <ApplicationRow key={app.id} app={app} isPending={false} isAlreadyMember={false} />
            ))}
          </>
        )}
      </div>
    </div>
  );
}

function ApplicationRow({
  app,
  isPending,
  isAlreadyMember,
}: {
  app: ProjectDetail['applications'][number];
  isPending: boolean;
  isAlreadyMember: boolean;
}) {
  const [isPendingTransition, startTransition] = useTransition();
  const [localStatus, setLocalStatus] = useState(app.status);
  const [error, setError] = useState('');

  function handle(decision: 'accepted' | 'rejected') {
    if (decision === 'accepted' && isAlreadyMember) {
      notify.warning(`${app.user_name} zaten bu projenin üyesi.`);
    }
    startTransition(async () => {
      const result = await reviewApplication(app.id, decision);
      if (result.error) {
        setError(result.error);
      } else {
        setLocalStatus(decision);
      }
    });
  }

  const statusBadge = {
    pending: null,
    accepted: (
      <span className="text-[0.72rem] font-bold text-green-600 bg-green-50 border border-green-200 rounded-full px-2 py-0.5">
        ✓ Kabul edildi
      </span>
    ),
    rejected: (
      <span className="text-[0.72rem] font-bold text-red-500 bg-red-50 border border-red-200 rounded-full px-2 py-0.5">
        ✕ Reddedildi
      </span>
    ),
  }[localStatus];

  return (
    <div className="flex items-start gap-3 px-[1.4rem] py-[1rem]">
      <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-indigo-400 flex items-center justify-center font-nunito font-black text-[0.75rem] text-white shrink-0">
        {getInitials(app.user_name)}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap mb-0.5">
          <span className="text-[0.86rem] font-bold text-slate-900">{app.user_name}</span>
          <span className="text-[0.72rem] text-slate-400">→</span>
          <span className="text-[0.75rem] font-semibold text-blue-600 bg-blue-50 rounded-full px-2 py-0.5">
            {app.role_name}
          </span>
          {statusBadge}
        </div>
        {app.note && (
          <p className="text-[0.78rem] text-slate-500 leading-relaxed">{app.note}</p>
        )}
        {error && (
          <p className="text-[0.72rem] text-red-500 mt-1">{error}</p>
        )}
      </div>

      {isPending && localStatus === 'pending' && (
        <div className="flex gap-2 shrink-0">
          <button
            disabled={isPendingTransition}
            onClick={() => handle('accepted')}
            className="text-[0.75rem] font-bold px-3 py-1.5 rounded-lg bg-green-600 text-white hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            {isPendingTransition ? '…' : 'Kabul'}
          </button>
          <button
            disabled={isPendingTransition}
            onClick={() => handle('rejected')}
            className="text-[0.75rem] font-bold px-3 py-1.5 rounded-lg bg-white border-[1.5px] border-slate-200 text-slate-500 hover:border-red-400 hover:text-red-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            Red
          </button>
        </div>
      )}
    </div>
  );
}

/* ─── Üye Yönetimi ───────────────────────────────────────────── */

interface MemberManagementSectionProps {
  projectId: string;
  teamId: string | null;
  members: ProjectDetail['members'];
  viewerId: string;
}

function MemberManagementSection({ projectId, teamId, members, viewerId }: MemberManagementSectionProps) {
  return (
    <div className="bg-white border-[1.5px] border-slate-200 rounded-2xl overflow-hidden">
      <div className="px-[1.4rem] py-[1rem] border-b border-slate-200">
        <span className="font-nunito text-[0.9rem] font-black">👥 Üye Yönetimi</span>
      </div>

      <div className="divide-y divide-slate-100">
        <InviteRow projectId={projectId} />

        {members.length > 0 && (
          <>
            <div className="px-[1.4rem] py-[0.5rem] bg-slate-50">
              <span className="text-[0.68rem] font-bold text-slate-400 uppercase tracking-wider">
                Mevcut Üyeler
              </span>
            </div>
            {members.map((member) => (
              <MemberRow
                key={member.user_id}
                projectId={projectId}
                teamId={teamId}
                member={member}
                isSelf={member.user_id === viewerId}
              />
            ))}
          </>
        )}
      </div>
    </div>
  );
}

function InviteRow({ projectId }: { projectId: string }) {
  const [email, setEmail] = useState('');
  const [skillName, setSkillName] = useState('');
  const [skills, setSkills] = useState<SkillOption[]>([]);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    getSkills().then(setSkills);
  }, []);

  function handleInvite() {
    const trimmed = email.trim();
    if (!trimmed || !skillName) return;
    setError('');
    setSuccess('');
    startTransition(async () => {
      const result = await inviteToProject(projectId, trimmed, skillName);
      if (result.error) {
        setError(result.error);
      } else {
        setSuccess('Kullanıcı projeye eklendi.');
        setEmail('');
        setSkillName('');
      }
    });
  }

  return (
    <div className="px-[1.4rem] py-[1rem]">
      <p className="text-[0.8rem] font-semibold text-slate-700 mb-2">Kişi Davet Et</p>
      <div className="flex flex-col gap-2">
        <select
          value={skillName}
          onChange={(e) => setSkillName(e.target.value)}
          className="text-[0.82rem] px-3 py-2 rounded-lg border-[1.5px] border-slate-200 outline-none focus:border-blue-500 transition-colors text-slate-700 bg-white cursor-pointer"
        >
          <option value="">— Meslek / Alan seç —</option>
          {skills.map((s) => (
            <option key={s.id} value={s.name}>{s.name}</option>
          ))}
        </select>
        <div className="flex gap-2">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleInvite()}
            placeholder="e-posta adresi"
            className="flex-1 text-[0.82rem] px-3 py-2 rounded-lg border-[1.5px] border-slate-200 outline-none focus:border-blue-500 transition-colors placeholder:text-slate-400"
          />
          <button
            disabled={isPending || !email.trim() || !skillName}
            onClick={handleInvite}
            className="text-[0.78rem] font-bold px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer shrink-0"
          >
            {isPending ? '…' : 'Davet Et'}
          </button>
        </div>
      </div>
      {error && <p className="text-[0.72rem] text-red-500 mt-1.5">{error}</p>}
      {success && <p className="text-[0.72rem] text-green-600 mt-1.5">{success}</p>}
    </div>
  );
}

function MemberRow({
  projectId,
  teamId,
  member,
  isSelf,
}: {
  projectId: string;
  teamId: string | null;
  member: ProjectDetail['members'][number];
  isSelf: boolean;
}) {
  const [isPending, startTransition] = useTransition();
  const [removed, setRemoved] = useState(false);
  const [confirmRemove, setConfirmRemove] = useState(false);
  const [error, setError] = useState('');

  function handleRemove() {
    startTransition(async () => {
      const result = teamId
        ? await kickMember(teamId, member.user_id)
        : await removeFromProject(projectId, member.user_id);
      if (result.error) {
        setError(result.error);
        setConfirmRemove(false);
      } else {
        setRemoved(true);
      }
    });
  }

  if (removed) return null;

  const canManage = !isSelf && !member.is_project_leader;

  return (
    <div className="px-[1.4rem] py-[0.9rem]">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-slate-400 to-slate-600 flex items-center justify-center font-nunito font-black text-[0.72rem] text-white shrink-0">
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
            {localHasBiprova && (
              <span className="text-[0.65rem] font-bold text-purple-600 bg-purple-50 border border-purple-200 rounded-full px-1.5 py-0.5">
                Yetkili
              </span>
            )}
          </div>
          {member.role_name && (
            <span className="text-[0.74rem] text-slate-400">{member.role_name}</span>
          )}
        </div>

        {canManage && (
          <div className="flex items-center gap-1.5 shrink-0">
            {teamId && (
              <button
                disabled={isPending}
                onClick={handleToggleBiprova}
                title={localHasBiprova ? 'Yetkiyi Kaldır' : 'Yetki Ver'}
                className={`text-[0.72rem] font-bold px-2.5 py-1.5 rounded-lg border-[1.5px] transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer ${
                  localHasBiprova
                    ? 'border-purple-300 text-purple-600 bg-purple-50 hover:bg-purple-100'
                    : 'border-slate-200 text-slate-500 hover:border-purple-300 hover:text-purple-600'
                }`}
              >
                {localHasBiprova ? '★ Yetkili' : '☆ Yetki Ver'}
              </button>
            )}

            {!confirmRemove ? (
              <button
                disabled={isPending}
                onClick={() => setConfirmRemove(true)}
                className="text-[0.72rem] font-bold px-2.5 py-1.5 rounded-lg border-[1.5px] border-slate-200 text-slate-400 hover:border-red-300 hover:text-red-500 transition-colors disabled:opacity-40 cursor-pointer"
              >
                Çıkar
              </button>
            ) : (
              <div className="flex gap-1">
                <button
                  disabled={isPending}
                  onClick={handleRemove}
                  className="text-[0.72rem] font-bold px-2.5 py-1.5 rounded-lg bg-red-600 text-white hover:bg-red-700 transition-colors disabled:opacity-50 cursor-pointer"
                >
                  {isPending ? '…' : 'Evet'}
                </button>
                <button
                  disabled={isPending}
                  onClick={() => setConfirmRemove(false)}
                  className="text-[0.72rem] font-bold px-2.5 py-1.5 rounded-lg border-[1.5px] border-slate-200 text-slate-500 hover:border-slate-400 transition-colors cursor-pointer"
                >
                  İptal
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {error && <p className="text-[0.72rem] text-red-500 mt-1.5 ml-11">{error}</p>}
    </div>
  );
}

/* ─── Proje Yönetimi ─────────────────────────────────────────── */

function ProjectManagementSection({ projectId }: { projectId: string }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [error, setError] = useState('');

  function handleDelete() {
    startTransition(async () => {
      const result = await deleteProject(projectId);
      if (result.error) {
        setError(result.error);
        setConfirmDelete(false);
      } else {
        router.push('/dashboard');
      }
    });
  }

  return (
    <div className="bg-white border-[1.5px] border-slate-200 rounded-2xl overflow-hidden">
      <div className="px-[1.4rem] py-[1rem] border-b border-slate-200">
        <span className="font-nunito text-[0.9rem] font-black">⚙️ Proje Yönetimi</span>
      </div>

      <div className="px-[1.4rem] py-[1.2rem] flex flex-col gap-3">
        <button
          disabled
          className="flex items-center gap-3 px-4 py-3 rounded-xl border-[1.5px] border-slate-200 text-left opacity-40 cursor-not-allowed"
        >
          <span className="text-base">✏️</span>
          <div>
            <div className="text-[0.84rem] font-bold text-slate-900">Projeyi Düzenle</div>
            <div className="text-[0.72rem] text-slate-400">Yakında geliyor</div>
          </div>
        </button>

        <div>
          {!confirmDelete ? (
            <button
              onClick={() => setConfirmDelete(true)}
              className="flex items-center gap-3 px-4 py-3 rounded-xl border-[1.5px] border-red-200 text-left w-full hover:bg-red-50 transition-colors cursor-pointer group"
            >
              <span className="text-base">🗑️</span>
              <div>
                <div className="text-[0.84rem] font-bold text-red-600">Projeyi Sil</div>
                <div className="text-[0.72rem] text-slate-400">Bu işlem geri alınamaz</div>
              </div>
            </button>
          ) : (
            <div className="px-4 py-3 rounded-xl border-[1.5px] border-red-300 bg-red-50">
              <p className="text-[0.82rem] font-semibold text-red-700 mb-3">
                Projeyi silmek istediğine emin misin? Tüm başvurular da silinecek.
              </p>
              {error && (
                <p className="text-[0.75rem] text-red-500 mb-2">{error}</p>
              )}
              <div className="flex gap-2">
                <button
                  disabled={isPending}
                  onClick={handleDelete}
                  className="text-[0.78rem] font-bold px-3 py-1.5 rounded-lg bg-red-600 text-white hover:bg-red-700 transition-colors disabled:opacity-50 cursor-pointer"
                >
                  {isPending ? 'Siliniyor…' : 'Evet, Sil'}
                </button>
                <button
                  disabled={isPending}
                  onClick={() => setConfirmDelete(false)}
                  className="text-[0.78rem] font-bold px-3 py-1.5 rounded-lg border-[1.5px] border-slate-200 text-slate-500 hover:border-slate-400 transition-colors cursor-pointer"
                >
                  İptal
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ─── Ekip İsmi ──────────────────────────────────────────────── */

function TeamNameSection({ teamId, currentName }: { teamId: string; currentName: string }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [name, setName] = useState(currentName);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  function handleSave() {
    const trimmed = name.trim();
    if (!trimmed || trimmed === currentName) return;
    setError('');
    setSuccess('');
    startTransition(async () => {
      const result = await renameTeam(teamId, trimmed);
      if (result.error) {
        setError(result.error);
      } else {
        setSuccess('Ekip ismi güncellendi.');
        router.refresh();
      }
    });
  }

  const isDirty = name.trim() !== currentName && name.trim() !== '';

  return (
    <div className="bg-white border-[1.5px] border-slate-200 rounded-2xl overflow-hidden">
      <div className="px-[1.4rem] py-[1rem] border-b border-slate-200">
        <span className="font-nunito text-[0.9rem] font-black">✏️ Ekip İsmi</span>
      </div>
      <div className="px-[1.4rem] py-[1.2rem]">
        <div className="flex gap-2">
          <input
            type="text"
            value={name}
            onChange={(e) => { setName(e.target.value); setSuccess(''); setError(''); }}
            onKeyDown={(e) => e.key === 'Enter' && handleSave()}
            placeholder="Ekip ismi"
            className="flex-1 text-[0.82rem] px-3 py-2 rounded-lg border-[1.5px] border-slate-200 outline-none focus:border-blue-500 transition-colors placeholder:text-slate-400"
          />
          <button
            disabled={!isDirty || isPending}
            onClick={handleSave}
            className="text-[0.78rem] font-bold px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer shrink-0"
          >
            {isPending ? '…' : 'Kaydet'}
          </button>
        </div>
        {error && <p className="text-[0.72rem] text-red-500 mt-1.5">{error}</p>}
        {success && <p className="text-[0.72rem] text-green-600 mt-1.5">{success}</p>}
      </div>
    </div>
  );
}

/* ─── Lider Transfer (unused export, kept for page.tsx if needed) ─ */

interface LeaderTransferDialogProps {
  projectId: string;
  members: ProjectDetail['members'];
  viewerId: string;
  onClose: () => void;
}

export function LeaderTransferDialog({ projectId, members, viewerId, onClose }: LeaderTransferDialogProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [selectedId, setSelectedId] = useState('');
  const [transferError, setTransferError] = useState('');

  const candidates = members.filter((m) => m.user_id !== viewerId);

  function handleTransfer() {
    if (!selectedId) return;
    startTransition(async () => {
      const result = await transferProjectLeader(projectId, selectedId);
      if (result.error) {
        setTransferError(result.error);
      } else {
        onClose();
        router.refresh();
      }
    });
  }

  return (
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
            onClick={onClose}
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
  );
}
