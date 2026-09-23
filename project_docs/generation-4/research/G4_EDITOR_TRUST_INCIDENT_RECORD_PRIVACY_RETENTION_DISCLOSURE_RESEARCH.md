# G4 — Trust Incident/Fork/Admission/Recovery Record Privacy, Retention & Disclosure

Status: `RESEARCH_ACTIVE / NON_EXECUTABLE`
Execution authority: NONE
Date: 2026-09-23

## Scope

Continuation of the proprietary-editor shared-foundation research, especially `G4_EDITOR_EMERGENCY_TRUST_GOVERNANCE_RECOVERY_RESEARCH.md`, `G4_EDITOR_BOUNDED_TRUST_FORK_RECONCILIATION_RESEARCH.md` and the verifier/privacy/evidence research. This round studies privacy, retention, disclosure and selective-access semantics for trust incident, fork, admission, recovery and emergency-governance records themselves.

This is P&D documentation only. It does not authorize implementation, provider selection, WBS, Work Package, Sprint or TASK.

Current interface program remains `Builder Home/Factory -> Client -> Workspace -> Desktop Sphere -> Application -> Window -> View/Tab/Tool`; 3D remains optional.

## External pattern evidence reviewed

- NIST SP 800-61r3 states that incident-response actions should be recorded with integrity/provenance preserved, while confidentiality must be safeguarded because incident records can contain sensitive information. Evidence retention should follow evidence-preservation procedures and data-retention policy, considering prosecution possibility and the cost of preserving data and the means needed to access it later.
- NIST Privacy Framework treats privacy risk across the complete data lifecycle, from collection through disposal. NIST privacy guidance emphasizes data minimization, use limitation, granular administration, deletion and selective disclosure.
- NIST audit-retention guidance ties retention to administrative, legal, audit and operational purposes rather than indefinite storage.
- OWASP logging guidance recommends excluding, masking, sanitizing, hashing or encrypting sensitive values; restricting and auditing access; and retaining logs neither less nor longer than required by applicable obligations.
- ENISA technical guidance likewise recommends predefined retention aligned with business need, risk and legal obligations, deletion after expiry, and protection against unauthorized access/change.
- GDPR Article 5 provides useful pattern evidence for purpose limitation, data minimization and storage limitation. Article 33(5) provides a concrete counterweight: certain breach facts, effects and remedial actions must be documented for accountability. This is jurisdiction-specific evidence, not a universal System Builder legal rule.

These sources are pattern evidence only. G4 does not encode one jurisdiction's law as universal product semantics.

## F157 — Security evidence is not exempt from privacy governance

Incident/fork/admission/recovery records are valuable precisely because they can reveal principals, topology, compromise hypotheses, credentials/trust relationships, affected systems, timing and actions. Their security purpose does not make them privacy-neutral.

`security evidence != privacy exemption`.

Candidate record families:

- `TrustIncidentRecord`
- `TrustForkRecord`
- `AdmissionDecisionRecord`
- `EmergencyRecoveryRecord`
- `RecoveryAuthorityAttestation`
- `PostRecoveryQualificationRecord`
- `DisclosureDecisionRecord`

Each record family should declare purpose, sensitivity/classification, subject/reference classes, retention basis, disclosure classes and minimization strategy.

## F158 — Record identity, proof continuity and payload retention must remain separate

The system may need to prove that an incident, fork or recovery decision existed after sensitive payloads are deleted or redacted.

Candidate layered envelope:

```text
GovernanceRecordEnvelope
  semanticRecordId
  recordType
  purposeRef
  incident/trustDomain refs
  eventTime/decisionTime
  disposition
  authority/provenance refs
  retainedProofDigests[]
  payloadRetentionState
  disclosurePolicyRef
  retentionDecisionRef
```

Optional sensitive payload remains separately governed.

`proof continuity != payload continuity`.

Deleting a narrative, attachment or identity-bearing field does not authorize deleting the fact that a qualified decision occurred when policy requires that fact to remain.

## F159 — Purpose binding must apply to collection, correlation, use and disclosure

A record collected for compromise recovery should not silently become a general employee-monitoring, product-analytics or cross-client profiling dataset.

Candidate `RecordPurposeContract`:

```text
purposeId
allowedRecordClasses[]
allowedUses[]
allowedCorrelationScopes[]
allowedRecipients[]
minimumNecessaryFields[]
prohibitedSecondaryUses[]
retentionBasis
review/currentness
```

`record available != record reusable for any purpose`.

Purpose expansion is a new governed decision, not a UI filter toggle.

