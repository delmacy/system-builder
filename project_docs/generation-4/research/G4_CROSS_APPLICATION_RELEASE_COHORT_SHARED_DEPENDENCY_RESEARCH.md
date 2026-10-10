# G4 — Cross-Application Release Cohorts & Shared-Dependency Qualification Research

Status: `RESEARCH_ACTIVE / NON_EXECUTABLE`
Execution authority: NONE
Date: 2026-09-23
Scope: G4 Web Desktop & Application Environment / Control Center / Application Manager / Observatory

## Purpose

Continue `G4_REMEDIATION_RELEASE_QUARANTINE_EVIDENCE_RESEARCH.md` by studying cross-application release when quarantined targets share database, gateway, Vault/credential source, network path, placement group, provider or other dependencies. The problem is to decide when targets can be released independently, when a shared dependency must first be qualified, and when a real cohort/barrier exists, without turning a topology/dependency graph into orchestration authority.

This is implementation-independent P&D only. It does not authorize product code, WBS, Work Packages, Sprints, TASKs, migrations, provider adoption or architecture replacement.

## Repository boundaries preserved

- `Builder != Runtime`; published runtimes remain autonomous.
- `Client != Workspace != Desktop Sphere != Application != Window`.
- `Window/session lifecycle != service lifecycle`.
- `Desired != Observed != Effective`; `Configured != Applied != Effective`.
- `Provider ACK != effective state`; `UNKNOWN` is representable evidence, not permission to guess.
- `Policy != configuration`; `SecretRef != secret value`.
- `Shared dependency != shared authority`.
- `Dependency graph != orchestration ownership`.
- `Health check green != operation admissible`.
- `Remediation != rollback`; `Remediation required != remediation authorized`.
- `Release authorized != release effective != historical effects settled`.
- `Automatic != hidden`; `Adapter normalization != fabricated equivalence`.

## Adjacent-round reconciliation

### :00 — Componentes catalog/playground conformance

The permanent `Componentes` catalog is a conformance/proof surface rather than semantic authority. Static rendering is insufficient: transitions, failure/recovery, composition and cross-surface continuity need typed proof. Conformance is a vector, and `PARTIAL`, `NOT_EVALUATED`, `STALE_EVIDENCE` and `PASS` remain distinct.

Portable consequence here: cohort release UI must expose transition and composition evidence, not merely render a green aggregate. A target-level PASS cannot be promoted into a cohort-level PASS without composition evidence.

### :10 — editor canonicalization and long-term proof preservation

Proof provenance binds semantic snapshot, schema/canonicalization profile and representation lineage. Timestamp renewal, binding renewal and semantic requalification are distinct; a migrated representation does not silently rewrite historical proof.

Portable consequence here: release evidence reused across a cohort must retain the exact semantic/evidence revision it qualified. Re-canonicalizing or renewing an evidence envelope cannot silently make the underlying dependency claim current.

## External evidence classes reviewed

### E1 — Kubernetes PodDisruptionBudget

Kubernetes PodDisruptionBudget constrains voluntary disruptions for a selected collection using `minAvailable` or `maxUnavailable`. Official documentation explicitly notes that the budget does not guarantee the number of Pods will always remain available because involuntary failures can still occur. It also distinguishes unhealthy-pod eviction policies.

Portable lessons:

- a cohort budget can constrain coordinated actions without becoming a global availability proof;
- `budget satisfied != dependency healthy forever`;
- `budget protects voluntary action != budget protects every failure mode`;
- collection-level safety criteria may legitimately block one member even when that member is locally eligible.

Source: https://kubernetes.io/docs/tasks/run-application/configure-pdb/

### E2 — Kubernetes StatefulSet ordering

StatefulSet supports `OrderedReady` and `Parallel` pod-management policies. Ordered progression can wait for predecessor readiness; Parallel deliberately relaxes that ordering while preserving identity guarantees. The same platform therefore does not treat ordering as universal.

Portable lessons:

- `shared controller != one mandatory release order`;
- ordering is a declared invariant/operation property;
- parallelism is safe only when the protected invariant does not require predecessor qualification.

Source: https://kubernetes.io/docs/concepts/workloads/controllers/statefulset/

### E3 — AWS Elastic Load Balancing connection draining

AWS target deregistration distinguishes stopping new connections from completion/termination of existing connections. During `draining`, existing traffic can remain active; propagation delay may also permit connections briefly after deregistration begins.

Portable lessons:

- `new admission closed != in-flight traffic settled`;
- dependency cutover/release needs separate admission and drain frontiers;
- a cohort cannot infer settlement from routing-state ACK alone.

