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
Received string:      "<!DOCTYPE html><html lang=\"tr\"><head><meta charset=\"utf-8\"><meta name=\"viewport\" content=\"width=device-width, initial-scale=1\"><link rel=\"stylesheet\" href=\"/_next/static/chunks/app_globals_0jn8.0u.css\" data-precedence=\"next_static/chunks/app_globals_0jn8.0u.css\"><link rel=\"preload\" as=\"script\" fetchpriority=\"low\" href=\"/_next/static/chunks/%5Bturbopack%5D_browser_dev_hmr-client_hmr-client_ts_10z625~._.js\"><script src=\"/_next/static/chunks/node_modules_next_dist_compiled_next-devtools_index_0553esy.js\" async=\"\"></script><script src=\"/_next/static/chunks/node_modules_next_dist_compiled_react-dom_058-ah~._.js\" async=\"\"></script><script src=\"/_next/static/chunks/node_modules_next_dist_compiled_react-server-dom-turbopack_0p3wegg._.js\" async=\"\"></script><script src=\"/_next/static/chunks/node_modules_next_dist_compiled_0rpq4pf._.js\" async=\"\"></script><script src=\"/_next/static/chunks/node_modules_next_dist_client_0fhqo1d._.js\" async=\"\"></script><script src=\"/_next/static/chunks/node_modules_next_dist_115brz8._.js\" async=\"\"></script><script src=\"/_next/static/chunks/node_modules_%40swc_helpers_cjs_0-4ujiy._.js\" async=\"\"></script><script src=\"/_next/static/chunks/_0rqeker._.js\" async=\"\"></script><script src=\"/_next/static/chunks/turbopack-_0p44nws._.js\" async=\"\"></script><script src=\"/_next/static/chunks/node_modules_next_dist_0tt2wve._.js\" async=\"\"></script><script src=\"/_next/static/chunks/app_layout_tsx_004glpo._.js\" async=\"\"></script><script src=\"/_next/static/chunks/node_modules_077dcku._.js\" async=\"\"></script><script src=\"/_next/static/chunks/_0_4mf.y._.js\" async=\"\"></script><script src=\"/_next/static/chunks/app_not-found_tsx_0kcl1js._.js\" async=\"\"></script><script src=\"/_next/static/chunks/node_modules_next_dist_client_components_builtin_global-error_0kcl1js.js\" async=\"\"></script><meta name=\"robots\" content=\"noindex\"><meta name=\"next-size-adjust\" content=\"\"><title>biprova</title><meta name=\"description\" content=\"Bir projem var.\"><link rel=\"icon\" href=\"/favicon.ico?favicon.0x3dzn~oxb6tn.ico\" sizes=\"256x256\" type=\"image/x-icon\"><script src=\"/_next/static/chunks/node_modules_next_dist_build_polyfills_polyfill-nomodule.js\" nomodule=\"\"></script><script src=\"/_next/static/chunks/%5Bturbopack%5D_browser_dev_hmr-client_hmr-client_ts_0yjw1oe._.js\"></script><script src=\"/_next/static/chunks/%5Bturbopack%5D_browser_dev_hmr-client_hmr-client_ts_10mygs7._.js\"></script><style>@font-face{font-family:'__nextjs-Geist';font-style:normal;font-weight:400 600;font-display:swap;src:url(/__nextjs_font/geist-latin-ext.woff2) format('woff2');unicode-range:U+0100-02BA,U+02BD-02C5,U+02C7-02CC,U+02CE-02D7,U+02DD-02FF,U+0304,U+0308,U+0329,U+1D00-1DBF,U+1E00-1E9F,U+1EF2-1EFF,U+2020,U+20A0-20AB,U+20AD-20C0,U+2113,U+2C60-2C7F,U+A720-A7FF}@font-face{font-family:'__nextjs-Geist Mono';font-style:normal;font-weight:400 600;font-display:swap;src:url(/__nextjs_font/geist-mono-latin-ext.woff2) format('woff2');unicode-range:U+0100-02BA,U+02BD-02C5,U+02C7-02CC,U+02CE-02D7,U+02DD-02FF,U+0304,U+0308,U+0329,U+1D00-1DBF,U+1E00-1E9F,U+1EF2-1EFF,U+2020,U+20A0-20AB,U+20AD-20C0,U+2113,U+2C60-2C7F,U+A720-A7FF}@font-face{font-family:'__nextjs-Geist';font-style:normal;font-weight:400 600;font-display:swap;src:url(/__nextjs_font/geist-latin.woff2) format('woff2');unicode-range:U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+0304,U+0308,U+0329,U+2000-206F,U+20AC,U+2122,U+2191,U+2193,U+2212,U+2215,U+FEFF,U+FFFD}@font-face{font-family:'__nextjs-Geist Mono';font-style:normal;font-weight:400 600;font-display:swap;src:url(/__nextjs_font/geist-mono-latin.woff2) format('woff2');unicode-range:U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+0304,U+0308,U+0329,U+2000-206F,U+20AC,U+2122,U+2191,U+2193,U+2212,U+2215,U+FEFF,U+FFFD}</style></head><body class=\"  antialiased\"><div hidden=\"\"><!--$--><!--/$--></div><div class=\"min-h-screen flex flex-col items-center justify-center px-4 text-center\"><div class=\"w-72 h-72\"><div></div></div><h1 class=\"font-display font-black text-h1 text-slate-900 mt-2\">Sayfa Bulunamadı</h1><p class=\"text-body text-slate-500 mt-2 max-w-sm\">Aradığın sayfa kaldırılmış ya da hiç var olmamış olabilir.</p><a href=\"/dashboard\" class=\"mt-6 inline-flex items-center gap-2 bg-blue-600 text-white font-nunito font-extrabold px-6 py-3 rounded-xl hover:bg-blue-700 transition-colors no-underline\">Ana Sayfaya Dön</a></div><!--$--><!--/$--><script id=\"_R_\">self.__next_r=\"c23BqHUKhCk0SJeabwkmW\"</script><script src=\"/_next/static/chunks/%5Bturbopack%5D_browser_dev_hmr-client_hmr-client_ts_10z625~._.js\" async=\"\"></script><script>(self.__next_f=self.__next_f||[]).push([0])</script><script>self.__next_f.push([1,\"7:I[\\\"[project]/node_modules/next/dist/next-devtools/userspace/app/segment-explorer-node.js [app-client] (ecmascript)\\\",[\\\"/_next/static/chunks/node_modules_next_dist_0tt2wve._.js\\\",\\\"/_next/static/chunks/app_layout_tsx_004glpo._.js\\\"],\\\"SegmentViewNode\\\"]\\n9:\\\"$Sreact.fragment\\\"\\n1c:I[\\\"[project]/node_modules/next/dist/client/components/layout-router.js [app-client] (ecmascript)\\\",[\\\"/_next/static/chunks/node_modules_next_dist_0tt2wve._.js\\\",\\\"/_next/static/chunks/app_layout_tsx_004glpo._.js\\\"],\\\"default\\\"]\\n1e:I[\\\"[project]/node_modules/next/dist/client/components/render-from-template-context.js [app-client] (ecmascript)\\\",[\\\"/_next/static/chunks/node_modules_next_dist_0tt2wve._.js\\\",\\\"/_next/static/chunks/app_layout_tsx_004glpo._.js\\\"],\\\"default\\\"]\\n21:I[\\\"[project]/app/not-found.tsx [app-client] (ecmascript)\\\",[\\\"/_next/static/chunks/node_modules_next_dist_0tt2wve._.js\\\",\\\"/_next/static/chunks/app_layout_tsx_004glpo._.js\\\",\\\"/_next/static/chunks/node_modules_077dcku._.js\\\",\\\"/_next/static/chunks/_0_4mf.y._.js\\\",\\\"/_next/static/chunks/app_not-found_tsx_0kcl1js._.js\\\"],\\\"default\\\"]\\n2a:I[\\\"[project]/node_modules/next/dist/client/components/client-page.js [app-client] (ecmascript)\\\",[\\\"/_next/static/chunks/node_modules_next_dist_0tt2wve._.js\\\",\\\"/_next/static/chunks/app_layout_tsx_004glpo._.js\\\"],\\\"ClientPageRoot\\\"]\\n33:I[\\\"[project]/node_modules/next/dist/lib/framework/boundary-components.js [app-client] (ecmascript)\\\",[\\\"/_next/static/chunks/node_modules_next_dist_0tt2wve._.js\\\",\\\"/_next/static/chunks/app_layout_tsx_004glpo._.js\\\"],\\\"OutletBoundary\\\"]\\n35:\\\"$Sreact.suspense\\\"\\n44:I[\\\"[project]/node_modules/next/dist/lib/framework/boundary-components.js [app-client] (ecmascript)\\\",[\\\"/_next/static/chunks/node_modules_next_dist_0tt2wve._.js\\\",\\\"/_next/static/chunks/app_layout_tsx_004glpo._.js\\\"],\\\"ViewportBoundary\\\"]\\n4e:I[\\\"[project]/node_modules/next/dist/lib/framework/boundary-components.js [app-client] (ecmascript)\\\",[\\\"/_next/static/chunks/node_modules_next_dist_0tt2wve._.js\\\",\\\"/_next/static/chunks/app_layout_tsx_004glpo._.js\\\"],\\\"MetadataBoundary\\\"]\\n55:I[\\\"[project]/node_modules/next/dist/client/components/builtin/global-error.js [app-client] (ecmascript)\\\",[\\\"/_next/static/chunks/node_modules_next_dist_0tt2wve._.js\\\",\\\"/_next/static/chunks/app_layout_tsx_004glpo._.js\\\",\\\"/_next/static/chunks/node_modules_next_dist_client_components_builtin_global-error_0kcl1js.js\\\"],\\\"default\\\",1]\\n63:I[\\\"[project]/node_modules/next/dist/lib/metadata/generate/icon-mark.js [app-client] (ecmascript)\\\",[\\\"/_next/static/chunks/node_modules_next_dist_0tt2wve._.js\\\",\\\"/_next/static/chunks/app_layout_tsx_004glpo._.js\\\"],\\\"IconMark\\\"]\\n:HL[\\\"/_next/static/chunks/app_globals_0jn8.0u.css\\\",\\\"style\\\"]\\n1:D\\\"$4\\\"\\n1:D\\\"$2\\\"\\n1:D\\\"$5\\\"\\n1:null\\nd:D\\\"$17\\\"\\nd:D\\\"$e\\\"\\nd:D\\\"$19\\\"\\nd:[\\\"$\\\",\\\"html\\\",null,{\\\"lang\\\":\\\"tr\\\",\\\"children\\\":[\\\"$\\\",\\\"body\\\",null,{\\\"className\\\":\\\"  antialiased\\\",\\\"children\\\":[\\\"$\\\",\\\"$L1c\\\",null,{\\\"parallelRouterKey\\\":\\\"children\\\",\\\"error\\\":\\\"$undefined\\\",\\\"errorStyles\\\":\\\"$undefined\\\",\\\"errorScripts\\\":\\\"$undefined\\\",\\\"template\\\":[\\\"$\\\",\\\"$L1e\\\",null,{},null,\\\"$1d\\\",1],\\\"templateStyles\\\":\\\"$undefined\\\",\\\"templateScripts\\\":\\\"$undefined\\\",\\\"notFound\\\":[\\\"$\\\",\\\"$L7\\\",\\\"c-not-found\\\",{\\\"type\\\":\\\"not-found\\\",\\\"pagePath\\\":\\\"not-found.tsx\\\",\\\"children\\\":[[\\\"$\\\",\\\"$L21\\\",null,{},null,\\\"$20\\\",1],[]]},null,\\\"$1f\\\",0],\\\"forbidden\\\":\\\"$undefined\\\",\\\"unauthorized\\\":\\\"$undefined\\\",\\\"segmentViewBoundaries\\\":[[\\\"$\\\",\\\"$L7\\\",null,{\\\"type\\\":\\\"boundary:not-found\\\",\\\"pagePath\\\":\\\"not-found.tsx@boundary\\\"},null,\\\"$22\\\",1],\\\"$undefined\\\",\\\"$undefined\\\",[\\\"$\\\",\\\"$L7\\\",null,{\\\"type\\\":\\\"boundary:global-error\\\",\\\"pagePath\\\":\\\"__next_builtin__global-error.js\\\"},null,\\\"$23\\\",1]]},null,\\\"$1b\\\",1]},\\\"$e\\\",\\\"$1a\\\",1]},\\\"$e\\\",\\\"$18\\\",1]\\n2e:D\\\"$30\\\"\\n2e:D\\\"$2f\\\"\\n2e:D\\\"$32\\\"\\n2e:[\\\"$\\\",\\\"$L33\\\",null,{\\\"children\\\":[\\\"$\\\",\\\"$35\\\",null,{\\\"name\\\":\\\"Next.MetadataOutlet\\\",\\\"children\\\":\\\"$@36\\\"},\\\"$2f\\\",\\\"$34\\\",1]},\\\"$2f\\\",\\\"$31\\\",1]\\n39:D\\\"$3c\\\"\\n39:D\\\"$3a\\\"\\n39:D\\\"$3e\\\"\\n39:[\\\"$\\\",\\\"meta\\\",null,{\\\"name\\\":\\\"robots\\\",\\\"content\\\":\\\"noindex\\\"},\\\"$3a\\\",\\\"$3d\\\",1]\\n3f:D\\\"$41\\\"\\n3f:D\\\"$40\\\"\\n3f:D\\\"$43\\\"\\n45:D\\\"$47\\\"\\n45:D\\\"$46\\\"\\n3f:[\\\"$\\\",\\\"$L44\\\",null,{\\\"children\\\":\\\"$L45\\\"},\\\"$40\\\",\\\"$42\\\",1]\\n48:D\\\"$4a\\\"\\n48:D\\\"$49\\\"\\n48:D\\\"$4c\\\"\\n50:D\\\"$52\\\"\\n50:D\\\"$51\\\"\\n48:[\\\"$\\\",\\\"div\\\",null,{\\\"hidden\\\":true,\\\"children\\\":[\\\"$\\\",\\\"$L4e\\\",null,{\\\"children\\\":[\\\"$\\\",\\\"$35\\\",null,{\\\"name\\\":\\\"Next.Metadata\\\",\\\"children\\\":\\\"$L50\\\"},\\\"$49\\\",\\\"$4f\\\",1]},\\\"$49\\\",\\\"$4d\\\",1]},\"])</script><script>self.__next_f.push([1,\"\\\"$49\\\",\\\"$4b\\\",1]\\n54:[]\\n\"])</script><script>self.__next_f.push([1,\"0:{\\\"P\\\":\\\"$1\\\",\\\"c\\\":[\\\"\\\",\\\"bu-sayfa-yok-1776720045451\\\"],\\\"q\\\":\\\"\\\",\\\"i\\\":true,\\\"f\\\":[[[\\\"\\\",{\\\"children\\\":[\\\"/_not-found\\\",{\\\"children\\\":[\\\"__PAGE__\\\",{}]}]},\\\"$undefined\\\",\\\"$undefined\\\",16],[[\\\"$\\\",\\\"$L7\\\",\\\"layout\\\",{\\\"type\\\":\\\"layout\\\",\\\"pagePath\\\":\\\"layout.tsx\\\",\\\"children\\\":[\\\"$\\\",\\\"$9\\\",\\\"c\\\",{\\\"children\\\":[[[\\\"$\\\",\\\"link\\\",\\\"0\\\",{\\\"rel\\\":\\\"stylesheet\\\",\\\"href\\\":\\\"/_next/static/chunks/app_globals_0jn8.0u.css\\\",\\\"precedence\\\":\\\"next_static/chunks/app_globals_0jn8.0u.css\\\",\\\"crossOrigin\\\":\\\"$undefined\\\",\\\"nonce\\\":\\\"$undefined\\\"},null,\\\"$a\\\",0],[\\\"$\\\",\\\"script\\\",\\\"script-0\\\",{\\\"src\\\":\\\"/_next/static/chunks/node_modules_next_dist_0tt2wve._.js\\\",\\\"async\\\":true,\\\"nonce\\\":\\\"$undefined\\\"},null,\\\"$b\\\",0],[\\\"$\\\",\\\"script\\\",\\\"script-1\\\",{\\\"src\\\":\\\"/_next/static/chunks/app_layout_tsx_004glpo._.js\\\",\\\"async\\\":true,\\\"nonce\\\":\\\"$undefined\\\"},null,\\\"$c\\\",0]],\\\"$d\\\"]},null,\\\"$8\\\",1]},null,\\\"$6\\\",0],{\\\"children\\\":[[\\\"$\\\",\\\"$9\\\",\\\"c\\\",{\\\"children\\\":[null,[\\\"$\\\",\\\"$L1c\\\",null,{\\\"parallelRouterKey\\\":\\\"children\\\",\\\"error\\\":\\\"$undefined\\\",\\\"errorStyles\\\":\\\"$undefined\\\",\\\"errorScripts\\\":\\\"$undefined\\\",\\\"template\\\":[\\\"$\\\",\\\"$L1e\\\",null,{},null,\\\"$26\\\",1],\\\"templateStyles\\\":\\\"$undefined\\\",\\\"templateScripts\\\":\\\"$undefined\\\",\\\"notFound\\\":\\\"$undefined\\\",\\\"forbidden\\\":\\\"$undefined\\\",\\\"unauthorized\\\":\\\"$undefined\\\",\\\"segmentViewBoundaries\\\":[\\\"$undefined\\\",\\\"$undefined\\\",\\\"$undefined\\\",\\\"$undefined\\\"]},null,\\\"$25\\\",1]]},null,\\\"$24\\\",0],{\\\"children\\\":[[\\\"$\\\",\\\"$9\\\",\\\"c\\\",{\\\"children\\\":[[\\\"$\\\",\\\"$L7\\\",\\\"c-page\\\",{\\\"type\\\":\\\"page\\\",\\\"pagePath\\\":\\\"not-found.tsx\\\",\\\"children\\\":[\\\"$\\\",\\\"$L2a\\\",null,{\\\"Component\\\":\\\"$21\\\",\\\"serverProvidedParams\\\":{\\\"searchParams\\\":{},\\\"params\\\":{},\\\"promises\\\":null}},null,\\\"$29\\\",1]},null,\\\"$28\\\",1],[[\\\"$\\\",\\\"script\\\",\\\"script-0\\\",{\\\"src\\\":\\\"/_next/static/chunks/node_modules_077dcku._.js\\\",\\\"async\\\":true,\\\"nonce\\\":\\\"$undefined\\\"},null,\\\"$2b\\\",0],[\\\"$\\\",\\\"script\\\",\\\"script-1\\\",{\\\"src\\\":\\\"/_next/static/chunks/_0_4mf.y._.js\\\",\\\"async\\\":true,\\\"nonce\\\":\\\"$undefined\\\"},null,\\\"$2c\\\",0],[\\\"$\\\",\\\"script\\\",\\\"script-2\\\",{\\\"src\\\":\\\"/_next/static/chunks/app_not-found_tsx_0kcl1js._.js\\\",\\\"async\\\":true,\\\"nonce\\\":\\\"$undefined\\\"},null,\\\"$2d\\\",0]],\\\"$2e\\\"]},null,\\\"$27\\\",0],{},null,false,null]},null,false,\\\"$@37\\\"]},null,false,null],[\\\"$\\\",\\\"$9\\\",\\\"h\\\",{\\\"children\\\":[\\\"$39\\\",\\\"$3f\\\",\\\"$48\\\",[\\\"$\\\",\\\"meta\\\",null,{\\\"name\\\":\\\"next-size-adjust\\\",\\\"content\\\":\\\"\\\"},null,\\\"$53\\\",1]]},null,\\\"$38\\\",0],false]],\\\"m\\\":\\\"$W54\\\",\\\"G\\\":[\\\"$55\\\",[\\\"$\\\",\\\"$L7\\\",\\\"ge-svn\\\",{\\\"type\\\":\\\"global-error\\\",\\\"pagePath\\\":\\\"__next_builtin__global-error.js\\\",\\\"children\\\":[[\\\"$\\\",\\\"link\\\",\\\"0\\\",{\\\"rel\\\":\\\"stylesheet\\\",\\\"href\\\":\\\"/_next/static/chunks/app_globals_0jn8.0u.css\\\",\\\"precedence\\\":\\\"next_static/chunks/app_globals_0jn8.0u.css\\\",\\\"crossOrigin\\\":\\\"$undefined\\\",\\\"nonce\\\":\\\"$undefined\\\"},null,\\\"$57\\\",0]]},null,\\\"$56\\\",0]],\\\"S\\\":false,\\\"h\\\":null,\\\"s\\\":\\\"$undefined\\\",\\\"l\\\":\\\"$undefined\\\",\\\"p\\\":\\\"$undefined\\\",\\\"d\\\":\\\"$undefined\\\",\\\"b\\\":\\\"development\\\"}\\n\"])</script><script>self.__next_f.push([1,\"58:[]\\n37:D\\\"$59\\\"\\n37:\\\"$W58\\\"\\n45:D\\\"$5a\\\"\\n45:[[\\\"$\\\",\\\"meta\\\",\\\"0\\\",{\\\"charSet\\\":\\\"utf-8\\\"},\\\"$2f\\\",\\\"$5b\\\",0],[\\\"$\\\",\\\"meta\\\",\\\"1\\\",{\\\"name\\\":\\\"viewport\\\",\\\"content\\\":\\\"width=device-width, initial-scale=1\\\"},\\\"$2f\\\",\\\"$5c\\\",0]]\\n36:D\\\"$5d\\\"\\n36:null\\n50:D\\\"$5e\\\"\\n50:[[\\\"$\\\",\\\"title\\\",\\\"0\\\",{\\\"children\\\":\\\"biprova\\\"},\\\"$2f\\\",\\\"$5f\\\",0],[\\\"$\\\",\\\"meta\\\",\\\"1\\\",{\\\"name\\\":\\\"description\\\",\\\"content\\\":\\\"Bir projem var.\\\"},\\\"$2f\\\",\\\"$60\\\",0],[\\\"$\\\",\\\"link\\\",\\\"2\\\",{\\\"rel\\\":\\\"icon\\\",\\\"href\\\":\\\"/favicon.ico?favicon.0x3dzn~oxb6tn.ico\\\",\\\"sizes\\\":\\\"256x256\\\",\\\"type\\\":\\\"image/x-icon\\\"},\\\"$2f\\\",\\\"$61\\\",0],[\\\"$\\\",\\\"$L63\\\",\\\"3\\\",{},\\\"$2f\\\",\\\"$62\\\",0]]\\n\"])</script><script data-nextjs-dev-overlay=\"true\" style=\"display: block; position: absolute;\"><nextjs-portal style=\"--nextjs-dev-tools-scale: 1;\"></nextjs-portal></script></body></html>"
```

# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - generic [ref=e2]:
    - img [ref=e5]
    - heading "Sayfa Bulunamadı" [level=1] [ref=e58]
    - paragraph [ref=e59]: Aradığın sayfa kaldırılmış ya da hiç var olmamış olabilir.
    - link "Ana Sayfaya Dön" [ref=e60] [cursor=pointer]:
      - /url: /dashboard
  - button "Open Next.js Dev Tools" [ref=e66] [cursor=pointer]:
    - img [ref=e67]
  - alert [ref=e70]
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