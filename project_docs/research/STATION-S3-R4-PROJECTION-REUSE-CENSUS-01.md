# Station S3-R4 — Projection Reuse Census 01

Date: 2026-09-28
Base revalidated: fresh `main@9ac33de132abfd6f946b8f90f5012332d8df31c6`
Status: RESEARCH EVIDENCE — NOT PRODUCT AUTHORITY

## Question

R4 needs Layers, Inspector, Graph, preview and later source/YAML to remain projections of one canonical artifact rather than independent authorities. Before proposing a Station-local projection contract, this census asks whether the repository already owns reusable projection/currentness semantics and executable proof that can be inherited or adapted without wrong-boundary coupling.

Preserved invariants: `identity != placement != presentation != action`; projection != canonical source; ComponentRegistry != AppManifest; WindowGeometry != composition grid; provider independence; Station does not acquire Core/business authority.

## Repository evidence

### `generated-experience`

`packages/contracts/generated-experience/index.ts` already distinguishes:
- `projectionRef` / `projectionRevisionRef` from `sourceRef` / `sourceRevisionRef` / `sourceAuthorityRef`;
- projection currentness from source currentness;
- projection completeness from source completeness;
- projection lineage from canonical source identity;
- projection locality from source locality.

Its executable semantics include:
- projection identity must remain distinct from canonical source identity;
- projection completeness may not strengthen source evidence;
- source or projection stale currentness makes the projection stale;
- UNKNOWN/INCONCLUSIVE evidence requires reconciliation rather than being rendered as known truth;
- regeneration changes projection revision while preserving lineage;
- a projection explicitly never establishes canonical truth.

`tests/product/g2-generated-experience-projection-proof.test.ts` machine-proves those boundaries, including identity collision rejection, independent source/projection staleness, non-strengthening of PARTIAL/UNKNOWN/INCONCLUSIVE evidence, locality preservation and immutable regeneration lineage.

### Station/Core protocol convergence

`packages/contracts/station-core/index.ts` independently uses projection identity/revision together with source identity/revision/authority, currentness and completeness, and explicitly states that a Station projection does not establish canonical truth. This is independent repository convergence on the same semantic separation, not permission to merge the bounded contexts.

## Finding

Classification: `adopt-pattern / reuse-semantics`; **do not** create a universal projection owner and do not couple Station editor projections directly to `generated-experience` merely because its semantics are useful.

Candidate Station projection grammar:

`canonical source identity + source revision + source authority -> projection identity + projection revision + projection payload`

with the following inherited semantic invariants:
1. projection identity is not canonical source identity;
2. a projection never establishes canonical truth;
3. projection currentness/completeness cannot strengthen source evidence;
4. regeneration/refresh preserves projection lineage when lineage is admitted;
5. stale/unknown projection evidence remains stale/unknown/reconcile-required rather than silently becoming current.

This is a grammar/invariant reuse result, not a mandate that every local in-memory projection carry the full `generated-experience` schema. The smallest representation appropriate to the Station owner should be selected during synthesis/materialization.

## R4 application

For Layers, Inspector, Graph and preview:

`canonical draft/artifact -> projection resolver -> projection payload`

Admitted edits return through exactly one semantic mutation/command boundary:

`projection intent -> owning mutation/command -> canonical draft/artifact -> projection refresh`

Consequences:
- Layers tree shape is navigation/presentation, not artifact authority;
- Inspector descriptors are a contextual projection of selected contracts/schema, not a private editable model;
- Graph is another view of canonical relationships, not an independent relationship store;
- preview may cache/render a projection revision but cannot overwrite canonical content because its render is newer;
- future source/YAML must follow the same authority rule, with serialization/round-trip proof deferred to R5.

## Proof Grammar delta