Sources:
- https://docs.aws.amazon.com/elasticloadbalancing/latest/network/edit-target-group-attributes.html
- https://docs.aws.amazon.com/elasticloadbalancing/latest/network/check-target-health.html

### E4 — HashiCorp Vault leases/revocation

Vault dynamic secrets carry leases with independent renewal/revocation. Revocation can operate on one lease or a prefix/tree. Vault documentation warns that force-removing lease state when backend revocation failed can leave Vault out of sync with the secret engine.

Portable lessons:

- shared secret source does not imply one credential identity or one consumer-adoption frontier;
- grouped revocation is an operational capability, not proof that every consumer stopped using every credential;
- control-plane removal of lease state can diverge from effect-side revocation.

Sources:
- https://developer.hashicorp.com/vault/docs/concepts/lease
- https://developer.hashicorp.com/vault/docs/commands/lease/revoke

No provider or implementation is selected by these comparisons.

## Finding 1 — shared dependency does not create a cohort automatically

Two Applications can use the same database, gateway, Vault mount or provider while remaining independently releasable for a particular surface/invariant.

Candidate relation:

```text
DependencyParticipation
  targetRef
  dependencyRef
  claimRef
  protectedInvariantRef
  admissionSurface
  dependencyRevisionRef
  evidenceRequirementRef
  authorityRef
  couplingDisposition
```

Core invariants:

```text
SHARED_DEPENDENCY != SHARED_RELEASE_BARRIER
SHARED_PROVIDER != SHARED_FAILURE_DOMAIN FOR EVERY CLAIM
SHARED_PLACEMENT != SHARED_AUTHORITY
SHARED_SECRET_SOURCE != SHARED_CREDENTIAL IDENTITY
SAME_ENDPOINT != SAME SEMANTIC DEPENDENCY
```

A cohort exists only when a named invariant requires members to be qualified together or when one member's release materially changes another member's evidence/admissibility.

## Finding 2 — cohort identity is invariant- and surface-scoped

Candidate:

```text
ReleaseCohort
  cohortId
  clientRef
  environmentRef
  protectedInvariantRef
  admissionSurface
  memberRefs[]
  dependencyClaimRefs[]
  barrierLawRef
  capacityBudgetRef?
  releaseOrderRef?
  evidenceBasisRefs[]
  currentnessBasis
```

The same Applications may form a cohort for write traffic but not for read traffic, or for credential cutover but not for UI availability.

```text
COHORT_FOR(X) != COHORT_FOR(Y)
COHORT MEMBERSHIP != OWNERSHIP TRANSFER
COHORT IDENTITY != DEPLOYMENT UNIT
COHORT IDENTITY != PLACEMENT GROUP
```

## Finding 3 — dependency qualification precedes dependent release only when material

For target T and protected invariant X, a dependency D is a release prerequisite only if the release proof for T/X materially depends on a current claim about D.

Candidate dependency-claim classes:

```text
HARD_PREREQUISITE
CAPACITY_BUDGET
SETTLEMENT_PREREQUISITE
AUTHORITY_PREREQUISITE
CURRENTNESS_PREREQUISITE
ALTERNATIVE_SET_MEMBER
OPTIONAL_ENRICHMENT
NON_MATERIAL_FOR_THIS_RELEASE
UNKNOWN_MATERIALITY
```

Thus:

```text
DEPENDENCY PRESENT != DEPENDENCY MUST BLOCK
DEPENDENCY HEALTHY != DEPENDENT RELEASE QUALIFIED
DEPENDENCY UNKNOWN + MATERIAL != SAFE TO RELEASE
DEPENDENCY UNKNOWN + PROVEN NON_MATERIAL != GLOBAL BLOCKER
```

This reuses the G4 minimal-semantic-cut-set principle rather than topology centrality.

## Finding 4 — release barriers are predicates, not global locks

A real barrier names the predicate that must hold before one or more release transitions.

Examples:

```text
AtLeast(N members qualified for read traffic)
AtMost(K members concurrently reopening write admission)
GatewayRevision(R) qualified before dependent traffic release
NewCredentialAdopted(member) before old credential fencing
All writers drained before schema-contract cutover
Quorum/capacity floor preserved during staged release
```

A barrier is not permission to mutate members and not a lock on unrelated operations.

```text
BARRIER SATISFIED != RELEASE AUTHORIZED FOR EVERY MEMBER
BARRIER OPEN != MEMBER CURRENT
BARRIER CLOSED != SERVICE STOPPED
BARRIER != DISTRIBUTED TRANSACTION
```

