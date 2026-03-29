# Biprova — Geliştirme Yol Haritası

> Durum göstergesi: ✅ Tamamlandı · 🔄 Kısmen · ⬜ Bekliyor

---

## Faz 0 — Tasarım
- ✅ Public sayfalar (landing, login, waitlist) — HTML prototipleri tamamlandı
- ✅ Tab bar sayfaları (home, teams, create, news, profile) — HTML prototipleri tamamlandı
- ✅ Alt sayfalar (proje detay, aktif proje/chat) — HTML prototipleri tamamlandı
- ✅ Design tokens — `design/design-tokens.css`

---

## Faz 1 — UI Temeli
- ✅ Sidebar (web)
- ✅ Tab bar (mobil)
- ✅ Project card component
- ✅ Team bar component
- ✅ Home topbar
- ✅ Notification bell

---

## Faz 2 — Auth
- ✅ Supabase LinkedIn OAuth
- ✅ `lib/supabase/client.ts` + `server.ts`
- ✅ `middleware.ts` — korumalı route'lar
- ✅ `app/(auth)/login/` — LinkedIn ile giriş sayfası
- ✅ Auth callback handler
- ✅ 3 adımlı signup akışı (step1/2/3)
- ✅ İlk girişte LinkedIn verileri users tablosuna kayıt

---

## Faz 3 — Dashboard Sayfaları

### 3.1 — Ana Sayfa / Proje Feed
- ✅ Proje feed listeleme
- ✅ Filtre butonları (Tümü / Şehrim / Remote) — URL search params ile çalışır
- ⬜ Kategori filtresi
- ⬜ Sonsuz kaydırma veya "Daha fazla yükle" pagination

### 3.2 — Proje Oluştur
- ✅ Form (başlık, açıklama, şehir, kategori, roller, skills)
- ✅ Server Action ile Supabase'e kayıt
- ⬜ Taslak kaydetme (draft)

### 3.3 — Proje Detay Sayfası
- 🔄 Temel görünüm var (`activeProject/`)
- ⬜ Public proje detay sayfası (`/dashboard/projects/[id]`)
- ⬜ Rol başvurusu akışı (apply-button → pending → accept/reject)
- ⬜ Team bar — roller dolunca ilerleme gösterimi
- ⬜ Tüm roller dolunca otomatik ekip kurulumu (Supabase trigger)

### 3.4 — Başvurularım
- ⬜ Gönderilen başvuruların durumu (pending / accepted / rejected)
- ⬜ Başvuru geri çekme

### 3.5 — Projelerim
- ⬜ Oluşturulan projeler listesi
- ⬜ Gelen başvuruları yönet (kabul / red)
- ⬜ Proje silme / kapatma işlemi

### 3.6 — Ekipler (Teams)
- 🔄 Aktif ekip widget mevcut
- ⬜ Teams feed — projesi olan ekipler, 24h timer gösterimi
- ⬜ Ekip chat sayfası (Supabase Realtime — messages tablosu)
- ⬜ 24h timer + pg_cron ile otomatik ekip dağılması
- ⬜ Kickoff akışı

### 3.7 — Takım Gönderileri (Posts)
- 🔄 team-post-card ve team-post-feed componentleri var
- ⬜ Gönderi oluşturma (sadece takım üyeleri)
- ⬜ Gönderi detay sayfası
- ⬜ Gönderi silme
- ⬜ Beğeni işlevi

### 3.8 — Haberler (News)
- 🔄 news-feed, news-card, featured-news-card mevcut
- ⬜ Haber detay sayfası
- ⬜ Admin panelinden haber yönetimi (yayınlama, düzenleme, silme)
- ⬜ Haber beğeni işlevi

### 3.9 — Profil
- 🔄 profile-hero, profile-sections, profile-stats, profile-edit-modal mevcut
- ⬜ Profil düzenleme sayfası (modal → dedicated sayfa)
- ⬜ Başkasının profil sayfası (`/dashboard/profile/[id]`)
- ⬜ Geçmiş projeler ve başvurular gösterimi
- ⬜ Rozet sistemi — "İlk 100 Kurucu Üye" vb.

---

## Faz 4 — Resim & Medya

- ⬜ Supabase Storage bucket kurulumu (avatars, post-media)
- ⬜ Avatar yükleme (profil düzenleme)
- ⬜ Takım gönderisi medya yükleme (`media_urls` alanı schema'da var)
- ⬜ Yüklenen görseller için boyut / tip validasyonu
- ⬜ Görsel optimizasyonu (Next.js `<Image>` ile)

---

## Faz 5 — Silme & Kaldırma İşlemleri

- ⬜ Proje silme (proje sahibi)
- ⬜ Başvuru geri çekme (kullanıcı, pending durumdayken)
- ⬜ Takım gönderisi silme (gönderi sahibi)
- ⬜ Hesap silme — `deleteAccount()` action var, UI bağlantısı eksik
- ⬜ Bildirim temizleme (tekil / tümünü okundu işaretle)
- ⬜ Tüm silme işlemlerinde onay dialog'u (shadcn AlertDialog)

---

## Faz 6 — Bildirimler & E-posta

- 🔄 `notifications` tablosu ve `getNotifications()` action var
- ⬜ In-app bildirim feed'i (notification bell açılır panel)
- ⬜ Okundu / okunmadı işaretleme
- ⬜ Resend ile e-posta bildirimleri:
  - Başvuru alındı
  - Başvuru kabul / reddedildi
  - Ekip kuruldu
  - 24h uyarısı

---

## Faz 7 — Yeniden Tasarım & Animasyonlar

- ⬜ Tüm dashboard sayfalarını design HTML'leri ile karşılaştır, eksikleri kapat
- ⬜ Geçiş animasyonları (Framer Motion veya CSS transitions)
- ⬜ Skeleton loader'lar (Suspense boundary'leri için)
- ⬜ Micro-interaction'lar (buton hover, kart hover, beğeni animasyonu)
- ⬜ Empty state tasarımları (veri yokken gösterilecek UI)
- ⬜ Toast / snackbar bildirimleri (shadcn Sonner)

