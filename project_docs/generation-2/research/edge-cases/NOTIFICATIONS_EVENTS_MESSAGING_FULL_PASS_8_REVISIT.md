# Generation 2 — Notifications / Events / Messaging Full Pass 8 Revisit

Status: ELIGIBLE NO-NEW-MATERIAL REVISIT
Phase: `RESEARCH_ADVERSARIAL_EDGE_CASE_SATURATION`
Full pass: 8
Disposition: `CATALOGUE + CLASSIFY + DETECTION_CANDIDATE + FUTURE_REMEDIATION_ROUTE`

## Authority and scope

This revisit follows `RESEARCH_PIPELINE_STATE.json`, `POST_MATH_ADVERSARIAL_EDGE_CASE_SATURATION_RESEARCH.md`, `edge-cases/PROCESSUAL_SEMANTIC_CONFLICT_CLASSIFICATION.md`, all standing semantic/modeling fronts, Legacy Mirroring/Brownfield Assimilation, bounded Physical/Peripheral integration-plane research, Operability Elicitation, and Elicitation & System Understanding.

Research only. Preserve `Research != remediation`, `ConflictPattern != ConflictInstance`, `Signal != ConfirmedConflict`. No product work, Work Package, executive TASK, Construction, or Planning C materialization is authorized.

## Pass-8 attack rotation

All 124 reusable ConflictPatterns were duplicate-screened using materially different messaging probes:

- identity fracture across `EventOccurrence`, `PublishAttempt`, `ProviderDelivery`, `ConsumerInvocation`, `Settlement`, `BusinessEffect` and `Evidence`;
- event-time versus publish/delivery/process/observation/effect time, including delayed and offline consumers;
- duplicate/replay/redrive/out-of-order permutations with recipient, purpose, tenant/site and authority changes between occurrence and effect;
- ACK/settlement subtraction: broker acknowledgement, consumer settlement and external/canonical/business effect are separately qualified;
- schema/provider/consumer revision skew and queued events crossing graph revision N→N+1;
- provider substitution with residual queues/subscriptions and old-provider callbacks arriving after cutover;
- queue stability/headroom/backpressure, fan-out amplification, priority starvation and valid-but-pathological event storms;
- external mutation `APPLIED / NOT_APPLIED / PARTIAL / UNKNOWN`, with reconcile-before-retry when operation-specific idempotency is not proven;
- federated responsibility without shared mutable state, including correlation, auth, SLA, ownership and failure responsibility;
- privacy-safe payload/evidence subtraction and the risk that minimization destroys a later proof claim;
- Brownfield/Mirroring event reconstruction where observed email/log/event order remains evidence/candidate rather than approved process;
- bounded Physical/Peripheral ingestion where provider-reported access/device state is not physical truth and event ingestion does not imply actuation authority;
- Elicitation/System Understanding and Production Readiness false-completeness: missing consumer/operations stakeholders, unsupported `NOT_APPLICABLE`, missing recovery/escalation semantics, stale evidence and generated scenarios without source lineage;
- AI/low-code feedback loops where generated routing/retry logic strengthens authority or creates amplification without semantic-owner approval.

## Evidence refresh

OpenTelemetry messaging semantic conventions distinguish `create`, `send`, `receive`, `process` and `settle`, distinguish physical intermediary from logical destination, and allow a message to reach zero, one or multiple consumers. They also model message ID and conversation/correlation ID separately. This supports typed identities and rejects `message/correlation identity == business-effect identity`.

Apache Kafka documents at-most-once, at-least-once and exactly-once scopes separately. Kafka Streams exactly-once coordinates Kafka input offsets, state stores and Kafka outputs; exactly-once effects in arbitrary external destination systems require cooperation with those systems. Therefore `broker/stream exactly-once != arbitrary external business-effect exactly-once`.

OpenTelemetry's provider-specific conventions expose delivery-attempt information for systems such as Azure Service Bus and ordering keys for systems such as Google Pub/Sub. These are useful evidence dimensions but do not prove canonical ordering, authorization, physical truth or effect convergence.

No refreshed evidence justifies a new reusable conflict family beyond the existing 124 patterns.

## Typed Semantic Graph / Execution Model

Keep `EventDefinition`, `EventOccurrence`, `PublishAttempt`, `ProviderDelivery`, `ConsumerInvocation`, `Settlement`, `BusinessEffect` and `Evidence` as distinguishable semantic kinds. Correlation is a relation, not authority or causal proof. Queued events require pinned semantic references or an explicit migration/reinterpretation disposition when consumed under later revisions.

`ExecutionEnvelope`, `ExecutionState`, `ExecutionJournal`, provider state and business truth remain separate. PostgreSQL relational graph/event/journal storage remains a plausible baseline; nothing here requires GraphDB. Canvas/Fleet are projections.

## Temporal, analytical, provenance and uncertainty semantics

Occurrence, observation, delivery, processing and effect evidence can each have distinct timestamps/effective periods. Historical events must not be silently reinterpreted with current formulas, policies, units, schemas or permissions. `StoredFact != DerivedValue`; deterministic derivation, statistical estimate, optimization result, AI inference and human decision remain distinct.

Transport and event schemas must preserve SCALAR/VECTOR/MATRIX/TENSOR/INTERVAL/DISTRIBUTION/TIME_SERIES meaning, units, normalization, precision, provenance and uncertainty where applicable. Correlation, trace adjacency and temporal proximity remain signals rather than causal proof.

## Control flow, soundness and completion proof

Message-driven waits, timers, fan-out/fan-in, bounded loops, retries, cancellation and compensation remain subject to explicit termination/resource bounds. Successful delivery or settlement cannot by itself satisfy workflow completion. Definition soundness, termination, conformance, journal integrity and external-effect evidence remain separate proof domains.

