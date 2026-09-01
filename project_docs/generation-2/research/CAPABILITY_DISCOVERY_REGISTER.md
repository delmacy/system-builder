# Generation 2 — Capability Discovery Register

Promotion requires multi-representative evidence or a clear structural System Builder need. Candidates are not architecture decisions.

Existing candidates through `G2-CAPABILITY-CANDIDATE-CAPABILITY-NEGOTIATION-RESULT` remain CANDIDATE with their prior classifications and promotion conditions recorded in pipeline history and capability dossiers.

| Candidate | Class | Evidence origin | Status | Promotion condition |
|---|---|---|---|---|
| G2-CAPABILITY-CANDIDATE-CONTRACT-COMPATIBILITY-EVIDENCE | CROSS_CUTTING | Protobuf wire compatibility + JSON Schema directional validation effects + OpenAPI/GraphQL/AsyncAPI evolution requirements | CANDIDATE | Promote if Lifecycle/Migration and Artifact/Release synthesis require one reusable compatibility-result primitive across contract families. |
| G2-CAPABILITY-CANDIDATE-EXTERNAL-CONTRACT-REFERENCE-RESOLUTION | CORE | OpenAPI multi-document references + JSON Schema `$id`/references + AsyncAPI references | CANDIDATE | Promote if repository archaeology confirms imported/external contracts need reproducible resolution independent of product-specific registries. |
| G2-CAPABILITY-CANDIDATE-CONTRACT-CONFORMANCE-EVIDENCE | CROSS_CUTTING | Schema validation + generated binding tests + runtime operation/message conformance across representatives | CANDIDATE | Promote if Observability, Governance and Release acceptance converge on one shared conformance-evidence model. |

This compact register view does not revoke or supersede earlier candidates; `RESEARCH_PIPELINE_STATE.json` is the authoritative candidate inventory.
