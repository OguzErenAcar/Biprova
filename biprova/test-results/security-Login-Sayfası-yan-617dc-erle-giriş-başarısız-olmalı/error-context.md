# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: security.spec.ts >> Login Sayfası >> yanlış bilgilerle giriş başarısız olmalı
- Location: tests/security.spec.ts:57:7

# Error details

```
Test timeout of 15000ms exceeded.
```

```
Error: page.fill: Test timeout of 15000ms exceeded.
Call log:
  - waiting for locator('input[type="email"]')

```

# Page snapshot

```yaml
- generic:
  - generic [active]:
    - generic [ref=e3]:
      - generic [ref=e4]:
        - generic [ref=e5]:
          - navigation [ref=e6]:
            - button "previous" [disabled] [ref=e7]:
              - img "previous" [ref=e8]
            - generic [ref=e10]:
              - generic [ref=e11]: 1/
              - text: "1"
            - button "next" [disabled] [ref=e12]:
              - img "next" [ref=e13]
          - img
        - generic [ref=e15]:
          - link "Next.js 16.2.1 (stale) Turbopack" [ref=e16] [cursor=pointer]:
            - /url: https://nextjs.org/docs/messages/version-staleness
            - img [ref=e17]
            - generic "There is a newer version (16.2.4) available, upgrade recommended!" [ref=e19]: Next.js 16.2.1 (stale)
            - generic [ref=e20]: Turbopack
          - img
      - generic [ref=e21]:
        - dialog "Runtime Error" [ref=e22]:
          - generic [ref=e25]:
            - generic [ref=e26]:
              - generic [ref=e27]:
                - generic [ref=e29]: Runtime Error
                - generic [ref=e30]:
                  - button "Copy Error Info" [ref=e31] [cursor=pointer]:
                    - img [ref=e32]
                  - link "Go to related documentation" [ref=e34] [cursor=pointer]:
                    - /url: https://nextjs.org/docs/app/api-reference/file-conventions/route-segment-config
                    - img [ref=e35]
                  - button "Attach Node.js inspector" [ref=e37] [cursor=pointer]:
                    - img [ref=e38]
              - generic [ref=e46]:
                - generic [ref=e47]:
                  - text: "./middleware.ts:8:14 Next.js can't recognize the exported `config` field in route. It needs to be a static object. 6 | } 7 | > 8 | export const config = proxyConfig | ^^^^^^ 9 | The exported configuration object in a source file needs to have a very specific format from which some properties can be statically parsed at compiled-time."
                  - link "https://nextjs.org/docs/app/api-reference/file-conventions/route-segment-config" [ref=e48] [cursor=pointer]:
                    - /url: https://nextjs.org/docs/app/api-reference/file-conventions/route-segment-config
                - button "Show More" [ref=e50] [cursor=pointer]
            - generic [ref=e52]:
              - generic [ref=e53]:
                - paragraph [ref=e54]:
                  - text: Call Stack
                  - generic [ref=e55]: "9"
                - button "Show 7 ignore-listed frame(s)" [ref=e56] [cursor=pointer]:
                  - text: Show 7 ignore-listed frame(s)
                  - img [ref=e57]
              - generic [ref=e59]:
                - generic [ref=e60]:
                  - text: <unknown>
                  - button "Sourcemapping failed. Click to log cause of error." [ref=e61] [cursor=pointer]:
                    - img [ref=e62]
                - text: "error: ./middleware.ts (8:14)"
              - generic [ref=e64]:
                - generic [ref=e65]: "<unknown> (Error:"
                - text: ./middleware.ts (8:14)
          - generic [ref=e66]: "1"
          - generic [ref=e67]: "2"
        - contentinfo [ref=e68]:
          - region "Error feedback" [ref=e69]:
            - paragraph [ref=e70]:
              - link "Was this helpful?" [ref=e71] [cursor=pointer]:
                - /url: https://nextjs.org/telemetry#error-feedback
            - button "Mark as helpful" [ref=e72] [cursor=pointer]:
              - img [ref=e73]
            - button "Mark as not helpful" [ref=e76] [cursor=pointer]:
              - img [ref=e77]
    - generic [ref=e83] [cursor=pointer]:
      - button "Open Next.js Dev Tools" [ref=e84]:
        - img [ref=e85]
      - generic [ref=e88]:
        - button "Open issues overlay" [ref=e89]:
          - generic [ref=e90]:
            - generic [ref=e91]: "0"
            - generic [ref=e92]: "1"
          - generic [ref=e93]: Issue
        - button "Collapse issues badge" [ref=e94]:
          - img [ref=e95]
  - alert [ref=e97]
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
  54  |     await expect(page.locator('text=/e-posta|geçerli/i')).toBeVisible({ timeout: 3000 })
  55  |   })
  56  | 
  57  |   test('yanlış bilgilerle giriş başarısız olmalı', async ({ page }) => {
  58  |     await page.goto(`${BASE_URL}/login`)
> 59  |     await page.fill('input[type="email"]', 'yanliskullanici@test.com')
      |                ^ Error: page.fill: Test timeout of 15000ms exceeded.
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