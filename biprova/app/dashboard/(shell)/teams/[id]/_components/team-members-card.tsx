import Link from "next/link";
import { TeamMemberDetail } from "@/features/teams/actions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { UserAvatar } from "@/components/shared/user-avatar";

interface TeamMembersCardProps {
  members: TeamMemberDetail[];
}

export function TeamMembersCard({ members }: TeamMembersCardProps) {
  return (
    <Card className="mb-5">
      <CardHeader className="pb-0">
        <CardTitle className="font-nunito font-black text-base text-ink">
          Üyeler
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-4">
        {members.length === 0 ? (
          <p className="text-body text-ink-subtle">Henüz üye yok.</p>
        ) : (
          members.map((member, i) => (
            <Link
              key={member.id}
              href={`/dashboard/profile/${member.user_id}`}
              className={`flex items-center gap-3 py-3 hover:bg-slate-50 rounded-lg px-1 -mx-1 transition-colors ${i < members.length - 1 ? "border-b border-edge" : ""} ${i === 0 ? "pt-0" : ""}`}
            >
              <UserAvatar
                avatarUrl={member.avatar_url}
                alt={member.name}
                size={36}
              />
              <div className="flex-1 min-w-0">
                <div className="text-lead font-bold text-ink">{member.name}</div>
                {member.role_name && (
                  <div className="text-caption text-ink-muted">{member.role_name}</div>
                )}
              </div>
              {member.is_leader && (
                <Badge
                  variant="outline"
                  className="bg-brand-surface text-brand border-brand-surface font-bold text-meta shrink-0"
                >
                  Lider
                </Badge>
              )}
            </Link>
          ))
        )}
      </CardContent>
    </Card>
  );
}
