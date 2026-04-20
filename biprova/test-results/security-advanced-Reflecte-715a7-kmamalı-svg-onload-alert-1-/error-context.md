# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: security-advanced.spec.ts >> Reflected XSS >> login?next= XSS payload HTML'de ham çıkmamalı: <svg onload=alert(1)>
- Location: tests/security-advanced.spec.ts:47:9

# Error details

```
Error: expect(received).not.toContain(expected) // indexOf

Expected substring: not "onload=alert(1)"
Received string:        "<!DOCTYPE html><html lang=\"tr\"><head><meta charset=\"utf-8\"><meta name=\"viewport\" content=\"width=device-width, initial-scale=1, maximum-scale=1\"><link rel=\"stylesheet\" href=\"/_next/static/chunks/app_globals_0jn8.0u.css\" data-precedence=\"next_static/chunks/app_globals_0jn8.0u.css\"><link rel=\"stylesheet\" href=\"/_next/static/chunks/%5Bnext%5D_internal_font_google_0h9rp2h._.css\" data-precedence=\"next_static/chunks/[next]_internal_font_google_0h9rp2h._.css\"><link rel=\"preload\" as=\"script\" fetchpriority=\"low\" href=\"/_next/static/chunks/%5Bturbopack%5D_browser_dev_hmr-client_hmr-client_ts_10z625~._.js\"><script src=\"/_next/static/chunks/node_modules_next_dist_compiled_next-devtools_index_0553esy.js\" async=\"\"></script><script src=\"/_next/static/chunks/node_modules_next_dist_compiled_react-dom_058-ah~._.js\" async=\"\"></script><script src=\"/_next/static/chunks/node_modules_next_dist_compiled_react-server-dom-turbopack_0p3wegg._.js\" async=\"\"></script><script src=\"/_next/static/chunks/node_modules_next_dist_compiled_0rpq4pf._.js\" async=\"\"></script><script src=\"/_next/static/chunks/node_modules_next_dist_client_0fhqo1d._.js\" async=\"\"></script><script src=\"/_next/static/chunks/node_modules_next_dist_115brz8._.js\" async=\"\"></script><script src=\"/_next/static/chunks/node_modules_%40swc_helpers_cjs_0-4ujiy._.js\" async=\"\"></script><script src=\"/_next/static/chunks/_0rqeker._.js\" async=\"\"></script><script src=\"/_next/static/chunks/turbopack-_0p44nws._.js\" async=\"\"></script><script src=\"/_next/static/chunks/node_modules_next_dist_0tt2wve._.js\" async=\"\"></script><script src=\"/_next/static/chunks/app_layout_tsx_004glpo._.js\" async=\"\"></script><script src=\"/_next/static/chunks/node_modules_077dcku._.js\" async=\"\"></script><script src=\"/_next/static/chunks/_0_4mf.y._.js\" async=\"\"></script><script src=\"/_next/static/chunks/app_not-found_tsx_0kcl1js._.js\" async=\"\"></script><script src=\"/_next/static/chunks/app_(auth)_layout_tsx_0kcl1js._.js\" async=\"\"></script><script src=\"/_next/static/chunks/node_modules_0a5sha1._.js\" async=\"\"></script><script src=\"/_next/static/chunks/_0618icz._.js\" async=\"\"></script><script src=\"/_next/static/chunks/app_(auth)_login_page_tsx_0ziky50._.js\" async=\"\"></script><script src=\"/_next/static/chunks/node_modules_next_dist_client_components_builtin_global-error_0kcl1js.js\" async=\"\"></script><meta name=\"next-size-adjust\" content=\"\"><title>biprova — Giriş Yap</title><meta name=\"description\" content=\"Bir projem var.\"><link rel=\"icon\" href=\"/favicon.ico?favicon.0x3dzn~oxb6tn.ico\" sizes=\"256x256\" type=\"image/x-icon\"><script src=\"/_next/static/chunks/node_modules_next_dist_build_polyfills_polyfill-nomodule.js\" nomodule=\"\"></script><script src=\"/_next/static/chunks/%5Bturbopack%5D_browser_dev_hmr-client_hmr-client_ts_0yjw1oe._.js\"></script><script src=\"/_next/static/chunks/%5Bturbopack%5D_browser_dev_hmr-client_hmr-client_ts_10mygs7._.js\"></script><link rel=\"preload\" href=\"/_next/static/media/07454f8ad8aaac57-s.p.0tqkxa-w3pk~c.woff2\" as=\"font\" crossorigin=\"\" type=\"font/woff2\"><link rel=\"preload\" href=\"/_next/static/media/fba5a26ea33df6a3-s.p.0eehd8tgys7nv.woff2\" as=\"font\" crossorigin=\"\" type=\"font/woff2\"><style>@font-face{font-family:'__nextjs-Geist';font-style:normal;font-weight:400 600;font-display:swap;src:url(/__nextjs_font/geist-latin-ext.woff2) format('woff2');unicode-range:U+0100-02BA,U+02BD-02C5,U+02C7-02CC,U+02CE-02D7,U+02DD-02FF,U+0304,U+0308,U+0329,U+1D00-1DBF,U+1E00-1E9F,U+1EF2-1EFF,U+2020,U+20A0-20AB,U+20AD-20C0,U+2113,U+2C60-2C7F,U+A720-A7FF}@font-face{font-family:'__nextjs-Geist Mono';font-style:normal;font-weight:400 600;font-display:swap;src:url(/__nextjs_font/geist-mono-latin-ext.woff2) format('woff2');unicode-range:U+0100-02BA,U+02BD-02C5,U+02C7-02CC,U+02CE-02D7,U+02DD-02FF,U+0304,U+0308,U+0329,U+1D00-1DBF,U+1E00-1E9F,U+1EF2-1EFF,U+2020,U+20A0-20AB,U+20AD-20C0,U+2113,U+2C60-2C7F,U+A720-A7FF}@font-face{font-family:'__nextjs-Geist';font-style:normal;font-weight:400 600;font-display:swap;src:url(/__nextjs_font/geist-latin.woff2) format('woff2');unicode-range:U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+0304,U+0308,U+0329,U+2000-206F,U+20AC,U+2122,U+2191,U+2193,U+2212,U+2215,U+FEFF,U+FFFD}@font-face{font-family:'__nextjs-Geist Mono';font-style:normal;font-weight:400 600;font-display:swap;src:url(/__nextjs_font/geist-mono-latin.woff2) format('woff2');unicode-range:U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+0304,U+0308,U+0329,U+2000-206F,U+20AC,U+2122,U+2191,U+2193,U+2212,U+2215,U+FEFF,U+FFFD}</style></head><body class=\"  antialiased\"><div hidden=\"\"><!--$--><!--/$--></div><div class=\"nunito_7817346f-module__De4qLq__variable plus_jakarta_sans_ccaae5c5-module__EPdDJa__variable font-jakarta\"><main class=\"relative min-h-dvh overflow-x-hidden flex items-center justify-center px-3 sm:px-6 py-8 bg-[#f8faff]\"><div class=\"absolute w-[500px] h-[500px] rounded-full bg-blue-300 blur-[80px] opacity-[0.18] pointer-events-none -top-[150px] -right-[150px]\"></div><div class=\"absolute w-[400px] h-[400px] rounded-full bg-violet-300 blur-[80px] opacity-[0.18] pointer-events-none -bottom-[120px] -left-[120px]\"></div><div class=\" bg-white border-[1.5px] border-slate-200 rounded-[20px] sm:rounded-[28px] px-5 py-8 sm:px-10 sm:py-12 w-full max-w-[420px] shadow-[0_8px_40px_rgba(0,0,0,0.08)] relative z-10 animate-[fadeUp_0.4s_ease_both] \"><a class=\"block font-nunito font-black text-[1.8rem] text-blue-600 text-center mb-1 tracking-tight no-underline\" href=\"/\">bir<span class=\"text-slate-900\">prova</span></a><p class=\"text-center text-[0.85rem] text-slate-500 mb-8 leading-relaxed\">Tekrar hoş geldin.<br>Hesabına giriş yap.</p><div class=\"flex flex-col gap-4\"><div class=\"flex flex-col gap-1.5\"><label for=\"email\" class=\"text-[0.82rem] font-bold text-slate-900\">E-posta</label><input id=\"email\" type=\"email\" placeholder=\"ornek@mail.com\" class=\"
          w-full bg-[#f8faff] border-[1.5px] rounded-[12px]
          px-4 py-3 text-[0.95rem] font-jakarta text-slate-900
          placeholder:text-slate-400 outline-none
          focus:bg-white transition-colors
          border-slate-200 focus:border-blue-600
        \" value=\"\"></div><div class=\"flex flex-col gap-1.5\"><label for=\"password\" class=\"text-[0.82rem] font-bold text-slate-900\">Şifre</label><input id=\"password\" type=\"password\" placeholder=\"••••••••\" class=\"
          w-full bg-[#f8faff] border-[1.5px] rounded-[12px]
          px-4 py-3 text-[0.95rem] font-jakarta text-slate-900
          placeholder:text-slate-400 outline-none
          focus:bg-white transition-colors
          border-slate-200 focus:border-blue-600
        \" value=\"\"></div><button type=\"button\" class=\" w-full mt-1 py-4 rounded-[14px] bg-blue-600 hover:bg-blue-700 active:bg-blue-800 disabled:opacity-60 text-white font-nunito font-extrabold text-base transition-colors cursor-pointer border-none touch-manipulation \">Giriş Yap →</button></div><p class=\"text-center text-[0.82rem] text-slate-500 mt-4\"><a class=\"text-slate-400 hover:text-blue-600 transition-colors\" href=\"/forgot-password\">Şifremi unuttum</a></p><p class=\"text-center text-[0.82rem] text-slate-500 mt-3\">Hesabın yok mu?<!-- --> <a class=\"text-blue-600 font-semibold hover:underline\" href=\"/signup\">Kayıt ol</a></p><a class=\"flex items-center justify-center gap-1.5 mt-4 text-[0.82rem] text-slate-500 hover:text-blue-600 transition-colors no-underline\" href=\"/\">← Ana sayfaya dön</a></div></main><!--$--><!--/$--></div><script id=\"_R_\">self.__next_r=\"c87AmeV464pSyjzcYRfMY\"</script><script src=\"/_next/static/chunks/%5Bturbopack%5D_browser_dev_hmr-client_hmr-client_ts_10z625~._.js\" async=\"\"></script><script>(self.__next_f=self.__next_f||[]).push([0])</script><script>self.__next_f.push([1,\"a:I[\\\"[project]/node_modules/next/dist/next-devtools/userspace/app/segment-explorer-node.js [app-client] (ecmascript)\\\",[\\\"/_next/static/chunks/node_modules_next_dist_0tt2wve._.js\\\",\\\"/_next/static/chunks/app_layout_tsx_004glpo._.js\\\"],\\\"SegmentViewNode\\\"]\\nc:\\\"$Sreact.fragment\\\"\\n1f:I[\\\"[project]/node_modules/next/dist/client/components/layout-router.js [app-client] (ecmascript)\\\",[\\\"/_next/static/chunks/node_modules_next_dist_0tt2wve._.js\\\",\\\"/_next/static/chunks/app_layout_tsx_004glpo._.js\\\"],\\\"default\\\"]\\n21:I[\\\"[project]/node_modules/next/dist/client/components/render-from-template-context.js [app-client] (ecmascript)\\\",[\\\"/_next/static/chunks/node_modules_next_dist_0tt2wve._.js\\\",\\\"/_next/static/chunks/app_layout_tsx_004glpo._.js\\\"],\\\"default\\\"]\\n24:I[\\\"[project]/app/not-found.tsx [app-client] (ecmascript)\\\",[\\\"/_next/static/chunks/node_modules_next_dist_0tt2wve._.js\\\",\\\"/_next/static/chunks/app_layout_tsx_004glpo._.js\\\",\\\"/_next/static/chunks/node_modules_077dcku._.js\\\",\\\"/_next/static/chunks/_0_4mf.y._.js\\\",\\\"/_next/static/chunks/app_not-found_tsx_0kcl1js._.js\\\"],\\\"default\\\"]\\n55:I[\\\"[project]/node_modules/next/dist/client/app-dir/link.js [app-client] (ecmascript)\\\",[\\\"/_next/static/chunks/node_modules_next_dist_0tt2wve._.js\\\",\\\"/_next/static/chunks/app_layout_tsx_004glpo._.js\\\",\\\"/_next/static/chunks/app_(auth)_layout_tsx_0kcl1js._.js\\\",\\\"/_next/static/chunks/node_modules_0a5sha1._.js\\\",\\\"/_next/static/chunks/_0618icz._.js\\\",\\\"/_next/static/chunks/app_(auth)_login_page_tsx_0ziky50._.js\\\"],\\\"\\\"]\\n5a:I[\\\"[project]/app/(auth)/login/_components/login-form.tsx [app-client] (ecmascript)\\\",[\\\"/_next/static/chunks/node_modules_next_dist_0tt2wve._.js\\\",\\\"/_next/static/chunks/app_layout_tsx_004glpo._.js\\\",\\\"/_next/static/chunks/app_(auth)_layout_tsx_0kcl1js._.js\\\",\\\"/_next/static/chunks/node_modules_0a5sha1._.js\\\",\\\"/_next/static/chunks/_0618icz._.js\\\",\\\"/_next/static/chunks/app_(auth)_login_page_tsx_0ziky50._.js\\\"],\\\"LoginForm\\\"]\\n74:I[\\\"[project]/node_modules/next/dist/lib/framework/boundary-components.js [app-client] (ecmascript)\\\",[\\\"/_next/static/chunks/node_modules_next_dist_0tt2wve._.js\\\",\\\"/_next/static/chunks/app_layout_tsx_004glpo._.js\\\"],\\\"OutletBoundary\\\"]\\n76:\\\"$Sreact.suspense\\\"\\n84:I[\\\"[project]/node_modules/next/dist/lib/framework/boundary-components.js [app-client] (ecmascript)\\\",[\\\"/_next/static/chunks/node_modules_next_dist_0tt2wve._.js\\\",\\\"/_next/static/chunks/app_layout_tsx_004glpo._.js\\\"],\\\"ViewportBoundary\\\"]\\n8e:I[\\\"[project]/node_modules/next/dist/lib/framework/boundary-components.js [app-client] (ecmascript)\\\",[\\\"/_next/static/chunks/node_modules_next_dist_0tt2wve._.js\\\",\\\"/_next/static/chunks/app_layout_tsx_004glpo._.js\\\"],\\\"MetadataBoundary\\\"]\\n95:I[\\\"[project]/node_modules/next/dist/client/components/builtin/global-error.js [app-client] (ecmascript)\\\",[\\\"/_next/static/chunks/node_modules_next_dist_0tt2wve._.js\\\",\\\"/_next/static/chunks/app_layout_tsx_004glpo._.js\\\",\\\"/_next/static/chunks/node_modules_next_dist_client_components_builtin_global-error_0kcl1js.js\\\"],\\\"default\\\",1]\\na3:I[\\\"[project]/node_modules/next/dist/lib/metadata/generate/icon-mark.js [app-client] (ecmascript)\\\",[\\\"/_next/static/chunks/node_modules_next_dist_0tt2wve._.js\\\",\\\"/_next/static/chunks/app_layout_tsx_004glpo._.js\\\"],\\\"IconMark\\\"]\\n:HL[\\\"/_next/static/chunks/app_globals_0jn8.0u.css\\\",\\\"style\\\"]\\n:HL[\\\"/_next/static/chunks/%5Bnext%5D_internal_font_google_0h9rp2h._.css\\\",\\\"style\\\"]\\n:HL[\\\"/_next/static/media/07454f8ad8aaac57-s.p.0tqkxa-w3pk~c.woff2\\\",\\\"font\\\",{\\\"crossOrigin\\\":\\\"\\\",\\\"type\\\":\\\"font/woff2\\\"}]\\n:HL[\\\"/_next/static/media/fba5a26ea33df6a3-s.p.0eehd8tgys7nv.woff2\\\",\\\"font\\\",{\\\"crossOrigin\\\":\\\"\\\",\\\"type\\\":\\\"font/woff2\\\"}]\\n1:D\\\"$7\\\"\\n1:D\\\"$2\\\"\\n1:D\\\"$8\\\"\\n1:null\\n10:D\\\"$1a\\\"\\n10:D\\\"$11\\\"\\n10:D\\\"$1c\\\"\\n10:[\\\"$\\\",\\\"html\\\",null,{\\\"lang\\\":\\\"tr\\\",\\\"children\\\":[\\\"$\\\",\\\"body\\\",null,{\\\"className\\\":\\\"  antialiased\\\",\\\"children\\\":[\\\"$\\\",\\\"$L1f\\\",null,{\\\"parallelRouterKey\\\":\\\"children\\\",\\\"error\\\":\\\"$undefined\\\",\\\"errorStyles\\\":\\\"$undefined\\\",\\\"errorScripts\\\":\\\"$undefined\\\",\\\"template\\\":[\\\"$\\\",\\\"$L21\\\",null,{},null,\\\"$20\\\",1],\\\"templateStyles\\\":\\\"$undefined\\\",\\\"templateScripts\\\":\\\"$undefined\\\",\\\"notFound\\\":[\\\"$\\\",\\\"$La\\\",\\\"c-not-found\\\",{\\\"type\\\":\\\"not-found\\\",\\\"pagePath\\\":\\\"not-found.tsx\\\",\\\"children\\\":[[\\\"$\\\",\\\"$L24\\\",null,{},null,\\\"$23\\\",1],[]]},null,\\\"$22\\\",0],\\\"forbidden\\\":\\\"$undefi\"])</script><script>self.__next_f.push([1,\"ned\\\",\\\"unauthorized\\\":\\\"$undefined\\\",\\\"segmentViewBoundaries\\\":[[\\\"$\\\",\\\"$La\\\",null,{\\\"type\\\":\\\"boundary:not-found\\\",\\\"pagePath\\\":\\\"not-found.tsx@boundary\\\"},null,\\\"$25\\\",1],\\\"$undefined\\\",\\\"$undefined\\\",[\\\"$\\\",\\\"$La\\\",null,{\\\"type\\\":\\\"boundary:global-error\\\",\\\"pagePath\\\":\\\"__next_builtin__global-error.js\\\"},null,\\\"$26\\\",1]]},null,\\\"$1e\\\",1]},\\\"$11\\\",\\\"$1d\\\",1]},\\\"$11\\\",\\\"$1b\\\",1]\\n2b:D\\\"$33\\\"\\n2b:D\\\"$2c\\\"\\n2b:D\\\"$35\\\"\\n2b:[\\\"$\\\",\\\"div\\\",null,{\\\"className\\\":\\\"nunito_7817346f-module__De4qLq__variable plus_jakarta_sans_ccaae5c5-module__EPdDJa__variable font-jakarta\\\",\\\"children\\\":[\\\"$\\\",\\\"$L1f\\\",null,{\\\"parallelRouterKey\\\":\\\"children\\\",\\\"error\\\":\\\"$undefined\\\",\\\"errorStyles\\\":\\\"$undefined\\\",\\\"errorScripts\\\":\\\"$undefined\\\",\\\"template\\\":[\\\"$\\\",\\\"$L21\\\",null,{},null,\\\"$37\\\",1],\\\"templateStyles\\\":\\\"$undefined\\\",\\\"templateScripts\\\":\\\"$undefined\\\",\\\"notFound\\\":[\\\"$\\\",\\\"$La\\\",\\\"c-not-found\\\",{\\\"type\\\":\\\"not-found\\\",\\\"pagePath\\\":\\\"not-found.tsx\\\",\\\"children\\\":[[\\\"$\\\",\\\"$L24\\\",null,{},null,\\\"$39\\\",1],[]]},null,\\\"$38\\\",0],\\\"forbidden\\\":\\\"$undefined\\\",\\\"unauthorized\\\":\\\"$undefined\\\",\\\"segmentViewBoundaries\\\":[[\\\"$\\\",\\\"$La\\\",null,{\\\"type\\\":\\\"boundary:not-found\\\",\\\"pagePath\\\":\\\"not-found.tsx@boundary\\\"},null,\\\"$3a\\\",1],\\\"$undefined\\\",\\\"$undefined\\\",\\\"$undefined\\\"]},null,\\\"$36\\\",1]},\\\"$2c\\\",\\\"$34\\\",1]\\n40:D\\\"$44\\\"\\n40:D\\\"$41\\\"\\n40:D\\\"$46\\\"\\n49:D\\\"$4b\\\"\\n49:D\\\"$4a\\\"\\n49:D\\\"$4d\\\"\\n4e:D\\\"$52\\\"\\n4e:D\\\"$4f\\\"\\n4e:D\\\"$54\\\"\\n4e:[\\\"$\\\",\\\"$L55\\\",null,{\\\"href\\\":\\\"/\\\",\\\"className\\\":\\\"block font-nunito font-black text-[1.8rem] text-blue-600 text-center mb-1 tracking-tight no-underline\\\",\\\"children\\\":[\\\"bir\\\",[\\\"$\\\",\\\"span\\\",null,{\\\"className\\\":\\\"text-slate-900\\\",\\\"children\\\":\\\"prova\\\"},\\\"$4a\\\",\\\"$56\\\",1]]},\\\"$4f\\\",\\\"$53\\\",1]\\n5c:D\\\"$5e\\\"\\n5c:D\\\"$5d\\\"\\n5c:D\\\"$60\\\"\\n5c:[\\\"$\\\",\\\"$L55\\\",null,{\\\"href\\\":\\\"/forgot-password\\\",\\\"className\\\":\\\"text-slate-400 hover:text-blue-600 transition-colors\\\",\\\"children\\\":\\\"Şifremi unuttum\\\"},\\\"$5d\\\",\\\"$5f\\\",1]\\n62:D\\\"$64\\\"\\n62:D\\\"$63\\\"\\n62:D\\\"$66\\\"\\n62:[\\\"$\\\",\\\"$L55\\\",null,{\\\"href\\\":\\\"/signup\\\",\\\"className\\\":\\\"text-blue-600 font-semibold hover:underline\\\",\\\"children\\\":\\\"Kayıt ol\\\"},\\\"$63\\\",\\\"$65\\\",1]\\n67:D\\\"$69\\\"\\n67:D\\\"$68\\\"\\n67:D\\\"$6b\\\"\\n67:[\\\"$\\\",\\\"$L55\\\",null,{\\\"href\\\":\\\"/\\\",\\\"className\\\":\\\"flex items-center justify-center gap-1.5 mt-4 text-[0.82rem] text-slate-500 hover:text-blue-600 transition-colors no-underline\\\",\\\"children\\\":\\\"← Ana sayfaya dön\\\"},\\\"$68\\\",\\\"$6a\\\",1]\\n49:[\\\"$\\\",\\\"div\\\",null,{\\\"className\\\":\\\" bg-white border-[1.5px] border-slate-200 rounded-[20px] sm:rounded-[28px] px-5 py-8 sm:px-10 sm:py-12 w-full max-w-[420px] shadow-[0_8px_40px_rgba(0,0,0,0.08)] relative z-10 animate-[fadeUp_0.4s_ease_both] \\\",\\\"children\\\":[\\\"$4e\\\",[\\\"$\\\",\\\"p\\\",null,{\\\"className\\\":\\\"text-center text-[0.85rem] text-slate-500 mb-8 leading-relaxed\\\",\\\"children\\\":[\\\"Tekrar hoş geldin.\\\",[\\\"$\\\",\\\"br\\\",null,{},\\\"$4a\\\",\\\"$58\\\",1],\\\"Hesabına giriş yap.\\\"]},\\\"$4a\\\",\\\"$57\\\",1],[\\\"$\\\",\\\"$L5a\\\",null,{},\\\"$4a\\\",\\\"$59\\\",1],[\\\"$\\\",\\\"p\\\",null,{\\\"className\\\":\\\"text-center text-[0.82rem] text-slate-500 mt-4\\\",\\\"children\\\":\\\"$5c\\\"},\\\"$4a\\\",\\\"$5b\\\",1],[\\\"$\\\",\\\"p\\\",null,{\\\"className\\\":\\\"text-center text-[0.82rem] text-slate-500 mt-3\\\",\\\"children\\\":[\\\"Hesabın yok mu?\\\",\\\" \\\",\\\"$62\\\"]},\\\"$4a\\\",\\\"$61\\\",1],\\\"$67\\\"]},\\\"$4a\\\",\\\"$4c\\\",1]\\n40:[\\\"$\\\",\\\"main\\\",null,{\\\"className\\\":\\\"relative min-h-dvh overflow-x-hidden flex items-center justify-center px-3 sm:px-6 py-8 bg-[#f8faff]\\\",\\\"children\\\":[[\\\"$\\\",\\\"div\\\",null,{\\\"className\\\":\\\"absolute w-[500px] h-[500px] rounded-full bg-blue-300 blur-[80px] opacity-[0.18] pointer-events-none -top-[150px] -right-[150px]\\\"},\\\"$41\\\",\\\"$47\\\",1],[\\\"$\\\",\\\"div\\\",null,{\\\"className\\\":\\\"absolute w-[400px] h-[400px] rounded-full bg-violet-300 blur-[80px] opacity-[0.18] pointer-events-none -bottom-[120px] -left-[120px]\\\"},\\\"$41\\\",\\\"$48\\\",1],\\\"$49\\\"]},\\\"$41\\\",\\\"$45\\\",1]\\n6f:D\\\"$71\\\"\\n6f:D\\\"$70\\\"\\n6f:D\\\"$73\\\"\\n6f:[\\\"$\\\",\\\"$L74\\\",null,{\\\"children\\\":[\\\"$\\\",\\\"$76\\\",null,{\\\"name\\\":\\\"Next.MetadataOutlet\\\",\\\"children\\\":\\\"$@77\\\"},\\\"$70\\\",\\\"$75\\\",1]},\\\"$70\\\",\\\"$72\\\",1]\\n7a:D\\\"$7d\\\"\\n7a:D\\\"$7b\\\"\\n7a:D\\\"$7e\\\"\\n7a:null\\n7f:D\\\"$81\\\"\\n7f:D\\\"$80\\\"\\n7f:D\\\"$83\\\"\\n85:D\\\"$87\\\"\\n85:D\\\"$86\\\"\\n7f:[\\\"$\\\",\\\"$L84\\\",null,{\\\"children\\\":\\\"$L85\\\"},\\\"$80\\\",\\\"$82\\\",1]\\n88:D\\\"$8a\\\"\\n88:D\\\"$89\\\"\\n88:D\\\"$8c\\\"\\n90:D\\\"$92\\\"\\n90:D\\\"$91\\\"\\n88:[\\\"$\\\",\\\"div\\\",null,{\\\"hidden\\\":true,\\\"children\\\":[\\\"$\\\",\\\"$L8e\\\",null,{\\\"children\\\":[\\\"$\\\",\\\"$76\\\",null,{\\\"name\\\":\\\"Next.Metadata\\\",\\\"children\\\":\\\"$L90\\\"},\\\"$89\\\",\\\"$8f\\\",1]},\\\"$89\\\",\\\"$8d\\\",1]},\\\"$89\\\",\\\"$8b\\\",1]\\n94:[]\\n\"])</script><script>self.__next_f.push([1,\"0:{\\\"P\\\":\\\"$1\\\",\\\"c\\\":[\\\"\\\",\\\"login?next=%3Csvg+onload%3Dalert%281%29%3E\\\"],\\\"q\\\":\\\"?next=%3Csvg%20onload%3Dalert(1)%3E\\\",\\\"i\\\":true,\\\"f\\\":[[[\\\"\\\",{\\\"children\\\":[\\\"(auth)\\\",{\\\"children\\\":[\\\"login\\\",{\\\"children\\\":[\\\"__PAGE__?{\\\\\\\"next\\\\\\\":\\\\\\\"\\u003csvg onload=alert(1)\\u003e\\\\\\\"}\\\",{}]}]}]},\\\"$undefined\\\",\\\"$undefined\\\",16],[[\\\"$\\\",\\\"$La\\\",\\\"layout\\\",{\\\"type\\\":\\\"layout\\\",\\\"pagePath\\\":\\\"layout.tsx\\\",\\\"children\\\":[\\\"$\\\",\\\"$c\\\",\\\"c\\\",{\\\"children\\\":[[[\\\"$\\\",\\\"link\\\",\\\"0\\\",{\\\"rel\\\":\\\"stylesheet\\\",\\\"href\\\":\\\"/_next/static/chunks/app_globals_0jn8.0u.css\\\",\\\"precedence\\\":\\\"next_static/chunks/app_globals_0jn8.0u.css\\\",\\\"crossOrigin\\\":\\\"$undefined\\\",\\\"nonce\\\":\\\"$undefined\\\"},null,\\\"$d\\\",0],[\\\"$\\\",\\\"script\\\",\\\"script-0\\\",{\\\"src\\\":\\\"/_next/static/chunks/node_modules_next_dist_0tt2wve._.js\\\",\\\"async\\\":true,\\\"nonce\\\":\\\"$undefined\\\"},null,\\\"$e\\\",0],[\\\"$\\\",\\\"script\\\",\\\"script-1\\\",{\\\"src\\\":\\\"/_next/static/chunks/app_layout_tsx_004glpo._.js\\\",\\\"async\\\":true,\\\"nonce\\\":\\\"$undefined\\\"},null,\\\"$f\\\",0]],\\\"$10\\\"]},null,\\\"$b\\\",1]},null,\\\"$9\\\",0],{\\\"children\\\":[[\\\"$\\\",\\\"$La\\\",\\\"layout\\\",{\\\"type\\\":\\\"layout\\\",\\\"pagePath\\\":\\\"(auth)/layout.tsx\\\",\\\"children\\\":[\\\"$\\\",\\\"$c\\\",\\\"c\\\",{\\\"children\\\":[[[\\\"$\\\",\\\"link\\\",\\\"0\\\",{\\\"rel\\\":\\\"stylesheet\\\",\\\"href\\\":\\\"/_next/static/chunks/%5Bnext%5D_internal_font_google_0h9rp2h._.css\\\",\\\"precedence\\\":\\\"next_static/chunks/[next]_internal_font_google_0h9rp2h._.css\\\",\\\"crossOrigin\\\":\\\"$undefined\\\",\\\"nonce\\\":\\\"$undefined\\\"},null,\\\"$29\\\",0],[\\\"$\\\",\\\"script\\\",\\\"script-0\\\",{\\\"src\\\":\\\"/_next/static/chunks/app_(auth)_layout_tsx_0kcl1js._.js\\\",\\\"async\\\":true,\\\"nonce\\\":\\\"$undefined\\\"},null,\\\"$2a\\\",0]],\\\"$2b\\\"]},null,\\\"$28\\\",1]},null,\\\"$27\\\",0],{\\\"children\\\":[[\\\"$\\\",\\\"$c\\\",\\\"c\\\",{\\\"children\\\":[null,[\\\"$\\\",\\\"$L1f\\\",null,{\\\"parallelRouterKey\\\":\\\"children\\\",\\\"error\\\":\\\"$undefined\\\",\\\"errorStyles\\\":\\\"$undefined\\\",\\\"errorScripts\\\":\\\"$undefined\\\",\\\"template\\\":[\\\"$\\\",\\\"$L21\\\",null,{},null,\\\"$3d\\\",1],\\\"templateStyles\\\":\\\"$undefined\\\",\\\"templateScripts\\\":\\\"$undefined\\\",\\\"notFound\\\":\\\"$undefined\\\",\\\"forbidden\\\":\\\"$undefined\\\",\\\"unauthorized\\\":\\\"$undefined\\\",\\\"segmentViewBoundaries\\\":[\\\"$undefined\\\",\\\"$undefined\\\",\\\"$undefined\\\",\\\"$undefined\\\"]},null,\\\"$3c\\\",1]]},null,\\\"$3b\\\",0],{\\\"children\\\":[[\\\"$\\\",\\\"$c\\\",\\\"c\\\",{\\\"children\\\":[[\\\"$\\\",\\\"$La\\\",\\\"c-page\\\",{\\\"type\\\":\\\"page\\\",\\\"pagePath\\\":\\\"(auth)/login/page.tsx\\\",\\\"children\\\":\\\"$40\\\"},null,\\\"$3f\\\",1],[[\\\"$\\\",\\\"script\\\",\\\"script-0\\\",{\\\"src\\\":\\\"/_next/static/chunks/node_modules_0a5sha1._.js\\\",\\\"async\\\":true,\\\"nonce\\\":\\\"$undefined\\\"},null,\\\"$6c\\\",0],[\\\"$\\\",\\\"script\\\",\\\"script-1\\\",{\\\"src\\\":\\\"/_next/static/chunks/_0618icz._.js\\\",\\\"async\\\":true,\\\"nonce\\\":\\\"$undefined\\\"},null,\\\"$6d\\\",0],[\\\"$\\\",\\\"script\\\",\\\"script-2\\\",{\\\"src\\\":\\\"/_next/static/chunks/app_(auth)_login_page_tsx_0ziky50._.js\\\",\\\"async\\\":true,\\\"nonce\\\":\\\"$undefined\\\"},null,\\\"$6e\\\",0]],\\\"$6f\\\"]},null,\\\"$3e\\\",0],{},null,false,null]},null,false,\\\"$@78\\\"]},null,false,null]},null,false,null],[\\\"$\\\",\\\"$c\\\",\\\"h\\\",{\\\"children\\\":[\\\"$7a\\\",\\\"$7f\\\",\\\"$88\\\",[\\\"$\\\",\\\"meta\\\",null,{\\\"name\\\":\\\"next-size-adjust\\\",\\\"content\\\":\\\"\\\"},null,\\\"$93\\\",1]]},null,\\\"$79\\\",0],false]],\\\"m\\\":\\\"$W94\\\",\\\"G\\\":[\\\"$95\\\",[\\\"$\\\",\\\"$La\\\",\\\"ge-svn\\\",{\\\"type\\\":\\\"global-error\\\",\\\"pagePath\\\":\\\"__next_builtin__global-error.js\\\",\\\"children\\\":[[\\\"$\\\",\\\"link\\\",\\\"0\\\",{\\\"rel\\\":\\\"stylesheet\\\",\\\"href\\\":\\\"/_next/static/chunks/app_globals_0jn8.0u.css\\\",\\\"precedence\\\":\\\"next_static/chunks/app_globals_0jn8.0u.css\\\",\\\"crossOrigin\\\":\\\"$undefined\\\",\\\"nonce\\\":\\\"$undefined\\\"},null,\\\"$97\\\",0]]},null,\\\"$96\\\",0]],\\\"S\\\":false,\\\"h\\\":null,\\\"s\\\":\\\"$undefined\\\",\\\"l\\\":\\\"$undefined\\\",\\\"p\\\":\\\"$undefined\\\",\\\"d\\\":\\\"$undefined\\\",\\\"b\\\":\\\"development\\\"}\\n\"])</script><script>self.__next_f.push([1,\"98:[]\\n78:D\\\"$99\\\"\\n78:\\\"$W98\\\"\\n85:D\\\"$9a\\\"\\n85:[[\\\"$\\\",\\\"meta\\\",\\\"0\\\",{\\\"charSet\\\":\\\"utf-8\\\"},\\\"$70\\\",\\\"$9b\\\",0],[\\\"$\\\",\\\"meta\\\",\\\"1\\\",{\\\"name\\\":\\\"viewport\\\",\\\"content\\\":\\\"width=device-width, initial-scale=1, maximum-scale=1\\\"},\\\"$70\\\",\\\"$9c\\\",0]]\\n77:D\\\"$9d\\\"\\n77:null\\n90:D\\\"$9e\\\"\\n90:[[\\\"$\\\",\\\"title\\\",\\\"0\\\",{\\\"children\\\":\\\"biprova — Giriş Yap\\\"},\\\"$70\\\",\\\"$9f\\\",0],[\\\"$\\\",\\\"meta\\\",\\\"1\\\",{\\\"name\\\":\\\"description\\\",\\\"content\\\":\\\"Bir projem var.\\\"},\\\"$70\\\",\\\"$a0\\\",0],[\\\"$\\\",\\\"link\\\",\\\"2\\\",{\\\"rel\\\":\\\"icon\\\",\\\"href\\\":\\\"/favicon.ico?favicon.0x3dzn~oxb6tn.ico\\\",\\\"sizes\\\":\\\"256x256\\\",\\\"type\\\":\\\"image/x-icon\\\"},\\\"$70\\\",\\\"$a1\\\",0],[\\\"$\\\",\\\"$La3\\\",\\\"3\\\",{},\\\"$70\\\",\\\"$a2\\\",0]]\\n\"])</script><script data-nextjs-dev-overlay=\"true\" style=\"display: block; position: absolute;\"><nextjs-portal style=\"--nextjs-dev-tools-scale: 1;\"></nextjs-portal></script><next-route-announcer style=\"position: absolute;\"></next-route-announcer></body></html>"
```

