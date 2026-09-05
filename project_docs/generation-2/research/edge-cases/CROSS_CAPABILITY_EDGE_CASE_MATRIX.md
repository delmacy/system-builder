# Generation 2 — Cross-Capability Edge-Case Matrix

Status: ACTIVE
Phase: `RESEARCH_ADVERSARIAL_EDGE_CASE_SATURATION`

This matrix indexes detailed per-capability registers and explicit mandatory-cluster revisits. It does not assert `ConflictInstance`s or authorize remediation. Preserve `ConflictPattern != ConflictInstance`, `Signal != ConfirmedConflict`, qualified evidence/currentness, provider IDs as non-canonical, `Enterprise → Station → Role → Person`, AI/AGWS non-amplification and `UNKNOWN → reconcile-before-retry`.

## Mandatory cluster rotation — Full Pass 1

All 12 mandatory clusters were challenged in Full Pass 1. Full-Pass-1 detailed registers remain authoritative historical evidence.

## Full Pass 2 — completed mandatory-cluster revisits

Full Pass 2 completed **28/28 capabilities and 12/12 mandatory clusters**. It ended with cluster streak 1 for `Identity × Authorization × Station × AGWS × AI` and `Provider/Binding × external realizations`; all other mandatory cluster streaks were 0. Detailed Pass-2 dossiers remain authoritative for the material scenarios and their owner/detection/proof fields.

## Full Pass 3 — mandatory-cluster revisits complete

| # | Cluster | Pass-3 status | Detailed artifact | Result / streak |
| --- | --- | --- | --- | --- |
| 3 | Identity × Authorization × Station × AGWS × AI | COVERED / ELIGIBLE NO NEW MATERIAL | `ADAPTIVE_GOVERNED_WORK_SURFACES_FULL_PASS_3_REVISIT.md` | 0 new cluster scenarios/patterns; streak **1 → 2** |
| 1 | Process/Application × Workflow × Data/Schema | COVERED / ELIGIBLE NO NEW MATERIAL | `PROCESS_APPLICATION_MODELING_FULL_PASS_3_REVISIT.md` | 0 new; streak **0 → 1** |
| 2 | Workflow × Integration × Messaging × external mutation | COVERED / ELIGIBLE NO NEW MATERIAL | `WORKFLOW_DURABLE_EXECUTION_FULL_PASS_3_REVISIT.md` | 0 new; streak **0 → 1** |
| 4 | Data/Schema × Privacy × Storage × Lifecycle | COVERED / ELIGIBLE NO NEW MATERIAL | `DATA_SCHEMA_MIGRATIONS_FULL_PASS_3_REVISIT.md` | 0 new; streak **0 → 1** |
| 6 | Provider/Binding × external realizations | COVERED / ELIGIBLE NO NEW MATERIAL | `STORAGE_DOCUMENTS_MEDIA_FULL_PASS_3_REVISIT.md` | 0 new; streak **1 → 2** |
| 7 | Secrets/Config × Runtime × Provider substitution | COVERED / ELIGIBLE NO NEW MATERIAL | `SECRETS_CONFIGURATION_ENVIRONMENT_PORTABILITY_FULL_PASS_3_REVISIT.md` | 0 new; streak **0 → 1** |
| 5 | Build × Artifact/Release × Deployment × Runtime | COVERED / ELIGIBLE NO NEW MATERIAL | `BUILD_DEPENDENCY_GRAPH_REPRODUCIBILITY_FULL_PASS_3_REVISIT.md` | 0 new; streak **0 → 1** |
| 12 | Enterprise Trust/PKI × Identity × Artifact/Release × provider substitution | COVERED / ELIGIBLE NO NEW MATERIAL | `ARTIFACT_RELEASE_SBOM_PROVENANCE_FULL_PASS_3_REVISIT.md` | 0 new; streak **0 → 1** |
| 9 | Observability × Security/Recovery × runtime truth | COVERED / ELIGIBLE NO NEW MATERIAL | `DEPLOYMENT_RUNTIME_AUTONOMOUS_OPERATION_FULL_PASS_3_REVISIT.md` | 0 new; streak **0 → 1** |
| 10 | Extension/Plugin × authority × provider trust × lifecycle | COVERED / ELIGIBLE NO NEW MATERIAL | `EXTENSION_PLUGIN_MARKETPLACE_ARCHITECTURE_FULL_PASS_3_REVISIT.md` | 0 new; streak **0 → 1** |
| 11 | Commercial Metering × Entitlements × Rating × Billing × Payment | COVERED / ELIGIBLE NO NEW MATERIAL | `COMMERCIAL_METERING_ENTITLEMENTS_RATING_BILLING_PAYMENT_FULL_PASS_3_REVISIT.md` | 0 new; streak **0 → 1** |
| 8 | Mathematical Expressions × Workflow × Data × UI/Form × Commercial/FinOps | COVERED / ELIGIBLE NO NEW MATERIAL | `TECHNOLOGY_ECONOMIC_GOVERNANCE_FINOPS_FULL_PASS_3_REVISIT.md` | 0 new; streak **0 → 1** |

