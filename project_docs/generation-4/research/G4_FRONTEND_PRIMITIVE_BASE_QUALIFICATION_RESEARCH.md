# G4 — Frontend Primitive Base Qualification Research

Status: `RESEARCH_ACTIVE / NON_EXECUTABLE`
Execution authority: NONE
Date: 2026-09-22

## Purpose

Qualify the current `shadcn/ui + accessible primitive base` hypothesis for the future System Builder UI Platform without prematurely selecting one primitive provider for every interaction class.

This artifact extends `G4_FRONTEND_DESIGN_SYSTEM_FOUNDATION_PLAN.md` and `G4_FRONTEND_PROJECTION_NAVIGATION_CONTRACT_RESEARCH.md`. It does not authorize installation, migration, implementation, provider adoption, Work Packages, Sprints or TASKs.

## Evidence classes

Primary/current documentation reviewed in this round:

- shadcn/ui July 2026 changelog and CLI documentation;
- Base UI component/release documentation;
- Radix Primitives component/accessibility documentation;
- React Aria / React Spectrum release and collection documentation;
- existing G4 accessibility and projection-navigation research.

The evidence is provider capability evidence, not implementation authority.

## Current ecosystem fact pattern

As of September 2026:

- shadcn/ui new projects default to Base UI;
- Radix remains supported and mature;
- React Aria is a first-class shadcn component base selectable through the CLI;
- shadcn's base choice is project-level configuration, while source ownership still permits deliberate local composition where justified;
- Base UI continues adding collection-oriented behavior, including Combobox collection APIs and grid-mode keyboard navigation;
- React Aria has explicit collection abstractions across GridList, Table and Tree, plus accessible drag/drop and incremental/infinite loading;
- Radix remains strongest as a compact set of mature conventional primitives, with explicit focus management, roving tabindex and keyboard behavior, but its published primitive catalog is not a comparable full collection/data-surface system.

Therefore `shadcn default == Base UI` is useful prior evidence, not a proof that every System Builder interaction should use Base UI.

## Material finding Q1 — qualify by interaction class, not by one global winner

The previous working hypothesis said `Radix/Base UI/React Aria as selected by component`. That is too permissive: arbitrary per-component mixing can produce inconsistent focus behavior, composition APIs, state selectors, dependency closure and testing obligations.

The stronger candidate rule is:

```text
ONE DEFAULT BASE FOR ORDINARY PRIMITIVES
        +
EXPLICIT SPECIALIZED COLLECTION/INTERACTION EXCEPTIONS
        +
SB-OWNED WRAPPERS / CONTRACTS
```

Candidate interaction classes:

```text
A. SIMPLE / CONVENTIONAL PRIMITIVES
   Button, Toggle, Checkbox, Radio, Dialog, Popover,
   Menu, Tabs, Tooltip, Accordion, Select, Toolbar

B. COLLECTION / DATA NAVIGATION
   ListBox, GridList, Tree, Table, Combobox,
   multi-selection, async collections, incremental loading,
   collection drag/drop, keyboard spatial navigation

C. ENGINEERING SURFACES
   Inventory/Catalog, graph/canvas, topology, workflow,
   component tree, inspector, semantic zoom, ports/connectors
```

Provider choice should be qualified per class, but the product should avoid mixing bases inside one interaction family without a measured reason.

`Provider diversity != interaction quality`.

## Material finding Q2 — Base UI remains the leading default for class A

Evidence supporting Base UI as the current leading default for ordinary primitives:

- it is the current shadcn default for new projects;
- shadcn recommends it for new projects while retaining Radix support;
- Base UI exposes granular unstyled parts and current accessibility/focus behavior;
- its current releases show continuing accessibility, focus, interaction and performance fixes;
- it includes relevant desktop-editor primitives such as Toolbar, Menu, Combobox and Select;
- its composition model aligns with source-owned shadcn components.

This is still a candidate, not a binding selection.

Qualification required before adoption:

- SSR/RSC behavior in the intended Next.js topology;
- bundle/dependency closure for generated systems;
- focus restoration and nested overlay behavior;
- RTL/i18n behavior;
- high-density toolbar/menu use;
- controlled/uncontrolled state conventions;
- test ergonomics;
- migration/update strategy for source-owned components.

## Material finding Q3 — React Aria deserves a specialized qualification lane for class B

React Aria's evidence is materially stronger for large interactive collections than treating a collection as repeated generic buttons/cards.

Capabilities relevant to System Builder include:

