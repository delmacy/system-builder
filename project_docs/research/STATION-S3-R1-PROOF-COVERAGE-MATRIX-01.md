# Station S3-R1 — Proof Coverage Matrix 01

Date: 2026-09-27
Reconciled fresh main: `8a6ec550e954a81c9200f2f993ed347410b1383d`
Status: RESEARCH EVIDENCE — NOT PRODUCT AUTHORITY

Coverage states are only `proven`, `failed`, `unproven-gap`, `not-applicable`. Implementation existence alone is not PASS.

| Tier / subject | Obligation | Status | Inheritance / delta |
|---|---|---|---|
| C0 semantic/surface tokens | bounded canonical vocabulary/projection | proven | baseline vocabulary only |
| C0 token breadth | typography/spacing/radius/elevation/motion/density/responsive ownership | unproven-gap/defer | taxonomy required; implementation not mandated by R1 |
| C1 Button | safe default/stable source-owned projection | proven | reusable lower-tier evidence |
| C1 Button | accessible-name/keyboard semantics explicitly evidenced | unproven-gap | higher compounds cannot manufacture PASS |
| C1 Input/Select | source-owned stable primitive projection | proven | existence/projection only |
| C1 Select | distinction from future Combobox contractually enforced | unproven-gap | appearance similarity cannot collapse semantics |
| C2 IconButton | inherited Button + accessible-name delta | unproven-gap | prove label delta only |
| C2 ButtonGroup | grouping relation without command authority | unproven-gap | relation proof required |
| C2 Toggle | pressed state projection synchronized | proven | inherits activation surface; proves state delta |
| C2 Toggle | prevented activation does not mutate state | unproven-gap | delta proof only |
| C3 Tree | roles/levels/selection/expansion/roving focus/navigation conformance | unproven-gap | implementation evidence exists; executable collection proof missing |
| C3 selection validity | inconsistent presentation selection fails closed | proven | reusable interaction proof |
| C4 command availability | availability rechecked at invocation/fails closed | proven | reusable capability proof |
| C4 command identity | multiple controls resolve to one semantic command | proven | supports alternate projection invariance |
| C4 shortcut semantics | normalization/conflict deterministic | proven | reusable binding proof |
| C4 Station/Core boundary | Core intent cannot register as executable presentation command | proven | authority-boundary proof |
| C4 duplicate identity | duplicate presentation command IDs fail closed | proven | registry identity proof |
| C4 Menu capability | collection/focus/activation/dismissal/restoration | unproven-gap | MenuSurface is surface-only |
| C4 Tooltip capability | trigger modalities/timing/dismissal/focus relation | unproven-gap | implementation != mature capability |

No `failed` row was established by this bounded census. That means no located executable evidence contradicted an obligation; uncovered obligations remain gaps.

## Inheritance rule

C0 establishes vocabulary/projection. C1 establishes primitive semantics/safe defaults/stable slots. C2 inherits C1 and proves only added relation/state. C3 inherits primitive activation/selection and proves traversal, ordering, active/focus/selection and expansion deltas. C4 inherits projection primitives/collections and proves command identity, availability, binding, authority boundary, failure/recovery and representation invariance. C5-C10 must inherit lower proofs and prove only their new contracts.

A missing inherited proof propagates as `unproven-gap`; inheritance never upgrades a gap to PASS.

## Dedup consequences

Tree is not a missing component; its gap is executable collection conformance and eventual catalog authority. PresentationCommandRegistry already supports semantic command reuse; responsive overflow should reuse command identity. CoreCommandIntent separation is already product-tested and must not be duplicated as a second authority. MenuSurface remains a surface until collection/dismissal/focus deltas are proven. IconButton/Toggle are proof-inheritance cases, not reasons to duplicate all Button tests.

## Gate

This matrix is reconciled onto fresh main as research evidence. It does not authorize Construction.