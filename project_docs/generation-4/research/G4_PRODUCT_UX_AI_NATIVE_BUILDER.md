# G4 — Product UX, Living Canvas & AI-Native Builder R&D

Status: `RESEARCH_ACTIVE / NON_EXECUTABLE`
Execution authority: NONE

## Problem

The System Builder can be architecturally mature while remaining difficult to use if raw model complexity leaks directly into the interface.

`Architecture Readiness != Builder UX Readiness != Product Pilot Readiness`.

This document is product-interaction R&D, not a UI implementation specification. It does not select a graph renderer, component library, AI model or product module boundary.

## Research families

### Living Canvas
Research semantic zoom over the same canonical model:

```text
System -> Environment -> Host/Placement -> Deployment Unit
-> Module -> Capability -> Workflow/Process -> Activity/Rule/Data/Provider
```

Canvas is a projection, never source of truth.

### Lenses
Topology, workflow, authority, data, security, capacity, cost, complexity, evidence, deployment and lifecycle lenses over shared identity.

`Graph != Layer != Lane != Lens != Authority`.

### Progressive disclosure
Research semantic zoom, bounded traversal, lazy loading, context windows, saved views and role-aware projections. Never render the whole enterprise graph by default.

### Inspectors/explainability
Expose identity, owner, revision, currentness, evidence, dependencies, open findings, effective state and why a recommendation/change exists.

### Search/command interaction
Combine exact/structured/full-text/graph/vector retrieval under authorization/currentness. AI may create candidate query/action plans; plans must be inspectable and authorized before side effects.

### AI-native Builder
Candidate functions: elicitation copilot, navigation/query assistant, architecture/change assistant, complexity explanation, semantic linguist, impact-analysis explainer, test/proof assistant, remediation/change candidate generation and documentation/dossier projection.

`AI inference != authority`.

### Preview / Sandbox
Research Structural Preview and Interactive/Sandbox Preview before autonomous compilation/publication.

`Preview != compiled autonomous runtime != Product Proof != Production Readiness`.

Providers, credentials and side effects may use sandbox adapters. Research behavioral-equivalence proof for the subset declared previewable.

### Explore vs Design/Act
Separate inspection from mutation authority. Visibility of topology does not imply permission to change it.

### Productivity
Templates, patterns, reusable compositions, bulk operations, shortcuts, saved lenses, automation, query presets and evidence-aware suggestions.

### Product intelligence
Complexity observatory, findings, drift, currentness, attention queues, semantic search, impact analysis and decision support. Avoid opaque scalar health/quality scores.

## Deep evidence consolidation — multiscale navigation, AI interaction and preview safety

Evidence classes used in this consolidation:

- information-visualization research on overview, zoom/filter, details-on-demand, relation, history and extraction;
- large-graph multiscale visualization research using aggregation/metarepresentations and on-demand paging;
- production graph-renderer documentation describing graph-size/style/edge rendering costs and viewport-oriented performance techniques;
- evidence-based Human-AI Interaction guidelines validated through HCI research;
- mature server-side dry-run semantics that execute validation/defaulting/admission while suppressing persistence/side effects;
- WCAG 2.2 interaction requirements for keyboard focus, dragging alternatives and target sizing.

These sources qualify interaction principles and failure modes; they do not select Microsoft HAX, Kubernetes, Cytoscape, React Flow, WebGL or any other implementation as canonical.

### 1. Semantic zoom must change representation, not merely scale pixels

The classic information-seeking sequence — overview, zoom/filter, then details on demand — is useful but insufficient for the Builder because the canonical model may contain heterogeneous semantic levels and many relation types. Large-graph research additionally shows that interactive exploration at very large scale depends on aggregation/metarepresentation and multiscale/on-demand materialization rather than drawing every element continuously.

Candidate interaction model:

```text
ViewportContext
  semanticScope
  focusIdentity?
  semanticLevel
  activeLenses[]
  filters[]
  temporalPerspective?
  revision/currentness
  authorizationContext
  expansionBudget
  detailBudget
```

A zoom transition may replace representations rather than merely enlarge them:

```text
System aggregate
  -> bounded domain/module aggregates
  -> capabilities/processes
  -> activities/rules/data/providers
  -> evidence/revision/effect details on demand
```

Research invariants:

- `Geometric zoom != semantic zoom`.
- `Canvas node != canonical entity`; a node is a projection of identity under a view context.
- `Collapsed aggregate != hidden canonical deletion`.
- `Visible aggregate count != permission to enumerate hidden members`.
- `Viewport omission != absence from system`.
- `Same identity across lenses != same visual representation`.
- `Overview != render-all`.

