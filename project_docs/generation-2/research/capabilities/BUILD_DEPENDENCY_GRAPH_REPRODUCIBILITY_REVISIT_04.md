# Generation 2 — Build / Dependency Graph / Reproducibility — Revisit 04

## Research question
How should Generation 2 distinguish semantic build intent, resolved dependency closure, execution/toolchain realization, cache reuse and produced-artifact evidence so that incremental/remote/offline builds remain reproducible, provider-replaceable and non-amplifying, while ambiguous runner outcomes, hidden dependencies and partial reproducibility are represented explicitly rather than collapsed into `build succeeded`?

## Representatives
1. Bazel remote execution/cache model — carried forward DEEP from revisit 03 as graph/action/CAS baseline.
2. Docker BuildKit cache/reproducibility semantics — DEEP.
3. SLSA Build v1.2 provenance/isolation requirements — DEEP.
4. Gradle build cache and byte-for-byte reproducibility guidance — DEEP.
5. Nix functional derivation/build-environment model — DEEP cross-check.
6. Reproducible Builds project (`SOURCE_DATE_EPOCH`, archive/system-image normalization) — DEEP.
7. 2025 ICSE empirical study of reproducible packaging across six ecosystems — DEEP scientific evidence.
8. 2024–2026 reproducibility studies on Nix/build environments, Docker and incremental dependency errors — PARTIAL/DEEP scientific challenge evidence.

## Evidence/source ledger
- SLSA Build v1.2: provenance must identify build definition/run details; stronger levels require isolated execution, enumerate external parameters and resist cache poisoning. The specification explicitly states that overlapping or prior builds must not influence a build and that cache use must not change output semantics.
- BuildKit: regular layer-cache reuse depends on exact relevant instruction/input matching; cache mounts are persistent across builds; secrets do not participate in cache invalidation by value; `SOURCE_DATE_EPOCH` may affect cache invalidation and output timestamp normalization.
- Gradle: local/remote build caches reuse outputs across workspaces/agents; guidance states reproducible outputs should be byte-for-byte identical and identifies timestamps, archive ordering and SDK/toolchain choice as nondeterministic inputs.
- Reproducible Builds: `SOURCE_DATE_EPOCH` is a standardized normalization input; timestamps, archive ordering, uid/gid/permissions, filesystem UUIDs and other environmental metadata can defeat reproducibility.
- Nix: derivations model build outputs as functions of declared inputs and isolate outputs under immutable store paths, providing strong evidence that build-environment identity and dependency closure must be first-class.
- ICSE 2025 empirical packaging study: reproducibility rates vary substantially across npm/Maven/PyPI/Go/RubyGems/Cargo, but infrastructure/tooling changes can greatly improve reproducibility. This supports treating reproducibility as a governed capability/proof rather than an ecosystem assumption.
- 2024 build-environment study: historical Nix data demonstrated very high rebuildability across time, supporting explicit environment closure as part of reproducibility evidence.
- 2024 incremental-build dependency-error research: missing/redundant build dependencies can invalidate incremental correctness, confirming that a successful partial build is not proof that the dependency graph was complete.
- 2026 Docker reproducibility study: containerization alone does not guarantee bitwise or long-term rebuild reproducibility; this challenges any assumption that a container image/Dockerfile is itself sufficient closure evidence.

## Source of truth
`BuildDefinitionRevision` plus semantic dependency requirements and build policy remain authoritative. A lock/closure, derived graph, toolchain/environment, runner, cache entry, build attempt and artifact output are realizations/evidence. Artifact/Release remains semantic owner of release identity/provenance consumption; Build owns production evidence up to the handoff boundary.

## Identity
Distinguish at minimum:
- `BuildDefinitionRevision`
- `DependencyRequirementRevision`
- `ResolvedDependencyClosureRevision`
- `BuildGraphRevision`
- `BuildActionRevision`
- `BuildEnvironmentProfileRevision`
- `ToolchainRevision`
- `RunnerProviderRevision`
- `CacheNamespace/EntryRevision`
- `BuildAttempt`
- `ExecutionOutcomeEvidence`
- `OutputRealization`
- `OutputDigest`
- `ReproducibilityProfile`
- `ReproducibilityObservation`

A lockfile, provider action digest, container image tag or cache key is never the canonical semantic build identity.

