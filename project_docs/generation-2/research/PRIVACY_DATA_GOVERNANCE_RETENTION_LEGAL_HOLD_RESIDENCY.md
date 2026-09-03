# Generation 2 — Privacy / Data Governance / Retention / Legal Hold / Residency

Status: STRUCTURAL RESEARCH PASS 1 COMPLETE / PROMOTION RECOMMENDED / NOT SATURATED
Phase: RESEARCH_ELICITATION
Parent candidate: `G2-CAPABILITY-CANDIDATE-PRIVACY-DATA-GOVERNANCE-RETENTION-LEGAL-HOLD-RESIDENCY`

## Research question

Does Generation 2 require a distinct cross-cutting semantic owner for privacy/data-governance obligations—purpose/use, classification, retention, legal hold, deletion eligibility, residency/jurisdiction and evidence of disposition—or can those semantics safely be merged into Data / Schema, Governance / Compliance, Security, Storage or Authorization without ownership collapse?

## Representatives and evidence ledger

1. NIST Privacy Framework 1.1 / NIST privacy guidance — privacy risk arises from data processing and is not reducible to cybersecurity risk. Identify-P/Govern-P establish processing activities, privacy values, legal requirements and risk; Control-P/Communicate-P/Protect-P address processing controls and outcomes.
   - https://www.nist.gov/privacy-framework/using-privacy-framework-11
   - https://www.nist.gov/privacy-framework/frequently-asked-questions
2. EU GDPR, Regulation (EU) 2016/679 — purpose limitation/storage limitation, accountability, erasure, restriction and legal-claims exceptions establish obligation conflicts over the same data subject/content.
   - https://eur-lex.europa.eu/eli/reg/2016/679/oj
3. Microsoft Purview Data Lifecycle Management / Records Management / eDiscovery — retention wins over deletion; eDiscovery hold prevents permanent deletion; retention labels can carry event-based periods, disposition review and proof of disposition; Preservation Lock can make policy non-weakenable.
   - https://learn.microsoft.com/en-us/purview/retention
   - https://learn.microsoft.com/en-us/purview/retention-flowchart
   - https://learn.microsoft.com/en-us/purview/edisc-hold-create
4. Google Cloud Assured Workloads / Data Residency — workload/compliance-program selection restricts eligible regions through organization policy; supported-service scope matters and residency capability is provider/service-specific.
   - https://cloud.google.com/security/products/assured-workloads
   - https://cloud.google.com/terms/data-residency
5. AWS Control Tower Data Residency / Digital Sovereignty controls — preventive and detective controls apply at OU/member-account scope and include explicit global-service exemptions, proving residency is applicability- and provider-support-qualified rather than a scalar region flag.
   - https://docs.aws.amazon.com/controltower/latest/controlreference/data-residency-controls.html
6. Open Policy Agent — provider-neutral policy decision/enforcement separation with distributed policy bundles, decision logs and hierarchical/global policy patterns. OPA can realize governance decisions but does not itself own privacy-purpose, retention, legal-hold or residency semantics.
   - https://www.openpolicyagent.org/docs
   - https://www.openpolicyagent.org/docs/management-introduction

Representative coverage: NIST Privacy Framework `DEEP`; GDPR purpose/storage/erasure/restriction/legal-claims `DEEP`; Microsoft Purview retention/records/eDiscovery `DEEP`; Google Assured Workloads/data residency `DEEP`; AWS Control Tower data-residency controls `DEEP`; OPA provider-neutral decision/enforcement boundary `DEEP`.

## Convergent primitives

- `DataGovernanceSubject`: data set, record, document, field/attribute, derived artifact, backup/export/index/rendition or other governed data population.
- `ProcessingPurpose`: declared purpose/use with lawful/organizational basis and applicability scope.
- `DataClassification`: privacy/sensitivity/category facts independent from storage representation.
- `GovernanceObligation`: versioned obligation binding subject/population to purpose/use, retention, hold, deletion, residency/jurisdiction, disclosure or disposition constraints.
- `RetentionSchedule`: start event, duration/rule, scope, precedence and expiry semantics.
- `LegalHold`: authority-backed preservation constraint with scope, lifecycle, provenance and release semantics.
- `DeletionEligibility`: computed/qualified claim that all controlling obligations permit destructive transition; not equivalent to delete request acceptance.
- `ResidencyRequirement`: allowed/prohibited jurisdictions/locations, workload/service scope and exception profile.
- `EffectiveGovernanceQualification`: observed claim joining canonical obligation revisions to provider/runtime realizations and consumer/storage populations.
- `DispositionEvidence`: evidence of deletion, retention, preservation, export/movement or exception outcome, with its own retention/replay horizon.

