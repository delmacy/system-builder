# G4 — Proof-Migration Bridge Qualification Under Semantic Ambiguity

Status: `RESEARCH_ACTIVE / NON_EXECUTABLE`
Date: 2026-09-21
Scope: Generation 4 product R&D only. No implementation authority.

## 1. Research question

How can a `ProofMigrationBridgeRef` justify implication or bounded equivalence from historical proof profile P1 to successor profile P2 when P1 contains prose ambiguity, errata or underspecification; independently developed interpreters disagree; and no bridge, reference implementation, test suite or majority of implementations may become accidental normative authority?

This is a focused continuation of `G4_CAPABILITY_EXCHANGE_PROOF_PROFILE_PORTABILITY.md`, normative proof-semantics governance, verifier trust-continuity/diversity, semantic policy-diff proof, archival durability and requalification-frontier compaction. It does not create a new macro-family and does not reopen G3.

## 2. Evidence base

Primary standards and mature research reviewed:

- WebAssembly specification and SpecTec work: WebAssembly deliberately couples prose with formal semantics, reference interpretation and tests. SpecTec was adopted for future WebAssembly specification authoring in 2025 and generates multiple artifacts from one typed semantic source; development found bugs in manually maintained prose. This is evidence that prose/reference/tests can drift and that a generated single semantic source can reduce, but not magically eliminate, qualification obligations.
- Wasm SpecTec paper (Breitner et al.): standardization historically required formal specification, prose pseudocode, reference interpreter and unit tests; SpecTec aims to generate/check these artifacts from one source. This provides a mature benchmark for triangulating normative semantics without making one implementation behavior the definition by accident.
- P4-SpecTec (2026): mechanizing the current P4 specification reportedly found 24 bugs across the official specification and reference compiler. This is empirical evidence that specification and reference implementation disagreement is a real standards-engineering problem and that executability/mechanization can expose it.
- W3C Verifiable Credential Data Integrity 1.0/1.1: each cryptosuite must specify hashing, serialization, proof creation and proof verification algorithms; verification errors are distinct from negative verification. This supports bridge qualification against explicit algorithms and explicit unsupported/indeterminate outcomes rather than boolean compatibility.
- RFC 9053 COSE: registered capability definitions are immutable; a newly needed capability requires a new code point. This is a useful precedent against silently resolving an ambiguity by changing the meaning of an existing profile identity.
- RFC 8999 / QUIC invariants: explicitly separates properties intended to remain invariant across protocol versions from version-specific semantics. This supports qualifying migration by named invariant/claim rather than assuming whole-profile equivalence.
- nqsb-TLS and FLEXTLS research: ambiguous prose specifications and implementation complexity are documented sources of TLS divergence; executable specifications/test oracles and adversarial scenario testing expose conformance and state-machine faults.
- TLS protocol-state fuzzing: independent TLS implementations exhibited different inferred state machines and security flaws, showing that implementation consensus or shared wire compatibility is insufficient evidence of semantic equivalence.

No formal language, proof assistant, reference interpreter, WebAssembly/P4 machinery, TLS tool, W3C cryptosuite, COSE profile or QUIC mechanism is selected.

## 3. Material findings

### 3.1 Bridge qualification is a semantic theorem claim, not a translation claim

A migration bridge P1 -> P2 is useful only for explicitly named claims/guarantees. At minimum it claims an implication such as:

`Accept_P1(x, context) -> Accept_P2(T(x), mapped_context)`

or another relation with explicitly declared direction, preconditions and loss surface.

`bridge executes translation != bridge proves semantic implication`.

A bridge implementation is therefore evidence-producing machinery, not normative authority.

### 3.2 Ambiguous predecessor semantics make unconditional equivalence unprovable

If two reasonable, independently qualified interpretations I1 and I2 of P1 disagree on an input material to the migrated claim, then a bridge cannot honestly advertise unconditional `P1 == P2` merely because one interpretation matches P2.

