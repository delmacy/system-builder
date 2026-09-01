# Generation 2 — Workflow & Durable Execution

Status: first deep pass; NOT SATURATED.

## Research question

Which durable-workflow semantics are universal enough to inform Generation 2, and which are implementation-specific mechanisms that must remain behind a provider/runtime boundary? This pass focuses on execution identity, durable progress, replay/redrive, failure semantics, versioning, worker boundaries, external events, observability, migration and portability.

## Representatives

1. **Temporal** — canonical history/replay durable execution; selected for long-lived code-first workflows and worker/service separation.
2. **Camunda 8 / Zeebe** — BPMN/process-engine lineage; selected for explicit process-definition identity/version, jobs, incidents and live instance migration.
3. **AWS Step Functions** — managed state-machine model; selected for immutable execution association to definition version/alias and selective redrive semantics.
4. **Azure Durable Functions / Durable Task** — replay-based orchestrator-as-code; selected for explicit nondeterminism/versioning constraints and backend-agnostic orchestration version isolation.
5. **Restate** — newer durable-execution runtime; selected as a useful contrast because journals, durable handlers, state, promises, reliable RPC and service deployment are exposed as general backend primitives rather than only workflow DSL constructs.

## Evidence/source ledger

| Representative | Current evidence | Architectural claim used |
|---|---|---|
| Temporal | https://docs.temporal.io/ | Temporal positions Workflow Executions as crash-resilient durable application executions that resume after process/network/infrastructure failure; exact history/replay details require a later Temporal-specific revisit. |
| Camunda 8 | https://docs.camunda.io/docs/components/concepts/incidents/ | Process instances have identity tied to a process definition/version; exhausted job retries can become incidents requiring repair/resolution before continuation. |
| Camunda 8 | https://docs.camunda.io/docs/components/concepts/job-workers/ | Workers activate jobs and explicitly complete/fail them; retry counts/backoff are workflow-runtime state, not hidden application exceptions. |
| Camunda 8 | https://docs.camunda.io/docs/components/concepts/process-instance-migration/ | Running instances may migrate to a new process version subject to element compatibility; existing jobs/mappings are not magically recreated. |
| AWS Step Functions | https://docs.aws.amazon.com/step-functions/latest/dg/redrive-executions.html | Redrive resumes failed Standard Workflow executions from unsuccessful work while preserving successful history/results and original definition association. |
| AWS Step Functions | https://docs.aws.amazon.com/step-functions/latest/dg/execution-alias-version-associate.html | Execution identity can be explicitly associated with a state-machine version/alias at start; version-level metrics make rollout/rollback observable. |
| Azure Durable Task | https://learn.microsoft.com/en-us/azure/durable-task/common/durable-orchestration-versioning | Replay requires deterministic orchestration logic; in-flight instances are permanently version-associated and versioning isolates old/new orchestration behavior. |
| Azure Durable Functions | https://learn.microsoft.com/en-us/azure/azure-functions/durable-functions/durable-functions-versioning | Changing durable calls/order can produce nondeterminism when history replay no longer matches orchestrator code. |
| Restate | https://docs.restate.dev/foundations/key-concepts | Each invocation has a lifecycle; operations/results are journaled so recovery replays completed work and resumes incomplete work. |
| Restate | https://docs.restate.dev/tour/workflows | Workflow identity is key-based; durable steps, durable promises, external events and queryable execution state are explicit primitives. |
| Restate | https://docs.restate.dev/services/configuration | Workflow/journal/idempotency retention are independently configurable, demonstrating that execution durability and evidence retention are distinct lifecycle dimensions. |

## Capability/primitives extracted

### Source of truth

A durable workflow needs at least two truths that must not be collapsed:

- **definition truth** — what behavior/version is intended;
- **execution truth** — what an individual execution has already observed/completed.

Temporal/Durable Task/Restate express execution truth through durable history/journal; Step Functions exposes execution history and pins redrive to the original definition; Camunda represents a process instance against a deployed process definition/version.

Candidate universal shape:

`WorkflowDefinitionRef + WorkflowExecutionIdentity + ExecutionHistory/Evidence + CurrentExecutionState`.

### Identity

Stable execution identity is universal. It must survive worker restarts and must be distinct from definition identity. Definition identity should include version/revision semantics; execution identity should preserve lineage to the exact definition/runtime contract used when the execution began.

### Lifecycle

Recurring lifecycle stages across representatives:

`DEFINED -> DEPLOYED/REGISTERED -> STARTED -> RUNNING/WAITING -> RETRYING/INCIDENT/FAILED -> RECOVERED/REDRIVEN/MIGRATED -> COMPLETED/CANCELLED/TERMINATED`.

