# Generation 2 — Artifact / Release / SBOM / Provenance — Full Pass 6 Revisit

Status: FULL PASS 6 — ELIGIBLE NO-NEW-MATERIAL REVISIT / LOCAL STREAK CAPPED AT 2 / CLUSTER STREAK CAPPED AT 2
Capability: Artifact / Release / SBOM / Provenance
Paired cluster: Enterprise Trust/PKI × Identity × Artifact/Release × provider substitution
Phase: `RESEARCH_ADVERSARIAL_EDGE_CASE_SATURATION`

Research posture: `CATALOGUE + CLASSIFY + DETECTION_CANDIDATE + FUTURE_REMEDIATION_ROUTE`. No remediation, target architecture, Work Package, TASK, Construction work or `ConflictInstance` is authorized. Preserve `ConflictPattern != ConflictInstance`, `Signal != ConfirmedConflict`, proof-domain non-strengthening, immutable artifact identity distinct from mutable release aliases, authenticity distinct from authorization/admission, and autonomous local/runtime truth distinct from exported Fleet aggregates.

## Full-Pass-6 technique rotation

This revisit differs materially from Full Passes 1–5 by using a proof-domain / formal-assurance rotation aligned with the immediately preceding Build revisit:

- **subject-set completeness mutation** — hold a provenance statement valid while deleting, adding or ambiguously partitioning one output subject and ask which downstream claims survive;
- **proof-lattice anti-strengthening** — independently vary integrity, authenticity, completeness, admission, deployment, runtime-use and business-effect claims and reject any inference that silently strengthens one claim into another;
- **attestation perspective bifurcation** — evaluate the same artifact under producer, verifier, release-policy, provider and client-runtime perspectives with intentionally different trust/profile/currentness cuts;
- **revision-vector diagonalization** — align all but one of semantic graph, build, artifact, SBOM, provenance predicate/profile, signer/trust, release policy, provider binding and deployment revisions;
- **negative-inventory mutation** — preserve a syntactically valid SBOM/provenance while removing one dependency/component class that the format or assurance level does not prove complete;
- **alias-history permutation** — move tags/channels/release aliases across immutable digests while replaying historical promotion/deployment evidence against the earlier cut;
- **compound identity substitution** — permute builder, signer, OIDC subject, certificate issuer, verifier identity and organizational release authority independently while preserving cryptographic validity where possible;
- **offline trust-horizon partition** — allow an autonomous client to continue with locally pinned artifacts/evidence while Fleet/trust/provider evidence becomes stale, delayed or unavailable;
- **provider evidence-set asymmetry** — copy the same content-addressed subject across providers while varying SBOM/provenance/signature/referrer availability, retention and verification profile;
- **proof-cardinality pressure** — increase subject/referrer/attestation cardinality until systems are tempted to truncate evidence, sample, collapse versions or drop tenant/build dimensions;
- **promotion interleaving model** — interleave publish, sign, attest, scan, approve, alias-move, deploy, revoke/withdraw and rollback steps to expose `PARTIAL/UNKNOWN` and residual-cohort cuts;
- **human/AI authority permutation** — compose human release instructions, AI/low-code recommendations, delegated signing identities and Fleet hotspot/capacity signals while checking that no individually valid primitive amplifies release authority.

All candidate families were duplicate-screened against the authoritative 123 reusable `G2-CONFLICT-PATTERN-*` inventory.

## Fresh portable evidence

