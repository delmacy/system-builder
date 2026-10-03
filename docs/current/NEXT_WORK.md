# Next Work — STATION S3 Component Grammar & Catalog

Date: 2026-10-03
Repository truth base: `main@93b41083f02ebab1a7820f8428fbdf87f9210ab9`
Status: S3 / WP5 C05B — TASK-628 CONSTRUCTION / CLOSURE GATES REQUIRED

> Live execution pointer. Interpret with `docs/DOCUMENT_AUTHORITY.md`.

## Authority
- `docs/DOCUMENT_AUTHORITY.md`
- `docs/contracts/001-station-component-grammar/ADDENDUM.md`
- `project_docs/execution_planning/STATION-S3-COMPONENT-GRAMMAR-PLAN-01.md`
- `project_docs/execution_planning/STATION-S3-CONSTRUCTION-MATERIALIZATION-01.md`
- `project_docs/execution_planning/STATION-S3-QA-GATES-PLAN-01.md`
- `specs/tasks/TASK-628-STATION-S3-C05B-TOOL-RESTORATION-REBIND.md`

## Predecessor truth
TASK-627/C05A is CLOSED / PROVEN. TASK-628/C05B materialization PR #987 was integrated. Fresh main is `93b41083f02ebab1a7820f8428fbdf87f9210ab9`. C01-C04 and C05A proofs remain inherited only where owner contracts and preconditions remain unchanged. Preserve `ComponentRegistry != AppManifest`; identity != placement != presentation != action; Station presentation/orchestration-only; no Core/business authority; C10 Studio DEFER/UNPROVEN.

## Current tranche
PR #989 / TASK-628/C05B is the sole Construction tranche: Tool restoration/rebind by stable declared identity. Delta remains bounded to `packages/station-tool/index.ts`, focused `tests/product/station-s3-c05-tool-restoration.test.ts`, and this pointer (3/6 files). Forbidden boundaries remain persistence/storage ownership; lower-owner interaction/composition/shell/ui-core/apps mutation; executable command/business authority; AppManifest/C06; provider/runtime/deploy; multi-view propagation; retry/compensation; failure/recovery presentation; extension seams; C10/Studio; AI/MCP.

## Proof obligations
Construction must prove deterministic valid rebind; repeated-rebind idempotence; Tool/participant/context identity preservation; fail-closed stale/unknown/ambiguous/duplicate/incompatible refs before canonical mutation; zero mutation on rejection; no command/business authority strengthening. Accessibility is N/A because this delta introduces no UI/DOM/focus/keyboard surface.

## Handoff :50
Fresh main: `93b41083f02ebab1a7820f8428fbdf87f9210ab9`.
Prior Construction head `2065e535663bfd30baf0d641743795c768373b9a` had fresh GREEN mandatory workflows after its focused-test TypeScript blocker was corrected, but main advanced afterward and that evidence is stale for closure.
This reconciled Construction candidate preserves the product/test delta exactly while rebasing it onto fresh main and normalizing the complete bounded delta to one authoritative TASK-628 commit. Its resulting SHA is a new evidence identity and MUST receive fresh exact-head mandatory gates plus a distinct current merge-candidate GREEN before closure.
Decision Graph static review remains PASS: identity != placement != presentation != action; ComponentRegistry != AppManifest; semantic patterns above primitives; discrete/span owners untouched; focus != selection != active != expansion; no accepted/acknowledged -> effective promotion; restoration snapshot/state carries Station-owned references only and cannot strengthen executable/Core/business authority.
Residual blocker: fresh exact-head and merge-candidate evidence for the reconciled SHA are UNPROVEN until workflows publish. Do not merge on predecessor evidence.
Next dependency-safe work: collect fresh Deterministic CI, Heavy Product Tests, Station Frontend Quality, Automation Handoff State Machine, and current Merge Candidate CI. Resolve only bounded proven failures. Merge TASK-628 only when both evidence identities are GREEN and main/head remain unchanged. C05C/C06+ remain NOT ELIGIBLE; C10 remains UNPROVEN/DEFER.
