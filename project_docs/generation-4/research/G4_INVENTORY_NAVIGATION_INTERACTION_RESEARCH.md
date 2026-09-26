# G4 — Inventory-Style Navigation & Interaction Research

Status: `RESEARCH_ACTIVE / NON_EXECUTABLE`
Execution authority: NONE
Date: 2026-09-22

## Purpose

Qualify the user's proposed **RPG-inventory-like interaction grammar** for navigating a very large System Builder toolbox/capability catalog without turning the product into a literal game UI.

This artifact extends `G4_FRONTEND_WORKSPACE_COMPONENTIZATION_RESEARCH.md`. It does not authorize implementation.

The research question is not "should System Builder look like a game?". It is:

> Can mature inventory interaction patterns — categorical tabs, recognizable slots/cards, spatial grouping, selected-item detail, contextual actions, fast switching and persistent location cues — make a very broad engineering suite easier to navigate?

## Evidence classes

This round used:

- Nielsen Norman Group usability heuristics, especially recognition rather than recall;
- Forsey et al., *Designing for Learnability: Improvement Through Layered Interfaces* (Applied Human Factors and Ergonomics, 2024/2025), on progressive disclosure/layered interfaces;
- Popovic, *Expert and Novice User Differences and Implications for Product Design and Usability* (Human Factors and Ergonomics Society), on novice/expert knowledge representation differences;
- a 2026 Télécom Paris student quantitative UX study on spatial inventory zoning, treated as **supporting/low-authority empirical evidence**, not a normative source;
- inventory UI implementation/design references that explicitly distinguish Grid, List, Equipment/slot views, selected-item inspectors, filters and contextual actions. These are pattern evidence, not product authority.

Game-specific conventions such as rarity colors, item packing, equipment fiction and reward mechanics are intentionally excluded unless they map to a genuine SB semantic need.

## Material findings

### I1 — The useful import from RPG inventory is navigation grammar, not game decoration

Inventory interfaces commonly decompose a dense collection into:

```text
CATEGORY / TAB
    ↓
BROWSE SURFACE
    ↓
SELECTION
    ↓
DETAIL / INSPECTOR
    ↓
CONTEXTUAL ACTIONS
```

This maps unusually well to SB:

```text
Toolbox category
    ↓
Capability / component catalog
    ↓
Selected definition/item
    ↓
Qualified inspector
    ↓
Add / open / connect / compare / configure
```

Candidate rule:

`Gamified interaction grammar != game semantics`.

The UI may be visually pleasant, tactile and spatially memorable without importing XP, rarity, loot, equipment or reward semantics.

### I2 — Recognition-heavy catalogs can reduce recall burden

NN/g's recognition-rather-than-recall heuristic recommends keeping elements, actions and options visible or easily retrievable instead of requiring users to remember them across interface regions.

For SB this supports persistent category landmarks and recognizable item cards/slots for frequently manipulated building blocks.

Candidate item cell anatomy:

```text
┌────────────────────┐
│ icon        status │
│ Capability Name    │
│ short type/role    │
│ badges / findings  │
└────────────────────┘
```

But icon-only navigation is insufficient. Labels should remain available in normal browsing; tooltips are supplemental rather than the only way to discover meaning.

### I3 — Grid and list solve different tasks; SB should support both

Inventory references repeatedly distinguish:

- **grid**: rapid browsing, recognition, spatial memory and higher visible item count;
- **list**: textual comparison, sorting and multiple attributes per row;
- **detail inspector**: deep information/actions for the current selection.

Candidate SB catalog modes:

```text
GRID
  recognition / browse / add

LIST
  compare / sort / audit / bulk select

DETAIL
  inspect selected identity
```

Do not force every catalog into a card grid. A provider catalog with many comparable properties may be better as a list/table, while a frontend component palette benefits from a visual grid.

`Inventory metaphor != mandatory grid`.

