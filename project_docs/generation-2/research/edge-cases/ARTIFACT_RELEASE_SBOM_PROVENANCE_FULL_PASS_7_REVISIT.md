# Generation 2 — Artifact / Release / SBOM / Provenance — Full Pass 7 Revisit

Status: FULL PASS 7 — ELIGIBLE NO-NEW-MATERIAL REVISIT / LOCAL STREAK CAPPED AT 2 / CLUSTER STREAK CAPPED AT 2
Capability: Artifact / Release / SBOM / Provenance
Paired cluster: Enterprise Trust/PKI × Identity × Artifact/Release × provider substitution
Phase: `RESEARCH_ADVERSARIAL_EDGE_CASE_SATURATION`

Research posture: `CATALOGUE + CLASSIFY + DETECTION_CANDIDATE + FUTURE_REMEDIATION_ROUTE`. No remediation, target architecture, Work Package, TASK, Construction work or `ConflictInstance` is authorized. Preserve `ConflictPattern != ConflictInstance`, `Signal != ConfirmedConflict`, proof-domain non-strengthening, immutable artifact identity distinct from mutable release aliases, authenticity distinct from authorization/admission, historical evidence distinct from current eligibility, and autonomous local/runtime truth distinct from exported Fleet aggregates.

## Full-Pass-7 technique rotation

This revisit differs materially from prior passes by combining temporal-cut falsification, queue-network pressure, causal/counterfactual restraint and provider-substitution residual-cohort analysis:

- **temporal evidence-cut permutation** — vary signing time, attestation creation time, transparency/timestamp evidence time, policy evaluation time, release promotion time, deployment time and later revocation/withdrawal time independently;
- **subject-set partition mutation** — split one release into multiple artifacts/variants and vary whether provenance, SBOM and signatures cover the full product set, one subject, or an ambiguous subset;
- **identity-role permutation** — vary builder identity, signer identity, OIDC issuer/subject, verifier identity, release approver, promoter and client authority while preserving some cryptographic checks;
- **provenance relation typing** — distinguish `builtFrom`, `derivedFrom`, `signedBy`, `attestedBy`, `verifiedBy`, `approvedBy`, `promotedBy`, `deployedAs` and reject transitive causal/authority strengthening;
- **provider substitution with evidence asymmetry** — preserve content digest while changing registry/provider, referrer support, retention, trust roots, timestamp/transparency availability and mutable aliases;
- **shared signing/scanning queue stress** — model signing, SBOM generation, scanning, transparency submission, policy admission and promotion as coupled queues with burstiness, priorities, retries, finite buffers and provider quotas;
- **offline-currentness partition** — keep autonomous clients operational with locally pinned artifact/evidence while Fleet or remote trust/evidence services are unavailable or stale;
- **release graph transformation** — alter product variants, dependency closure, aliases, attestations or provider bindings after earlier proofs and check which proof claims survive;
- **counterfactual restraint** — treat Fleet correlations between release/provider changes and incidents as hypotheses requiring explicit causal assumptions rather than release authority;
- **human/AI promotion braid** — combine human procedures, AI/low-code recommendations, signer capability, Fleet pressure signals and provider optimization while checking composite authority.

All candidate families were duplicate-screened against the authoritative 124 reusable `G2-CONFLICT-PATTERN-*` inventory.

## Fresh portable evidence

