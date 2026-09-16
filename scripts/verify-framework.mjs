// Comprehensive test suite for MBTI AI Skills Framework V1.1
// Verifies all 9 core verification requirements from spec section 32.

import assert from 'node:assert';

// 1. Data Verification: All 16 profiles load
import { mbtiProfiles, profilesByType } from '../src/data/mbtiProfiles.ts';
import { skills, skillsById } from '../src/data/skills.ts';
import {
  generateSystemPrompt,
  getIntensityTier,
  clampIntensity,
  generateCognitiveProfileName,
  deriveProblemSolvingWorkflow,
} from '../src/engine/promptGenerator.ts';
import {
  encodeProfile,
  decodeProfile,
  validateAndSanitizeProfile,
  exportProfileJson,
  importProfileJson,
} from '../src/engine/profileSerializer.ts';
import { simulateResponse } from '../src/engine/responseSimulator.ts';

console.log('🧪 Starting MBTI AI Skills V1.1 Verification Suite...\n');

// ── Test 1: Profiles Verification ───────────────────────────────────────────
console.log('1. Verifying 16 MBTI profiles...');
const expectedTypes = [
  'INTJ', 'INTP', 'ENTJ', 'ENTP',
  'INFJ', 'INFP', 'ENFJ', 'ENFP',
  'ISTJ', 'ISFJ', 'ESTJ', 'ESFJ',
  'ISTP', 'ISFP', 'ESTP', 'ESFP',
];
assert.strictEqual(mbtiProfiles.length, 16, 'Should have exactly 16 profiles');
for (const type of expectedTypes) {
  const profile = profilesByType[type];
  assert.ok(profile, `Profile ${type} must exist in profilesByType`);
  assert.strictEqual(profile.type, type);
  assert.ok(profile.name && profile.name.length > 0, `${type} must have a valid name`);
  assert.ok(profile.cognitiveStyle && profile.cognitiveStyle.length > 0, `${type} must have cognitiveStyle`);
  assert.ok(profile.recommendedSkills.length > 0, `${type} must have recommendedSkills`);
}
console.log('   ✓ All 16 MBTI profiles exist, load, and have complete structured metadata.\n');

// ── Test 2: Skills Verification ─────────────────────────────────────────────
console.log('2. Verifying 12 Modular Cognitive Skills...');
const expectedSkills = [
  'analytical', 'tactical', 'strategic', 'brainstorming',
  'troubleshooting', 'creative', 'empathy', 'structured',
  'experimental', 'debate', 'optimization', 'research',
];
assert.strictEqual(skills.length, 12, 'Should have exactly 12 skills');
for (const id of expectedSkills) {
  const skill = skillsById[id];
  assert.ok(skill, `Skill ${id} must exist in skillsById`);
  assert.strictEqual(skill.id, id);
  assert.ok(skill.behaviors.length >= 3, `Skill ${id} must have at least 3 behavior directives`);
}
console.log('   ✓ All 12 modular skills exist, load, and have behavior directives.\n');

// ── Test 3: Intensity Clamping & Behavior Tiers ──────────────────────────────
console.log('3. Verifying Intensity Clamping (0–100) & Behavior Tiers...');
assert.strictEqual(clampIntensity(-50), 0, 'Negative intensity must clamp to 0');
assert.strictEqual(clampIntensity(150), 100, 'Over 100 intensity must clamp to 100');
assert.strictEqual(clampIntensity(74.4), 74, 'Floats must round cleanly');

const tierHigh = getIntensityTier(95);
const tierMid = getIntensityTier(75);
const tierLow = getIntensityTier(45);
const tierMin = getIntensityTier(15);

assert.ok(tierHigh.directiveTemplate('analyze').includes('Strongly prioritize analyze'));
assert.ok(tierMid.directiveTemplate('analyze').includes('Regularly use analyze'));
assert.ok(tierLow.directiveTemplate('analyze').includes('Consider analyze when useful'));
assert.ok(tierMin.directiveTemplate('analyze').includes('only when strictly appropriate'));
console.log('   ✓ Intensity tiers dynamically alter behavior wording based on continuous 0–100% values.\n');

// ── Test 4: Cognitive Profile Naming & Derivation ───────────────────────────
console.log('4. Verifying Cognitive Profile Naming & Workflow...');
const autoName = generateCognitiveProfileName('INTP', [
  { skillId: 'analytical', intensity: 95 },
  { skillId: 'research', intensity: 85 },
  { skillId: 'tactical', intensity: 65 },
]);
assert.strictEqual(autoName, 'Analytical Research Tactical AI');

const workflow = deriveProblemSolvingWorkflow({
  baseType: 'INTP',
  skills: [
    { skillId: 'analytical', intensity: 95 },
    { skillId: 'troubleshooting', intensity: 80 },
  ],
});
assert.ok(workflow.some((s) => s.includes('Decompose')), 'Workflow must contain analytical decomposition');
assert.ok(workflow.some((s) => s.includes('Isolate root causes')), 'Workflow must contain troubleshooting steps');
console.log('   ✓ Cognitive Profile naming and dynamic problem-solving trajectories derived accurately.\n');