### I4 — Spatial zoning is promising, but user-authored arbitrary placement is not yet justified

A 2026 Télécom Paris student study observed experienced players naturally zoning inventory regions by item category and using stable spatial anchors. This is not strong enough evidence for a product decision, but it supports testing whether stable categorical regions improve SB recall/navigation.

Candidate stable regions:

```text
FRONTEND
WORKFLOW
BUSINESS
DATA
CAPABILITIES
INTEGRATION
SECURITY
DEPLOYMENT
INFRA
OBSERVABILITY
EVIDENCE
```

Prefer **system-defined stable category zones + user favorites/recents** before allowing arbitrary free-placement of catalog items. Arbitrary positioning creates synchronization, responsive, support and discoverability problems.

### I5 — Progressive disclosure fits the novice/expert problem better than separate products

Forsey et al. describe layered progressive disclosure as a way to expose a reduced subset of functionality first and reveal more advanced functionality as needed. Their findings are qualified rather than absolute, but the pattern is directly relevant to SB's broad capability surface.

Candidate catalog disclosure:

```text
PRIMARY
  recommended / common / context-eligible

EXPANDED
  full category catalog

EXPERT
  advanced variants / provider-specific / low-level primitives
```

This should be task/context-driven rather than a permanent "beginner mode" that traps users.

`Progressive disclosure != hidden capability`.

Search and "show all" remain available.

### I6 — Context eligibility should behave like typed inventory slots, without becoming the authority boundary

Some inventory systems use restricted slots: only compatible item categories can be placed into a destination. This is a useful interaction analogy for SB ports/insertion points.

Candidate flow:

```text
User selects insertion point / port
        ↓
Catalog ranks eligible additions
        ↓
Clearly incompatible items are excluded or qualified
        ↓
Selection creates candidate relation
        ↓
Canonical validation still decides admissibility
```

This is stronger than a giant global palette because the catalog can answer "what can meaningfully go here?".

However:

`UI eligibility hint != canonical semantic validation`.

### I7 — The selected-item inspector should be stable and reusable across catalogs

Inventory UIs commonly reserve a detail panel for the selected item. SB can use the same stable spatial region while changing the schema by semantic type.

Candidate inspector skeleton:

```text
IDENTITY
  name / icon / kind / revision

STATE
  lifecycle / currentness / findings

SUMMARY
  role / purpose

RELATIONS
  dependencies / handoffs / used-by

QUALIFIERS
  owner / authority / evidence / complexity

ACTIONS
  open / add / compare / configure / navigate
```

The inspector is a projection. It does not own these facts.

### I8 — Quick-access patterns map to favorites/recents, not "equipment"

RPG inventories often provide hotbars or fixed quick-access slots. The useful SB translation is:

```text
Favorites
Recent
Pinned for workspace
Suggested for context
```

Candidate `QuickShelf`:

```text
[Recent] [Pinned] [Suggested]
```

This can sit above the full catalog and reduce repeated search without inventing game semantics such as equipped/unequipped.

### I9 — Color cannot import the RPG "rarity" convention

Game inventories frequently use border color to encode rarity. SB already has stronger semantic obligations for status, evidence, currentness, authority, domain accents and runtime state.

Therefore rarity-style color is specifically rejected as a generic catalog convention.

Candidate item emphasis channels:

```text
selection     -> selection token/ring
focus         -> focus-visible ring
status        -> qualified status token + icon/text
findings      -> badge/count + semantic tone
category      -> restrained icon/accent, not status color
favorite      -> explicit pin/star marker
new/unseen    -> small neutral/new marker
```

`Visual desirability != semantic importance`.

### I10 — Inventory-like density requires a semantic card contract

A card/slot should not become a tiny dashboard containing every possible fact.

Candidate three density levels:

```text
MICRO SLOT
  icon + short label + critical marker

CATALOG CARD
  icon + label + kind + 1–3 qualified badges

LIST ROW
  icon + label + sortable/comparable columns
```

