# Generation 2 — Planning C C3.3: UI / Generated Experience / Low-code Builder Target

Status: **DECIDED / PASS FOR CAPABILITY**  
Phase: `PLANNING_C_TARGET_ARCHITECTURE`  
Capability: **UI / Generated Experience / Low-code Builder**  
Decision scope: canonical target architecture for capability 3/28 only.  
Entry branch head revalidated before persistence: `fee731a77639bcfa9153174f93d5e63212e1a715`.

This record decides the target architecture of the canonical **UI / Generated Experience / Low-code Builder** capability after C0/C1/C2 and C3.1/C3.2. It does not implement product code, choose package/storage topology, materialize WBS/TASKs, perform remediation, reopen research, or execute C3.4 or any later phase.

## 1. Authorities and inherited constraints

Authoritative inputs:

- `project_docs/generation-2/RESEARCH_PIPELINE_STATE.json` — C3.3 is the sole authorized next decision;
- `PLANNING_C_TARGET_ARCHITECTURE_ENTRY_FRAMEWORK.md`;
- `PLANNING_C_C0_UNIVERSAL_CAPABILITY_ARCHITECTURE_SEMANTIC_SUBSTRATE.md`;
- `PLANNING_C_C1_ELICITATION_SYSTEM_UNDERSTANDING_ARCHITECTURE.md`;
- `PLANNING_C_C2_PHYSICAL_PERIPHERAL_INTEGRATION_BOUNDARY.md`;
- `PLANNING_C_C3_01_UNIVERSAL_CAPABILITY_ARCHITECTURE_TARGET.md`;
- `PLANNING_C_C3_02_PROCESS_APPLICATION_MODELING_TARGET.md`;
- `PLANNING_A_UI_GENERATED_EXPERIENCE_LOW_CODE_BOUNDARIES.md`;
- `PLANNING_B_UI_GENERATED_EXPERIENCE_LOW_CODE_SB_CURRENT_STATE.md`;
- `CAPABILITY_SYNTHESIS.md`;
- inherited adversarial closure: 284 material edge scenarios + 124 reusable `ConflictPattern`s = 408 material findings, with 0 HIGH/CRITICAL lacking owner/proof/detection route.

Standing invariants remain mandatory:

- `Research != remediation`;
- `ConflictPattern != ConflictInstance`;
- `Signal != ConfirmedConflict`;
- `UI visibility != authority`;
- `generated projection != canonical domain truth`;
- `rendered != authorized != accepted != applied/effective != converged != validated`;
- `provider component identity != canonical component semantic identity`;
- `provider reported state != physical truth`;
- `AI inference/proposal = candidate`, never authority;
- `question answered != concept resolved != evidence sufficient != contradiction cleared != implementation-ready != production-ready`.

## 2. Decision summary

**C3.3-DEC-001 — UI / Generated Experience / Low-code Builder owns provider-neutral experience semantics and projection contracts; it does not own the business/domain truth being projected.**

Generation 2 adopts a revisioned **Experience Semantic Model + Portable Projection IR**. It consumes typed foreign semantic references from Process/Application, Data, Authorization and other owners and projects them into constrained, renderable interaction structures without copying those owners' predicates into UI authority.

The capability owns:

1. stable experience/view/component semantic identity;
2. revisioned canonical experience definitions;
3. portable component contracts and constrained composition semantics;
4. layout, navigation, presentation and interaction-intent semantics;
5. semantic projection/binding from foreign owner truth;
6. accessibility, responsive/form-factor and interaction-alternative requirements;
7. generated-experience lineage and proposal/promotion semantics;
8. experience-specific compatibility and projection transformation rules;
9. realization requirements for renderer/design-system/component providers;
10. experience currentness and realization/readiness evidence as qualified claims, without owning runtime/business truth.

It does **not** own Process/Application meaning, Data/schema/persistence truth, Authorization decisions, Workflow execution, AGWS effective-surface governance, Integration external-effect semantics, Provider/Binding admission, Deployment client/runtime convergence, or specialized physical control.

The target chain is:

`foreign canonical semantics -> qualified projection -> canonical experience revision -> provider-qualified realization -> user interaction intent -> owner-governed action/effect boundary`.

## 3. Canonical responsibility and explicit non-responsibility

### 3.1 Canonical responsibilities

