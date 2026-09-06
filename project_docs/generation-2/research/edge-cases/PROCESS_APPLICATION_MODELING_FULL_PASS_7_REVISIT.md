# Generation 2 — Process & Application Modeling — Full Pass 7 Revisit

Status: ACTIVE — ELIGIBLE NO-NEW-MATERIAL LOCAL + CLUSTER REVISIT
Phase: `RESEARCH_ADVERSARIAL_EDGE_CASE_SATURATION`
Capability: Process & Application Modeling
Mandatory cluster exercised: Process/Application × Workflow × Data/Schema
Prior authority: `PROCESS_APPLICATION_MODELING_EDGE_CASE_REGISTER.md` and Full Pass 2–6 revisit dossiers
Conflict-classification authority: `PROCESSUAL_SEMANTIC_CONFLICT_CLASSIFICATION.md`
Priority-hypothesis authority: `SEMANTIC_GRAPH_FEDERATION_SOUNDNESS_EXECUTION_PROOF_RESEARCH.md`
Reusable ConflictPattern inventory screened: 124

Research only. Preserve `Research != remediation`, `ConflictPattern != ConflictInstance`, `Signal != ConfirmedConflict`, and the default disposition `CATALOGUE + CLASSIFY + DETECTION_CANDIDATE + FUTURE_REMEDIATION_ROUTE`. This revisit authorizes no product code, Work Package, TASK, Construction, target-architecture decision or pre-emptive remediation.

## 1. Full-Pass-7 method

This revisit uses an operational-dynamics and temporal-graph lens materially different from Full Pass 6's formal-abstraction differential. The process definition is treated as a governed work algorithm whose topology, predicates, revisions, nested work, resources and evidence may change while instances are active.

The probes were:

1. **temporal reachability splice** — preserve graph topology while changing valid-time of schema, policy, authority, provider or predicate inputs and test whether structurally reachable work remains executable at the relevant time slice;
2. **retroactive graph-revision mutation** — correct or supersede a graph edge/entity after instances already traversed the former revision and test whether historical instances are silently reinterpreted under the new topology;
3. **uncertain predicate frontier** — use interval/distribution/forecast inputs in branch predicates and challenge any silent collapse from uncertain evidence to deterministic reachability;
4. **nested queue-network coupling** — make parent and child workflows individually stable under their local queues, then couple them through shared service centers/providers and test global backlog/stability assumptions;
5. **deadline/service-time feasibility differential** — keep control-flow sound while shortening deadlines or increasing service-time variance so mandatory work cannot plausibly complete in time;
6. **fan-out/fan-in pressure amplification** — increase bounded fan-out under shared bottlenecks and partial child completion, testing whether a syntactically bounded process can still become operationally unstable or violate deadline/resource commitments;
7. **revision-pinned parent/child mapping drift** — pin parent/child revisions independently, evolve input/output schemas or semantic owners, and test whether an old mapping is treated as current merely because both revisions remain valid in isolation;
8. **concurrent canonical-write non-commutativity** — run locally valid branches against the same canonical fact and vary ordering, stale read basis, merge semantics and compensation eligibility;
9. **provenance subtraction** — retain process execution evidence but remove field-level lineage for a branch predicate or derived output, then test whether the system over-attributes all upstream inputs to all downstream results;
10. **decision/calculation/workflow-kind permutation** — substitute deterministic calculation, rule decision, statistical estimate, optimization result, AI inference or human decision while preserving transport/schema shape;
11. **vector constraint scalarization** — collapse `ResourcePressureVector`, `RiskVector`, `ComplexityVector` or a capability-operational vector into one score and test whether hidden normalization/weights create an unauthorized process choice;
12. **federated responsibility temporal crossing** — an inter-system handoff begins under contract/revision `C1` and completes after `C2` changes ownership, SLA, evidence or reconciliation responsibility;
13. **Canvas transformation preservation test** — apply candidate graph change `N -> N+1`, isolate the affected subgraph and ask which reachability, soundness, lineage, unit, decision and completion-proof claims remain preserved versus invalidated/recomputed;
14. **AI/low-code globally-unstable composition** — compose nodes that are individually valid and locally bounded into a process whose shared queues, deadlines, semantic kinds or canonical writes are globally contradictory or unstable.

The mandatory `Process/Application × Workflow × Data/Schema` cluster is materially exercised by probes 1, 2, 3, 7, 8, 9, 10 and 13.

## 2. Evidence refresh

External evidence is used as adversarial evidence, not as target-architecture prescription.

### 2.1 Valid time and transaction/system time are distinct dimensions

The PostgreSQL temporal documentation/wiki distinguishes application/valid time from system/transaction time. Current PostgreSQL temporal support also demonstrates time-qualified keys/references over validity periods. Portable research consequence: a process relation that is structurally present is not necessarily applicable for the business-time slice of an instance, and the time at which a fact was recorded is not the same as the time interval for which it is asserted to be valid.

