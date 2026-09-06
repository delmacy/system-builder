# Generation 2 — Integration & Automation — Full Pass 8 Revisit

Status: ELIGIBLE NO-NEW-MATERIAL REVISIT
Phase: `RESEARCH_ADVERSARIAL_EDGE_CASE_SATURATION`
Capability: Integration & Automation
Pass: 8

Research only. No product code, Work Package, TASK, Construction or remediation is authorized. Preserve `ConflictPattern != ConflictInstance`, `Signal != ConfirmedConflict`, and `Research != remediation`.

## 1. Authority and starting state

This revisit follows `RESEARCH_PIPELINE_STATE.json`, `POST_MATH_ADVERSARIAL_EDGE_CASE_SATURATION_RESEARCH.md`, `PROCESSUAL_SEMANTIC_CONFLICT_CLASSIFICATION.md`, and the standing Elicitation / System Understanding, Legacy Mirroring and bounded Physical/Peripheral integration research lenses.

Authoritative start: Full Pass 8 at 14/28 capabilities and 12/12 mandatory clusters, with 284 material edge scenarios + 124 reusable ConflictPatterns = 408 material findings. Integration's local no-material streak was already 2 and is capped absent material novelty.

This pass deliberately changes probes from Full Pass 7. Rather than re-running the same provider-profile and basic provisioning questions, it attacks **operation-batch semantics, event-order scope, currentness reset, cross-hop provenance erosion, declarative-versus-effective integration truth, elicitation sufficiency for integration contracts, queue stability and cross-system responsibility cuts**.

## 2. Materially different adversarial probes

### 2.1 Batch success can hide per-operation divergence

A transport-level or batch-level success must not be promoted to business convergence. SCIM bulk semantics are a useful witness: individual operations carry their own status and the provider normally continues performing as many changes as possible despite partial failures unless `failOnErrors` changes the stop condition. By contrast, a single SCIM PATCH request is atomic at the resource level. The same protocol therefore contains materially different atomicity scopes.

Adversarial cases:
- a bulk user/group/site provisioning request returns overall success while one revoke fails;
- retrying the entire batch duplicates already-applied independent operations;
- client assumes PATCH-style atomicity for bulk semantics;
- provider reorders independent operations while preserving provider-defined intent, but the SB had inferred a stronger causal order;
- a failed member removal coexists with a successful account disable and residual offline/device access.

Result: no new material family. Duplicate-screen maps to existing ambiguous external mutation, batch/partial-effect, retry/idempotency, false convergence, authority-currentness and residual-cohort families.

Proof obligations refined:
1. bind atomicity/effect disposition to the qualified operation scope, not the envelope/request status;
2. retain per-operation `APPLIED|NOT_APPLIED|PARTIAL|UNKNOWN` and retry eligibility;
3. reconcile already-applied effects before replaying a failed/ambiguous batch;
4. prevent aggregate success UI from hiding unresolved high-risk sub-operations.

Evidence: RFC 7644 SCIM Protocol, especially PATCH atomicity and Bulk Operations (`failOnErrors`, per-operation status, continuation after partial failures): https://www.rfc-editor.org/rfc/rfc7644

### 2.2 Event ordering is source-qualified and can decay across hops

CloudEvents sequence semantics provide a useful falsifier: sequence is meaningful within the scope of a unique `source`; values from different sources are not globally comparable. The partitioning extension further notes that a partition key may change or disappear across hops because of protocol or business processing.

Adversarial cases:
- two providers emit individually ordered streams but an integrator invents a global causal ordering;
- a broker repartitions events and downstream code interprets partition order as business causality;
- source identity changes during provider substitution while sequence numbers look continuous;
- replay from an archive is mixed with live events and visual ordering is mistaken for effective ordering;
- Brownfield event chronology is promoted into intended process order without owner approval.

Preserve:

`source-local sequence != global order != causality != authority`.

Result: no new material family. Duplicate-screen maps to temporal/ordering, provenance/causal non-strengthening, qualified identity, Brownfield observed-vs-intended and provider substitution families.

Proof obligations refined:
5. order claims must bind source/partition/epoch/revision and explicitly state whether global comparison is valid;
6. cross-hop transformation must preserve or explicitly invalidate ordering/provenance claims;
7. process reconstruction from integration event order remains `InferredCandidate` until semantic owner approval.

