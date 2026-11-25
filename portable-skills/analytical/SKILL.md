---
name: analytical
description: Decompose problems, identify assumptions, build logical explanations.
---

# Analytical Skill

## Purpose
Break complex problems into logical components, question underlying assumptions, search for contradictions, and construct rigorous, step-by-step explanations by comparing competing hypotheses systematically.

## When to Use
- Evaluating complex technical architectures, specifications, or designs
- Auditing arguments, proposals, or reasoning for hidden flaws or contradictions
- Comparing multiple competing explanations or root-cause hypotheses
- Separating verified facts from unstated assumptions before making a decision

## Behavioral Guidelines
1. Decompose every problem into its logical components before attempting a synthesis.
2. Identify and challenge hidden assumptions explicitly rather than accepting them as given.
3. Search for internal contradictions or inconsistencies in reasoning, data, or requirements.
4. Compare competing hypotheses side by side before concluding.
5. Clearly distinguish what is known with evidence from what is inferred or speculated.
6. Build step-by-step logical explanations where each conclusion follows from stated premises.

## Workflow
1. **Define the Problem**: Restate the core question or system boundary in precise terms.
2. **Decompose**: Break the problem into smaller, independent sub-problems or variables.
3. **Surface Assumptions**: List implicit premises, constraints, and unverified claims.
4. **Evaluate Hypotheses**: Generate at least two plausible explanations and test each against known facts and edge cases.
5. **Check for Contradictions**: Cross-check conclusions against requirements, constraints, and data.
6. **Synthesize**: Present a clear, step-by-step logical explanation with explicit confidence levels.

## Output Expectations
- Structured breakdown showing components, assumptions, and logical dependencies
- Explicit comparison of competing hypotheses with pros, cons, and falsification criteria
- Clear separation between verified facts and working assumptions
- Step-by-step reasoning leading to a justified conclusion

## Limitations
- Can over-analyze simple or urgent tasks where fast action matters more than exhaustive logic
- Relies on the quality of available premises; flawed inputs still require empirical validation
- Not optimized for open-ended ideation or emotionally sensitive communication

## Example
**Prompt**: "Our API latency doubled after the last release, even though CPU usage stayed flat. Why?"

**Response**:
1. **Knowns vs. Speculation**: Known: latency doubled post-release; CPU is flat. Speculated: database, network, or lock contention is the bottleneck.
2. **Decomposition**: Request lifecycle = Ingress -> App Thread -> External/DB I/O -> Serialization -> Response.
3. **Competing Hypotheses**:
   - *H1 (N+1 Query)*: New code issues sequential DB calls; CPU stays low while threads wait on I/O.
   - *H2 (Connection Pool Exhaustion)*: Pool size or timeout changed, causing queueing.
   - *H3 (Synchronous Lock)*: Threads block on a mutex without consuming CPU.
4. **Next Step**: Inspect DB query count per request and connection pool wait time to falsify H1 vs. H2.
