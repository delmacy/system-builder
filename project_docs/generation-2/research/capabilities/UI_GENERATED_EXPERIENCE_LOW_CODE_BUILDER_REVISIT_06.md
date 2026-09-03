# UI / Generated Experience / Low-code Builder — Revisit 6 (Cycle 7)

## Research question
How should Generation 2 qualify generic generated-experience projection, layout, component, renderer and validation claims under cycle-7 applicability/evidence/stability findings, while keeping Adaptive Governed Work Surfaces (AGWS) organizational inheritance and delegated personalization ownership separate?

## Representatives and evidence/source ledger
1. **ServiceNow UI Builder — DEEP.** Pages are built from layouts/components; page variants share a path while audience/conditions determine applicability. Application scope restricts application files/data. Required parameters and data resources feed component bindings. Current Australia docs also distinguish developer editing and custom components from ordinary page composition. Sources: ServiceNow UI Builder pages, variants, experiences, custom components and layout upgrade docs, reviewed 2026-09-03.
2. **Microsoft Power Apps Canvas — DEEP.** Grid and auto-layout containers provide explicit responsive layout primitives; accessibility guidance requires independent checking beyond renderability. The platform also permits formulas/manual layout, showing that a generic low-code product can be more permissive than the SB AGWS hypothesis. Sources: Microsoft Learn Grid Container, Responsive Design Guidelines and Accessible Canvas Apps, reviewed 2026-09-03.
3. **Salesforce Lightning / App Builder — DEEP.** `lightning-layout` is a responsive grid; component configuration exposes target/form-factor properties; record forms bind to existing object fields. Target/container support and offline availability vary by component/profile. Sources: Salesforce Lightning Layout, App Builder tips, Record Form/View Form and Tabset docs, reviewed 2026-09-03.
4. **Appsmith — DEEP adversarial cross-check.** Drag/drop widgets, datasource/API connections, arbitrary queries/JavaScript, Git branches and rollback demonstrate strong low-code composition but also a deliberate authority surface broader than AGWS should grant ordinary employees. Source: Appsmith documentation introduction, reviewed 2026-09-03.
5. **Retool — DEEP product-family cross-check.** Current docs expose app building, AI app generation, workflows, agents, permissions, spaces and self-hosting as distinct platform capabilities. This is useful evidence that generated UI, automation and governance are related but should not be collapsed into one semantic capability. Source: Retool Docs, reviewed 2026-09-03.

## Source of truth, identity and lifecycle
Generic UI owns projection/component/layout/binding intent. Canonical domain/process/application semantics remain upstream. AGWS owns organizational inheritance/personalization authority. Provider renderers own realization mechanics, not canonical projection meaning.

Typed identities remain distinct: `ProjectionSemanticIdentity`, `ProjectionRepresentationIdentity`, `ComponentContractIdentity`, `LayoutContractIdentity`, `BindingIntentIdentity`, `RendererProfileIdentity`, `EffectiveRealizationIdentity`, `ValidationEvidenceIdentity`.

Lifecycle is append/supersede rather than destructive replacement:
`Intent → MaterializationAttempt → AcceptedProjectionRevision → PublishedRealization → ValidationEvidence → Supersession/Drainage`.
A representation or renderer migration can preserve semantic projection identity while producing new realization and validation identities.

## Applicability-scoped projection claims
A projection/component claim is not globally true. Applicability is qualified by target/container/form factor, audience/context, schema/model revision, component/renderer profile, accessibility profile and policy/trust scope. ServiceNow variants make this concrete: the same route can resolve different variants by audience and conditions. Salesforce likewise exposes target/form-factor constraints.

Therefore Generation 2 needs explicit `ProjectionClaimApplicability` rather than inferring applicability from successful publication or component existence.

## Evidence retention and replay horizon
Validation evidence can outlive its replayable inputs, or inputs/history may be compacted while a historical claim remains valid for its recorded scope. Generic UI proof must record enough material/provenance to identify what was validated and an evidence-retention/replay horizon. If renderer/component/schema/policy inputs can no longer be reconstructed, historical evidence becomes non-replayable, not retroactively false.

