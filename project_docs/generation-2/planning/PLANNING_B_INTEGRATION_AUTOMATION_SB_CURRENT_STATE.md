# Generation 2 — Planning B: Integration & Automation — SB Current State Reconciliation

Status: COMPLETE_FOR_CAPABILITY — CURRENT_STATE_RECONCILED / PASS_FOR_CAPABILITY
Capability: Integration & Automation
Fresh-main anchor: `d8760c7f08757bb164a758ae0c3f0a4a1752464b`
Authority inputs: fresh `main`, `PLANNING_A_INTEGRATION_AUTOMATION_BOUNDARIES.md`, accepted repository architecture/contracts.

This document is repository archaeology only. It does not alter product code, invent target architecture, materialize WBS/TASKs, execute Construction, or enter Planning C.

## 1. Strong current predecessor: AI provider invocation seam

Current SB contains a concrete provider-neutral external invocation predecessor in `packages/contracts/ai-gateway`. `ModelRequest` and `ModelResponse` are explicit versioned contracts with canonical `requestId` correlation, while `ModelProviderAdapter` exposes an injected `invoke(request)` boundary. `invokeModelProvider` normalizes both sides and rejects a response whose `requestId` does not match the invoked request.

Disposition: **KEEP + HARDEN + GENERALIZE only where evidence supports reusable integration semantics**.

This is a useful external-interaction seam, but it is model-provider specific. Current main does not evidence a generic Integration & Automation contract covering arbitrary external operation identity, connector identity, trigger/subscription identity, automation invocation identity, attempt identity or external-effect state.

## 2. Governed pre-send actuation boundary

`governed-invocation.ts` composes execution-governance evaluation, optional pre-send boundary evaluation, optional knowledge enforcement, provider-secret reference normalization and optional execution metadata before invoking the provider adapter. Ineligible governance, blocked pre-send state or disallowed knowledge enforcement fails before the provider call.

Disposition: **KEEP + INTEGRATE later with authoritative Authorization/Policy and Provider/Binding boundaries**.

This is a strong fail-before-send predecessor. It does not establish the full Planning-A constitutional authority model: there is no evidenced `Enterprise -> Station -> Role -> Person` integration authority envelope, Station delegated capability exposure, generic external-operation scope, or proof that provider credential capability is always intersected with a canonical integration principal/role scope.

## 3. Credential/config boundary

The governed adapter receives an optional `ProviderSecretReferenceDescriptor` through invocation context rather than embedding raw secret material in the canonical model request. This preserves a useful separation between request semantics and credential realization.

Disposition: **KEEP**.

Gap: current main does not evidence generic connector credential lifecycle, binding scope, rotation/currentness, per-operation authority restriction, residual credential cohorts or cutover drainage across external integration providers.

## 4. Provider/external identity coupling

The model gateway keeps request identity and provider response identity distinct: `requestId` is canonical correlation while `responseId` is a returned provider-side/output identity. The adapter itself is injected, and product evidence around the provider abstraction demonstrates replaceability of concrete implementations behind the same model I/O contract.

Disposition: **KEEP the non-provider-native request contract; PROVIDERIZE concrete realization only behind qualified bindings**.

No inspected evidence requires adopting provider-native account/job/resource IDs as canonical Integration identity. Conversely, current main also does not expose a generic typed external-realization identity model for arbitrary connectors, webhooks, external resources or operations.

## 5. Invocation and receipt lineage

Current AI Gateway explicitly records request/response correlation and can return execution metadata, structured-output validation, governance evaluation, usage observation, pre-send evaluation and knowledge-enforcement evidence alongside the response.

Disposition: **KEEP + HARDEN**.

Planning-A requires a stronger integration lineage: admitted intent -> attempt -> accepted -> applied/effective -> converged -> validated. Current main does not evidence a first-class generic attempt record, provider receipt taxonomy, external readback/reconciliation record, correction/supersession lineage, or `APPLIED | NOT_APPLIED | PARTIAL | UNKNOWN` effect disposition for potentially mutating remote operations.

A normalized successful provider response therefore must not be reinterpreted as generic proof of external semantic effect completion.

## 6. Ambiguous effects and reconciliation

The inspected model-provider invocation contract returns a response or throws. It does not represent whether an external side effect was definitely not applied, definitely applied, partially applied or left ambiguous after timeout/connection loss/provider failure.

Disposition: **HARDEN**.

Current main does not evidence target-specific reconciliation/readback, correlation-based effect verification or a generic `UNKNOWN -> reconcile-before-retry` path. This is acceptable for a narrow inference-call predecessor but insufficient for Generation-2 mutating external integration semantics.

