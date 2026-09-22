# G4 Capability Exchange — Precedence Dependency Closure and Completeness

Status: `RESEARCH_ACTIVE / NON_EXECUTABLE`
Date: 2026-09-22
Family: Shared Semantic Kernel / Capability Exchange Plane / Inter-Capability Boundary Model

> Research candidate != implementation authority. This document does not select a policy engine, IAM system, registry, gateway, broker, dependency graph, central PDP or adjudicator. It does not reopen G3 and does not authorize product work.

## 1. Research question

Prior G4 research established that a precedence decision has a material proof cut rather than one scalar policy version, and that authority rules, applicability rules, combining semantics, schemas and evaluator semantics can evolve independently. The remaining high-value gap is completeness: how can a runtime justify that it has accounted for every independently managed dependency capable of changing a protected conclusion, without requiring one global policy registry and without turning "I did not discover another dependency" into proof that none exists?

Core findings:

`known dependency set != complete dependency set`.

`all fetched policies current != all decision-affecting authorities accounted for`.

`dependency closure requires ownership/source closure or a qualified enforcement-boundary invariant`.

`absence from discovery != non-applicability`.

`complete output snapshot can substitute for producer enumeration only when snapshot completeness itself is proven for the protected scope`.

`dependency closure is scoped to a named decision/invariant; it is not a universal platform inventory`.

## 2. Evidence reviewed

Primary documentation and mature systems used as failure-mode benchmarks:

- Kubernetes authorization supports an ordered chain of multiple authorizers, including multiple webhooks when AuthorizationConfiguration is used. Individual webhook results may be cached with separately configured authorized and unauthorized TTLs, and CEL match conditions can determine whether a request is dispatched to an authorizer. The effective decision universe therefore depends on chain configuration, match conditions, failure policy and cached authorizer outputs, not merely on the policies returned by one webhook. <https://kubernetes.io/docs/reference/access-authn-authz/authorization/>
- AWS IAM documents several independently attached policy families that can affect one request: identity policies, resource policies, permissions boundaries, session policies, Organizations SCPs and RCPs. Their composition is not uniform union: some are intersections/guardrails, resource policies have principal-sensitive behavior, and explicit deny has special precedence. <https://docs.aws.amazon.com/IAM/latest/UserGuide/reference_policies_evaluation-logic.html>
- AWS permissions-boundary documentation is a concrete counterexample to discovering only policies attached to the principal: effective permissions may also depend on resource policy, boundary, SCP/RCP and session policy. <https://docs.aws.amazon.com/IAM/latest/UserGuide/access_policies_boundaries.html>
- OPA bundles support policy/data from multiple sources. Bundle manifests can declare owned `roots`; multiple-source operation has no ordering guarantee for which bundle loads first, conflicting roots can put OPA into an error state, and OPA recommends central aggregation when feasible. A bundle with no roots defaults to owning all policy/data. <https://www.openpolicyagent.org/docs/management-bundles>
- OPA discovery bundles can dynamically generate the configuration that determines which policy bundles and services an OPA instance subsequently uses. This is a useful example of a dependency source whose output controls discovery of further dependencies. <https://www.openpolicyagent.org/docs/management-discovery>
- OPA Control Plane documents global/hierarchical policies and bundle construction from multiple sources, while its concepts documentation requires non-overlapping package ownership for included sources and explicit conflict-resolution composition for stack/bundle decisions. <https://www.openpolicyagent.org/docs/ocp> and <https://www.openpolicyagent.org/docs/ocp/concepts>
- Cedar schemas define action applicability and request context shape for validation; Cedar evaluates requests from the supplied policies/entities/context. This reinforces that policy text alone is not the complete decision input and that context/entity-source completeness can be material. <https://docs.cedarpolicy.com/schema/json-schema.html> and <https://docs.cedarpolicy.com/>

These are benchmarks only. No Kubernetes authorizer chain, AWS IAM composition model, OPA bundle topology, Cedar schema model or centralized registry is selected.

## 3. Material findings

### 3.1 Proof-cut correctness and proof-cut completeness are distinct

A precedence proof may correctly list every dependency it knows and still be unsafe if an unaccounted source can inject another applicable rule, attribute, exception or combining relation.

`correct composition(known inputs) != correct effective decision`.

Candidate distinction:

- `DependencyCutCorrectness`: the recorded inputs and composition faithfully produce the recorded conclusion;
- `DependencySourceClosure`: every authority/source capable of introducing a material input for the protected scope is accounted for, fenced, or rendered irrelevant by a stronger boundary invariant.

