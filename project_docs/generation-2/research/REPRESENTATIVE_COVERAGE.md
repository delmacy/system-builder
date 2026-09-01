# Generation 2 — Representative Coverage Ledger

States: `NOT_REVIEWED`, `PARTIAL`, `DEEP`, `N_A`, `LOW_VALUE`.

| Representative | Universal Capability Architecture | Process & Application Modeling | UI / Generated Experience / Low-code Builder | Workflow & Durable Execution | Integration & Automation | Notes |
|---|---|---|---|---|---|---|
| OASIS TOSCA 2.0 | DEEP | NOT_REVIEWED | N_A | N_A | N_A | Requirement/capability/relationship/fulfillment model. |
| Kubernetes declarative API/controllers | DEEP | NOT_REVIEWED | N_A | PARTIAL | N_A | Desired/observed separation and reconciliation lifecycle; not a workflow engine. |
| Terraform provider model | DEEP | NOT_REVIEWED | N_A | N_A | PARTIAL | Provider identity/version/schema informs connector/provider boundary. |
| Backstage Software Catalog | PARTIAL | NOT_REVIEWED | NOT_REVIEWED | N_A | N_A | Entity identity, relations and extension authority. |
| Mendix | NOT_REVIEWED | DEEP | DEEP | NOT_REVIEWED | NOT_REVIEWED | Explicit page structure + Atlas design system, theme governance and reusable UI modules. |
| ServiceNow App Engine / Flow Designer | NOT_REVIEWED | DEEP | NOT_REVIEWED | NOT_REVIEWED | PARTIAL | Scoped application/data model plus reusable typed flow/action composition. |
| Microsoft Power Apps / Dataverse | NOT_REVIEWED | DEEP | NOT_REVIEWED | N_A | NOT_REVIEWED | Data-model-first apps; generated forms/views; solution ALM and strong Dataverse coupling. |
| Salesforce Platform | NOT_REVIEWED | DEEP | NOT_REVIEWED | NOT_REVIEWED | NOT_REVIEWED | Metadata-driven objects/relations/flows and packages. |
| OutSystems | NOT_REVIEWED | NOT_REVIEWED | DEEP | NOT_REVIEWED | NOT_REVIEWED | Responsive UI patterns, theme/style-guide libraries, reusable templates and custom-pattern extension. |
| Retool | NOT_REVIEWED | NOT_REVIEWED | PARTIAL | N_A | NOT_REVIEWED | Platform-centric app builder; useful hosted-builder/control-plane contrast. |
| Appsmith | NOT_REVIEWED | NOT_REVIEWED | DEEP | N_A | NOT_REVIEWED | Open-source/self-hostable widget builder with datasource/query/JavaScript composition and Git collaboration. |
| FlutterFlow | NOT_REVIEWED | NOT_REVIEWED | DEEP | N_A | N_A | Visual widget tree, generated Widget/Model code, reusable components, custom-code/package escape hatch and exportable project structure. |
| Temporal | NOT_REVIEWED | N_A | N_A | PARTIAL | N_A | Crash-resilient durable workflow reference; later revisit needed for deeper history/replay, message and worker-versioning evidence. |
| Camunda 8 / Zeebe | NOT_REVIEWED | PARTIAL | N_A | DEEP | PARTIAL | Process definition/version identity, job workers, retries/incidents and connector boundary. |
| AWS Step Functions | NOT_REVIEWED | N_A | N_A | DEEP | PARTIAL | Managed state-machine execution history and service-integration contrast. |
| Azure Durable Functions / Durable Task | NOT_REVIEWED | N_A | N_A | DEEP | N_A | Replay-deterministic orchestration with explicit nondeterminism/version-isolation constraints. |
| Restate | NOT_REVIEWED | N_A | N_A | DEEP | PARTIAL | Reliable service calls inform side-effect/retry boundary. |
| n8n | NOT_REVIEWED | NOT_REVIEWED | PARTIAL | PARTIAL | DEEP | Visual/self-hostable automation; sub-workflows, execution history, error workflows, Git environments and queue workers. |
| MuleSoft Anypoint Platform | NOT_REVIEWED | NOT_REVIEWED | N_A | PARTIAL | DEEP | Enterprise connectors/APIs, policies, proxies, topology and connector/API observability. |
| Zapier Platform | NOT_REVIEWED | N_A | PARTIAL | PARTIAL | DEEP | Authentication/Trigger/Action contracts, UI/CLI authoring, bounded code escape hatch and integration versioning. |
| Make | NOT_REVIEWED | N_A | PARTIAL | PARTIAL | DEEP | Typed modules, connection validation, explicit error classes, webhook/request-response and partial-success guidance. |
| Apache Camel | PARTIAL | N_A | N_A | PARTIAL | DEEP | Component/endpoint/EIP separation, idempotent consumer and transport/error boundary reference. |

This ledger expands horizontally as capability dossiers are created and vertically as additional representatives are discovered.
