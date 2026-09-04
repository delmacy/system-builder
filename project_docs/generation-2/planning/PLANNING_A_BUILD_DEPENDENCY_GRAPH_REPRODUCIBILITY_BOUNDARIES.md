# Planning A — Build / Dependency Graph / Reproducibility Boundaries

Status: PASS_FOR_CAPABILITY
Phase: PLANNING_A_TAXONOMY_BOUNDARIES
Canonical capability: Build / Dependency Graph / Reproducibility

This artifact defines semantic ownership and boundaries only. It makes no claim about current System Builder implementation and performs no Planning B archaeology, product code, Work Package, TASK, Construction, PR, or worker handoff.

## 1. Semantic ownership

Build / Dependency Graph / Reproducibility owns the portable semantics by which a revisioned set of source/build inputs is closed over dependencies and transformed by a qualified build recipe/toolchain/runner into build outputs whose identity, integrity and reproducibility claims can be evaluated without canonizing one CI service, package manager, compiler, image builder or runtime topology.

Its source of truth includes:

- canonical `BuildInputIdentity` / `MaterialIdentity`, distinct from filesystem paths, registry coordinates, cache keys and provider run IDs;
- dependency graph and transitive closure identity, including declared direct dependencies, resolved versions/revisions, integrity facts, provenance references and optional/conditional edges;
- revisioned build recipe, toolchain, platform/target and runner qualification inputs;
- explicit network, environment, filesystem, clock/randomness and secret/configuration boundaries relevant to hermeticity or controlled impurity;
- build-attempt identity and lineage from declared inputs to accepted execution, produced outputs and post-build validation;
- deterministic/reproducible-build claims scoped by exact input/material graph, recipe/toolchain/runner constraints and evidence horizon;
- cache identity, provenance, applicability and currentness qualification, including when a cache result may or may not substitute execution;
- rebuild/replay evidence capable of demonstrating equivalent outputs under a declared reproducibility profile;
- provider/runner/toolchain substitution qualification and coexistence where result equivalence must be proven;
- workload-driven minimal runtime closure inputs as a build-owned declaration of what the produced workload requires, without owning runtime placement or deployment effectiveness.

Build output identity is not automatically a Release identity and is not proof of a deployed/effective runtime. Those truths remain separate.

## 2. Canonical materials and dependency closure

A dependency graph is a semantic graph over canonical material identities and qualified edges, not merely a lockfile text blob or package-manager-native graph. Provider/package-manager coordinates remain realization identities unless explicitly adopted through a governed transition.

Dependency closure must make transitive and conditional inputs explicit enough to support integrity, reproducibility, portability and later provenance. Undeclared inputs that can change output are either forbidden by the declared hermeticity profile or recorded as controlled impurity/evidence that weakens the reproducibility claim.

Graph identity must distinguish at minimum:

- declared dependency intent;
- resolved dependency/material revision;
- integrity/digest evidence where applicable;
- platform/target/feature conditions affecting resolution;
- source/generated/toolchain materials that participate in the build;
- excluded or unavailable edges when a partial closure is accepted under an explicitly weaker profile.

A filename, package name, image tag or provider cache key alone is insufficient canonical material identity.

## 3. Build recipe, toolchain and runner revision

Reproducibility depends on more than application source. A build claim is applicability-scoped to a revision vector that can include source revision, dependency closure revision, build recipe, toolchain/compiler/interpreter, target platform, runner environment, relevant configuration references and declared external inputs.

Runner/provider identity is realization metadata. Replacing GitHub Actions, a local runner, a container builder, Nix, Bazel, a package manager or another execution substrate must not change canonical build identity merely because execution moved, though support qualification may reveal non-equivalent semantics.

Toolchain substitution must be treated as a potentially material revision unless equivalence is proven for the applicable build profile.

## 4. Build lineage and truth separation

Portable lineage distinguishes at minimum:

`declared inputs → dependency closure resolved → build attempted → runner/provider accepted → execution completed → outputs produced → outputs validated → reproducibility claim evaluated`

These facts must not be collapsed. Runner success does not prove output integrity; one matching digest does not by itself prove general reproducibility; a build output does not become a released artifact merely because it exists; a released artifact does not prove deployment; deployment acknowledgement does not prove effective runtime.

The canonical truth separation is therefore:

`build result ≠ released artifact ≠ deployed state ≠ consumer/runtime-effective state`.

Each adjacent owner may reference the prior owner's evidence without absorbing its source of truth.

## 5. Determinism and reproducibility claims

Determinism/reproducibility is an applicability-scoped qualified claim, not a binary platform adjective. A claim records the exact producing revision vector, subject/output set, runner/toolchain qualification, environmental boundaries, evidence population and evidence horizon.

Useful claim classes may include exact byte-for-byte equivalence, semantically equivalent normalized output, or intentionally weaker repeatability profiles. The capability does not require one universal reproducibility grade; the applicable contract defines what equivalence means.

