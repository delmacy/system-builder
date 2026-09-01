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
OAuth Authorization Server Metadata RFC 8414, OAuth Token Revocation RFC 7009/RFC 9700, SPIFFE/SPIRE, OpenID Connect Core and retained Keycloak/Entra/Auth0/Clerk/ZITADEL evidence: `DEEP`. Revisit result: six material findings (`G2-FINDING-IAF-11..16`); consecutive-no-material = 0; NOT SATURATED.

## Authorization / Policy / Organization / Multitenancy — revisit cycle 2
Open Policy Agent, Cedar, OpenFGA, SpiceDB/Authzed, Keycloak Organizations/FGAP and AWS multi-tenant authorization/Verified Permissions guidance: `DEEP`. Revisit result: six material findings (`G2-FINDING-AUTH-11..16`); consecutive-no-material = 0; NOT SATURATED.

## Data / Schema / Migrations — revisit cycle 2
PostgreSQL logical replication/schema coordination, Atlas migration lint/review, Liquibase changeset/rollback semantics and Flyway undo/history: `DEEP`. Historical PostgreSQL, Prisma Migrate, Supabase and Hasura first-pass evidence remains authoritative. Revisit result: six material findings (`G2-FINDING-DATA-11..16`); consecutive-no-material = 0; NOT SATURATED.

## Storage / Documents / Media — revisit cycle 2
Amazon S3 replication/Object Lock/key dependency `DEEP`; Google Cloud Storage object retention/resumable upload `DEEP`; Azure Blob immutability/object replication/cross-tenant controls `DEEP`; Ceph RGW multisite replication `DEEP`; BorgBackup recovery boundary `PARTIAL`. Historical S3/GCS/Azure/MinIO/SharePoint first-pass evidence remains authoritative. Revisit result: six material findings (`G2-FINDING-STORAGE-11..16`); consecutive-no-material = 0; NOT SATURATED.

## AI-native Engineering / Agents / Approvals
OpenAI Agents/Responses `DEEP`; Anthropic Claude Code permissions `DEEP`; GitHub Copilot coding agents `DEEP`; Temporal `DEEP`; LangGraph `PARTIAL`.

## Developer / Operator Experience / Self-hosting
Backstage `DEEP`; GitHub Codespaces/Dev Containers `DEEP`; Kubernetes administration `DEEP`; Coolify `DEEP`; Nix Flakes/devShell `DEEP`.

## Architecture Reconciliation as a Capability
ADR lifecycle `DEEP`; evolutionary architecture fitness functions `DEEP`; ArchUnit-style conformance `DEEP`; Kubernetes compatibility/deprecation `DEEP`; repository-native architecture governance `PARTIAL`.