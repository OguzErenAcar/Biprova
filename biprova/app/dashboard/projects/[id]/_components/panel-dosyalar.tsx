import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export function PanelDosyalar() {
  return (
    <div id="panel-dosyalar">
      <Card className="overflow-hidden">
        <CardHeader className="px-[1.2rem] py-[1rem] border-b border-slate-200 flex-row items-center justify-between space-y-0">
          <CardTitle className="font-nunito text-lead font-black">📁 Dosyalar & Linkler</CardTitle>
          <Button variant="ghost" size="sm" className="text-meta font-bold text-blue-600 h-auto py-0.5">
            + Ekle
          </Button>
        </CardHeader>
        <CardContent className="px-[1.2rem] py-[1rem]">
          <Button
            variant="outline"
            className="w-full border-dashed text-caption font-bold text-slate-400 hover:border-blue-600 hover:text-blue-600 hover:bg-blue-50"
          >
            ＋ Dosya veya link ekle
          </Button>
          <p className="text-caption text-slate-400 mt-3">Dosya özelliği yakında geliyor.</p>
        </CardContent>
      </Card>
    </div>
  );
}
