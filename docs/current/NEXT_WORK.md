# Next Work — STATION S3 Component Grammar & Catalog

Date: 2026-10-03
Repository truth base: `main@053f11e64f6e4e4726383a69f1925a702b6dc6ac`
Status: S3 / WP7 C07A — TASK-632 MATERIALIZATION CLOSED / PROVEN / INTEGRATED; Construction AUTHORIZED / PRODUCT UNPROVEN

> Live execution pointer. Interpret with `docs/DOCUMENT_AUTHORITY.md`.

## Authority
- `docs/DOCUMENT_AUTHORITY.md`
- `docs/contracts/001-station-component-grammar/ADDENDUM.md`
- `project_docs/execution_planning/STATION-S3-COMPONENT-GRAMMAR-PLAN-01.md`
- `project_docs/execution_planning/STATION-S3-CONSTRUCTION-MATERIALIZATION-01.md`
- `project_docs/execution_planning/STATION-S3-QA-GATES-PLAN-01.md`
- `specs/tasks/TASK-632-STATION-S3-C07A-PROVIDER-PORTABILITY-BOUNDARY.md`

## Predecessor truth
C01–C05 are PROVEN under unchanged recorded preconditions. C06A/TASK-630 and C06B/TASK-631 are CLOSED / PROVEN / INTEGRATED. The C06 census found all accepted mandatory C9/Application obligations closed; durable persistence/storage and recovery beyond deterministic fail-closed admission remain explicit non-goals/deferred rather than hidden closure gaps. TASK-632/C07A materialization is now CLOSED / PROVEN / INTEGRATED; C07A product evidence remains UNPROVEN-GAP.

## TASK-632 / C07A Construction admission
Materialization branch: `planning/station-s3-wp7-c07a-provider-portability-materialization`.
Materialization start truth: `main@d719442a620a4a5824386e423fbc274ab54e8bc0`.
Final materialization exact head: `dafeb238ba139cf053ddc012e705bbd9375b3428`.
Materialization integration: PR #999 merged as `053f11e64f6e4e4726383a69f1925a702b6dc6ac`.
Construction: AUTHORIZED from reconciled fresh main after this pointer-only commit; product obligations remain UNPROVEN until Construction supplies its own current exact-head and merge-candidate evidence.

Allowed product: `packages/station-provider-boundary/**` plus focused `tests/product/station-s3-c07*.test.ts` and bounded TASK/NEXT_WORK memory; `max_files: 6`.

Forbidden: `packages/core/**`, `packages/station-application/**`, `packages/station-tool/**`, app-runtime/apps/shell/interaction/composition/ui-core, concrete `provider/**`, `runtime/**`, `deploy/**`, provider SDK/API/network discovery, secrets resolution, durable persistence/storage/database/filesystem ownership, executable command authorization, Core/business result/currentness, UI/DOM/a11y, C10/Studio and AI/MCP.

## Acceptance / proof obligations
- stable provider-neutral binding identity distinct from Application/Tool/Component/presentation/command/runtime identity;
- deterministic compatible substitution, idempotence, and order-independence where ordering is semantically irrelevant;
- explicit portability/exit representation with no concrete provider promoted to canonical business meaning;
- unknown/stale/malformed/duplicate/ambiguous/incompatible refs fail closed before canonical mutation with zero partial mutation;
- C01–C06 owner contracts preserved; inheritance only under unchanged preconditions;
- no provider runtime/deploy/secrets, persistence/storage, command/business/Core, UI, Studio or AI/MCP authority;
- focused positive + adversarial executable proof;
- Construction must obtain its own current exact-head mandatory gates plus a distinct current merge-candidate GREEN before product integration.

## :50 closure handoff
Fresh predecessor main was revalidated at `d719442a620a4a5824386e423fbc274ab54e8bc0`. Final materialization exact head `dafeb238ba139cf053ddc012e705bbd9375b3428` completed Heavy Product Tests, Automation Handoff State Machine/reducer, Deterministic CI/exact-head and Merge Candidate CI GREEN. PR #999 remained exactly based on the recorded predecessor main and was mergeable after draft removal.

BLOCKER-FIRST closure: the earlier deterministic-verification failures were bounded predecessor task-catalog conformance defects in TASK-631, repaired without changing accepted C06B semantics or product. No C07 product was introduced during materialization. Final head evidence supersedes all predecessor failed/stale runs.

Integration: PR #999 was merged with expected-head protection at exact head `dafeb238...`; merge commit `053f11e64f6e4e4726383a69f1925a702b6dc6ac` has parents `d719442a...` and `dafeb238...`. Materialization is therefore CLOSED / PROVEN / INTEGRATED. Proof inheritance stops at the materialization boundary: provider substitution/exit product behavior remains UNPROVEN and requires Construction evidence.

Residual debt: provider substitution/exit product obligations remain UNPROVEN-GAP until Construction; recovery beyond deterministic fail-closed admission remains deferred.

Next dependency-safe action for Construction :10: start TASK-632/C07A product work from the fresh main containing this pointer reconciliation. Implement only the smallest provider-neutral binding/substitution/portability boundary inside the allowed owner, with focused positive/adversarial proof. Do not advance C07B/C08+, provider runtime/deploy/secrets, durable persistence, Core/business authority or C10/Studio.