# Next Work — STATION S3 Component Grammar & Catalog

Date: 2026-10-03
Repository truth base: `main@d719442a620a4a5824386e423fbc274ab54e8bc0`
Status: S3 / WP7 C07A — TASK-632 MATERIALIZED / MATERIALIZATION BLOCKED; Construction BLOCKED

> Live execution pointer. Interpret with `docs/DOCUMENT_AUTHORITY.md`.

## Authority
- `docs/DOCUMENT_AUTHORITY.md`
- `docs/contracts/001-station-component-grammar/ADDENDUM.md`
- `project_docs/execution_planning/STATION-S3-COMPONENT-GRAMMAR-PLAN-01.md`
- `project_docs/execution_planning/STATION-S3-CONSTRUCTION-MATERIALIZATION-01.md`
- `project_docs/execution_planning/STATION-S3-QA-GATES-PLAN-01.md`
- `specs/tasks/TASK-632-STATION-S3-C07A-PROVIDER-PORTABILITY-BOUNDARY.md`

## Predecessor truth
C01–C05 are PROVEN under unchanged recorded preconditions. C06A/TASK-630 and C06B/TASK-631 are CLOSED / PROVEN / INTEGRATED. The C06 census found all accepted mandatory C9/Application obligations closed; durable persistence/storage and recovery beyond deterministic fail-closed admission remain explicit non-goals/deferred rather than hidden closure gaps. C07 evidence starts UNPROVEN-GAP.

## TASK-632 / C07A materialization
Branch: `planning/station-s3-wp7-c07a-provider-portability-materialization`.
Start/fresh-main truth: `main@d719442a620a4a5824386e423fbc274ab54e8bc0`.
Materialized scope: smallest Station-owned provider-neutral binding/substitution/portability evidence boundary only.
Construction: BLOCKED until this materialization is current, bounded, GREEN, integrated, and fresh-main pointer reconciled.

Allowed product after admission: `packages/station-provider-boundary/**` plus focused `tests/product/station-s3-c07*.test.ts` and bounded TASK/NEXT_WORK memory; `max_files: 6`.

Forbidden: `packages/core/**`, `packages/station-application/**`, `packages/station-tool/**`, app-runtime/apps/shell/interaction/composition/ui-core, concrete `provider/**`, `runtime/**`, `deploy/**`, provider SDK/API/network discovery, secrets resolution, durable persistence/storage/database/filesystem ownership, executable command authorization, Core/business result/currentness, UI/DOM/a11y, C10/Studio and AI/MCP.

## Acceptance / proof obligations
- stable provider-neutral binding identity distinct from Application/Tool/Component/presentation/command/runtime identity;
- deterministic compatible substitution, idempotence, and order-independence where ordering is semantically irrelevant;
- explicit portability/exit representation with no concrete provider promoted to canonical business meaning;
- unknown/stale/malformed/duplicate/ambiguous/incompatible refs fail closed before canonical mutation with zero partial mutation;
- C01–C06 owner contracts preserved; inheritance only under unchanged preconditions;
- no provider runtime/deploy/secrets, persistence/storage, command/business/Core, UI, Studio or AI/MCP authority;
- focused positive + adversarial executable proof;
- current exact-head mandatory gates plus a distinct current merge-candidate GREEN before materialization integration/Construction admission.

## :50 hardening / closure handoff
Fresh main revalidated: `d719442a620a4a5824386e423fbc274ab54e8bc0`; PR #999 base remains current. No merge performed and Construction remains unauthorized.

BLOCKER-FIRST on exact-head `1964916bd0f69a87a4a8fc944d81c81f2b38d8f8`: Heavy Product Tests and Automation Handoff State Machine were GREEN; Deterministic CI and Merge Candidate CI were FAILED. Exact-head checkout/identity and locked install passed. Full job logs localized all four `npm run verify` failures to task-catalog parsing of predecessor TASK-631: after the prior `status: completed` correction, its closure rewrite no longer contained the mandatory task-contract sections `Objective`, `Context`, `Current behavior`, `Required change`, `Inputs / contracts`, `Outputs / contracts`, `Acceptance criteria`, `Non-goals`, `Evidence expected`, and `Escalation`.

Bounded repair: TASK-631 was normalized back to the required machine-readable section shape without changing its completed status, accepted C06B proof, owner boundaries, product code, or predecessor evidence. Repair commit: `5696961f6a81808befe4dd832742dc670221db8d`. This is documentation/conformance only. Because HEAD moved, every check and merge-candidate attached to `1964916b...` is stale for admission.

Semantic/architecture review remains clean: TASK-632 is planning-only and provider-neutral; no product mutation, Core/business/command authority, provider runtime/deploy/secrets, durable persistence/storage, lower-owner mutation, UI or C10/Studio authority was introduced. C07A negative/adversarial obligations remain explicitly bound for later Construction: malformed/unknown/stale/duplicate/ambiguous/incompatible refs fail closed pre-mutation, deterministic/idempotent substitution, portability/exit representation, zero partial mutation and authority non-strengthening. Accessibility is N/A for this materialization because it introduces no UI/DOM/focus/keyboard surface.

Closure/merge status: BLOCKED / UNPROVEN. Current head after this handoff is newer than `5696961f...`; mandatory evidence must attach to the final exact-head. Do not merge on predecessor GREEN evidence.

Residual debt: obtain mandatory exact-head GREEN on the final branch head and a distinct current merge-candidate GREEN; provider substitution/exit product obligations remain UNPROVEN-GAP until Construction; recovery beyond deterministic fail-closed admission remains deferred.

Next dependency-safe action: inspect the final exact-head runs. If a mandatory gate fails, repair only the demonstrated bounded conformance defect and rerun/reconfirm. If exact-head and distinct merge-candidate are both current GREEN, integrate PR #999 with expected-head protection, revalidate fresh main, reconcile repository memory, and only then authorize TASK-632 Construction. Do not advance C07B/C08+, provider runtime/deploy/secrets, durable persistence, Core/business authority or C10/Studio.