UI / Generated Experience / Low-code Builder is responsible for:

- expressing human-facing experience semantics independently of React, DOM, browser, native/mobile framework, design-system vendor or external UI host;
- preserving experience identity across renderer/provider substitution;
- defining component purpose, accepted semantic inputs, emitted interaction intents, composition constraints and presentation variants;
- binding experience elements to typed foreign semantic refs rather than copying domain fields or permissions as local truth;
- representing accessibility obligations as canonical semantics where they affect perceivability, operability, labeling, focus, navigation, alternatives or supported interaction modes;
- representing responsive/form-factor obligations without making breakpoints/framework primitives canonical business semantics;
- preserving generated/manual/AI/low-code authorship and transformation lineage;
- validating projection/composition structurally and semantically before promotion;
- surfacing lossy, unsupported, stale, ambiguous or partial projection explicitly;
- emitting realization/support requirements to Provider/Binding;
- exposing observability/readiness requirements for render, binding, currentness and interaction paths;
- providing capability-specific elicitation metadata and Production Readiness Coverage dimensions.

### 3.2 Non-responsibilities

This capability must never become:

- a canonical process/application model owner;
- a schema/data migration or persistence owner;
- an authorization/policy engine;
- a workflow runtime, scheduler or external-effect ledger;
- an AGWS `Enterprise -> Station -> Role -> Person` effective-surface owner;
- a provider admission/binding lifecycle owner;
- a deployment/client convergence owner;
- a universal event/telemetry source of truth;
- a physical/peripheral control plane;
- an AI-controlled canonical mutation channel.

## 4. Owned semantic types and foreign references

**C3.3-DEC-002 — UI owns experience/projection semantics through typed definitions; domain truth is consumed through foreign refs.**

Target owned semantic type families include, as architecture concepts rather than package/class mandates:

### Experience identity and definition

- `ExperienceDefinition`
- `ExperienceDefinitionRevision`
- `ExperienceSurfaceDefinition`
- `ExperienceRegionDefinition`
- `ExperienceNavigationDefinition`
- `ExperiencePresentationRule`
- `ExperienceInteractionIntent`
- `ExperienceVariantDefinition`

### Component and composition

- `ComponentSemanticContract`
- `ComponentContractRevision`
- `ComponentOccurrence`
- `ComponentSlotContract`
- `ComponentCompositionConstraint`
- `ComponentInputBinding`
- `ComponentInteractionBinding`
- `LayoutSemanticConstraint`

### Projection and realization

- `ExperienceProjectionDefinition`
- `ProjectionBinding`
- `ProjectionFidelityAssessment`
- `ExperienceRealizationRequirement`
- `ExperienceRealizationRef`
- `ExperienceCompatibilityAssessment`
- `ExperienceTransformationRef`
- `ExperienceUnresolvedSemantic`

### Accessibility and form factor

- `AccessibilityRequirement`
- `InteractionAlternativeRequirement`
- `SemanticLabelRequirement`
- `FocusNavigationRequirement`
- `ResponsiveExperienceRequirement`
- `FormFactorSupportRequirement`

### Generated/low-code lineage

- `ExperienceProposal`
- `ExperienceGenerationLineage`
- `GeneratorTemplateRevisionRef`
- `ExperiencePromotionDecision`
- `ExperienceSemanticDiff`

These types consume C0/UCA primitives such as `CanonicalSemanticIdentityRef`, `DefinitionRevisionRef`, `RevisionVector`, `TypedIdentityBinding`, `QualifiedClaim`, `QualifiedEvidenceEnvelope`, `CapabilityRequirement`, `CapabilitySupportVector`, `ProviderBindingRef`, `AuthorityEnvelope`, `CorrectionSupersessionLineage` and graph transformation primitives.

Foreign owner references include:

- Process/Application process, action, navigation, outcome and application semantic refs;
- Data/schema/entity/field/information refs;
- Authorization policy/permission/decision refs;
- Identity/actor/principal refs;
- Workflow executable action/task/execution refs;
- AGWS governed-surface/effective-overlay refs;
- Integration operation/event/external-system refs;
- Provider/Binding support and binding refs;
- Lifecycle coexistence/migration refs;
- Deployment/runtime realization/adoption refs;
- Observability/evidence refs;
- Privacy/Governance/Trust refs;
- C1 Elicitation records, operational requirements and coverage refs.

