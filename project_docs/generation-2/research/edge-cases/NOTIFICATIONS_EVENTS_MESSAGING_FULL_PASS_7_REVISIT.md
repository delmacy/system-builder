# Generation 2 — Notifications / Events / Messaging Full Pass 7 Revisit

Status: ELIGIBLE NO-NEW-MATERIAL REVISIT
Phase: `RESEARCH_ADVERSARIAL_EDGE_CASE_SATURATION`
Full pass: 7
Disposition: `CATALOGUE + CLASSIFY + DETECTION_CANDIDATE + FUTURE_REMEDIATION_ROUTE`

## Authority and scope

This revisit follows `RESEARCH_PIPELINE_STATE.json`, `POST_MATH_ADVERSARIAL_EDGE_CASE_SATURATION_RESEARCH.md`, `edge-cases/PROCESSUAL_SEMANTIC_CONFLICT_CLASSIFICATION.md`, the standing semantic-graph/federation/soundness research, Legacy Mirroring, bounded Physical/Peripheral integration-plane research, Operability Elicitation, and the Elicitation & System Understanding methodology and sub-artifacts.

Research only. Preserve `Research != remediation`, `ConflictPattern != ConflictInstance`, `Signal != ConfirmedConflict`. No product work, Work Package, executive TASK, Construction, or Planning C materialization is authorized.

## Pass-7 attack rotation

All 124 reusable ConflictPatterns were duplicate-screened against a messaging-specific composition that deliberately combines:

- `EventOccurrence != PublishAttempt != ProviderDelivery != ConsumerInvocation != BusinessEffect`;
- event time, publish time, delivery time, processing time, settlement time and external-effect time;
- duplicate publication, broker redelivery, application replay/redrive, out-of-order arrival and delayed/offline consumers;
- recipient, purpose, tenant/site, authority and policy validity at the occurrence and effect slices;
- schema/provider/consumer revision skew and queued occurrences crossing graph revision N→N+1;
- delivery and consumer backlog stability, headroom, priority/fairness and fan-out amplification;
- external mutations with `APPLIED / NOT_APPLIED / PARTIAL / UNKNOWN`, requiring reconciliation before unsafe retry when idempotency is not qualified;
- federated producer/consumer responsibility without shared mutable state;
- provenance/correlation versus causal/effect proof;
- privacy-safe payload/evidence minimization versus forensic sufficiency;
- Legacy Mirroring events whose observed sequence is evidence, not automatically canonical process;
- bounded Physical/Peripheral event ingestion where provider-reported device/access state is not physical truth;
- Autonomous Build/Fleet projections that must not strengthen delivery/effect evidence;
- elicitation completeness attacks: happy-path-only requirements, missing consumer/operations stakeholders, missing currentness/evidence, N/A abuse, missing escalation owner and generated artifacts without traceable source.

## Evidence refresh

OpenTelemetry messaging semantic conventions explicitly distinguish message `create`, `send`, `receive`, `process` and `settle`; they also distinguish physical intermediaries from logical destinations and allow one message to reach zero, one or multiple consumers. Conversation/correlation identifiers connect related messages but are not business-effect identifiers. This supports preserving distinct typed identities rather than treating one broker/message ID as proof of one canonical effect.

Apache Kafka documentation continues to distinguish publication durability from consumption guarantees. Its exactly-once semantics are qualified to coordinated Kafka topics/state stores; writes to arbitrary external systems require cooperation with the destination or another coordination/idempotency mechanism. Therefore `broker/stream exactly-once != arbitrary external business effect exactly-once`.

AsyncAPI 3.1 defines message payload/header schemas and an optional `correlationId` for tracing/matching. A valid correlation contract improves handoff observability but does not prove authorization, causal ownership, successful processing or external effect.

No evidence justifies a new reusable conflict family beyond the existing 124 patterns.

## Typed Semantic Graph / Execution Model

The useful candidate graph remains typed and occurrence-aware. `EventDefinition`, `EventOccurrence`, `PublishAttempt`, `ProviderDelivery`, `ConsumerInvocation`, `Decision/CalculationResult`, `BusinessEffect` and `Evidence` should not collapse into one node kind. A correlation edge is a relation, not authority or causal proof.

A queued event may be emitted under workflow/schema/policy/provider revision N and consumed when N+1 is current. Its envelope therefore needs pinned semantic references or an explicit migration/reinterpretation disposition. `ExecutionEnvelope`, `ExecutionState`, `ExecutionJournal`, provider state and business truth remain separate.

PostgreSQL relational graph/event/journal tables remain a plausible baseline. Nothing in this revisit requires GraphDB. Canvas and Fleet remain projections, not semantic authorities.

## Temporal, provenance, decision, units and uncertainty

Temporal currentness is multi-dimensional: event occurrence, provider delivery, consumer processing and effect evidence can have different valid/effective periods. Applying current policy retroactively to an old occurrence, or applying an old purpose/recipient grant to a new effect, is a detection candidate covered by existing temporal/currentness patterns.

Lineage should capture actual producer/activity/output and transformation relations. Trace adjacency, correlation ID and temporal proximity are signals, not causal proof. Cross-system provenance handoff does not transfer authority.

Transport must preserve semantic kind and dimensional meaning. `DETERMINISTIC_DERIVATION`, `STATISTICAL_ESTIMATE`, `OPTIMIZATION_RESULT`, `AI_INFERENCE` and `HUMAN_DECISION` are not interchangeable. SCALAR/VECTOR/INTERVAL/DISTRIBUTION/TIME_SERIES values require units, assumptions, precision and uncertainty where applicable. Silent scalarization or unit loss is semantic change, already covered by existing analytical-kind/unit/schema patterns.

## Control flow, soundness and completion proof

