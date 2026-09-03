# Generation 2 — Planning A: Integration & Automation Boundaries

Status: COMPLETE_FOR_CAPABILITY — PLANNING_A_TAXONOMY_BOUNDARIES
Capability: Integration & Automation
Authority inputs: `project_docs/generation-2/synthesis/CAPABILITY_SYNTHESIS.md`, authoritative Generation 2 research corpus, and prior Planning A capability-boundary decisions.

This document defines taxonomy ownership and boundaries only. It does not assert current System Builder implementation, select connector/automation providers, define target modules, materialize WBS/TASKs, execute Construction, inspect product code, or enter Planning B.

## 1. Canonical ownership

Integration & Automation owns provider-neutral semantics for external interaction: trigger/subscription definitions used to initiate integration work, connector/adapter contracts, external-system operation identity, automation invocation/execution records, request/attempt lineage, provider receipts, effect disposition and reconciliation, target-specific idempotency/deduplication facts, replay/redrive eligibility, and explicit realization of external interactions across provider boundaries.

It owns how SB intentionally crosses from canonical/platform semantics into an external system and how the resulting effect is qualified. It does not own durable business orchestration, generic message transport, canonical process/application meaning, authorization policy, provider admission/binding, protocol standards, lifecycle orchestration, canonical data/schema truth, or universal primitives.

## 2. Source of truth

The source of truth for an integration action is a revision-qualified integration intent/operation plus its adapter/connector contract and effect-reconciliation record. External provider dashboards, transport acknowledgements, HTTP status codes, queue acknowledgements, webhook deliveries and provider-native IDs are observations or realization evidence unless explicitly adopted by the owning semantic contract.

Canonical business/process/data truth remains with its domain owner. Integration may observe or actuate external state but cannot silently normalize external facts into canonical truth without an explicit authorized adoption/reconciliation transition.

## 3. Identity model

Canonical integration identity, connector/adapter contract identity, trigger/subscription identity, automation invocation identity, external operation identity and execution-attempt identity are distinct from provider account IDs, endpoint URLs, webhook IDs, job IDs, request IDs, message IDs and resource IDs.

Provider/external IDs are typed realization references by default. Provider substitution may preserve the canonical integration/automation identity while replacing external realization IDs and support characteristics.

## 4. Trigger and subscription ownership

Integration & Automation owns the semantic definition that an external observation, schedule or subscription condition may initiate an integration/automation action, including its scope, filter/mapping contract, target operation, correlation identity and admission requirements.

Notifications / Events / Messaging owns generic publication, transport, delivery, ordering, broker subscriptions, replay and deduplication. A broker subscription may realize an integration trigger, but transport delivery is not equivalent to an admitted automation invocation or successful external effect.

Workflow may consume an integration trigger as a workflow signal or invoke integration as an activity; Workflow remains owner of durable orchestration state.

## 5. Connector and adapter contract

A connector/adapter contract must express at minimum the external capability/operation being realized, accepted canonical input/output shapes or mappings, required credentials/bindings, declared side-effect class, target-specific idempotency/deduplication properties, timeout/ambiguity behavior, observable receipts/evidence, reconciliation/readback capability, error taxonomy, support limitations and revision compatibility.

A connector is not merely code that can reach an API. Its contract must be sufficiently explicit to determine whether an operation can be retried, reconciled, substituted, degraded or denied safely.

## 6. External-system actuation lineage

Integration preserves the distinction between:

1. intent admitted for external actuation;
2. attempt created;
3. request/operation accepted by a local or remote boundary;
4. intended external effect applied/effective;
5. dependent external/platform state converged;
6. intended semantic postcondition validated.

Receipt of a successful HTTP response, queue acknowledgement or provider job ID establishes only the fact warranted by that provider contract. It cannot be promoted automatically to `APPLIED`, `CONVERGED` or `VALIDATED`.

## 7. Effect dispositions and reconciliation

