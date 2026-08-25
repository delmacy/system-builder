# P14-EVIDENCE-PROVENANCE-CONTRACT-01 — Evidence provenance contract foundation

Status: COMMITTED / MATERIALIZED / NOT EXECUTED
Milestone: M14
Work Package: P14-PACKAGE-01
Base after planning merge: fresh `main` containing this materialization
Branch: `sprint/P14-EVIDENCE-PROVENANCE-CONTRACT-01`
TASK order: TASK-267 -> TASK-268 -> TASK-269 -> TASK-270 -> TASK-271 -> TASK-272 -> TASK-273

## Goal
Establish a deterministic, provider-neutral evidence provenance extension contract over ADR-0009's existing public artifact envelope, covering stable source references, optional classification/confidence, transformation descriptors and lossless lineage preservation without changing core envelope semantics.

## Predecessor gate
- M13/P13 closed on fresh main.
- ADR-0009 accepted.
- artifact-envelope 1.0.0 integrated and validated.
- P14-PACKAGE-01 Planning & Materialization integrated before any TASK executes.

## Committed TASKs
1. TASK-267 — define additive evidence-provenance extension contract.
2. TASK-268 — deterministic validation and canonical normalization.
3. TASK-269 — stable source-reference semantics and compatibility with artifact inputs.
4. TASK-270 — optional classification/confidence semantics.
5. TASK-271 — transformation/tool/provider-neutral descriptor semantics.
6. TASK-272 — lossless lineage preservation through compatible serialization/round-trip.
7. TASK-273 — integrated growing proof, compatibility and no-leak certification.

## Growing integration proof
The Sprint must prove historical artifact-envelope 1.0.0 remains valid; new evidence-provenance extensions validate deterministically; unknown compatible extension data is preserved; source/input lineage remains stable through serialization; no secrets, credentials, mandatory provider resource IDs or storage locators are required; and provenance never becomes execution authority.

## Final validation
- `npm run test:product`
- `npm run check:tasks`
- `npm run check:architecture`
- `npm run verify`

## Stop/escalation conditions
Stop and escalate if implementation requires changing an ADR-0009 core field's meaning, Builder/Runtime topology, authorization semantics, mandatory provider/storage coupling, destructive migration, or any L4 change not already decided by an accepted ADR.

## Explicit exclusions
No WBS 14.3 query/navigation implementation, no Runtime Audit Trail replacement, no TD-P13-01..04 absorption, and no Construction B/C execution in this Sprint.
