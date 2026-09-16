import type {
  MBTITypeCode,
  SkillConfiguration,
  CognitiveProfile,
  ComparisonTarget,
  ComparisonPanel,
} from '../types';
import { profilesByType } from '../data/mbtiProfiles';
import { skillsById } from '../data/skills';
import { clampIntensity, deriveProblemSolvingWorkflow } from './promptGenerator';

// ─── Simulate AI responses based on Cognitive Profile ────────────────────────

export interface SimulationOptions {
  baseType: MBTITypeCode;
  skills?: SkillConfiguration[];
  communicationStyle?: string;
  customInstructions?: string;
  question: string;
}

// Pattern-based response templates per skill
const skillResponsePrefixes: Record<string, string[]> = {
  analytical: [
    "Let's decompose this problem into logical components.",
    'First, examine the underlying premises and component layers.',
    "Let's break this down into logical dependencies.",
    'The key assumptions in this setup are worth isolating.',
  ],
  tactical: [
    "Here is the immediate practical sequence to execute:",
    "Cutting past abstraction — here is what to do on the ground:",
    'The concrete action items for rapid resolution are:',
    "Let's focus on the exact point of implementation:",
  ],
  strategic: [
    "Before executing, let's anchor the long-term objective and map dependencies.",
    'Examining this from a systemic architecture perspective:',
    'A multi-stage strategic roadmap is required here:',
    "Let's establish strategic objectives before choosing tools:",
  ],
  brainstorming: [
    'Let me generate a divergent space of possibilities:',
    'Here are several unconventional alternative angles worth considering:',
    'Instead of the standard textbook approach, consider these ideas:',
    "Let's expand the conceptual search space before narrowing:",
  ],
  troubleshooting: [
    "Let's systematically diagnose this symptom vs. root cause.",
    'First, isolate variables to find the exact failure point.',
    'The diagnostic procedure should follow a reproduction path:',
    "Let's construct a minimal reproducible verification path:",
  ],
  creative: [
    'Let me approach this from an unexpected generative angle.',
    'What if we invert the problem constraints entirely?',
    'An unconventional connection that unlocks a new pathway:',
    'Reframing this constraint as an asset reveals:',
  ],
  empathy: [
    "Before jumping into execution, let's recognize the human and team context.",
    'This is a complex challenge with interpersonal dynamics that matter.',
    'Considering the user experience and communication impact:',
    "Let's ensure the solution aligns with the people who have to live with it.",
  ],
  structured: [
    'Here is the structured checklist and systematic execution procedure:',
    'Following a verified, step-by-step protocol:',
    "Let's organize the workflow into clear hierarchical phases:",
    'The standardized process for this:',
  ],
  experimental: [
    "Let's formulate this as an empirical, testable hypothesis.",
    'The scientific approach: construct the smallest valid probe:',
    'Form a clear hypothesis, test against baseline data, and iterate:',
    'What metric gives us the fastest validation signal?',
  ],
  debate: [
    "Let's pressure-test the underlying assumptions of this approach.",
    'A strong counterargument to the conventional consensus:',
    'Before accepting this premise, examine the potential vulnerabilities:',
    'Playing devil\'s advocate against the initial intuition:',
  ],
  optimization: [
    "Let's profile the system to identify the actual bottleneck.",
    'Systematic trade-off analysis across complexity, speed, and cost:',
    'To eliminate redundant computational or operational overhead:',
    'Benchmarking the competing alternatives:',
  ],
  research: [
    "Let's distinguish verified empirical facts from working assumptions.",
    'An evidence-based assessment requires verifying these data points:',
    'Before drawing conclusions, examine what information is missing:',
    'Synthesizing documented precedent and validated research:',
  ],
};

