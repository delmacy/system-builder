# G4 — Retroactive Cryptographic Compromise and Archival Evidence Requalification

Status: `RESEARCH_ACTIVE / NON_EXECUTABLE`
Date: 2026-09-20
Scope: Generation 4 product R&D only. No implementation authority.

## 1. Research question

How should long-lived `SettlementClosureRef` and other cross-capability evidence be requalified when a signing key, TSA, hash/signature algorithm, proof profile, canonical encoding, or preservation authority is discovered *later* to have been compromised or unsafe during an earlier interval — especially when the true compromise start is uncertain — without fabricating pre-compromise certainty, treating a preservation provider as constitutional authority, weakening anti-rollback floors, or requiring a central online oracle?

This is a focused continuation of `G4_CAPABILITY_EXCHANGE_ARCHIVAL_CRYPTOGRAPHIC_DURABILITY.md`. It does not create a new macro-family and does not reopen G3.

## 2. Evidence base

Primary standards and mature guidance reviewed:

- RFC 3161, Time-Stamp Protocol: if a TSA key is compromised, tokens signed with that key cannot simply remain trusted; the RFC explicitly notes that audit trails or timestamps from a different TSA can sometimes help discriminate genuine from falsely backdated tokens. This is evidence that compromise recovery is an evidence-composition problem, not a `latest certificate status` boolean.
- RFC 4998, Evidence Record Syntax (ERS): long-term evidence must be renewed before protecting mechanisms become weak or compromised. Timestamp renewal and hash-tree renewal cover different failure classes. ERS also recommends redundant Evidence Records using different hash algorithms and different TSAs/signature algorithms, showing that failure independence matters.
- ETSI EN 319 102-1 past signature validation: Proof of Existence (POE) can allow validation to move to an earlier control time; cryptographic-constraint failures can be overcome only when there is POE for the affected material from before the algorithm/key ceased to be considered secure. `best-signature-time` is therefore an evidence-derived bound, not an assertion from the signed object itself.
- ETSI TS 119 511 preservation-service requirements, including the current 1.2.1 generation: preservation aims to maintain validity/proof-of-existence despite later key compromise or cryptographic attack, and distinguishes preservation evidence augmentation from the original signature/authority. Preservation can operate with storage, temporary storage, or without storage; it need not own the canonical payload.
- NIST key-management terminology/guidance: compromise leads to removal/revocation from operational use and requires compromise recovery. This supports separating new-use admissibility from historical-evidence disposition.

No TSA, PKI, ERS implementation, ETSI preservation service, transparency log, blockchain, HSM, cryptographic suite, cloud archive, quorum algorithm or provider is selected.

## 3. Material findings

### 3.1 Discovery time, compromise start, revocation time and observation time are different facts

A compromise discovered at `T_d` may have started at an earlier `T_c`, whose exact value may be known, bounded, or unknown. Revocation publication and a runtime's observation can occur later still.

`Compromise discovered at T_d != key safe until T_d`.

A durable evidence model therefore cannot invalidate or bless historical evidence solely from discovery timestamp. It needs a qualified compromise interval or bound.

### 3.2 Retroactive compromise changes evidence disposition, not historical occurrence

A closure, message or business effect that actually occurred remains a historical fact even if the signature that authenticated it becomes untrustworthy.

`Authentication confidence changed != historical effect erased`.

The system may need to reclassify authority/evidence as `CONTESTED`, `UNKNOWN`, or `INSUFFICIENT_FOR_PRECOMPROMISE_CLAIM`; it must not rewrite business history as though the occurrence never happened.

### 3.3 A pre-compromise Proof of Existence can preserve a bounded historical claim

ETSI past-validation semantics provide the strongest reusable principle: evidence can remain supportable when a trusted POE establishes that the protected material existed before the affected algorithm/key ceased to be trustworthy.

`POE before compromise bound -> evidence may preserve a historical claim`.

But the preserved claim is exactly the one covered by the POE and its trust assumptions. It does not automatically prove business correctness, constitutional authority, current admissibility, or absence of later tampering outside the protected object.

