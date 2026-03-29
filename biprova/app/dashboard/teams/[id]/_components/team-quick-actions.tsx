interface Props {
  canCreateProject: boolean;
  onNewProject: () => void;
}

export function TeamQuickActions({ canCreateProject, onNewProject }: Props) {
  return (
    <div id="team-quick-actions" className="bg-white border-[1.5px] border-slate-200 rounded-2xl overflow-hidden mb-[1.2rem]">
      <div className="px-5 py-4 border-b border-slate-200">
        <span className="font-nunito font-black text-[0.9rem]">⚡ Hızlı İşlemler</span>
      </div>
      <div className="p-4 flex flex-col gap-2">
        {canCreateProject && (
          <button
            onClick={onNewProject}
            className="w-full py-[0.65rem] rounded-[10px] border-[1.5px] border-dashed border-blue-200 text-[0.84rem] font-bold text-blue-600 cursor-pointer bg-blue-50 flex items-center justify-center gap-2 transition-colors hover:bg-blue-100"
          >
            ＋ Yeni Proje Aç
          </button>
        )}
        <button className="w-full py-[0.65rem] rounded-[10px] border-[1.5px] border-slate-200 text-[0.84rem] font-bold text-slate-500 cursor-pointer bg-white flex items-center justify-center gap-2 transition-colors hover:border-slate-300">
          📢 Timeline&apos;a Paylaş
        </button>
        <button className="w-full py-[0.65rem] rounded-[10px] border-[1.5px] border-slate-200 text-[0.84rem] font-bold text-slate-500 cursor-pointer bg-white flex items-center justify-center gap-2 transition-colors hover:border-slate-300">
          💬 Gruba Git
        </button>
      </div>
    </div>
  );
}
