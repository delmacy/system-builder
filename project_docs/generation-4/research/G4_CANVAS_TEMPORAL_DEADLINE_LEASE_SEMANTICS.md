# G4 — Canvas Temporal Deadline / Lease / Currentness Semantics Research

Status: `RESEARCH_ACTIVE / NON_EXECUTABLE`
Execution authority: NONE

## Scope

This artifact deepens the Main Composition Canvas 3D research at the temporal boundary left open by `G4_CANVAS_LOOP_TERMINATION_RESIDUAL_OBLIGATIONS.md`: business deadlines, execution timeouts, evidence-currentness horizons, leases, cancellation deadlines, escalation timers, and their effects on Gates, Handoffs, Counters, Corridors and residual obligations.

It is implementation-independent. BPMN/Camunda and Kubernetes leases are evidence/benchmarks, not technology selections. Nothing here authorizes implementation or changes G3.

## Material question

A timestamp crossing is not one universal semantic event. The Canvas needs to preserve why a temporal boundary exists, what claim it qualifies, and what transition the contract says follows.

Core separation:

`deadline reached != work cancelled != authority revoked != evidence stale != lease lost != effect fenced != escalation completed`.

A clock observation can trigger evaluation of a rule; it does not manufacture the business/authority consequence of that rule.

## Evidence base and portable lessons

### BPMN/Camunda timers: due time and trigger/effect are distinct

Camunda documents interrupting timer boundary events that terminate the attached activity when the timer triggers, and non-interrupting timer boundary events commonly used for notifications/escalation while the original activity continues. It also documents that Zeebe is asynchronous: a timer may fire later than its configured due date under load, although not earlier.

Portable lessons:

- an elapsed duration can have interrupting or non-interrupting semantics;
- `dueAt` and `observedTriggerAt` are distinct facts;
- lateness of timer processing must not rewrite the intended business deadline;
- a non-interrupting escalation is not cancellation;
- an interrupting workflow timer proves local control-flow interruption according to the workflow contract, not distributed external-effect cancellation.

Camunda user tasks independently expose `followUpDate` and `dueDate`; the former can mean the latest time work should start while the latter is the deadline by which it should finish. This is direct evidence against a generic `deadline` field with universal meaning.

### Kubernetes leases: temporary authority/liveness needs holder and renewal semantics

Kubernetes Lease objects carry `holderIdentity`, `acquireTime`, `renewTime`, `leaseDurationSeconds` and transition information. Leader-election configuration separately distinguishes lease duration, renewal deadline and retry period. Lease acquisition uses optimistic concurrency on the Lease object.

Portable lessons:

- lease identity, holder, acquisition, renewal, expiry and transition are distinct facts;
- lease duration is not the same thing as retry cadence or holder-side renewal deadline;
- expiry can make a holder no longer admissible under the coordination contract without proving that previously issued external effects were undone;
- if the protected effect is external to the lease store, lease expiry alone cannot prove stale-holder fencing at the effect target.

This preserves the existing G4 invariant `leader/lease elected != stale holder externally fenced`.

## Temporal vocabulary candidate

The following are research roles, not committed types/enums.

### BusinessDeadline

A domain expectation such as “approval must be completed by 17:00”. Its expiry may mean breach, lateness, escalation, rejection, repricing, revalidation, or cancellation only if the business contract says so.

`business deadline passed != authority automatically revoked`.

### ExecutionTimeout

A bound on waiting/execution for a particular attempt or operation. It primarily governs execution/resource behavior. A timeout can yield `UNKNOWN` when the target effect may still have occurred.

`execution timeout != effect absence`.

### EvidenceCurrentnessHorizon

The latest point/rule under which evidence may still support a named claim. Crossing it makes the evidence stale or requires revalidation; it does not necessarily make the underlying business fact false.

`evidence stale != fact false`.

### AuthorityLease

A temporary grant/coordination right scoped to holder, resource/effect, epoch/generation and lease contract. Expiry may revoke future admissibility under that contract, but external exclusion requires effect-side fencing or independent proof where conflicting effects are possible.

`lease expired != old holder physically incapable of effect`.

### CancellationDeadline

A horizon after cancellation was requested/accepted within which stopping/settlement is expected or required. Expiry means cancellation settlement is late/unknown/escalated according to contract; it must not be coerced into successful cancellation.

`cancellation deadline expired != cancellation succeeded`.

### EscalationTimer

A temporal trigger for observation, notification, reassignment, review or escalation. It can be non-interrupting.

`escalation fired != original responsibility released`.

### RetryBackoff / RetryBudgetHorizon

Operational timing governing another attempt. It cannot mint new semantic admission, new authority or a new iteration merely because enough time elapsed.

### SettlementHorizon

