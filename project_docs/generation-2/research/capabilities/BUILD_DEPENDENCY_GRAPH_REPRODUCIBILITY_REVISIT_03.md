# Generation 2 — Build / Dependency Graph / Reproducibility — Revisit 03

## Research question
How should Generation 2 model source/build-definition identity, dependency-resolution closure, incremental graph invalidation, cache realization, runner/provider replacement and reproducibility evidence so that builds remain portable and governable without treating cache hits, successful execution or one provider's action key as semantic equivalence proof?

## Representatives
1. Bazel remote cache / CAS / action cache / remote execution — DEEP.
2. Bazel sandboxing, repository cache and execution-platform/toolchain model — DEEP.
3. Docker BuildKit reproducible builds and cache invalidation — DEEP.
4. GitHub Actions dependency cache and runner cache semantics — DEEP.
5. Reproducible Builds `SOURCE_DATE_EPOCH` / normalization conventions — DEEP from prior revisit, reconfirmed through BuildKit integration.
6. Nix / flakes and offline closure — DEEP from prior revisit; used as cross-check for qualified local closure rather than re-summarized.

## Evidence/source ledger
- Bazel remote caching: https://bazel.build/remote/caching — remote cache separates an action cache (action-hash -> result metadata) from a content-addressable store (CAS) of outputs; cache storage therefore represents execution realization/evidence, not the semantic build definition itself.
- Bazel repository cache glossary: https://bazel.build/reference/glossary — repository cache is content-addressable and can enable offline builds after initial download when downloads carry SHA-256 checksums.
- Bazel remote-execution sandbox troubleshooting: https://bazel.build/remote/sandbox — remote-style sandboxing constrains actions to explicit inputs/outputs and fresh toolchain containers, surfacing undeclared host-state/tool leakage.
- Bazel remote execution: https://bazel.build/remote/rbe — execution can be moved from local to remote machines; the execution provider is therefore a replaceable realization boundary.
- Docker BuildKit reproducible builds: https://docs.docker.com/build/ci/github-actions/reproducible-builds/ — `SOURCE_DATE_EPOCH` normalizes image/index/config/file timestamps for reproducibility.
- Docker build cache invalidation: https://docs.docker.com/build/cache/invalidation/ — changes to relevant build inputs including `SOURCE_DATE_EPOCH` invalidate affected cache layers, showing that normalization inputs participate in build/cache identity.
- GitHub Actions dependency caching: https://docs.github.com/en/actions/reference/workflows-and-actions/dependency-caching — exact keys produce cache hits, while restore keys may select partial matches and the most recently created matching cache; cache version also depends on path/compression metadata.
- GitHub Actions caching concepts: https://docs.github.com/en/actions/concepts/workflows-and-actions/dependency-caching — restored cache contents must be treated as untrusted input and a job should remain able to regenerate/download data without cache availability.

## Source of truth
The portable `BuildDefinitionRevision`, semantic dependency requirements, permitted toolchain/platform profile and build policy are authoritative. Resolver output, lock/closure revision, action graph, action digest, cache entry, executor/runner identity and output artifact are qualified realizations or evidence. No cache provider, runner or generated UI owns semantic build intent.

## Identity
Distinguish `BuildDefinitionRevision`, `SemanticDependencyRequirement`, `ResolvedDependencyClosureRevision`, `BuildGraphRevision`, `BuildActionRevision`, `ActionExecutionKey`, `ToolchainRevision`, `PlatformQualification`, `CacheRealizationRef`, `BuildAttempt`, `OutputRealization`, `OutputDigest`, `EquivalenceProfile` and `ReproducibilityEvidence`. A provider action hash is not the portable identity of a semantic build action.

## Lifecycle
source/build-definition revision -> dependency resolution -> closure verification -> graph derivation -> graph/action invalidation assessment -> toolchain/platform qualification -> cache lookup -> cache qualification or action execution -> output verification -> independent/replacement-provider realization when required -> equivalence comparison -> provenance/release handoff.

## Versioning
Changes to source, semantic requirements, lock/closure, resolver semantics, graph rule, toolchain, execution platform, normalization profile, security policy or declared environment can create distinct revisions. Cache-key stability alone cannot suppress a required semantic revision or conformance check.

## Failure semantics
Distinguish stale/invalid closure, undeclared dependency, graph under-invalidation, graph over-invalidation, cache miss, cache partial-match, cache poisoning/untrusted cache, cache entry incompatible with current toolchain/platform/profile, undeclared host input, runner/toolchain mismatch, non-hermetic action, execution failure, output-integrity failure and reproducibility/equivalence failure. `cache hit` is never synonymous with `accepted output`.

