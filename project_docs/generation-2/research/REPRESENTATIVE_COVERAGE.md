# Generation 2 — Representative Coverage Ledger

States: `NOT_REVIEWED`, `PARTIAL`, `DEEP`, `N_A`, `LOW_VALUE`.

| Representative | Universal Capability Architecture | Process & Application Modeling | UI / Generated Experience / Low-code Builder | Workflow & Durable Execution | Notes |
|---|---|---|---|---|---|
| OASIS TOSCA 2.0 | DEEP | NOT_REVIEWED | N_A | N_A | Requirement/capability/relationship/fulfillment model. |
| Kubernetes declarative API/controllers | DEEP | NOT_REVIEWED | N_A | PARTIAL | Desired/observed separation and reconciliation lifecycle; not a workflow engine. |
| Terraform provider model | DEEP | NOT_REVIEWED | N_A | N_A | Provider identity/version/schema and durable association. |
| Backstage Software Catalog | PARTIAL | NOT_REVIEWED | NOT_REVIEWED | N_A | Entity identity, relations and extension authority. |
| Mendix | NOT_REVIEWED | DEEP | DEEP | NOT_REVIEWED | Explicit page structure + Atlas design system, theme governance and reusable UI modules. |
| ServiceNow App Engine / Flow Designer | NOT_REVIEWED | DEEP | NOT_REVIEWED | NOT_REVIEWED | Scoped application/data model plus reusable typed flow/action composition. |
| Microsoft Power Apps / Dataverse | NOT_REVIEWED | DEEP | NOT_REVIEWED | N_A | Data-model-first apps; generated forms/views; solution ALM and strong Dataverse coupling. |
| Salesforce Platform | NOT_REVIEWED | DEEP | NOT_REVIEWED | NOT_REVIEWED | Metadata-driven objects/relations/flows and packages. |
| OutSystems | NOT_REVIEWED | NOT_REVIEWED | DEEP | NOT_REVIEWED | Responsive UI patterns, theme/style-guide libraries, reusable templates and custom-pattern extension. |
| Retool | NOT_REVIEWED | NOT_REVIEWED | PARTIAL | N_A | Platform-centric app builder; useful hosted-builder/control-plane contrast. |
| Appsmith | NOT_REVIEWED | NOT_REVIEWED | DEEP | N_A | Open-source/self-hostable widget builder with datasource/query/JavaScript composition and Git collaboration. |
| FlutterFlow | NOT_REVIEWED | NOT_REVIEWED | DEEP | N_A | Visual widget tree, generated Widget/Model code, reusable components, custom-code/package escape hatch and exportable project structure. |
| Temporal | NOT_REVIEWED | N_A | N_A | PARTIAL | Crash-resilient durable workflow reference; later revisit needed for deeper history/replay, message and worker-versioning evidence. |
| Camunda 8 / Zeebe | NOT_REVIEWED | PARTIAL | N_A | DEEP | Process definition/version identity, job workers, retries/incidents and live process-instance migration. |
| AWS Step Functions | NOT_REVIEWED | N_A | N_A | DEEP | Managed state-machine execution history, explicit version/alias association and selective redrive semantics. |
| Azure Durable Functions / Durable Task | NOT_REVIEWED | N_A | N_A | DEEP | Replay-deterministic orchestration with explicit nondeterminism/version-isolation constraints. |
| Restate | NOT_REVIEWED | N_A | N_A | DEEP | Journal-based durable execution, durable state/promises, reliable service calls, recovery and configurable retention. |

This ledger expands horizontally as capability dossiers are created and vertically as additional representatives are discovered.
