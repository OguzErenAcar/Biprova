import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

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
    <div className="bg-surface border border-slate-200 rounded-2xl shadow-sm overflow-hidden w-[272]">
      <div className="px-[1.2rem] py-[1rem] border-b border-slate-200">
        <span className="font-nunito text-body font-black">Önerilenler</span>
      </div>

      {users.length === 0 ? (
        <div className="px-[1.2rem] py-[1rem] text-caption text-slate-400 text-center">
          Önerilecek kimse yok.
        </div>
      ) : (
        <div className="divide-y divide-slate-100">
          {users.map((u) => (
            <Link
              key={u.id}
              href={`/dashboard/profile/${u.id}`}
              className="flex items-center gap-3 px-[1.2rem] py-[0.75rem] hover:bg-slate-50 transition-colors no-underline"
            >
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center font-nunito font-black text-[0.72rem] text-white shrink-0 overflow-hidden">
                {u.avatar_url ? (
                  <img src={u.avatar_url} alt={u.name} className="w-full h-full object-cover" />
                ) : (
                  getInitials(u.name)
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-caption font-bold text-slate-900 truncate">{u.name}</div>
                {u.badge && (
                  <div className="text-label text-slate-400 truncate">{u.badge}</div>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