### 3.4 Unknown compromise start creates an uncertainty interval that later signatures cannot erase

If the earliest possible compromise time is unknown or predates the first independent POE, a later archive signature cannot prove that an earlier signature was genuine rather than forged/backdated.

`Post-discovery preservation != retroactive proof of genuine origin`.

The correct result can remain `CONTESTED` indefinitely unless independent evidence closes the uncertainty interval.

### 3.5 Independent preservation paths can narrow uncertainty but do not vote truth into existence

RFC 3161 explicitly mentions audit trails and a second TSA as possible ways to discriminate genuine from false backdated timestamps; RFC 4998 recommends redundant evidence records using different TSAs and algorithms.

This supports `failure-domain diversity`, not majority truth.

`Two independent pre-compromise witnesses > one correlated witness` for assurance under a declared model, but `N witnesses agree != constitutional truth` unless the relevant contract explicitly grants that authority and independence assumptions hold.

### 3.6 Correlated preservation authorities must remain representable

Two TSAs, logs or archives may share a CA, HSM firmware, operator, cloud region, clock source, cryptographic library or compromise path. Counting them as independent can create false confidence.

Candidate evidence therefore needs declared/qualified failure-domain relationships rather than only provider IDs.

`Different endpoint != independent trust path`.

### 3.7 Preservation authority compromise does not transfer constitutional authority

If an archive/TSA is compromised, it affects the evidence claims it was qualified to support. It does not acquire or revoke business ownership, decide which emergency root won, or redefine a capability contract.

`Preservation trust failure != settlement authority transfer`.

The Capability Exchange Plane may transport quarantine/requalification evidence, but cannot manufacture the new business or constitutional disposition.

### 3.8 Requalification is claim-specific and monotonic floors still apply

A compromised TSA may invalidate an existence-time claim while leaving an independently signed contract identity or a locally durable retirement floor intact. Conversely, a valid archive timestamp does not restore a root already retired by stronger local evidence.

`Evidence dimension weakened != every dimension reset`.

`Retroactive compromise != anti-rollback floor rollback`.

### 3.9 A renewal performed inside a later-discovered suspect interval is not a clean bridge

Suppose preservation layer `P2` was generated before compromise was discovered, but later forensics establish that its TSA/key may already have been compromised at that time. `P2` cannot serve as an uncontested bridge merely because it predates discovery.

`Renewal before discovery != renewal before compromise`.

Its disposition depends on the best supported compromise interval and independent evidence.

### 3.10 Nested preservation chains require weakest-material-claim analysis, not blanket invalidation

A chain can contain independently qualified layers. Compromise of one layer should invalidate exactly the claims that depend materially on it. Earlier evidence may remain historically interpretable; later independent renewal may preserve existence of the compromised layer without proving its genuine origin.

`Preserved compromised evidence != validated compromised evidence`.

This mirrors the G4 rule that proof lineage and current admissibility are separate.

### 3.11 Historical validation status is time- and policy-qualified

A result such as `VALID_AT_T` means valid under a named validation policy, trust state and evidence set at a control time. A later compromise finding may create a successor assessment without deleting the historical assessment.

Candidate relation:

`HistoricalValidationRef(old) --REQUALIFIED_BY--> HistoricalValidationRef(new)`.

`Requalified != rewritten`.

This preserves auditability of what was known when.

### 3.12 Retroactive revocation semantics must not be guessed from generic certificate status

RFC 3161 distinguishes cessation/supersession-style retirement from key compromise. For TSA key compromise, tokens under that key cannot simply be trusted; audit/independent evidence may be required to distinguish genuine tokens.

Therefore a generic `revoked=true` field is insufficient for archival reasoning. Reason, effective/possible compromise interval, policy and supporting evidence are material.

### 3.13 Trusted time itself can become contested

If the TSA, clock discipline, time source or time-validation path is implicated, the timestamp's numeric value cannot be used as its own proof of correctness.

`Timestamp says T != independently established trustworthy time T`.

