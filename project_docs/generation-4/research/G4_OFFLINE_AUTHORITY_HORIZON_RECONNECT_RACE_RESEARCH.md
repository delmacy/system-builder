# G4 — Offline Authority-Horizon Exhaustion & Asymmetric Reconnect/Revocation Races

Status: `RESEARCH_ACTIVE / NON_EXECUTABLE`
Execution authority: NONE
Date: 2026-09-23

Scope: Generation 4 documentary P&D only. No product implementation, WBS, Work Package, Sprint, TASK, migration or provider adoption.

## 1. Research question

How should the G4 Web Desktop & Application Environment preserve autonomous-runtime safety when a published runtime, managed service or external/BYOI target approaches or crosses locally known policy, authority, credential, trust or dependency-evidence horizons while connectivity to Factory/Control Center is intermittent and the remote side may already contain revocation, policy supersession, management handoff or placement change?

This extends the local-autonomy/recontainment line. It does not make Control Center a runtime dependency and does not grant local sovereignty.

Primary interface hierarchy remains:

`Builder Home/Factory -> Client -> Workspace -> Desktop Sphere -> Application -> Window -> View/Tab/Tool`.

3D remains an optional projection/application, not a mandatory navigation foundation.

## 2. Inputs reconciled

Repository constitutional constraints remain authoritative:

- `Builder != Runtime`;
- published runtime autonomy;
- compatibility before replacement;
- replaceable suite modules;
- explicit contracts between bounded contexts;
- `AI interprets; contracts formalize; engines execute`.

Recent :00 imported-evidence research adds a directly reusable discipline: `SIGNED != TRUSTED`, `APPLICABLE != CURRENT`, producer qualification is proof-class/scope/profile bounded, and imported evidence becomes a local claim input only after local trust/applicability/currentness qualification.

Recent :10 trust-incident privacy research adds another boundary: proof continuity may survive payload deletion, disclosure is purpose-qualified, redaction/withholding/erasure/absence are distinct, and emergency/recovery authority does not suspend minimization or become unrelated business authority.

These findings matter during reconnect because a newly received remote assertion is imported evidence until locally qualified, while reconciliation records themselves remain privacy/purpose governed.

## 3. External evidence reviewed

External systems are used as semantic/adversarial grammars, not provider commitments.

### Kubernetes Lease

Kubernetes Lease records expose holder identity, acquire/renew time, lease duration and transitions. Leader-election semantics depend on observed renewal plus duration; expiry permits contenders to attempt acquisition. This is useful evidence that liveness/authority can be explicitly time-bounded and renewed, but it does not prove effect-side fencing of a stale holder.

Portable lesson:

`LEASE_EXPIRED != STALE_HOLDER_EXTERNALLY_FENCED`.

### AWS STS temporary credentials

AWS temporary credentials expire after a specified interval; after expiry requests fail and the original temporary credentials cannot simply be extended/refreshed beyond their issued interval. A new set requires a new authorization path.

Portable lesson:

`CREDENTIAL_EXPIRED != AUTHORITY_RENEWED` and `NEW_CREDENTIAL != OLD_ADMISSION_CONTINUATION_BY_DEFAULT`.

### HashiCorp Vault tokens/leases

Vault tokens can be renewable, but renewal remains bounded by maximum TTL; an explicit maximum TTL cannot later be extended for that token. Renewal can fail because a token is non-renewable, revoked or at max TTL.

Portable lesson:

`RENEWABLE != RENEWABLE_FOREVER` and `LEASE_RENEWED != POLICY_CURRENT`.

### SPIFFE SVID rotation

SPIFFE tooling monitors X.509-SVID expiry and proactively requests rotated certificates/keys, showing a mature pattern for replacing short-lived identity material before expiry. Identity-material rotation is nevertheless narrower than application policy, management authority or effect settlement.

Portable lesson:

`IDENTITY_ROTATED != BUSINESS_AUTHORITY_REQUALIFIED`.

## 4. Primary finding — horizons form a vector, not one offline TTL

Candidate horizon vector:

```text
AutonomyHorizonVector
  policyHorizon
  managementAuthorityHorizon
  securityFloorHorizon
  trust/verifierHorizon
  credentialLeaseHorizon
  exceptionWaiverHorizon
  configurationBasisHorizon
  dependencyEvidenceHorizons[]
  placementEvidenceHorizon
  clockConfidenceHorizon
  reconciliationRequiredBy?
```

Each horizon has its own source, subject, revision, invalidators and expiry semantics.

Invariants:

```text
CREDENTIAL_CURRENT != POLICY_CURRENT
POLICY_CURRENT != MANAGEMENT_AUTHORITY_CURRENT
TRUST_CURRENT != PLACEMENT_CURRENT
ONE_HORIZON_RENEWED != AUTONOMY_VECTOR_CURRENT
OBSERVED_NEWER_STATE != ALL_DEPENDENCY_DOMAINS_CURRENT
```

A single green `offline valid` badge would be semantically false.

## 5. Horizon exhaustion is operation/invariant scoped

Crossing one horizon does not imply one universal runtime state. Candidate dispositions are per operation and protected invariant:

```text
CONTINUE_WITHIN_PROVEN_SCOPE
NO_NEW_ADMISSIONS
NO_NEW_EXTERNAL_EFFECTS
SERVE_EXISTING_READS_ONLY
QUEUE_WITHOUT_EFFECT
CONTINUE_EXISTING_OBLIGATION_WITH_PINNED_BASIS
LOCAL_CONTAINMENT_REQUIRED
CREDENTIAL_REFRESH_REQUIRED
REQUALIFICATION_REQUIRED
REMOTE_AUTHORITY_REQUIRED
HUMAN_DECISION
UNKNOWN
```

Therefore:

```text
HORIZON_EXHAUSTED != SERVICE_MUST_STOP
HORIZON_EXHAUSTED != OPERATION_MAY_CONTINUE
READ_ADMISSIBLE != WRITE_ADMISSIBLE
CONTINUATION_AUTHORITY != NEW_EFFECT_AUTHORITY
```

The contract names the behavior. Availability pressure cannot silently weaken safety/security/ownership invariants.

## 6. Grace is an explicit authority construct, never hidden freshness extension

A grace interval may be legitimate for a named operation when pre-authorized by policy and bounded by invariant, subject, duration, effect class and evidence requirements.

Candidate:

```text
GraceContract
  graceId
  subjectScope
  operationScope
  protectedInvariant
  activatingCondition
  prerequisiteEvidence[]
  maxDuration
  maxAttempts/effects?
  forbiddenEffects[]
  containmentAtExhaustion
  reconciliationObligations[]
```

Invariants:

```text
GRACE != CURRENT
GRACE != CLOCK_SKEW FORGIVENESS WITHOUT BOUND
GRACE != HIDDEN POLICY WEAKENING
GRACE ACTIVATED != REMOTE REVOCATION IMPOSSIBLE
```

The UI/Observatory must render `OPERATING_UNDER_GRACE` distinctly from current authority.

## 7. Partial reconnect is a capability matrix

Connectivity returning is not binary. A runtime may reach DNS but not policy service; credential issuer but not management authority; provider but not trust transparency; Control Center UI but not canonical policy source.

Candidate reconnect matrix:

```text
ReconnectCapabilityMatrix
  transportReachable
  authenticatedChannelQualified
  trustDomainCurrent
  policyHeadResolved
  authorityHeadResolved
  credentialIssuerResolved
  placementHeadResolved
  dependencyEvidenceResolved[]
  effectSettlementSourcesResolved[]
  reconciliationChannelWritable
```

Invariants:

```text
PARTIAL_RECONNECT != FULL_REQUALIFICATION
CONTROL_CENTER_REACHABLE != CANONICAL_DEPENDENCIES_CURRENT
CREDENTIAL_ISSUER_REACHABLE != POLICY_HEAD_RESOLVED
REMOTE_READ_SUCCEEDED != RECONCILIATION_COMPLETE
```

