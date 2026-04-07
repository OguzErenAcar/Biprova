"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export function PanelGorevler() {
  return (
    <div id="panel-gorevler">
      <Card className="overflow-hidden">
        <CardHeader className="px-[1.2rem] py-[1rem] border-b border-slate-200 flex-row items-center justify-between space-y-0">
          <CardTitle className="font-nunito text-lead font-black">✅ Tüm Görevler</CardTitle>
          <Button size="sm" className="font-nunito font-extrabold text-caption">
            + Görev Ekle
          </Button>
        </CardHeader>
        <CardContent id="task-list" className="px-[1.2rem] py-[1rem]">
          <p className="text-body text-slate-400">Görev özelliği yakında geliyor.</p>
        </CardContent>
      </Card>
    </div>
  );
}
