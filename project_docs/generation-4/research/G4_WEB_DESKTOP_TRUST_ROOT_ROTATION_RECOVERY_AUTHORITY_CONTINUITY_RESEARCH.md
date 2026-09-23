# G4 Web Desktop — Trust-Root Rotation & Recovery-Authority Continuity Research

Status: `RESEARCH_ACTIVE / NON_EXECUTABLE`
Date: 2026-09-23
Scope: Generation 4 documentary P&D only. No product implementation, WBS, Work Package, Sprint, TASK, migration, provider adoption or architecture replacement is authorized.

## 1. Research question

How should the G4 Web Desktop / Application Environment represent and operate trust-root / issuer rotation when runtimes, DR sites, vaults and recovery operators may remain disconnected across the transition, an old issuer may later be suspected or proven compromised, historical evidence must remain interpretable, and current recovery/effect authority must not be fabricated from historical signature validity?

This round follows the `RecoverySafetyFrontier` fork-reconciliation work and consumes the newer :00 tenant-safe evidence analytics, :10 succession of exclusive rights/live obligations, :20 total-anchor-loss rebootstrap, and the latest :40 operational-UX saturation recheck. It deliberately does not duplicate their analytics, succession, rebootstrap or monitoring state machines.

Primary product hierarchy remains:

`Builder Home/Factory -> Client -> Workspace -> Desktop Sphere -> Application -> Window -> View/Tab/Tool`.

3D remains an optional projection/application, never the navigation foundation.

## 2. Repository and cross-round boundaries preserved

- `Builder != Runtime`; runtime trust continuity cannot require permanent Factory availability.
- `Client != Workspace != Desktop != Application != Window`.
- `Module != Capability != Application`.
- `Window/session != runtime`.
- `Install != Adopt`; `Register != Deploy`; `Discovered != Verified`.
- `SecretRef != secret value`.
- `Policy != configuration`.
- `Desired != Observed != Effective`.
- `Automatic != hidden`.
- `Adapter normalization != fabricated semantic equivalence`.
- `Observatory != Monitoring Surface != Operations Desktop`.
- `RecoveryPoint != RecoverySafetyFrontier != RestoreAuthority != RestoredRuntime`.
- `Valid signature != current frontier`.
- `organizational succession != duplication of live authority`.
- `fresh organizational authority != complete historical frontier`.
- `re-bootstrap != proven continuity`.

Additional hard boundaries from this round:

- `Historical signature validity != current issuer authority`.
- `Issuer key accepted for verification != issuer authorized for new effects`.
- `Trust-bundle overlap != dual business authority`.
- `New root installed != old root safely retired`.
- `Old root compromised != every historical statement forged`.
- `Compromise time unknown != permission to assume historical evidence valid`.
- `Cross-signature valid != successor policy/currentness satisfied`.
- `Offline verifier possesses old root != old root remains currently admissible`.
- `Recovery authority rotated != predecessor effects settled`.
- `Emergency authority != permission to rewrite trust history`.
- `Root continuity lost != safe continuity reconstructed by a new root`.

## 3. Inputs reconciled / deduplication

### :00 — tenant-safe evidence analytics

Analytics and recommendations remain projections with privacy/currentness/coverage boundaries. Fleet prevalence cannot establish trust-root currentness, compromise time or recovery authority. A recommendation to rotate is not the rotation occurrence and does not authorize it.

### :10 — succession of exclusive rights and live obligations

The transfer law for an exclusive right is directly applicable to recovery/effect authority: successor legitimacy does not duplicate predecessor authority. Live obligations retain occurrence/effect identity across authority succession. Unknown predecessor effects consume safety margin.

### :20 — total anchor loss / rebootstrap

Total loss creates a new qualified recovery epoch with an explicit gap; it does not reconstruct missing negative evidence. This round addresses the less catastrophic but common case in which predecessor/successor roots coexist or partially survive and therefore continuity can often be proved more strongly than rebootstrap-with-gap.

