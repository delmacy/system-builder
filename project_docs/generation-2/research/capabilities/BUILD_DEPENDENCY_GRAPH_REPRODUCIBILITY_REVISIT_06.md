# Build / Dependency Graph / Reproducibility — Revisit 6 (Cycle 7)

## Research question
Under mixed build systems, remote execution, caches, mutable dependency services and delegated Station operation, what evidence proves that a build/reproducibility claim applies to a particular source/input/toolchain/platform cohort, remains trustworthy over time and can survive provider substitution without conflating byte identity, semantic conformance, cache reuse or release authority?

## Representatives and evidence/source ledger
1. **Bazel remote caching / remote execution** — action/cache identities are derived from declared inputs and execution configuration, while remote cache/execution remain separate realizations from the build graph. Prior Bazel evidence remains authoritative; this revisit stress-tests provider/currentness and ambiguity boundaries.
2. **Nix sandboxing / reproducibility model** — sandboxing constrains undeclared host dependencies and store closures preserve dependency relationships, but reproducibility claims remain qualified by platform/toolchain/input closure rather than by one global boolean. Prior Nix evidence remains authoritative.
3. **Gradle dependency locking + verification + dependency cache** — locking records resolution results; Gradle explicitly warns that changing dependencies can keep coordinates while content changes. Verification metadata adds checksum/signature evidence, and caches may retain multiple artifacts with identical coordinates but different checksums/repositories. Sources: https://docs.gradle.org/current/userguide/dependency_locking.html ; https://docs.gradle.org/current/userguide/dependency_verification.html ; https://docs.gradle.org/current/userguide/dependency_caching.html
4. **SLSA Build v1.2** — build isolation, ephemeral environments, cache-poisoning resistance and provenance control-plane integrity are independent guarantees. SLSA explicitly distinguishes isolation from hermeticity and requires cached execution not to alter build output. Source: https://slsa.dev/spec/v1.2/build-requirements
5. **GitHub Actions dependency caching** — cache is an optimization distinct from artifacts; restored cache content must be treated as untrusted; low-trust triggers are restricted from writing default-branch cache scopes; cache entries are subject to retention/eviction. Sources: https://docs.github.com/en/actions/concepts/workflows-and-actions/dependency-caching ; https://docs.github.com/en/actions/reference/workflows-and-actions/dependency-caching

## Research-by-exception result
Cycle-6 identities and lifecycle remain valid, but cycle-7 cross-cutting findings require build claims to become explicitly applicability-scoped, revision-qualified and retention-aware. Provider substitution also requires residual cache/worker/resolution cohorts to be dispositioned rather than declaring migration complete when a destination build first succeeds.

## Primitives, source of truth and typed identity
Keep separate identities for `SourceRevision`, `BuildDefinition`, `DependencyIntent`, `ResolutionAttempt`, `DependencyGraphSnapshot`, `LockSnapshot`, `DependencyMaterial`, `ToolchainProfile`, `ExecutionPlatform`, `BuildAttempt`, `CacheEntry`, `BuildOutput`, `BuildEvidence` and later Artifact/Release objects.

No single source of truth spans them. Repository source controls source/build intent; resolver/lock evidence controls a particular dependency resolution; content identities/checksums qualify dependency material; runner/build provider controls execution observations; trusted build control-plane/provenance evidence controls claims about the build; output digests identify produced bytes. Artifact/Release ownership remains downstream and distinct.

## Applicability and revision-qualified conformance
An effective build/reproducibility claim must bind at least: source revision; build-definition revision; dependency intent + resolved graph/lock; material checksums/provenance; toolchain; OS/platform/architecture; declared configuration; hermeticity/network profile; execution provider/runner image; cache trust epoch; proof profile; semantic-conformance policy; and evidence horizon.

`same source`, `same lockfile`, `cache hit`, `successful job` and even `byte-identical output` are narrower facts. They cannot independently establish the full claim.

## Lifecycle and failure semantics
Use `DefinitionAdmitted -> ResolutionAttempted -> ResolutionAccepted -> MaterialsVerified -> EnvironmentQualified -> BuildAttempted -> ExecutionOutcomeReconciled -> OutputProduced -> ByteCompared -> SemanticConformanceEvaluated -> EvidenceSealed -> HandoffEligible`.

`ATTEMPTED`, `ACCEPTED`, `SUCCEEDED`, `FAILED`, `CANCELLED`, `OUTCOME_UNKNOWN`, `BYTE_EQUIVALENT`, `SEMANTICALLY_CONFORMANT`, `INCONCLUSIVE` and `UNAVAILABLE` remain distinct. Remote timeout/lost acknowledgement is `OUTCOME_UNKNOWN` until provider/cache/output observations reconcile the attempt; blind retry can create duplicate outputs/cache entries or obscure which attempt produced evidence.

