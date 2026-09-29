# Station S3 — R7 Core Contract Reuse & Station Projection Census 01

Date: 2026-09-28
Status: RESEARCH EVIDENCE — NON-AUTHORITATIVE
Base: `main@1dbb6d4076ad89a0b0d9b2d704c6b2fdc39185dd`

## Rule

Classify repository evidence before proposing any new Station/Core contract. `genuine-gap` is not authority to create a Core contract. Station remains projection-oriented; QA does not create product authority. Preserve identity != placement != presentation != action, `ComponentRegistry != AppManifest`, `WindowGeometry != composition grid`, and owner authority.

## Census

| Question | Evidence | Class | Coverage |
|---|---|---|---|
| target + revision/currentness | R3 records target + `expectedRevisionRef`; Station/Core E2E rejects stale revision without canonical mutation | reuse | proven, bounded protocol |
| command/capability semantics | C4 separates intent, command, target, conditions, authority, effects, result and presentation consequences | reuse | inherited only under same preconditions |
| authority revalidation | owner revalidates policy/business/currentness at execution boundary | reuse | bounded path proven; future bindings need delta proof |
| accepted/effective, partial/unknown/stale | owner contexts preserve non-strengthening distinctions | reuse | owner proof exists; C9/C10 projection delta unproven |
| retry | owner gates by evidence/currentness/idempotency/reconciliation | project/adapt | Application/Studio projection unproven |
| compensation/rollback | owner-specific; not inferred from undo, discard or pane closure | reuse/defer generic engine | generic Station engine not justified |
| artifact/provenance | artifact-envelope/evidence-provenance are provider-neutral and provenance is not execution authority | reuse/project | Station round-trip/currentness unproven |
| provenance navigation | bounded source↔artifact/evidence navigation exists without graph/provider/storage authority | project/adapt | Station integration unproven |
| Gateway/Core | StationApplication→StationGateway→Core port has protocol E2E and stale rejection | reuse | bounded E2E proven |
| AppManifest/runtime | stable app identity, duplicate/reference rejection, authority-shaped-field rejection, provider-neutral launch | reuse | narrow C9-adjacent proofs |
| Tool semantic compatibility | no adequate C8-role compatibility runtime proof found | genuine-gap | unproven-gap |
| artifact/context entry routing | appRef launch is not artifact/context routing proof | genuine-gap | unproven-gap |
| lifecycle/save/readback/version | no adequate reopen/currentness proof found | genuine-gap | unproven-gap |
| contribution isolation | field shape does not prove registry/owner bypass impossible | genuine-gap | unproven-gap |
| Inspector/Layers/Graph/source sync | one-authority direction exists; round-trip/synchronization gaps remain | carried gap | unproven-gap |
| shared C10 work-context | no reusable invariant beyond C9 configuration proven | defer promotion | unproven-gap |

## Proof inheritance and smallest deltas

Reuse lower proofs only when identity, target/currentness, authority owner and result semantics are unchanged. Future C9/C10 proof deltas must show: fail-closed compatible contributions; deterministic artifact/context routing; restoration revalidates canonical context; contribution isolation; `AppManifest` cannot mutate `ComponentRegistry`; one authoritative result/revision drives affected projections; Tool-local focus/selection cannot overwrite shared canonical context; stale/partial/unknown/reconcile-required remain visible.

## Dedup and sufficiency

No evidence promotes domain-named Applications or Studios. Document approval, ticketing, CRUD, operational dashboard and deployment configuration must first attempt the same C0→C9 grammar. Status remains `candidate sufficiency / unproven-gap`. C10 is required only if multiple materially different cases expose the same shared-work-context/cross-Tool invariant that C9 + configuration cannot express.

## Remaining R7 exit work

Materialize C9/C10 Journey + Exit/Proof Matrix; exercise the five sufficiency cases; revalidate exact-head gates; complete R7 handoff without Studio Construction. After integrated R7, execute R7B; synthesis then materializes Decision Graph and Construction proof planning with intermediate Test Review/Hardening and final QA Coverage/Evidence Review.
