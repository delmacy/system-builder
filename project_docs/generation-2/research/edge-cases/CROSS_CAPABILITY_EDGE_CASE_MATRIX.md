# Generation 2 — Cross-Capability Edge-Case Matrix

Status: ACTIVE
Phase: `RESEARCH_ADVERSARIAL_EDGE_CASE_SATURATION`

This matrix is an index over detailed per-capability registers. It does not assert `ConflictInstance`s or authorize remediation. Preserve `ConflictPattern != ConflictInstance`, `Signal != ConfirmedConflict`, qualified evidence/currentness, provider IDs as non-canonical, `Enterprise → Station → Role → Person`, AI/AGWS non-amplification and `UNKNOWN → reconcile-before-retry`.

## Mandatory cluster rotation — Full Pass 1

| # | Cluster | Full Pass 1 status | Detailed register | Material scenario range | Reusable conflict patterns linked |
| --- | --- | --- | --- | --- | --- |
| 1 | Process/Application × Workflow × Data/Schema | **CHALLENGED / MATERIAL / STREAK 0** | `PROCESS_APPLICATION_MODELING_EDGE_CASE_REGISTER.md` | `G2-XEDGE-PROCESS-WORKFLOW-DATA-001..004` | `STRUCTURAL-001`, `VERSION-001`, `SEMANTIC-001`, `AI-LOWCODE-001` |
| 2 | Workflow × Integration × Messaging × external mutation | **CHALLENGED / MATERIAL / STREAK 0** | `WORKFLOW_DURABLE_EXECUTION_EDGE_CASE_REGISTER.md` | `G2-XEDGE-WORKFLOW-INTEGRATION-MSG-001..004` | `TEMPORAL-001`, `PROVIDER-001`, `RECOVERY-001`, `AUTHORITY-001` |
| 3 | Identity × Authorization × Station × AGWS × AI | **CHALLENGED / MATERIAL / STREAK 0** | `ADAPTIVE_GOVERNED_WORK_SURFACES_EDGE_CASE_REGISTER.md` | `G2-XEDGE-IDENTITY-AUTH-STATION-AGWS-AI-001..003` | `AI-LOWCODE-001`, `AUTHORITY-001/002`, `CURRENTNESS-001` as applicable |
| 4 | Data/Schema × Privacy × Storage × Lifecycle | **CHALLENGED / MATERIAL / STREAK 0** | `DATA_SCHEMA_MIGRATIONS_EDGE_CASE_REGISTER.md` | `G2-XEDGE-DATA-PRIVACY-STORAGE-LIFECYCLE-001..004` | `DATA-001`, `POLICY-001`, `REPLICA-001`, `MIGRATION-001` |
| 5 | Build × Artifact/Release × Deployment × Runtime | **CHALLENGED / MATERIAL / STREAK 0** | `BUILD_DEPENDENCY_GRAPH_REPRODUCIBILITY_EDGE_CASE_REGISTER.md` | `G2-XEDGE-BUILD-RELEASE-DEPLOY-RUNTIME-001..004` | `BUILD-PROVENANCE-001`, `EFFECTIVE-IDENTITY-001`, `SUPPLY-CHAIN-001` |
| 6 | Provider/Binding × external realizations | **CHALLENGED / MATERIAL / STREAK 0** | `STORAGE_DOCUMENTS_MEDIA_EDGE_CASE_REGISTER.md` (Storage realization slice) | `G2-XEDGE-PROVIDER-STORAGE-001..004` | `PROVIDER-002`, `REPRESENTATION-001`, `SUPPORT-001` |
| 7 | Secrets/Config × Runtime × Provider substitution | **CHALLENGED / MATERIAL / STREAK 0** | `SECRETS_CONFIGURATION_ENVIRONMENT_PORTABILITY_EDGE_CASE_REGISTER.md` | `G2-XEDGE-SECRETS-RUNTIME-PROVIDER-001..004` | `CURRENTNESS-001`, `SECRET-BOUNDARY-001`, `AUTHORITY-002` |
| 8 | Mathematical Expressions × Workflow × Data × UI/Form × Commercial/FinOps | **NOT YET CHALLENGED IN FULL PASS 1** | — | — | — |
| 9 | Observability × Security/Recovery × runtime truth | **CHALLENGED / MATERIAL / STREAK 0** | `DEPLOYMENT_RUNTIME_AUTONOMOUS_OPERATION_EDGE_CASE_REGISTER.md` | `G2-XEDGE-OBS-SEC-RECOVERY-RUNTIME-001..004` | `HEALTH-QUALIFICATION-001`, `RECOVERY-CONTAINMENT-001`, `ACTUATION-CONVERGENCE-001` |
| 10 | Extension/Plugin × authority × provider trust × lifecycle | **CHALLENGED / MATERIAL / STREAK 0** | `EXTENSION_PLUGIN_MARKETPLACE_ARCHITECTURE_EDGE_CASE_REGISTER.md` | `G2-XEDGE-EXTENSION-AUTH-TRUST-LIFECYCLE-001..004` | `EXTENSION-IDENTITY-001`, `PERMISSION-COMPOSITION-001`, `EXTENSION-LIFECYCLE-001`, `TRUST-PROVENANCE-001` |
| 11 | Commercial Metering × Entitlements × Rating × Billing × Payment | **NOT YET CHALLENGED IN FULL PASS 1 — NEXT** | — | — | — |
| 12 | Enterprise Trust/PKI × Identity × Artifact/Release × provider substitution | **CHALLENGED / MATERIAL / STREAK 0** | `ARTIFACT_RELEASE_SBOM_PROVENANCE_EDGE_CASE_REGISTER.md` | `G2-XEDGE-TRUST-IDENTITY-ARTIFACT-PROVIDER-001..004` | `ATTESTATION-QUALIFICATION-001`, `TRUST-AUTHORITY-001`, `DISTRIBUTION-CONVERGENCE-001` |

