# Model Routing Policy

The task decides the minimum reasoning/cost tier; the executor/provider may vary.

## `free`

Default for deterministic, bounded tasks such as focused CRUD, adapters, schemas that do not change architecture, unit tests, documentation, small components and localized fixes.

Expected: exact context paths, narrow allowed paths, observable criteria and runnable validation.

## `cheap`

For moderate multi-file/domain work inside known contracts where some reasoning is needed but architecture is already decided.

## `architecture`

For new public contracts, module boundaries, database/security architecture, authentication/authorization, release/compiler architecture, major migration decisions, security-sensitive changes or unresolved cross-module tradeoffs.

Codex/strong models are preferred here.

## Principle

Default downward in cost when the task is sufficiently specified; escalate because of risk/ambiguity, not prestige.

**Spend intelligence on decisions; spend compute on execution.**

## Hard rule

A `free` executor must not silently make an L3/L4 decision. It stops and emits an escalation finding/ADR request.
