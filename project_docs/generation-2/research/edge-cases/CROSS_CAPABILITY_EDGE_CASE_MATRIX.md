# Generation 2 — Cross-Capability Edge-Case Matrix

Status: ACTIVE
Phase: `RESEARCH_ADVERSARIAL_EDGE_CASE_SATURATION`

This matrix indexes detailed per-capability registers. It does not assert `ConflictInstance`s or authorize remediation. Preserve `ConflictPattern != ConflictInstance`, `Signal != ConfirmedConflict`, qualified evidence/currentness, provider IDs as non-canonical, `Enterprise → Station → Role → Person`, AI/AGWS non-amplification and `UNKNOWN → reconcile-before-retry`.

## Mandatory cluster rotation — Full Pass 1

| # | Cluster | Full Pass 1 status | Detailed register | Material scenario range | Reusable conflict patterns linked |
| --- | --- | --- | --- | --- | --- |
| 1 | Process/Application × Workflow × Data/Schema | **CHALLENGED / MATERIAL / STREAK 0** | `PROCESS_APPLICATION_MODELING_EDGE_CASE_REGISTER.md` | `G2-XEDGE-PROCESS-WORKFLOW-DATA-001..004` | `STRUCTURAL-001`, `VERSION-001`, `SEMANTIC-001`, `AI-LOWCODE-001`, `PROJECTION-SEMANTICS-001` |
| 2 | Workflow × Integration × Messaging × external mutation | **CHALLENGED / MATERIAL / STREAK 0** | `WORKFLOW_DURABLE_EXECUTION_EDGE_CASE_REGISTER.md`, `INTEGRATION_AUTOMATION_EDGE_CASE_REGISTER.md` | `G2-XEDGE-WORKFLOW-INTEGRATION-MSG-001..004`; Integration local deepening | `TEMPORAL-001`, `PROVIDER-001`, `RECOVERY-001`, `AUTHORITY-001`, `INTEGRATION-IDENTITY-001`, `IDEMPOTENCY-QUALIFICATION-001`, `SUBSCRIPTION-COEXISTENCE-001`, `AUTOMATION-COMPOSITION-001` |
| 3 | Identity × Authorization × Station × AGWS × AI | **CHALLENGED / MATERIAL / STREAK 0** | `ADAPTIVE_GOVERNED_WORK_SURFACES_EDGE_CASE_REGISTER.md`, `INTEGRATION_AUTOMATION_EDGE_CASE_REGISTER.md` | `G2-XEDGE-IDENTITY-AUTH-STATION-AGWS-AI-001..003`; Integration authority deepening | `AI-LOWCODE-001`, `AUTHORITY-001/002`, `CURRENTNESS-001`, `PRESENTATION-AUTHORITY-001`, `AUTOMATION-COMPOSITION-001` |
| 4 | Data/Schema × Privacy × Storage × Lifecycle | **CHALLENGED / MATERIAL / STREAK 0** | `DATA_SCHEMA_MIGRATIONS_EDGE_CASE_REGISTER.md` | `G2-XEDGE-DATA-PRIVACY-STORAGE-LIFECYCLE-001..004` | `DATA-001`, `POLICY-001`, `REPLICA-001`, `MIGRATION-001` |
| 5 | Build × Artifact/Release × Deployment × Runtime | **CHALLENGED / MATERIAL / STREAK 0** | `BUILD_DEPENDENCY_GRAPH_REPRODUCIBILITY_EDGE_CASE_REGISTER.md` | `G2-XEDGE-BUILD-RELEASE-DEPLOY-RUNTIME-001..004` | `BUILD-PROVENANCE-001`, `EFFECTIVE-IDENTITY-001`, `SUPPLY-CHAIN-001` |
| 6 | Provider/Binding × external realizations | **CHALLENGED / MATERIAL / STREAK 0** | `STORAGE_DOCUMENTS_MEDIA_EDGE_CASE_REGISTER.md`, `INTEGRATION_AUTOMATION_EDGE_CASE_REGISTER.md` | `G2-XEDGE-PROVIDER-STORAGE-001..004`; Integration local deepening | `PROVIDER-002`, `REPRESENTATION-001`, `SUPPORT-001`, `IDEMPOTENCY-QUALIFICATION-001`, `SUBSCRIPTION-COEXISTENCE-001` |
| 7 | Secrets/Config × Runtime × Provider substitution | **CHALLENGED / MATERIAL / STREAK 0** | `SECRETS_CONFIGURATION_ENVIRONMENT_PORTABILITY_EDGE_CASE_REGISTER.md` | `G2-XEDGE-SECRETS-RUNTIME-PROVIDER-001..004` | `CURRENTNESS-001`, `SECRET-BOUNDARY-001`, `AUTHORITY-002` |
| 8 | Mathematical Expressions × Workflow × Data × UI/Form × Commercial/FinOps | **CHALLENGED / MATERIAL / STREAK 0** | `TECHNOLOGY_ECONOMIC_GOVERNANCE_FINOPS_EDGE_CASE_REGISTER.md` | `G2-XEDGE-MATH-FINOPS-001..005` | `ECONOMIC-EVIDENCE-001`, `ALLOCATION-CONSERVATION-001`, `ECONOMIC-REVISION-001`, `OBJECTIVE-GOVERNANCE-001`, `COMMERCIAL-REVISION-001`, `LOWCODE-MATERIALIZATION-001` |
| 9 | Observability × Security/Recovery × runtime truth | **CHALLENGED / MATERIAL / STREAK 0** | `DEPLOYMENT_RUNTIME_AUTONOMOUS_OPERATION_EDGE_CASE_REGISTER.md` | `G2-XEDGE-OBS-SEC-RECOVERY-RUNTIME-001..004` | `HEALTH-QUALIFICATION-001`, `RECOVERY-CONTAINMENT-001`, `ACTUATION-CONVERGENCE-001` |
| 10 | Extension/Plugin × authority × provider trust × lifecycle | **CHALLENGED / MATERIAL / STREAK 0** | `EXTENSION_PLUGIN_MARKETPLACE_ARCHITECTURE_EDGE_CASE_REGISTER.md` | `G2-XEDGE-EXTENSION-AUTH-TRUST-LIFECYCLE-001..004` | `EXTENSION-IDENTITY-001`, `PERMISSION-COMPOSITION-001`, `EXTENSION-LIFECYCLE-001`, `TRUST-PROVENANCE-001` |
| 11 | Commercial Metering × Entitlements × Rating × Billing × Payment | **CHALLENGED / MATERIAL / STREAK 0** | `COMMERCIAL_METERING_ENTITLEMENTS_RATING_BILLING_PAYMENT_EDGE_CASE_REGISTER.md` | `G2-XEDGE-COMMERCIAL-001..005` | `COMMERCIAL-PIPELINE-001`, `COMMERCIAL-REVISION-001`, `COMMERCIAL-COHORT-001`, `COMMERCIAL-AUTHORITY-001` |
| 12 | Enterprise Trust/PKI × Identity × Artifact/Release × provider substitution | **CHALLENGED / MATERIAL / STREAK 0** | `ARTIFACT_RELEASE_SBOM_PROVENANCE_EDGE_CASE_REGISTER.md` | `G2-XEDGE-TRUST-IDENTITY-ARTIFACT-PROVIDER-001..004` | `ATTESTATION-QUALIFICATION-001`, `TRUST-AUTHORITY-001`, `DISTRIBUTION-CONVERGENCE-001` |

