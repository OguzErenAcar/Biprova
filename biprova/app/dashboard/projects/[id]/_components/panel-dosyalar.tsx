export function PanelDosyalar() {
  return (
    <div id="panel-dosyalar">
      <div className="bg-white border-[1.5px] border-slate-200 rounded-2xl overflow-hidden">
        <div className="flex items-center justify-between px-[1.2rem] py-[1rem] border-b border-slate-200">
          <span className="font-nunito text-[0.9rem] font-black">📁 Dosyalar & Linkler</span>
          <span className="text-[0.75rem] font-bold text-blue-600 cursor-pointer">+ Ekle</span>
        </div>
        <div className="px-[1.2rem] py-[1rem]">
          <button className="w-full flex items-center justify-center gap-2 py-[0.65rem] border-[1.5px] border-dashed border-slate-200 rounded-[10px] text-[0.82rem] font-bold text-slate-400 cursor-pointer hover:border-blue-600 hover:text-blue-600 hover:bg-blue-50 transition-all bg-transparent">
            ＋ Dosya veya link ekle
          </button>
          <p className="text-[0.82rem] text-slate-400 mt-3">Dosya özelliği yakında geliyor.</p>
        </div>
      </div>
    </div>
  );
}