## Lifecycle
accepted build definition -> dependency resolution/lock closure -> graph derivation -> environment/toolchain qualification -> cache lookup -> cache qualification or action execution -> runner acknowledgement/reconciliation -> output verification -> reproducibility observation/independent rebuild when required -> Artifact/Release handoff.

Each stage can be `ATTEMPTED`, `ACCEPTED`, `EFFECTIVE`, `VALIDATED`, `PARTIAL`, `FAILED`, `OUTCOME_UNKNOWN` or `INCONCLUSIVE` as appropriate. Later success must not erase earlier ambiguous/partial evidence.

## Versioning
A new revision can be induced by source, dependency requirements, resolver semantics, lock/closure, graph rules, build options, environment variables, locale/timezone, toolchain/SDK, normalization profile, network policy, runner image/provider, cache trust domain or build policy. Reproducibility claims must bind the exact revision vector used for comparison.

## Failure semantics
Explicitly distinguish:
- incomplete/stale lock or dependency closure;
- hidden host/network/runtime dependency;
- graph under-invalidation or over-invalidation;
- stale, poisoned or trust-domain-incompatible cache;
- partial cache restore used as if exact;
- toolchain/environment mismatch;
- non-hermetic execution;
- runner accepted but acknowledgement lost (`OUTCOME_UNKNOWN`);
- runner reports success but output retrieval/integrity is incomplete;
- byte mismatch with semantic conformance retained;
- semantic mismatch despite technically successful build;
- rebuild unavailable because required historical dependency/toolchain material is missing;
- offline closure incomplete;
- provenance/SBOM handoff incomplete.

## Extensibility and provider boundaries
Keep resolver, registry/source mirror, graph engine, executor/runner, sandbox, toolchain provider, cache/CAS, normalization layer, reproducibility verifier and provenance exporter replaceable. Provider-native action hashes, layer digests, derivations and cache keys remain adapter mechanisms. Provider substitution requires new realization lineage and requalification, not canonical identity migration.

## Governance
Policy must define allowed dependency sources, mutable-vs-immutable references, network access, build scripts/native code, secrets, toolchain families, runner trust, cache read/write trust domains, normalization inputs, reproducibility strength and acceptance criteria. Cache write authority is materially stronger than cache read authority because poisoning can affect downstream builders.

AI/AGWS may propose or materialize only within existing `Enterprise → Station → Role → Person` authority. Discovery of a new dependency, build script, network endpoint, privileged toolchain or cache-write capability requires explicit escalation; successful resolution/build cannot grant it retroactively.

## Observability
Record the complete revision vector, dependency-resolution evidence, graph derivation and invalidation rationale, environment/toolchain/runner identity, cache lookup/match/trust/write events, execution attempt/acknowledgement, ambiguous outcomes, produced digests, reproducibility comparison mode, independent-builder identity where used, and handoff evidence to Artifact/Release.

## Portability / qualified local closure
Offline/air-gapped build closure is sufficient only if it contains or can verify all required source/dependency content, resolver metadata, lock/graph inputs, toolchains/SDKs, build rules, normalization inputs, trust roots, cache-independent execution capability and output verification logic. A warm cache alone is not closure. Long-term rebuildability is a separate evidence dimension from same-day reproducibility.

## Product-specific mechanism vs universal primitive
Universal: semantic build-definition identity; dependency closure revision; graph/action revision; environment/toolchain profile; runner realization; cache trust/qualification; attempt/effective/validated evidence; ambiguous-outcome reconciliation; reproducibility profile/observation; qualified local build closure.

Product-specific: Bazel action/CAS keys, BuildKit layer/cache keys, Gradle task cache keys, Nix derivation/store identities, Docker image tags/digests as build-engine mechanisms.

## Convergent patterns
1. Reproducibility is stronger than repeatable command execution and must bind environment/toolchain/dependency closure.
2. Cache is a performance realization whose trust and correctness must be independently qualified.
3. Incremental correctness depends on complete dependency edges; successful partial execution cannot prove graph completeness.
4. Builder/runner identity and isolation matter to provenance and cross-build influence.
5. Reproducibility is not binary across all artifact classes; byte identity, rebuildability and semantic conformance are distinct claims.
6. Long-term reproduction requires retained historical closure, not merely a build definition.