Sources refreshed 2026-09-06:
- https://www.postgresql.org/docs/19/ddl-temporal-tables.html
- https://wiki.postgresql.org/wiki/SQL2011Temporal

This strengthens the candidate need for time-qualified graph relations but does not select a storage model or require GraphDB.

### 2.2 Workflow soundness remains formalism/profile-qualified

Workflow-net literature continues to distinguish soundness of classical workflow nets from richer extensions: soundness notions are decidable for ordinary workflow nets, while many expressive extensions can make those notions undecidable. Recent reset-workflow-net research reinforces that cancellation/reset semantics cross important decidability boundaries.

Sources refreshed 2026-09-06:
- https://link.springer.com/article/10.1007/s00165-010-0161-4
- https://arxiv.org/abs/2503.04440

Portable research consequence: graph transformation, cancellation or richer data semantics must not inherit a prior soundness claim unless the preservation theorem/profile explicitly covers the extension.

### 2.3 Queue stability and deadline feasibility are not implied by valid local transitions

Queueing research shows that deadline-bearing queues/networks have separate stability properties; feasible local service decisions do not imply a globally stable or deadline-satisfying network. Portable research consequence: a process can be structurally/soundly defined and still be operationally infeasible under arrival/service distributions, shared bottlenecks, fan-out or deadlines.

Source refreshed 2026-09-06:
- https://www.cambridge.org/core/journals/journal-of-applied-probability/article/on-stability-of-queueing-networks-with-job-deadlines/8E8D7AB2D977F914FFCE79AF50428A96

### 2.4 Provenance relation is not automatic causal proof

W3C PROV distinguishes entities, activities, agents and derivation/influence relationships and explicitly does not infer derivation merely from the presence of all candidate upstream inputs. Portable research consequence: process-level input/output co-occurrence cannot be expanded into Cartesian field-level lineage or causal proof without stronger evidence.

Sources refreshed 2026-09-06:
- https://www.w3.org/TR/prov-dm/
- https://www.w3.org/TR/prov-sem/

## 3. Candidate findings and duplicate-screen against 124 reusable ConflictPatterns

No candidate survived duplicate-screen as a distinct 125th reusable ConflictPattern.

### 3.1 Structural reachability across an invalid temporal slice

Candidate: a path exists in the current graph, but one required schema/policy/provider/capability relation is not valid for the instance's effective-time slice.

Disposition: **no new reusable class**. This reduces to existing temporal/currentness, revision-coexistence, compatibility-direction and structural/data conflict families. Detection candidate: time-qualified dependency closure and instance-pinned revision/validity comparison. False-positive risk: planned/future relations or historical corrections may be intentionally visible for analysis. Future remediation route: owner-qualified revalidation/migration or explicit historical/planned projection, not silent reinterpretation.

### 3.2 Retroactive correction rewrites historical process meaning

Candidate: graph revision `N+1` corrects a relation with retroactive business validity and a historical instance is re-evaluated as though it originally executed under `N+1`.

Disposition: existing historical-recomputation, provenance/supersession, temporal/currentness and revision-vector families. Detection candidate: distinguish transaction/system time from valid time and preserve producing revision/evidence commitments. Proof obligation: historical completion/conformance claims must name the model/revisions actually evaluated or explicitly state a later reinterpretation.

### 3.3 Uncertain predicate silently becomes deterministic branch truth

Candidate: a forecast, interval, distribution, optimization result or AI inference is compared to a threshold and collapsed into a definitive workflow branch without a declared decision policy.

Disposition: existing `G2-CONFLICT-PATTERN-ANALYTICAL-KIND-CONFLATION-001`, decision/semantic-owner, uncertainty and proof-claim families. Detection candidate: analytical-kind + uncertainty compatibility on predicate inputs and explicit decision-policy binding. Future remediation route: owner-qualified threshold/decision semantics or weaker status, not automatic scalarization.

### 3.4 Parent and child queues are locally stable but globally unstable

Candidate: parent and child workflows satisfy local queue assumptions, while shared provider/database/worker centers couple arrival/service rates and create unbounded or deadline-violating backlog.

Disposition: existing resource/capacity, cross-process objective, shared-infrastructure and proof-claim families. Detection candidate: queue-network dependency graph, shared-service-center identification, arrival/service assumption currentness and stability/headroom analysis. False-positive risk is high when workload distributions are sparse or nonstationary; signal must not be promoted directly to confirmed conflict.

### 3.5 Sound process definition is operationally deadline-infeasible

Candidate: all transitions are valid and definition-level completion is possible, but mandatory service-time path plus variance/capacity makes a declared SLA/deadline infeasible.

