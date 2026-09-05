# Generation 2 — Build / Dependency Graph / Reproducibility — Full Pass 3 Revisit

Status: FULL PASS 3 — ELIGIBLE NO-NEW-MATERIAL REVISIT / LOCAL STREAK 1 / CLUSTER STREAK 1
Capability: Build / Dependency Graph / Reproducibility
Paired cluster: Build × Artifact/Release × Deployment × Runtime
Phase: `RESEARCH_ADVERSARIAL_EDGE_CASE_SATURATION`

Research posture: `CATALOGUE + CLASSIFY + DETECTION_CANDIDATE + FUTURE_REMEDIATION_ROUTE`. No target architecture, product work, Work Package, TASK, Construction or remediation is authorized. Preserve `ConflictPattern != ConflictInstance`, `Signal != ConfirmedConflict`, provider-native identity as non-canonical unless explicitly adopted, and ambiguous mutating effects as reconciliation-bound before unsafe retry.

## 1. Technique rotation

This revisit intentionally did not repeat the Full Pass 2 qualified-cut probes as its primary technique. It used:

- counterfactual graph mutation across optional/conditional/platform-specific branches while holding nominal build intent constant;
- provenance triangle analysis across declared intent, effective resolver closure and produced subject;
- ambient-environment differential analysis across locale, timezone, filesystem path, clock, CPU feature exposure, network reachability and execution ordering;
- cache-boundary mutation in which omitted semantic inputs can preserve a valid cache hit while invalidating attempt-specific qualification;
- concurrent build/promotion braid analysis across independent successful attempts;
- remote-build effect classification using `APPLIED / NOT_APPLIED / PARTIAL / UNKNOWN` rather than transport outcome;
- provider/resolver substitution analysis with residual metadata, namespace and dependency cohorts;
- offline-currentness horizon analysis for registries, vulnerability/license/policy metadata and trust evidence;
- dependency-graph cardinality/fan-out exhaustion and valid-but-pathological composition;
- AI/low-code aggregate composition analysis for supply-chain reach and authority amplification.

Every candidate was duplicate-screened against the 115 reusable ConflictPatterns already authoritative in the edge-case catalogue.

## 2. Portable evidence refresh

Current portable evidence continues to support the existing classifications without exposing a new conflict family:

- SLSA Build Provenance v1.2-rc2 separates `externalParameters`, build-platform/internal context, `resolvedDependencies`, builder identity and produced `subject`. It states that artifacts fetched during initialization/execution are dependencies and that control-plane/cache influence which changes the build definition should be represented in resolved dependencies. This supports the existing qualified-cut, effective-identity and provenance-qualification patterns rather than a new architecture primitive: https://slsa.dev/spec/v1.2-rc2/build-provenance
- Reproducible Builds documents locale-dependent sorting/encoding/time formatting and timezone-dependent outputs, showing that two otherwise legitimate environments can alter results unless relevant ambient inputs are normalized or qualified: https://reproducible-builds.org/docs/locales/ and https://reproducible-builds.org/docs/timezones/
- Reproducible Builds also documents timestamp normalization through `SOURCE_DATE_EPOCH`; this reinforces that nominal source/dependency identity alone does not capture every effective build input: https://reproducible-builds.org/docs/source-date-epoch/

Provider or ecosystem mechanisms above are evidence examples only; they are not promoted to canonical System Builder semantics.

## 3. Duplicate-screened local probes

### 3.1 Conditional graph divergence under a stable nominal intent

A nominally identical lock/build definition can legitimately expand to different effective closures under platform, optional-feature, CPU/toolchain or resolver dimensions. This is already represented by `G2-EDGE-BUILD-008` and reusable effective-identity, revision-vector and provider-qualification patterns. No new local class survives.

### 3.2 Lockfile / registry / toolchain provenance skew

Individually valid lock entries, registry observations and resolver/toolchain identities may not share one qualified cut. This is already `G2-EDGE-BUILD-007` plus qualification-join/currentness/revision-vector patterns. No new class survives.

### 3.3 Cache-key incompleteness

A cache key may omit locale, environment, toolchain, feature flags, network-fetched inputs or policy-relevant parameters while still producing a technically valid cache hit. This reduces to the previously catalogued cache/revision/currentness and effective-identity failures; a cache signal is not proof of attempt equivalence. No new class survives.

### 3.4 Host / locale / timezone / clock / CPU / network nondeterminism

