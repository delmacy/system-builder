# G4 — Remediation Verification & Release-from-Quarantine Evidence Research

Status: `RESEARCH_ACTIVE / NON_EXECUTABLE`
Execution authority: NONE
Date: 2026-09-23
Scope: G4 Web Desktop & Application Environment / Control Center / Application Manager / Observatory

## Purpose

This round continues the cross-application remediation research after policy-basis loss. It studies when a target may be released from containment when provider status, runtime health, policy evaluation, configuration evidence, credential adoption and external-effect settlement are delayed, stale, contradictory or only partially observable.

This is implementation-independent P&D. It does not authorize product code, WBS, Work Packages, Sprints, TASKs, migrations or provider adoption.

## Repository boundaries reconciled

- `Builder != Runtime`; published runtimes remain autonomous.
- `Client != Workspace != Desktop Sphere != Application != Window`.
- `Window/session lifecycle != service lifecycle`.
- `Desired != Observed != Effective`.
- `Configured != Applied != Effective`.
- `Provider ACK != effective state`.
- `Policy != configuration`.
- `SecretRef != secret value`.
- `Projection/index/cache/telemetry != canonical truth`.
- `UNKNOWN` is a qualified evidence disposition, not permission to guess.
- `Automatic != hidden`.
- `Adapter normalization != fabricated equivalence`.
- `Service identity != placement != endpoint/IP`.
- `Remediation != rollback`.
- `Remediation required != remediation authorized`.

## Inputs reconciled from adjacent rounds

### :00 — Application Contribution Registry / activation containment

The shell contribution registry is declarative participation metadata rather than command/business authority. Contribution visibility, activation, residency and command executability remain separate. Lazy activation, coalescing and restore scheduling are context-qualified; Client/Workspace boundaries cannot be merged merely because an application identity matches.

Portable consequence here: an Observatory or Control Center surface becoming visible/active does not refresh remediation evidence and cannot release quarantine by UI lifecycle.

### :10 — trust rollover and proof longevity

Trust-set revisions, proof semantic identity, cryptographic envelope identity, historical verification and current admission are separate. Trust rollover creates successor revisions rather than rewriting historical proof basis. Connectivity restored does not imply trust reconciled; cryptographic renewal does not imply semantic requalification.

Portable consequence here: remediation/release evidence must bind the trust/verifier basis actually used, and trust renewal cannot silently freshen the semantic claim that a target is safe to release.

## External evidence classes and portable lessons

### E1 — Kubernetes conditions and readiness gates

Kubernetes models multiple Pod conditions independently. A Pod may be `Running` while not `Ready`. Conditions carry status including `Unknown`, transition/probe timing and, in current documentation, observed generation. Custom readiness gates require all named conditions to be true before Pod readiness becomes true; missing custom conditions do not become optimistic success.

Portable lessons:

1. one aggregate lifecycle label is insufficient for release decisions;
2. readiness may be conjunctive over explicitly named evidence claims;
3. missing evidence should fail closed for the named readiness gate rather than become inferred success;
4. evidence should identify the generation/revision it actually observed.

This is pattern evidence, not a proposal to model G4 as Kubernetes resources.

### E2 — Kubernetes readiness versus liveness

Kubernetes explicitly distinguishes readiness to receive traffic from liveness/restart behavior. Failed readiness removes a workload from ordinary Service traffic without implying that the process is dead; liveness misconfiguration can itself cause cascading failures.

Portable lesson: `HEALTHY`, `TRAFFIC_ELIGIBLE`, `POLICY_COMPLIANT`, `REMEDIATION_EFFECTIVE` and `SETTLED` must not collapse into one green status.

### E3 — Kubernetes scheduling gates

Scheduling gates separate creation/existence of a Pod from eligibility for scheduling, and gates are removed as criteria are satisfied. The mechanism is intentionally narrower than general runtime health.

