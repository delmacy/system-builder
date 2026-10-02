# G4 — Canvas Loop Termination / Cancellation / Residual Obligations Research

Status: `RESEARCH_ACTIVE / NON_EXECUTABLE`
Execution authority: NONE

## Scope

This artifact deepens the Main Composition Canvas 3D loop/iteration research at the boundary between loop/body termination and settlement of semantic obligations. It is implementation-independent and does not select BPMN, Camunda, Petri nets, Temporal, or another workflow engine. It grants no implementation authority.

The central question is: when a repeated region, multi-instance body, branch, subprocess, or iteration stops producing ordinary forward work, what must remain representable before a successor iteration/design/effect may safely proceed?

## Evidence base and portable lessons

### Multi-instance completion is not child success

Camunda 8 documents a multi-instance body with independent child instances. A completion condition can complete the body early; active children are terminated. Runtime semantics distinguish total, active, completed, and terminated instances. An interrupting boundary event likewise terminates the multi-instance body and active children and does not propagate a partial output collection.

Portable lesson: body completion is a control-flow disposition, not evidence that every child obligation completed successfully or that every external consequence is settled.

`body completed != all children succeeded`.

`child terminated != child external effect absent`.

### Termination is scoped

Camunda terminate end events terminate active element instances in the same flow scope. Inside a multi-instance subprocess, termination affects the current subprocess instance/iteration rather than all sibling multi-instance instances. BPMN issue resolution likewise clarifies scope-local termination.

Portable lesson: termination requires an explicit scope. A visual stop symbol cannot imply workflow-global cancellation.

`termination(scope X) != termination(all related work)`.

### Cancel, terminate, interrupt and compensation are not synonyms

BPMN constrains Cancel Events to transaction subprocess semantics and distinguishes them from ordinary interruption/termination. BPMN also distinguishes compensation: transaction cancellation can lead to rollback/compensation, whereas other interruption mechanisms do not imply compensation. The OMG issue tracker itself records historical ambiguity around the word “cancellation,” reinforcing that generic `CANCELLED` is too weak as a portable semantic claim.

Portable lesson: a Canvas must preserve the declared termination/cancellation/remediation contract rather than normalize distinct mechanisms into a single green/red state.

`stopped forward execution != compensated`.

`compensation requested != compensation completed`.

`compensation completed != physical world restored exactly`.

### Runtime modification demonstrates the danger of structural repair

Camunda process-instance modification can transactionally activate/terminate engine element instances, yet its documentation explicitly warns that accepted modifications can create states unreachable by ordinary process execution and can omit required data/interrupt semantics.

Portable lesson: runtime/engine acceptance of a structural modification is not semantic proof that residual obligations were settled or that downstream conformance holds.

`engine accepted termination != semantic settlement`.

## Core hypothesis

Loop termination needs at least two independent frontiers:

```text
ControlFlowFrontier
  which designed/runtime activities may still progress normally

ObligationSettlementFrontier
  which admitted semantic obligations/effects remain unresolved
```

Stopping the first does not establish the second.

Candidate relation:

`IterationClosedForForwardProgress && ResidualObligations != empty -> iteration control flow ended, settlement still open`.

This permits an occurrence to stop scheduling new work while preserving `UNKNOWN`, compensating, draining, reconciling, or manually adjudicated consequences.

## Residual obligation

Candidate `ResidualObligation` is any admitted responsibility whose semantic disposition remains material after ordinary forward execution for its region has stopped. Examples include:

- command accepted but business effect not yet known;
- external effect in flight and not fenceable;
- handoff accepted but responsibility not released/transferred;
- Gate/evidence obligation required for a protected downstream effect;
- branch contribution admitted but not reconciled after sibling early completion;
- compensation/remediation requested but incomplete;
- human task claimed but not explicitly withdrawn/reassigned;
- artifact/resource reservation requiring release or expiry;
- retry/redelivery that can still arrive after the iteration is closed;
- child terminated locally while a provider-side operation continues;
- observation whose currentness is insufficient to decide whether an effect occurred.

Residual obligations retain occurrence, iteration/item, design-lineage, authority, causation, effect identity, and settlement evidence where material.

`residual != engine token by implication`.

