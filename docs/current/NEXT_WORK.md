# Next Work — STATION S3 Component Grammar & Catalog

Date: 2026-10-03
Repository truth base: `main@ce0ee654ac71df796a82c4315fb26af0e1c5f197`
Status: S3 / WP5 C05B — TASK-628 MATERIALIZATION BLOCKED ON CURRENT EXACT-HEAD GATES

> Live execution pointer. Interpret with `docs/DOCUMENT_AUTHORITY.md`.

## Authority
- `docs/DOCUMENT_AUTHORITY.md`
- `docs/contracts/001-station-component-grammar/ADDENDUM.md`
- `project_docs/execution_planning/STATION-S3-COMPONENT-GRAMMAR-PLAN-01.md`
- `project_docs/execution_planning/STATION-S3-CONSTRUCTION-MATERIALIZATION-01.md`
- `project_docs/execution_planning/STATION-S3-QA-GATES-PLAN-01.md`
- `specs/tasks/TASK-628-STATION-S3-C05B-TOOL-RESTORATION-REBIND.md`

## Predecessor truth
TASK-627/C05A is CLOSED / PROVEN. Fresh main is `ce0ee654ac71df796a82c4315fb26af0e1c5f197`. C01-C04 and C05A proofs remain inherited only where owner contracts and preconditions remain unchanged. Preserve `ComponentRegistry != AppManifest`; identity != placement != presentation != action; Station presentation/orchestration-only; no Core/business authority; C10 Studio DEFER/UNPROVEN.

## Current tranche and bounded hardening
PR #987 is the sole authoritative TASK-628/C05B restoration/rebind materialization. It is planning-only; Construction/product mutation remains blocked until materialization is exact-head GREEN and integrated. Allowed paths remain `packages/station-tool/**`, focused `tests/product/station-s3-c05*.test.ts`, TASK-628 spec and this bounded pointer, with `max_files: 6`. Forbidden boundaries remain persistence/storage ownership; lower-owner interaction/composition/shell/ui-core/apps mutation; executable command/business authority; AppManifest/C06; provider/runtime/deploy; multi-view propagation; retry/compensation; failure/recovery presentation; extension seams; C10/Studio; AI/MCP.

The :30 head `4309a740c3f7a87db01f8733f5da2a61be133cbc` failed Deterministic CI and Merge Candidate CI. Exact-head logs identified one bounded repository-conformance cause: TASK-628 lacked mandatory task sections `Context`, `Current behavior`, `Inputs / contracts`, and `Outputs / contracts`; task-catalog tests therefore failed 4/333 while Heavy Product Tests and Automation Handoff State Machine were GREEN. The task spec was corrected without product mutation. All gate evidence from `4309a740...` is stale for the corrected head.

## Proof obligations
C05B remains UNPROVEN-GAP: deterministic valid rebind; idempotence; Tool/participant/view/component identity preservation; fail-closed stale/unknown/ambiguous/duplicate/incompatible refs; zero mutation on rejection; no authority strengthening. Accessibility is N/A for this planning-only/non-UI tranche; if Construction needs UI, STOP/rematerialize.

## Handoff :50
Closure/merge: BLOCKED; PR #987 remains draft/open and is not merge-eligible.
Fresh main: `ce0ee654ac71df796a82c4315fb26af0e1c5f197`.
Failed predecessor exact-head: `4309a740c3f7a87db01f8733f5da2a61be133cbc`; Deterministic CI FAILED and Merge Candidate CI FAILED; Heavy Product Tests and Automation Handoff State Machine GREEN. Root cause was missing mandatory task sections, corrected boundedly.
Corrective spec commit before this handoff write: `c163b5b25ba8f2dfd633a246b9e2331d4b191b74`. This handoff write advances the branch again, so both prior SHAs are stale for merge proof. Re-read PR head after this commit and require mandatory exact-head GREEN plus current merge-candidate GREEN, recording distinct proven SHAs. Do not merge on predecessor evidence.
Evidence/review: materialization remains documentation/task-only; no product/lower-owner mutation; allowed/forbidden scope and `max_files: 6` remain conformant; semantic boundary remains restoration/rebind by stable declared identity only; negative/adversarial/recovery obligations remain explicit and unproven until Construction; accessibility N/A.
Residual debt/blocker: current exact-head gates for the post-handoff SHA are not yet proven. No Sprint closure while this remains UNPROVEN.
Next dependency-safe work: revalidate fresh main/base/head, collect current exact-head and merge-candidate gates for PR #987, resolve only any bounded conformance failure, and merge materialization only when both are GREEN. After merge revalidate fresh main; only then may TASK-628 Construction begin. C05C/C06+, AppManifest, Core/business authority, provider/runtime/deploy and C10/Studio remain ineligible.
