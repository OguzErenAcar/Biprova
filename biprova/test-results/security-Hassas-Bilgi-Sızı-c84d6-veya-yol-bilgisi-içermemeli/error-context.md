# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: security.spec.ts >> Hassas Bilgi Sızıntısı >> 404 sayfası stack trace veya yol bilgisi içermemeli
- Location: tests/security.spec.ts:129:7

# Error details

```
Error: expect(received).not.toMatch(expected)

Expected pattern: not /node_modules|at Object\.|at Module\.|\.ts:\d+/
Received string:      "<!DOCTYPE html><html><head><meta charset=\"utf-8\" data-next-head=\"\"><meta name=\"viewport\" content=\"width=device-width\" data-next-head=\"\"><noscript data-n-css=\"\"></noscript><script src=\"/_next/static/chunks/node_modules_next_dist_compiled_0o6l_m6._.js\" defer=\"\"></script><script src=\"/_next/static/chunks/node_modules_next_dist_shared_lib_0~pg0mt._.js\" defer=\"\"></script><script src=\"/_next/static/chunks/node_modules_next_dist_client_0pe1dg-._.js\" defer=\"\"></script><script src=\"/_next/static/chunks/node_modules_next_dist_0u_w_5s._.js\" defer=\"\"></script><script src=\"/_next/static/chunks/node_modules_next_app_0jt-zj..js\" defer=\"\"></script><script src=\"/_next/static/chunks/%5Bnext%5D_entry_page-loader_ts_0j~flwh._.js\" defer=\"\"></script><script src=\"/_next/static/chunks/node_modules_react-dom_0bruynb._.js\" defer=\"\"></script><script src=\"/_next/static/chunks/node_modules_0lx093h._.js\" defer=\"\"></script><script src=\"/_next/static/chunks/%5Broot-of-the-server%5D__0c0okpg._.js\" defer=\"\"></script><script src=\"/_next/static/chunks/pages__app_07xvfw~._.js\" defer=\"\"></script><script src=\"/_next/static/chunks/turbopack-pages__app_0_wu8vy._.js\" defer=\"\"></script><script src=\"/_next/static/chunks/node_modules_next_dist_shared_lib_12bi_n7._.js\" defer=\"\"></script><script src=\"/_next/static/chunks/node_modules_next_dist_0rt-2cr._.js\" defer=\"\"></script><script src=\"/_next/static/chunks/%5Bnext%5D_entry_page-loader_ts_0rqw6yo._.js\" defer=\"\"></script><script src=\"/_next/static/chunks/%5Broot-of-the-server%5D__01mw43t._.js\" defer=\"\"></script><script src=\"/_next/static/chunks/pages__error_07xvfw~._.js\" defer=\"\"></script><script src=\"/_next/static/chunks/turbopack-pages__error_016chbq._.js\" defer=\"\"></script><script src=\"/_next/static/development/_buildManifest.js\" defer=\"\"></script><script src=\"/_next/static/development/_ssgManifest.js\" defer=\"\"></script><script src=\"/_next/static/development/_clientMiddlewareManifest.js\" defer=\"\"></script><noscript id=\"__next_css__DO_NOT_USE__\"></noscript></head><body><div id=\"__next\"></div><script id=\"__NEXT_DATA__\" type=\"application/json\">{\"props\":{\"pageProps\":{\"statusCode\":500,\"hostname\":\"localhost\"}},\"page\":\"/_error\",\"query\":{},\"buildId\":\"development\",\"isFallback\":false,\"err\":{\"name\":\"Error\",\"source\":\"server\",\"message\":\"./middleware.ts:8:14\\nNext.js can't recognize the exported `config` field in route. It needs to be a static object.\\n  6 | }\\n  7 |\\n\\u003e 8 | export const config = proxyConfig\\n    |              ^^^^^^\\n  9 |\\n\\nThe exported configuration object in a source file needs to have a very specific format from which some properties can be statically parsed at compiled-time.\\n\\nhttps://nextjs.org/docs/app/api-reference/file-conventions/route-segment-config\\n\\n\",\"stack\":\"Error: ./middleware.ts:8:14\\nNext.js can't recognize the exported `config` field in route. It needs to be a static object.\\n  \\u001b[90m6 |\\u001b[0m }\\n  \\u001b[90m7 |\\u001b[0m\\n\\u001b[31m\\u001b[1m\\u003e\\u001b[0m \\u001b[90m8 |\\u001b[0m \\u001b[36mexport\\u001b[0m \\u001b[36mconst\\u001b[0m config = proxyConfig\\n  \\u001b[90m  |\\u001b[0m              \\u001b[31m\\u001b[1m^^^^^^\\u001b[0m\\n  \\u001b[90m9 |\\u001b[0m\\n\\nThe exported configuration object in a source file needs to have a very specific format from which some properties can be statically parsed at compiled-time.\\n\\nhttps://nextjs.org/docs/app/api-reference/file-conventions/route-segment-config\\n\\n\\n    at Object.getCompilationErrors (/Users/oguz/Documents/AI/biprova/biprova/node_modules/next/dist/server/dev/hot-reloader-turbopack.js:1178:55)\\n    at DevBundlerService.getCompilationError (/Users/oguz/Documents/AI/biprova/biprova/node_modules/next/dist/server/lib/dev-bundler-service.js:44:55)\\n    at DevServer.getCompilationError (/Users/oguz/Documents/AI/biprova/biprova/node_modules/next/dist/server/dev/next-dev-server.js:719:42)\\n    at DevServer.findPageComponents (/Users/oguz/Documents/AI/biprova/biprova/node_modules/next/dist/server/dev/next-dev-server.js:689:43)\\n    at async DevServer.renderErrorToResponseImpl (/Users/oguz/Documents/AI/biprova/biprova/node_modules/next/dist/server/base-server.js:1686:30)\"},\"gip\":true,\"scriptLoader\":[]}</script></body></html>"
```

# Page snapshot

```yaml
- generic [active]:
  - generic [ref=e5] [cursor=pointer]:
    - button "Open Next.js Dev Tools" [ref=e6]:
      - img [ref=e7]
    - generic [ref=e10]:
      - button "Open issues overlay" [ref=e11]:
        - generic [ref=e12]:
          - generic [ref=e13]: "0"
          - generic [ref=e14]: "1"
        - generic [ref=e15]: Issue
      - button "Collapse issues badge" [ref=e16]:
        - img [ref=e17]
  - alert [ref=e19]
```

# Test source

```ts
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
> 132 |     expect(content).not.toMatch(/node_modules|at Object\.|at Module\.|\.ts:\d+/)
      |                         ^ Error: expect(received).not.toMatch(expected)
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