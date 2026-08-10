# Agent Harness — Bootstrap Target

This directory initially contains policy/contracts only. TASK-001 will implement the minimal tooling.

The harness is development infrastructure, not a second product.

## Intended commands

- `task:next`: select first ready/unblocked task.
- `task:prepare`: build a bounded context pack.
- `task:verify`: enforce scope and run deterministic task/repository gates.
- `task:close`: record evidence and state after successful validation.

## Constraints

- local-first;
- Git-backed;
- model/provider agnostic;
- deterministic before AI-assisted;
- no database required for harness state initially;
- no RAG/vector store initially;
- no dashboard initially;
- Markdown/YAML/JSON + TypeScript scripts preferred.

## Relationship to legacy AI Factory

The old `gestaotecnica/.agent` factory is a useful reference for task contracts, model routing, queueing and deterministic CI. The new implementation should preserve the good ideas while removing early dependence on GitHub Actions and specific agents.
