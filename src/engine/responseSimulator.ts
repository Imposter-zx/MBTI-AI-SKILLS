import type { MBTITypeCode, SkillIntensity } from '../types';
import { profilesByType } from '../data/mbtiProfiles';
import { skillsById } from '../data/skills';

// ─── Simulate AI responses based on profile + skills ─────────────────────────

interface SimulationOptions {
  baseType: MBTITypeCode;
  skills?: SkillIntensity[];
  question: string;
}

// Pattern-based response templates per skill
const skillResponsePrefixes: Record<string, string[]> = {
  analytical: [
    "Let's decompose this systematically.",
    'First, identify the core components.',
    "Let's break this into logical layers.",
    'The key assumptions here are worth examining.',
  ],
  tactical: [
    "Here's the direct path to solving this:",
    "Forget the theory — here's what you actually need to do:",
    'The immediate action steps are:',
    "Let's focus on what actually matters right now:",
  ],
  strategic: [
    "Before diving in, let's define the long-term objective.",
    'Looking at this from a systems perspective:',
    "The strategic approach here involves multiple stages:",
    "Let's map the full landscape before we move:",
  ],
  brainstorming: [
    "Let me generate a range of possibilities:",
    "Here are several unconventional approaches worth considering:",
    "Instead of the obvious path, consider these alternatives:",
    "Let's expand the idea space before narrowing:",
  ],
  troubleshooting: [
    "Let's diagnose this systematically.",
    "First, separate symptoms from root causes.",
    "The diagnostic process should be:",
    "Let's isolate the failure point:",
  ],
  creative: [
    "Let me approach this from an unexpected angle.",
    "What if we reframe the problem entirely?",
    "The most interesting possibility here:",
    "Here's an unconventional take that might unlock something new:",
  ],
  empathy: [
    "Before we solve this, let's acknowledge what makes it challenging.",
    "This is genuinely difficult, and that matters.",
    "Understanding the human context here:",
    "Let's make sure we're solving the right problem for the right person.",
  ],
  structured: [
    "Here's a step-by-step breakdown:",
    "Following a systematic process:",
    "Let's organize this clearly:",
    "The structured approach to this:",
  ],
  experimental: [
    "Let's treat this as a testable hypothesis.",
    "The scientific approach here:",
    "Form a hypothesis, then design the smallest possible test:",
    "What experiment would give us the fastest signal?",
  ],
  debate: [
    "Let's challenge the assumptions in this question.",
    "The conventional approach has weaknesses worth examining.",
    "A strong counterargument to the obvious answer:",
    "Before accepting the standard approach, consider:",
  ],
  optimization: [
    "Let's compare the alternatives systematically.",
    "The bottleneck here is likely:",
    "To optimize this efficiently:",
    "Here's how to find and eliminate the primary constraint:",
  ],
  research: [
    "Let's separate what we know from what we're assuming.",
    "The evidence-based approach here requires:",
    "Before drawing conclusions, identify the missing information:",
    "The key questions that need answering are:",
  ],
};

