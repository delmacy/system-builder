# Generation 2 — Standards / Interoperability / API Contracts — Revisit 01

Status: REVISIT CYCLE 2 PASS 1 — MATERIAL NEW FINDINGS — NOT SATURATED

## Research question

How should Generation 2 distinguish normative contract identity from negotiated profile, implementation capability and observed behavior so interoperability survives provider/transport replacement without confusing document validity, compatibility, conformance or runtime negotiation?

## Representatives

1. OpenAPI Specification 3.2.0 — operation/representation descriptions, media types, links and specification extensions.
2. HTTP Semantics RFC 9110 + Problem Details RFC 9457 — content negotiation, transport status, semantic problem type and occurrence detail.
3. JSON Schema Draft 2020-12 — dialect, required/optional vocabularies, meta-schema validity and implementation support semantics.
4. AsyncAPI 3.0.0 — protocol-agnostic channels/messages/operations, schema formats and protocol-specific bindings.
5. gRPC status model — transport/RPC outcome vocabulary and distinction between library-generated and application-generated status.

## Evidence / source ledger

| Representative | Source of truth | Evidence extracted | Coverage |
|---|---|---|---|
| OpenAPI 3.2.0 | https://spec.openapis.org/oas/v3.2.0.html | Response `content` declares possible media representations; links describe relationships but do not guarantee invocability; operation identity and deployment reachability remain distinct. | DEEP |
| HTTP RFC 9110 | https://www.rfc-editor.org/rfc/rfc9110.html | Proactive negotiation expresses preferences but servers are not guaranteed to honor them; negotiated representation is an interaction outcome, not mutation of the resource/API contract. | DEEP |
| RFC 9457 Problem Details | https://www.rfc-editor.org/rfc/rfc9457.html | Problem `type` is semantic identity, `status` mirrors HTTP transport status, and occurrence details can have their own identity; extensions must be ignorable when unknown. | DEEP |
| JSON Schema 2020-12 | https://json-schema.org/draft/2020-12/draft-bhutton-json-schema-01 | `$schema` identifies dialect; `$vocabulary` distinguishes required and optional vocabularies; unsupported required vocabularies require refusal while optional unsupported vocabularies may continue. | DEEP |
| AsyncAPI 3.0.0 | https://www.asyncapi.com/docs/reference/specification/v3.0.0 | Core model is protocol-agnostic; protocol bindings MUST contain protocol-specific information only; message payload schema format and content type are explicit. | DEEP |
| gRPC status codes | https://grpc.io/docs/guides/status-codes/ | Every RPC yields a status; some statuses may be library-generated while others are application-generated, so canonical outcome and origin evidence must remain distinguishable. | DEEP |

## Source of truth

The semantic contract revision remains the normative source of truth for operation/message/data meaning. Negotiated media/profile, provider endpoint, protocol binding, implementation capability, validation result and observed response are derived or contextual evidence unless an imported external contract is explicitly elected as authoritative.

Normative text and machine-readable schemas also need precedence rules. RFC 9457 explicitly makes its JSON Schema non-normative relative to specification prose; therefore machine validation cannot silently supersede normative semantics.

## Identity

Distinguish at least:

- semantic contract identity and revision;
- representation/projection identity and standard/dialect version;
- declared feature/vocabulary/profile requirement;
- implementation/provider support claim;
- negotiated profile/media representation per interaction or binding;
- conformance-suite identity/revision and result;
- effective behavior observation;
- semantic problem/error type;
- protocol/transport status;
- problem/error occurrence identity.

## Lifecycle

A robust lifecycle is `author -> validate syntax -> publish -> bind -> negotiate/select profile -> exercise -> observe/conformance-test -> deprecate -> supersede/retire`. These transitions have different authorities. Publication does not prove implementation support; successful syntax validation does not prove conformance; successful negotiation does not alter the contract revision.

## Versioning

Three version axes must not collapse:

1. contract revision owned by the product/domain;
2. standard/dialect/profile revision used to interpret a representation;
3. implementation/provider revision actually realizing the contract.

Compatibility is still directional and contextual. This revisit adds that compatibility evidence must not be promoted to conformance: two revisions can be structurally compatible while a particular implementation violates required semantics.

## Failure semantics

Separate:

- invalid document/schema;
- unsupported required feature/vocabulary;
- unsupported optional feature with defined fallback/ignore behavior;
- failed profile/media negotiation;
- compatible declaration but non-conformant implementation;
- protocol serialization/binding failure;
- transport status/outage;
- application-level semantic problem;
- provider-specific extension unsupported or rejected.

JSON Schema gives a particularly useful universal pattern: required unsupported vocabulary causes refusal, while unsupported optional vocabulary can permit continued processing. That is stronger than a generic `supported=true/false` flag.

