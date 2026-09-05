# Generation 2 — Cross-Capability Edge-Case Matrix

Status: ACTIVE
Phase: `RESEARCH_ADVERSARIAL_EDGE_CASE_SATURATION`

This matrix indexes detailed per-capability registers and explicit mandatory-cluster revisits. It does not assert `ConflictInstance`s or authorize remediation. Preserve `ConflictPattern != ConflictInstance`, `Signal != ConfirmedConflict`, qualified evidence/currentness, provider IDs as non-canonical, `Enterprise → Station → Role → Person`, AI/AGWS non-amplification and `UNKNOWN → reconcile-before-retry`.

## Mandatory cluster rotation — Full Pass 1

All 12 mandatory clusters were challenged in Full Pass 1. Full-Pass-1 detailed registers remain authoritative historical evidence.

## Full Pass 2 — completed mandatory-cluster revisits

Full Pass 2 completed **28/28 capabilities and 12/12 mandatory clusters**. It ended with cluster streak 1 for `Identity × Authorization × Station × AGWS × AI` and `Provider/Binding × external realizations`; all other mandatory cluster streaks were 0. Detailed Pass-2 dossiers remain authoritative for material scenarios and owner/detection/proof fields.

## Full Pass 3 — mandatory-cluster revisits complete

| Cluster | Pass-3 result / current streak |
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

Otherwise valid components can disagree on whether absence, explicit default, `null`, `UNKNOWN`, `NOT_APPLICABLE`, redaction or delete are values, lack of values or mutation operators. `G2-EDGE-UI-011` and `G2-EDGE-INTEGRATION-008` are capability-specific manifestations. Detection candidates include presence-state compatibility matrices, schema/profile/operator revision comparison, round-trip semantic diff, default-injection mutation testing and raw-to-normalized provenance.

Disposition remains `CATALOGUE + CLASSIFY + DETECTION_CANDIDATE + FUTURE_REMEDIATION_ROUTE`.

### `G2-EDGE-TRUST-008` / `G2-CONFLICT-PATTERN-TRUST-NAMESPACE-COLLAPSE-001`

Origin: `ENTERPRISE_TRUST_PKI_CERTIFICATE_LIFECYCLE_FULL_PASS_3_REVISIT.md`.

Cross-capability surfaces: Enterprise Trust/PKI × Identity/Federation × Artifact/Release × Provider/Binding × Standards × Authorization.

Material interaction: independently valid trust bundles/anchor sets become jointly unsafe when union/import/provider consolidation loses the trust-domain→bundle ownership boundary and widens the namespace accepted by a validator. Detection route: trust-domain ownership graph, relying-namespace→qualified-bundle relation, federation/provider lineage and runtime accepted-subject/trust-path comparison. Explicit governed federation remains legitimate; inferred widening does not.

Cluster effect: `Enterprise Trust/PKI × Identity × Artifact/Release × provider substitution` reset **1→0**. No `ConflictInstance`; no remediation.

### `G2-EDGE-PRIVACY-008` / `G2-CONFLICT-PATTERN-CUMULATIVE-PRIVACY-001`

Origin: `PRIVACY_DATA_GOVERNANCE_RETENTION_LEGAL_HOLD_RESIDENCY_FULL_PASS_3_REVISIT.md`.

Cross-capability surfaces: Privacy/Data Governance × Data/Schema/analytics × Authorization/Governance × Process/external sharing × AI/low-code.

Material interaction: multiple individually qualified releases, analyses, views or model outputs can jointly create materially greater identifying/inferential power or exceed an explicitly governed cumulative privacy-loss bound. Detection route is history/recipient/context-aware: release/query lineage, auxiliary-data inventory, linkability/mosaic analysis, cumulative output history, derived-data classification and mechanism-specific privacy-budget accounting where applicable.

No mandatory-cluster streak was fabricated from this local cross-cutting discovery. `Data/Schema × Privacy × Storage × Lifecycle` remains **1**.

### `G2-EDGE-LIFECYCLE-008` / `G2-CONFLICT-PATTERN-COMPATIBILITY-DIRECTION-001`

