# G4 Capability Exchange — Precedence-Proof Evolution, Stale Evidence and Selective Requalification

Status: `RESEARCH_ACTIVE / NON_EXECUTABLE`
Date: 2026-09-22
Family: Shared Semantic Kernel / Capability Exchange Plane / Inter-Capability Boundary Model

> Research candidate != implementation authority. This document does not select a policy engine, legal/rule engine, IAM provider, gateway, broker, schema registry, synchronization mechanism or central adjudicator. It does not reopen G3 and does not authorize product work.

## 1. Research question

Prior G4 research established that simultaneous rule authorities need explicit applicability, precedence/combining semantics, currentness and bounded adjudication rather than recency, technical centrality or a universal hierarchy. The next gap is lifecycle: what happens when independently versioned authorities and the precedence relation itself evolve at different times, while some runtimes are stale or offline?

Representative sequence:

```text
t0: A@a1 applies; B@b1 applies; precedence P@p1 says A > B for invariant X
t1: A -> a2
t2: B changes scope -> b2
t3: precedence/combining rule P -> p2
t4: runtime R is still carrying some mixture of a1/b2/p1
```

Core findings:

`authority revision != precedence revision`.

`precedence relation unchanged textually != precedence proof still valid`.

`all inputs individually current != composed precedence proof current`.

`one dependency changed != synthetic global policy revision`.

`offline possession != indefinite new-effect authority`.

`control-plane update acknowledged != every evaluator has crossed the same semantic frontier`.

The implementation-independent hypothesis is therefore a dependency-qualified precedence proof whose material proof cut can be selectively requalified when one authority, applicability scope, combining policy, schema/semantic profile, security floor or adjudication relation changes.

## 2. Evidence reviewed

Primary documentation and mature operational systems:

- OASIS XACML 3.0 defines multiple policy/rule combining algorithms. Prior G4 research used this to establish that combining semantics are part of decision meaning, not an implementation detail. A change in combining policy can change the result without changing child policies. <https://docs.oasis-open.org/xacml/3.0/xacml-3.0-core-spec-en.html>
- Cedar documentation states that policy validation is performed separately from authorization evaluation and is relative to an application schema. It explicitly warns that when a schema changes, policies validated previously may no longer be valid and can produce errors during authorization; affected policies should be reviewed/revalidated. <https://docs.cedarpolicy.com/policies/validation.html>
- Amazon Verified Permissions `PutSchema` documents a sharper failure mode: changing a schema validates only policies/templates submitted after the schema change; existing policies/templates are not automatically re-evaluated against the changed schema. <https://docs.aws.amazon.com/verifiedpermissions/latest/apireference/API_PutSchema.html>
- Amazon Verified Permissions documents eventual consistency for policy-store changes: new/changed elements can take seconds to propagate and become visible to other operations. <https://docs.aws.amazon.com/verifiedpermissions/latest/apireference/API_CreatePolicyStore.html>
- Amazon Verified Permissions policy-store aliases are durable names, not atomic traffic-control aliases. AWS explicitly states that alias resolution can be cached/eventually consistent, that repointing is not atomic, and recommends application-controlled migration between distinct stores rather than treating alias replacement as an atomic cutover. <https://docs.aws.amazon.com/verifiedpermissions/latest/userguide/policy-store-aliases-using.html>
- Amazon Verified Permissions' Cedar 4 migration documentation records backwards-incompatible syntax, validation and built-in-function behavior changes, and identifies policy stores by Cedar semantic version. This is direct evidence that evaluator/language semantic generation can be a material proof dependency independent of policy text. <https://docs.aws.amazon.com/verifiedpermissions/latest/userguide/cedar4-faq.html>
- Amazon Verified Permissions template-linked policies automatically use an updated template. This is a mature example of indirect policy dependency where a child policy's effective meaning can change without rewriting the child instance. <https://docs.aws.amazon.com/verifiedpermissions/latest/apireference/API_CreatePolicy.html>

