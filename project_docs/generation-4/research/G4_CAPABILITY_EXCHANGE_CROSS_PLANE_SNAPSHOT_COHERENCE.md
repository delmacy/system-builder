# G4 Capability Exchange — Cross-Plane Decision Snapshot Coherence

Status: `RESEARCH_ACTIVE / NON_EXECUTABLE`
Date: 2026-09-22
Family: Shared Semantic Kernel / Capability Exchange Plane / Inter-Capability Boundary Model

> Research candidate != implementation authority. This document does not select an authorization engine, PDP, policy store, attribute store, transaction protocol, consistency service, cache, gateway or provider. It does not reopen G3 and does not authorize implementation.

## 1. Research question

Prior G4 research established dependency-source closure, independently versioned precedence proofs, and delegated policy/attribute revocation. The remaining gap is cross-plane coherence: policy rules, relationship/entity attributes, delegation floors, applicability inputs, schemas and evaluator semantics may advance independently. When does a mixed-generation input set still constitute a valid decision snapshot, and when must the result remain `UNKNOWN/DEFER` rather than fabricate a coherent world?

Core findings:

`each input individually valid != composed decision snapshot coherent`.

`latest from every plane != one causally possible decision world`.

`same wall-clock observation time != same semantic cut`.

`cache bypass != cross-plane atomicity`.

`one global transaction is sufficient for coherence but not universally necessary`.

`coherence can be established by a qualified causal/freshness cut plus compatibility constraints, without requiring a universal PDP or global revision`.

## 2. Evidence reviewed

Primary documentation, papers and mature systems used as benchmarks:

- Google Zanzibar provides externally consistent ACL updates and snapshot reads with bounded staleness. Its zookie protocol carries a causal freshness floor: application content versions store a zookie, and later authorization checks must use an ACL snapshot at least as fresh. This prevents a new content version from being checked against an ACL state causally older than the content change. Source: Google, *Zanzibar: Google’s Consistent, Global Authorization System*, USENIX ATC 2019: <https://research.google/pubs/zanzibar-googles-consistent-global-authorization-system/>.
- SpiceDB exposes `minimize_latency`, `at_least_as_fresh`, `at_exact_snapshot`, and `fully_consistent` consistency modes using ZedTokens. `at_exact_snapshot` pins one datastore snapshot; `at_least_as_fresh` establishes a floor while allowing newer data. Exact snapshots can expire as datastore history is garbage-collected. Source: <https://authzed.com/docs/spicedb/concepts/consistency>.
- OpenFGA exposes `MINIMIZE_LATENCY` and `HIGHER_CONSISTENCY`. With caching enabled, minimize-latency checks can omit a recent tuple change; higher-consistency bypasses cache and reads the database. Its documentation also notes that multi-region eventually consistent databases may retain replication lag even when cache is bypassed. Sources: <https://openfga.dev/docs/interacting/consistency> and <https://openfga.dev/docs/getting-started/setup-openfga/configure-openfga>.
- OpenFGA authorization models are immutable and versioned. The project recommends explicitly pinning `authorization_model_id`; omitting it uses the latest model. Complex model migrations may require coordinated application and tuple migration. Source: <https://openfga.dev/docs/getting-started/immutable-models>.
- Cedar authorization evaluates policies together with request principal/action/resource/context and relevant entity data. Cedar explicitly places responsibility on the application to supply all relevant entity data; level validation exists to constrain what data policies can require. Sources: <https://docs.cedarpolicy.com/auth/authorization.html> and <https://docs.cedarpolicy.com/policies/level-validation.html>.

These are benchmarks, not selections. Zanzibar/SpiceDB demonstrate a coherent single authorization-datastore snapshot model; OpenFGA demonstrates explicit cache/consistency and model-version trade-offs; Cedar demonstrates that policy evaluation may consume application-supplied entity/context data outside the policy artifact itself. None proves that all G4 dependency planes should be centralized in one datastore.

## 3. Material findings

### 3.1 Freshness and coherence are different properties

Suppose a decision depends on policy `P`, attribute set `A`, delegation floor `F`, schema `S`, and evaluator semantics `E`.

A vector such as:

`P@p8 + A@a11 + F@f4 + S@s3 + E@e2`

