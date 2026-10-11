# Addendum 014 — Station shared model projections
Date: 2026-10-11 UTC
Status: ACCEPTED via Planning#1101; whole-WP14 implementation authorized 2026-10-11.
Admission: owner requests WP13 closure and WP14 planning. This admits a bounded planning
increment. Subsequent owner instruction explicitly authorizes bounded whole-WP14 implementation,
including Review/Closure after independently validated predecessors.

## Outcome and boundary
Extend the accepted WP13 reference-context slice with reusable Explorer/Inspector projections,
a source-owned capability registry and one context-qualified presentation selection.
WBS 21.1.3 and reference-inspection portions of 21.2.1/21.2.2; R.3.2 of the remaining-scope EAP.
L3 presentation API admission is explicit here. ADR-0009/0017 and Station/Core ownership remain
unchanged; no new L4 boundary, business semantic owner or public owner schema.

## Bounded projection contract
One admitted context is the existing decoded ProcessContextDocument. Validate through its actual
codec; never maintain a second canonical document or substitute fixture-only data.
Install exactly two source-owned descriptors: context-outline and reference-table. Both use the
same process-anchor item and the same authored composition-reference items (at most 17 items).
Outline groups the existing references beneath the read-only anchor; table presents equivalent
identity, title, revision and status fields. No domain graph, workflow or business model is inferred.
An item key must unambiguously encode context artifactType/id/version, item kind and authored view
ref; anchor keys include the complete normalized process revision identity. Titles, indexes,
storage file refs and renderer identity never determine logical selection.
Two views may refer to the same composition and still remain distinct by authored view ref.
Reuse station-interaction collection/selection primitives, without changing their public contract.
One validated model drives Explorer, Inspector and active projection. Selecting a known item updates
all surfaces. Unknown or cross-context selection rejects without changing state. Switching either
installed projection preserves the selection; unknown projection rejects. Empty views remain valid.
Refresh resolution preserves known selection even if a reference becomes unresolved; Inspector
then reflects the failure and request-open is blocked. Context replacement clears selection and
obsolete asynchronous results; equal validated unchanged context may retain it. Never leak a
previous context's selection into another revision. Selection/projection choice remain ephemeral.

## Capabilities and trust
Registry descriptors are source-owned inert identifiers/labels, not user-imported renderers/scripts,
URLs, commands or authorization. Duplicate/unknown descriptor IDs and unsupported capability claims
reject explicitly. Inspector is read-only metadata/status for anchor or reference.
inspect is available for known admitted items. request-open-composition is a presentation handoff
only for an exact available composition reference. Anchor has no business edit/open capability.
Cached availability is never sufficient: re-resolve with existing WP13 workspace adapter before
ordinary editor handoff, retaining its dirty/unapplied Cancel/Discard guards. Missing/stale/invalid/
unavailable stays explicit; no fallback to latest, auto-fetch, execution, authorization or fabricated
semantic availability. Process owner remains unavailable without a real owner adapter.

## Compatibility and lifecycle
No envelope, context payload, composition payload, workspace schema/key, provenance or storage
migration. Existing import/export/save/reopen and independent parts remain unchanged.
Implement bounded reusable pure model APIs in packages/station-model-projections; the host supplies
actual validated reference resolution. UI uses existing ui-core and Process Context route/window.
Minimize preserves mounted selection; close/reload starts empty selection after explicit reopen.
No new timers/background polling, global singleton selection or persisted presentation metadata.
Caps remain 1 MiB/32 JSON depth/16 views/ref256/title80; model derives at most 17 items, two descriptors.
WP13-L1/L2/L3/D1 and inherited storage/performance/accessibility limits remain; no new latency guarantee.

## Proof and exclusion
Real editor/codec -> WP12 two immutable revisions -> WP13 create/encode/decode/local/file reopen ->
two shared projections -> same selected identity/Inspector -> exact ordinary editor handoff.
Include duplicate titles, two refs to same tuple, context revision replacement, 0/16/17 views,
malformed/unsafe/unknown descriptors and selections, changed/missing/stale/corrupt/unavailable storage,
keyboard/narrow layout and dirty handoff cancellation. Preserve all 82 predecessor browser journeys.
No semantic authoring, generic arbitrary schema editor, remote registry, C10/Studio, live service,
Core/server/host, collaboration/CAS, runtime/deploy or whole WBS/H3/S4 certification.

## Construction disposition
A#1102 integrated after seven workflows PASS; existing context API alias added for unchanged package
architecture gate. B adds shared Explorer/Inspector/two projection surfaces over one actual A state;
host document and status derive from that state, with fresh exact opening and existing dirty protection.
No codec/key/public owner schema change. B requires complete independent gates before integration.