Both are needed for a strong completeness claim.

### 3.2 Dependency sources are broader than policy documents

Decision-affecting sources can include authority rules, applicability maps, templates/managed policies, group/role membership, resource policies, session constraints, jurisdiction maps, external attributes, emergency overlays, schema/semantic profiles, combining policies, discovery configuration and evaluator generation.

AWS IAM demonstrates that policies attached to different objects and administrative domains participate in one effective authorization result. Kubernetes demonstrates that the authorizer chain itself determines which independent decision sources participate. OPA discovery demonstrates that configuration can determine which later policy sources even exist from the evaluator's perspective.

`policy inventory complete != dependency-source inventory complete`.

### 3.3 Discovery configuration is itself a material dependency

If a discovery document/configuration decides which bundles, webhooks, policy stores or attribute sources are consulted, then proving all discovered leaves while omitting the discovery authority is circular.

`all leaves returned by D observed != D is the only authority allowed to introduce leaves`.

Candidate rule:

`source completeness cannot be established solely by the source whose completeness is being asserted`.

A closure proof needs an independently qualified root of discovery authority, a complete authoritative snapshot contract, or a target-side invariant that makes omitted upstream sources unable to change the protected effect.

### 3.4 Output closure and authority closure are alternative proof strategies, not synonyms

Two implementation-independent strategies emerge:

1. **Output closure** — a source provides a complete, authoritative snapshot for a declared scope, and the completeness semantics of that snapshot are themselves proven.
2. **Authority closure** — the verifier accounts for every authority/source allowed to introduce or alter dependencies for that scope, including delegation and emergency paths.

A complete snapshot can avoid enumerating every producer only if the snapshot contract truly closes the world for that scope.

`authoritative snapshot != complete snapshot by implication`.

Conversely, enumerating producers is insufficient if their merge/combining semantics or indirect dependencies remain unknown.

### 3.5 Namespace/root ownership is useful but not universal semantic ownership

OPA bundle `roots` are a mature example of explicit source ownership over portions of a policy/data namespace. Non-overlap helps prevent accidental overwrite and ambiguous source control. But namespace ownership alone does not prove business precedence or applicability.

`namespace owner != business authority owner`.

G4 can reuse the principle—declare bounded source scope—without importing OPA's namespace or assuming one source per semantic concern.

### 3.6 Multiple independently managed sources require composition-source closure

AWS IAM shows that an effective result can depend on identity, resource, boundary, session and organization-level policy families. Kubernetes can chain multiple authorizers. Therefore a proof that fetched one policy family cannot claim effective-decision completeness merely because that family is internally complete.

Candidate obligation:

`for invariant X, enumerate or otherwise close every source class that can change X's disposition`.

The closure is decision-scoped. A billing rule irrelevant to authorization X need not enter X's proof cut.

### 3.7 Applicability-source completeness is as important as rule completeness

A rule may be unchanged while group membership, resource classification, tenant mapping, jurisdiction, request context or emergency state changes whether it applies.

Cedar's schema/context model and AWS request-context evaluation illustrate this separation.

`all rules known + applicability source missing != complete decision proof`.

Applicability inputs need authority, provenance, currentness and scope qualification just as rules do.

### 3.8 External attributes create open-world risk unless their authority surface is bounded

If arbitrary external attributes can be introduced at request time, a proof cannot safely infer non-applicability from their absence unless the contract declares which attributes are authoritative, required, optional and closed for the protected decision.

`attribute absent != authoritative false`.

A missing classification, tenant, jurisdiction or emergency attribute may require `UNKNOWN/DEFER`, not silent defaulting, when it is material to the protected effect.

### 3.9 Cached decisions inherit source-closure assumptions

Kubernetes authorization webhooks may cache authorized and unauthorized results for different TTLs. A cached decision therefore preserves not just a prior answer but the source universe and applicability assumptions under which that answer was produced.

`cached Allow current by TTL != dependency closure still current`.

If a new authorizer/source becomes effect-capable or a source-closure floor advances, a cached answer can become inadmissible before its ordinary TTL expires.

### 3.10 Adding a source is a semantic change even before it emits a different rule

When a new authorizer, bundle source, managed-policy family or emergency overlay gains authority to participate, the decision universe changes immediately.

`new source capability introduced != wait until first conflicting rule to requalify`.

The source-authority generation itself is therefore a material dependency for protected conclusions.

