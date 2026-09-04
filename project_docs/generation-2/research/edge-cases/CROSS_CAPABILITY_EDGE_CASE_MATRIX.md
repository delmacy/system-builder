# Generation 2 — Cross-Capability Edge-Case Matrix

Status: ACTIVE
Phase: `RESEARCH_ADVERSARIAL_EDGE_CASE_SATURATION`

This matrix indexes detailed per-capability registers. It does not assert `ConflictInstance`s or authorize remediation. Preserve `ConflictPattern != ConflictInstance`, `Signal != ConfirmedConflict`, qualified evidence/currentness, provider IDs as non-canonical, `Enterprise → Station → Role → Person`, AI/AGWS non-amplification and `UNKNOWN → reconcile-before-retry`.

## Mandatory cluster rotation — Full Pass 1

| # | Cluster | Status | Detailed register(s) | Material range / deepening |
| --- | --- | --- | --- | --- |
| 1 | Process/Application × Workflow × Data/Schema | MATERIAL / STREAK 0 | `PROCESS_APPLICATION_MODELING_EDGE_CASE_REGISTER.md` | `G2-XEDGE-PROCESS-WORKFLOW-DATA-001..004` |
| 2 | Workflow × Integration × Messaging × external mutation | MATERIAL / STREAK 0 | existing registers + `STANDARDS_INTEROPERABILITY_API_CONTRACTS_EDGE_CASE_REGISTER.md` | `G2-XEDGE-WORKFLOW-INTEGRATION-MSG-001..004` + ACK/effect, scoped ordering/retry/replay, API-revision idempotency and protocol-success != canonical effect deepening |
| 3 | Identity × Authorization × Station × AGWS × AI | MATERIAL / STREAK 0 | existing registers + `STANDARDS_INTEROPERABILITY_API_CONTRACTS_EDGE_CASE_REGISTER.md` | authority/currentness, SoD, degraded/offline authority, external IDs non-canonical, negotiated/generated contracts cannot weaken inherited authority |
| 4 | Data/Schema × Privacy × Storage × Lifecycle | MATERIAL / STREAK 0 | existing registers + `STANDARDS_INTEROPERABILITY_API_CONTRACTS_EDGE_CASE_REGISTER.md` | `G2-XEDGE-DATA-PRIVACY-STORAGE-LIFECYCLE-001..004` + API/schema compatibility, privacy constraints and residual old-client/cohort coexistence deepening |
| 5 | Build × Artifact/Release × Deployment × Runtime | MATERIAL / STREAK 0 | existing registers | `G2-XEDGE-BUILD-RELEASE-DEPLOY-RUNTIME-001..004` + operator/runbook/CLI revision-vector and upgrade-order qualification |
| 6 | Provider/Binding × external realizations | MATERIAL / STREAK 0 | existing provider-related registers + `STANDARDS_INTEROPERABILITY_API_CONTRACTS_EDGE_CASE_REGISTER.md` | provider feature/protocol label != portable semantics; schema-valid != semantically equivalent; stale qualification; ACK != effect; `UNKNOWN` reconcile-before-retry; binding/contract coexistence and residual cohorts |
| 7 | Secrets/Config × Runtime × Provider substitution | MATERIAL / STREAK 0 | existing registers | `G2-XEDGE-SECRETS-RUNTIME-PROVIDER-001..004` + recovery/rotation/revocation and binding/config revision skew + residual-cohort races + offline qualification currentness |
| 8 | Mathematical Expressions × Workflow × Data × UI/Form × Commercial/FinOps | MATERIAL / STREAK 0 | `TECHNOLOGY_ECONOMIC_GOVERNANCE_FINOPS_EDGE_CASE_REGISTER.md` | `G2-XEDGE-MATH-FINOPS-001..005` |
| 9 | Observability × Security/Recovery × runtime truth | MATERIAL / STREAK 0 | existing registers | `G2-XEDGE-OBS-SEC-RECOVERY-RUNTIME-001..004` + provider reachability/health/ACK != semantic qualification, canonical effect, convergence or safe-retry evidence |
| 10 | Extension/Plugin × authority × provider trust × lifecycle | MATERIAL / STREAK 0 | `EXTENSION_PLUGIN_MARKETPLACE_ARCHITECTURE_EDGE_CASE_REGISTER.md` | `G2-XEDGE-EXTENSION-AUTH-TRUST-LIFECYCLE-001..004` |
| 11 | Commercial Metering × Entitlements × Rating × Billing × Payment | MATERIAL / STREAK 0 | existing registers | `G2-XEDGE-COMMERCIAL-001..005` + provider fan-out/fallback can amplify economic effects unless aggregate composition is bounded |
| 12 | Enterprise Trust/PKI × Identity × Artifact/Release × provider substitution | MATERIAL / STREAK 0 | existing trust/artifact/identity/security registers + `STANDARDS_INTEROPERABILITY_API_CONTRACTS_EDGE_CASE_REGISTER.md` | trust/protocol compatibility is only a qualification dimension; canonicalization/profile currentness, revision vectors, rotation cohorts, downgrade and provider substitution require semantic qualification and convergence |

## Standards / Interoperability / API Contracts deepening — reusable conflict links

No 13th mandatory cluster is added.

| Conflict pattern | Cross-capability activation | Detection candidate | Status |
| --- | --- | --- | --- |
| `G2-CONFLICT-PATTERN-CONFORMANCE-SEMANTICS-001` | producer/consumer are schema/protocol conformant while transported domain meanings/postconditions differ or remain unqualified | semantic-profile diff + revision/currentness vector + semantic-owner corpus + postcondition reconciliation | MATERIAL / catalogue |
| `G2-CONFLICT-PATTERN-NEGOTIATION-NONWEAKENING-001` | mutually supported fallback/downgrade exists but superior authority/privacy/trust/governance/domain constraints require stronger semantics | negotiated profile × current policy/authority/trust/semantic requirement vector | MATERIAL / catalogue |
| `G2-CONFLICT-PATTERN-CONTRACT-EFFECT-001` | protocol ACK/failure or method-level idempotency is treated as canonical effect certainty or universal retry safety | operation contract + effect disposition + idempotency scope/horizon + current target revision + reconciliation | MATERIAL / catalogue |
| `G2-CONFLICT-PATTERN-CONTRACT-COEXISTENCE-001` | old/new contract revisions are individually valid but residual old clients/adapters/providers remain able to create authoritative effects after cutover/withdrawal | compatibility/cohort graph + runtime old-revision traffic/effects + lifecycle convergence evidence | MATERIAL / catalogue |

These preserve `syntax/structure conformance != semantic equivalence`, `negotiated compatible != permitted weakening`, `ACK/method idempotency != canonical effect`, and `withdrawn/published != residual authoritative cohort drained`.

## Full Pass 1 campaign state

- mandatory clusters challenged: **12/12**;
- all mandatory cluster no-material streaks: **0**;
- canonical capabilities challenged locally: **26/28**;
- latest Standards/API findings: **7 edge scenarios + 4 conflict patterns; local streak 0**;
- full passes completed: **0/8 minimum**;
- negative-space review: NOT STARTED;
- saturation: NOT SATURATED;
- `PLANNING_C_TARGET_ARCHITECTURE`: BLOCKED.

Detailed scenario fields remain authoritative in linked registers and `EDGE_CASE_INDEX.md`.