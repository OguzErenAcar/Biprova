import { Badge } from "@/components/ui/badge";

export function TimerWarning() {
  return (
    <div id="timer-warning" className="bg-warning-surface border-[1.5px] border-warning-surface rounded-xl px-5 py-[0.9rem] flex items-center gap-3 mb-6 text-body font-semibold text-warning">
      <span className="text-title">⏰</span>
      <span>Team leader ilk toplantıyı başlatmadı! Ekip dağılmadan harekete geç.</span>
      <Badge variant="outline" className="ml-auto font-nunito font-black text-warning border-warning-surface whitespace-nowrap text-base px-0 border-0 bg-transparent">
        18:42:07
      </Badge>
    </div>
  );
}
