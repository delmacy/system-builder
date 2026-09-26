# TASK-625 — Internal slot/sub-grid specialization hardening

Status: blocked
Depends on: TASK-624
Milestone: M2

## Goal
Harden Component Editor specialization for named internal slots and discrete proportional sub-grid/span constraints.

## Required
Validate slot compatibility, parent/ref integrity and declared row/column span bounds through canonical composition validation; stale/incompatible mutations fail closed; keyboard/focus semantics remain usable where UI changes occur.

## Forbidden
WindowGeometry coupling; arbitrary x/y/pixel dimensions; silent repair; AppManifest/Launcher; persistence/publish/deploy; Core/business authority.

## Proof
Adversarial regressions for incompatible slots/spans, dangling refs and preserved draft/base/selection state.

## max_files
10
