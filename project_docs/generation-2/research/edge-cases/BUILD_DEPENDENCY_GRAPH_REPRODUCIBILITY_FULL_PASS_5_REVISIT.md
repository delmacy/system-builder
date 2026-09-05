# Generation 2 — Build / Dependency Graph / Reproducibility — Full Pass 5 Revisit

Status: FULL PASS 5 — ELIGIBLE NO-NEW-MATERIAL REVISIT / LOCAL STREAK CAPPED AT 2 / CLUSTER STREAK CAPPED AT 2
Capability: Build / Dependency Graph / Reproducibility
Paired cluster: Build × Artifact/Release × Deployment × Runtime
Phase: `RESEARCH_ADVERSARIAL_EDGE_CASE_SATURATION`

Research posture: `CATALOGUE + CLASSIFY + DETECTION_CANDIDATE + FUTURE_REMEDIATION_ROUTE`. This dossier does not authorize target architecture, product implementation, Work Packages, TASKs, Construction or remediation. Preserve `ConflictPattern != ConflictInstance` and `Signal != ConfirmedConflict`.

## 1. Priority hypothesis under challenge

This pass carried the adversarial `Typed Semantic Graph` hypothesis into build semantics without assuming that the graph storage technology is a graph database. The questioned model is: reusable capabilities and capability-use nodes form a typed canonical semantic graph; workflows and subworkflows become executable/composite subgraphs; a build materializes a bounded autonomous runtime subset from that semantic graph.

The research specifically challenged whether a semantically closed graph implies a build-realizable closed dependency set. It does not. A semantic dependency edge may still require target-specific provider binding, platform/toolchain support, conditional dependency resolution, external artifact resolution, policy/trust qualification, secret/config binding or runtime topology. Therefore `semantic dependency closure != qualified build closure`, but this candidate is already covered by existing qualified-effective-identity, provider-support, revision-vector, compatibility-direction and false-convergence families. It does not justify a new ConflictPattern.

`GraphDB` remains only a storage/provider hypothesis. Relational typed graph, JSONB representation, event/journal evidence and optional graph projection remain equally compatible with the semantic-graph research question.

## 2. Technique rotation

This revisit used different probes from the earlier build passes:

- semantic-graph closure mutation: remove or substitute one realization edge while preserving the same logical capability graph;
- graph-revision/lockfile/toolchain/provider pin skew matrices;
- conditional build-closure metamorphism across platform, architecture, feature and provider predicates;
- hidden-input subtraction across environment, host filesystem, network, locale, timezone, clock and generated artifacts;
- cache equivalence mutation where nominal graph identity stays constant but a semantic input changes;
- provenance cut analysis across `buildType`, external/internal parameters, resolved dependencies, builder identity and subject;
- autonomous-runtime subset mutation where a capability exists canonically but is absent, substituted or unsupported in one generated build;
- concurrent build/promotion and stale graph revision interleavings;
- remote build/cache/publication effects classified as `APPLIED / NOT_APPLIED / PARTIAL / UNKNOWN`;
- shared build infrastructure and resource/cardinality pressure;
- conflicting human release procedures;
- AI/low-code supply-chain expansion through new dependencies, providers, plugins, network access or credentials.

All candidates were duplicate-screened against the 119 reusable `G2-CONFLICT-PATTERN-*` families.

## 3. Evidence refresh

Portable evidence continues to reinforce existing classifications:

- SLSA Build Provenance separates `buildType`, `externalParameters`, `internalParameters`, `resolvedDependencies`, `builder.id` and produced `subject`. External parameters must be represented and verified downstream; resolved dependency completeness is still best-effort, and builder identity carries trust/completeness meaning. This supports the distinction between semantic graph identity, effective build inputs, produced bytes and qualified provenance rather than collapsing them into one canonical identity. Source: https://slsa.dev/spec/v1.2-rc2/build-provenance
- Bazel sandboxing documents that filesystem sandboxing exposes known declared inputs in the working directory but does not hide the entire host environment. This is a concrete witness that a nominal dependency graph can remain incomplete with respect to ambient effective inputs unless the build boundary qualifies them. Source: https://bazel.build/versions/8.3.0/docs/sandboxing
- Reproducible Builds documents timestamp and other ambient-input normalization, including `SOURCE_DATE_EPOCH`; reproducible output therefore depends on controlling effective inputs rather than graph shape alone. Sources: https://reproducible-builds.org/docs/timestamps/ and https://reproducible-builds.org/specs/source-date-epoch/

Provider/system mechanisms are evidence examples only and are not promoted to canonical System Builder semantics.

## 4. Duplicate-screened graph/build probes

### 4.1 Semantic closure versus build closure

A capability-use graph can be structurally and semantically valid while one target build lacks the provider, artifact, platform feature, generated dependency or runtime support needed to realize an edge. Treating canonical reachability as build availability would create false dependency closure. Existing provider-support, effective-identity, compatibility and convergence patterns already classify the risk.

Detection candidates: static typed-edge qualification against target build constraints; pre-build provider/platform support qualification; post-build comparison of declared capability closure versus realized artifact/runtime manifest. A mismatch is a signal, not automatic proof of an invalid graph.

### 4.2 Graph revision versus lock/toolchain/provider pinning

A graph revision may be pinned while a lockfile, toolchain image, registry mirror, provider alias or generated dependency floats; conversely the dependency closure may be pinned while semantic definitions evolve. The composed build claim lacks a single qualified revision cut even though each input is individually valid. Existing revision-vector/currentness and effective-input patterns cover the condition.

