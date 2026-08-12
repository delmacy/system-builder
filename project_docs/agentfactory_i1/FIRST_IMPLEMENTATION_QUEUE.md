# I1 — First Implementation Queue

## Purpose
Translate the approved I1 Work Packages into the first executable task contracts without committing a numbered sprint.

## READY / conditional set

### TASK-012 — Execution contracts
Status: **COMPLETED**. The versioned execution-state/gate/request/result vocabulary is integrated.

### TASK-013 — OpenCode adapter hardening
Status: **COMPLETED**. The adapter now consumes versioned requests when supplied and returns structured results with bounded timeout/attempt behavior.

### TASK-014 — DAG / READY evaluator
Status: **COMPLETED**. Deterministic graph validation, ordering and READY/BLOCKED explanations are integrated.

### TASK-015 — Task Pack builder
Status: **READY**. It consumes the actual TASK-012 contracts and TASK-014 readiness output to materialize reproducible bounded executor context.

### TASK-016 — Model Router v1
Status: **READY**. It consumes the actual TASK-012 route vocabulary and approved routing policy without runtime LLM decisions.

## Initial dependency view

```text
TASK-012 Execution Contracts — completed
      ├──────────────────────┐
      ↓                      ↓
TASK-014 completed       TASK-013 completed
DAG/READY                OpenCode Hardening
      ↓                      │
TASK-015 READY               │
Task Pack                    │
      └──────────┬───────────┘
                 ↓
       WP-I1-06 Harness Enforcement

TASK-012 completed -> TASK-016 Model Router — READY
```

## Selection rule
Sequential-first operation selects TASK-015 next because it is on the I1 critical chain. TASK-016 is independently READY and must be accepted before the later WP-I1-06 harness-enforcement integration task is generated/executed. Parallel work remains optional, never inferred from numbering.

## Rolling-wave rule
Further I1 implementation tasks must be generated after accepted predecessor outputs clarify the concrete interfaces. Use the approved Work Package DAG and actual merged contracts; avoid speculative downstream interfaces.
