# I1 Unnumbered Sprint Candidates

These are planning candidates, not committed sprint numbers.

## Candidate — Core State & DAG
Goal: establish machine contracts plus deterministic READY calculation.
Work: WP-I1-01, WP-I1-02; WP-I1-04 may run in parallel after I1-01.
Exit: fixtures/tests prove readiness/state inputs can be evaluated without LLM reasoning.

## Candidate — Executor Contract & OpenCode
Goal: generate a reproducible Task Pack and invoke OpenCode safely.
Work: WP-I1-03, WP-I1-05, then WP-I1-06.
Exit: bounded task can execute on an isolated branch/workspace and out-of-scope changes are detectable.

## Candidate — Verify & Record
Goal: independently validate execution and persist evidence/state.
Work: WP-I1-07, WP-I1-08, WP-I1-10.
Exit: failed validation cannot reach DONE; accepted evidence can.

## Candidate — GitHub & Readiness Loop
Goal: connect accepted work to PR/check lifecycle and recompute successors.
Work: WP-I1-09, WP-I1-11.
Exit: current task state and next READY set can be derived from actual evidence.

## Candidate — I1 Ignition Proof
Goal: execute one representative task end-to-end, including a controlled failure case.
Work: WP-I1-12.
Exit: I1 milestone evidence package and go/no-go for I2.

Commitment rule: only READY work is committed; candidates may be split/merged after actual sizing and integration findings.
