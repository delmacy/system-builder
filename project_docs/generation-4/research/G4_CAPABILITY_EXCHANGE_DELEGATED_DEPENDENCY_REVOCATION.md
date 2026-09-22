# G4 Capability Exchange — Delegated Dependency Source Revocation

Status: `RESEARCH_ACTIVE / NON_EXECUTABLE`
Date: 2026-09-22
Family: Shared Semantic Kernel / Capability Exchange Plane / Inter-Capability Boundary Model

> Research candidate != implementation authority. This document does not select a policy engine, IAM system, registry, gateway, cache, PDP, attribute plane or revocation mechanism. It does not reopen G3 and does not authorize product work.

## 1. Research question

Prior G4 research separated dependency-cut correctness from dependency-source closure and established that source delegation must remain visible. The remaining gap is consequence closure: when authority A delegates a policy subtree or attribute domain to B, and A later revokes or re-parents B, when do policies, attributes, cached decisions, sessions and already-admitted work derived from B cease to be usable for protected decisions?

Core findings:

`delegation revoked != derived decision consequences drained`.

`source removed != cached Allow invalidated by ordinary TTL alone`.

`policy-source revocation != session revocation != admitted-work revocation`.

`attribute-source revocation != historical attribute evidence erased`.

`re-parenting B under C != old A->B lineage re-authorized`.

`hard decision revocation requires either consequence-aware invalidation/fencing or a commitment-adjacent invariant; discovery removal alone is insufficient`.

## 2. Evidence reviewed

Primary documentation and mature systems used as failure-mode benchmarks:

- Kubernetes authorization configuration supports multiple webhook authorizers, automatically reloads authorizer-chain configuration, and independently caches authorized and unauthorized webhook decisions with configurable TTLs. Match conditions and failure policy further affect participation. This demonstrates that source/configuration currentness and cached decision lifetime are distinct. <https://kubernetes.io/docs/reference/access-authn-authz/authorization/>
- AWS IAM role-session revocation is implemented by attaching an inline deny policy keyed by `aws:TokenIssueTime`; credentials issued before the revocation time become unusable while newer sessions are unaffected. AWS also notes that the CLI may retain cached credentials until expiry even though requests made with them are denied. This is a mature example of a monotonic authorization floor enforced at evaluation rather than relying on deleting every cached credential. <https://docs.aws.amazon.com/IAM/latest/UserGuide/id_roles_use_revoke-sessions.html>
- AWS IAM permissions can depend on identity policies, resource policies, permissions boundaries, session policies, SCPs and RCPs. A delegated/source-plane change therefore need not coincide with credential/session replacement. <https://docs.aws.amazon.com/IAM/latest/UserGuide/access_policies_boundaries.html> and <https://docs.aws.amazon.com/IAM/latest/UserGuide/access_policies.html>
- Kubernetes authorizer webhook caches have independent authorized/unauthorized TTLs. A cached decision can therefore outlive a source-side policy or delegation change unless the surrounding authorization mechanism provides stronger invalidation semantics. <https://kubernetes.io/docs/reference/config-api/apiserver-config.v1beta1/>

These are benchmarks only. No Kubernetes authorizer chain, AWS IAM policy composition, token-time revocation mechanism or centralized PDP is selected.

## 3. Material findings

### 3.1 Delegation authority and derived consequences are separate graphs

A delegated source relationship can be modeled conceptually as an authority edge `A -> B(scope S)`. Decisions derived from B may then materialize in caches, compiled policy, session context, admitted work and downstream obligations.

Candidate distinction:

- `DependencyDelegationGraph`: who may publish/change a dependency source for a declared scope;
- `DecisionConsequenceGraph`: which decisions, sessions, admissions and effects were derived from a source/delegation lineage.

`delegation graph closed != consequence graph drained`.

### 3.2 Revocation needs a named semantic target

"Revoke B" is underspecified. Revocation can independently mean:

- prevent B from publishing new policy/attribute generations;
- reject new decisions derived from B;
- invalidate cached decisions previously derived from B;
- prevent creation of new sessions/admissions under B-derived authority;
- terminate or constrain existing sessions;
- fence protected effects from already-admitted work;
- preserve historical evidence for audit/reconciliation.

A mechanism that achieves one target must not advertise all of them.

### 3.3 Cache TTL is freshness policy, not universal revocation proof

Kubernetes explicitly allows authorized webhook responses to be cached for a configured TTL. If the delegated source is revoked while an `Allow` remains cached, ordinary TTL validity says only that the cache entry has not expired under its cache policy.

`cache fresh by TTL != delegation lineage still authorized`.

For protected decisions, a revocation floor or dependency-generation predicate can make an otherwise unexpired cache entry inadmissible.

