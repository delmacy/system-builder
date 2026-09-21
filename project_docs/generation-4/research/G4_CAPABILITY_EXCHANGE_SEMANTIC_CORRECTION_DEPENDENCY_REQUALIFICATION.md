# G4 — Cross-Capability Semantic-Correction Dependency and Transitive Requalification

Status: `RESEARCH_ACTIVE / NON_EXECUTABLE`
Date: 2026-09-21
Scope: Generation 4 product R&D only. No implementation authority.

## 1. Research question

When an immutable semantic profile `P1` receives a qualified correction/successor `P1'`, how can System Builder determine which contracts, bridges, closures, projections, caches and downstream guarantee evidence are materially affected without treating every textual reference as a dependency, invalidating the entire platform, or transferring business ownership to the correction authority or Exchange Plane?

This is a focused continuation of `G4_CAPABILITY_EXCHANGE_SEMANTIC_CORRECTION_AUTHORITY_FEDERATION.md`, proof-migration bridge qualification, degraded dependency guarantee synthesis, distributed guarantee-evidence caching, distributed requalification anti-entropy and frontier-compaction research. It does not create a new macro-family and does not reopen G3.

## 2. Evidence base

Primary/mature systems and research reviewed:

- Salsa incremental-computation algorithm and tracked functions: a derived result records the tracked inputs/functions it actually depends on; after an input revision, unchanged dependencies permit reuse, while changed dependencies cause re-execution. This is evidence for dependency-aware selective recomputation, not for semantic ownership or a G4 implementation choice.
- Self-adjusting computation literature (Acar et al.; Burckhardt et al.): dynamic dependence graphs and memoization can propagate input changes through only affected computations while retaining from-scratch consistency as the correctness target. This is evidence for change propagation with an explicit correctness oracle, not for treating a runtime execution trace as normative semantics.
- Bazel hermetic/action-graph model: action keys and declared inputs allow deterministic cache reuse/invalidation; undeclared/non-hermetic dependencies are a correctness hazard. This is strong failure evidence that incomplete dependency capture produces stale derived outputs and that extra dependencies reduce reuse/performance.
- Build Systems à la Carte (Mokhov, Mitchell, Peyton Jones): build systems can be decomposed by scheduler/rebuilder/dependency strategy rather than assuming one mechanism. This supports separating the G4 semantic dependency model from its future incremental engine/provider.
- Incremental view maintenance (Gupta, Mumick, Subrahmanian) and Datalog materialisation maintenance (Motik et al.): derived facts can have multiple derivations; deletion/change of one support does not necessarily defeat a fact if another valid derivation remains. This is a critical precedent for support-set-aware requalification rather than graph reachability alone.
- Open Policy Agent partial evaluation/optimization: rules depending on unknowns are treated differently from rules independent of them; policy/data updates invalidate derived partial-evaluation results that materially depend on changed inputs. OPA IR also versions incompatible IR contracts explicitly. This is evidence for dependency-sensitive derived artifacts and explicit contract-version boundaries, not adoption of Rego/OPA.
- Existing G4 artifacts: dependency-claim graphs, invariant-specific minimal semantic cut sets, proof lineage, selective cache invalidation, correction authority/federation, bridge qualification, anti-entropy and proof-preserving compaction already establish the semantic boundaries reused here.

No Salsa, Bazel, OPA, Datalog engine, build engine, graph database or incremental-computation framework is selected.

## 3. Material findings

### 3.1 Reference is not dependency

A contract or artifact may mention `P1` for documentation, provenance, historical interpretation or an optional path without its current guarantee depending on the corrected clause.

`reference(P1) != material semantic dependency(P1.clause)`.

Conversely, a derived artifact can materially depend on a semantic premise without containing its textual identifier if the premise was inlined, normalized or compiled away.

`no textual reference != no semantic dependency`.

Therefore grep/import/call-graph reachability is insufficient for requalification.

### 3.2 The dependency unit is a qualified semantic claim, not a whole document

