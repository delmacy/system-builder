# Generation 2 — Integration & Automation — Revisit 4 / Cycle 5

Status: cycle 5 revisit complete; material new findings; not saturated.

## Research question
How should System Builder model mutable integration definitions, asynchronous and synchronous invocation, retry/redrive/replay/DLQ/reconciliation, ambiguous external effects, provider cutover and Station-scoped automation so that provider transport mechanics never collapse semantic identity, authority or domain postcondition evidence?

## Representatives
1. Apache Kafka 4.x — at-least-once and transaction-scoped exactly-once semantics.
2. Amazon EventBridge — API destinations, retry/DLQ, archive/replay and delivery-attempt semantics.
3. Dapr Pub/Sub — declarative/programmatic subscriptions, scopes/routes, resiliency and dead-letter topics.
4. CloudEvents 1.0 — portable event identity/context and schema references.
5. Azure Logic Apps — HTTP/webhook async patterns, retry policies and connector realization.
6. Stripe APIs/Webhooks — scoped idempotency keys, duplicate events, retries, ordering divergence and reconciliation.

## Evidence/source ledger
### Apache Kafka
Kafka documents that processing before committed consumer position can yield duplicate processing after failure. Its exactly-once behavior is achieved by coordinating Kafka-produced output and consumed offsets in Kafka transactions. This is strong evidence that exactly-once is boundary-qualified: it does not automatically make arbitrary external side effects atomic.

Source: https://kafka.apache.org/41/design/design/

### Amazon EventBridge
EventBridge API destinations classify HTTP responses for retry, honor Retry-After for relevant failures, retry under bounded policies and may route exhausted deliveries to a DLQ. Delivery success is scoped transport evidence. Event replay is an explicit later operation and should not be treated as invisible continuation of the original delivery.

Source: https://docs.aws.amazon.com/eventbridge/latest/userguide/eb-api-destinations.html

### Dapr Pub/Sub
Dapr subscriptions explicitly carry topic, route, pubsub component, scopes, dead-letter topic and optional bulk-subscribe settings. Dapr also separates dead-letter behavior from resiliency/retry policies. A subscription is therefore a mutable realization/configuration object whose route/scope/provider changes need revision and ownership semantics independent of semantic operation identity.

Sources: https://docs.dapr.io/reference/resource-specs/subscription-schema/ and https://docs.dapr.io/developing-applications/building-blocks/pubsub/pubsub-deadletter/

### CloudEvents
CloudEvents standardizes portable event context such as id, source, type, subject and dataschema. It deliberately does not define domain authorization, remote side-effect idempotency or business postconditions. Event identity/context is therefore portable input evidence, not semantic success.

Source: https://github.com/cloudevents/spec/blob/main/cloudevents/spec.md

### Azure Logic Apps
Logic Apps HTTP actions and webhook patterns distinguish synchronous request/response from asynchronous completion and support retry policies for selected transient failures. Connector/platform execution can therefore report an invocation result without owning the remote domain's semantic acceptance.

Sources: https://learn.microsoft.com/azure/connectors/connectors-native-http and https://learn.microsoft.com/azure/connectors/connectors-native-webhook

### Stripe
Stripe API v2 idempotency is explicitly scoped by key, API, account/sandbox and time window. Stripe webhook documentation warns that duplicate events can occur and that event delivery order is not guaranteed; event destinations expose separate delivery attempts and automatic/manual retries. This is direct evidence that correlation/idempotency contracts require scope and expiry, and that duplicate detection cannot be inferred from HTTP success alone.

Sources: https://docs.stripe.com/api-v2-overview and https://docs.stripe.com/webhooks

## Primitives and source of truth
Portable truth is a revisioned `SemanticIntegrationOperation` plus revisioned trigger/subscription/integration-definition intent, declared semantic postconditions and effective authority requirements. Provider component names, webhook URLs, topics, connector IDs, OAuth connections, offsets, retry counters and hosted execution IDs remain realization.

Proposed chain:
`SemanticOperationRevision -> IntegrationDefinitionRevision -> AdmissionDecision -> EffectiveAuthoritySnapshot -> ProviderRequirement -> BindingRevision -> InvocationRun -> InvocationAttempt -> TransportReceipt -> DomainPostconditionEvidence`