// ── Test 5: System Prompt Generator Output ──────────────────────────────────
console.log('5. Verifying System Prompt Generator...');
const promptHigh = generateSystemPrompt({
  baseType: 'INTP',
  skills: [{ skillId: 'analytical', intensity: 95 }],
  communicationStyle: 'Technical',
});
const promptLow = generateSystemPrompt({
  baseType: 'INTP',
  skills: [{ skillId: 'analytical', intensity: 20 }],
  communicationStyle: 'Technical',
});

assert.notStrictEqual(promptHigh, promptLow, 'Prompt with 95% intensity must differ from 20% intensity');
assert.ok(promptHigh.includes('Strongly prioritize'), 'High intensity must contain "Strongly prioritize"');
assert.ok(promptLow.includes('strictly appropriate'), 'Low intensity must contain "strictly appropriate"');
assert.ok(promptHigh.includes('Technical'), 'Prompt must contain communication style directives');
assert.ok(promptHigh.includes('NOT a scientific psychological diagnosis'), 'Must include ethical disclaimer');
console.log('   ✓ Prompt generator adapts behavior directives and disclaimers dynamically.\n');

// ── Test 6: Serialization, Export & Import Roundtrip ─────────────────────────
console.log('6. Verifying JSON Export, Import & Schema Validation...');
const testProfile = {
  name: 'Test Investigator',
  baseType: 'ISTP',
  skills: [
    { skillId: 'tactical', intensity: 90 },
    { skillId: 'troubleshooting', intensity: 85 },
  ],
  communicationStyle: 'Direct',
  customInstructions: 'Always verify before concluding.',
};

const exportedJson = exportProfileJson(testProfile);
const importResult = importProfileJson(exportedJson);
assert.strictEqual(importResult.success, true, 'Import of valid JSON must succeed');
assert.strictEqual(importResult.profile.baseType, 'ISTP');
assert.strictEqual(importResult.profile.skills.length, 2);
assert.strictEqual(importResult.profile.communicationStyle, 'Direct');
console.log('   ✓ JSON Export -> Import produces an equivalent validated configuration.\n');

// ── Test 7: Shareable URL Encoding & Decoding ────────────────────────────────
console.log('7. Verifying URL State Encoding & Restoration...');
const encoded = encodeProfile(testProfile);
assert.ok(encoded.length > 0, 'Encoding must produce base64 string');

const decoded = decodeProfile(encoded);
assert.ok(decoded, 'Decoding must succeed');
assert.strictEqual(decoded.baseType, 'ISTP');
assert.strictEqual(decoded.skills[0].skillId, 'tactical');
assert.strictEqual(decoded.skills[0].intensity, 90);
console.log('   ✓ Profile -> URL base64 -> Decode restores base, skills, and intensities.\n');

// ── Test 8: Malformed Data & Corruption Resilience ──────────────────────────
console.log('8. Verifying Malformed Data Handling...');
const malformedJsonResult = importProfileJson('{ not valid json');
assert.strictEqual(malformedJsonResult.success, false);
assert.ok(malformedJsonResult.error.includes('Malformed JSON'));

const invalidBaseType = validateAndSanitizeProfile({
  baseType: 'INVALID_TYPE_XYZ',
  skills: [],
});
assert.strictEqual(invalidBaseType.valid, false);
assert.ok(invalidBaseType.error.includes('Must be one of the 16 MBTI types'));

const decodedGarbage = decodeProfile('not-valid-base64-garbage!@#$');
assert.strictEqual(decodedGarbage, null, 'Decoding corrupt base64 string must return null safely');
console.log('   ✓ Malformed JSON and corrupt URL parameters handled gracefully without throwing.\n');

// ── Test 9: Cognitive Simulation Divergence ──────────────────────────────────
console.log('9. Verifying Response Simulator Divergence...');
const respAnalytical = simulateResponse({
  baseType: 'INTP',
  skills: [{ skillId: 'analytical', intensity: 95 }],
  question: 'My server crashed due to memory exhaustion.',
});
const respTactical = simulateResponse({
  baseType: 'ISTP',
  skills: [{ skillId: 'tactical', intensity: 95 }],
  question: 'My server crashed due to memory exhaustion.',
});

assert.ok(respAnalytical.length > 50, 'Simulator must generate substantive output');
assert.ok(respTactical.length > 50, 'Simulator must generate substantive output');
assert.notStrictEqual(respAnalytical, respTactical, 'Different cognitive profiles must produce different approaches');
console.log('   ✓ Simulator produces divergent approaches for different cognitive configurations.\n');

console.log('🎉 ALL 9 TEST SUITES PASSED SUCCESSFULLY!\n');
