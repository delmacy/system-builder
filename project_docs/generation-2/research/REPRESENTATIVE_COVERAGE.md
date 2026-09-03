# Generation 2 — Representative Coverage Ledger

States: `NOT_REVIEWED`, `PARTIAL`, `DEEP`, `N_A`, `LOW_VALUE`.

Historical coverage in prior revisions, capability dossiers and state history remains authoritative; this compact ledger does not revoke omitted cells.

## Cycle authority
Cycles 2–6 completed for all 25 active capabilities. Every cycle-6 pass produced material findings; none was saturated.

## Revisit cycle 7
Completed so far: Universal Capability Architecture; Process & Application Modeling; UI / Generated Experience / Low-code Builder; Adaptive Governed Work Surfaces; Workflow & Durable Execution; Integration & Automation; Identity / Authentication / Federation; Authorization / Policy / Organization / Multitenancy; Data / Schema / Migrations; Storage / Documents / Media; Notifications / Events / Messaging; Build / Dependency Graph / Reproducibility; Artifact / Release / SBOM / Provenance; Deployment / Environment / Runtime; Observability / Operations / Incident; Extension / Plugin / Marketplace Architecture; Governance / Compliance / Audit; Secrets / Configuration / Environment Portability; Provider / Binding / Capability Negotiation; Standards / Interoperability / API Contracts; Lifecycle / Versioning / Evolution / Migration; Security / Resilience / Failure Recovery.

### Security / Resilience / Failure Recovery — revisit 6
NIST SP 1339 OT Backup Quick Start Guide: `DEEP`; NIST SP 800-61 Rev.3/CSF 2.0 incident-response profile: `DEEP`; CISA StopRansomware Guide: `DEEP`; AWS Backup Restore Testing + Well-Architected REL09-BP04: `DEEP`; etcd v3.7 disaster recovery: `DEEP`; Google Cloud SQL advanced DR / HA split-brain guidance: `DEEP`; Azure Site Recovery failover/test/reprotect: `DEEP`. Findings `G2-FINDING-SRFR-47..54`; eight material new findings; consecutive-no-material = 0; NOT SATURATED. Focus: applicability-scoped protection/recovery qualification; typed asset/threat/objective/point/path/attempt/restoration/population/evidence identities; prevention→detection→containment→recovery→reprotection separation; RTO/RPO as evidence-backed path/population claims; backup existence versus restorability versus validated business state; ambiguous failover reconcile-before-retry; split-brain/stale-controller fencing; mixed recovery support vectors; residual consumer-cohort drainage; evidence horizons; qualified offline recovery; expiring Station break-glass; `Enterprise → Station → Role → Person` and AGWS/AI non-amplification.

### Lifecycle / Versioning / Evolution / Migration — revisit 6
Kubernetes API deprecation/version conversion: `DEEP`; Confluent Schema Registry compatibility/transitivity: `DEEP`; Camunda 8 process-instance migration: `DEEP`; Amazon RDS Blue/Green deployments: `DEEP`; Amazon RDS Proxy + Blue/Green traffic/session convergence: `DEEP`; prior Generation-2 lifecycle/standards/provider/data/workflow/deployment research: `DEEP`. Findings `G2-FINDING-LVEM-46..53`; eight material new findings; consecutive-no-material = 0; NOT SATURATED. Focus: applicability-scoped transition qualification; typed object/revision/plan/attempt/realization/population/closure identities; attempted→accepted→applied→converged→validated→drained lifecycle; ambiguous-actuation reconcile-before-retry; directional rollback eligibility against current effective state; mixed-version coexistence; residual cohort drainage; evidence replay horizons; mixed transition support vectors; qualified offline closure; `Enterprise → Station → Role → Person` and AGWS/AI non-amplification.

### Standards / Interoperability / API Contracts — revisit 6
OpenAPI 3.1.1: `DEEP`; IETF HTTP Semantics RFC 9110 + RFC 6585: `DEEP`; gRPC retry semantics: `DEEP`; Kubernetes API versioning/deprecation: `DEEP`; Confluent Schema Registry compatibility/transitivity: `DEEP`; AsyncAPI 3.1 / protocol bindings: `DEEP`; prior Generation-2 standards/interoperability research: `DEEP`. Findings `G2-FINDING-SIAC-47..54`; eight material new findings; consecutive-no-material = 0; NOT SATURATED. Focus: applicability-scoped syntactic→structural→behavioral→semantic qualification; typed specification/profile/schema/operation/provider/conformance/consumer-effective identities; retry versus domain-effect guarantees; ambiguous mutation reconcile-before-retry; revision-qualified compatibility; mixed support vector; dual-version/protocol residual-cohort drainage; evidence replay horizons; `Enterprise → Station → Role → Person` and AGWS/AI non-amplification.

