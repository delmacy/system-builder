# P14-EVIDENCE-PROVENANCE-NAVIGATION-01 — Promotion & Materialization Report

Date: 2026-08-25
Base main: `92fa2daaa9e8156260160721da5963328bffb78f`
Decision: CONSTRUCTION B PROMOTED / COMMITTED / MATERIALIZED / NOT EXECUTED
Primary WBS: 14.3.2

## Revalidation outcome
Fresh-main authority confirms Construction A is integrated, WBS 14.3.1 is satisfied, and WBS 14.3.2 remains a real bounded capability gap. Existing provenance already carries explicit portable `evidenceId`, source references and lineage, but no reusable deterministic bidirectional navigation projection/query exists.

## Materialized Sprint
`P14-EVIDENCE-PROVENANCE-NAVIGATION-01` with TASK-287..292:
- TASK-287 navigation projection semantics;
- TASK-288 deterministic in-memory projection builder;
- TASK-289 source→evidence query;
- TASK-290 evidence→source query;
- TASK-291 deterministic negative/ambiguity semantics;
- TASK-292 composed growing proof and Sprint report.

The dependency chain is bounded and does not require a graph database, provider registry, durable query store, storage topology, Runtime Audit Trail replacement, authorization semantics, secret capture or ADR reinterpretation.

## Deferred decision
WBS 14.3.3 remains PARTIAL. Optional Construction C is not promoted. After Construction B is integrated, fresh-main evidence must decide whether any residual migration-preservation product construction is actually necessary.

## Execution gate
No TASK in Construction B may execute until this Planning & Materialization change passes exact-head repository gates and is integrated into `main`. After integration, create `sprint/P14-EVIDENCE-PROVENANCE-NAVIGATION-01` exactly from fresh merge-main and execute TASK-287 first.

## Carried debt
TD-P13-01..04 remain carried and unchanged.