- SLSA v1.2 keeps provenance completeness qualified. External parameters are expected to be fully enumerated at stronger levels, while completeness of `resolvedDependencies` remains best effort. Authentic provenance therefore does not imply exhaustive dependency/SBOM closure. Source: https://slsa.dev/spec/v1.2/build-requirements and https://slsa.dev/spec/v1.2/provenance.
- SLSA provenance distinguishes build definition, run details, builder and output subjects. This supports producing-run lineage but does not prove release admission, deployment, runtime use or business convergence.
- OCI Distribution gives immutable digest identity while treating subject/referrer relationships separately. A registry that supports the referrers API signals subject processing with `OCI-Subject`; fallback behavior and provider support can differ. Same content digest therefore does not imply equal evidence/referrer closure. Source: https://specs.opencontainers.org/distribution-spec/.
- Sigstore bundles can carry certificates, transparency-log material and RFC3161 timestamps. For short-lived certificates, temporal evidence is used to establish that signing occurred within certificate validity. Verification also binds expected certificate identity and OIDC issuer. Cryptographic validity remains distinct from current organizational release authority. Sources: https://docs.sigstore.dev/about/bundle/ and https://docs.sigstore.dev/cosign/verifying/verify/.
- Sigstore's security model explicitly depends on transparency/auditability and notes that compromised identity providers or CAs may issue unauthorized certificates whose misuse is detectable only when logs are monitored. Valid certificate/signature evidence is therefore not equivalent to organizational authorization or incident-free status. Source: https://docs.sigstore.dev/about/security/.
- The Update Framework separates timestamp and snapshot roles so clients can detect stale metadata and obtain a consistent repository view. Expiration/currentness and consistency proofs are distinct from artifact byte identity. Source: https://theupdateframework.io/docs/metadata/.
- NIST distinguishes attestations from the underlying low-level artifacts/evidence they summarize. A high-level attestation is a claim supported by evidence, not the evidence universe itself. Source: https://www.nist.gov/itl/executive-order-14028-improving-nations-cybersecurity/software-supply-chain-security-guidance-10.

These are evidence witnesses, not Planning-C decisions or universal implementation prescriptions.

## Priority hypothesis — AUTONOMOUS BUILDS × FLEET OBSERVABILITY/CAPACITY

Disposition: **HIPÓTESE DE ARQUITETURA / EM PESQUISA**.

Retained lineage hypothesis:

`CanonicalCapabilityRef -> CapabilityUse -> BuildRevision/Release -> RuntimeRealization -> Deployment -> NodeInvocation/Attempt`

Artifact/release analysis must remain release/build/deployment-qualified whenever artifact subject set, provider, trust policy, signer identity, provenance/SBOM profile, deployment topology, runtime realization, tenant context or evidence currentness differ or are `PARTIAL/UNKNOWN`.

Aggregation by semantic capability is only meaningful after explicit comparability qualification for the metric and question being asked.

Retained separations:

`semantic topology != build topology != deployment topology != runtime truth != local journal/evidence != exported telemetry != fleet aggregate != control authority`.

`artifact digest identity != release identity != provider evidence-set equivalence`.

`signature authenticity != current organizational authorization`.

`provenance validity != provenance completeness`.

`attestation statement != underlying evidence universe`.

`release eligible != deployed != runtime-used != business-converged`.

`historical observed fact != forecast/simulation/counterfactual`.

`Fleet correlation != causal proof != control authority`.

Fleet remains a read/analysis plane by default; Fleet/export unavailability must not block a correctly autonomous client workflow.

## Queueing / flow / capacity findings

The release pipeline is usefully modeled as a network of queues only when assumptions are explicit. Candidate stages include build output finalization, SBOM/provenance generation, vulnerability/policy scanning, signing/HSM access, transparency/timestamp submission, registry publication, admission/promotion and downstream deployment pickup.

Retained mathematical boundary:

`observed low utilization != current queue health != sustainable capacity != headroom != transient burst tolerance != stability margin`.

A burst of releases, retries after ambiguous provider responses, priority classes, correlated provider failure, finite signing/scanning capacity or shared transparency/admission services can produce long-tail release latency or starvation while average utilization appears acceptable. Little's Law or M/M/1-like models are analysis tools only when stationarity/arrival/service assumptions are sufficiently justified; they are not proof of release safety or semantic convergence.

Provider quota must remain distinct from internal sustainable capacity. A low internal queue with a saturated provider quota can still block promotion; conversely a healthy provider does not prove local signer/scanner capacity.

## Duplicate-screened candidate conflicts

### 1. Temporal-valid signing evidence reused as current release authority

