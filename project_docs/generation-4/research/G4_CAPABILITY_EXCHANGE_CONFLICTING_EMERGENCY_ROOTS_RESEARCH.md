# G4 — Conflicting Emergency Roots and Constitutional Trust Split-Brain

Status: `RESEARCH_ACTIVE / NON_EXECUTABLE`
Date: 2026-09-20
Scope: Generation 4 product R&D only. No implementation authority.

## 1. Research question

How should autonomous System Builder/client runtimes behave when the normal policy/root trust path is unavailable or compromised and disconnected populations receive two or more independently plausible emergency recovery roots that cannot be ordered by normal in-band succession — without reducing trust to peer majority, allowing an emergency root to become business authority, requiring a permanent global root oracle, or erasing evidence when the constitutional trust conflict is eventually settled?

This is a focused continuation of `G4_CAPABILITY_EXCHANGE_EMERGENCY_ROOT_TRUST_REBOOTSTRAP.md`, not a new macro-family and not a reopening of G3.

## 2. Evidence base

Primary standards and mature-system evidence reviewed:

- TUF specification/FAQ and its survivable-key-compromise model: below-threshold compromise can rotate in-band; compromise of the Root threshold requires out-of-band root re-issuance. This establishes that emergency recovery is a trust-discontinuity class rather than ordinary succession.
- RFC 5011 (DNSSEC trust-anchor updates): a resolver maintains local trust-anchor state; addition requires hold-down while valid revocation, once observed, is immediate/permanent. A formerly trusted key is not silently resurrected by later stale material.
- RFC 8488 and RFC 8897 (RPKI relying parties): several configured trust anchors are validated concurrently and independently; an RP chooses/configures its trust anchors. Multiple roots therefore do not imply a single total order or automatic majority winner.
- RFC 8630 / RFC 7730 (RPKI TAL): a TAL securely binds retrieval locations to a trust-anchor public key; multiple URIs are transport alternatives for the same pinned key, not multiple competing authorities. Location failover must not be confused with trust-root substitution.
- RFC 9691 (RPKI Trust Anchor Keys, 2024): planned successor keys can be announced while an RP still uses one current key, with acceptance timers and coexistence for older clients. This is useful contrast: planned rollover has an authenticated predecessor relation; emergency competing roots may not.
- Sigstore threat model: its TUF root uses offline threshold keys, organizational/geographic distribution, compromise-time-aware revocation and freshness. This reinforces that root assurance depends on qualified custody/failure domains, not signature count or network popularity.
- Uptane deployment guidance: Root roles warrant high thresholds, offline storage and separated custodians. This supports qualified independence assumptions for emergency authorities.

No TUF, DNSSEC, RPKI, Sigstore, Uptane, quorum algorithm, ledger, consensus protocol, HSM, gateway or broker is selected.

## 3. Material findings

### 3.1 Emergency-root conflict is constitutional split-brain, not ordinary replica split-brain

If populations A and B each possess a locally plausible emergency root RA/RB but neither root has a proof path that dominates the other under the last common admissible recovery anchor, the conflict concerns who may authorize future trust policy itself.

`Conflicting recovery roots != conflicting business replicas`.

Ordinary merge/LWW/leader-election rules cannot manufacture constitutional authority.

### 3.2 Local validity does not create global comparability

A root may be valid under one runtime's pinned recovery closure while unknown or inadmissible under another's.

`Locally admissible RA + locally admissible RB != RA and RB are mutually compatible`.

The system needs a representable `CONTESTED_ROOT`/trust-frontier disposition rather than coercing a total order.

### 3.3 Majority is evidence, not constitutional truth

Peer count, deployment count, newest timestamp, most signatures, most reachable sites or Builder preference do not choose a root unless the pre-incident recovery constitution explicitly gives that metric authority.

`Most observed root != authoritative root`.

This preserves the existing G4 rule that differential agreement/disagreement is evidence rather than majority truth.

### 3.4 Planned succession and emergency competition must remain distinguishable

RFC 9691-style planned rollover has predecessor-authenticated successor information and acceptance timing. Competing emergency roots may lack any trustworthy predecessor authorization because the predecessor itself is compromised.

`Successor announced by trusted predecessor != emergency claimant after predecessor compromise`.

A transport/schema field called `successor` cannot fabricate this missing relation.

### 3.5 Multiple retrieval locations are not multiple roots