Embedding a foreign ref never transfers semantic ownership.

## 5. Portable Experience Definition and Projection IR

**C3.3-DEC-003 — The target IR is a provider-neutral semantic projection graph, not DOM, JSX, CSS, native-widget trees or provider-native page schemas.**

The portable UI/experience IR must be able to express, where applicable:

- stable experience identity and immutable revision identity;
- purpose/audience/context and semantic owner;
- component occurrences referencing revisioned semantic component contracts;
- layout regions, ordering and composition constraints;
- navigation intent and destinations as semantic refs;
- presentation variants with explicit applicability predicates;
- typed data/value bindings to foreign Data/domain refs;
- typed action/interaction-intent bindings to foreign action/Workflow/Integration refs;
- visibility/presentation predicates referencing Authorization-qualified results without owning authorization truth;
- accessibility and interaction-alternative requirements;
- responsive/form-factor constraints;
- localization/content refs without making translated strings domain truth;
- provider/renderer realization requirements;
- offline/degraded display/interaction requirements where allowed;
- provenance, generator/template/component revisions and source semantic revision vector;
- projection fidelity, unsupported/lossy semantics and unresolved obligations;
- tenant/enterprise/site/user applicability where meaningful.

The IR may permit bounded provider-specific extensions, but those remain namespaced, support-qualified and excluded from portable-equivalence claims.

## 6. Projection from Process/Application, Data and Authorization

**C3.3-DEC-004 — Projection is directional and non-owning.**

UI consumes approved Process/Application semantics from C3.2 and may project:

- application navigation intent into navigable experience structures;
- process activities/actions into interaction affordances;
- information needs into views/forms/data presentations;
- outcomes/exceptions into status/presentation semantics.

But UI cannot mutate the Process/Application model implicitly. If a low-code edit changes process meaning, a process action, a data concept, a business invariant or a policy requirement, it becomes a proposal to the corresponding owner against an explicit base revision.

Data bindings reference Data-owned semantics. A form field does not create schema truth; a missing UI field does not delete domain data; client-side validation does not replace domain/data invariants.

Authorization-qualified information may affect visibility/actionability, but:

`visible != authorized` and `hidden != revoked`.

Every protected action remains subject to authoritative evaluation at the owner/enforcement boundary. UI is forbidden from deriving canonical permission truth from layout, role labels, cached view state or provider component capabilities.

## 7. Component registry and constrained composition

**C3.3-DEC-005 — A revisioned semantic component registry is canonical; concrete renderer/design-system implementations are realizations.**

A `ComponentSemanticContract` must be able to declare:

- semantic purpose;
- accepted semantic input kinds;
- emitted interaction intents/events;
- required/optional slots;
- composition constraints;
- presentation variants;
- accessibility obligations;
- supported interaction alternatives;
- localization/content requirements;
- form-factor/responsive requirements;
- data/action binding requirements;
- required provider realization capabilities;
- failure/degradation behavior;
- evidence/proof expectations.

Low-code composition can arrange and parameterize only within these contracts. Invalid composition fails explicitly; no best-effort renderer is permitted to hide missing required semantics.

Concrete React/native/design-system components use `RealizationIdentityRef` and provider bindings. Name equality such as `Button`, `Form`, `Table` or `Dialog` never proves semantic equivalence.

## 8. Action semantics and effect boundary

**C3.3-DEC-006 — UI emits interaction intent; it does not own durable execution or external effect.**

A user interaction proceeds conceptually as:

`interaction observed -> UI binding resolved -> authority/effective-context qualified -> semantic action invoked -> owning execution/effect capability processes -> evidence/status projected back`.

UI may represent states such as submitting, pending, blocked, partial, unknown or completed, but those are projections of owner-qualified execution/effect state. A click, local callback, HTTP 2xx or rendered success toast is never by itself proof of business effect.

If downstream mutation disposition is `UNKNOWN`, UI must preserve that ambiguity and avoid presenting a retry as safe unless the owning capability provides a reconcile/retry rule.

## 9. Runtime/rendering boundary versus AGWS and Workflow

**C3.3-DEC-007 — UI owns generic rendering/projection semantics; AGWS owns governed effective-surface semantics; Workflow owns durable work execution.**