`unresolved predecessor ambiguity + material divergence != full bridge equivalence`.

The safe outcomes are claim restriction, explicit ambiguity domain, successor/correction semantics, or `INDETERMINATE/UNSUPPORTED` for affected cases.

### 3.3 Normative authority and executable oracle must remain separable

WebAssembly's move toward SpecTec demonstrates the value of generating prose, executable semantics and proof-assistant artifacts from one semantic source. It does not justify the inverse rule that an arbitrary executable becomes normative because it is convenient.

`executable oracle derived from normative semantics != implementation promoted to normative semantics`.

G4 should preserve an immutable normative semantic identity and separately qualify executable realizations against it.

### 3.4 Reference implementation behavior is evidence, not a tie-breaker

P4-SpecTec and TLS experience show that reference/production implementations can disagree with specifications or each other.

`reference implementation differs from prose != reference implementation automatically wins`.

When normative material is ambiguous, resolution needs an explicit correction/successor decision with provenance and scope. Historical evidence remains bound to the historical profile plus the ambiguity known for it.

### 3.5 Conformance tests are witnesses, not complete semantic definitions

A corpus can demonstrate agreement on sampled behaviors and regressions but cannot generally prove universal equivalence unless the state/input space and completeness argument are themselves established.

`passes same corpus != semantically equivalent for all inputs`.

A bridge qualification may cite test evidence, differential testing, fuzzing or generated cases, but its claim must name coverage limits.

### 3.6 Differential agreement does not create majority truth

Three interpreters can share the same parser, canonicalizer, library, generated code, test corpus or mistaken reading.

`N implementations agree != N independent semantic witnesses`.

Diversity is qualified by semantic derivation and failure domains, not executable count. Disagreement remains evidence requiring classification rather than vote resolution.

### 3.7 Mechanized semantics can strengthen qualification without becoming universal product binding

A formal/executable semantics can support theorem checking, generated tests and reproducible interpretation. This is a research candidate for proof qualification, not an instruction to implement G4 in a particular proof assistant or DSL.

`formalization candidate != technology binding`.

The implementation-independent requirement is that any claimed proof of implication names the semantic models and assumptions it actually covers.

### 3.8 Ambiguity needs first-class identity and scope

A historical profile may contain an ambiguity that affects only a narrow predicate or input region. Global retirement is unnecessarily destructive; silent selection is unsafe.

Candidate `SemanticAmbiguityRef` identifies the affected normative clause/model element, competing interpretations, discovery/provenance and materiality scope.

`ambiguity exists != every claim under profile is unknowable`.

Claim-selective degradation is preferable when independence can be proven.

### 3.9 Errata can clarify or change semantics; the distinction must be explicit

Editorial clarification that demonstrably preserves all admissible behavior differs from a correction that chooses between previously plausible behaviors.

`erratum published != historical meaning automatically rewritten`.

A behavior-changing correction receives a successor/correction identity and a relation to the predecessor; bridges state whether they target historical P1, corrected P1', or both over a proven common subset.

### 3.10 Bridge direction matters

P1 -> P2 preservation does not imply P2 -> P1 preservation. A successor can be stricter, richer or differently scoped.

`forward implication != equivalence != backward implication`.

`BridgeCoverageRef` therefore names direction and the exact guarantee vector preserved.

### 3.11 Invariant projection can be stronger than whole-profile equivalence

RFC 8999's version-independent QUIC properties provide a useful pattern: explicitly name the properties intended to survive version change.

For G4, a bridge can legitimately prove that a subset of invariant claims survives even when the full profiles are not equivalent.

`profile migration may preserve invariant projection without preserving whole semantics`.

This reduces pressure to fabricate broad compatibility.

### 3.12 Counterexamples are durable qualification evidence

A single valid counterexample to a claimed universal implication defeats that claim within its modeled scope.

`counterexample found != implementation bug only`.