## 7. Idempotency, deduplication, retry and redrive

No inspected Integration/AI Gateway contract exposes target-operation idempotency class, idempotency key, provider deduplication horizon, retry eligibility, backoff policy, attempt number, redrive linkage or reconciliation-before-retry requirement.

Disposition: **HARDEN + INTEGRATE later with Workflow without transferring ownership**.

Workflow may eventually orchestrate retries, but Integration remains owner of target-specific safety facts. Current main does not evidence those facts as first-class reusable contracts.

## 8. Trigger, subscription, webhook and asynchronous integration semantics

No first-class generic integration trigger/subscription contract, webhook registration identity, callback lifecycle, scheduler-trigger identity, broker-backed integration subscription, trigger correlation or admission record was evidenced in the inspected current-main path.

Disposition: **DEFER target mechanism to Planning C; current support NOT EVIDENCED**.

This preserves the Planning-A boundary: generic delivery/replay/ordering belongs to Notifications / Events / Messaging; Integration owns whether a delivered observation becomes an admitted automation invocation and what external effect follows.

## 9. Sync versus async execution

The current provider seam is request/response Promise-based invocation. It evidences synchronous logical invocation over an asynchronous programming API, but no durable asynchronous external-job contract, pending-operation identity, callback completion, polling reconciliation, cancellation or long-running external-operation state is present.

Disposition: **KEEP the simple seam; GENERALIZE only with explicit semantics later**.

Do not infer durable orchestration from Promise-based invocation. Workflow remains owner of durable multi-step execution.

## 10. Connector/adapter contract completeness

Current `ModelProviderAdapter` is intentionally minimal: `invoke(request): Promise<response>`. `ModelCapabilityDescriptor` separately describes model capabilities and limits; governance rules can filter routing/fallback eligibility.

Disposition: **KEEP the minimal provider abstraction; HARDEN generic connector contracts later where required**.

Compared with Planning A, current main does not evidence per-operation side-effect class, reconciliation/readback support, target consistency, idempotency/dedup properties, timeout ambiguity semantics, provider error taxonomy, mapping compatibility, webhook behavior or residual-drainage obligations as part of a generic connector contract.

## 11. Provider capability qualification and substitution

Current AI Gateway has explicit capability descriptors, limits, routing eligibility and fallback rules, plus product evidence for adapter replaceability. These are strong Provider/Binding predecessors that Integration can consume.

Disposition: **KEEP + INTEGRATE with Provider / Binding / Capability Negotiation**.

The current capability descriptor is narrower than a Generation-2 multidimensional support vector. No inspected contract qualifies integration-specific reconciliation, transactionality, webhook semantics, dedup horizon, batch behavior, offline/local behavior, export/migration or residual cohorts for arbitrary external systems.

## 12. Data/schema and mapping boundary

The model request/response payload is typed as `unknown` at the generic gateway edge, while structured-output validation can be supplied separately for output shape. This keeps the gateway from becoming canonical business-schema owner.

Disposition: **KEEP the separation; HARDEN mapping lineage where external integrations require it**.

Current main does not evidence generic source/target mapping identity, mapping revision, lossy/partial transformation qualification or explicit canonical-adoption transitions for arbitrary external data. Data / Schema remains the canonical owner.

## 13. Observability and evidence

`execution-metadata.ts` can carry `modelRef`, `modelVersion`, cost and provenance references under an explicit permission envelope. Governed invocation also derives usage observation linked to request/response identity and governance-permitted measurements.

Disposition: **KEEP + INTEGRATE with Observability and FinOps according to ownership boundaries**.

This is useful evidence lineage, but it is not yet a generic integration-attempt/effect evidence model. In particular, model execution metadata does not establish external effect convergence or semantic validation.

## 14. Portability and lock-in

The adapter injection seam and canonical model I/O contracts demonstrate real provider replaceability for the bounded AI-provider use case. Canonical request structure is not tied to a single provider SDK.

Disposition: **KEEP**.

Current main does not evidence generic connector migration/coexistence semantics or residual-cohort drainage for old subscriptions, callbacks, pending jobs, retries, sessions, credentials, caches or webhook endpoints. Therefore provider replaceability is **PARTIAL / BOUNDED**, not a proof of arbitrary integration portability.

## 15. AI/AGWS non-amplification

The inspected governed model invocation path adds policy and pre-send gates before provider invocation rather than granting authority merely because AI can propose or produce an external request.

Disposition: **KEEP the fail-before-send pattern**.

No evidence from this pass permits AI or AGWS to grant credentials, widen Station/Role scope, convert provider capability into SB authority, or force an ambiguous external outcome to `APPLIED`. `Enterprise -> Station -> Role -> Person` and AGWS non-amplification remain mandatory later proofs.

