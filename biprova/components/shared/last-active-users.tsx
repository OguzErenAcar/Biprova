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

export async function LastActiveUsers() {
  const users = await fetchLastActiveUsers();

  if (users.length === 0) return null;

  return (
    <div className="rounded-2xl mb-4 overflow-hidden">
      <div className="px-4 py-2.5 border-b border-slate-800 flex items-center gap-2">
        <span className="relative flex size-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
          <span className="relative inline-flex rounded-full size-2 bg-green-500" />
        </span>
        <span className="text-[0.78rem] font-semibold text-white tracking-wide uppercase">
          Son katılanlar
        </span>
      </div>

      <div className="flex items-center px-3 py-2">
        {users.map((u, i) => (
          <Link
            key={u.id}
            href={`/dashboard/profile/${u.id}`}
            className="flex flex-col items-center gap-1 no-underline group flex-1 min-w-0 py-1 rounded-lg hover:bg-white/10 transition-colors"
            style={{ marginLeft: i === 0 ? 0 : "-8px", zIndex: i }}
          >
            <UserAvatar
              avatarUrl={u.avatar_url}
              initials={getInitials(u.name)}
              badge={u.badge_url}
              size={32}
              className="text-[0.6rem] ring-2 ring-black group-hover:ring-blue-500 transition-all duration-200"
            />
            <span className="text-[0.58rem] font-medium text-white truncate w-full text-center px-0.5 transition-colors">
              {u.name.split(" ")[0]}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
