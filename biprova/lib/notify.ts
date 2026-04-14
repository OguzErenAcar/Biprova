import { toast } from "sonner";

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
  success: (message: string) => toast.success(message),

  error: (message: string) => toast.error(message),

  warning: (message: string) => toast.warning(message),

  info: (message: string) => toast.info(message),

  /** Konum ile ilgili hazır mesajlar */
  location: {
    denied: () =>
      toast.warning(
        "Konum izni gerekli. Tarayıcı adres çubuğundaki kilit ikonuna tıklayarak izin verebilirsiniz."
      ),
    unavailable: () =>
      toast.error("Konum alınamadı. Lütfen tekrar deneyin."),
    unsupported: () =>
      toast.error("Tarayıcınız konum özelliğini desteklemiyor."),
  },
};
