# Station S3-R3 — C4 Exit / Proof Matrix 01

Date: 2026-09-27
Base revalidated: fresh `main@c09b291ee13cc846fbdab717cee31377bf6cc085`
Status: RESEARCH HANDOFF CANDIDATE — NOT PRODUCT AUTHORITY

## Purpose

Consolidate the R3 Interaction Capability findings into an explicit C4 promotion and Proof Grammar exit matrix. This document does not authorize Construction or R4 by itself. Research findings remain non-authoritative until the S3 synthesis/materialization gates defined by the controlling plan are satisfied.

Coverage vocabulary is strictly `proven | failed | unproven-gap | not-applicable`. Missing evidence is never PASS. Human acceptance validates expectation/wording and remains distinct from machine conformance.

## Candidate C4 grammar

`intent -> command -> target -> conditions -> authority -> effects -> result -> presentation consequences`

The stages are semantic boundaries, not a mandatory universal object schema. A concrete capability may mark a stage `not-applicable` only when its declared contract genuinely does not require that semantic (for example a synchronous presentation-local command has no asynchronous effect observation stage).

## Promotion rule: C3 Collection -> C4 Capability

Promote only when a reusable semantic behavior exists above collection/component mechanics and carries an independent proof delta, such as stable command/action identity, semantic target resolution, reusable transition, execution/authority boundary, or result/recovery semantics.

Do **not** promote for label, icon, color, domain noun, placement, responsive relocation, pending rendering, or a state bit alone. `ApproveDocumentButton` remains configuration/binding when `Button + command binding + document target + owner conditions/authority` expresses the case.

## Exit / Proof Matrix

| Concern | Current Station/repository evidence | Coverage | Inherited proof | Smallest future delta proof | Disposition |
| --- | --- | --- | --- | --- | --- |
| command identity | PresentationCommandRegistry owns unique semantic command identity | proven | duplicate identity fail-closed; shortcut/multiple projections resolve same command identity | concrete binding preserves identity across its admitted projections | own/reuse |
| presentation conditions | availability is recomputed immediately before invoke | proven | invocation-time local availability revalidation | binding cannot dispatch using stale rendered availability | own |
| focus / selection | Station interaction context keeps them explicit | proven (bounded) | normalization/separation in current registry tests | target binding must not silently equate focus/selection with authoritative target | own |
| Core intent boundary | CoreCommandIntent is non-executable by presentation registry | proven | Station presentation cannot acquire Core execution authority | concrete cross-boundary binding preserves owner authority | own/forbid-strengthening |
| target identity + expected revision | Station/Core command contract carries target and expectedRevisionRef | proven (bounded protocol) | target/revision survive the existing protocol path | future binding projects correct semantic target/currentness qualifier from its source | reuse/adapt |
| authoritative stale rejection | Station-Core E2E rejects stale expected revision and preserves canonical state | proven (bounded protocol) | rejection + reconcileRequired are not strengthened into success | each new owner binding proves its own currentness semantics; revision equality is not assumed universal | reuse/adopt-pattern |
| accepted/ack != effective | messaging, deployment and workflow owners independently distinguish acknowledgement/acceptance from effect | proven in owning contexts | owner-specific result/evidence/currentness semantics | Station projection preserves owner result without collapsing unknown/partial/stale to success | adopt-pattern/reuse owner contract |
| partial / unknown | existing owners preserve partial/unknown as non-successful/indeterminate states | proven in owning contexts | owner-specific status semantics | projection presents distinction and does not infer completion | adopt-pattern |
| retry | existing owners gate retry on evidence/currentness/idempotency/reconciliation | proven in owning contexts | retry disposition belongs to owner | affordance only when owner permits; revalidate at invocation | reuse owner contract |
| compensation / rollback | owner-specific and deliberately not inferred from acknowledgement, undo or discard | proven as separation in bounded contexts | no generic compensation from local editing history | expose only an explicitly owner-declared transition and result | defer generic engine |
| composition base/draft/validation | immutable base, validated draft, dirty/discard, invalid mutation fail-closed | proven | editing transaction invariants | capability-specific mutation proves only its semantic delta | own/reuse |
| semantic reparent | placement can change independently of stable node ref, but no first-class reparent operation | unproven-gap | identity + parent/slot/span validation | same node ref; deterministic new parent/slot; incompatible target fails closed | defer until proof |
| graph cycle/reachability | current validator checks parent existence/placement but no cycle finding | unproven-gap | none beyond local parent existence | self/descendant parent rejected; every non-root reachable; rejected mutation leaves draft unchanged | blocker for reparent promotion |
| sibling ordering | array position exists but no explicit semantic order contract was established | unproven-gap | none | define order authority first, then prove move preserves unrelated siblings | defer |
| pointer/keyboard authoring equivalence | windowing has bounded pointer mechanics; composition has no generic DnD/reparent proof | unproven-gap | pointer mechanics only, not composition semantics | both inputs resolve the same semantic mutation where both are supported | adapt later |
| undo vs discard vs history vs compensation | discard exists; owner benchmarks/contracts show these are distinct semantics | proven as separation; generic undo unproven | composition discard proof | any promoted undo proves admitted local inverse only; never implies durable rollback/compensation | defer generic undo |
| durable Station save/version/publish owner | repository has artifact/version/currentness contracts elsewhere, not Station authority | unproven-gap for Station authoring | provider-neutral identity/currentness semantics remain in owners | explicit owner; stale overwrite fail-closed; saved != published unless declared | reuse census before contract |
| Inspector schema-driven fields | benchmark convergence supports contextual contract-declared controls | unproven-gap in Station | none sufficient | fields derive from selected component/capability contracts; unsupported fields absent | R4/R5 research input |
| one artifact / multiple projections | bounded preview observes same draft; broader Layers/Inspector/Graph/source round trip absent | unproven-gap | preview=same draft | mutation in one projection observed by others without duplicated state authority | R4/R5 research input |
| accessibility / contextual keyboard ownership | lower-level component proofs exist only where already tested; generic C4 ownership not established | unproven-gap | reuse primitive/collection a11y proofs | capability proves only contextual focus/keyboard delta, not primitive behavior again | carry forward |
| human acceptance | deliberately separate from machine conformance | not-applicable as machine proof | none | validate expectation/UX wording without promoting machine coverage | preserve separation |

