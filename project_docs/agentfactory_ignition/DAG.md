# AgentFactory Ignition DAG

```text
01 Governance
   ->02 Planning Data Model
      ->03 DAG Engine
         ->04 Task Decomposer
            ->05 Sprint Planner

01 Governance ->06 Model Router
02 Planning Data Model ->10 Evidence Engine
03 DAG Engine ->12 State/Ledger

06 Model Router ->07 OpenCode Adapter
07 OpenCode Adapter ->08 Execution Harness
08 Execution Harness ->09 Validation Engine
09 Validation Engine ->10 Evidence Engine
10 Evidence Engine ->11 GitHub Integration
11 GitHub Integration ->12 State/Ledger
12 State/Ledger ->13 Replanning Engine
03 DAG Engine ->13 Replanning Engine
13 Replanning Engine ->14 Review Cycle
10 Evidence Engine ->15 Metrics & Economics
12 State/Ledger ->15 Metrics & Economics
03/08/11/12/14/15 ->16 Operations
```

## Critical ignition path
01 -> 02 -> 03 -> 06 -> 07 -> 08 -> 09 -> 10 -> 11 -> 12 -> I1.

Task Decomposer/Sprint Planner become mandatory for I3, not for first single-task proof.

## I2 supplemental operations gate

`TASK-028 + TASK-031 -> WP-I2-02 -> WP-I2-03 -> supervisor readiness reassessment -> I2 candidate run`.

This refines only the local reliability/operator slice needed before the authorized candidate. It does not satisfy the full `03/08/11/12/14/15 -> 16 Operations` dependency, enable I3 or authorize parallel scheduling.