## Cross-cutting interaction additions discovered during local rotation

### `G2-CONFLICT-PATTERN-PRESENCE-SEMANTICS-001` — UCA × representation/profile consumers

Origin: `UNIVERSAL_CAPABILITY_ARCHITECTURE_FULL_PASS_3_REVISIT.md`.

Cross-capability surfaces: UCA × Data/Schema × UI/Generated Experience × Workflow × Integration × Standards/Interoperability × Provider/Binding × Authorization/Policy × AI/low-code.

Material interaction: each component can be locally valid while one layer treats a field as absent/unknown/not-applicable/redacted, another injects an explicit default, and another representation gives `null` mutation semantics such as delete. Composition can therefore create a fact, decision, authority or mutation that no semantic owner actually asserted.

Detection route: presence-state compatibility matrix, schema/profile/operator revision comparison, round-trip semantic diff, default-injection mutation testing, raw-to-normalized provenance and information-loss non-strengthening property. Owner route: producing + consuming semantic owners, with UCA governing generic carriage and Standards/Provider realization owners governing translation. False-positive control: do not flag states that owners explicitly prove equivalent.

Disposition remains `CATALOGUE + CLASSIFY + DETECTION_CANDIDATE + FUTURE_REMEDIATION_ROUTE`. This is a reusable `ConflictPattern`, not a `ConflictInstance`; it does **not** create or advance a mandatory-cluster streak in this run.

### `G2-EDGE-UI-011` — UI rendered/confirmed value × submission presence × downstream default semantics

Origin: `UI_GENERATED_EXPERIENCE_LOW_CODE_BUILDER_FULL_PASS_3_REVISIT.md`.

Cross-capability surfaces: UI/Generated Experience × UCA × Data/Schema × Process × Formula/Math × Authorization/Policy × Standards/Interoperability × Provider/Binding.

Material interaction: a human can validly see and confirm a material value `A`; a valid control/provider serialization path can omit that value from the payload; a valid downstream owner can then treat `ABSENT/UNSET` using default/current semantics `B`. The composed chain therefore changes the meaning of the human decision after presentation but before semantic actuation, even when each local component is conformant.

Detection route: rendered-value versus emitted-payload semantic differential, control-state serialization truth table, presence/default compatibility matrix, confirmation-lineage binding and post-effect rendered-versus-producing-input audit. Owner route: UI for faithful projection/intent lineage plus the Data/Process/Formula/Policy semantic owners and Standards/Provider translation owners as applicable.

Duplicate-screen disposition: this is a new UI-specific material edge scenario but maps to the existing `G2-CONFLICT-PATTERN-PRESENCE-SEMANTICS-001`; it does not create a 117th reusable pattern or a new mandatory cluster. Mandatory-cluster streaks are not incremented/reset incidentally by this local rotation.

## Current campaign state

- completed full passes: **2/8 minimum**; target **12**, no maximum;
- active full pass: **3**;
- Full Pass 3 cluster coverage: **12/12 mandatory clusters**;
- Full Pass 3 capability coverage: **14/28 canonical capabilities**;
- material edge scenarios: **280**;
- reusable ConflictPatterns: **116**;
- combined material findings: **396**;
- HIGH/CRITICAL without owner/proof/detection route: **0**;
- `Identity × Authorization × Station × AGWS × AI` streak: **2**;
- `Provider/Binding × external realizations` streak: **2**;
- each of the other ten mandatory cluster streaks: **1**;
- UCA local streak: **0** after material finding;
- UI local streak: **0** after material finding;
- negative-space review: `NOT_STARTED`;
- saturation: `NOT_SATURATED`;
- `PLANNING_C_TARGET_ARCHITECTURE`: **BLOCKED**.

## Next explicit research rotation

All required clusters are already covered for Full Pass 3, so the authoritative rotation continues locally with **Integration & Automation**. Use techniques materially different from Full Passes 1 and 2 and duplicate-screen against all **116** reusable ConflictPatterns, explicitly including `G2-CONFLICT-PATTERN-PRESENCE-SEMANTICS-001`. Any material finding resets affected streaks. Do not enter Planning C.