## Extensibility
Build providers may use Bazel action keys, BuildKit layer keys, Nix derivations/store paths, npm locks or ecosystem-native graph representations. They must project into portable build/action/closure/evidence primitives rather than exporting their provider identity as universal semantics.

## Provider boundaries
Resolver, source/registry, graph builder, executor/runner, sandbox, cache/CAS, toolchain/platform provider and normalization/reproducibility verifier remain separable. Replacement of any of these can preserve semantic build intent while producing new realization lineage that must be validated against the same acceptance profile.

## Governance
Policy bounds allowed dependency sources, integrity/trust roots, toolchains, platforms, network access, native/build-script execution, secret access, cache trust domain, generated dependency classes and accepted equivalence profiles. Cache restoration from broader/partial keys is a policy-relevant event, not an invisible optimization.

## Observability
Record definition/closure/graph revisions, action identity, declared inputs/outputs, invalidation rationale, toolchain/platform profile, cache key/version/provider, exact-vs-partial cache match, cache trust scope, execution provider/runner, hermeticity mode, network/environment observations, attempt, output digest and equivalence/reproducibility verdict.

## Portability
Portable build closure is profile-scoped. A local/offline/air-gapped environment is complete only when all dependencies, source material, toolchains, resolver metadata, trust roots, build rules, normalization inputs and verification mechanisms required by that profile are available locally. A cache is optional realization acceleration, not a hidden portability prerequisite.

## Lock-in
Bazel action digests/CAS, BuildKit layer/cache identities, GitHub cache keys and Nix store paths are product/provider mechanisms. None should become the Generation-2 build identity or migration contract.

## Product-specific mechanism vs universal primitive
Universal: semantic build definition; resolved closure revision; graph/action revision; declared-input set; invalidation evidence; toolchain/platform qualification; cache realization/trust evidence; build attempt; output realization; equivalence profile; reproducibility evidence; qualified local build closure. Product-specific: Bazel action cache/CAS/action hashes, BuildKit layer cache, GitHub Actions cache keys/restore keys, Nix derivation/store mechanisms.

## Convergent patterns
1. Build definition, execution key/cache identity and produced output are distinct identities.
2. Cache reuse is conditional evidence and must not bypass semantic/input/toolchain qualification.
3. Reproducibility is profile-qualified: source/closure equality alone is insufficient when platform/toolchain/normalization differ.
4. Runner/provider replacement creates new realization lineage even when semantic intent is unchanged.
5. Offline closure is stronger when toolchain, resolver/trust material and verification logic are included, not only application packages.

## Divergent patterns
- Bazel makes action graph, declared inputs, CAS and remote execution explicit.
- BuildKit models cache at image/layer build boundaries and exposes timestamp normalization as a build input.
- GitHub Actions offers intentionally coarse user-defined cache keys and partial restore semantics, making cache qualification especially important.
- Nix pushes realization identity deeply into derivation/store mechanics.

## Subcapabilities
Semantic build definition; dependency closure; graph derivation; incremental invalidation; action identity; hermetic execution; toolchain/platform qualification; cache realization/trust; local/offline closure; output equivalence; reproducibility; provider/runner migration; build evidence lineage.

## Bounded comparison with fresh main
A directed fresh-main search for `package-lock reproducible build cache npm ci dependency graph` returned no excerpts in this run. This is bounded negative evidence for that query only and is not repository-wide absence. Prior dossier evidence of Node/npm locking and deterministic verification remains authoritative until PLANNING_B repository archaeology.

## Reconciliation hypotheses
- KEEP — deterministic build/verification paths confirmed later in fresh-main archaeology.
- HARDEN — cache acceptance, graph invalidation and runner/toolchain qualification as explicit evidence.
- GENERALIZE — revision-bound build/closure/graph/action/output lineage and qualified equivalence profile.
- PROVIDERIZE — resolver, graph builder, executor/runner, cache/CAS, toolchain/platform and verifier.
- INTEGRATE — Bazel/BuildKit/Nix/ecosystem-native mechanisms behind portable contracts where useful.
- REPLACE — none authorized by research.
- DEFER — which output classes require byte-identical versus semantic-equivalent reproduction until Product Proof Acceptance.
- DO_NOT_BUILD — proprietary universal cache protocol or package registry absent demonstrated SB-specific need.

