# Generation 2 — Cross-Capability Edge-Case Matrix

Status: ACTIVE
Phase: `RESEARCH_ADVERSARIAL_EDGE_CASE_SATURATION`

This matrix indexes detailed per-capability registers. It does not assert `ConflictInstance`s or authorize remediation. Preserve `ConflictPattern != ConflictInstance`, `Signal != ConfirmedConflict`, qualified evidence/currentness, provider IDs as non-canonical, `Enterprise → Station → Role → Person`, AI/AGWS non-amplification and `UNKNOWN → reconcile-before-retry`.

## Mandatory cluster rotation — Full Pass 1

| # | Cluster | Status | Detailed register(s) | Material range / deepening |
| --- | --- | --- | --- | --- |
| 1 | Process/Application × Workflow × Data/Schema | MATERIAL / STREAK 0 | `PROCESS_APPLICATION_MODELING_EDGE_CASE_REGISTER.md` | `G2-XEDGE-PROCESS-WORKFLOW-DATA-001..004` |
| 2 | Workflow × Integration × Messaging × external mutation | MATERIAL / STREAK 0 | `WORKFLOW_DURABLE_EXECUTION_EDGE_CASE_REGISTER.md`, `INTEGRATION_AUTOMATION_EDGE_CASE_REGISTER.md`, `SECURITY_RESILIENCE_FAILURE_RECOVERY_EDGE_CASE_REGISTER.md` | `G2-XEDGE-WORKFLOW-INTEGRATION-MSG-001..004` + Integration deepening + recovery-cut external-effect reconciliation |
| 3 | Identity × Authorization × Station × AGWS × AI | MATERIAL / STREAK 0 | `ADAPTIVE_GOVERNED_WORK_SURFACES_EDGE_CASE_REGISTER.md`, `IDENTITY_AUTHENTICATION_FEDERATION_EDGE_CASE_REGISTER.md`, `AUTHORIZATION_POLICY_ORGANIZATION_MULTITENANCY_EDGE_CASE_REGISTER.md`, `GOVERNANCE_COMPLIANCE_AUDIT_EDGE_CASE_REGISTER.md`, `SECURITY_RESILIENCE_FAILURE_RECOVERY_EDGE_CASE_REGISTER.md`, `ENTERPRISE_TRUST_PKI_CERTIFICATE_LIFECYCLE_EDGE_CASE_REGISTER.md`, `PRIVACY_DATA_GOVERNANCE_RETENTION_LEGAL_HOLD_RESIDENCY_EDGE_CASE_REGISTER.md` | authority/currentness, SoD, inherited constraints, degraded/offline authority, cryptographic-validity separation, privacy-purpose eligibility and AI non-amplification deepening |
| 4 | Data/Schema × Privacy × Storage × Lifecycle | MATERIAL / STREAK 0 | `DATA_SCHEMA_MIGRATIONS_EDGE_CASE_REGISTER.md`, `GOVERNANCE_COMPLIANCE_AUDIT_EDGE_CASE_REGISTER.md`, `PRIVACY_DATA_GOVERNANCE_RETENTION_LEGAL_HOLD_RESIDENCY_EDGE_CASE_REGISTER.md` | `G2-XEDGE-DATA-PRIVACY-STORAGE-LIFECYCLE-001..004` + governance applicability/currentness + residual-population erasure/recovery/residency deepening |
| 5 | Build × Artifact/Release × Deployment × Runtime | MATERIAL / STREAK 0 | `BUILD_DEPENDENCY_GRAPH_REPRODUCIBILITY_EDGE_CASE_REGISTER.md` | `G2-XEDGE-BUILD-RELEASE-DEPLOY-RUNTIME-001..004` |
| 6 | Provider/Binding × external realizations | MATERIAL / STREAK 0 | `STORAGE_DOCUMENTS_MEDIA_EDGE_CASE_REGISTER.md`, `INTEGRATION_AUTOMATION_EDGE_CASE_REGISTER.md`, `IDENTITY_AUTHENTICATION_FEDERATION_EDGE_CASE_REGISTER.md`, `AUTHORIZATION_POLICY_ORGANIZATION_MULTITENANCY_EDGE_CASE_REGISTER.md`, `GOVERNANCE_COMPLIANCE_AUDIT_EDGE_CASE_REGISTER.md`, `SECURITY_RESILIENCE_FAILURE_RECOVERY_EDGE_CASE_REGISTER.md`, `ENTERPRISE_TRUST_PKI_CERTIFICATE_LIFECYCLE_EDGE_CASE_REGISTER.md`, `PRIVACY_DATA_GOVERNANCE_RETENTION_LEGAL_HOLD_RESIDENCY_EDGE_CASE_REGISTER.md` | provider report/certification/restore/failover/idempotency scope, trust-service ambiguity, residency support-vector qualification and provider-ACK versus erasure convergence deepening |
| 7 | Secrets/Config × Runtime × Provider substitution | MATERIAL / STREAK 0 | `SECRETS_CONFIGURATION_ENVIRONMENT_PORTABILITY_EDGE_CASE_REGISTER.md`, `SECURITY_RESILIENCE_FAILURE_RECOVERY_EDGE_CASE_REGISTER.md`, `ENTERPRISE_TRUST_PKI_CERTIFICATE_LIFECYCLE_EDGE_CASE_REGISTER.md` | `G2-XEDGE-SECRETS-RUNTIME-PROVIDER-001..004` + recovery/rotation/revocation/trust-generation residual-cohort races |
| 8 | Mathematical Expressions × Workflow × Data × UI/Form × Commercial/FinOps | MATERIAL / STREAK 0 | `TECHNOLOGY_ECONOMIC_GOVERNANCE_FINOPS_EDGE_CASE_REGISTER.md` | `G2-XEDGE-MATH-FINOPS-001..005` |
| 9 | Observability × Security/Recovery × runtime truth | MATERIAL / STREAK 0 | `DEPLOYMENT_RUNTIME_AUTONOMOUS_OPERATION_EDGE_CASE_REGISTER.md`, `GOVERNANCE_COMPLIANCE_AUDIT_EDGE_CASE_REGISTER.md`, `SECURITY_RESILIENCE_FAILURE_RECOVERY_EDGE_CASE_REGISTER.md`, `ENTERPRISE_TRUST_PKI_CERTIFICATE_LIFECYCLE_EDGE_CASE_REGISTER.md`, `PRIVACY_DATA_GOVERNANCE_RETENTION_LEGAL_HOLD_RESIDENCY_EDGE_CASE_REGISTER.md` | `G2-XEDGE-OBS-SEC-RECOVERY-RUNTIME-001..004` + posture/currentness, restore qualification, trust-evidence coverage and restore-versus-current-erasure truth deepening |
| 10 | Extension/Plugin × authority × provider trust × lifecycle | MATERIAL / STREAK 0 | `EXTENSION_PLUGIN_MARKETPLACE_ARCHITECTURE_EDGE_CASE_REGISTER.md` | `G2-XEDGE-EXTENSION-AUTH-TRUST-LIFECYCLE-001..004` |
| 11 | Commercial Metering × Entitlements × Rating × Billing × Payment | MATERIAL / STREAK 0 | `COMMERCIAL_METERING_ENTITLEMENTS_RATING_BILLING_PAYMENT_EDGE_CASE_REGISTER.md`, `SECURITY_RESILIENCE_FAILURE_RECOVERY_EDGE_CASE_REGISTER.md` | `G2-XEDGE-COMMERCIAL-001..005` + recovery-cut duplicate/missing external economic-effect risk |
| 12 | Enterprise Trust/PKI × Identity × Artifact/Release × provider substitution | MATERIAL / STREAK 0 | `ARTIFACT_RELEASE_SBOM_PROVENANCE_EDGE_CASE_REGISTER.md`, `IDENTITY_AUTHENTICATION_FEDERATION_EDGE_CASE_REGISTER.md`, `AUTHORIZATION_POLICY_ORGANIZATION_MULTITENANCY_EDGE_CASE_REGISTER.md`, `SECURITY_RESILIENCE_FAILURE_RECOVERY_EDGE_CASE_REGISTER.md`, `ENTERPRISE_TRUST_PKI_CERTIFICATE_LIFECYCLE_EDGE_CASE_REGISTER.md` | trust/federation/signature validity remains distinct from current identity/authorization; anchor/status currentness, rotation cohorts, emergency compromise and provider substitution require qualified convergence |

