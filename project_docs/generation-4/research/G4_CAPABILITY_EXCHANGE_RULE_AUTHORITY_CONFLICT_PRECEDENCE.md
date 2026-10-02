# G4 Capability Exchange — Rule-Authority Conflict and Qualified Precedence

Status: `RESEARCH_ACTIVE / NON_EXECUTABLE`
Date: 2026-09-22
Family: Shared Semantic Kernel / Capability Exchange Plane / Inter-Capability Boundary Model

> Research candidate != implementation authority. This document does not select a legal rules engine, policy engine, IAM model, gateway, provider, broker, workflow engine, or adjudication mechanism. It does not reopen G3 and does not authorize product work.

## 1. Research question

Prior G4 research separated historical rule applicability from current disposition and established that rule evolution, retroactivity, grandfathering and finality are qualified rather than version-recency facts. The next gap is simultaneous conflict: what if multiple independently legitimate authorities apply to the same interaction/effect and their obligations cannot all be satisfied?

Examples include provider/scheme rules, jurisdiction/regulator rules, bilateral contract, capability-local policy, tenant policy, security floor and emergency controls.

Core findings:

`multiple applicable authorities != one implicit total order`.

`newer rule != higher authority`.

`stricter-looking rule != automatically governing rule`.

`explicit deny wins != universal cross-domain precedence law`.

`conflict detected != conflict adjudicated`.

`Exchange Plane can carry precedence evidence != Exchange Plane owns precedence truth`.

The model needs to represent authority scope, applicability, precedence relation, combining semantics, unresolved conflict and adjudication evidence separately.

## 2. Evidence reviewed

Primary standards and mature operational systems:

- OASIS XACML 3.0 Plus Errata 01 defines several distinct policy/rule combining algorithms, including deny-overrides, permit-overrides, first-applicable and only-one-applicable. The standard therefore demonstrates that policy composition semantics are explicit inputs to decision meaning; there is no universal combining rule derivable from the mere existence of multiple policies. <https://docs.oasis-open.org/xacml/3.0/xacml-3.0-core-spec-en.html>
- AWS IAM documents a domain-specific evaluation algebra: requests are implicitly denied by default; applicable explicit Deny overrides Allow; different policy classes such as identity/resource policies, permissions boundaries, SCPs/RCPs and session policies compose according to defined rules, including intersections and principal-specific exceptions. <https://docs.aws.amazon.com/IAM/latest/UserGuide/reference_policies_evaluation-logic_policy-eval-denyallow.html>
- AWS explicitly warns that IAM Policy Simulator results can differ from the live environment. This is evidence that an evaluator/simulator is bounded evidence rather than an omniscient authority oracle. <https://docs.aws.amazon.com/IAM/latest/UserGuide/access_policies_testing-policies.html>
- Prior G4 finality-rule evolution research established publication/effective/applicability separation and explicit retroactivity/grandfathering evidence.
- Prior G4 relationship-conflict and emergency-root research established that locally valid claims can remain incomparable/contested, majority/latest cannot manufacture authority, and settlement authority must itself be justified.
- Prior G4 semantic-policy and delegation-mapping research established that schema/name equality and provider translation do not prove semantic equivalence and that unknown semantics must not be normalized into allow/equivalence.

These are benchmarks for composition and conflict semantics only. No XACML, AWS IAM, legal hierarchy, universal authorization language or central policy decision point is selected.

## 3. Material findings

### 3.1 Authority applicability and authority precedence are distinct proofs

Before asking which rule prevails, the system must prove that each authority/rule is materially applicable to the named effect, subject, tenant, jurisdiction, resource, operation, time and decision.

`authority exists != authority applies here`.

After applicability, precedence is still a separate relation:

`A applies + B applies != A > B or B > A`.

Candidate evidence therefore separates `ApplicabilityProofRef` from `PrecedenceProofRef`.

### 3.2 Precedence is scoped, directional and often partial

