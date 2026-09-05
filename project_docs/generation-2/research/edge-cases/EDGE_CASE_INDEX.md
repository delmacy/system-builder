# Generation 2 — Edge-Case Index

Status: ACTIVE
Phase: `RESEARCH_ADVERSARIAL_EDGE_CASE_SATURATION`

Stable IDs use `G2-EDGE-<CAPABILITY>-NNN`, cross-capability IDs use `G2-XEDGE-<CLUSTER>-NNN`, and reusable processual/semantic conflict patterns use `G2-CONFLICT-PATTERN-<FAMILY>-NNN`.

Canonical distinctions: `ConflictPattern != ConflictInstance`; `Signal != ConfirmedConflict`; provider IDs are non-canonical; `Enterprise → Station → Role → Person`; AI/AGWS cannot amplify authority; `UNKNOWN → reconcile-before-retry`; `StoredFact != DerivedValue`; `FormulaRevision != CalculationResult`. Detailed scenario and ConflictPattern fields remain authoritative in the originating registers and revisit dossiers.

## Full Pass 1 historical index

Full Pass 1 completed **28/28 capabilities** and **12/12 mandatory clusters**. The 28 `*_EDGE_CASE_REGISTER.md` artifacts and prior Git history remain the detailed Full-Pass-1 authority.

## Full Pass 2 — completed revisit index

Full Pass 2 completed **28/28 capabilities** and **12/12 mandatory clusters**. Its duplicate screening increased the reusable ConflictPattern inventory from 103 to **115** and the campaign inventory to **278 material edge scenarios + 115 reusable ConflictPatterns = 393 material findings**. The authoritative Pass-2 per-capability revisit dossiers remain in this directory and preserve detailed activation, detection, owner, severity, currentness, false-positive and future-remediation fields.

## Reusable ConflictPattern inventory

The reusable catalogue is now **119 `G2-CONFLICT-PATTERN-*` families**.

- Full Pass 3 UCA added `G2-CONFLICT-PATTERN-PRESENCE-SEMANTICS-001`, covering incompatible `ABSENT/UNSET/UNKNOWN/NOT_APPLICABLE/REDACTED/null/default/delete` interpretations across otherwise valid representation/profile boundaries.
- Full Pass 3 Enterprise Trust / PKI added `G2-CONFLICT-PATTERN-TRUST-NAMESPACE-COLLAPSE-001`, covering composition where individually valid trust partitions become jointly unsafe because a union/import/provider/federation layer loses the domain→bundle/anchor-set ownership boundary and thereby widens the namespace accepted by a validator.
- Full Pass 3 Privacy / Data Governance added `G2-CONFLICT-PATTERN-CUMULATIVE-PRIVACY-001`, covering N-wise/history-dependent composition where individually permissible releases, analyses, views or inferences jointly create material re-identification, sensitive inference or excessive explicitly governed cumulative privacy loss that no component-local qualification established.
- Full Pass 3 Lifecycle / Versioning / Evolution / Migration added `G2-CONFLICT-PATTERN-COMPATIBILITY-DIRECTION-001`, covering a qualified one-way or operation-specific compatibility relation that becomes unsafe when composition promotes it to undirected/global compatibility for a reversed role, alternate operation, rolling topology, replay or rollback.

A researched pattern is not a concrete defect and does not authorize implementation. Default disposition remains `CATALOGUE + CLASSIFY + DETECTION_CANDIDATE + FUTURE_REMEDIATION_ROUTE`.

## Full Pass 3 — completed revisit index

