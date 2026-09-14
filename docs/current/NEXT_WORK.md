# Next Work — G2-WP-10 / Construction B Planning & Materialization

Generation 2 remains rolling-wave and dependency-safe.

## Closed predecessor
G2-WP-01..G2-WP-09 are canonically closed. G2-WP-10 Construction A for G2-WBS-15 (`TASK-547 -> TASK-548 -> TASK-549 -> TASK-550`) is integrated. Its fresh-main Sprint Review closed `PASS / CONSTRUCTION B REQUIRED` with no bounded rework required.

## Current mandatory gate
Execute only **G2-WP-10 Construction B Planning & Materialization** for `G2-WBS-16 — AGWS / AI-mediated generation and assistance`.

From fresh main and the exact current research authority, derive the smallest dependency-safe TASK chain, allowed file/surface ownership, typed dependencies, acceptance criteria and Product Proof obligations. Do not implement Construction B inside the planning gate.

Construction B must preserve `AI inference/proposal != authority`; candidate-until-disposition semantics; prompt/context/evidence provenance and currentness; contradiction/negation/uncertainty; unresolved-critical-coverage blocking; qualified model/provider substitution; generated artifact source/evidence/revision lineage; hybrid versioned auditable EKB; and Product Proof separate from Production Readiness.

## CI evidence model
Exact-head proof (`Deterministic CI`, `Heavy Product Tests`) remains distinct from synthetic integration proof (`Merge Candidate CI`). If `main` advances, previous merge-candidate evidence is stale. Workflow changes additionally require `Workflow Lint`; `npm run verify` includes `check:docs`.

## Boundary
Do not absorb concrete model vendors/SDK adapters, prompt-orchestration runtime, autonomous agent authority, apps-wide UI redesign, persistence/DB, runtime-core redesign, WP-11+, Production Readiness or DEFER/DO_NOT_BUILD findings unless the separate bounded Planning & Materialization explicitly materializes an allowed portion consistent with G2-WBS-16 authority.