## Material interaction summaries

1. **Process × Workflow × Data:** long-running revision skew, partial migrations, ambiguous mutation retries and competing canonical postconditions require explicit applicability and semantic ownership. UI adds stale projection/base revisions that can be locally valid while incompatible with current owner postconditions.
2. **Workflow × Integration × Messaging:** provider ACK is not business-effective state; idempotency scope may disagree; compensation can race delayed effects; residual subscriptions/messages survive substitution. Integration deepening adds explicit delivery-vs-effect identity, bounded idempotency horizons, stale trigger admission, residual callback/job cohorts and automation-recursion hazards.
3. **Identity × Authorization × Station × AGWS × AI:** stale scope can preserve obsolete authority; rendered guardrails are not authoritative enforcement; AI/AGWS cannot amplify authority. Integration adds callback authenticity and provider credential capability as non-authoritative evidence that still requires current canonical authority.
4. **Data × Privacy × Storage × Lifecycle:** erasure/retention, tombstone/replica and lifecycle-policy conflicts require owner/authority evidence rather than execution order.
5. **Build × Release × Deployment × Runtime:** adjacent lifecycle identities remain distinct; success upstream does not prove downstream convergence or rollback eligibility.
6. **Provider/Binding × external realization:** ACK/support labels are weaker than canonical qualification; residual cohorts and identity leakage remain explicit. Integration adds provider-specific idempotency scope/horizon and subscription/job/callback drainage as qualified support dimensions.
7. **Secrets/Config × Runtime × Provider:** source rotation can be current while consumer-effective state remains stale; old credentials/config paths can survive cutover.
8. **Math × Workflow × Data × UI/Form × Commercial/FinOps:** a DerivedValue cannot silently become StoredFact; producing FormulaRevision and historical snapshot must remain distinguishable from live recomputation; internal technology cost remains distinct from customer-commercial charge truth.
9. **Observability × Security/Recovery × runtime truth:** green health does not prove security/recovery qualification or business convergence; recovery can conflict with containment.
10. **Extension × authority × trust × lifecycle:** transitive trust/permissions, residual runtime authority and marketplace substitution can exceed local validity.
11. **Commercial Metering × Entitlements × Rating × Billing × Payment:** late usage corrections can conflict with settled invoices; effective-date/revision vectors can disagree; provider cutover can leave pending commercial cohorts authoritative; provider ACK is scoped evidence rather than settlement/customer-commercial convergence; entitlement remains distinct from authorization.
12. **Enterprise Trust/PKI × Identity × Artifact/Release × provider:** authentic signer identity is not release authority; substitution and residual distribution paths can alter effective trust/distribution semantics.

