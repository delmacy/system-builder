# Addendum010 — Station compatible reparenting
Date: 2026-10-11 UTC
Status: ACCEPTED via Planning#1081; bounded WP10 CLOSED effective on validated TASK691 integration
Admission: owner requests WP10 completion and a small Station demonstration video after WP9#1080.

## Admitted scope and semantics
Extend EditorStructureIntent with reparent-node {nodeRef,parentRef,slotRef}, bound to expected
session/composition/draftRevision. Move only installed non-root nodes between existing compatible
containers/slots. Preserve node identity, component identity, spans, text/properties, descendant
placement and complete graph array order. Destination sibling order derives from existing array
order; existing sibling reorder remains separate. Moving a container carries its unchanged subtree.
Same parent/slot is a no-op: same session/history/revision, redo preserved. Changed move is atomic,
one revision/history entry, existing selection retained. Existing 50-entry mixed history/checkpoints.
Full candidate admission before mutation: installed refs/family/layout/slot/cardinality, connected
rooted acyclic graph, source root, discrete spans, bytes/nodes/depth/token limits. Reject root,
self/descendant cycles, atomic/unknown/incompatible/occupied targets, stale/foreign/malformed intents,
overflow and exceeded caps with no partial graph/history mutation. No caller objects retained.

## Workbench
Destination container and slot controls with Move component. Pending Inspector fields/replacement
protect movement. Applied selected identity remains, destination ancestors expand to expose it.
Explicit feedback for rejected/no-op moves; native keyboard selects/button, narrow and Station
window lifecycle remain supported. No free drag/pixel layout or new descriptor/property families.

## Portable compatibility and boundaries
No graph field or envelope change. Existing exact payload1/2/3/4 producer chooses minimal admitted
schema; moved topology uses existing v2 (or v3/v4 when fields require). Previous payloads readable,
strict source identity/revision/root/caps and artifact version/provenance rules unchanged.
Station remains presentation-only. This L3 intent increment changes no architecture boundary/L4;
ADR0009 and installed grammar reused. No new ADR required.

## Proof and deliverable
Real leaf and subtree moves, all owning projections, mixed undo/redo/no-op/checkpoint, rejected
cycles/typed slots/foreign/stale/hostile fields, portable/local fresh-session reopen, negative
import preservation, pending recovery, keyboard/narrow/shell. Retain all55 preceding journeys.
Record short actual browser demo through shell/editor/move/undo/redo/save/reopen, with presentation
captions in test harness only. Deliver video after validated package closure; no staged fake UI.

## Exclusions
Cross-composition move/copy, templates insertion, user/remote catalog, actions/arbitrary CSS,
File Manager/revisions/process/Studio/Core/server/sync/deploy. Only bounded WBS21.2.1/21.2.3/
21.3.1/21.3.2 slices; no whole-WBS/ComponentEditor/S4 completion.

## Delivered bounded outcome and compatibility clarification
Planning#1081/engine#1082/workbench#1083/Review#1084 implement the admitted goal; own closure
must independently pass and integrate.121 editor cases in construction,151 combined editor/
composition cases in review and61 actual Chromium journeys, seven construction gates and
Windows/Ubuntu/frontend quality proof. Video is recorded actual UI, not a mocked product.
Inherited depth32 is JSON object/array nesting. Graph ancestry is represented by flat references,
limited by node cap256 and full connectivity/cycle validation; no32-ancestor limit is introduced.
Existing strict payload1/2/3/4, ADR0009 envelope and registry/caps/history authority remain.
