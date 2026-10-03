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
Fresh main revalidated: `d719442a620a4a5824386e423fbc274ab54e8bc0`; materialization base remains current.

PR #999 remains planning/documentation only; no C07 product or lower-owner mutation was introduced. Exact-head `f9f51872219e91c98dfa2f3121b470de1bde68a4` produced Heavy Product Tests GREEN and Automation Handoff State Machine GREEN, while Deterministic CI and Merge Candidate CI failed in `npm run verify`.

Concrete blocker recovered from the exact-head job log: the task-catalog tests failed because predecessor `TASK-631` used machine frontmatter `status: closed`, while the repository task schema accepts `completed` (not `closed`). Human-readable TASK-631 closure truth remains CLOSED / PROVEN / INTEGRATED; this is a metadata/schema conformance defect, not a product or proof regression. The bounded correction normalized only that machine status to `completed`; no product code, authority, acceptance result, or predecessor proof changed.

The correction and this pointer reconciliation create a new exact-head identity, so all GREEN/FAIL evidence from `f9f51872...` is stale for admission. Closure/merge status remains BLOCKED / UNPROVEN; no merge performed; Construction remains unauthorized.

Residual debt: require mandatory GREEN evidence on the new exact head and a distinct current merge-candidate GREEN. Provider substitution/exit product obligations remain UNPROVEN-GAP until later Construction; recovery beyond deterministic fail-closed admission remains deferred.

Next dependency-safe action: inspect the new exact-head runs. If any mandatory gate fails, repair only the demonstrated bounded documentation/conformance defect. If all are GREEN, record a distinct current merge-candidate GREEN, integrate materialization, revalidate fresh main, and reconcile repository memory. Do not implement C07 product, advance C07B/C08+, or acquire any forbidden authority before that admission completes.