A future `WorkflowCompletionCertificate` / `ProcessProofBundle` remains a hypothesis and must not strengthen delivery evidence into business-effect proof.

## Legacy Mirroring / Brownfield

Email chains, event logs, spreadsheets and provider histories can reconstruct candidate event/process relationships, but `observed behavior != intended procedure != approved canonical process`. Late, missing, duplicated and transformed historical events require provenance and temporal qualification. Imported historical events must not be recomputed under current rules without explicit revision semantics.

## Physical / Peripheral integration-plane boundary

Camera/VMS, access-control, BMS/HVAC, PDV and similar provider events remain integration-plane inputs. `provider event received != physical event proved`; currentness, topology/resource identity, tenant/site scope, permission state and provenance are required. Read/query/event/provision/broker semantics do not imply physical actuation. Any later actuation capability requires a separate Planning C decision and safety/authority proof obligations.

## Elicitation & System Understanding lens

A requirement such as “notify when X” is not sufficiently resolved merely because a trigger and recipient were named. Adaptive elicitation should qualify, where applicable: purpose, audience authority, event identity, source-of-truth, ordering assumptions, duplicate/replay behavior, delivery versus effect expectation, timeout/`UNKNOWN`, retry/idempotency, offline behavior, privacy/retention, operations/escalation owner, provider scope, observability and acceptance evidence.

Preserve `Fact`, `Claim`, `Assumption`, `InferredCandidate`, `Decision`, `Requirement`, `Constraint`, `OpenQuestion`, `Conflict`, `Unknown`, `OutOfScope` and `Deferred`. `QuestionDefinition != QuestionOccurrence != Answer != Finding != Decision`. Generated stories/use cases/scenarios remain derived artifacts requiring traceable source/evidence.

Candidate critical-gap detections include external effect without reconciliation semantics; recipient/tenant/site authority unresolved; consumer without operational owner; asserted delivery guarantee without provider-qualified scope; sensitive payload without policy; event metric without unit/currentness; and implementation/publish readiness claimed while failure/recovery remains unresolved. These are detection candidates, not confirmed conflicts.

## Conflict duplicate-screen and disposition

Structural graph, state-transition, semantic ownership, rule/condition, temporal/ordering, resource/capacity, authority/responsibility, policy/compliance, data consistency, integration/provider, version/coexistence, exception/recovery, human-procedure, cross-process, objective/optimization and AI/low-code composition families were screened.

No candidate survives duplicate-screen as a 125th reusable `ConflictPattern`. No signal is promoted to `ConflictInstance`. No remediation or preventive invariant is created.

## Saturation disposition

- New local edge scenarios: **0**.
- New cross-capability scenarios: **0**.
- New reusable ConflictPatterns: **0**.
- New ConflictInstances: **0**.
- New preventive invariant candidates: **0**.
- HIGH/CRITICAL finding lacking owner/proof/detection route: **0**.
- Notifications / Events / Messaging no-material streak: **preserve at 2** (already capped).
- Mandatory cluster streaks: **unchanged at 2**.
- Full Pass 8 capability coverage after this revisit: **22/28**.
- Full Pass 8 mandatory cluster coverage: **12/12**.
- Completed full passes: **7/8 minimum**.
- Material inventory: **284 edge scenarios + 124 ConflictPatterns = 408**.
- Saturation: `NOT_SATURATED`.
- Negative-space: `NOT_STARTED`.
- Planning C: blocked.

## Planning C/D/E and Architecture Reconciliation carry-forward

Carry forward without canonical promotion: typed event/delivery/invocation/settlement/effect identities; revision-pinned event envelopes; temporal validity/currentness; provenance-strength distinctions; qualified delivery scopes; federated responsibility; queue/headroom analysis; semantic-kind/unit/uncertainty preservation; effect reconciliation; completion-proof evidence separation; Brownfield observed-vs-approved semantics; bounded Physical/Peripheral read/event semantics; and EKB-driven adaptive messaging elicitation with contradiction/currentness/traceability and critical-gap detection.

Planning E proof candidates remain duplicate/replay/redrive, out-of-order/delayed delivery, `UNKNOWN` external effect with reconcile-before-retry, schema/revision skew, offline catch-up, recipient/tenant/site isolation, privacy-safe evidence, provider substitution/residual queues, generated-artifact traceability and refusal to mark elicitation complete while critical messaging semantics remain unresolved.

## Exact next action

Continue only `RESEARCH_ADVERSARIAL_EDGE_CASE_SATURATION`, Full Pass 8, with **Observability / Operations / Incident**. Carry all standing semantic/modeling, Legacy Mirroring, bounded Physical/Peripheral integration-plane, Operability Elicitation and Elicitation & System Understanding lenses. Challenge telemetry/incident identity, occurrence/observation/processing time, missing/duplicate/delayed evidence, sampling/cardinality/truncation, absence-of-evidence, health/readiness/alert ACK versus runtime/business truth, SLO/baseline/threshold revision skew, incident/remediation queues and headroom, provider substitution, `PARTIAL/UNKNOWN`, offline horizons, privacy/trust leakage, false recovery, federated responsibility, proof-evidence currentness, human incident procedures and AI/low-code suppression/action loops. Falsify elicitation sufficiency through missing operational stakeholders/owners, happy-path-only observability requirements, unsupported N/A, stale evidence, metrics without unit/currentness, generated scenarios without source and publish-readiness claimed despite unresolved recovery/escalation gaps. Duplicate-screen all 124 patterns. Observability streak is already capped at 2; do not inflate absent material novelty. Do not enter Planning C.