## 8. Connectivity flapping must not become authority flapping

Repeated disconnect/reconnect can create oscillation: reopen -> discover stale/revoked state -> contain -> lose connectivity -> reopen from old cache.

Candidate rule: monotonic negative/security knowledge survives transient reconnect loss until explicitly superseded by stronger qualified evidence.

```text
CONNECTIVITY_FLAP != AUTHORITY_FLAP
LOCAL_FLOOR_RAISED != LOWERED_BY_OLDER_REMOTE_RESPONSE
REVOCATION_OBSERVED != FORGOTTEN_ON_DISCONNECT
```

Operational debounce/hysteresis may suppress churn, but:

`HYSTERESIS != AUTHORITY CURRENTNESS`.

## 9. Remote revocation learned late does not rewrite history

Let local runtime admit effect `E1` at t1 using locally current basis `A1`. Remote authority revokes/supersedes at t2, but the runtime learns this only at t3.

The model must preserve at least:

```text
revocationEffectiveAt
runtimeObservedAt
localAdmissionAt
localEffectAt?
remoteEffectObservedAt?
```

Then:

```text
REMOTE_REVOCATION_LEARNED_LATE != HISTORICAL_LOCAL_EFFECT ERASED
HISTORICALLY_LOCALLY_ADMISSIBLE != CURRENTLY_ADMISSIBLE
CURRENTLY_INADMISSIBLE != EFFECT_NEVER_OCCURRED
```

Policy may classify t1/t2/t3 races differently, but reconciliation must not manufacture a false chronology.

## 10. Renewal is domain-specific and non-transitive

A credential may renew while policy or management authority is stale. A policy snapshot may refresh while trust/verifier qualification is stale. A lease may renew while placement ownership changed elsewhere.

Candidate `HorizonRenewalEvidence` must identify:

- domain/horizon renewed;
- subject and revision;
- issuer/producer identity;
- trust qualification;
- issued/observed/verified times;
- new expiry/currentness rule;
- dependency revisions;
- whether renewal is continuation or a new authority edge.

```text
LEASE_RENEWED != POLICY_CURRENT
TOKEN_REFRESHED != MANAGEMENT_HANDOFF ABSENT
POLICY_FETCHED != TRUST CURRENT
SAME HOLDER ID != SAME AUTHORITY REVISION
```

## 11. Management handoff during partition

If remote state moves an Application from `SB_MANAGED` to `EXTERNALLY_MANAGED`, `CO_MANAGED` or a new manager while the old runtime is partitioned, the old local management basis cannot become perpetual.

Required separation:

```text
historicalManager
historicalAuthorityRevision
localContinuationHorizon
newAdmissionAuthority
remoteSuccessorManager
predecessorInflightEffects
```

Invariants:

```text
OLD MANAGER CACHED != CURRENT MANAGER
HANDOFF RECORDED REMOTELY != PREDECESSOR EFFECTS FENCED
SUCCESSOR PRESENT != PREDECESSOR EFFECTS SETTLED
RECONNECT != HANDOFF COMPLETE
```

`EXTERNALLY_MANAGED` remains protected from silent upgrade/restart/remediation.

## 12. Placement change during partition

Service semantic identity remains independent from physical placement. If remote placement migrates while a disconnected runtime retains old endpoint/binding data:

```text
SERVICE IDENTITY != RAW IP
PLACEMENT REVISION CHANGED != SERVICE REIDENTIFIED
NEW ENDPOINT PRESENT != OLD ENDPOINT FENCED
```

A reconnect must qualify placement currentness and any dual-path effect risk before admitting operations whose invariant depends on single-placement effect authority.

## 13. Secret/credential races

`SecretRef` remains a reference, never the secret value in research/state/evidence UI.

Candidate phases remain distinct:

```text
NEW_CREDENTIAL_ISSUED
BINDING_RESOLVED
DELIVERED
CONSUMER_ADOPTED
OLD_CREDENTIAL_REVOKED
OLD_CREDENTIAL_TARGET_FENCED_OR_EXPIRED
```