### 3.4 Monotonic revocation floors can avoid global cache deletion

AWS IAM role-session revocation provides a useful pattern: sessions issued before a cutoff are denied by a policy condition even though credentials may still physically exist in local caches. Generalized carefully:

`artifact still present != artifact still admissible`.

A candidate `DependencyDelegationFloorRef` can identify the minimum delegation/source generation acceptable for new protected decisions. Once a runtime has learned a stronger floor, restore/restart must not silently resurrect an older admissible generation.

This is a research abstraction, not an IAM design selection.

### 3.5 Policy-source and attribute-source revocation differ in consequence shape

A policy source normally contributes rules/combining inputs; an attribute source contributes facts used by applicability/evaluation. Revoking either can invalidate future decisions, but historical evidence must remain interpretable.

`attribute authority revoked now != historical attribute observation was fabricated`.

Historical decisions retain the authority/currentness evidence actually used. New decisions must satisfy the successor authority/currentness contract.

### 3.6 Re-parenting creates a new lineage; it does not launder old decisions

If `A -> B` is revoked and `C -> B` is later authorized, B may become a legitimate source again for new decisions. Cached decisions or admitted work derived under A do not thereby acquire C lineage.

`same source identity + new parent != old decision re-authorized`.

Explicit requalification/re-admission is required when old work must proceed under the successor lineage.

### 3.7 Source revocation and session revocation are independent

AWS IAM's explicit session-revocation mechanism is evidence that changing source/role configuration and invalidating already-issued session authority are distinct operations.

`source delegation revoked != issued session necessarily unusable`.

A G4 contract therefore needs to state whether session/admission authority is snapshot, continuously revalidated, floor-checked at effect time, or otherwise qualified. The Exchange Plane must not infer one model from another.

### 3.8 Cached Deny has symmetric availability consequences

Revocation research must not focus only on stale `Allow`. Kubernetes supports caching unauthorized decisions too. Re-parenting or restoration of authority can leave a stale `Deny` that blocks newly legitimate work.

`security-safe stale Deny != semantically current decision`.

For safety-sensitive effects this may be fail-safe, but it is still an availability/currentness failure that must remain observable rather than being mislabeled as current policy truth.

### 3.9 Revocation propagation and convergence are different

A control-plane acknowledgement that a delegation was removed does not prove every evaluator, cache, session or admission crossed the revocation frontier.

`revocation ACK != effective consequence convergence`.

A proof of hard revocation therefore needs either bounded propagation plus explicit residual horizon, or a stronger effect-side fence that prevents stale consequences from committing protected effects.

### 3.10 Commitment-adjacent fencing collapses upstream timing complexity

If every effect-capable target checks a monotonic delegation/source floor immediately before protected commitment, stale policy caches, stale attributes or sessions may continue to exist operationally without being able to authorize the protected effect.

`stale decision reachable != stale decision effect-capable`.

This preserves decentralization: no globally synchronous discovery service is required, provided bypass closure is proven.

### 3.11 Revocation cannot erase provenance

Removing B or its policy subtree from current composition must not delete the evidence that historical decision D depended on B@b7 under A->B delegation d3.

`current source set != historical source set`.

Historical proof interpretation and current admission authority are distinct queries.

### 3.12 Derived/compiled policy is itself a consequence

Adapters, gateways or evaluators may compile, normalize or materialize B's rules into another representation. Revoking B must account for these derived artifacts if they can still affect decisions.

`source deleted != compiled derivative deleted`.

A derived artifact needs provenance back to the source/delegation generation or must be fenced by a stronger currentness predicate.

### 3.13 Attribute snapshots need explicit currentness semantics

A cached attribute such as tenant, classification, jurisdiction or emergency state can remain syntactically valid after its source authority changes. New protected decisions require the contractually appropriate authority/currentness evidence.

`attribute value unchanged != attribute authority unchanged`.

Adapters must not silently restamp old values with a successor authority.

### 3.14 In-flight work needs admission-lineage preservation

Work admitted while B was authorized can be queued or retried after B is revoked. Whether it may finish depends on the declared invariant and effect-fencing model, not merely on queue age or endpoint availability.

`admitted before revocation != automatically safe to commit after revocation`.

`revoked before completion != historical admission never happened`.

The system must represent continuation, re-admission, cancellation, compensation or `UNKNOWN/DEFER` explicitly as appropriate.

### 3.15 Independent caches create a vector residual horizon

Policy cache, attribute cache, session lifetime, admission queue, compiled artifact lifetime and effect fence can have different horizons. No single TTL is automatically the end-to-end revocation guarantee.

Candidate concept:

`DecisionResidualHorizon(X)` = latest point at which a consequence derived from revoked delegation/source lineage can still influence protected invariant X, absent a stronger commitment fence.

