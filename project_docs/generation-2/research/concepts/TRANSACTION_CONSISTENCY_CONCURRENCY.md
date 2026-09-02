# Generation 2 — Research Hypothesis: Transaction, Consistency & Concurrency

Status: USER-DIRECTED / MANDATORY CROSS-CAPABILITY RESEARCH HYPOTHESIS / NOT YET A PROMOTED CAPABILITY

## Why this exists

Generation 2 already studies workflow durability, data/schema evolution, integration delivery, provider binding, authorization, observability, recovery and evidence. A remaining structural question is how System Builder declares and preserves business invariants when multiple operations, actors, workflows, providers or replicas act concurrently and when one logical business outcome spans more than one technical transaction boundary.

This document does **not** decide that Transaction / Consistency / Concurrency is an independent top-level capability. Research must determine whether the result belongs to Universal Capability Architecture, Data, Workflow, Integration, Runtime, a cross-cutting consistency model, or a combination of specialized primitives.

## User-directed design intent to falsify or validate

Candidate constitutional idea:

> Business consistency semantics belong to the System Builder declaration; concrete locking, database transactions, broker transactions, sagas or provider-specific mechanisms are realizations.

The SB should be able to express what must remain true without hard-coding PostgreSQL transactions, Redis locks, Kafka transactions, Temporal sagas or equivalent mechanisms into portable business semantics.

## Core research questions

1. How should SB represent business invariants independently from storage/runtime implementation?
2. What is the semantic boundary between one atomic operation, one workflow transaction, one distributed business transaction and one eventual-consistency process?
3. How should concurrent commands against the same logical resource be admitted, serialized, rejected, merged or retried?
4. Which consistency guarantees are operation-scoped rather than global system properties?
5. How should optimistic concurrency, compare-and-set/version preconditions, pessimistic/exclusive access, leases and fencing tokens be represented without leaking provider mechanics?
6. How should idempotency differ from concurrency control, deduplication and exactly-once claims?
7. How should asynchronous delivery preserve business invariants under duplicate, delayed, reordered or replayed messages?
8. How should multi-step business operations define compensation, rollback, cancellation and irreversible effects?
9. How should external side effects be reconciled when local state commits but the remote effect is unknown, delayed or fails?
10. How should conflict resolution work for offline/edge/disconnected Stations and later reconciliation?
11. How should consistency requirements interact with authority changes, policy revision and durable workflows already in flight?
12. How should evidence prove that an invariant/postcondition held at the required revision/time/scope?
13. Can provider replacement preserve declared consistency semantics when the old and new providers offer different guarantees?
14. How do cumulative workflow context and CapabilityOperation semantics represent versioned reads, writes, expected state and postconditions safely?

## Candidate semantic primitives to stress-test

Do not promote these names before evidence. Test whether some subset deserves canonical representation:

- `BusinessInvariant`
- `ConsistencyRequirement`
- `TransactionBoundary`
- `AtomicityRequirement`
- `ConcurrencyPolicy`
- `ExpectedRevision` / `VersionPrecondition`
- `ConflictDecision`
- `IdempotencyContract`
- `CorrelationIdentity`
- `OrderingRequirement`
- `IsolationProfile`
- `Lease/FencingRequirement`
- `CompensationPlan`
- `IrreversibleEffect`
- `CommitDecision`
- `Postcondition`
- `ConsistencyEvidence`
- `ReconciliationPlan`

Possible operation-oriented form, illustrative only:

```text
CapabilityOperation {
  semanticInput
  expectedStateRevision?
  invariants[]
  consistencyRequirement
  concurrencyPolicy
  idempotencyContract?
  effects[]
  compensation?
  postconditions[]
  evidenceProduced
}
```

## Required scenarios / proofs

Research must test at least the following scenarios.

### A. Double-spend / bounded resource

Two concurrent operations observe `balance=100` and each attempt to debit `80`. The canonical invariant is `balance >= 0`. Prove that the semantic model can state the invariant and concurrency requirement while different realizations enforce it safely.

### B. Duplicate approval

Two actors or retries attempt the same `ApproveRefund` operation. Distinguish authorization, idempotency, duplicate detection and state-version conflict. Prove that the operation cannot be applied twice merely because two technically valid calls arrive.

