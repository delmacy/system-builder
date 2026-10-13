# WP-UI-FOUNDATION-01 — Station Visual Component Foundation
Date: 2026-10-12
Status: OWNER-AUTHORIZED; Planning materialization on admission PR, not implementation-complete
Proposed authority: docs/contracts/021-station-ui-foundation/ADDENDUM.md
Existing references: ADR-0017; 001 component grammar; 002 visual factory; station-composition/registry; ui-core; Studio WP02 Catalog; WP-ICON-01.

## 1. Objective and baseline
Remediate the missing C0-C4 materialization behind Station C5-C10 user interfaces. Make a scoped, source-owned, visually consistent, accessible component library that is discoverable and insertable in the Component Editor, has contract-driven property/slot/variant editing, and round-trips through the established composition artifact flow. The visible UX should resemble a mature workstation, not a text-only demo.

Observed baseline (verified against main on 2026-10-12):
- packages/ui-core/components.ts: Button, IconButton, ButtonGroup, Input, native Select, Toggle, Separator, Badge, Panel, ScrollArea, Tooltip surface and MenuSurface; additional Tree, PropertyInspector and EditorShell exports.
- apps/station/web/app/station-editor-catalog.ts: installed example Grid/Buttons, ButtonGroup and Action Panel/Row samples; no general shadcn-style insertable palette.
- ADR-0017 requires shadcn source-owned baseline with provider-agnostic semantic icons.
Baseline is an inventory observation, not a full CI/visual audit. First Planning sprint must verify live current-base before assigning final item counts.

## 2. EAP / dependency
C0 Tokens -> C1 Primitive -> C2 Compound -> C3 Collection -> C4 Capability -> shared editor catalog/preview/readback -> adoption into existing C5-C10 surfaces.
Dependency edge: WP-ICON-01's semantic IconRegistry/API -> command and toolbar visual integration. Use fallback semantic token affordances without duplicating that WP.
The in-flight Studios WP02 Catalog owner/API readiness remains separate and may proceed without modifying this new planning branch. No conflicting NEXT_WORK edit. Avoid duplicate registries and fake provider parity.
Each Construction sprint gets own task breakdown, bounded file budget, branch/PR, own test suite, exact-head/current-base CI and validated integration before promotion.

## 3. Sprint breakdown (11 planned)
### P — Planning & Materialization
P1 audit ui-core exports, runtime uses, component descriptors, installed/visible palette, icon overlap, shadcn upstream categories and acceptance screenshots.
P2 publish coverage matrix: supported / source-only / wrapper-only / missing / blocked / deferred; select components by actual Station requirements and license.
P3 approve API surfaces, provider boundaries, schema/codec version migration, rollout flag/fallback, visual and keyboard gates, file ownership and sprint task mapping.
Deliverable: reproducible inventory and bounded per-sprint tasks with PROVEN/UNPROVEN baseline. Gate: authority/admission + nonconflicting ownership.

### A — Tokens / theme / visual semantics (C0)
A1 audit OKLCH semantic colors, typography scale, spacing, density, focus, borders/elevation, disabled/invalid/selected states.
A2 unify source-owned tokens and component state recipes for light/dark and workstation density; no freeform theme engine.
A3 visual reference gallery and CSS/contrast/focus tests.
Gate: common controls share token vocabulary in shell/editor at narrow/wide viewport, themes consistent.

### B — Core primitives (C1)
B1 fill form/control primitives: Label, Textarea, Checkbox, RadioGroup, Switch, Slider, NumberField foundations, Field/Description/Message, plus current Button/Input/Select variants.
B2 feedback/content primitives: Alert, Progress, Skeleton, Avatar/Card where actual surface need exists; explicit semantic status.
B3 accessibility focus/keyboard, invalid/disabled/controlled/uncontrolled modes, data-slot and design parity proofs.
Gate: each accepted primitive has source, demo, typed export and proof; no claims for omitted catalog insertion until F.

### C — Overlay / navigation primitives
C1 Dialog/AlertDialog, Popover, Tooltip modality, focus trap/return, dismissal and layering.
C2 DropdownMenu/ContextMenu/Menubar, Tabs, Accordion/Collapsible, Breadcrumb, navigation/Command interfaces and combobox candidates.
C3 provider selection and cleanup for keyboard roving focus, nested overlays and focus restoration; don't hand-roll complex behavior without evidence.
Gate: pointer, keyboard, Escape, outside click, focus return and disabled tests.

### D — Industrial compounds (C2)
D1 Toolbar/ToolbarGroup/ToolbarButton, ToggleGroup, SplitButton and grouped commands backed by semantic commands and WP-ICON-01 tokens.
D2 SearchField, SelectField, PropertyField, PropertySection, PaneHeader, StatusBar, TabStrip and accessible labels/units.
D3 density, overflow, selection, toolbar keyboard navigation, shortcut feedback and read-only controls.
Gate: representative workstation toolbar and Inspector operate without inline per-Studio clones.

### E — Collections (C3) and capabilities (C4)
E1 list/tree/menu collections reuse existing Tree and semantic selection; no replacement without conformance data.
E2 source-owned Table and DataGrid bounded to local client collections; sorting/filtering/selection/empty/loading/error/pagination as separately qualified capabilities.
E3 roving focus, row/action access, virtualized scale only when demonstrated necessary, deterministic selection/ref invariants.
Gate: keyboard/screen reader/selection and narrow viewport conformance; no fabricated server backend.