## Privacy / Data Governance deepening — reusable conflict links

No 13th mandatory cluster is added. Privacy / Data Governance links four reusable patterns into existing clusters:

| Conflict pattern | Cross-capability activation | Detection candidate | Status |
| --- | --- | --- | --- |
| `G2-CONFLICT-PATTERN-PURPOSE-USE-001` | technical authorization remains valid while current purpose/use eligibility does not | authorization + purpose/use + governed-population + obligation revision composition check | MATERIAL / catalogue |
| `G2-CONFLICT-PATTERN-PRESERVATION-DISPOSITION-001` | valid retention/disposition timer conflicts with independently valid preservation hold | complete applicable-obligation set + precedence/currentness qualification before delete | MATERIAL / catalogue; bounded preventive invariant candidate |
| `G2-CONFLICT-PATTERN-RESIDENCY-PLACEMENT-001` | primary resource placement is compliant but residual/derived/support populations fall outside qualified residency vector | provider support-vector + governed-population topology + residual-cohort inventory | MATERIAL / catalogue |
| `G2-CONFLICT-PATTERN-ERASURE-RECOVERY-001` | valid restore point contains data whose current erasure/restriction truth advanced after backup creation | restore-point versus post-point governance/disposition lineage diff + requalification | MATERIAL / catalogue |

These patterns preserve technical authorization != privacy-processing eligibility; retention expiry != deletion eligibility; provider region/resource success != population-wide residency closure; infrastructure restore success != current privacy/governance truth; primary-store delete ACK != complete erasure closure.

## Full Pass 1 campaign state

- mandatory clusters challenged: **12/12**;
- all mandatory cluster no-material streaks: **0**;
- canonical capabilities challenged locally: **21/28**;
- latest Privacy/Data Governance findings: **7 edge scenarios + 4 conflict patterns; local streak 0**;
- full passes completed: **0/8 minimum**;
- negative-space review: NOT STARTED;
- saturation: NOT SATURATED;
- `PLANNING_C_TARGET_ARCHITECTURE`: BLOCKED.

Detailed scenario fields remain authoritative in linked registers and `EDGE_CASE_INDEX.md`.