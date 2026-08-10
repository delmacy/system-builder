# System Builder — Master Blueprint

## 1. Canonical pipeline

```text
REAL BUSINESS
  -> ELICITATION
  -> PROCESS MIRRORING
  -> BUSINESS RECIPE
  -> HUMAN VALIDATION
  -> SYSTEM ANALYSIS
  -> SYSTEM DESIGN
  -> SYSTEM DEFINITION
  -> CAPABILITY RESOLUTION
  -> SYSTEM ASSEMBLER
  -> ASSEMBLY PLAN
  -> VALIDATION
  -> COMPILER
  -> RELEASE ARTIFACT
  -> DEPLOYMENT
  -> AUTONOMOUS RUNTIME
  -> REAL OPERATION
  -> SUPPORT / EVOLUTION
  -> new Recipe version when business changes
```

The early stages are knowledge-heavy and may use AI extensively. After SystemDefinition, behavior should become increasingly deterministic and reproducible.

## 2. Knowledge Plane

### SB-01 Mirror

Purpose: understand real operation from interviews, documents, spreadsheets, APIs, legacy systems, logs and observation.

Output concept:

```text
ProcessMirror
  actors
  activities
  inputs
  outputs
  decisions
  exceptions
  responsibilities
  documents
  informationFlows
  systems
  evidence
```

### SB-02 Recipe

Purpose: convert observation into approved, technology-independent business knowledge.

```text
BusinessRecipe
  organization
  businessDomains
  actors
  businessObjects
  processes
  responsibilities
  rules
  exceptions
  approvals
  policies
  informationFlows
  documents
  integrations
  indicators
  constraints
  volumes
  criticality
```

Business Recipe is modular and versioned through Recipe Fragments and Recipe Modules.

A ProcessMirror says, 'this was observed.' A BusinessRecipe says, 'this is the approved operational rule.'

## 3. Design Plane

### SB-03 Analysis

Purpose: determine what software is required to implement a BusinessRecipe.

Inputs: BusinessRecipe, business catalog, software/capability catalog, process patterns, constraints and sizing.

Output:

```text
SystemAnalysis
  requirements
  capabilityMatches
  gaps
  adaptations
  customCapabilities
  integrations
  securityRequirements
  sizing
  infrastructureNeeds
  architecturalDecisions
```

### SB-04 Design

Purpose: translate analysis into the logical source of the client system.

Output:

```text
SystemDefinition
  metadata
  entities
  processes
  workflows
  actions
  capabilities
  views
  roles
  permissions
  policies
  integrations
  environmentRequirements
  deploymentRequirements
```

BusinessRecipe != SystemDefinition: the former describes the business; the latter describes how SB materializes it.

## 4. Catalog

### SB-05 Catalog

System Builder maintains two distinct assets:

```text
BUSINESS CATALOG              SOFTWARE CATALOG
Recipe Fragments              Capabilities
Recipe Modules                Components
Process Patterns              Connectors
Business Templates            Runtime packages
```

System Analysis bridges the two catalogs.

A third-party implementation may participate when it respects the appropriate contract.

## 5. Factory Plane

### SB-06 Assembly

Resolves SystemDefinition against catalog/registry, versions and dependencies.

Output: `AssemblyPlan`, the software equivalent of a Bill of Materials.

### SB-07 Validation

Validates traceability from approved business requirements through system definition, selected capabilities, tests and build. Validation must answer whether the delivered software actually implements the approved recipe.

### SB-08 Compiler

Transforms a validated AssemblyPlan into a reproducible ReleaseArtifact. Responsibilities may include manifest/schema/migration generation, frontend/server build, bundling, assets, environment schema and hashes.

Compiler should not rely on free-form AI for deterministic build steps.

### SB-09 Release

Manages immutable versioned artifacts and provenance.

Suggested lifecycle:

`DRAFT -> VALIDATED -> BUILT -> STAGING -> PRODUCTION -> DEPRECATED -> ARCHIVED`

Release metadata includes recipe version, definition hash, compiler version, runtime version, capability versions, migrations, artifact hash and test evidence.

### SB-10 Deploy

Binds a Release to an Environment/Infrastructure Profile.

`Release + Environment = Deployment`.

Initial target is intentionally simple: Node + Docker + PostgreSQL. More topologies are future concerns.

## 6. Execution Plane

### Runtime

Runtime executes the client product only: auth, APIs, views, actions, workflows, database, jobs, events, integrations and files.

It does not contain Mirror, Recipe authoring, Analysis, Builder Canvas, Compiler or Release management.

### SB-11 Observe

Receives telemetry from runtimes without becoming a runtime dependency. Observe may be replaced by external OpenTelemetry-compatible stacks.

`Observe OFF -> Runtime still operates.`

### SB-12 Support / Evolution

Closes the lifecycle. Classify requests as Support, Maintenance or Evolution. Process changes return to Mirror/Recipe and produce a new version/release.

## 7. Compatibility-first modernization

A client can adopt only one process. Existing ERP/legacy systems remain untouched except for necessary integration contracts. Migration can expand incrementally using the Strangler Fig pattern.

## 8. Replaceable suite

The complete SB suite is a reference implementation of the full pipeline. A user may install/use only some applications and combine them with third-party tools if contract compatibility is preserved.

Horizontal interoperability: replace an SB suite stage.
Vertical interoperability: integrate generated client systems with existing enterprise systems.

## 9. AI role

AI is strongest in ambiguous work: elicitation, discovery, analysis, gap detection, system design and suggestions.

Deterministic engines dominate dependency resolution, validation, compilation, release and runtime.

Principle: **AI interprets; contracts formalize; engines execute.**

## 10. Autonomous-system acceptance test

First fundamental proof:

1. Build/publish Gestão Técnica through the pipeline.
2. Turn System Builder off.
3. Gestão Técnica login, APIs, database, workflows, jobs and integrations remain operational.
4. Turn Builder back on, change the definition, publish another release and upgrade safely.
5. Build a second unrelated client system without cloning Gestão Técnica as the platform foundation.

When these hold, the factory model is proven.
