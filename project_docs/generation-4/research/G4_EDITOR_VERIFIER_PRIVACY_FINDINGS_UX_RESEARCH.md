# G4 — Editor Verifier Lifecycle, Evidence Privacy & Findings UX Research

Status: `RESEARCH_ACTIVE / NON_EXECUTABLE`
Execution authority: NONE
Date: 2026-09-23

## Scope

Continuation of `G4_EDITOR_IMPACT_GRAPH_EVIDENCE_INVALIDATION_RESEARCH.md`, focused on cross-app verifier qualification/replacement, evidence retention/privacy, scalable findings/conformance UX, privacy-safe correlation, retention-policy conflicts, and verifier trust-root/bootstrap. This is P&D documentation only. It creates no implementation, provider, WBS, Work Package, Sprint or TASK authority.

The findings preserve `Builder Home/Factory -> Client -> Workspace -> Desktop Sphere -> Application -> Window -> View/Tab/Tool`; 3D remains an optional future projection/application rather than mandatory shell.

## Established findings F79–F92 (retained)

The preceding research established: verifier identity/version/currentness is a qualified semantic dependency; verifier replacement is a trust transition; historical interpretation, current admissibility and requalification are separate; evidence retention is claim/purpose-scoped; disclosure views distinguish `REDACTED`, `NOT_RETAINED`, `UNKNOWN`, `NOT_APPLICABLE`, `NOT_AUTHORIZED_TO_VIEW`; deletion may preserve a minimal proof envelope; human-task evidence requires field-level minimization; conformance datasets are derived evidence products; findings use attention semantics and minority-critical aggregation; Status/Activity is durable while toast/live-region is transient; finding lifecycle includes supersession/stale basis; counterfactual conformance never overwrites historical conformance.

## Additional evidence reviewed

- Process-mining privacy research reports substantial re-identification risk because event traces, timestamps and attributes can be linkable even after obvious identifiers are removed. Therefore pseudonymization alone is not proof of anonymity.
- Privacy-preserving process-mining research uses approaches such as differential privacy/subsampling, reinforcing that analytical utility and identity disclosure are separate dimensions.
- Records-management guidance treats legal hold as a scoped suspension of ordinary disposition, not as a permanent exemption from minimization/deletion; release of the hold must restore ordinary lifecycle handling.
- Attestation/provenance patterns distinguish signed claim/envelope from the trust anchor used to decide whether an issuer/verifier is acceptable. Trust anchors are scope-bound and require lifecycle/revocation semantics.

These are pattern evidence only; no vendor, legal regime or implementation is adopted by this research.

## F93 — Correlation identity is a governed capability, not a harmless technical key

A stable case identifier that allows Workflow, Effect Lineage, Forms and Evidence to be joined can itself create linkability. Correlation therefore needs an explicit contract.

```text
CorrelationContract
  correlationSemanticId
  purpose
  sourceDomains[]
  targetAnalyses[]
  keyDerivationClass = DIRECT | PSEUDONYMOUS | SCOPED_TOKEN | EPHEMERAL | AGGREGATE_ONLY
  scope
  rotationPolicy?
  joinPermissions[]
  disclosurePolicy
  retentionHorizon
  reidentificationRiskClass
```

`pseudonymous != anonymous` and `joinable != authorized-to-join`.

The Workflow Designer may declare semantic case/correlation requirements, but Evidence/Conformance infrastructure owns privacy-safe realization. UI must not encourage copying production identifiers into arbitrary analysis exports.

## F94 — Correlation should be purpose- and domain-scoped by default

A universal cross-system correlation ID makes analysis easy but creates an unnecessary identity graph. Prefer scoped tokens whose equality is meaningful only inside an authorized purpose/domain boundary.

Examples:

- operational Workflow correlation may need durable case continuity;
- conformance analysis may use a derived case token;
- aggregate UX metrics may require no per-case join at all;
- external evidence may retain a receipt digest/link without exposing customer identity.

Cross-purpose linking becomes an explicit privileged operation with evidence of basis, not an accidental property of identifiers.

## F95 — Correlation currentness and observation completeness are separate

A valid correlation mapping can still be incomplete, and a complete-looking dataset can use stale mapping semantics.

```text
CorrelationQualification
  mappingRevisionRef
  basisRevisionRefs[]
  coverage = COMPLETE | PARTIAL | ESTIMATED | UNKNOWN
  currentness = CURRENT | STALE | UNKNOWN
  ambiguityCount?
  unresolvedCount?
  disclosureLimitedCount?
```

`correlated != complete`, `uncorrelated != absent`, and `UNKNOWN correlation != different case`.

This protects Designed-vs-Observed from manufacturing deviations when events simply could not be safely or unambiguously correlated.

## F96 — Privacy-safe conformance needs a linkability budget, not only field redaction

Removing names while retaining rare event sequences, exact timestamps, resources and attributes may leave cases re-identifiable. A `ConformanceDataset` therefore needs a disclosure/linkability assessment in addition to a field allowlist.

Candidate dimensions include timestamp precision, rare-trace exposure, attribute uniqueness, cross-dataset joinability, cohort size and whether case tokens are reusable outside the analysis scope.

