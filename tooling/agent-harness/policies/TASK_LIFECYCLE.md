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

Task states describe repository work, not Git transport. Git-managed tasks additionally record `prepared`, `verified`, `committed`, `pushed`, `PR opened` and `merged` as delivery evidence without adding provider-specific task states.

For a task associated through `task:branch`, closure occurs only from clean, synchronized `main` after the recorded PR is confirmed merged and its commit is an ancestor of `main`. Legacy tasks without an association keep the original local closure behavior for compatibility.

Closure itself updates versioned state files. Those changes must be reviewed and integrated as a separate state update; the harness does not commit directly on `main`.

## Autonomy

Serial autonomous execution may be introduced only after next-task selection, context preparation, verification and recovery are reliable locally.
