# Station S3 R5 — C7 Template/View Journey + Exit/Proof Matrix 01

Status: research evidence only; non-authoritative until S3 synthesis/materialization.
Base: `main@19c87172c19e9bae5bf39848a0db9d09798705ce`
Phase: R5 — Templates / Full Views

## Purpose

Convert the C7 Template/View hypothesis into representative manual journeys and explicit delta proofs. Coverage vocabulary is strictly `proven | failed | unproven-gap | not-applicable`; missing evidence is never PASS. Human acceptance validates expectation and remains distinct from machine conformance.

## Station current state → open question

Repository planning already calls for a declarative `ViewDefinition/ComponentTree` boundary before Window/View Editor construction. R5 therefore asks whether C7 can remain a small declarative composition over C0–C6 rather than becoming a free-form page language or domain-specific template catalog.

The candidate C7 grammar is:

`definition identity + typed semantic roles/slots + compatibility + bounded variants + discrete responsive arrangements`

Configuration remains configuration when only labels, icons, domain bindings, commands, pane side/width, admitted spans, or responsive arrangement values change.

## Independent benchmark extraction

### Webflow

Evidence: main component vs instance is explicit; instance customization is bounded through props, slots, and variants. Slots are declared placeholders and may constrain where composition occurs. Variants alter layout/style while retaining component identity.

Station extraction: adopt the pattern that reusable structure declares variation points rather than permitting arbitrary mutation. Do not adopt Webflow schemas, provider metadata, DOM model, CMS semantics, or feature scope.

### Framer

Evidence: breakpoint-specific layout/grid arrangements and breakpoint variants preserve a reusable design source while allowing discrete responsive arrangements.

Station extraction: responsive behavior should be modeled as bounded arrangements of the same semantic definition where roles/commands remain compatible; a breakpoint must not silently create a new semantic Template/View identity.

### VS Code

Evidence: the Workbench has stable semantic regions while Views can move between admitted containers and layout choices persist independently of View identity.

Station extraction: identity != placement remains valid at C7. A full-view definition can admit region arrangements without making left/right/bottom placement part of semantic identity.

## Convergence / divergence

Independent convergence:
- reusable definition is distinct from instance/configuration;
- declared insertion/variation points bound composition;
- layout/responsive arrangements can vary without forcing new semantic identity;
- manual authoring exposes structure and contextual configuration explicitly.

Divergence:
- providers differ on DOM/code authority, arbitrary layout freedom, breakpoint models, CMS/data integration, docking and extension APIs;
- these divergences are not Station scope and create no product authority.

Classification: `own/adapt` for Station C7 contract semantics; `adopt-pattern` for bounded slots/variants and identity-vs-arrangement; provider-specific schemas/features are `defer/not-applicable`.

## Representative C7 journeys and proof deltas

| Journey | Inherited proofs | Minimum C7 delta proof | Coverage |
|---|---|---|---|
| Instantiate one definition in two domains | C0–C6 identity, slot/group compatibility, command/target/currentness | same definition contract accepts materially different domain bindings without feature-name branching or new abstraction | unproven-gap |
| Replace a slot participant | lower-level participant conformance | compatible replacement preserves role contract; incompatible replacement is rejected deterministically before canonical mutation | unproven-gap |
| Switch responsive arrangement | region identity-vs-placement, discrete/span semantics | same semantic role/node/command identities survive admitted arrangement change; hidden/reflowed content preserves accessibility/focus obligations | unproven-gap |
| Edit via Inspector | C4 command/authority/currentness; R4 projection semantics | selected canonical node resolves contract/schema-derived fields; edit crosses one owner mutation boundary and produces one canonical revision | unproven-gap |
| Edit via Layers/Graph | R3 graph identity; R4 projection semantics | projection intent resolves same canonical node refs; no Layers/Graph authority is created; invalid reparent/order is rejected by owner | unproven-gap |
| Edit via source/YAML | projection/source identity and currentness semantics | parse/validate/edit produces one owning mutation; stale source cannot overwrite current revision; unknown/non-writable fields cannot silently become authority | unproven-gap |
| Round-trip visual ↔ source | canonical/projection lineage semantics | canonical → projection/source → edit → canonical revision → regenerated projections preserves representable semantics and reports unsupported/lossy cases explicitly | unproven-gap |
| Undo structural edit | existing owner/history semantics where applicable | undo targets the canonical authoring mutation/revision and regenerates projections; it is not represented as compensation/rollback of business effect | unproven-gap |
| Save/reopen definition | identity/revision semantics | definition identity, role bindings and admitted variants survive serialization/reload without presentation placement becoming identity | unproven-gap |
| Manual validation/recovery | lower-level validation/result semantics | user receives deterministic, comprehensible invalid-slot/stale/unsupported diagnostics and can navigate to the consequence/target without hidden repair | unproven-gap |

