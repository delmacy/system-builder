# G4 — Proof Verifier Trust Continuity & Diverse-Verifier Equivalence

Status: `RESEARCH_ACTIVE / NON_EXECUTABLE`
Execution authority: NONE
Date: 2026-09-19
Parent family: Shared Semantic Kernel / Capability Exchange Plane / Inter-Capability Boundary Model

## Purpose

Deepen the highest-value gap from proof-carrying exchange-policy research: determine how an autonomous runtime can preserve trust continuity while proof verifier/kernel generations change; what independent verifier diversity can and cannot establish; how conformance corpora, differential checking, verified kernels, reproducible builds and diverse builds contribute; and how a runtime can migrate from verifier V1 to V2 without keeping V1 forever or accepting proofs under an unqualified interpretation.

This is not a new macro-family. It selects no policy language, proof calculus, verifier, theorem prover, update framework, compiler, build system, gateway, broker or provider and grants no implementation authority.

## Evidence classes reviewed

Primary/mature evidence used in this round:

- The Update Framework (TUF) specification and security model: trusted-root continuity, threshold trust, sequential root versions, dual authorization by old and new root during rotation, persistence of trusted root state, rollback/freeze/mix-and-match resistance and bounded recovery assumptions.
- TUF client conformance results: multiple independently maintained clients are tested against a common conformance suite, illustrating useful implementation diversity while not proving semantic equivalence by itself.
- Lean proof-checking ecosystem and Lean Kernel Arena: independent checker implementations, common valid/invalid corpora, explicit rejection/decline outcomes and differing implementation strategies illustrate differential verification and the distinction between implementation agreement and specification-level soundness.
- Alethe / Carcara / cvc5 proof checking: external proof checking can decouple producer from consumer, while proof-rule coverage and checker support remain version/profile qualified.
- LFSC: proof compatibility depends on checking signatures/rule sets; old proofs may be incompatible with newer signatures.
- seL4 verification: strong assurance derives from an explicit proved relation and explicit assumptions; proof strength is configuration/property scoped rather than a generic `verified` label.
- Reproducible Builds: same source, environment and instructions can yield bit-identical artifacts; this establishes source-to-binary reproducibility under the declared build perimeter, not source correctness or independent semantic diversity.
- Diverse Double-Compiling (DDC): diversity can address trusting-trust/compiler-subversion questions when the stated assumptions hold; it is a source/binary correspondence technique, not a proof that verifier semantics are correct.
- Prior G4 composition-policy lifecycle, semantic policy-diff and proof-carrying runtime-verification research.

Representative references:
- https://theupdateframework.github.io/specification/
- https://theupdateframework.github.io/security.html
- https://theupdateframework.github.io/tuf-conformance/
- https://lean-lang.org/faq/
- https://arena.lean-lang.org/
- https://github.com/ufmg-smite/carcara
- https://github.com/cvc5/LFSC
- https://sel4.systems/Verification/proofs.html
- https://reproducible-builds.org/docs/definition/
- https://dwheeler.com/trusting-trust/

## 1. Verifier continuity is a trust transition, not an ordinary package upgrade

A proof verifier decides whether evidence is admissible for a semantic/security proposition. Replacing it changes part of the runtime TCB.

```text
Verifier V2 installed
!= Verifier V2 qualified
```

The transition therefore needs an authority path independent of the proof producer whose claims the verifier checks. A compromised Builder must not be able to replace policy, proof and verifier under one undifferentiated trust root and thereby manufacture acceptance.

TUF supplies a useful implementation-independent lesson: root trust rotation is sequential and a new root is accepted only when authorized under both the previously trusted root threshold and the new root threshold. G4 does not adopt TUF, but preserves the principle that trust-root/verifier generation changes require explicit continuity evidence rather than version-number novelty.

## 2. Anti-rollback applies to verifier trust state

A runtime that has accepted verifier generation V3 cannot silently restore V1 after VM snapshot, golden recovery or filesystem rollback merely because V1 remains correctly signed.

```text
Verifier artifact signature valid
!= verifier generation current
```

Locally durable verifier frontier/currentness is therefore distinct from verifier binary integrity. If continuity cannot be established after recovery, the state is `UNKNOWN/QUARANTINE`, not false currentness.