# Page snapshot

```yaml
- generic [active] [ref=e1]:
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
        - generic [ref=e11]:
          - generic [ref=e12]: Şifre
          - textbox "Şifre" [ref=e13]:
            - /placeholder: ••••••••
        - button "Giriş Yap →" [ref=e14] [cursor=pointer]
      - paragraph [ref=e15]:
        - link "Şifremi unuttum" [ref=e16] [cursor=pointer]:
          - /url: /forgot-password
      - paragraph [ref=e17]:
        - text: Hesabın yok mu?
        - link "Kayıt ol" [ref=e18] [cursor=pointer]:
          - /url: /signup
      - link "← Ana sayfaya dön" [ref=e19] [cursor=pointer]:
        - /url: /
  - button "Open Next.js Dev Tools" [ref=e25] [cursor=pointer]:
    - img [ref=e26]
  - alert [ref=e29]
```

# Test source

```ts
  1   | import { test, expect } from '@playwright/test'
  2   | 
  3   | const BASE_URL = 'http://localhost:3000'
  4   | 
  5   | // ---------------------------------------------------------------------------
  6   | // 1. SQL Injection — login formuna SQLi payload'ları
  7   | // ---------------------------------------------------------------------------
  8   | test.describe('SQL Injection', () => {
  9   |   const sqliPayloads = [
  10  |     "' OR '1'='1",
  11  |     "' OR 1=1 --",
  12  |     "admin'--",
  13  |     "' UNION SELECT 1,2,3 --",
  14  |     "'; DROP TABLE users; --",
  15  |   ]
  16  | 
  17  |   for (const payload of sqliPayloads) {
  18  |     test(`login email alanı SQLi payload reddedilmeli: ${payload}`, async ({ page }) => {
  19  |       await page.goto(`${BASE_URL}/login`)
  20  |       await page.fill('input[type="email"]', payload)
  21  |       await page.fill('input[type="password"]', 'HerhangiParola123!')
  22  |       await page.click('button[type="submit"], button')
  23  |       await page.waitForLoadState('networkidle')
  24  | 
  25  |       // Giriş başarılı olmamalı — dashboard'a geçilmemeli
  26  |       expect(page.url()).not.toContain('/dashboard')
  27  |       // Sunucu hatası dönmemeli
  28  |       const content = await page.content()
  29  |       expect(content).not.toMatch(/syntax error|pg_query|PostgreSQL|supabase_admin/i)
  30  |     })
  31  |   }
  32  | })
  33  | 
  34  | // ---------------------------------------------------------------------------
  35  | // 2. Reflected XSS — URL parametrelerine script enjeksiyonu
  36  | // ---------------------------------------------------------------------------
  37  | test.describe('Reflected XSS', () => {
  38  |   const xssPayloads = [
  39  |     '<script>alert(1)</script>',
  40  |     '"><script>alert(1)</script>',
  41  |     "javascript:alert(1)",
  42  |     '<img src=x onerror=alert(1)>',
  43  |     '<svg onload=alert(1)>',
  44  |   ]
  45  | 
  46  |   for (const payload of xssPayloads) {
  47  |     test(`login?next= XSS payload HTML'de ham çıkmamalı: ${payload}`, async ({ page }) => {
  48  |       const encoded = encodeURIComponent(payload)
  49  |       await page.goto(`${BASE_URL}/login?next=${encoded}`)
  50  |       await page.waitForLoadState('networkidle')
  51  |       const content = await page.content()
  52  |       // Payload'ın ham hali sayfada olmamalı (encode edilmiş olabilir)
  53  |       expect(content).not.toContain('<script>alert(1)</script>')
  54  |       expect(content).not.toContain('onerror=alert(1)')
