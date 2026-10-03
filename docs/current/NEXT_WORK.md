# Next Work — STATION S3 Component Grammar & Catalog

Date: 2026-10-03
Repository truth base: `main@64640417f4c7d9990c3bacbadfe61bd7c8f51d0b`
Status: S3 / WP5 C05C — TASK-629 RENORMALIZED / EXACT-HEAD GATES REQUIRED

> Live execution pointer. Interpret with `docs/DOCUMENT_AUTHORITY.md`.

## Authority
- `docs/DOCUMENT_AUTHORITY.md`
- `docs/contracts/001-station-component-grammar/ADDENDUM.md`
- `project_docs/execution_planning/STATION-S3-COMPONENT-GRAMMAR-PLAN-01.md`
- `project_docs/execution_planning/STATION-S3-CONSTRUCTION-MATERIALIZATION-01.md`
- `project_docs/execution_planning/STATION-S3-QA-GATES-PLAN-01.md`
- `specs/tasks/TASK-629-STATION-S3-C05C-TOOL-MULTIVIEW-CONVERGENCE.md`

## Predecessor truth
TASK-627/C05A and TASK-628/C05B are CLOSED / PROVEN. TASK-629/C05C materialization is integrated. C01-C04 and C05A/C05B proofs remain inherited only where owner contracts and preconditions remain unchanged. Preserve `ComponentRegistry != AppManifest`; identity != placement != presentation != action; semantic patterns above primitives; discrete/span composition ownership; Station presentation/orchestration-only; no Core/business authority; C10 Studio DEFER/UNPROVEN.

## Construction / hardening truth
PR #992 carries only the bounded TASK-629 C05C delta: `packages/station-tool/multiview.ts`, `tests/product/station-s3-c05-tool-multiview.test.ts`, and this handoff; 3/6 paths and no forbidden-owner drift. Semantic hardening rejects a declared view whose contexts exclude the canonical active context before projection. Multi-view projections remain Station-owned and carry no command execution, authorization, persistence or business authority. Accessibility is `not-applicable`: no UI/DOM/focus/keyboard surface is introduced.

## Test Review / Hardening
Focused proof covers one-authority/many-view convergence before/after canonical context switch, deterministic/idempotent projection, view/participant identity preservation, zero mutation of the canonical Tool, duplicate/stale/unknown/malformed/incompatible declarations fail-closed, and absence of `commandId`, `targetRef`, `authorized` or `execute` surfaces. The incompatible-active-context false positive found during semantic review is explicitly rejected and tested.

## QA Coverage / Evidence Review
Prior GREEN evidence belongs to superseded heads and is stale for closure. The complete bounded TASK-629 delta has now been renormalized as one authoritative commit directly on fresh `main@64640417f4c7d9990c3bacbadfe61bd7c8f51d0b`. Exact-head lint/typecheck/product/architecture/verify and a distinct current merge-candidate remain `unproven-gap` until workflows publish for the renormalized branch head. Do not merge or close C05C before current evidence is GREEN.

## Handoff :10
Fresh main used for renormalization: `64640417f4c7d9990c3bacbadfe61bd7c8f51d0b`.
Branch/PR: `sprint/station-s3-wp5-c05c-construction` / PR #992 (draft).
Head: the single authoritative TASK-629 commit containing this handoff; resolve the exact SHA from the branch/PR ref after ref update and use only that SHA for gates.
TASK: TASK-629 / C05C Tool Multi-view Convergence — ACTIVE / BLOCKED FOR CLOSURE PENDING CURRENT EVIDENCE.
Files changed: `packages/station-tool/multiview.ts`, `tests/product/station-s3-c05-tool-multiview.test.ts`, `docs/current/NEXT_WORK.md`; 3/6 files. No Core/business authority, AppManifest/C06, shell/interaction/composition/ui-core, provider/runtime/deploy, persistence/storage, executable command authorization or C10/Studio mutation.
Proof state: focused behavior/adversarial proof is present; exact-head and merge-candidate evidence are UNPROVEN until current workflows publish. Accessibility N/A.
Residual debt: retry/compensation, failure/recovery presentation and extension seams remain explicit DEFER/UNPROVEN; C06/AppManifest remains dependency-blocked by C05C closure.
Next dependency-safe work: collect mandatory GREEN exact-head gates for the renormalized head plus a distinct current GREEN merge-candidate; perform final semantic/conformance review; merge only then and revalidate fresh main. C06/AppManifest, Core/business authority, provider/runtime/deploy and C10/Studio remain NOT ELIGIBLE / DEFER.