A provider may govern protocol mechanics while a capability owner governs business acceptance. A regulator may constrain one operation while a contract governs another. Emergency security policy may suspend new effects without owning historical settlement semantics.

`authority precedence for dimension X != authority precedence for every dimension`.

The natural model is a partial order or qualified relation over a declared scope, not one global authority ranking.

### 3.3 Policy-combining semantics are part of the contract

XACML's multiple combining algorithms provide a strong negative lesson: `deny-overrides`, `permit-overrides`, `first-applicable` and `only-one-applicable` intentionally produce different semantics from the same child decisions.

Therefore:

`same child policies + different combining rule != same contract`.

A driver/adapter cannot silently replace one combining algorithm with another because both yield an Allow/Deny-shaped interface.

### 3.4 AWS explicit-deny precedence is domain-specific, not universal

AWS IAM's explicit Deny precedence is meaningful because AWS defines the applicable policy classes and evaluation logic for that authorization domain. It must not be generalized into a cross-domain rule that any prohibition from any authority automatically dominates every obligation.

`AWS deny-overrides != universal legal/business precedence`.

Likewise, an intersection rule for permissions cannot be generalized to settlement, finality, pricing, retention, contractual duties or remediation.

### 3.5 Conflict can be satisfiable without precedence

Two authorities may impose different but jointly satisfiable obligations. If A requires audit retention and B requires stronger authentication, satisfying both may require no winner.

Candidate disposition distinction:

- `COMPATIBLE_CONJUNCTION` — obligations can jointly hold;
- `QUALIFIED_PRECEDENCE` — declared authority relation selects/limits one rule for a named dimension;
- `SCOPED_EXCEPTION` — one rule explicitly creates an exception recognized by the governing precedence relation;
- `CONTESTED` — applicable rules conflict and no qualified precedence/adjudication proof resolves them;
- `INCOMPATIBLE` — the requested effect cannot satisfy the applicable obligations under the declared contract;
- `UNKNOWN` — applicability/precedence evidence is insufficient.

These are research vocabulary, not authorized enums.

### 3.6 “Most restrictive” is not a semantic primitive

Rules can constrain different dimensions and can impose positive duties, not merely allow/deny sets. “Take the strictest” is undefined when one authority requires deletion and another requires retention, one requires execution and another prohibits execution, or one permits disclosure only for purpose P while another requires a report to Q.

`stricter-looking != semantically dominant`.

A generic lattice is only valid when the contract has explicitly defined an order for that guarantee dimension.

### 3.7 Positive obligations expose the limit of deny-only models

Authorization engines often answer whether an action is permitted. Cross-capability governance also includes obligations such as notify, retain, erase, reconcile, compensate, attest or report.

`permission decision != complete obligation disposition`.

A conflict model must preserve both prohibitions and positive obligations; otherwise an adapter may return `DENY` while silently losing a still-live reporting/remediation obligation.

### 3.8 Conflict resolution authority is itself an authority claim

A component that can decide whether A or B prevails is exercising a higher-order authority. That authority cannot be inferred from technical centrality, gateway placement, Builder ownership or Exchange Plane visibility.

`can observe both rules != authorized to adjudicate them`.

`gateway position != precedence authority`.

A qualified `AdjudicationAuthorityRef` or equivalent evidence is required where actual adjudication is delegated.

### 3.9 Precedence graphs can themselves conflict or fork

Authority A may claim A>B while B claims B>A, or two governance documents may define incompatible combining rules. The precedence relation is therefore evidence subject to versioning, currentness, succession, conflict and recovery just like other authority claims.

`precedence metadata present != precedence uncontested`.

Cycles such as `A > B > C > A` cannot be linearized by timestamp or component order; they produce a qualified conflict unless a higher-order rule legitimately resolves them.

### 3.10 Newest and highest-priority are independent dimensions