Evidence:
- CloudEvents Sequence extension: https://github.com/cloudevents/spec/blob/main/cloudevents/extensions/sequence.md
- CloudEvents Partitioning extension: https://github.com/cloudevents/spec/blob/main/cloudevents/extensions/partitioning.md

### 2.3 Sequence/currentness memory itself has lifecycle

OPC UA PubSub provides a stronger temporal probe than simple 'event gap' analysis. Sequence numbers roll over and subscribers are instructed to discard remembered sequence records after sufficient receive-timeout absence so publishers/brokers can restart. Therefore a consumer cannot treat an old sequence baseline as eternal identity/currentness evidence.

Adversarial cases:
- provider/device restarts and reuses sequence space;
- subscriber forgets baseline while dashboard incorrectly claims continuous coverage;
- epoch reset is interpreted as replay/old data and valid new events are discarded;
- old buffered events arrive after baseline reset and are treated as current;
- provider substitution reuses an external source identifier but not its event epoch.

Preserve:

`monotonic sequence within qualified epoch != permanent source identity != complete observation`.

Result: no new material family. Duplicate-screen maps to currentness horizon, event-gap, qualified identity, provider revision, historical integrity and false convergence families.

Proof obligations refined:
8. event coverage must include source epoch/reset/restart semantics where the provider exposes them;
9. baseline loss/reinitialization must surface `UNKNOWN/PARTIAL` coverage rather than 'synchronized';
10. stale buffered events must be qualified by occurrence/source epoch and not merely receipt order.

Evidence: OPC UA Part 14 PubSub SequenceNumber semantics: https://reference.opcfoundation.org/specs/OPC-10000-14/7.2.3

### 2.4 Elicitation can falsely complete an integration contract

Integration questions are particularly vulnerable to false completeness because stakeholders often answer at the feature-label level: 'sync users', 'receive events', 'connect cameras', 'send invoices', 'integrate ERP'. Those answers do not establish operation semantics.

A capability-specific elicitation dossier remains incomplete when any HIGH/CRITICAL applicable dimension is unresolved, including:
- semantic owner and source of truth;
- target tenant/site/resource namespace;
- create/update/revoke/deprovision authority;
- operation atomicity and partial-effect semantics;
- timeout/`UNKNOWN` handling and retry/idempotency contract;
- ordering/duplication/gap semantics;
- pagination/export completeness;
- provider rate limits, backlog and sustainable reconciliation capacity;
- provider/API/profile revision currentness;
- offline behavior and residual sessions/caches;
- rollback/source-of-truth transition during coexistence;
- unsupported capability/scope reporting;
- privacy/retention/minimization for imported or mirrored data;
- human/operator responsibility during provider outage;
- evidence required to claim convergence.

Preserve:

`answered != understood != contract-qualified != externally converged`.

A '95% complete' scalar cannot override an unresolved critical dimension. `OutOfScope != NotApplicable`, `Deferred != Resolved`, and AI inference remains `InferredCandidate` until approved by the semantic/authority owner.

The strongest false-complete candidates duplicate-screen into existing false completeness, stakeholder/source coverage, assumption/evidence promotion, unresolved contradiction, cross-capability routing and AI authority/evidence amplification families. No new ConflictPattern is justified.

Fresh comparative research continues to support this caution. A 2026 systematic mapping study of automated requirements elicitation reports that automation is much stronger for requirement identification than for consolidation and engineered stakeholder validation; AI support therefore must not be treated as proof of agreement or operational sufficiency.

Evidence: Eltahier et al., *Automated Software Requirements Elicitation: A Systematic Mapping Study*, Information 17(8), 2026: https://www.mdpi.com/2078-2489/17/8/777

### 2.5 Queue stability and reconciliation debt are separate from connector health

A connector can be healthy while its reconciliation queue is unstable. Rate limits, provider outages, retries, partial pages, expensive per-resource reads, correlated bursts, and priority traffic can make arrival rate exceed sustainable service rate even when average utilization appears acceptable.

Adversarial cases:
- high-priority provisioning starves revoke reconciliation;
- retry storm increases backlog after provider recovery;
- tenant with large inventory monopolizes pagination slots;
- event ingestion remains green while divergence age grows without bound;
- operator dashboard shows 'connected' but effective permission state becomes progressively stale;
- delayed physical/access deprovision has materially different risk from delayed inventory refresh.

Result: no new material family. Duplicate-screen maps to queue/capacity instability, starvation/priority inversion, currentness, external-permission drift and false convergence families.

