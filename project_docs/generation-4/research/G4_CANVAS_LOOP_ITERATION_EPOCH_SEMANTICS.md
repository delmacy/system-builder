# G4 — Canvas Loop Iteration / Epoch Semantics Research

Status: `RESEARCH_ACTIVE / NON_EXECUTABLE`
Execution authority: NONE

## Scope

This artifact deepens the Main Composition Canvas 3D research after parallel-branch/join migration safety. It studies loops, repeated Corridor traversal, repeated Gates/Handoffs, multi-instance execution, retry/redelivery and design evolution while preserving one occurrence identity. It is implementation-independent. It does not select BPMN, Petri nets, Camunda, Temporal or another workflow engine, and it grants no implementation authority.

The core question is: how can the Canvas distinguish a new business/workflow iteration from another delivery attempt of the same obligation, a parallel multi-instance item, a restarted branch, or a successor-design migration, so evidence from iteration N cannot silently satisfy iteration N+1?

## Evidence base and portable lessons

### BPMN loop semantics

BPMN defines a standard Loop Activity as repeated execution of an inner Activity while a loop condition holds. The condition is evaluated per iteration (before or after according to `testBefore`), and runtime maintains a loop counter. This demonstrates that repeated traversal has execution-local state beyond the static Activity identity.

Portable lesson: repeated execution of the same designed element does not create a new semantic element identity, but each execution pass requires distinguishable occurrence/iteration state.

`same designed element != same execution pass`.

### Multi-instance is not ordinary looping

Camunda's current multi-instance model makes the distinction concrete. A multi-instance body creates one inner activity instance per input element, sequentially or in parallel. Each instance has a local `loopCounter`; parallel instances execute independently; completion can also terminate still-active siblings when a completion condition becomes true. Outputs are collected according to the input collection's instance positions.

Portable lesson: repetition cardinality, per-item instance identity, concurrency and completion policy are independent dimensions. A Canvas must not collapse ordinary loop iteration, multi-instance item execution and retry into one `loopCounter` concept.

Camunda also documents race hazards when parallel instances share process-scope variables, reinforcing that visual repetition does not imply safe shared mutable state.

### Migration limitations are evidence of hard live-state boundaries

Camunda migration tooling treats active multi-instance state as a difficult migration boundary and recommends completing such execution before migration in tooling where it is unsupported. This is an implementation limitation rather than a universal semantic law, but it is useful failure evidence: repeated/concurrent execution creates live state that cannot safely be reconstructed from the static diagram alone.

Portable lesson: `engine can/cannot migrate` is not the semantic criterion. A safe migration claim needs explicit iteration/item lineage and outstanding obligation evidence.

### Petri-net / workflow soundness perspective

Workflow-net research treats soundness in terms of reachable markings and the ability to complete without residual tokens/deadlocks/livelocks. This provides a portable warning for loop evolution: a repeated path can leave residual obligations even when the visual cursor has returned to a familiar node. Token/flow research likewise distinguishes local flow histories from global markings.

Portable lesson: returning to the same visual location does not restore the previous semantic state.

`same node position after loop != same marking / obligation frontier`.

## Core hypothesis

A loop-capable occurrence needs at least three identities that must not be conflated:

```text
OccurrenceIdentity
  stable across the business/workflow occurrence

IterationEpoch
  identifies one semantically distinct traversal/activation epoch of a repeated region

AttemptIdentity
  identifies retry/redelivery/execution attempts for an obligation inside that epoch
```

Where multi-instance semantics exist, a fourth dimension may be required:

```text
InstanceItemIdentity
  identifies one item/child instance in a repeated collection/body
```

These are research dimensions, not committed schemas.

Critical rules:

`OccurrenceIdentity != IterationEpoch != AttemptIdentity`.

`IterationEpoch != multi-instance item by implication`.

`retry/redelivery != next iteration`.

`next iteration != restarted occurrence`.

## Iteration epoch

Candidate `IterationEpoch` is a semantic activation identity for one pass through a repeated region when evidence from one pass must not satisfy obligations of another.

It may qualify, where material:

- loop/repeated-region identity and applicable design lineage;
- parent occurrence identity;
- predecessor iteration/causation reference;
- loop-entry/admission evidence;
- loop-condition evaluation/evidence and its currentness;
- active branch/item identities created within the iteration;
- Gates/Handoffs/Corridors belonging to the iteration;
- unsettled effects and residual obligations;
- exit/continue decision evidence;
- migration/requalification evidence if design changes during the loop.

An epoch is not necessarily a globally increasing integer. A local sequence number may be one realization, but semantic identity must survive topology, replay and projection changes without depending on wall-clock ordering.