A partially reconnected runtime may obtain a new credential without proving policy, management or placement currentness.

```text
NEW_SECRET WORKS != OLD SECRET FENCED
NEW_SECRET ISSUED != CONSUMER ADOPTED
SECRET REF RESOLVED != BUSINESS OPERATION AUTHORIZED
```

Automatic binding must expose dependency identity, provenance, rule, horizon and consequence. `Automatic != hidden`.

## 14. Imported remote state is evidence until qualified

The recent imported-evidence work applies directly to reconnect. A remote statement is not automatically authoritative merely because it is newer, signed or returned by a familiar endpoint.

Reconnect qualification chain:

```text
remote assertion
 -> provenance/integrity
 -> producer/trust qualification
 -> subject/scope/profile match
 -> currentness
 -> semantic applicability
 -> conflict classification
 -> local reconciliation disposition
```

```text
SIGNED REMOTE HEAD != LOCALLY ADMISSIBLE HEAD
NEWER TIMESTAMP != SEMANTIC WINNER
REMOTE SOURCE REACHABLE != PRODUCER QUALIFIED
```

This prevents adapter/provider normalization from fabricating equivalence.

## 15. Imported evidence and privacy boundaries during reconnect

Reconciliation records may contain principal identity, old/new authority, placement topology, incident data, secret-adjacent metadata and external effect evidence. Recent privacy research therefore applies:

```text
RECONCILIATION EVIDENCE != PRIVACY EXEMPT
CAN VERIFY DECISION != CAN VIEW RAW PAYLOAD
REDACTED != ABSENT
ERASED != NEVER EXISTED
```

Cross-client/fleet aggregation must not turn reconnect correlation into a universal stable identity. Client A evidence cannot qualify Client B merely because provider endpoint, artifact digest or Application version matches.

## 16. Desired / observed / effective under asymmetric reconnect

Candidate state vector:

```text
DesiredStateRevision
ObservedLocalRevision
ObservedRemoteRevision
AppliedLocalRevision
EffectiveLocalEvidence
EffectiveRemoteEvidence
AuthorityBasisRevision
PolicyBasisRevision
PlacementBasisRevision
CurrentnessVector
ConflictDisposition
```

Preserve:

```text
DESIRED != OBSERVED != EFFECTIVE
CONFIGURED != APPLIED != EFFECTIVE
REMOTE ACK != EFFECTIVE SERVICE
LOCAL HEALTH != GLOBAL SETTLEMENT
```

Control Center may project and reconcile these dimensions; it does not become their semantic owner.

## 17. Declarative service deployment implications

Typed service identity remains stable across reconnect and placement change. Provider artifacts/manifests remain compiled/exported projections.

A locally cached raw/provider manifest may support inspection or a contractually authorized same-artifact restart, but:

```text
RAW MANIFEST != CANONICAL DESIRED STATE
PROVIDER ARTIFACT != SERVICE SEMANTIC IDENTITY
DEPLOYMENT UNIT != PHYSICAL SERVER
REGISTER != DEPLOY
```

A provider ACK after reconnect must not overwrite desired/observed/effective distinctions.

## 18. Application Manager implications

All management modes remain operation-scoped across reconnect:

- `SB_MANAGED`: only current, qualified SB authority may admit covered mutations.
- `EXTERNALLY_MANAGED`: observation/import/export does not grant silent upgrade/uninstall/restart.
- `CO_MANAGED`: ownership/merge/operation boundaries survive disconnection and reconnect.
- `OBSERVE_ONLY`: reconnect does not create mutation credentials or management authority.

Preserve:

```text
INSTALL != ADOPT
DISCOVERED != VERIFIED
CONNECT != OWN
UNREGISTER != UNINSTALL
```

Supply-chain/source integrity evidence is independently current; a valid credential does not qualify an artifact version.

## 19. Control Center implications

Control Center should be able to project, without owning the underlying semantics:

- horizon vector and nearest exhaustion;
- operation-by-operation offline disposition;
- grace state and basis;
- partial reconnect capability matrix;
- locally observed versus remotely asserted revisions;
- revocation/handoff/placement conflict;
- effect/settlement unknowns;
- automatic binding dependency/horizon;
- reconciliation plan and blast radius;
- evidence provenance/currentness/privacy disposition.

Global search/diff must distinguish content change, authority change, policy change, placement change, currentness change and visibility/redaction change.

A global setting must not silently trigger restart/redeploy merely because reconnect discovered drift; change planning/authority/blast-radius rules still apply.

## 20. Desktop / Window / Observatory implications

Window/session lifecycle remains independent from runtime/service lifecycle:

```text
WINDOW CLOSED != LOCAL RUNTIME STOPPED
WORKSPACE RESTORED != OLD AUTHORITY RESTORED
PINNED MONITOR GREEN != ALL HORIZONS CURRENT
```

Desktop Observatory and Pinned Monitoring Surfaces may show nearest horizon, grace, partial reconnect and reconciliation blockers, but cannot become the authority source.

## 21. Adapter honesty

Provider/adaptor semantics must expose material differences in renewal, expiry, revocation, fencing, clock assumptions and reconnect behavior.

```text
ADAPTER NORMALIZATION != FABRICATED EQUIVALENCE
PROVIDER TOKEN RENEWAL != POLICY RENEWAL
PROVIDER LEASE EXPIRY != EFFECT-SIDE FENCE PROOF
```

If a provider cannot represent a required semantic distinction, the mapping is partial/unsupported/`UNKNOWN`, not silently equivalent.

## 22. Mandatory adversarial scenarios

1. Tenant A and B share a provider; A's refreshed provider token is accidentally reused to qualify B's authority horizon.
2. A restored Workspace carries a cached `CURRENT` badge after the authority horizon expired.
3. Hidden secret metadata appears in reconnect diff/search snippets.
4. Application is discovered during reconnect and treated as verified/adopted.
5. Externally managed app receives a silent upgrade because remote desired version is newer.
6. Global setting drift discovered on reconnect triggers an unexpected restart before blast-radius/authority qualification.
7. Shared infrastructure is mistaken for shared data/management authority.
8. Provider artifact returned during reconnect is treated as canonical desired truth.
9. Closing the reconnect/conflict Window stops the local runtime.
10. Adapter maps provider lease renewal to semantic policy renewal.
11. Placement migration changes raw IP and the system reidentifies the Service.
12. App-specific setting conflicts with Control Center contribution and `latest remote` wins without resolution law.
13. Automatic Vault/environment binding introduces a critical dependency that is absent from the horizon vector.
14. Credential renews successfully while policy horizon is already expired.
15. Remote revocation occurred during partition but is learned after a local effect.
16. Connectivity flap repeatedly reopens admissions from an old cache.
17. Grace interval is silently extended every time transport briefly reconnects.
18. Local clock uncertainty makes expiry ordering ambiguous but the runtime assumes validity.
19. Remote management handoff is learned after old manager admitted an effect.
20. Remote placement moved while old endpoint can still accept writes.
21. Signed remote head comes from a producer no longer qualified for this claim class.
22. Reconciliation evidence is copied across Client boundaries because artifact digest matches.
23. Raw incident/reconnect payload erased by retention policy is interpreted as `no conflict existed`.
24. Observe-only target receives mutation credentials during reconciliation.
25. Co-managed target uses last-writer-wins after reconnect despite field/operation ownership boundaries.
26. Provider ACK says deployment succeeded but effective-service evidence is stale.
27. Temporary credential expires; runtime queues effect and later redelivers it as a new operation rather than preserving lineage.
28. Policy head is current but verifier/trust horizon is stale; runtime admits new effect anyway.
29. Emergency trust-recovery authority is reused as ordinary business-effect authority.
30. New credential works, but old credential remains effective at the target; UI declares rotation complete.

## 23. New invariants

