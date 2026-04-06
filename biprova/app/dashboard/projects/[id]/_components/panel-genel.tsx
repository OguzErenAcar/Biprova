import type { ProjectDetail } from '@/features/projects/actions';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

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
      ? { icon: '🌐', label: 'Çalışma Şekli', value: 'Remote uyumlu' }
      : { icon: '🏢', label: 'Çalışma Şekli', value: 'Yüz yüze' },
    project.category
      ? { icon: '📂', label: 'Kategori', value: project.category }
      : null,
    { icon: '📅', label: 'Oluşturulma', value: formatDate(project.created_at) },
  ].filter(Boolean) as { icon: string; label: string; value: string }[];

  return (
    <Card className="overflow-hidden">
      <CardHeader className="px-[1.2rem] py-[1rem] border-b border-slate-200">
        <CardTitle className="font-nunito text-[0.9rem] font-black">📄 Proje Hakkında</CardTitle>
      </CardHeader>
      <CardContent className="px-[1.2rem] py-[1rem] flex flex-col gap-4">
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
      </CardContent>
    </Card>
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
  is_leader: boolean;
}

function MemberStrip({ members }: { members: MemberSlot[] }) {
  if (members.length === 0) return null;
  const MAX = 6;
  const visible = members.slice(0, MAX);
  const overflow = members.length - MAX;

  return (
    <div className="flex items-center gap-1.5">
      {visible.map((m) => (
        <div
          key={m.id}
          title={`${m.name}${m.is_leader ? ' (Lider)' : ''}`}
          className={`relative w-8 h-8 rounded-full flex items-center justify-center text-[0.7rem] font-extrabold shrink-0 ${
            m.is_leader
              ? 'bg-orange-400 ring-2 ring-white'
              : 'bg-white/20 ring-1 ring-white/40'
          } text-white`}
        >
          {m.avatar_url ? (
            <img
              src={m.avatar_url}
              alt={m.name}
              className="w-full h-full rounded-full object-cover"
            />
          ) : (
            getInitials(m.name)
          )}
          {m.is_leader && (
            <span className="absolute -top-1 -right-0.5 text-[0.55rem] leading-none">⚡</span>
          )}
        </div>
      ))}
      {overflow > 0 && (
        <div className="w-8 h-8 rounded-full bg-white/20 ring-1 ring-white/30 flex items-center justify-center text-[0.65rem] font-bold text-white shrink-0">
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

export function PanelGenel({ project, onGoToChat, onGoToTasks: _onGoToTasks, onGoToFiles }: Props) {
  const meta = [
    project.city && `📍 ${project.city}`,
    project.is_remote && '🌐 Remote',
    project.category && `📂 ${project.category}`,
    project.members.length > 0 && `👥 ${project.members.length} kişilik ekip`,
  ]
    .filter(Boolean)
    .join(' · ');

  const memberSlots: MemberSlot[] = (() => {
    const raw: MemberSlot[] = project.team_id
      ? project.members.map((m) => ({
          id: m.user_id,
          name: m.name,
          avatar_url: m.avatar_url,
          is_leader: m.is_leader,
        }))
      : [
          {
            id: project.leader_id,
            name: project.leader_name,
            avatar_url: project.leader_avatar,
            is_leader: true,
          },
          ...project.roles
            .filter((r) => r.is_filled && r.filled_by && r.filled_by !== project.leader_id)
            .map((r) => ({
              id: r.filled_by!,
              name: r.filled_by_name ?? '?',
              avatar_url: r.filled_by_avatar,
              is_leader: false,
            })),
        ];
    const seen = new Set<string>();
    return raw.filter((m) => {
      if (seen.has(m.id)) return false;
      seen.add(m.id);
      return true;
    });
  })();

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
        <div className="flex gap-3 items-center ml-auto">
          <MemberStrip members={memberSlots} />
          {project.team_id && (
            <Button
              variant="outline"
              size="sm"
              onClick={onGoToChat}
              className="bg-white/15 text-white border-white/25 font-nunito font-extrabold text-[0.8rem] hover:bg-white/25 hover:text-white hover:border-white/40"
            >
              💬 Gruba Git
            </Button>
          )}
        </div>
      </div>

      {/* 2-col grid */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-[1.2rem] items-start">
        {/* Left column */}
        <div className="flex flex-col gap-[1.2rem]">
          <ProjectInfoCard project={project} />
        </div>

        {/* Right column */}
        <div className="flex flex-col gap-[1.2rem]">
          {/* Files preview card */}
          <Card className="overflow-hidden" id="files-preview-card">
            <CardHeader className="px-[1.2rem] py-[1rem] border-b border-slate-200 flex-row items-center justify-between space-y-0">
              <CardTitle className="font-nunito text-[0.9rem] font-black">📁 Dosyalar & Linkler</CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={onGoToFiles}
                className="text-[0.75rem] font-bold text-blue-600 h-auto py-0.5"
              >
                Tümü →
              </Button>
            </CardHeader>
            <CardContent className="px-[1.2rem] py-[1rem] text-[0.82rem] text-slate-400">
              Dosya özelliği yakında geliyor.
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