Mutation chain:
`BaseIntegrationDefinitionRevision -> ProposedMutation -> ExpectedBase/OwnershipCheck -> AcceptedDefinitionRevision -> ActivationAttempt -> EffectiveDefinitionEvidence`

Recovery chain:
`AmbiguousAttempt -> Correlation/Reconciliation -> EffectDisposition{ABSENT|PRESENT|PARTIAL|UNKNOWN} -> AuthorizedNextTransition{RETRY|COMPENSATE|QUARANTINE|ACCEPT|ESCALATE}`

Provider migration chain:
`MigrationIntent -> Compatibility/RepresentabilityEvidence -> DualRunOrCutoverPlan -> AuthorityDecision -> CutoverAttempt -> EffectiveBindingEvidence -> ReplayPositionDisposition -> PostconditionEvidence`

## Identity
Keep distinct: semantic operation revision; integration definition revision; trigger/subscription revision; route/filter revision; event identity; Station/Role/Person exposure revision; provider requirement; binding/connection revision; credential/trust revision; invocation run; invocation attempt; transport receipt; correlation/idempotency contract and key scope; DLQ item; replay/redrive/reconciliation/compensation run; provider-cutover lineage; domain postcondition evidence.

## Lifecycle
`declare -> validate -> bind -> admit -> authorize -> activate -> receive/trigger -> invoke -> observe -> retry/reconcile/dead-letter -> replay/redrive/compensate/quarantine -> verify postcondition -> migrate/cutover -> deprecate`.

Mutable subscriptions/routes require expected-base or field/semantic ownership. In-flight invocation cannot silently adopt a later route, binding, authority or provider revision.

## Versioning
Independently version semantic operation, event/schema profile, trigger/subscription, route/filter/transformation, Station exposure, authority policy, binding/provider, credential/trust, retry/DLQ policy, correlation/idempotency contract, compensation/reconciliation strategy and evidence profile. Evidence must name the exact effective vector for every invocation run/attempt.

## Failure semantics
Distinguish: definition conflict; stale expected base; unauthorized mutation; inactive subscription; stale Station exposure; unsupported connector/provider capability; binding unavailable; invocation not admitted; transport rejected; transport accepted/domain effect unknown; timeout after possible remote commit; duplicate event; idempotency scope expired/mismatched; retry exhausted; DLQ; replay/redrive unauthorized; compensation failed; reconciliation inconclusive; provider dual-run divergence; replay position not representable; cutover failed; missing dependency evidence; semantic postcondition failed.

`ACK`, `2xx`, committed offset and connector success are never universal synonyms for `DOMAIN_ACCEPTED`.

## Extensibility and provider boundaries
Providers may implement brokers, webhooks, polling, SaaS connectors, routing, retry, DLQ, transactional envelopes and hosted execution. They may advertise capabilities and evidence. They cannot redefine semantic operation identity, Station/Role/Person authority, domain postconditions or universalize provider-specific exactly-once semantics.

Connector/provider support answers `CAN_REALIZE`; invocation authority answers `MAY_ACT`. Both are required and independently revisioned.

## Governance
Govern creation and mutation of triggers/subscriptions/routes, connector activation, credential scope, replay/redrive, DLQ repair, reconciliation disposition, compensation, provider replacement, dual-running, cutover, replay-position migration and deprecation. Repair/replay/compensation are independently authorized acts. Personal/supervised automation remains attenuated to effective Station/Role/Person authority.

## Observability
Evidence should retain semantic operation and integration-definition revisions, event/correlation identity, Station exposure, effective authority snapshot, provider/binding/credential revisions, invocation run/attempt lineage, retry/DLQ/replay/reconciliation/compensation lineage, transport receipt, ambiguity disposition, migration/cutover lineage and domain postcondition. Missing required dependency or remote confirmation must propagate `PARTIAL`/`INCONCLUSIVE` rather than optimistic success.