This horizon is qualified by consequence class and invariant; it is not necessarily `max(TTLs)` or `min(TTLs)`.

### 3.16 Negative claims remain closed-world claims

A runtime cannot conclude "no B-derived decision remains" merely because B disappeared from discovery. Such a claim requires consequence closure, bounded retention evidence, or an effect-side fence that makes remaining consequences irrelevant to the protected invariant.

`source absent from discovery != consequences absent`.

### 3.17 Exchange Plane boundary

The logical Capability Exchange Plane may transport delegation lineage, source generation, floors, currentness and revocation evidence; reject evidence below declared floors; and preserve `UNKNOWN/CONTESTED` when convergence is unproven.

It must not become canonical owner of policy/attribute business semantics, decide whether old work should be commercially compensated, or fabricate successor authority for stale evidence.

`exchange revocation semantics != business revocation ownership`.

### 3.18 Shared Semantic Kernel boundary

Potential structural primitives remain narrow: source/delegation refs, immutable generation, provenance, currentness, qualified scope, revocation/floor refs, decision/admission lineage and evidence relations. Domain policy entities and provider-specific session objects remain outside the shared kernel.

`shared revocation vocabulary != shared policy database`.

## 4. Candidate vocabulary

Research vocabulary only:

- `DependencyDelegationRef` — immutable qualified delegation allowing a source to manage a dependency scope.
- `DependencyDelegationGenerationRef` — generation of that delegation relationship.
- `DependencyDelegationFloorRef` — monotonic minimum delegation/source generation acceptable for a protected decision.
- `DecisionLineageRef` — provenance linking a decision to source, delegation, applicability and semantic generations.
- `DecisionConsequenceRef` — reference to a cache/session/admission/derived artifact influenced by a decision lineage.
- `DecisionResidualHorizonRef` — evidence describing the bounded residual influence horizon for a protected invariant.
- `DecisionRevocationEvidenceRef` — qualified evidence that a delegation/source generation is no longer admissible for a declared scope.
- `DecisionConsequenceClosureRef` — evidence that material consequences are drained, invalidated, fenced or otherwise unable to affect a named invariant.
- `DerivedPolicyArtifactRef` — non-canonical compiled/normalized derivative retaining source provenance.

These are candidates, not authorized schemas.

## 5. Candidate proof obligations

1. Delegation/source revocation is distinguished from consequence closure.
2. Revocation declares which semantic targets it affects: publication, new decision, cache, session, admission, effect or historical interpretation.
3. Cached decisions preserve the source/delegation generation under which they were produced.
4. Ordinary cache TTL is not treated as proof that delegation authority remains valid.
5. A learned stronger revocation/delegation floor is monotonic across restart/restore unless qualified recovery semantics explicitly supersede it.
6. Policy-source and attribute-source authority/currentness are independently representable where materially distinct.
7. Historical attribute/policy evidence is preserved after current authority is revoked.
8. Re-parenting creates a successor lineage rather than rewriting predecessor lineage.
9. Same source identity does not imply same authority lineage.
10. Source revocation does not imply issued sessions or admissions are revoked unless the contract states and proves that coupling.
11. Session revocation does not erase historical decisions made while the session was valid.
12. Stale Deny remains distinguishable from current authoritative Deny.
13. Control-plane revocation ACK is not treated as proof of evaluator/cache/session convergence.
14. Hard revocation claims include a residual-horizon or stronger commitment-fence proof.
15. Commitment-adjacent floors are accepted only when every effect-capable path is inside the fence or explicitly outside the invariant claim.
16. Derived/compiled policy artifacts retain provenance to the source/delegation generation or are otherwise fenced from protected effects.
17. Attribute caches preserve authority/currentness provenance; adapters do not restamp stale values as successor-authority observations.
18. In-flight work preserves admission lineage across queueing, retry and provider rebinding.
19. Revoked predecessor work is not silently re-admitted under successor authority.
20. Decision residual horizon is qualified by invariant and consequence class rather than represented as an unqualified scalar TTL.
21. Negative claims that no stale consequences remain require closed-world consequence evidence or an effect-side fence.
22. Removing a source from discovery does not delete historical provenance or audit evidence.
23. Provider/driver/adapter layers do not claim revocation semantics stronger than the underlying mechanism supports.
24. Interface compatibility across old/new sources does not imply revocation or authority-lineage equivalence.
25. `Allow`, `Deny`, `NoOpinion`, `Unknown` and `Contested` currentness remain distinguishable from transport/cache status.
26. Partial revocation/convergence remains representable without false success.
27. Offline runtimes can interpret historical proofs without live central discovery.
28. Offline runtimes do not use known-below-floor evidence for new protected effects merely because the original TTL remains valid.
29. Recovery does not resurrect revoked source authority through an older cache/snapshot generation.
30. Exchange Plane transports and verifies structural revocation evidence without becoming business policy owner.
31. Shared Semantic Kernel contains structural lineage/currentness primitives only, not delegated business policy entities.
32. AI may surface suspected stale lineage but cannot invent revocation completion or successor authority.

