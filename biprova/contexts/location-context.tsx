"use client";

import { createContext, useContext, useState } from "react";

interface LocationCoords {
  lat: number;
  lng: number;
}

interface LocationContextValue {
  locationOn: boolean;
  coords: LocationCoords | null;
  setLocation: (lat: number, lng: number) => void;
  clearLocation: () => void;
}

const LocationContext = createContext<LocationContextValue | null>(null);

export function LocationProvider({ children }: { children: React.ReactNode }) {
  const [coords, setCoords] = useState<LocationCoords | null>(null);

  function setLocation(lat: number, lng: number) {
    setCoords({ lat, lng });
  }

  function clearLocation() {
    setCoords(null);
  }

  return (
    <LocationContext.Provider
      value={{ locationOn: coords !== null, coords, setLocation, clearLocation }}
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
