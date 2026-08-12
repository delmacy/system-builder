# Current Execution Milestone — I1 AgentFactory Single Task Autonomous

## Goal

Prove the smallest end-to-end delivery slice in which one approved READY task can be prepared, executed through the bounded OpenCode adapter, independently validated, evidenced, integrated and used to recompute successor readiness.

## Ignition baseline already complete

- [x] System Builder scope/WBS and dependency planning baseline.
- [x] AgentFactory ignitive project WBS and Work Packages.
- [x] Execution governance, DoR/DoD, risk, quality, RACI and evidence policies.
- [x] I1 Work Package DAG and exit gate.
- [x] TASK-011 OpenCode argument-order correction merged with green CI.
- [x] TASK-012/013/014 executable task contracts integrated.

## I1 near-horizon queue

- [ ] TASK-012: implement AgentFactory execution contracts — **execute first**.
- [ ] TASK-014: implement deterministic DAG/READY evaluator — requires completed TASK-012.
- [ ] TASK-013: harden OpenCode adapter — requires completed TASK-011 and TASK-012.
- [ ] Generate the next bounded I1 task(s) from accepted predecessor outputs and `project_docs/agentfactory_i1/WORK_PACKAGES.md`.
- [ ] Continue through task-pack builder, model routing, harness enforcement, independent validation, evidence, GitHub lifecycle, ledger/readiness recomputation and end-to-end I1 proof.

## I1 exit condition

A pre-approved low-risk task moves from READY to DONE through the full pipeline without manual reconstruction of project context; a controlled failure stops safely without corrupting task/DAG state.

## After I1

Proceed incrementally to I2 — Sequential Pipeline — and I3 — Sprint Autonomous. I2/I3 are the intended point at which AgentFactory becomes useful enough to return the majority of development capacity to System Builder product work. I4–I7 remain maturity-gated and should not delay product work unless their capabilities are required.

## Product M1

M1 Vertical Contract Spine remains a valid ready product milestone. TASK-010 and TASK-004 are not cancelled; they are temporarily outside the current execution focus while AgentFactory ignition is built.
