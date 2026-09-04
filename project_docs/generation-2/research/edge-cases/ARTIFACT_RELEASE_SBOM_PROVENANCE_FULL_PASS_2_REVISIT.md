# Generation 2 — Artifact / Release / SBOM / Provenance Full Pass 2 Revisit

Status: FULL PASS 2 — MATERIAL FINDINGS / LOCAL STREAK 0 / CLUSTER STREAK 0
Capability: Artifact / Release / SBOM / Provenance
Paired cluster: Enterprise Trust/PKI × Identity × Artifact/Release × provider substitution
Phase: `RESEARCH_ADVERSARIAL_EDGE_CASE_SATURATION`

Research posture: `CATALOGUE + CLASSIFY + DETECTION_CANDIDATE + FUTURE_REMEDIATION_ROUTE`. No remediation, Work Package, TASK or target architecture is authorized. `ConflictPattern != ConflictInstance`; `Signal != ConfirmedConflict`.

## Technique rotation

This revisit used release-set qualified-cut analysis, multi-subject atomicity probes, attestation semantic-profile differential, mutable-reference/adoption-revision analysis, stale trust/currentness probes, concurrent promotion/revocation/supersession cuts, partial-publication thought experiments, residual-provider cohort analysis, very-large attestation graph pressure and AI/low-code authority-composition review. These differ materially from the Full-Pass-1 subject-identity/authenticity/retry baseline.

## Evidence anchors

- SLSA provenance models one build as producing one or more `subject` artifacts and distinguishes builder/buildType/external parameters/resolved dependencies; downstream consumers must verify the relevant semantics rather than infer them from signature presence alone. https://slsa.dev/spec/v1.2-rc2/build-provenance
- SLSA distribution guidance notes that a release may contain multiple artifacts built at different times and that its attestation set may grow over time. Therefore an individually valid artifact attestation does not by itself establish a closed, coherent release subject-set. https://slsa.dev/spec/draft/distributing-provenance
- OCI Distribution defines a tag as a human-readable pointer to a manifest while digest is content identity; tag equality is therefore not immutable subject identity. https://specs.opencontainers.org/distribution-spec/
- Sigstore's threat model distinguishes cryptographic identity/trust from the policy decision whether that identity should be trusted for a particular action, and trust material has freshness/rotation/revocation semantics. https://docs.sigstore.dev/about/threat-model/

These are portable evidence anchors only; product-specific mechanisms are not universalized.

## Duplicate screen against 115 reusable ConflictPatterns

The candidate space was checked against existing qualification-join, qualified-claim, currentness, revision-vector, effective-identity, attestation-qualification, trust-authority, provider-qualification, distribution-convergence, migration/coexistence, ambiguous-effect and AI/low-code authority patterns. Two local scenarios and one paired-cluster scenario remain materially distinct at scenario level, but none justifies a new reusable ConflictPattern family.

## New local material scenarios

### G2-EDGE-ARTIFACT-008 — individually valid release members do not prove one coherent release subject-set

**Preconditions / activation conditions:** a logical release contains multiple platform/architecture/package artifacts or attestations produced at different times; each member independently verifies; the declared release set can still grow, shrink or be superseded.

**Incompatible claims/actions/states:** `each observed artifact/attestation is individually valid` conflicts with `the observed set is the complete/current canonical release cohort at one qualified cut`.

**Why local validation may miss it:** per-artifact verification has no obligation to prove release-set closure, shared adoption revision or multi-artifact atomicity.

**Detection candidate/stage:** pre-promotion and post-publication qualified-cut check over canonical release revision, expected subject-set membership, immutable subject identities, attestation generation/currentness and observed distribution cohorts.

**Expected safe behavior / diagnostic expectation:** qualify the release claim at set level. Missing, extra, stale or differently adopted members yield `PARTIAL/INCONCLUSIVE` rather than a stronger release-complete claim.

**Forbidden behavior:** infer release completeness or atomic promotion because every currently enumerated artifact verifies independently.

**Effect/failure disposition:** `PARTIAL/INCONCLUSIVE` until one coherent canonical subject-set/adoption cut is evidenced.

**Owners:** Artifact/Release primary; Build, Lifecycle, Provider/Binding and Standards supporting.

**Severity:** CRITICAL. **Confidence:** strongly supported. **Detectability:** pre-execution + runtime/post-effect. **Blast radius:** release fleet/external consumers. **Reversibility:** bounded before widespread adoption, difficult after distribution. **Time-to-harm:** immediate/latent. **Misuse likelihood:** plausible accidental. **Evidence currentness:** current release revision plus bounded provider observations. **False-positive risk:** medium where releases explicitly declare open-ended membership; such cases must weaken the claim rather than be rejected automatically.

**Future remediation disposition:** require explicit release-set qualification/reconciliation or human adoption of a bounded subject set; preserve history rather than overwrite prior membership.

**Proof obligation:** `ARTIFACT-P2-PROOF-008` — demonstrate that independently valid members cannot be promoted to a complete/current release claim without qualified subject-set closure.

### G2-EDGE-ARTIFACT-009 — authentic attestations with different predicate/build semantic profiles are composed as equivalent evidence

