# UI / Generated Experience / Low-code Builder — Revisit 4 (Cycle 5)

## Research question
How should Generation 2 model UI projection intent, generated/effective/validated realizations, constrained layout, accessibility, concurrent editing, AI-assisted generation and local/offline interpretation without collapsing generic generated experience into Adaptive Governed Work Surfaces or canonical domain/process authority?

## Representatives and evidence/source ledger
1. **Microsoft Power Apps / Dataverse canvas apps — DEEP.** Canvas source is represented in human-readable `.pa.yaml`; screen and component definitions can participate in source control. Containers create actual layout/logical structure and affect screen-reader traversal, while documented accessibility limitations show that a technically valid composition can still be semantically inaccessible. Sources: Microsoft Learn canvas Git integration, accessible app structure, accessibility limitations and application design guidance, reviewed 2026-09-02.
2. **Mendix Studio Pro — DEEP.** Page Explorer exposes nested structural composition and drag/drop over widgets/building blocks. Fine-grained merge conflict handling distinguishes independent edits from conflicting element/order mutations instead of accepting blind last-write-wins. Sources: Mendix Page Explorer and fine-grained merge algorithm documentation, reviewed 2026-09-02.
3. **ServiceNow UI Builder — DEEP.** Pages are constructed from templates/components, application scope restricts files/data, page variants target audiences at one path, and data resources bind components to Glide/GraphQL/REST-backed data. Variant ordering/audience rules demonstrate effective projection resolution that depends on contextual inputs rather than page identity alone. Sources: ServiceNow UI Builder page/variant/data-resource documentation, Australia release, reviewed 2026-09-02.
4. **Salesforce Lightning App Builder / LWC — DEEP.** Component metadata declares builder targets, configurable properties and supported contexts. Base Lightning components carry accessibility semantics aligned with SLDS/WAI-ARIA guidance. This supports semantic component contracts and target-qualified accessibility rather than arbitrary DOM composition. Sources: Salesforce LWC metadata/targets and base-component accessibility documentation, reviewed 2026-09-02.
5. **Retool — PARTIAL.** Current official documentation presents prompt-generated applications, app builder, workflows, agents, permissions and self-hosting as separate platform capabilities. It is useful as evidence that AI generation and application/runtime governance are separate product concerns, but the reviewed landing documentation is insufficient for deeper concurrency/accessibility claims.
6. **Appsmith — PARTIAL / divergence evidence.** Appsmith explicitly permits drag/drop widgets plus queries and JavaScript against databases/APIs and Git-backed collaboration/rollback. It demonstrates a common low-code mechanism that Generation 2 must not universalize where arbitrary query/script authoring would violate the SB semantic boundary.

## Source of truth, identity and lifecycle
The canonical domain/process/application model remains upstream semantic authority. Generic UI owns a revisioned `ProjectionDefinition` / `ProjectionRevision` whose identity is independent from rendered DOM, generated source, build artifact, runtime deployment or provider.

Cycle-5 lineage must distinguish:

`ProjectionIntentRevision → MaterializationAttempt → AcceptedProjectionRevision → EffectiveProjectionRealization → ValidationEvidence`

A generation attempt can fail; an accepted projection can coexist with an older effective realization; an effective realization can render while accessibility, binding or semantic validation fails. Therefore `attempted`, `accepted`, `effective` and `validated` are separate facts.

## Constrained composition and layout
Portable UI semantics should reference typed semantic component contracts and constrained layout primitives such as slots, regions, containers, grid tracks and responsive rules. Provider-specific DOM/CSS/framework code remains realization detail.

The generic UI capability may expose richer builder freedom than AGWS, but it still must preserve canonical domain references and explicit provider/action bindings. Product mechanisms that allow arbitrary JavaScript, arbitrary SQL or arbitrary DOM/CSS are provider-specific extension mechanisms, not universal SB primitives.

## Semantic binding and incomplete-reference evidence
Bindings from a projection to fields, actions, data capabilities, workflow entry points or external-provider capabilities must be revision/profile qualified. If required schema/component/provider/validator material is missing or stale, dependent validation becomes `INCONCLUSIVE` or explicitly partial; independent checks may continue. Missing references must never be silently deleted/coerced simply to obtain a successful render.

## Concurrent editing, ownership and preconditions
Concurrent projection editing requires expected-base/ownership/precondition evidence over semantic units. Mendix provides concrete evidence that independent element edits can merge while edits to the same element or nearby ordering can require explicit conflict resolution. The SB should therefore avoid universal last-write-wins semantics for page/component/layout mutation.

