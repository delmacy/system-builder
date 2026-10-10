# G4 — Canvas Semantic Impact & Dependency-Cut Research

Status: `RESEARCH_ACTIVE / NON_EXECUTABLE`
Execution authority: NONE

## Scope

This artifact deepens `G4_MAIN_COMPOSITION_CANVAS_3D_SEMANTICS.md` and `G4_CANVAS_CROSS_PROJECTION_EDITING_SEMANTICS.md` at the next unresolved boundary: how to derive the *material* impact set and `EditDependencyCut` for a multi-object Canvas edit without treating ordinary graph reachability as semantic dependency and without requiring a global dependency oracle.

It is implementation-independent. It does not select a graph database, workflow engine, incremental build engine, solver, renderer, event store, CRDT, BPMN runtime or provider. G3 remains semantically authoritative; G4 does not reopen it. Research does not authorize implementation.

## Research question

Given an edit intent against one or more stable semantic identities — Module, Door, Counter, Corridor, Handoff, Gate, typed relation or CapabilityParticipation — which other facts must be requalified because they can materially change the admissibility, meaning or proof of that edit?

The problem is deliberately narrower than generic graph reachability:

`reachable from changed node != materially dependent on changed meaning`.

Likewise:

`not currently reachable in one projection != proven non-dependent`.

The required output is a proof-qualified *impact cut*, not a visual neighborhood.

## Evidence base and portable lessons

### Incremental computation/build systems — dependency precision

Bazel Skyframe records dependencies from computations to the values they consume and invalidates the reverse transitive closure of changed inputs. It also uses change pruning: an invalidated node whose recomputed value is unchanged need not force all downstream recomputation. The portable lesson is that selective impact requires explicit dependency provenance and that `input changed` does not necessarily imply `derived semantic value changed`.

Research on incremental build systems with dynamic dependencies (Pluto/PIE) further shows that dependency sets may be discovered while work is evaluated and may themselves evolve. Correct incrementality depends on tracking actual requirements rather than only a static approximate graph.

Portable Canvas lesson: dependencies may be declared, derived or discovered during qualification, but discovered dependency is evidence about a specific derivation, not permission to turn the entire Canvas graph into one dependency closure.

### Missing and redundant dependency failure modes

Incremental-build research identifies both missing dependencies and redundant dependencies as correctness/efficiency problems. The analogy is useful but bounded: a missing semantic dependency can make an edit appear safe when it is not; an overly broad dependency set can serialize unrelated work and create false conflicts.

Portable lesson:

`under-approximation -> unsound impact`

`unqualified over-approximation -> unnecessary coupling/conflict`

The goal is proof-complete minimality for the named invariant, not graph minimality for its own sake.

### Workflow/Petri-net change regions

Research on dynamic migration of Petri-net workflow models distinguishes structural change regions and shows that conservative structural regions can overestimate the instances that are actually unsafe to migrate. This is directly relevant to Corridor/Gate/Handoff edits: topology is useful evidence, but structural proximity alone can overstate semantic impact.

Portable lesson: a workflow edit needs an invariant-aware change region. Structural reachability can seed analysis but does not by itself establish semantic dependency.

### Program analysis — control/data-flow separation

Mature program-analysis tooling distinguishes control-flow and data-flow questions rather than reducing both to generic connectivity. The analogy is again bounded: Canvas relations such as `TRIGGERS`, `REQUIRES`, `CONSTRAINS`, `OBSERVES`, `PERSISTS`, `PROVIDES` and `CONSUMES` have different impact propagation laws.

Portable lesson: relation kind participates in propagation semantics. `edge exists` is insufficient.

## Core hypothesis: impact is invariant-relative proof propagation

Candidate pipeline:

```text
EditIntent
  -> ChangedSemanticClaims
  -> protected invariants / requested guarantees
  -> typed dependency seeds
  -> relation-specific propagation
  -> boundary/owner/contract qualification
  -> derived/discovered dependencies
  -> pruning by proven non-impact
  -> ImpactCut + NonImpactEvidence + UnknownFrontier
  -> validation / preview / commit decision
```

