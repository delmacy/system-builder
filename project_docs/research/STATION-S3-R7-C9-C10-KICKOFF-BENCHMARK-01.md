# Station S3 — R7 C9/C10 Application & Studio-readiness Kickoff / Benchmark 01

Date: 2026-09-28
Status: RESEARCH EVIDENCE — NON-AUTHORITATIVE
Base: `main@1ad0f77c6e15482e2706c530e7c61f4305e585d1`
Branch: `station-s3-r7-studio-readiness`

## 1. Purpose

R7 is the last research round before synthesis. It investigates C9 Application and C10 Studio readiness without constructing a specialized Studio and without moving Core/business authority into Station. Component Grammar and Proof Grammar remain paired: every promotable finding carries inherited proofs, delta proof obligations and explicit gaps.

R7 is blocker-first. Before proposing a new Station/Core contract it must perform the Core Contract Reuse & Station Projection Census required by Addendum 001.

## 2. Preserved invariants

- identity != placement != presentation != action;
- `ComponentRegistry != AppManifest`;
- `WindowGeometry != composition grid`;
- span/discrete authoring with responsive execution;
- one canonical artifact may have multiple projections, but projections do not become competing authorities;
- Station projects context/authority/results; authoritative business decisions remain with their owners;
- inherited proofs are reused only while their preconditions remain unchanged;
- missing evidence is `unproven-gap`, never PASS;
- human acceptance is distinct from machine conformance;
- no Studio Construction and no AI/MCP foundation in R7.

## 3. Station current state -> open questions

R6 produced a C8 Tool candidate centered on Tool identity, participant-role contracts, active-context routing, command/capability projections and presentation/restoration policy. R7 asks what genuinely changes above that boundary.

### C9 Application open question

Hypothesis: Application is not merely a large Tool and not merely an AppManifest. A promotable C9 Application must add a reusable lifecycle/assembly boundary around one or more Tools, artifact/context entry, declared capabilities/contributions and restoration/persistence policy while remaining presentation/composition-oriented.

Candidate C9 family:

`application identity + declared tool/contribution set + entry/context contract + lifecycle/restoration boundary + app-level navigation/projection policy`

Configuration such as app label, icon, default Tool, enabled contributions, initial layout or domain binding remains AppManifest/configuration unless it introduces a reusable invariant with a new proof delta.

### C10 Studio open question

Hypothesis: Studio is not `array<Tool>` and not a branding tier. Promotion to C10 requires a reusable cooperation model across multiple Tools around a larger engineering/work domain, with shared artifact/context semantics, cross-Tool consequence propagation and bounded lifecycle/navigation that cannot be expressed as C9 configuration alone.

Candidate C10 family:

`studio identity + shared work-context/artifact projection + cooperating tool-role contracts + cross-tool navigation/consequence policy + bounded workspace lifecycle`

A collection of unrelated Tools, or a preset layout of Tools, is not sufficient for promotion.

## 4. Benchmark extraction — comparative grammar, not catalog copying

### VS Code workspaces

Question answered: can a higher-level work context group multiple roots/configurations without changing each participant's own identity?

Evidence: VS Code supports multi-root workspaces represented by a `.code-workspace` JSON document listing folders and workspace-scoped settings. Folder-specific configuration can remain distinct while workspace configuration supplies a higher scope.

Convergence: higher-level context can aggregate participants without rewriting participant identity. Divergence: Station must not adopt VS Code's file format or filesystem assumptions as authority.

Classification: **adopt-pattern** — explicit higher-level context/manifest scope distinct from participant identity.

Proof obligation: changing workspace/application configuration must not silently mutate Tool/component identity or canonical business state.

Inherited proofs: C8 Tool identity/participant contracts where preconditions remain unchanged.

Gap: no Station C9 machine proof yet.

### JetBrains workspace

Question answered: does aggregation require destructive migration of underlying projects/artifacts?

Evidence: IntelliJ IDEA workspaces can combine projects while leaving original project configuration and location unchanged; the Project tool window exposes included projects and additional tool windows according to detected context.