## Source of truth and identity

Canonical truth must be an append/supersede set of typed governance claims, not provider-native retention labels, regions, holds or policy IDs. At minimum, identity must distinguish data-governance subject/population, purpose, classification, obligation, retention schedule, hold, residency rule, deletion request, deletion-eligibility evaluation, provider realization, effective consumer/storage cohort and disposition evidence.

Provider-native identities remain realization identities. The same canonical obligation may be realized through Purview retention/hold mechanics, Google organization policies, AWS Control Tower controls, database/storage lifecycle features, application policy enforcement or combinations thereof.

## Lifecycle and versioning

A representative lifecycle is:

`discover/classify → establish purpose/basis → bind obligation → admit/realize policy → observe effective coverage → retain/restrict/use → request transition/delete/move → evaluate conflicts/eligibility → disposition or block → preserve evidence → supersede/release/expire → drain residual governed cohorts → close`.

Versioning is multi-axis: data/population revision, purpose/basis revision, obligation/policy revision, hold revision, jurisdiction/residency revision, provider/control revision, consumer/storage cohort revision and evidence-currentness revision. Historical evidence does not become current merely because the underlying data bytes are unchanged.

## Failure semantics

- `REQUESTED` or provider `ACCEPTED` does not prove effective retention/deletion/residency.
- `DELETE_REQUESTED` with active retention/hold is `BLOCKED_BY_OBLIGATION`, not failure of the delete API.
- Effective state may be `QUALIFIED`, `PARTIAL`, `INCONCLUSIVE`, `STALE`, `CONFLICTED`, `BLOCKED`, `OUTCOME_UNKNOWN` or `NON_CONFORMING`.
- Ambiguous destructive/movement outcomes require observe/reconcile-before-retry.
- Loss of residency/hold/retention evidence during disconnected operation must not silently degrade to compliant.
- Closure requires residual copies, replicas, backups, caches, indexes, exports, renditions and downstream consumers to be drained, requalified or explicitly dispositioned according to their own obligations.

## Authority and governance

Privacy/data-governance authority is not ordinary data-write authority. Separate roles/claims are required for obligation authoring, hold placement/release, exceptional deletion, residency exception, disposition approval and provider-admin actuation. Microsoft Preservation Lock and priority-cleanup style mechanisms demonstrate that exceptional destructive authority must be explicit, narrow, multi-party/audited where required and never inferred from generic admin capability.

`Enterprise → Station → Role → Person` is monotonic: a Station may receive narrower permitted purposes, retention bounds, residency regions, disclosure scope or delegated hold/disposition operations, but cannot weaken mandatory enterprise obligations or invent superior exception authority. Adaptive Governed Work Surfaces and AI may propose/classify/materialize within delegated constraints; they never gain legal-hold release, exceptional deletion, residency-exception or provider-admin authority by convenience.

## Provider boundaries, portability and lock-in

Universal semantics: subject/population, purpose/use, classification, obligation, retention/hold precedence, deletion eligibility, residency/jurisdiction intent, effective qualification, exception authority and disposition evidence.

Provider-specific mechanisms: Purview labels/Preservation Hold Library/eDiscovery resources, Google compliance programs/org-policy constraints, AWS Control Tower/SCP-specific controls, storage/database lifecycle mechanics and provider-native regional service coverage.

Portability is therefore a mixed support vector across purpose/classification, retention start/event semantics, immutable policy/records, legal hold, delete override, residency precision, jurisdiction/service coverage, evidence export, offline behavior, exception workflow and residual-copy closure. A provider supporting “retention” or “region selection” is not sufficient proof of semantic equivalence.

## Product-specific mechanism versus universal primitive