These systems are benchmarks for lifecycle, propagation and proof-dependency failure modes only. No Cedar, XACML, AWS policy-store topology, global revision counter or centralized PDP is selected.

## 3. Material findings

### 3.1 A precedence decision has a dependency cut, not one version

A useful candidate model is:

```text
PrecedenceDecisionProof
  protectedInvariant
  decisionScope
  authorityInputs[]
  applicabilityProofs[]
  precedenceRelationRef
  combiningPolicyRef
  semanticProfileRef
  schema/model assumptions[]
  adjudication/exception refs[]
  security/currentness floors[]
  dependencyEvidence[]
  evaluatedAt
  result/disposition
```

The proof is valid only while the material dependencies on which its conclusion rests remain qualified.

`proof id current != every dependency current`.

A single opaque `PolicyRevision` would hide which authority or semantic dimension actually changed and would force unnecessary global invalidation.

### 3.2 Authority, applicability and precedence evolve independently

Authority A can change its own rule without changing how A ranks relative to B. B can change its applicability scope without changing either rule text. A higher-order authority can change `A > B` to conjunction/exception semantics while A and B remain byte-identical.

Therefore:

`revision(A)`, `revision(B)`, `applicability(A/B)`, and `revision(P)` are independent axes.

A global monotonically increasing platform revision is operationally convenient but semantically insufficient: it cannot by itself explain what must be requalified or which historical proof remains valid.

### 3.3 Textually stable precedence can become invalid when its universe changes

Suppose P says A dominates B for resource class R. If B@b2 expands to a new resource/effect class or A@a2 narrows its authority scope, the bytes of P may be unchanged while its previous proof assumptions no longer cover the effective universe.

`mapping unchanged != mapping proof current`.

This parallels the prior delegation-semantic-mapping finding: provider/API permission-universe growth can defeat a prior containment proof even when the adapter mapping is unchanged.

### 3.4 Semantic-profile/schema evolution is a proof dependency

Cedar's schema guidance provides a concrete mature failure case: policies validated under an old schema may become invalid under a changed schema. Verified Permissions additionally documents that existing policies are not automatically revalidated by `PutSchema`.

Therefore:

`policy unchanged + schema changed != old qualification automatically reusable`.

Likewise, Cedar 2 -> Cedar 4 demonstrates that language/evaluator semantics can change materially even if a policy artifact appears conceptually similar.

Candidate invariant:

`policy bytes + precedence bytes without semantic-profile identity != reproducible decision proof`.

### 3.5 Currentness is vector-valued

A runtime may know A@a2 but only B@b1 and P@p1. Another may know B@b2 and P@p2 but still carry A@a1. Neither state can safely be normalized to one scalar `policyVersion`.

Candidate currentness vector:

```text
A: a2 / observed tA / floor fA
B: b1 / observed tB / floor fB
P: p1 / observed tP / floor fP
Semantics: s4
Schema: q7
```

`all components have versions != versions are mutually compatible`.

Compatibility is a relation over the proof scope, not a tuple-presence check.

### 3.6 Propagation ACK is not semantic convergence

Verified Permissions documents eventual consistency for policy-store changes and non-atomic/cached policy-store alias changes. This is strong operational evidence for:

`control-plane accepted update != all decision points evaluate the new generation`.

A runtime therefore cannot treat provider update ACK, alias switch, registry write or policy publication as proof that every crossing has adopted the new precedence semantics.

Where mixed generations are possible, the exchange contract needs explicit generation/currentness evidence or a safe mixed-mode rule.

### 3.7 Indirect dependencies create hidden semantic mutation

Template-linked policies in Verified Permissions automatically use an updated template. More generally, effective semantics can depend on templates, managed policies, schemas, group membership, resource policy, external attributes or adjudication rules.

`leaf artifact unchanged != effective policy unchanged`.

A precedence proof must retain enough dependency lineage to know whether a changed upstream artifact is material to its conclusion.

This does not require one universal dependency graph; dependency closure can be provider/domain qualified.

