# Next Work — STATION S3 Component Grammar & Catalog

Date: 2026-10-03
Repository truth base: `main@d719442a620a4a5824386e423fbc274ab54e8bc0`
Status: S3 / WP7 C07A — TASK-632 MATERIALIZED / MATERIALIZATION EVIDENCE PENDING; Construction BLOCKED

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
Start truth: `main@d719442a620a4a5824386e423fbc274ab54e8bc0`.
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

## :10 handoff
Predecessor truth: `C01–C05 PROVEN → C06A CLOSED/PROVEN/INTEGRATED → C06B CLOSED/PROVEN/INTEGRATED → C06 census CLOSED → main@d719442a → TASK-632/C07A materialized on planning branch → materialization evidence/integration PENDING`.

Authorization: materialization hardening/validation only. Product Construction is NOT authorized yet.

Next action: revalidate fresh main against the materialization base; inspect the bounded two-file documentation delta; obtain current exact-head mandatory gates and a distinct merge-candidate for the final materialization identity; fix only bounded documentation/conformance blockers; integrate only when GREEN/current; then reconcile NEXT_WORK on the new fresh main. Do not implement C07 product or materialize another tranche before that admission completes.