// Type-specific response patterns
const typeResponsePatterns: Record<MBTITypeCode, string[]> = {
  INTJ: [
    "Strategic analysis indicates:",
    "From a systems perspective, the optimal approach is:",
    "The long-term consideration here:",
    "Mapping the problem space reveals:",
  ],
  INTP: [
    "Interesting question — let me model this logically.",
    "The underlying structure of this problem:",
    "A hypothesis worth testing:",
    "The logical dependencies suggest:",
  ],
  ENTJ: [
    "The objective is clear. Here's the execution plan:",
    "This calls for decisive action:",
    "Define the goal. Allocate resources. Execute:",
    "The most efficient path to the outcome:",
  ],
  ENTP: [
    "Multiple possibilities immediately come to mind:",
    "The conventional answer is X — but have you considered Y?",
    "Let me challenge the framing of this question:",
    "Three competing approaches, all worth considering:",
  ],
  INFJ: [
    "The deeper pattern here suggests:",
    "Looking beyond the surface-level problem:",
    "The meaningful insight here:",
    "Understanding the root cause at a deeper level:",
  ],
  INFP: [
    "What makes this meaningful is:",
    "The authentic approach here:",
    "Exploring the human dimension of this:",
    "The value underneath this question:",
  ],
  ENFJ: [
    "How does this affect everyone involved?",
    "Building toward a shared solution:",
    "The collaborative path forward:",
    "Bringing people together around this:",
  ],
  ENFP: [
    "Here's what makes this genuinely exciting:",
    "The most alive possibility here:",
    "What if you reframed this as an opportunity?",
    "The energizing approach to this challenge:",
  ],
  ISTJ: [
    "Following the established procedure:",
    "The methodical approach, step by step:",
    "Verifying each requirement systematically:",
    "The reliable, documented process:",
  ],
  ISFJ: [
    "Let's make sure we cover every detail carefully.",
    "The practical, supportive path forward:",
    "Attending to what's important here:",
    "Step by step, here's how to handle this:",
  ],
  ESTJ: [
    "The standard process for this is clear:",
    "Accountability and execution:",
    "The proven approach here:",
    "Setting expectations and tracking outcomes:",
  ],
  ESFJ: [
    "Thinking about everyone affected by this:",
    "The community-centered approach:",
    "Making sure everyone is supported:",
    "Building a cooperative path forward:",
  ],
  ISTP: [
    "Here's what's actually happening and how to fix it:",
    "The direct, practical solution:",
    "Isolating the real problem:",
    "What you actually need to do:",
  ],
  ISFP: [
    "Approaching this with open curiosity:",
    "What feels right here:",
    "Exploring this freely:",
    "The authentic, experiential approach:",
  ],
  ESTP: [
    "Act now, adjust from feedback:",
    "The fastest path to a real answer:",
    "Don't wait for perfect information — here's the move:",
    "Ship, observe, adapt:",
  ],
  ESFP: [
    "Let's make this engaging and human:",
    "Here's the energized path forward:",
    "What makes this genuinely interesting:",
    "The lively, creative approach:",
  ],
};

function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

