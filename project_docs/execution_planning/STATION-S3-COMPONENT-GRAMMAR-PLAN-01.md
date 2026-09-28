# Station S3 — Component Grammar & Catalog — Plan 01

Date: 2026-09-26
Status: PLANNING & MATERIALIZATION
Scope source: `docs/contracts/001-station-component-grammar/ADDENDUM.md`
Predecessor: Station M2 Component Composition/Editor — CLOSED

## Objective

Converge a bounded, testable component grammar and catalog for Station before specialized tools/studios proliferate. Research must produce implementation-ready contracts and a dependency-safe forecast; it must not mutate product merely to demonstrate an idea.

S3 also establishes the paired **Proof Grammar / Test Analysis** model: every promoted construction concept must carry explicit proof obligations before it is considered complete. Tests are designed with the behavior, exercised during Construction, challenged at an intermediate hardening gate and audited again at closure.

## Complexity ladder

C0 Token
C1 Primitive
C2 Compound
C3 Collection
C4 Capability
C5 Pane / Region
C6 Pattern
C7 Template / View
C8 Tool
C9 Application
C10 Studio

Each level must define ownership, allowed dependencies, composition rules, identity semantics, state/action semantics, test obligations and promotion criteria.

## Research sprints

### S3-R1 — Census & parity
Inventory existing Station/ui-core primitives and component contracts. Compare gaps/overlaps against representative ecosystems (Radix/Base/React Aria, shadcn, MUI, Fluent, Carbon, PatternFly, Chakra, Ant and relevant source-owned patterns). Classify adopt/adapt/own/defer; no provider lock-in. Inventory existing proof/test assets alongside the component census so inherited proofs are visible.

### S3-R2 — Compounds & collections
Materialize rules for ButtonGroup/action groups, field/control assemblies, lists, menus, toolbars, tables/collections and related reusable compounds. Explicitly separate semantic intent from primitive visual variants. Define which primitive proofs are inherited and which new composition obligations arise.

### S3-R3 — Interaction capabilities
Classify selection, command/action dispatch, focus, validation, dirty state, drag/drop, resize, ordering, keyboard, accessibility and other reusable capabilities. Determine which are component-owned, shared Station services or projections of existing contracts. Map each capability to state-transition and adversarial proof obligations.

### S3-R4 — Regions & semantic patterns
Define bounded Pane/Region and Pattern grammar: FormActions, ConfirmationActions, DestructiveActions, navigation/tool regions, inspector/layers patterns and named slots. Establish compatibility rules and forbidden arbitrary composition. Define semantic acceptance journeys independently from Playwright implementation syntax.

### S3-R5 — Templates / full views
Research canonical screen/view families and responsive span/grid behavior. Define how declarative structure, layers, inspector and preview remain synchronized projections of one composition model. Define structural/visual proof capable of detecting deformation that semantic assertions may miss.

### S3-R6 — Tool families
Map component/pattern requirements for editor/tool families without constructing full specialized studios. Identify common shared editor foundation versus specialization contracts. Define tool-level critical journeys and coverage inheritance.

### S3-R7 — Studio readiness & Core projection census
Assess what additional contracts are actually required to progress from Tool/Application to specialized Studio. Perform Core Contract Reuse & Station Projection Census before proposing new cross-boundary contracts. Existing Core concepts must be reused/projected where possible rather than duplicated. Define boundary/integration proof obligations without assigning Core authority to Station or QA.

### S3-R7B — Engineering workbench / product-factory benchmark
Before synthesis, run one bounded transversal benchmark against mature engineering-tool families. This round exists to challenge the grammar already discovered, not to create a new complexity level or silently expand product scope.

Study at least:
- Unreal Engine: Tool -> Editor -> System boundaries, specialized editors, asset/tool lifecycle, hierarchy/decision tooling, Behavior Tree/Blackboard separation where relevant, and extensible engineering workbench patterns;
- CAD/CAE families: assembly/product trees, constraints, parametrization, dependencies, regeneration, canonical engineering artifacts, generated files, projections/views, tooling and product/workbench separation;
- JetBrains MPS: language workbenches, grammar/model-driven generation and standalone specialized tooling;
- Eclipse Sirius: semantic model versus multiple synchronized representations/viewpoints;
- Palantir Foundry: ontology-backed operational semantics, application/tool composition and external/client integration boundaries;
- Mendix and representative software-factory/low-code systems: build/deploy/runtime packaging and the degree of producer/client independence;
- Blender/IDE/toolchain families only where they add non-duplicative evidence about workspaces, tools, artifact handling or extensibility.

Benchmark dimensions must include at least:
1. producer/factory versus produced/client-system independence;
2. canonical artifact/model ownership;
3. Tool -> Editor/Workspace -> Studio/System composition;
4. multiple projections over one canonical model;
5. decision/process representation;
6. assembly/dependency/constraint models;
7. file/artifact generation, save/readback and regeneration;
8. extension/plugin boundaries and lock-in implications;
9. authority versus presentation/projection;
10. QA/proof/validation hooks and recoverability;
11. portability and runtime dependency;
12. lessons that can be adopted without importing another product's architecture wholesale.

The output must classify findings as `adopt | adapt | reference-only | reject/defer`, preserve provenance, and explicitly identify which existing S3 decisions are confirmed, challenged or left unresolved. Research evidence does not become construction authority merely because a mature external product uses the pattern.

## Decision Graph / handoff model

S3 synthesis must investigate and materialize a **Decision Graph** as the preferred canonical representation for complex architectural/process decisions. A strict decision tree may remain a projection for human navigation, but must not be treated as canonical when a decision influences multiple downstream branches.

