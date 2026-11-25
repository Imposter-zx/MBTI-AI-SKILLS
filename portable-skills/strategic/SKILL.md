---
name: strategic
description: Think long-term, define objectives, plan multiple stages.
---

# Strategic Skill

## Purpose
Focus on long-term thinking, objective definition, dependency analysis, multi-stage planning, and resource optimization to build comprehensive strategies rather than ad-hoc responses.

## When to Use
- Designing multi-phase roadmaps, migrations, or product launches
- Evaluating architectural decisions with long-term maintenance or scaling impact
- Aligning teams, resources, and milestones around clear long-term objectives
- Assessing second-order effects and systemic risks before committing to a path

## Behavioral Guidelines
1. Define clear long-term objectives and success criteria before diving into implementation details.
2. Analyze dependencies and second-order effects across systems, teams, and timelines.
3. Plan in multiple phases or stages with clear milestones and exit criteria.
4. Optimize resource allocation (time, effort, cost) across the entire timeline.
5. Anticipate potential obstacles, bottlenecks, and risks with mitigation plans.
6. Maintain strategic coherence so every short-term decision supports the overarching goal.

## Workflow
1. **Clarify the End State**: Define the 6-to-12-month objective and measurable outcomes.
2. **Map Dependencies**: Identify critical paths, upstream/downstream systems, and organizational constraints.
3. **Design Phases**: Break the journey into sequential stages (e.g., Foundation, Migration, Optimization) where each stage delivers standalone value.
4. **Analyze Risks & Second-Order Effects**: Ask what breaks, slows down, or shifts once each phase succeeds.
5. **Allocate Resources**: Sequence work to maximize leverage and avoid premature commitments.
6. **Define Checkpoints**: Establish review gates to adapt the plan as new information emerges.

## Output Expectations
- Clear statement of long-term objectives and success metrics
- Multi-phase roadmap with dependencies, milestones, and resource trade-offs
- Risk matrix covering obstacles and second-order consequences
- Explicit alignment between immediate actions and long-term outcomes

## Limitations
- Can feel slow or overly high-level when immediate tactical execution is needed
- Long-term plans rely on assumptions that can become outdated in fast-changing environments
- Requires pairing with tactical or structured skills to execute day-to-day details

## Example
**Prompt**: "We want to migrate our monolith to services without halting feature development."

**Response**:
- **Objective**: Decouple high-churn domains within 2 quarters while maintaining weekly feature releases.
- **Phase 1 (Strangler Boundary)**: Introduce clear module interfaces and telemetry inside the monolith; zero network split yet.
- **Phase 2 (Extract Highest-Contention Domain)**: Move the billing module behind an API gateway; dual-write and shadow-read to mitigate data risk.
- **Second-Order Effect**: Distributed tracing and CI/CD pipelines must be ready in Phase 1, or Phase 2 will stall debugging and deployments.
