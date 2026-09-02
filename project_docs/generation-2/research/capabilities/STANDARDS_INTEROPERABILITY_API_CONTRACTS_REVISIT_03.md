# Generation 2 — Standards / Interoperability / API Contracts — Revisit 03

Status: REVISIT CYCLE 4 — MATERIAL NEW FINDINGS — NOT SATURATED

## Research question

How should Generation 2 distinguish semantic contract/profile identity from wire/schema/API-description realizations, negotiate versions and representations without semantic weakening, prove compatibility rather than trust provider claims, preserve coexistence/migration lineage across provider replacement, and remain portable/offline while supporting Station-scoped governed consumption by Adaptive Governed Work Surfaces?

## Representatives

1. Protocol Buffers Editions/language guide — stable field-number identity, reserved identifiers and schema evolution.
2. Buf breaking-change detection — explicit compatibility strata (`FILE`, `PACKAGE`, `WIRE_JSON`, `WIRE`) and revision comparison.
3. HTTP Semantics RFC 9110 — proactive content negotiation, q-values and operation-scoped representation acceptability.
4. Kubernetes API deprecation/versioning policy — coexistence, no-loss round trips, preferred/storage versions and deprecation windows.
5. GraphQL Specification September 2025 — introspectable deprecation and schema evolution signals.
6. OpenAPI Specification 3.2.0 — HTTP API description, specification-version compatibility and implementation-defined boundaries.

## Evidence / source ledger

| Representative | Source of truth | Evidence extracted | Coverage |
|---|---|---|---|
| Protocol Buffers | https://protobuf.dev/programming-guides/editions/ | Field numbers are wire identity and cannot be reused safely; deleted numbers/names can be reserved to preserve evolution safety. | DEEP |
| Buf | https://buf.build/docs/breaking/ ; https://buf.build/docs/breaking/rules/ | Compatibility is not one boolean: source/file/package, wire+JSON and binary-wire rules differ; the comparison baseline is explicit. | DEEP |
| RFC 9110 | https://www.rfc-editor.org/rfc/rfc9110.html | Representation/content-coding negotiation uses request constraints/preferences; q=0 means unacceptable. Negotiation chooses among acceptable realizations rather than redefining application semantics. | DEEP |
| Kubernetes API deprecation policy | https://kubernetes.io/docs/reference/using-api/deprecation-policy/ | Multiple API versions coexist; objects must round-trip between versions in a release without information loss; preferred and storage versions advance only after overlap; deprecation and removal have bounded policy. | DEEP |
| GraphQL September 2025 | https://spec.graphql.org/September2025/ | Fields, enum values, arguments and input fields can expose introspectable deprecation state/reason while remaining part of the schema until removal. | DEEP |
| OpenAPI 3.2.0 | https://spec.openapis.org/oas/v3.2.0.html | OAS feature-set version is distinct from described API version; tooling compatibility is specified across patch/minor behavior; schema validation does not exhaust all specification semantics. | DEEP |

## Source of truth

The normative source of truth for Generation 2 is a semantic contract/profile revision elected by SB authority, not a transport endpoint, provider discovery document, generated client, OpenAPI file, protobuf descriptor, GraphQL introspection snapshot or negotiated media type unless an external contract has explicitly been adopted as canonical semantic authority.

A representation can be syntactically valid while semantically incompatible with an intended consumer profile. A provider can advertise a version while failing behavioral conformance. A transport can successfully negotiate a representation while mandatory semantic capability is absent. Therefore realization and conformance evidence must remain distinct from canonical meaning.

## Identity

Keep distinct:

- `SemanticContractId` and `SemanticContractRevision`;
- operation/resource/message identity;
- `ContractProfileRevision` with mandatory/optional semantics;
- standard/dialect/schema/API-description revision;
- wire representation revision;
- provider/binding realization revision;
- compatibility ruleset and baseline revision;
- negotiation request/result;
- negotiated effective profile;
- conformance suite revision/result/evidence freshness;
- lifecycle state: active/deprecated/sunset/removed;
- Station exposure revision;
- observed runtime behavior.

