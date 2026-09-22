# G4 — Canvas Cross-Projection Editing & Semantic Transaction Research

Status: `RESEARCH_ACTIVE / NON_EXECUTABLE`
Execution authority: NONE

## Scope

This artifact extends `G4_MAIN_COMPOSITION_CANVAS_3D_SEMANTICS.md` with an implementation-independent hypothesis for editing the same semantic composition through 2D Composition, 3D Building/Onion, Capability Map, Relation Graph, Workflow Canvas, Corridor/Handoff Map, Topology Map and Floor View.

It does not select a renderer, collaboration engine, CRDT, event store, graph database, workflow engine or persistence technology. G3 remains semantically authoritative. Research does not authorize implementation.

## Research question

How can a user edit a Door, Counter, Corridor, Handoff, Gate, typed relation or Module face from one projection while other projections may be stale, open concurrently or edited by other actors, without:

- duplicating semantic identity by view;
- making a projection canonical truth;
- silently applying last-writer-wins to business semantics;
- requiring one giant global mutable graph transaction;
- converting UI layout conflicts into domain conflicts;
- hiding revision/currentness differences;
- losing author intent, authority, evidence or conformance lineage?

## Evidence base and portable lessons

### Optimistic concurrency / event-sourced decision boundaries

EventSourcingDB documents preconditions such as `isSubjectOnEventId` to reject a write when the relevant subject changed after it was read. Its documentation also describes query-scoped decision models in which a write can be rejected if a newly appended event would have changed the decision input.

Portable lesson: an edit should carry the semantic revision/dependency cut on which it was prepared. `UI still open != edit still admissible`.

This is a principle, not adoption of EventSourcingDB.

### Projection/read-model lag

EventSourcingDB explicitly distinguishes the durable event state from lagging read models and recommends making processing/projection lag visible to users rather than pretending that an acknowledged command is already reflected everywhere.

Portable lesson: `semantic commit acknowledged != every projection refreshed`. Cross-view currentness must remain explicit.

### Collaborative replicated editing / CRDT research

CRDTs prove that some concurrent operations can converge without central coordination, but conflict policy is part of semantics. Recent work on semantic conflict models for collaborative structures argues that automatic convergence can hide user-significant conflicts and proposes explicit semantic dependencies and reconciliation.

Portable lesson: `replica convergence != semantic intent preservation`. CRDT-like techniques may be appropriate for layout, selections, annotations or operations whose merge law is proven, but must not automatically resolve Gate authority, ownership, contract compatibility or destructive semantic edits.

### BPMN/token-flow semantics

BPMN gateway/token semantics demonstrate that visually similar graph edits can alter synchronization and execution meaning. Adding/removing an incoming path is not merely geometric when token synchronization changes.

Portable lesson: graph topology edits need semantic impact qualification. `move node` and `change incoming Corridor` are different classes even when both are drag operations.

## Core hypothesis: edit intent is not projection mutation

A projection edit should be modeled conceptually as an intent against semantic identities and a declared base cut:

```text
Projection gesture
  -> EditIntent
  -> semantic target resolution
  -> dependency/revision qualification
  -> validation + authority + invariant checks
  -> commit / conflict / defer / reject
  -> new semantic revision/evidence
  -> asynchronous projection refresh
```

Candidate shape:

```text
EditIntent
  intent identity
  actor/authority context
  source ProjectionRef
  semantic target refs[]
  operation kind
  semantic delta
  layout/presentation delta
  base revision vector
  dependency cut[]
  preconditions[]
  expected invariants[]
  rationale/provenance
  createdAt/currentness
```

Research invariants:

- `Projection edit != direct mutation of projection-private semantic copy`.
- `Gesture != semantic operation`.
- `Layout delta != semantic delta`.
- `Same semantic target across views -> same semantic identity`.
- `Commit accepted != every view refreshed`.
- `Converged pixels != converged business meaning`.

## Three edit classes

### 1. Presentation-only edit

Examples: camera, zoom, expanded inspector, node coordinates where position carries no semantics, temporary grouping, lens/filter selection.

These may be projection-local and may use weak/convergent collaboration where no semantic invariant depends on them.

`Presentation conflict != domain conflict`.

### 2. Semantic-local edit

Changes one bounded semantic owner/invariant boundary, for example changing a Counter's required field or renaming a Door label when the stable contract identity is unchanged.

