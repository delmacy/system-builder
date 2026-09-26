# G4 — Long-Term Proof-Policy Transition and Assurance Downgrade

Status: `RESEARCH_ACTIVE / NON_EXECUTABLE`
Date: 2026-09-20
Scope: Generation 4 product R&D only. No implementation authority.

## 1. Research question

How should a long-lived historical witness migrate between preservation/trust profiles when algorithms, trust roots, verification policies, provider semantics or validation capabilities are retired, weakened or retrospectively compromised, while preserving business history and runtime autonomy without inventing a single scalar notion of assurance?

This document extends settlement-witness trust continuity, historical effect settlement, verifier trust continuity, immutable normative semantics and evidence-compaction research. It does not create a new macro-family and does not reopen G3.

## 2. Evidence base

Primary standards and mature guidance reviewed:

- NIST CSWP 39-upd1 (2026), `Considerations for Achieving Crypto Agility`: cryptographic agility is the capability to replace/adapt cryptographic algorithms across protocols, applications, software, hardware, firmware and infrastructure while preserving security and ongoing operation; transitions have interoperability, inventory, governance and operational trade-offs.
- NIST PQC transition material / IR 8547 transition planning: algorithm retirement is staged and use-case/time dependent rather than one instantaneous global invalidation; migration requires identifying where algorithms are used and planning replacement before deprecation/removal.
- RFC 4998 Evidence Record Syntax and RFC 6283 XMLERS, already used by the preceding G4 round: long-term evidence can be renewed before algorithms or trust mechanisms become inadequate; renewal preserves evidence under a newer basis but does not rewrite the original claim.
- ETSI TS 119 512 preservation-service model: preservation evidence augments existing signatures/evidence and must retain links between signatures, validation material and signed data; validation material needed for later verification is itself part of the preservation concern.
- ETSI long-term validation model (TS 119 102-1 family): validation can depend on proof-of-existence material, trust anchors, validation policy and certificate/status evidence, illustrating that historical validation is policy- and evidence-qualified rather than signature-only.
- ETSI 2024 LTA interoperability Plugtests: independent validators can produce divergent augmentation/validation outcomes, making validation-profile identity and qualification material to long-term assurance.
- Existing G4 artifacts on immutable normative proof semantics, verifier trust continuity/diversity, security floors, provider portability, historical effect settlement and settlement-witness trust continuity.

These are architectural evidence only. No NIST algorithm, PQC suite, ETSI profile, TSA, PKI, ERS/XMLERS, trust-list system, archive service or validation implementation is selected.

## 3. Material findings

### 3.1 Assurance is a vector, not a global strength number

A historical witness can simultaneously have strong content integrity, weak origin assurance, resolved historical semantics, incomplete revocation evidence and no authority for new effects. Collapsing those dimensions into `assurance=8/10` destroys information needed for safe migration.

`Assurance profile != scalar security level`.

Candidate dimensions include content-commitment strength, origin/authenticity qualification, historical key/trust qualification, existence/time evidence, semantic resolvability, settlement/finality support, verifier qualification, preservation-chain currentness, privacy exposure and current-use admissibility.

Profiles may be partially ordered. Profile P2 can improve one dimension and weaken another; therefore `P2 newer than P1` does not imply `P2 stronger than P1`.

### 3.2 Transition changes preservation claims, not historical business facts

Rehashing, re-signing, timestamp renewal, trust-root migration or verifier replacement can preserve or change the evidence basis. None may silently change the historical business disposition.

`Proof-policy transition != business-history rewrite`.

`Renewed UNKNOWN != COMMITTED`.

`New trust root != retroactive business authority`.

A migration result must preserve the original claim identity and separately describe the assurance dimensions gained, retained, lost or unresolved.

### 3.3 Proof-policy identity must be immutable and historical

A witness cannot safely point only to `current-policy`, `latest-profile` or current provider documentation. The validation/preservation profile under which evidence was created and the profile under which it is later evaluated are distinct identities.

`Current proof policy != historical proof policy`.

`Policy replacement != reinterpretation permission`.

A later policy may declare an older profile inadmissible for new evidence while retaining enough historical semantics to evaluate old evidence.

### 3.4 Deprecation, prohibition, compromise and obsolescence are different transitions

An algorithm or trust mechanism can be:

- supported and preferred;
- supported but deprecated for new evidence;
- prohibited for new evidence while still historically verifiable;
- no longer considered sufficient for a particular historical claim class;
- retrospectively compromised for some time/scope;
- unresolvable because necessary validation material fell below retention.

