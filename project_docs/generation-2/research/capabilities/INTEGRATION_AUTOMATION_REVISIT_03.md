# Generation 2 — Integration & Automation — Revisit 3 / Cycle 4

Status: cycle 4 revisit complete; material new findings; not saturated.

## Research question
How should System Builder preserve semantic operation identity, authority and evidence when triggers, subscriptions, connector bindings, asynchronous deliveries, retries, dead-lettering, replay and provider replacement evolve independently, without confusing transport success with semantic/domain acceptance?

## Representatives
1. Apache Kafka 4.2 — at-least-once, idempotence and transactional processing boundaries.
2. Amazon EventBridge — rules, API destinations, retry/DLQ, archive and replay.
3. CloudEvents — portable event identity/context envelope.
4. Dapr Pub/Sub — provider-neutral pub/sub and explicit dead-letter/resiliency separation (prior evidence, re-tested as abstraction boundary).
5. Azure Logic Apps — connector identity/connection lifecycle and managed execution (prior evidence, re-tested for authority boundary).
6. Zapier Platform — webhook/poll trigger lifecycle and platform deduplication (prior evidence, re-tested for external automation ownership).

## Evidence/source ledger
### Apache Kafka
Kafka documents at-least-once consumer failure semantics when processing occurs before offset persistence; duplicate processing is therefore possible. Kafka's stronger exactly-once behavior depends on transactional coordination of output records and consumed offsets inside Kafka's boundary. This is scoped realization evidence, not a universal promise that arbitrary external side effects occur exactly once.

Source of truth: Apache Kafka 4.2 Design documentation.

### Amazon EventBridge
EventBridge API destinations retry selected HTTP failures; event-bus delivery defaults can retry for up to 24 hours/185 attempts and can route exhausted deliveries to a DLQ. A successful HTTP delivery is delivery evidence, not proof that the remote domain accepted or committed the intended business effect.

Archives preserve events for later replay. Replay is a new operational act with explicit replay identity and can target the source bus/rules; replayed events are marked so they can be distinguished. AWS notes replay order is not necessarily original insertion order. Therefore replay/redrive cannot be modeled as invisible continuation of the original delivery attempt.

Source of truth: Amazon EventBridge User Guide, current September 2026 documentation.

### CloudEvents
CloudEvents provides portable event context and event identity, but does not own business authorization, consumer idempotency, domain acceptance or provider delivery semantics. It is a useful wire/profile primitive, not the semantic operation owner.

Source of truth: CloudEvents specification/project documentation.

### Dapr, Logic Apps, Zapier
Prior cycle evidence remains authoritative: Dapr separates pub/sub abstraction from resiliency/DLQ realization; Logic Apps connections have independently scoped identities and lifecycle; Zapier polling/webhook trigger mechanics and platform deduplication do not prove business-effect idempotency. This pass uses them as contradiction checks rather than repeating their product summaries.

## Source of truth
Portable truth is the revisioned semantic integration contract plus admitted trigger/subscription and effective authority requirements. Broker topics, webhook URLs, connector node IDs, OAuth connections, IAM roles, offsets and provider retry state are realization.

Proposed chain:
`SemanticOperationRevision -> TriggerOrSubscriptionRevision -> AdmissionContext -> EffectiveAuthoritySnapshot -> ProviderRequirement -> BindingRevision -> DeliveryRun -> DeliveryAttempt -> TransportReceipt -> DomainAcceptanceEvidence`

For replay:
`OriginalEventIdentity -> ReplayIntent -> ReplayAuthorityDecision -> ReplayRun -> NewDeliveryAttempts -> DomainPostconditionEvidence`

## Identity
Keep distinct: semantic operation revision; event identity; trigger/subscription revision; Station exposure revision; initiating/effective authority snapshot; provider/binding revision; delivery run; delivery attempt; transport receipt; business correlation/idempotency key; replay/redrive run; DLQ/quarantine item; domain acceptance/postcondition evidence.

## Lifecycle
`declare -> bind -> validate -> activate -> receive -> admit -> authorize -> deliver -> observe -> retry/dead-letter -> repair/replay -> verify postcondition -> migrate/replace -> deprecate`.