### 4.3 Cache hit versus semantic equivalence

A cache key can match while omitted semantic inputs differ, including capability revision, provider binding, toolchain, feature predicate, generated schema or environment. Cache success is only a key-match signal, not proof of canonical graph/build equivalence. Existing cache/currentness and qualified-identity patterns cover it.

### 4.4 Reproducible bytes versus semantic/provenance equivalence

Byte-identical artifacts can originate from different graph revisions, builders, dependency evidence, authority contexts or provider bindings. Digest equality does not import semantic ownership, provenance, release eligibility or current deployment authorization. Existing artifact/provenance and qualified-claim patterns cover it.

### 4.5 Conditional dependency divergence

Two builds of the same canonical graph may legitimately have different effective closures because of platform, architecture, feature flags, optional dependencies or provider support. Static analysis must distinguish intended target-specific variation from missing required closure. Existing compatibility-direction, provider-negotiation and false-positive controls cover the distinction.

### 4.6 Autonomous runtime subset and topology drift

An autonomous generated runtime may contain only a target-specific capability subset. Later provider substitution or topology change can make a previously satisfiable semantic edge unsupported without changing the canonical graph. Existing support-vector/currentness, residual-cohort and runtime-convergence patterns cover the risk. Fleet/observability evidence remains non-authoritative unless explicitly adopted by the relevant semantic owner.

### 4.7 Remote effects and concurrent promotion

Remote cache publication, artifact publication or mutable promotion can become `PARTIAL/UNKNOWN`; two successful builds can also race to promote different qualified subjects. Existing ambiguous-effect/idempotency, transition-race, semantic ownership and reconciliation-before-retry patterns cover these conditions.

### 4.8 Resource/cardinality and shared infrastructure

A valid typed dependency graph can drive pathological transitive closure, matrix expansion, multi-platform builds, cache pressure, network fetches or shared-builder saturation. Local validity does not imply bounded enterprise cost/capacity. Existing structural-graph, resource/capacity and objective-conflict patterns cover it.

### 4.9 Human procedure and AI/low-code composition

Individually valid release procedures can conflict over lock refresh, cache bypass, provider substitution, rebuild order or emergency promotion. AI/low-code composition can syntactically preserve a graph while adding dependency sources, credentials, network access or less-trusted builders. Existing human-procedure, temporal/ordering, provider-trust and authority-non-amplification patterns cover the candidates.

## 5. Explicit paired-cluster revisit — Build × Artifact/Release × Deployment × Runtime

The mandatory cluster was explicitly exercised rather than inferred.

- A semantically valid graph does not prove that the released artifact realizes the same qualified capability closure.
- A release-valid artifact does not prove current deployment/runtime eligibility after trust, provider, policy or topology changes.
- Partial deployment can leave residual runtime cohorts whose effective graph differs from declared/released graph truth.
- Directed compatibility may permit forward deployment while forbidding rollback or mixed-cohort operation.
- Runtime health or fleet visibility cannot be promoted to canonical graph convergence without qualified evidence and owner adoption.

All candidates are already covered by existing build/release/deployment/runtime, residual-cohort, compatibility-direction, currentness and false-convergence patterns. No new cross-capability scenario survives duplicate-screen.

## 6. Detection/model-checking candidates

Without converting signals into confirmation, later architecture/proof phases may evaluate:

- typed static closure checking over required/optional/conditional edges;
- target-build satisfiability checks over capability revision × provider × platform × toolchain constraints;
- graph mutation/property-based generation for orphaned or unsatisfied realization edges;
- provenance completeness checks against effective build inputs;
- differential build analysis across target/platform/provider matrices;
- runtime reconciliation comparing declared graph, released subject and observed realized capability set;
- bounded resource/cardinality properties for dependency expansion.

These are detection/proof candidates only; no implementation is created here.

## 7. Preventive invariant candidate disposition

No new preventive invariant is elevated. A universal rule such as “canonical semantic closure must equal every target build closure” would over-constrain legitimate target-specific, provider-specific and conditional realizations. The safer existing obligation is qualification: claims about closure, reproducibility, compatibility, provenance or runtime realization must name the relevant subject/revision/provider/target/evidence cut and must not silently widen a local signal into canonical truth.

## 8. Saturation disposition

Result: **ELIGIBLE NO-NEW-MATERIAL REVISIT**.

- New local edge scenarios: **0**.
- New cross-capability scenarios: **0**.
- New reusable ConflictPatterns: **0**.
- New preventive invariants: **0**.
- Build local no-material streak remains **2**, capped.
- Build × Artifact/Release × Deployment × Runtime cluster streak remains **2**, capped.
- Material inventory remains **284 edge scenarios + 119 ConflictPatterns = 403 material findings**.
- HIGH/CRITICAL findings without owner/proof/detection route remain **0**.
- Full Pass 5 advances to **7/28 capabilities + 6/12 mandatory clusters**.
- Completed full passes remain **4/8 minimum**; target **12**, no maximum.
- Negative-space remains `NOT_STARTED`; saturation remains `NOT_SATURATED`.
- Planning C remains blocked.

Next eligible focus: Artifact / Release / SBOM / Provenance with explicit Enterprise Trust/PKI × Identity × Artifact/Release × provider substitution revisit, after fresh head/state revalidation.