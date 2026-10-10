# G4 — Policy Exception Transitions Across Partially Effective Change Sets

Status: `RESEARCH_ACTIVE / NON_EXECUTABLE`
Scope: G4 Web Desktop & Application Environment / Control Center / Application Manager / cross-application conformance
Date: 2026-09-23

## Purpose

Research the lifecycle boundary where a policy exception/waiver is renewed, superseded, expires or is revoked while a cross-application change set is already partially admitted or partially effective. This is P&D documentation only. It does not authorize implementation, WBS, Work Packages, Sprints, TASKs, migrations, provider adoption or product changes.

This artifact continues the existing Control Center work on configuration provenance, policy exceptions, cross-application change sets and management/effect handoff. It preserves the G4 Web Desktop hierarchy `Builder Home/Factory -> Client -> Workspace -> Desktop Sphere -> Application -> Window -> View/Tab/Tool`; 3D remains an optional future projection/application rather than a navigation foundation.

## Authorities and evidence classes

Repository authority remains `AGENTS.md`, `docs/architecture/MASTER_BLUEPRINT.md`, `project_docs/generation-4/README.md`, `G4_RESEARCH_STATE.md` and the dedicated G4 research artifacts. Constitutional invariants remain intact: `Builder != Runtime`, published runtime autonomy, compatibility before replacement, replaceable suite modules and explicit bounded-context contracts.

External pattern evidence reviewed:

1. Kubernetes ValidatingAdmissionPolicy separates `Deny`, `Warn` and `Audit`; a failed predicate can therefore have distinct enforcement dispositions rather than one universal boolean consequence. This is portable evidence for separating policy evaluation from enforcement consequence.
2. AWS CloudFormation change sets separate preview from execution, warn that preview does not guarantee successful runtime execution, and invalidate sibling change sets after execution changes stack state. Drift-aware change sets additionally distinguish actual, previous-deployment and desired state. This is portable evidence for revision-qualified plans and requalification after material state changes.
3. Existing G4 exception research separates policy exception from configuration override, policy deletion and management authority; expiry does not undo prior effects; exception issuance is distinct from exception use.
4. Existing G4 change-set research separates target-local authority/effect identity, partial effectiveness, blast-radius proof and rollback/remediation from global transaction semantics.

No external product semantics are adopted wholesale.

## Finding 1 — policy basis is pinned at admission, not looked up retrospectively from “current exception”

Every admitted target operation needs a stable policy-admission basis.

Candidate:

```text
PolicyAdmissionBasis
  admissionId
  targetRef
  operationRef
  policyRevisionRefs[]
  predicateRefs[]
  exceptionUseRefs[]
  authorityRevisionRefs[]
  configurationBasisRefs[]
  admittedAt
  continuationRuleRef
  newEffectRuleRef
```

An operation admitted under waiver `W1` remains historically admitted under `W1` even if `W1` later expires, is revoked or is superseded by `W2`.

```text
CURRENT_EXCEPTION != HISTORICAL_ADMISSION_BASIS
EXCEPTION_SUPERSEDED != OLD_ADMISSION_REWRITTEN
EXCEPTION_REVOKED != HISTORICAL_USE_DELETED
```

A successor waiver cannot “wash” an older ambiguous effect into a new authority basis.

## Finding 2 — admission, continuation, retry/new-effect and settlement are independent policy questions

A policy transition during an in-flight operation creates at least four questions:

1. may a new target operation be admitted now?
2. may an already admitted operation continue its existing attempt?
3. may that obligation create another attempt/effect after retry, failover or resume?
4. may already-created effects be observed, settled, compensated or remediated?

Candidate disposition vector:

```text
ExceptionTransitionDisposition
  newAdmission = ALLOW | DENY | REQUALIFY | UNKNOWN
  continuation = ALLOW | STOP_AT_BOUNDARY | CANCEL_IF_FENCEABLE | REQUALIFY | UNKNOWN
  newEffect = ALLOW | DENY | REQUALIFY | UNKNOWN
  settlement = OBSERVE_AND_SETTLE | REMEDIATE | MANUAL | UNKNOWN
```

Therefore:

```text
ADMITTED != CONTINUATION_AUTHORIZED != NEW_EFFECT_AUTHORIZED != SETTLED
```

A policy may legitimately close new admissions immediately while allowing an already-started non-destructive operation to settle. A security-critical revocation may instead prohibit any new external effect while still requiring observation of an old ambiguous effect.

