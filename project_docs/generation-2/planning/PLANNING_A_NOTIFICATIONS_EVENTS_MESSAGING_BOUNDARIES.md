# Planning A — Notifications / Events / Messaging Boundaries

Status: PASS_FOR_CAPABILITY
Phase: PLANNING_A_TAXONOMY_BOUNDARIES
Canonical capability: Notifications / Events / Messaging

This artifact defines semantic ownership and boundaries only. It makes no claim about current System Builder implementation and performs no Planning B archaeology, product code, Work Package, TASK, Construction, PR, or worker handoff.

## 1. Semantic ownership

Notifications / Events / Messaging owns the portable semantics of communication intent and delivery realization between producers and consumers. Its canonical source of truth includes:

- canonical `EventIdentity`, `MessageIdentity`, `NotificationIdentity` and lineage between them when one semantic event produces one or more messages/notifications;
- producer intent and immutable/revisioned payload or payload-reference identity, without making transport envelopes canonical domain truth;
- `SubscriptionIdentity`, subscription revision/lifecycle, consumer/recipient targeting and effective recipient/consumer cohorts;
- delivery-attempt lineage and explicit transitions such as `attempted → accepted → delivered → consumer-effective/processed`, without collapsing transport acknowledgement into semantic processing;
- ordering scope and ordering key/domain, including explicit statements where ordering is not guaranteed;
- deduplication/idempotency evidence and horizons, without universal exactly-once assumptions;
- replay/redrive eligibility, replay source/horizon, dead-letter/failure disposition and lineage-preserving supersession/correction;
- fan-out semantics and cohort completeness/partiality;
- provider-neutral transport support qualification, provider migration/cutover and residual subscriptions, queues, messages, cursors/checkpoints or consumer cohorts.

Canonical event/message/notification IDs remain distinct from broker offsets, queue IDs, topic names, delivery IDs, webhook IDs, provider notification IDs and other realization identifiers unless an explicit governed adoption transition says otherwise.

## 2. Source-of-truth boundaries

The capability owns communication facts, not every fact communicated. A domain owner remains authoritative for the business/domain state represented by an event. Delivery or processing evidence cannot silently overwrite that domain truth.

Producer acceptance by a broker proves only the qualified acceptance fact. Delivery proves only the qualified delivery fact. Consumer acknowledgement may prove transport-level receipt or consumer-defined processing only when the acknowledgement contract explicitly says so. Semantic effectiveness remains owned by the capability/domain that defines the effect.

For ambiguous mutating publication/subscription/provider operations, effect disposition remains `APPLIED / NOT_APPLIED / PARTIAL / UNKNOWN`. `UNKNOWN` requires reconcile-before-retry unless idempotency is explicitly qualified for the exact operation, identity and horizon.

## 3. Delivery guarantees and ordering

`at-most-once`, `at-least-once` and `exactly-once` are applicability-scoped qualified claims, not universal provider promises. A claim must identify at minimum transport/provider support, producer operation, consumer cohort, deduplication/idempotency mechanism, relevant revision and evidence/currentness horizon.

Exactly-once transport claims do not imply exactly-once domain effects. Domain-effect uniqueness requires an owner-qualified idempotency/effect contract and evidence.

Ordering is explicit by scope. Global ordering is never inferred from per-partition, per-key, per-recipient or per-session ordering. Replays/redrives must preserve or explicitly declare changed ordering semantics.

## 4. Replay, redrive and residual cohorts

Replay/redrive is eligible only when retained evidence/payloads, authorization, privacy/governance constraints, consumer compatibility and idempotency/effect safety are currently qualified. Historical replay capability is not a permanent right to re-actuate effects.

Provider or subscription migration follows an explicit coexistence/cutover/drain model. Old subscriptions, queues/topics, unconsumed messages, retry/dead-letter stores, provider cursors/checkpoints and still-authoritative consumers are residual cohorts until drained, fenced, expired, dispositioned or explicitly qualified as non-authoritative.

A provider migration is not complete merely because the new transport accepted publications.

## 5. Failure semantics

Required distinguishable outcomes include:

- publication not accepted;
- publication acceptance unknown;
- accepted but delivery pending;
- delivery failed/retrying;
- delivered but consumer processing unknown;
- consumer processing failed;
- partial fan-out/cohort delivery;
- dead-lettered/quarantined;
- replay/redrive ineligible;
- stale or insufficient evidence resulting in `INCONCLUSIVE` rather than silent success.

Dead-letter storage is a failure disposition, not evidence that the intended semantic effect occurred. Correction/supersession preserves lineage rather than rewriting prior evidence.

## 6. Capability boundaries

### Workflow & Durable Execution
Workflow owns durable orchestration state, timers, human tasks and workflow execution history. Notifications/Messaging may transport signals or work notifications, but broker delivery is not workflow-step completion. Workflow retries cannot blindly replay an `UNKNOWN` external communication effect.

