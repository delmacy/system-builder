# Deep Research — Transaction Commit, Effect & Consistency Semantics 01

Status: DEEP RESEARCH / RESEARCH RECOMMENDATION / NOT TARGET-ARCHITECTURE AUTHORITY

## Question

When a composed System Builder process crosses local transactions, workflow steps, messages and external providers, what portable semantic states must distinguish an operation that was **attempted**, **locally committed**, **provider-acknowledged**, **business-effective**, **externally observed**, or **still ambiguous** — and where must coordination be required versus avoided?

This deep dive targets the mandatory `Transaction / Consistency / Concurrency` hypothesis and the unresolved question left by `DEEP_RESEARCH_EXECUTABLE_OPERATION_COMPOSITION_01.md`: a workflow transition must not treat transport acknowledgement, durable-engine progress or local commit as sufficient proof that the intended business postcondition is effective.

## Why this is architecturally material

The emerging SB model composes capability-owned operations through long-lived process/saga stages. That makes the transition between stages a correctness boundary. If the workflow advances because an HTTP 200, broker acknowledgement, workflow-task completion or local database commit is mistaken for the semantic postcondition, the process can progress on a false premise.

This affects payment, inventory, approvals, external ERP integration, notifications, data mutation, offline Stations, provider substitution and recovery. It also determines whether `Gate` means merely control-flow branching or a stronger evidence-qualified admission decision between saga stages.

## SB corpus consumed

- `RESEARCH_PIPELINE_STATE.json`: RESEARCH_ELICITATION remains active; Transaction / Consistency / Concurrency is mandatory and unresolved.
- `RESEARCH_EVIDENCE_METHOD.md`: requires triangulation across production systems, standards/specifications, literature and engineering evidence.
- `ARCHITECTURE_PROOF_QUALITY_METHOD.md`: already requires transaction/consistency, idempotency/concurrency/ordering, provider substitution, failure/recovery and desired/effective/observed evidence proofs.
- `concepts/TRANSACTION_CONSISTENCY_CONCURRENCY.md`: proposes business invariants and consistency requirements as portable semantics while locking, DB transactions, sagas and provider mechanisms remain realizations.
- `concepts/EXECUTABLE_CAPABILITY_COMPOSITION_AND_CUMULATIVE_CONTEXT.md` and prior deep research: capability-owned semantic operations are composed by workflow; each operation receives a minimum authorized projection; provider mechanics must not become semantic identity.
- Breadth findings are treated as hypotheses/input corpus, not independent factual evidence.

## External evidence ledger

### E1 — PostgreSQL 18 Serializable isolation
Source: https://www.postgresql.org/docs/current/transaction-iso.html

PostgreSQL Serializable emulates a serial execution of committed transactions but explicitly requires applications to be prepared for serialization failures and retries. The database can therefore provide a strong local atomic/isolation boundary, but success/failure is still scoped to that database transaction.

**Evidence value:** strong production evidence that local serializability is a realization-level guarantee with explicit retry semantics; it does not prove external effects or a multi-system business outcome.

### E2 — Amazon DynamoDB transactions
Sources:
- https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/transactions.html
- https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/transaction-apis.html

DynamoDB supports all-or-nothing ACID transactions across multiple items/tables within supported scope. `TransactWriteItems` is idempotent only inside a bounded client-token window, and transaction conflicts can cancel a request.

**Evidence value:** strong production evidence that atomicity, idempotency and concurrency conflict are distinct properties, each scoped by provider rules. A portable SB contract must not equate provider transaction success with an unlimited semantic idempotency guarantee.

### E3 — Apache Kafka 4.1 message-delivery and transactions
Source: https://kafka.apache.org/41/design/design/

Kafka distinguishes publish durability, consumer delivery and exactly-once processing. Its transactional producer can atomically publish to Kafka partitions and update consumed offsets, but the documentation explicitly notes that exactly-once behavior for external destination systems generally requires cooperation from those systems. Kafka also warns that broad exactly-once claims require careful scoping.

**Evidence value:** decisive negative evidence against a universal `provider_ack == business_effect_once` interpretation. Transport/log atomicity can be strong while external side effects remain outside the atomic boundary.

### E4 — Transactional Outbox engineering pattern
Source: https://docs.aws.amazon.com/prescriptive-guidance/latest/cloud-design-patterns/transactional-outbox.html

AWS documents the dual-write problem: local database change and message publication can diverge if performed separately. The outbox pattern commits domain state plus an outbox record in one local transaction, then publishes asynchronously. Duplicate delivery remains possible and consumers should be idempotent; multi-service state changes are redirected toward saga-style coordination.

