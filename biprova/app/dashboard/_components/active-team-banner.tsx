import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const AVATARS = [
  { initials: "AK", color: "#3b82f6" },
  { initials: "ME", color: "#8b5cf6" },
  { initials: "SY", color: "#22c55e" },
  { initials: "BT", color: "#f59e0b" },
];

export function ActiveTeamBanner() {
  return (
    <div id="active-team-banner" className="bg-gradient-to-br from-blue-700 to-indigo-500 rounded-2xl px-[1.6rem] py-[1.4rem] mb-6 flex items-center justify-between gap-4 flex-wrap">
      <div className="flex items-center gap-4">
        <div className="w-11 h-11 bg-white/15 rounded-xl flex items-center justify-center text-h2 flex-shrink-0">
          🎬
        </div>
        <div>
          <div className="font-nunito font-black text-lead text-white mb-0.5">
            Kısa Film Projesi — Aktif Ekibindesin!
          </div>
          <div className="text-caption text-white/70">
            İstanbul · 4 kişilik ekip · Dün kuruldu
          </div>
        </div>
      </div>

      <div className="flex items-center gap-[0.6rem]">
        <div className="flex items-center">
          {AVATARS.map((av, i) => (
            <Avatar
              key={i}
              className="w-[30px] h-[30px] border-2 border-white/40 -ml-2 first:ml-0"
            >
              <AvatarFallback
                className="text-label font-nunito font-black text-white"
                style={{ background: av.color }}
              >
                {av.initials}
              </AvatarFallback>
            </Avatar>
          ))}
        </div>
        <Button
          variant="secondary"
          size="sm"
          className="bg-white text-blue-600 hover:bg-blue-50 font-nunito font-extrabold"
        >
          Gruba Git →
        </Button>
      </div>
    </div>
  );
}