- GridList/Table/Tree collection models;
- selection behavior and keyboard navigation;
- accessible collection drag/drop, including keyboard and screen-reader paths;
- incremental/infinite loading through collection load-more behavior;
- virtualization support in the ecosystem;
- internationalization depth;
- command/search patterns via Autocomplete/collection composition.

This maps directly to the emerging inventory navigation requirements:

```text
20 items
  -> visual Grid/List

100 items
  -> Grid/List + filtering/search

500+ items
  -> bounded materialization + collection navigation

2000+ items
  -> Search/Command/context insertion + incremental results
```

These counts remain test scenarios, not frozen thresholds.

Candidate decision:

`React Aria is the first specialized base to prototype for collection-heavy SB surfaces, even if Base UI remains the ordinary primitive default.`

This does not mean importing React Aria wholesale or making generated runtimes depend on its collection system.

## Material finding Q4 — Radix remains a valid baseline/comparator, not a rejected provider

Radix still provides mature, accessible conventional primitives with explicit keyboard/focus behavior. Its Toggle Group, for example, documents roving tabindex and complete arrow/Home/End interaction. Menus, dialogs, tabs, popovers and related primitives remain strong benchmarks.

However, the current public primitive catalog does not expose an equivalent first-class family for Table/Tree/GridList/large async collections. For the SB inventory/tree/data-navigation problem, that would move more behavior into SB-owned composition.

Candidate use:

- retain Radix as the mature comparator for class A;
- preserve compatibility/migration awareness because existing shadcn ecosystems may use it;
- do not choose it merely because it was shadcn's historical default;
- do not reject it where its smaller behavioral surface is an advantage.

## Material finding Q5 — shadcn base abstraction is not perfectly uniform

The current shadcn documentation itself exposes cases where a component under one base can rely on another underlying implementation. A current example is Drawer documentation under the React Aria surface using Base UI behavior.

Therefore the frontend architecture must distinguish:

```text
SB component contract
!= shadcn registry/base label
!= underlying primitive package
```

A future component manifest should be able to record at least:

```text
UIComponentQualification
  sbContract
  sourceOwned
  upstreamBase
  underlyingDependencies[]
  interactionClass
  accessibilityProofs[]
  keyboardContract
  rtl/i18nQualification
  ssr/rscQualification
  bundleClosure
  updateLineage
  exceptions[]
```

This is research vocabulary, not a code schema commitment.

## Material finding Q6 — generated-system dependency closure must be capability-driven

A Builder engineering surface may justify a rich collection dependency while a generated client runtime containing only ordinary forms must not inherit it automatically.

Candidate dependency rule:

```text
Builder UI Platform
  may qualify multiple interaction engines

Generated System
  includes only dependencies reachable from selected UI components/capabilities
```

Thus:

`Builder primitive qualification != generated-runtime mandatory dependency`.

Future proof should measure:

- package closure per component family;
- client JS/hydration cost;
- CSS/token closure;
- RSC/client boundaries;
- whether a source-owned wrapper accidentally imports a broad provider barrel;
- tree-shaking under real generated-system bundles.

## Material finding Q7 — toolbar behavior matters to the Photoshop-like shell

Base UI's Toolbar guidance exposes a useful failure mode for the proposed creative-editor shell: horizontal toolbar arrow navigation can conflict with text-input cursor navigation. Its guidance recommends using inputs sparingly and placing a single input last when present.

Translation to SB:

- the persistent tool rail should be a keyboard-coherent toolbar/toolbox, not an arbitrary list of icon buttons;
- global search/command should remain a distinct control rather than being casually embedded among arrow-navigated tool controls;
- contextual option bars with text inputs need an explicit keyboard model rather than blindly applying roving focus to everything;
- focus, selection, active tool and current object remain distinct states.

This materially strengthens the Photoshop-derived shell research.

## Candidate qualification matrix

