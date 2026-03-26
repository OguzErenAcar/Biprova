# Biprova — Geliştirme Yol Haritası

## Faz 0 — Tasarım

Tüm sayfaların HTML tasarımı tamamlanacak. Layout: web'de sol sidebar, mobilde altta tab bar.
Tab bar sırası: Home | Teams | Proje Oluştur (merkez) | News | Profile

**Public sayfalar**
- [ ] Landing / Intro (mevcut: introPage.html — gözden geçir)
- [ ] Login — "LinkedIn ile Giriş Yap"
- [ ] Waitlist

**Tab bar sayfaları**
- [ ] Home — proje feed, filtreler (şehir, kategori, remote)
- [ ] Teams — projesi olan ekipler, 24h timer
- [ ] Proje Oluştur — form (başlık, roller, şehir, kategori)
- [ ] News — haberler
- [ ] Profile — kullanıcı bilgileri, geçmiş projeler, rozet

**Alt sayfalar**
- [ ] Proje Detay — rol listesi, team bar, başvur butonu
- [ ] Başvuru — role başvurma, not yazma
- [ ] Ekip Chat — mesajlaşma, üye listesi, 24h timer, kickoff
- [ ] Profil Düzenleme — bio, şehir, skills
- [ ] Başvurularım — gönderilen başvuruların durumu
- [ ] Projelerim — oluşturulan projeler, gelen başvuruları yönet (kabul/red)

## Faz 1 — UI Temeli

- [ ] Design dosyalarında TakımBul → biprova rename
- [ ] `devClaude/design/introPage.html` → `app/(marketing)/` landing page componentleri
- [ ] `devClaude/design/HomePage.html` → dashboard componentleri (mock data ile)
  - [ ] Sidebar component (web)
  - [ ] Tab bar component (mobil)
  - [ ] Project card component
  - [ ] Team bar component

## Faz 2 — Auth

- [ ] Supabase'de LinkedIn OAuth provider aktif et
- [ ] `lib/supabase/client.ts` — browser client
- [ ] `lib/supabase/server.ts` — server client
- [ ] `middleware.ts` — korumalı route'lar, giriş yoksa /login'e yönlendir
- [ ] `app/(auth)/login/page.tsx` — "LinkedIn ile Giriş Yap" sayfası
- [ ] Auth callback handler
- [ ] İlk girişte LinkedIn'den name, avatar_url, linkedin_url → users tablosuna kaydet

## Faz 3 — Core Features

- [ ] Proje oluşturma formu + Server Action
- [ ] Proje feed / timeline (listeleme, filtreleme)
- [ ] Proje detay sayfası
- [ ] Rol başvurusu akışı (apply → pending → accept/reject)
- [ ] Başvurularım sayfası
- [ ] Projelerim sayfası (gelen başvuruları yönet)
- [ ] Team bar — roller dolunca ilerleme
- [ ] Tüm roller dolunca otomatik ekip kurulumu (Supabase trigger)
- [ ] 24h timer gösterimi + pg_cron ile otomatik dağılma

## Faz 3.5 — Takım Gönderileri

- [ ] Takım oluşturulduktan sonra ekip adına gönderi paylaşabilme
- [ ] Bireysel gönderi yok — sadece takımlar paylaşır
- [ ] Gönderiler Home feed'inde görünür
- [ ] Gönderi detay sayfası

## Faz 4 — Realtime & Bildirimler

- [ ] Ekip chat sayfası (Supabase Realtime — messages tablosu)
- [ ] Notification sistemi (in-app)
- [ ] Resend ile email bildirimleri (başvuru, kabul, red, 24h uyarı)

## Faz 5 — Polish

- [ ] Profil düzenleme sayfası
- [ ] Rozet sistemi — "İlk 100 Kurucu Üye"
- [ ] Şehir bazlı filtreleme
- [ ] Remote / yüz yüze filtresi
- [ ] News sayfası içeriği
