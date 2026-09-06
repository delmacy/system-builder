# Generation 2 — Planning C C3.2: Process & Application Modeling Target

Status: **DECIDED / PASS FOR CAPABILITY**  
Phase: `PLANNING_C_TARGET_ARCHITECTURE`  
Capability: **Process & Application Modeling**  
Decision scope: canonical target architecture for capability 2/28 only.  
Entry branch head revalidated before persistence: `d260f380c67c45b39d071e4ffc98f97bd4171fda`.

This record decides the target architecture of the canonical **Process & Application Modeling** capability after C0/C1/C2 and C3.1. It does not implement product code, choose package/storage topology, materialize WBS/TASKs, perform remediation, reopen research, or execute C3.3 or any later phase.

## 1. Authorities and inherited constraints

Authoritative inputs:

- `project_docs/generation-2/RESEARCH_PIPELINE_STATE.json` — C3.2 is the sole authorized next decision;
- `PLANNING_C_TARGET_ARCHITECTURE_ENTRY_FRAMEWORK.md`;
- `PLANNING_C_C0_UNIVERSAL_CAPABILITY_ARCHITECTURE_SEMANTIC_SUBSTRATE.md`;
- `PLANNING_C_C1_ELICITATION_SYSTEM_UNDERSTANDING_ARCHITECTURE.md`;
- `PLANNING_C_C2_PHYSICAL_PERIPHERAL_INTEGRATION_BOUNDARY.md`;
- `PLANNING_C_C3_01_UNIVERSAL_CAPABILITY_ARCHITECTURE_TARGET.md`;
- `PLANNING_A_PROCESS_APPLICATION_MODELING_BOUNDARIES.md`;
- `PLANNING_B_PROCESS_APPLICATION_MODELING_SB_CURRENT_STATE.md`;
- `CAPABILITY_SYNTHESIS.md`;
- inherited adversarial closure: 284 material edge scenarios + 124 reusable `ConflictPattern`s = 408 material findings, with 0 HIGH/CRITICAL lacking owner/proof/detection route.

Standing invariants remain mandatory:

- `Research != remediation`;
- `ConflictPattern != ConflictInstance`;
- `Signal != ConfirmedConflict`;
- `observed behavior != intended process != approved canonical process`;
- `provider representation != canonical process/application truth`;
- `model publication != downstream convergence`;
- `syntactic compatibility != semantic compatibility`;
- `derived artifact != owner-approved requirement`;
- `AI inference = candidate`, never authority;
- `question answered != concept resolved != evidence sufficient != contradiction cleared != implementation-ready != production-ready`.

## 2. Decision summary

**C3.2-DEC-001 — Process & Application Modeling is the canonical owner of approved provider-neutral process/application semantics, not their runtime or physical realization.**

Generation 2 adopts a revisioned, owner-preserving **Process/Application Semantic Model** that sits between elicited/observed evidence and downstream realization capabilities.

The capability owns:

1. stable process/application semantic identity;
2. revisioned canonical definitions and semantic lineage;
3. process structure, business intent and application-composition intent;
4. actor/responsibility references without owning identity/authorization truth;
5. semantic actions, decisions, states, outcomes, exceptions and business invariants;
6. references to required data/information, UI/work-surface intent, integrations, policies and workflow realization needs without absorbing those owners;
7. import/mirroring normalization, mapping and explicit adoption decisions for process/application semantics;
8. semantic compatibility predicates between model revisions;
9. graph-transformation lineage for N->N+1 model evolution;
10. model-specific evidence, unresolved semantics and downstream realization requirements.

It does **not** own durable workflow execution, UI rendering/AGWS behavior, schema/data truth, authorization truth, integration execution, provider binding mechanics, generic lifecycle orchestration, deployment/runtime state, or physical actuation.

The core target rule is:

`Observed evidence -> candidate semantic interpretation -> governed adoption -> canonical process/application revision -> independently qualified realizations`.

## 3. Canonical responsibility and explicit non-responsibility

### 3.1 Canonical responsibilities

Process & Application Modeling is responsible for:

- defining what a modeled business process/application means independent of provider/runtime technology;
- preserving process/application identity across realization changes;
- expressing reusable semantic structure and typed cross-capability references;
- keeping intended/approved semantics distinct from observed behavior and provider-native representations;
- recording revision, correction, supersession, branch/proposal and adoption lineage;
- defining model-specific semantic compatibility and invariants;
- exposing realization requirements to Workflow, Data, UI/AGWS, Integration, Authorization and Provider/Binding;
- normalizing Brownfield/Mirroring evidence without silently adopting it;
- preserving unsupported/lossy/unresolved import semantics;
- maintaining explicit model-level `PARTIAL`, `INCONCLUSIVE` and conflict states where evidence or mapping is insufficient.

### 3.2 Non-responsibilities

This capability must never become:

- a workflow runtime or scheduler;
- a database/schema owner;
- a UI/page/form renderer;
- an AGWS authorization/personalization owner;
- an identity or authorization engine;
- an integration transport/provider executor;
- a provider facade that erases vendor differences;
- a generic lifecycle migration engine;
- a universal event log;
- a universal entity model for every domain;
- an AI-controlled canonical mutation path;
- a physical/peripheral control plane.

## 4. Owned semantic types and foreign references

**C3.2-DEC-002 — The capability owns process/application meaning through typed definitions; foreign owner truth is referenced, never copied into local ownership.**

Target owned semantic type families include, as architecture concepts rather than package/class mandates:

### Process identity and definition

- `ProcessDefinition`
- `ProcessDefinitionRevision`
- `ProcessStageDefinition`
- `ProcessActivityDefinition`
- `ProcessDecisionDefinition`
- `ProcessOutcomeDefinition`
- `ProcessExceptionDefinition`
- `ProcessInvariant`
- `ProcessResponsibilityRef`
- `ProcessInformationNeedRef`
- `ProcessExternalInteractionNeedRef`

### Application composition

- `ApplicationModelDefinition`
- `ApplicationModelRevision`
- `ApplicationCapabilityRequirementRef`
- `ApplicationActionIntent`
- `ApplicationNavigationIntent`
- `ApplicationWorkSurfaceIntentRef`
- `ApplicationIntegrationNeedRef`
- `ApplicationInformationNeedRef`
- `ApplicationPolicyNeedRef`

### Modeling lineage and adoption

- `ModelProposal`
- `ModelImportSourceRef`
- `ModelNormalizationResult`
- `ModelMappingDecision`
- `ModelAdoptionDecision`
- `ModelSemanticDiff`
- `ModelCompatibilityAssessment`
- `ModelTransformationRef`
- `ModelUnresolvedSemantic`

Process/application-owned records consume UCA types such as `CanonicalSemanticIdentityRef`, `DefinitionRevisionRef`, `RevisionVector`, `QualifiedEvidenceEnvelope`, `QualifiedClaim`, `GraphTransformationRef`, `AuthorityEnvelope` and typed provenance/currentness structures.

Foreign owner references include:

- Identity actor/principal refs;
- Authorization policy/grant/delegation refs;
- Workflow executable-definition/execution refs;
- Data/schema/entity refs;
- UI/Generated Experience projection/component refs;
- AGWS governed-surface refs;
- Integration contract/endpoint/event refs;
- Provider/Binding support/binding refs;
- Lifecycle coexistence/migration refs;
- Governance/Privacy/Trust refs;
- Observability/evidence refs;
- Elicitation records, questions, requirements and coverage refs from C1.

Embedding or referencing those foreign concepts does not transfer semantic ownership.

## 5. Portable process/application definition and IR

**C3.2-DEC-003 — The target portable IR is a provider-neutral semantic graph over process and application intent, not a BPMN engine model, UI schema, database schema or provider-native application descriptor.**

The portable IR must be able to express, where applicable:

- process/application stable identity and immutable revision identity;
- purpose/outcome and semantic owner;
- actors/responsibilities as foreign identity/organization refs;
- stages/activities/decisions/outcomes/exceptions;
- preconditions/postconditions as semantic claims/refs, without embedding foreign policy engines;
- information inputs/outputs/needs as references to Data-owned semantics;
- semantic actions and external interaction needs;
- business invariants and constraints;
- application capability composition intent;
- navigation/work-surface intent without prescribing rendering;
- required realization capabilities and support constraints;
- tenant/enterprise/site applicability where meaningful;
- provenance, producing evidence, uncertainty and unresolved semantics;
- model-specific compatibility metadata;
- transformation/supersession lineage.

The IR may support bounded extensions, but provider-specific constructs remain namespaced and explicitly qualified. A provider-native task type or control cannot silently become a portable semantic primitive merely because an adapter can serialize it.

