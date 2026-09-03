# Lifecycle / Versioning / Evolution / Migration — Revisit 04 (Cycle 5)

## Research question
What lifecycle primitives let Generation 2 evolve definitions, contracts, providers, persisted state and in-flight work without conflating revision publication, compatibility, migration actuation, effective consumer uptake, rollback, restore or forward-fix?

## Representatives and evidence/source ledger
1. **Kubernetes API deprecation + version-skew policy** — authoritative project policy. Multiple API versions coexist; round-trip conversion without information loss is required within a release; storage-version advancement waits for coexistence; persisted versions constrain removal; component skew is bounded and upgrade order has prerequisites.
2. **Camunda 8 process-instance migration** — authoritative product docs. Running instances migrate from a specific source definition to a target with explicit element mapping. Existing jobs, variables and tasks can retain old realization semantics after migration; migration does not recreate jobs or reevaluate mappings.
3. **Confluent Schema Registry evolution** — authoritative product docs. Backward/forward/full and transitive compatibility are distinct; non-transitive compatibility against only the latest revision does not prove compatibility with the historical consumer population.
4. **Standards lifecycle evidence already researched in SIAC revisit 4** — RFC-style deprecation/sunset and executable conformance findings remain upstream evidence: deprecation intent, sunset, effective withdrawal and consumer drainage are separate facts.
5. **Provider/Binding cycle-5 evidence** — consumer-effective binding satisfaction and residual-source use remain cross-capability prerequisites for provider migration closure.

## Source of truth and identity
Lifecycle owns the governed transition graph, not the semantic content of the object being evolved. Identity is at least `SubjectIdentity + Revision/Generation + TransitionIdentity`; realization identity is separate. A revision may be published while older revisions remain served, persisted, routed, consumed or in-flight.

Canonical transition lineage:
`TransitionIntentRevision → Readiness/CompatibilityEvidenceSet → TransitionAttempt → Accepted/AppliedRealization → Consumer/WorkloadUptakeEvidence → Validation/PostconditionEvidence → EffectiveTransitionState`.

No single `currentVersion` field is sufficient for mixed-version operation.

## Lifecycle, versioning and coexistence
Lifecycle must represent `introduced`, `supported`, `preferred`, `deprecated`, `sunset-announced`, `withdrawal-eligible`, `withdrawn`, and `drained` independently where applicable. Kubernetes demonstrates that served, preferred and storage versions can differ and coexist. Confluent demonstrates that compatibility is directional and population/baseline scoped. Camunda demonstrates that an instance can adopt a target definition identity while retaining pre-migration jobs or values.

A **revision vector** is therefore required when one semantic transition spans contract revision, provider/binding revision, persisted-data/schema revision, runtime/release revision and consumer population. Lifecycle coordinates these owners but does not absorb their semantics.

## Failure semantics
Transition outcomes include `NOT_STARTED`, `IN_PROGRESS`, `PARTIAL`, `OUTCOME_UNKNOWN`, `APPLIED_NOT_VALIDATED`, `EFFECTIVE`, `FAILED`, `ROLLED_BACK`, `RESTORED`, `FORWARD_FIXED`, and `QUARANTINED` as conceptual states/dispositions, not necessarily one universal enum.

Lost acknowledgement or partition during migration/cutover cannot be treated as failure-to-apply. Reconciliation must inspect effective state before retry. Mixed-version population or inaccessible offline Station produces `PARTIAL`/`INCONCLUSIVE`, never implicit completion.

## Extensibility and provider boundaries
Providers may expose migration, conversion, replay, drain or rollback mechanisms, but provider mechanism does not define lifecycle truth. Provider replacement is complete only when target realization is consumer-effective and residual source use is either zero or explicitly accepted. Opaque provider state can make in-flight migration unsupported; that must be represented rather than approximated lossily.

