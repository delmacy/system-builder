# G4 — Capability Exchange Causality, Saga & Long-Lived Workflow Research

Status: `RESEARCH_ACTIVE / NON_EXECUTABLE`
Execution authority: NONE
Date: 2026-09-18
Parent family: Shared Semantic Kernel / Capability Exchange Plane / Inter-Capability Boundary Model

## Purpose

Deepen the eighth G4 family at the boundary between cross-capability causation, long-lived workflow/saga state, compensation and federated partition/reconnect. This is a material subfront, not a ninth macro-family. It selects no workflow engine, broker, tracing stack or saga framework and grants no implementation authority.

The core problem is to preserve causal and recovery semantics when a business process crosses independently owned capabilities without turning the Capability Exchange Plane into the owner/orchestrator of that business process.

```text
Exchange Plane owns exchange semantics
Capability/workflow owner owns business process semantics
Trace context observes execution lineage
Causation records semantic lineage
Neither trace nor exchange correlation creates business authority
```

## Evidence classes reviewed

- AWS Prescriptive Guidance saga patterns: saga decomposes a distributed business transaction into local transactions; choreography and orchestration have different coupling/visibility/failure trade-offs. Orchestration centralizes workflow coordination and can become a single point of failure; choreography avoids one coordinator but dependencies become harder to track as participants grow.
- Azure Architecture Center Saga and Compensating Transaction patterns: compensation is domain-specific recovery, not necessarily reverse-order rollback; compensation itself can fail, may require durable progress, idempotent/retryable steps and sometimes human intervention. A pivot may create a point after which backward compensation is no longer the appropriate recovery model.
- W3C Trace Context: `traceparent`/`tracestate` standardize distributed tracing propagation and request lineage, but are observability context rather than identity, authority or business-causality proof.
- OpenTelemetry context/baggage guidance: context can cross process boundaries, but baggage may leak sensitive information and has no built-in integrity guarantee; incoming propagated context must be treated as untrusted across trust boundaries.
- Existing G4 temporal/federation research: timestamp order is not causal order; replay is a new execution context; transport reconnect is not semantic convergence; backlog is not automatically executable.

These evidence classes constrain semantics and failure cases only.

## 1. Cross-capability process ownership must remain explicit

A process may span capabilities A, B and C, but the Exchange Plane must not become the semantic owner merely because all crossings pass through it.

Candidate separation:

```text
Process / Saga Definition Owner
  business sequence/guards
  completion criteria
  compensation/recovery policy
  pivot/irreversibility semantics
  business authority

Capability Participant
  local transaction/effect
  local preconditions/postconditions
  local canonical state
  participant evidence

Capability Exchange Plane
  contracted crossing
  delivery/currentness/compatibility evidence
  correlation/causation propagation
  retry/dedup/reconciliation disposition
  no business-step invention
```

Invariants:

- `Exchange routing != workflow orchestration authority`.
- `Gateway sees every step != gateway owns the process`.
- `Participant completed local effect != whole process completed`.
- `Whole process failed != every completed local effect is reversible`.
- `Workflow coordinator component != Exchange Plane by definition`.

A workflow/saga coordinator may be a legitimate capability/provider realization, but its business semantics must be explicit and independently owned rather than smuggled into exchange infrastructure.

## 2. Correlation, trace lineage and business causation are different relations

W3C Trace Context is intentionally about distributed tracing interoperability. OpenTelemetry context/baggage can carry cross-cutting data, but propagated baggage has no built-in integrity proof and may cross unintended boundaries. Therefore tracing identifiers are useful observation evidence but cannot substitute for business causation or authority.

Candidate distinctions:

```text
CorrelationRef
  groups related exchanges/occurrences for a declared purpose

CausationRef
  asserts that occurrence/intent B was produced because of qualified predecessor A

TraceContext
  observability execution lineage; may be restarted/sampled/truncated

WorkflowOccurrenceRef
  identity of the long-lived business/process occurrence

AuthorityRef
  qualified authority/delegation evidence for a business effect
```

Invariants:

