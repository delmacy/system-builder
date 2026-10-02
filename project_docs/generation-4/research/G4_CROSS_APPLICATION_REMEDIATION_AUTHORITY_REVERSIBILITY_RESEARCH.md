# G4 — Cross-Application Remediation Authority & Reversibility Research

Status: `RESEARCH_ACTIVE / NON_EXECUTABLE`
Execution authority: NONE
Date: 2026-09-23
Scope: G4 Web Desktop & Application Environment / Control Center / Application Manager / declarative service deployment

## Purpose

Consolidate the next boundary after policy-basis loss in partially effective cross-application change sets: how to classify, plan, authorize, execute and verify remediation when targets differ in management authority, placement, reversibility, observability and effect settlement.

This is P&D documentation only. It does not authorize implementation, WBS, Work Packages, Sprints, TASKs, migrations, provider adoption or product changes. The primary Web Desktop hierarchy remains `Builder Home/Factory -> Client -> Workspace -> Desktop Sphere -> Application -> Window -> View/Tab/Tool`; 3D remains an optional projection/application.

## Inputs reconciled

Repository authority remains `AGENTS.md`, `docs/architecture/MASTER_BLUEPRINT.md`, `project_docs/generation-4/README.md`, `G4_RESEARCH_STATE.md` and dedicated G4 artifacts.

Recent :00 Application Registry research establishes that registry/residency/window lifecycle is projection/resource lifecycle, not deployment, permission or management authority. `REGISTRY_ENTRY != MANAGEMENT_BINDING`; `APP EVICTED != SERVICE STOPPED`; restored UI requires context/currentness requalification.

Recent :10 editor scale/index research establishes that semantic, indexed, materialized and visible populations are independent; index misses do not prove absence; large affected sets require qualified cardinality/currentness rather than visual completeness.

The immediate predecessor, `G4_POLICY_EXCEPTION_PARTIAL_CHANGESET_TRANSITION_RESEARCH.md`, pins policy basis at admission and separates admission, continuation, new-effect authority and settlement. A successor waiver cannot rewrite historical authority or wash an older `UNKNOWN` effect into a new basis.

External evidence classes reviewed:

1. Azure Policy remediation tasks target existing non-compliant resources, have resource discovery/filtering, parallelism/failure controls and require a managed identity/roles for modifying remediation. Portable lesson: finding noncompliance and possessing remediation authority are independent.
2. Kubernetes Deployment rollback restores the Pod-template portion of an earlier Deployment revision; scaling changes do not create that revision, terminating Pods may persist, and pause suppresses new rollouts without implying reversal of effects already produced. Portable lesson: rollback scope is partial and resource-specific, not time reversal.
3. AWS Systems Manager Change Manager separates request/approval from execution, supports concurrency/error thresholds and optional rollback scripts, and records implementation history. Automation rerun creates a new execution identity even when parameters are reused. Portable lesson: remediation/retry execution identity and authorization remain explicit; repeated execution is not historical continuation by default.

No provider model is adopted wholesale.

## Finding 1 — remediation is a new qualified operation, not a synonym for rollback

A target can be noncompliant while still effective. Loss of a policy basis does not itself mutate the target.

```text
POLICY_NONCOMPLIANT != SERVICE_INEFFECTIVE
REMEDIATION_REQUIRED != REMEDIATION_AUTHORIZED
REMEDIATION_PLANNED != REMEDIATION_APPLIED
REMEDIATION_APPLIED != REMEDIATION_EFFECTIVE
```

Candidate target dispositions:

```text
NO_ACTION_REQUIRED
REQUALIFY_ONLY
CONFIG_CHANGE
RESTART_OR_RELOAD
REDEPLOY
COMPENSATE
REMEDIATE_EXTERNAL
QUARANTINE_CANDIDATE
HUMAN_DECISION
UNKNOWN
```

These are semantic planning dispositions, not implementation enums. A target may require a composition of dispositions.

## Finding 2 — reversibility is a vector, not a boolean

A service/change may be reversible along one dimension and irreversible along another.

Candidate `ReversibilityProfile` dimensions:

```text
configuration
artifact/version
schema/data
secret/credential
network/routing
placement
externalSideEffect
human/physicalEffect
```

Each dimension may be `REVERSIBLE`, `COMPENSATABLE`, `RECONSTRUCTIBLE`, `FORWARD_FIX_ONLY`, `IRREVERSIBLE`, `UNKNOWN`, qualified by evidence/currentness.

```text
ONE REVERSIBLE TARGET != CHANGE SET REVERSIBLE
ROLLBACK AVAILABLE != PRIOR REALITY RESTORABLE
CONFIG RESTORED != EXTERNAL EFFECT UNDONE
```

