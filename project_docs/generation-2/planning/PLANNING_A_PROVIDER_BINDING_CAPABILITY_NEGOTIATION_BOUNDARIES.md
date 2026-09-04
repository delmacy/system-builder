# Planning A — Provider / Binding / Capability Negotiation Boundaries

Status: PASS_FOR_CAPABILITY
Phase: PLANNING_A_TAXONOMY_BOUNDARIES
Canonical capability: Provider / Binding / Capability Negotiation

This artifact defines semantic ownership and boundaries only. It makes no claim about current System Builder implementation and performs no Planning B archaeology, product code, Work Package, TASK, Construction, PR, or worker handoff.

## 1. Semantic ownership

Provider / Binding / Capability Negotiation owns the portable realization contract by which a canonical capability consumer discovers a provider, describes what that provider claims to support, qualifies those claims against required semantics and constraints, admits a provider for a bounded scope, establishes a revisioned binding, actuates through that binding, observes/reconciles provider effects, and safely substitutes, drains or withdraws the provider without converting provider-native identity or feature names into canonical truth.

It owns:

- canonical provider descriptor identity and revision, distinct from provider-native account/project/resource identifiers;
- provider discovery and registration semantics;
- capability/support-vector advertisement and evidence references;
- requirement-to-support qualification, including explicit unsupported, partial and inconclusive outcomes;
- provider admission eligibility and policy-governed admission result;
- revisioned binding identity, binding scope and consumer/provider relationship;
- provider-specific realization parameters that remain realization data rather than domain truth;
- binding currentness, validity and health evidence references;
- fallback/coexistence eligibility when multiple providers can realize the same bounded requirement;
- provider substitution, cutover, withdrawal and residual authoritative cohort drainage;
- explicit mapping from canonical request/effect identity to provider realization identity where required for reconciliation;
- effect disposition for ambiguous remote mutations and reconcile-before-retry semantics;
- support for hierarchical capability exposure, including Station-scoped provider availability, without granting authority beyond inherited policy.

Its source of truth is the revisioned provider descriptor, support-vector claim/evidence relation, qualification/admission result and revisioned binding contract. It does not own the domain semantics being realized. A storage provider does not make Provider/Binding the owner of object semantics; an identity provider does not make it the owner of identity; a workflow engine does not transfer workflow truth; a deployment provider does not transfer runtime truth.

## 2. Canonical identity versus provider realization identity

The constitutional boundary is:

`canonical subject/capability identity ≠ provider descriptor identity ≠ provider-native realization identity`.

A provider may expose account IDs, project IDs, resource IDs, tenant IDs, connection IDs, region IDs, object keys, queue names, workflow IDs, user IDs or other native identifiers. Those identifiers remain realization identities unless an explicit governed adoption transition intentionally promotes one into a canonical namespace owned by the relevant semantic capability.

Provider/Binding therefore owns mapping and lineage, not silent canonization. Import convenience, feature discovery or provider selection cannot rewrite canonical identity.

Mappings may be one-to-one, one-to-many, many-to-one, composite or absent. Ambiguity must remain explicit. A missing or stale mapping may produce `INCONCLUSIVE` or block actuation; it must not be repaired by guessing from names.

## 3. Provider descriptor and discovery

A provider descriptor expresses the provider realization surface available for qualification. It may include:

- provider kind/family and descriptor revision;
- supported protocols or adapter families;
- advertised capabilities/subcapabilities;
- support-vector dimensions and limits;
- deployment/topology/connectivity constraints;
- locality/residency/offline properties;
- lifecycle and version compatibility declarations;
- evidence endpoints or qualification artifacts;
- provider-specific configuration schema references;
- operational and failure characteristics relevant to qualification.

Discovery is not admission. Registration is not trust. Presence in a catalog, marketplace, plugin registry, environment or network does not prove semantic equivalence, current health, authority or policy eligibility.

Provider discovery must be safely repeatable and capable of representing stale, unreachable, partially described and unknown providers without coercing them into usable status.

## 4. Capability and support-vector negotiation

Feature-name matching never proves semantic equivalence. A provider claiming `storage`, `workflow`, `auth`, `events`, `backup`, `search` or any similarly broad label is insufficient to establish that the provider satisfies the consumer's required semantics.

Qualification compares a consumer requirement vector with a provider support vector. Dimensions may include, as applicable:

- semantic behavior and invariants;
- operation/failure dispositions;
- consistency, ordering or durability properties;
- scale or quota constraints;
- data locality/residency and transfer constraints;
- offline/disconnected behavior and evidence horizons;
- lifecycle/version/coexistence support;
- observability/evidence availability;
- security/trust requirements;
- privacy/governance constraints;
- recovery/rollback characteristics;
- extension points and portability limits.

