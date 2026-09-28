# Station S3-R3 — Interaction Capabilities 01

Date: 2026-09-27
Base: fresh `main@c09b291ee13cc846fbdab717cee31377bf6cc085`
Status: RESEARCH — NOT PRODUCT AUTHORITY

## Dependency/currentness

R2 final handoff is integrated. R3 is eligible for research only. Construction, Studios and AI/MCP foundation remain blocked until R1-R7, synthesis and explicit Construction materialization.

The accepted S3 hierarchy and boundaries remain unchanged. In particular: identity != placement != presentation != action; ComponentRegistry != AppManifest; WindowGeometry != composition grid; discrete/span authoring remains distinct from window geometry; Station cannot acquire Core/business authority.

## Station current state

`packages/station-interaction` already supplies a bounded presentation interaction layer. `PresentationCommandRegistry` owns presentation command identity/availability/invocation; availability is re-evaluated at invocation; shortcuts project command identity; interaction context keeps focus/selection/surface explicit; `CoreCommandIntent` remains non-executable in presentation authority. Existing executable evidence is inherited, not retested wholesale.

## Candidate Interaction Grammar

Research candidate only; field names are not schema authority:

`intent -> command -> target -> conditions -> authority -> effects -> result -> presentation consequences`

Intent is a request, not permission/success. Command identity is semantic and projection-independent by default. Target identity is not placement/selection. Conditions are contextual applicability inputs and must be current where stale state matters. Authority decides whether an effect may occur. Accepted is not necessarily effective. Result must preserve failure/partial/currentness distinctions where applicable. Presentation consequences remain derived and non-authoritative.

## Existing capability ownership

### Composition draft / dirty / validation

`packages/station-composition/draft-transaction.ts` owns immutable base, draft, validation findings and dirty. Its mutation vocabulary is intentionally small: `replace-node` and `remove-node`. `replace-node` can append a previously absent node, but the transaction has no first-class insert-position, move-before/after, reparent, drop-target, or ordering command. Every candidate graph is validated before replacing draft; invalid mutation fails closed. Discard restores base; preview snapshots the same draft.

This means insertion is currently only graph membership plus whatever placement/parent references the node already carries; it is not evidence for manual drag/drop grammar. Generic reparent/reorder remains `unproven-gap`.

`editor-engine.ts` composes that same transaction with `selectedNodeRef`; selection is cleared if mutation/discard removes the selected node. It does not create another artifact authority.

Classification: **own / existing bounded editing transaction**. Dirty/findings/selection are state or consequences, not reasons to create component-specific capabilities.

### Window move/resize/snap

Window pointer sessions, preview geometry, capture, bounds, snap and final geometry commit remain specialized Windowing capability. They do not authorize composition-grid drag/drop. Pointer mechanics may later be adapted; WindowGeometry authority may not.

### Ordering/layering

Incidental window z-order is not reusable composition ordering. Generic ordering remains deferred until an artifact needs explicit move/reparent semantics and proof delta.

## Delta 03 — manual authoring and persistence boundary

### Station current -> question

The remaining R3 question is whether manual insertion/reparent/reorder/save/publish should be promoted now as generic C4 capabilities.

Repository census says **no promotion yet**. The draft transaction can add/replace/remove nodes and validate the resulting graph, but no first-class ordering/reparent/drop-target contract was located. Likewise the bounded draft transaction has no durable save/publish/version authority. Absence of a located contract is recorded as negative census, not proof of repository-wide nonexistence.

### Independent editor evidence

Webflow's Navigator exposes one hierarchy through canvas and tree views: users can select/reorder elements, nest by dragging onto a parent, and changes reflect immediately on canvas. Its Add panel permits click-to-add, canvas drag, or Navigator drag. This is evidence for **multiple projections over one artifact plus explicit target/nesting semantics**, not evidence that Station should copy Webflow's element model.

Webflow also separates working edits from durable recovery/publish semantics: backups/restore points are distinct from undo, and CMS draft/queued/published states are distinct. Framer independently separates editing from published immutable versions/staging/deploy; publishing creates a version, staging can point at a tested version, and deployment selects what becomes live.

Convergence: mature editors distinguish local authoring mutation, hierarchy/placement target resolution, history/recovery, and publish/deploy authority. They do not require a separate state authority for every projection.

