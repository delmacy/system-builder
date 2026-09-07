# Generation 2 — Planning C C3.9: Governance / Compliance / Audit Target Architecture

Status: **DECIDED / PASS_FOR_CAPABILITY**  
Phase: `PLANNING_C_TARGET_ARCHITECTURE`  
Capability: `Governance / Compliance / Audit`  
Decision scope: canonical target architecture only. No implementation, Planning D/E execution, WBS, Work Packages, executive TASKs, Construction or product code.

Entry branch head revalidated before persistence: `ec9f8f57127be139b811e69d81c35a948be400e7`.

## 1. Authorities and inherited constraints

Authoritative inputs:

- `project_docs/generation-2/RESEARCH_PIPELINE_STATE.json` — C3.9 is the only authorized next decision;
- `PLANNING_C_TARGET_ARCHITECTURE_ENTRY_FRAMEWORK.md`;
- `PLANNING_C_C0_UNIVERSAL_CAPABILITY_ARCHITECTURE_SEMANTIC_SUBSTRATE.md`;
- `PLANNING_C_C1_ELICITATION_SYSTEM_UNDERSTANDING_ARCHITECTURE.md`;
- `PLANNING_C_C2_PHYSICAL_PERIPHERAL_INTEGRATION_BOUNDARY.md`;
- `PLANNING_C_C3_08_AUTHORIZATION_POLICY_ORGANIZATION_MULTITENANCY_TARGET.md`;
- `PLANNING_A_GOVERNANCE_COMPLIANCE_AUDIT_BOUNDARIES.md`;
- `PLANNING_B_GOVERNANCE_COMPLIANCE_AUDIT_SB_CURRENT_STATE.md`;
- inherited adversarial inventory: 284 edge scenarios + 124 reusable `ConflictPattern`s = 408 material findings, with zero HIGH/CRITICAL lacking owner/proof/detection route.

Standing constitutional invariants:

- `governance obligation != operational authorization`;
- `audit record != canonical truth by itself`;
- `waiver != permission grant`;
- `control evidence != effective enforcement proof`;
- `remediation request/acknowledgement != verified closure`;
- `stale evidence != current compliance`;
- `provider control status != canonical compliance`;
- `Fleet aggregate != local current compliance`;
- `AI recommendation/synthesis != control or exception authority`;
- `observed behavior != intended process != approved canonical process`;
- `Research != remediation`; `ConflictPattern != ConflictInstance`; `Signal != ConfirmedConflict`.

## 2. Decision summary

Planning C adopts a **revision-qualified Canonical Governance, Compliance & Audit Plane** over C0 semantic identity, evidence/provenance/currentness, revision/coexistence, authority and residual-cohort primitives.

The capability owns the portable semantics required to determine:

1. which obligation/control/profile applies to a governed subject and scope;
2. which evidence requirements qualify an assessment and how complete/current that evidence is;
3. which assessment disposition may be claimed without strengthening weak or missing evidence;
4. how exceptions/waivers, findings, remediation commitments and attestations evolve without erasing historical truth;
5. how provider-native controls/reports and external frameworks are mapped without becoming canonical merely by name or certification label;
6. whether governance state is current across local/offline/Fleet, tenant, Station, jurisdiction, provider and lifecycle boundaries;
7. what remains unresolved after control revision, waiver expiry, provider substitution, remediation or evidence supersession.

The target architecture keeps the valuable existing SB mechanisms evidenced in Planning B — explicit evidence-bearing gates, explicit waivers with authority/rationale/risk/evidence, and bounded critical-decision audit projections — while **hardening and generalizing** them into product-level portable semantics. Repository execution governance remains evidence of useful mechanisms, not the canonical generated-system GRC model.

## 3. C3.9-DEC-001 — Canonical governance identities are distinct and revisioned

The architecture requires stable logical identities and immutable/material revisions for at least:

- `GovernanceObligationRef` / `GovernanceObligationRevisionRef`;
- `ControlObjectiveRef` / `ControlObjectiveRevisionRef`;
- `ComplianceProfileRef` / `ComplianceProfileRevisionRef`;
- `FrameworkMappingRef` / `FrameworkMappingRevisionRef`;
- `ApplicabilityDecisionRef`;
- `EvidenceRequirementRef` / revision;
- `AssessmentRef` and `AssessmentOccurrenceRef`;
- `AttestationRef`;
- `ExceptionWaiverRef` / revision;
- `CompensatingControlRef`;
- `AuditFindingRef`;
- `RemediationCommitmentRef`;
- `AuditClaimRef`;
- `CorrectionSupersessionRef`;
- `ResidualGovernanceCohortRef`;
- external/regulator/provider control and report realization references.