## Corridor traversal

A Corridor can be traversed repeatedly without becoming multiple designed Corridors. Observed traversal evidence must identify the occurrence and iteration epoch when repeated traversal matters.

`CorridorRef stable != CorridorTraversal identity stable`.

A completed traversal in epoch N cannot satisfy a required traversal in N+1 merely because source/target and contract are unchanged.

A retry of transport/delivery for the same traversal obligation retains the original epoch and obligation lineage; it does not mint a fresh pass.

## Gates in loops

A Gate may be:

- once-per-occurrence;
- once-per-iteration;
- once-per-item/multi-instance child;
- currentness-sensitive at each protected effect;
- exit/join scoped after a repeated region.

Therefore:

`Gate predicate equality != Gate evaluation-scope equality`.

Evidence from iteration N is reusable in N+1 only when the Gate contract explicitly permits that reuse and its authority/currentness horizon remains valid. Otherwise, `SATISFIED@N` does not imply `SATISFIED@N+1`.

A Gate added in successor design D2 cannot be inferred satisfied for an already-completed D1 iteration. For future D2-protected effects, explicit requalification may be required without rewriting D1 history.

## Handoffs in loops

Repeated Handoffs require responsibility lineage per relevant epoch/item.

`accepted handoff@N != accepted handoff@N+1`.

If the same actor/team remains responsible across iterations, continuity may be represented explicitly, but it cannot be fabricated from identity equality. Escalation, rejection, expiry or reassignment in one iteration must not silently contaminate another.

For four-eyes/dual-control loops, actor-independence requirements may be scoped per iteration, across a rolling window, or across the whole occurrence. The scope is part of the invariant; the Canvas cannot infer it from repeated geometry.

## Retry / redelivery / replay

Retry and redelivery are attempts to discharge the same semantic obligation unless an explicit re-admission/restart creates a successor obligation.

Candidate distinction:

```text
IterationEpoch E7
  Obligation O9
    Attempt A1 -> timeout/unknown
    Attempt A2 -> retry of O9
```

is different from:

```text
IterationEpoch E8
  Obligation O10 -> new loop pass
```

This protects joins, Gates, Handoffs, deduplication and effect identity from accidental cross-iteration reuse.

`new attempt != new obligation`.

`dedup key != iteration identity by implication`.

## Multi-instance execution

Multi-instance repetition requires an item/child identity independent from iteration order. Parallel items cannot rely on completion order as identity; sequential execution does not make item identity equivalent to a global loop counter.

Candidate shape:

```text
IterationEpoch
  MultiInstanceBodyActivation
    ItemIdentity[]
      item input/provenance
      local branch lineage
      attempts
      result/effect evidence
      disposition
```

A completion condition that ends the body early must preserve the distinction between completed, terminated/cancelled, pending and never-created obligations where the runtime semantics make those distinctions material.

`body completed != every child completed successfully`.

If a successor design changes collection derivation, cardinality, completion condition or output aggregation, migration must not restamp predecessor child instances as if they had been created under the successor rule.

## Loops crossing design evolution

A live occurrence may execute iteration N under D1 and iteration N+1 under D2 without changing occurrence identity if the transition policy permits it.

```text
Occurrence O
  Epoch E7 -> Design D1
  transition/requalification evidence
  Epoch E8 -> Design D2
```

This does not mean D2 owns or reinterprets E7.

`successor iteration design != predecessor observed semantics`.

If design changes while an iteration is active, migration safety is evaluated for that active epoch using the existing live-occurrence/branch/join rules. It is not enough to wait for the visual loop to return to its entry node if effects or branch obligations remain unsettled.

A design cutover may choose a loop boundary as a convenient transition frontier only when that boundary is proven to settle the named invariants.

`loop boundary != safe cutover frontier by definition`.

## Loop condition and exit decisions

Loop continuation/exit is a decision with its own evidence when material. A stale or successor condition must not be retroactively applied to an earlier iteration.

Candidate distinction:

- condition evaluated under D1 and caused E7 -> E8;
- D2 later changes the condition;
- D2 governs only successor decisions according to the declared transition policy.

`condition changed != historical exit/continue decision rewritten`.

If condition evaluation depends on external/currentness-sensitive facts, missing/stale evidence remains `UNKNOWN/DEFER` where required; downstream presence cannot prove the missing condition evaluation.

## Joins and loop epochs

The parallel-join research introduced join epochs. Loop iteration makes their relationship explicit: a branch contribution must bind to the correct join activation/iteration context.

A contribution from iteration N cannot satisfy a join in N+1 merely because:

- correlation ID is the same;
- branch/module identity is the same;
- payload is identical;
- the previous contribution arrived late;
- a retry is mistaken for a new iteration;
- the design revision is unchanged.

`same occurrence != same join epoch`.

Late predecessor-iteration contributions require explicit duplicate/late/reconciliation disposition and cannot silently reopen a completed join.

## Designed / observed / assessed semantics

Preserve the established split:

```text
DESIGNED
  repeated region, loop condition, Gate/Handoff scope,
  multi-instance cardinality/collection, join/exit obligations

OBSERVED
  iteration activations, item instances, attempts, traversals,
  Gate/Handoff evidence, effects, exit/continue decisions

ASSESSED
  conformance of each observed epoch/item/attempt against
  the applicable design-lineage interval
```

A design loop symbol is not evidence that an iteration occurred. A repeated observed path is not proof that the designed loop semantics were satisfied.

`repeated path shape != conformant loop iteration`.

## Cross-projection invariants

The same occurrence, iteration, item, obligation and attempt identities must survive across 2D Composition, 3D Building/Onion, Workflow Canvas, Corridor/Handoff Map, Relation Graph, Capability Map, Topology Map and Floor View.

The 3D Canvas may visually stack, spiral, animate or collapse repeated traversals, but visual cycle count cannot become authoritative iteration identity.

A projection may aggregate 100 iterations for usability while retaining drill-down evidence. Aggregation cannot silently erase exceptional, bypassed, unknown or unsettled epochs.

`visual aggregation != semantic compaction authority`.

## Failure / recovery states that must remain representable

- retry A2 of epoch N arrives after epoch N+1 has begun;
- late branch from N reaches a join waiting for N+1;
- Gate passed in N but requires reevaluation in N+1;
- Handoff accepted in N but expired before N+1;
- loop condition is `UNKNOWN` after an external dependency outage;
- D2 changes loop condition between iterations;
- D2 is published while N is active under D1;
- N completes workflow steps but an external effect remains `UNKNOWN`;
- multi-instance body completes early while some children are terminated;
- parallel child outputs race on shared state;
- collection membership changes after child instances were created;
- projection aggregates iterations and hides one bypass/exception;
- runtime restarts and loses a monotonic iteration/effect fence;
- manual modification jumps into a later iteration without entry evidence.

Recovery preserves lineage and ambiguity rather than manufacturing a clean next iteration.

## Proof obligations

1. Module and occurrence identity are not duplicated by repeated views/traversals.
2. Iteration epoch is distinguishable from occurrence identity where obligations repeat.
3. Attempt identity is distinguishable from iteration identity.
4. Multi-instance item identity is distinguishable from loop iteration and attempt identity.
5. Retry/redelivery preserves the original obligation/epoch absent explicit re-admission.
6. A new iteration cannot be inferred from a new transport delivery attempt.
7. Repeated Corridor traversal binds to the correct occurrence/iteration obligation.
8. Corridor completion in N cannot satisfy a required traversal in N+1 without an explicit reusable invariant.
9. Gate evaluation scope (occurrence/iteration/item/effect/join) is explicit where material.
10. Gate evidence from N is not reused in N+1 unless the contract/currentness rules permit it.
11. A successor Gate does not rewrite predecessor iteration history.
12. Handoff acceptance/responsibility lineage is scoped to the relevant iteration/item where required.
13. Responsibility continuity across iterations is explicit rather than inferred from same actor/team identity.
14. Separation-of-duty scope across iterations is declared and verifiable.
15. Multi-instance child identity does not depend on parallel completion order.
16. Multi-instance body completion preserves completed/terminated/pending distinctions where material.
17. Early completion does not fabricate successful completion for terminated children.
18. Successor collection/cardinality rules do not retroactively redefine predecessor children.
19. Loop-condition evaluation is bound to the applicable design/currentness context.
20. Changing a loop condition does not rewrite historical continue/exit decisions.
21. Loop entry/exit geometry does not itself prove a safe migration/cutover frontier.
22. Design evolution may occur between iterations without requiring a new occurrence identity when explicitly qualified.
23. Active-iteration migration still accounts for unsettled effects, Gates, Handoffs, branches and joins.
24. Join contributions bind to the correct loop/join epoch.
25. Late N contribution cannot satisfy/reopen N+1 join silently.
26. Correlation IDs do not substitute for iteration/join causation proof.
27. Runtime restart/restore cannot roll back an iteration/effect fence in a way that resurrects stale obligations.
28. Designed, observed and assessed iteration histories remain separate and revision-qualified.
29. Cross-projection aggregation does not erase exception/bypass/unknown/settlement evidence.
30. Projection animation/counting is never canonical iteration authority.
31. Adapter/provider/driver cannot fabricate iteration equivalence or migrate obligation lineage silently.
32. AI may suggest loop mappings or anomaly classifications but cannot invent iteration, Gate, Handoff, effect or migration evidence.