can contain individually current artifacts while never having been a valid composed state. For example, `P@p8` may have been authored against `S@s2`, while `A@a11` was published only after `F@f5` revoked the source lineage accepted by `p8`.

`fresh components != coherent composition`.

The proof obligation is therefore not merely "is every input fresh enough?" but "is this combination admitted by the declared cross-plane compatibility/causal contract?"

### 3.2 Torn decision snapshot is a semantic anomaly

Candidate term:

`TornDecisionSnapshot` = an evaluation input set whose members are individually readable/valid but whose combination lacks evidence that it represents an admissible semantic cut for the protected invariant.

A torn snapshot can produce either false Allow or false Deny. Security-sensitive systems must not normalize the former to availability and must not mislabel the latter as current authoritative truth.

### 3.3 One datastore snapshot solves only the planes inside that datastore

Zanzibar and SpiceDB show the value of evaluating relationship data at a named snapshot/freshness floor. But a G4 decision may also depend on external classification, tenant state, jurisdiction, emergency state, provider capability or business attributes maintained elsewhere.

`authorization-store snapshot coherent != all external decision inputs coherent`.

A local snapshot token cannot silently claim coverage over planes it does not govern.

### 3.4 Causal freshness floors are weaker than exact global snapshots but often sufficient

Zanzibar's zookie pattern demonstrates that a caller can preserve a causal relation without forcing every check to execute at the globally newest state. SpiceDB similarly distinguishes `at_least_as_fresh` from `at_exact_snapshot`.

Candidate G4 principle:

`protected decision requires the weakest declared consistency relation sufficient for its invariant, not maximum global freshness by default`.

For many decisions, it is enough to prove that every relevant plane is no older than a causally required frontier and that their generations are mutually compatible. Exact simultaneity is unnecessary when updates commute or compatibility is declared.

### 3.5 "Latest of each" can be less coherent than an older qualified cut

Fetching the newest policy, newest attributes and newest floor independently can create a combination never validated together. A slightly older but explicitly compatible cut can be safer.

`newest-vector dominance != semantic validity`.

This argues against adapters that automatically resolve every dependency to `latest` during evaluation.

### 3.6 Cache bypass does not prove coherence

OpenFGA's higher-consistency mode is useful evidence: bypassing a query cache can improve read freshness, but documentation notes that underlying multi-region replication may still be eventually consistent depending on the datastore. More generally, even a perfectly current policy-store read says nothing about an independently cached attribute plane.

`cache miss/current DB read != cross-plane coherent cut`.

### 3.7 Model/schema/evaluator generation belongs in the cut

OpenFGA recommends pinning an immutable authorization model ID. Cedar evaluates supplied entity/context data according to policy semantics and schema expectations. A decision proof therefore needs semantic-generation identity where it can affect interpretation.

`same facts under different model/evaluator semantics != same decision input`.

A cross-plane cut that names data generations but omits the model/schema/evaluator generation is incomplete when those semantics are mutable.

### 3.8 Compatibility edges can replace global revision numbers

G4 does not need a synthetic `GlobalPolicyRevision=42`. Independently administered planes can expose qualified relations such as:

- `P@p8 requires S >= s3`;
- `P@p8 accepts AttributeProfile ap2..ap4`;
- `A@a11 issued-under DelegationFloor >= f5`;
- `E@e2 interprets ContractSemantics c7`;
- `DecisionInvariant X requires F >= f5`.

A decision is coherent when the material dependency graph admits the selected generation vector and required causal/currentness floors are satisfied.

`coherence proof != global revision identity`.

### 3.9 Coherence is invariant-scoped

Two planes may update independently without affecting invariant X. Their lack of a common transaction should not invalidate unrelated decisions.

`cross-plane update occurred != every decision cut invalid`.

Selective requalification follows the material dependency cut already established by G4: only dependencies capable of changing the protected conclusion belong to the coherence proof.

### 3.10 Unknown compatibility must not become implicit compatibility

If the evaluator cannot establish whether `P@p8` is valid with `A@a11`, the safe semantic state is not automatically Deny or Allow. Depending on the capability contract it may be `UNKNOWN`, `DEFER`, quarantine, or a separately declared degraded behavior.

