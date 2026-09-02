# Generation 2 Research — Process & Application Modeling — Revisit 4 / Cycle 5

Status: RESEARCH_ELICITATION; cycle-5 pass complete; NOT SATURATED.

## Research question
How should System Builder model semantic intent, revisions, imported/brownfield observations, attempted/effective realizations and validated postconditions without collapsing model authority into workflow/runtime/provider authority? Which concurrency, normalization, ambiguity and proof semantics must be explicit before synthesis?

## Representatives and evidence ledger
| Representative | Coverage | Evidence / contribution |
|---|---|---|
| Camunda 8 process applications, deployment and instance migration | DEEP | Process-application versions snapshot files; editing/autosave does not affect a cluster until deployment; multiple definition versions can coexist. Migration preserves process-instance identity/history but can create semantically unreachable or invalid states and therefore requires explicit suitability/testing. https://docs.camunda.io/docs/components/modeler/web-modeler/process-applications/process-application-versioning/ ; https://docs.camunda.io/docs/components/modeler/bpmn/automating-a-process-using-bpmn/ ; https://docs.camunda.io/docs/components/concepts/process-instance-migration/ |
| Camunda Web Modeler import/resources | DEEP | Brownfield/import can replace resource content, clears undo/redo history, and may encounter missing/conflicting element-template versions. Imported representation is therefore an observed candidate requiring identity/reference reconciliation, not automatic canonical truth. https://docs.camunda.io/docs/components/modeler/web-modeler/modeling/import-resources/ ; https://docs.camunda.io/docs/8.8/components/modeler/web-modeler/import-diagram/ |
| Mendix version control/model merge | DEEP | Working copies, committed revisions, pulls and merges are distinct; model-level conflicts require intervention. Repository revision alone does not prove semantic merge safety or effective runtime state. https://docs.mendix.com/refguide10/version-control/ |
| Microsoft Dataverse solution layers / ALM | DEEP | Managed/unmanaged layers compose at component level; import/update can succeed while runtime behavior remains controlled by a higher active/managed layer. Effective behavior must therefore be observed separately from attempted/imported revision. https://learn.microsoft.com/en-us/power-platform/alm/solution-layers-alm ; https://learn.microsoft.com/en-us/troubleshoot/power-platform/dataverse/working-with-solutions/changes-not-effective-solution-import |
| ServiceNow source control / update sets / delegated deployment | DEEP | Development source control, production transport, update sets and permissions are distinct mechanisms; publishing snapshots configuration records and delegated permissions are action-specific. Brownfield/customization transport needs explicit provenance and authority. https://www.servicenow.com/docs/r/application-development/servicenow-studio-classic/source-control-integration.html ; https://www.servicenow.com/docs/r/application-development/t_PublishApplicationsToAnUpdateSet.html ; https://www.servicenow.com/docs/r/application-development/delegated-development-and-deployment/developer-permissions.html |
| OMG BPMN 2.0.2 | DEEP | BPMN standardizes process semantics/notation independently of implementation environment, supporting separation between portable model semantics and provider/runtime realization. https://www.omg.org/bpmn/ |

## Source of truth / identity / lifecycle
Canonical semantic intent remains owned by revisioned model units. An imported diagram, discovered legacy application, modeler working copy, deployment package, runtime definition and running instance are related but non-identical facts.

Required identities/facts now include `CanonicalModelUnitIdentity`, `SemanticRevision`, `ObservedModelCandidateIdentity`, `NormalizationDecisionIdentity`, `ModelMutationAttemptIdentity`, `AcceptedSemanticRevision`, `ModelRealizationIdentity`, `EffectiveRealizationRevision`, `ValidationEvidenceIdentity`, `ExecutionInstanceIdentity`, `MigrationPlanIdentity` and `MigrationAttemptIdentity`.

Lifecycle for greenfield: `draft → validate → authorize publication → accepted semantic revision → materialize → deployment attempt → observe effective realization → validate postconditions → execute/consume`.

Brownfield lifecycle adds: `discover/import → preserve source provenance → classify completeness/ambiguity → map to candidate semantics → compare against canonical intent → explicit KEEP/ADOPT/NORMALIZE/REJECT/DEFER disposition → authorized canonical revision if adopted`. Observation never silently rewrites desired semantics.

