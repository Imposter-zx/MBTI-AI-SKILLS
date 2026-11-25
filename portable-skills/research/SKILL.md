---
name: research
description: Separate facts from assumptions, build evidence-based conclusions.
---

# Research Skill

## Purpose
Systematically separate facts from assumptions, identify missing information, compare multiple sources, and build evidence-based conclusions rather than relying on intuition or convention.

## When to Use
- Investigating unfamiliar technologies, APIs, standards, or market landscapes
- Fact-checking claims, benchmarks, or architectural recommendations
- Synthesizing information from multiple documents, codebases, or perspectives
- Preparing decision memos where accuracy, citations, and uncertainty bounds matter

## Behavioral Guidelines
1. Separate established facts from working assumptions or unverified claims.
2. Identify missing information and knowledge gaps before drawing conclusions.
3. Compare multiple independent sources or perspectives to avoid single-source bias.
4. Build evidence-based conclusions rather than relying on intuition, hype, or convention.
5. Quantify uncertainty and state confidence levels explicitly where evidence is incomplete.
6. Cite or reference concrete support (files, docs, data, observations) for key claims.

## Workflow
1. **Frame the Research Question**: Define what needs to be known and what decision it informs.
2. **Audit Current Knowledge**: List verified facts, unverified claims, and explicit gaps.
3. **Gather & Cross-Check Sources**: Inspect primary documentation, code, or empirical data across multiple sources.
4. **Reconcile Conflicts**: Note where sources agree, disagree, or lack coverage.
5. **Synthesize Findings**: Present evidence-backed conclusions with citations and explicit confidence/uncertainty notes.

## Output Expectations
- Clear separation of verified facts, assumptions, and open questions
- Cross-referenced findings with citations to specific sources or files
- Explicit statement of confidence levels and what would change the conclusion
- Actionable summary grounded in observed evidence

## Limitations
- Takes more time than quick intuition when speed is the top priority
- Cannot invent evidence that isn't accessible; must report gaps honestly when sources are missing
- Analysis paralysis risk if research scope isn't bounded by a clear decision

## Example
**Prompt**: "Does our current auth library support WebAuthn passkeys out of the box?"

**Response**:
- **Verified Facts**: Checked `package.json` (`auth-lib@2.4.1`) and `node_modules/auth-lib/README.md`—only OAuth2 and email/password strategies are exported.
- **Unverified / Missing**: Whether v3.x (latest) adds WebAuthn support or requires a separate adapter plugin.
- **Conclusion (High Confidence)**: Current installed version (`2.4.1`) does not support passkeys natively.
- **Next Step**: Check official v3 release notes before deciding between upgrading vs. adding `@simplewebauthn/server`.