- `Same trace != same business transaction`.
- `Trace parent != business causation proof`.
- `Correlation != causation`.
- `Causation != authorization`.
- `Baggage propagated != baggage trusted`.
- `Trace sampled/dropped != business lineage may be dropped`.

Business causation that matters for replay, compensation, audit or conflict resolution therefore needs durable semantic evidence independent of telemetry retention.

## 3. Long-lived workflow state is not a transport backlog

A cross-capability workflow can outlive one request, broker session, deployment generation or network partition. Its durable state must distinguish business progress from transport progress.

Candidate `WorkflowOccurrenceEnvelope`:

```text
workflowOccurrenceId
workflowDefinitionRef + revision
businessOwnerRef
initiatingIntentRef
participantRefs[]
current business phase/state
completedStepEvidence[]
pendingIntentRefs[]
causation graph refs
contract/provider qualification refs
business precondition/currentness refs
compensation/recovery policy revision
authority refs + expiry/currentness
partition/reconnect lineage refs
UNKNOWN/conflict refs
```

This is a research shape, not a canonical schema.

```text
Message delivered != workflow step effective
All messages drained != workflow complete
Workflow state persisted != participant effects converged
Coordinator alive != workflow semantically current
```

## 4. Compensation is a new business effect, not time reversal

Azure's compensating-transaction guidance is especially important: compensation may need domain-specific rules, may not execute in exact reverse order, can fail itself, and sometimes requires human intervention. Concurrent work may make restoration of the exact previous state invalid or destructive.

Therefore:

```text
Compensation != rollback by definition
Compensation success != historical effect never happened
Inverse command available != semantic undo proven
Restore old snapshot != safe compensation under concurrent change
```

Candidate compensation evidence:

```text
CompensationIntent
  compensatesEffectRef
  reason / triggering failure
  compensationContractRevision
  business preconditions
  authority/currentness
  expected compensating outcome
  idempotency/dedup scope
  irreversible/residual consequences
  result: EFFECTIVE | REJECTED | UNKNOWN | CONFLICTED
```

A compensation must be authorized and qualified at effect time like any other business command. It cannot inherit authority merely from the original forward action.

## 5. Pivot and irreversibility change recovery semantics

Saga literature distinguishes compensable steps from pivot/non-compensable transitions. The technology-independent lesson is that a long-lived process needs to know where recovery semantics change.

Candidate classifications:

```text
COMPENSABLE
RETRYABLE_FORWARD
PIVOT / COMMITMENT_POINT
IRREVERSIBLE_EXTERNAL
MANUAL_RECONCILIATION_REQUIRED
```

Names remain research candidates.

Invariants:

- `Step completed != step compensable`.
- `Pivot passed != previous world state recoverable`.
- `Forward recovery available != backward recovery equivalent`.
- `Compensation unavailable != process state may be falsified as rolled back`.

After an irreversible/pivot effect, the correct recovery may be forward completion, alternate fulfillment, financial/business compensation, operator decision or an explicitly degraded terminal state.

## 6. Federation can split a workflow's causal frontier

Adversarial sequence:

```text
A --command--> B --event--> C
        B effect effective
        |
        X partition
        |
A changes/cancels original intent
C continues from old causal branch
        |
        +---- reconnect ----+
```

On reconnect, the platform may now possess two legitimate historical branches: A's newer intent and C's effect derived from an older but historically valid cause. Transport ordering cannot decide the business winner.

Candidate `CausalFrontier` research concept:

```text
workflowOccurrenceId
known completed effects by participant
known pending/UNKNOWN effects
known intent revisions
known compensation revisions
known authority/contract revisions
per-source causal/high-water evidence
conflicts / missing predecessors
```

The frontier is evidence about what is known, not a global serializable transaction claim.

```text
Later timestamp != later causal revision
Reconnect order != business order
Newest intent != automatic cancellation of already-effective downstream work
Old cause != old effect nonexistent
```

## 7. Reconnect requires workflow-aware classification, not generic replay

The prior federation model classifies backlog before effect. Long-lived workflows add a causal prerequisite: a pending item must be checked against the current workflow occurrence and its predecessor/effect evidence.

Candidate sequence:

