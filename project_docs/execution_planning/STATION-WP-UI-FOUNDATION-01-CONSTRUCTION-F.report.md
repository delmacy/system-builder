# UI Foundation F — partial functional checkpoint

Date: 2026-10-12. **F OPEN; WP OPEN; PR #1144 DRAFT / NOT MERGED.**
Authority: Addendum021, ADR0017, current UI plan, Construction F manifest and TASK755–760. Fresh main94da5ae2; planning#1137 and bounded C/D/E#1141/#1142/#1143 confirmed merged. The obsolete local C branch was preserved; work continued from current remote F, without replacing other workers' changes.

## Functional result and limits

| Surface | Implemented in F draft | Admission / persistence limits |
|---|---|---|
| Palette | Actual ComponentRegistry plus existing applyEditorStructure admission; occupied/incompatible slots excluded; selection resolved after filtering; readable name/ID/category search | Categories never grant eligibility; absent controls cannot be inserted |
| Button | Actual source-owned ui-core Button in both admitted button IDs; text, default/outline/ghost, disabled state, shared tokens and full title | Inert preview image, no business command execution; secondary/destructive authoring not admitted |
| Card | component:card in existing action-panel registry; shared Card/Header/Title/Content; content slot; current span Inspector; nested Button; export/fresh reopen | Default presentation and derived node title only; no arbitrary title/style/variant properties; current codec2, no schema fork |
| Narrow preview | Stacked presentation and readable nested controls at390px; truncating inner Button label with full title | Saved Card spans remain8columns/4rows; no canonical geometry or WindowGeometry mutation |
| Candidate census | Seven candidate families; primary Button and Card INSERTABLE with actual registry/composition references | Five candidates remain SOURCE_ONLY: Input, Checkbox, Dialog, Toolbar, DataTable. No EDITOR_READY promotion before main integration |

Three existing installed compositions remain. Source candidate census is presentation metadata, never a second registry. Current canonical draft/history/codec/store/file import remain authoritative. ICON assets/contracts and Core/business owner contracts were not changed.

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
