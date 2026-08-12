# AgentFactory I1 — Single Task Autonomous

## Objective
Deliver the smallest end-to-end pipeline able to select one READY task, execute it through OpenCode, validate it independently, persist evidence, update state and expose the next READY work.

## Boundary
I1 is not a full sprint planner, parallel executor or autonomous project manager. It is the ignition slice that proves the factory can complete one bounded task correctly.

## Sequence
`planning data -> DAG/READY -> task pack -> model route -> OpenCode -> harness -> validation -> evidence -> GitHub lifecycle -> ledger/DAG update`.

## Exit condition
A pre-approved low-risk task can move from READY to DONE through the pipeline without manual reconstruction of context, while failures stop safely and preserve state/evidence.
