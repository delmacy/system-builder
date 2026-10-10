# G4 — Dynamic Release Cohort Invalidation & Recontainment Research

Status: `RESEARCH_ACTIVE / NON_EXECUTABLE`
Execution authority: NONE
Date: 2026-09-23

## Purpose

Continue the G4 Web Desktop & Application Environment consolidation by studying what happens after a staged cross-application release has started and the proof basis changes mid-flight: a shared dependency degrades, cohort membership changes, policy/authority/trust revisions advance, a secret binding changes, placement migrates, or contradictory evidence arrives.

This is P&D documentation only. It does not authorize implementation, WBS, Work Packages, Sprints, TASKs, migrations, provider adoption or product changes.

The candidate interaction hierarchy remains:

`Builder Home/Factory -> Client -> Workspace -> Desktop Sphere -> Application -> Window -> View/Tab/Tool`.

3D remains an optional projection/application, never a required navigation or authority substrate.

## Repository constraints preserved

- `Builder != Runtime`; published runtimes remain autonomous.
- `Research candidate != implementation authority`.
- `Shared dependency != shared data/authority`.
- `Dependency graph != orchestration ownership`.
- `Desired != Observed != Effective`.
- `Configured != Applied != Effective`.
- `Provider ACK != effective state`.
- `Window/session lifecycle != service lifecycle`.
- `SecretRef != secret value`.
- `Automatic != hidden`.
- `Adapter normalization != fabricated equivalence`.
- `UNKNOWN` remains an evidence disposition, never permission to guess.

## External pattern evidence reviewed

1. Kubernetes Pod readiness is condition-based: custom readiness gates participate in the Ready decision, missing gates are not treated as success, and conditions carry observation/currentness metadata. This is evidence for fail-closed release gates and revision-qualified evidence, not Kubernetes adoption.
2. Kubernetes readiness failure removes a Pod from ordinary Service traffic while the process can continue running. This is evidence that traffic containment and runtime/service lifecycle are distinct.
3. AWS Elastic Load Balancing target deregistration stops new connections but existing connections can continue during draining, and propagation delay can exist. This is evidence that closing an admission frontier does not prove in-flight settlement.
4. Vault lease revocation can be exact or prefix-scoped; force-removing leases can leave Vault out of sync with the backing secret engine. This is evidence that broad credential containment has a blast radius and that control-plane cleanup is not equivalent to target-side fencing.

These are benchmark patterns only. No provider is selected.

## F1 — Cohort qualification is revision-bound, not a durable badge

A release cohort is derived for a named Client, Environment, invariant and release surface from dependency/materiality evidence. Its previous PASS cannot remain authoritative after a material input changes.

Candidate envelope:

```text
ReleaseCohortQualification
  cohortId
  cohortRevision
  clientRef
  environmentRef
  invariantRef
  surfaceRef
  memberRevisionSet
  dependencyRevisionSet
  policyRevisionSet
  authorityRevisionSet
  bindingRevisionSet
  placementRevisionSet
  evidenceRefs[]
  qualifiedAt
  disposition
```

Invariants:

- `PREVIOUS_COHORT_PASS != CURRENT_COHORT_PASS`.
- `SAME_MEMBER_NAMES != SAME_COHORT_REVISION`.
- `DEPENDENCY_CHANGED != EVERY_MEMBER_FAILED`.
- `DEPENDENCY_CHANGED -> MATERIALITY/REQUALIFICATION_DECISION_REQUIRED`.
- `COHORT_INVALIDATED != MEMBER_EFFECT_REVERSED`.

This aligns release orchestration with the broader G4 evidence-currentness rule: evidence is a relation over revisions, claims and profiles rather than a permanent badge.

## F2 — Dynamic invalidation has typed roots

Candidate invalidation roots:

```text
DEPENDENCY_HEALTH_OR_CAPACITY_CHANGE
DEPENDENCY_SEMANTIC/CONTRACT_CHANGE
MEMBERSHIP_CHANGE
POLICY_OR_EXCEPTION_CHANGE
MANAGEMENT_AUTHORITY_CHANGE
SECRET_BINDING_OR_CREDENTIAL_CHANGE
PLACEMENT/ENDPOINT_CHANGE
TRUST/VERIFIER_CHANGE
CONFIG_RESOLUTION_CHANGE
CONTRADICTORY_OR_LATE_EVIDENCE
AFFECTED_SET_COMPLETENESS_CHANGE
ADAPTER_QUALIFICATION_CHANGE
```

