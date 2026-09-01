# Generation 2 — Build / Dependency Graph / Reproducibility — Revisit 01

## Research question
Which remaining boundaries must Generation 2 make explicit so that a portable build definition can be realized through different builders/caches/executors without confusing cache reuse, execution success, output identity, reproducibility or provenance?

## Representatives
1. Bazel remote cache/action model — DEEP.
2. Nix derivations, content-addressed outputs and build trace — DEEP.
3. Docker BuildKit provenance/attestations — DEEP.
4. SLSA Build Provenance v1.x model — DEEP.
5. GitHub Actions artifact attestations — DEEP.

## Evidence/source ledger
- Bazel Remote Caching: https://bazel.build/remote/caching — actions declare inputs, output names, command line and environment; the remote cache separates an action cache from a content-addressable store and safe cross-machine reuse assumes reproducibility.
- Bazel remote-cache debugging: https://bazel.build/versions/8.4.0/remote/cache-remote — identical action IDs, cacheability and execution logs are separate diagnostics; non-hermetic inputs can change action keys.
- Nix derivation/output model: https://releases.nixos.org/nix/nix-2.31.0/manual/store/derivation/index.html and https://releases.nixos.org/nix/nix-2.33.1/manual/store/derivation/outputs/content-address.html — derivation identity, resolved inputs and content-addressed output realization are separable; sandbox/purity guarantees depend on realized environment support.
- Nix build trace: https://releases.nixos.org/nix/nix-2.34.1/manual/store/build-trace.html — memoization maps resolved derivations to realized outputs and explicitly notes ambiguity when inputs are not fully content-addressed/locked.
- Docker BuildKit attestations/provenance: https://docs.docker.com/build/metadata/attestations/ and https://docs.docker.com/build/metadata/attestations/slsa-provenance/ — provenance records parameters, environment, source/materials and is attached through output/driver mechanisms whose support differs by realization path.
- SLSA Build Provenance: https://slsa.dev/spec/v1.2-rc2/build-provenance — `buildDefinition` and `runDetails` are distinct, with resolved dependencies and invocation/run evidence represented separately.
- GitHub artifact attestations: https://docs.github.com/en/actions/how-tos/secure-your-work/use-artifact-attestations/use-artifact-attestations — attestations bind a subject digest to workflow/repository/run provenance and can be verified independently; attestation lifecycle is distinct from workflow-artifact retention.

## Source of truth
The portable build definition and qualified dependency selections remain semantic authority. A cache entry, workflow run, executor, builder-specific graph or provenance service is evidence/realization infrastructure and must not become semantic build authority.

## Identity
Generation 2 should distinguish semantic build target, normalized build definition revision, dependency-resolution revision, action identity, realization source, build attempt, realized output digest and proof/attestation identity. A cache hit may realize an output without a new execution attempt.

## Lifecycle
Definition -> resolution/lock -> graph/action normalization -> environment qualification -> cache lookup and/or execution -> output realization -> verification -> provenance/attestation -> publication handoff. Rebuild/replay creates new attempt/proof lineage even when the semantic target and resulting digest remain unchanged.

## Versioning
Source, portable build definition, dependency closure, resolver/toolchain semantics, platform/environment qualification, provider implementation and output digest are independent dimensions. A lockfile revision alone does not prove that the effective dependency closure and resolver semantics are identical.

## Failure semantics
Distinguish resolution failure, environment unsatisfied, cache miss, cache untrusted/rejected, cache corruption, action execution failure, output verification mismatch, reproducibility mismatch, provenance generation failure and attestation verification failure. A cache hit is neither execution success nor reproducibility proof.

## Extensibility
Provider-specific rule languages, remote execution capabilities and caches remain bounded extensions. Extensions may enrich performance or hermeticity but must declare which portable requirements they satisfy and what evidence they emit.

## Provider boundaries
Builder, executor, cache/CAS, dependency resolver, environment/toolchain realization and attestation service are independently replaceable provider surfaces. Replacement may preserve semantic target identity while creating a new realization/provenance lineage.

## Governance
Policies should separately govern dependency mutability, resolver/toolchain versions, network access, cache trust domain, remote executor identity, privileged build context, secrets, provenance level and reproducibility proof requirements. Accepting cached bytes requires a trust decision distinct from accepting the build definition.

## Observability
Evidence should record definition/action identity, effective dependency closure, declared versus realized environment, realization source (`cache` or `execution`), provider/executor identity, attempt ID when execution occurred, output digest, verification result, provenance identity and timestamps/freshness.

## Portability
Portable intent expresses required build capabilities and proof obligations; it does not require identical Bazel/Nix/BuildKit mechanics. Cross-provider portability is proven when distinct providers satisfy the same declared requirements and resulting output/provenance acceptance, not when their internal graphs are textually equivalent.

## Lock-in
Action-cache formats, Nix store semantics, BuildKit driver/image-store constraints and GitHub attestation storage are provider mechanisms. Durable Generation-2 proof cannot depend exclusively on a provider-retained cache, workflow run or proprietary metadata surface.

## Product-specific mechanism vs universal primitive
Universal primitives: semantic build target; build-definition revision; resolved dependency closure; environment requirement; environment realization evidence; action; realization source; execution attempt; output digest; reproducibility claim/proof; provenance/attestation reference; provider capability claim. Product-specific: Bazel action/CAS protocols, Nix derivations/store paths/build trace, BuildKit LLB/driver semantics, GitHub Actions workflow/attestation storage.