It may expose bridge error, profile ambiguity, translation loss or a wrong theorem statement. Counterexamples therefore need provenance and lineage and must survive compaction while the defeated bridge claim remains reachable.

### 3.13 Proof success is conditional on translation correctness

Even a theorem over formal models does not prove that real artifacts were translated into those models correctly.

`model implication proven != artifact-to-model translation proven`.

Bridge qualification retains translation/canonicalization as an independent proof boundary, consistent with existing G4 `Proof valid != translation correct`.

### 3.14 Bridge qualification has its own versioned semantics

A bridge is not just data. Its theorem statement, ambiguity assumptions, mapping rules, proof method and coverage are themselves semantics.

`bridge v2 implementation != bridge-v1 semantics silently repaired`.

Substantive bridge correction creates a new immutable bridge profile/ref with explicit supersession/defeat relations.

### 3.15 Unknown/ambiguous cases must remain representable after migration

A successor environment must not collapse predecessor `UNKNOWN`, `CONTESTED`, `UNSUPPORTED` or ambiguity-bounded cases into boolean success merely because P2 has a total decision procedure.

`P2 can decide translated input != P1 historically had that meaning`.

Historical disposition and migration disposition remain separate.

### 3.16 Security floor can retire a bridge without erasing its historical evidence

A bridge may rely on a formalization, parser, cryptographic primitive or trust dependency later found unsafe.

`bridge retired for new admission != historical bridge evidence erased`.

Existing closure/archival/requalification rules apply to bridge qualification itself.

### 3.17 Bridge producer and bridge checker remain separate authority roles

The actor/tool that constructs a migration proof does not gain authority to accept its own result. A qualified consumer/checker evaluates the derivation under the named bridge semantics and local floors.

`bridge producer provenance != bridge theorem validity`.

### 3.18 Independent reimplementation should target the normative bridge theorem

Clean-room bridge implementations are useful when they independently implement the same immutable theorem/profile. If they derive semantics from each other's code or one shared ambiguous library, apparent diversity is weak.

`different codebases != independent semantic derivation`.

### 3.19 Resource limits are part of usable bridge guarantees

A theoretically decidable bridge proof can still be operationally unsafe if adversarial artifacts trigger unbounded solver/interpreter work. W3C Data Integrity explicitly requires cryptosuite specifications to document resource-starvation attacks and testable mitigations.

`proof method exists != bounded verifier workload`.

Qualification names workload assumptions, budgets and failure disposition; timeout is not semantic falsehood.

### 3.20 The Exchange Plane may route bridge evidence but cannot select semantic truth

The logical corridor can carry profile refs, ambiguity refs, bridge proofs, counterexamples and dispositions. It may route based on declared compatibility metadata.

`Exchange Plane sees competing bridges != Exchange Plane chooses canonical interpretation`.

Semantic correction authority remains with the governing profile/contract authority; business meaning remains capability-owned.

## 4. Candidate vocabulary

Research vocabulary only:

- `ProofMigrationBridgeRef` — immutable identity of a qualified relation between predecessor and successor proof semantics.
- `BridgeTheoremRef` — immutable theorem/implication statement including direction, scope and preconditions.
- `BridgeCoverageRef` — guarantee vector and input/context region covered by the bridge.
- `SemanticAmbiguityRef` — durable identity for an unresolved or historically relevant ambiguity and its competing interpretations.
- `NormativeSemanticSnapshotRef` — immutable normative semantic referent against which interpreters/bridges are qualified.
- `SemanticInterpreterQualificationRef` — evidence that an executable interpreter implements a named normative snapshot within stated coverage.
- `ConformanceCorpusRef` — immutable corpus plus provenance and coverage statement used as qualification evidence.
- `DifferentialEvidenceRef` — evidence of agreement/disagreement among qualified implementations.
- `CounterexampleRef` — durable witness defeating or narrowing a claimed implication/equivalence.
- `BridgeQualificationDisposition` — `QUALIFIED`, `PARTIAL`, `AMBIGUITY_BOUNDED`, `CONTESTED`, `UNSUPPORTED`, `DEFEATED`, or other explicitly governed result.

