import { WaitlistForm } from "./waitlist-form";
import { HeroCounter } from "./hero-counter";

const FLOATING_CARDS = [
  { color: "#22c55e", label: "Veteriner — İzmir" },
  { color: "#3b82f6", label: "Yazılımcı — İstanbul" },
  { color: "#a78bfa", label: "Grafiker — Ankara" },
  { color: "#f59e0b", label: "Kameraman — Remote" },
];

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex flex-col justify-center px-8 pt-32 pb-20 overflow-hidden">
      {/* Blobs */}
      <div className="absolute top-[-100px] right-[-100px] w-[500px] h-[500px] rounded-full bg-blue-300 blur-[80px] opacity-25 pointer-events-none animate-bp-float" />
      <div className="absolute bottom-[-80px] left-[-80px] w-[400px] h-[400px] rounded-full bg-violet-300 blur-[80px] opacity-25 pointer-events-none animate-bp-float-reverse" />
      <div className="absolute top-[40%] left-[30%] w-[300px] h-[300px] rounded-full bg-amber-200 blur-[80px] opacity-25 pointer-events-none animate-bp-float-slow" />

      <div className="relative z-10 max-w-[860px] mx-auto text-center">
        {/* Badge */}
        <div
          className="inline-flex items-center gap-2 bg-white border border-slate-200 rounded-full px-4 py-1.5 text-[0.82rem] font-semibold text-blue-600 mb-7 shadow-sm animate-bp-fade-up"
        >
          <span className="w-2 h-2 bg-green-500 rounded-full animate-bp-pulse-dot" />
          Yakında Geliyor — Bekleme Listesi Açık
        </div>

        {/* Heading */}
        <h1
          className="font-nunito font-black text-[clamp(2.6rem,6.5vw,5.5rem)] leading-[1.05] tracking-[-2px] mb-6 animate-bp-fade-up text-slate-900"
          style={{ animationDelay: "0.1s" }}
        >
          Ekibini bul,<br />
          <span className="bg-gradient-to-br from-blue-600 to-indigo-500 bg-clip-text text-transparent">
            birlikte üret.
          </span>
        </h1>

        {/* Sub */}
        <p
          className="text-[clamp(1rem,2vw,1.15rem)] text-slate-500 leading-[1.75] max-w-[540px] mx-auto mb-10 animate-bp-fade-up"
          style={{ animationDelay: "0.2s" }}
        >
          Yazılımcı mı, veteriner mi, grafiker mi — fark etmez.
          biprova&apos;da aynı şehirden insanlar proje etrafında buluşur.
        </p>

        {/* Waitlist form */}
        <div className="animate-bp-fade-up" style={{ animationDelay: "0.3s" }}>
          <WaitlistForm variant="hero" />
        </div>

        {/* Stats */}
        <div
          className="flex justify-center gap-10 flex-wrap mt-12 animate-bp-fade-up"
          style={{ animationDelay: "0.45s" }}
        >
          <div className="text-center">
            <div className="font-nunito font-black text-[1.6rem] text-blue-600 leading-none">
              <HeroCounter target={247} />
            </div>
            <div className="text-[0.78rem] text-slate-500 mt-1">Bekleme Listesinde</div>
          </div>
          <div className="text-center">
            <div className="font-nunito font-black text-[1.6rem] text-blue-600 leading-none">12+</div>
            <div className="text-[0.78rem] text-slate-500 mt-1">Şehirden Kayıt</div>
          </div>
          <div className="text-center">
            <div className="font-nunito font-black text-[1.6rem] text-blue-600 leading-none">Ücretsiz</div>
            <div className="text-[0.78rem] text-slate-500 mt-1">Sonsuza Kadar</div>
          </div>
        </div>

        {/* Floating cards */}
        <div
          className="flex justify-center gap-4 flex-wrap px-4 mt-14 animate-bp-fade-up"
          style={{ animationDelay: "0.5s" }}
        >
          {FLOATING_CARDS.map((card) => (
            <div
              key={card.label}
              className="flex items-center gap-[0.7rem] bg-white border border-slate-200 rounded-2xl px-5 py-3 text-[0.85rem] font-semibold shadow-md hover:-translate-y-1 transition-transform"
            >
              <span
                className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                style={{ backgroundColor: card.color }}
              />
              {card.label}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
