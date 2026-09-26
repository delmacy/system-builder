# G4 Web Desktop — Retirement-Fence Distribution and Catastrophic Rebootstrap Research

Date: 2026-09-23
Status: `RESEARCH_ACTIVE / NON_EXECUTABLE`
Scope: documentary P&D only. No WBS, Work Package, Sprint, TASK, provider adoption or product implementation authority.

## 1. Research question

This round follows the offline recovery-domain retirement / bounded-GC study. The unresolved adversarial case is total loss of the active control plane while only old recovery media remain.

The recovery system must simultaneously preserve two constitutional properties:

1. a published/client runtime and its recovery path must not require Builder availability; and
2. an old medium must not become self-authorizing merely because every newer control-plane copy disappeared.

The central distinction is therefore:

`Recovery material possession != current recovery authority`.

And, under catastrophic loss:

`No current fence available != proof that no retirement fence exists`.

The system needs a bounded catastrophic rebootstrap path that can recover availability without fabricating semantic/security continuity.

## 2. Consumed repository evidence and deduplication

This study preserves the repository constitutional rules: `Builder != Runtime`, published runtime autonomy, compatibility before replacement, open/replaceable suite architecture, explicit contracts, and repository-as-memory.

It deduplicates the prior Web Desktop / recovery line rather than reopening it:

- recovery domain identity is distinct from recovery point, storage provider, media instance and restore authority;
- retirement authority is distinct from residual bytes and sanitization;
- negative/fencing evidence must outlive every resurrection path or be subsumed by a stronger fence;
- `UNKNOWN` is an evidence disposition, not permission to guess;
- recovery/frontier evidence is multidimensional and provider-local progress cannot manufacture semantic completeness;
- old media rediscovery never automatically restores `ACTIVE_RECOVERY`;
- historical verification authority is distinct from current issuance/effect authority;
- recovery safety frontiers, anti-rollback, fork reconciliation, trust-root succession and bounded GC already cover normal and partitioned continuity where at least one qualified trust lineage remains.

This round addresses the harder case where that last assumption fails.

Recent Palantir-derived observability research is orthogonal but compatible: telemetry and derived projections remain separately authorized, bounded-currentness evidence rather than canonical recovery truth. No Palantir finding displaces the current Station sequencing directive.

## 3. External contradictory evidence

### 3.1 TUF: continuity requires a previously trusted root

The Update Framework client workflow begins from trusted root metadata delivered out-of-band. Root rotation is deliberately chained: root N+1 must satisfy the threshold declared by root N and the threshold declared by N+1; clients persist trusted root state and reject rollback. This is excellent continuity while a trusted predecessor survives.

TUF is also explicit about the hard boundary: if a threshold of root keys is compromised, root keys require out-of-band update, and safe recovery may be nearly impossible because affected machines may already be attacker-controlled.

Transferable lesson:

`Normal trust rotation != catastrophic trust bootstrap`.

A new root that is merely self-consistent cannot prove continuity with a lost predecessor. Catastrophic bootstrap is a new trust ceremony and must be represented as such.

### 3.2 RFC 5011 / DNSSEC: trust-anchor update presupposes a current anchor

RFC 5011 automates trust-anchor rollover from an already trusted anchor and uses hold-down/revocation semantics. Its security comes from continuity with existing trust, not from accepting whichever anchor is found after local state loss.

Transferable lesson:

`Anchor update != anchor rediscovery`.

If all local trust-anchor state disappears, automatic rollover semantics cannot prove which rediscovered historical anchor is current.

### 3.3 Sigstore: air-gapped verification still requires explicit out-of-band trust material

Sigstore supports air-gapped verification through serialized TUF repositories or explicitly supplied keys/certificates. In that mode key/certificate rotation becomes manual. Its threat model uses offline threshold roots, rotation, revocation, compromise-time evidence and freshness to detect stale trust material.

Transferable lesson:

`Offline capable != trustless bootstrap`.

Air-gap support relocates the trust-distribution obligation; it does not eliminate it.

### 3.4 NIST key recovery: recoverability is type- and purpose-specific