Protobuf field numbers demonstrate that wire identity may be stable even when source names change. Buf demonstrates that such a change can be wire-compatible yet source-breaking. Semantic identity therefore cannot be collapsed into one representation-level compatibility result.

## Lifecycle

Preferred lifecycle:

`draft → validate interpretation closure → publish semantic revision → project representations → expose → bind → negotiate effective profile → compatibility assess → conformance verify → coexist/migrate → deprecate → sunset/remove → retain lineage/evidence`.

Version coexistence is first-class. Kubernetes demonstrates that preferred version, served versions and storage version can differ during migration. The semantic analogue in SB should preserve canonical identity while explicitly recording which representation/profile/provider revision is effective at each boundary.

## Versioning and compatibility

Compatibility is a relation, not a property:

`CompatibilityAssessment = (producerRevision, consumerRevision, profile, rulesetRevision, direction, context) → PASS | FAIL | INCONCLUSIVE`.

Buf supplies direct evidence for multiple compatibility strata. Kubernetes adds a stronger semantic preservation criterion: no-loss round trip among served API versions. Generation 2 should therefore support at least:

- source/tooling compatibility;
- wire/serialization compatibility;
- schema/shape compatibility;
- semantic/profile compatibility;
- lifecycle availability compatibility;
- authority/exposure compatibility.

A stricter result may imply a weaker one only where the governing ruleset explicitly defines that implication. No global `compatible=true` is sufficient.

## Negotiation and downgrade

RFC 9110 proves that transport negotiation is selection among acceptable representations according to request constraints/preferences. It does **not** prove that a lower semantic capability profile is acceptable.

Therefore:

`representation negotiation ≠ semantic-profile downgrade authority`.

If a provider can satisfy only a weaker optional profile, the result must be explicit and policy-admitted. If any mandatory feature would be lost, fallback/downgrade must fail or escalate rather than silently select the weaker realization. This directly strengthens `G2-CAPABILITY-CANDIDATE-NEGOTIATED-EFFECTIVE-CAPABILITY-PROFILE-EVIDENCE` from Provider/Binding.

## Conformance evidence versus provider claim

Provider/version advertisement, OpenAPI description, GraphQL introspection, protobuf descriptor availability and HTTP `Accept-*` compatibility are claims or realization metadata. None proves domain behavior.

A conformance proof should bind:

`SemanticContractRevision + ContractProfileRevision + RepresentationRevision + ProviderBindingRevision + ConformanceSuiteRevision + EvidenceTimestamp/Freshness + ObservedOutcome`.

Failure to execute required tests or stale/incomplete observation yields `INCONCLUSIVE`, not implicit PASS.

## Migration / provider replacement / coexistence

Standards-level migration converges with the shared governed transition primitive:

`MigrationPlan → CompatibilityValidation → AuthorityApproval → Coexistence/CutoverAttempt → Checkpoint → PostconditionConformanceEvidence → Rollback/ForwardDecision`.

Kubernetes preferred/storage-version overlap demonstrates why provider or representation replacement may require coexistence windows. The old and new realizations can both remain valid while state is converted or consumers migrate. Technical reachability of the new endpoint is not semantic migration success.

## Failure semantics

Distinguish:

- invalid/uninterpretable contract representation;
- missing interpretation closure;
- incompatible source/tooling contract;
- incompatible wire/serialization contract;
- lossy conversion/round-trip failure;
- unsupported mandatory profile feature;
- representation negotiation failure;
- semantic downgrade rejected;
- provider advertisement mismatch;
- conformance FAIL;
- conformance INCONCLUSIVE due to stale/incomplete evidence;
- deprecated-but-still-served;
- removed/not-served;
- Station exposure denied;
- provider replacement technically successful but semantic postcondition unproven.

## Extensibility

Extension ownership remains explicit. New fields, directives, media types or vendor extensions cannot silently expand canonical domain authority. Protobuf reserved identifiers demonstrate that removed representation elements can retain tombstone-like namespace protection; GraphQL/OpenAPI deprecation demonstrates that evolution signals can coexist with continued service.

