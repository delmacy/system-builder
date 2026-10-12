# Workflow Studio — local technical candidate authoring
Status: bounded WP15 delivery; closure effective on validated TASK716 integration.
Authority: Addendum015 and WP15 Review. This edits technical SystemDefinition candidates,
not BusinessRecipe or canonical Core truth.

## Open and create
Update main and run npm run station:dev. Open Workflow Studio from Station launcher, or
http://localhost:3000/workflow-studio. It works with no Core attached.
Expand Create workflow or add process. Enter process name/id, explicit analysis/recipe/requirement
references and first state id. Create workflow produces an unpublished local definition candidate.
References are recorded but unresolved; local validation does not approve business meaning.
Alternatively Import workflow accepts an inert complete supported .workflow.json definition envelope.

## Author through coordinated Tools
Select a process. Explorer lists states/transitions; diagram/grid and table share the same qualified
selection and Inspector. Add state with a stable unique id. Select a state to set initial or remove it.
Deleting initial/referenced/last state rejects; correct initial/transition references first.
Add transition with id (initially a self-loop), select it, choose source/target/declared optional action
and Apply transition. Select transition to remove. Cycles/self-loops are supported.
Add process uses explicit id/name/requirement/first-state fields and preserves existing processes.
State rename and action/entity editing are excluded. Imported actions are selectable references only.
Undo/redo shares one bounded editing history; it does not compensate a business action.
Apply or Reset pending fields before changing selection/saving. Import/open dirty draft offers Cancel
(preserve applied draft and pending inputs) or explicit Discard workflow and open.

## Retain, compare and exchange
Validate workflow checks current local schema/workflow rules; it is not release validation.
Enter a distinct new artifact version and Save new workflow revision. The original base and candidate
are retained independently, with predecessor provenance; saving never overwrites a tuple.
Default next patch is a convenience, not an automatic migration/compatibility judgment. Choose an
unused version if an earlier imported revision would collide with a retained version.
Save checkpoints the new local candidate and clears ephemeral history/selection. Compare with revision
shows explicit original/new workflow change status. Complete definition snapshot is read-only.
Retained workflow revision selection + Open workflow revision reopens exactly the chosen version.
Refresh reads candidate storage without silently opening/replacing the current draft.
Export workflow downloads a clean candidate as definition.workflow.json. Save changed meaning into
a new candidate before export; Import validates before replacing. Portable files carry the full envelope,
unrelated payload fields/optional extensions and references; keep files independently of browser storage.
After reload or window close, opening is explicit. Minimize/restore preserves mounted draft/selection.

## Recovery and bounds
Quota/denial/corruption/stale expected snapshot or changed duplicate tuple blocks save and preserves
the draft/retained revisions. Refresh, review retained choices and deliberately retry with unused version.
No auto-repair/rebase/overwrite/merge or cross-tab CAS. Do not clear storage to recover without exporting.
Candidate store is separate station:workflow-candidates:v1, max16 revisions/4MiB; composition workspace,
Process Context keys/codecs and File Manager composition semantics remain unchanged.
Artifact cap1MiB/depth32; selected editable process64 states/128 transitions; history50.
Larger unrelated valid workflows import/preserve read-only; no truncation. Exact supported
envelope/schema1.0.0; required unknown extensions/incompatible documents reject explicitly.
Chromium/keyboard/narrow journeys are proven; universal browsers/screen-readers, max-bound cold/
long-session memory/latency, broader graph layout and simultaneous-form recovery are not certified.
Real Core/Design authoring service, SDK transport/currentness, publication and execution are WP16 or
separately admitted owner work. Local Studio success must not be presented as live owner integration.

