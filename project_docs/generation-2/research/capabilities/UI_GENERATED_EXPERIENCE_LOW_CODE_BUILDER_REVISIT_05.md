# UI / Generated Experience / Low-code Builder — Revisit 5 (Cycle 6)

## Research question
How should Generation 2 refine generic generated-experience identity, revision, validation, portability and AI materialization after the cycle-6 UCA/Process findings, without absorbing Adaptive Governed Work Surfaces governance or confusing renderability with semantic/accessibility correctness?

## Representatives and evidence/source ledger
1. **JSON Forms — DEEP.** Its core is UI-technology-independent; JSON Schema, UI Schema, data, renderer registry and cells are separate inputs, with React/Angular/Vue and multiple renderer sets. Custom renderer replacement demonstrates provider/renderer substitution over a retained semantic/UI-schema layer. Sources: JSON Forms Architecture, Renderer Sets, React Integration and Custom Renderers, reviewed 2026-09-03.
2. **Microsoft Power Apps canvas source/Git integration — DEEP.** Published canvas apps expose human-readable `.pa.yaml` for app/screens/components; changes are not available to Git integration until publication. Unsupported direct edits can make apps fail to load. This separates representation/source revision, publication/effective state and valid realization. Sources: Microsoft Learn source control/source files, reviewed 2026-09-03.
3. **ServiceNow UI Builder — DEEP.** Pages/variants, audience conditions, required/optional URL parameters, inherited/local data resources, context bindings and provider-specific Glide/GraphQL/REST resources demonstrate contextual projection resolution and data-provider bindings that are not equivalent to canonical authority. Australia documentation updated March 2026.
4. **Salesforce Lightning Web Components / App Builder — DEEP.** Component metadata declares target-qualified availability/properties; base components carry accessibility semantics, while documented container differences and platform dependencies show that a component can be semantically known yet unsupported in a target/runtime. Sources: LWC Targets, Supported App Containers and Accessibility, reviewed 2026-09-03.
5. **Mendix Studio Pro version control — DEEP adversarial cross-check.** Model merges can be automatic or conflict; same-document/property conflicts require explicit resolution. Successful merge produces a revision but does not establish whole-application semantic/accessibility correctness.
6. **W3C WCAG 2.2 — DEEP standard cross-check.** Accessibility conformance depends on testable success criteria rather than visual/render success; WCAG 2.2 is also ISO/IEC 40500:2025.

## Refined primitives
Cycle 6 requires typed identities rather than one UI version:

`ProjectionSemanticIdentity` — owned by generic UI semantics.
`ProjectionRepresentationIdentity` — source/serialized representation such as YAML/JSON/UI-schema.
`ComponentContractIdentity` — semantic component contract and target/profile declarations.
`RendererProviderIdentity` — renderer/runtime implementation.
`EffectiveProjectionRealizationIdentity` — realized instance/build/runtime output.

Continuity mappings are explicit. A provider or renderer identity may legitimately change while projection semantic identity remains stable.

The effective revision is a vector, not one scalar:

`<projectionRevision, model/schemaRevision, componentRegistryRevision, bindingRevision, rendererProfileRevision, accessibilityProfileRevision, policy/trustRevision>`.

## Source of truth and lifecycle
Canonical domain/process/application semantics remain upstream authority. Generic UI owns projection semantics and component/layout/binding intent, not domain mutation. Representation files are evidence/materialization inputs, not the sole semantic owner.

Lifecycle remains:
`Intent → MaterializationAttempt → AcceptedProjectionRevision → Published/EffectiveRealization → ValidationEvidence`.

Power Apps provides direct operational evidence that editable/saved/source state and published availability are distinct; Generation 2 must preserve that distinction generically.

## Conflict-free composition versus semantic conformance
Mendix proves that merge/conflict resolution is its own lifecycle concern. Cycle-6 refinement is stronger: a conflict-free merge or syntactically valid UI-schema composition does **not** prove that references resolve, target/container support exists, accessibility obligations are satisfied, or provider bindings are authorized.

Therefore merge evidence and semantic/accessibility/realization validation evidence are independent and must be joined before a composite proof can become conclusive.

## Composite proof compatibility
A projection proof is valid only when required evidence qualifies compatible revisions/scopes. A WCAG/accessibility result for renderer profile R1 cannot silently qualify R2; a schema validation against S1 cannot qualify a projection whose binding now targets S2; a target-support claim for one Salesforce container cannot prove another.

Required evidence with incompatible revision/profile/scope yields `INCONCLUSIVE`, not false PASS.

## Context provenance without authority
ServiceNow context bindings, URL parameters, client state and page audiences show legitimate contextual projection selection. These values can shape what is displayed, but contextual propagation is not by itself authorization or canonical mutation authority. Context must retain provenance and be intersected with independently resolved authority/policy.

Generic contextual variants must not be generalized into AGWS delegated organizational authority.

## Portability layering
JSON Forms provides unusually clean evidence for layered portability. The same schema/UI-schema concepts can be preserved and interpreted while renderer sets differ, and feature support varies by renderer. Salesforce similarly documents target/container-specific component support.

