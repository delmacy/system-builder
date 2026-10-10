# G4 — UI Interaction State Matrix Research

Status: `RESEARCH_ACTIVE / NON_EXECUTABLE`
Execution authority: NONE
Date: 2026-09-22

## Purpose

Define a cumulative interaction-state model for the System Builder frontend, starting with the smallest primitives and scaling through components, blocks, tools, workspaces and complete operational pages.

The target is not merely visual consistency. Every reusable UI artifact must have explicit, reproducible and testable states, transitions and failure modes.

```text
Primitive state
  -> component state
  -> block state
  -> tool state
  -> workspace state
  -> page/task state
```

A complete page must be understood as a composition of lower-level states rather than a separate visual artifact.

## Core rule

`Visual variant != interaction state != semantic state != operational state`.

Examples:

```text
outline     = visual variant
hover       = interaction state
invalid     = semantic validation state
stale       = evidence/currentness state
degraded    = operational state
blocked     = workflow/authority state
```

These dimensions may coexist and must not be collapsed into a single `status`.

## State families

### A. Pointer / direct manipulation

```text
idle
hover
pressed
drag-start
dragging
drag-over-valid
drag-over-invalid
drop-pending
dropped
context-menu-open
resizing
panning
zooming
```

### B. Keyboard / focus

```text
focus
focus-visible
focus-within
roving-focus
keyboard-selected
shortcut-armed
shortcut-conflict
focus-restored
focus-lost/recovered
```

Focus and selection remain independent.

`Focused != selected != active != checked`.

### C. Selection

```text
unselected
selected
multi-selected
primary-selection
range-selected
partially-selected
indeterminate
selection-disabled
```

### D. Availability / authority

```text
enabled
disabled
read-only
hidden-by-context
unavailable
permission-denied
authority-pending
policy-blocked
unsupported
incompatible
```

A disabled control must not be used as the sole explanation for unavailable behavior. Where useful, the interface should expose why an action is unavailable.

### E. Async / execution

```text
idle
queued
pending
loading
streaming
processing
saving
syncing
reconciling
retrying
waiting-external
waiting-human
cancelling
cancelled
success
failed
timed-out
unknown-outcome
```

`ACK != effect`; therefore a UI may need to distinguish request accepted from effective result.

### F. Data / content

```text
uninitialized
empty-first-use
empty-filtered
empty-no-access
empty-not-applicable
partial
loaded
stale
refreshing
offline-cached
conflicted
superseded
unknown
error
```

Empty states are typed; `no records exist` is different from `filter returned none` or `records cannot be disclosed`.

### G. Validation / editing

```text
pristine
dirty
validating
valid
invalid
warning
conflict
autosaving
saved
save-failed
external-change-detected
merge-required
undo-available
redo-available
```

### H. Expansion / visibility

```text
collapsed
expanded
opening
closing
hidden
visible
isolated
dimmed-context
pinned
unpinned
docked
floating
fullscreen
```

### I. Lifecycle

```text
experimental
candidate
stable
deprecated
superseded
retired
```

This lifecycle describes UI artifacts, not business object runtime status.

### J. System Builder qualified semantic overlays

Research candidates:

```text
candidate
observed
effective
partial
unknown
stale
conflicted
blocked
superseded
degraded
reconciling
unverified
```

These must be visually encoded through more than hue alone.

## State progression by composition level

### L1 primitive

Example: Button

Minimum research matrix:

```text
default
hover
focus-visible
pressed
disabled
loading
destructive
loading+disabled if meaningful
permission-blocked presentation
```

A loading button must define whether repeated activation is suppressed, what happens to width/layout, how progress is announced and where focus remains.

### L1 input

Example: Input

```text
empty
filled
hover
focus
disabled
read-only
validating
invalid
warning
valid
autocomplete-open
no-results
loading-options
external-update
```

### L2 pattern

Example: Search / Filter Bar

```text
idle
typing
debouncing
searching
results
no-results
partial-results
stale-results
error
offline
permission-filtered
filters-dirty
filters-applied
filters-invalid
```

### L2/L3 data collection

Example: DataTable / Tree / Inventory

```text
initial-loading
loaded
empty
filtered-empty
partial
selection
multi-selection
sorting
filtering
pagination/loading-more
row-hover
row-focus
row-expanded
inline-edit
bulk-action-pending
bulk-partial-success
refreshing
stale
error
permission-limited
```

### L3 block

Example: EntityForm

```text
loading-record
create
edit-pristine
edit-dirty
validating
validation-errors
saving
saved
save-error
server-conflict
external-revision-changed
read-only
permission-limited
offline-draft
reconcile-required
```

### L4 module component

Example: SchedulingBoard

```text
loading
ready
no-resources
partial-availability
dragging-assignment
valid-target
invalid-target
capacity-conflict
authority-blocked
save-pending
optimistic-candidate
confirmed
rollback
stale-source
live-update
connection-degraded
```

### L5 tool/workspace

Example: Workflow Workspace

```text
cold-open
loading-definition
ready
empty/new
selection
multi-selection
connecting
connection-valid
connection-invalid
dragging-node
editing-properties
dirty-draft
autosaving
saved
validation-running
validation-failed
simulation-running
simulation-result
proposal-pending
authorization-pending
publish-pending
published
revision-drift
merge-conflict
read-only
offline
degraded
fatal-error
recovery
```