`compatibility not proven != incompatibility proven`.

`compatibility not proven != permission to guess`.

### 3.11 Negative facts need the same snapshot discipline

Absence claims such as "user is not in group G", "resource has no classification", or "no emergency overlay applies" can be especially dangerous when read from a different generation than positive policy inputs.

`absence in A@a9 + policy from P@p12 != qualified negative fact unless the cut admits that pairing`.

This extends G4's closed-world discipline: a missing attribute cannot be converted into a default merely because one plane returned no value.

### 3.12 Update protocols can publish compatibility before/with activation

A technology-independent rollout can avoid a global transaction by separating preparation from admissibility:

1. publish immutable successor artifacts;
2. validate/qualify cross-plane compatibility;
3. publish a monotonic admissibility/floor relation;
4. allow evaluators to use the successor cut;
5. later retire predecessor cuts according to residual-horizon rules.

This resembles generation handoff rather than distributed two-phase commit. It does not guarantee atomic business effects; it establishes which decision generations may be composed.

### 3.13 Mixed-generation operation is not automatically degraded

A mixed vector is legitimate if its compatibility relation is explicit and the required causal floors are satisfied. Rolling upgrades therefore need not force lockstep versions.

`mixed generation != torn generation`.

This is important for autonomous client runtimes and multi-provider portability.

### 3.14 Offline runtime requires a bounded coherent proof bundle

An offline runtime may retain an immutable coherent cut and historical interpretation evidence. It may continue new protected effects only while the declared currentness/security horizons remain satisfied.

`coherent snapshot at t0 != perpetual authority at tN`.

Learning a newer monotonic floor can make an old cut inadmissible even if the runtime cannot yet acquire a complete successor cut; the correct result can remain `UNKNOWN/DEFER`.

### 3.15 Decision snapshot identity is evidence, not business truth

A candidate `DecisionSnapshotRef` can identify the qualified composition used for a decision. It must not become a shared business entity or canonical copy of domain data. Policy/attribute owners remain authoritative for their domains.

`snapshot evidence != shared database`.

### 3.16 Exchange Plane boundary

The logical Exchange Plane may transport generation refs, causal/currentness floors, compatibility evidence and decision-snapshot lineage; enforce declared minimum floors; and preserve unknown/torn dispositions.

It must not choose which business attributes are true, invent compatibility between independently versioned planes, or require every capability to use one centralized policy/attribute store.

`exchange coherence semantics != centralized policy ownership`.

### 3.17 Shared Semantic Kernel boundary

Potential structural primitives remain narrow: immutable generation refs, qualified causal/freshness floors, compatibility relations, snapshot/proof refs, provenance/currentness and partial/unknown disposition. Policy entities, tenant records, jurisdiction models and provider-specific tokens remain outside the shared kernel.

`shared cut vocabulary != shared policy model`.

## 4. Candidate coherence profiles

Research vocabulary only; not an authorized enum or API:

- `EXACT_SNAPSHOT` — all covered dependencies are evaluated at one named snapshot governed by a system that can prove that property.
- `AT_LEAST_CAUSAL_FLOOR` — dependencies may be newer than the required frontier, provided newer generations remain compatible.
- `COMPATIBILITY_QUALIFIED_VECTOR` — independently versioned generations are admitted by explicit compatibility relations and currentness floors.
- `BOUNDED_STALE_CUT` — a declared staleness window is acceptable for the named invariant.
- `TORN_OR_UNPROVEN` — the composition cannot be proven coherent; protected action follows declared unknown/defer behavior.

No profile is universally superior. Selection belongs to the capability/invariant contract.

## 5. Candidate vocabulary

- `DecisionSnapshotRef` — immutable evidence reference identifying the generation vector and coherence profile used by a decision.
- `DecisionGenerationVectorRef` — refs to materially relevant policy, attribute, delegation, schema, semantic/evaluator and applicability generations.
- `CausalFloorRef` — lower bound that a covered dependency must meet for a decision.
- `CrossPlaneCompatibilityRef` — qualified evidence that named generations/profiles may be composed for a declared invariant.
- `DecisionCoherenceProfileRef` — contract reference describing required snapshot/freshness semantics.
- `TornDecisionEvidenceRef` — evidence that required cross-plane coherence could not be established.
- `SnapshotCoverageRef` — explicit declaration of which dependency planes a snapshot/freshness token governs.