NIST SP 800-57 Part 1 Rev. 5 treats key recovery as a deliberate lifecycle decision. It distinguishes backup/archive/reconstruction of keying material and notes that private signature keys generally should not be archived, because doing so can undermine non-repudiation; exceptions require explicit justification.

Transferable lesson:

`Recover all old authority material` is not a valid disaster-recovery strategy.

Recovery must preserve the minimum authority/evidence needed for the intended purpose without turning retired signing/effect authority into a resurrection mechanism.

## 4. Material finding — two recovery modes, not one

The architecture needs an explicit distinction between **continuity-preserving recovery** and **catastrophic rebootstrap**.

### 4.1 Continuity-preserving recovery

At least one qualified external/local anchor survives and can prove the recovery media's relation to the current authority/security floors.

Candidate result:

`RECOVERY_CONTINUITY_PROVEN`.

This path may restore effective service after ordinary restore-admissibility qualification.

### 4.2 Catastrophic rebootstrap

No qualified current anchor/frontier/fence survives, or available copies cannot prove they dominate every potentially relevant retirement/security floor.

Candidate result:

`CONTINUITY_UNPROVEN / CATASTROPHIC_REBOOTSTRAP_REQUIRED`.

This path MUST NOT relabel the oldest available state as current. It establishes a **new recovery authority epoch** through an explicit out-of-band/human-governed bootstrap ceremony and preserves a durable continuity-gap record.

Core invariant:

`New authority can restore operation != new authority proved uninterrupted historical continuity`.

## 5. Candidate semantic model

### 5.1 CatastrophicRecoveryBootstrap

Candidate fields:

```text
CatastrophicRecoveryBootstrap
  clientRef
  recoveryScope
  bootstrapOccurrenceId
  predecessorEpochClaim
  predecessorEvidenceDisposition
  discoveredMediaSet
  discoveredFenceSet
  discoveredFrontierSet
  highestProvableFloors
  unresolvedUnknowns
  newAuthorityEpoch
  bootstrapAuthorityEvidence
  humanGovernanceEvidence
  isolationDisposition
  externalEffectDisposition
  continuityDisposition
  postBootstrapObligations
  provenance
```

The object records a recovery occurrence; it is not itself business authority.

### 5.2 ContinuityDisposition

Candidate dispositions:

- `CONTINUITY_PROVEN`
- `CONTINUITY_PARTIAL`
- `CONTINUITY_GAP_DECLARED`
- `PREDECESSOR_COMPROMISE_SUSPECTED`
- `PREDECESSOR_AUTHORITY_UNKNOWN`
- `CONFLICTING_PREDECESSOR_EVIDENCE`

`CONTINUITY_GAP_DECLARED` is a legitimate outcome, not an implementation failure to hide.

### 5.3 RecoveryBootstrapAnchorSet

Catastrophic rebootstrap should use multiple independently governed anchors where available, for example:

- offline organization-held trust material;
- separately stored signed retirement/fence digests;
- immutable external audit/witness receipts;
- HSM/TPM-backed surviving generation evidence;
- provider-held immutable metadata;
- documented human/organizational recovery authority.

No one mechanism is universally required. The contract records which anchor classes were actually present and which assumptions remain `UNKNOWN`.

`Multiple copies != independent anchors`.

Copies sharing one provider, credential, administrative domain or compromise mode do not automatically provide independent assurance.

## 6. Retirement-fence distribution

A `RecoveryRetirementFence` must not live only in the control plane or only on the media it revokes.

Candidate distribution classes:

1. `ACTIVE_CONTROL_PLANE_COPY`
2. `RECOVERY_SITE_COPY`
3. `OFFLINE_GOVERNANCE_COPY`
4. `PROVIDER_IMMUTABLE_COPY`
5. `INDEPENDENT_WITNESS_DIGEST`
6. `MEDIA_LOCAL_COPY` — useful for discovery, never sufficient by itself to prove currentness.

The architecture should reason about **independent failure domains**, not a magic replication count.

Candidate proof question:

> Can every recovery path capable of reintroducing pre-retirement state either observe a dominating retirement floor or be forced through a bootstrap process that treats missing currentness as a continuity gap?

If yes, retirement is resurrection-resistant within the declared coverage. If no, the gap remains explicit.

## 7. Recovery state machine

Candidate documentary state machine:

```text
RECOVERY_REQUESTED
  -> SURVIVING_ANCHORS_DISCOVERING
  -> MEDIA_IDENTITY_QUALIFYING
  -> FENCE/FRONTIER_DISCOVERING
  -> AUTHENTICITY_QUALIFYING
  -> MONOTONIC_FLOOR_RECONCILING
  -> COVERAGE_QUALIFYING
     -> CONTINUITY_PROVEN
        -> RESTORE_ADMISSIBILITY_QUALIFYING
        -> NORMAL_RECOVERY
     -> CONTINUITY_PARTIAL
        -> QUARANTINED_RECOVERY
     -> CONTINUITY_UNPROVEN
        -> CATASTROPHIC_BOOTSTRAP_AUTHORITY_QUALIFYING
        -> NEW_AUTHORITY_EPOCH_ESTABLISHING
        -> PREDECESSOR_EFFECTS_QUARANTINING
        -> SECURITY/TRUST_REISSUANCE
        -> EXTERNAL_EFFECT_RECONCILIATION
        -> CONTINUITY_GAP_RECORDING
        -> BOUNDED_REBOOTSTRAP_EFFECTIVE
```

Critical rule:

`CATASTROPHIC_BOOTSTRAP != NORMAL RESTORE WITH A BYPASS FLAG`.

It is a distinct authority transition.

## 8. External effects and resurrection resistance

A catastrophic restore can reconstruct bytes while still lacking evidence about old external effects, credentials, provider leases or authority.

Therefore, before effective operation:

- credentials/session tokens are non-restorable by default;
- external provider bindings are rediscovered/requalified, not silently resumed;
- effect identities and unsettled effects are quarantined until reconciliation;
- new credentials/leases bind the new authority epoch;
- predecessor effect rights are assumed unsafe unless independently fenced or proven irrelevant;
- automation capable of irreversible external effects remains disabled until the relevant effect domains are requalified.

This preserves:

`Data recovered != effect authority recovered`.

## 9. Web Desktop implications

No structural change is required to the current hierarchy:

`Builder Home/Factory -> Client -> Workspace -> Desktop Sphere -> Application -> Window -> View/Tab/Tool`.

### Desktop Sphere taxonomy

- Desktop Sphere remains a guided functional context, not a deployment/runtime boundary.
- Recovery/Operations is a legitimate sphere/application context but does not become a universal desktop foundation.
- 3D remains optional projection/application, not navigation foundation.

### Observatory vs Monitoring Surface vs Operations Desktop

- **Desktop Observatory:** read-oriented aggregate projection of recovery-domain health, fence coverage, continuity disposition, stale/unknown anchors and residual risk.
- **Pinned Monitoring Surface:** compact alerts such as `RECOVERY CONTINUITY GAP`, `RETIREMENT FENCE COVERAGE PARTIAL`, or `CATASTROPHIC BOOTSTRAP ACTIVE`; no destructive controls.
- **Operations Desktop:** qualified application surfaces for anchor inspection, bootstrap ceremony, quarantine, credential reissuance and effect reconciliation.

`Observatory warning != recovery authorization`.

### Window Manager / multi-display

Window remains an interaction session. Recovery state is durable outside window lifetime. A stale secondary display cannot authorize a restore/bootstrap effect. Every destructive/authority-changing command requalifies against current state at command execution.

Small-screen/accessibility equivalence requires the same continuity/floor/UNKNOWN distinctions in linear text/table form; graph/tree visualization is optional.

## 10. Application Portfolio Matrix delta

No universal integration mode is selected.

