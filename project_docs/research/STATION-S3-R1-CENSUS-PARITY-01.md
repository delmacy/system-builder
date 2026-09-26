# Station S3-R1 — Census & Parity 01

Date: 2026-09-26
Research base: `main@489caf8fae9fea2b2807aed98842607f2e72c69c`
Status: RESEARCH EVIDENCE — NOT PRODUCT AUTHORITY

## Scope and invariants

This R1 census is evidence for later synthesis. It does not authorize Construction or product mutation.

Preserved ladder:
`Token -> Primitive -> Compound -> Collection -> Capability -> Pane/Region -> Pattern -> Template/View -> Tool -> Application -> Studio`.

Preserved boundaries:
- identity != placement != presentation != action;
- `ComponentRegistry != AppManifest`;
- `WindowGeometry != composition grid`;
- discrete span/grid authoring, not arbitrary pixel placement;
- provider independence;
- Station remains presentation/composition-oriented and receives no Core/business authority.

## Repository census

Current `packages/station-composition` contains:
- `ComponentDescriptor` with `id`, family, layout, layout ownership, child policy, discrete span constraints, named slots and allowed parent families;
- `SlotDescriptor` with child policy plus accepted component families/layout kinds;
- `CompositionPlacement` separating parent/child identity from slot and row/column spans;
- `ComponentRegistry` with normalized registration, duplicate-ID rejection and stable lookup/listing;
- graph validation, draft transaction and editor engine;
- a first semantic composite: `component:button-group`, self-owned row layout, five named atomic slots and discrete 1..12 column constraints.

Current family vocabulary is `atomic | collection | semantic-composite | layout-container`; layout vocabulary is `none | grid | row | column | stack | split | dock | tabs`.

### What R1 already has

| Concern | Existing evidence | R1 classification |
|---|---|---|
| stable component identity | descriptor id + registry | own |
| family classification | four bounded families | own, refine in synthesis |
| parent/slot compatibility | accepted families/layouts | own |
| discrete placement | row/column spans and constraints | own |
| compound seed | ButtonGroup semantic composite | own |
| draft/validation engine | composition package | own |
| provider-specific widget inventory | not encoded as authority | defer provider binding |
| primitive breadth | intentionally small/incomplete | parity gap |
| accessibility behavior contract | not first-class in descriptor | parity gap; adopt-pattern |
| interaction state vocabulary | mostly outside descriptor | R3, not primitive explosion |
| token vocabulary | not represented in ComponentDescriptor | R1/R-synthesis gap |

## Mature ecosystem evidence

### Radix Primitives
Primary docs describe Radix as low-level, unstyled, accessible primitives with WAI-ARIA behavior, focus management, keyboard navigation, typed APIs, composable parts and incremental adoption. Its current catalog includes Accordion, Alert Dialog, Avatar, Checkbox, Collapsible, Context Menu, Dialog, Dropdown Menu, Form, Hover Card, Label, Menubar, Navigation Menu, Popover, Progress, Radio Group, Scroll Area, Select, Separator, Slider, Switch, Tabs, Toast, Toggle, Toggle Group, Toolbar and Tooltip.

R1 implication: **adopt-pattern**, not provider authority. Station should preserve behavioral/accessibility expectations as capabilities/contracts while keeping presentation/provider replaceable.

Sources:
- https://www.radix-ui.com/primitives/docs/components
- https://www.radix-ui.com/primitives/docs/overview/introduction

### shadcn/ui
The official catalog spans low-level controls and higher compositions: Button/Button Group, Input/Input Group, Field, Item, Card, Breadcrumb, Calendar, Carousel, Chart, Combobox, Command, Data Table, Date Picker, Drawer, Empty, Pagination, Resizable, Sheet, Sidebar, Table and Typography in addition to many Radix-like controls. shadcn also explicitly distinguishes reusable components from larger Blocks, and its registry model is source-owned/copyable rather than a mandatory opaque runtime.

R1 implication: useful parity source for **compound/collection breadth** and source-owned adaptation, but registry/provider mechanics must not become Station identity authority.

Sources:
- https://ui.shadcn.com/docs/components
- https://ui.shadcn.com/docs/_blocks
- https://ui.shadcn.com/docs/components-json

### MUI
MUI positions Material UI as a production-ready component library, MUI X for advanced/complex use cases, and Templates as a distinct higher-level layer. This separation supports Station's need to avoid flattening primitives, collections and templates into one catalog level.

R1 implication: **adopt-pattern** for complexity separation; do not import Material visual semantics as canonical Station presentation.

Source: https://mui.com/

