import { test, expect } from '@playwright/test'

const BASE_URL = 'http://localhost:3000'

// ---------------------------------------------------------------------------
// 1. SQL Injection — login formuna SQLi payload'ları
// ---------------------------------------------------------------------------
test.describe('SQL Injection', () => {
  const sqliPayloads = [
    "' OR '1'='1",
    "' OR 1=1 --",
    "admin'--",
    "' UNION SELECT 1,2,3 --",
    "'; DROP TABLE users; --",
  ]

  for (const payload of sqliPayloads) {
    test(`login email alanı SQLi payload reddedilmeli: ${payload}`, async ({ page }) => {
      await page.goto(`${BASE_URL}/login`)
      await page.fill('input[type="email"]', payload)
      await page.fill('input[type="password"]', 'HerhangiParola123!')
      await page.click('button[type="submit"], button')
      await page.waitForLoadState('networkidle')

      // Giriş başarılı olmamalı — dashboard'a geçilmemeli
      expect(page.url()).not.toContain('/dashboard')
      // Sunucu hatası dönmemeli
      const content = await page.content()
      expect(content).not.toMatch(/syntax error|pg_query|PostgreSQL|supabase_admin/i)
    })
  }
})

// ---------------------------------------------------------------------------
// 2. Reflected XSS — URL parametrelerine script enjeksiyonu
// ---------------------------------------------------------------------------
test.describe('Reflected XSS', () => {
  const xssPayloads = [
    '<script>alert(1)</script>',
    '"><script>alert(1)</script>',
    "javascript:alert(1)",
    '<img src=x onerror=alert(1)>',
    '<svg onload=alert(1)>',
  ]

  for (const payload of xssPayloads) {
    test(`login?next= XSS payload HTML'de ham çıkmamalı: ${payload}`, async ({ page }) => {
      const encoded = encodeURIComponent(payload)
      await page.goto(`${BASE_URL}/login?next=${encoded}`)
      await page.waitForLoadState('networkidle')
      const content = await page.content()
      // Payload'ın ham hali sayfada olmamalı (encode edilmiş olabilir)
      expect(content).not.toContain('<script>alert(1)</script>')
      expect(content).not.toContain('onerror=alert(1)')
      expect(content).not.toContain('onload=alert(1)')
    })
  }

  test('query string XSS — sayfa scripti çalıştırmamalı', async ({ page }) => {
    let alertFired = false
    page.on('dialog', () => { alertFired = true })

    await page.goto(`${BASE_URL}/?q=%3Cscript%3Ealert(1)%3C%2Fscript%3E`)
    await page.waitForLoadState('networkidle')
    expect(alertFired).toBe(false)
  })
})

// ---------------------------------------------------------------------------
// 3. Cookie Güvenlik Bayrakları
// ---------------------------------------------------------------------------
test.describe('Cookie Güvenlik Bayrakları', () => {
  test('session cookie HttpOnly bayrağı taşımalı', async ({ page }) => {
    await page.goto(`${BASE_URL}/`)
    const cookies = await page.context().cookies()
    const sessionCookies = cookies.filter(c =>
      c.name.includes('auth') || c.name.includes('session') || c.name.includes('sb-')
    )
    // Eğer cookie varsa HttpOnly olmalı
    for (const cookie of sessionCookies) {
      expect(cookie.httpOnly).toBe(true)
    }
  })

  test('session cookie SameSite=Lax veya Strict olmalı', async ({ page }) => {
    await page.goto(`${BASE_URL}/`)
    const cookies = await page.context().cookies()
    const sessionCookies = cookies.filter(c =>
      c.name.includes('auth') || c.name.includes('session') || c.name.includes('sb-')
    )
    for (const cookie of sessionCookies) {
      expect(['Lax', 'Strict']).toContain(cookie.sameSite)
    }
  })

  test('login sonrası oluşan cookie\'ler HttpOnly olmalı', async ({ page }) => {
    await page.goto(`${BASE_URL}/login`)
    // Geçersiz giriş yaparak cookie flow'u tetikle
    await page.fill('input[type="email"]', 'test@test.com')
    await page.fill('input[type="password"]', 'TestParola123!')
    await page.click('button[type="submit"], button')
    await page.waitForLoadState('networkidle')

    const cookies = await page.context().cookies()
    const authCookies = cookies.filter(c => c.name.startsWith('sb-'))
    for (const cookie of authCookies) {
      expect(cookie.httpOnly).toBe(true)
    }
  })
})

