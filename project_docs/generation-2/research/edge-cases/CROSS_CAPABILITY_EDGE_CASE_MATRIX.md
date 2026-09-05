# Generation 2 — Cross-Capability Edge-Case Matrix

Status: ACTIVE
Phase: `RESEARCH_ADVERSARIAL_EDGE_CASE_SATURATION`

This matrix indexes detailed per-capability registers and explicit mandatory-cluster revisits. It does not assert `ConflictInstance`s or authorize remediation. Preserve `ConflictPattern != ConflictInstance`, `Signal != ConfirmedConflict`, qualified evidence/currentness, provider IDs as non-canonical, `Enterprise → Station → Role → Person`, AI/AGWS non-amplification and `UNKNOWN → reconcile-before-retry`.

## Mandatory cluster rotation — Full Pass 1

All 12 mandatory clusters were challenged in Full Pass 1. Full-Pass-1 detailed registers remain authoritative historical evidence.

## Full Pass 2 — completed mandatory-cluster revisits

Full Pass 2 completed **28/28 capabilities and 12/12 mandatory clusters**. It ended with cluster streak 1 for `Identity × Authorization × Station × AGWS × AI` and `Provider/Binding × external realizations`; all other mandatory cluster streaks were 0. Detailed Pass-2 dossiers remain authoritative for material scenarios and owner/detection/proof fields.

## Full Pass 3 — mandatory-cluster revisits complete

| Cluster | Pass-3 result / streak |
| --- | --- |
| Identity × Authorization × Station × AGWS × AI | no new; streak **2** |
| Process/Application × Workflow × Data/Schema | no new; streak **1** |
| Workflow × Integration × Messaging × external mutation | no new; streak **1** |
| Data/Schema × Privacy × Storage × Lifecycle | no new; streak **1** |
| Provider/Binding × external realizations | no new; streak **2** |
| Secrets/Config × Runtime × Provider substitution | no new; streak **1** |
| Build × Artifact/Release × Deployment × Runtime | no new; streak **1** |
| Enterprise Trust/PKI × Identity × Artifact/Release × provider substitution | no new; streak **1** |
| Observability × Security/Recovery × runtime truth | no new; streak **1** |
| Extension/Plugin × authority × provider trust × lifecycle | no new; streak **1** |
| Commercial Metering × Entitlements × Rating × Billing × Payment | no new; streak **1** |
| Mathematical Expressions × Workflow × Data × UI/Form × Commercial/FinOps | no new; streak **1** |

## Cross-cutting interaction additions discovered during local rotation

### `G2-CONFLICT-PATTERN-PRESENCE-SEMANTICS-001`

Origin: `UNIVERSAL_CAPABILITY_ARCHITECTURE_FULL_PASS_3_REVISIT.md`. Cross-capability surfaces include UCA × Data/Schema × UI × Workflow × Integration × Standards × Provider/Binding × Authorization/Policy × AI/low-code. Otherwise valid components can disagree on whether absence, explicit default, `null`, `UNKNOWN`, `NOT_APPLICABLE`, redaction or delete are values, lack of values or mutation operators. Detection candidates: presence-state compatibility matrix, schema/profile/operator revision comparison, round-trip semantic diff, default-injection mutation testing and raw-to-normalized provenance. Disposition remains research-only catalogue/classification/detection/future route.

### `G2-EDGE-UI-011`

A human can validly see/confirm value A; serialization omits it; a downstream owner validly interprets absence/default as B. This maps to the presence-semantics pattern and does not create a new mandatory cluster or reusable pattern.

### `G2-EDGE-INTEGRATION-008` — connector translation × presence/operator semantics

Origin: `INTEGRATION_AUTOMATION_FULL_PASS_3_REVISIT.md`.

Cross-capability surfaces: Integration & Automation × UCA × Data/Schema × Standards/Interoperability × Provider/Binding × Workflow/Process × AI/low-code.

Material interaction: a source automation can validly mean “preserve/no assertion”, “explicit null”, “default” or “delete”; a connector/profile can validly collapse/translate that representation; and the target owner can validly assign a different mutation operator to the translated state. The composed chain can therefore mutate a business fact differently from originating intent while each local contract remains internally valid.

Detection route: source→canonical→provider presence-state compatibility matrix, round-trip semantic differential, omission/null/delete mutation fixtures, profile/revision qualification and intended-operator versus effective-operator comparison. Owner route: Integration for faithful intent/translation lineage; producing/consuming semantic owners for field meaning; Standards/Provider owners for representation realization; Workflow/Process where the field controls transition/effect. A mismatch is a `Signal`, not a `ConfirmedConflict`.

Duplicate-screen: capability-specific manifestation of `G2-CONFLICT-PATTERN-PRESENCE-SEMANTICS-001`; no new cross ID or 117th pattern. Mandatory-cluster streaks remain unchanged because this was a local rotation.

## Current campaign state

- completed full passes: **2/8 minimum**; target **12**, no maximum;
- active full pass: **3**;
- Full Pass 3 cluster coverage: **12/12**;
- Full Pass 3 capability coverage: **15/28**;
- material edge scenarios: **281**;
- reusable ConflictPatterns: **116**;
- combined material findings: **397**;
- HIGH/CRITICAL without owner/proof/detection route: **0**;
- Integration local streak: **0** after `G2-EDGE-INTEGRATION-008`;
- mandatory cluster streaks unchanged: Identity/Authorization/Station/AGWS/AI **2**; Provider/Binding/external realizations **2**; other ten **1**;
- negative-space: `NOT_STARTED`;
- saturation: `NOT_SATURATED`;
- Planning C: **BLOCKED**.

## Next explicit research rotation

Continue locally with **Identity / Authentication / Federation** under the authoritative state. Duplicate-screen against all 116 reusable patterns and do not enter Planning C.