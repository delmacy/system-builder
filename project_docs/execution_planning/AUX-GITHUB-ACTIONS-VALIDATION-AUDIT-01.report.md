# AUX-GITHUB-ACTIONS-VALIDATION-AUDIT-01 — Audit Report

Status: CONSTRUCTED / SPRINT REVIEW / GOVERNANCE RECONCILED
Base main: `7763177596cb684d3e3c6f9a55042337a865c2bc`
Planning head: `df9ebd49539848d780a69fc85c606982b622cb30`
Closure head before CI evidence annotation: `bf5153d060c6c7bbad8821c4fe7722e0696799fc`
TASK-199 Deterministic CI #512: PASS on exact TASK-199 closure head `bf5153d060c6c7bbad8821c4fe7722e0696799fc`.
Previous final closure CI #516: PASS on head `3d4cf709c70c35958c009f41f7f3e7bd8af2e646`.

## Final audit result
Fresh `main` contains exactly seven workflows: two validation workflows (`ci.yml`, `heavy-tests.yml`) and five orchestration/planning workflows. PR `Deterministic CI` runs `npm run verify`; heavy product tests run nightly/manual. The product runner establishes `full = core ∪ heavy`, so there is no unique test partition requiring a dedicated `test:product:full` workflow.

Fresh `main` is intentionally not protected and has no required status checks during the current construction phase. This is an explicit owner governance decision to preserve development velocity and full owner privilege under point-in-time instructions. Branch protection, required checks and structural privilege reduction are deferred until a future pre-commercial maturity gate and must not be treated as current deficiencies unless superseded by explicit authority.

Recent CI logs warn that `actions/checkout@v4` and `actions/setup-node@v4` target deprecated Node 20 action runtimes while GitHub forces Node 24; current upstream documentation exposes maintained v7 lines. Existing workflow maintenance, not another validation workflow, is the appropriate near-term remediation class.

## Final disposition matrix

| Candidate concern | Disposition | Evidence / rationale | Urgency | Dependency / follow-up |
| --- | --- | --- | --- | --- |
| Existing `Deterministic CI` PR gate | `KEEP_CURRENT` | `npm run verify` already covers lint, typecheck, unit, product core, task checks, architecture and build with required Postgres services | high-value existing gate | keep as canonical PR validation workflow |
| Existing nightly/manual heavy tests | `KEEP_CURRENT` | heavy partition is explicitly separated and covered; no evidence justifies making all heavy tests block every PR | normal | reassess only with measured regression/latency/path-risk evidence |
| Dedicated workflow for `test:product:full` | `NO_ACTION` | `full = core ∪ heavy`; no unique tests would be added | none | do not create duplicate workflow |
| Keep `main` unprotected during construction | `KEEP_CURRENT` | explicit owner governance decision preserves development velocity and full privilege under point-in-time instructions | intentional current policy | revisit only at explicit pre-commercial maturity gate or new owner instruction |
| Branch protection / required checks / broad privilege reduction | `DEFERRED` | intentionally postponed until the project is mature enough for pre-commercial hardening | future governance gate | do not implement or re-recommend before the gate absent new explicit authority |
| Upgrade `actions/checkout@v4` / `actions/setup-node@v4` | `MODIFY_EXISTING_WORKFLOW` | current runner warns Node 20 action runtime is deprecated; upstream current majors are v7 | high maintenance | bounded CI-maintenance PR updating affected workflow references and validating behavior |
| Review `opencode-work-package.yml` permissions | `MODIFY_EXISTING_WORKFLOW` | observed dispatcher permissions may be broader than visible behavior | bounded review only | reduce only permissions proven unnecessary and only when doing so does not impair current development dynamics |
| Add general `push: main` full verification | `NO_ACTION` | duplicates PR `verify`; direct owner pushes are intentionally permitted in the current construction phase | none current | revisit only under later governance hardening if evidence requires it |
| Add `merge_group` trigger | `NO_ACTION` | no merge queue is currently adopted | none current | if merge queue is enabled later, modify existing `ci.yml` rather than add workflow |
| Make heavy suite PR-blocking | `NO_ACTION` | would add cost/latency without evidence of needed risk reduction | none current | consider only after empirical evidence |
| Extract repeated Postgres setup into reusable workflow | `NO_ACTION` | duplication exists, but no demonstrated reliability/maintenance benefit sufficient to justify abstraction | low | revisit only with observable drift or maintenance burden |
| Add another general validation workflow | `NO_ACTION` | inventory and coverage map show no uncovered validation domain requiring a separate workflow | none | prefer maintenance of existing workflows when justified |
| Current CI cancellation and heavy/Sprint serialization semantics | `KEEP_CURRENT` | PR CI cancels stale runs; heavy and stateful Sprint execution serialize without cancellation | normal | next-sprint duplicate-dispatch concurrency remains residual orchestration risk, not a validation-workflow gap |
| `ADD_WORKFLOW` category | `NO_ACTION` | no candidate is justified by current evidence | none | require new evidence and separate authority before adding a general validation workflow |

## Decision
**No additional GitHub Actions validation workflow is currently required.** During construction, keeping `main` unprotected and retaining broad owner privilege is the authoritative governance choice. Branch protection, required status checks and broad privilege reduction are **DEFERRED** to a future pre-commercial maturity gate.

The only near-term follow-up class supported by the audit is bounded maintenance of existing workflows: update deprecated first-party Action majors and review least privilege where a reduction is demonstrably safe and does not impair the current development dynamic. These changes require a separately materialized intervention and must not alter repository settings.

Optional/cost-sensitive items—PR heavy tests, post-merge duplicate verification, merge-group support before merge queue exists, reusable service abstraction, or another general validation workflow—must not be promoted without new triggering evidence.

## Accepted residual risks during construction
Direct/privileged paths can intentionally bypass PR evidence because full owner privilege is retained by policy. This is accepted for the construction phase, not an unresolved defect. Until Action majors are updated, workflows rely on runtime compatibility forcing; heavy regressions may be detected nightly after merge; if merge queue is later adopted, CI must gain `merge_group` coverage.

## Validation evidence
- TASK-196 — commit `e2558e3c71ee3df17513dc653d4f022c43010771`, Deterministic CI #509 PASS.
- TASK-197 — commit `7fd55c9a5620ac06a817f2ba71d9cd408b7cb5a8`, Deterministic CI #510 PASS.
- TASK-198 — commit `b5e90d4d118859ad13794b0da1eeba5e0def3c22`, Deterministic CI #511 PASS.
- TASK-199 — commit `bf5153d060c6c7bbad8821c4fe7722e0696799fc`, Deterministic CI #512 PASS.
- Closure before governance reconciliation — head `3d4cf709c70c35958c009f41f7f3e7bd8af2e646`, Deterministic CI #516 PASS.

No `.github/**`, branch protection, repository settings, product/runtime/business behavior or P12 WBS 12.3.x is modified by this reconciliation. P12 Sprint 4 remains FORECAST ONLY.
