# G4 — Frontend Workspace & Componentization Research

Status: `RESEARCH_ACTIVE / NON_EXECUTABLE`
Execution authority: NONE
Date: 2026-09-22

> NOTE: Existing findings F1–F27 and the C0–C11 complexity ladder remain authoritative research context. This revision records the next material delta: focus/navigation ownership across a dockable shell. Historical source/evidence sections remain available in Git history and sibling research artifacts.

## Research delta — Focus Routing & Visibility Contract

### Problem

The stable shell now contains several independently interactive composites: Ribbon, Tool Rail, WorkSurface, Inspector/PanelDock, Status/Activity, command palette, Module Workbox faces and accessible peer projections. Existing research distinguishes `SELECTED != FOCUSED`, but it did not yet define who owns focus when selection is preserved across panels, workspace switches, projection handoffs, camera/LOD changes, dialogs or responsive panel collapse.

This is a material gap because semantic continuity can succeed while keyboard continuity fails: the same canonical object may remain selected but the DOM focus can land on a removed node, hidden panel, stale projection proxy or body/root after a transition.

### Evidence

Primary accessibility evidence reviewed in this round:

- W3C WCAG 2.2, SC 2.4.11/2.4.12: author-created sticky/floating UI must not obscure the focused component; user-movable content has a specific conformance qualification, but initial layout still matters.
- WAI-ARIA APG keyboard-interface practice: a composite normally contributes one tab stop; once inside, internal navigation uses the composite's established keyboard grammar. Re-entry commonly restores the previously focused or selected item.
- WAI-ARIA APG Treegrid: focus movement and selection are distinct operations, reinforcing the existing G4 invariant `SELECTED != FOCUSED`.
- Native HTML modal-dialog semantics make the rest of the document inert while modal; `inert` suppresses interaction/focus and assistive-technology traversal. Therefore a panel that merely *looks* modal must not accidentally behave as a non-modal dock, and vice versa.

### F28 — Focus is a routed workspace resource, not a side effect of selection

Candidate research contract:

```text
FocusRoute
  semanticTarget?          // canonical identity when focus represents an object
  surfaceId                // ribbon/toolrail/worksurface/inspector/status/dialog/peer-view
  compositeId?
  localFocusKey?           // stable key inside the composite, never canonical identity
  reason                   // pointer | keyboard | command | handoff | restore | recovery
  returnAnchor?
  revision/currentness?
  visibilityDisposition
```

Rules:

```text
selection change MAY request focus movement
selection preservation MUST NOT require focus preservation
focus movement MUST NOT mutate canonical selection unless the command grammar says so
camera movement MUST NOT steal DOM focus
LOD aggregation MUST preserve a valid focus representative or transfer focus explicitly
panel collapse MUST transfer focus to a declared return anchor
workspace/projection handoff MUST resolve both semantic target and focus destination
```

`FocusRoute != SelectionContext != ProjectionHandoff`, but ProjectionHandoff may carry a FocusRoute/return-anchor request.

### F29 — Every composite surface needs an explicit focus-entry/focus-exit policy

Candidate shell matrix:

| Surface | Entry | Internal navigation | Exit/close |
|---|---|---|---|
| Ribbon | one tab stop / remembered command group | arrow-key grammar per chosen ribbon pattern | return to invoking surface or next shell region |
| Tool Rail | remembered tool or selected tool | arrow keys | WorkSurface anchor when tool invocation moves task focus |
| WorkSurface 3D/2D/Graph | semantic viewport anchor, not every rendered object in global tab order | surface-specific keyboard navigation | shell region / Inspector / peer representation |
| Inspector | selected-object heading/first meaningful control, not unconditional autofocus | normal form/composite grammar | return to selected object's surface representative |
| Module Workbox | active applicable face | tabs/tree/face-local grammar | ModuleNode/Inspector return anchor |
| Command Palette | modal or explicitly non-modal semantics, never ambiguous | listbox/command navigation | invoker return anchor |
| Accessible Tree/Treegrid/List peer | selected semantic identity when representable | APG-compatible grammar | WorkSurface semantic anchor |

This avoids a large-scene anti-pattern where hundreds or thousands of Canvas objects become top-level tab stops.

### F30 — Cross-projection navigation needs a two-phase handoff: semantic resolution then focus materialization

Candidate sequence:

```text
Open in Workflow/Data/Capability/Deployment/Infra/Evidence
  1. capture ProjectionHandoff + ReturnAnchor
  2. resolve canonical target in destination projection
  3. materialize PRESENT / AGGREGATED / FILTERED / NOT_MATERIALIZED / STALE / NO_LONGER_ADMISSIBLE
  4. choose destination focus representative
  5. ensure representative is visible and not obscured
  6. move DOM/accessibility focus
  7. announce disposition when representation differs from source
```

A semantic target may be represented by an aggregate cluster at current LOD. Focus may legitimately land on that aggregate **only if** the UI communicates that the selected canonical object is inside the aggregate and offers deterministic reveal/detail navigation.

`Aggregated focus representative != canonical object replacement`.

