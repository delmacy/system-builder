# Generation 2 — Standards / Interoperability / API Contracts — Revisit 02

Status: REVISIT CYCLE 3 — MATERIAL NEW FINDINGS — NOT SATURATED

## Research question

How should Generation 2 preserve semantic contract identity, lifecycle, extension authority and offline conformance while allowing multiple wire standards, provider realizations, Station-scoped exposure and evolving compatibility windows without confusing deprecation, negotiation, discovery, conformance or removal?

## Representatives

1. OpenAPI Specification 3.2.0 — HTTP API descriptions, operation/security deprecation, representations and specification extensions.
2. JSON Schema Draft 2020-12 — dialects, vocabularies, required/optional interpretation and reference semantics.
3. AsyncAPI Specification 3.0.0 — protocol-neutral channel/message/operation model plus protocol bindings and directional operation semantics.
4. SCIM RFC 7643 — portable resource/schema identity, additive schema extensions, required extensions and provider discovery resources.
5. OpenID Connect Discovery 1.0 — issuer-bound provider metadata and endpoint/capability discovery.
6. OCI Image Specification 1.1 family — content-addressed descriptors, media types, unknown-media-type tolerance and namespaced annotations.
7. IETF RFC 9745 + RFC 8594 — runtime deprecation and sunset lifecycle signaling for HTTP resources.

## Evidence / source ledger

| Representative | Source of truth | Evidence extracted | Coverage |
|---|---|---|---|
| OpenAPI 3.2.0 | https://spec.openapis.org/oas/v3.2.0.html | Operations, parameters and security schemes can be marked deprecated; security alternatives and representations remain explicit; specification extensions remain separate from core semantics. | DEEP |
| JSON Schema 2020-12 | https://json-schema.org/draft/2020-12/draft-bhutton-json-schema-01 | `$schema` binds dialect; `$vocabulary` expresses required/optional interpretation; unsupported required vocabularies require refusal while optional vocabularies permit bounded continuation. | DEEP |
| AsyncAPI 3.0.0 | https://www.asyncapi.com/docs/reference/specification/v3.0.0 | Core is protocol-agnostic; bindings contain protocol-specific information only; send/receive operations are semantic directions and the spec warns that an opposite endpoint cannot be derived by mechanically reversing direction. | DEEP |
| SCIM RFC 7643 | https://www.rfc-editor.org/rfc/rfc7643.html | Schema IDs are portable URIs; extensions are additive and namespaced; ResourceType declares base schema and required/optional schema extensions; provider schema resources are discoverable/read-only. | DEEP |
| OpenID Connect Discovery | https://openid.net/specs/openid-connect-discovery-1_0.html | Provider metadata is issuer-bound; returned issuer must match discovery and token issuer identity, while endpoints/capabilities are provider metadata rather than proof of application semantics. | DEEP |
| OCI Image Spec | https://github.com/opencontainers/image-spec/blob/main/descriptor.md ; https://github.com/opencontainers/image-spec/blob/main/manifest.md ; https://github.com/opencontainers/image-spec/blob/main/annotations.md | Descriptor mediaType/digest/size identify representation; unknown manifest media types must not automatically fail storage/copy; annotations use namespaced keys and OCI reserves its namespace. | DEEP |
| RFC 9745 / RFC 8594 | https://www.rfc-editor.org/rfc/rfc9745.html ; https://www.rfc-editor.org/rfc/rfc8594.html | Deprecation signals lifecycle intent without changing resource behavior; Sunset separately communicates intended unavailability and cannot precede deprecation when both are supplied. | DEEP |

## Source of truth

The semantic contract/profile revision is normative for business/operation meaning. Standard representation, dialect, protocol binding, provider discovery metadata, endpoint, negotiated representation, lifecycle signal and conformance observation are projections or evidence unless an imported external contract has explicitly been elected as semantic authority.

