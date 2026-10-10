# Station S4 — WP3 Planning Baseline

Date: 2026-10-10
Predecessor: WP2 CLOSED through PR #1039, merge 9768c06e0eeabdf89ee0c3eeeada63908a3fb000.
State: admitted bounded scope via #1043; Construction A materialized on validated readiness-resolution integration; no implementation or WP3 closure.

## Goal and arrival milestone

Advance the Composition Editor from session-only Save to an explicitly user-controlled, local, portable composition artifact that survives reload. Keep Station presentation autonomy; no implicit Core ownership. This is the **smallest proposed WP3** and is not the complete Component Editor / File Manager / Studio roadmap.

## Existing baseline

- `apps/station/web/app/station-editor-catalog.ts` admits exactly two immutable source-defined compositions; input validation is source-only.
- `apps/station/web/app/station-editor-workbench.tsx` maintains one React reducer session, accepts/discards drafts, and warns that save is session-only.
- `apps/station/web/app/station-editor-app.ts` exposes one singleton launcher/window.
- WP2 forbids serializing editor graphs into window-layout preferences. This remains mandatory.

## Proposed bounded WBS / dependency order

1. **Planning and contract admission**: decide canonical artifact envelope, trust boundary, migration/version policy, source ownership, revision semantics and durable provider. Reconcile architecture and QA risks; do not silently declare WP3 accepted.
2. **Construction A — portable artifact codec**: strict schema/size/version checks; deterministic export; reject malformed references, unknown descriptors, forged identities, prototype pollution and incompatible revisions before session replacement. Typed negative tests.
3. **Construction B — explicit local persistence workflow**: separate artifact store from Station presentation state; explicit Save As/Open/Export/Import actions with dirty-switch protection and recovery. Never treat browser persistence as Core authority. Test reload, corrupted data, independent composition identities and storage failures.
4. **Construction C (conditional)**: only bounded corrections demanded by A/B evidence. No new Studios, AI agents or network-backed file authority.
5. **Package Integration & Review**: end-to-end Chromium journey plus accessibility, no-data-loss, exact-head and merge-candidate verification; production builds on Windows and Ubuntu.
6. **Documentation & Closure**: reconcile evidence and debt, owner-run instructions, package state and next pointer; close only after validated merge.

## Readiness decisions and construction commitment

TASK-652 inventories the existing public envelope, graph, catalog and editor boundaries. `docs/contracts/004-station-portable-composition-artifacts/RESOLUTION-01.md` resolves public interchange by using ADR-0009, with strict composition payload, source topology/span scope, explicit caller metadata and conservative codec limits. No new architecture exception or shared schema change.

On validated readiness-resolution PR integration, only Construction A is COMMITTED: `project_docs/execution_planning/STATION-S4-WP3-CONSTRUCTION-A-01.md` / TASK-653. Codec package implementation and real-catalog/editor proof are separate from these planning changes. Existing source examples have three nodes; do not claim generic structural authoring.

Construction B remains FORECAST: explicit file download/upload UI, dirty-state/recovery proof and persistence choice are revalidated after A integrates. No origin storage or server-backed provider is chosen here; pure codec readiness does not depend on a storage provider. .composition.json is an interchange filename hint; .process remains deferred. Revalidate fresh main and worker locks before every construction sprint.

## Mandatory exit proof

Positive: export, reload/open, edit and save, switch with dirty confirm, reopen saved version, retain valid selection/preview. Negative: unknown version, truncated/oversized payload, invalid refs/slots/spans, foreign application, stale revision, storage denial/quota, malformed JSON and script fields. Assertions must prove no partial overwrite, no unauthorized Core writes, and never put graphs in window settings.

## Explicit deferrals

Core-side persistence, multi-tenant authorization, File Manager, Studio-specific file formats, automatic cross-device sync, network upload, generated AI components, publish/deploy and complete Component Editor remain separate future packages.

## Execution discipline

Planning -> approved scope/readiness -> separate construction PRs and TASK commits -> integration review -> closure. Do not claim IMPLEMENTED or PROVEN from this planning document. GitHub Actions on this planning PR are required before integration. No force pushes or destructive Git operations.

## Rolling-wave checkpoint — 2026-10-10
Construction A #1046 integrated at 1c39ee81 with seven passing workflows. Construction B materialized under TASK-654/RESOLUTION-02: explicit origin-local artifacts separate from preferences and portable file download/open. Only B is now COMMITTED; optional C/review/closure remain forecast. Historical conditional/planning labels above describe prior checkpoints, not live execution.
