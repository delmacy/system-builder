# Generation 2 — Workflow & Durable Execution Full Pass 5 Revisit

Status: ACTIVE RESEARCH — Full Pass 5
Capability: Workflow & Durable Execution
Explicit mandatory cluster: Workflow × Integration × Messaging × external mutation
Priority hypothesis: Typed Semantic Graph + capability-use nodes + executable workflow subgraphs + composite/subworkflow capabilities; ExecutionEnvelope + delta + ExecutionState + ExecutionJournal
Disposition: `CATALOGUE + CLASSIFY + DETECTION_CANDIDATE + FUTURE_REMEDIATION_ROUTE`

Canonical distinctions preserved: `ConflictPattern != ConflictInstance`; `Signal != ConfirmedConflict`; graph semantics != graph database technology; journal/history != runtime/business truth; provider acknowledgement != business effect; `UNKNOWN -> reconcile-before-retry`. This dossier does not authorize remediation, Work Packages, TASKs, Construction or Planning C.

## 1. Priority adversarial method

This revisit treated the proposed Typed Semantic Graph as an architecture hypothesis rather than an accepted design and challenged both semantic composition and runtime realization. Duplicate screening covered all 119 reusable ConflictPatterns.

The sweep exercised:

1. control-flow + data-flow product analysis: missing/ambiguous inputs, incompatible semantic/schema types, orphan/unreachable nodes, cycles, impossible waits, dead joins and false dependency closure;
2. write/write and read/write interleavings across sibling branches, parent/child workflows and independently valid workflows sharing mutable facts/resources;
3. fan-out/fan-in cardinality, boundedness and join semantics, including child failure, cancellation, timeout, partial completion and late completion;
4. recursive subworkflow composition, termination/depth obligations and capability-use expansion;
5. stale child revision and parent/child version pinning across long-running instances;
6. ExecutionEnvelope propagation and delta ownership: stale context, duplicate field ownership, conflicting deltas, nondeterministic merge, sensitive-data propagation, artifact/reference invalidation and payload/history growth;
7. ExecutionJournal versus ExecutionState versus effective runtime/business truth, including replay/redrive and partial external effects;
8. sync versus async child completion semantics and the specific question whether parent terminality is incorrectly promoted to composite quiescence;
9. direct call versus queue/API/provider realization, provider substitution, topology change, residual cohorts and autonomous-runtime subsets;
10. AI/low-code graph generation where every local node/edge is valid but the aggregate graph creates a cycle, dead join, authority widening, unbounded fan-out or contradictory mutation.

GraphDB remained only a storage/provider hypothesis. Relational typed-node/typed-edge persistence, JSONB payloads, append-only/event journals and optional graph projections remain viable alternatives; none is promoted to canonical architecture by this research.

## 2. Fresh external evidence

AWS Step Functions provides useful concrete witnesses for graph/runtime separation without prescribing System Builder architecture:

- Inline Map executes iterations inside the parent context, with up to 40 concurrent iterations and parent execution-history limits; Distributed Map runs iterations as separate child workflow executions, supports up to 10,000 parallel child executions, and gives children separate histories.
- A Distributed Map Run can continue after the parent workflow stops or times out while child cancellation/completion or result writing is still in progress.
- Redrive preserves successful prior results/history and reruns unsuccessful portions; eligibility is bounded by execution/history constraints. Standard and Express child redrive behavior differs.
- Redriven executions retain the original state-machine definition/version association even if an alias later points elsewhere.

Portable implication: graph-level parent completion, history closure, retry lineage, or a syntactically closed dependency path does not by itself prove that all descendant/external effects are quiescent, reconciled, currently eligible or represented in one history surface.

Representative sources:
- https://docs.aws.amazon.com/step-functions/latest/dg/state-map.html
- https://docs.aws.amazon.com/step-functions/latest/dg/redrive-map-run.html
- https://docs.aws.amazon.com/step-functions/latest/dg/redrive-executions.html

## 3. Duplicate screen and candidate conflicts

No genuinely new material local edge scenario, cross-capability scenario or reusable ConflictPattern survived duplicate screening.

The strongest candidate was **parent terminality promoted to composite quiescence**: a parent node/workflow can legitimately be stopped/timed out while asynchronous descendants, provider operations or result writers remain active. If a semantic graph closes downstream dependencies merely from the parent terminal marker, later work can race with surviving effects. This is material behavior, but it is already covered by the existing families for state-transition/currentness, journal/runtime-truth separation, acknowledgement/effect separation, residual cohorts, cross-process compensation/adoption, correlation/effect identity and qualified convergence. It therefore does not warrant a 120th reusable pattern.

Other graph-specific probes likewise reduced to existing families:

- dead joins / impossible waits / orphan nodes / unintended cycles -> structural-graph and liveness/deadlock families;
- fan-out explosion / recursive expansion -> resource-boundedness, scheduling-starvation and automation-composition families;
- stale child revision / mixed graph revisions -> revision-vector/currentness and compatibility-direction families;
- conflicting sibling deltas / duplicate field ownership -> semantic-ownership, concurrent-mutation and data-consistency families;
- nondeterministic delta merge / replay divergence -> effect identity, historical reproduction and qualified-state families;
- sensitive envelope propagation -> privacy/data-governance and authority/scope families;
- journal != effective runtime/business state -> observability/runtime-truth and qualified-convergence families;
- direct-call versus queue/API/provider differences -> provider-semantic-support, acknowledgement/effect and residual-cohort families;
- build-specific capability subsets -> dependency/compatibility/availability qualification families;
- AI/low-code locally valid graph with globally unsafe behavior -> AI/low-code composition, authority non-amplification, structural graph and resource-boundedness families.

## 4. Detection candidates for the Typed Semantic Graph hypothesis

The hypothesis remains promising specifically because it can expose analyzable structure, but detection must remain owner-qualified and must not turn signals into automatic conflict confirmation.

Candidate detection stages:

- static/design-time: typed port/input/output compatibility, required-input closure, reachability/orphan checks, SCC/cycle analysis, declared recursion/termination bounds, fan-out/fan-in cardinality bounds, join satisfiability, writer-set overlap, semantic-owner uniqueness, authority/SoD constraints and version-compatibility edges;
- pre-execution: pin/requalify graph + child revisions, authority, provider generation, schema/policy compatibility, resource/capacity and artifact/reference currentness;
- runtime: competing writers, late descendant effects after parent terminality, dead/stalled joins, recursion/fan-out budget exhaustion, stale-context/delta ownership violations and residual provider cohorts;
- post-effect/reconciliation: join canonical operation/effect identity, ExecutionJournal, ExecutionState, provider receipts, target postconditions, child lineage, compensation and downstream adoption before claiming convergence;
- property-based/model-checking candidates: generate bounded graph variants, reorder independent transitions, mutate presence states, inject UNKNOWN effects, vary child revision/provider realization and search for invariant violations; counterexamples are signals until owner-qualified assessment confirms a conflict.

False-positive controls: intentional detached children, broadcast/fan-out, declared cycles/recursion with termination controls, eventually consistent joins, best-effort branches, explicit multi-writer CRDT-like semantics, asymmetric compatibility and provider-specific realization differences can all be legitimate.

## 5. ExecutionEnvelope + delta + journal assessment

No evidence supports treating a single ever-growing payload as the canonical mechanism. Research should preserve the conceptual distinction between immutable/qualified execution context, scoped references/artifacts, owner-qualified deltas, effective state and durable history. A future architecture may use references rather than copy full payloads, bounded/scoped envelopes, typed delta ownership and journal compaction/snapshots, but those are remediation/design choices and are not selected here.

Likewise, an ExecutionJournal is evidence/history, not automatically the complete runtime or business truth. A provider may have applied an effect whose acknowledgement is missing; a detached child may still run; a downstream process may have adopted an earlier effect; and external truth may require reconciliation.

## 6. Preventive invariant review

No new preventive invariant candidate is elevated. Existing bounded candidates are sufficient: ambiguous mutation requires reconciliation before unsafe retry; AI/low-code cannot amplify authority; directed compatibility cannot be silently promoted to global/undirected compatibility; semantic ownership/currentness must remain qualified; and local terminal/history state cannot be treated as proof of external convergence without owner-qualified evidence.

A universal prohibition on asynchronous children, cycles, recursion, multi-writer state, fan-out, detached work, provider-specific realization or graph projections would block legitimate systems and is not justified.

## 7. Saturation result

Result: **ELIGIBLE NO-NEW-MATERIAL REVISIT**.

- new local edge scenarios: `0`;
- new cross-capability scenarios: `0`;
- new reusable ConflictPatterns: `0`;
- new preventive invariants: `0`;
- Workflow & Durable Execution local streak remains capped at `2`;
- Workflow × Integration × Messaging × external mutation cluster streak remains capped at `2`;
- Full Pass 5 coverage after this revisit: `3/28` capabilities and `2/12` mandatory clusters;
- inventory remains `284` edge scenarios + `119` ConflictPatterns = `403` material findings;
- HIGH/CRITICAL without owner/proof/detection route remains `0`;
- negative-space remains `NOT_STARTED`;
- saturation remains `NOT_SATURATED`;
- Planning C remains blocked.

## 8. Next rotation

Continue Full Pass 5 with **Data / Schema / Migrations** and explicitly exercise **Data/Schema × Privacy × Storage × Lifecycle**. Carry the Typed Semantic Graph hypothesis into data-flow semantics: typed input/output compatibility, fact ownership, multi-writer races, schema/revision cuts, child/subworkflow data contracts, delta merge ownership, `ABSENT/null/default/delete`, sensitive-data propagation, artifact/reference invalidation, restore/migration cohorts, derived/stored-fact confusion, graph cardinality/resource pressure and AI/low-code composition. Duplicate-screen against all 119 reusable ConflictPatterns. Keep GraphDB optional and do not enter Planning C.
