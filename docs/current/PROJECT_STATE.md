# Project State

Date: 2026-08-22

## Repository
`delmacy/system-builder` is canonical. `main` is integrated through planning reconciliation merge `932987117aed79d5af5ad3965bb87da740989318`.

## Integrated maturity
- P1-P11 integrated.
- P12 Sprint 1 merged through PR #227.
- P12 Sprint 2 merged through PR #228.
- P12 Sprint 3 `P12-SUPPORT-RESOLUTION-01` merged through PR #229 at `7763177596cb684d3e3c6f9a55042337a865c2bc` after Deterministic CI #507 PASS.
- Auxiliary validation audit PR #230 merged at `86bde8830995e5d0a51bd3e3fd27734b5066f9d5`.
- Auxiliary GitHub Actions maintenance PR #231 merged at `58fcfd837ebb91bec21172916090f71f75970ef5`; TASK-200 CI #526 PASS and TASK-201 CI #527 PASS.
- Work Package cadence/repository-memory reconciliation PR #232 merged at `932987117aed79d5af5ad3965bb87da740989318` after CI #528 PASS.

## Integrated P12 capability
`DeploymentFinding|human request -> SupportEvidenceIntake -> explicit SupportTriageDecision -> SupportCaseRecord|ProblemRecord -> explicit permission/cause/resolution/evidence` is integrated through WBS 12.2.3.

`Evolution` is an explicit triage classification only in integrated product truth. Operational SupportCase/Problem paths reject Evolution.

No automatic classification/prioritization/SLA/scoring, remediation or production mutation is introduced.

## P12 Sprint 4 materialization
`P12-CONTROLLED-EVOLUTION-LINKAGE-01` is now **COMMITTED / MATERIALIZED** from fresh base `932987117aed79d5af5ad3965bb87da740989318`, with TASK-202..211 committed in dependency order.

The committed WBS 12.3.x path is:
`human process-change request -> SupportEvidenceIntake -> explicit SupportTriageDecision(Evolution) -> EvolutionRequestEvidence -> ProcessMirror/BusinessRecipe linkage -> PublishedRelease linkage -> original request linkage`.

The Sprint is evidence/linkage only: no direct Mirror/Recipe executor is invented, no shared ProcessMirror/BusinessRecipe schema mutation is authorized, and Support/Evolution does not publish/deploy/transition releases or mutate production.

Until the materialization planning PR is integrated, no execution branch should be created. After integration, execute only `sprint/P12-CONTROLLED-EVOLUTION-LINKAGE-01` under normal Sprint Mode.

## GitHub Actions governance
- No additional general validation workflow is currently justified.
- Existing affected first-party Actions use maintained v7 majors where applicable.
- `.github/workflows/opencode-work-package.yml` retains only `actions: write`.
- Heavy product tests remain nightly/manual on current evidence.
- No direct `test:product:full` workflow, duplicate general `push: main`, premature `merge_group` or mandatory PR-heavy gate is authorized.

During construction, `main` remains deliberately without GitHub branch protection and required checks. Branch protection, required checks and broad structural privilege reduction remain **DEFERRED** until an explicit future pre-commercial maturity gate.

## Work Package cadence
New Work Packages use:
`Planning & Materialization -> Construction A -> Construction B -> [optional Construction C when justified] -> Package Integration & Review -> Documentation & Closure`.

P12 remains grandfathered under its prior cadence.

## Next baseline horizon
P13 Work Packages remain forecast only and blocked until P12 Sprint 4 is merged and the P12 package Integration & Technical Debt Review/repository-memory closure is complete.
