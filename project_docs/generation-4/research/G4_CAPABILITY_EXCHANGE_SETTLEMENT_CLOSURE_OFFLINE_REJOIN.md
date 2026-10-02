# G4 — Settlement Closure for Long-Offline and Disconnected Runtimes

Status: `RESEARCH_ACTIVE / NON_EXECUTABLE`
Date: 2026-09-20
Scope: Generation 4 product R&D only. No implementation authority.

## 1. Research question

How can an autonomous runtime that missed a constitutional trust conflict and its settlement later prove, from durable local trust plus portable evidence, that a disputed/emergency root was settled, a successor is admissible, a losing root is retired for new effects, and emergency authority has terminated — without a mandatory online Builder/root oracle, without retaining every historical verifier executable forever, and without rewriting historical business/effect lineage?

This is a focused continuation of `G4_CAPABILITY_EXCHANGE_EMERGENCY_ROOT_TRUST_REBOOTSTRAP.md` and `G4_CAPABILITY_EXCHANGE_CONFLICTING_EMERGENCY_ROOTS_RESEARCH.md`. It does not create a new macro-family and does not reopen G3.

## 2. Evidence base

Primary standards and mature-system evidence reviewed:

- The Update Framework (TUF) specification: clients ship with a trusted root, update roots sequentially through every intermediate version, require each successor root to satisfy predecessor and successor thresholds, persist trusted root state non-volatily, reject rollback, and retain all released root metadata so old clients can retrace continuity. This is strong evidence for locally checkable continuity and monotonic trust state, not a selected protocol.
- RFC 9691 (RPKI Trust Anchor Keys): planned rollover uses explicit current/predecessor/successor key relations, reciprocal verification and an acceptance timer; older relying parties may continue on previous key material and eventually require manual/OOB update. This is evidence that successor naming alone is insufficient and that long-offline clients need an explicit recovery path.
- RFC 5011 (DNSSEC trust-anchor update): trust-anchor state is local; new anchors use hold-down while a validly observed revocation is immediate/permanent. This is evidence for durable anti-resurrection state distinct from historical key retention.
- Sigstore policy-controller: custom/air-gapped verification can bootstrap from an explicit TUF root or serialized TUF repository delivered out of band, demonstrating that locally verifiable trust refresh need not require an online central service.
- Sigstore threat model: threshold/offline roots, compromise-time-aware revocation and freshness are distinct assurance dimensions; possession of signed material is not unlimited-currentness authority.

No TUF, RPKI, DNSSEC, Sigstore, ledger, HSM, archive format, verifier runtime or transport is selected.

## 3. Material findings

### 3.1 Settlement needs a portable proof closure, not a `currentRoot` announcement

A returning runtime cannot safely accept `RA is current` merely because a Builder, broker, peer majority or discovery endpoint says so. It needs enough evidence to derive the transition from its own last locally admissible trust frontier or an explicitly qualified re-bootstrap anchor.

`Latest-root advertisement != settlement proof`.

Candidate abstraction: `SettlementClosureRef`, a portable evidence closure containing the minimum immutable material needed to prove the named conflict, predecessor frontier, settlement authority, successor/retirement relations, anti-rollback floor and emergency-authority termination.

### 3.2 Closure is relative to a local anchor/floor

There is no universally self-authenticating settlement package. A package is useful only relative to trust already possessed by the verifier or to an independently qualified OOB re-bootstrap procedure.

`Portable closure != self-authenticating closure`.

A runtime therefore evaluates `closure × local trusted anchor/floor × verifier qualification`, not closure bytes alone.

### 3.3 Ordinary continuity and emergency discontinuity need different proof paths

TUF demonstrates a clean normal case: an outdated client walks N -> N+1 roots, with dual predecessor/successor authorization. That logic must not be silently reused after predecessor threshold compromise.

`Sequential normal root chain != emergency settlement chain`.