| Interaction need | Base UI | Radix | React Aria | Current research disposition |
| --- | --- | --- | --- | --- |
| Button/toggle/basic input | strong | strong/mature | strong | Base UI default candidate; compare behavior/API |
| Dialog/popover/menu/tooltip | strong | strong/mature | strong | Base UI default candidate; Radix comparator |
| Toolbar/tool groups | explicit toolbar support | explicit toolbar/toggle-group support | composable controls | prototype keyboard model; no binding yet |
| Select | strong | strong | strong | default-base preference unless evidence differs |
| Combobox/autocomplete | strong and evolving collection API | no equivalent broad collection family in current primitive catalog | strong collection/search composition | compare with realistic 100/500/2000-item workloads |
| Grid-like inventory | Combobox supports grid-mode list; broader custom composition needed | SB-owned composition likely | GridList/collection model directly relevant | React Aria specialized candidate |
| Tree/component hierarchy | custom composition required | no first-class Tree in current catalog | first-class Tree + accessible DnD evidence | React Aria specialized candidate |
| Data table / interactive collection | custom/table composition | no first-class Table collection primitive | first-class Table collection model | React Aria specialized candidate |
| Collection drag/drop | custom qualification | custom qualification | explicit keyboard/screen-reader collection DnD | React Aria specialized candidate |
| Async/infinite collection | custom qualification | custom qualification | explicit LoadMore collection support | React Aria specialized candidate |
| Graph/canvas/topology | not sufficient alone | not sufficient alone | not sufficient alone | SB engineering surface; primitives only support controls/alternatives |

The matrix compares evidence relevant to SB, not overall library quality.

## Accessibility proof obligations by class

### Class A

- APG-compatible semantics where applicable;
- visible focus and focus restoration;
- keyboard operation;
- target sizing/spacing;
- reduced motion;
- RTL;
- accessible names/descriptions/errors.

### Class B

Additionally:

- focus vs selection explicitly separated;
- multi-select semantics;
- typeahead/search behavior;
- virtualized/incremental content announced correctly;
- stable identity under sorting/filtering/loading;
- keyboard/screen-reader alternatives for drag/drop;
- logical DOM/accessibility order independent of visual layout;
- no hidden-item enumeration through counts/search.

### Class C

Additionally:

- non-spatial equivalent for graph/topology relations;
- non-drag alternative for connect/place/move;
- semantic zoom does not destroy identity;
- projection navigation preserves focus identity when admissible;
- canvas omission never implies canonical absence;
- actions remain mode/authority qualified.

## Failure cases to prototype before selection

1. Inventory with 2,000 capabilities, keyboard-only navigation and incremental results.
2. Tree with 5+ hierarchy levels, lazy children, multi-selection and reorder/move without drag.
3. Data table with selection, sorting, filtering, async pages and inspector synchronization.
4. Combobox with grouped contextual eligibility states `ELIGIBLE / INELIGIBLE(reason) / UNKNOWN`.
5. Photoshop-like tool rail + contextual toolbar + global command/search without focus traps or arrow-key conflicts.
6. Nested popover/menu/dialog/inspector behavior and focus restoration.
7. RTL plus long translated labels in inventory and toolbar surfaces.
8. Reduced-motion and 200%/400% zoom/reflow behavior.
9. Generated-system bundle containing only forms/basic primitives vs Builder bundle containing collection/engineering surfaces.
10. Mixed-base source-owned components upgraded independently without silent behavioral drift.

## Candidate architecture after this round

```text
shadcn source-owned component layer
        |
        +-- ordinary primitives
        |      -> Base UI leading candidate
        |      -> Radix retained comparator/compatible alternative
        |
        +-- collection-heavy primitives/patterns
        |      -> React Aria specialized candidate
        |      -> Base UI compared where collection support is sufficient
        |
        +-- SB engineering surfaces
               -> SB-owned contracts/projections
               -> use qualified primitives below
               -> never delegate canonical semantics to UI provider
```

The key is not provider purity. The key is **bounded provider diversity with explicit interaction-family ownership and dependency closure**.

## Invariants added/refined

```text
shadcn default != SB universal primitive authority
Provider diversity != interaction quality
SB component contract != registry/base label != underlying primitive package
Collection virtualization != semantic omission authority
Keyboard focus != selection != active tool != canonical focus identity
Builder primitive qualification != generated-runtime mandatory dependency
Accessible drag/drop != permission to make drag the only interaction
```

## Maturity

`FRONTEND_PRIMITIVE_BASE_QUALIFICATION = EMERGING / MATERIAL_DELTA`

Not saturated. No implementation selection is authorized.

## Next highest-value gap

Run a deeper evidence/prototype-spec round on the collection-heavy path:

1. define provider-neutral interaction contracts for `InventoryGrid`, `CapabilityList`, `ComponentTree`, `RelationTable` and `ContextualPicker`;
2. map Base UI and React Aria APIs against those contracts rather than comparing marketing feature lists;
3. specify benchmark/proof scenarios for 20/100/500/2,000 items, async loading, keyboard-only, screen-reader, RTL, reduced motion and long labels;
4. define the non-spatial relation navigator that is equivalent to graph selection/traversal;
5. qualify bundle/dependency closure separately for Builder and generated systems.