## Finding 5 — member-local and cohort-level evidence are separate

Candidate evidence layers:

```text
MemberReleaseEvidence
DependencyQualificationEvidence
CohortCompositionEvidence
ReleaseDecisionEvidence
PostReleaseObservationEvidence
```

Member evidence proves target-local claims. Dependency evidence proves claims about shared prerequisites. Cohort composition evidence proves that the barrier/budget/order law is satisfied for the exact membership/currentness basis.

```text
ALL MEMBERS LOCALLY GREEN != COHORT COMPOSITION PROVEN
COHORT BUDGET GREEN != EVERY MEMBER SAFE
ONE MEMBER FAIL != EVERY MEMBER MUST REMAIN QUARANTINED
```

Aggregation must preserve minority blockers and `UNKNOWN`.

## Finding 6 — cohort membership is revisioned and currentness-sensitive

Membership may change because of placement migration, application adoption/unregistration, provider rebinding, secret rebinding, network topology, management-authority transition or policy/config revision.

A release plan therefore pins the membership/dependency basis it actually evaluated.

```text
SAME MEMBER NAMES != SAME COHORT
MEMBER ADDED != OLD COHORT PROOF STILL COMPLETE
MEMBER REMOVED != ITS IN-FLIGHT EFFECTS SETTLED
TOPOLOGY CHANGED != AUTHORITY CHANGED
```

If material membership changes after qualification, the affected barrier must be requalified rather than silently extending an old PASS.

## Finding 7 — staged release needs admission budgets, not thundering-herd reopen

A large quarantine may recover at once from the perspective of health checks. Reopening every target simultaneously can overload a shared database, gateway, queue, secret engine or provider and create a second failure.

Candidate budget dimensions:

```text
maxConcurrentReleaseAdmissions
maxNewTrafficRate
maxConcurrentRestarts
maxConcurrentCredentialRefresh
maxConcurrentReconciliation
capacityFloor
observationWindowBetweenWaves
errorBudget/failureThreshold
```

These are operational containment constraints, not business authority.

```text
CAPACITY AVAILABLE != AUTHORITY AVAILABLE
BUDGET TOKEN != BUSINESS RIGHT
WAVE COMPLETE != EFFECTS SETTLED
NO ERROR IN WINDOW != FUTURE SAFETY PROOF
```

Kubernetes disruption budgets provide useful pattern evidence that collection-level voluntary-action budgets are narrower than universal availability guarantees.

## Finding 8 — admission frontier and drain frontier remain distinct per member and dependency

AWS connection draining illustrates the general distinction:

```text
newAdmissionsClosedAt
existingWorkDrainState
providerRoutingState
externalEffectSettlementState
```

Release can similarly require staged reopening while predecessor traffic/effects are still draining elsewhere.

```text
DEREGISTERED/NO NEW TRAFFIC != OLD CONNECTIONS SETTLED
NEW TARGET READY != OLD TARGET DRAINED
ENDPOINT SWITCHED != OLD EFFECT AUTHORITY FENCED
```

For non-fenceable effects, `UNKNOWN` survives topology change.

## Finding 9 — shared Vault binding decomposes into source, lease, consumer and effect frontiers

A shared Vault mount/path can issue distinct dynamic credentials/leases to multiple consumers. A prefix revocation can act on many leases, but grouped control-plane action does not erase per-consumer adoption/fencing evidence.

Candidate fronts:

```text
sourceQualified
credentialIssued(member)
bindingResolved(member)
delivered(member)
consumerAdopted(member)
oldLeaseRevoked(member)
oldCredentialEffectFenced(member)
```

```text
SHARED VAULT PATH != SHARED SECRET VALUE
PREFIX REVOCATION ACK != EVERY TARGET-SIDE EFFECT FENCED
LEASE EXPIRED != CONSUMER STATE OBSERVED
```

`SecretRef != secret value` remains absolute; cohort evidence references secret/lease identities and dispositions, never secret material.

## Finding 10 — independent release is the default when independence is proven

A central barrier for every shared dependency would reduce autonomous runtimes to a hidden central orchestrator. Therefore the research default is not “release everything together”; it is:

```text
release independently when non-interference/material independence is proven;
form the minimal cohort when a named invariant couples members;
retain UNKNOWN when coupling/materiality cannot be qualified.
```

This preserves runtime autonomy and prevents topology from becoming semantic authority.

## Finding 11 — external/co-managed members do not transfer authority into the cohort