These are research candidates, not schemas.

## 6. Candidate proof obligations

1. Every protected decision identifies the material dependency planes whose generations can alter its conclusion.
2. Individually valid/fresh inputs are not treated as sufficient proof of cross-plane coherence.
3. Snapshot/freshness tokens declare or imply a bounded coverage domain; they are not extended to external planes by assumption.
4. `latest` is not treated as a semantic compatibility relation.
5. A decision using independently versioned planes carries enough generation lineage to reproduce which semantic cut was evaluated.
6. Policy/model/schema/evaluator generation is included where interpretation can change.
7. Attribute/entity generation and authority/currentness are included where applicability or conclusion can change.
8. Delegation/revocation floors are checked independently from ordinary cache TTL.
9. A causal floor is accepted only for dependencies it actually orders or constrains.
10. `at_least_as_fresh` semantics do not imply exact-snapshot semantics.
11. Exact snapshot claims are made only where the underlying mechanism proves them.
12. Cache bypass is not treated as proof of cross-plane atomicity.
13. Replication lag remains representable even after a cache bypass where the datastore contract permits it.
14. Negative/absence facts require qualified source closure and cut coherence rather than default inference.
15. Cross-plane compatibility is explicit or derivable from a declared contract; unknown compatibility remains unknown.
16. Compatibility evidence is invariant/scope-qualified rather than globally asserted.
17. A newer generation can invalidate an older cut without rewriting historical decisions made under that cut.
18. Historical decisions retain the exact generation vector/coherence evidence actually used.
19. Rolling upgrades may use mixed generations only when their compatibility is proven.
20. Re-parenting/revocation does not restamp old attribute/policy evidence into a successor cut.
21. Learned monotonic security/delegation floors survive restart/restore according to qualified recovery semantics.
22. Offline runtimes may reuse coherent cuts only within declared currentness/security horizons.
23. Failure to obtain a successor cut does not authorize continued use of a known-below-floor predecessor cut.
24. `UNKNOWN/DEFER` remains representable when a coherent cut cannot be established.
25. Stale Deny is not mislabeled as current authoritative Deny merely because it is fail-safe.
26. Stale Allow is not permitted to commit a protected effect merely because each cached input remains within its local TTL.
27. A decision-snapshot mechanism does not become canonical owner of policy or business attributes.
28. Exchange Plane does not invent cross-plane compatibility or business defaults.
29. Driver/adapter/provider claims cannot exceed the consistency/coherence guarantees of their mechanisms.
30. Local/in-process optimization preserves the same coherence obligations as remote evaluation.
31. Bypass paths capable of protected commitment are covered by the same required coherence/floor invariant or explicitly excluded from the guarantee.
32. AI may identify likely torn cuts or missing lineage but cannot promote unproven composition to authoritative coherence.

## 7. Adversarial cases

