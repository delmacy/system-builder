# G4 — Dependency-Lineage Soundness under Hidden, Dynamic and Generated Dependencies

Status: `RESEARCH_ACTIVE / NON_EXECUTABLE`
Date: 2026-09-21
Scope: Generation 4 product R&D only. No implementation authority.

## 1. Research question

How can System Builder qualify that dependency lineage is sufficiently complete for protected semantic requalification when dependencies may arise from code generation, partial evaluation, plugins/adapters, configuration, environment, data-dependent branches or opaque third-party components, without requiring omniscient tracing, global recomputation after every correction, or promotion of build/runtime tooling into semantic authority?

This is a focused continuation of `G4_CAPABILITY_EXCHANGE_SEMANTIC_CORRECTION_DEPENDENCY_REQUALIFICATION.md`. It does not create a new macro-family and does not reopen G3.

## 2. Evidence base

Primary standards, mature systems and failure-oriented references reviewed:

- SLSA Provenance / Build requirements: provenance distinguishes declared/external parameters, resolved dependencies/materials and environment, and explicitly treats completeness as a claim rather than an automatic property. Current SLSA requirements require external parameters to be enumerated at stronger levels while acknowledging that completeness of resolved dependencies remains best effort. This is direct precedent for representing lineage completeness/coverage rather than assuming that a dependency list is exhaustive.
- Reproducible Builds guidance: timestamps, timezone, filesystem metadata, generated files, random seeds and build paths are recurring hidden inputs. `SOURCE_DATE_EPOCH` demonstrates that environment can materially affect generated artifacts even when source/dependency manifests are unchanged. Reproducibility work therefore supplies empirical failure evidence for undeclared environmental dependencies.
- Nix `allowedReferences` / `allowedRequisites`: outputs and recursive runtime closures can be checked against an allowed dependency set, catching accidental references that static intent did not authorize. This is evidence for negative/containment checks on generated artifacts, not adoption of Nix.
- Open Policy Agent partial evaluation: rules depending directly or indirectly on unknowns are treated differently from independent rules, and optimization/inlining can change where a dependency is visible in the derived policy. This is evidence that generated/partially evaluated artifacts may retain semantic dependency after source-level structure has disappeared.
- Prior G4 research: claim-level dependency lineage, support sets, alternative derivations, correction authority, proof migration, compact closures, guarantee-evidence caching and anti-entropy already define the ownership and requalification boundaries reused here.

No SLSA level, Nix, OPA, build system, tracing system, compiler, graph database or provenance provider is selected.

## 3. Material findings

### 3.1 Dependency completeness is a qualified claim, not a property inferred from having a list

A manifest containing ten dependencies proves only that ten dependencies were recorded. It does not prove that an eleventh material dependency does not exist.

`dependency list present != dependency set complete`.

SLSA's explicit completeness treatment is the strongest precedent: completeness needs a basis and scope. G4 therefore needs lineage coverage evidence rather than a boolean implied by serialization success.

### 3.2 Completeness is scoped to a question and dependency class

An artifact can have complete source/material lineage but incomplete environment, network, plugin or runtime-branch lineage.

`complete for class X != complete for all dependency classes`.

Candidate classes include semantic inputs, generated-source inputs, toolchain/compiler, plugin/adapter, configuration, environment, external/network resolution, runtime data/branch, trust/security material and opaque-provider claims.

### 3.3 Declared, resolved, observed and constrained dependencies are different evidence domains

A useful qualification model separates:

- declared dependencies: what the producer says may matter;
- resolved dependencies: concrete identities selected for one derivation/build;
- observed dependencies: what a particular execution actually accessed;
- constrained dependencies: what isolation/sandbox/policy made possible;
- inferred dependencies: static/data-flow or artifact analysis findings.

`declared == observed` is neither required nor sufficient for completeness.

A constrained execution is stronger evidence about absence than a trace that merely failed to observe access.

### 3.4 Hermeticity narrows the unknown-dependency space but does not prove semantic sufficiency

If an evaluation/build cannot access undeclared filesystem/network/environment inputs, the possible hidden-input set is reduced materially.