## F160 — Disclosure is a derived, purpose-qualified projection, not raw record access

Different recipients may legitimately need different slices of the same incident.

Candidate disclosure views:

- `OPERATOR_ACTIONABLE`
- `CLIENT_ACCOUNTABILITY`
- `SECURITY_INVESTIGATION`
- `AUDIT/COMPLIANCE`
- `LEGAL_HOLD`
- `EXTERNAL_NOTIFICATION`
- `AGGREGATE_RESEARCH`

A disclosure projection should declare source record revision, recipient/role class, purpose, fields/claims exposed, transformations/redactions, currentness and authority.

`can know incident exists != can read full incident payload`.

`can verify decision != can reveal identity/secret-bearing evidence`.

## F161 — Redaction, withholding, erasure and absence need distinct semantics

The shared editor foundation must never render all missing-looking values identically.

Candidate states:

- `PRESENT`
- `REDACTED`
- `WITHHELD_NOT_AUTHORIZED`
- `ERASED_BY_POLICY`
- `NOT_RETAINED`
- `UNAVAILABLE`
- `UNKNOWN`
- `NOT_APPLICABLE`

`redacted != absent`.

`not authorized to view != unknown to system`.

`erased != never existed`.

This matters in Revision/Diff, Evidence, Trust Fork Review and Emergency Trust Review because a blank field must not fabricate semantic equality.

## F162 — Retention is field/claim-class aware, not one TTL per incident

A single incident may contain facts with radically different retention needs: immutable decision facts, authority attestations, compromise indicators, free-text notes, attachments, identity references, raw logs and derived aggregates.

Candidate classes:

- `DECISION_FACT`
- `AUTHORITY_ATTESTATION`
- `SECURITY_INDICATOR`
- `IDENTITY_REFERENCE`
- `FREE_TEXT_NARRATIVE`
- `RAW_TELEMETRY`
- `ATTACHMENT`
- `DERIVED_AGGREGATE`
- `PROOF_DIGEST`
- `DISCLOSURE_HISTORY`

Retention is computed from record class + purpose + jurisdiction/contract/policy + hold/incident state + proof obligation, not inherited blindly from the parent incident.

## F163 — Legal/administrative hold is an overlay; it does not rewrite the base lifecycle

A hold may suspend ordinary disposal for a qualified scope and period. It should preserve why the normal lifecycle was suspended and what must happen when the hold ends.

`hold != retain forever`.

`hold applied != every related artifact automatically in scope`.

Candidate `RetentionOverlay` names scope, authority, basis, start/currentness, release condition and affected field/record classes. When released, the system resumes/re-evaluates the underlying retention policy rather than inventing a new permanent baseline.

## F164 — Deletion can reduce future proof capability and must expose that consequence

If raw incident evidence, payload or identity linkage is lawfully erased, later requalification may become impossible. The system must represent this explicitly.

Candidate outcomes:

- `REQUALIFIABLE`
- `REQUALIFIABLE_FROM_MINIMAL_ENVELOPE`
- `HISTORICALLY_INTERPRETABLE_ONLY`
- `REQUALIFICATION_IMPOSSIBLE_AFTER_ERASURE`
- `UNKNOWN`

`deletion completed != proof obligation magically satisfied`.

`requalification impossible != historical decision false`.

Before destructive retention actions, guided UX should expose affected proof/currentness obligations without turning a proof obligation into an unlimited retention override.

## F165 — Incident records need compartmented access, not broad admin readability

High-privilege platform administration and incident-evidence readability are different authorities. Candidate permissions should distinguish:

- existence/status visibility;
- metadata visibility;
- identity-bearing evidence;
- raw telemetry/attachments;
- trust-key/credential-adjacent material;
- disclosure/export;
- retention/hold mutation;
- recovery authorization.

`platform admin != incident investigator != privacy officer != recovery authority`.

This also protects cross-client operation: Factory/fleet visibility must not imply cross-client raw evidence visibility.

## F166 — Access and disclosure of sensitive incident records are themselves evidence-producing events

Reading/exporting a highly sensitive incident record can materially increase risk. The system should be able to preserve access/disclosure lineage appropriate to classification and policy.

Candidate `EvidenceAccessOccurrence`:

```text
recordRef
actor/authorityRef
purposeRef
operation = VIEW | EXPORT | DISCLOSE | DERIVE | REDACT | HOLD | ERASE
field/class scope
occurredAt
policyDecisionRef
result
```

This does not imply logging the sensitive payload again.

`audit access != duplicate secret into audit log`.