The target architecture intentionally keeps the current constitutional chain conceptually compatible:

`ProcessMirror evidence -> approved business semantics -> application/system modeling -> downstream realization`

while allowing Generation 2 to generalize the semantic model beyond the current narrower artifact shapes.

## 6. Observed, intended and approved semantics

**C3.2-DEC-004 — Observation, intent and canonical approval are separate typed states with explicit promotion.**

Brownfield/runtime observation may produce evidence such as actual steps, spreadsheets, verbal approvals, shadow systems, workarounds, exception procedures, copied data, off-channel communication and provider configuration.

Those observations may support candidate interpretations but cannot become canonical process truth by ingestion alone.

The architecture preserves at least:

- `ObservedProcessEvidence` — what was observed/reported/discovered;
- `IntendedProcessCandidate` — proposed interpretation of desired behavior;
- `ApprovedCanonicalProcess` — owner-governed canonical definition;
- `RealizedProcessProjection` — provider/workflow/UI/data/runtime-specific realization evidence.

A stakeholder assertion is a claim with source/currentness, not canonical truth. A repeated workaround is evidence of effective behavior, not automatic policy. A user story is a derived elicitation artifact, not the complete canonical process definition.

## 7. Brownfield / Legacy Mirroring / import assimilation

**C3.2-DEC-005 — Brownfield assimilation is a typed graph transformation with explicit fidelity and adoption disposition.**

Imports from legacy systems, BPM suites, spreadsheets, documents, forms, workflow engines, scripts, APIs, configuration, logs or observed activity enter through a normalization path:

`discover -> identify source/revision -> extract -> map -> classify fidelity -> surface unresolved semantics -> propose -> owner review/adopt -> produce canonical revision`.

`ModelNormalizationResult` must support per-element or per-semantic-area disposition such as:

- `FAITHFUL`;
- `PROVIDER_SPECIFIC_RETAINED`;
- `LOSSY`;
- `AMBIGUOUS`;
- `UNSUPPORTED`;
- `CONFLICTED`;
- `EXCLUDED_BY_DECISION`.

A global “import succeeded” result cannot hide unresolved critical semantics. Name equality, shape similarity, matching IDs or AI confidence cannot establish equivalence.

Every material import/adoption path preserves source identity, source revision/currentness, transformation revision, mapping evidence, reviewer/authority, unsupported content and resulting canonical revision.

C2 remains authoritative for specialized physical/peripheral systems: imported device/provider behavior remains evidence/provider semantics and never grants generic physical actuation authority.

## 8. Runtime/execution boundary versus Workflow

**C3.2-DEC-006 — Process/Application Modeling defines execution intent and realization requirements; Workflow owns durable execution semantics and runtime state.**

The process model may declare semantic control-flow intent and business completion conditions needed by a future executable realization, but it does not own:

- execution instances;
- durable timers;
- retries/redrive;
- message delivery state;
- human-task runtime state;
- cancellation/compensation execution;
- in-flight orchestration state;
- execution journal;
- external-effect disposition.

Workflow consumes a revisioned process/application definition and may produce one or more executable realizations. A workflow provider definition is a realization, not automatically canonical process truth.

`process revision current != workflow cohort migrated != downstream business convergence`.

In-flight workflow cohorts may remain pinned to prior allowed process revisions. The process model must make compatibility requirements visible without attempting to mutate those cohorts directly.

## 9. Data, UI/AGWS, Authorization and Integration boundaries

**C3.2-DEC-007 — Process/Application Modeling composes foreign requirements; it does not own their runtime predicates.**

### Data

Process/application definitions may refer to required business information, entities, fields, classifications and derived values. Data/Schema owns data/schema identity, persistence shape, migration/backfill/cutover and data compatibility.

A process model cannot smuggle a schema change into canonical truth by embedding an arbitrary field definition.

### UI / Generated Experience

The model may express interaction/work needs, actions, information presentation needs and navigation intent. UI owns projection/rendering/accessibility/component behavior.

### AGWS

The model may reference work-surface intents and task/capability exposure needs. AGWS owns governed work-surface composition over `Enterprise -> Station -> Role -> Person`. Presentation/personalization cannot rewrite canonical process semantics.

### Authorization