A root carries the affected claim classes and currentness basis. A provider-health flap must not automatically invalidate unrelated policy or semantic evidence; a policy revision must not automatically imply infrastructure failure.

`ONE_INVALIDATED_DIMENSION != WHOLE_SYSTEM_FAILED`.

When materiality cannot be proven narrow, conservative expansion is required rather than false currentness.

## F3 — Invalidation closes the minimum admission frontier first

When a release basis becomes stale or contradicted, the first safe response is normally to close the smallest frontier capable of preventing new violating effects while preserving unrelated autonomous operation.

Candidate frontiers:

```text
NEW_TRAFFIC
NEW_WRITES
NEW_BACKGROUND_JOBS
NEW_RECONCILIATION_MUTATIONS
NEW_DEPLOY/UPGRADE_EFFECTS
NEW_SECRET/CREDENTIAL USE
NEW_PLACEMENT_PROMOTION
NEW_EXTERNAL_CALLBACKS
```

Invariants:

- `CLOSE_NEW_ADMISSIONS != STOP_SERVICE`.
- `CLOSE_NEW_TRAFFIC != DRAIN_EXISTING_TRAFFIC`.
- `NO_NEW_WRITES != OLD_WRITES_SETTLED`.
- `RELEASE_GATE_CLOSED != PREVIOUS_RELEASE_REVERSED`.

AWS ELB draining is a useful analogue: deregistration stops new connections while existing connections may continue and propagation itself takes time. G4 must preserve the same admission-versus-drain distinction at semantic/effect level.

## F4 — Recontainment is a new effect, not time reversal

Members already released may require recontainment if the new evidence means continued exposure can violate the protected invariant. Recontainment is not an undo of release and receives its own identity, authority basis and evidence lineage.

```text
ReleaseDecision R1
 -> ReleaseEffects[]
 -> Invalidation I1
 -> RecontainmentDecision C1
 -> RecontainmentEffects[]
 -> Drain/SettlementEvidence[]
```

Invariants:

- `RECONTAIN != ROLLBACK`.
- `RECONTAINMENT_REQUESTED != RECONTAINMENT_EFFECTIVE`.
- `RECONTAINED_NOW != PREVIOUSLY_NEVER_RELEASED`.
- `RECONTAINMENT_EFFECT != ORIGINAL_RELEASE_EFFECT`.
- `RECONTAINMENT_RETRY != RELEASE_RETRY`.

Historical release/effect facts remain auditable even if a member is later recontained.

## F5 — Already released members are recontained only when continued exposure is materially unsafe

A shared dependency degradation does not justify global recontainment by topology alone. Each released member is classified against the named invariant/surface.

Candidate dispositions:

```text
REMAIN_RELEASED_PROVEN_INDEPENDENT
FREEZE_NEW_ADMISSION_ONLY
RATE_LIMIT_OR_BUDGET
REMOVE_TRAFFIC_ELIGIBILITY
FENCE_MUTATION_SCOPE
REVOKE/ROTATE_CREDENTIAL_SCOPE
RECONTAIN_AND_DRAIN
EXTERNAL_RECONTAINMENT_REQUIRED
HUMAN_DECISION
UNKNOWN_MATERIALITY
```

`Shared dependency != Shared recontainment authority`.

A read-only surface may remain safe while writes are recontained. An Application may remain visible/editable while publish/effect operations are blocked. A Window may remain open while its service is traffic-contained.

## F6 — Recontainment requires current authority independently of the old release authority

The authority that allowed R1 does not necessarily authorize C1. Management may have transitioned, policy may have changed, or the target may now be externally managed.

- `OLD_RELEASE_AUTHORITY != CURRENT_RECONTAINMENT_AUTHORITY`.
- `COHORT_MEMBERSHIP != MUTATION_AUTHORITY`.
- `EXTERNALLY_MANAGED_BLOCKER != SB_MAY_MUTATE_IT`.
- `OBSERVE_ONLY != RESTART/REVOKE AUTHORITY`.

For `EXTERNALLY_MANAGED` or `OBSERVE_ONLY`, G4 may produce findings, recommendations, evidence requests or provider-native/manual plans while leaving mutation to the current owner.

