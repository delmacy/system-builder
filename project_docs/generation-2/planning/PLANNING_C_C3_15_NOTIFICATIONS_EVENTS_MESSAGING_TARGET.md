# Generation 2 — Planning C — C3.15 Notifications / Events / Messaging Target Architecture

Status: **DECIDED / PASS_FOR_CAPABILITY / TARGET_ARCHITECTURE_DECIDED**
Phase: `PLANNING_C_TARGET_ARCHITECTURE`
Capability: **Notifications / Events / Messaging**
Decision: `C3.15`
Scope: target-architecture planning only. No product implementation, Work Package, executive TASK, Construction or remediation is authorized by this record.

## 1. Decision authority and inherited constraints

This decision is governed by:

- `RESEARCH_PIPELINE_STATE.json` as phase/current-focus/next-action authority;
- `PLANNING_C_TARGET_ARCHITECTURE_ENTRY_FRAMEWORK.md`;
- C0 Universal Capability Architecture / Semantic Substrate;
- C1 Elicitation & System Understanding Architecture;
- C2 Physical / Peripheral Integration Boundary;
- `PLANNING_A_NOTIFICATIONS_EVENTS_MESSAGING_BOUNDARIES.md`;
- `PLANNING_B_NOTIFICATIONS_EVENTS_MESSAGING_SB_CURRENT_STATE.md`;
- C3.5 Workflow / Durable Execution;
- C3.6 Integration / Automation;
- C3.8 Authorization / Policy / Organization / Multitenancy;
- C3.9 Governance / Compliance / Audit;
- C3.10 Security / Resilience / Failure / Recovery;
- C3.12 Privacy / Data Governance / Retention / Legal Hold / Residency;
- C3.13 Data / Schema / Migrations;
- C3.14 Storage / Documents / Media;
- the closed adversarial inventory of **284 material edge scenarios + 124 ConflictPatterns = 408 material findings**.

Constitutional distinctions:

- `event occurrence != message instance != notification intent != delivery attempt != consumer effect`;
- `message delivered != consumer effect`;
- `acknowledgement != business completion`;
- `source-local sequence != global order != causality`;
- `duplicate delivery != duplicate semantic effect`;
- `replay != new occurrence`;
- `provider/broker feature parity != semantic equivalence`;
- `provider acceptance != durable delivery != recipient receipt != read != consumer-effective processing`;
- `subscription existence != authority`;
- `Fleet aggregate != local queue/provider truth`;
- `AI inference != routing/notification authority`;
- `Research != remediation`, `ConflictPattern != ConflictInstance`, and `Signal != ConfirmedConflict`.

## 2. Problem

Fresh-main archaeology found useful predecessors: provider-independent notification intent in planning material and a bounded Observe publication callback with explicit local outcomes. It did not evidence a canonical enterprise owner for event/message/notification identity, durable subscriptions, transport-independent attempt lineage, ordering scope, replay, dead-letter handling, reconciliation, provider migration or consumer-effective proof.

Generation 2 therefore requires a portable semantic owner that preserves communication identity separately from transport identity; distinguishes occurrence, publication, delivery and effect; supports both event streams and recipient-oriented notifications without forcing one broker model; keeps ordering, replay and exactly-once claims applicability-scoped; handles ambiguous external effects explicitly; and exposes operability/capacity/currentness as production semantics rather than hidden provider concerns.

## 3. Target decision

**DECISION C3.15-D1 — establish a provider-neutral, revision-qualified Communication Semantic Plane with separately owned Event, Message, Notification, Subscription, Delivery and Consumer-Effect evidence models; providerize broker/channel mechanics behind qualified support contracts.**

The capability owns six linked truth planes:

1. **Occurrence Plane** — semantic event occurrence identity, source, subject, type, occurrence time and provenance.
2. **Communication Intent Plane** — message/notification intent, recipient/consumer targeting, payload/schema reference and required delivery semantics.
3. **Subscription & Routing Plane** — subscription identity/revision, filters, routing policies, recipient-resolution rules and effective cohorts.
4. **Delivery & Attempt Plane** — publication/delivery attempts, provider receipts, acknowledgements, redelivery, dead-letter/quarantine and delivery dispositions.
5. **Replay & Reconciliation Plane** — replay/redrive lineage, cursor/checkpoint identity, dedupe/idempotency horizon, ambiguous-effect reconciliation and residual cohorts.
6. **Evidence & Operability Plane** — currentness, backlog/capacity, failure/recovery evidence, ownership/on-call, privacy/security qualification and post-change validation.