| Concern | Coverage now | Inherited proof | Smallest Station delta proof |
| --- | --- | --- | --- |
| projection != canonical truth | proven in existing owners | generated-experience + station-core non-authority semantics | Station Layers/Inspector/Graph adapter never writes projection snapshot as canonical truth |
| source/projection identity separation | proven in existing owners | projection/source identity proof | projected node/field/view resolves same source identity while retaining any admitted projection identity |
| source/projection currentness separation | proven in existing owners | stale source or stale projection remains stale | stale projection cannot dispatch mutation as if based on current source; refresh/reconcile path is explicit |
| evidence non-strengthening | proven in existing owner | PARTIAL/UNKNOWN/INCONCLUSIVE cannot become stronger truth | presentation does not turn unknown/partial contract/currentness/result into known/success |
| projection lineage | proven in existing owner where lineage applies | immutable projection revision lineage | only required if Station projection revisions are materialized; otherwise `not-applicable` by contract |
| canonical graph -> Layers | unproven-gap | graph identity + projection invariants | graph mutation yields corresponding Layers projection without parallel tree authority |
| contract/schema -> Inspector | unproven-gap | registry/selection + projection invariants | selection resolves declared descriptors; two schemas produce different fields without feature hardcode; unknown fails closed |
| broad multi-projection sync | unproven-gap | one-draft preview bounded proof + projection invariants | one accepted canonical mutation is observed by all admitted projections from the resulting source revision |
| projection edit atomicity | unproven-gap | mutation fail-closed discipline | invalid/stale projection intent cannot partially mutate one projection or bypass canonical mutation boundary |
| source/YAML round-trip | unproven-gap / R5 input | projection authority discipline only | R5 defines serialization/view contract and round-trip/delta proof |

Coverage vocabulary remains `proven | failed | unproven-gap | not-applicable`; existing owner proofs are not automatically Station PASS. They are inherited semantics whose Station adapter delta must still be proven. Missing Station evidence remains `unproven-gap`.

## Dedup / promotion consequences

Reject by default:
- `LayersStateAuthority`;
- `InspectorCanonicalState`;
- `GraphAuthority`;
- a parallel YAML authority;
- `UniversalProjection` or `UniversalProjectionEngine` created only because multiple bounded contexts converge on projection semantics.

A new reusable projection abstraction is promotable only if multiple Station projections require the same owner-neutral contract **and** that contract has a proof delta not already expressible through canonical source identity/revision + projection descriptors. Until then, reuse semantics and keep adapters bounded.

## C6 journey consequences

Representative machine-proof targets for a future `Layers + work/canvas + Inspector` pattern:
1. selecting a Layers projection resolves the same canonical node identity consumed by Inspector and canvas;
2. an Inspector edit resolves the canonical target/revision and mutates once through the owning boundary;
3. after acceptance, Layers/Inspector/preview regenerate from the resulting canonical revision/state;
4. a stale projection cannot strengthen itself to current or apply a mutation against a mismatched source revision;
5. hiding/restoring a pane affects presentation state only and does not roll back or resurrect canonical artifact state.

Human acceptance may validate that these consequences are understandable and expected, but it remains distinct from machine conformance.

## Grammar Sufficiency impact

The five-role R4 vocabulary (`command/toolbar`, `navigation`, `work/editor`, `inspector/context`, `status/result`) still covers document approval, ticketing, CRUD, operational dashboard and deployment configuration without domain-specific pane classes. Projection reuse reduces rather than expands the grammar: the same source/projection relation can support Layers, Inspector, Graph and preview across those exemplars.

Sufficiency is **not PASS**. Remaining gaps are contract/schema -> Inspector, canonical graph -> Layers, broad projection synchronization, C6 journey proof, inherited R3 semantic reparent/cycle/order blockers and R5 source/YAML round-trip.

## Gate consequence

This census closes the question “does the repository already contain projection/currentness semantics worth reusing?” with **yes, as bounded semantic evidence**. It does not close R4. The R4 handoff still requires C5/C6 exit classification and representative C6 journey coverage with the remaining gaps carried explicitly.

R5, Construction, Studios and AI/MCP remain blocked.