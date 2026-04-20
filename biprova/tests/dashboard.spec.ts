import { test, expect } from '@playwright/test'

const BASE_URL = 'http://localhost:3000'

// ---------------------------------------------------------------------------
// 1. Dashboard Alt Route'ları — yetkisiz erişim (auth bypass)
// ---------------------------------------------------------------------------
test.describe('Dashboard Auth Bypass', () => {
  const protectedRoutes = [
    '/dashboard/createProject',
    '/dashboard/posts/teams',
    '/dashboard/posts/news',
    '/dashboard/notifications',
    '/dashboard/settings',
    '/dashboard/profile/00000000-0000-0000-0000-000000000000',
    '/dashboard/teams/00000000-0000-0000-0000-000000000000',
    '/dashboard/posts/news/00000000-0000-0000-0000-000000000000',
    '/dashboard/posts/teams/00000000-0000-0000-0000-000000000000',
    '/dashboard/posts/projects/00000000-0000-0000-0000-000000000000',
  ]

  for (const route of protectedRoutes) {
    test(`${route} — yetkisiz erişim reddedilmeli`, async ({ page }) => {
      await page.goto(`${BASE_URL}${route}`)
      await page.waitForURL(/\/(login|$)/, { timeout: 5000 })
      expect(page.url()).not.toContain('/dashboard')
    })
  }
})

// ---------------------------------------------------------------------------
// 2. Hata Sızıntısı — 500 ve stack trace içermemeli
// ---------------------------------------------------------------------------
test.describe('Dashboard Hata Sızıntısı', () => {
  test('geçersiz proje ID — 500 dönmemeli', async ({ page }) => {
    const response = await page.goto(`${BASE_URL}/dashboard/projects/gecersiz-id`)
    expect(response?.status()).not.toBe(500)
  })

  test('geçersiz takım ID — 500 dönmemeli', async ({ page }) => {
    const response = await page.goto(`${BASE_URL}/dashboard/teams/gecersiz-id`)
    expect(response?.status()).not.toBe(500)
  })

  test('proje URL içinde XSS denemesi — sunucu hata vermemeli', async ({ page }) => {
    const response = await page.goto(`${BASE_URL}/dashboard/projects/%3Cscript%3Ealert(1)%3C%2Fscript%3E`)
    expect(response?.status()).not.toBe(500)
    const content = await page.content()
    expect(content).not.toContain('<script>alert(1)</script>')
  })

  test('bilinmeyen dashboard alt yolu — 500 olmamalı', async ({ page }) => {
    const response = await page.goto(`${BASE_URL}/dashboard/bu-sayfa-kesinlikle-yok`)
    expect(response?.status()).not.toBe(500)
  })
})

// ---------------------------------------------------------------------------
// 3. Açık Redirect — dashboard query param ile dış siteye yönlenmemeli
// ---------------------------------------------------------------------------
test.describe('Dashboard Açık Redirect', () => {
  test('dashboard?next= dış URL ile redirect olmamalı', async ({ page }) => {
    await page.goto(`${BASE_URL}/dashboard?next=https://evil.com`)
    await page.waitForLoadState('networkidle')
    expect(page.url()).toContain('localhost:3000')
  })

  test('login?callbackUrl dış URL ile redirect olmamalı', async ({ page }) => {
    await page.goto(`${BASE_URL}/login?callbackUrl=https://evil.com/dashboard`)
    await page.waitForLoadState('networkidle')
    expect(page.url()).toContain('localhost:3000')
  })
})
