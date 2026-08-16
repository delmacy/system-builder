# P5-ASSEMBLY-GRAPH-01 — Sprint Report

## Result

Sprint Goal satisfied on `sprint/P5-ASSEMBLY-GRAPH-01`. Assembly now consumes integrated Catalog `dependencyRequirements` to produce deterministic bounded transitive closure, combines exact/minimum/compatibility requirements across multiple paths before selection, fails closed with reproducible graph diagnostics, and carries the graph-derived AssemblyPlan through the actual Validation/Compiler predecessor path.

## TASK results

| TASK | Result | Commit | Validation |
| --- | --- | --- | --- |
| TASK-085 | PASS | `621b6c11f90ae17145ae29ebcd041b6e93453c59` | Deterministic CI #260 PASS |
| TASK-086 | PASS | `d38352eb4b20ae7d5a10a734a5152256247fbc4c` | Deterministic CI #261 PASS |
| TASK-087 | PASS | `cc1f1f99fab123a44b2a75f17967282042afb531` | Deterministic CI #262 PASS |

Dependency order was preserved: `TASK-085 -> TASK-086 -> TASK-087`.

Each implementation TASK has a distinct implementation commit. The Sprint also contains administrative spec-repair commits described below; they do not implement product behavior.

## Delivered proof

`SystemDefinition root capability -> constrained Catalog candidate -> structured dependency requirements -> transitive dependency closure -> deterministic conflict/cycle validation -> deterministic AssemblyPlan BOM -> ValidationEvidence -> Compiler predecessor path`

Evidence includes:

- one-hop and nested structured dependencies are resolved through the actual Catalog resolver;
- exact/minimum version and compatibility requirements propagate through the Assembly resolver request;
- compatible duplicate paths coalesce to one component;
- multiple-path requirements are combined before candidate selection, avoiding traversal-order provider choice;
- incompatible exact constraints and incompatible compatibility values fail with stable requirement evidence;
- unresolved transitive dependencies fail explicitly with no AssemblyPlan;
- dependency cycles fail with a deterministic cycle path;
- equivalent root/dependency/Catalog registration order yields equivalent AssemblyPlan/diagnostics;
- real Factory E2E builds a transitive Catalog-derived BOM and passes it through actual Validation and Compiler APIs;
- predecessor root-only behavior remains valid.

## Objective validation

TASK-087 CI #262 executed repository `npm run verify` with PostgreSQL 17.6 healthy:

- unit tests: 309 PASS / 0 FAIL / 0 SKIPPED;
- product tests: 109 PASS / 0 FAIL / 0 SKIPPED;
- task catalog: 88 specifications validated;
- architecture gates: PASS;
- build: PASS;
- P4 capability-driven PostgreSQL clean-redeploy proof: PASS;
- predecessor PostgreSQL migration/state redeploy proof: PASS;
- autonomous Runtime/secret/release regressions: PASS.

Local execution is not claimed.

## Deviation / administrative repair

The first TASK-085 CI (#257) failed before product completion because the pre-materialized TASK-085/086/087 specs omitted three sections required by the repository task-catalog parser: `Current behavior`, `Inputs / contracts`, and `Outputs / contracts`.

This was a Sprint-materialization defect, not a product-code failure. The three specs were repaired without changing their authorized scope, paths, dependencies, acceptance criteria or implementation semantics:

- TASK-086 spec repair: `ba4c34341018b6e2a92ef18ef0b46c38791caeb4`;
- TASK-085 spec repair: `bfcd93240cd22cc7300eb3e799b1297817e4b0a5`;
- TASK-087 spec repair: `811701340cb0cf65656ace07e65e67ff6418e038`.

CI #260 then passed the TASK-085 implementation plus the corrected catalog. No product file changed in those administrative commits.

## Architecture / scope disposition

The Sprint remained inside the explicitly authorized bounded internal Assembly L3 scope. Catalog semantics, canonical `packages/contracts/**`, Compiler/materializer implementation, Release/ArtifactStore, ADRs and CI workflows were not changed.

ADR-0002 and ADR-0007 remain preserved. No L4 architecture change was required.

`P5-MATERIALIZER-REGISTRY-01` remains FORECAST and was not materialized or executed.

## Residual work

The next forecast Sprint may introduce the deterministic Compiler materializer registration/lookup boundary only after this Sprint merges, current `main` is reconstructed and a new explicit instruction revalidates/promotes it.

## Review gate

- Sprint Goal: PASS
- committed TASKs implemented: YES
- TASK CI gates: PASS (#260, #261, #262)
- final closure-head `npm run verify`: REQUIRED before Ready for Review
- Sprint PR: #175
- successor Sprint materialized/executed: NO
- decision: PENDING SPRINT REVIEW
