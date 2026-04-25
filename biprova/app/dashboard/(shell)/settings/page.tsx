import { User, Shield } from "lucide-react";
import { SidebarAccountActions } from "@/components/shared/sidebar-account-actions";

export default function SettingsPage() {
  return (
    <div className="flex flex-col gap-6 max-w-xl pb-10 md:pe-8">
      <h1 className="font-nunito font-black text-h2 text-ink">Ayarlar</h1>

      <div className="bg-white border-[1.5px] border-slate-200 rounded-xl p-4 md:p-[1.8rem]">
        <div className="font-nunito font-black text-xl md:text-2xl text-slate-900 mb-0.5 flex items-center gap-[0.45rem]">
          <span className="text-slate-500"><User size={20} /></span>
          Hesap
        </div>
        <div className="text-sm md:text-base text-slate-400 mb-5">
          Oturum ve hesap yönetimi
        </div>
        <SidebarAccountActions />
      </div>

      <div className="bg-white border-[1.5px] border-slate-200 rounded-xl p-4 md:p-[1.8rem]">
        <div className="font-nunito font-black text-xl md:text-2xl text-slate-900 mb-0.5 flex items-center gap-[0.45rem]">
          <span className="text-slate-500"><Shield size={20} /></span>
          Gizlilik
        </div>
        <div className="text-sm md:text-base text-slate-400 mb-5">
          Profil görünürlüğü ayarları profilinden yönetilebilir.
        </div>
        <div className="text-sm text-ink-subtle">
          Profilin → görünürlük toggle&apos;larını kullanarak projenlerini, başvurularını ve ekip bilgilerini kimlerin göreceğini ayarlayabilirsin.
        </div>
      </div>
    </div>
  );
}