External control codes, regulator IDs, provider compliance IDs, GRC SaaS object IDs and certification labels remain external realization identities until an authorized mapping/adoption transition establishes canonical meaning.

String equality is never semantic equivalence.

## 4. C3.9-DEC-002 — Obligation and control applicability is explicit truth, not inferred from labels

An obligation/control/profile has no effective governance meaning without an applicability decision qualified by revisioned context.

Applicability must be able to reference:

- governed system/capability/object;
- Enterprise/organization/tenant/Station scope;
- jurisdiction and effective period;
- environment/deployment class;
- data classification, privacy/residency context where relevant;
- provider/binding/realization where relevant;
- operation/resource/actor class;
- obligation/control/profile and mapping revisions;
- applicability predicate and producing facts;
- authority/provenance of the applicability decision;
- currentness/evidence horizon.

Required applicability dispositions are at least:

- `APPLIES`;
- `DOES_NOT_APPLY`;
- `PARTIAL` where only a bounded subpopulation/scope qualifies;
- `INCONCLUSIVE` where required applicability facts are missing, stale, contradictory or unverifiable.

`NOT_APPLICABLE` in an assessment is therefore permitted only when backed by an explicit current applicability decision. It is never a convenience state for missing evidence.

## 5. C3.9-DEC-003 — Obligation, control objective, realization and evidence are separate semantic layers

The architecture distinguishes:

`normative obligation -> control objective -> realization/mechanism -> evidence -> assessment claim`.

A control objective specifies the condition that must hold. Its realization belongs to the native capability that performs/enforces the condition — Authorization, Security, Privacy, Deployment, Workflow, Integration, PKI, Artifact/Release, etc.

Governance owns the normative and assessment relationship but does not absorb operational ownership.

Therefore:

- an authorization policy may realize a control, but Governance does not become the authorization evaluator;
- a retention policy may realize a governance requirement, but Governance cannot authorize deletion or override legal hold;
- a firewall/fence may realize a security control, but a governance waiver cannot silently disable it;
- a signed artifact may satisfy evidence requirements, but the signature itself remains Artifact/Trust evidence;
- a provider-native compliance badge/report is evidence, not canonical compliance truth.

## 6. C3.9-DEC-004 — Evidence is qualified by source, scope, population, revision and currentness

Governance consumes evidence through C0-qualified evidence references. Every material evidence reference must support, where applicable:

- evidence identity;
- source/producer capability and producer identity;
- governed subject/scope/population;
- producer revision(s);
- occurrence/collection/observation time;
- effective/currentness interval or horizon;
- method/evaluator/provider/binding identity;
- completeness/coverage qualification;
- confidence/uncertainty where the source permits it;
- privacy/redaction/access restrictions;
- immutable supporting artifact reference where applicable;
- correction/supersession lineage;
- offline/degraded qualification.

Evidence presence alone is insufficient. A dashboard screenshot, log event, provider status page, audit export or attestation can be valid evidence while still being stale, partial, scoped to the wrong population or insufficient for the claimed control.

`absence of negative evidence != proof of compliance`.

## 7. C3.9-DEC-005 — Assessment semantics are multidimensional and non-strengthening

A compliance assessment is an applicability-scoped, revision-qualified claim over an explicit evidence set.

Required dispositions are at least:

- `COMPLIANT`;
- `NON_COMPLIANT`;
- `PARTIAL`;
- `INCONCLUSIVE`;
- `NOT_APPLICABLE`.

An assessment must carry:

- assessment identity/occurrence;
- governed subject/scope/population;
- obligation/control/profile/mapping revisions;
- applicability decision;
- evidence requirement revision;
- actual evidence set and qualification;
- assessment method/evaluator revision;
- actor/provider/binding where applicable;
- disposition;
- rationale and uncovered/failed dimensions;
- valid/effective/currentness horizon;
- correction/supersession lineage.

No scalar quality/compliance score may erase these dimensions. A score may exist as a derived analytical projection only if its formula, units/scale, inputs, uncertainty and limitations remain explicit.

Missing/stale/conflicting evidence cannot be coerced into `COMPLIANT`. `PARTIAL` and `INCONCLUSIVE` are first-class outcomes, not errors to hide.

