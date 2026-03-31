import Link from 'next/link';
import type { TeamProjectItem } from '@/features/teams/actions';

interface Props {
  projects: TeamProjectItem[];
}

const STATUS_STYLE: Record<string, string> = {
  open:      'bg-yellow-50 text-yellow-700',
  full:      'bg-blue-50 text-blue-700',
  active:    'bg-yellow-50 text-yellow-700',
  completed: 'bg-green-50 text-green-700',
  cancelled: 'bg-red-50 text-red-600',
};

const STATUS_TEXT: Record<string, string> = {
  open:      'Açık',
  full:      'Ekip Tam',
  active:    'Devam Ediyor',
  completed: 'Tamamlandı',
  cancelled: 'Feshedildi',
};

const ICON_BG: Record<string, string> = {
  open:      'bg-blue-50',
  full:      'bg-blue-50',
  active:    'bg-yellow-50',
  completed: 'bg-green-50',
  cancelled: 'bg-red-50',
};

function relativeTime(dateStr: string): string {
  const days = Math.floor((Date.now() - new Date(dateStr).getTime()) / 86_400_000);
  if (days < 1) return 'bugün';
  if (days < 30) return `${days} gün önce`;
  return `${Math.floor(days / 30)} ay önce`;
}

export function PanelProjeler({ projects, canCreateProject, onNewProject }: Props) {
  return (
    <div id="panel-projeler">
      <div className="bg-white border-[1.5px] border-slate-200 rounded-2xl overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200">
          <span className="font-nunito font-black text-[0.9rem]">📌 Tüm Projeler</span>
          {canCreateProject && (
            <button
              onClick={onNewProject}
              className="bg-blue-600 text-white rounded-[9px] font-nunito font-extrabold text-[0.78rem] px-[0.9rem] py-[0.4rem] cursor-pointer transition-all hover:bg-blue-700"
            >
              + Yeni Proje
            </button>
          )}
        </div>
        <div className="px-5 py-1">
          {projects.length === 0 && (
            <div className="py-8 text-center text-[0.84rem] text-slate-400">Henüz proje yok</div>
          )}
          {projects.map((project) => (
            <Link
              key={project.id}
              href={`/dashboard/projects/${project.id}`}
              className="flex items-center gap-3 py-[0.7rem] px-2 rounded-[10px] transition-colors hover:bg-slate-50 border-b border-slate-100 last:border-0"
            >
              <div className={`w-9 h-9 rounded-[9px] flex items-center justify-center text-base shrink-0 ${ICON_BG[project.status] ?? 'bg-slate-50'}`}>
                📁
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-[0.86rem] font-bold text-slate-900 truncate">{project.title}</div>
                <div className="text-[0.72rem] text-slate-400 mt-0.5">
                  {project.is_remote ? '🌐 Remote' : `📍 ${project.city ?? '—'}`}
                  {' · '}{project.creator_name} açtı · {relativeTime(project.created_at)}
                </div>
              </div>
              <span className={`text-[0.68rem] font-extrabold px-2 py-0.5 rounded-full shrink-0 ${STATUS_STYLE[project.status] ?? STATUS_STYLE.open}`}>
                {STATUS_TEXT[project.status] ?? project.status}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