`hermetic execution -> stronger dependency-closure evidence`.

But hermeticity does not prove that the declared semantics are correct, that a plugin's internal output is trustworthy, or that all future runtime branches were represented.

`hermetic != semantically complete`.

### 3.5 Reproducibility is useful differential evidence, not dependency-completeness proof

Bit-identical outputs across independently controlled environments increase confidence that unmodeled environmental variation did not affect that artifact instance.

`reproducible result != complete dependency lineage`.

Two builds can reproduce while sharing the same omitted input, same hidden network mirror, same generator bug or same fixed but undeclared environment value.

### 3.6 Environmental state is a real dependency class

Time, timezone, locale, filesystem ordering/metadata, random seeds, host paths and process environment can alter generated outputs. Reproducible Builds documents these repeatedly.

`source unchanged != generated artifact semantically unchanged`.

Therefore environment assumptions that can affect protected semantics need either normalization/constraining or qualified lineage/coverage treatment.

### 3.7 Generated artifacts require lineage through the generator boundary

A generated contract/proof/policy may contain no textual reference to the source semantic claim that shaped it.

`generated output lacks source ref != source dependency disappeared`.

Lineage must cross `source -> generator/profile -> generated artifact`, including generator semantic identity/version and material parameters where relevant.

### 3.8 Generator identity alone is insufficient

The same generator version can produce different semantics from configuration, templates, plugin set, environment or external resolution.

`same generator binary != same derivation semantics`.

A qualified derivation binds the generator plus material inputs/assumptions, not merely a tool name/version.

### 3.9 Partial evaluation can erase visible dependency structure while preserving dependency meaning

Inlining, constant folding, specialization and policy partial evaluation can turn a source dependency into a literal or transformed rule.

`dependency compiled away syntactically != dependency eliminated semantically`.

The derived artifact needs provenance sufficient to reconstruct or conservatively bound which source claims support it.

### 3.10 Dynamic traces are positive evidence, weak negative evidence

A trace can establish that execution E accessed dependency D. Failure to observe D proves little about unexecuted branches.

`observed(D) -> evidence of dependency`.

`not observed(D) != evidence of non-dependency`.

Negative claims need stronger coverage/isolation/static reasoning or explicit conservative disposition.

### 3.11 Branch coverage is not semantic dependency coverage

Even high code coverage may miss value combinations, plugin dispatch, configuration modes or external responses that activate a dependency.

`branch executed != all semantic dependency conditions explored`.

Coverage metrics can qualify evidence but cannot be promoted to proof of exhaustive semantic lineage without a justified completeness argument.

### 3.12 Configuration is part of semantics when it changes dependency selection or guarantees

Feature flags, policy roots, tenant configuration, environment profiles and deployment bindings may select different dependencies.

`same code artifact != same dependency closure in every context`.

Lineage therefore needs context/pinning scope where configuration is material.

### 3.13 Plugins and adapters create an explicit opacity boundary

A plugin may read additional configuration, perform network discovery or translate semantics internally. The host cannot infer completeness merely from the plugin interface.

`plugin contract known != plugin dependency closure known`.

Opaque components require a declared dependency/guarantee contract, constrained execution, attestable provenance, conservative `OPAQUE_DEPENDENCY` disposition, or another qualified basis. Interface compatibility cannot manufacture lineage completeness.

### 3.14 Driver/provider normalization cannot fabricate hidden-dependency absence

A driver can expose a common mechanism but cannot claim that two providers have equivalent hidden inputs or dependency guarantees unless that equivalence is qualified.

`same driver interface != same dependency closure`.

Provider substitution can therefore trigger requalification of provider-specific lineage claims even when the capability contract remains stable.

### 3.15 Negative closure checks complement positive provenance

Nix `allowedReferences`/`allowedRequisites` show that an output can be checked for accidental references outside an allowed closure.

`positive materials list + negative closure constraint > materials list alone` for the covered mechanism.

But absence of forbidden artifact references still does not detect every semantic/environment/network dependency. Negative checks remain mechanism-scoped.

