import { getActiveTeam } from '@/features/teams/actions'

const AVATAR_COLORS = [
  'bg-gradient-to-br from-blue-600 to-indigo-500',
  'bg-violet-500',
  'bg-green-500',
  'bg-amber-500',
  'bg-rose-500',
  'bg-cyan-500',
]

function getAvatarColor(id: string): string {
  const index = id.charCodeAt(0) % AVATAR_COLORS.length
  return AVATAR_COLORS[index]
}

export async function ActiveTeamWidget() {
  const team = await getActiveTeam()

  return (
    <div id="active-team-widget" className="bg-white border-[1.5px] border-slate-200 rounded-2xl p-[1.3rem]">
      <div className="font-nunito font-black text-lead text-slate-900 mb-4 flex items-center justify-between">
        ⚡ Aktif Ekibim
        <span className="text-meta text-blue-600 font-bold font-jakarta cursor-pointer">
          Gruba Git
        </span>
      </div>

      {!team ? (
        <p className="text-caption text-slate-400 text-center py-4">Aktif ekip yok</p>
      ) : (
        <div className="flex flex-col">
          {team.members.map((m) => (
            <div
              key={m.id}
              className="flex items-center gap-[0.7rem] py-[0.55rem] border-b border-slate-100 last:border-b-0 last:pb-0 first:pt-0"
            >
              <div
                className={`w-8 h-8 rounded-full font-nunito font-black text-meta text-white flex items-center justify-center flex-shrink-0 ${getAvatarColor(m.id)}`}
              >
                {m.initials}
              </div>
              <div className="flex-1">
                <div className="text-body font-bold text-slate-900">
                  {m.name}
                  {m.isSelf && (
                    <span className="text-label text-green-500 ml-1">(Sen)</span>
                  )}
                  {m.isLeader && (
                    <span className="text-label text-amber-500 ml-1">⚡ Leader</span>
                  )}
                </div>
                <div className="text-meta text-slate-500">{m.role}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