**Evidence value:** strong industrial evidence for separating `local effect committed` from `event published/delivered` and for retaining lineage across the handoff rather than pretending one global transaction exists.

### E5 — Temporal Saga pattern
Sources:
- https://docs.temporal.io/design-patterns/saga-pattern
- https://docs.temporal.io/design-patterns/distributed-transaction-patterns

Temporal describes distributed business work as a sequence of local transactions with compensating actions when later steps fail. Compensation is explicitly a subsequent action, not erasure of the original effect.

**Evidence value:** production evidence that long-lived workflow consistency must represent committed effects plus compensations, rather than model the whole process as one ACID rollback boundary.

### E6 — Garcia-Molina & Salem, `Sagas` (1987)
Representative archive: https://www.cs.princeton.edu/research/techreps/598

The original saga model decomposes a long-lived transaction into a sequence of transactions that may interleave with other work and uses compensating transactions for committed subtransactions when later work cannot complete.

**Evidence value:** foundational literature for the distinction between local atomic steps and long-lived semantic recovery. A saga does not make previously committed real-world effects un-happen.

### E7 — Bailis et al., Invariant Confluence
Sources:
- https://www.vldb.org/pvldb/vol8/p185-bailis.pdf
- https://arxiv.org/abs/1402.2237

Invariant confluence determines whether a set of operations can preserve application invariants without coordination. If operations are invariant-confluent, coordination-free execution can be safe; if not, some coordination is necessary for correctness.

**Evidence value:** highly material scientific evidence that SB should not default every mutation to strong global coordination, nor default everything to eventual consistency. Coordination need is a property of the business invariant + operation set.

### E8 — CALM theorem / coordination criterion lineage
Sources:
- https://arxiv.org/abs/1901.01930
- https://cacm.acm.org/research/keeping-calm/
- recent generalization: https://arxiv.org/abs/2602.09435

CALM relates coordination-free consistency to logical monotonicity. The 2026 Coordination Criterion generalizes the question toward whether a specification itself intrinsically requires coordination rather than whether one implementation happens to coordinate.

**Evidence value:** supports expressing coordination requirements at the semantic/specification boundary. Provider mechanisms should realize the requirement rather than define it.

## Competing models

### Model A — One generic `SUCCESS` per operation

The workflow receives success/failure and advances on success.

**Strength:** simple ergonomics.

**Failure:** collapses request acceptance, transaction commit, provider acknowledgement and business postcondition. A timeout after an external effect, a broker ack before downstream acceptance, or a local commit before publication cannot be represented honestly.

**Disposition:** DO_NOT_BUILD as canonical semantic model. UI may present a simplified status only after semantic qualification.

### Model B — Universal distributed ACID / exactly-once business transaction

Every saga stage participates in one atomic distributed transaction or globally exactly-once execution.

**Strength:** simple reasoning when technically feasible.

**Failure:** unrealistic across heterogeneous providers, humans, legacy systems and irreversible external effects; harms availability and provider replaceability; evidence from Kafka, sagas and outbox boundaries contradicts a general claim.

**Disposition:** REJECT as universal requirement. Allow strong atomic profiles where a provider closure actually proves them.

### Model C — Everything is eventual; workflow always compensates later

Avoid coordination, let operations proceed, reconcile/compensate when conflicts appear.

**Strength:** high availability and loose coupling.

**Failure:** unsafe for non-confluent invariants such as bounded balances, unique allocations or mutually exclusive approvals. Compensation may be impossible or economically/legal semantically different from prevention.

**Disposition:** REJECT as default. Eventual/coordination-free operation must be admitted only when invariants permit it or an explicit degraded profile is acceptable.

### Model D — Evidence-qualified semantic outcome + invariant-scoped coordination

Each semantic operation declares its invariant/postcondition and consistency needs. Realization chooses local ACID, compare-and-set, serializable transaction, transactional messaging, saga, compensation, reconciliation or another mechanism. Workflow stage transitions advance only when the required **semantic outcome evidence** is qualified for that stage.

Recommended outcome vocabulary is not yet frozen, but must distinguish at least:

```text
REQUESTED / ATTEMPTED
  ↓
ACKNOWLEDGED              (provider accepted responsibility; not business success)
  ↓
LOCALLY_COMMITTED         (effect committed inside a declared atomic boundary)
  ↓
BUSINESS_EFFECTIVE        (required semantic postcondition holds in authoritative scope)
  ↓
OBSERVED / VALIDATED      (independent or qualified evidence confirms effective state)
```