The impact cut answers:

> Which semantic facts could change the truth/admissibility of the named edit decision for the named invariant?

It does **not** answer:

> Which objects are visually connected?

or:

> Which nodes are transitively reachable in the largest graph?

Candidate structural vocabulary:

```text
SemanticImpactCut
  editIntentRef
  changedClaimRefs[]
  protectedInvariantRefs[]
  materialDependencyRefs[]
  dependencyKinds[]
  relationPathEvidence[]
  owner/contract/revision/currentness refs[]
  discoveredDependencyRefs[]
  nonImpactEvidenceRefs[]
  unknownFrontierRefs[]
  derivationProfileRef
  assessedAt
```

This is a research shape, not a committed schema.

## Dependency kinds must remain typed

A candidate taxonomy for impact analysis:

- `VALUE_DEPENDENCY` — a derived fact directly consumes another fact's value/contract meaning.
- `ADMISSIBILITY_DEPENDENCY` — a Gate, authority, classification, currentness or prerequisite can change whether the operation is allowed.
- `COMPATIBILITY_DEPENDENCY` — a provided/consumed contract or guarantee vector can change compatibility.
- `CONTROL_FLOW_DEPENDENCY` — a Corridor/Gate change can alter reachability, synchronization, choice or required passage.
- `RESPONSIBILITY_DEPENDENCY` — Handoff/claim/acceptance changes can alter who may or must act.
- `EVIDENCE_DEPENDENCY` — a conclusion depends on evidence/currentness/provenance that may be superseded.
- `CONFORMANCE_DEPENDENCY` — a design change can alter assessment of an observed trace without rewriting that trace.
- `OWNERSHIP_BOUNDARY_DEPENDENCY` — an edit crosses or changes a semantic-owner boundary and therefore requires owner-local qualification.
- `PRESENTATION_DEPENDENCY` — affects only rendering/layout when explicitly proven semantically irrelevant.

These categories can overlap for one fact. They are not proposed enums.

## Typed relation propagation

A relation name does not imply one universal propagation rule.

### `PROVIDES` / `CONSUMES`

Changing a provider-facing contract can impact consumers that depend on the changed guarantee dimensions. A consumer that uses only an unchanged subset may be pruned if that non-impact is proven.

`provider revision changed != every consumer materially impacted`.

But:

`same schema shape != unchanged guarantee vector`.

### `REQUIRES`

A changed prerequisite is material when the dependent operation's admissibility or proof relies on it. Optional enrichment must not be upgraded into `REQUIRES` merely because a runtime happens to call it.

### `ENABLES`

`ENABLES` means the source establishes a possibility/condition; it does not imply every enabled operation depends on every internal detail of the enabler. Impact propagates through the declared enabling claim.

### `TRIGGERS`

A trigger can affect causal/workflow progression, retry identity and occurrence lineage. It does not automatically imply ownership or synchronous invocation.

### `CONSTRAINS`

Constraint changes propagate to the facts/operations whose admissibility is defined by that constraint. A relaxed constraint does not automatically make previously rejected historical occurrences conformant under their old design revision.

### `OBSERVES`

Observation generally creates a read/evidence dependency, not ownership. Changing the observer normally does not change the observed owner's semantics; changing the observed evidence source can invalidate an observer's derived conclusion.

### `PERSISTS`

Persistence realization changes need not affect semantic dependents if the persistence contract/guarantees remain equivalent. `storage provider changed != business meaning changed`.

### `EXPOSES`

An exposed surface depends on the contract it exposes, but UI/view changes that preserve the contract need not propagate into Core semantics.

### Handoff/Gate/Corridor relations

These require workflow-specific propagation because topology can alter synchronization, prerequisite satisfaction, responsibility transfer and conformance. Structural adjacency is a candidate seed, not sufficient proof.

## Four impact layers

Impact analysis should distinguish at least four layers rather than produce one undifferentiated affected-node list.

### 1. Direct semantic impact