### 3.8 Selective requalification follows the material proof cut

If A changes only a rule irrelevant to invariant X, a proof for X need not be invalidated merely because A has a newer global revision. Conversely, a tiny change to an applicability predicate that controls X may require immediate requalification.

Candidate rule:

`dependency changed -> requalify proofs whose conclusion materially depends on that dependency`.

Not:

`dependency changed -> flush all policy/evidence globally`.

And not:

`dependency changed -> keep every cached proof until TTL`.

This mirrors G4's evidence-cache discipline while preserving authority-specific semantics.

### 3.9 A proof can remain historically valid while becoming inadmissible for new effects

A proof used at t0 under A@a1/B@b1/P@p1 remains historical evidence of why decision D was made. If P@p2 later changes precedence, D's lineage is not rewritten.

But:

`historically interpretable != currently admissible for new protected effect`.

A runtime can retain old semantic snapshots for audit/recovery while refusing to use them for new effect admission once a currentness/security floor requires newer evidence.

### 3.10 Offline autonomy needs bounded precedence horizons

Autonomous client runtimes must not depend on Builder availability. That does not imply indefinite use of stale precedence evidence.

Candidate offline behavior distinguishes:

- historical interpretation: may remain possible from immutable retained semantics;
- continuation of already-admitted work: governed by explicit continuation rules;
- new protected effects: require currentness/floor evidence within the declared horizon;
- independently safe/local operations: may continue if their proof cut does not depend on stale contested relations.

`offline != globally blocked`.

`offline != precedence frozen forever`.

### 3.11 Floors can invalidate old proofs without proving a replacement result

If a runtime learns a monotonic minimum precedence/security generation `p2`, then cached proof under `p1` may become inadmissible for new effects even if the runtime cannot yet fetch p2.

`old proof below floor -> inadmissible` does not imply `new result known`.

The correct result may be `UNKNOWN/CONTESTED/DEFER` for the protected effect until sufficient replacement evidence arrives.

This preserves monotonic safety without inventing semantics during partition.

### 3.12 Mixed-generation operation requires an explicit compatibility relation

During rollout, one participant may evaluate P@p1 and another P@p2. Schema/interface compatibility does not prove that their decisions mean the same thing.

Candidate conditions for safe mixed mode include one or more of:

- semantic equivalence for the protected invariant is proven;
- one generation is a qualified monotonic restriction for that exact decision dimension and positive obligations remain preserved;
- the crossing is fenced/quarantined until common admissibility exists;
- each side can carry its generation lineage and the consumer contract explicitly accepts the difference.

`both generations parse same envelope != compatible precedence semantics`.

### 3.13 No synthetic global policy revision is required

Independent authorities should not be forced into one shared revision counter. That would couple ownership and availability domains and encourage a central policy monolith.

Instead, candidate evidence can carry qualified refs/floors and derived proof lineage:

```text
PrecedenceProofRef -> {A@a2, B@b1, P@p3, Semantics@s4, Schema@q7}
```

A derived proof may have its own immutable identity, but that identity summarizes dependencies rather than replacing their independent authority.

`derived proof identity != synthetic ownership of source rules`.

### 3.14 Precedence requalification is not business adjudication

A verifier can determine that a stored proof no longer meets declared dependency/currentness requirements. That does not authorize it to decide what A or B legally/commercially ought to mean.

`proof stale != verifier may invent replacement precedence`.

The Exchange Plane may carry/invalidate/reverify structural evidence and preserve unresolved disposition. Capability/domain authority remains responsible for business adjudication.

### 3.15 Provider aliases and indirection must not masquerade as atomic semantic cutover

Verified Permissions explicitly warns that policy-store alias repointing is not an atomic traffic-control mechanism and can be cached/eventually consistent. This generalizes:

`stable alias name != immutable semantic identity`.

For protected effects, an alias such as `current-policy` is insufficient proof identity unless resolution/generation is pinned or the contract explicitly tolerates mixed resolution.

