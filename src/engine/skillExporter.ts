import JSZip from 'jszip';
import type {
  CognitiveProfile,
  CustomSkill,
  MBTITypeCode,
  Skill,
  SkillPack,
} from '../types';
import { skills, skillsById } from '../data/skills';
import { mbtiProfiles, profilesByType } from '../data/mbtiProfiles';
import {
  clampIntensity,
  deriveProblemSolvingWorkflow,
  generateCognitiveProfileName,
  generateSystemPrompt,
  getIntensityTier,
} from './promptGenerator';
import { exportProfileJson } from './profileSerializer';

// ─── Helpers ─────────────────────────────────────────────────────────────────

/**
 * Sanitize an arbitrary string into a lowercase alphanumeric + hyphen slug
 * safe for filenames and directory names.
 */
export function sanitizeSlug(name: string): string {
  const cleaned = String(name ?? '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 64)
    .replace(/-+$/g, '');

  return cleaned || 'custom-skill';
}

function sanitizeFilename(filename: string): string {
  const base = String(filename ?? '')
    .replace(/[/\\]+/g, '-')
    .replace(/\.\.+/g, '.')
    .replace(/[^a-zA-Z0-9._-]+/g, '-')
    .replace(/^-+|-+$/g, '');

  return base || 'export.txt';
}

function formatYamlString(value: string): string {
  const singleLine = String(value ?? '')
    .replace(/[\r\n]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  const escaped = singleLine.replace(/\\/g, '\\\\').replace(/"/g, '\\"');
  return `"${escaped}"`;
}

function buildInstallationGuideSection(skillOrProfileLabel: string): string {
  return `## Installation Guide

### Method 1: Native Skill Support
If your AI tool natively supports \`SKILL.md\` skill packages, place this directory (containing \`SKILL.md\`) into your tool's configured skills folder. Consult your tool's official documentation for the exact directory path, as native skill discovery paths vary by tool and version.

### Method 2: Manual Usage (Universal)
Copy the Markdown instructions from \`SKILL.md\` and paste them directly into:
- Your AI assistant's **System Prompt**, **Custom Instructions**, or **Project Instructions**
- A **Gem**, **Custom GPT**, or **Claude Project**
- The start of a new conversation as behavioral context for **${skillOrProfileLabel}**`;
}

function buildYamlFrontmatter(name: string, description: string): string {
  return `---
name: ${formatYamlString(name)}
description: ${formatYamlString(description)}
---`;
}

// ─── Single Built-in Skill Exporters ─────────────────────────────────────────

export function generateSkillMarkdown(skill: Skill): string {
  const behaviorsList = skill.behaviors.map((b) => `- ${b}`).join('\n');
  const workflowSteps = [
    `Identify the user's objective, constraints, and context.`,
    ...skill.behaviors.slice(0, 4).map((b) => `${b}.`),
    `Verify the output against the requested goal and state any remaining uncertainty.`,
  ]
    .map((step, idx) => `${idx + 1}. ${step}`)
    .join('\n');

  const exampleText = generateSkillExample(skill);
  const compatibleList = skill.compatibleProfiles.join(', ');

  return `${buildYamlFrontmatter(skill.id, skill.shortDescription)}

# ${skill.name} Skill

> **Experimental Cognitive Skill** — Part of the MBTI AI Skills framework. This skill defines a reusable AI interaction pattern, not a psychological diagnosis.

## Purpose

${skill.description}

## When to Use

- Tags: ${skill.tags.map((t) => `\`${t}\``).join(', ')}
- Commonly paired with experimental profiles: ${compatibleList}
- Use when you want the AI to emphasize **${skill.name.toLowerCase()}** reasoning and behavior.

## Behavioral Guidelines

${behaviorsList}

## Workflow

${workflowSteps}

## Output Expectations

- Apply the **${skill.name}** guidelines consistently throughout the response.
- Separate verified facts from assumptions or speculative hypotheses.
- Keep reasoning transparent and actionable.

## Limitations

- This is an experimental prompting/interaction pattern and does not guarantee domain accuracy on its own.
- Combine with clear user constraints and verification for high-stakes engineering or factual tasks.

## Example

${exampleText}

${buildInstallationGuideSection(`${skill.name} Skill`)}
`;
}

export function generateSkillReadme(skill: Skill): string {
  return `# ${skill.name} Skill (\`${skill.id}\`)

${skill.shortDescription}

## Overview

${skill.description}

## Included Files

- \`SKILL.md\` — Portable skill definition with YAML frontmatter and behavioral directives.
- \`README.md\` — Overview and usage notes.
- \`examples/example-1.md\` — Sample application of this skill.

## Tags

${skill.tags.map((t) => `- \`${t}\``).join('\n')}

