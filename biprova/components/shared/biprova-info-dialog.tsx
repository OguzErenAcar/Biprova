import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const USE_CASES = [
  { icon: "🎓", text: "Üniversite öğrencileriyle proje ve ödev çalışmaları yapmak" },
  { icon: "💼", text: "İş ararken proje deneyimi kazanmak ve CV'ni güçlendirmek" },
  { icon: "🌱", text: "Sosyal fayda sağlayan projeler üretmek" },
  { icon: "🤝", text: "Kendi alanında nitelikli ekip arkadaşları bulmak" },
  { icon: "🔗", text: "Yakın çevrende gerçekten iş bilen insanlarla bağlantı kurmak" },
];

interface BiprovaInfoDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function BiprovaInfoDialog({ open, onOpenChange }: BiprovaInfoDialogProps) {
  return (
    <Dialog  open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md md:max-w-xl mx-4 md:mx-auto p-0 overflow-hidden flex flex-col" aria-describedby={undefined}>
        {/* Header */}
        <div className="bg-gradient-to-br from-blue-600 to-indigo-600 px-6 pt-6 pb-8 md:px-8 md:pt-8 md:pb-10 shrink-0">
          <DialogHeader>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-2xl md:text-3xl font-black text-white tracking-tight font-display">
                Bi<span className="text-black">prova</span>
              </span>
            </div>
            <DialogTitle className="text-white text-[1.05rem] md:text-xl font-bold leading-snug text-left">
              Yakın çevrendeki nitelikli insanlarla üret.
            </DialogTitle>
          </DialogHeader>
        </div>

        {/* Body */}
        <div className="px-6 py-5 md:px-8 md:py-7 flex flex-col gap-4 md:gap-5 overflow-y-auto min-h-0">
          <p className="text-[0.85rem] md:text-base text-slate-600 leading-relaxed">
            Biprova, yakın çevrendeki nitelikli insanlarla ortak bir fikir etrafında
            buluşmanı sağlayan bir sosyal platformdur.
          </p>

          <p className="text-[0.85rem] md:text-base text-slate-600 leading-relaxed">
            Aynı çevrede olup bir şeyler üretmek isteyen kişilerle tanışır,
            fikirlerini projeye dönüştürürsün.
          </p>

          {/* Use cases */}
          <div>
            <p className="text-[0.78rem] md:text-sm font-black tracking-wider text-slate-400 uppercase mb-3">
              Neler yapabilirsin?
            </p>
            <ul className="flex flex-col gap-2 md:gap-3">
              {USE_CASES.map(({ icon, text }) => (
                <li key={text} className="flex items-start gap-3">
                  <span className="text-base md:text-lg shrink-0 mt-[1px]">{icon}</span>
                  <span className="text-[0.84rem] md:text-base text-slate-700 leading-snug">{text}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Summary */}
          <div className="bg-blue-50 border border-blue-100 rounded-xl px-4 py-3 md:px-5 md:py-4">
            <p className="text-[0.83rem] md:text-base text-blue-800 leading-relaxed font-medium">
              Sadece konuşmak değil, doğru insanlarla bir araya gelip üretmek istiyorsan{" "}
              <span className="font-black">Biprova tam sana göre.</span>
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
