# G4 — Proof-Profile Portability Across Verifier Generations

Status: `RESEARCH_ACTIVE / NON_EXECUTABLE`
Date: 2026-09-20
Scope: Generation 4 product R&D only. No implementation authority.

## 1. Research question

How can a long-offline autonomous runtime consume a `RequalificationClosureRef` or other durable exchange evidence produced by a later verifier/proof/VDS generation without trusting a gateway to reinterpret semantics, without retaining every historical verifier executable forever, and without converting unsupported proof semantics into false success or false incompatibility?

This is a focused continuation of `G4_CAPABILITY_EXCHANGE_REQUALIFICATION_FRONTIER_COMPACTION.md`, archival cryptographic durability, normative proof-semantics governance, verifier trust-continuity, settlement closure and distributed requalification research. It does not create a new macro-family and does not reopen G3.

## 2. Evidence base

Primary/mature references reviewed:

- RFC 8949 CBOR: deterministic encoding is an application/protocol choice; multiple deterministic ordering regimes exist, including compatibility with the older RFC 7049 ordering. This is evidence that equivalent data models do not imply identical authenticated bytes and that encoding identity must be explicit when bytes are part of a proof surface.
- RFC 9052 COSE: separates generic signed/encrypted structures and processing from specific cryptographic algorithms, which are defined separately. This supports separating proof container/interface from cryptosuite semantics.
- RFC 9053 COSE algorithms/capabilities: algorithm/key-type capabilities are registered and immutable once assigned; a newly required capability needs a new code point. This is a useful precedent against silently changing the semantics of an existing proof/profile identifier.
- W3C Verifiable Credential Data Integrity 1.0: a proof names a `cryptosuite`; each suite specification must define hashing, serialization, proof creation and verification algorithms. Verification may return failure or an error; inability to complete verification is not equivalent to a cryptographic negative. This is strong evidence for explicit `UNSUPPORTED/UNRESOLVED` dispositions rather than boolean flattening.
- W3C Data Integrity ECDSA/BBS cryptosuites: concrete proof suites bind proof representation, verification method form, algorithms and canonicalization/serialization procedures. The same outer proof pattern can therefore carry materially different verification semantics.
- RFC 9943 SCITT: signed statements may be registered with different Transparency Services and receipts prove registration in declared VDS regimes; relying-party trust remains external. This supports portable evidence that carries explicit proof/VDS identity rather than relying on the transport/gateway to supply meaning.
- Existing G4 normative proof semantics, verifier trust continuity, profile negotiation, archival durability and frontier compaction research.

No CBOR/COSE/W3C VC/SCITT implementation, cryptosuite, VDS, gateway, broker or verifier is selected.

## 3. Material findings

### 3.1 Portable bytes are not portable meaning

A later runtime may parse an older closure while lacking the normative semantics required to verify it.

`parseable artifact != semantically verifiable artifact`.

Proof portability therefore requires explicit immutable identities for the proof semantics, canonical/authenticated representation, cryptographic suite, VDS/receipt regime where applicable, and the trust/currentness assumptions needed by the advertised claim.

### 3.2 Container compatibility, cryptographic compatibility and contract compatibility are distinct

COSE deliberately separates message structures from algorithm definitions. W3C Data Integrity similarly uses a common proof pattern whose `cryptosuite` selects concrete hashing/serialization/verification procedures.

`same proof container != same proof semantics`.

A generic parser or envelope adapter can normalize syntax without gaining authority to claim semantic equivalence between proof profiles.

### 3.3 Unknown proof semantics is not a failed proposition

W3C Data Integrity distinguishes a verification result from an error where verification could not complete. The implementation-independent G4 analogue is:

`unsupported/unresolvable verifier profile != proposition false`.

A consumer that cannot resolve or execute the required normative proof semantics must return an explicit qualified disposition such as `UNSUPPORTED_PROOF_PROFILE`, `UNRESOLVABLE_SEMANTICS`, or `REQUIRES_REBOOTSTRAP/TRANSLATION_EVIDENCE`. It must not map the condition to success, absence, ordinary signature failure or business denial without contract authority.

