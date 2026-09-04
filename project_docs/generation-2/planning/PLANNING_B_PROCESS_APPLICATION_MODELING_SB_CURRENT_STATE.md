# Generation 2 — Planning B: Process & Application Modeling — SB Current State Reconciliation

Status: COMPLETE_FOR_CAPABILITY — CURRENT_STATE_RECONCILED / PASS_FOR_CAPABILITY
Capability: Process & Application Modeling
Fresh-main anchor: `d8760c7f08757bb164a758ae0c3f0a4a1752464b`
Authority inputs: fresh `main`, `PLANNING_A_PROCESS_APPLICATION_MODELING_BOUNDARIES.md`, accepted repository architecture/ADR contracts.

This document is repository archaeology only. It does not alter product code, invent target architecture, materialize WBS/TASKs, execute Construction, or enter Planning C.

## 1. Current semantic pipeline

Current SB has an explicit process-first knowledge-to-software chain: observed evidence becomes `ProcessMirror`; approved technology-independent behavior becomes `BusinessRecipe`; analysis translates recipe requirements toward `SystemDefinition`; downstream assembly/compiler/release/runtime remain separate. ADR-0001 constitutionally preserves `BusinessRecipe != SystemDefinition`, and the Master Blueprint keeps ProcessMirror and BusinessRecipe in the Knowledge Plane rather than treating runtime/provider definitions as canonical business truth.

Disposition: **KEEP**.

## 2. ProcessMirror implementation evidence

`packages/contracts/process-mirror/process-mirror.schema.json` is a closed JSON Schema 2020-12 contract with a `ProcessMirror` discriminator and explicit observed-at timestamp, actors, activities, decisions, exceptions, responsibilities, documents, information flows, systems, evidence, uncertainties and pending points. Relevant claims carry confidence/evidence references. Evidence records preserve source type/reference, capture time and optional digest. The contract explicitly says observation is not approval; identity/version/provenance are delegated to the public artifact envelope.

This is a strong current predecessor for evidence-backed process discovery and for distinguishing observed reality from canonical approved behavior.

Disposition: **KEEP + HARDEN**.

Gap: the schema represents observations well but does not evidence a generic import/normalization result with explicit faithful/lossy/unresolved semantic mappings, source/provider identity context, transformation revision, or `PARTIAL/INCONCLUSIVE` adoption qualification as required by Planning A.

## 3. BusinessRecipe implementation evidence

`packages/contracts/business-recipe/business-recipe.schema.json` is a closed JSON Schema 2020-12 contract for approved technology-independent business behavior. It requires an approved timestamp, typed source-Mirror artifact identity/version, modules, rules, responsibilities, exceptions and approvals. Modules/rules/responsibilities/exceptions carry requirement/evidence references. `packages/contracts/business-recipe/index.ts` exposes stable artifact type, schema ID and schema version constants.

The contract therefore evidences approved semantic knowledge, source lineage to ProcessMirror and contract-level schema versioning independently from software realization.

Disposition: **KEEP + HARDEN + GENERALIZE**.

Gap: the implemented Recipe shape is narrower than the richer canonical model described by repository architecture (organization, business domains/objects, processes, policies, information flows, documents, integrations, indicators, constraints, volumes and criticality). No current-main evidence inspected here establishes first-class model revision compatibility predicates, concurrent-edit base revisions/conflict resolution, fragment/module revision lineage, correction/supersession semantics or explicit normalized-import adoption states.

## 4. Identity, version and lineage

Current SB uses provider-neutral artifact references/types/schema IDs/schema versions for ProcessMirror and BusinessRecipe. Product evolution tests construct explicit references such as `artifact:process-mirror:*:v2` and `artifact:business-recipe:*:v2`, and `EvolutionKnowledgeLink` deterministically binds evolution evidence to both canonical knowledge identities without execution/apply authority. This is evidence that current process knowledge identity is not inherently a BPM/provider resource ID.

