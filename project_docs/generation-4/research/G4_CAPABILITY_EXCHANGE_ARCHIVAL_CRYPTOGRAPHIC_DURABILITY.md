# G4 — Archival Cryptographic Durability of Settlement Closure

Status: `RESEARCH_ACTIVE / NON_EXECUTABLE`
Date: 2026-09-20
Scope: Generation 4 product R&D only. No implementation authority.

## 1. Research question

How can a `SettlementClosureRef` remain verifiable after cryptographic algorithms, timestamp keys, proof profiles, canonical encodings, certificate chains, verifier implementations, or their security assumptions have been retired — without re-signing history as if it were newly authorized, without weakening anti-rollback/retirement floors, without retaining vulnerable executable verifiers indefinitely, and without creating a mandatory central archive/root oracle?

This is a focused continuation of `G4_CAPABILITY_EXCHANGE_SETTLEMENT_CLOSURE_OFFLINE_REJOIN.md`. It does not create a new macro-family and does not reopen G3.

## 2. Evidence base

Primary standards and mature guidance reviewed:

- RFC 4998, Evidence Record Syntax (ERS): long-term evidence must survive weakening of signature/hash algorithms and certificate validity. It distinguishes timestamp renewal from hash-tree renewal, requires renewal before the currently protecting mechanism becomes unsafe, and defines an evidence record as a time-ordered chain/sequence rather than replacement of the original evidence. It also allows evidence records to remain separate from archived data and notes that verification material such as certificates, revocation data, trust anchors and algorithm-suitability information may be retained.
- RFC 3161, Time-Stamp Protocol: long-term signature validation depends on evidence that a signature existed at a relevant time and on certificate/revocation state at that time. A timestamp is evidence with its own trust and validity assumptions, not timeless truth.
- ETSI EN 319 102-1, AdES creation/validation: long-term-validation augmentation retains the material or references used during validation; preservation can be meaningful even for failed validation because integrity and availability of evidence about the failure matter historically.
- NIST SP 800-131A Rev. 2 and NIST transition guidance: cryptographic algorithms move through acceptable/deprecated/disallowed/legacy-use states; legacy use may remain allowed for processing already protected information such as signature verification even when generation of new protection is no longer allowed. This is strong evidence for separating historical interpretation from new-effect admissibility.
- NIST TDEA withdrawal guidance: withdrawal of an algorithm for new protection does not imply deleting historical specification/validation evidence; historical material remains available while use for new protection is retired.

No ERS, ETSI signature format, RFC 3161 TSA, NIST profile, PKI, blockchain, transparency log, archive service, HSM, post-quantum algorithm or provider is selected.

## 3. Material findings

### 3.1 Preservation is evidence renewal, not historical re-authorization

RFC 4998's strongest reusable principle is that a newer protection layer covers the prior evidence before the prior mechanism becomes unsafe. The old signature/timestamp does not become a new signature under the new algorithm.

`Evidence renewal != authority renewal`.

For G4, an archival renewal may prove that a closure and its prior evidence existed before a cryptographic weakness/expiry boundary. It must not manufacture a new constitutional settlement, successor admission, retirement decision, or business authorization.

### 3.2 Preserve the proof lineage, not merely the latest signature

A naked modern signature over a historical closure loses the distinction between the original authority and the later preservation authority. The durable object therefore needs an append-only or otherwise proof-preserving lineage:

`original closure -> historical validation material -> preservation evidence -> renewal evidence ...`

`Latest archival signature != original settlement authority`.

Each layer has a qualified role and scope.

### 3.3 Algorithm retirement has at least three different meanings

A retired algorithm can be:

1. forbidden for generating new authoritative protection;
2. still permitted for historical verification/legacy processing under policy;
3. no longer safe enough even for direct historical reliance without earlier preservation evidence.

NIST's `legacy use` distinction supports this separation.

`Disallowed for new protection != uninterpretable historical evidence`.

The G4 security floor therefore cannot be one scalar `algorithmVersion`.

### 3.4 Timestamp evidence is not timeless authority

RFC 3161 and ERS both make time evidence dependent on a TSA/trust path and on the security of the mechanisms that protect the timestamp. A timestamp can help establish that evidence existed before a compromise/weakness boundary, but its own assurance may later need renewal.

`Timestamp present != eternal currentness`.