## Candidate dispositions

These are research vocabulary, not committed enums:

- `FORWARD_ACTIVE`: ordinary progression may still create effects;
- `FORWARD_CLOSED`: no new ordinary work for the scoped iteration/region;
- `DRAINING`: previously admitted obligations may complete to a declared frontier;
- `CANCELLING`: cancellation/revocation is being propagated where supported;
- `TERMINATED`: scoped runtime/control-flow execution was stopped;
- `COMPENSATING`: declared compensating actions are in progress;
- `REMEDIATING`: corrective action is in progress where inverse compensation is impossible/inadequate;
- `SETTLED`: every obligation required by the named settlement invariant has a terminal qualified disposition;
- `UNKNOWN`: settlement cannot currently be established;
- `CONTESTED`: evidence/authority about disposition conflicts.

A region may be `TERMINATED` and still have residual obligations in `UNKNOWN` or `COMPENSATING` states.

## Cancellation scope and propagation

Cancellation needs a declared semantic scope, not just graph reachability. Candidate dimensions include:

- iteration epoch;
- multi-instance item/body;
- branch;
- subprocess/flow scope;
- handoff/responsibility scope;
- effect family;
- whole occurrence.

Propagation is contract-specific. A target may support cancellation before admission, after admission but before effect, or not at all. A provider/driver/adapter must not fabricate cancellability.

`cancel requested != cancel accepted != work stopped != effect absent`.

If cancellation cannot be proven, the residual remains representable and may require fence/reconciliation/remediation.

## Compensation and remediation

Compensation is not semantic time travel. It is a new causally linked action intended to offset a prior completed/admitted effect according to a declared contract.

Candidate evidence must preserve:

- original effect identity/evidence;
- compensation/remediation intent and authority;
- target obligation/effect;
- compensation action identity;
- completion/failure/unknown evidence;
- residual divergence that remains after compensation.

`compensated != original effect never happened`.

A non-invertible physical or external effect may require remediation rather than compensation. The Canvas must not turn either into deletion of observed history.

## Starting N+1

A successor iteration does not always require every residual from N to disappear. It requires proof that residuals from N cannot violate the named invariant of N+1.

Candidate rule:

`MayStart(N+1, X) iff SettlementOrIsolationProof(N residuals, invariant X)`.

Possible portable strategies include:

1. **Full settlement** — all material predecessor obligations are terminal and qualified.
2. **Effect fencing** — stale predecessor work may still arrive but cannot commit protected effects.
3. **Namespace/epoch isolation** — predecessor effects cannot satisfy or overwrite successor obligations.
4. **Bounded coexistence** — overlap is explicitly allowed and invariant-preserving.
5. **Manual/authority-qualified exception** — bypass is recorded as exceptional evidence, never ordinary satisfaction.

Thus:

`residual exists != global barrier required`.

But:

`residual ignored != safe overlap`.

## Minimal barrier hypothesis

When overlap is unsafe, barrier scope should be the smallest proof-complete set of residual obligations whose independent continuation could violate the named invariant.

`BarrierScope(X) != whole workflow by default`.

Capability shafts, visual proximity, shared floor, or shared module face do not automatically enlarge the barrier. Typed semantic dependencies and protected effects do.

## Early completion

Early completion of a multi-instance/repeated region needs separate evidence for:

- why the completion condition became true;
- which children completed;
- which children were terminated/cancelled;
- which children/effects are still externally unsettled;
- whether partial outputs are admissible;
- whether late results are rejectable/fenced/reconcilable;
- whether successor iteration may start.

`completion threshold satisfied != losing work nonexistent`.

A projection may show the body as closed while still surfacing residual obligations distinctly.

## Interrupting events

An interrupting event can close a flow scope while provider-side/external consequences outlive that scope. Therefore the Canvas needs two observations: designed/runtime interruption and observed external settlement.

A non-interrupting event, conversely, must not be rendered as if it cancelled the original path.

`interrupting boundary semantics != external distributed cancellation guarantee`.

## Handoffs and human work

Terminating a workflow region does not automatically prove that human responsibility was withdrawn, acknowledged as withdrawn, reassigned, or completed. A claimed task may have produced off-system work already.

