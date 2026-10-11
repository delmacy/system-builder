# Addendum 006 — Station bounded structural authoring
Date: 2026-10-10
State: ACCEPTED via #1055; bounded WP5 CLOSED effective on validated TASK-666 closure merge
Source: owner explicitly authorized WP5 after proposal to add/remove/reorder installed components with save/open/history integration.

## Admitted scope and explicit supersession
Station presentation-only composition authoring within the installed source-owned registry. Add a node under a chosen existing parent/slot with descriptor-recommended spans; remove a non-root subtree atomically; reorder siblings within the same parent/slot. Preserve root ref/component identity. No reparenting, external registry, arbitrary code, business commands, free drag, new dependency or Core authority.
Node array order is the canonical sibling ordering; Layers and Preview preserve it. Nodes retain existing graph fields. Every command validates complete rooted acyclic graph, strict shapes/tokens, descriptor placement, single-child cardinality and inclusive codec limits before committing. Stale revisions/overflow/no-op/failure preserve prior state. Root cannot be removed/replaced.

This explicitly supersedes Addendum 005's fixed-topology history constraint for admitted structural commands: same 50-entry ephemeral graph history/checkpoint lifecycle, monotonic revisions and baseline dirty semantics. Selection is repaired to a surviving parent/root after removal/undo/discard; text pending blocks structural commands. Native input undo remains separate.

## Portable compatibility — declared L3 increment
ADR-0009 envelope remains unchanged. Payload schema 1.0.0 retains exact source topology/order semantics and remains readable. New schema 2.0.0 admits bounded authored graph/order while retaining exact application/composition/baseRevision, installed registry and source root ref/component. Producers emit 2.0.0 for changed topology/order, otherwise 1.0.0; consumers reject all other schema versions. No silent migration of unchanged artifacts; metadata/version allocation remains caller-owned. Old readers reject 2.0.0 explicitly. This declared payload compatibility increment changes no shared envelope or architecture boundary and needs no architectural replacement ADR.

## Proof and exclusions
Real catalog -> structural command -> history -> Layers/Inspector/Preview -> portable round trip -> fresh session; negative malformed/stale/root/cycle/cardinality/foreign component/version/budget proof. Browser actual add/remove/reorder, undo/redo, checkpoint/discard, file/local reopening, cancellation/failure, narrow/keyboard and Station window lifecycle; retain all 29 predecessor journeys.
WBS 21.2.1/21.2.3 and bounded 21.3.1/21.3.2 only. File Manager/.process/Core/server/sync/Studio/AI/publishing/deployment remain separately gated. No full Component Editor claim.

## Delivery traceability
Planning #1055, engine #1056, structural workbench/portable workflow #1057 and package review #1058. Closure report: project_docs/execution_planning/STATION-S4-WP5-DOCUMENTATION-CLOSURE-01.report.md. 37 actual browser journeys; all bounds, exclusions and v1/v2 rules above remain.

## Internal maintenance delivery traceability — WP6
The existing admitted behavior is preserved by WP6 history-validation maintenance: Planning #1060, engine hardening #1061, reproducible/bound proof #1062 and package review #1063. No new admission, payload/envelope/API/dependency or cap change. Retained internally produced immutable snapshots can reuse successful validation only with matching authority context; current/caller/mutable/changing-context data retains full validation. All acceptance/rejection/lifecycle obligations above remain. Complete paired evidence and non-guarantees are in the WP6 B/review reports. Bounded maintenance closure is effective only on validated TASK-671 integration; no wider authoring scope is promoted.