Product-specific extension mechanisms should map to universal primitives: namespace ownership, interpretation authority, required/optional semantics, compatibility rules and lifecycle evidence.

## Provider boundaries

Standards owns semantic contract/profile interpretation, compatibility classes and conformance semantics. Provider/Binding owns candidate realizations, negotiation inputs, selection and effective binding. Integration owns delivery/invocation behavior. Lifecycle owns migration/deprecation transition policy. Governance owns publication, exception and exposure authority.

Provider replacement must preserve capability-owned semantic operation identities where possible. Endpoint/provider identity is realization metadata, not the operation identity consumed by AGWS or generated runtimes.

## Governance

Govern at minimum:

- semantic-contract publication authority;
- profile mandatory/optional semantics;
- compatibility ruleset/baseline authority;
- allowed standard/dialect versions;
- downgrade/fallback policy;
- extension namespace owner;
- deprecation/sunset/removal authority;
- conformance suite and freshness requirements;
- Station/external exposure;
- imported external contract authority election;
- migration/cutover/rollback approval.

## Observability

Observability should correlate request/operation with semantic contract revision, consumer profile, provider/binding revision, negotiated representation/effective profile, compatibility assessment revision, lifecycle state and conformance evidence without logging sensitive payloads by default.

Kubernetes' ability to observe deprecated API usage is a useful operational pattern: lifecycle risk becomes measurable usage evidence rather than an abstract declaration.

## Portability / lock-in / qualified local closure

Portable/offline conformance requires a qualified closure containing, as applicable:

- semantic contract/profile revisions;
- all referenced schemas/descriptors/dialects/vocabularies;
- compatibility ruleset and baseline artifacts;
- conversion mappings required for supported coexistence;
- conformance suites/fixtures and expected semantic outcomes;
- extension namespace/processing rules;
- trust/signature material needed to verify the closure;
- lifecycle/exposure policy snapshots required for the operation.

Endpoints, mutable provider metadata and online registries are not prerequisites for interpreting the semantic contract when the closure profile claims offline capability.

## Product-specific mechanism vs universal primitive

| Mechanism | Universal primitive |
|---|---|
| Protobuf stable/reserved field numbers | representation identity + retired identifier reservation |
| Buf FILE/PACKAGE/WIRE_JSON/WIRE rules | compatibility class + explicit comparison baseline |
| HTTP `Accept*` + q-values | realization negotiation constraints/preferences |
| Kubernetes served/preferred/storage API versions | coexistence set + effective/read/write/storage realization roles |
| Kubernetes no-loss round trip | semantic preservation postcondition for version conversion |
| GraphQL `isDeprecated`/reason | element lifecycle declaration without immediate removal |
| OpenAPI OAS version | representation-language revision distinct from described API revision |

## Convergent patterns

1. Compatibility is directional, contextual and rule-set-qualified.
2. Multiple revisions can coexist behind one logical capability during migration.
3. Representation negotiation does not authorize semantic weakening.
4. Deprecation and removal are separate lifecycle states.
5. Provider claims/descriptions are weaker evidence than exercised conformance.
6. Semantic identity survives changes in transport/provider/representation when a proven compatibility mapping exists.
7. Offline portability requires interpretation + compatibility + conformance closure, not a lone API document.

## Divergent patterns

- Protobuf can preserve binary wire compatibility across changes that break generated source compatibility.
- Kubernetes requires no-loss round-trip across served API versions, a stronger coexistence invariant than ordinary schema parseability.
- HTTP negotiation intentionally allows preference among acceptable representations but has no knowledge of SB domain invariants.
- GraphQL emphasizes additive evolution and deprecation through introspection rather than explicit URL/API version negotiation.

These divergences support explicit compatibility classes rather than one universal rule.

## Subcapabilities

- Semantic contract/profile registry.
- Compatibility-class taxonomy and ruleset registry.
- Compatibility assessment evidence.
- Representation/version projection registry.
- Conversion/round-trip proof.
- Negotiated effective profile evidence.
- Conformance suite/result lineage.
- Deprecation/sunset/removal lifecycle evidence.
- Provider replacement/coexistence contract migration.
- Station-scoped semantic contract exposure.
- Qualified local contract interpretation/conformance closure.

