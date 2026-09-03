# Deep Research — Composite Saga Effect Closure Across Heterogeneous Sinks 01

Status: DEEP RESEARCH / RESEARCH RECOMMENDATION / NOT TARGET-ARCHITECTURE AUTHORITY

## Question

When one longitudinal System Builder capability operation or saga stage produces effects across heterogeneous boundaries — for example a local database, a message/event channel, an external provider, a human task or a physical/manual action — what portable evidence model lets the next Gate decide `BUSINESS_EFFECTIVE`, `PARTIAL`, `OUTCOME_UNKNOWN` or `INCONCLUSIVE` **without** requiring universal distributed ACID and **without** treating each sink acknowledgement as equivalent semantic success?

This deep dive follows `DEEP_RESEARCH_TRANSACTION_COMMIT_EFFECT_01.md`, `DEEP_RESEARCH_OFFLINE_STATION_ESCROW_AUTHORITY_01.md` and `DEEP_RESEARCH_STATION_RECLAIM_FENCING_EPOCH_01.md`. Those works established that acknowledgement, local commit, business effect and observation are distinct; this run tests the unresolved composition problem when one business outcome depends on more than one such boundary.

## Why this is architecturally material

The Generation 2 longitudinal model treats a process as progressing through saga stages and Gates while consuming capabilities transversally. The hardest correctness case is no longer one provider call; it is a **composite business effect** whose proof is distributed across independently failing sinks with different completion semantics.

Examples:

- persist `OrderAccepted`, publish `OrderAccepted`, reserve payment, reserve inventory and create human fulfillment work;
- record maintenance execution, store signed evidence, notify supervision and actuate an external asset-management system;
- approve a financial action, mutate canonical ledger state, send provider instruction and wait for an asynchronous settlement event;
- offline Station consumes bounded rights locally, records evidence, later publishes/reconciles the effect centrally.

If the Gate advances after the first `200 OK`, broker acknowledgement or workflow-task completion, downstream process state can claim a business result that never became true. If instead SB demands one atomic commit across every sink, provider leverage, humans, physical effects, brownfield systems, offline operation and mature-system interoperability become infeasible.

This question therefore affects Executable Capability Composition, Transaction/Consistency/Concurrency, Workflow, Integration, Messaging, Data, Evidence/Observability, Provider/Binding, AGWS/human work, runtime autonomy and the longitudinal Gate model.

## SB corpus consumed

The run consumed the current Generation 2 research corpus as required:

- `RESEARCH_PIPELINE_STATE.json`: phase remains `RESEARCH_ELICITATION`; five full cycles are complete, cycle 6 has opened, and all four mandatory cross-capability hypotheses remain active.
- `RESEARCH_EVIDENCE_METHOD.md`: requires triangulation across mature systems, standards/specifications, scientific literature and engineering evidence, preserving contradictions rather than averaging them away.
- `ARCHITECTURE_PROOF_QUALITY_METHOD.md`: explicitly rejects provider `200 OK`, cache/build success or deployment health as proof of semantic postcondition and requires failure, idempotency/concurrency, provider substitution, evidence and recovery proofs.
- `CAPABILITY_DISCOVERY_REGISTER.md`: retains ambiguous-outcome disposition, evidence qualification, qualified local closure, faceted authority and dependency-`INCONCLUSIVE` propagation as cross-cutting consolidation concerns.
- `FINDING_INDEX.md`: current Architecture Reconciliation findings require revision-qualified desired→attempted→applied→effective→healthy lineage, reconcile-before-retry after ambiguous actuation, and upward propagation of required `PARTIAL/INCONCLUSIVE` dependencies.
- `REPRESENTATIVE_COVERAGE.md`: prior capability evidence remains authoritative in dossiers; recent reconciliation representatives strengthen effective-vs-observed and convergence-lag distinctions.
- `CAPABILITY_PROOF_MATRIX.md`: Transaction/Consistency/Concurrency, Executable Composition, Workflow, Integration and Messaging all retain explicit proof debt around atomicity, compensation, receipt-vs-domain acceptance, cumulative context, retry/replay and evidence.
- `SEMANTIC_ASSEMBLY_LINE_PROCESS_MODEL.md`: Gate is a semantic saga-stage boundary, not merely a graphical `if`; longitudinal process identity is distinct from transversal capability and provider realization.
- `DEEP_RESEARCH_EXECUTABLE_OPERATION_COMPOSITION_01.md`: capability-owned operations plus workflow-owned orchestration grammar; human task completion is not automatically a domain decision.
- `DEEP_RESEARCH_TRANSACTION_COMMIT_EFFECT_01.md`: rejects generic `SUCCESS`; distinguishes attempted/acknowledged/local-commit/business-effective/observed/unknown and requires semantic postcondition evidence before Gate progression.
- `DEEP_RESEARCH_OFFLINE_STATION_ESCROW_AUTHORITY_01.md`: separates authorization from conserved resource rights and shows local effects may be valid under bounded offline closure without central coordination.
- `DEEP_RESEARCH_STATION_RECLAIM_FENCING_EPOCH_01.md`: separates failure suspicion from stale-owner exclusion and shows provider/lease acknowledgement is not sufficient to transfer effective ownership safely.

