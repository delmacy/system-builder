# Addendum 007 — Station bounded button text authoring
Date: 2026-10-11 UTC
State: proposed for acceptance through Planning PR integration
Source: owner asked to plan and execute the next WP after discussion of component properties.

## Scope
WP7 edits plain display text on the two installed button descriptors component:button and component:lab-button. Optional CompositionNode.text is inert presentation data, never identity, action, HTML or business authority. Non-root only; 1–256 Unicode code points, nonblank, no control characters. Omission uses existing catalog display labels. UI provides Apply text and Reset text; reset removes the override. Layers, Inspector and Preview share the same graph; selection remains ref-based. Span/structure/text share the existing bounded ephemeral history, revision/dirty/checkpoint lifecycle. Pending inspector fields block history/structure/save/export until applied or restored; explicit discard resets pending fields. Opening/switching warns for pending fields and dirty drafts.

## Explicit L3 compatibility increment
Add optional text to composition node contract; no architecture boundary change. Portable payload 3.0.0 admits validated button text and existing authored topology. Read v1/v2 unchanged and reject text fields in those versions. Emit v3 only if some node has text; otherwise existing v1/v2 selection. Old readers reject v3. ADR-0009 envelope remains unchanged. Limits, source root/registry/revision authority remain unchanged.

## Proof
Real installed catalog -> text intent -> mixed history -> save/discard -> v3 strict file/local round trip -> fresh session. Negative stale/foreign/root/nonbutton/unknown keys/blank/control/overlimit/version/tampering/overflow must retain prior state. Literal markup is rendered as escaped text. Preserve all 37 browser journeys; add text/undo/redo/reset/discard/file/local/pending/keyboard/window proof.

## Exclusions
No new descriptors, generic properties, styles, actions, reparenting, persistent history, File Manager, Studio, Core, server, sync, deploy or dependencies. Bounded WBS21.2.1/21.2.3/21.3.1/21.3.2 only.