Qualification outcomes must preserve at least `SUPPORTED`, `PARTIAL`, `UNSUPPORTED` and `INCONCLUSIVE` where evidence is insufficient. A scalar “compatible” flag cannot erase the multidimensional support vector.

Support claims are applicability-scoped and revisioned. Historical qualification remains replayable against its producing provider descriptor, requirement vector and evidence, but it does not automatically qualify a changed current provider or consumer requirement.

## 5. Qualification and admission

Qualification asks whether a provider can realize the required semantics under current constraints. Admission asks whether that otherwise qualified provider is allowed to be used for the requested scope.

The boundary is:

`discovered ≠ advertised ≠ qualified ≠ admitted ≠ bound ≠ effective`.

Admission may consume current authorization, governance, security, trust, privacy, economic or environment policy. Provider/Binding owns the admission result as a realization-eligibility fact but does not own those superior policies.

Admission cannot amplify authority. A provider being technically capable of an action does not grant the Person, Role, Station or automation authority to request it. Likewise, admission cannot weaken superior residency, retention, security or governance constraints merely because the provider supports an easier path.

Missing, contradictory or stale evidence yields `INCONCLUSIVE` rather than silent admission.

## 6. Binding identity, revision and scope

A provider binding is a canonical realization relationship, not merely a connection string or provider resource ID. It should identify at least:

- binding identity and revision;
- consuming canonical capability/scope;
- provider descriptor revision;
- provider-specific realization references;
- requirement/support-vector qualification reference;
- applicable admission/policy evidence;
- configuration/secret references rather than raw secret ownership;
- lifecycle state and effective horizon;
- fallback/coexistence relationships where applicable;
- mapping/reconciliation metadata needed to interpret provider effects.

Binding scope may be enterprise-wide or narrower, including Station-scoped exposure where authorized. A lower scope can specialize only within the authority and provider choices delegated by superior scopes.

A binding revision is distinct from provider resource revision and from the domain object's revision. Updating credentials, endpoint, region, adapter version, limits or provider-specific parameters may revise the binding without changing canonical domain semantics.

## 7. Provider-specific realization parameters

Provider-specific parameters are legitimate realization data but must not leak into the canonical semantic model as mandatory domain concepts merely because one provider requires them.

Examples include region names, queue/topic names, cluster/project identifiers, cloud-specific classes, engine settings, adapter options or transport-specific retry knobs. Provider/Binding owns their association to a binding; the provider adapter/realization interprets them.

Where a provider-native parameter corresponds to a universal semantic requirement, the universal requirement remains canonical and the provider parameter is its realization mapping. Where no universal semantic exists, the parameter remains provider-specific and portability tooling must surface the resulting lock-in or unsupported transition explicitly.

## 8. Actuation, acknowledgement and effective outcome

The constitutional lineage remains:

`requested → authorized → attempted → provider-accepted → applied/effective → converged → validated`.

Provider acceptance does not prove effective domain outcome. A 2xx response, accepted job, provider operation ID, resource existence or control-plane acknowledgement is evidence about a realization step, not universal proof that the owning domain capability's postcondition holds.

The domain capability owns semantic success. Provider/Binding owns realization lineage, mapping and reconciliation evidence necessary to determine whether that success can be established.

Provider-native status may therefore be evidence consumed by Workflow, Storage, Identity, Deployment, Messaging or another domain owner, but it cannot overwrite that owner's truth directly.

## 9. Ambiguous remote mutations and reconcile-before-retry

Remote provider effects can be ambiguous because of timeouts, transport loss, provider retries, asynchronous execution, stale reads or partial failure. Provider/Binding must preserve explicit effect dispositions:

- `APPLIED`;
- `NOT_APPLIED`;
- `PARTIAL`;
- `UNKNOWN`.

`UNKNOWN` mutating effects require reconcile-before-retry unless operation-specific idempotency is explicitly qualified. Retry policy cannot be inferred from HTTP verb, SDK convenience or provider marketing alone.

Reconciliation may use idempotency keys, provider operation IDs, external resource mappings, read-after-write checks, event receipts or other qualified evidence, but provider-specific mechanisms remain realization details. If reconciliation cannot establish the effect safely, the result remains `UNKNOWN` and may require human/governed escalation.

## 10. Provider health and currentness evidence

Provider health is not a timeless boolean. Provider/Binding may own a provider/binding availability or support-currentness assessment derived from qualified evidence, while Observability owns telemetry facts and domain owners retain semantic effectiveness.

Health/currentness evidence should retain:

- provider/binding subject;
- producing descriptor/adapter/binding revisions;
- observation time and validity horizon;
- capability/support-vector dimensions covered;
- region/tenant/scope where relevant;
- uncertainty and missing evidence;
- provenance of source signals.

