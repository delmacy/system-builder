# G4 — Application Management In-Flight Effect Handoff Research

Status: `RESEARCH_ACTIVE / NON_EXECUTABLE`
Execution authority: NONE
Date: 2026-09-22
Scope: G4 Web Desktop & Application Environment — Application Manager / Control Center / declarative deployment / placement / Vault bindings

## Purpose

Continuation of `G4_APPLICATION_ADOPTION_AUTHORITY_TRANSITION_RESEARCH.md` for its highest-value open gap: management authority changes while restart, upgrade, configuration apply, secret rotation, placement migration or other effects are already in flight.

This is P&D documentation only. It does not authorize implementation, WBS, Work Packages, Sprints, TASKs, provider adoption or product changes.

## Repository inputs reconciled

- Constitutional boundaries: `Builder != Runtime`, runtime autonomy, compatibility before replacement, replaceable suite modules and explicit bounded-context contracts.
- Existing Application Adoption research: management relationship is a versioned binding; management mode is only a UX projection over scoped authority; `New manager registered != old manager fenced`; first reconciliation is a safety boundary; placement and management transitions are orthogonal.
- Recent :00 Command Registry research: preflight/presentation is not execution admission; effect identity survives window/session loss; `ACK != EFFECTIVE`; UI state cannot fence duplicate effects.
- Recent :10 Editor Impact Graph research: evidence currentness is claim-relative; inability to prove unaffected widens qualification/returns `UNKNOWN`; environment promotion preserves artifact identity but requalifies environment facts.
- Latest unified assembly grammar: `ADD/INSTALL -> CONFIGURE -> BIND/CONNECT -> VALIDATE -> APPLY -> OBSERVE -> TUNE/EVOLVE`, preserving `Installed != Configured != Bound != Verified != Effective`.

## External evidence and portable lessons

### Crossplane management policies

Crossplane decomposes external-resource authority into `Create`, `Observe`, `Update`, `Delete` and `LateInitialize`; observe-only and no-delete combinations are first-class. Portable lesson: stopping one management operation does not prove all mutation authority ceased, and management authority remains operation-scoped.

### Kubernetes finalization

Kubernetes finalizers separate deletion request/acceptance from completion. A delete can return HTTP 202 and leave the object terminating until cleanup obligations finish. Portable lesson: a management transition can stop new admissions while retaining residual obligations; `transition requested/accepted != old effects settled`.

### Existing G4 effect semantics

G4 already distinguishes acknowledgement, effect, settlement, fencing, retry lineage, non-fenceable effects and `UNKNOWN`. Management handoff must consume those semantics rather than inventing a desktop-local completion model.

## Core finding — authority epoch and effect lineage are orthogonal

Candidate separation:

```text
ManagementAuthorityRevision
ManagementTransitionRef
EffectIdentity
EffectOriginManagerRef
EffectOriginAuthorityRevision
EffectTargetRef
EffectKind
AdmissionEvidenceRef
AttemptRefs[]
ObservedDisposition
SettlementEvidenceRef?
```

An effect admitted under authority revision `A1` remains an `A1` effect even if authority becomes `A2` before the effect settles.

Invariants:

```text
AUTHORITY TRANSITION != EFFECT REIDENTIFICATION
NEW MANAGER != NEW EFFECT IDENTITY
RETRY AFTER HANDOFF != NEW SEMANTIC ADMISSION BY DEFAULT
OLD MANAGER DISABLED != OLD EFFECT SETTLED
TRANSITION COMMITTED != TRANSITION EFFECTIVE FOR EVERY EFFECT CLASS
```

## Admission frontier vs settlement frontier

Management handoff needs at least two independent frontiers:

```text
AdmissionFrontier
  which manager/revision may admit new effects for operation/scope X

SettlementFrontier
  which already-admitted effects remain unresolved and which evidence proves their disposition
```

The normal transition should first prevent conflicting **new admissions** and then deal with residual effects according to effect class. This avoids requiring a global drain when only one operation/setting is changing authority.

```text
NO_NEW_ADMISSIONS != NO_INFLIGHT_EFFECTS
DRAINED_QUEUE != SETTLED_EXTERNAL_EFFECTS
```

## Candidate handoff protocol

