# Generation 2 — Cross-Capability Edge-Case Matrix

Status: ACTIVE
Phase: `RESEARCH_ADVERSARIAL_EDGE_CASE_SATURATION`

This matrix indexes detailed per-capability registers. It does not assert `ConflictInstance`s or authorize remediation. Preserve `ConflictPattern != ConflictInstance`, `Signal != ConfirmedConflict`, qualified evidence/currentness, provider IDs as non-canonical, `Enterprise → Station → Role → Person`, AI/AGWS non-amplification and `UNKNOWN → reconcile-before-retry`.

## Mandatory cluster rotation — Full Pass 1

| # | Cluster | Status | Detailed register(s) | Material range / deepening |
| --- | --- | --- | --- | --- |
| 1 | Process/Application × Workflow × Data/Schema | MATERIAL / STREAK 0 | `PROCESS_APPLICATION_MODELING_EDGE_CASE_REGISTER.md` | `G2-XEDGE-PROCESS-WORKFLOW-DATA-001..004` |
| 2 | Workflow × Integration × Messaging × external mutation | MATERIAL / STREAK 0 | `WORKFLOW_DURABLE_EXECUTION_EDGE_CASE_REGISTER.md`, `INTEGRATION_AUTOMATION_EDGE_CASE_REGISTER.md` | `G2-XEDGE-WORKFLOW-INTEGRATION-MSG-001..004` + Integration deepening |
| 3 | Identity × Authorization × Station × AGWS × AI | MATERIAL / STREAK 0 | `ADAPTIVE_GOVERNED_WORK_SURFACES_EDGE_CASE_REGISTER.md`, `INTEGRATION_AUTOMATION_EDGE_CASE_REGISTER.md`, `IDENTITY_AUTHENTICATION_FEDERATION_EDGE_CASE_REGISTER.md` | `G2-XEDGE-IDENTITY-AUTH-STATION-AGWS-AI-001..003` + Identity authentication-currentness/recovery-authority deepening |
| 4 | Data/Schema × Privacy × Storage × Lifecycle | MATERIAL / STREAK 0 | `DATA_SCHEMA_MIGRATIONS_EDGE_CASE_REGISTER.md` | `G2-XEDGE-DATA-PRIVACY-STORAGE-LIFECYCLE-001..004` |
| 5 | Build × Artifact/Release × Deployment × Runtime | MATERIAL / STREAK 0 | `BUILD_DEPENDENCY_GRAPH_REPRODUCIBILITY_EDGE_CASE_REGISTER.md` | `G2-XEDGE-BUILD-RELEASE-DEPLOY-RUNTIME-001..004` |
| 6 | Provider/Binding × external realizations | MATERIAL / STREAK 0 | `STORAGE_DOCUMENTS_MEDIA_EDGE_CASE_REGISTER.md`, `INTEGRATION_AUTOMATION_EDGE_CASE_REGISTER.md`, `IDENTITY_AUTHENTICATION_FEDERATION_EDGE_CASE_REGISTER.md` | `G2-XEDGE-PROVIDER-STORAGE-001..004` + Integration/Identity semantic-substitution deepening |
| 7 | Secrets/Config × Runtime × Provider substitution | MATERIAL / STREAK 0 | `SECRETS_CONFIGURATION_ENVIRONMENT_PORTABILITY_EDGE_CASE_REGISTER.md` | `G2-XEDGE-SECRETS-RUNTIME-PROVIDER-001..004` |
| 8 | Mathematical Expressions × Workflow × Data × UI/Form × Commercial/FinOps | MATERIAL / STREAK 0 | `TECHNOLOGY_ECONOMIC_GOVERNANCE_FINOPS_EDGE_CASE_REGISTER.md` | `G2-XEDGE-MATH-FINOPS-001..005` |
| 9 | Observability × Security/Recovery × runtime truth | MATERIAL / STREAK 0 | `DEPLOYMENT_RUNTIME_AUTONOMOUS_OPERATION_EDGE_CASE_REGISTER.md` | `G2-XEDGE-OBS-SEC-RECOVERY-RUNTIME-001..004` |
| 10 | Extension/Plugin × authority × provider trust × lifecycle | MATERIAL / STREAK 0 | `EXTENSION_PLUGIN_MARKETPLACE_ARCHITECTURE_EDGE_CASE_REGISTER.md` | `G2-XEDGE-EXTENSION-AUTH-TRUST-LIFECYCLE-001..004` |
| 11 | Commercial Metering × Entitlements × Rating × Billing × Payment | MATERIAL / STREAK 0 | `COMMERCIAL_METERING_ENTITLEMENTS_RATING_BILLING_PAYMENT_EDGE_CASE_REGISTER.md` | `G2-XEDGE-COMMERCIAL-001..005` |
| 12 | Enterprise Trust/PKI × Identity × Artifact/Release × provider substitution | MATERIAL / STREAK 0 | `ARTIFACT_RELEASE_SBOM_PROVENANCE_EDGE_CASE_REGISTER.md`, `IDENTITY_AUTHENTICATION_FEDERATION_EDGE_CASE_REGISTER.md` | `G2-XEDGE-TRUST-IDENTITY-ARTIFACT-PROVIDER-001..004` + federation metadata/key epoch and provider-coexistence deepening |

## Identity deepening — reusable conflict links

No 13th mandatory cluster is added. The Identity local visit links four new reusable patterns into existing clusters:

| Conflict pattern | Cross-capability activation | Detection candidate | Status |
| --- | --- | --- | --- |
| `G2-CONFLICT-PATTERN-IDENTITY-MAPPING-001` | locally valid provider mappings resolve incompatible canonical subjects | mapping/lineage uniqueness + revision-qualified collision detection | MATERIAL / catalogue |
| `G2-CONFLICT-PATTERN-AUTHENTICATION-CURRENTNESS-001` | valid session/assertion crosses Role/Station/policy/trust/identity revisions | actuation-time currentness/revision qualification | MATERIAL / catalogue |
| `G2-CONFLICT-PATTERN-FEDERATION-COEXISTENCE-001` | old/new issuer, key, mapping or provider epochs coexist and each validate locally | residual-cohort inventory + revision-vector comparison | MATERIAL / catalogue |
| `G2-CONFLICT-PATTERN-RECOVERY-IDENTITY-AUTHORITY-001` | valid recovery/reset primitives compose into assurance or authority bypass | SoD/authority/assurance precheck + lineage audit | MATERIAL / catalogue |

Existing reusable patterns from UCA, UI and Integration remain authoritative in their originating registers and prior matrix history. Identity findings reinforce the distinction between authentication evidence and authorization, provider identity and canonical identity, cryptographic validity and current federation qualification, and recovery availability and authority safety.

## Full Pass 1 campaign state

- mandatory clusters challenged: **12/12**;
- all mandatory cluster no-material streaks: **0**;
- canonical capabilities challenged locally: **16/28**;
- latest Identity findings: **7 edge scenarios + 4 conflict patterns; local streak 0**;
- full passes completed: **0/8 minimum**;
- negative-space review: NOT STARTED;
- saturation: NOT SATURATED;
- `PLANNING_C_TARGET_ARCHITECTURE`: BLOCKED.

Detailed scenario fields remain authoritative in linked registers and `EDGE_CASE_INDEX.md`.