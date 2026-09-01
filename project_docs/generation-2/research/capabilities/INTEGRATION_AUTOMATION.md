# Generation 2 — Integration & Automation

Status: first deep pass; not saturated.

## Research question

What should System Builder treat as universal integration/automation primitives, versus product-specific connector/workflow mechanisms, so that generated systems can bind to external services without making a specific automation platform the semantic source of truth?

## Representatives

1. **n8n** — representative of self-hostable visual automation, reusable sub-workflows, execution history, Git-backed environments and explicit error workflows.
2. **MuleSoft Anypoint Platform** — representative of enterprise integration, managed APIs/connectors, policy enforcement, dependency visualization and connector/API observability.
3. **Zapier Platform** — representative of a large integration ecosystem with explicit Authentication / Trigger / Action contracts, UI/CLI authoring and versioned integration publication.
4. **Make** — representative of module-oriented automation with typed module categories, connection validation, explicit error classes and webhook/request-response composition.
5. **Apache Camel** — additional engineering reference because its component/endpoint/EIP model exposes reusable integration primitives, idempotency and transport-specific error semantics without requiring a hosted control plane.

## Evidence/source ledger

- n8n separates workflow definition from execution records; executions have statuses and may be retried with the original workflow or the currently saved workflow. Its error workflow mechanism invokes a separate workflow on failure. Sub-workflows are explicit reusable execution units. Git-backed environments treat Git as source of truth for promoted workflow artifacts and recommend one-directional promotion. Queue mode separates trigger/control-plane intake from worker execution. Sources: n8n official docs on executions, error workflows, sub-workflows, source control/environments and queue mode.
- MuleSoft separates deployable apps/APIs from connectors, gateway policies and monitoring. Connector metrics expose request count, response time and failures; API dashboards expose request volume, 4xx/5xx, policy violations and latency. API proxies can govern non-Mule backends, demonstrating that governance can wrap an externally owned implementation. Sources: MuleSoft official Monitoring, API dashboards, Visualizer, policies and proxy docs.
- Zapier models integrations around Authentication, Triggers and Actions. Integration behavior can be authored declaratively in Form Mode or through bounded JavaScript Code Mode. Published integrations have explicit version lifecycle; cloning/versioning permits change without mutating the active predecessor version. Sources: Zapier official Platform quickstart, authentication, Form/Code Mode and version management docs.
- Make defines six module categories: Action, Search, polling Trigger, instant/webhook Trigger, Universal and Responder. Connections should validate credentials through a stable endpoint. Error directives map provider-specific responses into typed platform errors, including rate-limit, connection, invalid-configuration, invalid-token and data errors. Make explicitly warns against multi-call batch actions when partial success cannot be represented safely. Sources: Make Developer Hub modules, connections and error-handling docs.
- Apache Camel exposes transport/service integrations through components and endpoints, while Enterprise Integration Patterns remain above individual transports. Its Idempotent Consumer uses a correlation key/repository to detect duplicate messages; component error behavior can be bridged into route-level error handling where the underlying component supports it. Sources: Apache Camel official component and EIP docs.

## Capability/primitives extracted

### Source of truth

The durable semantic source should be an integration contract describing **what external capability is required and which operation is invoked**, not the UI node, connector implementation, URL, credential value or hosted automation scenario. Product platforms repeatedly separate integration definition from connections/credentials and from execution evidence.

Candidate universal shape:

`IntegrationRequirement -> OperationContract -> Provider/Connector -> Connection/Binding -> Invocation -> ExecutionEvidence`

### Identity

At least four identities should remain distinct:

- integration/connector identity;
- operation identity (trigger/action/search/request/etc.);
- connection/binding identity;
- invocation/execution identity.

Conflating these makes provider replacement, credential rotation and execution audit ambiguous.

### Lifecycle

Recurring lifecycle layers are:

`define connector/integration -> configure connection -> validate -> publish/version -> bind/use -> execute -> observe -> retry/repair/deprecate`.

n8n adds promotion between environments; Zapier exposes integration-version lifecycle; Make shows connection validation and published-app restrictions; MuleSoft independently governs running APIs/connectors via policies and monitoring.

### Versioning

Integration definition version and provider/API version are not the same. A stable operation contract can outlive connector implementation versions; active workflows may need to retain association with the definition/version that produced an invocation. Platform-specific migration/version mechanisms should not become the SB ontology.

### Failure semantics

Failure is multidimensional and should not collapse to `success|error`. Evidence supports at least:

- provider/service error;
- authentication/connection failure;
- configuration incompatibility;
- validation/data error;
- rate limit/backpressure;
- transient transport failure;
- partial side effect/partial success;
- duplicate delivery/idempotency conflict;
- policy rejection.

Make's typed error classes and warning against unsupported partial-success batching are especially strong evidence that operation boundaries should align with independently recoverable side effects.

### Extensibility