with orthogonal terminal/intermediate states such as:

```text
REJECTED
CONFLICT
FAILED
OUTCOME_UNKNOWN / INCONCLUSIVE
COMPENSATING
COMPENSATED
PARTIAL
```

Not every operation needs every state. The portable contract declares which evidence threshold is required before the workflow may cross its next gate.

**Disposition:** strongest model; KEEP/GENERALIZE as synthesis recommendation.

## Strongest conclusion

The highest-value result is that **transaction semantics should be owned as business postcondition and invariant semantics, while commit/ack/retry/lock mechanisms remain scoped realizations**.

A composed process therefore needs two related but distinct notions:

1. **Operation outcome state** — what is actually known about the effect of one capability operation.
2. **Stage/Gate admission state** — whether the accumulated qualified evidence is sufficient to advance the saga to its next semantic stage.

Candidate rule:

> **A workflow gate must advance on a declared semantic postcondition/evidence threshold, not on provider acknowledgement or engine completion alone.**

This gives architectural meaning to the emerging “assembly line” model: longitudinal saga progress crosses a gate only when required invariants, authority and evidence are satisfied; transverse capability invocations may use different providers and transaction mechanisms underneath.

## Coordination should be requirement-driven, not topology-driven

Bailis/I-confluence and CALM materially refine the initial hypothesis. The SB should not expose a global switch such as `strongConsistency=true` for the entire system. It should model invariant-scoped requirements close to the semantic operation/resource boundary.

Examples:

- append-only evidence/fact accumulation can often be monotonic and coordination-light;
- decrementing a bounded balance under `balance >= 0` generally requires coordination unless the domain is partitioned/escrowed so independent operations become invariant-preserving;
- duplicate publication can be tolerated if semantic consumers are idempotent and correlation identity is preserved;
- mutually exclusive approval or unique allocation may require expected revision/serialization/ownership coordination;
- analytics projections may accept lag while canonical money/entitlement state may not.

This suggests `ConsistencyRequirement` should be an explicit requirement/profile attached to specific operations/invariants, not a universal runtime mode.

## Semantic boundary states — recommended refinement

### `ACKNOWLEDGED`
Provider/runtime confirms receipt or admission. It proves neither commit nor business effect.

### `LOCALLY_COMMITTED`
A declared local atomic boundary has committed. It is authoritative only for that boundary. If an outbox record is committed with the domain mutation, this proves durable publication intent, not downstream delivery.

### `BUSINESS_EFFECTIVE`
The canonical postcondition required by the operation is known to hold in its authoritative semantic scope. This may equal local commit for a purely local operation; for external payment/inventory/provider operations it may require reconciliation or authoritative remote evidence.

### `OBSERVED / VALIDATED`
Evidence independently or subsequently confirms the effective state at a named revision/time/scope. Observation can become stale and must not retroactively change what earlier evidence proved.

### `OUTCOME_UNKNOWN / INCONCLUSIVE`
The system cannot safely infer success or failure. Example: timeout after request where provider may have committed the external effect. This state must block unsafe blind retry or advancement unless the operation's declared semantics make replay safe.

### `COMPENSATED`
A compensating operation completed its own postconditions. It does **not** mean the original effect never occurred; history must preserve both.

## Consequences for CapabilityOperation and CumulativeExecutionContext

A capability operation should not emit an unqualified DTO named `result=success`. It should contribute a typed semantic result/evidence object with at least the identities needed to interpret scope:

```text
OperationOutcomeEvidence {
  operationIdentity + revision
  invocation/correlation identity
  subject/resource/business reference
  attempt identity
  realization/provider profile
  outcome class
  authoritative scope
  observed/committed revision if applicable
  postconditions proven
  evidence provenance + time/freshness
  idempotency/concurrency evidence when required
}
```

The exact object model is for synthesis. Cumulative execution context should reference these results/evidence and preserve prior ambiguous/compensated states rather than overwrite them with a latest boolean status.

## Provider-specific vs portable semantics

### Portable candidates

- business invariant and postcondition identity/revision;
- consistency requirement/profile scoped to operation/resource/invariant;
- expected revision/precondition semantics;
- semantic idempotency/correlation identity;
- outcome distinction between attempted/acknowledged/committed/effective/observed/unknown/compensated;
- gate admission requirement based on qualified evidence;
- compensation/reconciliation requirement;
- evidence scope/freshness/provenance.

### Provider/runtime realization

- PostgreSQL Serializable/locks/predicate locks;
- DynamoDB `TransactWriteItems`, condition expressions and token windows;
- Kafka producer transactions, offsets and `read_committed`;
- Temporal activity retries/history/compensation implementation;
- provider-specific 2PC, leases, fencing token implementation;
- concrete outbox table/CDC technology.