## Material interaction summaries

### Cluster 1 — Process/Application × Workflow × Data/Schema
Long-running process/schema skew, partial migration populations, ambiguous data mutation retry and incompatible canonical postconditions show that local process/workflow/data validity cannot select canonical truth by execution order. Revision applicability and semantic ownership remain explicit.

### Cluster 2 — Workflow × Integration × Messaging × external mutation
Provider acknowledgement is not effective business state; idempotency scope/horizon may disagree across workflow/provider; compensation can race with delayed messages; provider substitution can leave residual messages/subscriptions authoritative. Ambiguous mutation remains `UNKNOWN` until reconciled.

### Cluster 3 — Identity × Authorization × Station × AGWS × AI
Cached surfaces and stale identity/Station state can retain obsolete authority; promotion/approval can race with scope changes; rendered guardrails do not prove authoritative enforcement when another invocation path exists. AI/AGWS cannot amplify inherited authority.

### Cluster 4 — Data/Schema × Privacy × Storage × Lifecycle
Erasure may conflict with retention/legal hold; canonical tombstones may diverge from residual copies; provider substitution may leave stale authoritative replicas; individually valid lifecycle policies can compose into impossible dispositions. Precedence requires owner/authority evidence rather than provider execution order.

### Cluster 5 — Build × Artifact/Release × Deployment × Runtime
Build, release, deployment and runtime-effective identities are distinct; retained artifacts may be rollback-ineligible; deployment success can hide residual runtime cohorts; nominal runner/provider compatibility can alter output semantics. Upstream success never proves downstream convergence.

### Cluster 6 — Provider/Binding × external realizations
A provider ACK can be weaker than the canonical qualification required; old provider cohorts can remain authoritative; nominal feature equivalence can mask semantic incompatibility; durable bytes can become effectively unreachable after credential/key path changes. Provider support is multidimensional evidence, not canonical identity.

### Cluster 7 — Secrets/Config × Runtime × Provider substitution
Source/provider rotation can be applied while consumer adoption stays partial; old credentials/config paths can survive cutover; disconnected runtime can exceed currentness horizons; provider-native secret/key/version identity must not become canonical binding identity.

### Cluster 8 — Mathematical Expressions × Workflow × Data × UI/Form × Commercial/FinOps
Pending Full Pass 1 challenge. The prior mathematical campaign is evidence input only; this cluster still requires adversarial recomposition and cannot inherit saturation from the math gate.

### Cluster 9 — Observability × Security/Recovery × runtime truth
`G2-XEDGE-OBS-SEC-RECOVERY-RUNTIME-001..004` establish that green health can conflict with stale security/recovery qualification, rollback/recovery success can coexist with residual incompatible cohorts, security containment can conflict with availability recovery, and individually authorized operational primitives can compose into unsafe AI/low-code authority. All remain research patterns/proof obligations, not remediation.

### Cluster 10 — Extension/Plugin × authority × provider trust × lifecycle
`G2-XEDGE-EXTENSION-AUTH-TRUST-LIFECYCLE-001..004` establish transitive dependency/publisher trust amplification, revocation/disablement with residual runtime authority, provider/marketplace substitution with semantic mismatch, and AI/low-code confused-deputy chains. `installed/trusted/signed != admitted != authorized != effective` remains the governing distinction.

### Cluster 11 — Commercial Metering × Entitlements × Rating × Billing × Payment
Pending Full Pass 1 challenge and current `next_action`. Preserve `entitlement != authorization` and `metering != rating != billing != payment`; material commercial effects require exact monetary/formula revision and provider-effect evidence.

### Cluster 12 — Enterprise Trust/PKI × Identity × Artifact/Release × provider substitution
`G2-XEDGE-TRUST-IDENTITY-ARTIFACT-PROVIDER-001..004` establish that authentic signer identity is not release authority, provider substitution can alter trust/distribution semantics, residual distribution paths can continue serving withdrawn releases, and AI/low-code can compose build/sign/promotion primitives into excessive supply-chain authority.

## Full Pass 1 campaign state

- mandatory clusters challenged: **10/12**;
- mandatory clusters not yet challenged: **8 and 11**;
- every challenged mandatory cluster currently has material findings and therefore no-material streak **0**;
- full passes completed: **0/8 minimum**;
- no cluster is saturated;
- `PLANNING_C_TARGET_ARCHITECTURE` remains blocked until adversarial research is `CLOSED / SATURATED / PASS`.

Detailed scenario fields, owners, evidence/currentness, blast radius, severity, false-positive risk, recovery/reconciliation and proof obligations remain authoritative in the linked per-capability registers and `EDGE_CASE_INDEX.md`.