> 55  |       expect(content).not.toContain('onload=alert(1)')
      |                           ^ Error: expect(received).not.toContain(expected) // indexOf
  56  |     })
  57  |   }
  58  | 
  59  |   test('query string XSS — sayfa scripti çalıştırmamalı', async ({ page }) => {
  60  |     let alertFired = false
  61  |     page.on('dialog', () => { alertFired = true })
  62  | 
  63  |     await page.goto(`${BASE_URL}/?q=%3Cscript%3Ealert(1)%3C%2Fscript%3E`)
  64  |     await page.waitForLoadState('networkidle')
  65  |     expect(alertFired).toBe(false)
  66  |   })
  67  | })
  68  | 
  69  | // ---------------------------------------------------------------------------
  70  | // 3. Cookie Güvenlik Bayrakları
  71  | // ---------------------------------------------------------------------------
  72  | test.describe('Cookie Güvenlik Bayrakları', () => {
  73  |   test('session cookie HttpOnly bayrağı taşımalı', async ({ page }) => {
  74  |     await page.goto(`${BASE_URL}/`)
  75  |     const cookies = await page.context().cookies()
  76  |     const sessionCookies = cookies.filter(c =>
  77  |       c.name.includes('auth') || c.name.includes('session') || c.name.includes('sb-')
  78  |     )
  79  |     // Eğer cookie varsa HttpOnly olmalı
  80  |     for (const cookie of sessionCookies) {
  81  |       expect(cookie.httpOnly).toBe(true)
  82  |     }
  83  |   })
  84  | 
  85  |   test('session cookie SameSite=Lax veya Strict olmalı', async ({ page }) => {
  86  |     await page.goto(`${BASE_URL}/`)
  87  |     const cookies = await page.context().cookies()
  88  |     const sessionCookies = cookies.filter(c =>
  89  |       c.name.includes('auth') || c.name.includes('session') || c.name.includes('sb-')
  90  |     )
  91  |     for (const cookie of sessionCookies) {
  92  |       expect(['Lax', 'Strict']).toContain(cookie.sameSite)
  93  |     }
  94  |   })
  95  | 
  96  |   test('login sonrası oluşan cookie\'ler HttpOnly olmalı', async ({ page }) => {
  97  |     await page.goto(`${BASE_URL}/login`)
  98  |     // Geçersiz giriş yaparak cookie flow'u tetikle
  99  |     await page.fill('input[type="email"]', 'test@test.com')
  100 |     await page.fill('input[type="password"]', 'TestParola123!')
  101 |     await page.click('button[type="submit"], button')
  102 |     await page.waitForLoadState('networkidle')
  103 | 
  104 |     const cookies = await page.context().cookies()
  105 |     const authCookies = cookies.filter(c => c.name.startsWith('sb-'))
  106 |     for (const cookie of authCookies) {
  107 |       expect(cookie.httpOnly).toBe(true)
  108 |     }
  109 |   })
  110 | })
  111 | 
  112 | // ---------------------------------------------------------------------------
  113 | // 4. Brute Force / Rate Limiting — login endpoint
  114 | // ---------------------------------------------------------------------------
  115 | test.describe('Rate Limiting', () => {
  116 |   test('art arda 5 başarısız login denemesi engellenebilmeli', async ({ page }) => {
  117 |     await page.goto(`${BASE_URL}/login`)
  118 | 
  119 |     for (let i = 0; i < 5; i++) {
  120 |       await page.fill('input[type="email"]', 'bruteforce@test.com')
  121 |       await page.fill('input[type="password"]', `YanlisParola${i}!`)
  122 |       await page.click('button[type="submit"], button')
  123 |       await page.waitForLoadState('networkidle')
  124 |     }
  125 | 
  126 |     // 5 denemeden sonra hâlâ login sayfasında olmalı, dashboard'a geçilmemeli
  127 |     expect(page.url()).not.toContain('/dashboard')
  128 |     // İdeal olarak rate limit mesajı veya yavaşlama olmalı
  129 |     const content = await page.content()
  130 |     // En azından sunucu 500 vermemiş olmalı
  131 |     expect(content).not.toMatch(/Internal Server Error|Application error/i)
  132 |   })
  133 | })
  134 | 
  135 | // ---------------------------------------------------------------------------
  136 | // 5. IDOR — başka kullanıcının kaynağına ID ile erişim
  137 | // ---------------------------------------------------------------------------
  138 | test.describe('IDOR (Insecure Direct Object Reference)', () => {
  139 |   test('başka kullanıcının profili — yetkisiz erişimde veri sızmamalı', async ({ page }) => {
  140 |     // Auth olmadan başka kullanıcı ID'si ile profil erişimi
  141 |     await page.goto(`${BASE_URL}/dashboard/profile/99999999-9999-9999-9999-999999999999`)
  142 |     await page.waitForURL(/\/(login|$)/, { timeout: 5000 })
  143 |     // Kullanıcı verisine erişilememiş olmalı — login'e düşmeli
  144 |     expect(page.url()).not.toContain('/dashboard')
  145 |   })
  146 | 
  147 |   test('başka takımın sayfası — yetkisiz erişimde veri sızmamalı', async ({ page }) => {
  148 |     await page.goto(`${BASE_URL}/dashboard/teams/99999999-9999-9999-9999-999999999999`)
  149 |     await page.waitForURL(/\/(login|$)/, { timeout: 5000 })
  150 |     expect(page.url()).not.toContain('/dashboard')
  151 |   })
  152 | })
  153 | 
  154 | // ---------------------------------------------------------------------------
  155 | // 6. Hassas Veri — response body kontrolü
```