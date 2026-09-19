# G4 — Normative Proof-Semantics Governance & Ambiguity Containment

Status: `RESEARCH_ACTIVE / NON_EXECUTABLE`
Execution authority: NONE
Date: 2026-09-19
Parent family: Shared Semantic Kernel / Capability Exchange Plane / Inter-Capability Boundary Model

## Purpose

Deepen the highest-value gap from verifier trust-continuity research: determine how a proof language/rule/theory profile can itself be governed, versioned and corrected without making one verifier implementation the specification; how ambiguity and errata are contained without silently rewriting historical proof meaning; how extensions enter or leave a profile; and how security supersession can stop unsafe future admission while preserving the historical semantics snapshot against which old proofs were interpreted.

This is not a new macro-family. It selects no proof language, theorem prover, solver, standards process, verifier, policy engine, gateway, broker or provider and grants no implementation authority.

## Evidence classes reviewed

Primary/mature evidence used in this round:

- W3C Process and errata/version-management guidance: substantive corrections that affect conformance require explicit review/publication; candidate corrections do not silently become normative; dated publication URIs provide immutable version references while a latest/canonical URI can advance.
- RFC Editor errata model: published RFCs do not change; errata are separately recorded and verified/rejected/held, preserving the exact historical publication while allowing known defects to be attached to it.
- SMT-LIB: versioned language documents, separately identified theories/logics, release/update histories, benchmark corpora and an explicitly preliminary Version 3 proposal illustrate that language, theory/profile and maturity are distinct dimensions.
- WebAssembly specification governance: normative formal semantics, explicit released versions, proposal maturation and the SpecTec effort illustrate the value of deriving readable specification material from one formal semantic source rather than maintaining competing normative formulations manually.
- Prior G4 semantic-policy-diff, proof-carrying runtime verification and verifier trust-continuity/diversity research.

Representative references:
- https://www.w3.org/policies/process/
- https://www.w3.org/guide/editor/versioning.html
- https://www.w3.org/WAI/WCAG22/errata/
- https://www.rfc-editor.org/series/rfc-errata/
- https://smt-lib.org/standard.shtml
- https://smt-lib.org/language.shtml
- https://smt-lib.org/theories.shtml
- https://smt-lib.org/logics.shtml
- https://webassembly.org/specs/
- https://webassembly.org/news/2025-03-27-spectec/

## 1. A semantics snapshot must be immutable once used as proof authority

The core governance boundary is:

```text
Latest semantics != historical semantics
```

A proof accepted under semantic snapshot `S1` must remain interpretable as a claim under `S1`. Publishing `S2` may supersede `S1` for new admissions, but must not silently alter what `S1` meant.

W3C dated technical-report versions and the RFC Editor's immutable-publication model provide useful precedents: stable historical identity is compatible with separate errata and later revisions. The implementation-independent G4 consequence is an immutable `NormativeSemanticsSnapshotRef`, not reliance on a mutable `latest` identifier.

```text
semantic identity = immutable content/profile identity
current recommendation = mutable governance pointer
```

A mutable pointer may select what runtimes should use now; it must not be the sole identity embedded in historical proof evidence.

## 2. Erratum is not retroactive semantic mutation

A discovered ambiguity or defect needs an explicit disposition. W3C distinguishes editorial changes from substantive corrections that can change conformance; candidate corrections are not normative merely because they are documented. RFCs similarly retain published bytes while errata are attached separately.

For G4:

```text
Erratum recorded != historical semantics rewritten
```

Candidate dispositions:

```text
EDITORIAL_ONLY
CLARIFICATION_NO_CONFORMANCE_DELTA
AMBIGUITY_DISCOVERED
SEMANTIC_CORRECTION
SECURITY_CRITICAL_CORRECTION
DEPRECATION
SUPERSESSION
```

`AMBIGUITY_DISCOVERED` is especially important: if two reasonable implementations could interpret the old text differently, governance must not pretend that a later choice was always uniquely implied.

## 3. Ambiguity creates a bounded historical interpretation set

