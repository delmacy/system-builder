# Generation 2 — Standards / Interoperability / API Contracts

Status: FIRST DEEP PASS — NOT SATURATED

## Research question

What should System Builder treat as universal contract primitives so generated systems can expose and consume interoperable APIs without making OpenAPI, AsyncAPI, CloudEvents, Protobuf/gRPC, GraphQL, JSON Schema, a transport, or a vendor registry the semantic source of truth?

## Representatives

1. OpenAPI Specification 3.2.0 — HTTP API description, operations, representations, security descriptions, links, external references and tooling-facing discovery.
2. JSON Schema Draft 2020-12 — schema dialect/vocabulary model, identifier/reference semantics and validation contract substrate.
3. AsyncAPI 3.0.0 — protocol-agnostic message-driven API descriptions with explicit channels, messages, operations and protocol bindings.
4. CNCF CloudEvents 1.0.x — portable event envelope/context identity separated from transport bindings and event data schema.
5. Protocol Buffers / gRPC — strongly versioned message/service contracts, generated client/server bindings and explicit wire-compatibility constraints.
6. GraphQL September 2025 specification — typed schema, field/argument contract, introspection and execution/error semantics with transport kept outside the core specification.

## Evidence / source ledger

| Representative | Source of truth used | Evidence extracted | Coverage |
|---|---|---|---|
| OpenAPI 3.2.0 | `spec.openapis.org/oas/v3.2.0.html` | OAS version is distinct from OAD/API version; OAD describes service capabilities; operations, media types, schemas, servers and links are separately modeled; normative prose outranks its informational JSON Schema. | DEEP |
| JSON Schema 2020-12 | `json-schema.org/draft/2020-12/` family | Dialect/vocabulary identity, `$id`/reference semantics and validation are separable from any API protocol. | DEEP |
| AsyncAPI 3.0.0 | `asyncapi.com/docs/reference/specification/v3.0.0` + binding specs | Message-driven API model is protocol-agnostic; protocol bindings MUST carry protocol-specific information only; channels, messages and operations have distinct identities. | DEEP |
| CloudEvents 1.0.x | CNCF CloudEvents specification family | Event context has portable identity/type/source semantics while protocol and format bindings remain separate; event identity is not broker/topic identity. | DEEP |
| Protobuf / gRPC | `protobuf.dev/programming-guides/proto3/` and gRPC contract model | Field numbers are wire identity; some schema changes are wire-safe and others unsafe; generated bindings are derived from contracts rather than the semantic contract itself. | DEEP |
| GraphQL September 2025 | `spec.graphql.org/September2025/` | Schema/type system, introspection and execution/error model are specified independently from a universal transport contract. | DEEP |

## Source of truth

A portable semantic contract MUST have an explicit logical identity and revision. Standard documents and protocol bindings are representations or projections unless the user/imported system deliberately elects an external standard artifact as the authoritative contract. Retrieval URL, provider endpoint, generated SDK, schema registry locator and deployment address MUST NOT silently become contract identity.

A standard's own specification version is different from the version of a user's API/contract. OpenAPI makes this distinction explicit: the `openapi` specification version is not the same thing as `info.version`, and neither alone defines an API evolution policy.

## Identity

At minimum distinguish:

- semantic contract identity;
- semantic contract revision;
- operation/message/event/schema identity within that contract;
- representation/projection identity (OpenAPI document, AsyncAPI document, `.proto`, GraphQL SDL, JSON Schema document);
- representation format/specification/dialect version;
- protocol binding identity/revision;
- provider endpoint/deployment locator;
- generated client/server artifact revision;
- conformance result/evidence.

CloudEvents further demonstrates that event identity (`source` + `id`) is separate from channel, broker, HTTP request or storage identity.

## Lifecycle

A mature contract lifecycle is `draft -> validated -> published -> bound/deployed -> observed -> deprecated -> superseded/retired`, but each stage needs explicit authority. Publication does not activate an endpoint. Deployment does not prove compatibility. A generated SDK does not become the contract source of truth. Deprecation should remain machine-readable and should not imply immediate removal.

## Versioning and compatibility

Compatibility is relationship-specific evidence, not a universal semantic-version boolean.