## Attempted, effective and validated state
A successful commit/import/deploy request is not proof that the intended model is effective. Dataverse explicitly demonstrates that a later/higher solution layer can keep older/different runtime behavior effective after a successful import. Camunda similarly separates editor state, deployed process definition and running instances.

Model evidence therefore needs at least: `attempted_revision`, `accepted_semantic_revision`, `effective_realization_revision`, `validated_revision/profile`, producer, generation, dependencies, freshness, coverage and convergence status. If effective state cannot be determined, status is `UNKNOWN/INCONCLUSIVE`, not inferred from the latest attempt.

## Brownfield discovery and authorized normalization
Import/discovery is an evidence-producing operation. It may reveal unknown fields, missing templates, provider-specific defaults, layered customizations, unreachable process state or semantics not representable in the current portable vocabulary.

Normalization from observed legacy state into canonical desired state is a separate authority-bearing transition. The system must retain what was observed, what mapping was proposed, what information was dropped/approximated, who/what approved it and the resulting new semantic revision. Unknown or provider-specific semantics remain explicit rather than being coerced into a false universal primitive.

## Concurrency, ownership and preconditions
Revision identity alone is insufficient for concurrent model editing. Mendix model conflicts and UCA cycle-5 ownership evidence imply that mutation needs preconditions/ownership over semantic units or fields. A stale AI/user/branch proposal must not overwrite independently changed semantics merely because it can be syntactically applied.

Portable primitives should support expected-base revision/precondition, semantic ownership scope, merge/conflict evidence, and explicit resolution lineage. CRDT/merge strategy remains provider/representation-specific unless later evidence supports generalization.

## Executable composition, transaction boundaries and Workflow ownership
Process/application modeling may define typed operation graphs and references to workflow capabilities, but it must not absorb Workflow & Durable Execution runtime ownership. A model can state orchestration intent, transactional expectations, compensation requirements and consistency constraints; the workflow/runtime capability owns durable execution, retry, timers, in-flight state and provider realization.

Cumulative context belongs to typed semantic composition: composed steps may contribute contextual facts only through declared outputs/scopes/provenance. Hidden mutable context that changes downstream meaning without explicit lineage is not acceptable portable semantics.

Transaction/consistency requirements are declared at the model boundary as invariants/requirements; proof of actual atomicity/isolation/compensation is realization evidence from Data/Workflow/Integration capabilities.

## Topology, tenant/Station and AGWS boundaries
The same accepted semantic model can be realized in collapsed local, distributed, managed or self-hosted topologies without changing canonical semantic identity. Provider/topology revisions create new realization evidence, not new business meaning by default.

Tenant and Station scope constrain visibility, binding and authorized specialization. A Station may expose/project a subset of admitted models but does not clone or acquire canonical ownership. AGWS remains distinct: Personal/Role/Station requests may compose allowed projections/actions; any request that changes canonical entity/process semantics becomes a proposed model revision requiring model authority and deterministic validation.

## Failure semantics
Material failure classes: invalid/incomplete import; ambiguous source mapping; missing referenced template/schema; stale expected base; concurrent semantic conflict; unauthorized normalization; realization attempt acknowledged but effective state unknown; effective realization differs from attempted revision; validation dependency unavailable; technically successful migration with invalid semantic postcondition; unsupported local/offline reference; and stale authority/evidence.

`INCONCLUSIVE` propagates when a required upstream evidence dependency is unavailable or structurally incomplete. Downstream consumers may evaluate independent facts, but must not upgrade incomplete model evidence to PASS.

## Extensibility, provider boundaries, governance, observability, portability
Extensions enter through typed semantic extension points with stable ownership. Provider-specific BPMN/connector/template/solution-layer mechanics remain realization or adapter facts unless proven portable.

Governance remains faceted: observe/import, propose, normalize, merge, publish canonical revision, materialize, deploy, migrate and operate are separate authorities. AI may discover, map, propose and explain; it does not gain publish/migration authority.

