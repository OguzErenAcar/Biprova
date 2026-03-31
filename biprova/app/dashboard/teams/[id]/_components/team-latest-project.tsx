import Link from 'next/link';
import type { TeamProjectItem } from '@/features/teams/actions';

interface Props {
  projects: TeamProjectItem[];
  onViewAll: () => void;
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

function relativeTime(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const days = Math.floor(diff / 86_400_000);
  if (days < 1) return 'bugün';
  if (days < 30) return `${days} gün önce`;
  const months = Math.floor(days / 30);
  return `${months} ay önce`;
}

export function TeamLatestProject({ projects, onViewAll }: Props) {
  return (
    <div id="team-latest-project" className="bg-white border-[1.5px] border-slate-200 rounded-2xl overflow-hidden mb-[1.2rem]">
      <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200">
        <span className="font-nunito font-black text-[0.9rem]">📌 Son Projeler</span>
        <button
          onClick={onViewAll}
          className="text-[0.75rem] font-bold text-blue-600 cursor-pointer bg-transparent border-none hover:underline"
        >
          Tümü →
        </button>
      </div>
      <div className="p-4 flex flex-col gap-2">
        {projects.length > 0 ? (
          projects.map((project) => (
            <div key={project.id} className="bg-slate-50 rounded-[12px] p-4 border-[1.5px] border-slate-200">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-base">📁</span>
                <span className="font-nunito font-extrabold text-[0.9rem] text-slate-900 truncate">{project.title}</span>
              </div>
              <div className="text-[0.76rem] text-slate-400 mb-3">
                {project.is_remote ? '🌐 Remote' : `📍 ${project.city ?? 'Belirtilmemiş'}`} · {relativeTime(project.created_at)}
              </div>
              <span className={`text-[0.68rem] font-extrabold px-2 py-0.5 rounded-full ${STATUS_STYLE[project.status] ?? STATUS_STYLE.open}`}>
                {STATUS_TEXT[project.status] ?? project.status}
              </span>
            </div>
          ))
        ) : (
          <div className="text-center py-4 text-[0.82rem] text-slate-400">
            Henüz proje yok
          </div>
        )}
      </div>
    </div>
  );
}
