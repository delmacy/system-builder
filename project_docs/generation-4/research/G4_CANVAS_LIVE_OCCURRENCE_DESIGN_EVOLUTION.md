# G4 — Canvas Live-Occurrence Design Evolution Research

Status: `RESEARCH_ACTIVE / NON_EXECUTABLE`
Execution authority: NONE

## Scope

This artifact deepens the Main Composition Canvas 3D research at the boundary between successor design revisions and occurrences already in flight. It is implementation-independent and does not select a workflow engine, BPMN runtime, Petri-net engine, event store, migration framework or provider. G3 remains semantically authoritative; research does not authorize implementation.

The question is: when a Door, Counter, Corridor, Handoff or Gate changes while occurrences are active, which occurrences may continue under their admitted design lineage, which may migrate to the successor design, which require drain/settlement/manual review, and which are incompatible?

## Evidence base and portable lessons

### Camunda process-instance migration

Camunda 8.9 documents migration as an explicit operation from a running instance to another process definition. A migration plan maps active source elements to target elements; all active elements require supported mappings. Migration validation can reject the operation, and migration is transactional for the active instance: all active elements migrate or the instance remains unchanged. Camunda also preserves important active-element state rather than silently recreating it: existing jobs, variables and user tasks can retain values/properties from the source definition. The documentation explicitly warns that a structurally accepted migration can still create an unintended process situation and recommends care/testing.

Portable lesson: `new design deployed != live occurrence migrated`; `migration accepted structurally != business-semantic equivalence proven`; active state/effects require explicit lineage-aware mapping.

Camunda additionally preserves immutable business identity through migration while changing the associated process definition. Portable lesson: occurrence identity can survive design-version migration without pretending that source and target definitions are the same semantic revision.

### History-equivalence research for dynamic process migration

Recent Petri-net research on dynamic process migration uses execution history to determine whether old and new workflow states are equivalent and identifies non-migratable states in the change region. The portable lesson is not adoption of one algorithm but the principle that current node/topology alone is insufficient: migration eligibility can depend on the occurrence's actual executed trail.

Thus:

`same active node != same migration eligibility`.

### Versioned workflow practice

Mature workflow systems generally separate definition evolution from already-running state and expose explicit version/migration mechanisms. This supports a System Builder rule: publishing a successor design establishes new design authority for the declared admission scope; it does not rewrite historical occurrence facts or silently reinterpret already-admitted work.

## Core hypothesis

A live occurrence has at least two distinct lineages:

```text
OccurrenceIdentity
  admissionDesignRevisionRef
  currentDesignLineageRef
  executedTrail/evidence frontier
  active obligations
  active Gate/Handoff/Corridor state
  external-effect frontier
  authority/currentness refs
```

These are research dimensions, not a committed schema.

Critical rules:

`successor design published != occurrence migrated`.

`occurrence identity != design revision identity`.

`migration != historical rewrite`.

`structural mapping != semantic equivalence`.

`inactive future path changed != already-executed path changed`.

## Candidate occurrence dispositions

For a named invariant and successor design, an active occurrence may be classified conceptually as:

- `CONTINUE_PINNED` — continue under the admitted design lineage for the relevant obligations.
- `MIGRATABLE_QUALIFIED` — a qualified mapping preserves the named invariants and required evidence/authority.
- `DRAIN_THEN_ADVANCE` — finish or settle a bounded old-design obligation before crossing to the successor lineage.
- `MANUAL_REVIEW_REQUIRED` — evidence is insufficient or business authority must adjudicate the transition.
- `INCOMPATIBLE` — no admissible mapping preserves the required invariant.
- `UNKNOWN` — migration safety/currentness cannot be proven.

These are research vocabulary, not product enums.

No ordering such as `CONTINUE_PINNED < MIGRATE` is implied. The correct disposition is invariant- and occurrence-relative.

## Occurrence-relative migration cut

The prior Canvas impact research derives a design-side `SemanticImpactCut`. Live evolution requires a second cut:

```text
OccurrenceMigrationCut
  occurrenceRef
  sourceDesignRevisionRef
  targetDesignRevisionRef
  activeSemanticStateRefs[]
  executedTrailEvidenceRefs[]
  unsettledEffectRefs[]
  activeGateRefs[]
  activeHandoffRefs[]
  activeCorridorRefs[]
  requiredMappingRefs[]
  preservedInvariantRefs[]
  requalificationRefs[]
  unknownFrontierRefs[]
```

Again, this is a research shape.

The design impact cut asks what the edit can affect. The occurrence migration cut asks what this particular live occurrence has already done, owes, waits for, or may still cause.

`design impact set != live occurrence migration set`.

## Doors and Counters

If a Door/Counter contract changes, active requests cannot be silently relabeled to the successor contract.

Examples:

- A request admitted under `effect-confirmed` semantics remains lineage-bound even if the successor Counter now promises only `accepted-for-processing`.
- A request whose payload has not yet crossed the Door may be re-admitted under the successor contract only through an explicit rule; queue residence alone does not perform semantic migration.
- Retry/redelivery preserves the original obligation lineage unless a qualified re-admission creates a successor obligation.

`queued != not admitted` and `redelivered != newly admitted`.

## Corridors

Changing a Corridor can affect future progression without rewriting already-traversed stages.

Candidate distinction:

- completed segment: historical observed evidence;
- active segment: may require mapping/settlement;
- not-yet-entered segment: may be eligible for successor routing if the occurrence transition rule permits it.

`new corridor topology != retroactive new observed path`.

A successor path that adds a mandatory stage cannot infer that an old occurrence satisfied it merely because the occurrence is already downstream.

`downstream under old design != upstream Gate satisfied under new design`.

## Gates

Gate evolution is especially sensitive.

If a Gate predicate becomes stricter:

- historical passage under the old design remains historical fact;
- future protected effects may require requalification under the successor/current authority policy if the invariant demands it;
- the new Gate cannot retroactively claim the old occurrence failed at the historical time unless the governing rule itself has legitimate retroactive semantics.

If a Gate becomes weaker, previously rejected/skipped work does not become historically satisfied.

`Gate revision changed != historical passage rewritten`.

`historically passed != indefinitely admissible for every future effect`.

## Handoffs

Handoff migration must preserve responsibility lineage.

If responsibility was `OFFERED` but not accepted, a successor Handoff may be eligible for remapping under an explicit policy. If it was accepted and work/effects began, changing the target role/team cannot silently restamp responsibility.

`handoff target changed != accepted responsibility transferred`.

A live handoff may require withdrawal, explicit re-offer, acceptance, escalation or drain depending on its state and the named invariant.

## External effects and settlement

An occurrence with unresolved external effects cannot be treated as cleanly migratable merely because its workflow token can be mapped.

`token/state mapping != effect settlement`.

Before migration, the system may need evidence that an old-design effect is:

- not yet committed and fenceable;
- committed and compatible with successor obligations;
- settled but requiring successor remediation;
- ambiguous/unknown and therefore blocking a hard-invariant transition.

Migration never erases a dual/external effect that already happened.

## Designed / observed / assessed semantics

Preserve the three-domain split:

```text
DESIGNED:
  D1 --successor--> D2

OBSERVED:
  occurrence O has immutable/append-only evidence under D1 lineage,
  plus explicit migration evidence if O crosses to D2.

ASSESSED:
  conformance assessment binds O + the design lineage/profile applicable to the assessed interval.
```

A migrated occurrence can therefore have segmented conformance:

`O[D1 interval] -> migration evidence -> O[D2 interval]`.

This does not create two occurrence identities.

`one occurrence != one immutable design revision`, but `one occurrence may carry explicit design-lineage segments`.

## Migration eligibility is history/evidence relative

Two occurrences waiting at the same visible Counter or task may differ materially:

- one passed Gate G with current evidence;
- one bypassed G under exceptional authority;
- one has an unresolved external effect;
- one has accepted a Handoff;
- one arrived through an old Corridor branch whose semantics no longer exist.

Therefore:

`same current visual position != same semantic state`.

A 3D/2D projection must not color or group instances as safely migratable solely from geometric position.