Breadth findings are treated as hypotheses and accumulated evidence, not independent factual sources.

## External evidence ledger

### E1 — Garcia-Molina & Salem, `Sagas` (ACM SIGMOD, 1987)
Source: https://doi.org/10.1145/38713.38742

The original Saga model decomposes a long-lived transaction into committed subtransactions and compensating transactions. It does not provide one physical atomic commit across arbitrary participants; later failure is handled by explicit continuation/compensation semantics.

**Evidence value:** foundational negative evidence against a universal cross-sink atomic commit primitive. It supports retaining per-effect completion lineage and business-specific recovery.

### E2 — AWS Saga orchestration guidance
Source: https://docs.aws.amazon.com/prescriptive-guidance/latest/cloud-design-patterns/saga-orchestration.html

AWS describes saga orchestration as coordination of local transactions across services when a single 2PC-style transaction is unavailable or unsuitable. Failures cause compensating transactions rather than erasure of already completed work.

**Evidence value:** mature production guidance that the orchestrator can coordinate progression/recovery while each participant retains its own transaction boundary.

### E3 — AWS Transactional Outbox guidance
Source: https://docs.aws.amazon.com/prescriptive-guidance/latest/cloud-design-patterns/transactional-outbox.html

AWS explicitly documents the dual-write gap between a database mutation and event publication. The outbox pattern makes the business mutation plus durable publication intent atomic **inside one database**, then performs broker publication asynchronously. Duplicate publication remains possible and consumers require idempotency.

**Evidence value:** decisive evidence that one business operation may have multiple completion frontiers: local canonical mutation committed, publication intent committed, broker delivery pending/duplicated, downstream acceptance still separate.

### E4 — Apache Kafka transactions / exactly-once scope
Sources:
- https://kafka.apache.org/41/design/design/
- https://kafka.apache.org/43/streams/core-concepts/

Kafka can atomically commit produced records and consumed offsets inside the Kafka transactional closure. Kafka documentation distinguishes this tightly integrated closure from external systems that may have side effects.

**Evidence value:** strong provider evidence that `exactly once` is meaningful only with an explicit closure. Kafka transaction success cannot prove a Stripe/SAP/human/physical effect.

### E5 — Stripe asynchronous payment events
Source: https://docs.stripe.com/webhooks/handling-payment-events

Stripe documents payment outcomes that occur outside the initiating request flow and are observed through later webhook events such as `payment_intent.succeeded` or dispute events.

**Evidence value:** mature external-provider evidence that request completion, provider object state and later business-significant settlement/event evidence can be temporally distinct. A Gate must declare which provider state/event qualifies its postcondition.

