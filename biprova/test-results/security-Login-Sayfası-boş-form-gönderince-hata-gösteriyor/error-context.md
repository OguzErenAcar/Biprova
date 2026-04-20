# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: security.spec.ts >> Login Sayfası >> boş form gönderince hata gösteriyor
- Location: tests/security.spec.ts:50:7

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: locator('text=/e-posta|geçerli/i')
Expected: visible
Error: strict mode violation: locator('text=/e-posta|geçerli/i') resolved to 2 elements:
    1) <label for="email" class="text-[0.82rem] font-bold text-slate-900">E-posta</label> aka getByText('E-posta', { exact: true })
    2) <p class="text-[0.75rem] text-red-500">Geçerli bir e-posta gir</p> aka getByText('Geçerli bir e-posta gir')

Call log:
  - Expect "toBeVisible" with timeout 3000ms
  - waiting for locator('text=/e-posta|geçerli/i')

```

# Page snapshot

```yaml
- generic [ref=e1]:
  - main [ref=e3]:
    - generic [ref=e4]:
      - link "birprova" [ref=e5] [cursor=pointer]:
        - /url: /
      - paragraph [ref=e6]:
        - text: Tekrar hoş geldin.
        - text: Hesabına giriş yap.
      - generic [ref=e7]:
        - generic [ref=e8]:
          - generic [ref=e9]: E-posta
          - textbox "E-posta" [ref=e10]:
            - /placeholder: ornek@mail.com
          - paragraph [ref=e11]: Geçerli bir e-posta gir
        - generic [ref=e12]:
          - generic [ref=e13]: Şifre
          - textbox "Şifre" [ref=e14]:
            - /placeholder: ••••••••
          - paragraph [ref=e15]: Şifre en az 8 karakter olmalı
        - button "Giriş Yap →" [active] [ref=e16] [cursor=pointer]
      - paragraph [ref=e17]:
        - link "Şifremi unuttum" [ref=e18] [cursor=pointer]:
          - /url: /forgot-password
      - paragraph [ref=e19]:
        - text: Hesabın yok mu?
        - link "Kayıt ol" [ref=e20] [cursor=pointer]:
          - /url: /signup
      - link "← Ana sayfaya dön" [ref=e21] [cursor=pointer]:
        - /url: /
  - button "Open Next.js Dev Tools" [ref=e27] [cursor=pointer]:
    - img [ref=e28]
  - alert [ref=e31]