Process models may reference authority requirements, responsibilities and separation-of-duty constraints. Authorization owns permission truth and evaluation. A modeled actor/role label is not an authorization grant.

### Integration

Process models may declare semantic external-interaction requirements. Integration owns transport, subscription, adapter, replay and remote mutation mechanics. Provider ACK or successful call does not prove process postcondition.

## 10. Provider/binding boundary

**C3.2-DEC-008 — Process/application portability is expressed as semantic requirements evaluated through Provider/Binding support vectors.**

Process/Application Modeling may emit `CapabilityRequirement`s for required realization semantics, for example:

- control-flow feature requirements;
- human-task or approval semantics;
- event/message semantics;
- data/query/update needs;
- UI/work-surface needs;
- external interaction needs;
- offline/degraded requirements;
- audit/evidence requirements;
- tenant/site isolation requirements;
- throughput/latency/capacity requirements.

Provider/Binding owns discovery, qualification, admission, binding, fallback, coexistence and withdrawal.

Unsupported or uncertain dimensions remain explicit. A provider cannot be marked equivalent from a single feature name or successful demo. Provider-specific extensions remain explicit dependencies and may reduce portability.

Canonical process/application identity survives provider substitution; realization identities do not.

## 11. Authority, tenant/site scope and governed mutation

**C3.2-DEC-009 — Canonical model mutation is owner-governed, base-revision-bound and non-amplifying.**

Every material proposal that could change canonical process/application semantics must be qualified by:

- target canonical identity;
- base definition revision;
- proposer/actor/source;
- authority decision/envelope ref;
- tenant/enterprise/site applicability;
- evidence/provenance refs;
- semantic diff;
- affected foreign-owner dependencies;
- unresolved conflicts/unknowns;
- intended resulting revision.

A stale-base proposal cannot overwrite a newer canonical revision through last-write-wins. Concurrent proposals require explicit reconciliation/merge or rejection.

AI, imported provider definitions, AGWS personalization, UI forms, external workflow changes, observed operator behavior or provider discovery cannot grant themselves authority to alter canonical semantics.

Missing tenant/site scope cannot default to global applicability.

## 12. Source of truth and currentness

**C3.2-DEC-010 — The revisioned approved process/application model is source of truth for process/application semantics only.**

The source of truth is not:

- the most recently observed runtime behavior;
- the currently reachable workflow engine;
- a database schema;
- generated UI;
- a provider-native process descriptor;
- a stakeholder's latest unqualified answer;
- an AI summary.

Canonical process/application truth must retain approval/adoption lineage and applicable revision/currentness.

Observed evidence can become stale, contradicted or superseded. Policy/process intent may change after an interview. A previously valid mapping may become invalid after provider/model/schema revision. These conditions reopen qualification rather than rewriting history.

Where evidence is insufficient, the architecture must preserve `INCONCLUSIVE`, `PARTIAL`, `CONFLICTED`, `BLOCKED` or equivalent owner-qualified state.

## 13. Lifecycle, revision, coexistence and graph transformation N->N+1

**C3.2-DEC-011 — Model evolution is an explicit semantic graph transformation; publication creates a new canonical revision, not automatic system-wide migration.**

A proposed transformation from model revision `N` to `N+1` must identify:

- source canonical revision;
- target proposal/revision identity;
- transformation kind/revision;
- semantic diff;
- changed invariants and foreign references;
- compatibility direction;
- affected realization requirements;
- evidence/decision provenance;
- proof/assessment invalidation conditions;
- migration/coexistence implications;
- rollback eligibility assumptions;
- residual old-revision cohorts.

Model-specific compatibility may distinguish, where meaningful:

- backward-compatible semantic extension;
- behaviorally incompatible change;
- conditional compatibility requiring downstream capability support;
- correction of prior semantics;
- supersession without historical rewrite;
- split/merge/recomposition of process/application definitions.

Lifecycle/Versioning owns generic coexistence/migration/withdrawal mechanics. Workflow/Data/UI/Integration/Runtime own their actual migration/effectiveness. Process/Application Modeling owns the semantic compatibility predicate and target postconditions those migrations must satisfy.

Rollback is not implied by historical revision existence; it is a current qualified capability dependent on downstream retained compatibility.

## 14. PARTIAL, UNKNOWN, conflict and reconciliation

**C3.2-DEC-012 — Modeling ambiguity is explicit and cannot be collapsed into canonical completeness.**