These are structural refs/evidence roles, not shared business entities or concrete components.

## 5. Candidate proof obligations

1. Every bridge names immutable predecessor and successor normative semantic identities.
2. Every bridge names direction: implication, reverse implication, equivalence, refinement or another explicitly defined relation.
3. Every bridge claim identifies input/context scope and guarantee vector covered.
4. Material predecessor ambiguity prevents unconditional equivalence unless all admissible interpretations are proven to preserve the claimed relation.
5. Ambiguities irrelevant to a named claim may be excluded only with proof of non-materiality.
6. Reference implementation behavior cannot silently resolve normative ambiguity.
7. Conformance corpus success is bounded evidence unless a completeness argument is separately established.
8. Differential implementation agreement is qualified by semantic/failure-domain independence and never resolved by majority alone.
9. Substantive errata/corrections create explicit successor/correction semantic identities rather than rewriting historical identity.
10. Historical evidence remains bound to the historical profile and its known ambiguity/correction graph.
11. Formal/model-level implication remains separate from artifact-to-model translation correctness.
12. Canonicalization/encoding mappings used by a bridge are explicit proof boundaries.
13. Partial migration exposes lost, weakened, unknown and unsupported guarantees.
14. Unknown/contested predecessor dispositions are not upgraded to success solely because successor semantics can decide the translated artifact.
15. Counterexamples durably defeat or narrow the bridge theorem they invalidate.
16. Bridge theorem/profile corrections create new immutable bridge identities with explicit supersession/defeat lineage.
17. Bridge producer provenance does not substitute for independent verification of the theorem/proof.
18. Independent implementations are qualified for semantic derivation/failure-domain independence, not counted by executable quantity alone.
19. Bridge verification names bounded resource/workload assumptions; timeout/resource exhaustion maps to explicit incomplete/unsupported disposition.
20. Bridge security/currentness dependencies remain subject to local monotonic floors and requalification.
21. Retiring a bridge for new effects does not erase historical interpretation/evidence required for audit or settlement.
22. Exchange Plane/gateway/adapter may transport or execute a qualified bridge but cannot select a disputed normative interpretation by infrastructure policy.
23. Compacted closures preserve bridge theorem identity, ambiguity/correction lineage and any live counterexample/defeat evidence required by supported queries.
24. If no qualified relation can be established, consumers return explicit `UNSUPPORTED/AMBIGUITY_BOUNDED/CONTESTED` rather than fabricated equivalence.

## 6. Adversarial cases

1. P1 prose admits I1 and I2; bridge proves only I1 -> P2 but advertises full P1 -> P2 equivalence.
2. Reference implementation follows I1 and is treated as proof that I2 was never legitimate.
3. Three implementations agree because all copied the same parser/library and are counted as independent semantic witnesses.
4. Majority vote among interpreters chooses historical meaning.
5. Test corpus covers common cases but misses the exact ambiguous edge case; passing tests is promoted to universal equivalence.
6. New generated executable oracle is treated as normative despite generation from a mistranslated formal rule.
7. Formal theorem is correct but artifact-to-model translation drops a security-critical field.
8. Adapter normalizes canonical encoding and thereby changes authenticated semantics before bridge verification.
9. Editorial erratum actually chooses one of two previously plausible behaviors but is applied retroactively under the same profile ID.
10. Behavior-preserving clarification is unnecessarily treated as a wholly new incompatible profile, causing false incompatibility.
11. P1 -> P2 implication is incorrectly assumed to prove P2 -> P1.
12. Bridge preserves integrity but loses proof-purpose/authority binding and still reports `compatible=true`.
13. Successor can decide an input that P1 classified `UNKNOWN`; migration relabels the historical P1 result as success.
14. Counterexample is deleted during compaction and a defeated bridge claim resurrects.
15. Bridge v2 fixes a semantic bug but reuses bridge-v1 identity, rewriting historical closure meaning.
16. Two clean-room implementations are nominally separate but both derive behavior from the same ambiguous reference implementation.
17. Solver timeout is mapped to theorem false and triggers business denial/settlement.
18. Solver timeout is mapped to success for availability.
19. Bridge proof producer signs its own output and signature is treated as theorem validity.
20. Security floor retires a bridge but executable rollback re-enables it for new protected effects.
21. Gateway chooses the bridge with the newest timestamp and becomes semantic authority.
22. Service mesh/transport path is treated as qualification evidence for a bridge.
23. Cross-tenant bridge cache reuses an ambiguity resolution whose trust/profile context is not equivalent.
24. Long-offline runtime cannot resolve a bridge theorem and accepts a human-readable `equivalent=true` field.

