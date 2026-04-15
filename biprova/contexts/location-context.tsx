"use client";

import { createContext, useContext, useState } from "react";

interface LocationCoords {
  lat: number;
  lng: number;
}

interface LocationContextValue {
  locationOn: boolean;
  coords: LocationCoords | null;
  city: string | null;
  setLocation: (lat: number, lng: number, city: string | null) => void;
  clearLocation: () => void;
}

const LocationContext = createContext<LocationContextValue | null>(null);

export function LocationProvider({ children }: { children: React.ReactNode }) {
  const [coords, setCoords] = useState<LocationCoords | null>(null);
  const [city, setCity] = useState<string | null>(null);

  function setLocation(lat: number, lng: number, city: string | null) {
    setCoords({ lat, lng });
    setCity(city);
  }

  function clearLocation() {
    setCoords(null);
    setCity(null);
  }

  return (
    <LocationContext.Provider
      value={{ locationOn: coords !== null, coords, city, setLocation, clearLocation }}
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
