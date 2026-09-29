# Station S3 — R7B Engineering Workbench / Product-Factory Benchmark — 01

Date: 2026-09-29
Status: RESEARCH EVIDENCE — NON-AUTHORITATIVE UNTIL SYNTHESIS/MATERIALIZATION
Fresh-main basis: `main@d2cd9b404501781de90564b2029277efdfcb023f`
Scope: bounded transversal challenge of the already-discovered C0→C10 Component Grammar + paired Proof Grammar. No product/Studio construction.

## Blocker-first revalidation

R7 is integrated through PR #972. The R7B branch starts exactly at fresh main (ahead 0 / behind 0 at admission). `docs/current/NEXT_WORK.md` is stale because it still points at pre-merge R7; this is a documentation reconciliation blocker, not product authority. R7B is the next eligible research step under the S3 plan.

Preserved invariants: identity != placement != presentation != action; ComponentRegistry != AppManifest; WindowGeometry != composition grid; span/discrete authoring; provider independence; Station has no Core/business authority; human acceptance != machine conformance; absence of evidence != PASS; AI/MCP is not part of the current foundation.

## Challenge method

For each benchmark, ask only which open Station question it answers or which hypothesis it challenges. External precedent is evidence, never SB authority. Classification is `own | adapt | adopt-pattern | defer`. Proof status is `proven | failed | unproven-gap | not-applicable`.

## Benchmark deltas

### 1. Blender — editor/area/workspace separation
Station question: is a Tool/Studio merely a large component tree, or does mature workbench composition require explicit editor/region/workspace boundaries?

Evidence: Blender defines Areas as screen-space containers for Editors; Areas are grouped into task-oriented Workspaces; Editors have purpose-specific Regions. Shortcut behavior can depend on active editor/context. Source: Blender Manual, Areas and Regions (retrieved 2026-09-29).

Convergence: strongly supports C5 Region, C8 Tool and upper-level workspace/context as different concepts rather than arbitrary nesting.
Divergence: Blender's mutable area geometry is not authority for Station composition; Station preserves discrete/span authoring and WindowGeometry separation.
Candidate finding: **Workbench Context Boundary** — Tool identity owns a coherent work purpose; workspace/application coordinates tools/context without absorbing their component identity.
Classification: adopt-pattern.
Proof obligation: context-sensitive command routing must resolve target/context deterministically and fail closed when invalid.
Inherited proofs: C1 focus/keyboard; C3 ordering; C4 command contract; C5 region ownership; C8 tool restoration.
Gap: cross-tool active-context/currentness remains `unproven-gap`.

### 2. JetBrains MPS — canonical model with projectional editors
Station question: can source/YAML, Inspector, Layers, Graph and rendered view be projections of one artifact rather than duplicated state?

Evidence: MPS is a language workbench with projectional editing; editor declarations project concepts through nested cells/UI, and reusable editor components avoid duplicated editor fragments. Generated artifacts are checked for regeneration consistency in CI. Sources: JetBrains MPS overview/editor/contribution documentation (retrieved 2026-09-29).

Convergence: supports one canonical structured model with multiple editors/projections and reusable projection components.
Divergence: Station is not adopting MPS's language/runtime or projection technology.
Candidate finding: **Projection Equivalence Contract** — each projection edits/reveals the same canonical artifact revision through typed operations; no projection becomes a second authority.
Classification: adapt.
Proof obligation: edit in projection A → canonical revision transition → B/C/D converge to same revision/meaning; stale projection rejects or reconciles explicitly.
Inherited proofs: C2 binding/local state, C3 collection identity/order, C4 command/result, C7 projection identity/revision.
Gap: true bidirectional multi-projection proof remains `unproven-gap`.

### 3. Eclipse Sirius — semantic model vs representations/viewpoints
Station question: should a visual representation own domain truth?
Evidence: Sirius's architecture is explicitly model/representation oriented: representations/viewpoints are defined over semantic models rather than replacing the semantic model.
Convergence: challenges any Station design where Graph/Layers/Inspector owns a duplicate artifact.
Candidate finding: **Representation Non-Authority Rule**.
Classification: adopt-pattern.
Proof obligation: deleting/rebuilding a representation must not delete or silently rewrite canonical semantic truth; representation references carry revision/currentness.
Inherited proofs: C7 projection identity/revision.
Gap: representation rebuild/recovery journey is `unproven-gap`.

### 4. Palantir Foundry — ontology-backed actions and operational projections
Station question: should a Button or visual widget encode business action semantics?
Evidence: Foundry exposes typed ontology Action types independently of application widgets; action application has validation/results and action logs can record successful decisions. Its docs explicitly warn that receipt/processing does not alone imply the requested action was applied successfully, and storage visibility can have currentness differences.
Convergence: strongly supports Station's separation `visual component -> binding -> intent/command -> target -> conditions -> authority -> effects -> result -> presentation consequences`.
Divergence: Foundry Ontology is not SB Core authority and is not adopted as provider.
Candidate finding: **Accepted != Effective Result Contract** plus **Action Presentation Independence**.
Classification: adapt.
Proof obligations: accepted-but-not-effective, rejected, stale, partial effect, retry-safe where declared, compensation/rollback where declared, evidence currentness.
Inherited proofs: C1 activation; C4 command dispatch/conditions/result; Core authority proof where applicable.
Gaps: partial-effect/compensation semantics remain `unproven-gap`.

