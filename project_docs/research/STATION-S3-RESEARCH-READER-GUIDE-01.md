# Station S3 — Research Reader Guide 01

Date: 2026-09-28
Status: research navigation / educational material only — **non-authoritative**

> Purpose: make the S3 research usable by future maintainers, contributors, reviewers and other AI agents without requiring reconstruction from chat history. This document explains the research ladder, vocabulary, proof discipline and where to look next. It does **not** create product, Core/business, Construction, Studio or AI/MCP authority. For live execution authority use `docs/current/NEXT_WORK.md` together with `docs/DOCUMENT_AUTHORITY.md` and the accepted contract/addendum.

## 1. What S3 is trying to learn

S3 studies how Station can become a constrained system-composition environment instead of an arbitrary page builder. The working direction is a compositional ladder in which each higher level reuses lower-level semantics and proofs, and introduces only its own new responsibilities.

Working ladder:

`primitive -> compound/collection -> interaction/capability -> pane/region -> pattern -> template/view -> tool -> studio-readiness -> synthesis -> Construction materialization`

The exact canonical grammar is not declared by this guide. Research findings remain evidence until synthesis/materialization promotes accepted definitions through the governing documentation process.

## 2. Research rounds

### R1 — Census / primitives

Goal: inventory existing Station/UI material and establish the lower-level component census/parity baseline. R1 is the starting evidence for later promotion/dedup decisions.

### R2 — Compounds / collections

Goal: determine when multiple primitives form a reusable composition rather than a one-off arrangement. Important themes include child policy, slots, identity/placement separation, contextual keyboard behavior and proof inheritance.

### R3 — Interaction / capabilities

Goal: separate representation from action semantics and authority. A useful candidate decomposition derived during research is:

`intent -> command -> target -> conditions -> authority -> effects -> result -> presentation consequences`

This prevents a visual component such as a Button from becoming the owner of business authorization or canonical state transitions. Station may project availability, but Core/business authority remains with the authoritative owner.

R3 also established an important proof/recovery distinction: acknowledgement or successful transport is not automatically proof that the intended effect is effective. Partial/unknown outcomes must not be silently represented as success; retry, rollback, compensation and reconciliation belong to explicit owner contracts rather than generic Station invention.

### R4 — Pane / Region / Pattern

Goal: study bounded spatial/semantic regions and reusable interaction/composition patterns while inheriting lower-level proofs. Higher-level research should not repeatedly prove primitive behavior when the inherited proof preconditions remain unchanged.

### R5 — Template / View

Goal: study complete views/templates, definition-versus-instance identity, role/slot compatibility, bounded variants, discrete responsive arrangements and multiple projections of one composition artifact. A key research concern is **false visual success**: a screen may look correct while its canonical structure, references, ordering or round-trip representation is wrong.

Candidate projection direction:

`one canonical artifact -> Canvas / Layers / Inspector / Graph / source-YAML projections`

No individual projection should silently become a second canonical truth.

### R6 — Tool-level composition (C8 research)

Goal: determine when views/templates, regions, capabilities and presentation state become a coherent reusable work surface — a Tool — without acquiring Core/business authority.

R6 examines Tool identity versus configured application instance, workspace/view ownership, command/context routing, restoration boundaries, multi-view consequences, failure/recovery presentation, accessibility/focus, extension seams, promotion/dedup and delta-only Proof Grammar.

Primary R6 evidence includes:

- `STATION-S3-R6-C8-KICKOFF-BENCHMARK-01.md`
- `STATION-S3-R6-C8-REPOSITORY-EVIDENCE-AND-PROOF-MATRIX-01.md`
- `STATION-S3-R6-C8-JOURNEY-EXIT-PROOF-MATRIX-01.md`

All are under `project_docs/research/`.

### R7 — Studio-readiness / Core projection census

R7 is the next upper-level research boundary after integrated R6. It must investigate composition above individual Tools without assuming that every related Tool belongs in one Studio. Questions include shared versus Tool-local context, Tool cooperation, artifact identity, lifecycle, authority projection, cross-Tool state consequences and the Station/Core boundary.

Do not treat this guide as declaring the final Studio model; R7 and synthesis exist precisely to resolve that boundary.

## 3. Component Grammar and Proof Grammar evolve together

S3 treats construction semantics and proof semantics as paired concerns.

Example:

`Button -> ButtonGroup -> Pattern -> View -> Tool`

If Button activation/focus/disabled behavior is already proven and the higher level does not change its preconditions, a Tool should not need to re-prove the Button implementation from zero. It inherits that evidence and adds proof obligations for the new behavior introduced by Tool-level composition.

The useful mental model is:

`higher-level proof obligations = valid inherited obligations + new semantic delta`

Missing evidence is never PASS.

Research uses/targets explicit dispositions such as:

- `proven`
- `failed`
- `unproven-gap`
- `not-applicable`

Human acceptance remains distinct from machine conformance.

## 4. Representation is not action

A visual component should not own business semantics merely because it triggers them.

