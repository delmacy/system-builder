# Generation 2 — Planning A: UI / Generated Experience / Low-code Builder Boundaries

Status: COMPLETE_FOR_CAPABILITY — PLANNING_A_TAXONOMY_BOUNDARIES
Capability: UI / Generated Experience / Low-code Builder
Authority inputs: `project_docs/generation-2/synthesis/CAPABILITY_SYNTHESIS.md`, authoritative Generation 2 research corpus, Universal Capability Architecture Planning A, Process & Application Modeling Planning A, and AGWS Planning A.

This document defines taxonomy ownership and boundaries only. It does not assert current System Builder implementation, choose providers, define target modules, materialize WBS/TASKs, execute Construction, or enter Planning B.

## 1. Canonical ownership

UI / Generated Experience / Low-code Builder owns the provider-neutral semantic projection of canonical application/process/data/action meaning into renderable interactive experiences. It owns experience definitions, component composition constraints, presentation semantics, accessibility and responsive behavior, generated-experience lineage, and the mapping between canonical semantic references and renderable component/action/data bindings.

It owns how canonical semantics are projected and composed for human interaction. It does not own the underlying process truth, data/schema truth, authorization decision, durable workflow execution, provider binding, lifecycle orchestration, or AGWS governed effective-surface hierarchy.

## 2. Source of truth

The source of truth is a revisioned canonical experience definition composed from stable semantic references plus explicit presentation/composition semantics. Generated runtime markup, framework component trees, provider-native page IDs, CSS/runtime artifacts, browser state and deployed bundles are realizations or observations unless explicitly adopted through the semantic owner.

An experience definition cannot become canonical merely because a renderer/provider emitted or persisted it.

## 3. Semantic projection and identity

Canonical experience identity is distinct from route IDs, DOM IDs, framework component instance IDs, design-tool IDs, provider page IDs and deployment artifact IDs. Each experience revision references canonical semantic subjects—process actions, data concepts, navigation intents, permissions/policy requirements and component contracts—through typed semantic references.

A projection may specialize presentation without redefining the semantic meaning of its referenced subject. Lossy or ambiguous projection must remain explicit as `PARTIAL` or `INCONCLUSIVE`; a visually plausible rendering is not evidence of semantic equivalence.

## 4. Component registry and constrained composition

UI owns a revisioned component contract/registry describing semantic purpose, accepted inputs, emitted interaction intents, accessibility obligations, composition constraints, supported presentation variants and realization requirements. A component registry entry is a semantic contract, not a hard-coded dependency on a specific UI framework or vendor library.

Low-code composition is constrained by those contracts. A composer may arrange, parameterize and bind authorized components, but cannot use visual composition to invent new domain invariants, schema fields, authorization rights, provider capabilities or workflow semantics. Invalid composition must fail explicitly rather than degrade into best-effort hidden behavior.

## 5. Accessibility and responsive semantics

Accessibility and responsive behavior are part of canonical experience semantics where they affect perceivability, operability, navigation, focus order, semantic labeling, interaction alternatives, information hierarchy or supported form factors. They are not post-build cosmetic concerns.

Provider/framework realization may differ, but a realization must preserve the required experience semantics for its qualified environment/profile. Missing support, stale qualification or incomplete coverage yields explicit unsupported/partial/inconclusive status instead of silent downgrade.

## 6. Generated-experience lineage and versioning

Generated experiences preserve lineage from source semantic revisions, experience/composition revision, generator/template revision, component-contract revisions and realization/provider profile. Regeneration therefore creates a new qualified realization or experience revision; it does not erase the producing lineage of prior versions.

Publishing a new experience revision does not prove that deployed clients, cached bundles, open sessions, AGWS overlays or embedded consumers have converged. Lifecycle/Deployment owners must qualify effective adoption and residual cohort drainage.

## 7. Data binding boundary

UI may declare/read/write bindings against canonical data semantics exposed by Data/Schema and domain owners, but it does not own schema definition, persistence identity, migration or data-integrity invariants. A widget binding cannot make a provider field/table ID canonical.