### Provider / Binding / Capability Negotiation — revisit 6
Kubernetes Gateway API/conformance model: `DEEP`; OpenTelemetry Collector distributions/component stability: `DEEP`; SPIFFE Federation/Workload API: `DEEP`; Terraform provider/plugin protocol: `DEEP`; OCI Distribution extension/discovery patterns: `DEEP`; fresh-main SB P5 provider-neutral Catalog/Assembly evidence: `DEEP`. Findings `G2-FINDING-PBCN-45..52`; eight material new findings; consecutive-no-material = 0; NOT SATURATED. Focus: applicability-scoped requirement→offer→binding→realization→consumer-effective satisfaction; typed identities; readiness-vs-effective proof; ownership/fencing; revocable grants; reconcile-before-retry; mixed support vectors; target proof plus residual cohort drainage; offline requalification; `Enterprise → Station → Role → Person` and AGWS/AI non-amplification.

### Secrets / Configuration / Environment Portability — revisit 6
HashiCorp Vault leases/revocation: `DEEP`; AWS Secrets Manager rotation/version stages and client caches: `DEEP`; Kubernetes Secret propagation/`subPath`: `DEEP`; External Secrets Operator refresh/lifecycle policy: `DEEP`; Azure App Service Key Vault references / App Configuration secret refresh: `DEEP`; prior Generation-2 secrets/config research: `DEEP`. Findings `G2-FINDING-SCEP-46..53`; eight material new findings; consecutive-no-material = 0; NOT SATURATED.

### Governance / Compliance / Audit — revisit 6
NIST SP 800-53A Rev.5 / Release 5.2.0: `DEEP`; NIST OSCAL Assessment Layer / Assessment Results: `DEEP`; FedRAMP Continuous Monitoring: `DEEP`; AWS Audit Manager: `DEEP`; Open Policy Agent decision-log/evidence behavior: `DEEP`; Azure Policy exemptions: `DEEP`; prior Generation-2 governance research: `DEEP`. Findings `G2-FINDING-GCA-46..53`; eight material new findings; consecutive-no-material = 0; NOT SATURATED.

### Extension / Plugin / Marketplace Architecture — revisit 6
Chrome Extensions Manifest V3 permissions + update lifecycle: `DEEP`; VS Code extension runtime security/publisher-workspace trust: `DEEP`; Kubernetes admission webhooks/good practices: `DEEP`; Backstage frontend/backend plugin architecture: `DEEP`; prior Generation-2 extension research: `DEEP`. Findings `G2-FINDING-EPM-45..52`; eight material new findings; consecutive-no-material = 0; NOT SATURATED.

### Observability / Operations / Incident — revisit 6
OpenTelemetry sampling/collector/semantic conventions: `DEEP`; Prometheus alerting/staleness + prior remote-write evidence: `DEEP`; Grafana NoData/Error/MissingSeries/state-health semantics: `DEEP`; PagerDuty incident lifecycle/escalation: `DEEP`; Google SRE windowed SLI/SLO practice: `DEEP`. Findings `G2-FINDING-OOI-47..54`; eight material new findings; consecutive-no-material = 0; NOT SATURATED.

### Deployment / Environment / Runtime — revisit 6
Kubernetes Deployment + Pod readiness/observedGeneration: `DEEP`; Argo Rollouts traffic/analysis/rollback-window semantics: `DEEP`; Google Cloud Run revision/traffic migration: `DEEP`; HashiCorp Nomad update/canary/blue-green semantics: `DEEP`; Amazon ECS circuit-breaker/failure-detection/rollback eligibility: `DEEP`. Findings `G2-FINDING-DER-46..53`; eight material new findings; consecutive-no-material = 0; NOT SATURATED.

### Historical authority
Detailed representative coverage for all other capabilities remains authoritative in their dossiers, earlier ledger revisions and `RESEARCH_PIPELINE_STATE.json` history.