### :40 — operational UX saturation

The broad monitoring/UX surface remains saturated. `No alert != healthy`, `Visible widget != current evidence`, `No Data != zero`, and evaluator health remains distinct from target health. This round adds no monitoring taxonomy; it only adds trust-rotation evidence that existing Observatory/Operations surfaces may project.

## 4. External grammars and contradictory evidence

### 4.1 TUF — root succession requires predecessor and successor authorization

The Update Framework root-update workflow requires an intermediate root to be signed by the threshold trusted by the previous root and by the threshold declared by the new root. Clients advance roots sequentially and persist the new trusted root. TUF also distinguishes rollback/freeze resistance from ordinary signature verification.

Portable grammar:

`old trust authorizes transition + new trust accepts transition -> qualified root succession`.

Not imported as a universal implementation: TUF metadata formats, version integers or update roles.

Critical G4 lesson: a new root that merely signs itself does not prove continuity from the old trust epoch. Conversely, a historically valid old root signature can remain useful historical evidence after the old root loses authority for new effects.

### 4.2 SPIFFE — overlap is operationally useful but scope binding is security-critical

SPIFFE federation recommends publishing new keys before they are used and retaining deprecated keys until no active valid SVIDs remain. Bundles are expected to change over time. Critically, foreign trust-domain bundles must remain associated with their trust-domain names and must not be merged into one undifferentiated root pool, because doing so enables cross-domain impersonation.

Portable grammar:

`publish successor verification material -> overlap -> stop new issuance under predecessor -> wait for predecessor-issued credentials to drain/expire -> remove predecessor verification material`.

But overlap is only a verification/distribution technique. It does not mean both issuers possess equal recovery/business authority.

### 4.3 Sigstore — historical verification and current trust are separable

Sigstore uses TUF for trust-root distribution, threshold root signing, rotation and revocation. Its threat model explicitly allows compromised material to be marked with compromise timing so legitimate signatures before compromise can remain verifiable, while freshness prevents indefinite use of old key material.

Portable lesson:

`historical authenticity disposition` and `current admissibility disposition` are independent dimensions.

Air-gapped Sigstore policy-controller deployments can carry serialized TUF roots/repositories or explicit keys and require manual rotation when disconnected. This directly demonstrates that possession of valid offline trust material does not imply currentness.

### 4.4 Kubernetes — multiple verification keys are ordinary during rotation

Kubernetes service-account verification can accept multiple public keys. This is evidence that overlap of verification material is operationally normal, not evidence that all accepted keys should remain signing authorities indefinitely.

## 5. Primary finding — trust succession has at least four independent semantics

A single `trusted=true` boolean is insufficient. Candidate dimensions:

```text
TrustEpochRef
  trustDomainRef
  issuerRef
  epochId
  predecessorEpochRefs[]
  successorEpochRefs[]
  verificationMaterialRefs[]
  issuanceAuthorityDisposition
  verificationDisposition
  recoveryAuthorityDisposition
  effectAuthorityDisposition
  historicalValidityPolicyRef
  compromiseDisposition
  compromiseBound
  overlapWindow
  securityFloor
  currentnessEvidenceRefs[]
  transitionEvidenceRefs[]
```

At minimum distinguish:

1. **Historical verification authority** — may this material verify a statement claimed to have been produced in its historical validity interval?
2. **Current verification acceptance** — may a verifier accept this issuer/material for a claim observed now?
3. **Current issuance authority** — may this issuer mint new credentials/evidence?
4. **Recovery/effect authority** — may evidence from this issuer authorize a restore or other new external effect?

None implies all others.

## 6. Candidate trust-rotation state machine

