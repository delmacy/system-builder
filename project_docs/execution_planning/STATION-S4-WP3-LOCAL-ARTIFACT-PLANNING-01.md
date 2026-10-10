# Station S4 — WP3 Planning Baseline (proposed)

Date: 2026-10-10
Predecessor: WP2 CLOSED through PR #1039, merge 9768c06e0eeabdf89ee0c3eeeada63908a3fb000.
State: PLANNING PROPOSAL; not an accepted contract, not product implementation or WP3 closure.

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

## Decisions required before Construction A

- Confirm exact persistence target and security model (explicit downloaded files vs origin-local storage, or both); do not infer server-backed storage.
- Choose file extension and versioned canonical envelope only after checking existing repository file/resource contracts; preserve the earlier portable-process / multi-Studio roadmap without prematurely adopting a `.process` contract.
- Establish graph/schema migration and ownership rules before accepting imported files.
- Inspect current task locks and current main at start of every construction sprint; preserve shared worktree and other workers.

## Mandatory exit proof

Positive: export, reload/open, edit and save, switch with dirty confirm, reopen saved version, retain valid selection/preview. Negative: unknown version, truncated/oversized payload, invalid refs/slots/spans, foreign application, stale revision, storage denial/quota, malformed JSON and script fields. Assertions must prove no partial overwrite, no unauthorized Core writes, and never put graphs in window settings.

## Explicit deferrals

Core-side persistence, multi-tenant authorization, File Manager, Studio-specific file formats, automatic cross-device sync, network upload, generated AI components, publish/deploy and complete Component Editor remain separate future packages.

## Execution discipline

Planning -> approved scope/readiness -> separate construction PRs and TASK commits -> integration review -> closure. Do not claim IMPLEMENTED or PROVEN from this planning document. GitHub Actions on this planning PR are required before integration. No force pushes or destructive Git operations.
