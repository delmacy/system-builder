# Next Work — STATION S3 Component Grammar & Catalog

Date: 2026-10-03
Repository truth base: `main@a3449d964688654e681905e770774b69943197fb`
Status: S3 / WP7 C07A — TASK-632 CONSTRUCTION IMPLEMENTED / PRODUCT UNPROVEN-GAP PENDING EXACT-HEAD GATES

> Live execution pointer. Interpret with `docs/DOCUMENT_AUTHORITY.md`.

## Authority
- `docs/DOCUMENT_AUTHORITY.md`
- `docs/contracts/001-station-component-grammar/ADDENDUM.md`
- `project_docs/execution_planning/STATION-S3-COMPONENT-GRAMMAR-PLAN-01.md`
- `project_docs/execution_planning/STATION-S3-CONSTRUCTION-MATERIALIZATION-01.md`
- `project_docs/execution_planning/STATION-S3-QA-GATES-PLAN-01.md`
- `specs/tasks/TASK-632-STATION-S3-C07A-PROVIDER-PORTABILITY-BOUNDARY.md`

## Predecessor truth
C01–C05 are PROVEN under unchanged recorded preconditions. C06A/TASK-630 and C06B/TASK-631 are CLOSED / PROVEN / INTEGRATED. TASK-632/C07A materialization is CLOSED / PROVEN / INTEGRATED. Durable persistence/storage and recovery beyond deterministic fail-closed admission remain explicit DEFER/non-goals.

## TASK-632 / C07A Construction admission
Materialization PR #999 merged as `053f11e64f6e4e4726383a69f1925a702b6dc6ac`; pointer reconciliation produced fresh Construction base `main@a3449d964688654e681905e770774b69943197fb`.
Allowed product: `packages/station-provider-boundary/**` plus focused `tests/product/station-s3-c07*.test.ts` and bounded TASK/NEXT_WORK memory; `max_files: 6`.
Forbidden: Core, Application/Tool owners, app-runtime/apps/shell/interaction/composition/ui-core, concrete provider/runtime/deploy, SDK/API/network discovery, secrets, durable persistence/storage, executable command/business authority, UI/a11y, C10/Studio and AI/MCP.

## Acceptance / proof obligations
- stable provider-neutral binding identity distinct from Application/Tool/Component/presentation/command/runtime identity;
- deterministic compatible substitution, idempotence, and order-independence where ordering is semantically irrelevant;
- explicit portability/exit representation without concrete provider as canonical business meaning;
- unknown/stale/malformed/duplicate/ambiguous/incompatible refs fail closed before canonical mutation with zero partial mutation;
- C01–C06 owner contracts preserved under unchanged preconditions;
- no provider runtime/deploy/secrets, persistence/storage, command/business/Core, UI, Studio or AI/MCP authority;
- focused positive + adversarial executable proof;
- current exact-head mandatory gates plus distinct current merge-candidate GREEN before integration.

## Construction :10 handoff
Branch: `sprint/station-s3-wp7-c07a-construction`.
TASK: TASK-632 / C07A.
Fresh base: `main@a3449d964688654e681905e770774b69943197fb`.
Delta: `packages/station-provider-boundary/index.ts` implements only an in-memory provider-neutral binding, deterministic compatible substitution and explicit exit intent; `tests/product/station-s3-c07-provider-portability.test.ts` supplies focused positive/adversarial proof. This pointer is the third changed file; total remains within 3/6.

Test Review/Hardening: positive proof covers stable identity, semantically irrelevant candidate-order independence, compatible substitution, substitution idempotence, frozen canonical result and exit-intent idempotence. Adversarial proof covers malformed, unknown, stale, incompatible, duplicate and ambiguous refs plus zero mutation on rejection. Shape inspection asserts absence of Application/Tool/ComponentRegistry, command, runtime/deploy/secrets/storage/persistence/SDK/endpoint and business-result authority fields.

QA Coverage/Evidence Review: behavior and focused proof are IMPLEMENTED but remain UNPROVEN-GAP until the final one-commit exact-head receives current repository gates and a distinct current merge-candidate GREEN. No local execution is claimed. C01–C06 proofs are inherited only under unchanged owner contracts. Accessibility is N/A because no UI/DOM/interaction owner is touched. Provider SDK/runtime/deploy/secrets, durable persistence/storage, migration/recovery beyond fail-closed, Core/business authority, C07B/C08+ and C10/Studio remain DEFER/inelegible.

BLOCKER-FIRST next action: normalize the TASK-632 Construction tree to exactly one authoritative commit on this fresh base, open the Construction PR, and collect exact-head mandatory gates plus merge-candidate evidence. Correct only bounded TASK-632 failures. Do not merge or declare C07A PROVEN before those final-head gates are GREEN; do not advance C07B/C08+ meanwhile.
