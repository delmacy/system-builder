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

### `G2-CONFLICT-PATTERN-PRESENCE-SEMANTICS-001`

Origin: `UNIVERSAL_CAPABILITY_ARCHITECTURE_FULL_PASS_3_REVISIT.md`.

Cross-capability surfaces: UCA × Data/Schema × UI × Workflow × Integration × Standards × Provider/Binding × Authorization/Policy × AI/low-code.

Otherwise valid components can disagree on whether absence, explicit default, `null`, `UNKNOWN`, `NOT_APPLICABLE`, redaction or delete are values, lack of values or mutation operators. Detection candidates include presence-state compatibility matrices, schema/profile/operator revision comparison, round-trip semantic diff, default-injection mutation testing and raw-to-normalized provenance.

### `G2-EDGE-TRUST-008` / `G2-CONFLICT-PATTERN-TRUST-NAMESPACE-COLLAPSE-001`

Origin: `ENTERPRISE_TRUST_PKI_CERTIFICATE_LIFECYCLE_FULL_PASS_3_REVISIT.md`.

Cross-capability surfaces: Enterprise Trust/PKI × Identity/Federation × Artifact/Release × Provider/Binding × Standards × Authorization. Independently valid trust bundles/anchor sets become jointly unsafe when composition loses trust-domain→bundle ownership and widens accepted namespace. Cluster `Enterprise Trust/PKI × Identity × Artifact/Release × provider substitution` reset to **0**.

### `G2-EDGE-PRIVACY-008` / `G2-CONFLICT-PATTERN-CUMULATIVE-PRIVACY-001`

Origin: `PRIVACY_DATA_GOVERNANCE_RETENTION_LEGAL_HOLD_RESIDENCY_FULL_PASS_3_REVISIT.md`.

Cross-capability surfaces: Privacy/Data Governance × Data/Schema/analytics × Authorization/Governance × Process/external sharing × AI/low-code. Individually qualified releases or inferences can jointly create materially greater identifying/inferential power or exceed an explicitly governed cumulative privacy-loss bound.

### `G2-EDGE-LIFECYCLE-008` / `G2-CONFLICT-PATTERN-COMPATIBILITY-DIRECTION-001`

Origin: `LIFECYCLE_VERSIONING_EVOLUTION_MIGRATION_FULL_PASS_3_REVISIT.md`.

Cross-capability surfaces: Lifecycle × Data/Schema × Runtime × Standards/API Contracts × Provider/Binding × Workflow/Integration × Recovery. A qualified relation such as `A→B` for read/forward migration becomes unsafe when composition stores it as scalar `compatible(A,B)` and later exercises `B→A`, write, replay, rollback or another unqualified direction/topology.

Disposition for all patterns remains `CATALOGUE + CLASSIFY + DETECTION_CANDIDATE + FUTURE_REMEDIATION_ROUTE`; no `ConflictInstance` or implementation work is implied.

## Full Pass 4 — active mandatory-cluster rotation

| Mandatory cluster | Explicit Pass-4 revisit | Result | Current streak |
| --- | --- | --- | ---: |
| Process/Application × Workflow × Data/Schema | `PROCESS_APPLICATION_MODELING_FULL_PASS_4_REVISIT.md` | eligible no-new-material | **2** |
| Workflow × Integration × Messaging × external mutation | `WORKFLOW_DURABLE_EXECUTION_FULL_PASS_4_REVISIT.md` | eligible no-new-material | **2** |

The AGWS local Pass-4 revisit did not count the already-streak-2 `Identity × Authorization × Station × AGWS × AI` cluster because it was not independently exercised in that visit.

### Workflow × Integration × Messaging × external mutation — Pass 4

The explicit cluster revisit challenged:

- durable history that remains structurally valid while current semantic eligibility changes;
- acknowledgement, effect, correlation and canonical adoption as separate evidence surfaces;
- cancellation/retry/compensation reorderings and delayed original/retry messages;
- duplicate/out-of-order events and correlation cardinality;
- provider substitution with residual queues/subscriptions/jobs;
- directed workflow/provider compatibility under replay/rollback/reverse roles;
- `ABSENT/null/default/delete` transformations in commands/events;
- downstream cross-process adoption before compensation;
- retry/fan-out/backlog/provider-quota composition;
- AI/low-code aggregate plans that can create contradictory effects, unsafe retry loops or authority widening.

Duplicate-screen against all **119** reusable ConflictPatterns found no new material interaction class. Candidate observations were absorbed by temporal/state-transition, correlation-cardinality, acknowledgement/effect, ambiguous-mutation/idempotency, provider-coexistence/residual-cohort, compatibility-direction, presence-semantics, cross-process compensation/adoption, scheduling-starvation/resource-boundedness and AI/low-code authority families.

No new `G2-XEDGE-*` or `G2-CONFLICT-PATTERN-*` ID was warranted. Workflow × Integration × Messaging × external mutation therefore advances **1→2**. `Signal != ConfirmedConflict` remains mandatory for all detection candidates.

## Current campaign state

- completed full passes: **3/8 minimum**; target **12**, no maximum;
- active full pass: **4**;
- Full Pass 3 cluster coverage: **12/12 — complete**;
- Full Pass 3 capability coverage: **28/28 — complete**;
- Full Pass 4 cluster coverage: **2/12**;
- Full Pass 4 capability coverage: **3/28**;
- material edge scenarios: **284**;
- reusable ConflictPatterns: **119**;
- combined material findings: **403**;
- HIGH/CRITICAL without owner/proof/detection route: **0**;
- mandatory cluster streaks now include Identity/Authorization/Station/AGWS/AI **2**, Process/Application/Workflow/Data **2**, Workflow/Integration/Messaging/external mutation **2**, Provider/Binding/external realizations **2**; Enterprise Trust/PKI × Identity × Artifact/Release × provider substitution remains **0**; other state values are authoritative in `ADVERSARIAL_SATURATION_STATE.json`;
- negative-space: `NOT_STARTED`;
- saturation: `NOT_SATURATED`;
- Planning C: **BLOCKED**.

## Next explicit research rotation

Continue with **Data / Schema / Migrations** and explicitly exercise **Data/Schema × Privacy × Storage × Lifecycle** under the authoritative state. Duplicate-screen against all **119** reusable ConflictPatterns, including compatibility-direction, presence semantics, trust-namespace collapse and cumulative privacy where applicable. Do not enter Planning C.
