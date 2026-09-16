import type { UserProfile } from '../types';

// ─── Encode a UserProfile into a URL-safe base64 string ─────────────────────

export function encodeProfile(profile: Partial<UserProfile>): string {
  try {
    const json = JSON.stringify(profile);
    // btoa works with ASCII; handle unicode via encodeURIComponent
    return btoa(encodeURIComponent(json));
  } catch {
    return '';
  }
}

// ─── Decode a base64 string back into a UserProfile ──────────────────────────

export function decodeProfile(encoded: string): Partial<UserProfile> | null {
  try {
    const json = decodeURIComponent(atob(encoded));
    const parsed = JSON.parse(json) as Partial<UserProfile>;
    // Basic validation
    if (!parsed.baseType) return null;
    return parsed;
  } catch {
    return null;
  }
}

// ─── Build a shareable URL for a profile ─────────────────────────────────────

export function buildShareUrl(profile: Partial<UserProfile>): string {
  const encoded = encodeProfile(profile);
  if (!encoded) return window.location.href;
  const url = new URL(window.location.href);
  url.pathname = `${import.meta.env.BASE_URL}builder`.replace('//', '/');
  url.search = '';
  url.searchParams.set('profile', encoded);
  return url.toString();
}

// ─── Read profile from current URL ───────────────────────────────────────────

export function readProfileFromUrl(): Partial<UserProfile> | null {
  const params = new URLSearchParams(window.location.search);
  const encoded = params.get('profile');
  if (!encoded) return null;
  return decodeProfile(encoded);
}

// ─── Export profile as JSON string ───────────────────────────────────────────

export function exportProfileJson(profile: Partial<UserProfile>): string {
  return JSON.stringify(
    {
      name: profile.name || 'My AI Configuration',
      baseType: profile.baseType,
      skills: (profile.skills || []).map((s) => ({
        id: s.skillId,
        intensity: s.intensity,
      })),
      communicationPreference: profile.communicationPreference || undefined,
      customInstructions: profile.customInstructions || undefined,
      exportedAt: new Date().toISOString(),
      schema: 'mbti-ai-skills/v1',
    },
    null,
    2
  );
}

// ─── Import profile from JSON ─────────────────────────────────────────────────

export function importProfileJson(json: string): Partial<UserProfile> | null {
  try {
    const data = JSON.parse(json);
    if (!data.baseType) return null;
    return {
      baseType: data.baseType,
      name: data.name,
      skills: (data.skills || []).map((s: { id: string; intensity: number }) => ({
        skillId: s.id,
        intensity: s.intensity ?? 80,
      })),
      communicationPreference: data.communicationPreference,
      customInstructions: data.customInstructions,
    };
  } catch {
    return null;
  }
}