This means the Canvas should be treated as a query/materialization surface over canonical state, not a giant mutable graph document.

### 2. Lens composition requires explicit semantics

A lens changes what relationships/properties are emphasized, suppressed or aggregated. Multiple lenses may be useful simultaneously, but naive composition can imply facts that do not exist.

Candidate `LensDefinition` research shape:

```text
LensDefinition
  purpose
  eligible semantic types/relations
  required data/currentness
  authorization requirements
  projection/aggregation rules
  visual encodings
  compatible lenses[]
  incompatible/ambiguous combinations[]
  disclosure policy
```

Examples:

```text
Workflow lens + Evidence lens
  -> show execution path with proof/currentness overlays

Topology lens + Capacity lens
  -> show placement/failure-domain structure with qualified capacity

Authority lens + AI recommendation
  -> recommendation remains candidate; authority is not inherited from proximity
```

Invariants:

- `Lens composition != semantic relation composition`.
- `Visual adjacency != dependency`.
- `Visual containment != ownership/authority`.
- `Color/icon emphasis != proof`.
- `Hidden by lens != unauthorized by definition`; authorization is evaluated independently.

### 3. Progressive disclosure is also a security boundary

Progressive disclosure is not only cognitive simplification. Search, autocomplete, counts, graph degree, AI answers, aggregate labels and timing can leak existence or properties of non-visible objects.

Candidate `DisclosureEnvelope`:

```text
DisclosureEnvelope
  subject/role/context
  permitted identity disclosure
  permitted attribute disclosure
  permitted relation disclosure
  aggregate/count policy
  search/autocomplete policy
  AI retrieval/explanation policy
  temporal/currentness policy
```

Proof obligations:

- unauthorized entities do not appear through search results, autocomplete, graph traversal, count deltas, hidden-edge stubs, AI retrieval or explanation;
- aggregates whose exact cardinality leaks protected membership use an authorized disclosure policy rather than blindly reporting canonical counts;
- saved views/bookmarks cannot later bypass changed authorization;
- client-side hiding is never treated as authorization enforcement.

`Not rendered != not disclosed`.

### 4. Explore, propose, simulate, authorize and act are distinct interaction modes

The Builder needs stronger boundaries than a conventional editor because the same surface may inspect production state, edit a SystemDefinition, simulate a future revision and eventually request real effects.

Candidate mode model:

```text
EXPLORE
  read/navigate/query/explain

DESIGN
  edit draft model / candidate definition

SIMULATE
  evaluate candidate against declared sandbox/dry-run boundary

PROPOSE
  package change intent + diff + evidence + impact

AUTHORIZE
  governed approval of a qualified change/effect scope

ACT
  execute through authoritative engine/provider boundary

VERIFY
  observe/reconcile effective outcome
```

Invariants:

- `Explore != Design != Simulate != Propose != Authorize != Act != Verify`.
- `Can inspect != can edit`.
- `Can edit draft != can publish`.
- `Can simulate != can execute`.
- `Can authorize != execution happened`.
- `Execution ACK != effective result`.
- switching from simulation to action requires an explicit qualified transition; UI continuity must not silently carry authority across modes.

A destructive or high-impact action should not be disguised as another canvas gesture. Dragging may express a candidate intent, but semantic validation/authorization decides whether that intent can become a change.

### 5. Preview has multiple fidelity classes

Mature dry-run systems demonstrate a useful principle: a request can traverse real validation/defaulting/admission semantics while suppressing persistence and side effects. They also demonstrate the limitation: generated values and side-effectful external behavior may differ from real execution.

G4 should therefore avoid one generic `Preview` claim.

Candidate fidelity classes:

```text
STRUCTURAL_PREVIEW
  structure/views/forms/relations from current definition

INTERACTION_PREVIEW
  navigation + local interaction semantics + test fixtures

VALIDATION_DRY_RUN
  authoritative validation/defaulting/policy path where supported,
  with persistence/effects suppressed

SANDBOX_EXECUTION
  isolated adapters/resources execute declared behavior

COMPILED_EQUIVALENCE_PROOF
  selected previewable behavior compared with compiled runtime
```

Each preview result should carry a `PreviewEnvelope`:

```text
PreviewEnvelope
  definition/revision
  fidelityClass
  previewableCapabilities
  substitutedAdapters[]
  unavailableEffects[]
  fixture/reference-data revision
  policy/auth context
  nondeterministic/generated fields
  known divergences[]
  evidence
  expiry/currentness
```

Invariants:

