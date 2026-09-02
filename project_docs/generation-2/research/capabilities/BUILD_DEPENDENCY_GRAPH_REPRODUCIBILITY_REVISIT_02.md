# Generation 2 — Build / Dependency Graph / Reproducibility — Revisit 02

## Research question
How should Generation 2 distinguish semantic dependency intent, resolved dependency/content identity, permitted generated dependency deltas, action-level hermeticity and reproducibility normalization so that generated systems can build deterministically across online, offline, self-hosted and replacement-provider environments without confusing lock state with integrity or reproducibility proof?

## Representatives
1. Bazel 9.x — Bzlmod lockfile, sandbox/hermetic action model — DEEP.
2. Nix / flakes — pinned inputs, pure evaluation/build and offline store behavior — DEEP.
3. Gradle 9.7 — dependency locking + dependency verification — DEEP.
4. npm package-lock / registry integrity — PARTIAL, focused ecosystem comparison.
5. Reproducible Builds project — deterministic timestamp/archive/environment normalization — DEEP.

## Evidence/source ledger
- Bazel Lockfile: https://bazel.build/external/lockfile — `MODULE.bazel.lock` records module-resolution and extension-evaluation results; `--lockfile_mode=error` fails when state is stale/missing and avoids resolution network requests, while reproducible extensions may still have their own network behavior.
- Bazel Hermeticity / Sandboxing: https://bazel.build/basics/hermeticity and https://bazel.build/docs/sandboxing — hermetic actions must depend only on declared inputs/tools and declared outputs; unsupported/disabled sandbox strategies weaken the guarantee.
- Nix flakes: https://nix.dev/concepts/flakes.html — `flake.nix` declares inputs/outputs, `flake.lock` pins inputs, flakes default toward pure mode and Nix exposes explicit offline operation.
- Nix lockable tarballs: https://nix.dev/manual/nix/2.23/protocols/tarball-fetcher — immutable references can carry content hashes (`narHash`) checked against fetched content, separating reference/pin from content-integrity verification.
- Gradle dependency locking: https://docs.gradle.org/current/userguide/dependency_locking.html — lock state constrains selected versions and fails when resolution differs; changing dependencies can keep coordinates while content changes and are explicitly unsafe assumptions for locking.
- Gradle dependency verification: https://docs.gradle.org/current/userguide/dependency_verification.html — checksums/signatures are a separate verification mechanism from dependency locking and can operate in strict/lenient/off modes.
- npm package locks: https://docs.npmjs.com/cli/v6/configuring-npm/package-locks/ — package lock describes a reproducible `node_modules` tree with resolved references/integrity metadata; useful ecosystem evidence but not a universal build contract.
- Reproducible Builds SOURCE_DATE_EPOCH: https://reproducible-builds.org/docs/source-date-epoch/ — standardized build-time normalization input used to eliminate current-time nondeterminism.
- Reproducible Builds timestamps/archive metadata: https://reproducible-builds.org/docs/timestamps/ and https://reproducible-builds.org/docs/archives/ — timestamps, file ordering, user/group IDs, permissions and paths can create byte differences even when semantic sources/dependencies are unchanged.

## Source of truth
Generation 2 should treat the portable build definition plus qualified semantic dependency requirements and policy as authority. Resolver lock state, provider graph, cache, registry metadata, toolchain installation and generated dependency manifests are realizations/evidence. A generated experience may request only dependency capabilities authorized by its semantic projection; it may not mutate arbitrary package/frontend dependencies as a side effect.

## Identity
Distinguish `SemanticDependencyRequirement`, `ResolvedDependencyNode`, `ResolvedContentIdentity`, `DependencyClosureRevision`, `BuildDefinitionRevision`, `ActionIdentity`, `ToolchainIdentity`, `EnvironmentQualification`, `NormalizationProfile`, `BuildAttempt`, `OutputDigest` and `ReproducibilityProof`. A package coordinate/version and the bytes actually consumed are separate identities.

## Lifecycle
semantic requirements -> resolution -> lock/closure -> content verification -> graph normalization -> policy check -> environment/toolchain qualification -> hermeticity qualification -> cache/execute -> output verification -> optional independent re-realization -> reproducibility comparison -> provenance handoff. Generated-code or generated-surface dependency requests pass through policy before entering the closure.

## Versioning
Changing ranges, resolver semantics, lock entries, integrity/signature evidence, toolchain, platform, normalization profile or generated dependency policy can produce distinct closure/build revisions independently. A lockfile revision does not subsume content-integrity evidence or environmental normalization.

