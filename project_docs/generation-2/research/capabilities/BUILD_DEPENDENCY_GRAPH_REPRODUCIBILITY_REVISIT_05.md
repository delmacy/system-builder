# Build / Dependency Graph / Reproducibility — Revisit 5 (Cycle 6)

## Research question
Which identities, ownership boundaries and proof obligations let Generation 2 distinguish a declared build from dependency resolution, execution, cache reuse, produced bytes, semantic conformance and future rebuildability without coupling portable definitions to one build provider?

## Representatives and evidence ledger
1. **Bazel remote cache / remote execution** — action keys and execution logs expose action identity; non-hermetic host inputs alter keys; cache hits are distinct from execution. Source of truth: Bazel documentation.
2. **Nix** — sandboxing limits undeclared filesystem/process/network inputs; derivations/store closures expose dependency materialization and content-addressing concepts. Source of truth: Nix reference manual.
3. **Gradle dependency locking / caches** — lock state pins resolved dependency versions, while changing dependencies can retain coordinates with changing content; dependency and build caches have distinct semantics. Source of truth: Gradle documentation.
4. **SLSA Build v1.2** — provenance, isolation, ephemeral environments and cache-poisoning resistance are supply-chain guarantees distinct from reproducibility itself; verified reproducibility does not solve all source/dependency/distribution threats. Source of truth: SLSA specification.
5. **GitHub Actions dependency caching** — cache is an optimization, restored cache content is untrusted input, and cache write authority is restricted for low-trust triggers. Source of truth: GitHub documentation.

## Source of truth, identity and lifecycle
Canonical identity must remain typed across `BuildDefinition`, `DependencyGraphSnapshot`, `ToolchainProfile`, `ExecutionEnvironment`, `BuildAttempt`, `CacheEntry`, `BuildOutput` and later Artifact/Release identity. Provider run IDs, cache keys and artifact filenames are realizations, not canonical identities.

Lifecycle is therefore not `source -> build -> artifact`, but `DefinitionAdmitted -> DependenciesResolved -> EnvironmentQualified -> AttemptStarted -> ExecutionObserved -> OutputProduced -> SemanticConformanceEvaluated -> ReproducibilityCompared -> HandoffEligible`. Failure or ambiguity at one stage cannot be overwritten by success at another.

## Versioning and effective reproducibility vector
A reproducibility claim is qualified by at least source revision, dependency-graph/lock revision, toolchain revision, build-definition revision, environment/runner image, platform/architecture, relevant configuration/secret references, cache policy/trust epoch and provider realization. Matching source commit alone is insufficient.

## Failure semantics
`REQUEST_ACCEPTED`, `RUNNING`, `SUCCEEDED`, `FAILED`, `CANCELLED`, `OUTCOME_UNKNOWN` and `INCONCLUSIVE` are distinct. A lost remote-runner acknowledgement requires observation/reconciliation before retry because the first attempt may have produced cache/output side effects. Missing historical dependencies or toolchains makes a future rebuild `UNAVAILABLE/INCONCLUSIVE`, not evidence that the historical build was non-reproducible.

## Extensibility and provider boundaries
Portable Build intent should express dependency/material/toolchain/environment requirements and proof obligations. Bazel/Nix/Gradle/GitHub Actions are provider realizations. Provider replacement is allowed only after representability and executable-environment qualification; provider-specific cache/action/run identities remain adapters/evidence.

## Governance, observability and authority
Build authority is faceted: resolve dependencies, access network, read cache, write cache, execute untrusted source, consume secrets, publish output and promote release are separate. GitHub cache restrictions and SLSA cache-poisoning requirements support treating cache-write authority as materially stronger than cache-read. Build observability must retain resolved dependency/material identities, environment/toolchain evidence, cache source, attempt lineage and output digest.

## Portability and lock-in
Byte identity is one proof, not the whole portability contract. A build can produce identical bytes while relying on unavailable historical infrastructure, and can produce non-identical bytes that are semantically acceptable only when an explicit conformance policy says so. Long-term rebuildability requires retained source + dependency/material closure + toolchain/environment realization or a migration proof.

## Product-specific mechanism vs universal primitive
Product-specific: Bazel action cache keys, Nix derivations/store paths, Gradle lockfiles, GitHub cache scopes, SLSA provenance schema. Universal: typed build identities, multi-axis qualification, dependency closure, expected-base/ownership fencing, trust-separated cache read/write, ambiguous-attempt reconciliation, semantic-vs-byte conformance, rebuildability horizon and provider-independent proof joins.