```text
1 snapshot current ManagementAuthorityRevision
2 classify operation/field scopes being transferred
3 close or redirect new-admission frontier for conflicting scopes
4 enumerate known in-flight effect identities and unknown frontier
5 classify each effect by fenceability, reversibility, idempotency and external observability
6 choose per-effect disposition: WAIT / DRAIN / FENCE / OBSERVE / RECONCILE / REMEDIATE / MANUAL
7 establish successor authority revision without relabeling old effects
8 enable successor admissions only where invariant-qualified overlap is safe
9 verify old-manager admission stopped for transferred scopes
10 observe/settle residual old effects
11 reconcile desired/observed/effective state
12 mark transition effective only for scopes whose proof obligations are satisfied
```

No step implies the next automatically.

## Effect classes during handoff

### Configuration apply

If an old apply is `ACKNOWLEDGED` but effect is unknown, the new manager must not blindly submit the same desired value as a fresh operation. It should first correlate/observe the old effect or use a declared idempotency/fencing contract.

### Restart/reload

A restart request may have been accepted while service availability is still transitioning. Management transfer cannot infer completion from process/controller ACK. A new manager may observe health, but `healthy now` does not prove which restart effect completed.

### Upgrade

Upgrade is especially sensitive because runtime/API compatibility and management API compatibility may change while authority moves. The successor manager must preserve upgrade lineage and version evidence rather than interpreting an ambiguous old upgrade as `not started`.

### Secret rotation

Rotation has multiple effects: new credential issuance, delivery, consumer reload, old credential revocation and target-side rejection of the old credential. Authority handoff may complete for one step while others remain pending/unknown.

```text
SECRET ROTATED AT SOURCE != CONSUMER USING NEW SECRET
OLD SECRET REVOKED AT SOURCE != OLD SECRET EFFECTIVELY FENCED AT TARGET
```

### Placement migration

Data copy, endpoint switch, traffic cutover and old-placement decommission are distinct effects. Changing management authority mid-migration must not change service semantic identity or convert a partial placement migration into a completed authority transition.

## Overlap policies are invariant-scoped

Candidate overlap dispositions:

```text
EXCLUSIVE_HANDOFF
  successor admissions blocked until conflicting predecessor rights/effects are fenced/settled

BOUNDED_OVERLAP
  old and new managers may operate only on proven-independent fields/operations

OBSERVE_DURING_DRAIN
  successor observes/reconciles evidence but does not mutate transferred scope yet

NON_FENCEABLE_RECONCILIATION
  new admissions restricted while old external effect remains UNKNOWN; explicit reconciliation/remediation required
```

These are research candidates, not implementation enums.

`CO_MANAGED` does not automatically justify overlap. Overlap is safe only where ownership/merge law and effect interaction prove it.

## Control Center and Desktop Observatory implications

Control Center should be able to project, per setting/effect:

- desired value and provenance;
- observed/effective value;
- current manager/authority revision;
- predecessor manager/effect lineage;
- pending/unknown effects;
- whether new admissions are open;
- restart/reload/redeploy/rotation implications;
- reconciliation owner and required evidence.

Desktop Observatory/Pinned Monitoring Surfaces may visualize the transition but do not adjudicate it.

```text
GREEN HEALTH != HANDOFF COMPLETE
NO ALERT != NO RESIDUAL EFFECT
UI CLOSE != EFFECT CANCELLATION
```

## Declarative deployment and placement reconciliation

Provider artifacts remain compiled/exported projections. A provider ACK for a new manager's desired state cannot erase an older provider-side effect.

```text
PROVIDER ACK != EFFECTIVE SERVICE
PROVIDER ARTIFACT != CANONICAL INTENT
PLACEMENT CUTOVER != MANAGEMENT CUTOVER
SERVICE IDENTITY != ENDPOINT/IP/PLACEMENT
```

A transition plan therefore composes, rather than collapses, `ManagementTransition`, `PlacementTransition`, `ConfigChangePlan`, credential transitions and deployment/effect evidence.

## Contradictions / trade-offs

### Fast handoff vs strong fencing

Some providers expose strong cancellation/fencing; others expose only eventual observation. Requiring universal strong fencing would make adoption impossible for legitimate external systems. Allowing optimistic handoff would risk duplicate/conflicting effects. Resolution: preserve provider capability explicitly and allow `UNKNOWN/PARTIALLY_EFFECTIVE` plus bounded/manual reconciliation rather than fabricate certainty.

### Availability vs exclusive ownership

A strict drain can reduce availability. Bounded overlap is acceptable only for operation/field scopes whose invariants are independent. Shared infrastructure does not imply shared data or shared authority.