Convergence: aggregation can be projection/context over independently identified participants. Divergence: JetBrains project/build-tool semantics are provider/product-specific and are not Station contracts.

Classification: **adopt-pattern** — non-destructive aggregation plus contextual Tool contribution.

Proof obligation: application/studio membership must preserve participant identity and reject incompatible contributions fail-closed.

Gap: contribution compatibility/currentness is unproven in Station at C9/C10.

### Blender workspaces

Question answered: is a task-oriented workspace itself equivalent to an application/studio?

Evidence: Blender describes Workspaces as predefined window layouts containing Areas/Editors for tasks such as modeling or scripting; workspaces may be duplicated/reordered and can be saved in the `.blend` file. Workspace settings may remember scene/mode.

Convergence: task-oriented workspace may carry presentation plus bounded context. Divergence: this challenges automatic C10 promotion — much of what looks like a specialized environment can still be layout/context configuration over stable editors.

Classification: **adapt** — use as a dedup challenge: a Studio must prove semantics beyond saved layout/editor selection.

Proof obligation: if Studio promotion is proposed, demonstrate a semantic delta not reproducible by Application + Tool configuration.

Gap: C10 promotion remains unproven.

### Adobe Photoshop workspaces

Question answered: do panel arrangements, menus and keyboard presets justify a new semantic component tier?

Evidence: Photoshop custom workspaces can save panel locations, keyboard shortcuts and menus; panels can be docked, hidden, moved or grouped.

Convergence: substantial UX specialization may remain presentation/restoration configuration. Divergence: Station uses constrained composition and must not import free-form docking as its authoring grammar.

Classification: **adopt-pattern for dedup only** — workspace customization is evidence against over-promoting presentation presets.

Proof obligation: C9/C10 identity must survive allowed presentation changes; presentation-only customization must not create a new Application/Studio species.

Gap: no C9/C10 Station proof yet.

## 5. Initial convergence / divergence

Independent benchmarks converge on a useful negative rule: **workspace richness does not by itself prove a new semantic tier**. Multi-root context, contextual contributions, saved layouts, menus, shortcuts and panels can all exist while underlying participant identities remain stable.

Therefore R7 adopts a strong promotion barrier:

- C8 -> C9 only for a reusable application lifecycle/assembly invariant not reducible to Tool configuration;
- C9 -> C10 only for a reusable cross-Tool cooperation/shared-work-context invariant not reducible to Application manifest/layout configuration.

Provider-specific workspace files, docking models, filesystem/project models and extension APIs are evidence only and are not adopted as Station authority.

## 6. AppManifest and ComponentRegistry separation

`ComponentRegistry` answers what component definitions/contracts exist and are compatible.

`AppManifest` is expected to answer which already-defined Tools/contributions/configuration an application instance declares, plus bounded metadata/entry defaults allowed by accepted contracts.

Neither may silently become the other. Adding a Tool to an AppManifest must not register a new component species. Registering a component must not implicitly install/enable an application.

C9 proof delta candidate: manifest resolution is deterministic, references known compatible Tool/contribution identities, rejects unknown/incompatible references fail-closed and does not mutate canonical business state merely by resolving presentation/application configuration.

## 7. Core Contract Reuse & Station Projection Census — research protocol

Before any new cross-boundary contract is proposed, R7 will census repository evidence for:

1. artifact/process identity and revision/currentness;
2. command/capability identity, target and conditions;
3. authority/authorization projection and authoritative revalidation;
4. result/evidence states including accepted/effective/partial/unknown/stale;
5. lifecycle/save/readback/version semantics;
6. event/consequence propagation and reconciliation;
7. application/tool contribution descriptors already present;
8. existing Station Gateway/SDK projection boundaries.

Each candidate is classified `reuse`, `project/adapt`, `genuine-gap`, or `defer`. `genuine-gap` is not authority to create a Core contract; L3/L4 changes still require normal contract/ADR authority.

