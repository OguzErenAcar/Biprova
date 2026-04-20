# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: security-advanced.spec.ts >> CSP Etkinlik >> CSP unsafe-inline script-src'de olmamalı
- Location: tests/security-advanced.spec.ts:354:7

# Error details

```
Error: expect(received).not.toContain(expected) // indexOf

Expected substring: not "'unsafe-inline'"
Received string:        " 'self' 'unsafe-inline' 'unsafe-eval'"
```

# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - generic [ref=e2]:
    - navigation [ref=e3]
    - generic [ref=e5]:
      - generic [ref=e6]: Yakında Geliyor — Bekleme Listesi Açık
      - heading "Ekibini bul. Birlikte üret." [level=1] [ref=e8]:
        - text: Ekibini bul.
        - text: Birlikte üret.
      - paragraph [ref=e9]: Yazılımcı mı, veteriner mi, grafiker mi — fark etmez. biprova'da aynı şehirden insanlar proje etrafında buluşur.
      - generic [ref=e12]:
        - textbox "E-posta adresin" [ref=e13]
        - button "Katıl →" [ref=e14] [cursor=pointer]
      - generic [ref=e15]:
        - generic [ref=e16]:
          - generic [ref=e17]: "0"
          - generic [ref=e18]: Bekleme Listesinde
        - generic [ref=e19]:
          - generic [ref=e20]: 12+
          - generic [ref=e21]: Şehirden Kayıt
        - generic [ref=e22]:
          - generic [ref=e23]: Ücretsiz
          - generic [ref=e24]: Sonsuza Kadar
      - generic [ref=e25]:
        - generic [ref=e26]: Veteriner — İzmir
        - generic [ref=e28]: Yazılımcı — İstanbul
        - generic [ref=e30]: Grafiker — Ankara
        - generic [ref=e32]: Kameraman — Remote
    - generic [ref=e34]:
      - paragraph [ref=e35]: Nasıl Çalışır ?
      - heading "4 adımda ekibini kur" [level=2] [ref=e36]
      - generic [ref=e37]:
        - generic [ref=e38]:
          - generic: "1"
          - heading "Proje Başlığı Aç" [level=3] [ref=e41]
          - paragraph [ref=e42]: Fikrinin detayını değil, ihtiyacını paylaş. Kim lazım, hangi şehirde, ne amaçla.
        - generic [ref=e43]:
          - generic: "2"
          - heading "Başvurular Gelir" [level=3] [ref=e46]
          - paragraph [ref=e47]: İlgilenenler "ben şunu yapabilirim" diye başvurur. Ekip barı dolmaya başlar.
        - generic [ref=e48]:
          - generic: "3"
          - heading "Özel Grup Açılır" [level=3] [ref=e51]
          - paragraph [ref=e52]: Bar dolduğunda sadece ekibinize özel alan oluşur. Fikrin detayları orada paylaşılır.
        - generic [ref=e53]:
          - generic: "4"
          - heading "24 Saat Kuralı" [level=3] [ref=e56]
          - paragraph [ref=e57]: Team leader ilk buluşmayı 24 saat içinde başlatmalı — yoksa ekip dağılır!
    - generic [ref=e58]:
      - paragraph [ref=e59]: Örnek Projeler
      - heading "Her alandan, her şehirden" [level=2] [ref=e60]
      - generic [ref=e61]:
        - generic [ref=e62] [cursor=pointer]:
          - generic [ref=e63]:
            - generic [ref=e64]: 📍 İzmir
            - generic [ref=e65]: Neredeyse Doldu
          - generic [ref=e66]: Sokak Hayvanlarına Yardım Organizasyonu
          - generic [ref=e67]:
            - generic [ref=e68]: ✓ Veteriner
            - generic [ref=e69]: ✓ Veteriner
            - generic [ref=e70]: Haberci
            - generic [ref=e71]: Fotoğrafçı
          - generic [ref=e73]:
            - generic [ref=e74]: Rol Doluluk
            - generic [ref=e75]: 3 / 5
        - generic [ref=e77] [cursor=pointer]:
          - generic [ref=e78]:
            - generic [ref=e79]: 📍 İstanbul
            - generic [ref=e80]: Açık
          - generic [ref=e81]: Bağımsız Kısa Film Projesi
          - generic [ref=e82]:
            - generic [ref=e83]: ✓ Yönetmen
            - generic [ref=e84]: Kameraman
            - generic [ref=e85]: Ses Tasarımcı
            - generic [ref=e86]: Oyuncu
          - generic [ref=e88]:
            - generic [ref=e89]: Rol Doluluk
            - generic [ref=e90]: 2 / 5
        - generic [ref=e92] [cursor=pointer]:
          - generic [ref=e93]:
            - generic [ref=e94]: 🌐 Remote
            - generic [ref=e95]: Neredeyse Doldu
          - generic [ref=e96]: Girişimcilik Podcast'i
          - generic [ref=e97]:
            - generic [ref=e98]: ✓ İçerik Üretici
            - generic [ref=e99]: ✓ Ses Editör
            - generic [ref=e100]: ✓ Grafiker
            - generic [ref=e101]: Pazarlama
          - generic [ref=e103]:
            - generic [ref=e104]: Rol Doluluk
            - generic [ref=e105]: 4 / 5
        - generic [ref=e107] [cursor=pointer]:
          - generic [ref=e108]:
            - generic [ref=e109]: 📍 Ankara
            - generic [ref=e110]: Açık
          - generic [ref=e111]: Mahalle Bostanı Kurma Girişimi
          - generic [ref=e112]:
            - generic [ref=e113]: Ziraat Müh.
            - generic [ref=e114]: Sosyal Hizmet
            - generic [ref=e115]: Grafiker
          - generic [ref=e117]:
            - generic [ref=e118]: Rol Doluluk
            - generic [ref=e119]: 1 / 4
    - generic [ref=e121]:
      - paragraph [ref=e122]: Neden biprova ?
      - heading "Yalnız proje zordur." [level=2] [ref=e123]
      - generic [ref=e124]:
        - generic [ref=e125]:
          - heading "Fikrin Güvende" [level=3] [ref=e128]
          - paragraph [ref=e129]: Timeline'da fikir değil, ihtiyaç paylaşılır. Detaylar sadece ekibinde konuşulur.
        - generic [ref=e130]:
          - heading "Şehir Bazlı Eşleşme" [level=3] [ref=e133]
          - paragraph [ref=e134]: Fiziksel buluşma gerektiren projelerde aynı şehirdekilerle eşleşirsin.
        - generic [ref=e135]:
          - heading "Aktif Tutma Kuralı" [level=3] [ref=e138]
          - paragraph [ref=e139]: 24 saat kuralı ile ölü projeler temizlenir. Sadece gerçek ekipler kalır.
        - generic [ref=e140]:
          - heading "CV'ye Giren Deneyim" [level=3] [ref=e143]
          - paragraph [ref=e144]: Tamamlanan her proje somut bir portföy çıktısı. İşe başvururken kanıt olur.
    - generic [ref=e146]:
      - heading "Hazır olunca seni arayalım" [level=2] [ref=e147]
      - paragraph [ref=e148]: Şimdi kayıt ol, platform açıldığında ilk sen öğren.
      - generic [ref=e150]:
        - textbox "E-posta adresin" [ref=e151]
        - button "Gir →" [ref=e152] [cursor=pointer]
    - contentinfo [ref=e153]:
      - link "birprova" [ref=e154] [cursor=pointer]:
        - /url: /
      - generic [ref=e155]:
        - link "Bekleme Listesi" [ref=e156] [cursor=pointer]:
          - /url: /waitlist
        - link "Giriş Yap" [ref=e157] [cursor=pointer]:
          - /url: /login
        - link "Kayıt Ol" [ref=e158] [cursor=pointer]:
          - /url: /signup
        - link "Kullanım Koşulları" [ref=e159] [cursor=pointer]:
          - /url: /terms
        - link "Gizlilik Politikası" [ref=e160] [cursor=pointer]:
          - /url: /privacy
      - paragraph [ref=e161]: © 2025 biprova — Tüm hakları saklıdır.
  - button "Open Next.js Dev Tools" [ref=e167] [cursor=pointer]:
    - img [ref=e168]
```

# Test source

```ts
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
  328 |     expect(injected).toBeFalsy()
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
> 363 |       expect(scriptSrcMatch[1]).not.toContain("'unsafe-inline'")
      |                                     ^ Error: expect(received).not.toContain(expected) // indexOf
  364 |     }
  365 |   })
  366 | })
  367 | 
```