Portable lesson: containment/release gates should name the admission surface they protect. `not admitted for new traffic` is not the same claim as `service stopped`, `mutation fenced`, or `historical effects settled`.

### E4 — AWS CodeDeploy alarms and rollback

CodeDeploy can use deployment failures or monitoring alarms to trigger rollback to a last known good revision. Rollback behavior is separately configurable and can be disabled. This is useful operational evidence but remains provider-specific: an alarm is a trigger, and redeployment of an earlier revision is a new operational effect rather than proof that all prior external effects vanished.

Portable lessons:

- monitoring evidence may trigger remediation without being semantic settlement evidence;
- `rollback triggered != prior reality restored`;
- release criteria cannot be inferred solely from the fact that a provider completed a rollback workflow.

## Finding 1 — release from quarantine is a new admission decision

Quarantine/containment restricts one or more effect surfaces. Releasing it is not the inverse UI gesture and not a historical rewrite.

```text
QUARANTINE_ENTERED
 -> REMEDIATION_PLANNED
 -> REMEDIATION_ADMITTED
 -> REMEDIATION_EFFECTS_OBSERVED
 -> RELEASE_EVIDENCE_QUALIFIED
 -> RELEASE_DECISION
 -> ADMISSION_SURFACE_REOPENED
```

The chain may branch, repeat or stop at `UNKNOWN`; it is not required to be one enum state machine.

Core invariants:

```text
REMEDIATION_APPLIED != RELEASE_AUTHORIZED
RELEASE_AUTHORIZED != RELEASE_EFFECTIVE
RELEASE_EFFECTIVE != HISTORICAL_EFFECTS_SETTLED
QUARANTINE_REMOVED != POLICY_COMPLIANT FOREVER
```

Release therefore needs its own decision identity, authority/currentness basis and evidence set.

## Finding 2 — quarantine is a vector of restricted surfaces, not a boolean

Candidate containment dimensions:

```text
QuarantineVector
  newRequestAdmission
  userTrafficEligibility
  backgroundJobAdmission
  mutationAuthority
  credentialUse
  externalCallbackEmission
  placementPromotion
  deploymentPromotion
  managementReconciliation
  dataWriteEligibility
```

A target may remain observable while mutation is fenced, or may remain operational for existing sessions while new admissions are closed.

```text
QUARANTINED_FOR_TRAFFIC != MUTATION_FENCED
MUTATION_FENCED != SERVICE_STOPPED
SERVICE_STOPPED != EXTERNAL_EFFECTS_SETTLED
OBSERVABLE != MUTABLE
```

The minimal containment/release scope follows the protected invariant.

## Finding 3 — release evidence is a qualified vector

Candidate evidence dimensions:

```text
ReleaseEvidenceVector
  desiredStateQualification
  configurationAppliedEvidence
  runtimeHealthEvidence
  trafficReadinessEvidence
  policyComplianceEvidence
  credentialAdoptionEvidence
  oldCredentialFencingEvidence
  placement/topologyEvidence
  externalEffectSettlementEvidence
  managementAuthorityEvidence
  trust/verifierQualification
  evidenceCurrentness
  affectedSetCoverage
```

No single dimension is a universal oracle.

```text
HEALTHY != COMPLIANT
COMPLIANT != SETTLED
SETTLED != HEALTHY
PROVIDER_READY != BUSINESS_EFFECTIVE
NO_ALERT != SAFE_TO_RELEASE
```

## Finding 4 — contradictory evidence must survive aggregation

Suppose provider status says `READY`, application health is green, policy evaluation says compliant, but credential telemetry says consumers may still be using an old credential and external-effect settlement is `UNKNOWN`.

The aggregate cannot be `GREEN` merely by majority or precedence.

Candidate dispositions:

```text
QUALIFIED_FOR_RELEASE(surface, invariant)
BLOCKED_BY_KNOWN_FAILURE
BLOCKED_BY_STALE_EVIDENCE
BLOCKED_BY_UNKNOWN
CONTRADICTORY_REQUIRES_RECONCILIATION
PARTIALLY_QUALIFIED
AUTHORITY_MISSING
```

