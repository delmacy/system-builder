# Lifecycle / Versioning / Evolution / Migration — Revisit 06 (Cycle 7)

## Research question
What lifecycle architecture remains necessary once interoperability, provider binding, data/workflow evolution and deployment each expose their own revision-qualified proofs, and Lifecycle must coordinate transitions without becoming the semantic owner of those capabilities?

This revisit stress-tests applicability-scoped transition claims, typed transition identities, attempted→accepted→applied→converged→validated state, directional rollback eligibility, ambiguous actuation reconciliation, mixed-version coexistence, residual cohort drainage, evidence replay horizons, qualified offline closure, delegated Station authority and AGWS/AI non-amplification.

## Representatives and evidence/source ledger
1. **Kubernetes API deprecation policy** — https://kubernetes.io/docs/reference/using-api/deprecation-policy/ — API representations served in one release must round-trip without information loss; stability track constrains deprecation/removal. This shows that version availability, representational conversion and withdrawal eligibility are separate lifecycle concerns.
2. **Confluent Schema Registry compatibility/transitivity** — https://docs.confluent.io/platform/current/schema-registry/fundamentals/schema-evolution.html — backward/forward/full and transitive variants prove compatibility is directional and population-relative; non-transitive success does not cover older historical versions.
3. **Camunda 8 process-instance migration** — https://docs.camunda.io/docs/components/concepts/process-instance-migration/ — only eligible active instances can migrate; all active elements require valid mappings; unsupported runtime shapes reject migration. Technically accepted mapping and semantic process correctness therefore remain distinct claims.
4. **Amazon RDS Blue/Green Deployments** — https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/blue-green-deployments-switching.html and https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/blue-green-deployments-considerations.html — switchover has preconditions, transitional read-only/connection effects, feature incompatibilities, separate recovery histories and explicit cases where writes during a failed switchover require manual reconciliation. This is strong evidence for cutover fencing, current-state rollback eligibility and residual recovery disposition.
5. **Amazon RDS Proxy + Blue/Green** — https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/rds-proxy-blue-green.html — traffic can switch before management APIs fully reflect the new target and existing connections are dropped/re-established, demonstrating that control-plane acceptance, traffic-effective realization and client/session convergence are separate observations.
6. **Prior G2 Standards / Interoperability, Provider / Binding, Data, Workflow, Deployment and Security research** — authoritative cross-capability evidence for typed claims, revision-qualified conformance, ambiguous remote-mutation effect disposition, provider realization, population convergence, evidence horizons and non-amplifying authority.

## Source of truth and lifecycle ownership
Lifecycle owns **governed transition lineage and closure**, not the business/process/data/API/provider semantics being transitioned.

Owner-specific capabilities remain authoritative for whether their object is semantically valid. Lifecycle may consume those proofs but cannot redefine them. The canonical transition chain is:

`TransitionIntent@ExpectedBase → Eligibility/Compatibility Proof Set → Lease/Fence → Attempt → Acceptance → Applied Realization → Population Convergence → Validation → Residual Disposition → Closure`.

A lifecycle controller may say *which transition is in progress, what evidence is required and whether closure conditions are satisfied*. It may not say that a schema, workflow mapping, API contract or provider behavior is correct merely because the transition state reached `APPLIED`.

## Typed identity and applicability-scoped transition claims
At minimum, distinguish:

- `SemanticObjectIdentity`
- `SourceRevisionIdentity`
- `TargetRevisionIdentity`
- `TransitionPlanIdentity`
- `TransitionAttemptIdentity`
- `Population/CohortIdentity`
- `ProviderRealizationIdentity`
- `CompatibilityProfileIdentity`
- `EvidenceSetIdentity`
- `RollbackCandidateIdentity`
- `ResidualSourceIdentity`
- `TransitionClosureIdentity`

A transition claim is qualified by object/revision pair, transition-plan revision, affected population, provider/runtime realization, policy/trust/configuration vector, evidence timestamp/freshness and target Station/tenant scope. `migrated=true` without these qualifiers is architecturally insufficient.

## Lifecycle and versioning
### Version availability is not effective adoption
Kubernetes demonstrates that multiple API versions can coexist while conversion rules preserve object meaning. Serving a target version proves availability, not population adoption or safe withdrawal of the predecessor.

