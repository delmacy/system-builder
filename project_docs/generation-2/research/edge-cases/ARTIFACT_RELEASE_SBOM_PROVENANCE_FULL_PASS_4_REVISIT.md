# Generation 2 — Artifact / Release / SBOM / Provenance — Full Pass 4 Revisit

Status: FULL PASS 4 — ELIGIBLE NO-NEW-MATERIAL REVISIT / LOCAL STREAK 2 / CLUSTER STREAK 1
Capability: Artifact / Release / SBOM / Provenance
Paired cluster: Enterprise Trust/PKI × Identity × Artifact/Release × provider substitution
Phase: `RESEARCH_ADVERSARIAL_EDGE_CASE_SATURATION`

Research posture: `CATALOGUE + CLASSIFY + DETECTION_CANDIDATE + FUTURE_REMEDIATION_ROUTE`. No remediation, target architecture, Work Package, TASK, Construction work or `ConflictInstance` is authorized. Preserve `ConflictPattern != ConflictInstance`, `Signal != ConfirmedConflict`, immutable subject identity distinct from mutable references, authenticity distinct from authorization/admission, and qualified evidence/currentness.

## Full-Pass-4 technique rotation

This revisit intentionally differed from Full Passes 1–3 by using:

- **evidence-closure mutation**: preserve artifact bytes and a passing verifier result while adding/removing referenced attestations, dependency evidence or verifier input disclosure;
- **presence-semantics mutation**: vary attestation fields across ABSENT/UNSET, `null`, empty, explicit default and explicit negative/delete-like semantics without changing surrounding syntax;
- **trust-domain transposition**: preserve signer labels/claims while moving issuer, trust root, federation/provider namespace or registry/provider generation;
- **copy/promotion closure mutation**: preserve digest-addressed artifact bytes while varying whether signatures, SBOMs, provenance, referrers and policy evidence survive provider/registry copy or promotion;
- **historical/current policy braid**: interleave signing timestamp, trust eligibility, canonical organizational authority, verification-policy digest, promotion and later replay/rollback;
- **publication effect braid**: interleave publish/sign/attest/promote/revoke operations under `APPLIED / NOT_APPLIED / PARTIAL / UNKNOWN` and residual provider cohorts;
- **human-procedure contradiction probe**: compare individually valid release instructions whose ordering or evidence requirements cannot jointly hold at one release cut;
- **resource/cardinality escalation**: increase subjects, signatures, SBOM components, provenance edges and verifier inputs until bounded verification risks evidence omission or stale verdict reuse;
- **AI/low-code authority-delta mutation**: compose individually permitted signing, attestation, promotion and provider actions and compare aggregate authority/trust reach with the actor's canonical envelope.

All candidate classes were duplicate-screened against the 119 reusable `G2-CONFLICT-PATTERN-*` inventory.

## Portable evidence refresh

- SLSA Verification Summary Attestation v1.2 binds a verifier decision to a specific `policy` resource and recommends the exact policy version be identified by digest. `inputAttestations` may be absent, while a non-empty field must enumerate all attestations used. A passing VSA is therefore a qualified statement under a verifier/policy/evidence context, not a context-free release truth: https://slsa.dev/spec/v1.2/verification_summary
- The same VSA specification distinguishes an unset/null `dependencyLevels` from an explicitly empty map: unset/null means the verifier makes no claim about dependencies, while empty means there are no dependencies. This directly exercises the already-catalogued presence-semantics family rather than creating a new one: https://slsa.dev/spec/v1.2/verification_summary
- Sigstore/Cosign verification binds signatures to artifact digest by default and identity-based verification requires expected signer identity plus issuer. Verification can also rely on signed timestamp/transparency evidence. These are qualified authenticity/time claims and do not establish canonical organizational release authority by themselves: https://docs.sigstore.dev/cosign/verifying/verify/ and https://docs.sigstore.dev/cosign/verifying/timestamps/
- Sigstore bundles may contain transparency-log and timestamp verification material, again reinforcing that evidence type, trust source and verification time/profile matter separately from authorization/admission: https://docs.sigstore.dev/about/bundle/