Trigger/subscription revision and delivery run revision may coexist. In-flight work must not silently adopt a new trigger, binding, retry policy or semantic operation revision.

## Versioning
Independently version semantic operation, event/schema/profile, trigger/subscription, authority policy, Station exposure, binding/provider, connector implementation, retry/DLQ policy, correlation/idempotency contract and transformation/enrichment. Evidence must name the effective revisions used by each delivery run/attempt.

## Failure semantics
Distinguish: not admitted; unauthorized; stale trigger; stale Station exposure; binding unavailable; provider incompatible; transport rejected; retry scheduled; retry exhausted; DLQ/quarantine; ambiguous remote effect; transport accepted/domain acceptance unknown; duplicate/replay detected; replay unauthorized; replay ordering changed; migration validation failed; provider replacement incompatible; domain postcondition failed.

`2xx/ACK/offset commit` is not automatically `DOMAIN_ACCEPTED`.

## Extensibility and provider boundaries
Providers may add brokers, transports, connectors, stronger transactional guarantees and hosted automation. They cannot redefine semantic operation identity or authority. Provider replacement requires compatibility evidence for operation/profile, auth mode, ordering, delivery, retry, idempotency/correlation and evidence obligations.

## Governance
Govern trigger creation, Station exposure, connection/binding activation, credential scope, replay/redrive, DLQ repair, provider replacement, schema/profile compatibility and migration. Replay and repair are independently authorized acts. A provider's technical permission never widens semantic authority.

## Observability
Evidence should preserve event/correlation identity, trigger/subscription revision, authority snapshot, Station exposure revision, binding/provider revision, run/attempt lineage, retry/DLQ/replay lineage, transport receipt and domain postcondition. Evidence quality/freshness may be UNKNOWN/INCONCLUSIVE.

## Portability / lock-in
Portability means preserving semantic operation and evidence contracts while replacing transport/provider realization. It does not require identical ordering, retry or exactly-once behavior. Lock-in rises when business semantics depend on connector node IDs, proprietary execution IDs, hidden retry ownership or provider-only deduplication.

## Product-specific vs universal
Do not universalize Kafka offsets/transactions, EventBridge ARNs/replay-name, Dapr YAML, Logic Apps connection JSON or Zapier trigger IDs. Universalize revision-bound trigger/subscription identity, delivery-run/attempt lineage, correlation/idempotency, scoped guarantee evidence, governed migration and replay authority.

## Convergent/divergent patterns
Convergent: asynchronous delivery creates attempt lineage; retry/replay are explicit operational transitions; provider guarantees are scoped; credentials/bindings have lifecycle; transport receipt differs from business postcondition; replay needs identity and governance.

Divergent: Kafka can make Kafka-contained processing transactional; EventBridge replay is archive/bus oriented and may reorder; SaaS automation platforms own connector execution but not the external domain's semantic acceptance. The divergence argues against a universal exactly-once abstraction.

## Subcapabilities
Semantic integration contracts; trigger/subscription admission; provider binding; event identity/correlation; delivery run/attempt; retry/DLQ/quarantine; replay/redrive; domain acceptance evidence; governed connector/event migration; Station-scoped integration exposure; provider replacement conformance; qualified local integration closure.

## Comparison with fresh `main` — bounded evidence only
A fresh-main code search for `bindingRef integration idempotency retry webhook` returned no matching result in this run. This is only negative evidence for that bounded search and is not repository-wide absence. Prior dossier evidence remains authoritative until Planning B performs repository archaeology.

## Reconciliation hypotheses
KEEP/HARDEN explicit integration/binding contracts if confirmed on fresh-main archaeology. GENERALIZE revision-bound trigger/delivery/evidence and migration primitives. PROVIDERIZE broker/connector/retry/auth implementations. INTEGRATE Kafka/EventBridge/Dapr/Logic Apps/Zapier-like systems behind semantic contracts. REPLACE any coupling where provider credential or transport ACK becomes semantic authorization/success. DEFER broad marketplace breadth. DO_NOT_BUILD universal exactly-once or a proprietary universal connector runtime.

