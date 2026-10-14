# FM-03 — Construction B: compact command toolbar

Date: 2026-10-14
Status: IMPLEMENTED IN PR #1204 — no WP Test Review yet
Predecessor: FM-03 Construction A in same PR.

## Implemented
- The existing File Manager action toolbar now remains a single compact row and scrolls horizontally on small windows instead of wrapping buttons into crowded, multi-line groups.
- Every command button is flex-shrink protected so icon affordances remain individually clickable. Existing accessible action names, `title` hover tooltips, pressed/disabled states and command callbacks are preserved.
- The search and sort area keeps the sort button accessible without shrinking behind the search input.
- No new unimplemented file commands, mutation providers or synthetic icon tokens were introduced.

## Boundaries and next increment
- Native `title` is not sufficient for full keyboard tooltip qualification. Such accessible tooltip and overflow menu work must use existing shared UI contracts and be demonstrated in a real consumer before claiming parity.
- Construction C will focus on file-operation and feedback consistency (create/import/open/export) with the existing workspace authority; no rename/delete/move or remote filesystem.
- Per-owner instruction, integrated Playwright/product/CI remains deferred until the final FM-03 Test Review, then corrections and Documentation & Enclosure. This Construction alone is not accepted as a closed WP.