A provider can be reachable but semantically unqualified, admitted but currently unhealthy, healthy for one capability and unsupported for another, or operational while its qualification evidence is stale. These distinctions must remain representable.

## 11. Fallback and coexistence

Fallback is a qualified realization option, not a universal guarantee. A fallback provider is eligible only where the current requirement/support vectors, authority, policy, state compatibility, data availability and operational semantics allow substitution.

Coexistence may be necessary during migration, regional operation, staged rollout or resilience. Provider/Binding owns the explicit relationship between active, candidate, fallback and draining bindings. Domain capabilities own semantic rules for dual-write, duplicate effects, in-flight work, state compatibility or conflict resolution.

Automatic failover cannot bypass admission or authority. It also cannot assume two providers are semantically interchangeable merely because both passed a coarse capability check.

## 12. Substitution, cutover and withdrawal

Provider substitution follows a governed sequence such as:

`discover candidate → qualify support → admit → prepare binding → establish coexistence where needed → validate candidate path → cut over authority/traffic/effects → reconcile state → drain residual authoritative cohorts → withdraw old binding`.

Substitution is incomplete while residual provider cohorts can still produce authoritative effects. Depending on the realized capability, residual cohorts may include sessions, credentials, workers, replicas, routes, queues, subscriptions, caches, webhooks, callbacks, scheduled jobs, in-flight workflows, pending provider operations, external mappings or clients retaining old endpoints.

Withdrawal preserves historical lineage. Removing a provider from current eligibility does not erase evidence needed to explain historical effects or reconcile residual state.

Provider replacement must preserve canonical identity whenever semantics allow. A forced change of canonical identity solely because a provider changed is a portability failure unless explicitly justified by the owning domain.

## 13. Unsupported and partial semantics

Provider/Binding must make semantic gaps visible rather than normalize them away. `PARTIAL` may mean a provider supports only certain operations, scales, regions, offline modes, ordering semantics, recovery classes, API versions, security profiles or evidence requirements.

Consumers may choose among:

- reject the provider;
- constrain the requested use to the supported subset;
- require an additional provider/capability;
- enter a policy-approved degraded mode;
- defer migration or capability exposure;
- request explicit domain-level redesign.

Provider/Binding cannot invent a shim that claims full semantic equivalence when the underlying provider cannot satisfy the requirement. Adapters can translate syntax and mechanics; they cannot manufacture absent guarantees.

## 14. Enterprise → Station → Role → Person and Station exposure

Provider availability and binding administration obey `Enterprise → Station → Role → Person` monotonic delegated authority.

Enterprise may constrain permitted provider families, trust roots, regions, commercial profiles, security/privacy requirements and capability exposure. A Station may expose only the subset of providers/capabilities delegated to it and may bind to capabilities supplied by a superior or peer-managed System Builder only under explicit authority and interoperability contracts. Role and Person scopes cannot widen the Station's provider eligibility or capability exposure.

Hierarchical SB/Station management therefore composes bindings without making a subordinate Station owner of superior provider credentials, policy or canonical provider administration unless such authority is explicitly delegated.

A provider discovered inside a Station does not become enterprise-approved merely by local reachability.

## 15. Capability boundaries

### Domain capability owners
Each domain capability owns its canonical semantics, identity, postconditions, compatibility and domain-specific failure behavior. Provider/Binding owns realization selection, qualification, binding and provider-effect reconciliation. It cannot become a semantic god-object for all provider-backed features.

### Integration & Automation
Integration owns triggers, adapters/connectors as automation interaction mechanisms, external-system action composition and automation execution semantics. Provider/Binding owns whether a provider realization is qualified/admitted/bound for a canonical capability. An integration connector may itself be realized through a provider binding but does not collapse these owners.

### Deployment / Environment / Runtime
Deployment owns desired/observed/effective runtime state, placement, rollout, readiness, traffic and runtime-provider cutover effects. Provider/Binding owns provider qualification and binding semantics used by Deployment.

### Secrets / Configuration / Environment Portability
Secrets/Configuration owns canonical references, values, overlays, currentness, rotation and environment configuration semantics. Provider/Binding references those values and owns provider-specific realization parameter association; it does not own secret material simply because a provider needs credentials.

### Identity / Authentication / Federation and Enterprise Trust / PKI
Identity owns principals/authentication/federation semantics; Enterprise Trust owns anchors, paths, certificates and trust qualification. Provider/Binding consumes their evidence for admission and actuation. An external identity provider ID or certificate-provider ID remains non-canonical unless explicitly adopted by the owning capability.

### Standards / Interoperability / API Contracts
Standards owns protocol/contract conformance, compatibility and extension/downgrade semantics. Provider/Binding consumes those conformance claims as one dimension of support qualification. Protocol conformance alone does not prove full capability equivalence.

