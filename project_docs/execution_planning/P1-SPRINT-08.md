# P1-SPRINT-08 — Compiler Synthetic Artifact

## Goal
Deliver the first testable SB-08 Compiler slice: deterministic packaging from a validated AssemblyPlan into a reproducible synthetic ReleaseArtifact.

## Primary task
To be materialized from the Compiler WBS after P1-SPRINT-07 integration.

## Module
SB-08 Compiler.

## Dependency
P1-SPRINT-07 Validation slice integrated.

## Branch
`sprint/P1-SPRINT-08`

## Scope target
- materialize a minimal generated project/artifact;
- environment schema without secret values;
- content manifest and hashes;
- fixed/recorded toolchain inputs required for reproducibility;
- no full production compiler.

## Test target
- identical inputs produce equivalent manifest/content identity;
- secret values are structurally excluded;
- invalid/unvalidated AssemblyPlan is rejected;
- manifest/hash integrity checks;
- final `npm run verify`.

## Exit proof
A validated AssemblyPlan produces a reproducible synthetic ReleaseArtifact.

## Closure
Produce `P1-SPRINT-08.report.md`, open one PR to `main`, and stop for Sprint Review.
