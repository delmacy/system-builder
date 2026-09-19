# G4 — Proof-Carrying Exchange Policy & Runtime Verification Boundary

Status: `RESEARCH_ACTIVE / NON_EXECUTABLE`
Execution authority: NONE
Date: 2026-09-19
Parent family: Shared Semantic Kernel / Capability Exchange Plane / Inter-Capability Boundary Model

## Purpose

Deepen the highest-value gap from semantic policy-diff research: determine what a portable proof-carrying policy artifact would have to bind so an autonomous runtime can verify a previously established transition locally without trusting the Builder or repeating the original search/solving process; identify the trusted computing base (TCB), version-skew and compiler/producer failure boundaries; and distinguish proof verification from solver replay, provenance attestation and policy evaluation.

This is not a new macro-family. It selects no policy language, solver, theorem prover, proof format, verifier, compiler, gateway, broker or provider and grants no implementation authority.

## Evidence classes reviewed

Primary/mature evidence used in this round:

- George C. Necula's Proof-Carrying Code work: the producer supplies an artifact plus a machine-checkable proof against a consumer-defined safety policy; practical PCC explicitly treats proof encoding size, small/fast checking and binding the proof to the exact artifact as core problems.
- Necula/Schneck proof-carrying code with untrusted proof rules: high-level proof rules need not automatically enter the trusted base when their soundness can itself be checked against a smaller trusted policy/kernel.
- cvc5 proof-production documentation: solver reasoning can be exported as external proof formats and independently checked, but proof-format/theory coverage varies; LFSC/Alethe documentation exposes unsupported/trusted/hole-like steps as an explicit assurance boundary rather than magically complete proof.
- LFSC: proof generators and proof-checking signatures are separately versioned; proof compatibility with the checker/signature matters.
- Alethe: external proof reconstruction/checking in independent systems illustrates producer/checker separation, while theory support remains format/tool-version qualified.
- Cedar SymCert / SymCC: verified symbolic compilation and authorization can prove analysis soundness/completeness for a declared Cedar semantics, illustrating that the policy-to-formula translation is itself a proof-critical component rather than neutral plumbing.
- CompCert: compiler correctness evidence demonstrates why a verified translation chain can remove classes of compiler-introduced semantic error, while its own documentation also keeps unverified stages explicit.
- Prior G4 semantic policy-diff, composition-policy lifecycle, multi-domain evidence, security-floor, contract-compatibility and autonomous-runtime research.

References:
- https://people.eecs.berkeley.edu/~necula/pcc.html
- https://people.eecs.berkeley.edu/~necula/ISSS02/
- https://cvc5.github.io/docs-ci/docs-main/proofs/proofs.html
- https://cvc5.github.io/docs-ci/docs-main/proofs/output_alethe.html
- https://cvc5.github.io/docs/cvc5-1.3.2/proofs/output_lfsc.html
- https://github.com/cvc5/LFSC
- https://www.amazon.science/publications/symcert-verifying-smt-based-policy-analyses
- https://github.com/cedar-policy/cedar-spec/blob/main/cedar-lean/README.md
- https://compcert.org/
- https://compcert.org/man/manual001.html

## 1. Proof verification is not re-solving

The useful architectural distinction is:

```text
PRODUCER PATH
policy old/new + semantics + dependencies
  -> translation / verification conditions
  -> search / solver / prover
  -> proof or counterexample

CONSUMER PATH
policy artifact + proof artifact + declared scope
  -> small qualified verifier
  -> VALID / INVALID / UNSUPPORTED / STALE
```

A runtime that invokes the same solver with the same query has repeated the analysis; it has not consumed a proof-carrying result.

```text
Proof verification != re-solving
```

Independent checking can reduce runtime operational burden and producer trust only when the checker validates a proof object whose conclusion is bound to the exact policies, semantics and dependencies that the runtime will use.

## 2. A signature or provenance attestation is not a semantic proof

A Builder may sign `P7 -> P8 is safe`. That proves who asserted the statement, subject to key/currentness policy. It does not let the runtime independently derive the statement from machine-checkable evidence.

```text
Producer signature valid
!= semantic transition proven
```

Signatures/provenance remain useful for origin, authorization and artifact integrity. Proof verification answers a different question: whether the supplied derivation establishes the declared proposition under the declared formal semantics.

A proof can itself be signed, but signing it does not repair an invalid proof.

## 3. Minimal artifact means semantically complete, not byte-minimal

A future proof-carrying exchange-policy artifact need not contain the entire solver state or business database. It does need enough binding information to prevent substitution or ambiguity.

Candidate implementation-independent envelope:

```text
PolicyTransitionProofArtifact
  proposition
    oldPolicyRef/hash/revision
    newPolicyRef/hash/revision
    classification
    protectedGuaranteeClaims
  proofScope
    policyLanguageSemanticsRef
    schema/entityModelRef
    request/stateUniverseRef
    combining/default/errorSemanticsRef
    customPredicateContractRefs
    security/authority/currentnessAssumptions
    timeModelRef
  derivation
    proofFormatRef/version
    proofObject | proofObjectRef
    rule/signature/theoryProfileRef
    explicitTrustedSteps[]
  dependencies
    exact hashes/revisions of semantic inputs
    verifierCompatibilityProfile
    invalidation/currentness conditions
  provenance
    producer identity/version
    translation/compiler identity/version
    solver/prover identity/version
    creation time
  optional counterexamples / review evidence
```

This is research vocabulary, not a schema commitment.

```text
Small certificate != incomplete semantic binding
```

Compression may remove redundant derivation detail. It must not remove the identity of the proposition or assumptions on which the proof depends.

## 4. The proof must bind to the consumed policy and semantics

PCC literature emphasizes that checking a valid proof is useless if the proof is not about the exact artifact being admitted. The same applies here.

```text
Proof valid for P8a
+ runtime executes P8b
!= P8b proven
```

Binding must cover more than policy bytes. Prior G4 research established that identical policy bytes under changed schema, custom-predicate semantics, security floors or engine semantics can behave differently.

Therefore:

```text
proof-to-policy binding
!= proof-to-policy-bytes-only binding
```

The artifact must bind every semantic dependency whose change can invalidate the conclusion.

## 5. The checker is smaller than the producer only if the semantics boundary is real

The producer may contain parser, normalizer, symbolic compiler, optimizer, SMT solver, theorem prover and proof exporter. A consumer can avoid trusting most of that stack if it checks a derivation against a small, independently specified calculus/semantics.

This is the principal potential TCB reduction:

```text
Trust(producer + solver correctness)
        ->
Trust(verifier kernel + formal semantics + artifact binding)
```

But the reduction is conditional. If the runtime verifier calls back into the same symbolic compiler, solver or opaque policy engine to decide whether the proof is valid, the TCB has merely been renamed.

```text
Separate process != independent verification boundary
```

## 6. Translation correctness is a first-class proof boundary

For policy diff, the proposition often originates in domain policy semantics and is translated into logic. A perfectly correct SMT proof of a mistranslated formula proves the wrong thing.

```text
Proof checker sound
+ translation unsound
!= policy property proven
```

SymCert is important evidence because it verifies the symbolic compiler/authorizer relation to Cedar semantics rather than assuming translation correctness. CompCert supplies the analogous general lesson for executable compilation: verified translation can eliminate a class of semantic drift, but unverified stages remain explicit.

Candidate assurance classes:

```text
A. verified translation + independently checked proof
B. unverified translation + translation-validation certificate + checked proof
C. unverified translation + differential/conformance evidence + checked proof
D. producer attestation only
```

These are not equivalent assurance levels and must not share one `verified=true` flag.

## 7. Proof format and proof-rule version are semantic dependencies

LFSC demonstrates that a proof is checked relative to a signature/rule set and that older proofs can be incompatible with newer checking signatures. cvc5 additionally documents proof-format coverage and explicit trust steps for rules not represented by the external format.

Therefore:

```text
Proof bytes parse successfully
!= proof semantics understood
```

A portable artifact needs an explicit proof-language/calculus identity, version and theory/rule profile. Unknown rules are not permission to skip them.

Candidate dispositions:

```text
PROOF_VALID
PROOF_INVALID
PROOF_UNSUPPORTED_SEMANTICS
PROOF_UNSUPPORTED_RULESET
PROOF_DEPENDENCY_MISMATCH
PROOF_STALE
PROOF_CONTAINS_UNQUALIFIED_TRUST_STEP
```

## 8. Trusted steps and holes must be visible in the guarantee

Proof exporters may use trusted/macro/hole-like steps when a target format cannot express every internal inference. cvc5's LFSC/Alethe documentation makes this limitation visible.

This yields a durable boundary:

```text
Proof file accepted by tooling
!= fully independently justified derivation
```

A proof artifact must expose any trusted step and the authority/assumption that qualifies it. A verifier must not silently map an unsupported rule to success for availability.

A transition may legitimately become `CONDITIONALLY_VERIFIED(trustedSteps=...)`; it must not be promoted to stronger assurance.

## 9. Verifier bugs and verifier version skew remain in the TCB

Proof carrying does not eliminate software defects. A verifier that accepts an invalid derivation destroys the claimed assurance.

The artifact therefore needs a `VerifierCompatibilityProfile`, while the runtime needs a locally qualified verifier identity/version and security status.