## F167 — Disclosure bundles should be reproducible without becoming canonical duplicates

For audit, client notification or external notification, the product may need to create a point-in-time disclosure bundle. The bundle should bind source revisions and transformations, but remain a derived artifact with its own retention/disclosure policy.

`disclosure bundle != canonical incident record`.

A later source correction does not silently rewrite a previously sent bundle; Revision/Diff should show source-to-disclosure lineage and supersession/correction when required.

## F168 — Cross-client and fleet aggregation requires privacy-safe cardinality and drill-down boundaries

Factory may need aggregate incident/fork/recovery status across many clients. Aggregation should expose only what the fleet purpose requires and should not make individual sensitive records globally joinable.

Candidate aggregate facts include counts by severity/state/currentness, unresolved blocking classes and recovery posture. Drill-down requires a separately authorized transition into client/workspace scope.

`aggregate visibility != member-record authority`.

`cross-client count != cross-client correlation permission`.

## F169 — Correlation tokens for incident/effect/recovery lineage must remain purpose/scoped

Trust incident analysis may need to connect an admission, verifier, PublishBundle, runtime effect and recovery action. A universal stable identifier would create unnecessary linkability.

Prefer scoped correlation references/tokens where possible and preserve:

`joinable != authorized-to-join`.

If correlation material is erased/rotated, unresolved joins become explicit `UNKNOWN/UNRESOLVABLE`, not false non-correlation.

## F170 — Emergency conditions do not suspend minimization or disclosure boundaries by default

Emergency recovery may justify access that normal operation does not, but the expansion must be policy-driven, scoped, attributable and expiring.

Candidate emergency disclosure decision records:

```text
incidentRef
requestedDataClasses[]
requestedPurpose
recipient/authority
normalPolicyDisposition
emergencyOverrideBasis
approvedScope
expiry
post-use obligations[]
```

`emergency != disclose everything`.

Recovery authority still does not automatically gain unrelated client data or arbitrary business-record visibility.

## F171 — Privacy-safe incident UX needs progressive disclosure and semantic placeholders

Emergency Trust Review / Trust Fork Review should show high-signal status first and reveal sensitive fields only when authority/purpose permits. Useful UI primitives include:

- sensitivity/purpose badges;
- `REDACTED` / `WITHHELD` / `ERASED` semantic placeholders;
- disclosure preview showing exact fields/claims before export;
- retention/hold timeline;
- proof-impact preview before erasure;
- recipient/purpose Inspector;
- access/disclosure history;
- root-cause finding aggregation without sensitive payload duplication.

Every operation must have keyboard/list/tree/Inspector equivalents. Hidden data must not leak through search snippets, counts, tooltips, diff summaries, accessibility labels or error messages.

## F172 — Revision/Diff must distinguish content change from visibility/retention change

A user may observe a record changing because the underlying incident changed, because their disclosure scope changed, because a field was redacted/erased, or because retention expired.

Candidate facets:

`SEMANTIC CONTENT`, `DISCLOSURE SCOPE`, `REDACTION`, `RETENTION`, `HOLD`, `ERASURE`, `ACCESS AUTHORITY`, `PROOF IMPACT`, `CURRENTNESS`.

`field disappeared from my projection != canonical field deleted`.

This is critical for offline drafts/reconcile: a locally cached sensitive field that is later withheld/erased cannot be silently re-uploaded during reconciliation.

## Semantic bridge findings

The typed chain now extends:

```text
Workflow/View/Form/Component/Rule revision
 -> Command/Action intent
 -> Permission/Policy authority
 -> PublishBundle qualification
 -> verifier + TrustSetRevision/TrustBridgeQualification
 -> ProofEnvelope / Preview evidence
 -> runtime EffectOccurrence
 -> trust incident/fork/admission evidence
 -> emergency/reconciliation decision
 -> GovernanceRecordEnvelope
 -> RetentionDecision / RetentionOverlay
 -> DisclosureDecision / DisclosureProjection
 -> Evidence currentness + Revision/Diff projection
```

Ownership remains separate. Privacy/retention/disclosure infrastructure governs evidence handling; it does not become owner of Workflow, View, Form, Component, Command, Permission, Domain State or runtime effect truth.

## Required/adversarial scenarios