- SLSA v1.2 defines provenance as verifiable information describing where, when and how an artifact was produced. Its model separates `buildDefinition` from `runDetails`, including builder identity and invocation metadata. This supports precise build-run lineage but does not prove later release admission, deployment, runtime execution or business effect. See https://slsa.dev/spec/v1.2/provenance and the SLSA Build Provenance specification.
- SLSA v1.2 Build requirements explicitly describe completeness as bounded: external parameters must be enumerated at stronger levels, while completeness of `resolvedDependencies` remains best effort. Therefore a valid provenance statement cannot automatically be strengthened into a proof of exhaustive dependency/SBOM closure.
- OCI Distribution distinguishes immutable digest identity from mutable tags, and defines subject/referrer relationships separately. A digest can remain identical while the available referrer evidence set differs across registries/providers or over time. See https://specs.opencontainers.org/distribution-spec/.
- Sigstore verification separately checks artifact-signature binding, certificate/identity, trust root and transparency/timestamp evidence. The bundle format also carries temporal material needed when short-lived certificates have expired. Cryptographic validity therefore remains distinct from current organizational authorization, release-policy eligibility and evidence-set completeness. See https://docs.sigstore.dev/about/bundle/ and https://docs.sigstore.dev/cosign/verifying/verify/.

These references are evidence witnesses, not Planning-C decisions or universal implementation prescriptions.

## Priority hypothesis — AUTONOMOUS BUILDS × FLEET OBSERVABILITY/CAPACITY

Disposition: **HIPÓTESE DE ARQUITETURA / EM PESQUISA**.

The operational lineage hypothesis remains:

`CanonicalCapabilityRef -> CapabilityUse -> BuildRevision/Release -> RuntimeRealization -> Deployment -> NodeInvocation/Attempt`

Full Pass 6 strengthens a proof obligation around this chain: each hop needs enough immutable/revision-qualified identity to permit both local diagnosis and later Fleet aggregation without promoting aliases, telemetry labels, provider IDs or incomplete attestations into canonical truth.

Analysis **must remain by build/release/deployment** when any materially relevant dimension differs or is `UNKNOWN/PARTIAL`: artifact digest/subject set, contract revision, provider realization, deployment/runtime topology, trust/admission policy, instrumentation semantics, unit, sampling/completeness profile or tenant/client context. Aggregation by semantic capability is only meaningful after an explicit comparability relation for the metric and question being asked.

Retained separations:

`semantic topology != build topology != deployment topology != runtime truth != local journal/evidence != exported telemetry != fleet aggregate != control authority`.

`provenance validity != provenance completeness`.

`artifact digest identity != evidence/referrer-set equivalence`.

`signature authenticity != current organizational authorization`.

`release eligibility != deployment evidence != runtime use != business convergence`.

`Shared infrastructure != shared truth/authority`.

`Telemetry/export failure != workflow failure`.

Fleet/Global Operations remains a read/analysis plane by default. A future global actuation path, if ever adopted, would require explicit client context, current authority, approval where applicable, exact version/release/deployment targeting, qualified effect semantics and safe rollback/reconciliation. This research does not authorize such a control plane.

## Duplicate-screened candidate conflicts

### 1. Valid provenance with incomplete subject/dependency closure

Activation conditions: provenance verifies, at least one material output/dependency class is omitted or completeness is not guaranteed by the assurance/profile, and a consumer treats the statement as exhaustive.

Incompatible claims/actions/states: `provenance valid` versus `all relevant subjects/dependencies are represented`.

Detection candidates: provenance/profile capability check; compare declared subjects/dependencies with build outputs, release manifest, SBOM and independent inventory where available; preserve `PARTIAL/UNKNOWN` completeness.

Owners: Build/Dependency Graph, Artifact/Release, provider realization, Governance/Security policy.

Assessment: severity HIGH where admission, vulnerability or rollback decisions rely on exhaustive closure; confidence strongly supported; detectability pre-execution/post-build; blast radius release-to-fleet; reversibility bounded before promotion, migration/incident handling after deployment; time-to-harm latent or delayed; misuse accidental/plausible; evidence currentness profile-dependent; false-positive risk medium when omission is explicitly permitted/non-material.

Future remediation disposition: require evidence qualification or human/policy reconciliation when an exhaustive claim is needed; do not globally reject all incomplete provenance.