1. `Offline autonomy != local sovereignty`.
2. `One horizon renewed != autonomy vector current`.
3. `Horizon exhausted != universal service stop`.
4. `Grace != current`.
5. `Grace != hidden policy weakening`.
6. `Partial reconnect != full requalification`.
7. `Connectivity flap != authority flap`.
8. `Remote revocation learned late != historical local effect erased`.
9. `Lease renewed != policy current`.
10. `Identity rotated != business authority requalified`.
11. `Old manager cached != current manager`.
12. `New endpoint present != old endpoint fenced`.
13. `New credential works != old credential fenced`.
14. `Signed remote head != locally admissible head`.
15. `Reconciliation evidence != privacy exemption`.
16. `Window/session lifecycle != service lifecycle`.
17. `Provider lease expiry != effect-side fence proof`.
18. `Observed newer state != all dependency domains current`.

## 24. Proof obligations — PO-261..PO-290

- **PO-261** Prove every offline admission identifies the exact locally observed policy/authority/trust/credential/currentness basis used.
- **PO-262** Prove horizon renewal in one domain cannot silently renew another domain.
- **PO-263** Prove horizon exhaustion is evaluated per operation/invariant rather than as a global online/offline boolean.
- **PO-264** Prove grace is explicitly authorized, bounded, visible and distinguishable from current authority.
- **PO-265** Prove transient reconnect cannot reset or extend grace without an explicit qualified renewal.
- **PO-266** Prove partial reconnect cannot yield full requalification when required domains remain unresolved.
- **PO-267** Prove monotonic revocation/security-floor knowledge survives connectivity flapping and restart unless superseded by stronger qualified evidence.
- **PO-268** Prove late revocation discovery preserves historical local admission/effect chronology and does not erase or fabricate effects.
- **PO-269** Prove a renewed credential does not admit an operation whose policy or management authority is stale.
- **PO-270** Prove local clock uncertainty degrades expiry-sensitive authority to an explicit disposition rather than optimistic validity.
- **PO-271** Prove remote management handoff cannot be normalized to predecessor effect settlement.
- **PO-272** Prove `EXTERNALLY_MANAGED` reconnect cannot silently upgrade/restart/uninstall/remediate the target.
- **PO-273** Prove `OBSERVE_ONLY` reconnect cannot mint mutation credentials or management authority.
- **PO-274** Prove `CO_MANAGED` reconciliation preserves field/operation ownership and merge law; no implicit last-writer-wins.
- **PO-275** Prove placement migration preserves semantic Service identity while separately qualifying old-path fencing.
- **PO-276** Prove new credential issuance/adoption remains separate from old credential target-side fencing/expiry.
- **PO-277** Prove `SecretRef`/reconnect evidence never exposes secret values through search, diff, telemetry, accessibility metadata or audit payloads.
- **PO-278** Prove every automatic Environment/network/storage/Vault/placement binding material to offline behavior appears in dependency/horizon explanation.
- **PO-279** Prove imported remote state passes provenance/trust/scope/profile/currentness qualification before changing local admission disposition.
- **PO-280** Prove a newer timestamp/version cannot by itself win reconciliation.
- **PO-281** Prove Client/Environment evidence and authority cannot cross tenant boundaries because provider/artifact/application identity happens to match.
- **PO-282** Prove erased/redacted/withheld reconnect evidence is not interpreted as semantic absence or equality.
- **PO-283** Prove provider artifacts/raw manifests remain projections and cannot become canonical desired truth after reconnect.
- **PO-284** Prove provider ACK remains distinct from effective service and policy compliance.
- **PO-285** Prove closing/unpinning/restoring Desktop/Window surfaces cannot alter runtime containment, admission or settlement.
- **PO-286** Prove global setting drift discovered on reconnect goes through scoped change planning/blast-radius/authority qualification before mutation.
- **PO-287** Prove queued/retried offline obligations preserve stable operation/effect lineage rather than becoming new work after reconnect.
- **PO-288** Prove emergency trust/recovery authority cannot be reused as ordinary business-effect authority.
- **PO-289** Prove adapter mappings preserve material differences in expiry, renewal, revocation, fencing and clock assumptions or degrade to partial/unsupported/`UNKNOWN`.
- **PO-290** Prove a reconnect completion disposition states unresolved effect/settlement/currentness domains rather than collapsing them into one `synced` boolean.