Kubernetes Deployment rollback is useful contradictory evidence: it rolls the Pod template to a prior revision, not every piece of surrounding or external state. G4 must therefore never infer global rollback from provider rollback vocabulary.

## Finding 3 — remediation authority is operation/target scoped and independent from finding authority

The Control Center may detect/classify noncompliance without authority to repair it.

Candidate:

```text
RemediationAuthorityBasis
  targetRef
  operationKinds[]
  managementAuthorityRevisionRef
  policyAuthorityRef
  credentialCapabilityRefs[]
  environmentRef
  placementRef?
  validity/currentness
```

```text
CAN_OBSERVE != CAN_REMEDIATE
POLICY_AUTHORITY != MANAGEMENT_AUTHORITY
FINDING_VISIBLE != MUTATION_AUTHORIZED
EXTERNAL_MANAGED != SB_REMEDIABLE
```

Azure Policy's requirement for a managed identity/roles for modifying remediation is portable evidence for this split.

`OBSERVE_ONLY` targets may legitimately end at finding/recommendation/export/evidence-request. `EXTERNALLY_MANAGED` targets may expose a provider-native/manual remediation plan without granting SB execution rights. `CO_MANAGED` remediation is restricted by field/operation ownership and merge law. `SB_MANAGED` still requires current target/credential/policy authority; the label alone is not proof.

## Finding 4 — remediation planning preserves original effect lineage

A remediation operation is causally related to the condition/effect it addresses but has a distinct effect identity.

```text
ORIGINAL_EFFECT != REMEDIATION_EFFECT
COMPENSATION != ORIGINAL_EFFECT_DELETION
REMEDIATION_RETRY != ORIGINAL_OPERATION_RETRY
```

Candidate lineage:

```text
PolicyFinding
 -> HistoricalAdmissionBasis
 -> OriginalEffect(s)
 -> RemediationDecision
 -> RemediationOperation
 -> RemediationEffect(s)
 -> VerificationEvidence
```

If the original effect remains `UNKNOWN`, remediation planning must retain that uncertainty. It cannot manufacture a known prior state merely to select an inverse operation.

## Finding 5 — minimal remediation scope follows the violated invariant

Do not remediate every descendant or every application sharing infrastructure merely because a parent policy changed.

Candidate target classification depends on:

```text
policy/predicate applicability
resolved configuration provenance
actual/effective state evidence
management authority
placement/binding dependencies
reversibility profile
in-flight/residual effects
blast-radius completeness/currentness
```

```text
SHARED INFRASTRUCTURE != SHARED REMEDIATION AUTHORITY
PARENT POLICY LOSS != EVERY DESCENDANT MUTATES
SAME ENDPOINT != SAME SERVICE IDENTITY
```

The affected set remains proof-qualified (`MATERIAL`, `PROVEN_NON_MATERIAL`, `POTENTIALLY_MATERIAL`, `UNKNOWN`). `UNKNOWN` cannot be silently omitted from remediation coverage.

## Finding 6 — quarantine is an admission/effect containment candidate, not generic stop

Quarantine may mean closing new admissions, removing traffic eligibility, reducing credentials, isolating a network path or marking an application unavailable for a specific operation. It must name the invariant and authority.

```text
QUARANTINED_FOR_X != SERVICE_STOPPED_GLOBALLY
UI_HIDDEN != QUARANTINED
WINDOW_CLOSED != EFFECT_FENCED
NETWORK_ISOLATED != HISTORICAL_EFFECT_SETTLED
```

A quarantine action can itself be disruptive or destructive and therefore requires a change/remediation plan, authority and verification. External/BYOI targets may only support advisory/manual quarantine.

## Finding 7 — restart/reload/redeploy are consequences, not interchangeable remediation verbs

A configuration repair may require no process action, a reload, restart, rolling redeploy, replacement or manual external action. The Control Center must expose the consequence before admission when knowable.

```text
CONFIGURED != APPLIED != EFFECTIVE
RESTART_ACK != NEW_CONFIG_EFFECTIVE
REDEPLOY_COMPLETE != POLICY_COMPLIANT
```

Secret remediation additionally separates new credential issuance, binding/delivery, consumer adoption, old credential revocation and target-side fencing. `SecretRef != secret value` remains invariant.

## Finding 8 — remediation plan is target-local partial order, not one global inverse transaction

Candidate `RemediationPlan`:

```text
planId
sourceFindingRefs[]
policyRevisionRefs[]
exceptionTransitionRefs[]
affectedSetProofRef
targetPlans[]
orderingConstraints[]
capacity/availabilityConstraints[]
authorityEvidenceRefs[]
reversibilityEvidenceRefs[]
unknownFrontier
currentnessBasis
```