### 3.16 Opaque third-party artifacts need bounded trust rather than invented transparency

When source/generator internals are unavailable, G4 should not synthesize fake lineage. A consumer may rely on a contract/attestation with explicit authority, coverage and currentness, or classify the dependency as opaque/unknown.

`third-party attestation != direct observation`.

`opaque != invalid`, but protected use must respect the guarantee that can actually be established.

### 3.17 Lineage soundness and lineage precision are different

Soundness prioritizes no missing material dependency within the declared proof scope; precision avoids irrelevant dependencies.

`safe over-approximation != precise dependency set`.

For protected effects, bounded over-approximation can be acceptable if its requalification cost is explicit. Under-approximation can silently preserve defeated evidence and is the more dangerous error.

### 3.18 Over-approximation still needs bounds

Marking every capability as depending on everything is technically conservative but operationally destroys selective requalification and can create global storms.

`conservative != unbounded global dependency`.

A useful model needs scope, dependency class, namespace/trust/tenant boundary and a strategy to refine coarse unknown regions.

### 3.19 Completeness can be compositional only when each boundary exports a qualified closure claim

For A -> B -> C, A cannot infer complete lineage through B merely because B lists C. B must expose what dependency classes/guarantees its closure claim covers and which remain opaque.

`component closure claims compose only over compatible coverage semantics`.

Unknown/opaque regions propagate; they cannot be dropped by aggregation.

### 3.20 Lineage evidence has currentness and semantic-version horizons

A plugin, generator, configuration schema or provider can change dependency behavior without changing the consuming artifact's source.

`lineage once complete != lineage complete forever`.

Coverage evidence binds immutable versions/profiles and may require requalification when the dependency-discovery mechanism or opaque contract changes.

### 3.21 Protected requalification can use tiered evidence rather than full recomputation

A correction need not force complete rebuild if lineage coverage is sufficient to prove that the corrected claim is outside the artifact's material dependency closure.

`qualified non-dependency proof -> skip protected recomputation`.

If coverage is insufficient, the disposition is `DEPENDENCY_COVERAGE_INSUFFICIENT / REBUILD_REQUIRED`, not silent reuse.

### 3.22 From-scratch comparison remains a qualification oracle for sampled/prototyped scopes

Fresh rebuild/evaluation under controlled conditions can test whether incremental lineage-based requalification agrees with from-scratch results.

`sampled from-scratch agreement != universal completeness proof`,

but disagreement is a decisive lineage/derivation finding and should defeat the affected qualification until resolved.

### 3.23 Exchange Plane may transport lineage evidence but cannot own dependency truth

The logical Exchange Plane can carry dependency refs, closure claims, coverage, currentness and requalification findings.

`lineage routing != lineage authorship != business ownership`.

Each capability/contract owner remains responsible for the semantic claims it exports; correction authority remains separate from downstream requalification authority.

### 3.24 Portability requires dependency semantics independent of one build/tracing provider

The durable model should be expressible without requiring a particular build graph, sandbox, tracing backend or graph database.

`dependency-lineage semantics != Bazel/Nix/SLSA/OPA binding`.

Future providers may produce different evidence strengths. Unsupported coverage must remain explicit rather than normalized into false equivalence.

## 4. Candidate vocabulary

Research vocabulary only:

- `DependencyCoverageRef` — evidence describing which dependency classes/scopes a lineage claim covers.
- `DependencyCompletenessDisposition` — candidate states such as `QUALIFIED_COMPLETE_FOR_SCOPE`, `CONSERVATIVE_SUPERSET`, `PARTIAL`, `OPAQUE`, `CONTESTED`, `UNKNOWN`.
- `DependencyClass` — semantic, generated-source, toolchain, plugin/adapter, configuration, environment, external-resolution, runtime-data/branch, trust/security, opaque-provider.
- `ResolvedDependencyRef` — concrete dependency identity selected for a derivation instance.
- `DependencyConstraintRef` — sandbox/isolation/policy evidence bounding what inputs could have influenced the derivation.
- `HiddenDependencyFindingRef` — evidence that a material dependency was absent from prior lineage.
- `GeneratorDerivationRef` — source/generator/profile/parameter relation for a generated artifact.
- `OpaqueDependencyRef` — explicit boundary whose internal lineage cannot currently be established directly.
- `NonDependencyEvidenceRef` — qualified evidence that a source claim cannot affect a derived claim within a declared scope.
- `LineageQualificationRef` — result combining declaration, resolution, observation, constraints, static/inferred evidence and coverage assumptions.
- `LineageCurrentnessRef` — horizon/floor binding lineage qualification to relevant generator/plugin/provider/config semantics.
- `LineageRebuildDisposition` — `REUSE_QUALIFIED`, `REQUALIFY`, `REBUILD_REQUIRED`, `UNSUPPORTED`, `CONTESTED`.

These are structural/evidence primitives, not shared business entities or implementation components.

## 5. Candidate proof obligations

1. Presence of a dependency list never implies completeness without a declared coverage basis.
2. Completeness is scoped by dependency class, semantic claim/guarantee, context and derivation identity.
3. Declared, resolved, observed, constrained and inferred dependencies remain distinguishable evidence domains.
4. Hermetic/constrained execution may strengthen absence claims only for the mechanisms it actually excludes.
5. Reproducibility cannot by itself prove dependency completeness or semantic correctness.
6. Material environment inputs are normalized/constrained or represented in lineage/coverage evidence.
7. Generated artifacts preserve qualified lineage through generator/profile/material inputs even when source references disappear.
8. Generator version alone cannot stand in for complete derivation identity when configuration/plugins/environment are material.
9. Partial evaluation/inlining cannot erase material semantic dependency from future requalification lineage.
10. Absence from one or more runtime traces cannot establish non-dependency without a separate completeness argument.
11. Coverage metrics are evidence only within their declared model and cannot silently become exhaustive semantic coverage.
12. Material configuration/deployment bindings participate in dependency identity/currentness where they alter selection or guarantees.
13. Plugin/adapter opacity is explicit; interfaces cannot fabricate dependency closure.
14. Driver/provider substitution cannot inherit hidden-dependency guarantees not established for the selected provider.
15. Negative closure checks are qualified by the mechanism they inspect and cannot be generalized to unseen dependency classes.
16. Third-party/opaque components expose bounded contract/attestation/unknown dispositions rather than invented internal lineage.
17. Protected-use lineage is sound for its declared scope; precision/over-approximation is tracked separately.
18. Conservative supersets remain bounded by namespace/trust/tenant/dependency class and cannot collapse into global dependency on everything.
19. Composed lineage propagates opaque/partial coverage and never strengthens a child's completeness claim by aggregation.
20. Lineage qualification binds versions/profiles/currentness of generators, plugins, provider contracts and discovery mechanisms that can alter dependency behavior.
21. A protected artifact may skip recomputation only when qualified coverage/non-dependency evidence establishes irrelevance of the correction.
22. Insufficient coverage yields explicit requalification/rebuild/unsupported disposition, never silent reuse of prior `VALID` evidence.
23. Exchange Plane transport/aggregation of lineage does not transfer authorship, correction authority or downstream business ownership.
24. Dependency semantics and completeness dispositions remain portable across future build, tracing, sandbox and graph providers.

## 6. Adversarial cases