```text
reconnect session
 -> establish workflow occurrence identity/revision
 -> reconstruct known causal frontier
 -> reconcile participant effect evidence
 -> identify missing/duplicate/conflicting predecessors
 -> requalify authority + contract + business preconditions
 -> classify pending intent/event
 -> SAFE_FACT_IMPORT | REVALIDATE | COMPENSATE | FORWARD_RECOVER
    | CONFLICTED | MANUAL | UNKNOWN | ELIGIBLE_FOR_EFFECT
 -> execute only through owning capability/workflow authority
```

`Reconnect != resume workflow from last local message offset`.

`Replay event != replay business decision`.

## 8. Orchestration and choreography are business-topology choices, not Exchange Plane identities

Saga evidence supports both orchestration and choreography. Neither should be baked into the Exchange Plane.

### Orchestration

Useful when explicit process state, many participants, visibility and coordinated recovery are needed. Risk: the orchestrator becomes a failure/coupling hotspot or accidental semantic owner beyond its declared process.

### Choreography

Useful for smaller/decentralized event reactions. Risk: dependency/causal structure becomes implicit, difficult to observe, version and compensate as participant count grows.

G4 implication:

```text
Exchange Plane supports both
Exchange Plane is neither by definition
```

A future workflow capability may orchestrate through the plane; capabilities may also choreograph through events. The contracts must expose which semantics are promised, including completion, timeout, compensation, causation and observation.

## 9. Cancellation and supersession must not fabricate retroactive control

A cancellation can race with an already-effective or in-flight downstream action.

```text
Cancel requested != downstream work cancelled
Intent superseded != prior effect erased
Caller abandoned != participant stopped
```

A cancellation/supersession contract needs at least target occurrence/intent revision, cancellation authority, effect-time eligibility, accepted cancellation boundary, and disposition when the target has already passed a pivot or produced an irreversible effect.

Candidate outcomes include `CANCELLED_BEFORE_EFFECT`, `TOO_LATE_EFFECTIVE`, `COMPENSATION_REQUIRED`, `FORWARD_RECOVERY_REQUIRED`, `UNKNOWN`, and `CONFLICTED`; names are research-only.

## 10. Authority and contract revision can change mid-workflow

A long-lived workflow cannot assume that authorization, tenant membership, classification, provider guarantees or participant contract revisions remain fixed for its lifetime.

Candidate policy dimensions:

```text
workflow-definition pinning
participant-contract pinning/negotiation
step-time authority revalidation
classification propagation
revocation sensitivity
upgrade/skew tolerance
compensation contract availability
```

Invariants:

- `Workflow started under authority R1 != every future step authorized under R1`.
- `Participant upgraded != in-flight workflow automatically compatible`.
- `Old compensation contract removed != old effect safely compensable`.
- `Definition revision changed != in-flight occurrence silently migrates`.

Migration of in-flight workflow occurrences is therefore a separate future research problem from ordinary schema compatibility.

## 11. Required adversarial fixtures

1. A->B succeeds; response/event is lost; A retries and B must reconcile duplicate effect.
2. A->B succeeds; partition occurs; A cancels; C later acts on B's pre-partition event.
3. B completes a compensable step, but concurrent external work makes naive inverse restoration destructive.
4. Compensation command times out after effect; retry must not double-compensate.
5. Workflow crosses a pivot; later participant fails; UI incorrectly reports `ROLLED_BACK`.
6. Orchestrator is unavailable while participants/runtime remain healthy; autonomous local business operation must obey declared topology rather than Exchange Plane availability.
7. Choreographed participants form a cycle and repeatedly trigger compensations/events.
8. Trace context is forged or truncated at a trust boundary; business causation/authority remains independently verifiable.
9. Authority is revoked after workflow start but before a sensitive downstream effect.
10. Contract revision changes while an old workflow occurrence still needs its original compensation semantics.
11. Reconnect drains messages in transport order that contradicts causal predecessor relations.
12. Two sites independently compensate/forward-recover the same UNKNOWN effect during a partition.
13. Historical event is replayed and accidentally starts a new business workflow without fresh initiation authority.
14. A workflow references an ArtifactRef whose classification/access policy changed before a later step.
15. Human/manual reconciliation resolves an irreversibility conflict but exchange infrastructure incorrectly treats that decision as its own business rule for future cases.

