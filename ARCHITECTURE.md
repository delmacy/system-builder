# System Builder Architecture

## Purpose

System Builder is a modular suite and software factory for transforming business processes into autonomous client systems.

## Conceptual planes

```text
KNOWLEDGE PLANE
Mirror -> Business Recipe

DESIGN PLANE
Analysis -> System Design -> SystemDefinition

FACTORY PLANE
Catalog -> Assembly -> Validation -> Compiler -> Release -> Deploy

EXECUTION PLANE
Autonomous Runtime -> Observe -> Support/Evolution
```

## Canonical transformation chain

```text
Evidence
  -> ProcessMirror
  -> BusinessRecipe
  -> SystemAnalysis
  -> SystemDefinition
  -> AssemblyPlan
  -> ValidatedAssembly
  -> ReleaseArtifact
  -> PublishedRelease
  -> Deployment
  -> ExecutingSystem
```

Every arrow must eventually be represented by a versioned contract.

## Suite applications

01 Mirror
02 Recipe
03 Analysis
04 Design
05 Catalog
06 Assembly
07 Validation
08 Compiler
09 Release
10 Deploy
11 Observe
12 Support / Evolution

These are product/bounded-context divisions. They do not imply twelve microservices or twelve repositories.

## Two orthogonal suite axes — Generation 2 research clarification

The accepted architecture already defines an open **factory/lifecycle suite**: specialist applications cooperate to understand, design, assemble, release, deploy and evolve systems. Generation 2 research is also testing a second, orthogonal **capability/composition suite**: reusable specialist capabilities and domain modules from which autonomous client systems are composed.

The candidate formation is:

```text
COMPLETE SYSTEM BUILDER
  = factory/lifecycle suite
  + capability/runtime suite and catalog
  + composition/resolution/governance/evidence mechanisms

CLIENT SYSTEM
  = governed subset/composition of required modules + capabilities
  + workflows/processes + authority + interfaces
  + provider bindings + topology/environment realization
```

A client system is therefore not expected to ship the complete Builder suite. It materializes only the selected dependency/capability closure required by its `SystemDefinition` and environment. Conversely, the complete SB reference product may know about/provide a much broader catalog of capabilities and specialist tools.

Candidate Generation 2 rule:

> Modules aggregate coherent domain semantics; capabilities expose reusable semantic abilities/operations; workflows compose operation invocations together with durable control, human handoff, approval, wait and transition semantics; providers realize mechanics without redefining portable semantic identity.

This clarification does not imply microservices or one container per module/capability. Semantic composition remains independent from physical topology.

Research authority and synthesis questions are recorded in `project_docs/generation-2/research/concepts/SYSTEM_BUILDER_SUITE_COMPOSITION_FORMATION.md`. This section is a Generation 2 research clarification and does not silently amend accepted ADRs before architecture reconciliation/change control.

## Semantic assembly-line process model — Generation 2 research clarification

Generation 2 also preserves a user-directed mental model for runtime process composition: **the process advances longitudinally while reusable capabilities are consumed transversally**.

```text
INPUT
  ↓
Saga / Process Stage
  ↔ Capability operations
  ↔ Human / agent work
  ↔ External providers
  ↓
Gate / transition condition
  ↓
Next Stage
  ↔ other capabilities
  ↓
Gate
  ↓
...
  ↓
OUTPUT
```

The model is analogous to an assembly line surrounded by specialist stations/robotic arms. The item travelling on the line is the process/workflow instance; specialist stations are capability operations or human-work stations; quality checkpoints are gates/evidence-qualified transition conditions; providers are the concrete machinery/vendors that realize required mechanics.

Candidate rules:

> **The process advances longitudinally; capabilities are accessed transversally.**

> **A saga stage may use several capabilities, human handoffs, waits, decisions and external effects before its transition gate is satisfied.**

> **A system is a governed composition of processes, rules, people/authority, data, interfaces and capabilities, resolved into a validated, buildable, deployable and autonomous realization.**

The analogy is not a requirement for linear workflows: loops, branches, parallelism, fan-out/fan-in, compensation and subworkflows remain first-class concerns. Capability "layers" in a visual tool are not assumed to be canonical priority levels or deployment boundaries; synthesis must determine whether layers represent capability families, domains, exposure/trust sectors or merely a visualization/projection.

The model also distinguishes two scales of assembly:

```text
SYSTEM ASSEMBLY (design/build time)
Processes + Rules + Authority + Data + Capabilities + Interfaces
  → SystemDefinition
  → Capability/Provider Resolution
  → Assembly / Validation / Build / Release / Deploy
  → Autonomous Runtime

PROCESS-RESULT ASSEMBLY (runtime)
Input
  → saga stages / gates
  ↔ reusable capabilities / human work / providers
  → business outcome / Output
```

These two forms of assembly are related but must not collapse into one semantic lifecycle. Detailed research authority, proof obligations and synthesis questions are recorded in `project_docs/generation-2/research/concepts/SEMANTIC_ASSEMBLY_LINE_PROCESS_MODEL.md`.

## Physical direction

Start as a modular monorepo. Proposed target:

```text
apps/
  builder/
  runtime/

packages/
  contracts/
  mirror/
  business-recipe/
  analysis/
  design/
  catalog/
  assembly/
  validation/
  compiler/
  release/
  deployment/
  observability/
  support/
  runtime-core/
  capability-sdk/
  workflow/
  actions/
  ui/

tooling/
  agent-harness/
```

A package may later become another repository/service only when an operational reason exists.

## Control Plane vs Execution Plane

System Builder is the Control Plane: authoring, analysis, catalog, assembly, releases and deployment management.

Client runtimes are the Execution/Data Plane: authentication, APIs, views, actions, workflows, data, jobs, files and integrations.

Normal runtime operations must never require a live call to System Builder.

## Deployment invariant

`Release + Environment = Deployment`.

Build artifacts must not embed deployment secrets. Environment-specific configuration is supplied at deployment/runtime.

## Integration invariant

Client modernization is incremental. A newly generated system may replace one process while the remainder continues in legacy ERP, databases, spreadsheets or external applications.

See the detailed blueprint and ADRs for authoritative decisions.