A correction may affect one predicate, guarantee dimension or proof rule while leaving the rest of P1 unchanged. The candidate dependency edge therefore needs at least source semantic identity, source claim/predicate scope, consuming claim/guarantee scope, dependency kind and derivation/provenance evidence.

`profile changed != every consumer invalid`.

This extends the existing G4 rule `critical path != minimal semantic cut set`: impact is guarantee/invariant-relative.

### 3.3 Correction materiality is evaluated against each downstream claim

A correction is globally material to P1 yet irrelevant to a particular downstream guarantee if that guarantee has a derivation independent of the changed semantic region.

`correction material to source != material to every dependent claim`.

Candidate impact states are therefore not binary. At minimum the research model needs `UNAFFECTED_PROVEN`, `AFFECTED_REQUALIFY`, `POTENTIALLY_AFFECTED`, `CONTESTED_DEPENDENCY` and `DEPENDENCY_UNKNOWN`.

### 3.4 Transitive reachability is only a candidate-impact superset

If A depends on B and B depends on corrected P1, A is reachable from P1, but A need not be semantically defeated. B may preserve the exact guarantee A consumes, use an alternative derivation, or expose a weaker-but-still-sufficient guarantee.

`transitively reachable != transitively invalid`.

Reachability is useful to bound analysis; semantic requalification decides the disposition.

### 3.5 Multiple derivations prevent naive invalidation

Incremental view-maintenance research shows that a derived fact may have multiple supports. Analogously, a guarantee can remain valid if one support path is defeated but another independently sufficient path survives.

`one support defeated != derived claim defeated`.

A future `SupportSetRef`/`DerivationAlternativeRef` can preserve enough information to distinguish conjunctive dependencies (all required), disjunctive alternatives (one sufficient), threshold/quorum support and conditional support.

### 3.6 Conjunctive and alternative dependencies propagate differently

For `G <- A AND B`, defeating A normally defeats that derivation. For `G <- A OR B`, defeating A need not defeat G if B remains qualified. Threshold and quorum claims require their own rule.

`dependency edge != universal propagation law`.

The propagation rule belongs to the consuming contract/derivation, not to the Exchange Plane.

### 3.7 Semantic dependency and operational dependency remain distinct

A service may call another service operationally while not depending on the corrected semantic clause, and a compiled artifact may depend semantically on a clause without making any runtime call.

`call graph != semantic dependency graph`.

This prevents infrastructure topology from becoming accidental semantic authority.

### 3.8 Static declaration and observed dependency are complementary evidence

Bazel-like declared dependencies provide reviewable intent; self-adjusting systems show the value of observed/dynamic dependencies. Neither alone is universally sufficient.

`declared dependency != necessarily complete dependency`.

`observed dependency != normative dependency for all possible executions`.

A future qualification model may compare declared semantic dependency, derivation evidence and observed traces; disagreement is a finding, not majority truth.

### 3.9 Missing dependency is a correctness failure; redundant dependency is an availability/performance failure

Under-approximation can preserve stale or unsafe guarantee evidence after a material correction. Over-approximation causes unnecessary invalidation/recomputation and can create platform-wide requalification storms.

`dependency precision is both safety and operability relevant`.

For protected effects, uncertainty about a potentially material missing dependency must fail qualified rather than silently reuse evidence.

### 3.10 From-scratch semantic equivalence is the conceptual correctness oracle

Incremental-computation systems use from-scratch consistency as their correctness target. The G4 analogue is:

`incrementally requalified disposition == disposition from fresh evaluation under the same immutable semantics, correction frontier, authority/currentness evidence and declared assumptions`.

This is a proof obligation, not a requirement to recompute everything in production.

### 3.11 A correction can change the dependency graph itself

P1' may remove, add or condition a dependency. Therefore requalification cannot assume that the old dependency graph remains complete after the semantic change.

`old dependency graph != automatically valid impact graph under corrected semantics`.

