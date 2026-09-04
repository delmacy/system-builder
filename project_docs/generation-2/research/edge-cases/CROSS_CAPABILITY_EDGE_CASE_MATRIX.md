# Generation 2 — Cross-Capability Edge-Case Matrix

Status: ACTIVE
Phase: `RESEARCH_ADVERSARIAL_EDGE_CASE_SATURATION`

This matrix indexes detailed per-capability registers. It does not assert `ConflictInstance`s or authorize remediation. Preserve `ConflictPattern != ConflictInstance`, `Signal != ConfirmedConflict`, qualified evidence/currentness, provider IDs as non-canonical, `Enterprise → Station → Role → Person`, AI/AGWS non-amplification and `UNKNOWN → reconcile-before-retry`.

## Mandatory cluster rotation — Full Pass 1

| # | Cluster | Status | Detailed register(s) | Material range / deepening |
| --- | --- | --- | --- | --- |
| 1 | Process/Application × Workflow × Data/Schema | MATERIAL / STREAK 0 | existing registers + `ARCHITECTURE_RECONCILIATION_EDGE_CASE_REGISTER.md` | producing process/workflow/schema revision mismatch can make desired-vs-observed comparison invalid even when each owner is locally correct |
| 2 | Workflow × Integration × Messaging × external mutation | MATERIAL / STREAK 0 | existing registers | ambiguous remote effects and callbacks remain reconcile-before-retry and revision-qualified |
| 3 | Identity × Authorization × Station × AGWS × AI | MATERIAL / STREAK 0 | existing registers + reconciliation register | accepting deviation/normalization/remediation requires current inherited authority/SoD; reconciliation or AI comparison power cannot amplify authority |
| 4 | Data/Schema × Privacy × Storage × Lifecycle | MATERIAL / STREAK 0 | existing registers + reconciliation register | scoped closure cannot hide residual governed/authoritative cohorts; correction/supersession must preserve producing history |
| 5 | Build × Artifact/Release × Deployment × Runtime | MATERIAL / STREAK 0 | existing registers + reconciliation register | exact historical review and observed runtime can represent different generations; historical qualification != current convergence/rollback safety |
| 6 | Provider/Binding × external realizations | MATERIAL / STREAK 0 | existing registers + reconciliation register | provider ACK/external ID is evidence, not canonical identity or closure; ambiguous effects and residual provider cohorts remain explicit |
| 7 | Secrets/Config × Runtime × Provider substitution | MATERIAL / STREAK 0 | existing registers | credential/config rotations remain independently changing currentness dimensions |
| 8 | Mathematical Expressions × Workflow × Data × UI/Form × Commercial Metering/FinOps | MATERIAL / STREAK 0 | existing registers | historical and live calculation/conformance claims remain revision-qualified |
| 9 | Observability × Security/Recovery × runtime truth | MATERIAL / STREAK 0 | existing registers + reconciliation register | telemetry/health is scoped evidence, not semantic proof of recovery or architecture conformance; stale review cannot confer current rollback safety |
| 10 | Extension/Plugin × authority × provider trust × lifecycle | MATERIAL / STREAK 0 | existing registers | extension/provider/trust cohorts remain explicitly versioned and authority-bounded |
| 11 | Commercial Metering × Entitlements × Rating × Billing × Payment | MATERIAL / STREAK 0 | existing registers | commercial pipeline reconciliation remains producing-revision and effect qualified |
| 12 | Enterprise Trust/PKI × Identity × Artifact/Release × provider substitution | MATERIAL / STREAK 0 | existing registers | trust/identity/release/provider evidence remains independently currentness-qualified |

## Full Pass 2 — mandatory cluster revisits