Duplicate-screen disposition: **no new pattern**. Covered by `G2-CONFLICT-PATTERN-PROOF-CLAIM-CONFLATION-001`, evidence completeness/currentness, qualification-join and revision-vector families.

### 2. Immutable digest preserved while referrer evidence diverges

Activation conditions: same artifact digest exists in multiple providers/registries or time cuts while SBOM/provenance/signature/referrer sets differ, are delayed, truncated or unavailable.

Incompatible claims/actions/states: `same bytes` versus `same assurance/evidence closure`.

Detection candidates: provider-qualified referrer enumeration; evidence-set/profile/version/currentness comparison; explicit `PARTIAL/UNKNOWN` on unavailable sets.

Owners: Artifact/Release, Provider/Binding, Enterprise Trust/PKI, Governance/Security.

Assessment: severity MEDIUM–HIGH; confidence strongly supported; detectability pre-release/audit; blast radius artifact/release/cohort; reversibility bounded if caught before promotion; time-to-harm delayed; misuse likelihood accidental/plausible; false-positive risk low when evidence equivalence is actually claimed.

Future remediation disposition: qualify or reconcile evidence before policy decisions that depend on it; provider substitution remains a separate realization concern.

Duplicate-screen disposition: **no new pattern**. Covered by provider-evidence convergence/currentness, trust namespace, proof-claim conflation and provider-qualification families.

### 3. Cryptographically valid signer but organizationally ineligible release

Activation conditions: signature/certificate/trust verification succeeds while current Role/Station/delegation/release policy no longer authorizes the signer or the action.

Incompatible claims/actions/states: `authentic signature from identity X` versus `X currently has authority to approve/promote release R for client/context C`.

Detection candidates: current authorization/policy re-evaluation bound to release subject, action, client, signer identity mapping, trust namespace and decision revision.

Owners: Identity, Authorization/Policy, Enterprise Trust/PKI, Artifact/Release.

Assessment: severity HIGH–CRITICAL; confidence strongly supported; detectability pre-promotion/audit; blast radius release/client/fleet; reversibility may require withdrawal/rollback; time-to-harm immediate after promotion; misuse plausible/adversarial; evidence currentness critical; false-positive risk medium if historical authorization is sufficient for a historical claim but not a current action.

Future remediation disposition: route current action through authority/policy requalification; preserve historical signature evidence without rewriting history.

Duplicate-screen disposition: **no new pattern**. Covered by trust-authority separation, authentication/authorization currentness, SoD/delegation and revision-vector families.

### 4. Promotion pipeline reaches `PARTIAL/UNKNOWN` external effect

Activation conditions: publish/sign/attest/promote/alias move succeeds partially or provider response is ambiguous, and automation assumes either full success or no effect.

Incompatible claims/actions/states: local release state versus external provider state; `timeout/ack` versus actual mutation disposition.

Detection candidates: operation-specific idempotency/effect evidence; read-back/reconciliation; immutable target identity; residual cohort scan.

Owners: Artifact/Release, Provider/Binding, Integration, Deployment/Lifecycle.

Assessment: severity HIGH; confidence strongly supported; detectability runtime/post-effect; blast radius release/provider/deployment cohorts; reversibility bounded only after reconciliation; time-to-harm immediate; misuse accidental/plausible; false-positive risk low when provider disposition is genuinely unknown.

Future remediation disposition: reconcile `UNKNOWN` before unsafe retry, then continue/compensate/withdraw according to the qualified operation contract.

Duplicate-screen disposition: **no new pattern**. Covered by ambiguous mutation/retry, residual-cohort, provider convergence and state-transition families.

### 5. Offline autonomous client crosses trust/policy freshness horizon

Activation conditions: client remains operational while SB/Fleet/trust/provider planes are unavailable; locally pinned artifact and evidence remain intact but current revocation/withdrawal/policy status cannot be refreshed.

