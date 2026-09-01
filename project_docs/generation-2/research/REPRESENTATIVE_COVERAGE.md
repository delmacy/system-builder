# Generation 2 — Representative Coverage Ledger

States: `NOT_REVIEWED`, `PARTIAL`, `DEEP`, `N_A`, `LOW_VALUE`. Historical coverage remains authoritative in prior dossiers/state history; this compact ledger records current/recent revisits without superseding it.

## Universal Capability Architecture — revisit cycle 2
OASIS TOSCA 2.0, Kubernetes declarative APIs/controllers, Kubernetes DRA, OpenTofu provider/state replacement, Crossplane ProviderConfig/Managed Resources, CUE and Backstage Software Catalog: `DEEP`. Revisit result: six material findings (`G2-FINDING-UCA-11..16`); consecutive-no-material = 0; NOT SATURATED.

## Process & Application Modeling — revisit cycle 2
Backstage Software Catalog, JSON Schema 2020-12, CUE, OMG BPMN 2.0/2.0.2, Mendix, ServiceNow App Engine, Power Apps/Dataverse and Salesforce Platform: `DEEP`. Revisit result: six material findings (`G2-FINDING-PAM-11..16`); consecutive-no-material = 0; NOT SATURATED.

## UI / Generated Experience / Low-code Builder — revisit cycle 2
DTCG 2025.10, Web Components, JSON Forms, Storybook Portable Stories/testing, Mendix/Atlas UI, OutSystems UI and FlutterFlow: `DEEP`. Revisit result: six material findings (`G2-FINDING-UI-11..16`); consecutive-no-material = 0; NOT SATURATED.

## Workflow & Durable Execution — revisit cycle 2
| Representative | Coverage | Revisit focus |
|---|---|---|
| Camunda 8 migration/modification | DEEP | Mechanical versus semantic migration proof; stronger operator repair authority. |
| AWS Step Functions versions/aliases/redrive | DEEP | Definition association, same-execution redrive and recovery lineage. |
| DBOS workflows/transactions/recovery | DEEP | Step at-least-once versus atomic transaction exactly-once scope; distributed recovery ownership. |
| Restate | DEEP | First-pass journal/idempotency/durable-promise evidence retained as cross-check. |
| Temporal | DEEP | First-pass history/replay evidence remains authoritative. |
| Azure Durable Functions / Durable Task | DEEP | First-pass deterministic replay/version isolation remains authoritative. |

Revisit result: six material findings (`G2-FINDING-WDE-11..16`); consecutive-no-material-finding count = 0; capability remains NOT SATURATED.

## Integration & Automation — revisit cycle 2
| Representative | Coverage | Revisit focus |
|---|---|---|
| Apache Kafka / Kafka Connect | DEEP | Transaction-bound exactly-once scope; connector-dependent guarantees; external-effect boundary. |
| Dapr Pub/Sub | DEEP | At-least-once contract, outbox, dead-letter and broker-vs-sidecar retry ownership. |
| AWS EventBridge Pipes | DEEP | Partial-batch outcome identity, checkpoint/retry semantics and source replacement constraints. |
| Azure Logic Apps | DEEP | Trigger/action retry qualification, connector throttling and concurrency-induced backpressure. |
| n8n | DEEP | First-pass execution/retry/environment evidence retained. |
| MuleSoft Anypoint | DEEP | First-pass connector/policy/observability evidence retained. |
| Zapier Platform | DEEP | First-pass operation/auth/version evidence retained. |
| Make | DEEP | First-pass connection/error/partial-success evidence retained. |

Revisit result: six material findings (`G2-FINDING-IA-11..16`); consecutive-no-material-finding count = 0; capability remains NOT SATURATED.

## AI-native Engineering / Agents / Approvals
OpenAI Agents/Responses `DEEP`; Anthropic Claude Code permissions `DEEP`; GitHub Copilot coding agents `DEEP`; Temporal `DEEP`; LangGraph `PARTIAL`.

## Developer / Operator Experience / Self-hosting
Backstage `DEEP`; GitHub Codespaces/Dev Containers `DEEP`; Kubernetes administration `DEEP`; Coolify `DEEP`; Nix Flakes/devShell `DEEP`.

## Architecture Reconciliation as a Capability
ADR lifecycle `DEEP`; evolutionary architecture fitness functions `DEEP`; ArchUnit-style conformance `DEEP`; Kubernetes compatibility/deprecation `DEEP`; repository-native architecture governance `PARTIAL`.