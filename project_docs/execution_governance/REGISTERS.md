# Project Control Registers

Keep these registers small, structured and version-controlled.

## Assumption Log
```yaml
- id: ASM-...
  statement: ...
  validation_due: ...
  affected_wps: []
  status: OPEN | VALIDATED | INVALIDATED
```
An assumption is not silently promoted to a requirement.

## Issue Log
```yaml
- id: ISSUE-...
  description: ...
  severity: LOW | MEDIUM | HIGH | CRITICAL
  affected_paths: []
  owner_role: ...
  resolution: ...
  status: OPEN | RESOLVED | CLOSED
```
Occurred risks become issues when applicable.

## Decision Log
Material technical decisions should normally reference an ADR.
```yaml
- id: DEC-...
  question: ...
  decision: ...
  rationale: ...
  authority: ...
  adr: null
  affected_wps: []
```

## Lessons / process improvements
Capture recurring execution/review failures, estimate calibration and agent/model performance. Promote stable lessons into task templates, routing rules, quality gates or architecture fitness checks rather than relying on conversational memory.
