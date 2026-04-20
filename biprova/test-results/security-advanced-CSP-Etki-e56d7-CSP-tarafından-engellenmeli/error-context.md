# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: security-advanced.spec.ts >> CSP Etkinlik >> inline script CSP tarafından engellenmeli
- Location: tests/security-advanced.spec.ts:296:7

# Error details

```
Error: expect(received).toBeFalsy()

Received: true
```

# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - generic [ref=e2]:
    - navigation [ref=e3]:
      - link "Biprova" [ref=e4] [cursor=pointer]:
        - /url: /
      - generic [ref=e5]:
        - link "Giriş Yap" [ref=e6] [cursor=pointer]:
          - /url: /login
        - link "🚀 Listeye Katıl" [ref=e7] [cursor=pointer]:
          - /url: /waitlist
    - generic [ref=e9]:
      - generic [ref=e10]: Yakında Geliyor — Bekleme Listesi Açık
      - heading "Ekibini bul. Birlikte üret." [level=1] [ref=e12]:
        - text: Ekibini bul.
        - text: Birlikte üret.
      - paragraph [ref=e13]: Yazılımcı mı, veteriner mi, grafiker mi — fark etmez. biprova'da aynı şehirden insanlar proje etrafında buluşur.
      - generic [ref=e16]:
        - textbox "E-posta adresin" [ref=e17]
        - button "Katıl →" [ref=e18] [cursor=pointer]
      - generic [ref=e19]:
        - generic [ref=e20]:
          - generic [ref=e21]: "182"
          - generic [ref=e22]: Bekleme Listesinde
        - generic [ref=e23]:
          - generic [ref=e24]: 12+
          - generic [ref=e25]: Şehirden Kayıt
        - generic [ref=e26]:
          - generic [ref=e27]: Ücretsiz
          - generic [ref=e28]: Sonsuza Kadar
      - generic [ref=e29]:
        - generic [ref=e30]: Veteriner — İzmir
        - generic [ref=e32]: Yazılımcı — İstanbul
        - generic [ref=e34]: Grafiker — Ankara
        - generic [ref=e36]: Kameraman — Remote
    - generic [ref=e38]:
      - paragraph [ref=e39]: Nasıl Çalışır ?
      - heading "4 adımda ekibini kur" [level=2] [ref=e40]
      - generic [ref=e41]:
        - generic [ref=e42]:
          - generic: "1"
          - img [ref=e46]
          - heading "Proje Başlığı Aç" [level=3] [ref=e60]
          - paragraph [ref=e61]: Fikrinin detayını değil, ihtiyacını paylaş. Kim lazım, hangi şehirde, ne amaçla.
        - generic [ref=e62]:
          - generic: "2"
          - img [ref=e66]
          - heading "Başvurular Gelir" [level=3] [ref=e81]
          - paragraph [ref=e82]: İlgilenenler "ben şunu yapabilirim" diye başvurur. Ekip barı dolmaya başlar.
        - generic [ref=e83]:
          - generic: "3"
          - img [ref=e87]
          - heading "Özel Grup Açılır" [level=3] [ref=e103]
          - paragraph [ref=e104]: Bar dolduğunda sadece ekibinize özel alan oluşur. Fikrin detayları orada paylaşılır.
        - generic [ref=e105]:
          - generic: "4"
          - img [ref=e109]
          - heading "24 Saat Kuralı" [level=3] [ref=e127]
          - paragraph [ref=e128]: Team leader ilk buluşmayı 24 saat içinde başlatmalı — yoksa ekip dağılır!
    - generic [ref=e129]:
      - paragraph [ref=e130]: Örnek Projeler
      - heading "Her alandan, her şehirden" [level=2] [ref=e131]
      - generic [ref=e132]:
        - generic [ref=e133] [cursor=pointer]:
          - generic [ref=e134]:
            - generic [ref=e135]: 📍 İzmir
            - generic [ref=e136]: Neredeyse Doldu
          - generic [ref=e137]: Sokak Hayvanlarına Yardım Organizasyonu
          - generic [ref=e138]:
            - generic [ref=e139]: ✓ Veteriner
            - generic [ref=e140]: ✓ Veteriner
            - generic [ref=e141]: Haberci
            - generic [ref=e142]: Fotoğrafçı
          - generic [ref=e144]:
            - generic [ref=e145]: Rol Doluluk
            - generic [ref=e146]: 3 / 5
        - generic [ref=e148] [cursor=pointer]:
          - generic [ref=e149]:
            - generic [ref=e150]: 📍 İstanbul
            - generic [ref=e151]: Açık
          - generic [ref=e152]: Bağımsız Kısa Film Projesi
          - generic [ref=e153]:
            - generic [ref=e154]: ✓ Yönetmen
            - generic [ref=e155]: Kameraman
            - generic [ref=e156]: Ses Tasarımcı
            - generic [ref=e157]: Oyuncu
          - generic [ref=e159]:
            - generic [ref=e160]: Rol Doluluk
            - generic [ref=e161]: 2 / 5
        - generic [ref=e163] [cursor=pointer]:
          - generic [ref=e164]:
            - generic [ref=e165]: 🌐 Remote
            - generic [ref=e166]: Neredeyse Doldu
          - generic [ref=e167]: Girişimcilik Podcast'i
          - generic [ref=e168]:
            - generic [ref=e169]: ✓ İçerik Üretici
            - generic [ref=e170]: ✓ Ses Editör
            - generic [ref=e171]: ✓ Grafiker
            - generic [ref=e172]: Pazarlama
          - generic [ref=e174]:
            - generic [ref=e175]: Rol Doluluk
            - generic [ref=e176]: 4 / 5
        - generic [ref=e178] [cursor=pointer]:
          - generic [ref=e179]:
            - generic [ref=e180]: 📍 Ankara
            - generic [ref=e181]: Açık
          - generic [ref=e182]: Mahalle Bostanı Kurma Girişimi
          - generic [ref=e183]:
            - generic [ref=e184]: Ziraat Müh.
            - generic [ref=e185]: Sosyal Hizmet
            - generic [ref=e186]: Grafiker
          - generic [ref=e188]:
            - generic [ref=e189]: Rol Doluluk
            - generic [ref=e190]: 1 / 4
    - generic [ref=e192]:
      - paragraph [ref=e193]: Neden biprova ?
      - heading "Yalnız proje zordur." [level=2] [ref=e194]
      - generic [ref=e195]:
        - generic [ref=e196]:
          - img [ref=e200]
          - heading "Fikrin Güvende" [level=3] [ref=e213]
          - paragraph [ref=e214]: Timeline'da fikir değil, ihtiyaç paylaşılır. Detaylar sadece ekibinde konuşulur.
        - generic [ref=e215]:
          - img [ref=e219]
          - heading "Şehir Bazlı Eşleşme" [level=3] [ref=e228]
          - paragraph [ref=e229]: Fiziksel buluşma gerektiren projelerde aynı şehirdekilerle eşleşirsin.
        - generic [ref=e230]:
          - img [ref=e234]
          - heading "Aktif Tutma Kuralı" [level=3] [ref=e246]
          - paragraph [ref=e247]: 24 saat kuralı ile ölü projeler temizlenir. Sadece gerçek ekipler kalır.
        - generic [ref=e248]:
          - img [ref=e252]
          - heading "CV'ye Giren Deneyim" [level=3] [ref=e273]
          - paragraph [ref=e274]: Tamamlanan her proje somut bir portföy çıktısı. İşe başvururken kanıt olur.
    - generic [ref=e276]:
      - heading "Hazır olunca seni arayalım" [level=2] [ref=e277]
      - paragraph [ref=e278]: Şimdi kayıt ol, platform açıldığında ilk sen öğren.
      - generic [ref=e280]:
        - textbox "E-posta adresin" [ref=e281]
        - button "Gir →" [ref=e282] [cursor=pointer]
    - contentinfo [ref=e283]:
      - link "birprova" [ref=e284] [cursor=pointer]:
        - /url: /
      - generic [ref=e285]:
        - link "Bekleme Listesi" [ref=e286] [cursor=pointer]:
          - /url: /waitlist
        - link "Giriş Yap" [ref=e287] [cursor=pointer]:
          - /url: /login
        - link "Kayıt Ol" [ref=e288] [cursor=pointer]:
          - /url: /signup
        - link "Kullanım Koşulları" [ref=e289] [cursor=pointer]:
          - /url: /terms
        - link "Gizlilik Politikası" [ref=e290] [cursor=pointer]:
          - /url: /privacy
      - paragraph [ref=e291]: © 2025 biprova — Tüm hakları saklıdır.
  - button "Open Next.js Dev Tools" [ref=e297] [cursor=pointer]:
    - img [ref=e298]
  - alert [ref=e301]
