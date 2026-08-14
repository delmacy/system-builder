# I2 Exit Gate

Date: 2026-08-14

## Decision

**NO-GO.** The first real candidate proved bounded OpenCode execution and the
complete bootstrap Git/PR/state-closure lifecycle for TASK-010, but it did not
produce the AgentFactory final evidence, causal ledger or successor-readiness
authority required by the I2 coordinator. I3 and TASK-004 execution remain
prohibited.

## Accepted facts

- TASK-010 implementation PR #99 merged at exact head
  `d9528ef05e821b1bbb65a32a7f0dcc81530ca3df` after `validate` passed and its
  exact durable owner approval evaluated `VALID`/`ELIGIBLE`.
- TASK-010 state PR #100 merged at exact head
  `e12c77d684c1d97aeb33c5230415b184036ee73c` after `validate` passed and its
  separate exact durable owner approval evaluated `VALID`/`ELIGIBLE`.
- Bootstrap task status, `docs/current/TASK_LEDGER.json` and
  `docs/evidence/tasks/TASK-010.json` are integrated on `main`; the local
  orchestrator returns stable `DONE`.
- OpenCode resolved raw `deepseek-v4-flash-free`, invoked the qualified CLI
  identity `opencode/deepseek-v4-flash-free`, changed exactly eight allowed
  files and passed the declared full validation with 222 tests.
- The Supervisor event history is preserved under pipeline
  `system-builder-i2-task-010-r1` and correlation
  `i2-task-010-r1-1786727817`.

## Failed I2 proof condition

After the implementation merge, the Supervisor delegated `task:close` and
persisted `LEDGER_UPDATED`. On the next observation, bootstrap marked TASK-010
completed but `docs/evidence/agentfactory/TASK-010` contained no accepted AFEV,
ledger or readiness receipt. The coordinator returned `EVIDENCE_MISSING`, and
the Supervisor correctly persisted terminal `PIPELINE_BLOCKED` rather than
inventing authority.

Manual use of the documented local-orchestrator recovery path completed the
already-generated bootstrap state branch and PR. That recovery proves the
bootstrap lifecycle but cannot convert the immutable terminal Supervisor run
into an I2 success.

## Exit-criteria comparison

The I2 Exit Criterion requires at least two dependent tasks to execute
sequentially with successor readiness derived from integrated predecessor
evidence. TASK-004 and TASK-005 have not executed, and even the TASK-010
prerequisite lacks the required AgentFactory authority bridge. Therefore no I2
exit claim is permitted.

## Required correction

WP-I2-06/TASK-036 must first accept an ADR for the real-run authority
integration point. Only after that ADR is integrated may rolling-wave planning
materialize the bounded implementation task. The correction must preserve all
accepted coordinator, evidence, ledger, readiness, GitHub lifecycle, approval
and Supervisor contracts and may not rewrite the terminal candidate history.

After the implementation is integrated and state-closed, a fresh proof plan
must demonstrate exact authority materialization and reconciliation before the
TASK-004 -> TASK-005 chain can be authorized. I3 and parallel scheduling remain
prohibited until this gate is reassessed GO from integrated real evidence.