The Decision Graph should be capable of representing:
- question/problem identity;
- provenance and evidence references;
- constraints and authority source;
- considered alternatives;
- accepted decision and rationale;
- rejected/deferred alternatives without erasing history;
- consequences/dependencies;
- inherited decisions;
- proof obligations and evidence status;
- unresolved gaps;
- supersession/revision relationships;
- eligible downstream work.

A handoff should therefore become a **projection of the Decision Graph plus current execution state**, rather than a free-form document that restates or silently reinterprets prior decisions. Candidate projections include tree, dependency graph, timeline, ADR/decision view, contract view and `NEXT_WORK`-style operational view. `docs/current/NEXT_WORK.md` remains the unique operational pointer unless document authority explicitly changes that rule.

The graph must preserve the existing authority model: decisions cannot silently create contract scope; research cannot promote itself to authority; Station projections cannot acquire Core authority; and historical provenance must remain recoverable.

## Proof grammar / Test Analysis dimension

Every promoted level must specify its **proof profile**. Candidate proof types are:
- contract/unit tests for local state and invariants;
- composition/schema validation for allowed parent/slot/variant/reference relationships;
- structural/layout invariants based on discrete spans and responsive proportions;
- interaction/component tests for local state transitions;
- Playwright acceptance journeys for representative end-user behavior;
- visual evidence/regression where structure can deform without semantic failure;
- accessibility and keyboard checks;
- integration/contract tests at Station/Core boundaries without giving Station Core authority.

Not every component needs every test type. Test Analysis chooses the smallest proof set that actually establishes the accepted behavior and risk. Coverage is semantic/risk-oriented rather than a raw test-count target.

A QA coverage record must distinguish at least:
- `proven` — obligation has valid executable/evidentiary proof;
- `failed` — proof ran and contradicted expectation;
- `unproven/gap` — accepted behavior/risk exists but lacks adequate proof;
- `not-applicable` — proof class is intentionally irrelevant.

Absence of evidence must never be silently represented as PASS.

Human-readable acceptance journeys state `action -> expected state transition` so a non-test specialist can audit intended behavior independently of Playwright syntax. Machine proof and human product acceptance remain separate concerns.

## Milestone QA lifecycle

For Construction materialized from S3, use this default lifecycle unless a narrower accepted plan justifies otherwise:

`Planning & Materialization -> Construction A -> Construction B -> Test Review / Hardening -> bounded Construction/rework -> Integration & Review -> QA Coverage/Evidence Review -> Documentation & Closure`

### Planning & Materialization
Declare accepted behavior, invariants, risks and proof obligations. Do not wait until implementation closure to decide what "working" means.

### Construction
Implement behavior and its smallest dependency-safe executable proofs together. Reuse inherited lower-level proofs rather than duplicating them at every composition/system.

### Intermediate Test Review / Hardening
Ask: **what important behavior can still break without any existing proof noticing?** Search for missing journeys, invalid/adversarial states, false-positive tests, structural deformation, accessibility gaps, integration boundary gaps and evidence blind spots. This phase may add/revise tests and materialize bounded corrective slices; it must not invent new product scope.

### Integration & Review
Run applicable exact-head gates and representative journeys against the integration candidate. A green suite proves only its declared obligations, not unspecified behavior.

### QA Coverage / Evidence Review
Produce a human-auditable coverage view by capability/obligation, with links/artifacts where available. Explicitly surface `unproven/gap` entries. Critical unresolved gaps block closure when their accepted risk requires proof; intentional non-critical gaps must be recorded rather than hidden.

### Documentation & Closure
Close only when implementation, accepted proof obligations and evidence agree. "Task implemented" alone is not equivalent to "capability proven".

## Forecast / dependency order

`R1 -> R2 -> R3 -> R4 -> R5 -> R6 -> R7 -> R7B engineering benchmark -> synthesis -> Construction materialization`

Research may run in parallel only where evidence collection is independent. Taxonomy/contract promotion follows the dependency order above. R7B is a bounded challenge/benchmark gate and must not reopen settled scope without explicit evidence and authority.

## Exit gate

S3 Planning/Research is ready for Construction materialization only when:
1. hierarchy and ownership rules are explicit;
2. primitive/compound/pattern catalog gaps are classified;
3. compatibility and composition constraints are testable;
4. span/responsive layout rules are represented without arbitrary pixel authoring;
5. semantic action/pattern rules avoid primitive explosion;
6. Core reuse/projection census identifies any genuine cross-boundary gaps;
7. tool/application/studio complexity is decomposed without prematurely constructing Studios;
8. implementation slices can be materialized with allowed/forbidden/max_files and exact-head evidence;
9. each promoted grammar level has an initial proof profile and inheritance rule;
10. the synthesis can identify both covered obligations and known `unproven/gap` areas without converting unknowns into PASS;
11. R7B has challenged the proposed Tool/Studio/factory model against mature engineering workbenches and recorded adopt/adapt/reference-only/reject-defer findings;
12. Decision Graph semantics and handoff projection responsibilities are sufficiently explicit to avoid free-form handoffs becoming a competing source of authority.

## Explicitly deferred

- broad Studio implementation;
- arbitrary HTML/CSS authoring;
- unbounded theming/personalization;
- new Core/business authority;
- remote publish/deploy/provider runtime scope not separately admitted;
- silent replacement of existing M2 contracts;
- treating a generated test or QA recommendation as product authority by itself;
- copying external CAD/game-engine/low-code architecture without System Builder-specific evidence and authority;
- treating the Decision Graph as a mechanism for silently creating contract scope.
