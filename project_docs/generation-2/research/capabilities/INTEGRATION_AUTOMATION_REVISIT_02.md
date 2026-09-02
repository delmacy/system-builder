# Generation 2 — Integration & Automation — Revisit 2 / Cycle 3

Status: cycle 3 revisit complete; material new findings; not saturated.

## Research question

How should System Builder preserve portable semantic-operation authority while integrations execute through connector credentials, webhooks, brokers, retries, chained automations and replaceable providers whose technical permissions, delivery guarantees and failure semantics may be broader or different from the initiating actor/Station/Role authority?

This revisit specifically tests the prior Integration & Automation model against Workflow & Durable Execution findings `G2-FINDING-WDE-17..22` and Adaptive Governed Work Surfaces findings `G2-FINDING-AGWS-01..15`.

## Representatives

1. **Apache Kafka / Kafka Connect 4.3** — connector-dependent exactly-once, worker/connector boundaries, error tolerance and dead-letter handling.
2. **Dapr Pub/Sub + Resiliency** — provider-neutral pub/sub API, explicit retry/dead-letter policies, component/app targeting and the risk of stacked retry ownership.
3. **Amazon EventBridge Pipes** — execution-role authority, source/enrichment/target invocation, partial-batch retry and synchronous versus fire-and-forget target behavior.
4. **Azure Logic Apps / managed connectors** — connection identity, managed identities, connector-scoped permissions, retry/concurrency/throttling interaction.
5. **Zapier Platform** — OAuth connection semantics, polling-trigger deduplication and REST-hook lifecycle.

These five representatives are sufficient for this pass because they span broker/connector, component abstraction, event pipe, workflow connector and SaaS automation models while exposing materially different identity/authority/retry boundaries.

## Evidence/source ledger

### Apache Kafka / Kafka Connect
- Kafka Connect 4.3 documents exactly-once support as **connector-dependent**. Correct worker properties are insufficient if a connector cannot participate in the required semantics.
- Connect separately exposes error retry timeout/delay and dead-letter queue configuration, demonstrating that connector execution failure/recovery policy is not the business operation identity.
- Exactly-once source support additionally requires distributed mode and cluster configuration, reinforcing that a guarantee is a realization/boundary property rather than an abstract operation promise.

Source of truth: Apache Kafka 4.3 Kafka Connect User Guide.

### Dapr Pub/Sub / Resiliency
- Dapr dead-letter topics are explicit subscription behavior; when configured, retry must be supplied separately through resiliency policy if retries are desired before dead-lettering.
- Resiliency policies target apps/components/actors and can add retry behavior on top of built-in service-invocation retry. Dapr explicitly warns that applied retry policies may be additional to built-in retries.
- Retry support can differ by protocol/operation; for example, streaming HTTP service invocation bypasses retries because the request body cannot safely be replayed.

Source of truth: Dapr current documentation, August–September 2026.

### Amazon EventBridge Pipes
- Pipes use a specified IAM execution role for source access and enrichment/target API calls. Required permissions vary with source/target and can include Secrets Manager, KMS and VPC permissions.
- Target invocation can be synchronous (`REQUEST_RESPONSE`) or asynchronous (`FIRE_AND_FORGET`). A successful fire-and-forget submission therefore does not constitute downstream business-effect proof.
- Partial batch failure handling for supported sources retries only failed remainder items, and the retry can re-run enrichment; this makes stable item/correlation identity and enrichment-attempt lineage necessary.

Source of truth: AWS EventBridge Pipes User Guide.

### Azure Logic Apps
- A connector connection can use Microsoft Entra OAuth or managed identity; the workflow runtime uses the selected identity and target-resource permissions at execution time.
- Microsoft documentation recommends separate Service Bus connections when send and receive require different permissions, showing that connector connection identity and operation authority can be narrowed independently.
- Trigger/action concurrency can interact with throttling and retry, including retry-throttling cycles that produce long delays.
- Existing OAuth connections may refresh access tokens over time; therefore connection validity/authority is lifecycle state, not a one-time authoring fact.