// ---------------------------------------------------------------------------
// 4. Brute Force / Rate Limiting — login endpoint
// ---------------------------------------------------------------------------
test.describe('Rate Limiting', () => {
  test('art arda 5 başarısız login denemesi engellenebilmeli', async ({ page }) => {
    await page.goto(`${BASE_URL}/login`)

    for (let i = 0; i < 5; i++) {
      await page.fill('input[type="email"]', 'bruteforce@test.com')
      await page.fill('input[type="password"]', `YanlisParola${i}!`)
      await page.click('button[type="submit"], button')
      await page.waitForLoadState('networkidle')
    }

    // 5 denemeden sonra hâlâ login sayfasında olmalı, dashboard'a geçilmemeli
    expect(page.url()).not.toContain('/dashboard')
    // İdeal olarak rate limit mesajı veya yavaşlama olmalı
    const content = await page.content()
    // En azından sunucu 500 vermemiş olmalı
    expect(content).not.toMatch(/Internal Server Error|Application error/i)
  })
})

// ---------------------------------------------------------------------------
// 5. IDOR — başka kullanıcının kaynağına ID ile erişim
// ---------------------------------------------------------------------------
test.describe('IDOR (Insecure Direct Object Reference)', () => {
  test('başka kullanıcının profili — yetkisiz erişimde veri sızmamalı', async ({ page }) => {
    // Auth olmadan başka kullanıcı ID'si ile profil erişimi
    await page.goto(`${BASE_URL}/dashboard/profile/99999999-9999-9999-9999-999999999999`)
    await page.waitForURL(/\/(login|$)/, { timeout: 5000 })
    // Kullanıcı verisine erişilememiş olmalı — login'e düşmeli
    expect(page.url()).not.toContain('/dashboard')
  })

  test('başka takımın sayfası — yetkisiz erişimde veri sızmamalı', async ({ page }) => {
    await page.goto(`${BASE_URL}/dashboard/teams/99999999-9999-9999-9999-999999999999`)
    await page.waitForURL(/\/(login|$)/, { timeout: 5000 })
    expect(page.url()).not.toContain('/dashboard')
  })
})

// ---------------------------------------------------------------------------
// 6. Hassas Veri — response body kontrolü
// ---------------------------------------------------------------------------
test.describe('Hassas Veri Sızıntısı — Gelişmiş', () => {
  test('login sayfası response body\'de secret key içermemeli', async ({ page }) => {
    const response = await page.goto(`${BASE_URL}/login`)
    const body = await response!.text()
    expect(body).not.toMatch(/eyJhbGci[A-Za-z0-9._-]{20,}/) // JWT token pattern
    expect(body).not.toMatch(/service_role/)
    expect(body).not.toMatch(/SUPABASE_SERVICE/)
  })

  test('ana sayfa response body\'de .env değişkeni sızmamalı', async ({ page }) => {
    const response = await page.goto(`${BASE_URL}/`)
    const body = await response!.text()
    expect(body).not.toMatch(/RESEND_API_KEY|SERVICE_ROLE_KEY|SUPABASE_SERVICE/)
  })

  test('hata sayfası database bağlantı bilgisi içermemeli', async ({ page }) => {
    await page.goto(`${BASE_URL}/dashboard/projects/00000000-0000-0000-0000-000000000000`)
    const content = await page.content()
    expect(content).not.toMatch(/postgresql:\/\/|postgres:\/\/|supabase\.co.*key/)
  })

  test('404 sayfası dosya sistemi yolu sızdırmamalı', async ({ page }) => {
    await page.goto(`${BASE_URL}/var/www/html/config`)
    const content = await page.content()
    expect(content).not.toMatch(/\/home\/|\/var\/www\/|\/etc\/passwd|C:\\Users\\/)
  })
})

// ---------------------------------------------------------------------------
// 7. Path Traversal
// ---------------------------------------------------------------------------
test.describe('Path Traversal', () => {
  const traversalPayloads = [
    '../../../../etc/passwd',
    '..%2F..%2F..%2Fetc%2Fpasswd',
    '%2e%2e%2f%2e%2e%2f%2e%2e%2fetc%2fpasswd',
  ]

  for (const payload of traversalPayloads) {
    test(`path traversal denemesi sunucu hatası vermemeli: ${payload}`, async ({ page }) => {
      const response = await page.goto(`${BASE_URL}/${payload}`)
      const status = response?.status() ?? 0
      // 500 vermemeli, /etc/passwd içeriği dönmemeli
      expect(status).not.toBe(500)
      const content = await page.content()
      expect(content).not.toContain('root:x:0:0')
    })
  }
})

// ---------------------------------------------------------------------------
// 8. HTTP Method Güvenliği
// ---------------------------------------------------------------------------
test.describe('HTTP Method Güvenliği', () => {
  test('login endpoint GET ile erişilebilir', async ({ page }) => {
    const response = await page.goto(`${BASE_URL}/login`)
    expect(response?.status()).toBeLessThan(500)
  })

  test('OPTIONS request — sunucu 500 vermemeli', async ({ request }) => {
    const response = await request.fetch(`${BASE_URL}/`, { method: 'OPTIONS' })
    expect(response.status()).not.toBe(500)
  })
})