| Capability | Revisit artifact | Pass-3 material result | Local streak after revisit | Cluster disposition |
| --- | --- | --- | ---: | --- |
| Adaptive Governed Work Surfaces | `ADAPTIVE_GOVERNED_WORK_SURFACES_FULL_PASS_3_REVISIT.md` | eligible no-new-material | 1 | Identity × Authorization × Station × AGWS × AI: streak **2** |
| Process & Application Modeling | `PROCESS_APPLICATION_MODELING_FULL_PASS_3_REVISIT.md` | eligible no-new-material | 1 | Process/Application × Workflow × Data/Schema: streak **1** |
| Workflow & Durable Execution | `WORKFLOW_DURABLE_EXECUTION_FULL_PASS_3_REVISIT.md` | eligible no-new-material | 1 | Workflow × Integration × Messaging × external mutation: streak **1** |
| Data / Schema / Migrations | `DATA_SCHEMA_MIGRATIONS_FULL_PASS_3_REVISIT.md` | eligible no-new-material | 1 | Data/Schema × Privacy × Storage × Lifecycle: streak **1** |
| Storage / Documents / Media | `STORAGE_DOCUMENTS_MEDIA_FULL_PASS_3_REVISIT.md` | eligible no-new-material | 1 | Provider/Binding × external realizations: streak **2** |
| Secrets / Configuration / Environment Portability | `SECRETS_CONFIGURATION_ENVIRONMENT_PORTABILITY_FULL_PASS_3_REVISIT.md` | eligible no-new-material | 1 | Secrets/Config × Runtime × Provider substitution: streak **1** |
| Build / Dependency Graph / Reproducibility | `BUILD_DEPENDENCY_GRAPH_REPRODUCIBILITY_FULL_PASS_3_REVISIT.md` | eligible no-new-material | 1 | Build × Artifact/Release × Deployment × Runtime: streak **1** |
| Artifact / Release / SBOM / Provenance | `ARTIFACT_RELEASE_SBOM_PROVENANCE_FULL_PASS_3_REVISIT.md` | eligible no-new-material | 1 | trust/artifact cluster later reset by Trust finding |
| Deployment / Runtime / Autonomous Operation | `DEPLOYMENT_RUNTIME_AUTONOMOUS_OPERATION_FULL_PASS_3_REVISIT.md` | eligible no-new-material | 1 | Observability × Security/Recovery × runtime truth: streak **1** |
| Extension / Plugin / Marketplace Architecture | `EXTENSION_PLUGIN_MARKETPLACE_ARCHITECTURE_FULL_PASS_3_REVISIT.md` | eligible no-new-material | 1 | Extension/Plugin × authority × provider trust × lifecycle: streak **1** |
| Commercial Metering / Entitlements / Rating / Billing / Payment | `COMMERCIAL_METERING_ENTITLEMENTS_RATING_BILLING_PAYMENT_FULL_PASS_3_REVISIT.md` | eligible no-new-material | 1 | Commercial cluster: **1** |
| Technology Economic Governance / FinOps | `TECHNOLOGY_ECONOMIC_GOVERNANCE_FINOPS_FULL_PASS_3_REVISIT.md` | eligible no-new-material | 1 | Math × Workflow × Data × UI/Form × FinOps: **1** |
| Universal Capability Architecture | `UNIVERSAL_CAPABILITY_ARCHITECTURE_FULL_PASS_3_REVISIT.md` | **MATERIAL**: `G2-EDGE-UCA-011` + presence pattern | **0** | no mandatory cluster advanced |
| UI / Generated Experience / Low-code Builder | `UI_GENERATED_EXPERIENCE_LOW_CODE_BUILDER_FULL_PASS_3_REVISIT.md` | **MATERIAL**: `G2-EDGE-UI-011` | **0** | presence-semantics deepening only |
| Integration & Automation | `INTEGRATION_AUTOMATION_FULL_PASS_3_REVISIT.md` | **MATERIAL**: `G2-EDGE-INTEGRATION-008` | **0** | presence/operator linkage only |
| Identity / Authentication / Federation | `IDENTITY_AUTHENTICATION_FEDERATION_FULL_PASS_3_REVISIT.md` | eligible no-new-material | **2** | mandatory cluster unchanged |
| Authorization / Policy / Organization / Multitenancy | `AUTHORIZATION_POLICY_ORGANIZATION_MULTITENANCY_FULL_PASS_3_REVISIT.md` | eligible no-new-material | **2** | mandatory cluster unchanged |
| Governance / Compliance / Audit | `GOVERNANCE_COMPLIANCE_AUDIT_FULL_PASS_3_REVISIT.md` | eligible no-new-material | **2** | mandatory cluster unchanged |
| Security / Resilience / Failure Recovery | `SECURITY_RESILIENCE_FAILURE_RECOVERY_FULL_PASS_3_REVISIT.md` | eligible no-new-material | **2** | mandatory cluster unchanged |
| Enterprise Trust / PKI / Certificate Lifecycle | `ENTERPRISE_TRUST_PKI_CERTIFICATE_LIFECYCLE_FULL_PASS_3_REVISIT.md` | **MATERIAL**: `G2-EDGE-TRUST-008` + trust-namespace pattern | **0** | Trust × Identity × Artifact × provider cluster reset **1→0** |
| Privacy / Data Governance / Retention / Legal Hold / Residency | `PRIVACY_DATA_GOVERNANCE_RETENTION_LEGAL_HOLD_RESIDENCY_FULL_PASS_3_REVISIT.md` | **MATERIAL**: `G2-EDGE-PRIVACY-008` + cumulative-privacy pattern | **0** | mandatory clusters unchanged |
| Notifications / Events / Messaging | `NOTIFICATIONS_EVENTS_MESSAGING_FULL_PASS_3_REVISIT.md` | eligible no-new-material | **2** | mandatory clusters unchanged |
| Observability / Operations / Incident | `OBSERVABILITY_OPERATIONS_INCIDENT_FULL_PASS_3_REVISIT.md` | eligible no-new-material | **2** | mandatory cluster unchanged |
| Developer / Operator Experience / Self-hosting | `DEVELOPER_OPERATOR_EXPERIENCE_SELF_HOSTING_FULL_PASS_3_REVISIT.md` | eligible no-new-material | **2** | mandatory clusters unchanged |
| Provider / Binding / Capability Negotiation | `PROVIDER_BINDING_CAPABILITY_NEGOTIATION_FULL_PASS_3_REVISIT.md` | eligible no-new-material | **2** | Provider/Binding × external realizations remains **2** |
| Standards / Interoperability / API Contracts | `STANDARDS_INTEROPERABILITY_API_CONTRACTS_FULL_PASS_3_REVISIT.md` | eligible no-new-material | **2** | mandatory clusters unchanged |
| Lifecycle / Versioning / Evolution / Migration | `LIFECYCLE_VERSIONING_EVOLUTION_MIGRATION_FULL_PASS_3_REVISIT.md` | **MATERIAL**: `G2-EDGE-LIFECYCLE-008` + `G2-CONFLICT-PATTERN-COMPATIBILITY-DIRECTION-001` | **0** | local finding; no mandatory-cluster streak fabricated/reset |
| Architecture Reconciliation as a Capability | `ARCHITECTURE_RECONCILIATION_FULL_PASS_3_REVISIT.md` | eligible no-new-material | **2** | no mandatory cluster changed; Full Pass 3 completed |