## Failure semantics
Distinguish unresolved dependency, stale lock, resolution drift, integrity/signature failure, forbidden dependency injection, undeclared input, unavailable offline closure member, toolchain mismatch, non-hermetic action, normalization mismatch, cache rejection/corruption, execution failure, output mismatch and reproducibility mismatch. `offline missing input` is evidence that the qualified dependency closure was incomplete for that build environment, not merely a generic network failure.

## Extensibility
Resolvers/builders may expose ecosystem-specific coordinates, rules, toolchains and graph metadata, but providers must map them to portable dependency/build requirements and evidence. Extensions cannot silently add arbitrary transitive capabilities outside declared policy.

## Provider boundaries
Resolver, registry/source provider, integrity-verification mechanism, builder, executor, cache/CAS and normalization/toolchain realization are independently replaceable. Provider replacement must preserve semantic dependency requirements and declared acceptance while allowing a new resolved-content/attempt/proof lineage.

## Governance
Policy should bound allowed registries/sources, mutable dependencies, checksum/signature requirements, toolchains, network access by phase/action, generated dependency classes, native-code execution, build scripts, plugins, secrets and acceptable normalization profiles. AI-generated UI/work-surface changes must not obtain package-manager authority merely because a renderer/provider can install arbitrary packages.

## Observability
Record semantic requirement, resolved node/content digest, origin/registry, lock revision, verification result, transitive closure digest, graph/action identity, declared inputs, observed hermeticity mode, toolchain/environment evidence, network/offline mode, normalization profile, cache/execution source, attempt, output digest and reproducibility comparison.

## Portability
Portable builds should state dependency capability/compatibility requirements rather than one ecosystem's lockfile shape. An offline/self-hosted/air-gapped realization can use mirrored registries, vendored sources, Nix stores or other provider mechanisms if the same qualified closure and integrity requirements are proven.

## Lock-in
Bazel Bzlmod graph/lock structure, Nix flakes/store paths, Gradle lock and verification XML, npm lockfiles and registry signatures are useful provider mechanisms. None should become the Generation-2 portable dependency IR.

## Product-specific mechanism vs universal primitive
Universal primitives: semantic dependency requirement; resolved dependency/content identity; closure revision/digest; integrity evidence; generated-dependency authority; build action; declared input/output set; hermeticity evidence; environment/toolchain qualification; normalization profile; offline-closure proof; output digest; reproducibility comparison. Product-specific: Bzlmod/MODULE lock, Nix flake/store, Gradle lock/verification metadata, npm lockfile and package registry conventions.

## Convergent patterns
1. Resolution/pinning and integrity verification are separable concerns.
2. Hermeticity depends on actual action/input/environment constraints, not a builder brand.
3. Reproducibility requires controlling nondeterministic environmental metadata beyond dependency versions.
4. Dependency closure includes transitive and toolchain/build-time inputs, not only application dependencies.
5. Offline execution exposes hidden network/resolution dependencies and is therefore valuable proof evidence.

## Divergent patterns
- Bazel makes action declarations and sandbox/remote-execution constraints first class.
- Nix pushes purity/content-addressed realization deeply into dependency/environment representation.
- Gradle clearly separates version locking from checksum/signature verification.
- npm packages both resolved-tree and integrity metadata into ecosystem lock state.
- Reproducible Builds focuses on cross-tool nondeterminism normalization rather than dependency resolution.

## Subcapabilities
Semantic dependency requirements; dependency resolution; closure/content identity; integrity/signature verification; graph/action normalization; generated dependency authorization; toolchain/environment qualification; hermetic execution; offline closure; deterministic metadata normalization; cache realization; independent reproducibility proof; provider replacement.

## Bounded comparison with fresh main
A directed search of fresh `main` for `package-lock`, `dependency graph`, `lockfile`, `checksum`, `hermetic` and `reproducible` returned no matching excerpts in this run. This is negative evidence for that search only and is not treated as repository-wide absence. Prior dossier evidence that the repository has concrete Node/npm locking and deterministic verification remains authoritative until repository archaeology in the dedicated planning phase.

