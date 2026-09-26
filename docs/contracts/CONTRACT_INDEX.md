# Contract Increment Registry

Status: CANONICAL SCOPE REGISTRY

This registry tracks **scope admission**, not execution state. Live work remains governed by `docs/current/NEXT_WORK.md`.

## Migration state

The repository predates the contract-increment model. Existing scope history is being reconstructed conservatively from accepted repository evidence. `000-base` now records the durable founding baseline without importing later research or execution scope. Later accepted material additions will be reconstructed incrementally as numbered addenda only when provenance is sufficiently established.

Existing accepted ADRs/contracts remain authoritative according to `docs/DOCUMENT_AUTHORITY.md`; reconstruction does not demote them or turn historical execution plans into authority.

| Increment | Kind | Admission | Scope | State | Evidence |
|---|---|---|---|---|---|
| [`000-base`](./000-base/README.md) | Base contract | reconstructed from accepted repository authority | Founding System Builder identity and durable boundaries: business/technical separation, Builder/Runtime separation, autonomous published runtimes, compatibility, portability and explicit module contracts | reconstructed | `AGENTS.md`, accepted architecture/ADRs, integrated corroborating evidence |
| `001+` | Addenda | chronological | Material scope additions accepted after the founding baseline | migration pending / materialize incrementally | accepted provenance required per addendum |

## Admission invariant

A new product/architecture scope family must not be inferred from a sprint, milestone, Work Package, research finding, branch name, chat fragment, or historical `ACTIVE/READY` token.

It becomes admitted scope when it is explicitly represented as either:

- part of `000-base`, or
- a numbered accepted addendum under `docs/contracts/`.

Implementation planning then references that increment.

## Reconstruction invariant

Chronological reconstruction is conservative: uncertainty stays explicit. Research, forecasts and historical execution artifacts may corroborate provenance, but they are not promoted to scope authority merely by being copied or summarized. A later addendum is materialized only when the accepted repository evidence is strong enough to identify the admitted scope and its temporal relationship to the preceding increments.