## Finding 3 — retry/redelivery preserves original policy lineage unless explicitly re-admitted

Retry is especially dangerous during waiver transition.

```text
RETRY != NEW POLICY ADMISSION
REDELIVERY != SUCCESSOR-WAIVER USE
FAILOVER != AUTHORITY REFRESH
```

If operation `O` was admitted under `W1`, attempt `A2` after `W1` expires cannot silently cite `W2` merely because `W2` now exists. There are two legitimate candidates:

- `A2` remains an attempt of the old obligation and is permitted only if `W1`'s continuation/new-effect rule allows it; or
- the system performs explicit re-admission, creating a new admission basis while preserving causal lineage to the old obligation/effect.

Re-admission must not erase an old `UNKNOWN` effect. Stable effect identity, idempotency/fencing evidence and target-side observability remain required.

## Finding 4 — successor waiver is a new authority edge, not renewal by textual similarity

A renewal/successor exception should preserve lineage but have its own identity/revision, authority evidence, scope and horizon.

Candidate relation:

```text
ExceptionTransition
  predecessorExceptionRef
  successorExceptionRef?
  relation = RENEWS | NARROWS | WIDENS | SUPERSEDES | REVOKES | EXPIRES | UNKNOWN
  semanticDiffRef
  authorityBasisRef
  effectiveFrom
  transitionReason
```

Even a “renewal” requires qualification.

```text
SAME TEXT != SAME AUTHORITY
SAME PREDICATE != SAME TARGET SET
SAME TARGET SET != SAME CONTINUATION RIGHTS
```

Changes in policy revision, predicate meaning, target selector, environment, compensating control, authority, duration or management boundary can make the successor incomparable rather than equivalent.

## Finding 5 — exception transition is target-scoped inside a cross-application change set

A cross-application change set is not one policy transaction. Each target retains its own admission/effect lineage.

Example:

```text
ChangeSet C
  App A: EFFECTIVE under W1
  App B: IN_FLIGHT under W1
  App C: NOT_YET_ADMITTED under W1
  App D: EXTERNALLY_MANAGED / recommendation only
```

If `W1` expires:

- A remains a historical fact; policy may now classify its effective state as noncompliant/remediation-required.
- B follows the declared continuation/new-effect rule for its pinned admission basis.
- C cannot be admitted merely because it belongs to C; it requires current policy basis.
- D does not gain mutation authority from the exception transition.

```text
CHANGESET_ADMITTED != EVERY_TARGET_ADMITTED
ONE_TARGET_EFFECTIVE != CHANGESET_EFFECTIVE
EXCEPTION_VALID_FOR_C != EVERY_TARGET_CURRENT
```

Aggregate status must preserve per-target differences rather than collapsing to green/red.

## Finding 6 — revocation and expiry are semantically different transitions

Expiry is a predeclared horizon. Revocation is an explicit authority event that may occur before that horizon and may carry a stronger response policy.

```text
EXPIRED != REVOKED
REVOKED != TARGET_EFFECT_FENCED
REVOCATION_RECORDED != REVOCATION_OBSERVED_EVERYWHERE
```

Candidate currentness dimensions:

```text
ExceptionCurrentness
  semanticCurrentness
  authorityCurrentness
  timeCurrentness
  revocationCurrentness
  compensatingControlCurrentness
  policyCurrentness
```

Distributed/offline runtime autonomy means observation time can lag effective policy time. The UI must preserve `effectiveAt`, `observedAt` and effect time where material rather than inventing a total wall-clock truth.

## Finding 7 — policy transition may close an admission frontier without settling an effect frontier

This reuses the existing G4 distinction between admission and settlement frontiers.

```text
EXCEPTION_INVALID_FOR_NEW_ADMISSION != OLD_EFFECTS_SETTLED
NO_NEW_ADMISSIONS != NO_INFLIGHT_EFFECTS
```

For each affected invariant, the Control Center should be able to reason about the smallest target/effect set requiring drain, fence, observation, remediation or manual handling. It must not impose a global barrier merely because the exception was cross-application.

```text
BarrierScope(X) = smallest proof-complete set of unsettled obligations/effects whose continuation could violate invariant X
```

This is a research relation, not an implementation algorithm.

## Finding 8 — already-effective state can become noncompliant without becoming ineffective

If an exception expires after a target has reached its desired effective state:

```text
SERVICE_EFFECTIVE && POLICY_NONCOMPLIANT
```

is a legitimate combined state.

The policy may require remediation, a deadline, quarantine or human review, but the Control Center cannot infer that consequence from exception expiry alone.

```text
EXCEPTION_EXPIRED != CONFIG_AUTO_REVERTED
EXCEPTION_EXPIRED != SERVICE_STOPPED
NONCOMPLIANT != INEFFECTIVE
```

This preserves `Policy != configuration` and `Configured != Applied != Effective`.

## Finding 9 — partially effective plans require policy-basis drift as a first-class stale-plan reason

A change plan calculated while `W1` was current becomes stale for unadmitted targets when the relevant exception/policy basis changes.

Candidate stale reasons:

```text
POLICY_REVISION_CHANGED
EXCEPTION_EXPIRED
EXCEPTION_REVOKED
EXCEPTION_SUPERSEDED
EXCEPTION_SCOPE_CHANGED
COMPENSATING_CONTROL_STALE
TARGET_AUTHORITY_CHANGED
TARGET_OBSERVED_STATE_CHANGED
```

CloudFormation's change-set model provides useful pattern evidence: execution changes stack state and makes sibling plans invalid; drift-aware planning distinguishes actual from previous-deployment and desired state. G4 generalizes this principle semantically rather than adopting CloudFormation identity/lifecycle.

```text
SAME REQUESTED_CONFIG != SAME EXECUTABLE_CHANGE_PLAN
PLAN_PREVIEWED != PLAN_CURRENT
```

## Finding 10 — policy enforcement disposition must remain distinct from policy truth

Kubernetes admission policy supports `Deny`, `Warn` and `Audit`, demonstrating a mature separation between predicate failure and enforcement action. G4 should preserve the portable distinction:

```text
POLICY_PREDICATE_RESULT != ENFORCEMENT_DISPOSITION
```

Candidate G4 dispositions may include blocking new admission, warning, recording finding, requiring requalification, requiring remediation, or escalating to explicit human authority. These are policy-governed consequences, not hardcoded meanings of “failed”.

A waiver may affect the enforcement/admission result without rewriting the predicate result itself.

```text
WAIVED_FAILURE != PREDICATE_PASS
```

## Finding 11 — mitigation evidence can invalidate continuation independently of waiver expiry

A `MITIGATED_BY_ALTERNATIVE_CONTROL` exception depends on evidence external to the exception itself. If the compensating control becomes stale, revoked or `UNKNOWN`, continuation may need requalification even while the exception's nominal time horizon remains open.

```text
EXCEPTION_TIME_CURRENT != MITIGATION_CURRENT
MITIGATION_DECLARED != MITIGATION_EFFECTIVE
```

The exception cannot self-attest the control that justifies it.

For cross-application plans, mitigation evidence may be target-specific. One target losing mitigation does not automatically invalidate independent targets.

## Finding 12 — externally managed and observe-only targets preserve authority boundaries during exception transitions

A policy exception may explain why a target is allowed to remain noncompliant or why a recommendation was accepted. It does not create mutation authority.

```text
EXCEPTION_AUTHORITY != MANAGEMENT_AUTHORITY
EXTERNALLY_MANAGED + EXCEPTION_EXPIRED != SILENT_SB_REMEDIATION
OBSERVE_ONLY + POLICY_FAILURE != MUTATION_PERMISSION
```

For such targets the correct consequence may be finding, recommendation, exported plan or evidence request. `Install != Adopt`, `Register != Deploy`, `Connect != Own` remain intact.

## Finding 13 — automatic policy/exception matching must remain explainable

Automatic matching is useful only if it exposes:

- policy and predicate revision;
- exception identity/revision;
- target selector and resolved target;
- Client/Workspace/Environment context where applicable;
- management authority disposition;
- validity/currentness dimensions;
- compensating-control evidence if required;
- continuation/new-effect rule;
- why the match changed after renewal/revocation/expiry.

```text
AUTOMATIC != HIDDEN
MATCHED != AUTHORIZED
```

A hidden auto-renewal that silently keeps a cross-application rollout moving would violate G4's authority/evidence boundaries.

## Finding 14 — Control Center and Application-specific settings remain complementary projections

Control Center may coordinate policy findings, exception transitions, change-set status and blast radius. The Application's own advanced settings remain the authoritative specialized surface where its domain owns semantics.

