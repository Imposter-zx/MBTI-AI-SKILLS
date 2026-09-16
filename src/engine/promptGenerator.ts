import type { CognitiveProfile, SkillConfiguration, CommunicationStyle } from '../types';
import { skillsById } from '../data/skills';
import { profilesByType } from '../data/mbtiProfiles';

// ─── Intensity Transformation ────────────────────────────────────────────────

export interface IntensityTier {
  label: string;
  adverb: string;
  directiveTemplate: (behavior: string) => string;
}

export function clampIntensity(value: number): number {
  if (isNaN(value)) return 0;
  return Math.max(0, Math.min(100, Math.round(value)));
}

export function getIntensityTier(intensity: number): IntensityTier {
  const clamped = clampIntensity(intensity);

  if (clamped >= 90) {
    return {
      label: 'Core Driver (90–100%)',
      adverb: 'strongly prioritize',
      directiveTemplate: (behavior: string) => `Strongly prioritize ${behavior.toLowerCase()}`,
    };
  }
  if (clamped >= 60) {
    return {
      label: 'Active Modifier (60–89%)',
      adverb: 'regularly use',
      directiveTemplate: (behavior: string) => `Regularly use ${behavior.toLowerCase()}`,
    };
  }
  if (clamped >= 30) {
    return {
      label: 'Situational (30–59%)',
      adverb: 'consider when useful',
      directiveTemplate: (behavior: string) => `Consider ${behavior.toLowerCase()} when useful`,
    };
  }
  return {
    label: 'Minimal (0–29%)',
    adverb: 'use only when appropriate',
    directiveTemplate: (behavior: string) => `Use ${behavior.toLowerCase()} only when strictly appropriate`,
  };
}

// ─── Communication Style Guidance ────────────────────────────────────────────

export const communicationStyleDescriptions: Record<CommunicationStyle, string> = {
  Concise: 'Deliver terse, high-signal responses. Eliminate superfluous framing, filler, and repetitive summaries.',
  Balanced: 'Provide thorough explanations balanced with clear, direct takeaways.',
  Detailed: 'Provide comprehensive, deep-dive explanations covering underlying context, edge cases, and nuances.',
  Technical: 'Use precise technical terminology, formal architectural descriptions, and structured code/pseudocode.',
  Simple: 'Explain concepts plainly with accessible analogies, avoiding jargon where everyday language suffices.',
  Socratic: 'Engage through structured questions that prompt the user to examine premises and derive insights.',
  Direct: 'Be blunt, actionable, and bottom-line focused. State findings immediately before supporting rationale.',
  Exploratory: 'Examine multiple angles, embrace creative tangents, and present diverse perspectives before converging.',
};

// ─── Name & Workflow Derivation ──────────────────────────────────────────────

export function generateCognitiveProfileName(
  baseType?: string,
  skills: SkillConfiguration[] = []
): string {
  if (!baseType) return 'Custom Cognitive Profile';
  const profile = profilesByType[baseType];

  const dominant = [...skills]
    .map((s) => ({ ...s, intensity: clampIntensity(s.intensity) }))
    .sort((a, b) => b.intensity - a.intensity)
    .filter((s) => s.intensity >= 40)
    .slice(0, 3)
    .map((s) => skillsById[s.skillId]?.name)
    .filter(Boolean);

  if (dominant.length === 0) {
    return `${baseType} ${profile?.name ?? 'Mind'} AI`;
  }

  return `${dominant.join(' ')} AI`;
}

export function deriveProblemSolvingWorkflow(profile: Partial<CognitiveProfile>): string[] {
  const { baseType, skills = [] } = profile;
  const steps: string[] = ['Understand the user objective and constraints'];

  const sortedSkills = [...skills]
    .map((s) => ({ ...s, intensity: clampIntensity(s.intensity) }))
    .sort((a, b) => b.intensity - a.intensity)
    .filter((s) => s.intensity >= 30);

  const activeIds = new Set(sortedSkills.map((s) => s.skillId));

  if (activeIds.has('analytical')) {
    steps.push('Decompose the problem into logical primitives and dependencies');
    steps.push('Expose unstated premises and examine underlying assumptions');
  } else if (baseType && ['INTP', 'INTJ', 'ENTP'].includes(baseType)) {
    steps.push('Deconstruct the system architecture and state assumptions');
  }

  if (activeIds.has('brainstorming')) {
    steps.push('Expand the solution space with unconventional alternative approaches');
  }

  if (activeIds.has('debate')) {
    steps.push('Pressure-test competing hypotheses and construct counterarguments');
  }

  if (activeIds.has('research')) {
    steps.push('Separate empirically verified facts from theoretical speculation');
  }

  if (activeIds.has('troubleshooting')) {
    steps.push('Isolate root causes and establish a minimal reproduction path');
  }

  if (activeIds.has('experimental')) {
    steps.push('Formulate testable hypotheses and design small verification probes');
  }

  if (activeIds.has('optimization')) {
    steps.push('Identify bottlenecks and evaluate trade-offs across speed, simplicity, and scale');
  }

  if (activeIds.has('tactical')) {
    steps.push('Formulate immediate, concrete, hands-on action steps');
  }

  if (activeIds.has('empathy')) {
    steps.push('Calibrate the response for human impact, emotional context, and clarity');
  }

  if (activeIds.has('structured')) {
    steps.push('Format final solution into a structured, verifiable checklist');
  } else {
    steps.push('Present a reasoned, actionable conclusion');
  }

  return steps;
}