## Governance and authority
Authorities are faceted: publish revision, declare compatibility, approve migration, actuate cutover, withdraw old revision, restore persisted state and approve forward-fix are distinct. Every destructive/cutover transition requires expected-base/ownership preconditions. A stale actor cannot withdraw a revision after another actor changed the baseline or consumer population.

`Enterprise → Station → Role → Person` remains non-amplifying. A Station may be delegated rollout timing or local validation without gaining authority to weaken enterprise compatibility, retention, security or mandatory-component invariants.

## Observability and evidence qualification
Readiness and transition evidence is generation-bound. Any change to target revision, compatibility policy, provider/binding, consumer population, schema, topology, trust or Station exposure invalidates affected evidence. Completion requires explicit coverage over the intended population, including offline/local members or an authorized exclusion.

## Portability and lock-in
Portable definitions must preserve semantic revision lineage and migration obligations independently of provider-specific migration IDs. Provider-specific opaque state is a portability risk and must be surfaced as a migration representability constraint. Build-once/replicate-many does not imply migrate-once: effective state and consumer uptake remain environment/Station qualified.

## Product-specific mechanism vs universal primitive
**Universal/cross-cutting candidates:** revision/generation identity; transition lineage; expected-base precondition; qualified readiness; consumer-effective uptake; residual-source evidence; ambiguous-outcome reconciliation; local/offline closure.

**Owner-specific mechanisms:** Kubernetes storage conversion/skew rules; Camunda element mapping/job behavior; Confluent schema modes; provider-specific state movers. These must not become universal SB mechanics.

## Convergent and divergent patterns
Convergence: coexistence windows, explicit compatibility/readiness, staged actuation, population-qualified closure and preserved old-state semantics are common. Divergence: what is migratable, what can roll back, whether state is converted eagerly/lazily, and whether old revisions remain executable are owner/provider specific.

## Subcapabilities
Revision/generation registry; compatibility/readiness coordination; deprecation/sunset/withdrawal/drainage; migration planning; cutover/coexistence; mixed-version population tracking; rollback/restore/forward-fix disposition; provider transition; local/offline migration closure; transition evidence/provenance.

## SB comparison — evidence-bounded
No repository-wide claim is made in this revisit. Fresh `main` should later be archaeologically inspected for revision/generation, migration, rollback/restore, provider cutover, compatibility and evidence contracts during `PLANNING_B_SB_CURRENT_STATE_RECONCILIATION`. Research-branch artifacts are not product truth.

## Reconciliation hypotheses
- **KEEP** semantic owner responsibility for its own compatibility/invariants.
- **HARDEN** lifecycle transitions with expected-base, coverage and postcondition evidence.
- **GENERALIZE** revision-bound transition lineage and ambiguous-outcome disposition.
- **PROVIDERIZE** concrete migration/conversion/drain mechanisms.
- **INTEGRATE** Standards compatibility, Provider/Binding uptake, Data migration, Workflow in-flight state and Deployment routing through explicit evidence contracts.
- **DO_NOT_BUILD** a universal lossy state converter or universal rollback promise.

## Repository-validation questions
1. Which `main` contracts currently distinguish semantic revision from effective runtime/provider realization?
2. Is migration represented as intent/attempt/effective/validated lineage or as a single status?
3. Are compatibility/readiness proofs generation- and population-bound?
4. Are rollback, persisted-state restore and forward-fix distinct?
5. Can provider cutover prove consumer uptake and residual-source use?
6. Are expected-base/ownership preconditions available for lifecycle mutations?
7. Can Station/tenant/offline coverage be represented without false global completion?
8. Can in-flight workflow/process instances retain old realization semantics after definition migration?