```text
ROTATION_PROPOSED
-> PREDECESSOR_AUTHORITY_QUALIFYING
-> SUCCESSOR_MATERIAL_QUALIFYING
-> TRANSITION_PROOF_BUILDING
-> SUCCESSOR_PUBLISHED
-> DISTRIBUTION_OBSERVING
-> OVERLAP_ACTIVE
-> SUCCESSOR_ISSUANCE_ACTIVE
-> PREDECESSOR_NEW_ISSUANCE_DISABLED
-> PREDECESSOR_CREDENTIAL_DRAINING
-> OFFLINE_COVERAGE_RECONCILING
-> PREDECESSOR_EFFECT_AUTHORITY_FENCING
-> RETIREMENT_QUALIFYING
-> PREDECESSOR_RETIRED_FOR_NEW_EFFECTS
-> HISTORICAL_VERIFICATION_POLICY_ACTIVE
-> ROTATION_EFFECTIVE
```

Failure/degraded branches:

```text
PREDECESSOR_COMPROMISED
COMPROMISE_TIME_UNKNOWN
TRANSITION_SIGNATURE_INSUFFICIENT
SUCCESSOR_NOT_DURABLY_DISTRIBUTED
OFFLINE_SITE_BELOW_FLOOR
FORKED_SUCCESSOR_ROOTS
RECOVERY_AUTHORITY_CONFLICT
OLD_CREDENTIALS_STILL_LIVE
EFFECT_SIDE_FENCE_UNKNOWN
HISTORICAL_EVIDENCE_QUARANTINED
REBOOTSTRAP_WITH_GAP_REQUIRED
```

`SUCCESSOR_PUBLISHED != ROTATION_EFFECTIVE`.

## 7. Overlap semantics — verify-many does not mean authorize-many

Overlap is useful because offline/slow consumers need time to obtain successor verification material and predecessor-issued credentials may remain valid. But G4 must prevent a common abstraction error:

`verification key set = {old,new}` does **not** imply `effect authority set = {old,new}`.

Candidate dispositions per issuer/epoch:

```text
ISSUE_AND_VERIFY
VERIFY_HISTORICAL_AND_CURRENT
VERIFY_HISTORICAL_ONLY
VERIFY_QUARANTINED
NO_NEW_EFFECT_AUTHORITY
REVOKED_AFTER_BOUND
REVOKED_UNBOUNDED
UNKNOWN
```

An issuer can be retained solely so historical artifacts remain interpretable while being categorically barred from authorizing restore, publish, deploy, credential issuance or other new effects.

## 8. Compromise timing is a first-class proof dimension

If compromise is bounded to time `Tc`, evidence can be classified relative to that bound only when trustworthy timestamp/provenance evidence supports the comparison.

Candidate historical dispositions:

```text
PROVEN_PRE_COMPROMISE
POSSIBLY_PRE_COMPROMISE
AT_OR_AFTER_COMPROMISE
TIME_UNRESOLVED
PROVEN_FORGED_OR_INVALID
```

Rules:

- `signature verifies cryptographically != produced before compromise`;
- `artifact timestamp != trusted production time`;
- `transparency inclusion time != necessarily business effect time`;
- `compromise discovered at Td != compromise began at Td`;
- if compromise bound is unknown, historical evidence requiring the issuer may need quarantine/requalification rather than blanket acceptance or blanket deletion.

Historical evidence is never rewritten merely because trust later changes; its admissibility disposition changes with provenance.

## 9. Recovery-authority continuity

Recovery authority is modeled independently from root-verification continuity.

Candidate `RecoveryAuthorityTransition`:

```text
transitionId
recoveryDomainRef
predecessorAuthorityEpochRef
successorAuthorityEpochRef
trustTransitionRef
organizationalAuthorityRef
rightTransferOrFenceRef
allowedRestoreClasses[]
blockedRestoreClasses[]
offlineCoverageVector
negativeEvidenceCoverage
predecessorEffectFenceEvidence
emergencyPolicyRef?
currentnessEvidenceRefs[]
unknowns[]
disposition
```

Candidate disposition:

```text
PLANNED
TRANSITION_PROVEN
PARTIAL_OFFLINE_COVERAGE
PREDECESSOR_NOT_FENCED
SUCCESSOR_CURRENT_BUT_HISTORY_GAPPED
EMERGENCY_BOUNDED
QUARANTINED
EFFECTIVE
UNKNOWN
```

A successor trust root can be current while recovery authority remains blocked because predecessor effect authority is not fenced or negative-evidence coverage is incomplete.

## 10. Long partition behavior

A disconnected runtime/DR site retains three independent questions:

```text
Can I interpret historical evidence?
Can I authenticate current peers/claims?
Can I authorize a new recovery/effect?
```

The first may remain `YES` under old material while the second/third degrade to `STALE`, `BELOW_FLOOR`, `QUARANTINED` or `BLOCKED`.

A local trust floor must be monotonic across ordinary restart/restore. Fetching an older but valid bundle cannot roll it back. When no qualified successor material is reachable, the runtime may continue only within declared offline horizons and operation classes; it must not infer perpetual trust.

## 11. Forked rotation

If common predecessor `I0` produces two claimed exclusive successors `IA` and `IB` during partition, do not choose by timestamp, provider replication order or key freshness.

Candidate reconciliation asks:

- did `I0` validly authorize one or both transitions under the predecessor threshold/policy?
- did an external organizational/recovery authority allocate exclusive authority?
- are the successor claim classes actually conflicting?
- did either branch observe a later qualified revocation/fence?
- are effect-side fences already active?
- can both branches remain historical-verification authorities while only one becomes current effect authority?

Outcome remains `JOINED_NONCONFLICTING`, `AUTHORITY_RECONCILIATION_REQUIRED`, `QUARANTINED_CONFLICT`, `REBOOTSTRAP_WITH_GAP`, or `UNKNOWN`.

## 12. Total anchor loss boundary

The :20 rebootstrap research is the fallback when continuity cannot be proven. This round adds the boundary:

```text
Qualified cross-signed/authorized succession -> CONTINUITY_PROVEN_OR_PARTIAL
No surviving predecessor authorization / insufficient chain -> REBOOTSTRAP_WITH_KNOWN_OR_UNKNOWN_GAP
```

A newly established root after total loss can define a new trust epoch and future safety floor. It cannot certify that no missing predecessor revocation, right transfer or external effect existed.

## 13. Web Desktop synthesis

### 13.1 Desktop Sphere taxonomy

No taxonomy change. Recovery/trust administration belongs in guided Security/Operations/Recovery spheres/applications. Builder Home/Factory may expose fleet-level non-authoritative status. Free-form 3D is not required.

### 13.2 Window Manager / multi-display

`WindowSession` may inspect trust lineage but does not own it. Every destructive/authority-bearing action requalifies current semantic context and trust generation. Secondary displays may be stale; trust generation/currentness must be visible where material. Closing a window does not cancel a trust transition.

### 13.3 Observatory vs Pinned Monitoring Surface vs Operations Desktop

- **Desktop Observatory:** read-mostly trust/currentness/fork/coverage projection.
- **Pinned Monitoring Surface:** concise signals such as `issuer below floor`, `offline site stale`, `rotation incomplete`, `recovery authority blocked`.
- **Operations Desktop:** qualified transition/reconciliation/recovery actions.

Monitoring never becomes acknowledgement or transition authority.

### 13.4 Application Manager

Installing/adopting a KMS, identity, PKI or recovery integration does not trust it. Discovery produces claims; verification/qualification establishes compatibility and trust semantics. Provider upgrade/endpoint replacement can invalidate only the affected qualification dimensions.

### 13.5 Control Center

Control Center owns declarative intent/configuration/provenance surfaces for trust domains, issuer roles, overlap policy, offline horizon, recovery authority and provider bindings. It must expose inheritance and source provenance. Effective trust state remains observed evidence.

### 13.6 Declarative service deployment / auto-binding / Vault

