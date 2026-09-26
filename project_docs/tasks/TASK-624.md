# TASK-624 — Constrained component property/variant editing

Status: blocked
Depends on: TASK-623
Milestone: M2

## Goal
Add bounded Component Editor mutations for explicitly declared presentation properties and variants using the shared engine transaction/validator path.

## Required
Allowlisted presentation fields only; deterministic validation; invalid/stale variant/property targets fail closed; base remains immutable until an explicitly later persistence slice.

## Forbidden
Arbitrary CSS/HTML editing; business/domain fields; AppManifest/Launcher; remote persistence/publish/deploy; arbitrary pixel geometry; Core authority.

## Proof
Regression tests for valid edits, invalid variant/property rejection and draft/base integrity.

## max_files
10