Disposition: existing temporal/resource/objective conflict plus proof-claim conflation. `definition soundness != SLA feasibility != observed completion`. Detection candidate: critical-path/service-time bounds, queue delay assumptions and sensitivity analysis. Future remediation route: owner-qualified capacity/SLA/process change, not research-time correction.

### 3.6 Bounded fan-out still destabilizes a shared bottleneck

Candidate: fan-out is capped and terminates, but the cap is high enough that synchronized child work overloads a shared service center or creates join starvation.

Disposition: existing resource/capacity, boundedness and proof-claim families. A finite bound proves neither acceptable cost nor stable throughput. Detection candidate: fan-out bound × service demand × shared-capacity envelope; runtime backlog/headroom signal.

### 3.7 Parent/child mapping valid in isolation but invalid in revision composition

Candidate: parent `P1` and child `C2` are individually accepted revisions, yet the pinned mapping between them changes units, semantic owner, presence semantics or output kind.

Disposition: existing certificate-composition, compatibility-direction, revision/currentness, units and analytical-kind patterns. Detection candidate: explicit parent-child contract/mapping revision vector and directional compatibility check. Proof obligation: a child certificate may be composed only against the exact interface/evidence profile accepted by the parent.

### 3.8 Parallel canonical writes are individually valid but non-commutative

Candidate: two branches can each legally update a canonical fact, but `A then B` differs from `B then A`, or one branch's compensation invalidates the other's adopted result.

Disposition: existing competing-authoritative-mutation, stale-read, compensation and semantic-owner families. Detection candidate: writer-set analysis, commutativity/postcondition comparison and runtime concurrent-mutation signal. Future remediation route remains serialize/coordinate/reconcile under the semantic owner; no blanket ban on parallelism.

### 3.9 Process-level provenance over-attributes field lineage

Candidate: because an activity consumed fields A/B/C and produced X/Y, the process projection asserts every input as a derivation of every output.

Disposition: duplicate of `G2-CONFLICT-PATTERN-PROVENANCE-EDGE-OVERATTRIBUTION-001`. Detection candidate: asserted/observed/inferred lineage kind plus field-level mapping evidence. `lineage relation != authority != causal proof` remains mandatory.

### 3.10 Decision/calculation/workflow semantic owner is blurred

Candidate: a large business decision table is encoded as nested branch nodes, or a calculation/estimate is encoded as a process transition such that rule priority, hit policy, explainability or analytical kind disappears.

Disposition: existing semantic-ownership, rule/condition, analytical-kind and AI/low-code composition families. Detection candidate: semantic-kind classification and rule/decision ownership review. This remains a Planning-C ownership question; it does not justify promoting Decision Semantics to a canonical capability automatically.

### 3.11 Vector scalarization silently changes process objective

Candidate: multiple resource/risk dimensions are reduced to one score with changed weights/normalization and the score drives a branch as though it were canonical fact.

Disposition: existing objective/optimization, revision/currentness, analytical-kind and authority families. Detection candidate: retain vector dimensions, units, normalization, weight revision and owner. Future remediation route: explicit policy/decision adoption or present Pareto alternatives; never infer authority from optimizer output.

### 3.12 Federated responsibility changes while handoff is in flight

Candidate: producer and consumer are autonomous builds; the handoff starts under `C1`, then `C2` changes retry, SLA, evidence or reconciliation ownership before completion.

Disposition: `G2-CONFLICT-PATTERN-FEDERATED-CONTINUITY-001` plus revision/currentness/human-responsibility families. Detection candidate: handoff correlation/effect identity with pinned bilateral contract revision and explicit responsibility for `UNKNOWN`. Shared mutable runtime/state remains unnecessary.

### 3.13 Graph transformation preserves syntax but invalidates proof obligations

Candidate: Canvas edit `N -> N+1` touches a seemingly local subgraph but changes a branch predicate, unit, semantic owner, join dependency, temporal validity or external effect profile; a previous soundness/completion/provenance claim is reused without revalidation.

Disposition: existing revision/currentness, proof-claim conflation, compatibility-direction and semantic-ownership families. Detection candidate: semantic diff + affected-subgraph closure + proof-dependency invalidation graph. Proof obligation: only claims covered by a demonstrated preservation relation may survive incrementally; others must be recomputed or weakened to UNKNOWN/unverified.

### 3.14 AI/low-code composes locally valid nodes into globally unstable work

Candidate: generated flow passes local schema/type/authority checks but creates shared-resource overload, impossible deadlines, non-commutative canonical writes or an uncertainty-to-fact conversion.

Disposition: existing AI non-amplification plus resource/capacity, temporal, analytical-kind, authority and semantic-ownership families. Detection candidate: N-wise/global analyzer candidate plus runtime observation; local node validity is insufficient evidence of global composition safety.