### E6 — Camunda 8 User Tasks
Source: https://docs.camunda.io/docs/components/modeler/bpmn/user-tasks/

Camunda creates a durable user-task instance, pauses the process, and resumes when the task is completed; input/output mappings control what data enters/leaves the task. The engine's task completion is a workflow fact.

**Evidence value:** strong evidence that human-work completion is a separate sink/completion protocol. It does **not** independently establish that a domain postcondition such as `PurchaseApproved`, a physical inspection or an external settlement is true unless the domain contract/evidence says so.

### E7 — Camunda compensation semantics
Source: https://docs.camunda.io/docs/components/modeler/bpmn/compensation-handler/

Camunda invokes compensation handlers for completed activities; compensation itself is executable work and may have its own sequencing and interruption semantics.

**Evidence value:** production evidence that completed effects remain historically real and that recovery creates additional effects. Composite closure must retain both original and compensating evidence.

### E8 — Microsoft/Azure Compensating Transaction pattern
Source: https://learn.microsoft.com/en-us/azure/architecture/patterns/compensating-transaction

Microsoft emphasizes that compensating actions are eventually consistent, may not restore the exact original state, can fail, may require idempotency and sometimes require human intervention.

**Evidence value:** strong negative evidence against treating `COMPENSATED` as equivalent to `NEVER_HAPPENED`, and against assuming all composite failures can be automatically rolled back.

### E9 — TCC literature / Pardon & Pautasso 2014
Source: https://design.inf.usi.ch/publications/2014/wsrest/tcc

Try-Confirm/Cancel demonstrates a stronger coordination model where participants expose provisional reservation semantics before a coordinated confirm/cancel decision.

**Evidence value:** useful counterexample to pure saga compensation. Stronger composite guarantees are possible when **participants are designed to cooperate**. Therefore SB should support stronger profiles without making them universal.

## Competing models

### Model A — Flatten all sink results into one operation `SUCCESS`

```text
operation executes
→ DB 200
→ broker ACK
→ provider 200
→ task complete
→ SUCCESS
```

**Strength:** simplest API and UX.

**Failure:** each acknowledgement proves a different fact. It cannot represent DB committed + message pending, provider accepted + settlement failed later, human task completed + decision unauthorized, or physical action claimed but unverified.

**Disposition:** `DO_NOT_BUILD` as canonical semantics. A UI may derive a simplified label only after qualification.

### Model B — Universal distributed atomic transaction across every sink

The saga stage commits only if all databases, brokers, providers, humans and external systems participate in one atomic transaction.

**Strength:** straightforward all-or-nothing reasoning.

**Failure:** impossible or impractical for humans, physical actions, most SaaS APIs, brownfield systems and offline Stations. It also destroys provider leverage and availability. Sagas, outbox and external async provider evidence contradict universality.

**Disposition:** `DO_NOT_BUILD` as universal model. Allow an atomic closure profile where all participants genuinely support it.

### Model C — Workflow engine completion is the composite source of truth

If the workflow engine records every task as complete, the composite business operation is considered effective.

**Strength:** one durable control-plane source.

**Failure:** engine history proves orchestration progress, not external semantic truth. Workers may report completion before async provider settlement; humans can complete a task without sufficient decision authority; physical work can be reported incorrectly; external effect acknowledgement can be lost or delayed.

**Disposition:** `REJECT` as semantic authority. Workflow history is important evidence but only one evidence source.

### Model D — Boolean conjunction of all sink acknowledgements

A composite effect is effective iff every declared sink returned successful acknowledgement.

**Strength:** better than one arbitrary ACK and easy to implement.

**Failure:** still conflates acknowledgement with effect. It cannot express different proof thresholds, optional/advisory sinks, asynchronous postconditions, compensation, stale evidence, or sinks that are merely observability/notification consequences rather than constitutive business effects.

