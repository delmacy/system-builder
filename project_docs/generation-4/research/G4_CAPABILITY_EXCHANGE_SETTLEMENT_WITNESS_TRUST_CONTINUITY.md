# G4 — Settlement Witness Portability and Trust Continuity

Status: `RESEARCH_ACTIVE / NON_EXECUTABLE`
Date: 2026-09-20
Scope: Generation 4 product R&D only. No implementation authority.

## 1. Research question

How can a compact historical settlement/effect witness remain verifiable after the original provider, archive, signing key, schema/API, verifier stack, or trust root is retired or migrated, without keeping that provider alive forever and without turning the Exchange Plane into a permanent settlement oracle?

This document extends conflict-aware compaction/historical effect settlement, semantic snapshot governance, verifier trust continuity, provider portability and runtime-autonomy research. It does not create a new macro-family and does not reopen G3.

## 2. Evidence base

Primary standards, mature-system documentation and failure evidence reviewed:

- RFC 3161 Time-Stamp Protocol: timestamps can establish that signed data existed while a signing certificate was valid; historical validation depends on certificate validity/revocation information at the timestamped time, not merely on present certificate status.
- RFC 4998 Evidence Record Syntax and RFC 6283 XMLERS: long-term evidence must survive algorithm weakening, certificate expiry/revocation and even disappearance of the original certificate/service provider; evidence is renewed before cryptographic assumptions become unsafe, and validation material/policies may need preservation.
- RFC 6283 redundancy guidance: correlated cryptographic failure is a preservation risk; redundant evidence records using different algorithms and TSAs are recommended for stronger long-term survivability.
- NIST SP 800-57 Part 1 Rev. 5: a public signature-verification key may remain useful longer than the corresponding private signing key, and trustworthy timestamping can support verification of signatures created during the private key's valid usage period.
- Sigstore/TUF trust-root model: root and online verification material can rotate; compromise time matters for deciding whether historical signatures remain legitimate; freshness/rollback protection and root continuity are separate from artifact meaning.
- in-toto documentation/security audit: signed supply-chain evidence depends on qualified verification keys and policy/layout context; signature verification alone does not automatically establish key validity/revocation semantics.
- Existing G4 research on normative semantic snapshots, verifier trust continuity, provider substitution, historical effect settlement and runtime-local evidence closure.

These are architectural evidence only. No TSA, PKI, ERS/XMLERS, TUF, Sigstore, in-toto, archive provider, transparency log, cryptographic suite or settlement provider is selected.

## 3. Material findings

### 3.1 Historical verifiability has multiple independent layers

A retained witness can remain byte-for-byte intact while becoming impossible to interpret or qualify. Long-term portability therefore requires separating at least:

1. content/integrity verifiability — are these the same witness bytes/commitment?
2. origin/signature verifiability — was the witness signed by the claimed key/identity?
3. historical trust qualification — was that key/identity admissible for this claim at the relevant time/profile?
4. semantic resolvability — can the immutable contract/profile/schema/predicate meaning still be interpreted?
5. settlement/finality qualification — did the original target/provider semantics actually support the claimed effect disposition?
6. current use admissibility — may this historical witness authorize or justify a new effect now?

`Cryptographically verifiable != semantically interpretable != historically trusted != settlement-proven != currently admissible`.

Provider/archive migration must preserve or explicitly degrade each dimension independently.

### 3.2 Trust-root retirement is not historical evidence erasure

NIST and RFC 3161 provide a mature precedent: the private signing key may cease use while its public verification material remains relevant to signatures made during the valid usage period. A later certificate revocation/expiry does not automatically mean every earlier signature was invalid; timing and revocation reason/effective time matter.

`Signer retired != every historical witness unverifiable`.

`Key currently invalid for signing != historical signature necessarily invalid`.

Conversely, retaining an old public key does not make it acceptable for new signatures.

`Historical verification key retained != key authorized for new effects`.

### 3.3 Long-term proof requires trust continuity, not eternal trust in the original mechanism

RFC 4998/6283 show that signatures/timestamps and hash algorithms can lose reliability over long periods. Preservation can renew evidence before a critical mechanism becomes unsafe, binding old evidence into a newer trustworthy proof chain.

`Original signature survives bytes != original assurance survives time`.

`Evidence renewal != rewriting the original business fact`.