Example:

A Button may present an `approve` action, but approval semantics can include target identity, conditions, current revision, authorization, canonical state transition, emitted events and result/recovery semantics. Those concerns must remain attached to the proper contracts/owners rather than being embedded into a special `ApproveButton` species.

This supports reuse and makes AI assembly more deterministic: AI can compose known representations with explicit commands/capabilities instead of inventing coupled widgets for each business verb.

## 5. Authorization projection is not canonical authorization

Station may hide, disable, mask or make presentation read-only according to projected authority/context, including hierarchical composition effects. That is UX/presentation behavior, not the security boundary.

A denied parent may prevent projection of its descendant subtree, while a child must never be able to escalate beyond the authority/context inherited from its ancestors. However, authoritative operations still require revalidation by the authoritative owner; hiding a control is never sufficient security.

This area must be carried into Proof Grammar with adversarial cases such as stale context/revision and attempted authority escalation.

## 6. Why constrained composition matters

The research intentionally prefers bounded grammar over arbitrary HTML/CSS freedom. Station authoring is expected to use constrained variants/patterns, discrete/span-based composition and responsive execution rather than unconstrained free-form layout.

This is intended to reduce ambiguity for humans and AI assemblers, improve structural testability, and make deformation/layout invariants machine-checkable. Runtime resizing may be responsive; authoring constraints and runtime projection are separate concerns.

## 7. Tool versus View versus Studio — working distinction

Use this only as a research orientation until synthesis:

- **View/Template:** a complete projection/arrangement for a bounded perspective.
- **Tool:** a coherent manual work surface orchestrating views/regions/capabilities/presentation state for a reusable work purpose.
- **Studio:** an upper-level specialized environment expected to coordinate multiple Tools/context around a larger engineering/work domain; final boundaries remain an R7/synthesis question.

A large View should not automatically be promoted to Tool, and a collection of Tools should not automatically be promoted to Studio. Promotion requires reusable semantics plus new proof obligations.

## 8. Process-centered canonical work artifact follow-up

A bounded follow-up research thread is studying a PSD-like process-centered work model: one root process/work artifact with multiple Tool/Studio projections, draft/revision/save/readback semantics and explicit currentness/proof obligations.

That research must preserve the distinction between canonical artifact and projections. It does not by itself authorize persistence implementation, storage topology, Artifact Repository, Studio Construction or Core authority changes.

## 9. How future contributors should use the material

1. Read `docs/DOCUMENT_AUTHORITY.md` before treating any research conclusion as executable authority.
2. Read `docs/current/NEXT_WORK.md` for the sole live operational pointer.
3. Read the accepted Station component-grammar contract/addendum and the S3 execution plan.
4. Traverse research in dependency order R1 -> R7 rather than cherry-picking an upper-level conclusion without its inherited assumptions.
5. Preserve provenance: distinguish repository evidence, external benchmark evidence, candidate rule, accepted rule and unresolved gap.
6. Never convert missing evidence into PASS.
7. Do not duplicate a lower-level proof unless a higher-level composition changes the proof preconditions.
8. When promoting a concept to a higher component level, state the reusable semantic delta and the new proof obligations.
9. Keep Station presentation/composition-oriented; do not silently move Core/business authority into UI contracts.
10. Feed unresolved contradictions and gaps into synthesis instead of resolving them by undocumented implementation choice.

## 10. Suggested reading path for humans and AI agents

Start with:

- `docs/DOCUMENT_AUTHORITY.md`
- `docs/current/NEXT_WORK.md`
- `docs/contracts/001-station-component-grammar/ADDENDUM.md`
- `project_docs/execution_planning/STATION-S3-COMPONENT-GRAMMAR-PLAN-01.md`

Then inspect `project_docs/research/` in round order, prioritizing final handoffs, proof matrices and exit matrices over kickoff notes. Kickoff/benchmark documents provide provenance and evidence but are not substitutes for accepted authority.

## 11. Durable principles already worth preserving through synthesis

These are research-navigation principles, not a declaration that every detail is already canonical:

- identity, placement, presentation and action semantics are distinct concerns;
- `ComponentRegistry != AppManifest`;
- `WindowGeometry != composition grid`;
- lower-level proofs may be inherited only while their preconditions remain valid;
- visual correctness alone is insufficient structural evidence;
- one artifact may have many synchronized projections, but projections must not silently fork canonical truth;
- Station projection of authority is not Core/business authorization;
- failure, unknown outcome and recovery semantics must be explicit rather than inferred as success;
- promotion to a higher compositional level should require reusable semantic value and corresponding proof delta;
- constrained composition is preferred over unlimited aesthetic/layout freedom for the System Builder factory workflow.

## 12. Maintenance rule for this guide

Update this guide when a research round closes, synthesis materially changes terminology, or a previously candidate concept becomes accepted/rejected. Do not use this file as the live execution pointer and do not overwrite provenance in historical research documents. If this guide conflicts with governing authority, governing authority wins.