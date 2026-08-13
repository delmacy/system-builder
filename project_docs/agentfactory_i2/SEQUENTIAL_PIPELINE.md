# I2 — Sequential Pipeline Definition

## Goal

Execute dependent repository tasks one at a time, deriving each successor's readiness only from integrated predecessor evidence and closing both implementation and state before selecting the next task.

## Entry criteria

- I1 hardened proof is integrated and GO.
- Every pipeline member has a valid task contract, DoR, allowed/forbidden paths and declared validation.
- The first member is READY and every additional member has an explicit predecessor/gate relationship.
- No unresolved P0-P2 post-I1 finding affects execution.

## Deterministic loop

For each task, the coordinator must perform exactly this bounded sequence:

`select READY -> task branch -> Task Pack -> route -> execute -> validate -> AFATT/AFEV -> implementation PR lifecycle -> merge -> causal ledger -> bootstrap state closure PR -> merge/sync -> recompute successor readiness`.

Only after the final state closure is integrated may the next dependent task be selected. A repeated invocation resumes from repository/GitHub evidence and must not repeat completed external actions.

## Stop rules

Stop the chain on executor/validation failure, scope violation, missing or inconsistent evidence, non-eligible implementation/state PR, failed/pending required check, requested changes, governance decision, ledger rejection, task/ledger divergence, unsatisfied dependency gate or changed pipeline membership. Never skip a member or route around a blocked gate.

## Authority bridge

During I2, `specs/tasks` plus `docs/current/TASK_LEDGER.json` remain the bootstrap catalog/closure authority, while AgentFactory receipts govern execution transitions. The coordinator must compare both after every state PR merge and stop on divergence. Unification is not assumed and must not be invented implicitly.

## Candidate A -> B -> C

Precondition: `WP-FH-01 / TASK-010` must be completed and its ArtifactEnvelope contract accepted before A can close.

- A: `WP-FH-02 / TASK-004` — ProcessMirror public contract.
- B: `WP-FH-03 / TASK-005` — BusinessRecipe public contract; depends on TASK-004.
- C: `WP-FH-04 / TASK-006` — SystemAnalysis public contract; depends on TASK-005.

This is the correct strict chain because TASK-004 -> TASK-005 -> TASK-006 is the actual product DAG. TASK-010 is a prerequisite integration gate for TASK-004 closure, not a fabricated full-execution dependency: authoritative planning explicitly allowed TASK-010 and TASK-004 architecture work to proceed concurrently.

## I2 exit evidence

I2 passes only after at least A and B execute sequentially with integrated closure and B readiness derived from A evidence. The intended proof runs A -> B -> C unless a gate stops it. The evidence package must include per-attempt receipts, PR identities/checks/reviews, causal ledger transitions, state reconciliation, successor readiness deltas, durations and the exact stop/exit decision.

## Non-goals

I3 sprint generation, independent branch scheduling, parallel execution, auto-waiver, product runtime implementation, provider-cost invention or broad observability infrastructure.
