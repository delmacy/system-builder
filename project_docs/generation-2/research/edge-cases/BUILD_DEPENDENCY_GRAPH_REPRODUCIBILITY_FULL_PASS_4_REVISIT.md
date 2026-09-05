# Generation 2 — Build / Dependency Graph / Reproducibility — Full Pass 4 Revisit

Status: FULL PASS 4 — ELIGIBLE NO-NEW-MATERIAL REVISIT / LOCAL STREAK 2 / CLUSTER STREAK 2
Capability: Build / Dependency Graph / Reproducibility
Paired cluster: Build × Artifact/Release × Deployment × Runtime
Phase: `RESEARCH_ADVERSARIAL_EDGE_CASE_SATURATION`

Research posture: `CATALOGUE + CLASSIFY + DETECTION_CANDIDATE + FUTURE_REMEDIATION_ROUTE`. No target architecture, product work, Work Package, TASK, Construction or remediation is authorized. Preserve `ConflictPattern != ConflictInstance`, `Signal != ConfirmedConflict`, provider-native identity as non-canonical unless explicitly adopted, and ambiguous mutating effects as reconciliation-bound before unsafe retry.

## 1. Technique rotation

This revisit deliberately changed emphasis from Full Passes 1-3. It used:

- conditional-closure metamorphism across OS/architecture/CPU/feature predicates while holding nominal dependency intent constant;
- provenance-cut subtraction to remove one builder, resolver, registry, cache, toolchain or generated input at a time and test whether a claimed build identity remained justified;
- cache-equivalence adversarial mutation across omitted semantic inputs;
- ambient-input braid analysis across locale, timezone, clock, filesystem ordering/path, CPU feature exposure and network reachability;
- concurrent successful-build and promotion interleavings to separate artifact production from release/deployment adoption;
- remote build/cache/publication effect classification using `APPLIED / NOT_APPLIED / PARTIAL / UNKNOWN`;
- resolver/provider substitution with residual namespace and metadata cohorts plus offline-currentness horizons;
- dependency graph/cardinality amplification and valid-but-pathological cost/latency pressure;
- presence-semantics mutation for `ABSENT / UNSET / null / empty / default / delete` build inputs;
- human release-procedure contradiction checks;
- AI/low-code composition mutation for dependency-source, plugin, network, credential and build-authority expansion.

Every candidate was duplicate-screened against all 119 reusable `G2-CONFLICT-PATTERN-*` families, explicitly including presence semantics, trust-namespace collapse, cumulative privacy and compatibility direction.

## 2. Portable evidence refresh

Current evidence strengthens existing classifications without exposing a new reusable conflict family:

- SLSA Build Provenance v1.2 separates `externalParameters`, `internalParameters`, `resolvedDependencies`, `builder.id` and produced `subject`. It requires externally controlled inputs to be represented and treats build-platform/control-plane influence as part of the builder trust boundary or, when it changes the build definition, as resolved dependencies. This reinforces qualified effective-input identity and provenance/currentness reasoning: https://slsa.dev/spec/v1.2-rc2/build-provenance
- Reproducible Builds documents locale-dependent time formatting, collation and encoding, and timezone-dependent output. These are concrete witnesses that ambient environment can change valid build products unless the relevant inputs are normalized or qualified: https://reproducible-builds.org/docs/locales/
- SLSA also distinguishes byte-producing subject identity from the builder and build-definition qualification that gives the result supply-chain meaning; byte equality therefore remains insufficient to import authority, provenance or release eligibility automatically.

Provider/ecosystem mechanisms are evidence examples only and are not promoted as canonical System Builder semantics.

## 3. Duplicate-screened local probes

### 3.1 Conditional/platform graph divergence

Two builds with the same nominal manifest/lock intent can legitimately resolve different effective closures under OS, architecture, CPU, optional-feature, toolchain or resolver predicates. Existing `G2-EDGE-BUILD-007..008`, effective-identity, revision-vector, provider-qualification and compatibility-direction families already cover the material risk. No new local class survives.

### 3.2 Provenance skew across lock, registry, resolver, toolchain and generated inputs

Each evidence source can be locally valid while the composed build claim lacks one common qualified cut. Existing qualified-claim/currentness, effective-identity and provenance/attestation families cover this composition. No new class survives.

### 3.3 Cache-key incompleteness

A cache key may omit a semantic input such as toolchain, feature flag, environment value, locale, network-fetched dependency or policy-sensitive parameter and still produce a valid cache hit. Cache success remains a signal of key match, not proof of attempt equivalence. Existing cache/currentness/effective-input patterns cover it.

### 3.4 Ambient nondeterminism

Locale, timezone, clock, filesystem path/order, CPU feature exposure, parallel scheduling and network state can alter output or effective dependency selection without any component being individually invalid. Existing nondeterminism, effective-input and qualified evidence patterns remain sufficient.

### 3.5 Remote build/cache/publication `PARTIAL / UNKNOWN`

Transport failure after a remote mutation cannot establish `NOT_APPLIED`. Unsafe retry can duplicate publication, mutable aliases, cache writes or promotion. Existing ambiguous-effect, idempotency qualification and reconcile-before-retry patterns cover this case.

### 3.6 Resolver/provider substitution and offline evidence horizons