Disposition: **KEEP + HARDEN**.

Gap: artifact/schema versioning and explicit evolution links do not yet prove the Planning-A multidimensional model-revision semantics: base revision, concurrent proposal conflict detection, semantic compatibility between revisions, correction/supersession lineage, or independent qualification of downstream convergence.

## 5. Evolution path

Current product tests evidence a controlled support/evolution path that links an Evolution request to ProcessMirror and BusinessRecipe identities. Repository architecture also states that process changes return to Mirror/Recipe and produce a new version/release. This correctly preserves changed business requirement versus software defect as distinct concepts.

Disposition: **KEEP + HARDEN**.

Gap: current evidence does not establish a complete canonical model-edit lifecycle with stale-base rejection, concurrent merge/reconciliation, semantic diff, or model-specific rollback eligibility across Workflow/Data/UI/Integration/Runtime owners.

## 6. Brownfield and import normalization

`docs/architecture/LEGACY_MODERNIZATION.md` explicitly adopts strangler-first modernization, preserves legacy systems outside the migrated process, requires supported integration boundaries where available, rollback/coexistence and explicit data ownership. It also labels richer modernization mapping as future capability.

This is sound policy but not evidence of implemented canonical brownfield import/normalization contracts.

Disposition: **KEEP policy + GENERALIZE future semantic normalization**.

Current-main gap: no inspected implementation establishes `discover -> normalize -> explicit adopt` for external process/application models, typed lossy/unresolved mapping results, transformation lineage, or prevention of name/first-match equivalence. Provider-native definitions therefore must continue to be treated as external evidence/realization rather than assumed canonical truth.

## 7. Application-model breadth

The Master Blueprint's `SystemDefinition` owns the software-facing logical model (entities, processes, workflows, actions, capabilities, views, roles, permissions, policies, integrations and environment/deployment requirements), while BusinessRecipe remains technology-independent. This separation is architecturally correct.

Disposition: **KEEP**.

Gap: current evidence does not show a dedicated canonical application-composition model between approved business semantics and concrete `SystemDefinition` that captures revisioned provider-neutral application intent without absorbing Data/UI/Workflow/Integration ownership. Whether Generation 2 needs such a distinct contract or can harden existing Recipe/Analysis/Definition boundaries remains a later architecture decision; Planning B records the gap without inventing the answer.

## 8. Downstream compiler/runtime dependency boundary

The canonical repository pipeline places ProcessMirror/BusinessRecipe upstream of SystemAnalysis/SystemDefinition/AssemblyPlan/compiler. Runtime is explicitly forbidden from containing Mirror, Recipe authoring, Analysis or Compiler. This is strong evidence that current semantic process truth is not intended to depend on runtime availability or a workflow provider.

Disposition: **KEEP**.

No evidence inspected here shows ProcessMirror or BusinessRecipe identity coupled to BPM-engine IDs, database table IDs, routes or generated release IDs.

## 9. Portability and providerability

Provider-neutral JSON contracts, public artifact identity/schema metadata, the process-first ADR and replaceable-suite architecture are strong portability predecessors. A third-party stage may participate when it respects the appropriate contract, while canonical business knowledge remains technology-independent.

Disposition: **KEEP + HARDEN + INTEGRATE** with Provider/Binding and Standards in later phases.

Gap: current Process/Application contracts do not themselves expose qualified provider support vectors or explicit realization constraints for partial semantic support. Planning A's requirement that unsupported/lossy semantics remain visible is therefore not yet evidenced as implemented here.

## 10. AI and authority boundary

Repository architecture assigns AI primarily to ambiguous elicitation/discovery/analysis/design and deterministic engines to later factory/runtime stages. ProcessMirror preserves confidence/evidence and BusinessRecipe requires explicit approvals. These are useful predecessors for AI-as-proposer rather than canonical authority.

Disposition: **KEEP + HARDEN**.

