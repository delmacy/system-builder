# G4 — Canvas Parallel-Branch / Join Migration Safety Research

Status: `RESEARCH_ACTIVE / NON_EXECUTABLE`
Execution authority: NONE

## Scope

This artifact deepens the Main Composition Canvas 3D research at the boundary between live-occurrence design evolution and partially completed parallel branches that later reconverge. It is implementation-independent and does not select BPMN, Petri nets, Camunda, Temporal or any workflow engine. G3 remains semantically authoritative; research does not authorize implementation.

The question is: when branches of one live occurrence evolve or migrate independently, what evidence is required before they may reconverge, when may branch-local migration remain local, and when must a join establish a coherent barrier/drain without inventing a global design generation?

## Evidence base and portable lessons

### BPMN parallel-gateway semantics

BPMN 2.0.2 defines a parallel join as synchronization: activation requires at least one token on every incoming Sequence Flow, after which exactly one token from each incoming flow is consumed. Camunda documents the same operational intuition: concurrent branches execute independently and the parallel join waits until each incoming sequence has been taken.

Portable lesson: join semantics are stronger than graph convergence. Arrival on one downstream node does not prove the other branches completed, nor does visual reachability prove synchronization.

`downstream reachability != join satisfaction`.

### Camunda live migration at joining gateways

Current Camunda 8 documentation explicitly handles a joining parallel/inclusive gateway that has already received some incoming flows and is waiting for others. Migration requires mapping the active join, and taken incoming sequence flows must be mapped to target flows. The target join must have at least as many incoming flows as the source. Existing jobs/variables are not automatically recreated or reevaluated merely because the process definition changed.

Portable lesson: a partially satisfied join contains live semantic state. Migration cannot be derived solely from mapping currently active tasks; already-arrived branch evidence participates in the migration cut.

Camunda's migration operation is strongly consistent for the process-instance migration command and validates mappings, but this is an engine-specific conservative realization, not proof that every System Builder invariant requires whole-instance atomic migration.

### Failure experience from migration/modification tooling

Camunda's migration tooling documents partially completed parallel joins as a difficult case; some migration paths/tools recommend waiting until no token is parked at a joining parallel gateway. Camunda process-instance modification also warns that manual activation can produce states unreachable by normal execution, including stuck parallel joins.

Portable lesson: a runtime accepting a structural state transition does not prove the resulting state is semantically reachable or conformant.

`engine accepted modification != workflow-semantic conformance`.

## Core hypothesis

A parallel occurrence should not be modeled as having one undifferentiated design revision while branches are live. Nor should every branch automatically become a separate occurrence.

Candidate research shape:

```text
OccurrenceIdentity
  BranchLineage[]
    branchRef
    designLineageRef
    executedTrailEvidenceRefs[]
    activeGate/Handoff/CorridorRefs[]
    unsettledEffectRefs[]
    currentness/authority refs
  JoinObligation[]
    joinRef
    expectedBranch/flow obligations
    arrivedBranchEvidenceRefs[]
    pendingBranchRefs[]
    joinInvariantRefs[]
    compatibility/requalification refs
    unknownFrontierRefs[]
```

These are research dimensions, not committed schemas.

Critical rules:

`one occurrence may contain multiple live branch lineages`.

`branch lineage != semantic owner`.

`branch-local migration != occurrence-global migration by implication`.

`branch completion != join satisfaction`.

`join satisfaction != downstream business effect`.

## Branch-local evolution

A branch may be eligible for local migration when the changed semantics are confined to that branch and no protected cross-branch invariant requires a coherent cut.

Examples that may be branch-local, subject to evidence:

- implementation/provider change behind an unchanged qualified contract;
- a local Corridor successor that preserves the branch's output obligation;
- a local Handoff remapping before acceptance where no shared responsibility invariant is affected;
- a local Gate revision whose result is consumed only within the branch and whose successor/currentness rules permit migration.

Branch-local migration is not safe merely because the other branch has no graph edge to the changed element.

`no direct edge != proven cross-branch independence`.

The proof must name the invariant and show that the changed branch's obligations presented to the future join remain compatible.

## Join as semantic barrier, not decorative diamond

A Join is a synchronization obligation over qualified branch contributions. The visual node is only a projection.

A candidate `JoinEvidenceCut` includes, when material:

