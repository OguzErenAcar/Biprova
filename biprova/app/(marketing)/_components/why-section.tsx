import { LottieIcon } from '@/components/shared/lottie-icon'
import documentIcon from '@/app/icons/wired-outline-56-document-hover-swipe.json'
import shareArrowIcon from '@/app/icons/wired-outline-259-share-arrow-hover-pointing.json'
import barChartIcon from '@/app/icons/wired-outline-153-bar-chart-hover-pinch.json'
import documentLetterIcon from '@/app/icons/wired-outline-3090-document-letter-hover-pinch.json'

const WHY_CARDS = [
  {
    icon: documentIcon,
    bg: "bg-blue-50",
    title: "Fikrin Güvende",
    desc: "Timeline'da fikir değil, ihtiyaç paylaşılır. Detaylar sadece ekibinde konuşulur.",
  },
  {
    icon: shareArrowIcon,
    bg: "bg-green-50",
    title: "Şehir Bazlı Eşleşme",
    desc: "Fiziksel buluşma gerektiren projelerde aynı şehirdekilerle eşleşirsin.",
  },
  {
    icon: barChartIcon,
    bg: "bg-yellow-50",
    title: "Aktif Tutma Kuralı",
    desc: "24 saat kuralı ile ölü projeler temizlenir. Sadece gerçek ekipler kalır.",
  },
  {
    icon: documentLetterIcon,
    bg: "bg-purple-50",
    title: "CV'ye Giren Deneyim",
    desc: "Tamamlanan her proje somut bir portföy çıktısı. İşe başvururken kanıt olur.",
  },
]

export function WhySection() {
  return (
    <section className="pt-0 pb-16 sm:pb-20 px-4 sm:px-8 max-w-[1080px] mx-auto">
      <p className="text-[0.75rem] font-bold tracking-[3px] uppercase text-blue-600 mb-2">
        Neden biprova
      </p>
      <h2 className="font-nunito font-black text-[clamp(1.8rem,4vw,2.8rem)] tracking-[-1px] leading-[1.15] mb-12">
        Yalnız proje zordur 😅
      </h2>
      <div className="grid grid-cols-[repeat(auto-fit,minmax(min(230px,100%),1fr))] gap-5">
        {WHY_CARDS.map((card) => (
          <div
            key={card.title}
            className="bg-white border border-slate-200 rounded-[20px] p-[1.8rem] hover:-translate-y-0.5 transition-transform duration-200"
          >
            <div className={`w-12 h-12 rounded-[14px] flex items-center justify-center mb-4 ${card.bg}`}>
              <LottieIcon animationData={card.icon} size={32} />
            </div>
            <h3 className="font-nunito font-extrabold text-[1rem] mb-1.5">{card.title}</h3>
            <p className="text-[0.86rem] text-slate-500 leading-relaxed">{card.desc}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
