# Contract Increment Registry

Status: CANONICAL SCOPE REGISTRY

This registry tracks **scope admission**, not execution state. Live work remains governed by `docs/current/NEXT_WORK.md`.

## Migration state

The repository predates the contract-increment model. Existing scope history will be reconstructed conservatively from accepted repository evidence. Until an increment is materialized here, existing accepted ADRs/contracts remain authoritative according to `docs/DOCUMENT_AUTHORITY.md`.

| Increment | Kind | Admission | Scope | State | Evidence |
|---|---|---|---|---|---|
| `000-base` | Base contract | reconstructed / pending materialization | Original System Builder project scope and durable founding boundaries | migration pending | existing architecture, ADRs, bootstrap and early plans |
| `001-station-component-grammar` | Addendum | 2026-09-26 explicit post-M2 continuation | Station component grammar/catalog research and materialization from primitives through Studio-readiness, with Core reuse/projection census | accepted / planning | `docs/contracts/001-station-component-grammar/ADDENDUM.md` |
| subsequent | Addenda | chronological | Material scope additions accepted after the base | materialize incrementally | source request + accepted repository artifact |

## Admission invariant

A new product/architecture scope family must not be inferred from a sprint, milestone, Work Package, research finding, branch name, chat fragment, or historical `ACTIVE/READY` token.

It becomes admitted scope when it is explicitly represented as either:

- part of `000-base`, or
- a numbered accepted addendum under `docs/contracts/`.

Implementation planning then references that increment.