A declared bound for obtaining terminal evidence about residual obligations. Expiry can require reconciliation/manual review/UNKNOWN; it cannot fabricate settlement.

## Due, observed, effective and settled time

For temporal rules with material consequences, at least four moments may differ:

```text
DueAt
  time named by the rule
ObservedAt
  time some evaluator/runtime noticed the condition
EffectiveAt
  time the declared semantic transition became applicable under its contract
SettledAt
  time required consequences/evidence reached a terminal qualified disposition
```

They must not be collapsed by UI convenience.

Example: an approval is due at 17:00; an asynchronous timer is processed at 17:00:08; escalation notification is delivered at 17:00:11; the task remains assigned and is completed at 17:01. Whether completion is accepted is a business rule, not inferable from timer delivery.

`DueAt != TriggerObservedAt != EffectObservedAt`.

## Clock model and causal discipline

Wall-clock time is evidence for temporal predicates, not a causal identity system. The Canvas must not infer business causation, ownership, order or authority solely from timestamp comparison.

Candidate requirements where time is material:

- declare clock/domain used by the rule;
- retain timezone/calendar semantics for business deadlines where relevant;
- distinguish absolute deadline from elapsed-duration timeout;
- preserve configured due time separately from observed firing time;
- expose uncertainty/skew assumptions when comparing independently observed clocks;
- prefer explicit sequence/revision/epoch/fence evidence over timestamp winner rules for authority/effects;
- never use `latest timestamp wins` to resolve semantic ownership or irreversible-effect conflicts.

`wall-clock later != causally later`.

A clock jump/restart must not silently renew an authority lease, revive stale evidence or reclassify an old obligation as a new one.

## Gate semantics

A Gate may contain a temporal prerequisite, but Gate satisfaction remains a proof claim.

Examples:

- `approvalEvidence.currentAt >= requiredFloor`;
- `now <= BusinessDeadline`;
- `AuthorityLease(holder, effectScope)` is admissible at commitment;
- `CancellationResidual` is settled or isolated before successor effect.

A Gate that checks evidence currentness does not own the evidence. A Gate that checks a lease does not become the lease authority.

For commitment-sensitive effects, decision-time satisfaction may be insufficient if a relevant horizon can expire before effect commitment. Candidate rule:

`GateSatisfiedAtDecision != GateAdmissibleAtCommitment` when the named invariant requires commitment-time currentness/authority.

The smallest required recheck/fence should follow the protected invariant; not every operation needs global synchronous authorization.

## Handoff semantics

Handoff timing can include independent horizons:

- offer expiry;
- acceptance deadline;
- responsibility lease/claim expiry;
- start-by/follow-up expectation;
- completion due date;
- escalation timer;
- withdrawal/cancellation settlement deadline.

None implies another unless the contract declares it.

`offer expired != accepted responsibility released`.

`completion overdue != handoff rejected`.

`escalated != reassigned`.

If responsibility is leased, expiry can prevent new protected acts under that lease, but already-started off-system work or external effects remain residual until settled/fenced/reconciled.

## Counter / request surface semantics

A Counter contract should be able to declare, when relevant:

- admission deadline;
- request validity/currentness horizon;
- execution timeout per attempt;
- end-to-end completion deadline;
- retry/backoff policy and budget;
- authority/lease requirement at admission and/or commitment;
- cancellation capability and cancellation deadline;
- expected ACK vs completion/effect evidence;
- disposition on each expiry (`REJECT`, `ESCALATE`, `UNKNOWN`, `REVALIDATE`, `FENCE`, `CONTINUE_BUT_LATE`, etc.).

A driver/adapter may translate timer mechanisms but cannot translate an execution timeout into business expiry, or a lease into effect fencing, unless the target semantics prove that equivalence.

## Corridor and loop semantics

A Corridor can remain the same designed identity across repeated traversals while each traversal has its own temporal evidence bound to occurrence/iteration/attempt lineage.

`timeout@N != timeout@N+1`.

A retry timer remains attached to the original obligation unless an explicit re-admission creates a successor obligation. A loop iteration boundary does not reset a residual cancellation deadline, evidence floor or fence unless the contract explicitly creates a new scope.

A successor iteration may overlap a predecessor residual only under the previously established `SettlementOrIsolationProof` for the named invariant.

## Lease expiry versus fencing

This is the most important safety distinction in the round.

For a lease-protected external effect:

```text
LeaseExpired(holder H)
  proves: H is no longer admissible under the lease contract after the relevant horizon

EffectFenceObserved(target, generation G)
  proves: the target will reject stale effect authority below/other than G according to the fence contract
```

The first does not imply the second.

Thus a replacement holder can be selected while an old holder is still physically capable of reaching an unfenced external system. Where the invariant forbids dual effect, successor commitment requires effect-side exclusion or equivalent independent proof.