The renewal layer attests preservation/existence/integrity under a newer trust basis; it does not upgrade an `ACK` into `SETTLED`, a disputed effect into a legitimate one, or an historically invalid claim into a valid claim.

### 3.4 Renewal can preserve evidence strength but cannot strengthen business semantics

A migration/archive service may re-sign, timestamp, rehash, re-envelope or otherwise renew historical material. Such renewal can preserve integrity/existence and chain-of-custody claims only within its declared proof scope.

`New archive signature != new settlement evidence`.

`Stronger cryptography != stronger business finality`.

`Archive migration accepted != original provider claim semantically reissued`.

If the original provider exposed only `ATTEMPTED_UNKNOWN`, no later preservation mechanism may relabel it `COMMITTED` absent independent settlement evidence.

### 3.5 Verification material is part of the portable evidence closure

A historical witness that references a dead URL, mutable `latest` schema, retired API endpoint or unavailable key directory is not meaningfully portable. The portable closure may need immutable or content-addressed references to the normative semantic/profile snapshot plus sufficient historical verification material/policy to evaluate the claim.

Candidate closure dimensions include:

- witness/effect commitment;
- immutable claim/profile/schema identity;
- original provider/target identity and guarantee profile;
- signer/key/certificate identity and historical qualification evidence;
- relevant revocation/compromise-time evidence;
- timestamp/ordering/existence evidence where required;
- settlement disposition and its exact proof scope;
- renewal/migration chain;
- verifier/normative semantics references;
- explicit unavailable/below-retention dimensions.

`Portable bytes != portable verification closure`.

### 3.6 Current trust roots and historical trust roots are distinct roles

A runtime may need a current root set for accepting new provider statements and a historical root lineage for validating old witnesses. Combining them into one mutable key bag risks either accepting retired keys for new effects or making old evidence unverifiable after rotation.

`Current admission root != historical verification root`.

`Root rotation != permission to reinterpret old evidence under new policy`.

This aligns with prior G4 verifier-generation and normative-semantics research: historical interpretation binds the rules that governed the original claim, while current admissibility uses current security floors.

### 3.7 Compromise time is semantically material

Sigstore's threat model and RFC 3161/6283 illustrate why a compromise/revocation event needs temporal qualification. A key compromised at time T does not have the same historical consequence as a key merely retired at T; evidence purportedly created before/after T can require different dispositions.

`Revoked now != compromised since origin`.

`Revocation reason/effective time omitted != historical trust preserved`.

A portability adapter that carries only `revoked=true` may destroy the information required to qualify historical witnesses.

### 3.8 Cryptographic agility requires proactive renewal horizons

Long-term preservation cannot wait until a hash/signature algorithm is already considered broken. RFC 4998/6283 explicitly require renewal before prior mechanisms lose their security properties.

`Algorithm deprecated after compromise != evidence safely renewable after compromise`.

A future G4 preservation contract therefore needs a bounded renewal horizon/trigger model, not an assumption that old evidence can always be upgraded later.

This is an evidence-preservation concern, not implementation authorization for any algorithm or scheduler.

### 3.9 Hash migration and signature/key migration are different events

RFC 4998/6283 distinguish renewing a timestamp/signature trust mechanism from renewing a hash-tree commitment when the digest itself becomes unsafe. The G4 abstraction should preserve that distinction:

`Signer/key rotation != content-commitment algorithm migration`.

If the content hash itself loses collision resistance, merely re-signing the old weak digest may be insufficient; stronger preservation may require rebinding the original data/evidence closure under a new commitment while the old relation is still trustworthy.

### 3.10 Provider retirement and archive retirement are independent failure domains

The original effect provider may disappear while an independent archive still preserves sufficient witness material. Conversely, an archive may disappear while the original provider still exists. Portability should avoid requiring both to remain live forever.

`Provider unavailable != historical witness unverifiable` when evidence closure is sufficient.

`Archive unavailable != provider settlement state automatically lost` when independent evidence remains.

No single provider/archive should become an accidental permanent verification oracle unless the contract explicitly requires that external authority.

### 3.11 Evidence redundancy can reduce correlated preservation failure

RFC 6283 recommends redundant evidence records using different algorithms and timestamp authorities because algorithmic weakness can affect many authorities simultaneously. The implementation-independent lesson is not “always duplicate everything,” but:

`Two copies under one trust/algorithm failure domain != independent preservation evidence`.

Where the risk justifies it, preservation diversity should be measured across correlated failure dimensions: algorithm family, trust root/operator, archive/provider, jurisdiction/administrative domain, implementation and storage failure domain.

This does not imply majority truth; redundant witnesses remain scoped evidence.

### 3.12 Historical verification cannot depend on mutable provider documentation

If `SETTLED` meant one guarantee in provider version P1 and a weaker guarantee in P2, a historical witness must remain bound to P1 semantics. A current documentation page is not a historical contract.

`Same provider status label != same historical guarantee`.

`Current API docs != immutable historical semantics`.

This directly reuses the G4 rule `Latest semantics != historical semantics`.

### 3.13 Schema migration must preserve claim identity and lossiness

A new archive schema may reorganize fields or normalize representations, but it cannot silently collapse distinctions such as `COMMITTED`, `COMPENSATED`, `DISPUTED` and `ATTEMPTED_UNKNOWN`.

`Schema-readable after migration != claim-equivalent after migration`.

A migration can preserve the original immutable witness plus a qualified projection, or declare explicit lossiness/incompatibility. It cannot fabricate a stronger historical claim merely to fit the target schema.

### 3.14 A migration receipt is evidence of custody/translation, not original effect truth

An archive/provider migration may emit a receipt stating that object X was imported as Y, with hashes/translation profile and time. That receipt can strengthen chain-of-custody and reproducibility.

`Migration receipt != original settlement receipt`.

`Custody continuity != semantic equivalence`.

If translation is lossy, the receipt should make the loss explicit rather than laundering it through a new signature.

### 3.15 Verification software itself has a preservation lifecycle

Long-lived evidence may outlive the original verifier binary/runtime. Prior G4 research already established that historical verifier references do not require indefinite executable retention if immutable normative semantics and sufficient verification evidence remain available.

This round extends that rule to settlement witnesses:

`Old verifier binary unavailable != historical witness unverifiable by definition`.

`New verifier accepts old witness != semantic equivalence automatically proven`.

A replacement verifier must be qualified against the immutable historical profile/semantics rather than merely parse the old format.

### 3.16 Runtime autonomy favors portable local evidence packages

Published client runtimes should not require the Builder to remain online to verify historical closure. Where policy permits, a runtime can retain or receive a compact evidence package sufficient for local historical verification.

`Builder unavailable != historical verification unavailable`.

If the claim genuinely depends on an external authority that cannot be preserved or independently verified, the runtime represents `UNRESOLVED/BELOW_RETENTION` rather than converting archive availability into truth.

### 3.17 Trust continuity must not become a central Exchange Plane oracle

The Exchange Plane may transport trust-root transitions, evidence-renewal refs, migration receipts and immutable profile refs. It does not decide that a provider was trustworthy, that an effect settled, or that an old signature remains legally/semantically sufficient.

`Exchange Plane carries trust evidence != Exchange Plane owns trust judgment`.

Capability-local contracts and qualified trust policies decide admissibility.

### 3.18 Archival proof and privacy minimization can coexist

Long-term verification does not necessarily require retaining all original business payload. RFC 4998/6283 demonstrate commitment-based preservation over objects/groups; the G4 lesson is that a minimal witness may preserve necessary integrity/existence/settlement references while payload is separately governed by erasure/retention policy.

`Evidence preservation != payload preservation exemption`.

However, if future hash-algorithm renewal requires access to original committed data, erasure may intentionally terminate some proof capability. That trade-off must be explicit rather than hidden.

### 3.19 Erasure can reduce future renewability

A subtle portability consequence follows from long-term archive standards: some renewal operations can be performed over existing evidence only, while replacement of a weakened content-hash commitment may require access to original archived data.

`Payload erased != every future cryptographic renewal remains possible`.

Therefore privacy/retention policy should be able to state which historical proof properties are intentionally surrendered after erasure, instead of promising indefinite cryptographic preservation that cannot be fulfilled.

### 3.20 Historical verification disposition remains multidimensional

A future verification result should not collapse to `VALID/INVALID`. Research dispositions may need to express combinations such as:

- content integrity verified;
- origin verified under historical key;
- trust qualification verified for historical time;
- semantic profile resolved;
- settlement claim supported/unsupported;
- preservation chain current/expired;
- current authorization inadmissible;
- below-retention/unresolved dependency.

`Historically verifiable != currently executable`.

No schema is authorized by this vocabulary.

## 4. Candidate research vocabulary

Research vocabulary only; no product schema or implementation is authorized.

- `HistoricalVerificationClosureRef` — compact reference/package sufficient to evaluate declared historical claims without a live original provider when possible.
- `TrustEpochRef` — immutable identity for the trust-root/key policy relevant to a historical claim; not a global platform revision.
- `HistoricalKeyQualificationRef` — evidence that a signing/verification key was admissible for the claim at the relevant time/profile.
- `CompromiseWindowRef` — qualified evidence about compromise/revocation effective time and scope when material.
- `EvidenceRenewalRef` — relation from an older preservation proof to a newer preservation proof without changing the original business claim.
- `PreservationProfileRef` — immutable declaration of algorithms/trust/policy assumptions and renewal requirements for a witness.
- `MigrationCustodyReceiptRef` — evidence that a historical witness moved/translated between providers/archives, with explicit lossiness/profile.
- `VerificationDisposition` — multidimensional result separating integrity, origin, historical trust, semantic resolution, settlement support and current admissibility.
- `RenewalHorizon` — latest safe point/condition for preservation renewal under the declared profile; not a business TTL.
- `ProofPropertyRetentionProfile` — declares which historical proof properties are expected to survive payload/key/provider retirement and which may become unavailable.

## 5. Candidate proof obligations

1. Historical content integrity, origin verification, historical trust, semantic interpretation, settlement qualification and current admissibility remain independently representable.
2. Retirement of a signing key/provider does not erase historical witnesses that retain sufficient qualified verification closure.
3. Historical verification material cannot authorize new signatures/effects merely because it is retained for audit.
4. Evidence renewal preserves only declared integrity/existence/custody claims and cannot strengthen original business settlement semantics.
5. A witness claiming `ATTEMPTED_UNKNOWN` cannot become `COMMITTED` through re-signing, rehashing, timestamping or archive migration alone.
6. Portable evidence retains immutable semantic/profile/schema identities rather than mutable `latest` documentation references.
7. Historical key qualification includes relevant time, policy and revocation/compromise semantics where material.
8. Revocation/compromise reason and effective time are not flattened when they affect historical verification.
9. Current admission roots and historical verification roots remain distinct roles.
10. Root/key rotation cannot silently reinterpret old evidence under new policy.
11. Preservation renewal occurs before relevant cryptographic assumptions become unsafe when continued proof is required.
12. Signature/key renewal and content-hash/commitment renewal remain distinguishable.
13. If content-hash renewal requires original data that policy has erased, the lost future proof property is explicit rather than fabricated.
14. Provider retirement and archive retirement are independent failure domains; no unnecessary permanent live-provider dependency is introduced.
15. Redundant preservation evidence is called independent only when relevant correlated failure domains are actually diverse.
16. Historical provider status labels remain bound to the exact immutable guarantee/profile under which they were emitted.
17. Schema/provider migration preserves settlement distinctions or declares explicit lossiness/incompatibility.
18. Migration receipts prove only custody/translation claims within their scope and cannot substitute for original settlement evidence.
19. Replacement verifier implementations are qualified against immutable historical semantics/profile rather than trusted because they parse the format.
20. Published runtimes can verify locally when the declared historical evidence closure is available; Builder availability is not required.
21. Missing/unpreservable external authority produces `UNRESOLVED/BELOW_RETENTION` rather than guessed historical validity.
22. Exchange Plane transports trust/preservation evidence without becoming canonical trust or settlement authority.
23. Privacy/erasure and long-term preservation policies expose their trade-offs; evidence retention is not a blanket payload-retention exemption.
24. Historical verification returns a qualified multidimensional disposition rather than a misleading universal `VALID` boolean.

## 6. Adversarial cases

