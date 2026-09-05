# Generation 2 — Artifact / Release / SBOM / Provenance — Full Pass 3 Revisit

Status: FULL PASS 3 — ELIGIBLE NO-NEW-MATERIAL REVISIT / LOCAL STREAK 1 / CLUSTER STREAK 1
Capability: Artifact / Release / SBOM / Provenance
Paired cluster: Enterprise Trust/PKI × Identity × Artifact/Release × provider substitution
Phase: `RESEARCH_ADVERSARIAL_EDGE_CASE_SATURATION`

Research posture: `CATALOGUE + CLASSIFY + DETECTION_CANDIDATE + FUTURE_REMEDIATION_ROUTE`. This dossier creates no implementation, target architecture, Work Package, TASK, Construction work or `ConflictInstance`. Preserve `ConflictPattern != ConflictInstance`, `Signal != ConfirmedConflict`, signature/authenticity distinct from authorization/admission, immutable subject identity distinct from mutable release references, and qualified evidence/currentness.

## Pass-3 technique rotation

This revisit deliberately differed from Full Pass 1 and Full Pass 2 by using:

- release-set subtraction and addition mutation: remove or add one independently valid subject/attestation and test whether release-level claims silently retain their strength;
- policy-digest substitution: hold verifier/result constant while changing the exact verification/admission policy revision;
- attestation dependency-cut mutation: hold a top-level VSA/provenance valid while varying completeness/currentness of referenced attestations and dependency evidence;
- authority-time braid: interleave signing, role/organizational authority change, trust rotation/revocation, promotion and consumer verification;
- mutable-reference split-brain: move tag/channel/alias while digest-addressed subjects and residual provider/distribution cohorts remain valid;
- verifier-delegation inversion: treat a valid verifier statement as stronger than the verifier's qualified policy, evidence bundle or current authority permits;
- SBOM correlation mutation: preserve component names/versions while changing digest, namespace, build subject or release membership to test false identity joins;
- graph/cardinality pressure: increase subjects, attestations, referrers and dependency evidence until verification/reconciliation pressure tempts evidence omission or weakened policy;
- AI/low-code release mutation: compose individually permitted signing, attestation, promotion and provider actions into an aggregate release operation and test authority/policy preservation.

All candidates were duplicate-screened against the 115 reusable `G2-CONFLICT-PATTERN-*` families before classification.

## Portable evidence refresh

Fresh evidence reinforces existing classes rather than opening a new reusable conflict family:

- SLSA Build Provenance v1.2 models a build as producing one or more `subject` artifacts and explicitly binds build semantics to `builder.id`, `buildType`, external parameters and resolved dependencies. This reinforces qualified provenance semantics rather than signature-only or digest-only admission: https://slsa.dev/spec/v1.2/build-provenance
- SLSA distribution guidance states that one release can contain multiple artifacts built at different times and that its attestation set may grow over time. This continues to support release-set closure/currentness as a qualified claim rather than an inference from individually valid members: https://slsa.dev/spec/draft/distributing-provenance
- SLSA Verification Summary Attestation v1.2 binds a verification result to a verifier, a policy resource whose exact version should be identified by digest, and optionally the complete set of input attestations used. A `PASSED` result is therefore not a context-free universal release claim: https://slsa.dev/spec/v1.2/verification_summary
- Sigstore's threat model distinguishes proof that a signature came from an authenticated identity at a time from the policy decision that the identity should be trusted/authorized for a particular artifact/action; it also documents freshness, rotation and revocation of trust material: https://docs.sigstore.dev/about/threat-model/
- OCI Distribution distinguishes immutable content digest from a human-readable tag pointer to a manifest and allows zero, one or many tags per manifest. This reinforces mutable-reference versus immutable-subject identity: https://specs.opencontainers.org/distribution-spec/

Provider/ecosystem mechanisms are evidence examples only and are not promoted to universal System Builder architecture.

## Duplicate-screened local probes

### 1. Subject-set completeness and multi-artifact atomicity

Probe: all currently observed members verify, but one valid subject/attestation is added, removed, delayed or superseded while the logical release identity remains stable.

Disposition: already represented by `G2-EDGE-ARTIFACT-008` plus qualification-join, qualified-claim, currentness, revision-vector and distribution-convergence families. Per-member validity does not prove release-set closure. No new class survives.

### 2. Provenance/SBOM from non-coherent dependency/build cuts

Probe: provenance, SBOM and release manifest are each valid but were generated against different effective dependency/build cuts or subject revisions.

Disposition: existing attestation-qualification, effective-identity, qualification-join, revision-vector and provenance/currentness families already classify this. No new class survives.

### 3. Signature validity versus current organizational authority/trust

Probe: cryptographic verification succeeds although signer Role/Station/organization authority, admission policy or trust material changed before promotion/consumption.

Disposition: existing trust-authority, effective-identity, authority-currentness and qualified-claim patterns cover the conflict. A signature signal remains authenticity evidence, not automatic current authorization. No new class survives.

### 4. Predicate/build-type semantic skew

Probe: two authentic attestations use compatible-looking fields but different predicate/build-type/profile semantics.

Disposition: exactly `G2-EDGE-ARTIFACT-009` plus provider/profile semantic qualification. No new class survives.