## Public local draft API
packages/station-workflow-authoring exports encode/decode/create/open, applyWorkflowCommand,
materializeWorkflow, isWorkflowProcessEditable, qualified selection and bounded comparison helpers.
The existing public SystemDefinition schema is reused without schema mutation. Commands require expected
session revision and return explicit accepted/reason; no-op/rejection preserves draft/history.
Materialization requires distinct version/date and produces a fully validated candidate plus canonical
text. API result means local candidate validity only; upstreamStatus remains unresolved.
Use public package aliases; do not import compiler/runtime/test/harness internals for authoring.

## WP16 actual owner connection
DesignWP1 independently closed #1116; SDK/client A#1117 integrated. Open Design owner connection in Workflow Studio. Configure trusted owner endpoint, credential and exact Core/Station/session/workspace/actor/actor-revision matching the explicit local server profile in docs/operations/DESIGN_CANDIDATE_SERVICE.md. Set server SYSTEM_BUILDER_DESIGN_BROWSER_ORIGIN to the exact Station loopback origin (e.g.http://localhost:3000); set server port4000 or match configured endpoint.
Credentials/context connection state remain ephemeral; closing/reloading Studio clears them. Candidates/local export never carry server credentials or database URL. Server independently verifies credential/actor/context/eligibility; UI actor text is no grant.
Connect owner verifies protocol/capabilities. Send only a clean saved local candidate, not dirty/pending fields. Receipt alone is insufficient: exact stored text/hash/identity/revision readback must pass before Owner retained is shown. Retained is not published/business-approved/upstream-resolved.
New artifact requires absent owner head. Existing artifact requires verified exact base in document lineage and matching prior owner revision; refresh never silently promotes a stale draft onto a newer owner base. Reconcile by deliberate exact read/open and edit a new local version. CAS remains owner-atomic if a competing writer changes after the head check.
Read exact owner revision by artifact ID+version; absent never falls back to latest. Open is explicit and uses existing dirty/pending-field Cancel/Discard. Local save/import/export remain independent.
Unknown command may have committed. Recover owner result by stable command reference before deliberate identical retry; changed submit blocked while pending. Disconnect cancels client work but cannot undo an owner transaction. Reset connection clears only ephemeral connection/credential state; result may still exist, so exact-query before resubmitting.
Late draft/context/disconnect replies never install or replace local data. Diagnostics and known command/owner revisions are explicit.
Tests: existing95 Chromium journeys plus7 actual owner cases. Browser harness uses explicitly supplied SYSTEM_BUILDER_TEST_POSTGRES_URL or uniquely named isolated loopback DockerPostgres17.6 fixture, actual owner process/restart and cleanup only owned fixture. npmrunverify does not start this browser fixture; run existing browser Playwright command after station:build, with Docker or supplied testPostgres.
Qualification remains explicit local single-operator authenticated loopback. RemoteTLS/productionIAM/multitenancy/scale/universal accessibility/browser certification not claimed. Response size/escaping boundary still requires fresh package review; no maximum connected-size certification inferred from small-case proof.

## WP16 bounded C response/native qualification
Fresh integrated B#1118 actual102 Chromium and109 heavy0skip. Actual WP15 create/open/edit/materialize probe admitted800937-byte candidate, escaped record alone1601073 bytes, exceeding old1114112-byte client response limit. C now raises bounded stream cap to2162688 bytes (2xraw1MiB+64KiB envelope), overflow remains fail-closed, and standard fetch bound to global realm. UI caller workaround removed. Actual large escaped provider and production-browser/native-default proofs required before Review; no backend/schema change or general scale certification.

## Validated connected construction / package review
A#1117/B#1118/C#1119 independently integrated with seven checks eachPASS.111 heavy0skip and103 productionChromium (95old+8connected) passed, including nativeSDKdefault/largeescaped metadata, ownerrestart/fresh-empty-localstore/fullreadback and failure recovery. Independent Review TASK726 finds boundedlocal journey complete; Closure not effective until own validated integration. WP16-L1–L4/D1–D2 and inherited limits remain explicit in Review; no businessapproval/publication/productionIAM/remote service/globalcertification.
