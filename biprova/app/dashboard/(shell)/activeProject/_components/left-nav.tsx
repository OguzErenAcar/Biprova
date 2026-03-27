type Panel = "chat" | "posts" | "detail";

interface LeftNavProps {
  activePanel: Panel;
  onSwitch: (panel: Panel) => void;
}

interface NavItemProps {
  icon: string;
  label: string;
  active: boolean;
  onClick: () => void;
}

function NavItem({ icon, label, active, onClick }: NavItemProps) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-[0.6rem] px-[0.65rem] py-[0.6rem] rounded-[9px] text-[0.875rem] font-semibold cursor-pointer transition-all mb-[0.1rem] w-full text-left ${
        active
          ? "bg-blue-50 text-blue-600"
          : "text-slate-400 hover:bg-slate-50 hover:text-slate-900"
      }`}
    >
      <span className="text-base w-5 text-center">{icon}</span>
      {label}
    </button>
  );
}

export function LeftNav({ activePanel, onSwitch }: LeftNavProps) {
  return (
    <div className="w-[200px] bg-white border-r border-slate-200 flex flex-col shrink-0 p-[0.85rem_0.75rem] max-lg:hidden">
      <div className="text-[0.65rem] font-bold tracking-[2px] uppercase text-slate-300 px-2 mb-[0.35rem] mt-[0.1rem]">
        Proje
      </div>
      <NavItem icon="💬" label="Sohbet" active={activePanel === "chat"} onClick={() => onSwitch("chat")} />
      <NavItem icon="📢" label="Gönderiler" active={activePanel === "posts"} onClick={() => onSwitch("posts")} />
      <NavItem icon="📋" label="Proje Detayı" active={activePanel === "detail"} onClick={() => onSwitch("detail")} />
    </div>
  );
}