| # | Cluster | Pass-2 status | Detailed artifact | Result / streak |
| --- | --- | --- | --- | --- |
| 3 | Identity × Authorization × Station × AGWS × AI | COVERED / NO NEW MATERIAL CLASS | `ADAPTIVE_GOVERNED_WORK_SURFACES_FULL_PASS_2_REVISIT.md` | stale authority, simultaneous human/AI edits, AI action-sequence composition, inherited constraints, stale evidence and AI/provider bypass all mapped to already-catalogued classes after duplicate screening; eligible no-material streak **1** |
| 1 | Process/Application × Workflow × Data/Schema | COVERED / MATERIAL NEW CLASS | `PROCESS_APPLICATION_MODELING_FULL_PASS_2_REVISIT.md` | new `G2-XEDGE-PROCESS-WORKFLOW-DATA-005`: producer-local compensation can become semantically incompatible after another process has adopted the effect; cluster streak **0** |
| 2 | Workflow × Integration × Messaging × external mutation | COVERED / MATERIAL NEW CLASS | `WORKFLOW_DURABLE_EXECUTION_FULL_PASS_2_REVISIT.md` | new `G2-XEDGE-WORKFLOW-INTEGRATION-MSG-005`: individually valid event normalization/delivery/waits can disagree on owner-qualified consumption cardinality; cluster streak **0** |
| 4 | Data/Schema × Privacy × Storage × Lifecycle | COVERED / MATERIAL NEW CLASS | `DATA_SCHEMA_MIGRATIONS_FULL_PASS_2_REVISIT.md` | new `G2-XEDGE-DATA-PRIVACY-STORAGE-LIFECYCLE-005`: individually valid sinks or CDC cohorts can lack a common qualified cut after data/lifecycle changes; cluster streak **0** |
| 6 | Provider/Binding × external realizations | COVERED / NO NEW MATERIAL CLASS | `STORAGE_DOCUMENTS_MEDIA_FULL_PASS_2_REVISIT.md` | provider-specific ETag/checksum/version, object-lock scope, copy/restore effects, key/access drift and residual-provider objects mapped to existing provider/storage patterns; eligible no-material streak **1** |
| 7 | Secrets/Config × Runtime × Provider substitution | COVERED / MATERIAL NEW SCENARIO | `SECRETS_CONFIGURATION_ENVIRONMENT_PORTABILITY_FULL_PASS_2_REVISIT.md` | new `G2-XEDGE-SECRETS-RUNTIME-PROVIDER-005`: correct steady-state prerequisites can compose a recovery/bootstrap dependency cycle with no qualified acyclic startup cut. The class maps to existing structural-cycle, recovery-qualification and degraded-authority patterns, so no redundant reusable ConflictPattern was created; cluster streak **0** |

The Secrets/Config revisit also found two new local scenarios: independently valid configuration members may fail to form one qualified atomic configuration set (`G2-EDGE-SECRETS-007`), and mutable alias/latest indirection can change effective realization without a canonical intent revision (`G2-EDGE-SECRETS-008`). These map to existing revision-vector, qualification-join and currentness patterns rather than creating duplicate conflict families.

## Full Pass 2 campaign state

- canonical capabilities revisited: **6/28**;
- mandatory clusters revisited: **6/12**;
- Identity × Authorization × Station × AGWS × AI streak: **1**;
- Process/Application × Workflow × Data/Schema streak: **0**;
- Workflow × Integration × Messaging × external mutation streak: **0**;
- Data/Schema × Privacy × Storage × Lifecycle streak: **0**;
- Provider/Binding × external realizations streak: **1**;
- Secrets/Config × Runtime × Provider substitution streak: **0**;
- all other mandatory cluster streaks: **0**;
- material edge scenarios: **254**;
- reusable conflict patterns: **115**;
- combined material findings: **369**;
- HIGH/CRITICAL without owner/proof/detection route: **0**;
- completed full passes: **1/8 minimum**;
- active full pass: **2**;
- negative-space review: NOT STARTED;
- saturation: NOT SATURATED;
- `PLANNING_C_TARGET_ARCHITECTURE`: BLOCKED.

Detailed scenario fields remain authoritative in linked registers and `EDGE_CASE_INDEX.md`. Full Pass 2 must revisit all capabilities and mandatory clusters; eligible no-material streaks only advance on revisits with no genuinely new material finding.