// Type-specific response patterns
const typeResponsePatterns: Record<MBTITypeCode, string[]> = {
  INTJ: [
    'Strategic systems analysis indicates:',
    'From an architectural perspective, the long-term optimal trajectory is:',
    'The systemic failure point and roadmap:',
  ],
  INTP: [
    'Deconstructing the logical structure of this problem:',
    'The underlying model suggests a key hypothesis to test:',
    'Examining the fundamental components and causal dependencies:',
  ],
  ENTJ: [
    'The objective is clear. Here is the decisive execution roadmap:',
    'Define the goal, allocate resources, and eliminate blockers:',
    'The most efficient path to measurable outcome:',
  ],
  ENTP: [
    'Multiple competing models immediately come to light:',
    'The conventional wisdom suggests X, but consider the contrarian alternative Y:',
    'Let us challenge the problem framing and explore divergent angles:',
  ],
  INFJ: [
    'Looking into the deeper systemic and human patterns:',
    'Connecting the holistic purpose with long-range structural design:',
    'Understanding the root implications beyond the surface symptoms:',
  ],
  INFP: [
    'The authentic, values-aligned core of this challenge:',
    'Exploring the human meaning and creative depth beneath the surface:',
    'An imaginative approach that honors core principles:',
  ],
  ENFJ: [
    'How do we align all stakeholders around a shared vision?',
    'Building a collaborative, communicative pathway forward:',
    'Bringing people and systems into structured harmony:',
  ],
  ENFP: [
    'Here is where the genuine innovation potential lies:',
    'Connecting ideas across unexpected domains with creative momentum:',
    'An energizing, possibility-oriented perspective on this problem:',
  ],
  ISTJ: [
    'Applying verified standard operating procedure and rigorous checks:',
    'The methodical, step-by-step audit and verification process:',
    'Verifying each requirement against documented specifications:',
  ],
  ISFJ: [
    'Attending carefully to every operational detail and team need:',
    'The reliable, supportive, step-by-step guidance for this situation:',
    'Ensuring nothing is missed and all stakeholders are supported:',
  ],
  ESTJ: [
    'Establishing clear accountability, performance metrics, and cadence:',
    'The proven execution framework for consistent delivery:',
    'Setting concrete expectations and enforcing systematic standards:',
  ],
  ESFJ: [
    'Organizing community and operational resources for collective clarity:',
    'A supportive, inclusive plan that ensures transparent communication:',
    'Coordinating practical support across the team:',
  ],
  ISTP: [
    'Isolating the physical/mechanical failure point and deploying a concrete fix:',
    'The direct tactical troubleshooting approach:',
    'Reproduce, isolate the variable, test the fix, and verify:',
  ],
  ISFP: [
    'Engaging through direct experimentation and aesthetic nuance:',
    'Exploring concrete variations with authentic attention to detail:',
    'A flexible, hands-on path tuned to real-world experience:',
  ],
  ESTP: [
    'Move fast with immediate situational feedback:',
    'The fastest route to validation: deploy, observe, and adjust:',
    'Tolerating ambiguity to capture real-world performance data now:',
  ],
  ESFP: [
    'Bringing engaging momentum and creative energy to the process:',
    'Making the workflow accessible, lively, and people-centered:',
    'An experiential approach that drives practical enthusiasm:',
  ],
};

function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

// ─── Domain-Aware Reasoning Blocks ───────────────────────────────────────────