## Divergent patterns
- Bazel exposes action-graph/CAS semantics directly.
- BuildKit provides practical layer/cache and timestamp-normalization controls but containerization itself does not guarantee reproducibility.
- Gradle emphasizes task-level cacheability and reproducible archive/JVM outputs.
- Nix treats environment/dependency closure as a functional derivation property.
- SLSA focuses on trustworthy provenance/isolation and does not equate provenance with verified reproducibility.

## Subcapabilities
Semantic build definition; dependency closure; graph derivation; incremental invalidation; hermetic execution; environment/toolchain qualification; runner/provider realization; cache trust; ambiguous execution reconciliation; reproducibility verification; long-term rebuildability; local closure; Artifact/Release handoff.

## Reconciliation hypotheses
- **KEEP** — deterministic build/verification mechanisms confirmed during later repository archaeology.
- **HARDEN** — complete revision-vector evidence, cache trust/write authority, ambiguous runner reconciliation and incremental dependency correctness.
- **GENERALIZE** — build attempt/effective/validated states and reproducibility profiles across build providers.
- **PROVIDERIZE** — resolver, executor/runner, cache/CAS, toolchain/environment, verifier and provenance exporter.
- **INTEGRATE** — SLSA/in-toto provenance, ecosystem-native lock/graph/build engines and reproducible-build conventions where they satisfy portable contracts.
- **REPLACE** — none authorized by external research.
- **DEFER** — exact byte-equivalence requirements by artifact class to Product Proof Acceptance.
- **DO_NOT_BUILD** — proprietary universal package/cache protocol absent demonstrated need.

## Repo-validation questions
1. Which build inputs currently come from host/runner state rather than declared definition/lock/toolchain metadata?
2. Can current CI distinguish exact cache hit, partial restore and regenerated outputs?
3. Who has cache write authority, and can untrusted branches/tenants poison shared caches?
4. Is incremental invalidation derived from a complete declared graph or can generated/implicit dependencies escape it?
5. Are build attempts and remote-runner acknowledgements assigned stable IDs enabling post-timeout reconciliation?
6. Can an output be linked to exact source/lock/graph/toolchain/runner/cache revisions?
7. What artifact classes require byte-for-byte reproducibility versus semantic conformance?
8. Can an older accepted system be rebuilt months/years later without undeclared network/toolchain dependencies?
9. Does offline build closure function with cache disabled?
10. Can AI propose dependency/build changes without gaining package/script/network/cache-write/release authority?

## Architecture proof-backfill obligations
1. **Cache poisoning proof:** inject output into a shared cache under an apparently valid lookup key; accepted build must reject or independently qualify it and expose trust lineage.
2. **Graph under-invalidation proof:** alter an undeclared dependency after a prior cache/incremental build. Build must detect invalidation gap or mark correctness `INCONCLUSIVE`; stale success cannot count as conformance.
3. **Runner ambiguity proof:** lose acknowledgement after remote execution may have completed. State becomes `OUTCOME_UNKNOWN`; blind duplicate actuation is forbidden until output/attempt identity reconciliation.
4. **Environment/toolchain substitution proof:** rebuild same semantic definition under materially different qualified runner/toolchain provider; canonical identity remains stable while realization evidence differs.
5. **Byte-vs-semantic proof:** produce outputs that are semantically equivalent but byte-different and prove the acceptance profile distinguishes the two claims rather than flattening them.
6. **Long-term rebuildability proof:** rebuild retained historical definition using declared closure; remove one historical toolchain/dependency artifact and require explicit unavailable/`INCONCLUSIVE` rather than silent latest-version substitution.
7. **Offline closure proof:** build with network and cache disabled from a declared local closure; remove one trust/resolver/toolchain dependency and require failure/`INCONCLUSIVE`, never hidden online fallback.
8. **Authority proof:** ask AGWS/AI to introduce an undeclared package, build script, network endpoint or cache-write privilege. Candidate may be proposed/escalated but cannot execute without explicit authority.
9. **Provenance handoff proof:** build output exists but provenance/SBOM handoff evidence is absent or incomplete. Build success remains true while Artifact/Release readiness remains `INCONCLUSIVE`/not ready.
10. **Independent reproducibility proof:** compare two independent builders and preserve builder identity plus comparison evidence; agreement strengthens reproducibility evidence but does not by itself prove source/dependency/distribution trust.