// Generate a problem-specific response based on keywords
function generateContextualContent(question: string, type: MBTITypeCode, skills: SkillIntensity[]): string {
  const q = question.toLowerCase();
  const profile = profilesByType[type];
  const sortedSkills = [...skills].sort((a, b) => b.intensity - a.intensity);
  const topSkills = sortedSkills.slice(0, 3);

  const problemType = q.includes('crash') || q.includes('bug') || q.includes('debug') || q.includes('error')
    ? 'debug'
    : q.includes('startup') || q.includes('business') || q.includes('company')
    ? 'business'
    : q.includes('learn') || q.includes('study')
    ? 'learning'
    : q.includes('design') || q.includes('creative') || q.includes('idea')
    ? 'creative'
    : q.includes('security') || q.includes('hack') || q.includes('cyber')
    ? 'security'
    : q.includes('optim') || q.includes('slow') || q.includes('performance')
    ? 'optimize'
    : q.includes('plan') || q.includes('project') || q.includes('manag')
    ? 'plan'
    : q.includes('team') || q.includes('conflict') || q.includes('disagree') || q.includes('people')
    ? 'people'
    : 'general';

  // Content blocks per problem type per cognitive approach
  const contentMap: Record<string, Record<string, string>> = {
    debug: {
      analytical: 'Decompose the error into: (1) What triggers it? (2) What state is the system in at that point? (3) Which component owns that state? Build a causality chain from symptom to root.',
      tactical: 'Reproduce it. If you can\'t reproduce it, add logging. Once reproduced, binary search the code path. Find the exact line. Fix it. Verify.',
      strategic: 'Map the architecture to identify where failures can originate. Build a systematic debugging strategy that covers all layers: application logic, data layer, infrastructure, and external dependencies.',
      brainstorming: 'List every possible cause: memory leak, race condition, missing null check, environment config difference, third-party API inconsistency, database deadlock, thread pool exhaustion. Which is most likely?',
      troubleshooting: 'Step 1: Reproduce the crash consistently. Step 2: Capture state at crash time (logs, metrics, stack trace). Step 3: Form three hypotheses. Step 4: Test the most likely first. Step 5: Verify the fix.',
      research: 'What do the error logs actually say? Have you checked for known issues in your dependency versions? Is this reproducible in a minimal environment? The answers define the search space.',
      experimental: 'Treat each hypothesis as an experiment. Hypothesis: "Race condition in thread pool." Test: add mutex and reproduce under load. Did the crash disappear? If yes, root cause confirmed.',
      debate: 'Challenge your first assumption about the crash cause. If you think it\'s a memory issue — what evidence would prove it isn\'t? Force yourself to test the counterargument.',
      optimization: 'The bug may be a symptom of an architectural bottleneck. Before patching, verify that fixing this specific crash won\'t expose the next one hiding underneath it.',
      structured: 'Follow a systematic debugging checklist: environment variables → dependency versions → recent code changes → error logs → stack traces → resource usage. Don\'t skip steps.',
      creative: 'What if the bug isn\'t in your code at all? Consider: OS-level issue, hardware fault, network packet corruption, encoding mismatch. The creative hypothesis often finds what the obvious search misses.',
      empathy: 'This is frustrating, and that\'s understandable. Intermittent bugs are genuinely hard. Let\'s approach this calmly and systematically — we\'ll find it.',
      strategic_type: 'Map the system architecture before touching any code. Understand which layers interact at the crash boundary. Then build a phased debugging strategy.',
      general: profile.problemSolvingStyle,
    },
    business: {
      analytical: 'Analyze the market systematically: (1) Define the problem being solved. (2) Identify the target customer precisely. (3) Size the addressable market. (4) Analyze competitive alternatives. (5) Determine differentiation.',
      tactical: 'Don\'t over-plan. Your first goal: find 10 customers who will pay you money. Everything else can wait. Revenue validates the idea. Planning validates nothing.',
      strategic: 'Define your 3-year vision first. Then work backward: what must be true in year 2? Year 1? Q1? This structure ensures every early decision serves the long-term objective.',
      brainstorming: 'Before committing to one idea: generate 20 business concepts in your domain. Evaluate each on (a) market size, (b) unfair advantage, (c) passion, (d) difficulty. Pick the intersection.',
      general: 'The startup question is really three questions: (1) Does this problem really exist? (2) Do customers want your specific solution? (3) Can you build a sustainable business around it? Test each in order.',
    },
    learning: {
      analytical: 'Map the learning domain into a dependency graph. Identify what concepts are prerequisites for others. Learn in topological order. Build from foundations up, not from examples down.',
      tactical: 'The fastest way to learn anything: build something real with it today, even if it\'s broken. Real problems expose real gaps faster than tutorials.',
      brainstorming: 'There are many ways to learn this: textbooks, video courses, project-based learning, teaching others, contributing to open source, building toys, reading source code. Which matches your style?',
      empathy: 'Feeling overwhelmed is a signal that the current approach isn\'t working — not that you\'re incapable. Let\'s find a starting point that feels manageable rather than pushing through the overwhelm.',
      general: 'Learning works best when anchored to a real goal. What do you want to build or do with this skill? That goal becomes your learning curriculum.',
    },
    creative: {
      creative: 'The best creative ideas come from constraints + unexpected combinations. List 5 constraints on your project. Then list 5 unrelated domains. Find the intersection that nobody has explored.',
      brainstorming: 'Generate 30 ideas in 10 minutes. Don\'t judge any of them. Then identify the 3 most unexpected ones. Develop those further — the obvious ideas are already taken.',
      experimental: 'Treat creative work as a series of small experiments. Build a small prototype of the most interesting idea. Learn from what works and what doesn\'t. Iterate.',
      general: 'Creativity is pattern combination. Consume widely from unrelated fields. The surprising connection between two unrelated things is where original ideas live.',
    },
    security: {
      analytical: 'Security analysis requires mapping the attack surface systematically: (1) All entry points. (2) All assets worth protecting. (3) All threat actors. (4) Probability × impact for each threat. Prioritize by risk.',
      tactical: 'Start with the OWASP Top 10. Most real-world breaches exploit basic vulnerabilities. Fix the fundamentals before building advanced defenses.',
      troubleshooting: 'Security incidents: contain first, then investigate. Isolate the affected system. Preserve evidence. Then trace the attack path from initial access to objective.',
      research: 'Security is about knowing what others have learned the hard way. Study CVE databases, penetration testing reports, and incident post-mortems. Build on existing knowledge.',
      general: 'Security is about thinking like an attacker while building like a defender. For every component you build, ask: how would I break this if I were trying to?',
    },
    optimize: {
      analytical: 'Profile before optimizing. Measure where time is actually being spent. The bottleneck is almost never where you expect it to be. Optimize based on data, not intuition.',
      tactical: 'Run a profiler. Find the one function taking 80% of the time. Optimize that. Everything else is premature.',
      optimization: 'Compare algorithmic complexity before anything else. An O(n²) algorithm optimized to O(n) beats any constant-factor improvement. Start with the right data structure and algorithm.',
      experimental: 'Optimization is empirical. Form a hypothesis: "This query is slow because of a full table scan." Test: add an index. Measure before and after. Repeat.',
      general: 'The three rules of optimization: (1) Don\'t. (2) Don\'t yet. (3) Profile first. Fix the actual bottleneck, not the assumed one.',
    },
    plan: {
      strategic: 'Break the project into phases with clear deliverables at each milestone. Identify critical path dependencies. Build contingency into the timeline for the three most likely risks.',
      structured: 'Project planning checklist: (1) Define success criteria. (2) List all deliverables. (3) Identify dependencies. (4) Estimate effort. (5) Assign owners. (6) Set milestones. (7) Define risks and mitigations.',
      analytical: 'Map the dependency graph of your project tasks. Identify the critical path. Any delay on the critical path delays the whole project. Focus your attention there.',
      general: 'Good project planning answers: What does done look like? Who owns each piece? What could go wrong? How will we know we\'re off track? Answer these before you start.',
    },
    people: {
      empathy: 'Interpersonal conflict usually has two components: a factual dispute and an emotional dimension. Separate them. Resolve the emotional acknowledgment before the intellectual argument. People rarely hear logic they feel dismissed.',
      strategic: 'Disagreements at work are often about unstated priorities. Make the priorities explicit. Ask: what outcome are you optimizing for? Often the conflict dissolves when objectives are aligned.',
      debate: 'The strongest position in a disagreement is the one that can steelman the other side. Before arguing your view, demonstrate you understand theirs so well that they feel heard. Then present your perspective.',
      general: 'Start from genuine curiosity about their position, not from winning the argument. The goal is shared understanding, not victory.',
    },
    general: {
      analytical: `${profile.cognitiveStyle} Let's break this down systematically.`,
      tactical: 'Here\'s the direct approach: identify the immediate action that creates the most progress.',
      strategic: `${profile.problemSolvingStyle}`,
      general: `${profile.description} ${profile.problemSolvingStyle}`,
    },
  };

  const typeToApproach: Partial<Record<MBTITypeCode, string>> = {
    INTJ: 'strategic', INTP: 'analytical', ENTJ: 'strategic', ENTP: 'brainstorming',
    INFJ: 'analytical', INFP: 'creative', ENFJ: 'empathy', ENFP: 'brainstorming',
    ISTJ: 'structured', ISFJ: 'empathy', ESTJ: 'structured', ESFJ: 'empathy',
    ISTP: 'tactical', ISFP: 'creative', ESTP: 'tactical', ESFP: 'creative',
  };

  const domainContent = contentMap[problemType] || contentMap.general;

  // Find best matching content
  for (const si of topSkills) {
    if (domainContent[si.skillId]) {
      return domainContent[si.skillId];
    }
  }

  const typeApproach = typeToApproach[type] || 'general';
  return domainContent[typeApproach] || domainContent.general || profile.problemSolvingStyle;
}

