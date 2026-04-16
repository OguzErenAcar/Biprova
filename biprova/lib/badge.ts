import type { SupabaseClient } from '@supabase/supabase-js';

/**
 * badges tablosundan badge_name listesine karşılık gelen image_url'leri toplu çeker.
 * Dönüş: Map<badge_name, image_url>
 */
export async function resolveBadgeUrls(
  supabase: SupabaseClient,
  badgeNames: (string | null | undefined)[],
): Promise<Map<string, string>> {
  const names = [...new Set(badgeNames.filter((n): n is string => !!n))];
  if (names.length === 0) return new Map();

  const { data, error } = await supabase
    .from('badges')
    .select('badge_name, image_url')
    .in('badge_name', names)
    .limit(100);

  // DEBUG — remove after badge investigation
  console.log('[resolveBadgeUrls] names:', names, 'data:', data, 'error:', error);

  return new Map((data ?? []).map((b: { badge_name: string; image_url: string }) => [b.badge_name, b.image_url]));
}
