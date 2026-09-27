# Station S3-R1 — Exit Matrix 01

Date: 2026-09-27
Observed fresh main: `8a6ec550e954a81c9200f2f993ed347410b1383d`
Status: RESEARCH EVIDENCE — NOT PRODUCT AUTHORITY

## Purpose

Consolidate the bounded R1 census/parity findings into one exit-oriented view before R2. This document does not authorize Construction and does not promote research findings into product authority.

Preserve: identity != placement != presentation != action; ComponentRegistry != AppManifest; WindowGeometry != composition grid; span/discrete authoring; provider independence; Station has no Core/business authority.

## Currentness / integration gate

`main` is currently `8a6ec550...`; the active R1 branch is still rooted at merge-base `489caf8...` and is materially behind main. GitHub compare at this observation reports the branch diverged, ahead by 8 and behind by 30 before this document commit. Therefore integration/currentness remains `unproven-gap` until the research branch is reconciled against fresh main and the resulting paths/findings are revalidated.

`docs/current/NEXT_WORK.md` still embeds an older truth-base SHA (`8687854...`) but semantically keeps S3-R1 as the current phase and blocks Construction until R1→R7→synthesis. Treat the embedded SHA as repository-memory currentness debt, not as authority to skip gates.

## R1 consolidated findings

| Area | Current Station evidence | Candidate disposition | Proof status / gap | R2+ consequence |
|---|---|---|---|---|
| C0 semantic/surface tokens | bounded UI semantic + Station surface vocabularies exist | own | representative vocabulary/projection proven; breadth unproven-gap | carry typography/spacing/radius/elevation/motion/density/responsive ownership as bounded taxonomy question, not implementation mandate |
| C1 Button/Input/Select | source-owned primitives exist | own | projection/safe defaults partly proven; accessible-name/keyboard proof gaps remain | inherit primitive proofs; do not create domain buttons |
| C2 IconButton/Toggle/ButtonGroup | implementations exist and compose lower primitives | own/adapt | Toggle state projection proven; IconButton label and prevented-activation/group relation gaps remain | use proof inheritance and delta-only tests |
| C3 Tree | meaningful collection implementation already exists | own | implementation supports roles/levels/selection/expansion/roving tabIndex/key handling; executable keyboard/focus conformance remains unproven-gap | R2 must treat Tree as existing candidate, not rediscover it; derive collection delta proofs |
| C4 presentation commands | PresentationCommandRegistry + interaction tests already separate semantic command identity from visual controls and Core intents | own | availability, duplicate identity, shortcut conflict, Core boundary and multi-control command reuse proven | Interaction Grammar should extend existing authority rather than create another command registry |
| Menu | MenuSurface exists as surface only | adapt | full collection/focus/dismissal/restoration capability unproven-gap | do not promote MenuSurface to mature Menu without C3/C4 delta proof |
| Tooltip | role/CSS implementation exists | adapt | trigger modality/timing/dismissal/focus relation unproven-gap | retain as implementation evidence, not capability PASS |
| slots | descriptors + mature ecosystem convergence support named structural slots | own/adopt-pattern | structural compatibility proof still incomplete | keep structural slots separate from presentation recipes/variants |
| Inspector | generic property projection infrastructure exists; caller supplies definitions | adapt | contract/schema-driven field derivation unproven-gap | later research must derive Inspector from canonical contracts, not feature hardcode |
| projections | Component Lab shares draft/selection across layers/inspector/preview/validation | adapt | full Inspector↔Layers↔Graph↔source round-trip unproven-gap | one canonical artifact; projections must not become independent authorities |
| responsive representation | local command reuse + external convergence support alternate projections | adopt-pattern | invariance across visible/overflow/alternate accessible representation needs explicit proof | same semantic command must survive projection changes |

## Promotion / dedup rule emerging from R1

A candidate deserves promotion to a new reusable grammar piece only when it introduces at least one reusable semantic relation, interaction/state machine, compatibility rule, or proof obligation that cannot be represented as configuration/composition of existing pieces.

The following are insufficient by themselves:

- domain naming (`ApproveDocumentButton`);
- visual restyling;
- relocation into overflow;
- another label/icon;
- a new app-specific wrapper;
- another projection of the same semantic command.

This keeps primitives small and pushes combinatorics toward contracts, registries and capabilities.

## Interaction Grammar candidate carried forward

R1 local evidence and independent benchmark convergence support researching the following separation further in R3:

`visual activation surface -> activation intent -> command binding -> target/context -> conditions/availability/authority boundary -> effect/result -> presentation consequence`

This is a candidate research model, not yet product authority. Station must not acquire Core/business authority through it.

## Proof inheritance carried forward

- C0 proves bounded vocabulary/projection.
- C1 proves primitive semantics and safe defaults.
- C2 inherits C1 and proves only added state/relation/label/group delta.
- C3 inherits lower interaction/selection semantics and proves ordering, traversal, active/focus/selection and expansion deltas.
- C4 inherits projections and proves command identity, binding, availability, authority boundary, failure/recovery and representation invariance.
- C5-C10 must continue this pattern: each tier inherits lower proofs and proves only its new region/pattern/view/tool/application/studio contracts.

`unproven-gap` remains a gap when inherited; absence of evidence never becomes PASS.

## Grammar Sufficiency Test status

The five-class sufficiency corpus remains required for synthesis:

1. document approval;
2. ticketing;
3. CRUD/master-detail;
4. operational dashboard;
5. deployment configuration/control.

R1 establishes the measurement discipline but does not claim sufficiency. For each corpus member synthesis must record reuse, configuration, genuinely missing contract, escape hatch, duplication pressure, inherited proofs, delta proofs and authority crossings. No aggregate magic score is authorized.

## R1 closure blockers

Before R1 can be declared closed:

1. reconcile this research branch against fresh main and revalidate repository paths/currentness;
2. deduplicate earlier R1 documents against this exit matrix without erasing useful evidence/history;
3. explicitly decide whether C0 token breadth is a bounded defer or a required taxonomy output for synthesis;
4. retain Tree/IconButton/Toggle/Menu/Tooltip proof gaps honestly unless existing executable evidence is located;
5. ensure every promoted R1 finding has a proof obligation and own/adapt/adopt-pattern/defer disposition;
6. produce a final R1 handoff that makes R2 eligible without authorizing Construction.

## Gate disposition

S3-R1 remains `IN_PROGRESS`. R2 is not yet declared eligible by this document. Construction and specialized Studios remain blocked until R1→R7→synthesis and explicit Construction materialization.