## 6. Adversarial cases

1. A revokes `A->B`; an unexpired cached `Allow(B@b7)` still authorizes a protected effect.
2. B disappears from discovery, but compiled B policy remains loaded in an evaluator.
3. Policy cache is invalidated while an attribute cache from B remains and changes applicability.
4. Attribute cache is cleared while a session created under B-derived authorization remains effect-capable.
5. B is re-parented under C and old A-derived cache entries are relabeled as C-derived.
6. Same source ID is reused after re-parenting and lineage is lost.
7. Revocation ACK is returned before remote evaluators receive the new floor.
8. Runtime restarts from snapshot predating the learned revocation floor.
9. Authorized webhook result remains cached beyond delegation removal.
10. Unauthorized result remains cached after legitimate re-parenting and causes unexplained outage.
11. Driver exposes `revoke=true` although it only removed B from discovery.
12. Adapter translates source removal into `all sessions revoked` without evidence.
13. Queue releases work admitted under B after B is revoked; effect target performs no current floor check.
14. Retry obtains a new credential and silently launders old admission lineage.
15. Emergency local endpoint bypasses the commitment-adjacent revocation gate.
16. Legacy batch import bypasses policy evaluation and commits an effect from stale lineage.
17. Policy text is copied from B into another store without provenance; B revocation cannot identify the derivative.
18. Attribute value is unchanged, so adapter silently assigns successor authority C to an observation originally made by B.
19. A revokes B only for tenant T1; global invalidation incorrectly removes valid T2 decisions.
20. Revocation scope excludes historical interpretation but audit replay treats old proof as invalid at its original time.
21. Source revocation is interpreted as evidence that historical business effect never occurred.
22. One evaluator has new floor while another accepts old generation; interface responses are normalized to the same `Allow`.
23. Policy cache TTL is 5m, attribute TTL 30m, session 1h; system reports `revoked in 5m`.
24. System chooses `max(TTLs)` as residual horizon although a target fence would make stale artifacts effect-ineligible immediately.
25. System chooses `min(TTLs)` although a long-lived session can still commit the effect.
26. Control plane is unavailable; runtime treats inability to refresh as proof B remains authorized.
27. Control plane is unavailable; runtime treats inability to refresh as proof B is revoked, breaking bounded offline policy.
28. Revocation is scoped to new admissions but implementation terminates settlement/reconciliation needed for already-committed effects.
29. Revocation is scoped to publication only but UI reports all B-derived effects fenced.
30. Re-parenting creates C->B while old A->B decision evidence is still in a dedup/retry store and gets overwritten.
31. Gateway stores canonical policy state to implement revocation and becomes accidental business authority.
32. AI sees B absent from discovery and concludes no B-derived consequence remains.

## 7. Portability and exit path

The hypothesis is implementation-independent. A realization may use generation numbers, signed manifests, revocation cutoffs, cache tags, policy epochs, short-lived leases, target-side fences, session predicates or other mechanisms. Portability requires preserving the semantic claims: source/delegation lineage, scope, currentness, revocation floor, residual consequence status and proof strength.

Migration between policy/attribute technologies must not silently strengthen a weak mechanism. A provider that cannot invalidate or fence stale consequences must expose that limitation as a residual horizon/`UNKNOWN`, not claim equivalence with a provider offering immediate effect-side revocation.

## 8. Deduplication against existing G4 research

This document does not reopen generic membership revocation, transitive membership residual horizon, authority re-parenting, precedence-proof evolution, dependency-source closure, generic retry/idempotency, settlement or provider rollout. Its material delta is specifically:

`dependency-source closure -> delegated policy/attribute authority -> delegation revoked/re-parented -> independently cached policy/attribute/decision/session consequences -> monotonic revocation floors + residual decision horizon -> consequence closure or commitment-adjacent fencing without central synchronous discovery`.

## 9. Maturity and next gap

State: `RESEARCH_ACTIVE / NON_EXECUTABLE`.

Material delta exists; the front is not saturated.

Next high-value gap: **cross-plane atomicity and torn decision snapshots** — when policy rules, applicability attributes, delegation floors and evaluator semantics are refreshed independently, determine what constitutes a coherent decision snapshot and when mixed-generation inputs are safe, incompatible or `UNKNOWN`, without requiring a globally atomic policy+attribute transaction or one central PDP.