1. A complete-looking JSON dependency array is treated as exhaustive without any coverage claim.
2. SLSA-like provenance lists source packages but omits a network-fetched generator input; protected evidence is reused after that input changes.
3. Two reproducible builds share the same hidden dependency and reproducibility is promoted to completeness proof.
4. A generated artifact embeds current time/timezone and no environment dependency is recorded.
5. A code generator changes behavior via config while retaining the same binary version; lineage keys only on generator version.
6. Partial evaluation inlines a policy decision and drops the source-policy dependency from derived lineage.
7. A runtime trace never exercises an exceptional branch; absence in trace is treated as proof that the branch dependency cannot matter.
8. High branch coverage is promoted to exhaustive semantic dependency coverage.
9. Feature flag/tenant configuration changes provider selection but dependency closure remains keyed only by source revision.
10. Plugin interface is stable while plugin starts reading a new external service; host declares lineage unchanged.
11. Adapter translates a provider result and silently drops the fact that the provider used weaker/opaque lineage evidence.
12. Driver presents two providers through one interface and claims identical dependency guarantees without qualification.
13. Artifact scanning finds no forbidden path reference and is treated as proof that no network/environment dependency existed.
14. Third-party binary has no source provenance; registry fabricates internal dependencies to make the graph look complete.
15. A dependency attestation is accepted after its generator/plugin semantic version or currentness horizon expired.
16. Over-approximation marks every capability as depending on every correction, producing platform-wide requalification storms.
17. To avoid the storm, scheduler extends semantic freshness and silently reuses stale protected evidence.
18. A composed A->B->C lineage drops B's `OPAQUE` marker and reports A as fully complete.
19. B says its source materials are complete; A interprets that as complete runtime-data dependency coverage.
20. A correction is outside declared source dependencies but inside an unmodeled generated-template dependency; recomputation is skipped.
21. Snapshot/closure compaction removes dependency coverage assumptions, leaving only a digest and `VALID` result.
22. Provider substitution preserves API/schema but changes external-resolution dependencies; old lineage evidence is reused.
23. Exchange Plane centrally declares a hidden dependency absent and consumers treat that as business-semantic authority.
24. A tracing/build provider cannot represent a dependency class and normalizes it to `none` instead of `unsupported/unknown`.

## 7. Implementation-independent hypothesis

A future G4 dependency-lineage qualification model should distinguish the dependency graph itself from evidence about how complete that graph is. The candidate boundary is:

```text
semantic claim / source inputs
  -> declared dependency intent
  -> resolution / generation / evaluation
  -> observed + constrained + inferred dependency evidence
  -> DependencyCoverageRef
  -> LineageQualificationRef
  -> derived artifact / guarantee evidence
  -> later correction
  -> impact test against qualified lineage coverage
  -> REUSE_QUALIFIED | REQUALIFY | REBUILD_REQUIRED | UNSUPPORTED | CONTESTED
```

The key invariant is:

`selective requalification is safe only to the extent that dependency coverage is itself qualified`.

This does not require omniscient tracing. Strong isolation can bound hidden inputs; static declarations can cover normative possibilities; runtime/build observations can provide positive evidence; reproducibility can expose environmental instability; negative closure checks can detect accidental references; and opaque boundaries can remain explicitly opaque. These evidence classes compose only without strengthening beyond their declared coverage.

## 8. Portability / exit path

The durable model must survive replacement of any future build system, sandbox, tracing system, compiler, policy engine, graph store or provenance format. Provider-specific evidence may map into `DependencyCoverageRef`/`LineageQualificationRef`, but unsupported semantics remain explicit. No central dependency oracle is required for autonomous runtimes; locally sufficient lineage/coverage evidence can support bounded requalification offline, subject to the same security/currentness floors researched elsewhere.

## 9. Deduplication

This document does not reopen:

- generic correction authority/federation;
- generic semantic dependency propagation or support-set algebra;
- generic cache invalidation;
- proof-profile portability or bridge qualification;
- supply-chain implementation selection;
- generic reproducible-build engineering;
- provider selection;
- G3 semantic architecture.

The material delta is specifically:

`claim-level dependency lineage -> hidden/dynamic/generated/opaque dependencies -> qualified completeness/coverage -> safe selective requalification without omniscient tracing or full global recomputation`.

## 10. Maturity and next gap

Family 8 remains `RESEARCH_ACTIVE / NON_EXECUTABLE` and not saturated.

The next highest-value gap is **qualification of negative/non-dependency evidence across opaque boundaries**: under what conditions can a capability safely prove that a correction or upstream claim cannot affect a downstream protected guarantee when part of the derivation passes through third-party plugins/providers, generated code or privacy-redacted lineage, without requiring disclosure of proprietary internals and without turning attestation into semantic authority?
