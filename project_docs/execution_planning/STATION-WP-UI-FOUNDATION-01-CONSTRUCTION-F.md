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

## TASK761 owner refinement / shared-path ownership
Fresh main94da5ae2 and F1144 fc5d9b13. Foundation owns PresentationButton source composed from existing Button/AccessibleTooltip; ICON owns tokens/assets and future versioned portable icon reference. Three modes and controlled expansion implemented first as reusable SOURCE_ONLY control in actual Lab; persistence remains a separate coordinated migration, no hidden icon fields in codec1–4. Eight exact allowed paths.

TASK761 local source: two SSR contracts PASS; lint/typecheck/docs/753 task specs PASS. Architecture initially rejected relative cross-package icon import; corrected to public @system-builder/ui-icons and gate PASS. Expansion retains Tooltip root/trigger DOM and disables tooltip when text is visible, preserving focus. Actual hover/focus/Escape/keyboard action/expansion browser journey added; current codec/registry untouched. Exact-head browser/CI still required.

TASK761 observed heada97953ef: six workflows PASS, browser126 PASS/1 failure (hover tooltip not found); artifact11768932743 retained. Screenshot also shows compressed icon caused by default tooltip-trigger padding. Correction supplies explicit tooltip name, preserves Button-owned trigger styling, scopes existing portal provider to the actual Lab window, and adopts the shared control for real Save/Undo demo commands. Browser retains role/name, description identity, hover/focus/Escape and expansion focus assertions; adds actual screenshot evidence. Local Station production build PASS. No portable/editor readiness claim.

## TASK762 materialization: shared icon placement
Seven exact allowed paths; depends on qualified TASK761. Source-owned start/end placement, strict validation, expanded label order and real Lab browser proof. ui-icons/editor/composition/workflows/current pointer forbidden; no portable schema or readiness promotion.

TASK762 local evidence: three presentation SSR contracts PASS, typecheck/lint/docs PASS,754 task specs and architecture PASS. Browser journey asserts actual trailing glyph order for icon-text and expanded icon-only controls while retaining all hover/focus/Escape/action/focus assertions. Exact-head CI pending; source-only portable status unchanged.

## TASK763 coordinated portable-property admission
Fresh main94da5ae2 / sole open1144 qualified8e2012e1. Eleven exact paths. Foundation owns inert ButtonProperties/codec5/editor projection bridge; ICON owns assets, reference shape and resolution via existing public loader. No ICON asset edits or duplicate renderer/catalog. New presentation={mode,placement,icon:{catalogVersion,assetRef}} uses existing shape; label remains node.text/source label. Unknown/missing/version references remain portable and require honest fallback; malformed refs reject. Legacy1–4 preserved and cannot hide new fields. ICON B consumes qualified bridge without depending on whole F closure; F does not depend on whole ICON closure. Actual UI chooser/preview/save/reopen is successor task, not kernel readiness.

TASK763 pre-edit scope reconciliation: thirteen paths include responsive nested snapshots and old v4 unknown-version regression. Version5 is now admitted; unknown-version negative becomes6, with explicit v5 predecessor acceptance, not removed assertions.

TASK763 before legacy-regression edits: sixteen paths include three predecessor suites that explicitly used5 as unknown version. Preserve their rejection assertion with6 now unknown, add v5 compatibility separately; no assertion deletion.

TASK763 local source evidence:131 full editor contracts PASS, including nested presentation immutability/history/v5 roundtrip and atomic hostile accessor rejection. Legacy unknown-version tests move explicit unsupported major to6; v4 remains readable and new fields reject on downgrade. Lint/types/docs/task/architecture PASS; UI successor still required.

## TASK764 actual editor icon journey materialization
Seven exact paths, dependency TASK763 local131 editor contracts PASS. Public lazy ICON search/load plus StationGlyph renderer; three-mode/placement Inspector over same reducer/history/dirty guards. Read-only preview does not execute commands. Reference-key and cancelled effects prevent stale assets; missing/unsupported fallback keeps full label and portable reference. Actual local/file fresh-reopen browser proof required before availability claim.

TASK764 pre-edit browser admission: eight paths include existing Playwright testMatch config to run new real icon journey; no workflow edits or weakened assertions.

TASK764 pre-edit predecessor browser reconciliation: nine paths include old unknown-version negative using5. Unknown-version case becomes6, preserving rejection/unchanged-state assertions; v5 success is tested by new actual journey. Local Open saved explicitly exercises existing dirty-replacement confirmation instead of skipping the guard.

TASK764 local implementation:132 full editor contracts PASS; lint/typecheck/docs/756 task specs/architecture/root TypeScript build and Station production build PASS. React review: lazy public owner library, bounded48-result chooser, unconditional local hooks, cancellation and reference-key match, native labelled controls, no new command/state authority. Compact read-only snapshot preserves full label via existing named preview, hover title and keyboard-focusable preview wrapper; interactive shared PresentationButton retains qualified hover/focus tooltip. Exact-head browser129 expected journeys and screenshots remain pending until observed.

Observed browser history: kernel a853974d had126 PASS/1 legacy unknown-v5 failure (run38311742414 cancelled after artifact; fixed inTASK764). UI7dae81e5 six workflows PASS,128 browser PASS/1 test timeout: Playwright correctly refused pointer click on aria-disabled pending Save locally (run38312179365, artifact11775388864). Correction asserts disabled state, uses actual focus/Enter to exercise existing rejecting handler and checks unchanged text preview; no forced click, assertion removal or UI guard weakening. Add actual compact fresh-reopen screenshot alongside icon-text screenshot. New exact-head qualification required.

TASK764 test protocol review before checkpoint: Save locally accepts/cleans the draft. Deliberately stage a different icon position before Open saved, then assert the existing unsaved-open guard and explicitly discard pending fields to recover saved end placement. This exercises the guard under its actual trigger; clean opens must not invent confirmation. Source correction is within TASK764 allowed paths; checkpoint765 still awaits qualification.