## 8. C3.9-DEC-006 — Assessment currentness is independent from historical correctness

A historical assessment may remain a correct statement of what was established at time `T` under revisions `R`, while being unusable as a present compliance claim.

Requalification triggers include at least:

- obligation/control/profile revision;
- framework mapping revision;
- jurisdiction/effective-law change;
- provider/binding substitution;
- authorization/security/privacy/data-policy change;
- deployment/topology/environment change;
- evidence-source revision or coverage loss;
- evaluator/method revision;
- waiver/exception expiry/revoke;
- remediation change;
- significant Station/tenant/system scope change.

`historically COMPLIANT under R != currently COMPLIANT under R+1`.

## 9. C3.9-DEC-007 — Framework mappings are provider-neutral, revisioned and evidence-bearing

A framework mapping expresses a governed semantic relationship between an external/regulatory control and one or more canonical obligations/control objectives.

Mappings must preserve:

- external namespace/version/jurisdiction/profile;
- canonical target refs;
- mapping kind (`EQUIVALENT`, `NARROWS`, `BROADENS`, `OVERLAPS`, `EVIDENCE_ONLY`, or another explicit typed relation);
- assumptions/preconditions;
- authority/owner of mapping;
- effective period/currentness;
- evidence/rationale;
- supersession lineage.

Matching IDs, names, framework logos or vendor certifications cannot establish equivalence.

Provider substitution requires requalification of mapping fidelity and evidence semantics; it cannot copy old provider statuses as canonical truth.

## 10. C3.9-DEC-008 — Exceptions and waivers are expiring governance leases, not erased obligations

A canonical `ExceptionWaiver` is a first-class governed lease carrying at least:

- affected obligation/control/profile revision;
- governed subject/scope/population;
- issuing authority and authority basis;
- rationale/risk acceptance;
- supporting evidence;
- effective start;
- expiry/review condition;
- compensating controls/restrictions;
- approval/SoD lineage where required;
- revocation/supersession state;
- residual-cohort state after expiry/revoke.

The underlying obligation remains historically visible and semantically existent.

A waiver may alter governance disposition only within its declared scope. It does not grant runtime permission, create identity, bypass security fences, release legal hold, authorize physical actuation or manufacture provider authority.

Where an operational change is required, the owning capability must receive a separately authorized transition.

## 11. C3.9-DEC-009 — Break-glass governance is distinct from break-glass operational authority

Governance may define an emergency exception path for controls and assessment expectations. Authorization owns any temporary operational permission required to execute emergency work.

These are correlated but separate occurrences and identities.

Required evidence includes who invoked each path, under which authority, for what scope, for how long, what compensating obligations became active, and whether the emergency state was actually drained afterward.

`governance emergency accepted != runtime permission granted`.

## 12. C3.9-DEC-010 — Findings preserve historical truth and can reopen

An `AuditFinding` is a governed claim with stable identity and lifecycle, not a mutable ticket description.

It carries at least:

- originating assessment/evidence lineage;
- affected obligation/control and governed subject;
- finding classification/severity under a declared profile;
- owner/accountable party;
- opened time and producing revisions;
- current status;
- remediation commitments;
- accepted-risk/waiver relationship if any;
- validation evidence;
- close/reopen/supersede lineage.

Closure never rewrites the historical fact that the finding existed.

A superseding assessment can reopen a finding when the claimed postcondition no longer holds or evidence proves recurrence.

## 13. C3.9-DEC-011 — Remediation completion requires verified postcondition, not workflow completion

Governance owns the remediation commitment and its governance status. The remediation action itself may execute through Workflow, Deployment, Security, Authorization, Integration, human procedure or another owner.

The states must distinguish at least:

- remediation requested/committed;
- work started;
- work/operation acknowledged or completed;
- validation pending;
- verified effective;
- ineffective/failed;
- `PARTIAL`/`INCONCLUSIVE` where effect evidence is insufficient.

A closed workflow, merged change, provider `200 OK`, operator acknowledgement or ticket status `done` cannot by itself prove that the governed control is now satisfied.

Closure requires a current assessment or validation proof over the intended postcondition and scope.

## 14. C3.9-DEC-012 — Audit claims are append-preserving and correction-aware

An `AuditClaim` is an immutable/replayable claim produced from qualified evidence and assessment context.

Corrections do not destructively mutate the original record. The architecture uses explicit correction/supersession lineage carrying:

- original claim;
- correcting/superseding claim;
- authority and rationale;
- correction time;
- affected scope/revisions;
- impact on dependent assessments/findings/attestations.

Audit history must distinguish:

- what was asserted;
- what evidence was available then;
- what was later corrected;
- what is currently qualified.

`audit record exists != record is still current or correct`.

## 15. C3.9-DEC-013 — Attestation is a signed/authorized claim, not stronger truth than its evidence

An attestation may bind an authorized actor/evaluator to an assessment or claim. It carries signer/principal, authority, scope, revision, time, evidence references and validity/currentness.

Signature or approval establishes provenance/authorship under the Trust/Identity/Authorization evidence supplied. It does not strengthen stale, partial or invalid underlying evidence.

An external auditor/provider attestation is mapped evidence unless an explicit policy adopts it for a defined governance purpose and scope.

## 16. C3.9-DEC-014 — Privacy-safe evidence retention is a cross-capability contract

Governance requires durable auditability but does not own universal retention/privacy semantics.

Evidence references must support privacy-preserving patterns such as:

- minimal required evidence capture;
- redacted/pseudonymized projections;
- content hash or artifact reference instead of duplicated payload;
- access-controlled evidence compartments;
- retention/legal-hold references supplied by Privacy/Data Governance;
- jurisdiction/residency qualification;
- selective disclosure where permitted;
- lineage that survives payload redaction/destruction when policy requires it.

A compliance requirement cannot silently override privacy, legal hold or residency authority. Conflicts between evidence-retention obligations and privacy/data constraints become explicit governance/owner conflicts requiring an authorized resolution route.

## 17. C3.9-DEC-015 — External/provider enforcement status remains evidence, not canonical compliance

Provider-native controls, policy engines, cloud compliance dashboards, GRC tools, security scanners, identity systems, VMS/BMS/device administration consoles and managed-service reports may supply evidence and realization state.

The canonical layer records:

- provider/binding/revision;
- external control/resource identity;
- mapping to canonical control objective;
- evidence scope/population;
- observation/currentness;
- provider semantics and limitations;
- import/correction lineage.

`provider says enabled != effective enforcement proven`.

Where provider state and local/runtime evidence disagree, Governance records the conflict or `INCONCLUSIVE`/`PARTIAL` assessment rather than choosing silently.

## 18. C3.9-DEC-016 — Physical/Peripheral governance remains integration/governance plane only

Physical/Peripheral Integration is bounded by C2. Governance may:

- define controls over device/peripheral integrations;
- assess configuration, identity, connectivity, reconciliation, audit and safety evidence;
- consume provider/device/VMS/BMS/access-control status;
- track exceptions/findings/remediation related to those integrations.

It does not own direct physical actuation.

A compliance requirement such as “doors must remain locked” does not grant Governance permission to issue lock/unlock commands. Any exceptional provider-specific actuation remains outside the generic governance plane and must satisfy the separate C2 boundary and owning operational authority.

## 19. C3.9-DEC-017 — Local/offline governance uses QualifiedLocalClosure

A Station/client system may continue bounded governance assessment while disconnected only under an explicit local closure defining:

- retained obligation/control/profile/mapping revisions;
- retained evidence sources and horizons;
- local evaluator/method revision;
- maximum offline age;
- clock/time assumptions;
- excluded claims/controls that require remote or fresher evidence;
- local audit journal/provenance requirements;
- unresolved upstream/provider dependencies;
- reconnect requalification and evidence upload/reconciliation.

Offline operation cannot widen waiver scope, extend expiry, invent a current attestation or turn stale evidence into compliance.

When evidence exceeds its horizon, disposition becomes `PARTIAL` or `INCONCLUSIVE` as appropriate.

## 20. C3.9-DEC-018 — Fleet aggregates governance state without manufacturing local truth

Fleet may aggregate:

- control/profile adoption and revision state;
- assessment dispositions and age;
- stale/missing evidence;
- open findings and remediation backlog;
- expiring/expired waivers;
- residual provider/control cohorts;
- evaluator/provider health;
- queue depth/age;
- local/offline currentness horizons;
- unresolved conflicts and evidence gaps.

Fleet may orchestrate authorized reassessment, evidence collection or review. The receiving Station/client still owns its locally applied/effective state under canonical rules.

`Fleet desired control != local realized control != local current compliant state`.

## 21. C3.9-DEC-019 — Residual governance cohorts are first-class