Consumers whose derivation-generation rules depend on the corrected region may need dependency rediscovery/rederivation, not merely value refresh.

### 3.12 Bridge evidence is itself downstream evidence

A `ProofMigrationBridgeRef` whose theorem or coverage depends on corrected P1 semantics becomes a requalification target. The correction authority does not decide whether the bridge remains valid; bridge qualification evaluates that question.

`correction authorized != bridge automatically requalified`.

Counterexamples and ambiguity evidence remain durable inputs.

### 3.13 Closures and compact summaries require dependency coverage claims

A compact closure that discarded detailed derivations must still answer whether a later correction materially affects its live claims. Therefore compaction must preserve either sufficient lineage/support information or an explicit below-floor disposition.

`compacted != dependency-free`.

A closure that cannot establish impact after P1->P1' must return `DEPENDENCY_UNKNOWN/REBUILD_REQUIRED`, not reuse a prior `VALID` disposition.

### 3.14 Projections/indexes/caches are invalidated by lineage, not promoted to authority

Search indexes, vector indexes, caches, telemetry views and UI projections may depend on corrected semantics. Their invalidation/rebuild follows provenance/lineage, but they remain derived state.

`projection requalified != canonical business state changed`.

Likewise a stale projection cannot veto a capability owner's canonical state.

### 3.15 Historical interpretation and current admissibility propagate separately

A correction can require current guarantee evidence to be requalified while old effects remain historically interpreted under P1.

`current dependency defeated != historical effect erased`.

Historical lineage records the semantics used at admission/effect time; current dependency analysis governs whether that evidence can support a new claim/effect now.

### 3.16 Requalification authority remains local to the derived claim owner

The correction authority can establish that P1 changed and what the corrected semantics are. It does not own downstream capability decisions.

`source correction authority != downstream requalification authority`.

Each capability/contract owner applies the correction to its own derivations according to its contract. The Exchange Plane may route findings/evidence and track exchange-level currentness, but cannot decide downstream business truth.

### 3.17 Cross-capability propagation is evidence exchange, not workflow takeover

A capability can emit a qualified correction/dependency finding. Consumers independently verify whether their own claims are affected.

`impact notification != downstream state mutation authority`.

This preserves autonomous runtimes and avoids turning the Exchange Plane into an ESB-style central orchestrator.

### 3.18 Requalification needs stable claim identity without global semantic IDs

Selective propagation requires identifiers for the source semantic claim and consuming derived claim, but those identifiers need only be stable within declared namespace/trust/correlation scopes.

`selective lineage != global identity plane`.

Cross-tenant/global stable dependency handles can leak architecture and policy relationships; correlation scope remains explicit.

### 3.19 Cycles require fixed-point or explicit bounded conflict semantics

Cross-capability derived claims can form semantic dependency cycles even when the runtime call graph is acyclic. A correction inside such a strongly connected region may require fixed-point requalification or explicit `CONTESTED/UNKNOWN` handling.

`acyclic calls != acyclic semantic derivations`.

No arbitrary traversal order may fabricate convergence.

### 3.20 Requalification storms require bounded scheduling without weakening semantics

A widely used P1 correction can fan out to many derived claims. Coalescing duplicate work, prioritizing protected effects, batching evidence fetches and bounded concurrency are legitimate operational controls.

`bounded requalification scheduling != permission to extend semantic freshness`.

Rate/cost budgets cannot relabel stale/unknown evidence as current.

### 3.21 Offline runtimes preserve local floors and requalify on rejoin

An offline runtime may continue only within its declared correction/currentness horizon. On learning a newer correction frontier, it computes impact against locally durable lineage/support evidence.

`offline execution != immunity from later requalification`.

But later requalification does not retroactively pretend the correction was locally known before observation.

### 3.22 Requalification outcome can be guarantee-selective

A derived contract may preserve integrity and provenance while losing currentness or a stronger authorization guarantee after correction.

`artifact affected != all guarantees false`.

The result is a guarantee vector/disposition, not a single validity bit.

