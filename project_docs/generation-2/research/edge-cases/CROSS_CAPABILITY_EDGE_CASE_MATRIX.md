# Generation 2 — Cross-Capability Edge-Case Matrix

Status: ACTIVE
Phase: `RESEARCH_ADVERSARIAL_EDGE_CASE_SATURATION`

This matrix indexes detailed per-capability registers. It does not assert `ConflictInstance`s or authorize remediation. Preserve `ConflictPattern != ConflictInstance`, `Signal != ConfirmedConflict`, qualified evidence/currentness, provider IDs as non-canonical, `Enterprise → Station → Role → Person`, AI/AGWS non-amplification and `UNKNOWN → reconcile-before-retry`.

## Mandatory cluster rotation — Full Pass 1

| # | Cluster | Full Pass 1 status | Detailed register | Material scenario range | Reusable conflict patterns linked |
| --- | --- | --- | --- | --- | --- |
| 1 | Process/Application × Workflow × Data/Schema | **CHALLENGED / MATERIAL / STREAK 0** | `PROCESS_APPLICATION_MODELING_EDGE_CASE_REGISTER.md` | `G2-XEDGE-PROCESS-WORKFLOW-DATA-001..004` | `STRUCTURAL-001`, `VERSION-001`, `SEMANTIC-001`, `AI-LOWCODE-001` |
| 2 | Workflow × Integration × Messaging × external mutation | **CHALLENGED / MATERIAL / STREAK 0** | `WORKFLOW_DURABLE_EXECUTION_EDGE_CASE_REGISTER.md` | `G2-XEDGE-WORKFLOW-INTEGRATION-MSG-001..004` | `TEMPORAL-001`, `PROVIDER-001`, `RECOVERY-001`, `AUTHORITY-001` |
| 3 | Identity × Authorization × Station × AGWS × AI | **CHALLENGED / MATERIAL / STREAK 0** | `ADAPTIVE_GOVERNED_WORK_SURFACES_EDGE_CASE_REGISTER.md` | `G2-XEDGE-IDENTITY-AUTH-STATION-AGWS-AI-001..003` | `AI-LOWCODE-001`, `AUTHORITY-001/002`, `CURRENTNESS-001` as applicable |
| 4 | Data/Schema × Privacy × Storage × Lifecycle | **CHALLENGED / MATERIAL / STREAK 0** | `DATA_SCHEMA_MIGRATIONS_EDGE_CASE_REGISTER.md` | `G2-XEDGE-DATA-PRIVACY-STORAGE-LIFECYCLE-001..004` | `DATA-001`, `POLICY-001`, `REPLICA-001`, `MIGRATION-001` |
| 5 | Build × Artifact/Release × Deployment × Runtime | **CHALLENGED / MATERIAL / STREAK 0** | `BUILD_DEPENDENCY_GRAPH_REPRODUCIBILITY_EDGE_CASE_REGISTER.md` | `G2-XEDGE-BUILD-RELEASE-DEPLOY-RUNTIME-001..004` | `BUILD-PROVENANCE-001`, `EFFECTIVE-IDENTITY-001`, `SUPPLY-CHAIN-001` |
| 6 | Provider/Binding × external realizations | **CHALLENGED / MATERIAL / STREAK 0** | `STORAGE_DOCUMENTS_MEDIA_EDGE_CASE_REGISTER.md` | `G2-XEDGE-PROVIDER-STORAGE-001..004` | `PROVIDER-002`, `REPRESENTATION-001`, `SUPPORT-001` |
| 7 | Secrets/Config × Runtime × Provider substitution | **CHALLENGED / MATERIAL / STREAK 0** | `SECRETS_CONFIGURATION_ENVIRONMENT_PORTABILITY_EDGE_CASE_REGISTER.md` | `G2-XEDGE-SECRETS-RUNTIME-PROVIDER-001..004` | `CURRENTNESS-001`, `SECRET-BOUNDARY-001`, `AUTHORITY-002` |
| 8 | Mathematical Expressions × Workflow × Data × UI/Form × Commercial/FinOps | **CHALLENGED / MATERIAL / STREAK 0** | `TECHNOLOGY_ECONOMIC_GOVERNANCE_FINOPS_EDGE_CASE_REGISTER.md` | `G2-XEDGE-MATH-FINOPS-001..005` | `ECONOMIC-EVIDENCE-001`, `ALLOCATION-CONSERVATION-001`, `ECONOMIC-REVISION-001`, `OBJECTIVE-GOVERNANCE-001`, plus prior `COMMERCIAL-REVISION-001` where applicable |
| 9 | Observability × Security/Recovery × runtime truth | **CHALLENGED / MATERIAL / STREAK 0** | `DEPLOYMENT_RUNTIME_AUTONOMOUS_OPERATION_EDGE_CASE_REGISTER.md` | `G2-XEDGE-OBS-SEC-RECOVERY-RUNTIME-001..004` | `HEALTH-QUALIFICATION-001`, `RECOVERY-CONTAINMENT-001`, `ACTUATION-CONVERGENCE-001` |
| 10 | Extension/Plugin × authority × provider trust × lifecycle | **CHALLENGED / MATERIAL / STREAK 0** | `EXTENSION_PLUGIN_MARKETPLACE_ARCHITECTURE_EDGE_CASE_REGISTER.md` | `G2-XEDGE-EXTENSION-AUTH-TRUST-LIFECYCLE-001..004` | `EXTENSION-IDENTITY-001`, `PERMISSION-COMPOSITION-001`, `EXTENSION-LIFECYCLE-001`, `TRUST-PROVENANCE-001` |
| 11 | Commercial Metering × Entitlements × Rating × Billing × Payment | **CHALLENGED / MATERIAL / STREAK 0** | `COMMERCIAL_METERING_ENTITLEMENTS_RATING_BILLING_PAYMENT_EDGE_CASE_REGISTER.md` | `G2-XEDGE-COMMERCIAL-001..005` | `COMMERCIAL-PIPELINE-001`, `COMMERCIAL-REVISION-001`, `COMMERCIAL-COHORT-001`, `COMMERCIAL-AUTHORITY-001` |
| 12 | Enterprise Trust/PKI × Identity × Artifact/Release × provider substitution | **CHALLENGED / MATERIAL / STREAK 0** | `ARTIFACT_RELEASE_SBOM_PROVENANCE_EDGE_CASE_REGISTER.md` | `G2-XEDGE-TRUST-IDENTITY-ARTIFACT-PROVIDER-001..004` | `ATTESTATION-QUALIFICATION-001`, `TRUST-AUTHORITY-001`, `DISTRIBUTION-CONVERGENCE-001` |

