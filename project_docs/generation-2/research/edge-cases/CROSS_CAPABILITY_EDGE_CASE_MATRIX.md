# Generation 2 — Cross-Capability Edge-Case Matrix

Status: ACTIVE
Phase: `RESEARCH_ADVERSARIAL_EDGE_CASE_SATURATION`

This matrix indexes detailed per-capability registers. It does not assert `ConflictInstance`s or authorize remediation. Preserve `ConflictPattern != ConflictInstance`, `Signal != ConfirmedConflict`, qualified evidence/currentness, provider IDs as non-canonical, `Enterprise → Station → Role → Person`, AI/AGWS non-amplification and `UNKNOWN → reconcile-before-retry`.

## Mandatory cluster rotation — Full Pass 1

| # | Cluster | Status | Detailed register(s) | Material range / deepening |
| --- | --- | --- | --- | --- |
| 1 | Process/Application × Workflow × Data/Schema | MATERIAL / STREAK 0 | `PROCESS_APPLICATION_MODELING_EDGE_CASE_REGISTER.md` | `G2-XEDGE-PROCESS-WORKFLOW-DATA-001..004` |
| 2 | Workflow × Integration × Messaging × external mutation | MATERIAL / STREAK 0 | `WORKFLOW_DURABLE_EXECUTION_EDGE_CASE_REGISTER.md`, `INTEGRATION_AUTOMATION_EDGE_CASE_REGISTER.md`, `SECURITY_RESILIENCE_FAILURE_RECOVERY_EDGE_CASE_REGISTER.md`, `NOTIFICATIONS_EVENTS_MESSAGING_EDGE_CASE_REGISTER.md` | `G2-XEDGE-WORKFLOW-INTEGRATION-MSG-001..004` + ACK/effect + ordering/retry/replay deepening |
| 3 | Identity × Authorization × Station × AGWS × AI | MATERIAL / STREAK 0 | existing registers + `OBSERVABILITY_OPERATIONS_INCIDENT_EDGE_CASE_REGISTER.md` + `DEVELOPER_OPERATOR_EXPERIENCE_SELF_HOSTING_EDGE_CASE_REGISTER.md` + `PROVIDER_BINDING_CAPABILITY_NEGOTIATION_EDGE_CASE_REGISTER.md` | authority/currentness, SoD, degraded/offline authority, operational non-amplification, local/provider privilege != canonical authority, and aggregate provider composition cannot exceed delegated authority |
| 4 | Data/Schema × Privacy × Storage × Lifecycle | MATERIAL / STREAK 0 | existing registers + `OBSERVABILITY_OPERATIONS_INCIDENT_EDGE_CASE_REGISTER.md` | `G2-XEDGE-DATA-PRIVACY-STORAGE-LIFECYCLE-001..004` + retained telemetry/privacy/revision-currentness deepening |
| 5 | Build × Artifact/Release × Deployment × Runtime | MATERIAL / STREAK 0 | `BUILD_DEPENDENCY_GRAPH_REPRODUCIBILITY_EDGE_CASE_REGISTER.md`, `DEVELOPER_OPERATOR_EXPERIENCE_SELF_HOSTING_EDGE_CASE_REGISTER.md` | `G2-XEDGE-BUILD-RELEASE-DEPLOY-RUNTIME-001..004` + operator/runbook/CLI revision-vector and upgrade-order qualification |
| 6 | Provider/Binding × external realizations | MATERIAL / STREAK 0 | existing provider-related registers + `OBSERVABILITY_OPERATIONS_INCIDENT_EDGE_CASE_REGISTER.md` + `DEVELOPER_OPERATOR_EXPERIENCE_SELF_HOSTING_EDGE_CASE_REGISTER.md` + `PROVIDER_BINDING_CAPABILITY_NEGOTIATION_EDGE_CASE_REGISTER.md` | provider feature/protocol label != portable semantics; stale qualification; ACK != effect; `UNKNOWN` reconcile-before-retry; binding coexistence/residual cohorts; provider IDs non-canonical; degradation/offline currentness |
| 7 | Secrets/Config × Runtime × Provider substitution | MATERIAL / STREAK 0 | existing registers + `DEVELOPER_OPERATOR_EXPERIENCE_SELF_HOSTING_EDGE_CASE_REGISTER.md` + `PROVIDER_BINDING_CAPABILITY_NEGOTIATION_EDGE_CASE_REGISTER.md` | `G2-XEDGE-SECRETS-RUNTIME-PROVIDER-001..004` + recovery/rotation/revocation and binding/config revision skew + residual-cohort races + offline qualification currentness |
| 8 | Mathematical Expressions × Workflow × Data × UI/Form × Commercial/FinOps | MATERIAL / STREAK 0 | `TECHNOLOGY_ECONOMIC_GOVERNANCE_FINOPS_EDGE_CASE_REGISTER.md` | `G2-XEDGE-MATH-FINOPS-001..005` |
| 9 | Observability × Security/Recovery × runtime truth | MATERIAL / STREAK 0 | prior registers + `OBSERVABILITY_OPERATIONS_INCIDENT_EDGE_CASE_REGISTER.md` + `DEVELOPER_OPERATOR_EXPERIENCE_SELF_HOSTING_EDGE_CASE_REGISTER.md` + `PROVIDER_BINDING_CAPABILITY_NEGOTIATION_EDGE_CASE_REGISTER.md` | `G2-XEDGE-OBS-SEC-RECOVERY-RUNTIME-001..004` + provider reachability/health/ACK != semantic qualification, canonical effect, convergence or safe-retry evidence |
| 10 | Extension/Plugin × authority × provider trust × lifecycle | MATERIAL / STREAK 0 | `EXTENSION_PLUGIN_MARKETPLACE_ARCHITECTURE_EDGE_CASE_REGISTER.md` | `G2-XEDGE-EXTENSION-AUTH-TRUST-LIFECYCLE-001..004` |
| 11 | Commercial Metering × Entitlements × Rating × Billing × Payment | MATERIAL / STREAK 0 | existing registers + `PROVIDER_BINDING_CAPABILITY_NEGOTIATION_EDGE_CASE_REGISTER.md` | `G2-XEDGE-COMMERCIAL-001..005` + provider fan-out/fallback can amplify economic effects unless aggregate composition is bounded |
| 12 | Enterprise Trust/PKI × Identity × Artifact/Release × provider substitution | MATERIAL / STREAK 0 | existing trust/artifact/identity/security registers + `PROVIDER_BINDING_CAPABILITY_NEGOTIATION_EDGE_CASE_REGISTER.md` | trust/protocol compatibility is only a qualification dimension; anchor/status currentness, revision vectors, rotation cohorts and provider substitution require semantic qualification and convergence |