| Capability/task | Preferred modes | Why / boundary |
|---|---|---|
| Recovery-domain/fence registry | Native SB | semantic identity, lineage, currentness and authority separation are SB-owned |
| Catastrophic bootstrap orchestration | Native SB + Hybrid | semantic ceremony native; external anchors/providers remain replaceable |
| Cloud vault inventory/restore | API-backed / Hybrid / Deep-link | mature provider operations should be reused; provider ACK is not semantic admissibility |
| Offline tape/media inspection | Hybrid / Native bridge | local devices may require host/native access; media does not self-authorize |
| KMS/HSM recovery | API-backed / Hybrid / Deep-link / Native bridge | mode depends on provider/hardware; private authority material must not be normalized as generic secret backup |
| Independent witness/audit anchor | API-backed / Hybrid | external durability can improve failure independence without becoming canonical business authority |
| Historical proof inspection | Native SB / Hybrid / Embedded-qualified | local semantic interpretation plus replaceable specialist tooling |
| Provider forensic console | Deep-link / Embedded-qualified | preserve mature specialist UX; embed only with security/capability qualification |
| Credential/session reissuance | Native semantic orchestration + API-backed provider execution | old credential rows are not restored as authority |
| External-effect reconciliation | Native semantic model + Hybrid/Deep-link adapters | provider evidence remains provider-specific; normalization cannot fabricate equivalence |

### Matrix criteria added/refined

- anchor independence / correlated-failure domain;
- bootstrap continuity disposition;
- retirement-fence portability;
- anti-rollback/floor fidelity;
- provider residual visibility;
- historical-verification vs new-effect authority separation;
- credential/session resurrection resistance;
- external-effect reconciliation fidelity;
- offline operability;
- licensing and redistribution of verification material;
- currentness/freshness semantics;
- replaceability/provider exit;
- explicit `PARTIAL`, `UNKNOWN`, `CONFLICT`, `CONTINUITY_GAP` representation.

## 11. Application Manager / Control Center / deployment implications

### Application Manager

Preserve:

`Install != Adopt != Qualify != Authorize`.

A recovery/KMS/provider application can be installed or discovered without being qualified as a bootstrap anchor or recovery authority. Uninstalling an adapter does not retire its recovery domain.

### Control Center

Control Center should eventually explain, not hide:

- active recovery-authority epoch;
- predecessor epoch and continuity disposition;
- fence/frontier coverage by failure domain;
- inherited vs local recovery policy;
- anchor provenance and currentness;
- provider bindings and residual material;
- bootstrap ceremony evidence;
- unresolved external effects and security reissuance obligations.

`Automatic != hidden` applies strongly to recovery auto-binding.

### Declarative deployment / service definition / Vault auto-binding

A semantic service definition may request backup, KMS, witness or recovery capabilities. Provider YAML/API artifacts remain projections.

Auto-binding may select only provider instances compatible with Client, trust, residency, licensing, recovery-policy, currentness and authority constraints. `SecretRef != secret value`; catastrophic recovery does not justify persisting plaintext secrets into semantic definitions.

`Register != Deploy`; rediscovering a provider endpoint after disaster does not mean the previous deployment/effect authority is restored.

## 12. External mature tool reuse and open boundaries

This research strengthens, rather than weakens, reuse:

- cloud backup/vault consoles remain specialist tools;
- KMS/HSM tooling remains provider/hardware specialist;
- OpenTelemetry/Grafana-class observability remains replaceable and non-authoritative;
- provider-specific restore, audit and forensic consoles are candidates for Deep-link/Hybrid rather than proprietary clones;
- adapters translate declared provider evidence into SB dispositions but must preserve unsupported/unknown semantics.

`Adapter normalization != fabricated semantic equivalence` remains binding.

## 13. Proprietary editor/shared primitive implications

No new proprietary recovery editor family is justified. Existing shared editor/application foundations should be sufficient if they support:

- immutable occurrence/evidence viewers;
- provenance/currentness badges;
- diff/compare of authority epochs and floors;
- qualified command surfaces with preview and explicit effect scope;
- conflict/UNKNOWN/continuity-gap representation;
- activity/progress surfaces independent of window lifetime;
- accessible textual equivalent for graph/lineage views.

These primitives also serve Workflow/View/Form/Component editors. The semantic bridge remains unchanged:

`View != Workflow Activity`
`Form != Workflow State`
`Button != Domain Command`.

A recovery button invokes a separately authorized command; UI affordance is never the authority source.

## 14. Componentization complexity map

This is a research decomposition only, not WBS.

### C1 — low/mostly presentation reuse

- continuity/currentness badges;
- `UNKNOWN/PARTIAL/CONFLICT/GAP` status primitives;
- read-only anchor/fence tables;
- pinned monitoring cards;
- accessible lineage summaries.

### C2 — moderate shared interaction foundations

- provenance inspector;
- authority-epoch comparison;
- durable operation/activity projection;
- command preview/confirmation shell;
- multi-display stale-state revalidation;
- provider capability/qualification display.

### C3 — high semantic foundations, broad reuse

- `RecoveryBootstrapAnchorBoundary`;
- `AnchorFailureDomainBoundary`;
- `RetirementFenceDistributionBoundary`;
- `CatastrophicBootstrapBoundary`;
- `ContinuityDispositionBoundary`;
- `RecoveryAuthorityEpochBoundary`;
- `MonotonicRecoveryFloorBoundary`;
- `BootstrapAuthorityQualificationBoundary`;
- `PostBootstrapCredentialReissuanceBoundary`;
- `PostBootstrapEffectReconciliationBoundary`;
- `ContinuityGapEvidenceBoundary`;
- `RediscoveredMediaAdmissionBoundary`.

### Application/domain-specific work that should not be generalized prematurely

- legal/organizational emergency authority;
- physical tape/device procedures and chain of custody;
- provider-specific HSM break-glass;
- regulatory retention/recovery obligations;
- domain-specific external-effect compensation;
- business workflow recovery/reassignment;
- provider account ownership transfer.

The cost-reduction principle remains: build shared evidence/currentness/authority/command/provenance primitives once; keep provider and business semantics in qualified adapters/applications.

## 15. Performance/resource budget implications

No numeric thresholds are invented. Future empirical budgets should measure:

- anchor/fence discovery latency by recovery domain;
- offline-media inventory scan cost;
- cryptographic verification CPU and chain depth;
- witness/provider query fan-out and timeout budget;
- bootstrap evidence storage size;
- recovery UI time-to-first-qualified-state;
- external-effect reconciliation cardinality;
- stale/UNKNOWN coverage ratio;
- credential/provider reissuance throughput;
- multi-display state propagation lag;
- provider egress/API cost during disaster recovery.

A fast restore that skips authority qualification is not a performance success.

## 16. Adversarial proof matrix

Future design must answer at least these cases:

1. only one old tape remains and no current fence is available;
2. old tape says `ACTIVE`, but a retirement fence may have existed after the tape date;
3. old tape contains an authentic but retired root key;
4. all Builder/control-plane databases are lost while generated runtime backups survive;
5. current recovery authority survives in an offline governance package but provider account is gone;
6. provider vault survives but organization-held trust material is lost;
7. one witness says retired while another is unreachable;
8. two surviving anchors disagree on highest recovery epoch;
9. all surviving anchors share one compromised administrative domain;
10. new bootstrap authority is established while predecessor compromise time is unknown;
11. catastrophic bootstrap attempts to reuse restored session/refresh tokens;
12. restored cloud credentials are still technically accepted by provider;
13. predecessor external worker may still execute queued effects;
14. database restores but external payment/deployment effects are `UNKNOWN`;
15. provider endpoint is rediscovered and UI mistakes discovery for adoption/authority;
16. historical evidence needs old public verification material but old private signing authority must remain retired;
17. legal hold requires bytes but restore authority was retired;
18. media reappears after a new authority epoch was established;
19. media-local fence is older than an independently witnessed fence;
20. no witness is reachable during disaster but becomes reachable later;
21. late witness proves the bootstrap used stale predecessor assumptions;
22. new epoch must remain operational while continuity record is corrected to `GAP`/`CONFLICT`;
23. secondary display shows `CONTINUITY_PROVEN` after main session learned `UNKNOWN`;
24. recovery app window closes during long-running reconciliation;
25. external provider adapter maps unsupported state to `healthy`;
26. air-gapped archive has valid historical proof but no new-effect authority;
27. root/fence signature algorithm is now deprecated for new signatures but valid for historical verification;
28. catastrophic bootstrap occurs during provider outage/price shock;
29. 9,999 recovery objects reconcile and one minority-critical authority fence remains `UNKNOWN`;
30. cross-Client shared vault must not leak another Client's recovery/fence state;
31. copied anchors are counted as independent despite common compromise domain;
32. human emergency ceremony succeeds but durable evidence write fails;
33. new credentials are issued before predecessor effect rights are fenced;
34. system claims seamless continuity because data hashes match despite lost authority lineage;
35. a later-discovered predecessor root contradicts the rebootstrap lineage;
36. total anchor loss is handled by accepting the newest wall-clock backup.

