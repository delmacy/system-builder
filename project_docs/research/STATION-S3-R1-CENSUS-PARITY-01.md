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
Radix documents low-level, accessible primitives with focus/keyboard behavior and composable parts. Its trigger composition and Toolbar group behavior are evidence for separating visual identity from reusable interaction contracts.

R1 implication: **adopt-pattern**, not provider authority. Preserve behavioral/accessibility expectations as capabilities/contracts while keeping presentation/provider replaceable.

Sources:
- https://www.radix-ui.com/primitives/docs/components
- https://www.radix-ui.com/primitives/docs/guides/composition
- https://www.radix-ui.com/primitives/docs/components/toolbar

### shadcn/ui
The official catalog spans low-level controls and larger compositions/Blocks, while its registry is source-owned/copyable rather than a mandatory opaque runtime.

R1 implication: parity evidence for compound/collection breadth and source-owned adaptation; registry/provider mechanics must not become Station identity authority.

Sources:
- https://ui.shadcn.com/docs/components
- https://ui.shadcn.com/docs/_blocks
- https://ui.shadcn.com/docs/components-json

### MUI / MUI X
MUI separates core components, advanced MUI X components and templates. Its structural customization exposes a root plus named interior slots and slot-specific props.

R1 implication: **adopt-pattern** for complexity separation and named-slot/schema-driven customization. Station's existing `SlotDescriptor` should be strengthened rather than replaced.

Sources:
- https://mui.com/
- https://mui.com/material-ui/customization/overriding-component-structure/
- https://mui.com/x/common-concepts/custom-components/

### PatternFly
PatternFly distinguishes component-level actions from page-wide actions, locates actions near affected objects, and treats group focus/overflow as behavior/presentation concerns rather than business-action identity.

R1 implication: **adopt-pattern** for action scope, semantic control type, responsive action grouping and group-level presentation constraints.

Sources:
- https://www.patternfly.org/patterns/actions/
- https://www.patternfly.org/components/button/design-guidelines/
- https://www.patternfly.org/components/toolbar/design-guidelines/

### Base UI
Base UI explicitly describes its APIs as open/composable: consumers can add/remove/wrap parts, and its `render` composition mechanism can project a trigger onto a consumer-owned button. It separately treats ARIA roles, pointer interactions, keyboard navigation and focus management as accessibility behavior, while leaving visual focus indication/styling to the consumer.

R1 implication: **adopt-pattern** for behavior/presentation separation and bounded part composition. This independently reinforces Station's direction that a primitive can host activation/focus behavior without owning business command semantics, and that presentation-provider substitution must preserve behavioral proofs. Do not copy Base UI's `render` syntax as canonical Station grammar.

Sources:
- https://base-ui.com/react/overview/about
- https://base-ui.com/react/overview/accessibility
- https://base-ui.com/react/handbook/composition

### Carbon Design System
Carbon's Button accessibility guidance treats standard keyboard activation as component-level evidence and explicitly models menu-opening buttons as distinct menu-button/overflow compositions with their own focus transfer, arrow navigation, Escape restoration and ARIA contracts. Carbon also publishes accessibility-test status by default state, advanced states, keyboard navigation and manual screen-reader testing, including explicit `Not available` rather than silently treating missing evidence as pass.

R1 implication: **adopt-pattern** for proof-status vocabulary, component-vs-capability delta proofs and menu/overflow interaction semantics. Carbon's evidence strongly supports the S3 rule that missing evidence stays a gap, primitive Button proofs are inherited, and adding menu behavior creates new proof obligations instead of redefining Button identity.

Sources:
- https://carbondesignsystem.com/components/button/accessibility/
- https://carbondesignsystem.com/components/menu-buttons/accessibility/
- https://carbondesignsystem.com/components/overview/accessibility-status/
- https://carbondesignsystem.com/components/overflow-menu/usage/

### Chakra UI
Chakra's Slot Recipes declare named component parts, base styles per slot, variants, defaults and compound variants, and recommend a compound-component context for multi-part components.

R1 implication: **adopt-pattern** only for the distinction between stable structural slots and presentation recipes. Station should not collapse `SlotDescriptor` into styling: structural compatibility remains canonical composition grammar, while token/variant recipes are presentation projections layered over declared slots.

Source:
- https://chakra-ui.com/docs/theming/slot-recipes

## Preliminary parity matrix

Classification is intentionally conservative; R2+ owns promotion of compounds/capabilities/patterns.

| Candidate semantic primitive/family | Station now | Mature parity | Classification | Notes |
|---|---|---|---|---|
| Button | implied atomic usage | universal | own | semantic action remains separate from visual variant |
| Label | no explicit descriptor found | Radix/shadcn/Base UI | adapt | native semantics/accessibility first |
| Text/Input/Textarea | no explicit catalog descriptor found | shadcn/MUI/Base UI | adapt | field assembly belongs R2 |
| Checkbox/Switch/Radio | no explicit catalog descriptor found | broad convergence | adapt | state/action contract belongs R3 |
| Select/Combobox | no explicit catalog descriptor found | broad convergence | adapt | Combobox likely compound/capability-backed, not atomic |
| Separator | no explicit descriptor found | broad convergence | adopt-pattern | presentation primitive with semantic option |
| Progress/Spinner | no explicit descriptor found | broad convergence | adapt | status semantics separate from domain status |
| Avatar/Badge | no explicit descriptor found | broad convergence | adapt | presentation identity must not imply business identity |
| Tooltip | no explicit descriptor found | Radix/MUI/Base UI | adopt-pattern | overlay/focus behavior is capability-backed |
| Dialog/Popover | no explicit descriptor found | Radix/MUI/Base UI | adopt-pattern | layering/focus/dismissal must be reusable capability |
| Tabs | layout kind exists | broad convergence | own + adapt | layout identity exists; interaction semantics need R3 |
| ScrollArea | no explicit descriptor found | Radix/shadcn | adopt-pattern | prefer native behavior with bounded enhancement |
| ButtonGroup | implemented semantic-composite | broad convergence | own + adapt | group focus, action scope and responsive overflow are distinct contracts |
| named slots | SlotDescriptor exists | MUI/Chakra/Base UI/Radix | own + adopt-pattern | structural slots != presentation recipes; investigate schema-driven Inspector |
| Table/DataTable | no explicit descriptor found | broad convergence | defer to R2 collection | collection semantics, selection/sort capabilities |
| Toolbar/Menu | no explicit descriptor found | Radix/PatternFly/Carbon | defer to R2/R3 | compound plus command/focus/action-scope capability |
| Sidebar | no explicit descriptor found | shadcn | defer to R4 region/pattern | too structural for primitive tier |
| Card | no explicit descriptor found | shadcn/MUI | defer classification | likely compound/pattern depending semantics |

