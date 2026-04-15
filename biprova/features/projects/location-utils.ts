export function parseLocationCookie(value: string | undefined): { lat: number; lng: number } | null {
  if (!value?.startsWith("nearby:")) return null;
  const parts = value.split(":");
  if (parts.length !== 3) return null;
  const lat = parseFloat(parts[1]);
  const lng = parseFloat(parts[2]);
  if (isNaN(lat) || isNaN(lng)) return null;
  return { lat, lng };
}