```

# Test source

```ts
  228 | test.describe('Hesap Numaralandırma', () => {
  229 |   test('kayıtlı ve kayıtsız email için hata mesajı aynı olmalı', async ({ page }) => {
  230 |     // Kayıtlı olmayan email ile giriş
  231 |     await page.goto(`${BASE_URL}/login`)
  232 |     await page.fill('input[type="email"]', 'kesinlikle-kayitli-degil-xzy123@test.com')
  233 |     await page.fill('input[type="password"]', 'HerhangiParola123!')
  234 |     await page.click('button[type="submit"], button')
  235 |     await page.waitForLoadState('networkidle')
  236 |     const contentUnknown = await page.content()
  237 | 
  238 |     // Bilinen ama yanlış şifreli email ile giriş
  239 |     await page.goto(`${BASE_URL}/login`)
  240 |     await page.fill('input[type="email"]', 'oguzacrern@gmail.com')
  241 |     await page.fill('input[type="password"]', 'YanlisParola999!')
  242 |     await page.click('button[type="submit"], button')
  243 |     await page.waitForLoadState('networkidle')
  244 |     const contentKnown = await page.content()
  245 | 
  246 |     // Her iki durumda da "bu email kayıtlı değil" gibi email varlığını ele veren
  247 |     // spesifik mesajlar olmamalı — genel bir hata mesajı yetmeli
  248 |     expect(contentUnknown).not.toMatch(/bu e-?posta.*kayıtlı değil|email.*bulunamadı|kullanıcı.*mevcut değil/i)
  249 |     expect(contentKnown).not.toMatch(/bu e-?posta.*kayıtlı değil|email.*bulunamadı|kullanıcı.*mevcut değil/i)
  250 |   })
  251 | 
  252 |   test('login hata mesajı email varlığını açıklamamalı', async ({ page }) => {
  253 |     await page.goto(`${BASE_URL}/login`)
  254 |     await page.fill('input[type="email"]', 'rastgele-yok@example.com')
  255 |     await page.fill('input[type="password"]', 'ParolaXYZ123!')
  256 |     await page.click('button[type="submit"], button')
  257 |     await page.waitForLoadState('networkidle')
  258 |     const content = await page.content()
  259 | 
  260 |     // Email adresi kesinlikle hata mesajında tekrar gösterilmemeli
  261 |     expect(content).not.toMatch(/rastgele-yok@example\.com.*yok|yok.*rastgele-yok@example\.com/i)
  262 |     // "Kullanıcı bulunamadı" türünden mesajlar email enumerationa izin verir
  263 |     expect(content).not.toMatch(/user not found|no user found|account.*not.*exist/i)
  264 |   })
  265 | 
  266 |   test('şifre sıfırlama sayfası email varlığını ele vermemeli', async ({ page }) => {
  267 |     const resetUrl = `${BASE_URL}/reset-password`
  268 |     const response = await page.goto(resetUrl)
  269 | 
  270 |     // Sayfa yoksa atla (henüz implemente edilmemiş olabilir)
  271 |     if (!response || response.status() === 404) {
  272 |       test.skip()
  273 |       return
  274 |     }
  275 | 
  276 |     const emailInput = page.locator('input[type="email"]')
  277 |     if (!(await emailInput.isVisible())) {
  278 |       test.skip()
  279 |       return
  280 |     }
  281 | 
  282 |     await emailInput.fill('yok-olan-email@example.com')
  283 |     await page.click('button[type="submit"], button')
  284 |     await page.waitForLoadState('networkidle')
  285 |     const content = await page.content()
  286 | 
  287 |     // "Bu email ile kayıtlı hesap bulunamadı" gibi mesaj olmamalı
  288 |     expect(content).not.toMatch(/email.*kayıtlı değil|hesap.*bulunamadı|no account/i)
  289 |   })
  290 | })
  291 | 
  292 | // ---------------------------------------------------------------------------
  293 | // 10. CSP Etkinlik Testi
  294 | // ---------------------------------------------------------------------------
  295 | test.describe('CSP Etkinlik', () => {
  296 |   test('inline script CSP tarafından engellenmeli', async ({ page }) => {
  297 |     let alertFired = false
  298 |     let cspViolation = false
  299 | 
  300 |     page.on('dialog', async (dialog) => {
  301 |       alertFired = true
  302 |       await dialog.dismiss()
  303 |     })
  304 | 
  305 |     // CSP violation raporunu yakala
  306 |     page.on('console', (msg) => {
  307 |       if (msg.text().toLowerCase().includes('content security policy')) {
  308 |         cspViolation = true
  309 |       }
  310 |     })
  311 | 
  312 |     await page.goto(`${BASE_URL}/`)
  313 |     await page.waitForLoadState('networkidle')
  314 | 
  315 |     // Sayfaya inline script enjekte etmeye çalış
  316 |     await page.evaluate(() => {
  317 |       try {
  318 |         const s = document.createElement('script')
  319 |         s.textContent = 'window.__cspTestAlert = true'
  320 |         document.head.appendChild(s)
  321 |       } catch {
  322 |         // CSP engelledi — beklenen davranış
  323 |       }
  324 |     })
  325 | 
  326 |     // CSP çalışıyorsa inline script'in etkisi olmamalı
  327 |     const injected = await page.evaluate(() => (window as Window & { __cspTestAlert?: boolean }).__cspTestAlert)
> 328 |     expect(injected).toBeFalsy()
      |                      ^ Error: expect(received).toBeFalsy()
  329 |     expect(alertFired).toBe(false)
  330 |   })
  331 | 
  332 |   test('CSP header default-src self içermeli', async ({ page }) => {
  333 |     const response = await page.goto(`${BASE_URL}/`)
  334 |     const csp = response!.headers()['content-security-policy']
  335 | 
  336 |     if (!csp) {
  337 |       // CSP header yoksa test başarısız — güvenlik açığı
  338 |       expect(csp).toBeDefined()
  339 |       return
  340 |     }
  341 | 
  342 |     expect(csp).toMatch(/default-src[^;]*'self'/)
  343 |   })
  344 | 
  345 |   test("CSP unsafe-eval içermemeli", async ({ page }) => {
  346 |     const response = await page.goto(`${BASE_URL}/`)
  347 |     const csp = response!.headers()['content-security-policy']
  348 | 
  349 |     if (!csp) return // CSP yoksa üstteki test zaten yakalar
  350 | 
  351 |     expect(csp).not.toContain("'unsafe-eval'")
  352 |   })
  353 | 
  354 |   test("CSP unsafe-inline script-src'de olmamalı", async ({ page }) => {
  355 |     const response = await page.goto(`${BASE_URL}/`)
  356 |     const csp = response!.headers()['content-security-policy']
  357 | 
  358 |     if (!csp) return
  359 | 
  360 |     // script-src direktifi varsa unsafe-inline içermemeli
  361 |     const scriptSrcMatch = csp.match(/script-src([^;]*)/)
  362 |     if (scriptSrcMatch) {
  363 |       expect(scriptSrcMatch[1]).not.toContain("'unsafe-inline'")
  364 |     }
  365 |   })
  366 | })
  367 | 
```