## Compatible Experimental Profiles

${skill.compatibleProfiles.join(', ')}
`;
}

export function generateSkillExample(skill: Skill): string {
  const topBehaviors = skill.behaviors.slice(0, 3).map((b) => `- ${b}`).join('\n');
  return `# Example: Applying the ${skill.name} Skill

**Scenario:** A user asks for help evaluating a complex technical or strategic decision.

**How the AI applies \`${skill.id}\`:**
${topBehaviors}

**Expected Result:**
The AI structures its response around ${skill.shortDescription.toLowerCase()} while making assumptions and next steps explicit.
`;
}

// ─── Custom Skill Exporters ──────────────────────────────────────────────────

export type CustomSkillInput = Omit<CustomSkill, 'id' | 'createdAt' | 'slug'> & {
  slug?: string;
};

export function generateCustomSkillMarkdown(skill: CustomSkillInput): string {
  const slug = sanitizeSlug(skill.slug || skill.name);
  const name = skill.name.trim() || 'Custom Skill';
  const description = skill.description.trim() || 'Custom experimental AI cognitive skill.';
  const purpose = skill.purpose.trim() || description;
  const behaviors =
    skill.behaviors.filter((b) => b.trim()).length > 0
      ? skill.behaviors.filter((b) => b.trim()).map((b) => `- ${b.trim()}`).join('\n')
      : '- Follow the stated purpose clearly and consistently.';
  const workflow =
    skill.workflow.filter((w) => w.trim()).length > 0
      ? skill.workflow.filter((w) => w.trim()).map((w, i) => `${i + 1}. ${w.trim()}`).join('\n')
      : '1. Clarify the user request.\n2. Apply the custom behavioral guidelines.\n3. Deliver a clear, verifiable response.';
  const examples =
    skill.examples.filter((e) => e.trim()).length > 0
      ? skill.examples.filter((e) => e.trim()).map((e, i) => `### Example ${i + 1}\n\n${e.trim()}`).join('\n\n')
      : 'No examples provided. Supply a sample prompt or scenario to test this skill.';
  const tagsLine =
    skill.tags.filter((t) => t.trim()).length > 0
      ? skill.tags.filter((t) => t.trim()).map((t) => `\`${t.trim()}\``).join(', ')
      : '`custom`';

  return `${buildYamlFrontmatter(slug, description)}

# ${name}

> **Custom Experimental Cognitive Skill** — Treat all directives as configurable interaction patterns.

## Purpose

${purpose}

## When to Use

- Tags: ${tagsLine}
- ${description}

## Behavioral Guidelines

${behaviors}

## Workflow

${workflow}

## Output Expectations

- Follow the workflow steps in order where applicable.
- Distinguish verified information from assumptions.

## Limitations

- Custom skill behavior depends on model capabilities and clear user context.

## Examples

${examples}

${buildInstallationGuideSection(name)}
`;
}

export function generateCustomSkillReadme(skill: CustomSkillInput): string {
  const slug = sanitizeSlug(skill.slug || skill.name);
  const name = skill.name.trim() || 'Custom Skill';
  return `# ${name} (\`${slug}\`)

${skill.description.trim() || 'Custom experimental AI cognitive skill.'}

## Files

- \`SKILL.md\` — Portable custom skill definition.
- \`README.md\` — Package overview.
`;
}

// ─── Browser Download Helpers ────────────────────────────────────────────────

