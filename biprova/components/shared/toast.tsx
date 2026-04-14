import { CheckCircle, XCircle, AlertTriangle, Info } from "lucide-react";

type ToastVariant = "success" | "error" | "warning" | "info";

interface ToastContentProps {
  variant: ToastVariant;
  message: string;
}

const VARIANT_CONFIG: Record<
  ToastVariant,
  {
    container: string;
    text: string;
    icon: React.ElementType;
    iconClass: string;
  }
> = {
  success: {
    container: "border-emerald-200 border-l-emerald-500 bg-emerald-50",
    text: "text-emerald-700",
    icon: CheckCircle,
    iconClass: "text-emerald-500",
  },
  error: {
    container: "border-red-200 border-l-red-500 bg-red-50",
    text: "text-red-700",
    icon: XCircle,
    iconClass: "text-red-500",
  },
  warning: {
    container: "border-amber-200 border-l-amber-500 bg-amber-50",
    text: "text-amber-700",
    icon: AlertTriangle,
    iconClass: "text-amber-500",
  },
  info: {
    container: "border-blue-200 border-l-blue-500 bg-blue-50",
    text: "text-blue-700",
    icon: Info,
    iconClass: "text-blue-500",
  },
};

export function ToastContent({ variant, message }: ToastContentProps) {
  const { container, text, icon: Icon, iconClass } = VARIANT_CONFIG[variant];
  return (
    <div
      className={`flex items-start gap-2.5 px-3.5 py-3 rounded-xl border border-l-4 shadow-sm min-w-[240px] max-w-[340px] ${container}`}
    >
      <Icon size={15} className={`mt-0.5 shrink-0 ${iconClass}`} />
      <span className={`text-sm font-semibold leading-snug ${text}`}>
        {message}
      </span>
    </div>
  );
}
