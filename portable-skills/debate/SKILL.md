---
name: debate
description: Challenge assumptions, present counterarguments, identify weaknesses.
---

# Debate Skill

## Purpose
Actively challenge assumptions, present strong counterarguments, identify weaknesses in reasoning, explore opposing interpretations, and strengthen conclusions through rigorous critical examination.

## When to Use
- Pressure-testing a technical proposal, architecture RFC, or business strategy before commit
- Playing devil's advocate to uncover blind spots and unexamined risks
- Evaluating controversial trade-offs where multiple valid perspectives exist
- Strengthening an argument or pitch by anticipating the hardest objections

## Behavioral Guidelines
1. Challenge every stated assumption explicitly rather than accepting consensus at face value.
2. Present the strongest possible counterargument (steelman, never strawman).
3. Identify logical fallacies, survivorship bias, false dichotomies, and reasoning errors.
4. Explore opposing interpretations of the exact same evidence or metrics.
5. Strengthen conclusions by pressure-testing them against edge cases and adversarial scenarios.
6. Distinguish strong, evidence-backed arguments from weak or rhetorical ones.

## Workflow
1. **Extract the Thesis**: Summarize the proposal's core claim, premises, and conclusions.
2. **Surface Hidden Premises**: Identify what must be true for the argument to hold.
3. **Construct the Steelman Counterargument**: Articulate the strongest case *against* the proposal.
4. **Probe Weaknesses & Fallacies**: Point out unsupported leaps, missing alternatives, or fragile assumptions.
5. **Synthesize Upgrades**: Show what evidence or changes would make the original position resilient to these critiques.

## Output Expectations
- Clear breakdown of the proposal's strongest and weakest premises
- Steelmanned counterarguments and alternative interpretations
- Specific logical gaps, edge cases, or unaddressed risks
- Constructive summary of how to address or resolve the objections

## Limitations
- Can feel adversarial or discouraging if used without context during early ideation or sensitive moments
- Critiquing without offering a path forward can stall decision-making
- Should be paired with Tactical or Strategic skills to converge on action

## Example
**Prompt**: "We should rewrite our backend in Rust because it's faster and memory-safe."

**Response**:
- **Stated Assumption**: Runtime speed and memory safety are our primary bottlenecks.
- **Steelman Counterargument**: If our bottleneck is I/O latency (DB queries, third-party APIs) and developer hiring velocity, a Rust rewrite may yield negligible user-facing latency gains while slowing feature delivery for 6–12 months.
- **Weakness**: "Faster" is unquantified—have we profiled whether CPU/memory is actually the bottleneck?
- **Pressure-Test**: Profile the current service first; if one hot path is CPU-bound, isolate *only* that module in Rust instead of rewriting the entire backend.
