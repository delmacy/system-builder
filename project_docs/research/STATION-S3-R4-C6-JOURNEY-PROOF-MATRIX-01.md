# Station S3-R4 — C6 Journey / Proof Matrix 01

Date: 2026-09-28
Base revalidated: fresh `main@9ac33de132abfd6f946b8f90f5012332d8df31c6`
Status: RESEARCH — NOT PRODUCT AUTHORITY

## Purpose

Close the next R4 blocker by expressing representative C6 journeys as delta-proof obligations over the already-researched C0-C5 grammar. This document does not promote a Pattern merely because a benchmark or historical noun exists. It asks whether a reusable cross-participant semantic arrangement exists, what lower proofs it inherits, and what new behavior must still be proven.

Preserved invariants: `identity != placement != presentation != action`; `ComponentRegistry != AppManifest`; `WindowGeometry != composition grid`; span/discrete authoring; provider independence; Station owns presentation/composition, not Core/business authority. Human acceptance remains expectation validation, not machine conformance.

Coverage vocabulary is strict: `proven`, `failed`, `unproven-gap`, `not-applicable`. Missing evidence is never PASS.

## C6 promotion rule

A candidate becomes C6 Pattern only when all are true:

1. the semantic journey recurs across at least two materially different domains/screens;
2. participant roles are declared and substitutable without renaming the pattern per domain;
3. canonical state/business authority remains with declared lower owner(s);
4. the pattern adds a cross-participant invariant or journey that is not merely C3 layout/configuration;
5. lower C0-C5 proofs can be inherited with unchanged preconditions;
6. the remaining delta has a smallest adequate machine proof plus a separate human acceptance journey.

A different label, icon, placement, target domain, command name or result copy is configuration. `ApproveDocumentActions`, `TicketInspector`, `DeploymentRetryToolbar` and similar domain nouns do not qualify by name.

## Candidate journey matrix

| Candidate journey | Representative domains | Participant roles | Inherited proofs | Coverage now | Smallest C6 delta proof / gap | Disposition |
| --- | --- | --- | --- | --- | --- | --- |
| contextual action set | document approval + CRUD + deployment configuration | work/editor, command/action region, selected target, status/result | C3 grouping; C4 command identity/target/conditions/authority/result; C5 named regions | unproven-gap as promoted C6 | changing selection/context changes admitted actions without feature-name hardcode; invoking from two admitted surfaces resolves the same semantic command/target/result; owner rejection/stale/partial is not strengthened | `own/adapt` candidate; do not create domain-specific action bars |
| confirmation consequence | destructive CRUD + deployment/release action | initiating command, confirmation projection, consequence/result region | C4 command/target/currentness and authority separation | unproven-gap | confirmation is presentation intent only; authoritative command is revalidated at invocation; stale target between open/confirm rejects or reconciles; cancel causes no authoritative effect | `adopt-pattern` candidate, not authority |
| form actions | CRUD editor + configuration editor | editable projection, validation/status, submit/reset/cancel commands | lower field/control proofs; C4 command/result; C5 inspector/work roles | unproven-gap | submit acts on canonical target/revision once; reset/cancel semantics are contract-declared and cannot imply rollback unless owner supports it; invalid/stale input fails closed | `own/adapt` candidate |
| navigation + contextual inspector | ticketing + CRUD + deployment configuration | navigation/layers, selection identity, work/editor, inspector/context | C5 named regions; bounded same-state selection; projection identity/currentness grammar | unproven-gap broad | selection resolves one canonical identity; two different descriptors yield contract-derived Inspector fields; selection change invalidates stale bindings; Inspector mutation crosses one owning boundary and projections refresh | `own/adapt`; blocks hardcoded `TicketInspector` |
| layers + work + inspector projection | UI/component authoring + other graph/tree-backed editors | structural projection, canonical graph/draft, work projection, inspector projection | graph identity; C5 projection grammar; source/projection currentness semantics inherited in their owners | unproven-gap | graph mutation changes Layers without second authority; Layers selection resolves same node in work/Inspector; stale projection is detectable; projection edit cannot partially mutate only one view | `own/adapt`; semantic reparent/order remains blocked |
| result/consequence navigation | approval + ticketing + deployment | command result, status/result region, navigation target | C4 result non-strengthening; accepted != effective / partial / unknown owner semantics | unproven-gap Station projection | presentation preserves owner result/currentness; consequence navigation targets evidence/current state; retry/compensation appears only when owner exposes it | `adopt-pattern` candidate |

No row above is `proven` as a generic C6 Pattern. Existing lower-level proofs are reusable, but the cross-participant deltas are not yet evidenced by focused executable tests.

