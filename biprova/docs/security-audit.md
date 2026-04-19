# Güvenlik Denetimi — Biprova

> Tarih: 2026-04-19  
> Kapsam: Next.js 15 + Supabase (Server Actions, proxy.ts, features/*, file uploads)

---

## Özet Tablo

| # | Kategori | Risk | Durum |
|---|---|---|---|
| 1 | SQL Injection | 🟢 DÜŞÜK | Sorun yok |
| 2 | XSS | 🟡 ORTA | Gönderi resim URL'leri doğrulanmıyor |
| 3 | Auth / Session | 🟡 ORTA | Brute force koruması yok |
| 4 | Authorization (IDOR) | 🔴 YÜKSEK | `reviewApplication` ve `kickMember` sahiplik kontrolü eksik |
| 5 | CSRF | 🟢 DÜŞÜK | Server Actions koruması var |
| 6 | File Upload | 🟡 ORTA | Gönderi resimleri sunucu tarafı doğrulanmıyor |
| 7 | Rate Limiting | 🔴 YÜKSEK | Hiç uygulanmamış |
| 8 | Mass Assignment | 🟢 DÜŞÜK | Zod validasyonu her yerde var |
| 9 | Data Exposure | 🟡 ORTA | Profilde e-posta açıkta |
| 10 | CORS / Headers | 🟡 ORTA | Güvenlik header'ları eksik |

---

## 1. SQL Injection 🟢

**Durum:** Sorun yok.

Tüm sorgular Supabase client metodları (`.eq()`, `.ilike()`, `.select()`) ile yapılıyor. Ham SQL veya string interpolasyonu yok.

```ts
// features/search/actions.ts — güvenli örnek
.ilike('title', `%${q}%`)  // parameterize, injection riski yok
```

**Aksiyon gerekmez.**

---

## 2. XSS 🟡

**Durum:** Büyük ölçüde güvenli, küçük bir risk noktası var.

✅ `dangerouslySetInnerHTML` yok  
✅ Kullanıcı içeriği (bio, mesaj, açıklama) plain text olarak render ediliyor  
✅ Avatar/CV yüklemeleri doğrulanıyor  

⚠️ **Sorun:** Gönderi resimlerindeki URL'ler sunucuda doğrulanmıyor.  
`panel-gonderiler.tsx` — kullanıcının girdiği image URL doğrudan `<img src={url}>` olarak render ediliyor.

**Çözüm:** Resim URL'lerinin Supabase Storage'dan geldiğini sunucuda doğrula.

---

## 3. Auth / Session 🟡

**Durum:** Temel akış güvenli, rate limiting eksik.

✅ `getUser()` her request'te server-side doğrulanıyor  
✅ JWT + refresh token döngüsü çalışıyor  
✅ Logout `last_sign_out_at` kaydediyor  
✅ Admin client sadece sunucuda kullanılıyor  

⚠️ **Sorun:** `login()`, `signup()`, `checkEmailAvailable()` üzerinde brute force koruması yok.  
Birisi otomatik araçla sınırsız deneme yapabilir.

**Çözüm:** Rate limiting (bkz. Madde 7).

---

## 4. Authorization — IDOR 🔴

**Durum:** İki kritik açık var.

### 4a. `reviewApplication()` — Sahiplik kontrolü eksik
`features/applications/actions.ts`

```ts
// Şu an: sadece application ID kontrol ediliyor
// Herhangi bir kullanıcı başkasının projesine gelen başvuruyu kabul/reddedebilir
const { data: app } = await supabase
  .from('applications')
  .select('id, user_id, role_id, project_id, status')
  .eq('id', applicationId)
  .single()
// ❌ Proje liderinin bu user olduğu doğrulanmıyor
```

**Çözüm:**
```ts
// application alındıktan sonra ekle:
const { data: project } = await supabase
  .from('projects')
  .select('leader_id')
  .eq('id', app.project_id)
  .single()

if (project?.leader_id !== user.id) {
  return { success: false, error: 'Yetkisiz işlem' }
}
```

### 4b. `kickMember()` — Hiç yetki kontrolü yok
`features/teams/actions.ts`

```ts
// Şu an: takımdaki herhangi biri başkasını atabilir
const { error } = await supabase
  .from('team_members')
  .delete()
  .eq('team_id', teamId)
  .eq('user_id', userId)
// ❌ Lider kontrolü yok
```

**Çözüm:**
```ts
const { data: team } = await supabase
  .from('teams')
  .select('leader_id')
  .eq('id', teamId)
  .single()

if (team?.leader_id !== user.id) {
  return { success: false, error: 'Sadece takım lideri üye çıkarabilir' }
}
```

---

## 5. CSRF 🟢

**Durum:** Sorun yok.

Tüm mutasyonlar Next.js Server Actions ile yapılıyor. Server Actions, Origin header doğrulaması ile CSRF'e karşı yerleşik koruma sağlıyor. API route yok.

Cookie'ler `SameSite=Lax` ile set ediliyor.

**Aksiyon gerekmez.**

---

## 6. File Upload 🟡

**Durum:** Avatar ve CV güvenli, gönderi resimleri eksik.

✅ Avatar: tip (`image/*`) + boyut (5MB) kontrolü var  
✅ CV: tip (`application/pdf`) + boyut (5MB) kontrolü var  
✅ Dosya yolları `userId` bazlı, path traversal riski yok  

⚠️ **Sorun:** Gönderi resmi yüklemede:
- `accept="image/*"` sadece client-side (bypass edilebilir)
- Sunucuda MIME tipi doğrulanmıyor
- Boyut limiti yok
- `file.name.split('.').pop()` ile uzantı alınıyor — MIME yerine uzantıya güveniliyor

**Çözüm:** Sunucu tarafında MIME tipi ve boyut validasyonu ekle.

---

## 7. Rate Limiting 🔴

**Durum:** Hiç uygulanmamış.

Korumasız endpoint'ler:

| Endpoint | Risk |
|---|---|
| `login()` | Brute force ile şifre tahmini |
| `signup()` | Sahte hesap üretimi |
| `checkEmailAvailable()` | E-posta listesi toplama |
| `joinWaitlist()` | Waitlist spam |
| `search()` | Veri scraping |

**Çözüm:** Upstash Redis + `@upstash/ratelimit` ile middleware seviyesinde rate limiting.

```ts
// proxy.ts'e eklenecek örnek
import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(10, '10 s'),
})

// login isteğinde:
const { success } = await ratelimit.limit(ip)
if (!success) return new Response('Too Many Requests', { status: 429 })
```

---

## 8. Mass Assignment 🟢

**Durum:** Sorun yok.

Zod şemaları her action'da mevcut. Ham kullanıcı objesi doğrudan DB'ye geçirilmiyor.

```ts
// features/projects/actions.ts — güvenli örnek
const parsed = createProjectSchema.safeParse({ title, description, ... })
if (!parsed.success) return { success: false, error: ... }
// Sadece parsed.data DB'ye yazılıyor
```

**Aksiyon gerekmez.**

---

## 9. Data Exposure 🟡

**Durum:** `select('*')` yok, bir PII sızıntısı var.

✅ Tüm sorgular explicit alan listesi kullanıyor  
✅ Şifre hash, token gibi alanlar hiç sorgulanmıyor  

⚠️ **Sorun:** `getUserProfileById()` (`features/users/actions.ts`) — `email` alanı herkese açık dönüyor. E-posta PII'dır, sadece hesap sahibine gösterilmeli.

**Çözüm:**
```ts
// Sahip değilse email'i gizle
const profile = await getUserProfileById(id)
if (profile.id !== currentUser.id) {
  delete profile.email
}
```

---

## 10. CORS / Security Headers 🟡

**Durum:** API route yok (CORS riski düşük), ama güvenlik header'ları eksik.

✅ Tüm mutasyonlar Server Actions — CORS sorunu yok  
✅ `allowedDevOrigins` sadece local network  

⚠️ **Eksik header'lar:** CSP, X-Frame-Options, X-Content-Type-Options, HSTS

**Çözüm:** `next.config.ts`'e ekle:

```ts
headers: async () => [
  {
    source: '/:path*',
    headers: [
      { key: 'X-Content-Type-Options', value: 'nosniff' },
      { key: 'X-Frame-Options', value: 'DENY' },
      { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
      {
        key: 'Content-Security-Policy',
        value: [
          "default-src 'self'",
          "img-src 'self' data: https://*.supabase.co",
          "script-src 'self' 'unsafe-inline'",  // Next.js için gerekli
          "style-src 'self' 'unsafe-inline'",
        ].join('; ')
      },
    ],
  },
],
```

---

## Öncelik Sırası

| Öncelik | Madde | İş |
|---|---|---|
| 🔴 1 | Authorization | `reviewApplication` + `kickMember` sahiplik kontrolü ekle |
| 🔴 2 | Rate Limiting | Upstash ile login/signup/search rate limit |
| 🟡 3 | Security Headers | `next.config.ts`'e header'lar ekle |
| 🟡 4 | File Upload | Gönderi resmi sunucu validasyonu |
| 🟡 5 | Data Exposure | Email'i sahip olmayana gizle |
| 🟡 6 | XSS | Gönderi resim URL doğrulama |
