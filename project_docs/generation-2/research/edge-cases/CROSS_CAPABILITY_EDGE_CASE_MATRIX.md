# Generation 2 — Cross-Capability Edge-Case Matrix

Status: ACTIVE
Phase: `RESEARCH_ADVERSARIAL_EDGE_CASE_SATURATION`

This matrix indexes detailed per-capability registers. It does not assert `ConflictInstance`s or authorize remediation. Preserve `ConflictPattern != ConflictInstance`, `Signal != ConfirmedConflict`, qualified evidence/currentness, provider IDs as non-canonical, `Enterprise → Station → Role → Person`, AI/AGWS non-amplification and `UNKNOWN → reconcile-before-retry`.

## Mandatory cluster rotation — Full Pass 1

| # | Cluster | Status | Detailed register(s) | Material range / deepening |
| --- | --- | --- | --- | --- |
| 1 | Process/Application × Workflow × Data/Schema | MATERIAL / STREAK 0 | existing registers | `G2-XEDGE-PROCESS-WORKFLOW-DATA-001..004`; lifecycle revision/currentness deepening where process/workflow/schema revisions coexist |
| 2 | Workflow × Integration × Messaging × external mutation | MATERIAL / STREAK 0 | existing registers + `LIFECYCLE_VERSIONING_EVOLUTION_MIGRATION_EDGE_CASE_REGISTER.md` | in-flight work crosses deprecation/withdrawal; callback/retry after revision change; `UNKNOWN` remote effect requires reconciliation |
| 3 | Identity × Authorization × Station × AGWS × AI | MATERIAL / STREAK 0 | existing registers + lifecycle register | authority/policy/trust may change during long-lived migration; AI/low-code evolution plans cannot amplify authority |
| 4 | Data/Schema × Privacy × Storage × Lifecycle | MATERIAL / STREAK 0 | existing registers + lifecycle register | `G2-XEDGE-DATA-PRIVACY-STORAGE-LIFECYCLE-001..004` plus schema/privacy currentness, residual data/client cohorts, rollback eligibility and correction lineage |
| 5 | Build × Artifact/Release × Deployment × Runtime | MATERIAL / STREAK 0 | existing registers + lifecycle register | retained artifact/history != current rollback eligibility; independently changing runtime/config/provider/data dimensions must be requalified |
| 6 | Provider/Binding × external realizations | MATERIAL / STREAK 0 | existing provider-related registers + lifecycle register | provider substitution/migration ACK != canonical convergence; residual old-provider cohorts may remain authoritative |
| 7 | Secrets/Config × Runtime × Provider substitution | MATERIAL / STREAK 0 | existing registers + lifecycle register | credential/config rotations are independent lifecycle dimensions; residual credentials/config consumers can survive cutover |
| 8 | Mathematical Expressions × Workflow × Data × UI/Form × Commercial/FinOps | MATERIAL / STREAK 0 | existing registers | formula/policy revisions remain part of lifecycle revision vector; historical recomputation remains qualified |
| 9 | Observability × Security/Recovery × runtime truth | MATERIAL / STREAK 0 | existing registers + lifecycle register | migration health/ACK != current convergence; rollback/recovery eligibility must be current and owner-qualified |
| 10 | Extension/Plugin × authority × provider trust × lifecycle | MATERIAL / STREAK 0 | existing registers + lifecycle register | extension/provider cohorts and trust revisions can coexist across evolution/withdrawal windows |
| 11 | Commercial Metering × Entitlements × Rating × Billing × Payment | MATERIAL / STREAK 0 | existing registers | commercial revisions/cohorts remain subject to explicit evolution lineage and convergence evidence |
| 12 | Enterprise Trust/PKI × Identity × Artifact/Release × provider substitution | MATERIAL / STREAK 0 | existing registers + lifecycle register | trust/credential/release/provider revisions form independent dimensions; residual trust cohorts can outlive cutover |

## Lifecycle / Versioning / Evolution / Migration deepening — reusable conflict links

No 13th mandatory cluster is added.

| Conflict pattern | Cross-capability activation | Detection candidate | Status |
| --- | --- | --- | --- |
| `G2-CONFLICT-PATTERN-MIGRATION-READINESS-001` | readiness evidence applies to an older revision/cohort/time while dependent owners changed before cutover/cleanup | current revision/cohort/evidence vector diff + stale-evidence and validation coverage checks | MATERIAL / catalogue |
| `G2-CONFLICT-PATTERN-CUTOVER-AUTHORITY-001` | new revision/provider is declared canonical while an old cohort can still create authoritative effects | cohort graph + last authoritative effect + binding/credential/contract traffic evidence | MATERIAL / catalogue |
| `G2-CONFLICT-PATTERN-ROLLBACK-ELIGIBILITY-001` | retained historical target exists but current data/provider/trust/policy/privacy/runtime constraints no longer match | rollback target × current multi-owner qualification vector | MATERIAL / catalogue |
| `G2-CONFLICT-PATTERN-SUPERSESSION-LINEAGE-001` | correction/supersession changes current truth while historical interpretation loses its producing revision/evidence | producing-revision lineage + historical snapshot/materialization metadata + supersession graph | MATERIAL / catalogue |

These preserve `migration status != convergence`, `cutover pointer != residual cohort drained`, `retained history != current rollback eligibility`, and `current correction != historical producing truth`.

## Full Pass 1 campaign state

- mandatory clusters challenged: **12/12**;
- all mandatory cluster no-material streaks: **0**;
- canonical capabilities challenged locally: **27/28**;
- latest Lifecycle findings: **7 edge scenarios + 4 conflict patterns; local streak 0**;
- material edge scenarios: **230**;
- reusable conflict patterns: **99**;
- combined material findings: **329**;
- full passes completed: **0/8 minimum**;
- negative-space review: NOT STARTED;
- saturation: NOT SATURATED;
- `PLANNING_C_TARGET_ARCHITECTURE`: BLOCKED.

Detailed scenario fields remain authoritative in linked registers and `EDGE_CASE_INDEX.md`.