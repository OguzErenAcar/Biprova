interface StatCardProps {
  value: number;
  label: string;
}

function StatCard({ value, label }: StatCardProps) {
  return (
    <div className="bg-white border border-slate-200 rounded-[14px] p-[1.1rem] text-center">
      <div className="font-nunito font-black text-[1.7rem] text-blue-600 leading-none mb-1.5">
        {value}
      </div>
      <div className="text-[0.78rem] text-slate-500 font-semibold">{label}</div>
    </div>
  );
}

export function ProfileStats() {
  return (
    <div className="grid grid-cols-3 gap-3 mb-5">
      <StatCard value={5} label="Açılan Proje" />
      <StatCard value={3} label="Kurulan Ekip" />
      <StatCard value={2} label="Tamamlanan" />
    </div>
  );
}
