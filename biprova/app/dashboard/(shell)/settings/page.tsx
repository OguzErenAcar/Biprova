import { SidebarAccountActions } from "@/components/shared/sidebar-account-actions";
import { Card, CardContent } from "@/components/ui/card";

export default function SettingsPage() {
  return (
    <div className="flex flex-col gap-6 max-w-lg">
      <h1 className="font-nunito font-black text-[1.3rem] text-slate-900">Ayarlar</h1>

      <Card>
        <CardContent className="pt-5">
          <div className="text-[0.68rem] font-bold tracking-[2px] uppercase text-slate-400 mb-3">
            Hesap
          </div>
          <SidebarAccountActions />
        </CardContent>
      </Card>
    </div>
  );
}
