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

// ─── Communication Styles ─────────────────────────────────────────────────────
export type CommunicationStyle =
  | 'Concise'
  | 'Balanced'
  | 'Detailed'
  | 'Technical'
  | 'Simple'
  | 'Socratic'
  | 'Direct'
  | 'Exploratory';

// ─── Cognitive Profile (First-Class Concept) ──────────────────────────────────
export interface SkillConfiguration {
  skillId: SkillId;
  intensity: number;      // Validated 0–100
}

// Alias for backward compatibility
export type SkillIntensity = SkillConfiguration;

export interface CognitiveProfile {
  id: string;
  version?: number;
  name: string;
  baseType: MBTITypeCode;
  skills: SkillConfiguration[];
  communicationStyle?: CommunicationStyle | string;
  communicationPreference?: string; // backward compat
  customInstructions?: string;
  createdAt: string;
}

// Alias for backward compatibility
export type UserProfile = CognitiveProfile;

// ─── Comparison Item (MBTI type OR Custom Cognitive Profile) ──────────────────
export interface ComparisonTarget {
  id: string;
  label: string;
  isCustom: boolean;
  baseType: MBTITypeCode;
  skills: SkillConfiguration[];
  communicationStyle?: string;
  customInstructions?: string;
}

export interface ComparisonPanel {
  targetId: string;
  profileType: MBTITypeCode;
  label: string;
  problem: string;
  approach: string[];
  simulatedResponse: string;
  dominantSkills: string[];
}

// ─── AI Provider ─────────────────────────────────────────────────────────────
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
  version: number;
  savedProfiles: CognitiveProfile[];
  builderProfile: Partial<CognitiveProfile>;
  selectedComparisons: string[]; // IDs: can be MBTITypeCode or custom profile ID
  compareQuestion: string;
  labQuestion: string;
  labBaseType: MBTITypeCode | null;
  labSkills: SkillConfiguration[];
  labCommunicationStyle?: CommunicationStyle | string;
}
