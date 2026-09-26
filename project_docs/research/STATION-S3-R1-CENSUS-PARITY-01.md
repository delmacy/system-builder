# Station S3-R1 — Census & Parity 01

Date: 2026-09-26
Research base: `main@868785466a2cd6dc4c4d2fa6e7124fe95ebdcf1c` (fresh-main revalidation; branch remains diverged pending reconciliation)
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
Primary docs describe Radix as low-level, unstyled, accessible primitives with WAI-ARIA behavior, focus management, keyboard navigation, typed APIs, composable parts and incremental adoption. Its composition model allows a primitive behavior to be projected onto a consumer-owned element with `asChild`; multiple trigger behaviors can be composed while accessibility responsibility remains explicit. Toolbar separately demonstrates group-level focus semantics (roving tabindex, arrow/Home/End navigation) rather than treating a row of buttons as merely visual adjacency.

R1 implication: **adopt-pattern**, not provider authority. Station should preserve behavioral/accessibility expectations as capabilities/contracts while keeping presentation/provider replaceable. A slottable/composable contract is evidence for separating visual identity from behavior, but Station should not copy `asChild` as canonical syntax.

Sources:
- https://www.radix-ui.com/primitives/docs/components
- https://www.radix-ui.com/primitives/docs/overview/introduction
- https://www.radix-ui.com/primitives/docs/guides/composition
- https://www.radix-ui.com/primitives/docs/components/toolbar

### shadcn/ui
The official catalog spans low-level controls and higher compositions: Button/Button Group, Input/Input Group, Field, Item, Card, Breadcrumb, Calendar, Carousel, Chart, Combobox, Command, Data Table, Date Picker, Drawer, Empty, Pagination, Resizable, Sheet, Sidebar, Table and Typography in addition to many Radix-like controls. shadcn also explicitly distinguishes reusable components from larger Blocks, and its registry model is source-owned/copyable rather than a mandatory opaque runtime.

R1 implication: useful parity source for **compound/collection breadth** and source-owned adaptation, but registry/provider mechanics must not become Station identity authority.

Sources:
- https://ui.shadcn.com/docs/components
- https://ui.shadcn.com/docs/_blocks
- https://ui.shadcn.com/docs/components-json

### MUI / MUI X
MUI positions Material UI as a production-ready component library, MUI X for advanced/complex use cases, and Templates as a distinct higher-level layer. MUI's current structural customization model exposes a `root` slot plus named interior slots, allows slot replacement, and passes slot-specific properties through `slotProps`. This is independent evidence that complex components benefit from an explicit named-slot contract rather than arbitrary descendant mutation.

R1 implication: **adopt-pattern** for complexity separation and named-slot/schema-driven customization; do not import Material visual semantics or MUI's prop API as canonical Station presentation. Station's existing `SlotDescriptor` is directionally aligned and should be strengthened rather than replaced.

Sources:
- https://mui.com/
- https://mui.com/material-ui/customization/overriding-component-structure/
- https://mui.com/x/common-concepts/custom-components/

### PatternFly
PatternFly's current action guidance distinguishes component-level actions from page-wide actions and locates actions near the object they affect. Its Button guidance preserves semantic button-vs-link distinctions and explicit toggle/icon accessibility requirements. Toolbar guidance limits surfaced actions and moves excess actions into overflow; Button guidance also treats responsive overflow as a presentation/layout response while preserving primary-action priority.

R1 implication: **adopt-pattern** for action scope, semantic control type, responsive action grouping and group-level presentation constraints. These findings challenge any model in which a Button owns business action semantics or a ButtonGroup is merely a fixed visual row. Action scope/target belongs to interaction contracts; overflow/persistence belongs to presentation/layout policy.

Sources:
- https://www.patternfly.org/patterns/actions/
- https://www.patternfly.org/components/button/design-guidelines/
- https://www.patternfly.org/components/button/html/
- https://www.patternfly.org/components/toolbar/design-guidelines/

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
| ButtonGroup | implemented semantic-composite | Radix/PatternFly/shadcn/MUI | own + adapt | group-level focus, action scope and responsive overflow are distinct contracts |
| named slots | SlotDescriptor exists | MUI/Radix | own + adopt-pattern | preserve explicit slot identity; investigate schema-driven inspector in R2/R3 |
| Table/DataTable | no explicit descriptor found | shadcn/MUI | defer to R2 collection | collection semantics, selection/sort capabilities |
| Toolbar/Menu | no explicit descriptor found | Radix/PatternFly/shadcn/MUI | defer to R2/R3 | compound plus command/focus/action-scope capability |
| Sidebar | no explicit descriptor found | shadcn | defer to R4 region/pattern | too structural for primitive tier |
| Card | no explicit descriptor found | shadcn/MUI | defer classification | likely compound/pattern depending semantics |