### F31 — Docking, sticky Ribbon/Status bars and responsive collapse create a Focus-Not-Obscured proof obligation

The Office-style shell intentionally introduces sticky/docked regions. WCAG 2.2 specifically calls out sticky headers/footers and non-modal overlays as risks to visible focus. Therefore responsive/density testing cannot stop at “all commands remain reachable”. It must verify:

```text
focused target visible after:
  Ribbon expand/collapse
  Inspector open/resize/dock
  Tool drawer open
  Status/Activity expansion
  command palette/dialog close
  viewport pan/zoom
  semantic zoom/cluster expansion
  responsive panel replacement
```

Candidate shell behavior: when layout changes would completely obscure the focused representative, the owning surface must reveal/scroll/pan to it or move focus to an explicit visible anchor without altering semantic selection.

### F32 — Fatal WorkSurface recovery must restore three independent continuities

Existing recovery research preserves draft/semantic state. The UI additionally needs:

```text
RecoveryEnvelope
  DraftRecoveryRef
  SelectionContext
  ProjectionHandoff/current workspace context
  FocusReturnAnchor
```

Recovery order:

```text
restore recoverable draft
-> requalify revision/currentness/authority
-> materialize projection
-> restore semantic selection if still admissible
-> resolve visible focus representative
-> restore focus
```

If the previous representative no longer exists, focus goes to the nearest declared recovery anchor and the user receives a non-success disposition. Never silently focus a different semantic object.

### F33 — `Componentes` needs focus-route scenarios above primitive level

Add research metadata candidates for C2+ components:

```text
focusEntryPolicy
focusExitPolicy
returnAnchorPolicy
focusVsSelectionPolicy
obscurationRisks[]
projectionFocusMapping?
aggregationFocusMapping?
recoveryFocusPolicy?
```

Proof depth by complexity:

```text
C1 primitive
  visible focus + keyboard operation
C2 composite
  single-tab-stop/internal navigation + re-entry
C5 Module Workbox
  face switch/applicability + focus restoration
C6 tools
  panel open/close/dock/resize + return anchor
C7 WorkSurface
  semantic navigation + LOD/aggregation focus mapping
C8 workspace
  cross-region focus routing + sticky/docked obscuration
C9 task page
  async/dialog/error/recovery focus continuity
C10 system view
  cross-workspace ProjectionHandoff + alternate-representation focus continuity
```

### Complete-task scenario additions

```text
S-FR-01
select Module A in 3D
-> open Inspector
-> edit
-> close Inspector
=> Module A remains selected; focus returns to a visible Module A representative or declared viewport anchor

S-FR-02
focus relation candidate
-> semantic zoom aggregates neighborhood
=> relation identity remains selected; focus moves to qualified aggregate representative with reveal path

S-FR-03
Open in Deployment
-> target is FILTERED_OUT
=> selection identity preserved in handoff; focus lands on visible disposition/reveal control, not an unrelated deployment object

S-FR-04
Ribbon expands while keyboard focus is near top of WorkSurface
=> focused control/object is not completely obscured

S-FR-05
fatal 3D renderer failure while Module A draft is dirty
-> fallback Treegrid materializes
=> draft preserved; Module A semantic selection preserved if admissible; focus resolves to Module A peer row or recovery anchor

S-FR-06
modal authorization closes after rejection
=> focus returns to invoker/qualified replacement; rejection does not mutate to DISABLED or SUCCESS
```

### Adversarial additions

1. Camera transition steals focus from Inspector input.
2. Inspector closes and focus falls to `body` while selection remains hidden in 3D.
3. LOD removes the focused object without explicit focus transfer.
4. Aggregate receives focus and is announced as though it were the canonical object.
5. Sticky Ribbon or Status bar completely covers focused Canvas peer control.
6. Workspace switch restores selection but focuses a different semantic identity.
7. Modal-looking panel leaves background keyboard-operable, or non-modal Inspector makes the workspace inert.
8. Fatal renderer recovery restores data but loses keyboard position/context.

## Complexity impact

This finding does **not** add a new complexity class. It introduces a cross-cutting dependency from C2 upward:

```text
C0/C1 visual + primitive focus semantics
  -> C2 composite keyboard grammar
  -> C3 identity/selection/projection contracts
  -> FocusRoute / ReturnAnchor qualification
  -> C5/C6 module + tool focus composition
  -> C7 WorkSurface semantic focus mapping
  -> C8 workspace routing/obscuration proof
  -> C9/C10 recovery and cross-workspace proof
```

The important planning consequence is that focus routing cannot be postponed to final accessibility polish; it becomes structurally expensive if added only after docking, WorkSurface switching and ProjectionHandoff are frozen.

## Maturity / next vector

Material delta: **YES**.

This round closes one previously implicit gap: semantic continuity and keyboard continuity are now modeled as related but independent concerns. Remaining high-value vectors include command concurrency/cancellation across shell regions, multi-selection focus behavior under aggregation, and announcement strategy for async/currentness/conformance changes without notification overload.