A cohort can include `SB_MANAGED`, `CO_MANAGED`, `EXTERNALLY_MANAGED` and `OBSERVE_ONLY` targets for evidence/composition purposes. The cohort coordinator cannot manufacture mutation authority.

Possible dispositions include:

```text
QUALIFIED_AND_SB_RELEASABLE
QUALIFIED_AWAITING_EXTERNAL_RELEASE
OBSERVE_ONLY_QUALIFIED
AUTHORITY_MISSING
EVIDENCE_MISSING
UNKNOWN
```

```text
COHORT MEMBERSHIP != MUTATION AUTHORITY
EXTERNAL MEMBER BLOCKING BARRIER != SB MAY MUTATE EXTERNAL MEMBER
CONTROL CENTER CAN PROJECT != CONTROL CENTER OWNS
```

## Finding 12 — topology/dependency graph remains descriptive/proof-supporting

The graph can answer candidate questions such as “which releases depend on gateway G?” or “which targets share a credential source?”, but it does not own workflows.

```text
GRAPH EDGE != COMMAND ROUTE
GRAPH CENTRALITY != RELEASE PRIORITY
GRAPH TRAVERSAL != AUTHORITY
TOPOLOGY MAP != CANONICAL TRUTH
```

A release decision consumes qualified graph/dependency evidence and remains target/cohort/invariant scoped.

## Cross-application conformance candidate

For each release surface `S` and protected invariant `X`:

1. qualify Client/Environment/target identity and current management authority;
2. derive the material dependency claims for `S/X`;
3. prove independence or construct the minimal coupled cohort;
4. pin cohort membership/dependency revisions;
5. qualify member-local evidence;
6. qualify shared-dependency evidence;
7. evaluate barrier/budget/order predicates;
8. admit only the member transitions currently authorized;
9. stage waves under operational budgets where needed;
10. preserve independent effect identities and drain/settlement frontiers;
11. observe post-release effects and invalidate/recontain only the material scope when evidence degrades.

No step creates a global transaction or global health oracle.

## New proof obligations

PO-179. Every cohort states Client, Environment, protected invariant, admission surface and revisioned membership.

PO-180. Shared dependency alone cannot create a release barrier; material coupling must be named and evidenced.

PO-181. Independent release requires positive non-interference/material-independence proof for the protected invariant, not absence of a discovered edge.

PO-182. A material shared dependency with missing/stale evidence remains `UNKNOWN`/blocking for the dependent claim rather than optimistic PASS.

PO-183. Barrier satisfaction cannot manufacture member-local release authority/currentness.

PO-184. Member-local PASS cannot manufacture cohort-composition PASS.

PO-185. Cohort-level PASS cannot overwrite a member-local blocker or `UNKNOWN`.

PO-186. Material cohort membership/dependency changes invalidate or narrow affected composition evidence.

PO-187. Member removal cannot imply its in-flight/external effects are settled.

PO-188. Admission budgets constrain operational concurrency/rate only; they do not create business rights or policy exceptions.

PO-189. Staged release preserves each member's operation/effect identity and authority revision across waves/retries.

PO-190. New-admission reopening remains distinct from predecessor drain and external-effect settlement.

PO-191. Gateway/provider routing ACK cannot prove old connections/effects settled.

PO-192. Shared secret source/path cannot imply shared secret value, credential identity or consumer-adoption state.

PO-193. Group/prefix revocation ACK cannot prove every effect-side credential is fenced unless the target contract proves that implication.

PO-194. `SecretRef`/lease/evidence projections never disclose secret material.

PO-195. External/observe-only/co-managed cohort members retain their own management authority boundaries.

PO-196. A blocking external member cannot authorize the SB to mutate that member.

PO-197. Dependency/topology graph traversal cannot itself admit, order or execute release mutations.

PO-198. Automatic cohort derivation exposes why each member/edge is material, its evidence/currentness basis and the barrier law.

PO-199. Aggregate cohort UI preserves minority blockers, `UNKNOWN`, stale evidence and coverage/cardinality rather than majority-green collapse.

PO-200. Window close, application eviction, desktop switch or restored UI state cannot alter cohort membership, service lifecycle or release authority by implication.

PO-201. Placement migration may change dependency membership/evidence but cannot change semantic service identity.

PO-202. Adapter normalization must preserve provider-specific differences in readiness, drain, revocation, fencing, ordering and budget semantics; unsupported equivalence degrades to partial/unknown.

PO-203. Provider artifacts/manifests remain compiled/exported projections and cannot become canonical cohort truth.