Incompatible claims/actions/states: `local artifact remains executable under last known local contract` versus `global/current eligibility is unknown`.

Detection candidates: explicit evidence/currentness horizon, local policy mode, outage duration, revocation/withdrawal reconciliation on reconnect.

Owners: Deployment/Runtime, Security/Resilience, Trust/PKI, Artifact/Release, client authority policy.

Assessment: severity context-dependent MEDIUM–CRITICAL; confidence supported; detectability runtime/reconnect; blast radius client/deployment; reversibility varies; time-to-harm latent/immediate depending on revoked risk; misuse plausible; evidence currentness stale/unknown by definition; false-positive risk high if all offline operation is treated as unsafe without domain policy.

Future remediation disposition: preserve local autonomy under explicitly qualified offline policy; on reconnect reconcile current eligibility and route any confirmed unsafe state. Do not make Fleet availability a workflow prerequisite.

Duplicate-screen disposition: **no new pattern**. Covered by federated continuity/currentness, offline autonomy, trust/revocation and policy qualification families.

### 6. Proof-cardinality pressure causes semantic dimension collapse

Activation conditions: large subject/SBOM/referrer/deployment matrices create storage/query/cardinality pressure and an implementation drops build/provider/tenant/profile dimensions or keeps only top-N evidence.

Incompatible claims/actions/states: bounded operational representation versus an aggregate presented as complete/comparable canonical truth.

Detection candidates: explicit truncation/sampling/completeness metadata; dimensional-loss checks; cardinality/resource budgets; comparison-domain qualification.

Owners: Artifact/Release, Observability/Fleet, FinOps/Capacity, Governance.

Assessment: severity MEDIUM–HIGH; confidence supported; detectability design/runtime/audit; blast radius analytical/fleet; reversibility potentially difficult if discarded evidence is unrecoverable; time-to-harm cumulative; misuse accidental/likely under pressure; false-positive risk medium because bounded summaries are legitimate when claim strength is reduced.

Future remediation disposition: preserve causal dimensions required by the question or explicitly weaken completeness/confidence; do not ban bounded rollups.

Duplicate-screen disposition: **no new pattern**. Covered by resource-boundedness, evidence-completeness, analytical-kind conflation and objective/optimization families.

### 7. Human/AI signing and promotion braid

Activation conditions: human instruction authorizes one bounded step, AI/low-code recommends another, delegated identity can sign, Fleet suggests a capacity/provider change, and composition performs a promotion not explicitly authorized as a whole.

Incompatible claims/actions/states: each primitive individually valid versus combined release/promotion action exceeding semantic/authority constraints.

Detection candidates: composed authority-envelope check; signer versus approver versus promoter identity; SoD; exact target/revision/client context; AI proposal/effect separation.

Owners: Authorization/Policy, Artifact/Release, Trust/PKI, AI/AGWS, Provider/Binding.

Assessment: severity HIGH–CRITICAL; confidence strongly supported; detectability pre-execution/audit; blast radius release/client/fleet; reversibility potentially costly; time-to-harm immediate; misuse accidental/plausible/adversarial; evidence currentness must be current; false-positive risk medium when delegated composite authority is explicitly granted.

Future remediation disposition: require explicit qualified authority for the composite action; otherwise route to human/policy reconciliation. Do not infer authority from Fleet optimization or signature capability.

Duplicate-screen disposition: **no new pattern**. Covered by AI/low-code non-amplification, SoD/authority, trust-authority, objective conflict and provider qualification families.

## Explicit paired-cluster exercise — Enterprise Trust/PKI × Identity × Artifact/Release × provider substitution

Result: **ELIGIBLE NO-NEW-MATERIAL REVISIT; STREAK REMAINS CAPPED AT 2**.

The N-wise cluster exercise combined immutable artifact subjects, potentially incomplete SBOM/provenance sets, builder/run identity, signer/OIDC identity, certificate issuer/root, current organizational authority, verification/admission policy revision, provider registry generation, mutable aliases, residual provider cohorts, offline clients and Fleet analysis.

