# Station S3-R4 — C5/C6 Exit & Proof Matrix 01

Date: 2026-09-28
Base revalidated: fresh `main@9ac33de132abfd6f946b8f90f5012332d8df31c6`
Status: RESEARCH HANDOFF CANDIDATE — NOT PRODUCT AUTHORITY

## Purpose

Consolidate R4 Pane/Region (C5) and Pattern (C6) research into one blocker-first exit view. This matrix distinguishes research closure from Construction proof: an `unproven-gap` may be sufficiently specified to hand forward when its owner, invariant, inherited proofs and smallest future delta proof are explicit. Missing evidence never becomes PASS.

Preserved invariants: `identity != placement != presentation != action`; `ComponentRegistry != AppManifest`; `WindowGeometry != composition grid`; discrete/span authoring; provider independence; Station owns presentation/composition, not Core/business authority; human acceptance validates expectation and remains distinct from machine conformance.

## R4 exit rule

R4 research is handoff-ready only when each promoted/candidate C5/C6 concept has:

1. a bounded semantic role rather than a feature/domain noun;
2. explicit state/authority ownership;
3. promotion and dedup criteria;
4. lower-level proofs identified for inheritance;
5. the smallest new proof obligation identified;
6. unresolved evidence classified `unproven-gap`, not PASS;
7. representative manual/human journey separated from machine proof;
8. no benchmark feature admitted merely because another product has it.

R4 does **not** require future Construction tests to exist before research handoff. It requires their obligations and proof direction to be precise enough that Construction can implement behavior + smallest adequate proof together.

## C5 Pane / Region exit matrix

| Finding | Classification | Coverage now | Inherited proofs | Smallest future delta proof | Exit disposition |
| --- | --- | --- | --- | --- | --- |
| named Station region roles (`command/toolbar`, `navigation`, `work/editor`, `inspector/context`, `status/result`) | `own/adapt` bounded vocabulary | `proven` for current EditorShell anatomy; generic role contract remains `unproven-gap` | C0-C3 composition/slot mechanics | admitted children/slots preserve role contract without acquiring graph/business authority | research direction sufficient |
| pane semantic identity independent from side/width/container placement | `adopt-pattern` from independent workstation convergence | `unproven-gap` generic | lower identity/placement separation | same `paneRef` survives admitted placement/visibility changes and presentation state restoration | specified gap; no docking scope implied |
| contextual focus/keyboard ownership | `adapt` | `unproven-gap` generic | primitive focus/keyboard proofs | deterministic entry/exit/restoration; no key stealing outside active region; equivalent admitted input routes converge | specified gap |
| show/hide/restore | `adapt` | `unproven-gap` generic | presentation-state ownership | hide/show does not mutate canonical artifact; restoration cannot resurrect stale canonical content | specified gap |
| arbitrary docking/floating/split workbench | `defer` | `not-applicable` to current foundation | none | none until separately admitted by demonstrated requirement | excluded from R4 scope |
| neutral PropertyInspector rendering seam | `own` existing seam | `proven`/bounded renderer contract; focused unknown/read-only assertion still gap | C1/C2 control rendering | focused fail-closed unknown/read-only assertion where promoted | retain seam; do not hardcode features |
| contract/schema-driven Inspector projection | `own/adapt` | `unproven-gap` | ComponentRegistry identity + C4 capability/command contracts + projection semantics | selecting two descriptors yields contract-derived field/action descriptors without feature-name branching; unknown stays non-writable; stale binding fails closed | proof direction closed; Construction evidence pending |
| Layers as structural projection of canonical graph | `own/adapt` | `unproven-gap`; current lab tree is parallel/static | graph/node identity + projection identity/currentness semantics | graph mutation regenerates Layers from source revision without second authority; Layers selection resolves same canonical node | proof direction closed; semantic reparent/order remains separately blocked |

## C6 Pattern exit matrix

| Finding | Classification | Coverage now | Inherited proofs | Smallest future delta proof | Exit disposition |
| --- | --- | --- | --- | --- | --- |
| Contextual Action Set | `own/adapt` C6 candidate | `unproven-gap` generic | C1 activation; C3 grouping; C4 command/target/currentness/authority/result; C5 action region | context changes admitted commands without feature-name hardcode; two surfaces preserve command/target/result identity; qualifiers cannot strengthen owner result | retain one small candidate family |
| FormActions | usage profile, not separate Pattern | `not-applicable` as independent C6 noun | Contextual Action Set + validation/dirty projection | profile delta only: validation controls availability, submit crosses one owner boundary, reset/cancel are contract-declared | deduplicated |
| ConfirmationActions | confirmation journey/profile | `unproven-gap` journey | Contextual Action Set + C4 currentness/authority | open has no effect; confirm revalidates target/currentness/authority; cancel != rollback; stale target rejects/reconciles | deduplicated; no ConfirmationAuthority |
| DestructiveActions | consequence/risk qualifier/profile | `not-applicable` as independent C6 owner | owner consequence metadata + Contextual Action Set | risk provenance comes from accepted contract; presentation cannot imply effect; retry/compensation only from owner-qualified evidence | deduplicated |
| Navigation + Contextual Inspector | `own/adapt` C6 candidate | `unproven-gap` broad | C5 region roles + canonical identity + projection grammar | selection resolves one canonical identity; Inspector fields derive from selected contract; selection change invalidates stale bindings | proof direction closed |
| Layers + Work + Inspector projection journey | `own/adapt` C6 candidate | `unproven-gap` | source/projection identity, revision/currentness and non-strengthening semantics | one accepted canonical mutation produces one new source revision; all projections refresh/identify stale source; projection edit cannot mutate only one view | proof direction closed |
| Result / Consequence Navigation | `adopt-pattern` candidate | `unproven-gap` Station projection | C4 result non-strengthening; owner accepted/effective/partial/unknown semantics | consequence navigation targets current evidence/state; retry/compensation appears only when owner exposes current eligibility | specified gap |