Generation 2 should therefore report UI portability as distinct claims:
1. `PRESERVE/TRANSPORT` projection and component semantics;
2. `INTERPRET` them under a target profile;
3. `VALIDATE` semantic/accessibility/binding obligations;
4. `REALIZE` them through a renderer/runtime;
5. `ACTUATE` data/actions under independent authority.

Success at a lower layer cannot imply success at a higher layer.

## Failure semantics
Material failure states include representation parse failure, unresolved semantic reference, component target incompatibility, renderer feature gap, binding/provider mismatch, stale or incompatible accessibility evidence, merge conflict, semantic-invalid conflict-free merge, publication failure, `OUTCOME_UNKNOWN` publication/realization, unauthorized action binding, stale context/policy and reconnection-invalidated local evidence.

## Qualified local closure and reconnection
Local rendering/validation closure is profile-qualified and contains projection semantics, representation, component contracts, schema/model references, binding descriptors, renderer/runtime dependencies, deterministic validators, accessibility profile/rules, policy/trust material and provenance.

Its evidence has a horizon. If policy/trust/component/schema/provider/accessibility profile advances while disconnected, the local result remains historically valid for its recorded closure but cannot automatically qualify current connected state. Reconnection triggers compatibility/freshness requalification.

## AI materialization boundary
AI may transform intent into projection candidates or representation files, choose compatible registered components and propose bindings. It may not self-validate, create canonical domain semantics, grant authority, redefine AGWS inheritance or silently downgrade accessibility/target constraints. Deterministic semantic, target, policy and accessibility validators remain independent authorities.

## Provider boundaries, extensibility and lock-in
Renderer/framework-specific code, custom renderers, platform data adapters, proprietary target metadata and arbitrary scripts remain provider/extension mechanisms. Universal SB primitives remain semantic projection/component/layout/binding contracts and explicit realization mappings.

JSON Forms demonstrates that renderer replacement is feasible without making renderer identity canonical. Salesforce demonstrates that provider independence is not automatically feature parity; target support must be explicitly proven.

## Governance and observability
Evidence must carry the full effective revision vector, attempted/accepted/effective/validated lineage, context provenance, target/container profile, renderer/provider identity, accessibility coverage, validation freshness and authority/policy revision. Runtime telemetry can correlate semantic and realization identities but cannot substitute for conformance proof.

## Adaptive Governed Work Surfaces boundary
Adaptive Governed Work Surfaces remains promoted and distinct. Generic UI supplies semantic components/projections/layout/bindings/renderers. AGWS owns `Enterprise → Station → Role → Person`, mandatory inherited components, bounded capability exposure, delegated Station administration, constrained personalization, governed promotion and AI-only materialization under escalation. Generic UI context/variant mechanisms cannot weaken or replace these invariants.

## Reconciliation hypotheses
- **GENERALIZE:** typed projection/representation/component/renderer/realization identity continuity into UCA typed identity mappings.
- **GENERALIZE:** multi-axis UI revision vector into Lifecycle/UCA revision-vector family.
- **HARDEN:** semantic/accessibility validation after conflict-free composition.
- **INTEGRATE:** composite proof compatibility joins with UCA evidence qualification.
- **GENERALIZE:** propagated UI context as provenance/non-authoritative context.
- **GENERALIZE:** preserve/interpret/validate/realize/actuate portability layering.
- **HARDEN:** qualified local rendering/validation closure with evidence horizon and reconnection requalification.
- **PROVIDERIZE:** renderer/framework/container-specific realization, target metadata and custom scripts.
- **DO_NOT_BUILD:** generic UI variants as a substitute for AGWS organizational authority.
- **DO_NOT_BUILD:** AI self-approval or silent canonical-domain/accessibility-policy mutation.

## Repo-validation questions
- Does `main` already distinguish semantic projection IDs from representation/generated-source IDs and renderer/runtime IDs?
- Are component contracts target/profile qualified or renderer-specific only?
- Can effective UI state be represented as a revision vector rather than a scalar version?
- Is merge success independently followed by semantic/accessibility validation?
- Does evidence identify schema/component/renderer/accessibility revisions it qualifies?
- Are propagated UI/context values separated from policy/authority resolution?
- Can portability be reported per preserve/interpret/validate/realize/actuate layer?
- Can local/offline validation record a closure horizon and require reconnection requalification?
- Can renderer/provider substitution preserve projection semantic identity while reissuing proof?
- Can AI materialization be rejected deterministically without mutating canonical domain semantics?

## Symbiotic Proof
Take one canonical Customer application model and one semantic projection. Serialize it to a source representation, materialize with two renderer sets and keep the semantic projection identity stable while representation/renderer/realization identities differ. Introduce a second branch that merges without textual/model conflict but references a component unsupported by renderer B and violates an accessibility ordering rule: merge succeeds, composite validation does not. Change only schema/binding revision and prove old accessibility/semantic evidence cannot be joined as current where dependency compatibility is broken. Feed user/session context that requests a broader action and prove context changes projection selection but cannot create authorization. Disconnect with a declared local closure, validate successfully, advance policy/component/accessibility revisions remotely, reconnect and require requalification. Finally ask AI to invent a canonical field and remove an inherited AGWS component; both attempts must escalate/reject while valid UI-only materialization remains possible.