Qualified local modeling closure includes required model schemas/vocabularies, referenced semantic contracts, template/extension metadata, validators, trust roots, policy/authority snapshot sufficient for allowed local actions, migration/normalization rules and proof fixtures. It need not include external runtime providers.

## Product-specific vs universal primitives
Do not copy Camunda migration maps/import behavior, Dataverse solution-layer merge rules, Mendix merge mechanics or ServiceNow update-set transport into the universal IR.

Generalization candidates strengthened here: attempted/effective/validated model lineage; observed-candidate→authorized-normalization transition; semantic mutation ownership/preconditions; ambiguity/INCONCLUSIVE propagation; faceted model authority; qualified local modeling closure; and model-declared transaction/workflow requirements without runtime ownership collapse.

## System Builder comparison — evidence boundary
No fresh-main archaeology was performed beyond the research branch in this run because PLANNING_B owns repository-wide implementation reconciliation. Research conclusions therefore remain architecture hypotheses/proof obligations, not claims about current SB implementation.

## Reconciliation hypotheses
- KEEP/HARDEN deterministic semantic identities/validation where later fresh-main archaeology confirms them.
- GENERALIZE attempted→effective→validated lineage for model realization.
- GENERALIZE observed/imported candidate→explicit normalization/adoption lineage.
- GENERALIZE semantic mutation preconditions/ownership and INCONCLUSIVE dependency propagation.
- PROVIDERIZE importer/exporter, merge algorithm, BPMN/runtime-specific compilation and migration execution.
- INTEGRATE external/brownfield systems through provenance-preserving typed mappings.
- REPLACE any path where import, projection, provider defaults or AI output silently rewrites canonical semantics.
- DEFER exact IR, merge algorithm and transaction DSL to synthesis/reconciliation.
- DO_NOT_BUILD a universal execution engine inside Process & Application Modeling.

## Repository-validation questions
1. Can SB represent attempted, accepted, effective and validated model/realization revisions independently?
2. Can brownfield discovery/import preserve source identity, unknown semantics and mapping uncertainty before canonical adoption?
3. Is observation-to-desired normalization explicit and authority-bearing?
4. Are semantic mutations guarded by expected-base/ownership/precondition evidence?
5. Can validation return INCONCLUSIVE when dependencies/coverage are incomplete, with downstream propagation?
6. Does executable composition use explicit typed cumulative context rather than hidden mutable state?
7. Are transaction/consistency requirements modeled without claiming runtime proof before Data/Workflow realization evidence exists?
8. Can one semantic model survive provider/topology substitution with new realization evidence only?
9. Can tenant/Station projections specialize exposure without acquiring canonical model ownership?
10. Does AGWS escalate canonical domain/process mutation requests rather than materializing them as personal UI changes?
11. Can qualified local closure validate allowed model operations offline without runtime-provider control planes?

## Explicit architecture proof backfill
1. **Attempt/effective negative proof:** publish/deploy revision B while an override/layer keeps A effective; evidence must report attempted=B, effective=A and must not claim B validated.
2. **Brownfield ambiguity proof:** import a legacy model with one unmapped/provider-specific semantic construct; preserve source provenance and produce PARTIAL/INCONCLUSIVE mapping rather than silently dropping it.
3. **Normalization authority proof:** discover a provider default/legacy field and attempt automatic canonical adoption under observe-only authority; canonical semantics must remain unchanged until explicit normalize/adopt authority is present.
4. **Concurrent edit proof:** create two edits from the same base over the same semantic unit; commit one, then attempt the stale second edit. Expected result is conflict/revalidation, not silent overwrite.
5. **Dependency-INCONCLUSIVE proof:** remove a required schema/template/validator used by model validation; dependent conformance must be INCONCLUSIVE while independent checks may still run.
6. **Migration postcondition proof:** perform a technically accepted in-flight process migration that would violate a declared semantic invariant; the migration must not become VALIDATED/healthy solely because the engine accepted it.
7. **Composition/transaction boundary proof:** compose a model that declares cumulative context and a transaction/compensation requirement; prove the model preserves typed/provenanced context while runtime guarantees remain unsatisfied until Workflow/Data evidence is attached.
8. **Topology/provider substitution proof:** realize the same accepted semantic revision on two materially different providers/topologies; canonical model identity stays stable while realization/effective/validation lineage differs.
9. **Station/AGWS authority proof:** request a new canonical field/process rule through a Personal/Role surface; AI may propose a model revision but direct canonical mutation is denied/escalated.
10. **Qualified-local-closure proof:** validate/import offline with declared local closure; remove one required schema/template/trust/authority dependency and require explicit degraded/INCONCLUSIVE behavior, not silent online fallback or broadened authority.