## Evidence currentness and historical truth

Evidence expiry is about admissibility for a claim now, not erasure of history.

An approval recorded yesterday can remain historical evidence that approval happened while becoming too old to authorize a sensitive effect today.

`historically valid != currently sufficient`.

The Canvas should preserve both dimensions rather than turning stale evidence into `false` or deleting it.

## Timeout and UNKNOWN

Execution/cancellation/settlement timeouts frequently bound how long the system waits, not what happened in the external world.

If an operation times out after dispatch and the target offers no qualified effect lookup/fence, the correct disposition can remain `UNKNOWN`.

`timeout != failure proof`.

Retries then require the existing G4 idempotency/dedup/fencing obligations; time passage alone does not authorize replay.

## Escalation

Escalation is a new workflow/operational action triggered by a temporal condition. It does not silently rewrite responsibility or satisfaction.

Examples:

- notify supervisor while worker retains responsibility;
- add reviewer while existing handoff remains active;
- reassign only after explicit withdrawal/reassignment transition;
- freeze new effects pending manual review.

The projection must distinguish the timer condition, escalation action, escalation ACK, responsibility transition and eventual outcome.

## Designed / observed / assessed

Preserve the established split:

```text
DESIGNED
  deadline/timeout/lease/currentness/escalation semantics,
  scope, clock basis, expiry consequence, retry/cancellation policy

OBSERVED
  configured due time, timer firing, renewals, lease transitions,
  ACKs, effects, cancellations, escalations, evidence timestamps

ASSESSED
  overdue/current/stale/expired/admissible/unknown,
  whether commitment was allowed and whether residual settlement is sufficient
```

An observed downstream success cannot be used to infer that a deadline Gate was satisfied at the required frontier.

## Cross-projection invariants

2D Composition, 3D Building/Onion, Workflow Canvas, Corridor/Handoff Map, Capability Map, Relation Graph, Topology Map and Floor View must preserve the same temporal object/obligation identity, scope, revision, lineage and currentness qualifiers.

A view may render countdowns, warning rings or time bands, but those are projections. UI timer expiry is not canonical authority. Reopening another view cannot reset a lease, timeout or deadline.

`countdown reached zero != semantic transition committed`.

## State/transition candidates

These are research vocabulary only:

- temporal predicate: `PENDING -> DUE -> OBSERVED_DUE`;
- evidence: `CURRENT -> STALE -> REVALIDATED | SUPERSEDED | UNKNOWN`;
- lease: `OFFERED -> ACQUIRED -> RENEWING -> EXPIRED | RELEASED | REVOKED`, with effect fencing tracked separately;
- cancellation: `REQUESTED -> ACCEPTED? -> STOPPING -> STOPPED? -> SETTLED`, with timeout/unknown branches;
- escalation: `SCHEDULED -> DUE -> TRIGGERED -> ACKNOWLEDGED? -> RESOLVED?` without implying original-work termination.

No implementation should infer that these candidate labels are one universal state machine.

## Proof obligations

1. Business deadline, execution timeout, evidence-currentness horizon, lease expiry, cancellation deadline and escalation timer remain distinct semantic roles.
2. Every material temporal rule names its scope and consequence rather than relying on a generic timeout.
3. Configured due time is distinguishable from observed timer firing and effect time.
4. Asynchronous late timer processing does not move the original business deadline.
5. Non-interrupting escalation cannot be represented as cancellation.
6. Interrupting timer control-flow semantics cannot fabricate distributed external-effect cancellation.
7. User-task due/follow-up semantics do not automatically revoke assignment/authority.
8. Evidence becoming stale does not rewrite the historical fact it evidenced.
9. Stale evidence cannot be silently treated as current because its underlying value is unchanged.
10. Execution timeout after dispatch cannot be represented as effect absence without qualified proof.
11. Cancellation timeout cannot be coerced into cancellation success.
12. Settlement timeout preserves `UNKNOWN` where terminal evidence is unavailable.
13. Lease holder identity and lease generation/transition are explicit where material.
14. Lease expiry does not imply effect-side fencing.
15. Successor authority cannot safely create conflicting protected effects until exclusion/settlement required by the invariant is proven.
16. Lease renewal does not silently expand lease scope, authority or semantic guarantees.
17. Retry period/backoff does not create new semantic admission or authority.
18. Retry/redelivery retains original occurrence/iteration/effect lineage absent explicit re-admission.
19. Gate temporal satisfaction is bound to the frontier at which the named invariant requires it.
20. Decision-time Gate evidence is requalified at commitment when currentness/authority can materially expire before effect.
21. Handoff offer expiry, acceptance, responsibility release and completion deadline remain separate.
22. Escalation does not silently transfer responsibility.
23. Responsibility lease expiry does not erase off-system/external residual work.
24. Counter contracts distinguish ACK, completion and effect deadlines where material.
25. Adapter/driver cannot map mechanism timeout to business expiry without proof of semantic equivalence.
26. Wall-clock comparison alone cannot establish causation, ownership, conservation or authority winner.
27. Clock uncertainty/skew assumptions remain explicit where cross-domain comparison is material.
28. Restart/restore cannot regress learned security/currentness/fencing floors or silently renew expired authority.
29. Temporal evidence remains bound to occurrence/iteration/item/attempt/design lineage as applicable.
30. Cross-projection countdown/render state cannot become canonical temporal authority.
31. Designed, observed and assessed temporal states remain separate.
32. AI may suggest temporal classifications/escalations but cannot invent timer firing, lease renewal, currentness, cancellation, fencing or authority evidence.