No queue/topic name, broker offset, webhook ID, push receipt, provider notification ID or transport sequence becomes canonical communication identity merely because it is stable.

## 4. Owned semantic identities

The target owns or qualifies identities including:

- `EventOccurrenceId`;
- `MessageId`;
- `NotificationIntentId`;
- `SubscriptionId`;
- `SubscriptionRevisionId`;
- `RoutingRevisionId`;
- `RecipientCohortId` / `ConsumerCohortId`;
- `DeliveryAttemptId`;
- `ProviderDeliveryIdentity` as realization identity;
- `AcknowledgementId` where the transport exposes one;
- `ReplayOperationId`;
- `DeadLetterOrQuarantineItemId`;
- `CursorOrCheckpointId`;
- `ResidualCommunicationCohortId`;
- `ConsumerEffectClaimId` where explicit downstream-effect evidence is required.

`EventOccurrenceId` is not reused for a replayed delivery. Replaying an occurrence produces new delivery attempts linked to the original occurrence/message lineage; it does not silently create a second business occurrence.

## 5. Event occurrence versus business/domain truth

An event records a qualified occurrence or observation claim; it does not become canonical owner of the business state it describes.

Required lineage can include:

`domain fact/change or observed condition -> event occurrence -> message/notification intent -> publication attempt -> provider acceptance -> delivery attempt -> recipient/consumer acknowledgement -> consumer-effect evidence`.

Each arrow is conditional and evidence-bearing. Absence of a later checkpoint cannot be inferred from an earlier one.

A domain capability remains source of truth for its state. Notifications / Events / Messaging owns communication facts and evidence about propagation, not the authoritative business entity merely because a payload contains a copy of it.

## 6. Payload, schema, provenance and currentness

A communication envelope references a qualified payload/schema revision rather than treating transport serialization as canonical schema truth.

Portable semantic metadata includes, as applicable:

- event/message/notification identity;
- source and subject identity;
- semantic type;
- payload or storage-object reference;
- schema/contract revision;
- producer capability/revision;
- transaction/occurrence time;
- observation/publication time;
- tenant/site/locality scope;
- provenance/evidence references;
- privacy/classification references;
- correlation/causation references without promoting correlation into causal proof;
- trace/operation linkage as observational context, not semantic identity.

Payload copies may be stale even when the message is newly delivered. Consumers that need current domain state must re-resolve from the authoritative owner or explicitly accept snapshot semantics.

## 7. Ordering and graph semantics

**DECISION C3.15-D2 — ordering is always scope-qualified; no global order is inferred.**

Ordering claims identify the ordering domain, such as:

- producer-local sequence;
- source aggregate/entity key;
- partition;
- message group;
- recipient session;
- workflow correlation;
- provider-specific ordering domain.

A partial order may be represented as graph edges where the semantics actually justify `happened-before`, `derived-from`, `caused-publication-of`, `supersedes` or other typed relation. Numeric sequence proximity does not prove causality.

Partition/epoch changes, producer restarts, rebalances, failover and provider migration can split ordering domains. The architecture must preserve the epoch/revision that makes a sequence claim meaningful.

## 8. Delivery guarantees, deduplication and exactly-once claims

Delivery modes such as `at-most-once`, `at-least-once` and provider-defined `exactly-once` are **qualified support claims**, never universal labels.

A strong delivery claim records at least:

- provider/broker and feature revision;
- producer operation scope;
- subscription/consumer cohort;
- region/site/locality scope where relevant;
- deduplication/idempotency mechanism;
- dedupe horizon/window;
- acknowledgement contract;
- downstream effect boundary;
- currentness/evidence horizon.

Provider documentation reinforces this portability rule: Amazon SQS standard queues remain at-least-once and advise idempotent consumers; SQS FIFO deduplication is scoped to a finite deduplication interval; Google Cloud Pub/Sub exactly-once delivery is region-qualified; Kafka exactly-once processing depends on an explicitly bounded transactional topology. Therefore:

`provider exactly-once delivery/processing claim != exactly-once arbitrary external business effect`.

Deduplication suppresses a qualified duplicate within a declared identity/horizon. It must not collapse legitimately distinct occurrences that happen to share payload bytes or business fields.

## 9. Publication and delivery effect dispositions

External mutations use C0 effect dispositions:

- `APPLIED`;
- `NOT_APPLIED`;
- `PARTIAL`;
- `UNKNOWN`.

