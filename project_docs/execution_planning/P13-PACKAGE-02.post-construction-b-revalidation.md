# P13-PACKAGE-02 — Post-Construction-B Fresh-Main Revalidation

Date: 2026-08-24
Status: REVALIDATED / CONSTRUCTION C NECESSARY / MATERIALIZATION ELIGIBLE
Fresh-main base: `64b06414718ac8160eeb423d8194ef9d12b46a85`
Work Package: `P13-PACKAGE-02 — Autonomous Runtime Identity, Authority & Generated Experience`
Primary WBS: 13.2.1-13.2.3

## Purpose
Reconstruct repository truth after Construction B integration, reconcile the Package Goal against actual integrated behavior, and decide whether optional Construction C is necessary or Package Integration & Review is the next eligible gate.

## Integrated predecessor evidence
Construction B `P13-RUNTIME-AUTHORITY-GENERATED-INTERACTION-01` completed TASK-240..248 and was integrated by Sprint Review PR #274 from exact reviewed head `09a9fd083c398678192c24af9b3f5c6aa188071a` after Deterministic CI #634 PASS and Heavy Product Tests #59 PASS. Merge-main is `64b06414718ac8160eeb423d8194ef9d12b46a85`.

Construction A remains integrated and WBS 13.2.1 remains satisfied. TD-P13-01..04 remain carried and outside this package execution.

## Actual coverage after Construction B
### WBS 13.2.1 — SATISFIED
Identity/auth/session behavior is integrated and unchanged.

### WBS 13.2.2 — SATISFIED
Integrated Runtime now has explicit identity/membership-to-role resolution, deterministic permission evaluation, bounded structured policy evaluation, default-deny behavior, auditable reference-only evidence and shared authority gating. Authentication does not imply authorization and free-text policy remains non-executable.

### WBS 13.2.3 — PARTIALLY SATISFIED / RENDERING GAP REMAINS
Construction B added explicit view/form binding descriptors, deterministic Compiler projection, RuntimeModel transport, generated binding materialization and authority-gated generated interaction. However, fresh repository inspection found no Runtime renderer or render-output abstraction that turns the integrated view/form binding plus entity data into a deterministic user-consumable generated view/form representation.

The current capability therefore proves what a generated view is bound to and whether an interaction is authorized, but not the Package Goal wording to actually render generated views/forms/interactions.

## Construction C decision
Optional Construction C is NECESSARY under `SPRINT_GENERATION_POLICY.md` because a bounded product capability required by the Package Goal remains missing after two integrated Construction Sprints.

The gap can be closed without new L3 contract semantics or L4 architecture:
- existing public `SystemDefinition.views.kind` and explicit binding data are sufficient;
- Compiler/Runtime may carry the already-declared view kind without changing the public contract;
- Runtime may materialize a renderer-agnostic generated view/form document from explicit bindings and supplied entity data;
- generated interaction may reuse the already-integrated shared authority gate;
- no browser framework, provider-specific UI, new bounded context, topology change or Builder lookup is required.

If implementation proves a public contract or L4 boundary change is actually required, stop at the relevant change-control/ADR gate rather than widening this Sprint.

## Bounded Construction C scope
Construction C should close only the remaining WBS 13.2.3 rendering gap:
1. preserve/project declared view kind through Compiler/RuntimeModel;
2. materialize deterministic renderer-agnostic view/form documents from explicit bindings and supplied record data;
3. validate generated form input only against explicitly bound fields, fail closed on unknown/unbound input and avoid inferred coercion;
4. connect rendered actions to the existing authority-gated generated interaction path without new authorization semantics;
5. extend the growing E2E proof across generated rendering + authorized/denied interaction.

## Explicit exclusions
No new public SystemDefinition contract unless separately authorized; no UI framework; no CSS/design system; no client-side framework; no inferred labels/fields/actions/roles; no free-text policy execution; no Builder/Observe dependency; no TD-P13-01..04; no P13-PACKAGE-03.

## Decision
- P13-PACKAGE-02 remains ACTIVE.
- WBS 13.2.1: SATISFIED / INTEGRATED.
- WBS 13.2.2: SATISFIED / INTEGRATED by Construction B.
- WBS 13.2.3: PARTIAL; deterministic binding/gating integrated, generated rendering still missing.
- Construction C: NECESSARY and eligible for one bounded materialization.
- Package Integration & Review remains FORECAST until Construction C passes Sprint Review and integrates.
- Documentation & Closure remains FORECAST.
- P13-PACKAGE-03 remains NOT STARTED.

## Next gate
Materialize at most one Construction C Sprint on this fresh-main base. Product execution must not begin until that materialization PR receives required exact-head checks and is integrated into `main`.