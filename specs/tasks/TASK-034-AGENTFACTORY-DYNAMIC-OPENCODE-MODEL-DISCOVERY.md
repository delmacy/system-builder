---
id: TASK-034
title: Resolve OpenCode models dynamically from the Zen catalog
status: completed
priority: 57
milestone: I2
model_tier: architecture
risk: high
architecture_impact: false
executor_preference: codex
depends_on:
  - TASK-033
context_paths:
  - AGENTS.md
  - docs/adr/ADR-0008-local-task-orchestrator.md
  - docs/adr/ADR-0011-event-driven-local-pipeline-supervisor.md
  - docs/current/PROJECT_STATE.md
  - docs/current/CURRENT_MILESTONE.md
  - project_docs/agentfactory_i1/WBS_DICTIONARY.md
  - project_docs/agentfactory_i2/ASYNC_SUPERVISOR.md
  - project_docs/agentfactory_i2/SUPERVISOR_OPERATIONS_WINDOWS.md
  - project_docs/execution_governance/MODEL_ROUTING.md
  - specs/tasks/TASK-013-AGENTFACTORY-OPENCODE-ADAPTER-HARDENING.md
  - specs/tasks/TASK-016-AGENTFACTORY-MODEL-ROUTER.md
  - specs/tasks/TASK-033-AGENTFACTORY-SUPERVISOR-RUNTIME-BRIDGE.md
  - specs/tasks/TASK-034-AGENTFACTORY-DYNAMIC-OPENCODE-MODEL-DISCOVERY.md
  - tooling/agent-harness/policies/MODEL_ROUTING.md
  - tooling/agent-harness/src/execution-contracts.ts
  - tooling/agent-harness/src/executor.ts
  - tooling/agent-harness/src/orchestrator.ts
  - tooling/agent-harness/src/orchestrator-runtime.ts
  - tooling/agent-harness/src/sequential-pipeline.ts
  - tooling/agent-harness/src/supervisor-runtime.ts
allowed_paths:
  - tooling/agent-harness/policies/OPENCODE_MODELS.json
  - tooling/agent-harness/src/opencode-models.ts
  - tooling/agent-harness/src/execution-contracts.ts
  - tooling/agent-harness/src/executor.ts
  - tooling/agent-harness/src/orchestrator.ts
  - tooling/agent-harness/src/orchestrator-runtime.ts
  - tooling/agent-harness/src/sequential-pipeline.ts
  - tooling/agent-harness/src/supervisor-runtime.ts
  - tooling/agent-harness/tests/opencode-models.test.ts
  - tooling/agent-harness/tests/executor.test.ts
  - tooling/agent-harness/tests/orchestrator.test.ts
  - tooling/agent-harness/tests/sequential-pipeline.test.ts
  - tooling/agent-harness/tests/supervisor-runtime.test.ts
  - project_docs/agentfactory_i2/ASYNC_SUPERVISOR.md
  - project_docs/agentfactory_i2/SUPERVISOR_OPERATIONS_WINDOWS.md
  - specs/tasks/TASK-034-AGENTFACTORY-DYNAMIC-OPENCODE-MODEL-DISCOVERY.md