## Reusable local composition patterns linked into existing clusters

No 13th mandatory cluster is added. UCA, UI and Integration visits produced reusable cross-owner patterns for later revisits:

| Conflict pattern | Cross-capability activation | Detection route | Status |
| --- | --- | --- | --- |
| `G2-CONFLICT-PATTERN-QUALIFIED-CLAIM-001` | valid claims have incompatible scope/profile/revision/currentness after composition | qualification intersection + applicability/currentness comparison | MATERIAL / reuse |
| `G2-CONFLICT-PATTERN-REVISION-VECTOR-001` | exposed versions appear compatible while hidden material revisions diverge | material dependency closure + compatibility matrix | MATERIAL / reuse |
| `G2-CONFLICT-PATTERN-CONVERGENCE-SEMANTICS-001` | owners bind generic success to different lineage stages | typed stage compatibility + reconciliation evidence | MATERIAL / reuse |
| `G2-CONFLICT-PATTERN-UCA-OWNERSHIP-001` | common abstraction chooses semantic truth/precedence/authority across owners | semantic-owner/provenance check | MATERIAL / reuse |
| `G2-CONFLICT-PATTERN-PROJECTION-SEMANTICS-001` | producing UI projection and current semantic owner are individually valid but imply incompatible mutation | material revision-vector compatibility + pre-execution requalification | MATERIAL / reuse |
| `G2-CONFLICT-PATTERN-PRESENTATION-AUTHORITY-001` | rendered state and current authoritative policy/AGWS decision disagree | actuation-time authority re-evaluation | MATERIAL / reuse |
| `G2-CONFLICT-PATTERN-HUMAN-INSTRUCTION-001` | individually valid active instructions prescribe incompatible actions/order | applicability/context/owner comparison + operator conflict signal | MATERIAL / reuse |
| `G2-CONFLICT-PATTERN-LOWCODE-MATERIALIZATION-001` | safe primitives compose into new canonical fact/process/policy meaning or wider authority | composition authority + semantic-owner/materialization qualification | MATERIAL / reuse |
| `G2-CONFLICT-PATTERN-INTEGRATION-IDENTITY-001` | transport/provider identity is treated as canonical semantic-effect identity | identity-subject + dedup scope/horizon comparison | MATERIAL / reuse |
| `G2-CONFLICT-PATTERN-IDEMPOTENCY-QUALIFICATION-001` | provider-scoped idempotency is assumed to imply semantic retry safety | provider/binding/operation/subject/parameter/revision/horizon qualification | MATERIAL / reuse |
| `G2-CONFLICT-PATTERN-SUBSCRIPTION-COEXISTENCE-001` | canonical disable/cutover coexists with old callbacks/jobs/retries still able to act | residual-cohort inventory + current binding/subscription comparison | MATERIAL / reuse |
| `G2-CONFLICT-PATTERN-AUTOMATION-COMPOSITION-001` | safe local triggers/actions compose into recursion, fan-out or authority-amplifying chain | graph boundedness + authority intersection + runtime loop/quota signals | MATERIAL / reuse |

These patterns are catalogue/detection candidates only; no concrete conflict or remediation is asserted.

## Full Pass 1 campaign state

- mandatory clusters challenged: **12/12**;
- every challenged mandatory cluster has material findings and no-material streak **0**;
- canonical capabilities challenged locally: **15/28**;
- latest Integration findings: **7 edge scenarios + 4 conflict patterns; local streak 0**;
- full passes completed: **0/8 minimum**;
- no capability or cluster is saturated;
- subsequent work continues local capability rotation; materially motivated deep dives may be added but are not quota substitutes;
- `PLANNING_C_TARGET_ARCHITECTURE` remains blocked until adversarial research is `CLOSED / SATURATED / PASS`.

Detailed scenario fields, owners, evidence/currentness, blast radius, severity, false-positive risk, recovery/reconciliation and proof obligations remain authoritative in linked registers and `EDGE_CASE_INDEX.md`.