A standard document is not itself sufficient runtime truth. Provider metadata can advertise support; a schema can be syntactically valid; a resource can be marked deprecated; none individually proves the effective provider behavior or changes the semantic contract.

## Identity

Keep distinct:

- semantic contract and revision;
- semantic operation/message/resource identity;
- contract profile and mandatory/optional features;
- standard representation and standard/dialect revision;
- referenced schema/vocabulary/extension namespace identity;
- provider support/discovery claim;
- binding/endpoint realization;
- negotiation attempt/result;
- compatibility assessment and rule-set revision;
- conformance suite/result;
- deprecation declaration/effective date;
- sunset/removal declaration/effective date;
- observed effective behavior.

## Lifecycle

Preferred lifecycle:

`draft -> validate interpretation closure -> publish -> expose -> bind -> negotiate -> exercise/conformance-test -> deprecate -> compatibility window -> sunset/withdraw -> retain historical evidence`.

Deprecation and withdrawal are not synonyms. RFC 9745 explicitly states that deprecation does not change resource behavior, while Sunset carries separate information about expected unavailability. Therefore compatibility windows need their own lifecycle evidence rather than inferring breakage from `deprecated=true`.

Station exposure is also a separate lifecycle: a canonical contract may be published enterprise-wide but exposed only to selected Stations, roles or external tenants. Exposure does not clone or fork semantic ownership.

## Versioning / compatibility windows

At least five axes can evolve independently:

1. semantic contract revision;
2. profile/feature-set revision;
3. representation/dialect/standard revision;
4. provider implementation revision;
5. lifecycle/exposure policy revision.

Compatibility must remain directional and contextual. A deprecation date starts or reports a lifecycle condition; it is not evidence that old and new revisions are incompatible. A sunset date is likewise not a compatibility proof: it is an availability/lifecycle decision.

A compatibility window should therefore bind `consumer revision/profile -> producer revision/profile`, rule-set revision, start/end policy, tolerated fallback and required conformance evidence.

## Failure semantics

Distinguish:

- invalid or uninterpretable contract document;
- incomplete interpretation closure (missing referenced schema/vocabulary/standard material);
- unsupported mandatory vocabulary/profile feature;
- unknown optional/ignorable extension;
- namespace collision or unauthorized extension owner;
- provider discovery metadata mismatch;
- binding/endpoint unavailable;
- negotiation failure;
- compatibility assessment failure;
- runtime conformance failure despite valid declaration;
- deprecated-but-still-supported;
- sunset/withdrawn;
- Station exposure denied;
- observed behavior unknown because evidence is unavailable.

Unknown-feature behavior cannot be globally `accept` or `reject`. JSON Schema shows required vocabularies that must be understood; OCI manifest portability shows contexts where unknown media types must not cause storage/copy failure. Processing semantics belong to the relevant semantic profile and operation.

## Extensibility

SCIM schema URIs, JSON Schema vocabularies, OpenAPI specification extensions and OCI reverse-domain annotations converge on explicit extension ownership/namespace.

Generation 2 should treat extension metadata as data until a profile grants interpretation authority. Namespace recognition does not grant execution, authorization, provider selection or canonical-domain mutation authority. Required extension/vocabulary semantics must be explicit; unknown optional extensions need defined ignore/preserve/fallback behavior.

## Provider boundaries / negotiation ownership

Standards owns semantic contract/profile interpretation, compatibility rules and conformance procedure semantics. Provider / Binding owns candidate provider discovery, admission and effective binding selection.

OIDC Discovery is a useful boundary proof: issuer metadata can declare endpoints and supported features and has strong identity consistency requirements, but discovery is still a provider claim. It does not replace a contract-level conformance proof.

Negotiation resolves an allowed representation/profile for a binding/interaction. It must never silently mutate the canonical contract or grant missing capability authority.

## Governance

Governance should control:

- semantic contract/profile publication authority;
- standard/dialect revisions permitted for projection;
- extension namespaces and owners;
- mandatory/optional feature processing semantics;
- compatibility rule-set and window policy;
- deprecation/sunset authority and notice requirements;
- Station/tenant exposure policy;
- conformance suite revision and evidence freshness;
- external/imported contract authority election.

Deprecation should preserve replacement/migration references and historical consumers. Sunset/removal requires separate authority because it changes availability rather than merely signaling lifecycle intent.

## Observability

Runtime evidence should be able to correlate semantic contract revision, operation/message identity, Station exposure revision, binding/provider revision, negotiated representation/profile, provider discovery revision, lifecycle state, outcome and conformance result without recording sensitive payloads by default.

Observed support is not equivalent to advertised support. `UNKNOWN` is required when conformance evidence or provider observation is unavailable.

## Portability / lock-in / offline conformance

Portability requires an **interpretation closure**, not only an exported OpenAPI/AsyncAPI/JSON Schema document. Offline/self-hosted conformance may require:

- semantic contract/profile revision;
- all referenced schemas and external documents needed for machine interpretation;
- standard/dialect/vocabulary identifiers and required processing semantics;
- compatibility rule set;
- conformance suite and fixtures;
- extension namespace definitions that are mandatory;
- trust/signature material required to verify the bundle;
- provider-independent expected semantic outcomes.

Provider endpoints, secrets and mutable discovery metadata are realizations and must not be required merely to interpret the portable semantic contract.

## Product-specific mechanism vs universal primitive

| Product/standard mechanism | Universal primitive |
|---|---|
| OpenAPI `deprecated` | lifecycle deprecation declaration scoped to contract element |
| HTTP `Deprecation` + `Sunset` | deprecation intent + separate withdrawal/unavailability intent |
| JSON Schema `$schema` / `$vocabulary` | interpretation dialect + mandatory/optional feature requirement |
| SCIM schema URI + `schemaExtensions.required` | portable namespace identity + additive required/optional extension profile |
| OIDC discovery metadata | identity-bound provider support/discovery claim |
| AsyncAPI protocol binding | provider/protocol realization descriptor |
| OCI mediaType + digest + unknown-type tolerance | typed representation identity + integrity + operation-scoped unknown-feature handling |
| OCI reverse-domain annotations | namespaced extension ownership |

## Convergent patterns

1. Semantic identity is distinct from its wire representation and provider realization.
2. Extensions require explicit namespace/owner plus processing semantics.
3. Discovery/advertisement is a claim; conformance is a proof class.
4. Deprecation is distinct from removal/unavailability.
5. Required/optional semantics determine whether unsupported features fail or permit bounded continuation.
6. Provider/protocol-specific bindings should not own semantic meaning.
7. Portable validation/conformance requires closure over referenced interpretation material.

## Divergent patterns

- JSON Schema required vocabularies require hard refusal when unsupported, while OCI requires tolerant handling of unknown media types in storage/copy contexts.
- OIDC binds discovery metadata tightly to issuer identity; OpenAPI and AsyncAPI descriptions can model APIs independent of a concrete runtime provider.
- SCIM extensions are explicitly additive and namespaced; arbitrary standard extensions elsewhere may have weaker or implementation-defined processing semantics.
- HTTP deprecation is informational and behavior-preserving; sunset concerns planned availability.

The divergence is itself architectural evidence: unknown-feature behavior and lifecycle effects must be profile/operation-scoped instead of encoded as global booleans.

## Subcapabilities

- Semantic contract/profile registry.
- Interpretation closure manifest.
- Standard/dialect/vocabulary projection.
- Mandatory/optional profile feature matrix.
- Extension namespace and processing-policy registry.
- Provider discovery-claim normalization.
- Negotiation attempt/result evidence.
- Directional compatibility assessment + compatibility-window evidence.
- Deprecation/sunset lifecycle evidence.
- Conformance suite/result lineage.
- Station-scoped contract exposure projection.
- Offline validation/conformance bundle.