## Full-Pass-3 material chains

### Presence semantics

`G2-CONFLICT-PATTERN-PRESENCE-SEMANTICS-001` originated in UCA; `G2-EDGE-UI-011` and `G2-EDGE-INTEGRATION-008` are capability-specific manifestations where omission/null/default/delete translation changes canonical intent/effect.

### Trust namespace

`G2-EDGE-TRUST-008` / `G2-CONFLICT-PATTERN-TRUST-NAMESPACE-COLLAPSE-001` capture individually valid trust partitions becoming jointly unsafe when composition loses the trust-domain ownership boundary. Research-only preventive candidate: trust-material composition must not widen namespace/authority merely through union/import/co-location without explicit owner qualification.

### Cumulative privacy

`G2-EDGE-PRIVACY-008` / `G2-CONFLICT-PATTERN-CUMULATIVE-PRIVACY-001` capture individually permissible releases/analyses becoming jointly identifying, inferential or incompatible with an explicitly governed cumulative privacy-loss bound. Detection remains history/recipient/context-aware and signal != confirmed conflict.

### Compatibility direction

`G2-EDGE-LIFECYCLE-008` / `G2-CONFLICT-PATTERN-COMPATIBILITY-DIRECTION-001` capture a supported relation such as A→B/read/forward being promoted to a scalar pairwise compatibility claim and reused for B→A/write/rollback or another reachable cohort. The authoritative Lifecycle dossier records activation conditions, incompatible claims/actions/states, detection stages, owners, severity, confidence, detectability, blast radius, reversibility, time-to-harm, misuse likelihood, evidence currentness, false-positive controls, proof candidate and future remediation disposition.

