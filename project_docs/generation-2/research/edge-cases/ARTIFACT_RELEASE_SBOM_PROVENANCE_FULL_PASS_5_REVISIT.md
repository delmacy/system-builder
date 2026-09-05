# Generation 2 — Artifact / Release / SBOM / Provenance — Full Pass 5 Revisit

Status: FULL PASS 5 — ELIGIBLE NO-NEW-MATERIAL REVISIT / LOCAL STREAK CAPPED AT 2 / CLUSTER STREAK CAPPED AT 2
Capability: Artifact / Release / SBOM / Provenance
Paired cluster: Enterprise Trust/PKI × Identity × Artifact/Release × provider substitution
Phase: `RESEARCH_ADVERSARIAL_EDGE_CASE_SATURATION`

Research posture: `CATALOGUE + CLASSIFY + DETECTION_CANDIDATE + FUTURE_REMEDIATION_ROUTE`. No remediation, target architecture, Work Package, TASK, Construction work or `ConflictInstance` is authorized. Preserve `ConflictPattern != ConflictInstance`, `Signal != ConfirmedConflict`, immutable artifact subject identity distinct from mutable aliases, authenticity distinct from organizational authorization/admission, and local/runtime evidence distinct from exported Fleet aggregates.

## Full-Pass-5 technique rotation

This revisit differs materially from Full Passes 1–4 by using:

- **runtime-provenance join mutation**: keep build provenance valid while varying which artifact/release/deployment/runtime identity is actually observed;
- **lineage edge deletion/substitution**: remove or replace one edge in `CanonicalCapabilityRef -> CapabilityUse -> BuildRevision/Release -> RuntimeRealization -> Deployment -> NodeInvocation/Attempt` while preserving locally valid records on both sides;
- **fleet rollup aliasing probe**: aggregate executions by semantic capability while varying build digest, release revision, provider, runtime topology and contract compatibility;
- **telemetry-resource transposition**: preserve `service.name`/`service.version` labels while changing artifact digest, deployment identity or provider realization;
- **evidence-plane partition**: partition local journal, exported telemetry, artifact/provenance store and Fleet aggregate and test which claims remain valid during outage, lag, duplication and late arrival;
- **mutable-reference collision**: reuse tags/aliases/releases across immutable artifact subjects and ask whether historical/runtime joins silently drift;
- **provider-referrer divergence**: preserve content digest while varying availability/currentness of SBOM, provenance, signatures and other artifact referrers across registries/providers;
- **N-wise authority braid**: combine signer identity, current organizational authorization, trust root, release policy, provider generation and global/fleet action context;
- **causal-dimension preservation probe**: test whether top-N/hotspot/capacity rollups remain explanatory when version/provider/topology dimensions are collapsed;
- **offline/autonomous proof probe**: remove SB/Fleet/Observe availability and verify that client runtime correctness and local evidence semantics remain independent of export success.

All candidates were duplicate-screened against the existing 119 reusable `G2-CONFLICT-PATTERN-*` inventory.

## Portable evidence refresh

- SLSA v1.2 defines provenance as verifiable information about where, when and how an artifact was produced, and its build predicate separates `buildDefinition` from `runDetails`; build-run identity is therefore not the same concept as later deployment/runtime identity. See https://slsa.dev/spec/v1.2/provenance and https://slsa.dev/spec/v1.2/build-provenance.
- SLSA build provenance includes builder identity and an invocation identifier in run metadata. These fields support precise build lineage but do not by themselves prove which deployment/runtime instance later executed that artifact.
- OCI Distribution referrers are descriptor relationships around a manifest/index subject. Artifact digest identity and availability of related SBOM/provenance/signature artifacts remain distinct claims, particularly across provider copies and residual registries. See https://specs.opencontainers.org/distribution-spec/.
- OpenTelemetry resource conventions define `service.version` as the version string used to identify an artifact, but the format is intentionally unconstrained; service/resource attributes identify telemetry origin and do not independently prove an OCI digest, SLSA subject, current release admission or organizational authority. See https://opentelemetry.io/docs/specs/semconv/resource/ and https://opentelemetry.io/docs/specs/semconv/resource/service/.

These are evidence examples, not universal implementation prescriptions.

## Priority hypothesis — AUTONOMOUS BUILDS × FLEET OBSERVABILITY/CAPACITY

Disposition: **HIPÓTESE DE ARQUITETURA / EM PESQUISA**.

The candidate operational lineage remains:

`CanonicalCapabilityRef -> CapabilityUse -> BuildRevision/Release -> RuntimeRealization -> Deployment -> NodeInvocation/Attempt`

