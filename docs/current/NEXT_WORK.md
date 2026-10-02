# Next Work — STATION S3 Component Grammar & Catalog

Date: 2026-10-02
Repository truth base: `main@4825395e661b4ec5042a179c4b3a662260b9f53a`
Status: S3 / WP4 C04 — TASK-618 MATERIALIZED / MATERIALIZATION GATES PENDING

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

C03 closure reconciliation is integrated as `main@4825395e661b4ec5042a179c4b3a662260b9f53a`. TASK-617/C03, TASK-616/C02 and TASK-615/C01 are CLOSED / PROVEN. C04 is the next dependency-safe accepted Construction slice.

Preserve throughout S3: `ComponentRegistry != AppManifest`; identity != placement != presentation != action; semantic patterns above generic primitives; discrete/span composition distinct from WindowGeometry; Station presentation/composition-only with no Core/business authority; C10 Studio DEFER/UNPROVEN.

## C04 owner / reuse census

Fresh main already owns canonical composition identity and discrete placement in `packages/station-composition/graph.ts`: `CompositionNode.ref`/`componentRef` are independent from `CompositionNodePlacement`, whose fields are `parentRef`, `slotRef`, `columnSpan`, and `rowSpan`. Existing graph validation checks placement through the ComponentRegistry. Lower-layer primitive/focus/keyboard proofs remain inherited only where their contracts and preconditions are unchanged.

TASK-618 therefore bounds C04 to a Station-local responsive structural projection over canonical composition placement. It must preserve canonical/semantic order and identity, must not mutate canonical placement merely to render a responsive view, and must not acquire focus/command/Core/business authority.

## Test Review / Hardening

TASK-618 explicitly requires review of visual-vs-semantic reorder, breakpoint ambiguity, invalid span/slot bypass, canonical graph mutation, identity regeneration after placement changes, hidden/collapsed presentation leaking into focus/command target semantics, and pixel-only false-positive tests. All new C04 obligations remain `unproven-gap` until Construction evidence exists.

## QA Coverage / Evidence Review

Coverage vocabulary remains `proven | failed | unproven-gap | not-applicable`. Construction must record inherited proofs with unchanged preconditions, focused C04 delta evidence, exact-head freshness and explicit gaps. Human acceptance remains separate from machine conformance. No C05+ obligation is claimed.

## Gates / blockers

TASK-618 is materially bounded with `max_files: 6`, allowed/forbidden paths, dependency on TASK-617, validation expectations and proof obligations. Product mutation remains ineligible until this materialization branch/PR passes required exact-head gates and is integrated into fresh main.

C05+, AppManifest/C06, provider/runtime/deploy, Core/business authority and C10/Studio remain ineligible.

## Handoff

Branch: `planning/station-s3-wp4-c04-materialization`.
Truth base: `main@4825395e661b4ec5042a179c4b3a662260b9f53a`.
TASK: TASK-618 materialization only; no product mutation.
Files changed: `specs/tasks/TASK-618-STATION-S3-C04-RESPONSIVE-STRUCTURAL-A11Y-PRESERVATION.md`, `docs/current/NEXT_WORK.md`.
Proof status: materialization authored; new C04 behavior/evidence remains UNPROVEN-GAP.
Blockers: materialization exact-head CI/QA and integration are required before Construction.
Next eligible work: validate/merge this materialization; then revalidate fresh main and execute only TASK-618 behavior + smallest adequate focused proof within its bounds. Do not execute C05+ or absorb DEFER.
