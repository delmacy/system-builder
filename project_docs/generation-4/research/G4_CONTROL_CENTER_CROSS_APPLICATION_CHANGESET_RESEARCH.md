# G4 — Control Center Cross-Application Change-Set Conformance Research

Status: `RESEARCH_ACTIVE / NON_EXECUTABLE`
Execution authority: NONE
Date: 2026-09-22
Scope: G4 Web Desktop & Application Environment — Control Center / Application Manager / declarative deployment / placement / Vault bindings / Observatory

## Purpose

Continuation of `G4_APPLICATION_MANAGEMENT_INFLIGHT_EFFECT_HANDOFF_RESEARCH.md` for its highest-value open gap: one Control Center policy/configuration change affecting many applications/services with mixed management authority, placements, environment bindings, secret dependencies, restart/redeploy requirements and partially observable effects.

This is P&D documentation only. It does not authorize implementation, WBS, Work Packages, Sprints, TASKs, migrations, provider adoption or product changes.

## Repository inputs reconciled

- Constitutional boundaries: `Builder != Runtime`, runtime autonomy, compatibility before replacement, replaceable suite modules and explicit bounded-context contracts.
- Application-management handoff: authority revision and effect identity are orthogonal; admission and settlement frontiers are separate; predecessor effects survive handoff; `UNKNOWN` remains representable.
- Recent :00 support-intervention research: Fleet/Builder observability does not imply client mutation authority; intervention is scoped, attributable and risk-qualified.
- Recent :10 editor research: qualification reuse requires a semantic proof key; cache-key completeness is itself qualified; runtime effect lineage starts from immutable publish basis; `ACK != EFFECTIVE`.
- Existing desktop rules: `Unified UI != one semantic owner/store`, `Policy != configuration`, `Desired != Observed != Effective`, `Automatic != hidden`.

## External evidence and portable lessons

### AWS CloudFormation change sets

CloudFormation change sets separate preview from execution and show additions/modifications/replacements before mutation. AWS explicitly recommends change sets for critical resources because apparently small configuration changes may replace resources. Portable lesson: a plan is evidence about a proposed effect set, not permission to execute it, and destructive/replacement consequences must be visible before admission.

### Terraform targeting

Terraform warns that resource targeting can produce an incomplete plan and is not suitable for routine use. Portable lesson: a deliberately narrowed affected set is not proof that dependencies outside that set are unaffected. If completeness cannot be established, blast-radius disposition must widen or remain `UNKNOWN`.

### Kubernetes rolling updates

Kubernetes rolling updates bound unavailable and surge capacity and expose stalled progress separately from desired state. Portable lesson: rollout sequencing/capacity policy is independent from semantic ownership, and a progress deadline is observation of stalled rollout rather than proof of rollback, cancellation or effective state.

These are pattern sources only; no provider adoption is implied.

## Core finding — a cross-application change set is a coordination envelope, not a transaction

Candidate:

```text
CrossApplicationChangeSet
  changeSetIdentity
  clientRef
  workspaceRef?
  environmentScope[]
  initiatingIntentRef
  initiatingAuthorityRef
  policyRefs[]
  configurationDeltas[]
  candidateTargets[]
  affectedSetProofRef
  unknownFrontier[]
  perTargetPlans[]
  rolloutPlanRef
  approvalEvidenceRefs[]
  observationRefs[]
  effectiveSummaryRef?
```

The envelope coordinates independently owned target plans. It does not become their semantic owner and does not imply atomic commit.

```text
CHANGE SET != GLOBAL TRANSACTION
CONTROL CENTER COORDINATES != CONTROL CENTER OWNS TARGET SEMANTICS
PLAN CREATED != PLAN AUTHORIZED != EFFECT ADMITTED
ALL TARGETS ACKNOWLEDGED != ALL TARGETS EFFECTIVE
```

## Affected-set proof is conservative and claim-relative

A global configuration/policy change needs a typed dependency closure rather than string/path matching.

Candidate dependency dimensions:

```text
CONFIG_INHERITANCE
POLICY_CONSTRAINT
APPLICATION_SETTING_BINDING
SERVICE_BINDING
SECRET_BINDING
NETWORK_BINDING
STORAGE_BINDING
PLACEMENT_BINDING
RESTART_RELOAD_CONSEQUENCE
REDEPLOY_CONSEQUENCE
AUTHORITY_SCOPE
OBSERVABILITY_DEPENDENCY
EXTERNAL_TOOL_BINDING
```

