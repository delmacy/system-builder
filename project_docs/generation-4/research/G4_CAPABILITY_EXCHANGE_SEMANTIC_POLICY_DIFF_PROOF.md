# G4 — Semantic Non-Downgrade & Policy-Diff Proof

Status: `RESEARCH_ACTIVE / NON_EXECUTABLE`
Execution authority: NONE
Date: 2026-09-19
Parent family: Shared Semantic Kernel / Capability Exchange Plane / Inter-Capability Boundary Model

## Purpose

Deepen the highest-value gap from composition-policy lifecycle research: determine when a policy transition can be classified as restrictive, expansive, equivalent, incomparable or only conditionally safe; identify a useful mechanically provable subset; and prevent syntax/schema/SAT results from being promoted into business/security semantic equivalence.

This is not a new macro-family. It selects no policy engine, SMT solver, theorem prover, authorization language, gateway, broker or provider and grants no implementation authority.

## Evidence classes reviewed

Primary/mature evidence used in this round:

- Cedar policy language/reference: default-deny, forbid-overrides-permit, schema validation, validation soundness and the explicit limitation that syntactically/schema-valid policy does not prove author intent or correctness.
- Amazon Science SymCert (FMCAD 2026): verified symbolic compilation/authorization for SMT-based Cedar analyses, including counterexample extraction and completeness-oriented reasoning for a bounded formal semantics.
- Open Policy Agent documentation: partial evaluation with declared unknowns and policy fragments whose translatability depends on a restricted subset rather than arbitrary Rego.
- USENIX OSDI 2022 Blockaid: SMT-based policy compliance checking can preserve application semantics only relative to a stated policy model and query semantics; caching/generalization are optimizations over that qualified proof.
- Prior G4 composition-policy lifecycle, multi-domain evidence composition, contract compatibility, security-floor and in-flight-evolution findings.

References:
- https://docs.cedarpolicy.com/policies/validation.html
- https://docs.cedarpolicy.com/policies/syntax-policy.html
- https://docs.cedarpolicy.com/auth/authorization.html
- https://www.amazon.science/publications/symcert-verifying-smt-based-policy-analyses
- https://www.openpolicyagent.org/docs/policy-performance
- https://www.openpolicyagent.org/docs/filtering/fragment
- https://www.usenix.org/conference/osdi22/presentation/zhang

## 1. Semantic diff is a relation over decisions, not text

For a declared request/state universe `U`, let `Allow(P, x)` mean policy P admits interaction x under the same qualified semantics and evidence model.

A useful first-order classification is:

```text
EQUIVALENT:
  forall x in U: Allow(Pold,x) == Allow(Pnew,x)

RESTRICTIVE:
  forall x in U: Allow(Pnew,x) -> Allow(Pold,x)
  and exists x: Allow(Pold,x) && !Allow(Pnew,x)

EXPANSIVE:
  forall x in U: Allow(Pold,x) -> Allow(Pnew,x)
  and exists x: !Allow(Pold,x) && Allow(Pnew,x)

INCOMPARABLE:
  exists a: old allows / new denies
  and exists b: old denies / new allows
```

This is stronger than AST/text diff, but still only meaningful if `U`, evaluation semantics, schemas, extensions, dependent evidence and error/unknown behavior are fixed and qualified.

```text
Text diff small != semantic delta small
Text diff large != semantic delta large
```

## 2. SAT/SMT can prove a formal implication, not unstated business meaning

A solver can search for a counterexample to `new => old` or `old => new` once both policies are translated into a sound formal model. SymCert is strong evidence that useful analyses can be mechanically reduced to SMT and that the reduction itself can be verified for a defined language semantics.

But:

```text
UNSAT(counterexample formula)
=> implication holds in the modeled semantics
!= business/security intent preserved universally
```

The proof inherits every assumption in the model: request universe, schema, extension semantics, entity hierarchy, currentness predicates, external facts, error handling and any abstraction used for providers or capabilities.

Therefore a future G4 proof must carry a `ProofScope`, not a naked `safe=true`.

## 3. Validation and semantic comparison are different proof objects

Cedar validation is deliberately schema-relative. Its documentation explicitly notes that a policy can be well-formed yet not mean what its author intended, and that schema evolution can invalidate previously validated policies.

```text
Policy validates != policy is correct
Policy validates under S1 != policy validates under S2
```

Validation can establish typing/well-formedness properties. It does not establish restrictive/expansive/equivalent relation between two policies.

This distinction is important because a syntactically valid successor may be a semantic downgrade.

## 4. Deny/permit combining semantics are part of the diff

Cedar provides a mature example where default-deny and forbid-overrides-permit shape the policy-set semantics. Adding one `forbid` can be globally restrictive even while adding text; adding one `permit` may be expansive only where no forbid already applies.

Therefore diff cannot classify individual rules independently and then sum labels.

