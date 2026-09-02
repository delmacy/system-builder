# Generation 2 — Representative Coverage Ledger

States: `NOT_REVIEWED`, `PARTIAL`, `DEEP`, `N_A`, `LOW_VALUE`. Historical coverage remains authoritative in prior dossiers/state history; this compact ledger records current/recent revisits without superseding it.

## Revisit cycle 2
All 25 active capabilities completed cycle 2. Every pass produced material findings; no capability was SATURATED at cycle close.

## Revisit cycle 3
### Universal Capability Architecture — revisit 2
OASIS TOSCA 2.0: `DEEP`; Kubernetes declarative API / observedGeneration: `DEEP`; OpenTelemetry Resources / Entities / semantic conventions: `DEEP`; Backstage Software Catalog: `DEEP`; Crossplane provider/configuration/managed realization: `DEEP`; OpenTofu/Terraform provider requirements/association: `DEEP`. Findings `G2-FINDING-UCA-17..22`; material new findings, consecutive-no-material = 0; NOT SATURATED.

### Process & Application Modeling — revisit 2
Mendix Domain Model + Microflows + Model Access API: `DEEP`; Microsoft Power Apps / Dataverse model-driven apps: `DEEP`; ServiceNow App Engine Studio + Workflow Studio: `DEEP`; OMG BPMN 2.0.2: `DEEP`; JSON Schema 2020-12 baseline: `DEEP`. Findings `G2-FINDING-PAM-17..22`; material new findings, consecutive-no-material = 0; NOT SATURATED.

### UI / Generated Experience / Low-code Builder — revisit 2
Mendix Pages/Layout Grid/Page Explorer/Maia: `DEEP`; Microsoft Power Apps model-driven forms/views/components: `DEEP`; ServiceNow UI Builder data resources/page variants: `DEEP`; Salesforce Lightning App Builder/Dynamic Forms: `DEEP`; Mendix pluggable widget/marketplace security: `PARTIAL`. Findings `G2-FINDING-UIGX-17..22`; material new findings, consecutive-no-material = 0; NOT SATURATED.

### Adaptive Governed Work Surfaces — revisit 1
Microsoft Power Apps / Dataverse / model-driven apps: `DEEP`; ServiceNow UI Builder: `DEEP`; SAP Build Work Zone: `DEEP`; Salesforce Lightning App Builder / Dynamic Forms: `DEEP`; Appsmith: `DEEP` for boundary/anti-pattern analysis; Retool: `PARTIAL`. Findings `G2-FINDING-AGWS-10..15`; material new findings, consecutive-no-material = 0; NOT SATURATED.

### Workflow & Durable Execution — revisit 2
Temporal durable execution/replay baseline: `DEEP`; Camunda 8 / Zeebe jobs-incidents-process migration: `DEEP`; AWS Step Functions Standard retry/callback/redrive: `DEEP`; Azure Durable Functions / Durable Task replay/external events: `DEEP`; BPMN/Camunda compensation semantics: `DEEP`. Findings `G2-FINDING-WDE-17..22`; material new findings, consecutive-no-material = 0; NOT SATURATED. This pass focused semantic-operation/run/activity/attempt identity, revision-bound execution context, authority-non-amplifying continuation, external-effect receipts/idempotency, long-run authority revalidation and compensation-vs-rollback.

### Integration & Automation — revisit 2
Apache Kafka / Kafka Connect 4.3: `DEEP`; Dapr Pub/Sub + Resiliency: `DEEP`; Amazon EventBridge Pipes: `DEEP`; Azure Logic Apps / managed connectors: `DEEP`; Zapier Platform OAuth/triggers: `DEEP`. Findings `G2-FINDING-IA-17..22`; material new findings, consecutive-no-material = 0; NOT SATURATED. This pass focused connector-credential versus semantic authority, trigger deduplication versus business idempotency, monotonic authority attenuation across chained automations, connection authority freshness, async/callback outcome identity and provider-replacement authority/operational conformance.

