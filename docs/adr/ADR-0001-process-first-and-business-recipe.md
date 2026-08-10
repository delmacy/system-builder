# ADR-0001 — Process-first and Business Recipe separation

Status: Accepted

## Context

Operational knowledge must remain meaningful even if the software implementation, provider or technology changes.

## Decision

System Builder is process-first. ProcessMirror captures observed reality. BusinessRecipe formalizes approved technology-independent business behavior. SystemDefinition describes how the platform materializes that recipe as software.

Therefore `BusinessRecipe != SystemDefinition`.

## Consequences

- Analysis is an explicit translation stage between business and software catalogs.
- Business recipes can be versioned and compared independently from releases.
- A bug can be distinguished from a changed requirement: software failing the approved recipe vs the recipe itself changing.
