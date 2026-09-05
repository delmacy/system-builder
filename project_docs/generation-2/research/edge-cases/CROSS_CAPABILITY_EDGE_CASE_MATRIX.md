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
| Enterprise Trust/PKI × Identity × Artifact/Release × provider substitution | **materially deepened later by `G2-EDGE-TRUST-008`; streak reset 1→0** |
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

Duplicate-screen: capability-specific manifestation of `G2-CONFLICT-PATTERN-PRESENCE-SEMANTICS-001`; no new cross ID or reusable pattern.

### `G2-EDGE-TRUST-008` / `G2-CONFLICT-PATTERN-TRUST-NAMESPACE-COLLAPSE-001` — trust partition × identity/artifact/provider namespace

Origin: `ENTERPRISE_TRUST_PKI_CERTIFICATE_LIFECYCLE_FULL_PASS_3_REVISIT.md`.

Cross-capability surfaces: Enterprise Trust/PKI × Identity/Federation × Artifact/Release signing trust × Provider/Binding × Standards/Interoperability × Authorization/Organization.

Material interaction: two trust bundles or anchor sets can each be correct for their own independently governed trust domain while a union/import/provider-consolidation/federation layer loses the domain→bundle ownership boundary. The resulting validator can accept a credential or signed subject from domain B in a relying namespace intended for domain A even though neither source owner granted that cross-domain authority. The risk therefore exists before downstream business authorization and cannot be reduced to `valid certificate != authorization` alone.

Evidence anchor: SPIFFE Federation explicitly states that bundles from different trust domains must not be merged because doing so could allow one trust domain to forge identities belonging to another in the eyes of the validator using the unified bundle. RFC 5280 independently reinforces that path validation is trust-anchor-input scoped and that name constraints only constrain the name forms they cover.

Detection route: trust-domain ownership/partition graph; relying-namespace→qualified-bundle/anchor relation; federation/provider mapping lineage; static union/broadening checks; pre-use trust relation qualification; runtime/audit comparison of accepted subject domain and actual trust path. A detector signal remains a signal until concrete activation evidence exists.

Owner route: Enterprise Trust/PKI primary semantic owner; Identity/Federation and Authorization/Organization for downstream claims; Provider/Binding and Standards for realization/profile mapping.

False-positive control: shared roots, cross-signing, deliberate federation or enterprise-wide trust can be legitimate when the broader relation is explicitly owner-qualified. The pattern rejects inferred widening, not explicit governed trust.

Disposition: `CATALOGUE + CLASSIFY + DETECTION_CANDIDATE + FUTURE_REMEDIATION_ROUTE`. No `ConflictInstance` and no remediation implementation. Research-only preventive invariant candidate: trust-material composition must not widen namespace/authority merely through set union, import, provider co-location or representational compatibility.

Cluster effect: `Enterprise Trust/PKI × Identity × Artifact/Release × provider substitution` streak reset **1→0**. `Provider/Binding × external realizations` remains **2** because provider substitution is an activation surface rather than the semantic owner; its next explicit revisit must challenge the new pattern.

### `G2-EDGE-PRIVACY-008` / `G2-CONFLICT-PATTERN-CUMULATIVE-PRIVACY-001` — privacy exposure emerges from release/query/inference composition

Origin: `PRIVACY_DATA_GOVERNANCE_RETENTION_LEGAL_HOLD_RESIDENCY_FULL_PASS_3_REVISIT.md`.

Cross-capability surfaces: Privacy / Data Governance × Data/Schema/analytics × Authorization/Policy/Governance × Process/external sharing × AI/low-code composition.

Material interaction: two or more datasets, query outputs, views, aggregates, pseudonymous releases, derived features or model outputs can each be valid under their own current purpose/access/privacy assessment while their combination gives the same recipient/system/agent materially greater identifying or inferential power. Where an explicitly differential-privacy mechanism applies, individually valid analyses can also consume an aggregate privacy-loss budget whose cumulative bound cannot be established by evaluating each analysis in isolation.

Why this is distinct: the source owners can be locally correct; subject identities can be unambiguous; representations and trust relations can remain correct; and there need be no policy-revision drift. The unsafe or inconclusive property emerges only at the N-wise/history/recipient-context join. Therefore this is not subsumed by purpose-use, identity-linkage, presence-semantics, resource-boundedness or trust-namespace families.

Detection route: release/query/derivation lineage; recipient/view-context graph; reasonably available auxiliary-data inventory; linkability/mosaic analysis; cumulative output history; derived/inferred-data classification and composition-level purpose/use qualification; AI/low-code plan-delta analysis for generated joins/inferences; differential-privacy composition/privacy-budget accounting only where DP semantics are explicitly applicable. A signal does not establish a `ConfirmedConflict` without owner/context evidence that the aggregate exposure is materially incompatible.

Owner route: Privacy / Data Governance primary; relevant Data/Schema/analytics owners; Authorization/Governance/policy owners; process/external-sharing owner; AI authority/plan owner where applicable.

False-positive control: theoretical joinability alone is insufficient; combination may be deliberately owner-qualified; recipient holdings and auxiliary information must be contextually meaningful; differential-privacy budget semantics are mechanism-specific and are not promoted into a generic legal rule.

Disposition: `CATALOGUE + CLASSIFY + DETECTION_CANDIDATE + FUTURE_REMEDIATION_ROUTE`. No `ConflictInstance`, no automatic guard and no remediation implementation.

Cluster effect: no mandatory-cluster streak changes. `Data/Schema × Privacy × Storage × Lifecycle` remains **1** because this local cross-cutting finding is not fabricated into a second explicit cluster revisit.

## Current campaign state

- completed full passes: **2/8 minimum**; target **12**, no maximum;
- active full pass: **3**;
- Full Pass 3 cluster coverage: **12/12**;
- Full Pass 3 capability coverage: **21/28**;
- material edge scenarios: **283**;
- reusable ConflictPatterns: **118**;
- combined material findings: **401**;
- HIGH/CRITICAL without owner/proof/detection route: **0**;
- local streaks reset by current material chain: UCA **0**, UI **0**, Integration **0**, Enterprise Trust/PKI **0**, Privacy **0**;
- mandatory cluster streaks: Identity/Authorization/Station/AGWS/AI **2**; Provider/Binding/external realizations **2**; Enterprise Trust/PKI × Identity × Artifact/Release × provider substitution **0**; all other nine **1**;
- negative-space: `NOT_STARTED`;
- saturation: `NOT_SATURATED`;
- Planning C: **BLOCKED**.

## Next explicit research rotation

Continue locally with **Notifications / Events / Messaging** under the authoritative state. Duplicate-screen against all **118** reusable patterns, including cumulative privacy where event history, recipient fan-out or derived notifications aggregate knowledge. Do not enter Planning C.