- Purview “retention wins”, eDiscovery hold and Preservation Lock are strong mechanism evidence for universal precedence/non-weakenability primitives, not canonical SB resources.
- Google/AWS region/OU/org-policy constructs are realization mechanisms for universal residency/jurisdiction requirements.
- OPA is a provider-neutral enforcement/decision realization. It validates a provider boundary: SB may compile governance intent to policy engines without making Rego or any policy engine the canonical governance model.

## Convergent and divergent patterns

Convergent:
- obligations are scoped and versioned;
- retention/deletion conflicts have precedence semantics;
- legal/investigative holds are distinct from ordinary retention;
- location/residency is policy-governed and support-qualified;
- evidence/accountability is separate from the governed data itself;
- privacy governance crosses application, storage, security, compliance and provider boundaries.

Divergent:
- exact precedence and exceptional-deletion mechanisms vary by product/legal regime;
- residency granularity ranges from workload/environment to account/OU/service and may contain exemptions;
- legal basis, data-subject rights and jurisdictional rules are policy inputs, not universal hard-coded law in SB;
- provider evidence and enforcement timing differ materially.

## Subcapabilities

1. Data inventory/classification and governed-population identity.
2. Purpose/use/basis and processing-obligation modeling.
3. Retention/records schedule and event semantics.
4. Legal/investigative hold and release lifecycle.
5. Deletion eligibility, exceptional deletion and disposition review.
6. Residency/jurisdiction/data-boundary policy.
7. Effective coverage/conformance observation and evidence.
8. Provider-policy compilation/binding and mixed-support qualification.
9. Residual-copy/cohort drainage and disposition closure.
10. Data-subject/regulated request workflow integration without collapsing Workflow into the semantic owner.

## System Builder bounded comparison

No repository evidence in this pass proves that current SB already has a canonical owner spanning purpose/use + retention + legal hold + deletion eligibility + residency. Existing Generation 2 Data, Storage, Governance, Security, Authorization, Provider and Lifecycle capabilities supply adjacent primitives and realization boundaries but, by the Enterprise Completeness review itself, the combined semantic ownership remained open. Therefore this pass does not claim an implementation gap beyond the documented architecture gap; repository validation is required before any `REPLACE`/migration decision.

## Architecture hypotheses

- **GENERALIZE + PROMOTE:** establish `Privacy / Data Governance / Retention / Legal Hold / Residency` as a distinct `CROSS_CUTTING` capability owning portable governance obligations and effective qualification.
- **INTEGRATE:** Data/Schema supplies canonical data structure/population identities and lineage; Storage owns bytes/object realization; Governance/Compliance owns organization-wide control/evidence policy; Security owns confidentiality/integrity/risk controls; Authorization owns access decisions; Lifecycle owns generic migration/drainage; Workflow owns process orchestration.
- **PROVIDERIZE:** native retention/hold/residency/DLP/records/policy engines and enforcement mechanisms.
- **HARDEN:** destructive transitions must consume qualified deletion eligibility and controlling-obligation evidence.
- **DO_NOT_BUILD:** do not encode one jurisdiction’s law, invent a legal interpretation engine, or build bespoke provider retention/storage policy engines when provider integrations suffice.
- **DEFER:** jurisdiction-specific legal rule packs and industry-specific records schedules belong to later domain/provider policy packs after universal primitives are stable.

## Symbiotic Proof

A valid symbiotic architecture must prove that one canonical governance intent can be realized across heterogeneous storage/application/cloud providers while provider-native IDs remain non-canonical; that a stricter legal hold/retention rule blocks an otherwise-valid delete; that residency changes cannot silently move governed data outside allowed scope; that policy/provider substitution exposes unsupported semantics rather than pretending parity; and that local/offline Stations operate only within bounded evidence/obligation horizons and requalify before privileged data governance actions after reconnect.

## Material findings

### G2-FINDING-PDGR-01 — Privacy/data-governance requires a distinct semantic owner
NIST explicitly separates privacy risks arising from data processing from cybersecurity risk, while GDPR and enterprise systems attach purpose, retention, hold, erasure and accountability semantics to data independently of schema/storage/access-control mechanics. Merging these into Security, Storage or generic Governance would collapse ownership.

