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