## Extensibility

OpenAPI extensions, JSON Schema vocabularies, AsyncAPI bindings and RFC 9457 problem extensions converge on explicit extension ownership plus processing rules. Forward compatibility depends on knowing whether an unknown extension is ignorable, advisory or required. An unknown extension MUST NOT gain execution, authorization or provider-selection authority merely because it is syntactically accepted.

## Provider boundaries

Provider discovery/support evidence answers "can this implementation realize the requested profile?"; Standards owns the normative contract/profile semantics, not provider selection. Provider selection remains in Provider / Binding / Capability Negotiation.

AsyncAPI reinforces that provider/protocol detail belongs in bindings. HTTP negotiation reinforces that a selected representation is contextual. Neither moves semantic ownership to the transport/provider plane.

## Governance

Governance should pin contract revision, normative standard/profile revision, required features, permitted extensions, compatibility policy, conformance suite revision and evidence retention. Vendor extensions require namespace/owner and processing requirements. Deprecation should identify affected contract elements and replacement path without implying immediate runtime removal.

## Observability

Runtime evidence should record contract revision, operation/message identity, negotiated profile/media type, provider/binding revision and outcome without capturing sensitive payloads by default. A conformance claim should include suite revision, subject implementation revision, required profile/features, execution time/window and result.

## Portability / lock-in

Portability is strongest when:

- semantic identity survives OpenAPI/AsyncAPI/gRPC/HTTP representation changes;
- required features are machine-readable independently of a provider;
- negotiated profiles are runtime evidence, not authoritative contract mutation;
- conformance can be rerun offline/self-hosted against exported contracts;
- provider-specific extensions are isolated behind explicit namespaces/bindings.

## Product-specific mechanism vs universal primitive

| Mechanism | Universal primitive |
|---|---|
| HTTP `Accept` / selected `Content-Type` | declared representation alternatives + negotiation attempt/result evidence |
| JSON Schema `$vocabulary` required/optional flags | feature requirement with MUST-understand vs optional/fallback semantics |
| RFC 9457 `type` + HTTP `status` + occurrence | semantic problem type + transport outcome + occurrence evidence |
| OpenAPI response media map | representation alternatives for a semantic operation result |
| AsyncAPI protocol binding | protocol-specific realization descriptor |
| gRPC status code | protocol outcome evidence with origin/provenance |
| conformance test suite | versioned proof procedure + result bound to contract/profile/implementation |

## Convergent patterns

1. Declared contract and effective realization are distinct.
2. Negotiation selects among allowed representations/profiles; it does not rewrite semantic identity.
3. Required-vs-optional feature semantics are part of interoperability, not merely tooling metadata.
4. Compatibility and conformance are different evidence classes.
5. Semantic problem/error identity and protocol status are distinct but correlated.
6. Extension safety requires explicit unknown-feature processing semantics.

## Divergent patterns

- HTTP permits preference negotiation with server discretion; JSON Schema required vocabularies can mandate hard refusal.
- AsyncAPI separates protocol bindings from the protocol-neutral model; gRPC couples service invocation tightly to its RPC transport/runtime conventions.
- RFC 9457 standardizes an error envelope while preserving domain-specific problem types; not every protocol uses that structure.

These differences argue for portable primitives for requirement, negotiation, conformance and outcome evidence rather than one universal wire contract.

## Subcapabilities

- Normative contract/profile registry.
- Required/optional feature declaration.
- Negotiation attempt/result evidence.
- Compatibility evaluation evidence.
- Conformance suite + result lineage.
- Semantic problem/error type registry.
- Protocol outcome mapping with original evidence.
- Extension namespace and MUST-understand/fallback policy.
- Offline validation/conformance bundle.

## Fresh-main comparison — evidence only

Fresh `main` `packages/contracts/system-definition/system-definition.schema.json` remains JSON Schema 2020-12 with stable `$id`. `integrations[]` has logical `id`, free-form `contract`, `direction`, requirement references and optional invocation whose only evidenced `kind` is `http`, with method/path and environment `bindingRef`.

This supports **KEEP** for stable schema identity and existing integration/binding separation. It supports **HARDEN + GENERALIZE** as hypotheses because current evidence does not show a typed contract revision/profile requirement, required/optional feature semantics, negotiation result, conformance result or protocol-independent invocation union. Absence from this one schema is not evidence of repository-wide absence; full archaeology remains reserved for PLANNING_B.

## Reconciliation hypotheses

