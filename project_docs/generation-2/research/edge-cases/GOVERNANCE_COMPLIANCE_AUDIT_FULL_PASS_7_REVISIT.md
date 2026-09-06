# Generation 2 — Governance / Compliance / Audit — Full Pass 7 Revisit

Status: ACTIVE — ELIGIBLE NO-NEW-MATERIAL REVISIT
Phase: `RESEARCH_ADVERSARIAL_EDGE_CASE_SATURATION`
Capability: Governance / Compliance / Audit
Pass: 7
Authority: `RESEARCH_PIPELINE_STATE.json`, `ADVERSARIAL_SATURATION_STATE.json`, `POST_MATH_ADVERSARIAL_EDGE_CASE_SATURATION_RESEARCH.md`, `PROCESSUAL_SEMANTIC_CONFLICT_CLASSIFICATION.md`, `SEMANTIC_GRAPH_FEDERATION_SOUNDNESS_EXECUTION_PROOF_RESEARCH.md`, `PHYSICAL_PERIPHERAL_OPERATIONS_INTEGRATION_PLANE_BOUNDARY.md`.

Research only. No remediation, product work, Work Package, TASK or Construction is authorized. `Research != remediation`; `ConflictPattern != ConflictInstance`; `Signal != ConfirmedConflict`.

## 1. Pass-7 lens

This revisit used a materially different lens from Pass 6: **external-control-plane applicability slicing + provisioning/revocation convergence subtraction + provider-audit completeness cuts + site/tenant scope permutation + control-plane boundary abuse + brownfield evidence contamination**.

The core separation remains:

`control definition != applicability decision != requested provider change != provider acknowledgement != effective external state != physical truth != evidence record != audit conclusion != remediation closure != proof claim`.

Typed Semantic Graph, ExecutionEnvelope/ExecutionState/ExecutionJournal, Inter-System/Federated Graph, explicit control-flow semantics, analytical/vector kinds, temporal validity, provenance, decision ownership, units, uncertainty, graph-revision semantics, Legacy Mirroring and Physical/Peripheral integration remain research hypotheses/boundaries only. No architecture is materialized here.

## 2. Evidence refresh

Fresh evidence was used to challenge the standing patterns rather than to copy provider-specific mechanics into canonical semantics.

- Open Policy Agent bundles document an eventually consistent policy/data distribution model. An active bundle on one enforcement point therefore cannot, by itself, prove fleet/site-wide simultaneous applicability or enforcement convergence.
- OPA decision logs carry policy query, input, bundle metadata and decision identity useful for audit/offline debugging, but remain evidence of a policy decision event rather than proof of downstream business or physical effect.
- ONVIF Profile A explicitly covers granting/revoking credentials, schedules, access rules, status and events for interoperable access-control integration. ONVIF also separates access classes such as read/media from actuation, reinforcing that read/provision/broker capabilities do not imply generic physical-control authority.
- NIST IoT guidance treats least privilege, account/role administration and auditable cybersecurity events as explicit concerns. Device/provider audit state remains qualified evidence, not automatically physical truth.
- The July 2026 SCIM IPSIE draft provides a useful deprovisioning witness: account deactivation, propagation, authorization removal and active-session revocation are distinct obligations/stages; session revocation mechanics remain outside the profile. This reinforces `deactivate accepted != every access mechanism already ineffective`.

## 3. Adversarial probes and duplicate-screen disposition

### 3.1 Time-qualified controls on external systems/sites

Probed a governance rule whose `effectiveFrom/effectiveUntil` is valid in the SB semantic graph while provider sites, edge gateways or external enforcement points receive the corresponding configuration at different times.

Activation variants included future policy applied early, waiver expired while a provider remains offline, overlapping site-specific exceptions, and in-flight workflow instances pinned to a prior policy revision.

Detection candidates: compare policy/control revision, target site/provider binding, effective interval, last confirmed provider activation, residual/offline cohorts and execution revision. False-positive risk is material where provider activation evidence is delayed but enforcement is already effective.

Disposition: duplicate-screen into existing temporal/currentness, residual-cohort, provider-effect and policy-precedence ConflictPatterns. No 125th reusable pattern justified.

### 3.2 Requested/acknowledged/effective permission-state fracture

Probed governance closure where SB requested external user disable, role removal or access-rule revocation and provider API returned success, while sessions, tokens, replicated controllers or offline readers may still honor previous grants.

Semantic ownership remains split: Identity/Authorization owns canonical subject/authority semantics; Integration/provider adapters own realization mechanics/evidence; Governance owns control applicability/compliance assessment. Physical specialized systems remain their control planes.

Detection candidates: desired-vs-observed permission state, provider resource inventory, token/session expiry where observable, reconciliation checkpoints, device/controller currentness and residual cohort enumeration. `provider reported state != physical truth` remains mandatory.