### 5. Signing/promotion/revocation races and mutable aliases

Probe: a valid subject is signed, authority/trust changes, promotion succeeds on some paths, and tag/channel/alias movement races with revocation or supersession.

Disposition: transition-race, currentness, ambiguous-effect, revision-vector, adoption/convergence and mutable-reference/effective-identity families already cover the composition. No new class survives.

### 6. Publication/revocation `PARTIAL/UNKNOWN` and residual cohorts

Probe: publication, withdrawal or revocation is acknowledged by some providers/registries while old cohorts, caches or disconnected consumers retain prior subjects/evidence.

Disposition: existing ambiguous-effect, provider qualification, residual-cohort, distribution-convergence and reconcile-before-retry families apply. No new class survives.

### 7. SBOM identity/correlation ambiguity

Probe: name/version or provider-native coordinates match while digest, namespace, build subject or canonical release membership differ.

Disposition: effective-identity, provider-native-identity boundary, semantic ownership and qualified correlation patterns already classify this. No new class survives.

### 8. Attestation graph/cardinality exhaustion

Probe: a valid release has a very large subject/referrer/dependency/attestation graph and verification pressure induces omission, sampling or stale cached verdict reuse.

Disposition: resource-boundedness plus evidence completeness/currentness patterns already cover the risk. Resource pressure may weaken a claim to `PARTIAL/INCONCLUSIVE`; it may not silently strengthen it. No new class survives.

### 9. AI/low-code release composition

Probe: an AI/low-code composition uses individually authorized signing, verifier, provider and promotion operations but the aggregate release scope, trust roots, subject set or policy reach exceeds the user's effective authority.

Disposition: existing AI/low-code authority non-amplification, semantic ownership, trust-authority and cross-scope policy patterns apply. No new class survives.

## Explicit paired-cluster revisit — Enterprise Trust/PKI × Identity × Artifact/Release × provider substitution

Result: **ELIGIBLE NO-NEW-MATERIAL REVISIT**.

The cluster was explicitly challenged with N-wise trust/authority/policy/currentness cuts rather than inferred from local artifact analysis. The central adversarial case remains: each release member can be individually authentic and historically valid while the composed cohort has no common qualified trust + identity/authority + release-policy + provider/currentness cut. This remains `G2-XEDGE-TRUST-IDENTITY-ARTIFACT-PROVIDER-005` and the existing qualification-join, trust-authority, currentness, revision-vector, provider-qualification and migration/coexistence families.

Policy-digest substitution, trust-root rotation, signer-role change, provider substitution, residual distribution cohorts and offline verification horizons did not reveal a new reusable conflict family. The cluster therefore advances **0 → 1**. This is not proof that no concrete `ConflictInstance` can occur.

## Conflict classification coverage

The revisit deliberately exercised structural graph, state-transition, semantic ownership, rule/condition, temporal/ordering, resource/capacity, authority/responsibility/separation-of-duty, policy/compliance, data/consistency, provider/integration, version/migration/coexistence, exception/recovery, human-procedure, cross-process, objective/optimization and AI/low-code composition dimensions where applicable.

No new material conflict class lacks an owner, detection route or future remediation vocabulary. No signal was promoted to `ConfirmedConflict`.

## Preventive invariant candidate disposition

No new preventive invariant candidate is elevated. Existing candidates already require qualified subject/release identity, evidence/currentness, trust/authority qualification, explicit effect disposition and authority non-amplification. A stronger universal rule could incorrectly reject intentionally open-ended releases, authorized historical signatures or bounded provider coexistence.

## Saturation disposition

- New local material edge scenarios: **0**.
- New cross-capability material scenarios: **0**.
- New reusable `G2-CONFLICT-PATTERN-*`: **0**.
- New `ConflictInstance`: **0**.
- Artifact / Release / SBOM / Provenance local no-material streak: **0 → 1**.
- Enterprise Trust/PKI × Identity × Artifact/Release × provider substitution cluster no-material streak: **0 → 1**.
- HIGH/CRITICAL findings without owner/proof/detection route: **0**.
- Material inventory remains **278 edge scenarios + 115 reusable ConflictPatterns = 393 findings**.
- Full Pass 3 advances to **8/28 capabilities + 8/12 mandatory clusters**.
- Completed full passes remain **2/8 minimum**; target reference **12**, no maximum.
- Negative-space remains `NOT_STARTED`.
- Saturation remains `NOT_SATURATED`.
- Planning C remains blocked.

## Next bounded step

Continue only Full Pass 3 with **Deployment / Runtime / Autonomous Operation** and explicitly revisit **Observability × Security/Recovery × runtime truth**, using techniques materially different from Full Passes 1 and 2 and duplicate-screen against all 115 reusable ConflictPatterns. Challenge desired/adopted/deployed/effective/converged revision joins; rollout cohorts and control-plane success versus business effect; health/readiness versus semantic correctness/security posture; deploy/rollback/recovery/fencing races; rollback after schema/config/provider/trust evolution; mutating effects `PARTIAL/UNKNOWN`; residual/offline runtime cohorts; stale or lossy observability; runtime authority drift; resource pressure; and AI/low-code runtime composition that amplifies authority or suppresses required evidence. Do not enter Planning C.
