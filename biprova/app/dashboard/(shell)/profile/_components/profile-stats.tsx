import { UserStats } from '@/features/users/actions';
import { Card, CardContent } from "@/components/ui/card";

interface StatCardProps {
  value: number;
  label: string;
}

function StatCard({ value, label }: StatCardProps) {
  return (
    <Card>
      <CardContent className="md:p-[1.1rem] text-center">
        <div className=" text-hero text-ink leading-none mb-1.5">
          {value}
        </div>
        <div className="text-caption text-ink-muted font-semibold">{label}</div>
      </CardContent>
    </Card>
  );
}

export function ProfileStats({ stats }: { stats: UserStats }) {
  return (
    <div id="profile-stats" className="grid grid-cols-2 gap-3 mb-5">
      <StatCard value={stats.projectCount} label="Açılan Proje" />
      <StatCard value={stats.teamCount} label="Kurulan Ekip" />
    </div>
  );
}
