# G4 — Temporal Authority, Clock Quality & Suspend/Resume Research

Status: `RESEARCH_ACTIVE / NON_EXECUTABLE`
Execution authority: NONE
Date: 2026-09-23

## Scope

This round continues the G4 Web Desktop & Application Environment consolidation after `G4_OFFLINE_AUTHORITY_HORIZON_RECONNECT_RACE_RESEARCH.md`. It studies clock-quality and temporal-authority semantics under suspend/resume, wall-clock rollback/step, NTP correction, offline operation, late revocation and timestamps that are not demonstrably comparable.

This is documentary P&D only. It does not authorize implementation, provider selection, WBS, Work Packages, Sprints, TASKs, migrations or product changes.

Primary hierarchy remains a research candidate:

`Builder Home/Factory -> Client -> Workspace -> Desktop Sphere -> Application -> Window -> View/Tab/Tool`.

3D remains an optional projection/application, not the navigation foundation.

## Repository boundaries preserved

- `Builder != Runtime`; published runtimes remain autonomous.
- `Install != Adopt`; `Register != Deploy`; `Connect != Own`; `Discovered != Verified`.
- `SecretRef != secret value`; `Policy != configuration`.
- `Desired != Observed != Effective`; `Configured != Applied != Effective`.
- `Unified UI != one semantic owner/store`.
- `Deployment Unit != physical server`; `Service identity != raw IP`.
- `Window/session lifecycle != service lifecycle`.
- `Automatic != hidden`; `Adapter normalization != fabricated equivalence`.
- `UNKNOWN` remains an evidence disposition, never permission to guess.

## Inputs reconciled

The immediately preceding :20 research established that offline autonomy is a vector of independent horizons rather than one TTL, that partial reconnect does not imply full requalification, and that late revocation must preserve historical local knowledge rather than rewrite it.

The recent :00 evidence-portability research adds an important tenant boundary: portable evidence is a qualified relation and `same artifact != same tenant context`; cache/index/background work must carry Client/Workspace scope. Temporal evidence therefore cannot be reused across Clients merely because a timestamp or digest matches.

The recent :10 emergency-recovery custody research adds another temporal boundary: recovery material and recovery policy have mutually pinned but independent currentness, and possession of cryptographic material cannot extend expired policy authority. Recovery ceremonies therefore also require qualified time evidence rather than a bare wall-clock timestamp.

## External evidence reviewed

### Linux clock semantics

Linux documents a material distinction between clock domains: `CLOCK_MONOTONIC` is not affected by discontinuous wall-clock changes but does not count system suspend time, while `CLOCK_BOOTTIME` includes suspend time. `CLOCK_REALTIME` is affected by discontinuous system-clock changes. This is strong evidence that one timestamp source cannot safely serve every temporal claim.

Portable lesson, not technology binding:

`MONOTONIC_ELAPSED != SUSPEND_AWARE_ELAPSED != CIVIL/WALL_TIME`.

### RFC 8915 — Network Time Security

NTS authenticates NTP time synchronization and protects request/response consistency and replay properties. It also explicitly discusses bootstrapping when local time may initially be wrong and recommends retaining previously synchronized time so certificate validation cannot silently roll backward. NTS does not turn a received timestamp into universal business authority.

Portable lesson:

`AUTHENTICATED_TIME_SOURCE != UNIVERSAL_TEMPORAL_AUTHORITY`.

`TIME_SYNC_SUCCESS != HISTORICAL_EVENT_REORDERED`.

### Mature lease/expiry patterns already reviewed

Vault token/lease limits and Kubernetes lease/election semantics from the preceding round remain relevant: expiry/renewal is bounded by the semantics of the specific lease and does not prove effect-side fencing, policy currentness or management authority. This round therefore treats time as evidence consumed by a named contract rather than a global oracle.

## Primary finding — temporal claims require a clock-domain contract

A temporal predicate is incomplete unless it names what kind of time it requires.

Candidate `TemporalBasis`:

```text
TemporalBasis
  basisId
  clientId
  environmentId
  subjectRef
  clockDomain
  clockInstanceId
  bootSessionId?
  monotonicAnchor?
  wallTimeAnchor?
  remoteTimeAuthorityRef?
  uncertaintyBound?
  lastQualifiedAt
  qualificationEvidenceRefs[]
  invalidators[]
  disposition
```

Candidate clock domains:

```text
MONOTONIC_PROCESS_OR_BOOT
SUSPEND_AWARE_ELAPSED
QUALIFIED_WALL_TIME
AUTHENTICATED_REMOTE_TIME
LEASE_RELATIVE_TIME
EVENT_CAUSAL_ORDER
UNKNOWN_OR_UNQUALIFIED
```

These are semantic classes, not API names.

Invariants:

```text
WALL_CLOCK_TIME != ELAPSED_TIME
MONOTONIC_ORDER != CROSS_HOST_ORDER
REMOTE_TIMESTAMP != TRUSTED_TIME
SIGNED_TIMESTAMP != COMPARABLE_TIMESTAMP
CLOCK_SYNCED_NOW != CLOCK_WAS_CORRECT_THEN
```

## Suspend/resume is a temporal discontinuity boundary

A runtime may be suspended while its process-local monotonic clock appears not to advance. Authority, policy, credential and waiver horizons must not silently pause unless their contracts explicitly define pause semantics.

Hard rules:

```text
PROCESS_SUSPENDED != HORIZON_PAUSED
VM_RESUMED != PRE_SUSPEND_EVIDENCE_CURRENT
PROCESS_UPTIME != REAL_ELAPSED_TIME
```

On resume, every horizon whose safety depends on elapsed real time requires requalification against a suspend-aware or otherwise qualified basis.

Candidate resume disposition:

```text
RESUME
 -> detect boot/session continuity
 -> estimate/qualify suspend interval
 -> invalidate elapsed-time claims that cannot include suspension
 -> re-evaluate policy/authority/credential/waiver/security horizons
 -> preserve historical effects
 -> admit only operations whose temporal basis remains sufficient
```

If the suspend interval cannot be bounded, the affected claim becomes `UNKNOWN`; it does not inherit its pre-suspend PASS.

## Wall-clock rollback cannot restore authority

Manual clock changes, RTC reset, VM snapshot restore or time-sync correction may move wall time backward. A previously observed expiry/security floor/revocation cannot be undone by that movement.

```text
WALL_CLOCK_MOVED_BACK != AUTHORITY_RESTORED
SNAPSHOT_RESTORED != TEMPORAL_FLOOR_RESTORED_BACKWARD
OLDER_LOCAL_DATE != OLDER_SECURITY_STATE PERMITTED
```

Candidate durable monotonic floor:

```text
ObservedTemporalFloor
  subject/scope
  strongestObservedExpiryOrRevocationFloor
  source/provenance
  observedAtBasis
  persistenceGeneration
  currentness
```

This floor is claim-specific. It must not become a global timestamp oracle or silently conflate policy, credential and management authority.

## Forward clock steps also require qualification

A wall clock can jump forward because of correction or operator error. Treating every forward jump as true elapsed time can prematurely expire leases, waivers or authority.

```text
WALL_CLOCK_MOVED_FORWARD != PROVEN_REAL_ELAPSED
```

The safe disposition depends on the contract. Security-sensitive operations may fail closed or require remote/independent corroboration; availability-oriented operations may continue only under an explicit bounded grace contract. A forward jump is evidence of clock uncertainty, not proof that every remote expiry has actually passed.

## NTP/NTS correction does not rewrite history

A successful authenticated synchronization establishes a qualified current-time observation with bounded assumptions. It does not retroactively change when local effects occurred.

Candidate event representation:

```text
TemporalEventStamp
  eventId
  localSequence
  bootSessionId
  monotonicReading?
  suspendAwareReading?
  wallReading?
  wallUncertainty?
  remoteTimeQualificationRef?
  causalParentRefs[]
```

When clocks are corrected, retain the original event evidence and add a calibration/reconciliation relation.

```text
NTP_SYNC != HISTORICAL_EVENT_REWRITE
TIME_CALIBRATION != EFFECT_REPLAY
```

## Cross-host ordering must not be fabricated from wall time

