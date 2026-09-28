# Station S3 R6 — C8 Repository Evidence & Proof Matrix 01

Date: 2026-09-28
Authority status: research evidence only; does not create product/Core/business authority.
Base: `main@d76a5a38abb7158c1b2577fddee391fd24843361`
Phase: R6 / C8 Tool-level compositions

## Station current state

`EditorShell` is already domain-neutral layout chrome with explicit toolbar/palette/work-area/layers/inspector/status slots. Its contract leaves graph, selection, command, persistence and business authority with callers. Component Lab/Component Editor evidence exercises this shell with the shared composition engine. This is reusable C5-C7 evidence, not proof that a C8 Tool abstraction already exists.

No repository evidence found in this census justifies treating a concrete Component Editor, Window/View Editor, Workflow Studio, Ticket Tool, Approval Tool or other domain surface as the canonical C8 abstraction.

## Open C8 question

What is the smallest reusable invariant that promotes a C7 Template/View composition into a Tool without turning a domain application, workspace layout or provider-specific extension model into a new grammar level?

Candidate grammar:

`tool identity + participant-role contract + active-context routing + command/capability projections + presentation/restoration policy`

The Tool remains a presentation/orchestration boundary. It does not own business truth, infer authority from enabled/visible state, or replace command/capability owners.

## Independent benchmark convergence

The benchmark set converges on four useful language properties rather than a feature catalog:

1. command/action identity is separable from each UI projection;
2. active context determines which projection/action is applicable, but context is not authority;
3. panes/editors/tool windows retain semantic roles while visibility, placement, focus and maximize state change;
4. workspaces group relevant participants/commands without becoming the authority for the underlying domain objects.

Divergence is intentionally retained: VS Code context keys, JetBrains Action System/tool windows, Blender hover/editor context and Fusion workspace/panel IDs are provider-specific mechanisms. Station should adopt the grammar pattern, not their APIs or metadata formats.

Classification: `own/adapt` for the C8 grammar; `adopt-pattern` for context-conditioned projection and stable participant identity; `defer` for provider-specific docking, plugin APIs, command registries and workspace serialization formats.

## Promotion and dedup

Promote C7 -> C8 only when all are true:

- a stable Tool identity survives admitted participant placement/presentation changes;
- multiple C7/C5 participants are coordinated by declared semantic roles;
- active-context routing introduces a reusable invariant not already owned by a single View/Pattern;
- commands/capabilities remain separately identified and owner-revalidated;
- the same Tool contract recurs across materially different domains by participant/configuration substitution;
- the new invariant has a delta proof distinct from inherited C0-C7 proofs.

Do not promote for label/icon changes, domain nouns, command bindings, default pane placement, visibility defaults, spans, data source choice, or a different set of compatible participant instances.

Therefore `ApprovalTool`, `TicketTool`, `CrudTool`, `DashboardTool` and `DeploymentTool` remain configurations unless the shared contract fails for a reusable semantic reason with its own proof delta.

## Proof inheritance

C8 may inherit only when preconditions remain unchanged:

- primitive activation/keyboard/focus semantics;
- grouping and slot compatibility;
- command identity, target/currentness and `availability != authority`;
- result/evidence non-strengthening, including `accepted != effective`, partial/unknown/stale;
- region identity != placement and presentation-only maximize/hide/rearrange;
- C7 definition/role/variant semantics where actually proven.

Missing C7 evidence remains a carried `unproven-gap`; inheritance never manufactures PASS.

## C8 delta proof matrix

| Finding / journey | Coverage now | Inherited proof | Smallest C8 delta proof |
| --- | --- | --- | --- |
| stable Tool identity | `unproven-gap` | region/view identity rules | rearrange/hide/maximize compatible participants without changing Tool identity |
| participant-role compatibility | `unproven-gap` | C3/C7 compatibility model | incompatible participant rejected before Tool composition mutation |
| active-context command routing | `unproven-gap` | command identity + currentness | same command identity resolves deterministically from declared active context, without feature-name branching |
| keyboard/menu/toolbar convergence | `unproven-gap` | primitive keyboard + command identity | different projections invoke the same command identity/target contract |
| presentation-only rearrangement | `unproven-gap` | C5 identity != placement | move/hide/maximize changes presentation only and does not alter authority/effect semantics |
| restoration | `unproven-gap` | presentation state ownership | restored layout rebinds to current participants and cannot resurrect stale canonical/business state |
| multi-view consequence propagation | `unproven-gap` | result/currentness semantics | one authoritative result/revision causes dependent projections to refresh without duplicated state authority |
| failure/recovery presentation | `unproven-gap` | C4 result taxonomy | Tool preserves rejected/partial/unknown/stale/reconcile-required and never strengthens them |
| retry/compensation projection | `unproven-gap` | owner revalidation | retry/compensation appears only from current owner eligibility and is revalidated at invocation |
| extension seam | `unproven-gap` | registries/contracts | extension participant cannot bypass ComponentRegistry/contracts, command identity or authority boundary |
| manual deterministic UX | `unproven-gap` | lower-level focus/selection | insert/select/switch participant/context, inspect consequences, validate and recover without AI/MCP |
| cross-domain reuse | `unproven-gap` | C7 reuse hypothesis | five sufficiency exemplars instantiate one C8 contract without domain subclasses/escape hatches |

Human acceptance remains separate: it may confirm that Tool behavior matches user expectation, but it cannot substitute for machine conformance or create product authority.

## Failure/recovery semantics

Interaction remains:

`intent -> active context -> command identity -> target -> conditions/currentness -> authority owner -> effect request -> result/evidence -> presentation consequences`

Tool may project retry, reconcile, compensation or rollback only when the owning contract exposes them. Closing/hiding/rearranging a participant is presentation, never compensation. Restoration is not recovery of business truth. `accepted` remains distinct from `effective`.

## Grammar Sufficiency Test — C8 pressure

Required exemplars remain document approval, ticketing, CRUD, operational dashboard and deployment configuration.

Current disposition: `unproven-gap / candidate sufficiency`.

The candidate succeeds only if all five can share the same Tool contract while varying participants, commands/capabilities and configuration. A new abstraction is justified only by a reusable invariant that cannot be represented without an escape hatch. Coverage/gaps are reported directly; no aggregate score converts missing evidence to PASS.

## Carried gaps

Still explicit and not solved by C8 research:

- semantic reparent / cycle / reachability / sibling-order proofs;
- contract/schema -> Inspector generation;
- canonical graph -> Layers projection;
- source/YAML round-trip/currentness;
- broad multi-projection synchronization;
- C7 typed-slot, responsive and cross-domain executable evidence.

## Exit direction

R6 is not closed by this matrix. Before handoff, reconcile repository executable evidence against these obligations, derive representative Tool journeys, and perform an adversarial dedup/sufficiency review. Future Construction must implement behavior plus the smallest corresponding delta proof, with intermediate Test Review/Hardening and QA Coverage/Evidence Review before closure.

R7, Construction, Studios and AI/MCP remain blocked until the applicable handoff/synthesis/materialization gates.