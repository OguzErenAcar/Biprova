"use server";

import { cookies } from "next/headers";

export async function setLocationFilter(lat: number, lng: number): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set("location-filter", `nearby:${lat}:${lng}`, {
    path: "/",
    maxAge: 60 * 60,
    sameSite: "lax",
  });
}

export async function clearLocationFilter(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete("location-filter");
}

export function parseLocationCookie(value: string | undefined): { lat: number; lng: number } | null {
  if (!value?.startsWith("nearby:")) return null;
  const parts = value.split(":");
  if (parts.length !== 3) return null;
  const lat = parseFloat(parts[1]);
  const lng = parseFloat(parts[2]);
  if (isNaN(lat) || isNaN(lng)) return null;
  return { lat, lng };
}
