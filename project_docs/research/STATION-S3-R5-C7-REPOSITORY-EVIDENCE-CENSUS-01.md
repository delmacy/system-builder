# Station S3 R5 — C7 Repository Evidence Census 01

Status: research evidence only; non-authoritative until S3 synthesis/materialization.
Base: `main@19c87172c19e9bae5bf39848a0db9d09798705ce`
Phase: R5 — Templates / Full Views

## Purpose

Separate executable lower-level evidence from C7 Template/View hypotheses. Coverage is strictly `proven | failed | unproven-gap | not-applicable`; absence of focused evidence is never PASS.

## Current repository evidence

### EditorShell anatomy

`packages/ui-core/editor-shell.tsx` is domain-neutral layout chrome. It owns layout only and leaves graph, selection, command, persistence and business authority with callers. Its explicit slots cover toolbar, palette, work area, layers, inspector and status.

Classification: `proven` only for the bounded shell anatomy already exercised by its colocated test. This is C5 evidence inherited by C7 when preconditions remain unchanged; it is not proof of a C7 Template/View contract.

### CompositionEditorEngine

`packages/station-composition/editor-engine.ts` creates editor state over a composition graph and ComponentRegistry. Existing product hardening includes fail-closed unknown selection behavior. Historical TASK-620 is completed and explicitly scoped colocated tests to the package.

Classification: `proven/bounded` for the focused lower-level state/controller behaviors actually covered by tests. C7 may inherit those graph/selection/draft invariants but must not infer full-view reuse, persistence, source round-trip or responsive semantics.

### Component Editor specialization

`packages/station-composition/component-editor.ts` normalizes a component definition and composes it with the shared editor state. Historical planning explicitly preserves component identity/registry metadata distinct from AppManifest.

Classification: evidence that specialization can remain bounded over the shared engine. It does not establish Template/View identity, cross-domain instantiation, or application authority.

### Component Lab proof surface

`apps/station/web/app/component-lab-editor-proof.tsx` composes EditorShell, PropertyInspector and Tree around editor state. This is useful presentation evidence, but it is not authority for canonical C7 semantics. Previous R4 census already identified that projection derivation/synchronization remains incomplete.

Classification: `proven/bounded` only for the explicitly tested/visible lower-level presentation path; broad C7 projection synchronization remains `unproven-gap`.

## Planning evidence that must not be mistaken for implementation

`STATION-COMPONENT-COMPOSITION-PLAN-01.md` calls for a future Window/View Editor editing a declarative composition graph, with View Tree separate from Component Tree, constrained insertion, discrete row/column spans, responsive/layout variants and a normalize/validate/canonical-definition/Draft-Revision save pipeline.

This is useful prior intent, not executable C7 proof. In particular, the plan does not establish a current `ViewDefinition` runtime contract, source/YAML authority, persistence semantics, or a generic Template Manager.

## C7 proof inheritance

C7 may inherit lower-level proofs only where preconditions are unchanged:

- EditorShell region anatomy and layout-only authority boundary;
- CompositionEditorEngine graph/selection/draft invariants actually covered by focused tests;
- ComponentRegistry identity remaining distinct from AppManifest;
- C4 command/target/currentness and result non-strengthening semantics;
- C5 identity != placement and presentation-only region behavior;
- C6 contextual action binding semantics;
- projection/source identity/currentness/non-strengthening semantics in their owning bounded contexts.

C7 must add delta proof for any changed context: definition/instance identity, typed role compatibility, cross-domain reuse, responsive arrangement, projection mutation, serialization, round-trip, history or revision semantics.

## Coverage census

| Candidate C7 obligation | Repository evidence now | Coverage | Smallest future delta proof |
| --- | --- | --- | --- |
| stable Template/View definition identity | planning intent only | unproven-gap | identity survives admitted configuration/layout changes and save/reopen |
| definition vs instance/configuration | lower-level component specialization suggests the boundary | unproven-gap | two instances/domains share one definition without feature-name branching |
| typed semantic roles/slots | EditorShell has named slots; lower-level compatibility exists | unproven-gap | incompatible participant rejected before canonical mutation; compatible replacement preserves role contract |
| bounded variants | component-level variant concepts exist in planning/research | unproven-gap | variant changes admitted properties without silently changing semantic definition identity |
| discrete responsive arrangements | span/discrete authoring is preserved as architecture constraint | unproven-gap | semantic node/role/command identity and focus/accessibility obligations survive arrangement switch |
| Inspector projection | PropertyInspector/presentation path exists | unproven-gap | contract/schema derives fields and edit produces exactly one owning canonical mutation/revision |
| Layers/Graph projection | Tree/Layers presentation exists | unproven-gap | same canonical node refs are resolved and invalid semantic reparent/order fails at owner boundary |
| source/YAML projection | no focused C7 executable evidence found | unproven-gap | parse/validate -> one owner mutation -> one revision; stale/unknown/lossy cases fail safely |
| multi-projection synchronization | projection semantics exist in other owners | unproven-gap | one canonical revision regenerates Inspector/Layers/Graph/preview/source without secondary authority |
| structural undo/history | lower-level draft/history intent exists | unproven-gap | undo targets canonical authoring mutation and regenerates projections, distinct from business compensation |
| cross-domain Grammar Sufficiency | five exemplars are modeled in R5 matrix | unproven-gap | same C7 contract is instantiated across materially distinct exemplars without ad hoc grammar pieces |

## Dedup consequences

The census does not justify `ApprovalTemplate`, `TicketView`, `CrudTemplate`, `DashboardTemplate`, `DeploymentView`, `TemplateManagerAuthority`, `LayersStateAuthority`, `InspectorCanonicalState`, or a second source/YAML authority. Existing evidence instead favors one declarative composition grammar plus bounded configuration and owner-mediated mutations.

## R5 exit implication

No newly discovered repository artifact contradicts the C7 candidate grammar:

`definition identity + typed semantic roles/slots + compatibility + bounded variants + discrete responsive arrangements`.

The executable repository evidence is predominantly lower-level and therefore inherited, not re-proved. The C7-specific rows remain explicit `unproven-gap` with smallest future delta proofs. This is acceptable for research handoff because R5 is defining what future Construction must prove, not manufacturing PASS from planning or visual evidence.

Human acceptance remains separate from machine conformance. QA/test evidence cannot create product authority. Construction, Studios and AI/MCP remain out of scope.