- KEEP stable JSON Schema contract identity and logical integration IDs.
- HARDEN `contract` into explicit identity/revision/representation references when planning evidence permits.
- GENERALIZE HTTP invocation as one binding/projection rather than universal API semantics.
- PROVIDERIZE implementation-support discovery and endpoint realization, while Standards retains normative profile semantics.
- INTEGRATE reusable negotiation/conformance evidence with Observability and Evidence/Provenance planes.
- DEFER any bespoke universal protocol.
- DO_NOT_BUILD a compatibility boolean that hides direction/profile/rule-set context.
- DO_NOT_BUILD a conformance claim derived only from document/schema validity.

## Questions for repository validation

1. Is `integrations[].contract` resolved, versioned or validated anywhere beyond `SystemDefinition`?
2. Are media/profile alternatives represented in compiler/runtime contracts?
3. Do any tests distinguish compatibility from runtime conformance?
4. Is there a canonical error/problem identity independent of HTTP/gRPC status?
5. Are provider capability probes linked to normative contract/profile requirements?
6. Can conformance suites run without the Builder control plane?
7. Are unknown extension/vendor fields ignored, rejected or interpreted by explicit policy?
8. Is negotiated runtime behavior recorded with contract and binding revision lineage?

## Symbiotic Proof

A contract capability is symbiotically complete when the same semantic operation can be exported to a standard representation, declare required/optional features, bind to two providers/transports, record negotiated profiles independently per realization, execute conformance proofs against each provider, map protocol outcomes back to one semantic problem model without erasing originals, and continue validating/conforming offline after the Builder is unavailable.

## Stable findings

### G2-FINDING-SIAC-11 — Declared Contract/Profile and Negotiated Effective Profile Are Distinct Evidence
A declaration lists allowed/required semantics; negotiation resolves a contextual profile or representation for a binding/interaction and must be recorded independently.

### G2-FINDING-SIAC-12 — Document Validity, Compatibility and Runtime Conformance Are Separate Proof Classes
Schema/spec validation proves document interpretation constraints; compatibility proves a relationship between revisions; conformance proves a specific implementation/profile behaves according to the normative contract.

### G2-FINDING-SIAC-13 — Required and Optional Feature Semantics Need Explicit MUST-UNDERSTAND/Fallback Rules
JSON Schema vocabularies show that unsupported required semantics can require refusal while optional semantics can permit continuation; a flat capability flag loses interoperability-critical behavior.

### G2-FINDING-SIAC-14 — Content/Profile Negotiation Is an Interaction or Binding Outcome, Not Contract Mutation
HTTP negotiation may select a representation without changing resource/API identity, so negotiated results need lineage to the unchanged semantic contract revision.

### G2-FINDING-SIAC-15 — Semantic Problem Type, Protocol Status and Error Occurrence Are Distinct Identities
RFC 9457 demonstrates reusable problem-type identity while HTTP status and a concrete occurrence remain separate evidence; universal error handling must preserve all three.

### G2-FINDING-SIAC-16 — Extension Interoperability Requires Explicit Unknown-Feature Processing Semantics
Safe extension points need ownership plus ignore/fail/fallback or MUST-understand behavior; syntactic acceptance alone does not grant semantic or execution authority.

## Capability discovery candidates

### G2-CAPABILITY-CANDIDATE-NEGOTIATED-CONTRACT-PROFILE-EVIDENCE — CROSS_CUTTING
Evidence: HTTP content negotiation + AsyncAPI schema/content/binding selection + provider effective-capability findings. Promote if Runtime/Provider/Observability synthesis confirms a reusable contract→negotiation→realization evidence primitive.

### G2-CAPABILITY-CANDIDATE-CONFORMANCE-SUITE-RESULT-EVIDENCE — CROSS_CUTTING
Evidence: normative-spec/document distinction, runtime behavior proof needs and existing conformance candidate. Promote if synthesis confirms shared suite identity/revision/subject/profile/freshness lineage across APIs, providers and generated runtimes.

### G2-CAPABILITY-CANDIDATE-STANDARD-FEATURE-REQUIREMENT-SUPPORT-MATRIX — CORE
Evidence: JSON Schema required/optional vocabularies + provider support/effective capability separation. Promote if synthesis needs a deterministic machine-readable matrix between portable requirement, required/optional standard features and provider effective support.

## Value / risk / priority / next question

Value: VERY HIGH — separates portable semantic contracts from negotiation/provider realization while making interoperability testable.

Risk: HIGH — collapsing negotiation, compatibility and conformance would permit false portability claims and provider-specific behavior to leak into the semantic contract.

Priority: HIGH before target provider/binding, runtime and acceptance architecture.

Next question: compose these findings with Lifecycle / Versioning / Evolution / Migration, especially deprecation, compatibility windows, profile evolution and conformance obligations across migration.