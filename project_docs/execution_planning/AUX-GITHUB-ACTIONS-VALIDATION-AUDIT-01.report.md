# AUX-GITHUB-ACTIONS-VALIDATION-AUDIT-01 — Audit Report

Status: CONSTRUCTED / SPRINT REVIEW / FINAL CI PASS
Base main: `7763177596cb684d3e3c6f9a55042337a865c2bc`
Planning head: `df9ebd49539848d780a69fc85c606982b622cb30`
Closure head before CI evidence annotation: `bf5153d060c6c7bbad8821c4fe7722e0696799fc`
Final Deterministic CI #512: PASS on exact TASK-199 closure head `bf5153d060c6c7bbad8821c4fe7722e0696799fc`.

## Final audit result
Fresh `main` contains exactly seven workflows: two validation workflows (`ci.yml`, `heavy-tests.yml`) and five orchestration/planning workflows. PR `Deterministic CI` runs `npm run verify`; heavy product tests run nightly/manual. The product runner establishes `full = core ∪ heavy`, so there is no unique test partition requiring a dedicated `test:product:full` workflow.

Fresh `main` is not protected and has no required status checks. This is a repository-setting enforcement gap, not a missing-workflow gap. Recent CI logs warn that `actions/checkout@v4` and `actions/setup-node@v4` target deprecated Node 20 action runtimes while GitHub forces Node 24; current upstream documentation exposes maintained v7 lines. Existing workflow maintenance, not another validation workflow, is the appropriate remediation class.

## Final disposition matrix

| Candidate concern | Disposition | Evidence / rationale | Urgency | Dependency / follow-up |
| --- | --- | --- | --- | --- |
| Existing `Deterministic CI` PR gate | `KEEP_CURRENT` | `npm run verify` already covers lint, typecheck, unit, product core, task checks, architecture and build with required Postgres services | high-value existing gate | keep as canonical PR validation workflow |
| Existing nightly/manual heavy tests | `KEEP_CURRENT` | heavy partition is explicitly separated and covered; no evidence justifies making all heavy tests block every PR | normal | reassess only with measured regression/latency/path-risk evidence |
| Dedicated workflow for `test:product:full` | `NO_ACTION` | `full = core ∪ heavy`; no unique tests would be added | none | do not create duplicate workflow |
| Protect `main` and require Deterministic CI | `CHANGE_REPOSITORY_SETTING` | `main` reports protection disabled and zero required status checks | **mandatory integrity follow-up** | separately authorize repository-setting change; define bypass policy explicitly |
| Upgrade `actions/checkout@v4` / `actions/setup-node@v4` | `MODIFY_EXISTING_WORKFLOW` | current runner warns Node 20 action runtime is deprecated; upstream current majors are v7 | **high maintenance** | bounded CI-maintenance PR updating all affected workflow references and validating behavior |
| Reduce `opencode-work-package.yml` permissions | `MODIFY_EXISTING_WORKFLOW` | observed dispatcher only validates inputs and dispatches downstream workflow; contents/PR write is broader than visible behavior | medium security hardening | prove exact minimum permissions in implementation PR |
| Add general `push: main` full verification | `NO_ACTION` | duplicates pre-merge `verify`; primary bypass risk is unprotected main, better fixed by repository settings | optional | revisit only if direct/bypass pushes remain intentionally allowed |
| Add `merge_group` trigger | `NO_ACTION` **for current state** | no current merge-queue/protection evidence; required only if merge queue becomes integration mode | conditional | if merge queue is enabled, modify existing `ci.yml` rather than add workflow |
| Make heavy suite PR-blocking | `NO_ACTION` **for current state** | would add cost/latency without evidence of needed risk reduction | optional | consider selective/path-sensitive execution only after empirical evidence |
| Extract repeated Postgres setup into reusable workflow | `NO_ACTION` | duplication exists, but no demonstrated reliability/maintenance benefit sufficient to justify another workflow abstraction | low | revisit if service definitions drift or maintenance burden becomes observable |
| Add another general validation workflow | `NO_ACTION` | inventory and coverage map show no uncovered validation domain requiring a separate workflow | none | prefer existing workflow changes/settings when justified |
| Current CI cancellation and heavy/Sprint serialization semantics | `KEEP_CURRENT` | PR CI cancels stale runs; heavy and stateful Sprint execution serialize without cancellation | normal | next-sprint duplicate-dispatch concurrency remains residual orchestration risk, not a validation-workflow gap |

## Decision
**No additional GitHub Actions validation workflow is currently required.** Evidence supports two priority follow-ups outside this audit Sprint: (1) enforce the existing deterministic gate through protected-branch/required-check repository settings, and (2) maintain existing workflows by upgrading deprecated first-party action majors, with a least-privilege review of the lightweight Work Package dispatcher.

Mandatory integrity follow-up: protect `main` and require the existing deterministic PR check. High-priority maintenance: update deprecated action majors. Optional/cost-sensitive items—PR heavy tests, post-merge duplicate verification, merge-group support before merge queue exists, and reusable service abstraction—must not be promoted without their triggering evidence.

Residual risks: until protection is configured, direct/privileged paths can bypass the PR evidence gate; until action majors are updated, workflows rely on runtime compatibility forcing; heavy regressions may be detected nightly after merge; if merge queue is later enabled, CI must gain `merge_group` coverage.

## Validation evidence
- TASK-196 — commit `e2558e3c71ee3df17513dc653d4f022c43010771`, Deterministic CI #509 PASS.
- TASK-197 — commit `7fd55c9a5620ac06a817f2ba71d9cd408b7cb5a8`, Deterministic CI #510 PASS.
- TASK-198 — commit `b5e90d4d118859ad13794b0da1eeba5e0def3c22`, Deterministic CI #511 PASS.
- TASK-199 — commit `bf5153d060c6c7bbad8821c4fe7722e0696799fc`, Deterministic CI #512 PASS.

No `.github/**`, branch protection, repository settings, product/runtime/business behavior or P12 WBS 12.3.x was modified. P12 Sprint 4 remains FORECAST ONLY.
