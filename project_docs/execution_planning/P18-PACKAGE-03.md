# P18-PACKAGE-03 — Process-to-System Version Lineage

Status: PLANNED / NOT MATERIALIZED
Date: 2026-08-29
Milestone: M18 Process Versioning
WBS coverage: 18.3.1–18.3.3
Planning baseline: `5a3612d20f30307ac2c0a2e70ca70dff034476d8`

## Package Goal
Close M18 by establishing deterministic, queryable lineage from canonical approved BusinessRecipe revisions through the SystemAnalysis/SystemDefinition that materializes them and onward to PublishedRelease/Deployment records, so the repository-supported product path can answer which software materialized a given process version without making Git, classification evidence or engineering review the business-version authority.

## Predecessor/readiness gate
- P18-PACKAGE-01 / WBS 18.1 is CLOSED.
- P18-PACKAGE-02 / WBS 18.2 is CLOSED.
- Canonical M15 `human-decision` remains approval/rejection authority where a domain decision is required.
- Existing Analysis/Definition/Release/Deploy contracts must be reused through public boundaries; any required L4 redesign stops materialization for ADR review.

## Forecast Construction A — `P18-PROCESS-SYSTEM-LINEAGE-CONTRACT-01`
Goal: establish the minimum additive public lineage/reference/query contracts tying an approved Recipe revision to the Analysis/Definition lineage that materializes it.

Expected proof:
- exact canonical Recipe revision reference is preserved;
- Analysis/Definition references cannot silently drift to another revision;
- malformed, missing, cross-artifact or stale lineage fails closed;
- no Git commit becomes process-version authority.

## Forecast Construction B — `P18-PROCESS-SYSTEM-LINEAGE-INTEGRATION-01`
Goal: extend the same lineage through Release and Deployment and expose a deterministic history query over the real predecessor chain.

Expected proof:
- Definition -> Release -> Deployment provenance is explicit and verifiable;
- a process revision can enumerate the software/release/deployment lineage that materialized it;
- successor process revisions remain distinguishable and historical records remain immutable;
- representative real consumers use canonical lineage rather than hand-authored E2E fixtures.

## Optional Construction C — `P18-PROCESS-SYSTEM-LINEAGE-HARDENING-01`
FORECAST ONLY. Promote only after post-B fresh-main revalidation proves a bounded residual WBS 18.3 gap. It is not a generic hardening/debt bucket.

## Package Integration & Review
Regress the full M18 18.1 -> 18.2 -> 18.3 chain; inspect contract/schema drift, authority substitution, stale lineage, history integrity, architecture fitness, CI/heavy proof and residual debt. Missing WBS capability returns to explicit construction.

## Documentation & Closure
Reconcile PROJECT_STATE, CURRENT_MILESTONE, NEXT_WORK, WBS 18, package evidence and M19 readiness. M18 closes only when one can reconstruct what changed in the process, why, which approved revision is authoritative and which software/release/deployment materialized it.

## Boundaries / non-goals
No Git-as-business-version authority; no Decision Boundary redesign; no automatic approval from diff/classification; no Release/Deploy topology redesign; no UI/productization work from M19; no unrelated finding or TD-P13-01..04 absorption; no undeclared L4.

## Successor gate
Only after P18-PACKAGE-03 is canonically CLOSED may fresh-main planning promote M19 pre-alpha productization. M19 packages below are baseline forecast, not execution authority.