## Portability / lock-in
Portability means preserving semantic operation, authority, correlation and evidence contracts while replacing provider realization. It does not require identical ordering, retry windows, DLQ semantics or exactly-once guarantees. Lock-in rises when semantics depend on connector node IDs, provider retry counters, hidden deduplication windows, hosted execution IDs or unexportable replay positions.

## Product-specific mechanism versus universal primitive
Do not universalize Kafka offsets/transactions, EventBridge ARNs/replay names, Dapr component YAML, Logic Apps connection IDs or Stripe event-destination IDs. Universalize revision-bound integration definition, scoped idempotency/correlation, invocation run/attempt lineage, explicit ambiguity disposition, typed recovery transitions, expected-base/ownership mutation, provider migration/cutover evidence, qualified local closure and domain postcondition evidence.

## Convergent and divergent patterns
Convergent: duplicates/retries are normal; transport success is scoped; provider guarantees have explicit boundaries; subscription/route realization is mutable; replay is an explicit later operation; idempotency requires scope; authoritative mutation and invocation authority are separable.

Divergent: Kafka can coordinate offsets/output inside Kafka; EventBridge owns bounded retry/DLQ and replay; Dapr abstracts multiple brokers with separate resiliency; Logic Apps owns managed connector execution; Stripe exposes provider-scoped idempotency windows and unordered webhook delivery. These divergences prohibit a universal exactly-once abstraction or a universal retry state machine detached from provider evidence.

## Subcapabilities
Semantic integration operation; trigger/subscription/route definition; mutable-definition ownership; provider binding; connector capability negotiation; invocation admission; correlation/idempotency; delivery/invocation run-attempt lineage; retry/DLQ; ambiguity reconciliation; replay/redrive; compensation; domain postcondition evidence; provider dual-run/cutover; replay-position migration; Station-scoped automation exposure; qualified local integration closure.

## Comparison with SB — evidence bounded
This research round does not infer fresh repository implementation facts beyond the authoritative research state and prior dossiers. Planning B remains responsible for repository archaeology. Therefore all KEEP/HARDEN/REPLACE decisions below remain hypotheses until validated against fresh `main`.

## Reconciliation hypotheses
- KEEP/HARDEN explicit integration/binding contracts if repository validation confirms them.
- GENERALIZE revision-bound invocation/evidence, expected-base mutation, ambiguity-disposition and governed transition primitives.
- PROVIDERIZE broker, webhook, connector, retry, DLQ, auth and hosted-execution implementations.
- INTEGRATE Kafka/EventBridge/Dapr/Logic Apps/Stripe-like providers behind semantic contracts.
- REPLACE any path where service credentials, connector support or transport ACK imply semantic authorization/success.
- DEFER broad connector marketplace breadth until the universal integration boundary is proven.
- DO_NOT_BUILD universal exactly-once, universal provider retry semantics or a proprietary universal connector runtime.

## Repository-validation questions
1. Are semantic operations and trigger/subscription/route definitions distinct revisioned identities?
2. Do mutable subscription/route edits require expected-base or semantic ownership?
3. Can in-flight invocation pin exact definition/binding/authority revisions?
4. Is connector capability support separate from invocation authority?
5. Is transport receipt distinct from domain postcondition evidence?
6. Can an ambiguous external effect enter explicit reconciliation/quarantine instead of blind retry?
7. Are idempotency keys scoped by operation/provider/account/window and preserved as evidence?
8. Are retry, redrive, replay, DLQ repair, compensation and reconciliation distinct governed transitions?
9. Can provider replacement express dual-running, cutover and replay-position incompatibility without silently rewriting history?
10. Does missing schema/trust/authority/provider evidence propagate PARTIAL/INCONCLUSIVE?
11. Can Station/Role/Person exposure removal attenuate future automation without changing historical evidence?
12. Can qualified local/offline closure execute admitted integration operations without silently widening authority or falling back online?
13. Is Workflow orchestration state kept Workflow-owned while Integration owns trigger/subscription/delivery/external-invocation semantics?