### 3.23 Full graph replay is not required when qualified summaries subsume dependencies

A `DependencyClosureRef` may summarize support/impact information if it preserves every live question required for future correction analysis. This parallels existing proof-preserving frontier compaction.

`dependency compaction != semantic forgetting`.

If a later correction falls below the retained dependency floor, the safe result is explicit unsupported/rebuild/rebootstrap behavior.

### 3.24 No provider is implied

The dependency model could later be realized through static metadata, generated manifests, incremental engines, graph stores, relational lineage, proof artifacts or hybrids.

`implementation-independent dependency semantics != graph-database requirement`.

Provider selection remains future qualification work.

## 4. Candidate vocabulary

Research vocabulary only:

- `SemanticDependencyRef` — qualified edge from a consuming claim/guarantee to a source semantic claim/predicate.
- `DependencyKind` — candidate relation such as `REQUIRES_ALL`, `REQUIRES_ANY`, `THRESHOLD`, `CONDITIONAL`, `HISTORICAL_ONLY`, `CURRENTNESS_ONLY`, `TRANSLATION`, `DERIVATION`.
- `SupportSetRef` — immutable reference to sufficient supports for a derived claim.
- `DerivationAlternativeRef` — one independently sufficient derivation branch.
- `CorrectionImpactRef` — evidence relating a correction delta to a downstream dependency/claim.
- `CorrectionImpactDisposition` — `UNAFFECTED_PROVEN`, `AFFECTED_REQUALIFY`, `POTENTIALLY_AFFECTED`, `CONTESTED_DEPENDENCY`, `DEPENDENCY_UNKNOWN`.
- `RequalificationPlanRef` — bounded derived work set produced from qualified impact analysis; not execution authority.
- `DependencyClosureRef` — compact lineage/support summary preserving declared future impact questions.
- `DependencyFloorRef` — retained lower bound below which impact cannot be answered without rebuild/rebootstrap.
- `DependencyObservationRef` — observed runtime/build/evaluation dependency evidence, explicitly non-normative by itself.
- `DependencyDeclarationRef` — declared semantic dependency evidence from a contract/derivation definition.
- `RequalificationResultRef` — claim-scoped result preserving guarantee vector, correction frontier, assumptions and provenance.

These are structural/evidence primitives, not shared business entities or concrete components.

## 5. Candidate proof obligations

1. A textual/profile reference is not automatically treated as a material semantic dependency.
2. Absence of a textual reference does not prove absence of semantic dependency.
3. Dependency edges identify source semantic claim/predicate and consuming claim/guarantee scope.
4. Correction impact is evaluated claim-selectively rather than invalidating every consumer of the profile.
5. Transitive reachability is used only as an impact candidate set; it cannot by itself establish invalidity.
6. Multiple independent derivations/support sets are preserved sufficiently to avoid false invalidation when one support is defeated.
7. Conjunctive, alternative, threshold and conditional support use explicit propagation semantics.
8. Operational call topology does not define semantic dependency ownership.
9. Declared and observed dependencies remain distinguishable; disagreement is representable evidence.
10. Potentially missing material dependencies fail qualified for protected effects rather than silently reusing stale evidence.
11. Redundant dependencies cannot silently become new authority requirements; their cost/availability impact remains observable.
12. Incremental requalification is observationally consistent with fresh evaluation under the same semantic/correction/authority assumptions for the declared proof scope.
13. A semantic correction that changes dependency-generation rules triggers dependency rediscovery/rederivation where required.
14. Proof-migration bridges depending on corrected semantics are independently requalified by bridge proof obligations.
15. Compact closures retain sufficient dependency/support lineage for every live future correction-impact question or expose an explicit below-floor disposition.
16. Projection/index/cache invalidation follows lineage without making derived stores canonical business authority.
17. Historical effect semantics remain bound to historical admission/effect context even when current evidence is requalified.
18. Source correction authority cannot decide downstream capability business state or derived-claim validity merely by issuing the correction.
19. Cross-capability impact messages are evidence/notifications, not mutation authority over the consumer.
20. Dependency identifiers and reconciliation handles have declared trust/tenant/correlation scope rather than becoming global identity keys.
21. Cyclic semantic dependency regions use a qualified fixed-point/termination/conflict rule; traversal order cannot decide truth.
22. Requalification scheduling, batching and backpressure cannot extend currentness or fabricate a stronger guarantee.
23. Offline runtimes preserve local observation/adoption times and monotonic correction/security floors when rejoining.
24. Requalification outcomes preserve multidimensional guarantee dispositions; affected evidence is not flattened to one boolean validity bit.