Relevant first-class failure/ambiguity conditions include:

- ambiguous identity mapping;
- conflicting stakeholder claims;
- missing owner;
- missing/stale evidence;
- lossy import;
- unsupported source construct;
- stale base revision;
- concurrent incompatible proposal;
- unknown provider support;
- unknown downstream migration state;
- inconsistent story/use-case/workflow/data/permission/acceptance artifacts;
- unresolved exception/rollback/source-of-truth semantics.

`UNKNOWN` concerning a remote mutation remains owned by the execution/integration capability, but Process/Application Modeling must preserve that the required business postcondition is not established.

Architecture Reconciliation later owns desired-vs-observed drift qualification; C3.2 defines the desired canonical process/application semantic side of that comparison.

A contradiction may be a project/runtime `Conflict` record under C1/owner workflow, but no research `ConflictPattern` becomes a `ConflictInstance` merely because this architecture anticipates it.

## 15. Provenance, evidence and audit

**C3.2-DEC-013 — Every canonical revision is evidence- and decision-traceable; provenance does not itself make the revision correct.**

Target model revisions must support links to:

- source elicitation evidence;
- ProcessMirror/Brownfield observations where applicable;
- claims/assumptions/conflicts/decisions;
- requirements/constraints;
- import/normalization transformations;
- semantic diff;
- adoption/approval decision;
- affected foreign owner refs;
- supersession/correction lineage;
- downstream acceptance/product-proof obligations.

Derived stories/use cases/scenarios remain traceable inputs, not canonical proof by themselves. AI-generated summaries preserve source links, dissent and negation; they cannot replace original evidence.

Auditability means the system can explain how a canonical revision was derived and approved, not that the audit trail proves the modeled process is currently obeyed in reality.

## 16. Security, privacy and trust

**C3.2-DEC-014 — Process/application models carry references to security/privacy/trust constraints without absorbing those semantic owners.**

The model must be able to reference, where applicable:

- sensitive information classes and purpose/use constraints;
- retention/residency/legal obligations;
- authentication/authorization requirements;
- separation-of-duty or break-glass requirements;
- trust/provider prerequisites;
- secret/configuration dependencies;
- tenant/site isolation;
- abuse/misuse scenarios;
- audit/evidence expectations.

Sensitive evidence should be referenced/minimized rather than copied into universal model payloads. A process model declaring “manager approval” does not define who is currently a manager or who is authorized to approve; those are foreign owner truths.

## 17. Operability, observability and capacity

**C3.2-DEC-015 — A semantically valid model is not production-ready until its operational obligations are separately elicited and evidenced.**

Process/application definitions must be able to carry/refine operational requirements such as:

- expected volume, peak/burst and concurrency;
- latency/deadlines/business timing;
- queue/backlog tolerance;
- external dependency SLO/SLA assumptions;
- offline/degraded behavior;
- retry/idempotency/reconciliation needs;
- observability/diagnostic evidence requirements;
- recovery/rollback expectations;
- manual/emergency procedures;
- owner/on-call/escalation responsibility;
- cost/usage constraints where material.

These are requirements/constraints, not claims that the eventual realization satisfies them.

No scalar “95% complete” model score may hide unresolved HIGH/CRITICAL operational dimensions.

## 18. C1 Elicitation Lens for Process & Application Modeling

**C3.2-DEC-016 — Process/Application Modeling consumes the C1 EKB and exposes a capability-specific lens; it does not create a separate questionnaire truth store.**

The lens must ask, where applicable, about:

- business purpose, value and explicit non-goals;
- process owner and decision authority;
- operator/end-user perspectives;
- support/operations, security/privacy, finance, audit/regulatory, client/third-party perspectives;
- triggers, preconditions, inputs, activities, decisions, outputs and postconditions;
- exception, failure, retry, rollback, compensation/recovery and terminal-state semantics;
- source-of-truth per semantic concern;
- history/currentness and policy/process change;
- manual/verbal/off-channel/shadow-system workarounds;
- authority/responsibility and revoke/deprovision implications;
- data/privacy/security/trust requirements;
- integration/provider dependencies and `PARTIAL/UNKNOWN` behavior;
- offline/coexistence/migration behavior;
- scale/capacity/observability/operability;
- abuse/misuse scenarios where risk-relevant;
- acceptance/product-proof obligations;
- evidence supporting every critical modeled assumption.