Origin: `LIFECYCLE_VERSIONING_EVOLUTION_MIGRATION_FULL_PASS_3_REVISIT.md`.

Cross-capability surfaces: Lifecycle × Data/Schema × Runtime × Standards/API Contracts × Provider/Binding × Workflow/Integration × Recovery; overlays may also involve Trust, Privacy, Authority and AI/low-code.

Material interaction: two components/revisions can each be valid and a relation such as `A→B` for read/forward migration can be supported, while `B→A`, write, replay, rollback or another reachable topology is not. The conflict appears when composition stores or consumes that evidence as scalar/undirected `compatible(A,B)` and later exercises an unqualified direction or operation.

Detection route: directed compatibility graph keyed by revisions/roles/operation/profile; reachable-peer/topology analysis; producer/consumer and reader/writer inversion tests; upgrade-order constraints; round-trip/forward-backward migration mutation; current evidence horizon. A mismatch remains a `Signal` until the concrete system/revision/topology establishes activation.

Owner route: Lifecycle coordinates the relation/currentness join; Data/Schema, Runtime, Contract/Standards and Provider semantic owners define their directional/operation-specific support; Recovery consumes rather than invents compatibility. Provider or standards evidence is not automatically canonical semantic ownership.

Severity/confidence: HIGH–CRITICAL / strongly supported. Blast radius workflow→enterprise/external; reversibility migration-required→potentially irreversible; time-to-harm immediate or latent; misuse plausible/likely during rolling migration, rollback or AI-generated evolution plans. False-positive control: deliberate one-way/forward-only compatibility is legitimate and must remain expressible.

Future disposition: require additional relation evidence, reorder migration, constrain reachable topology, explicitly accept bounded asymmetry or route to owner reconciliation later. No implementation is authorized.

Research-only PreventiveInvariantCandidate: compatibility used for lifecycle decisions must not be widened from a qualified directed/operation-specific relation into an undirected/global claim without semantic-owner evidence. This does not prohibit legitimate asymmetric compatibility.

Cluster effect: no mandatory-cluster streak changes in this local revisit because no cluster-specific material scenario was independently established. The pattern is now a required duplicate-screen candidate for future explicit revisits of Data/Schema × Privacy × Storage × Lifecycle, Build × Artifact/Release × Deployment × Runtime, Provider/Binding × external realizations and other versioned compositions.

## Full Pass 4 — active mandatory-cluster rotation

Full Pass 4 is currently at **0/12 mandatory clusters**. The completed AGWS local revisit did **not** count `Identity × Authorization × Station × AGWS × AI` again because that cluster was not independently exercised; its established streak remains **2**.

The next explicit cluster selected by the authoritative state is **Process/Application × Workflow × Data/Schema**, currently at streak **1**. It must be challenged independently in the Process & Application Modeling Full-Pass-4 revisit before its counter may advance.

## Current campaign state

- completed full passes: **3/8 minimum**; target **12**, no maximum;
- active full pass: **4**;
- Full Pass 3 cluster coverage: **12/12 — complete**;
- Full Pass 3 capability coverage: **28/28 — complete**;
- Full Pass 4 cluster coverage: **0/12**;
- Full Pass 4 capability coverage: **1/28**;
- material edge scenarios: **284**;
- reusable ConflictPatterns: **119**;
- combined material findings: **403**;
- HIGH/CRITICAL without owner/proof/detection route: **0**;
- AGWS local streak: **2** after its Full-Pass-4 eligible no-new-material revisit;
- mandatory cluster streaks: Identity/Authorization/Station/AGWS/AI **2**; Provider/Binding/external realizations **2**; Enterprise Trust/PKI × Identity × Artifact/Release × provider substitution **0**; all other nine **1**;
- negative-space: `NOT_STARTED`;
- saturation: `NOT_SATURATED`;
- Planning C: **BLOCKED**.

## Next explicit research rotation

Continue with **Process & Application Modeling** and explicitly exercise **Process/Application × Workflow × Data/Schema** under the authoritative state. Duplicate-screen against all **119** reusable ConflictPatterns, including compatibility-direction, presence semantics, trust-namespace collapse and cumulative privacy where applicable. Do not enter Planning C.