## Provider / Binding / Capability Negotiation deepening — reusable conflict links

No 13th mandatory cluster is added.

| Conflict pattern | Cross-capability activation | Detection candidate | Status |
| --- | --- | --- | --- |
| `G2-CONFLICT-PATTERN-PROVIDER-QUALIFICATION-001` | provider is protocol-compatible/feature-advertised while one or more required semantic, policy or currentness dimensions are unsupported/unknown | requirement-vector × support-vector + provider-differential semantic corpus + current policy/trust evidence | MATERIAL / catalogue |
| `G2-CONFLICT-PATTERN-BINDING-COEXISTENCE-001` | old/new bindings are individually valid but residual old cohorts remain authoritative after cutover | binding/cohort graph + in-flight operation/route/subscription/session/credential inventory + convergence evidence | MATERIAL / catalogue |
| `G2-CONFLICT-PATTERN-PROVIDER-EFFECT-001` | retry is locally allowed while first remote mutation is `UNKNOWN`, idempotency scope/horizon is insufficient, or target state changed | effect disposition + provider operation mapping + idempotency qualification + current target revision | MATERIAL / catalogue |
| `G2-CONFLICT-PATTERN-PROVIDER-COMPOSITION-AUTHORITY-001` | individually admitted providers are composed into fallback/fan-out/probing that exceeds aggregate authority, privacy, quota or cost bounds | aggregate binding graph + Enterprise→Station→Role→Person + governance/privacy + cost/quota + semantic requirement vector | MATERIAL / catalogue |

These preserve `protocol/feature compatibility != semantic equivalence`, `bound/cut over != residual cohort drained`, `provider ACK != canonical effect`, `transport failure != NOT_APPLIED`, `provider-native identity != canonical identity`, and `individually admitted != aggregate composition authorized`.

## Full Pass 1 campaign state

- mandatory clusters challenged: **12/12**;
- all mandatory cluster no-material streaks: **0**;
- canonical capabilities challenged locally: **25/28**;
- latest Provider/Binding findings: **7 edge scenarios + 4 conflict patterns; local streak 0**;
- full passes completed: **0/8 minimum**;
- negative-space review: NOT STARTED;
- saturation: NOT SATURATED;
- `PLANNING_C_TARGET_ARCHITECTURE`: BLOCKED.

Detailed scenario fields remain authoritative in linked registers and `EDGE_CASE_INDEX.md`.