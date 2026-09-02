# Generation 2 Research — Process & Application Modeling — Revisit 3 / Cycle 4

Status: RESEARCH_ELICITATION; cycle-4 pass complete; NOT SATURATED.

## Research question
Do the cycle-4 UCA primitives — revision-bound realization lineage, evidence qualification, profile/context/operation compatibility, qualified local closure and decision/execution authority separation — remain valid for model-centric systems without importing infrastructure/provider assumptions? How should canonical model revision, executable process revision and in-flight instance evolution coexist?

## Representatives and evidence ledger
| Representative | Coverage | Evidence / contribution |
|---|---|---|
| Camunda 8 process application/versioning + instance migration | DEEP | Application versions snapshot model files; deployed process definitions can coexist; running instances migrate only through an explicit source→target plan with validation/mapping, preserve instance identity/history, and may legally remain on older definitions. Migration is transactional but semantic suitability remains operator responsibility. https://docs.camunda.io/docs/components/modeler/web-modeler/process-applications/process-application-versioning/ ; https://docs.camunda.io/docs/components/concepts/process-instance-migration/ |
| Mendix model/version control + deployment packages | DEEP | App-model revisions are repository identities independent from deployment package identity; branches/merges may create model inconsistencies even without textual conflicts; versioned packages are reproducibly tied to a repository revision. https://docs.mendix.com/refguide/version-control/ ; https://docs.mendix.com/refguide/create-deployment-package-dialog/ |
| ServiceNow update-set transport | PARTIAL | Customization transport is explicit, role-governed and version-direction sensitive; moving newer customizations to older platform versions can cause errors/data loss. https://www.servicenow.com/docs/r/application-development/system-update-sets/t_RetrieveAnUpdateSet.html |
| OMG BPMN 2.0.2 | DEEP | Standard semantic notation distinguishes process/collaboration/choreography viewpoints; notation identity does not define deployment or migration authority. https://www.omg.org/bpmn/ |
| Prior Mendix/Dataverse/ServiceNow modeling evidence | DEEP | Cycle-3 evidence remains authoritative: canonical data/application semantics, process logic and projections are distinguishable model layers with explicit dependencies. |

## Source of truth / identity / lifecycle
The canonical model revision is authoritative for semantic intent; compiled/deployed definitions are realizations, and running instances are historical/effective consumers of a particular realized revision. One model may therefore have multiple simultaneously valid realizations and in-flight revisions.

Required identities: `CanonicalModelUnitIdentity`, `SemanticRevision`, `ProcessDefinitionIdentity`, `ProcessRevision`, `ModelRealizationIdentity`, `ExecutionInstanceIdentity`, `MigrationPlanIdentity`, `MigrationAttemptIdentity`, and qualified evidence tied to exact source/target revisions.

Lifecycle: `draft → validate → publish semantic revision → compile/materialize realization → deploy/admit → instantiate → observe`; evolution adds `new revision → compatibility assessment → coexist OR migration plan → validate → authorize → execute migration → post-migration conformance evidence`. Migration does not rewrite history.

## Versioning, compatibility and failure semantics
Compatibility is not inferred from version order or successful parsing. Camunda permits old/new process versions to coexist and requires explicit mappings for active-instance migration; some active semantics are preserved rather than recreated, so migration success does not prove business-semantic equivalence. Mendix likewise warns that merges can introduce model errors even when no merge conflict is detected.

Failures include: invalid model revision; realization/build failure; stale realization; incompatible semantic reference; unsupported migration mapping; partial/unknown evidence; successful technical migration with semantically unsafe state; unavailable local interpretation dependency; and unauthorized canonical mutation. `UNKNOWN/INCONCLUSIVE` is required when evidence freshness/coverage is insufficient.

## Extensibility, provider boundaries, governance and observability
Model vocabularies may extend through owned semantic units and typed extension contracts; engine-specific BPMN/runtime constructs remain realizations unless promoted into portable semantics. Provider/runtime selection cannot become canonical-model identity.

Governance separates authority to propose/analyze a model change, publish canonical semantics, admit a realization, approve migration, execute migration and operate an instance. AI may generate candidate revisions/mappings but cannot acquire canonical mutation or migration authority.

Evidence lineage should connect `semantic revision → validation → realization → deployment/admission → execution instance → migration plan/attempt if any → observed postconditions`, qualified by producer, scope/profile, freshness, coverage and trust.

## Portability / qualified local closure
Offline/self-hosted model autonomy requires enough local closure to interpret and validate the model and its references: schemas/vocabularies, validators, referenced contracts, migration rules, trust material and conformance tests. It does not require bundling every runtime provider. Thus UCA's qualified local closure remains useful without importing infrastructure assumptions.

## Product-specific vs universal primitives
Do not copy Camunda element-mapping rules, Mendix repository/package formats or ServiceNow update sets into the universal IR. Reusable primitives strengthened here are `SemanticRevision`, `RealizationLineage`, `CompatibilityDecision`, `MigrationPlan/Attempt`, `EvidenceQualification`, `DecisionAuthorityRef`, `ExecutionAuthorityRef`, and `ClosureProfile`.

## Convergent/divergent patterns and subcapabilities
Convergence: definition revision ≠ deployed realization ≠ running instance; multiple revisions may coexist; migration is explicit and evidence-bearing; deployment/technical validity does not prove semantic compatibility; model history remains traceable. Divergence: Camunda has rich in-flight process migration, Mendix emphasizes whole-app revision/build lineage, ServiceNow emphasizes instance-to-instance customization transport.