It requires optimistic revision qualification over the material semantic dependency cut, but not a global transaction over unrelated modules.

### 3. Cross-boundary semantic edit

Examples: adding a typed relation between modules, changing a Handoff acceptance contract, moving a Gate across responsibility boundaries, changing a Corridor in a way that affects synchronization, or changing a Door contract consumed elsewhere.

The consistency scope follows the invariant and affected contract set. Cross-boundary does not automatically mean distributed atomic transaction; it means the edit cannot be accepted from one side while pretending the other side is unaffected.

## Semantic transaction boundary

Candidate rule:

`Atomicity scope = smallest proof-complete set of semantic facts whose partial application could violate the named invariant`.

This rejects both extremes:

- one field at a time when the invariant spans several facts;
- one global Canvas transaction when unrelated facts can evolve independently.

A semantic edit may therefore commit one indivisible decision producing several revisioned consequences, while projections update later.

Examples:

- changing only 3D coordinates: projection-local;
- changing a Door label: owner-local if identity/contract semantics are unchanged;
- changing Door contract + dependent Counter validation: atomic where partial change would make the entry surface incoherent;
- changing a relation consumed by another module: requires compatibility/authority qualification of both boundary contracts, but unrelated modules remain outside the transaction cut;
- changing a workflow Corridor that changes Gate reachability: requires control-flow/gate impact analysis, not merely edge persistence.

## Dependency cut rather than one global revision

A candidate edit should bind the facts that materially influenced it:

```text
EditDependencyCut
  target semantic revisions[]
  contract revisions[]
  authority/currentness refs[]
  relation revisions[]
  gate/handoff/corridor dependencies[]
  projection revision used for interpretation
```

A stale unrelated projection does not invalidate an edit. A changed dependency that could alter the decision does.

`any revision changed != conflict`

and

`target revision unchanged != edit safe` when a material dependency changed.

This permits selective optimistic concurrency without a synthetic `CanvasRevision` that serializes all work.

## Conflict taxonomy

Candidate dispositions, not committed enums:

- `NO_CONFLICT` — material dependency cut remains admissible.
- `PRESENTATION_CONFLICT` — projection/layout state diverged without semantic effect.
- `COMMUTATIVE_SEMANTIC_CONCURRENCY` — concurrent semantic edits are proven order-independent for the named invariant.
- `REBASE_REQUIRED` — intent remains meaningful but must be re-evaluated against a newer cut.
- `SEMANTIC_CONFLICT` — intents cannot both hold without explicit reconciliation.
- `AUTHORITY_CONFLICT` — actor/delegation/currentness changed.
- `COMPATIBILITY_CONFLICT` — contract relation no longer satisfies required guarantee vector.
- `UNKNOWN` — dependency/currentness evidence is insufficient.

Critical rule:

`automatic merge requires a declared merge law for that semantic operation/invariant`.

Last-writer-wins is not a universal merge law. Timestamp order cannot decide ownership, Gate satisfaction, authority or contract compatibility.

## Cross-projection preservation

Every projection should expose enough metadata to explain the state it renders:

```text
ProjectionSnapshot
  projection identity/kind
  semantic revision vector
  materializedAt
  source/currentness refs
  lens/disclosure context
  pending local intents[]
  acknowledged-not-yet-materialized intents[]
  conflicts/unresolved[]
```

Required behavior:

1. An edit committed from 3D appears later in 2D/Workflow/Topology under the same semantic identity.
2. Until refreshed, another projection remains explicitly stale; it does not silently reinterpret its old state as current.
3. A projection may optimistically render pending intent, but pending state must remain distinguishable from committed semantic state.
4. A rejected/rebased intent cannot leave a durable semantic ghost merely because one projection rendered it optimistically.
5. Hidden/unauthorized relations must not leak through conflict badges, counts, geometry or stale-diff summaries.

## Intent preservation and rebase

Rebase means re-evaluating intent, not mechanically replaying pixels.

Example:

```text
Intent I1: connect Counter C to Door D under Contract v3
Concurrent change: Door D now exposes Contract v4 with changed guarantees
```

Replaying the edge is unsafe even if D retains the same identity. The system must re-evaluate compatibility and may return `REBASE_REQUIRED`, `COMPATIBILITY_CONFLICT` or `UNKNOWN`.

By contrast:

```text
Intent I2: move Module M visually 40px right
Concurrent change: Counter C contract changes
```

