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

- [x] TASK-012: AgentFactory execution contracts.
- [x] TASK-013: hardened OpenCode adapter.
- [x] TASK-014: deterministic DAG/READY evaluator.
- [x] TASK-015: deterministic bounded Task Pack builder.
- [x] TASK-016: deterministic model router.
- [x] Generate TASK-017 from accepted predecessor outputs and WP-I1-06.
- [x] TASK-017: execution harness enforcement.
- [x] Generate TASK-018 from the accepted TASK-017 output and WP-I1-07.
- [x] TASK-018: independent validation gate.
- [x] Generate TASK-019/TASK-020 from the accepted TASK-018 output and WP-I1-08/WP-I1-09.
- [x] TASK-019: append-only evidence writer.
- [x] TASK-020: hardened GitHub lifecycle adapter.
- [x] Generate TASK-021 from the accepted TASK-019 evidence interface and WP-I1-10.
- [x] TASK-021: ledger/state transition engine.
- [x] Generate TASK-022 from the accepted TASK-021 ledger receipt and WP-I1-11.
- [x] TASK-022: successor readiness recomputation.
- [x] Generate TASK-023 from the accepted TASK-022 readiness receipt and WP-I1-12.
- [x] TASK-023: end-to-end I1 proof.
- [x] I1 Exit Gate assessed GO from integrated proof, task evidence and real PR/check/state-closure evidence.
- [ ] Continue through task-pack builder, model routing, harness enforcement, independent validation, evidence, GitHub lifecycle, ledger/readiness recomputation and end-to-end I1 proof.

## I1 exit condition

**Passed.** The TASK-023 representative low-risk proof traverses the actual I1 component chain to DONE and successor readiness; its controlled failure stops with task/DAG preservation. Evidence is indexed in `project_docs/agentfactory_i1/I1_EXIT_GATE.md`.

## After I1

Proceed incrementally to I2 — Sequential Pipeline — and I3 — Sprint Autonomous. I2/I3 are the intended point at which AgentFactory becomes useful enough to return the majority of development capacity to System Builder product work. I4–I7 remain maturity-gated and should not delay product work unless their capabilities are required.

## Product M1

M1 Vertical Contract Spine remains a valid ready product milestone. TASK-010 and TASK-004 are not cancelled; they are temporarily outside the current execution focus while AgentFactory ignition is built.