## One canonical artifact / multiple projections

R4 adopts the already-proven repository projection semantics as a **grammar/invariant**, not as a universal provider schema:

`canonical source identity + source revision + source authority -> projection identity + projection revision + payload/currentness`

Admitted edits return through exactly one semantic owner boundary:

`projection intent -> owning mutation/command -> canonical artifact/revision -> projections regenerate/refresh`

Required inherited invariants:

- projection identity is not source identity;
- a projection never establishes canonical truth;
- source currentness and projection currentness remain distinguishable;
- `PARTIAL`, `UNKNOWN`, stale or inconclusive evidence is never strengthened by presentation;
- regeneration preserves lineage.

Station-specific `canonical graph -> Layers`, `contract/schema -> Inspector`, and broad multi-projection synchronization remain `unproven-gap`. R4 closes their **proof direction**, not their future Construction evidence.

Reject `LayersStateAuthority`, `InspectorCanonicalState`, `GraphAuthority`, parallel YAML authority and a `UniversalProjectionEngine` merely because multiple bounded contexts share these invariants.

## Interaction / failure-recovery inheritance

C5/C6 do not retest C4 owner semantics when preconditions remain unchanged. They must preserve:

`intent -> command -> target -> conditions -> authority -> effects -> result -> presentation consequences`

R4 delta obligations are projection/composition obligations only. `availability != authority`; `accepted != effective`; partial/unknown/reconcile-required remain distinct; retry is projected only from current owner-qualified eligibility and revalidated; compensation/rollback exists only when the owner exposes it. Closing a pane/dialog is presentation and never implies cancellation/rollback of an authoritative effect.

## R3 gaps deliberately carried, not hidden

The following remain `unproven-gap` and must not be smuggled into Layers/drag behavior:

- semantic reparent cycle/reachability safety;
- semantic sibling ordering authority;
- generic pointer/keyboard drag equivalence where admitted;
- owner-qualified reparent/order mutation semantics.

R4 can hand these forward because their absence is explicit and no C5/C6 promotion claims to solve them.

## Grammar Sufficiency Test — R4 exit slice

Five materially different classes remain expressible with the small grammar:

- document approval: navigation/work + inspector/context + Contextual Action Set + status/result + optional confirmation;
- ticketing: navigation/list + work/detail + contextual Inspector + commands/status;
- CRUD: navigation/layers + work/form + Inspector + Contextual Action Set with validation/destructive qualifiers;
- operational dashboard: navigation/filter + work/visualization + contextual details/status;
- deployment configuration: navigation/explorer + work/configuration + Inspector + owner-qualified actions/results.

No exemplar currently forces `ApproveDocumentPane`, `TicketInspector`, `CrudFormPane`, `DashboardPane`, `DeploymentRetryToolbar`, `FormActionEngine`, or another domain-specific grammar primitive. Result remains **candidate sufficiency with explicit gaps**, not global PASS. The remaining pressure is projection derivation/synchronization and later C7+ concerns, not catalog proliferation.

## Human acceptance — expectation only

Representative R4 acceptance expectations:

1. selecting a canonical artifact changes Inspector/Layers/work context coherently;
2. admitted fields/actions reflect the selected contract rather than feature hardcode;
3. the same semantic command remains recognizable across admitted surfaces;
4. stale/rejected/partial outcomes never look like successful completion;
5. hide/show/restore changes presentation only;
6. confirmation communicates target/consequence and cancel remains non-authoritative.

These do not establish machine conformance, authority, currentness or effect truth.

## R4 blocker disposition

Resolved as research direction:

- C5 promotion/dedup rule;
- C6 promotion/dedup rule;
- action-family dedup;
- contract/schema -> Inspector proof direction;
- canonical graph -> Layers proof direction;
- one-canonical-artifact / multi-projection synchronization proof direction;
- representative C6 journeys and delta-proof inheritance;
- R4 Grammar Sufficiency slice.

Explicit carried gaps, not false blockers to research handoff:

- executable generic C5/C6 proofs belong to future Construction;
- semantic reparent cycle/reachability/order gaps remain inherited from R3;
- source/YAML serialization and round-trip enter R5;
- broader Template/View responsiveness/structural deformation proof enters R5.

## Handoff assessment

**R4 is a research handoff candidate, not yet integrated closure.**

The remaining step before R5 eligibility is repository reconciliation/review of this matrix and the R4 evidence set, then integration of the R4 handoff and update of the single live execution pointer. Until that integration occurs, `docs/current/NEXT_WORK.md` correctly remains on R4 and R5 is ineligible.

Construction, Studios and AI/MCP remain blocked. Research findings remain evidence until synthesis/materialization promotes them through normal repository authority.