## F7 — Dynamic cohort recomputation computes the minimal current coupling, not a global transaction

When membership or dependency evidence changes, the system recomputes the smallest cohort/barrier required by the protected invariant.

Candidate process:

```text
INVALIDATION ROOT
 -> CLASSIFY CLAIM DIMENSIONS
 -> FREEZE MINIMUM NEW-ADMISSION FRONTIER
 -> PRESERVE IN-FLIGHT EFFECT LINEAGE
 -> RECOMPUTE MATERIAL DEPENDENCY CUT
 -> CLASSIFY RELEASED/WAITING MEMBERS
 -> QUALIFY CURRENT AUTHORITY
 -> DECIDE RECONTAINMENT/CONTINUATION
 -> DRAIN/VERIFY AS REQUIRED
 -> ISSUE NEW COHORT REVISION
```

Invariants:

- `OLD_COHORT != NEW_COHORT` even if some members overlap.
- `MEMBER_REMOVED != MEMBER_EFFECTS_SETTLED`.
- `MEMBER_ADDED != MEMBER_RELEASE_AUTHORIZED`.
- `GRAPH_REACHABILITY != MATERIAL_COUPLING`.
- `TOPOLOGY_RECOMPUTED != AUTHORITY_TRANSFERRED`.

No synthetic global transaction is required. Independent invariants/surfaces may progress separately.

## F8 — Waiting waves and released waves have different obligations

If wave 1 is released and wave 2 is waiting when invalidation occurs:

- wave 2 loses admission only for claims whose basis became stale/materially unsafe;
- wave 1 is evaluated for continuation/recontainment, not retroactively marked unreleased;
- in-flight drain/effect obligations from wave 1 survive cohort recomputation;
- a new wave plan must bind the new cohort/dependency/authority revisions.

`PLAN_CREATED_BEFORE_INVALIDATION != PLAN_CURRENT_AFTER_INVALIDATION`.

`SAME_DESIRED_VALUE != SAME_EXECUTABLE_RELEASE_PLAN`.

## F9 — Evidence arriving late or contradicting previous PASS cannot rewrite history

Late evidence may improve historical interpretation but cannot manufacture evidence that was unavailable at the earlier release decision.

```text
EffectOccurredAt
EvidenceObservedAt
EvidenceVerifiedAt
InvalidationDecidedAt
RecontainmentDecidedAt
```

remain distinct.

- `LATE_PASS != RETROACTIVE_RELEASE_AUTHORITY`.
- `LATE_FAIL != PREVIOUS_EFFECT_NEVER_OCCURRED`.
- `CONTRADICTION != MAJORITY_VOTE`.

If two qualified sources conflict, the affected claim remains contradictory/UNKNOWN until reconciled according to its authority/trust contract.

## F10 — Flapping evidence requires hysteresis for actuation, never freshness extension

Rapid dependency health changes can produce containment/release oscillation and a second thundering herd. Operational hysteresis is therefore a candidate for actuation policy:

```text
minimumStableObservationWindow
minimumContainmentHold
releaseWaveBudget
recontainmentConcurrencyBudget
cooldownAfterFailure
maxTransitionsPerHorizon
manualEscalationThreshold
```

But:

- `HYSTERESIS != EVIDENCE_CURRENTNESS`.
- `COOLDOWN != CLAIM PASS`.
- `STABILITY WINDOW != SEMANTIC AUTHORITY`.
- `DEBOUNCED SIGNAL != HIDDEN CONTRADICTION`.

Kubernetes readiness/readiness gates are useful evidence that traffic eligibility can depend on multiple explicit conditions; missing required gates fail closed rather than becoming implicit success. G4 should similarly keep the underlying claim vector visible while applying operational hysteresis only to actuation.

## F11 — Recontainment itself needs budgets and priority without hiding critical minorities

A broad dependency failure can require recontainment of thousands of members. Recontaining all simultaneously may overload gateways, databases, secret engines or providers.

Candidate operational controls:

```text
maxConcurrentTrafficWithdrawals
maxConcurrentDrains
maxConcurrentCredentialRevocations
maxConcurrentRestarts
maxConcurrentPlacementMoves
priorityByInvariantCriticality
providerRateBudget
```

These controls schedule effects; they do not change truth.

