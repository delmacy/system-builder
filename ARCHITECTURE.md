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