## 6. Adversarial cases

1. P1' changes one proof predicate; every artifact mentioning P1 is globally invalidated.
2. A contract has no literal `P1` string because the predicate was inlined, so it escapes requalification.
3. Call-graph reachability is treated as semantic dependency truth.
4. A service call unrelated to the corrected clause causes a false platform-wide dependency edge.
5. One support path is defeated while an independent valid derivation exists, but the derived claim is marked invalid.
6. An OR/threshold dependency is processed as AND.
7. A required conjunct is processed as optional because another operational fallback exists.
8. Dynamic traces did not exercise a branch, so an unobserved normative dependency is omitted.
9. A stale declared dependency remains after semantics change and causes permanent unnecessary invalidation.
10. Missing dependency preserves cached `VALID` evidence after a material correction.
11. Correction changes the dependency-generating rule, but the old graph is used to decide what must be recomputed.
12. P1 bridge theorem depends on corrected clause; bridge is reused without requalification.
13. Compaction retains only `current=P1'` and discards support lineage needed to assess a later correction.
14. Vector/search index is rebuilt and its result is treated as canonical correction of business records.
15. Current correction requalification retroactively relabels historical effects as having used P1'.
16. Correction authority sends `affected=true` and downstream capabilities treat it as business mutation authority.
17. Exchange Plane recursively recomputes capability business state and becomes a central orchestrator/owner.
18. Global stable dependency IDs correlate otherwise isolated tenants/trust domains.
19. Two capabilities form a semantic cycle; last processed node wins.
20. Correction fan-out causes retry/requalification storm; system extends freshness windows to reduce load.
21. Offline runtime rejoins and replaces its historical observation time with correction publication time.
22. Derived contract loses authorization guarantee but retains integrity; implementation flattens the entire result to `VALID`.
23. Dependency summary cannot answer an old-clause impact question but treats absence as `UNAFFECTED`.
24. A graph database/provider-specific edge type becomes the normative semantic model and creates lock-in.

## 7. Technology-independent impact/requalification hypothesis

A candidate reasoning sequence is:

`QUALIFIED CORRECTION -> IDENTIFY CHANGED SEMANTIC CLAIMS -> DISCOVER CANDIDATE CONSUMERS -> QUALIFY MATERIAL DEPENDENCY -> PROPAGATE THROUGH SUPPORT/DERIVATION RULES -> REQUALIFY AFFECTED CLAIMS -> PERSIST RESULT/FLOORS/LINEAGE -> DISTRIBUTE FINDINGS -> CONSUMERS VERIFY LOCALLY`.

This is not a required workflow engine or central service. Each stage can be local, distributed or offline-compatible if its proof obligations remain satisfied.

A downstream claim is reusable without recomputation only when evidence establishes that either:

1. it has no material dependency on the corrected semantic region; or
2. all material dependencies still satisfy the required guarantees after correction; or
3. an independently sufficient derivation/support set remains qualified.

Otherwise the result remains `AFFECTED_REQUALIFY`, `POTENTIALLY_AFFECTED`, `CONTESTED_DEPENDENCY` or `DEPENDENCY_UNKNOWN` until qualified evidence resolves it.

## 8. Direct lessons from mature patterns

