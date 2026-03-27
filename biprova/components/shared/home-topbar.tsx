import Link from "next/link";



export function HomeTopbar() {


 
  return (
    <div className="sticky top-0 z-40 bg-slate-100/90 backdrop-blur-md border-b border-slate-200 px-4 sm:px-6 lg:px-8 py-[0.9rem] flex items-center gap-4">
      {/* Arama kutusu */}
      <div className="flex-1 max-w-[400px] relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-[0.9rem] pointer-events-none">
          🔍
        </span>
        <input
          type="text"
          placeholder="Proje veya kişi ara..."
          className="w-full bg-white border-[1.5px] border-slate-200 rounded-[10px] pl-9 pr-4 py-[0.6rem] font-jakarta text-[0.88rem] text-slate-900 outline-none focus:border-blue-600 placeholder:text-slate-400 transition-colors duration-200"
        />
      </div>

      <div className="ml-auto flex items-center gap-[0.6rem]">
        {/* Mesajlar */}
        <div className="relative w-[38px] h-[38px] rounded-[10px] bg-white border-[1.5px] border-slate-200 flex items-center justify-center text-[1rem] cursor-pointer hover:border-blue-600 transition-colors duration-150">
          💬
          <span className="absolute top-[6px] right-[6px] w-[7px] h-[7px] bg-red-500 rounded-full border-[1.5px] border-slate-100" />
        </div>

        {/* Bildirim */}
        <div className="relative w-[38px] h-[38px] rounded-[10px] bg-white border-[1.5px] border-slate-200 flex items-center justify-center text-[1rem] cursor-pointer hover:border-blue-600 transition-colors duration-150">
          🔔
          <span className="absolute top-[6px] right-[6px] w-[7px] h-[7px] bg-red-500 rounded-full border-[1.5px] border-slate-100" />
        </div>

        {/* Proje aç butonu */}
        <Link href="createProject" className="bg-blue-600 text-white border-none rounded-[10px] font-nunito font-extrabold text-[0.88rem] px-5 py-[0.6rem] cursor-pointer flex items-center gap-[0.4rem] shadow-[0_4px_12px_rgba(37,99,235,0.25)] hover:-translate-y-px hover:shadow-[0_6px_18px_rgba(37,99,235,0.35)] transition-all duration-150">
          ＋ <span className="hidden sm:inline">Proje Oluştur</span>
        </Link>
      </div>
    </div>
  );
}