```text
rule-local classification
!= policy-set classification
```

The combining algorithm, defaults and error behavior are part of the contract being proven.

## 5. Unknowns create a proof boundary, not permission to guess

OPA partial evaluation is explicit about values marked unknown and about restricted fragments that can be translated to another target representation. This supplies a useful general principle:

```text
Mechanically provable subset
!= arbitrary policy language
```

A G4 composition policy may reference custom predicates such as provider qualification, authority currentness, security floor, tenant classification or capability-owned business invariants. If their semantics are opaque to the proof engine, they must be represented as qualified uninterpreted predicates with assumptions, or the result must degrade.

Candidate dispositions:

```text
PROVEN_RESTRICTIVE(scope, assumptions)
PROVEN_EXPANSIVE(scope, assumptions)
PROVEN_EQUIVALENT(scope, assumptions)
PROVEN_INCOMPARABLE(scope, witnesses)
CONDITIONALLY_SAFE(required predicates/evidence)
UNPROVEN_UNKNOWN_SEMANTICS
COUNTEREXAMPLE_FOUND
```

`UNKNOWN` is not `EQUIVALENT` and not `SAFE`.

## 6. Conditional safety is first-class

Many transitions are neither globally restrictive nor globally expansive.

Example:

```text
P7: allow provider G2 when security >= S7
P8: allow G2 as before; allow G3 only when security >= S10
```

Relative to states with `security >= S10`, P8 expands provider choice. Relative to the complete universe, the expansion is guarded by a prerequisite.

The useful result is not simply `EXPANSIVE`; it is:

```text
CONDITIONALLY_SAFE_EXPANSION
  if securityFloor >= S10
  and G3 qualification evidence current
```

This composes with the prior rule that ordinary composition permission cannot widen a newer security floor.

## 7. Proof scope must include schema and external semantic dependencies

A semantic diff is qualified by at least:

```text
policy-language semantics/version
schema/entity model revision
request/state universe
combining/default/error semantics
extension/custom predicate contracts
security/authority/currentness assumptions
provider/capability qualification assumptions
unknown treatment
time model where temporal predicates exist
```

Changing one may invalidate the old proof without changing either policy text.

```text
Same policy bytes + changed schema/domain semantics
!= same proven behavior
```

This is directly analogous to contract compatibility being multidimensional rather than schema-only.

## 8. Counterexamples are stronger artifacts than a boolean diff result

When implication fails, a concrete witness such as:

```text
principal/context = ...
capability = X
provider = G3
securityRevision = S9
oldDecision = DENY
newDecision = ALLOW
```

is materially useful for review and regression tests. SymCert's emphasis on finite counterexample extraction supports this pattern.

A future proof artifact should prefer minimal qualified witnesses over `changed=true`.

```text
Counterexample found
=> non-equivalence proven for that model
```

but absence of a counterexample is only a proof when the search/translation is itself complete for the declared scope.

## 9. Security non-downgrade needs protected predicates/floors

Pure set inclusion over `Allow` is insufficient for every security question. A new policy could keep the same allow set while weakening required evidence quality, currentness horizon, authority provenance or delivery guarantee.

Therefore:

```text
Same admitted request set
!= same guarantee vector
```

Semantic non-downgrade must compare both decision space and protected guarantee dimensions relevant to the interaction contract.

Candidate protected dimensions include security floor, authority strength/currentness, classification/tenant isolation, provider qualification, evidence quality, retry/idempotency/fencing requirements and maximum stale horizon.

This prevents a policy from being labeled `EQUIVALENT` merely because both versions eventually return ALLOW for the same happy-path requests.

## 10. Business semantics remain capability-owned

A composition-policy analyzer can prove relations over declared predicates. It cannot infer that `creditLimit >= 1000`, `patientConsentCurrent`, or `workOrderClosable` means the right thing for the owning capability unless that capability supplies a formal contract suitable for analysis.

```text
Formalizable predicate != shared business ownership
```

The Shared Semantic Kernel may carry predicate identity/revision/proof references. The Exchange Plane may transport/evaluate qualified composition evidence. Neither becomes the owner of domain policy semantics.

## 11. Policy-engine migration is itself a semantic-diff problem

Moving the same apparent policy from one engine to another can change defaults, unknown/error behavior, numeric/time semantics, hierarchy handling or extension behavior.

```text
same source intent
!= same engine semantics
```

Portability therefore requires conformance/oracle tests and, where mechanically possible, cross-engine equivalence proofs for the declared subset. Unsupported constructs must become explicit incompatibility or mediation, never silent normalization.

## 12. Proof caching and invalidation

A proof result is cacheable only with all semantic dependencies in its key/evidence envelope. At minimum, policy revisions plus language/schema/custom-predicate/guarantee-profile revisions must be represented.