Message-driven waits, fan-out/fan-in, timers, retries and compensations do not acquire stronger completion semantics from successful settlement. Definition soundness, bounded termination, observed-trace conformance, journal integrity and external-effect evidence remain separate proof domains.

A future `WorkflowCompletionCertificate` / `ProcessProofBundle` cannot infer `PROVEN_COMPLETED` from message settlement alone. Required child/join completion, effect evidence and unresolved `UNKNOWN` dispositions remain explicit proof obligations.

## Legacy Mirroring and Physical/Peripheral integration

Mirrored email/event/log sequences are observations. They may suggest candidate workflows, handoffs and exceptions but must not be promoted automatically to intended or approved canonical process.

For cameras/VMS/access/BMS/PDV and similar providers, event ingestion is intentionally integration-plane bounded. `provider event received != physical event proved`; stale/gapped provider telemetry, deleted resources, residual grants, offline edge buffers and cross-site identity ambiguity require currentness/provenance/reconciliation. Deep physical actuation remains a non-goal/provider-specific exceptional boundary requiring a separate later architecture decision and safety/authority proof obligations.

## Elicitation & System Understanding lens

Messaging exposed a recurring elicitation sufficiency risk: a requirement such as “notify on X” is not resolved until material dimensions are qualified where applicable — audience/recipient authority, purpose, trigger semantics, event identity, ordering assumptions, duplicates, delivery versus effect expectation, timeout/UNKNOWN behavior, retry/idempotency, offline behavior, escalation/operations owner, privacy/minimization, retention, observability and acceptance evidence.

The Elicitation Knowledge Base remains a cross-cutting research hypothesis, not a 29th capability. Adaptive questioning should route these gaps to capability-specific lenses and preserve `QuestionDefinition != QuestionOccurrence != Answer != Finding != Decision`. Generated user stories/use cases/scenarios remain derived artifacts requiring traceable source/evidence and must not silently convert AI inference into authority.

Candidate critical-gap detections for messaging include: external effect without reconciliation semantics; recipient/tenant authority unresolved; consumer without operational owner; delivery guarantee asserted without provider scope; sensitive payload without privacy policy; event metric without unit/currentness; and failure/recovery omitted from a supposedly implementation-ready use case. These are detection candidates, not confirmed conflicts.

## Conflict duplicate-screen and disposition

Structural graph, state-transition, semantic ownership, rule/condition, temporal/ordering, resource/capacity, authority/responsibility, privacy/compliance, data consistency, provider/integration, version/coexistence, exception/recovery, human-procedure, cross-process, objective/optimization and AI/low-code composition families were screened.

No candidate survives duplicate-screen as a 125th reusable ConflictPattern. No signal is promoted to ConflictInstance. No remediation or preventive invariant is created.

## Saturation disposition

- New local edge scenarios: **0**.
- New cross-capability scenarios: **0**.
- New reusable ConflictPatterns: **0**.
- New ConflictInstances: **0**.
- New preventive invariant candidates: **0**.
- HIGH/CRITICAL finding lacking owner/proof/detection route: **0**.
- Notifications / Events / Messaging no-material streak: **preserve at 2** (already capped).
- Mandatory cluster streaks: **unchanged at 2**.
- Full Pass 7 capability coverage after this revisit: **22/28**.
- Full Pass 7 mandatory cluster coverage: **12/12**.
- Completed full passes: **6/8 minimum**.
- Material inventory: **284 edge scenarios + 124 ConflictPatterns = 408**.
- Saturation: `NOT_SATURATED`.
- Negative-space: `NOT_STARTED`.
- Planning C: blocked.

## Planning C/D/E and Architecture Reconciliation carry-forward

Carry forward without canonical promotion: typed event/delivery/invocation/effect identities; revision-pinned event envelopes; temporal validity/currentness; provenance-strength distinctions; explicit delivery-guarantee scopes; federated responsibility; queue/headroom analysis; semantic-kind/unit/uncertainty preservation; effect reconciliation; completion-proof evidence separation; Legacy Mirroring observed-vs-approved semantics; bounded Physical/Peripheral read/event semantics; and EKB-driven adaptive messaging elicitation with contradiction/currentness/traceability and critical-gap detection.

Planning E product-proof candidates include duplicate/replay/redrive, out-of-order and delayed delivery, `UNKNOWN` external effect with reconcile-before-retry, schema/revision skew, offline consumer catch-up, recipient/tenant isolation, privacy-safe evidence, provider substitution/residual queues, generated-artifact traceability, and refusal to mark elicitation complete when critical messaging semantics remain unresolved.

## Exact next action

Continue only `RESEARCH_ADVERSARIAL_EDGE_CASE_SATURATION`, Full Pass 7, with **Observability / Operations / Incident**. Carry all standing semantic/modeling, Legacy Mirroring, bounded Physical/Peripheral integration-plane, Operability Elicitation and Elicitation & System Understanding lenses. Challenge telemetry/incident identity, event/observation/processing time, missing/duplicate/delayed evidence, sampling/cardinality/truncation, absence-of-evidence, health/readiness/alert ACK versus runtime/business truth, SLO/baseline/threshold revision skew, incident/remediation queues and headroom, provider substitution, `PARTIAL/UNKNOWN`, offline horizons, privacy/trust leakage, false recovery, federated responsibility, proof-evidence currentness, human incident procedures and AI/low-code suppression/action loops. Falsify elicitation sufficiency through missing operational stakeholders/owners, happy-path-only observability requirements, unsupported N/A, stale evidence, metrics without unit/currentness, generated scenarios without source and publish-readiness claimed despite unresolved recovery/escalation gaps. Duplicate-screen all 124 patterns. Observability streak is already capped at 2; do not inflate absent material novelty. Do not enter Planning C.