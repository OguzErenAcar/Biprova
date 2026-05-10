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
    .order("created_at", { ascending: false })
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
    <div className="flex items-center gap-4 px-1 py-3 mb-4 overflow-x-auto">
      <span className="text-label text-slate-400 whitespace-nowrap shrink-0">
        Son katılanlar
      </span>
      <div className="flex items-center gap-3">
        {users.map((u) => (
          <Link
            key={u.id}
            href={`/dashboard/profile/${u.id}`}
            className="flex flex-col items-center gap-1 no-underline group shrink-0"
          >
            <UserAvatar
              avatarUrl={u.avatar_url}
              initials={getInitials(u.name)}
              badge={u.badge_url}
              size={40}
              className="text-[0.72rem] ring-2 ring-transparent group-hover:ring-blue-400 transition-all"
            />
            <span className="text-[0.65rem] text-slate-500 group-hover:text-slate-800 truncate max-w-[56px] transition-colors">
              {u.name.split(" ")[0]}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