A semantic service definition may declare required trust/recovery capabilities. YAML/provider artifacts remain realizations. Auto-binding may select/propose providers only with visible qualification and provenance. SecretRefs never expose secret values. Root/issuer material and recovery credentials have separate lifecycle/authority semantics.

### 13.7 Hosting / placement

Trust/recovery witnesses may be deliberately placed across independent failure/administrative domains. Placement diversity is evidence for resilience only under declared correlated-failure assumptions; `different host != independent trust root`.

### 13.8 External mature tool reuse

Do not rebuild mature KMS/HSM/PKI/identity/recovery consoles. Prefer native SB semantic intent/evidence plus provider API adapters and deep links for specialist recovery. Embedded provider UIs remain conditional on isolation, CSP, licensing and authority qualification.

### 13.9 Proprietary editor family / semantic bridge

Workflow/View/Form/Component editors consume shared trust/currentness/effect-authority primitives. They do not invent issuer semantics locally. A button remains a UI affordance, not a domain command; a Form remains distinct from Workflow State; a View remains distinct from Workflow Activity.

## 14. Application Portfolio Matrix delta

No mode becomes universal.

| Task/capability | Preferred candidate modes | Why / critical qualification |
|---|---|---|
| Trust lineage / rotation intent | Native SB + API-backed | SB owns semantic intent/evidence; provider executes key/issuer operations |
| KMS/HSM key/root administration | Hybrid + Deep-link; Native bridge only for local hardware | preserve provider-native safety/recovery semantics; avoid console rebuild |
| Identity/PKI provider administration | API-backed + Hybrid + Deep-link | API common path, specialist recovery in mature console |
| Air-gapped trust-bundle inspection/import | Native SB + Hybrid/Native bridge | local media/device may require bridge; import remains untrusted until qualified |
| Recovery authority transition | Native SB + API-backed/Hybrid | business/recovery authority semantics cannot be delegated to provider UI |
| Historical evidence verification | Native SB + API-backed verification services | preserve immutable evidence identity and historical/current split |
| Trust/recovery observability | Native SB + API-backed/Proxied | normalized projections allowed; no fabricated equivalence |
| Provider forensic/recovery console | Deep-link or qualified Embedded | specialist semantics, licensing and authority remain provider-native |

Matrix criteria refined:

- security/trust-domain binding;
- predecessor/successor authorization fidelity;
- overlap semantics;
- compromise-time evidence;
- historical-verification fidelity;
- current issuance/effect-authority separation;
- offline currentness/floor behavior;
- recovery-authority continuity;
- fork detection/reconciliation;
- provider lifecycle/replaceability;
- licensing/embed constraints;
- portability of transition evidence;
- ability to preserve `UNKNOWN/PARTIAL/CONFLICT`;
- lock-in created by provider-native trust metadata;
- UX recovery depth without silent authority escalation.

## 15. Componentization complexity map

### C0/C1 semantic refs/dispositions

- `TrustDomainRef`
- `TrustEpochRef`
- `IssuerEpochRef`
- `TrustTransitionRef`
- `CompromiseBoundRef`
- `HistoricalValidityDisposition`
- `CurrentIssuerDisposition`
- `RecoveryAuthorityEpochRef`
- `RecoveryAuthorityTransitionRef`
- `OfflineTrustFloorRef`
- `TrustCoverageClaimRef`

### C2 reusable compounds

- trust lineage badge/card;
- predecessor/successor transition timeline;
- historical-vs-current validity panel;
- offline coverage/currentness indicator;
- compromise-bound inspector;
- recovery-authority transition panel;
- fork/conflict/quarantine presentation;
- provider qualification/currentness card.

### C3 shared foundations

- `TrustLineageBoundary`
- `TrustTransitionQualificationBoundary`
- `IssuerRoleDispositionBoundary`
- `HistoricalVerificationBoundary`
- `CompromiseBoundQualificationBoundary`
- `OfflineTrustFloorBoundary`
- `TrustBundleCurrentnessBoundary`
- `RecoveryAuthorityTransitionBoundary`
- `PredecessorEffectFenceQualificationBoundary`
- `TrustForkReconciliationBoundary`
- `ProviderTrustSemanticsAdapterBoundary`
- `TrustEvidenceDisclosureBoundary`