Proof obligations refined:
11. distinguish transport health, queue stability, divergence age and sustainable reconciliation capacity;
12. risk-sensitive work classes such as revoke/deprovision need explicit starvation/backlog evidence rather than aggregate throughput;
13. provider outage recovery proof must include drain/convergence behavior, not only reconnection.

### 2.6 Physical/Peripheral boundary: integration authority must not widen by composition

The bounded physical/peripheral boundary remains unchanged. VMS/camera, BMS/HVAC, access-control, PDV, industrial and device-management control planes remain provider-side by default. SB research here concerns `READ|QUERY|PROVISION|BROKER|EVENT`; `ACTUATE` remains an exceptional provider-specific/high-risk extension requiring explicit authority and proof.

New Pass-8 composition attacks:
- a generic automation chains `READ camera status -> provider-specific endpoint` and accidentally exposes PTZ/relay/door operation;
- UI labels two provider operations as 'sync' though one mutates a physical-access grant;
- provider adapter revision adds new privileged scopes without an elicitation/currentness invalidation;
- a stale offline controller retains access after canonical revoke while a dashboard claims synchronized state;
- AI maps 'operator' or 'admin' labels across vendors and broadens permission semantics;
- provider/site identifier reuse joins a new device/account to historical authority lineage.

Preserve:

`provider-reported permission != canonical authority != realized physical/media access`

and

`operation availability != operation authority`.

Result: no new material family. Duplicate-screen maps to provider semantic mismatch, qualified identity, authority non-amplification, residual-access/currentness, target isolation and AI/low-code amplification families.

Proof obligations refined:
14. adapter/profile revision must trigger semantic capability/currentness requalification where privileged scopes change;
15. target identity must remain provider+tenant+site+resource qualified across delete/recreate and substitution;
16. no generic integration composition may strengthen `READ|QUERY|PROVISION|BROKER|EVENT` into `ACTUATE` authority.

### 2.7 Formal assurance and proof composition

Integration proof remains claim-bounded. A signed/tamper-evident journal can prove integrity of recorded evidence; it cannot prove that the provider actually converged, that no event was lost outside the evidence horizon, or that a provider permission semantically equals canonical authority.

A future `WorkflowCompletionCertificate` / `ProcessProofBundle` involving integrations must therefore bind at minimum:
- operation kind and authority envelope;
- provider/tenant/site/resource identity;
- adapter/profile/API revision;
- attempt identity versus business-effect identity;
- per-operation effect disposition;
- source/partition/epoch/order scope for event evidence;
- unresolved `UNKNOWN/PARTIAL`;
- reconciliation/currentness horizon;
- residual provider/user/session/cache cohort disposition;
- relevant child/federated responsibility evidence.

Preserve:

`journal integrity != evidence completeness != semantic equivalence != external convergence != PROVEN_COMPLETED`.

Graph transformation/revision must invalidate or requalify prior proofs whenever provider operation meaning, target namespace, ordering guarantees, authority or source-of-truth semantics materially change. Offline verification must downgrade absent currentness evidence to `UNKNOWN/INCONCLUSIVE`, never strengthen it.

## 3. Conflict classification and duplicate-screen disposition

The revisit searched structural, state-transition, semantic ownership, rule/condition, temporal, resource/capacity, authority, policy, data, integration/provider, version/coexistence, recovery, human-procedure, cross-process, objective and AI/low-code conflict families.

Candidate classes screened include the previously active physical candidates plus elicitation-specific candidates: `EXTERNAL_PERMISSION_DRIFT`, `PARTIAL_DEPROVISION`, `CROSS_SITE_ACCESS_LEAK`, `EXTERNAL_IDENTITY_MISMATCH`, `PROVIDER_SCOPE_SEMANTIC_MISMATCH`, `STALE_EXTERNAL_ACCESS_STATE`, `UNSUPPORTED_RESOURCE_SILENT_DROP`, `FALSE_ELICITATION_COMPLETENESS`, `STAKEHOLDER_COVERAGE_GAP`, `ASSUMPTION_PROMOTED_TO_FACT`, `UNRESOLVED_CONTRADICTION_HIDDEN`, `HAPPY_PATH_ONLY_SPECIFICATION`, `ELICITATION_PROVENANCE_BREAK`, `CROSS_CAPABILITY_QUESTION_ROUTING_GAP`, and `AI_INFERENCE_PROMOTED_TO_REQUIREMENT`.