AGWS remains a separate canonical capability. It may supply an effective governed surface shaped by `Enterprise -> Station -> Role -> Person`, mandatory inherited components, capability exposure, delegated administration, personalization and overlays. Generic UI renders/projects that result but cannot widen, normalize or override it.

A generic experience definition can be reused inside AGWS, outside AGWS, or embedded in another qualified context. The experience definition does not become the AGWS effective-surface authority merely because AGWS renders it.

Workflow owns human-task/work-item lifecycle, wait/timeout, retries, in-flight state, compensation and durable execution. UI owns how those states and actions are projected to humans. Closing a dialog does not complete a workflow task unless Workflow records the transition.

Deployment/Runtime owns actual running client/runtime realization and effective adoption. Renderer output does not prove all clients/sessions/caches have adopted the new experience revision.

## 10. Provider/component binding and portability

**C3.3-DEC-008 — Portability is a multidimensional support relation, never a renderer-equivalence boolean.**

UI emits `ExperienceRealizationRequirement`/`CapabilityRequirement`; Provider/Binding qualifies candidate renderers/component providers through `CapabilitySupportVector` dimensions including, where applicable:

- component semantic coverage;
- accessibility support;
- responsive/form-factor support;
- data/action binding fidelity;
- localization/content behavior;
- interaction/event guarantees;
- client/offline/degraded behavior;
- extension/plugin points;
- tenant/site isolation;
- lifecycle/version support;
- observability/evidence support;
- security/privacy constraints;
- capacity/performance limits.

Unsupported dimensions remain explicit. A provider-specific extension may be retained as a qualified extension but cannot silently contaminate portable canonical experience semantics.

Provider substitution may preserve canonical experience/component identity while changing realization IDs, support vectors, runtime characteristics and evidence obligations.

## 11. Tenant/site/user scope and context

**C3.3-DEC-009 — Experience applicability is explicit; personalization never amplifies authority.**

Experience definitions and variants may be scoped by tenant/enterprise/site, device/form factor, user preference, locale or other owner-qualified context. Scope predicates must reference canonical context/authority owners rather than ad-hoc UI-only identifiers.

User personalization may reorder, hide, resize or choose permitted presentation variants only inside the bounded contract supplied by UI and, when under AGWS, inside AGWS governance. Personalization cannot expose unavailable capabilities, delete mandatory inherited controls or convert a hidden action into a revoked permission.

Cross-tenant/site caches, provider IDs, component state or generated templates must not leak semantic bindings or display state across scope boundaries.

## 12. Source-of-truth, currentness and state epistemics

**C3.3-DEC-010 — Canonical experience definition, realized document, client state and displayed domain state are different truths.**

The architecture must distinguish:

- canonical experience definition revision;
- projection/materialization result;
- provider/runtime realization revision;
- deployed/adopted client cohort;
- currently displayed data/effect observations;
- cached/local/offline client state;
- Fleet/global observations of those populations.

A dashboard/status surface must qualify freshness/currentness of the underlying evidence where staleness matters. `rendered_at` is not equivalent to `source_observed_at` or `domain_effective_at`.

`UNKNOWN`, stale, partial and disconnected states must be representable rather than cosmetically normalized into green/success.

## 13. Lifecycle, revision, coexistence and graph transformations

**C3.3-DEC-011 — Experience evolution is revisioned and lineage-preserving; coexistence is explicit.**

Every material experience revision preserves:

- base experience revision;
- source semantic revision vector;
- component-contract revisions;
- generator/template revision when generated;
- transformation/proposal provenance;
- semantic diff;
- compatibility assessment;
- provider realization/support qualification;
- promotion/adoption decision.

Regeneration creates a new qualified revision/realization; it never rewrites prior producing history.

Open sessions, cached bundles, offline clients, embedded surfaces and residual renderer cohorts may remain on older allowed revisions. Lifecycle/Deployment qualify coexistence, migration, drain/withdraw and rollback eligibility.

Rollback eligibility depends on current compatibility with referenced process/data/action/policy/component/provider/artifact revisions; historical existence is insufficient.

Graph projection/transformation cannot strengthen semantic kind, authority, currentness, proof or certainty. A visually equivalent result may still be semantically incompatible.

## 14. Failure, `PARTIAL`, `UNKNOWN` and reconciliation semantics

**C3.3-DEC-012 — Non-success is typed and visible.**