### Compatibility is directional and population-relative
Confluent makes direction explicit: backward, forward and full are different guarantees, and transitive modes expand the historical population included in the proof. Therefore rollback eligibility cannot be inferred from forward compatibility, and pairwise source→target compatibility cannot prove all active consumers are safe.

### Mixed-version coexistence is a first-class lifecycle state
Coexistence is expected during migrations. Lifecycle must represent source/target populations concurrently instead of forcing a scalar `currentVersion`. Dual-run, dual-read, dual-write, dual-protocol and shadow realizations have distinct effect and authority risks; owner-specific capabilities define safe mechanics, Lifecycle tracks their transition disposition.

## Migration state and closure semantics
The minimum lifecycle is:

`PLANNED → ADMITTED → ACTUATING → ACCEPTED → APPLIED → CONVERGING → VALIDATING → DRAINING → CLOSED`.

Failure/uncertainty states include `REJECTED`, `PARTIAL`, `OUTCOME_UNKNOWN`, `INCONCLUSIVE`, `QUARANTINED`, `FORWARD_FIX_REQUIRED` and `RESTORE_REQUIRED`.

`ACCEPTED` means the target system/provider accepted an operation. `APPLIED` means an effective target realization is observed. `CONVERGED` means the qualified population has reached the required state. `VALIDATED` means owner-specific conformance evidence is satisfactory. `CLOSED` additionally requires residual source/client/session/cache/subscription/workflow/data/provider use to be drained or explicitly dispositioned.

## Ambiguous actuation and reconcile-before-retry
A timeout, disconnect or lost acknowledgement during migration/cutover produces `OUTCOME_UNKNOWN`, not an automatic retry authorization.

The RDS blue/green guidance is adversarial evidence: the target may receive writes or traffic may move while the switchover later fails or administrative observations lag. Repeating a destructive cutover can therefore compound divergence. Lifecycle must first reconcile effective routing, source/target state, provider realization and affected consumer cohorts.

This incorporates SIAC's remote-mutation effect-disposition finding without stealing SIAC ownership: Standards owns operation-level effect semantics; Lifecycle owns whether a transition attempt can safely continue, retry, compensate, restore or escalate after those effects are reconciled.

## Directional rollback eligibility
Rollback is not `deploy(previousRevision)`.

Eligibility must be recomputed as a directional proof against **current effective state**:

`RollbackEligible(currentEffectiveState, targetPreviousRevision, affectedPopulation, ownerProofs, recoveryPoint)`.

RDS demonstrates why: blue and green maintain separate recovery histories, and writes on the green side during a failed switchover may not exist on blue. A previously healthy old environment is not automatically a valid rollback target after the new side has accepted state.

Routing rollback, binary/revision rollback, schema/data restore, workflow compensation and provider rebinding are distinct transitions. If any required state is no longer representable, the correct disposition may be forward-fix, restore from a qualified recovery point, quarantine or manual reconciliation.

## Consumer-effective convergence and cohort drainage
Target readiness is weaker than transition closure. RDS Proxy demonstrates that traffic routing can become effective before management APIs fully reflect final state, while established connections are terminated and must reconnect. Therefore lifecycle needs explicit observation of:

- target-effective population,
- clients still pinned to old protocol/version/provider,
- sessions/connections on the old realization,
- caches and local copies,
- subscriptions/consumers/checkpoints,
- in-flight workflows/jobs,
- residual replication or dual-write paths,
- retained source state for recovery.

Withdrawal closes only when every material residual cohort is drained or has an explicit retained/quarantined/recovery disposition.

## Evidence horizon and historical validity
Transition evidence has an independent replay/retention horizon. Historical `VALIDATED` can remain historically true even when the exact evidence required to re-evaluate it has expired. Current privileged decisions must not silently reuse stale historical evidence.

A proof record therefore needs `observed_at`, `valid_for`, `policy/profile_revision`, `population_coverage`, `evidence_location`, `retention/replay_horizon` and current verification disposition. Loss of replay capability may produce `HISTORICALLY_VALID_BUT_NOT_REPLAYABLE` or `INCONCLUSIVE_FOR_CURRENT_USE`, not retroactive falsehood.

