interface GeoPoint {
  lat: number;
  lng: number;
}

interface NominatimResult {
  lat: string;
  lon: string;
}

/**
 * Şehir adını koordinata çevirir (Nominatim / OpenStreetMap).
 * API key gerektirmez. Türkiye'ye özel arama yapar.
 * Başarısız olursa null döner — konum olmadan da proje oluşturulabilir.
 */
export async function geocodeCity(city: string): Promise<GeoPoint | null> {
  if (!city.trim()) return null;

  try {
    const params = new URLSearchParams({
      city: city.trim(),
      country: 'Turkey',
      format: 'json',
      limit: '1',
    });

    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?${params}`,
      {
        headers: {
          'User-Agent': 'Biprova/1.0 (https://biprova.com)',
          'Accept-Language': 'tr,en',
        },
        next: { revalidate: 86400 }, // 24 saat cache
      }
    );

    if (!response.ok) return null;

    const results: NominatimResult[] = await response.json();

    if (!results.length) return null;

    const { lat, lon } = results[0];
    return { lat: parseFloat(lat), lng: parseFloat(lon) };
  } catch {
    return null;
  }
}

/**
 * PostGIS geography formatına çevirir: ST_Point(lng, lat)
 * Supabase insert'te kullanılır.
 */
export function toGeoPoint(point: GeoPoint): string {
  return `SRID=4326;POINT(${point.lng} ${point.lat})`;
}
