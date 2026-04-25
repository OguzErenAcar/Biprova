import type { ProjectDetail } from '@/features/projects/actions';
import { UserAvatar } from '@/components/shared/user-avatar';
import { TeamBarSection } from './team-bar-section';

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('tr-TR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

function ProjectInfoCard({ project }: { project: ProjectDetail }) {
  const meta: { icon: string; label: string; value: string }[] = [
    project.city
      ? { icon: '📍', label: 'Şehir', value: project.city }
      : null,
    project.is_remote
      ? { icon: '🌐', label: 'Çalışma Şekli', value: 'Uzaktan uyumlu' }
      : { icon: '🏢', label: 'Çalışma Şekli', value: 'Yüz yüze' },
    project.category
      ? { icon: '📂', label: 'Kategori', value: project.category }
      : null,
    { icon: '📅', label: 'Oluşturulma', value: formatDate(project.created_at) },
  ].filter(Boolean) as { icon: string; label: string; value: string }[];

  return (
    <div className="bg-white border-[1.5px] border-slate-200 rounded-2xl overflow-hidden">
      <div className="px-[1.2rem] py-[1rem] border-b border-slate-200">
        <span className="font-nunito text-[0.9rem] font-black text-black">📄 Proje Hakkında</span>
      </div>

      <div className="px-[1.2rem] py-[1rem] flex flex-col gap-4">
        {project.description && (
          <p className="text-[0.85rem] text-slate-600 leading-[1.65] whitespace-pre-wrap">
            {project.description}
          </p>
        )}

        <div className="grid grid-cols-2 gap-x-4 gap-y-3">
          {meta.map((item) => (
            <div key={item.label}>
              <div className="text-[0.68rem] font-bold text-slate-400 uppercase tracking-wider mb-0.5">
                {item.icon} {item.label}
              </div>
              <div className="text-[0.82rem] font-semibold text-slate-800">{item.value}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function getInitials(name: string) {
  return name
    .split(' ')
    .map((w) => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
}

interface MemberSlot {
  id: string;
  name: string;
  avatar_url: string | null;
  badge_url: string | null;
  is_leader: boolean;
}

function MemberStrip({ members }: { members: MemberSlot[] }) {
  if (members.length === 0) return null;
  const MAX = 6;
  const visible = members.slice(0, MAX);
  const overflow = members.length - MAX;

  return (
    <div className="flex items-center">
      {visible.map((m, i) => (
        <div
          key={m.id}
          title={`${m.name}${m.is_leader ? ' (Lider)' : ''}`}
          style={{ zIndex: visible.length - i }}
          className={`relative shrink-0 ${i !== 0 ? '-ml-4' : ''} ${m.is_leader ? 'ring-2 ring-white rounded-full' : ''}`}
        >
          <UserAvatar
            avatarUrl={m.avatar_url}
            initials={getInitials(m.name)}
            badge={m.badge_url}
            size={32}
            className={`text-[0.7rem] font-extrabold ${
              m.is_leader ? 'bg-orange-400' : 'bg-white/20 ring-1 ring-white/40'
            } text-white`}
          />
          {m.is_leader && (
            <span className="absolute -top-1 -right-0.5 text-[0.55rem] leading-none">⚡</span>
          )}
        </div>
      ))}
      {overflow > 0 && (
        <div className="w-8 h-8 rounded-full bg-white/20 ring-1 ring-white/30 flex items-center justify-center text-[0.65rem] font-bold text-white shrink-0 -ml-4">
          +{overflow}
        </div>
      )}
    </div>
  );
}

interface Props {
  project: ProjectDetail;
  onGoToChat: () => void;
  onGoToTasks: () => void;
  onGoToFiles: () => void;
}

export function PanelGenel({ project, onGoToChat, onGoToFiles }: Props) {
  const meta = [
    project.city && `📍 ${project.city}`,
    project.is_remote && '🌐 Remote',
    project.category && `📂 ${project.category}`,
    project.members.length > 0 && `👥 ${project.members.length} kişilik ekip`,
  ]
    .filter(Boolean)
    .join(' · ');

  // Üye listesi: ekip varsa team_members, yoksa creator + dolu roller
  const memberSlots: MemberSlot[] = (() => {
    const raw: MemberSlot[] = project.members.length > 0
      ? project.members.map((m) => ({
          id: m.user_id,
          name: m.name,
          avatar_url: m.avatar_url,
          badge_url: m.badge_url,
          is_leader: m.is_leader,
        }))
      : [{
          id: project.leader_id,
          name: project.leader_name,
          avatar_url: project.leader_avatar,
          badge_url: null,
          is_leader: true,
        }];
    const seen = new Set<string>();
    return raw.filter((m) => {
      if (seen.has(m.id)) return false;
      seen.add(m.id);
      return true;
    });
  })();

  return (
    <div id="panel-genel">
      {/* Project Header + Team Bar */}
      <div className="mb-[1.2rem]">
        <div
          id="project-header"
          className="bg-gradient-to-br from-blue-700 to-indigo-500 rounded-t-2xl px-[1.8rem] py-[1.5rem] flex items-center justify-between flex-wrap gap-4 sm:flex-row flex-col text-center sm:text-left"
        >
          <div>
            <h2 className="font-nunito font-black text-[1.2rem] text-white mb-1">{project.title}</h2>
            {meta && <p className="text-[0.82rem] text-white/70">{meta}</p>}
          </div>
          <div className="flex gap-3 items-center sm:ml-auto">
            <MemberStrip members={memberSlots} />
          </div>
        </div>

        {/* Team Bar */}
        {project.roles.length > 0 && (
          <TeamBarSection roles={project.roles} leaderName={project.leader_name} />
        )}
      </div>

      {/* 2-col grid */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-[1.2rem] items-start">
        {/* Left column */}
        <div className="flex flex-col gap-[1.2rem]">
          {/* Project info card */}
          <ProjectInfoCard project={project} />

          {/* Active Tasks card */}
          {/* <div
            id="active-tasks-card"
            className="bg-white border-[1.5px] border-slate-200 rounded-2xl overflow-hidden"
          >
            <div className="flex items-center justify-between px-[1.2rem] py-[1rem] border-b border-slate-200">
              <span className="font-nunito text-[0.9rem] font-black text-black">✅ Aktif Görevler</span>
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
          </div> */}

          {/* Polls card */}
          {/* <div
            id="polls-card"
            className="bg-white border-[1.5px] border-slate-200 rounded-2xl overflow-hidden"
          >
            <div className="flex items-center justify-between px-[1.2rem] py-[1rem] border-b border-slate-200">
              <span className="font-nunito text-[0.9rem] font-black text-black">🗳 Açık Kararlar</span>
              <span className="text-[0.75rem] font-bold text-blue-600 cursor-pointer">+ Yeni Karar</span>
            </div>
            <div className="px-[1.2rem] py-[1rem] text-[0.82rem] text-slate-400">
              Oylama özelliği yakında geliyor.
            </div>
          </div> */}
        </div>

        {/* Right column */}
        <div className="flex flex-col gap-[1.2rem]">
          {/* Team card */}
          {/* <div
            id="team-card"
            className="bg-white border-[1.5px] border-slate-200 rounded-2xl overflow-hidden"
          >
            <div className="flex items-center justify-between px-[1.2rem] py-[1rem] border-b border-slate-200">
              <span className="font-nunito text-[0.9rem] font-black text-black">👥 Ekip</span>
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
          </div> */}

          {/* Files preview card */}
          <div
            id="files-preview-card"
            className="bg-white border-[1.5px] border-slate-200 rounded-2xl overflow-hidden"
          >
            <div className="flex items-center justify-between px-[1.2rem] py-[1rem] border-b border-slate-200">
              <span className="font-nunito text-[0.9rem] font-black text-black">📁 Dosyalar & Linkler</span>
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
