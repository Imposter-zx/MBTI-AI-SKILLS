---
name: optimization
description: Compare alternatives, identify bottlenecks, reduce complexity.
---

# Optimization Skill

## Purpose
Compare alternatives systematically to find the most efficient solution, identify performance bottlenecks, eliminate unnecessary complexity, and improve resource utilization and scalability.

## When to Use
- Improving application performance, query latency, bundle size, or cloud costs
- Simplifying over-engineered architectures, workflows, or codebases
- Comparing competing tools, algorithms, or designs on measurable trade-offs
- Preparing a system to scale under higher load without proportional cost increases

## Behavioral Guidelines
1. Always compare multiple alternatives before recommending a single approach.
2. Identify the specific bottleneck or inefficiency using measurement rather than guessing.
3. Eliminate unnecessary complexity, layers, and steps from solutions.
4. Quantify improvements (latency, memory, cost, steps saved) wherever possible.
5. Consider trade-offs explicitly (e.g., speed vs. readability, caching vs. staleness).
6. Prefer solutions that scale cleanly under load and growth.

## Workflow
1. **Measure Baseline**: Establish current performance, cost, or complexity metrics.
2. **Locate the Bottleneck**: Identify the single constraint dominating total cost or latency.
3. **Evaluate Alternatives**: Compare 2–3 concrete optimization options (including "simplify/remove").
4. **Assess Trade-Offs**: Weigh gains against maintenance burden, correctness risk, and operational complexity.
5. **Implement & Re-Measure**: Apply the highest-leverage change and quantify the before/after delta.

## Output Expectations
- Identification of the primary bottleneck backed by reasoning or metrics
- Side-by-side comparison of alternatives with explicit trade-offs
- Quantified (or clearly bounded) expected impact
- Simpler, leaner design or implementation path

## Limitations
- Premature optimization can waste time and hurt readability on non-bottleneck paths
- Optimizing a single metric (e.g., raw speed) can degrade others (e.g., maintainability) if trade-offs are ignored
- Requires accurate baseline data to avoid optimizing the wrong component

## Example
**Prompt**: "Our dashboard takes 4.2s to load. How should we speed it up?"

**Response**:
1. **Bottleneck**: Check the waterfall—3.1s is spent running 6 sequential API calls on mount, and 800ms is parsing a 1.4MB unpaginated JSON payload.
2. **Alternatives**:
   - *Option A (Parallelize + Paginate)*: Fetch endpoints in parallel and paginate table data to 50 rows. High impact, low complexity.
   - *Option B (Add Redis Cache)*: Cache responses server-side. Helps repeat loads, doesn't fix payload size.
3. **Recommendation**: Start with Option A (eliminates sequential waterfall + cuts payload ~90%), then measure before adding caching infrastructure.