## Fresh-main comparison — bounded evidence only

Fresh `main` `packages/contracts/system-definition/system-definition.schema.json` remains JSON Schema Draft 2020-12 with stable `$id`. `integrations[]` carries logical `id`, string `contract`, direction and requirement references; optional invocation is concretely HTTP method/path plus `bindingRef`.

This supports **KEEP** logical integration identity and binding separation. It supports **HARDEN/GENERALIZE** hypotheses for typed semantic contract/profile revision, compatibility/conformance evidence and protocol-independent operation realization. A bounded default-branch search for `contractRevision conformance compatibility integration bindingRef` returned no result; this is only bounded negative evidence, not repository-wide absence.

## Reconciliation hypotheses

- **KEEP** stable logical integration identity and existing `bindingRef` separation.
- **HARDEN** `contract` into typed semantic contract/profile revision references after PLANNING_B archaeology confirms ownership.
- **GENERALIZE** HTTP method/path as one provider/representation realization, not canonical API meaning.
- **INTEGRATE** compatibility classes, coexistence windows and lifecycle states with Lifecycle/Versioning.
- **INTEGRATE** negotiated effective profile with Provider/Binding while Standards retains semantic profile meaning.
- **HARDEN** conformance as revision-bound evidence distinct from advertisement/discovery.
- **GENERALIZE** qualified local closure to include interpretation, conversion, compatibility baseline and conformance fixtures.
- **HARDEN** Station exposure as non-amplifying semantic-operation projection.
- **DEFER** bespoke universal wire protocol or replacement for OpenAPI/Protobuf/GraphQL.
- **DO_NOT_BUILD** global compatibility, downgrade, conformance or deprecated-means-unavailable booleans.

## Questions for repository validation

1. Where, if anywhere, is `integrations[].contract` resolved into a typed/versioned artifact?
2. Is compatibility represented by class/direction/baseline or only implicit version assumptions?
3. Can two contract/provider revisions coexist for a controlled migration window?
4. Is conversion round-trip or semantic equivalence tested anywhere?
5. Can runtime evidence distinguish provider advertisement from exercised conformance?
6. Are downgrade/fallback semantics explicit and authority-gated?
7. Is deprecation distinct from removal and actual availability?
8. Can generated runtimes validate contracts offline with a complete interpretation/conformance closure?
9. Can Station exposure withhold operations without forking canonical contract meaning?
10. Can AGWS bind a semantic operation independent of HTTP/provider details?

## Adaptive Governed Work Surfaces boundary

AGWS remains explicitly distinct from generic low-code UI. Under `Enterprise → Station → Role → Person`, a surface may consume only semantic operations/profiles exposed by the effective Station/Role and bind them through provider-independent contract references.

AI is sole materializer of the constrained surface, but it cannot:

- invent arbitrary endpoint/query semantics;
- choose a weaker profile when mandatory semantics would be lost;
- treat provider advertisement as authorization or conformance;
- expose an operation not delegated to the Station;
- mutate canonical schema/domain/process to make an incompatible action fit;
- perform provider migration or contract promotion without the relevant authority.

A Station/Role change revalidates the surface against the effective semantic contract/profile and negotiated provider realization. Failure becomes repair/escalation, never silent weakening.

## Symbiotic Proof

A complete proof uses one semantic operation/profile consumed by an AGWS component, projects it into at least two representations, binds it to two provider realizations, demonstrates one change that is wire-compatible but source-incompatible and one conversion that must round-trip without information loss, negotiates an alternative representation without losing mandatory semantics, rejects a weaker semantic downgrade, distinguishes advertised support from exercised conformance, runs coexistence/cutover with lineage and rollback evidence, withholds the operation from a non-authorized Station, and reruns interpretation/compatibility/conformance checks from a qualified local closure after Builder/provider registries are unavailable.

## Stable findings