## Proof inheritance rules

C7 may inherit lower-level proof only when the precondition is unchanged. It does not retest Button activation, primitive keyboard semantics, command identity, or basic grouping merely because they appear in a full view. C7 must add delta proof where composition changes context, binding, projection, responsive arrangement, persistence, or revision semantics.

Inherited semantic candidates:
- C1 activation/focus/keyboard contracts;
- C2/C3 slot, grouping and collection compatibility;
- C4 command identity, target/currentness, `availability != authority`, result non-strengthening;
- C5 region identity != placement and presentation-only hide/show/layout;
- C6 contextual action participant/binding semantics;
- existing projection/source identity, revision, currentness, completeness and non-strengthening semantics in their owning bounded contexts.

Inheritance does not make C7 PASS. Every row above remains `unproven-gap` until focused evidence exists.

## Source/YAML projection rules

Candidate direction:

`canonical artifact identity/revision/authority → source projection identity/revision/currentness → textual representation`

Reverse direction:

`source edit intent → parse + schema/contract validation → owner mutation/command → one canonical revision → all projections refresh/regenerate`

Required failure semantics:
- parse failure: no canonical mutation;
- schema/compatibility failure: no canonical mutation;
- stale source: reject or explicit reconcile path; never last-write-wins silently;
- unknown field: preserve safely or reject/report according to declared contract; never silently strengthen authority;
- partial/lossy representation: mark gap/unsupported explicitly; never claim round-trip fidelity;
- accepted mutation != effective business effect; authoring success cannot strengthen downstream Core/business evidence.

## Manual-first UX obligations

Before AI/MCP, the deterministic path must cover insertion/drag within admitted semantics, selection, Layers/tree navigation, contextual Inspector, preview, undo/history, understandable validation, and navigation to consequences. Drag is presentation input; semantic reparent/order remains blocked by the R3 owner/proof gaps and cannot be smuggled into C7.

## Dedup / promotion guard

Reject by default as distinct grammar pieces:
- `ApprovalTemplate`
- `TicketView`
- `CrudTemplate`
- `DashboardTemplate`
- `DeploymentView`

Promote a new C7 identity only if a repeated cross-domain invariant cannot be expressed by the common definition + typed roles/slots + bounded variants/arrangements, and the new invariant has an independent owner and delta proof. Domain vocabulary alone is insufficient.

## Grammar Sufficiency Test — R5 working coverage

The same candidate grammar must attempt all five exemplars:

| System class | Candidate composition | Current gap |
|---|---|---|
| document approval | navigation + work + inspector + contextual actions + result/status | contract→Inspector; confirmation/currentness delta |
| ticketing | navigation/list + work/detail + inspector + contextual actions + status | cross-domain C7 reuse; projection sync |
| CRUD | navigation + form/work + inspector + contextual actions + validation/status | source/visual round-trip; dirty/validation binding |
| operational dashboard | navigation + collections/work + inspector/context + status | responsive role preservation; projection currentness |
| deployment configuration | navigation + configuration work + inspector + contextual actions + result/status | stale protection; accepted!=effective; retry/currentness |

Result: `candidate sufficiency with explicit gaps`. No global PASS and no score. Current pressure is on proof/adapter/round-trip semantics, not on missing domain-specific templates.

## C7 exit matrix

R5 research handoff requires all of the following to have a documented direction even if future Construction evidence remains `unproven-gap`:

1. promotion vs configuration criterion — direction defined;
2. definition/instance identity — direction defined;
3. typed roles/slots and compatibility — direction defined;
4. bounded variants and discrete responsive arrangements — direction defined;
5. manual-first authoring journeys — direction defined;
6. Inspector/Layers/Graph/preview/source as projections of one canonical artifact — direction defined, executable Station proof still gap;
7. source/YAML round-trip/currentness/failure semantics — direction defined, executable proof still gap;
8. proof inheritance + delta-only obligations — direction defined;
9. dedup guard against domain-specific template explosion — direction defined;
10. Grammar Sufficiency coverage across five system classes — candidate coverage defined, gaps explicit.

## Carried gaps

Do not convert to PASS during R5:
- contract/schema → Inspector projection;
- canonical graph → Layers projection;
- broad multi-projection synchronization;
- semantic reparent, cycle/reachability and sibling ordering;
- source/YAML round-trip fidelity;
- undo/history ownership across projection edits;
- responsive focus/accessibility preservation;
- cross-domain C7 reuse evidence.

## Construction implication — not authorization

Future Construction should implement behavior + smallest corresponding proof in the same task. Milestones must include intermediate Test Review/Hardening and a QA Coverage/Evidence Review before closure. Human acceptance remains a separate gate. This document does not authorize Construction and does not create Core/business/product authority.
