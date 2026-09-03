# Standards / Interoperability / API Contracts — Revisit 6 (Cycle 7)

## Research question
Which interoperability claims remain valid when specification dialect, protocol runtime, retry behavior, provider realization and consumer population evolve independently, and what evidence is required before Generation 2 may treat an API/standard realization as consumer-effective rather than merely syntactically or structurally conformant?

## Representatives and evidence/source ledger
1. **OpenAPI 3.1.1** — an OpenAPI Description describes an HTTP API surface and semantics, but the OAS itself has an independently versioned feature set; tooling supporting 3.1 is expected to tolerate 3.1.x while minor revisions may still introduce limited non-backward-compatible changes. Operation deprecation is declarative, and descriptions may contain specification extensions.
2. **IETF HTTP Semantics RFC 9110 + RFC 6585** — idempotency is a property of intended method effect, not a proof that every implementation has exactly-once side effects. Automatic retry of non-idempotent operations is unsafe without independent knowledge that the operation is idempotent or that the original attempt was not applied. `Retry-After` and 429/503 communicate retry timing but not business-effect reconciliation.
3. **gRPC retry semantics** — retry policy is method-scoped; the client preserves call history and retries selected failures. Once response headers are received, the RPC is committed for the retry subsystem. Transparent retry is deliberately narrower when the runtime can establish that application logic did not observe the call. Transport retry therefore has a commitment boundary distinct from domain-effect certainty.
4. **Kubernetes API versioning/deprecation** — served versions can coexist; API elements cannot be removed or significantly changed inside a served version, and objects are expected to round-trip between versions without information loss. Deprecation and removal follow stability/lifetime rules, demonstrating that contract lifecycle includes supported skew and migration windows rather than a single latest version.
5. **Confluent Schema Registry** — backward/forward/full compatibility and their transitive variants are distinct. Non-transitive checks only against the latest schema do not prove compatibility with all historical producer/consumer data populations.
6. **AsyncAPI 3.1 / bindings** — the specification can evolve without breaking the prior feature set and protocol bindings intentionally separate a portable API description from provider/protocol-specific configuration. A portable description can therefore coexist with realization-specific behavior.

## Primitives and source of truth
Generation 2 should preserve separate identities for `SemanticContract`, `Specification`, `SpecificationDialect`, `Profile`, `Schema`, `Operation`, `ProtocolBinding`, `ProviderImplementation`, `ConformanceResult`, `Client/ConsumerCohort`, `InvocationAttempt`, `EffectDisposition`, and `ConsumerEffectiveClaim`. The semantic contract is authoritative for product intent; a specification document is a representation; a gateway/runtime/provider is a realization; conformance evidence is a qualified observation. None alone substitutes for the others.

## Identity, lifecycle and versioning
Interoperability lifecycle is at least `authored → structurally valid → behaviorally qualified → admitted → served → consumer-effective → deprecated → sunset → withdrawn → residual cohorts drained`. Effective state must carry a revision vector over semantic contract, specification/dialect/profile, schema, provider/runtime, policy/trust/configuration and target consumer cohort. Dual-version and dual-protocol operation are legitimate migration states, not accidental inconsistency, but closure requires target-effective proof plus residual client/session/cache/subscription disposition.

## Failure semantics, retries and ambiguous mutation
HTTP idempotency and gRPC retry policy show that transport-level retryability is narrower than domain-effect certainty. An acknowledgement can be lost after a mutation has become effective; a retry subsystem may also declare an RPC committed before the application can prove the business outcome. Mutating interoperability therefore needs an explicit effect disposition such as `NOT_APPLIED | APPLIED | PARTIALLY_APPLIED | UNKNOWN`, an operation-scoped idempotency/effect guarantee, and reconcile-before-retry when the result is `UNKNOWN`. Rate limiting and Retry-After govern when to retry, not whether duplicating the business effect is safe.

## Extensibility and provider boundaries
OpenAPI extensions, AsyncAPI bindings, gateway policies, protobuf/schema choices, protocol-specific metadata and generated clients are realization mechanisms. They may enrich a provider realization but must not redefine canonical semantic identity without an explicit semantic change. Provider substitution must demonstrate operation semantics, limits, failure/retry behavior, authorization expectations, evidence/observability and lifecycle support, not only shape compatibility.