## 8. Proof Grammar C9/C10 — initial obligations

All entries below start `unproven-gap` unless repository census finds valid executable evidence.

| Level | Obligation | Inherited proof candidate | Smallest new proof |
|---|---|---|---|
| C9 | stable Application identity | C8 Tool identity | configuration/layout change preserves Application identity |
| C9 | manifest/tool compatibility | C7/C8 role compatibility | unknown/incompatible Tool contribution rejected before activation |
| C9 | deterministic entry/context routing | C8 active-context routing | same entry/context resolves same declared Tool/command projection |
| C9 | lifecycle/restoration currentness | C8 restoration boundary | reopen restores presentation/config only and revalidates current artifact/business context |
| C9 | contribution isolation | C8 extension boundary | one contribution cannot bypass registries/contracts/authority |
| C9 | AppManifest != ComponentRegistry | lower registry contracts | manifest resolution cannot create component authority |
| C10 | stable Studio identity | C9 Application identity | Tool arrangement/config changes preserve Studio identity |
| C10 | shared work-context projection | C9 entry/context + C7 projection rules | cooperating Tools resolve one canonical artifact/context reference without duplicated truth |
| C10 | cross-Tool consequence propagation | C8 multi-view result rule | one authoritative result/revision updates all affected Tool projections without local strengthening |
| C10 | Tool-local vs shared context isolation | C8 active context | Tool-local selection/focus cannot silently overwrite shared canonical context |
| C10 | failure/recovery preservation | C4/C8 result semantics | partial/unknown/stale/reconcile-required remains visible across Tool boundaries |
| C10 | dedup/promotion integrity | C0-C9 promotion rules | demonstrate Studio semantic delta beyond layout/manifest preset |

## 9. Failure/recovery semantics

R7 preserves the interaction chain:

`intent -> command -> target -> conditions/currentness -> authority owner -> effect request -> result/evidence -> presentation consequences`

Application/Studio may coordinate projections and navigation around the result; they do not strengthen `accepted` into `effective`, invent retry eligibility, or reinterpret closing/rearranging Tools as compensation/rollback. Retry/compensation/rollback remain explicit owner/capability semantics and must be revalidated against current state.

## 10. Grammar Sufficiency Test — R7 pressure cases

The same five classes remain mandatory:

- document approval;
- ticketing;
- CRUD;
- operational dashboard;
- deployment configuration.

R7 must determine whether C0-C9 can express all five with the same small grammar by varying manifests, Tool participants, capabilities and bindings. C10 is **not automatically required** for every case. A Studio is justified only if a case (or multiple independently different cases) demonstrates a reusable cross-Tool/shared-context invariant that cannot be expressed as C9 configuration without an escape hatch.

Coverage is recorded by obligation/gap, not a synthetic score. Current R7 disposition: **candidate sufficiency / unproven-gap**.

## 11. Dedup rules

Reject by default: `ApprovalApplication`, `TicketApplication`, `CrudApplication`, `DashboardApplication`, `DeploymentApplication`, and similarly named Studios, when the difference is only manifest/configuration/domain binding.

Promote only when all are true:

1. a reusable semantic invariant exists;
2. it recurs independently across materially different domains/use cases;
3. lower-level configuration cannot express it without an escape hatch or semantic branching;
4. ownership is explicit;
5. the new invariant has a delta proof obligation;
6. promotion does not transfer Core/business authority to Station.

## 12. R7 next evidence

Blocker-first next steps:

1. repository census for Application/AppManifest/workspace/artifact/context/Core projection contracts and tests;
2. classify each Core/Station boundary candidate as reuse/project-adapt/genuine-gap/defer;
3. derive C9/C10 representative journeys and Exit/Proof Matrix;
4. adversarially test dedup against the five sufficiency domains;
5. carry all unresolved C3-C8 gaps into synthesis without laundering them into PASS;
6. only after R7 integration, begin synthesis/materialization planning.

No Construction or specialized Studio is authorized by this document.
