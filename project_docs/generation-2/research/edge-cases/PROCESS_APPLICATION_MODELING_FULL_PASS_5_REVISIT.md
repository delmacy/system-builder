# Generation 2 — Process & Application Modeling — Full Pass 5 Revisit

Status: ACTIVE — ELIGIBLE NO-NEW-MATERIAL REVISIT
Phase: `RESEARCH_ADVERSARIAL_EDGE_CASE_SATURATION`
Capability: Process & Application Modeling
Explicit mandatory cluster: Process/Application × Workflow × Data/Schema
Disposition: `CATALOGUE + CLASSIFY + DETECTION_CANDIDATE + FUTURE_REMEDIATION_ROUTE`

Research only. Preserve `ConflictPattern != ConflictInstance`, `Signal != ConfirmedConflict`, and `business truth != execution state != execution journal/evidence`. No product code, Work Package, TASK, Construction, remediation or Planning C is authorized here.

## 1. Priority hypothesis under test — Typed Semantic Graph

The priority model remains **HIPÓTESE DE ARQUITETURA / EM PESQUISA**. This pass tested, without selecting it, a typed semantic graph in which:

- `CapabilityDefinition` / operation is reusable functional meaning;
- `CapabilityUse` / invocation is a contextual occurrence inside a workflow;
- `WorkflowDefinition` is an executable typed subgraph and a composed/subworkflow may itself expose a capability contract;
- `WorkflowInstance` is a runtime occurrence pinned/qualified to definition and dependency revisions;
- data, documents, authority, policies, formulas, providers and revisions are typed relations/layers rather than anonymous graph labels;
- `ExecutionEnvelope` carries scoped context/references and receives deltas across node traversal;
- `ExecutionState` is the current execution projection/snapshot;
- `ExecutionJournal` is append-oriented evidence of traversal, attempts, errors and observations, and is not promoted to business truth;
- relational persistence in PostgreSQL is a viable candidate representation using typed graph definition/revision/node/edge tables plus bounded JSONB configuration, with instance/node-execution/edge-traversal/journal tables separated from business facts;
- GraphDB remains only a possible provider/projection unless later evidence proves a requirement that the relational model cannot satisfy economically or correctly;
- Canvas/Graph Explorer is treated as a projection over the model, potentially navigable `Enterprise -> Workspace -> Workflow -> Subworkflow -> Capability -> Contract/Provider` with Process/Capability/Data/Authority/Provider/Runtime/Risk views, not as canonical truth itself.

### Evidence for and against

Supporting evidence is architectural rather than dispositive. PostgreSQL recursive CTEs support graph traversal and explicit cycle/path detection, including `CYCLE`, so graph semantics do not by themselves require a GraphDB. AWS Step Functions demonstrates that nested/distributed child workflow executions can maintain separate execution histories while remaining part of a parent orchestration, and that fan-out has explicit concurrency/history bounds. These support explicit definition/instance/history boundaries and bounded composition, not any particular SB implementation.

Counter-evidence/trade-offs: a universal graph can become a semantic dumping ground; edge typing can hide domain-specific invariants if reduced to generic labels; recursive traversal can become expensive/pathological; JSONB can erode schema ownership if unbounded; graph visualization can imply false equivalence between semantic, authority, provider and runtime edges; and a graph representation does not itself solve transactionality, distributed effects, temporal currentness, authority or business ownership. GraphDB would add another provider/operational surface and must earn its place through demonstrated query/scale needs rather than graph-shaped UI preference.

## 2. Distinct Full-Pass-5 attacks

This revisit used techniques materially different from Full Passes 1–4:

