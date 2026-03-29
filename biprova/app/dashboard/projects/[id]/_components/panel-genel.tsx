import type { ProjectDetail } from '@/features/projects/actions';

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
  onGoToChat: () => void;
  onGoToTasks: () => void;
  onGoToFiles: () => void;
}

export function PanelGenel({ project, onGoToChat, onGoToTasks, onGoToFiles }: Props) {
  const filledCount = project.roles.filter((r) => r.is_filled).length;
  const totalCount = project.roles.length;

  const meta = [
    project.city && `📍 ${project.city}`,
    project.is_remote && '🌐 Remote',
    project.category && `📂 ${project.category}`,
    project.members.length > 0 && `👥 ${project.members.length} kişilik ekip`,
  ]
    .filter(Boolean)
    .join(' · ');

  return (
    <div id="panel-genel">
      {/* Project Header */}
      <div
        id="project-header"
        className="bg-gradient-to-br from-blue-700 to-indigo-500 rounded-2xl px-[1.8rem] py-[1.5rem] mb-[1.2rem] flex items-center justify-between flex-wrap gap-4"
      >
        <div>
          <h2 className="font-nunito font-black text-[1.2rem] text-white mb-1">{project.title}</h2>
          {meta && <p className="text-[0.82rem] text-white/70">{meta}</p>}
        </div>
        <div className="flex gap-2 items-center">
          {project.team_id && (
            <button
              onClick={onGoToChat}
              className="bg-white/15 text-white border border-white/25 rounded-[8px] font-nunito font-extrabold text-[0.8rem] px-4 py-[0.45rem] cursor-pointer hover:bg-white/25 transition-colors"
            >
              💬 Gruba Git
            </button>
          )}
        </div>
      </div>

      {/* 2-col grid */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-[1.2rem] items-start">
        {/* Left column */}
        <div className="flex flex-col gap-[1.2rem]">
          {/* Roles / Phases card */}
          <div id="phases-card" className="bg-white border-[1.5px] border-slate-200 rounded-2xl overflow-hidden">
            <div className="flex items-center justify-between px-[1.2rem] py-[1rem] border-b border-slate-200">
              <span className="font-nunito text-[0.9rem] font-black">🎭 Roller</span>
              <span className="text-[0.72rem] text-slate-400">
                {filledCount}/{totalCount} dolu
              </span>
            </div>
            {totalCount === 0 ? (
              <div className="px-[1.2rem] py-[1rem] text-[0.82rem] text-slate-400">
                Rol bulunamadı.
              </div>
            ) : (
              <div className="flex overflow-x-auto">
                {project.roles.map((role, i) => (
                  <div
                    key={role.id}
                    className={`flex-1 min-w-[80px] px-[0.8rem] py-[0.9rem] text-center border-r border-slate-200 last:border-r-0 ${
                      role.is_filled ? 'bg-green-50' : ''
                    }`}
                  >
                    <div
                      className={`w-7 h-7 rounded-full mx-auto mb-1 flex items-center justify-center text-[0.75rem] font-extrabold border-2 ${
                        role.is_filled
                          ? 'bg-green-500 border-green-500 text-white'
                          : 'bg-white border-slate-200 text-slate-400'
                      }`}
                    >
                      {role.is_filled ? '✓' : i + 1}
                    </div>
                    <div
                      className={`text-[0.72rem] font-bold truncate ${
                        role.is_filled ? 'text-green-700' : 'text-slate-400'
                      }`}
                    >
                      {role.role_name}
                    </div>
                    {role.filled_by_name && (
                      <div className="text-[0.64rem] text-slate-400 mt-0.5 truncate">
                        {role.filled_by_name}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Active Tasks card */}
          <div
            id="active-tasks-card"
            className="bg-white border-[1.5px] border-slate-200 rounded-2xl overflow-hidden"
          >
            <div className="flex items-center justify-between px-[1.2rem] py-[1rem] border-b border-slate-200">
              <span className="font-nunito text-[0.9rem] font-black">✅ Aktif Görevler</span>
              <button
                onClick={onGoToTasks}
                className="text-[0.75rem] font-bold text-blue-600 cursor-pointer bg-transparent border-none"
              >
                Tümünü Gör →
              </button>
            </div>
            <div className="px-[1.2rem] py-[1rem] text-[0.82rem] text-slate-400">
              Görev özelliği yakında geliyor.
            </div>
          </div>

          {/* Polls card */}
          <div
            id="polls-card"
            className="bg-white border-[1.5px] border-slate-200 rounded-2xl overflow-hidden"
          >
            <div className="flex items-center justify-between px-[1.2rem] py-[1rem] border-b border-slate-200">
              <span className="font-nunito text-[0.9rem] font-black">🗳 Açık Kararlar</span>
              <span className="text-[0.75rem] font-bold text-blue-600 cursor-pointer">+ Yeni Karar</span>
            </div>
            <div className="px-[1.2rem] py-[1rem] text-[0.82rem] text-slate-400">
              Oylama özelliği yakında geliyor.
            </div>
          </div>
        </div>

        {/* Right column */}
        <div className="flex flex-col gap-[1.2rem]">
          {/* Team card */}
          <div
            id="team-card"
            className="bg-white border-[1.5px] border-slate-200 rounded-2xl overflow-hidden"
          >
            <div className="flex items-center justify-between px-[1.2rem] py-[1rem] border-b border-slate-200">
              <span className="font-nunito text-[0.9rem] font-black">👥 Ekip</span>
              <span className="text-[0.72rem] text-slate-400">{project.members.length} kişi</span>
            </div>
            <div className="px-[1.2rem] py-[1rem]">
              {project.members.length === 0 ? (
                <div className="text-[0.82rem] text-slate-400">Henüz ekip üyesi yok.</div>
              ) : (
                project.members.map((m) => (
                  <div
                    key={m.user_id}
                    className="flex items-center gap-3 py-[0.5rem] border-b border-slate-100 last:border-b-0"
                  >
                    <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center font-nunito font-black text-[0.75rem] text-white shrink-0">
                      {getInitials(m.name)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-[0.84rem] font-bold truncate">
                        {m.name}
                        {m.user_id === project.viewer.id && (
                          <span className="text-[0.68rem] text-blue-600 ml-1">(Sen)</span>
                        )}
                        {m.is_leader && (
                          <span className="text-[0.68rem] text-orange-500 ml-1">⚡ Leader</span>
                        )}
                      </div>
                      {m.role_name && (
                        <div className="text-[0.72rem] text-slate-400 truncate">{m.role_name}</div>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Files preview card */}
          <div
            id="files-preview-card"
            className="bg-white border-[1.5px] border-slate-200 rounded-2xl overflow-hidden"
          >
            <div className="flex items-center justify-between px-[1.2rem] py-[1rem] border-b border-slate-200">
              <span className="font-nunito text-[0.9rem] font-black">📁 Dosyalar & Linkler</span>
              <button
                onClick={onGoToFiles}
                className="text-[0.75rem] font-bold text-blue-600 cursor-pointer bg-transparent border-none"
              >
                Tümü →
              </button>
            </div>
            <div className="px-[1.2rem] py-[1rem] text-[0.82rem] text-slate-400">
              Dosya özelliği yakında geliyor.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
