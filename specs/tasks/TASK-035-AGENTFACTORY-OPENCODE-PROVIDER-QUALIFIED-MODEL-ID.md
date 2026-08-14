---
id: TASK-035
title: Pass provider-qualified Zen model IDs to the OpenCode CLI
status: ready
priority: 58
milestone: I2
model_tier: architecture
risk: medium
architecture_impact: false
executor_preference: codex
depends_on:
  - TASK-034
context_paths:
  - AGENTS.md
  - docs/current/PROJECT_STATE.md
  - project_docs/agentfactory_i2/I2_PRE_RUN_GATE.md
  - project_docs/agentfactory_i2/SUPERVISOR_OPERATIONS_WINDOWS.md
  - specs/tasks/TASK-034-AGENTFACTORY-DYNAMIC-OPENCODE-MODEL-DISCOVERY.md
  - tooling/agent-harness/src/executor.ts
  - tooling/agent-harness/src/opencode-models.ts
  - tooling/agent-harness/tests/orchestrator.test.ts
allowed_paths:
  - tooling/agent-harness/src/executor.ts
  - tooling/agent-harness/tests/orchestrator.test.ts
  - project_docs/agentfactory_i2/SUPERVISOR_OPERATIONS_WINDOWS.md
  - specs/tasks/TASK-035-AGENTFACTORY-OPENCODE-PROVIDER-QUALIFIED-MODEL-ID.md
forbidden_paths:
  - packages/**
  - apps/**
  - docs/adr/**
  - docs/current/**
  - docs/evidence/**
  - package.json
  - package-lock.json
  - tooling/agent-harness/policies/**
  - tooling/agent-harness/src/opencode-models.ts
  - tooling/agent-harness/src/model-router.ts
  - tooling/agent-harness/src/pipeline-supervisor.ts
  - tooling/agent-harness/src/supervisor-runtime.ts
max_files: 4
validation:
  - npm run verify
---

# Objective

Correct the OpenCode execution boundary so a normalized Zen catalog model is passed to OpenCode CLI 1.18.16 in its required `provider/model` form while preserving the accepted raw catalog and model-resolution contracts.

# Context

The first real TASK-010 Supervisor attempt resolved `deepseek-v4-flash-free` from the public API and recorded it correctly, but OpenCode rejected `--model deepseek-v4-flash-free` with `Model not found`. Local `opencode run --help` requires `provider/model`, and `opencode models opencode` exposes the candidate as `opencode/deepseek-v4-flash-free`.

# Current behavior

`OpenCodeExecutor` passes `OpenCodeModelResolution.selected_model` directly after `--model`. That is the correct raw catalog evidence identity but not the provider-qualified CLI identity required by the installed OpenCode version.

# Required change

Keep `OpenCodeAvailableModel.id`, `raw_id` and `OpenCodeModelResolution.selected_model` equal to the validated provider catalog ID. At only the CLI argument boundary, qualify a dynamically resolved model as `${provider}/${selected_model}` and pass exactly that value after `--model`. Do not double-qualify legacy explicit configuration that did not originate in a model-resolution receipt.

Add regression coverage proving the resolver receipt remains `deepseek-v4-flash-free`, the CLI receives `opencode/deepseek-v4-flash-free`, deterministic argument order remains unchanged, and explicit legacy behavior is not silently rewritten. Document the provider qualification boundary.

# Inputs / contracts

TASK-034 `OpenCodeAvailableModel`/`OpenCodeModelResolution`, the existing `OpenCodeExecutor` command boundary, TASK-010 failed executor receipt and OpenCode CLI 1.18.16 `provider/model` requirement.

# Outputs / contracts

One provider-qualified dynamic `--model` argument with the existing raw model-resolution receipt unchanged.

# Acceptance criteria

- Dynamic Zen resolution records the raw catalog ID unchanged.
- OpenCode CLI receives exactly `opencode/<selected_model>` for a dynamic resolution.
- Provider qualification occurs once and only at the CLI boundary.
- Existing explicit non-resolver model behavior remains compatible.
- The current TASK-010 attempt evidence and branch are preserved; TASK-010 is not executed during this correction.
- `npm run verify` passes.

# Non-goals

Changing catalog normalization, selector/free/cache/retry policy, routing policy, Supervisor contracts, governance, TASK-010 product files or the OpenCode provider configuration.

# Evidence expected

Focused argument/receipt regression tests, exact changed-file list and full `npm run verify` output.

# Escalation

Stop if OpenCode requires a provider other than the catalog's validated `provider`, if qualification would change the public resolution receipt, or if the correction requires changing routing/Supervisor contracts.