### F — Component Library / visual editor catalog
F1 bridge actual ui-core implementations and ComponentRegistry descriptors with one source-owned registration manifest and stable IDs/version.
F2 categorized/searchable visual palette with icon, label, states/variants/slots, insertion eligibility and compatibility explanations.
F3 property Inspector schema editor; live preview, valid placement, grid span, save/readback/version import round-trip and rejected invalid payloads.
Gate: from empty compatible composition, insert at least one representative item of each promoted family, edit, save, reopen, verify actual output equivalence; no static-only catalog claims.

### G — Product adoption / screen quality
G1 replace duplicated inline controls in representative shell/Component Editor/File Manager/Studio navigation with shared components; preserve original intent/behavior.
G2 add real icon-driven toolbars, spacing, hierarchy, responsive widths, density and status; no unrelated redesign of process authority.
G3 screenshot-baseline comparison and human acceptance journeys for desktop and compact viewport.
Gate: documented before/after and no regressions in existing apps or Studio owner transport.

### T — Test Review & Hardening
Audit acceptance/proof inheritance and adversarial failures: keyboard-only, focus trapping, ARIA, color contrast, disabled/invalid, serialization, XSS-safe display, malformed external inputs, duplicate IDs, nested slot rejection, large collections and perf. Correct failures with bounded remediation.
Gate: risk matrix shows no unproven critical obligations.

### I — Integration & Acceptance
Fresh-main integration after each dependency; run lint/types/product/architecture, Windows/Ubuntu, Next frontend and Playwright browser journeys, exact-head heavy checks applicable. Manual UI acceptance must verify icons, palette, insert/edit/save/reopen and mature visual hierarchy. Publish evidence links and residual gaps.
Gate: required workflows PASS on exact integrated head; scope/QA/product reviewer GO.

### Z — Documentation & Enclosure
Publish export/registry index, component contracts, adoption guidance, dependencies/provenance/licenses, keyboard and test coverage, migration/compatibility notes, remaining gap backlog, WBS and operational handoff. Close only after validated merges.
Gate: evidence-backed closure, updated unique NEXT_WORK by serialized authorized handoff, no implicit Studio phase closure.

## 4. Minimum accepted families (targets, not claims)
- Input/forms: Button family, Label, Textarea, Checkbox, RadioGroup, Switch, Slider, Select/Combobox, field patterns.
- Layers/navigation: Dialog, Popover, Tooltip, Menus, Tabs, Accordion, Breadcrumb, command palette.
- Data/display: Alert, Progress, Skeleton, Card, List, Tree, Table, DataGrid.
- Desktop: Toolbar variants, contextual commands, PaneHeader, Explorer lists, Property Inspector fields.
Candidates may be deferred individually when unmet need or provider risk is documented; no fake "complete shadcn" checkbox. Upstream component inventory is a reference, not a fixed import count.

## 5. Shared definition of done
For each component: public source-controlled export, typed props/variants/slots, semantic icon strategy where needed, provider/attribution, data-slot/tokens, accessibility keyboard/focus/error behavior, state ownership and command boundary, preview/story, descriptor registration and compatibility, test inventory with evidence status. A component is “Editor-ready” ONLY after valid insert/Inspector mutation/save/reopen. Do not label a source-only control Editor-ready.

## 6. Risks / governance
R1 visual-only wrappers mistaken for operational components => separate SOURCE_ONLY vs EDITOR_READY gates.
R2 upstream mass import and lock-in => bounded adopt/adapt with public SB APIs.
R3 conflicting worker changes and Studio WP02 => independent branch, no NEXT_WORK mutation until sequenced.
R4 serialized artifact incompatible with new components => schema migration/readback and rejection tests.
R5 UI aesthetics remain subjective => before/after screenshot review and human gate in G/I.
R6 overlarge WP => 11 sprint forecast, scope sliced by contract and promoted only after own proof; Construction C-G may need subpackages if budgets warrant.
R7 icon scope duplication => consume accepted WP-ICON-01 registry, no parallel icon pack here.

## 7. First executable action after plan admission
Produce P census matrix from fresh main, enumerate exact shipped shadcn reference inventory and actual Station registration/UI visibility, mark each as working, partially implemented or absent. Materialize TASKs and independent per-sprint PRs only after baseline, authority and locks are checked.

## 8. Current materialization
TASK-745 owns admission correction/census; TASK-746 owns first C0 construction only. Detailed inventory: STATION-WP-UI-FOUNDATION-01-INVENTORY.md. Eleven-sprint cadence explicitly requested by owner; accepted as bounded exception. No product writes on this planning branch. Subsequent sprints retain rolling-wave promotion and exact-head integration gates.

## 9. Qualified A / promoted B
A qualified/integratedPR1138 b50a550f, seven exact-head workflows and113 browser journeys PASS. TASK747 materializes B on fresh base; TASK748 native primitives only. Active B manifest STATION-WP-UI-FOUNDATION-01-CONSTRUCTION-B.md. C–Z forecast. NEXT_WORK primary ICON pointer preserved because openICON PR1139 owns it; the cited UI plan supplies bounded lane progression after qualifiedA. Toolbar/icon/schema coordination stays required.

## 10. Qualified B / promoted C
B qualified exact head5d8c95e (seven applicable workflows PASS) and integratedPR1140 at17a9a4da. TASK749 materializes provider-backed overlay/navigation TASK750 in ConstructionC; Command/combobox candidates remain explicit residual construction. Existing source-only vs editor-ready distinction and ICON path ownership remain. D-Z forecast.

## 12. Owner-requested independent G slice
On2026-10-13 the owner requested G while F1144 remained partial/draft. Construction-G.md materializes only already-main-integrated File Manager presentation under an explicit sequencing exception; no F schema/source dependency, acceptance bypass or F/G/package closure. TASK776 ->777; separate main-based sprint branch/PR. Full F obligations remain open.