1. Policy cache has `P@p10`; attribute cache has `A@a7`; both TTL-valid, but `P@p10` requires attribute profile introduced at `a9`.
2. Attribute plane returns newest `classification=PUBLIC` while delegation floor read is older and still authorizes the now-revoked issuer.
3. Evaluator loads latest schema while using policy compiled under an incompatible predecessor schema.
4. `HIGHER_CONSISTENCY` bypasses policy cache but attribute service still serves a stale replica.
5. A multi-region datastore bypasses application cache yet returns an eventually consistent replica result; adapter labels it `strong`.
6. Zanzibar/SpiceDB-like token is used to claim freshness for an external jurisdiction service outside token coverage.
7. Evaluator resolves every plane to `latest`, producing a vector never validated together.
8. Exact authorization-store snapshot is combined with request context captured before an emergency state transition.
9. Missing group membership from an older entity snapshot is interpreted as authoritative non-membership against a newer forbid policy.
10. New model ID is activated before required tuple/entity migration completes.
11. Old model + new tuples is accepted because both parse successfully.
12. New evaluator semantic generation changes predicate meaning while snapshot ref records only data versions.
13. Compatibility registry is stale and approves a generation pair explicitly revoked by a newer floor.
14. Compatibility evidence is treated as global although it was proven only for invariant X.
15. Runtime restores an old coherent cut after learning a newer revocation floor.
16. Offline runtime keeps using a once-coherent cut indefinitely because no newer cut is reachable.
17. Mixed-generation rollout is rejected wholesale despite explicit compatibility, causing unnecessary lockstep coupling.
18. Conversely, every mixed generation is accepted merely because rolling upgrades are expected.
19. Gateway converts `TORN_OR_UNPROVEN` to Deny and records it as current business policy rather than degraded safety behavior.
20. Gateway converts `TORN_OR_UNPROVEN` to Allow to preserve availability.
21. Adapter restamps an old attribute value with the fetch time rather than preserving observation/source generation.
22. Local in-process call reads policy and attributes from mutable objects at different instants while remote path uses snapshot tokens; both advertise the same contract.
23. Decision cache key omits schema/evaluator generation and reuses an old result after semantics change.
24. Decision cache key includes policy revision but omits attribute generation.
25. A causal floor from plane A is numerically compared to an unrelated revision from plane B.
26. Wall-clock timestamps from independent sources are treated as a globally ordered snapshot without clock/ordering contract.
27. Two individually signed snapshots are assumed mutually compatible solely because signatures validate.
28. An emergency overlay arrives after the base policy read but before commitment; contract requires current emergency state yet no commitment-adjacent floor check occurs.
29. Compatibility metadata is deleted during compaction while historical decision proof still depends on it.
30. Garbage collection removes an exact snapshot needed for a retry, and the retry silently substitutes latest state while retaining the old decision identity.
31. One capability publishes a synthetic global revision and downstream systems infer that every external attribute source participated in it.
32. AI fills a missing generation relation with the most plausible adjacent version and marks the cut coherent.

## 8. Trade-offs and portability

### Global transaction

Strong and conceptually simple when all material inputs share one transactional substrate, but increases coupling and is unavailable across autonomous systems/providers. It must not become the default architectural assumption.

### Exact snapshot token

Excellent for repeatability and pagination/replay within the token's coverage domain; historical retention/GC creates an operational horizon and external planes remain outside coverage.

### At-least-as-fresh causal floor

Preserves causal safety while allowing cache/replica flexibility and newer compatible state. Requires monotonic floor handling and explicit rules for whether newer generations remain compatible.

### Compatibility-qualified vector

Best fit for independently administered planes and autonomous runtimes. It avoids synthetic global revisions but increases proof/evidence complexity and requires dependency closure plus explicit unknown behavior.

### Bounded stale cut

Useful for low-risk/read-only invariants and degraded operation. Unsafe as a universal authorization default; staleness budget must be named and observable.

Portability rule:

`semantic coherence contract -> provider-specific consistency mechanism`.

A provider may realize a profile with MVCC snapshot, opaque token, generation vector, transactional read, causal token, revision fence or another mechanism. Adapters may translate only when the promised semantics are actually supported.

## 9. Deduplication against existing G4 research

This document does not reopen:

- generic policy/attribute source completeness;
- delegated source revocation and residual decision horizon;
- precedence-proof evolution;
- semantic-generation handoff;
- generic cache invalidation;
- generic temporal semantics;
- settlement/effect atomicity;
- authority re-parenting.

Material delta:

`independently cached policy/attribute/delegation/evaluator planes -> individually fresh but potentially torn composition -> snapshot coverage + causal floors + compatibility-qualified generation vector -> explicit coherent/mixed/torn distinction -> bounded offline reuse without global policy transaction or central PDP`.

## 10. Maturity and next gap

State: `RESEARCH_ACTIVE / NON_EXECUTABLE`.

This closes the first-order question of what constitutes a coherent mixed-generation decision snapshot without requiring a global transaction. The front is not saturated.

Highest-value next gap: **commitment-time coherence drift**. A decision snapshot can be coherent when evaluated, then a material floor/emergency/authority dependency can advance before the protected effect commits. Research must distinguish decision-time validity from effect-time admissibility, determine when a decision lease is safe, and when a commitment-adjacent recheck/fence is mandatory, without forcing every operation into synchronous global authorization.