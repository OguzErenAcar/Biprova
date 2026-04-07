"use client";

import { useState, useTransition, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import type { ProjectDetail, SkillOption } from '@/features/projects/actions';
import { deleteProject, getSkills, transferProjectLeader } from '@/features/projects/actions';
import { reviewApplication } from '@/features/applications/actions';
import { kickMember, grantBiprova, revokeBiprova, renameTeam } from '@/features/teams/actions';
import { inviteToProject, removeFromProject } from '@/features/projects/actions';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

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
}

function ApplicationsSection({ projectId: _projectId, pending, reviewed }: ApplicationsSectionProps) {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="px-[1.4rem] py-[1rem] border-b border-edge flex-row items-center justify-between space-y-0">
        <CardTitle className="font-nunito text-lead font-black">📬 Başvurular</CardTitle>
        {pending.length > 0 && (
          <Badge className="text-label font-extrabold bg-brand text-white rounded-full">
            {pending.length} bekliyor
          </Badge>
        )}
      </CardHeader>

      <CardContent className="p-0 divide-y divide-edge">
        {pending.length === 0 && reviewed.length === 0 && (
          <div className="px-[1.4rem] py-[1.2rem] text-caption text-ink-subtle">
            Henüz başvuru yok.
          </div>
        )}

        {pending.map((app) => (
          <ApplicationRow key={app.id} app={app} isPending />
        ))}

        {reviewed.length > 0 && (
          <>
            {pending.length > 0 && (
              <div className="px-[1.4rem] py-[0.5rem] bg-canvas">
                <span className="text-label font-bold text-ink-subtle uppercase tracking-wider">
                  Değerlendirilenler
                </span>
              </div>
            )}
            {reviewed.map((app) => (
              <ApplicationRow key={app.id} app={app} isPending={false} />
            ))}
          </>
        )}
      </CardContent>
    </Card>
  );
}

