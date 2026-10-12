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

## TASK-757 materialization: actual Card composition
Eight paths, existing action-panel registry only; Card column/content slot plus existing span Inspector, default presentation, derived immutable title. No codec change or arbitrary properties. Source candidate remains unqualified until actual UI insert/edit/nest/export/fresh-reopen and exact-head CI. Existing compositions/identities/revision remain unchanged.

TASK755 historical head ea796036: six workflows PASS, browser123 PASS /2 failures in old tests attempting now-excluded options. TASK756 updates those assertions to prove exclusion/disabled occupied slot and recovery; head86978404 rerun pending. No passing-browser claim for ea796036.

TASK757 admission clarification before census edit: nine paths including candidate contract test. Card census explicitly maps registry component:card and composition:action-panel, stage INSERTABLE reflecting locally proven structural admission; EDITOR_READY remains forbidden until qualified browser. Six prior candidates remain SOURCE_ONLY.

### TASK757 local source evidence
Card registered in existing action-panel registry, actual Card/Header/Title/Content preview and content slot composed using current editor/codec2. 130 inherited editor/candidate/renderer contracts PASS; lint/typecheck/docs and749 task specs PASS. Negative row/unknown slot, invalid ButtonProperties on Card and corrupted nested import reject. Source mappings and INSERTABLE census stage added; new browser insert/span/nest/export/fresh reopen/narrow screenshot journey awaits actual CI. No arbitrary Card title/style/variant properties admitted.

TASK756 historical head86978404: six workflows PASS, browser124 PASS /1 fail: legacy 256-character preview full-label title absent on actual Button. Fix restores title=label and escaped SSR assertion without weakening browser test. TASK757 Station production Next build PASS locally; generated build output removed after verification.

## TASK758 materialization: admitted palette discoverability
Six paths. Restore spaced human-name search and category lookup; consume the Card candidate mapping, supported Button identity contract, and layout-family fallback. Taxonomy never grants eligibility; existing structural admission remains authoritative.

### Qualified source head / pending integration
Head0c3fc48e94cddb47a509f136ac9cbc5c518f1867: all seven workflows PASS, actual browser126/126 PASS (run38290668638). Artifact11765162778 includes native Button fresh v4 reopen and Card insert/span/nested content/fresh codec2 reopen/narrow screenshot, expires2026-10-26. This qualifies the bounded source slice, not F or main integration; PR1144 remains draft.

### TASK758 local implementation
131 focused editor/candidate/renderer contracts PASS; lint/typecheck/docs/750 task specs PASS, root TypeScript build and Station production build PASS. Palette searches readable labels, IDs and actual presentation category while structural admission remains authoritative. Category labels displayed in actual options; Card browser journey now locates Display and nested Actions. Exact new-head CI required.

## TASK759 screenshot-driven preview hardening
Six paths. Actual Card mobile screenshot shows nested controls compressed into unreadable fragments despite126 browser PASS. Bounded presentation-only stacking at narrow widths and nested truncating label span preserve authored geometry, inert preview and full-title contract. Add direct label-room browser assertion.

### TASK759 local implementation
131 inherited contracts PASS; lint/typecheck/docs and751 task specs PASS. Narrow grid preview uses a stacked CSS projection and row items occupy available width; authored spans and Inspector remain untouched. Button labels use a truncating inner span with full title retained on both span and native control. Browser Card reopen now checks readable native Primary action width above90px and preserved authored8columns; actual screenshot review/new exact-head CI remain gates.

## TASK760 evidence checkpoint materialization
Nine exact paths. After source gates, preserve real before/after screenshots and partial F report; update independent UI lane only, keeping primary ICON/WP02 handoff byte-for-byte. Fresh main94da5ae2 and only openPR1144 establish absence of another visible operational-pointer owner. No source-only promotion, sprint closure or successor execution.

TASK760 pre-edit clarification: eleven paths include candidate manifest/test. Align already-qualified Button census to INSERTABLE with primary actual registry/composition mapping, same stage as Card; five other candidate families remain SOURCE_ONLY. No category/eligibility/render/codec behavior changes.

### TASK759 qualified source / TASK760 checkpoint
Source6005d862 all seven workflows PASS,126 actual Chromium journeys PASS (run38292031625, artifact11766971745). Screenshot reviewed: nested Primary/Secondary action labels readable at390px, Card authored spans8/4 preserved. TASK760 preserves unmodified PNGs, reconciles Button INSERTABLE census and updates only independent UI lane. Final checkpoint needs own CI; F and PR1144 remain open/unmerged. Consolidated factual report: STATION-WP-UI-FOUNDATION-01-CONSTRUCTION-F.report.md.