Disposition: duplicate-screen into acknowledgement-versus-effect, false convergence, residual cohort, authority currentness and external-effect proof families. No new pattern.

### 3.3 Audit pagination/gap and selective evidence completeness

Probed provider audit APIs with pagination, retention windows, sampling, export limits, event gaps, delayed delivery and unsupported event classes. A complete-looking local audit projection can therefore be incomplete relative to the external source.

Detection candidates: cursor continuity, source retention horizon, page completeness, expected-versus-observed event classes, gap intervals, clock/currentness metadata and provider capability matrix. A gap is a `Signal`, not proof of noncompliance.

Disposition: existing evidence completeness/currentness, observation-bound truth, partial projection and proof-claim conflation families cover the class.

### 3.4 Unsupported scope silently narrows a control

Probed canonical policy requiring site/group/resource-qualified restriction while provider supports only coarser user/role scope. Also probed VMS/access/BMS/PDV adapters that expose similarly named features with different granularity.

Detection candidates: explicit provider capability qualification, unsupported-scope diagnostics, semantic mapping provenance and reconciliation after provisioning. A provider feature-name match is insufficient evidence of semantic equivalence.

Disposition: existing provider semantic mismatch, scope weakening/authority amplification and conformance-semantics patterns. No new reusable family.

### 3.5 External inventory incompleteness and orphan resources

Probed governance review based on enumerated users, grants, devices, cameras, doors, sites or controllers when API visibility is filtered, stale, permission-limited or missing offline resources. A clean reconciled subset may coexist with unobserved noncompliant resources.

Detection candidates: inventory coverage declaration, provider pagination completeness, scope/credential qualification, last-seen horizons, expected topology and negative evidence bounds. Absence from a bounded inventory is not proof of absence from the physical/provider estate.

Disposition: duplicate-screen into incomplete inventory/evidence-bound, residual cohort, projection and false-convergence patterns.

### 3.6 Remediation ticket closed while external condition persists

Probed a compliance exception/remediation workflow marked closed after provider acknowledgement, manual vendor-console action or user assertion, while effective external state remains stale/unknown.

Detection candidates: remediation workflow state separated from provider reconciliation/effect evidence; explicit `PARTIAL/UNKNOWN`; post-effect observation where feasible; unresolved residual targets.

Disposition: existing remediation-acknowledgement-versus-effective-closure and proof-claim families. No new pattern.

### 3.7 Human vendor-console procedures and authority drift

Probed legitimate emergency/manual work performed in VMS/access/BMS/PDV consoles outside SB orchestration. The action may be operationally valid while its later synchronization creates apparent drift or contradicts an SB-side assumption.

Detection candidates: external change provenance where available, actor/source classification, temporal ordering, policy applicability and reconciliation queue. A drift signal must not automatically classify the manual action as unauthorized.

Disposition: existing human-procedure, external mutation, semantic ownership, authority/currentness and reconciliation patterns.

### 3.8 Legacy Mirroring contaminates governance evidence

Probed imported spreadsheets/CSV/PDF/email access lists and historical audit exports treated as current authorization/compliance truth. Also probed inferred column mappings, duplicated identities and historical records recomputed under current policy/formula semantics.

Detection candidates: source provenance, mapping approval, valid-time/transaction-time, source-of-truth status, entity-resolution confidence, historical revision pinning and reconciliation sampling.

Disposition: existing brownfield provenance/currentness, inferred-semantics, historical reinterpretation, duplicate identity and source-of-truth conflict families. No new pattern.

### 3.9 Privacy/retention conflict for physical/access evidence

Probed long-retention audit requirements against minimization, deletion, residency and legal-hold obligations for camera/access/presence events. Also probed proofs that retain only hashes/commitments after raw evidence deletion.

Detection candidates: policy precedence evidence, evidence class/retention purpose, legal-hold scope, residency, deletion eligibility and proof-obligation sufficiency. Hashes preserve commitments/integrity properties, not missing semantic evidence.

Disposition: existing policy/compliance conflict, retention/legal-hold/privacy and proof-claim qualification patterns.

### 3.10 Multidimensional risk and uncertainty collapse

Probed `RiskVector`, stale-device probability, event-gap interval, provider health confidence and compliance severity collapsed into a deterministic scalar without policy-defined aggregation. Also probed AI-generated summaries converting incomplete provider evidence into categorical compliance status.

Detection candidates: preserve analytical kind, units, confidence/interval, assumptions, evidence currentness and decision owner; require explicit policy semantics for scalarization.

Disposition: existing analytical-kind conflation, uncertainty collapse, objective/optimization and AI/low-code evidence-strengthening patterns.

