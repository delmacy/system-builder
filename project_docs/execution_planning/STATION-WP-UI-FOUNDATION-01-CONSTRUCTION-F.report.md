# UI Foundation F — partial functional checkpoint

Date: 2026-10-12. **F OPEN; WP OPEN; PR #1144 DRAFT / NOT MERGED.**
Authority: Addendum021, ADR0017, current UI plan, Construction F manifest and TASK755–769 and TASK775. Fresh main94da5ae2; planning#1137 and bounded C/D/E#1141/#1142/#1143 confirmed merged. The obsolete local C branch was preserved; work continued from current remote F, without replacing other workers' changes.

## Functional result and limits

| Surface | Implemented in F draft | Admission / persistence limits |
|---|---|---|
| Palette | Actual ComponentRegistry plus existing applyEditorStructure admission; occupied/incompatible slots excluded; selection resolved after filtering; readable name/ID/category search | Categories never grant eligibility; absent controls cannot be inserted |
| Button | Actual source-owned ui-core Button in both admitted button IDs; text, default/outline/ghost, disabled, public owner icon chooser, text/icon-text/icon and start/end placement; full label preserved | Inert preview image, no business command execution; secondary/destructive authoring not admitted |
| Card | component:card in existing action-panel registry; shared Card/Header/Title/Content; content slot; current span Inspector; nested Button; export/fresh reopen | Default presentation and derived node title only; no arbitrary title/style/variant properties; current codec2, no schema fork |
| Narrow preview | Stacked presentation and readable nested controls at390px; truncating inner Button label with full title | Saved Card spans remain8columns/4rows; no canonical geometry or WindowGeometry mutation |
| Candidate census | Seven candidate families; primary Button, Card, Input and Checkbox INSERTABLE with actual registry/composition references | Three candidates remain SOURCE_ONLY: Dialog, Toolbar, DataTable. No EDITOR_READY promotion before main integration |

Three existing installed compositions remain. Source candidate census is presentation metadata, never a second registry. Current canonical draft/history/codec/store/file import remain authoritative. ICON assets/library APIs and Core/business owner contracts were not changed. Coordinated visual artifact L3 admission adds explicit payload5 for icon presentation; formats1–4 remain supported.

## Authoritative source commits and observed corrections

| TASK | GitHub source commit | Result |
|---|---|---|
| 755 | ea79603671b322f524902d5fc479b7c25eeab84c | Slot admission / resolved palette selection |
| 756 | 8697840440d4821783f3f6d832aff07b9c8858a4 | Shared Button preview; correction972851035715a78199424f2d5df4790ea8cfb1d5 restores legacy full-label title |
| 757 | 0c3fc48e94cddb47a509f136ac9cbc5c518f1867 | Card registry/slots/Inspector/current-codec composition; all seven workflows and126 browser journeys PASS |
| 758 | f40fc9ada89972397195955977690775606edc0f | Name/category lookup; all seven workflows PASS |
| 759 | 6005d862978472eb2d585a1d259a6887592b88ca | Screenshot-driven narrow preview hardening; all seven workflows and126 browser journeys PASS |
| 760 | Checkpoint commit following qualified759 | Durable unmodified screenshots, census and independent live-lane reconciliation; its own triggered checks required |

Historical head ea796036: browser123 PASS /2 failures because old negative-placement journeys tried selecting now-excluded options. Updated assertions prove exclusion, occupied-slot disablement, unchanged revision and valid-slot recovery. Historical head86978404: browser124 PASS /1 failure, lost title for256-character label; implementation restored title and retained the inherited assertion. Neither failed head is claimed qualified.

## Verification