## Mixed support vector
Lifecycle portability is not one version number. A provider/runtime transition support vector includes independently:

- representational compatibility,
- semantic compatibility,
- migration eligibility,
- mixed-version coexistence,
- online/offline migration,
- fencing/idempotency/reconciliation,
- rollout/cutover semantics,
- rollback/restore semantics,
- data/workflow/in-flight preservation,
- traffic/session drainage,
- evidence/exportability,
- retention/recovery history,
- delegated administration,
- air-gapped/offline operation.

Two providers may both claim `supports migration` while differing materially on these axes.

## Qualified local/offline closure and reconnect requalification
A disconnected Station can only close the scope it has authority and sufficient local evidence to close. Its closure is qualified by the last-known revision/policy/trust/provider vector and evidence horizon.

Reconnect does not automatically promote local closure to enterprise closure. If enterprise policy, target revision, provider binding, compatibility profile or cross-Station population advanced while disconnected, requalification is required before privileged transition or canonical mutation continues.

## Governance and `Enterprise → Station → Role → Person`
Authority attenuates downward.

Enterprise may delegate a Station-specific rollout window, validation or local cutover, but the Station cannot weaken enterprise compatibility, audit, rollback or canonical-domain constraints. Role and Person scopes can be narrower still. Transition authority is facet-specific: propose, approve, actuate, validate, withdraw, restore and accept residual risk are separate grants.

## Adaptive Governed Work Surfaces boundary
Adaptive Governed Work Surfaces remains a distinct capability. AGWS may expose migration status, gather review evidence, request bounded rollout or let an authorized user approve a transition action. It does not gain schema/process/API/provider/release authority simply because the page can invoke those capabilities.

AI remains the sole materializer of AGWS changes, but that rule does not grant migration authority. An AI request that implies canonical domain/process evolution, provider cutover, compatibility waiver or rollback must invoke the corresponding governed capability and escalate when required.

## Failure semantics
- `REJECTED`: eligibility or authority proof failed before effect.
- `OUTCOME_UNKNOWN`: actuation result cannot yet be determined.
- `PARTIAL`: only part of the qualified population or realization changed.
- `INCONCLUSIVE`: evidence is insufficient or stale.
- `DRAINING`: target is effective while residual cohorts remain.
- `FORWARD_FIX_REQUIRED`: prior revision cannot faithfully represent current effective state.
- `RESTORE_REQUIRED`: recovery-point semantics are required instead of version rollback.
- `QUARANTINED`: transition cannot safely advance or reverse without operator disposition.

## Extensibility, provider boundaries, observability, portability and lock-in
Lifecycle adapters may expose provider-specific migration IDs, stages and repair operations, but portable transition state preserves owner-neutral object/revision/attempt/population/evidence identities. Provider-specific opaque state must be surfaced as a support-vector limitation rather than normalized away.

Observability must expose target effective state, cohort convergence, residual use, rejected/skipped items, stale evidence, ambiguous attempts and rollback eligibility. Portability claims must include whether evidence, historical lineage and recovery/disposition data can be exported; otherwise migration of the migration-control plane itself creates lock-in.

## Product-specific mechanisms versus universal primitives
**Universal/cross-cutting primitives:** typed transition identities; applicability-scoped transition claim; transition state machine; expected-base/fencing; reconcile-before-retry; population convergence; residual cohort drainage; directional rollback eligibility; evidence replay horizon; mixed support vector; local/offline requalification; non-amplifying delegated authority.

**Product/provider-specific mechanisms:** Kubernetes storage/conversion/deprecation mechanics; Confluent schema compatibility implementation; Camunda process-element mappings and runtime migration restrictions; RDS blue/green replication/switchover/proxy behavior.

## Convergent and divergent patterns
**Convergent:** staged coexistence, directional compatibility, explicit eligibility, operator-governed actuation, post-actuation validation, residual state, and evidence-qualified closure.

**Divergent:** whether coexistence is read-only or writable; whether active runtime state is migratable; whether old/new representations round-trip; how rollback works after target-side writes; what clients/sessions survive cutover; how much history/evidence providers retain.

