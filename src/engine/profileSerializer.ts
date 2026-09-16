import type {
  CognitiveProfile,
  MBTITypeCode,
  SkillConfiguration,
  SkillId,
} from '../types';
import { clampIntensity } from './promptGenerator';
import { skillsById } from '../data/skills';

const VALID_MBTI_TYPES = new Set<string>([
  'INTJ', 'INTP', 'ENTJ', 'ENTP',
  'INFJ', 'INFP', 'ENFJ', 'ENFP',
  'ISTJ', 'ISFJ', 'ESTJ', 'ESFJ',
  'ISTP', 'ISFP', 'ESTP', 'ESFP',
]);

// ─── Sanitization & Validation ────────────────────────────────────────────────

export interface ValidationResult {
  valid: boolean;
  profile?: Partial<CognitiveProfile>;
  error?: string;
}

export function validateAndSanitizeProfile(raw: unknown): ValidationResult {
  if (!raw || typeof raw !== 'object') {
    return { valid: false, error: 'Invalid profile data: expected an object.' };
  }

  const obj = raw as Record<string, unknown>;

  // Validate baseType
  if (!obj.baseType || typeof obj.baseType !== 'string') {
    return { valid: false, error: 'Missing baseType in profile.' };
  }

  const baseTypeUpper = obj.baseType.toUpperCase();
  if (!VALID_MBTI_TYPES.has(baseTypeUpper)) {
    return {
      valid: false,
      error: `Invalid baseType "${obj.baseType}". Must be one of the 16 MBTI types.`,
    };
  }

  const baseType = baseTypeUpper as MBTITypeCode;

  // Validate skills array
  const rawSkills = Array.isArray(obj.skills) ? obj.skills : [];
  const skills: SkillConfiguration[] = [];

  for (const item of rawSkills) {
    if (!item || typeof item !== 'object') continue;
    const sObj = item as Record<string, unknown>;
    const rawId = sObj.skillId || sObj.id;

    if (typeof rawId === 'string') {
      const skillId = rawId.toLowerCase() as SkillId;
      if (skillsById[skillId]) {
        const rawIntensity = typeof sObj.intensity === 'number' ? sObj.intensity : 80;
        skills.push({
          skillId,
          intensity: clampIntensity(rawIntensity),
        });
      }
    }
  }

  // Name
  const name = typeof obj.name === 'string' && obj.name.trim()
    ? obj.name.trim().slice(0, 100)
    : undefined;

  // Communication style
  const commStyle = typeof obj.communicationStyle === 'string'
    ? obj.communicationStyle.trim()
    : typeof obj.communicationPreference === 'string'
    ? obj.communicationPreference.trim()
    : undefined;

  // Custom instructions
  const customInstructions = typeof obj.customInstructions === 'string'
    ? obj.customInstructions.trim().slice(0, 2000)
    : undefined;

  return {
    valid: true,
    profile: {
      id: typeof obj.id === 'string' ? obj.id : undefined,
      version: 1,
      name,
      baseType,
      skills,
      communicationStyle: commStyle,
      communicationPreference: commStyle,
      customInstructions,
      createdAt: typeof obj.createdAt === 'string' ? obj.createdAt : new Date().toISOString(),
    },
  };
}

// ─── Encode a CognitiveProfile into a URL-safe base64 string ─────────────────

export function encodeProfile(profile: Partial<CognitiveProfile>): string {
  try {
    const sanitized = validateAndSanitizeProfile(profile);
    if (!sanitized.valid || !sanitized.profile) return '';

    const payload = {
      v: 1,
      b: sanitized.profile.baseType,
      n: sanitized.profile.name,
      s: (sanitized.profile.skills || []).map((sk) => [sk.skillId, sk.intensity]),
      c: sanitized.profile.communicationStyle,
      i: sanitized.profile.customInstructions,
    };

    const json = JSON.stringify(payload);
    return btoa(encodeURIComponent(json));
  } catch {
    return '';
  }
}

// ─── Decode a base64 string back into a CognitiveProfile ──────────────────────

export function decodeProfile(encoded: string): Partial<CognitiveProfile> | null {
  try {
    const json = decodeURIComponent(atob(encoded));
    const parsed = JSON.parse(json);

    // Support both compact format (v1) and legacy format
    if (parsed.v === 1 && parsed.b) {
      const skills: SkillConfiguration[] = (parsed.s || []).map((tuple: [string, number]) => ({
        skillId: tuple[0] as SkillId,
        intensity: clampIntensity(tuple[1]),
      }));

      const res = validateAndSanitizeProfile({
        baseType: parsed.b,
        name: parsed.n,
        skills,
        communicationStyle: parsed.c,
        customInstructions: parsed.i,
      });

      return res.valid ? res.profile ?? null : null;
    }

    // Legacy format fallback
    const legacyRes = validateAndSanitizeProfile(parsed);
    return legacyRes.valid ? legacyRes.profile ?? null : null;
  } catch {
    return null;
  }
}

// ─── Build a shareable URL for a profile ─────────────────────────────────────

export function buildShareUrl(profile: Partial<CognitiveProfile>): string {
  const encoded = encodeProfile(profile);
  if (!encoded) return window.location.href;
  const url = new URL(window.location.href);
  url.pathname = `${import.meta.env.BASE_URL}builder`.replace('//', '/');
  url.search = '';
  url.searchParams.set('profile', encoded);
  return url.toString();
}

// ─── Read profile from current URL ───────────────────────────────────────────

export function readProfileFromUrl(): {
  profile: Partial<CognitiveProfile> | null;
  error?: string;
} {
  try {
    const params = new URLSearchParams(window.location.search);
    const encoded = params.get('profile');
    if (!encoded) return { profile: null };

    const decoded = decodeProfile(encoded);
    if (!decoded) {
      return {
        profile: null,
        error: 'The shared profile link is invalid or corrupted. Starting with a blank configuration.',
      };
    }

    return { profile: decoded };
  } catch {
    return {
      profile: null,
      error: 'Failed to read profile link. Starting with a blank configuration.',
    };
  }
}

// ─── Export profile as JSON string ───────────────────────────────────────────

export function exportProfileJson(profile: Partial<CognitiveProfile>): string {
  const sanitized = validateAndSanitizeProfile(profile);
  const p = sanitized.profile || profile;

  return JSON.stringify(
    {
      version: 1,
      schema: 'mbti-ai-skills/v1.1',
      name: p.name || `${p.baseType} Cognitive Profile`,
      baseType: p.baseType,
      skills: (p.skills || []).map((s) => ({
        skillId: s.skillId,
        intensity: clampIntensity(s.intensity),
      })),
      communicationStyle: p.communicationStyle || 'Balanced',
      customInstructions: p.customInstructions || undefined,
      exportedAt: new Date().toISOString(),
    },
    null,
    2
  );
}

// ─── Import profile from JSON ─────────────────────────────────────────────────

export function importProfileJson(json: string): {
  success: boolean;
  profile?: Partial<CognitiveProfile>;
  error?: string;
} {
  try {
    const data = JSON.parse(json);
    const validated = validateAndSanitizeProfile(data);

    if (!validated.valid) {
      return { success: false, error: validated.error || 'Invalid profile schema.' };
    }

    return { success: true, profile: validated.profile };
  } catch {
    return { success: false, error: 'Malformed JSON string. Please verify the syntax.' };
  }
}