Potentially mutating operations use explicit effect dispositions: `APPLIED`, `NOT_APPLIED`, `PARTIAL` or `UNKNOWN`. `UNKNOWN` means the target may or may not have been mutated and therefore requires reconciliation before unsafe retry unless an explicitly qualified idempotency/deduplication contract proves retry safety.

Reconciliation should prefer target-specific readback, correlation keys, operation/resource identity, provider receipts and authoritative external observations. Absence of evidence is not evidence of `NOT_APPLIED`.

Corrections and later reconciliation findings supersede/annotate prior assessments without deleting attempt history.

## 8. Retry, replay and redrive

Integration owns target-specific retry eligibility and replay/redrive semantics for external interactions. Retry policies must account for operation side-effect class, idempotency keys, provider deduplication horizon, target consistency, rate limits, token expiry, stale mappings, and the current effect disposition.

Redrive creates a new governed attempt while preserving linkage to prior attempts. It cannot reset historical ambiguity or imply previous attempts had no effect. Workflow may orchestrate when to retry/redrive, but Integration supplies the target-specific safety facts.

## 9. Automation execution boundary

Automation execution is the bounded act of evaluating an admitted automation rule/invocation and invoking qualified integration operations under an explicit authority envelope. Integration owns invocation/attempt/effect lineage and target-specific execution semantics; Workflow owns durable multi-step orchestration where long-running state, waits, timers, compensation, human tasks or replay-qualified histories are required.

Simple automation can remain non-workflow when its semantics do not require durable orchestration. Complexity alone does not automatically transfer ownership; the semantic distinction is whether durable business execution state is required.

## 10. Relationship to Workflow & Durable Execution

Workflow owns durable instance/history semantics, timers, waits, human tasks, retry/redrive orchestration and in-flight workflow evolution. Integration owns the external side-effect boundary and its target-specific receipts/reconciliation/idempotency facts.

A workflow activity may invoke Integration, but integration acceptance does not equal workflow step completion unless the workflow contract explicitly defines and validates the required postcondition. Integration does not acquire ownership of the durable workflow instance merely because it executes side effects.

## 11. Relationship to Notifications / Events / Messaging

Notifications / Events / Messaging owns transport/delivery semantics: publication, delivery attempts, ordering, deduplication, broker subscriptions, replay and provider migration. Integration may use those transports to receive triggers or emit observations, but transport state and external-effect state remain distinct.

Duplicate delivery may result in one admitted integration invocation, multiple safely deduplicated attempts, or multiple effects depending on the declared contract. The integration boundary must not assume exactly-once external effect merely because a transport advertises delivery guarantees.

## 12. Relationship to Process & Application Modeling

Process & Application Modeling owns canonical business/process/application semantics and their lineage. Integration maps or actuates those semantics against external systems but cannot redefine them to match an external API.

Mappings must retain source/target revision lineage and lossy/ambiguous mappings must remain explicit. A provider-specific field or external workflow cannot silently become canonical process meaning without explicit adoption by the process/application owner.

## 13. Relationship to Authorization / Policy / Organization / Multitenancy

Authorization/Policy owns whether a principal, role, Station, automation or service may invoke an integration operation and within what scope. Integration enforces/consumes the resulting authority envelope but cannot manufacture broader authority from connector credentials.

Possession of a powerful provider credential does not imply SB authority to use all of its permissions. Effective integration authority is the intersection of delegated SB authority, applicable policy, provider binding scope and credential capability.

`Enterprise → Station → Role → Person` remains monotonic; Station capability exposure/delegated administration can narrow or expose only already-delegated authority.

## 14. Relationship to Provider / Binding / Capability Negotiation

Provider/Binding owns provider discovery, support qualification, admission, binding, fallback, cutover, coexistence and withdrawal. Integration owns the provider-neutral external-operation contract and target-specific adapter semantics used after a binding is admitted.