Control/policy revisions, waiver expiry/revocation, mapping withdrawal, provider substitution, evaluator replacement and remediation changes can leave consumers on older semantics.

Residual cohorts may include:

- cached waivers/exceptions;
- local/offline evaluators;
- stale assessment caches;
- old provider control mappings;
- historical dashboards/reports still treated as current;
- queued assessment jobs;
- external GRC integrations;
- Station agents disconnected during rollout;
- automation workers using superseded control/evidence rules.

Canonical state therefore distinguishes declared/superseded governance state from observed effective convergence.

A change is not globally effective merely because the canonical revision was published.

## 22. C3.9-DEC-020 — Assessment/evidence collection is a capacity-bearing operational service

Governance production semantics include:

- expected and peak assessment/evidence event rates;
- evidence ingestion backlog and age;
- evaluator throughput/latency;
- provider/API quotas;
- retry/reconciliation behavior;
- tenant/Station fairness and isolation;
- evidence storage/retention pressure;
- review/approval queue depth and age;
- remediation validation throughput;
- stale-evidence rate;
- residual-cohort drainage throughput;
- overload degradation rules.

Overload cannot be hidden by extending evidence currentness, skipping mandatory populations, dropping inconvenient failures or marking `INCONCLUSIVE` as `COMPLIANT`.

Queue priority does not manufacture governance authority.

## 23. C3.9-DEC-021 — Brownfield/manual controls enter as evidence and candidates, not automatic canon

Mirroring-first Brownfield assimilation may discover:

- spreadsheets used as control registers;
- manual checklists;
- verbal approvals;
- email-based exception grants;
- screenshots and exported reports;
- ad hoc scripts and shadow dashboards;
- provider-native certifications;
- undocumented support bypasses;
- manual physical/peripheral operating controls;
- periodic audit procedures;
- key-person dependencies and emergency routines.

These are captured through C1 epistemic states: `Fact`, `Claim`, `Assumption`, `InferredCandidate`, `Decision`, `Requirement`, `Constraint`, `OpenQuestion`, `Conflict`, `Unknown`, `OutOfScope`, `Deferred`.

`observed practice != intended process != approved canonical control`.

Conflicting stakeholder descriptions or artifacts remain explicit conflicts with owners/evidence/decision route. AI cannot silently choose the “most plausible” policy.

## 24. C3.9-DEC-022 — Governance Elicitation Lens is capability-specific and adaptive

The Governance / Compliance / Audit Elicitation Lens extends the C1 Elicitation Knowledge Base and must adaptively cover at least:

### Purpose and applicability

- Which legal, contractual, institutional, customer, certification or internal obligations matter?
- Which systems/capabilities/data classes/Stations/tenants/environments/providers do they apply to?
- What conditions make an obligation apply, cease to apply or become uncertain?
- Which jurisdiction/effective-period changes can invalidate applicability?

### Control semantics

- What condition must be true for the control objective to be satisfied?
- Which native capability actually realizes/enforces it?
- Is the control preventive, detective, corrective, compensating or evidentiary?
- Which failures make enforcement `UNKNOWN` rather than failed/passed?

### Evidence

- What exact evidence is expected?
- What population/coverage is required?
- How fresh/current must it be?
- Who/what produces it and under which revision?
- Can it be independently verified?
- What happens when evidence is missing, delayed, contradictory, privacy-restricted or provider-owned?

### Exceptions/waivers

- Who may issue/review/revoke them?
- Which superior obligations cannot be waived locally?
- What is the expiry/review rule?
- What compensating controls are required?
- Does the exception imply a separate operational authorization action?
- How is residual enforcement after expiry/revoke detected?

### Findings/remediation

- What opens a finding?
- Who owns remediation?
- What proves the postcondition?
- Can a finding reopen?
- What is accepted risk versus verified closure?

### Audit/currentness

- Which claims must remain replayable historically?
- Which corrections/supersessions are possible?
- What retention/privacy constraints apply?
- What makes a previously valid assessment no longer current?

### Negative space and Brownfield

- Which controls live only in spreadsheets, email, chat or key-person knowledge?
- What unofficial exception paths exist?
- What rare high-impact cases bypass normal process?
- Which provider reports are trusted without independent scope/currentness checks?
- Which “manual sign-off” practices are undocumented or lack authority provenance?

Follow-ups are driven by answers. Example:

`“Control is reviewed manually each quarter.”`

