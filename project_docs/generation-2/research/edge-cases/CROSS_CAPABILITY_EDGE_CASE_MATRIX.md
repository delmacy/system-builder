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
| 8 | Mathematical Expressions × Workflow × Data × UI/Form × Commercial/FinOps | MATERIAL / STREAK 0 | existing registers | historical and live calculation/conformance claims remain revision-qualified |
| 9 | Observability × Security/Recovery × runtime truth | MATERIAL / STREAK 0 | existing registers + reconciliation register | telemetry/health is scoped evidence, not semantic proof of recovery or architecture conformance; stale review cannot confer current rollback safety |
| 10 | Extension/Plugin × authority × provider trust × lifecycle | MATERIAL / STREAK 0 | existing registers | extension/provider/trust cohorts remain explicitly versioned and authority-bounded |
| 11 | Commercial Metering × Entitlements × Rating × Billing × Payment | MATERIAL / STREAK 0 | existing registers | commercial pipeline reconciliation remains producing-revision and effect qualified |
| 12 | Enterprise Trust/PKI × Identity × Artifact/Release × provider substitution | MATERIAL / STREAK 0 | existing registers | trust/identity/release/provider evidence remains independently currentness-qualified |

## Full Pass 2 — mandatory cluster revisits

| # | Cluster | Pass-2 status | Detailed artifact | Result / streak |
| --- | --- | --- | --- | --- |
| 3 | Identity × Authorization × Station × AGWS × AI | COVERED / NO NEW MATERIAL CLASS | `ADAPTIVE_GOVERNED_WORK_SURFACES_FULL_PASS_2_REVISIT.md` | stale authority, simultaneous human/AI edits, AI action-sequence composition, inherited constraints, stale evidence and AI/provider bypass all mapped to already-catalogued classes after duplicate screening; eligible no-material streak **1** |
| 1 | Process/Application × Workflow × Data/Schema | COVERED / MATERIAL NEW CLASS | `PROCESS_APPLICATION_MODELING_FULL_PASS_2_REVISIT.md` | new `G2-XEDGE-PROCESS-WORKFLOW-DATA-005`: producer-local compensation can become semantically incompatible after another process has adopted the effect; cluster streak remains/resets **0** |
| 2 | Workflow × Integration × Messaging × external mutation | COVERED / MATERIAL NEW CLASS | `WORKFLOW_DURABLE_EXECUTION_FULL_PASS_2_REVISIT.md` | new `G2-XEDGE-WORKFLOW-INTEGRATION-MSG-005`: individually valid event normalization/delivery/waits can disagree on owner-qualified consumption cardinality; cluster streak remains/resets **0** |
| 4 | Data/Schema × Privacy × Storage × Lifecycle | COVERED / MATERIAL NEW CLASS | `DATA_SCHEMA_MIGRATIONS_FULL_PASS_2_REVISIT.md` | new `G2-XEDGE-DATA-PRIVACY-STORAGE-LIFECYCLE-005`: individually valid sinks or CDC cohorts can lack a common qualified cut after data/lifecycle changes; cluster streak remains/resets **0** |

The Data revisit also found two new local composition classes: adjacent/pairwise schema compatibility does not prove active-cohort directional losslessness (`G2-CONFLICT-PATTERN-SCHEMA-LOSSLESSNESS-001`), and a schema/UI/migration default does not acquire canonical stored-fact authority merely by being materialized (`G2-CONFLICT-PATTERN-DEFAULT-MATERIALIZATION-001`). The cross-sink common-cut finding deepens existing migration/replica/currentness patterns rather than creating a redundant third reusable pattern. No 13th mandatory cluster is added.

## Full Pass 2 campaign state

- canonical capabilities revisited: **4/28**;
- mandatory clusters revisited: **4/12**;
- Identity × Authorization × Station × AGWS × AI streak: **1**;
- Process/Application × Workflow × Data/Schema streak: **0**;
- Workflow × Integration × Messaging × external mutation streak: **0**;
- Data/Schema × Privacy × Storage × Lifecycle streak: **0**;
- all other mandatory cluster streaks: **0**;
- material edge scenarios: **249**;
- reusable conflict patterns: **113**;
- combined material findings: **362**;
- HIGH/CRITICAL without owner/proof/detection route: **0**;
- completed full passes: **1/8 minimum**;
- active full pass: **2**;
- negative-space review: NOT STARTED;
- saturation: NOT SATURATED;
- `PLANNING_C_TARGET_ARCHITECTURE`: BLOCKED.

Detailed scenario fields remain authoritative in linked registers and `EDGE_CASE_INDEX.md`. Full Pass 2 must revisit all capabilities and mandatory clusters; eligible no-material streaks only advance on revisits with no genuinely new material finding.