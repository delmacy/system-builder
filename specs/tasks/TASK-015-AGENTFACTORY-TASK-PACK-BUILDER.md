---
id: TASK-015
title: Implement the AgentFactory Task Pack builder
status: completed
priority: 39
milestone: I1
model_tier: cheap
risk: medium
architecture_impact: false
executor_preference: codex
depends_on:
  - TASK-012
  - TASK-014
context_paths:
  - AGENTS.md
  - project_docs/agentfactory_i1/README.md
  - project_docs/agentfactory_i1/WBS_DICTIONARY.md
  - project_docs/execution_governance/READINESS_AND_DONE.md
  - specs/tasks/TASK-015-AGENTFACTORY-TASK-PACK-BUILDER.md
  - tooling/agent-harness/src/execution-contracts.ts
  - tooling/agent-harness/src/dag.ts
  - tooling/agent-harness/src/task.ts
  - tooling/agent-harness/src/harness.ts
allowed_paths:
  - tooling/agent-harness/src/task-pack.ts
  - tooling/agent-harness/src/harness.ts
  - tooling/agent-harness/tests/**
  - specs/tasks/TASK-015-AGENTFACTORY-TASK-PACK-BUILDER.md
forbidden_paths:
  - packages/**
  - apps/**
  - docs/adr/**
  - tooling/agent-harness/src/dag.ts
  - tooling/agent-harness/src/execution-contracts.ts
max_files: 10
validation:
  - npm run verify
---

# Objective

Implement a deterministic Task Pack builder for one typed, dependency-ready AgentFactory task.

# Context

TASK-012 now provides versioned TaskRecord/executor contracts and TASK-014 provides deterministic readiness results. The existing harness prepares a Markdown context bundle, but it does not yet consume those I1 contracts or produce a reproducible versioned Task Pack manifest for downstream routing/execution.

# Current behavior

`prepareTask` loads a repository task, checks basic completed dependencies and writes a bounded pack plus an ignored manifest. Downstream I1 components cannot yet consume a typed pack that binds the TaskRecord, readiness decision, source commit, authoritative context, scope, acceptance and validations.

# Required change

Add a narrow Task Pack builder that consumes an accepted TaskRecord, its repository task source, a TASK-014 readiness result, pinned source commit and declared context contents. Validate inputs fail-closed and emit deterministic pack content plus a versioned manifest/hash. Integrate it with the existing preparation path without weakening current context-size, path or dependency guards.

# Inputs / contracts

TASK-012 `TaskRecord`, TASK-014 `DagEvaluation`/node readiness, the existing parsed `Task`, repository context expansion and the current Task Pack/manifest conventions.

# Outputs / contracts

A runtime-validated Task Pack manifest and deterministic builder output containing task/WP traceability, source commit, readiness evidence, bounded context paths, allowed/forbidden paths, acceptance IDs, validation commands, stop conditions and the execution-result contract version.

# Acceptance criteria

- A task absent from the supplied readiness result or not evaluated `READY` is rejected.
- TaskRecord identity, scope and validation must match the repository task contract; mismatches fail closed.
- Unsafe/missing context paths and context above the existing 300 KB cap remain rejected.
- Identical pinned inputs produce byte-identical pack content and manifest/hash fields; volatile preparation time is not part of the deterministic payload.
- The pack contains no undeclared repository context and exposes enough data for routing/OpenCode without reconstructing chat history.
- Existing `task:prepare` behavior remains supported for current callers while using the new builder boundary.
- `npm run verify` passes.

# Non-goals

Model selection, OpenCode invocation, DAG traversal changes, branch creation, independent validation, evidence persistence, GitHub lifecycle, product code or UI.

# Evidence expected

Builder schemas/types, deterministic fixtures, mismatch/unsafe-context tests, integration coverage for `prepareTask`, changed files and passing `npm run verify`.

# Escalation

Stop if implementation requires changing TASK-012/TASK-014 public semantics, weakening context/scope guards, adding undeclared context or modifying product/architecture boundaries.