An emergency closure must explicitly identify the discontinuity and the independently qualified recovery/settlement authority that bridges it.

### 3.4 Closure should be transitive enough for long-offline clients, but not hide intermediate constitutional transitions

A runtime offline across R1 -> conflict(RA,RB) -> settlement R3 -> R4 needs either a verifiable chain of transitions or a compacted proof that preserves every live security fact needed to reject resurrection/downgrade. A naked R4 cannot prove why RB lost authority.

`Newest root != sufficient anti-resurrection history`.

Compaction is valid only when it preserves predecessor/conflict identity, settlement authority, retirement floor, successor relation and any still-live verifier/security dependencies.

### 3.5 Settlement closure has at least four independent claims

A closure should not collapse these into one boolean:

1. **conflict identity** — which root/policy claims and authority scope were contested;
2. **future authority settlement** — which successor/frontier is admissible for new protected effects;
3. **negative/retirement evidence** — which roots/emergency authorities must not regain new-effect authority;
4. **closure of exceptional authority** — proof that the break-glass/settlement mechanism itself no longer remains an open-ended authorization path.

`Successor admitted != loser retired != emergency authority terminated`.

### 3.6 Historical resolvability and current admissibility remain separate

A losing root may remain necessary to verify old signatures and interpret historical effects while being permanently inadmissible for new protected effects.

`Retired root evidence retained != retired root authority retained`.

This allows archival interpretation without resurrecting constitutional power.

### 3.7 Verifier evolution is part of closure admissibility

A runtime may possess the right closure bytes but an old verifier may not understand the proof profile, signature suite, normative semantics or correction set required to evaluate it.

`Closure available != verifier qualified`.

The closure therefore needs immutable proof/profile/semantic identities and declared minimum verifier/security qualification. Unsupported semantics produce `REVALIDATION_REQUIRED`/quarantine, not guessed equivalence.

### 3.8 Long-term verification does not require retaining every executable verifier

Historical proof can remain interpretable through immutable normative semantics, canonical encodings/test vectors, signed provenance and migration/translation evidence. Old executable verifiers need not remain in the active TCB forever.

`Historical semantic resolvability != indefinite executable-verifier retention`.

Where a newer verifier interprets an older proof profile, that compatibility itself is a qualified claim; it cannot silently reinterpret historical semantics.

### 3.9 Anti-rollback floor must survive restore/reinstall/rejoin paths

A runtime that once learned `RB retired at floor F` must not regain RB authority after snapshot restore, cache restore, package downgrade, stale peer sync or replacement of ordinary application state.

`Application rollback != constitutional-floor rollback`.

The durable floor may have multiple realizations, but its semantic role is monotonic negative evidence against resurrection.

### 3.10 Time alone cannot prove settlement currentness

A closure signed later is not automatically stronger; wall-clock time can be wrong, manipulated or semantically irrelevant. Revision/floor relations and qualified authority matter more than `newer timestamp`.

`Later timestamp != stronger constitutional authority`.

Time remains useful as evidence for expiration/compromise windows only under a declared trusted-time model.

### 3.11 Air-gapped delivery can preserve autonomous verification

Sigstore demonstrates that a serialized trust repository/root can be provisioned OOB for air-gapped verification. G4 can therefore require portable closure without requiring online Builder availability.

`Offline-verifiable settlement != online settlement oracle`.

USB/file/package/IPC/HTTP/broker are transport realizations; none becomes authority by carrying the closure.

### 3.12 Partial closure must remain partial

A package may prove R3 successor admission but omit RB retirement, emergency-authority termination, verifier qualification or a material intermediate transition. Such a package must not be relabeled `COMPLETE`.

`Some settlement evidence != complete settlement closure`.

Candidate dispositions include `COMPLETE`, `PARTIAL`, `BELOW_FLOOR`, `UNSUPPORTED_PROFILE`, `CONTESTED`, `EXPIRED_WHERE_APPLICABLE`, and `REVALIDATION_REQUIRED`.