Two hosts can have individually reasonable clocks yet lack enough precision/qualification to order close events.

Candidate comparison dispositions:

```text
PROVEN_BEFORE
PROVEN_AFTER
PROVEN_SIMULTANEOUS_WITHIN_CONTRACT
CAUSALLY_BEFORE
CAUSALLY_AFTER
ORDER_NOT_MATERIAL
ORDER_UNKNOWN
```

`ORDER_UNKNOWN` is first-class.

```text
TIMESTAMP_A < TIMESTAMP_B != PROVEN_A_BEFORE_B
UNKNOWN_CLOCK_ORDER != SAFE_ORDER
```

Where safety requires ordering, use causal/fencing/lease-generation evidence or another contract-specific proof rather than timestamp sorting.

## Revocation effective time requires three independent moments

Late revocation remains modeled with at least:

```text
revocationEffectiveAt
runtimeObservedAt
localAdmissionAt
externalEffectAt
```

Each timestamp also carries a temporal basis and uncertainty.

Therefore:

```text
REMOTE_REVOCATION_TIMESTAMP_PRESENT != EFFECT_ORDER_PROVEN
REVOCATION_OBSERVED_LATE != HISTORICAL_EFFECT ERASED
REVOCATION_EFFECTIVE_BEFORE_EFFECT != RUNTIME_KNEW_BEFORE_EFFECT
```

If effective-time and effect-time bases are not comparable, disposition is `ORDER_UNKNOWN`, followed by the policy's explicit remediation/reconciliation law.

## Authority horizons need temporal-basis metadata

Extend the previous horizon vector conceptually:

```text
AuthorityHorizon
  domain
  validFrom?
  expiresAt?
  maxElapsed?
  temporalBasisRef
  uncertaintyTolerance
  suspendBehavior
  rollbackBehavior
  offlineBehavior
  graceContractRef?
  invalidators[]
```

A duration-based local lease can often use elapsed time. A legal/business deadline may require qualified civil time. A remote revocation may require authenticated remote-time provenance. A causal handoff may not need synchronized clocks at all.

```text
SAME EXPIRY STRING != SAME TEMPORAL SEMANTICS
```

## Grace remains explicit under clock uncertainty

Grace cannot be implemented as `expiresAt += N` after clock trouble.

A grace decision records the uncertainty that triggered it and the independent elapsed-time budget used to bound it where possible.

```text
CLOCK_UNCERTAIN + GRACE != CLOCK_CURRENT
GRACE_START != WALL_CLOCK_ALIAS
RECONNECT_FLAP != GRACE_REARM
```

If a safe elapsed-time basis itself is unavailable, the contract must define fail-closed or human/emergency disposition rather than inventing duration.

## Credential and secret boundaries

`SecretRef != secret value` remains absolute.

Credential validity has at least three temporal questions:

1. is the credential cryptographically within its validity interval under a qualified time basis?
2. is the credential known not to be revoked/fenced under current evidence?
3. is the operation still authorized by policy/management authority?

```text
CERT_NOT_EXPIRED != CREDENTIAL_NOT_REVOKED
CREDENTIAL_NOT_REVOKED != BUSINESS_AUTHORITY_CURRENT
CLOCK_SAYS_VALID != TARGET_ACCEPTS/FENCES CURRENTLY
```

Automatic Vault/environment bindings must expose which temporal basis controls lease/renewal/fencing decisions without exposing secret values.

## Application Manager implications

- Discovery timestamps do not make an app verified.
- An installed app's version compatibility evidence can stale after suspend/resume or policy/security-floor advancement.
- `SB_MANAGED`, `EXTERNALLY_MANAGED`, `CO_MANAGED`, `OBSERVE_ONLY` authority remains operation-scoped even when clocks disagree.
- A stale local clock cannot extend upgrade authority over an externally managed app.
- Supply-chain/source integrity timestamps are provenance evidence, not current management authority.

```text
DISCOVERED_AT != VERIFIED_AT
SIGNED_RELEASE_TIME != CURRENT_COMPATIBILITY
```

## Control Center implications

Control Center should project, not own, temporal truth. Candidate projections:

- clock-domain/currentness indicator;
- suspend/resume discontinuity finding;
- wall-clock step/rollback finding;
- horizon basis and uncertainty;
- remote-time source/trust qualification;
- event-order ambiguity;
- revocation/effect ordering inspector;
- grace budget independent of wall-clock display;
- temporal blast-radius preview.

Global search/diff must distinguish `value changed` from `temporal basis/currentness changed`.

```text
CONTROL_CENTER_CLOCK != GLOBAL AUTHORITY CLOCK
```

## Declarative Service Deployment implications

Typed service schemas may declare temporal requirements for lease renewal, readiness, credential rotation or placement fencing, but provider artifacts remain projections.

```text
PROVIDER_TIMESTAMP != CANONICAL EFFECT TIME
PROVIDER_ACK_AT != EFFECTIVE_AT
RAW_MANIFEST_TIME_FIELD != TEMPORAL AUTHORITY
```

A provider artifact may carry timestamps for export/debugging without becoming canonical truth.

## Hosting/placement implications

Placement migration may create dual paths whose event timestamps are not comparable. Service semantic identity remains stable.

```text
PLACEMENT_MIGRATION != SERVICE REIDENTIFICATION
NEW_ENDPOINT_TIME > OLD_ENDPOINT_TIME != OLD_ENDPOINT FENCED
```

Fencing/effect-side exclusion evidence outranks wall-clock ordering when the protected invariant requires exclusive mutation authority.

## Workspace/Desktop/Window implications

Workspace restoration after machine sleep/VM resume must requalify Client, authority and temporal currentness. UI restoration does not restore authority.

```text
WORKSPACE_RESTORED != TEMPORAL BASIS CURRENT
WINDOW_RESUMED != SERVICE AUTHORITY RESUMED
UI CLOCK BADGE != AUTHORITY
```

Pinned Monitoring Surfaces and Desktop Observatory expose temporal uncertainty without becoming time or policy oracles.

## Cross-tenant evidence implications

A globally portable artifact proof can carry its original temporal provenance, but destination currentness is evaluated locally.

```text
PORTABLE TIMESTAMP != PORTABLE CURRENTNESS
SOURCE CLOCK QUALIFIED != DESTINATION POLICY CURRENT
```

Cross-tenant indexes/caches must not use timing behavior to leak tenant activity. Clock evidence itself can reveal infrastructure/topology details and is disclosure-scoped.

## Emergency recovery implications

Recovery shares/material can remain cryptographically valid while policy or activation windows expire. Ceremony time must be qualified independently of possession.

```text
SHARE VALID != RECOVERY WINDOW CURRENT
CLOCK RESET != STALE RECOVERY GENERATION ADMISSIBLE
```

Threshold satisfaction cannot repair temporal-policy uncertainty.

## Required adversarials

1. VM sleeps for six hours while process-monotonic time barely advances; a one-hour authority horizon must not silently survive.
2. Host wall clock is moved backward before an expiry; authority does not resurrect.
3. Host wall clock jumps forward one day because of bad sync; all credentials are not blindly treated as certainly expired without contract-specific disposition.
4. NTS synchronizes successfully after an offline interval; historical local event timestamps are not rewritten.
5. Two hosts report effect/revocation times 20 ms apart with 500 ms uncertainty; ordering remains `UNKNOWN`.
6. Revocation effective time is signed but from an unqualified producer; signature does not create trusted time.
7. Credential certificate is time-valid but remote revocation status is stale; `time-valid != currently admissible`.
8. Vault lease renewal succeeds while policy horizon expired; renewal does not renew policy authority.
9. Workspace restores from VM snapshot with an older wall clock and cached Client context; stale context does not revive authority.
10. App discovered before suspend is still present after resume; discovery continuity does not create verification.
11. Externally managed app has an old cached upgrade window; local clock rollback cannot reopen it.
12. Global Control Center setting would restart apps at a civil-time deadline; uncertainty must appear in blast-radius/change planning rather than trigger hidden restart.
13. Shared host clock does not imply shared tenant data/authority.
14. Provider manifest contains `createdAt`; it does not become canonical desired/effective time.
15. UI Window closes during a grace period; runtime/service lifecycle is unaffected.
16. Adapter maps provider `lastTransitionTime` to semantic `effectiveAt` without proof; mapping is rejected/qualified.
17. Placement migration produces a newer endpoint timestamp while old endpoint remains writable; Service identity is unchanged and fencing remains unresolved.
18. App-specific maintenance window conflicts with a Control Center policy deadline; policy/config ownership remains explicit.
19. Automatic secret binding renews using a different clock domain than policy expiry; dependency is surfaced, not hidden.
20. NTP is reachable but NTS/authentication is not; secure-time policy does not silently downgrade to unauthenticated time.
21. Runtime restarts and loses process-monotonic origin; persisted horizon cannot be reconstructed from raw monotonic ticks alone.
22. Host reboot resets a local clock source; boot/session identity prevents accidental cross-boot comparison.
23. Daylight-saving/civil-time change affects display schedule but not elapsed security lease.
24. Recovery ceremony reaches threshold after its activation window but wall clock was rolled back; threshold does not revive authority.
25. Cross-tenant evidence has same artifact digest and timestamp; destination tenant currentness still requires local qualification.
26. Clock source itself is stale but reports low local jitter; precision does not imply correctness.

