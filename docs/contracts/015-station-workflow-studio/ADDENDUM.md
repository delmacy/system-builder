# Addendum 015 — bounded technical Workflow Studio
Date: 2026-10-11 UTC
Status: planning admission, effective on validated Planning integration; construction not authorized.
Provenance: owner requests preparation of WP15 after WP14 closure and chooses technical flows
(states/transitions), rather than business-process discovery. L3 local draft API scope is explicit.
ADR-0009/0017, BusinessRecipe != SystemDefinition and canonical Core/domain authority remain unchanged.

## Outcome and ownership
One specialized Station workbench authors a local, unpublished SystemDefinition candidate.
Station owns disposable editing state and local candidate retention, never canonical business truth.
All Tools use one immutable draft/session revision and one command entry point; controls do not mutate
their own copies. Core-effecting commands must use SDK/Gateway in separately admitted WP16.
No compiler/runtime execution dependency or new canonical design service is created here.
A bounded C10 proof candidate is admitted: coordinated structural authorship, shared history/currentness,
new immutable candidate revision and reopen. Research DG10 remains unproven until actual package exit
evidence; this does not certify general C10, arbitrary models or the whole WBS.

## Existing grammar and local draft API
Reuse public system-definition schema/type/version exports and ADR0009 envelope. Preserve the complete
validated envelope and all nonedited payload fields, optional extensions, references and other processes.
The compiler runtime projection normalizer validates execution projections, discards authoring metadata
and sorts arrays; it is not a lossless authoring codec or owner service. Assembly/Validation likewise do
not offer this authoring API. Do not deep-import them or import test/harness validators.
Provide an additive packages/station-workflow-authoring public local draft API; validate schema plus
workflow referential rules deterministically without changing owner schema. Its results explicitly mean
local candidate validation only, not approved recipe, release validation, publication or execution.
Commands receive expected session revision; reject stale requests atomically. Successful commands create
one new immutable draft revision; rejected/no-op requests preserve document/history. Undo/redo is bounded
editing history, not business compensation. Materialize candidate only after complete local validation,
with explicit new artifact version, predecessor provenance and retained original revision.

## Bounded authoring
Import a complete existing SystemDefinition or create a source-owned starter with explicit analysis,
recipe and requirement references; starter references are unresolved until actual owners resolve them.
Select one existing process or add one with id/name/requirementRefs and at least one state. Other
entities/actions/processes remain read-only. Add/remove state; set initial state; add/edit/remove transition
id/from/to/optional actionRef. State rename is excluded. Removal of initial/referenced states rejects until
references are corrected through valid commands; no silent cascade. Last state removal rejects.
IDs are stable/unique in their declared scope. Initial/source/target must exist; actionRef must name a
declared action. Transitions require initialState. Cycles/self-loops are valid: do not impose DAG semantics.
Inputs are inert JSON; unknown required extensions/incompatible schemas fail before replacement.
Bounds: 1 MiB encoded artifact, depth32, selected process <=64 states/128 transitions, history<=50.
Reject oversized/incompatible input with recovery; never truncate or silently drop unsupported fields.
Draft candidate caps are product limits, not changes to SystemDefinition grammar.

## Workbench and lifecycle
Explorer, deterministic states/transitions diagram/table and editable Inspector share qualified selection
and the same draft. Reuse installed shell/window/interaction/ui-core primitives; WP14 context projection
model is reference-specific and cannot masquerade as a workflow model. Domain projection adapters are
additive. Tool visibility/diagram positioning are presentation-only and never change artifact semantics.
Show draft revision, base artifact tuple, dirty/validation/currentness and unresolved upstream status.
Create/import -> edit through coordinated Tools -> undo/redo -> validate -> save new local candidate ->
export/import/fresh-session reopen -> compare original/new revisions. Cancel dirty switch preserves draft.
Use a separately named bounded origin-local workflow store; do not widen composition workspace codecs,
keys or WP13 process-context schema. Storage failures/stale baseline preserve draft; no auto-overwrite.
Cross-tab CAS, remote sync, collaboration and publication remain excluded.

## Exit proof and exclusions
A proves actual codec/commands/history/materialization round-trip, failure atomicity and full metadata
preservation. B extends actual APIs into Chromium journeys and all88 predecessor cases; no hand-authored
successful downstream candidate fixture. Independent Review repeats complete chain and assesses bounded
C10 evidence, trust, compatibility, debt, max-size behavior and accessibility limits before GO closure.
No BusinessRecipe authoring, business approvals, action/entity editing, generic schema editor, simulation,
Core service integration, compile/release/deploy/runtime execution or universal accessibility claim.
New semantic authority/public owner schema/L4 boundary requires explicit ADR/change control before code.