## Five-system Grammar Sufficiency Test — R4 slice

The current small grammar is exercised against five distinct system classes without adding a domain-specific region type:

| System class | Expression with current grammar | New abstraction required now? | R4 gap |
| --- | --- | --- | --- |
| document approval | navigation/work + inspector/context + contextual action set + status/result | no | confirmation/action-set journey proof; owner result projection |
| ticketing | navigation/list + work/detail + inspector/context + command/status | no | contract-driven Inspector and consequence navigation |
| CRUD | navigation/layers + work/form + inspector + form actions | no | form-action semantics; projection sync |
| operational dashboard | navigation/filter + work/visualization + contextual details/status | no | contextual selection/details synchronization; mostly read-oriented obligations |
| deployment configuration | navigation/explorer + work/configuration + inspector + owner-qualified actions/results | no | stale/currentness projection; accepted/effective/partial consequence preservation |

Result: **candidate sufficiency with explicit gaps**, not PASS. The exercise currently finds no need for `ApproveDocumentPane`, `TicketInspector`, `CrudFormPane`, `DashboardPane`, or `DeploymentRetryToolbar`. The pressure is on reusable contracts/projections and C6 journey proofs rather than component proliferation.

A future exemplar that cannot be expressed without an escape hatch must be recorded as a sufficiency gap first. It does not automatically authorize a new grammar level or ad-hoc component.

## Proof inheritance / delta discipline

C6 does not retest primitive button activation, generic focus mechanics, C3 grouping, or the full C4 authority protocol when their preconditions are unchanged. It inherits those proofs and tests only the new relation among participants.

Examples:

- contextual action set: prove context-to-command projection and semantic identity preservation, not Button again;
- confirmation: prove target/currentness revalidation between open and confirm, not dialog styling;
- navigation + Inspector: prove canonical identity and binding invalidation, not list selection mechanics already covered below;
- result navigation: prove result/evidence non-strengthening and consequence target, not owner business semantics.

If a lower-level precondition changes, inheritance is invalid and the affected proof returns to `unproven-gap` until re-established.

## Failure / recovery semantics

C6 presentation may expose owner-declared `rejected`, `stale`, `partial`, `unknown`, `reconcile-required`, retry or compensation consequences. It may not invent or strengthen them.

Required delta obligations where applicable:

1. `accepted != effective` remains representable through the pattern;
2. partial/unknown result cannot be rendered as success merely because a local presentation step completed;
3. retry affordance is projected only from current owner-qualified eligibility and is revalidated on invocation;
4. compensation/rollback is absent unless the owner exposes the semantic transition;
5. closing/hiding/confirming a presentation surface is not itself cancellation, rollback or business acknowledgement;
6. stale projection/currentness is visible or reconciliation-gated according to contract; stale evidence never becomes PASS.

For a purely presentation-local synchronous pattern, async-effect obligations may be `not-applicable` only when the contract explicitly establishes that scope.

## Human acceptance journeys — separate from machine proof

Human acceptance should validate expectations such as:

- selecting a different artifact visibly changes the contextual fields/actions to the expected contract;
- the same semantic action feels consistent when projected in toolbar/context region;
- confirmation makes consequence and target understandable before invocation;
- stale/rejected/partial outcomes remain understandable and navigable rather than appearing as success;
- hiding/restoring a pane does not appear to undo or recreate authoritative work.

These journeys cannot establish command authority, currentness, canonical synchronization or effect truth. QA validates conformance; it does not create product authority.

## R4 blocker assessment

This matrix closes the *definition* of representative C6 journey deltas, but not their machine evidence. R4 handoff therefore remains blocked on:

1. contract/schema -> Inspector projection proof direction;
2. canonical graph -> Layers derivation proof direction;
3. broad one-canonical-artifact / multi-projection synchronization proof direction;
4. classification of whether Form/Confirmation/Destructive Actions merit distinct C6 patterns or remain one contextual-action family with variants;
5. inherited R3 semantic reparent cycle/reachability and sibling-order gaps (must not be smuggled through Layers UX).

Source/YAML serialization and round-trip remain explicit R5 input, not an R4 PASS condition.

## Next research

Blocker-first next step: deduplicate the action-pattern family. Compare mature design-system/editor/workstation practices only to answer whether FormActions, ConfirmationActions and DestructiveActions carry independent semantic/proof deltas or are variants over one contextual command-pattern contract. Then reconcile that result into the C5/C6 Exit/Proof Matrix. R5 remains ineligible until the R4 handoff is integrated/recorded; Construction, Studios and AI/MCP remain blocked.