Gap: current-main evidence inspected here does not establish a generic proposal contract carrying base revision + authority envelope + immutable provenance, nor a fail-closed escalation path when an AI proposal would alter domain/schema authority or silently adopt ambiguous imported semantics.

## 11. Planning-A validation answers

1. **Canonical storage/lineage:** current canonical predecessors are versioned ProcessMirror and BusinessRecipe artifact contracts plus explicit evolution knowledge links. Full model revision lineage is not evidenced.
2. **Imported vs adopted semantics:** architectural policy distinguishes legacy boundaries, but implemented normalized/adopted semantic states are not evidenced.
3. **Provider IDs as canonical identity:** no inspected evidence shows this coupling; current contracts are provider-neutral.
4. **Concurrent/stale edits:** not evidenced as implemented for process/application models.
5. **Revision coupling:** architecture explicitly separates Recipe from SystemDefinition/release/runtime; no inspected evidence proves improper coupling.
6. **UI/AGWS/AI mutation:** no AGWS implementation was found in its prior Planning-B pass; generic AI authority-safe model mutation is not evidenced here.
7. **Lossy/ambiguous imports:** explicit `PARTIAL/INCONCLUSIVE` normalization semantics are not evidenced.
8. **Provider capability differences:** not evidenced in these process/application contracts; must remain a Provider/Binding-qualified concern.
9. **Rollback eligibility:** cross-owner qualified model rollback is not evidenced.

## 12. Maturity assessment

- Process-first constitutional separation: **STRONG / IMPLEMENTED AS CONTRACT + ARCHITECTURE**.
- Observed process evidence model: **STRONG CONTRACT PREDECESSOR**.
- Approved business semantic model: **IMPLEMENTED BASELINE, NARROWER THAN G2 TARGET BOUNDARY**.
- Provider-neutral identity/schema versioning: **STRONG PREDECESSOR**.
- Evolution linkage back to Mirror/Recipe: **IMPLEMENTED PREDECESSOR**.
- Brownfield semantic normalization/adoption: **POLICY ONLY / NOT EVIDENCED AS IMPLEMENTED CONTRACT**.
- Concurrent/stale model editing and semantic compatibility: **NOT EVIDENCED**.
- Application-composition revision model: **PARTIAL/AMBIGUOUS; LATER ARCHITECTURE DECISION REQUIRED**.
- Qualified support/lossiness/currentness: **NOT EVIDENCED IN THIS CAPABILITY**.
- AI proposal authority envelope/escalation: **NOT EVIDENCED AS GENERIC MODELING CONTRACT**.

## 13. Reconciliation disposition

**KEEP** the process-first pipeline, ProcessMirror/BusinessRecipe distinction, evidence-backed observation, explicit approval, provider-neutral artifact identities and runtime/factory separation.

**HARDEN** model revision lineage, semantic compatibility, stale/concurrent proposal handling, correction/supersession, explicit downstream non-convergence and AI proposal authority/provenance.

**GENERALIZE** brownfield/import normalization and application-model semantics only where evidence-backed Planning C later establishes a reusable contract; do not create a semantic god-object.

**INTEGRATE** later with UCA qualified evidence/revision primitives, Provider/Binding support qualification, Lifecycle coexistence, and downstream semantic owners without transferring their ownership.

No evidence supports `REPLACE`, and no provider-specific process engine should become canonical by default.

## 14. Result

**PASS_FOR_CAPABILITY / CURRENT_STATE_RECONCILED.** Current SB already has unusually strong process-first and provider-neutral knowledge-contract foundations. The Generation 2 gap is principally hardening/generalization around revision semantics, brownfield normalization/adoption, concurrency, qualified ambiguity/support and governed proposal authority—not replacement of the existing ProcessMirror -> BusinessRecipe -> Analysis -> Definition constitutional chain.

No product code, Work Package, executive TASK, Construction, PR or worker handoff was executed.