## Convergent patterns
1. Definition identity and run/attempt identity are separate.
2. Cached realization can satisfy an action without a new execution attempt.
3. Reproducibility requires stronger evidence than reusing previously produced bytes.
4. Dependency closure and realized environment must be qualified, not inferred from a project version or lockfile alone.
5. Provenance binds outputs to a build definition/run context but remains separate evidence with its own lifecycle and trust roots.

## Divergent patterns
- Bazel centers action keys and shared action/CAS caches.
- Nix centers derivation/store realization and can make output addressing content-derived.
- BuildKit couples provenance support to output/driver/image-store realization details.
- SLSA is an evidence model rather than a build executor.
- GitHub Actions supplies hosted orchestration and attestation lifecycle, not a portable build-definition language.

## Subcapabilities
Build-definition identity; dependency closure/resolution; action graph; environment qualification; cache trust; execution-attempt lineage; realization-source evidence; output verification; reproducibility replay/proof; provenance linkage; provider replacement.

## Bounded comparison with SB
The first-pass dossier's fresh-main evidence remains the only repository comparison used here: repository build/verify scripts, Node/npm constraints and `package-lock.json` prove concrete deterministic verification and dependency locking, but not a universal Generation-2 build graph, hermeticity contract, remote-cache trust model, reproducibility proof or portable build-provider contract. No new repository claim is inferred in this revisit.

## Reconciliation hypotheses
- KEEP — deterministic verification/build gates already proven useful.
- HARDEN — effective dependency closure, realized-environment evidence, cache trust and durable provenance.
- GENERALIZE — explicit realization-source and reproducibility-proof primitives if repository archaeology confirms cross-runtime need.
- PROVIDERIZE — builder, executor, cache/CAS, resolver and attestation implementation.
- INTEGRATE — SLSA/in-toto-compatible provenance as an evidence interchange option.
- REPLACE — none authorized.
- DEFER — universal build engine choice and byte-for-byte reproducibility mandate for all outputs.
- DO_NOT_BUILD — bespoke remote cache/execution protocol absent unique SB need.

## Repo-validation questions
1. Can current generated artifacts identify effective dependency closure beyond repository lockfile presence?
2. Is cache use observable as a distinct realization source, and is cache trust policy explicit?
3. Is declared toolchain/platform information compared with evidence of the environment that actually built the output?
4. Is there any independent rebuild/replay proof that compares outputs across attempts/providers?
5. Can durable provenance survive CI workflow/artifact retention and be verified outside the SB control plane?
6. Which generated-system build semantics must survive builder/provider replacement?

## Symbiotic Proof
Given one portable build definition and fixed qualified inputs, Generation 2 can realize the declared output through at least two materially different build providers; distinguish cache reuse from actual execution; record the realized environment and provider; preserve semantic target identity while creating provider-specific attempt/provenance lineage; independently verify the output digest; and, when reproducibility is required, perform a second qualified realization whose equivalence rule is explicit rather than inferred from a cache hit.

## Stable findings
- G2-FINDING-BUILD-11 — Cache Hit Is Realization-source Evidence, Not Build-execution Evidence.
- G2-FINDING-BUILD-12 — Reproducibility Requires an Independent Qualified Re-realization Proof, Not Cached Digest Reuse.
- G2-FINDING-BUILD-13 — Remote Cache Acceptance Is a Trust-boundary Decision Separate from Action Identity.
- G2-FINDING-BUILD-14 — Declared Build Environment and Realized Environment Evidence Are Distinct.
- G2-FINDING-BUILD-15 — Lockfile Identity Alone Does Not Prove the Effective Dependency Closure or Resolver Semantics.
- G2-FINDING-BUILD-16 — Build-provider Replacement Preserves Semantic Target Intent but Creates New Realization/Provenance Lineage.

## Capability candidates
- G2-CAPABILITY-CANDIDATE-BUILD-REALIZATION-SOURCE-EVIDENCE — CROSS_CUTTING; evidence: Bazel cache/execution distinction + Nix build trace; promotion condition: recurrence in artifact/deployment proof models.
- G2-CAPABILITY-CANDIDATE-REPRODUCIBILITY-REPLAY-PROOF — CROSS_CUTTING; evidence: Bazel reproducible-cache premise + Nix realization + SLSA definition/run separation; promotion condition: acceptance planning requires reusable cross-provider replay proof.
- G2-CAPABILITY-CANDIDATE-BUILD-ENVIRONMENT-REALIZATION-EVIDENCE — CROSS_CUTTING; evidence: Nix sandbox/system qualification + BuildKit/SLSA environment provenance; promotion condition: deployment/dev-environment synthesis confirms shared realized-environment evidence primitive.

## Value / risk / priority / next question
Value: high for autonomous generated systems, trusted caches and replaceable build infrastructure. Risk: high if cache reuse is mislabeled as execution/reproducibility proof or if lockfile presence is treated as complete dependency identity. Priority: high foundational evidence boundary. Next question: Artifact / Release / SBOM / Provenance should test whether output identity, build provenance, attestation lifecycle and release authority remain separate across publication/provider replacement.