A data-binding contract must preserve semantic subject identity, operation intent, revision/compatibility expectations and evidence of provider/runtime support where realization is external. Ambiguous binding or incompatible schema state yields explicit failure or `INCONCLUSIVE`.

## 8. Action binding boundary

UI may surface semantic actions and collect interaction intent. It does not decide whether an action is authorized, execute durable workflow state, or own external/provider effects. Interaction intent crosses explicit boundaries to Authorization/Policy, Workflow, Integration or other semantic owners.

A successful click/submit event is not equivalent to authorized, applied, converged or validated business effect. Ambiguous downstream mutation retains `UNKNOWN` effect semantics and requires reconciliation before unsafe retry.

## 9. Relationship to Process & Application Modeling

Process & Application Modeling owns canonical process/application meaning, domain-facing model references, imports and semantic lineage. UI consumes those semantics and projects them into experiences.

UI composition cannot mutate canonical process/application semantics implicitly. A builder-generated proposal that would change process or domain meaning must cross the Process/Application owner boundary as an explicit proposal tied to a base revision and authority envelope.

## 10. Relationship to Adaptive Governed Work Surfaces

AGWS remains a distinct CORE capability. UI owns generic experience projection/rendering and component composition; AGWS owns governed effective-surface semantics across `Enterprise → Station → Role → Person`, including mandatory inherited components, bounded Station capability exposure/delegated administration, effective overlays and governed personalization/promotion.

A generic UI can render an AGWS effective surface, but it cannot determine or widen that effective surface. Hiding, reordering or restyling a component does not revoke or grant authority. Station/Role/Person overlays cannot remove mandatory inherited controls or expose capabilities beyond delegated Enterprise/Station authority.

## 11. Relationship to Authorization / Policy

Authorization/Policy owns policy evaluation, organizational/tenant scope, delegated/temporary authority and effective permission decisions. UI may consume policy-qualified visibility/actionability signals, but visual presence/absence is never the canonical authorization decision.

Client-side disabling or hiding is presentation behavior only. Every protected action remains subject to authoritative policy evaluation at the owning enforcement boundary.

## 12. Relationship to Provider / Binding / Capability Negotiation

Provider/Binding owns discovery, support qualification, admission, binding, coexistence, fallback, cutover and withdrawal for renderers, component providers, design systems, external UI hosts and other realizations. UI owns the provider-neutral semantic contract those providers must satisfy.

Provider/external IDs remain non-canonical unless explicitly adopted. Provider substitution may preserve experience identity while changing realization identity, support vectors and operational constraints. Matching component names do not establish semantic equivalence.

## 13. Relationship to Lifecycle / Versioning / Evolution / Migration

UI owns experience-specific compatibility predicates and projection semantics between revisions. Lifecycle owns generic coexistence, migration readiness/currentness, withdrawal and rollback qualification.

Rollback to an older experience is eligible only when referenced semantic subjects, component contracts, data/action bindings, policy expectations and required artifacts remain compatible and available. Historical version existence alone is not rollback eligibility.

## 14. Relationship to Universal Capability Architecture

UCA supplies reusable semantic identity, revision vectors, qualified claims/evidence, support vectors, effect dispositions, authority envelopes and correction/supersession structures. It must not become a generic UI schema, component registry, universal page model or rendering god-object.

UI is a semantic owner consuming UCA primitives while retaining domain-specific projection, composition, accessibility and experience-compatibility semantics.

## 15. AI and low-code proposal vs authority boundary

AI and low-code tooling may propose layouts, components, bindings, responsive variants and generated experience revisions. They are proposal/generation mechanisms, not canonical authority.

They cannot silently:

- create or alter canonical domain/process/schema semantics;
- grant permissions or widen `Enterprise → Station → Role → Person` authority;
- override mandatory AGWS inherited components;
- adopt provider IDs as canonical identity;
- infer provider support as permission to expose a capability;
- convert ambiguous data/action mappings into asserted equivalence;
- bypass governance or promotion requirements for personalized surfaces.

Requests beyond delegated authority must be rejected or escalated explicitly.

## 16. Provider-neutral realization and portability

