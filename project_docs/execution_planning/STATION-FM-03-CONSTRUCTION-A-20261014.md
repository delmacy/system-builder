# FM-03 — Construction A: busca e ordenação local

Data: 2026-10-14
Status: IMPLEMENTED — final WP verification deferred
Predecessor: FM-02 PR #1203 merged `be3c8b7a`

## Increment

- The File Manager now exposes a compact search field and explicit A–Z/Z–A sort control in its header.
- Both folders and composition files are filtered only in the current location. Ordering is deterministic by display name.
- An empty filtered result is distinguished from a truly empty folder.
- Search and sort are presentation-only state: no updates to `ArtifactWorkspace`, revisions, file identity or storage.
- Existing icon-only command buttons, tooltip titles and accessible button names remain in place.
- This Construction A does **not** claim full toolbar components/presets or overflow/menu support. Those remain for subsequent FM-03 Constructions.

## Remaining FM-03 increments

Construction B: review compact toolbar grouping, real icon tokens, controlled filter/select transitions and narrow viewport behavior.
Construction C: existing file actions (create folder/import/open/export), disabled/error states and scoped action consistency; no invented rename/delete/move service.
Test Review: integrated Playwright (filtering, sort, selected file, 390px, keyboard, malformed imports, revisions), product tests and exact-head CI.
Documentation & Enclosure: merge only on qualified final HEAD.

No new backend ownership is introduced.
