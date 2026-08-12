# I1 — First Implementation Queue

## Purpose
Translate the approved I1 Work Packages into the first executable task contracts without committing a numbered sprint.

## READY / conditional set

### TASK-012 — Execution contracts
Status: **READY**. This is the first AgentFactory implementation task and produces the public execution-state/gate/result vocabulary consumed by the remainder of I1.

### TASK-013 — OpenCode adapter hardening
TASK-011 is now completed. TASK-013 remains **BLOCKED by TASK-012** until the execution request/result contracts it must consume are accepted.

### TASK-014 — DAG / READY evaluator
Status: **BLOCKED by TASK-012** until the execution/gate contracts are accepted.

## Initial dependency view

```text
TASK-009 completed
      ↓
TASK-012 Execution Contracts
      ├───────────────┐
      ↓               ↓
TASK-014           TASK-013
DAG/READY          OpenCode Hardening
      │               │
      └──────┬────────┘
             ↓
     next eligible I1 WPs
             ↓
 Task Pack / Harness / Validation /
 Evidence / GitHub / Ledger / Recompute
             ↓
       I1 ignition proof

TASK-011 OpenCode fix — completed prerequisite of TASK-013
```

## Selection rule
Sequential-first operation selects TASK-012 now. After it is accepted, recompute readiness and select TASK-014 or TASK-013 based on integration value and current gates. Parallel work is optional, never inferred from numbering.

## Rolling-wave rule
Further I1 implementation tasks must be generated after accepted predecessor outputs clarify the concrete interfaces. Use the approved Work Package DAG and actual merged contracts; avoid speculative downstream interfaces.