If geometry is declared presentation-only, I2 can converge independently.

`same target identity != same rebase semantics`.

## Gates, handoffs and workflow edits

Workflow-related edits are especially sensitive because topology may alter admissible progression.

Research rules:

- adding a downstream stage does not prove an upstream Gate is satisfied;
- deleting a Gate from a design projection does not erase historical Gate evidence or observed bypasses;
- moving a Handoff across modules does not transfer semantic ownership by geometry;
- changing acceptance semantics requires a new qualified contract/revision rather than reinterpretation of historical handoffs;
- changing a Corridor may alter synchronization/reachability and therefore needs impact qualification against affected Gates/handoffs;
- designed-path edits do not rewrite observed traces; conformance is reassessed against an explicit design revision.

Thus:

`DesignRevision@d1 + ObservedTrace@o1 -> Assessment@a1`

may coexist with:

`DesignRevision@d2 + same ObservedTrace@o1 -> Assessment@a2`.

Historical assessment a1 remains evidence of what was concluded under d1; d2 does not rewrite history.

## Preview/simulation boundary

A candidate edit may be previewed/simulated before semantic commit.

```text
EditIntent
  -> CandidateRevision
  -> projection previews
  -> conformance/compatibility impact simulation
  -> human/authority validation where required
  -> commit or discard
```

Invariants:

- `Preview != committed semantic revision`.
- `Simulation pass != production effect proof`.
- preview data/evidence must be clearly sandbox-qualified.
- external side effects are replaced, blocked or explicitly sandboxed according to the Preview contract.
- a preview generated from stale dependencies remains visibly stale/unqualified.

## Failure and recovery

Must remain representable:

- edit based on stale semantic target;
- edit based on current target but stale dependency;
- concurrent compatible edit;
- concurrent incompatible edit;
- authority revoked between draft and commit;
- optimistic projection state awaiting semantic acknowledgement;
- semantic commit acknowledged while one or more projections lag;
- projection refresh fails after successful semantic commit;
- edit partially rendered but not semantically committed;
- rebase changes compatibility outcome;
- hidden dependency prevents safe automatic reconciliation;
- recovery after client crash with locally pending intent;
- duplicate submission of same edit intent.

Recovery principle:

`recover intent + lineage; do not infer commit from rendered pixels`.

If commit disposition is unknown, reconcile by intent/commit identity and authoritative evidence rather than blindly resubmitting a non-idempotent semantic mutation.

## Proof obligations

1. A projection edit names stable semantic targets; it never creates a second Module identity merely because another view initiated the edit.
2. Presentation-only and semantic deltas are distinguishable.
3. Every semantic edit carries the revision/dependency cut on which its decision was based.
4. Conflict detection considers material dependencies, not only the target object's revision.
5. Unrelated revision changes do not force global serialization.
6. Partial application cannot violate the named invariant; atomicity scope is invariant-qualified.
7. Last-writer-wins is never assumed for business semantics without an explicit semantic merge law.
8. Automatic merge is permitted only where commutativity/convergence is proven for the relevant operation and invariant.
9. Same identity across views remains stable through edit, conflict, rebase and commit.
10. Semantic commit and projection refresh remain distinct facts.
11. Optimistic UI state is distinguishable from committed semantic state.
12. Stale projections remain visibly stale and cannot silently overwrite newer semantic state.
13. Rebase re-evaluates semantic intent against the new dependency cut; it does not mechanically replay geometry.
14. Contract/authority/currentness changes can invalidate an otherwise syntactically valid edge edit.
15. Visual connectability never substitutes for contract compatibility.
16. Workflow topology edits are checked for affected Gate/Handoff/Corridor semantics.
17. Design revision changes never rewrite historical observed traces or prior conformance evidence.
18. Historical conformance assessments retain the design revision against which they were made.
19. Deleting a designed Gate/Handoff does not delete historical evidence or observed exceptions.
20. Capability participation changes do not transfer business ownership implicitly.
21. Adapter/provider face edits cannot silently redefine Core semantics.
22. Preview/candidate revisions are non-authoritative until committed.
23. Simulation evidence is not production-effect evidence.
24. Unknown commit disposition remains representable and is reconciled by stable intent/commit identity.
25. Duplicate edit submission cannot create duplicate semantic effects where the operation requires idempotency/deduplication.
26. Projection conflict metadata cannot leak unauthorized semantic objects or relations.
27. Accessibility/non-spatial surfaces can express the same edit/conflict semantics as 3D interactions.
28. No global Canvas revision is required unless a future invariant explicitly proves a global consistency boundary.
29. No collaboration algorithm becomes business authority merely because it guarantees replica convergence.
30. Recovery preserves intent/provenance/history rather than reconstructing truth from the currently rendered projection.

