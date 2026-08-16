---
id: TASK-080
title: Integrate capability-driven Compiler and Runtime rendering
status: ready
priority: 386
milestone: M5
model_tier: cheap
risk: high
architecture_impact: true
executor_preference: any
depends_on:
  - TASK-079
context_paths:
  - AGENTS.md
  - docs/current/PROJECT_STATE.md
  - docs/current/CURRENT_MILESTONE.md
  - project_docs/schedule/SPRINT_MODE.md
  - project_docs/execution_planning/P4-PACKAGE-01.md
  - project_docs/execution_planning/P4-CAPABILITY-RUNTIME-01.md
  - docs/adr/ADR-0002-autonomous-runtime.md
  - docs/adr/ADR-0007-release-environment-deployment.md
  - docs/architecture/MASTER_BLUEPRINT.md
  - project_docs/08-compiler/WBS.md
  - project_docs/10-deploy/WBS.md
  - project_docs/13-autonomous-runtime/WBS.md
  - packages/compiler/runtime-capabilities.ts
  - packages/compiler/index.ts
  - packages/runtime-core/index.ts
  - packages/deploy/local-process.ts
  - tests/product/compiler.test.ts
  - tests/product/runtime-core.test.ts
  - tests/product/local-process-deploy.test.ts
  - tests/product/local-deployment.test.ts
  - tests/product/full-autonomous-local-e2e.test.ts
  - specs/tasks/TASK-079-CAPABILITY-MATERIALIZATION-INPUT.md
  - specs/tasks/TASK-080-CAPABILITY-DRIVEN-RUNTIME-RENDERING.md
allowed_paths:
  - packages/compiler/index.ts
  - packages/runtime-core/index.ts
  - packages/deploy/local-process.ts
  - tests/product/compiler.test.ts
  - tests/product/runtime-core.test.ts
  - tests/product/local-process-deploy.test.ts
  - tests/product/local-deployment.test.ts
  - tests/product/full-autonomous-local-e2e.test.ts
  - specs/tasks/TASK-080-CAPABILITY-DRIVEN-RUNTIME-RENDERING.md
forbidden_paths:
  - apps/**
  - packages/contracts/**
  - packages/catalog/**
  - packages/assembly/**
  - packages/release/**
  - packages/artifact-store/**
  - tooling/agent-harness/**
  - .github/**
max_files: 9
validation:
  - npm run test:product
  - npm run verify
---

# Objective

Wire TASK-079 into real compilation and make the generated durable state HTTP surface exist only when the selected AssemblyPlan capability materializes it.

# Context

TASK-079 supplies a Compiler-local deterministic mapping from an exact selected AssemblyPlan capability tuple to the bounded PostgreSQL `RuntimeStateRequirement`. P4-POSTGRES-STATE-01 already supplies migration application, persistent Runtime state and PostgreSQL execution. Revalidation before implementation also identified predecessor local-deployment/full-autonomous tests that encode the former unconditional counter behavior and therefore must be updated as integration evidence.

# Current behavior

Compiler materializes state only from caller-supplied `stateRequirements`; Runtime always renders the `/state/counter/increment` route and falls back to an in-memory counter when no state requirement exists; local Deploy probes the counter whenever any SecretResolver is supplied. Two predecessor higher-level product tests consequently assert state for unrelated capabilities.

# Required change

Compiler must derive state requirements from the AssemblyPlan materializer and combine them deterministically with the legacy explicit `stateRequirements` input for predecessor compatibility, rejecting duplicate capability ownership. The generated persistent Runtime must expose `POST /state/counter/increment` only when a materialized `state.counter` requirement exists. Local Deploy must invoke the bounded counter proof only when verified artifact migration/capability evidence says the state capability is present; unrelated secret-bearing runtimes must no longer receive an unconditional state action. Update directly affected predecessor tests to assert health/deployment success without state for unrelated capability definitions.

# Inputs / contracts

TASK-079 materializer output, existing Compiler AssemblyPlan input, `RuntimeStateRequirement`, verified migration preflight evidence, ADR-0002/0007 and WBS 08/10/13.

# Outputs / contracts

Capability-driven generated migration/runtime assets and bounded local Deploy behavior. Existing explicit `stateRequirements` input remains a compatibility path; no canonical Release/Environment/Deployment schema changes.

# Acceptance criteria

- selected reference `state.counter` AssemblyPlan component generates migration manifest/files and PostgreSQL-backed Runtime without caller-supplied stateRequirements;
- absent capability generates no migration state assets and no state action surface;
- unsupported provider/version fails before ReleaseArtifact creation;
- explicit predecessor stateRequirements remain supported when not duplicated;
- duplicate derived + explicit state capability fails deterministically;
- local Deploy preserves health-only/no-state paths even when a SecretResolver exists;
- directly affected predecessor local-deployment/full-autonomous tests no longer assert counter state for unrelated definitions;
- stateful Deploy still applies migrations before activation and observes consecutive persisted increments;
- no secret value/reference is embedded into immutable generated assets;
- ADR-0002/ADR-0007 remain preserved;
- positive, negative and predecessor tests pass;
- declared validations pass.

# Non-goals

General action routing, multiple capability families, canonical schema changes, production provider loading, dependency solving or full E2E SystemDefinition/Catalog proof (TASK-081).

# Evidence expected

Compiler, Runtime Core, local Deploy and directly affected higher-level product tests proving capability-selected state generation, absent-capability route removal, legacy explicit-state compatibility, duplicate/unsupported failure and state/no-state deployment behavior, plus Deterministic CI.

# Escalation

Stop if implementation requires `packages/contracts/**`, changes the Builder/Runtime boundary, requires a new canonical Release/Environment/Deployment field, or otherwise introduces an undeclared L4 decision.