All duplicate-screen to existing reusable ConflictPatterns. No new ID is created. No `ConflictInstance` is asserted. A detector result, divergence metric, missing sequence or stale mapping remains a `Signal` until sufficient evidence confirms activation in a concrete context.

Material result:
- new local material edge scenarios: **0**;
- new cross-capability scenario IDs: **0**;
- new reusable ConflictPatterns: **0**;
- new ConflictInstances: **0**;
- new preventive invariant candidates: **0**;
- material inventory remains **284 edges + 124 ConflictPatterns = 408**;
- HIGH/CRITICAL without owner/proof/detection route: **0**.

## 4. Planning C/D/E and Architecture Reconciliation carry-forward

Carry the following proof obligations/detection candidates forward without materializing architecture now:

1. **Operation-scope/effect proof** — batch/envelope success cannot hide per-operation partial/unknown effects or different atomicity scopes.
2. **Reconcile-before-retry proof** — mutating `UNKNOWN` or partial batches require effect-aware reconciliation before unsafe replay.
3. **Ordering-scope proof** — sequence/order claims bind source, partition, epoch and revision; no unqualified global/causal promotion.
4. **Cross-hop provenance proof** — transformations that change/remove partition/order/source metadata invalidate corresponding downstream claims.
5. **Currentness-reset proof** — provider/device restart, sequence reset or baseline loss must not present false continuous coverage.
6. **Integration elicitation gate** — critical dimensions must be visible as `UNTOUCHED|PARTIAL|RESOLVED|CONFLICTED|BLOCKED|DEFERRED|NA`; aggregate completion cannot bypass unresolved HIGH/CRITICAL gaps.
7. **Stakeholder/owner coverage proof** — canonical owner, provider/operator, security/privacy and affected operational owners are represented where applicable.
8. **Cross-artifact consistency proof** — integration story/use case/workflow/permissions/data/acceptance cannot carry incompatible claims silently.
9. **Queue stability proof** — transport health is separate from sustainable reconciliation capacity, divergence age, starvation and backlog risk.
10. **Risk-class prioritization evidence** — revoke/deprovision convergence cannot be hidden by aggregate connector throughput.
11. **Provider/site target isolation proof** — identity and authority bind provider+tenant+site+resource and survive delete/recreate/substitution without false joins.
12. **Unsupported-scope proof** — unsupported roles/resources/features are explicit; no silent drop or semantic broadening.
13. **Physical non-actuation boundary proof** — generic integration composition cannot acquire physical/control-loop authority from read/provision/broker/event capabilities.
14. **Residual-access proof** — sessions, grants, offline caches/controllers and old-provider cohorts are dispositioned before convergence is claimed.
15. **Historical non-rewrite proof** — current projection/provider mapping cannot rewrite producing historical evidence or source/epoch semantics.
16. **Proof-bundle non-strengthening** — signature/journal/provider acknowledgement integrity cannot manufacture semantic/current external completion.
17. **AI/low-code non-strengthening** — inferred mapping, ordering, equivalence or authority remains candidate evidence until qualified owner approval.
18. **Planning E adversarials** — include partial SCIM-style bulk effects, stale/forgotten event sequence baseline, provider restart/source reuse, cross-hop order metadata loss, unstable reconciliation queue, revoke starvation, stale offline access, wrong-site mapping, provider-scope widening and false elicitation completeness.

## 5. Saturation disposition

Result: **ELIGIBLE NO-NEW-MATERIAL REVISIT**.

Integration & Automation local no-material streak remains **2 / capped**. All 12 mandatory cluster streaks remain **2 / capped**. Full Pass 8 advances from **14/28 to 15/28 capabilities**. The minimum-pass gate is still unmet because Full Pass 8 is not yet a full pass. Negative-space remains `NOT_STARTED`; saturation remains `NOT_SATURATED`; Planning C remains blocked.

Next rotation: **Identity / Authentication / Federation**. Carry all standing lenses plus Elicitation/System Understanding and the bounded Physical/Peripheral integration scope into external account/credential identity, federation namespace/site qualification, external-ID reuse, enrollment/deprovision, stale sessions/tokens, provider substitution, offline identity/currentness, biometric identity references, source-of-truth/provenance, `PARTIAL/UNKNOWN`, cross-artifact contradictions and AI evidence/authority strengthening. Do not enter Planning C.