```text
TWO_GREEN_ONE_UNKNOWN != GREEN
LATEST_TIMESTAMP != SEMANTIC_WINNER
PROVIDER_STATUS != POLICY_EVALUATION
OBSERVABILITY_CONSENSUS != BUSINESS_TRUTH
```

Contradiction is evidence about disagreement, not permission to choose the most convenient source.

## Finding 5 — evidence authority is claim-specific

Each evidence item must state what it can prove.

Candidate envelope:

```text
ReleaseEvidenceClaim
  claimId
  targetRef
  claimType
  subjectRevisionRefs[]
  environmentRef
  managementAuthorityRevisionRef?
  remediationOperationRef?
  evidenceProducerRef
  verifierQualificationRef?
  trustSetRevisionRef?
  observedAt
  effectiveInterval?
  currentnessHorizon
  coverageScope
  disposition = PASS | FAIL | UNKNOWN | STALE | CONTRADICTORY
  evidenceRefs[]
```

A provider can be authoritative for provider deployment state without being authoritative for business policy compliance. A health endpoint can report application health without proving an old external side effect did not occur.

```text
AUTHORITATIVE_FOR(A) != AUTHORITATIVE_FOR(B)
FRESH_FOR_HEALTH != FRESH_FOR_POLICY
SAME_TARGET != SAME_EVIDENCE_DOMAIN
```

## Finding 6 — evidence currentness is independent per claim

A release decision must not use a single global `lastCheckedAt` as freshness proof. Different claims have different horizons and invalidators.

Examples:

- runtime health may need seconds/minutes of freshness;
- policy compliance may be revision-invalidated;
- credential adoption may depend on consumer reload/lease state;
- external settlement may remain durable once proven, or may require stronger evidence when effects can recur;
- authority can change independently of all of the above.

```text
ONE_FRESH_CLAIM != FRESH_RELEASE_BASIS
EVIDENCE_NEWER != EVIDENCE_STRONGER
CACHE_REFRESHED != CLAIM_REQUALIFIED
```

## Finding 7 — release is invariant- and surface-scoped

The release predicate should answer a named question such as:

```text
MayReopen(userTraffic, target, invariant X)?
MayRestore(mutationAuthority, target, invariant Y)?
MayResume(backgroundJobs, target, invariant Z)?
```

A target can therefore be released for read traffic while remaining fenced for writes, or resume observation while upgrade authority remains blocked.

```text
RELEASED_FOR_READ != RELEASED_FOR_WRITE
RELEASED_FOR_TRAFFIC != RELEASED_FOR_MANAGEMENT_MUTATION
ONE_SURFACE_RELEASED != GLOBAL_QUARANTINE_CLEARED
```

This avoids global barriers when independent invariants can advance separately.

## Finding 8 — policy compliance and operational effectiveness are orthogonal

A service can be healthy/effective but noncompliant. A compliant configuration can be applied while the service is unhealthy. A remediation can restore policy compliance while an external side effect remains unsettled.

Candidate matrix dimensions remain independent:

```text
operationalEffectiveness
policyCompliance
securityAdmissibility
trafficReadiness
settlement
managementAuthority
```

The Desktop Observatory may render an aggregate summary, but it must preserve the underlying vector and uncertainty.

## Finding 9 — delayed evidence must not create temporal fiction

Observation time, effect time and decision time differ.

```text
EffectOccurredAt != EvidenceObservedAt != EvidenceVerifiedAt != ReleaseDecidedAt
```

Late evidence can justify a later decision about what was true earlier, but cannot make a release decision retroactively authorized.

If a target was reopened at T2 with insufficient evidence and proof arrives at T3 showing the remediation had actually completed at T1, the system may update historical interpretation but must retain that the T2 admission decision was made on the evidence available at T2.