Representative checkpoints:

`intent admitted -> publication attempted -> provider accepted or acceptance UNKNOWN -> queued/routed -> delivery attempted -> delivery receipt/ack observed -> consumer processing claimed -> semantic downstream effect independently evidenced`.

`UNKNOWN -> reconcile-before-retry` unless exact operation identity, provider contract and idempotency horizon make retry safe.

This rule applies to publication, subscription create/update/delete, acknowledgement, replay/redrive, dead-letter movement and provider cutover mutations.

## 10. Acknowledgement and consumer-effect semantics

**DECISION C3.15-D3 — acknowledgement contracts are typed; an acknowledgement proves only what its contract explicitly defines.**

Possible acknowledgement kinds include:

- transport receive acknowledgement;
- provider delivery receipt;
- durable consumer ingress acknowledgement;
- consumer processing acknowledgement;
- human read/open acknowledgement;
- business-effect acknowledgement supplied by an owning downstream capability.

The architecture does not coerce these into one `delivered=true` field.

A notification can be delivered but unread. A message can be acknowledged before an external side effect commits. A webhook can return success while a downstream asynchronous job later fails. Consumer-effect truth remains with the capability/system that owns the effect.

## 11. Subscriptions, routing, filters and recipient cohorts

Subscriptions and routing are canonical, revision-qualified semantics, independent of provider-native topic/subscription IDs.

A subscription revision can include:

- source/event-type scope;
- tenant/site/Station scope;
- consumer/recipient identity or resolver;
- filter predicate and expression semantics;
- ordering requirements;
- delivery mode and retry policy;
- replay horizon;
- retention/dead-letter policy reference;
- privacy/security classification;
- provider support requirements;
- lifecycle/effective interval.

Recipient resolution is checkpointed. A notification intent may pin a recipient cohort at occurrence time, resolve at each attempt, or use another declared policy. Retry/replay must not silently change recipient semantics.

Filter and routing revision changes are temporal: messages already in-flight remain associated with the revision that admitted/routed them unless an explicit migration policy says otherwise.

## 12. Retry, redelivery, dead-letter, quarantine and stuck detection

Retries are bounded by operation identity, reason, backoff policy, timeout, retry budget and idempotency/effect-safety.

The system distinguishes:

- transient transport retry;
- provider throttling/rate-limit delay;
- consumer retry;
- negative acknowledgement/redelivery;
- poison-message recurrence;
- dead-letter/quarantine;
- manual/operator redrive;
- replay from retained history;
- reconciliation of an ambiguous prior effect.

Dead-letter/quarantine is a terminal disposition for that delivery path, not proof that the semantic intent succeeded. Every DLQ/quarantine population needs owner, retention, visibility, redrive authority, privacy handling and aging thresholds.

Stuck detection uses queue age, oldest unprocessed age, retry age, redelivery count and dependency/currentness evidence; queue depth alone is insufficient.

## 13. Replay and redrive

**DECISION C3.15-D4 — replay preserves occurrence lineage and requires current eligibility; it does not manufacture a new occurrence or permanent right to re-execute effects.**

Replay eligibility requires, where applicable:

- source occurrence/message retained and integrity-qualified;
- schema/consumer compatibility;
- current authorization;
- privacy/retention/legal-hold eligibility;
- provider/consumer support;
- dedupe/idempotency or explicit effect-risk disposition;
- declared ordering impact;
- target consumer cohort and routing revision;
- owner approval where redrive is an operational control action.

If replay can re-trigger an external irreversible effect, the downstream owning capability must explicitly qualify effect safety. Messaging cannot infer that safety from broker semantics.

## 14. Queueing, flow, backpressure and capacity mathematics

Notifications / Events / Messaging is modeled as a finite-capacity queue network, not as a Boolean broker-health flag.

At minimum the capability can qualify:

- arrival rate `λ` by class/source;
- service rate `μ` by consumer/provider path;
- utilization `ρ = λ/μ` only within a declared model and stability assumptions;
- queue depth and oldest-message age;
- retry/redelivery arrival amplification;
- fan-out multiplier;
- burst size/duration;
- provider quotas and rate limits;
- consumer concurrency;
- in-flight/visibility/acknowledgement windows;
- storage/retention horizon;
- dead-letter growth;
- offline-buffer growth and reconnect burst;
- capacity headroom/stability margin.

`low mean utilization != sustainable capacity`.

