"use client";

import Lottie from "lottie-react";
import Link from "next/link";
import animationData from "@/images/404 Animation (1).json";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 text-center">
      <div className="w-72 h-72">
        <Lottie animationData={animationData as object} loop autoplay />
      </div>
      <h1 className="font-display font-black text-h1 text-slate-900 mt-2">
        Sayfa Bulunamadı
      </h1>
      <p className="text-body text-slate-500 mt-2 max-w-sm">
        Aradığın sayfa kaldırılmış ya da hiç var olmamış olabilir.
      </p>
      <Link
        href="/dashboard"
        className="mt-6 inline-flex items-center gap-2 bg-blue-600 text-white font-nunito font-extrabold px-6 py-3 rounded-xl hover:bg-blue-700 transition-colors no-underline"
      >
        Ana Sayfaya Dön
      </Link>
    </div>
  );
}