Activation conditions: signature, certificate and timestamp/transparency evidence prove signing at time T, but current Role/Station/delegation/release policy at time T2 differs; a consumer treats historical cryptographic validity as current authorization.

Incompatible claims/actions/states: `artifact was validly signed by identity X at T` versus `X/current policy authorizes promotion/deployment now`.

Detection candidates: bind verification result to identity/issuer/time; separately re-evaluate current release authority and policy revision for the exact client/release action.

Owners: Enterprise Trust/PKI, Identity, Authorization/Policy, Artifact/Release.

Assessment: severity HIGH–CRITICAL; confidence strongly supported; detectability pre-promotion/audit; blast radius release/client/fleet; reversibility may require withdrawal/rollback; time-to-harm immediate after promotion; misuse plausible/adversarial; evidence currentness historical for signing, current required for action; false-positive risk medium where the question is historical authenticity rather than present authority.

Future remediation disposition: require current authority qualification for current actions while preserving historical signature truth.

Duplicate-screen disposition: **no new pattern**. Covered by trust-authority separation, authentication/authorization currentness, revision-vector and proof-claim-conflation families.

### 2. Product/subject-set completeness silently strengthened

Activation conditions: release contains multiple artifacts/variants, provenance/SBOM/attestation covers only a subset or a profile with bounded completeness, and downstream admission assumes complete product closure.

Incompatible claims/actions/states: `statement valid for represented subjects` versus `all release-relevant subjects/dependencies are represented`.

Detection candidates: compare release manifest/product set with attestation subjects, SBOM scope and provenance profile; preserve explicit `PARTIAL/UNKNOWN` completeness.

Owners: Build/Dependency Graph, Artifact/Release, Governance/Security, Provider realization.

Assessment: severity HIGH where security/admission/rollback depends on closure; confidence strongly supported; detectability pre-release/post-build; blast radius release/fleet; reversibility bounded before promotion and potentially costly after deployment; time-to-harm latent/delayed; misuse accidental/plausible; currentness profile/release-qualified; false-positive risk medium for intentionally scoped attestations.

Future remediation disposition: require qualified completeness evidence only when the downstream claim needs exhaustive coverage.

Duplicate-screen disposition: **no new pattern**. Covered by proof-claim conflation, evidence completeness/presence, qualification-join and revision-vector families.

### 3. Same digest after provider substitution, different assurance closure

Activation conditions: immutable artifact bytes are copied to another provider/registry while referrers, signatures, timestamps, provenance, SBOM, trust roots, retention or alias histories differ.

Incompatible claims/actions/states: `same content digest` versus `same release/evidence/trust semantics`.

Detection candidates: provider-qualified evidence enumeration, trust/profile/version/currentness comparison, mutable alias history and residual-provider cohort scan.

Owners: Artifact/Release, Provider/Binding, Enterprise Trust/PKI, Lifecycle/Governance.

Assessment: severity MEDIUM–HIGH; confidence strongly supported; detectability pre-release/audit; blast radius release/provider/client cohorts; reversibility bounded before widespread deployment; time-to-harm delayed; misuse accidental/plausible; evidence currentness provider-qualified; false-positive risk low when evidence equivalence is explicitly claimed.

Future remediation disposition: qualify provider evidence sets and residual cohorts; do not treat content identity as provider-evidence equivalence.

Duplicate-screen disposition: **no new pattern**. Covered by provider evidence/currentness, provider qualification, trust namespace and residual-cohort families.

### 4. Shared signing/scanning queue hides unstable release capacity

Activation conditions: signing, scanning, transparency, admission or registry stages share finite capacity; bursty correlated arrivals/retries or priority rules push one stage near/over stability while average upstream utilization remains low.

Incompatible claims/actions/states: `average load appears healthy` versus `tail latency/backlog/stability margin is unsafe or starvation exists`.

Detection candidates: per-stage arrival/service distributions, queue depth/age, retry ancestry, percentiles, finite-buffer drops, priority starvation, provider quota and stability/headroom estimates with uncertainty.