## Material interaction summaries

1. **Process × Workflow × Data:** long-running revision skew, partial migrations, ambiguous mutation retries and competing canonical postconditions require explicit applicability and semantic ownership.
2. **Workflow × Integration × Messaging:** provider ACK is not business-effective state; idempotency scope may disagree; compensation can race delayed effects; residual subscriptions/messages survive substitution.
3. **Identity × Authorization × Station × AGWS × AI:** stale scope can preserve obsolete authority; rendered guardrails are not authoritative enforcement; AI/AGWS cannot amplify authority.
4. **Data × Privacy × Storage × Lifecycle:** erasure/retention, tombstone/replica and lifecycle-policy conflicts require owner/authority evidence rather than execution order.
5. **Build × Release × Deployment × Runtime:** adjacent lifecycle identities remain distinct; success upstream does not prove downstream convergence or rollback eligibility.
6. **Provider/Binding × external realization:** ACK/support labels are weaker than canonical qualification; residual cohorts and identity leakage remain explicit.
7. **Secrets/Config × Runtime × Provider:** source rotation can be current while consumer-effective state remains stale; old credentials/config paths can survive cutover.
8. **Math × Workflow × Data × UI/Form × Commercial/FinOps:** a DerivedValue cannot silently become StoredFact; producing FormulaRevision and historical snapshot must remain distinguishable from live recomputation; internal technology cost remains distinct from customer-commercial charge truth; cross-owner formula/allocation cycles and objective conflicts require explicit detection/owner routing rather than arbitrary evaluation order or cheapest-wins optimization.
9. **Observability × Security/Recovery × runtime truth:** green health does not prove security/recovery qualification or business convergence; recovery can conflict with containment.
10. **Extension × authority × trust × lifecycle:** transitive trust/permissions, residual runtime authority and marketplace substitution can exceed local validity.
11. **Commercial Metering × Entitlements × Rating × Billing × Payment:** late usage corrections can conflict with settled invoices; effective-date/revision vectors can disagree; provider cutover can leave pending commercial cohorts authoritative; provider ACK is scoped evidence rather than settlement/customer-commercial convergence; entitlement remains distinct from authorization.
12. **Enterprise Trust/PKI × Identity × Artifact/Release × provider:** authentic signer identity is not release authority; substitution and residual distribution paths can alter effective trust/distribution semantics.

## UCA reusable composition patterns — Full Pass 1 local deep dive

Register: `UNIVERSAL_CAPABILITY_ARCHITECTURE_EDGE_CASE_REGISTER.md`

No 13th mandatory cluster was added. The UCA visit instead produced reusable cross-owner patterns that must be linked into later cluster revisits whenever their activation conditions appear:

| Conflict pattern | Cross-capability activation | Detection route | Status |
| --- | --- | --- | --- |
| `G2-CONFLICT-PATTERN-QUALIFIED-CLAIM-001` | two owners emit individually valid claims whose scope/profile/revision/currentness are incompatible after composition | qualification-intersection + applicability/currentness comparison | MATERIAL / reuse on revisits |
| `G2-CONFLICT-PATTERN-REVISION-VECTOR-001` | exposed versions appear compatible while hidden material owner revisions diverge | material revision dependency closure + compatibility matrix | MATERIAL / reuse on revisits |
| `G2-CONFLICT-PATTERN-CONVERGENCE-SEMANTICS-001` | owners bind generic “success” to different attempted/accepted/applied/converged/validated stages | typed lineage-stage compatibility + effect reconciliation evidence | MATERIAL / reuse on revisits |
| `G2-CONFLICT-PATTERN-UCA-OWNERSHIP-001` | universal/common abstraction chooses semantic truth, precedence, score or authority across owners | architecture decision provenance + explicit semantic-owner check | MATERIAL / reuse on revisits |

These patterns are research catalogue entries only. They do not assert a concrete conflict or authorize remediation.

## Full Pass 1 campaign state

- mandatory clusters challenged: **12/12**;
- every challenged mandatory cluster currently has material findings and therefore no-material streak **0**;
- canonical capabilities challenged locally: **13/28**;
- UCA local findings: **7 edge scenarios + 4 conflict patterns; local streak 0**;
- full passes completed: **0/8 minimum**;
- no capability or cluster is saturated;
- subsequent Full Pass 1 work continues local capability rotation and may add materially motivated deep-dive clusters without using them as quota substitutes;
- `PLANNING_C_TARGET_ARCHITECTURE` remains blocked until adversarial research is `CLOSED / SATURATED / PASS`.

Detailed scenario fields, owners, evidence/currentness, blast radius, severity, false-positive risk, recovery/reconciliation and proof obligations remain authoritative in linked registers and `EDGE_CASE_INDEX.md`.