### 3.4 Historical semantics should be retained as specifications/evidence, not necessarily as executable binaries

Existing G4 research already rejects indefinite executable-verifier retention. This round refines the exit path:

`historical semantic resolvability != historical executable retention`.

A durable profile may remain interpretable through immutable normative semantics, canonical encoding rules, algorithm identifiers, test vectors, trust material/provenance and qualified migration evidence while vulnerable historical executables are removed from the active TCB.

### 3.5 Reimplementation is not reinterpretation permission

A modern verifier may implement an old profile, but it must implement the old profile's immutable semantics.

`new verifier implementation != new semantics for old profile id`.

If an ambiguity or substantive correction changes accepted/rejected proofs, the corrected semantics require an explicit successor/correction identity and relation rather than silently redefining the historical profile.

### 3.6 Deterministic encoding identity is part of the authenticated proof surface when bytes matter

RFC 8949 demonstrates that more than one deterministic CBOR ordering regime can exist. Therefore a closure cannot say merely `CBOR canonical` and assume future verifiers know which bytes were authenticated.

`same abstract fields != same authenticated bytes`.

Where proof verification depends on serialized bytes, `CanonicalEncodingProfileRef` or equivalent immutable identity is material to portability.

### 3.7 Proof migration requires bridge evidence, not gateway translation

If closure C1 uses profile P1 and a later environment supports only P2, a gateway may translate representation, but translation alone cannot assert preserved guarantees.

`protocol/representation translation != proof-semantic equivalence`.

A `ProofMigrationBridgeRef` must qualify which propositions, proof obligations, encoding assumptions, trust roots and failure modes are preserved, weakened or unsupported. Lossy mediation remains visible.

### 3.8 A bridge may preserve only a subset of the old proof's claims

Migration can be claim-selective. P2 may preserve integrity and provenance while failing to preserve selective-disclosure, non-equivocation or historical-currentness semantics from P1.

`partial proof migration != full profile compatibility`.

Bridge evidence therefore advertises a guarantee vector, not one `compatible=true` bit.

### 3.9 Verification method availability is a separate dependency from proof syntax

A proof may name a supported cryptosuite but depend on verification material that is unavailable, retired, below a trust floor or no longer resolvable.

`supported algorithm != verifiable historical claim`.

Portability requires explicit treatment of verification-method resolution, historical trust material, revocation/currentness and archival evidence as independent dependencies.

### 3.10 Current admissibility remains separate from historical verifiability

A modern runtime may successfully verify an old proof cryptographically while policy forbids that profile for new protected effects.

`historically verifiable != currently admissible`.

Conversely, retirement of a profile for new use must not erase historical interpretation required for settlement/audit.

### 3.11 A profile capability advertisement is not proof that a runtime executed that profile

COSE capabilities and similar registries describe support characteristics. They do not prove which semantics governed a particular historical interaction.

`supported capability != executed proof lineage`.

Closure/effect lineage retains the actual profile identity and activation/admission evidence.

### 3.12 Immutable identifiers need immutable semantic referents

RFC 9053's rule that registered capability definitions are immutable and require new code points for new capabilities is a strong precedent.

`same identifier + changed normative behavior = semantic aliasing hazard`.

G4 profile identities should resolve to immutable normative semantics or to an immutable snapshot/reference whose correction/supersession graph is explicit.

### 3.13 Future-proof extension points must fail closed only for the claims they cannot establish

Extensibility does not justify accepting unknown semantics, but global rejection may also be too coarse when a closure contains independently verifiable components.

`unknown component != whole artifact false`.

The consumer evaluates materiality: an unsupported component that is required for the requested claim defeats/blocks that claim; an explicitly optional, irrelevant component may remain ignored only when the governing profile permits it.

### 3.14 Proof-purpose/authority binding survives verifier generation changes

