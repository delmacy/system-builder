# Project State

Date: 2026-08-10

## Repository

`delmacy/system-builder` is the new canonical factory repository.

## Current maturity

- Product/architecture blueprint: established at conceptual baseline.
- Legacy implementation: exists in `delmacy/gestaotecnica` and requires inventory/extraction.
- New product code in this repository: not started.
- New agent harness code: not started.
- Durable bootstrap documentation: TASK-000.

## Accepted foundational decisions

- process-first;
- BusinessRecipe separated from SystemDefinition;
- Control Plane separated from autonomous Runtime;
- compatibility-first/Strangler modernization;
- modular replaceable suite;
- monorepo-first for factory;
- client systems in separate repositories;
- repository as durable memory;
- local-first OpenCode/free-cheap execution after bootstrap;
- Codex/strong models focused on bootstrap, architecture and critical review;
- release/environment/deployment separation.

## Legacy status

Gestão Técnica contains reusable architecture/code/harness ideas but also platform/client coupling. No bulk migration is authorized before TASK-001 inventory.

## Active milestone

M0 — Engineering Bootstrap and Legacy Rebaseline.

## Immediate next task

`TASK-001-CODEX-BOOTSTRAP`.
