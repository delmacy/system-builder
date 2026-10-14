# FM-02 — Construction B: folder location history

Date: 2026-10-14
Status: IMPLEMENTED IN BRANCH — integrated Test Review deferred to WP end

## Implemented
- File Manager has Back and Forward buttons alongside Up in the actual toolbar.
- Navigation through sidebar, breadcrumbs and Up records stable folder refs, ignores repeated current location and truncates forward history on a new branch.
- History traversal reuses the same `navigate` side effects for folder selection reset, pending import invalidation, ancestor disclosure and breadcrumb location while avoiding duplicate history entries.
- No mutation to `ArtifactWorkspace`, schema, persistent storage, revision identity, import/export or Core.
- Only icon tokens actually present in `ui-icons` may be rendered; history arrows currently use accessible labeled buttons with decorative arrow glyphs.

## Remaining for Construction C / Test Review
- Validate refresh with entries whose folders were externally removed or replaced; prune stale history without hiding data.
- Responsive 390px navigation and Inspector, focus, keyboard and nested disclosure.
- Add Playwright user journeys for Back/Forward, branching, and cross-refresh behavior at the integrated end-of-WP review.

No FM-02 closure claim; keep changes on PR #1203 until Constructions finish and exact-head checks pass.