**Disposition:** `REJECT` as general model.

### Model E — Evidence-qualified effect obligations with explicit closure policy

A semantic operation/stage declares **effect obligations**. Each obligation names the business postcondition it must prove, the authoritative scope, completion/evidence threshold, criticality and recovery semantics. Provider/runtime acknowledgements are translated into evidence for those obligations but do not define them.

Conceptual form:

```text
CompositeEffectRequirement
  obligation A: canonical state mutation
  obligation B: external payment settlement
  obligation C: durable publication intent
  obligation D: human authorized decision
  obligation E: notification (advisory)

Each obligation
  → semantic postcondition
  → evidence requirement / authority / freshness
  → realization(s)
  → outcome evidence

Gate Closure Policy
  → which obligations are CONSTITUTIVE
  → which are REQUIRED_BEFORE_ADVANCE
  → which may remain DURABLE_PENDING
  → which are ADVISORY / BEST_EFFORT
  → compensation/reconciliation rules
```

The composite state is derived from the obligation vector rather than stored as one provider-shaped boolean.

**Disposition:** strongest model; `KEEP/GENERALIZE` as research recommendation.

## Strongest conclusion

The highest-confidence conclusion is:

> **Composite business effectiveness is a property of a declared semantic obligation set and its qualified evidence, not of the orchestration engine, transport ACKs or the physical number of sinks.**

A saga Gate should therefore evaluate a revision-bound **closure policy** over typed effect obligations.

This need not become a large new universal object model. Synthesis should attempt to merge it with the emerging universal evidence vector, semantic postconditions, dependency qualification and Gate admission semantics.

## Required distinction: constitutive effect vs consequence

Not every external effect should block business progression.

Example `Order.Accept`:

```text
Constitutive / must hold before Gate:
- order canonical state = ACCEPTED
- inventory reservation valid
- payment authorization/settlement threshold satisfied

Durable-pending consequence:
- OrderAccepted event has committed publication intent

Advisory consequence:
- customer email notification
- analytics projection
```

If notification failure blocks the same Gate as payment failure, the architecture accidentally turns every side effect into a global transaction participant. Conversely, if payment settlement is treated like an advisory email, semantic correctness is lost.

Candidate portable classification (names not frozen):

- `CONSTITUTIVE` — part of the operation's business postcondition;
- `GATE_REQUIRED` — evidence required before this saga transition, even if not itself canonical domain state;
- `DURABLE_PENDING_ALLOWED` — durable intent/obligation must exist, but downstream completion may occur after Gate;
- `ADVISORY` — failure is observable but does not invalidate the semantic outcome;
- `COMPENSATION_REQUIRED_ON_FAILURE` — later failure changes recovery path;
- `MANUAL_DISPOSITION_REQUIRED` — cannot be safely automated.

Synthesis should compress these into the smallest sufficient vocabulary.

## Composite evidence vector

A portable composite closure needs to preserve **per-obligation evidence**, not only aggregate status.

Illustrative, non-final form:

```text
CompositeEffectEvidence {
  semanticOperation + revision
  invocation/correlation identity
  stage/gate revision
  obligations[] {
    obligationIdentity + revision
    postconditionIdentity
    criticality / gate relation
    authoritativeScope
    realization/provider profile
    attempt/generation
    outcomeClass
    evidenceRefs[]
    observed/effective revision
    freshness / expiry
    idempotency / correlation evidence
    compensation/reconciliation lineage
  }
  aggregateDisposition
}
```

The aggregate disposition is **derived** from current obligation evidence and closure policy.

Examples:

```text
BUSINESS_EFFECTIVE
  all constitutive + gate-required obligations proven
  durable-pending obligations have required durable intent
  no unresolved contradiction invalidates them

PARTIAL
  some obligations completed, others explicitly failed/pending
  and policy allows truthful partial representation

OUTCOME_UNKNOWN
  a specific effect may or may not have occurred
  and reconciliation is required before retry/progression

INCONCLUSIVE
  required evidence/dependency is unavailable, stale, incompatible or insufficient

COMPENSATED
  original effect lineage + successful compensating effect lineage retained
```

