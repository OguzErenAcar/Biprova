const TEAM_MEMBERS = [
  {
    initials: "AK",
    bgClass: "bg-gradient-to-br from-blue-600 to-indigo-500",
    name: "Ahmet K.",
    role: "UI/UX Tasarımcı",
    isSelf: true,
    isLeader: false,
    online: true,
  },
  {
    initials: "ME",
    bgClass: "bg-violet-500",
    name: "Mert E.",
    role: "Yönetmen",
    isSelf: false,
    isLeader: false,
    online: true,
  },
  {
    initials: "SY",
    bgClass: "bg-green-500",
    name: "Selin Y.",
    role: "Kameraman",
    isSelf: false,
    isLeader: false,
    online: false,
  },
  {
    initials: "BT",
    bgClass: "bg-amber-500",
    name: "Berk T.",
    role: "Ses Tasarımcı",
    isSelf: false,
    isLeader: true,
    online: true,
  },
];

export function ActiveTeamWidget() {
  return (
    <div className="bg-white border-[1.5px] border-slate-200 rounded-2xl p-[1.3rem]">
      <div className="font-nunito font-black text-[0.95rem] text-slate-900 mb-4 flex items-center justify-between">
        ⚡ Aktif Ekibim
        <span className="text-[0.75rem] text-blue-600 font-bold font-jakarta cursor-pointer">
          Gruba Git
        </span>
      </div>

      <div className="flex flex-col">
        {TEAM_MEMBERS.map((m, i) => (
          <div
            key={i}
            className="flex items-center gap-[0.7rem] py-[0.55rem] border-b border-slate-100 last:border-b-0 last:pb-0 first:pt-0"
          >
            <div
              className={`w-8 h-8 rounded-full font-nunito font-black text-[0.75rem] text-white flex items-center justify-center flex-shrink-0 ${m.bgClass}`}
            >
              {m.initials}
            </div>
            <div className="flex-1">
              <div className="text-[0.84rem] font-bold text-slate-900">
                {m.name}
                {m.isSelf && (
                  <span className="text-[0.7rem] text-green-500 ml-1">(Sen)</span>
                )}
                {m.isLeader && (
                  <span className="text-[0.7rem] text-amber-500 ml-1">⚡ Leader</span>
                )}
              </div>
              <div className="text-[0.72rem] text-slate-500">{m.role}</div>
            </div>
            <div
              className={`w-2 h-2 rounded-full flex-shrink-0 ${
                m.online ? "bg-green-500" : "bg-slate-300"
              }`}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