### 3.13 Closure verification and business reconciliation are independent

A runtime may successfully establish R3 while still containing RB-era orders, payments, jobs or external effects requiring capability-local reconciliation.

`Constitutional settlement closure != historical effect settlement`.

The closure may reference effect-conflict evidence but cannot choose canonical business truth.

### 3.14 Re-admission is explicit

Queued work admitted under RB does not become R3-authorized merely because the runtime later verifies R3 settlement. Continuing it requires the original contract to permit continuation under historical lineage or an explicit new admission/migration act.

`Trust rejoin != obligation re-admission`.

### 3.15 Closure is authority-scope qualified

A settlement for trust domain/capability scope X cannot silently settle domain Y. Tenant, classification and authority scope remain part of verification.

`Settlement closure for X != universal platform settlement`.

### 3.16 Missing closure is not proof that settlement did not occur

An isolated runtime may simply lack evidence. It must represent `UNKNOWN/REVALIDATION_REQUIRED`, not infer that its old root remains globally current.

`No observed settlement != no settlement`.

### 3.17 Closure retrieval topology cannot determine meaning

The same closure may arrive through direct file, RPC, broker, stream, gateway or peer. Conversely, two different closures from the same endpoint can be constitutionally incompatible.

`Transport identity != settlement identity`.

### 3.18 A closure may need bounded dependency manifests

For long-term verification, the package should name immutable dependencies that materially affect verification: root/recovery anchors, proof/normative profile, algorithms, correction/errata identities, required trust-domain scope and any minimum security floor. It should not embed arbitrary mutable business state.

`Verification dependency manifest != shared business model`.

### 3.19 Settlement compaction needs a proof-preserving cut rule

A compacted closure may discard intermediate bytes only if a verifier starting from every supported retained anchor/floor can still answer all live questions: successor admissibility, loser retirement, emergency-authority termination, scope, anti-rollback and historical reference resolution.

`Storage compaction != authority-history erasure`.

If an old anchor is no longer supported, the system must state a bootstrap floor and require explicit re-bootstrap rather than fabricate continuity.

### 3.20 Compatibility has an exit boundary

A product cannot promise arbitrary-age clients perpetual automatic recovery. Cryptographic algorithms, proof semantics and verifier implementations eventually retire.

`Autonomous runtime != infinitely backward-compatible runtime`.

The implementation-independent contract should therefore define a support/re-bootstrap boundary: below a declared verifier/security/bootstrap floor, safe behavior is quarantine/manual or OOB re-bootstrap, not silent acceptance.

## 4. Candidate closure vocabulary

Research vocabulary only:

- `SettlementClosureRef` — immutable reference to a portable closure for a named trust conflict/transition.
- `SettlementConflictRef` — identity/scope of the constitutional conflict being resolved.
- `PredecessorFrontierRef` — last admissible frontier from which verification begins.
- `SettlementAuthorityRef` — evidence identifying why the settlement mechanism may resolve this conflict.
- `SuccessorFrontierRef` — future-authority frontier admitted by the settlement.
- `RetirementFloorRef` — monotonic negative evidence preventing losing roots/authorities from regaining new-effect authority.
- `EmergencyClosureRef` — evidence that exceptional recovery authority has terminated or become unusable for ordinary future admission.
- `VerificationProfileRef` — immutable normative proof/algorithm/semantic profile required to evaluate the closure.
- `ClosureDependencyManifest` — bounded immutable dependencies required for verification/resolution.
- `BootstrapFloorRef` — oldest locally supported trust/verifier/security floor from which automatic closure verification is promised.

## 5. Candidate proof obligations