Rule evolution within authority A answers which A-rule is applicable. Cross-authority precedence answers how A relates to B. These axes must not collapse.

`latest(A) != higher-than(B)`.

A newer provider rule cannot silently override an older but still applicable regulator/contract rule merely because its revision is newer.

### 3.11 Historical justification and current conflict remain separable

A decision D may have been justified under a previously uncontested precedence relation P1. Later P2 or a newly applicable authority can create a current conflict without rewriting D's historical proof.

`current precedence conflict != historical decision fabricated`.

If a later authority is genuinely retroactive, it may create successor obligations/review/remediation while preserving the original decision lineage.

### 3.12 Conflict scope follows the protected invariant

A retention-policy conflict need not invalidate an unrelated authentication decision. A security-floor conflict may block new protected effects while leaving historical evidence interpretation available.

`one authority conflict != platform-global conflict`.

The affected proof cut is the set of operations/invariants whose admissibility depends materially on the contested rule relation.

### 3.13 Safe degraded behavior is not permission union

When precedence is unresolved, allowing anything permitted by either authority expands authority. But blindly denying everything may also violate positive duties or availability contracts.

`A OR B permissions != safe conflict mode`.

`fail closed != complete obligation handling`.

Safe behavior must be contract/invariant-specific: defer a protected effect, preserve evidence, perform independently admissible duties, quarantine a crossing, or escalate to a qualified adjudication path.

### 3.14 Transport/gateway topology cannot settle precedence

Moving an interaction from direct call to broker, gateway or service mesh does not alter which authority governs it.

`route selected != governing authority selected`.

A gateway can enforce a resolved rule or quarantine unresolved crossings, but cannot create business/legal precedence by becoming the chokepoint.

### 3.15 Simulator/evaluator output is bounded evidence

AWS's warning that simulator results can differ from live evaluation reinforces:

`simulation result != omniscient effective-authority proof`.

A future G4 verifier may qualify a declared semantics snapshot, but unknown external policies, live resource conditions or provider behavior remain explicit assumptions/currentness dependencies.

### 3.16 Autonomous runtimes need locally verifiable precedence closure, not a mandatory central court

For ordinary known relations, a runtime may carry immutable rule refs, applicability evidence, precedence/combining policy and currentness floors sufficient to decide locally.

`local precedence verification != central precedence ownership`.

When the necessary adjudication evidence is unavailable or stale, the runtime can represent `CONTESTED/UNKNOWN` and apply bounded behavior rather than inventing a winner.

### 3.17 Precedence evidence must survive cross-capability exchange

Where a claim's meaning depends on a precedence relation, its evidence should preserve enough lineage to avoid downstream reinterpretation under a different local order.

Candidate envelope dimensions when material:

- authority/rule refs;
- applicability scope and evaluation time;
- precedence/combining-policy ref;
- adjudication/exception ref;
- conflict disposition;
- evidence provenance/currentness;
- protected invariant/decision scope.

`same result value + different precedence lineage != same assurance claim`.

### 3.18 Shared Semantic Kernel stays structural

Potential kernel-level primitives are references, qualified relations, time/currentness, provenance/evidence refs and conflict disposition structure. It must not contain a universal table saying regulator > contract > provider > capability, because that would import domain-specific ownership and potentially legal interpretation into shared infrastructure.

`Shared precedence vocabulary != shared precedence authority`.

### 3.19 Exchange Plane owns exchange semantics, not adjudication semantics

The logical Exchange Plane may transport rule lineage, verify syntactic/declared proof shape, enforce already-qualified corridor policies and preserve `CONTESTED/UNKNOWN`. It must not choose legal/commercial/business precedence unless a capability/domain contract explicitly delegates that bounded role.

`Exchange Plane carries conflict != Exchange Plane resolves business conflict`.

### 3.20 Portability requires explicit unsupported outcomes

