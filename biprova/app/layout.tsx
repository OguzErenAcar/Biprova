import type { Metadata } from "next";
 import "./globals.css";

 

export const metadata: Metadata = {
  title: "biprova",
  description: "Bir projem var.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr">
      <body
        className={`  antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