## Proof inheritance rule

C4 reuses C0-C3 proofs only when their preconditions remain unchanged. It must not retest primitive semantics merely because a Button appears in a capability. C4 proves the delta introduced by binding: semantic target, condition/currentness projection, authority boundary, result preservation, and contextual interaction consequences.

If a lower-level proof is absent or its preconditions are changed, C4 records `unproven-gap`; inheritance cannot manufacture PASS.

## Failure / recovery grammar

- stale or unavailable is not accepted;
- accepted/acknowledged is not necessarily effective;
- partial/unknown is not success;
- retry is offered only from owner-declared current evidence/idempotency/reconciliation semantics;
- compensation/rollback exists only when the authoritative owner declares it;
- presentation consequences may explain owner state but may not strengthen it;
- evidence/currentness must remain sufficient to distinguish a current result from a stale observation.

## Dedup consequences

Rejected by default: `ApproveDocumentButton`, `AuthorizedButton`, `CurrentTargetButton`, `StaleCommand`, `DeployRetryButton`, `PartialEffectPane`, generic `UniversalActionResult`, generic `UniversalRetryEngine`, and generic `UniversalCompensationEngine` when existing component + binding + owner contract expresses the semantics.

A new C4 piece is justified only by reusable semantic ownership and an independent proof delta, not because an exemplar has a new noun or screen.

## Grammar Sufficiency Test — R3 contribution

The same C4 stages must be able to carry at least these distinct classes without per-screen action abstractions:

- document approval: Button/projection -> approve command -> document target/currentness -> authoritative decision -> owner result;
- ticketing: command + ticket target -> owner conditions/transition -> result;
- CRUD/editor: local semantic mutation -> draft validation -> local result, with authority/effect stages marked not-applicable where genuinely local;
- operational dashboard: commands and projections remain distinct from observed state; presentation never becomes source authority;
- deployment configuration: command -> target/revision -> authority -> acknowledged/partial/effective result -> owner-gated retry/reconciliation.

R3 sufficiency status is **partial / gaps explicit**, not a score and not a PASS for S3. The grammar accommodates these result classes without requiring domain-specific visual primitives, but full S3 sufficiency still depends on R4-R7, projection round-trip, Inspector/schema, higher-level composition, and final synthesis exemplars.

## R3 handoff gate assessment

R3 has enough bounded evidence to promote the following **research findings into synthesis candidates**:

1. presentation availability is condition gating, never business authority;
2. semantic command identity is projection-independent by default;
3. target identity/currentness is explicit and may cross an authoritative boundary without becoming Station authority;
4. owner result semantics must survive projection without strengthening;
5. accepted/acknowledged != effective and partial/unknown/retry/compensation remain owner-qualified;
6. C4 promotion requires reusable semantic ownership + proof delta;
7. component/domain noun proliferation is a dedup failure signal.

R3 does **not** promote semantic reparent, sibling ordering, generic DnD, generic undo/history, Station save/publish/version authority, universal result/retry/compensation, schema-driven Inspector, or broad multi-projection round-trip. Those remain explicit gaps or later-phase research inputs.

## Gate before R4

Before declaring R3 complete, reconcile this matrix and the R3 research artifacts against fresh main and update the live current-work pointer. R4 may begin only after the R3 handoff is integrated/recorded according to document authority. Construction remains blocked through R4-R7, synthesis, Test Review/Hardening planning, QA Coverage/Evidence Review planning, and explicit Construction materialization.