```text
Proof producer replaceable
!= verifier universally trustworthy
```

Mitigations to research later include tiny kernels, memory-safe implementation, formally verified checkers, differential checkers, reproducible builds, proof-corpus regression and security-floor/revocation governance. None is selected here.

Critically, verifier currentness is independent from proof currentness:

```text
Proof historically valid
+ verifier version now revoked
!= safe to keep using revoked verifier for new admission
```

Historical effects remain historical; verifier retirement does not rewrite them.

## 10. Proof producer compromise can be bounded only if the verifier is independent

If the Builder/proof producer is compromised but cannot forge a derivation accepted by an independent checker, proof carrying materially contains the compromise for properties covered by the proof scope.

If the producer controls the verifier binary, verifier trust root, rule set and policy artifact simultaneously, the apparent separation provides little security.

```text
Producer/checker separation
without trust-root separation
!= compromise containment
```

The runtime must obtain verifier/trust-policy continuity through a path whose guarantee does not depend solely on the producer being checked.

This composes with prior G4 root trust, security-floor and witness-policy findings; it does not create a mandatory global verifier service.

## 11. Proof carrying cannot prove unstated business meaning

A machine-checkable proof can establish `P8 => P7` under a formal semantics. It cannot prove that a capability-owned predicate was modeled correctly unless that predicate's owner supplies a qualified formal contract or proof bridge.

```text
Machine-checked derivation
!= unstated domain intent captured
```

Proof-carrying exchange policy therefore preserves the previous boundary: capability business semantics remain capability-owned. The Shared Semantic Kernel may carry refs/revisions/proof primitives; it must not absorb business entities or rules merely to make central proofs convenient.

## 12. Local runtime verification preserves autonomy better than online proof services

The autonomous-runtime target favors shipping already-qualified policy/proof artifacts with the release or security/update channel and verifying them locally.

```text
Builder/solver unavailable
-> runtime may still verify cached qualified artifact
   within its declared dependency/currentness horizons
```

A mandatory live Builder, solver, proof registry or transparency service on every policy decision would violate the established autonomy boundary.

However:

```text
Offline proof verification
!= infinite proof/dependency currentness
```

Security floors, verifier revocation, schema/predicate revisions and other external dependencies retain their own horizons.

## 13. Proof replay is not proof requalification

A runtime may deterministically re-check the same proof bytes later. That only establishes the derivation under the same declared dependencies.

```text
proof re-check succeeds
+ dependency changed
!= old conclusion requalified
```

Dependency/currentness validation precedes or accompanies proof verification. Re-solving may be necessary when the proposition or formal dependencies change; it is not necessary merely because the runtime restarts.

## 14. Proof portability requires proposition portability

A provider-neutral proof format is insufficient if it embeds opaque engine-specific semantics. Conversely, a generic calculus is not useful if the mapping from policy semantics to that calculus is unqualified.

Portability therefore has at least four layers:

```text
proposition portability
semantic-model portability
proof-language portability
verifier portability
```

A replacement producer/solver may generate a different proof object for the same proposition. A replacement verifier may support a different calculus. Migration is valid only where a bridge or requalification proves the same proposition/scope; format conversion alone is not semantic equivalence.

## 15. Proof size, checking cost and denial-of-service are operational semantics

PCC identified proof size and efficient checking as practical constraints. A hostile or malformed proof may consume CPU/memory before rejection.

A future runtime profile therefore needs explicit bounds such as proof bytes, nesting/depth, rule count, checking CPU/memory budget and supported theory profile.

```text
Proof semantically valid
!= operationally admissible under every runtime budget
```

Resource rejection must remain distinguishable from semantic invalidity. Backpressure/resource exhaustion is not evidence that the proof or holder is malicious.

## 16. Proof-carrying artifacts are evidence, not canonical business truth

The proof establishes a proposition about identified canonical/contract artifacts. It does not become the owner of those artifacts.

```text
Proof artifact != policy authority
Proof artifact != capability business truth
Proof artifact != currentness authority
```

The runtime still needs policy authority, security currentness and capability-owned semantic inputs according to the interaction contract.

## 17. Candidate proof obligations

Before implementation planning, prove or explicitly bound:

1. runtime verification consumes a proof object rather than silently repeating the producer's solver analysis;
2. producer signature/provenance is not treated as semantic proof;
3. proof proposition binds exact old/new policy identities and every semantic dependency relevant to the conclusion;
4. policy-byte hashes alone are insufficient when schema/custom predicates/engine semantics can change behavior;
5. proof format, calculus/rule-set version and theory profile are explicit;
6. unsupported proof rules/semantics fail explicitly rather than being ignored;
7. every trusted/hole/macro step that weakens independent justification is represented in the guarantee;
8. checker acceptance means the declared proposition follows only under the declared proof scope/assumptions;
9. translation correctness is independently qualified rather than inferred from solver proof validity;
10. producer/compiler/solver bugs cannot forge covered properties when the independent verifier boundary is claimed;
11. verifier bugs/version skew/security retirement remain explicit TCB/currentness concerns;
12. producer and verifier trust roots are sufficiently independent for any compromise-containment claim;
13. proof verification does not centralize capability-owned business predicates in the Shared Semantic Kernel;
14. runtime can verify already-qualified artifacts without live Builder/solver availability;
15. offline verification does not imply indefinite dependency/security currentness;
16. proof replay after restart does not silently requalify changed dependencies;
17. proof migration/format conversion cannot claim semantic equivalence without proposition/scope preservation;
18. proof checking has explicit CPU/memory/size/depth limits and resource failure is distinct from semantic invalidity;
19. proof artifact remains evidence/projection and does not become canonical policy/business authority;
20. historical effects preserve the verifier/proof/dependency revisions actually used without being rewritten by later verifier retirement.

## 18. Adversarial cases

1. Builder signs `P7->P8 safe`; runtime treats signature as proof without checking semantics;
2. valid proof for P8a is attached to subtly different P8b;
3. policy hashes match but schema revision changed entity hierarchy;
4. SMT derivation is valid for a mistranslated custom predicate;
5. producer and runtime verifier share the same buggy translation library, defeating independence;
6. proof format contains an unsupported rule that runtime skips as success;
7. external proof exporter inserts a trust/hole step but UI still labels transition fully proven;
8. proof created under calculus V1 is parsed under V2 with changed rule meaning;
9. verifier downgrade via golden-image restore reintroduces a known acceptance bug;
10. proof is valid but runtime verifier version is security-revoked;
11. compromised Builder replaces policy, proof and verifier binary in one update channel;
12. proof checks decision-set implication but omits weakened authority/currentness guarantee dimensions;
13. capability predicate is copied centrally solely to make proof generation easier, creating shared business ownership;
14. proof registry outage blocks every runtime decision even though proof artifacts were already delivered;
15. runtime restarts and rechecks an old proof after its security-floor dependency changed, treating success as requalification;
16. proof-format converter preserves syntax but changes proposition or drops assumptions;
17. gigantic valid proof exhausts runtime memory and becomes an availability attack;
18. malformed proof consumes unbounded checking time before rejection;
19. verifier returns generic `invalid` for resource exhaustion, causing false security attribution;
20. proof producer is replaced and emits a different certificate whose conclusion looks equal but proof scope silently narrows.

## 19. Deduplication against existing G4 research

This round does not reopen base Exchange Plane vocabulary, semantic policy-diff classification, composition-policy lifecycle, multi-domain evidence composition, security-floor propagation or runtime autonomy. It adds the missing **consumer verification boundary**: proof-object versus attestation, producer versus checker TCB, proof-to-semantics binding, translation assurance, proof-format/rule versioning, trusted-step disclosure, verifier currentness and proof-check resource budgets.

## 20. Material hypothesis

A useful G4 proof-carrying policy design is plausible only if it has this shape:

```text
capability-owned semantics
        |
        v
qualified formal proposition + dependency refs
        |
        v
UNTRUSTED / REPLACEABLE PRODUCER SIDE
translator -> solver/prover -> proof object
        |
        v
portable proof artifact
        |
        v
SMALLER QUALIFIED RUNTIME VERIFIER
        |
        +--> checks exact proposition/dependencies/calculus
        +--> rejects unknown/trusted steps beyond profile
        +--> enforces local verification resource budget
        |
        v
qualified transition disposition
```

The value is not that the proof producer is infallible. The value is that, for the covered formal subset, a compromised or buggy producer cannot cause acceptance without supplying evidence accepted by a smaller independently governed verifier.

That value disappears when producer and checker share the same unqualified translator, trust root, opaque engine semantics or update authority.

## 21. Maturity and next gap

Material boundaries changed, so this round is not `NO_MATERIAL_DELTA`.

Family 8 remains `RESEARCH_ACTIVE / NON_EXECUTABLE` and not saturated.

Highest-value remaining gap: **proof-verifier trust continuity and diverse-verifier equivalence** — determine how verifier/kernel upgrades are authorized and anti-rollback protected; whether two independently implemented verifiers can be qualified as accepting the same proof language/proposition without a circular common implementation; how differential verification, verified kernels, reproducible builds and proof corpora contribute; and how a runtime transitions between verifier generations without either requiring a permanent old verifier or accepting proofs under an unqualified new semantic interpretation.