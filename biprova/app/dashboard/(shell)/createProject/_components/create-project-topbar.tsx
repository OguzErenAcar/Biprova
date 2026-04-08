"use client";
 

export function CreateProjectTopbar() { 

  return (
    <div id="create-project-topbar" className="sticky top-0 z-40   backdrop-blur-[12px] border-b border-slate-200   flex items-center gap-4">

      <div className="flex items-center justify-between mb-4">
        <h1 className="text-3xl   text-ink">
           Proje Oluştur
        </h1>
       </div>
      <div className="ml-auto flex items-center gap-2.5">
        <button
          type="submit"
          form="create-project-form"
          className=" text-white border rounded-[10px] font-nunito font-extrabold text-[0.88rem] px-5 py-[0.6rem] cursor-pointer flex items-center gap-1.5 shadow-[0_4px_12px_rgba(37,99,235,0.25)] transition-all hover:-translate-y-px hover:shadow-[0_6px_18px_rgba(37,99,235,0.35)] disabled:opacity-60 disabled:cursor-not-allowed"
        >
           Yayınla
        </button>
      </div>
    </div>
  );
}
