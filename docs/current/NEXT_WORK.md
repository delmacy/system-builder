# Next Work — P12 Controlled Evolution Sprint 4 Materialization Gate

The repository is authoritative.

## Current integrated truth
P12 Sprints 1-3 are merged. PR #230 (GitHub Actions validation audit), PR #231 (bounded workflow maintenance) and PR #232 (Work Package cadence/repository-memory reconciliation) are integrated. The fresh integrated base for Sprint 4 planning is `932987117aed79d5af5ad3965bb87da740989318`.

The integrated support/evolution chain closes operational resolution through WBS 12.2.3. `Evolution` exists as explicit triage classification and is rejected by SupportCase/Problem operational paths.

## Committed successor
`P12-CONTROLLED-EVOLUTION-LINKAGE-01` is **COMMITTED / MATERIALIZED** with TASK-202..211.

Goal:
`human process-change request -> SupportEvidenceIntake -> explicit SupportTriageDecision(Evolution) -> EvolutionRequestEvidence -> ProcessMirror/BusinessRecipe linkage -> PublishedRelease linkage -> original request linkage`.

Boundaries:
- evidence/linkage only;
- no automatic Evolution classification;
- no SupportCase/Problem Evolution path;
- no ProcessMirror/BusinessRecipe shared-schema mutation;
- no invented Mirror/Recipe execution engine;
- no release publication/transition/deploy or production mutation from Support/Evolution;
- no L4 architecture change.

## Required next action
1. Validate the materialization planning PR on its exact head with Deterministic CI.
2. If green and review confirms only planning/materialization scope, merge preserving its planning history.
3. Reconstruct fresh `main`.
4. Create `sprint/P12-CONTROLLED-EVOLUTION-LINKAGE-01` from that exact integrated truth.
5. Execute TASK-202..211 in dependency order, one authoritative commit per TASK.
6. Run `npm run verify`, produce the Sprint Report, open one Sprint Review PR and stop at its review gate.

Do not begin the P12 Package Integration & Technical Debt Review before Sprint 4 is merged. Do not begin P13 before P12 package review/repository-memory closure.

## Planning policy
New Work Packages use:
`Planning & Materialization -> Construction A -> Construction B -> [optional Construction C] -> Package Integration & Review -> Documentation & Closure`.

P12 remains an explicit legacy/grandfathered package.

## Successor Work Package horizon — M13
The following remain FORECAST ONLY and blocked:
1. `P13-PACKAGE-01` — Autonomous Runtime Functional Execution;
2. `P13-PACKAGE-02` — Identity, Authority & Generated Experience;
3. `P13-PACKAGE-03` — Operational Autonomy.

## Governance boundaries
Keep `main` deliberately without GitHub branch protection/required checks during current construction unless an explicit future maturity gate changes that decision. Branch protection, required checks and broad structural privilege reduction remain DEFERRED. Do not add a new general validation workflow, duplicate general `push: main` verification, `merge_group` before merge-queue adoption, or mandatory PR-heavy gate without new evidence/authority.