### C. Payment succeeded, inventory reservation failed

`Payment=SUCCESS` followed by `ReserveInventory=FAIL`. Research when the correct response is compensation/refund, pending/manual resolution, reservation retry or explicit inconsistent state. Do not assume distributed atomic rollback is universally available.

### D. Local commit / remote effect ambiguous

Local state is committed; outbound provider times out after possibly performing the external effect. Model `UNKNOWN/INCONCLUSIVE` rather than incorrectly treating timeout as failure or retrying blindly.

### E. Message duplicate / reorder / replay

A broker delivers the same business event twice or later replays older events. Prove correlation/idempotency/order semantics without relying on a provider-wide exactly-once fiction.

### F. Offline Station conflict

Two disconnected Stations mutate a shared semantic entity and reconnect. Research whether conflict is reject/retry, authority-prioritized resolution, merge, human decision or domain-specific reconciliation, with full lineage.

### G. Durable workflow + schema/policy/provider change

An in-flight workflow began under one state/schema/policy/provider revision. Before its next mutating step, relevant revisions changed. Determine what must be revalidated and what historical assumptions remain bound to the run.

### H. Provider replacement

Replace one persistence/workflow/integration provider with another having weaker/different transaction or ordering guarantees without changing the semantic operation declaration. The replacement must either prove compatibility, expose degradation/partial satisfaction, require migration, or be rejected.

## Boundaries that must remain distinct

### Transaction vs workflow
A workflow is orchestration over time. A database transaction is one realization mechanism. They must not collapse into the same concept.

### Idempotency vs concurrency control
Idempotency prevents repeated application of the same logical operation. Concurrency control governs competing operations, including different commands against the same state.

### Delivery exactly-once vs business effect exactly-once
Broker/provider guarantees are scoped. Transport acknowledgment never proves unique business effect by itself.

### Compensation vs rollback
Rollback restores an uncommitted/transactional state when the mechanism supports it. Compensation is a new semantic action that counteracts a committed effect and may not restore the exact original world.

### Conflict resolution vs adapter
Resolving two legitimate competing business states is domain/consistency semantics, not schema normalization.

### Consistency declaration vs provider realization
Portable semantics must not contain provider-specific locks, SQL isolation names, broker offsets or engine history instructions unless carried as provider-specific realization metadata.

## Cross-capability owners that must test this hypothesis

- Universal Capability Architecture
- Process & Application Modeling
- Workflow & Durable Execution
- Integration & Automation
- Authorization / Policy / Organization / Multitenancy
- Data / Schema / Migrations
- Notifications / Events / Messaging
- Deployment / Environment / Runtime
- Observability / Operations / Incident
- Provider / Binding / Capability Negotiation
- Standards / Interoperability / API Contracts
- Lifecycle / Versioning / Evolution / Migration
- Security / Resilience / Failure Recovery
- Architecture Reconciliation
- Executable Capability Composition / Cumulative Execution Context hypothesis

## Representatives to seek

Use multi-representative evidence, potentially including PostgreSQL transaction/isolation/locking semantics, FoundationDB or CockroachDB distributed transactions, Kafka transactional/idempotent delivery boundaries, Temporal/Camunda saga/compensation patterns, DynamoDB conditional/transactional writes, Kubernetes resourceVersion/optimistic concurrency/leases, CRDT/offline-sync systems where relevant, and mature payment/ledger patterns. Representatives are examples, not a mandated list; prefer official specifications/documentation and architecture sources.

## Negative-space requirement

The post-cycle-7 Enterprise Completeness / Negative-Space Review must explicitly challenge Transaction / Consistency / Concurrency. It cannot close while material enterprise archetypes require unowned semantics for invariants, atomicity, concurrent mutation, ordering, idempotency, compensation, conflict resolution or distributed consistency.

## Synthesis obligation

Capability Synthesis must explicitly dispose this hypothesis and its candidate primitives using evidence-backed `KEEP`, `MERGE`, `GENERALIZE`, `SPECIALIZE`, `DEFER` or `DO_NOT_BUILD`. It must not disappear implicitly because individual mechanisms are already discussed inside Data, Workflow or Integration.