### Do not universalize

- SQL isolation-level names as business invariants;
- Kafka offsets/transactional IDs as semantic operation identity;
- provider idempotency token lifetime as canonical business idempotency lifetime;
- workflow-engine task completion as proof of business effect;
- one universal `exactlyOnce=true` flag.

## Failure / adversarial analysis

- **Lost acknowledgement after effect:** external provider commits, response is lost. Treating timeout as failure then retrying can duplicate an irreversible effect.
- **Ack-before-effect:** provider accepts an async request but later fails. Advancing workflow at acknowledgement produces false success.
- **Local commit + publication failure:** domain data commits but downstream notification/event is absent; outbox/provenance must preserve durable intent and separate publication state.
- **Message exactly-once overclaim:** Kafka exactly-once inside Kafka is treated as unique effect in SAP/payment system; correctness fails outside Kafka's transactional closure.
- **Idempotency-window mismatch:** provider token is valid 10 minutes but business duplicate protection must last days/months; semantic contract cannot inherit provider TTL silently.
- **Concurrent bounded-resource mutation:** two valid operations violate a global invariant when individually applied; eventual merge cannot repair without domain-specific reservation/escrow/rejection.
- **Compensation fiction:** refund succeeds after charge; history is rewritten as if charge never occurred. Audit/legal/economic semantics become false.
- **Stale observation:** earlier healthy/effective evidence is reused after relevant state/provider/policy revision. Gate crosses on stale proof.
- **Provider downgrade:** replacement provider lacks required transaction/order semantics but binding succeeds by silently weakening guarantees.

## Proof obligations created/refined

### DR-TCE-01 — Ack is not effect
An external operation returns provider acknowledgement before its domain effect. Workflow must not cross an `effective-required` gate until postcondition evidence is available.

### DR-TCE-02 — Lost response after committed external effect
Inject response loss after external commit. The invocation enters `OUTCOME_UNKNOWN`; blind retry is denied unless idempotency/reconciliation proof makes it safe. Reconciliation later resolves the original correlation identity.

### DR-TCE-03 — Local serializable invariant, two providers
Protect the bounded-balance invariant using two materially different realizations (e.g. serializable relational transaction and conditional/transactional key-value write). Same semantic invariant/postcondition survives provider substitution; implementation mechanics differ.

### DR-TCE-04 — Non-confluent invariant requires coordination
Run two concurrent debit/allocation operations that are individually valid but jointly violate the invariant. A coordination-free realization must be rejected/degraded unless the semantic model is redesigned (e.g. escrow/partitioned rights) to make operations invariant-preserving.

### DR-TCE-05 — Coordination-free monotonic case
Append two independent evidence/fact outputs concurrently. Demonstrate deterministic union/lineage without introducing unnecessary global serialization.

### DR-TCE-06 — Outbox boundary
Commit domain mutation + publication intent atomically, then fail broker publication. Domain commit remains effective, publication remains pending/failed; replay publishes without duplicating domain mutation; downstream idempotency is proven separately.

### DR-TCE-07 — Kafka closure boundary
Prove exactly-once processing inside Kafka topics, then write the same logical effect to an external system without a shared atomic boundary. Acceptance must refuse to label external business effect exactly-once unless external cooperation/correlation proof exists.

### DR-TCE-08 — Compensation preserves history
Complete effect A, fail later step B, execute compensation C. Evidence retains A and C separately; final business state may be acceptable but must not claim atomic rollback/“A never occurred.”

### DR-TCE-09 — Idempotency lifetime mismatch
Provider idempotency token expires while business operation correlation is still semantically active. Duplicate request must still be prevented/reconciled by SB semantics or explicitly become unsafe/unsupported; provider TTL cannot silently redefine business identity.

### DR-TCE-10 — Gate freshness
A stage gate has valid effect evidence, then relevant resource/provider/policy revision changes before advancement. Gate must requalify according to declared freshness/dependency rules rather than reuse stale PASS.

### DR-TCE-11 — Weaker provider replacement
Replace a provider with one lacking required atomic/order/concurrency semantics. Binding must produce incompatible/PARTIAL/degraded admission requiring explicit authorization, not silently weaken the consistency contract.

### DR-TCE-12 — Human approval + state race
An authorized approval is issued against resource revision N, but the resource changes to N+1 before application. Expected-revision/postcondition rules must reject/requalify the stale approval rather than treat human authority as a concurrency bypass.