Examples:

- Protobuf binary compatibility depends on field-number/type evolution rules and differs for ProtoJSON/text formats.
- OpenAPI specification-version compatibility says nothing by itself about whether two described APIs are consumer-compatible.
- JSON Schema validation compatibility can be directional: a new schema can accept a superset or subset of instances depending on the change.
- GraphQL commonly supports additive evolution, but removal/change of fields or arguments has different consumer impact.
- AsyncAPI schema and protocol-binding changes can evolve independently.

Therefore a compatibility result should name producer revision, consumer/required revision or constraints, representation/protocol context, direction, rule set and evidence.

## Failure semantics

Contract failures are not one category. Distinguish at least:

1. description/schema invalid;
2. unresolved reference or unsupported dialect/spec version;
3. incompatible revision/negotiation failure;
4. serialization/deserialization failure;
5. protocol binding failure;
6. transport/connectivity failure;
7. authentication/authorization denial;
8. remote operation application error;
9. response/message conformance violation;
10. generated binding/tooling incompatibility.

A provider-specific HTTP status or gRPC status can be mapped to a canonical operation outcome, but the universal primitive MUST preserve the original provider/protocol evidence rather than pretending all error models are identical.

## Extensibility

Standards repeatedly use controlled extension seams: OpenAPI specification extensions, AsyncAPI protocol bindings and extensions, JSON Schema vocabularies, protobuf custom options, GraphQL directives. The convergent lesson is not to invent one extension syntax; it is to preserve ownership, namespace/version, validation semantics, optionality and fallback behavior. Unknown extensions MUST NOT accidentally gain semantic or execution authority.

## Provider boundaries

Protocol and provider details belong behind explicit bindings. AsyncAPI is especially instructive: it is protocol-agnostic and states that protocol bindings must contain protocol-specific information only. The SB should therefore be able to express a semantic operation/message/event requirement separately from HTTP/Kafka/gRPC/GraphQL/provider-specific binding metadata.

Endpoint URLs, topic names, broker settings, TLS materials and provider credentials are environment/deployment bindings, not portable semantic identity.

## Governance

Governance should cover contract ownership, publication authority, review status, compatibility policy, deprecation window, allowed external references, security classification and evidence retention. Generated descriptions may be governed outputs, but generation alone does not authorize publication or external exposure.

External references need trust policy: URI resolution, digest/version pinning where possible, provenance and allowed namespace/source. A mutable URL is insufficient evidence for reproducible contract resolution.

## Observability

Runtime evidence should correlate operation/message/event identity and semantic contract revision with binding/provider/runtime revision while avoiding high-cardinality or sensitive payload leakage. Conformance evidence can include request/response validation, message-schema validation, protocol negotiation result and generated-client compatibility tests.

Observability MUST NOT redefine contract semantics based merely on observed traffic. Observed deviations are evidence for reconciliation or evolution, not automatic mutation authority.

## Portability and lock-in

Portable semantics are strongest when provider endpoint, protocol encoding, schema registry, generated language bindings and vendor gateways are replaceable. Lock-in rises when any of those become the only location where operation semantics, identifiers, compatibility history or error meaning exist.

Exportable contracts and evidence should allow a generated runtime to operate, validate and expose APIs without requiring a live Builder control plane.

## Product-specific mechanism vs universal primitive

| Product/standard mechanism | Universal primitive candidate |
|---|---|
| OpenAPI `paths`/Operation Object | semantic operation contract + HTTP projection/binding |
| OpenAPI Server Object | deployment/provider endpoint binding |
| JSON Schema `$id` + dialect | schema representation identity + schema language/dialect metadata |
| AsyncAPI channel/message/operation | message operation contract + channel abstraction |
| AsyncAPI protocol binding | protocol-specific binding descriptor |
| CloudEvents context | portable event envelope/context contract |
| `.proto` service/message + field number | service/message representation with explicit wire-compatibility rules |
| GraphQL schema/type/field | query operation surface representation |
| generated SDK/stub | derived artifact with lineage to contract revision |
| vendor schema/API registry | provider for publication/discovery, not logical contract authority by default |

## Convergent patterns