forbidden_paths:
  - packages/**
  - apps/**
  - docs/adr/**
  - docs/current/**
  - docs/evidence/**
  - package.json
  - package-lock.json
  - tooling/agent-harness/policies/HUMAN_APPROVAL.json
  - tooling/agent-harness/policies/SUPERVISOR.json
  - tooling/agent-harness/src/model-router.ts
  - tooling/agent-harness/src/pipeline-supervisor.ts
  - tooling/agent-harness/src/supervisor-contracts.ts
  - tooling/agent-harness/src/supervisor-store.ts
  - tooling/agent-harness/src/evidence-writer.ts
  - tooling/agent-harness/src/ledger-engine.ts
  - tooling/agent-harness/src/readiness-recompute.ts
max_files: 16
validation:
  - npm run verify
---

# Objective

Implement WP-I2-04 by adding dynamic, deterministic OpenCode Zen model discovery and selection so the local Supervisor no longer requires the operator to provide an exact `OPENCODE_MODEL` ID.

# Rationale

TASK-033 made the Supervisor operational but its Windows plan procedure still requires a mutable exact model ID. The Zen catalog is the provider authority for current availability. Selection must therefore be policy-driven, observable and fail closed without moving pricing knowledge or arbitrary shell environment into deterministic tests.

# Context

On 2026-08-14 an unauthenticated `GET https://opencode.ai/zen/v1/models` returned HTTP 200 and a JSON list with `id`, `object`, `created` and `owned_by`; no official price/free field was present. Current free candidates include DeepSeek, MiMo and Nemotron IDs ending in `-free`. This observation informs the task but tests must never call the real endpoint.

# Current behavior

`OpenCodeExecutor` reads `OPENCODE_EXECUTABLE` and `OPENCODE_MODEL` in constructor defaults, so ambient shell state can contaminate tests. The Supervisor runtime plan accepts only the existing concrete `ExecutionRoute`; the Windows guide requires a manually entered model ID; no catalog client, normalized model contract, selector, cache or resolution receipt exists.

# Required change

Add strict `OpenCodeAvailableModel`, `OpenCodeModelSelector`, catalog response/configuration and `OpenCodeModelResolution` contracts plus a small injectable `OpenCodeModelCatalogClient`. Add versioned configuration for the single default endpoint, ten-second timeout and 300-second TTL. Normalize only validated provider rows; an explicit official boolean free field, when present, takes priority, otherwise and only otherwise classify an ID ending case-insensitively in `-free` as free. Derive a conservative family from the leading normalized ID segment or return null.

Implement deterministic selection independent of API order: apply an optional free-only filter, an optional case-insensitive literal substring `name_contains`, then the ordered case-insensitive literal preference list, with lexical ID order as the tie-breaker and final fallback. Reject regex/fuzzy behavior, invalid selectors, absent explicit IDs and free-policy conflicts with stable non-retryable failures. Treat `OPENCODE_MODEL` only as an explicitly supplied runtime override and validate it against both the live/valid-cache catalog and task selector; it must never be read by the executor constructor or silently alter a planned concrete model.

Use an atomic local cache under `.agent/runtime` as an optimization. A valid cache may satisfy an invocation; an expired cache must be refreshed and must not be used as authority when refresh fails. Classify timeout, network/5xx and rate-limit failures so the existing Supervisor retry engine receives `OPENCODE_TIMEOUT`, `PROVIDER_UNAVAILABLE`/`PROVIDER_5XX` or `RATE_LIMIT`; do not add another retry loop. Preserve deterministic non-retryable blocking for `MODEL_NOT_AVAILABLE`, `MODEL_POLICY_CONFLICT`, `INVALID_MODEL_SELECTOR` and `INVALID_MODEL_API_RESPONSE`.

Extend only the bounded Supervisor plan entry with `model_selector`; resolve it at the executor boundary and pass exactly the resolved concrete ID to the existing OpenCode CLI invocation. Persist a strict model-resolution record containing the requested selector, selected model, source (`api`, `cache`, `explicit_override`) and resolution timestamp, and include the same result in the executor attempt receipt without secrets. Propagate structured executor failure metadata through the existing coordinator adapter only as needed for the accepted Supervisor retry policy; do not weaken any task, validation, approval, CI, ledger or evidence gate.

# Inputs / contracts

TASK-013 OpenCode adapter, TASK-016 deterministic router, TASK-033 runtime plan/bridge, existing `ExecutionRoute` and `ExecutorAdapterResult`, local orchestrator attempt journal, sequential receipt mapping and Supervisor failure classes/retry engine.

# Outputs / contracts

`OpenCodeAvailableModel`, `OpenCodeModelSelector`, `OpenCodeModelResolution`, `OpenCodeModelCatalogClient`; versioned catalog policy; deterministic resolver with atomic TTL cache; selector-capable Supervisor plan; hermetic executor construction; model-resolution attempt evidence; exact Windows plan without a fixed model ID or required `OPENCODE_MODEL`.

# Acceptance criteria

- A valid API list normalizes deterministically; `*-free` is free only when no official boolean is present, and an explicit official boolean takes priority.
- Free-only selection never falls back to a paid/unknown model.
- `name_contains` and preferences use case-insensitive literal substrings, never operator regex or fuzzy matching.
- Preference order is authoritative; lexical model ID is the deterministic tie-breaker/fallback, independent of API response order.
- Missing candidates return `MODEL_NOT_AVAILABLE`; an absent explicit ID returns `MODEL_NOT_AVAILABLE`; an explicit non-free ID under free-only policy returns `MODEL_POLICY_CONFLICT`.
- The default plan uses free-only preferences `deepseek`, `mimo`, `nemotron`, then any remaining free model, without pinning an ID.
- `OPENCODE_MODEL` is optional, explicitly injected only at the production composition boundary, validated as an override, and never contaminates default unit construction.
- Timeout, network, 5xx and rate-limit classifications enter the existing Supervisor retry path; invalid selector/response and policy/availability failures remain non-retryable.
- A valid atomic cache avoids a network call; an expired cache refreshes and is never silently used after a failed refresh.
- The executor receives exactly the resolved ID and attempt evidence records selector, selected ID, source and timestamp without secrets.
- Tests cover all twenty requested model-list, classification, selection, failure, cache, environment, executor and receipt cases with injected clients/clock/filesystem and zero real network calls.
- `npm run verify` produces the same result with `OPENCODE_MODEL` absent or set to an arbitrary value.
- TASK-010 has no branch, Task Pack, evidence or PR side effect during this task.
- `npm run verify` passes.

# Non-goals

Rewriting `OpenCodeExecutor` or `ModelRouter`, inventing paid-model prices, fuzzy matching, provider benchmarking, secrets/authentication, database, dashboard, I3, parallelism, governance changes, a second retry engine or executing TASK-010/004/005/006.

# Evidence expected

At least twenty focused hermetic cases, exact normalized/selector/resolution fixtures, cache and failure-class receipts, executor argument proof, environment-contamination regression, non-product Supervisor smoke proof, exact changed-file list and full `npm run verify` output in both environment modes.

# Escalation

Stop if the endpoint requires a new secret, the provider response cannot be validated without guessing, the change would require replacing the accepted router/executor/supervisor architecture, an expired cache would need to be trusted, a paid fallback would be introduced, or any path outside this contract must change. Propose an ADR only if the correction crosses an L4 boundary.
