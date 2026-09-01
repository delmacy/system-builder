# Generation 2 — Representative Coverage Ledger

States: `NOT_REVIEWED`, `PARTIAL`, `DEEP`, `N_A`, `LOW_VALUE`.

| Representative | Universal Capability Architecture | Process & Application Modeling | UI / Generated Experience / Low-code Builder | Workflow & Durable Execution | Integration & Automation | Identity / Authentication / Federation | Notes |
|---|---|---|---|---|---|---|---|
| OASIS TOSCA 2.0 | DEEP | NOT_REVIEWED | N_A | N_A | N_A | N_A | Requirement/capability/relationship/fulfillment model. |
| Kubernetes declarative API/controllers | DEEP | NOT_REVIEWED | N_A | PARTIAL | N_A | N_A | Desired/observed separation and reconciliation lifecycle; not a workflow engine. |
| Terraform provider model | DEEP | NOT_REVIEWED | N_A | N_A | PARTIAL | NOT_REVIEWED | Provider identity/version/schema informs connector/provider boundary. |
| Backstage Software Catalog | PARTIAL | NOT_REVIEWED | NOT_REVIEWED | N_A | N_A | NOT_REVIEWED | Entity identity, relations and extension authority. |
| Mendix | NOT_REVIEWED | DEEP | DEEP | NOT_REVIEWED | NOT_REVIEWED | NOT_REVIEWED | Explicit page structure + Atlas design system, theme governance and reusable UI modules. |
| ServiceNow App Engine / Flow Designer | NOT_REVIEWED | DEEP | NOT_REVIEWED | NOT_REVIEWED | PARTIAL | NOT_REVIEWED | Scoped application/data model plus reusable typed flow/action composition. |
| Microsoft Power Apps / Dataverse | NOT_REVIEWED | DEEP | NOT_REVIEWED | N_A | NOT_REVIEWED | NOT_REVIEWED | Data-model-first apps; generated forms/views; solution ALM and strong Dataverse coupling. |
| Salesforce Platform | NOT_REVIEWED | DEEP | NOT_REVIEWED | NOT_REVIEWED | NOT_REVIEWED | NOT_REVIEWED | Metadata-driven objects/relations/flows and packages. |
| OutSystems | NOT_REVIEWED | NOT_REVIEWED | DEEP | NOT_REVIEWED | NOT_REVIEWED | NOT_REVIEWED | Responsive UI patterns, theme/style-guide libraries, reusable templates and custom-pattern extension. |
| Retool | NOT_REVIEWED | NOT_REVIEWED | PARTIAL | N_A | NOT_REVIEWED | NOT_REVIEWED | Platform-centric app builder; useful hosted-builder/control-plane contrast. |
| Appsmith | NOT_REVIEWED | NOT_REVIEWED | DEEP | N_A | NOT_REVIEWED | NOT_REVIEWED | Open-source/self-hostable widget builder with datasource/query/JavaScript composition and Git collaboration. |
| FlutterFlow | NOT_REVIEWED | NOT_REVIEWED | DEEP | N_A | N_A | NOT_REVIEWED | Visual widget tree, generated Widget/Model code, reusable components, custom-code/package escape hatch and exportable project structure. |
| Temporal | NOT_REVIEWED | N_A | N_A | PARTIAL | N_A | N_A | Crash-resilient durable workflow reference; later revisit needed for deeper history/replay, message and worker-versioning evidence. |
| Camunda 8 / Zeebe | NOT_REVIEWED | PARTIAL | N_A | DEEP | PARTIAL | N_A | Process definition/version identity, job workers, retries/incidents and connector boundary. |
| AWS Step Functions | NOT_REVIEWED | N_A | N_A | DEEP | PARTIAL | N_A | Managed state-machine execution history and service-integration contrast. |
| Azure Durable Functions / Durable Task | NOT_REVIEWED | N_A | N_A | DEEP | N_A | N_A | Replay-deterministic orchestration with explicit nondeterminism/version-isolation constraints. |
| Restate | NOT_REVIEWED | N_A | N_A | DEEP | PARTIAL | N_A | Reliable service calls inform side-effect/retry boundary. |
| n8n | NOT_REVIEWED | NOT_REVIEWED | PARTIAL | PARTIAL | DEEP | NOT_REVIEWED | Visual/self-hostable automation; sub-workflows, execution history, error workflows, Git environments and queue workers. |
| MuleSoft Anypoint Platform | NOT_REVIEWED | NOT_REVIEWED | N_A | PARTIAL | DEEP | NOT_REVIEWED | Enterprise connectors/APIs, policies, proxies, topology and connector/API observability. |
| Zapier Platform | NOT_REVIEWED | N_A | PARTIAL | PARTIAL | DEEP | NOT_REVIEWED | Authentication/Trigger/Action contracts, UI/CLI authoring, bounded code escape hatch and integration versioning. |
| Make | NOT_REVIEWED | N_A | PARTIAL | PARTIAL | DEEP | NOT_REVIEWED | Typed modules, connection validation, explicit error classes, webhook/request-response and partial-success guidance. |
| Apache Camel | PARTIAL | N_A | N_A | PARTIAL | DEEP | N_A | Component/endpoint/EIP separation, idempotent consumer and transport/error boundary reference. |
| Keycloak 26.x | NOT_REVIEWED | N_A | N_A | N_A | PARTIAL | DEEP | Realms, identity brokering, sessions, OIDC/SAML provider bindings, token controls and delegated realm administration. |
| Auth0 Organizations / Enterprise Connections | NOT_REVIEWED | N_A | PARTIAL | N_A | PARTIAL | DEEP | Tenant-level connections bound per organization; B2B federation and bounded organization-admin connection management. |
| Microsoft Entra ID / External ID | NOT_REVIEWED | N_A | N_A | N_A | N_A | DEEP | Tenant/issuer trust boundary, federation metadata/certificates, external identity and claim-scoping semantics. |
| Clerk | NOT_REVIEWED | N_A | PARTIAL | N_A | N_A | DEEP | Explicit authentication/session distinction, pending session tasks and organization context. |
| ZITADEL | NOT_REVIEWED | N_A | N_A | N_A | PARTIAL | DEEP | Instance- and organization-scoped identity providers, human/machine auth and delegated IdP self-service. |

