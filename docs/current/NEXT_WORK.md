# Next Work — STATION S3 Component Grammar & Catalog

Date: 2026-10-02
Repository truth base: `main@6d82e1f2f9394ac019d07d91ab56db76a1281815`
Status: S3 / WP3 C03 MATERIALIZATION — TASK-617 GATE PENDING

> Live execution pointer. Interpret with `docs/DOCUMENT_AUTHORITY.md`. Station-local `S3` deliberately avoids collision with the repository's historical/global milestone named `M3`.

## Authority
- `docs/DOCUMENT_AUTHORITY.md`
- `docs/contracts/001-station-component-grammar/ADDENDUM.md`
- `project_docs/execution_planning/STATION-S3-COMPONENT-GRAMMAR-PLAN-01.md`
- `project_docs/execution_planning/STATION-S3-CONSTRUCTION-MATERIALIZATION-01.md`
- `project_docs/execution_planning/STATION-S3-QA-GATES-PLAN-01.md`
- `project_docs/research/STATION-S3-R3-C4-EXIT-PROOF-MATRIX-01.md`
- `specs/tasks/TASK-617-STATION-S3-C03-COMMAND-CURRENTNESS-RESULT-PROJECTION.md`
- ADR-0017 / `docs/architecture/STATION_FRONTEND_FOUNDATION.md`

## Fresh-main / predecessor truth

PR #978 merged as `main@6d82e1f2f9394ac019d07d91ab56db76a1281815`, reconciling C02 closure. TASK-616/C02 and TASK-615/C01 are CLOSED / PROVEN.

Preserve throughout S3: `ComponentRegistry != AppManifest`; identity != placement != presentation != action; semantic patterns above generic primitives; discrete/span composition distinct from WindowGeometry; Station presentation/composition-only with no Core/business authority; C10 Studio DEFER/UNPROVEN.

## WP3 / C03 owner-reuse census

Fresh-main census confirms `PresentationCommandRegistry` already owns unique semantic presentation-command identity and recomputes availability immediately before `execute()`. `StationInteractionContext` keeps focus, selection and surface explicit. `CoreCommandIntent` is deliberately non-executable by the presentation registry. Existing Station/Core contracts already own target + expected-revision protocol and authoritative stale rejection; those contracts are reuse evidence, not Station authority.

The C4 research matrix is evidence only but aligns with the accepted S3 boundary: accepted/acknowledged is not necessarily effective; partial/unknown/stale are not success; retry and compensation remain owner-qualified. C03 therefore needs a bounded Station projection/adaptation delta, not a universal result/retry/compensation engine and not a Core contract change.

## Materialized TASK

TASK-617 — C03 Command Currentness & Result Projection is materialized on branch `planning/station-s3-wp3-c03-materialization` with `max_files: 6`. Allowed product paths are bounded to `packages/station-interaction/**` and, only if required by the projection adapter, `packages/station-shell/command-surface.tsx`, plus focused product tests. Core contracts, runtime/deploy/compiler/station-app-runtime and `apps/station/**` are forbidden.

Construction behavior obligations: stable semantic command identity across projections; stale rendered availability cannot dispatch because invocation revalidates; owner target/currentness is projected without becoming Station authority; owner result semantics are not strengthened (`accepted != effective`, partial/unknown/stale != success); retry/compensation is absent unless explicitly owner-declared; CoreCommandIntent remains non-executable by PresentationCommandRegistry.

## Test Review / Hardening plan

Challenge duplicate identity hidden by relocation; TOCTOU availability; focus/selection accidentally treated as authoritative target; result-state strengthening; retry/compensation inferred from UI state; CoreCommandIntent accidentally executable. Coverage vocabulary is `proven | failed | unproven-gap | not-applicable`.

## QA Coverage / Evidence Review plan

Focused evidence must prove the C03 delta and predecessor integration. Existing registry and Station/Core proofs may be inherited only with unchanged preconditions. Core stale-revision evidence proves its owner boundary, not a new Station authority. Missing owner semantics remain `unproven-gap`; human acceptance remains separate. Exact-head repository gates are required before closure.

## Gates / blockers

This materialization branch/PR must be integrated and fresh main revalidated before product mutation. Until then TASK-617 is materialized but Construction is not yet eligible. C04+, AppManifest/C06, provider/runtime/deploy, Core/business authority, universal result/retry/compensation engines and C10/Studio remain ineligible.

## Handoff

Branch: `planning/station-s3-wp3-c03-materialization`.
TASK: TASK-617 only.
Truth base: `main@6d82e1f2f9394ac019d07d91ab56db76a1281815`.
Files changed by this materialization: `specs/tasks/TASK-617-STATION-S3-C03-COMMAND-CURRENTNESS-RESULT-PROJECTION.md`, `docs/current/NEXT_WORK.md` only.
Proof status: planning/materialization obligations explicit; executable C03 proof remains UNPROVEN-GAP until Construction. No product code changed.
Next eligible work: validate/merge this materialization; after integration, revalidate fresh main and execute only TASK-617 behavior + smallest focused proof within its bounds.
