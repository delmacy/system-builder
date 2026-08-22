# Project State

Date: 2026-08-22

## Repository
`delmacy/system-builder` is canonical. `main` is integrated through merge `e64d4abd4bbee42d5ad5a31ff8db4a445f28b669`.

## Integrated maturity
- P1-P11 integrated.
- P12 Sprint 1 merged through PR #227 at `91936363d7322c80424b67a3dcfbbcda6f98e82b`.
- P12 Sprint 2 merged through PR #228 at `e64d4abd4bbee42d5ad5a31ff8db4a445f28b669`; Deterministic CI #473 PASS on final head `a3e2f6a7d500162991fc71d457bdfa59c4506448`.

## Active milestone
M12 — Support & Evolution.

## Active committed Sprint
`P12-SUPPORT-RESOLUTION-01` is materialized from integrated `main` for WBS 12.2.1-12.2.3 and is **COMMITTED / NOT STARTED**. TASK-185..195 are ready in dependency order. No TASK implementation has been executed in this planning round.

## Integrated capability
`SupportEvidenceIntake -> SupportTriageDecision` is integrated. Classification remains explicitly supplied as `Support|Maintenance|Evolution`; impact/criticality/SLA/priority/context remain explicit references.

## Growing proof target
`DeploymentFinding|human evidence -> SupportEvidenceIntake -> explicit SupportTriageDecision -> support case|problem record -> explicit cause/resolution/evidence`

## Architecture boundary
No automatic classification, prioritization, SLA calculation, scoring, remediation or production mutation. Operational-resolution records may only record explicit references/evidence. Business behavior change remains WBS 12.3.x and must return through Mirror/Recipe/release.

## Package horizon
`P12-PACKAGE-01` now reflects the authoritative Sprint Generation Policy: four construction Sprints in this package, followed by Integration & Technical Debt Review. Sprint 4 remains forecast-only.
