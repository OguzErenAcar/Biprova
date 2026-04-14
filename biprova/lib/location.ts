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
  error: LocationError | null;
}

/**
 * Kullanıcının konumunu alır.
 * - Native Capacitor build'de → @capacitor/geolocation (GPS)
 * - Web tarayıcısında → navigator.geolocation
 * Her iki durumda da izin popup'ı otomatik gösterilir.
 */
export async function getUserLocation(): Promise<LocationResult> {
  try {
    const isNative = await checkIsNative();

    if (isNative) {
      return await getNativeLocation();
    }

    return await getWebLocation();
  } catch {
    return { point: null, error: 'unavailable' };
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

async function getNativeLocation(): Promise<LocationResult> {
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

function getWebLocation(): Promise<LocationResult> {
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
