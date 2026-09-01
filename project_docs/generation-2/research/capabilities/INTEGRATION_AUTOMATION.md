# Generation 2 — Integration & Automation

Status: revisit cycle 2 pass 1 complete; not saturated.

## Research question

What should System Builder treat as universal integration/automation primitives, versus product-specific connector, transport and orchestration mechanisms, so generated systems can bind external services while retaining portable business semantics, explicit side-effect guarantees and provider-replaceable execution?

## Representatives

### First deep pass retained
1. **n8n** — self-hostable visual automation, reusable sub-workflows, execution history, environments and error workflows.
2. **MuleSoft Anypoint Platform** — enterprise integration, connectors, API governance, policies and observability.
3. **Zapier Platform** — Authentication / Trigger / Action contracts and versioned integration publication.
4. **Make** — typed modules, connection validation, explicit error classes and partial-success constraints.
5. **Apache Camel** — component/endpoint/EIP model, idempotent consumer and transport-specific failure behavior.

### Revisit cycle 2
6. **Apache Kafka / Kafka Connect** — boundary-qualified idempotence, transactions and connector-dependent exactly-once semantics.
7. **Dapr Pub/Sub** — component-neutral at-least-once delivery, dead-letter topics, transactional outbox and provider-specific retry ownership differences.
8. **AWS EventBridge Pipes** — source/enrichment/target execution, partial-batch failure, checkpointing, retries and immutable source constraints.
9. **Azure Logic Apps** — action/trigger retry policy, connector-specific throttling and concurrency behavior.

## Evidence/source ledger

### Retained first-pass evidence
- n8n separates workflow definitions from execution records and can retry against original/current definitions; error workflows and sub-workflows are explicit execution units.
- MuleSoft separates deployable apps/APIs from connectors, policies and monitoring; proxies can govern externally owned backends.
- Zapier separates authentication, triggers/actions and published integration versions.
- Make separates module categories, connection validation and typed failures and warns against compound batch actions when partial success cannot be represented safely.
- Apache Camel separates transport/service components and endpoints from higher-level EIPs; idempotency depends on explicit correlation keys/repositories.

### Revisit evidence
- **Kafka Streams** documents exactly-once processing only because Kafka controls input offsets, state-store updates and output-topic writes atomically inside the Kafka boundary. Kafka documentation explicitly contrasts this with external systems where side effects are outside that transaction.
- **Kafka Connect** states that exactly-once capability is connector-dependent: worker configuration is insufficient if the connector or destination cannot participate in the required semantics.
- **Dapr Pub/Sub** provides an at-least-once contract across pub/sub components and offers dead-letter topics and transactional outbox, but provider components may differ in where retry is owned. RabbitMQ-style broker requeue can redeliver to another consumer, while Dapr resiliency can retry from the same sidecar to the same app instance.
- **EventBridge Pipes** treats each event/batch traversing a pipe as an execution. For supported sources/targets, partial-batch failure explicitly identifies failed item IDs and retries only the remainder; enrichment may be re-invoked on retry. Stream checkpoint behavior also depends on whether the batch is a complete or partial success.
- **EventBridge stream-source configuration** exposes a migration constraint: some pipe sources cannot simply be replaced in place, so apparently equivalent provider transitions may require replacement/recreation rather than mutation.
- **Azure Logic Apps** scopes retry to triggers/actions that support it and to selected transient conditions such as 408, 429, 5xx and connectivity failures; connector throttling limits remain connector-specific. Concurrency settings can themselves create throttling and long waits.

## Capability/primitives extracted

### Source of truth
The portable semantic source should remain the integration requirement and operation/data contract, not a broker topic, connector node, workflow canvas, URL, credential, queue, retry policy or hosted execution graph.

Candidate universal chain:

`IntegrationRequirement -> OperationContract -> ProviderCapability -> Binding/Connection -> Delivery/Invocation Attempt -> External Effect -> Outcome Evidence`

A delivery attempt and the external effect it seeks to cause must not be collapsed into one object.