- join design/revision identity;
- expected incoming branch/flow identities;
- branch lineage/revision for each contribution;
- evidence that each required branch reached the declared join frontier;
- Gate satisfaction/bypass evidence that qualifies that arrival;
- Handoff/responsibility state where required;
- branch output contract/revision and currentness;
- unsettled/unknown external-effect state;
- compatibility evidence between mixed branch generations;
- authority for exceptions/withdrawn branches;
- causation/correlation sufficient to prove the contributions belong to the same occurrence/join epoch.

`same correlation id != join identity proof`.

`token arrived != all branch obligations satisfied`.

## Mixed-generation joins

A join does not require a universal `DesignGeneration=42` shared by all branches.

Mixed branch generations may reconverge if the join's named invariant can be proven across their qualified outputs:

`B1@D1 + B2@D2 may be join-compatible`.

Conversely, equal design revision does not prove compatibility if one branch's evidence is stale, bypassed, unsettled or produced under incompatible authority.

`same revision != coherent join proof`.

This mirrors the broader G4 rule that mixed generation is not automatically torn; coherence is a proof claim relative to the protected invariant.

## Already-arrived branch evidence

When branch A has already reached a join and branch B is still active, A's arrival is live semantic state, not merely historical decoration.

If the successor design changes the join or remaps A's incoming path, migration must decide explicitly whether A's existing arrival evidence:

- maps equivalently to the successor incoming obligation;
- requires requalification;
- remains valid only under the predecessor join;
- must be withdrawn/remediated and re-admitted;
- is incompatible/unknown.

A newly inserted stage before the target join cannot be inferred satisfied because A had already arrived under the predecessor design.

`arrived under D1 != predecessor stages added in D2 satisfied`.

Likewise, removing a stage in D2 does not rewrite A's historical path.

## Gate obligations across branches

A Gate may be branch-local or join-scoped.

- Branch-local Gate: qualifies one branch contribution.
- Join-scoped Gate: verifies a predicate requiring evidence from multiple branches or from the synchronized cut.
- Post-join Gate: evaluates after synchronization and cannot be backfilled from downstream observation.

Changing one Gate class into another is a semantic change even if the visual predicate text is identical.

`same predicate text != same verification scope`.

A branch bypass remains `BYPASSED_QUALIFIED`, not `SATISFIED`, at the join. The join contract decides whether that qualified bypass is admissible; it cannot normalize it into ordinary passage.

## Handoffs and responsibility at joins

Parallel branches can carry independent responsibility lineages. Reconvergence does not automatically collapse them into one owner.

A join may require:

- completion evidence from each responsible party;
- explicit acceptance of a successor responsibility after the join;
- dual-control/four-eyes evidence where branches intentionally separate duties;
- proof that the same actor did not improperly satisfy both branches when separation-of-duty is an invariant.

Thus:

`two completed branches != dual-control satisfied`.

`join != ownership transfer`.

If a Handoff was accepted before branch migration, successor mapping must preserve that responsibility lineage or explicitly transfer/settle it.

## External effects and settlement

Each branch can have external effects with independent settlement frontiers. A join must not convert branch-local ambiguity into global success.

Candidate dispositions for a branch contribution include:

- `ARRIVED_SETTLED`;
- `ARRIVED_EFFECT_PENDING`;
- `ARRIVED_EFFECT_UNKNOWN`;
- `PENDING_BRANCH_WORK`;
- `WITHDRAWN_QUALIFIED`;
- `INCOMPATIBLE`;
- `UNKNOWN`.

These are research vocabulary, not product enums.

A hard join invariant may require every material branch effect to be settled or fenced. A softer workflow may allow the join to proceed with explicit residual obligations. The guarantee must be declared; the Exchange Plane/runtime cannot invent it.

`all tokens present != all effects settled`.

## Barrier / drain semantics

A coherent barrier is required only when a named invariant spans multiple branches and partial evolution could violate it.

Candidate rule:

`BarrierScope = smallest proof-complete set of live branch obligations whose independent transition could violate the named join invariant`.

This is not necessarily the whole occurrence, module, capability shaft or Canvas.

A barrier may require branches to reach a stable frontier before migration. A drain may let predecessor obligations settle while blocking successor admission across the affected join. Neither means global runtime shutdown.

`join barrier != global transaction`.

`branch drain != occurrence termination`.