The editor UX should show `analysis utility` and `disclosure risk` as independent qualifications. High utility does not imply acceptable disclosure.

## F97 — Retention conflicts require an explicit policy-resolution artifact

Legal hold, ordinary retention, privacy deletion requests, contractual proof obligations and security preservation can legitimately point in different directions. The frontend must not resolve that conflict by whichever job executes last.

```text
RetentionDecision
  evidenceRef/affectedSet
  applicablePolicyRefs[]
  requestedDisposition
  resolvedDisposition = DELETE | REDACT | DEIDENTIFY | RETAIN_SCOPED | HOLD | UNKNOWN
  authorityBasisRef
  scope
  effectiveFrom
  review/releaseCondition?
  decisionEvidenceRef
```

This is governance evidence, not legal advice. The system records the basis supplied by the governing policy/authority rather than inventing legal precedence.

## F98 — Legal hold overlays normal lifecycle; it does not rewrite the original retention contract

A hold suspends affected disposition while active. It should be scope-bound, attributable, reviewable and releasable. When released, the underlying retention/deletion lifecycle resumes; the held object does not silently acquire indefinite retention.

`HOLD != RETAIN_FOREVER`.

A hold may preserve only a subset of fields/evidence when the governing basis permits. Unrelated data remains subject to its own minimization lifecycle.

## F99 — Deletion request and proof obligation can produce partial disposition rather than binary keep/delete

Where policy permits, a proof envelope may survive while payload/identity/free text is deleted or deidentified. Conversely, if a claim genuinely requires retained source material, deleting it can make future requalification impossible.

The UI must expose both outcomes:

- `payload removed; historical proof envelope retained`;
- `requalification no longer possible from retained evidence`.

A digest is evidence of integrity/identity only to the extent its provenance and binding are known; `digest retained != semantic proof retained`.

## F100 — Trust bootstrap must terminate in explicit trust anchors and policy, not verifier self-assertion

Verifier qualification cannot recurse forever. The chain terminates at configured trust anchors/qualification authorities whose acceptance is itself governed by policy.

```text
VerifierTrustDomain
  trustDomainId
  anchorRefs[]
  acceptedCredential/attestationKinds[]
  acceptedIssuerScopes[]
  revocation/currentnessPolicy
  delegationDepthPolicy
  crossDomainBridgePolicies[]
  effectiveWindow
```

`signature valid != issuer trusted != claim authorized-for-scope`.

A verifier can be cryptographically authentic yet not qualified to decide a particular claim kind.

## F101 — Cross-trust-domain qualification is a bridge, not transitive trust by default

If Client A trusts verifier VA and Factory trusts verifier VF, acceptance of VA output by Factory requires an explicit bridge policy describing claim scope, issuer/verifier constraints, currentness and evidence requirements.

```text
TrustBridgeQualification
  sourceTrustDomain
  targetTrustDomain
  acceptedClaimKinds[]
  acceptedVerifierScopes[]
  transformation/reverificationRequirements[]
  currentnessPolicy
  status = QUALIFIED | RESTRICTED | SUSPENDED | REVOKED | UNKNOWN
```

`A trusts B && B trusts C` does not imply `A trusts C` unless policy explicitly grants that transitivity.

## F102 — Revocation is time-sensitive and claim-relative

A trust anchor, verifier credential or bridge can be revoked for future admission without erasing what was historically accepted. Conversely, compromise may require retrospective review for a bounded interval.

Candidate disposition:

```text
TrustRevocationImpact
  affectedTrustRef
  effectiveAt
  reasonClass
  newAdmission = REJECT | RESTRICT | UNKNOWN
  historicalReviewWindow?
  affectedClaimKinds[]
  requalificationPolicy
```

Revision/Diff and Findings should explain whether an old proof is merely no longer admissible for new publication or is actively under retrospective review.

## F103 — Shared editor infrastructure needs a Trust/Evidence Inspector, not trust logic duplicated per app

Workflow, Componentes, Form, View, Rules, Preview and Revision/Diff all need to answer variants of: which verifier proved this, under which trust domain, with what evidence/currentness/disclosure? This should be a shared inspector/projection contract.

It must remain projection-only: Workflow does not become owner of verifier trust; Componentes does not become owner of retention; Preview does not become authority.

## F104 — Accessibility and non-drag operation apply to trust/privacy remediation too

High-risk findings such as ambiguous correlation, expired verifier qualification, held evidence or disclosure-limited proof must be operable through keyboard/list/tree/Inspector flows. Drag/drop cannot be the exclusive means to rebind evidence, move a finding to a remediation set or inspect a trust chain.

Focus restoration must target the semantic finding/evidence/trust object after filtering or reconciliation, not a vanished visual row.

## Semantic-bridge impact

The cross-app chain now becomes:

```text
Artifact revisions
 -> typed bindings
 -> PublishBundle qualification
 -> VerifierTrustDomain / qualified verifier set
 -> Preview/authorization evidence
 -> publish/effect occurrences
 -> authoritative effect verification
 -> EvidenceRetentionContract + RetentionDecision
 -> privacy-safe CorrelationContract
 -> ConformanceDataset / Designed-vs-Observed
 -> findings/attention projections
 -> Elicitation proposals
```