## Fresh-main comparison — bounded evidence only

Fresh `main` `packages/contracts/system-definition/system-definition.schema.json` is still JSON Schema Draft 2020-12 with stable `$id`. `integrations[]` has logical `id`, free-form string `contract`, direction, requirement references and an optional invocation constrained to HTTP method/path + `bindingRef`.

This is evidence for **KEEP** stable schema identity, logical integration identity and existing separation of `bindingRef`. It supports **HARDEN/GENERALIZE** as hypotheses for typed semantic contract/profile revision, interpretation closure, lifecycle/exposure evidence and protocol-independent invocation representation. This file does not establish repository-wide absence; full archaeology remains reserved for PLANNING_B.

A bounded fresh-main code search for `OpenAPI AsyncAPI SCIM contractRevision conformance integration contract` returned no match. This is only negative search evidence for those terms, not proof of repository-wide absence.

## Reconciliation hypotheses

- **KEEP** stable logical integration identity, requirement linkage and provider binding reference separation.
- **HARDEN** contract references into typed semantic identity/revision/profile references when planning archaeology confirms ownership.
- **GENERALIZE** HTTP invocation into one representation/binding realization rather than canonical API meaning.
- **INTEGRATE** compatibility-window, deprecation/sunset and conformance evidence with Lifecycle and Evidence/Provenance.
- **PROVIDERIZE** discovery metadata, endpoints and runtime support claims while preserving semantic contract ownership.
- **GENERALIZE** a portable interpretation-closure manifest for offline/self-hosted validation/conformance.
- **HARDEN** Station exposure as a non-amplifying projection over canonical contracts.
- **DEFER** universal wire protocol or bespoke API-description language.
- **DO_NOT_BUILD** global `supportsExtension=true`, `compatible=true` or `deprecatedMeansUnavailable=true` booleans.
- **DO_NOT_BUILD** automatic inverse operations by flipping AsyncAPI send/receive direction.

## Questions for repository validation

1. Is `integrations[].contract` parsed/resolved/versioned anywhere outside `SystemDefinition`?
2. Can a contract reference all external schemas/vocabularies required for offline interpretation?
3. Is compatibility directional and rule-set/version aware anywhere in compiler/runtime contracts?
4. Are deprecation, sunset/removal and actual runtime availability modeled separately?
5. Can provider discovery claims be persisted separately from verified conformance evidence?
6. Are extension namespaces/owners and unknown-feature processing rules explicit anywhere?
7. Is Station/tenant capability exposure represented as projection without cloning canonical contract definitions?
8. Can generated runtime conformance be exercised without the SB control plane and without mutable provider metadata?
9. Do tests prevent automatic authority amplification from contract discovery or extension recognition?
10. Is semantic operation direction preserved independently of protocol topology/broker addressing?

## Adaptive Governed Work Surfaces boundary

AGWS remains distinct from generic low-code UI. Under `Enterprise → Station → Role → Person`, a work surface may consume only semantic operations/contracts exposed to its effective Station/Role. AI may materialize list/form/grid/action bindings over admitted contracts, but it cannot:

- invent an endpoint or arbitrary query to escape an admitted semantic operation;
- accept an unknown required vocabulary silently;
- promote a provider discovery claim into trusted capability;
- expose a contract outside Station authority;
- turn an extension namespace into domain/execution authority;
- use deprecation as permission to auto-migrate canonical processes without the appropriate lifecycle authority.

A surface remains provider-independent when its binding references a semantic operation/profile and provider resolution is delegated to the binding plane.

## Symbiotic Proof

A contract capability is symbiotically complete when one semantic operation/profile can be projected to at least two standard representations, exported with complete offline interpretation material, bound to two provider realizations, advertise and verify mandatory/optional feature support independently, preserve direction and semantic error identity, apply a directional compatibility window, deprecate without changing runtime semantics, later sunset through separate authority, expose the same canonical contract to one Station while withholding it from another, and rerun conformance offline after the Builder/control plane is unavailable.