The revisit supports keeping every link independently versioned/identifiable enough to answer both directions:

1. given an invocation/attempt, which deployment, runtime realization, release/build and semantic capability-use produced it?;
2. given a semantic capability or build/release, which qualified runtime/deployment cohorts contributed to a Fleet aggregate?

This does **not** establish a Planning-C architecture. The research consequence is a comparability proof obligation: aggregation by semantic capability is only valid when the compared cohorts have a qualified semantic/contract compatibility relation for the metric being combined. If build/release, provider, runtime topology, contract, units or instrumentation semantics diverge materially, analysis must retain those dimensions rather than silently roll them into one capability-level number.

Explicit separations retained:

`semantic topology != build topology != deployment topology != runtime truth != local journal/evidence != exported telemetry != fleet aggregate != control authority`.

`Shared infrastructure != shared truth/authority`.

`Telemetry gap != runtime failure`.

`Export acknowledgement != complete Fleet evidence`.

`service.version equality != artifact-digest/provenance equivalence` unless qualified by an explicit mapping.

Fleet/Global Operations remains a read/analysis plane by default. Any future global action remains outside this research result and would require explicit client context, authority, approval where applicable, version targeting, effect qualification and safe rollback/reconciliation.

## Duplicate-screened probes

### 1. Provenance-valid build versus runtime-observed artifact identity

Probe: SLSA provenance is valid for artifact A, a release record points to A, but runtime telemetry presents only a free-form version label that could also describe artifact B or a rebuilt artifact.

Disposition: no new reusable family. Existing attestation qualification, revision-vector/currentness, evidence-join and semantic-identity patterns already require qualified linkage before strengthening telemetry labels into artifact identity. Detection candidate: compare immutable artifact/release/deployment identifiers with runtime-local evidence and mark unmatched joins `UNKNOWN/PARTIAL`, not silently equal.

### 2. Same semantic capability across incompatible build/runtime cohorts

Probe: two builds expose the same `CanonicalCapabilityRef` and `CapabilityUse`, but one changes provider semantics, contract revision, unit, topology or instrumentation behavior; Fleet aggregates latency/errors/cost as if they were homogeneous.

Disposition: covered by qualification-join, compatibility-direction, semantic ownership, revision-vector and objective/resource dimensionality patterns. Capability equality alone does not establish metric comparability. No new pattern survives.

### 3. Mutable tag/alias reused after release

Probe: `latest`, channel, tag or human release label moves to a new digest while historical deployment/Fleet records retain the alias but not immutable subject linkage.

Disposition: covered by artifact identity, historical-currentness and distribution/revision patterns already catalogued. Detection candidate: immutable subject/release identity at observation time plus explicit alias history. No new class.

### 4. Digest preserved while referrer/evidence closure diverges

Probe: artifact bytes move between registries/providers with identical digest while SBOM/provenance/signature/referrer availability differs or arrives later.

Disposition: existing distribution convergence, evidence completeness/currentness, provider qualification and attestation qualification patterns apply. Byte identity is not evidence-set equivalence. No new class.

### 5. Local-first runtime during Fleet outage

Probe: SB/Observe/Fleet and exporter are unavailable while the client runtime continues correct work and maintains local journal/diagnostic evidence; later export is delayed, duplicated or partial.

Disposition: existing runtime autonomy, evidence-currentness, ambiguous/partial transport, observability completeness and reconciliation families cover the case. Export failure must not become workflow failure. Fleet aggregate must carry gap/currentness semantics rather than infer absence of activity.

### 6. Late telemetry after release/provider cutover

Probe: old deployment/provider telemetry arrives after a newer release has become current and is aggregated by current labels rather than event-time lineage.

Disposition: covered by temporal ordering, residual-cohort, revision/currentness and provider-coexistence patterns. Detection candidate: event/observation time plus immutable deployment/release/provider cohort identity and late-arrival qualification.

### 7. Resource/cardinality pressure encourages dimension collapse

Probe: per-node/per-capability-use/build/deployment/provider/topology dimensions create high cardinality and operators collapse them into one score or discard lineage.

Disposition: existing resource-boundedness, evidence-completeness and objective-optimization conflict families apply. Bounded aggregation may sample/roll up, but must preserve causal dimensions needed for interpretation or explicitly weaken confidence/completeness.

### 8. AI/low-code signs/promotes based on Fleet hotspot

Probe: Fleet identifies a hotspot and an AI/low-code composition selects a new provider/build and promotes/signs it using individually permitted primitives, but combined action exceeds canonical release authority or semantic compatibility.