The edit changes the object/claim itself: e.g. Counter required data, Door contract, Gate predicate, Handoff acceptance policy.

### 2. Contractual dependent impact

Other objects consume or rely on the changed semantic guarantee.

### 3. Behavioral/conformance impact

The edit changes which progressions are admissible or how observed traces are assessed.

### 4. Projection/materialization impact

Views must refresh because they render changed semantic facts. This does **not** make the views semantic dependencies of the edit.

Critical rule:

`must refresh projection != projection belongs in semantic transaction cut`.

## Impact seed vs impact proof

Graph traversal can produce a conservative candidate set:

```text
changed Door
 -> consumers
 -> Counters
 -> Corridors
 -> Gates
```

But every propagation step needs a typed reason. The final cut should distinguish:

- `MATERIAL` — evidence shows the dependency can alter the named decision/invariant;
- `PROVEN_NON_MATERIAL` — evidence proves the changed dimension is irrelevant for this decision;
- `POTENTIALLY_MATERIAL` — plausible dependency but insufficient evidence to prune;
- `UNKNOWN` — dependency source/currentness/meaning cannot be qualified.

These are candidate dispositions, not committed enums.

`POTENTIALLY_MATERIAL/UNKNOWN != safe to omit` when omission could violate a hard invariant.

## Negative dependency claims

A difficult but important result is that *non-dependency* is itself a proof claim.

Examples:

- Consumer B uses only fields/guarantees unchanged by Door D's edit.
- Corridor C is on a mutually exclusive branch whose guard is invariant for this edit.
- Topology view V renders the relation but contributes no semantic input to it.
- Provider implementation P changes while its declared contract/guarantee vector remains equivalent for invariant X.

Therefore:

`not discovered as dependency != proven independent`.

Candidate `NonImpactEvidence` should name the invariant, relation/contract dimensions considered, revisions/currentness and the reason the dependency can be pruned.

This prevents an incremental impact engine from turning absence in an index into semantic proof.

## Dynamic/discovered dependencies

Some dependencies may only become visible during qualification. Example: a Gate predicate references a classification policy selected by tenant; changing the Gate can reveal that a tenant-specific policy is material.

Research rules:

- discovered dependencies become part of the edit's dependency cut/provenance;
- discovery is bounded by declared semantic surfaces, not arbitrary runtime introspection;
- a later edit that changes discovery conditions can invalidate the previous cut;
- dynamic discovery must not create hidden ownership transfer;
- failure to complete discovery yields an explicit unknown frontier rather than assumed closure.

This mirrors the useful property of dynamic incremental systems without importing their build semantics wholesale.

## Dependency-cut closure without a global oracle

A global registry is not required if each semantic boundary can expose enough contract-qualified dependency evidence for the invariant being assessed.

Candidate distributed closure process:

1. Start from changed semantic claims and named invariants.
2. Ask the owning boundary for declared inbound/outbound dependency contracts relevant to those claims.
3. Traverse only relation kinds whose propagation law is material to the invariant.
4. At each new owner boundary, require revision/currentness/contract evidence.
5. Permit pruning only with qualified non-impact evidence.
6. Stop at a boundary proven irrelevant or semantically opaque with an explicit disposition.
7. If a required dependency surface cannot prove closure, preserve `UNKNOWN/POTENTIALLY_MATERIAL` and defer or broaden the cut according to invariant policy.

Thus:

`distributed dependency evidence != central dependency ownership`.

The Exchange Plane may transport relation/evidence references, but business owners define the semantic meaning of their dependencies.

## Relation to semantic transaction boundaries

The prior artifact proposed:

`Atomicity scope = smallest proof-complete set of semantic facts whose partial application could violate the named invariant`.

This round refines how that set is derived.

The `SemanticImpactCut` is not automatically the atomic write set. It can contain:

- facts that must be atomically changed;
- facts that must merely be revalidated before commit;
- facts whose projections must refresh afterward;
- facts whose conformance assessments must be recomputed;
- facts that require human/owner acceptance;
- external dependents that must receive versioned successor contracts rather than participate in one transaction.

