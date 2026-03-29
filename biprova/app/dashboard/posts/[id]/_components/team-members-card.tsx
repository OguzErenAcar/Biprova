import type { TeamMemberDetail } from '@/features/teams/actions';

interface Props {
  members: TeamMemberDetail[];
  viewerId: string;
  isLeader: boolean;
  onGrantBiprova: (userId: string, name: string) => void;
  onKick: (userId: string, name: string) => void;
  onInvite: () => void;
}

const AVATAR_COLORS = [
  'bg-violet-500', 'bg-blue-500', 'bg-green-500', 'bg-yellow-500',
  'bg-red-500', 'bg-pink-500', 'bg-indigo-500', 'bg-teal-500',
];

function avatarColor(userId: string): string {
  let hash = 0;
  for (const ch of userId) hash = (hash * 31 + ch.charCodeAt(0)) & 0xffff;
  return AVATAR_COLORS[hash % AVATAR_COLORS.length];
}

function getInitials(name: string): string {
  return name.split(' ').slice(0, 2).map((w) => w[0]).join('').toUpperCase();
}

export function TeamMembersCard({ members, viewerId, isLeader, onGrantBiprova, onKick, onInvite }: Props) {
  return (
    <div id="team-members-card" className="bg-white border-[1.5px] border-slate-200 rounded-2xl overflow-hidden mb-[1.2rem]">
      <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200">
        <span className="font-nunito font-black text-[0.9rem]">👥 Üyeler</span>
        {isLeader && (
          <button
            onClick={onInvite}
            className="text-[0.75rem] font-bold text-blue-600 cursor-pointer bg-transparent border-none hover:underline"
          >
            + Üye Davet Et
          </button>
        )}
      </div>
      <div className="px-5 py-1">
        {members.map((member) => {
          const isSelf = member.user_id === viewerId;
          return (
            <div
              key={member.id}
              className="flex items-center gap-3 py-[0.7rem] border-b border-slate-100 last:border-0 group"
            >
              {/* Avatar */}
              <div className="relative shrink-0">
                <div className={`w-[38px] h-[38px] rounded-full flex items-center justify-center font-nunito font-black text-[0.8rem] text-white ${avatarColor(member.user_id)}`}>
                  {getInitials(member.name)}
                </div>
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="text-[0.86rem] font-bold text-slate-900 flex items-center gap-1.5 flex-wrap">
                  {member.name}
                  {isSelf && <span className="text-[0.68rem] text-blue-600">(Sen)</span>}
                  {member.is_leader && <span className="text-[0.68rem] text-orange-500 font-extrabold">⚡ Lider</span>}
                </div>
                {member.role_name && (
                  <div className="text-[0.72rem] text-slate-400 mt-0.5">{member.role_name}</div>
                )}
                {member.has_biprova && (
                  <div className="mt-0.5">
                    <span className="text-[0.62rem] font-extrabold px-[0.45rem] py-[0.12rem] rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                      biprova yetkili
                    </span>
                  </div>
                )}
              </div>

              {/* Actions (leader hover) */}
              {isLeader && !member.is_leader && (
                <div className="flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                  {!member.has_biprova && (
                    <button
                      onClick={() => onGrantBiprova(member.user_id, member.name)}
                      className="text-[0.7rem] font-bold px-[0.6rem] py-[0.25rem] rounded-[6px] bg-blue-50 text-blue-600 cursor-pointer border-none transition-colors hover:bg-blue-100"
                    >
                      biprova ver
                    </button>
                  )}
                  <button
                    onClick={() => onKick(member.user_id, member.name)}
                    className="text-[0.7rem] font-bold px-[0.6rem] py-[0.25rem] rounded-[6px] bg-red-50 text-red-500 cursor-pointer border-none transition-colors hover:bg-red-100"
                  >
                    Çıkar
                  </button>
                </div>
              )}
              {!isLeader && (
                <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                  <button className="text-[0.7rem] font-bold px-[0.6rem] py-[0.25rem] rounded-[6px] bg-slate-100 text-slate-500 cursor-pointer border-none">
                    Profil
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
