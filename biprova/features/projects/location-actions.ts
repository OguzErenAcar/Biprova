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
