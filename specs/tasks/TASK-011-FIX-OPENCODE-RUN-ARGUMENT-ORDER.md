---
id: TASK-011
title: Fix OpenCode run argument ordering
status: ready
priority: 34
milestone: M1
model_tier: cheap
risk: medium
architecture_impact: false
executor_preference: codex
depends_on:
  - TASK-009
context_paths:
  - AGENTS.md
  - docs/engineering/LOCAL_TASK_ORCHESTRATOR.md
  - tooling/agent-harness/src/executor.ts
  - tooling/agent-harness/tests/orchestrator.test.ts
  - specs/tasks/TASK-011-FIX-OPENCODE-RUN-ARGUMENT-ORDER.md
allowed_paths:
  - tooling/agent-harness/src/executor.ts
  - tooling/agent-harness/tests/orchestrator.test.ts
  - specs/tasks/TASK-011-FIX-OPENCODE-RUN-ARGUMENT-ORDER.md
forbidden_paths:
  - packages/**
  - apps/**
  - docs/adr/**
  - specs/contracts/**
max_files: 3
validation:
  - npm run verify
---

# TASK-011 — Fix OpenCode run argument ordering

## Objective

Correct the confirmed argument-ordering bug in the local OpenCode adapter so
the positional message for `opencode run` appears before `--file` and the Task
Pack is the only value passed to `--file`.

## Context

TASK-010 exhausted its three execution attempts because the adapter currently
produces arguments functionally equivalent to:

```text
opencode run --file TASK_PACK.md "prompt"
```

With the installed OpenCode version, `--file` absorbs the prompt as another file
path and fails with an error beginning:

```text
Error: File not found: # Bounded executor instruction — TASK-010 ...
```

Manual verification confirmed that the supported ordering works:

```text
opencode run "Reply only with OK" --file ".agent/context/TASK-010/TASK_PACK.md"
```

## Current behavior

The generated prompt is placed after `--file` and its Task Pack argument. The
OpenCode CLI therefore interprets prompt text as an additional file path instead
of the positional run message.

## Required change

Make the smallest possible change to `OpenCodeExecutor` argument construction:

- keep `run` as the command;
- pass the generated bounded prompt as the positional argument before `--file`;
- place only the Task Pack path immediately after `--file`;
- place no prompt, message or other positional argument after `--file`;
- preserve `--pure`, `--format json`, the bounded agent and existing model
  selection;
- add a deterministic regression test for the complete ordering invariant.

Preserve the existing deny-by-default configuration and all executor scope,
permission, delivery and retry boundaries. `task:verify` remains the sole
deterministic success authority.

## Inputs / contracts

The accepted Local Task Orchestrator behavior, the current `OpenCodeExecutor`,
its existing deterministic tests and the installed OpenCode CLI ordering proven
above.

## Outputs / contracts

A minimal executor argument-ordering correction and regression coverage. No
public System Builder contract changes.

## Acceptance criteria

1. `run` remains the OpenCode command.
2. The bounded prompt is present as a positional argument.
3. `indexOf(prompt) < indexOf("--file")`.
4. The argument immediately after `--file` is exactly the Task Pack path.
5. No prompt text is interpreted or positioned as a file path.
6. `--pure` remains active.
7. `--format json` remains active.
8. The bounded agent remains selected.
9. Existing model selection continues to work.
10. `OPENCODE_CONFIG_CONTENT` and deny-by-default remain unchanged.
11. The prohibitions on Git commit, push, merge and every GitHub delivery or PR
    operation remain intact.
12. A deterministic regression test prevents the defective ordering from
    returning.
13. `npm run verify` passes.

## Non-goals

- Execute, close, unblock or reset the attempt counter of TASK-010.
- Change the orchestrator state machine or retry policy.
- Refactor the executor beyond the argument-ordering correction.
- Change permissions, public architecture, contracts or model-selection policy.
- Add dependencies or modify `packages/**` or `apps/**`.

## Evidence expected

- Minimal `OpenCodeExecutor` diff.
- Deterministic regression test showing the exact generated argument list and
  ordering invariants.
- Passing `npm run verify` output.

## Escalation

Stop if the correction requires weakening an OpenCode permission, changing
orchestrator semantics, altering TASK-010 state or expanding beyond the declared
paths.
