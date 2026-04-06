import { Badge } from "@/components/ui/badge";

export function TimerWarning() {
  return (
    <div id="timer-warning" className="bg-amber-50 border-[1.5px] border-amber-200 rounded-xl px-5 py-[0.9rem] flex items-center gap-3 mb-6 text-[0.88rem] font-semibold text-amber-800">
      <span className="text-[1.1rem]">⏰</span>
      <span>Team leader ilk toplantıyı başlatmadı! Ekip dağılmadan harekete geç.</span>
      <Badge variant="outline" className="ml-auto font-nunito font-black text-amber-500 border-amber-300 whitespace-nowrap text-[1rem] px-0 border-0 bg-transparent">
        18:42:07
      </Badge>
    </div>
  );
}
