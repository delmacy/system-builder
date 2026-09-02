# Generation 2 — Representative Coverage Ledger

States: `NOT_REVIEWED`, `PARTIAL`, `DEEP`, `N_A`, `LOW_VALUE`. Historical coverage remains authoritative in prior dossiers/state history; this compact ledger records current/recent revisits without superseding it.

## Revisit cycle 2
All 25 active capabilities completed cycle 2. Every pass produced material findings; no capability was SATURATED at cycle close.

## Revisit cycle 3
All 25 active capabilities completed cycle 3. Every capability produced material new findings; no capability satisfied saturation at cycle close.

## Revisit cycle 4
Cycle 4 is open with 14/25 capabilities revisited.

### Universal Capability Architecture — revisit 3
OASIS TOSCA 2.0, Kubernetes desired/observed generation, OpenFeature provider/context/status, OpenTelemetry Resource/Entity identity, Crossplane ProviderConfig/ManagedResource, SPIFFE trust domains/bundles and OPA bundle persistence/status: `DEEP`. Findings `G2-FINDING-UCA-23..28`; material new findings; consecutive-no-material = 0; NOT SATURATED.

### Process & Application Modeling — revisit 3
Camunda 8 and Mendix: `DEEP`; ServiceNow update-set transport/version-direction boundary: `PARTIAL`; OMG BPMN 2.0.2 and prior layered-modeling evidence: `DEEP`. Findings `G2-FINDING-PAM-23..28`; material new findings; NOT SATURATED.

### UI / Generated Experience / Low-code Builder — revisit 3
Power Apps/Dataverse, Mendix, ServiceNow UI Builder, Salesforce Lightning App Builder: `DEEP`. Findings `G2-FINDING-UIGX-23..28`; material new findings; NOT SATURATED.

### Adaptive Governed Work Surfaces — revisit 2
Power Apps/Dataverse, ServiceNow UI Builder, SAP Build Work Zone, Salesforce Lightning App Builder and prior Appsmith evidence: `DEEP`; Retool: `PARTIAL`. Findings `G2-FINDING-AGWS-16..21`; material new findings; NOT SATURATED.

### Workflow & Durable Execution — revisit 3
Camunda 8, AWS Step Functions, Azure Durable Functions: `DEEP`; Temporal: `PARTIAL`. Findings `G2-FINDING-WDE-23..28`; material new findings; NOT SATURATED.

### Integration & Automation — revisit 3
Apache Kafka and Amazon EventBridge: `DEEP`; CloudEvents: `PARTIAL`; prior Dapr, Azure Logic Apps and Zapier: `DEEP`. Findings `G2-FINDING-IA-23..28`; material new findings; NOT SATURATED.

### Identity / Authentication / Federation — revisit 3
OpenID Connect, Microsoft Entra, Keycloak, Auth0 and SPIFFE: `DEEP`. Findings `G2-FINDING-IAF-23..28`; material new findings; NOT SATURATED.

### Authorization / Policy / Organization / Multitenancy — revisit 3
Cedar, OpenFGA, Kubernetes RBAC, Microsoft Entra PIM, Amazon Verified Permissions and prior OPA evidence: `DEEP`. Findings `G2-FINDING-AUTH-23..28`; material new findings; NOT SATURATED.

### Data / Schema / Migrations — revisit 3
PostgreSQL, Vitess, Debezium, AWS DMS, Prisma Migrate v7 and Liquibase 5.0.x: `DEEP`. Findings `G2-FINDING-DSM-23..28`; material new findings; NOT SATURATED.

### Storage / Documents / Media — revisit 3
Amazon S3 Object Versioning/Object Lock/Replication: `DEEP`; Azure Blob Versioning/Object Replication/Immutable Storage: `DEEP`; Google Cloud Storage Object Versioning/Object Retention Lock/Bucket Lock: `DEEP`; MinIO/S3-compatible prior evidence: `PARTIAL` for this revisit. Findings `G2-FINDING-SDM-23..28`; material new findings; consecutive-no-material = 0; NOT SATURATED.

### Notifications / Events / Messaging — revisit 3
Apache Kafka 4.1 producer transactions/consumer offsets: `DEEP`; Google Cloud Pub/Sub ordering/exactly-once/subscription lifecycle: `DEEP`; Amazon SQS FIFO/DLQ redrive: `DEEP`; NATS JetStream consumer position/ack/replay/retention: `DEEP`; CloudEvents 1.0.x semantic envelope: `DEEP`. Findings `G2-FINDING-NEM-23..28`; material new findings; consecutive-no-material = 0; NOT SATURATED.

### Build / Dependency Graph / Reproducibility — revisit 3
Bazel remote cache/CAS/action cache/remote execution, Bazel sandbox/repository cache, Docker BuildKit reproducible builds/cache invalidation and GitHub Actions dependency caching: `DEEP`; prior Reproducible Builds and Nix closure evidence remains `DEEP`. Findings `G2-FINDING-BUILD-23..28`; material new findings; consecutive-no-material = 0; NOT SATURATED.

### Artifact / Release / SBOM / Provenance — revisit 3
SLSA v1.2 provenance, OCI descriptor/content-addressability and multi-platform image index, GitHub Artifact Attestations + lifecycle, Sigstore/Cosign trust/offline bundles and CycloneDX 1.7/BOM-Link: `DEEP`. Findings `G2-FINDING-ARSP-23..29`; material new findings; consecutive-no-material = 0; NOT SATURATED.

### Deployment / Environment / Runtime — revisit 3
Kubernetes Deployment rollout/revision/readiness/rollback, RuntimeClass scheduling/runtime selection, StatefulSet rollback boundary, HashiCorp Nomad canary/promotion/auto-revert/multi-region deployment and failure recovery: `DEEP`. Findings `G2-FINDING-DER-23..29`; material new findings; consecutive-no-material = 0; NOT SATURATED. Focus: semantic deployment/environment identity vs release/provider/runtime realization; rollout/checkpoint/postcondition evidence; rollback as new transition; runtime selection; region/platform qualification; qualified local runtime recovery closure; release/deployment/runtime authority separation.

## Historical authority
All representatives/findings from prior capability sections and earlier revisions remain authoritative in their dossiers/state history. Compacting this ledger does not revoke coverage.