Mutable aliases remain discovery conveniences, not durable semantic identities.

### 3.16 Revalidation on schema change is not guaranteed by infrastructure

Verified Permissions `PutSchema` documents that existing policies are not automatically re-evaluated against the changed schema. This is a useful adversarial benchmark against assuming provider machinery will maintain proof closure.

`provider accepted schema update != all dependent policies/proofs requalified`.

G4 therefore needs an implementation-independent obligation to track material dependency invalidation even if a selected provider does not.

### 3.17 Requalification completion itself needs evidence

A migration controller may report that a new rule, schema or precedence relation has been deployed. That is not equivalent to proof that every material decision path has requalified.

Candidate distinction:

```text
DESIRED_GENERATION
PUBLISHED_GENERATION
OBSERVED_GENERATION
QUALIFIED_GENERATION
EFFECTIVE_FOR_NEW_ADMISSION
DRAINED_OLD_GENERATION
```

These are research states, not authorized enums.

`new generation qualified != old in-flight obligations drained`.

This connects precedence evolution to prior G4 handoff/recovery research without reopening that macrofront.

### 3.18 Shared Semantic Kernel remains structural

Potential kernel-level primitives are immutable refs, revision/generation refs, qualified dependency relations, currentness/floor evidence, provenance and conflict disposition.

It must not own A/B/P business rules, legal precedence or a universal policy dependency graph.

`shared dependency vocabulary != shared policy ownership`.

### 3.19 Capability Exchange Plane remains a corridor, not a policy control plane

The logical Exchange Plane may preserve precedence lineage across a boundary, reject evidence below a declared corridor floor, expose stale/unknown dispositions and route to an explicitly authorized adjudication capability.

It must not require every runtime to synchronously consult one central precedence service.

`logical precedence evidence propagation != central PDP dependency`.

This preserves published runtime autonomy.

## 4. Candidate vocabulary

Research vocabulary only:

- `PrecedenceProofRef` — immutable evidence identity for one precedence/composition conclusion.
- `PrecedenceDependencyRef` — qualified dependency on an authority rule, applicability rule, combining policy, schema, semantic profile, floor or adjudication relation.
- `PrecedenceProofCut` — minimal known dependency set material to a named conclusion/invariant.
- `PrecedenceGenerationRef` — identity of precedence/combining semantics, independent of child authority revisions.
- `AuthorityGenerationRef` — one authority's immutable rule/provision generation.
- `ApplicabilityGenerationRef` — generation of scope/applicability semantics when separately governed.
- `SemanticProfileRef` — immutable evaluator/language/normative semantics identity.
- `PolicySchemaRef` — schema/model identity used for validation/interpretation where material.
- `PrecedenceFloorRef` — minimum acceptable generation/currentness/security evidence for a scope.
- `RequalificationEvidenceRef` — evidence that a prior proof cut was re-evaluated against changed material dependencies.
- `MixedGenerationCompatibilityRef` — qualified proof that two generations can safely coexist for a named invariant.

These remain structural candidates and do not authorize product schemas.

## 5. Candidate proof obligations

