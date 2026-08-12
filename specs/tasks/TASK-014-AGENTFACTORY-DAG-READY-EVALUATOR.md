# TASK-014 — AgentFactory DAG / READY evaluator

## Objective
Implement deterministic evaluation of the near-horizon AgentFactory task DAG and compute which nodes are READY without using an LLM.

## Parent
- Ignition milestone: I1
- Work Package: WP-I1-02

## Dependencies
- REQUIRES: TASK-012 execution contracts.

## In scope
- load/receive task nodes and typed predecessor gates;
- validate missing predecessor references;
- detect dependency cycles;
- topological ordering;
- evaluate blocking gate statuses;
- produce READY/BLOCKED results with machine-readable reasons;
- tests covering independent branches, chains, cycles and contract-style gates supported by I1 contracts.

## Out of scope
- sprint loading;
- task decomposition using AI;
- critical-path duration calculations;
- database persistence;
- parallel job execution.

## Acceptance criteria
1. Same input graph always yields same readiness result.
2. Cycles fail closed with explicit diagnostics.
3. A blocked predecessor never produces a READY successor.
4. Independent nodes remain READY when unrelated paths are blocked.
5. Readiness reasons identify the unsatisfied gate/predecessor.
6. `npm run verify` passes.

## Allowed paths
- `tooling/agent-harness/**`
- task-DAG fixtures/tests.

## Forbidden
- LLM calls in readiness logic;
- sprint-number based dependencies;
- product-domain imports.

## Evidence
Provide representative DAG fixtures, readiness output and cycle-detection proof.

## Model routing
- Tier: T1/T2
- Risk: medium
- Architecture impact: bounded AgentFactory core.