Adaptive routing must reopen questions when an answer is ambiguous, contradictory, stale or creates a cross-capability dependency. It must prevent wizard completion when HIGH/CRITICAL dimensions remain unresolved without disposition.

Coverage remains multidimensional (`UNTOUCHED | DISCOVERING | PARTIAL | RESOLVED | CONFLICTED | BLOCKED | NOT_APPLICABLE | DEFERRED`) rather than a single completeness score.

## 19. Cross-artifact consistency obligations

**C3.2-DEC-017 — Derived artifacts must be consistency-checkable against canonical process/application semantics.**

Later implementation/proof design must be able to detect incompatible claims across:

- user story vs process outcome/value;
- use case vs process pre/postconditions;
- scenario vs exception/failure semantics;
- workflow realization vs canonical process intent;
- permissions vs modeled authority requirements;
- data/schema refs vs required information semantics;
- UI/AGWS surfaces vs allowed actions/responsibilities;
- integrations vs external interaction requirements;
- acceptance criteria vs actual business postconditions;
- operational readiness vs feature-complete claims.

A mismatch is a `Signal` requiring owner-qualified evaluation, not automatically a `ConfirmedConflict`.

## 20. Inherited adversarial proof obligations

The inherited 408 adversarial findings remain active constraints; none is remediated by this decision. C3.2 routes at least these proof-obligation families forward:

1. canonical identity survives provider/workflow/UI/runtime substitution;
2. observed behavior cannot silently become approved canonical process;
3. stakeholder claim cannot become canonical truth without governed qualification;
4. AI `InferredCandidate` cannot become `Requirement`/canonical model without explicit promotion;
5. Brownfield/import normalization exposes lossy/ambiguous/unsupported semantics;
6. contradiction cannot be hidden by summarization or last-write-wins;
7. stale-base/concurrent edit cannot overwrite newer canonical truth;
8. model revision publication cannot claim Workflow/Data/UI/Integration/Runtime convergence;
9. graph transformation N->N+1 invalidates/requalifies affected proofs/assessments;
10. provider support remains multidimensional and provider-specific extensions stay explicit;
11. `PARTIAL`, `UNKNOWN`, stale and insufficient evidence cannot be strengthened to success;
12. tenant/site scope cannot default to global applicability;
13. authority cannot be amplified by UI, AI, provider discovery, mirroring or observed practice;
14. story/use-case/scenario/acceptance artifacts cannot substitute for complete semantic proof;
15. operational/capacity/readiness debt cannot be hidden by feature completeness;
16. cross-capability question routing must preserve canonical semantic owner;
17. physical/peripheral evidence cannot imply generic actuation authority;
18. provenance/correlation cannot be promoted to current truth or causality.

Owner routes remain Process/Application Modeling for canonical semantics, C1 EKB for elicitation/coverage mechanics, UCA for shared structures, and the referenced canonical owner for foreign truth. Planning E must later instantiate executable product proofs for these obligations.

## 21. Planning D migration constraints carried forward

Planning D must later sequence migration without implementation shortcuts. Constraints include:

- retain the current `ProcessMirror -> BusinessRecipe -> Analysis/SystemDefinition` constitutional separation while introducing richer target semantics incrementally;
- do not invalidate or rewrite historical ProcessMirror/BusinessRecipe artifacts;
- introduce stable semantic identity/revision lineage before depending on advanced concurrent-edit/evolution semantics;
- add explicit normalization/adoption states for Brownfield/imported content without treating existing legacy/provider data as complete/current;
- preserve coexistence between current narrower Recipe artifacts and richer Process/Application target definitions;
- avoid coupling process-model revision rollout to Workflow/Data/UI/Integration/Runtime rollout in one atomic migration assumption;
- add provider support qualification without making provider IDs canonical;
- preserve existing evidence/approval lineage while hardening authority envelopes and stale-base handling;
- route application-composition generalization around existing Recipe/Analysis/SystemDefinition boundaries rather than replacing them prematurely;
- treat unsupported/lossy mappings and missing provenance as explicit migration debt, not inferred success.

No migration sequence is executed in C3.2.

## 22. Planning E product-proof candidates carried forward

Planning E must later define tests/proofs demonstrating at least:

- ProcessMirror observation cannot become canonical process merely by import;
- approved canonical process revision retains source/evidence/adoption lineage;
- stale-base concurrent proposal is rejected or explicitly reconciled;
- conflicting stakeholder claims remain visible until owner disposition;
- AI-generated model remains candidate until authorized promotion;
- Brownfield normalization reports unsupported/lossy/ambiguous constructs and blocks false-complete adoption where critical;
- provider/workflow substitution preserves canonical semantic identity while realization identity changes;
- provider-specific extensions are not falsely advertised as portable semantics;
- process revision N->N+1 preserves historical N and produces explicit compatibility/transformation lineage;
- model publication cannot make old workflow/data/UI/runtime cohorts appear migrated;
- tenant/site applicability and authority remain bounded;
- `PARTIAL/INCONCLUSIVE/UNKNOWN` are not collapsed into success;
- story/use-case/workflow/permissions/data/acceptance inconsistencies are detected as qualified signals;
- unresolved HIGH/CRITICAL elicitation dimensions prevent `SUFFICIENT_FOR_*` false-complete transitions;
- operational/readiness dimensions remain distinct from feature/model completeness;
- provider ACK or workflow completion cannot alone prove canonical business postcondition;
- physical/peripheral provider observation cannot become physical truth or generic actuation authority.

## 23. Alternatives considered

### A. Use current `BusinessRecipe` unchanged as the entire Generation 2 process/application target

**Rejected as too narrow.** It is a strong predecessor but does not currently evidence the richer revision, import-normalization, application-composition, compatibility, ambiguity and graph-transformation semantics required by Generation 2.

### B. Promote `SystemDefinition` into canonical business/process truth

**Rejected.** It collapses approved provider-neutral semantics into software realization and violates the existing constitutional `BusinessRecipe != SystemDefinition` separation.

### C. Treat workflow-engine/BPM definitions as canonical process models

**Rejected.** It creates provider lock-in and conflates intended business semantics with one execution realization.

### D. Build a universal semantic god-object containing Process, Data, UI, Authorization and Integration predicates

**Rejected.** It violates Planning A/C0/C3.1 owner-preserving architecture and would make cross-capability change unsafe.

### E. Revisioned provider-neutral Process/Application Semantic Model with explicit foreign references, normalization/adoption and independent realization

**Chosen.** It preserves the strongest existing System Builder process-first contracts while closing Generation 2 gaps without absorbing neighboring owners.

## 24. Semantic owners and affected capabilities

Primary owner: **Process & Application Modeling**.

Key consumers/foreign owners:

- UCA for shared typed/revision/evidence contracts;
- C1 EKB for elicitation, traceability and coverage;
- UI / Generated Experience;
- AGWS;
- Workflow & Durable Execution;
- Integration & Automation;
- Identity;
- Authorization / Organization / Multitenancy;
- Data / Schema / Migrations;
- Provider / Binding;
- Lifecycle / Versioning / Evolution / Migration;
- Architecture Reconciliation;
- Governance / Privacy / Security / Trust;
- Observability / Operations;
- Deployment / Runtime;
- bounded Physical/Peripheral Integration under C2.

No new canonical capability is created.

## 25. C3.2 disposition

- Decision status: **DECIDED / PASS FOR CAPABILITY**.
- Canonical capability: **Process & Application Modeling (2/28)**.
- Target model: **revisioned provider-neutral Process/Application Semantic Model over owner-preserving typed graph contracts**.
- Current `ProcessMirror` and `BusinessRecipe`: **KEEP as strong predecessors; HARDEN/GENERALIZE through Planning D rather than replace**.
- `SystemDefinition`: remains downstream software-facing realization/model boundary, not canonical business truth.
- Workflow/Data/UI/AGWS/Authorization/Integration/provider semantics: **not absorbed**.
- Brownfield/Mirroring: evidence-first normalization/adoption path; no silent canonicalization.
- Generic physical actuation: **not admitted**.
- New findings: **0**.
- New `ConflictPattern`s: **0**.
- `ConflictInstance`s created: **0**.
- Inherited adversarial inventory: **408 remains active and routed**.
- Planning D: **not entered**.
- Planning E: **not entered**.
- Product code / WBS / Work Packages / TASKs / Construction: **not touched**.

C3.2 is complete for its architecture scope. Planning C remains OPEN until all 28 canonical capability target records are decided. The next capability by canonical synthesis order is **C3.3 — UI / Generated Experience / Low-code Builder**; it is not executed in this action.