```text
UNIFIED UI != ONE SEMANTIC OWNER/STORE
CONTROL CENTER VISIBILITY != TARGET OWNERSHIP
```

A policy exception does not make Control Center the owner of an application's setting, deployment or runtime.

## Finding 15 — Desktop/Window/Modal lifecycle cannot settle policy or effect state

Recent G4 modal research reinforces that modality/focus are interaction contracts, not business locks. Therefore:

```text
DIALOG_CONFIRMED != EFFECT_EFFECTIVE
WINDOW_CLOSED != OPERATION_CANCELLED
MODAL_OPEN != TARGET_LOCKED
UI_INERT != RESOURCE_FENCED
```

A waiver renewal dialog can gather human input, but the resulting policy transition is authoritative only when its policy/authority contract admits it. Cross-surface modality cannot be used to claim a distributed freeze while exception transition is pending.

## Finding 16 — evidence/privacy constraints apply to exception-transition audit lineage

Exception-use evidence should retain what is necessary to prove policy basis, authority, target, operation and timing without automatically retaining secret values, sensitive configuration payloads or universal correlation identifiers.

```text
SecretRef != secret value
EXCEPTION_AUDIT != RETAIN_ALL_TARGET_PAYLOAD
CORRELATABLE != AUTHORIZED_TO_JOIN
```

Recent G4 evidence research reinforces purpose-scoped correlation and retention. A cross-application exception report must not become a tenant-spanning identity graph.

## Candidate transition matrix

| Transition | New admission | Existing attempt | Retry/new external effect | Historical effect | Typical evidence need |
|---|---|---|---|---|---|
| Exception still current | policy-qualified | pinned basis | pinned/declared rule | observe/settle | currentness + authority |
| Natural expiry | normally closed/requalify | policy-defined | no implicit permission | remains fact | expiry + admission basis |
| Explicit revocation | closed unless separately authorized | policy-defined, potentially stronger stop | no implicit permission | remains fact | revocation currentness + fencing/settlement |
| Equivalent renewal proven | successor may admit future work | predecessor lineage preserved | only as explicitly allowed/re-admitted | remains predecessor fact | semantic diff + authority |
| Narrower successor | only narrowed scope | predecessor rule until transition says otherwise | requalify | remains fact | target/operation diff |
| Wider successor | newly covered future work only | does not rewrite predecessor | explicit new admission | remains fact | widened-scope authority |
| Mitigation becomes stale | requalify/deny | requalify per invariant | no implicit permission | remains fact | independent mitigation evidence |
| Policy revision changed | requalify unless compatibility proven | pinned historical interpretation; continuation separately qualified | requalify | remains fact | semantic policy diff/currentness |

The matrix is research grammar, not a runtime state machine.

## Cross-application conformance rules

1. A target operation records the policy/exception basis actually used at admission.
2. A successor exception never rewrites predecessor use evidence.
3. Unadmitted targets are evaluated against current policy basis, not the change set's creation-time basis.
4. In-flight continuation and creation of a new external effect are separately qualified.
5. Retry/redelivery/failover preserve original obligation/effect lineage unless explicit re-admission occurs.
6. Re-admission cannot erase or relabel predecessor `UNKNOWN` effects.
7. Exception expiry/revocation may stale a plan without cancelling already-created effects.
8. Effective service state and policy-compliance state remain orthogonal.
9. Management mode/authority remains independent of policy exception authority.
10. Policy basis drift contributes to blast-radius/currentness proof but does not itself grant remediation authority.
11. Aggregate change-set status exposes target coverage, currentness and partial effectiveness.
12. Provider ACK, UI confirmation and policy exception existence do not prove target effect.
13. `UNKNOWN` remains representable whenever fencing, revocation observation, mitigation or effect settlement cannot be proven.
14. Tenant/Client scope is part of every reusable exception/admission proof key.
15. Adapters may map provider-native exemptions only when semantic equivalence is qualified; otherwise preserve mismatch/UNKNOWN.

## Proof obligations PO-105..PO-128