```text
cached PROVEN_RESTRICTIVE(P7,P8,S1)
+ schema changes to S2
!= still PROVEN_RESTRICTIVE automatically
```

The proof is projection/evidence, not canonical business truth. Dependency change invalidates or narrows it.

## 13. Portability / exit path

Portable meaning should include old/new policy identity and revision, proof classification, proof scope, formal semantics/version, schemas, assumptions, protected guarantee dimensions, unknown/custom predicates, counterexamples, proof-engine identity/version, evidence/provenance and invalidation dependencies.

Cedar, Rego/OPA, SMT solvers, Lean, model checkers, bespoke declarative evaluators and cloud policy analyzers remain replaceable candidates. A replacement may return `UNPROVEN` rather than fabricate equivalence.

## 14. Candidate proof obligations

Before implementation planning, prove or explicitly bound:

1. semantic diff is defined over decisions/guarantees, not text size or AST edit count;
2. restrictive/expansive/equivalent/incomparable classification names its request/state universe;
3. solver results carry the exact formal semantics and assumptions used;
4. schema validation is not treated as semantic equivalence proof;
5. policy-set combining/default/error semantics participate in comparison;
6. unknown/custom predicates never default to semantic equality;
7. unsupported predicates produce conditional/unproven disposition rather than allow-by-omission;
8. conditional expansions enumerate the prerequisite evidence that makes them admissible;
9. proof scope includes schema and external predicate/guarantee revisions;
10. schema/domain-semantic changes invalidate or requalify prior proofs;
11. counterexamples preserve enough qualified state to reproduce the semantic difference;
12. absence of counterexample is called proof only when translation/search completeness is established for scope;
13. same allow set is not treated as same guarantee vector;
14. protected security/authority/currentness dimensions participate in non-downgrade classification;
15. capability-owned business predicates remain capability-owned;
16. policy-engine migration cannot claim equivalence from syntax translation alone;
17. cross-engine equivalence is qualified by common supported semantics and conformance evidence;
18. cached proof artifacts are keyed by every semantic dependency that can change their result;
19. proof artifacts remain evidence/projection rather than canonical business authority;
20. Builder/control-plane unavailability does not prevent a runtime from applying already-qualified policy/proof artifacts within declared horizons.

## 15. Adversarial cases

1. one-line policy edit removes a security conjunct; UI labels it low-risk because textual diff is tiny;
2. policy is schema-valid but author used the wrong semantically valid entity type;
3. SAT returns UNSAT because a relevant custom predicate was modeled as always false;
4. old/new policies admit same requests but new version accepts stale authority evidence;
5. each changed rule appears restrictive while policy-set combining semantics make the full set expansive;
6. old runtime ignores an unknown predicate and labels successor equivalent;
7. schema S2 broadens an entity hierarchy; cached equivalence proof from S1 is reused;
8. extension function semantics change across engine versions without policy-byte change;
9. time predicate is analyzed under perfect clock assumptions but runtime clock may be stale;
10. solver finds no counterexample due to an incomplete abstraction and result is displayed as proven equivalent;
11. concrete counterexample exists but is discarded, preventing regression reproduction;
12. proof engine reports restrictive decision-set change while evidence-strength requirement was weakened;
13. policy-engine migration maps error to deny in one engine and skip/unknown in another;
14. gateway translates unsupported custom predicate to `true` to preserve availability;
15. capability business predicate is copied into shared kernel so central analyzer can understand it, creating shared business ownership;
16. proof cache keyed only by policy hashes survives security-floor revision;
17. conditional expansion is deployed before its prerequisite provider qualification becomes current;
18. policy analyzer requires live Builder RPC on every runtime decision, violating runtime autonomy;
19. an incomparable transition is collapsed to `changed` and automatically rolled out without identifying expansion witnesses;
20. a numerically newer policy passes anti-rollback and syntactic checks but weakens a protected guarantee dimension.

## 16. Deduplication against existing G4 research

This round does not reopen base Exchange Plane vocabulary, policy lifecycle/rollback, multi-domain evidence composition, contract compatibility or security-floor propagation. It adds the missing proof layer for **semantic policy change classification**: decision-set implication, guarantee-vector comparison, proof scope, unknown/custom predicate treatment, counterexample evidence and proof invalidation.

## 17. Maturity and next gap

Material boundaries changed, so this round is not `NO_MATERIAL_DELTA`.

Family 8 remains `RESEARCH_ACTIVE / NON_EXECUTABLE` and not saturated.

Highest-value remaining gap: **proof-carrying exchange policy and runtime verification boundary** — determine the minimal portable proof/evidence artifact a runtime needs to verify a policy transition locally without trusting the Builder or a specific solver; distinguish proof replay/verification from re-solving; qualify proof-engine/compiler bugs and version skew; and determine when proof-carrying artifacts materially reduce runtime trust versus merely moving trust into the proof producer/compiler.