For each candidate target:

```text
ImpactDisposition
  MATERIAL
  PROVEN_NON_MATERIAL
  POTENTIALLY_MATERIAL
  UNKNOWN
```

A target can be excluded only with qualified non-impact evidence for the named change/invariant. Missing graph/provenance information is not non-impact evidence.

```text
NOT DISCOVERED AS AFFECTED != PROVEN UNAFFECTED
TARGETED SUBSET != COMPLETE BLAST RADIUS
UNKNOWN BLAST RADIUS != ZERO BLAST RADIUS
```

This aligns cross-application planning with the existing G4 rule that invalidation/affected-set calculation is an optimization over truth.

## Plan identity and staleness

A plan must bind the facts against which it was computed.

Candidate:

```text
ChangePlanBasis
  intentDigest
  targetIdentitySetDigest
  dependencyClosureDigest
  desiredRevisionRefs[]
  observedEvidenceRefs[]
  managementAuthorityRevisionRefs[]
  placementRevisionRefs[]
  secretBindingRevisionRefs[]
  policyRevisionRefs[]
  validator/plannerIdentity
  plannerVersion
  basisCurrentness
```

If a material basis changes before execution, the old plan becomes stale or requires scoped requalification.

`same requested value != same executable plan`.

A newly discovered application, authority handoff, placement migration or secret-binding change can invalidate the plan even when the user-facing setting value is unchanged.

## Per-target authority remains local

Every target plan retains its own authority and management disposition:

```text
TargetChangePlan
  targetIdentity
  targetKind
  managementModeProjection
  requiredAuthorityVector
  authorityEvidenceRef
  desiredDelta
  expectedConsequences[]
  restart/reload/redeploy/rotation effects[]
  placementConsequences[]
  providerCompilationRef?
  admissionPreconditions[]
  verificationContract
  rollback/remediationContract
```

A global approval cannot manufacture target-local authority.

```text
GLOBAL CHANGE AUTHORIZED != EVERY TARGET MUTATION AUTHORIZED
SB_MANAGED TARGET != EXTERNALLY_MANAGED TARGET
OBSERVE_ONLY != MUTATE
CO_MANAGED != CONCURRENT WRITE PERMISSION
```

Externally managed targets may yield recommendations/exported plans rather than admitted effects unless explicit target authority exists.

## Policy and configuration remain separate

A policy change can constrain whether a configuration is admissible without itself becoming the configuration value.

Examples:

- policy requires TLS minimum X; application retains its owned TLS setting;
- policy forbids public exposure; deployment/network binding remains independently owned;
- policy requires credential rotation horizon; Vault/consumer binding remains separately observable/effective.

```text
POLICY APPLIES != CONFIG VALUE WRITTEN
POLICY COMPLIANT != CONFIG EFFECTIVE
CONFIGURED != APPLIED != EFFECTIVE
```

## Rollout is a partial order over target plans

A cross-application rollout should not default to serial-all or parallel-all. Candidate constraints include:

- explicit semantic dependencies;
- capacity/isolation budgets;
- management handoff frontiers;
- secret rotation order;
- provider/placement constraints;
- availability/error-budget constraints;
- canary/ring cohorts;
- human approval gates for high-risk transitions.

Candidate:

```text
RolloutPlan
  cohorts[]
  orderingConstraints[]
  concurrencyBudgets[]
  availabilityBudgets[]
  stopConditions[]
  promotionEvidence[]
  perTargetVerification[]
```

`same cohort != same semantic owner` and `rollout order != business priority`.

Kubernetes-style surge/unavailability budgets are useful pattern evidence for bounded rollout, but those capacity knobs do not prove application-level semantic safety.

## Partial effectiveness is first-class

Each target independently moves through evidence-backed dispositions such as:

```text
PLANNED
AUTHORIZED
ADMITTED
ACKNOWLEDGED
OBSERVED
EFFECTIVE
PARTIAL
FAILED
UNKNOWN
REMEDIATION_REQUIRED
```

This is not required to be one universal implementation enum. The architectural requirement is that the Control Center cannot collapse mixed outcomes into one green boolean.