1. Closure verification starts from a locally trusted anchor/floor or explicit qualified re-bootstrap; closure bytes cannot authenticate themselves.
2. Normal predecessor-authorized succession and emergency trust discontinuity remain distinguishable.
3. A closure names the exact conflict and authority scope it settles.
4. Successor admission, losing-root retirement and emergency-authority termination remain separately provable claims.
5. Retired roots remain historically resolvable where needed but cannot regain new-effect authority.
6. A runtime cannot skip material intermediate constitutional transitions unless proof-preserving compaction establishes equivalent safety facts.
7. Anti-rollback/retirement floors survive ordinary snapshot, application rollback, cache restore and stale-peer rejoin paths.
8. Wall-clock recency cannot select constitutional authority absent a qualified trusted-time rule.
9. Transport/provider/gateway/broker identity cannot strengthen closure authority.
10. Air-gapped runtimes can verify supported closures without mandatory live Builder/central Exchange Plane access.
11. Partial/missing evidence remains `PARTIAL/UNKNOWN/REVALIDATION_REQUIRED`, never false completion.
12. Closure verification is independent from business/effect reconciliation.
13. Historical obligations retain admission/root lineage; settlement does not silently re-admit them.
14. Tenant/classification/trust-domain/authority scope survives closure distribution and verification.
15. Proof/profile/normative semantics are immutable identities; verifier upgrades cannot reinterpret the same identity silently.
16. A verifier must be qualified for the closure profile/security floor before its success is authoritative evidence.
17. Historical verification does not require every old executable verifier to remain active, but any semantic migration/translation is itself qualified evidence.
18. Closure compaction preserves all live successor, retirement, exceptional-authority termination, scope and anti-resurrection questions.
19. Unsupported pre-bootstrap-floor clients fail to explicit quarantine/re-bootstrap rather than accepting `latest` material.
20. Closure dependencies remain bounded structural trust/proof metadata and do not absorb canonical business entities.
21. A losing root cannot sign away its own retirement after it is no longer qualified; retirement authority follows the settlement constitution.
22. Emergency settlement authority cannot survive closure as a hidden permanent super-root.
23. Re-fetch/retry of identical closure evidence does not constitute a new settlement or new admission event.
24. Builder unavailability after locally sufficient closure verification does not revoke autonomous runtime operation within declared horizons.

## 6. Adversarial cases

1. Long-offline runtime receives only `currentRoot=R4` and accepts it with no continuity/re-bootstrap proof.
2. Settlement package is signed by the compromised predecessor and calls itself emergency recovery.
3. Package proves R3 admission but omits RB retirement; runtime later accepts RB from stale media.
4. RB retirement is stored only in ordinary application DB and disappears on snapshot restore.
5. Newer timestamp is used to defeat an older but constitutionally stronger settlement.
6. Builder endpoint identity is treated as settlement authority.
7. Broker majority delivers RA closure more often than RB closure and popularity selects truth.
8. Air-gapped runtime is forced online solely to learn trust settlement despite possessing sufficient portable evidence.
9. Old verifier parses unknown proof fields as ignorable and reports success.
10. New verifier silently changes meaning of an old proof profile under the same identifier.
11. Runtime retains every historical verifier binary indefinitely and thereby preserves vulnerable executables in the active TCB.
12. Compaction drops the only evidence that emergency authority was terminated.
13. Compaction drops losing-root identity, allowing later stale material to appear unrelated.
14. Client below supported bootstrap floor is auto-upgraded by trusting an unsigned `latest` pointer.
15. Settlement for domain X is applied globally to domain Y.
16. Closure verifies successfully and system marks all RB-era business effects as reconciled.
17. RB-admitted queued payment is delivered after R3 settlement and relabeled R3-authorized without re-admission.
18. Missing settlement package is interpreted as proof that old root remains current.
19. Gateway caches a mutable `winningRoot` and becomes canonical trust owner.
20. Closure transported by USB is called OOB even though produced under the same compromised control plane.
21. Old package contains valid historical root but below locally learned retirement floor and is accepted after reinstall.
22. Signature algorithm needed for old closure is retired; verifier silently substitutes another algorithm/meaning.
23. Settlement authority remains enabled after closure and later signs unrelated policy changes.
24. Closure embeds canonical business records for convenience and becomes a shared-database surrogate.

