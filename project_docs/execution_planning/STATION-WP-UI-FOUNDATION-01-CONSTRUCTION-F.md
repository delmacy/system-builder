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
