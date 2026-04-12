"use client";

export function CreateProjectTopbar() {
  return (
    <div
      id="create-project-topbar"
      className="sticky top-0 z-40   backdrop-blur-[12px]   flex items-center gap-4"
    >
      <div className="flex items-between w-full justify-between  border-b border-slate-200 pb-3 mb-4 md:mx-0 mx-2">
        <h1 className="dashheader text-ink">Proje Oluştur</h1>

        <div className="ml-auto flex items-center gap-2.5">
          {/* <button
            type="submit"
            form="create-project-form"
            className=" text-white border rounded-[10px] font-nunito font-extrabold text-[0.88rem] px-5 py-[0.6rem] cursor-pointer flex items-center gap-1.5 shadow-[0_4px_12px_rgba(37,99,235,0.25)] transition-all hover:-translate-y-px hover:shadow-[0_6px_18px_rgba(37,99,235,0.35)] disabled:opacity-60 disabled:cursor-not-allowed"
          >
            Yayınla
          </button> */}
        </div>
      </div>
    </div>
  );
}