- **PO-105 Policy-basis pinning:** every admitted material operation identifies the policy/predicate/exception revisions used at admission.
- **PO-106 Historical immutability:** renewal, supersession, expiry or revocation cannot rewrite the historical admission basis.
- **PO-107 Admission/continuation separation:** new-admission permission and continuation permission are independently representable.
- **PO-108 New-effect separation:** permission to continue local work cannot be interpreted as permission to create another external effect.
- **PO-109 Retry lineage:** retry/redelivery/failover retains original obligation/effect/policy lineage absent explicit re-admission.
- **PO-110 Re-admission visibility:** explicit re-admission creates a visible successor basis and causal link rather than relabeling the old attempt.
- **PO-111 Unknown-effect conservation:** predecessor `UNKNOWN` effects survive exception transition until qualified settlement/fencing/remediation evidence exists.
- **PO-112 Successor qualification:** renewal/successor equivalence is proven over policy revision, predicates, target scope, operation scope, authority and compensating controls.
- **PO-113 Target-local transition:** exception transition is evaluated per materially affected target/operation; no synthetic global policy transaction is assumed.
- **PO-114 Partial effectiveness:** aggregate change-set status cannot hide effective, in-flight, unadmitted, failed and unknown targets behind one success flag.
- **PO-115 Expiry/revocation distinction:** natural expiry and explicit revocation remain different events with separately declared consequences.
- **PO-116 Revocation observation:** revocation effective time and target/runtime observation time remain distinct where material.
- **PO-117 No implicit rollback:** exception expiry/revocation cannot be presented as configuration rollback, service stop or effect reversal without evidence.
- **PO-118 Compliance/effect orthogonality:** a target may be effective and policy-noncompliant simultaneously.
- **PO-119 Plan currentness:** policy/exception basis changes can stale unexecuted plan portions and require requalification.
- **PO-120 Predicate/enforcement separation:** failed, waived, warned, audited and denied dispositions do not collapse into one policy truth value.
- **PO-121 Mitigation independence:** alternative-control evidence is independently sourced/current and cannot be self-proven by the exception.
- **PO-122 Management boundary:** exception authority never fabricates SB mutation authority over external/observe-only targets.
- **PO-123 Automatic explainability:** automatic exception matching exposes rule, target, scope, authority, horizon, evidence and consequence.
- **PO-124 Tenant isolation:** exception/admission evidence is Client/tenant scoped; no cross-tenant reuse by identifier coincidence.
- **PO-125 Secret safety:** exception/change-set evidence references secrets without disclosing secret values.
- **PO-126 UI lifecycle independence:** closing a window/dialog/session does not cancel, settle, renew or revoke policy/effect state.
- **PO-127 Adapter honesty:** provider-native exemption mapping cannot fabricate equivalence across different predicates, scopes, expiry or enforcement semantics.
- **PO-128 Evidence currentness:** historical use evidence, current exception admissibility and effect settlement evidence retain separate currentness dimensions.

## Adversarial scenarios

1. W1 expires after App A is effective, App B is in flight and App C has not started. The system marks all three failed and auto-rolls back. **Reject:** effect/compliance/admission are distinct.
2. W2 renews W1 with the same description. A retry from B is silently attributed to W2. **Reject:** successor exception cannot launder predecessor lineage.
3. W1 is revoked, but an old manager still holds target credentials. UI says “revoked” and assumes fencing. **Reject:** policy revocation is not target-side effect fencing.
4. App C is `EXTERNALLY_MANAGED`; exception expiry triggers SB restart to remediate. **Reject:** exception authority is not management authority.
5. W1 allowed a mitigated state; mitigation evidence becomes stale before W1 expires. Rollout continues because `expiresAt` is still future. **Reject:** mitigation currentness is independent.
6. Change set was previewed before W1 revocation. Operator executes old preview unchanged. **Reject:** policy-basis drift stales the relevant plan portion.
7. Retry after timeout creates a second provider-side effect because the first is `UNKNOWN`; W2 is used as justification. **Reject:** new waiver cannot erase unknown predecessor effect.
8. Provider reports ACK for cancellation after revocation; Control Center marks old effect absent. **Reject:** ACK is not effect settlement.
9. Shared infrastructure hosts Client A and B; A's waiver is reused for B because target endpoint is identical. **Reject:** shared infrastructure is not shared policy authority/data scope.
10. Workspace restore reopens an exception-renewal dialog and reuses stale Client context. **Reject:** restored UI does not restore authority/currentness.
11. Exception report includes resolved Vault secret value to prove binding. **Reject:** `SecretRef != secret value`.
12. App discovered but unverified appears in affected set and receives mutation because W1 covers its selector. **Reject:** `Discovered != Verified`; exception does not establish identity/management authority.
13. Externally managed app is silently upgraded during remediation. **Reject:** policy failure does not grant upgrade authority.
14. Global setting change plus waiver expiry unexpectedly restarts all apps. **Reject:** restart consequence and target authority must be planned/proven.
15. Raw provider manifest records an exemption and becomes canonical policy truth. **Reject:** provider artifact is a projection/binding, not canonical policy authority.
16. Closing Control Center window stops an in-flight deployment. **Reject:** window/session lifecycle is independent of service/effect lifecycle.
17. Adapter maps provider “ignore” to SB waiver despite different expiry/scope semantics. **Reject:** normalization cannot fabricate equivalence.
18. Placement migration occurs during waiver transition and the service receives a new semantic identity. **Reject:** placement does not redefine service identity.
19. App-specific setting conflicts with Control Center projection; Control Center overwrites because it owns the waiver. **Reject:** exception ownership is not configuration ownership.
20. Automatic binding silently changes the exception target set after environment rebinding. **Reject:** automatic dependencies/matches remain inspectable and requalified.
21. W2 widens W1 from one Application to an Environment; old W1 effects are displayed as if originally environment-authorized. **Reject:** widened successor affects future admission only.
22. Revocation event reaches Control Center but not an autonomous runtime. UI claims immediate distributed cessation. **Reject:** effective time, observation and target fencing are distinct.
23. `Warn` policy disposition is rendered as `Compliant`. **Reject:** enforcement action does not rewrite predicate truth.
24. Modal confirmation blocks one browser document and UI claims workspace-wide freeze. **Reject:** focus/inertness is not distributed admission control.