A retry storm can increase effective arrival rate and destabilize an otherwise healthy path. Fan-out can turn one semantic occurrence into many delivery attempts. Offline sites can reconnect with a backlog burst larger than steady-state capacity. Capacity decisions therefore require population/class/time-window context and uncertainty, not a scalar health score.

## 15. Provider / broker / channel qualification and substitution

Provider/Binding remains owner of discovery, qualification, admission and binding. This capability declares a required messaging support vector including:

- delivery guarantee scope;
- ordering domain;
- acknowledgement semantics;
- retention/replay horizon;
- dedupe/idempotency facilities and windows;
- dead-letter/quarantine support;
- consumer/subscription model;
- fan-out semantics;
- payload/message-size limits;
- throughput, concurrency and in-flight quotas;
- regional/residency behavior;
- offline/local behavior;
- schema/evolution facilities;
- observability/evidence quality;
- security/trust/secret integration;
- cost/usage dimensions.

Feature-name equality is not semantic equivalence.

Provider substitution/coexistence lifecycle:

`qualify target -> establish shadow/parallel binding -> mirror or dual-publish only where semantically safe -> verify subscriptions/consumers -> reconcile offsets/cursors/checkpoints -> explicitly cut over producer and consumer cohorts -> fence old routes -> drain delayed/retrying/DLQ/residual messages -> govern retained history -> verify closure`.

New-provider acceptance does not prove migration completion.

## 16. Residual subscriptions, messages and cohorts

Residual state after migration can include:

- old subscriptions;
- delayed messages;
- in-flight messages;
- retry schedules;
- dead-letter/quarantine populations;
- provider receipts;
- cached recipient cohorts;
- old routing/filter revisions;
- consumer cursors/checkpoints;
- offline site buffers;
- provider-specific replay archives.

Each residual cohort requires identity, owner, currentness, drain/fence/disposition policy and closure evidence. Silent abandonment is not migration proof.

## 17. Tenant, site, local runtime and Fleet

All communication identity and evidence is scope-qualified by tenant/organization/site/runtime where applicable.

Generated runtimes may operate locally and buffer communication while Fleet or a remote provider is unavailable when the capability contract explicitly supports bounded offline operation. Local evidence remains authoritative for what the local runtime actually observed within its scope; Fleet is an aggregation/coordination surface and may be stale, partial or disconnected.

Required distinction:

`local publication/delivery journal -> exported telemetry -> Fleet aggregate -> operator/control intent`.

No later projection retroactively changes local historical truth. Remote control actions require authorization and separate effect evidence.

## 18. Physical / Peripheral Integration boundary

Physical/peripheral event ingestion remains inside the C2 integration/governance boundary.

A device/VMS/BMS/access-control/PDV event may be ingested, normalized and routed through this capability after C2 qualifies source identity, mapping and currentness. Messaging does not infer physical truth from transport success and does not gain generic direct actuation authority.

`provider-reported device event != physical truth`.

Any later physical effect remains separately governed by C2/domain-specific authority and proof obligations.

## 19. Workflow and Integration boundaries

Workflow owns durable orchestration state, completion, waits, timers, compensation and abandoned in-flight instances. Messaging may carry workflow signals but cannot promote delivery to workflow completion.

Integration owns external connector action semantics and source-of-truth reconciliation. Messaging owns transport/subscription/delivery facts used by those integrations. A retry in Workflow or Integration must respect Messaging `UNKNOWN` and idempotency/effect safety rather than blindly republishing.

## 20. Security, privacy, trust and secrets

The capability references rather than absorbs security/privacy/trust owners.

Required controls can include:

- publish/subscribe/replay/redrive/admin authorization;
- tenant/site isolation;
- producer/consumer identity authentication;
- signed/encrypted transport where required;
- secret references without secret embedding;
- payload minimization/redaction/tokenization where possible;
- privacy-safe telemetry;
- access audit for DLQ/replay/inspection;
- suspicious fan-out, routing or subscription-change signals;
- credential/session expiry/revocation currentness;
- retention/residency rules for queues, payloads, retries, DLQ and replay stores.

Observability must not solve operability by overcollecting sensitive payload content.

## 21. Commercial / cost boundary

Messaging exposes qualified usage dimensions such as messages, bytes, delivery attempts, fan-out count, retention volume/time, replay/redrive volume, egress, provider/API calls and quota utilization.

These dimensions may support FinOps and Commercial evidence, but:

`observability/usage evidence != pricing authority`.

Cost pressure can influence provider/binding or operational decisions only through governed policy; it cannot silently weaken required delivery, privacy, retention or recovery semantics.