When `S1` is ambiguous, the system may know that proofs were checked by verifier V1 using interpretation `I1`, while V2 used `I2`.

```text
specification ambiguity discovered
!= permission to relabel I1 as impossible history
```

Historical evidence therefore needs enough binding to identify the verifier/profile/semantic snapshot actually used. If the normative authority later chooses `I2` for future operation, that creates a successor semantics or explicit correction relation. It does not erase the fact that V1 accepted under `I1`.

Candidate dispositions for old proofs include:

```text
HISTORICALLY_VALID_UNDER_S1_I1
REQUIRES_REQUALIFICATION_FOR_NEW_EFFECTS
SECURITY_REVOKED_FOR_NEW_ADMISSION
UNRESOLVED_AMBIGUITY
```

This keeps audit truth separate from future security admissibility.

## 4. Security supersession and semantic history are separate axes

A dangerous interpretation may need immediate retirement.

```text
S1 security-inadmissible now
!= S1 never existed
```

A security floor can prohibit new proof admission under `S1` after an effective point while historical records continue to say that a prior effect was admitted under `S1` and verifier V1. This composes with prior G4 offline-security-floor research: revocation effective time, runtime observation time and historical effect time remain separate.

Emergency security action therefore changes admissibility/currentness, not historical semantics identity.

## 5. One implementation must not become the specification by accident

The previous round established that diverse verifiers need a normative semantics. This round sharpens the inverse risk:

```text
Reference implementation behavior != normative semantics
```

A reference verifier can be useful executable evidence and a conformance oracle only for cases where its behavior is independently justified. If prose/formal semantics and implementation disagree, governance must classify the discrepancy; `the implementation wins` is not an implementation-independent rule.

Likewise:

```text
Common test corpus != normative semantics
```

Tests constrain interpretations and catch regressions but are necessarily partial. A test that conflicts with the normative semantics is a bad test, not an automatic semantics amendment.

## 6. Normative prose and normative formal rules need one declared precedence/derivation model

WebAssembly is valuable evidence because formal semantics have been normative from the start; SpecTec specifically addresses the risk and cost of manually maintaining both mathematical rules and prose by generating multiple views from a more unified source.

G4 should avoid two independently edited sources both claiming final semantic authority without a conflict rule.

Candidate governance models include:

1. formal semantics normative, prose derived/informative;
2. normative structured source generates formal/prose views;
3. both normative with an explicit precedence and discrepancy process;
4. prose normative plus machine-readable conformance model, with lower formal assurance.

No model is selected here. The durable obligation is that precedence and derivation must be explicit.

```text
Two normative representations
without conflict semantics
= latent ambiguity
```

## 7. Language version, rule profile, theory set and extension set are distinct

SMT-LIB demonstrates useful separation among language versions, theories and logics. A proof format can likewise have stable syntax while supported semantic theories/rules evolve.

Candidate identity:

```text
NormativeProofSemanticsProfile
  languageSemanticsRef
  calculusRef
  ruleSetRef
  theorySetRefs[]
  extensionRefs[]
  error/undefinedBehaviorSemanticsRef
  resource/structuralLimitsRef
```

This prevents `proof-language=v2` from hiding materially different theory/rule support.

```text
Same language version != same semantic profile
```

## 8. Extensions require explicit namespace, maturity and dependency semantics

Custom/theory rules are necessary for practical proof systems but are a primary route to accidental semantic fragmentation.

A candidate extension contract needs at least:

```text
Extension
  immutable identity/version/hash
  owner/governance authority
  declared semantics
  dependencies
  compatibility relation
  maturity/status
  conformance/proof evidence
  security status
  deprecation/supersession relation
```

Unknown extension semantics yield `UNSUPPORTED/UNKNOWN`, never best-effort equivalence.

An extension must not silently override a core rule under the same identifier. Namespace collision or shadowing is a compatibility failure unless explicitly defined by the normative profile.

## 9. Conservative extension is a proposition to prove, not a version label

SMT-LIB's Version 3 proposal explicitly discusses theory evolution as conservative extension in relevant cases. The reusable principle is:

```text
new rules added
!= old propositions preserved automatically
```

