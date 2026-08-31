---
id: TASK-431
title: Prove clean deterministic factory E2E reproducibility
status: blocked
priority: 431
milestone: M19
model_tier: architecture
risk: medium
architecture_impact: false
executor_preference: any
depends_on:
  - TASK-430
context_paths:
  - AGENTS.md
  - project_docs/execution_planning/P19-FACTORY-E2E-01.md
  - package.json
  - scripts/**
  - packages/contracts/factory-boundary/**
  - tests/product/**
allowed_paths:
  - scripts/**
  - packages/contracts/factory-boundary/fixtures/**
  - tests/product/**
  - specs/tasks/TASK-431-P19-FACTORY-E2E-CLEAN-REPRODUCIBILITY.md
forbidden_paths:
  - packages/runtime-core/**
  - apps/**
  - packages/postgres/**
  - packages/contracts/decision-boundary/**
max_files: 10
validation:
  - npm run test:product
  - npm run check:tasks
  - npm run check:architecture
  - npm run verify
---
# Objective
Define clean deterministic local prerequisites/input fixtures for the repository E2E command and prove repeated clean invocations produce equivalent auditable lineage and result identity without hidden mutable state.

# Context
TASK-430 provides the supported command. WBS 19.1.3 specifically requires reproducibility from documented clean prerequisites rather than success that depends on prior test/process state.

# Current behavior
The integrated product proof demonstrates deterministic composition, but clean command-level reproducibility and independence from prior mutable invocation state are not yet explicit Sprint evidence.

# Required change
Add the minimum canonical local fixture/input support and product proof needed to execute the repository command twice from equivalent clean prerequisites and compare deterministic result/provenance evidence. Inputs must reuse canonical schemas/contracts rather than inventing a second domain representation.

# Inputs / contracts
TASK-430 command, canonical factory-boundary inputs and repository-owned deterministic fixtures only.

# Outputs / contracts
Clean reproducibility evidence showing equivalent deterministic output/provenance across independent equivalent invocations and no reliance on hidden prior state.

# Acceptance criteria
- clean prerequisites and input fixture(s) are repository-owned and deterministic;
- fixture structure is derived from existing canonical contracts rather than duplicate domain models;
- two equivalent clean invocations produce equivalent auditable journey/result identity;
- proof does not depend on network, database, prior command output, publication or runtime state;
- no external side effect is introduced;
- declared validations pass.

# Non-goals
Operator bootstrap UX, environment provisioning, runtime materialization, external database/services, publication/deployment execution or WBS 19.2.1+.

# Evidence expected
Growing/product proof executing independent equivalent command invocations and comparing canonical stage/result identities/provenance, with explicit evidence that no previous output is consumed.

# Escalation
Stop if clean reproducibility requires a new persistence model, external service, runtime topology or undeclared L4.