### Application/domain-specific work that should not be generalized away

- organizational/legal recovery authority;
- domain-specific exclusive-right transfer;
- workflow/task reassignment semantics;
- provider-specific HSM break-glass procedure;
- retention/legal-hold release;
- business effect compensation/remediation;
- application-specific publish/deploy authority.

This decomposition reduces repeated trust/currentness UX and adapter logic without making a shared foundation the owner of business authority.

## 16. Performance / resource / accessibility implications

No empirical threshold is invented.

Performance budgets should eventually measure trust-bundle cardinality, lineage depth, verification cost, offline update catch-up, cross-signature chain depth, certificate/token overlap population, provider API latency and historical-evidence verification volume. Compaction/cache may optimize only if trust/currentness semantics remain provable.

Accessibility/small-screen equivalence requires that `historical valid`, `current trusted`, `below floor`, `quarantined`, `forked`, `recovery blocked` and `unknown` are textually distinguishable and keyboard/screen-reader operable. Color or topology diagrams cannot be the sole carrier. Small-screen views may sequence details but cannot hide conflict/currentness required for a decision.

## 17. Adversarial proof matrix

Future executable/prototype validation, when separately authorized, should cover at least:

1. new root self-signs without predecessor authorization -> continuity rejected;
2. successor transition satisfies predecessor threshold but not successor threshold -> rejected;
3. old root verifies historical evidence after retirement -> historical verification may remain valid, new effects blocked;
4. old root compromised with known bound -> pre/post-bound evidence classified separately;
5. compromise bound unknown -> no blanket historical-current equivalence;
6. offline DR site has old valid bundle below current floor -> restore/new effect blocked or bounded;
7. old and new verification keys overlap -> no automatic dual effect authority;
8. predecessor still issuing after successor activation -> rotation incomplete/conflict;
9. predecessor credentials still valid after new issuance disabled -> drain state visible;
10. predecessor effect authority not fenced -> successor recovery effect blocked where conflict matters;
11. two exclusive successor roots from common predecessor -> authority reconciliation, not timestamp winner;
12. two non-conflicting claim-class successors -> may coexist only if policy proves scopes independent;
13. stale secondary display shows predecessor as current -> action requalifies against current state;
14. Application Manager discovers new issuer endpoint -> `Discovered != Verified`;
15. provider adapter maps `active` to fully trusted -> rejected unless dimensions proven;
16. SPIFFE-like bundle accidentally pools two trust domains -> isolation failure;
17. trust-domain name/bundle binding tampered -> verification rejected/quarantined;
18. root bundle fetched successfully but currentness evidence stale -> not current by transport success;
19. historical artifact timestamp forged but signature valid -> compromise-time classification remains unresolved;
20. transparency inclusion exists but business effect time unknown -> no fabricated effect-time proof;
21. recovery authority successor legitimate but predecessor external effect unknown -> safety margin preserved;
22. total predecessor root loss -> new root produces rebootstrap epoch, not retroactive continuity;
23. old root rediscovered after rebootstrap -> reconciliation input, not automatic rollback;
24. emergency recovery authority used -> bounded recovery only; historical trust not rewritten;
25. root rotation while Workspace offline past horizon -> local reads may continue only where allowed; new effects requalified;
26. provider migration during overlap -> transition evidence preserves issuer/trust lineage;
27. deep link opens provider console with broader authority than SB user -> SB does not infer successful/authorized semantic effect;
28. Embedded console CSP/auth session expires while rendered stale -> currentness visible, effects blocked/requalified;
29. 9,999 sites updated and one critical DR site unknown -> aggregation does not erase minority `UNKNOWN`;
30. analytics recommends retiring predecessor because no recent usage observed -> recommendation has no retirement authority;
31. old issuer key retained solely for historical verification -> telemetry must not label it simply `active`;
32. root retirement deletes historical verification material required by retained evidence -> retirement qualification fails or requires durable alternate verification evidence;
33. trust transition evidence compacted -> compaction proof must preserve live historical/current questions;
34. browser/session restore reopens pre-rotation Operations view -> presentation restored, authority/currentness requalified;
35. small-screen UI hides compromise/fork detail behind inaccessible affordance -> equivalence failure;
36. screen reader hears `trusted` without historical/current qualifier -> semantic accessibility failure.

