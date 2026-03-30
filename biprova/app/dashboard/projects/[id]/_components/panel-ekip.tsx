"use client";

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import type { ProjectDetail } from '@/features/projects/actions';
import { deleteProject } from '@/features/projects/actions';
import { reviewApplication } from '@/features/applications/actions';

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
  const { viewer, applications } = project;

  const pending = applications.filter((a) => a.status === 'pending');
  const reviewed = applications.filter((a) => a.status !== 'pending');

  return (
    <div id="panel-ekip" className="flex flex-col gap-[1.2rem]">
      {viewer.is_creator && (
        <>
          <ApplicationsSection
            projectId={project.id}
            pending={pending}
            reviewed={reviewed}
          />
          <ProjectManagementSection projectId={project.id} hasTeam={!!project.team_id} />
        </>
      )}

      {!viewer.is_creator && (
        <div className="bg-white border-[1.5px] border-slate-200 rounded-2xl px-[1.8rem] py-[3rem] text-center text-[0.84rem] text-slate-400">
          Bu bölüm sadece proje sahibine görünür.
        </div>
      )}
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
          <ApplicationRow key={app.id} app={app} isPending />
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
              <ApplicationRow key={app.id} app={app} isPending={false} />
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

/* ─── Proje Yönetimi ─────────────────────────────────────────── */

function ProjectManagementSection({
  projectId,
  hasTeam,
}: {
  projectId: string;
  hasTeam: boolean;
}) {
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

        {!hasTeam && (
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
        )}

        {hasTeam && (
          <div className="px-4 py-3 rounded-xl bg-slate-50 border-[1.5px] border-slate-200 text-[0.78rem] text-slate-400">
            Ekip kuruldu — proje silinemez.
          </div>
        )}
      </div>
    </div>
  );
}