Two builds matching only by filename, tag or one externally supplied hash do not establish reproducibility unless the material/input closure and producing profile are independently qualified. Conversely, a deliberate nondeterministic field may be normalized only if that normalization is explicit, reviewable and cannot erase security/provenance-relevant differences.

Missing, stale, partial or contradictory evidence produces `INCONCLUSIVE`, never an implicit reproducibility PASS.

## 6. Cache qualification and currentness

Caches are optimization realizations, not canonical truth. A cache hit may substitute build work only when its key/identity, producing revision vector, integrity, provenance, support profile and currentness remain applicable to the requested build.

Cache currentness is bounded. Changes to dependency resolution policy, revoked materials, toolchain qualification, security policy, build recipe, target platform, secrets/configuration constraints or provider support can invalidate an otherwise matching cache key.

Residual caches from old providers/runners may persist after migration but must be prevented from producing authoritative results unless still qualified. Cache eviction success is separate from proof that no authoritative stale cache remains usable.

Where remote cache creation/update/delete/pruning has an ambiguous mutating outcome, use `APPLIED / NOT_APPLIED / PARTIAL / UNKNOWN`; `UNKNOWN` requires reconcile-before-retry unless operation-specific idempotency is explicitly qualified.

## 7. Hermeticity, controlled impurity and network/input boundaries

Hermeticity is a declared support profile. A hermetic build must enumerate and fence inputs such that undeclared network, filesystem, environment, clock/randomness or mutable registry state cannot silently influence the result.

Where fully hermetic execution is impractical, controlled impurity is explicit: the external source, identity, observation/currentness rule and resulting weaker reproducibility claim are recorded. Network availability alone never implies that fetched content is a stable build input.

Secret/configuration references may participate in build execution where unavoidable, but values should not become canonical material identity by default and sensitive values must not be leaked into public provenance or cache identity. Secrets / Configuration owns their resolution/currentness semantics.

## 8. Partial, failed and ambiguous build outcomes

Required distinguishable outcomes include:

- dependency graph unresolved or only partially closed;
- material unavailable, integrity-invalid or revoked;
- runner/provider rejected before execution;
- execution failed before outputs;
- some outputs produced but build completion failed;
- outputs produced but validation/integrity evidence incomplete;
- cache hit accepted but provenance/currentness later found insufficient;
- remote execution result lost/ambiguous after possible output creation;
- output sets disagree across rebuilds;
- provider/toolchain substitution yields unsupported or degraded semantics.

A build system must not infer `NOT_APPLIED` merely because a remote response was lost. When remote execution/cache operations can leave authoritative state, ambiguous mutations/effects use `UNKNOWN` and reconcile-before-retry unless exact idempotency is qualified.

## 9. Provider, runner and toolchain substitution

Substitution follows `discover → qualify/admit → bind → execute → observe → reconcile → drain/withdraw`. Matching product labels or command-line compatibility do not prove equivalent sandboxing, dependency resolution, cache behavior, network controls, environment isolation, reproducibility, attestation or failure semantics.

During coexistence, equivalent build intent may be executed across old/new runners to collect qualification evidence. Cutover is incomplete while old runners/caches/toolchains can still produce authoritative outputs contrary to current binding/policy.

Unsupported semantics surface as `UNSUPPORTED`, `DEGRADED` or `INCONCLUSIVE` rather than silently preserving a stronger portability/reproducibility claim.

## 10. Workload-driven minimal runtime closure input

Build owns the declaration/evidence of the workload closure emitted or required by the produced output: binaries/modules/assets, runtime libraries, startup metadata, generated schemas/migrations, configuration/trust references and other retained artifacts needed for autonomous execution under the target profile.

This is an input to later Artifact/Release and Deployment/Runtime qualification. Build does not own environment placement, replica count, rollout strategy, readiness, provider binding, runtime health or effective operational state.

A minimal closure claim must remain profile-specific: removing SB-only authoring/build dependencies from a generated runtime is desirable, but a runtime may still require explicitly declared external providers or portable references. “Self-contained” must not erase legitimate external dependencies.

## 11. Capability boundaries

### Artifact / Release / SBOM / Provenance
Build owns producing outputs and build/material/reproducibility evidence. Artifact/Release owns canonical artifact/release identity, SBOM/provenance packaging/attestation, signature/admission/promotion/distribution semantics and release lifecycle. A build output becomes a release artifact only through an explicit release/adoption transition.

### Deployment / Environment / Runtime
Deployment/Runtime owns desired/effective/observed workload placement, rollout, readiness, scaling, rollback and runtime autonomy. Build owns the closure and outputs supplied to it. Build success never proves deployed or healthy runtime state.