Experience semantics must be realizable across qualified frameworks/providers without binding canonical identity to one rendering stack. Portability is a support vector covering component semantics, accessibility, responsive behavior, data/action bindings, offline/local behavior, extension points and deployment constraints.

A provider may support only a subset or a different realization strategy. Unsupported semantics remain visible; fallback may degrade only where the canonical contract explicitly permits degradation.

## 17. Failure and `INCONCLUSIVE` semantics

First-class non-success outcomes include unresolved semantic projection, missing/incompatible component contracts, stale generated lineage, unsupported accessibility/responsive requirements, ambiguous data/action binding, stale policy qualification, missing provider capability, incompatible semantic revisions and unknown downstream action effect.

These yield explicit rejection, `PARTIAL`, `UNKNOWN` effect where mutation ambiguity exists, or `INCONCLUSIVE` where evidence is insufficient. A renderer producing pixels/markup is not sufficient evidence of a valid experience.

## 18. Non-goals

UI / Generated Experience / Low-code Builder does not own:

1. canonical process/application or domain meaning;
2. schema/data lifecycle or persistence truth;
3. authorization/policy decisions;
4. durable workflow/integration effect semantics;
5. AGWS hierarchy, mandatory inherited surfaces or delegated Station administration;
6. provider admission/binding lifecycle;
7. generic cross-capability lifecycle orchestration;
8. architecture-wide universal primitives;
9. provider/framework component identities as universal truth;
10. AI-controlled canonical mutation or authority expansion.

## 19. Preserved proof obligations

Later phases must prove at minimum:

1. canonical experience identity survives renderer/framework/provider substitution;
2. generated-experience lineage preserves semantic, generator/template and component-contract revisions;
3. visual composition cannot smuggle process/schema/policy mutations;
4. accessibility/responsive obligations are qualification-bearing semantics rather than optional decoration;
5. UI visibility/actionability never substitutes for authoritative authorization;
6. AGWS effective-surface governance remains outside generic UI ownership;
7. provider support differences remain explicit through qualified support vectors;
8. stale clients/caches/sessions do not falsely imply convergence after experience revision;
9. ambiguous action effects preserve `UNKNOWN` and reconcile-before-retry semantics;
10. AI/low-code generation cannot amplify delegated authority.

## 20. Planning B repository-validation questions

Record only for later `PLANNING_B_SB_CURRENT_STATE_RECONCILIATION`:

1. Where are current SB experience definitions, component contracts and generated-experience lineage stored?
2. Are canonical experience IDs distinct from routes, framework IDs, provider/design-tool IDs and deployment artifacts?
3. Does any generated UI path directly mutate process/domain/schema truth rather than submit an explicit proposal to its owner?
4. Are accessibility/responsive requirements represented as semantic contracts and qualified during realization?
5. Are data/action bindings semantic and revision-aware, or coupled directly to provider/table/endpoint IDs?
6. Can client-side visibility or disabled state be mistaken for authorization enforcement?
7. Are AGWS hierarchy/effective overlays represented separately from generic page/layout definitions?
8. Can UI/AI/low-code paths bypass Station capability exposure, mandatory inherited components or personalization-promotion governance?
9. Are provider/framework support differences explicit and provider IDs non-canonical by default?
10. Are generated revisions, caches/open sessions and rollback eligibility tracked independently enough to qualify effective convergence?

These questions must not be answered during Planning A.

## 21. Planning A capability decision

**PASS_FOR_CAPABILITY.** UI / Generated Experience / Low-code Builder has explicit ownership of provider-neutral semantic projection, component contracts/constrained composition, accessibility/responsive semantics, generated-experience lineage/versioning and semantic data/action binding, with clear boundaries from Process/Application Modeling, Data/Schema, Authorization, Provider/Binding, Lifecycle, UCA and AGWS.

No new capability, finding or synthesis contradiction is created by this boundary pass. AGWS remains distinct; `Enterprise → Station → Role → Person`, Station delegated capability exposure/administration, provider IDs as non-canonical-by-default and UCA anti-god-object constraints remain preserved.