## 7. Technology-independent qualification model

A bridge may be treated as qualified for a claim only when all material dimensions are established:

1. **Immutable semantic endpoints** — P1/P2 normative snapshots are resolvable.
2. **Explicit relation** — implication/equivalence/refinement direction is named.
3. **Scope** — covered inputs, contexts and guarantees are bounded.
4. **Ambiguity discipline** — every material ambiguity is resolved by explicit authority/correction evidence or represented as bounded uncertainty.
5. **Translation correctness** — artifact/model and encoding/canonicalization mappings are separately qualified.
6. **Proof evidence** — theorem/proof/checker evidence is locally verifiable under a named profile.
7. **Empirical qualification** — tests, generated cases, differential implementations and fuzzing strengthen evidence but do not silently expand theorem scope.
8. **Counterexample closure** — known counterexamples/defeats are visible and non-resurrectable.
9. **TCB/failure domains** — shared libraries/generators/parsers are declared when implementation diversity is claimed.
10. **Currentness/security** — bridge and checker remain admissible for the intended historical/current use.
11. **Bounded workload** — resource exhaustion has explicit non-success semantics.
12. **Autonomy** — once qualified evidence is local, runtime verification does not require Builder/central gateway as semantic oracle.

## 8. Portability and exit path

The model deliberately avoids binding G4 to a proof assistant, executable-spec DSL, reference interpreter or conformance platform. A future implementation can replace any such technology if it preserves:

- immutable normative semantic identities;
- theorem direction/scope and bridge coverage;
- ambiguity/correction/counterexample lineage;
- translation and encoding proof boundaries;
- explicit incomplete/unsupported dispositions;
- local floor/currentness enforcement;
- historical interpretability without permanent vulnerable executable retention;
- transport/provider independence.

A mechanized specification can be an especially strong qualification source, but it remains replaceable evidence machinery unless separately adopted as normative authority through an authorized architecture/governance decision.

## 9. Deduplication against existing G4 research

This round does not reopen:

- generic proof-profile portability;
- normative-semantics snapshot governance in general;
- verifier diversity in general;
- semantic policy diff in general;
- archival cryptographic renewal;
- profile negotiation/downgrade resistance;
- frontier compaction;
- transport/provider selection.

Material delta is specifically:

`proof-profile portability -> migration bridge theorem -> predecessor ambiguity/errata -> implementation disagreement -> qualification without reference/majority authority`.

## 10. Maturity and next gap

State: `RESEARCH_ACTIVE / NON_EXECUTABLE`.

This round materially tightens bridge semantics and proof obligations. It does not authorize architecture or implementation.

Highest-value next gap:

**qualification of ambiguity resolution authority and correction lifecycle across federated/autonomous runtimes** — when a historical normative profile is genuinely ambiguous, determine who is permitted to publish a correction/successor relation, how competing corrections remain representable, how long-offline runtimes authenticate the correction without a central semantic oracle, and how correction retirement/supersession avoids rewriting already-settled historical evidence.