### Identity
Distinct identities are required for:
- integration requirement;
- operation contract/revision;
- provider/connector capability;
- binding/connection;
- correlation/idempotency identity;
- delivery/invocation attempt;
- externally visible effect or provider receipt where observable;
- retry/redelivery attempt;
- outcome/evidence record.

Transport message IDs are not automatically business correlation IDs, and retry attempt identity is not the same as operation identity.

### Lifecycle
Recurring lifecycle:

`declare -> bind -> validate -> activate -> deliver/invoke -> observe effect -> retry/redeliver/repair -> migrate/replace provider -> deprecate`

Provider replacement belongs to migration lifecycle because delivery, checkpointing, ordering, retry and failure semantics can change even when the semantic operation contract remains compatible.

### Versioning
Operation-contract revision, connector/provider revision, transport protocol version, binding revision and retry/resiliency policy revision are independent. Evidence must identify the exercised revisions when making compatibility or guarantee claims.

### Failure semantics
Failure must distinguish at least:
- pre-delivery rejection;
- authentication/configuration failure;
- rate limit/backpressure;
- transient transport failure;
- ambiguous delivery where remote effect is unknown;
- provider-accepted but downstream-failed effect;
- partial batch success;
- duplicate/redelivery;
- policy rejection;
- dead-letter/quarantine;
- irrecoverable provider/source incompatibility.

The ambiguous-delivery state is architecturally important: retrying may duplicate an effect unless the operation has a usable idempotency contract.

### Extensibility
Typed operations remain the normal path; custom calls remain bounded escape hatches. A new provider may advertise stronger or weaker guarantees, but it must not redefine the business operation semantics.

### Provider boundaries
Guarantees are properties of a **boundary plus configuration**, not merely of an abstract provider name. Kafka exactly-once depends on a controlled transactional boundary; Dapr can expose a common at-least-once API while concrete component retry behavior differs; Logic Apps retry support varies by trigger/action/connector.

### Governance
Governance must be able to constrain:
- allowed providers and bindings;
- allowed retry owner/policy;
- idempotency/correlation requirements;
- dead-letter/quarantine behavior;
- batch/partial-success support;
- migration/provider-replacement authority;
- operator replay/redrive authority.

### Observability
Evidence should identify the semantic operation, provider/binding, correlation identity, attempt lineage, provider receipt/effect status when available, per-item batch outcomes, retry owner, retry count, failure class and exercised revisions. Logs alone are not sufficient to prove an external side effect.

### Portability
Portability means the operation contract and business correlation survive connector, broker or automation-engine replacement. It does **not** mean retry, ordering, checkpoint, batching or exactly-once semantics are identical across providers.

### Lock-in
Lock-in grows when business correctness depends on undocumented provider retries, proprietary checkpoint state, canvas node IDs, hidden batching behavior or an automation platform's internal execution identity. It falls when operation, correlation/idempotency contract, binding, attempt lineage and effect evidence remain explicit.

## Product-specific mechanism vs universal primitive

Do not universalize Kafka transactional IDs, Dapr component metadata, EventBridge pipe checkpoint formats, Logic Apps retry JSON, n8n execution IDs, Mule policies, Zapier action vocabulary, Make directives or Camel endpoint URIs.

Universal primitives should instead capture semantic operation, binding/provider capability, scoped delivery/effect guarantee, correlation/idempotency contract, attempt lineage, partial-effect outcome and evidence.

## Convergent and divergent patterns

### Convergent
1. Delivery guarantees are scoped, not global.
2. Retry requires explicit failure classification and side-effect semantics.
3. Correlation/idempotency is independent from transport-generated message identity.
4. Partial success needs item-level evidence before selective retry is safe.
5. Provider replacement can preserve semantic compatibility while changing operational guarantees.
6. External-effect evidence is distinct from scheduler/workflow success.
7. Retry/redelivery ownership materially affects recovery behavior.