Historical effects retain the verifier/proof/dependency revisions actually used; rejecting V1 for future admissions does not rewrite prior effects.

## 3. Diverse verifiers are useful only relative to one normative semantics

Two implementations accepting the same proof do not establish correctness unless there is a qualified proposition/proof-language semantics they are both intended to implement.

```text
V1 accepts P && V2 accepts P
!= P is semantically valid
```

They may share the same misunderstood specification, generated parser, rule library, test oracle or copied bug. Diversity reduces some common-mode implementation risk; it does not create truth by voting.

The desired relation is instead:

```text
VerifierImplementation
  -> conforms to NormativeProofSemantics(profile, version)
```

Agreement is supporting evidence for this relation, not its definition.

## 4. Differential verification detects disagreement; it does not resolve authority

A diverse-verifier mode can produce:

```text
AGREE_ACCEPT
AGREE_REJECT
DISAGREE
UNSUPPORTED_BY_ONE
RESOURCE_EXHAUSTED
```

`DISAGREE` is valuable evidence that at least one implementation/profile assumption differs. It does not say which verifier is right.

```text
Differential disagreement != automatic majority decision
```

A 2-of-3 checker vote is not analogous to Byzantine consensus over replicas because all three may implement the same semantic bug. Any production use of multiple verifiers must define whether they are defense-in-depth, qualification evidence, runtime admission gates or forensic tools; these are different roles.

## 5. Conformance corpora are necessary evidence, not semantic proof

The TUF conformance matrix and Lean Kernel Arena show the value of shared good/bad/corner-case corpora across implementations. Such corpora expose divergence and regression and help qualify version skew.

But finite tests cannot prove absence of an acceptance bug over an unbounded proof language.

```text
Passes common corpus
!= semantically equivalent for all proofs
```

A useful corpus should contain valid proofs, invalid proofs that exercise each rejection obligation, malformed/adversarial proofs, boundary/resource cases, historical regression proofs and version-transition cases. Corpus version/hash becomes evidence metadata, not canonical proof semantics.

## 6. Verified kernel and diverse implementation address different failure classes

A formally verified checker can establish that its implementation refines a declared formal semantics, subject to theorem/proof-chain assumptions. An independently implemented checker can expose common implementation mistakes or supply a separate operational TCB.

```text
Verified implementation != independent implementation
Independent implementation != formally sound implementation
```

These mechanisms compose but are not substitutes. seL4 is a useful benchmark because its assurance claims remain explicit about property, configuration and assumptions rather than collapsing to `verified=true`.

For G4, a future verifier assurance profile should name at least: normative semantics/profile, implementation identity, assurance class, proof/compiler chain where applicable, unsupported features, build provenance and current security status.

## 7. Reproducible builds prove artifact correspondence, not semantic diversity

Reproducible Builds defines reproducibility as independent parties obtaining bit-identical outputs from the same source, build environment and instructions. This is highly useful for proving which verifier binary corresponds to a reviewed source/build recipe.

```text
Reproducible verifier binary
!= verifier semantics correct
```

Moreover, two reproducible builds of the same source are intentionally not implementation-diverse.

```text
Reproducibility != verifier diversity
```

Reproducibility strengthens provenance and supply-chain evidence; semantic assurance still comes from specification, proof, validation and/or independent implementations.

## 8. Diverse Double-Compiling addresses a narrower supply-chain question

DDC can provide strong evidence that an executable corresponds to compiler source despite trusting-trust style compiler subversion, under its assumptions.

```text
DDC correspondence evidence
!= proof-checker semantic correctness
```

DDC/reproducible builds may reduce the risk that a qualified verifier source was maliciously transformed during build. They do not prove that the source correctly implements the proof calculus.

## 9. Verifier generation transition needs an explicit bridge

A future runtime should not require V1 forever. It needs evidence that V2 is qualified for the relevant proof profiles and that the transition itself is authorized/current.

Candidate implementation-independent transition classes:

1. **Same-semantics replacement** — V2 is qualified against the same normative proof semantics/profile as V1.
2. **Semantics extension** — V2 supports a strict superset, while old proofs retain their original interpretation and new rules are admitted only under a new qualified profile.
3. **Semantics correction** — a prior rule/interpretation was wrong; proofs relying on it require explicit disposition/requalification rather than silent reinterpretation.
4. **Breaking replacement** — V2 changes calculus/proposition interpretation incompatibly; migration requires proof conversion with qualified semantics or regeneration/requalification.

```text
Verifier upgrade
!= proof reinterpretation permission
```

A proof produced for profile R1 must never be re-read under changed R2 rule meaning merely because V2 can parse the bytes.

## 10. Overlap can bound transition risk without permanent verifier retention

A bounded transition may temporarily retain V1 and V2 to compare/check a qualified corpus and selected live proof classes. Once V2 qualification and transition gates are satisfied, V1 can retire for new admissions while historical records preserve `verifierRef=V1`.

```text
Historical verifier reference
!= executable verifier retention forever
```

For forensic replay, the system may preserve source/artifact refs, build provenance, proof bytes and semantics profile without requiring the old verifier to remain in the active TCB. If future re-verification is required, it needs a qualified historical checker environment or a proven/validated migration path.

## 11. Emergency verifier revocation is independent from normal upgrade

If V1 has a known invalid-proof acceptance bug, waiting for ordinary feature migration can be unsafe. Security supersession may mark V1 inadmissible for new effects even when V1 remains correctly signed and its proofs remain cryptographically intact.

```text
Verifier integrity valid
!= verifier security-admissible
```

This composes with prior G4 security-floor research: revocation effective time, runtime observation time and historical effect time remain separate. Offline runtimes can only enforce revocation after observing it, subject to declared security-currentness horizons.

## 12. Independent verifier diversity must include dependency diversity where claimed

Two checkers written in different languages but sharing the same generated parser, rule database, normalization library or foreign-function kernel may not provide the claimed independence.

Candidate diversity dimensions include:

```text
implementation lineage
programming language/runtime
parser/decoder
normalizer
rule database/signature
proof-kernel logic
compiler/toolchain
build pipeline
maintainer/update authority
trust root
```

No universal diversity score is proposed. A compromise-containment claim must name the failure domains it assumes independent.

## 13. Proof producer, verifier and verifier-update authority remain separate roles

A useful trust topology is:

```text
proof producer -> proposes proof
verifier       -> checks derivation
update authority -> qualifies verifier generation/profile
runtime        -> applies local currentness/security policy
```

One organization may implement several roles, but the contracts remain distinct. The Exchange Plane may carry verifier/proof refs and currentness evidence; it does not become business authority or a mandatory online verification service.

## 14. Candidate verifier qualification record

Research vocabulary only:

```text
VerifierQualification
  verifierArtifactRef/hash
  verifierGeneration
  normativeSemanticsRef
  proofLanguage/profile/version
  supportedRules/theories
  assuranceClass
    conformance
    differential
    formallyVerified
    reproducibleBuild
    diverseBuild/DDC
  corpusRef/hash
  knownUnsupportedCases
  resourceProfile
  build/source/provenance refs
  trust/updateAuthorityRef
  validFrom / currentness horizon
  supersedes / revokedBy
```

This is evidence about a verifier, not canonical business state.

## 15. Candidate proof obligations

Before implementation planning, prove or explicitly bound:

1. verifier replacement is treated as a TCB/trust transition, not an ordinary package update;
2. verifier-update authority is not silently identical to the untrusted proof producer for compromise-containment claims;
3. verifier frontier/currentness survives reboot, snapshot, golden recovery and rollback attempts;
4. a signed old verifier cannot regain current status solely because its signature remains valid;
5. every verifier generation is bound to an explicit normative proof semantics/profile;
6. two-verifier agreement is not treated as semantic proof without qualification against that normative semantics;
7. differential disagreement yields explicit `DISAGREE/UNKNOWN`, not majority-invented truth;
8. unsupported semantics/resource exhaustion remain distinct from proof rejection;
9. conformance corpora include positive, negative, adversarial, boundary and historical-regression cases;
10. corpus success is evidence, not universal equivalence proof;
11. formal verification claims name exact property, configuration, proof chain and assumptions;
12. reproducible-build evidence is not misrepresented as semantic correctness or implementation diversity;
13. DDC/diverse-build evidence is not misrepresented as proof-calculus correctness;
14. same-semantics, extension, correction and breaking verifier transitions have distinct migration rules;
15. proof rule/profile meaning cannot change silently under the same identifier;
16. historical verifier references do not require indefinite executable retention in the active TCB;
17. emergency verifier revocation can supersede normal upgrade while preserving historical evidence;
18. diversity claims identify shared parser/rule/library/toolchain/trust-root failure domains;
19. runtime verification remains local/offline-capable within declared verifier/security currentness horizons;
20. verifier qualification artifacts remain evidence and do not become capability business authority or canonical business truth.