A merge creates a new revision with provenance and explicit conflict disposition. It does not mutate history. Conflict semantics should be expressed at projection/component/layout units rather than renderer-generated source files where possible.

## Accessibility as semantic conformance
Accessibility is a validation dimension, not a cosmetic post-processing step. Component contracts should declare relevant accessibility semantics/capabilities, while projection validation checks structure, ordering, labels, focus/keyboard semantics and responsive behavior appropriate to the target profile.

Power Apps demonstrates that visual grouping and logical/screen-reader structure can diverge, and documents unsupported/custom interaction patterns. Salesforce base components demonstrate the opposite direction: a component registry can provide accessibility-bearing semantics by construction. Therefore renderer success or component presence does not prove accessible conformance.

Accessibility evidence is revision/profile bound: replacing renderer/component implementation or materially changing structure requires revalidation.

## AI authoring and authority
AI may interpret intent, propose a projection, choose compatible components and materialize generated realization candidates. It does not become the authority for canonical model mutation, policy/authorization change, provider administration or acceptance of its own output.

Generation 2 therefore separates:

`IntentInterpretationAuthority ≠ ProjectionProposalAuthority ≠ MaterializationAuthority ≠ ValidationAuthority ≠ CanonicalDomainMutationAuthority ≠ Publication/PromotionAuthority`.

Deterministic schema/semantic/policy/accessibility validators must be able to reject a plausible AI result. Requests requiring a new canonical field/entity/process/action must produce an escalation/proposal to the owning capability, not a silent UI-local invention.

## Versioning, diff, rollback and failure semantics
Projection lineage must retain semantic diff between revisions and the realization inputs needed to understand effective behavior. Rollback means a new governed transition selecting/re-materializing a prior eligible projection revision; it does not erase later history.

Rollback eligibility depends on retained component contracts, renderer/toolchain/profile compatibility, bindings and policy/authority. If retained material is incomplete, rollback can be unavailable or `INCONCLUSIVE` rather than falsely safe.

Failure classes include generation rejection, missing semantic reference, component-contract mismatch, layout-constraint violation, merge conflict, inaccessible composition, binding/provider unavailable, stale validation, renderer failure, publication denial and rollback ineligibility.

## Provider boundaries, portability and local/offline closure
The semantic projection should survive renderer/build/runtime/provider substitution. Replacing realization infrastructure creates new realization and validation evidence while preserving projection identity unless semantics themselves change.

Qualified local/offline UI interpretation closure consists, by profile, of projection definition/revision, semantic component contracts, layout vocabulary, required schemas/references, deterministic validators, accessibility rules/profiles, authority/policy material required for validation, renderer/materializer dependencies and provenance/trust material. External data/action providers need not be locally owned; unresolved bindings remain explicit and dependent proofs become degraded/`INCONCLUSIVE`.

## Governance and observability
Evidence should identify intent/accepted/effective projection revisions, component-registry/profile revisions, canonical dependency vector, renderer/toolchain realization, binding revisions, validation coverage/freshness and actor/authority facets. Runtime telemetry should correlate semantic projection identity with realization identity without treating telemetry presence as semantic conformance.

## Product-specific mechanism vs universal primitive
**Universal:** projection identity/revision; semantic component contract; constrained layout vocabulary; semantic binding; attempt/accepted/effective/validated lineage; expected-base/ownership preconditions; conflict evidence; accessibility conformance evidence; deterministic validation; provider-neutral realization; qualified local closure.

**Product-specific:** `.pa.yaml`, Power Apps formulas/custom controls, Mendix widget implementation/merge UI, ServiceNow encoded audience queries/application-scope mechanics, Salesforce LWC metadata syntax/SLDS implementation, Retool/Appsmith script/query mechanisms.

## Convergent patterns
- Component metadata/contracts constrain valid placement/targets/configuration.
- Visual output is downstream from a semantic page/component structure and bindings.
- Effective UI can depend on audience/context/profile independently from page identity.
- Source/merge lineage and conflict resolution matter for collaborative mutation.
- Accessibility can depend on structural composition and component semantics, not pixels alone.
- AI/build/render success does not prove semantic, policy or accessibility acceptance.

## Divergent patterns
- Some low-code products intentionally expose arbitrary JavaScript/queries; that freedom is not a universal SB contract.
- Vendor merge, source and packaging formats are implementation-specific.
- Audience variants in current products do not by themselves establish AGWS's monotonic Enterprise → Station → Role → Person authority inheritance.
- Accessibility guarantees range from component-by-construction to author-managed limitations, requiring explicit evidence rather than assumed portability.