1. A precedence decision identifies every known material authority/applicability/precedence dependency required for its conclusion.
2. Authority generation and precedence generation remain independently identifiable.
3. A child authority revision does not automatically fabricate a precedence revision.
4. An unchanged precedence artifact is requalified when a material assumption/universe on which its proof depended changes.
5. Schema/semantic-profile changes are treated as material proof dependencies where they can change validation/evaluation meaning.
6. Existing policy validation is not assumed to have been rerun merely because a provider accepted a schema update.
7. Mutable aliases are not used as durable semantic identities without pinned resolution or explicit mixed-resolution semantics.
8. Provider/control-plane ACK is not treated as evidence of distributed semantic convergence.
9. Currentness remains multidimensional; one scalar policy version cannot silently collapse independent authority generations.
10. Independently current inputs are checked for mutual compatibility before composing a current precedence proof.
11. Indirect dependencies such as templates/managed rules remain visible enough for material invalidation.
12. Dependency change invalidates/requalifies only proofs materially dependent on it where that dependency closure is known.
13. Lack of dependency-closure knowledge degrades assurance rather than permitting stale reuse.
14. Historical proof remains interpretable under its original semantic dependencies after current admissibility expires.
15. Historical interpretability does not authorize new protected effects under stale precedence evidence.
16. New-effect admission is bounded by declared precedence/currentness/security horizons and floors.
17. A newly learned floor prevents rollback to older cached precedence evidence after restart/restore.
18. Evidence below a required floor becomes inadmissible without fabricating the successor decision.
19. Offline runtime behavior distinguishes historical interpretation, continuation, new effects and independent safe operations.
20. Mixed-generation operation has an explicit invariant-scoped compatibility or quarantine rule.
21. Schema/interface compatibility alone cannot prove mixed-generation precedence compatibility.
22. Positive obligations remain preserved when proving monotonic restriction across generations.
23. No synthetic global policy revision is required across independent authority domains.
24. Derived proof identity preserves source dependency lineage and does not become source authority.
25. Requalification verifier does not invent replacement business/legal precedence when proof becomes stale.
26. Exchange Plane can preserve/invalidate evidence without becoming canonical policy owner or mandatory central PDP.
27. Requalification completion is distinguished from publication/deployment/observation.
28. New generation qualification does not imply old in-flight obligations/effect rights are drained.
29. Runtime-local evidence can be sufficient when its proof cut and floors are satisfied; Builder availability is not required.
30. Stale/unknown precedence remains explicitly representable across cross-capability exchange.
31. Provider/language semantic upgrades bind a new semantic profile when behavior can change materially.
32. Rollback of implementation does not silently roll back a monotonic precedence/security floor.
33. Requalification evidence is scoped to the invariant/decision class actually checked.
34. A precedence proof cannot claim completeness beyond the dependency universe it can establish.

## 6. Adversarial cases

1. A changes from a1 to a2; runtime keeps P@p1 forever because P's text did not change.
2. B expands its jurisdiction/resource scope, invalidating an old A>B proof assumption without changing either relation label.
3. P changes combining semantics while A and B remain byte-identical; cache key uses only A/B revisions.
4. Schema changes; existing policies are assumed automatically revalidated although provider does not do so.
5. Cedar/evaluator semantic generation changes; same-looking policy is treated as identical proof semantics.
6. Policy-store alias is repointed and treated as an atomic global semantic cutover.
7. Control-plane update ACK is treated as proof every data-plane evaluator uses the new generation.
8. Runtime receives a2 and b2 but still has p1; system constructs a synthetic `latest` tuple and authorizes.
9. Every component is individually fresh, but the combination was never qualified together.
10. One unrelated policy edit causes platform-global invalidation and availability collapse.
11. A material applicability edit is missed because global policy version did not change in the local cache key.
12. Template-linked policy changes through its template; leaf policy ID/revision appears unchanged.
13. Managed/external policy changes outside local registry; old precedence proof remains marked current.
14. Offline runtime uses p1 indefinitely for new irreversible effects because historical interpretation still works.
15. Runtime learns floor p2 but cannot fetch p2 and falls back to p1 for availability.
16. Runtime restores snapshot from before floor p2 and resurrects old admission authority.
17. Mixed p1/p2 peers exchange the same Allow/Deny-shaped result and assume semantic equivalence.
18. Adapter maps both generations to one provider priority integer and hides changed combining semantics.
19. Positive reporting obligation disappears during a supposedly monotonic deny-tightening migration.
20. Requalification engine chooses a new winner when old proof expires despite lacking adjudication authority.
21. Exchange Plane becomes a mandatory central policy oracle to avoid stale local evidence.
22. Global revision counter forces unrelated tenant/authority domains into one availability boundary.
23. Derived proof stores only a hash/result and loses which authority/schema/semantic inputs justified it.
24. Provider migration preserves policy text but changes evaluator semantics; compatibility is inferred from syntax.
25. Schema registry reports structural compatibility while precedence/applicability semantics changed.
26. New generation is deployed, but some long-lived sessions/queues continue old semantic admission invisibly.
27. Requalification controller reports complete because all nodes observed p2, although old effect rights remain live.
28. Retry after policy change is treated as new admission under p2 and launders old p1 lineage.
29. Historical audit re-evaluates old decision under p2 and falsely marks original p1 decision fabricated.
30. A genuine retroactive rule change is ignored because historical p1 proof is immutable.
31. Dependency closure is incomplete, but absence of known changes is treated as proof of currentness.
32. AI summarizes two policy generations as equivalent without machine-checkable/qualified evidence.
33. A stale precedence proof is reused across tenant/jurisdiction scope because the dependency key omits scope.
34. Rollback to old policy engine also rolls back the locally known minimum security/precedence floor.