`Deprecated != compromised != historically invalid`.

A driver/adapter must not flatten these states to `supported=false`.

### 3.5 Retrospective compromise changes assurance, not the event history

If a signing key or algorithm is later discovered compromised, the business event does not disappear. What changes is what can still be proven about its origin/integrity and over which time interval.

`Historical effect occurred != historical proof remains trustworthy`.

`Assurance downgrade != historical fact deletion`.

Where trustworthy time/existence evidence predates a compromise window, some dimensions may remain supportable. Where compromise timing is unknown, the correct result can be `UNRESOLVED/CONTESTED` rather than universal invalidation or silent acceptance.

### 3.6 Renewal can be partial

A witness may successfully migrate its content commitment to a newer algorithm while its original signer qualification remains dependent on historical PKI evidence. Conversely, a new trusted timestamp may strengthen existence evidence while the original semantic profile remains only partially resolvable.

`One dimension renewed != whole witness upgraded`.

Transition records therefore need dimension-scoped outcomes rather than a universal `migration succeeded` boolean.

### 3.7 Crypto agility is not semantic agility

NIST CSWP 39 treats crypto agility as operational ability to replace/adapt cryptographic mechanisms while maintaining security and operation. G4 must keep that mechanism-level agility separate from semantic contract evolution.

`Cryptographic interoperability != semantic compatibility`.

A new signature algorithm can preserve exactly the same business claim; a new provider can expose the same signature algorithm while weakening settlement semantics. Neither transition implies the other.

### 3.8 Algorithm retirement is use-case scoped

NIST transition guidance uses staged migration/deprecation/removal rather than a single universal instant. G4 should therefore avoid one global `algorithm floor` detached from claim type and risk horizon.

`Algorithm acceptable for claim X != acceptable for claim Y`.

A low-risk historical audit witness and a credential authorizing a new irreversible effect can have different admissibility requirements even if they use the same primitive.

### 3.9 Transition overlap needs explicit admission rules

During migration, old and new profiles may coexist. Coexistence is not permission union.

`P1 and P2 both deployed != every witness may use either profile`.

Creation, continuation, historical verification and new-effect authorization can have separate cutovers. A verifier must know which profile is admissible for which operation and time/epoch.

### 3.10 Hybrid/redundant evidence does not automatically dominate single evidence

Two algorithms, signatures, roots or archives can reduce some correlated risks, but they also introduce composition semantics and new failure modes.

`Two mechanisms present != assurance doubled`.

`Hybrid accepted != either component alone sufficient`.

The profile must state whether components are `ALL_OF`, alternatives, threshold-qualified, migration overlap, or independent preservation witnesses. An adapter cannot infer this from container shape.

### 3.11 Diversity is failure-domain qualified

Two proofs produced by the same implementation, trust operator and algorithm family may not provide meaningful independent assurance. Conversely, a second mechanism can add useful resilience without becoming majority truth.

`Redundancy != independence`.

`Independent evidence != voting authority`.

This reuses prior G4 witness-governance and verifier-diversity findings.

### 3.12 Historical verifier policy is part of evidence closure

ETSI long-term validation models explicitly depend on validation policy, trust anchors and proof-of-existence/status material. A future verifier that has only the bytes and a public key may be unable to reproduce the historical conclusion.

`Signature bytes + key != complete historical validation context`.

A portable closure may therefore need immutable references or retained material for the relevant validation/preservation policy and its trust assumptions.

### 3.13 Validator disagreement is evidence, not majority truth

ETSI interoperability testing demonstrates that long-term augmentation/validation can expose divergent results among implementations. G4 should treat disagreement as a qualification/reconciliation signal.

`Two validators agree != semantic truth`.

`One newer validator disagrees != old evidence automatically invalid`.

The normative profile and qualified evidence determine the claim; implementations are evaluated against it.

### 3.14 Transition receipts must state transformation scope

A transition can produce a receipt linking old and new evidence. That receipt may prove custody, transformation parameters, source/target profiles and time.

`Transition receipt != original settlement evidence`.

It must not imply that every assurance dimension survived. Loss, unresolved dependencies and changed observer/privacy assumptions remain explicit.

### 3.15 Downgrade can be legitimate and must remain visible

Sometimes evidence cannot be fully renewed: original payload was erased, a key-status archive is unavailable, a trust root was compromised, or an algorithm failed before renewal. The system should represent the strongest still-supported qualified profile rather than fabricate continuity.

`Assurance downgrade != verification failure by definition`.

`Downgrade visible != downgrade forbidden`.

