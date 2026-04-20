import { test, expect } from '@playwright/test'

const BASE_URL = 'http://localhost:3000'

// ---------------------------------------------------------------------------
// 1. Auth Bypass — giriş yapmadan korumalı sayfalara erişim
// ---------------------------------------------------------------------------
test.describe('Auth Bypass', () => {
  test('dashboard ana sayfa — yetkisiz erişim reddedilmeli', async ({ page }) => {
    await page.goto(`${BASE_URL}/dashboard`)
    await page.waitForURL(/\/(login|$)/, { timeout: 5000 })
    expect(page.url()).not.toContain('/dashboard')
  })

  test('dashboard/projects — yetkisiz erişim reddedilmeli', async ({ page }) => {
    await page.goto(`${BASE_URL}/dashboard/projects/fake-id`)
    await page.waitForURL(/\/(login|$)/, { timeout: 5000 })
    expect(page.url()).not.toContain('/dashboard')
  })

  test('dashboard/teams — yetkisiz erişim reddedilmeli', async ({ page }) => {
    await page.goto(`${BASE_URL}/dashboard/teams/fake-id`)
    await page.waitForURL(/\/(login|$)/, { timeout: 5000 })
    expect(page.url()).not.toContain('/dashboard')
  })

  test('dashboard/profile — yetkisiz erişim reddedilmeli', async ({ page }) => {
    await page.goto(`${BASE_URL}/dashboard/profile`)
    await page.waitForURL(/\/(login|$)/, { timeout: 5000 })
    expect(page.url()).not.toContain('/dashboard')
  })

  test('dashboard/settings — yetkisiz erişim reddedilmeli', async ({ page }) => {
    await page.goto(`${BASE_URL}/dashboard/settings`)
    await page.waitForURL(/\/(login|$)/, { timeout: 5000 })
    expect(page.url()).not.toContain('/dashboard')
  })
})

// ---------------------------------------------------------------------------
// 2. Login sayfası — temel kontroller
// ---------------------------------------------------------------------------
test.describe('Login Sayfası', () => {
  test('login sayfası yükleniyor', async ({ page }) => {
    await page.goto(`${BASE_URL}/login`)
    await expect(page.locator('input[type="email"]')).toBeVisible()
    await expect(page.locator('input[type="password"]')).toBeVisible()
  })

  test('boş form gönderince hata gösteriyor', async ({ page }) => {
    await page.goto(`${BASE_URL}/login`)
    await page.click('button')
    // Validation hataları görünmeli
    await expect(page.locator('text=/e-posta|geçerli/i')).toBeVisible({ timeout: 3000 })
  })

  test('yanlış bilgilerle giriş başarısız olmalı', async ({ page }) => {
    await page.goto(`${BASE_URL}/login`)
    await page.fill('input[type="email"]', 'yanliskullanici@test.com')
    await page.fill('input[type="password"]', 'YanlisParola123!')
    await page.click('button')
    await expect(page.locator('text=/hatalı|geçersiz|yanlış/i')).toBeVisible({ timeout: 5000 })
  })

  test('giriş yapmış kullanıcı login sayfasına gelince dashboard\'a yönlenmeli', async ({ page, context }) => {
    // Bu testi atla — gerçek credentials gerektirir
    test.skip()
  })
})

// ---------------------------------------------------------------------------
// 3. Güvenlik Headerları
// ---------------------------------------------------------------------------
test.describe('Güvenlik Headerları', () => {
  test('X-Frame-Options: DENY mevcut', async ({ page }) => {
    const response = await page.goto(`${BASE_URL}/`)
    const headers = response!.headers()
    expect(headers['x-frame-options']).toBe('DENY')
  })

  test('X-Content-Type-Options: nosniff mevcut', async ({ page }) => {
    const response = await page.goto(`${BASE_URL}/`)
    const headers = response!.headers()
    expect(headers['x-content-type-options']).toBe('nosniff')
  })

  test('Content-Security-Policy header mevcut', async ({ page }) => {
    const response = await page.goto(`${BASE_URL}/`)
    const headers = response!.headers()
    expect(headers['content-security-policy']).toBeDefined()
    expect(headers['content-security-policy']).toContain("default-src 'self'")
  })

  test('Referrer-Policy header mevcut', async ({ page }) => {
    const response = await page.goto(`${BASE_URL}/`)
    const headers = response!.headers()
    expect(headers['referrer-policy']).toBe('strict-origin-when-cross-origin')
  })

  test('Powered-By header gizlenmiş', async ({ page }) => {
    const response = await page.goto(`${BASE_URL}/`)
    const headers = response!.headers()
    expect(headers['x-powered-by']).toBeUndefined()
  })
})

// ---------------------------------------------------------------------------
// 4. Açık Redirect testi
// ---------------------------------------------------------------------------
test.describe('Açık Redirect', () => {
  test('login?next= ile dış siteye redirect olmamalı', async ({ page }) => {
    await page.goto(`${BASE_URL}/login?next=https://evil.com`)
    // Eğer manipüle edilmiş bir redirect varsa dış siteye gidebilir
    await page.waitForLoadState('networkidle')
    expect(page.url()).toContain('localhost:3000')
  })

  test('login?redirect= ile dış siteye redirect olmamalı', async ({ page }) => {
    await page.goto(`${BASE_URL}/login?redirect=https://evil.com`)
    await page.waitForLoadState('networkidle')
    expect(page.url()).toContain('localhost:3000')
  })
})

// ---------------------------------------------------------------------------
// 5. Hassas bilgi sızıntısı
// ---------------------------------------------------------------------------
test.describe('Hassas Bilgi Sızıntısı', () => {
  test('404 sayfası stack trace veya yol bilgisi içermemeli', async ({ page }) => {
    const response = await page.goto(`${BASE_URL}/bu-sayfa-yok-${Date.now()}`)
    const content = await page.content()
    expect(content).not.toMatch(/node_modules|at Object\.|at Module\.|\.ts:\d+/)
  })

  test('dashboard 401/403 hatasında sunucu detayı sızmamalı', async ({ page }) => {
    const response = await page.goto(`${BASE_URL}/dashboard/projects/00000000-0000-0000-0000-000000000000`)
    const content = await page.content()
    expect(content).not.toMatch(/SUPABASE|service_role|eyJhbGci/)
  })
})