Expected rule for #36: reject that inference. Wall-clock recency is not recovery authority.

## 17. Research decisions / saturation

### High saturation

- Web Desktop hierarchy and Window-as-interaction-session;
- Observatory vs Pinned Monitoring Surface vs Operations Desktop;
- `Client != Workspace != Desktop != Application != Window`;
- normal recovery authority distinct from bytes/runtime;
- retirement distinct from sanitization/residual storage;
- historical verification distinct from current effect authority.

### Medium-high saturation

- retirement-fence distribution as independent failure-domain evidence;
- explicit catastrophic rebootstrap as a new authority epoch;
- continuity-gap representation;
- post-bootstrap credential reissuance and external-effect quarantine;
- Application Portfolio integration modes for recovery tooling.

### Medium saturation

- minimum independent anchor classes required for specific risk tiers;
- governance/threshold ceremony for catastrophic bootstrap;
- late-arriving predecessor evidence reconciliation;
- witness/provider correlated-compromise qualification;
- provider-specific portability of fence/currentness evidence.

### Medium-low empirical saturation

- disaster-scale discovery/verification latency;
- offline-media inventory cost;
- large external-effect reconciliation throughput;
- concrete accessibility/performance budgets under recovery stress.

## 18. Remaining material gap / next vector

The next deep-gap vector is **late-arriving predecessor evidence after catastrophic rebootstrap**.

Scenario: a new authority epoch was legitimately established because every current anchor was unavailable; operation resumed with an explicit continuity gap; months later, a previously missing witness/tape/HSM package reappears and proves that some predecessor retirement/security floor was higher than assumed.

Questions that can still change contracts/state machines:

- Does the new epoch remain authoritative while its provenance is downgraded to `CONTINUITY_GAP`/`CONFLICT`?
- Which post-bootstrap effects remain facts versus become unauthorized/remediation obligations?
- How are newly discovered predecessor fences merged without pretending rollback/time reversal?
- When must credentials, deployments or provider bindings be rotated again?
- Can a later proof ever retroactively invalidate historical interpretation while preserving external-effect facts?
- How does bounded GC treat predecessor material whose relevance was rediscovered after finalization?

This vector should be researched before declaring catastrophic-recovery semantics saturated.

## Sources reviewed 2026-09-23

Primary/standards sources:

- The Update Framework Specification v1.x — trusted root bootstrap, sequential root rotation, dual predecessor/successor threshold verification, rollback/freeze resistance and out-of-band recovery after threshold compromise.
- TUF Security / Roles and metadata — expiring, compartmentalized trust and root role semantics.
- Sigstore documentation — TUF-backed trusted roots, air-gapped serialized repositories/custom roots, offline threshold roots, rotation/revocation/freshness and compromise-time evidence.
- RFC 5011 — automated DNSSEC trust-anchor update from an existing trusted anchor, revocation and hold-down semantics.
- RFC 6781 — operational DNSSEC trust-anchor/key rollover practices.
- NIST SP 800-57 Part 1 Rev. 5 — key backup/archive/recovery, reconstruction and key-type-specific recovery considerations.

No provider or standard above is adopted by this document. They are benchmark/evidence inputs only.