Not every provider supports every state. Generation 2 should not force provider-specific names into the portable model; it should define portable lifecycle classes plus provider evidence.

### Versioning

Versioning is not merely deployment metadata. It is an execution-safety constraint.

- Step Functions can pin executions to a version/alias and redrive with the original association.
- Durable Task permanently associates orchestration instances with versions and rejects replay divergence.
- Camunda migration makes version transition explicit rather than assuming old instances adopt new behavior.

Universal primitive candidate: `ExecutionDefinitionBinding` containing immutable/pinned definition identity plus compatibility/migration evidence.

### Failure semantics

At least four failure classes recur:

1. transient retryable activity/job failure;
2. terminal/business failure;
3. orchestration/definition incompatibility or nondeterminism;
4. operator-repairable incident/stuck execution.

Retry, compensation, incident repair, redrive and migration are different operations and should not be flattened into a single `retry` primitive.

### Extensibility and provider boundaries

Worker/activity/service code should remain outside portable workflow semantics wherever possible. The portable layer should describe required effects/capabilities and durable coordination semantics; concrete workers, Lambda/functions, SDK handlers, BPMN job types or activity implementations are provider/runtime bindings.

### Governance

A safe durable system needs explicit control over definition publication, version association, migration/redrive authority, cancellation/termination, incident repair and retention. Operator mutation is governance, not just debugging.

### Observability

Execution history/journal is stronger than logs: it is part of execution correctness and recovery. Metrics/traces/logs remain projections. Restate explicitly exports journal-derived OpenTelemetry traces; Step Functions provides execution/version metrics; Camunda exposes incidents and process-instance operational state.

### Portability and lock-in

The main portability risk is not syntax alone. It is **semantic coupling to recovery mechanics**: replay rules, timer/event semantics, retry behavior, worker protocol, migration support, history limits/retention and provider-owned state. A portable definition therefore needs declared durability requirements rather than pretending all engines offer equivalent guarantees.

## Product-specific mechanisms not to copy automatically

- Temporal Event History command/event protocol and SDK-specific determinism rules.
- BPMN/Zeebe element/job representation as the universal SB workflow ontology.
- Step Functions Amazon States Language, ARN/version/alias model and service-integration catalog.
- Durable Functions function-host/storage-provider conventions and language-specific replay APIs.
- Restate Virtual Objects, handler/context taxonomy or reverse-proxy/server topology.

These are valuable reference implementations, not automatic Generation 2 primitives.

## Recurring patterns

1. **Definition identity and execution identity are separate.**
2. **Completed progress is durable evidence, not ephemeral worker memory.**
3. **Recovery resumes from durable execution truth instead of naively restarting everything.**
4. **Long-lived executions require explicit evolution/version semantics.**
5. **Side effects require boundaries: activities/jobs/durable steps distinguish replayable coordination from effectful work.**
6. **Retry, redrive, migration and compensation are orthogonal recovery operations.**
7. **External events/timers/human waits must be durable first-class waits.**
8. **Operator control and observability are part of the execution lifecycle.**
9. **History/journal retention and business-state retention are separate concerns.**
10. **Durability guarantees are capabilities that providers must declare, not assumptions the portable model can silently impose.**

## Comparison with System Builder

This pass did not find sufficiently direct fresh-main repository evidence for a concrete SB durable-workflow implementation through repository code search. Therefore no implementation-state claim is made here. Repository archaeology must later determine whether current SB workflow contracts/runtime already separate definition identity, execution identity, effect boundaries, durable history/evidence, version pinning, retry/compensation and provider bindings.

The conceptual fit with the Generation 2 direction is strong: durable execution should likely be modeled as capability requirements fulfilled by native or external execution providers, while preserving a portable workflow/process semantic layer. This remains a hypothesis pending repository validation.

## Architecture-reconciliation hypotheses

- **GENERALIZE** — workflow definition identity and execution identity as separate primitives if current SB conflates them.
- **HARDEN** — explicit execution-to-definition/version lineage if already present.
- **PROVIDERIZE** — durable execution engine/runtime mechanics behind declared capability/binding contracts.
- **GENERALIZE** — recovery taxonomy: retry, redrive/resume, compensation, migration, repair/incident resolution, cancellation/termination.
- **INTEGRATE** — execution evidence/history as provenance/observability input rather than treating logs as authoritative execution truth.
- **DEFER** — universal live-instance migration until requirements and provider support are proven.
- **DO_NOT_BUILD** — provider-specific replay protocol or BPMN/ASL clone as a new SB-internal universal engine unless future reconciliation proves unique value.

## Repository validation questions

