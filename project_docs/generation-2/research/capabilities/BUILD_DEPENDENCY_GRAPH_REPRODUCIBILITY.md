# Generation 2 — Build / Dependency Graph / Reproducibility

## Research question
What portable primitives should System Builder Generation 2 use to represent build dependencies, actions, reproducibility requirements, cacheability, execution environment and evidence without making Bazel, Nix, BuildKit, GitHub Actions or a monorepo orchestrator the semantic authority?

## Representatives
- Bazel — explicit target/action graph, declared inputs/outputs, local/remote execution and action/CAS cache.
- Nix — derivations as build-step specifications with explicit inputs/outputs/system and content-addressed store semantics; flakes add a dependency lock graph.
- Docker BuildKit — content-derived build graph/caching, external cache, multi-platform execution and SLSA/SBOM attestations.
- GitHub Actions — CI orchestration, dependency caches, workflow artifacts and signed build provenance attestations.
- Turborepo — monorepo task graph and incremental/remote cache reference; retained as PARTIAL because primary-source coverage was weaker in this pass.

## Evidence/source ledger
Primary sources used in this pass: Bazel remote-caching and remote-execution documentation; Nix 2.28 derivation and flake manuals; Docker BuildKit cache/provenance/SBOM documentation; GitHub Actions cache/artifact-attestation documentation. Turborepo remains a revisit target.

## Source of truth
The portable source of truth should be the declared build graph plus immutable dependency selections and declared execution requirements. A CI workflow, local runner, remote executor or cache is an execution/provider surface, not the build-definition authority.

## Identity
A build target is not an action execution. An action identity must derive from its normalized definition and qualified inputs; an execution/run identity records one attempt to realize that action under a concrete environment/provider.

## Lifecycle
Definition -> dependency resolution/locking -> graph planning -> action execution/cache lookup -> output realization -> verification/attestation -> publication. Cache eviction and CI-run deletion must not erase the semantic definition or required release evidence.

## Versioning
Source revision, dependency lock graph, build-definition revision, toolchain/platform identity and output/artifact revision are distinct version dimensions. A single project version cannot safely substitute for them.

## Failure semantics
Distinguish graph/analysis failure, dependency-resolution failure, action failure, environment/toolchain mismatch, cache corruption/poisoning, non-hermetic divergence, provenance-generation failure and publication failure. Cache miss is not failure.

## Extensibility
Build rules/toolchains/executors should be extensible through bounded provider contracts. Custom build steps remain escape hatches but must declare inputs, outputs, environment assumptions and side effects sufficiently for reproducibility analysis.

## Provider boundaries
Local process, container builder, Bazel remote executor, GitHub-hosted runner and self-hosted runner are providers/execution environments. Cache backend is a separate provider capability. Artifact registry/publication is another boundary.

## Governance
Govern mutable dependencies, unpinned toolchains/images, undeclared network access, secret exposure, cache trust, privileged runners and attestability. Policy may reject a build whose inputs or provenance do not meet the required qualification.

## Observability
Record graph/action IDs, dependency resolution, cache decisions, execution provider, environment/toolchain, input/output digests, status, timing and attestation references. Build logs alone are insufficient provenance.

## Portability
A portable definition must survive provider replacement where required, while admitting provider-specific features explicitly. Nix/Bazel/BuildKit semantics demonstrate that full equivalence across build engines is unrealistic; portability should be requirement/capability based rather than lowest-common-denominator emulation.

## Lock-in
GitHub Actions workflow syntax, Bazel rule APIs, Nix expressions and Dockerfile/BuildKit frontend semantics are useful mechanisms but should not become the universal SB IR. Provider-specific optimizations remain bounded extensions.

## Product-specific mechanism vs universal primitive
Universal primitives: target, dependency edge, action, declared input, declared output, toolchain/environment requirement, dependency selection/lock, execution attempt, cache result, output digest and build provenance. Product-specific mechanisms: Bazel BUILD/Starlark, Nix derivations/flakes, Dockerfile/LLB, GitHub workflow YAML and Turborepo configuration.

## Convergent patterns
1. Explicit dependency graph precedes trustworthy incremental execution.
2. Cache correctness depends on sufficiently complete action inputs/identity.
3. Reproducibility depends on dependency/toolchain/environment qualification, not merely rerunning the same command.
4. Build provenance is evidence about a build, separate from the artifact and from the cache.
5. Remote execution/cache are replaceable infrastructure only when action semantics and trust boundaries are explicit.