1. A workflow activity requires a form; the form binding is visible, but incident evidence attached to a failed authorization is withheld from the editor user. The UI shows `WITHHELD_NOT_AUTHORIZED`, not `no evidence`.
2. A command exists without UI binding; its admission record remains discoverable to authorized reviewers without manufacturing a button/component relation.
3. A UI control has no authorized command; validation finding exposes the mismatch without leaking unrelated permission-policy internals.
4. Schema change breaks a form while an incident investigation is active; form diff and incident-retention hold remain independent.
5. Permission change removes a user's incident-detail access while a cached window is open; sensitive cached content is invalidated/hidden without rewriting the canonical record.
6. Revision conflict contains a locally cached narrative that was erased centrally; reconcile must not resurrect the erased payload.
7. Offline draft was created while disclosure authority was current; authority expires before reconnect. Draft metadata may reconcile, sensitive disclosure cannot be replayed without requalification.
8. Preview simulates an emergency recovery and displays synthetic evidence; preview records are visibly non-effective and cannot satisfy production incident proof.
9. Accessibility user performs disclosure review entirely without drag; redaction/withholding semantics remain perceivable without exposing hidden values in accessible names.
10. Legal hold covers authority attestations but not unrelated raw telemetry; only scoped classes suspend disposal.
11. Hold is released after base TTL already expired; affected records return to lifecycle evaluation and may become immediately eligible for disposal.
12. Free-text note is erased while decision fact and proof digest remain; historical decision stays interpretable to the declared extent.
13. A proof digest remains but source payload is gone; UI must not claim the digest proves facts that require the erased payload.
14. Factory dashboard shows 25 clients with trust incidents; operator cannot infer identities/details beyond authorized aggregate scope.
15. Export bundle created yesterday is later superseded by corrected incident facts; old bundle remains immutable evidence of what was disclosed, with correction lineage.
16. Emergency operator requests full raw logs although only a verifier attestation is necessary; guided UX narrows to minimum necessary evidence.
17. Incident record contains access token/secret accidentally captured in raw logs; sanitization/remediation does not erase the fact that evidence was modified under an authorized retention/privacy action.
18. A redacted field participates in semantic diff; diff reports `content comparison unavailable due to disclosure boundary`, not `unchanged`.
19. Search index retains a snippet after source field erasure; index is stale and must not become a shadow retention store.
20. 100k incident-derived findings aggregate by root cause; aggregation preserves blocking/UNKNOWN minority truth and does not duplicate sensitive narratives.

## Reusable primitives / editor integration

### Shared primitive

`GovernanceRecordRef`, `RecordPurposeRef`, `RetentionDecisionRef`, `RetentionOverlayRef`, `DisclosureDecisionRef`, `DisclosureProjectionRef`, `EvidenceAccessOccurrenceRef`, sensitivity/classification badges, semantic absence/redaction states.

### Editor infrastructure

- purpose/sensitivity-aware Inspector;
- progressive-disclosure record viewer;
- retention/hold timeline;
- disclosure preview/bundle projection;
- proof-impact-before-erasure projection;
- access/disclosure lineage;
- privacy-safe search/index contract;
- affected-set/root-cause findings with payload minimization;
- offline-cache/reconcile guard against erased/withheld-data resurrection;
- keyboard/non-spatial equivalents.

### Proprietary apps

- Workflow Designer: projects incident/conformance/effect references under disclosure policy; does not own incident payload.
- Componentes: state-lab covers `REDACTED`, `WITHHELD`, `ERASED`, `STALE`, `BLOCKED`, `PENDING` where semantically applicable without turning privacy state into arbitrary visual variants.
- View/Page/Form: binding/currentness findings remain separate from disclosure/retention state; hidden evidence never becomes a missing binding.
- Rules/Decision: can author/review retention/disclosure policy candidates but cannot self-authorize exceptional disclosure.
- System/Module Designer: declares trust/privacy boundary requirements without owning incident records.
- Elicitation/Requirements: captures disclosure/retention requirements and rationale without becoming the evidence store.
- Preview/Sandbox: exercises redaction/disclosure/recovery behavior on synthetic or purpose-qualified fixtures; preview evidence remains non-effective.
- Revision/Diff: projects semantic vs disclosure/retention/erasure change and lineage; it does not own records.

### Cross-app semantic integration

P3 remains the hotspot: incident/effect/trust facts, purpose, authority, retention, disclosure, indexing, offline cache and evidence currentness are independently owned/versioned yet must compose into one review without fabricating absence, authority or proof.

## Componentization / dependency complexity