## Adversarial cases

1. UI increments a loop counter on every message redelivery and creates false iterations.
2. Retry from N is treated as first attempt of N+1.
3. Late N token satisfies N+1 join because correlation ID matches.
4. Same Corridor is green from N, so N+1 traversal is marked complete.
5. Gate passed once and is silently considered valid for all future iterations.
6. Gate predicate text is unchanged but scope changes from occurrence to iteration and UI misses the change.
7. Same team handles N and N+1, so responsibility acceptance is inferred without a new/continuing Handoff contract.
8. Four-eyes requirement is scoped per iteration but actors from different iterations are combined to satisfy it.
9. Parallel multi-instance children are identified by completion order and swap identities.
10. Sequential multi-instance item identity is reduced to a mutable loop counter and lost after replay.
11. Early completion terminates siblings but dashboard reports all children successfully completed.
12. Input collection changes and predecessor child evidence is restamped against successor membership.
13. D2 changes exit condition and historical D1 iterations are recomputed as non-conformant without preserving original semantics.
14. D2 is published mid-iteration and the active epoch silently adopts latest rules.
15. Loop returns to entry node and migration assumes all effects settled.
16. External effect from N is `UNKNOWN`; N+1 issues conflicting effect as if predecessor were settled.
17. Runtime restore reuses an old iteration number/fence and stale work becomes admissible.
18. Projection collapse hides a bypassed iteration among many normal ones.
19. 3D animation frame count becomes the persisted iteration identity.
20. Manual token move into the loop body fabricates loop-entry evidence.
21. Capability shaft crossing a loop causes all participating modules to share one iteration identity.
22. Provider-local job attempt number is treated as business iteration identity.
23. Dedup TTL expires and an old N delivery is accepted as a new N+1 obligation.
24. Join epoch is derived only from design revision; two iterations on the same design collide.
25. New design revision is treated as automatically starting a new iteration.
26. New iteration is treated as automatically using the newest design despite pinned transition policy.
27. Same payload is used as iteration identity and repeated legitimate items collide.
28. Adapter normalizes two engine-specific loop models and silently loses completion-condition semantics.
29. Multi-instance race corrupts shared output but projection marks body conformant from child completion count.
30. `UNKNOWN` loop condition is coerced to false/exit for convenience.
31. Historical assessment is overwritten after loop-policy evolution.
32. AI infers missing iteration evidence from visual repeated-path shape and the inference is stored as proof.

## Portability / exit path

No loop engine or notation is selected. A future realization may use BPMN, Petri-net-derived analysis, event-sourced state machines, Temporal-like durable execution or another runtime if it preserves the relevant semantic distinctions:

- stable occurrence identity;
- iteration/item/attempt lineage where required;
- Gate/Handoff scope and evidence;
- retry/redelivery identity;
- join-epoch isolation;
- effect settlement/currentness;
- design-lineage transitions;
- designed/observed/assessed separation;
- explicit unknown/late/duplicate/recovery dispositions.

A technology that exposes only a mutable loop counter or current node can still be adapted only if the missing semantics can be represented externally without fabricated equivalence. Otherwise incompatibility must remain explicit.

## Maturity and open gaps

Maturity: `MATERIAL / NOT SATURATED / NON_EXECUTABLE`.

Material delta over the preceding join research:

`parallel branch/join epoch -> repeated region -> occurrence vs iteration vs attempt vs item identity -> repeated Gate/Handoff/Corridor evidence -> retry isolation -> multi-instance semantics -> design evolution across iteration boundaries -> join-epoch isolation`.

Next highest-value gap: **loop exit/termination/cancellation and residual-obligation semantics under design evolution**, especially early completion, interrupting cancellation, compensation/remediation, non-fenceable external effects and whether a later iteration may start while predecessor residual effects remain `UNKNOWN`. The key question is how to distinguish `loop/body ended` from `all obligations settled` without turning every repeated workflow into a global barrier.

## Sources consulted

Primary/standards and mature-system evidence:

- OMG BPMN 2.0/2.0.2 loop activity and runtime loop-counter semantics.
- Camunda 8 multi-instance semantics, local `loopCounter`, parallel/sequential child execution, completion conditions, output collection and variable-scope/race guidance.
- Camunda process-instance migration/modification limitations for active multi-instance/multiple-running-scope state.
- Workflow-net/Petri-net soundness literature and token-flow analysis as portable verification background.

These sources inform portable semantics only; none is an adoption decision.