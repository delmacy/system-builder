# G4 — Main Composition Canvas 3D Semantic Model Research

Status: `RESEARCH_ACTIVE / NON_EXECUTABLE`
Execution authority: NONE

## Scope

This artifact consolidates an implementation-independent semantic hypothesis for the Main Composition Canvas 3D and its complementary projections. It does not select a renderer, 3D engine, workflow engine, graph database, BPMN runtime, component library, provider, or implementation architecture. G3 remains semantically authoritative; G4 does not reopen it.

The working metaphor is `building + floors + onion depth + modules + capability shafts + doors/counters + corridors + handoffs + gates + evidence`. The metaphor is useful only where every visual primitive has an explicit semantic interpretation. Geometry never creates meaning.

## Evidence base and portable lessons

### Ports & Adapters / Hexagonal Architecture

Cockburn's original Ports & Adapters formulation treats a port as a purposeful conversation at the application boundary and permits multiple technology-specific adapters for the same port. The visual hexagon is intentionally not literal geometry; its purpose is to expose inside/outside asymmetry and avoid accidental dependence on a one-dimensional layered drawing.

Portable lesson: a `Door` can represent a declared admissible boundary/port, while adapters/drivers remain replaceable realizations. Position, shape, radial angle or visual proximity cannot make two doors compatible.

### BPMN

BPMN distinguishes process sequence from communication between participants and gives gateways explicit flow-control semantics. Sequence/message-flow distinctions show why a corridor cannot be a generic arrow: different crossings imply different responsibility, ordering and communication semantics.

Portable lesson: designed progression, participant crossing, conditional admission and synchronization need typed semantics rather than one universal edge.

### Petri-net/process-mining conformance

Conformance checking compares modeled behavior with observed event behavior; multi-perspective research shows that control flow alone is insufficient because data, resources and time can materially change conformance diagnostics.

Portable lesson: `designed path != observed path`, and a conformance claim must name which perspectives were checked. Reaching a downstream state cannot prove that an upstream gate, authority check or evidence obligation was satisfied.

### Human task/workflow engines

Camunda user tasks distinguish candidate assignment, assignment/claim and completion. AWS Step Functions distinguishes request-response, synchronous job completion and callback completion, and callback tasks can timeout/heartbeat independently.

Portable lesson: request acceptance, responsibility claim, completion acknowledgement and effective business result are distinct lifecycle facts. A `Handoff` requires explicit acceptance semantics; a `Counter` must not collapse request receipt into effect completion.

### Architecture visualization

C4 uses multiple diagram types and zoom levels to tell different stories about the same architecture, rather than claiming one diagram is the architecture itself.

Portable lesson: 2D Composition, 3D Building/Onion, Capability Map, Relation Graph, Workflow Canvas, Corridor/Handoff Map, Topology Map and Floor View are projections over shared identities. None becomes canonical truth.

## Core hypothesis: one semantic composition, many projections

```text
Canonical semantic identity/revision/currentness/evidence
                    |
          projection/materialization
                    |
  +-----------------+-------------------+
  |        |        |        |          |
 2D       3D    Capability  Workflow  Topology ...
Composition       Map       Canvas
```

Research invariants:

- `Projection != canonical truth`.
- `Canvas object != canonical entity`.
- `Same identity + different projection != duplicate identity`.
- `Visual adjacency != semantic relation`.
- `Visual connectability != contract compatibility`.
- `Visual containment != business ownership`.
- `Geometric depth != authority hierarchy`.
- `Observed downstream state != proof of upstream passage`.

## Object identity model

### Module

`Module` is one semantic identity that may expose multiple faces of work.

Candidate structural shape:

```text
ModuleRef
  stable identity
  semantic owner/bounded-context ref
  revision/currentness refs
  faces[]
  capability participations[]
  ports[]
  relations[]
```

A face is a projection facet, not a new module:

```text
ModuleFace
  ModuleRef
  projection kind
  purpose/lens
  visible contracts/relations
  disclosure/currentness context
```

Therefore:

`ModuleFace != ModuleIdentity`

A workflow face, topology face, data face and provider face can all point to the same module identity. Cross-face edits or observations must preserve that identity and carry explicit revision/currentness rather than silently cloning state.

### Capability

A capability answers what must be possible; it is not automatically a module, owner, layer, provider or deployment unit. In the 3D metaphor it is best represented as a transversal `shaft` because one capability may participate across core behavior, contracts, provider bindings, adapters and exposed surfaces.

```text
CapabilityParticipation
  CapabilityRef
  ModuleRef
  participation role
  contract/evidence refs
  revision/currentness
```

Invariants:

- `Capability participation != semantic ownership`.
- `Capability shaft != shared implementation`.
- `Capability crosses floors/depths != capability owns crossed modules`.
- one module may participate in many capabilities; one capability may involve many modules.

## Candidate 3D coordinate semantics

Coordinates are projection dimensions, not canonical addresses.

### X — composition/context relation

Represents compositional neighborhood among modules/bounded contexts. X is not a call order or ownership rank. Distance may be used for layout readability only.

### Y — floor/sphere

Represents a declared architectural/business sphere or level selected by the projection. Floors must have named semantics; `higher` must not imply more authority unless a separate authority relation says so.

### Z/radial — semantic depth

Candidate depth progression:

```text
Core
 -> Contracts / Ports
 -> Providers / Bindings
 -> Adapters / Drivers
 -> Gateways / Views / External
```

This is a semantic-depth lens, not a mandatory implementation stack. A technology may collapse multiple depths physically while preserving their distinct contracts.

### Shafts

Capability shafts cut across Y/Z where participation exists. A shaft is an index/projection of participation, never a global owner or hidden shared service.

## Boundary/work primitives

### Door — admissible boundary / port

A Door is a named admissible crossing at a module/context boundary.

```text
Door
  identity
  owner ModuleRef
  direction: inbound | outbound | bidirectional-qualified
  accepted contract refs
  authority/disclosure constraints
  compatibility requirements
  currentness/revision
```

`Door visible != crossing permitted`.

A Door never means arbitrary graph connection. A crossing requires compatible contract, interaction kind, authority and currentness.

### Counter — request/service entry surface

A Counter is the work-entry surface attached to a Door/Port. It is semantic, not a specific form or UI widget.

Candidate `CounterContract`:

```text
CounterContract
  interactionKind: request | command | query | event | handoff | notification | stream | artifact-ref
  requiredData[]
  optionalData[]
  actor/authority requirements
  tenant/classification context
  preconditions[]
  validation rules
  acceptance semantics
  evidence requirements
  acknowledgement semantics
  completion/effect semantics
  timeout/expiry
  retry/idempotency/dedup/fencing requirements
  rejection semantics
  escalation/recovery semantics
  contract revision/currentness
```

Invariants:

- `Counter != form`.
- `Request received != accepted`.
- `Accepted != responsibility assumed`.
- `ACK != completion != business effect`.
- `Timeout != effect absent`.
- retry/redelivery preserves occurrence/effect lineage unless explicit re-admission semantics say otherwise.

### Corridor — allowed/expected progression

A Corridor is a typed designed progression relation between work stages/boundaries. It is not decorative geometry.

```text
Corridor
  identity
  source/target refs
  progression kind
  prerequisites[]
  expected handoffs/gates[]
  ordering/concurrency semantics
  alternate/bypass routes[]
  evidence obligations[]
  recovery/escalation paths[]
```

A corridor may express sequence, allowed transition, expected progression or communication depending on its declared kind. These must not be conflated.

### Handoff — explicit responsibility/control/context transfer

```text
Handoff
  identity
  from responsibility/authority context
  to responsibility/authority context
  transferred work/context refs
  offeredAt
  acceptance policy
  accepted/rejected/expired/withdrawn evidence
  currentness/revision
  timeout/escalation/recovery
```

