# Current Execution Milestone — I2 Sequential Pipeline Readiness

## Goal

Implement and then prove a deterministic one-at-a-time pipeline of dependent tasks, closing and reconciling state before deriving the next successor READY. The candidate chain is defined but has not been executed.

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

## Post-I1 readiness review

- [x] Audit found no known P0.
- [x] TASK-024: persist durable success/failure attempt evidence with observed timing (P1/P2).
- [x] TASK-025: bind ledger transitions to contemporaneous causal evidence (P1).
- [x] TASK-026: bind state-closure PR identity to branch/base/head/check/review (P1).
- [x] TASK-027: re-prove I1 with durable failure, causal ledger and hardened state lifecycle.
- [x] Correct confirmed P1/P2 findings by rolling-wave.
- [x] Re-run the I1 happy/failure proof and decide GO/NO-GO for I2 without executing the I2 chain.
- [x] TASK-027 post-hardening proof integrated; I1 remains GO.
- [x] Post-I1 review completed; I2 readiness decision is GO.
- [x] Materialize TASK-028 for the bounded I2 sequential coordinator.
- [ ] Implement and close TASK-028.
- [ ] Execute the candidate chain only after coordinator integration and reassess the I2 Exit Gate.

## Product M1

M1 Vertical Contract Spine remains a valid ready product milestone. TASK-010 and TASK-004 are not cancelled; they are temporarily outside the current execution focus while AgentFactory ignition is built.