PO-204. Post-release evidence degradation invalidates only the materially dependent release claims/surfaces unless a broader coupling is proven.

## Required adversarials

1. Two tenants share provider infrastructure; a cohort derivation accidentally crosses Client boundaries.
2. Restored Workspace displays an old cohort PASS after membership changed.
3. 999/1000 members are green while one critical shared gateway claim is `UNKNOWN`.
4. All members are individually healthy but simultaneous release overloads the database.
5. Database is healthy but one Application has stale policy authority.
6. Gateway is healthy for reads but write-path fencing is unverified.
7. Target deregistration ACK is treated as proof that existing connections/effects settled.
8. New endpoint is healthy and old endpoint still accepts conflicting writes.
9. Vault prefix revocation succeeds while one downstream credential remains usable because target-side revocation failed.
10. Force-removing lease state is treated as proof of effect-side revocation.
11. Shared Vault path causes UI to imply a shared secret value.
12. One external-managed member blocks a barrier and the SB silently restarts/upgrades it.
13. `OBSERVE_ONLY` member receives mutation credentials because it participates in a cohort.
14. Placement migration changes cohort membership and UI silently reidentifies the service.
15. Provider manifest becomes the canonical release-cohort definition.
16. Dependency graph centrality is used as release priority without a protected invariant.
17. Topology edge absent from a stale index is interpreted as proven independence.
18. Application-specific advanced setting conflicts with a global Control Center release assumption.
19. Automatic binding adds a new dependency but the cohort plan does not show it.
20. UI close/desktop eviction is interpreted as service quarantine or release.
21. Adapter maps provider `healthy` to SB `settled` despite in-flight traffic.
22. Cohort budget PASS is interpreted as all members policy-compliant.
23. A removed cohort member has an `UNKNOWN` external effect that disappears from aggregate status.
24. A late member addition inherits predecessor cohort evidence without requalification.
25. Wave retry receives a new operation identity and duplicates an old ambiguous effect.
26. Shared infrastructure is mistaken for shared data or shared authority.

## Reconciliation with mandatory G4 invariants

Preserved without weakening:

- `Install != Adopt`; `Register != Deploy`; `Connect != Own`; `Discovered != Verified`.
- `SecretRef != secret value`; `Policy != configuration`.
- `Desired != Observed != Effective`; `Configured != Applied != Effective`.
- `Unified UI != one semantic owner/store`.
- `Deployment Unit != physical server`; `Service identity != raw IP`.
- `Window/session lifecycle != service lifecycle`.
- `Automatic != hidden`; `Adapter normalization != fabricated equivalence`.

Additional invariants from this round:

- `Shared dependency != shared release barrier`.
- `Cohort membership != ownership/authority transfer`.
- `Cohort for X != cohort for Y`.
- `All members locally green != cohort composition proven`.
- `Cohort budget green != every member safe`.
- `Barrier satisfied != release authorized for every member`.
- `Admission reopened != predecessor work drained/settled`.
- `Shared Vault path != shared secret value/credential identity`.
- `Prefix revocation ACK != every target-side effect fenced`.
- `Dependency graph != orchestration ownership`.

## Maturity / saturation

- Shared-dependency versus cohort distinction: `ADVANCED_EMERGING / MATERIAL`.
- Invariant/surface-scoped cohort identity: `ADVANCED_EMERGING / MATERIAL`.
- Member/dependency/cohort evidence separation: `ADVANCED_EMERGING / MATERIAL`.
- Admission-budget/staged-release semantics: `MATERIAL / NOT_SATURATED`.
- Drain/settlement interaction: `MATERIAL / NOT_SATURATED`.
- Shared-secret/lease cohort semantics: `MATERIAL / NOT_SATURATED`.
- External/co-managed cohort participation: `MATERIAL / NOT_SATURATED`.
- Provider-native barrier/budget mapping: `EARLY_MATERIAL`.

Overall: `ADVANCED_EMERGING / MATERIAL_DELTA / NON_EXECUTABLE`.

## Next highest-value gap

**Dynamic cohort invalidation and recontainment during staged release.**

Research should study the case where wave 1 is already released while wave 2 is pending and a shared dependency degrades, membership changes, a policy/authority revision advances, or contradictory evidence arrives. The key questions are how to stop only future admissions, when already released members must be recontained, how to preserve operation/effect identity and drain frontiers, how to avoid oscillation/thundering-herd containment, and how to prove that an updated minimal cohort/barrier remains sufficient without introducing a central runtime dependency or global transaction.
