# Station S3-R1 — Closure Readiness 01

Date: 2026-09-27
Observed fresh main: `8a6ec550e954a81c9200f2f993ed347410b1383d`
Status: RESEARCH EVIDENCE — NOT PRODUCT AUTHORITY

## Purpose

Narrow R1 to the smallest honest closure gate after the census, benchmark parity, repository UI/token census, Proof Coverage Matrix and Exit Matrix. This document does not authorize Construction, does not promote research findings to product authority, and does not waive fresh-main reconciliation.

Preserve: identity != placement != presentation != action; `ComponentRegistry != AppManifest`; `WindowGeometry != composition grid`; discrete span authoring with responsive execution; provider independence; Station owns no Core/business authority.

## Fresh-main / branch gate

Fresh `main` is `8a6ec550...`. GitHub compare reports the R1 branch diverged from merge-base `489caf8...`, ahead by 9 and behind by 30 before this commit. Therefore exact-head integration/currentness is `unproven-gap`. This is now the primary R1 closure blocker.

The divergence does not invalidate research evidence by itself, but R1 MUST NOT be marked CLOSED and R2 MUST NOT be declared dependency-eligible until the research artifacts are reconciled against fresh main and repository paths/findings are revalidated.

## C0 breadth decision

R1 resolves the token-breadth question as **bounded taxonomy requirement, implementation defer**.

Synthesis must preserve explicit token domains for at least:
- semantic color/surface/state;
- typography;
- spacing;
- radius;
- elevation;
- motion;
- density;
- responsive/breakpoint semantics.

R1 does **not** require implementing a complete token system for every domain. Missing domains remain classified taxonomy gaps and later Construction candidates only if synthesis promotes them. This prevents both false completeness and unbounded theming scope.

Proof consequence: C0 proof profile requires canonical identity/domain validity and projection/currentness where a domain exists; an unimplemented domain is `unproven-gap` or deliberate `defer`, never PASS.

## Proof-gap disposition

Existing gaps are carried forward honestly rather than used to block the census itself:

| Candidate | R1 disposition | Coverage state | Carry-forward obligation |
|---|---|---|---|
| Button | own | partial proven + `unproven-gap` | accessible-name/keyboard semantics where not already executable |
| IconButton | own/adapt | `unproven-gap` delta | accessible-name proof on top of inherited Button proof |
| Toggle | own | state projection proven; cancellation delta `unproven-gap` | prove prevented/cancelled activation semantics if promoted |
| Tree | own | implementation evidence + `unproven-gap` | executable roving-focus/keyboard/selection/expansion conformance |
| MenuSurface | adapt | `unproven-gap` as mature Menu | collection/focus/dismissal/restoration delta before promotion |
| Tooltip | adapt | `unproven-gap` | trigger modality/timing/dismissal/focus relation |

These gaps do not become PASS through inheritance. Higher levels inherit only proven lower obligations and retain lower gaps visibly.

## R1 promotion/dedup rule — closure candidate

A new reusable grammar piece is justified only when it introduces at least one reusable semantic relation, interaction/state machine, compatibility rule, or proof obligation not representable as configuration/composition of existing pieces.

Domain naming, visual restyling, overflow relocation, icon/label changes, app-specific wrappers and alternate projections of the same semantic command are insufficient. Therefore `ApproveDocumentButton`, `DeployButton`, `TicketApproveButton` and analogous domain-specific primitives are rejected as default catalog strategy when `Button + CommandBinding + capability/target` expresses the behavior.

## Interaction Grammar handoff candidate

Carry to R3 for validation/promotion, not as current product authority:

`visual activation surface -> activation intent -> command binding -> target/context -> conditions/availability/authority boundary -> effect/result -> presentation consequence`

R1 evidence supports keeping visual activation small and extending existing presentation-command authority rather than creating a competing command registry.

## Inspector/projection handoff candidate

Carry forward:
- Inspector fields should derive from canonical component/capability/command schemas rather than feature-specific hardcode;
- Inspector, Layers, Graph, source/YAML and Preview are projections of one canonical artifact;
- projection changes must not create duplicated state authority;
- responsive/overflow presentation must preserve semantic command identity.

Proof obligation: round-trip/convergence evidence across applicable projections; missing Graph/source round-trip remains `unproven-gap`.

## Grammar Sufficiency Test

Remain a synthesis gate, not an R1 PASS claim. Corpus:
1. document approval;
2. ticketing;
3. CRUD/master-detail;
4. operational dashboard;
5. deployment configuration/control.

For each corpus member record reuse, configuration, genuinely missing contract, escape hatch, duplication pressure, inherited proofs, delta proofs and authority crossings. No aggregate magic score.

## R1 closure checklist after this delta

Resolved by research:
- representative ecosystem parity breadth;
- repository UI/component census;
- initial token census;
- C0 breadth disposition;
- C0-C4 proof inheritance model;
- promotion/dedup criterion;
- explicit carry-forward proof gaps;
- Grammar Sufficiency Test measurement discipline.

Still blocking closure:
1. reconcile the branch against fresh main without dropping governance/proof changes already merged there;
2. revalidate all research paths and findings after reconciliation;
3. collapse duplicate narrative into the Exit Matrix/handoff while preserving evidence history;
4. issue final R1 handoff declaring R2 eligible for research only.

## Gate disposition

`S3-R1 = IN_PROGRESS` solely because fresh-main reconciliation/currentness and final handoff remain incomplete. R2 is not yet dependency-eligible. Construction, AI/MCP foundation work and specialized Studios remain blocked until R1→R7→synthesis and explicit Construction materialization.