### Divergent
- Kafka can provide strong atomicity inside a tightly controlled Kafka transaction boundary; external systems require cooperation.
- Dapr presents a common pub/sub contract while concrete brokers/components retain different redelivery mechanics.
- EventBridge provides item-level partial-batch retry for selected source/target combinations and may re-run enrichment.
- Logic Apps retry/concurrency behavior depends on connector/action capabilities and service limits.

The divergence is evidence against a universal execution engine or universal exactly-once promise.

## Subcapabilities
- Integration requirement and operation contract.
- Provider/connector capability declaration.
- Connection/binding lifecycle and health.
- Correlation/idempotency contract.
- Delivery/effect guarantee qualification.
- Attempt/retry/redelivery lineage.
- Partial-batch/partial-effect outcome evidence.
- Dead-letter/quarantine and operator repair.
- Provider migration/replacement.
- Integration observability and redaction.

## Comparison with fresh `main` — evidence only

Repository code search in this run did not return stronger fresh-main implementation evidence than the prior dossier's bounded P13 evidence. The retained evidence therefore remains the safe comparison: SB has described explicit declared HTTP integrations with `bindingRef` and an `external-service` environment binding, while explicitly not claiming a universal connector framework. No claim is made here that fresh `main` already implements correlation/idempotency contracts, partial-effect evidence, connector-qualified delivery guarantees or provider-replacement migration semantics. Those remain Planning-B archaeology questions.

## Reconciliation hypotheses
- **KEEP / HARDEN** — declared integration plus explicit binding boundary where repository truth confirms it.
- **GENERALIZE** — correlation/idempotency identity, attempt lineage, typed external-effect outcome and scoped guarantee evidence if repeated local variants exist.
- **PROVIDERIZE** — connector, broker, automation-engine, retry/checkpoint and transport-specific behavior.
- **INTEGRATE** — Kafka/Dapr/EventBridge/Logic Apps/n8n-style systems only as external providers behind portable operation contracts.
- **DEFER** — broad connector marketplace/SDK until product economics justify it.
- **DO_NOT_BUILD** — universal exactly-once abstraction or a second business workflow authority hidden inside the integration plane.

## Repository-validation questions
1. Does current SB evidence distinguish invocation attempt from externally visible effect/receipt?
2. Is there a durable business correlation/idempotency identity independent from transport request/message IDs?
3. Where is retry authority owned today: workflow runtime, integration executor, provider, or multiple layers?
4. Can active bindings declare delivery/ordering/idempotency/partial-success capabilities?
5. Is ambiguous delivery represented separately from known failure and known success?
6. Can batch operations represent per-item outcome before retry?
7. Does provider replacement create explicit migration/lineage evidence?
8. Can external provider evidence be trusted/qualified by producer and freshness?
9. Do resolved secrets stay absent from invocation/effect evidence?
10. Can generated runtimes continue after Builder control-plane loss without losing operation/binding semantics?

## Symbiotic Proof
Use one semantic operation with stable request/result schema and business correlation identity, then demonstrate:
1. native HTTP/provider execution;
2. an external automation or messaging provider execution;
3. provider replacement without rewriting process/business semantics;
4. an at-least-once provider producing duplicate delivery while idempotency prevents duplicate business effect;
5. an ambiguous transport failure resolved through receipt/effect evidence or explicit operator decision;
6. a partial batch where only failed items are retried;
7. retry ownership and lineage visible in evidence;
8. provider-specific guarantee differences represented without changing the operation contract;
9. no credential leakage;
10. runtime autonomy after activation.

## Stable findings

### First pass
- **G2-FINDING-IA-01 — Integration, Connection and Invocation Identity Must Be Separate.**
- **G2-FINDING-IA-02 — Operation Contract Is the Portable Integration Surface.**
- **G2-FINDING-IA-03 — Connection Validation Is Runtime Lifecycle Evidence.**
- **G2-FINDING-IA-04 — Typed Common Path Plus Bounded Escape Hatch.**
- **G2-FINDING-IA-05 — Failure Taxonomy Must Outlive Transport Status Codes.**
- **G2-FINDING-IA-06 — Side-Effect Boundary Determines Recoverability.**
- **G2-FINDING-IA-07 — Retry Requires Definition and Side-Effect Context.**
- **G2-FINDING-IA-08 — Connector-Level Observability Is a First-Class Dimension.**
- **G2-FINDING-IA-09 — Governance Can Wrap External Ownership.**
- **G2-FINDING-IA-10 — Automation Platform Must Not Become Business-Semantic Authority.**