1. Contract semantics and wire/protocol representation are separable.
2. Standard/specification version and user contract revision are distinct.
3. Bindings carry protocol-specific concerns while the higher-level contract can remain provider-neutral.
4. Compatibility is directional/contextual and must be evaluated against explicit rules.
5. Generated code is derived evidence/artifact, not the contract source of truth.
6. References and registries require explicit resolution/trust semantics.
7. Operation/message/event identities should survive endpoint/provider replacement.
8. Conformance requires evidence from implementation/runtime, not document existence alone.

## Divergent patterns

- OpenAPI centers HTTP request/response; AsyncAPI centers asynchronous/message-driven interactions.
- CloudEvents standardizes event context rather than the complete application API.
- Protobuf couples schema choices tightly to binary wire compatibility and code generation.
- GraphQL has an integrated typed execution model and introspection rather than a generic multi-protocol binding model.
- JSON Schema is a schema language substrate and intentionally does not define operation or transport semantics.

The divergence argues against a single universal API document model. SB should instead keep small primitives and projections.

## Subcapabilities

- Semantic contract registry and revision lineage.
- Schema/document identity and external-reference resolution.
- Operation/message/event contract modeling.
- Protocol/provider binding descriptors.
- Compatibility requirement and evaluation evidence.
- Canonical outcome/error envelope with original protocol evidence.
- Contract publication/discovery.
- Generated client/server lineage.
- Conformance validation/evidence.
- Content/media negotiation and serialization profile.

## Fresh-main comparison

Fresh `main` already has a substantial contract seam under `packages/contracts/**`, and `SystemDefinition` is itself JSON Schema Draft 2020-12 with a stable `$id` carrying a `1.0.0` contract path. It models `integrations[]` with stable integration `id`, free-form `contract`, `direction`, requirement references and an optional HTTP invocation containing method, path and environment `bindingRef`. This is concrete evidence that SB already separates some logical integration intent from deployment binding.

However the current bounded schema makes HTTP the only evidenced invocation kind in `SystemDefinition`; `contract` is only a string and does not evidence a universal contract identity/revision/representation model; there is no repository evidence in this pass of OpenAPI/AsyncAPI/GraphQL/gRPC export/import, protocol negotiation, compatibility evaluation, generated SDK lineage or a universal API registry. Do not infer those capabilities.

Hypothesis: **KEEP + HARDEN + GENERALIZE + PROVIDERIZE** the existing contract/integration seams; do not replace the `SystemDefinition` contract merely to adopt an external API standard.

## Reconciliation hypotheses

- KEEP the existing JSON Schema 2020-12 contract discipline and stable `$id` practice.
- HARDEN contract identity/revision and external reference lineage rather than relying on free-form `contract` strings.
- GENERALIZE integration semantics so HTTP invocation is one projection/binding, not the universal integration model.
- PROVIDERIZE publication/discovery/schema registry/API gateway and endpoint bindings.
- INTEGRATE standard projections/exporters/importers only when evidence shows product value and conformance can be tested.
- DEFER a universal generated-SDK subsystem until target architecture proves it is needed across multiple surfaces.
- DO_NOT_BUILD a bespoke universal wire protocol or one mega-schema attempting to subsume OpenAPI, AsyncAPI, CloudEvents, Protobuf and GraphQL.

## Questions for repository validation

1. Which package owns the authoritative identity/revision of every public contract today, and is it consistent across `packages/contracts/**`?
2. Is the free-form `integrations[].contract` value resolved or validated anywhere, or is it currently documentation only?
3. Are compatibility policies/tests present for contract changes beyond JSON Schema validation fixtures?
4. Do release/artifact provenance records include contract/schema revisions used to generate runtime artifacts?
5. Is there already a hidden projection/export surface for OpenAPI, AsyncAPI or generated clients outside `packages/contracts/**`?
6. How are runtime HTTP errors represented and correlated back to integration/action identity?
7. Can external schema/reference content be pinned by digest/revision rather than mutable locator?
8. Which semantics must remain autonomous inside generated runtimes when Builder is unavailable?

## Symbiotic Proof

A Generation 2 contract model is symbiotically useful when one logical integration capability can:

1. be authored once with stable semantic operation/message/event identities;
2. be projected to at least one native HTTP contract and one non-HTTP or externally governed contract without changing business identity;
3. bind to different endpoints/providers by environment;
4. evaluate compatibility before replacement/promotion;
5. emit conformance evidence tied to contract and binding revisions;
6. regenerate/rebind a client/runtime without making the Builder, gateway or registry a runtime dependency;
7. preserve original protocol/provider evidence for diagnosis and audit.

## Stable findings

### G2-FINDING-SIAC-01 — Semantic Contract Identity, Representation Identity and Provider Endpoint Are Distinct
A contract must survive export format and deployment/provider replacement.

### G2-FINDING-SIAC-02 — Specification/Dialect Version and User Contract Revision Are Distinct
OpenAPI/JSON Schema/AsyncAPI/GraphQL/Protobuf versions describe interpretation rules, not the user's semantic API evolution by themselves.

### G2-FINDING-SIAC-03 — Compatibility Is Directional, Contextual Evidence Rather Than a Universal Boolean
Producer/consumer direction, representation, protocol and rule set must be recorded with the result.

### G2-FINDING-SIAC-04 — Protocol Bindings Must Not Own Provider-Neutral Operation Semantics
HTTP/Kafka/gRPC/provider details belong behind explicit bindings or projections.

### G2-FINDING-SIAC-05 — Generated Clients and Servers Are Derived Artifacts With Contract Lineage
Generated code can be rebuilt/replaced and must not become the only semantic source of truth.

### G2-FINDING-SIAC-06 — External References Need Resolution, Version/Digest and Trust Evidence
A mutable URL or registry locator is insufficient for reproducible portable contracts.

### G2-FINDING-SIAC-07 — Canonical Error Semantics Must Preserve Original Protocol Evidence
Universal outcomes can normalize categories without erasing HTTP/gRPC/broker/provider details needed for diagnosis.

### G2-FINDING-SIAC-08 — Event Identity Is Independent of Transport and Channel Identity
CloudEvents demonstrates that event source/id/type can remain stable across protocol/broker bindings.

### G2-FINDING-SIAC-09 — Contract Publication/Discovery Does Not Prove Deployment or Conformance
Published descriptions, active endpoints and runtime-conformant implementations require separate evidence.

### G2-FINDING-SIAC-10 — Runtime Autonomy Requires Exportable Contracts and Deployment-Local Binding Resolution
Generated systems must remain able to validate/serve/consume their interfaces without a live Builder control plane.

## Capability discovery candidates

### G2-CAPABILITY-CANDIDATE-CONTRACT-COMPATIBILITY-EVIDENCE — CROSS_CUTTING
Evidence: Protobuf wire compatibility, JSON Schema validation directionality, API evolution requirements across OpenAPI/GraphQL/AsyncAPI. Promote if Lifecycle/Migration and Artifact/Release synthesis require one reusable compatibility-result primitive.

### G2-CAPABILITY-CANDIDATE-EXTERNAL-CONTRACT-REFERENCE-RESOLUTION — CORE
Evidence: OpenAPI multi-document references, JSON Schema `$id`/references and AsyncAPI references. Promote if repository archaeology confirms imported/external contracts need reproducible resolution independent of product-specific registries.

### G2-CAPABILITY-CANDIDATE-CONTRACT-CONFORMANCE-EVIDENCE — CROSS_CUTTING
Evidence: schema validation, generated binding tests and runtime operation/message conformance across representatives. Promote if Observability/Governance/Release acceptance converge on a shared conformance evidence model.

## Value / risk / priority / next question

Value: VERY HIGH — interoperability directly determines whether SB-generated systems remain portable and can integrate into external ecosystems without semantic lock-in.

Risk: HIGH — importing a standard wholesale could turn an HTTP/event/schema representation into the universal architecture and recreate provider/protocol lock-in at the modeling layer.

Priority: HIGH before target architecture, provider negotiation and lifecycle synthesis.

Next question: after the remaining first-pass capabilities, revisit this capability to test compatibility-policy composition, canonical error boundaries, external reference trust/pinning and whether `contract` in fresh-main `SystemDefinition` is only descriptive or already resolved elsewhere.
