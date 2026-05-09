const STORAGE_KEY = 'biprova_muted_teams';
export const MUTE_EVENT = 'biprova_mute_change';

function read(): Set<string> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return new Set(raw ? (JSON.parse(raw) as string[]) : []);
  } catch {
    return new Set();
  }
}

export function isTeamMuted(teamId: string): boolean {
  if (typeof window === 'undefined') return false;
  return read().has(teamId);
}

export function toggleTeamMute(teamId: string): boolean {
  const muted = read();
  if (muted.has(teamId)) muted.delete(teamId);
  else muted.add(teamId);
  localStorage.setItem(STORAGE_KEY, JSON.stringify([...muted]));
  window.dispatchEvent(new CustomEvent(MUTE_EVENT));
  return muted.has(teamId);
}

export function getMutedTeams(): Set<string> {
  if (typeof window === 'undefined') return new Set();
  return read();
}