---

## Faz 8 — Responsive & Mobil Uyum

- ⬜ Tüm sayfaları mobil (< 640px) üzerinde test et
- ⬜ Tab bar → aktif sayfa vurgusu doğru çalışıyor mu kontrol et
- ⬜ Proje kartları, form ve modal'ların küçük ekranda görünümü
- ⬜ Capacitor ile mobil build dene (iOS + Android)
- ⬜ Safe area inset'leri (notch, home indicator)

---

## Faz 9 — Özel Sayfalar

- ⬜ `app/not-found.tsx` — 404 sayfası
- ⬜ `app/error.tsx` — global hata sayfası
- ⬜ `app/dashboard/error.tsx` — dashboard hata sayfası
- ⬜ `app/(auth)/login/error.tsx` — auth hata sayfası
- ⬜ Settings sayfası (`/dashboard/settings`) — bildirim tercihleri, hesap silme, şehir/skill güncelleme

---

## Faz 10 — Marketing

- ✅ Landing page componentleri (hero, why-section, cta, proje kartı mock)
- ✅ Waitlist sayfası ve formu
- ⬜ Landing page son içerikleri (gerçek copy, görseller)
- ⬜ SEO meta tag'leri (title, description, og:image) marketing sayfaları için
- ⬜ `/about`, `/privacy`, `/terms` sayfaları (gerekirse)
- ⬜ Waitlist e-posta onay akışı (Resend)
- ⬜ Login sayfası görsel iyileştirme

---

## Faz 11 — Kod Temizliği

- ⬜ Kullanılmayan import'ları kaldır
- ⬜ `console.log` taraması — production kodundan temizle
- ⬜ `any` tip kullanımlarını gider (TypeScript strict)
- ⬜ Tekrarlayan Supabase query'leri `queries.ts`'e taşı
- ⬜ Büyük dosyaları böl (800 satır sınırı)
- ⬜ Kullanılmayan componentleri / action'ları sil
- ⬜ Magic string'leri constant'lara taşı

---

## Faz 12 — Testler

- ⬜ **Birim testleri:** Zod şemaları, utility fonksiyonları, helper'lar
- ⬜ **Entegrasyon testleri:** Server Action'lar (gerçek Supabase test DB ile)
- ⬜ **E2E testleri (Playwright):**
  - Kayıt / giriş akışı
  - Proje oluşturma → başvuru → kabul → ekip kurulumu
  - Profil düzenleme
  - Silme işlemleri
- ⬜ **Web üzerinden manuel test kontrol listesi:**
  - LinkedIn OAuth gerçek hesapla test
  - 24h timer akışı
  - Realtime chat
  - Mobil tarayıcıda responsive test

---

## Faz 13 — Güvenlik

- ⬜ RLS policy'lerini test et (farklı kullanıcı rolleriyle)
- ⬜ Server Action input'larında Zod validasyonu eksiksiz mi kontrol et
- ⬜ `SUPABASE_SERVICE_ROLE_KEY` client'a sızmıyor mu doğrula
- ⬜ Rate limiting (Vercel Edge veya Supabase RLS ile)
- ⬜ CSRF koruması — Next.js Server Actions için varsayılan kontrol et
- ⬜ Dosya yükleme güvenliği (tip, boyut, içerik validasyonu)
- ⬜ Dependency audit (`npm audit`)

---

## Faz 14 — Performans

- ⬜ Lighthouse skoru ölç (hedef: Performance > 90)
- ⬜ `next/image` tüm görsellerde kullanılıyor mu
- ⬜ Server Component / Client Component sınırlarını gözden geçir
- ⬜ Supabase query'lerinde `select('*')` var mı tara, hepsini kapat
- ⬜ `.limit()` tüm listeleme query'lerinde mevcut mu kontrol et
- ⬜ Bundle size analizi (`@next/bundle-analyzer`)
- ⬜ Realtime abonelik sızıntısı yok mu (useEffect cleanup)

---

## Faz 15 — SEO

- ⬜ `app/layout.tsx` — global metadata (title template, description, og:image)
- ⬜ Marketing sayfaları için statik metadata
- ⬜ Dashboard sayfaları için dinamik metadata (proje başlığı vb.)
- ⬜ `robots.txt` — dashboard index'lenmesin
- ⬜ `sitemap.xml` — marketing sayfaları için
- ⬜ Structured data (JSON-LD) — landing page için

---

## Faz 16 — Build & Deploy

- ⬜ `npm run build` sıfır hatayla tamamlanıyor mu
- ⬜ TypeScript strict mod ihlalleri yok
- ⬜ ESLint uyarısız
- ⬜ Tüm environment variable'lar Vercel'e tanımlı
- ⬜ Supabase production DB — schema migrate edildi mi
- ⬜ `pg_cron` extension aktif mi (24h timer için)
- ⬜ Vercel preview deploy test
- ⬜ Production deploy + smoke test