## Authorization / Policy / Organization / Multitenancy coverage

| Representative | Coverage | Why this pass matters | Revisit focus |
|---|---|---|---|
| Open Policy Agent (OPA) | DEEP | Distributed decision engine, signed/versioned bundles, local enforcement topology, decision IDs/logs/status/discovery. | Partial evaluation/Wasm, external-data staleness and explicit fail-open/fail-closed deployment semantics. |
| Cedar / Amazon Verified Permissions | DEEP | Typed principal/action/resource/context contract, schema validation and application-policy separation. | Conflict/default semantics, template lifecycle and portability limits between Cedar and managed AVP. |
| Google Zanzibar | PARTIAL | Relationship model and external-consistency requirement are foundational conceptual evidence. | Zookies/consistency tokens, write/read semantics and what is actually worth generalizing below Google scale. |
| OpenFGA | DEEP | Immutable model IDs, relationship tuples, contextual tuples, organization-context authorization and conditions. | Change API/provenance, consistency semantics and migration of in-use models. |
| Keycloak Authorization Services / Organizations | DEEP | Resource/scope/policy/permission separation, PEP/PIP, mixed RBAC/ABAC/context, UMA delegation and per-organization admin authority. | Decision evidence/versioning and how organization admin boundaries interact with generated-system authority. |
| Microsoft Entra / Azure multitenancy guidance | PARTIAL | Useful contrast: tenant isolation spans control plane/data plane and is not just authorization context. | Entra-specific application authorization and cross-tenant administration patterns. |

This ledger expands horizontally as capability dossiers are created and vertically as additional representatives are discovered.
