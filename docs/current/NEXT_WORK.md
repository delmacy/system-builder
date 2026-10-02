# Next Work — STATION S3 Component Grammar & Catalog

Date: 2026-10-02
Repository truth base: `main@6ebdc87e2af55bd6c7a3c81493aada46a0209e37`
Status: S3 / WP4 C04 — TASK-618 MATERIALIZED / CONSTRUCTION ELIGIBLE

> Live execution pointer. Interpret with `docs/DOCUMENT_AUTHORITY.md`. Station-local `S3` deliberately avoids collision with the repository's historical/global milestone named `M3`.

## Authority
- `docs/DOCUMENT_AUTHORITY.md`
- `docs/contracts/001-station-component-grammar/ADDENDUM.md`
- `project_docs/execution_planning/STATION-S3-COMPONENT-GRAMMAR-PLAN-01.md`
- `project_docs/execution_planning/STATION-S3-CONSTRUCTION-MATERIALIZATION-01.md`
- `project_docs/execution_planning/STATION-S3-QA-GATES-PLAN-01.md`
- `project_docs/research/STATION-S3-R3-C4-EXIT-PROOF-MATRIX-01.md`
- `specs/tasks/TASK-618-STATION-S3-C04-RESPONSIVE-STRUCTURAL-A11Y-PRESERVATION.md`
- ADR-0017 / `docs/architecture/STATION_FRONTEND_FOUNDATION.md`

## Fresh-main / predecessor truth

C04 materialization PR #982 is integrated as `main@6ebdc87e2af55bd6c7a3c81493aada46a0209e37`. Its exact-head was `7f9eba466062947caf2534a99e1c4b2f75f332f1`; Deterministic CI, Merge Candidate CI, Heavy Product Tests and Automation Handoff State Machine were GREEN before merge. PR #982 changed 2 files against `max_files: 6` and contained no product mutation. TASK-617/C03, TASK-616/C02 and TASK-615/C01 remain CLOSED / PROVEN. TASK-618 is now the next dependency-safe Construction slice; its new behavior/evidence remains UNPROVEN-GAP until Construction evidence exists.

Preserve throughout S3: `ComponentRegistry != AppManifest`; identity != placement != presentation != action; semantic patterns above generic primitives; discrete/span composition distinct from WindowGeometry; Station presentation/composition-only with no Core/business authority; C10 Studio DEFER/UNPROVEN.

## C04 owner / reuse census

Fresh main already owns canonical composition identity and discrete placement in `packages/station-composition/graph.ts`: `CompositionNode.ref`/`componentRef` are independent from `CompositionNodePlacement`, whose fields are `parentRef`, `slotRef`, `columnSpan`, and `rowSpan`. Existing graph validation checks placement through the ComponentRegistry. Lower-layer primitive/focus/keyboard proofs remain inherited only where their contracts and preconditions are unchanged.

TASK-618 bounds C04 to a Station-local responsive structural projection over canonical composition placement. It must preserve canonical/semantic order and identity, must not mutate canonical placement merely to render a responsive view, and must not acquire focus/command/Core/business authority.

## Test Review / Hardening

Construction must prove visual-vs-semantic reorder preservation, deterministic breakpoint behavior, rejection of invalid span/slot bypass, no canonical graph mutation, identity preservation across responsive placement, no hidden/collapsed presentation leakage into focus/command target semantics, and non-pixel-only semantic evidence. Negative/adversarial/recovery obligations remain mandatory; inherited evidence is reusable only with unchanged preconditions.

## QA Coverage / Evidence Review

Coverage vocabulary remains `proven | failed | unproven-gap | not-applicable`. Construction must record inherited proofs with unchanged preconditions, focused C04 delta evidence, exact-head freshness and explicit gaps. Accessibility/semantic order is a first-class proof obligation. Human acceptance remains separate from machine conformance. No C05+ obligation is claimed.

## Gates / blockers

Materialization blocker is cleared. TASK-618 is bounded with `max_files: 6`, allowed/forbidden paths, dependency on TASK-617, validation expectations and proof obligations. Construction may mutate only within TASK-618 bounds. Closure/merge remains forbidden on any FAILED/UNPROVEN material obligation, forbidden-path drift, stale candidate, incomplete proof, or red gate.

For any Construction merge, require the current exact-head mandatory gates GREEN and the current merge-candidate GREEN, recording their respective SHAs rather than inheriting PR #982 evidence.

C05+, AppManifest/C06, provider/runtime/deploy, Core/business authority and C10/Studio remain ineligible.

## Handoff :50

Closure/merge status: PR #982 materialization MERGED; TASK-618 behavior is NOT CLOSED and remains UNPROVEN-GAP pending bounded Construction.
Fresh-main observed before this handoff write: `6ebdc87e2af55bd6c7a3c81493aada46a0209e37`.
Materialization evidence: PR #982 exact-head `7f9eba466062947caf2534a99e1c4b2f75f332f1`; merge commit `6ebdc87e2af55bd6c7a3c81493aada46a0209e37`; 2 changed files <= `max_files: 6`; required observed workflows GREEN; no product mutation.
Residual debt: all new C04 responsive structural/accessibility behavior and its negative/adversarial/recovery evidence remain UNPROVEN-GAP by design until Construction. Do not reinterpret materialization CI as product proof.
Next dependency-safe work: execute only TASK-618 Construction behavior plus the smallest adequate focused proof inside its allowed paths/max-files, then perform semantic/architecture/accessibility review and obtain fresh exact-head + merge-candidate evidence before closure. Do not execute C05+ or absorb DEFER.
