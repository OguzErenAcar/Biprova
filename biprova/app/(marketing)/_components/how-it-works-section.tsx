import { LottieIcon } from '@/components/shared/lottie-icon'
import editDocumentIcon from '@/app/icons/wired-outline-245-edit-document-hover-pinch.json'
import avatarManIcon from '@/app/icons/wired-outline-268-avatar-man-hover-glance.json'
import consultationIcon from '@/app/icons/wired-outline-981-consultation-hover-conversation.json'
import alarmClockIcon from '@/app/icons/wired-outline-236-alarm-clock-hover-pinch.json'

const STEPS = [
  {
    num: "1",
    icon: editDocumentIcon,
    title: "Proje Başlığı Aç",
    desc: "Fikrinin detayını değil, ihtiyacını paylaş. Kim lazım, hangi şehirde, ne amaçla.",
  },
  {
    num: "2",
    icon: avatarManIcon,
    title: "Başvurular Gelir",
    desc: 'İlgilenenler "ben şunu yapabilirim" diye başvurur. Ekip barı dolmaya başlar.',
  },
  {
    num: "3",
    icon: consultationIcon,
    title: "Özel Grup Açılır",
    desc: "Bar dolduğunda sadece ekibinize özel alan oluşur. Fikrin detayları orada paylaşılır.",
  },
  {
    num: "4",
    icon: alarmClockIcon,
    title: "24 Saat Kuralı",
    desc: "Team leader ilk buluşmayı 24 saat içinde başlatmalı — yoksa ekip dağılır!",
  },
]

export function HowItWorksSection() {
  return (
    <section className="py-16 sm:py-20 px-4 sm:px-8 max-w-[1080px] mx-auto">
      <p className="text-[0.75rem] font-bold tracking-[3px] uppercase text-blue-600 mb-2">
        Nasıl Çalışır ?
      </p>
      <h2 className="font-nunito font-black text-[clamp(1.8rem,4vw,2.8rem)] tracking-[-1px] leading-[1.15] mb-12">
        4 adımda ekibini kur  
      </h2>
      <div className="grid grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-5">
        {STEPS.map((step) => (
          <div
            key={step.num}
            className="relative bg-white border border-slate-200 rounded-[20px] p-8 overflow-hidden hover:-translate-y-1 hover:shadow-[0_12px_32px_rgba(37,99,235,0.1)] transition-all duration-200"
          >
            <span className="absolute top-[-10px] right-2.5 font-nunito font-black text-[5rem] text-slate-100 leading-none pointer-events-none select-none">
              {step.num}
            </span>
            <div className="mb-4 relative">
              <LottieIcon animationData={step.icon} size={48} />
            </div>
            <h3 className="relative font-nunito font-extrabold text-[1.05rem] mb-2">
              {step.title}
            </h3>
            <p className="relative text-[0.88rem] text-slate-500 leading-relaxed">
              {step.desc}
            </p>
          </div>
        ))}
      </div>
    </section>
  )
}