Ambient influences can alter byte output, dependency selection or generation behavior while all local tools remain valid. Existing nondeterminism and effective-input patterns cover the failure; locale/timezone/timestamp evidence refresh strengthens currentness but not taxonomy. No new class survives.

### 3.5 Remote build `PARTIAL / UNKNOWN`

A timeout or lost acknowledgement after a remote build/publish/cache mutation cannot establish `NOT_APPLIED`; retried work may duplicate publication, promotion or mutable alias effects. Existing ambiguous-effect, idempotency-qualification and reconciliation-before-retry patterns cover this case. No new class survives.

### 3.6 Resolver/provider substitution and offline metadata horizons

Old/new providers, mirrors, caches or registries can coexist with individually valid but non-equivalent namespaces, metadata horizons or dependency semantics. Existing provider-qualification, residual-cohort, currentness and effective-identity patterns apply. No new class survives.

### 3.7 Graph/cardinality exhaustion

A valid graph can produce pathological transitive closure, fan-out, cache pressure, metadata fetch volume or build cost. Existing resource-boundedness/structural-graph and objective-conflict patterns apply. No new class survives.

### 3.8 AI/low-code supply-chain expansion

A generated build composition can be syntactically valid while expanding dependency sources, network reach, plugins, builders or credentials beyond the user's effective authority envelope. Existing AI/low-code composition, authority non-amplification, provider-trust and policy patterns apply. No new class survives.

## 4. Explicit paired-cluster revisit — Build × Artifact/Release × Deployment × Runtime

The paired cluster was explicitly revisited rather than inferred from the local capability pass.

### 4.1 Reproducible bytes versus producing qualification

Two builds may produce byte-identical artifacts while differing in builder authority, resolved-dependency completeness, policy/trust revision or provenance lineage. This remains exactly `G2-XEDGE-BUILD-RELEASE-DEPLOY-RUNTIME-005` and the existing attestation-qualification, trust-authority and qualified-claim patterns. Digest equality remains evidence of byte identity, not automatic import of authority or release eligibility.

### 4.2 Concurrent successful builds and promotion cuts

Two independently successful attempts can race to mutable release/promote/deploy references while each is locally valid. Existing transition-race, revision-vector, adoption/convergence and effective-identity patterns cover the conflict. No new cross-capability class survives.

### 4.3 Build evidence currentness versus runtime adoption

A release may have been validly built and admitted at one cut while deployment/runtime adoption happens after trust, policy, provider, vulnerability or authority context changes. Existing currentness/requalification, adoption/convergence and residual-cohort patterns cover the gap. No new class survives.

### 4.4 Partial publication / residual distribution cohorts

A remote release or distribution effect can be `PARTIAL/UNKNOWN`, leaving some consumers on old cohorts and others on new ones. Existing ambiguous-effect, residual-cohort and convergence patterns cover this composition. No new class survives.

## 5. Processual / semantic conflict classification coverage

The revisit explicitly challenged structural graph, state-transition, semantic ownership, rule/condition, temporal/ordering, resource/capacity, authority/responsibility, policy/compliance, data/consistency, provider/integration, version/coexistence, exception/recovery, human-procedure, cross-process, objective/optimization and AI/low-code composition dimensions.

No new reusable `G2-CONFLICT-PATTERN-*` was justified. Candidate signals remained signals only; no concrete `ConflictInstance` is asserted.

## 6. Preventive invariant candidate disposition

No additional preventive invariant candidate is promoted in this revisit. Existing proof obligations already require explicit qualification of effective graph/build evidence, authority/provenance, currentness and bounded resource behavior. Adding a stronger universal prohibition would risk blocking legitimate target-dependent builds, intentional provider substitution or valid reproducible-build techniques.

## 7. Saturation disposition

Result: **ELIGIBLE NO-NEW-MATERIAL REVISIT**.

- New local edge scenarios: **0**.
- New cross-capability scenarios: **0**.
- New reusable ConflictPatterns: **0**.
- Build / Dependency Graph / Reproducibility local no-material streak: **0 → 1**.
- Build × Artifact/Release × Deployment × Runtime cluster no-material streak: **0 → 1**.
- Material inventory remains **278 edge scenarios + 115 ConflictPatterns = 393 material findings**.
- HIGH/CRITICAL findings without owner/proof/detection route remain **0**.
- Planning C remains blocked.

The next eligible focus is Artifact / Release / SBOM / Provenance with an explicit revisit of Enterprise Trust/PKI × Identity × Artifact/Release × provider substitution, subject to fresh `RESEARCH_PIPELINE_STATE.json` authority before action.