## Convergent and divergent patterns
Convergent: declared dependency material, isolation, immutable/locked inputs, cache qualification and provenance improve repeatability. Divergent: systems differ on hermeticity, network access, content addressing, cache trust and what constitutes reproducibility. Therefore SB must not encode a universal `reproducible=true` detached from profile and evidence.

## Subcapabilities
Dependency graph capture; toolchain/environment qualification; hermeticity profile; cache trust/authority; remote execution reconciliation; byte reproducibility; semantic build conformance; historical rebuild closure; provider substitution; local/offline rebuild closure.

## SB comparison
No product claim is inferred from the research branch. Fresh-main validation remains a later repository-archaeology obligation; this revisit does not treat absence of searched vocabulary as repository-wide absence.

## Reconciliation hypotheses
- **GENERALIZE** typed build/dependency/toolchain/environment/attempt/output identities.
- **HARDEN** dependency and cache ownership/fencing plus ambiguity handling.
- **PROVIDERIZE** runner, remote execution, dependency repository and cache realizations.
- **INTEGRATE** Build evidence with Artifact/Release provenance without collapsing their ownership.
- **DEFER** provider-specific optimizations unless required by accepted proof profiles.
- **DO_NOT_BUILD** a bespoke universal build engine when existing providers satisfy portable contracts.

## Repo-validation questions
Does fresh main already distinguish build definition from attempt/output? Are dependency graphs/locks retained as evidence? Can cache read/write authority be separated? Are runner/toolchain/environment identities explicit? Are ambiguous remote outcomes reconciled? Is artifact promotion independent from build success? Can an offline/self-hosted installation prove dependency/material closure?

## Symbiotic Proof obligations
1. Same source with changed dependency/toolchain/environment cannot inherit prior reproducibility evidence.
2. Locked coordinates with mutable content are detected as insufficient closure.
3. Cache hit proves reuse, not independent rebuild reproducibility.
4. Low-trust build may read an admitted cache but cannot poison trusted cache scope.
5. Lost remote-runner acknowledgement enters `OUTCOME_UNKNOWN` and reconciles before retry.
6. Provider substitution proves environment/toolchain/dependency representability before authority transfer.
7. Byte-identical rebuild and semantic-conformance proof remain distinguishable.
8. Historical rebuild reports `INCONCLUSIVE/UNAVAILABLE` when required material has expired rather than fabricating failure/success.
9. Offline Station build authority cannot gain network/cache-write/release authority through local execution.
10. Composite proof rejects incompatible source/dependency/toolchain/environment/cache epochs.
11. AI/AGWS can request an admitted build but cannot silently widen dependency/network/cache-write/release authority.

## Stable findings
- **G2-FINDING-BDGR-37** — Build identity is typed across definition, dependency graph, toolchain, execution environment, attempt, cache entry and output; provider run/cache/output IDs cannot represent all canonical identities.
- **G2-FINDING-BDGR-38** — Effective reproducibility is a multi-axis evidence vector; matching source revision alone cannot establish equivalent build conditions.
- **G2-FINDING-BDGR-39** — Dependency locking/version coordinates do not prove immutable dependency material; content identity and repository/material provenance remain independent evidence axes.
- **G2-FINDING-BDGR-40** — Cache reuse and independent rebuild are different proofs; a cache hit may establish admitted reuse while providing no independent reproducibility evidence.
- **G2-FINDING-BDGR-41** — Cache read and cache write require distinct trust/authority; shared-cache poisoning can cross build boundaries even when build definitions are unchanged.
- **G2-FINDING-BDGR-42** — Remote build attempts require ambiguity-aware reconciliation; request acknowledgement or timeout cannot determine whether execution/cache/output side effects occurred.
- **G2-FINDING-BDGR-43** — Provider/toolchain substitution requires executable-environment and dependency/material representability before build authority transfers; API compatibility is insufficient.
- **G2-FINDING-BDGR-44** — Long-term rebuildability has a material-retention horizon; missing historical dependencies/toolchains propagate `INCONCLUSIVE/UNAVAILABLE` rather than retroactively changing historical build truth.

## Value / risk / priority / next question
Value: constitutional separation of portable build intent from provider realization and artifact release. Risk: false reproducibility claims, poisoned caches, unrebuildable historical releases and authority amplification. Priority: high cross-cutting foundation. Next question belongs to Artifact / Release / SBOM / Provenance: whether build-output identity and build evidence remain correctly separated from artifact identity, attestations, release promotion and distribution.