## Governance
Contract authorship, specification publication, compatibility-policy administration, endpoint/provider binding, retry/idempotency policy, deprecation/sunset and consumer exposure are distinct authorities. `Enterprise → Station → Role → Person` may attenuate exposure or select an admitted profile but cannot grant canonical-contract, API-admin or provider-admin authority that the superior scope did not delegate. AGWS and AI may materialize or invoke admitted operations only within those bounds.

## Observability and evidence replay horizon
Conformance evidence should carry the exact contract/spec/profile/provider/runtime revision and observation horizon. A historical test result can be replayable as evidence while no longer proving current compatibility after a provider, gateway, schema, trust or consumer revision changes. Retry metrics, deprecation warnings, audit logs and qualified traffic observations are useful evidence but absence of traffic is not proof of zero residual consumers unless coverage and freshness are known.

## Portability, lock-in and mixed support vector
A portable description is insufficient if implementations differ in rate limits, status/error semantics, retries, idempotency, consistency, auth, callbacks/subscriptions, lifecycle or evidence. Interoperability support should therefore be a vector over syntax/dialect, structure/schema, behavioral semantics, protocol features, operational limits, failure/retry/effect guarantees, security/policy, observability/evidence, lifecycle/skew, offline behavior and administration.

## Product-specific mechanism vs universal primitive
Product-specific mechanisms include OAS document shapes, gRPC Service Config retry fields, Kubernetes API groups/conversion, Confluent compatibility modes and AsyncAPI bindings. Universal primitives are typed semantic-versus-realization identity; applicability-scoped conformance; revision-qualified compatibility; explicit effect disposition; retry/effect policy separation; mixed-support vectors; consumer-cohort evidence; and residual-cohort drainage.

## Convergent/divergent patterns
Convergent: explicit specification versions, compatibility constraints, coexistence windows, provider/runtime realization boundaries, deprecation, retry/error policies and conformance evidence. Divergent: what is considered backward-compatible, commitment boundaries, protocol retry behavior, schema evolution rules, transport capabilities and provider-specific extensions. SB should normalize the obligations and evidence, not force a single wire mechanism.

## Subcapabilities
Semantic contract registry; specification/profile representation; schema/dialect negotiation; executable conformance; operation failure/effect profile; retry/idempotency qualification; gateway/provider binding; deprecation/skew management; consumer-cohort observation; protocol/version migration; evidence replay/requalification.

## SB comparison
No new repository-wide implementation claim is made in this revisit. Existing fresh-main evidence remains bounded to prior dossiers. PLANNING_B remains the authority for systematic current-state reconciliation.

## Reconciliation hypotheses
- **GENERALIZE** interoperability as applicability-scoped syntactic → structural → behavioral → semantic qualification.
- **HARDEN** typed identities across specification/profile/schema/operation/provider/conformance/consumer-effective state.
- **HARDEN** retries with explicit operation effect disposition and reconcile-before-retry for ambiguous mutation.
- **HARDEN** compatibility with dialect/profile/provider/runtime and consumer-population revision vectors.
- **HARDEN** lifecycle closure with residual client/session/cache/subscription drainage.
- **PROVIDERIZE** wire protocol, gateway, schema registry and provider-specific extension mechanisms.
- **INTEGRATE** provider mixed-support and consumer-effective proofs with Provider/Binding.
- **DO_NOT_BUILD** a proprietary universal API protocol.

## Repo-validation questions
Does main distinguish specification conformance from consumer-effective semantic satisfaction? Are contract, specification, schema, operation and provider identities separate? Can mutating operations express effect disposition and reconcile-before-retry? Are idempotency/retry semantics qualified per operation/provider rather than inferred from protocol alone? Are version/profile skew and residual client cohorts represented? Can Station exposure select a permitted profile without editing the canonical contract? Can offline clients be revision-bounded and requalified on reconnect?

## Symbiotic Proof obligations
1. Same semantic contract is exposed through two specification/protocol realizations without changing canonical identity.
2. A syntactically valid OpenAPI/AsyncAPI description fails when executable behavioral conformance violates the semantic contract.
3. A schema pair that is latest-version compatible but not transitively compatible is rejected for a historical consumer cohort requiring transitivity.
4. A lost acknowledgement after a mutating remote call produces `UNKNOWN`, reconciles external state and only then decides whether retry is safe.
5. An HTTP/gRPC retry policy cannot by itself upgrade an operation to exactly-once/domain-effect certainty.
6. A provider/runtime version change invalidates stale conformance evidence until the relevant applicability vector is requalified.
7. Dual-version/dual-protocol migration cannot close while qualified evidence shows residual clients, sessions, caches or subscriptions.
8. Offline/local use is bounded by known contract/profile/trust revisions and requalified on reconnect.
9. Station, AGWS and AI can expose/invoke admitted operations without gaining API-admin, provider-admin or canonical-contract authority.