Divergence: exact save/autosave/publish semantics differ substantially, so Station must not promote one provider's lifecycle vocabulary into generic authority.

### Candidate finding

Manual authoring should eventually resolve a deterministic mutation against a canonical artifact owner, with Layers/canvas/Inspector/source acting as projections. A drag gesture is only an input technique. The semantic mutation should express enough target relation to distinguish at least add/replace/remove and, if admitted later, move/reparent/order. Drop compatibility must be derived from composition contracts/validation rather than from visual hit-testing alone.

Classification: **own** canonical artifact mutation/validation; **adapt** mature pointer/keyboard interaction mechanics; **adopt-pattern** one hierarchy across canvas/tree plus explicit nesting target and separate publish/version authority; **defer** generic drag/drop engine, generic reorder engine, autosave/publish/version schema until synthesis selects authoritative artifact boundaries.

### Proof obligations from delta 03

Inherited: graph validation fail-closed, immutable base, valid draft mutation, dirty/discard, preview=same draft, structural slot compatibility.

New delta proofs if insertion/reparent/reorder is promoted later:
- semantic target resolution is deterministic and independent of pointer coordinates after resolution;
- incompatible parent/slot/drop target fails closed without corrupting draft;
- reparent preserves node identity unless explicit clone semantics are requested;
- ordering mutation preserves unrelated sibling identity/order;
- Layers/canvas/source projections observe the same committed draft mutation;
- keyboard and pointer authoring resolve equivalent semantic mutation where both are supported;
- undo, if promoted, reverses only admitted local mutations and is not conflated with discard/history/compensation.

New delta proofs if durable save/publish/version is promoted later:
- save/version owner is explicit and distinct from local draft projection;
- stale base/version conflict cannot silently overwrite newer authoritative state;
- saved != published/live unless the selected contract explicitly equates them;
- publish/deploy result carries sufficient identity/currentness to avoid stale success presentation;
- rollback/restore is proven only where declared and is not inferred from local undo/discard.

Coverage for all of these remains `unproven-gap` until executable evidence exists.

## Delta 04 — placement sufficiency and existing version/currentness contracts

### Station current -> question

Can future semantic reparent be represented without inventing a second identity model, and does the repository already own reusable persistence/currentness semantics that R3 should project rather than replace?

### Repository evidence

`CompositionNode` has stable `ref` and independent `componentRef`; `CompositionNodePlacement` contains `parentRef`, `slotRef`, `columnSpan`, and `rowSpan`. Graph validation resolves the parent by node ref, resolves both component descriptors through `ComponentRegistry`, and applies slot/span compatibility. Root placement, missing parent, unknown component, duplicate node ref and invalid placement are explicit findings.

Therefore a future **reparent can plausibly be expressed as a replacement of placement while preserving node `ref`**. This is a strong representation-sufficiency finding, not authorization to implement reparent now. The present model does **not** contain sibling order/rank/index. Array position exists physically in `nodes`, but R3 must not silently promote incidental serialization order into semantic ordering authority. Reparent and reorder must remain distinct until synthesis decides whether ordered collections need an explicit relation.

The wider repository also already owns durable artifact concepts that invalidate the earlier idea that version/currentness is wholly absent. ADR-0009 defines provider-neutral logical artifact identity, independent artifact/schema/envelope versions, immutable published identity tuples, provenance, compatibility and migration-as-new-version. `process-versioning` separately proves stable artifact identity vs immutable revision identity, predecessor lineage and published-overwrite conflict/idempotency. `artifact-supply/artifact-identity` already represents evidence completeness and `CURRENT | STALE | UNKNOWN` currentness and requires qualified/current evidence for adoption.

These contracts are **reuse census evidence**, not permission to bind Station composition directly to process-versioning or artifact-supply. Their semantic separation is valuable; the exact owning bounded context for a future Station-authored artifact remains a synthesis/R7 question.

### Independent workstation evidence

VS Code permits View Containers to be relocated by users while preserving the contributed view/container identity. JetBrains independently supports moving tool windows by drag or explicit `Move to`, keyboard resizing, saved layouts and restoring layouts. The interaction surface differs, but both converge on **stable semantic thing + mutable placement/layout projection**, and JetBrains additionally demonstrates pointer and command/keyboard routes to the same layout intent.