```text
90% EFFECTIVE != CHANGE SET EFFECTIVE FOR EVERY INVARIANT
ACK SUCCESS RATE != EFFECTIVENESS RATE
HEALTH GREEN != CONFIGURATION EFFECTIVE
```

An aggregate status is a projection over target evidence with explicit coverage/currentness.

## Rollback and remediation are target/effect scoped

Rollback is not guaranteed to restore prior reality. Some changes are irreversible, externally observed, involve data migration, credential revocation or replacement resources.

Candidate per-target disposition:

```text
REVERSIBLE
COMPENSATABLE
REDEPLOYABLE_TO_PRIOR_REVISION
MANUAL_REMEDIATION
NON_REVERSIBLE
UNKNOWN
```

A failed cohort may pause successor cohorts without pretending already-effective targets were rolled back.

```text
STOP ROLLOUT != ROLLBACK
ROLLBACK REQUESTED != PRIOR STATE RESTORED
COMPENSATION != TIME REVERSAL
```

## Secrets and automatic bindings

Change planning carries `SecretRef`, binding identity and consequence metadata, never secret values. A plan should expose whether a change requires rotation, consumer reload/restart, rebinding or target-side fencing.

```text
AUTOMATIC BINDING != HIDDEN DEPENDENCY
SECRET REF IN PLAN != SECRET VALUE IN PLAN
ROTATION ACK != CONSUMER USING NEW SECRET
```

Redaction must not erase dependency visibility.

## Declarative deployment / provider compilation

Provider artifacts are generated after target qualification from typed semantic intent. A target may compile to different provider artifacts because placement/provider capabilities differ.

```text
ONE CHANGE INTENT != ONE RAW MANIFEST
PROVIDER ARTIFACT != CANONICAL CHANGE SET
PROVIDER ACK != EFFECTIVE TARGET
DEPLOYMENT UNIT != PHYSICAL SERVER
SERVICE IDENTITY != RAW IP
```

Raw-manifest escape hatches remain opaque/qualified inputs and cannot become the canonical cross-application dependency model.

## Desktop Observatory and intervention surfaces

Control Center, Desktop Observatory, Pinned Monitoring Surfaces and Support Intervention Window may all project the same change-set/effect evidence, but UI location does not change ownership.

- Control Center: plan/diff/provenance/authority/rollout projection.
- Observatory: observed/effective/currentness projection.
- Support Intervention Window: bounded exceptional action surface with separate step-up authority.
- Application-specific advanced settings: authoritative application adapter/surface where declared, not silently overridden by Control Center presentation.

```text
UNIFIED UI != UNIFIED AUTHORITY
WINDOW CLOSE != EFFECT CANCELLATION
SUPPORT VISIBILITY != SUPPORT MUTATION AUTHORITY
NOTIFICATION != AUTHORIZATION
```

## Mandatory adversarial reconciliation

- tenant leak: every plan/evidence reference is Client/Environment scoped; cross-client batching cannot merge authority or data.
- stale client context: plan basis pins client/workspace/environment and current authority revisions; restored UI context does not restore authority.
- hidden secret exposure: only references/redacted evidence enter plans and diffs.
- app discovered but unverified: discovery may expand candidate blast radius but never grants mutation authority.
- externally managed app silently upgraded: target plan cannot admit upgrade without explicit authority.
- global setting triggers unexpected restart: restart/reload/redeploy consequences are material plan outputs before admission.
- shared infrastructure mistaken for shared data/authority: placement co-residency is not semantic ownership or tenant authority.
- provider artifact becomes canonical truth: forbidden; artifacts are compiled projections.
- UI close stops runtime: forbidden; effect lineage survives UI/session lifecycle.
- adapter fabricates semantic equivalence: unknown/unsupported guarantee differences remain explicit.
- placement migration changes semantic identity: forbidden; placement transition is orthogonal.
- app-specific settings conflict with Control Center: provenance/ownership/conflict law decide; screen location does not.
- automatic binding hides critical dependency: binding source, target, rule, authority and consequence remain inspectable.

## New proof obligations

PO-49. Every cross-application change set binds a specific Client/environment scope and cannot reuse authority/evidence from another tenant context.

PO-50. Affected-set exclusion requires qualified non-impact evidence; absence from discovery/index/graph is insufficient.

PO-51. Blast-radius completeness has an explicit disposition; incomplete/unknown dependency closure cannot be rendered as complete.

