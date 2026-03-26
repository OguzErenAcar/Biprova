import type { Metadata } from 'next';
import { LoginCard } from './_components/login-card';

export const metadata: Metadata = {
  title: 'biprova — Giriş Yap',
};

export default function LoginPage() {
  return (
    <main className="min-h-screen flex items-center justify-center px-6 bg-[#f8faff]">
      {/* Background blobs */}
      <div className="fixed w-[500px] h-[500px] rounded-full bg-blue-300 blur-[80px] opacity-[0.18] pointer-events-none -top-[150px] -right-[150px]" />
      <div className="fixed w-[400px] h-[400px] rounded-full bg-violet-300 blur-[80px] opacity-[0.18] pointer-events-none -bottom-[120px] -left-[120px]" />

      <LoginCard />
    </main>
  );
}