- `QUEUED_FOR_RECONTAINMENT != RECONTAINED`.
- `CAPACITY_LIMIT != SAFE_TO_REMAIN_EXPOSED`.
- `LOW_PRIORITY != NON_MATERIAL`.
- `999 CONTAINED + 1 CRITICAL UNKNOWN != ALL SAFE`.

If capacity prevents immediate containment of a critical member, that fact must remain visible as residual risk/UNKNOWN rather than be averaged away.

## F12 — Credential containment is consumer/effect scoped

A shared Vault path can issue many leases/credentials. Prefix revocation can have large blast radius; force revocation may remove Vault lease state despite backend revocation failure. Therefore credential recontainment needs consumer/lease/effect lineage where available.

- `SHARED_VAULT_PATH != SHARED_CREDENTIAL_IDENTITY`.
- `LEASE_REVOKE_REQUESTED != TARGET-SIDE FENCED`.
- `FORCE-REMOVED_FROM_VAULT != BACKEND_CREDENTIAL_PROVEN_INVALID`.
- `PREFIX_MATCH != SEMANTIC COHORT`.

Automatic binding must expose which dependency/binding rule caused a member to enter the affected set. Secret values never enter diff/provenance surfaces.

## F13 — Placement/endpoint changes cannot be used as implicit recontainment proof

Moving a service or switching endpoints can close some traffic paths while old paths/effects remain live.

- `NEW_ENDPOINT_ACTIVE != OLD_ENDPOINT_DRAINED`.
- `PLACEMENT_CHANGED != SERVICE_REIDENTIFIED`.
- `OLD_PLACEMENT_REMOVED != OLD_EFFECTS_SETTLED`.
- `DEPLOYMENT_UNIT != PHYSICAL_SERVER`.

A placement migration occurring during invalidation creates separate placement and release/recontainment lineages. They may interact but must not be collapsed.

## F14 — Control Center coordinates proof and planning without becoming semantic owner

Control Center should project:

- invalidation root and affected claims;
- old/new cohort revisions;
- released/waiting/in-flight member sets;
- dependency evidence and materiality rationale;
- current authority per member/operation;
- proposed minimal admission freeze;
- recontainment disposition;
- drain/settlement frontier;
- residual `UNKNOWN`/contradictions;
- restart/redeploy/credential/placement consequences;
- provenance and application-specific advanced-setting ownership.

It must not infer ownership from UI location.

`UNIFIED UI != ONE SEMANTIC OWNER/STORE`.

Application-specific settings remain owned by their declared setting contracts even when searchable/diffable in Control Center.

## F15 — Desktop Observatory and Pinned Monitoring Surfaces are projections, not release controllers

Desktop Observatory can pin cohort/dependency/recontainment status and surface critical invalidation. Closing the window, unpinning a monitor, suspending a Workspace or restoring a saved Desktop cannot alter runtime admission, drain or recontainment effects.

- `UI CLOSE != SERVICE STOP`.
- `MONITOR UNPINNED != CONDITION CLEARED`.
- `RESTORED WORKSPACE != RESTORED AUTHORITY/CURRENTNESS`.

Restored views re-resolve Client/Workspace/Environment, cohort revision and evidence currentness.

## F16 — Provider/adapters preserve weaker semantics honestly

Providers differ in readiness, drain, cancellation, credential revocation, fencing and rollback guarantees. An adapter may normalize shape but not manufacture stronger semantics.

Examples:

- target deregistration may mean no new load-balancer connections while old connections still drain;
- provider `Ready` may not include G4 policy/secret/effect claims;
- Vault force lease cleanup may not prove backend credential invalidation;
- an external system may expose health but no fencing primitive.

`ADAPTER NORMALIZATION != FABRICATED EQUIVALENCE`.

Unsupported distinctions degrade to explicit `UNKNOWN`, manual evidence or narrower claims.

## Mandatory adversarial scenarios

