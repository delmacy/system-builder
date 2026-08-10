# ADR-0005 — Local-first, model-agnostic agent development

Status: Accepted

## Context

Routine System Builder implementation should minimize premium token cost and infrastructure complexity.

## Decision

Bootstrap/architecture work may use Codex/strong models. Normal product development runs primarily on the maintainer desktop through OpenCode using free/cheap models with bounded context and deterministic acceptance criteria. GitHub remains remote source/history and later CI/orchestration.

The harness must be model-agnostic; OpenCode is an executor interface, not a permanent dependency.

## Consequences

- Tasks carry model tier/risk/context metadata.
- Strong models are reserved for decisions, contract/architecture changes, security and difficult exceptions.
- Remote autonomous Actions/merge pipelines are deferred until local execution is proven.
