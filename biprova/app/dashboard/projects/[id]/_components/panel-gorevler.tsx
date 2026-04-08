"use client";

export function PanelGorevler() {
  return (
    <div id="panel-gorevler">
      <div className="bg-white border-[1.5px] border-slate-200 rounded-2xl overflow-hidden">
        <div className="flex items-center justify-between px-[1.2rem] py-[1rem] border-b border-slate-200">
          <span className="font-nunito text-[0.9rem] font-black">✅ Tüm Görevler</span>
          <button className="bg-blue-600 text-white border-none rounded-[8px] font-nunito font-extrabold text-[0.8rem] px-[0.9rem] py-[0.4rem] cursor-pointer">
            + Görev Ekle
          </button>
        </div>
        <div id="task-list" className="px-[1.2rem] py-[1rem]">
          <p className="text-[0.84rem] text-slate-400">Görev özelliği yakında geliyor.</p>
        </div>
      </div>
    </div>
  );
}