Exact names remain deferred to synthesis.

## Dependency semantics: AND is not enough

A composite Gate is not simply `all(child.status == PASS)`.

The closure function must understand:

1. which obligations are semantically constitutive;
2. which evidence classes qualify each obligation;
3. freshness/revision scope;
4. contradictory evidence;
5. allowed durable-pending consequences;
6. compensation/reconciliation state;
7. optional/advisory obligations;
8. authority required to accept degraded/manual disposition.

Candidate principle:

> **Required uncertain evidence propagates `INCONCLUSIVE`; optional/advisory uncertainty remains visible without automatically invalidating the business effect.**

This generalizes current Architecture Reconciliation dependency-`INCONCLUSIVE` findings into saga effect closure without forcing every dependency to be mandatory.

## Provider-specific vs portable semantics

### Portable candidates

- semantic effect/postcondition obligation identity + revision;
- obligation criticality/relationship to Gate progression;
- authoritative semantic scope;
- operation/stage correlation identity;
- outcome classes such as attempted/acknowledged/committed/effective/unknown/compensated where applicable;
- evidence provenance, freshness and revision qualification;
- semantic idempotency/correlation requirement;
- compensation/reconciliation/manual-disposition requirement;
- derived composite closure disposition;
- rule that provider substitution cannot silently weaken an obligation's required proof threshold.

### Provider/runtime realization

- SQL transaction and outbox table mechanics;
- Kafka producer transactions, offsets, delivery acknowledgements;
- Stripe PaymentIntent/webhook state and idempotency mechanics;
- Camunda/Temporal task completion/history;
- TCC Try/Confirm/Cancel implementation;
- provider-specific webhook IDs, task IDs, offsets, ARNs or transaction IDs;
- specific CDC implementation;
- external ERP commit/ack protocol.

### Do not universalize

- one provider's `SUCCESS` enum;
- HTTP status codes as semantic postconditions;
- Kafka transaction boundaries as arbitrary multi-system atomicity;
- BPMN activity completion as domain effect proof;
- Stripe webhook type names as portable payment semantics;
- one fixed distributed transaction algorithm;
- a requirement that every side effect block the same Gate.

## Human and physical effects

Human/physical work is the strongest falsifier of an infrastructure-only closure model.

A human task can produce at least three distinct facts:

```text
task completed
actor identity / authority evidence
semantic decision or physical-work evidence
```

They are not interchangeable.

Example:

```text
Task: inspect aircraft component
  completed = true
```

cannot by itself prove:

```text
InspectionResult = PASS
inspector held required authority/certification
physical component state actually satisfies the required postcondition
```

The same principle applies to AI agents: technical tool completion cannot manufacture semantic authority or physical truth.

## Interaction with longitudinal Gates

The assembly-line model becomes more precise:

```text
Saga Stage
  ├─ operation A → DB effect obligation
  ├─ operation B → provider effect obligation
  ├─ human station → decision/evidence obligation
  ├─ publication → durable-pending obligation
  └─ notification → advisory obligation
            ↓
        Gate closure
            ↓
      Next saga stage
```

A Gate is therefore a **semantic closure evaluator over current revision-qualified evidence**, not a transport synchronization barrier.

The same process can use simple ergonomics in a small runtime: if all constitutive effects are local in one database transaction, the closure may collapse to one local commit/postcondition proof. The architecture must not require distributed-systems ceremony where no heterogeneous boundary exists.

## Stronger profiles remain possible

This deep research does not prohibit stronger atomic coordination.

If all participants support a compatible closure, profiles may use:

- one local ACID transaction;
- Kafka-native atomic processing inside Kafka's closure;
- TCC-style reserve/confirm/cancel;
- provider-supported atomic multi-resource transaction;
- other proved coordination mechanisms.

