# Station S3 — Synthesis Decision Graph 01

Date: 2026-09-30
Status: RESEARCH SYNTHESIS — NON-AUTHORITATIVE
Truth base: main@d2cd9b404501781de90564b2029277efdfcb023f
Scope: R1→R7B synthesis only. This artifact records research decisions/gaps; it does not authorize Construction or create Core/business authority.

## Invariants
- Complexity ladder remains C0 Token → C1 Primitive → C2 Compound → C3 Collection → C4 Capability → C5 Pane/Region → C6 Pattern → C7 Template/View → C8 Tool → C9 Application → C10 Studio.
- identity != placement != presentation != action.
- semantic patterns sit above primitives.
- composition authoring remains discrete/span-based with responsive execution.
- one authority / many projections.
- missing evidence is UNPROVEN, never PASS.
- research evidence is not authority.

## Decision graph

| ID | Decision | Disposition | Provenance / rationale | Consequence / unresolved proof |
|---|---|---|---|---|
| D01 | Preserve C0→C10; do not invent C11 from benchmark richness. | own | R1→R7B closure | C10 still needs delta proof. |
| D02 | Keep a small stable primitive base; express domain meaning above it. | own + adopt-pattern | R1/R2 parity | Prevent primitive proliferation/provider taxonomy lock-in. |
| D03 | Separate identity, placement, presentation and action semantics. | own | Addendum + R1→R4 | Same semantic action may have multiple surfaces/projections. |
| D04 | Keep semantic Patterns above generic components/collections. | own | R2/R4 | Pattern journeys prove semantics; primitive visuals do not own business meaning. |
| D05 | Keep discrete/span composition distinct from WindowGeometry. | own | M2 inheritance + R5 | Structural/responsive proof required. |
| D06 | Treat Layers/Inspector/Graph/source/preview as projections of one canonical truth. | own + adopt-pattern | R5 + R7B MPS/Sirius/CAD evidence | Projection convergence/currentness remains UNPROVEN. |
| D07 | Semantic reparent/order is a structural mutation, not visual drag placement. | own | R3 gaps + R7B dependency evidence | Must prove consequences and invalid/stale states. |
| D08 | Separate working revision from durable/materialized revision. | adapt | R7B CAD/CAE regeneration + synthesis | Requires recovery/reopen/materialization proof. |
| D09 | Use one logical artifact with structured sections/contracts; do not expose physical representation to Tools. | own + adapt | R7/R7B + synthesis | YAML/JSON/container/SQLite/other physical encoding is deferred. |
| D10 | Introduce a research candidate Working Artifact Authority / Artifact Engine as horizontal infrastructure. Tools propose semantic mutations; they do not write artifact bytes. | own | synthesis of D06/D08/D09 | Candidate only; must pass contract/boundary materialization before Construction. |
| D11 | Initial concurrency model: 1 logical artifact + 1 active Working Revision + N attached editors/projections. | own | blocker-minimizing synthesis | CRDT, multi-master and parallel working revisions/merge are deferred. |
| D12 | Admit mutations by semantic capability/contract, not by Tool ownership of physical file sections. | own | identity/action separation + artifact synthesis | Requires capability enforcement/adversarial proof. |
| D13 | Adapt a mutation journal/checkpoint concept for deterministic ordering, undo/redo, recovery/replay and provenance without choosing persistence technology. | adapt | mature editor/workbench pattern | Replay equivalence and crash recovery remain UNPROVEN. |
| D14 | Save is semantic materialization: coherent snapshot → validation → consequence/currentness closure → serialization → integrity verification → atomic commit → next durable revision. | own + adapt | CAD/CAE + transactional durability pattern | Crash-before/after-commit and integrity failure tests required. |
| D15 | Application C9 remains distinct from AppManifest/configuration and from Tool C8. | own | R7 | C9 journeys/context/routing/readback/restoration remain explicit. |
| D16 | Studio C10 candidate = coordinated multi-Tool structural authoring over one shared Working Revision authority plus cross-Tool consequence/currentness and materialization/reopen lifecycle. | own + adapt | R7 + R7B + artifact synthesis | UNPROVEN until C10 Delta shows reusable property not reducible to C9+C8+configuration. |
| D17 | Station reuses/projects Core contracts; projection identity/revision never becomes Core/canonical business authority. | own | R7 Core projection census | Cross-boundary proof required before deeper coupling. |
| D18 | Producer independence is multi-axis: build/runtime/management/data-config/substitution/exit-rebuild. | adapt | R7B provider portability | Avoid binary “independent” claims. |
| D19 | Export success is not portability proof; portability requires scoped capture, dependencies, import/rebind and semantic verification/rebuild. | adapt | R7B export/import falsification | Portability remains UNPROVEN where round-trip evidence is absent. |
| D20 | Pair Component Grammar with Proof Grammar; every promotion inherits valid lower proofs and adds level-specific delta obligations. | own | Addendum + R1→R7B | No evidence → UNPROVEN. |
| D21 | Decision Graph is canonical research-decision representation; trees/handoffs are projections where useful. | own | S3 plan | Must preserve provenance, supersession, rejected/deferred alternatives and eligible work. |