Therefore:

`impact set != write set != lock set != refresh set != review set`.

This prevents impact analysis from accidentally creating a distributed transaction requirement.

## Cross-boundary example

Suppose `Door D` in Module A changes a response guarantee from `effect-confirmed` to `accepted-for-processing`.

Candidate analysis:

1. `D` is directly impacted.
2. Counters/relations consuming only payload schema but not completion guarantee may be candidates for proven non-impact.
3. Consumer B whose Gate requires `effect-confirmed` has a compatibility/admissibility dependency and must be requalified.
4. A Corridor whose progression is allowed only after effect confirmation has behavioral impact.
5. Historical observed traces remain unchanged.
6. Existing conformance assessments remain historical evidence under their DesignRevision; successor assessments may be required for the new design.
7. 2D/3D/Workflow projections showing D/B/Corridor need refresh but are not semantic owners or transaction participants.
8. A provider implementation behind D need not enter the impact cut if the edit is entirely at contract level and provider qualification is separately preserved; if the provider cannot realize the successor guarantee, provider compatibility becomes material.

This is much narrower and more meaningful than `all nodes reachable from D`.

## Workflow change-region semantics

For Corridor/Gate/Handoff edits, candidate impact analysis should distinguish:

- structural reachability changes;
- token/progression enabling changes;
- synchronization/join changes;
- responsibility/claim changes;
- prerequisite/evidence changes;
- timeout/escalation/recovery changes;
- conformance-assessment changes.

A structural change region is useful as a conservative seed. It is not automatically the semantic change region.

`same reachable nodes != same workflow semantics`.

`different reachable nodes != every active occurrence unsafe`.

For live occurrences, migration/rebase eligibility must remain occurrence-state/evidence relative; the design graph alone cannot decide it.

## Capability shafts and impact

Capability shafts are projections of participation. They must not become shortcut dependency or ownership edges.

Changing a `CapabilityParticipation` can affect:

- capability coverage/availability claims;
- contracts by which a module participates;
- required conformance/assurance evidence;
- views that render participation.

It does not by itself imply that every module on the same shaft is impacted.

`same capability shaft != mutual semantic dependency`.

Impact crosses shaft participants only through declared contracts/relations/invariants.

## Designed / observed / assessed preservation

Impact analysis must preserve the three-domain split:

```text
DESIGNED  --edit--> successor design revision
OBSERVED  --------> immutable/append-only occurrence evidence
ASSESSED  --------> assessment bound to design + observed evidence + assessment profile
```

An edit can invalidate the *current applicability* of an assessment without erasing the historical assessment.

`design impact != observed-history mutation`.

`assessment recomputation != historical assessment rewrite`.

This is critical when Gate/Handoff/Corridor changes alter conformance interpretation.

## Failure and recovery

Must remain representable:

- missing dependency discovered after preview but before commit;
- missing dependency discovered only after commit;
- redundant dependency causing false conflict/serialization;
- dependency revision changes during impact analysis;
- relation kind changes while traversal is in progress;
- dynamic dependency discovery fails or times out;
- owner boundary is offline but local evidence remains within declared currentness horizon;
- non-impact proof expires before commit;
- impact cut is complete for one invariant but incomplete for another;
- workflow structural region is known but semantic migration safety is unknown;
- projection refresh set is complete while semantic dependency set is not;
- duplicate/stale impact analysis result arrives after a successor edit;
- rollback restores an old dependency index but not old semantic authority/currentness.

Recovery principles:

- impact analysis results are revision/currentness-bound evidence, not canonical truth;
- stale impact cuts are requalified selectively;
- newly discovered material dependencies expand/reassess the candidate cut rather than being silently ignored;
- post-commit discovery of a missed hard dependency is a conformance/integrity finding requiring explicit reconciliation, not retroactive proof that the original edit was safe;
- a dependency index may accelerate discovery but cannot be the sole authority for negative dependency claims.

## Proof obligations