### Provider / Binding / Capability Negotiation
Provider/Binding owns discovery, support qualification, admission, binding, fallback, coexistence and withdrawal of build runners/services. Build owns the semantic support vector required from those providers: dependency-resolution controls, input isolation, cache semantics, target/toolchain support, reproducibility evidence and ambiguous-effect behavior.

### Standards / Interoperability / API Contracts
Standards/API Contracts owns syntactic/structural/behavioral/semantic conformance of protocols and exposed interfaces. Build may consume schemas/codegen/interfaces as materials but does not own their canonical contract compatibility.

### Lifecycle / Versioning / Evolution / Migration
Lifecycle provides general revision/coexistence/migration primitives. Build owns build-domain compatibility of recipes, graphs, toolchains, caches and outputs across those revisions, including whether a historical build can be reproduced now.

### Security / Resilience / Failure Recovery
Security/Resilience owns security posture, fencing, compromised-state handling and recovery qualification. Build provides material integrity, sandbox/input boundary and reproducibility evidence consumed by those decisions. A historical reproducible result may still be currently disallowed due to revoked/compromised inputs.

### Secrets / Configuration / Environment Portability
Secrets/Configuration owns canonical references, resolution/materialization, currentness, rotation/revocation and environment overlays. Build may consume bounded references but must not canonize provider paths/values as general build identity or leak sensitive values into artifacts/provenance/caches.

### Developer / Operator Experience / Self-hosting
Developer/Operator Experience owns build/bootstrap/operator ergonomics, diagnostics and disconnected operational flows. Build owns the semantics those tools expose: closure, recipe, cache, runner/toolchain and reproducibility status.

### Universal Capability Architecture
UCA supplies typed identity, revision vectors, qualified evidence/claim, effect disposition, support-vector, provider-binding and residual-cohort primitives. It must not absorb Build semantic ownership.

## 12. Enterprise → Station → Role → Person and AGWS

Delegated authority remains monotonic. Enterprise may constrain allowed source/material domains, toolchains, runners, network access, cache reuse, target profiles and release eligibility. Station may specialize build profiles/providers only within delegated capability exposure and policy. Role/Person may request or configure builds only within that envelope.

Adaptive Governed Work Surfaces remains distinct. AGWS/AI may assist in expressing build intent, diagnostics or proposed dependency changes, but cannot:

- grant access to undelegated materials, secrets, runners or caches;
- silently change canonical dependency/schema/domain truth;
- convert runner success into reproducibility or release proof;
- manufacture material-integrity, cache-currentness or rebuild evidence;
- extend stale evidence horizons;
- adopt provider IDs/cache keys/run IDs as canonical identities silently;
- bypass Enterprise/Station build/release policy or create new authority.

An AI proposal that changes canonical dependencies, domain/schema contracts or release policy must cross to the owning capability/approval path rather than being silently materialized as a personal surface change.

## 13. Non-goals

This capability does not own canonical release identity, SBOM distribution/signature policy, deployment/runtime desired/effective state, provider admission, generic lifecycle mechanics, security policy, secret/configuration resolution, operator UX, semantic API compatibility or business/domain modeling. It does not mandate Nix, Bazel, Docker, one package manager, one CI service, one cache technology or one build topology.

## 14. Planning B repository-validation questions

Defer all answers to fresh-main archaeology in Planning B:

1. Does SB represent canonical build inputs/materials separately from filesystem/package/provider identities?
2. Is the transitive dependency closure explicit, integrity-qualified and tied to a revision vector?
3. Are build recipe, toolchain, target and runner revisions represented independently enough to qualify reproducibility?
4. Are undeclared network/filesystem/environment/time/random inputs fenced or explicitly classified as controlled impurity?
5. Can build attempt, provider acceptance, output production, validation and reproducibility assessment be observed separately?
6. Are caches provenance/currentness-qualified rather than trusted only by cache key?
7. Can remote build/cache `UNKNOWN` outcomes be reconciled before unsafe retry?
8. Can runners/toolchains/providers be substituted without changing canonical build identity, with semantic gaps surfaced as degraded/unsupported/inconclusive?
9. Is minimal generated-runtime closure explicit enough to prove which dependencies are retained versus authoring-only/SB-only?
10. Are build outputs kept distinct from released artifact identity and deployed/effective runtime truth?
11. Are sensitive configuration/secret references prevented from becoming leaked build material/provenance/cache values?
12. Are Enterprise → Station → Role → Person authority and AGWS/AI non-amplification enforced for build requests and proposed dependency/toolchain changes?

No answer is inferred in Planning A.

## 15. Planning A disposition

**PASS_FOR_CAPABILITY.** Build / Dependency Graph / Reproducibility has a distinct semantic owner and bounded relations to adjacent capabilities. The research/synthesis inputs are sufficient for Planning A; no new finding or capability candidate is required. Planning B remains blocked until every canonical capability completes Planning A reconciliation.