This supports `identity != placement` and input-technique independence. It does not justify importing IDE docking/window geometry into the composition graph.

### Candidate findings / classification

1. **own/adapt — placement-preserving reparent representation:** preserve `CompositionNode.ref`; change only admitted placement relation after deterministic target resolution and graph validation.
2. **defer — semantic sibling ordering:** do not treat `CompositionGraph.nodes[]` serialization order as product semantics. Promote explicit order only if C3/C4 use cases require it and define a proof delta.
3. **adopt-pattern/reuse-census — immutable revision/currentness semantics:** future save/version/publish design must first evaluate ADR-0009, process-versioning and artifact-supply contracts before inventing Station-local versions, stale flags or publication evidence.
4. **forbid-by-default — authority leakage:** Station may project revision/currentness/evidence but cannot become the canonical owner merely because Inspector or source/YAML edits a draft.

### Proof obligations from delta 04

Inherited: unique node ref, root/parent validation, component/slot compatibility, discrete spans, immutable draft base, invalid mutation fail-closed, identity/placement separation.

Delta proof for future reparent:
- same node `ref` before/after move;
- exactly one admitted parent/slot relation after commit;
- root cannot become a child accidentally and non-root cannot become parentless;
- cycles must be impossible or explicitly rejected before reparent can be considered proven (current graph validation has no located cycle finding, so this is `unproven-gap`);
- unrelated node identity/placement remains unchanged;
- pointer/tree/source routes, when supported, resolve the same semantic placement mutation.

Delta proof for future durable boundary:
- stable logical artifact identity is distinct from revision identity;
- a published immutable identity cannot be silently overwritten;
- stale/unknown currentness does not become successful adoption/publish presentation;
- provenance/evidence is traceability, not authorization;
- Station projection round-trips owner-provided identity/version/currentness without loss or reinterpretation;
- provider-local IDs/tags/paths never become canonical identity by accident.

### Dedup consequence

Do not create `ReparentedNode`, `MovedButton`, `PublishedView`, `StaleInspector`, or per-provider save capabilities. Reparent is a semantic mutation over existing node identity and placement. Currentness/version/evidence belong to reusable boundary contracts/owners and should be projected. A new C4 capability is justified only by a reusable transition/authority/result contract plus an independent proof delta.

## Delta 05 — effect/result/retry reuse census

### Station current -> question

Does R3 need to invent generic Station contracts for `accepted != effective`, partial effect, retry/idempotency, evidence and currentness, or does the wider repository already contain owner-specific grammars that establish the reusable semantic shape without transferring business authority into Station?

### Repository evidence

The answer is now materially clearer: the repository contains **multiple independent bounded-context implementations** of this semantic separation.

`packages/contracts/messaging/messaging-delivery-effect.ts` distinguishes delivery attempt outcome (`ACKNOWLEDGED | REJECTED | TIMEOUT | UNKNOWN`) from business-effect observation (`NOT_OBSERVED | OBSERVED | UNKNOWN`). It explicitly returns `false` for `providerAckProvesBusinessEffect()`. Retry is allowed only under qualified/current evidence that the provider rejected the attempt and authoritative effect evidence says the business effect was not observed; acknowledged-but-not-observed, timeout, unknown or incomplete/currentness uncertainty requires `RECONCILE_BEFORE_RETRY`.

`packages/contracts/deployment-runtime/deployment-actuation.ts` independently distinguishes provider acknowledgement from actuation outcome and effective generation. Outcome can be `APPLIED | NOT_APPLIED | PARTIAL | UNKNOWN`; `PARTIAL` and `UNKNOWN` require reconciliation before retry. Provider acknowledgement explicitly establishes neither actuation outcome nor effective generation. Qualified/current reconciliation evidence is required to establish convergence. A rollback actuation also explicitly does **not** establish release rollback eligibility.

`packages/contracts/workflow/external-effect-reconciliation.ts` independently encodes the same deeper rule: transport ACK is not business effect; effect confirmation requires known evidence tied to the same authority/currentness/revision; retry authorization additionally requires qualified idempotency scope, payload digest and a non-expired horizon. Unknown/partial/non-current evidence forces reconciliation before retry.

