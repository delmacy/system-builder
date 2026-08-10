# ADR-0004 — Monorepo-first for System Builder suite

Status: Accepted

## Decision

Keep all SB suite bounded contexts and the engineering harness in `delmacy/system-builder` initially. Keep manufactured/client systems in separate repositories such as `delmacy/gestaotecnica`.

## Rationale

This preserves atomic contract/code/docs changes and avoids premature cross-repository dependency/version overhead while architecture is still evolving.

## Extraction trigger

A package earns another repository through real independent lifecycle, team/community ownership, technology/security boundary, substantial standalone use or proven CI/governance pressure.
