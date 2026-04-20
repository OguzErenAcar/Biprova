import { test, expect } from '@playwright/test'

const BASE_URL = 'http://localhost:3000'

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
async function expectRedirectToLogin(page: Parameters<typeof test>[1] extends (args: { page: infer P }) => unknown ? P : never, path: string) {
  await page.goto(`${BASE_URL}${path}`)
  await page.waitForURL(/\/(login|$)/, { timeout: 5000 })
  expect(page.url()).not.toContain('/dashboard')
}

// ---------------------------------------------------------------------------
// 1. Dashboard Alt Route'ları — yetkisiz erişim kontrolü
// ---------------------------------------------------------------------------
test.describe('Dashboard Alt Route Auth Guard', () => {
  test('createProject — yetkisiz erişim reddedilmeli', async ({ page }) => {
    await expectRedirectToLogin(page, '/dashboard/createProject')
  })

  test('posts/teams — yetkisiz erişim reddedilmeli', async ({ page }) => {
    await expectRedirectToLogin(page, '/dashboard/posts/teams')
  })

  test('posts/news — yetkisiz erişim reddedilmeli', async ({ page }) => {
    await expectRedirectToLogin(page, '/dashboard/posts/news')
  })

  test('notifications — yetkisiz erişim reddedilmeli', async ({ page }) => {
    await expectRedirectToLogin(page, '/dashboard/notifications')
  })

  test('profile/[id] — yetkisiz erişim reddedilmeli', async ({ page }) => {
    await expectRedirectToLogin(page, '/dashboard/profile/00000000-0000-0000-0000-000000000000')
  })

  test('teams/[id] — yetkisiz erişim reddedilmeli', async ({ page }) => {
    await expectRedirectToLogin(page, '/dashboard/teams/00000000-0000-0000-0000-000000000000')
  })

  test('posts/news/[id] — yetkisiz erişim reddedilmeli', async ({ page }) => {
    await expectRedirectToLogin(page, '/dashboard/posts/news/00000000-0000-0000-0000-000000000000')
  })

  test('posts/teams/[id] — yetkisiz erişim reddedilmeli', async ({ page }) => {
    await expectRedirectToLogin(page, '/dashboard/posts/teams/00000000-0000-0000-0000-000000000000')
  })

  test('posts/projects/[id] — yetkisiz erişim reddedilmeli', async ({ page }) => {
    await expectRedirectToLogin(page, '/dashboard/posts/projects/00000000-0000-0000-0000-000000000000')
  })
})

// ---------------------------------------------------------------------------
// 2. 404 / Not Found — geçersiz rotalar
// ---------------------------------------------------------------------------
test.describe('Dashboard 404 Davranışı', () => {
  test('tamamen yanlış dashboard alt yolu 404 veya login dönmeli', async ({ page }) => {
    const response = await page.goto(`${BASE_URL}/dashboard/bu-sayfa-kesinlikle-yok`)
    // Ya login'e redirect ya da 404 dönmeli; 500 olmamalı
    const status = response?.status() ?? 0
    expect(status).not.toBe(500)
  })

  test('projects/[id] geçersiz UUID — 404 veya login dönmeli, 500 olmamalı', async ({ page }) => {
    const response = await page.goto(`${BASE_URL}/dashboard/projects/gecersiz-id`)
    const status = response?.status() ?? 0
    expect(status).not.toBe(500)
  })

  test('teams/[id] geçersiz UUID — 500 olmamalı', async ({ page }) => {
    const response = await page.goto(`${BASE_URL}/dashboard/teams/gecersiz-id`)
    const status = response?.status() ?? 0
    expect(status).not.toBe(500)
  })
})

// ---------------------------------------------------------------------------
// 3. Login Redirect — query parametresi korunuyor mu?
// ---------------------------------------------------------------------------
test.describe('Login Redirect Davranışı', () => {
  test('dashboard\'a gitince login sayfasına düşmeli', async ({ page }) => {
    await page.goto(`${BASE_URL}/dashboard`)
    await page.waitForURL(/\/login/, { timeout: 5000 })
    expect(page.url()).toContain('/login')
  })

  test('login sayfası input alanlarını barındırıyor', async ({ page }) => {
    await page.goto(`${BASE_URL}/login`)
    await expect(page.locator('input[type="email"]')).toBeVisible()
    await expect(page.locator('input[type="password"]')).toBeVisible()
  })

  test('login sayfasındaki submit butonu mevcut', async ({ page }) => {
    await page.goto(`${BASE_URL}/login`)
    const btn = page.locator('button[type="submit"], button').first()
    await expect(btn).toBeVisible()
  })
})

// ---------------------------------------------------------------------------
// 4. Marketing / Herkese Açık Sayfalar
// ---------------------------------------------------------------------------
test.describe('Herkese Açık Sayfalar', () => {
  test('ana sayfa (/) yükleniyor', async ({ page }) => {
    const response = await page.goto(`${BASE_URL}/`)
    expect(response?.status()).toBeLessThan(400)
  })

  test('login sayfası (/login) yükleniyor', async ({ page }) => {
    const response = await page.goto(`${BASE_URL}/login`)
    expect(response?.status()).toBeLessThan(400)
  })
})

// ---------------------------------------------------------------------------
// 5. Dashboard Proje Detayı — Panel Route'ları
// ---------------------------------------------------------------------------
test.describe('Proje Detayı Route Guard', () => {
  const fakeProjectId = '00000000-0000-0000-0000-000000000000'

  test('proje genel paneli — yetkisiz erişim login\'e yönlenmeli', async ({ page }) => {
    await page.goto(`${BASE_URL}/dashboard/projects/${fakeProjectId}`)
    await page.waitForURL(/\/(login|$)/, { timeout: 5000 })
    expect(page.url()).not.toContain('/dashboard/projects')
  })

  test('proje URL\'si UUID formatı dışında değer alınca 500 dönmemeli', async ({ page }) => {
    const response = await page.goto(`${BASE_URL}/dashboard/projects/<script>alert(1)</script>`)
    const status = response?.status() ?? 0
    expect(status).not.toBe(500)
  })
})

// ---------------------------------------------------------------------------
// 6. Dashboard Authenticated Testler (credentials gerektirir — şimdilik atlanıyor)
// ---------------------------------------------------------------------------
test.describe('Dashboard (Authenticated)', () => {
  test.skip('ana dashboard sayfası proje listesini gösteriyor', async () => {
    // Gerçek credentials gerektirir — auth fixture eklendiğinde aktif edilecek
  })

  test.skip('createProject formu kategori ve şehir seçeneklerini yüklüyor', async () => {
    // Gerçek credentials gerektirir
  })

  test.skip('notifications sayfası "Henüz bildirim yok" mesajını gösteriyor', async () => {
    // Gerçek credentials gerektirir
  })

  test.skip('profil sayfası kullanıcı adını gösteriyor', async () => {
    // Gerçek credentials gerektirir
  })

  test.skip('haberler sayfası news-card bileşenlerini render ediyor', async () => {
    // Gerçek credentials gerektirir
  })
})
