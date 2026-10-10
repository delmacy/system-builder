# Contract Addendum 005 — Station Edit History
Date: 2026-10-10
Status: ACCEPTED through #1050; WP4 CLOSED effective only on validated Documentation & Closure integration
Admission source: owner continuation/conclusion after verified WP3 closure (#1049), 2026-10-10. This increment selects the smallest reversible-edit improvement; it does not admit a complete Component Editor.

## Scope and boundaries
Admit a bounded undo/redo stack for already-admitted span edits on the two installed compositions. Station remains presentation/composition-side. Reuse C0→C9, unchanged EditorSession and graph/envelope contracts; no topology change or L3/L4 authority. WBS 21.2.1/21.2.3 covers schema-aware validated editing; this is a limited slice, not closure of that WBS.

## Normative behavior
- Exactly 50 applied changed edits may be undone; evict oldest undo snapshot at edit 51. Redo is cleared by a new changed edit, retained by a no-op or rejected edit. Graph snapshots are immutable and contain no fields/selection/focus/artifact metadata.
- Undo/redo restores only validated spans and preserves composition/session identity, root, node order/refs/component/parent/slot, installed baseline and source registry. Draft revision monotonically increases on every changed transition; reject stale revisions and safe-integer overflow with no partial mutation.
- Dirty compares restored graph to the currently accepted session baseline. Returning to baseline is clean; canonical/base revision never advances. Selection remains orthogonal and preserved.
- Successful Save changes, Save locally or Discard changes resets both stacks. A failed save, canceled open/switch, failed open, rejected edit or download request preserves history. Successful composition/file/local replacement starts empty history; reload/close starts empty history; minimize/restore preserves it with the mounted session.
- Unapplied Inspector text and pending open/switch block graph undo/redo without losing fields. Apply the fields or restore their applied values first. Controls expose availability and polite status; shortcuts are scoped to the editor, Ctrl/Cmd+Z and Ctrl/Cmd+Shift+Z or Ctrl+Y, and never intercept input/textarea/select/contenteditable/native text undo, IME, Alt-modified or repeated keys.
- History never enters local artifacts, public envelopes, preferences or Core. No automatic saving or metadata/version rewriting.

## Proof and cadence
Planning -> pure engine Construction A -> UI/browser Construction B -> optional C only for unmet bounded goal -> separate Package Review -> Documentation & Closure. Real catalog/editor edits drive convergence, stale/invalid/overflow/no-op/branching and 49/50/51 boundary proof. Browser covers route, Station window, native input undo, checkpoint/failure/cancel/reopen and persisted artifact isolation. Preserve all 21 predecessor journeys. Every Sprint has exact-head and current-base CI; no planning-only implementation claim.

## Exclusions
Structural component authoring, File Manager, .process, Core/server/sync, remote publish/deploy, AI authoring, new providers/dependencies, shared envelope/ADR/schema changes remain separately gated.

## Delivery checkpoint
Planning #1050, engine A #1051, UI B #1052 and Package Review #1053 validated and integrated. Normative behavior and source/schema/ADR boundaries above are unchanged. Twenty-nine actual browser journeys and Windows/Ubuntu builds prove the bounded goal; no complete editor claim. Documentation & Closure report maps delivery/residuals. Closure declaration activates only on validated closure PR integration.
