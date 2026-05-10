import type { Metadata } from "next";
import type { Viewport } from "next";
import { Nunito, Plus_Jakarta_Sans } from "next/font/google";

const nunito = Nunito({
  variable: "--font-nunito",
  subsets: ["latin"],
  weight: ["400", "600", "700", "800", "900"],
  display: "swap",
});

const jakartaSans = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
  preload: false,
});

export const metadata: Metadata = {
  title: "biprova — Birlikte Üret",
  description: "Ekibini oluştur, birlikte üret. Türkiye'nin proje ekibi platformu.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={`${nunito.variable} ${jakartaSans.variable} font-jakarta bg-[#f8faff] text-slate-900 overflow-x-hidden`}>
      {children}
    </div>
  );
}
