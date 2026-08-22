# Project State

Date: 2026-08-22

## Repository
`delmacy/system-builder` is canonical. `main` remains integrated through P12 Sprint 2 merge `e64d4abd4bbee42d5ad5a31ff8db4a445f28b669` until Sprint 3 review/merge completes.

## Integrated maturity
- P1-P11 integrated.
- P12 Sprint 1 merged through PR #227 at `91936363d7322c80424b67a3dcfbbcda6f98e82b`.
- P12 Sprint 2 merged through PR #228 at `e64d4abd4bbee42d5ad5a31ff8db4a445f28b669`; Deterministic CI #473 PASS on final head `a3e2f6a7d500162991fc71d457bdfa59c4506448`.

## Active milestone
M12 — Support & Evolution.

## Active committed Sprint
`P12-SUPPORT-RESOLUTION-01` is **CONSTRUCTED / SPRINT REVIEW** on PR #229. TASK-185..195 are in verification; final Deterministic CI is required on the exact closure head before merge.

## Constructed capability
Explicit `Support` triage can form deterministic support cases with canonical knowledge references and explicit resolution evidence. Explicit `Maintenance` triage can form deterministic problem records, explicit permitted-correction evidence and resolution evidence. Durable refs enforce no-value-leak semantics.

## Growing proof
`DeploymentFinding|human request -> SupportEvidenceIntake -> explicit SupportTriageDecision -> SupportCaseRecord|ProblemRecord -> explicit permission/cause/resolution/evidence -> validated/lossless ResolutionEvidence`.

## Architecture boundary
No automatic classification, prioritization, SLA calculation, scoring, remediation or production mutation. `Evolution` remains outside Sprint 3. Business behavior change remains WBS 12.3.x and must return through Mirror/Recipe/release.

## Package horizon
Sprint 4 remains FORECAST ONLY. It must not be materialized until Sprint 3 is reviewed, merged and fresh `main` is revalidated.
