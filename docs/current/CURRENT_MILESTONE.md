# Current Milestone — M1 Vertical Contract Spine

## Goal

Prove a portable, versioned and traceable contract chain from ProcessMirror through the release/deployment boundary before implementing product modules.

## M0 exit evidence

- [x] canonical product/architecture/ADR baseline;
- [x] remote-SHA-backed legacy inventory and migration classification;
- [x] local task selection, preparation, verification and closure commands;
- [x] machine-validatable task metadata and dependency graph;
- [x] scope/max-files checks covering committed, staged, unstaged and untracked paths;
- [x] architecture import gates and self-tests;
- [x] lint, typecheck, unit-test and build harness;
- [x] ordered M1 queue.
- [x] deterministic Git branch/commit/push/PR evidence layer and PR-only CI.

## M1 queue

- [x] TASK-002: bounded OpenCode handoff smoke proof.
- [ ] TASK-009: Local Task Orchestrator v1 (priority 25; depends on completed TASK-002).
- [ ] TASK-003: public artifact envelope/versioning ADR.
- [ ] TASK-004: ProcessMirror contract.
- [ ] TASK-005: BusinessRecipe contract.
- [ ] TASK-006: SystemAnalysis contract.
- [ ] TASK-007: SystemDefinition contract.
- [ ] TASK-008: AssemblyPlan through deployment-boundary contracts.

## Do not start yet

Product UIs, persistence, compiler/runtime implementation, broad legacy migration or parallel development of all suite modules.