## Stable findings

### G2-FINDING-SIAC-17 — Deprecation, Compatibility, Sunset and Runtime Availability Are Separate Lifecycle Evidence
Deprecation communicates lifecycle intent without itself changing behavior; compatibility and eventual withdrawal require separate rules/evidence. A deprecated contract can remain conformant and available inside an explicit compatibility window.

### G2-FINDING-SIAC-18 — Extension Namespaces Need Ownership Plus Processing Authority; Recognition Alone Grants No Semantic or Execution Authority
SCIM, JSON Schema and OCI converge on namespaced extensions, but processing consequences differ. Generation 2 must bind namespace owner, mandatory/optional semantics and allowed interpretation authority explicitly.

### G2-FINDING-SIAC-19 — Provider Discovery Metadata Is an Identity-Bound Support Claim, Not Runtime Conformance Proof
OIDC issuer metadata shows discovery can be strongly identity-consistent while remaining provider-declared capability/endpoint metadata; effective support still requires admission/observation/conformance evidence.

### G2-FINDING-SIAC-20 — Unknown-Feature Handling Is Profile-and-Operation Scoped, Not a Global Accept/Reject Policy
JSON Schema required vocabularies can require refusal while OCI storage/copy requires tolerance of unknown media types. The governing semantic profile and operation determine fail/ignore/preserve/fallback behavior.

### G2-FINDING-SIAC-21 — Portable Offline Conformance Requires an Interpretation Closure, Not a Standalone Contract Document
A portable contract must carry or reference all required dialect/vocabulary/schema/profile/conformance/trust material needed to interpret and prove semantics without mutable control-plane/provider reachability.

### G2-FINDING-SIAC-22 — Station Contract Exposure Is a Non-Amplifying Projection Over Canonical Contract Authority
Enterprise/Station policy may expose only a subset of canonical operations/profiles. Exposure identity/revision must be separate from the semantic contract so lower layers cannot fork meaning or acquire ungranted operations.

## Capability discovery candidates

### G2-CAPABILITY-CANDIDATE-CONTRACT-DEPRECATION-SUNSET-COMPATIBILITY-WINDOW-EVIDENCE — CROSS_CUTTING
Evidence: OpenAPI deprecation + RFC 9745 behavior-preserving deprecation + RFC 8594 sunset. Promote only if Lifecycle/Product Proof confirms reusable lifecycle evidence across APIs, events, providers and generated runtimes.

### G2-CAPABILITY-CANDIDATE-PORTABLE-CONTRACT-INTERPRETATION-CLOSURE — CORE
Evidence: JSON Schema dialect/vocabulary/reference requirements + multi-document OpenAPI/AsyncAPI + offline conformance need. Promote if synthesis confirms a reusable closure manifest distinct from Artifact build dependency closure.

### G2-CAPABILITY-CANDIDATE-STATION-SCOPED-CONTRACT-EXPOSURE-PROJECTION — CROSS_CUTTING
Evidence: canonical contract/provider separation plus mandatory Enterprise → Station → Role → Person authority model. Promote only if AGWS/Provider/Authorization synthesis confirms one reusable exposure-projection primitive.

## Value / risk / priority / next question

Value: VERY HIGH — makes interoperability, lifecycle and portability objectively testable without coupling semantic contracts to providers or transports.

Risk: HIGH — collapsing deprecation into removal, discovery into conformance or extension recognition into authority can create silent breakage, provider lock-in and privilege amplification.

Priority: HIGH before Lifecycle, target provider/binding architecture and product acceptance.

Next question: compose contract lifecycle/compatibility-window evidence with Lifecycle / Versioning / Evolution / Migration, particularly coexistence, migration authority, rollback, consumer evidence and retirement criteria.