If branches are genuinely independent until a future join, they may evolve separately and defer compatibility proof to that join frontier.

## Join epochs and duplicate/late arrivals

Retries, duplicate messages and delayed branch completions require a join to distinguish the intended contribution epoch.

A branch contribution should preserve enough identity/causation to distinguish:

- retry/redelivery of the same obligation;
- successor re-admission;
- restarted branch;
- late predecessor-generation arrival;
- duplicate effect evidence;
- contribution for another occurrence or another iteration of the same loop.

`correlation != causation` and `message delivery != branch completion`.

A late D1 arrival after a join has transitioned under a D2-qualified cut cannot silently reopen or double-satisfy the join. It requires an explicit late-arrival/reconciliation disposition.

## Designed / observed / assessed semantics

Preserve the established split:

```text
DESIGNED
  join topology, branch obligations, Gate/Handoff rules, successor mappings

OBSERVED
  actual branch executions, arrivals, effects, bypasses, handoffs and migration evidence

ASSESSED
  conformance of the observed branch/join trace against the applicable design-lineage segments
```

A join redesign never rewrites predecessor arrivals.

`successor join topology != predecessor observed token history`.

Conformance may report that a branch arrived under a predecessor obligation and was explicitly mapped/requalified for a successor join. That is different from claiming the branch executed the successor path.

## Cross-projection invariants

The same branch/join identities and lineage must survive across:

- 3D Building/Onion projection;
- Workflow Canvas;
- Corridor/Handoff Map;
- Relation Graph;
- Capability Map;
- Topology Map;
- Floor View.

A 3D visual merge of corridors cannot imply synchronization. A Workflow join symbol cannot imply effect settlement. A Topology co-location cannot imply branch semantic compatibility.

`visual convergence != semantic join`.

Projection lag/currentness remains explicit. A stale projection cannot authorize migration merely because all branches appear green.

## Failure / recovery states that must remain representable

- A arrived at predecessor join; B is active; target design inserts C on A's path.
- A and B migrate independently to revisions whose outputs are incompatible at the join.
- both branches show complete, but A's external effect is `UNKNOWN`.
- branch A used an authorized bypass; join requires ordinary satisfaction.
- branch B Handoff is accepted while migration preview is open.
- join mapping validates structurally but changes separation-of-duty semantics.
- a late predecessor-generation branch arrives after successor join completion.
- retry duplicates an already-counted branch contribution.
- one branch is withdrawn under authority while another waits indefinitely.
- target join is superseded after one branch has been migrated.
- barrier is established but one branch cannot drain.
- manual modification creates a token state unreachable by designed execution.
- projection shows all incoming paths complete while authoritative evidence is stale.
- runtime is offline while successor join rules/security floors are published.

Recovery must preserve lineage and ambiguity. `UNKNOWN` is preferable to fabricating join satisfaction.

## Proof obligations

1. A Module/occurrence identity is not duplicated because it has parallel branch faces/views.
2. Branch lineage does not transfer semantic ownership.
3. Branch-local migration names the invariant under which locality is claimed.
4. Absence of a graph edge is not sufficient proof of cross-branch independence.
5. A join has explicit identity/revision independent of its visual glyph.
6. Required incoming branch obligations are explicit for the applicable join revision.
7. Already-arrived predecessor branch evidence is part of the live migration cut where material.
8. A branch arrival is not reinterpreted as having traversed stages added only in the successor design.
9. Removing a successor stage does not rewrite predecessor history.
10. Mixed branch generations require explicit compatibility evidence where a join invariant spans them.
11. Equal design revision alone does not prove join coherence.
12. Join evidence binds contributions to the correct occurrence/join epoch.
13. Correlation identifiers do not substitute for identity/causation proof.
14. Retry/redelivery cannot double-satisfy a join.
15. Late predecessor arrivals remain representable and cannot silently reopen/double-complete a successor join.
16. Branch-local Gate evidence preserves satisfied/bypassed/rejected/unknown distinctions.
17. Join-scoped Gate evidence cannot be fabricated from independent branch-local passes.
18. Observed downstream state does not prove missing upstream Gate passage.
19. Handoff acceptance/responsibility lineage survives branch migration.
20. Reconvergence does not implicitly transfer or collapse business ownership.
21. Separation-of-duty/four-eyes invariants verify actor/authority independence where required.
22. Workflow token presence does not substitute for external-effect settlement.
23. `ACK`/delivery does not substitute for branch completion or join effect.
24. Unsettled/unknown branch effects remain representable at the join.
25. Barrier scope is derived from the named invariant, not from the entire occurrence/Canvas by default.
26. Branch-local drain does not imply global occurrence termination.
27. Join migration does not require a synthetic global generation when qualified mixed generations are compatible.
28. Structural mapping acceptance does not prove business-semantic migration safety.
29. Manual modification that creates unreachable state remains detectable as conformance deviation.
30. Projection geometry/color never establishes join satisfaction or migration authority.
31. Conformance assessments bind to the relevant branch/join design-lineage intervals and are not historically rewritten.
32. AI may assist with mapping/impact analysis but cannot invent compatibility, settlement, ownership or authority evidence.