Cryptographic verification alone is insufficient if a proof was made by a key valid for another purpose. W3C Data Integrity binds `proofPurpose` to the verification relationship.

`signature verifies != signer authorized for this proof purpose`.

A migration/modern verifier cannot drop purpose/authority binding for convenience.

### 3.15 Portability needs a local bootstrap floor

A very old runtime may not understand the successor profile or bridge format at all. There is a finite boundary below which automatic proof migration is unsafe.

`artifact available != local verifier qualified`.

A `ProofPortabilityFloorRef` can identify the minimum normative/verifier capability needed to evaluate a closure. Below that floor the safe path is explicit re-bootstrap/upgrade under already-qualified local trust, not gateway assertion.

### 3.16 Bootstrap/upgrade authority is not proof authority

A mechanism authorized to install a newer verifier does not thereby become authorized to declare old evidence valid.

`verifier update authority != proposition authority`.

After upgrade, the new verifier independently evaluates the evidence under the qualified normative profile and local trust floors.

### 3.17 Proof-profile migration must preserve anti-rollback state

Installing a verifier that understands P2 cannot lower locally remembered defeats/retirements for P1, and rollback to an older verifier cannot erase a learned floor.

`verifier rollback != proof/security floor rollback`.

Anti-resurrection state remains outside ordinary executable-version rollback semantics.

### 3.18 Multiple verification paths are evidence, not majority truth

An old-profile interpreter, a new clean-room implementation and a migration bridge may disagree.

`two verifiers/bridges agree != semantic truth by vote`.

Disagreement is a qualified conflict requiring profile/TCB/failure-domain analysis; it cannot be resolved by majority or latest software version.

### 3.19 Archival re-signing does not change the original proof profile

A historical P1 proof may receive later preservation evidence under modern cryptography. The preservation layer proves bounded properties about the old artifact/evidence chain; it does not convert P1 into P2.

`modern archival protection != modernized original semantics`.

This preserves the distinction established by archival durability research between evidence renewal and authority/semantic renewal.

### 3.20 Transport substitution remains independent of proof-profile substitution

A closure may move from file to HTTP, broker, stream or direct call without changing proof semantics.

`transport migration != proof-profile migration`.

Likewise, moving the same bytes through a trusted gateway does not make an unsupported profile supported.

## 4. Candidate vocabulary

Research vocabulary only:

- `ProofProfileRef` — immutable identity of the normative proof semantics required to interpret/verify an artifact.
- `CanonicalEncodingProfileRef` — immutable identity of authenticated/deterministic representation rules where byte representation is material.
- `CryptoSuiteRef` — cryptographic algorithm/suite identity and parameter regime used by a proof.
- `VerificationMethodSnapshotRef` — historically qualified verification material/reference sufficient for the proof's intended validation context.
- `ProofMigrationBridgeRef` — qualified evidence relating predecessor and successor proof regimes for explicitly named guarantees.
- `BridgeCoverageRef` — guarantee vector and scope actually preserved by a migration bridge.
- `ProofPortabilityFloorRef` — minimum locally qualified semantic/verifier capability needed to evaluate an artifact/bridge safely.
- `UnsupportedProofDisposition` — explicit result when required proof semantics cannot be resolved or executed.
- `HistoricalProofInterpreterRef` — normative, non-authoritative reference needed to interpret a retired proof regime without requiring its original executable.
- `ProofPurposeRef` — immutable/qualified purpose or authority relationship that the proof must satisfy.

These are candidate structural refs/roles, not shared business entities or concrete components.

## 5. Candidate proof obligations