### Revisit cycle 2
- **G2-FINDING-IA-11 — Delivery/Effect Guarantee Is Boundary-Qualified.** `Exactly-once`, `at-least-once`, ordering and idempotence claims are valid only for the boundary, provider capabilities and configuration that actually control the effect; they are not properties of the semantic operation in isolation.
- **G2-FINDING-IA-12 — Business Correlation and Idempotency Identity Must Outlive Transport Identity.** Provider-generated request/message IDs can change across retries and provider replacement, so business correlation/idempotency identity must be explicit and portable.
- **G2-FINDING-IA-13 — Partial Batch Retry Requires Per-item Outcome Evidence.** Selective retry is safe only when success/failure can be attributed to stable item identities; aggregate batch failure is insufficient.
- **G2-FINDING-IA-14 — Retry Ownership Is an Architectural Contract.** Broker redelivery, integration-runtime retry and application retry have different placement, target selection and duplicate-risk semantics and must not stack implicitly.
- **G2-FINDING-IA-15 — Provider Replacement Can Change Operational Semantics Without Breaking the Operation Contract.** Semantic compatibility does not prove equivalent ordering, retry, checkpointing, batching or effect guarantees; migration acceptance must compare these claims explicitly.
- **G2-FINDING-IA-16 — Scheduler Success Is Not External-effect Proof.** Workflow/pipe/action completion demonstrates local orchestration outcome; external side-effect proof requires provider receipt, downstream evidence or an explicit `UNKNOWN/AMBIGUOUS` outcome.

## Capability candidates

### Retained
- `G2-CAPABILITY-CANDIDATE-CONNECTION-VALIDATION-HEALTH` — CROSS_CUTTING.
- `G2-CAPABILITY-CANDIDATE-INTEGRATION-OPERATION-CONTRACT` — CROSS_CUTTING.
- `G2-CAPABILITY-CANDIDATE-SIDE-EFFECT-SEMANTICS` — CROSS_CUTTING.
- `G2-CAPABILITY-CANDIDATE-EFFECT-GUARANTEE-QUALIFICATION` — CROSS_CUTTING; strengthened by Kafka/Dapr evidence in this revisit.

### New this revisit
- `G2-CAPABILITY-CANDIDATE-IDEMPOTENCY-CORRELATION-CONTRACT` — CROSS_CUTTING; stable business correlation/idempotency semantics independent from transport identity.
- `G2-CAPABILITY-CANDIDATE-PARTIAL-EFFECT-OUTCOME-EVIDENCE` — CROSS_CUTTING; item-level outcome and retry evidence for partial batches/compound effects.
- `G2-CAPABILITY-CANDIDATE-RETRY-OWNERSHIP-DECLARATION` — CROSS_CUTTING; explicit ownership/precedence across provider, broker, integration runtime and application retries.

No candidate is promoted in this revisit.

## Value / risk / priority / next question

**Value:** very high; integration boundaries are where portability claims most easily become false when delivery semantics are underspecified.

**Risk:** high if SB advertises stronger delivery guarantees than a provider boundary can prove, or stacks retry layers without explicit ownership.

**Priority:** critical for later Provider/Binding, Workflow, Lifecycle, Observability and Product Proof phases.

**Revisit result:** material new findings were produced; `consecutive_no_material_finding = 0`; capability remains **NOT SATURATED**.

**Next research question:** Identity / Authentication / Federation — revisit unresolved provider/issuer/tenant identity, federation metadata lifecycle, assurance/session evidence, provider replacement and binding-health semantics without repeating first-pass summaries.