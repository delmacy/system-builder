# Machine-readable DAG Contract

The human DAG must later have a machine-readable companion so AgentFactory can calculate readiness instead of inferring it from prose.

```yaml
node:
  id: WP-XX.X.X-A
  kind: work_package
  status: PLANNED | READY | ACTIVE | BLOCKED | DONE
  milestone: Mx
  predecessors:
    - id: WP-YY.Y.Y-A
      type: REQUIRES | CONTRACT_REQUIRES | DATA_REQUIRES | RUNTIME_REQUIRES | VALIDATION_REQUIRES | INFORMS
      gate: <machine-checkable evidence where possible>
  interfaces: []
  outputs: []
  acceptance: []
  evidence: []
```

## Readiness algorithm
A node is READY only when its WBS Dictionary is complete and every blocking predecessor gate evaluates true. `INFORMS` never blocks. `CONTRACT_REQUIRES` evaluates the public contract/version/test gate rather than full predecessor completion.

## Scheduler implication
Future sprint generation queries READY nodes, orders them by milestone/value/risk/criticality, applies capacity constraints, then creates the sprint candidate. It must never schedule a BLOCKED node merely because its nominal sprint number is next.
