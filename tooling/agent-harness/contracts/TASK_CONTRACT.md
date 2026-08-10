# Task Contract v0

A machine-validatable schema will be created in TASK-001. Until then every task should declare the following metadata:

```yaml
id: SB-XX-000
title: Short imperative title
status: ready
priority: 100
milestone: M1
model_tier: free | cheap | architecture
risk: low | medium | high
architecture_impact: false
executor_preference: opencode | codex | any
depends_on: []
context_paths: []
allowed_paths: []
forbidden_paths: []
max_files: 4
validation: []
```

Required body sections:

1. Objective
2. Context/current behavior
3. Required change
4. Inputs/contracts
5. Outputs/contracts
6. Acceptance criteria
7. Non-goals
8. Evidence expected
9. Escalation condition

A routine cheap/free task must not require the executor to invent architecture.