## 12. Proof obligations added

Before implementation planning, this subfront must prove or explicitly bound:

1. business workflow/saga ownership is distinct from Exchange Plane ownership;
2. durable business causation survives telemetry loss/sampling and is not inferred from trace IDs;
3. correlation, causation, workflow occurrence identity, trace context and authority remain separate semantics;
4. long-lived workflow state distinguishes transport progress from authoritative business-effect progress;
5. compensation is modeled as a new governed effect with its own authority/currentness/evidence, not deletion of history;
6. irreversible/pivot steps have explicit recovery semantics and cannot be reported as rolled back when only compensatory/forward recovery occurred;
7. reconnect reconstructs a qualified causal frontier before resuming pending workflow effects;
8. transport order/checkpoint cannot substitute for causal/business ordering;
9. cancellation/supersession cannot retroactively erase already-effective or UNKNOWN effects;
10. in-flight workflows have explicit rules for authority revocation, contract/version skew and definition revision changes;
11. orchestration and choreography remain replaceable business coordination patterns above the Exchange Plane;
12. workflow coordinator failure does not imply Exchange Plane failure or autonomous runtime failure by architectural necessity;
13. compensation/retry paths preserve idempotency/dedup and UNKNOWN reconciliation across partitions;
14. trace/baggage crossing trust boundaries cannot become identity/authority proof and sensitive context propagation is bounded;
15. client runtime autonomy remains consistent with the declared workflow/federation contract when Builder/central services are unavailable.

## 13. Portability / exit path

A workflow/saga realization is portable only if process-definition identity/revision, occurrence state, completed-effect evidence, causation graph, pending intents, compensation/recovery policy, authority/currentness qualifiers, contract/provider qualification, UNKNOWN/conflict state and partition/reconnect lineage can be exported or reconstructed independently of one workflow engine/broker/tracing backend.

A migration that preserves only workflow JSON/BPMN shape but loses participant effect evidence, causation, compensation state or authority currentness is not semantic portability.

`Workflow definition portable != in-flight occurrence portable`.

## 14. Material delta and maturity

This round adds a **fifth deep evidence consolidation** to the eighth G4 family. Material delta:

- separates business causation from trace/correlation context;
- separates workflow occurrence progress from transport backlog/progress;
- formalizes compensation as a new governed effect rather than rollback/time reversal;
- introduces pivot/irreversibility qualification and forward-recovery semantics;
- adds a causal-frontier hypothesis for partition/reconnect;
- keeps orchestration/choreography above, not inside, the Exchange Plane;
- adds cancellation/supersession races and in-flight authority/contract revision as explicit proof domains.

Family remains `RESEARCH_ACTIVE / NON_EXECUTABLE`, not saturated. No workflow engine, saga framework, tracing system, broker or orchestration topology was selected.

Highest-value remaining gap: **in-flight workflow definition/contract migration and causal-history compaction**, especially how long-lived occurrences survive version skew, retired compensation contracts and finite retention/erasure without requiring indefinite preservation of executable historical code or sensitive payloads.

## Sources / evidence class

- AWS Prescriptive Guidance — Saga patterns: https://docs.aws.amazon.com/prescriptive-guidance/latest/cloud-design-patterns/saga-patterns.html
- AWS Prescriptive Guidance — Saga choreography: https://docs.aws.amazon.com/prescriptive-guidance/latest/cloud-design-patterns/saga-choreography.html
- Azure Architecture Center — Saga pattern: https://learn.microsoft.com/azure/architecture/patterns/saga
- Azure Architecture Center — Compensating Transaction pattern: https://learn.microsoft.com/azure/architecture/patterns/compensating-transaction
- W3C Recommendation — Trace Context: https://www.w3.org/TR/trace-context/
- OpenTelemetry — Context propagation: https://opentelemetry.io/docs/concepts/context-propagation/
- OpenTelemetry — Baggage: https://opentelemetry.io/docs/concepts/signals/baggage/

These sources constrain the research boundary only and do not authorize adoption.