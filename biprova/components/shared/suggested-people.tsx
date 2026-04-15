import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { UserAvatar } from "@/components/shared/user-avatar";

interface RecentUser {
  id: string;
  name: string;
  avatar_url: string | null;
  badge: string | null;
}

function getInitials(name: string) {
  return name
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

async function getRecentUsers(): Promise<RecentUser[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("users")
    .select("id, name, avatar_url, badge")
    .order("created_at", { ascending: false })
    .limit(5);
  return (data as RecentUser[]) ?? [];
}

export async function SuggestedPeople() {
  const users = await getRecentUsers();

  return (
    <div className="bg-surface border g-bg border-slate-400 rounded-2xl shadow-sm overflow-hidden w-[272]">
      <div className="px-[1.2rem] py-[1rem] border-b border-slate-200">
        <span className="font-display text-lg font-black text-ink">Önerilenler</span>
      </div>

      {users.length === 0 ? (
        <div className="px-[1.2rem] py-[1rem] text-label text-ink text-center">
          Önerilecek kimse yok.
        </div>
      ) : (
        <div className="  ">
          {users.map((u) => (
            <Link
              key={u.id}
              href={`/dashboard/profile/${u.id}`}
              className="flex items-center gap-3 px-[1.2rem] py-[0.75rem] hover:bg-slate-50 hover:text-black transition-colors no-underline"
            >
              <UserAvatar
                avatarUrl={u.avatar_url}
                initials={getInitials(u.name)}
                size={32}
                className="text-[0.72rem]"
              />
              <div className="flex-1 min-w-0 ">
                <div className="text-caption font-bold text-ink truncate">{u.name}</div>
                {u.badge && (
                  <div className="text-label text-ink truncate">{u.badge}</div>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