## Stable findings
- **G2-FINDING-SIAC-47** — Interoperability is an applicability-scoped layered claim across syntactic, structural, behavioral and semantic conformance; success at a lower layer does not imply consumer-effective semantic satisfaction.
- **G2-FINDING-SIAC-48** — Specification, dialect/profile, schema, operation, provider implementation, conformance result and consumer-effective state require separate typed identities and independent revision lineage.
- **G2-FINDING-SIAC-49** — Protocol-level idempotency/retryability is not a domain-effect guarantee; HTTP explicitly limits automatic retry of non-idempotent requests and gRPC retry commitment is a transport boundary, so mutating operations require explicit effect qualification.
- **G2-FINDING-SIAC-50** — Ambiguous remote mutation requires an explicit effect disposition and reconcile-before-retry; `Retry-After`, retryable status codes or transport retry configuration govern retry mechanics, not duplicate-effect safety.
- **G2-FINDING-SIAC-51** — Interoperability compatibility is revision-qualified across semantic contract, specification/dialect/profile, schema, provider/runtime, policy/trust/configuration and consumer cohort; latest-version compatibility cannot stand in for historical/transitive population compatibility.
- **G2-FINDING-SIAC-52** — API portability is a mixed support vector spanning syntax, structure, behavior, protocol features, limits, failure/retry/effect semantics, security, evidence, lifecycle/skew, offline behavior and administration; a portable description alone is insufficient.
- **G2-FINDING-SIAC-53** — Dual-version/dual-protocol coexistence is a first-class migration state; withdrawal closes only after target consumer-effective proof plus residual client/session/cache/subscription cohort drainage or explicit disposition.
- **G2-FINDING-SIAC-54** — Conformance evidence has an applicability and replay horizon independent of document validity; local/offline use and historical proofs must requalify after relevant contract/profile/provider/trust advancement, while `Enterprise → Station → Role → Person` and AGWS/AI cannot amplify contract/API/provider authority.

## Capability candidates
- `G2-CAPABILITY-CANDIDATE-SIAC-APPLICABILITY-SCOPED-LAYERED-INTEROPERABILITY-CLAIM` — **CROSS_CUTTING / CONSOLIDATION_CANDIDATE**; reconcile with UCA applicability claims while SIAC retains syntactic→structural→behavioral→semantic semantics.
- `G2-CAPABILITY-CANDIDATE-SIAC-REMOTE-MUTATION-EFFECT-DISPOSITION-AND-RECONCILIATION` — **CORE_SUBCAPABILITY / PENDING_SYNTHESIS**; explicit remote effect disposition and reconcile-before-retry for ambiguous mutation.
- `G2-CAPABILITY-CANDIDATE-SIAC-MIXED-INTEROPERABILITY-SUPPORT-VECTOR` — **CROSS_CUTTING / CONSOLIDATION_CANDIDATE**; preserve independent syntax/behavior/failure/security/evidence/lifecycle axes.
- `G2-CAPABILITY-CANDIDATE-SIAC-CLIENT-PROTOCOL-SESSION-CACHE-SUBSCRIPTION-COHORT-DRAINAGE` — **CORE_SUBCAPABILITY / PENDING_SYNTHESIS**; lifecycle closure owns residual consumer/protocol-state disposition.

No candidate is promoted in this revisit. Adaptive Governed Work Surfaces remains CORE/promoted and distinct from UI / Generated Experience / Low-code Builder.

## Value / risk / priority / next question
Value: very high because API compatibility is a principal portability boundary for a symbiotic provider-neutral system. Risk: high if schemas/specifications or retry policies are mistaken for behavioral/effect guarantees. Priority: architectural foundation. Saturation: **NOT SATURATED**, `consecutive_no_material_finding = 0` because eight architectural findings are material. Next question: Lifecycle / Versioning / Evolution / Migration should test whether layered applicability, ambiguous-effect reconciliation, mixed support and cohort drainage generalize across non-API transitions without stealing capability-specific semantic ownership.