The consuming capability decides whether the degraded vector remains sufficient for its purpose.

### 3.16 No automatic upgrade from later policy

A stricter future policy does not retroactively mean old evidence met that stricter policy. A looser future policy also does not silently legalize evidence that failed its original required profile.

`Current policy stronger != historical witness originally stronger`.

`Current policy weaker != historical failure erased`.

Historical evaluation and current admissibility remain separate questions.

### 3.17 Current security floor and historical interpretation remain separate

A runtime may still interpret an old witness under P1 while refusing to use P1 to authorize new effects because the current security floor requires P3.

`Historically resolvable under P1 != currently admissible under P1`.

This preserves offline/runtime autonomy without permitting security rollback.

### 3.18 Offline autonomy requires pre-positioned transition closure

If a client runtime must verify old evidence while Builder/provider/archive is unavailable, it needs locally sufficient profile identities, trust-transition evidence and verification material within declared horizons.

`Builder offline != proof-policy transition unknowable` when closure is sufficient.

If a required transition dependency is unavailable, the runtime represents `UNRESOLVED/BELOW_RETENTION` rather than consulting an implicit central oracle or guessing.

### 3.19 Exchange Plane carries transition evidence but does not choose assurance

The Exchange Plane may transport preservation-profile refs, transition receipts, trust-root lineage, compromise windows and verification dispositions. It does not decide that profile P2 is sufficient for a capability's business purpose.

`Exchange Plane transports assurance evidence != Exchange Plane owns assurance policy`.

Capability-local contracts retain business-semantic ownership.

### 3.20 Privacy is itself a transition dimension

A replacement preservation mechanism can require more identifying metadata, centralized callbacks or retention of original payload. A cryptographically stronger migration may therefore be privacy-weaker.

`Cryptographically stronger != universally stronger`.

This is another reason assurance cannot be scalar. Migration must expose privacy/correlation changes and erasure constraints rather than laundering them through a single `upgraded` label.

## 4. Candidate research vocabulary

Research vocabulary only; no product schema is authorized.

- `ProofAssuranceProfileRef` — immutable identity of a multidimensional proof/preservation assurance profile.
- `AssuranceDimensionDisposition` — per-dimension result such as `SUPPORTED`, `DEGRADED`, `CONTESTED`, `UNRESOLVED`, `BELOW_RETENTION`, `NOT_APPLICABLE`.
- `ProofPolicyTransitionRef` — qualified relation from source profile/evidence to target profile/evidence.
- `TransitionReason` — deprecation, scheduled retirement, compromise, algorithm weakness, provider retirement, policy change, privacy/retention change or verifier replacement.
- `HistoricalValidationPolicyRef` — immutable identity/material needed to interpret historical validation rules.
- `TransitionReceiptRef` — evidence of a declared transformation without becoming original business truth.
- `AssuranceDelta` — vector of retained/improved/degraded/unresolved dimensions; not a scalar score.
- `TransitionCutover` — scoped creation/continuation/historical-verification/new-effect admission boundary.
- `CompromiseQualification` — affected mechanism, time window, scope and confidence/evidence.
- `ProofPolicyFloor` — claim/operation-scoped minimum acceptable assurance profile or predicate, not a global platform revision.

## 5. Candidate proof obligations

1. Assurance remains multidimensional and is never reduced to a universal numeric strength score.
2. Proof-policy transition never rewrites the original business claim or settlement disposition.
3. Historical and current proof-policy identities remain distinct and immutable where required.
4. Deprecation, prohibition, compromise, retirement and below-retention states remain distinguishable.
5. Retrospective compromise changes qualified assurance without deleting historical business facts.
6. Compromise/revocation time and scope remain representable where historical qualification depends on them.
7. Renewal can succeed or fail independently per assurance dimension.
8. Re-signing/rehashing/timestamping cannot strengthen business finality without independent settlement evidence.
9. Crypto agility does not imply semantic/provider contract equivalence.
10. Algorithm/profile admissibility is claim-, operation-, risk- and time-scoped rather than one global floor.
11. Coexisting profiles have explicit creation, continuation, historical-verification and new-effect admission rules.
12. Hybrid/redundant evidence declares composition semantics; presence of multiple mechanisms does not imply additive assurance.
13. Independence claims name relevant correlated failure domains.
14. Historical validation policy/trust context remains resolvable when required for long-term verification.
15. Validator disagreement remains explicit evidence requiring qualification/reconciliation, never majority truth by default.
16. Transition receipts prove only declared transformation/custody properties.
17. Lost assurance dimensions remain visible after migration; target schemas cannot flatten them to success.
18. Legitimate assurance downgrade is representable and evaluated by the consuming capability's required guarantee vector.
19. Later stronger policy does not retroactively upgrade old evidence; later weaker policy does not erase original failure.
20. Historical semantic resolvability and current security admissibility remain independent.
21. Runtime-local verification remains possible when sufficient transition closure has been pre-positioned; Builder availability is not required.
22. Missing transition dependencies yield qualified unresolved/below-retention outcomes rather than guessed equivalence.
23. Exchange Plane transports transition evidence without becoming proof-policy or business-semantic authority.
24. Privacy/correlation/retention changes are dimensions of assurance migration and cannot be hidden by a cryptographic upgrade label.