## Findings / dedup

1. The existing Station descriptor is already stronger than a flat component-name catalog: it models family, parent compatibility, slots and discrete spans. Preserve it instead of replacing it with a third-party registry.
2. `ComponentFamily` and the S3 complexity ladder are related but not identical. `atomic/collection/semantic-composite/layout-container` are compatibility families; Token..Studio is a complexity/ownership ladder. Do **not** collapse them into one enum without synthesis evidence.
3. Accessibility and interaction behavior should not be encoded by multiplying visual primitive variants. Radix demonstrates that keyboard/focus/dismissal behavior is a reusable contract dimension.
4. shadcn's Component vs Block separation and MUI's Core vs X vs Templates reinforce Station's tiered catalog rather than a monolithic component list.
5. `tabs` already exists as a layout kind, but mature ecosystems treat Tabs as an interactive pattern with keyboard/activation semantics. R3 must decide how layout identity projects interaction capability without conflating placement and action.
6. ButtonGroup is a valid R2 seed, but its fixed five slots are implementation evidence, not yet a universal action-group grammar. Radix and PatternFly add independent evidence that group-level focus, command scope and responsive overflow must be modeled separately from button visual identity.
7. MUI's named slots and Radix's composable trigger model converge with Station's existing SlotDescriptor: customization should occur through bounded declared attachment points. This supports a future contract/schema-driven Inspector while arguing against arbitrary descendant editing as the default.
8. PatternFly's component-level versus page-wide action distinction supports explicit `target/scope` in the future Interaction Grammar. `Button` should emit/host activation; command target and business consequence remain elsewhere.
9. Responsive overflow is not a new command and should not clone actions. A single semantic action may project as visible button or overflow-menu item according to presentation constraints.

## Proof obligations / inherited proofs emerging from R1

These are research candidates, not accepted product gates yet.

- **Primitive semantic proof:** a Button projected through provider/presentation still exposes correct native/ARIA role, accessible name, keyboard activation and disabled semantics. Inherit this proof wherever Button is reused; do not re-prove it per business command.
- **Slot compatibility proof:** a named slot accepts only declared child families/kinds and rejects incompatible placement deterministically. Existing composition validation is inherited evidence; future schema-driven Inspector must not bypass it.
- **Behavior-composition delta proof:** composing trigger/focus/overlay capabilities onto a visual primitive must preserve each inherited accessibility contract and expose conflicts rather than silently overriding handlers/state.
- **Action-scope proof:** component-level/page-level/selection-level action target is explicit and cannot be inferred solely from visual proximity.
- **Responsive projection proof:** moving an action from visible group to overflow changes presentation/placement only; command identity, target, authority and evidence requirements remain invariant.
- **Projection-convergence proof:** Inspector/Layers/Graph/source/Preview edits must converge on one canonical model; no projection may become a second state authority.

Coverage state for these new obligations is currently `unproven-gap` unless inherited repository evidence is explicitly cited; absence of a failing test is not PASS.

## Gaps carried forward

- Complete repository-wide primitive census beyond `station-composition` (especially any Station UI wrappers/source-owned controls) before declaring primitive absence.
- Token census: typography, spacing, radius, elevation, motion and semantic color ownership.
- Accessibility contract shape: focus, keyboard, labelling, modality, dismissal, RTL and assistive-technology expectations.
- Overlay/layer capability ownership for Dialog/Popover/Tooltip/Menu.
- Collection semantics for Table/List/Tree/Grid and virtualization boundaries.
- Decide which candidates are true C1 primitives versus C2 compounds; do not promote from ecosystem naming alone.
- Provider parity still needs Base UI, React Aria, Fluent, Carbon, Chakra and Ant evidence before R1 closure. PatternFly is now represented.
- Reconcile this research branch with fresh `main@868785466a2cd6dc4c4d2fa6e7124fe95ebdcf1c`; current branch divergence must not be mistaken for fresh-main integration proof.

## R1 disposition

R1 remains **in progress**. This document now carries primary-source parity evidence for Radix, shadcn/ui, MUI and PatternFly, with stronger findings around named slots, behavior composition, action scope, group-level focus and responsive projection. No Construction slice is eligible. Next research delta: extend parity across Base UI, React Aria, Fluent, Carbon, Chakra and Ant; complete repository-wide dedup; reconcile the branch with fresh main; close R1 only when the census is sufficient to feed R2 without provider lock-in.