1. Tenant A and B share provider infrastructure; A invalidation must not recontain B without a material cross-tenant invariant explicitly proving coupling and authority.
2. Workspace restores a stale cohort PASS after dependency revision changed; restored UI must requalify currentness.
3. A shared gateway degrades after wave 1 release; close only material admission surfaces first, then decide whether wave-1 traffic requires recontainment.
4. Database write capacity drops while reads remain safe; write cohort changes without inventing a read barrier.
5. Wave 2 was previewed before policy revision; it cannot execute from stale plan merely because desired bytes are unchanged.
6. One released member becomes externally managed before recontainment; old SB release authority cannot fabricate current mutation authority.
7. A member is removed from the cohort while old requests still drain; removal does not settle those requests.
8. ELB target deregistration reports draining; do not mark external effects settled or service stopped.
9. New endpoint is healthy while old endpoint can still accept writes because of propagation/cache; endpoint switch does not prove fencing.
10. Vault prefix revoke affects 1,000 leases; one backend revocation fails. Aggregate success must preserve the critical residual UNKNOWN.
11. Vault force removal clears lease state despite backend failure; do not claim target credential fenced.
12. Dependency health flaps every few seconds; hysteresis prevents actuation storm but cannot relabel stale/contradictory evidence current.
13. Recontainment concurrency budget is exhausted; queued critical members remain visibly exposed/UNKNOWN.
14. Automatic cohort derivation adds a member because of hidden secret binding; UI must expose the binding rule/dependency without secret value.
15. Placement migration begins while recontainment is pending; service identity remains stable and both lineages remain visible.
16. App-specific advanced setting conflicts with a Control Center inherited setting; setting contract/provenance resolution remains authoritative.
17. Provider artifact/raw manifest differs from typed desired service definition; provider artifact does not become canonical truth.
18. Closing an Application Window during recontainment must not cancel drain/revocation/runtime effects.
19. Adapter maps provider `unused` to G4 `SETTLED` although external callbacks remain possible; mapping is invalid/UNKNOWN.
20. `OBSERVE_ONLY` member blocks a cohort barrier; SB may not grant itself restart/revoke authority to clear it.
21. `CO_MANAGED` member allows config writes but not credential rotation; recontainment remains operation-scoped.
22. App was discovered but not verified; cohort discovery cannot silently convert it to managed/releasable.
23. Externally managed app has newer version available; invalidation cannot become a silent upgrade path.
24. Shared infrastructure is mistaken for shared data/authority; topology never substitutes for tenancy/ownership proof.
25. A global setting invalidates many members and would require restart; restart blast radius must be shown before admission.
26. A provider says ACK for containment while observed target remains reachable; `ACK != EFFECTIVE`.

## New proof obligations

### PO-205 — Cohort qualification currentness
Every release/recontainment decision identifies the exact cohort, member, dependency, policy, authority, binding and placement revisions it relies on.

### PO-206 — Typed invalidation
Every invalidation records root, affected claim dimensions, materiality rationale and propagation lineage.

### PO-207 — Minimal admission freeze
Containment first closes only the smallest admission frontier proven necessary for the protected invariant, unless narrowness cannot be proven.

### PO-208 — Released-history preservation
Recontainment never rewrites a previously released/effective occurrence as never released.

### PO-209 — Recontainment effect identity
Every recontainment mutation has stable identity distinct from original release and remediation effects.

### PO-210 — Current authority
Current recontainment authority is requalified per target/operation; historical release authority cannot be reused implicitly.

### PO-211 — External/observe-only boundary
External and observe-only members may contribute evidence/barriers without granting SB mutation authority.

### PO-212 — Minimal current cohort
Cohort recomputation follows invariant/materiality evidence rather than topology or graph centrality.

### PO-213 — Membership/effect separation
Adding/removing a member never fabricates admission or settlement of that member's effects.

### PO-214 — Waiting-wave staleness
Plans not yet admitted are requalified after material cohort/dependency/policy/authority change.

### PO-215 — In-flight lineage
Drain, retries, callbacks and external effects admitted before invalidation retain their original effect/admission lineage.

### PO-216 — Late evidence honesty
Late evidence can update historical interpretation but cannot retroactively create decision-time authority/currentness.

### PO-217 — Contradiction preservation
Conflicting qualified evidence remains visible until reconciled; aggregation/majority cannot silently erase it.

### PO-218 — Hysteresis separation
Actuation hysteresis/cooldown never extends evidence freshness or converts UNKNOWN/FAIL into PASS.

### PO-219 — Recontainment budgets
Concurrency/rate budgets schedule containment effects without changing risk/materiality disposition.

### PO-220 — Critical minority preservation
Aggregate progress preserves every critical residual FAIL/UNKNOWN and affected-set completeness.