## Findings / dedup

1. Existing Station descriptors are already stronger than a flat component-name catalog: preserve family, compatibility, slots and discrete spans rather than replacing them with a provider registry.
2. `ComponentFamily` and the S3 complexity ladder are orthogonal dimensions. Do not collapse them into one enum without synthesis evidence.
3. Accessibility and interaction behavior should not multiply visual primitive variants. Radix/Base UI/Carbon independently support behavior contracts layered over primitives.
4. shadcn's Component/Block and MUI's Core/X/Templates reinforce a tiered catalog rather than a monolithic list.
5. `tabs` exists as a layout kind, while mature ecosystems add keyboard/activation semantics. R3 must project interaction capability without conflating placement and action.
6. ButtonGroup is a valid R2 seed, but its five slots are implementation evidence, not universal action-group grammar. Group focus, command scope and responsive overflow remain separate contracts.
7. MUI, Chakra, Base UI and Radix converge on explicit component parts/slots. Station should preserve bounded attachment points; structural slot compatibility must remain distinct from style recipes.
8. PatternFly's action-scope distinction supports explicit `target/scope` in future Interaction Grammar. `Button` hosts activation; command target and business consequence remain elsewhere.
9. Responsive overflow is not a new command. A semantic action may project as visible Button or overflow MenuItem without cloning identity/authority/evidence.
10. Carbon's Button vs menu-button distinction supplies a useful promotion criterion: when composition introduces a materially new interaction state machine (focus transfer, open/close, roving navigation, restoration), it may justify a C2/C4 contract, but not a new business-specific primitive.
11. Carbon's explicit unavailable accessibility status aligns with `unproven-gap`; evidence absence must remain visible in the Station proof ledger.
12. Chakra's slot recipes reveal a dedup hazard: structural slots and visual variants are related but not identical. Styling variants must not become composition authority.

## Proof obligations / inherited proofs emerging from R1

These are research candidates, not accepted product gates yet.

- **Primitive semantic proof:** a Button projected through provider/presentation still exposes correct native/ARIA role, accessible name, keyboard activation and disabled semantics. Inherit wherever Button is reused; do not re-prove per business command.
- **Slot compatibility proof:** a named slot accepts only declared child families/kinds and rejects incompatible placement deterministically. Future schema-driven Inspector must not bypass it.
- **Behavior-composition delta proof:** composing trigger/focus/overlay capabilities onto a visual primitive preserves inherited accessibility contracts and exposes conflicts rather than silently overriding handlers/state.
- **Menu/overflow delta proof:** adding menu capability proves open/close state, focus entry, roving/arrow navigation, activation, Escape dismissal/restoration and accessible relationship while inheriting primitive trigger activation.
- **Action-scope proof:** component/page/selection action target is explicit and cannot be inferred solely from visual proximity.
- **Responsive projection proof:** moving an action from visible group to overflow changes presentation/placement only; command identity, target, authority and evidence remain invariant.
- **Structural-slot vs presentation-recipe proof:** changing theme/variant recipes cannot alter slot acceptance, component identity or action authority.
- **Projection-convergence proof:** Inspector/Layers/Graph/source/Preview edits converge on one canonical model; no projection becomes a second state authority.

Coverage state for these obligations is `unproven-gap` unless inherited repository evidence is explicitly cited. Absence of a failing test is not PASS.

## Gaps carried forward

- Complete repository-wide primitive census beyond `station-composition`, especially Station UI wrappers/source-owned controls.
- Token census: typography, spacing, radius, elevation, motion and semantic color ownership.
- Accessibility contract shape: focus, keyboard, labelling, modality, dismissal, RTL and assistive-technology expectations.
- Overlay/layer capability ownership for Dialog/Popover/Tooltip/Menu.
- Collection semantics for Table/List/Tree/Grid and virtualization boundaries.
- Decide which candidates are true C1 primitives versus C2 compounds; ecosystem naming alone cannot promote them.
- Provider parity still needs React Aria, Fluent and Ant evidence before R1 closure. Base UI, Carbon and Chakra are now represented.
- Reconcile this branch with fresh `main@868785466a2cd6dc4c4d2fa6e7124fe95ebdcf1c`; branch divergence is not fresh-main integration proof.

## R1 disposition

R1 remains **in progress**. Primary-source parity now covers Radix, shadcn/ui, MUI, PatternFly, Base UI, Carbon and Chakra with convergent evidence around named parts, behavior composition, action scope, proof inheritance/status and responsive projection. No Construction slice is eligible. Next dependency-safe delta: cover React Aria, Fluent and Ant; complete repository-wide dedup/token census; reconcile the branch against fresh main; close R1 only when the census can feed R2 without provider lock-in.