Disposition: existing AI/low-code non-amplification, trust/authority, provider qualification, compatibility and objective-conflict patterns cover the case. Observability may inform candidate placement/provider selection only inside semantic/authority constraints; it may not rewrite workflow semantics or release authority.

### 9. Cross-tenant artifact/telemetry attribution on shared infrastructure

Probe: shared cluster/registry/database schemas yield valid infrastructure identifiers whose reuse or missing tenant context causes artifact/runtime evidence to be attributed to the wrong client Fleet rollup.

Disposition: existing tenant isolation, qualified identity, trust/provider namespace and evidence-attribution patterns cover this. Shared infrastructure identity is not canonical client authority or ownership. No new pattern.

## Explicit paired-cluster exercise — Enterprise Trust/PKI × Identity × Artifact/Release × provider substitution

Result: **ELIGIBLE NO-NEW-MATERIAL REVISIT; STREAK REMAINS CAPPED AT 2**.

The cluster was exercised with N-wise combinations of immutable artifact subject, provenance builder/run, signer identity, issuer/root namespace, current Role/Station authorization, verification-policy revision, provider/registry generation, mutable release alias, runtime-observed version, residual provider cohorts and Fleet aggregation.

The strongest composition remains already catalogued: every component can be authentic and locally valid while there is no jointly qualified cut proving that the artifact currently running in a client deployment is the artifact admitted under the current trust/authority/policy/provider context. Existing qualification-join, trust-namespace-collapse, trust-authority, distribution-convergence, provider-qualification, revision-vector/currentness and evidence-attribution patterns cover it. No new reusable conflict family survives duplicate-screen.

## Conflict classification coverage

The pass explicitly exercised structural graph, state-transition, semantic ownership, rule/formula/condition, temporal/ordering, resource/capacity, authority/responsibility/separation-of-duty, policy/compliance, data/consistency, provider/integration, version/migration/coexistence, exception/compensation/recovery, human-procedure/instruction, cross-process, objective/optimization and AI/low-code composition dimensions.

For each candidate that approached materiality, activation conditions, incompatible claims/actions/states, detector candidates, owners, severity/confidence/detectability, blast radius, reversibility, time-to-harm, misuse likelihood, evidence currentness, false-positive risk and future remediation disposition were checked against existing indexed patterns. No candidate required a new `G2-CONFLICT-PATTERN-*` ID. No detector signal was promoted to `ConfirmedConflict`.

## Preventive-invariant disposition

No new preventive invariant is promoted. Existing proof obligations already require qualified immutable subject identity, evidence/currentness, directed compatibility, canonical authority separate from provider/trust evidence, partial/unknown effect semantics, tenant-qualified attribution and non-amplification. Turning Fleet into a universal authoritative control plane would contradict the autonomy hypothesis and is not justified by this research.

## Saturation disposition

- New local material edge scenarios: **0**.
- New cross-capability material scenarios: **0**.
- New reusable `G2-CONFLICT-PATTERN-*`: **0**.
- New `ConflictInstance`: **0**.
- Artifact / Release / SBOM / Provenance local no-material streak: **remains capped at 2**.
- Enterprise Trust/PKI × Identity × Artifact/Release × provider substitution cluster streak: **remains capped at 2**.
- HIGH/CRITICAL findings without owner/proof/detection route: **0**.
- Material inventory remains **284 edge scenarios + 119 reusable ConflictPatterns = 403 material findings**.
- Full Pass 5 advances **7/28 -> 8/28 capabilities** and **6/12 -> 7/12 mandatory clusters**.
- Completed full passes remain **4/8 minimum**; target reference **12**, no maximum.
- Negative-space remains `NOT_STARTED`.
- Saturation remains `NOT_SATURATED`.
- Planning C remains blocked.

## Next bounded step

Continue only `RESEARCH_ADVERSARIAL_EDGE_CASE_SATURATION`, Full Pass 5, with **Deployment / Runtime / Autonomous Operation** and explicitly exercise **Observability × Security/Recovery × runtime truth** without inflating its already-satisfied streak above 2. Carry Typed Semantic Graph + ExecutionEnvelope + Autonomous Builds/Fleet Observability into desired/adopted/deployed/runtime-effective/business-converged joins, runtime-local journal versus exported telemetry/Fleet aggregate, deployment/release identity, health versus semantic/security truth, termination versus effect quiescence, rollout/rollback/recovery/fencing races, stale/lossy/late telemetry, `PARTIAL/UNKNOWN`, residual/offline cohorts, authority/trust drift, compatibility direction, resource/capacity pressure, human recovery procedures and AI/low-code placement/provider optimization. Fleet remains non-authoritative by default; GraphDB remains optional/provider-level; do not enter Planning C.
