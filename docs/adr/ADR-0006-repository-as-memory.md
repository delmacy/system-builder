# ADR-0006 — Repository as durable project memory

Status: Accepted

## Context

Conversation context is finite and agents can hallucinate or lose prior decisions.

## Decision

The repository, not chat history, is the canonical project memory. Durable decisions must be recorded as docs, ADRs, contracts, specs, code and machine-enforced gates.

`AGENTS.md` stays concise and points to deeper sources rather than duplicating the entire project history.

## Consequences

- A fresh agent session must be able to reconstruct work state from the repo.
- Tasks receive bounded context packs.
- Architectural invariants should become tests when possible.
- Project state is updated at task/milestone completion.