## 18. Closure-target impact / saturation

No closure target is reopened wholesale.

- Web Desktop ADR/taxonomy: stable, high saturation.
- Window Manager/multi-display: stable; trust generation/currentness is another semantic context to requalify.
- Observatory/Pinned/Operations separation: stable.
- Application Portfolio Matrix: materially refined for trust/recovery integration.
- Application Manager lifecycle: stable; trust qualification is not install/adopt/discovery.
- Control Center: materially refined for trust-domain/rotation provenance and effective-state separation.
- Declarative deployment/auto-binding/Vault: refined by trust-domain/currentness/SecretRef separation.
- Hosting/placement: refined by trust-domain/failure-domain diversity distinction.
- External integration/security: materially refined by trust-domain binding and historical/current authority split.
- Proprietary editor foundation: shared trust/currentness/effect-authority primitives strengthened.
- Workflow/View/Form/Component bridge: no taxonomy change.
- Accessibility/small-screen: proof obligations refined, no new primitive family.
- Performance/resource budgets: still empirically immature.
- Failure/recovery/session restore: materially refined.
- Adversarial matrix: expanded.
- Componentization complexity map: materially refined.

## 19. Material findings

### F-TROT-01 — historical authenticity and current authority are orthogonal
A root/issuer can remain necessary to verify retained historical evidence while being forbidden from authorizing any new effect.

### F-TROT-02 — overlap is a distribution technique, not authority union
Multiple verification keys may coexist during rotation; current issuance, recovery and effect authority remain separately qualified.

### F-TROT-03 — root succession needs transition proof
A successor root must be linked by a qualified transition law or explicitly classified as rebootstrap-with-gap. Self-signature alone proves no predecessor continuity.

### F-TROT-04 — compromise time changes evidence disposition, not history
Known compromise bounds can preserve some historical verification while invalidating later evidence; unknown bounds require explicit uncertainty/quarantine.

### F-TROT-05 — offline possession does not defeat trust floors
An offline site may possess cryptographically valid old roots yet be below the current admissibility floor for new recovery/effects.

### F-TROT-06 — recovery authority succession needs effect-side fencing
Organizational/root succession does not prove predecessor external-effect inability. Where exclusivity matters, effect-side fencing or equivalent evidence remains necessary.

### F-TROT-07 — trust-domain binding is part of the security contract
A generic pooled root set can destroy isolation. Adapter normalization must preserve trust-domain-to-bundle binding.

### F-TROT-08 — total anchor loss is a distinct degraded mode
When transition proof is impossible, the correct result is a new epoch with explicit continuity gap, not fabricated trust continuity.

## 20. Remaining gaps / next vector

The broad Web Desktop shell remains documentarily saturated. Material gaps remain in trust/recovery semantics and empirical budgets.

Highest-value next vector:

**historical-verification material retirement and evidence survivability** — when old roots/certificates/log keys must eventually be removed from active trust stores, determine what minimal durable verification material/proof envelope must accompany retained evidence so that audits remain independently verifiable without keeping retired issuers executable/current; include algorithm deprecation, certificate-chain expiry, transparency-log key rotation, crypto-agility, offline archives and provider exit.

This may still change evidence envelopes, archive contracts, provider replaceability, trust-store lifecycle, Control Center semantics and future component boundaries. Therefore the research remains `RESEARCH_ACTIVE / NON_EXECUTABLE`.