UI-specific first-class outcomes include:

- unresolved semantic projection;
- missing/incompatible component contract;
- unsupported provider realization requirement;
- partial provider/component coverage;
- stale source semantic revision;
- stale authorization/currentness qualification;
- ambiguous data/action binding;
- unavailable/degraded dependency;
- offline state beyond permitted freshness horizon;
- accessibility obligation not satisfied;
- generator/template/component revision incompatibility;
- unknown downstream effect;
- residual client/session cohort not converged.

`PARTIAL` means a bounded known subset is satisfied; `UNKNOWN` means effect/current state cannot safely be determined; `INCONCLUSIVE` means evidence is insufficient for the requested claim. These must not be conflated.

Reconciliation routes to the semantic owner: UI can detect/surface drift and request re-projection/requalification, but cannot overwrite foreign canonical truth to make a view consistent.

## 15. Generated / low-code / AI authoring boundary

**C3.3-DEC-013 — AI and low-code authoring produce revisioned proposals; promotion remains deterministic/owner-governed.**

AI/low-code may propose:

- layouts and component selection;
- semantic bindings;
- responsive/accessibility variants;
- content organization;
- component substitutions;
- experience diffs/migrations;
- generated experience revisions.

Every proposal that could affect canonical experience state carries at least base revision, source semantic revision vector, provenance/generator identity, requested changes, unresolved assumptions and authority context.

AI/low-code cannot silently:

- create domain/process/schema truth;
- grant or widen authorization;
- override AGWS mandatory inheritance/governance;
- infer provider support as semantic equivalence;
- treat observed provider UI as canonical intent;
- erase contradictions/UNKNOWN states;
- promote its own proposal.

If a proposed UI change implies a foreign-owner semantic change, the proposal is split/routed to that owner rather than smuggled through UI promotion.

## 16. Legacy Mirroring / Brownfield UI assimilation

**C3.3-DEC-014 — Existing pages/forms/screens are evidence and candidate projections, not automatic canonical target UI.**

Brownfield sources may include screenshots, legacy forms, page schemas, route maps, browser recordings, design files, field labels, client-side rules and provider-native components.

Assimilation follows:

`discover -> source/revision identify -> extract -> map to semantic refs -> assess fidelity -> surface unsupported/ambiguous behavior -> propose canonical experience -> owner review/adopt`.

Per-area fidelity may be `FAITHFUL`, `PROVIDER_SPECIFIC_RETAINED`, `LOSSY`, `AMBIGUOUS`, `UNSUPPORTED`, `CONFLICTED` or `EXCLUDED_BY_DECISION`.

A legacy hidden button is not evidence that authorization denies the action; a legacy visible field is not proof the field belongs in canonical schema; repeated user behavior is not automatically approved UX/process intent.

## 17. Physical / Peripheral integration-plane boundary

**C3.3-DEC-015 — UI can project specialized external-system state and governed interaction intents, but it does not acquire generic physical actuation authority.**

Under C2, UI may render telemetry/status/events, external account/resource/grant mappings, provider currentness, reconciliation state and safe governed operations exposed by the integration plane.

Provider/VMS/BMS/access/PDV/device status remains provider-reported evidence with explicit currentness. A rendered control does not itself establish authority or physical effect. Direct physical actuation remains outside generic UI and subject to C2's explicit bounded disposition and owner-specific safety/authority/proof obligations.

## 18. Accessibility, security, privacy and trust

**C3.3-DEC-016 — Accessibility and safe interaction are architecture semantics, not post-build cosmetics.**

Canonical experience requirements must represent accessibility obligations needed to preserve meaning/operability across qualified realizations. Provider support must be evidenced rather than assumed.

Security/privacy obligations include:

- no secret/credential exposure through canonical experience definitions;
- redaction/minimization of displayed/logged sensitive data according to owner policy;
- no client-only authorization enforcement for protected operations;
- safe handling of untrusted/generated content and extension components;
- explicit tenant/site/user isolation;
- audit/provenance for promoted experience changes and privileged operational actions;
- privacy-safe telemetry with no unnecessary collection merely for UI observability;
- currentness/expiry of authentication/session/authority information when it affects actionability.

Cryptographic/provider trust can qualify a renderer/component artifact but never grants domain authority.

## 19. Operability, performance, capacity and Production Readiness Coverage

