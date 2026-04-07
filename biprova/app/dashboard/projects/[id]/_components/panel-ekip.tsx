"use client";

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import type { ProjectDetail } from '@/features/projects/actions';
import { leaveProject, transferProjectLeader } from '@/features/projects/actions';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
    <Card className="overflow-hidden">
      <CardHeader className="px-[1.4rem] py-[1rem] border-b border-slate-200 flex-row items-center space-y-0 gap-2">
        <CardTitle className="font-nunito text-[0.9rem] font-black">👥 Ekip Üyeleri</CardTitle>
        <Badge variant="outline" className="text-[0.72rem] font-bold text-slate-400 bg-slate-100 rounded-full">
          {members.length}
        </Badge>
      </CardHeader>

      <CardContent className="p-0 divide-y divide-slate-100">
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
                    <Badge variant="outline" className="text-[0.65rem] font-bold text-blue-600 bg-blue-50 border-blue-200 rounded-full px-1.5">
                      Lider
                    </Badge>
                  )}
                  {member.has_biprova && (
                    <Badge variant="outline" className="text-[0.65rem] font-bold text-purple-600 bg-purple-50 border-purple-200 rounded-full px-1.5">
                      Yetkili
                    </Badge>
                  )}
                </div>
                {member.role_name && (
                  <span className="text-[0.74rem] text-slate-400">{member.role_name}</span>
                )}
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}

/* ─── Aktiviteler ────────────────────────────────────────────── */

const MOCK_ACTIVITIES = [
  { id: '1', type: 'join',   user: 'Ahmet Yılmaz', text: 'projeye katıldı',                    role: 'Frontend Developer', time: '2 saat önce' },
  { id: '2', type: 'apply',  user: 'Selin Kaya',   text: 'Backend Developer rolüne başvurdu',  role: null,                 time: '5 saat önce' },
  { id: '3', type: 'team',   user: null,            text: 'Ekip kuruldu 🎉',                    role: null,                 time: '1 gün önce'  },
  { id: '4', type: 'join',   user: 'Mert Demir',   text: 'projeye katıldı',                    role: 'UI/UX Tasarımcı',    time: '2 gün önce'  },
  { id: '5', type: 'create', user: null,            text: 'Proje oluşturuldu',                  role: null,                 time: '3 gün önce'  },
];

const ACTIVITY_ICONS: Record<string, string> = {
  join: '👤', apply: '📬', team: '🚀', create: '✨',
};

function AktivitelerSection() {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="px-[1.4rem] py-[1rem] border-b border-slate-200 flex-row items-center justify-between space-y-0">
        <CardTitle className="font-nunito text-[0.9rem] font-black">⚡ Aktiviteler</CardTitle>
        <span className="text-[0.7rem] text-slate-400 font-semibold">Son 7 gün</span>
      </CardHeader>

      <CardContent className="p-0 divide-y divide-slate-100 overflow-y-auto max-h-[320px]">
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
                  <Badge variant="outline" className="ml-1 text-[0.72rem] font-semibold text-blue-600 bg-blue-50 rounded-full px-1.5">
                    {activity.role}
                  </Badge>
                )}
              </p>
              <span className="text-[0.72rem] text-slate-400">{activity.time}</span>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
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
      <Card className="overflow-hidden">
        <CardHeader className="px-[1.4rem] py-[1rem] border-b border-slate-200">
          <CardTitle className="font-nunito text-[0.9rem] font-black">🚪 Projeden Ayrıl</CardTitle>
        </CardHeader>
        <CardContent className="px-[1.4rem] py-[1.2rem]">
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
                <Button
                  size="sm"
                  disabled={isPending}
                  onClick={handleLeave}
                  className="bg-red-600 hover:bg-red-700 text-white text-[0.78rem]"
                >
                  {isPending ? 'Ayrılıyor…' : 'Evet, Ayrıl'}
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  disabled={isPending}
                  onClick={() => setConfirm(false)}
                  className="text-[0.78rem]"
                >
                  İptal
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={showTransferDialog} onOpenChange={(open) => {
        if (!open) { setShowTransferDialog(false); setSelectedId(''); setTransferError(''); }
      }}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle className="font-nunito text-[1rem] font-black">Lider Seç</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-3">
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
          <div className="flex gap-2 justify-end pt-2">
            <Button
              variant="outline"
              size="sm"
              disabled={isPending}
              onClick={() => { setShowTransferDialog(false); setSelectedId(''); setTransferError(''); }}
            >
              İptal
            </Button>
            {candidates.length > 0 && (
              <Button
                size="sm"
                disabled={!selectedId || isPending}
                onClick={handleTransfer}
              >
                {isPending ? 'Devrediliyor…' : 'Devret'}
              </Button>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
