# Contract Increment Registry

Status: CANONICAL SCOPE REGISTRY

This registry tracks **scope admission**, not execution state. Live work remains governed by `docs/current/NEXT_WORK.md`.

## Migration state

The repository predates the contract-increment model. Existing scope history is reconstructed conservatively from accepted repository evidence. Existing accepted ADRs/contracts remain authoritative according to `docs/DOCUMENT_AUTHORITY.md`; reconstruction does not demote them or promote research.

| Increment | Kind | Admission | Scope | State | Evidence |
|---|---|---|---|---|---|
| `000-base` | Base contract | reconstructed 2026-09-26 | Original System Builder project identity and durable founding boundaries | reconstructed / accepted baseline | `docs/contracts/000-base/README.md`, `docs/contracts/000-base/PROVENANCE.md`, accepted constitutional authority |
| `001-station-component-grammar` | Addendum | 2026-09-26 explicit post-M2 continuation | Station component grammar/catalog research and materialization from primitives through Studio-readiness, with Core reuse/projection census | accepted / construction closed 2026-10-04 | `docs/contracts/001-station-component-grammar/ADDENDUM.md`, `docs/contracts/001-station-component-grammar/PROVENANCE.md`, `docs/contracts/001-station-component-grammar/TRACEABILITY.md` |
| `002-station-visual-factory` | Addendum | 2026-10-04 explicit next-WP authorization after S3 closure | Shared Station visual factory/editor foundation using proven C0→C9 grammar; synchronized Layers/Inspector/Preview, constrained grid/span editing and Station-owned draft save/discard | accepted / WP1 bounded slice closed on validated TASK-645 integration | `docs/contracts/002-station-visual-factory/ADDENDUM.md`, `project_docs/execution_planning/STATION-S4-VISUAL-FACTORY-WP1-PLAN-01.md` |
| `003-station-editor-operational-journey` | Addendum | 2026-10-10 explicit next-package continuation after WP1 | Source-owned composition catalog, reusable workbench and Station launcher/window editor journey | accepted / WP2 CLOSED via #1039 | `docs/contracts/003-station-editor-operational-journey/ADDENDUM.md`, `project_docs/execution_planning/STATION-S4-WP2-EDITOR-OPERATIONAL-PLAN-01.md` |
| `004-station-portable-composition-artifacts` | Addendum | 2026-10-10 owner-authorized WP3 continuation | Data-only portable Station composition codec; strict validation/source-owned registry; explicit origin-local and portable file workflow via RESOLUTION-02 | accepted via #1043/#1045; A/B/review integrated; WP3 CLOSED on validated documentation closure integration | `docs/contracts/004-station-portable-composition-artifacts/ADDENDUM.md`, `docs/contracts/004-station-portable-composition-artifacts/RESOLUTION-01.md`, `docs/contracts/004-station-portable-composition-artifacts/RESOLUTION-02.md`, `project_docs/execution_planning/STATION-S4-WP3-DOCUMENTATION-CLOSURE-01.report.md` |
| subsequent | Addenda | chronological | Material scope additions accepted after the base | materialize incrementally | source request + accepted repository artifact |

## Admission invariant

A new product/architecture scope family must not be inferred from a sprint, milestone, Work Package, research finding, branch name, chat fragment, or historical `ACTIVE/READY` token.

It becomes admitted scope when it is explicitly represented as either part of `000-base` or a numbered accepted addendum under `docs/contracts/`.

Implementation planning then references that increment.
