# Addendum008 — Station bounded button properties
Date: 2026-10-11 UTC
Status: ACCEPTED effective on validated WP8 Planning integration
Admission: owner explicitly authorized integration of forecast and execution of WP8.
Predecessor: WP7 integrated through #1069; remaining-scope forecast #1070.

## Admitted scope and ownership
Only installed non-root component:button and component:lab-button receive optional `properties`.
The exact inert shape is {variant: "default" | "outline" | "ghost", disabled: boolean}.
Both fields are required when the object exists; omission restores source presentation (default/false).
No unknown keys, symbols, accessors, arrays, null, partial objects or coercion. Plain data only.
Disabled is preview presentation, not business availability, authorization or an executable action.
Set-properties/reset-properties are atomic expected-revision/session/composition-bound intents,
reusing existing 50-entry ephemeral mixed history and checkpoint lifecycle.
Properties are independently resettable; text and placement survive. Applying an identical object
is a no-op that preserves redo. Snapshots deep-copy/freeze properties without mutating caller data.
Layers/Inspector/Preview/responsive projection carry the same admitted fields.

## Portable compatibility
Producer emits payload4.0.0 when any node owns properties. Otherwise minimum existing v1/v2/v3.
Reader accepts exact1/2/3/4; v4 allows omission of properties and text. Earlier payloads reject
properties explicitly. Unknown versions/fields fail closed; artifact identity, envelope and source
revision rules remain ADR0009/WP3. Property-only edits change artifact version on retention.
No automatic migration or loss, no credentials, scripts, CSS or remote catalogs.

## Workbench and proof
Inspector enum select and checkbox with Apply properties/Reset properties; Restore fields reverts
pending input. Pending property fields protect selection, size/text edits, history, retention,
structure and composition/file replacement using explicit apply/restore/cancel/replace behavior.
Preview displays variant and disabled styling/data semantics but executes no actions.
Prove valid enum/boolean, no-ops, resets, invalid/root/container/unknown/stale/foreign inputs,
nested hostile descriptors, alias mutation isolation, mixed history, strict versions, all owning
projections, local/file fresh-session round-trip, pending recovery and keyboard/focus behavior.

## Boundaries and exclusions
Station remains presentation-only; no architecture boundary changed, no L4/ADR needed.
No new component family, arbitrary properties/styles, actions, reparenting, server/sync/storage
provider, persistent history, generic File Manager/Studio, Core commands or deployment.
This increments only bounded21.2.1/21.2.3/21.3.1/21.3.2 slices; no whole-WBS/S4 completion.