Source of truth: Microsoft Learn Logic Apps/connectors documentation, 2026.

### Zapier Platform
- Zapier OAuth v2 uses authorization-code flow in Platform UI and stores/uses access tokens for future API calls; optional refresh-token handling extends connection lifetime.
- Polling triggers are deduplicated by Zapier based on returned item identity, while REST Hooks establish per-Zap webhook subscriptions. Trigger deduplication is therefore a platform execution mechanism and must not be confused with business-operation idempotency.

Source of truth: Zapier Platform documentation.

## Source of truth

The portable source of truth remains the **semantic integration requirement + operation contract + effective authority requirement**. Connector credentials, OAuth grants, IAM execution roles, managed identities, webhook subscriptions, queue offsets and automation-platform node identities are realization data.

Proposed portable chain:

`SemanticOperation -> EffectiveAuthorityRequirement -> ProviderCapabilityRequirement -> Binding/Connection -> ConnectorInvocation -> Attempt -> ExternalEffect/Receipt -> OutcomeEvidence`

For event-driven entry:

`ExternalEvent -> TriggerReceipt -> Correlation/DedupDecision -> SemanticOperation -> ...`

No connector credential or execution role may independently promote the authority of the semantic operation.

## Identity

Keep distinct identities for:
- semantic operation and revision;
- initiating principal/context (`Enterprise/Station/Role/Person` where applicable);
- effective authority snapshot/revision;
- provider-capability requirement;
- binding/connection and its credential/identity realization;
- external event/trigger receipt;
- business correlation/idempotency key;
- connector invocation;
- retry/redelivery/replay attempt;
- downstream callback/receipt/effect;
- dead-letter/quarantine item;
- outcome evidence.

A connector's OAuth user, service principal or IAM execution role is **not** the same identity as the initiating actor and must not substitute for semantic authorization evidence.

## Lifecycle

`declare operation -> declare authority/provider requirements -> bind connection -> validate capability + authority -> activate -> receive/invoke -> correlate/deduplicate -> attempt -> observe effect -> retry/dead-letter/repair -> revalidate authority when required -> migrate/replace provider -> deprecate`

Connection lifecycle must account for credential rotation, token refresh/invalidation, permission revocation and provider capability revision.

## Versioning

Independent revisions include:
- semantic operation contract;
- authority/policy context;
- provider capability declaration;
- connector implementation;
- binding/connection configuration;
- credential/identity grant state;
- payload/event schema;
- retry/resiliency policy;
- deduplication/correlation rules;
- workflow/automation definition.

Evidence for a side effect should bind the relevant revisions or immutable references, not simply a workflow execution ID.

## Failure semantics

Distinguish at least:
- trigger/event rejected before semantic admission;
- duplicate event detected;
- event accepted but authority no longer valid;
- connection unavailable/expired/revoked;
- provider lacks required capability;
- credential has insufficient permission;
- credential has **broader** permission than semantically authorized;
- throttled/backpressured;
- retryable transport/provider failure;
- ambiguous remote effect;
- fire-and-forget accepted but downstream outcome unknown;
- callback missing, duplicate or mismatched;
- partial batch success;
- dead-letter/quarantine;
- replay/redrive rejected by policy;
- provider replacement incompatible with required delivery/effect guarantees.

The broader-credential case is not success: it is an authority-conformance condition that must be bounded by the semantic operation's effective authority.

## Extensibility

Connector/provider extensions may add protocols, auth schemes, delivery mechanisms and stronger guarantees, but must declare capabilities and remain behind semantic operation requirements. Custom connector/script escape hatches, if any, belong to privileged engineering surfaces, not ordinary AGWS Person-level composition.

## Provider boundaries

A provider binding has two orthogonal dimensions:
1. **technical capability/credential authority** — what the connector can technically call;
2. **semantic effective authority** — what this operation, actor, Station, Role and policy are allowed to cause.

Executable authority is the intersection, never the union:

`ExecutableAuthority = SemanticEffectiveAuthority ∩ BindingCredentialCapability ∩ ProviderActionPolicy`

Provider substitution must recompute this intersection and delivery/effect conformance before activation.

