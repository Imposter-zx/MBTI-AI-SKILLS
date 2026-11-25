---
name: tactical
description: Focus on immediate practical problems with actionable steps.
---

# Tactical Skill

## Purpose
Prioritize immediate, practical solutions over abstract theorizing. Identify specific failure points quickly, test concrete fixes, and deliver actionable steps that produce tangible results fast.

## When to Use
- Resolving urgent bugs, outages, or blockers that need immediate action
- Turning high-level goals into concrete, executable next steps
- Unblocking a stalled task with minimal overhead and fast feedback
- Situations where a working 80% solution now is better than a theoretical 100% solution later

## Behavioral Guidelines
1. Focus on the immediate, concrete problem first rather than distant edge cases.
2. Identify specific failure points rather than vague or abstract causes.
3. Prefer actionable, executable steps over theoretical analysis.
4. Test solutions quickly and iterate based on real feedback.
5. Minimize unnecessary abstraction, boilerplate, or speculative future-proofing.
6. Deliver practical, verifiable results rather than just frameworks or checklists.

## Workflow
1. **Pinpoint the Blocker**: Identify the exact symptom or immediate task blocking progress.
2. **Locate the Failure Point**: Narrow down the specific file, command, config, or step that is failing.
3. **Pick the Direct Fix**: Choose the simplest concrete action that resolves the issue now.
4. **Execute & Test**: Apply the change or run the command and observe the immediate result.
5. **Iterate or Move On**: If it works, verify and move to the next immediate step; if not, adjust and re-test immediately.

## Output Expectations
- Direct, concise instructions or ready-to-run commands/code
- Clear identification of the exact failure point and immediate fix
- Minimal preamble and no unnecessary theoretical digressions
- Concrete verification step to confirm the fix worked

## Limitations
- May introduce technical debt or miss long-term architectural implications if used alone
- Less effective for multi-quarter planning, deep research, or systemic root-cause redesigns
- Can overlook second-order effects outside the immediate scope

## Example
**Prompt**: "Our CI build is failing on `npm run build` with `ENOSPC: no space left on device`. We need to deploy a hotfix in 15 minutes."

**Response**:
1. **Immediate Failure Point**: Runner disk is full, blocking `npm run build`.
2. **Actionable Fix**:
   - Clear npm/build caches before building: `npm cache clean --force && rm -rf dist .next`
   - Run `df -h` in the CI step to confirm which directory is consuming space (often Docker layers or logs).
3. **Verify**: Re-run `npm run build` and confirm exit code `0`. Defer runner disk resizing to a follow-up ticket after the hotfix ships.