These sources are evidence examples only. Their provider-specific mechanisms are not promoted to universal System Builder architecture.

## Duplicate-screened local probes

### 1. VSA `PASSED` with incomplete or undisclosed verifier inputs

Probe: the artifact, verifier identity and policy reference remain valid while `inputAttestations` is absent or while downstream consumers cannot independently reconstruct the verifier's evidence closure.

Disposition: already covered by `G2-EDGE-ARTIFACT-002`, `G2-CONFLICT-PATTERN-ATTESTATION-QUALIFICATION-001`, qualified-claim/currentness and evidence-completeness patterns. A verifier may intentionally conceal pipeline detail; absence weakens what downstream parties can independently assert but is not itself a defect. No new material class survives.

### 2. ABSENT/null/empty dependency semantics in verification evidence

Probe: `dependencyLevels` changes among absent/null and explicit empty while the surrounding VSA remains syntactically valid.

Disposition: exactly exercises `G2-CONFLICT-PATTERN-PRESENCE-SEMANTICS-001` plus attestation qualification. `no dependency claim` must not be strengthened into `verified no dependencies`. No new pattern or scenario survives duplicate-screen.

### 3. Digest-preserving artifact copy with evidence-set divergence

Probe: artifact bytes retain the same immutable digest after registry/provider copy or promotion, while SBOM/provenance/signatures/referrers/trust evidence are missing, delayed, duplicated or provider-scoped differently.

Disposition: already represented by `G2-EDGE-ARTIFACT-001`, `002`, `008`, `009`, distribution-convergence, provider-qualification, qualification-join and evidence-currentness families. Byte identity does not prove evidence-set closure or policy equivalence. No new class survives.

### 4. Signer label preserved across trust/federation namespace change

Probe: signer-visible identity is unchanged while issuer, root, federation mapping, provider generation or canonical Role/Station mapping changes.

Disposition: existing trust-namespace-collapse, effective-identity, trust-authority and currentness patterns already capture the risk. Provider-native identity remains realization evidence, not canonical organizational authority. No new class survives.

### 5. Historical signature validity versus current replay/rollback eligibility

Probe: a timestamped signature remains cryptographically valid for an immutable subject while current release policy, runtime support, trust profile, dependency eligibility or provider binding has changed.

Disposition: `G2-EDGE-ARTIFACT-003`, `006`, compatibility-direction, recovery/rollback eligibility and currentness patterns already classify the distinction. Historical authenticity cannot silently become current admission eligibility. No new class survives.

### 6. Concurrent sign/promote/revoke with `PARTIAL/UNKNOWN` external effects

Probe: signing/promotion/revocation receives incomplete acknowledgements while registries, mirrors, transparency or signing providers retain mixed observations.

Disposition: existing ambiguous-effect, distribution-convergence, provider-cohort and reconcile-before-retry families apply. No new class survives.

### 7. Human release procedures individually valid but jointly inconsistent

Probe: one instruction requires promotion immediately after signature verification while another requires a later SBOM/provenance or approval cut before the same promotion.

Disposition: existing human-procedure, temporal-ordering, policy/authority and qualification-join conflict families cover this. The detector candidate is a release-procedure partial-order/evidence-precondition comparison; a signal is not a confirmed conflict. No new reusable family survives.

### 8. Resource pressure causing verification coverage loss

Probe: extremely large subject/attestation/SBOM graphs exceed time, memory, provider quota or human review capacity and tempt sampling or cached verdict reuse.

Disposition: `G2-EDGE-ARTIFACT-007` plus resource-boundedness and evidence-completeness/currentness patterns already cover this. Bounded verification may weaken to `PARTIAL/INCONCLUSIVE`; it may not silently strengthen the claim. No new class survives.

### 9. AI/low-code release composition across trust/provider domains

Probe: an AI/low-code flow chains valid provider sign, verify, copy, attest and promote primitives across domains whose combined signing/promotion/trust reach exceeds the human actor's canonical authority.

Disposition: existing AI/low-code non-amplification, trust-authority, provider-qualification, trust-namespace-collapse and authority-currentness patterns classify this. No new class survives.