## Hermeticity, network/provider dependence and cache trust
SLSA Build L3 isolation does not imply hermeticity: external/self-hosted remote execution can sit outside the platform trust boundary, and allowed remote influence must be represented in provenance parameters. Therefore hermeticity is a qualified build property, not inferred from isolation level.

GitHub states that restored cache content is untrusted and cache contents are not signed or verified. Cache-read and cache-write authority remain separate; a cache hit establishes reuse of a scoped entry, not independent reproduction. Cache eviction also creates an evidence/rebuild horizon: a historical cache key may cease to resolve without changing the historical truth of a completed build.

## Dependency resolution, locking and evidence horizon
Gradle confirms that dependency locking stabilizes selected versions but is unsafe as sole proof for changing dependencies whose coordinates stay constant while content changes. Dependency verification adds checksum/signature checks, so lock state and material-integrity state are separate evidence axes. Repository availability, verification metadata, material retention and trust roots each have independent horizons.

## Mixed build-system/toolchain/platform support vector
Portability must be represented as a vector, not `supported=true`: dependency-expression representability; resolver semantics; lock semantics; material verification; hermeticity/network controls; toolchain availability; platform/architecture; remote-execution protocol; cache read/write trust; deterministic-byte behavior; semantic-conformance hooks; provenance quality; offline/air-gap operation; ambiguity reconciliation; and evidence retention.

A replacement provider may support source compilation while failing lock semantics, offline closure, cache isolation or provenance guarantees.

## Provider substitution, dual-build and residual cohort drainage
Cutover requires a qualified dual-build or equivalent comparison on admitted representative inputs, then explicit disposition of old remote workers, cache scopes, mutable resolver/repository state, credentials, queued/running attempts and build cohorts still bound to the source provider/toolchain. Destination success alone does not prove closure. Old cache entries remain untrusted/qualified evidence and must not silently seed the destination trust domain.

## Governance, observability and delegated Station authority
Build authority is faceted: change dependency intent; change resolver/repository; change toolchain; allow network; read/write cache; execute source; access secrets; attest evidence; publish output; promote release. A Station may receive bounded local build authority without inheriting release/deployment or arbitrary dependency/toolchain mutation authority.

Observability must retain typed attempt lineage, resolution graph, material checksums, toolchain/platform, network/hermeticity profile, provider/runner, cache source + trust epoch, output digest, conformance result and evidence retention metadata.

## Local/offline/air-gapped closure and reconnect requalification
A Station can close a local build only inside an admitted material/toolchain closure and delegated proof profile. Offline success does not prove current central dependency policy, revocation/trust state or provider qualification. Reconnect must requalify policy/trust/material/toolchain revisions before privileged publication, cache write-back, attestation acceptance or release handoff.

## Product-specific mechanism vs universal primitive
Product-specific: Bazel action/cache keys; Nix derivations/store paths; Gradle lock and verification metadata; GitHub cache scopes/restore keys; SLSA provenance fields/levels. Universal: typed build lineage, applicability-scoped claims, revision-qualified conformance, material-integrity evidence, trust-separated caches, ambiguity reconciliation, mixed support vectors, evidence/rebuild horizons, provider cutover with residual-cohort drainage and non-amplifying delegated build authority.

## Convergent/divergent patterns
Convergent: stronger repeatability requires declared/verified inputs, qualified environments, isolated trust boundaries, explicit cache semantics and retained evidence. Divergent: representatives disagree on hermeticity, content addressing, network allowance, lock semantics, cache model and what qualifies as reproducible. Generation 2 therefore must preserve capability-specific proof profiles rather than normalize them into one boolean.

## Subcapabilities
Dependency intent/resolution; material integrity/closure; toolchain/platform qualification; hermeticity/network profile; remote execution; cache trust; byte reproducibility; semantic build conformance; evidence retention/replay; provider substitution/dual-build; residual build-cohort drainage; local/offline build closure.

## SB comparison
No claim about current SB implementation is made from external research. Fresh-main repository validation remains required before KEEP/HARDEN/GENERALIZE/PROVIDERIZE/INTEGRATE/REPLACE disposition is accepted.

## Reconciliation hypotheses
- **GENERALIZE** applicability-scoped typed build/reproducibility claims and mixed support vectors.
- **HARDEN** lock/material verification separation, cache trust, outcome ambiguity and evidence horizons.
- **PROVIDERIZE** resolver/repository, runner/remote execution, cache and toolchain realizations.
- **INTEGRATE** Build evidence with Artifact/SBOM/Provenance through typed handoff, never shared identity.
- **DEFER** byte-for-byte reproducibility profiles where the product only requires explicit semantic conformance, while retaining the distinction.
- **DO_NOT_BUILD** a universal bespoke build engine or a cross-provider cache trust fabric absent demonstrated need.