A mature integration system needs both governed typed operations and a bounded escape hatch. Zapier Form Mode vs Code Mode and Make typed modules vs Universal module demonstrate this recurring pattern. The escape hatch must not silently acquire broader credential/network authority than the declared integration.

### Provider boundaries

Connection/credential ownership is separate from operation semantics. Provider-specific URLs, tokens, retry quirks and connector SDK implementation belong behind the binding/provider boundary. A proxy or adapter may govern an externally owned backend without transferring ownership, as MuleSoft proxies demonstrate.

### Governance

Important governance primitives include publication/version status, connection validation, allowed operations, credential scope, environment promotion, policy attachment, operator permissions and auditability of changes. n8n's one-direction source-control guidance is evidence that promotion authority and merge semantics matter independently of workflow execution semantics.

### Observability

Invocation evidence should include stable integration/operation/provider/binding references, timing, outcome/error class and correlation identity while supporting data redaction. MuleSoft connector/API metrics and n8n execution metadata demonstrate observability at both connector and workflow levels.

### Portability

Portable automation requires that the semantic operation and data contract survive provider or orchestration replacement. Exportable workflow/config artifacts improve portability but do not remove dependency on platform-specific nodes, SDKs, error models or execution semantics.

### Lock-in

Lock-in rises when business semantics are encoded directly in product node types, proprietary expressions, provider-specific retry behavior, hidden credentials, hosted-only execution history or control-plane-only state. It falls when operations, bindings, failure classes and evidence remain explicit and provider-neutral.

## Product-specific mechanisms that must not be copied automatically

- n8n node taxonomy, workflow JSON shape, Git promotion rules, queue implementation or pricing/execution-count semantics.
- MuleSoft API-led product structure, Exchange packaging, specific proxy/runtime deployment model, subscription-tier monitoring features or Anypoint policy catalog.
- Zapier Trigger/Action UX vocabulary as a universal ontology, Zap-specific JavaScript runtime, clone/version UI semantics or Zap execution model.
- Make module JSON directives, IML language, exact error-class list, scenario scheduler semantics or Universal-module approval rules.
- Camel endpoint URI syntax, component registry or individual EIP implementation classes.

These are valuable evidence for primitives, not templates to reproduce.

## Recurring patterns

1. **Operation contract precedes invocation.** Mature platforms name and type executable integration surfaces before execution.
2. **Connection is a first-class resource separate from the connector.** The same connector can be used with multiple authenticated accounts/endpoints.
3. **Connection health/validation is lifecycle, not just configuration parsing.** Make and Zapier both validate credentials against live endpoints.
4. **Trigger/input and action/output are distinct interaction directions but share a common provider boundary.**
5. **Typed common path + bounded escape hatch** recurs across Zapier and Make and is compatible with Camel's generic endpoint flexibility.
6. **Failure classes belong above raw HTTP/status exceptions.** Recovery decisions depend on whether the failure is auth, rate-limit, data, policy or transient transport.
7. **Partial side effects require explicit semantics.** A compound operation cannot safely claim atomicity merely because the automation UI shows one node.
8. **Execution evidence is separate from workflow/integration definition.** Retry against original vs current definitions makes this distinction operationally material.
9. **Observability needs connector/operation dimensions.** Aggregate workflow success is insufficient to diagnose an external-provider boundary.
10. **Governance can wrap externally owned implementations.** Providerization need not imply provider ownership.

## Conceptual comparison with System Builder

Fresh-main repository evidence is sufficient only for a bounded comparison. Existing P13 material describes declared HTTP integrations using explicit method/path plus `bindingRef`, resolving an `external-service` EnvironmentProfile binding at activation and rejecting unknown integrations, non-relative paths and missing/incompatible bindings. The same material explicitly states that this bounded executor is **not** a provider-specific connector framework. This is directionally aligned with the extracted separation `declared integration -> binding -> activation/invocation`, but it does not establish that SB already has a universal connector/operation model, typed connection health, portable failure taxonomy or replaceable automation provider abstraction. Those remain repository-validation questions for Planning B.

## Reconciliation hypotheses (not implementation authority)

- **KEEP / HARDEN** — explicit declared integration + `bindingRef` boundary if current implementation remains deterministic and secret-safe.
- **GENERALIZE** — integration identity, operation contract, binding/connection identity and execution evidence as distinct concepts if repo archaeology confirms repeated local variants.
- **PROVIDERIZE** — connector/runtime implementation and provider-specific invocation behavior where multiple providers are economically justified.
- **INTEGRATE** — standards/contract projections and external automation engines only behind declared bindings.
- **DEFER** — broad marketplace/connector SDK until actual product requirements justify the operational burden.
- **DO NOT BUILD** — cloning n8n/Zapier/Make visual automation semantics as a second workflow authority inside SB.

## Repository gaps/questions before deciding

