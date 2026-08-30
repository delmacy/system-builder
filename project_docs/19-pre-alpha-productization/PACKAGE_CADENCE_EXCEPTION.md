# P19 Extended Package Cadence Exception

Status: AUTHORIZED PLANNING EXCEPTION / EXECUTION REMAINS ROLLING-WAVE
Date: 2026-08-30
Applies only to: `P19-PACKAGE-01 — Consolidated Pre-Alpha Productization`

## Decision
P19-PACKAGE-01 is explicitly authorized as an extended consolidation Work Package. For this Package only, the default cadence in `project_docs/schedule/SPRINT_GENERATION_POLICY.md` is extended from two required Construction Sprints plus an optional third to a forecast of eight bounded sequential Construction Sprints, followed by Package Integration & Product Acceptance and Documentation & Closure.

## Rationale
The remaining pre-alpha scope is one cumulative productization chain: integrated factory journey -> operator bootstrap -> autonomous runtime handoff -> real dogfood -> successor evolution -> pre-alpha acceptance. These are not independent architecture Packages; each proof consumes the exact integrated outcome of its predecessor. Repeating Package-level Planning/Review/Closure between those slices would add governance boundaries without changing outcome ownership.

## What this exception does not change
- Rolling-wave commitment remains mandatory.
- Forecast remains non-executable.
- Only the next eligible Sprint may be materialized from fresh-main evidence.
- Each Construction Sprint retains a bounded manifest, dependency-safe TASKs, allowed/forbidden paths, validation and Sprint Review.
- Exact-head Deterministic CI and applicable Heavy Product Tests remain gates.
- Package Review and Documentation/Closure cannot become functional overflow.
- Business authority boundaries, ADR/change control and L4 rules are unchanged.
- No TASK-count quota is authorized; ~20 TASKs/Sprint is only a sizing hypothesis.
- Unrelated technical debt/findings are not absorbed.

## Precedence
For P19-PACKAGE-01 cadence only, this explicit exception overrides the numeric default Construction-Sprint count in `SPRINT_GENERATION_POLICY.md`. All other provisions of that policy remain authoritative. It creates no precedent for successor Packages.