### Complete work page

A complete task page must define states for the page shell as well as contained tools.

Candidate page-level dimensions:

```text
data availability
user authority
editing mode
network/runtime availability
background jobs
selection/focus
current revision
currentness
unsaved work
external changes
blocking errors
recoverable warnings
empty content
partial content
responsive/density mode
```

This avoids the anti-pattern of designing only the ideal loaded state.

## Componentes page requirements

The mandatory **Componentes** inventory must expose the state model directly.

For each reusable artifact:

```text
Overview
Variants
Interaction states
Semantic states
Async states
Failure states
Accessibility
Responsive
Dark/light
Reduced motion
Composition lineage
Used by
Tests/evidence
```

### State matrix view

Candidate UI:

```text
Component: Button

                Default  Hover  Focus  Pressed Disabled Loading
Primary            ✓       ✓      ✓       ✓       ✓       ✓
Secondary          ✓       ✓      ✓       ✓       ✓       ✓
Outline            ✓       ✓      ✓       ✓       ✓       ✓
Ghost              ✓       ✓      ✓       ✓       ✓       ✓
Destructive        ✓       ✓      ✓       ✓       ✓       ✓
```

For complex components the matrix may use scenarios rather than a Cartesian product to avoid meaningless combinations.

### Transition view

Complex interactive elements should expose important transitions:

```text
idle
  -> pending
  -> success

idle
  -> pending
  -> failed
  -> retrying
  -> success

dirty
  -> saving
  -> conflict
  -> reconcile
  -> saved
```

### Interaction playback

Research whether Componentes should permit recorded interaction scenarios:

```text
Open dialog
Type invalid value
Submit
Observe validation
Correct value
Submit
Observe success
```

This can become design review + regression evidence rather than a screenshot gallery.

## External evidence already established

Initial primary-source research shows:

- shadcn has explicit patterns for loading via Spinner, Skeleton, compositional Empty states, collapsible Sidebar state and command empty/search behavior;
- Storybook models stories as reproducible component states and supports browser-run interaction tests through play functions;
- Storybook visual testing treats each isolated state/scenario as a regression target;
- WAI-ARIA APG explicitly distinguishes focus from selection and defines keyboard/focus behavior for buttons, dialogs, toolbars, tabs, grids, trees and treegrids;
- Radix delegates substantial accessibility behavior such as roles, keyboard navigation and focus management to primitives, but composition still needs application-level interaction semantics.

These findings support treating state definitions as first-class component contracts.

## Research sequence

The recurring UI research should move deliberately upward:

```text
R1 TOKEN STATES
  focus ring / selected / warning / pulse / disabled etc.

R2 PRIMITIVES
  buttons / fields / controls / overlays

R3 PATTERNS
  search / filters / forms / tables / tree / navigation

R4 BLOCKS
  entity forms / inspectors / activity panels / cards

R5 MODULE COMPONENTS
  scheduling / helpdesk / asset / data / workflow components

R6 TOOLS
  frontend builder / workflow builder / data modeler

R7 WORKSPACES
  complete shells and multi-panel interaction

R8 COMPLETE TASK PAGES
  create/edit/review/operate/audit flows

R9 CROSS-WORKSPACE
  identity continuity / handoff / navigation / revision drift
```

Do not promote a level while lower-level interaction semantics remain undefined for the states it depends on.

## Adversarial cases to research

- hover-only action inaccessible to keyboard/touch;
- selected state visually indistinguishable from focus;
- loading button allows duplicate side effect;
- optimistic success shown before effect verification;
- empty state hides an authorization problem;
- stale data rendered as current;
- background refresh erases local dirty state;
- dialog closes and focus is lost;
- responsive collapse removes an action entirely;
- drag-only workflow cannot be operated without pointer;
- failed partial bulk action is shown as whole success;
- live update changes the selected revision during edit/review;
- component enters state combination not represented in Componentes;
- disabled control has no discoverable reason;
- skeleton visually implies fields the user is not authorized to see;
- tool/workspace fatal error destroys recoverable unsaved work;
- switching workspace loses selection/identity context;
- dark theme or reduced-motion changes semantic meaning;
- async cancellation is displayed as completed while effect remains unknown.

## Proof obligations

1. Every interactive reusable component has an explicit state/scenario inventory.
2. Focus, selection, activation, authority and semantic status are distinguishable.
3. Async states do not imply effect completion without evidence.
4. Empty/error/partial/stale/unknown are not collapsed.
5. Required interactions have keyboard-accessible equivalents.
6. Reduced motion preserves full meaning.
7. Componentes can reproduce material states and transitions.
8. Complex page states are composed from lower-level contracts and page-level orchestration semantics.
9. Visual regression covers material states, not only happy-path defaults.
10. Interaction tests cover important transitions and recovery paths.
11. State combinations known to be invalid are explicit rather than accidentally renderable.
12. Responsive behavior preserves action reachability.
13. External revision/currentness changes are represented rather than silently overwriting local work.
14. Workspace/tool errors preserve recoverable user state when feasible.
15. Generated systems carry only the state machinery required by their component dependency closure, subject to shared primitive contracts.

## Working conclusion

The System Builder UI catalog should eventually answer not only:

`What components exist?`

but also:

`What can each component become, how does it transition, how does it fail, and how does it recover?`

That turns **Componentes** from a visual inventory into an executable interaction specification surface.