Candidate lifecycle:

```text
PLANNED -> OFFERED -> ACCEPTED -> ACTIVE -> COMPLETED
                    \-> REJECTED
          \-> EXPIRED / WITHDRAWN / ESCALATED
```

These are research states, not committed enums.

Critical invariant:

`Handoff sent != handoff accepted != responsibility exercised != work completed`.

### Gate — prerequisite verification

A Gate verifies a declared predicate before ordinary progression. It does not create the predicate it checks.

```text
Gate
  identity
  protected transition/effect
  prerequisite predicates[]
  authority requirements
  evidence/currentness requirements
  decision disposition
  bypass policy
  verifier/proof refs
```

Candidate dispositions:

`SATISFIED | NOT_SATISFIED | UNKNOWN | CONTESTED | EXPIRED | BYPASSED_QUALIFIED`

`BYPASSED_QUALIFIED` is not equivalent to `SATISFIED`; it records a separately authorized exceptional path with its own evidence and consequence obligations.

### Evidence — proof of passage/effect

Evidence is qualified support for a claim, never the claim's canonical business owner.

Examples: request receipt, validation result, authority proof, handoff acceptance, gate evaluation, effect witness, completion evidence, exception/bypass authority, reconciliation result.

`Evidence present != evidence sufficient/current/admissible`.

## Typed relation vocabulary

Candidate module/capability relation families:

| Relation | Portable meaning |
|---|---|
| `PROVIDES` | source offers a declared capability/contract |
| `CONSUMES` | source consumes a declared offered contract/capability |
| `REQUIRES` | source has a prerequisite/dependency claim |
| `ENABLES` | source makes a target operation/capability possible without owning it |
| `TRIGGERS` | occurrence at source may initiate a declared target interaction |
| `CONSTRAINS` | source imposes a qualified constraint on target behavior |
| `OBSERVES` | source receives/derives observation without ownership transfer |
| `PERSISTS` | source persists a declared representation/artifact for an owner/context |
| `EXPOSES` | source publishes a declared surface outward |
| `HANDOFF_TO` | source can transfer declared responsibility/context to target |
| `VERIFIES` | source verifies a named predicate/evidence claim |

Every relation needs direction, semantic subject, scope, contract/revision/currentness and provenance where material. Relation names alone do not prove compatibility.

`PROVIDES(A,X) + CONSUMES(B,X-name) != compatible(A,B)` unless the relevant contract/guarantee vector is qualified.

## Designed vs observed semantics

The Canvas must preserve at least three distinct domains:

```text
DESIGNED
  what paths/contracts/gates/handoffs are prescribed or allowed

OBSERVED
  what events/effects/evidence were actually observed

ASSESSED
  conformance disposition derived from designed + observed + evidence/currentness
```

Never mutate DESIGNED history to make OBSERVED behavior appear conformant.

Candidate stage observation dispositions:

`OBSERVED_PASS | OBSERVED_BYPASS | OBSERVED_SKIP | OBSERVED_UNKNOWN | OBSERVED_CONFLICT | NOT_OBSERVED`

These do not automatically imply gate satisfaction.

### Conformance principles

- `Designed path != observed path`.
- `Skipped stage != satisfied stage`.
- `Bypass != ordinary pass`.
- `Downstream state observed != upstream prerequisite satisfied`.
- `ACK observed != effect observed`.
- `Missing evidence != evidence of failure`, unless a closed-world contract makes absence decisive.
- `Missing currentness != current`.
- conformance is multi-perspective: control/progression, data, authority/responsibility, time/currentness and evidence may disagree.
- a deviation may be permitted, prohibited, unresolved or explicitly exceptional; deviation is not synonymous with failure.

Candidate `ConformanceAssessment`:

```text
ConformanceAssessment
  designedPathRef
  observedTrace/evidence refs
  perspectivesChecked[]
  revision/currentness vector
  deviations[]
  unresolved[]
  bypass evidence[]
  disposition
```

## Gates/handoffs as workflow-conformance substrate

Handoffs and gates can provide a portable conformance substrate if they remain semantic claims rather than UI mechanics.

Example:

```text
Counter(request)
 -> Gate(validate prerequisites)
 -> Handoff(team A -> team B)
 -> Gate(acceptance + authority)
 -> Work
 -> Evidence(effect)
```

If Work is observed without acceptance evidence, the model records downstream work plus an unresolved/skipped handoff obligation. It must not backfill acceptance from the fact that work occurred.

This supports prevention and diagnosis:

- **preventive gate**: refuses ordinary progression when proof is insufficient;
- **detective conformance**: records that observed behavior diverged from design;
- **exception route**: permits explicit bypass with authority/evidence;
- **recovery route**: reconciles missing/late evidence or escalates unresolved work.

No universal workflow engine is implied.

## Cross-projection invariants

All projections must preserve semantic referents:

```text
ProjectionElementRef
  canonical identity ref
  semantic type
  canonical/model revision ref
  projection revision
  currentness vector
  lens/view context
  disclosure/authority context
```

Required invariants:

1. Same semantic object retains the same identity across 2D, 3D, capability, relation, workflow, corridor, topology and floor projections.
2. A projection may omit detail but must not silently alter meaning.
3. Projection-specific layout coordinates are never canonical semantic identity.
4. A stale projection remains visibly stale; switching views does not refresh by implication.
5. A relation hidden in one view still exists canonically if authorized/current; omission is not deletion.
6. An unauthorized relation must not leak through edge stubs, counts, adjacency, labels, search or 3D geometry.
7. Editing a projection creates a candidate semantic change against the underlying model; it does not directly mutate another projection's private copy.
8. Revision conflicts remain representable rather than last-view-wins.
9. Same semantic state cannot acquire a different business meaning merely because another projection renders it differently.
10. Projection optimization/aggregation never becomes business authority.

## Failure/recovery model

Failure states that must remain representable include:

- request rejected before admission;
- accepted request with unknown completion;
- handoff offered but unaccepted;
- accepted handoff with stale/revoked authority;
- gate evidence missing, expired or contested;
- corridor stage skipped;
- authorized exceptional bypass;
- timeout with effect disposition unknown;
- duplicate/retried request;
- downstream effect observed without sufficient upstream passage evidence;
- projection stale against canonical revision;
- conflicting observations across projections/sources;
- provider/adapter unavailable while semantic contract remains valid;
- recovery/reconciliation pending.

Recovery must append evidence/disposition rather than rewrite the historical trace into an idealized path.

## Proof obligations