function generateDomainContent(
  question: string,
  type: MBTITypeCode,
  skills: SkillConfiguration[]
): string {
  const q = question.toLowerCase();
  const profile = profilesByType[type];
  const sortedSkills = [...skills]
    .map((s) => ({ ...s, intensity: clampIntensity(s.intensity) }))
    .sort((a, b) => b.intensity - a.intensity);

  const topSkill = sortedSkills[0];

  const isDebug = q.includes('crash') || q.includes('bug') || q.includes('debug') || q.includes('error') || q.includes('fail');
  const isBusiness = q.includes('startup') || q.includes('business') || q.includes('company') || q.includes('market') || q.includes('product');
  const isLearn = q.includes('learn') || q.includes('study') || q.includes('python') || q.includes('understand');
  const isSecurity = q.includes('security') || q.includes('cyber') || q.includes('hack') || q.includes('vulnerab') || q.includes('auth');
  const isOptimize = q.includes('optim') || q.includes('slow') || q.includes('perf') || q.includes('scale') || q.includes('latency');

  if (isDebug) {
    if (topSkill?.skillId === 'tactical' || type === 'ISTP') {
      return '1. Reproduce in isolation with verbose telemetry.\n2. Binary-search the execution path to isolate the offending frame.\n3. Verify memory, handle leaks, and state mutations.\n4. Apply an atomic fix and verify under synthetic load.';
    }
    if (topSkill?.skillId === 'analytical' || type === 'INTP') {
      return '1. Decompose the error signature: is failure deterministic under hidden conditions (race condition, thread contention, or state corruption)?\n2. Trace memory ownership across concurrent boundaries.\n3. Formulate mathematical invariants that the code must never violate.\n4. Verify the hypothesis against core runtime constraints.';
    }
    if (topSkill?.skillId === 'strategic' || type === 'INTJ') {
      return '1. Map the system architecture across network, data, and compute boundaries.\n2. Instrument structured tracing at every boundary where untyped state enters.\n3. Prioritize candidate root causes by Severity × Probability.\n4. Implement an architectural safeguard rather than an ad-hoc patch.';
    }
    if (topSkill?.skillId === 'brainstorming' || type === 'ENTP') {
      return '1. Brainstorm unconventional edge cases: clock drift, kernel buffer limits, upstream payload mutation, or cache TTL expiry.\n2. Invert the problem: under what exact conditions does the application NEVER crash?\n3. Test the most counterintuitive hypothesis first to collapse the search space.';
    }
    return '1. Capture system state at crash time.\n2. Isolate external dependencies from internal logic.\n3. Formulate falsifiable failure hypotheses.\n4. Implement verified remediation with automated regression checks.';
  }

  if (isBusiness) {
    if (topSkill?.skillId === 'tactical' || type === 'ESTP') {
      return '1. Build a working prototype this week.\n2. Put it in front of 10 paying target users.\n3. Iterate rapidly based on observed customer behavior, not abstract opinions.\n4. Revenue and user retention are the only validation metrics.';
    }
    if (topSkill?.skillId === 'strategic' || type === 'INTJ' || type === 'ENTJ') {
      return '1. Define the 3-year defensive moat and core unfair advantage.\n2. Calculate unit economics and customer acquisition cost vs. lifetime value.\n3. Map critical path milestones for Q1, Q2, and Year 1.\n4. Build a scalable distribution channel before over-investing in product features.';
    }
    if (topSkill?.skillId === 'brainstorming' || type === 'ENTP') {
      return '1. Generate 20 distinct business model variants in the target domain.\n2. Pressure-test where incumbents are structurally unable to respond.\n3. Identify high-leverage beachhead markets overlooked by traditional players.\n4. Test 3 contrasting value propositions simultaneously.';
    }
    return '1. Validate that the problem is urgent and economically viable.\n2. Design a focused minimum viable product.\n3. Measure user engagement and iterate toward repeatable growth.';
  }

  if (isLearn) {
    if (topSkill?.skillId === 'analytical' || type === 'INTP') {
      return '1. Construct a dependency graph of foundational concepts (data structures, memory models, execution lifecycle).\n2. Master primitives before touching high-level abstractions or frameworks.\n3. Write minimal implementations of core algorithms from scratch to ensure first-principles comprehension.';
    }
    if (topSkill?.skillId === 'tactical' || type === 'ISTP') {
      return '1. Pick a small, real tool you actually want to use.\n2. Build it immediately with minimal syntax lookups.\n3. Learn language features only as you encounter the immediate need for them in code.';
    }
    return '1. Anchor learning to a concrete, meaningful project.\n2. Decompose complex topics into bite-sized milestones.\n3. Reinforce understanding through active recall and practical application.';
  }

  if (isSecurity) {
    if (topSkill?.skillId === 'analytical' || type === 'INTP') {
      return '1. Model the complete threat surface: entry points, trust boundaries, and credential flows.\n2. Analyze cryptographic primitives and token validation logic for subtle bypasses.\n3. Enforce strict principle-of-least-privilege across all service endpoints.';
    }
    return '1. Conduct threat modeling on the attack surface.\n2. Audit authentication, authorization, and input validation boundaries.\n3. Implement defense-in-depth and automated security regression testing.';
  }

  if (isOptimize) {
    if (topSkill?.skillId === 'optimization' || topSkill?.skillId === 'tactical') {
      return '1. Never optimize without profiler flame graphs.\n2. Identify the hot path consuming 80% of CPU/memory resources.\n3. Check algorithmic complexity (e.g. O(n²) to O(n log n)) before micro-optimizations.\n4. Benchmark before and after in an isolated, realistic environment.';
    }
    return '1. Profile the critical path under representative production workloads.\n2. Eliminate redundant I/O, database roundtrips, and memory allocations.\n3. Benchmark improvements with p95 and p99 latency targets.';
  }

  // General default fallback
  return profile?.problemSolvingStyle ?? 'Analyze problem → Formulate strategy → Execute steps → Verify outcome.';
}

// ─── Format by Communication Style ───────────────────────────────────────────