### PO-221 — Drain/settlement separation
No-new-admission, provider drain completion and semantic/external-effect settlement remain separate claims.

### PO-222 — Credential fencing proof
Lease/prefix revocation and Vault-side cleanup cannot be promoted to target-side credential fencing without qualified evidence.

### PO-223 — Secret safety
Affected-set/provenance surfaces expose `SecretRef`/binding metadata only, never secret values.

### PO-224 — Placement identity continuity
Placement/endpoint migration never changes semantic service identity or erases release/recontainment lineage.

### PO-225 — Provider artifact non-canonicity
Raw/provider artifacts remain compiled/exported projections and cannot become canonical desired truth through reconciliation convenience.

### PO-226 — Adapter semantic honesty
Adapters preserve provider limitations for readiness, drain, cancellation, revocation, fencing and settlement; unsupported equivalence becomes UNKNOWN.

### PO-227 — UI/runtime lifecycle independence
Window/Desktop/Workspace lifecycle cannot cancel, complete or authorize runtime containment/release effects.

### PO-228 — Automatic explainability
Automatic invalidation/cohort/recontainment decisions expose dependency rule, materiality, authority, currentness and consequence.

### PO-229 — Tenant isolation
Evidence, cohort derivation and recontainment authority remain Client/Environment scoped even on shared infrastructure.

### PO-230 — Control Center ownership boundary
Global search/diff/planning never transfers application/provider setting ownership to Control Center.

## Cross-application semantic reconciliation

The candidate chain now reads:

```text
Typed desired/config/policy/service identity
 -> Application management authority
 -> Environment/secret/network/storage/placement bindings
 -> Release cohort + dependency qualification
 -> staged release admission/effects
 -> dynamic invalidation root
 -> minimal admission freeze
 -> current cohort recomputation
 -> continuation/recontainment decision
 -> drain/fencing/settlement evidence
 -> Control Center / Observatory projection
```

No stage may silently collapse `Desired`, `Observed`, `Applied`, `Effective`, `Settled`, `Compliant` or `Current`.

## Maturity / saturation

- Cohort currentness and typed invalidation: `ADVANCED_EMERGING / MATERIAL / NOT_SATURATED`.
- Minimal admission freeze vs recontainment: `ADVANCED_EMERGING / MATERIAL / NOT_SATURATED`.
- Released/waiting/in-flight lineage: `ADVANCED_EMERGING / MATERIAL / NOT_SATURATED`.
- Hysteresis and anti-oscillation: `MATERIAL / NOT_SATURATED`.
- Recontainment budgets/thundering-herd containment: `MATERIAL / NOT_SATURATED`.
- Credential/lease fencing mapping: `MATERIAL / NOT_SATURATED`.
- Provider-native readiness/drain/revocation equivalence: `EARLY_MATERIAL`.
- External/co-managed dynamic recontainment: `MATERIAL / NOT_SATURATED`.

No domain is declared saturated.

## Architecture gaps remaining

1. Exact operation-class continuation grammar when invalidation occurs after an effect has been admitted but before provider dispatch.
2. Cross-provider drain/fencing evidence composition when one provider has strong fencing and another exposes only eventual health/readiness.
3. Cohort recomputation under cyclic/shared dependencies without turning the dependency graph into orchestration ownership.
4. Safe re-release after recontainment when evidence flaps and some old effects remain UNKNOWN.
5. Offline/autonomous runtime handling when the Control Center that derived the cohort is unavailable during invalidation.
6. Provider-specific mapping of readiness, draining, credential revocation and cancellation into portable weaker claims.

## Next highest-value gap

Research **offline/autonomous invalidation and local recontainment contracts**: a published runtime or externally managed target observes dependency degradation while Factory/Control Center is unreachable. Determine which release/containment rules must be durably compiled/local, how local operation preserves Client/Environment/policy/authority/currentness horizons, which actions can be taken without central coordination, how reconciliation works when connectivity returns, and how to avoid turning Builder availability into a runtime dependency.

The next round should preserve:

- `Control Center unavailable != Runtime unsafe by definition`;
- `Locally cached rule != indefinitely current authority`;
- `Local containment != Global ownership`;
- `Reconnect != Effects settled`;
- `Offline autonomy != unlimited stale-security operation`;
- `Dependency graph != orchestration ownership`.