## Drain vs migrate vs re-admit

These operations must remain distinct.

- **Drain**: allow already-admitted old-lineage obligations to reach a declared settlement frontier while blocking or redirecting new admissions.
- **Migrate**: explicitly map a live occurrence's semantic state to a successor design while preserving identity and qualified history.
- **Re-admit**: create a new admission decision for work not entitled to inherit the predecessor obligation automatically.
- **Restart**: terminate/settle predecessor work and create a new occurrence; identity/causation relation must remain explicit.

`drain != migrate != retry != re-admit != restart`.

## Atomicity and partial migration

A migration transaction should follow the named invariant and the occurrence's active semantic cut, not the entire Canvas.

If an occurrence has multiple independent branches, branch-local migration may be safe only when no protected join/invariant requires a shared cut. Otherwise partial migration must remain explicitly unsupported/unknown rather than being inferred safe.

Camunda's all-active-elements-or-nothing instance migration is a useful conservative benchmark, not a universal requirement.

`engine transaction boundary != universal semantic transaction boundary`.

## Cross-projection rules

All projections render the same occurrence identity and migration evidence:

- 3D Building/Onion may show which module/floor/depth currently hosts the work;
- Workflow Canvas shows progression and design-lineage segment;
- Corridor/Handoff Map emphasizes responsibility/progression;
- Relation Graph shows contract/dependency relations;
- Topology Map shows runtime placement;
- Floor View shows local context.

No projection owns migration truth.

A view may lag and must expose currentness/revision. A stale view cannot silently issue migration against a successor state without requalification.

`projection says migrated != migration committed`.

## Failure and recovery states that must remain representable

- migration plan validated, but source occurrence advances before commit;
- source Gate/evidence currentness changes during migration;
- target design is superseded before migration commits;
- mapping exists structurally but target contract guarantee is weaker;
- active Handoff is accepted after preview but before migration;
- old external effect commits during migration;
- migration partially reaches an external provider while local state fails;
- occurrence is offline while design successor is published;
- drain never completes because an old obligation is stuck/unknown;
- a migration is rejected and the occurrence remains valid under source lineage;
- manual remediation changes occurrence state before retry;
- rollback restores an older projection but not the actual occurrence lineage;
- migration succeeds but a projection remains stale;
- target design is later rolled back while already-migrated occurrences exist.

Recovery rule: failure never permits the UI to fabricate source/target completion. Preserve source lineage, partial evidence and `UNKNOWN` where necessary.

## Proof obligations

1. Publishing a successor design never silently mutates a live occurrence.
2. Occurrence identity remains stable across qualified design migration.
3. Source and target design revisions remain explicit in migration evidence.
4. Historical observed evidence is never rewritten to look as though it occurred under the successor design.
5. Every active semantic element material to the named invariant has an explicit mapping, settlement rule or unresolved disposition.
6. Structural element-ID mapping alone never proves semantic compatibility.
7. Contract guarantee changes are qualified dimension-by-dimension where material.
8. Door/Counter requests retain admission/obligation lineage through queueing, retry and redelivery.
9. A new admission is explicit; retry does not fabricate re-admission.
10. Completed Corridor segments remain historical facts after design evolution.
11. Newly required stages are not inferred satisfied from downstream position.
12. Gate passage under D1 does not imply Gate satisfaction under D2 for future effects unless an explicit compatibility rule proves it.
13. Gate strengthening does not rewrite historical passage under D1.
14. Gate weakening does not rewrite historical rejection/bypass as ordinary satisfaction.
15. Handoff migration preserves offer/acceptance/responsibility lineage.
16. Changing a Handoff target does not silently transfer accepted responsibility.
17. Unsettled/ambiguous external effects participate in migration admissibility where they can violate the named invariant.
18. Workflow-token mapping never substitutes for effect settlement evidence.
19. `CONTINUE_PINNED` remains a legitimate disposition when source semantics/currentness are still admissible.
20. Offline autonomy does not imply indefinite permission to continue old lineage beyond declared authority/security horizons.
21. Drain blocks/redirects new admissions according to declared policy without rewriting old obligations.
22. Restart creates explicit successor/causal relation rather than laundering occurrence identity.
23. Branch-local migration is allowed only with proof that protected cross-branch invariants/joins are preserved.
24. Migration preview is evidence/projection, not commit.
25. Migration commit requalifies source occurrence revision/currentness when required.
26. Target design supersession before commit is detected rather than silently redirected to latest.
27. Conformance assessments remain bound to the design-lineage interval/profile they assessed.
28. Post-migration conformance can be segmented without duplicating occurrence identity.
29. Projection lag after migration remains explicit.
30. A rejected migration leaves the source occurrence representable and does not imply corruption.
31. Manual review authority is explicit; AI may assist but cannot adjudicate migration safety/ownership by inference.
32. Provider/adapter/runtime implementation details cannot redefine the semantic migration contract.