A candidate model needs qualified temporal evidence and may represent interval bounds rather than a fabricated exact instant.

### 3.14 Conservative interval reasoning is safer than false precision

Where forensics only establish `compromise began sometime in [T0,T1]`, evidence before `T0` may remain eligible for historical reliance under other assumptions; evidence after `T1` is suspect; evidence within the interval requires independent proof or remains contested.

The exact policy is claim-specific, but the structural principle is:

`uncertain compromise window -> interval-valued assurance, not guessed point time`.

### 3.15 Hash break and signer/TSA compromise propagate differently

A signer/TSA compromise primarily attacks authenticity/time assertions made by that authority. A content-binding hash collision weakness can attack identity/integrity binding of the protected bytes and may require access to original objects for stronger hash-tree renewal, as ERS specifies.

`Authority-key compromise != content-binding compromise`.

Requalification must name the failed assumption rather than collapse all cryptographic failures into `INVALID`.

### 3.16 Preservation of a failure is still useful evidence

ETSI preservation models permit preserving validation data/status rather than only successful signatures. A later compromise finding can itself become durable evidence, including the fact that an earlier closure can no longer support a stronger claim.

`Durable evidence of uncertainty != system failure`.

Representing `UNKNOWN/CONTESTED` is preferable to manufacturing success for availability.

### 3.17 Requalification must propagate through derived assurance without global cache flush semantics

Any cached/derived proof whose material lineage depends on a newly compromised key/TSA/profile must be lowered or revalidated. Unrelated claims need not be invalidated.

`Compromise finding -> lineage-selective requalification`.

This reuses the existing G4 guarantee-evidence-cache rule: dependency change does not imply global cache flush, but materially dependent derived evidence cannot retain a stronger disposition.

### 3.18 Offline runtimes need portable compromise evidence and bounded behavior

A disconnected runtime cannot depend on an online Builder/TSA/archive oracle. It may consume a signed/qualified compromise statement, updated security floor, preservation package or OOB re-bootstrap evidence when connectivity/media permits.

Until then, behavior is bounded by the previously declared currentness/security horizon. Once a stronger compromise/retirement floor is learned locally, rollback cannot erase it.

`Offline autonomy != immunity to later security requalification`.

### 3.19 A preservation provider cannot silently self-exonerate

If preservation authority `A` is the subject of compromise, a new statement signed only by successor material controlled through the same disputed path is not automatically sufficient to prove when `A` was safe.

`Authority-under-dispute != sole judge of its compromise window`.

Independent audit, transparency, external trust anchors, qualified OOB recovery or other evidence may be required according to the contract.

### 3.20 Exit path: some historical claims may remain permanently unresolved

No architecture can reconstruct certainty that was never preserved before an unknown compromise. The model therefore needs terminal or long-lived dispositions such as `CONTESTED_CRYPTO_ORIGIN`, `POE_BEFORE_COMPROMISE_BOUND`, `COMPROMISE_WINDOW_OVERLAP`, `PRESERVED_BUT_UNVALIDATED`, and `UNVERIFIABLE_WITH_RETAINED_EVIDENCE`.

`No surviving independent evidence != permission to infer the most convenient history`.

## 4. Candidate vocabulary

Research vocabulary only:

- `CompromiseEvidenceRef` — qualified evidence that a key/algorithm/authority/profile was compromised or unsafe.
- `CompromiseWindow` — exact or interval-valued earliest/latest bounds supported by evidence; may remain open/unknown.
- `CompromiseObservationRef` — records when a particular runtime/domain learned the compromise evidence, distinct from compromise time.
- `ProofOfExistenceRef` — qualified evidence that a named object/evidence existed no later than a supported control time/bound.
- `RequalificationRef` — immutable successor assessment relating an earlier validation disposition to a later one without rewriting history.
- `FailureDomainRef` — qualified relation describing material shared trust/operational failure assumptions between preservation witnesses.
- `HistoricalTrustDisposition` — claim-scoped result such as `VALID_AT_T`, `CONTESTED_AT_T`, `UNKNOWN_AT_T`, `INVALID_AT_T`, or `UNSUPPORTED_AT_T`.
- `CryptoFailureClass` — signer/TSA key compromise, signature-algorithm weakness, content-hash weakness, time-source compromise, encoding ambiguity, profile/verifier compromise, or other qualified class.
- `RequalificationFloorRef` — monotonic local floor preventing restoration of evidence states already known to be cryptographically inadmissible for named new-use claims.