function applyCommunicationStyle(text: string, style?: string): string {
  if (!style) return text;
  const s = style.toLowerCase();

  if (s.includes('concise') || s.includes('direct')) {
    return text
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean)
      .join('\n');
  }

  if (s.includes('socratic')) {
    return `Let us explore this through guiding questions:\n${text
      .split('\n')
      .map((line) => (line.startsWith('1.') || line.startsWith('2.') || line.startsWith('3.') || line.startsWith('4.')
        ? line.replace(/^\d+\.\s*/, '• What if we consider: ')
        : line))
      .join('\n')}\n\nWhat are the primary assumptions you make about this system?`;
  }

  if (s.includes('technical')) {
    return `[TECHNICAL SPECIFICATION & REASONING]\n\n${text}\n\n[INVARIANT VERIFICATION: Checked against systemic constraints.]`;
  }

  return text;
}

// ─── Main Simulation Function ────────────────────────────────────────────────

export function simulateResponse(opts: SimulationOptions): string {
  const { baseType, skills = [], communicationStyle, question } = opts;
  const profile = profilesByType[baseType];
  if (!profile) return 'Unknown cognitive profile.';

  const prefix = pickRandom(typeResponsePatterns[baseType]);
  const sortedSkills = [...skills]
    .map((s) => ({ ...s, intensity: clampIntensity(s.intensity) }))
    .sort((a, b) => b.intensity - a.intensity);

  const topSkill = sortedSkills[0];
  const secondSkill = sortedSkills[1];

  let skillPrefix = '';
  if (topSkill && topSkill.intensity >= 30) {
    const list = skillResponsePrefixes[topSkill.skillId] || skillResponsePrefixes.analytical;
    skillPrefix = pickRandom(list);
  }

  const rawContent = generateDomainContent(question, baseType, skills);
  const styledContent = applyCommunicationStyle(rawContent, communicationStyle);

  const parts = [
    prefix,
    skillPrefix,
    '\n\n' + styledContent,
  ].filter(Boolean);

  if (secondSkill && secondSkill.intensity >= 50) {
    const sk = skillsById[secondSkill.skillId];
    if (sk) {
      parts.push(
        `\n\nAdditionally, incorporating the ${sk.name} skill (${secondSkill.intensity}%): ${sk.behaviors[0]}.`
      );
    }
  }

  return parts.join(' ');
}

// Simulate specifically for a CognitiveProfile
export function simulateCognitiveResponse(
  profile: Partial<CognitiveProfile>,
  question: string
): string {
  if (!profile.baseType) return 'No base profile selected.';
  return simulateResponse({
    baseType: profile.baseType,
    skills: profile.skills,
    communicationStyle: profile.communicationStyle || profile.communicationPreference,
    customInstructions: profile.customInstructions,
    question,
  });
}

// Build comparison approach steps for a type
export function buildApproachSteps(type: MBTITypeCode): string[] {
  const profile = profilesByType[type];
  if (!profile) return [];
  return profile.problemSolvingStyle.split('→').map((s) => s.trim()).filter(Boolean);
}

// Generate comparison panels for MBTI types or Cognitive Profiles
export function generateComparisonPanels(
  types: MBTITypeCode[],
  question: string
): Array<{ type: MBTITypeCode; name: string; approach: string[]; response: string }> {
  return types.map((type) => {
    const profile = profilesByType[type];
    return {
      type,
      name: profile?.name || type,
      approach: buildApproachSteps(type),
      response: simulateResponse({ baseType: type, skills: [], question }),
    };
  });
}

// Upgraded comparison panel generator supporting custom Cognitive Profiles
export function generateCognitiveComparisonPanels(
  targets: ComparisonTarget[],
  question: string
): ComparisonPanel[] {
  return targets.map((t) => {
    const approach = t.skills.length > 0
      ? deriveProblemSolvingWorkflow({ baseType: t.baseType, skills: t.skills }).slice(0, 5)
      : buildApproachSteps(t.baseType);

    const simulatedResponse = simulateResponse({
      baseType: t.baseType,
      skills: t.skills,
      communicationStyle: t.communicationStyle,
      customInstructions: t.customInstructions,
      question,
    });

    const dominantSkills = t.skills
      .filter((s) => s.intensity >= 40)
      .map((s) => skillsById[s.skillId]?.name ?? s.skillId);

    return {
      targetId: t.id,
      profileType: t.baseType,
      label: t.label,
      problem: question,
      approach,
      simulatedResponse,
      dominantSkills,
    };
  });
}