Candidate rule:

`task terminated != responsibility settled`.

Where responsibility matters, cancellation/withdrawal/reassignment evidence belongs to the residual obligation set. Four-eyes/dual-control evidence already produced remains historical; termination cannot erase it or reuse it for a successor iteration outside its declared scope.

## External effects and late arrivals

Late completion from N after N is forward-closed must retain N lineage. It cannot be relabelled as N+1, satisfy N+1 Gate/Join/Handoff, or silently overwrite successor state.

Possible dispositions include duplicate, stale/fenced, late-but-valid-for-N, requires reconciliation, conflicting, or unknown. These are semantic outcomes, not transport statuses.

`late ACK != late effect proof`.

`late effect@N != effect@N+1`.

## Design evolution D1 -> D2

A design successor may change cancellation, completion, compensation, timeout, or settlement policy. It cannot retroactively redefine how D1 work was terminated.

A live D1 residual may coexist with D2 successor work only under a qualified isolation/settlement rule. D2 may impose a stronger commitment-time Gate on new effects without rewriting D1 observed history.

`new cancellation policy != predecessor cancellation completed`.

## Designed / observed / assessed

Preserve the established split:

```text
DESIGNED
  termination scope, completion condition, cancellation capability,
  compensation/remediation contract, settlement invariant, overlap policy

OBSERVED
  children completed/terminated, cancellation requests/acks,
  external effects, late arrivals, compensation/remediation evidence

ASSESSED
  whether the scoped iteration/body is forward-closed,
  whether residual obligations are settled/isolated,
  whether successor work is conformant and admissible
```

A downstream state does not prove missing predecessor settlement evidence.

## Cross-projection invariants

2D Composition, 3D Building/Onion, Workflow Canvas, Corridor/Handoff Map, Capability Map, Relation Graph, Topology Map and Floor View must preserve the same occurrence/iteration/residual-obligation identities and revision/currentness qualifiers.

A projection may collapse settled residuals for readability but cannot hide `UNKNOWN`, `CONTESTED`, active compensation/remediation, or a barrier that protects a current invariant.

`visual body closed != semantic obligations hidden`.

The 3D metaphor may represent a closed corridor/door while residual work remains visible as evidence/settlement state; geometry remains a projection, never settlement authority.

## Proof obligations

1. Forward-control closure is distinguishable from semantic settlement.
2. Body completion does not fabricate successful completion of terminated children.
3. Termination scope is explicit and cannot silently expand to sibling iterations/branches.
4. Cancellation request, acceptance, stopping, effect absence, and settlement are distinct claims.
5. Provider/driver/adapter cannot claim cancellation semantics unsupported by the target.
6. Compensation is represented as a new causal action, not deletion of original effect history.
7. Compensation completion does not imply exact restoration unless that guarantee is contracted and evidenced.
8. Non-invertible effects remain representable through remediation/residual divergence.
9. Residual obligations preserve occurrence/iteration/item/design lineage.
10. Residual external effects survive local token/element termination in the model when settlement is unknown.
11. Human-task termination does not fabricate responsibility withdrawal/reassignment evidence.
12. Handoff responsibility is explicitly settled or remains residual.
13. Early completion preserves completed vs terminated vs unsettled child distinctions.
14. Partial output admissibility is explicit rather than inferred from body completion.
15. Late predecessor results retain predecessor epoch/effect identity.
16. Late N work cannot satisfy N+1 obligations without an explicit compatible contract.
17. Retry/redelivery after closure cannot mint a successor iteration.
18. N+1 starts only when predecessor residuals are settled or proven isolated for the named invariant.
19. Barrier scope is no larger than required but is proof-complete for the protected invariant.
20. Capability participation/visual proximity does not imply shared cancellation/barrier scope.
21. Fencing proof survives restart/restore and cannot regress below a learned monotonic floor where required.
22. Cancellation/settlement timeouts preserve `UNKNOWN` rather than coercing success.
23. Design D2 does not rewrite D1 termination/cancellation/compensation history.
24. D2 successor effects account for live D1 residuals where invariants cross generations.
25. Interrupting control-flow semantics are not represented as guaranteed distributed cancellation.
26. Non-interrupting events do not appear as cancellation of the original path.
27. Engine acceptance of runtime modification is not semantic conformance proof.
28. Bypass/manual settlement requires authority/evidence and remains visibly exceptional.
29. Designed, observed and assessed settlement states remain separate.
30. Cross-projection views preserve residual-obligation identity/currentness/revision.
31. Projection aggregation cannot hide material unknown/contested residuals.
32. AI may suggest settlement/remediation classifications but cannot invent effect absence, cancellation, compensation, or authority evidence.