Subcapabilities: canonical semantic model; typed reference graph; process/application revisioning; realization lineage; coexistence/compatibility assessment; in-flight migration planning; migration evidence; qualified model interpretation closure; governed model mutation; projection/process/domain authority separation.

## System Builder comparison — fresh main only
A directed default-branch search for `ProcessDefinition workflow process model migration SystemDefinition` returned no precise match in this run. This is bounded negative search evidence only, not repository-wide absence. Dedicated archaeology remains reserved for PLANNING_B.

## Reconciliation hypotheses
- KEEP/HARDEN stable semantic identities and deterministic validation where fresh-main archaeology confirms them.
- GENERALIZE definition→realization→execution lineage and revision-qualified compatibility evidence.
- GENERALIZE migration as plan/attempt/evidence rather than mutation of historical identity.
- PROVIDERIZE engine-specific compilation/deployment/migration execution.
- INTEGRATE external model systems through typed references and compatibility profiles.
- REPLACE any path where projection/process tooling silently mutates canonical domain semantics.
- DEFER exact IR and migration schema to synthesis/reconciliation.
- DO_NOT_BUILD a universal executable language that collapses domain, process, UI and provider runtime semantics.

## Repository-validation questions
1. Can fresh main distinguish semantic revision, generated artifact/runtime realization and execution instance identities?
2. Are model references compatibility-checked by revision/profile, not merely resolvable?
3. Can multiple semantic/process revisions coexist while running instances remain bound to their effective revision?
4. Is there any migration-plan/attempt/evidence abstraction, or only replacement/redeploy semantics?
5. Can validation evidence identify exact model revision and validation profile?
6. Can offline validation close over schemas, referenced contracts and trust without provider control-plane access?
7. Are AI/model-analysis decisions separate from authority to publish canonical semantics or migrate instances?
8. Can Station exposure project a subset of canonical models/capabilities without cloning semantic ownership?

## Adaptive Governed Work Surfaces
AGWS remains distinct. A Personal/Role/Station surface is a projection over admitted semantic revisions. Revalidation on Station/Role change uses compatibility/evidence qualification; a request to add a canonical field/process rule becomes a candidate canonical revision and authority escalation. Surface rollback resets projection lineage, not canonical model history. Provider-bound actions remain capability references rather than embedded provider semantics.

## Symbiotic Proof
Publish model/process revision R1, materialize it locally and run instances; publish compatible R2 while R1 instances continue; prove a new surface validates against R2 without changing canonical semantics; create a migration plan for selected R1 instances, validate it, require separate approval/execution authority, migrate and capture qualified postcondition evidence; prove an AI request for a new canonical field is escalated; then remove network/control-plane access and re-run model/reference validation from the declared local closure.

## Stable findings
`G2-FINDING-PAM-01..22` remain authoritative.

- **G2-FINDING-PAM-23 — Semantic Revision, Realization Revision and In-flight Execution Revision Must Coexist Without Identity Collapse.** A newly published model does not retroactively redefine already materialized or running semantics.
- **G2-FINDING-PAM-24 — Model Migration Is a Governed Plan/Attempt/Evidence Transition, Not Version Pointer Reassignment.** Source/target mappings, validation, authority and postconditions require independent lineage.
- **G2-FINDING-PAM-25 — Technical Migration Success Does Not Prove Semantic Compatibility.** Preserved runtime state and changed model semantics can yield technically valid but business-invalid outcomes; compatibility remains explicit qualified evidence.
- **G2-FINDING-PAM-26 — Model Validation Evidence Must Be Revision/Profile-Bound and May Be Inconclusive.** Successful parse/reference resolution is insufficient when semantic profile, freshness, coverage or trust is unknown.
- **G2-FINDING-PAM-27 — Qualified Local Closure Applies to Model Interpretation Without Owning Runtime Providers.** Offline model autonomy closes validators, vocabularies, references, migration rules and trust needed for the requested operation, not every external realization.
- **G2-FINDING-PAM-28 — Model Analysis/Generation Authority and Canonical Mutation/Migration Authority Are Constitutionally Distinct.** AI or tooling may propose revisions and migration maps but cannot publish or execute them by implication.

## Candidate discoveries
- `G2-CAPABILITY-CANDIDATE-MODEL-REVISION-REALIZATION-EXECUTION-COEXISTENCE` — CROSS_CUTTING / MERGE_TARGET; likely specialization of unified revision-bound realization lineage.
- `G2-CAPABILITY-CANDIDATE-SEMANTIC-MIGRATION-PLAN-ATTEMPT-EVIDENCE` — CROSS_CUTTING / CANDIDATE; promote only if schema/data/workflow/runtime migration research converges on shared ownership.
- `G2-CAPABILITY-CANDIDATE-QUALIFIED-MODEL-INTERPRETATION-CLOSURE` — CROSS_CUTTING / MERGE_TARGET; likely specialization of qualified local closure profile.

## Value / risk / priority / next question
Value critical; risk high if new definitions silently redefine running semantics or if technically successful migration is treated as semantic proof. Six material findings reset consecutive-no-material to 0; Process & Application Modeling remains NOT SATURATED. Next rotation: UI / Generated Experience / Low-code Builder cycle 4, stress-testing projection realization/version/evidence against these model boundaries while preserving AGWS as distinct.