Target plans can differ: A may be `REQUALIFY_ONLY`, B `CONFIG_CHANGE + RESTART`, C `REMEDIATE_EXTERNAL`, D `HUMAN_DECISION`, E `UNKNOWN`.

Rollout is a partial order constrained by protected invariants, capacity and authority. No global transaction or synthetic global owner is implied.

## Finding 9 — remediation completion is multidimensional

Candidate per-target result vector:

```text
planCurrentness
admissionDisposition
executionDisposition
observedDisposition
effectDisposition
policyComplianceDisposition
settlementDisposition
```

A target may be `EFFECTIVE` operationally while `POLICY_NONCOMPLIANT`; or remediation may be applied while effectiveness is `UNKNOWN`.

Aggregate completion must expose coverage/cardinality/currentness and minority critical/unknown states. This aligns with editor-scale research: visible/materialized members cannot stand in for the semantic affected population.

```text
90% REMEDIATED != ALL SAFE
NO VISIBLE FAILURE != COMPLETE COVERAGE
INDEX MISS != UNAFFECTED
```

## Finding 10 — provider-native remediation is an adapter capability, not canonical truth

Provider-native repair/rollback/runbooks can implement a qualified target plan. Provider artifacts and provider status remain projections/evidence.

```text
PROVIDER REMEDIATION TASK != CANONICAL POLICY
PROVIDER SUCCESS != SB EFFECTIVE
PROVIDER ROLLBACK != SEMANTIC TIME REVERSAL
ADAPTER NORMALIZATION != FABRICATED REVERSIBILITY
```

A raw-manifest/runbook escape hatch remains possible but must preserve opacity/lock-in/currentness warnings and cannot replace the typed service/remediation intent.

## Cross-application / Desktop reconciliation

- Builder Home/Client selection scopes all remediation discovery, plans and evidence; stale Client/Workspace context must requalify before admission.
- Application Registry may display remediation/finding badges but cannot create management authority.
- Window Manager/session lifecycle cannot stop, settle or retry remediation effects.
- Application Portfolio/Application Manager expose management/compatibility/source integrity; they do not reinterpret policy.
- Control Center coordinates settings/policy/change/remediation projections but does not become the semantic owner of application-specific configuration.
- Declarative Service Deployment compiles qualified target intent to provider artifacts; ACK remains distinct from effective state.
- Placement migration does not reidentify Service or erase remediation lineage.
- Vault bindings expose `SecretRef`/dependency/currentness without secret values.
- Desktop Observatory/Pinned Monitoring Surfaces project remediation progress/evidence; green health does not prove compliance or settlement.
- Proprietary editors may show findings/affected sets; indexes/materialization remain non-authoritative.
- External tools participate only through qualified adapters/contracts; `Connect != Own`.

## New invariants

1. `Policy noncompliance != service ineffectiveness`.
2. `Remediation required != remediation authorized`.
3. `Remediation != rollback`.
4. `Rollback available != prior reality restorable`.
5. `One reversible target != change set reversible`.
6. `Can observe != can remediate`.
7. `Policy authority != management authority`.
8. `Original effect != remediation effect`.
9. `Compensation != original effect deletion`.
10. `Quarantine != global service stop`.
11. `UI hidden/closed != effect fenced`.
12. `Restart/reload/redeploy != equivalent consequences`.
13. `Provider remediation success != semantic effectiveness`.
14. `Unknown affected/effect frontier != safe omission`.
15. `Shared infrastructure != shared remediation authority`.
16. `Remediation plan != global inverse transaction`.

All prior invariants remain intact, including `Install != Adopt`, `Register != Deploy`, `Connect != Own`, `Discovered != Verified`, `SecretRef != secret value`, `Policy != configuration`, `Desired != Observed != Effective`, `Configured != Applied != Effective`, `Unified UI != one semantic owner/store`, `Deployment Unit != physical server`, `Service identity != raw IP`, `Window/session lifecycle != service lifecycle`, `Automatic != hidden`, and `Adapter normalization != fabricated equivalence`.

## Proof obligations — PO-129..PO-152