## Adversarial cases

1. 3D corridors visually meet, so UI marks join satisfied.
2. A reaches D1 join; D2 inserts mandatory stage C before A; migration marks C satisfied.
3. D2 removes a Gate and historical D1 bypass becomes ordinary pass.
4. A and B both display green although A's external effect is unknown.
5. Same target join element ID is treated as semantic equivalence despite changed incoming obligations.
6. One branch migrates to weaker output guarantees and join compatibility is assumed.
7. Both branches are on D2, so coherence is assumed despite stale authority evidence.
8. Branch-local migration is allowed merely because no direct graph edge exists to the sibling.
9. Capability-shaft membership causes all branches to be globally locked/migrated.
10. A retry/redelivery contributes a second token/evidence to the join.
11. Late D1 message arrives after D2 join completion and triggers duplicate downstream effect.
12. Correlation ID collision is treated as same occurrence/join epoch.
13. Handoff accepted by Team A is restamped to Team B during branch migration.
14. Join collapses two responsibility lineages into one owner without transfer evidence.
15. Four-eyes process is considered satisfied although the same actor performed both branches.
16. Gate passes independently on each branch but required cross-branch predicate was never evaluated.
17. Engine migration API accepts mapping, so business compatibility is declared proven.
18. Engine rejects a migration limitation, so product incorrectly concludes semantic migration is impossible in principle.
19. Whole occurrence is frozen because one join invariant spans only two of many independent branches.
20. Independent branches are migrated separately although a hidden join invariant requires a shared cut.
21. Barrier timeout is interpreted as branch settlement.
22. Drain completion is inferred from no visible token while external effect remains unresolved.
23. Projection refresh failure retries migration and duplicates side effects.
24. Manual token activation creates unreachable join state but conformance view labels it normal.
25. Target D2 join is superseded by D3 after A migrates; B silently targets latest.
26. Removed incoming flow causes predecessor contribution to disappear from audit history.
27. New incoming flow is treated as already satisfied by downstream position.
28. Adapter fabricates compatibility between branch output contracts.
29. Provider ACK is treated as effect convergence before join.
30. Offline runtime uses obsolete join/security rule indefinitely for new protected effects.
31. Historical conformance report is recomputed under successor join and replaces predecessor assessment.
32. AI recommendation is stored as proof that mixed-generation branches are safe to join.

## Portability / exit path

No specific workflow engine or notation is required. A future realization may use BPMN/Zeebe, Petri-net-derived analysis, event-sourced state machines, Temporal-like workflows or another runtime if it can preserve:

- stable occurrence and branch/join identity;
- explicit branch design lineage;
- arrived/pending contribution evidence;
- Gate/Handoff/responsibility lineage;
- external-effect settlement/unknown state;
- compatibility evidence for mixed generations;
- duplicate/late-arrival handling;
- conformance/audit lineage;
- bounded runtime autonomy.

Provider migration must export these semantic facts rather than only engine-local token positions.

## Maturity and next gap

State: `MATERIAL / NOT SATURATED / NON_EXECUTABLE`.

This round materially refines live-occurrence evolution for partially completed parallel branches and establishes join evidence/barrier semantics without requiring a global generation or global transaction.

Next high-value gap: **loops, repeated corridor traversal and join epochs under design evolution**. Research should determine how iteration identity, retry/redelivery, loop re-entry, repeated Handoffs/Gates and successor-design cutover interact so that a contribution from iteration N cannot satisfy iteration N+1, while preserving occurrence identity and avoiding a global workflow generation.