## New invariants

```text
WALL_CLOCK_MOVED_BACK != AUTHORITY_RESTORED
PROCESS_SUSPENDED != HORIZON_PAUSED
NTP/NTS_SYNC != HISTORICAL_EVENT_REORDERED
REMOTE_TIMESTAMP != TRUSTED_TIME_WITHOUT_QUALIFICATION
UNKNOWN_CLOCK_ORDER != SAFE_ORDER
MONOTONIC_ELAPSED != SUSPEND_AWARE_ELAPSED
CLOCK_SYNCED_NOW != CLOCK_WAS_CORRECT_THEN
SIGNED_TIMESTAMP != COMPARABLE_TIMESTAMP
PORTABLE_TIMESTAMP != PORTABLE_CURRENTNESS
CLOCK_PRECISION != CLOCK_CORRECTNESS
BOOT_CONTINUITY != PROCESS_CONTINUITY
TIME_VALID != NOT_REVOKED != AUTHORIZED
```

## Proof obligations PO-291..PO-320

- **PO-291** Every expiry/currentness decision identifies its temporal basis and subject/scope.
- **PO-292** Wall-clock rollback cannot reduce an already observed security/authority floor.
- **PO-293** Suspend/resume invalidates claims whose elapsed-time basis cannot account for suspension.
- **PO-294** Process-monotonic readings are never compared across incompatible boot/process origins.
- **PO-295** A wall-clock forward step cannot alone prove real elapsed duration for every contract.
- **PO-296** Current time synchronization cannot rewrite historical event evidence.
- **PO-297** Remote timestamps require producer/trust/scope/currentness qualification before authority use.
- **PO-298** Signed timestamps do not imply mutually comparable clock uncertainty.
- **PO-299** Cross-host event ordering remains `UNKNOWN` when required bounds cannot prove order.
- **PO-300** Causal/fencing evidence is preserved independently of timestamp ordering.
- **PO-301** Late revocation preserves effective/observed/admission/effect moments separately.
- **PO-302** Unknown revocation/effect order invokes explicit reconciliation policy rather than guessed ordering.
- **PO-303** Each authority horizon declares suspend, rollback and offline behavior.
- **PO-304** Grace under clock uncertainty is explicit, bounded and cannot silently rearm on connectivity flap.
- **PO-305** Credential time validity cannot satisfy revocation/fencing or business-authority currentness.
- **PO-306** Automatic secret/credential bindings expose temporal dependencies without exposing secret values.
- **PO-307** Application discovery time cannot satisfy verification or management authority.
- **PO-308** Externally managed/observe-only boundaries survive temporal uncertainty.
- **PO-309** Control Center never becomes a mandatory global time oracle for autonomous runtimes.
- **PO-310** Provider timestamps/ACKs cannot fabricate semantic effective time.
- **PO-311** Placement migration preserves Service identity and requires fencing evidence where exclusive effects matter.
- **PO-312** Workspace/window restore requalifies temporal currentness independently of UI persistence.
- **PO-313** Cross-tenant evidence portability does not make destination currentness portable.
- **PO-314** Recovery material possession/threshold satisfaction cannot extend expired temporal policy authority.
- **PO-315** Secure-time policy cannot silently downgrade to unauthenticated time after NTS failure.
- **PO-316** Boot/session identity is part of any persisted monotonic-time interpretation.
- **PO-317** Civil-time display changes cannot silently alter elapsed security leases.
- **PO-318** Temporal evidence uncertainty is preserved through adapters; normalization cannot fabricate equivalence.
- **PO-319** Tenant isolation applies to time/evidence caches and timing side channels.
- **PO-320** Temporal-basis/currentness changes participate in blast-radius/change-plan invalidation when material.

