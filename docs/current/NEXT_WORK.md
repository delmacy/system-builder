# Next Work — STATION S3 Component Grammar & Catalog

Date: 2026-10-03
Repository truth base: `main@3411b725ad58749ce20fe2f70263c98bbf83fb37`
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
TASK-627/C05A, TASK-628/C05B, TASK-629/C05C and TASK-630/C06A are CLOSED / PROVEN / INTEGRATED under unchanged owners/preconditions. TASK-631 materialization is CLOSED / PROVEN / INTEGRATED. Preserve `ComponentRegistry != AppManifest`; identity != placement != presentation != action; Station presentation/orchestration-only; no Core/business authority; C10 Studio DEFER/UNPROVEN.

## TASK-631 C06B Construction handoff
Branch: `sprint/station-s3-wp6-c06b-construction`. Start truth: `main@3411b725ad58749ce20fe2f70263c98bbf83fb37`. Product delta is bounded to `packages/station-application/lifecycle.ts`; focused proof is `tests/product/station-s3-c06-application-lifecycle.test.ts`. No forbidden owner was touched and the 3 changed files remain within `max_files: 6`.

Implemented behavior: Station-owned in-memory lifecycle snapshots carry explicit Application/version/revision identity; snapshot creation re-canonicalizes the already-proven C06A manifest; same-version/revision reopen is deterministic and idempotent; Application mismatch, stale version/revision, malformed refs and ambiguous version/revision identity fail closed. No durable persistence/storage, command/authorization, business-result/currentness, provider/runtime/deploy, Core, UI, C07 or C10 authority was added.

Test Review / Hardening: focused proof covers same-revision round-trip, repeated reopen/snapshot idempotence, stale version, stale revision, malformed ref, ambiguous version/revision, unknown Application, snapshot Application mismatch, frozen returned state and zero mutation on rejection. Recovery beyond deterministic fail-closed admission remains DEFER. Accessibility remains N/A because no UI/DOM/focus/keyboard surface exists.

QA Coverage / Evidence Review: behavior + focused proof are present but remain UNPROVEN-GAP until current exact-head CI runs. C06A AppManifest identity/integrity and Tool-contribution isolation are inherited only under unchanged preconditions. Mandatory lint/typecheck/product/architecture/verify and a distinct current merge-candidate must be GREEN before closure/merge; stale predecessor evidence is not reusable.

Blocker: repository policy prefers one authoritative commit per TASK, while connector writes materialized behavior, proof and this handoff as sequential commits. Treat commit-shape normalization as required before final closure if the active gate enforces it; do not hide or reinterpret it as product proof.

Next dependency-safe work: open/reconcile the TASK-631 Construction PR on this exact branch, collect exact-head gates, fix only bounded failures inside TASK-631, normalize commit shape if required by the current gate, then obtain a distinct current merge-candidate and merge only when all mandatory evidence is GREEN. C07+ remains ineligible until TASK-631 closes.