export function describeCognitiveBehavior(profile: Partial<CognitiveProfile>): string {
  const { baseType, skills = [], communicationStyle } = profile;
  if (!baseType) return 'Select a base profile to inspect cognitive behavior.';

  const mbti = profilesByType[baseType];
  const sortedSkills = [...skills]
    .map((s) => ({ ...s, intensity: clampIntensity(s.intensity) }))
    .sort((a, b) => b.intensity - a.intensity);

  const dominant = sortedSkills.filter((s) => s.intensity >= 60);

  let desc = `This configuration builds upon an experimental ${baseType}-inspired cognitive foundation (${mbti?.name ?? baseType}), which inherently emphasizes ${mbti?.cognitiveStyle.toLowerCase() ?? 'structured reasoning'}. `;

  if (dominant.length > 0) {
    const dominantNames = dominant
      .map((s) => `${skillsById[s.skillId]?.name} (${s.intensity}%)`)
      .join(', ');
    desc += `It is strongly shaped by dominant skills: ${dominantNames}, ensuring solutions are rigorously driven by these cognitive directives. `;
  } else {
    desc += 'It operates primarily from base cognitive preferences without dominant skill overrides. ';
  }

  if (communicationStyle && communicationStyle in communicationStyleDescriptions) {
    desc += `Responses are calibrated in a ${communicationStyle.toLowerCase()} manner: ${communicationStyleDescriptions[communicationStyle as CommunicationStyle]}.`;
  }

  return desc;
}

// ─── Main System Prompt Generator ────────────────────────────────────────────

export function generateSystemPrompt(profile: Partial<CognitiveProfile>): string {
  const {
    baseType,
    skills = [],
    name,
    communicationStyle,
    communicationPreference,
    customInstructions,
  } = profile;

  if (!baseType) return '// No base profile selected yet.';

  const mbtiProfile = profilesByType[baseType];
  if (!mbtiProfile) return '// Invalid base profile.';

  const profileName = name || generateCognitiveProfileName(baseType, skills);
  const commStyle = (communicationStyle || communicationPreference || 'Balanced') as CommunicationStyle;
  const commDescription =
    communicationStyleDescriptions[commStyle] ||
    (typeof commStyle === 'string' ? commStyle : 'Balanced and clear communication.');

  // Sort and clamp skills
  const sortedSkills = [...skills]
    .map((s) => ({ ...s, intensity: clampIntensity(s.intensity) }))
    .sort((a, b) => b.intensity - a.intensity);

  // Active skills breakdown with actual intensity tiers
  const activeSkillSections = sortedSkills
    .map((si) => {
      const skill = skillsById[si.skillId];
      if (!skill) return '';

      const tier = getIntensityTier(si.intensity);
      const behaviors = skill.behaviors
        .slice(0, si.intensity >= 60 ? skill.behaviors.length : 3)
        .map((b) => `  - ${tier.directiveTemplate(b)}`)
        .join('\n');

      return `### ${skill.name} Skill — ${si.intensity}% [${tier.label}]\n${behaviors}`;
    })
    .filter(Boolean)
    .join('\n\n');

  const workflowSteps = deriveProblemSolvingWorkflow(profile)
    .map((step, idx) => `${idx + 1}. ${step}`)
    .join('\n');

  const customSection = customInstructions?.trim()
    ? `\n## User Custom Instructions\n\n${customInstructions.trim()}\n`
    : '';

  return `# AI Cognitive Profile: ${profileName}
# Framework: MBTI AI Skills (Open Source) — https://github.com/Imposter-zx/MBTI-AI-SKILLS
# ─────────────────────────────────────────────────────────────────────────────

You are an AI configured with an experimental ${baseType}-inspired Cognitive Profile.

> IMPORTANT PHILOSOPHICAL NOTICE:
> This configuration is an experimental interaction design pattern inspired by commonly described MBTI preferences.
> It is NOT a scientific psychological diagnosis, nor does it make determinative claims about human personality, intelligence, or fixed capabilities.
> All cognitive styles and behaviors herein are configurable software interaction patterns.

## Base Profile: ${baseType} (${mbtiProfile.name})

- Category: ${mbtiProfile.category} — ${mbtiProfile.tagline}
- Cognitive Style: ${mbtiProfile.cognitiveStyle}
- Decision Pattern: ${mbtiProfile.decisionStyle}

## Primary Cognitive Priorities

1. Adopt the problem-framing heuristics of an experimental ${baseType}-inspired configuration.
2. Maintain epistemic rigor: explicitly distinguish verified facts from assumptions, analogies, and speculative hypotheses.
3. Never claim that personality dictates objective competence or universal human behavior.

## Active Cognitive Skills & Weighted Intensities

${activeSkillSections || 'Operating with base profile cognitive defaults (no secondary skills configured).'}

## Communication Style & Tone

- Style: ${commStyle}
- Directives: ${commDescription}

## Problem-Solving Workflow

When analyzing questions, requests, or complex engineering challenges, execute the following trajectory:

${workflowSteps}
${customSection}
# ─────────────────────────────────────────────────────────────────────────────
# End of System Prompt`;
}

// ─── Token Estimator ─────────────────────────────────────────────────────────

export function estimateTokens(text: string): number {
  return Math.ceil(text.length / 4);
}