This is strong **independent internal convergence** across messaging, deployment and workflow. It answers an open R3 hypothesis without making any one bounded context a Station provider.

### Convergence / divergence

Convergence:
- request/transport acceptance is not proof of effective business outcome;
- partial/unknown result is a first-class state, never coerced to success;
- retry is a policy decision requiring owner-qualified evidence/idempotency/currentness, not a generic UI affordance;
- evidence identity, authority/revision and currentness are part of safe result interpretation;
- compensation/rollback is a separate owner-declared transition, not inferred from retry, undo or acknowledgement.

Divergence is equally important: messaging speaks in occurrence/effect evidence, deployment in desired/observed/effective generations, and workflow in producing revisions/effect identity. Therefore R3 should **not** flatten these into a universal Station `ActionResult` schema. The reusable grammar is semantic; the authoritative result payload remains owned by the capability/bounded context.

### Candidate finding / classification

**adopt-pattern + reuse-census:** keep the Interaction Grammar stages `authority -> effects -> result -> presentation consequences`, and require async/external capabilities to project owner-provided outcome/evidence/currentness/retry disposition without reinterpretation.

**own:** Station may own presentation consequences such as pending/failed/reconcile-required affordances and command availability, provided those are derived projections and never treated as effect truth.

**defer/forbid-by-default:** no generic Station executor, universal retry engine, universal compensation engine or `UniversalActionResult`. Do not create `RetryButtonCapability` or `PartialEffectPane`; the same semantic command can project an owner-provided retry/reconcile command where the authoritative contract permits it.

### Proof obligations from delta 05

Inherited from owner contracts where a future capability actually binds to them: accepted/ack != effect; partial/unknown remains distinct; qualified/current evidence requirements; idempotency/revision/identity checks; reconcile-before-retry behavior. These proofs remain owned by their bounded contexts and are not re-run as primitive Station tests.

Smallest Station projection delta when applicable:
- preserve owner result identity and status without collapsing `PARTIAL`, `UNKNOWN`, stale or reconcile-required into success;
- never infer effect completion from command invocation/acceptance/provider acknowledgement;
- expose retry only when owner-provided disposition authorizes it at current evidence/currentness;
- revalidate retry conditions at invocation, rather than trusting a stale rendered enabled state;
- preserve authority/revision/currentness references needed to explain why a result is current or requires reconciliation;
- compensation/rollback affordance appears only when an owner contract explicitly exposes that transition;
- human acceptance of wording/UX remains separate from machine proof of the underlying effect.

Coverage: the semantic rules above are `proven` only inside their existing messaging/deployment/workflow owners. Their future Station projection is `unproven-gap` until a concrete binding has executable conformance evidence. For synchronous Station-local presentation commands, async effect obligations may be `not-applicable` by declared contract rather than silently passed.

### Sufficiency consequence

This convergence is useful for the Grammar Sufficiency Test: approval/ticketing/deployment can share the same **interaction grammar** without sharing the same business result schema. The grammar is sufficient when the same stages and projection rules carry distinct owner contracts without requiring `ApproveDocumentButton`, `DeployRetryButton`, or screen-specific action abstractions. Domain result diversity is not evidence that a new visual primitive is required.

## Inspector/schema consequence

Framer Property Controls independently demonstrates contract-declared controls appearing contextually for a selected component. Station should adopt only the pattern: Inspector fields derive from selected artifact/component/capability contracts and declared schemas, not hardcoded feature screens. This reinforces the future requirement that Inspector, Layers, Graph and source/YAML mutate/project the same canonical artifact authority.

Proof obligation: changing a contract-declared property through one projection must be observable through the other projections without creating duplicated state authority; unsupported fields must not appear merely because another component type owns them. Current Station preview evidence is bounded and does not yet prove this broader round trip.

## Failure/recovery semantics

Preserve: stale target/condition; unavailable/rejected; accepted != effective; partial/indeterminate; retry only with explicit safety/idempotency or fresh attempt; compensation only when authoritative owner declares it; evidence/currentness sufficient to avoid presenting stale completion as truth. Synchronous Station-local commands may mark some obligations not-applicable per contract.

