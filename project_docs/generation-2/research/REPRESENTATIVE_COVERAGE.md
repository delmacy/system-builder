# Generation 2 — Representative Coverage Ledger

States: `NOT_REVIEWED`, `PARTIAL`, `DEEP`, `N_A`, `LOW_VALUE`.

Historical coverage in prior revisions, capability dossiers and state history remains authoritative; this compact ledger does not revoke omitted cells.

## Cycle authority
Cycles 2–6 completed for all 25 active capabilities. Every cycle-6 pass produced material findings; none was saturated.

## Revisit cycle 7
Completed so far: Universal Capability Architecture; Process & Application Modeling; UI / Generated Experience / Low-code Builder; Adaptive Governed Work Surfaces; Workflow & Durable Execution; Integration & Automation; Identity / Authentication / Federation; Authorization / Policy / Organization / Multitenancy; Data / Schema / Migrations; Storage / Documents / Media; Notifications / Events / Messaging; Build / Dependency Graph / Reproducibility; Artifact / Release / SBOM / Provenance; Deployment / Environment / Runtime; Observability / Operations / Incident; Extension / Plugin / Marketplace Architecture; Governance / Compliance / Audit.

### Governance / Compliance / Audit — revisit 6
NIST SP 800-53A Rev.5 / Release 5.2.0: `DEEP`; NIST OSCAL Assessment Layer / Assessment Results: `DEEP`; FedRAMP Continuous Monitoring: `DEEP`; AWS Audit Manager: `DEEP`; Open Policy Agent decision-log/evidence behavior: `DEEP`; Azure Policy exemptions: `DEEP`; prior Generation-2 governance research: `DEEP`. Findings `G2-FINDING-GCA-46..53`; eight material new findings; consecutive-no-material = 0; NOT SATURATED. Focus: applicability-scoped governance qualification, typed obligation/control/assessment/evidence/finding/exception/remediation/audit lineage, design-vs-operating-effectiveness, evidence freshness/replay horizons, ambiguous mutation reconcile-before-retry, exception residual-effect closure, mixed assessor/evidence/audit support vectors, residual evidence/finding/exception/audit/consumer drainage, qualified local closure and `Enterprise → Station → Role → Person` plus AGWS/AI non-amplification.

### Extension / Plugin / Marketplace Architecture — revisit 6
Chrome Extensions Manifest V3 permissions + update lifecycle: `DEEP`; VS Code extension runtime security/publisher-workspace trust: `DEEP`; Kubernetes admission webhooks/good practices: `DEEP`; Backstage frontend/backend plugin architecture: `DEEP`; prior Generation-2 extension research: `DEEP`. Findings `G2-FINDING-EPM-45..52`; eight material new findings; consecutive-no-material = 0; NOT SATURATED. Focus: applicability-scoped extension qualification, requested→granted→effective capability lineage, published/downloaded/installed/running update cohorts, containment support vector, evidence replay/currentness horizons, reconcile-before-retry, residual version/session/cache/hook/grant/consumer drainage, qualified local closure and AGWS/AI non-amplification.

### Observability / Operations / Incident — revisit 6
OpenTelemetry sampling/collector/semantic conventions: `DEEP`; Prometheus alerting/staleness + prior remote-write evidence: `DEEP`; Grafana NoData/Error/MissingSeries/state-health semantics: `DEEP`; PagerDuty incident lifecycle/escalation: `DEEP`; Google SRE windowed SLI/SLO practice: `DEEP`. Findings `G2-FINDING-OOI-47..54`; eight material new findings; consecutive-no-material = 0; NOT SATURATED. Focus: applicability-scoped operational qualification, typed signal/evaluation/alert/incident/remediation lineage, runtime-generation/traffic currentness, expected-population coverage, explicit NoData/Error/Stale/PARTIAL/INCONCLUSIVE, evidence replay horizons, ambiguous actuation reconciliation, mixed provider support vectors, residual telemetry/rule/incident/on-call drainage, qualified local Station closure and AGWS/AI non-amplification.

### Deployment / Environment / Runtime — revisit 6
Kubernetes Deployment + Pod readiness/observedGeneration: `DEEP`; Argo Rollouts traffic/analysis/rollback-window semantics: `DEEP`; Google Cloud Run revision/traffic migration: `DEEP`; HashiCorp Nomad update/canary/blue-green semantics: `DEEP`; Amazon ECS circuit-breaker/failure-detection/rollback eligibility: `DEEP`. Findings `G2-FINDING-DER-46..53`; eight material new findings; consecutive-no-material = 0; NOT SATURATED.

### Artifact / Release / SBOM / Provenance — revisit 6
SLSA v1.2 Provenance + Verification Summary Attestation: `DEEP`; Sigstore/Cosign bundles + signed timestamps: `DEEP`; OCI Distribution Specification: `DEEP`; CycloneDX composition completeness: `DEEP`; TUF: `DEEP`; in-toto: `DEEP`. Findings `G2-FINDING-ARSP-46..53`; eight material new findings; consecutive-no-material = 0; NOT SATURATED.

### Build / Dependency Graph / Reproducibility — revisit 6
Bazel: `DEEP`; Nix: `DEEP`; Gradle: `DEEP`; SLSA Build v1.2: `DEEP`; GitHub Actions cache: `DEEP`. Findings `G2-FINDING-BDGR-45..52`; eight material new findings; consecutive-no-material = 0; NOT SATURATED.

### Notifications / Events / Messaging — revisit 6
Apache Kafka: `DEEP`; Amazon SQS: `DEEP`; RabbitMQ: `DEEP`; Google Cloud Pub/Sub: `DEEP`; prior Generation-2 event research: `DEEP`. Findings `G2-FINDING-NEM-45..52`; eight material new findings; consecutive-no-material = 0; NOT SATURATED.

### Identity / Authentication / Federation — revisit 6
NIST SP 800-63B-4: `DEEP`; SPIFFE: `DEEP`; NIST syncable-authenticator guidance: `DEEP`; Keycloak offline semantics: `DEEP`; prior CAEP/OIDC research: `DEEP`. Findings `G2-FINDING-IAF-45..52`; material new findings; consecutive-no-material = 0; NOT SATURATED.

### Authorization / Policy / Organization / Multitenancy — revisit 6
OpenFGA: `DEEP`; OPA: `DEEP`; Kubernetes RBAC: `DEEP`; Cedar: `DEEP`; SpiceDB: `DEEP`. Findings `G2-FINDING-APOM-45..52`; material new findings; consecutive-no-material = 0; NOT SATURATED.

### Data / Schema / Migrations — revisit 6
PostgreSQL: `DEEP`; CockroachDB: `DEEP`; Google Cloud Spanner: `DEEP`; Debezium: `DEEP`; Confluent Schema Registry: `DEEP`. Findings `G2-FINDING-DSM-45..52`; material new findings; consecutive-no-material = 0; NOT SATURATED.

### Storage / Documents / Media — revisit 6
Amazon S3: `DEEP`; Google Cloud Storage: `DEEP`; prior Azure Blob: `DEEP`; prior MinIO: `DEEP`. Findings `G2-FINDING-SDM-45..52`; eight material new findings; consecutive-no-material = 0; NOT SATURATED.

## Historical authority
Detailed representative coverage for all other capabilities remains authoritative in their dossiers, earlier ledger revisions and `RESEARCH_PIPELINE_STATE.json` history.