## 7. Interaction with Shared Semantic Kernel / Capability Exchange Plane

The candidate Shared Semantic Kernel may contain only stable structural primitives needed to reference immutable roots/frontiers/revisions, authority scope, time/currentness, provenance/evidence, qualified relations, proof profiles and settlement closure identities. It must not own a mutable global `CurrentRoot`, tenant business entity or canonical business reconciliation result.

The candidate Capability Exchange Plane may transport/cache/quarantine settlement evidence, preserve lineage and enforce crossing policy. It must not decide the winner by topology, endpoint, broker majority or availability and must not reinterpret a partial closure as complete.

A candidate path remains:

`Capability Core -> Ports -> Contract -> Exchange Policy -> Exchange Plane -> target boundary`

with settlement/root lineage qualifying admission rather than transferring business ownership.

## 8. Transport and topology decision implications

- **Direct/in-process:** acceptable when caller and callee share the same qualified local closure/floor; optimization must not bypass lineage/currentness checks that would exist remotely.
- **RPC:** suitable for requesting closure/evidence but response ACK proves delivery only, not constitutional admissibility.
- **Broker/stream:** useful for distribution/fan-out; ordering/retention do not create authority and missed messages must be recoverable from durable evidence where required.
- **File/OOB package:** important for disconnected/air-gapped recovery; independence is a trust-path property, not a property of removable media.
- **Gateway/adapter:** may mediate format/protocol or quarantine incompatible profiles; semantic loss/unsupported proof must be explicit.

No transport is the logical Exchange Plane itself.

## 9. Portability / exit path

- Settlement closure semantics must be exportable independently of a specific TUF repository, broker, HSM, cloud, gateway or Builder deployment.
- Immutable closure/profile/root identities must survive provider replacement.
- A client runtime with sufficient durable closure and qualified verifier remains operational without Builder availability, subject to declared security/currentness horizons.
- Provider migration cannot erase retirement floors or historical losing-root lineage.
- If a future verifier cannot safely support an old proof profile, the exit path is explicit re-bootstrap/migration evidence, not invented compatibility.

## 10. Deduplication

This round does not reopen generic key rotation, emergency-root creation, conflicting-root winner selection, ordinary profile negotiation, business split-brain reconciliation, DR, evidence-cache invalidation or verifier-diversity research. The material delta is narrowly:

`settled constitutional conflict -> portable proof closure -> long-offline local verification -> anti-resurrection floor -> verifier/profile evolution -> bounded compaction/re-bootstrap floor without global online root oracle`.

## 11. Maturity and remaining gap

Material delta exists. Family 8 remains `RESEARCH_ACTIVE / NON_EXECUTABLE` and not saturated.

The next high-value gap is **settlement-closure archival durability under cryptographic/proof-profile obsolescence**: how long-lived autonomous runtimes preserve verifiability when algorithms, canonical encodings, timestamp authorities, proof profiles or verifier TCBs are retired, without re-signing history as if newly authoritative, weakening anti-rollback floors, or retaining vulnerable executables indefinitely.

## 12. Sources

- The Update Framework Specification, latest 1.x series — root update workflow, sequential intermediate roots, predecessor+successor threshold verification, persistence and rollback/freeze protections.
- RFC 9691, *A Profile for Resource Public Key Infrastructure (RPKI) Trust Anchor Keys (TAKs)*, December 2024.
- RFC 5011, *Automated Updates of DNS Security (DNSSEC) Trust Anchors*.
- Sigstore Policy Controller documentation — custom TUF roots and serialized TUF repositories for air-gapped/OOB verification.
- Sigstore Threat Model / Security Model — offline threshold roots, compromise-time-aware revocation and freshness.