export function downloadBlob(filename: string, blob: Blob): void {
  if (typeof document === 'undefined' || typeof URL === 'undefined') {
    return;
  }

  const safeName = sanitizeFilename(filename);
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = safeName;
  link.style.display = 'none';
  document.body.appendChild(link);
  try {
    link.click();
  } finally {
    document.body.removeChild(link);
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
}

export function downloadTextFile(
  filename: string,
  content: string,
  mimeType = 'text/markdown;charset=utf-8'
): void {
  if (typeof document === 'undefined') {
    return;
  }

  const blob = new Blob([content], { type: mimeType });
  downloadBlob(filename, blob);
}

// ─── ZIP Builders for Skills ─────────────────────────────────────────────────

export async function buildSkillZip(skill: Skill): Promise<Blob> {
  const zip = new JSZip();
  const folder = zip.folder(sanitizeSlug(skill.id)) ?? zip;
  folder.file('SKILL.md', generateSkillMarkdown(skill));
  folder.file('README.md', generateSkillReadme(skill));
  folder.file('examples/example-1.md', generateSkillExample(skill));
  return zip.generateAsync({ type: 'blob' });
}

export async function buildAllSkillsZip(): Promise<Blob> {
  const zip = new JSZip();

  const skillRows = skills
    .map((s) => `- **${s.name}** (\`skills/${s.id}/SKILL.md\`) — ${s.shortDescription}`)
    .join('\n');

  const rootReadme = `# MBTI AI Skills Library

Experimental, portable cognitive skill modules for AI assistants.

> Note: MBTI-inspired profiles and skills in this library are experimental software interaction patterns, not scientific psychological claims.

## Included Skills (${skills.length})

${skillRows}

## Usage

Each skill directory under \`skills/<id>/\` contains:
- \`SKILL.md\` — Portable skill definition with YAML frontmatter
- \`README.md\` — Skill summary and metadata
`;

  zip.file('README.md', rootReadme);

  for (const skill of skills) {
    const dir = `skills/${sanitizeSlug(skill.id)}`;
    zip.file(`${dir}/SKILL.md`, generateSkillMarkdown(skill));
    zip.file(`${dir}/README.md`, generateSkillReadme(skill));
  }

  return zip.generateAsync({ type: 'blob' });
}

export async function buildCustomSkillZip(skill: CustomSkillInput): Promise<Blob> {
  const zip = new JSZip();
  const slug = sanitizeSlug(skill.slug || skill.name);
  const folder = zip.folder(slug) ?? zip;
  folder.file('SKILL.md', generateCustomSkillMarkdown(skill));
  folder.file('README.md', generateCustomSkillReadme(skill));
  return zip.generateAsync({ type: 'blob' });
}

// ─── MBTI Skill Packs ────────────────────────────────────────────────────────

export function getMbtiSkillPacks(): SkillPack[] {
  return mbtiProfiles.map((profile) => ({
    type: profile.type,
    name: `${profile.type} — ${profile.name} Pack`,
    tagline: profile.tagline,
    category: profile.category,
    skills: [...profile.recommendedSkills],
    description: `Experimental ${profile.type}-inspired skill pack (${profile.tagline}). A configurable interaction pattern, not a psychological fact: ${profile.description}`,
  }));
}

export function generateSkillPackMarkdown(type: MBTITypeCode): string {
  const profile = profilesByType[type];
  if (!profile) {
    return `# Unknown Skill Pack (${type})\n\nProfile not found.`;
  }

  const recommended = profile.recommendedSkills
    .map((id) => skillsById[id])
    .filter((s): s is Skill => Boolean(s));

  const skillSections = recommended
    .map(
      (s, idx) => `### ${idx + 1}. ${s.name} (\`${s.id}\`)
${s.description}

**Key Behaviors:**
${s.behaviors.map((b) => `- ${b}`).join('\n')}`
    )
    .join('\n\n');

  return `${buildYamlFrontmatter(
    `${profile.type.toLowerCase()}-skill-pack`,
    `Experimental ${profile.type}-inspired cognitive skill pack (${profile.name}).`
  )}

# ${profile.type} (${profile.name}) — Experimental Skill Pack

> **Experimental Configuration Notice:** This pack is an experimental interaction design pattern inspired by ${profile.type} (${profile.tagline}). It is not a psychological diagnosis or scientific claim about human personality.

- **Category:** ${profile.category}
- **Cognitive Style:** ${profile.cognitiveStyle}
- **Communication Style:** ${profile.communicationStyle}
- **Problem-Solving Style:** ${profile.problemSolvingStyle}

## Included Skills (${recommended.length})

${skillSections}

## Base Prompt Template

\`\`\`text
${profile.examplePrompt}
\`\`\`

${buildInstallationGuideSection(`${profile.type} Skill Pack`)}
`;
}

export async function buildSkillPackZip(type: MBTITypeCode): Promise<Blob> {
  const zip = new JSZip();
  const profile = profilesByType[type];
  const recommended = (profile?.recommendedSkills ?? [])
    .map((id) => skillsById[id])
    .filter((s): s is Skill => Boolean(s));

  const packMetadata = {
    schema: 'mbti-ai-skills-pack/v1',
    experimental: true,
    type,
    name: profile ? `${profile.type} — ${profile.name} Pack` : `${type} Pack`,
    tagline: profile?.tagline ?? '',
    category: profile?.category ?? 'Analysts',
    skills: recommended.map((s) => s.id),
    exportedAt: new Date().toISOString(),
  };

  zip.file('README.md', generateSkillPackMarkdown(type));
  zip.file('pack.json', JSON.stringify(packMetadata, null, 2));

  for (const skill of recommended) {
    zip.file(`skills/${sanitizeSlug(skill.id)}/SKILL.md`, generateSkillMarkdown(skill));
  }

  return zip.generateAsync({ type: 'blob' });
}

// ─── Cognitive Profile Exporters ─────────────────────────────────────────────

export function generateCognitiveProfileSkillMd(profile: Partial<CognitiveProfile>): string {
  const baseType = profile.baseType ?? 'INTJ';
  const mbti = profilesByType[baseType];
  const profileName =
    profile.name?.trim() || generateCognitiveProfileName(baseType, profile.skills ?? []);
  const slug = sanitizeSlug(profileName);
  const commStyle = profile.communicationStyle || profile.communicationPreference || 'Balanced';
  const customInstructions = profile.customInstructions?.trim();

  const sortedSkills = [...(profile.skills ?? [])]
    .map((s) => ({ ...s, intensity: clampIntensity(s.intensity) }))
    .sort((a, b) => b.intensity - a.intensity);

  const skillsSection =
    sortedSkills.length > 0
      ? sortedSkills
          .map((si) => {
            const skill = skillsById[si.skillId];
            if (!skill) return `- \`${si.skillId}\`: ${si.intensity}%`;
            const tier = getIntensityTier(si.intensity);
            return `- **${skill.name}** (\`${skill.id}\`) — **${si.intensity}%** (${tier.label}): ${skill.shortDescription}`;
          })
          .join('\n')
      : '- Operating with base profile defaults (no secondary skills configured).';

  const workflowSection = deriveProblemSolvingWorkflow(profile)
    .map((step, idx) => `${idx + 1}. ${step}`)
    .join('\n');

  const systemPrompt = generateSystemPrompt({
    ...profile,
    baseType,
    name: profileName,
  });

  const shortDesc = `Experimental ${baseType}-inspired Cognitive Profile (${profileName}) with ${sortedSkills.length} configured skill(s).`;

  return `${buildYamlFrontmatter(slug, shortDesc)}

# ${profileName}

> **Experimental Cognitive Profile** — Inspired by ${baseType}${mbti ? ` (${mbti.name})` : ''}. Configurable software interaction pattern, not a psychological diagnosis.

## Base MBTI-Inspired Profile

- **Type:** ${baseType}${mbti ? ` — ${mbti.name} (${mbti.tagline})` : ''}
- **Category:** ${mbti?.category ?? 'Custom'}
- **Cognitive Style:** ${mbti?.cognitiveStyle ?? 'Structured reasoning'}

## Active Skills & Intensities

${skillsSection}

## Communication Preferences

- **Style:** ${commStyle}

## Custom Instructions

${customInstructions || '_None specified._'}

## Behavioral Workflow

${workflowSection}

## Instructions for the AI

\`\`\`markdown
${systemPrompt}
\`\`\`

${buildInstallationGuideSection(profileName)}
`;
}

export function generateCognitiveProfileReadme(profile: Partial<CognitiveProfile>): string {
  const baseType = profile.baseType ?? 'INTJ';
  const profileName =
    profile.name?.trim() || generateCognitiveProfileName(baseType, profile.skills ?? []);
  const slug = sanitizeSlug(profileName);

  return `# ${profileName}

Portable Cognitive Profile exported from **MBTI AI Skills**.

- **Slug:** \`${slug}\`
- **Base MBTI-Inspired Type:** ${baseType}
- **Communication Style:** ${profile.communicationStyle || profile.communicationPreference || 'Balanced'}
- **Active Skills:** ${(profile.skills ?? []).length}

## Included Files

- \`SKILL.md\` — Portable skill & instruction file with YAML frontmatter.
- \`profile.json\` — Machine-readable profile configuration (re-importable in Builder).
- \`README.md\` — Package overview.
`;
}

export function generateCognitiveProfileMarkdown(profile: Partial<CognitiveProfile>): string {
  return generateCognitiveProfileSkillMd(profile);
}

export async function buildCognitiveProfileZip(
  profile: Partial<CognitiveProfile>
): Promise<Blob> {
  const zip = new JSZip();
  const baseType = profile.baseType ?? 'INTJ';
  const profileName =
    profile.name?.trim() || generateCognitiveProfileName(baseType, profile.skills ?? []);
  const slug = sanitizeSlug(profileName);
  const folder = zip.folder(slug) ?? zip;

  folder.file('SKILL.md', generateCognitiveProfileSkillMd(profile));
  folder.file('profile.json', exportProfileJson({ ...profile, baseType, name: profileName }));
  folder.file('README.md', generateCognitiveProfileReadme(profile));

  return zip.generateAsync({ type: 'blob' });
}
