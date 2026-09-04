# Generation 2 — Cross-Capability Edge-Case Matrix

Status: ACTIVE
Phase: `RESEARCH_ADVERSARIAL_EDGE_CASE_SATURATION`

This matrix indexes detailed per-capability registers. It does not assert `ConflictInstance`s or authorize remediation. Preserve `ConflictPattern != ConflictInstance`, `Signal != ConfirmedConflict`, qualified evidence/currentness, provider IDs as non-canonical, `Enterprise → Station → Role → Person`, AI/AGWS non-amplification and `UNKNOWN → reconcile-before-retry`.

## Mandatory cluster rotation — Full Pass 1

| # | Cluster | Status | Detailed register(s) | Material range / deepening |
| --- | --- | --- | --- | --- |
| 1 | Process/Application × Workflow × Data/Schema | MATERIAL / STREAK 0 | `PROCESS_APPLICATION_MODELING_EDGE_CASE_REGISTER.md` | `G2-XEDGE-PROCESS-WORKFLOW-DATA-001..004` |
| 2 | Workflow × Integration × Messaging × external mutation | MATERIAL / STREAK 0 | `WORKFLOW_DURABLE_EXECUTION_EDGE_CASE_REGISTER.md`, `INTEGRATION_AUTOMATION_EDGE_CASE_REGISTER.md`, `SECURITY_RESILIENCE_FAILURE_RECOVERY_EDGE_CASE_REGISTER.md`, `NOTIFICATIONS_EVENTS_MESSAGING_EDGE_CASE_REGISTER.md` | `G2-XEDGE-WORKFLOW-INTEGRATION-MSG-001..004` + ACK/effect + ordering/retry/replay deepening |
| 3 | Identity × Authorization × Station × AGWS × AI | MATERIAL / STREAK 0 | existing registers + `OBSERVABILITY_OPERATIONS_INCIDENT_EDGE_CASE_REGISTER.md` | authority/currentness, SoD, degraded/offline authority, privacy-purpose eligibility, recipient authority and operational-remediation non-amplification |
| 4 | Data/Schema × Privacy × Storage × Lifecycle | MATERIAL / STREAK 0 | existing registers + `OBSERVABILITY_OPERATIONS_INCIDENT_EDGE_CASE_REGISTER.md` | `G2-XEDGE-DATA-PRIVACY-STORAGE-LIFECYCLE-001..004` + retained telemetry/privacy/revision-currentness deepening |
| 5 | Build × Artifact/Release × Deployment × Runtime | MATERIAL / STREAK 0 | `BUILD_DEPENDENCY_GRAPH_REPRODUCIBILITY_EDGE_CASE_REGISTER.md` | `G2-XEDGE-BUILD-RELEASE-DEPLOY-RUNTIME-001..004` |
| 6 | Provider/Binding × external realizations | MATERIAL / STREAK 0 | existing provider-related registers + `OBSERVABILITY_OPERATIONS_INCIDENT_EDGE_CASE_REGISTER.md` | provider report/ACK/health semantics + telemetry identity, collection degradation and residual backend cohorts |
| 7 | Secrets/Config × Runtime × Provider substitution | MATERIAL / STREAK 0 | existing registers | `G2-XEDGE-SECRETS-RUNTIME-PROVIDER-001..004` + recovery/rotation/revocation/trust-generation residual-cohort races |
| 8 | Mathematical Expressions × Workflow × Data × UI/Form × Commercial/FinOps | MATERIAL / STREAK 0 | `TECHNOLOGY_ECONOMIC_GOVERNANCE_FINOPS_EDGE_CASE_REGISTER.md` | `G2-XEDGE-MATH-FINOPS-001..005` |
| 9 | Observability × Security/Recovery × runtime truth | MATERIAL / STREAK 0 | prior registers + `OBSERVABILITY_OPERATIONS_INCIDENT_EDGE_CASE_REGISTER.md` | `G2-XEDGE-OBS-SEC-RECOVERY-RUNTIME-001..004` + coverage gaps, alert/condition separation, monitoring-green versus protected/runtime/domain convergence |
| 10 | Extension/Plugin × authority × provider trust × lifecycle | MATERIAL / STREAK 0 | `EXTENSION_PLUGIN_MARKETPLACE_ARCHITECTURE_EDGE_CASE_REGISTER.md` | `G2-XEDGE-EXTENSION-AUTH-TRUST-LIFECYCLE-001..004` |
| 11 | Commercial Metering × Entitlements × Rating × Billing × Payment | MATERIAL / STREAK 0 | existing registers | `G2-XEDGE-COMMERCIAL-001..005` + recovery-cut duplicate/missing external economic-effect risk |
| 12 | Enterprise Trust/PKI × Identity × Artifact/Release × provider substitution | MATERIAL / STREAK 0 | existing trust/artifact/identity/security registers | trust/federation/signature validity distinct from current identity/authorization; anchor/status currentness, rotation cohorts and provider substitution require qualified convergence |

## Observability / Operations / Incident deepening — reusable conflict links

No 13th mandatory cluster is added.

| Conflict pattern | Cross-capability activation | Detection candidate | Status |
| --- | --- | --- | --- |
| `G2-CONFLICT-PATTERN-OBSERVABILITY-COVERAGE-001` | received telemetry is locally valid while required monitored population/currentness is incomplete due to sampling, overflow, missing series or collection partition | target population + collection topology + sampling/overflow/missing-series/currentness qualification | MATERIAL / catalogue |
| `G2-CONFLICT-PATTERN-ALERT-CONDITION-001` | alert/notification workflow becomes muted/resolved/acknowledged while underlying runtime/security/domain condition remains active or unknown | alert state reason + underlying evidence + monitored-owner postcondition/residual-cohort correlation | MATERIAL / catalogue |
| `G2-CONFLICT-PATTERN-OBSERVABILITY-REVISION-001` | independently valid signal/rule/SLO revisions are compared or aggregated as if semantically equivalent | revision-vector + dimensions/units/windows + producing-revision compatibility check | MATERIAL / catalogue |
| `G2-CONFLICT-PATTERN-OPERATIONAL-AUTHORITY-001` | valid signal or AI/runbook recommendation proposes action outside current `Enterprise → Station → Role → Person` authority or SoD envelope | pre-actuation authority/policy/trust re-evaluation + mutating-effect qualification | MATERIAL / catalogue |

These preserve `sampled/visible evidence != complete truth`, `alert lifecycle != condition lifecycle`, `historical/revisioned evaluation != current equivalence`, and `operational urgency/AI confidence != actuation authority`.

## Full Pass 1 campaign state

- mandatory clusters challenged: **12/12**;
- all mandatory cluster no-material streaks: **0**;
- canonical capabilities challenged locally: **23/28**;
- latest Observability findings: **7 edge scenarios + 4 conflict patterns; local streak 0**;
- full passes completed: **0/8 minimum**;
- negative-space review: NOT STARTED;
- saturation: NOT SATURATED;
- `PLANNING_C_TARGET_ARCHITECTURE`: BLOCKED.

Detailed scenario fields remain authoritative in linked registers and `EDGE_CASE_INDEX.md`.