## Governance

Governance must constrain:
- allowed provider/action capabilities;
- allowed auth mode (user delegated, service account, managed identity, execution role);
- maximum connector permission scope;
- whether a service identity may act for a Person/Role operation;
- callback endpoints and correlation expectations;
- retry owner and retry budget;
- replay/redrive operator authority;
- dead-letter access and repair authority;
- schema compatibility policy;
- external-system data scopes;
- provider replacement authority;
- whether custom code/query/script connectors are permitted for a given authoring surface.

## Observability

Evidence should expose, with secret redaction:
- semantic operation + revision;
- initiating authority context and effective authority revision;
- provider/binding revision;
- authentication mode/credential principal identifier (never secret material);
- trigger receipt/correlation identity;
- invocation/attempt lineage;
- retry owner/reason/budget;
- throttling/backpressure state;
- downstream receipt/effect status;
- callback correlation;
- per-item outcomes for batches;
- dead-letter/quarantine transitions;
- provider replacement lineage.

Connector logs alone are insufficient for semantic-effect proof.

## Portability

Portability means the same semantic operation and authority requirement can be realized by different connector/provider bindings without changing business semantics. It does not imply identical auth models, token lifetimes, retry behavior, ordering, callback mechanisms, rate limits or exactly-once guarantees.

## Lock-in

Lock-in increases when:
- operation semantics encode connector action/node IDs;
- business authority implicitly equals a platform connection's permissions;
- deduplication depends on undocumented platform behavior;
- retry policy is hidden in both connector and workflow layers;
- callbacks correlate only by proprietary execution IDs;
- provider replacement requires rewriting process/UI semantics.

Lock-in decreases when semantic operation, authority requirement, provider-capability requirement, correlation/idempotency contract and evidence lineage remain portable.

## Product-specific mechanism vs universal primitive

Do not universalize:
- Kafka transactional IDs/offset implementation;
- Dapr resiliency YAML/component metadata;
- EventBridge execution-role JSON or pipe node IDs;
- Logic Apps `$connections` representation;
- Zapier auth/trigger/action implementation keys.

Universal primitives should express:
- semantic operation;
- effective authority requirement/snapshot;
- provider capability requirement;
- connection/binding realization;
- correlation/idempotency contract;
- connector invocation/attempt lineage;
- callback/effect receipt;
- scoped guarantee evidence;
- dead-letter/quarantine/repair transition.

## Convergent patterns

1. Connector credentials are explicit realization objects with lifecycle and scope.
2. Delivery/retry guarantees depend on provider + configuration + operation shape.
3. Platform-level deduplication does not equal business-effect idempotency.
4. Partial retry requires stable item identity and outcome evidence.
5. Retry may exist at multiple layers and must have explicit ownership/precedence.
6. Async acceptance does not prove downstream effect.
7. Connection health/credential validity can change after authoring.
8. Provider replacement can preserve semantic contract while changing authority realization and operational guarantees.

## Divergent patterns

- Kafka/Connect can participate in stronger transactional semantics when connector and boundary support them.
- Dapr intentionally abstracts components while exposing different retry applicability and potential stacked retries.
- EventBridge Pipes centralizes an IAM execution role for pipe calls and supports both synchronous and fire-and-forget target invocation.
- Logic Apps supports user OAuth and managed identities/connections whose target permissions can be scoped per connection.
- Zapier supplies platform trigger deduplication and OAuth connection lifecycle but does not make that equivalent to domain idempotency.

The divergence confirms that SB should not own a universal connector execution protocol or promise universal exactly-once semantics.

## Subcapabilities

- Semantic integration operation contracts.
- Provider/action capability requirements.
- Binding/connection lifecycle and validation.
- Credential-principal realization and authority attenuation.
- Trigger/event receipt and admission.
- Correlation/idempotency contract.
- Connector invocation/attempt lineage.
- Retry ownership/budget/backoff.
- Rate-limit/backpressure handling.
- Callback correlation.
- Partial-effect/batch outcome evidence.
- Dead-letter/quarantine/repair.
- Provider migration/replacement conformance.
- Integration provenance/observability/redaction.