1. Module faces preserve one `ModuleRef`; no view invents a second semantic identity.
2. Capability participation never implies capability ownership of participating modules.
3. X/Y/Z/radial geometry has declared projection semantics and cannot manufacture relations/authority.
4. Every Door crossing names an admissible contract and direction.
5. Visual connection cannot bypass contract compatibility/currentness/authority checks.
6. Counter interaction kind and ACK/completion/effect semantics are explicit.
7. Required/optional data and validation/preconditions remain distinguishable.
8. Handoff acceptance is independently evidenced from offer/delivery.
9. Responsibility transfer cannot be inferred solely from downstream activity.
10. Gate satisfaction requires the declared evidence/currentness; downstream state cannot backfill it.
11. Qualified bypass remains distinguishable from ordinary satisfaction.
12. Corridor progression semantics are typed; sequence, message, dependency and observation edges are not synonyms.
13. Designed and observed traces remain independently reconstructable.
14. Conformance assessment records the perspectives and revisions it evaluated.
15. Missing evidence/unknown state remains representable without guessing.
16. Provider ACK never substitutes for effective-state evidence unless the contract explicitly makes it authoritative for that claim.
17. Retry/timeout/escalation preserve occurrence/effect/handoff lineage.
18. Relations are directional, scoped, revisioned/currentness-qualified where material.
19. Same relation label across contexts does not imply contract equivalence.
20. Adapter/provider/driver/gateway faces cannot redefine Core semantics silently.
21. Projection state carries canonical/model revision and projection currentness.
22. Switching projections preserves identity and does not imply refresh or authority elevation.
23. Projection aggregation/omission cannot leak unauthorized membership/relations.
24. Projection edits reconcile against canonical revision; last-view-wins is not an admissible semantic rule.
25. 3D representation remains optional; equivalent semantic inspection is possible through non-spatial projections/accessibility surfaces.
26. Workflow conformance can detect skipped/bypassed/unproven stages without claiming that every workflow must be centrally orchestrated.
27. Evidence of passage names what it proves; one evidence item cannot silently prove unrelated prerequisites.
28. Recovery appends reconciliation/evidence and does not erase historical deviations.
29. A Counter is transport/UI independent; form, HTTP endpoint, queue, local call or human desk can realize the same declared entry semantics only when contract-equivalent.
30. `Map/Projection != canonical truth` remains true for every future visualization mode.

## Mandatory adversarial cases

1. A module appears on three floors and is accidentally assigned three IDs.
2. Capability shaft becomes a global owner/shared service because it crosses many modules.
3. Dragging two visible Doors together creates a relation without contract compatibility.
4. Counter is modeled as a React form and cannot represent API/event/human entry.
5. Corridor arrow exists with no progression semantics or evidence obligations.
6. Handoff message is delivered and treated as accepted responsibility.
7. HTTP/broker ACK is rendered as business completion.
8. Gate is skipped and downstream success retroactively marks it satisfied.
9. Emergency bypass uses the same visual/state marker as ordinary gate pass.
10. Provider-specific adapter moves inward and redefines Core meaning.
11. 3D layout is persisted as semantic ownership/topology truth.
12. 2D view is fresh while 3D view is stale and switching silently overwrites newer state.
13. Hidden unauthorized module leaks through corridor stub/shaft count.
14. `PROVIDES X` is auto-connected to `CONSUMES X` despite incompatible guarantees/version/currentness.
15. Workflow conformance checks control-flow only and misses wrong actor/authority/data/currentness.
16. Timeout is treated as non-effect and request is duplicated.
17. Observed downstream artifact is used as proof that required four-eyes approval occurred.
18. A face-specific rename changes semantic meaning only in one projection.
19. Floor height is interpreted as authority priority.
20. Capability participation is mistaken for persistence/business-data ownership.

## Portability / exit path

The semantic model must survive replacement of:

- 3D renderer with 2D or text/table views;
- graph/layout engine;
- workflow engine;
- transport (in-process, IPC, HTTP/gRPC, broker, stream, file exchange);
- provider/adapter/driver;
- process-mining/conformance engine;
- evidence store/index.

Export/import therefore depends on stable semantic identities, typed relations, contracts, revisions/currentness and evidence lineage, not screen coordinates, renderer node IDs or engine-specific task IDs.

## Maturity assessment

`MATERIAL_DELTA / RESEARCH_ACTIVE / NON_EXECUTABLE`.

The metaphor is now sufficiently constrained to support further semantic research without treating geometry as architecture. It is not mature enough for implementation authority: floor taxonomy, editing semantics, conformance cost model and large-system navigation still need qualification.

## Next highest-value gap

**Cross-projection editing and semantic transaction boundaries.** Research how a user can manipulate a Door, Counter, Corridor, Handoff or relation in one projection while another projection/revision is concurrently visible or edited, without making the Canvas a canonical mutable graph, losing revision/currentness, or requiring a giant global transaction. Candidate questions: intent/diff representation, optimistic concurrency, partial multi-object change sets, preview/simulation, conflict explanation, authorization boundaries and atomicity per protected invariant.