### 3.11 Removing a source does not prove its old consequences are gone

A source removed from discovery/configuration can leave cached decisions, compiled policy, sessions, admitted work or downstream obligations. This mirrors prior G4 membership-revocation findings.

`source removed from current composition != prior source consequences drained`.

Closure for new admission and closure for in-flight/historical interpretation remain distinct.

### 3.12 Merge/combining semantics are part of closure

Knowing all sources is insufficient if the evaluator does not know whether their outputs are unioned, intersected, deny-overridden, first-applicable, priority-selected, exception-composed or otherwise combined.

OPA Control Plane explicitly models conflict resolution through a final composing policy; AWS IAM uses policy-family-specific composition; Kubernetes authorizer-chain semantics are ordered.

`source closure + unknown composition != decision closure`.

### 3.13 No global registry is required if effect-capable boundaries enforce a universal invariant

A strong decentralizing escape hatch remains available. If every path capable of committing protected effect X must present evidence satisfying a commitment-adjacent predicate, then omitted upstream policy/discovery sources cannot authorize X unless they can bypass that predicate.

`upstream dependency incompleteness may be operationally tolerated when commitment boundary closure is proven`.

This does not make upstream evidence irrelevant for explanation, availability or less-sensitive operations; it limits what incompleteness can do to the protected invariant.

### 3.14 Boundary closure itself needs bypass closure

A target-side gate is only a substitute for global dependency discovery if every effect-capable path traverses it.

`gate correct != invariant protected if bypass path exists`.

Emergency endpoints, local admin paths, direct database mutation, legacy gateways, offline batch imports and alternate providers must be either within the gate's scope or explicitly outside the invariant claim.

### 3.15 Negative dependency claims require a closed-world basis

Statements such as "no emergency overlay applies", "no higher authority exists" or "no additional resource policy can affect this request" are negative claims. They cannot be established merely by search failure.

Candidate acceptable bases include:

- authoritative complete snapshot semantics;
- bounded source ownership with independently proven source-authority closure;
- a monotonic floor/manifest declaring the allowed source classes and generations;
- a commitment boundary that renders omitted sources unable to change the protected effect.

`not discovered != proven absent`.

### 3.16 Source delegation must remain visible

A source authority may delegate management of a policy subtree, attribute domain or emergency overlay. Delegation can change without leaf policies changing.

`root source known != delegated source set fixed`.

Dependency-source closure therefore needs qualified delegation lineage where delegation can introduce material inputs.

### 3.17 Independent ownership does not require shared business ownership

A dependency-closure vocabulary can represent source refs, scope, generation, delegation, currentness and completeness evidence without moving the underlying rules into Shared Semantic Kernel or Exchange Plane ownership.

`shared closure primitives != shared policy model`.

The source authority remains local to its capability/domain.

### 3.18 Closure can be partial and named

A runtime need not claim omniscience. It can truthfully carry:

```text
closure(scope=X, dimensions={authorization, tenant, classification}) = PROVEN
closure(scope=X, dimensions={jurisdiction}) = UNKNOWN
```

If jurisdiction is material to X, new effect admission must reflect the unknown. If it is immaterial, the incomplete dimension need not block X.

`partial closure != global failure`.

### 3.19 Offline autonomy requires retained closure evidence, not live central discovery

An autonomous runtime can retain immutable source-authority manifests, dependency snapshots, floors and semantic profiles sufficient for bounded offline operation.

`runtime autonomous != runtime omniscient`.

Offline new-effect admission is safe only within the declared closure/currentness horizon. Historical proofs remain interpretable under their original closure evidence.

### 3.20 Shared Semantic Kernel and Exchange Plane boundaries

Potential Shared Semantic Kernel primitives remain structural: immutable refs, qualified scope, generation/currentness, provenance, source/delegation relation, completeness/closure evidence and conflict/unknown disposition. It must not contain provider-specific policy entities, business rules or a universal authority hierarchy.

The logical Capability Exchange Plane may transport closure evidence, reject evidence below declared floors, preserve `UNKNOWN/CONTESTED`, and route to explicitly authorized adjudication. It must not become the one registry that defines every policy source or silently infer source completeness.

`logical exchange corridor != global policy inventory`.

## 4. Candidate vocabulary

Research vocabulary only:

- `DependencySourceRef` — identity of a source capable of introducing a material decision dependency.
- `DependencySourceClassRef` — qualified source class such as authority rules, applicability, attributes, schema, combining semantics or emergency overlay.
- `DependencySourceAuthorityRef` — evidence identifying who may create/change sources for a declared scope.
- `DependencySourceGenerationRef` — immutable generation of the allowed source/delegation surface.
- `DependencyClosureRef` — evidence that a named protected decision scope has a declared degree of dependency closure.
- `OutputClosureRef` — proof that a snapshot/output is complete for a declared scope.
- `AuthorityClosureRef` — proof that all authorities able to introduce material sources for a declared scope are accounted for.
- `SourceDelegationRef` — qualified delegation by which one source authority can create/manage another source.
- `CompositionSemanticsRef` — immutable identity of merge/combining semantics for the closed source set.
- `ClosureFloorRef` — minimum acceptable source-authority/closure generation for new protected effects.
- `BypassClosureRef` — evidence that all effect-capable paths traverse the required commitment boundary.

These are vocabulary candidates, not authorized schemas.

## 5. Candidate proof obligations

1. A strong precedence proof distinguishes correctness over known dependencies from completeness of the dependency-source universe.
2. Every source class capable of changing a protected conclusion is accounted for, fenced, or proven irrelevant to that conclusion.
3. Policy-document completeness is not substituted for dependency-source completeness.
4. Discovery configuration and source-authority configuration are included when they can alter which dependencies participate.
5. A discovery source cannot prove its own exclusivity without an independently qualified closure basis.
6. Output closure is accepted only when the output contract proves completeness for the declared scope.
7. Authority closure includes delegation paths capable of introducing material sources.
8. Namespace/root ownership is not silently promoted to business semantic authority.
9. Applicability-source completeness is qualified independently from rule completeness where materially distinct.
10. External attribute absence is not interpreted as authoritative false without a closed-world contract for that attribute.
11. Tenant/classification/jurisdiction/currentness inputs preserve authority and provenance across capability boundaries.
12. Cached decisions preserve the source-closure generation under which they were produced.
13. A newly authorized decision source can invalidate dependent cached proofs before ordinary cache TTL expiry.
14. Removing a source from discovery does not erase consequences already admitted under it.
15. Composition/combining semantics are part of the closure proof, not inferred from source presence.
16. Source closure is scoped to a named invariant/decision rather than asserted globally without evidence.
17. Partial closure remains representable; unknown material dimensions remain `UNKNOWN/DEFER` rather than false success.
18. Negative claims about absent authorities/sources require an explicit closed-world basis.
19. Commitment-boundary substitution is used only when bypass closure is proven for every effect-capable path in scope.
20. Emergency/local/admin/legacy paths are included in bypass analysis or explicitly excluded from the protected claim.
21. Offline runtimes retain enough immutable closure evidence to explain historical decisions.
22. Offline possession of old closure evidence does not authorize indefinite new protected effects after a known floor advances.
23. Restore/recovery cannot roll back a learned monotonic closure floor without explicit qualified recovery semantics.
24. A source-authority generation change is material even before a newly authorized source emits a conflicting rule.
25. Source delegation changes trigger requalification of proof cuts that depended on the delegated source universe.
26. Interface/schema compatibility does not prove source-universe or composition compatibility.
27. Driver/adapter/gateway layers do not fabricate completeness when upstream discovery is partial.
28. Exchange Plane does not become canonical owner of business policies merely because it transports closure evidence.
29. Shared Semantic Kernel contains structural closure primitives only, not domain-specific policy entities.
30. AI inference may identify suspected missing dependencies but cannot assert closure or non-applicability without authority evidence.
31. Simulator/test results are qualified by the source universe and context actually represented in the simulation.
32. Cross-runtime mixed generations expose closure-generation differences rather than normalizing them to one scalar policy version.
33. A complete source set with unknown merge/precedence semantics remains insufficient for a protected conclusion.
34. A complete composition proof with an open source universe remains insufficient for a protected conclusion.
35. Provider ACK that configuration was accepted does not prove all evaluators have adopted the same source universe.
36. Client runtime autonomy remains compatible with Builder/control-plane unavailability within declared closure/currentness horizons.

## 6. Adversarial cases