## Repo-validation questions
1. Which current build inputs are semantic and which are inferred from host/CI state?
2. Can a cache hit be independently qualified against source/closure/toolchain/platform revisions before output acceptance?
3. Are partial/coarse cache restores possible in current CI and how are restored files treated?
4. Is incremental invalidation derived from declared dependency edges or can generated files/env leak outside the graph?
5. Can the same generated-system definition build on a replacement runner/provider under a declared equivalence profile?
6. Does an offline closure contain package sources only, or also toolchains, resolver metadata, trust roots and verification rules?
7. Are build outputs linked to exact definition/closure/graph/action/toolchain/platform revisions?
8. Can AI-generated changes request dependency/build capability without gaining package/script/network authority?

## Symbiotic Proof
Given one portable generated-system definition, derive a verified dependency closure and build graph, execute through provider A with a cold cache, repeat through the same provider with a qualified cache, then migrate to materially different provider B/runner and an offline closure. All accepted outputs must link to the same semantic definition while preserving distinct realization lineage. A partial/stale/untrusted cache must be rejected or revalidated; undeclared host/network inputs must surface; provider replacement must pass the same explicit equivalence profile; and the offline path must not require hidden central services.

For Adaptive Governed Work Surfaces, a Person-level surface change may trigger a build only within capabilities already exposed by `Enterprise → Station → Role → Person`. If AI determines a new package, plugin, toolchain, build script, network endpoint or renderer capability is needed, it must emit an authority-escalation candidate. A successful build or cache hit cannot grant that authority.

## Stable findings
- **G2-FINDING-BUILD-23** — Semantic Build Definition, Resolved Closure, Build Graph/Action Revision, Provider Execution Key and Output Realization Are Distinct Revision-Bound Identities.
- **G2-FINDING-BUILD-24** — Cache Hit Is Conditional Realization Evidence, Not Semantic Build Equivalence; Exact/Partial Match, Trust Scope and Current Input/Toolchain/Profile Qualification Must Remain Observable.
- **G2-FINDING-BUILD-25** — Incremental Build Correctness Requires Dependency-Edge/Declared-Input Qualified Invalidation Evidence; Stale Cache or Under-Invalidated Graph Success Is Not Conformance.
- **G2-FINDING-BUILD-26** — Runner/Builder/Cache Provider Replacement Is a Governed Migration That Requires Validation, Attempt Lineage and Output Postcondition/Equivalence Evidence Beyond `build succeeded`.
- **G2-FINDING-BUILD-27** — Qualified Local/Offline Build Closure Includes Dependency Content, Resolver Metadata, Toolchains, Build Rules, Trust Roots, Normalization Inputs and Verification Logic Required by the Declared Profile.
- **G2-FINDING-BUILD-28** — AI/AGWS Build Materialization Is Authority-Attenuating: Build Success, Dependency Resolution or Cache Availability Cannot Authorize New Dependencies, Scripts, Tools, Network Access or Station Capabilities.

## Capability candidates
- `G2-CAPABILITY-CANDIDATE-QUALIFIED-BUILD-CACHE-REALIZATION-EVIDENCE` — **CROSS_CUTTING / CANDIDATE_MERGE_TARGET**; likely specialization of unified revision-bound realization evidence + evidence qualification. Confirm in Artifact/Release and Observability.
- `G2-CAPABILITY-CANDIDATE-GOVERNED-BUILD-RUNNER-PROVIDER-MIGRATION-TRANSITION` — **CROSS_CUTTING / CANDIDATE_MERGE_TARGET**; likely specialization of shared governed migration transition. Confirm in Deployment/Lifecycle.
- `G2-CAPABILITY-CANDIDATE-QUALIFIED-LOCAL-BUILD-EXECUTION-CLOSURE` — **CROSS_CUTTING / CANDIDATE_MERGE_TARGET**; likely specialization of qualified local closure profile. Confirm in Artifact/Security/Self-hosting.

No candidate is promoted in this pass.

## Value / risk / priority / next question
Value: critical for autonomous generation, trustworthy CI, provider replacement and air-gapped/self-hosted operation. Risk: critical if cache success, runner success or provider action identity is mistaken for semantic equivalence, or if generated changes amplify build authority. Priority: foundational/high. Next question: Artifact / Release / SBOM / Provenance should test whether build-output/closure/cache/toolchain evidence is durably captured into artifact identity/provenance without allowing release authority to collapse into build authority.