## Relational conformance
Conformance is a relation:
`Conforms(subjectRevision, normativeProfileRevision, evaluatorRevision, scope, evidence)`.
Render success is not accessibility conformance; component availability is not target support; binding resolution is not authorization; source integrity is not semantic correctness. Microsoft explicitly provides an Accessibility Checker in addition to layout/rendering guidance, while Salesforce documents target/form-factor support separately from component identity.

## Mixed stability/support vector
Generated experiences contain independently evolving surfaces: projection schema, component contracts, renderer/runtime, layout engine, accessibility rules, provider bindings and target/container profiles. ServiceNow's layout-system migration can change container structure/positioning while leaving data/components/styling largely intact, demonstrating that one release-wide `stable` flag is too coarse.

Support must therefore be a typed vector over surfaces and target profiles.

## Semantic continuity and dual representation
During renderer/layout/component migration, old and new representations may coexist. ServiceNow layout upgrades preserve components/data while migrating slot/container structure and may require manual correction of visual misalignment. Generation 2 should preserve semantic continuity through explicit old→new mappings and keep both realizations qualified until affected consumer/device/Station cohorts are drained or revalidated.

A migration is not closed merely because the new representation was generated.

## Integrity versus semantic/accessibility validity
Content digest/source integrity can prove exact representation bytes. It cannot prove that references resolve, layout is usable, component target support exists, accessibility criteria hold, bindings are authorized or rendered behavior preserves semantic intent. Integrity evidence is intentionally narrow and must not be promoted into a generic UI-conformance claim.

## Layout and extensibility boundary
Power Apps, ServiceNow and Salesforce converge on containers/grids/components as useful composition primitives, but Appsmith shows that low-code products may intentionally permit arbitrary queries/JavaScript. That freedom is product-specific, not a universal primitive.

Generic UI may support extension points, custom renderers and developer-authored components. AGWS ordinary-person editing must remain more constrained: no arbitrary HTML/CSS/JS/query/schema/domain mutation, and AI remains the sole materializer of employee intent.

## Provider boundaries and portability
Renderer/framework/container-specific code, custom components, platform data adapters and arbitrary scripts are provider/extension mechanisms. Portable claims are layered: `PRESERVE → INTERPRET → VALIDATE → REALIZE → ACTUATE`. Provider substitution preserves semantic identity only when mappings are explicit and new target/accessibility/binding proofs are issued.

## Failure semantics
Material states include `PARSE_FAILED`, `REFERENCE_UNRESOLVED`, `TARGET_UNSUPPORTED`, `LAYOUT_PROFILE_INCOMPATIBLE`, `ACCESSIBILITY_NONCONFORMANT`, `BINDING_UNRESOLVED`, `AUTHORITY_DENIED`, `PUBLICATION_FAILED`, `OUTCOME_UNKNOWN`, `EVIDENCE_STALE`, `EVIDENCE_NON_REPLAYABLE`, `DUAL_REPRESENTATION_NOT_DRAINED`, and `RECONNECT_REQUALIFICATION_REQUIRED`.

## Governance, observability and qualified local/offline closure
Evidence must bind semantic projection, component/layout/binding, renderer, target, accessibility, policy/trust and evaluator revisions. Telemetry can prove use/coverage and identify residual cohorts but cannot substitute for conformance.

A local/offline rendering closure must contain the projection semantics/representation, component/layout contracts, required model/schema references, renderer/runtime material, binding descriptors, validators, accessibility profile and trust/policy material. Reconnection after relevant epoch changes requires requalification.

## Adaptive Governed Work Surfaces boundary
AGWS remains a distinct promoted capability. Generic UI supplies projection/component/layout/binding/renderer primitives; AGWS owns `Enterprise → Station → Role → Person`, mandatory inherited components, capability exposure, delegated Station administration, constrained personalization, governed promotion/reset/rollback and AI-only materialization.

ServiceNow audience variants are useful projection-selection evidence but are not sufficient semantics for hierarchical non-weakenable inheritance. Appsmith's arbitrary query/JavaScript capability is specifically an adversarial example of freedom AGWS ordinary users must not inherit.