**C3.3-DEC-017 — UI production readiness is independently evidenced and multidimensional; feature completeness is insufficient.**

For each experience/component/provider realization, the C1 Operability Elicitation Lens must ask at minimum:

- Como saberemos que está funcionando?
- Como saberemos que está degradado?
- Quem é responsável?
- Que evidência precisamos?
- Qual estado pode permanecer `UNKNOWN` e por quanto tempo?
- Qual perda/atraso/freshness é aceitável?
- Como recuperar?
- Como reconciliar?
- Como validar depois de mudança/deploy?

Capability-specific operational elicitation must derive, where applicable:

- SLO/SLA and user-perceived latency;
- expected interaction/render/data-refresh throughput;
- peak/burst assumptions and concurrency/session population;
- queue/backlog for render/generation/materialization/event/action pipelines;
- retry/idempotency and unsafe duplicate interaction behavior;
- timeout and ambiguous downstream effect handling;
- dependency/provider health and currentness;
- cache/offline freshness horizons;
- provider/component quotas and rate limits;
- degraded/offline mode behavior;
- alert thresholds plus action owner/runbook;
- ownership/on-call and escalation;
- maintenance/change windows;
- rollback and residual-client handling;
- reconciliation ownership;
- capacity headroom and saturation indicators;
- telemetry/data retention/minimization;
- cost/usage dimensions without turning UI telemetry into pricing authority;
- audit/incident evidence requirements.

Production Readiness Coverage remains separate from feature completeness and uses dimensions:

`OBSERVABILITY`, `OWNERSHIP`, `FAILURE_HANDLING`, `RECOVERY`, `CAPACITY`, `CURRENTNESS`, `SECURITY`, `RECONCILIATION`, `CHANGE_SAFETY`, `COST`, `DOCUMENTATION`

with states:

`UNTOUCHED | PARTIAL | RESOLVED | CONFLICTED | BLOCKED | NA`.

No single scalar health/readiness score may hide a critical unresolved dimension.

Operational status surfaces must expose freshness/currentness and unresolved/partial/UNKNOWN states when material, provide bounded drill-down/audit trails, and distinguish **observe** from **control** from **change** actions.

## 20. Queueing, flow and capacity mathematics

**C3.3-DEC-018 — UI capacity claims must be population-, unit- and queue-qualified.**

Where operationally relevant, UI realization may expose queue/network measures for generation, rendering, asset delivery, data refresh, interaction admission and downstream action submission.

The architecture preserves distinctions such as:

`observed low utilization != current queue health != sustainable capacity != headroom != transient burst tolerance != stability margin`.

A metric without unit, population, interval/currentness and context is insufficient for readiness claims. Mean latency cannot hide tail latency; average traffic cannot replace peak/burst assumptions; queue depth alone cannot replace queue age/arrival-service relation.

Vector semantics remain vector-valued unless an explicit consumer-owned scalarization is justified. `ResourcePressureVector`, risk/complexity/support vectors and analytical/forecast values cannot be collapsed into a universal UI health score.

## 21. Provenance, evidence and audit

**C3.3-DEC-019 — Experience claims must remain evidence-qualified and revision-aware.**

Material claims such as `renderable`, `accessible`, `provider-supported`, `current`, `safe-to-act`, `rollback-eligible`, `client-converged` or `production-ready` require a declared proof/evidence profile and applicability population.

Evidence can include component qualification results, renderer/provider compatibility evidence, accessibility verification, interaction traces, client cohort currentness, artifact/deployment identity, operational telemetry and owner-issued authorization references.

No single screenshot, successful render, click trace, provider ACK, synthetic check or Fleet aggregate proves all stronger claims.

Generated/promoted experience changes preserve actor/tool/proposal provenance, base revision, decision authority and resulting revision. Provenance is lineage, not truth or authority.

## 22. Capability-specific Elicitation Lens

**C3.3-DEC-020 — Elicitation for UI must cover semantic experience, users/context and operability independently.**

At minimum, elicitation must resolve or explicitly disposition:

### User/task/context semantics

- Which approved process/application intentions must be projected?
- Who are the user populations and what tenant/site/device/form-factor contexts apply?
- Which information must be visible, editable, compared, acknowledged or acted upon?
- Which statuses require explicit `PARTIAL`, stale or `UNKNOWN` presentation?
- Which actions are merely visible versus actually allowed by foreign authorization?