| Pattern | Useful lesson | Boundary for G4 |
|---|---|---|
| Salsa / self-adjusting computation | Track dependencies and propagate only material input changes; target from-scratch consistency | Runtime traces/caches are not normative semantics |
| Bazel action graph / hermeticity | Explicit inputs enable precise reuse; missing inputs make incremental results unsound | Build dependency is not automatically semantic dependency |
| Incremental view maintenance / Datalog | Derived results may have multiple derivations; deletion of one support need not delete result | Business/contract guarantees need explicit support semantics |
| OPA partial evaluation | Unknown/material inputs influence which derived policy can be safely specialized/reused | OPA/Rego/IR are not selected; policy engine cannot become business owner |
| Build Systems à la Carte | Dependency/rebuild/scheduling strategies are separable design dimensions | No one incremental engine is architecturally mandatory |

## 9. Portability and exit path

A future implementation should be replaceable if it can export/import, without semantic loss for declared scope:

- immutable source/correction semantic refs;
- consuming claim/guarantee refs;
- qualified dependency kind and scope;
- support/alternative derivation structure sufficient for live questions;
- correction-impact dispositions and provenance;
- retained dependency floors/closures;
- requalification results and guarantee vectors;
- observation/adoption times where material;
- tenant/trust/correlation scope;
- explicit unsupported/below-floor states.

A graph database, build engine, policy engine or cache that cannot export this meaning is a lock-in candidate rather than semantic authority.

## 10. Deduplication against existing G4 research

This round does not reopen:

- generic dependency-claim graph or degraded-mode synthesis;
- generic guarantee-evidence cache invalidation;
- correction-authority governance;
- proof-migration bridge theorem qualification;
- anti-entropy/requalification frontier distribution;
- frontier/closure compaction in general;
- business split-brain or effect settlement.

Material delta is specifically:

`qualified semantic correction -> claim-level material dependency -> support-set-aware transitive impact -> selective downstream requalification -> capability-local ownership -> portable dependency lineage without global invalidation/oracle`.

## 11. Maturity and next gap

State: `RESEARCH_ACTIVE / NON_EXECUTABLE`.

This subproblem is materially better bounded but not saturated. The next highest-value gap is **dependency-lineage soundness under hidden/dynamic dependencies and generated/compiled artifacts**: determine how to qualify that a declared/recorded semantic dependency set is complete enough for protected requalification when dependencies can be introduced by code generation, partial evaluation, plugins/adapters, configuration, data-dependent branches or opaque third-party components, without requiring omniscient tracing or full recomputation on every correction.

## 12. Sources

Primary/mature references consulted in this round:

- Salsa, *The red-green algorithm* and tracked-function documentation: https://salsa-rs.github.io/salsa/reference/algorithm.html
- Bazel, *Hermeticity* and action-graph documentation: https://bazel.build/basics/hermeticity and https://bazel.build/docs/aquery
- Mokhov, Mitchell, Peyton Jones, *Build Systems à la Carte*, Journal of Functional Programming 30 (2020), DOI 10.1017/S0956796820000088.
- Gupta, Mumick, Subrahmanian, *Maintaining Views Incrementally*, SIGMOD 1993, DOI 10.1145/170036.170066.
- Motik, Nenov, Piro, Horrocks, *Incremental Update of Datalog Materialisation: the Backward/Forward Algorithm*, AAAI 2015, DOI 10.1609/aaai.v29i1.9409.
- Burckhardt et al., *Two for the Price of One: A Model for Parallel and Incremental Computation*, OOPSLA 2011, DOI 10.1145/2048066.2048101.
- Acar, Blume, Donham, *A Consistent Semantics of Self-Adjusting Computation*, Journal of Functional Programming 2013 / arXiv:1106.0478.
- Open Policy Agent, *Policy Performance / Partial Evaluation*, *Intermediate Representation* and *Bundles*: https://www.openpolicyagent.org/docs/policy-performance , https://www.openpolicyagent.org/docs/ir , https://www.openpolicyagent.org/docs/management-bundles .

These sources are benchmarks/evidence only. No provider or implementation binding follows.