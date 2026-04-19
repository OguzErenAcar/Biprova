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
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md p-0 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-br from-blue-600 to-indigo-600 px-6 pt-6 pb-8">
          <DialogHeader>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-2xl font-black text-white tracking-tight font-display">
                Bi<span className="text-blue-200">prova</span>
              </span>
            </div>
            <DialogTitle className="text-white text-[1.05rem] font-bold leading-snug text-left">
              Yakın çevrendeki nitelikli insanlarla üret.
            </DialogTitle>
          </DialogHeader>
        </div>

        {/* Body */}
        <div className="px-6 py-5 flex flex-col gap-4">
          <p className="text-[0.85rem] text-slate-600 leading-relaxed">
            Biprova, yakın çevrendeki nitelikli insanlarla ortak bir fikir etrafında
            buluşmanı sağlayan bir sosyal platformdur.
          </p>

          <p className="text-[0.85rem] text-slate-600 leading-relaxed">
            Aynı çevrede olup bir şeyler üretmek isteyen kişilerle tanışır,
            fikirlerini projeye dönüştürürsün.
          </p>

          {/* Use cases */}
          <div>
            <p className="text-[0.78rem] font-black tracking-wider text-slate-400 uppercase mb-3">
              Neler yapabilirsin?
            </p>
            <ul className="flex flex-col gap-2">
              {USE_CASES.map(({ icon, text }) => (
                <li key={text} className="flex items-start gap-3">
                  <span className="text-base shrink-0 mt-[1px]">{icon}</span>
                  <span className="text-[0.84rem] text-slate-700 leading-snug">{text}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Summary */}
          <div className="bg-blue-50 border border-blue-100 rounded-xl px-4 py-3">
            <p className="text-[0.83rem] text-blue-800 leading-relaxed font-medium">
              Sadece konuşmak değil, doğru insanlarla bir araya gelip üretmek istiyorsan{" "}
              <span className="font-black">Biprova tam sana göre.</span>
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