A target provider/policy engine may be unable to express the source precedence or combining semantics. The adapter must report `PARTIAL/UNKNOWN/INCOMPATIBLE` or rely on a separately qualified complete-mediation gate.

`target has priority field != source precedence semantics preserved`.

This preserves exit paths across providers without fabricating equivalence.

## 4. Candidate vocabulary

Research vocabulary only:

- `AuthorityRuleRef` — immutable reference to one authority's rule/provision and semantic generation.
- `AuthorityScopeRef` — declared domain/jurisdiction/tenant/resource/effect/operation scope.
- `ApplicabilityProofRef` — evidence that an authority rule applies to the named decision/effect.
- `PrecedenceRelationRef` — qualified directional relation between applicable authorities/rules for a named guarantee dimension.
- `CombiningPolicyRef` — explicit rule for composing applicable decisions/obligations.
- `ExceptionRef` — qualified exception recognized by the governing rule/authority relation.
- `AdjudicationAuthorityRef` — evidence naming who may resolve a particular conflict and under what scope.
- `ConflictDispositionRef` — qualified compatible/precedence/contested/incompatible/unknown outcome.
- `PrecedenceCurrentnessRef` — currentness/floor evidence for the relation itself.

These primitives must remain structural. They do not create shared business entities or a universal legal hierarchy.

## 5. Candidate proof obligations

1. Every precedence decision names the applicable authority/rule set and protected scope.
2. Applicability is proven before precedence is evaluated.
3. Cross-authority precedence is not inferred from rule recency.
4. “Most restrictive” is used only where the governing contract defines a valid order for that guarantee dimension.
5. Provider-specific deny-overrides semantics are not generalized outside their declared domain.
6. Combining policy identity is part of the semantic contract when it can change outcomes.
7. Positive obligations survive composition even when the protected action is denied.
8. Jointly satisfiable obligations are composed without inventing a winner.
9. Unsatisfiable obligations remain representable as `CONTESTED/INCOMPATIBLE` rather than silently dropping one.
10. `UNKNOWN` applicability or precedence cannot be normalized into allow/equivalence.
11. Adjudication authority is explicit and bounded.
12. Technical centrality/gateway placement does not create adjudication authority.
13. Precedence relations themselves carry version/currentness/provenance and can be contested.
14. Cyclic/incomparable precedence cannot be linearized by timestamp or component order.
15. Historical decision proof retains the precedence/rule context actually used at decision time.
16. Later precedence changes create current/successor obligations without rewriting historical lineage.
17. Retroactive precedence/applicability requires explicit qualified evidence.
18. Conflict impact is scoped to operations/invariants whose proof cuts depend on the contested relation.
19. Degraded conflict behavior preserves positive duties and does not default to permission union.
20. Transport/topology substitution preserves authority/precedence semantics.
21. Cross-capability claims preserve material precedence/combining lineage.
22. Adapters expose lossiness when target precedence semantics cannot preserve the source contract.
23. Complete mediation that restores missing precedence semantics has explicit coverage/currentness proof.
24. Simulator/evaluator results remain bounded evidence with assumptions and live-environment gaps visible.
25. Offline runtimes can verify locally sufficient precedence closure without mandatory Builder availability.
26. Stale precedence evidence cannot silently authorize new protected effects beyond declared horizons/floors.
27. Exchange Plane may transport/enforce qualified results but does not own business/legal/commercial precedence.
28. Shared Semantic Kernel contains structural refs/relations only, not domain-specific authority hierarchy.
29. Conflict/adjudication evidence remains capability/domain-owned where it expresses business semantics.
30. Rule/provider migration preserves unresolved conflict rather than canonicalizing it away.

## 6. Adversarial cases

