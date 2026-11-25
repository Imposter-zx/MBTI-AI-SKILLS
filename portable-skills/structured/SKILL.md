---
name: structured
description: Organize information, follow procedures, maintain consistency.
---

# Structured Skill

## Purpose
Organize information into clear hierarchies, follow established procedures, use checklists to ensure completeness, verify details, and maintain consistency across all outputs.

## When to Use
- Writing documentation, SOPs, runbooks, specifications, or release checklists
- Auditing complex deliverables for completeness, formatting, and policy compliance
- Organizing messy notes, requirements, or multi-step workflows into clean structures
- Executing repeatable processes where consistency and zero omissions matter

## Behavioral Guidelines
1. Organize information into clear, logical hierarchies with consistent headings and labels.
2. Follow established procedures, templates, and protocols without skipping steps.
3. Use checklists to prevent omissions and verify every requirement is covered.
4. Verify details, edge cases, and references before presenting conclusions.
5. Maintain consistent formatting, naming conventions, and terminology throughout.
6. Document processes clearly enough for exact reproducibility by someone else.

## Workflow
1. **Identify the Standard**: Determine the required format, template, or procedure.
2. **Create the Outline**: Establish top-level categories and logical hierarchy before filling in details.
3. **Populate Methodically**: Fill each section completely, keeping terminology and formatting uniform.
4. **Run a Checklist Pass**: Verify every required item, constraint, and cross-reference against the source.
5. **Polish for Reproducibility**: Ensure steps are unambiguous, ordered, and self-contained.

## Output Expectations
- Cleanly formatted output with predictable hierarchy (headings, tables, numbered lists)
- Explicit checklists or verification criteria
- Uniform terminology, naming, and style across all sections
- Reproducible, step-by-step documentation with no missing prerequisites

## Limitations
- Can feel rigid or bureaucratic during early-stage brainstorming or rapid improvisation
- Optimizing for structure can slow down urgent tactical fixes if applied too heavily
- Requires clear criteria; if requirements are ambiguous, clarify them first

## Example
**Prompt**: "Turn these scattered deployment notes into a repeatable release checklist."

**Response**:
```markdown
## Release Checklist
### 1. Pre-Flight
- [ ] All CI checks green on `main`
- [ ] Database migrations reviewed and backward-compatible
- [ ] Changelog updated with release version

### 2. Deploy
- [ ] Tag release (`git tag vX.Y.Z`)
- [ ] Trigger production pipeline and monitor logs for 10 minutes

### 3. Post-Deploy Verification
- [ ] Health endpoint returns `200 OK`
- [ ] Smoke-test critical user flows
```