Old/new registries, mirrors, caches, builders or resolvers may coexist with valid but different namespaces, support vectors and metadata horizons. Existing provider qualification, residual-cohort, currentness, trust-namespace and effective-identity patterns cover the failure surface.

### 3.7 Presence semantics in build inputs

`ABSENT`, `null`, empty, default and explicit delete can produce different build configuration semantics while serializers or low-code surfaces collapse them. This is an instance of `G2-CONFLICT-PATTERN-PRESENCE-SEMANTICS-001`; no new pattern is justified.

### 3.8 Graph/cardinality and economic pressure

A valid dependency graph can cause pathological transitive closure, fan-out, metadata fetches, cache pressure, build time or cost. Existing structural-graph, resource-boundedness and objective-conflict patterns cover it.

### 3.9 Human procedure conflicts

Individually valid operator instructions can conflict about lock refresh, cache bypass, rebuild, promotion order or emergency release. Existing human-procedure, temporal/ordering, authority and compatibility-direction patterns already classify the risk. A warning signal alone is not a confirmed conflict.

### 3.10 AI/low-code supply-chain expansion

Generated build composition can remain syntactically valid while adding dependency sources, plugins, remote builders, network access or credential use outside the effective authority envelope. Existing AI/low-code composition, authority non-amplification, provider trust and policy patterns cover it.

## 4. Explicit paired-cluster revisit — Build × Artifact/Release × Deployment × Runtime

The mandatory cluster was explicitly exercised rather than inferred from local Build coverage.

### 4.1 Reproducible bytes versus qualified release identity

Two attempts may produce byte-identical subjects while differing in builder authority, dependency completeness, provenance, policy/trust revision or release eligibility. Existing `G2-XEDGE-BUILD-RELEASE-DEPLOY-RUNTIME-005` and attestation/qualified-claim patterns cover the composition. Digest equality proves byte identity only within its algorithm/scope; it does not import authority or adoption eligibility.

### 4.2 Concurrent successful attempts and mutable promotion

Two independently successful build/release attempts can race to promote the same mutable reference while both remain locally valid. Existing transition-race, revision-vector, semantic ownership and adoption/convergence families cover the conflict.

### 4.3 Build-valid-at-T1 versus deploy/runtime qualification at T2

A build can be valid under one trust, policy, provider or vulnerability-evidence cut and be adopted later under a changed context. Existing currentness/requalification, lifecycle and residual-cohort patterns cover the gap; a historical valid build is not automatically a current deployment authorization.

### 4.4 Directed compatibility through build→release→deploy→runtime

Compatibility may be valid for build consumption or forward deployment but invalid for rollback, replay, old-runtime adoption or a reversed operation. `G2-CONFLICT-PATTERN-COMPATIBILITY-DIRECTION-001` covers promotion of one-way evidence into global compatibility.

### 4.5 Partial distribution and residual runtime cohorts

Publication/deployment effects can be `PARTIAL/UNKNOWN`, leaving consumers on different artifacts or provider cohorts. Existing ambiguous-effect, residual-cohort and convergence patterns cover this composition.

## 5. Processual / semantic conflict classification coverage

The revisit explicitly searched all required families: structural graph; state-transition; semantic ownership; rule/formula/condition; temporal/ordering; resource/capacity; authority/responsibility/separation-of-duty; policy/compliance; data/consistency; provider/integration; version/migration/coexistence; exception/compensation/recovery; human-procedure/instruction; cross-process; objective/optimization; and AI/low-code composition.

No new reusable `G2-CONFLICT-PATTERN-*` survived duplicate-screen. Candidate signals remained signals only; no `ConflictInstance` is asserted.

## 6. Preventive invariant candidate disposition

No new preventive invariant candidate is elevated. Existing proof obligations already require qualified effective build identity, provenance/currentness, authority non-amplification, ambiguous-effect reconciliation, directed compatibility and bounded resource behavior. A broader universal restriction would risk over-constraining legitimate target-specific builds, intentionally asymmetric compatibility, controlled provider substitution or valid ambient-input normalization strategies.

## 7. Saturation disposition

Result: **ELIGIBLE NO-NEW-MATERIAL REVISIT**.

- New local edge scenarios: **0**.
- New cross-capability scenarios: **0**.
- New reusable ConflictPatterns: **0**.
- Build / Dependency Graph / Reproducibility local no-material streak: **1 → 2**.
- Build × Artifact/Release × Deployment × Runtime cluster no-material streak: **1 → 2**.
- Material inventory remains **284 edge scenarios + 119 ConflictPatterns = 403 material findings**.
- HIGH/CRITICAL findings without owner/proof/detection route remain **0**.
- Full Pass 4 advances to **7/28 capabilities + 6/12 mandatory clusters**.
- Completed full passes remain **3/8 minimum**; target **12**, no maximum.
- Negative-space remains `NOT_STARTED`; saturation remains `NOT_SATURATED`.
- Planning C remains blocked.

The next eligible focus is Artifact / Release / SBOM / Provenance with explicit Enterprise Trust/PKI × Identity × Artifact/Release × provider substitution exercise, subject to a fresh `RESEARCH_PIPELINE_STATE.json` and branch-head revalidation before action.
