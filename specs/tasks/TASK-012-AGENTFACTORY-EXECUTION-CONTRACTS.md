# TASK-012 — AgentFactory execution contracts

## Objective
Implement the first machine-readable execution contracts required by AgentFactory I1 — Single Task Autonomous.

## Parent
- Ignition milestone: I1
- Work Package: WP-I1-01
- Planning source: `project_docs/agentfactory_i1/`

## Scope
Define versioned TypeScript/runtime-safe structures for task identity/state, dependency gate identity/state, executor request/task pack metadata, execution result/evidence metadata, model tier/risk class, and state transitions needed by I1.

## In scope
- narrow contracts/interfaces/types;
- deterministic validation where supported by repository conventions;
- fixtures/tests proving accepted/rejected shapes;
- exports needed by downstream I1 work.

## Out of scope
- DAG traversal/READY calculation;
- OpenCode process execution;
- GitHub PR lifecycle;
- sprint generation;
- database persistence;
- UI.

## Dependencies
- Scope/WBS/DAG/governance baselines merged in `main`.

## Downstream consumers
- TASK-014 DAG/READY evaluator;
- future Task Pack builder;
- evidence/state engines;
- OpenCode execution adapter integration.

## Acceptance criteria
1. Contracts express all I1 states without free-form reinterpretation.
2. Invalid state/gate/result shapes are rejected by tests/validators where applicable.
3. No product-domain contract is coupled to AgentFactory execution state.
4. Public exports are documented and deterministic.
5. `npm run verify` passes.

## Allowed paths
- `tooling/agent-harness/**`
- `specs/tasks/TASK-012-AGENTFACTORY-EXECUTION-CONTRACTS.md`
- tests/fixtures directly required by the harness implementation.

## Forbidden
- System Builder business/product modules outside the harness.
- weakening existing test/CI gates.
- GitHub workflow redesign beyond changes strictly required to validate these contracts.

## Evidence
Report changed files, tests, public types/contracts created, downstream imports enabled, risks and follow-up candidates.

## Model routing
- Tier: T1/T2
- Risk: medium
- Architecture impact: bounded execution-infrastructure contract; reviewer required.