1. Every semantic edit names stable semantic targets independent of projection.
2. Impact is derived relative to named invariants/guarantees, not generic graph reachability.
3. Every included dependency has a typed materiality reason or is explicitly conservative/unresolved.
4. Every omitted plausible dependency that could affect a hard invariant has qualified non-impact evidence or remains in an unknown frontier.
5. Relation kinds have distinct propagation semantics; generic edges do not fabricate dependency.
6. `PROVIDES/CONSUMES` impact is guarantee-dimension aware, not schema-name equality.
7. `REQUIRES` is not inferred from incidental runtime calls.
8. `OBSERVES` does not transfer ownership.
9. `PERSISTS` provider substitution does not propagate into business semantics when contract equivalence for the named invariant is proven.
10. `EXPOSES` UI/view changes do not redefine Core semantics.
11. Capability shaft membership never implies mutual dependency or global ownership.
12. Structural workflow change regions are seeds/evidence, not automatic semantic impact proofs.
13. Gate/Handoff/Corridor impact includes control, responsibility, evidence and conformance dimensions where material.
14. Designed-path edits never rewrite observed occurrence evidence.
15. Recomputed conformance assessments bind explicit successor design revisions and preserve historical assessments.
16. Impact set, write set, lock set, refresh set and review/acceptance set remain distinguishable.
17. Cross-boundary impact does not imply a global distributed transaction.
18. Material owner boundaries contribute contract-qualified dependency evidence without ceding business ownership to the Canvas or Exchange Plane.
19. Dependency indexes/projections may accelerate discovery but are not canonical truth.
20. `not found in index` never becomes proof of non-dependency by itself.
21. Dynamic/discovered dependencies retain derivation provenance and revision/currentness.
22. Incomplete dependency discovery remains representable as `UNKNOWN/POTENTIALLY_MATERIAL` rather than guessed safe.
23. Non-impact evidence is invariant-, dimension-, revision- and currentness-scoped.
24. Changed input with semantically unchanged derived guarantee may be pruned only with qualified evidence.
25. A stale non-impact proof cannot authorize commit after a material dependency change.
26. A dependency cut complete for invariant X cannot be generalized automatically to invariant Y.
27. Projection refresh requirements do not make projections semantic transaction participants.
28. Preview/simulation impact evidence remains non-authoritative until the edit is committed/qualified under the required authority.
29. Post-commit discovery of a missed hard dependency remains an explicit integrity/conformance finding; history is not rewritten.
30. Accessibility/non-spatial editors derive the same semantic impact rules as 3D/2D gestures for equivalent intents.
31. No global Canvas revision/dependency oracle is required unless a future invariant proves such a boundary necessary.
32. The impact analyzer/controller may derive/verify dependency evidence but cannot invent business ownership, compatibility or authority.

## Adversarial cases