The nine mandatory AGWS proofs remain unchanged and are not claimed satisfied by this generic-UI dossier.

## Product-specific mechanisms vs universal primitives
Universal: typed semantic projection/component/layout/binding identities; applicability; revision-qualified conformance; support vectors; semantic-continuity mappings; evidence horizons; layered portability; explicit provider realization.

Product-specific/providerized: ServiceNow page-variant records/application scope/layout engine; Power Apps formulas/grid implementation; Salesforce LWC targets/SLDS; Appsmith JavaScript/query editor; Retool proprietary app/agent/workflow surfaces.

## Convergent/divergent patterns and subcapabilities
Convergent: component registries, structured layouts/containers, responsive profiles, contextual/target applicability, data bindings, separate publication/runtime state, provider-specific realization.

Divergent: amount of arbitrary code/query freedom; version-control model; audience/variant semantics; accessibility enforcement; renderer portability; extension governance.

Subcapabilities: semantic projection, component registry/contracts, layout contracts, responsive/target profiles, binding intent, renderer realization, accessibility/semantic validation, publication/version lineage, provider substitution, local/offline rendering closure.

## Reconciliation hypotheses
- **GENERALIZE:** applicability-scoped projection claims into UCA claim graph.
- **GENERALIZE:** evidence-retention/replay horizon into evidence/provenance primitives.
- **HARDEN:** revision-qualified relational UI/accessibility conformance.
- **GENERALIZE:** mixed stability/support vectors across independently evolving UI surfaces.
- **HARDEN:** dual-representation semantic continuity plus consumer/device/Station drainage.
- **HARDEN:** narrow integrity claims; never infer semantic/accessibility validity from digest/source equality.
- **HARDEN:** append/supersede projection lineage.
- **PROVIDERIZE:** renderer/layout-engine/framework-specific realization and custom code.
- **DO_NOT_BUILD:** arbitrary employee HTML/CSS/JS/query/schema mutation as AGWS personalization.
- **DO_NOT_BUILD:** generic UI audience/variant selection as a substitute for AGWS hierarchical authority.

## Repository-validation questions
- Does fresh `main` distinguish projection semantic identity from representation, component/layout contract and renderer realization identities?
- Can UI claims carry explicit applicability by target/profile/Station/Role rather than global booleans?
- Does validation evidence record evaluator/profile/revisions and retention/replayability?
- Are component/layout/renderer stability guarantees independently versioned?
- Can renderer/layout migration maintain dual representations and prove residual cohort drainage?
- Is source/digest integrity kept separate from semantic/accessibility validation?
- Is projection history append/supersede rather than destructive mutation?
- Can provider substitution preserve semantic projection identity while requiring fresh realization evidence?
- Can offline/local rendering declare a qualified closure and requalify after reconnect?
- Is generic UI prevented from absorbing AGWS mandatory-component/delegated-administration ownership?

## Symbiotic Proof
Create one semantic projection over an existing canonical entity and materialize it through two renderer/layout profiles. Keep semantic identity stable while representation, renderer and realization identities differ. Qualify each realization for explicit target/form-factor/accessibility profiles. Preserve the exact source bytes of one realization and deliberately break an accessibility ordering rule: integrity remains PASS while semantic/accessibility conformance fails. Migrate the layout engine using dual representation; retain old realization for one offline Station cohort and do not close migration until usage/reconnect evidence proves drainage or requalification. Expire replay material for an older validation while retaining its historical claim as `VALID_AT_RECORDED_SCOPE / NON_REPLAYABLE`. Attempt provider substitution with one unsupported component and report `PRESERVE/INTERPRET` success but `VALIDATE/REALIZE` failure. Finally, through an AGWS surface ask AI to add a valid existing component, then ask it to create a canonical field, inject arbitrary JavaScript and remove a mandatory higher-layer component: only the first request may materialize without authority escalation.