RPKI TAL permits several URIs while pinning one public key. This provides a clean negative lesson for the Exchange Plane:

`Multiple endpoints for one root != multiple roots`.

Gateway/broker/CDN/Exchange Plane path diversity may improve availability but does not settle RA vs RB.

### 3.6 A runtime needs a constitutional trust frontier

Candidate representation is a set of root claims with explicit relations such as `ADMITTED_LOCAL`, `SUPERSEDES`, `REVOKES`, `INCOMPARABLE`, `CONTESTED`, `RETIRED`, plus evidence/provenance/currentness. The frontier is not a shared business model and does not own capability state.

`Trust frontier != canonical business state`.

### 3.7 Protected effects must be scoped to the disputed root dependency

A root conflict need not halt every runtime operation. Operations whose authorization/security proof materially depends on the disputed constitutional root cannot safely gain new protected effects merely for availability. Independent local operations may continue under their own invariants/horizons.

`Constitutional root conflict != mandatory total outage`.

But:

`Availability pressure != permission to union RA and RB`.

### 3.8 Permission union is an unsafe reconciliation default

During conflict, accepting anything authorized by RA OR RB turns a split into privilege expansion.

`RA OR RB permissions != safe overlap policy`.

If bounded operation is possible, candidate safe behavior is based on an explicitly pre-authorized common floor/intersection or operations independent of the disputed root — never an invented union.

### 3.9 Root intersection is not automatically semantically safe either

Even an apparent permission intersection may hide incompatible guarantee vectors, revocations, classifications or semantic profiles.

`Set intersection of permissions != contract compatibility proof`.

Any common-mode continuation remains qualified by the same multidimensional compatibility/currentness/authority rules already established for G4.

### 3.10 Cross-population exchange must carry root lineage

Messages/events/commands crossing RA/RB populations need effective root/policy lineage and currentness so the receiver can classify them without pretending delivery establishes admissibility.

`Message delivered across root frontier != message authorized locally`.

Exchange Plane transports evidence; it does not choose the constitutional winner.

### 3.11 Root settlement is distinct from business settlement

A later authority may determine that RA survives and RB is retired. That settles future trust authority, not all business effects produced while RB governed a population.

`Root settlement != historical effect settlement`.

RB-era effects remain facts with provenance and may require capability-local reconciliation/remediation.

### 3.12 Losing roots remain historical evidence

A defeated/revoked emergency root may need to remain resolvable so historical signatures, observations and conflict evidence can be interpreted.

`Root authority retired != root evidence erased`.

This mirrors the existing security-retirement versus historical-interpretation distinction.

### 3.13 Retirement must be monotonic against resurrection paths

After a runtime learns qualified settlement retiring RB, stale snapshot, cache, offline package or isolated peer must not restore RB's new-effect authority.

`Retired emergency root != reusable emergency root`.

Retirement/floor evidence must outlive every realistic resurrection path or be subsumed by stronger durable state.

### 3.14 Settlement authority must itself be justified

A third root RC cannot settle RA/RB merely because it is newer or centrally published. The settlement path needs authority from a prequalified recovery constitution, an independently established OOB procedure, or another explicitly qualified mechanism.

`Third root != neutral root by naming`.

### 3.15 Root conflict can remain unresolved

There are states where neither side can prove superiority and no safe external settlement authority is currently reachable.

`No justified winner != choose one for liveness`.

`UNKNOWN/CONTESTED` is a valid constitutional state. Protected effects can remain blocked while evidence is preserved.

### 3.16 Trust-domain scope prevents unnecessary global conflict

RA/RB may be conflicting only for one trust/capability domain. Independent domains need not inherit the dispute.

`Root conflict scope follows authority scope`.

This prevents a universal root store or central Exchange Plane from amplifying one domain incident into platform-wide shutdown.

### 3.17 Root identity and business tenant identity remain separate

Tenant/classification context must survive the crossing, but a recovery root cannot acquire business ownership merely because it authenticates trust-policy material.

`Root authority != tenant/business authority`.

### 3.18 Autonomous runtimes need locally checkable settlement closure

A runtime that reconnects after the dispute should be able to evaluate a settlement package from durable local anchors/floors and qualified OOB evidence without mandatory live Builder consultation.

`Settlement closure verified locally != global online root oracle`.

### 3.19 Long-offline runtimes may require quarantine rather than forced convergence

A runtime returning with RB after RB has been retired cannot simply be told “latest is RA.” It must establish the retirement/successor chain or enter explicit re-bootstrap/quarantine.