A timestamp must remain qualified by authority, policy, algorithm suite, validation evidence, and the interval/claim it proves.

### 3.5 Hash compromise and signature-key/algorithm compromise require different renewal treatment

ERS distinguishes timestamp renewal from hash-tree renewal. If only the timestamp signature mechanism is aging, protecting the previous timestamp may suffice; if the content-binding hash becomes unsafe, the archived objects/evidence must be rebound under a stronger hash while the old chain is still trustworthy.

`Signature renewal != content-binding renewal`.

This matters for a `SettlementClosureRef`: a future verifier must know whether the original closure bytes are still collision-resistantly bound to the preservation chain.

### 3.6 Canonical encoding is part of the proof surface

Long-term proof depends on reproducing the exact bytes/semantic object that historical hashes/signatures covered. Therefore an immutable `CanonicalEncodingProfileRef` is a material dependency, not an incidental serializer choice.

`Same parsed fields != same historically authenticated bytes`.

A future normalization or transcoding may be useful, but it needs explicit derivation/translation evidence and cannot replace the historical encoding identity silently.

### 3.7 Preservation authority and constitutional authority are distinct

An archive/TSA/preservation service may attest existence, integrity, renewal timing, or custody. It does not gain authority to decide which emergency root won, whether a business effect is canonical, or whether a retired root may issue new effects.

`Preservation authority != settlement authority != business authority`.

This prevents the archive from becoming a hidden constitutional super-root.

### 3.8 Revalidation evidence should preserve historical dispositions, including failure

ETSI's long-term-validation model explicitly recognizes value in preserving validation material even when validation failed. G4 should therefore preserve qualified historical dispositions such as `VALID_AT_T`, `INVALID_AT_T`, `UNKNOWN_AT_T`, or `UNSUPPORTED_AT_T` when material, rather than retaining only successful proofs.

`Preserved evidence != preserved success claim`.

This reduces future reinterpretation pressure and supports audit of why a closure was or was not admissible at a historical point.

### 3.9 Renewal must occur before the old protection ceases to be trustworthy

ERS relies on renewing before a critical algorithm/key/certificate event invalidates the ability to establish the earlier state. Post-compromise re-signing alone cannot prove what existed before compromise.

`Late re-signing after trust loss != proof of pre-compromise existence`.

G4 therefore needs a renewal horizon/watch obligation for archival evidence, even if implementation remains provider-independent.

### 3.10 Unknown compromise time limits what renewal can prove

If a signing key may have been compromised before the purported renewal boundary, a later timestamp cannot retroactively establish which earlier signature was genuine unless independent evidence closes that interval.

`Renewed evidence != erased compromise uncertainty`.

The disposition may remain `CONTESTED` or `INSUFFICIENT_FOR_PRECOMPROMISE_CLAIM`.

### 3.11 Cryptographic agility must not become semantic agility by accident

Changing hash/signature algorithms is a protection transition. Changing proof rules, normative semantics, settlement meaning, or authority scope is a semantic transition and needs a distinct identity/relation.

`Crypto-suite migration != proof-profile semantic migration`.

A renewal layer may point to a successor cryptographic suite while continuing to bind the immutable historical `VerificationProfileRef` and normative semantics snapshot.

### 3.12 Proof-profile obsolescence needs qualified translation, not silent reinterpretation

If a future verifier no longer executes an old proof profile, it may rely on a qualified preservation/migration artifact that establishes a relation from old profile semantics to a supported verifier profile. That relation is itself evidence with provenance and assurance scope.

`New verifier can parse old evidence != new verifier is semantically equivalent`.

Where equivalence cannot be established, historical evidence remains resolvable but not automatically admissible for a stronger claim.

### 3.13 Historical verification can be sandboxed or reconstructed without making old code authoritative

Retention of normative semantics, canonical encodings, conformance vectors, source/provenance and validation records can permit later reconstruction or isolated forensic execution. The active TCB need not permanently contain vulnerable old binaries.

`Executable retention != semantic preservation`.

Any reconstructed verifier remains newly qualified evidence, not retroactive proof that the old implementation was correct.

### 3.14 Archival compaction is constrained by future verification questions

Merkle/tree aggregation can reduce storage/proof cost, but compaction must preserve enough evidence to establish exact object membership, ordering where semantically required, renewal lineage, algorithms, trust material, retirement/anti-rollback facts, and profile identities.

