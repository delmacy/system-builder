# Next Work — STATION S3 Component Grammar & Catalog

Date: 2026-10-03
Repository truth base: `main@3459acb44414cf8f8724ad84f4ae5cc2ed6fede7`
Status: S3 / WP5 C05B — TASK-628 MATERIALIZED / CONSTRUCTION ELIGIBLE

> Live execution pointer. Interpret with `docs/DOCUMENT_AUTHORITY.md`.

## Authority
- `docs/DOCUMENT_AUTHORITY.md`
- `docs/contracts/001-station-component-grammar/ADDENDUM.md`
- `project_docs/execution_planning/STATION-S3-COMPONENT-GRAMMAR-PLAN-01.md`
- `project_docs/execution_planning/STATION-S3-CONSTRUCTION-MATERIALIZATION-01.md`
- `project_docs/execution_planning/STATION-S3-QA-GATES-PLAN-01.md`
- `specs/tasks/TASK-628-STATION-S3-C05B-TOOL-RESTORATION-REBIND.md`

## Predecessor truth
TASK-627/C05A is CLOSED / PROVEN. TASK-628/C05B materialization PR #987 was exact-head GREEN and integrated into `main` as `3459acb44414cf8f8724ad84f4ae5cc2ed6fede7`. C01-C04 and C05A proofs remain inherited only where owner contracts and preconditions remain unchanged. Preserve `ComponentRegistry != AppManifest`; identity != placement != presentation != action; Station presentation/orchestration-only; no Core/business authority; C10 Studio DEFER/UNPROVEN.

## Current tranche
TASK-628/C05B is the sole Construction-eligible tranche: Tool restoration/rebind by stable declared identity. Allowed paths remain `packages/station-tool/**`, focused `tests/product/station-s3-c05*.test.ts`, TASK-628 spec and this bounded pointer, with `max_files: 6`. Forbidden boundaries remain persistence/storage ownership; lower-owner interaction/composition/shell/ui-core/apps mutation; executable command/business authority; AppManifest/C06; provider/runtime/deploy; multi-view propagation; retry/compensation; failure/recovery presentation; extension seams; C10/Studio; AI/MCP.

## Proof obligations
Construction must prove deterministic valid rebind; idempotence; Tool/participant/view/component identity preservation; fail-closed stale/unknown/ambiguous/duplicate/incompatible refs; zero mutation on rejection; no authority strengthening. Accessibility is N/A unless Construction introduces UI; if UI is required, STOP/rematerialize.

## Handoff :50
Materialization closure: PR #987 integrated. Materialization exact-head `98893538940c493f809a1e87cd845a36aaf192e5` was GREEN for Deterministic CI, Merge Candidate CI, Heavy Product Tests and Automation Handoff State Machine before protected exact-head merge.
Integrated predecessor main: `3459acb44414cf8f8724ad84f4ae5cc2ed6fede7`.
TASK-628 status: MATERIALIZED / CONSTRUCTION ELIGIBLE; C05B remains UNPROVEN until Construction exact-head evidence and integration close the task.
Evidence/review: materialization was documentation/task-only; no product/lower-owner mutation; allowed/forbidden scope and `max_files: 6` remain conformant; semantic boundary remains restoration/rebind by stable declared identity only.
Residual blocker: none known before Construction. Construction must establish its own exact-head evidence; materialization proof does not prove product behavior.
Next dependency-safe work: from fresh main after this bounded pointer commit, create/revalidate the TASK-628 Construction branch and implement only the smallest C05B restoration/rebind delta with focused proof. If implementation requires a forbidden owner/boundary, UI, persistence ownership, multi-view propagation, or >6 files, STOP/rematerialize. Do not materialize C05C/C06+ until TASK-628 closes.
