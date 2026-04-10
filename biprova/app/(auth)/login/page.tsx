import type { Metadata } from 'next';
import { LoginCard } from './_components/login-card';

export const metadata: Metadata = {
  title: 'biprova — Giriş Yap',
};

export default function LoginPage() {
  return (
    <main className="relative min-h-dvh overflow-x-hidden flex items-center justify-center px-3 sm:px-6 py-8 bg-[#f8faff]">
      {/* Background blobs — absolute to avoid iOS fixed+blur touch interception bug */}
      <div className="absolute w-[500px] h-[500px] rounded-full bg-blue-300 blur-[80px] opacity-[0.18] pointer-events-none -top-[150px] -right-[150px]" />
      <div className="absolute w-[400px] h-[400px] rounded-full bg-violet-300 blur-[80px] opacity-[0.18] pointer-events-none -bottom-[120px] -left-[120px]" />

      <LoginCard />
    </main>
  );
}
