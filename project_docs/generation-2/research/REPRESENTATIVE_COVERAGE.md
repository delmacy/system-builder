# Generation 2 — Representative Coverage Ledger

States: `NOT_REVIEWED`, `PARTIAL`, `DEEP`, `N_A`, `LOW_VALUE`. Historical coverage remains authoritative in prior dossiers/state history; this compact ledger records current/recent revisits without superseding it.

## Universal Capability Architecture — revisit cycle 2
OASIS TOSCA 2.0, Kubernetes declarative APIs/controllers, Kubernetes DRA, OpenTofu provider/state replacement, Crossplane ProviderConfig/Managed Resources, CUE and Backstage Software Catalog: `DEEP`. Revisit result: six material findings (`G2-FINDING-UCA-11..16`); consecutive-no-material = 0; NOT SATURATED.

## Process & Application Modeling — revisit cycle 2
Backstage Software Catalog, JSON Schema 2020-12, CUE, OMG BPMN 2.0/2.0.2, Mendix, ServiceNow App Engine, Power Apps/Dataverse and Salesforce Platform: `DEEP`. Revisit result: six material findings (`G2-FINDING-PAM-11..16`); consecutive-no-material = 0; NOT SATURATED.

## UI / Generated Experience / Low-code Builder — revisit cycle 2
DTCG 2025.10, Web Components, JSON Forms, Storybook Portable Stories/testing, Mendix/Atlas UI, OutSystems UI and FlutterFlow: `DEEP`. Revisit result: six material findings (`G2-FINDING-UI-11..16`); consecutive-no-material = 0; NOT SATURATED.

## Workflow & Durable Execution — revisit cycle 2
Camunda 8 migration/modification, AWS Step Functions versions/aliases/redrive, DBOS workflows/transactions/recovery, Restate, Temporal and Azure Durable Task: `DEEP`. Revisit result: six material findings (`G2-FINDING-WDE-11..16`); consecutive-no-material = 0; NOT SATURATED.

## Integration & Automation — revisit cycle 2
Apache Kafka/Kafka Connect, Dapr Pub/Sub, AWS EventBridge Pipes, Azure Logic Apps, n8n, MuleSoft Anypoint, Zapier Platform and Make: `DEEP`. Revisit result: six material findings (`G2-FINDING-IA-11..16`); consecutive-no-material = 0; NOT SATURATED.

## Identity / Authentication / Federation — revisit cycle 2
| Representative | Coverage | Revisit focus |
|---|---|---|
| OAuth Authorization Server Metadata — RFC 8414 | DEEP | Issuer identity, discovery/metadata revision, signed metadata and validation trust boundary. |
| OAuth Token Revocation — RFC 7009 / RFC 9700 | DEEP | Revocation target/scope, cascade policy, propagation/freshness and unexpected invalidation. |
| SPIFFE / SPIRE | DEEP | Stable workload identity versus short-lived SVID, trust-domain authority, rotating bundles and federation. |
| OpenID Connect Core | DEEP | Authentication time/method/assurance context as event evidence rather than subject identity. |
| Keycloak / Entra / Auth0 / Clerk / ZITADEL | DEEP | First-pass local identity, provider binding, issuer/tenant, session and delegated-admin evidence retained. |

Revisit result: six material findings (`G2-FINDING-IAF-11..16`); consecutive-no-material-finding count = 0; capability remains NOT SATURATED.

## Authorization / Policy / Organization / Multitenancy — revisit cycle 2
| Representative | Coverage | Revisit focus |
|---|---|---|
| Open Policy Agent | DEEP | Local decision autonomy, policy distribution status/freshness, decision ID/revision evidence and offline last-known-good behavior. |
| Cedar Policy Language | DEEP | PARC, default deny, schema/policy compatibility, context boundary and validation lifecycle. |
| OpenFGA | DEEP | Immutable model pinning, relationship-state evolution and query consistency/cache freshness. |
| SpiceDB / Authzed | DEEP | Causal freshness, ZedTokens, stale-cache/new-enemy semantics and protected-resource coupling. |
| Keycloak Organizations / FGAP | DEEP | Scoped delegated administration and organizations as protected admin resources. |
| AWS multi-tenant SaaS authorization / Verified Permissions guidance | DEEP | Principal/resource tenant binding, external-data responsibility and isolation proof boundary. |

Revisit result: six material findings (`G2-FINDING-AUTH-11..16`); consecutive-no-material-finding count = 0; capability remains NOT SATURATED.

## AI-native Engineering / Agents / Approvals
OpenAI Agents/Responses `DEEP`; Anthropic Claude Code permissions `DEEP`; GitHub Copilot coding agents `DEEP`; Temporal `DEEP`; LangGraph `PARTIAL`.

## Developer / Operator Experience / Self-hosting
Backstage `DEEP`; GitHub Codespaces/Dev Containers `DEEP`; Kubernetes administration `DEEP`; Coolify `DEEP`; Nix Flakes/devShell `DEEP`.

## Architecture Reconciliation as a Capability
ADR lifecycle `DEEP`; evolutionary architecture fitness functions `DEEP`; ArchUnit-style conformance `DEEP`; Kubernetes compatibility/deprecation `DEEP`; repository-native architecture governance `PARTIAL`.