## Adversarial cases

1. Due date passes and UI marks the task cancelled although contract only says overdue.
2. Follow-up date is treated as completion deadline.
3. Non-interrupting reminder timer is rendered as task interruption.
4. Timer is processed eight seconds late and system rewrites the business deadline to firing time.
5. Interrupting BPMN timer terminates local token while external API later commits.
6. Request times out and retry is issued although first effect disposition is unknown and no idempotency/fence exists.
7. Cancellation wait times out and state is set to `CANCELLED`.
8. Evidence TTL expires and historical approval is deleted.
9. Same old evidence value is re-stamped with a fresh timestamp without revalidation.
10. Lease expires and new holder acts while stale holder can still commit to an unfenced external target.
11. New lease holder is assumed to imply old holder fenced.
12. Lease renewal silently broadens resource/effect scope.
13. Retry timer firing is interpreted as new business admission.
14. Backoff expiry mints a new iteration epoch.
15. Handoff offer expires after acceptance and UI silently releases responsibility.
16. Completion due date passes and assignment is automatically transferred without declared rule/evidence.
17. Escalation notification ACK is treated as supervisor acceptance of responsibility.
18. Gate was current at decision time but authority lease expired before protected commitment; no recheck/fence occurs.
19. Every operation performs a global synchronous recheck although only one local effect invariant needs commitment-time qualification.
20. Clock skew makes stale holder appear newer and timestamp wins authority conflict.
21. Daylight-saving/calendar conversion changes a business deadline without preserving original zone/calendar semantics.
22. Host clock jumps backward and expired lease appears valid again.
23. Restore from snapshot revives a lease/currentness state below a durable monotonic floor.
24. Countdown in 3D reaches zero while runtime has not observed the timer; UI persists expiry as canonical fact.
25. Topology view uses provider lease time while Workflow view uses business due time and labels both `expired` without qualification.
26. Adapter translates HTTP client timeout into target-side cancellation guarantee.
27. Provider reports operation timeout and gateway normalizes it to business rejection.
28. Settlement horizon expires and unresolved residual is dropped from the Canvas.
29. Late predecessor effect after deadline is relabelled as successor iteration because wall-clock is newer.
30. Correlation timestamp ordering is used as causation proof across independent branches.
31. A stale but historically valid approval is displayed as `false`, hiding why prior effect was conformant.
32. AI infers “lease probably expired/cancel succeeded” from telemetry silence and persists it as evidence.

## Portability / exit path

The model does not depend on BPMN timer syntax, Camunda job semantics, Kubernetes Lease objects, a particular database clock, broker delay mechanism or scheduler. A future runtime can realize temporal semantics with local durable timers, external schedulers, monotonic counters, leases, fencing generations, workflow engines or manual procedures, provided the declared contract and evidence distinctions survive substitution.

Autonomous runtimes may evaluate locally sufficient deadlines/currentness/leases from durable state. Builder availability is not required for ordinary runtime truth. Cross-domain effects that require stronger exclusion still require the declared target-side or independently provable fence; the Builder/Canvas cannot fabricate it.

## Material delta / deduplication

This artifact does not reopen generic loop identity, cancellation, residual obligations, Exchange Plane lease/fencing, generic evidence currentness, or workflow timer syntax. Its delta is specifically:

`generic temporal boundary -> semantic temporal role -> due/observed/effective/settled separation -> Gate/Handoff/Counter temporal qualification -> lease expiry vs effect fencing -> timeout UNKNOWN discipline -> minimal commitment-time requalification without global synchronization`.

## Maturity

`MATERIAL / NOT SATURATED / NON_EXECUTABLE`.

Next highest-value gap: **calendar/business-time and paused/suspended-time semantics across human handoffs and long-lived occurrences** — distinguish elapsed duration, working-time calendars, maintenance/freeze windows, paused timers, SLA clocks and authority/currentness horizons, and determine which clocks may pause versus which security/effect horizons must continue independently, without letting UI/workflow suspension freeze external reality.