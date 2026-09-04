# Generation 2 — Cross-Capability Edge-Case Matrix

Status: ACTIVE
Phase: `RESEARCH_ADVERSARIAL_EDGE_CASE_SATURATION`

This matrix indexes detailed per-capability registers. It does not assert `ConflictInstance`s or authorize remediation. Preserve `ConflictPattern != ConflictInstance`, `Signal != ConfirmedConflict`, qualified evidence/currentness, provider IDs as non-canonical, `Enterprise → Station → Role → Person`, AI/AGWS non-amplification and `UNKNOWN → reconcile-before-retry`.

## Mandatory cluster rotation — Full Pass 1

| # | Cluster | Status | Detailed register(s) | Material range / deepening |
| --- | --- | --- | --- | --- |
| 1 | Process/Application × Workflow × Data/Schema | MATERIAL / STREAK 0 | `PROCESS_APPLICATION_MODELING_EDGE_CASE_REGISTER.md` | `G2-XEDGE-PROCESS-WORKFLOW-DATA-001..004` |
| 2 | Workflow × Integration × Messaging × external mutation | MATERIAL / STREAK 0 | `WORKFLOW_DURABLE_EXECUTION_EDGE_CASE_REGISTER.md`, `INTEGRATION_AUTOMATION_EDGE_CASE_REGISTER.md`, `SECURITY_RESILIENCE_FAILURE_RECOVERY_EDGE_CASE_REGISTER.md`, `NOTIFICATIONS_EVENTS_MESSAGING_EDGE_CASE_REGISTER.md` | `G2-XEDGE-WORKFLOW-INTEGRATION-MSG-001..004` + ACK/effect + ordering/retry/replay deepening |
| 3 | Identity × Authorization × Station × AGWS × AI | MATERIAL / STREAK 0 | existing registers + `OBSERVABILITY_OPERATIONS_INCIDENT_EDGE_CASE_REGISTER.md` + `DEVELOPER_OPERATOR_EXPERIENCE_SELF_HOSTING_EDGE_CASE_REGISTER.md` | authority/currentness, SoD, degraded/offline authority, privacy-purpose eligibility, recipient authority, operational-remediation non-amplification and local/provider admin privilege != canonical authority |
| 4 | Data/Schema × Privacy × Storage × Lifecycle | MATERIAL / STREAK 0 | existing registers + `OBSERVABILITY_OPERATIONS_INCIDENT_EDGE_CASE_REGISTER.md` | `G2-XEDGE-DATA-PRIVACY-STORAGE-LIFECYCLE-001..004` + retained telemetry/privacy/revision-currentness deepening |
| 5 | Build × Artifact/Release × Deployment × Runtime | MATERIAL / STREAK 0 | `BUILD_DEPENDENCY_GRAPH_REPRODUCIBILITY_EDGE_CASE_REGISTER.md`, `DEVELOPER_OPERATOR_EXPERIENCE_SELF_HOSTING_EDGE_CASE_REGISTER.md` | `G2-XEDGE-BUILD-RELEASE-DEPLOY-RUNTIME-001..004` + operator/runbook/CLI revision-vector and upgrade-order qualification |
| 6 | Provider/Binding × external realizations | MATERIAL / STREAK 0 | existing provider-related registers + `OBSERVABILITY_OPERATIONS_INCIDENT_EDGE_CASE_REGISTER.md` + `DEVELOPER_OPERATOR_EXPERIENCE_SELF_HOSTING_EDGE_CASE_REGISTER.md` | provider report/ACK/health semantics + telemetry identity + residual privileged agents/toolchains + ambiguous administrative effects |
| 7 | Secrets/Config × Runtime × Provider substitution | MATERIAL / STREAK 0 | existing registers + `DEVELOPER_OPERATOR_EXPERIENCE_SELF_HOSTING_EDGE_CASE_REGISTER.md` | `G2-XEDGE-SECRETS-RUNTIME-PROVIDER-001..004` + recovery/rotation/revocation/trust-generation residual-cohort races + offline/runbook currentness |
| 8 | Mathematical Expressions × Workflow × Data × UI/Form × Commercial/FinOps | MATERIAL / STREAK 0 | `TECHNOLOGY_ECONOMIC_GOVERNANCE_FINOPS_EDGE_CASE_REGISTER.md` | `G2-XEDGE-MATH-FINOPS-001..005` |
| 9 | Observability × Security/Recovery × runtime truth | MATERIAL / STREAK 0 | prior registers + `OBSERVABILITY_OPERATIONS_INCIDENT_EDGE_CASE_REGISTER.md` + `DEVELOPER_OPERATOR_EXPERIENCE_SELF_HOSTING_EDGE_CASE_REGISTER.md` | `G2-XEDGE-OBS-SEC-RECOVERY-RUNTIME-001..004` + coverage gaps + alert/condition separation + operator-visible health/support evidence != protected/runtime/domain convergence or recovery qualification |
| 10 | Extension/Plugin × authority × provider trust × lifecycle | MATERIAL / STREAK 0 | `EXTENSION_PLUGIN_MARKETPLACE_ARCHITECTURE_EDGE_CASE_REGISTER.md` | `G2-XEDGE-EXTENSION-AUTH-TRUST-LIFECYCLE-001..004` |
| 11 | Commercial Metering × Entitlements × Rating × Billing × Payment | MATERIAL / STREAK 0 | existing registers | `G2-XEDGE-COMMERCIAL-001..005` + recovery-cut duplicate/missing external economic-effect risk |
| 12 | Enterprise Trust/PKI × Identity × Artifact/Release × provider substitution | MATERIAL / STREAK 0 | existing trust/artifact/identity/security registers | trust/federation/signature validity distinct from current identity/authorization; anchor/status currentness, rotation cohorts and provider substitution require qualified convergence |