must branch into reviewer authority, population/sample, evidence artifact, review method, due-date/currentness, missed-review behavior, exception route, contradictory reviewer outcome, historical retention, and whether quarterly cadence is sufficient for material mid-period changes.

## 25. C3.9-DEC-023 — Elicitation answers route across capability ownership without duplication

When a governance question reveals facts owned elsewhere, the answer is semantically linked to that owner rather than duplicated as governance truth.

Examples:

- “Who may approve this waiver?” routes authority truth to Authorization while Governance references the decision;
- “How long must this evidence be retained?” routes retention/legal-hold truth to Privacy/Data Governance;
- “Was the firewall rule actually applied?” routes realization/effect evidence to Security/Integration/provider owners;
- “Was the certificate valid?” routes trust/path/revocation truth to PKI;
- “Was the release signed?” routes artifact/provenance truth to Artifact/Release;
- “Was the physical controller reachable?” routes connectivity/provider evidence to Integration/Physical-Peripheral plane.

The EKB preserves one semantic owner and multiple typed references.

## 26. C3.9-DEC-024 — Coverage and sufficiency use dimensions, never a false single completion score

For each governed control/object, candidate coverage dimensions include:

- purpose/obligation source;
- applicability;
- governed subjects/scopes;
- owner/authority;
- realization owner;
- evidence requirements;
- evidence source/currentness/coverage;
- exception/waiver semantics;
- failure/`PARTIAL`/`INCONCLUSIVE` behavior;
- audit/provenance;
- remediation/closure proof;
- privacy/retention;
- provider/external mappings;
- local/offline/Fleet behavior;
- lifecycle/versioning;
- scale/capacity;
- observability;
- acceptance/product proof.

Each dimension uses C1 states such as `UNTOUCHED`, `DISCOVERING`, `PARTIAL`, `RESOLVED`, `CONFLICTED`, `BLOCKED`, `NOT_APPLICABLE`, `DEFERRED`, with evidence/currentness.

Sufficiency is stage-specific:

- **sufficient for abstraction** — owner, purpose, governed scope and core obligation/control distinctions are known enough to model candidates;
- **sufficient for candidate architecture** — applicability, authority boundaries, evidence semantics, failure states and external-owner references are represented;
- **sufficient for implementation** — operational workflows, provider/binding qualifications, lifecycle, capacity, privacy/retention, exception and proof obligations are resolved to implementation-safe detail;
- **sufficient for publish/operation** — current evidence proves required controls/owners/providers/queues/offline behavior/waiver drainage/readiness under the release scope.

No stage implies absolute completeness.

## 27. C3.9-DEC-025 — Critical-gap detection is mandatory

The EKB/coverage layer must automatically surface at least these governance-critical gaps:

- obligation/control applicability unknown;
- authority to issue/revoke waiver unknown;
- mandatory evidence source or currentness undefined;
- evidence population/coverage ambiguous;
- external/provider status used without semantic mapping;
- `NOT_APPLICABLE` without explicit applicability proof;
- remediation closure without postcondition proof;
- expired/revoked waiver with residual cohorts unknown;
- privacy-sensitive evidence without policy/retention basis;
- local/offline evaluator without currentness horizon;
- assessment method/provider substitution without requalification;
- jurisdiction/effective-period undefined;
- control realization owner unknown;
- physical/peripheral control implying actuation without explicit separate authority;
- AI-generated assessment/waiver/attestation without authorized human or machine authority path.

Such gaps block the downstream artifacts whose claims depend on them; they do not merely reduce a score.

## 28. C3.9-DEC-026 — Product readiness is separate from design completeness

A Governance Production Readiness view must be able to establish, per release/Station/tenant/site as applicable:

- active obligation/control/profile revisions;
- applicability resolution currentness;
- evaluator/evidence provider readiness;
- evidence-source health/coverage;
- assessment backlog and latency;
- required waivers and expiry windows;
- residual cohorts after revision/migration;
- privacy/retention constraints;
- local/offline closure age and reconnect path;
- provider/binding qualification;
- unresolved HIGH/CRITICAL findings/conflicts according to policy;
- audit journal/provenance availability;
- capacity/headroom and overload behavior;
- remediation validation route;
- rollback/requalification behavior.

A system that can render a compliance dashboard is not automatically ready to make current compliance claims.

## 29. C3.9-DEC-027 — AI, Wizard and AGWS remain bounded assistants/presentation layers