Owners: Artifact/Release, Developer/Operator Experience, Provider/Binding, Observability/FinOps.

Assessment: severity MEDIUM–HIGH; confidence supported; detectability runtime/operational analysis; blast radius release pipeline/fleet cadence; reversibility bounded by draining/rebalancing but may delay security fixes; time-to-harm cumulative or immediate during urgent release; misuse mostly accidental; evidence currentness highly time-sensitive; false-positive risk medium because transient bursts need not imply instability.

Future remediation disposition: Planning C/D/E should carry queue/capacity semantics, headroom/stability qualification, retry ancestry and workload-admission proof obligations without hard-coding one queueing model.

Duplicate-screen disposition: **no new pattern**. Covered by resource/capacity, objective/optimization, retry amplification and evidence/currentness families.

### 5. Offline client retains valid local artifact while global eligibility becomes unknown

Activation conditions: autonomous client continues operating while SB/Fleet/trust/provider services are unavailable; locally pinned artifact and local evidence remain valid under last-known policy but withdrawal/revocation/current release eligibility cannot be refreshed.

Incompatible claims/actions/states: `local runtime can execute correctly` versus `global/current release eligibility is unknown`.

Detection candidates: explicit offline policy/freshness horizon, local journal, reconnect reconciliation, withdrawal/revocation evidence and cohort identity.

Owners: Deployment/Runtime, Security/Resilience, Artifact/Release, Trust/PKI, client authority policy.

Assessment: severity context-dependent MEDIUM–CRITICAL; confidence supported; detectability runtime/reconnect; blast radius client/deployment; reversibility varies; time-to-harm latent/immediate; misuse plausible; evidence currentness stale/unknown by definition; false-positive risk high if all offline operation is treated as unsafe regardless of policy.

Future remediation disposition: preserve qualified local autonomy; reconcile current eligibility after reconnection. Fleet unavailability is not a workflow failure.

Duplicate-screen disposition: **no new pattern**. Covered by federated continuity/currentness, offline autonomy and trust/revocation qualification families.

### 6. Fleet release correlation strengthened into causal or control authority

Activation conditions: Fleet observes incident/cost/latency movement correlated with release, provider or signer changes; analysis or AI ranks one intervention and automation treats that ranking as causal proof or authorization to act.

Incompatible claims/actions/states: `observed co-movement/model estimate` versus `causal effect established` versus `control action authorized`.

Detection candidates: explicit causal question, model/graph, confounders, temporal order, selection/missingness, cohort/build compatibility, uncertainty and separate authority check.

Owners: Observability/Fleet, Artifact/Release, Provider/Binding, Governance/Authorization, AI/low-code.

Assessment: severity HIGH where automated rollback/provider switching is possible; confidence strongly supported as an analytical boundary; detectability design/pre-actuation/audit; blast radius release/client/fleet; reversibility may be costly; time-to-harm immediate after wrong actuation; misuse accidental/plausible; evidence currentness model- and cohort-dependent; false-positive risk high for naive correlational detectors.

Future remediation disposition: keep causal/counterfactual analysis research-only/analysis-plane unless later proof and authority boundaries are explicit; never infer actuation authority from correlation.

Duplicate-screen disposition: **no new pattern**. Covered by analytical-kind conflation, objective/optimization, authority non-amplification and evidence-qualification families.

### 7. Human/AI promotion sequence composes individually valid steps into unauthorized release effect

Activation conditions: human runbook authorizes one step, AI/low-code proposes another, signer capability exists, Fleet signals pressure, provider supports promotion and the combined sequence crosses an authority or release-policy boundary.

Incompatible claims/actions/states: each local action is individually valid versus composite release effect lacks explicit authority/SoD/policy qualification.

Detection candidates: composite action envelope, signer/approver/promoter separation, exact release/client/provider target, current policy revision, AI proposal/effect separation and human instruction provenance.

Owners: Authorization/Policy, Artifact/Release, Enterprise Trust/PKI, AI/AGWS, Provider/Binding.

