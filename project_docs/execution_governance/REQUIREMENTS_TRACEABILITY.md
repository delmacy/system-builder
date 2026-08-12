# Requirements Traceability Matrix (RTM)

Every executable item must remain traceable to approved scope and verification evidence.

## Required chain

```text
Requirement -> WBS -> Work Package -> Activity/Task -> Dependency Gate -> Test/Acceptance -> Evidence -> Increment/Release
```

## Minimum record

```yaml
requirement:
  id: REQ-...
  source: <approved source>
  statement: <testable requirement>
  wbs_ids: []
  work_package_ids: []
  task_ids: []
  acceptance_ids: []
  evidence_ids: []
  release_ids: []
  status: PLANNED | IN_PROGRESS | VERIFIED | DEFERRED | CHANGED
```

## Rules
- No coding task is READY without at least one approved requirement/scope reference, except explicitly classified corrective infrastructure work.
- One requirement may map to many WPs/tasks; one task may satisfy multiple requirements.
- Traceability must be bidirectional: from requirement to evidence and from changed artifact back to requirement.
- A requirement is `VERIFIED` only when its acceptance evidence exists; code completion alone is insufficient.
- New business behavior discovered during execution is a change candidate, not an implicit requirement.
- RTM changes that alter approved requirement meaning require change control.

## AgentFactory use
The planner must reject orphan tasks and report requirements whose implementation exists without verification evidence or whose evidence became stale after a contract change.