Deep properties stay in the inspector.

This keeps the browse surface scan-friendly and preserves target/focus requirements.

### I11 — Search, categories and contextual insertion are complementary

The existing G4 discovery stack remains valid and becomes more concrete:

```text
CATEGORY TABS
  browse by stable taxonomy

GRID / LIST
  recognition and comparison

SEARCH / COMMAND
  direct retrieval when identity is known

CONTEXT INSERTION
  eligible additions from current port/slot/selection

QUICK SHELF
  recents / pinned / suggested
```

Do not collapse these into one universal search box.

### I12 — Inventory interaction suggests a useful `CatalogItem` projection contract

Candidate projection-only contract:

```text
CatalogItem
  canonicalIdentity
  displayLabel
  iconKey
  category
  kind
  shortDescription?
  qualifiedBadges[]
  eligibilityState?
  favoriteState?
  recentState?
  thumbnail/preview?
  primaryAction?
```

Important exclusions:

```text
CatalogItem does NOT own:
  canonical permission
  lifecycle truth
  business state
  provider truth
  deployment truth
```

It is a compact projection optimized for recognition and navigation.

## Proposed SB inventory-navigation surface

```text
┌───────────────────────────────────────────────────────────────────┐
│ Search / Command        Workspace        View mode        User    │
├─────────────┬──────────────────────────────────┬──────────────────┤
│ CATEGORIES  │ QUICK SHELF                      │ SELECTED ITEM    │
│             │ Recent | Pinned | Suggested      │                  │
│ Frontend    ├──────────────────────────────────┤ Identity         │
│ Workflow    │ Grid | List   Filter   Sort      │ State            │
│ Business    ├──────────────────────────────────┤ Relations        │
│ Data        │                                  │ Evidence         │
│ Security    │       CATALOG / INVENTORY        │ Currentness      │
│ Deploy      │                                  │ Dependencies     │
│ Infra       │                                  │                  │
│ Observe     │                                  │ Actions          │
├─────────────┴──────────────────────────────────┴──────────────────┤
│ Context / eligibility / validation / background activity         │
└───────────────────────────────────────────────────────────────────┘
```

This is a **catalog/tool surface**, not necessarily the main central engineering canvas. It may appear as a dock, drawer, modal palette or dedicated inventory view depending on task and viewport.

## Relationship to the floor/map and graph concepts

The inventory grammar should complement, not replace, spatial system navigation.

Candidate triad:

```text
INVENTORY / CATALOG
  "What building blocks are available?"

MAP / SYSTEM SLICES
  "Where am I in the system?"

GRAPH / RELATIONS
  "How is this identity connected?"
```

Selection continuity should bridge all three:

```text
select Capability in inventory
  -> reveal its sector on map
  -> reveal its neighborhood in graph
  -> preserve same canonical identity
```

This directly supports the user's desire to separate complexity into navigable representations instead of rendering everything simultaneously.

## Novice / expert adaptation candidate

Do not fork the product into beginner and expert editions.

Candidate shared surface:

```text
NOVICE PATH
  categories
  recommended blocks
  visual cards
  contextual add
  guided inspector

EXPERT PATH
  command palette
  keyboard navigation
  dense list
  advanced filters
  bulk operations
  direct identity/relation navigation
```

Both paths manipulate the same canonical identities and use the same underlying component contracts.

## Accessibility obligations

Inventory-style navigation adds explicit proof obligations:

1. Grid/list items must be fully keyboard navigable without requiring pointer hover.
2. Hover-only detail is insufficient; selection/focus must expose equivalent information.
3. Drag-to-place must have `Add to…` / destination-picker alternatives.
4. Category tabs and filters require programmatic labels/state.
5. Focus order must remain understandable when switching Grid/List/Inspector.
6. QuickShelf items need text/accessibility names, not icon recognition alone.
7. Dense slots must preserve WCAG target-size/spacing strategy.
8. Category/domain accent cannot be the sole identifier.
9. Search results must expose why an item is eligible/ineligible when that affects action.
10. User customization cannot make essential catalog content unreachable.