`Latest root advertisement != recovery proof`.

### 3.20 Root-conflict settlement cannot rewrite admission lineage

An obligation admitted under RB remains RB-lineage even if delivered after RA wins. Re-admission under RA is a new explicit semantic act, not relabeling.

`Delivery after settlement != admission under settlement root`.

### 3.21 Root conflict does not authorize gateway/adapter canonical state

Gateways/adapters may quarantine, route, attach lineage or reject incompatible crossings. They must not maintain the canonical winner or business truth as hidden mutable state.

`Boundary enforcement state != canonical trust/business ownership`.

### 3.22 One broker outage or partition must not define constitutional truth

A broker may make one root more visible than another. Visibility topology is not authority.

`Observed through surviving corridor != constitutionally authoritative`.

This protects the logical Exchange Plane from collapsing into a single-broker root oracle.

### 3.23 Evidence convergence can precede authority convergence

Populations may exchange both RA and RB evidence and agree that the conflict exists while still lacking authority to resolve it.

`Shared conflict evidence != shared winner`.

This is useful: evidence federation can improve diagnosis without fabricating settlement.

### 3.24 Constitutional recovery should minimize permanent exceptional authority

Any human/OOB/ceremonial mechanism used to settle RA/RB should terminate after producing bounded successor/retirement evidence.

`Emergency settlement mechanism != permanent super-root`.

## 4. Candidate vocabulary

Research vocabulary only:

- `ConstitutionalTrustFrontier` — locally known set of materially live root claims and qualified relations.
- `RootClaimRef` — immutable reference to a root/recovery-root claim plus scope and provenance.
- `RootConflictRef` — evidence that two or more root claims are materially incomparable/incompatible for a protected scope.
- `RootRelation` — qualified relation such as `SUPERSEDES`, `REVOKES`, `INCOMPARABLE`, `COEXISTS_INDEPENDENT_SCOPE`, `UNKNOWN`.
- `RootSettlementRef` — bounded evidence resolving a named constitutional conflict for future authority.
- `RootRetirementRef` — durable evidence removing new-effect authority while preserving historical resolvability.
- `SettlementClosureRef` — locally verifiable package sufficient to move a runtime from contested/quarantined trust to a qualified settled frontier.
- `RootLineageRef` — root/policy lineage attached to an admitted interaction/effect.

## 5. Candidate proof obligations

1. Two locally valid emergency roots are not treated as mutually compatible or globally ordered without qualified relation evidence.
2. Peer/deployment/signature majority cannot select constitutional authority unless explicitly authorized by the pre-incident constitution.
3. Planned predecessor-authorized succession remains distinguishable from emergency claimant competition.
4. Endpoint/path/broker diversity cannot fabricate root diversity or root settlement.
5. A representable contested-root state exists; liveness pressure cannot force a false winner.
6. Protected new effects fail closed/qualified when their authority materially depends on an unresolved root conflict.
7. Independent operations/domains may continue only when their invariants do not depend materially on the disputed root.
8. RA/RB permission union is never an implicit degraded-mode policy.
9. Any common/intersection mode is itself contract-, guarantee-, revocation-, classification- and currentness-qualified.
10. Cross-frontier messages preserve effective root/policy lineage, tenant/classification, provenance and currentness.
11. Exchange Plane/gateway/broker cannot choose or own the constitutional winner.
12. Root settlement remains separate from capability-local business/effect settlement.
13. Retired/defeated roots remain historically resolvable where required for evidence interpretation.
14. Retirement/floor state prevents resurrection through snapshot, stale cache, offline package or isolated peer.
15. A settlement root/mechanism proves its own authority path; newer/central/more reachable is insufficient.
16. `UNKNOWN/CONTESTED` remains representable when no justified settlement exists.
17. Conflict and settlement are trust-domain/authority-scope qualified rather than automatically global.
18. Recovery-root authority cannot become tenant/business ownership.
19. Autonomous runtimes can verify sufficient settlement closure without mandatory live Builder/central oracle access where autonomy is declared.
20. Long-offline runtimes cannot regain protected effect authority from a retired root without qualified recovery/re-bootstrap.
21. Historical obligation/effect lineage is not relabeled when a different root later wins.
22. Gateway/adapter enforcement state does not become canonical trust or business state.
23. Evidence convergence does not imply authority convergence.
24. Emergency settlement authority has bounded scope and an explicit retirement/termination path.