`Merkle inclusion != semantic settlement proof`.

Aggregation is a storage/proof technique, not authority composition.

### 3.15 Anti-rollback floors survive archival renewal

A new preservation layer cannot lower a previously learned `RetirementFloorRef`, `BootstrapFloorRef`, verifier security floor, or profile floor. Historical evidence below a floor may remain interpretable while being inadmissible for new effects.

`Archive renewal != floor reset`.

Restoring an older archive package must not resurrect a retired constitutional root.

### 3.16 Multiple preservation providers improve failure independence but do not vote truth into existence

Independent archive/TSA/log paths can reduce correlated loss or compromise. Agreement can strengthen availability/provenance evidence under a declared trust model, but majority count cannot decide constitutional truth.

`Archive quorum != settlement quorum unless explicitly contracted`.

The same rule applies to transparency logs, witnesses, cloud archives, and offline media.

### 3.17 Preservation packages remain portable and locally verifiable

A long-offline runtime should be able to receive a bounded archival evidence package by file, direct transfer, RPC, broker, or other transport and verify it from supported local anchors/profiles. Builder or a central Exchange Plane is not required to be online merely because evidence has aged.

`Long-term preservation != mandatory central archive oracle`.

If local support is below the declared archival/bootstrap floor, explicit re-bootstrap/quarantine remains safer than trusting a `latest` archive pointer.

### 3.18 Retention and privacy still apply

Cryptographic preservation is not permission to retain arbitrary personal/business payload forever. Where possible, evidence should preserve qualified hashes/commitments, refs, minimal validation material, and purpose-bounded provenance rather than duplicating canonical business records.

`Need to preserve proof != need to preserve all payload`.

If later hash-tree renewal requires source bytes that policy requires erasing, the system must represent the resulting proof limitation rather than defeat erasure policy.

### 3.19 Renewal scheduling is a risk-management obligation, not a global clock oracle

Algorithm-security guidance, certificate expiry, compromise reports, policy floors and provider evidence may trigger renewal. There is no single globally authoritative `crypto expiry timestamp` for every claim.

`Renewal due != one global platform time/floor`.

The evidence should record which assumption triggered renewal and which assurance dimension it protects.

### 3.20 Archival durability has an explicit exit boundary

No product can guarantee infinite future verification against unknown cryptanalytic breakthroughs, lost source material, vanished normative semantics, or unsupported trust anchors. G4 should state a preservation support contract and explicit terminal dispositions such as `ARCHIVAL_RENEWAL_REQUIRED`, `BELOW_ARCHIVAL_FLOOR`, `HISTORICALLY_RESOLVABLE_ONLY`, or `UNVERIFIABLE_WITH_RETAINED_EVIDENCE`.

`Long-term verifiable != infinitely verifiable`.

## 4. Candidate archival vocabulary

Research vocabulary only:

- `PreservationEvidenceRef` — immutable reference to evidence preserving existence/integrity/validation state of another evidence object.
- `PreservationChainRef` — ordered proof lineage across preservation/renewal generations.
- `CanonicalEncodingProfileRef` — immutable identity of the encoding whose bytes/structure are cryptographically bound.
- `CryptoSuiteRef` — qualified algorithms/parameters used by a protection layer.
- `AlgorithmAdmissibilityRef` — policy evidence describing generation/verification/legacy-use status for a suite in a named scope/time model.
- `HistoricalValidationRef` — retained validation result plus material/references needed to interpret that result.
- `PreservationAuthorityRef` — identity/scope of TSA/archive/witness authority, explicitly distinct from settlement/business authority.
- `RenewalBoundaryRef` — evidence of why/when a preservation layer superseded an aging protection mechanism.
- `ArchivalFloorRef` — oldest preservation/profile/security state for which automatic local verification is promised.
- `SemanticMigrationEvidenceRef` — qualified relation used when a supported verifier interprets a retired proof/normative profile.

These are candidate structural refs/roles, not shared business entities or implementation components.

## 5. Candidate proof obligations