For a claimed conservative extension `S1 -> S2`, the proof obligation is that propositions expressible in the old profile retain their meaning/derivability properties within the declared scope. If not established, the transition is an ordinary semantics change and requires requalification rules.

This is stronger than syntactic backward compatibility.

## 10. Semantic correction needs a bridge object, not an overwritten identifier

When an old rule is found wrong, governance should create an explicit relation:

```text
SemanticTransition
  fromSnapshotRef
  toSnapshotRef
  class
    editorial
    clarification
    conservative_extension
    semantic_correction
    breaking_change
    security_supersession
  affectedRules/theories
  oldProofDisposition
  newAdmissionRule
  requalificationRequirement
  evidenceRefs
```

Research vocabulary only; not a schema commitment.

A semantic correction must not publish new meaning under the old immutable snapshot identity.

## 11. Clarification requires care because ambiguity resolution can change conformance

W3C process guidance is especially useful here: resolving ambiguity can be a substantive change when it changes whether an implementation is conforming.

Therefore:

```text
called clarification != semantically non-breaking
```

G4 should classify by effect on valid/invalid proof sets and guarantees, not editorial intent. If a clarification causes proofs previously accepted by a reasonable interpretation to become invalid, it is semantically material for migration purposes.

## 12. Unknown historical interpretation must remain representable

Legacy evidence may identify `S1` but not enough verifier/rule-profile detail to know which interpretation of an ambiguous rule was used.

```text
insufficient historical binding != choose current interpretation
```

The correct disposition is `UNKNOWN_HISTORICAL_INTERPRETATION`, with policy deciding whether this is audit-only, requires requalification, or blocks a future security-sensitive transition. Current semantics must not be projected backward as invented certainty.

## 13. Normative semantics governance must remain separable from business semantics ownership

The Shared Semantic Kernel may carry immutable semantics refs, proof profile refs, transition refs and qualification evidence. It must not centralize capability-owned business predicates merely to make proof governance convenient.

```text
proof-semantics governance
!= capability business-semantics ownership
```

A custom business predicate can be referenced through a capability-owned qualified contract. The Exchange Plane transports that reference/evidence; it does not become its semantic owner.

## 14. Offline runtimes need local semantic snapshots, not an online standards service

Runtime autonomy requires that a proof's required semantics/profile snapshot and qualification evidence can be resolved locally for the declared horizon.

```text
standards registry unavailable
-> locally complete qualified snapshot can still be checked
```

But local possession does not grant infinite security admissibility. A runtime may know exactly what `S1` means while being prohibited from using it for new effects after its security/currentness horizon.

```text
semantic resolvability != current admissibility
```

## 15. Canonical/latest pointers are convenience, not proof identities

W3C distinguishes stable dated references from latest/canonical references. The same separation is useful here:

```text
latestProfile -> S3
proof.profileRef -> immutable S1
```

Updating `latestProfile` must never cause a historical proof bound to S1 to be checked as if it were created for S3.

A mutable alias is routing/discovery metadata, not semantic identity.

## 16. Candidate proof obligations

Before implementation planning, prove or explicitly bound:

1. every proof semantics/profile used for admission has an immutable snapshot identity;
2. mutable `latest/current` pointers are never the sole historical proof identity;
3. errata/corrections do not mutate the meaning of an already identified historical snapshot silently;
4. substantive ambiguity resolution creates an explicit successor/correction relation when conformance can change;
5. security supersession can prohibit future admission without falsifying historical semantics/effect evidence;
6. reference implementation behavior is not automatically normative authority;
7. conformance corpus behavior is evidence, not the definition of semantics;
8. multiple normative representations have an explicit precedence/derivation/discrepancy model;
9. language, calculus/rule set, theory set and extension set are separately identifiable compatibility dimensions;
10. unknown rules/extensions yield explicit unsupported/unknown dispositions;
11. extensions cannot shadow/replace core semantics silently under the same identity;
12. a claimed conservative extension has an explicit preservation proposition and evidence scope;
13. semantic correction uses a new immutable identity and explicit transition evidence;
14. `clarification` is classified by semantic/conformance effect, not editorial label;
15. historical ambiguity can remain `UNKNOWN_HISTORICAL_INTERPRETATION` rather than being guessed from current semantics;
16. proof semantics governance does not centralize capability-owned business predicates;
17. autonomous runtimes can retain enough local immutable semantics/profile material to verify proofs without live Builder/registry access;
18. local semantic resolvability remains separate from security/currentness admissibility;
19. proof/profile transition evidence remains portable and does not require one verifier implementation to be retained forever;
20. governance artifacts remain evidence/semantic specifications, not canonical capability business state.

