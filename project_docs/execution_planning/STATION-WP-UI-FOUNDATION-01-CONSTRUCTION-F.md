# WP-UI-FOUNDATION-01 — Construction F: Visual Editor Registration
Date: 2026-10-12
Status: MATERIALIZED, NOT EDITOR-READY.
Base main after Construction E PR #1143 (94da5ae21065f6d62c1b006ca14fa6d110cee34a).

## Authority and integration constraints
Follow docs/contracts/021-station-ui-foundation/ADDENDUM.md and the P/A/B/C/D/E/F/G/T/I/Z plan. Existing ComponentRegistry, editor session, composition draft, codec and canonical revision paths remain the only authority; no second registry, storage provider, or serialized format. Preserve existing Catalog/Studio/File Manager owner boundaries and ICON assets.

## Scope and ordered execution
F1: inventory actual ui-core exports and live editor descriptors; add one typed source-owned manifest associating stable descriptor identity, UI component, palette taxonomy, insertable capabilities and allowable properties. Explicitly distinguish SOURCE_ONLY, PREVIEWABLE, INSERTABLE, EDITOR_READY.
F2: connect manifest to existing Component Editor palette/search, compatibility and grid insertion; never invent insertion eligibility for unimplemented types, and handle duplicate IDs safely.
F3: Inspector mutations with typed/validated properties, preview and durable save/reopen round-trip on currently supported composition authority. Negative malformed slot/property/unknown component checks. Test representative primitives, compounds, collection where actually promoted.
F4: browser proofs, exact-head all-seven CI, acceptance evidence, guarded merge and documentation.

## Start condition and acceptance
Only the manifest inventory/contract is materialized here. Editor-ready demands actual UI-driven insert→inspect→save→reopen and equivalent rendered result, not a descriptor or Lab-only demo. Test exact current base and preserve other workers' paths. No claims of F closure at materialization.

## Bounded F2 admission task
TASK-755 materialized on fresh main94da5ae2 / draftPR1144 head3da9159. Allowed six paths, no package/codec/icon/operational-pointer edits. Reuse actual structural admission for palette eligibility, then synchronous selection fallback and focused negative/browser proof. Remaining F2/F3 component registration/property/persistence work is not complete.

### TASK-755 local implementation evidence
Compatible palette now probes existing applyEditorStructure without changing the session, so actual slot/cardinality/codec admission governs options. Selection falls back synchronously after search or container changes. Five focused candidate/admission contracts PASS; lint/typecheck/docs PASS; 747 task specs validated. Browser filtered insertion journey added but not yet observed locally. Full verification and exact-head CI are still gates, and F remains open. No new component promoted Editor-ready.

Expanded existing editor/candidate regression: 126/126 PASS via node --import tsx. npm run verify ran lint/typecheck then failed at tsx IPC listen EPERM (/tmp/tsx-0/*.pipe); no full local verification claim. GitHub CI required.

## TASK-756 bounded shared-renderer slice
After TASK755, replace the existing Button preview approximation with source-owned Button recipes. Six allowed files, inherited v4 contract, no schema or registry changes. Real fresh-session export/reopen assertions must check native Button rendering; no additional control readiness claim.

### TASK-756 local source evidence
Both admitted button IDs now render ui-core Button with the existing default/outline/ghost properties. The existing named preview image retains projection semantics; the inner visual snapshot is aria-hidden, untabbable, pointer-inert and invokes no command. Native disabled/text/recipe checked in SSR. 128 editor/candidate/renderer contracts PASS, lint/docs/tasks PASS. Initial typecheck found exact optional-property and custom data-attribute typing errors; fixed with explicit optional undefined and typed ButtonProps intersection, then typecheck PASS. Browser fresh v4 file reopen asserts actual native Button and captures screenshot. Older browser negative-placement journeys now assert incompatible options excluded and occupied slots disable insertion, preserving unchanged revision and valid-slot recovery. F remains unqualified.