1. Every portable proof/closure binds an immutable proof-profile identity sufficient to locate its normative semantics.
2. When authenticated bytes are material, the exact canonical/deterministic encoding profile is identified.
3. Proof container/schema compatibility is never promoted to cryptographic or semantic compatibility.
4. Unsupported/unresolvable proof semantics remain distinct from proof failure and business denial.
5. A modern verifier implementing an old profile preserves that profile's immutable normative behavior rather than reinterpreting it.
6. Substantive semantic corrections create explicit successor/correction identities and relations.
7. Historical interpretation does not require indefinite retention of vulnerable historical verifier executables in the active TCB.
8. Migration between proof profiles uses qualified bridge evidence for every guarantee claimed preserved.
9. Lossy/partial migration exposes weakened or unsupported guarantees explicitly.
10. Verification-method resolution/trust/currentness is independently qualified from algorithm support.
11. Historical cryptographic verifiability remains distinct from current admissibility for new protected effects.
12. Capability/support advertisements do not replace occurrence/effect proof-profile lineage.
13. Profile identifiers have immutable semantic referents; mutable `latest` aliases cannot authenticate historical meaning.
14. Unknown extension components block only claims for which they are material, according to the governing profile; they never yield optimistic success.
15. Proof purpose/authority relationships survive representation, verifier and bridge migration.
16. A runtime below the required portability floor performs explicit qualified upgrade/re-bootstrap or returns unsupported; it does not trust gateway reinterpretation.
17. Verifier/bootstrap update authority does not become authority over the proposition being verified.
18. Verifier rollback/restore cannot lower locally durable proof/security/retirement floors.
19. Differential verifier/bridge disagreement remains qualified conflict, not majority truth.
20. Archival renewal preserves original proof-profile identity and cannot relabel historical semantics.
21. Transport/provider substitution does not mutate proof-profile identity or guarantees.
22. A bridge's own normative semantics, producer provenance, trust dependencies and currentness are explicit and independently verifiable.
23. Compacted closures preserve enough predecessor profile/bridge lineage to answer every advertised historical/requalification query.
24. If required semantics cannot be resolved with qualified local evidence, the result degrades to explicit `UNSUPPORTED/UNRESOLVABLE/REQUIRES_REBOOTSTRAP`, never fabricated equivalence.

## 6. Adversarial cases

1. Old runtime parses a future closure and treats unknown proof fields as harmless while they are security-critical.
2. Gateway verifies P2 and tells a P1-only runtime `valid=true`, becoming accidental semantic oracle.
3. Adapter converts COSE/JSON representation and silently claims proof equivalence.
4. Runtime maps unsupported cryptosuite to ordinary signature failure and triggers incorrect business denial/settlement.
5. Runtime maps unsupported cryptosuite to success because the outer schema is valid.
6. New verifier changes canonicalization for an old profile identifier and accepts bytes the historical profile would reject.
7. `canonical CBOR` is recorded without identifying which deterministic ordering regime authenticated the evidence.
8. Profile correction is published under the same immutable identifier and rewrites historical meaning.
9. Historical verifier binary is retained indefinitely despite known vulnerabilities because audit needs old semantics.
10. Historical verifier binary is deleted together with all normative semantics/test vectors, making old evidence uninterpretable.
11. P1-to-P2 bridge preserves signature integrity but drops proof-purpose/authority binding.
12. Bridge advertises `compatible=true` although selective-disclosure/non-equivocation guarantees were lost.
13. Supported algorithm is accepted even though required historical verification key/trust evidence is unavailable.
14. Cryptographically valid retired profile is accepted for a new protected effect below the current security floor.
15. Runtime support advertisement is treated as evidence that an in-flight obligation was actually admitted under that profile.
16. Unknown optional extension is globally rejected even though the governing profile proves it irrelevant to the requested claim, causing false incompatibility.
17. Unknown required extension is ignored for availability, causing false success.
18. Verifier updater signs a package and its signature is treated as proof that every historical closure now validates.
19. Rollback to old verifier resurrects a proof profile previously retired by a stronger local floor.
20. Two migration bridges agree because they share the same faulty normative library and are counted as independent confirmation.
21. Modern archival timestamp/re-signature is treated as if the original P1 proof were generated under P2 semantics.
22. Moving evidence through a trusted service mesh/gateway is treated as proof-profile upgrade.
23. Compaction drops predecessor profile identity after migration, preventing later audit of whether the bridge actually covered the old claim.
24. Very old offline runtime cannot understand bridge semantics and silently trusts a human-readable `currentProfile=P3` field.

