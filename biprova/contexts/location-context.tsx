"use client";

import { createContext, useContext, useState } from "react";

interface LocationCoords {
  lat: number;
  lng: number;
}

type LocationStatus = "idle" | "loading" | "granted" | "denied";

interface LocationContextValue {
  locationOn: boolean;
  coords: LocationCoords | null;
  city: string | null;
  status: LocationStatus;
  requestLocation: () => void;
  clearLocation: () => void;
}

const LocationContext = createContext<LocationContextValue | null>(null);

async function reverseGeocode(lat: number, lng: number): Promise<string | null> {
  const res = await fetch(
    `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`,
    { headers: { "Accept-Language": "tr" } }
  );
  if (!res.ok) return null;
  const data = await res.json();
  return data.address?.province ?? data.address?.city ?? data.address?.state ?? null;
}

export function LocationProvider({ children }: { children: React.ReactNode }) {
  const [coords, setCoords] = useState<LocationCoords | null>(null);
  const [city, setCity] = useState<string | null>(null);
  const [status, setStatus] = useState<LocationStatus>("idle");

  function requestLocation() {
    if (!navigator.geolocation) {
      setStatus("denied");
      return;
    }

    setStatus("loading");

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude: lat, longitude: lng } = position.coords;
        setCoords({ lat, lng });
        setStatus("granted");
        const resolvedCity = await reverseGeocode(lat, lng);
        setCity(resolvedCity);
      },
      () => {
        setStatus("denied");
      }
    );
  }

  function clearLocation() {
    setCoords(null);
    setCity(null);
    setStatus("idle");
  }

  return (
    <LocationContext.Provider
      value={{ locationOn: coords !== null, coords, city, status, requestLocation, clearLocation }}
    >
      {children}
    </LocationContext.Provider>
  );
}

export function useLocation(): LocationContextValue {
  const ctx = useContext(LocationContext);
  if (!ctx) throw new Error("useLocation must be used within LocationProvider");
  return ctx;
}
