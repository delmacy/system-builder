# Generation 2 — Cross-Capability Edge-Case Matrix

Status: ACTIVE
Phase: `RESEARCH_ADVERSARIAL_EDGE_CASE_SATURATION`

This matrix indexes detailed per-capability registers and explicit mandatory-cluster revisits. It does not assert `ConflictInstance`s or authorize remediation. Preserve `ConflictPattern != ConflictInstance`, `Signal != ConfirmedConflict`, qualified evidence/currentness, provider IDs as non-canonical, `Enterprise → Station → Role → Person`, AI/AGWS non-amplification and `UNKNOWN → reconcile-before-retry`.

## Mandatory cluster rotation — Full Pass 1

All 12 mandatory clusters were challenged in Full Pass 1. Full-Pass-1 detailed registers remain authoritative historical evidence.

## Full Pass 2 — completed mandatory-cluster revisits

Full Pass 2 completed **28/28 capabilities and 12/12 mandatory clusters**. It ended with cluster streak 1 for `Identity × Authorization × Station × AGWS × AI` and `Provider/Binding × external realizations`; all other mandatory cluster streaks were 0. Detailed Pass-2 dossiers remain authoritative for material scenarios and owner/detection/proof fields.

## Full Pass 3 — mandatory-cluster revisits complete

| Cluster | Pass-3 result / current streak before Pass 4 |
| --- | --- |
| Identity × Authorization × Station × AGWS × AI | no new in explicit revisit; streak **2** |
| Process/Application × Workflow × Data/Schema | no new; streak **1** |
| Workflow × Integration × Messaging × external mutation | no new; streak **1** |
| Data/Schema × Privacy × Storage × Lifecycle | no new; streak **1** |
| Provider/Binding × external realizations | no new in explicit revisit; streak **2** |
| Secrets/Config × Runtime × Provider substitution | no new; streak **1** |
| Build × Artifact/Release × Deployment × Runtime | no new; streak **1** |
| Enterprise Trust/PKI × Identity × Artifact/Release × provider substitution | later materially deepened by `G2-EDGE-TRUST-008`; streak **0** |
| Observability × Security/Recovery × runtime truth | no new; streak **1** |
| Extension/Plugin × authority × provider trust × lifecycle | no new; streak **1** |
| Commercial Metering × Entitlements × Rating × Billing × Payment | no new; streak **1** |
| Mathematical Expressions × Workflow × Data × UI/Form × Commercial/FinOps | no new; streak **1** |

## Cross-cutting interaction additions discovered during Full Pass 3

- `G2-CONFLICT-PATTERN-PRESENCE-SEMANTICS-001`: UCA × Data/Schema × UI × Workflow × Integration × Standards × Provider/Binding × Authorization/Policy × AI/low-code.
- `G2-EDGE-TRUST-008` / `G2-CONFLICT-PATTERN-TRUST-NAMESPACE-COLLAPSE-001`: Enterprise Trust/PKI × Identity/Federation × Artifact/Release × Provider/Binding × Standards × Authorization.
- `G2-EDGE-PRIVACY-008` / `G2-CONFLICT-PATTERN-CUMULATIVE-PRIVACY-001`: Privacy/Data Governance × Data/Schema/analytics × Authorization/Governance × Process/external sharing × AI/low-code.
- `G2-EDGE-LIFECYCLE-008` / `G2-CONFLICT-PATTERN-COMPATIBILITY-DIRECTION-001`: Lifecycle × Data/Schema × Runtime × Standards/API Contracts × Provider/Binding × Workflow/Integration × Recovery.

Disposition for all patterns remains `CATALOGUE + CLASSIFY + DETECTION_CANDIDATE + FUTURE_REMEDIATION_ROUTE`; no `ConflictInstance` or implementation work is implied.

## Full Pass 4 — active mandatory-cluster rotation

| Mandatory cluster | Explicit Pass-4 revisit | Result | Current streak |
| --- | --- | --- | ---: |
| Process/Application × Workflow × Data/Schema | `PROCESS_APPLICATION_MODELING_FULL_PASS_4_REVISIT.md` | eligible no-new-material | **2** |
| Workflow × Integration × Messaging × external mutation | `WORKFLOW_DURABLE_EXECUTION_FULL_PASS_4_REVISIT.md` | eligible no-new-material | **2** |
| Data/Schema × Privacy × Storage × Lifecycle | `DATA_SCHEMA_MIGRATIONS_FULL_PASS_4_REVISIT.md` | eligible no-new-material | **2** |

The AGWS local Pass-4 revisit did not count the already-streak-2 `Identity × Authorization × Station × AGWS × AI` cluster because it was not independently exercised in that visit.

### Data/Schema × Privacy × Storage × Lifecycle — Pass 4

The explicit cluster revisit challenged:

- declared constraints versus the population actually validated under those constraints;
- old/new readers, writers, migration transforms, privacy rules and storage lifecycle rules across independent semantic cuts;
- `ABSENT/UNSET/null/default/delete` transformations that can manufacture or erase meaning;
- retention deletion versus legal hold/residency and schema-required relationships;
- dual-write/CDC without a single qualified convergence cut;
- identity/key reuse across deletion, restore, provider substitution and residual cohorts;
- correction/supersession after derived snapshots or external consumers have adopted prior semantics;
- restore of disposed data through obsolete schemas/storage cohorts;
- forward-only compatibility reused for rollback/replay;
- provider substitution and `PARTIAL/UNKNOWN` migration effects;
- validation/backfill/lineage cardinality and resource pressure;
- human/AI migration plans whose steps are individually admissible but jointly alter semantic ownership, privacy or authority.

Duplicate-screen against all **119** reusable ConflictPatterns found no new material interaction class. PostgreSQL `NOT VALID` is a useful witness that a declared constraint may govern future writes while historical rows remain unvalidated, but this is already represented by qualification/currentness/convergence and residual-cohort semantics. No new `G2-XEDGE-*` or `G2-CONFLICT-PATTERN-*` ID is warranted.

Data/Schema × Privacy × Storage × Lifecycle therefore advances **1→2**. `Signal != ConfirmedConflict` remains mandatory.

## Current campaign state

- completed full passes: **3/8 minimum**; target **12**, no maximum;
- active full pass: **4**;
- Full Pass 3 cluster coverage: **12/12 — complete**;
- Full Pass 3 capability coverage: **28/28 — complete**;
- Full Pass 4 cluster coverage: **3/12**;
- Full Pass 4 capability coverage: **4/28**;
- material edge scenarios: **284**;
- reusable ConflictPatterns: **119**;
- combined material findings: **403**;
- HIGH/CRITICAL without owner/proof/detection route: **0**;
- mandatory cluster streaks now include Identity/Authorization/Station/AGWS/AI **2**, Process/Application/Workflow/Data **2**, Workflow/Integration/Messaging/external mutation **2**, Data/Schema/Privacy/Storage/Lifecycle **2**, Provider/Binding/external realizations **2**; Enterprise Trust/PKI × Identity × Artifact/Release × provider substitution remains **0**; other state values are authoritative in `ADVERSARIAL_SATURATION_STATE.json`;
- negative-space: `NOT_STARTED`;
- saturation: `NOT_SATURATED`;
- Planning C: **BLOCKED**.

## Next explicit research rotation

Continue with **Storage / Documents / Media** and explicitly exercise **Provider/Binding × external realizations** for Full Pass 4. Its saturation streak is already 2, so another eligible exercise must count for pass coverage without manufacturing a streak >2. Duplicate-screen against all **119** reusable ConflictPatterns. Do not enter Planning C.