- `Preview passed != production will succeed`.
- `Dry-run accepted != external effect would succeed`.
- `Sandbox adapter behavior != provider behavior by assumption`.
- `Same UI != same execution semantics`.
- `Previewable subset != whole-system equivalence`.
- preview equivalence claims must name the compared behavior and revisions.

This strengthens the existing target `PreviewBehavior ≈ CompiledBehavior`: equivalence is a scoped proof claim, not a visual resemblance claim.

### 6. AI-native interaction requires an inspectable proposal boundary

Human-AI interaction research emphasizes setting capability expectations, making uncertainty/limitations visible, efficient correction/dismissal, explaining why the system behaved as it did, cautious adaptation, granular feedback and communicating consequences. For System Builder, these principles must be joined to canonical identity, evidence and authority.

Candidate `AIInteractionEnvelope`:

```text
AIInteractionEnvelope
  user intent
  interpreted scope
  retrieved identities/evidence refs
  authorization-filtered context
  assumptions
  unknowns/conflicts
  model/tool revision metadata
  proposed query/change/action plan
  expected consequences
  confidence/quality qualifiers where meaningful
  correction/dismissal path
  expiry/currentness
```

The UI should permit the user to inspect a proposal in the Canvas before any governed transition to action:

```text
natural-language intent
  -> candidate interpretation
  -> highlighted semantic scope
  -> evidence/unknowns/assumptions
  -> candidate diff or query plan
  -> simulation/impact analysis when applicable
  -> explicit authorization boundary
  -> deterministic execution
  -> effect verification
```

Invariants:

- `Fluent explanation != correctness`.
- `Explanation available != evidence sufficient`.
- `AI confidence != authority`.
- `AI remembered preference != durable policy`.
- `AI retrieved object != user authorized to see object`.
- `AI-generated change != approved change`.
- `User correction != canonical mutation unless routed through the appropriate governed model boundary`.

Explanations themselves can increase user trust even when the system is wrong; therefore explanation is not a substitute for provenance, uncertainty or verification.

### 7. Search and command should converge on inspectable plans, not opaque execution

A unified command/query surface can improve expert productivity, but natural-language commands create ambiguity around scope and side effects.

Research candidate:

```text
User request
  -> IntentCandidate
  -> QueryPlan | ChangePlan | ActionPlan
  -> visible resolved identities/scope
  -> authorization + currentness + ambiguity check
  -> preview/diff where relevant
  -> execute only through explicit authority boundary
```

A query may execute directly when it is read-only and authorized. A mutating command should normally produce an inspectable plan/change candidate rather than silently invoke a provider.

`Command understood != scope unambiguous`.

### 8. Accessibility is architectural for a canvas, not a polish task

A graph/canvas dominated by pointer gestures can make critical Builder functions inaccessible. WCAG 2.2 strengthens requirements around visible keyboard focus, alternatives to dragging and target sizing. The Builder also needs expert keyboard workflows for productivity.

Research requirements:

- every semantically necessary drag operation has a non-drag alternative;
- canvas objects and inspectors have deterministic keyboard focus/navigation semantics;
- focus remains understandable across semantic zoom/re-materialization;
- selection is not conveyed only by color;
- zoom/pan does not strand keyboard or assistive-technology users;
- graph relationships have an accessible textual/structured representation;
- command/search is complementary to, not a replacement for, accessible direct navigation.

`Canvas visual accessibility != full semantic accessibility`.

### 9. UX performance must be budgeted as interaction workloads

Production graph libraries document that graph size, rich styles, edges, compound nodes, pixel density and frequent updates all affect rendering cost; large-graph research uses aggregation and on-demand paging to preserve interactivity. Therefore G4 should not define a single `max nodes` number divorced from workload.

Candidate workload profiles:

```text
Cold open overview
Pan/zoom existing viewport
Semantic-level transition
Expand neighborhood
Switch/add lens
Search -> focus
Open inspector
Apply live observation delta
Preview candidate diff
Bulk selection/change proposal
AI answer -> highlight evidence scope
```

Measure at least:

- time to first useful overview;
- interaction latency during pan/zoom/select;
- semantic transition latency;
- inspector/search response latency;
- main-thread/renderer frame pressure;
- memory growth and recovery after traversal;
- payload/query size per viewport transition;
- cost of live updates while interacting;
- accessibility-path parity where applicable.

Research rule:

`Large canonical graph != large rendered graph`.

The first optimization should usually reduce materialized/rendered scope, visual complexity or update fan-out before selecting a lower-level renderer/runtime solely for headline node count.

