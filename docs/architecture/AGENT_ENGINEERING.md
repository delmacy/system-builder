# Agent-first Development Architecture

The goal is not to create another product before System Builder. The repository needs a small engineering harness: durable documentation, task specs, context packing, deterministic gates and version control.

## Operating model

```text
Roadmap / decisions
 -> task spec
 -> context builder
 -> executor (normally OpenCode free/cheap model)
 -> local validation
 -> architecture/contract gates
 -> review
 -> commit/push
 -> project-state update
 -> next task
```

## Roles

### Codex / strong model

Used primarily for:

- TASK-001 technical bootstrap;
- architectural reviews and ADRs;
- new public contracts/boundaries;
- security-critical work;
- milestone transitions and difficult failures.

Codex is not the default high-volume implementation worker.

### OpenCode + free/cheap models

Default execution path for real System Builder development once bootstrap is stable. Good tasks should be sufficiently bounded and deterministic that inexpensive models can implement them reliably.

## Cost principle

**Spend intelligence on decisions; spend compute on execution.**

The environment should reduce the amount of architectural reasoning required from routine executors through explicit contracts, relevant context, examples and automated validation.

## Local-first

Initial execution occurs on the maintainer desktop. GitHub is remote source/history/backup and later a CI/orchestration substrate. Avoid requiring distributed runners, agent dashboards, vector databases or autonomous GitHub execution before the local pipeline proves itself.

## Model agnostic

The harness must describe tasks and validations independently of a specific AI vendor. OpenCode is the current executor interface, not a permanent architecture dependency.

## Autonomy target

Autonomy grows gradually:

0. human selects task;
1. `task:next` selects first unblocked task;
2. `task:prepare` creates a bounded context pack;
3. executor implements;
4. `task:verify` performs deterministic validation;
5. `task:close` records evidence/state;
6. safe local automation runs the next task;
7. only later consider remote agents/Actions and auto-merge for low-risk tasks.
