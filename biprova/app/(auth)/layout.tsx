import { Nunito, Plus_Jakarta_Sans } from 'next/font/google';

const nunito = Nunito({
  variable: '--font-nunito',
  subsets: ['latin'],
  weight: ['400', '600', '700', '800', '900'],
});

const jakartaSans = Plus_Jakarta_Sans({
  variable: '--font-jakarta',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
});

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={`${nunito.variable} ${jakartaSans.variable} font-jakarta`}>
      {children}
    </div>
  );
}