## 16. Planning-A validation answers

1. **Current integration definitions/connectors/invocations/attempt identities:** a model-provider adapter and request/response invocation seam exist; generic integration/connector/invocation/attempt identities do not.
2. **Provider IDs embedded into canonical identity:** not evidenced in the inspected AI Gateway seam; request correlation is provider-neutral and response identity is distinct.
3. **Revision-qualified mappings/contracts:** model I/O/capability/governance contracts are versioned; arbitrary source/target mapping revision is not evidenced.
4. **Accepted versus applied/converged/validated:** not represented generically.
5. **Ambiguous remote mutation:** no first-class `UNKNOWN` disposition or reconciliation contract evidenced.
6. **Idempotency/dedup horizons:** not evidenced.
7. **Message/webhook delivery versus external-effect completion:** generic webhook/message integration path not evidenced; therefore no claim of equivalence is made.
8. **Durable orchestration separation:** current model invocation is a bounded call; no evidence collapses it into Workflow ownership.
9. **Credential-derived authority amplification:** secret references are separated from requests, but full constitutional scope intersection is not evidenced.
10. **Provider support for safe substitution:** bounded model capability/limit descriptors and adapter replaceability exist; generic integration support vectors do not.
11. **Residual cohorts:** not evidenced.
12. **AI/AGWS privileged bypass:** no such authority is evidenced; non-amplification remains controlling.

## 17. Maturity assessment

- Provider-neutral request/response contract: **STRONG IMPLEMENTED PREDECESSOR**.
- Replaceable adapter invocation seam: **STRONG IMPLEMENTED PREDECESSOR**.
- Fail-closed response correlation/normalization: **IMPLEMENTED BASELINE**.
- Governance/pre-send/knowledge checks before provider invocation: **STRONG IMPLEMENTED PREDECESSOR**.
- Secret reference separated from canonical request: **IMPLEMENTED BASELINE**.
- Generic connector/external-operation identity: **NOT EVIDENCED**.
- Trigger/subscription/webhook lifecycle: **NOT EVIDENCED**.
- Attempt/effect lineage and effect dispositions: **NOT EVIDENCED**.
- Ambiguous-effect reconciliation: **NOT EVIDENCED**.
- Target-specific idempotency/dedup/retry/redrive: **NOT EVIDENCED**.
- Durable async external-job semantics: **NOT EVIDENCED**.
- Generic mapping revision/adoption semantics: **NOT EVIDENCED**.
- Generic residual-cohort drainage/provider cutover: **NOT EVIDENCED**.
- Portability/provider substitution: **PARTIAL — STRONG FOR BOUNDED AI ADAPTER, NOT GENERIC INTEGRATION**.

## 18. Reconciliation disposition

**KEEP** the canonical versioned request/response seam, injected provider adapter, fail-closed normalization/correlation, pre-send governance composition, provider secret reference separation, execution metadata and bounded replaceability proof.

**HARDEN** generic integration identity, connector contract semantics, attempt/effect lineage, effect disposition, reconciliation, idempotency/deduplication, retry/redrive safety, mapping revision lineage, async operation semantics and external-effect evidence.

**GENERALIZE** only reusable external-interaction primitives proven across domains; do not simply rename the AI Gateway into a universal integration layer.

**PROVIDERIZE** concrete external-system adapters behind Provider/Binding qualification while preserving canonical integration identity.

**INTEGRATE** later with Workflow, Notifications/Messaging, Authorization/Policy, Data/Schema, Secrets/Configuration, Provider/Binding, Lifecycle, Observability, FinOps and UCA according to Planning-A ownership.

No evidence supports `REPLACE` of the existing AI-provider seam.

## 19. Result

**PASS_FOR_CAPABILITY / CURRENT_STATE_RECONCILED.** Current SB has a strong bounded predecessor for Integration & Automation in its AI Gateway: provider-neutral versioned model I/O, replaceable adapter invocation, fail-closed request/response correlation, governed pre-send admission, secret-reference separation and execution/usage evidence. The principal Generation-2 gaps are generic connector/external-operation identity, trigger/subscription/webhook lifecycle, attempt/effect dispositions, ambiguous-effect reconciliation, target-specific idempotency/dedup/retry/redrive, durable async integration jobs, mapping revision/adoption semantics, multidimensional integration support qualification and residual-cohort drainage. The current model-provider success path must not be interpreted as proof of generic external effect `APPLIED/CONVERGED/VALIDATED` semantics.

No product code, Work Package, executive TASK, Construction, PR or worker handoff was executed.
