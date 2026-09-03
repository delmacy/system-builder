# Standards / Interoperability / API Contracts — Revisit 5 (Cycle 6)

## Research question
Which contract/evolution properties are universal enough for Generation 2 without collapsing semantic contract identity into a particular schema, protocol, transport or provider, and what evidence is required to prove compatibility across consumer populations, Stations and provider substitutions?

## Representatives and evidence ledger
1. **Kubernetes API deprecation/versioning** — API elements cannot be removed or significantly changed within a served version; objects must round-trip between versions without information loss; preferred/storage version advancement is constrained by rollback compatibility. Deprecation also emits warning/audit/metrics evidence.
2. **Confluent Schema Registry** — backward/forward/full compatibility is distinct from transitive compatibility; non-transitive compatibility against only the latest version does not establish compatibility with the historical consumer/data population.
3. **OpenAPI 3.1** — structural contract dialect is independently versioned; 3.1 aligns Schema Objects with JSON Schema 2020-12 and migration from 3.0 includes breaking Schema Object changes.
4. **AsyncAPI parser/model** — protocol/event API descriptions can reference multiple schema dialects and validation/dereferencing normalizes representation for tooling; parser-valid description is not evidence that runtime consumers honor business semantics.
5. **Prior Generation-2 Provider/Binding, Lifecycle and Integration research** — supplies failure/evidence-profile, residual-use, ambiguous-effect and consumer-effective convergence obligations for cross-capability reconciliation.

## Source of truth and typed identity
The canonical semantic contract is not the same identity as its OpenAPI/AsyncAPI/JSON-Schema/Protobuf representation, transport endpoint, provider binding or generated client. Model at least `SemanticContractId`, `ContractRevision`, `RepresentationId`, `DialectRevision`, `ProtocolProfile`, `TransportBinding`, `ProviderRealization`, `ConsumerCohort`, and evidence-qualified effective state.

## Lifecycle and versioning
Contract lifecycle is not merely publish/replace. It requires `draft → structurally valid → semantically validated → admitted → served → deprecated → sunset-announced → withdrawn → residual-consumer-drained`. Compatibility is revision- and population-scoped. Pairwise compatibility does not imply transitive compatibility. Served-version coexistence and conversion can preserve rollback even when preferred/storage representation advances.

## Failure semantics
Structural validation can pass while semantic behavior is incompatible. A provider can accept a request while external effect remains ambiguous. Withdrawal can succeed at the registry/gateway while stale/offline consumers continue using cached contracts/endpoints. Failure/evidence profiles are therefore part of interoperability qualification.

## Extensibility and provider boundaries
Vendor extensions, custom schema dialects and protocol-specific bindings are realization mechanisms. They must not become canonical semantic identity. Provider substitution requires proof that the target realizes required semantic contract, failure profile and evidence profile, then consumer-effective cutover and residual-source/use disposition.

## Governance and authority
Contract authoring, representation publication, compatibility-policy change, provider binding, deprecation, sunset and withdrawal are distinct authorities. Cross-boundary semantic references require target-side consent that can be revoked. `Enterprise → Station → Role → Person` may attenuate exposure/use but cannot amplify contract/policy/provider-admin authority.

## Observability and evidence
Evidence must distinguish `declared`, `validated`, `served`, `observed-used`, `consumer-compatible`, `deprecated`, `withdrawn` and `residual-use-cleared`. Deprecation warnings, audit records and request metrics are stronger consumer-drainage evidence than declaration alone. Missing observations do not prove zero consumers unless coverage/freshness are qualified.

## Portability and lock-in
Portability requires preserving semantic intent independently of schema/protocol dialect, plus explicit mapping to provider realization. A syntactically portable OpenAPI/AsyncAPI document is insufficient when vendor extensions, failure semantics, auth/policy, rate behavior or business invariants differ.

## Product-specific mechanism vs universal primitive
Product-specific: Kubernetes API groups/storage conversion, Confluent compatibility modes, OpenAPI/AsyncAPI document shapes. Universal candidates: typed semantic-versus-realization identity; multi-axis revision-qualified compatibility; consumer-population/transitive compatibility evidence; executable semantic conformance; revocable cross-boundary reference consent; lifecycle with consumer-drainage postcondition; failure/evidence-profile compatibility.

