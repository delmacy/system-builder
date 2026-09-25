# TASK-616 — Composition Graph validator

Status: blocked
Sprint: `STATION-COMPOSITION-CONSTRUCTION-C-01`
Depends on: TASK-615

## Goal
Validate a Composition Graph deterministically against ComponentRegistry composition contracts, discrete grid/span rules, named slots and nesting constraints.

## Allowed
- `packages/station-composition/**`
- bounded validator tests
- this TASK spec

## Forbidden
- Station application UI
- persistence/save/publish
- editor application
- Core/business authority
- WindowGeometry mutation
- arbitrary pixel geometry

## max_files
8

## Acceptance
Validator reports deterministic structured findings for unknown component refs, duplicate/dangling graph refs, invalid parent/slot relationships, invalid discrete spans and invalid nested-layout ownership without mutating the graph.