## 6. Adversarial cases

1. Population A sees RA, population B sees RB; system picks whichever has more online runtimes.
2. Builder publishes RA as “latest” and clients treat Builder preference as constitutional authority.
3. RA has 5 signatures, RB has 3, but RA's five custodians share one compromised failure domain; count chooses RA.
4. Broker partition makes RA visible to 80% of consumers; visibility becomes authority.
5. Gateway accepts RA OR RB permissions during conflict, silently expanding privilege.
6. Apparent RA/RB permission intersection is used despite incompatible revocation/classification semantics.
7. Message from RB population crosses to RA population without root lineage and is executed as locally authorized.
8. RA wins later and all RB-era effects are relabeled as RA-authorized.
9. RB is retired and deleted completely, making historical RB signatures/effects uninterpretable.
10. Runtime restores an old snapshot and resurrects RB after qualified retirement.
11. A third root RC arrives from a central endpoint and is accepted as neutral with no qualified settlement authority.
12. Operator chooses a winner solely to restore availability although constitutional evidence remains contested.
13. Conflict in trust domain X freezes unrelated domain Y because roots were pooled globally.
14. Recovery root authenticates a tenant context and is incorrectly granted ownership of tenant business state.
15. Long-offline runtime accepts “everyone now uses RA” as sufficient recovery proof.
16. Long-offline runtime continues protected RB-authorized effects indefinitely because it never received retirement evidence.
17. Obligation admitted under RB is redelivered after RA settlement and counted as newly RA-authorized.
18. Adapter stores a hidden mutable `winningRoot` and becomes accidental canonical trust owner.
19. Service mesh routing policy is treated as evidence that RA is authoritative.
20. One broker outage isolates settlement evidence and the system reports false success/convergence.
21. Populations exchange RA/RB proofs, agree on bytes, and incorrectly infer that authority conflict is solved.
22. Emergency human ceremony settles RA/RB but its key/process remains a permanent super-root.
23. Root settlement is used to select a canonical business branch despite unresolved irreversible effects.
24. A stale recovery package omits RB retirement and silently downgrades the runtime's learned constitutional floor.

## 7. Interaction with Shared Semantic Kernel / Capability Exchange Plane

The candidate Shared Semantic Kernel may need only stable structural primitives sufficient to reference root claims, immutable revisions, time/currentness, provenance/evidence, authority scope, qualified relations and exchange-envelope lineage. It must not contain a shared business entity or a universal mutable `CurrentRoot` owner.

The candidate Capability Exchange Plane may carry root-conflict/settlement evidence, enforce declared crossing policy, route/quarantine incompatible interactions and preserve lineage. It must not settle constitutional conflict by topology, majority, broker state or gateway preference, and must not settle capability-local business truth.

A candidate boundary remains:

`Capability Core -> Ports -> Contract -> Exchange Policy -> Exchange Plane -> target boundary`

with root/policy lineage qualifying the crossing rather than becoming capability ownership.

## 8. Portability / exit-path implications

- Root/conflict/settlement semantics must remain representable independently of TUF, DNSSEC, RPKI, Sigstore, a specific HSM, broker or gateway.
- Multiple transports can distribute the same settlement closure; transport replacement must not change constitutional meaning.
- Historical root/effect lineage must be exportable so changing providers does not erase contested history.
- No central Exchange Plane service may become mandatory for an autonomous runtime to interpret its durable trust frontier.

## 9. Deduplication

This round does not reopen generic root rotation, witness governance, partial policy rollout, split-brain business reconciliation, profile negotiation, DR, cache invalidation or ordinary emergency re-bootstrap. The material delta is narrowly:

`root-threshold compromise -> independently plausible emergency roots -> constitutional trust split-brain -> bounded protected-effect behavior -> locally verifiable settlement/retirement without majority truth or permanent super-root`.

## 10. Maturity and next gap

Family 8 remains `RESEARCH_ACTIVE / NON_EXECUTABLE`, not saturated.

The next highest-value gap is **constitutional settlement evidence under disconnected/offline populations**: how a bounded settlement ceremony or pre-positioned recovery constitution can produce a portable `SettlementClosure` that proves scope, conflict identity, predecessor frontier, successor/retirement decisions, anti-rollback floor and emergency-authority extinction to runtimes that may reconnect years later — while remaining parseable across verifier generations and without requiring retention of every historical executable verifier.