### Automatic reconciliation vs ambiguity

Automatic reconciliation is valuable when effect identity/idempotency/currentness are proven. Under ambiguous old effects, automation must surface the dependency and refrain from creating a seemingly new effect. `Automatic != hidden`.

## New proof obligations

PO-33. Every material in-flight effect retains origin manager and authority-revision lineage across management transition.

PO-34. Closing old-manager admission cannot be reported as settlement of already-admitted effects.

PO-35. A successor retry/reconcile cannot create a new semantic effect identity merely because the manager changed.

PO-36. Transition effectiveness is operation/scope qualified; one settled effect class cannot green-light unrelated unknown classes.

PO-37. Unknown predecessor effects remain representable after successor authority is committed.

PO-38. New admissions are blocked where an unresolved predecessor effect can violate the same named invariant unless independent overlap safety is proven.

PO-39. Secret rotation handoff distinguishes issuance, delivery, consumer use, old-secret revocation and target-side fencing.

PO-40. Placement migration and management handoff preserve independent identities, plans and partial-failure states.

PO-41. Provider/controller ACK cannot prove predecessor effect settlement or successor service effectiveness.

PO-42. UI/window/session lifecycle cannot cancel, complete or reidentify management effects.

PO-43. Co-managed overlap requires explicit ownership/merge law plus effect-interaction safety; the label alone is insufficient.

PO-44. If old-manager automation/credentials cannot be proven fenced, the result remains `UNKNOWN/PARTIALLY_EFFECTIVE` rather than silently managed.

PO-45. Reconciliation evidence binds Client/Workspace/Environment/application/service identity and authority revision; stale client context cannot be reused.

PO-46. Automatic binding/reconciliation exposes the dependency, rule, target, authority and consequence; automation cannot hide critical coupling.

PO-47. Shared infrastructure cannot be used as evidence of shared semantic ownership, data authority or mutation rights.

PO-48. Adapter normalization cannot claim two management/effect models equivalent where cancellation, idempotency, fencing or settlement guarantees differ.

## Mandatory adversarial reconciliation

- tenant leak / stale client context: effect and authority evidence are Client/Workspace/Environment scoped;
- hidden secret exposure: only `SecretRef` and qualified delivery/revocation evidence belong in semantic plans;
- discovered but unverified app: no management/effect authority follows discovery;
- externally managed app silently upgraded: upgrade admission requires explicit authority;
- global setting triggers unexpected restart: change plan must expose restart effect and blast radius before admission;
- shared infrastructure mistaken for shared authority: explicitly forbidden;
- provider artifact becomes canonical: explicitly forbidden;
- UI close stops runtime: explicitly forbidden;
- adapter fabricates equivalence: guarantee differences remain visible;
- placement migration changes semantic identity: explicitly forbidden;
- app-specific setting conflicts with Control Center: ownership/provenance and conflict law decide; UI location does not;
- automatic binding hides dependency: binding provenance and consequence remain inspectable.

## Maturity / saturation

`APPLICATION_MANAGEMENT_INFLIGHT_HANDOFF = ADVANCED_EMERGING / MATERIAL_DELTA / NON_EXECUTABLE`.

Principles now materially mature:

- management authority revision and effect identity are orthogonal;
- handoff has separate admission and settlement frontiers;
- predecessor effects retain lineage after authority transfer;
- transition effectiveness is operation/invariant scoped;
- ambiguous/non-fenceable effects remain `UNKNOWN` and require reconciliation rather than relabeling;
- placement/config/credential/management transitions compose but do not collapse;
- UI/observability project evidence but do not own transition truth.

Not saturated:

1. exact effect-identity correlation when external providers expose weak/no request IDs;
2. portable handoff evidence package for successor external managers;
3. heterogeneous cancellation/fencing capability taxonomy;
4. reconciler overlap when an undiscoverable third writer exists;
5. authority rollback after successor admissions have already produced effects;
6. interaction with global Control Center changes spanning many applications and partial handoffs.

## Next highest-value gap

**Cross-application change-set orchestration and blast-radius proof**: when one Control Center policy/configuration change touches many applications/services with mixed management modes, placements, secret bindings and restart/redeploy requirements, determine how to produce a typed change plan, preserve per-application authority/effect identity, stage/sequence rollout, represent partial effectiveness and rollback/remediation, and prove the affected set without turning Control Center into a global semantic owner or global transaction coordinator.