Assessment: severity HIGH–CRITICAL; confidence strongly supported; detectability pre-execution/audit; blast radius release/client/fleet; reversibility potentially costly; time-to-harm immediate; misuse accidental/plausible/adversarial; evidence currentness current required; false-positive risk medium where composite delegation is explicitly granted.

Future remediation disposition: require explicit composite authority or route to human/policy reconciliation; do not infer authority from signing ability or Fleet optimization.

Duplicate-screen disposition: **no new pattern**. Covered by AI/low-code authority non-amplification, SoD/delegation, trust-authority and objective-conflict families.

## Explicit paired-cluster exercise — Enterprise Trust/PKI × Identity × Artifact/Release × provider substitution

Result: **ELIGIBLE NO-NEW-MATERIAL REVISIT; STREAK REMAINS CAPPED AT 2**.

The cluster exercise combined artifact digest/subject set, release identity, provenance/SBOM scope, builder identity, signer/OIDC identity and issuer, trust root/timestamp/transparency evidence, current organizational authorization, mutable aliases, registry/provider substitution, residual cohorts, queue pressure, offline clients and Fleet analysis.

Strongest composition: every constituent item can be locally valid while the joint claim **“this exact product/release is currently eligible for this exact client/deployment under this exact signer/trust/policy/provider context”** remains incomplete, stale or `UNKNOWN`. Existing proof-claim conflation, qualified-join, trust namespace/authority, currentness, provider residual-cohort, presence/evidence and analytical-kind families already classify it. No distinct 125th reusable family survives duplicate-screening.

## Processual / semantic conflict-family coverage

The pass deliberately exercised structural graph, state-transition, semantic ownership, rule/formula/condition, temporal/ordering, resource/capacity, authority/responsibility/separation-of-duty, policy/compliance, data/consistency, provider/integration, version/migration/coexistence, exception/compensation/recovery, human-procedure/instruction, cross-process, objective/optimization and AI/low-code composition.

No `Signal` is promoted to `ConfirmedConflict`; no `ConflictInstance` is asserted.

## Planning C / D / E carry-forward candidates

Research-only handoff candidates, not materialized architecture:

- queue/capacity semantics for signing/scanning/transparency/admission/promotion networks;
- stability/headroom versus observed utilization distinction;
- workload admission, fairness and retry-ancestry proof obligations;
- explicit `ResourcePressureVector`, `RiskVector`, `ComplexityVector` and `CapabilityOperationalVector` dimensional preservation;
- scalarization only under explicit, versioned, auditable policy;
- provider/optimization boundary constrained by semantic compatibility, authority and data locality;
- temporal evidence/currentness and residual-cohort qualification;
- causal/counterfactual analysis boundary separated from control authority;
- product proof that artifact identity, attestation validity, release eligibility, deployment and runtime/business convergence are distinct claims.

## Saturation disposition

- New local material edge scenarios: **0**.
- New cross-capability material scenarios: **0**.
- New reusable `G2-CONFLICT-PATTERN-*`: **0**.
- New `ConflictInstance`: **0**.
- New preventive invariant: **0**.
- Artifact / Release / SBOM / Provenance local no-material streak: **remains capped at 2**.
- Enterprise Trust/PKI × Identity × Artifact/Release × provider substitution cluster streak: **remains capped at 2**.
- HIGH/CRITICAL findings without owner/proof/detection route: **0**.
- Material inventory remains **284 edge scenarios + 124 reusable ConflictPatterns = 408 material findings**.
- Full Pass 7 advances to **8/28 capabilities and 8/12 mandatory clusters**.
- Planning C remains blocked; completed full passes remain **6/8 minimum**, target **12**, negative-space `NOT_STARTED`, saturation `NOT_SATURATED`.

Next focus: **Deployment / Runtime / Autonomous Operation**, explicitly exercising **Observability × Security/Recovery × runtime truth** with Autonomous Builds/Fleet, queue/flow/capacity mathematics, temporal/uncertainty and causal non-strengthening. Runtime and the paired cluster streak are already capped at 2 and must not inflate absent material novelty.
