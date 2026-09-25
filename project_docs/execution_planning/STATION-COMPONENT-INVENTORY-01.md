# Station Component Inventory — Construction A

Date: 2026-09-24
Basis: `main@1804c2e5b5eacd677ed3a2c2808e383fb42e2144`
Authority: `STATION-COMPONENT-COMPOSITION-PLAN-01.md`

## Existing reusable substrate

| Package | Existing object | Family | Status for Composition A |
|---|---|---|---|
| ui-core | Button | atomic primitive | sufficient |
| ui-core | IconButton | atomic primitive | sufficient |
| ui-core | Input | atomic primitive | sufficient |
| ui-core | Select | atomic primitive | sufficient |
| ui-core | Toggle | atomic primitive | sufficient |
| ui-core | Separator | atomic primitive | sufficient |
| ui-core | Badge | atomic primitive | sufficient |
| ui-core | Tooltip | local semantic helper | sufficient |
| ui-core | MenuSurface | local semantic composite | sufficient baseline |
| ui-core | Panel | layout/content container | sufficient baseline |
| ui-core | ScrollArea | layout/content container | sufficient baseline |
| ui-icons | StationIcon/IconToken | semantic primitive adapter | sufficient |
| station-interaction | focus/selection context | interaction primitive | sufficient baseline |
| station-interaction | presentation commands | interaction primitive | sufficient baseline |
| station-windowing | WindowDefinition/Instance | window/runtime presentation contract | reuse, not composition ownership |
| station-windowing | geometry/lifecycle/z-order | interaction/window primitive | reuse, not view-grid sizing |
| station-app-runtime | AppManifest/ToolManifest | application registry contract | coexist; not component registry |
| station-shell | Navbar | application shell composite | existing consumer |
| station-shell | CommandSurface/Toolbar | application shell composite | existing consumer |
| station-shell | Taskbar/Launcher | application shell composite | existing consumer |

## Required new foundation

### Composition-specific package
Create `packages/station-composition` rather than overloading `station-app-runtime` or `station-windowing`.

It should own:
- component family taxonomy;
- ComponentDescriptor;
- SlotDescriptor;
- ChildPolicy;
- LayoutKind;
- discrete LayoutConstraints;
- ComponentRegistry;
- placement/slot/span validation.

### First composition families

```text
atomic
collection
semantic-composite
layout-container
```

These are classification semantics, not React inheritance.

## Immediate missing primitives/composites for TASK-607..610

| Object | Family | Need now? | Reason |
|---|---|---:|---|
| ComponentRegistry | composition infrastructure | yes | editor/AI capability lookup |
| Composition contracts | composition infrastructure | yes | formal LEGO joints |
| discrete grid/span | layout primitive | yes | proportional sizing |
| named slots | composition primitive | yes | compatible insertion |
| ButtonGroup | semantic composite | yes | first nested-slot proof |
| ButtonSlot | managed internal slot | yes | ButtonGroup micro-layout |
| List | collection | later | not needed to prove first substrate |
| Tree | collection | later | needed by Layers/Explorer, not A |
| Table | collection | later | not needed by editor foundation A |
| Grid collection | collection | later | distinct from layout grid |
| Inspector | generic composite | next package | requires property schema |
| Layers Tree | generic composite | next package | requires composition graph |
| Dialog/Popover primitives | UI primitive/composite | defer unless demanded | no dependency for A |
| Checkbox/Radio/TextArea | UI primitive | defer unless demanded | no dependency for A |

## Duplicate/ownership decisions

1. `AppManifest` registry is not the Component Registry. Application launch and component composition remain separate authorities.
2. `WindowGeometry` is not the composition grid. Window pixels describe desktop window presentation; view/component composition uses discrete spans.
3. `Panel` may host children but does not become a universal Group abstraction.
4. Collections will own their item layout internally; avoid wrappers such as `ListGroup` unless distinct semantics emerge.
5. `ButtonGroup` is justified because a set of related actions is one semantic block with a local micro-grid.

## Minimum dependency closure

Construction A does not need editor persistence, templates, responsive authoring, schema migration, preview sandbox or Git approval UI yet.

The exact minimum executable closure is:

```text
taxonomy
→ descriptors/registry
→ slot + grid/span validation
→ ButtonGroup
→ Component Lab proof
```

## Deferred next closure

After A is green:

```text
Inspector
+ Layers Tree
+ Composition Graph
+ schema/versioning
+ editor transactions
+ save/draft
+ preview
→ Composition Editor Engine
```

## Architecture invariants

- one theme and centrally controlled typography remain authoritative;
- no arbitrary CSS/pixel geometry enters composition contracts;
- composition state is presentation/build definition, not Core business truth;
- lower-level pieces do not know higher-level application/domain meaning;
- higher-level composites must preferentially reuse lower-level registered pieces.
