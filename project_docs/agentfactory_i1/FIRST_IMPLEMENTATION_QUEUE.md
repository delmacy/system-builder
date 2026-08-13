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
Status: **COMPLETED**. It materializes reproducible bounded executor context from the actual TASK-012/TASK-014 outputs.

### TASK-016 — Model Router v1
Status: **COMPLETED**. It deterministically selects or blocks/escalates an explicit TASK-012 execution route.

### TASK-017 — Execution harness enforcement
Status: **COMPLETED**. It binds the accepted TASK-013/015/016 outputs around one executor invocation and fails closed on workspace, identity, pack, route or repository-delta violations.

### TASK-018 — Independent validation gate
Status: **COMPLETED**. It consumes the TASK-017 boundary and independently evaluates scope, required commands, evaluator changes and validation-time repository mutation.

### TASK-019 — Evidence writer
Status: **READY**. It composes TASK-017 execution and TASK-018 validation into deterministic append-only TASK-012 evidence.

### TASK-020 — GitHub lifecycle adapter
Status: **READY**. It independently hardens PR/check/review eligibility against the TASK-017/018 identity and validation outputs.

## Initial dependency view

```text
TASK-012 Execution Contracts — completed
      ├──────────────────────┐
      ↓                      ↓
TASK-014 completed       TASK-013 completed
DAG/READY                OpenCode Hardening
      ↓                      │
TASK-015 completed           │
Task Pack                    │
      └──────────┬───────────┘
                 ↓
       TASK-017 completed
       WP-I1-06 Harness Enforcement
                 ↓
       TASK-018 completed
       WP-I1-07 Independent Validation
              ├────────────→ TASK-019 READY (WP-I1-08 Evidence)
              └────────────→ TASK-020 READY (WP-I1-09 GitHub)

TASK-012 completed -> TASK-016 Model Router — completed
                              └───────────────→ TASK-017 completed
```

## Selection rule
Sequential-first operation selects TASK-019, then independent TASK-020. WP-I1-10 remains blocked until TASK-019 is accepted. Product M1 tasks remain outside the active execution focus.

## Rolling-wave rule
Further I1 implementation tasks must be generated after accepted predecessor outputs clarify the concrete interfaces. Use the approved Work Package DAG and actual merged contracts; avoid speculative downstream interfaces.