### Component/projection semantics

- Which component semantic contracts are required?
- What are required data/action bindings and their revision expectations?
- Which layout/navigation constraints carry semantic importance?
- Which provider-specific UI features are optional extensions rather than portable requirements?
- What fidelity loss is acceptable during provider substitution or Brownfield import?

### Accessibility/responsiveness

- What perceivability, keyboard/focus/navigation, labeling and interaction-alternative requirements apply?
- Which form factors must be supported?
- Which information hierarchy must survive responsive transformation?

### Lifecycle/currentness

- What source semantic revisions does the experience depend upon?
- What stale client/cache/session horizon is acceptable?
- What coexistence/rollback behavior is required?
- How are residual cohorts detected and reconciled?

### Operations

- Como saberemos que está funcionando/degradado?
- Quem responde por renderer/component/data/action dependency failures?
- What latency, throughput, peak/burst, queue/backlog and currentness bounds apply?
- What evidence proves recovery/reconciliation and post-change validation?

Unresolved critical dimensions remain `PARTIAL`, `CONFLICTED` or `BLOCKED`; question count or visually complete screens cannot close sufficiency.

## 23. Inherited adversarial obligations

C3.3 routes, without remediating, the inherited 408-finding corpus into target constraints/proof obligations including at least:

1. fully specified feature with no operational owner must not be production-ready;
2. dashboard without freshness/currentness must not appear authoritative/current;
3. retry without idempotency/effect reconciliation must not be presented as safe;
4. alert without action owner/runbook is incomplete readiness evidence;
5. metric without unit/population/context/currentness is insufficient;
6. failure mode without recovery/reconciliation route is incomplete;
7. rollout without rollback/residual-cohort qualification is incomplete;
8. capacity without peak/burst assumptions is incomplete;
9. accessibility success on one provider/profile cannot prove all realizations;
10. hidden/disabled/visible UI state cannot be promoted to authorization truth;
11. AI/low-code composition cannot amplify authority or silently mutate foreign semantics;
12. stale provider/Fleet status cannot become local/current truth;
13. renderer/provider substitution requires multidimensional support evidence;
14. Brownfield UI observations remain evidence/candidates until governed adoption;
15. physical/provider UI controls remain integration-plane projections, not generic actuation authority.

No `ConflictInstance` or remediation is created by this decision.

## 24. Planning D migration constraints

Planning D must later sequence migration/coexistence without changing this target decision. Constraints include:

1. preserve current declarative view kinds and deterministic entity/field/action binding as compatibility predecessors;
2. introduce revisioned experience/component identities without confusing current `viewRef` or local field/action IDs with globally canonical realization identity;
3. evolve flat generated-view documents toward Portable Projection IR without breaking existing generated systems unnecessarily;
4. add component semantic contracts before enabling unconstrained low-code composition;
5. add accessibility/responsive semantics as qualification-bearing requirements rather than renderer-only metadata;
6. preserve fail-closed authorization separation while richer interaction bindings are introduced;
7. introduce generated lineage/source revision vectors/component/template revisions before claiming regeneration equivalence;
8. introduce provider support vectors/bindings before claiming renderer substitution equivalence;
9. preserve AGWS as a separate owner and avoid migrating governed surface hierarchy into generic UI contracts;
10. support old/new experience revisions and residual clients during transition;
11. keep current generated/autonomous runtime independence where qualified local closure allows it;
12. migrate AI/low-code authoring through proposal/promotion contracts, never direct canonical mutation.

These are migration constraints only; no migration plan is executed here.

## 25. Planning E proof candidates

Planning E should later define executable/product proofs for at least:

1. canonical experience identity survives renderer/provider substitution while realization identity changes;
2. component registry rejects invalid composition and missing required semantics;
3. data/action bindings preserve foreign semantic ownership and reject unknown/incompatible refs;
4. visual visibility/disabled state cannot bypass authoritative action authorization;
5. generated lineage pins source semantic, component, generator/template and realization revisions;
6. accessibility/responsive requirements are qualification-bearing and unsupported realizations fail explicitly;
7. stale source/currentness state is displayed as stale/partial/UNKNOWN instead of false green;
8. ambiguous downstream effect retains `UNKNOWN` and reconcile-before-retry behavior;
9. provider support vectors expose unsupported dimensions and prevent false equivalence;
10. AGWS governed effective surfaces cannot be widened by generic UI composition;
11. AI/low-code proposals cannot self-promote or mutate foreign owner truth;
12. Brownfield imports preserve source/fidelity/unresolved semantics and require adoption;
13. experience revision rollout distinguishes published from adopted/converged client populations;
14. rollback eligibility fails when referenced source/component/provider/artifact revisions are incompatible/unavailable;
15. Production Readiness Coverage can remain BLOCKED despite complete feature projection;
16. alert/currentness/recovery/reconciliation evidence is owner/actionable and revision-qualified;
17. tenant/site/user scoped caches and generated state cannot cross isolation boundaries;
18. physical/peripheral status/control projection cannot amplify generic actuation authority.

## 26. Compatibility with current SB baseline

Planning B found strong existing predecessors:

- bounded declarative view kinds;
- explicit logical `viewRef` and entity/field/action bindings;
- deterministic normalization/materialization;
- renderer-agnostic generated view documents;
- separate fail-closed authority gating for generated interactions.

C3.3 therefore chooses **KEEP + HARDEN + GENERALIZE + PROVIDERIZE + INTEGRATE**, not replacement:

- **KEEP** provider-neutral declarative views, deterministic semantic bindings and authorization separation;
- **HARDEN** revision/currentness/binding compatibility, accessibility/responsiveness and failure semantics;
- **GENERALIZE** into revisioned experience/component/projection contracts where semantics are truly reusable;
- **PROVIDERIZE** renderer/design-system/component realization mechanics;
- **INTEGRATE** with C0/UCA, C3.2 Process/Application, Data, Authorization, AGWS, Provider/Binding, Lifecycle, Deployment and Observability through directional references.

This target does not assert that the current implementation already satisfies the new contracts.

## 27. Alternatives considered

### Alternative A — Framework-native page/component tree as canonical UI

**Rejected.** It couples semantic identity to realization technology and makes renderer substitution/migration semantically unsafe.

### Alternative B — Fully generic JSON page schema

**Rejected.** A generic bag risks erasing semantic kind, owner, accessibility obligations and typed data/action bindings.

### Alternative C — AGWS absorbs all UI semantics

**Rejected.** Generic experience projection and governed effective-surface hierarchy have different owners. Absorption would make Station/Role/Person governance contaminate generic UI and vice versa.

### Alternative D — AI-first generated UI with implicit promotion

**Rejected.** It amplifies authority, obscures provenance/assumptions and permits foreign-owner semantic mutation through presentation tooling.

### Alternative E — Chosen model: typed provider-neutral Experience Semantic Model + Portable Projection IR + semantic component registry + governed proposal/promotion

**Accepted.** It preserves portability, ownership, auditability, accessibility, low-code extensibility and non-amplifying authority while retaining a migration path from the current generated-view baseline.

## 28. Decision disposition

**PASS_FOR_CAPABILITY / TARGET_ARCHITECTURE_DECIDED.**

UI / Generated Experience / Low-code Builder owns revisioned provider-neutral experience semantics, semantic component contracts, constrained composition, portable projection/binding, accessibility/responsive requirements and generated/AI/low-code proposal lineage. It consumes Process/Application/Data/Authorization semantics directionally and never promotes UI visibility or provider/rendered state into domain authority.

AGWS remains a distinct owner of governed effective surfaces; Workflow remains the durable execution owner; Data remains schema/data truth owner; Authorization remains permission owner; Provider/Binding remains realization qualification owner; Deployment/Lifecycle qualify adoption/coexistence; Physical/Peripheral remains bounded to C2 integration-plane governance with no generic UI-derived actuation authority.

No new capability, ConflictPattern, ConflictInstance, remediation, WBS, Work Package, executive TASK, Construction or product-code change is created.

## 29. Next authorized Planning C action

After repository state is revalidated and this decision is persisted, the next C3 capability in the canonical synthesis order is:

**C3.4 — Adaptive Governed Work Surfaces (AGWS).**

C3.4 must consume this UI contract directionally while preserving AGWS ownership of `Enterprise -> Station -> Role -> Person`, mandatory inherited components, effective overlays, capability exposure/delegated administration, governed personalization/promotion and non-amplifying authority.

Do not execute C3.4 in the same action.