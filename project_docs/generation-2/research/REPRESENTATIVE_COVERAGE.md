# Generation 2 — Representative Coverage Ledger

States: `NOT_REVIEWED`, `PARTIAL`, `DEEP`, `N_A`, `LOW_VALUE`.

Previous capability coverage remains authoritative in the corresponding dossiers and state file; this ledger is append-oriented as research advances.

## Standards / Interoperability / API Contracts coverage

| Representative | Coverage | Why this pass matters | Revisit focus |
|---|---|---|---|
| OpenAPI Specification 3.2.0 | DEEP | Separates OAS feature-set version, description/API version, operations, schemas, representations, servers and links; supports discovery and generated tooling without making the description a runtime authority. | Compatibility policy, external reference pinning and generated-client conformance. |
| JSON Schema Draft 2020-12 | DEEP | Provides dialect/vocabulary, `$id`/reference and validation primitives independent of API transport. | Directional compatibility, vocabulary governance and reproducible external-reference resolution. |
| AsyncAPI 3.0.0 | DEEP | Separates channel, message, operation and protocol binding and normatively confines bindings to protocol-specific information. | Schema-format negotiation, protocol-binding replacement and conformance evidence. |
| CNCF CloudEvents 1.0.x | DEEP | Separates portable event identity/context from transport and format bindings. | Event-schema lineage, subscription/discovery boundaries and broker replacement. |
| Protocol Buffers / gRPC | DEEP | Makes wire identity/compatibility explicit and demonstrates generated client/server artifacts derived from stable service/message contracts. | Canonical error mapping, schema registry interaction and cross-format compatibility evidence. |
| GraphQL September 2025 | DEEP | Provides typed schema, introspection and execution/error semantics without defining one universal transport binding. | Deprecation/evolution, persisted-operation identity and transport/conformance boundaries. |

Historical representative coverage for prior capabilities is preserved in `RESEARCH_PIPELINE_STATE.json` and their capability dossiers; no prior status is superseded by this compact ledger update.