## 4. Conflict-assessment disposition

Result after screening all 124 reusable patterns:

- new local material edge scenarios: **0**;
- new cross-capability material scenarios: **0**;
- new reusable ConflictPatterns: **0**;
- new ConflictInstances asserted: **0**;
- new preventive invariant candidates: **0**;
- HIGH/CRITICAL without owner/proof/detection route introduced: **0**;
- bounded synthesis / Planning-A backfill required: **no**;
- implementation/remediation work opened: **0**.

All probes remain `CATALOGUE + CLASSIFY + DETECTION_CANDIDATE + FUTURE_REMEDIATION_ROUTE` variants of existing families. Material false-positive risks remain for uncertain workload distributions, retroactive business corrections, planned topology, stale evidence and inferred lineage; these remain signals until applicability/currentness is established.

## 5. Semantic/modeling research disposition

No mandatory semantic/modeling front is promoted to a canonical capability in this revisit.

Typed Semantic Graph + ExecutionEnvelope/State/Journal + Inter-System/Federated Graph + WorkflowCompletionCertificate/ProcessProofBundle remains **ARCHITECTURE HYPOTHESIS / IN RESEARCH**.

Planning C/D/E and Architecture Reconciliation must consume these open alternatives and limits:

- time-qualified graph relations may require both business-validity and recording/currentness semantics; PostgreSQL relational graph remains a credible baseline and current evidence does not require GraphDB;
- current/historical/future/planned graph projections and an in-flight pinned revision must remain distinguishable;
- control-flow proof results must identify the semantic fragment analyzed; richer cancellation/data/recursion/provider effects may invalidate a prior decidability/preservation assumption;
- queue/capacity analysis is a separate operational claim from graph soundness and must carry workload/service assumptions, uncertainty and shared-resource topology;
- `StoredFact != DerivedValue`, and analytical kind/units/uncertainty must survive predicates and mappings;
- process/workflow, decision and calculation need explicit semantic ownership even if later represented in one typed IR;
- provenance may support lineage/explanation but cannot be upgraded automatically to authority or causal proof;
- graph transformation needs semantic diff, affected-subgraph closure and explicit preservation/invalidation obligations for proofs, lineage, mappings and historical interpretation;
- completion proof remains decomposed into definition soundness, termination guarantee, execution conformance, journal integrity and external-effect evidence;
- child-proof composition requires interface/effect/evidence compatibility, not merely valid child certificates;
- federated continuity must preserve bilateral contract revision, identity/correlation, responsibility and UNKNOWN reconciliation without requiring shared mutable state;
- Fleet/Canvas remain projections and non-authoritative by default; Autonomous Builds remain capable of independent operation;
- GraphDB remains optional/provider-level.

## 6. Saturation disposition

This is an eligible no-new-material Process & Application Modeling revisit in Full Pass 7 and a material exercise of `Process/Application × Workflow × Data/Schema`.

- Process & Application Modeling local no-material streak remains capped at **2**;
- mandatory cluster streak remains capped at **2**;
- Full Pass 7 capability coverage becomes **2/28**;
- Full Pass 7 mandatory-cluster coverage becomes **2/12**;
- completed full passes remain **6/8 minimum**;
- target reference remains **12**, with no maximum;
- inventory remains **284 edge scenarios + 124 ConflictPatterns = 408 material findings**;
- HIGH/CRITICAL without owner/proof/detection route remains **0**;
- negative-space remains `NOT_STARTED`;
- saturation remains `NOT_SATURATED`;
- Planning C remains **BLOCKED**.

## 7. Next rotation

Continue only `RESEARCH_ADVERSARIAL_EDGE_CASE_SATURATION`, Full Pass 7, with **Workflow & Durable Execution** and explicitly exercise `Workflow × Integration × Messaging × external mutation` when applicable.

Use techniques materially different from prior passes and from this process-modeling revisit. Carry temporal/dynamic graph, provenance/lineage, decision/calculation ownership, units/vector/uncertainty, graph-transformation invalidation, federated responsibility, queue/capacity mathematics and completion-proof separation into durable execution. Challenge event/correlation/effect identity across retries and redrives; `UNKNOWN` external mutation with reconcile-before-retry; sync/async child lifecycle; timers/waits crossing graph/policy/provider revisions; cancellation versus external adoption; fan-out/fan-in under partial/late children; compensation eligibility after downstream use; queue-network/backpressure stability; proof/certificate composition after retries/recovery; provider substitution and residual callbacks; temporal contract applicability; human redrive procedures; and AI/low-code orchestration that strengthens weak evidence or hides uncertainty. Duplicate-screen all **124** reusable ConflictPatterns. Workflow local streak and the mandatory cluster streak are already capped at 2 and must not inflate absent material novelty. Do not enter Planning C.