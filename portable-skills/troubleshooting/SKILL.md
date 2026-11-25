---
name: troubleshooting
description: Diagnose problems systematically, identify root causes, fix.
---

# Troubleshooting Skill

## Purpose
Systematically diagnose problems by distinguishing symptoms from root causes, forming testable hypotheses, isolating variables, and providing concrete fixes with clear verification steps.

## When to Use
- Debugging failing tests, runtime errors, regressions, or environment issues
- Investigating intermittent production incidents or unexpected system behavior
- Resolving configuration, build, or integration failures
- Documenting root-cause analyses and step-by-step remediation

## Behavioral Guidelines
1. Separate observable symptoms from underlying root causes before proposing a fix.
2. Form specific, testable hypotheses rather than guessing randomly.
3. Isolate variables systematically (binary search, minimal reproduction, toggling one factor at a time).
4. Verify every fix with concrete checks rather than assuming it worked.
5. Document the diagnostic trail (what was tested, ruled out, and confirmed) for future reference.
6. Provide concrete, step-by-step remediation instructions including rollback or prevention.

## Workflow
1. **Capture Symptoms**: Record exact error messages, logs, reproduction steps, and recent changes.
2. **Distinguish Symptom vs. Cause**: Ask what upstream failure would produce this exact symptom.
3. **Form & Rank Hypotheses**: List the most likely root causes and how to test each quickly.
4. **Isolate & Test**: Narrow down the failing component or variable with targeted checks.
5. **Apply Remediation**: Implement the minimal fix addressing the confirmed root cause.
6. **Verify & Document**: Re-run the failing scenario, confirm resolution, and record the root cause and fix.

## Output Expectations
- Clear distinction between observed symptoms and confirmed/suspected root cause
- Ordered diagnostic steps showing how to isolate the issue
- Concrete remediation steps with exact commands, config, or code changes
- Verification criteria proving the issue is resolved

## Limitations
- Slower than pure guesswork on trivial, one-line typos (though safer)
- Requires observable signals (logs, repro steps, metrics); blocked if no diagnostic data exists
- Focuses on restoring intended behavior rather than redesigning the broader system

## Example
**Prompt**: "Users report `401 Unauthorized` right after logging in on staging, though local works fine."

**Response**:
1. **Symptom**: `401 Unauthorized` on post-login API calls in staging only.
2. **Hypotheses**:
   - *H1*: Auth cookie has `Secure` flag over HTTP or mismatched `Domain`/`SameSite`.
   - *H2*: Staging uses a different JWT signing secret between auth and API services.
3. **Isolate**: Inspect the `Set-Cookie` response header in staging DevTools and decode the token header/signature.
4. **Remediation & Verify**: Align `JWT_SECRET` across staging services (or set `SameSite=Lax; Domain=.staging.example.com`), then re-test login + `/api/me` and confirm `200 OK`.
