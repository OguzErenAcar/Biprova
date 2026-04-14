import { toast } from "sonner";
import { ToastContent } from "@/components/shared/toast";

/**
 * Uygulama genelinde tutarlı toast bildirimleri.
 * Raw `toast.error/warning/success` yerine bu kullanılır.
 *
 * Kullanım:
 *   notify.error("Bir hata oluştu.")
 *   notify.success("Başvurun alındı!")
 *   notify.location.denied()
 */
export const notify = {
  success: (message: string) =>
    toast.custom(() => <ToastContent variant="success" message={message} />),

  error: (message: string) =>
    toast.custom(() => <ToastContent variant="error" message={message} />),

  warning: (message: string) =>
    toast.custom(() => <ToastContent variant="warning" message={message} />),

  info: (message: string) =>
    toast.custom(() => <ToastContent variant="info" message={message} />),

  /** Konum ile ilgili hazır mesajlar */
  location: {
    denied: () =>
      toast.custom(() => (
        <ToastContent
          variant="warning"
          message="Konum izni gerekli. Tarayıcı adres çubuğundaki kilit ikonuna tıklayarak izin verebilirsiniz."
        />
      )),
    unavailable: () =>
      toast.custom(() => (
        <ToastContent
          variant="error"
          message="Konum alınamadı. Lütfen tekrar deneyin."
        />
      )),
    unsupported: () =>
      toast.custom(() => (
        <ToastContent
          variant="error"
          message="Tarayıcınız konum özelliğini desteklemiyor."
        />
      )),
  },
};