Strongest composition: every constituent record can be locally valid while the joint cut needed to claim **“this exact artifact is currently eligible for this exact client/deployment under this exact authority/trust/provider context”** remains incomplete or `UNKNOWN`. Existing proof-claim conflation, qualified-join, trust-namespace, trust-authority, compatibility/currentness, provider residual-cohort, federated-continuity and presence/evidence patterns already classify it. No distinct 124th reusable family survives duplicate-screening.

## Processual / semantic conflict-family coverage

The pass deliberately exercised all required families: structural graph; state-transition; semantic ownership; rule/formula/condition; temporal/ordering; resource/capacity; authority/responsibility/separation-of-duty; policy/compliance; data/consistency; provider/integration; version/migration/coexistence; exception/compensation/recovery; human-procedure/instruction; cross-process; objective/optimization; and AI/low-code composition.

For candidates approaching materiality, the register above records activation conditions, incompatible claims/actions/states, detection candidates, owners, severity, confidence, detectability, blast radius, reversibility, time-to-harm, misuse likelihood, evidence currentness, false-positive risk and future remediation disposition. Every candidate duplicate-screens into existing indexed families. No `Signal` is promoted to `ConfirmedConflict` and no `ConflictInstance` is asserted.

## Preventive-invariant disposition

No new preventive invariant is promoted. Existing proof obligations already require explicit subject/revision identity, qualified evidence completeness/currentness, directed compatibility, trust/authority separation, `PARTIAL/UNKNOWN` effect reconciliation, residual-cohort awareness, tenant-qualified attribution and AI/automation non-amplification. A universal central Fleet control requirement would weaken the autonomous-build hypothesis and is not justified.

## Saturation disposition

- New local material edge scenarios: **0**.
- New cross-capability material scenarios: **0**.
- New reusable `G2-CONFLICT-PATTERN-*`: **0**.
- New `ConflictInstance`: **0**.
- New preventive invariant: **0**.
- Artifact / Release / SBOM / Provenance local no-material streak: **remains capped at 2**.
- Enterprise Trust/PKI × Identity × Artifact/Release × provider substitution cluster streak: **remains capped at 2**.
- HIGH/CRITICAL findings without owner/proof/detection route: **0**.
- Material inventory remains **284 edge scenarios + 123 reusable ConflictPatterns = 407 material findings**.
- Full Pass 6 advances **7/28 -> 8/28 capabilities** and **7/12 -> 8/12 mandatory clusters**.
- Completed full passes remain **5/8 minimum**; target reference **12**, no maximum.
- Negative-space remains `NOT_STARTED`.
- Saturation remains `NOT_SATURATED`.
- Planning C remains blocked.

## Next bounded step

Continue only `RESEARCH_ADVERSARIAL_EDGE_CASE_SATURATION`, Full Pass 6, with **Deployment / Runtime / Autonomous Operation** and explicitly exercise **Observability × Security/Recovery × runtime truth** using techniques materially different from Passes 1–5. Carry formal assurance + Typed Semantic Graph/Federation + Autonomous Builds/Fleet into desired/adopted/deployed/runtime-effective/business-converged claim cuts, artifact/release/deployment identity, local journal versus exported telemetry/Fleet aggregate, health versus semantic/security truth, termination versus effect quiescence, rollout/rollback/recovery/fencing interleavings, stale/lossy/late telemetry, `PARTIAL/UNKNOWN`, residual/offline cohorts, authority/trust drift, compatibility direction, resource/capacity pressure, human recovery procedures and AI/low-code placement/provider optimization. Runtime local streak and Observability × Security/Recovery × runtime truth cluster streak are already 2 and must not be inflated. Fleet remains a non-authoritative read/analysis plane by default; GraphDB remains optional/provider-level; do not enter Planning C.