## Divergent patterns
- Bazel emphasizes action graph, hermeticity and remote execution/cache.
- Nix pushes build input/output identity and store realization further into the model.
- BuildKit is container/image-centric and couples strongly to OCI output/attestation workflows.
- GitHub Actions is orchestration-centric; caches are explicitly advisory and restored content must be treated as untrusted.
- Turborepo focuses developer-scale task graph/incrementality rather than defining a universal hermetic build model.

## Subcapabilities
Build graph modeling; dependency locking; toolchain/platform qualification; action execution; cacheability; remote execution; generated-code boundaries; build evidence/provenance; reproducibility qualification; build-policy enforcement; output publication handoff.

## Bounded comparison with fresh main
Fresh `main` shows a repository-level `build` script using `tsc -p tsconfig.build.json`, a `verify` chain that runs lint/typecheck/tests/task checks/architecture/build, Node/npm engine constraints, and a committed `package-lock.json`. This proves concrete build/verification and dependency locking exist at repository level, but does not by itself prove a Generation-2 universal build graph, hermetic action model, remote-execution contract, reproducibility qualification or build-provenance model. Hypothesis: KEEP current deterministic verification where useful; HARDEN evidence/locking; GENERALIZE only after repository archaeology proves which build concepts belong in generated-system semantics.

## Hypotheses
- KEEP — existing deterministic verification/build gates where they remain valid.
- HARDEN — dependency/toolchain pinning, cache trust and build evidence.
- GENERALIZE — target/action/input/output/environment/provenance primitives if SB archaeology proves cross-runtime need.
- PROVIDERIZE — execution environment, remote executor/cache and builder implementation.
- INTEGRATE — SLSA/in-toto/SBOM-compatible evidence where release proofs need it.
- REPLACE — none authorized from this research pass.
- DEFER — choosing a universal build engine.
- DO_NOT_BUILD — a bespoke Bazel/Nix equivalent unless later proof shows unique SB value.

## Questions for repo validation
1. What generated-runtime build plans/contracts already exist, and what is their source of truth?
2. Are dependency/toolchain versions pinned in generated artifacts or only in the SB repository?
3. Is generated code committed, derived on demand, or both, and how is lineage proven?
4. What deterministic CI evidence is durable after workflow/artifact retention expires?
5. Are caches used as optimization only, or can they accidentally become correctness authority?
6. Which build inputs currently escape declared manifests/contracts?
7. Can a generated system build without the SB control plane after publication?

## Symbiotic Proof
A Generation-2 build plane is symbiotic when one portable build requirement can execute through at least two materially different builders/execution providers, produces equivalent declared outputs under qualified environments, preserves provider-specific optimization as bounded extension, and emits verifiable evidence linking source/dependency/toolchain/action inputs to output digest without requiring the SB control plane at runtime/build consumption time.

## Stable findings
- G2-FINDING-BUILD-01 — Build Target, Action and Execution Attempt Are Separate Identities.
- G2-FINDING-BUILD-02 — Dependency Graph and Execution Provider Must Be Separate Authorities.
- G2-FINDING-BUILD-03 — Cache Correctness Depends on Complete Qualified Action Inputs.
- G2-FINDING-BUILD-04 — Cache Is an Optimization/Evidence Source, Never Build Authority.
- G2-FINDING-BUILD-05 — Reproducibility Is a Qualified Property, Not a Boolean Claim.
- G2-FINDING-BUILD-06 — Dependency Lock Graph Is Versioned Build Input Evidence.
- G2-FINDING-BUILD-07 — Toolchain and Platform Are First-Class Build Inputs.
- G2-FINDING-BUILD-08 — Generated-Code Lineage Must Cross the Build Boundary.
- G2-FINDING-BUILD-09 — Build Provenance Is Distinct from Artifact Identity and CI Logs.
- G2-FINDING-BUILD-10 — Runtime/Artifact Autonomy Requires Rebuildability Outside the SB Control Plane.

## Capability candidates
- G2-CAPABILITY-CANDIDATE-BUILD-ACTION-IDENTITY — CROSS_CUTTING.
- G2-CAPABILITY-CANDIDATE-REPRODUCIBILITY-QUALIFICATION — CROSS_CUTTING.
- G2-CAPABILITY-CANDIDATE-BUILD-INPUT-PROVENANCE — CROSS_CUTTING.

## Value / risk / priority / next question
Value: very high for autonomous generated systems, replaceable build infrastructure and trustworthy release evidence. Risk: high if provider-specific build semantics leak into portable IR or if cache/reproducibility claims are overstated. Priority: high foundational/cross-cutting research. Next question: Artifact / Release / SBOM / Provenance should test whether build evidence composes into a durable release/artifact provenance chain and whether the three candidates remain distinct.