## Subcapabilities
Projection identity/revision; semantic component registry; constrained layout/responsive model; semantic data/action binding; collaborative edit/conflict resolution; accessibility conformance; AI proposal/materialization boundary; renderer/provider realization; semantic diff/version/rollback; local/offline interpretation closure; projection observability.

## Comparison with fresh `main`
Two bounded default-branch code searches were executed for proposed projection/component-registry/generated-experience vocabulary. They returned no matches. This is only bounded negative evidence for those exact query terms and is **not** a repository-wide absence claim. Full current-state archaeology remains reserved for `PLANNING_B_SB_CURRENT_STATE_RECONCILIATION`.

## Reconciliation hypotheses
- **GENERALIZE:** projection attempt/accepted/effective/validated lineage as a UI specialization of cycle-5 UCA/PAM realization lineage.
- **HARDEN:** semantic component/layout/binding contracts and deterministic accessibility/semantic validation.
- **GENERALIZE:** expected-base/ownership/conflict evidence for collaborative projection edits.
- **PROVIDERIZE:** DOM/framework/renderer/toolchain and external action/data implementations.
- **INTEGRATE:** validation evidence with unified evidence dependency/freshness primitives; missing upstream material propagates `INCONCLUSIVE`.
- **HARDEN:** diff/rollback as lineage-preserving governed transitions with eligibility evidence.
- **DO_NOT_BUILD:** universal arbitrary HTML/CSS/JavaScript/query authoring as the portable UI primitive.
- **DO_NOT_BUILD:** AI self-approval or silent canonical-domain mutation through generated UI.
- **DEFER:** exact Generation-2 portable component/layout schema until synthesis and target architecture.

## Adaptive Governed Work Surfaces boundary
AGWS remains an explicit distinct capability. Generic UI owns projection/component/layout/binding/materialization/accessibility semantics. AGWS owns effective `Enterprise → Station → Role → Person` composition, mandatory inherited components, Station capability exposure/delegated administration/hierarchical-SB behavior, constrained employee personalization, evidence-based promotion and AI-only materialization under authority escalation.

Generic UI must expose the contracts AGWS consumes, but generic UI cannot weaken superior AGWS invariants. A generic projection may support variants or contextual targeting; that is not equivalent to delegated organizational personalization authority.

## Repo-validation questions
- Does `main` contain a semantic UI/page identity independent from generated files/build artifacts?
- Are component/layout constraints modeled as semantics or only renderer implementation?
- Can validation distinguish attempted, effective and validated projection revisions?
- Are accessibility requirements represented as testable evidence or only presentation conventions?
- Is concurrent edit conflict/expected-base semantics present for generated definitions?
- Can missing bindings/providers produce explicit `INCONCLUSIVE` without deleting semantic references?
- Is AI generation independently validated before publication/materialization?
- Can renderer/provider substitution preserve semantic projection identity?
- Is rollback eligibility tied to retained realization/validator/component dependencies?

## Symbiotic Proof
Start from a canonical `Customer` model and create a projection containing list, form and responsive grid using only registered semantic components. Branch two edits from the same projection revision: one changes component ordering and one mutates the same binding. Demonstrate merge of independent edits and explicit conflict for overlapping mutation. Replace one required provider with an unavailable binding and require dependent checks to become `INCONCLUSIVE` while structural/accessibility checks still run. Have AI propose a nonexistent canonical field; deterministic validation must reject/escalate it. Materialize the same accepted projection through two renderer profiles while preserving semantic identity and producing separate realization/accessibility evidence. Then make the newest renderer inaccessible and prove render success is not validation success. Finally rollback to an eligible prior projection with complete lineage; remove a required component/validator from local closure and prove rollback/local validation becomes unavailable or `INCONCLUSIVE`, never silently broader.

