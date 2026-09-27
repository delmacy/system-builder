# Station S3-R1 — Exit Matrix 01

Date: 2026-09-27
Reconciled fresh main: `8a6ec550e954a81c9200f2f993ed347410b1383d`
Status: RESEARCH EVIDENCE — NOT PRODUCT AUTHORITY

## Purpose

Consolidate R1 census/parity into one exit-oriented view on a branch created directly from fresh main. This document does not authorize Construction or promote research findings into product authority.

Preserve: identity != placement != presentation != action; ComponentRegistry != AppManifest; WindowGeometry != composition grid; span/discrete authoring; provider independence; Station has no Core/business authority.

## Consolidated findings

| Area | Disposition | Coverage | Carry-forward |
|---|---|---|---|
| C0 semantic/surface tokens | own | representative vocabulary/projection proven; breadth gaps retained | taxonomy must name semantic color/surface/state, typography, spacing, radius, elevation, motion, density and responsive/breakpoint domains; missing implementation remains defer/unproven-gap |
| C1 Button/Input/Select | own | source-owned primitives and safe defaults partly proven; accessible-name/keyboard gaps retained | inherit primitive proofs; do not create domain buttons |
| C2 IconButton/Toggle/ButtonGroup | own/adapt | Toggle state projection proven; IconButton label, prevented activation and group-relation deltas remain gaps | prove only compound delta over inherited primitives |
| C3 Tree | own | meaningful implementation exists; executable keyboard/focus conformance remains unproven-gap | treat Tree as existing candidate; prove traversal/focus/selection/expansion delta |
| C4 presentation commands | own | availability, duplicate identity, shortcut conflict, Core boundary and multi-control reuse proven | extend existing command authority; do not create competing registry |
| MenuSurface | adapt | surface exists; full Menu collection/focus/dismissal/restoration unproven | no mature Menu promotion without delta proof |
| Tooltip | adapt | implementation exists; trigger/timing/dismissal/focus relation unproven | implementation evidence is not capability PASS |
| structural slots | own/adopt-pattern | descriptors exist; semantic compatibility proof incomplete | keep structural slots distinct from style recipes/variants |
| Inspector | adapt | generic property projection exists; schema-derived fields unproven | derive fields from canonical contracts, not feature hardcode |
| projections | adapt | shared draft/selection evidence exists; full Inspector↔Layers↔Graph↔source round-trip unproven | one canonical artifact; projections cannot become authorities |
| responsive representation | adopt-pattern | semantic command reuse supported; representation invariance needs explicit proof | visible/overflow/accessible projections preserve command identity |

## Promotion / dedup rule

A candidate deserves promotion to a new reusable grammar piece only when it introduces at least one reusable semantic relation, interaction/state machine, compatibility rule, or proof obligation not representable as configuration/composition of existing pieces.

Domain naming, visual restyling, overflow relocation, icon/label changes, app-specific wrappers and alternate projections of the same command are insufficient. `ApproveDocumentButton`, `DeployButton`, `TicketApproveButton` and analogous domain primitives are rejected as the default strategy when `Button + CommandBinding + capability/target` expresses the behavior.

## Interaction Grammar candidate

Carry to R3 for validation/promotion:

`visual activation surface -> activation intent -> command binding -> target/context -> conditions/availability/authority boundary -> effect/result -> presentation consequence`

This is research, not product authority. Station must not acquire Core/business authority through it.

## Proof inheritance

C0 proves bounded vocabulary/projection. C1 proves primitive semantics/safe defaults. C2 inherits C1 and proves only added state/relation/label/group delta. C3 inherits lower interaction/selection semantics and proves ordering, traversal, active/focus/selection and expansion deltas. C4 inherits projections and proves command identity, binding, availability, authority boundary, failure/recovery and representation invariance. C5-C10 must continue the same inheritance discipline.

`unproven-gap` remains a gap when inherited; absence of evidence never becomes PASS.

## Grammar Sufficiency Test

Remain a synthesis gate, not an R1 PASS claim. Corpus: document approval; ticketing; CRUD/master-detail; operational dashboard; deployment configuration/control. For each case record reuse, configuration, genuinely missing contract, escape hatch, duplication pressure, inherited proofs, delta proofs and authority crossings. No aggregate magic score.

## Gate disposition

This reconciled artifact resolves the stale-base blocker for the consolidated R1 finding set. R1 may close only with a fresh-main handoff that revalidates paths/findings and makes R2 eligible for research only. Construction and specialized Studios remain blocked until R1→R7→synthesis and explicit Construction materialization.