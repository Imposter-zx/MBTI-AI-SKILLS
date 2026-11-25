// Comprehensive test suite for MBTI AI Skills Framework V1.2
// Verifies all core framework and V1.2 portable skills library requirements.

import assert from 'node:assert';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import JSZip from 'jszip';

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
import {
  sanitizeSlug,
  generateSkillMarkdown,
  buildSkillZip,
  buildAllSkillsZip,
  getMbtiSkillPacks,
  buildSkillPackZip,
  buildCognitiveProfileZip,
  generateCustomSkillMarkdown,
  buildCustomSkillZip,
} from '../src/engine/skillExporter.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..');

console.log('🧪 Starting MBTI AI Skills V1.2 Verification Suite...\n');

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

// ── Test 10: Portable Skills on Disk ─────────────────────────────────────────
console.log('10. Verifying 12 portable-skills/<id>/SKILL.md files on disk...');
const requiredSections = [
  '## Purpose',
  '## When to Use',
  '## Behavioral Guidelines',
  '## Workflow',
  '## Output Expectations',
  '## Limitations',
  '## Example',
];

function parseFrontmatter(markdown) {
  const match = markdown.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n/);
  assert.ok(match, 'SKILL.md must start with valid YAML frontmatter delimited by ---');
  const fm = match[1];
  const nameMatch = fm.match(/^name:\s*(.+)$/m);
  const descMatch = fm.match(/^description:\s*(.+)$/m);
  assert.ok(nameMatch && nameMatch[1].trim().length > 0, 'Frontmatter must include non-empty name');
  assert.ok(descMatch && descMatch[1].trim().length > 0, 'Frontmatter must include non-empty description');
  return {
    name: nameMatch[1].trim().replace(/^["']|["']$/g, ''),
    description: descMatch[1].trim().replace(/^["']|["']$/g, ''),
  };
}

for (const id of expectedSkills) {
  const skillPath = path.join(repoRoot, 'portable-skills', id, 'SKILL.md');
  assert.ok(fs.existsSync(skillPath), `Missing portable skill file: ${skillPath}`);
  const content = fs.readFileSync(skillPath, 'utf8');
  const fm = parseFrontmatter(content);
  assert.strictEqual(fm.name, id, `Frontmatter name in ${skillPath} should match ${id}`);
  for (const section of requiredSections) {
    assert.ok(content.includes(section), `${skillPath} must contain section "${section}"`);
  }
}
console.log('   ✓ All 12 portable-skills/<id>/SKILL.md files exist with valid frontmatter and required sections.\n');

// ── Test 11: Docs Existence ──────────────────────────────────────────────────
console.log('11. Verifying V1.2 documentation files...');
for (const docRelPath of ['docs/compatibility.md', 'docs/installation.md']) {
  const docPath = path.join(repoRoot, docRelPath);
  assert.ok(fs.existsSync(docPath), `Missing documentation file: ${docRelPath}`);
  const content = fs.readFileSync(docPath, 'utf8');
  assert.ok(content.trim().length > 100, `${docRelPath} must contain substantive documentation`);
}
console.log('   ✓ docs/compatibility.md and docs/installation.md exist.\n');

// ── Test 12: generateSkillMarkdown for all 12 skills ─────────────────────────
console.log('12. Verifying generateSkillMarkdown(skill) for all 12 skills...');
for (const skill of skills) {
  const md = generateSkillMarkdown(skill);
  const fm = parseFrontmatter(md);
  assert.strictEqual(fm.name, skill.id, `Generated frontmatter name must match ${skill.id}`);
  assert.ok(md.includes(`# ${skill.name} Skill`), `Generated markdown must include title for ${skill.id}`);
  for (const section of requiredSections) {
    assert.ok(md.includes(section), `Generated markdown for ${skill.id} must include "${section}"`);
  }
}
console.log('   ✓ generateSkillMarkdown produces valid YAML frontmatter and structured body for all 12 skills.\n');

// ── Test 13: buildSkillZip ───────────────────────────────────────────────────
console.log('13. Verifying buildSkillZip(skill)...');
const sampleSkill = skillsById['analytical'];
const skillZipBlob = await buildSkillZip(sampleSkill);
const skillZip = await JSZip.loadAsync(await skillZipBlob.arrayBuffer());
assert.ok(skillZip.file('analytical/SKILL.md'), 'Skill ZIP must contain analytical/SKILL.md');
assert.ok(skillZip.file('analytical/README.md'), 'Skill ZIP must contain analytical/README.md');
assert.ok(skillZip.file('analytical/examples/example-1.md'), 'Skill ZIP must contain analytical/examples/example-1.md');
const zippedSkillMd = await skillZip.file('analytical/SKILL.md').async('string');
parseFrontmatter(zippedSkillMd);
console.log('   ✓ buildSkillZip produces a valid ZIP with SKILL.md, README.md, and examples/example-1.md.\n');

// ── Test 14: buildAllSkillsZip ───────────────────────────────────────────────
console.log('14. Verifying buildAllSkillsZip()...');
const allSkillsBlob = await buildAllSkillsZip();
const allSkillsZip = await JSZip.loadAsync(await allSkillsBlob.arrayBuffer());
assert.ok(allSkillsZip.file('README.md'), 'All-skills ZIP must contain root README.md');
for (const id of expectedSkills) {
  assert.ok(allSkillsZip.file(`skills/${id}/SKILL.md`), `All-skills ZIP missing skills/${id}/SKILL.md`);
  assert.ok(allSkillsZip.file(`skills/${id}/README.md`), `All-skills ZIP missing skills/${id}/README.md`);
}
console.log('   ✓ buildAllSkillsZip produces a valid ZIP with README.md and all 12 skills.\n');

// ── Test 15: MBTI Skill Packs ────────────────────────────────────────────────
console.log('15. Verifying getMbtiSkillPacks() and buildSkillPackZip("INTP")...');
const packs = getMbtiSkillPacks();
assert.strictEqual(packs.length, 16, 'getMbtiSkillPacks() must return all 16 packs');
for (const type of expectedTypes) {
  const pack = packs.find((p) => p.type === type);
  assert.ok(pack, `Skill pack for ${type} must exist`);
  assert.ok(pack.skills.length > 0, `Skill pack for ${type} must include skills`);
}

const intpPackBlob = await buildSkillPackZip('INTP');
const intpPackZip = await JSZip.loadAsync(await intpPackBlob.arrayBuffer());
assert.ok(intpPackZip.file('README.md'), 'Skill pack ZIP must contain README.md');
assert.ok(intpPackZip.file('pack.json'), 'Skill pack ZIP must contain pack.json');
const packJson = JSON.parse(await intpPackZip.file('pack.json').async('string'));
assert.strictEqual(packJson.type, 'INTP', 'pack.json type must be INTP');
assert.strictEqual(packJson.experimental, true, 'pack.json must mark experimental: true');
assert.ok(Array.isArray(packJson.skills) && packJson.skills.length > 0, 'pack.json must list skills');
for (const skillId of packJson.skills) {
  assert.ok(intpPackZip.file(`skills/${skillId}/SKILL.md`), `Pack ZIP missing skills/${skillId}/SKILL.md`);
}
console.log('   ✓ All 16 MBTI Skill Packs and buildSkillPackZip("INTP") verified.\n');

// ── Test 16: buildCognitiveProfileZip ────────────────────────────────────────
console.log('16. Verifying buildCognitiveProfileZip(...)...');
const cognitiveProfileInput = {
  name: 'Deep Systems Architect',
  baseType: 'INTJ',
  skills: [
    { skillId: 'strategic', intensity: 95 },
    { skillId: 'analytical', intensity: 88 },
  ],
  communicationStyle: 'Technical',
  customInstructions: 'State architectural trade-offs explicitly.',
};
const profileSlug = sanitizeSlug(cognitiveProfileInput.name);
const profileZipBlob = await buildCognitiveProfileZip(cognitiveProfileInput);
const profileZip = await JSZip.loadAsync(await profileZipBlob.arrayBuffer());
assert.ok(profileZip.file(`${profileSlug}/SKILL.md`), `Profile ZIP missing ${profileSlug}/SKILL.md`);
assert.ok(profileZip.file(`${profileSlug}/profile.json`), `Profile ZIP missing ${profileSlug}/profile.json`);
assert.ok(profileZip.file(`${profileSlug}/README.md`), `Profile ZIP missing ${profileSlug}/README.md`);
const exportedProfileJson = await profileZip.file(`${profileSlug}/profile.json`).async('string');
const reimportedProfile = importProfileJson(exportedProfileJson);
assert.strictEqual(reimportedProfile.success, true, 'profile.json inside ZIP must be re-importable');
console.log('   ✓ buildCognitiveProfileZip produces SKILL.md, profile.json, and README.md.\n');

// ── Test 17: Custom Skill Export & Slug/Filename Sanitization ────────────────
console.log('17. Verifying generateCustomSkillMarkdown & buildCustomSkillZip sanitization...');
const unsafeCustomSkill = {
  name: '  ../../Dangerous Custom Skill!! @#$ 2026  ',
  slug: '../../evil/path/traversal',
  description: 'Tests safe slug and YAML escaping "quotes" and \nnewlines.',
  purpose: 'Verify custom skill export handles unsafe characters cleanly.',
  behaviors: ['Isolate variables', 'Verify invariants'],
  workflow: ['Inspect inputs', 'Sanitize paths'],
  examples: ['Example prompt'],
  tags: ['safety', 'testing'],
};
const expectedCustomSlug = sanitizeSlug(unsafeCustomSkill.slug);
assert.ok(!expectedCustomSlug.includes('..'), 'Sanitized slug must not contain ".."');
assert.ok(!expectedCustomSlug.includes('/'), 'Sanitized slug must not contain "/"');
assert.ok(!expectedCustomSlug.includes('\\'), 'Sanitized slug must not contain "\\"');
assert.strictEqual(expectedCustomSlug, 'evil-path-traversal');

const customMd = generateCustomSkillMarkdown(unsafeCustomSkill);
const customFm = parseFrontmatter(customMd);
assert.strictEqual(customFm.name, expectedCustomSlug);

const customZipBlob = await buildCustomSkillZip(unsafeCustomSkill);
const customZip = await JSZip.loadAsync(await customZipBlob.arrayBuffer());
assert.ok(customZip.file(`${expectedCustomSlug}/SKILL.md`), 'Custom ZIP must use sanitized slug directory for SKILL.md');
assert.ok(customZip.file(`${expectedCustomSlug}/README.md`), 'Custom ZIP must use sanitized slug directory for README.md');
for (const entryName of Object.keys(customZip.files)) {
  assert.ok(!entryName.includes('..'), `ZIP entry must not contain path traversal: ${entryName}`);
}
console.log('   ✓ Custom skill markdown and ZIP export sanitize slugs and paths safely.\n');

// ── Test 18: Additional Invalid Imported Profile JSON Resilience ──────────────
console.log('18. Verifying invalid imported profile JSON is rejected safely without throwing...');
const invalidJsonInputs = [
  '',
  '   ',
  '{bad json',
  'null',
  '[]',
  '"just a string"',
  '12345',
  JSON.stringify({ skills: [] }),
  JSON.stringify({ baseType: 'ZZZZ', skills: [] }),
];

for (const payload of invalidJsonInputs) {
  const res = importProfileJson(payload);
  assert.strictEqual(res.success, false, `Invalid profile JSON should be rejected: ${payload}`);
  assert.ok(typeof res.error === 'string' && res.error.length > 0, 'Rejected import must return an error message');
}

const sanitizedCorruptSkills = importProfileJson(
  JSON.stringify({ baseType: 'INTP', skills: 'not-an-array' })
);
assert.strictEqual(sanitizedCorruptSkills.success, true);
assert.strictEqual(sanitizedCorruptSkills.profile.skills.length, 0);

const sanitizedUnknownSkill = importProfileJson(
  JSON.stringify({ baseType: 'INTP', skills: [{ skillId: 'nonexistent', intensity: 50 }] })
);
assert.strictEqual(sanitizedUnknownSkill.success, true);
assert.strictEqual(sanitizedUnknownSkill.profile.skills.length, 0);
console.log('   ✓ All invalid imported profile JSON payloads rejected or sanitized safely without throwing.\n');

console.log('🎉 ALL 18 TEST SUITES PASSED SUCCESSFULLY!\n');