## Adversarial cases

1. New design publication instantly repoints every active occurrence to D2.
2. UI groups all instances at task A and bulk-migrates them despite different Gate/effect histories.
3. Same BPMN element ID is treated as semantic equivalence after guarantee changes.
4. A queued D1 command is delivered after D2 publication and labeled D2.
5. Retry is treated as a fresh D2 admission.
6. D2 adds a mandatory approval before the current stage and old downstream instances are marked approved.
7. D2 removes an approval and historical D1 bypass is rewritten as normal pass.
8. Handoff accepted by Team A is silently restamped to Team B.
9. Active job keeps D1 implementation semantics but projection shows D2 semantics.
10. Token maps cleanly while an irreversible D1 external effect is unresolved.
11. Migration preview becomes canonical state before commit.
12. Source occurrence advances after preview; stale plan still commits.
13. Target D2 is superseded by D3 and migration silently targets latest.
14. Old design is retired and runtime assumes all old occurrences must be killed despite valid pinned obligations.
15. Offline runtime continues D1 forever after security/authority floor invalidates new effects.
16. Drain timeout is interpreted as settlement.
17. `ACK` from migration API is treated as downstream effect convergence.
18. Projection refresh failure causes migration to be retried as though commit had failed.
19. Rollback of design artifact is treated as rollback of occurrences already migrated.
20. Two independent branches are migrated separately despite a join invariant requiring a coherent generation.
21. Entire occurrence is globally locked because one branch requires migration.
22. Provider inability to realize D2 guarantee is ignored because schema is unchanged.
23. Adapter fabricates equivalence between D1 and D2 contracts.
24. Historical conformance report is recomputed under D2 and replaces the D1 assessment.
25. Observed downstream state is used as proof that an added D2 Gate was satisfied.
26. Restarted occurrence reuses the predecessor identity and hides termination/remediation.
27. Manual operator mapping is accepted without authority/evidence provenance.
28. AI recommends migration and the recommendation is stored as authority proof.
29. 3D geometric location is used as migration eligibility.
30. Capability-shaft membership is used to bulk-migrate unrelated semantic owners.
31. Active Handoff acceptance races migration and both outcomes are accepted.
32. Missing migration evidence is normalized to success because the target state looks healthy.

## Portability / exit path

The hypothesis requires no specific workflow engine. A future implementation may use BPMN/Zeebe, Temporal-like code workflows, Petri-net-derived analysis, event-sourced state machines or another runtime if it can preserve:

- stable occurrence identity;
- explicit design revision lineage;
- active semantic state/effect frontier;
- qualified mapping/compatibility evidence;
- failure/unknown representation;
- audit/conformance lineage;
- runtime autonomy within declared horizons.

Provider migration must export these semantic facts/evidence rather than only engine-local token IDs.

## Maturity and next gap

State: `MATERIAL / NOT SATURATED / NON_EXECUTABLE`.

This round materially separates successor-design publication from live-occurrence evolution and establishes occurrence-relative migration/drain/re-admission semantics.

Next high-value gap: **migration safety at joins and partially completed parallel branches**. Research should determine when independently evolving branch lineages can safely reconverge, what join evidence must prove, how Gate/Handoff obligations survive branch migration, and when a coherent barrier/drain is necessary — without inventing a global generation for unrelated branches.