# Task Contract v1

Every `specs/tasks/TASK-*.md` file is parsed as Markdown with YAML frontmatter and validated by both the Zod runtime schema in `src/task.ts` and `task-contract.schema.json`.

Required metadata:

```yaml
id: TASK-123-DESCRIPTIVE-SUFFIX
title: Short imperative title
status: draft | ready | running | verification | completed | blocked | failed | superseded
priority: 100
milestone: M1
model_tier: free | cheap | architecture
risk: low | medium | high
architecture_impact: false
executor_preference: opencode | codex | any
depends_on: []
context_paths:
  - specs/tasks/TASK-123-DESCRIPTIVE-SUFFIX.md
allowed_paths:
  - packages/example/**
forbidden_paths:
  - packages/other/**
max_files: 4
validation:
  - npm run test:unit
```

Required body sections:

1. Objective
2. Context
3. Current behavior
4. Required change
5. Inputs / contracts
6. Outputs / contracts
7. Acceptance criteria
8. Non-goals
9. Evidence expected
10. Escalation

Rules:

- Every dependency ID must exist and the graph must be acyclic.
- A ready task is selectable only when every dependency is completed.
- Context paths are repository-relative, bounded to 300 KB and cannot contain `..`.
- Verification checks forbidden paths, allowed paths, untracked files and `max_files` before running task commands.
- A `free` task must not require an unresolved L3/L4 decision.
