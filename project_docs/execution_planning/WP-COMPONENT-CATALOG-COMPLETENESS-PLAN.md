# WP-COMPONENT-CATALOG-COMPLETENESS — execution baseline

Date: 2026-10-13
Status: ACTIVE — Construction A implementation pending PR merge
Depends on: WP-UI-FOUNDATION-01 (contract 021), WP-ICON-01, S3 component grammar research, existing Station Component Lab.
Scope: complete missing reusable C0–C4 components incrementally, not claim arbitrary upstream shadcn parity. Do not duplicate the visual editor registry or backend authority.

## Current verified contrast (2026-10-13)
- `ui-core/primitives.tsx`: Label, Textarea, Checkbox, Switch, Slider, NumberField, RadioGroup, FieldDescription, FieldMessage, Alert, Progress, Skeleton, Card anatomy are already source-owned.
- `ui-core/overlays.tsx`: dialog/popover/navigation examples exist and have browser coverage; provider and artifact-insertion eligibility remain separate proofs.
- `ui-core/industrial.ts` and `data-table`: Toolbar, grouped actions, SearchField, SelectField, PropertySection, status and DataTable exist. Composition insertion does not follow from source export.
- Component Lab now categorizes Foundations, Primitives, Overlays, Industrial, Collections, Composition, Icons; examples preserve state between categories.
- Repeated UI gaps observed in `station-collection-foundation-lab.tsx`: inline page navigation and no shared empty-state pattern. First Construction A addresses these and demonstrates actual reusable exports.

## Coverage states
Use `SOURCE_ONLY`, `LAB_PROVEN`, `EDITOR_READY`, `DEFERRED`, `UNPROVEN`. Do not promote by implication. Each public component requires type contract, actual Lab preview, state/a11y/keyboard tests; promotion to EDITOR_READY additionally requires descriptor, eligible insertion, Inspector editing and artifact round-trip.

## Rolling construction
| Phase | Increment | Gate |
|---|---|---|
| Planning | Reconcile original research against latest source, deduplicate families and record dependent WPs | source-backed list and no duplicate APIs |
| Construction A | Reusable EmptyState + controlled Pagination, gallery integration, boundary and keyboard checks | exported/source-owned, browser tests |
| Construction B | Input families: date/time picker, combobox/autocomplete, field/file upload contracts; avoid uncontrolled upstream mass imports | native/headless provider qualification, invalid/disabled, keyboard, accessibility |
| Construction C | Navigation: sidebar tree, steps, command palette, menus, tabs, responsive overflow | semantics, focus, shortcuts, dismissal |
| Construction D | Workstation: split panes, dock/panel layout, table/filter/action compounds, icons and concise tooltips | shared geometry authority preserved; 390px/desktop proof |
| Construction E | Data & presentation: rich collection states, sortable/filterable grids, loading/error/empty, scroll/performance | state/control ownership, no fake backend |
| Construction F | Editors/media: color and property pickers, bounded rich-text/document controls, graph/chart adapters when supported by actual Studio demand | sanitized input, typed contracts, stable preview |
| Construction G | Component Registry + Editor compatibility: manifests, variants/slots/inspector, legacy save/reopen | at least one qualified C1/C2/C3/C4 item round-tripped |
| Test Review | Browser/a11y/visual, adversarial malformed input, regressions | no critical UNPROVEN promoted |
| Documentation & Enclosure | Updated inventory/status and exact evidence pointers, backlog for deferred families | no premature WP close |

## Construction A acceptance
- `Pagination`: zero-index page, positive integer pageCount, bounded Next/Previous controls, disabled edges, keyboard/ARIA, no page mutation beyond boundaries.
- `EmptyState`: heading, optional description/action/icon, presentation-only; source-owned tokens and data-slot.
- Usage in Collections Lab while preserving DataTable sorting/filter/selection behavior. No Core coupling.
- TypeScript, lint, Station production build, relevant Playwright & GitHub CI pass before merge. A is NOT a general editor insertable component until G proves it.

## Deferred decisions
Do not conflate structural shell window resize with UI split-pane layout; defer unconstrained drag/drop, full spreadsheet/datagrid backend, arbitrary remote asset upload, opaque third-party components and any C10 claim. Preserve anti lock-in and exact stable contract boundaries.
