# Future Sprint Backlog Schema

Each generated sprint artifact should contain machine-readable metadata plus human context.

```yaml
sprint:
  id: <assigned at instantiation>
  goal: <integrated outcome>
  milestone: <target milestone>
  type: construction | integration_review | corrective
  committed_tasks: []
  optional_ready_tasks: []
  entry_gates: []
  exit_gates: []
```

Each task reference must carry `requirement_id`, `wbs_id`, `work_package_id`, `predecessor_gate_ids`, `contract_versions`, `acceptance`, `evidence`, and expected PR/test outputs.

Optional READY tasks are not silently pulled into a running sprint. They are capacity candidates requiring explicit commitment/change decision.
