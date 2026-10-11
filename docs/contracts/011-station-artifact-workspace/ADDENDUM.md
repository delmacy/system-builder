# Addendum011 — Station local artifact workspace / File Manager
Date: 2026-10-11 UTC
Status: ACCEPTED via Planning #1086; bounded WP11 CLOSED effective on validated TASK696 integration
Admission: owner authorizes WP11 after WP10#1085, with bounded Explorer/Inspector/editor integration.

## Ownership and trust
Station owns an explicitly origin-local composition workspace, through a replaceable getItem/setItem
adapter. One separate key station:artifact-workspace:v1 stores a full validated workspace snapshot;
not window preferences, existing composition slots or Core truth. Inherited window preferences may
restore a previously opened File Manager and read its workspace metadata after reload. Opening a
composition graph in the editor always requires explicit user action; no handoff is replayed.
Workspace locations (entry/folder refs, parent and literal filename) are separate from ADR0009
artifact identity/version/provenance. Folder/file refs are opaque Station locations, not OS paths.
Folders navigate metadata only; no URI/path executes or fetches. Composition envelopes use the
existing exact installed source/identity/root/revision/payload1/2/3/4 codec unchanged.
This admitted L3 capability changes no L4 boundary; existing origin-local adapter/ADR0009 reused.
No new ADR, hosted provider, server or filesystem authority is introduced.

## Bounded workspace operations
Root folder: folder:root named Workspace, fixed parent null. Create named nested folder and append
named composition files only. No overwrite/delete/move/rename in this increment.
Snapshot exact schemaVersion1, safe integer revision, folders/files. Max16 folders (includingroot),
48 files,8 folder levels (root1),4MiB encoded UTF-8 snapshot. Each composition remains1MiB/256nodes/
32 JSON nesting/token256, existing history50. Exact metadata keys and shapes, rooted connected
acyclic folders, valid parents and unique refs. Folder refs folder:[A-Za-z0-9_-]{1,80}, file refs
file:[A-Za-z0-9_-]{1,80}; fixedroot protected. Name1–80 Unicode code points, nonblank trimmed,
no control/unpaired surrogate/slash/backslash, dot/dotdot. Files require .composition.json suffix.
Sibling names case-insensitively unique across files/folders; refs globally unique.
Native storage read/size/parse/source/cap/duplicate/conflict/quota failures leave prior text intact.
Expected raw snapshot text must match before one atomic setItem. Best-effort stale-read detection,
not cross-tab transactional CAS. Corrupted stored data remains untouched; export a retained copy
or use portable files, no hidden migration/recovery/deletion. Only validated bounded snapshots exposed.

## Editor and File Manager workflow
Normalized singleton File Manager app/window in Station; root/subfolder navigation and folder
creation, filename/type list and selected read-only Inspector (logical artifact identity/version,
source composition/schema/node count and separate folder/filename). Refresh reads actual retained
snapshot; failure preserves prior visible state and blocks mutation until a successful refresh.
Actual portable import validates extension AND real file size/read/codec before append. Filename/
MIME alone confers no trust. Export selected uses its complete validated envelope, no silent rewrite.
Editor Save to workspace creates an independent artifact identity/version1.0.0 named copy in a
selected existing folder. Pending fields/replacement block save. Successful retained copy does not
clean/change the mounted draft/history or overwrite existing legacy slots. Existing save/checkpoints
remain unchanged. Conflicts require refresh/retry, never silently overwrite.
File Manager Open in editor resolves and decodes actual selected retained file, re-reading its
snapshot to avoid stale selection. Shell opens/focuses ordinary singleton editor. Existing dirty/
unapplied/pending protections require Cancel or explicit Discard changes and open; cancellation
preserves fields/draft/selection/history, success installs actual fresh session and clears history.
No custom-event message bus or persisted presentation payload grants data authority. Repeated handoff
requests supersede older pending opens; close/reopen does not replay a consumed request.

## Growing proof and residual scope
Real editor-produced portable documents → workspace save/import → reload/refresh/folders/Inspector
→ actual guarded editor open → edit/history/export. Regress all61 browser predecessors. Positive
copies/nested folders/independent composition identities and hostile/unknown/duplicate/cycle/limits/
corrupt/quota/stale tests, keyboard/narrow/window focus lifecycle. No fake downstream fixtures.
Bounded WBS30.1.1/30.1.3/30.2.1/30.2.2 and21.3.1/21.3.2 slices only. No complete WBS/S4.
Git-like version history, .process, arbitrary binary/system files, access policies, server/Core/host,
sync/multi-tab CAS, hashes/audit and folder lifecycle remain future admitted packages.

## Validated delivery disposition
Planning #1086, Construction A #1087, B #1088 and independent Review integrated.159 combined
local product cases;68 actual Chromium journeys (61 inherited, seven new), seven construction
workflows including Windows/Ubuntu and frontend quality. Exact proof in WP11 review/closure reports.
TASK696 independently gated before effective closure. WP11-L1/L2/D1 and inherited debt retained.
No full WBS/S4/H2 promotion; WP12 only fresh-main Planning/readiness/admission.