AI may suggest:

- candidate controls/mappings;
- missing evidence questions;
- candidate applicability relationships;
- draft assessments/findings/remediation plans;
- anomaly/contradiction detection;
- stories/use cases/scenarios and acceptance-proof candidates.

Wizard/AGWS may present:

- coverage checklists;
- unresolved questions;
- evidence queues;
- assessment/review surfaces;
- waiver/finding/remediation workflows;
- Fleet/local currentness views.

But:

- `AI inference = candidate`, never authority;
- AI cannot self-issue a waiver, self-attest compliance or broaden evidence validity;
- UI visibility cannot suppress mandatory controls/evidence;
- AGWS cannot turn `INCONCLUSIVE` into `COMPLIANT`;
- a generated summary is not canonical evidence unless independently admitted through an authorized evidence path.

## 30. C3.9-DEC-028 — Semantic traceability is end-to-end

Governance participates in the C1 candidate traceability chain:

`Source/Elicitation Evidence -> Finding/Answer -> Requirement/Constraint -> User Story/Use Case/Scenario -> Semantic Model -> Governance Obligation/Control/Appplicability/Assessment/etc. -> Acceptance Criterion -> Test/Product Proof -> Runtime Evidence`.

Each story/use case/scenario/requirement links back to canonical governance refs plus related capability refs (Authorization, Data, Workflow, Integration, Security, Privacy, UI, Provider, Trust, etc.).

User Stories express intent/value/context but are never sufficient specification alone. Use Cases must include preconditions, triggers, main/alternative/failure/recovery flows and postconditions. Scenarios must cover happy, alternate, failure, boundary, misuse/abuse, recovery, offline, concurrency and historical/version-change cases where relevant.

## 31. C3.9-DEC-029 — Provider substitution is a support-vector decision

A GRC/evidence/assessment provider is substitutable only after qualifying a multidimensional support vector including:

- obligation/control/profile semantic coverage;
- mapping fidelity;
- applicability semantics;
- evidence provenance/currentness/coverage;
- assessment dispositions including `PARTIAL/INCONCLUSIVE`;
- exception/waiver lifecycle;
- finding/remediation lifecycle;
- audit export/replay/correction;
- identity/authority integration;
- tenant/Station/site isolation;
- local/offline/self-hosted requirements;
- API/rate/capacity behavior;
- data residency/privacy/retention;
- migration/coexistence and residual-state drainage.

A provider advertising the same framework is insufficient proof of substitutability.

## 32. C3.9-DEC-030 — Planning D migration constraints

Planning D must preserve these constraints when migrating existing SB governance/documentation toward this architecture:

1. do not big-bang replace existing execution-governance gates/waiver mechanisms that already encode valuable evidence/authority semantics;
2. keep repository governance distinct from generated-system canonical governance;
3. migrate free-form policy/control/audit notes incrementally into structured identities while preserving source text as evidence/context;
4. introduce revision/currentness and evidence qualification additively before relying on current-compliance claims;
5. preserve existing critical-decision audit projection and generalize only through explicit owner-safe adapters;
6. external provider/GRC mappings remain realization mappings until adopted;
7. preserve historical audit records during correction/supersession migration;
8. coexist old/new assessment representations with explicit conversion/provenance status;
9. migrate waivers as scoped/expiring objects without turning legacy bypasses into canonical permission;
10. establish residual-cohort detection before claiming completed cutover;
11. preserve C1 free-form notes + structured evidence coexistence;
12. keep Physical/Peripheral scope within C2 integration/governance boundary.

These are migration constraints, not permission to execute Planning D now.

## 33. C3.9-DEC-031 — Planning E product-proof candidates

Planning E must later derive proof candidates for at least:

- deterministic applicability resolution against pinned revisions;
- `NOT_APPLICABLE` forbidden without explicit applicability evidence;
- stale/missing/partial/conflicting evidence producing `PARTIAL`/`INCONCLUSIVE`, never false PASS;
- evidence population/coverage qualification;
- historical assessment replay under producing revisions;
- control revision forcing requalification where required;
- waiver expiry/revoke without operational permission amplification;
- residual waiver/provider/evaluator cohort detection;
- finding close/reopen/supersede lineage;
- remediation acknowledgement versus verified postcondition;
- audit correction/supersession preserving original record;
- provider control report remaining evidence rather than canonical truth;
- Fleet aggregate not manufacturing local compliance;
- bounded offline currentness and reconnect requalification;
- privacy-safe evidence retention behavior;
- framework/provider substitution support-vector rejection on semantic gaps;
- adaptive governance questioning and unresolved inbox routing;
- contradiction preservation across stakeholders/sources;
- critical-gap detection and blocked-artifact propagation;
- story/use-case/scenario generation with semantic references;
- no false `complete` state in elicitation/coverage;
- AI incapable of self-waiver/self-attestation/false strengthening;
- physical/peripheral governance unable to manufacture actuation authority;
- queue/capacity overload unable to widen evidence validity or suppress failed populations.