## Preliminary parity matrix

Classification is intentionally conservative; R2+ owns promotion of compounds/capabilities/patterns.

| Candidate semantic primitive/family | Station now | Mature parity | Classification | Notes |
|---|---|---|---|---|
| Button | implied atomic usage | universal | own | semantic action remains separate from visual variant |
| Label | no explicit descriptor found | Radix/shadcn | adapt | native semantics/accessibility first |
| Text/Input/Textarea | no explicit catalog descriptor found | shadcn/MUI | adapt | field assembly belongs R2 |
| Checkbox/Switch/Radio | no explicit catalog descriptor found | Radix/shadcn/MUI | adapt | state/action contract belongs R3 |
| Select/Combobox | no explicit catalog descriptor found | Radix/shadcn/MUI | adapt | Combobox likely compound/capability-backed, not atomic |
| Separator | no explicit descriptor found | Radix/shadcn | adopt-pattern | presentation primitive with semantic option |
| Progress/Spinner | no explicit descriptor found | Radix/shadcn/MUI | adapt | status semantics separate from domain status |
| Avatar/Badge | no explicit descriptor found | Radix/shadcn/MUI | adapt | presentation identity must not imply business identity |
| Tooltip | no explicit descriptor found | Radix/shadcn/MUI | adopt-pattern | overlay/focus behavior is capability-backed |
| Dialog/Popover | no explicit descriptor found | Radix/shadcn/MUI | adopt-pattern | layering/focus/dismissal must be reusable capability |
| Tabs | layout kind exists | Radix/shadcn/MUI | own + adapt | layout identity exists; interaction semantics need R3 |
| ScrollArea | no explicit descriptor found | Radix/shadcn | adopt-pattern | prefer native behavior with bounded enhancement |
| ButtonGroup | implemented semantic-composite | shadcn/MUI | own | R2 should generalize action-group semantics without variant explosion |
| Table/DataTable | no explicit descriptor found | shadcn/MUI | defer to R2 collection | collection semantics, selection/sort capabilities |
| Toolbar/Menu | no explicit descriptor found | Radix/shadcn/MUI | defer to R2/R3 | compound plus command/focus capability |
| Sidebar | no explicit descriptor found | shadcn | defer to R4 region/pattern | too structural for primitive tier |
| Card | no explicit descriptor found | shadcn/MUI | defer classification | likely compound/pattern depending semantics |

## Findings / dedup

1. The existing Station descriptor is already stronger than a flat component-name catalog: it models family, parent compatibility, slots and discrete spans. Preserve it instead of replacing it with a third-party registry.
2. `ComponentFamily` and the S3 complexity ladder are related but not identical. `atomic/collection/semantic-composite/layout-container` are compatibility families; Token..Studio is a complexity/ownership ladder. Do **not** collapse them into one enum without synthesis evidence.
3. Accessibility and interaction behavior should not be encoded by multiplying visual primitive variants. Radix demonstrates that keyboard/focus/dismissal behavior is a reusable contract dimension.
4. shadcn's Component vs Block separation and MUI's Core vs X vs Templates reinforce Station's tiered catalog rather than a monolithic component list.
5. `tabs` already exists as a layout kind, but mature ecosystems treat Tabs as an interactive pattern with keyboard/activation semantics. R3 must decide how layout identity projects interaction capability without conflating placement and action.
6. ButtonGroup is a valid R2 seed, but its fixed five slots are implementation evidence, not yet a universal action-group grammar.

## Gaps carried forward

- Complete repository-wide primitive census beyond `station-composition` (especially any Station UI wrappers/source-owned controls) before declaring primitive absence.
- Token census: typography, spacing, radius, elevation, motion and semantic color ownership.
- Accessibility contract shape: focus, keyboard, labelling, modality, dismissal, RTL and assistive-technology expectations.
- Overlay/layer capability ownership for Dialog/Popover/Tooltip/Menu.
- Collection semantics for Table/List/Tree/Grid and virtualization boundaries.
- Decide which candidates are true C1 primitives versus C2 compounds; do not promote from ecosystem naming alone.
- Provider parity still needs Base UI, React Aria, Fluent, Carbon, PatternFly, Chakra and Ant evidence before R1 closure.

## R1 disposition

R1 remains **in progress**. This document establishes the first repository census and primary-source parity baseline for Radix, shadcn/ui and MUI. No Construction slice is eligible. Next research delta: extend the parity matrix across Base UI, React Aria, Fluent, Carbon, PatternFly, Chakra and Ant; then perform repository-wide dedup and close R1 only if the census is sufficient to feed R2 without provider lock-in.
