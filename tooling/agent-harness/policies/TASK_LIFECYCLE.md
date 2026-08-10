# Task Lifecycle

Suggested states:

`draft -> ready -> running -> verification -> completed`

Exceptional states:

`blocked`, `failed`, `superseded`.

## Readiness

A task is ready only when:

- dependencies are complete;
- inputs/contracts exist;
- allowed paths are declared;
- acceptance criteria are observable;
- validation commands/gates are known or bootstrap task explicitly creates them;
- required architecture decisions are already accepted.

## Execution

Executor receives the task plus prepared context. Executor does not redesign the milestone or expand scope.

## Verification

Verification is deterministic whenever possible and includes scope diff, task-specific validation and applicable repository-wide gates.

## Closure

Closure records evidence, updates task state, project/milestone state and backlog findings. New adjacent findings become new tasks rather than expanding the completed task.

## Autonomy

Serial autonomous execution may be introduced only after next-task selection, context preparation, verification and recovery are reliable locally.
