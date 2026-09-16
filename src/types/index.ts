// ─── MBTI Type identifiers ────────────────────────────────────────────────────
export type MBTITypeCode =
  | 'INTJ' | 'INTP' | 'ENTJ' | 'ENTP'
  | 'INFJ' | 'INFP' | 'ENFJ' | 'ENFP'
  | 'ISTJ' | 'ISFJ' | 'ESTJ' | 'ESFJ'
  | 'ISTP' | 'ISFP' | 'ESTP' | 'ESFP';

export type MBTICategory = 'Analysts' | 'Diplomats' | 'Sentinels' | 'Explorers';

// ─── Profile ──────────────────────────────────────────────────────────────────
export interface MBTIProfile {
  type: MBTITypeCode;
  name: string;
  tagline: string;
  category: MBTICategory;
  description: string;
  cognitiveStyle: string;
  communicationStyle: string;
  problemSolvingStyle: string;
  decisionStyle: string;
  strengths: string[];
  blindSpots: string[];
  recommendedSkills: SkillId[];
  examplePrompt: string;
  exampleInteractions: ExampleInteraction[];
  tags: string[];
  color: string;         // Tailwind color class base, e.g. 'cyan'
  gradient: string;      // CSS gradient string
}

export interface ExampleInteraction {
  problem: string;
  approach: string[];
  response: string;
}

// ─── Skills ───────────────────────────────────────────────────────────────────
export type SkillId =
  | 'analytical'
  | 'tactical'
  | 'strategic'
  | 'brainstorming'
  | 'troubleshooting'
  | 'creative'
  | 'empathy'
  | 'structured'
  | 'experimental'
  | 'debate'
  | 'optimization'
  | 'research';

export interface Skill {
  id: SkillId;
  name: string;
  icon: string;           // lucide icon name
  description: string;
  shortDescription: string;
  behaviors: string[];
  tags: string[];
  compatibleProfiles: MBTITypeCode[];
  color: string;
}

// ─── User / Builder ───────────────────────────────────────────────────────────
export interface SkillIntensity {
  skillId: SkillId;
  intensity: number;      // 0–100
}

export interface UserProfile {
  id: string;
  name: string;
  baseType: MBTITypeCode;
  skills: SkillIntensity[];
  communicationPreference?: string;
  customInstructions?: string;
  createdAt: string;
}

// ─── Comparison ───────────────────────────────────────────────────────────────
export interface ComparisonPanel {
  profileType: MBTITypeCode;
  problem: string;
  approach: string[];
  simulatedResponse: string;
}

// ─── AI Provider (future) ────────────────────────────────────────────────────
export type AIProviderType = 'mock' | 'openai' | 'anthropic' | 'gemini' | 'openrouter' | 'local';

export interface AIProvider {
  type: AIProviderType;
  name: string;
  generate(systemPrompt: string, userMessage: string): Promise<string>;
}

// ─── Example Problems ─────────────────────────────────────────────────────────
export interface ExampleProblem {
  id: string;
  category: string;
  title: string;
  description: string;
}

// ─── Store State ──────────────────────────────────────────────────────────────
export interface AppState {
  savedProfiles: UserProfile[];
  builderProfile: Partial<UserProfile>;
  selectedComparisons: MBTITypeCode[];
  compareQuestion: string;
  labQuestion: string;
  labBaseType: MBTITypeCode | null;
  labSkills: SkillIntensity[];
}