// Build comparison approach steps for a type
export function buildApproachSteps(type: MBTITypeCode): string[] {
  const profile = profilesByType[type];
  if (!profile) return [];
  return profile.problemSolvingStyle.split('→').map((s) => s.trim()).filter(Boolean);
}

// ─── Main simulator ───────────────────────────────────────────────────────────

export function simulateResponse(opts: SimulationOptions): string {
  const { baseType, skills = [], question } = opts;
  const profile = profilesByType[baseType];
  if (!profile) return 'Unknown profile.';

  const prefix = pickRandom(typeResponsePatterns[baseType]);
  const skillPrefix =
    skills.length > 0 && skills[0]
      ? pickRandom(skillResponsePrefixes[skills[0].skillId] || skillResponsePrefixes.analytical)
      : null;

  const content = generateContextualContent(question, baseType, skills);

  const parts = [prefix, skillPrefix, '\n', content].filter(Boolean);

  // Add skill-specific follow-up for the second skill if present
  if (skills.length > 1 && skills[1]) {
    const secondSkill = skillsById[skills[1].skillId];
    if (secondSkill) {
      parts.push(
        `\n\nAdditionally, from a ${secondSkill.name.toLowerCase()} perspective: ${secondSkill.behaviors[0].toLowerCase()}.`
      );
    }
  }

  return parts.join(' ');
}

// Generate the comparison panels for the /compare page
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