Local observed:131 editor/candidate/renderer contracts PASS; lint, TypeScript, documentation, task validation and architecture PASS; root TypeScript and Station production builds PASS. Source task759 validated751 task specs; materialized checkpoint760 validates752 specs. Full local npm run verify stopped at tsx IPC listen EPERM under /tmp/tsx-0/*.pipe after lint/typecheck. Focused tests used node --import tsx; no claim of full local verify. Actual Chromium execution is GitHub evidence.

Qualified source6005d862 workflow evidence:

| Workflow | Run | Result |
|---|---|---|
| Deterministic CI | [38292031632](https://github.com/delmacy/system-builder/actions/runs/38292031632) | PASS |
| Merge Candidate CI | [38292031615](https://github.com/delmacy/system-builder/actions/runs/38292031615) | PASS |
| Heavy Product Tests | [38292031764](https://github.com/delmacy/system-builder/actions/runs/38292031764) | PASS |
| Station Cross-Platform Build | [38292031758](https://github.com/delmacy/system-builder/actions/runs/38292031758) | PASS |
| Station Frontend Quality | [38292031946](https://github.com/delmacy/system-builder/actions/runs/38292031946) | PASS |
| Automation Handoff State Machine | [38292031666](https://github.com/delmacy/system-builder/actions/runs/38292031666) | PASS |
| Station Editor Browser Journey | [38292031625](https://github.com/delmacy/system-builder/actions/runs/38292031625) | 126/126 PASS |

New journeys cover actual filtered insertion; category Display→Card / Actions→Button; span Inspector; nested slot; file export→new browser context import; native rendered Button and Card;390px no page overflow/readable action width; preserved data/Inspector spans. Inherited journeys regress keyboard, history, legacy codec1–4, imports, local storage/workspace/revisions and existing Studio owners. This is bounded coverage, not complete accessibility certification or every foundation family.

## Durable visual evidence

Unmodified PNG bytes copied from actual Chromium artifacts, reviewed visually. Button before/after uses the same WP8 outline/disabled/history scenario, not a fabricated mockup or pixel-regression claim. Card comparison uses the same authored8/4 nested composition and fresh file reopen at390px; before clips Primary/Secondary action labels, after stacks them legibly. Both preserve the authored spans.

| Saved PNG | Source head / run / artifact | Original artifact path | SHA256 |
|---|---|---|---|
| [Button before](../evidence/ui-foundation-f/button-before.png) | 6eb81967 /38265758403 /11754533413 | test-results/station-editor-workbench-W-21bc6-and-second-installed-family/wp8-button-properties.png | b7fd4d32e4d17456957bb99ca3a4e9833f7298d2bf171e9a29577a6f1347b445 |
| [Button after](../evidence/ui-foundation-f/button-after.png) | 6005d862 /38292031625 /11766971745 | test-results/station-editor-workbench-W-21bc6-and-second-installed-family/wp8-button-properties.png | 518da6c746def8c455eb8745036e4894e0a0bc2703283b90c51875f15ee6c530 |
| [Card narrow before](../evidence/ui-foundation-f/card-narrow-before.png) | 0c3fc48e /38290668638 /11765162778 | test-results/station-editor-workbench-s-f4932-ntent-and-fresh-file-reopen/foundation-card-fresh-reopen.png | 5199f32bb561245ac7295f48c3b8e9142fa5a643a32a9bccc853e6eefa6fd0f7 |
| [Card narrow after](../evidence/ui-foundation-f/card-narrow-after.png) | 6005d862 /38292031625 /11766971745 | test-results/station-editor-workbench-s-c5e65-ntent-and-fresh-file-reopen/foundation-card-fresh-reopen.png | b6b2d3016c957d957dac96ba9054837112973e75e4a3d2d2299c235f74bba6e8 |

Source artifacts expire2026-10-26; these four PNGs remain in Git. Failed-head traces/logs are identified above; no discarded failure evidence is substituted for success.

## Remaining acceptance gaps / next eligible work

F has not exposed the remaining primitive, overlay, workstation and collection families with typed properties, slots, actual preview and UI save/reopen proof. Next eligible work is bounded form-control registry/property/Inspector/codec admission with strict rejection and legacy1–4 recovery; no second editor or generic opaque property bag. Only then promote corresponding candidates.

Reconcile residual source targets too: menus/Tabs/Accordion/navigation/command search and advanced DataGrid capabilities were not proved complete by the bounded C/E merges. Card has no editable title/custom variants; Button authoring exposes three of five source variants. ICON toolbar/chooser/icon-reference schema ownership remains a shared migration constraint. No icon schema was changed here.

Studio adoption G, hardening T, integration I and closure Z remain forecast. Final-head CI is mandatory for the checkpoint; source qualification is not main integration. PR1144 stays draft because full F acceptance is still incomplete. No F or WP closure, no automatic next-sprint execution, and no false operational availability on main.

## Qualified portable icon editor increment — TASK761–765
Source a5fe5469d67f934382f0351f8b9f8943e0041f60: all seven exact-head workflows PASS; **129/129 Chromium journeys PASS** (run38313440257, job115024360337). Local132 full editor contracts, lint/types/docs/architecture, TypeScript and Station production builds PASS. Local full verify remains blocked by previously recorded tsx IPC EPERM; GitHub exact-head CI supplies observed repository verification.

TASK761/762 qualified shared text/icon-text/icon source control, hover/focus/Escape tooltip and controlled expansion, semantic icons and start/end placement. TASK763 a853974db0aa04f75de7c03cacf28c9b32ddeb91 materializes coordinated ownership and portable ButtonProperties.presentation; TASK764 original7dae81e5 / correctionsaba8bbb5 and a5fe5469 connect real registered Button Inspector and owner-loaded preview. F owns codec/editor bridge; ICON retains assets, public reference resolution and complete WP acceptance. No whole-package closure prerequisite cycle.

Presentation is exact mode/placement/icon:{catalogVersion,assetRef}; no SVG/command metadata, and label remains existing node.text/source label. Schema5 is selected only when presentation exists; old1–4 reject hidden new fields and remain readable. Copied/frozen nested snapshots prevent alias mutation; no-op comparison includes every presentation field. Public ICON lazy search shows at most48 options from1879 assets; reference-key/cancelled effects prevent stale glyphs. Missing/unsupported/unavailable assets preserve reference and show full label plus honest unavailable message. Read-only preview remains command-inert, with full hover title and named keyboard-focusable image in compact mode; interactive PresentationButton has the qualified accessible tooltip.

Actual browser proof: choose Save asset, icon-only/end, pending-save disabled and keyboard rejection, undo/redo, local save, deliberately stage pending placement, guarded Open saved/explicit discard, export5, fresh independent browser with empty localStorage import, preserved icon/mode/placement and label, change to icon-text/end. Separate actual malformed import is atomic; missing and unsupported catalog refs preserve data on re-export.

### Failure history retained
- Kernel a853974d:126 PASS/1 old browser case still classified5 as unknown (run38311742414; subsequently cancelled after artifact). Unknown-version negative became6 with assertions preserved.
- UI7dae81e5:128 PASS/1 timeout clicking correctly aria-disabled pending Save locally (run38312179365, artifact11775388864). Test now asserts disabled, focuses and presses Enter to exercise rejecting handler; no forced click or weakened guard.
- aba8bbb5:128 PASS/1 timeout expecting confirmation after a clean local save (run38312900274). Test now stages actual pending fields before guard; production behavior unchanged.
- a5fe5469:129 PASS, all seven workflows PASS. No failed head is treated as qualified.

### Unmodified visual evidence
Qualified artifact11775149822, expires2026-10-26, ZIP SHA256 fda86e0e78dae14a889a7af5a89ab403361c420d0de58eb3127a7543b34dc9d6. Actual390px screenshots inspected: compact Save glyph is readable without visible Button1 label; icon-text has readable label and trailing glyph. Existing workspace/revision controls are cramped on narrow screens and remain a G adoption finding; screenshots are not a claim of full professional shell acceptance.

| Git evidence | Playwright attachment / original path | SHA256 |
|---|---|---|
| project_docs/evidence/ui-foundation-f/icon-only-fresh-reopen.png | editor-icon-only-fresh-reopen / playwright-report/data/3cb5e56eb6ea2c86f5736fbb3372a9d1fb39e666.png | 7b8a6559ead4a27de7e2031dfbf7299b51e752e5bebbd3ffe091ff0fa0a3f7c2 |
| project_docs/evidence/ui-foundation-f/icon-text-fresh-reopen.png | editor-icon-fresh-reopen / playwright-report/data/f230103651b585f57c1e497bbbce7ccbff2b0685.png | 1b90d65fa275149ee1faa58b22a9ca2fd6f7a7229c138daebd39517ebd981ea6 |

TASK765 checkpoint must pass its own triggered CI; source qualification is not automatic checkpoint qualification. F/ICON/WP remain OPEN and PR1144 draft/unmerged. No EDITOR_READY/main claim. Five candidate families still SOURCE_ONLY; next eligible F scope is typed form-control registry/Inspector/preview/property/codec admission and actual insert/save/fresh reopen. Navigation/menu/Tabs/Accordion source anatomy exists and has browser proof; its composition exposure and residual CommandPalette/Combobox/advanced DataGrid work must be classified separately, not declared absent or complete.

## Qualified Input composition increment — TASK766–768
Source5405de025354cdc99527be7f1ec8744bae70247d: **all seven exact-head workflows PASS and131/131 Chromium journeys PASS** (run38317230693, job115036642924). Local139 editor/candidate contracts, lint/types/docs/759 task specs/architecture and Station production build PASS. No failed source head in this Input increment. Kernel authoritative commit a1160b4c8b33ee3789697c0b4d7728ab093bf9fe followed by actual GUI commit5405de02; distinct commits published in one branch update after ordered local checks.

ComponentProperties preserves exact old Button shape and admits InputProperties: kind=input, inputType=text/email/search, placeholder (0–256 plain Unicode characters), disabled/readOnly booleans. ComponentRef/shape pairing rejects Input properties on Button and vice versa; arbitrary value/actions/type=file, extra fields, symbols/getters, invalid enums, control characters and257-codepoint placeholder reject atomically. Copies/frozen snapshots and normalized no-op/history preserve old icon presentation; text remains existing inert node.text. No application/domain input value is serialized.

Any Input node explicitly requires payload6, including default nodes with no properties;1–5 cannot silently admit them. Old documents remain readable, minimal Button versions1–5 unchanged, and Input+icon coexist in6. Unknown-version negatives advanced to7 without removing their rejection/state assertions. No source graph/revision7 mutation or second registry/editor/store. Source registered in existing example and action-panel compositions; ButtonGroup installed set remains unchanged. Original action-row slot admits registered atomic controls, so Input admission follows existing family/layout contract, not a new special restriction.

Actual GUI proof: choose existing Save icon on Button1; find Forms→insert Input; edit plain Work email label and6/2 span; reject257 placeholder without revision change; set Email/placeholder/readOnly; pending-save disabled and actual focus/Enter rejecting handler; apply→undo→redo; Save locally→clean Open saved; export6; fresh independent browser with empty localStorage imports and retains label, exact props/spans and prior Button icon. Source Input/Label anatomy renders an inert empty-value preview; Inspector uses shared Input/Label/Select/Checkbox. Disabled and Reset properties states verified after fresh reopen. Second actual journey nests Input in Card content and rejects downgraded5, extra value and wrong Button-property shape before mutation.

### Unmodified visual evidence and remaining scope
Artifact11777577270 (expires2026-10-26), ZIP SHA256 add07e04a2266a7255ceb1720e320667516d785fe642be5c43a136c0b419c983. Original attachment input-fresh-v6-reopen, path playwright-report/data/6d1be1dce86016855ec7bb86199c2ba37c8aa32b.png; Git path project_docs/evidence/ui-foundation-f/input-fresh-v6-reopen.png; PNG SHA256 c603feb4e29faa40f8b37c193cb23f3ae549ece7d087eafac177172ee3e9f50d. Screenshot inspected at390px: readable label/placeholder, selected layer,6/2 Inspector, Read only checked, and preserved compact Save glyph. Existing narrow workspace/revision controls remain a G adoption finding.

TASK768 checkpoint requires its own exact-head gates. F/ICON/WP remain OPEN,1144 draft/unmerged, no main EDITOR_READY promotion. Button/Card/Input are INSERTABLE in draft; Checkbox/Dialog/Toolbar/DataTable remain SOURCE_ONLY. Next eligible F work is bounded Checkbox default checked/disabled/label property admission and actual registry/Inspector/preview/save/fresh-reopen proof, with schema version ownership revalidated before edits. Remaining accepted source inventory and full F acceptance still gate G.

## Qualified Checkbox increment — TASK769 / TASK775
Source830de2d8779d27522efeaff0e70d517289c7fec8: all seven exact-head workflows PASS, **133/133 actual Chromium journeys PASS** (run38325709459, job115063761386). Local142 editor/candidate contracts, lint/types/docs/761 task specs/architecture and Station production build PASS. Input checkpoint de0667ab also qualified its own seven gates/131 browser (run38318167319). No failed source head in Checkbox increment.

CheckboxProperties is exact kind=checkbox/defaultChecked/disabled booleans; label remains existing plain node.text. Only initial presentation/config is recorded, never an application's current checked/value or business approval. Paired component validation rejects wrong shape/kind, coercion, getters/symbols/current checked/value and stale edits atomically. Shared Checkbox/Label preview is inert; shared Inspector uses native keyboard and lifts initial settings into the same editor reducer. Immutable copy, semantic no-op/reset/undo/redo reuse current graph/history helpers. Payload7 explicitly admits any Checkbox node, including absent default properties; old1–6 remain readable and cannot hide Checkbox. Input6/icon5 and mixed predecessor composition remain supported. Unknown-version negatives now8 retain assertions; Input category journey explicitly chooses Input with multiple Forms entries.

Actual GUI proof: find Forms/select Checkbox/insert; plain Remember choice label,5-column span; keyboard Space edits initial setting while preview stays unchanged before Apply; pending Undo aria-disabled and focus/Enter rejects without revision change; apply/undo/redo; disabled; local save/clean Open saved/export7; independent empty-browser fresh import preserves label/spans/default/disabled; reset removes only properties and restores default unchecked/enabled. Second actual journey nests Checkbox in Card content and rejects downgraded6/current checked/coerced default/wrong Input-kind imports before mutation. All prior Input, icon, collection and Studio journeys remain in133-test suite.

### Unmodified visual evidence
Artifact11780193671 expires2026-10-27, ZIP SHA256 9cda2588f51a61817e8bf2196863b9277571f023278270dd6f81e27b122bb42d. Original attachment checkbox-fresh-v7-reopen, path playwright-report/data/0481e6ce64c6d85eb6221bd6f396074f42e2bdab.png; Git project_docs/evidence/ui-foundation-f/checkbox-fresh-v7-reopen.png; PNG SHA256 8669042adf3a7071cfc9aa98661ad160b1fa629680656584c575b0f66b008e11. Actual390px screenshot inspected: readable Remember choice label, checked/disabled visual, selected layer,5/1 span and both Inspector flags retained. Existing cramped workspace/revision controls remain a G finding.

TASK775 checkpoint requires own exact-head gates. Button/Card/Input/Checkbox are INSERTABLE in draft; Dialog/Toolbar/DataTable remain SOURCE_ONLY. No main EDITOR_READY claim, F/ICON/WP stay OPEN and1144 draft/unmerged. Next eligible bounded F work is overlay/compound property/slot/preview/admission and actual interaction/save/fresh-reopen proof (Dialog first), revalidating next schema major ownership and approved inventory before edits. Remaining accepted inventory/full F acceptance still gate G; three residual census candidates are not a claim that all source primitives are operationally cataloged.

## TASK783/784 Dialog operational admission increment
Source-owned provider Dialog is registered as semantic-composite/column/self in example/action-panel, with content child slot and Card semantic-composite compatibility; original baseline graphs/revision7 and restricted atomic action-row/ButtonGroup unchanged. Exact props kind/title/description/disabled, node.text trigger label, explicit8 with1–7 compatibility/downgrade rejection, immutable/no-op/history/reset/mixed Input/Checkbox inheritance. Same reducer/dirty guards/Inspector; actual modal preview with scoped portal, focus/keyboard/Escape/return/close and inert authored children. Current open is disposable local preview state, not persisted business/command authority. React hooks unconditional, shared source controls and native labels; no new editor/provider/icon pack.146 local editor/candidate contracts PASS after correcting test calls to existing expected-revision history signature and asserting provider aria-haspopup plus source Button-owned data-slot. Lint/types/docs/764 task specs/architecture/Station production build PASS. Two authored browser journeys cover actual insert/text/properties/spans/content/history/disabled/local-save/fresh8 reopen and nested Card/hostile current-state/wrong-kind/downgraded rejection; actual GUI/source exact-head gates pending. Five INSERTABLE census implementations in branch only; remaining Toolbar/DataTable and full approved inventory not closed.
