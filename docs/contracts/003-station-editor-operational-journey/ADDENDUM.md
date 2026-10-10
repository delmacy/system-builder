# Contract Addendum 003 — Station Editor Operational Journey

Date: 2026-10-10
Status: ACCEPTED ON VALIDATED PLANNING INTEGRATION
Admission source: maintainer request to advance to the next package after WP1 closure, following the recorded candidate priorities of admitted compositions and Station navigation.
Predecessor: WP1 CLOSED through PR #1034, main@1c2625acacf2e161e388b031026da3766a84902d.
Effect: extends Station editor usability; does not change Core, persistence or runtime authority.

## Admitted bounded increment

Move beyond the fixed WP1 example to a reusable Station composition editor: select validated source-owned compositions from a bounded catalog, edit through the existing session APIs, safely switch sessions, and open the workbench through an ordinary Station app/window/launcher. Reuse existing C0–C9 descriptors and actual composition graphs, including the Station ButtonGroup grammar. Catalog entries are source-owned admitted definitions, not user files or external arbitrary JSON.

WP2 outcome: launch the editor from Station; choose an admitted catalog composition; inspect/edit its hierarchy and spans; observe the same Preview; save/discard Station-local state; minimize/restore without losing that window's draft; refuse unsafe or unknown input and unsafe switching.

## Boundaries

One canonical Station-owned EditorSession per active editing context. Layers/Inspector/Preview are projections; focus/selection/expansion/window lifecycle remain distinct. Unknown/invalid catalog refs or incompatible graphs reject before replacing a session. Dirty switching requires explicit cancel or discard; do not silently save or discard. Clean switching starts a fresh source-owned session and is not durable retention of the previous accepted result.

Use existing Station app/window contracts, no new shared-schema authority or business command. Span limits come from admitted registry descriptors. Render admitted hierarchy rather than fabricating unrelated display layers. Station preferences/window layout storage must never serialize editor graphs or imply durable saving.

## Proof and completion

Positive journey through actual production UI, real predecessor APIs, catalog-switch cancellation/discard, invalid reference and compatibility cases, keyboard/focus, span boundaries for multiple descriptors, and minimize/restore/close lifecycle must be proven. WP1 seven-test regression stays intact. Exact-head and current merge-candidate verify, heavy/handoff, Station builds and browser evidence/artifacts remain gates.

## Explicitly deferred

External files/project import, arbitrary untrusted JSON, Core/business/server authority, durable composition persistence, network providers, deploy/publish/secrets, specialized Studios, arbitrary HTML/CSS/free pixels, AI/MCP authoring and C10. A user testing/deployment environment is not implicitly deployed by this increment; document local production-run instructions and CI proof only.
