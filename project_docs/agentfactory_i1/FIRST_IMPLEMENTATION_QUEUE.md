# I1 — First Implementation Queue

## Purpose
Translate the approved I1 Work Packages into the first executable task contracts without committing a numbered sprint.

## READY / conditional set

### TASK-012 — Execution contracts
Status candidate: **READY** after this planning PR merges. Produces the public execution-state/gate/result vocabulary consumed by the remainder of I1.

### TASK-013 — OpenCode adapter hardening
Status candidate: **BLOCKED_BY_TOOL_GATE** until TASK-011 is merged/reconciled with current main. It is otherwise independent enough to progress in parallel with the contract/DAG branch.

### TASK-014 — DAG / READY evaluator
Status candidate: **BLOCKED** until TASK-012 is accepted.

## Initial dependency view
```text
TASK-012 Execution Contracts
      ↓
TASK-014 DAG/READY Evaluator
      ↓
future Task Pack Builder
      ↓
future Harness/Evidence/State chain

TASK-011 OpenCode fix
      ↓
TASK-013 OpenCode Adapter Hardening
      └──────────────┐
                     ↓
                 I1 integration
```

## Selection rule
Sequential-first operation should select TASK-012 first. TASK-013 may proceed in parallel only after its TASK-011 gate is satisfied and review capacity exists.

## Not yet generated
Further I1 implementation tasks should be generated after TASK-012 clarifies the exact public execution contracts, avoiding speculative interfaces in downstream task specs.