- **P0 LOW/MEDIUM:** record/purpose/retention/disclosure refs, sensitivity badges, semantic placeholder states.
- **P1 MEDIUM/HIGH:** progressive-disclosure Inspector, retention timeline, disclosure preview, access lineage, privacy-safe search projection.
- **P2 HIGH/VERY HIGH:** app-specific disclosure/retention projections, offline-cache invalidation, diff/search/accessibility hardening.
- **P3 EXTREME:** purpose-qualified correlation, cross-client aggregation, legal/contract/policy overlays, proof-vs-erasure conflicts, distributed/offline disclosure currentness and shadow-copy/index deletion.

State-explosion hotspot: `record class × purpose × subject/client × sensitivity × recipient/authority × retention basis × hold overlay × disclosure revision × correlation scope × offline/cache state × proof obligation × currentness`.

UI must query/project this state rather than encode it as component variants.

## Proof obligations

1. Security evidence never bypasses privacy/retention governance merely because it is security-relevant.
2. Purpose expansion requires an explicit governed decision; record availability alone does not authorize secondary use.
3. Disclosure exposes only policy-authorized minimum fields/claims for the named recipient/purpose.
4. `REDACTED`, `WITHHELD`, `ERASED`, `NOT_RETAINED`, `UNKNOWN` and `NOT_APPLICABLE` remain semantically distinguishable.
5. Retention/hold decisions are field/claim-class aware and preserve their authority/basis/currentness.
6. Hold release resumes/re-evaluates the base lifecycle; hold never silently becomes perpetual retention.
7. Erasure cannot be silently reversed by cache, index, backup, offline draft or reconciliation.
8. Erasure-induced loss of requalification capability is explicit and never converted to `PASS` or semantic falsity.
9. Access/disclosure audit does not duplicate the sensitive payload it is meant to protect.
10. Cross-client aggregation does not create unauthorized cross-client correlation or drill-down authority.
11. Emergency disclosure remains scoped, attributable, expiring and independent of arbitrary business-data authority.
12. Disclosure bundles bind source revision/transformation and remain derived, immutable point-in-time artifacts.
13. Search/index snippets and derived caches cannot outlive source erasure without an independently justified retention basis.
14. Offline reconcile cannot resurrect centrally erased/withheld sensitive content.
15. Revision/Diff never renders hidden/erased content as unchanged or absent without qualification.
16. Preview/synthetic incident evidence never satisfies effective runtime/recovery proof obligations.
17. Accessibility metadata never leaks hidden values and every disclosure/retention action has non-drag equivalents.
18. Findings aggregation preserves blocking/UNKNOWN minority truth while minimizing sensitive payload replication.

## Research maturity / saturation

`EDITOR_TRUST_INCIDENT_RECORD_PRIVACY_RETENTION_DISCLOSURE = ADVANCED_EMERGING / MATERIAL_DELTA`.

High-confidence conclusions:

- incident/fork/admission/recovery evidence requires the same privacy lifecycle discipline as other sensitive data;
- proof continuity can often survive payload minimization, but proof capability and payload retention must never be conflated;
- purpose, retention, disclosure and correlation are independent dimensions;
- semantic redaction/withholding/erasure states are required to avoid fabricated absence/equality;
- cross-client/fleet views should be aggregate-first with separately authorized drill-down;
- emergency recovery does not create a blanket privacy bypass;
- offline cache/search/index behavior is part of retention correctness, not merely frontend optimization.

Open gaps / next vector:

1. survivable custody/escrow of emergency recovery material without creating a concentrated compromise target;
2. emergency-policy evolution when the recovery policy itself is stale, ambiguous or signed by now-compromised authorities;
3. jurisdiction/contract-aware policy composition without hard-coding one legal regime as canonical product semantics;
4. verifiable deletion across backups, indexes, derived artifacts and long-offline clients without a mandatory central oracle;
5. empirical UX studies for progressive disclosure under emergency pressure and proof-impact-before-erasure comprehension.

## Source notes

- NIST SP 800-61r3 (2025), incident-response record confidentiality/integrity/provenance and evidence-retention guidance.
- NIST Privacy Framework and NIST SP 800-63-4 privacy considerations, data lifecycle/minimization/use-limitation/selective-disclosure patterns.
- NIST SP 800-53 AU-11 audit-record retention pattern.
- OWASP Logging Cheat Sheet / ASVS logging guidance on sensitive-data exclusion, access protection and bounded retention.
- ENISA Technical Implementation Guidance (2025), predefined retention, legal/risk alignment, deletion after expiry and log protection.
- GDPR Article 5 and Article 33(5)/EDPB breach-documentation guidance as jurisdiction-specific pattern evidence for minimization/purpose/storage limitation plus accountability documentation.

Pattern evidence only; no legal regime, retention duration, logging stack, privacy engine or provider is selected.