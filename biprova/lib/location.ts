export interface GeoPoint {
  lat: number;
  lng: number;
}

export type LocationError =
  | 'permission_denied'
  | 'unavailable'
  | 'timeout'
  | 'unsupported';

export interface LocationResult {
  point: GeoPoint | null;
  city: string | null;
  error: LocationError | null;
}

interface NominatimReverseResult {
  address?: {
    city?: string;
    town?: string;
    county?: string;
    province?: string;
  };
}

/**
 * Koordinatı şehir adına çevirir (Nominatim / OpenStreetMap).
 * Fallback sırası: city → town → county → province
 */
async function reverseGeocode(lat: number, lng: number): Promise<string | null> {
  try {
    const params = new URLSearchParams({
      lat: String(lat),
      lon: String(lng),
      format: 'json',
      zoom: '10',
      addressdetails: '1',
    });

    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?${params}`,
      {
        headers: {
          'User-Agent': 'Biprova/1.0 (https://biprova.com)',
          'Accept-Language': 'tr,en',
        },
      }
    );

    if (!response.ok) return null;

    const result: NominatimReverseResult = await response.json();
    const addr = result.address;
    if (!addr) return null;

    return addr.city ?? addr.town ?? addr.county ?? addr.province ?? null;
  } catch {
    return null;
  }
}

/**
 * Kullanıcının konumunu ve şehrini alır.
 * - Native Capacitor build'de → @capacitor/geolocation (GPS)
 * - Web tarayıcısında → navigator.geolocation
 * Her iki durumda da izin popup'ı otomatik gösterilir.
 */
export async function getUserLocation(): Promise<LocationResult> {
  try {
    const isNative = await checkIsNative();
    const coordsResult = isNative
      ? await getNativeLocation()
      : await getWebLocation();

    if (coordsResult.error || !coordsResult.point) {
      return { point: null, city: null, error: coordsResult.error };
    }

    const city = await reverseGeocode(
      coordsResult.point.lat,
      coordsResult.point.lng
    );

    return { point: coordsResult.point, city, error: null };
  } catch {
    return { point: null, city: null, error: 'unavailable' };
  }
}

async function checkIsNative(): Promise<boolean> {
  try {
    const { Capacitor } = await import('@capacitor/core');
    return Capacitor.isNativePlatform();
  } catch {
    return false;
  }
}

async function getNativeLocation(): Promise<Omit<LocationResult, 'city'>> {
  const { Geolocation } = await import('@capacitor/geolocation');

  const permission = await Geolocation.requestPermissions();
  if (permission.location !== 'granted') {
    return { point: null, error: 'permission_denied' };
  }

  const position = await Geolocation.getCurrentPosition({
    enableHighAccuracy: true,
    timeout: 10000,
  });

  return {
    point: {
      lat: position.coords.latitude,
      lng: position.coords.longitude,
    },
    error: null,
  };
}

function getWebLocation(): Promise<Omit<LocationResult, 'city'>> {
  return new Promise((resolve) => {
    if (!navigator?.geolocation) {
      resolve({ point: null, error: 'unsupported' });
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          point: {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          },
          error: null,
        });
      },
      (err) => {
        const error: LocationError =
          err.code === err.PERMISSION_DENIED
            ? 'permission_denied'
            : err.code === err.TIMEOUT
            ? 'timeout'
            : 'unavailable';
        resolve({ point: null, error });
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 60_000 }
    );
  });
}
