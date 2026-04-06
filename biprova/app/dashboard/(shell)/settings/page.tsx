import { SidebarAccountActions } from "@/components/shared/sidebar-account-actions";

export default function SettingsPage() {
  return (
    <div className="flex flex-col gap-6 max-w-lg">
      <h1 className="font-nunito font-black text-[1.3rem] text-slate-900">Ayarlar</h1>

      <div className="bg-white border border-slate-200 rounded-2xl p-5">
        <div className="text-[0.68rem] font-bold tracking-[2px] uppercase text-slate-400 mb-3">
          Hesap
        </div>
        <SidebarAccountActions />
      </div>
    </div>
  );
}
