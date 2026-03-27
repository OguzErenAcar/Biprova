interface DetailRowProps {
  icon: string;
  label: string;
  value: string;
  last?: boolean;
}

interface RoleRowProps {
  name: string;
  initials: string;
  gradient: string;
  person: string;
  last?: boolean;
}

function DetailRow({ icon, label, value, last }: DetailRowProps) {
  return (
    <div
      className={`flex items-center gap-[0.55rem] text-[0.82rem] text-slate-400 py-[0.38rem] ${
        !last ? "border-b border-slate-200" : ""
      }`}
    >
      <span className="text-[0.88rem] w-[18px] text-center">{icon}</span>
      {label}
      <span className="font-semibold text-slate-900 ml-auto">{value}</span>
    </div>
  );
}

function RoleRow({ name, initials, gradient, person, last }: RoleRowProps) {
  return (
    <div
      className={`flex items-center gap-[0.65rem] py-[0.55rem] ${
        !last ? "border-b border-slate-200" : ""
      }`}
    >
      <div className="w-2 h-2 rounded-full bg-blue-600 shrink-0" />
      <div className="text-[0.82rem] font-bold text-slate-900 flex-1">{name}</div>
      <div className="flex items-center gap-[0.4rem] text-[0.75rem] text-slate-400">
        <div
          className={`w-5 h-5 rounded-full flex items-center justify-center font-nunito font-black text-[0.55rem] text-white bg-gradient-to-br ${gradient}`}
        >
          {initials}
        </div>
        {person}
      </div>
    </div>
  );
}

export function ProjectDetailPanel() {
  return (
    <div className="flex-1 overflow-y-auto px-[1.4rem] py-[1.2rem] flex flex-col gap-4">
      <div className="bg-white border-[1.5px] border-slate-200 rounded-[14px] p-[1.1rem_1.25rem]">
        <div className="font-nunito font-black text-[0.9rem] text-slate-900 mb-[0.85rem] flex items-center gap-[0.4rem]">
          📋 Proje Bilgisi
        </div>
        <DetailRow icon="📍" label="Şehir" value="İstanbul" />
        <DetailRow icon="🏷️" label="Kategori" value="Mobil Uygulama" />
        <DetailRow icon="🌐" label="Çalışma" value="Remote" />
        <DetailRow icon="📅" label="Oluşturuldu" value="24 Mart 2026" />
        <DetailRow icon="🚀" label="Kickoff" value="—" last />
      </div>

      <div className="bg-white border-[1.5px] border-slate-200 rounded-[14px] p-[1.1rem_1.25rem]">
        <div className="font-nunito font-black text-[0.9rem] text-slate-900 mb-[0.85rem] flex items-center gap-[0.4rem]">
          👥 Ekip & Roller
        </div>
        <div className="flex flex-col">
          <RoleRow name="Proje Lideri" initials="ZK" gradient="from-blue-600 to-indigo-500" person="Zeynep K." />
          <RoleRow name="Frontend Developer" initials="SK" gradient="from-cyan-600 to-green-500" person="Selin K." />
          <RoleRow name="Backend Developer" initials="AY" gradient="from-violet-700 to-pink-500" person="Ali Y." />
          <RoleRow name="UI / UX Tasarımcı" initials="MB" gradient="from-amber-500 to-red-500" person="Merve B." last />
        </div>
      </div>

      <div className="bg-white border-[1.5px] border-slate-200 rounded-[14px] p-[1.1rem_1.25rem]">
        <div className="font-nunito font-black text-[0.9rem] text-slate-900 mb-[0.85rem] flex items-center gap-[0.4rem]">
          📝 Proje Açıklaması
        </div>
        <p className="text-[0.84rem] text-slate-400 leading-[1.65] m-0">
          İstanbul&apos;daki sokak hayvanlarını harita üzerinde takip edebileceğimiz, mama bırakma
          noktalarını işaretleyebileceğimiz ve gönüllülerin koordineli çalışmasını sağlayacak bir
          mobil uygulama. Expo + Node.js + PostGIS stack.
        </p>
      </div>
    </div>
  );
}
