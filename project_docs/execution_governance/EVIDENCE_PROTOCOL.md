# Execution Evidence Protocol

Each executor run must produce a structured result that can be consumed without reconstructing chat history.

```yaml
execution_result:
  schema_version: 1
  task_id: TASK-...
  work_package_id: WP-...
  source_commit: ...
  executor:
    adapter: opencode
    model: ...
  status: DONE | FAILED | BLOCKED | NEEDS_DECISION
  changed_files: []
  tests:
    - command: ...
      status: PASS | FAIL | NOT_RUN
      evidence: ...
  acceptance:
    - id: AC-...
      status: PASS | FAIL
      evidence: ...
  contracts_changed: []
  migrations_changed: []
  risks_discovered: []
  issues_discovered: []
  change_requests: []
  follow_up_candidates: []
  dependency_gates_satisfied: []
  dependency_gates_blocked: []
  dag_effects: []
  metrics:
    attempts: 1
    execution_duration_seconds: null
    review_duration_seconds: null
    token_or_provider_cost: null
  notes: ...
```

## Rules
- `DONE` requires DoD evidence, not a self-declaration.
- Missing mandatory evidence converts completion to `FAILED`/`BLOCKED` as appropriate.
- Free-form prose may supplement but never replace required structured fields.
- Evidence is append-only/auditable for historical execution; corrections create linked records rather than rewriting history invisibly.
- The planner uses verified gate evidence to recompute READY status.