## C4 promotion/dedup rule

Promote C4 only for reusable semantic behavior above component/collection mechanics: stable action identity, target/condition semantics, reusable transition, execution boundary, or result/recovery contract with independent proof delta. Label/icon/color/domain noun/placement/responsive relocation/pending rendering do not promote. A state bit is not automatically a Capability.

`ApproveDocumentButton` remains rejected when `Button + binding -> approve command + document target + conditions/authority` expresses the case.

## Proof Grammar snapshot

Coverage vocabulary remains `proven | failed | unproven-gap | not-applicable`; absence of evidence never becomes PASS.

Proven/inherited: presentation command unique identity; invocation-time presentation availability; shortcut conflict fail-closed; bounded multi-projection command identity; focus/selection context normalization; Core intent rejected by presentation registry; immutable composition base; validation before admitted mutation; invalid mutation fail-closed; dirty/discard; bounded preview=same draft; bounded window move/resize evidence; stable composition node identity distinct from placement; parent/slot/span validation; provider-neutral artifact identity/version semantics exist elsewhere in repository; immutable process publication overwrite guard and artifact currentness qualification exist in their owning bounded contracts; messaging/deployment/workflow independently prove that acknowledgement/acceptance does not establish business effect and that partial/unknown/currentness/idempotency alter retry eligibility in their own bounded contexts.

Unproven gaps: generic drag/drop target negotiation; semantic reparent operation; graph cycle rejection for future reparent; explicit semantic sibling order; generic undo/redo; durable Station-authoring history/version owner; Station save/publish authority; target currentness beyond presentation context; conditions-vs-authority separation; authoritative stale-state rejection at the eventual composition persistence boundary; future Station projection of accepted-vs-effective/partial/retry/evidence semantics; compensation projection; contextual keyboard ownership; broad projection round-trip identity; schema-driven Inspector conformance.

## Smallest future proofs

Proof follows ownership. Registry proves identity/conflict/availability. Projection proves same command/target across surfaces. Composition owner proves target compatibility and mutation semantics. Durable boundary proves stale/unauthorized fail-closed and version/currentness. Async effects prove accepted vs final only where applicable. Accessibility/focus remains projection proof. Human acceptance remains separate from machine conformance.

## Grammar sufficiency implications

Approval, ticketing, CRUD, operational dashboard and deployment configuration must be expressible with the same small grammar without per-screen abstractions. CRUD/editor exemplars should reuse base/draft/validation/dirty where applicable. Approval/deployment must not treat draft discard as authoritative compensation. A domain-specific component created merely to make an exemplar fit is a sufficiency/dedup warning.

## Disposition

- **own**: Station semantic contracts, canonical artifact mutation/validation, presentation-command identity/context, composition draft transaction, proof inheritance.
- **adapt**: mature pointer/keyboard authoring mechanics, contextual focus and local history mechanisms where required.
- **adopt-pattern**: one semantic command across projections; one artifact across canvas/tree/Inspector/source; explicit nesting target; stable identity with mutable placement; separate edit/history/publish authorities; invocation-time revalidation; accepted/acknowledged != effective business result; reconcile-before-retry under uncertainty.
- **reuse-census before new contract**: ADR-0009 artifact identity/version/provenance, process-versioning immutable revision/lineage, artifact-supply currentness/evidence, and owner-specific messaging/deployment/workflow effect/retry contracts where semantically applicable and owned by the correct bounded context.
- **defer**: generic drag/drop/reorder engine, generic undo framework, Station-specific durable version/publish schema, generic Core executor, universal result/retry/compensation engine, AI/MCP generation, product-specific capability catalog.

## Current R3 gaps / next work

1. Cycle/reachability safety remains a blocker for claiming semantic reparent proven; current validation has no cycle finding.
2. Continue owner/consumer census for artifact identity/version/currentness, but do not invent Station-local duplicates; delta 05 now establishes independent owner convergence for effect/result/retry semantics.
3. Bound conditions-vs-authority and target-currentness semantics sufficiently to produce the R3 handoff and C4 proof matrix.
4. Extend benchmark only against unresolved target/currentness and multi-projection questions.
5. Keep R4 blocked until R3 handoff bounds capability ownership and proof debt.