## 6. Adversarial cases

1. A migration job re-signs `ATTEMPTED_UNKNOWN` with a stronger algorithm and relabels it `COMMITTED`.
2. A global `securityLevel=5` hides that origin assurance improved while revocation evidence was lost.
3. `latest-proof-policy` silently changes meaning and historical witnesses are reinterpreted.
4. Deprecated algorithm is treated as retrospectively compromised without evidence.
5. Compromised algorithm is treated as historically safe solely because it was allowed when the witness was created.
6. Compromise discovered at T is applied as if compromise began at system inception.
7. Unknown compromise start time is silently mapped to `VALID`.
8. Content hash is renewed but old signer qualification is assumed renewed too.
9. New timestamp is treated as new proof that the business effect settled.
10. Crypto library migration is treated as proof of provider semantic compatibility.
11. One global algorithm floor invalidates harmless historical audit use and high-risk new-effect use identically.
12. P1/P2 overlap is interpreted as permission to choose whichever accepts the request.
13. Hybrid signature is accepted if either component verifies although the declared profile required both.
14. Two signatures from the same operator/library are presented as independent assurance domains.
15. Two independent validators disagree and a majority vote invents semantic truth.
16. New validator parses an old format but applies current rather than historical validation policy.
17. Transition receipt from archive A2 is presented as original provider settlement proof.
18. Migration target cannot represent `CONTESTED` and stores it as `VALID`.
19. Current stricter policy is used to claim an old witness originally met requirements it never met.
20. Current looser policy retroactively legalizes an originally inadmissible witness.
21. Runtime restores an old snapshot and rolls back its locally observed proof-policy floor.
22. Offline runtime requires Builder callback to interpret every historical transition, violating runtime autonomy.
23. Exchange gateway chooses P2 as sufficient because it is newest, overriding capability-local assurance requirements.
24. PQ/cryptographic upgrade introduces per-witness online lookup and global identifiers, silently degrading privacy/correlation guarantees.

## 7. Trade-offs and portability / exit path

- Stronger long-term assurance generally increases retained metadata, validation material and migration complexity; privacy and erasure can intentionally cap future renewability.
- Aggressive retirement reduces attack surface but can strand historical evidence if transition closure was not prepared in advance.
- Long overlap windows improve interoperability but increase downgrade/ambiguity exposure; short windows increase operational migration risk.
- Hybrid/redundant mechanisms can improve resilience against some failures while increasing cost, implementation surface and correlated-composition risk.
- Provider-neutral proof-policy identities and explicit assurance vectors reduce lock-in; provider-native labels remain qualified projections, never canonical semantics.
- Historical verification should remain possible from portable evidence packages where feasible; no archive/provider/Builder is assumed to remain an eternal online oracle.

## 8. Deduplication against existing G4 research

This round does not reopen generic crypto agility, verifier diversity, semantic policy lifecycle, evidence renewal, trust-root rotation, settlement finality, compaction, privacy federation or provider substitution. The material delta is their intersection at **long-term proof-policy transition**: partial assurance renewal, retrospective compromise, non-scalar assurance comparison, scoped cutovers and explicit downgrade across preservation-profile migration.

## 9. Maturity and next gap

Material delta: **YES**.

Family state: `RESEARCH_ACTIVE / NON_EXECUTABLE`, not saturated.

The next highest-value gap is **proof-assurance dependency composition under mixed historical profiles**: determine how a root historical guarantee composes witnesses whose integrity, origin, semantic, settlement, privacy and trust dimensions were preserved under different profile generations; how minimal cut sets and partial-order assurance work without a global scalar; and how one degraded child dimension propagates selectively without forcing either universal invalidation or false strengthening.

No implementation, provider selection, WBS, Work Package, Sprint or TASK is authorized by this document.