## Stable findings
- **G2-FINDING-BUILD-29** — Build Definition, Resolved Closure, Graph, Environment/Toolchain, Runner, Cache Realization, Attempt and Output Are Distinct Revision-Bound Identities; One `build version` Cannot Represent Them Safely.
- **G2-FINDING-BUILD-30** — Reproducibility Is a Qualified Multi-dimensional Claim: Byte Identity, Semantic Conformance and Long-term Rebuildability Must Be Recorded Separately Against an Explicit Reproducibility Profile.
- **G2-FINDING-BUILD-31** — Incremental/Cache Success Is Not Correctness Evidence Unless Dependency Completeness and Invalidation Preconditions Are Qualified; Missing Dependency Edges Can Produce Apparently Successful Stale Outputs.
- **G2-FINDING-BUILD-32** — Cache Read and Cache Write Have Different Security Semantics; Shared Cache Write Requires Explicit Trust/Isolation Because Poisoned Entries Can Cross Build Boundaries.
- **G2-FINDING-BUILD-33** — Remote Builder Acknowledgement Loss Creates an Ambiguous Execution Outcome; Build Must Reconcile Attempt/Output Identity Before Retry or Duplicate Actuation.
- **G2-FINDING-BUILD-34** — Containerization or Runner Image Pinning Alone Does Not Prove Reproducibility; Hidden Network, Time, Toolchain, Filesystem and Dependency Inputs Remain Material Evidence Dimensions.
- **G2-FINDING-BUILD-35** — Qualified Local Build Closure Must Be Cache-independent and Include Historical Toolchain/Resolver/Trust/Dependency Material Required for Long-term Rebuildability, Not Merely Current Package Content.
- **G2-FINDING-BUILD-36** — Build Success and Reproducibility Evidence Do Not Grant Release, Dependency, Network, Cache-write or AGWS/AI Authority; Artifact/Release Handoff and Authority Remain Separate Owners.

## Capability candidates
- `G2-CAPABILITY-CANDIDATE-BUILD-REPRODUCIBILITY-PROFILE-AND-OBSERVATION` — **CROSS_CUTTING / CONSOLIDATION_CANDIDATE**; reconcile with shared evidence qualification while keeping Build as owner of build-specific comparison semantics.
- `G2-CAPABILITY-CANDIDATE-BUILD-CACHE-TRUST-AND-WRITE-AUTHORITY` — **CORE / SUBCAPABILITY_CANDIDATE**; likely remains under Build/Supply-chain governance because cache write can cross build boundaries.
- `G2-CAPABILITY-CANDIDATE-BUILD-AMBIGUOUS-RUNNER-OUTCOME-RECONCILIATION` — **CROSS_CUTTING / CONSOLIDATION_CANDIDATE**; merge with universal ambiguous-outcome primitive while preserving build-attempt/output identity.
- `G2-CAPABILITY-CANDIDATE-BUILD-LONG-TERM-REBUILDABILITY-CLOSURE` — **CROSS_CUTTING / CONSOLIDATION_CANDIDATE**; reconcile with qualified local closure plus lifecycle/artifact-retention semantics.

No candidate is promoted in this pass.

## Symbiotic Proof
Given one accepted System Builder definition, derive an explicit dependency/build closure, perform a cold clean build, a cache-backed incremental build, a remote-runner build, an independent-provider rebuild and an offline cache-disabled rebuild. Canonical semantic identity must remain stable; each realization must retain exact revision/attempt/provider/cache lineage. Inject one missing dependency edge, one poisoned cache entry, one lost remote acknowledgement and one byte-level nondeterminism source. The system must produce explicit stale/ambiguous/non-reproducible evidence rather than `PASS`. Finally, an AGWS/AI request for a new dependency or cache-write privilege must stop at proposal/escalation unless authority exists.

## Value / risk / priority / next question
Value: foundational for trustworthy autonomous generation, deterministic CI, provider substitution, supply-chain integrity and durable self-hosting. Risk: critical if cache/runner/container success is mistaken for reproducibility or if build capability becomes an authority amplifier. Priority: foundational/high. Next question: Artifact / Release / SBOM / Provenance should consume build evidence and test whether artifact identity, attestation, promotion and rollback preserve these distinctions without making release semantics a hidden extension of the build engine.