## 25. Contradictions/trade-offs

### Availability vs bounded authority

Longer offline horizons improve availability but increase exposure to unseen revocation/policy change. Shorter horizons reduce that exposure but can unnecessarily degrade autonomous runtimes during benign partitions. No universal TTL is justified; horizons must be risk/operation/invariant scoped.

### Grace vs semantic honesty

Grace can be operationally valuable but becomes dangerous if rendered as currentness. The product must expose grace as a separate authority state and preserve its activating basis.

### Credential renewal vs semantic requalification

Provider-native renewal mechanisms are convenient and mature, but they normally speak only for credential/lease validity. Treating them as policy/management renewal would fabricate authority.

### Reconnect speed vs proof completeness

Aggressive reopening improves recovery time but risks admitting work before policy, trust, placement or effect-settlement domains are current. Minimal-cut requalification can reduce latency without inventing a global barrier, but requires explicit proof of irrelevance for omitted domains.

### Privacy minimization vs forensic/reconciliation proof

Reconciliation evidence can be sensitive. Retention/minimization may make later requalification impossible. The correct outcome is explicit loss of proof capability, not unlimited retention or fabricated historical certainty.

## 26. Architecture gaps after this round

Still unresolved/not saturated:

1. formal clock-quality model for expiry ordering under drift/rollback/suspend/resume;
2. exact operation classes eligible for pre-authorized grace;
3. minimal-cut algorithm/proof for partial reconnect requalification;
4. handling remote revocation whose effective time itself is disputed/unknown;
5. effect-side fencing when providers expose only lease/token expiry;
6. cross-provider semantics for renewal vs replacement vs re-authorization;
7. privacy-preserving reconciliation summaries when raw incident evidence is erased;
8. offline management handoff where predecessor and successor both produced non-fenceable effects;
9. placement migration reconciliation with dual writable endpoints;
10. UI semantics for `CURRENT`, `GRACE`, `EXPIRED`, `REVOKED`, `STALE`, `UNKNOWN` across hundreds/thousands of targets without hiding critical minorities.

## 27. Saturation assessment

| Domain | Maturity | Saturation |
|---|---|---|
| independent horizon vector | ADVANCED_EMERGING | HIGH-MATERIAL, not saturated |
| operation-scoped horizon exhaustion | ADVANCED_EMERGING | HIGH-MATERIAL, not saturated |
| explicit grace semantics | MATERIAL | not saturated |
| partial reconnect matrix | ADVANCED_EMERGING | not saturated |
| late revocation chronology | ADVANCED_EMERGING | not saturated |
| credential renewal vs semantic authority | ADVANCED_EMERGING | relatively mature in principle |
| management handoff under partition | MATERIAL | not saturated |
| placement/dual-path reconnect | MATERIAL | not saturated |
| privacy-qualified reconciliation evidence | MATERIAL | not saturated |
| provider-native mapping | EARLY_MATERIAL | not saturated |

No domain is declared fully saturated.

## 28. Next highest-value gap

**Clock-quality / temporal-authority semantics under suspend/resume, wall-clock rollback, NTP correction and uncertain revocation effective time.**

The next round should determine which temporal claims require monotonic elapsed time, trusted wall time, signed remote time, lease-relative time or explicit uncertainty; how a runtime behaves after VM/container suspend longer than a horizon; how backward wall-clock jumps avoid resurrecting expired authority; and how to compare `revocationEffectiveAt`, `runtimeObservedAt`, `effectAt` and `credentialExpiry` when clocks are not demonstrably comparable.

Required invariants for that round include:

```text
WALL CLOCK MOVED BACK != AUTHORITY RESTORED
PROCESS SUSPENDED != HORIZON PAUSED
NTP SYNC != HISTORICAL EVENT REORDERED
REMOTE TIMESTAMP != TRUSTED TIME WITHOUT QUALIFICATION
UNKNOWN CLOCK ORDER != SAFE ORDER
```