1. Provider rule is newer, so middleware treats it as superior to an applicable contract/regulatory rule.
2. Adapter maps all conflicts to `deny-overrides` because that seems safer.
3. A positive reporting obligation disappears because another policy denied the primary action.
4. Two rules are jointly satisfiable, but gateway chooses one and discards the other.
5. Two rules are incompatible; system unions their permissions for availability.
6. System chooses the numerically highest `priority` across unrelated authority domains.
7. A gateway becomes the de facto legal/business adjudicator because all traffic crosses it.
8. Exchange Plane stores a global `regulator > contract > provider` table as canonical truth.
9. Precedence graph contains A>B, B>C, C>A and runtime resolves it by latest timestamp.
10. Authority A's new revision is treated as globally stronger than authority B despite no precedence relation.
11. XACML-like combining policy changes from deny-overrides to permit-overrides without contract-version change.
12. Target engine supports only first-applicable; adapter claims equivalence to source only-one-applicable.
13. Simulator says Allow while live provider has an unmodeled applicable deny; proof is promoted to complete.
14. Rule applies only to tenant T1 but precedence is cached and reused for T2.
15. Emergency security rule suspends new effects and is incorrectly treated as owner of historical settlement.
16. Contractual exception is applied outside its subject/time/jurisdiction scope.
17. A later rule is assumed retroactive because it is stricter.
18. A historically justified decision is rewritten as invalid after precedence changes.
19. A genuine retroactive obligation is ignored because the historical decision was valid when made.
20. Broker route change silently changes which policy engine's precedence order is used.
21. Service mesh authorization result is treated as business-rule adjudication.
22. Adapter preserves Allow/Deny shape but loses obligations/advice/conditions.
23. Offline runtime continues using expired precedence evidence indefinitely.
24. Runtime blocks every operation globally because one narrow authority relation is contested.
25. Runtime fails closed on the primary action but also suppresses a mandatory remediation/reporting duty.
26. Provider migration collapses `CONTESTED` into one target priority field.
27. Majority of policy evaluators choose A; majority is treated as authority despite shared semantics/configuration defect.
28. AI infers that one authority is “more important” from prose/document titles.
29. Schema registry reports compatibility while combining semantics changed.
30. Precedence evidence is compacted without retaining the adjudication/currentness assumptions needed to interpret historical claims.

## 7. Deduplication against existing G4 research

This round does not reopen:

- generic rule evolution/retroactivity/grandfathering;
- semantic policy diff and proof-carrying verification;
- delegation/authorization semantic mapping;
- conflicting succession claims;
- constitutional emergency-root conflict;
- settlement/finality/reversal semantics;
- generic offline security floors;
- gateway complete mediation.

Material delta is specifically:

`multiple applicable authorities -> qualified applicability -> scoped precedence/combining semantics -> positive obligations + prohibitions -> contested/incompatible outcomes -> bounded adjudication authority -> locally verifiable closure without Exchange Plane ownership`.

## 8. Portability and exit path

Portability requires preserving semantic relations rather than a particular policy engine syntax. A runtime/provider transition can substitute XACML-like, IAM-like, capability-local or custom mechanisms only when the required applicability, combining, precedence, obligation and conflict semantics are preserved or explicitly requalified.

If a target cannot express the source relation, legitimate outcomes are explicit mediation, bounded decomposition, `PARTIAL/UNKNOWN`, or incompatibility. Silent flattening into numeric priority, first-match, deny-overrides or permit-overrides is not portable equivalence.

## 9. Maturity and next gap

Material delta exists; this is not `NO_MATERIAL_DELTA`.

The Shared Semantic Kernel / Capability Exchange Plane family remains `RESEARCH_ACTIVE / NON_EXECUTABLE` and not saturated.

Highest-value next gap: **precedence-proof evolution under independently versioned authorities and stale/offline evidence** — determine how a runtime requalifies a previously valid precedence relation when authority A changes its rule, authority B changes its scope, or the adjudication/combining rule itself changes at different times, without creating a synthetic global policy revision and without letting stale precedence evidence silently authorize new effects.

No implementation, provider adoption, WBS, Work Package, Sprint, TASK, migration or architecture decision is authorized by this research.