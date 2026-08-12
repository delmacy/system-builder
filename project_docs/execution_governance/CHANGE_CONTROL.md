# Operational Change Control

Execution discoveries are classified before action.

## Classes

### CURRENT_GOAL_DEFECT
Implementation does not satisfy already-approved acceptance. Bounded correction may remain in the active task/sprint.

### DECOMPOSITION_REFINEMENT
Approved scope is unchanged, but future WP/task/DAG detail needs correction. Update planning artifacts traceably.

### FOLLOW_UP_WITHIN_SCOPE
New executable work is necessary to complete an already-approved deliverable but is outside the active task. Create a successor/corrective item and reevaluate DAG readiness.

### ARCHITECTURE_DECISION_REQUIRED
Existing authoritative architecture/contracts do not answer a material decision. Block affected work and request ADR/architect review.

### SCOPE_CHANGE
Adds/removes/changes an approved deliverable, requirement meaning or acceptance boundary. Requires formal change approval before execution.

### EMERGENCY_CORRECTION
Time-critical integrity/security/production correction. Use bounded emergency procedure, preserve evidence, and perform retrospective reconciliation.

## Change record

```yaml
change:
  id: CHG-...
  class: ...
  discovered_by: ...
  affected_requirements: []
  affected_wps: []
  affected_contracts: []
  dag_impact: []
  risk_impact: ...
  decision: PENDING | APPROVED | REJECTED | DEFERRED
  approval_evidence: ...
```

## Rule
An executor reports discoveries; it does not silently turn them into implementation scope.
