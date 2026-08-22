# Project State

Date: 2026-08-22

## Repository
`delmacy/system-builder` is canonical. `main` is integrated through P12 Sprint 3 merge `7763177596cb684d3e3c6f9a55042337a865c2bc`.

## Integrated maturity
- P1-P11 integrated.
- P12 Sprint 1 merged through PR #227.
- P12 Sprint 2 merged through PR #228.
- P12 Sprint 3 `P12-SUPPORT-RESOLUTION-01` merged through PR #229 at `7763177596cb684d3e3c6f9a55042337a865c2bc` after Sprint Review and Deterministic CI #507 PASS.

## Integrated P12 capability
`DeploymentFinding|human request -> SupportEvidenceIntake -> explicit SupportTriageDecision -> SupportCaseRecord|ProblemRecord -> explicit permission/cause/resolution/evidence` is integrated through WBS 12.2.3. No automatic classification/prioritization/SLA/scoring, remediation or production mutation is introduced.

## Active auxiliary quality gate
`AUX-GITHUB-ACTIONS-VALIDATION-AUDIT-01` is **CONSTRUCTED / SPRINT REVIEW / GOVERNANCE RECONCILED** on PR #230. TASK-196..199 audit seven current workflows, validation coverage and GitHub governance/runtime maintenance. TASK-196 CI #509, TASK-197 CI #510, TASK-198 CI #511 and TASK-199 CI #512 passed; closure CI #516 also passed before the governance reconciliation.

## Audit decision
No additional general GitHub Actions validation workflow is currently justified.

Current governance is explicit: during the construction phase, `main` remains deliberately unprotected and owner privilege remains broad to preserve development velocity under point-in-time owner instructions. Branch protection, required checks and broad structural privilege reduction are **DEFERRED** until an explicit future pre-commercial maturity gate. Their absence is not a current deficiency and must not be re-promoted before that gate unless superseded by explicit owner authority.

The bounded near-term maintenance candidate is `MODIFY_EXISTING_WORKFLOW`: upgrade deprecated `actions/checkout@v4` / `actions/setup-node@v4` usages and review `opencode-work-package.yml` permissions, reducing only permissions proven unnecessary where doing so does not impair the current development dynamic.

Heavy product tests remain nightly/manual on current evidence. No direct `test:product:full` workflow is needed because full is compositionally core plus heavy. No general `push: main`, `merge_group`, mandatory PR-heavy gate or new general validation workflow is currently authorized by the audit evidence.

## P12 forecast
P12 Sprint 4 / WBS 12.3.x remains **FORECAST ONLY**. Business behavior change remains controlled through Mirror/Recipe/release and is not materialized by the auxiliary Sprint.