Ownership remains separated. Workflow owns process semantics and declares correlation/evidence requirements; interaction editors own their artifacts; Command/Action owns effect intent; Permission/Policy owns authority; trust-domain policy determines verifier admissibility; Evidence owns proof lineage subject to retention/disclosure; Conformance consumes purpose-scoped derived datasets; Revision/Diff projects history/impact/effect/conformance; Elicitation may propose changes but cannot mutate owners automatically.

## New adversarial/proof scenarios

1. Two datasets use the same pseudonymous case token and unexpectedly become cross-joinable: disclosure qualification must detect linkability rather than calling both anonymous.
2. A conformance event has no safe correlation candidate: classify unresolved/UNKNOWN; do not invent a process deviation.
3. A deletion request arrives while a scoped legal hold is active: create a RetentionDecision showing held scope and continue deletion/minimization for unrelated fields where policy permits.
4. A hold is released after normal retention already expired: disposition resumes immediately according to underlying policy; do not start a fresh full retention period silently.
5. Only a digest/tombstone remains: integrity of the former evidence reference may be checkable while semantic requalification is impossible.
6. Verifier binary has a valid signature from an unaccepted issuer: authentic implementation, unqualified proof producer.
7. Verifier is trusted for accessibility claims but not authority/effect claims: acceptance is claim-scoped.
8. Client trust domain accepts a verifier that Factory does not: cross-domain bridge must qualify or result remains restricted/UNKNOWN.
9. Trust credential is revoked today after historical proofs: new admission fails; historical records remain attributable, with retrospective review only if policy requires it.
10. Correlation mapping revision changes after a conformance run: historical run stays pinned; new mapping creates a new/counterfactual run.
11. Rare workflow trace is uniquely identifying despite removed names: export requires aggregation/generalization or is blocked by disclosure policy.
12. Privacy remediation removes optional human-task notes while retaining decision/authority/time proof classes: workflow audit remains interpretable without the free text.

## Componentization / complexity impact

- **P0 LOW/MEDIUM — shared primitives:** correlation coverage/currentness, trust badges, hold/deletion/redaction distinctions, linkability-risk indicators.
- **P1 MEDIUM/HIGH — editor infrastructure:** Trust/Evidence Inspector, Correlation Browser, RetentionDecision projection, disclosure-risk summary, trust-chain/revocation viewer.
- **P2 HIGH/VERY HIGH — proprietary apps:** Workflow declares correlation/evidence requirements; Preview shows trust/evidence basis and simulation substitutions; Revision/Diff projects trust transitions/retention decisions; Elicitation consumes privacy/conformance findings without auto-mutation.
- **P3 EXTREME — cross-app semantic integration:** privacy-safe correlation across domains, policy-conflict resolution evidence, trust bootstrap/bridges/revocation, historical-vs-current admissibility, requalification after minimization/deletion.

Hotspots for future WBS, still non-executable: scoped-token lifecycle/rotation; correlation ambiguity at scale; policy precedence supplied by governance; trust-anchor rollover/recovery; cross-domain bridge explosion; revocation fan-out; disclosure-risk estimation.

## Componentes metadata candidates — delta

```text
correlationRequirementRefs[]
correlationPurposeScopes[]
linkabilityRiskPolicyRef?
trustDomainRequirementRefs[]
acceptedVerifierClaimScopes[]
retentionConflictPolicyRef?
proofEnvelopePolicyRef?
```

These augment rather than duplicate the previously identified verifier/evidence/attention metadata.

## Research maturity / saturation

`EDITOR_VERIFIER_PRIVACY_FINDINGS_UX = ADVANCED / MATERIAL_DELTA`.

New high-confidence conclusions:

- correlation identity is itself privacy-sensitive and must be purpose/domain scoped;
- pseudonymization does not by itself remove re-identification/linkability risk;
- legal hold is an overlay on lifecycle, not permanent retention semantics;
- deletion/proof conflict can yield scoped partial disposition and explicit loss of requalification capability;
- verifier trust terminates at explicit policy/trust anchors;
- cryptographic authenticity, trust and claim-scope authorization are separate;
- cross-domain trust is not automatically transitive;
- revocation must distinguish new admission from historical interpretation/retrospective review.

Remaining gaps:

1. empirical graph/finding/correlation cardinality budgets and index strategy for `10^3–10^6` claims/findings/events;
2. trust-anchor rollover, disaster recovery and split-brain trust-domain scenarios;
3. quantitative linkability-risk thresholds and acceptable utility/privacy trade-offs by analysis purpose;
4. exact UX for policy conflicts requiring human authority without presenting legal conclusions;
5. cryptographic-digest/tombstone semantics under key rotation or hash-algorithm retirement;
6. announcement/coalescing thresholds validated with assistive-technology user testing.

Next research vector: **empirical scale budgets for impact/conformance/findings/correlation indexes + trust-anchor rollover/split-brain recovery**, then digest/tombstone longevity under cryptographic agility.