1. Renewal preserves original authority/provenance lineage and never relabels preservation authority as settlement authority.
2. Every renewal layer identifies exactly which prior evidence/object it protects and under which encoding/hash/signature profile.
3. Historical evidence remains distinguishable from newly generated authorization.
4. New-protection admissibility, legacy verification admissibility, and insufficient-security states remain distinct.
5. Timestamp evidence remains qualified by its own trust/security/validation assumptions.
6. Content-binding hash retirement triggers stronger rebinding requirements than timestamp-signature renewal alone.
7. Canonical encoding identity remains immutable for historically authenticated bytes.
8. Transcoding/normalization/semantic migration is explicit evidence, never silent replacement.
9. Preservation renewal occurs before the prior protecting mechanism loses the assurance required by the claimed interval, or the resulting uncertainty remains explicit.
10. Unknown compromise intervals cannot be erased by later re-signing.
11. Cryptographic migration cannot mutate immutable proof/normative semantics identity.
12. Verifier/profile migration has independently qualified semantic-compatibility evidence.
13. Vulnerable historical executables need not remain in the active TCB for evidence to remain historically resolvable.
14. Compaction/aggregation preserves object membership, renewal lineage, material negative evidence, floors, authority scope and profile identity required by live verification questions.
15. Archival renewal cannot lower retirement, bootstrap, verifier, profile or security floors.
16. Multiple preservation providers cannot create constitutional truth by popularity unless a specific contract explicitly grants such authority.
17. Offline/local verification remains possible from sufficient retained anchors/evidence without Builder availability.
18. Missing/expired/unsupported archival evidence degrades to an explicit disposition rather than fabricated validity.
19. Preservation evidence does not become canonical business truth or a shared database surrogate.
20. Retention/privacy/erasure policy remains applicable; inability to renew after lawful erasure is represented as a proof limitation.
21. Historical validation failures/unknowns remain preservable and cannot be rewritten as success by later augmentation.
22. A renewal package cannot resurrect a root/profile/authority already below a locally durable anti-rollback floor.
23. Provider/transport substitution preserves preservation-chain semantic identity and requalifies provider-specific trust claims.
24. The preservation contract declares a bounded support/exit path rather than promising infinite future verifiability.

## 6. Adversarial cases

1. Archive re-signs an old closure with a new key and drops the original settlement signature/authority lineage.
2. Modern signature is interpreted as a new constitutional settlement date.
3. SHA-family content hash is compromised, but only the outer timestamp signature is renewed.
4. Old bytes are normalized/re-serialized before hashing and called the same historical object.
5. TSA is treated as authority to choose the winning emergency root.
6. Timestamp exists, but its own signing key/certificate had already become untrustworthy before renewal.
7. Compromise time is unknown; later archive timestamp is used to claim certainty about an earlier disputed signature.
8. Algorithm is disallowed for new signatures and all historical evidence using it is incorrectly deleted.
9. Conversely, `legacy verification allowed` is misread as permission to create new protected effects with the retired algorithm.
10. New verifier parses an old proof but applies changed normative semantics under the same profile identifier.
11. Translation from old proof profile to new profile is unsigned/unqualified and silently accepted.
12. Every old verifier binary is retained online in the active TCB, preserving known vulnerabilities indefinitely.
13. Merkle root is retained while membership/path material needed for a specific closure is discarded.
14. Archive compaction drops losing-root retirement evidence but retains successor evidence.
15. Renewal package restores an older `RetirementFloorRef` and resurrects stale authority.
16. Three archive providers agree on a closure and majority is treated as constitutional truth despite common upstream compromise.
17. Central archive outage makes an otherwise self-sufficient client runtime unable to verify locally retained closure evidence.
18. Archive embeds full canonical business records for convenience and becomes a shared database.
19. Privacy erasure is bypassed because `future hash renewal might need bytes` without a declared retention basis.
20. Lawful erasure occurs and future verifier fabricates proof completeness despite missing bytes needed for hash-tree renewal.
21. Validation augmentation preserves only successful results and deletes historical failure evidence.
22. A `latest archival package` pointer is trusted by a client below bootstrap floor with no authenticated continuity.
23. Provider migration changes timestamp/proof semantics while retaining the same evidence identity.
24. Product documentation promises permanent verifiability despite unsupported algorithms, missing normative semantics, or lost trust anchors.

## 7. Interaction with Shared Semantic Kernel / Capability Exchange Plane

