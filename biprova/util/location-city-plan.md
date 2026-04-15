# Konum → Şehir Tespiti — Uygulama Planı

## Amaç
Kullanıcı konum toggle'ını açtığında lat/lng alınmasının yanı sıra hangi şehirde olduğu da tespit edilsin ve LocationContext'te tutulsun.

## Adımlar

### 1. `lib/location.ts` — `reverseGeocode` fonksiyonu ekle
- `lat, lng` alıp şehir adı döndürür
- OpenStreetMap Nominatim kullan (ücretsiz, API key yok, Türkiye'de güvenilir)
- Fallback sırası: `address.city` → `address.town` → `address.province`
- `LocationResult` tipine `city: string | null` ekle

### 2. `lib/location.ts` — `getUserLocation` refactor
- Şu an sadece `point` döndürüyor
- Reverse geocode'u içine al → `city` de döndürsün
- Yeni `LocationResult`:
  ```ts
  interface LocationResult {
    point: GeoPoint | null;
    city: string | null;
    error: LocationError | null;
  }
  ```
- Web path için de aynı akış (kod tekrarı kaldırılır)

### 3. `contexts/location-context.tsx` — `city` alanı ekle
- `LocationCoords` veya ayrı state olarak `city: string | null` tut
- `setLocation(lat, lng, city)` → üçüncü parametre
- `clearLocation()` → city'yi de sıfırlar
- Context value'ya `city` expose edilir

### 4. `create-project-left-col.tsx` — `handleLocationToggle` güncelle
- Native path: `getUserLocation()` artık `city` de döndüreceği için `setLocation(lat, lng, city)` çağır
- Web path: mevcut `navigator.geolocation` bloğu kaldır — her şey `getUserLocation()` üzerinden geçsin
- `useLocation()`'dan `city` de destructure et

### 5. Form'a `city` hidden input ekle
- `<input type="hidden" name="city" value={city ?? ""} />`
- `createProject` server action'ı bu alanı okuyabilir

## Notlar
- Nominatim rate limit: 1 istek/saniye — tek seferlik çağrı olduğu için sorun değil
- `city` bilgisi `projects` tablosunda zaten var (`city` kolonu)
- Frontend hazırlandıktan sonra bu adımlar uygulanacak
