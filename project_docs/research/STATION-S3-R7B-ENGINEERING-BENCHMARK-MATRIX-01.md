# Station S3 — R7B Engineering Workbench / Product-Factory Benchmark Matrix 01

Date: 2026-09-29
Status: RESEARCH EVIDENCE — IN PROGRESS
Truth base: `main@d2cd9b404501781de90564b2029277efdfcb023f`
Branch: `station-s3-r7b-engineering-benchmark`
Predecessor: R7 handoff integrated by PR #972.
Authority: research only; no Construction, Core/business authority, or taxonomy promotion.

## Purpose

Challenge, rather than confirm, the accumulated C0→C10 grammar. This tranche is deliberately blocker-first and concentrates on three discriminators before broader provider/portability work:

1. canonical artifact/model ownership;
2. producer/factory versus produced/client independence;
3. C8 Tool → C9 Application → C10 Studio/System promotion.

All findings preserve identity != placement != presentation != action, one-authority/many-projections, semantic patterns above primitives, discrete/span composition, and missing evidence = `unproven-gap`.

## Initial falsification matrix

| Family | Evidence relevant to S3 | S3 classification | Existing decision pressure | Proof delta / gap |
|---|---|---|---|---|
| Unreal Engine | Asset Registry is an editor subsystem indexing asset information; Content Browser consumes it. Editor asset APIs save the package containing an asset and expose dirty-sensitive save. | adapt | Confirms artifact lifecycle and projection/index separation; does **not** prove that rich editor/workbench UI alone requires C10. | Need SB-owned working-artifact/revision/currentness semantics and cross-Tool consequence proof; do not import Unreal package/plugin architecture. |
| JetBrains MPS | Projectional editor directly manipulates AST nodes; multiple presentations may visualize the same language/model. Editor declarations/cells are projections over concepts. Current Projectional Agent Toolkit exposes structural model operations to agents instead of brittle XML text editing. | adopt-pattern / adapt | Strongly confirms canonical structured model + multiple projections and structurally admitted mutation. Challenges any design where source text, Inspector, Layers, Graph and preview become competing authorities. | Need SB proof for canonical graph → projections, stale protection, structural edit admission, references/constraints and round-trip/source projection. MPS runtime architecture remains reference-only. |
| Eclipse Sirius | Semantic/domain models are explicitly separated from representation models; multiple diagrams/tables/trees can represent the same semantic model. Sessions coordinate semantic and representation resources; model access mediates edits/permissions. | adopt-pattern / adapt | Strong convergence with one authority/many projections and with keeping presentation geometry outside semantic ownership. Also shows that a modeling workbench can have multiple editable representations without making each representation canonical. | Need SB-owned projection identity/revision, permission/capability boundary, dirty/currentness and synchronization proofs. EMF/Eclipse session/plugin machinery is reference-only. |
| Mendix | MxBuild converts an app model into a deployment package; deployment packages can target multiple environments. Runtime deployment interprets the packaged app model; Build/Deploy APIs separate package creation from environment deployment. | adapt / reference-only | Confirms producer/build/deploy/runtime as separable lifecycle concerns. Challenges a simplistic “produced system has zero producer/runtime dependency” rule: some factories produce portable packages that still require a vendor runtime. SB must decide its stronger independence invariant explicitly rather than infer it from precedent. | Need explicit SB producer-independence levels: build-time dependency, runtime dependency, management-plane dependency, data portability and exit. Mendix Cloud-specific APIs/runtime are not candidates for adoption. |

## Deductions — research only

### D1 — Canonical model + projection convergence is independently repeated

MPS and Sirius independently converge on a structured semantic/model authority with multiple editable or selectable presentations. This strengthens, but does not promote, the existing S3 rule that declarative source/YAML, Layers, Inspector, Graph and preview must be projections/editors of one canonical composition truth.

Classification: `adopt-pattern`.

Do not copy: MPS AST/language runtime, EMF resource/session stack, Eclipse plugin topology.

Required SB proof remains open:
- canonical identity/revision is stable across projections;
- a projection edit is admitted through the owning mutation boundary;
- stale projection edits fail or reconcile deterministically;
- all affected projections converge after an accepted mutation;
- presentation-only state does not leak into semantic ownership.

### D2 — C10 cannot be inferred from workbench richness

Unreal, MPS and Sirius all contain rich workbench/editor surfaces, but their relevant discriminant is not pane count, docking or tool count. The recurring stronger invariant is coordinated mutation of structured artifacts/models plus lifecycle/currentness across projections/tools.

Classification: `adapt` the invariant; `reject/defer` product-specific Studio/plugin architecture.

R7's provisional C10 hypothesis therefore survives this first tranche:
`shared working artifact/context + coordinated multi-Tool structural authoring + version/currentness lifecycle + cross-Tool consequence convergence`.

Status: still `unproven-gap`; external convergence is not promotion authority.

### D3 — Producer/produced independence needs a graded contract

Mendix provides evidence that build/package/deploy can be separated while a produced application still depends on a dedicated runtime. That is useful counter-evidence against treating “factory independence” as a single boolean.

Candidate synthesis dimensions, not authority:
- factory required to author/build?;
- factory required at runtime?;
- proprietary/provider runtime required?;
- management plane required after handoff?;
- application/data/config exportable?;
- target environment substitutable?;
- rebuild/migration possible without original factory service?

Classification: `adapt`.

SB's desired anti-lock-in posture may choose a stricter invariant than Mendix; precedent cannot weaken an accepted SB requirement.

## Dedup / rejected promotions

- no C11;
- no `UnrealStudio`, `MPSStudio`, `SiriusStudio` or `MendixApplication` grammar species;
- no provider/plugin kernel imported into Station;
- no source/YAML authority parallel to canonical composition;
- no domain-specific primitive inferred from any benchmark;
- no Core/business authority assigned to Station because an external workbench owns model mutation.

## Proof-debt delta

Newly sharpened, not newly promoted:

1. **Projection Convergence Proof** — accepted canonical mutation updates/revalidates every affected projection without identity drift.
2. **Stale Projection Protection Proof** — an edit based on stale revision cannot silently overwrite newer canonical state.
3. **Structural Mutation Admission Proof** — projection/editor actions mutate only through the admitted owner/capability boundary.
4. **Presentation Separation Proof** — representation geometry/style may persist without becoming semantic/domain truth.
5. **Producer Independence Profile Proof** — produced-system handoff explicitly records build-time, runtime, management-plane, data/config portability and provider dependencies instead of one ambiguous portability flag.
6. **C10 Delta Proof** — a candidate Studio must demonstrate a reusable invariant not expressible as C9 Application + C8 Tools + configuration.

All remain `unproven-gap` until repository-owned executable/evidentiary proof exists.

## Next benchmark tranche

BLOCKER-FIRST:
1. CAD/CAE assembly/product trees, constraints, parametrization, regeneration and generated artifacts;
2. Palantir Foundry ontology/application boundary;
3. then provider-catalog and tenant-portability pressure only where the benchmark adds non-duplicative evidence;
4. reconcile the operational `NEXT_WORK` pointer on this branch;
5. continue until the R7B handoff can state which S3 decisions are confirmed, challenged or unresolved.

Synthesis/Decision Graph and Construction remain ineligible.