The candidate Shared Semantic Kernel may expose stable structural refs for evidence identity, crypto/proof/encoding profile, provenance, qualified time, authority scope, currentness/floor relations and preservation lineage. It must not contain canonical business entities, mutable global `CurrentRoot`, or archive-owned business state.

The candidate Capability Exchange Plane may transport/cache/request/quarantine preservation evidence, preserve envelope lineage, and enforce profile/floor policy at a crossing. It must not renew constitutional authority, select a settlement winner, reinterpret historical proof semantics, or turn an archive/TSA into business authority.

A boundary remains conceptually:

`Capability Core -> Inbound/Outbound Ports -> Contracts -> Exchange Policies -> Exchange Plane -> target boundary`

with archival evidence qualifying the trust/evidence dimension of a contract rather than owning the business interaction.

## 8. Transport/topology implications

- **Direct/in-process:** may verify local preservation chains; optimization cannot bypass profile/floor checks that a remote crossing would require.
- **RPC:** can retrieve evidence/renewal material; response success is delivery evidence only.
- **Broker/stream:** can distribute renewal notices/packages; broker ordering/retention does not create preservation or constitutional authority.
- **File/offline media:** useful for air-gapped archival refresh; physical separation alone does not prove independent trust.
- **Gateway/adapter:** may translate container/protocol formats only with explicit loss/semantic-translation evidence; it cannot silently canonicalize historical bytes.
- **Archive/TSA/log:** candidate providers of scoped preservation evidence, not the logical Exchange Plane and not canonical business owners.

## 9. Portability / exit path

- Preservation semantics and evidence identities must export independently of one archive/TSA/cloud/HSM/log/provider.
- Original closure bytes or a policy-qualified immutable representation, historical validation material, renewal lineage, profile/encoding identities and anti-rollback floors must remain portable enough for independent verification.
- Provider migration requalifies provider-specific trust but does not rename the historical closure.
- If a required algorithm/profile becomes unsupported, the runtime uses qualified migration/preservation evidence or enters an explicit below-floor/re-bootstrap disposition.
- If retained evidence is insufficient after a cryptographic break, the product records that limit rather than manufacturing continuity.

## 10. Deduplication against prior G4 research

This round does not reopen generic verifier diversity, normative proof-semantics governance, profile negotiation, root rotation, emergency-root settlement, ordinary cache invalidation, retention/erasure, or business-effect reconciliation. It specializes the existing settlement-closure problem into one unresolved dimension:

`settlement closure -> decades-long evidence preservation -> crypto/encoding/profile obsolescence -> proof-preserving renewal -> bounded exit path`.

The delta is the explicit separation of **evidence renewal from authority renewal**, the distinction between timestamp renewal and content-binding/hash renewal, preservation of canonical encoding/profile identity, legacy verification versus new-protection admissibility, preservation-authority scoping, and proof limitations under late renewal or lawful erasure.

## 11. Maturity and next gap

Material delta: **YES**.

Family 8 remains `RESEARCH_ACTIVE / NON_EXECUTABLE`, not saturated.

Highest-value next gap: **archival renewal under post-compromise discovery and algorithm-break uncertainty** — refine how a runtime classifies evidence when the weakness/compromise boundary is discovered only after one or more renewal events, including trusted-time uncertainty, backdated compromise windows, conflicting preservation authorities, and whether any proof can safely upgrade `CONTESTED` to a stronger disposition without inventing pre-compromise certainty.

## 12. Sources

Primary sources consulted:

- RFC 4998 — Evidence Record Syntax (ERS): https://www.rfc-editor.org/rfc/rfc4998
- RFC 3161 — Internet X.509 Public Key Infrastructure Time-Stamp Protocol: https://www.rfc-editor.org/rfc/rfc3161
- ETSI EN 319 102-1 V1.2.3 — Procedures for Creation and Validation of AdES Digital Signatures: https://www.etsi.org/deliver/etsi_en/319100_319199/31910201/01.02.03_20/en_31910201v010203a.pdf
- NIST SP 800-131A Rev. 2 — Transitioning the Use of Cryptographic Algorithms and Key Lengths: https://csrc.nist.gov/pubs/sp/800/131/a/r2/final
- NIST — TDEA withdrawal notice and historical/legacy-use treatment: https://www.nist.gov/news-events/news/2023/06/nist-withdraw-special-publication-800-67-revision-2