## Proof/test matrix

| Level / boundary | Minimum delta proof focus |
|---|---|
| C0–C1 | deterministic contracts, variants/states; interaction/a11y where interactive |
| C2 | slot/parent compatibility and compound interaction beyond inherited primitive proofs |
| C3 | collection ordering/selection/focus/keyboard and adversarial states |
| C4 | reusable state-transition capability, invalid transitions, dispatch/focus/validation/dirty semantics |
| C5 | region boundaries, named slots, structural/layout invariants |
| C6 | semantic pattern journeys; action meaning independent of visual primitive |
| C7 | schema/composition invariants, responsive spans, multi-projection convergence, visual/structural regression |
| C8 | tool context/lifecycle, restoration, multi-view/extension and critical journeys |
| C9 | application identity, multi-Tool routing/context, artifact lifecycle/save-readback/restoration |
| C10 | C10 Delta: shared Working Revision, cross-Tool consequences/currentness, materialization/reopen |
| Station/Core | contract reuse/projection compatibility; no duplicated authority |
| Artifact Authority candidate | single-working-revision admission; concurrent-producer ordering; mutation-capability enforcement; checkpoint/recovery; journal replay equivalence; atomic materialization; integrity failure; crash-before/after-commit; reopen equivalence |

## Deduplicated gap families
1. Projection convergence/currentness: source/YAML, Inspector, Layers, Graph, preview.
2. Structural consequence/revision: semantic reparent/order, dependencies, stale/regeneration semantics.
3. Action/surface: identity/action dispatch independent of presentation/placement.
4. C8/C9/C10 promotion: context/restoration, routing/readback, C10 Delta.
5. Working Artifact Authority: admission, ordering, capability enforcement, journal/recovery, integrity, atomicity, reopen.
6. Producer independence/portability: multi-axis dependency and export/import/rebind/rebuild evidence.
7. Decision/Proof infrastructure: provenance/supersession plus explicit PROVEN/FAILED/N/A/UNPROVEN evidence state.

## External evidence disposition
R1 parity ecosystems (Radix/Base/React Aria, shadcn, MUI, Fluent, Carbon, PatternFly, Chakra, Ant) remain comparative evidence, not authority. R7B transversal evidence includes Unreal/MPS/Sirius/Mendix, CAD/CAE families, Foundry, OpenTofu/Crossplane, Kubernetes/Keycloak/PostgreSQL. Reusable concepts are classified here as own/adapt/adopt-pattern/defer; no external provider taxonomy or implementation is copied wholesale.

## Deferred explicitly
- physical artifact encoding/storage choice;
- CRDT/multi-master/parallel Working Revisions and merge;
- specialized Studio construction;
- AI/MCP foundation;
- provider-specific authority in Station.

## Dependency-safe handoff
Next: audit D01–D21 against R1→R7B for omitted/superseded decisions, then materialize Test Review/Hardening planning and QA Coverage/Evidence Review planning. Construction remains ineligible until those gates and explicit Construction materialization are satisfied.