## Explicit paired-cluster exercise — Enterprise Trust/PKI × Identity × Artifact/Release × provider substitution

Result: **ELIGIBLE NO-NEW-MATERIAL REVISIT**.

The cluster was exercised independently from the local Artifact review using N-wise combinations of signer identity, issuer/root namespace, canonical Role/Station authority, artifact subject set, verification-policy digest, provider generation, publication effect and residual registry cohorts.

The strongest adversarial case remains the already catalogued composition: every observed member can be authentic and locally valid under some trust/provider context while the release cohort lacks one jointly qualified trust + identity/authority + policy + provider/currentness cut (`G2-XEDGE-TRUST-IDENTITY-ARTIFACT-PROVIDER-005`). Trust-domain transposition and provider-copy evidence divergence do not create a new reusable family beyond trust-namespace-collapse, trust-authority, qualification-join, provider-qualification, distribution-convergence and currentness.

Because the authoritative saturation state before this run records this mandatory cluster at streak `0`, this explicit eligible revisit advances it **0 → 1**. This is not a statement that the cluster is saturated or free of concrete conflicts.

## Conflict-class coverage

The pass explicitly checked structural graph, state-transition, semantic ownership, rule/condition, temporal/ordering, resource/capacity, authority/responsibility/separation-of-duty, policy/compliance, data/consistency, provider/integration, version/migration/coexistence, exception/compensation/recovery, human-procedure, cross-process, objective/optimization and AI/low-code composition dimensions where applicable.

No candidate escaped the existing 119-pattern catalogue. No HIGH/CRITICAL class lacks semantic/authority owners, detection candidate or future remediation vocabulary. No signal was promoted to a `ConfirmedConflict`.

## Preventive-invariant disposition

No new preventive invariant is promoted. Existing proof obligations already require qualified immutable subject identity, explicit evidence/currentness, trust and canonical authority separation, semantic provider qualification, effect disposition, release-set qualification and authority non-amplification. A stronger universal rule would risk rejecting legitimate historical verification, intentionally confidential verifier evidence or bounded provider coexistence.

## Saturation disposition

- New local material edge scenarios: **0**.
- New cross-capability material scenarios: **0**.
- New reusable `G2-CONFLICT-PATTERN-*`: **0**.
- New `ConflictInstance`: **0**.
- Artifact / Release / SBOM / Provenance local no-material streak: **1 → 2**.
- Enterprise Trust/PKI × Identity × Artifact/Release × provider substitution cluster no-material streak: **0 → 1**.
- HIGH/CRITICAL findings without owner/proof/detection route: **0**.
- Material inventory remains **284 edge scenarios + 119 reusable ConflictPatterns = 403 material findings**.
- Full Pass 4 advances from **7/28 → 8/28 capabilities** and **6/12 → 7/12 mandatory clusters**.
- Completed full passes remain **3/8 minimum**; target reference **12**, no maximum.
- Negative-space remains `NOT_STARTED`.
- Saturation remains `NOT_SATURATED`.
- Planning C remains blocked.

## Next bounded step

Continue only `RESEARCH_ADVERSARIAL_EDGE_CASE_SATURATION`, Full Pass 4, with **Deployment / Runtime / Autonomous Operation** and explicitly exercise **Observability × Security/Recovery × runtime truth**. Use techniques materially different from Full Passes 1–3 and duplicate-screen against all 119 reusable ConflictPatterns. Challenge desired/adopted/deployed/runtime-effective/business-converged revision joins; health/readiness versus semantic/security truth; termination/control-plane disappearance versus effect quiescence; rollout/rollback/recovery/fencing races; stale or lossy observability; `PARTIAL/UNKNOWN` mutation outcomes; residual/offline runtime cohorts; authority/trust drift while work is in flight; compatibility-direction after schema/config/provider/trust evolution; resource pressure; conflicting human recovery/runbook instructions; and AI/low-code runtime composition that amplifies authority, suppresses evidence or optimizes availability against containment/recovery policy. Preserve research-only disposition and do not enter Planning C.