### Identity / Authentication / Federation — revisit 2
OpenID Connect / OAuth identity and audience semantics: `DEEP`; RFC 8693 OAuth Token Exchange: `DEEP`; Microsoft identity platform / MSAL On-Behalf-Of: `DEEP`; SPIFFE/SPIRE workload identity and federation: `DEEP`; Keycloak session/token lifecycle and revocation: `DEEP`. Findings `G2-FINDING-IAF-17..22`; material new findings, consecutive-no-material = 0; NOT SATURATED. This pass focused canonical-subject/authenticated-principal/actor/workload separation, audience/issuer/trust-bound evidence, non-amplifying delegation/OBO, session-versus-token freshness, federation-versus-authorization boundaries and identity-provider replacement conformance.

### Authorization / Policy / Organization / Multitenancy — revisit 2
Cedar Policy Language: `DEEP`; OpenFGA contextual/organization/conditional authorization: `DEEP`; SpiceDB/Authzed: `DEEP`; Open Policy Agent: `DEEP`; Kubernetes RBAC privilege-escalation prevention: `DEEP`; Amazon Verified Permissions identity-source boundary: `DEEP`. Findings `G2-FINDING-AUTH-17..22`; material new findings, consecutive-no-material = 0; NOT SATURATED. This pass focused monotonic effective-authority resolution, delegated-administration subset proof, impersonation/OBO re-resolution, ephemeral organization/Station context versus canonical membership, provider conflict/default semantics and authority revalidation for long-running privileged effects.

### Data / Schema / Migrations — revisit 2
PostgreSQL 18/19 data-definition and ALTER TABLE semantics: `DEEP`; Vitess 23/24 Managed Online Schema Changes / declarative migrations / revert: `DEEP`; Liquibase 5.x changeset checksum, preconditions and rollback: `DEEP`. Findings `G2-FINDING-DSM-17..22`; material new findings, consecutive-no-material = 0; NOT SATURATED. This pass focused canonical-model versus physical-realization identity, explicit read/write compatibility windows, migration/run/attempt/backfill/checkpoint lineage, conditional revert/roll-forward semantics, provider-replacement data conformance and structural prevention of AGWS projection authority creating canonical migrations.

## Adaptive Governed Work Surfaces — dedicated research pass 1
ServiceNow UI Builder: `DEEP`; SAP Build Work Zone: `DEEP`; Salesforce Lightning App Builder / Dynamic Forms: `DEEP`; Microsoft Power Apps: `PARTIAL`; Retool: `PARTIAL`; Appsmith: `PARTIAL`. Findings `G2-FINDING-AGWS-01..09`; material new findings, consecutive-no-material = 0; NOT SATURATED.

## AI-native Engineering / Agents / Approvals — revisit 1
OpenAI Agents SDK HITL / MCP approvals: `DEEP`; LangGraph / LangChain HITL + persistence: `DEEP`; GitHub Copilot cloud agent: `DEEP`; Anthropic Claude Code permissions: `DEEP`; Temporal durable execution: `DEEP`. Findings `G2-FINDING-AIAA-11..16`; material new findings, consecutive-no-material = 0; NOT SATURATED.

## Developer / Operator Experience / Self-hosting — revisit 1
GitLab Self-Managed/offline/backup-restore: `DEEP`; Kubernetes/kubeadm administration and upgrade: `DEEP`; Backstage deployment/config/plugins: `DEEP`; Nix Flakes/devShell: `DEEP`. Findings `G2-FINDING-DOESH-11..16`; material new findings, consecutive-no-material = 0; NOT SATURATED.

## Architecture Reconciliation as a Capability — revisit 1
ArchUnit architecture rules: `DEEP`; Open Policy Agent / Conftest: `DEEP`; AWS Well-Architected Tool: `DEEP`; GitHub CODEOWNERS / protected review rules: `DEEP`; evolutionary architectural fitness functions: `DEEP`; MADR / ADR lifecycle practice: `DEEP`. Findings `G2-FINDING-ARAC-11..16`; material new findings, consecutive-no-material = 0; NOT SATURATED.