PO-52. Plan execution requalifies materially changed basis dimensions rather than applying a stale preview.

PO-53. Global approval does not manufacture target-local mutation/upgrade/delete/restart/secret/placement authority.

PO-54. Every admitted target effect retains its own effect identity and authority revision across staged rollout.

PO-55. Restart/reload/redeploy/rotation/replacement consequences are visible before admission where knowable; unknown consequence remains explicit.

PO-56. Externally managed/observe-only targets cannot be silently mutated because they appear in a global change set.

PO-57. Aggregate status exposes coverage/currentness and cannot collapse PARTIAL/FAILED/UNKNOWN target outcomes into global EFFECTIVE.

PO-58. Rollout stop does not fabricate rollback; already-effective effects remain historical/effective until separately changed or remediated.

PO-59. Rollback/remediation capability is target/effect scoped and qualified before being offered as safe recovery.

PO-60. Secret values never enter cross-application plan/diff/evidence artifacts; secret dependency and consequence remain visible through references.

PO-61. Provider/controller ACK cannot prove target semantic effectiveness or cross-application completion.

PO-62. Placement co-residency/shared infrastructure cannot be used as proof of shared data, authority or safe rollout coupling.

PO-63. Raw provider artifacts/manifests cannot become the canonical dependency graph or semantic change intent.

PO-64. Automatic binding/reconciliation records provenance and does not hide material dependency, authority or restart/redeploy consequences.

PO-65. A plan narrowed by explicit targeting remains incomplete unless independent proof establishes the omitted region is non-material.

PO-66. Support/intervention authority is independently qualified and cannot be inferred from fleet observability or Control Center visibility.

PO-67. Application-specific settings retain declared ownership/provenance even when edited through a unified Control Center surface.

PO-68. Adapter normalization preserves provider capability differences relevant to replacement, restart, cancellation, fencing, rollback and effect verification.

## Contradictions / trade-offs

### Complete blast-radius proof vs practical discovery

Perfect dependency knowledge is unrealistic with external systems and opaque provider behavior. Resolution: conservative candidate closure, typed evidence, explicit `UNKNOWN`, targeted probes/requalification and human review rather than false completeness.

### Fast rollout vs strong verification

Waiting for full semantic verification after every target can be too slow. Parallelism/canaries are acceptable only under declared budgets and independent invariants. Provider ACK or health alone cannot substitute for the verification contract.

### Global consistency vs autonomy

A global transaction would simplify UI but violate heterogeneous ownership, external management and autonomous-runtime boundaries. Resolution: coordinated partial order with per-target authority/effect lineage and explicit partial effectiveness.

### Easy rollback vs irreversible reality

Some systems support revision rollback; others perform irreversible external/data/security effects. Resolution: distinguish rollback, compensation and remediation; never advertise universal undo.

## Maturity / saturation

`CONTROL_CENTER_CROSS_APPLICATION_CHANGESET = ADVANCED_EMERGING / MATERIAL_DELTA / NON_EXECUTABLE`.

Materially mature principles:

- change set is coordination envelope, not transaction or semantic owner;
- blast radius is a typed proof problem with explicit unknown frontier;
- plan preview and execution are separate authority/currentness boundaries;
- target-local authority/effect identity survives global orchestration;
- rollout is a constrained partial order, not necessarily serial or global-parallel;
- partial effectiveness is first-class;
- rollback/compensation/remediation are distinct;
- provider artifacts and aggregate UI remain projections.

Not saturated:

1. exact portable representation of cross-app dependency/impact rules;
2. blast-radius proof when external tools expose incomplete topology/configuration;
3. canary cohort selection under correlated failure domains;
4. rollout re-planning after mid-flight authority/placement changes;
5. cross-application config inheritance when ownership/provenance conflicts;
6. quantitative capacity/availability budgets across heterogeneous placements;
7. how policy exceptions/waivers compose across many targets without becoming global bypass.

## Next highest-value gap

**Cross-application configuration inheritance/provenance conflict semantics**: formalize how Client/Workspace/Environment/application/service scopes contribute defaults, policy constraints and owned settings; distinguish inheritance from copy/materialization; represent explicit unset/inherit/override; resolve app-specific settings against Control Center projections; prove which targets a parent-scope change affects; and preserve provenance/currentness through external/co-managed systems without making the Control Center a global settings database or semantic owner.
