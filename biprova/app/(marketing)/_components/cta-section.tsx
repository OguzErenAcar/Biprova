import { WaitlistForm } from "./waitlist-form";

export function CtaSection() {
  return (
    <div
      id="waitlist"
      className="relative mx-4 mb-20 rounded-[28px] overflow-hidden text-center px-8 py-16"
      style={{ background: "linear-gradient(135deg, #2563eb 0%, #6366f1 100%)" }}
    >
      {/* Dot pattern */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />

      <div className="relative">
        <h2 className="font-nunito font-black text-[clamp(1.8rem,4vw,3rem)] tracking-[-1px] text-white mb-3">
          Hazır olunca seni arayalım 👋
        </h2>
        <p className="text-white/75 mb-8">
          Şimdi kayıt ol, platform açıldığında ilk sen öğren.
        </p>
        <WaitlistForm variant="cta" />
      </div>
    </div>
  );
}