## Repo-validation questions
1. Does fresh main model source/build intent, resolution/lock/material, attempt, output and artifact as separate identities?
2. Can a reproducibility/conformance claim express its applicability/revision vector rather than a global boolean?
3. Are lock state and dependency material checksums/provenance independently retained?
4. Is cache provenance/trust explicit and are cache read/write authorities separable?
5. Can remote `OUTCOME_UNKNOWN` reconcile before retry?
6. Can provider substitution compare representative builds and disposition residual workers/caches/attempts?
7. Can a Station build from a retained offline closure without acquiring dependency/toolchain/release authority?
8. Does reconnect requalify policy/trust/material/toolchain state before privileged handoff?
9. Can AI/AGWS request an admitted build while canonical dependency/toolchain changes escalate to their semantic owners?

## Symbiotic Proof obligations
1. A build claim valid for one source/dependency/toolchain/platform applicability set cannot be reused outside it.
2. Same lock coordinates with changed dependency bytes fail material-equivalence proof.
3. A cache hit proves scoped reuse only; independent reproducibility remains unproven.
4. Untrusted/low-trust execution cannot write a trusted cache scope.
5. Evicted cache or unavailable repository material changes rebuild/evidence availability to `INCONCLUSIVE/UNAVAILABLE`, not historical success.
6. SLSA-style isolation evidence cannot be promoted to hermeticity when network/remote services remain allowed.
7. Remote outcome ambiguity reconciles attempt/cache/output lineage before retry.
8. Provider/toolchain cutover requires representability plus dual-build/equivalent proof and residual worker/cache/attempt cohort disposition.
9. Byte equivalence and semantic conformance are independently reportable.
10. Offline Station closure cannot publish trusted cache/provenance/release evidence until reconnect requalification succeeds.
11. AI/AGWS cannot mutate dependency intent, resolver, toolchain, network allowance or release authority merely by generating a build request.
12. Composite architecture proof rejects stale/incompatible material, cache-trust, platform or evidence horizons.

## Stable findings
- **G2-FINDING-BDGR-45** — Effective build/reproducibility is an applicability-scoped claim across source, build definition, dependency graph/material, toolchain/platform, hermeticity/network profile, provider/cache trust, conformance policy and evidence horizon; no job status, source revision or output digest is globally authoritative.
- **G2-FINDING-BDGR-46** — Source revision, dependency intent, resolution attempt, graph/lock snapshot, dependency material, toolchain, build attempt, cache entry, output and build evidence are distinct typed identities; lifecycle facts at one boundary cannot stand in for another.
- **G2-FINDING-BDGR-47** — Reproducibility/conformance is revision-qualified and profile-relative: byte identity, semantic conformance, isolation and hermeticity are independent claims, and SLSA isolation must not be interpreted as hermeticity.
- **G2-FINDING-BDGR-48** — Dependency locking and material integrity have separate evidence horizons; stable coordinates/lock state cannot prove stable bytes, while expired repositories, verification metadata or trust roots can make later rebuild proof `INCONCLUSIVE/UNAVAILABLE` without rewriting historical truth.
- **G2-FINDING-BDGR-49** — Cache state is trust- and retention-qualified evidence, not reproducibility truth: restored cache content may be untrusted, cache read/write authorities differ, cache hit does not prove independent rebuild, and eviction limits future replay/rebuild evidence.
- **G2-FINDING-BDGR-50** — Build portability is a mixed support vector across dependency/resolution/verification semantics, hermeticity/network controls, toolchain/platform, remote execution, cache trust, byte determinism, semantic-conformance hooks, provenance, offline behavior and evidence retention; binary provider compatibility is unsafe.
- **G2-FINDING-BDGR-51** — Build-provider/toolchain cutover closes only after representability and comparison proof plus explicit drainage/disposition of residual workers, cache scopes, queued/running attempts, resolver state and build cohorts; destination success alone is insufficient.
- **G2-FINDING-BDGR-52** — Qualified local/offline Station builds and AGWS/AI composition are non-amplifying: local closure is limited to delegated material/toolchain/proof profiles, reconnect must requalify policy/trust/material state, and build invocation cannot silently grant dependency/toolchain/cache-write/attestation/release authority.

## Value / risk / priority / next question
**Value:** prevents Generation 2 from presenting provider/job/cache success as portable reproducibility. **Risk:** false supply-chain confidence, cache poisoning, unrepeatable historical releases, incompatible provider migration and authority amplification. **Priority:** HIGH / cross-cutting foundation. **Next question:** Artifact / Release / SBOM / Provenance must test whether applicability, support-vector, evidence-horizon and residual-distribution concepts compose with Build evidence while preserving Artifact/Release semantic ownership.