The portable requirement says **what semantic obligations must close**, while provider negotiation determines whether one stronger realization can satisfy several obligations atomically.

Candidate rule:

> **Own the closure semantics; delegate the coordination mechanism.**

## Failure and adversarial analysis

### F1 — DB commit, message publish lost
Canonical state is effective; publication intent may or may not be durable. If no outbox/durable intent exists, event consequence is failed/unknown. Gate treatment depends on whether publication is constitutive, gate-required or durable-pending.

### F2 — Broker ACK, downstream rejection
Broker acceptance proves transport publication, not target-domain acceptance. Downstream business obligation remains unsatisfied.

### F3 — Provider accepts async request, later fails
`ACKNOWLEDGED` cannot satisfy a settlement/effective-required obligation. Later authoritative failure changes the obligation state and may trigger compensation/recovery.

### F4 — Provider effect succeeds, response lost
Obligation becomes `OUTCOME_UNKNOWN`; blind duplicate request is unsafe unless correlation/idempotency/reconciliation evidence permits it.

### F5 — Human task completed by unauthorized actor
Workflow task completion evidence exists; semantic decision obligation fails authority qualification and Gate remains closed.

### F6 — Physical task claimed complete, inspection evidence absent
Task workflow may complete, but physical postcondition remains unproven/`INCONCLUSIVE` if the Gate requires objective evidence.

### F7 — Advisory notification fails
Business effect remains effective when notification is explicitly advisory; evidence must still show delivery failure for operations/support.

### F8 — Compensation succeeds after irreversible original effect
Composite history retains original effect + compensation. Aggregate may be `COMPENSATED`, not rewritten to `NOT_EXECUTED`.

### F9 — Stale evidence after provider/policy revision
Previously qualified obligation evidence becomes stale/inapplicable if the closure policy requires newer authority/provider/domain revision.

### F10 — Provider substitution weakens threshold
Provider B offers only request ACK while obligation requires authoritative settlement. Binding/admission must reject or explicitly mark incompatible/degraded; it cannot silently map ACK to effective.

### F11 — Two sinks disagree
External ERP reports accepted while canonical DB shows rejected revision, or vice versa. Composite closure is contradiction/`INCONCLUSIVE` until explicit reconciliation; last-writer-wins status aggregation is unsafe.

### F12 — Offline Station reconnect
Local constitutive effect may be valid under qualified local closure while central publication/reconciliation is pending. Gate policy determines which local stages may advance; reconnection creates new evidence obligations without retroactively erasing valid local history.

## Consequences for existing findings/candidates/hypotheses

### Executable Capability Composition & Cumulative Context
`KEEP/HARDEN`: operation outputs should contribute typed obligation/evidence references rather than one DTO success flag. Cumulative context retains per-effect lineage and does not overwrite ambiguity/compensation history.

### Transaction / Consistency / Concurrency
`GENERALIZE`: prior outcome-state model must support a vector of heterogeneous effect obligations. Atomicity is closure-scoped, not operation-name-scoped.

### Workflow & Durable Execution
`SPECIALIZE`: Workflow owns orchestration, waiting, retry, compensation progression and Gate evaluation mechanics; it does not become the semantic owner of external/domain postconditions.

### Integration & Automation / Messaging
`KEEP`: delivery/publication acknowledgement remains distinct from target-domain acceptance. Transactional outbox proves durable intent, not downstream business completion.

### Data
`KEEP`: local ACID may satisfy one or several obligations inside a declared atomic boundary, but must not be projected as global business atomicity.

### Authorization / AGWS / AI
`HARDEN`: task/tool completion is separate from actor authority and semantic decision evidence.

### Provider / Binding
`GENERALIZE`: compatibility/admission must include whether a provider can produce the required evidence threshold/closure semantics, not only whether it exposes a functionally named API.