## Adaptive Governed Work Surfaces
AGWS remains an explicit promoted capability and distinct from generic UI. It resolves constrained work-surface intent under `Enterprise -> Station -> Role -> Person`. An AGWS action may request an admitted integration semantic operation, but connector credentials, retries, queued continuations and service identities cannot widen the effective authority captured at admission. Provider administration, canonical domain/process mutation and privileged repair/cutover remain separately authorized. AI may materialize or propose within those boundaries but cannot grant itself invocation or provider authority.

## Workflow ownership boundary
Workflow owns orchestration state, durable waits/timers, workflow run progression, human-task orchestration and workflow-level compensation intent. Integration owns trigger/subscription definitions, delivery/invocation attempts, external connector realization, transport receipts, external-effect ambiguity/reconciliation and provider cutover for the integration boundary. A workflow invoking an integration operation references Integration evidence; it does not absorb connector transport state into canonical Workflow semantics.

## Symbiotic Proof
Prove one semantic external action through two replaceable providers and one AGWS-triggered supervised automation: same semantic operation identity; revision-qualified integration definition and Station/Role/Person authority; provider-specific binding hidden; concurrent route edit from stale base rejected; invocation timeout after possible remote commit enters `UNKNOWN` rather than blind retry; reconciliation determines absent/present/partial/unknown effect; retry or compensation requires an authorized typed transition; transport ACK remains insufficient until domain postcondition evidence; duplicate/reordered delivery remains correlated; provider dual-run/cutover preserves both realization lineages and explicitly dispositions replay position; missing trust/schema/provider dependency makes evidence PARTIAL/INCONCLUSIVE; offline closure fails closed when a required dependency is removed; AGWS and Workflow never gain provider-admin or canonical-domain authority by delegation.

## Architecture proof-backfill obligations
1. **Ambiguous-effect adversarial proof:** external system commits, response is lost, then automatic retry is requested. Require `UNKNOWN` + correlation/reconciliation/quarantine until effect disposition is evidenced; blind duplicate actuation must not occur.
2. **Scoped-idempotency proof:** reuse an idempotency key outside its declared operation/account/provider/window scope. It must not be accepted as proof of duplicate suppression.
3. **Receipt-vs-postcondition proof:** provider returns ACK/2xx while the remote domain later rejects or fails the business invariant. Transport evidence may PASS while semantic postcondition FAILS/INCONCLUSIVE.
4. **Concurrent-subscription-mutation proof:** two route/subscription edits share one base; after one commits, the stale mutation must conflict/rebase/receive authorized resolution, never silently overwrite.
5. **Connector-support-vs-authority proof:** provider advertises the connector/action as supported but effective Station/Role/Person authority denies invocation. No external call may occur.
6. **Typed-recovery-transition proof:** drive retry, redrive/replay, DLQ repair, reconciliation and compensation from one failed operation and prove each has distinct identity, authorization and evidence lineage.
7. **Provider-cutover proof:** dual-run two providers, inject divergent ordering/retry capability and an unrepresentable replay position. Cutover must remain blocked/PARTIAL until explicit disposition; historical runs remain bound to original provider revisions.
8. **Dependency-INCONCLUSIVE proof:** remove required schema/trust/authority/provider evidence. Dependent integration conformance becomes PARTIAL/INCONCLUSIVE while independent evidence remains evaluable.
9. **AGWS attenuation proof:** trigger supervised/personal automation, then remove Station exposure before deferred external invocation. Continuation must be denied/attenuated according to policy and must not inherit broader service-credential authority.
10. **Qualified-local-closure proof:** execute offline from declared integration closure; remove one required schema/trust/binding/correlation/reconciliation dependency and require explicit denial/degradation/INCONCLUSIVE, never silent online fallback or authority broadening.
11. **Workflow-boundary proof:** a workflow waits on an integration result while connector retry/reconciliation occurs. Workflow run state remains Workflow-owned; Integration run/attempt/ambiguity evidence remains separately addressable and linked.

## Stable findings
### G2-FINDING-IA-29 — Ambiguous External Effects Require Explicit Effect Disposition Before Re-actuation
A timeout, lost acknowledgement or broken connection after an external call can leave the remote effect unknown. Retry is unsafe until correlation/reconciliation establishes `ABSENT`, `PRESENT`, `PARTIAL` or remains `UNKNOWN`; unresolved cases require quarantine/escalation rather than blind retry.