## 7. Technology-independent decision criteria

A future implementation should prefer a precedence-evidence design that can answer:

1. What exact invariant/decision does this proof justify?
2. Which authority/applicability/precedence/semantic dependencies are material to that conclusion?
3. Which dependencies are independently versioned and current?
4. Can a changed dependency be shown irrelevant to this proof cut?
5. Is mixed-generation operation explicitly proven safe for this invariant?
6. What floor prevents stale rollback?
7. What remains valid offline, and for how long?
8. Can historical interpretation continue after new-effect admissibility expires?
9. Can the design requalify selectively without a global revision or mandatory central PDP?
10. Can a provider/evaluator be replaced without pretending syntax/schema compatibility is semantic equivalence?

If these questions cannot be answered, the system should expose `PARTIAL/UNKNOWN/CONTESTED/INCOMPATIBLE` as appropriate rather than fabricate a current precedence result.

## 8. Portability / exit path

Portability requires preserving semantic dependencies above any one policy engine:

```text
authority refs
applicability refs
precedence/combining semantics
semantic-profile identity
schema/model assumptions
currentness/floors
proof-cut lineage
historical decision lineage
mixed-generation compatibility evidence
```

A Cedar/XACML/provider-native realization may implement some of these efficiently, but provider aliases, policy-store IDs, client tokens, internal priority numbers or evaluator-specific caches must not become canonical G4 business authority.

`provider realization replaceable -> semantic proof obligations survive provider replacement`.

## 9. Deduplication against existing G4 research

This round does not reopen:

- generic rule evolution/retroactivity (`G4_CAPABILITY_EXCHANGE_FINALITY_RULE_EVOLUTION.md`);
- basic simultaneous authority conflict/precedence (`G4_CAPABILITY_EXCHANGE_RULE_AUTHORITY_CONFLICT_PRECEDENCE.md`);
- generic evidence caching/invalidation;
- semantic-generation handoff and queue draining;
- verifier trust continuity;
- delegation semantic mapping;
- split-brain/DR or provider rollout skew.

The material delta is specifically:

```text
qualified precedence
 -> independently versioned authority/applicability/precedence dependencies
 -> schema/evaluator semantic dependencies
 -> eventual/non-atomic propagation
 -> proof-cut lineage
 -> selective requalification
 -> monotonic floors + bounded offline reuse
 -> mixed-generation compatibility
 -> no synthetic global policy revision / no central policy court
```

## 10. Maturity and next gap

Maturity: `RESEARCH_ACTIVE / NON_EXECUTABLE`; not saturated.

This round materially changes the proof model by making precedence itself dependency-qualified and selectively requalifiable rather than a static relation attached to a rule result.

Highest-value next gap:

**proof-cut completeness for independently administered precedence dependencies** — how a runtime can establish that it knows every material authority/applicability/combining/semantic dependency capable of changing a protected precedence conclusion, especially when dependencies can be indirect (templates, managed policies, external attributes, jurisdiction maps, emergency overlays or provider semantics), without requiring one global policy registry and without treating absence from local discovery as proof of non-dependency.