1. **definition/use alias mutation** — reuse one capability definition through multiple uses with different mappings, owners, authority and revisions, then attempt to infer use semantics from the definition alone;
2. **dual-flow product analysis** — compose control-flow reachability with data-flow availability/type/lineage, looking for paths that are control-reachable but data-impossible and vice versa;
3. **recursive contract substitution** — replace a leaf with sync child, async child and recursively composed workflow while holding the advertised capability contract constant;
4. **envelope-scope subtraction** — remove or shadow parent context fields at child boundaries and test accidental ambient-context capture or authority leakage;
5. **journal/state/truth permutation** — independently mutate journal completeness, execution snapshot and business fact state to expose false convergence;
6. **revision-cut braid** — pin parent, child, schema, formula, provider and policy revisions at different cuts while an instance remains in flight;
7. **join satisfiability mutation** — vary fan-out cardinality, branch failure/skip/cancel semantics and required join inputs to find impossible waits or premature completion;
8. **parallel-writer commutativity probe** — permit independently valid branches to write one semantic fact/resource and test whether merge order changes canonical outcome;
9. **storage-model inversion** — require the same semantic proof obligations under normalized PostgreSQL tables, bounded JSONB attributes and an optional graph projection/provider;
10. **AI graph-composition delta** — compare authority, termination, data lineage, resource bounds and semantic postconditions of admitted primitives against the generated aggregate.

## 3. Duplicate-screen results

No genuinely new material local edge, cross-capability edge or reusable ConflictPattern survived screening against all 119 existing patterns.

- **CapabilityDefinition conflated with CapabilityUse** reduces to semantic ownership/identity qualification, revision/currentness and context/authority composition families. Reuse does not imply identical contextual mappings.
- **Control-reachable but data-impossible nodes**, missing required input, incompatible typed/semantic edge, unreachable subgraph, impossible join and undeclared recursion reduce to structural graph, data/consistency, rule-condition and temporal/deadlock families.
- **Legitimate cycles versus prohibited cycles** require declared semantics plus termination/depth/resource bounds; this is already covered by structural/resource-boundedness patterns. Cycle presence alone is a signal, not a confirmed conflict.
- **Sync/async child substitution** with incompatible parent↔child completion, cancellation, output or compensation semantics reduces to contract-effect, temporal/state-transition, compatibility-direction and recovery families.
- **Ambient context capture / child scope leakage** reduces to authority/non-amplification, semantic ownership and trust/scope qualification families.
- **Parallel writers** whose individually valid effects are non-commutative reduce to competing-authoritative-mutation, semantic-owner and concurrency/state-transition families.
- **Version-pinned in-flight parent/child/schema/provider/policy combinations** reduce to version/coexistence, revision-vector/currentness and compatibility-direction families.
- **Compensation after downstream adoption** remains the existing cross-process compensation/adoption class; journal evidence cannot prove compensation remains eligible.
- **`UNKNOWN` external mutation followed by retry** remains reconcile-before-retry / ambiguous-effect handling.
- **ExecutionJournal or ExecutionState promoted to business truth** reduces to semantic ownership, qualified-claim/evidence-currentness and false-convergence families. A successful node traversal is evidence about execution, not proof of the canonical domain postcondition unless the operation contract establishes it.
- **Relational graph storage treated as semantic proof** and **GraphDB treated as required because the model is a graph** both fail the storage-model inversion: persistence mechanics do not own semantic graph meaning. Provider/binding and semantic-ownership patterns already cover this.
- **AI/low-code composition** of safe primitives into unbounded recursion, impossible joins, conflicting writers or enlarged authority remains `G2-CONFLICT-PATTERN-AI-LOWCODE-001` plus structural/resource/authority patterns.

No new preventive invariant is proposed. Universal/material candidates already have owners/routes; stronger blanket prevention would reject legitimate loops, asynchronous children, optional branches, asymmetric mappings, controlled parallel writes or provider-specific optimizations.

## 4. Detection candidates and proof obligations

The Typed Semantic Graph hypothesis remains viable only if later architecture can prove, without relying on a GraphDB:

- stable typed identities and revision lineage for definition/use/instance/node/edge/contract/provider relations;
- design-time interface compatibility across data type **and semantic owner/meaning**, not type shape alone;
- joint control-flow + data-flow reachability/satisfiability, with declared cycle/recursion semantics and bounded termination/depth/resource policies;
- explicit parent↔child input/output/error/cancel/compensation contracts for sync and async composition;
- scoped envelope propagation with no ambient authority amplification and explicit parent↔child mappings;
- fan-out/fan-in cardinality, join completion and failure semantics that cannot silently wait forever or claim success from incomplete required branches;
- competing-writer detection/serialization/merge qualification where semantic facts are shared;
- revision pinning/currentness and directed compatibility for in-flight instances and residual cohorts;
- reconciliation before unsafe retry after `UNKNOWN` mutation and adoption-aware compensation eligibility;
- strict separation of graph definition, runtime execution state, immutable/append-oriented execution evidence and canonical business truth;
- bounded relational traversal/query cost and bounded JSONB use, with GraphDB/provider projections remaining reconstructible/non-authoritative;
- Canvas/Graph Explorer views that preserve semantic plane distinctions rather than collapsing Process/Data/Authority/Provider/Runtime/Risk into one unlabeled topology;
- AI/low-code aggregate validation for reachability, satisfiability, termination, authority, resource bounds and semantic postconditions before any later materialization.

Detection candidates remain static typed-edge/contract checking, control+data-flow analysis, SCC/cycle classification, join satisfiability, writer-set analysis, revision-vector compatibility, authority-scope checks, runtime deadlock/starvation/UNKNOWN-effect signals, journal/state/business reconciliation and bounded traversal/resource telemetry.

For all material classes exercised, the existing ConflictPattern records remain authoritative for activation conditions, incompatible claims/actions/states, owner(s), severity, confidence, detectability, blast radius, reversibility, time-to-harm, misuse likelihood, evidence currentness, false-positive risk and future remediation disposition.

## 5. Saturation result

Result: **ELIGIBLE NO-NEW-MATERIAL REVISIT**.

- new local edge scenarios: `0`;
- new cross-capability scenarios: `0`;
- new reusable ConflictPatterns: `0`;
- new preventive invariant candidates: `0`;
- ConflictInstances asserted: `0`;
- Process & Application Modeling local no-material streak remains capped at `2`;
- Process/Application × Workflow × Data/Schema cluster no-material streak remains capped at `2`;
- Full Pass 5 coverage after this revisit: `2/28` capabilities and `1/12` mandatory clusters;
- material inventory remains `284` edge scenarios + `119` reusable ConflictPatterns = `403` findings;
- HIGH/CRITICAL without owner/proof/detection route remains `0`;
- negative-space remains `NOT_STARTED`; saturation remains `NOT_SATURATED`; Planning C remains blocked.

## 6. Architecture-hypothesis disposition

**Typed Semantic Graph + ExecutionEnvelope + ExecutionState + ExecutionJournal: KEEP AS HIPÓTESE DE ARQUITETURA / EM PESQUISA.**

Evidence presently favors a typed graph as a useful unifying semantic representation and navigable projection, and favors PostgreSQL typed relational persistence as a credible baseline. Evidence does **not** justify declaring a universal graph IR, selecting GraphDB, making the Canvas canonical, or collapsing execution evidence into domain truth. The decisive obligations are semantic typing/ownership, composition soundness, revision/currentness, authority scoping, bounded recursion/fan-out, runtime reconciliation and storage independence.

## 7. Next rotation

Continue only `RESEARCH_ADVERSARIAL_EDGE_CASE_SATURATION`, Full Pass 5, with **Workflow & Durable Execution** and explicitly exercise **Workflow × Integration × Messaging × external mutation**. Apply the graph hypothesis to runtime composition: ExecutionEnvelope propagation, node/edge traversal identity, child workflow sync/async contracts, durable journal versus current state/business truth, cancellation/retry/compensation races, `UNKNOWN` external effects, event correlation/idempotency, fan-out/fan-in bounds, version-pinned in-flight graphs, provider substitution/residual cohorts and AI/low-code composition. Duplicate-screen against all 119 reusable ConflictPatterns. Do not enter Planning C.