### G2-FINDING-IA-30 — Idempotency Is a Qualified Contract, Not a Bare Key
Idempotency evidence must declare semantic operation, provider/API, tenant/account/sandbox, parameter equivalence rules, validity window and persistence owner. A matching token outside that scope cannot prove duplicate suppression.

### G2-FINDING-IA-31 — Mutable Integration Definitions Require Expected-base or Semantic Ownership Preconditions
Subscriptions, filters, routes and transformation definitions are concurrent semantic configuration. Stale mutations must conflict/rebase or receive authorized resolution; last-writer-wins without ownership evidence can silently redirect or broaden automation.

### G2-FINDING-IA-32 — Connector Capability and Invocation Authority Are Independent Gates
A provider can technically support an operation that the effective user/Station/Role/Person may not invoke. `CAN_REALIZE` must never imply `MAY_ACT`, and service credentials cannot amplify semantic authority.

### G2-FINDING-IA-33 — Retry, Redrive/Replay, DLQ Repair, Reconciliation and Compensation Are Distinct Governed Transitions
These operations have different preconditions, side-effect risks, lineage and authority. They must not collapse into one generic retry command or inherit authorization merely because the original invocation was admitted.

### G2-FINDING-IA-34 — Provider Replacement Is a Dual-realization/Cutover Transition With Replay-position Disposition
Changing an integration provider may require coexistence, ordering/idempotency comparison, replay-position mapping and explicit cutover. Historical and in-flight runs remain bound to their original realization; unrepresentable position/state blocks or qualifies migration.

### G2-FINDING-IA-35 — Missing Integration Dependencies Must Propagate PARTIAL/INCONCLUSIVE Evidence
Absent schema, trust, authority, provider capability, correlation history, reconciliation access or remote postcondition evidence cannot be coerced to PASS. Dependent conclusions become PARTIAL/INCONCLUSIVE while independent facts remain separately reportable.

### G2-FINDING-IA-36 — Qualified Local Integration Closure Must Include Ambiguity and Authority Evidence, Not Only Connectors
Offline/self-hosted autonomy requires the semantic operation/profile, admitted binding, trust/configuration, effective authority inputs, correlation/idempotency history, retry/reconciliation rules and evidence dependencies needed for the operation. Local connector availability alone is not proof of safe autonomy.

## Capability candidates
- `G2-CAPABILITY-CANDIDATE-IA-QUALIFIED-EXTERNAL-EFFECT-DISPOSITION` — **CROSS_CUTTING / CONSOLIDATION_CANDIDATE**. Multi-representative evidence and Workflow cycle-5 evidence support merging into the shared ambiguous-outcome disposition primitive while retaining Integration ownership of external invocation evidence.
- `G2-CAPABILITY-CANDIDATE-IA-SCOPED-IDEMPOTENCY-CONTRACT-EVIDENCE` — **CROSS_CUTTING / CANDIDATE**. Candidate for shared request/event semantics; requires reconciliation with Data/Workflow/Notifications before promotion.
- `G2-CAPABILITY-CANDIDATE-IA-INTEGRATION-DEFINITION-OWNERSHIP-PRECONDITIONS` — **CROSS_CUTTING / CONSOLIDATION_CANDIDATE**. Aligns with UCA/PAM/UI concurrent mutation ownership; integration-specific route/subscription semantics remain capability-owned.
- `G2-CAPABILITY-CANDIDATE-IA-PROVIDER-DUAL-RUN-CUTOVER-REPLAY-DISPOSITION` — **CROSS_CUTTING / CANDIDATE**. Requires Provider/Lifecycle cross-check before any promotion.

No candidate is promoted in this round. Adaptive Governed Work Surfaces remains promoted and distinct.

## Value / risk / priority / next question
Value: very high — this boundary connects SB semantics to external systems. Risk: very high if provider delivery mechanics, service credentials or retries become semantic truth/authority. Priority: high. Next question after later synthesis: determine which external-effect disposition, scoped-idempotency, mutation-ownership and cutover primitives should be shared by UCA versus remain Integration specializations.