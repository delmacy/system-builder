# Station S4 WP3 Package Integration & Review Report 01

Date: 2026-10-10
TASK: TASK-655
Base: main@4a749f6b4c18fe769d30c1c034280f134fb6b79d
State: review IMPLEMENTED / PROVEN / INTEGRATED via #1048 at 00a37c76; GO effective

## Integrated traceability and goal
WP2 closure #1039 precedes WP3 planning/readiness/admission #1040–1045. Scope is accepted Addendum 004, ADR-0009 composition payload RESOLUTION-01 and explicit origin-local/file decision RESOLUTION-02.

| Admitted output | Integrated implementation and proof |
|---|---|
| Portable strict data-only artifact | A #1046 / TASK-653 canonical commit 6c40da25, merge 1c39ee81; real catalog/editor -> codec -> fresh session, deterministic immutable bytes, opaque metadata and all four budget boundaries; eight product cases |
| Explicit reload-safe local artifact | B #1047 / TASK-654 authoritative commit a4c5318f, bounded correction 0ec0159e, merge 4a749f6b4c18fe769d30c1c034280f134fb6b79d; separate whole-document storage namespace and typed failures; native setItem plus expected-text check |
| Portable file journey | Actual Save As downloaded bytes -> fresh browser context Open file -> real session/preview; size-first read and registry validation; new identity on Save As, changed patch/predecessor provenance, unchanged tuple and optional metadata retained |
| Safe recovery / regression | Final B Chromium 21/21 (12 predecessor + 9 WP3), including dirty cancel/confirm with focus, stale asynchronous read, corrupt/version/script/size, quota/conflict and independent catalogs; product file/store cases five; preference serialization checked |
| Build and repository integration | A seven passing workflows; B exact-head 38076637593, merge-candidate 38076637683, heavy 38076637616, browser 38076637656, Windows/Ubuntu builds 38076637627, frontend 38076637601 and handoff 38076637734 all passed |

Browser artifact 11679256267 belongs to exact B head 0ec0159e, run 38076637656; digest sha256:abd93269d0acc5e1a28f938237e3459687d1f2c46b744e40c4fc4ed3cab2336e, retention through 2026-10-24. Downloaded and visually inspected wp3-local-reopened.png, wp3-file-reopened.png and wp3-station-retained.png. Route screenshots show convergent selected layer/inspector/preview and file/local controls; window screenshot shows wrapped controls and constrained scroll area. No deployed environment or complete visual/accessibility audit is claimed.

## Contract, architecture and trust review
Git comparison eaad7ef3..4a749f6 shows no changes in accepted ADRs, shared specs/contracts, packages/contracts, station-settings/composition or .github. Public envelope identity/SemVer/schema/provenance remains ADR-0009; composition payload is strict. Source topology/node order/labels/registry remain installed and only bounded spans can change. Local artifact provider is replaceable getItem/setItem; package imports source resolver through caller, never app internals. No Core/network/provider/runtime/deploy semantic ownership change or capability grant; imported URIs/extensions are never fetched/executed.

Decode checks complete UTF-8 bytes/depth before parse/copy; plain inert JSON, prototype-unsafe keys, malformed references, cycles/cardinality/identity/revision/schema/required-extension reject before replacement. Canonical encode validates too. Store writes one full validated text; failure/conflict leaves prior text, editor and metadata unchanged. Explicit dirty/unapplied/session-accepted protection and asynchronous session/sequence guards prevent silent file replacement. Browser-native atomic setItem does not imply transactional synchronization between tabs. Read-denial and file-read errors are product tested; browser quota/conflict/download failures are exercised. No partial overwrite guarantee is inferred for arbitrary third-party adapters outside their own atomicity contract.

## Accessibility, performance and dependency fitness
Native labeled controls, tree keyboard/selection semantics, polite status/error, cancel focus after re-enable, read-only root and narrow layout regressions pass. This is tested interaction coverage, not a certification or universal assistive-technology audit. Bounds of 1 MiB, 32 container levels, 256 graph nodes and 256 code-point tokens constrain codec work; installed examples each contain three nodes. Cycle validation includes bounded ancestor traversal and synchronous browser storage/JSON work; no latency or large-graph benchmark was measured. No unsupported speed claim or structural-authoring claim.

## Classified residuals / future backlog
| ID | Classification and closure disposition |
|---|---|
| WP3-L1 | Accepted origin-local durability limit: quota/denial/cleared browser data; portable file export is the independent user-controlled copy. UI and owner instructions must retain this distinction. |
| WP3-L2 | Explicitly deferred multi-tab transactional synchronization; expected text detects stale copies but is not cross-tab CAS. No concurrent-writer guarantee. |
| WP3-L3 | Download requests lack a filesystem-save receipt; dirty draft remains. File Manager/network/sync/structural authoring/.process remain outside admitted scope. |
| WP3-D1 | Nonblocking UX follow-up: corrupt/stale existing origin slot cannot be overwritten until valid reopen; preserve bytes and use portable export for recovery. No destructive reset/migration added. |
| WP3-D2 | Nonblocking scale follow-up: synchronous bounded serialization/storage and cumulative provenance; reaching byte limit rejects safely. Quantified performance and larger catalogs need separately admitted proof. |
| WP2-D1 | Inherited minimized-mounted window memory lifetime remains unchanged; not silently closed by WP3. |

None is an unmet bounded Package Goal; no blocker observed. Optional Construction C NOT PROMOTED. A/B delivered the two required construction increments. One bounded B corrective commit fixed actual CI focus failures, old footer assertion and mandatory task headings; initial 18/21 was not treated as pass. No task-count/elapsed-hour estimate was invented. Review adds no product feature and closure must reconcile memory/operations only.

## Observed review validation and readiness
Fresh-main focused codec/file/store tests passed locally 13/13. Documentation check and task catalog validation passed. Declared npm run verify passed lint/typecheck, then failed at tsx CLI IPC binding with EPERM; this is not a local full-verify pass. Full current review-head Actions/browser regression remain required before merge. Product code is byte-identical to integrated B, so its Windows/Ubuntu proof remains applicable.

GO to Documentation & Closure after this review's validated merge. Closure must update contract registry delivery status, current handoff/risks, module/owner instructions and final package traceability; PROJECT_STATE/CURRENT_MILESTONE are absent, and legacy TASK_LEDGER remains a byte-preserved compatibility fixture per docs/README.md. No future package is automatically materialized. Any required capability discovered by review or closure returns to explicit construction/change control.

## Integrated review checkpoint
Review head 07ce9b45 passed all five workflows: exact-head 38077056136, merge-candidate 38077056224, heavy 38077056011, browser 38077056098 (21/21, artifact 11679646414), handoff 38077056036. #1048 merged at 00a37c76. Earlier pending statements are historical branch checkpoints; documentation closure is the sole current Sprint until its validated integration.
