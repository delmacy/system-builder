# AUX-GITHUB-ACTIONS-VALIDATION-AUDIT-01 — Audit Report

Status: CONSTRUCTED / SPRINT REVIEW — FINAL CI REQUIRED
Base main: `7763177596cb684d3e3c6f9a55042337a865c2bc`
Planning head: `df9ebd49539848d780a69fc85c606982b622cb30`

## TASK-196 — Workflow inventory

Fresh `main` contains exactly seven workflows: two validation workflows (`ci.yml`, `heavy-tests.yml`) and five orchestration/planning workflows. `ci.yml` runs `npm run verify` for pull requests to `main`; `heavy-tests.yml` runs the heavy product partition nightly and manually. OpenCode workflows use verification in bounded controller transitions but are not general-purpose CI.

## TASK-197 — Repository validation coverage

Repository composition is explicit:
- `verify = lint + typecheck + test + check:tasks + check:architecture + build`;
- `test = test:unit + test:product(core)`;
- `test:product:full` selects every product test;
- `core` is every product test outside the explicit `HEAVY` set and `heavy` is exactly that set.

Therefore `full = core ∪ heavy`; there is no product-test partition unique to `full`. A dedicated workflow merely invoking `test:product:full` would duplicate existing test coverage rather than add a new surface.

PR validation covers lint, typecheck, unit, product core, task validation, architecture gates and build. Heavy tests are covered nightly/manual. The uncovered distinction is lifecycle timing: heavy is not pre-merge, there is no general post-merge `push: main` verification, and no `merge_group` trigger.

## TASK-198 — Governance, triggers and action-runtime audit

Fresh `main` is not protected and has no required status checks. Thus Deterministic CI produces evidence but repository settings do not enforce that evidence as a merge prerequisite. This is a repository-setting gap, not a missing-workflow gap.

Recent Deterministic CI runner evidence warns that `actions/checkout@v4` and `actions/setup-node@v4` target the deprecated Node 20 action runtime and are being forced to Node 24. Current upstream documentation exposes v7 for both actions. Existing workflows should therefore be maintained in place rather than supplemented by a new validation workflow.

Validation workflow permissions are already read-only. The observed `opencode-work-package.yml` dispatcher only validates inputs and dispatches another workflow, so its current contents/PR write permissions warrant a least-privilege reduction in a separate implementation change. Other write-enabled orchestration workflows visibly publish branches/PRs or dispatch state transitions and have role-aligned write needs.

Heavy tests remain intentionally separate on current evidence: there is no failure-rate, latency or path-risk evidence supporting a mandatory heavy gate on every PR. `merge_group` becomes necessary only if merge queue is enabled. A duplicate post-merge full verification is optional defense-in-depth once `main` is protected, not a substitute for protection.

## TASK-199 — Final disposition matrix

| Candidate concern | Disposition | Evidence / rationale | Urgency | Dependency / follow-up |
| --- | --- | --- | --- | --- |
| Existing `Deterministic CI` PR gate | `KEEP_CURRENT` | `npm run verify` already covers lint, typecheck, unit, product core, task checks, architecture and build with required Postgres services | high-value existing gate | keep as canonical PR validation workflow |
| Existing nightly/manual heavy tests | `KEEP_CURRENT` | heavy partition is explicitly separated and covered; no evidence justifies making all heavy tests block every PR | normal | reassess only with measured regression/latency/path-risk evidence |
| Dedicated workflow for `test:product:full` | `NO_ACTION` | `full = core ∪ heavy`; no unique tests would be added | none | do not create duplicate workflow |
| Protect `main` and require Deterministic CI | `CHANGE_REPOSITORY_SETTING` | `main` currently reports protection disabled and zero required status checks | **mandatory integrity follow-up** | separately authorize repository-setting change; define bypass policy explicitly |
| Upgrade `actions/checkout@v4` / `actions/setup-node@v4` | `MODIFY_EXISTING_WORKFLOW` | current runner warns Node 20 action runtime is deprecated; upstream current majors are v7 | **high maintenance** | bounded CI-maintenance PR updating all affected workflow references and validating behavior |
| Reduce `opencode-work-package.yml` permissions | `MODIFY_EXISTING_WORKFLOW` | observed dispatcher only needs to validate inputs and dispatch downstream workflow; contents/PR write is broader than visible behavior | medium security hardening | prove exact minimum permissions in implementation PR |
| Add general `push: main` full verification | `NO_ACTION` | duplicates pre-merge `verify`; primary bypass risk is unprotected main, better fixed by repository settings | optional | revisit only if direct/bypass pushes remain intentionally allowed |
| Add `merge_group` trigger | `NO_ACTION` **for current state** | no current merge-queue/protection evidence; trigger is required only when merge queue becomes an adopted integration mode | conditional | if merge queue is enabled, modify existing `ci.yml` rather than add workflow |
| Make heavy suite PR-blocking | `NO_ACTION` **for current state** | would add cost/latency without evidence of needed risk reduction | optional | consider selective/path-sensitive execution only after empirical evidence |
| Extract repeated Postgres setup into reusable workflow | `NO_ACTION` | duplication exists, but no demonstrated reliability/maintenance benefit sufficient to justify another workflow abstraction | low | revisit if service definitions drift or maintenance burden becomes observable |
| Add another general validation workflow | `NO_ACTION` | inventory and coverage map show no uncovered validation domain requiring a separate workflow | none | prefer existing workflow changes/settings when justified |
| Current CI cancellation and heavy/Sprint serialization semantics | `KEEP_CURRENT` | PR CI cancels stale runs; heavy and stateful Sprint execution serialize without cancellation | normal | next-sprint duplicate-dispatch concurrency remains a residual orchestration risk, not a validation-workflow gap |

### Decision
**No additional GitHub Actions validation workflow is currently required.** The evidence supports two priority follow-ups outside this audit Sprint: (1) enforce the existing deterministic gate through protected-branch/required-check repository settings, and (2) maintain existing workflows by upgrading deprecated first-party action majors, with a least-privilege review of the lightweight Work Package dispatcher in the same or a separate bounded CI-maintenance change.

### Mandatory integrity versus optional optimization
Mandatory integrity follow-up: protect `main` and require the existing deterministic PR check. High-priority maintenance: update deprecated action majors. Optional/cost-sensitive items—PR heavy tests, post-merge duplicate verification, merge-group support before merge queue exists, and reusable service abstraction—must not be promoted without their triggering evidence.

### Residual risks
- Until branch protection/required checks are configured, direct or privileged merge paths can bypass the existing PR evidence gate.
- Until action majors are updated, workflows depend on compatibility forcing for deprecated Node 20 action runtimes.
- Heavy regressions may be detected after merge by nightly execution; this is an accepted current trade-off, not an unobserved coverage surface.
- If merge queue is later enabled, the current PR-only CI trigger must be extended to `merge_group`.

### Sprint boundaries preserved
No `.github/**`, branch protection, repository settings, product/runtime/business behavior or P12 WBS 12.3.x was modified. P12 Sprint 4 remains FORECAST ONLY.

Final gate: `npm run check:tasks` and `npm run verify` must pass on the exact TASK-199 closure head before this audit is accepted at Sprint Review.
