# Construction G — Component Catalog Completeness

## Scope and authority

This increment completes the real Station Composition Editor path for three source-owned primitives: `ui:color-field`, `ui:property-picker` and `ui:document-text-field`. The authoritative component descriptors remain in `packages/station-composition/ui-foundation-descriptors.ts`; the canonical graph, history and artifact codec remain the single editing/persistence path. The Station is presentation-only.

## Delivered in this construction

- Canonical registry/catalog admission and strict source-owned property shapes.
- Atomic `set-properties`/`reset-properties` operations through `EditorStructureIntent`, `EditorSession`, draft transactions, history and undo/redo. Validation is component-ref-specific; invalid values reject without mutation.
- Deeply frozen picker choices and no-op equality based on inert property data.
- Inspector controls for common label, value, disabled state; picker choices and selected ID; document max length, rows, read-only and text.
- Actual source `ColorField`, `PropertyPicker` and `DocumentTextField` in Editor preview, with callbacks inert and no business authority.
- Existing local/portable artifact writer and decoder, with no parallel persistence.
- Product and Playwright evidence covering insertion, field edits, draft history, invalid rejection, preview and save/reopen.

## Acceptance gates

A component must not receive `EDITOR_READY` from descriptor registration alone. Close this construction only after exact-head CI passes all required checks, including Deterministic CI, Merge Candidate CI, Station Frontend Quality, Cross-Platform Build, Heavy Product Tests and the Station Editor Browser Journey. Any failing gate must be corrected and rerun. Source primitives are inert; no action execution, external storage authority or secret handling is granted.

## Traceability

- G-A/G-B: canonical registration and atomic insertion.
- G-C: PR #1190, source catalog wiring and first real insertion proof.
- G-D: PR #1191, all-three local save/reopen.
- G-E: PR #1192, Inspector span persistence; PRs #1193–#1195 for strict typed contract and canonical graph.
- G-F: PR #1196 for EditorSession operation, Inspector/preview, undo/redo and browser round trip. Closure is conditional on exact-head CI.

After successful CI and merge, the three fields are qualified for the composition editor's source-bound inert property workflow. This qualification does not assert arbitrary dynamic schema editing or Core-persisted publishing.