## Contradictions and trade-offs

### Availability vs conservative temporal admission

Failing closed whenever wall time is uncertain is simple but can unnecessarily stop safe local reads or already-admitted obligations. Failing open preserves availability but can extend authority. Resolution remains operation/invariant-scoped through LocalAutonomyContract + TemporalBasis + explicit grace, not one global mode.

### Authenticated time vs autonomous runtime

Requiring online authenticated time for every decision would violate runtime autonomy. Never refreshing time permits indefinite stale authority. The candidate compromise is locally durable temporal floors, suspend-aware elapsed bases where appropriate, authenticated time when required/available, independent horizons and explicit degradation when uncertainty exceeds contract bounds.

### Monotonic time vs persistence

Monotonic clocks are robust against wall-clock adjustment but are generally local to a boot/session and cannot by themselves survive restart or compare hosts. Persisted decisions therefore need anchors/session identity and requalification rather than serializing raw monotonic values as universal timestamps.

### Provider timestamps vs semantic evidence

Provider timestamps are operationally useful but differ in clock quality, transition semantics and authority. Adapters may expose them with provenance; they cannot silently normalize all provider timestamps into semantic `effectiveAt`.

## Saturation assessment

- clock-domain separation: `ADVANCED_EMERGING / relatively mature in principle`;
- suspend/resume horizon behavior: `MATERIAL / NOT_SATURATED`;
- wall-clock rollback/forward-step semantics: `MATERIAL / NOT_SATURATED`;
- authenticated remote time qualification: `MATERIAL / NOT_SATURATED`;
- cross-host ordering/uncertainty: `MATERIAL / NOT_SATURATED`;
- late revocation temporal reconciliation: `MATERIAL / NOT_SATURATED`;
- provider-native temporal mapping: `EARLY_MATERIAL`;
- no domain is declared saturated.

## Architecture gaps remaining

1. Define a provider-neutral **Temporal Evidence Envelope** capable of carrying clock domain, uncertainty, boot/session identity, authenticated source and calibration lineage without creating one global clock service.
2. Determine durable temporal-floor behavior across host restore/VM snapshot/DR where storage itself may roll back.
3. Reconcile legal/business civil-time schedules with elapsed security horizons and distributed execution.
4. Define clock-quality policy for non-fenceable external effects where event order remains unknowable.
5. Determine when multiple independent time sources materially improve qualification versus merely sharing a correlated upstream source.

## Next highest-value gap

**Temporal evidence durability under snapshot/restore, DR and storage rollback.**

The next round should study how a runtime proves that its observed revocation/security/authority temporal floor did not move backward when the whole VM/container/data volume is restored from an older snapshot or promoted from a lagging replica. The key problem is that a locally persisted anti-rollback floor can itself roll back with the storage it protects.

Required starting invariants:

```text
SNAPSHOT_RESTORED != TEMPORAL FLOOR MAY ROLLBACK
PERSISTED LOCALLY != ROLLBACK RESISTANT
REPLICA PROMOTED != REPLICA HAS LATEST NEGATIVE EVIDENCE
TPM/HSM COUNTER PRESENT != BUSINESS AUTHORITY PROVEN
EXTERNAL WITNESS != GLOBAL ONLINE ORACLE
```

This remains research-only.