### Lifecycle / Versioning / Evolution / Migration
Lifecycle owns reusable revision/coexistence/migration/withdrawal primitives. Provider/Binding owns provider-specific binding lifecycle, coexistence and residual provider cohort drainage.

### Architecture Reconciliation
Architecture Reconciliation owns later cross-capability desired/product truth versus observed/effective truth and gap disposition. Provider/Binding provides qualified provider realization evidence but cannot normalize canonical product truth silently.

### Universal Capability Architecture
UCA supplies typed identity, revision vectors, support vectors, qualified claims/evidence, effect dispositions, currentness and residual-cohort primitives. It does not absorb provider semantics.

## 16. AGWS and AI non-amplification

Adaptive Governed Work Surfaces remains distinct from generic UI and from Provider/Binding. AGWS may present provider-backed actions/components only through capabilities and bindings exposed to the current Station/Role/Person.

AI may assist discovery, compare support vectors, propose mappings, draft provider-specific parameters, explain qualification gaps or propose a cutover plan. AI/AGWS may not:

- admit a provider without required policy/authority;
- reinterpret feature-name similarity as semantic equivalence;
- adopt provider IDs as canonical identity implicitly;
- fabricate health, currentness, support or effective-outcome evidence;
- widen Station capability exposure;
- reveal or acquire provider credentials outside current authority;
- retry an `UNKNOWN` mutation before reconciliation unless explicit idempotency qualification permits it;
- suppress `PARTIAL`, `UNSUPPORTED` or `INCONCLUSIVE` support results;
- promote provider-specific mechanisms into universal domain truth silently;
- bypass residual cohort drainage during provider substitution.

## 17. Non-goals

Provider / Binding / Capability Negotiation does not own canonical business/domain entities, workflow truth, storage truth, identity, trust, authorization, runtime desired state, configuration values, protocol standards, telemetry, security posture, governance obligations, economic accounting or lifecycle semantics outside provider realization.

It does not mandate one provider registry, plugin framework, cloud, service mesh, package format, protocol, adapter SDK, marketplace, credentials system or discovery transport. It does not promise universal hot swapping. Provider portability is support-vector- and state-dependent, and some substitutions may require explicit migration, coexistence or domain redesign.

## 18. Planning B repository-validation questions

Defer all answers to fresh-main archaeology in Planning B:

1. Does SB currently have an explicit canonical provider descriptor and revision model distinct from provider-native IDs?
2. Are provider discovery, support advertisement, qualification, admission and binding represented as separate states/contracts?
3. Does any current provider abstraction use multidimensional support vectors, or rely on feature-name/boolean compatibility?
4. Can qualification express `PARTIAL`, `UNSUPPORTED` and `INCONCLUSIVE` with evidence/currentness?
5. Are provider bindings revisioned and scoped independently of canonical domain objects and provider resources?
6. Are provider-specific realization parameters kept out of canonical domain schemas unless explicitly generalized?
7. Do current adapters preserve canonical-to-provider identity mapping and effect lineage?
8. Are remote mutating outcomes represented as `APPLIED / NOT_APPLIED / PARTIAL / UNKNOWN` and reconciled before unsafe retry?
9. Does provider acceptance currently get distinguished from effective domain outcome and convergence?
10. Is provider health/currentness qualified per capability/scope/revision rather than represented as a global boolean?
11. Can SB represent fallback/coexistence without assuming semantic interchangeability?
12. Does provider substitution include explicit cutover and drainage of residual authoritative cohorts?
13. Are withdrawn provider mappings/evidence retained for historical reconciliation and audit lineage?
14. Are provider/external IDs kept non-canonical through import, migration and hierarchical Station use?
15. Can Station expose only delegated provider-backed capability subsets while preserving superior authority?
16. Are external/superior-SB capabilities represented through explicit provider/binding and interoperability contracts rather than hidden coupling?
17. Can AI/AGWS assist provider selection and migration without acquiring admission/admin authority or manufacturing support evidence?

No answer is inferred in Planning A.

## 19. Planning A disposition

**PASS_FOR_CAPABILITY.** Provider / Binding / Capability Negotiation has a distinct semantic owner centered on discovery, support-vector qualification, admission, revisioned binding, provider realization lineage, fallback/coexistence and safe substitution/withdrawal. Domain owners retain their semantics and postconditions; provider/external IDs remain non-canonical unless explicitly adopted; provider acceptance never proves effective domain outcome; ambiguous mutations preserve `UNKNOWN` and reconcile-before-retry; and provider substitution requires explicit qualification, cutover and residual authoritative cohort drainage. Research and synthesis inputs are sufficient for Planning A; no new finding or capability candidate is required. Planning B remains blocked until every canonical capability completes Planning A reconciliation.