## 22. Brownfield / Legacy Mirroring

Brownfield discovery may identify:

- cron-based notifications;
- email/SMS/chat scripts;
- ad-hoc webhook handlers;
- database polling;
- vendor topics/queues;
- manual resend procedures;
- implicit retry conventions;
- undocumented recipient lists;
- provider dashboards;
- locally buffered device/event files;
- operator knowledge about poison messages or stuck consumers.

These become evidence/candidates with source, revision and confidence. Observed behavior is not automatically adopted as canonical routing, authority, retention or SLA.

Explicit adoption requires mapping producer/source/subject, identities, subscription/routing semantics, provider realization, currentness, owners, failure/recovery rules and privacy/security obligations.

## 23. Operability Elicitation Lens — capability-specific

For every event/message/notification workflow, subscription, consumer and provider path, elicitation must ask at least:

- **Como saberemos que está funcionando?** Which occurrence, publication, delivery and consumer-effect evidence proves success?
- **Como saberemos que está degradado?** Which queue age, backlog, retry, latency, delivery-loss, partial-fanout, quota or currentness thresholds indicate degradation?
- **Quem é responsável?** Who owns producer, subscription, consumer, provider, DLQ/quarantine, reconciliation and on-call escalation?
- **Que evidência precisamos?** Which IDs, revisions, timestamps, receipts, acknowledgements, consumer-effect proofs and lineage must be retained?
- **Qual estado pode permanecer UNKNOWN?** For how long may publication, subscription mutation, acknowledgement or downstream effect remain unresolved?
- **Qual perda/atraso é aceitável?** What loss, duplication, reordering, delay, stale-recipient resolution and offline-buffer horizon is acceptable by class?
- **Como recuperar?** Retry, failover, replay, DLQ redrive, provider substitution, consumer rebuild or manual recovery?
- **Como reconciliar?** How are ambiguous publish/ack/subscription effects, event gaps, cursor drift and residual cohorts checked?
- **Como validar depois de mudança/deploy?** What synthetic/controlled proofs establish routing, currentness, ordering scope, DLQ, rollback and consumer-effect behavior after change?

Additional required questions include expected throughput, normal/peak/burst arrival, fan-out multiplier, maximum tolerable queue age, provider quotas, retry/idempotency horizon, timeout, dependency health, retention/replay horizon, maintenance windows, degraded/offline behavior, reconciliation capacity, rollback/fencing, capacity headroom, cost/usage, incident response and audit.

For integrations specifically: source-of-truth, sync lag, event gaps, provider outage, partial pagination/discovery where applicable, permission drift, contract/API revision, unsupported semantic scope and reconciliation owner are mandatory.

## 24. Production Readiness Coverage

Feature completeness and Production Readiness Coverage remain independent.

For this capability, coverage is tracked across:

- `OBSERVABILITY`;
- `OWNERSHIP`;
- `FAILURE_HANDLING`;
- `RECOVERY`;
- `CAPACITY`;
- `CURRENTNESS`;
- `SECURITY`;
- `RECONCILIATION`;
- `CHANGE_SAFETY`;
- `COST`;
- `DOCUMENTATION`.

Allowed states:

`UNTOUCHED | PARTIAL | RESOLVED | CONFLICTED | BLOCKED | NA`.

There is no authoritative scalar readiness/health score. A fully specified feature with no DLQ owner, an integration with retry but no idempotency, a dashboard with no freshness, an alert with no action owner, a metric without unit/population/context, a failure mode without recovery, a rollout without rollback, or capacity without peak assumptions remains operationally incomplete even if feature semantics are complete.

## 25. Observe / control / change authority split

Operational surfaces classify actions explicitly:

- **OBSERVE** — inspect queue/subscription/currentness/evidence;
- **CONTROL** — pause/resume bounded consumption, acknowledge operator disposition, trigger governed reconciliation/redrive where already authorized;
- **CHANGE** — alter routing/filter/subscription/provider/retention/replay policy or authority.

UI visibility never grants CONTROL or CHANGE. AI may summarize evidence or propose actions, but cannot create routing authority, replay authority, recipient eligibility or stronger delivery guarantees.

## 26. Planning D migration constraints

Planning D must preserve at least:

1. existing Observe callback outcomes until replacement/equivalence is explicitly proved;
2. provider-independent notification intent as a compatibility seam;
3. introduction of canonical communication identities before provider IDs are generalized;
4. explicit attempt/effect journal before unsafe automatic replay/retry is expanded;
5. subscription/routing revisions before provider migration/coexistence;
6. `UNKNOWN` reconciliation paths before broadening external transports;
7. residual queue/subscription/DLQ/cursor drainage during substitution;
8. current runtime autonomy and fail-open Observe semantics where those are existing authoritative behavior;
9. no assumption that a target broker/channel exists merely because the semantic owner is decided.

Planning D decides sequencing only after Planning C closes.

## 27. Planning E product-proof candidates

Planning E should later define executable/inspectable proofs for at least:

- stable semantic identity independent of provider IDs;
- event occurrence retained through replay without duplicate occurrence creation;
- source/subject/schema/provenance revision traceability;
- ordering claim rejected outside its qualified scope;
- duplicate delivery tolerated without duplicate semantic effect under a qualified idempotent consumer;
- acknowledgement not promoted to business completion without the proper effect contract;
- publication timeout producing `UNKNOWN` and reconciliation-before-retry;
- partial fan-out represented explicitly;
- DLQ/quarantine ownership, retention and redrive proof;
- replay eligibility blocked when privacy/authorization/schema/idempotency constraints fail;
- provider cutover with residual subscription/message/cursor drainage;
- offline buffer/reconnect burst and backlog recovery;
- queue age/backpressure alert tied to owner and runbook;
- currentness/freshness visible on operator surfaces;
- post-change synthetic validation and rollback/fencing;
- Fleet aggregate not overwriting local/provider truth;
- Physical/Peripheral event ingestion remaining C2-bounded and non-actuating.

## 28. Alternatives considered

### A. Make broker/topic/queue primitives canonical
Rejected. It leaks provider topology into semantic identity and weakens portability.

### B. Treat events, messages and notifications as one undifferentiated envelope
Rejected. Occurrence, communication intent, recipient targeting and delivery/effect evidence have different ownership and lifecycle semantics.

### C. Promise universal exactly-once semantics
Rejected. Strong guarantees are provider/topology/horizon-scoped and do not automatically cover arbitrary external business effects.

### D. Use Workflow as the messaging owner
Rejected. Workflow owns durable orchestration; transport/subscription/delivery semantics are a distinct reusable concern.

### E. Use Observability as event truth
Rejected. Operational telemetry observes communication; it does not become canonical event/message/subscription authority.

### F. Let AI infer routes/recipients from context
Rejected as authority. AI can propose candidates; deterministic policy/authorization and explicit adoption govern effective routing.

## 29. Unresolved questions and conflicts

No architecture-level blocker was found for C3.15. Provider-specific limits, exact operational SLO values, retention periods, channel-specific acknowledgement fidelity, and concrete broker/provider choices remain contextual inputs for later elicitation, Planning D sequencing and Planning E proofs.

No research finding is reclassified as remediation or ConflictInstance by this decision.

## 30. Decision disposition

**C3.15 — Notifications / Events / Messaging: DECIDED / PASS_FOR_CAPABILITY / TARGET_ARCHITECTURE_DECIDED.**

The target establishes provider-neutral communication semantics with distinct occurrence, intent, subscription, attempt, acknowledgement and consumer-effect evidence; scoped ordering and guarantee claims; replay/redrive lineage; explicit `PARTIAL/UNKNOWN` reconciliation; provider coexistence/drainage; queue/backpressure/capacity mathematics; local/Fleet currentness; Brownfield assimilation; capability-specific Operability Elicitation; multidimensional Production Readiness Coverage; and Planning D/E routes.

This decision does not execute C3.16, Planning D/E, Architecture Reconciliation, WBS, Work Packages, executive TASKs, Construction or product code.

## 31. External challenge evidence consulted

Portable semantics were challenged against current public provider documentation, not adopted as canonical vendor architecture:

- Amazon SQS documentation: standard queues use at-least-once delivery; consumers should be idempotent; visibility timeout and DLQs make redelivery/in-flight handling explicit; FIFO deduplication uses a finite deduplication interval.
- Google Cloud Pub/Sub documentation: exactly-once delivery is scoped by region and acknowledgement behavior; reliability/currentness can vary under regional isolation/outage conditions.
- Apache Kafka documentation: idempotent/transactional and exactly-once processing guarantees are configuration/topology-scoped, particularly around Kafka-managed state/offset/output boundaries.

These sources support the architecture rule that delivery/ordering/idempotency guarantees must remain scope-qualified and must not be promoted into arbitrary business-effect guarantees.