```text
LATE_PROOF_OF_PRIOR_EFFECT != RETROACTIVE_AUTHORITY
HISTORICAL_TRUTH_UPDATE != DECISION_HISTORY_REWRITE
```

## Finding 10 — evidence contradiction requires typed reconciliation

Candidate contradiction classes:

```text
REVISION_MISMATCH
STALE_VS_CURRENT
PROVIDER_VS_TARGET
POLICY_VS_CONFIG
HEALTH_VS_READINESS
CREDENTIAL_SOURCE_VS_CONSUMER
PLACEMENT_VS_ROUTING
SETTLEMENT_VS_RETRY
TRUST_BASIS_MISMATCH
COVERAGE_GAP
```

Reconciliation may mean re-observe, query a stronger authority, wait for convergence, fence a source, perform targeted verification, or require human review. It must not mean `last writer wins` over evidence.

## Finding 11 — credential release requires both adoption and predecessor disposition where the invariant needs it

For secret/credential remediation:

```text
NEW_SECRET_ISSUED
 -> BINDING_RESOLVED
 -> DELIVERED
 -> CONSUMER_RELOADED/ADOPTED
 -> OLD_CREDENTIAL_REVOKED
 -> OLD_CREDENTIAL_TARGET_FENCED/EXPIRED
```

The exact required frontier depends on the protected operation. Reopening a read-only surface may not require the same proof as restoring privileged mutation.

```text
NEW_SECRET_DELIVERED != CONSUMER_USING_NEW_SECRET
OLD_SECRET_REVOKED_AT_SOURCE != OLD_SECRET_INCAPABLE_OF_EFFECT
```

The Control Center displays references/status, never secret values.

## Finding 12 — external-effect settlement may outlive operational recovery

A service can recover and become healthy while a payment, message, provisioning call, email, physical action or other external effect remains `UNKNOWN`.

Release policy must say whether that residual obligation blocks the named admission surface. The default cannot be global blocking, but neither can health erase the residual.

Candidate rule:

```text
MayRelease(surface S, invariant X)
 iff all evidence obligations capable of violating X are
     SATISFIED | PROVEN_ISOLATED | EXPLICITLY_ACCEPTED_EXCEPTION
```

`UNKNOWN` remains blocking only for the invariant/surface for which the unknown could matter.

## Finding 13 — provider ACK/readiness can contribute but cannot dominate

Provider-native status is useful evidence for placement/deployment claims. It does not become canonical service truth.

```text
PROVIDER_ACK != APPLIED
APPLIED != READY
READY != POLICY_COMPLIANT
POLICY_COMPLIANT != EXTERNAL_EFFECT_SETTLED
```

Raw manifests/provider artifacts remain compiled/exported projections. A provider status field cannot redefine G4 semantic identity or overwrite the canonical desired contract.

## Finding 14 — release authority is independent of remediation authority

The actor/system allowed to execute remediation need not be the one allowed to reopen a high-risk surface. Conversely, an operator may approve release based on independently produced evidence without owning the underlying service.

Candidate authority dimensions:

```text
mayPlanRemediation
mayExecuteRemediation
mayVerifyClaim(type)
mayAcceptResidualRisk
mayReleaseSurface(surface, invariant)
mayOverrideReleaseGate
```

```text
CAN_REMEDIATE != CAN_RELEASE
CAN_OBSERVE != CAN_VERIFY_EVERY_CLAIM
CAN_RELEASE != CAN_CHANGE_CONFIGURATION
```

This is especially important for `EXTERNALLY_MANAGED`, `CO_MANAGED` and `OBSERVE_ONLY` applications.

## Finding 15 — external/observe-only targets can complete verification without SB mutation authority

For externally managed targets, the SB may collect/verify evidence, produce findings and recommend release/remediation while never acquiring mutation authority.

Possible outcomes:

```text
VERIFIED_SAFE_FOR_DECLARED_SURFACE
VERIFIED_NONCOMPLIANT
EXTERNAL_ACTION_REQUIRED
EVIDENCE_REQUIRED
UNKNOWN
```

`Connect != Own` remains absolute. A verified external target does not become SB-managed.

## Finding 16 — release from quarantine is not UI/session lifecycle

Window close, app eviction, Desktop restore, contribution activation or Observatory pinning cannot release/fence the service.

```text
WINDOW_REOPENED != SERVICE_RELEASED
APP_RESIDENT != SERVICE_READY
CONTRIBUTION_ACTIVE != MANAGEMENT_AUTHORITY
PINNED_MONITOR_GREEN != RELEASE_PROOF
```

The :00 contribution-registry findings therefore compose cleanly: shell participation remains projection/scheduling semantics.

## Finding 17 — trust rollover can stale release evidence without making historical evidence false

Evidence binds the verifier/trust-set revision actually used. Trust rollover, compromise or algorithm retirement may change current admissibility.

```text
HISTORICALLY_VERIFIED != CURRENTLY_ADMISSIBLE_FOR_RELEASE
TRUST_RENEWED != CLAIM_SEMANTICALLY_REQUALIFIED
NEW_TRUST_ROOT != OLD_EVIDENCE_REWRITTEN
```

Where policy permits, historical evidence may remain interpretable while new release decisions require requalification under the current trust floor.

## Finding 18 — aggregate UI must expose the minority critical blocker

For large fleets, a summary such as `999/1000 healthy` must not hide the one target whose unknown credential fencing or unsettled external effect blocks the protected invariant.

Candidate aggregate dimensions:

```text
coverage
currentness
passCount
failCount
unknownCount
staleCount
contradictionCount
criticalBlockers[]
releaseEligibleCount
releaseIneligibleCount
```

```text
HIGH_PASS_PERCENTAGE != SAFE_AGGREGATE
NO_VISIBLE_ROW != NO_BLOCKER
INDEX_MISS != SEMANTIC_ABSENCE
```

This composes with the existing large-population/index completeness research.

## Finding 19 — automatic release may be allowed only when the proof obligations are explicit and inspectable

Automation is compatible with safety when the release contract is explicit, current and explainable. It must show:

- target/surface/invariant;
- required claims;
- evidence producers/verifiers;
- revision/currentness basis;
- authority for release;
- residual/unknown disposition;
- reason for every omitted claim;
- resulting admission changes.

```text
AUTOMATIC != HIDDEN
AUTO_RELEASE != HEALTHCHECK_GREEN
AUTO_RELEASE != PROVIDER_SUCCESS
```

If the evidence graph cannot prove completeness/currentness for a required claim, automatic release degrades to blocked/unknown/human decision according to policy.

## Finding 20 — no central health oracle is required

The G4 model can compose evidence without inventing one global service that owns truth. Different bounded contexts/providers retain claim authority. The Control Center and Observatory consume qualified evidence and render decision support/release state.

```text
UNIFIED UI != ONE SEMANTIC OWNER/STORE
EVIDENCE COMPOSITION != CENTRAL TRUTH OWNERSHIP
OBSERVATORY != HEALTH AUTHORITY
CONTROL CENTER != SERVICE OWNER
```

This preserves replaceability and external-tool integration.

## Candidate release proof obligations

PO-153. Every release decision identifies target, Client, Environment, protected invariant and admission surface.

PO-154. Release authority is current and independently qualified from remediation/configuration authority.

PO-155. Required evidence claims are explicit; omitted claims have an inspectable contract reason.

PO-156. Each evidence claim identifies subject revisions/generation and its own currentness horizon.

PO-157. Provider status cannot alone prove policy compliance, credential adoption or external-effect settlement.

PO-158. Runtime health cannot alone prove policy compliance or historical settlement.

PO-159. Policy compliance cannot alone prove runtime health/readiness.