## Stable findings
- **G2-FINDING-UIGX-45 — Generated-UI Claims Require Explicit Applicability Across Target, Audience/Context, Model, Component, Renderer, Accessibility and Policy Scopes.** Publication or component existence does not make a projection globally applicable.
- **G2-FINDING-UIGX-46 — UI Validation Evidence Has a Retention/Replay Horizon Independent of Historical Claim Validity.** Loss of replay material yields non-replayable evidence, not retroactive falsification.
- **G2-FINDING-UIGX-47 — Generated-UI Conformance Is a Revision-Qualified Relation.** Subject, normative profile, evaluator, scope and evidence revisions must be identified; render success cannot self-prove accessibility or semantic validity.
- **G2-FINDING-UIGX-48 — Generated Experience Stability and Support Are Typed Surface Vectors.** Projection, component, layout, renderer, accessibility and target surfaces evolve independently and cannot share one release-wide stability scalar.
- **G2-FINDING-UIGX-49 — Renderer/Layout Migration Requires Semantic-Continuity Mapping and Dual-Representation Consumer Drainage.** New generation success does not close migration while old device/Station cohorts remain effective.
- **G2-FINDING-UIGX-50 — Representation Integrity Is a Narrow Claim and Does Not Establish Semantic, Accessibility, Binding or Authority Validity.** Exact bytes can still realize an invalid experience.
- **G2-FINDING-UIGX-51 — Projection History Is Append/Supersede Lineage; Representation or Renderer Replacement Must Not Rewrite Historical Semantic Claims.** Historical realization/evidence remains attributable to its original applicability.
- **G2-FINDING-UIGX-52 — Generic Low-code Extensibility Must Not Amplify AGWS Authoring Authority.** Arbitrary code/query mechanisms may exist for authorized developers/providers but ordinary `Enterprise → Station → Role → Person` personalization remains constrained and AI-materialized.

## Candidate register additions
- `G2-CAPABILITY-CANDIDATE-UIGX-APPLICABILITY-SCOPED-PROJECTION-CLAIM` — CROSS_CUTTING / CONSOLIDATION_CANDIDATE.
- `G2-CAPABILITY-CANDIDATE-UIGX-UI-EVIDENCE-RETENTION-REPLAY-HORIZON` — CROSS_CUTTING / CONSOLIDATION_CANDIDATE.
- `G2-CAPABILITY-CANDIDATE-UIGX-MIXED-UI-SURFACE-STABILITY-SUPPORT` — CROSS_CUTTING / CONSOLIDATION_CANDIDATE.
- `G2-CAPABILITY-CANDIDATE-UIGX-DUAL-REPRESENTATION-CONSUMER-DRAINAGE-CLOSURE` — CROSS_CUTTING / CONSOLIDATION_CANDIDATE.

No candidate is promoted. AGWS remains promoted and distinct.

## Architecture proof-backfill obligations
1. Applicability mismatch must reject a projection proof outside target/audience/Station/profile scope.
2. Historical validation whose replay material expired remains attributable but is marked non-replayable.
3. Same bytes with a deliberately invalid accessibility structure prove integrity PASS and conformance FAIL can coexist.
4. Evidence from evaluator/profile R1 cannot qualify realization R2 without compatibility proof.
5. Independently advance component/layout/renderer profiles and report a mixed support vector.
6. Dual-run old/new layout representations and require residual cohort drainage before migration closure.
7. Provider substitution with unsupported target capability must preserve lower-layer portability while failing higher-layer realization/conformance.
8. Offline Station reconnect after policy/component/accessibility epoch changes requires requalification.
9. Generic low-code arbitrary-code capability must not be inherited by AGWS ordinary-person authoring.
10. AI request for canonical schema/domain mutation or removal of mandatory inherited component must escalate/reject.

## Value / risk / priority / next question
**Value:** very high. The model now separates projection truth from applicability, evidence replayability, renderer support and organizational authority. **Risk:** severe if publication/render success becomes a global semantic claim or low-code extensibility leaks into employee authority. **Priority:** high. **Next question:** apply these generic primitives to AGWS itself and test whether hierarchical overlays, mandatory components, promotion and delegated Station boundaries can preserve them without ownership collapse.

## Saturation
Material new findings: 8. `consecutive_no_material_finding = 0`. **NOT SATURATED**.