**Preconditions / activation conditions:** provider/version substitution yields attestations that are syntactically valid and authentic but differ in predicate semantics, buildType interpretation, dependency completeness, tenant-controlled fields, verifier assumptions or profile version.

**Incompatible claims/actions/states:** `attestation verifies under its native profile` conflicts with `attestation satisfies the same portable release policy claim as another profile`.

**Why local validation may miss it:** signature/schema verification can succeed while semantic meaning, completeness guarantees or trusted producer boundary differ.

**Detection candidate/stage:** static/pre-promotion semantic-profile qualification comparing predicate type/version, buildType contract, required fields, trusted producer boundary, completeness/currentness guarantees and policy-required claim strength.

**Expected safe behavior / diagnostic expectation:** preserve provider/profile-specific semantics as realization evidence and only lift to a portable canonical claim when the required semantic support vector is qualified.

**Forbidden behavior:** treat matching field names, valid signatures or provider feature labels as proof of equivalent provenance/SBOM semantics.

**Effect/failure disposition:** `INCONCLUSIVE/NON_CONFORMING` for the stronger portable claim until equivalence or bounded difference is established.

**Owners:** Artifact/Release + Standards/Interoperability + Provider/Binding; Trust/PKI for authenticity only.

**Severity:** HIGH–CRITICAL. **Confidence:** strongly supported. **Detectability:** design-time/pre-release. **Blast radius:** release fleet/supply chain. **Reversibility:** bounded pre-promotion. **Time-to-harm:** latent/immediate on policy admission. **Misuse likelihood:** likely accidental. **Evidence currentness:** current profile/provider generation. **False-positive risk:** medium where profiles are explicitly mapped with bounded semantic equivalence.

**Future remediation disposition:** qualify/adopt the profile mapping, require additional evidence, or keep the stronger claim `INCONCLUSIVE`; do not invent provider equivalence.

**Proof obligation:** `ARTIFACT-P2-PROOF-009` — provider/profile substitution cannot strengthen portable release evidence without semantic qualification.

## New cross-capability material scenario

### G2-XEDGE-TRUST-IDENTITY-ARTIFACT-PROVIDER-005 — all members are individually trusted but no common trust/authority/currentness cut exists for the release cohort

**Activation conditions:** a multi-artifact release spans signing-key rotations, identity/Role changes, policy revisions or provider substitution; each artifact verifies under some historically valid trust/authority context, but the contexts do not overlap into one release-level qualified cut.

**Incompatible claims/actions/states:** `member A valid under context A` + `member B valid under context B` conflicts with `the composed release cohort is jointly admissible under one current canonical release policy/adoption revision`.

**Why local validation may miss it:** each verifier evaluates one artifact/signature independently and can return success without proving cross-member policy coherence.

**Detection candidate/stage:** pre-promotion N-wise qualification join across subject-set revision, signing-time trust evidence, canonical signer authority scope, current admission policy, provider generation and residual cohorts.

**Expected safe behavior:** release-level admission remains `PARTIAL/INCONCLUSIVE` unless the cohort has an explicitly accepted qualified join or bounded migration/coexistence disposition.

**Forbidden behavior:** aggregate per-member green checks into a joint release-safe claim when their trust/authority/policy qualification contexts are mutually incompatible or non-overlapping.

**Effect/failure disposition:** `PARTIAL/INCONCLUSIVE`; reconcile/adopt one bounded release cohort before stronger convergence/admission claims.

**Owners:** Artifact/Release, Enterprise Trust/PKI, Identity/Authorization, Provider/Binding and Lifecycle.

**Severity:** CRITICAL. **Confidence:** strongly supported. **Detectability:** pre-promotion + audit/runtime cohort observation. **Blast radius:** enterprise/fleet/external parties. **Reversibility:** difficult after distribution. **Time-to-harm:** immediate/latent. **Misuse likelihood:** plausible accidental/adversarial. **Evidence currentness:** signing-time evidence plus current admission/policy/provider observations. **False-positive risk:** medium where coexistence is intentionally authorized and explicitly bounded.

**Future remediation disposition:** require release-level qualification/reconciliation or authorized coexistence disposition; do not revoke historically valid signatures merely because the composed cohort lacks one current joint claim.

**Proof obligation:** `XARTIFACT-P2-PROOF-005` — individually valid trust/authority evidence cannot establish a joint release claim without a compatible qualified join.

## Conflict-pattern disposition

No new `G2-CONFLICT-PATTERN-*` is added. `G2-EDGE-ARTIFACT-008..009` and `G2-XEDGE-TRUST-IDENTITY-ARTIFACT-PROVIDER-005` map to existing qualification-join, currentness, revision-vector, attestation-qualification, trust-authority, provider-qualification, effective-identity, distribution-convergence, migration/coexistence and qualified-claim patterns. This prevents scenario proliferation from being misrepresented as a new reusable conflict family.

## Saturation disposition

Material findings survived duplicate screening. Artifact / Release / SBOM / Provenance local no-material streak remains/reset to `0`; Enterprise Trust/PKI × Identity × Artifact/Release × provider substitution cluster streak remains/reset to `0`. No HIGH/CRITICAL finding lacks owner, detection route or proof obligation. Full Pass 2 continues; Planning C remains blocked.