## Comparison with fresh `main` — evidence only

A bounded default-branch code search for `bindingRef`, `external-service`, `integration`, `correlation`, `idempotency` and `retry` together returned no positive result in this run. This is **not evidence of repository-wide absence** and does not supersede prior dossier evidence describing declared HTTP integrations with explicit binding references. Full implementation truth remains reserved for Planning B repository archaeology.

No claim is made that current `main` already implements authority attenuation across connector credentials, callback correlation, external-effect receipts or provider-replacement authority conformance.

## Reconciliation hypotheses

- **KEEP / HARDEN** — explicit declared integrations and binding references where repository archaeology confirms them.
- **GENERALIZE** — semantic-operation authority requirement, trigger receipt/correlation, invocation-attempt-effect lineage and authority-conformance evidence.
- **PROVIDERIZE** — connector auth implementation, retries, transport, webhook mechanism, broker, hosted automation engine and provider-specific throttling.
- **INTEGRATE** — n8n/Zapier/Logic Apps/EventBridge/Dapr/Kafka-style systems behind operation/provider requirements rather than as semantic owners.
- **REPLACE** — any future path where connector credential scope implicitly becomes business authorization, if repository archaeology finds such coupling.
- **DEFER** — broad connector marketplace until product demand warrants it.
- **DO_NOT_BUILD** — universal exactly-once abstraction; universal connector runtime; Person-level arbitrary code/query/script connector escape hatch; automatic privilege elevation to match connector credentials.

## Repository-validation questions

1. Where does `main` currently decide whether an external operation is authorized, and is that decision independent of provider credential permissions?
2. Can a binding express the concrete credential principal and a safe capability scope without storing secrets in evidence?
3. Are user-delegated and service identities distinguishable in integration definitions/evidence?
4. Does any retry layer re-run an external call without preserving the original semantic operation/authority context?
5. Can callback/webhook receipts correlate to stable business operation identity rather than provider execution ID only?
6. Are external-event trigger deduplication and domain-operation idempotency separate concepts in current contracts?
7. Can active bindings advertise rate-limit, ordering, partial-success and delivery/effect guarantees?
8. Can provider replacement be rejected if its credential/capability scope or delivery semantics violate the operation requirement?
9. Are dead-letter replay and repair independently authorized operations?
10. Can AGWS personal/supervised automation invoke external providers while remaining bounded by effective `Station/Role` authority?

## Adaptive Governed Work Surfaces composition

AGWS owns the surface, personal intent and effective `Enterprise -> Station -> Role -> Person` context; Integration & Automation owns connector realization and external-effect delivery.

Required invariant:

`AGWS EffectiveAuthority ∩ Integration Action Policy ∩ Connector Credential Capability`

A service account with organization-wide technical access cannot grant a Person/Role operation organization-wide semantic access. Chaining from surface -> workflow -> connector -> external automation must carry/attenuate the semantic authority context; each hop may narrow it but no hop may widen it.

The nine AGWS proofs remain unchanged. This revisit particularly strengthens proofs (6) provider-bound action without page/provider coupling and (7) personal automation cannot exceed Station/Role authority.

## Symbiotic Proof

Use one semantic external action exposed from an AGWS surface and prove:
1. the page references a semantic operation/provider requirement, not connector implementation;
2. user-delegated connector realization works within the same operation contract;
3. service/managed-identity realization can replace it without widening semantic authority;
4. a connector credential deliberately broader than the Role is prevented from accessing out-of-scope data/action;
5. retry/redelivery preserves the original authority context and business idempotency identity;
6. a chained workflow/provider cannot widen authority;
7. async/fire-and-forget acceptance remains `UNKNOWN/PENDING` until effect evidence exists;
8. partial batch retry targets only failed stable item identities;
9. callback correlation rejects mismatched/duplicate receipts according to policy;
10. provider replacement revalidates capability, credential authority, delivery/effect guarantees and evidence requirements;
11. dead-letter replay requires explicit repair/replay authority;
12. all evidence is secret-redacted and revision-bound.