## 17. Adversarial cases

1. `latest` profile pointer advances from S1 to S2 and old proof bytes are silently checked under S2;
2. an errata page changes the intended meaning of a rule but historical proofs are relabeled as if S2 had always applied;
3. a security-critical ambiguity is discovered and governance erases evidence that V1 previously accepted interpretation I1;
4. reference verifier has a bug and its observed behavior is declared normative solely because it is the reference implementation;
5. common conformance corpus encodes the same mistaken interpretation as two verifiers;
6. prose and formal semantics disagree and implementations choose whichever is convenient;
7. a `clarification` changes the accepted proof set but is shipped under the same immutable profile identifier;
8. a custom extension shadows a core rule name with weaker semantics;
9. two runtimes advertise the same proof-language version but load different theory revisions;
10. extension dependency changes without changing the extension identity;
11. a claimed conservative extension changes old-formula semantics in one corner case;
12. a proof converter rewrites S1 proof syntax to S2 while silently relying on changed rule meaning;
13. historical record contains S1 but not verifier/rule profile and current runtime invents an interpretation;
14. security revocation deletes the old semantics snapshot, making audit impossible;
15. runtime retains S1 semantics locally and mistakes resolvability for permission to use S1 indefinitely;
16. standards registry outage blocks runtime even though the exact qualified snapshot is local;
17. mutable registry entry is compromised and redirects a stable-looking alias to attacker semantics;
18. capability business predicate is copied into central proof semantics to simplify governance, creating ownership leakage;
19. experimental extension is treated as stable normative core merely because one solver implements it;
20. deprecated theory is removed from tooling and historical proof is incorrectly declared invalid rather than unsupported by the current verifier.

## 18. Material synthesis

Durable boundaries added by this round:

```text
Latest semantics != historical semantics
Erratum recorded != historical semantics rewritten
S1 security-inadmissible now != S1 never existed
Reference implementation behavior != normative semantics
Common test corpus != normative semantics
Two normative representations without conflict semantics = latent ambiguity
Same language version != same semantic profile
New rules added != old propositions preserved automatically
Called clarification != semantically non-breaking
Semantic resolvability != current admissibility
Mutable alias != semantic identity
```

The implementation-independent hypothesis is therefore: proof-carrying exchange can remain portable across verifier generations only if the semantics being checked is itself a first-class, immutable, versioned and governable artifact. Corrections, ambiguity resolutions, extensions and security supersession create explicit relations among snapshots rather than rewriting old meaning in place. Independent verifiers bind to those snapshots; they do not define them. Historical truth, current security admissibility and capability-owned business semantics remain separate dimensions.

## 19. Maturity and next gap

This round materially changes the verifier/proof-governance boundary, so it is not `NO_MATERIAL_DELTA`.

Family 8 remains `RESEARCH_ACTIVE / NON_EXECUTABLE` and not saturated.

Highest-value remaining gap: **proof-semantics profile negotiation and downgrade-resistant federation** — determine how autonomous runtimes/capabilities advertise and negotiate immutable proof-semantics profiles across version skew without attacker-driven downgrade; how unsupported extensions/theories produce explicit incompatibility or qualified mediation; how local/remote transports preserve the selected profile identity; and how rolling upgrades avoid requiring a global lockstep profile while preventing a peer from selecting a weaker-but-still-supported semantics for a security-sensitive exchange.

No proof language, semantics format, standards process, verifier, theorem prover, solver, gateway, broker or provider is selected.