## Convergent/divergent patterns
Convergent: versioned contracts, compatibility rules, coexistence windows, explicit deprecation, evidence-qualified migration. Divergent: compatibility direction/mode, conversion mechanisms, schema dialects, transport semantics and removal timelines. Therefore SB must model required properties rather than normalize products to one mechanism.

## Subcapabilities
Semantic contract registry; representation/dialect mapping; compatibility/conformance evaluation; consumer-cohort evidence; deprecation/sunset/withdrawal; cross-boundary reference governance; provider/transport binding; API lifecycle evidence.

## SB comparison
No repository-wide implementation conclusion is made in this pass. Fresh-main archaeology is reserved for PLANNING_B; any bounded keyword absence is not evidence of product absence.

## Reconciliation hypotheses
- **GENERALIZE** semantic contract identity away from representation/provider identities.
- **HARDEN** compatibility with consumer-population, transitive and revision-qualified evidence.
- **HARDEN** structural validation with executable semantic conformance proofs.
- **INTEGRATE** failure/evidence-profile compatibility with Provider/Binding.
- **HARDEN** deprecation/withdrawal with observed consumer-drainage and residual-use closure.
- **PROVIDERIZE** schema/protocol/transport-specific mechanisms.
- **DO_NOT_BUILD** a bespoke universal wire protocol when standards/providers satisfy the required profile.

## Repo-validation questions
Does main have canonical semantic contract IDs independent of provider/schema? Are compatibility checks transitive/population-aware? Are contract lifecycle and residual consumers represented? Can Station exposure attenuate without editing canonical contracts? Are provider failure/evidence profiles part of binding? Are structural and executable semantic conformance distinct? Are stale/offline consumers requalified on reconnect?

## Symbiotic Proof obligations
1. Same semantic contract realized through two representations/providers without changing canonical identity.
2. Pairwise-compatible but non-transitively-compatible evolution is rejected for a cohort requiring historical compatibility.
3. Structurally valid contract with semantic invariant violation fails executable conformance.
4. Cross-boundary reference loses effectiveness after target consent revocation.
5. Deprecated contract cannot be marked withdrawn-complete while qualified evidence shows residual consumers.
6. Provider replacement proves failure/evidence-profile compatibility and consumer-effective cutover before source disposition.
7. Ambiguous external effect is reconciled before retry.
8. Offline Station uses only revision-bounded local closure and requalifies on reconnect.
9. AGWS/AI can invoke admitted contract operations without acquiring contract-authoring, compatibility-policy or provider-admin authority.

## Stable findings
- **G2-FINDING-SIAC-39** — Interoperability requires typed identity across semantic contract, representation/dialect, protocol/transport binding, provider realization and consumer cohort; representation IDs are not canonical semantic identity.
- **G2-FINDING-SIAC-40** — Effective compatibility is a multi-axis revision-qualified proof spanning contract, representation/dialect, compatibility profile, provider/binding, policy/trust, consumer population and evidence revision.
- **G2-FINDING-SIAC-41** — Pairwise/latest-version compatibility does not imply transitive consumer-population compatibility; compatibility proof must match the actual historical data/client cohort.
- **G2-FINDING-SIAC-42** — Structural/schema validity is weaker than executable semantic conformance; a contract can parse and validate while violating behavioral/domain invariants.
- **G2-FINDING-SIAC-43** — Cross-boundary semantic references require revocable target-side consent; discovery/reference visibility does not create authority to bind or continue use.
- **G2-FINDING-SIAC-44** — Deprecation, sunset, withdrawal and consumer drainage are distinct lifecycle facts; withdrawal closure requires qualified residual-use evidence rather than declaration alone.
- **G2-FINDING-SIAC-45** — Provider substitutability for an API contract includes failure and evidence semantics, not only request/response shape; target structural compatibility alone is insufficient.
- **G2-FINDING-SIAC-46** — Local/offline conformance is revision-bounded; reconnect after contract/policy/trust/provider advancement requires requalification before privileged or mutating use.

## Value / risk / priority / next question
Value: high, because symbiosis depends on stable semantics across native/external providers. Risk: high if syntactic standards are mistaken for semantic interoperability. Priority: architectural foundation. Next question: Lifecycle / Versioning / Evolution / Migration must test whether these contract lifecycle/evidence obligations generalize across non-API artifacts without erasing capability-specific semantics.