function ApplicationRow({
  app,
  isPending,
}: {
  app: ProjectDetail['applications'][number];
  isPending: boolean;
}) {
  const [isPendingTransition, startTransition] = useTransition();
  const [localStatus, setLocalStatus] = useState(app.status);
  const [error, setError] = useState('');

  function handle(decision: 'accepted' | 'rejected') {
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
      <Badge variant="outline" className="text-meta font-bold text-success bg-success-surface border-success-surface rounded-full">
        ✓ Kabul edildi
      </Badge>
    ),
    rejected: (
      <Badge variant="outline" className="text-meta font-bold text-danger bg-danger-surface border-danger-surface rounded-full">
        ✕ Reddedildi
      </Badge>
    ),
  }[localStatus];

  return (
    <div className="flex items-start gap-3 px-[1.4rem] py-[1rem]">
      <Avatar className="w-9 h-9 shrink-0">
        <AvatarFallback className="bg-gradient-to-br from-brand to-indigo-400 font-nunito font-black text-meta text-white">
          {getInitials(app.user_name)}
        </AvatarFallback>
      </Avatar>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap mb-0.5">
          <span className="text-body font-bold text-ink">{app.user_name}</span>
          <span className="text-meta text-ink-subtle">→</span>
          <Badge variant="outline" className="text-meta font-semibold text-brand bg-brand-surface rounded-full">
            {app.role_name}
          </Badge>
          {statusBadge}
        </div>
        {app.note && (
          <p className="text-caption text-ink-muted leading-relaxed">{app.note}</p>
        )}
        {error && (
          <p className="text-meta text-danger mt-1">{error}</p>
        )}
      </div>

      {isPending && localStatus === 'pending' && (
        <div className="flex gap-2 shrink-0">
          <Button
            size="sm"
            disabled={isPendingTransition}
            onClick={() => handle('accepted')}
            className="text-meta bg-success hover:bg-success text-white"
          >
            {isPendingTransition ? '…' : 'Kabul'}
          </Button>
          <Button
            size="sm"
            variant="outline"
            disabled={isPendingTransition}
            onClick={() => handle('rejected')}
            className="text-meta text-ink-muted hover:border-danger hover:text-danger"
          >
            Red
          </Button>
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
    <Card className="overflow-hidden">
      <CardHeader className="px-[1.4rem] py-[1rem] border-b border-edge">
        <CardTitle className="font-nunito text-lead font-black">👥 Üye Yönetimi</CardTitle>
      </CardHeader>

      <CardContent className="p-0 divide-y divide-edge">
        <InviteRow projectId={projectId} />

        {members.length > 0 && (
          <>
            <div className="px-[1.4rem] py-[0.5rem] bg-canvas">
              <span className="text-label font-bold text-ink-subtle uppercase tracking-wider">
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
      </CardContent>
    </Card>
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
      <p className="text-caption font-semibold text-ink-muted mb-2">Kişi Davet Et</p>
      <div className="flex flex-col gap-2">
        <select
          value={skillName}
          onChange={(e) => setSkillName(e.target.value)}
          className="text-caption px-3 py-2 rounded-lg border-[1.5px] border-edge outline-none focus:border-brand transition-colors text-ink-muted bg-canvas cursor-pointer"
        >
          <option value="">— Meslek / Alan seç —</option>
          {skills.map((s) => (
            <option key={s.id} value={s.name}>{s.name}</option>
          ))}
        </select>
        <div className="flex gap-2">
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleInvite()}
            placeholder="e-posta adresi"
            className="flex-1 text-caption rounded-lg"
          />
          <Button
            disabled={isPending || !email.trim() || !skillName}
            onClick={handleInvite}
            className="text-caption shrink-0"
          >
            {isPending ? '…' : 'Davet Et'}
          </Button>
        </div>
      </div>
      {error && <p className="text-meta text-danger mt-1.5">{error}</p>}
      {success && <p className="text-meta text-success mt-1.5">{success}</p>}
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
  const [localHasBiprova, setLocalHasBiprova] = useState(member.has_biprova);
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

  function handleToggleBiprova() {
    if (!teamId) return;
    startTransition(async () => {
      const result = localHasBiprova
        ? await revokeBiprova(teamId, member.user_id)
        : await grantBiprova(teamId, member.user_id);
      if (result.error) {
        setError(result.error);
      } else {
        setLocalHasBiprova((prev) => !prev);
      }
    });
  }

  if (removed) return null;

  const canManage = !isSelf && !member.is_project_leader;

  return (
    <div className="px-[1.4rem] py-[0.9rem]">
      <div className="flex items-center gap-3">
        <Avatar className="w-8 h-8 shrink-0">
          <AvatarFallback className="bg-gradient-to-br from-ink-subtle to-ink-muted font-nunito font-black text-meta text-white">
            {getInitials(member.name)}
          </AvatarFallback>
        </Avatar>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-body font-bold text-ink">{member.name}</span>
            {member.is_project_leader && (
              <Badge variant="outline" className="text-label font-bold text-brand bg-brand-surface border-brand-surface rounded-full px-1.5">
                Lider
              </Badge>
            )}
            {localHasBiprova && (
              <Badge variant="outline" className="text-label font-bold text-purple-600 bg-purple-50 border-purple-200 rounded-full px-1.5">
                Yetkili
              </Badge>
            )}
          </div>
          {member.role_name && (
            <span className="text-meta text-ink-subtle">{member.role_name}</span>
          )}
        </div>

        {canManage && (
          <div className="flex items-center gap-1.5 shrink-0">
            {teamId && (
              <Button
                size="sm"
                variant="outline"
                disabled={isPending}
                onClick={handleToggleBiprova}
                title={localHasBiprova ? 'Yetkiyi Kaldır' : 'Yetki Ver'}
                className={`text-meta font-bold h-auto py-1.5 ${
                  localHasBiprova
                    ? 'border-purple-300 text-purple-600 bg-purple-50 hover:bg-purple-100'
                    : 'text-ink-muted hover:border-purple-300 hover:text-purple-600'
                }`}
              >
                {localHasBiprova ? '★ Yetkili' : '☆ Yetki Ver'}
              </Button>
            )}

            {!confirmRemove ? (
              <Button
                size="sm"
                variant="outline"
                disabled={isPending}
                onClick={() => setConfirmRemove(true)}
                className="text-meta font-bold h-auto py-1.5 text-ink-subtle hover:border-danger-surface hover:text-danger"
              >
                Çıkar
              </Button>
            ) : (
              <div className="flex gap-1">
                <Button
                  size="sm"
                  disabled={isPending}
                  onClick={handleRemove}
                  className="text-meta bg-danger hover:bg-danger text-white h-auto py-1.5"
                >
                  {isPending ? '…' : 'Evet'}
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  disabled={isPending}
                  onClick={() => setConfirmRemove(false)}
                  className="text-meta h-auto py-1.5"
                >
                  İptal
                </Button>
              </div>
            )}
          </div>
        )}
      </div>

      {error && <p className="text-meta text-danger mt-1.5 ml-11">{error}</p>}
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
    <Card className="overflow-hidden">
      <CardHeader className="px-[1.4rem] py-[1rem] border-b border-edge">
        <CardTitle className="font-nunito text-lead font-black">⚙️ Proje Yönetimi</CardTitle>
      </CardHeader>

      <CardContent className="px-[1.4rem] py-[1.2rem] flex flex-col gap-3">
        <Button
          variant="outline"
          disabled
          className="flex items-center gap-3 px-4 py-3 h-auto rounded-xl border-edge text-left justify-start opacity-40"
        >
          <span className="text-base">✏️</span>
          <div>
            <div className="text-body font-bold text-ink">Projeyi Düzenle</div>
            <div className="text-meta text-ink-subtle">Yakında geliyor</div>
          </div>
        </Button>

        <div>
          {!confirmDelete ? (
            <Button
              variant="outline"
              onClick={() => setConfirmDelete(true)}
              className="flex items-center gap-3 px-4 py-3 h-auto rounded-xl border-danger-surface text-left w-full justify-start hover:bg-danger-surface"
            >
              <span className="text-base">🗑️</span>
              <div>
                <div className="text-body font-bold text-danger">Projeyi Sil</div>
                <div className="text-meta text-ink-subtle">Bu işlem geri alınamaz</div>
              </div>
            </Button>
          ) : (
            <div className="px-4 py-3 rounded-xl border-[1.5px] border-danger-surface bg-danger-surface">
              <p className="text-caption font-semibold text-danger mb-3">
                Projeyi silmek istediğine emin misin? Tüm başvurular da silinecek.
              </p>
              {error && (
                <p className="text-meta text-danger mb-2">{error}</p>
              )}
              <div className="flex gap-2">
                <Button
                  size="sm"
                  disabled={isPending}
                  onClick={handleDelete}
                  className="text-caption bg-danger hover:bg-danger text-white"
                >
                  {isPending ? 'Siliniyor…' : 'Evet, Sil'}
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  disabled={isPending}
                  onClick={() => setConfirmDelete(false)}
                  className="text-caption"
                >
                  İptal
                </Button>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
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
    <Card className="overflow-hidden">
      <CardHeader className="px-[1.4rem] py-[1rem] border-b border-edge">
        <CardTitle className="font-nunito text-lead font-black">✏️ Ekip İsmi</CardTitle>
      </CardHeader>
      <CardContent className="px-[1.4rem] py-[1.2rem]">
        <div className="flex gap-2">
          <Input
            type="text"
            value={name}
            onChange={(e) => { setName(e.target.value); setSuccess(''); setError(''); }}
            onKeyDown={(e) => e.key === 'Enter' && handleSave()}
            placeholder="Ekip ismi"
            className="flex-1 text-caption rounded-lg"
          />
          <Button
            disabled={!isDirty || isPending}
            onClick={handleSave}
            className="text-caption shrink-0"
          >
            {isPending ? '…' : 'Kaydet'}
          </Button>
        </div>
        {error && <p className="text-meta text-danger mt-1.5">{error}</p>}
        {success && <p className="text-meta text-success mt-1.5">{success}</p>}
      </CardContent>
    </Card>
  );
}

/* ─── Lider Transfer Dialog ──────────────────────────────────── */

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
    <Dialog open onOpenChange={(open) => { if (!open) onClose(); }}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle className="font-nunito text-base font-black">Lider Seç</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-3">
          <p className="text-caption text-ink-muted">
            Projeden ayrılmadan önce liderliği devredecek bir üye seçmelisin.
          </p>
          {candidates.length === 0 ? (
            <p className="text-caption text-warning font-semibold">
              Projede başka üye yok. Liderliği devretmek için önce projeye üye eklemen gerekiyor.
            </p>
          ) : (
            <select
              value={selectedId}
              onChange={(e) => { setSelectedId(e.target.value); setTransferError(''); }}
              className="text-caption px-3 py-2 rounded-lg border-[1.5px] border-edge outline-none focus:border-brand transition-colors text-ink-muted bg-canvas cursor-pointer"
            >
              <option value="">— Üye seç —</option>
              {candidates.map((m) => (
                <option key={m.user_id} value={m.user_id}>{m.name}</option>
              ))}
            </select>
          )}
          {transferError && <p className="text-meta text-danger">{transferError}</p>}
        </div>
        <div className="flex gap-2 justify-end pt-2">
          <Button variant="outline" size="sm" disabled={isPending} onClick={onClose}>
            İptal
          </Button>
          {candidates.length > 0 && (
            <Button size="sm" disabled={!selectedId || isPending} onClick={handleTransfer}>
              {isPending ? 'Devrediliyor…' : 'Devret'}
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