129. Every remediation target retains Client/Environment/Application/Service identity and current management-authority revision.
130. A finding/noncompliant predicate alone cannot grant mutation authority.
131. Reversibility is qualified per effect dimension; unknown dimensions remain `UNKNOWN`.
132. A provider rollback capability cannot be generalized beyond its declared state/effect scope.
133. Original effect identity/history survives compensation/remediation.
134. `UNKNOWN` original effects survive remediation planning unless independently resolved.
135. Remediation admission requalifies policy, target, management, credential, placement and currentness evidence.
136. `OBSERVE_ONLY` cannot gain mutation authority through remediation workflow.
137. `EXTERNALLY_MANAGED` cannot be silently repaired/upgraded/restarted by SB.
138. `CO_MANAGED` remediation respects explicit field/operation ownership and merge law.
139. A quarantine action names protected invariant, exact containment scope, authority and release criteria.
140. Closing/hiding a window/application cannot count as quarantine or effect fencing.
141. Restart/reload/redeploy consequences are visible before admission where knowable; unknown consequence remains explicit.
142. Secret remediation never places secret values in plan/diff/evidence surfaces.
143. Placement migration preserves service semantic identity and original/remediation effect lineage.
144. Provider ACK/success cannot alone establish target policy compliance/effectiveness.
145. Remediation affected-set coverage carries exactness/currentness and exposes `UNKNOWN` members/frontiers.
146. Index/cache miss cannot prove a target unaffected unless completeness for that exact claim/revision is qualified.
147. Aggregate completion preserves minority blocking/unknown/stale targets.
148. Remediation retries have stable remediation effect lineage and do not become retries of the original operation.
149. Repeated/rerun remediation creates explicit execution/attempt identity and requalifies authority/currentness as required.
150. Raw provider artifacts/runbooks remain compiled/exported/opaque implementation surfaces, not canonical remediation truth.
151. Application Registry/Window Manager/Desktop Observatory remain projections and cannot mutate authority from UI lifecycle.
152. Adapter normalization preserves material differences in rollback, cancellation, fencing, idempotency, verification and settlement; otherwise equivalence is `UNKNOWN`/unsupported.

## Mandatory adversarials

1. Client A's remediation plan is restored while Client B is active: no admission without requalification.
2. App is discovered/registered but unverified: remediation cannot bootstrap verification/management authority.
3. External-managed app violates policy: SB shows finding/export/manual path, not silent upgrade.
4. Global setting causes restart on only some apps: target consequences remain explicit and heterogeneous.
5. Shared host contains two clients: host sharing does not permit cross-tenant remediation/data visibility.
6. Provider says rollback succeeded but external irreversible effect remains: prior reality is not declared restored.
7. UI window is closed during remediation: runtime operation continues/tracks independently.
8. Adapter maps provider `rollback` to semantic `reversible` despite data side effects: mapping rejected/qualified.
9. Placement migration occurs during remediation: service identity remains stable; plan becomes stale/requalified where material.
10. Application-specific setting conflicts with Control Center recommendation: ownership/provenance conflict remains visible.
11. Auto-bound secret rotates: binding rule/dependency/reload/fencing consequences remain inspectable; value remains hidden.
12. Original effect is `UNKNOWN`; remediation tries inverse operation: cannot assume original effect happened or did not happen.
13. One target supports clean rollback and 99 require forward fix: change set is not labeled reversible.
14. Policy exception expires but target remains effective/noncompliant: no implicit stop or rollback.
15. Quarantine recommendation lacks mutation authority on BYOI target: advisory/manual disposition only.
16. Index omits one critical target among 500k: incomplete index cannot prove blast-radius/remediation completeness.
17. Provider remediation task succeeds but consumer never reloads configuration: target remains not proven effective/compliant.
18. Retry of remediation after timeout: stable remediation lineage; timeout does not prove first attempt absent.

## Saturation by domain

- Remediation vs rollback/compensation: `ADVANCED_EMERGING`.
- Heterogeneous reversibility model: `MATERIAL / NOT_SATURATED`.
- Management-authority boundary: `ADVANCED_EMERGING`.
- Cross-application affected-set/partial-order planning: `ADVANCED_EMERGING`.
- Provider-native remediation mapping: `EARLY_MATERIAL`.
- Quarantine/containment semantics: `MATERIAL / NOT_SATURATED`.
- Remediation verification/settlement: `MATERIAL / NOT_SATURATED`.

Overall: `ADVANCED_EMERGING / MATERIAL_DELTA / NON_EXECUTABLE`.

## Open gaps

Highest-value next gap: **remediation verification and release-from-quarantine under delayed/contradictory evidence**. Research should determine what evidence proves a target safe/compliant enough to release admission/traffic/credential containment when provider status, service health, policy evaluation, consumer reload and external-effect settlement disagree or arrive at different times. It must preserve `health != compliance != settlement`, avoid a central health oracle, and support externally managed/observe-only targets without fabricating authority.

Secondary gaps:

- provider-specific rollback/forward-fix semantic mapping;
- remediation plan staleness under concurrent config/placement/management transitions;
- evidence retention needed to prove historical remediation without retaining secret values;
- capacity/availability constraints for quarantine at large fleet scale.