## 7. Technology-independent decision criteria

A closure/evidence artifact is portable to a different verifier generation only when the consumer can establish, locally or through explicitly qualified bootstrap evidence:

1. **Semantic identity:** immutable `ProofProfileRef` and normative semantics are resolvable.
2. **Authenticated representation:** encoding/canonicalization rules used by the proof are known when bytes are material.
3. **Cryptographic support:** algorithm/suite and parameters are supported and security-admissible for the intended historical/current use.
4. **Verification authority:** verification method, purpose and trust/currentness evidence are sufficient.
5. **Migration coverage:** any profile transition has explicit bridge evidence naming guarantees preserved/lost.
6. **TCB qualification:** the current verifier is qualified for that immutable profile or the runtime returns unsupported.
7. **Floor preservation:** upgrade, rollback, restore and translation cannot lower locally learned security/profile floors.
8. **Historical separation:** current admissibility and historical interpretability remain independent.
9. **Conflict visibility:** disagreement or ambiguous semantics remain representable.
10. **Autonomy:** no Builder/gateway/central service is required as semantic oracle after the runtime possesses the necessary qualified closure/bootstrap evidence.
11. **Portability:** file, direct call, IPC, HTTP/RPC, broker or stream may carry the same proof artifact without changing its semantic identity.
12. **Exit path:** retirement of an implementation or cryptosuite preserves normative/historical resolvability through durable specifications/evidence and explicit successor relations rather than permanent executable lock-in.

## 8. Portability and exit path

The implementation-independent target is not a universal verifier binary. It is a durable proof contract whose semantic identity survives verifier/provider replacement.

A plausible exit path for an obsolete verifier generation is:

1. preserve immutable normative profile and encoding semantics;
2. preserve qualified historical verification/trust material needed by live obligations;
3. qualify a replacement implementation against the old immutable profile;
4. where direct old-profile support is intentionally dropped, produce explicit migration/bridge evidence for the exact guarantees that must survive;
5. preserve original profile lineage and anti-rollback floors after migration;
6. remove vulnerable historical executables from the active TCB when no longer required;
7. return explicit unsupported/re-bootstrap disposition below the supported portability floor.

This avoids both permanent executable lock-in and semantic reinterpretation by a gateway.

## 9. Deduplication against existing G4 research

This round does not reopen:

- normative proof-semantics governance generally;
- verifier diversity/qualification generally;
- archival cryptographic renewal generally;
- profile negotiation/downgrade resistance generally;
- frontier compaction generally;
- root/witness rotation;
- transport protocol selection.

Material delta is specifically:

`compacted/portable closure -> verifier generation skew -> immutable proof+encoding identity -> unsupported-semantics disposition -> qualified proof migration bridge -> historical semantics without permanent executable retention -> autonomous long-offline consumption`.

## 10. Maturity and next gap

Maturity: `RESEARCH_ACTIVE / NON_EXECUTABLE`, not saturated.

This round materially closes the immediate portability gap identified by frontier compaction: a closure is not portable merely because future software can parse it. Portability requires immutable proof semantics, encoding identity, trust/purpose resolution and explicit migration evidence.

Next highest-value gap:

**proof-migration bridge qualification under semantic ambiguity and implementation diversity** — determine how a bridge between P1 and P2 can itself be qualified when old normative semantics contain ambiguity/errata, when multiple clean-room interpreters disagree, and when preserving a claim requires demonstrating implication/equivalence across two proof systems without allowing the bridge or a reference implementation to become normative authority.

## 11. Non-authority statement

This document records research hypotheses and evidence only. It does not authorize product architecture materialization, code, provider adoption, cryptographic suite selection, WBS, Work Package, Sprint, TASK or migration.