1. Provider P1 disappears and every historical witness contains only a dead P1 verification URL.
2. Archive migration re-signs `ATTEMPTED_UNKNOWN` and labels the result `SETTLED` because the new archive supports only success/failure.
3. Old public verification key is deleted on signing-key retirement, making legitimate historical evidence unverifiable.
4. Retained historical key is accidentally accepted for new effect authorization after its signing cryptoperiod ended.
5. Certificate shows `revoked`; migration drops revocation time/reason and invalidates all pre-compromise evidence indiscriminately.
6. Compromised key is treated as historically safe merely because its certificate had not expired.
7. Hash algorithm becomes unsafe before renewal; archive later re-signs the old weak digest and claims full assurance restored.
8. Signature algorithm rotates but the content commitment algorithm weakness is ignored.
9. One archive stores two copies under the same root, algorithm and operator and reports “independent redundancy.”
10. Two preservation providers depend on the same hidden TSA/root/operator failure domain.
11. Current provider docs redefine `final`; old witnesses are interpreted using the new meaning.
12. Historical witness points to mutable `schema/latest` and becomes semantically ambiguous after schema evolution.
13. Adapter maps `DISPUTED`, `UNKNOWN` and `REJECTED` into `false` during archive migration.
14. Migration receipt is presented as proof that the original external effect actually occurred.
15. New verifier accepts legacy bytes but interprets a predicate differently from the historical normative profile.
16. Builder becomes mandatory to resolve old keys/schemas, breaking autonomous runtime audit after Builder outage.
17. Exchange Plane accumulates all old keys/provider contracts and becomes the only settlement/trust oracle.
18. Privacy erasure removes original data, but documentation continues promising indefinite rehash-based preservation.
19. Full customer payload is retained forever even though only a compact effect commitment and qualification evidence are required.
20. Archive timestamp exists, so operator claims the original business action was authorized and legitimate.
21. Trust root rotates; runtime accepts a rollback to an older root because that root remains valid for historical verification.
22. Provider migration preserves signature bytes but loses the provider guarantee profile needed to interpret `ACK` versus `COMMITTED`.
23. Historical evidence is declared universally `VALID` although origin verifies but settlement proof is absent and semantic profile is below retention.
24. Renewal service becomes unavailable shortly before algorithm deprecation and the system has no declared degraded/expiration disposition.

## 7. Portability / exit path

This hypothesis does not require RFC 3161 timestamps, ERS/XMLERS, ETSI AdES, PKI/X.509, TUF, Sigstore, in-toto, Certificate Transparency, SCITT, Merkle trees, a particular archive, a particular settlement provider, or any particular cryptographic algorithm.

Any future realization must preserve:

- independence between original business claim and later preservation/renewal claims;
- immutable historical semantic/profile identity;
- historical trust qualification without re-enabling retired authority for new effects;
- explicit compromise/revocation timing where material;
- algorithm/key/root/provider migration without fabricated semantic strengthening;
- portable verification closure sufficient for the declared proof properties;
- explicit loss of proof properties when retention/erasure prevents future renewal;
- runtime autonomy and provider exit without a mandatory Builder/Exchange Plane oracle;
- claim-scoped redundancy/diversity rather than “two copies = independent proof.”

## 8. Deduplication against existing G4 research

This round does not reopen generic verifier diversity, normative semantics, provider substitution, key rotation, effect settlement, privacy retention or conflict compaction.

The material new intersection is:

`historical settlement witness x provider/archive retirement x trust/key/algorithm continuity x long-term local verification`.

Existing rules reused rather than duplicated include:

- `Latest semantics != historical semantics`;
- `Historical semantic continuity != current admissibility`;
- `Verifier installed != verifier qualified`;
- `Compaction != semantic forgetting`;
- `Provider ACK != effective state`;
- `Compensated != history erased`;
- `Evidence sufficient != payload retained`;
- `Builder != Runtime`.

## 9. Maturity and next gap

Material delta: **YES**.

This round materially changes the portability proof obligations for compacted historical effect witnesses: provider independence is insufficient unless trust, semantics, cryptographic preservation and verification dependencies are also portable over time.

Family 8 remains `RESEARCH_ACTIVE / NON_EXECUTABLE` and is not saturated.

Highest-value next gap:

**long-term proof-policy transition and assurance downgrade under evidence renewal** — determine how a witness moves between preservation profiles when old algorithms/trust roots are being retired; how to represent cases where only some proof dimensions can be renewed; how correlated compromise discovered retrospectively changes historical assurance without rewriting business history; and how runtimes compare assurance profiles without inventing one global security-strength scalar.