Research-only preventive invariant candidate: compatibility used for lifecycle decisions must not be widened from a qualified directed/operation-specific relation into an undirected/global claim without semantic-owner evidence. Legitimate asymmetric compatibility remains allowed.

No `ConflictInstance` is asserted and no remediation is authorized.

## Full Pass 4 — active revisit index

| Capability | Revisit artifact | Pass-4 material result | Local streak after revisit | Cluster disposition |
| --- | --- | --- | ---: | --- |
| Adaptive Governed Work Surfaces | `ADAPTIVE_GOVERNED_WORK_SURFACES_FULL_PASS_4_REVISIT.md` | eligible no-new-material | **2** | no mandatory cluster counted; Identity × Authorization × Station × AGWS × AI remains **2** |
| Process & Application Modeling | `PROCESS_APPLICATION_MODELING_FULL_PASS_4_REVISIT.md` | eligible no-new-material | **2** | Process/Application × Workflow × Data/Schema **1→2** |
| Workflow & Durable Execution | `WORKFLOW_DURABLE_EXECUTION_FULL_PASS_4_REVISIT.md` | eligible no-new-material | **2** | Workflow × Integration × Messaging × external mutation **1→2** |

The three completed Pass-4 revisits duplicate-screened all **119** reusable ConflictPatterns, explicitly including presence semantics, trust-namespace collapse, cumulative privacy and compatibility direction. No material ID was added in Full Pass 4 so far.

Workflow Pass 4 additionally exercised durable-history/current-eligibility splice, acknowledgement/effect/correlation braid, cancellation-retry-compensation reorderings, residual provider cohorts, directed compatibility inversion, command/event presence mutations, cross-process adoption before compensation, resource/backlog stress and AI/low-code aggregate composition. Every candidate reduced to an existing material family with an owner and detection/future-remediation route.

## Campaign state

- completed full passes: **3/8 minimum**; target reference **12**, no maximum;
- active full pass: **4**;
- Full Pass 3: **28/28 capabilities + 12/12 mandatory clusters — complete**;
- Full Pass 4: **3/28 capabilities + 2/12 mandatory clusters**;
- material edge scenarios: **284**;
- reusable ConflictPatterns: **119**;
- combined material findings: **403**;
- HIGH/CRITICAL without semantic owner/proof obligation/detection route: **0**;
- local streaks now at **2** for AGWS, Process and Workflow plus the previously saturated local capabilities recorded in `ADVERSARIAL_SATURATION_STATE.json`;
- local streaks at 0 after material findings: UCA, UI, Integration, Enterprise Trust/PKI, Privacy and Lifecycle;
- mandatory cluster streaks now include Identity × Authorization × Station × AGWS × AI **2**, Process/Application × Workflow × Data/Schema **2**, Workflow × Integration × Messaging × external mutation **2**, Provider/Binding × external realizations **2**; Enterprise Trust/PKI × Identity × Artifact/Release × provider substitution remains **0**; the remaining mandatory clusters retain their state-authoritative values;
- adversarial negative-space review: `NOT_STARTED`;
- saturation: `NOT_SATURATED`;
- `PLANNING_C_TARGET_ARCHITECTURE`: **BLOCKED**.

## Next rotation

The authoritative next action is maintained by `RESEARCH_PIPELINE_STATE.json` and `ADVERSARIAL_SATURATION_STATE.json`: continue Full Pass 4 with **Data / Schema / Migrations** and explicitly exercise **Data/Schema × Privacy × Storage × Lifecycle**. Duplicate-screen against all **119** reusable ConflictPatterns. Do not enter Planning C.
