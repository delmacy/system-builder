# UI Foundation — verified inventory and WBS
Date: 2026-10-12. Baseline main@8e6f9fe1ffc68cfa24495eafecc35e8ce1e914b9. Source audit, not acceptance of user journeys.

## Method and factual baseline
Read ui-core public exports/implementation, global CSS, actual installed editor catalog, graph properties/codec, existing tests and R1/R2/R3 proof census. Reproduce with `rg 'export (function|const)' packages/ui-core` and `rg 'id: "component:|compositionRef:' apps/station/web/app/station-editor-catalog.ts`. No exclusive resource/lock manifest found in current docs/schedule; path separation is enforced at task admission. Open PR1137 owns docs only; ICON task743 excludes ui-core/apps/editor. Future ICON B ownership must be freshly checked.

16 exported components in components.ts; additional Tree, PropertyRow, PropertyGroup, PropertyInspector, EditorShell (21 total). Three installed compositions; six distinct descriptors (grid, button, lab-button, button-group, action-panel, action-row). These are not a general primitive palette. Button properties admit variant/disabled only; payload versions1–4, plain button text. Preview is generic styled div, not arbitrary ui-core rendering. New properties cannot be smuggled into existing codec.

## Implementation matrix
| C | Family / items | Actual evidence | Baseline status | Delivery / exit obligation |
|---|---|---|---|---|
|0|19 semantic +9 Station surface colors, radius|tokens.ts; globals.css|PARTIAL; explicit dark misses Station surface overrides; density/typography/state scales absent|A: theme parity, shared density/state recipes, lab and browser proof|
|1|Button, Input, native Select, Separator, Badge, Panel, ScrollArea|components.ts; station-ui-core.test.ts|SOURCE_ONLY for general library; Select is native, ScrollArea native overflow|B: retain APIs, invalid/disabled/focus proof; F registry eligibility|
|2|IconButton, ButtonGroup, Toggle|components.ts|SOURCE_ONLY; bounded ButtonGroup composition exists|B/D inherited activation/controlled state proof; F exposure|
|1|Label, Textarea, Checkbox, RadioGroup, Switch, Slider, NumberField|no ui-core exports|MISSING|B native semantics where adequate; accessible labels, limits, controlled/uncontrolled tests|
|1|Alert, Progress, Skeleton, Card, Avatar|no ui-core exports; Panel is not Card anatomy|MISSING|B bounded semantic feedback/content; Avatar defer unless actual need|
|3/4|Tooltip, MenuSurface|CSS hover/focus tooltip; role-only menu div|WRAPPER_ONLY; no full dismissal/roving/focus contract|C qualified headless provider/keyboard/Escape/focus-return; F eligibility|
|2/3|Dialog, AlertDialog, Popover, DropdownMenu, ContextMenu, Menubar|no exported behavior|MISSING|C pinned replaceable provider, license and actual interaction proof|
|2/3|Tabs, Accordion, Collapsible, Breadcrumb, Command/Combobox|no ui-core exports|MISSING|C control/navigation proof; complex search qualifications explicit|
|2|Toolbar, ToolbarGroup, ToolbarButton, ToggleGroup, SplitButton|ButtonGroup available, no professional toolbar|BLOCKED on ICON B ownership/API reconciliation|D consume semantic commands/icons; no second toolbar contract|
|2|SearchField, SelectField, PropertyField/Section, PaneHeader, StatusBar, TabStrip|PropertyRow/Group/Inspector/EditorShell source|PARTIAL|D reuse anatomy; labels/units/read-only; no per-Studio clones|
|3|Tree|tree.tsx uses shared collection/selection, expansion/traversal|SOURCE_ONLY for general editor insertion; existing tree consumers|E retain implementation, current executable keyboard proof|
|3|List, Table, DataGrid|no ui-core reusable export|MISSING|E local datasets, real sorting/filtering/selection/empty/loading/error proof|
|4|selection, presentation command/shortcut registries|station-interaction; S3 R1–R3 census|PARTIAL / existing contracts|E reuse; independent focus/active/selection; no Core authority|
|F|categorized primitive palette, schema Inspector, actual renderer|three sample compositions only|MISSING|one existing registry/editor; insert→edit→preview→save→reopen; backward codec migration|
|G|shell/File Manager/editor/Studio adoption|current apps contain shared buttons plus inline controls|PARTIAL|representative incremental adoption, guard regressions and screenshots|

## Upstream comparison and scope selection
Reference index https://ui.shadcn.com/docs/components retrieved 2026-10-12 (mutable documentation, not a pinned source import). shadcn open-code model confirmed at https://ui.shadcn.com/docs/new. Construction that copies code MUST pin source revision/license separately. Native SB primitives may adapt visual grammar without claiming upstream source copying.
Relevant index groups are forms (button, checkbox, field, input, label, native-select, radio-group, select, slider, switch, textarea); display (alert, badge, card, empty, progress, skeleton, spinner); navigation/layers (accordion, alert-dialog, breadcrumb, collapsible, combobox, command, context-menu, dialog, dropdown-menu, menubar, popover, tabs, tooltip); collections (item, table/data-table, pagination); composition (button-group/input-group/scroll-area/resizable). Actual Station priorities select bounded representatives, not every upstream component.
Calendar/date-picker, carousel/chart, OTP, chat/message/questionnaire, drawer/sheet/sidebar, toast/hover-card and aspect ratio remain DEFERRED pending actual use; no fabricated parity. Existing shell/window geometry is retained instead of adopting Resizable as a second geometry owner.

## Rolling-wave task/dependency matrix
| Sprint | Committed scope | Dependencies | Required evidence |
|---|---|---|---|
|1 P|TASK745 admission/census; materialize A only|fresh main, owner request, PR1137 checks|authority/docs/task/full verify; no production code|
|2 A|TASK746 tokens/theme/density/lab|qualified P integration|unit CSS parity, actual browser light/dark/system/density/states, full verify|
|3 B|FORECAST primitive tasks|qualified A|public native controls, negative state/limits, rendering/keyboard|
|4 C|FORECAST layer/nav tasks|qualified B, pinned provider/license|focus trap/return, nested dismissal and disabled keyboard|
|5 D|FORECAST compound tasks|qualified C + ICON coordination|roving toolbar/overflow/command reuse|
|6 E|FORECAST collection tasks|qualified D, existing selection contracts|sort/filter/select/navigation/failure determinism|
|7 F|FORECAST registry/Inspector/codec tasks|qualified E + ICON schema coordination|actual insertion/edit/preview/save/reopen and legacy rejection|
|8 G|FORECAST adoption tasks|qualified F|before/after screenshots and existing owner journeys|
|9 T|FORECAST hardening|qualified G|critical gap audit and bounded fixes|
|10 I|FORECAST integration|qualified T|all applicable exact-head CI, complete browser journeys, human UX acceptance|
|11 Z|FORECAST enclosure|qualified I and accepted residuals|contracts/WBS/current state/evidence; no new features|

No catalog item is EDITOR_READY from this audit. Availability must be established component-by-component in F. Machine conformance and human UX acceptance stay separate. No rollout flag added for C0: additive token vocabulary and retained APIs; behavioral/codec rollout choices belong to fresh B/F task admission.