## Adversarial cases

1. 3D view edits Module M while 2D view silently saves stale M afterward (`last-view-wins`).
2. Two faces of M become two semantic identities after concurrent edits.
3. Dragging a visual edge creates a Door crossing without compatible contract.
4. Layout CRDT resolves concurrent semantic Gate deletion automatically.
5. Same timestamp/LWW rule chooses between two ownership-changing edits.
6. Door target revision is unchanged but consumed Contract revision changed; edit is falsely accepted.
7. One unrelated module changes and a global Canvas revision rejects every user's work.
8. A projection receives semantic ACK but displays stale state as if current.
9. Optimistic edge remains visible after semantic rejection and is mistaken for truth.
10. Rebase mechanically reconnects to a Door whose guarantee vector changed.
11. Deleting a Gate from design erases evidence that an observed occurrence bypassed it.
12. Changing Handoff acceptance semantics reinterprets historical handoffs.
13. Workflow edge edit changes synchronization but is treated as geometry-only.
14. Capability shaft drag is interpreted as transfer of module ownership.
15. Provider face edit mutates Core contract because the UI shares one mutable object.
16. Preview candidate is exported as canonical architecture before commit.
17. Simulation success is shown as production conformance evidence.
18. Hidden relation leaks through conflict count or ghost edge.
19. Client crashes after commit but before UI ACK and blindly repeats a destructive edit.
20. Client crashes before commit but restored pixels are treated as proof that the edit happened.
21. Authority is revoked after draft; stale draft still commits.
22. Two individually valid edits create an invalid combined Gate/Corridor state.
23. Auto-merge preserves graph connectivity but violates four-eyes/dual-control semantics.
24. A stale topology view overwrites a newer workflow contract because both render the same Module.
25. Cross-boundary edit commits only producer side while consumer compatibility evidence is missing.
26. Projection-local annotation accidentally enters canonical semantic revision.
27. Semantic conflict is hidden because replicas converged structurally.
28. A conflict resolver has UI permission but no authority to adjudicate business ownership.
29. Reorder by wall-clock timestamp fabricates causality between concurrent edits.
30. Accessibility editor and 3D editor produce different semantic operations for the same declared action.

## Portability / exit path

The hypothesis deliberately does not depend on one storage or collaboration technology. A future realization may use optimistic concurrency, append-only change journals, relational transactions, event streams, CRDTs for qualified subdomains, or another mechanism if it proves the required invariants.

Portable contract requirements are:

- stable semantic identity independent of view;
- explicit base/dependency revisions;
- invariant-scoped atomicity;
- explicit semantic conflict rather than hidden LWW;
- durable intent/provenance/evidence;
- separate projection currentness;
- deterministic or qualified reconciliation semantics;
- no requirement for a global Canvas lock/revision unless an invariant demands it.

## Maturity and open gaps

Maturity: `MATERIAL / NOT SATURATED / NON_EXECUTABLE`.

This round materially closes the first cross-projection editing gap by separating projection gestures, edit intent, semantic transaction cuts, optimistic dependency qualification, semantic conflict and asynchronous materialization.

Highest-value remaining gap: **multi-object semantic impact analysis and dependency-cut derivation**. Before a cross-boundary edit can safely claim a minimal transaction/conflict scope, the Builder needs an implementation-independent way to determine which contracts, Gates, Handoffs, relations, capability participations and conformance obligations are materially affected — without treating graph reachability as semantic dependency and without requiring a global dependency oracle.

## Source classes consulted

- Event-sourced optimistic concurrency and projection-lag documentation (primary product documentation; portable concurrency/currentness lessons only).
- BPMN/OMG gateway and token-flow semantics/issues (standard/specification evidence for topology/synchronization meaning).
- CRDT/local-first collaboration papers (academic evidence for convergence vs semantic conflict/intent preservation).
- Existing G4 Main Composition Canvas and Capability Exchange research artifacts (repository authority for deduplication and invariant preservation).
