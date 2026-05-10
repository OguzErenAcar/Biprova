import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { resolveBadgeUrls } from "@/lib/badge";
import { UserAvatar } from "@/components/shared/user-avatar";

interface ActiveUser {
  id: string;
  name: string;
  avatar_url: string | null;
  badge: string | null;
  badge_url: string | null;
}

function getInitials(name: string) {
  return name
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

async function fetchLastActiveUsers(): Promise<ActiveUser[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("users")
    .select("id, name, avatar_url, badge")
    .order("last_seen_at", { ascending: false, nullsFirst: false })
    .limit(5);

  const rows = (data ?? []) as Omit<ActiveUser, "badge_url">[];
  const badgeMap = await resolveBadgeUrls(supabase, rows.map((u) => u.badge));

  return rows.map((u) => ({
    ...u,
    badge_url: badgeMap.get(u.badge ?? "") ?? null,
  }));
}

interface LastActiveUsersProps {
  variant?: "dark" | "light";
}

export async function LastActiveUsers({ variant = "light" }: LastActiveUsersProps) {
  const users = await fetchLastActiveUsers();

  if (users.length === 0) return null;

  const isDark = variant === "dark";

  return (
    <div className="rounded-2xl mb-4 overflow-hidden">
      <div className={`px-4 py-2.5 border-b flex items-center gap-2 ${isDark ? "border-white/20" : "border-slate-200"}`}>
        <span className="relative flex size-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
          <span className="relative inline-flex rounded-full size-2 bg-green-500" />
        </span>
        <span className={`text-[0.78rem] font-semibold tracking-wide uppercase ${isDark ? "text-white/60" : "text-slate-400"}`}>
          Son katılanlar
        </span>
      </div>

      <div className="flex items-center px-3 py-2">
        {users.map((u, i) => (
          <Link
            key={u.id}
            href={`/dashboard/profile/${u.id}`}
            className={`flex flex-col items-center gap-1 no-underline group flex-1 min-w-0 py-1 rounded-lg transition-colors ${isDark ? "hover:bg-white/10" : "hover:bg-slate-100"}`}
            style={{ marginLeft: i === 0 ? 0 : "-8px", zIndex: i }}
          >
            <UserAvatar
              avatarUrl={u.avatar_url}
              initials={getInitials(u.name)}
              badge={u.badge_url}
              size={32}
              className="text-[0.6rem] ring-2 ring-transparent group-hover:ring-blue-500 transition-all duration-200"
            />
            <span className={`text-[0.58rem] font-medium truncate w-full text-center px-0.5 transition-colors ${isDark ? "text-white/70 group-hover:text-white" : "text-slate-500 group-hover:text-slate-800"}`}>
              {u.name.split(" ")[0]}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
