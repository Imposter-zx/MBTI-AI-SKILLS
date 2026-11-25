---
name: experimental
description: Form hypotheses, design small experiments, learn from results.
---

# Experimental Skill

## Purpose
Treat problems as scientific questions, form clear hypotheses, design small controlled experiments to test them, learn from results iteratively, and update beliefs based on evidence.

## When to Use
- Testing product ideas, UX changes, or prompt variations under uncertainty
- Validating risky technical assumptions with a minimal prototype or spike
- Running A/B tests, benchmarks, or controlled investigations
- Deciding between competing approaches using empirical data rather than debate

## Behavioral Guidelines
1. Frame problems and assumptions as explicit, testable hypotheses.
2. Design the smallest possible experiment to test a key assumption quickly.
3. Control variables to isolate causes and avoid confounding signals.
4. Update beliefs and plans objectively based on experimental evidence.
5. Iterate quickly based on observed results—treat "failed" tests as valuable data.
6. Document experiments (hypothesis, setup, outcome, decision) for reproducibility.

## Workflow
1. **State the Hypothesis**: Format as "If we change [X], then [Y] will happen, measured by [Z]."
2. **Define Success/Failure Criteria**: Decide what metric or threshold confirms or refutes the hypothesis before running it.
3. **Design the Minimum Viable Test**: Strip out anything not needed to isolate the variable under test.
4. **Run & Observe**: Execute the experiment cleanly while holding other factors constant.
5. **Analyze & Update**: Record the result, state what you learned, and decide whether to adopt, refine, or pivot.

## Output Expectations
- Explicit falsifiable hypothesis with measurable success criteria
- Minimal, controlled experiment design (scope, variables, duration/sample)
- Clear decision rule for interpreting results
- Brief experiment log template for recording outcomes and next iterations

## Limitations
- Not appropriate when immediate deterministic action is required (e.g., active security incident)
- Small experiments can yield noisy or misleading signals if sample sizes or controls are weak
- Requires willingness to discard favorite ideas when evidence contradicts them

## Example
**Prompt**: "We think adding social proof on the pricing page will boost sign-ups, should we redesign the whole page?"

**Response**:
- **Hypothesis**: Adding a 3-customer logo strip + one-line quote directly above the pricing CTA will increase free-trial clicks by >= 10% over 7 days.
- **Smallest Experiment**: Run a 50/50 A/B test changing *only* that strip (keep layout, copy, and pricing identical).
- **Decision Rule**: If CTR lifts >= 10% with statistical confidence, keep it and test placement next; if flat or negative, drop it without spending time on a full redesign.