## Repository-validation questions
1. Are trigger/subscription revisions represented independently from semantic operation revisions?
2. Can in-flight delivery preserve the exact binding/authority revision it started with?
3. Is transport receipt distinguished from domain acceptance/postcondition evidence?
4. Are retry, replay and DLQ repair independently authorized?
5. Can provider replacement be rejected on ordering/idempotency/evidence incompatibility?
6. Can Station exposure removal invalidate future asynchronous continuation without rewriting historical evidence?
7. Is local/offline execution closure expressible without a central SB dependency?
8. Can AGWS hand off supervised automation to integration/workflow without widening authority?

## Adaptive Governed Work Surfaces
AGWS owns constrained surface intent and effective `Enterprise -> Station -> Role -> Person` context. Integration owns external delivery realization. A personal/supervised action may initiate only an admitted semantic operation exposed by the effective Station. Asynchronous continuation carries an attenuated authority snapshot; later connector execution cannot infer broader authority from a service credential. Canonical domain/process changes still escalate.

## Symbiotic Proof
Prove one semantic action through two replaceable providers: same operation/event identity contract; revision-qualified Station/Role authority; provider-specific binding hidden; retries create attempts under one delivery run; transport ACK remains pending until domain evidence; duplicate delivery is safely correlated; DLQ repair and replay require explicit authority and create new lineage; provider replacement revalidates guarantees; an in-flight run does not silently adopt the replacement; local/offline closure can interpret required contracts with declared dependencies; AGWS never gains provider or domain-mutation authority.

## Stable findings
### G2-FINDING-IA-23 — Trigger/Subscription Revision and Delivery-run Revision Must Coexist Without Identity Collapse
An active trigger/subscription can evolve while deliveries are in flight. Each delivery run must preserve the semantic operation, trigger/subscription, authority, Station exposure and binding revisions effective at admission; later edits cannot silently rewrite that lineage.

### G2-FINDING-IA-24 — Transport Receipt and Domain Acceptance Are Distinct Evidence States
HTTP success, broker ACK, enqueue success or committed offset proves a scoped transport event, not necessarily the intended domain effect. Domain acceptance/postcondition requires separate evidence and may remain UNKNOWN or INCONCLUSIVE.

### G2-FINDING-IA-25 — Retry, Redrive and Replay Are Lineaged Attempts/Runs, Not Invisible Continuations
Retry remains an attempt under declared policy; redrive/replay is an explicit governed run referencing original event/correlation identity. Replay can change timing/order and therefore must preserve its own authority decision and postcondition evidence.

### G2-FINDING-IA-26 — Integration Migration Is a Governed Plan/Validation/Approval/Attempt/Postcondition Transition
Changing connector/provider, trigger/event contract or binding is not pointer reassignment. Migration must validate compatibility and authority, be approved by the proper owner, record the attempt, and verify postconditions without mutating historical deliveries.

### G2-FINDING-IA-27 — Qualified Local Integration Closure Is Operation/Profile Scoped
Offline/self-hosted integration autonomy requires the local semantic contracts, event/profile schemas, binding/provider realization, trust/configuration, authority inputs, correlation/idempotency rules and recovery/evidence dependencies needed for the declared operation. It does not require every enterprise provider to be locally owned.

### G2-FINDING-IA-28 — Station Authority Must Be Captured at Admission and Attenuated Through Asynchronous Continuation
Station exposure and Role/Person authority are evaluated when an operation is admitted and preserved as revision-bound evidence through asynchronous hops. Later execution may narrow or invalidate continuation under policy, but service credentials, retries or external automation cannot widen the admitted semantic authority.

## Value / risk / priority / next question
Value: high — integrations are a core symbiotic boundary. Risk: high if transport/provider semantics leak into domain truth or authority. Priority: high. Next question for this capability: after cross-capability synthesis, determine whether delivery-run/evidence/migration primitives merge fully into UCA shared primitives or retain integration-owned specializations.