1. BFS from a changed Door marks the entire connected Canvas as impacted.
2. A graph index misses a hidden contract dependency and the edit is declared safe.
3. Same contract name/schema causes a changed guarantee to be pruned incorrectly.
4. A runtime call graph is mistaken for semantic `REQUIRES`.
5. An `OBSERVES` edge makes the observer an accidental owner of the observed state.
6. A storage-provider change invalidates Core despite unchanged qualified persistence guarantees.
7. A view refresh dependency is inserted into the atomic semantic write set.
8. Capability shaft membership causes all participants to lock together.
9. Workflow structural reachability is unchanged but a Gate predicate changes; impact is missed.
10. Reachability changes but an unaffected active occurrence is unnecessarily blocked forever.
11. Handoff acceptance changes but only control-flow edges are analyzed.
12. Counter required-data change is checked without downstream validation/contract consumers.
13. Door guarantee changes from effect-confirmed to accepted-for-processing but consumer Gate is not requalified.
14. `not found` in dependency index is treated as proof of independence.
15. Dynamic dependency discovery times out and returns an empty dependency set.
16. A tenant-specific policy dependency is discovered in preview but omitted from commit validation.
17. Non-impact proof from revision r1 is reused after relation semantics change in r2.
18. Impact cut derived for security invariant is reused for workflow conformance without proof.
19. Global dependency revision serializes unrelated module edits.
20. Impact set is equated with lock set and creates an accidental distributed transaction.
21. Impact set is equated with refresh set and projections become canonical participants.
22. Historical observed trace is modified because successor design no longer contains a stage.
23. Historical assessment is overwritten by reassessment against the new design.
24. Provider/adaptor concrete topology is allowed to redefine which Core guarantees are material.
25. An analyzer reports `no impact` because a derived value currently happens to be equal, without binding the equivalence proof to dimensions/revision.
26. A conservative structural workflow region is presented as exact semantic migration unsafety.
27. Missing owner boundary evidence is converted into implicit compatibility.
28. Exchange Plane aggregates dependencies and becomes the owner of cross-module workflow semantics.
29. AI infers a dependency or non-dependency from visual proximity and the result is treated as authority.
30. Two projections derive different impact sets for the same EditIntent because one silently changes relation meaning.
31. Rollback restores an old dependency index and resurrects pruned dependencies below a newer authority/currentness floor.
32. Post-commit missed dependency is hidden by rewriting the old impact report as if it had always included the dependency.

## Portability / exit path

The research deliberately does not require one dependency engine. A future realization may combine declared contract dependencies, typed graph indexes, incremental recomputation, workflow analysis, static analysis, runtime evidence and human qualification.

Portable requirements are:

- stable semantic identity independent of projection;
- typed relation/dependency semantics;
- invariant-relative materiality;
- explicit revision/currentness/provenance;
- qualified non-impact evidence;
- unknown frontier preservation;
- selective requalification;
- separation of impact/write/lock/refresh/review sets;
- no dependency index as canonical truth;
- no global dependency oracle unless later proven necessary.

## Deduplication against existing G4 research

This artifact does not reopen generic Exchange Plane dependency graphs, cache invalidation, policy dependency closure, cross-plane snapshot coherence or G3 semantics. It also does not replace the prior Canvas editing artifact.

The material delta is specifically:

`EditIntent -> named invariant -> typed semantic dependency propagation -> conservative candidate region -> qualified pruning/non-impact evidence -> SemanticImpactCut + UnknownFrontier -> minimal proof-complete edit/revalidation scope`.

## Maturity and open gap

Maturity: `MATERIAL / NOT SATURATED / NON_EXECUTABLE`.

This round materially advances the Canvas from "edits carry a dependency cut" to an implementation-independent hypothesis for deriving that cut without generic graph reachability or a central dependency oracle.

Highest-value next gap: **impact analysis for live occurrences during design evolution**. When a Corridor/Gate/Handoff/Counter contract changes while occurrences are already in-flight, determine which occurrences can continue under their pinned design/contract lineage, which can safely migrate/rebase to the successor design, which require drain/settlement/manual review, and how to prove this without treating design publication as retroactive runtime mutation or requiring all runtimes to synchronize globally.

## Evidence references

Primary/official and research evidence consulted for this round:

- Bazel, *Skyframe* — dependency graph, reverse transitive invalidation, change pruning, incremental recomputation.
- Sebastian Erdweg et al., *A Sound and Optimal Incremental Build System with Dynamic Dependencies* (Pluto) — dynamically discovered dependencies and sound incremental rebuilding.
- Gabriël Konat, Sebastian Erdweg, Eelco Visser, *Scalable Incremental Building with Dynamic Task Dependencies* (ASE 2018) — affected-task scaling and dynamic dependency evolution.
- Ahana Pradhan, Rushikesh K. Joshi, *A Structural Approach to Dynamic Migration in Petri Net Models of Structured Workflows* (2020) — structural change regions, migration consistency and overestimation.
- Incremental-build dependency-error research — missing/redundant dependency failure classes.
- OpenRewrite program-analysis documentation — separate control-flow/data-flow analysis as a mature example of typed analysis questions rather than generic graph connectivity.