## Consequences for existing hypotheses/findings

1. **KEEP / GENERALIZE:** `BusinessInvariant`, `Postcondition`, expected-state/version preconditions and semantic correlation/idempotency remain strong portable candidates.
2. **GENERALIZE:** add an evidence-qualified operation-outcome model that distinguishes acknowledgement, local commit, business effectiveness, observation and ambiguity. Exact names remain synthesis-controlled.
3. **SPECIALIZE:** `Gate` should not be promoted merely as a generic branch primitive; Generation 2 should distinguish ordinary control predicates from **semantic stage admission gates** whose transition depends on qualified invariant/postcondition/authority evidence.
4. **KEEP:** cumulative execution context should accumulate immutable/reconstructable outcome and evidence lineage rather than overwrite prior attempts/ambiguity/compensation.
5. **PROVIDERIZE:** SQL isolation, broker transactions, DB conditions, workflow history, locks/leases/fencing and outbox/CDC mechanics.
6. **DO_NOT_BUILD:** provider acknowledgement or engine task completion as canonical business success.
7. **DO_NOT_BUILD:** universal exactly-once business effect claim across arbitrary external systems.
8. **GENERALIZE:** provider compatibility negotiation must include required consistency semantics, not only API/capability shape.
9. **GENERALIZE:** coordination requirement should be scoped to invariants/operations, informed by whether operations are monotonic/invariant-confluent rather than by topology alone.

No independent top-level Transaction capability is promoted by this deep dive. The evidence is stronger for a cross-cutting semantic consistency model specialized across Data, Workflow, Integration, Provider/Binding and domain capabilities.

## Contradictions resolved

- **“Strong consistency everywhere is safest” vs scalability/provider leverage:** rejected. Correctness requires coordination where invariants demand it, not globally.
- **“Eventual consistency everywhere is more modern” vs bounded/non-confluent invariants:** rejected. Some invariants intrinsically require coordination unless the semantic operation model is redesigned.
- **“Exactly-once provider delivery means business exactly-once”:** rejected by Kafka's explicitly scoped guarantees and external-destination boundary.
- **“Saga compensation equals rollback”:** rejected. Compensation is a new committed semantic effect.
- **“Workflow task succeeded means process stage succeeded”:** rejected unless task completion itself proves the declared semantic postcondition.

## Unresolved questions

1. Should `OperationOutcomeEvidence` become one universal primitive or specialize a broader Attempt→Effective→Observed evidence primitive already emerging across G2?
2. Should semantic stage admission be called `Gate`, `StageTransitionPolicy`, `PostconditionGate`, or remain a composition pattern? Avoid naming freeze before synthesis.
3. How should domain-specific invariant languages be expressed without creating an unsafe generic executable rule DSL?
4. How should escrow/reservation rights be modeled for offline Stations so selected bounded-resource operations can remain available under partition?
5. Which freshness dependencies must force gate requalification after policy/schema/provider/resource revision?
6. How much formal monotonicity/I-confluence analysis can reasonably be automated for generated systems versus represented as conservative profiles/proofs?

## Confidence

**High** for the core separation among acknowledgement, scoped commit, business effectiveness, observation and ambiguity; **high** that provider-level exactly-once must not be universalized; **high** that compensation differs from rollback; **medium-high** that invariant-scoped coordination belongs in portable requirements; **medium** on the final primitive vocabulary and whether semantic stage admission deserves a first-class object.

## Recommended disposition for synthesis

- **KEEP / GENERALIZE:** business invariants, semantic postconditions, correlation/idempotency identity, expected-state preconditions and evidence-qualified stage advancement.
- **MERGE:** attempted/effective/observed outcome semantics with the broader G2 qualified-evidence lineage rather than duplicate a transaction-only status system.
- **SPECIALIZE:** consistency requirements by operation/invariant; strong atomicity, ordering and isolation only where demanded.
- **PROVIDERIZE:** concrete ACID, conditional-write, broker transaction, saga runtime, outbox/CDC, locking/lease/fencing mechanisms.
- **DEFER:** exact invariant DSL, formal automatic I-confluence/CALM analysis, escrow/right-allocation language.
- **DO_NOT_BUILD:** universal distributed ACID, universal exactly-once business effect, or `provider ACK == semantic SUCCESS`.

## Next high-value deep question

**Offline/edge bounded-resource coordination and Station authority:** can the SB safely pre-allocate rights/escrow/leases/capability budgets to disconnected Stations so selected non-confluent invariants remain available without central coordination, while preserving non-amplifying authority, reconciliation evidence and provider-neutral semantics?