## Adversarial cases

1. Multi-instance completion condition fires at 60% and UI marks 100% successful.
2. Active child is terminated locally while its external API call later commits.
3. Interrupting boundary event is rendered as proof every downstream provider cancelled work.
4. Generic `CANCELLED` collapses requested, accepted, stopped, compensated, and settled.
5. Terminate event in one multi-instance iteration incorrectly cancels sibling iterations.
6. Compensation handler completes and original historical effect is deleted.
7. Compensation partially fails but projection shows restored state.
8. Non-invertible physical action is labelled compensated without remediation evidence.
9. Human task token is terminated while operator continues off-system work.
10. Handoff target never acknowledges withdrawal but responsibility is shown as released.
11. Late N completion is attached to N+1 because correlation key matches.
12. Dedup window expires and residual N retry becomes new successor work.
13. N+1 starts because N has no engine tokens although external effect is `UNKNOWN`.
14. Global workflow is frozen because one residual only constrains a local effect invariant.
15. Local barrier is too narrow because an indirect typed constraint was omitted.
16. Capability shaft is used as cancellation broadcast authority.
17. Adapter reports `cancelled` after transport connection close although target may still execute.
18. Provider ACK to cancellation is treated as effect rollback.
19. Timeout waiting for cancellation is coerced to success.
20. D2 adds stronger settlement rule and historical D1 work is rewritten as if it had used it.
21. D2 weakens rule and unresolved D1 residual is silently ignored.
22. Manual modification terminates a token and UI fabricates Gate/Handoff settlement.
23. Early completion discards partial-output provenance.
24. A late branch result reopens a body already closed without a new explicit reconciliation path.
25. Restore loses the predecessor fence and stale residual can commit after N+1 starts.
26. Same actor remains assigned, so responsibility continuity is inferred across cancellation/restart.
27. Non-interrupting exception path is displayed as replacement of original work.
28. Projection hides `UNKNOWN` residuals behind a green completed-loop icon.
29. Topology view and Workflow view disagree on residual currentness but UI picks whichever loaded last.
30. Observed successor success is used to infer predecessor cancellation succeeded.
31. Compensation and remediation are normalized by an adapter into identical semantics despite different guarantees.
32. AI infers “probably cancelled” from missing telemetry and the inference is persisted as proof.

## Portability / exit path

The model depends on no engine-specific token, job, cancellation API, broker, database, or workflow notation. BPMN/Camunda are benchmarks for semantic distinctions, not bindings. A future runtime may realize cancellation with local flags, provider APIs, fencing tokens, leases, message contracts, controllers, or manual procedures; unsupported semantics must remain explicit rather than normalized into equivalence.

A runtime can remain autonomous: it may carry the contracts/evidence/fences required to decide local successor admissibility without consulting the Builder. Central Builder/Canvas unavailability must not retroactively change runtime truth.

## Material delta / deduplication

This artifact does not reopen generic loop identity, retry identity, join epochs, live-occurrence migration, generic effect settlement, or Exchange Plane cancellation. Its delta is specifically:

`iteration/body forward closure -> scoped termination/cancellation -> residual obligations -> compensation/remediation -> settlement-or-isolation proof -> minimal barrier -> safe successor iteration/design overlap`.

## Maturity

`MATERIAL / NOT SATURATED / NON_EXECUTABLE`.

The next highest-value gap is **timeout/lease/deadline semantics across Gate, Handoff and residual-obligation settlement**: distinguish business deadline, execution timeout, evidence-currentness horizon, lease expiry, cancellation deadline and escalation timer; determine which expiries revoke authority, merely trigger observation/escalation, or require reconciliation, without allowing wall-clock coincidence to fabricate causality or global synchronization.