These are candidate structural refs/roles, not shared business entities or implementation components.

## 5. Candidate proof obligations

1. Discovery time, possible compromise start, revocation publication, local observation and effect time remain separately representable.
2. Retroactive compromise requalifies evidence/authority claims without deleting historical occurrences or external effects.
3. A pre-compromise POE supports only the exact object/claim/time bound and trust assumptions it covers.
4. Later re-signing cannot erase an unknown or overlapping compromise interval.
5. A renewal layer is uncontested only when its own protecting assumptions are supported for the relevant time.
6. Independent witnesses strengthen assurance only under declared independence/failure-domain assumptions; count alone never creates constitutional truth.
7. Preservation/TSA/archive authority never becomes settlement or business authority by performing requalification.
8. Compromise affects only materially dependent assurance dimensions; unrelated durable floors/claims remain intact.
9. Retirement/bootstrap/security/profile floors cannot be lowered by compromise recovery, archive restore or provider substitution.
10. Historical validation results remain immutable records and later assessments are linked as explicit requalifications.
11. Revocation reason/effective semantics and compromise evidence remain available where material to historical validation.
12. Trusted-time claims cannot bootstrap themselves from the disputed timestamp alone.
13. Uncertain compromise time remains interval-valued/unknown rather than fabricated as an exact point.
14. Signer/TSA compromise and content-hash compromise remain distinct failure classes with distinct recovery requirements.
15. Preservation may retain evidence of invalid/unknown/contested states, not only success.
16. Derived assurance/cache entries are selectively requalified according to material proof lineage.
17. Offline runtimes can represent pending/unobserved compromise state and later consume portable requalification evidence without requiring Builder availability.
18. Once a runtime learns a stronger cryptographic/requalification floor, application rollback/restart cannot silently resurrect weaker evidence.
19. An authority under dispute cannot be the sole evidence source proving its own historical safety unless the contract explicitly establishes an independently sufficient mechanism.
20. Provider/transport migration cannot change compromise-window or historical-disposition semantics under the same evidence identity.
21. Business/capability owners retain authority over remediation of historical business effects; the Exchange Plane transports evidence and reconciliation context only.
22. `UNKNOWN`/`CONTESTED` remains representable through retry, cache, compaction, DR and federation.
23. Compaction preserves enough compromise, POE, requalification, failure-domain and floor evidence to answer every live historical-admissibility question.
24. If surviving evidence cannot close the uncertainty interval, the system exposes a bounded unresolved disposition instead of guessing.

## 6. Adversarial cases

1. TSA compromise is discovered on Friday and every token before Friday is assumed safe solely from discovery date.
2. Revocation publication timestamp is mistaken for compromise start.
3. Runtime observation time is mistaken for revocation effective time.
4. A business effect authenticated by a compromised key is deleted from history rather than marked with contested provenance.
5. Archive re-signs disputed evidence after compromise and calls it proof of genuine pre-compromise origin.
6. Renewal generated inside a later-discovered compromise window is treated as an uncontested bridge.
7. Two TSAs share the same HSM/CA/operator but are counted as independent witnesses.
8. Majority of archives is treated as constitutional settlement authority.
9. Compromised archive selects the winning emergency root while performing preservation recovery.
10. A valid POE for object existence is promoted to proof of business correctness or authority.
11. `revoked=true` without reason/window semantics blanket-invalidates or blanket-validates historical evidence.
12. Numeric timestamp from the compromised TSA is used to prove that the TSA was uncompromised at that timestamp.
13. Forensic interval `[T0,T1]` is collapsed to a convenient exact `T1` to preserve more signatures.
14. Hash collision weakness is treated like TSA-key compromise and only the outer timestamp is renewed.
15. TSA-key compromise triggers deletion of original bytes even though content integrity remains independently provable.
16. Later validation overwrites an earlier `VALID_AT_T` record instead of linking a requalification.
17. Cache continues returning `VALID` after a material compromise dependency is learned.
18. Global cache flush destroys unrelated availability/evidence even though only one trust path was affected.
19. Offline runtime restores an old snapshot and forgets a learned compromise/requalification floor.
20. Builder availability becomes mandatory merely to ask whether old evidence is admissible.
21. Preservation authority publishes a self-signed `we were safe until T` claim after its own key compromise and it is accepted without independent qualification.
22. Compaction drops compromise-window evidence but retains the latest success disposition.
23. Provider migration silently changes from interval-aware to boolean revocation semantics.
24. Product chooses `most likely genuine` when no surviving evidence can close a historical compromise interval.

