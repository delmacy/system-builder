# Generation 2 — Representative Coverage Ledger

States: `NOT_REVIEWED`, `PARTIAL`, `DEEP`, `N_A`, `LOW_VALUE`. Historical coverage remains authoritative in prior dossiers/state history; this compact ledger records current/recent revisits without superseding it.

## Revisit cycle 2
All 25 active capabilities completed cycle 2. Every pass produced material findings; no capability was SATURATED at cycle close.

## Revisit cycle 3
Authoritative completed set after the Lifecycle / Versioning / Evolution / Migration pass: Universal Capability Architecture; Process & Application Modeling; UI / Generated Experience / Low-code Builder; Adaptive Governed Work Surfaces; Workflow & Durable Execution; Integration & Automation; Identity / Authentication / Federation; Authorization / Policy / Organization / Multitenancy; Data / Schema / Migrations; Storage / Documents / Media; Notifications / Events / Messaging; Build / Dependency Graph / Reproducibility; Artifact / Release / SBOM / Provenance; Deployment / Environment / Runtime; Observability / Operations / Incident; Extension / Plugin / Marketplace Architecture; Governance / Compliance / Audit; Secrets / Configuration / Environment Portability; Provider / Binding / Capability Negotiation; Security / Resilience / Failure Recovery; Standards / Interoperability / API Contracts; Lifecycle / Versioning / Evolution / Migration. These 22 capabilities have current-cycle material findings and remain NOT SATURATED.

### Extension / Plugin / Marketplace Architecture — revisit 2
VS Code extensions/enterprise management: `DEEP`; Terraform providers/plugin protocol/lock/mirror: `DEEP`; Backstage plugins/modules/feature loaders: `DEEP`; Kubernetes CRD/operator version boundary: `DEEP`; OSGi resolver/lifecycle: `DEEP`. Findings `G2-FINDING-EXT-17..22`; material new findings, consecutive-no-material = 0; NOT SATURATED.

### Governance / Compliance / Audit — revisit 2
NIST OSCAL Assessment Layer/Results: `DEEP`; Azure Policy scope/assignments/exemptions: `DEEP`; AWS Audit Manager assessment/evidence collection: `DEEP`; Open Policy Agent management/decision logs/status: `DEEP`; HashiCorp Sentinel enforcement/override semantics: `DEEP`; AWS CloudTrail integrity validation: `DEEP`. Findings `G2-FINDING-GCA-17..22`; material new findings, consecutive-no-material = 0; NOT SATURATED.

### Secrets / Configuration / Environment Portability — revisit 2
HashiCorp Vault Agent/Proxy/leases: `DEEP`; AWS Secrets Manager: `DEEP`; External Secrets Operator + Kubernetes Secret/ConfigMap: `DEEP`; AWS AppConfig: `DEEP`; SPIFFE/SPIRE workload identity: `DEEP`; SOPS: `DEEP`; Kustomize bases/overlays: `DEEP`. Findings `G2-FINDING-SCEP-17..22`; material new findings, consecutive-no-material = 0; NOT SATURATED.

### Provider / Binding / Capability Negotiation — revisit 2
Terraform provider requirements/configurations/state: `DEEP`; Kubernetes extended resources + DRA: `DEEP`; Kubernetes device plugins: `DEEP`; SPIFFE Workload API + federation: `DEEP`; Backstage feature discovery/plugins: `PARTIAL`. Findings `G2-FINDING-PBCN-17..22`; material new findings, consecutive-no-material = 0; NOT SATURATED.

### Security / Resilience / Failure Recovery — revisit 2
PostgreSQL 18 PITR/incremental-backup dependency chains: `DEEP`; Kubernetes disruptions/PDB applicability: `DEEP`; AWS Well-Architected DR objectives/strategies/testing: `DEEP`; AWS retry/backoff + circuit breaker: `DEEP`; NIST CSF 2.0 lifecycle outcomes: `DEEP`. Findings `G2-FINDING-SRFR-17..22`; material new findings, consecutive-no-material = 0; NOT SATURATED.

### Standards / Interoperability / API Contracts — revisit 2
OpenAPI 3.2.0: `DEEP`; JSON Schema Draft 2020-12: `DEEP`; AsyncAPI 3.0.0: `DEEP`; SCIM RFC 7643: `DEEP`; OpenID Connect Discovery 1.0: `DEEP`; OCI Image Specification descriptors/manifests/annotations: `DEEP`; RFC 9745 + RFC 8594 deprecation/sunset lifecycle: `DEEP`. Findings `G2-FINDING-SIAC-17..22`; material new findings, consecutive-no-material = 0; NOT SATURATED.

### Lifecycle / Versioning / Evolution / Migration — revisit 2
Kubernetes API deprecation + storage/preferred-version evolution: `DEEP`; Kubernetes component version-skew/upgrade ordering: `DEEP`; RFC 9745 Deprecation + RFC 8594 Sunset: `DEEP`; Terraform moved/import/remove/state continuity: `DEEP`; Terraform provider cross-resource-type state move: `DEEP`; Flyway target/versioned migration/undo/schema history: `DEEP`; Temporal durable execution version coexistence constraint: `PARTIAL`. Findings `G2-FINDING-LVEM-17..22`; material new findings, consecutive-no-material = 0; NOT SATURATED. Focus: desired vs effective revision, profile/operation/direction/window compatibility, deprecation/sunset/withdrawal/availability separation, explicit state continuity proof, restored-lineage migration recovery and offline migration interpretation/trust/recovery closure.

## Historical authority
All representatives and findings from earlier cycles remain authoritative in their capability dossiers and prior ledger revisions. Compacting this ledger does not revoke coverage.