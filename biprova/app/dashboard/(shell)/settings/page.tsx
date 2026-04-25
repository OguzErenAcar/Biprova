import { User, Bell, Mail, Shield, Info } from "lucide-react";
import { SidebarAccountActions } from "@/components/shared/sidebar-account-actions";
import { NotificationToggles } from "./_components/notification-toggles";
import { getNotificationPreferences } from "@/features/users/actions";

export default function SettingsPage() {
  return (
    <div className="flex flex-col gap-6 max-w-full pb-10 md:pe-8">
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
          <span className="text-slate-500"><Bell size={20} /></span>
          Bildirimler
        </div>
        <div className="text-sm md:text-base text-slate-400 mb-5">
          Başvuru, ekip ve mesaj bildirimlerini yönet
        </div>
        <NotificationToggles />
      </div>

      <div className="bg-white border-[1.5px] border-slate-200 rounded-xl p-4 md:p-[1.8rem]">
        <div className="font-nunito font-black text-xl md:text-2xl text-slate-900 mb-0.5 flex items-center gap-[0.45rem]">
          <span className="text-slate-500"><Mail size={20} /></span>
          E-posta Tercihleri
        </div>
        <div className="text-sm md:text-base text-slate-400">
          Hangi durumlarda e-posta almak istediğini belirle
        </div>
      </div>

      <div className="bg-white border-[1.5px] border-slate-200 rounded-xl p-4 md:p-[1.8rem]">
        <div className="font-nunito font-black text-xl md:text-2xl text-slate-900 mb-0.5 flex items-center gap-[0.45rem]">
          <span className="text-slate-500"><Shield size={20} /></span>
          Gizlilik
        </div>
        <div className="text-sm md:text-base text-slate-400">
          Profilin → görünürlük toggle&apos;larından projen, başvurun ve ekip bilgilerini kimlerin göreceğini ayarlayabilirsin
        </div>
      </div>

      <div className="bg-white border-[1.5px] border-slate-200 rounded-xl p-4 md:p-[1.8rem]">
        <div className="font-nunito font-black text-xl md:text-2xl text-slate-900 mb-0.5 flex items-center gap-[0.45rem]">
          <span className="text-slate-500"><Info size={20} /></span>
          Hakkında & Yasal
        </div>
        <div className="text-sm md:text-base text-slate-400">
          Gizlilik politikası, kullanım şartları ve KVKK
        </div>
      </div>
    </div>
  );
}