## Subcapabilities
Applicability-scoped transition registry; typed object/revision/attempt/population identities; compatibility/eligibility aggregation; migration fencing; ambiguous-actuation reconciliation; mixed-version coexistence; population convergence; residual cohort drainage; directional rollback eligibility; forward-fix/restore disposition; evidence replay/currentness; provider migration support vector; delegated/local/offline transition authority; transition provenance and audit.

## SB comparison — fresh-main bounded evidence
A bounded fresh-main code search for `migration lifecycle version rollback compatibility provider transition` returned no matching indexed result. This is **not** repository-wide evidence of absence and does not justify implementation claims. Product truth remains deferred to `PLANNING_B_SB_CURRENT_STATE_RECONCILIATION`, where fresh `main` archaeology is mandatory.

## Reconciliation hypotheses
- **KEEP** semantic-owner authority for domain/process/data/API/provider correctness.
- **HARDEN** lifecycle with applicability-scoped typed transition claims, explicit attempt/effective/convergence/validation separation and residual-cohort closure.
- **GENERALIZE** directional rollback eligibility, evidence replay horizons, mixed support vectors and qualified local closure.
- **PROVIDERIZE** concrete migration, conversion, replication, switchover, rollback and repair mechanics.
- **INTEGRATE** SIAC effect disposition, Provider binding, Data migration, Workflow in-flight state, Deployment traffic, Security recovery and Observability evidence through typed proof contracts.
- **DEFER** repository implementation assertions until fresh-main archaeology.
- **DO_NOT_BUILD** scalar `currentVersion` as universal truth, automatic rollback inferred from past health, blind retry of ambiguous transition actuation, or AI/Station authority amplification.

## Repository-validation questions
1. Does fresh `main` distinguish semantic object revision, transition plan, migration attempt, provider realization and consumer population identities?
2. Can a transition represent `accepted`, `applied`, `converged`, `validated`, `draining` and `closed` separately?
3. Is mutation protected by expected-base/fencing and reconcile-before-retry after ambiguous outcomes?
4. Is compatibility directional and qualified by active historical population/cohort?
5. Is rollback eligibility recalculated against current effective state and recovery evidence?
6. Are routing rollback, semantic revision rollback, data restore, workflow compensation and provider rebinding distinct?
7. Can target-effective proof coexist with residual old sessions, caches, subscriptions, clients and provider state?
8. Are evidence freshness and replay/retention horizons first-class?
9. Can offline Station closure be bounded and requalified on reconnect?
10. Can `Enterprise → Station → Role → Person` delegate rollout without weakening higher invariants?
11. Can AGWS/AI stage/propose transitions without acquiring canonical migration or provider-admin authority?
12. Can transition history/evidence itself be exported during provider replacement?

## Symbiotic Proof / architecture proof-backfill obligations
1. Pairwise N→N+1 compatibility passes while an active N-2 consumer is incompatible; closure is blocked.
2. An actuation acknowledgement is lost after target effect; reconciliation observes the effect and prevents duplicate migration/cutover.
3. A stale migration worker attempts against a changed expected base; fencing rejects it.
4. Target provider/runtime is healthy while residual clients/sessions/subscriptions remain on source; state remains `DRAINING`.
5. Old revision was historically healthy, but target-side writes cannot be represented by it; rollback eligibility is denied.
6. RDS-like traffic moves before control-plane observation fully converges; lifecycle reports separate traffic-effective and control-plane states.
7. Camunda-like instance has unsupported active structure; migration eligibility fails without redefining workflow semantics.
8. Confluent-like non-transitive compatibility passes against N-1 but fails for historical N-2 population; withdrawal is blocked.
9. Historical validation evidence expires; history remains recorded but current privileged reuse becomes `INCONCLUSIVE_FOR_CURRENT_USE`.
10. Offline Station completes a delegated local transition; reconnect against advanced enterprise policy/provider revision forces requalification.
11. Enterprise invariant cannot be weakened by Station/Role/Person rollout delegation.
12. AGWS/AI request for canonical migration/provider cutover escalates instead of self-authorizing.
13. Provider migration cannot close until transition lineage/evidence is exportable or explicitly accepted as a lock-in limitation.
14. Failed cutover with ambiguous target-side writes selects reconcile/forward-fix/restore rather than blind routing rollback.