These are proof obligations/candidates only, not tests executed in Planning C.

## 34. Inherited adversarial obligations mapped into C3.9

The 408 inherited material findings remain research evidence and reusable proof obligations. No new `ConflictInstance` is created by this decision.

C3.9 explicitly absorbs the already-discovered classes concerning:

- policy/control revision skew;
- stale or incomplete audit populations;
- evidence survivorship and currentness;
- provider-status versus effective-enforcement divergence;
- waiver/remediation supersession;
- residual cohorts;
- Brownfield manual/shadow controls;
- jurisdiction/tenant/Station scope changes;
- offline/Fleet false currentness;
- privacy/trust leakage in evidence;
- queue/capacity pressure;
- AI/low-code authority amplification;
- Elicitation/System Understanding false completeness;
- Physical/Peripheral integration boundary violations.

`ConflictPattern` remains reusable design/test knowledge. It becomes a `ConflictInstance` only if a concrete observed system/revision/evidence set satisfies the pattern under the appropriate authority path.

## 35. Boundary reconciliation

### Authorization / Policy / Organization / Multitenancy

Authorization owns runtime `ALLOW/DENY/INCONCLUSIVE`, policy applicability for operational authority, delegation/SoD and permission truth. Governance may require controls over Authorization and consume authorization decisions as evidence. A governance waiver never creates an authorization grant.

### Privacy / Data Governance

Privacy owns purpose, retention, legal hold, residency, transfer and data-subject constraints. Governance may assess them but cannot override them.

### Security / Resilience / Failure Recovery

Security owns realization of security controls and recovery/fencing. Governance owns normative control/assessment/exception semantics.

### Observability / Operations / Incident

Observability owns telemetry and operational evidence generation/freshness. Governance owns the qualified assessment consuming it.

### Enterprise Trust / PKI

Trust owns signatures, certificate/path/revocation and trust anchors. Governance consumes qualified trust evidence.

### Provider / Binding

Provider/Binding owns provider discovery/admission/binding/substitution. Governance owns provider-neutral control/assessment semantics and support-vector requirements.

### Lifecycle / Versioning / Evolution

Lifecycle owns generic migration/coexistence/withdrawal primitives. Governance specializes them for obligations, assessments, waivers, findings and claims.

### Artifact / Release / Provenance

Artifact/Release owns artifact identity, SBOM/signature/provenance and promotion. Governance consumes them as evidence and may define release-control obligations.

### Elicitation & System Understanding

C1 owns EKB mechanics, epistemic state, question provenance, adaptive sequencing, unresolved inbox and general coverage semantics. Governance supplies its capability-specific lens and semantic refs.

### Physical / Peripheral Integration

C2 confines this area to integration/governance plane. Governance can assess/control integrations, never inherit generic direct actuation authority.

## 36. Decision result

**PASS_FOR_CAPABILITY / TARGET_ARCHITECTURE_DECIDED.**

Governance / Compliance / Audit is decided as a revisioned, evidence-qualified, provider-neutral semantic owner for obligations, controls, applicability, assessments, exceptions/waivers, findings, remediation commitments, attestations and audit claims. It is explicitly not the owner of runtime authorization, underlying operational control realization, universal evidence truth, privacy/retention policy, provider identity or physical actuation.

The architecture rejects false binary compliance, stale evidence strengthening, provider-status canonization, waiver-as-permission, remediation-ack-as-proof and aggregate/Fleet false currentness. It carries C1 Elicitation/System Understanding as an adaptive capability lens with dimensional sufficiency and critical-gap detection, plus C2's Physical/Peripheral integration/governance boundary.

Planning D/E carry-forward is recorded but not executed.

Next authorized decision after state reconciliation: **C3.10**, exactly as named by the reconciled `RESEARCH_PIPELINE_STATE.json`; no later capability may be assumed before re-reading that state.