## Stable findings
- **G2-FINDING-UIGX-37 — Generated UI Identity Is Typed Across Projection Semantics, Representation, Component Contract, Renderer/Provider and Effective Realization.** Continuity is explicit per identity kind; renderer/source identity is not canonical projection identity.
- **G2-FINDING-UIGX-38 — Effective Generated Experience Is a Multi-Axis Revision Vector.** Projection, model/schema, component registry, binding, renderer, accessibility and policy/trust revisions may advance independently.
- **G2-FINDING-UIGX-39 — Conflict-Free UI Composition Does Not Prove Semantic, Target or Accessibility Conformance.** Merge/syntax evidence and conformance evidence are independent.
- **G2-FINDING-UIGX-40 — Composite UI Proof Requires Revision/Profile-Compatible Evidence Joins.** Incompatible required evidence propagates `INCONCLUSIVE`.
- **G2-FINDING-UIGX-41 — Propagated UI Context Is Provenance and Selection Input, Not Authorization or Canonical Mutation Authority.** Contextual variants do not imply delegated governance.
- **G2-FINDING-UIGX-42 — Generated-UI Portability Must Be Layered Across Preserve, Interpret, Validate, Realize and Actuate.** Renderer/framework support is not binary portability.
- **G2-FINDING-UIGX-43 — Qualified Local Rendering/Validation Closure Has a Trust/Evidence Horizon.** Reconnection requires requalification when relevant dependency epochs changed.
- **G2-FINDING-UIGX-44 — AI Materialization Must Preserve Independent Semantic, Target, Accessibility and AGWS Authority Boundaries.** Generated representation success cannot self-authorize acceptance or organizational-policy mutation.

## Candidate register additions
- `G2-CAPABILITY-CANDIDATE-UIGX-TYPED-PROJECTION-REPRESENTATION-RENDERER-IDENTITY-MAPPING` — CROSS_CUTTING / CONSOLIDATION_CANDIDATE; specialize UCA typed identity continuity.
- `G2-CAPABILITY-CANDIDATE-UIGX-MULTI-AXIS-EFFECTIVE-PROJECTION-REVISION-VECTOR` — CROSS_CUTTING / CONSOLIDATION_CANDIDATE; reconcile Lifecycle/UCA revision-vector primitive.
- `G2-CAPABILITY-CANDIDATE-UIGX-POST-MERGE-SEMANTIC-ACCESSIBILITY-VALIDATION` — CORE_SUBCAPABILITY / PENDING_SYNTHESIS; retain within generic UI unless broader evidence changes ownership.
- `G2-CAPABILITY-CANDIDATE-UIGX-LAYERED-PORTABILITY-CONFORMANCE-PROFILE` — CROSS_CUTTING / CONSOLIDATION_CANDIDATE; merge with UCA portability layering while retaining UI-specific target/accessibility dimensions.

No candidate is promoted. Adaptive Governed Work Surfaces remains promoted and distinct.

## Architecture proof-backfill obligations — cycle-6 additions
1. **Typed identity continuity:** substitute renderer/source representation while projection semantics remain unchanged; only allowed identity kinds remain stable.
2. **Identity mismatch negative proof:** claim old renderer/realization evidence for a new renderer profile; composite proof must reject the join.
3. **Conflict-free semantic-invalid merge:** merge two non-conflicting UI changes that create an unsupported target or inaccessible structure; merge passes, conformance fails.
4. **Composite evidence join:** combine projection/schema/component/accessibility evidence from incompatible revision vectors and require `INCONCLUSIVE`.
5. **Context non-authority:** manipulate URL/client/audience context to request a privileged action; projection selection may change but authority cannot broaden.
6. **Layered portability:** preserve/interpret a projection on renderer B while deliberately lacking one component feature; report lower-layer support and realization/conformance failure separately.
7. **Qualified-local horizon:** validate offline, then advance trust/policy/component/accessibility epochs remotely; reconnect and require requalification.
8. **Provider substitution:** move one projection between materially different renderer/container targets while preserving semantic identity and issuing new realization/validation evidence.
9. **AI materialization boundary:** generate a plausible UI requiring a nonexistent canonical field or weaker accessibility rule; deterministic validation rejects/escalates.
10. **AGWS non-absorption:** use generic variant/context features to attempt removing a mandatory inherited Station/Role component; generic UI cannot override AGWS governance.

## Value / risk / priority / next question
**Value:** very high. This closes ambiguity between portable semantic experience and provider-specific rendering while making accessibility and AI generation independently provable. **Risk:** severe if render/merge success is treated as semantic correctness or contextual data becomes accidental authority. **Priority:** high. **Next question:** stress-test the refined generic UI primitives against AGWS organizational inheritance, delegated administration, promotion and cumulative-context behavior without merging ownership.

## Saturation
Material new findings: 8. `consecutive_no_material_finding = 0`. **NOT SATURATED**.