A connector/provider match is multidimensional: operation coverage, consistency, idempotency, reconciliation/readback, rate limits, batch behavior, transactionality, webhook semantics, offline/local support, export/migration and observability can differ. Matching names such as “create”, “sync” or “webhook” do not establish semantic equivalence.

Provider substitution requires explicit binding requalification and residual-cohort drainage for old subscriptions, credentials, sessions, webhook endpoints, pending jobs, caches and retries.

## 15. Relationship to Standards / Interoperability / API Contracts

Standards/API Contracts owns protocol and conformance semantics such as HTTP/OpenAPI/gRPC/event contract compatibility, syntactic/structural/behavioral/semantic conformance and extension/downgrade boundaries. Integration consumes these contracts when realizing an external interaction.

Protocol conformance does not by itself prove domain equivalence, effect safety, idempotency or authority. Integration remains responsible for target operation semantics and reconciliation even when the transport/API is standards-conformant.

## 16. Relationship to Data / Schema / Migrations

Data / Schema / Migrations owns canonical schema/data identity, compatibility, migrations, backfills and cutovers. Integration owns mappings and external synchronization/actuation behavior.

Integration mappings must be revision-qualified against relevant schemas. Data synchronization does not grant Integration canonical ownership of replicated data. Conflict resolution that changes canonical truth requires the appropriate data/domain owner and policy.

## 17. Relationship to Lifecycle / Versioning / Evolution / Migration

Lifecycle owns reusable revision/coexistence/migration/withdrawal semantics. Integration supplies domain-specific compatibility predicates for connector contract revisions, mapping changes, provider API versions, active subscriptions, pending operations and residual automation cohorts.

Withdrawal of an old connector/provider realization is unsafe while outstanding jobs, callbacks, retries, webhook deliveries, tokens or correlated external effects may still complete authoritatively.

## 18. Relationship to Universal Capability Architecture

UCA supplies reusable typed identity, revision vectors, qualified claims/evidence, effect dispositions, support vectors, authority envelopes, residual-cohort drainage and lineage-preserving correction primitives. It must not become a universal connector DSL, automation engine, provider API model or reconciliation algorithm.

Integration remains owner of external interaction semantics while consuming UCA primitives.

## 19. Governance, observability and portability

Every integration/automation action should be observable through qualified evidence linking canonical intent, authority, connector/binding revision, attempt, provider receipt, external observation, effect disposition and reconciliation result. Observability owns generic telemetry/evidence collection semantics; Integration owns the interpretation needed to qualify the external operation.

Portability is represented as a support vector rather than a binary “compatible” flag. Provider substitution can preserve canonical operation intent while exposing differences in idempotency, reconciliation, consistency, limits, offline behavior and residual-drainage requirements.

Governance may impose approval, retention, audit, residency, segregation-of-duties or exception obligations. Integration consumes those requirements but does not own their policy meaning.

## 20. Failure semantics

First-class non-success conditions include unsupported operation semantics, incompatible mapping/schema revision, unavailable binding/credential, denied authority, stale provider capability evidence, ambiguous mutation, partial batch application, reconciliation mismatch, duplicate/unordered trigger realization, expired idempotency horizon, provider rate/consistency limits, residual old-provider cohorts and insufficient evidence for validation.

Use `UNKNOWN` for potentially mutating operations whose effect cannot yet be determined; `PARTIAL` for bounded partial application/support; `INCONCLUSIVE` where evidence/currentness is insufficient to establish safety or completion; and explicit rejection/denial for known contract or authority violations.

Timeout, connection loss and provider acceptance are not automatically `NOT_APPLIED`.

## 21. AGWS and AI non-amplification

AGWS remains a distinct CORE capability over `Enterprise → Station → Role → Person`. It may expose integration actions, automation proposals, approval queues and reconciliation work through governed surfaces, but visibility/presentation does not create actuation authority.