### Integration & Automation
Integration owns connectors/adapters, external-system actuation and automation semantics. Notifications/Messaging owns communication transport/subscription/delivery semantics used by those connectors. A webhook delivery receipt is not automatically proof of external-system effect.

### Observability / Operations / Incident
Observability owns telemetry and operational evidence semantics. Messaging exposes delivery/processing evidence; Observability consumes it without becoming owner of subscription or message identity. Telemetry pipelines themselves may use messaging realization without changing this ownership.

### Data / Schema / Migrations
Data/Schema owns canonical data/schema compatibility. Event/message schema references must point to qualified revisions; transport serialization does not become canonical data identity. Consumer compatibility across schema revisions remains explicit.

### Storage / Documents / Media
Storage owns object/document/media identity, content integrity and physical persistence. Messaging may carry references or payload copies, but a broker blob or attachment does not supersede canonical storage identity without explicit adoption.

### Authorization / Policy / Organization / Multitenancy
Authorization owns permission to publish, subscribe, receive, replay, redrive, inspect dead letters or administer transports. Subscription existence does not grant authority. Tenant/Station boundaries constrain recipient/consumer exposure.

### Privacy / Data Governance
Privacy/Data Governance owns purpose/use, retention, hold, residency and disposition constraints. Replay, dead-letter retention, fan-out and provider migration remain subject to those obligations; a lower scope cannot use messaging to bypass them.

### Provider / Binding / Capability Negotiation
Provider/Binding owns provider discovery, qualification, admission, binding, fallback and cutover. Notifications/Messaging owns the semantic support vector it requires: ordering scope, retention/replay horizon, delivery guarantees, deduplication facilities, dead-letter support, fan-out, offline behavior and evidence semantics. Provider IDs remain realization identities.

### Lifecycle / Versioning / Evolution / Migration
Lifecycle supplies revision/coexistence primitives. Notifications/Messaging retains domain-specific compatibility for producers, consumers, subscriptions, payload contracts and replay safety, plus residual cohort drainage.

### Universal Capability Architecture
UCA supplies reusable identity, evidence, revision, effect-disposition and provider-binding primitives. It must not absorb event/message/notification semantic ownership.

## 7. Enterprise → Station → Role → Person and AGWS

The delegation hierarchy remains monotonic. Enterprise policy may constrain available channels/transports, mandatory notifications, recipient classes, replay authority and retention. Station may expose only a bounded subset. Role and Person may specialize only delegated preferences/actions.

Adaptive Governed Work Surfaces remains distinct from generic UI and from this capability. AGWS may present inboxes, alerts, subscriptions and governed actions, but AI/AGWS/lower scopes cannot:

- create new publication/subscription/replay authority;
- remove mandatory superior notifications;
- weaken retention/privacy/tenant constraints;
- convert provider acknowledgement into proof of consumer-effective processing;
- manufacture deduplication, ordering or exactly-once evidence;
- silently bind a page to a provider identity instead of a capability binding.

## 8. Portability and provider substitution

Portable definition describes semantic channel/communication requirements and support vectors, not vendor topic/queue configuration as canonical truth. Provider substitution requires qualification of semantic differences, coexistence where necessary, explicit cutover, evidence that intended producers and consumers use the new binding, and residual-cohort drainage.

Unsupported semantics must surface as `UNSUPPORTED`, `DEGRADED` or `INCONCLUSIVE` according to the applicable contract; they must not be silently emulated with weaker guarantees while retaining a stronger claim.

## 9. Non-goals

This capability does not own canonical business process state, domain entities, workflow orchestration, external business-system effect semantics, authorization policy, privacy obligations, generic telemetry, provider admission, or storage/document truth. It does not require one broker, protocol, queue/topic model or exactly-once implementation.

## 10. Planning B repository-validation questions

Defer all answers to fresh-main archaeology in Planning B:

1. Does SB currently define stable canonical event/message/notification and subscription identities distinct from provider transport IDs?
2. Are delivery attempts and acknowledgement/consumer-effective states represented separately?
3. Are ordering, deduplication/idempotency and replay horizons explicit contracts or implicit provider assumptions?
4. Are `UNKNOWN` publication/subscription mutations reconciled before unsafe retry?
5. Are dead-letter and partial fan-out states represented without being treated as semantic success?
6. Can providers be substituted while preserving canonical subscription/message lineage and draining residual cohorts?
7. Are authorization, privacy, Station and tenant constraints enforced around publish/subscribe/replay/redrive?
8. Are schema/payload revisions and consumer compatibility qualified explicitly?
9. Is runtime autonomy/offline behavior explicit when remote messaging dependencies are unavailable?

No answer is inferred in Planning A.

## 11. Planning A disposition

**PASS_FOR_CAPABILITY.** Notifications / Events / Messaging has a distinct semantic owner and bounded relations to adjacent capabilities. No new research finding or capability candidate is required. Planning B remains blocked until every canonical capability completes Planning A reconciliation.