PO-160. Missing required evidence becomes `UNKNOWN`/blocked for that gate rather than inferred pass.

PO-161. Contradictory authoritative evidence remains representable until reconciled or explicitly risk-accepted under authority.

PO-162. Late evidence cannot retroactively rewrite the evidence basis/authority of an earlier release decision.

PO-163. Release is surface/invariant scoped; one successful release does not clear unrelated quarantine dimensions.

PO-164. Old credential disposition is proven where the protected invariant requires predecessor fencing.

PO-165. Consumer adoption of a rotated secret is distinct from source issuance/delivery.

PO-166. External residual effects survive operational recovery until settled, isolated or explicitly accepted for the named invariant.

PO-167. `OBSERVE_ONLY` and `EXTERNALLY_MANAGED` targets cannot gain mutation authority through verification/release workflow.

PO-168. `CO_MANAGED` release respects field/operation ownership and merge law.

PO-169. Placement/routing evidence cannot change Service semantic identity.

PO-170. Window/session/Application residency and contribution activation cannot alter quarantine/service lifecycle.

PO-171. Trust/verifier rollover requalifies current release evidence when required without rewriting historical proof.

PO-172. Aggregate release views expose unknown/stale/contradictory and critical-minority blockers.

PO-173. Index/cache misses cannot prove absence of a blocker without completeness evidence.

PO-174. Automatic release remains explainable and degrades conservatively when proof completeness/currentness is insufficient.

PO-175. Raw provider manifests/status remain projections; they cannot become canonical desired or policy truth.

PO-176. Secret values never enter release evidence/diff/provenance when a `SecretRef` is sufficient.

PO-177. Adapter normalization preserves semantic differences in readiness, cancellation, fencing, settlement and evidence authority.

PO-178. A release decision records the evidence vector and policy/exception basis actually used, not a mutable `latest` alias.

## Mandatory adversarial suite

1. **Tenant leak:** Client A's green evidence is reused for Client B because both point to one endpoint. Must fail.
2. **Stale client context:** restored Workspace shows prior release eligibility after Client/Environment switch. Must requalify.
3. **Hidden secret exposure:** credential verification diff displays secret value. Forbidden; use references/dispositions.
4. **Discovered but unverified app:** discovery contributes to affected set but cannot satisfy release evidence.
5. **External app silent mutation:** external-managed app is restarted because policy is now compliant. Forbidden without authority.
6. **Global setting surprise restart:** release planner silently restarts all descendants. Consequence/authority must be explicit.
7. **Shared infrastructure authority collapse:** one host's release evidence is reused as authority for all tenants. Forbidden.
8. **Provider artifact canonicalization:** provider `Ready` overwrites canonical desired/policy state. Forbidden.
9. **UI close stops runtime:** closing quarantine panel stops or releases service. Forbidden.
10. **Adapter fabricated equivalence:** provider `Healthy` normalized to `PolicyCompliant`. Forbidden.
11. **Placement reidentity:** migrated endpoint creates a new semantic Service to escape quarantine history. Forbidden.
12. **App settings conflict:** Control Center release overwrites application-owned advanced setting. Forbidden.
13. **Hidden auto-binding:** automatic credential binding is considered effective without showing consumer adoption/dependency.
14. **Majority-green release:** 999 green targets hide one critical `UNKNOWN`. Aggregate remains qualified/blocking for the affected invariant.
15. **Late proof retroactivity:** proof arriving after release rewrites earlier decision as properly authorized. Forbidden.
16. **Trust renewal laundering:** re-signing old evidence under a new key marks semantic claim freshly verified. Forbidden without semantic requalification.
17. **Health oracle collapse:** one monitoring provider's green status clears all gates. Forbidden.
18. **Read-only/write collapse:** read traffic qualification silently reopens privileged writes. Forbidden.
19. **Old credential ambiguity:** new secret works, old secret target-side effect capability is unknown, privileged mutation reopens. Block where fencing is required.
20. **External effect erasure:** service recovered, unresolved payment/provisioning effect disappears from release view. Forbidden.
21. **Cache false absence:** stale index omits a blocking target and auto-release treats omission as proof. Forbidden.
22. **ACK laundering:** remediation API ACK is presented as applied/effective/released. Forbidden.
23. **Quarantine boolean collapse:** clearing one containment dimension removes all restrictions. Forbidden.
24. **Observe-only authority escalation:** evidence collection creates implicit mutation credential. Forbidden.