```

# Test source

```ts
  1   | import { test, expect } from '@playwright/test'
  2   | 
  3   | const BASE_URL = 'http://localhost:3000'
  4   | 
  5   | // ---------------------------------------------------------------------------
  6   | // 1. Auth Bypass — giriş yapmadan korumalı sayfalara erişim
  7   | // ---------------------------------------------------------------------------
  8   | test.describe('Auth Bypass', () => {
  9   |   test('dashboard ana sayfa — yetkisiz erişim reddedilmeli', async ({ page }) => {
  10  |     await page.goto(`${BASE_URL}/dashboard`)
  11  |     await page.waitForURL(/\/(login|$)/, { timeout: 5000 })
  12  |     expect(page.url()).not.toContain('/dashboard')
  13  |   })
  14  | 
  15  |   test('dashboard/projects — yetkisiz erişim reddedilmeli', async ({ page }) => {
  16  |     await page.goto(`${BASE_URL}/dashboard/projects/fake-id`)
  17  |     await page.waitForURL(/\/(login|$)/, { timeout: 5000 })
  18  |     expect(page.url()).not.toContain('/dashboard')
  19  |   })
  20  | 
  21  |   test('dashboard/teams — yetkisiz erişim reddedilmeli', async ({ page }) => {
  22  |     await page.goto(`${BASE_URL}/dashboard/teams/fake-id`)
  23  |     await page.waitForURL(/\/(login|$)/, { timeout: 5000 })
  24  |     expect(page.url()).not.toContain('/dashboard')
  25  |   })
  26  | 
  27  |   test('dashboard/profile — yetkisiz erişim reddedilmeli', async ({ page }) => {
  28  |     await page.goto(`${BASE_URL}/dashboard/profile`)
  29  |     await page.waitForURL(/\/(login|$)/, { timeout: 5000 })
  30  |     expect(page.url()).not.toContain('/dashboard')
  31  |   })
  32  | 
  33  |   test('dashboard/settings — yetkisiz erişim reddedilmeli', async ({ page }) => {
  34  |     await page.goto(`${BASE_URL}/dashboard/settings`)
  35  |     await page.waitForURL(/\/(login|$)/, { timeout: 5000 })
  36  |     expect(page.url()).not.toContain('/dashboard')
  37  |   })
  38  | })
  39  | 
  40  | // ---------------------------------------------------------------------------
  41  | // 2. Login sayfası — temel kontroller
  42  | // ---------------------------------------------------------------------------
  43  | test.describe('Login Sayfası', () => {
  44  |   test('login sayfası yükleniyor', async ({ page }) => {
  45  |     await page.goto(`${BASE_URL}/login`)
  46  |     await expect(page.locator('input[type="email"]')).toBeVisible()
  47  |     await expect(page.locator('input[type="password"]')).toBeVisible()
  48  |   })
  49  | 
  50  |   test('boş form gönderince hata gösteriyor', async ({ page }) => {
  51  |     await page.goto(`${BASE_URL}/login`)
  52  |     await page.click('button')
  53  |     // Validation hataları görünmeli
> 54  |     await expect(page.locator('text=/e-posta|geçerli/i')).toBeVisible({ timeout: 3000 })
      |                                                           ^ Error: expect(locator).toBeVisible() failed
  55  |   })
  56  | 
  57  |   test('yanlış bilgilerle giriş başarısız olmalı', async ({ page }) => {
  58  |     await page.goto(`${BASE_URL}/login`)
  59  |     await page.fill('input[type="email"]', 'yanliskullanici@test.com')
  60  |     await page.fill('input[type="password"]', 'YanlisParola123!')
  61  |     await page.click('button')
  62  |     await expect(page.locator('text=/hatalı|geçersiz|yanlış/i')).toBeVisible({ timeout: 5000 })
  63  |   })
  64  | 
  65  |   test('giriş yapmış kullanıcı login sayfasına gelince dashboard\'a yönlenmeli', async ({ page, context }) => {
  66  |     // Bu testi atla — gerçek credentials gerektirir
  67  |     test.skip()
  68  |   })
  69  | })
  70  | 
  71  | // ---------------------------------------------------------------------------
  72  | // 3. Güvenlik Headerları
  73  | // ---------------------------------------------------------------------------
  74  | test.describe('Güvenlik Headerları', () => {
  75  |   test('X-Frame-Options: DENY mevcut', async ({ page }) => {
  76  |     const response = await page.goto(`${BASE_URL}/`)
  77  |     const headers = response!.headers()
  78  |     expect(headers['x-frame-options']).toBe('DENY')
  79  |   })
  80  | 
  81  |   test('X-Content-Type-Options: nosniff mevcut', async ({ page }) => {
  82  |     const response = await page.goto(`${BASE_URL}/`)
  83  |     const headers = response!.headers()
  84  |     expect(headers['x-content-type-options']).toBe('nosniff')
  85  |   })
  86  | 
  87  |   test('Content-Security-Policy header mevcut', async ({ page }) => {
  88  |     const response = await page.goto(`${BASE_URL}/`)
  89  |     const headers = response!.headers()
  90  |     expect(headers['content-security-policy']).toBeDefined()
  91  |     expect(headers['content-security-policy']).toContain("default-src 'self'")
  92  |   })
  93  | 
  94  |   test('Referrer-Policy header mevcut', async ({ page }) => {
  95  |     const response = await page.goto(`${BASE_URL}/`)
  96  |     const headers = response!.headers()
  97  |     expect(headers['referrer-policy']).toBe('strict-origin-when-cross-origin')
  98  |   })
  99  | 
  100 |   test('Powered-By header gizlenmiş', async ({ page }) => {
  101 |     const response = await page.goto(`${BASE_URL}/`)
  102 |     const headers = response!.headers()
  103 |     expect(headers['x-powered-by']).toBeUndefined()
  104 |   })
  105 | })
  106 | 
  107 | // ---------------------------------------------------------------------------
  108 | // 4. Açık Redirect testi
  109 | // ---------------------------------------------------------------------------
  110 | test.describe('Açık Redirect', () => {
  111 |   test('login?next= ile dış siteye redirect olmamalı', async ({ page }) => {
  112 |     await page.goto(`${BASE_URL}/login?next=https://evil.com`)
  113 |     // Eğer manipüle edilmiş bir redirect varsa dış siteye gidebilir
  114 |     await page.waitForLoadState('networkidle')
  115 |     expect(page.url()).toContain('localhost:3000')
  116 |   })
  117 | 
  118 |   test('login?redirect= ile dış siteye redirect olmamalı', async ({ page }) => {
  119 |     await page.goto(`${BASE_URL}/login?redirect=https://evil.com`)
  120 |     await page.waitForLoadState('networkidle')
  121 |     expect(page.url()).toContain('localhost:3000')
  122 |   })
  123 | })
  124 | 
  125 | // ---------------------------------------------------------------------------
  126 | // 5. Hassas bilgi sızıntısı
  127 | // ---------------------------------------------------------------------------
  128 | test.describe('Hassas Bilgi Sızıntısı', () => {
  129 |   test('404 sayfası stack trace veya yol bilgisi içermemeli', async ({ page }) => {
  130 |     const response = await page.goto(`${BASE_URL}/bu-sayfa-yok-${Date.now()}`)
  131 |     const content = await page.content()
  132 |     expect(content).not.toMatch(/node_modules|at Object\.|at Module\.|\.ts:\d+/)
  133 |   })
  134 | 
  135 |   test('dashboard 401/403 hatasında sunucu detayı sızmamalı', async ({ page }) => {
  136 |     const response = await page.goto(`${BASE_URL}/dashboard/projects/00000000-0000-0000-0000-000000000000`)
  137 |     const content = await page.content()
  138 |     expect(content).not.toMatch(/SUPABASE|service_role|eyJhbGci/)
  139 |   })
  140 | })
  141 | 
```