## Developer / Operator Experience / Self-hosting deepening — reusable conflict links

No 13th mandatory cluster is added.

| Conflict pattern | Cross-capability activation | Detection candidate | Status |
| --- | --- | --- | --- |
| `G2-CONFLICT-PATTERN-OPERATOR-REVISION-001` | docs/runbook, CLI/installer, runtime, schema/config, provider or trust revisions are individually valid but not jointly supported | pre-execution revision-vector + capability/support-vector qualification | MATERIAL / catalogue |
| `G2-CONFLICT-PATTERN-OPERATOR-EVIDENCE-001` | support/diagnostic bundle is valid for collected evidence while collection/redaction/currentness leaves a larger claim unsupported | requested-versus-collected population + failure/redaction/currentness + claim-scope comparison | MATERIAL / catalogue |
| `G2-CONFLICT-PATTERN-ADMIN-EFFECT-001` | retry guidance remains locally valid while first effect is ambiguous and concurrent upgrade/recovery/provider/authority state changed | operation/effect reconciliation + revision/current-authority requalification before retry | MATERIAL / catalogue |
| `G2-CONFLICT-PATTERN-LOCAL-ADMIN-AUTHORITY-001` | host/provider permits a privileged action while canonical enterprise/station/role policy or SoD denies it | current Enterprise→Station→Role→Person + exception + residual-cohort qualification before actuation | MATERIAL / catalogue |

These preserve `locally supported != compositionally supported`, `support bundle exists != complete/current evidence`, `transport failure != NOT_APPLIED`, `local/root/provider privilege != canonical authority`, and `self-hosted/offline != indefinitely qualified closure`.

## Full Pass 1 campaign state

- mandatory clusters challenged: **12/12**;
- all mandatory cluster no-material streaks: **0**;
- canonical capabilities challenged locally: **24/28**;
- latest Developer/Operator findings: **7 edge scenarios + 4 conflict patterns; local streak 0**;
- full passes completed: **0/8 minimum**;
- negative-space review: NOT STARTED;
- saturation: NOT SATURATED;
- `PLANNING_C_TARGET_ARCHITECTURE`: BLOCKED.

Detailed scenario fields remain authoritative in linked registers and `EDGE_CASE_INDEX.md`.