## Reconciliation hypotheses
- KEEP — current deterministic build/verification and package-lock based path where repository archaeology confirms it.
- HARDEN — separate resolved-version lock evidence from content-integrity and environment/hermeticity evidence.
- GENERALIZE — semantic dependency requirement, closure digest, normalization profile and generated-dependency authority primitives.
- PROVIDERIZE — resolver, registry/source, integrity verifier, builder, executor, cache and toolchain/environment realization.
- INTEGRATE — ecosystem-native lock/integrity systems and Reproducible Builds normalization conventions where compatible.
- REPLACE — none authorized by research.
- DEFER — mandatory byte-identical reproducibility for output classes where semantic equivalence is more appropriate; decide during acceptance planning.
- DO_NOT_BUILD — bespoke package registry/resolver or general-purpose frontend package marketplace absent a demonstrated SB-specific need.

## Repo-validation questions
1. Does current `main` separate dependency version selection from package-content integrity/trust evidence?
2. Can generated systems declare dependency capabilities without emitting arbitrary package names/scripts?
3. Which generators can add dependencies today and what authority/policy bounds them?
4. Are build actions isolated from undeclared host files, tools, environment variables and network?
5. Can the generated system build from a completely prequalified offline closure?
6. Which timestamps, absolute paths, archive metadata or generated identifiers remain nondeterministic?
7. Is the effective transitive closure digest/evidence preserved with the generated artifact?
8. Can two builder/provider realizations prove equivalence under an explicit normalization/equivalence profile?

## Symbiotic Proof
Given one portable generated-system definition, resolve its authorized semantic dependency requirements through provider A into a verified closure, build under a declared toolchain/environment/normalization profile, then realize the same requirements through materially different provider B or an offline mirror. Both paths must reject unauthorized generated package injection, prove consumed content identities/integrity, expose hidden undeclared inputs as failures, and produce outputs accepted under the same explicit reproducibility/equivalence rule without coupling the portable definition to Bazel, Nix, Gradle or npm mechanics.

For Adaptive Governed Work Surfaces, a Person-level layout/form/list change may alter only semantic component/projection dependencies already permitted by Station/Role policy. If AI concludes that a new renderer/plugin/package capability is required, it must create an authority-escalation request; it cannot silently edit package manifests or inject build scripts.

## Stable findings
- G2-FINDING-BUILD-17 — Resolved Version/Lock Identity and Consumed Content-Integrity Evidence Are Distinct.
- G2-FINDING-BUILD-18 — Effective Dependency Closure Includes Transitive, Toolchain and Build-time Inputs, Not Only Application Packages.
- G2-FINDING-BUILD-19 — Generated Dependency Deltas Require Explicit Semantic Authority and Cannot Be Arbitrary Package Injection.
- G2-FINDING-BUILD-20 — Hermeticity Is an Action/Environment Qualification with Evidence, Not an Inherent Builder Label.
- G2-FINDING-BUILD-21 — Reproducibility Requires an Explicit Normalization/Equivalence Profile for Volatile Metadata and Environment Effects.
- G2-FINDING-BUILD-22 — Offline Build Success Is Evidence of Qualified Closure Completeness; Offline Missing Inputs Reveal Hidden Dependencies.

## Capability candidates
- G2-CAPABILITY-CANDIDATE-VERIFIED-DEPENDENCY-CLOSURE-EVIDENCE — CROSS_CUTTING; evidence: Bazel lock/action inputs + Nix locked/content-verified inputs + Gradle lock/verification separation; promotion condition: Artifact/SBOM, Security and Provider synthesis reuse one closure/integrity proof primitive.
- G2-CAPABILITY-CANDIDATE-GENERATED-DEPENDENCY-AUTHORITY-BOUNDARY — CROSS_CUTTING; evidence: generated-system structural need plus Bazel declared-input/hermetic patterns; promotion condition: UI/AGWS, Extension/Plugin and AI-native synthesis require reusable authority over generated dependency deltas.
- G2-CAPABILITY-CANDIDATE-BUILD-NORMALIZATION-EQUIVALENCE-PROFILE — CROSS_CUTTING; evidence: Reproducible Builds timestamp/archive normalization + cross-provider reproduction requirement; promotion condition: Artifact/Release acceptance needs explicit byte-identical versus semantic-equivalence classes.

## Value / risk / priority / next question
Value: very high for autonomous generation, air-gapped/self-hosted use, supply-chain trust and provider replaceability. Risk: critical if lock state is mistaken for integrity, if generated UI can inject arbitrary packages, or if host/network leakage makes autonomous builds non-portable. Priority: foundational/high. Next question: Artifact / Release / SBOM / Provenance revisit should test whether verified dependency closure, normalization/equivalence profile and build output identity become durable artifact/release evidence without collapsing build authority into release authority.