## Stable findings
`G2-FINDING-PAM-01..28` remain authoritative.

- **G2-FINDING-PAM-29 — Model Realization Lineage Must Distinguish Attempted, Accepted, Effective and Validated Revisions.** Latest editor/import/deploy state cannot stand in for what is actually effective or semantically validated.
- **G2-FINDING-PAM-30 — Brownfield Import/Discovery Produces an Observed Semantic Candidate, Not Canonical Truth.** Imported content retains source provenance, unknown semantics and mapping uncertainty until an explicit disposition creates canonical lineage.
- **G2-FINDING-PAM-31 — Observation-to-Desired Model Normalization Is a Faceted Authority-Bearing Transition.** Provider defaults, legacy fields or inferred semantics cannot silently enter canonical desired state.
- **G2-FINDING-PAM-32 — Concurrent Semantic Mutation Requires Expected-Base/Ownership Preconditions and Conflict Evidence.** Revision identity without ownership/precondition semantics is insufficient to prevent lost model updates.
- **G2-FINDING-PAM-33 — Incomplete/Ambiguous Model Evidence Must Propagate INCONCLUSIVE Through Dependent Proofs.** Parsing/import success or partial mapping cannot be promoted to semantic conformance when required references/evidence are missing.
- **G2-FINDING-PAM-34 — Executable Composition May Declare Typed Cumulative Context and Transaction Requirements Without Absorbing Workflow/Data Runtime Ownership.** Modeling owns intent/contracts; durable execution and consistency guarantees remain realization evidence.
- **G2-FINDING-PAM-35 — Topology, Provider, Tenant and Station Realization Changes Must Not Redefine Canonical Model Identity.** They alter exposure/binding/realization evidence unless an explicitly authorized semantic revision occurs.
- **G2-FINDING-PAM-36 — Model Authority Must Be Action-Faceted Across Observe/Import/Propose/Normalize/Merge/Publish/Materialize/Migrate/Operate.** Tool/provider capability or AI competence never implies caller authority across those facets.

## Candidate discoveries
- `G2-CAPABILITY-CANDIDATE-PAM-ATTEMPT-ACCEPTED-EFFECTIVE-VALIDATED-LINEAGE` — CROSS_CUTTING / MERGE_TARGET; specialize universal attempt/effective/postcondition lineage with semantic publication.
- `G2-CAPABILITY-CANDIDATE-PAM-BROWNFIELD-OBSERVED-CANDIDATE-NORMALIZATION` — CROSS_CUTTING / CONSOLIDATION_CANDIDATE; reconcile with authorized normalization transition across Data/Config/Deployment.
- `G2-CAPABILITY-CANDIDATE-PAM-SEMANTIC-MUTATION-OWNERSHIP-PRECONDITIONS` — CROSS_CUTTING / CONSOLIDATION_CANDIDATE; reconcile with UCA concurrency ownership/preconditions.
- `G2-CAPABILITY-CANDIDATE-PAM-INCONCLUSIVE-MODEL-EVIDENCE-DEPENDENCY` — CROSS_CUTTING / MERGE_TARGET; reconcile with unified evidence dependency/convergence qualification.

No candidate is promoted in this pass. Adaptive Governed Work Surfaces remains distinct.

## Value / risk / priority / next question
Value critical; risk high where brownfield import, concurrent edits, provider layers or AI proposals can be mistaken for effective canonical semantics. Eight material findings reset consecutive-no-material to 0; Process & Application Modeling remains NOT SATURATED. Next rotation: UI / Generated Experience / Low-code Builder revisit 4 / cycle 5, testing attempted/effective projection lineage, authority, constrained generation, semantic validation, provider/topology independence and explicit proof backfill against PAM/UCA cycle-5 primitives.