1. Is there a canonical workflow definition contract on fresh main? What owns its identity/version?
2. Is runtime execution identity persisted separately from definition identity?
3. Is there authoritative execution history/evidence, or only mutable current state/logs?
4. Are activities/effects separated from replayable coordination semantics?
5. Are retry, timeout, compensation and cancellation modeled explicitly and deterministically?
6. Can an execution be pinned to a definition/provider version?
7. What happens to in-flight executions when workflow definitions change?
8. Is there any migration/redrive/repair model?
9. Are external events/human approvals represented as durable waits?
10. Are providers replaceable without rewriting workflow business semantics?
11. Are execution-history retention and business-state retention separate?
12. Which guarantees are native requirements versus assumptions of a particular runtime?

## Possible Symbiotic Proof

A future proof should exercise one portable workflow definition with two execution paths:

### Native path
Run through the SB-native execution provider; persist stable execution identity, durable wait, retryable effect, external signal, completion evidence and exact definition binding.

### External path
Run equivalent semantics through one external durable provider (for example Temporal/Camunda/Restate depending later architecture decisions) using an explicit provider binding.

### Replaceability
Swap providers for a new execution without changing business-semantic workflow identity; compare declared capability compatibility and normalized outcome/evidence.

### Portability
Export/import the portable definition without embedding provider-specific worker identifiers beyond explicit bindings/extensions.

### Governance
Prove that publish/version, retry/redrive, cancellation, migration/repair and retention actions are authorized and evidence-bearing.

### Runtime autonomy
After generation/deployment, prove the generated system can continue workflow execution without needing the System Builder control plane, except where an explicitly selected external provider is itself required.

## Normalized findings

- **G2-FINDING-WDE-01 — Definition/Execution Identity Separation.** Durable executions need stable identity distinct from workflow-definition identity/version.
- **G2-FINDING-WDE-02 — Durable Progress Is Execution Evidence.** Completed progress/history is authoritative recovery input, not merely logs.
- **G2-FINDING-WDE-03 — Effect Boundary Is Foundational.** Replayable coordination must distinguish non-deterministic/effectful activities, jobs or durable steps.
- **G2-FINDING-WDE-04 — Execution Version Binding Must Be Explicit.** In-flight execution safety requires immutable or governed association to compatible definition/runtime versions.
- **G2-FINDING-WDE-05 — Recovery Semantics Are Multidimensional.** Retry, resume/redrive, compensation, repair, migration and cancellation are distinct primitives.
- **G2-FINDING-WDE-06 — Durable Wait Is a First-Class Primitive.** Timers, signals, callbacks, human approvals and external events must survive process/runtime failure.
- **G2-FINDING-WDE-07 — Operator Mutation Is Governed Lifecycle.** Incident repair, redrive, migration, cancellation and termination require authority and evidence.
- **G2-FINDING-WDE-08 — Durability Level Is a Provider Capability.** Portable workflow semantics must declare required guarantees rather than assuming all providers implement the same recovery model.
- **G2-FINDING-WDE-09 — History Retention and Business State Retention Differ.** Audit/recovery evidence lifetime must be modeled independently from application/workflow state retention.
- **G2-FINDING-WDE-10 — Runtime Autonomy Must Include In-Flight Work.** Generated-system autonomy is incomplete if long-running workflows need the Builder control plane to resume or recover.

## Candidate discoveries

- `G2-CAPABILITY-CANDIDATE-EXECUTION-DEFINITION-BINDING` — **CROSS_CUTTING**. Evidence: Step Functions version association + Durable Task version isolation + Camunda process version/migration. Promotion condition: recur in Lifecycle/Versioning and Provider/Binding research and map to a structural SB need.
- `G2-CAPABILITY-CANDIDATE-DURABLE-EXECUTION-EVIDENCE` — **CROSS_CUTTING**. Evidence: Restate journal + Step Functions execution history + replay-oriented durable systems. Promotion condition: recur in Observability and Artifact/Provenance and prove distinction from generic provenance.
- `G2-CAPABILITY-CANDIDATE-RECOVERY-SEMANTICS` — **CROSS_CUTTING**. Evidence: retry/incidents, redrive, compensation and migration across multiple representatives. Promotion condition: recur in Security/Resilience/Failure Recovery and Lifecycle; determine whether it is a capability or a subcapability shared by workflow/runtime.

## Synthesis

**Value for SB:** very high. Workflow durability sits directly on the boundary between portable semantics, provider abstraction and generated-runtime autonomy.

**Adoption risk:** high if the SB internal model copies one engine's replay/DSL/worker semantics; moderate if it defines explicit durability requirements, effect boundaries and evidence-normalized provider bindings.

**Investigation priority:** critical.

**Next research question for revisit:** Which minimum portable durability contract can be satisfied by materially different providers without reducing the contract to the lowest common denominator, especially for versioned in-flight executions and migration/recovery semantics?
