# Addendum 007 — Station bounded button text authoring
Date: 2026-10-11 UTC
State: ACCEPTED via #1065; bounded WP7 CLOSED effective only on validated TASK-676 closure integration
Source: owner asked to plan and execute the next WP after discussion of component properties.

## Scope
WP7 edits plain display text on the two installed button descriptors component:button and component:lab-button. Optional CompositionNode.text is inert presentation data, never identity, action, HTML or business authority. Non-root only; 1–256 Unicode code points, nonblank, no control characters. Omission uses existing catalog display labels. UI provides Apply text and Reset text; reset removes the override. Layers, Inspector and Preview share the same graph; selection remains ref-based. Span/structure/text share the existing bounded ephemeral history, revision/dirty/checkpoint lifecycle. Pending inspector fields block history/structure/save/export until applied or restored; explicit discard resets pending fields. Opening/switching warns for pending fields and dirty drafts.

## Explicit L3 compatibility increment
Add optional text to composition node contract; no architecture boundary change. Portable payload 3.0.0 admits validated button text and existing authored topology. Read v1/v2 unchanged and reject text fields in those versions. Emit v3 only if some node has text; otherwise existing v1/v2 selection. V3 readers also accept a valid graph with no override; writers still select the oldest adequate schema. Old readers reject v3. ADR-0009 envelope remains unchanged. Limits, source root/registry/revision authority remain unchanged.

## Proof
Real installed catalog -> text intent -> mixed history -> save/discard -> v3 strict file/local round trip -> fresh session. Negative stale/foreign/root/nonbutton/unknown keys/blank/control/overlimit/version/tampering/overflow must retain prior state. Literal markup is rendered as escaped text. Preserve all 37 browser journeys; add text/undo/redo/reset/discard/file/local/pending/keyboard/window proof.

## Exclusions
No new descriptors, generic properties, styles, actions, reparenting, persistent history, File Manager, Studio, Core, server, sync, deploy or dependencies. Bounded WBS21.2.1/21.2.3/21.3.1/21.3.2 only.

## Supersession and delivery traceability
This increment supersedes Addendum006 fixed node-field/producer-version constraints only for admitted display text. All root/registry/revision/structure/history/boundary obligations remain. No generic properties or action semantics enter through text. Preview may use one-line ellipsis within the fixed grid; full text remains in title and accessible name, Layers and Inspector.
Planning#1065, engine#1066, workbench#1067 and Review#1068 integrated. B final head02b2d0c2a7e6db75f09f075fc687ddaa16606434:98 editor tests,44 actual Chromium journeys39.8s, seven workflows/Windows-Ubuntu/frontend quality PASS. Review44 journeys34.1s/five workflows PASS. Closure report project_docs/execution_planning/STATION-S4-WP7-DOCUMENTATION-CLOSURE-01.report.md governs bounded closure on its independent validated integration.