## Stable findings
- **G2-FINDING-UIGX-29 — UI Lineage Must Distinguish Projection Intent, Materialization Attempt, Accepted Revision, Effective Realization and Validated Postcondition.** Rendered/current is not a single trustworthy revision fact.
- **G2-FINDING-UIGX-30 — Constrained Semantic Component/Layout Contracts Must Be Portable Above DOM/CSS/Framework Realizations.** Arbitrary frontend code is an extension mechanism, not the universal projection primitive.
- **G2-FINDING-UIGX-31 — Accessibility Is Revision/Profile-Qualified Semantic Conformance, Not a Consequence of Successful Rendering.** Structural order, roles, labels, focus/keyboard and component behavior require explicit validation evidence.
- **G2-FINDING-UIGX-32 — Concurrent Projection Mutation Requires Expected-Base/Ownership Preconditions and Explicit Conflict Evidence.** Blind last-write-wins can silently corrupt semantic layout/binding intent.
- **G2-FINDING-UIGX-33 — Missing or Ambiguous UI Dependencies Must Propagate PARTIAL/INCONCLUSIVE Evidence Rather Than Be Silently Dropped.** Independent validation obligations may still evaluate.
- **G2-FINDING-UIGX-34 — AI Proposal/Materialization Authority Is Distinct From Deterministic Validation, Publication and Canonical-Domain Mutation Authority.** A generated UI cannot self-authorize semantic expansion.
- **G2-FINDING-UIGX-35 — Renderer/Provider/Topology Substitution Must Preserve Projection Identity While Reissuing Realization and Accessibility/Semantic Evidence.** Provider realization is not semantic UI identity.
- **G2-FINDING-UIGX-36 — UI Rollback Is an Eligibility-Bound Governed Transition Over Retained Semantic and Realization Dependencies.** Historical revision existence alone does not prove safe rollback or local interpretability.

## Candidate register additions
- `G2-CAPABILITY-CANDIDATE-UIGX-ATTEMPT-ACCEPTED-EFFECTIVE-VALIDATED-LINEAGE` — CROSS_CUTTING / MERGE_TARGET; reconcile with UCA/PAM lineage while retaining UI acceptance/accessibility semantics.
- `G2-CAPABILITY-CANDIDATE-UIGX-CONCURRENT-PROJECTION-OWNERSHIP-PRECONDITIONS` — CROSS_CUTTING / CONSOLIDATION_CANDIDATE; reconcile with universal/PAM mutation-precondition primitive.
- `G2-CAPABILITY-CANDIDATE-UIGX-ACCESSIBILITY-CONFORMANCE-EVIDENCE` — CROSS_CUTTING / CANDIDATE; likely UI-specialized proof/evidence contract, not necessarily a macro capability.
- `G2-CAPABILITY-CANDIDATE-UIGX-INCONCLUSIVE-DEPENDENCY-QUALIFICATION` — CROSS_CUTTING / MERGE_TARGET; reconcile with unified evidence dependency/convergence qualification.

No candidate is promoted in this revisit.

## Architecture proof-backfill obligations
1. **Attempt/effective negative proof:** attempt projection B, force materialization/publication failure while A remains effective; evidence must retain attempted=B/effective=A and never claim B validated.
2. **Constrained-layout adversarial proof:** request/generated candidate with arbitrary DOM/CSS/script or layout outside allowed vocabulary; authoritative validator rejects or routes to an explicit extension path.
3. **Accessibility negative proof:** generate a visually correct page with invalid logical order/label/focus/keyboard semantics; render succeeds but accessibility validation fails with revision/profile-bound evidence.
4. **Concurrent edit proof:** two edits from the same base mutate the same binding/order semantic unit; one commit makes the second stale and requires conflict/rebase/authorized resolution rather than overwrite.
5. **Dependency-INCONCLUSIVE proof:** remove a required provider/schema/component/validator; dependent semantic checks become partial/`INCONCLUSIVE` while independent structural checks remain evaluable.
6. **AI-domain-boundary proof:** prompt AI to add a nonexistent canonical entity/field/action solely to satisfy the page; candidate is rejected/escalated and canonical model remains unchanged.
7. **Provider/renderer substitution proof:** realize one accepted projection on two materially different renderer/runtime profiles; semantic projection identity is stable while realization/accessibility evidence differs.
8. **Rollback-eligibility proof:** rollback using retained compatible projection/component/validator material, then remove one prerequisite and prove rollback becomes unavailable/`INCONCLUSIVE`, not falsely safe.
9. **AGWS-boundary proof:** reuse generic UI components inside Personal/Role AGWS overlay and prove generic variant/layout capabilities cannot remove inherited mandatory components or broaden Station authority.
10. **Qualified-local-closure proof:** validate/materialize offline with declared closure; remove one component contract/accessibility rule/trust/validator dependency and require explicit degraded/`INCONCLUSIVE` behavior without online fallback or authority broadening.

## Value / risk / priority / next question
**Value:** very high; generated UI is a primary realization surface and directly affects portability, safe AI authoring and operator trust. **Risk:** severe if visually successful output is mistaken for semantic/accessibility correctness or if low-code freedom becomes a backdoor for domain/policy mutation. **Priority:** high. **Next question:** test the generic UI contracts directly against Adaptive Governed Work Surfaces cycle-5 authority/inheritance/promotion semantics without merging the capabilities.

## Saturation
Material new findings: 8. `consecutive_no_material_finding = 0`. **NOT SATURATED**.