### 3.11 Control-plane boundary abuse / accidental actuation authority

Probed low-code or AI composition that sees provider support for access-control configuration/events and infers generic authority to open doors, gates, cameras or change physical setpoints. Also probed a high-level permission grant being reused as actuation authorization.

The bounded Physical/Peripheral research boundary remains decisive: SB defaults to semantic/integration/governance plane; specialized VMS/access/BMS/PDV systems remain provider media/control/runtime planes. Direct physical actuation remains non-goal/provider-specific exceptional extension unless separately authorized later.

Detection candidates: operation-class qualification (`read/query`, `provision/sync`, `broker`, `event`, `actuate`), explicit provider capability matrix, authority proof, site/resource scope and high-risk extension status.

Disposition: duplicate-screen into authority amplification, provider semantic mismatch and AI/low-code composition families. No new pattern.

### 3.12 Federated responsibility and cross-company enforcement

Probed a holding/company boundary where one autonomous system defines a control obligation and another provider/system realizes it. Contract acknowledgement, SLA compliance and evidence handoff can disagree without shared mutable state.

Detection candidates: versioned inter-system contract, correlation identity, obligation owner, effect/evidence disposition, SLA/currentness, provider/site target and unresolved `UNKNOWN` state.

Disposition: existing federated continuity, ownership/responsibility, external-effect and proof composition patterns.

## 4. Conflict classification / materiality result

All candidates were duplicate-screened against the standing **124** reusable ConflictPatterns. None survives as a materially distinct 125th reusable class.

No `ConflictInstance` is asserted. All provider/audit/drift observations remain signals or bounded evidence unless their activation conditions are confirmed in a concrete system/revision/runtime context.

No new preventive invariant is adopted in this research pass. The default disposition remains:

`CATALOGUE + CLASSIFY + DETECTION_CANDIDATE + FUTURE_REMEDIATION_ROUTE`.

## 5. Carry-forward candidates

The revisit strengthens, without deciding architecture, the following Planning C/D/E and Architecture Reconciliation inputs:

- explicit time/currentness qualification for external control applicability and enforcement evidence;
- typed distinction among canonical subject, external account, grant, session/token, external resource, provider binding, event/telemetry and optional physical effect;
- desired/requested/accepted/observed/effective external state separation;
- provider capability qualification by operation class and semantic scope rather than feature-name equivalence;
- audit/inventory completeness metadata and gap-aware reconciliation;
- Legacy Mirroring provenance/mapping approval before brownfield evidence may support governance conclusions;
- cross-system obligation/evidence handoff without requiring shared mutable runtime state;
- completion/proof bundles that preserve the distinction between policy-decision evidence, journal integrity and external/physical effect evidence;
- explicit non-goal boundary preventing accidental expansion into specialized VMS/access/BMS/PDV/device-control software.

Planning C must decide provisioning/read/event integration versus specialized control-plane boundaries and the semantic ownership split. Planning D must preserve provider migration/coexistence/residual cohorts. Planning E must require product proofs for provisioning/deprovisioning, revoke/reconciliation, permission drift, site/tenant isolation, read/event currentness, provider outage/gaps and no accidental authority expansion.

## 6. Saturation disposition

- result: **ELIGIBLE NO-NEW-MATERIAL REVISIT**;
- new local edge scenarios: **0**;
- new cross-capability edge scenarios: **0**;
- new reusable ConflictPatterns: **0**;
- new ConflictInstances: **0**;
- preventive invariant candidates adopted: **0**;
- Governance local no-material streak: **1 -> 2**;
- material inventory: **284 edge scenarios + 124 ConflictPatterns = 408**;
- HIGH/CRITICAL without owner/proof/detection route: **0**;
- Full Pass 7 capability coverage after revisit: **18/28**;
- mandatory cluster coverage: **12/12**;
- completed full passes: **6/8 minimum**;
- negative-space review: **NOT_STARTED**;
- saturation: **NOT_SATURATED**;
- Planning C: **BLOCKED**.

## 7. Next rotation

Continue Full Pass 7 with **Security / Resilience / Failure Recovery**. Carry the standing semantic/modeling lenses, bounded Legacy Mirroring and Physical/Peripheral integration-plane boundary. Challenge recovery/restoration across provider sites and temporal revisions; residual accounts/sessions/grants/controllers after revoke or restore; provider outage and edge/offline buffering; partial/UNKNOWN external mutations; reconcile-before-retry; fencing/concurrent recovery owners; audit/provenance survival; control re-protection after recovery; cross-tenant/site isolation; safety boundary against accidental physical actuation; human emergency vendor-console operations; and AI/low-code recovery actions that strengthen authority or weak evidence.

Security is already at no-material streak 2; do not inflate the capped streak absent material novelty. Do not enter Planning C.