## Cross-program reconciliation

### Builder Home / Client tenancy / delegation

Release evidence and authority are Client/Environment scoped. Delegation grants only declared release/verification rights and never crosses tenant boundaries by shared endpoint, host, application identity or provider account.

### Workspace / Desktop / Window Manager

Desktop and Window Manager project release state. Restore must requalify context/currentness. UI lifecycle cannot mutate service containment.

### Application Portfolio / Application Manager

Management mode is a UX summary over operation-scoped authority. Release verification never upgrades `OBSERVE_ONLY`/`EXTERNALLY_MANAGED` into SB ownership. Install/adopt/register/deploy remain distinct.

### Control Center

Control Center may compose change/remediation/release plans and qualified evidence. It remains a federated governance/configuration projection rather than one semantic owner/store.

### Declarative Service Deployment

Typed service intent remains canonical above provider artifacts. Provider readiness contributes deployment evidence but cannot redefine service identity or semantic effectiveness.

### Hosting / Placement

Containment/release can reference placement/routing surfaces without making placement part of Service identity. Migration does not erase quarantine/effect lineage.

### Vault / Environment bindings

Secret binding evidence separates source selection, delivery, consumer adoption and predecessor disposition. `SecretRef != secret value` remains invariant.

### Desktop Observatory / Pinned Monitoring Surfaces

Pinned surfaces show qualified vectors, coverage/currentness and blockers. They are projections, not release authority or health oracles.

### Proprietary editors / trust proof foundation

Release evidence can reuse proof-envelope/trust qualification concepts while preserving claim-specific authority. Cryptographic renewal does not imply semantic requalification.

### External tools

External monitoring/deployment/policy tools may contribute evidence through adapters. Mapping is directional and qualified; adapters cannot fabricate semantic equivalence.

## Maturity and saturation

### Relatively mature in principle

- `health != compliance != settlement`;
- release is a new admission decision rather than rollback inverse;
- quarantine/release are surface/invariant scoped;
- evidence is claim-specific and independently current;
- contradiction/unknown survive aggregation;
- release authority is separate from remediation authority;
- external/observe-only verification does not create ownership;
- UI/session/provider artifacts remain projections.

### Material / not saturated

- release predicates for non-fenceable external effects;
- exact currentness laws by evidence class;
- contradiction reconciliation precedence when multiple authorities are legitimate but scoped differently;
- cross-target release partial ordering and availability budgets;
- release under partition/offline operation;
- risk-acceptance semantics for residual `UNKNOWN`.

### Early material

- provider-native readiness/compliance mapping profiles;
- external monitoring trust qualification;
- automatic release safety profiles;
- human evidence/attestation contribution to release gates.

Overall disposition: `ADVANCED_EMERGING / MATERIAL_DELTA / NON_EXECUTABLE`.

## Highest-value next gap

**Cross-application release orchestration under shared dependencies and partial evidence**: when several quarantined targets depend on the same database, gateway, Vault binding, network path or external provider, determine whether release can proceed independently, requires dependency-first qualification, or needs a bounded cohort/barrier. Research must distinguish shared dependency health from shared authority, prevent thundering-herd re-admission, preserve per-target evidence/currentness, and avoid turning dependency topology into global orchestration ownership.

The core question is not `is everything green?`; it is `which admission surfaces may reopen now, for which targets and invariants, on which current evidence and authority basis, without erasing unresolved obligations?`