## Symbiotic Proof obligations
1. Two revisions coexist while preferred and persisted/effective revisions differ without ambiguity.
2. Pairwise-compatible revisions fail transition closure when an older active consumer is outside the compatibility set.
3. Migration acknowledgement is lost; retry is blocked until effective-state reconciliation proves whether actuation occurred.
4. Definition migration succeeds but an in-flight job retains old semantics; aggregate state remains qualified rather than falsely homogeneous.
5. Deprecated revision reaches sunset but cannot be withdrawn until consumer-drainage evidence closes.
6. Rollback of routing is available while persisted-state rollback is not; system selects restore/forward-fix disposition explicitly.
7. Provider A→B cutover remains PARTIAL while any required consumer still uses A.
8. Offline Station is excluded only by explicit authority/policy; otherwise enterprise migration closure is INCONCLUSIVE/PARTIAL.
9. Stale expected-base blocks concurrent withdrawal/cutover.
10. AGWS/AI can propose or materialize only delegated transition work and cannot amplify domain, provider-admin, withdrawal or recovery authority.

## Stable findings
- **G2-FINDING-LVEM-30 — Lifecycle Truth Requires a Revision Vector, Not a Scalar Current Version.** Contract, provider, persisted state, runtime and consumer populations may advance independently; transition truth must preserve their qualified revisions.
- **G2-FINDING-LVEM-31 — Migration Acceptance and Effective Semantic Uptake Are Distinct.** A migration can be accepted/applied while existing in-flight work retains source-era realization semantics.
- **G2-FINDING-LVEM-32 — Deprecation, Sunset, Withdrawal Eligibility, Withdrawal and Consumer Drainage Are Separate Lifecycle Facts.** Time or announcement alone cannot prove safe removal.
- **G2-FINDING-LVEM-33 — Transition Readiness Is Population-, Policy- and Generation-Bound Evidence.** Any relevant target/baseline/population change invalidates prior readiness.
- **G2-FINDING-LVEM-34 — Rollback, Persisted-State Restore and Forward-Fix Are Different Recovery Transitions.** Routing reversal cannot imply data/state reversal.
- **G2-FINDING-LVEM-35 — Ambiguous Migration or Cutover Actuation Requires Effective-State Reconciliation Before Retry.** Lost acknowledgement must not create duplicate/destructive transition effects.
- **G2-FINDING-LVEM-36 — Provider Substitution Closure Is Consumer-Effective and Residual-Source Qualified.** Target availability or binding acceptance alone cannot retire the source.
- **G2-FINDING-LVEM-37 — Local/Offline and Station-Scoped Evolution Requires Explicit Coverage and Reconnection Requalification.** Global completion cannot be inferred while required scopes are unreachable or stale.

## Candidate discoveries
- `G2-CAPABILITY-CANDIDATE-LVEM-REVISION-VECTOR-TRANSITION-CLOSURE` — **CROSS_CUTTING / CONSOLIDATION_CANDIDATE**; reconcile unified revision-bound lineage with owner-specific revisions.
- `G2-CAPABILITY-CANDIDATE-LVEM-CONSUMER-DRAINAGE-WITHDRAWAL-EVIDENCE` — **CROSS_CUTTING / CONSOLIDATION_CANDIDATE**; merge with SIAC lifecycle evidence and Provider/Binding residual-use closure.
- `G2-CAPABILITY-CANDIDATE-LVEM-AMBIGUOUS-TRANSITION-ACTUATION-DISPOSITION` — **CROSS_CUTTING / CONSOLIDATION_CANDIDATE**; merge universal ambiguous-outcome primitive.
- `G2-CAPABILITY-CANDIDATE-LVEM-QUALIFIED-LOCAL-MIGRATION-RECOVERY-CLOSURE` — **CROSS_CUTTING / CONSOLIDATION_CANDIDATE**; merge qualified-local-closure family.

No candidate is promoted in this run.

## Value / risk / priority / next question
**Value:** prevents Generation 2 from equating version publication with safe enterprise evolution. **Risk:** a universal lifecycle engine could absorb domain/provider semantics and become a lock-in layer. **Priority:** high, because every capability eventually evolves. **Next question:** how Security / Resilience / Failure Recovery constrains recovery eligibility, failure containment and postcondition evidence without taking ownership of lifecycle migration semantics.