1. Is `integrations[].contract` a typed semantic `ContractRef` or an opaque string today?
2. Does one universal `Binding` model cover integrations, storage, identity and other external services, or are there parallel families?
3. Is connection health/validation represented independently from static binding compatibility?
4. Are credentials/secret refs bound without leaking resolved values into durable evidence?
5. Does runtime evidence identify integration, operation, binding/provider and invocation distinctly?
6. Are retries/idempotency owned by workflow/runtime, integration provider or both, with explicit precedence?
7. Can an integration definition be versioned without mutating in-flight/existing executions?
8. Is there a typed failure taxonomy above transport-specific errors?
9. Can an external automation engine fulfill a declared operation without becoming source of truth for business semantics?
10. Which Station types, if any, should expose integration authoring, provider administration, credentials or execution recovery, and can those surfaces be physically absent rather than RBAC-hidden?

## Possible Symbiotic Proof

A strong future proof can use one business-level integration requirement and demonstrate:

1. **Native path** — SB-generated runtime invokes a declared operation through its native HTTP/external-service binding.
2. **External provider path** — the same semantic operation is fulfilled through an external automation/integration provider adapter.
3. **Replaceability** — swap provider/binding without rewriting the business/process definition; only declared compatibility/binding metadata changes.
4. **Portability** — export the operation/data contract independently of provider credentials, endpoint URLs and automation-platform node IDs.
5. **Governance** — version, provider/binding identity, connection validation/health, policy and operator mutation are evidenced.
6. **Runtime autonomy** — the generated system can continue operating without the Builder control plane after activation, subject only to the explicitly selected external provider dependency.
7. **Failure proof** — auth expiry, rate limit, incompatible binding, duplicate request and provider outage produce deterministic typed evidence without credential leakage.

## Stable findings

- **G2-FINDING-IA-01 — Integration, Connection and Invocation Identity Must Be Separate.** Connector identity, authenticated binding and individual execution are different lifecycle objects.
- **G2-FINDING-IA-02 — Operation Contract Is the Portable Integration Surface.** Provider node/action implementations should fulfill a stable operation/data contract rather than own business semantics.
- **G2-FINDING-IA-03 — Connection Validation Is Runtime Lifecycle Evidence.** A syntactically valid credential/configuration is not enough; live compatibility/health should be representable separately.
- **G2-FINDING-IA-04 — Typed Common Path Plus Bounded Escape Hatch.** Governed typed operations should cover normal integrations while arbitrary/custom calls remain explicit higher-risk extensions.
- **G2-FINDING-IA-05 — Failure Taxonomy Must Outlive Transport Status Codes.** Auth, configuration, rate-limit, data, policy, transient transport and duplicate/partial-side-effect failures drive different recovery behavior.
- **G2-FINDING-IA-06 — Side-Effect Boundary Determines Recoverability.** Operations containing multiple externally visible effects cannot assume atomicity; partial-success semantics must be explicit.
- **G2-FINDING-IA-07 — Retry Requires Definition and Side-Effect Context.** Retrying with original/current definition or against non-idempotent providers is materially different and must be evidenced.
- **G2-FINDING-IA-08 — Connector-Level Observability Is a First-Class Dimension.** Integration evidence needs operation/provider/binding dimensions, not workflow status alone.
- **G2-FINDING-IA-09 — Governance Can Wrap External Ownership.** Policy/proxy/adapter layers may control invocation while the backend and provider remain externally owned.
- **G2-FINDING-IA-10 — Automation Platform Must Not Become Business-Semantic Authority.** n8n/Zapier/Make/Mule/Camel mechanisms should remain provider or projection concerns when used with SB.

## Candidate capabilities discovered

- `G2-CAPABILITY-CANDIDATE-CONNECTION-VALIDATION-HEALTH` — CROSS_CUTTING; live validation/health of an external binding distinct from static compatibility and observability.
- `G2-CAPABILITY-CANDIDATE-INTEGRATION-OPERATION-CONTRACT` — CROSS_CUTTING; stable typed operation surface between semantic requirement and connector/provider implementation.
- `G2-CAPABILITY-CANDIDATE-SIDE-EFFECT-SEMANTICS` — CROSS_CUTTING; explicit atomicity/idempotency/partial-success properties across integrations, workflow recovery and distributed execution.

No candidate is promoted in this pass.

## Synthesis

**Value to SB:** very high. Integration is where portability, secrets, provider abstraction, workflow recovery and external ownership meet; mistakes here create hard lock-in quickly.

**Adoption risk:** medium-to-high. Generalizing too early into a huge connector SDK would recreate an integration platform inside SB; under-modeling connection identity/failure/evidence would make provider replacement unreliable.

**Investigation priority:** critical for Provider/Binding, Secrets, Lifecycle, Workflow recovery and runtime autonomy planning.

**Next research question:** Identity / Authentication / Federation — determine whether identity-provider connections, issuer/tenant identity, session/token lifecycle and federation metadata reinforce the same separation between semantic requirement, provider, connection/binding, health and evidence.