### G2-FINDING-PDGR-02 — Deletion eligibility is an obligation-resolution result, not a delete capability
GDPR erasure has exceptions and restriction semantics; Purview retention and eDiscovery holds can prevent permanent deletion. Canonical deletion must therefore consume a revision-qualified `DeletionEligibility` claim covering all controlling obligations.

### G2-FINDING-PDGR-03 — Retention, legal hold and user-visible deletion are separate states
Purview preserves content even when users delete it from the ordinary surface. Logical visibility, retention/preservation, deletion eligibility and physical disposition are independent facts.

### G2-FINDING-PDGR-04 — Residency is an applicability- and support-qualified governance claim
Google Assured Workloads and AWS Control Tower enforce residency at different workload/account/OU/service scopes and document service/exemption limitations. “Region = X” cannot be the universal primitive; effective residency requires subject/population + jurisdiction rule + provider/service support + observed realization.

### G2-FINDING-PDGR-05 — Exceptional deletion is privileged governance actuation
Provider mechanisms that override retention/holds require exceptional controls, approvals/roles and audit. Generic admin, AI assistance or data-write permission must not imply authority to override controlling obligations.

### G2-FINDING-PDGR-06 — Governance evidence has a separate currentness/replay horizon
A historical policy assignment, hold, residency control or disposition receipt may prove past state but not current effective coverage. Evidence identity/currentness must be tracked independently from data/content retention.

### G2-FINDING-PDGR-07 — Provider portability is a mixed governance-support vector
Purpose/classification, event-based retention, immutable records, legal hold, deletion override, residency precision, service coverage, evidence export, offline behavior and residual-copy closure vary independently. Provider substitution must requalify each required axis.

### G2-FINDING-PDGR-08 — Governance closure requires residual-population drainage
Deleting or moving a primary record does not close the obligation while governed replicas, backups, caches, indexes, exports, renditions or downstream consumers remain. Closure requires requalification, drainage or explicit disposition for every governed cohort.

## New subordinate candidates

- `G2-CAPABILITY-CANDIDATE-PDGR-APPLICABILITY-SCOPED-DATA-GOVERNANCE-QUALIFICATION` — CROSS_CUTTING / CONSOLIDATION_CANDIDATE.
- `G2-CAPABILITY-CANDIDATE-PDGR-DELETION-ELIGIBILITY-OBLIGATION-RESOLUTION` — CROSS_CUTTING / CONSOLIDATION_CANDIDATE.
- `G2-CAPABILITY-CANDIDATE-PDGR-MIXED-PRIVACY-RETENTION-RESIDENCY-SUPPORT-VECTOR` — CROSS_CUTTING / CONSOLIDATION_CANDIDATE.
- `G2-CAPABILITY-CANDIDATE-PDGR-RESIDUAL-GOVERNED-POPULATION-DRAINAGE` — CROSS_CUTTING / CONSOLIDATION_CANDIDATE.

No subordinate candidate is promoted as a separate top-level capability.

## Repo-validation questions

1. Is there any current SB canonical model for processing purpose/use or lawful/organizational basis?
2. Can current delete/destructive operations represent `BLOCKED_BY_RETENTION_OR_HOLD` independently of storage/provider failure?
3. Are data populations, replicas/backups/exports/indexes/renditions traceable enough to evaluate governance closure?
4. Is residency represented canonically or only through deployment/provider configuration?
5. Can provider binding express unsupported retention/hold/residency axes explicitly?
6. Does audit evidence retain policy/hold/deletion-eligibility revisions used for a destructive decision?
7. Can Station delegation narrow governance scope without weakening Enterprise obligations?
8. Are disconnected/local destructive operations fenced by evidence freshness and reconnect requalification?

## Promotion disposition

**PROMOTE `G2-CAPABILITY-CANDIDATE-PRIVACY-DATA-GOVERNANCE-RETENTION-LEGAL-HOLD-RESIDENCY` as `CROSS_CUTTING / NOT_SATURATED`.**

The threshold is met by convergent multi-representative evidence across a provider-neutral privacy framework, binding regulation, enterprise records/eDiscovery implementation, two independent cloud residency/control implementations and a provider-neutral policy enforcement engine. Distinct semantic ownership is required; provider-native mechanisms remain providerized.

Promotion does not assert implementation and does not authorize Construction, TASK execution or Work Package materialization.