1. Runtime fetches every identity policy but ignores a resource policy capable of granting access.
2. Runtime sees identity policy and boundary but misses an Organizations SCP/RCP.
3. Session policy changes effective permission but is absent from the cached proof.
4. Kubernetes adds a second authorization webhook; old cached Allow is reused until TTL despite source-universe expansion.
5. CEL match condition changes which webhook is consulted without changing that webhook's policy.
6. Webhook failure policy changes and is treated as operational-only rather than semantic.
7. OPA bundle declares one root while another independently loaded bundle can conflict with it.
8. Discovery bundle is compromised/changed and silently redirects evaluator to a different policy source.
9. All leaves returned by discovery are observed, and this is incorrectly treated as proof that discovery is exclusive.
10. OPA source is removed but compiled/cached decision remains active for admitted work.
11. New emergency overlay authority is configured but no emergency rule exists yet; proofs are not requalified.
12. External attribute provider omits `classification`; adapter normalizes absence to `PUBLIC`.
13. Jurisdiction lookup times out; gateway assumes default jurisdiction and returns Allow.
14. Tenant mapping source is stale while policy documents are fresh.
15. Managed template changes indirectly; leaf policy inventory is byte-identical.
16. Group membership changes and policy revision does not.
17. Resource owner attaches a resource policy after principal-side proof was cached.
18. Source set is complete but evaluator assumes union while contract requires intersection.
19. Sources are complete but `deny-overrides` changed to `first-applicable`.
20. Numeric source priority from one policy domain is compared with unrelated authority domain priority.
21. Runtime searches all known registries and infers that no other registry exists.
22. Source registry lists itself as the sole registry and this circular claim is accepted.
23. Target-side gate is claimed universal while legacy admin endpoint bypasses it.
24. Emergency local database mutation bypasses Exchange Plane and commitment gate.
25. One provider path enforces current closure floor while failover provider accepts older evidence.
26. Snapshot restore resurrects a source-authority manifest below a previously learned floor.
27. Offline runtime continues new high-risk effects indefinitely because its source snapshot was once complete.
28. Simulator omits one resource policy or context attribute but result is labeled effective-authority proof.
29. Schema registry says payload compatible while dependency-source universe changed.
30. Adapter knows discovery is partial but emits `complete=true` to normalize providers.
31. Gateway accumulates a canonical copy of every business policy to simplify closure and becomes a central policy monolith.
32. Shared kernel starts storing domain-specific policy entities because they are used by several capabilities.
33. AI predicts that a missing source is irrelevant and upgrades `UNKNOWN` to `ALLOW`.
34. Source delegation changes from A to B while endpoint/source identity remains stable; lineage is lost.
35. Two runtimes have identical policy bytes but different source-authority generations and are treated as semantically equivalent.
36. Control-plane ACK is used as proof that every runtime has adopted the new source set.

## 7. Portability and exit path

The hypothesis is implementation-independent. A realization may use local in-process policy, RPC policy service, OPA/Cedar-like evaluators, cloud IAM, configuration files, signed manifests, database-backed policy, brokered distribution or another mechanism.

Portability requires preserving semantic evidence independently from provider-native identifiers where possible:

- source identity and authority lineage;
- declared source scope/classes;
- source/delegation generation;
- applicability/currentness evidence;
- composition semantics identity;
- output/authority/bypass closure evidence;
- unknown/contested dimensions;
- historical proof lineage and floors.

A provider-specific `policyId`, bundle root, webhook name or IAM ARN may be carried as provider evidence but must not silently become the only portable semantic identity.

Exit path principle:

`provider-native discovery can realize closure evidence; it must not define closure semantics by accident`.

## 8. Deduplication against existing G4 research

This document does not reopen:

- generic rule-authority conflict/precedence;
- precedence-proof lifecycle/currentness;
- generic evidence caching;
- membership-source completeness;
- delegation semantic mapping;
- emergency-root conflict;
- generic provider rollout;
- settlement/finality;
- G3 canonical semantics.

The material delta is specifically:

`precedence proof cut -> independently managed dependency sources -> output closure vs source-authority closure -> applicability/attribute/discovery dependencies -> negative-claim discipline -> bypass-closed commitment boundary -> scoped/offline closure without global registry`.

## 9. Maturity and next gap

State: `RESEARCH_ACTIVE / NON_EXECUTABLE`.

This closes a material completeness gap but does not saturate the Exchange Plane vector. The next highest-value gap is **dependency-source delegation and revocation across independently cached policy/attribute planes**: when source authority A delegates a policy subtree or attribute domain to B, then revokes/reparents it while runtimes retain B's policies, attributes or cached decisions, determine the residual decision horizon and safe requalification/fencing semantics without central synchronous discovery and without confusing source removal with consequence removal.