### Architecture Reconciliation / qualified evidence
`MERGE`: composite effect closure should reuse revision-qualified evidence vector, contradiction handling and dependency-`INCONCLUSIVE` propagation rather than create a duplicate evidence subsystem.

### Candidate primitive disposition
No new top-level capability is proposed. A `CompositeEffectClosure`-like primitive is a **CONSOLIDATION CANDIDATE**, likely mergeable into universal semantic postcondition/evidence/dependency qualification + workflow Gate semantics. Exact object names are `DEFER` to Capability Synthesis.

## Proposed research dispositions

- **KEEP** — semantic postcondition and invariant ownership independent of provider mechanics.
- **KEEP** — operation outcome states richer than generic `SUCCESS`.
- **GENERALIZE** — from one operation outcome to a revision-qualified vector of effect obligations.
- **MERGE** — composite closure with existing evidence qualification and dependency-`INCONCLUSIVE` primitives; do not create a parallel proof framework.
- **SPECIALIZE** — Gate is the workflow/process consumer of closure evidence; domain/capabilities own postconditions.
- **PROVIDERIZE** — outbox, Kafka transactions, TCC, provider async/webhook, workflow-engine task protocols and concrete atomic mechanisms.
- **DO_NOT_BUILD** — universal distributed ACID across arbitrary sinks.
- **DO_NOT_BUILD** — provider/workflow ACK as canonical business success.
- **DO_NOT_BUILD** — one rule forcing every notification/analytics consequence to block process progression.
- **DEFER** — exact universal IR names (`EffectObligation`, `ClosurePolicy`, `CompositeEffectEvidence`) until synthesis can minimize primitives.

## Proof obligations

### DR-CSEC-01 — Local DB commit + broker failure
Commit a canonical mutation and durable outbox intent in one transaction, then fail broker publication. Prove canonical effect may be effective while publication remains pending; Gate behavior follows declared closure policy.

### DR-CSEC-02 — Broker ACK is not downstream acceptance
Publish successfully to a broker, then make downstream domain application fail. Transport obligation passes; downstream semantic obligation does not.

### DR-CSEC-03 — Async provider ACK is not settlement
External provider accepts request but later reports failure. An `effective-required` Gate must remain closed until authoritative postcondition evidence exists.

### DR-CSEC-04 — Lost response after provider effect
Inject response loss after external effect. Mark specific obligation `OUTCOME_UNKNOWN`; reconcile using stable correlation identity before retry or Gate advancement.

### DR-CSEC-05 — Human task vs semantic decision authority
Complete a user task with an actor lacking required domain authority. Workflow completion exists, but decision obligation fails and process cannot advance.

### DR-CSEC-06 — Advisory consequence failure
Make an advisory notification fail after all constitutive obligations are proven. Business effect remains effective; notification failure remains observable and recoverable without reopening canonical business outcome.

### DR-CSEC-07 — Durable-pending consequence
Commit domain state plus publication intent atomically. Permit Gate progression when closure policy says durable intent is sufficient, then complete publication asynchronously with retained lineage.

### DR-CSEC-08 — Compensation does not erase history
Complete effect A, fail effect B, compensate A. Evidence must retain A effective history + compensation attempt/effect; aggregate disposition is compensated, never “A never happened.”

### DR-CSEC-09 — Contradictory sink evidence
Two authoritative sources report incompatible effective revisions. Gate returns contradiction/`INCONCLUSIVE` and requires reconciliation rather than arbitrary status precedence.

### DR-CSEC-10 — Provider substitution threshold
Run one operation through provider A that exposes authoritative completion and provider B that only exposes acceptance ACK. If closure requires authoritative effect, B is rejected/incompatible unless another evidence path closes the requirement.

### DR-CSEC-11 — Strong atomic profile
Use a realization where several constitutive obligations are genuinely covered by one local/participant-cooperative atomic closure. Prove the portable obligation model simplifies to that closure rather than forcing unnecessary saga ceremony.

