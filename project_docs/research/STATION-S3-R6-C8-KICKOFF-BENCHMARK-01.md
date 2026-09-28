# Station S3 R6 — C8 Tool Composition Kickoff & Benchmark Extraction 01

Date: 2026-09-28
Base: `main@d76a5a38abb7158c1b2577fddee391fd24843361`
Status: research evidence only — non-authoritative

## Station current → question

R1–R5 research is integrated. R6 asks what invariant promotes a C7 Template/View composition to C8 Tool without turning a configured application/domain instance into a new grammar piece or moving Core/business authority into Station.

Preserve: identity != placement != presentation != action; ComponentRegistry != AppManifest; WindowGeometry != composition grid; discrete/span authoring; provider independence; projection != canonical authority.

## Benchmark evidence and extraction

### VS Code
Independent evidence: commands are central and may be projected through palette, keybindings and menus; context keys/when clauses condition enablement/visibility from active UI context; views have stable identifiers and may live in standard or contributed view containers. Extracted pattern: stable command/view identity + contextual routing/availability + movable presentation. Station classification: `adopt-pattern`, not provider schema/API adoption.

### Blender
Independent evidence: Workspaces are task-oriented arrangements of Areas; Areas host Editors; Editors contain Regions. Many shortcuts are resolved against the editor under the pointer, while maximize/focus changes presentation without changing editor purpose. Extracted pattern: task-oriented work surface + typed participant roles + active-context routing + presentation transformations that preserve participant identity. Station classification: `adopt-pattern`.

### Autodesk Fusion
Independent evidence: a Workspace exposes panels containing commands relevant to that workspace; panels have stable IDs and visibility changes with active tabs/context. Extracted pattern: workspace identity scopes command projections and panels while command definitions remain separately identifiable. Station classification: `adopt-pattern`.

These products diverge substantially in extension APIs, docking models, persistence and domain semantics. Those divergences are evidence against copying a provider workbench model wholesale.

## Candidate C8 grammar

A C8 Tool candidate is not merely a large view. Promote only when the composition introduces a reusable orchestration invariant across multiple C7 views/regions/capabilities:

`tool identity + participant-role contract + active-context routing + command/capability projections + presentation/restoration policy`

Business effects remain owned outside Station. A Tool may coordinate presentation, selection/context projections, command discovery/invocation surfaces and restoration; it may not become the source of truth for business state or authoritative effects.

## New piece vs configuration

Remain configuration when only domain labels, icons, command bindings, participant instances, default pane placement, admitted spans, visibility defaults or domain data change.

C8 promotion requires all of:
1. stable semantic Tool identity across admitted participant/layout changes;
2. declared participant roles/compatibility rather than feature-name branching;
3. reusable context-routing invariant spanning multiple views/regions;
4. command/capability projection without owning the command's authority/effect;
5. restoration/persistence boundary with explicit owner/currentness semantics;
6. recurrence in materially different domains;
7. a proof delta not already discharged by C0–C7.

Reject by default domain-named abstractions such as `TicketTool`, `ApprovalTool`, `CrudTool`, `DashboardTool` or `DeploymentTool` while one Tool contract plus configuration expresses them.

## Interaction Grammar at C8

Visual controls remain small. Tool orchestration resolves:

`intent -> active context -> command identity -> target -> conditions/currentness -> authority owner -> effect request -> result/evidence -> presentation consequences`

The Tool may select/project the applicable command and consequence surface. It must not infer authority from visibility, enabled state, focus, selected pane or accepted transport response.

## Proof Grammar / inheritance

C8 inherits lower-level proofs only when preconditions remain unchanged: primitive activation/focus; compound grouping; C4 command identity/target/currentness and availability != authority; C5 region identity-vs-placement; C6 contextual action/result non-strengthening; C7 definition/slot/projection semantics where actually proven.

Candidate delta obligations — all `unproven-gap` until executable evidence exists:
- tool identity survives admitted layout/participant-instance changes;
- incompatible participant roles fail closed before canonical mutation;
- active-context change deterministically changes projected command availability without changing command identity/authority;
- keyboard/focus routing reaches the same command identity as pointer/menu invocation where applicable;
- moving/hiding/maximizing a participant changes presentation only;
- restoration does not resurrect stale canonical/projected state as current;
- multiple views receiving one authoritative result converge without duplicated state authority;
- accepted != effective, partial, unknown, stale and reconcile-required remain distinguishable through Tool presentation;
- retry is exposed only from current owner eligibility and is revalidated by the owner;
- extension/contribution seams cannot bypass registry/contracts/authority boundaries.

Human acceptance separately validates whether the Tool's manual workflow and consequences match operator expectations; it does not substitute for machine conformance.

## Failure/recovery

A Tool presents failure/recovery semantics; it does not manufacture them. Retry, compensation or rollback appear only when exposed by the owning capability/command contract. Closing/rearranging a pane is never compensation. Restoration must preserve evidence/currentness and must not turn stale snapshots into truth.

## Grammar Sufficiency Test pressure

Exercise the same candidate Tool grammar against document approval, ticketing, CRUD, operational dashboard and deployment configuration. Current status: `unproven-gap`. Promotion succeeds only if these can differ by participants/configuration/contracts without ad-hoc Tool subclasses or escape hatches. Measure per-obligation coverage, not a score.

## Dedup / anti-lock-in

Do not adopt VS Code contribution JSON, Blender workspace serialization or Fusion workspace IDs as Station contracts. Extract semantics only. No `UniversalWorkbench`, provider adapter authority, domain-specific Tool family, or AI/MCP layer is justified by this finding.

## Next blocker-first work

1. repository census for existing workbench/editor/tool orchestration and executable evidence;
2. broaden independent workstation comparison (JetBrains plus Adobe/CAD evidence where it answers an open question);
3. derive representative C8 journeys and Exit/Proof Matrix;
4. reconcile inherited R3–R5 gaps explicitly;
5. only after R6 handoff may R7 become eligible.