## 16. Adversarial cases

1. Builder compromises proof producer and ships a permissive verifier under the same update authority;
2. V2 has a higher version but redefines one proof rule more permissively;
3. runtime restores a VM snapshot containing V1 after V1 was security-revoked;
4. V1 and V2 both accept an invalid proof because they share the same buggy generated parser;
5. three verifiers vote 2-of-3, but two are forks of the same implementation with the same bug;
6. two independent implementations agree because both copied an ambiguous rule from the same non-normative example;
7. differential checker treats timeout from one verifier as rejection and declares agreement incorrectly;
8. common corpus lacks malformed nested proofs that trigger an acceptance bug;
9. V2 passes every corpus test but has an untested theory-rule bug;
10. formally verified checker is run in an unverified configuration outside the proved profile;
11. reproducible build of a semantically buggy verifier is presented as proof of correctness;
12. DDC proves binary/source correspondence for a checker whose source implements the wrong calculus;
13. proof bytes generated for rule profile R1 are parsed under R2 with changed semantics;
14. proof-format converter maps a retired R1 rule into a superficially similar R2 rule;
15. old verifier is deleted and historical audit later assumes V2 acceptance proves V1 would have accepted the original proof;
16. V1 is kept forever for historical replay and later becomes an exploitable active attack surface;
17. emergency V1 revocation is ignored offline beyond the declared security horizon;
18. V2 update is correctly signed but the local verifier frontier was rolled back before installation;
19. two verifiers use different resource limits and disagreement is misclassified as semantic divergence;
20. verifier qualification registry outage blocks runtime decisions even though locally qualified verifier/proof artifacts remain within currentness horizons.

## 17. Material synthesis

Durable boundaries added by this round:

```text
Verifier installed != verifier qualified
Verifier artifact signature valid != verifier generation current
Two verifiers agree != proposition semantically valid
Differential disagreement != majority truth
Passes common corpus != semantic equivalence for all proofs
Verified implementation != independent implementation
Independent implementation != formally sound implementation
Reproducible build != semantic correctness != verifier diversity
DDC/source-binary correspondence != proof-calculus correctness
Verifier upgrade != proof reinterpretation permission
Historical verifier reference != executable verifier retention forever
Verifier integrity valid != verifier security-admissible
```

The implementation-independent hypothesis is therefore: proof-carrying exchange policy can reduce producer trust only if verifier trust itself has explicit continuity, anti-rollback/currentness, normative semantics/profile binding and bounded migration. Diversity, conformance, formal verification, reproducible builds and DDC are complementary evidence classes with different failure coverage; none may be promoted to a generic `verified=true`. Runtime autonomy remains compatible with this model because verifier qualification/currentness evidence can be shipped and persisted locally rather than requiring an online Builder or global verifier service.

## 18. Maturity and next gap

This round materially changes the proof-carrying boundary, so it is not `NO_MATERIAL_DELTA`.

Family 8 remains `RESEARCH_ACTIVE / NON_EXECUTABLE` and not saturated.

Highest-value remaining gap: **normative proof-semantics governance and ambiguity containment** — determine how a proof language/rule profile itself is authored, versioned, tested and evolved without making one implementation the specification; how ambiguities and errata are resolved without retroactively changing historical proof meaning; how custom/theory rules enter or leave a profile; and how independent verifiers can bind to immutable semantics snapshots while security fixes still supersede unsafe interpretations.

No verifier, proof language, theorem prover, update framework, reproducible-build stack, DDC tool, compiler, gateway, broker or provider is selected.