### G2-FINDING-SIAC-23 — Compatibility Is a Revision-Pair, Direction, Profile and Rule-Set Relation, Not a Boolean
Buf's multiple breakage classes and Kubernetes version policy show that compatibility can differ by source, wire, representation and semantic preservation. Generation 2 must record the compared revisions, direction, profile and ruleset.

### G2-FINDING-SIAC-24 — Wire Compatibility Does Not Imply Source or Semantic Compatibility
Protobuf field identity and Buf rules show that a schema evolution can preserve binary wire behavior while breaking generated source contracts; semantic equivalence therefore requires its own proof class.

### G2-FINDING-SIAC-25 — Negotiated Representation Selection Must Not Authorize Semantic Profile Downgrade
HTTP negotiation chooses among representations acceptable to transport participants. Mandatory SB semantics remain governed by the semantic profile; fallback that weakens them must fail or require explicit governed exception.

### G2-FINDING-SIAC-26 — Coexisting API Revisions Need Explicit Read/Write/Storage/Exposure Roles and Round-Trip Postconditions
Kubernetes demonstrates that served, preferred and storage versions may differ during migration and that supported versions need lossless round-trip behavior. SB migrations need equivalent role/evidence separation where stateful contracts coexist.

### G2-FINDING-SIAC-27 — Provider Description and Negotiation Success Are Claims/Realization Facts, Not Domain Conformance Proof
OpenAPI documents, descriptors, introspection and negotiated media types can be valid while actual provider behavior diverges. Conformance evidence must bind semantic/profile revision, realization revision, suite revision and freshness.

### G2-FINDING-SIAC-28 — Deprecation Usage Evidence Is Required to Govern Safe Contract Withdrawal
GraphQL/Kubernetes make deprecation observable while support continues. Removal authority should consume actual usage/migration evidence rather than infer safety from elapsed time alone.

### G2-FINDING-SIAC-29 — Qualified Local Contract Closure Must Include Compatibility Baselines, Conversion Rules and Conformance Fixtures
Offline interpretation alone is insufficient when compatibility or provider replacement must be proved. The closure profile must include the artifacts required to reproduce those assessments without mutable external control-plane state.

## Capability discovery candidates

### G2-CAPABILITY-CANDIDATE-MULTI-CLASS-CONTRACT-COMPATIBILITY-ASSESSMENT-EVIDENCE — CROSS_CUTTING / MERGE_TARGET
Evidence: Protobuf/Buf + Kubernetes. Likely specialization of unified evidence qualification plus Lifecycle compatibility rather than a new macro-capability.

### G2-CAPABILITY-CANDIDATE-SEMANTIC-NON-WEAKENING-NEGOTIATION-GUARD — CROSS_CUTTING / MERGE_TARGET
Evidence: RFC 9110 combined with Provider/Binding negotiated effective profile findings. Likely constitutional rule for fallback/negotiation rather than standalone capability.

### G2-CAPABILITY-CANDIDATE-CONTRACT-COEXISTENCE-ROUNDTRIP-MIGRATION-EVIDENCE — CROSS_CUTTING / MERGE_TARGET
Evidence: Kubernetes API coexistence/storage/preferred versions + Buf comparison baselines. Likely specialization of shared governed migration transition.

### G2-CAPABILITY-CANDIDATE-QUALIFIED-LOCAL-CONTRACT-COMPATIBILITY-CONFORMANCE-CLOSURE — CROSS_CUTTING / MERGE_TARGET
Evidence: multi-representative need to reproduce interpretation, compatibility, conversion and conformance offline. Likely specialization of qualified local closure profile.

No candidate is promoted in this revisit.

## Value / risk / priority / next question

Value: HIGH — contract evolution and provider replacement are foundational to anti-lock-in, generated-runtime autonomy and enterprise interoperability.

Risk if omitted: HIGH — transport success or provider advertisement could be mistaken for semantic compatibility; downgrade/fallback could silently weaken business invariants; migrations could lose information while appearing technically successful.

Priority: HIGH.

Next question: Lifecycle / Versioning / Evolution / Migration should test whether compatibility classes, coexistence roles, migration evidence and deprecation-usage evidence consolidate cleanly into the shared governed lifecycle transition without duplicating Standards ownership.