## Stable findings
- **G2-FINDING-LVEM-46 — Transition Qualification Is Applicability-Scoped Rather Than a Scalar Version State.** A lifecycle claim is only meaningful when qualified by semantic object, source/target revisions, transition-plan revision, population, provider/runtime realization, policy/trust/configuration vector, target scope and evidence horizon.
- **G2-FINDING-LVEM-47 — Transition Identities Must Separate Object Revision, Plan, Attempt, Realization, Population and Closure.** Collapsing these identities makes historical compatibility, provider replacement and ambiguous actuation impossible to reconcile deterministically.
- **G2-FINDING-LVEM-48 — Lifecycle Completion Requires Attempted→Accepted→Applied→Converged→Validated→Drained Closure.** Provider acceptance or target application cannot stand in for population convergence, semantic validation or residual-source disposition.
- **G2-FINDING-LVEM-49 — Ambiguous Migration/Cutover Actuation Requires Effect Reconciliation Before Retry.** Transport timeout or lost acknowledgement is insufficient to authorize replay; effective routing/state must be reconciled first to avoid duplicate or conflicting migration effects.
- **G2-FINDING-LVEM-50 — Rollback Eligibility Is Directional and Depends on Current Effective State, Not Historical Health.** Target-side writes, state or external effects can make a previously healthy older revision no longer representable; rollback, restore and forward-fix are separate dispositions.
- **G2-FINDING-LVEM-51 — Mixed-Version Coexistence and Residual Cohort Drainage Are First-Class Transition State.** Withdrawal cannot close until target-effective proof plus disposition of old clients, sessions, caches, subscriptions, workflows, replication paths and provider state is recorded.
- **G2-FINDING-LVEM-52 — Transition Evidence Has a Replay/Retention Horizon Independent of Historical Validity.** Evidence expiry may make current requalification inconclusive without retroactively falsifying a historically valid transition decision.
- **G2-FINDING-LVEM-53 — Lifecycle Portability Is a Mixed Support Vector and Delegated Transition Authority Must Remain Non-Amplifying.** Compatibility, coexistence, migration, rollback, evidence, offline behavior and administration vary independently across providers; `Enterprise → Station → Role → Person` and AGWS/AI cannot create canonical migration/provider authority.

## Candidate discoveries
- `G2-CAPABILITY-CANDIDATE-LVEM-APPLICABILITY-SCOPED-TRANSITION-QUALIFICATION` — **CROSS_CUTTING / CONSOLIDATION_CANDIDATE**; reconcile with UCA applicability claims while Lifecycle retains transition-specific qualification.
- `G2-CAPABILITY-CANDIDATE-LVEM-AMBIGUOUS-TRANSITION-EFFECT-RECONCILIATION` — **CORE_SUBCAPABILITY / PENDING_SYNTHESIS**; Lifecycle owns transition-attempt reconciliation while SIAC retains operation-level remote-effect semantics.
- `G2-CAPABILITY-CANDIDATE-LVEM-MIXED-TRANSITION-SUPPORT-VECTOR` — **CROSS_CUTTING / CONSOLIDATION_CANDIDATE**; retain independent compatibility/coexistence/migration/rollback/evidence/offline/admin axes.
- `G2-CAPABILITY-CANDIDATE-LVEM-RESIDUAL-CONSUMER-SESSION-CACHE-SUBSCRIPTION-DRAINAGE` — **CORE_SUBCAPABILITY / PENDING_SYNTHESIS**; Lifecycle owns transition closure over residual cohorts while semantic owners prove correctness.

No candidate is promoted. Adaptive Governed Work Surfaces remains promoted and distinct.

## Value / risk / priority / next question
**Value:** prevents false `migration complete`, unsafe rollback and silent mixed-version residue in long-lived enterprise systems. **Risk:** Lifecycle can become a mega-owner if it absorbs owner-specific compatibility, migration or recovery semantics. **Priority:** high. **Next question:** Security / Resilience / Failure Recovery should test recovery eligibility, containment, break-glass, backup/restore and ambiguous recovery actuation using these lifecycle proofs without redefining lifecycle ownership.
