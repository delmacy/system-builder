# Next Work — STATION S3 Component Grammar & Catalog

Date: 2026-10-03
Repository truth base: `main@1d57b2ab6cfffb4c0e929c9ad157b95073456892`
Status: S3 / WP6 C06B — TASK-631 CONSTRUCTION ACTIVE / EVIDENCE UNPROVEN-GAP

> Live execution pointer. Interpret with `docs/DOCUMENT_AUTHORITY.md`.

## Authority
- `docs/DOCUMENT_AUTHORITY.md`
- `docs/contracts/001-station-component-grammar/ADDENDUM.md`
- `project_docs/execution_planning/STATION-S3-COMPONENT-GRAMMAR-PLAN-01.md`
- `project_docs/execution_planning/STATION-S3-CONSTRUCTION-MATERIALIZATION-01.md`
- `project_docs/execution_planning/STATION-S3-QA-GATES-PLAN-01.md`
- `specs/tasks/TASK-631-STATION-S3-C06B-APPLICATION-LIFECYCLE-CURRENTNESS.md`

## Predecessor truth
TASK-627/C05A, TASK-628/C05B, TASK-629/C05C and TASK-630/C06A are CLOSED / PROVEN / INTEGRATED. TASK-631 materialization is CLOSED / PROVEN / INTEGRATED. Preserve `ComponentRegistry != AppManifest`; identity != placement != presentation != action; Station presentation/orchestration-only; no Core/business authority; C10 Studio DEFER/UNPROVEN.

## TASK-631 C06B Construction handoff
Branch: `sprint/station-s3-wp6-c06b-construction-r1`. Start truth: `main@1d57b2ab6cfffb4c0e929c9ad157b95073456892`. Product delta: `packages/station-application/lifecycle.ts`. Focused proof: `tests/product/station-s3-c06-application-lifecycle.test.ts`. This handoff is the third changed file; `max_files: 6` remains satisfied. No forbidden owner is touched.

Implemented behavior: Station-owned in-memory lifecycle snapshots carry explicit Application/version/revision identity. Snapshot creation re-canonicalizes the C06A manifest. Same-version/revision reopen is deterministic/idempotent. Application mismatch, stale version/revision, malformed refs and ambiguous version/revision identity fail closed. No durable persistence/storage, command/authorization, business-result/currentness, provider/runtime/deploy, Core, UI, C07 or C10 authority is added.

Test Review / Hardening: focused proof covers same-revision round-trip, repeated reopen/snapshot idempotence, stale version, stale revision, malformed ref, ambiguous version/revision, unknown/mismatched Application identity, frozen returned state and zero mutation on rejection. Recovery beyond deterministic fail-closed admission remains DEFER. Accessibility is N/A because no UI/DOM/focus/keyboard surface exists.

QA Coverage / Evidence Review: behavior + focused proof are present but remain UNPROVEN-GAP until current exact-head CI. C06A AppManifest integrity and Tool-contribution isolation are inherited only under unchanged preconditions. Mandatory lint/typecheck/product/architecture/verify and a distinct current merge-candidate must be GREEN before closure/merge; stale predecessor evidence is not reusable.

Commit-shape note: connector-backed writes create sequential commits, while repository policy prefers one authoritative commit per TASK. Normalize before closure if enforced by the current gate; do not reinterpret commit count as product proof.

Next dependency-safe work: collect exact-head gates for this branch/PR, fix only bounded TASK-631 failures, normalize commit shape if required, obtain a distinct current merge-candidate, and merge only when mandatory evidence is GREEN. C07+ remains ineligible until TASK-631 closes.