## Adversarial interaction cases

1. **Unauthorized aggregate leak** — a user cannot see hidden systems, but a parent node displays an exact child count or AI says that three hidden objects exist.
2. **Stale saved lens** — a saved view created under old permissions is reopened after authority changes.
3. **Semantic zoom identity confusion** — an aggregate expands and a user mistakes a projection replacement for creation/deletion of canonical objects.
4. **Simulation/action mode confusion** — a user believes they are editing a sandbox while the surface has transitioned to a live action context.
5. **AI scope hallucination** — AI resolves an ambiguous natural-language name to the wrong production entity and proposes a valid but unintended change.
6. **Explanation overtrust** — a persuasive explanation hides missing/stale evidence.
7. **Preview overclaim** — a sandbox adapter succeeds although the real provider would reject credentials, quota or semantics.
8. **Live-update target drift** — the inspected entity changes revision while the user is reviewing/authorizing a candidate change.
9. **Canvas overload** — enabling several lenses causes edge explosion and destroys interactive latency.
10. **Keyboard focus loss** — semantic rematerialization removes the focused visual object without a deterministic accessible successor.

## Prototype / experiment backlog

These are research experiments, not implementation tasks:

1. Compare pixel zoom vs semantic aggregation on representative SystemDefinition graphs.
2. Measure navigation with 1k/10k/100k+ canonical objects while rendering bounded viewport subsets.
3. Test lens composition rules and detect ambiguous visual encodings.
4. Test hidden-object leakage through search, counts, graph traversal and AI answers.
5. Compare explicit mode separation against a unified editor for Explore/Design/Simulate/Act error rates.
6. Build a PreviewEnvelope prototype and test whether users correctly understand fidelity/known divergence.
7. Compare AI proposal presentation: prose-only vs evidence-linked semantic highlighting + candidate diff.
8. Test keyboard-only navigation, zoom, relation traversal and inspector access.
9. Measure live telemetry/currentness overlays without making the Canvas visually or computationally unstable.
10. Test revision drift during review: candidate based on R1 while canonical state becomes R2 before authorization.

## R&D method

```text
Hypothesis -> Prototype -> User/engineering experiment -> Measurement
-> KEEP / REFINE / REJECT
```

Prototype evidence does not become architecture authority automatically.

## Consolidated proof obligations

1. Large canonical models remain navigable without loading/rendering everything.
2. Semantic zoom preserves identity and makes aggregation/projection transitions understandable.
3. Lens composition cannot silently imply canonical relations/authority.
4. Hidden/nonvisible objects do not leak through search/count/autocomplete/graph traversal/AI.
5. Mutation paths expose mode, scope, authority, impact, evidence and revision/currentness.
6. Stale/PARTIAL/UNKNOWN remain visible and cannot be visually strengthened into certainty.
7. AI suggestions distinguish candidate from canonical fact and provide correction/dismissal paths.
8. AI retrieval/explanations obey the same disclosure/authorization boundaries as deterministic UI paths.
9. Canvas projections are rebuildable from canonical state and do not become a parallel source of truth.
10. Preview declares fidelity, substitutions, unavailable effects and known divergence.
11. Behavioral-equivalence claims are scoped to declared previewable behavior and revisions.
12. Explore/Design/Simulate/Propose/Authorize/Act/Verify transitions cannot occur silently.
13. Accessibility and keyboard/expert workflows survive semantic zoom and rematerialization.
14. UX performance is measured against interaction workloads, not only static node counts.
15. Saved views and AI/session context re-evaluate current authorization/currentness when reused.
16. Revision drift during review/authorization is detected and reconciled before effectful execution.

## Current maturity and remaining gaps

This family has completed its first deep evidence consolidation. Material boundaries now exist for semantic zoom, lens composition, progressive disclosure/security, AI proposal interaction, Preview fidelity, mode separation, accessibility and interaction performance. It remains `RESEARCH_ACTIVE`, not saturated.

Highest-value remaining gaps:

- user-role/task model: novice elicitation, domain expert, architect, operator, reviewer/auditor and support engineer may require different navigation/authority surfaces;
- empirical semantic-zoom/lens prototype evidence on realistic SB graphs;
- collaborative/multi-user editing, presence and conflicting candidate changes;
- undo/redo semantics across draft model edits vs already-authorized/effective changes;
- accessibility semantics for dense graph relationships and temporal/lifecycle views;
- information-density/currentness/evidence encoding without alarm fatigue;
- AI conversation memory boundaries vs durable repository/system memory;
- Preview equivalence test strategy across capability classes and provider substitutions.