## 7. Interaction with Shared Semantic Kernel / Capability Exchange Plane

The candidate Shared Semantic Kernel may contain stable structural primitives/refs for qualified time intervals, evidence identity, provenance, authority scope, compromise/requalification relations, failure-domain qualification and monotonic floors. It must not contain mutable business truth, a global `CurrentRoot`, or a preservation provider's business state.

The candidate Capability Exchange Plane may carry `CompromiseEvidenceRef`, POE, requalification/floor evidence, quarantine state and lineage needed for selective cache/derived-proof invalidation. It may enforce exchange-policy consequences that are explicitly contracted. It does not decide whether a historical business effect should be compensated, whether a root is constitutionally legitimate, or whether uncertainty should be converted into success.

A boundary remains consistent with:

`Capability Core -> Inbound/Outbound Ports -> Contracts -> Exchange Policies -> Exchange Plane -> target boundary`.

The Exchange Plane owns exchange semantics; capability owners retain business semantics and remediation authority.

## 8. Technology-independent decision guidance

- Use direct/local verification when the runtime has sufficient immutable semantics, anchors, POE/compromise evidence and current floors locally.
- Use RPC/gateway lookup for freshness/augmentation when online evidence improves assurance, but do not make availability of that lookup the historical truth source unless the contract explicitly requires it.
- Use broker/stream propagation for compromise/requalification notices as acceleration and observability; delivery of a notice is not itself proof that every runtime observed it.
- Use multiple preservation/witness paths when the protected claim warrants failure-domain diversity; qualify independence rather than counting endpoints.
- Use OOB/bootstrap recovery when the local verifier/anchor/floor cannot authenticate continuity from retained evidence.
- Use adapter/translation only when semantic loss is explicit; a boolean-revocation provider cannot silently satisfy an interval-aware compromise contract.

## 9. Deduplication against prior G4 research

This document does not reopen generic archival renewal, verifier diversity, root rotation, settlement-closure construction, conflicting-root selection, business split-brain, cache invalidation, or privacy-preserving evidence federation.

Material delta is specifically:

`later-discovered compromise -> compromise-window reasoning -> past-validation/POE qualification -> independent/correlated preservation evidence -> claim-selective requalification -> offline monotonic recovery without fabricated historical certainty`.

## 10. Maturity and next gap

Maturity: `RESEARCH_ACTIVE / NON_EXECUTABLE`, not saturated.

The next highest-value gap is **requalification propagation across autonomous runtimes with inconsistent compromise knowledge**: how independently operating runtimes exchange and converge on stronger compromise/requalification floors without a central oracle, while preserving local observation time, bounded offline autonomy, non-resurrection, privacy/minimal disclosure, and historical effect lineage. This should focus on anti-entropy/frontier semantics and failure-domain-qualified evidence rather than reopening generic messaging or split-brain research.

## 11. Non-authority statement

This document is research evidence only. It does not authorize implementation, WBS, Work Packages, Sprints, TASKs, migrations, providers, cryptographic algorithms, PKI/TSA products, archive services, or changes to G3 semantics.