## Stable findings

### G2-FINDING-IA-17 — Connector Credential Capability Must Not Become Semantic Operation Authority
OAuth grants, service accounts, managed identities and IAM execution roles describe what a connector can technically do. The semantic operation may execute only within the intersection of that capability and the effective actor/Station/Role/policy authority. A broader connector credential must not widen the operation.

### G2-FINDING-IA-18 — Trigger Deduplication and Business-effect Idempotency Are Distinct Contracts
Platform trigger deduplication (for example polling-item deduplication) prevents some duplicate workflow starts, but cannot prove that a semantic external effect is idempotent across retries, provider substitution, callbacks or replay. Both identities/contracts must remain explicit.

### G2-FINDING-IA-19 — Chained Integration Authority Must Be Monotonically Attenuated Across Hops
Surface -> workflow -> connector -> external automation chains must carry authority context such that each hop may preserve or narrow authority but never widen it. Delegation to a service identity or provider does not authorize capabilities absent from the originating semantic authority.

### G2-FINDING-IA-20 — Connection Validity Is Revisioned Authority Evidence, Not Static Configuration
OAuth refresh, permission revocation, managed-identity role assignment and connector capability changes can alter a connection after authoring. Activation and privileged continuation require appropriate freshness/revalidation evidence for the binding's usable authority.

### G2-FINDING-IA-21 — Async Connector Acceptance and Callback Completion Require Distinct Outcome States
Fire-and-forget submission, webhook subscription/receipt and downstream callback are separate lifecycle facts. Local acceptance cannot be reported as proven downstream semantic effect; callback correlation and effect evidence must be explicit and independently validated.

### G2-FINDING-IA-22 — Provider Replacement Must Revalidate Both Operational Guarantees and Authority Realization
A replacement connector may satisfy the same operation schema while changing credential principal, permission scope, retry owner, ordering, throttling, callback and effect guarantees. Migration acceptance must validate both semantic compatibility and authority/operational conformance before activation.

## Capability candidates

### New this revisit
- `G2-CAPABILITY-CANDIDATE-CONNECTOR-CREDENTIAL-SEMANTIC-AUTHORITY-INTERSECTION` — **CROSS_CUTTING / CANDIDATE**. Reusable proof that technical credential capability cannot widen semantic operation authority; promotion requires convergence with Authorization, Provider/Binding and AGWS.
- `G2-CAPABILITY-CANDIDATE-MONOTONIC-AUTHORITY-ATTENUATION-ACROSS-AUTOMATION-HOPS` — **CROSS_CUTTING / CANDIDATE**. Reusable delegation/chain invariant; promotion requires convergence with Workflow and AI delegated-authority findings.
- `G2-CAPABILITY-CANDIDATE-ASYNC-EFFECT-CALLBACK-CORRELATION-EVIDENCE` — **CROSS_CUTTING / CANDIDATE**. Distinct submission/callback/effect proof primitive; promotion requires convergence with Observability, Notifications/Events and Provider findings.

No candidate is promoted in this revisit.

## Value / risk / priority / next question

**Value:** critical. Integration is where technical credentials often exceed the authority of the initiating user/process, and where hidden retry/callback semantics can invalidate governance claims.

**Risk:** critical if a surface-bounded operation can inherit organization-wide connector privilege or if asynchronous acceptance is mistaken for proven external effect.

**Priority:** critical for Authorization, Provider/Binding, Workflow, AGWS and later Product Proof acceptance.

**Revisit result:** six material architectural findings; `consecutive_no_material_finding = 0`; capability remains **NOT SATURATED**.

**Next research question:** Identity / Authentication / Federation — revisit cycle 3. Test principal/session/issuer/federation identity against connector delegated/service identities, effective authority and Station/Role boundaries: subject vs actor vs credential principal; OAuth/OIDC token audience/scope and token exchange/delegation; federation metadata/key rotation; session/assurance freshness; impersonation/on-behalf-of; service/workload identity; provider replacement; revocation and long-lived execution revalidation; and prove that authentication/federation evidence never silently becomes authorization or Station capability exposure.