## Saturation assessment

### Relatively mature in principle

- policy exception remains distinct from configuration, management and deployment authority;
- historical admission basis is immutable and revision-qualified;
- admission, continuation, new-effect authority and settlement are separate;
- successor waiver does not rewrite predecessor effects;
- effective-state and policy-compliance state are orthogonal;
- retry/redelivery preserves lineage;
- partial cross-application effectiveness remains first-class;
- UI/window/modal lifecycle is not service/effect lifecycle.

### Material but not saturated

- exact continuation/new-effect policy grammar for different operation classes;
- semantic diff proof for predecessor/successor exception equivalence;
- minimal barrier/drain/fence selection across heterogeneous targets;
- mitigation evidence currentness across external/co-managed systems;
- offline runtime handling of revocation with bounded autonomy;
- provider-native exemption mapping and revocation observation.

### Early material

- UX for very large partially-effective plans with mixed exception generations;
- privacy-safe aggregate reporting across many applications without excessive cross-target correlation;
- formal compatibility relation between SB policy exceptions and third-party policy engines.

## Reconciliation with G4 Web Desktop program

This research does not alter the primary hierarchy. Application Manager still separates install/adopt/register/deploy and management authority. Control Center remains a federated governance/configuration projection rather than one semantic owner/store. Declarative service definitions remain canonical intent above provider artifacts. Placement remains orthogonal to service identity. Vault bindings remain references and explicit dependencies. Desktop Observatory/Pinned Monitoring Surfaces project evidence but do not become policy/effect authority. Proprietary editors and external tools consume the same revision/currentness/evidence grammar without inheriting global ownership.

All standing invariants remain preserved:

`Install != Adopt`; `Register != Deploy`; `Connect != Own`; `Discovered != Verified`; `SecretRef != secret value`; `Policy != configuration`; `Desired != Observed != Effective`; `Configured != Applied != Effective`; `Unified UI != one semantic owner/store`; `Deployment Unit != physical server`; `Service identity != raw IP`; `Window/session lifecycle != service lifecycle`; `Automatic != hidden`; `Adapter normalization != fabricated equivalence`.

## Highest-value next gap

**Cross-application remediation planning after policy-basis loss when targets have heterogeneous reversibility and management authority.**

The next round should determine how Control Center classifies an affected set after exception expiry/revocation into `NO_ACTION_REQUIRED`, `REQUALIFY`, `CONFIG_CHANGE`, `RESTART/REDEPLOY`, `COMPENSATE`, `REMEDIATE_EXTERNAL`, `QUARANTINE_CANDIDATE`, `HUMAN_DECISION` and `UNKNOWN` without treating remediation as rollback, without granting SB authority over externally managed targets, and without allowing one target's reversible operation to imply reversibility for the whole change set. It should also reconcile remediation priority with service criticality/capacity budgets and preserve evidence of the noncompliant interval rather than rewriting history.
