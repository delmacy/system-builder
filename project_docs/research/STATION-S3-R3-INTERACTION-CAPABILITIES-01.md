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

Proven/inherited: presentation command unique identity; invocation-time presentation availability; shortcut conflict fail-closed; bounded multi-projection command identity; focus/selection context normalization; Core intent rejected by presentation registry; immutable composition base; validation before admitted mutation; invalid mutation fail-closed; dirty/discard; bounded preview=same draft; bounded window move/resize evidence.

Unproven gaps: generic drag/drop target negotiation; reparent/order; generic undo/redo; durable history/versioning; save/publish authority; target currentness beyond presentation context; conditions-vs-authority separation; authoritative stale-state rejection; accepted-vs-effective; partial effect; retry/idempotency; compensation; result evidence/currentness; contextual keyboard ownership; broad projection round-trip identity; schema-driven Inspector conformance.

## Smallest future proofs

Proof follows ownership. Registry proves identity/conflict/availability. Projection proves same command/target across surfaces. Composition owner proves target compatibility and mutation semantics. Durable boundary proves stale/unauthorized fail-closed and version/currentness. Async effects prove accepted vs final only where applicable. Accessibility/focus remains projection proof. Human acceptance remains separate from machine conformance.

## Grammar sufficiency implications

Approval, ticketing, CRUD, operational dashboard and deployment configuration must be expressible with the same small grammar without per-screen abstractions. CRUD/editor exemplars should reuse base/draft/validation/dirty where applicable. Approval/deployment must not treat draft discard as authoritative compensation. A domain-specific component created merely to make an exemplar fit is a sufficiency/dedup warning.

## Disposition

- **own**: Station semantic contracts, canonical artifact mutation/validation, presentation-command identity/context, composition draft transaction, proof inheritance.
- **adapt**: mature pointer/keyboard authoring mechanics, contextual focus and local history mechanisms where required.
- **adopt-pattern**: one semantic command across projections; one artifact across canvas/tree/Inspector/source; explicit nesting target; separate edit/history/publish authorities; invocation-time revalidation.
- **defer**: generic drag/drop/reorder engine, generic undo framework, durable version/publish schema, generic Core executor, compensation engine, AI/MCP generation, product-specific capability catalog.

## Current R3 gaps / next work

1. Inspect graph/placement contracts to determine whether parent/slot/order semantics already suffice for a future semantic reparent mutation without adding identity concepts.
2. Census concrete persistence/file/version boundaries before naming save/publish schemas.
3. Extend benchmark only against unresolved target/currentness and multi-projection questions.
4. Keep R4 blocked until R3 handoff bounds capability ownership and proof debt.