### DR-CSEC-12 — Mixed human/physical/software stage
One stage combines database state, human review and external/physical completion evidence. Gate advances only when all declared constitutive obligations and authority requirements are qualified.

### DR-CSEC-13 — Stale evidence invalidation
Qualify all obligations, then change relevant provider/policy/domain revision before Gate actuation. Prior evidence must be requalified or become stale according to closure policy.

### DR-CSEC-14 — Offline Station composite closure
Perform an allowed offline effect with locally qualified constitutive obligations while central publication is pending. Advance only Gates permitted by local closure; after reconnect, reconcile central obligations without duplicate domain effect.

### DR-CSEC-15 — Optional dependency uncertainty
Make an advisory/optional evidence provider unavailable. Composite effect remains effective if mandatory obligations are qualified, but uncertainty remains visible. Repeat with a required obligation and require `INCONCLUSIVE`.

### DR-CSEC-16 — Provider-independent historical reconstruction
Replace provider realization and reconstruct a historical composite operation from retained semantic obligation/evidence lineage without requiring old provider-native status objects as canonical truth.

## Falsification paths

This recommendation should be weakened or rejected if later evidence demonstrates that:

1. a smaller existing universal primitive can express mandatory/optional/contradictory evidence dependencies, compensation lineage and Gate thresholds without introducing effect-obligation semantics;
2. representative provider substitutions cannot map useful evidence into stable semantic postconditions without intolerable provider-specific leakage;
3. the constitutive/durable-pending/advisory distinction proves domain-specific and cannot be generalized beyond documentation conventions;
4. Gate semantics become simpler and more correct when wholly owned by another existing primitive discovered in later UCA research;
5. real enterprise scenarios show that a composite vector is operationally too expensive and an alternative proof model provides equivalent correctness with simpler-system ergonomics.

## Unresolved questions

1. Is an `EffectObligation` a universal primitive, a specialization of generic requirement/dependency evidence, or merely a process-model projection?
2. Should Gate closure policy live in Workflow, Process/Application Modeling, or a shared semantic requirement layer?
3. How should contradictory authoritative sources be ranked, if ever, versus always requiring explicit reconciliation?
4. How should irrevocable physical/legal effects be represented when no machine-verifiable postcondition exists?
5. What is the smallest useful criticality vocabulary for constitutive vs durable-pending vs advisory effects?
6. How should long-lived workflow definition migration transform an in-flight obligation set without silently changing success criteria?
7. Can one provider binding satisfy several obligations through one proved atomic closure, and how is that proof advertised/conformed?
8. How should Commercial Metering/Entitlements/Billing classify usage-record publication: constitutive billing fact, durable-pending evidence, or advisory telemetry under different commercial models?
9. How should privacy/data-retention policies prune evidence payloads while retaining enough proof for historical composite closure?
10. How does composite closure interact with temporal deadlines: is “effective after deadline” a success, failure, compensated success or separate domain outcome?

## Confidence

**High** confidence in these conclusions:

- arbitrary heterogeneous sinks cannot be treated as one implicit atomic transaction;
- ACK/task completion is not universally equivalent to business effect;
- composite effectiveness must be evaluated from semantic postconditions and qualified evidence;
- per-effect lineage is necessary for ambiguity, compensation and recovery;
- provider mechanisms should satisfy portable closure requirements rather than define them.

**Medium-high** confidence that an explicit obligation vector is the right conceptual model.

**Medium** confidence in the proposed criticality categories and in whether `EffectObligation` deserves a first-class universal IR object; synthesis should aggressively merge/minimize this vocabulary.

## Recommended next deep question

**Long-lived Gate criteria evolution:** when a saga is already in flight and the operation definition, policy, authority requirement or composite closure policy changes, which criteria remain pinned to the origin revision, which may be safely requalified under a newer revision, and what explicit migration evidence is required so that an in-flight process is neither silently weakened nor permanently stranded?