## Anti-patterns

1. **Lootification** — rarity, loot, XP or reward semantics applied to architecture elements.
2. **Rainbow inventory** — too many border colors competing with status/evidence semantics.
3. **Grid absolutism** — forcing text-heavy/provider/audit catalogs into visual cards.
4. **Hover inspector dependency** — critical information inaccessible to keyboard/touch.
5. **Slot fiction** — implying a capability can only exist in one location because inventory items occupy slots.
6. **Drag authority** — treating successful visual drop as canonical acceptance.
7. **Adaptive instability** — AI/context ranking constantly moving familiar items and destroying spatial memory.
8. **Favorite sprawl** — QuickShelf becoming another unbounded catalog.
9. **Icon-only taxonomy** — requiring users to memorize symbols.
10. **Category as ownership** — treating a browse taxonomy as canonical architectural ownership.

## Candidate decisions from this round

- **CANDIDATE:** use inventory interaction grammar for large toolbox/catalog navigation, but explicitly reject literal game semantics.
- **CANDIDATE:** support `GRID + LIST + DETAIL` rather than one browse representation.
- **CANDIDATE:** stable categories plus search, contextual insertion and bounded QuickShelf.
- **CANDIDATE:** `PRIMARY / EXPANDED / EXPERT` progressive disclosure over the same catalog.
- **CANDIDATE:** context-ranked eligibility behaves like typed slots, while canonical validation remains authoritative.
- **CANDIDATE:** catalog item/card is a compact projection contract, not domain truth.
- **CANDIDATE:** preserve identity across Inventory ↔ Map ↔ Graph navigation.
- **REJECTED AS DEFAULT:** rarity colors, arbitrary free-placement inventory, equipment semantics, variable-size packing puzzles and game reward mechanics.

## Proof obligations added by this round

1. A user can locate an unfamiliar capability through category browsing without knowing its exact name.
2. A user who knows the identity can retrieve it faster through search/command than category traversal.
3. Context insertion materially reduces irrelevant choices without hiding a valid path to the full catalog.
4. Grid and list expose the same canonical item identities and do not diverge semantically.
5. Selection survives Inventory → Map → Graph transitions without creating duplicate identity state.
6. The inspector exposes the same qualified status/currentness semantics as other workspaces.
7. Category and favorites are user-navigation metadata, not canonical architectural ownership.
8. Re-ranking suggestions does not reorder stable user landmarks without an explicit adaptive region.
9. Essential catalog actions are keyboard/touch accessible and have non-drag alternatives.
10. Inventory visual styling cannot collide with status/evidence/authority color semantics.

## Maturity

`INVENTORY_NAVIGATION = EMERGING / MATERIAL_DELTA`

The interaction analogy is now useful enough to retain, but not mature enough to implement. It needs prototype evidence with real SB catalog sizes and tasks.

## Next highest-value research gaps

1. Define a **real SB catalog taxonomy** and test whether categories remain mutually understandable as the capability count grows.
2. Prototype conceptually the transition `Inventory -> Map -> Graph -> Inspector` and specify the shared selection/focus contract.
3. Compare catalog behavior at approximately 20, 100, 500 and 2,000 items: grid density, list fallback, search, virtualization and ranking.
4. Research adaptive ranking vs spatial stability: which regions may reorder and which must remain stable for learned navigation.
5. Reconcile `CatalogItem`, `FocusContext`, `System Slice`, `Lens`, `Workspace`, `View`, `ViewportContext` and `DisclosureEnvelope` into one non-overlapping projection vocabulary.
6. Continue the primitive-base matrix, especially Grid/List/Combobox/Tabs/Tooltip/Popover/Dialog/Resizable/Tree and keyboard collection behavior across Base UI, Radix and React Aria.