### 5. Mendix — producer/runtime packaging pressure
Station question: does a factory-produced application require the producer to remain online?
Evidence: Mendix documents a model-to-deployment/runtime pipeline and Docker-oriented deployment concepts.
Convergence: useful factory comparison.
Divergence: SB constitutional authority is stronger: Builder != Runtime and published runtime autonomy are already repository invariants. External platform precedent cannot weaken that.
Candidate finding: **Producer Independence remains OWN**, not imported.
Classification: own.
Proof obligation: produced client runtime starts/operates from published artifacts/configuration while Builder/Station is unavailable.
Inherited proofs: existing repository autonomous-runtime evidence, where exact preconditions match.
Gap: S3 UI grammar must not re-prove runtime autonomy; only new generated UI/materialization delta is required.

### 6. Engineering/CAD pressure — artifact, dependencies and regeneration
Station question: when is a Tool/Application boundary justified instead of another configuration?
Convergence across mature engineering workbenches: durable artifact identity, dependency relationships, contextual editors and regeneration/consequence visibility matter more than raw widget count.
Candidate finding: promotion requires a **new invariant/ownership/lifecycle boundary**, not size or visual specialization.
Classification: own/adapt.
Proof obligation: promotion record must identify the invariant that cannot be expressed as configuration of the lower level; otherwise dedup rejects promotion.
Gap: representative CAD-family source extraction should be deepened during synthesis only if it changes a decision; no catalog expansion for its own sake.

## Promotion/dedup pressure result

A candidate becomes a new grammar piece only when at least one durable invariant is introduced that cannot be represented by configuration/binding of the lower level: new identity/lifecycle owner; new slot/nesting compatibility boundary; new state ownership; new interaction/authority contract; new artifact/context boundary; or new proof obligation with independent failure semantics.

If the difference is only label/icon/style/command binding/target/schema fields/provider/configuration, it remains configuration. Therefore `ApproveDocumentButton` is rejected when `Button + binding + approve command + document target/capability` expresses the case.

C0 Token → design constraint only.
C1 Primitive → minimal interaction/rendering contract.
C2 Compound → bounded primitive composition with local relationship invariant.
C3 Collection → repeated/ordered keyed membership semantics.
C4 Capability → reusable non-visual interaction/behavior contract.
C5 Pane/Region → bounded spatial/context role with named slots.
C6 Pattern → reusable semantic arrangement/interaction convention.
C7 Template/View → complete bounded projection of one canonical perspective.
C8 Tool → coherent manual work purpose over views/regions/capabilities.
C9 Application → independently addressable product/runtime composition and lifecycle above tools; AppManifest remains configuration.
C10 Studio → coordinated specialized engineering/work environment across Tools/context/artifacts; not a synonym for “many tools”.

## Proof Grammar inheritance

C0: token domain/constraint determinism.
C1: activation, focus, keyboard, accessibility, local state.
C2: inherit C1; prove composition/slot and local coordination delta.
C3: inherit C1-C2; prove key/order/selection/membership delta.
C4: inherit visual activation only when unchanged; prove intent/command/target/conditions/authority/effects/result/failure.
C5: inherit contained elements; prove region ownership, slots, focus/context boundary and responsive structural behavior.
C6: inherit lower pieces; prove semantic arrangement and journey delta.
C7: inherit C0-C6; prove canonical projection, revision/currentness, responsive/non-deformation and cross-projection synchronization.
C8: inherit C0-C7; prove tool purpose, active context, restoration, command scope and extension boundary.
C9: inherit Tool proofs; prove application identity/lifecycle, packaging, manifest separation, multi-tool coordination and runtime autonomy delta.
C10: inherit Application/Tool proofs; prove specialized cross-tool/artifact coordination and authority boundaries only; do not re-test primitive behavior.

All currently unevidenced obligations remain `unproven-gap`; none are promoted to PASS by benchmark convergence.

## Grammar Sufficiency Test — R7B pressure

Required cases remain: document approval, ticketing, CRUD, operational dashboard, deployment configuration, plus existing Work Order pressure where useful.

Coverage questions:
1. Can each case be expressed using the same small C0-C10 grammar without a domain-specific primitive?
2. Can commands be expressed through bindings/contracts rather than visual variants?
3. Can Inspector fields derive from selected component/capability/command schemas?
4. Can Layers/Inspector/Graph/source project one artifact revision?
5. Can failure/currentness be represented without feature-specific escape hatches?
6. Can provider changes occur beneath stable capability contracts?

Current status: **unproven-gap** until synthesis materializes the cases and coverage matrix. No score is assigned.

## Provider/ownership pressure

R7's horizontal provider catalog is preserved. R7B adds a rule: provider substitution is a delta proof below the SB-owned capability contract. It must not force a new Station component or alter canonical domain semantics. Core/factory semantics (Catalog, Assembly, Compiler/materialization, evidence/provenance, lineage, portability/governance) remain own-work candidates unless synthesis finds an explicit replaceable boundary. Commodity execution/storage/identity/telemetry may remain provider-first behind SB contracts.

## Synthesis inputs promoted as candidates, not authority

1. Workbench Context Boundary.
2. Projection Equivalence Contract.
3. Representation Non-Authority Rule.
4. Accepted != Effective Result Contract.
5. Action Presentation Independence.
6. Promotion-by-new-invariant rule.
7. Producer Independence preservation.
8. Provider substitution below stable capability contracts.

## Synthesis gate

R7B does not authorize Construction. Synthesis must reconcile R1→R7B into a Decision Graph containing candidate decision, evidence, convergence/divergence, own/adapt/adopt-pattern/defer disposition, dependencies, proof obligations, inherited proofs, gaps and authority impact. It must materialize the Grammar Sufficiency coverage matrix and explicit Test Review/Hardening + QA Coverage/Evidence Review gates before any Construction TASK is eligible.
