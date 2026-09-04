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

## Architecture Reconciliation deepening — reusable conflict links

No 13th mandatory cluster is added.

| Conflict pattern | Cross-capability activation | Detection candidate | Status |
| --- | --- | --- | --- |
| `G2-CONFLICT-PATTERN-RECONCILIATION-CURRENTNESS-001` | desired revision advances while observed/runtime/provider evidence still represents an older or unknown generation | revision-vector/currentness match + stale-cache/evidence check + producing-generation validation | MATERIAL / catalogue |
| `G2-CONFLICT-PATTERN-RECONCILIATION-OWNERSHIP-001` | generic reconciler/AI can compare a mismatch and assumes this grants authority to choose which semantic owner must change | owner graph + current authority/SoD check + mutation actor/proposal lineage | MATERIAL / catalogue |
| `G2-CONFLICT-PATTERN-RECONCILIATION-CLOSURE-001` | one covered cohort is conformant while another applicable/residual cohort remains unobserved or authoritative | applicability/cohort graph + coverage completeness + last-authoritative-effect evidence | MATERIAL / catalogue |
| `G2-CONFLICT-PATTERN-RECONCILIATION-LINEAGE-001` | correction/closure is based on one revision/evidence set while concurrent supersession changes current truth and later history loses the producing inputs | base-revision reassessment + supersession graph + evidence lineage/audit replay | MATERIAL / catalogue |

These preserve `comparison != semantic ownership`, `observed evidence != canonical truth`, `local conformance != universal closure`, `historical review != current qualification`, and `correction != deletion of producing history`.

## Full Pass 1 campaign state

- mandatory clusters challenged: **12/12**;
- all mandatory cluster no-material streaks: **0**;
- canonical capabilities challenged locally: **28/28**;
- latest Architecture Reconciliation findings: **7 edge scenarios + 4 conflict patterns; local streak 0**;
- material edge scenarios: **237**;
- reusable conflict patterns: **103**;
- combined material findings: **340**;
- full passes completed: **1/8 minimum**;
- active full pass: **2**;
- negative-space review: NOT STARTED;
- saturation: NOT SATURATED;
- `PLANNING_C_TARGET_ARCHITECTURE`: BLOCKED.

Detailed scenario fields remain authoritative in linked registers and `EDGE_CASE_INDEX.md`. Full Pass 2 must revisit all capabilities and mandatory clusters; eligible no-material streaks only advance on revisits with no material finding.