AI may propose mappings, connector configurations, automation rules, retries, reconciliations or provider substitutions. AI is not canonical mutation or provider-administration authority. It cannot grant credentials, widen Station/Role scope, force `UNKNOWN` to `APPLIED`, silently adopt provider IDs as canonical, or execute privileged external mutation without explicit qualified authority/admission.

## 22. Non-goals

Integration & Automation does not own:

1. durable business workflow-instance/history semantics;
2. generic event/message transport guarantees;
3. canonical process/application semantics;
4. canonical data/schema truth;
5. authorization/policy truth;
6. provider discovery/admission/binding lifecycle;
7. standards/protocol conformance ownership;
8. generic lifecycle orchestration;
9. deployment/runtime topology;
10. universal architecture primitives;
11. external/provider IDs as canonical business identity by default;
12. unrestricted credential-derived authority;
13. AI-controlled privileged external mutation.

## 23. Preserved proof obligations

Later phases must prove at minimum:

1. canonical integration/automation identity survives connector/provider substitution;
2. external IDs remain typed realization identities unless explicitly adopted;
3. attempted → accepted → applied/effective → converged → validated facts remain distinct;
4. `UNKNOWN` mutations reconcile before unsafe retry unless qualified idempotency proves retry safety;
5. transport delivery cannot be mistaken for automation admission or external-effect completion;
6. workflow orchestration state remains distinct from integration effect state;
7. connector credentials cannot amplify effective SB authority;
8. schema/process mappings remain revision-qualified and do not silently redefine canonical truth;
9. provider substitution exposes support-vector differences instead of normalizing them away;
10. cutover drains residual subscriptions, callbacks, retries, jobs, credentials and other old-provider cohorts;
11. replay/redrive preserves prior attempt/effect lineage;
12. AI/AGWS cannot bypass `Enterprise → Station → Role → Person`, Station delegated exposure/administration or privileged-actuation boundaries.

## 24. Planning B repository-validation questions

Record only for later `PLANNING_B_SB_CURRENT_STATE_RECONCILIATION`:

1. Where are current SB integration definitions, connector contracts, automation invocations and external-operation attempts represented, and are their identities distinct?
2. Are provider/external IDs embedded into canonical business/process/data identities?
3. Are connector mappings and contracts revision-qualified against source/target schemas and APIs?
4. Does current SB distinguish request accepted from effect applied/converged/validated?
5. How are ambiguous remote mutations represented, reconciled and retried?
6. Are idempotency keys/deduplication horizons explicit per target operation or assumed globally?
7. Can message/webhook delivery be mistaken for automation/external-effect completion?
8. Is durable multi-step orchestration separated from simple integration/automation execution?
9. Can connector credentials confer broader authority than the SB principal/Station/Role is allowed to exercise?
10. Are provider capabilities/support vectors explicit enough for safe substitution and fallback?
11. Can old subscriptions, callbacks, credentials, sessions, retries and pending jobs be inventoried/drained during cutover?
12. Can AGWS/AI/personal automation paths invoke external mutation or provider-admin actions beyond delegated authority?

These questions must not be answered during Planning A.

## 25. Planning A capability decision

**PASS_FOR_CAPABILITY.** Integration & Automation has explicit ownership of triggers/integration subscriptions, connector/adapter contracts, external-system actuation, automation invocation/execution, target-specific receipts/effect reconciliation, retry/replay/redrive safety facts and provider-neutral external interaction, with clear boundaries from Workflow, Notifications/Messaging, Process/Application, Authorization/Policy, Provider/Binding, Standards/API Contracts, Lifecycle, Data/Schema and UCA.

No new capability, finding or synthesis contradiction is created by this boundary pass. Attempted → accepted → applied/effective → converged → validated lineage, explicit `APPLIED/NOT_APPLIED/PARTIAL/UNKNOWN` dispositions, reconcile-before-retry for `UNKNOWN` mutations, provider/external IDs as non-canonical-by-default, AGWS `Enterprise → Station → Role → Person` boundaries, Station delegated capability exposure/administration and AI/AGWS non-amplification remain preserved.
