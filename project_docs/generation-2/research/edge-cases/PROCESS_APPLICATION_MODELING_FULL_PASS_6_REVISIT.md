# Generation 2 — Process & Application Modeling — Full Pass 6 Revisit

Status: ACTIVE — ELIGIBLE NO-NEW-MATERIAL REVISIT
Phase: `RESEARCH_ADVERSARIAL_EDGE_CASE_SATURATION`
Capability: Process & Application Modeling
Explicit mandatory cluster: Process/Application × Workflow × Data/Schema
Disposition: `CATALOGUE + CLASSIFY + DETECTION_CANDIDATE + FUTURE_REMEDIATION_ROUTE`

Research only. Preserve `ConflictPattern != ConflictInstance`, `Signal != ConfirmedConflict`, `Research != remediation`, and `business truth != ExecutionState != ExecutionJournal`. No product code, Work Package, TASK, Construction, remediation or Planning C is authorized.

## 1. Full-Pass-6 attack profile

This revisit used techniques materially different from Passes 1–5 and carried the Typed Semantic Graph/Federation/formal-assurance hypothesis without selecting it as architecture:

1. **formal-abstraction differential** — map the same typed workflow into a restricted WF-net-style analysis profile, then reintroduce cancellation, data-dependent guards, external effects and recursion to test whether a proof claim leaks beyond the analyzed fragment;
2. **predicate/data reachability cross-product** — hold control topology fixed while changing presence semantics, schema revision and data predicates so a graph-reachable node becomes semantically unreachable or a join becomes unsatisfiable;
3. **instance-definition temporal splice** — pin a running instance to graph/workflow/schema revisions while editing the current definition and test whether current-definition validation is incorrectly projected onto the pinned instance;
4. **child-contract opacity test** — replace a child workflow by a certificate/contract-equivalent child while varying internal sync/async execution, UNKNOWN effects and compensation eligibility;
5. **federated handoff cut** — split one logical process across autonomous builds and remove shared runtime/state, retaining only a versioned contract edge, correlation/effect identity and bilateral evidence;
6. **writer-set commutativity matrix** — exercise parallel canonical writes that are individually valid but differ under ordering, stale reads, merge semantics and child completion cuts;
7. **boundedness-versus-business-completion differential** — prove/limit iterations, depth, duration or fan-out while independently falsifying required business postconditions;
8. **proof-bundle subtraction** — independently remove model revision, trace evidence, external-effect evidence, child proof or journal integrity and test whether `PROVEN_COMPLETED`-like claims survive incorrectly;
9. **analytical-kind substitution** — keep scalar/schema shape stable while substituting deterministic derivation, estimate, optimization result, AI inference and human decision in predicates/mappings;
10. **Fleet/projection inversion** — make Enterprise/Fleet/Canvas topology appear converged while autonomous local build/runtime/business truth remains revision-divergent.

## 2. Typed Semantic Graph / execution-model result

The hypothesis remains **ARCHITECTURE HYPOTHESIS / IN RESEARCH**. This pass continues to support explicit separation of `CapabilityDefinition`, `CapabilityUse/Invocation`, `WorkflowDefinition`, `WorkflowInstance`, typed data/authority/policy/formula/provider/revision relations, `ExecutionEnvelope`, `ExecutionState`, `ExecutionJournal` and separately owned business truth.

No storage conclusion changed. PostgreSQL typed relational graph persistence remains a credible baseline with bounded JSONB for capability-specific configuration; GraphDB remains optional/provider/projection-level. Canvas/Graph Explorer and Fleet remain projections and non-authoritative by default.

The strongest Full-Pass-6 result is that **formal analyzability is itself profile-qualified**. Classical workflow-net soundness is decidable, but workflow-language extensions can change decidability. Published workflow-net analysis reports classical WF-net soundness as decidable while many extensions such as reset/inhibitor behavior make soundness notions undecidable; bounded subclasses can recover decidability at significant complexity. Therefore a future verifier must identify the exact analyzed semantic fragment and must not promote a proof about an abstraction into proof of the richer executable graph.

This is not a new ConflictPattern: it duplicate-screens to `G2-CONFLICT-PATTERN-PROOF-CLAIM-CONFLATION-001`, qualified-claim/evidence-currentness, compatibility-direction and semantic-ownership families.

## 3. Process/Application × Workflow × Data/Schema findings

No distinct material finding survived duplicate-screen against all 123 reusable ConflictPatterns.

- **Graph-reachable but predicate/data-impossible work** reduces to structural graph + rule/condition + data/consistency conflict families. Static topology reachability is a signal, not proof of executable reachability under data semantics.
- **Data-dependent branch gaps/overlaps after schema or presence-semantics revision** reduce to presence-semantics, revision/currentness and compatibility-direction families.
- **Current graph validates while pinned in-flight instance is invalid under its historical dependency vector**, or the inverse, reduces to revision-vector/coexistence/currentness patterns. Validation must be revision-qualified.
- **Bounded loop/recursion/fan-out terminates operationally but required business work remains incomplete** reduces to proof-claim conflation. A resource/termination bound is not a business-completion proof.
- **Cancellation semantics encoded by a richer executable model but erased in a restricted formal projection** reduces to proof-claim conflation/qualified-claim rather than a new conflict class. Formal verification result must name its abstraction/profile.
- **Child certificate accepted despite parent↔child mapping/effect-profile mismatch** remains `G2-CONFLICT-PATTERN-CERTIFICATE-COMPOSITION-001`.
- **Federated producer terminalizes after handoff while consumer effect is UNKNOWN** remains `G2-CONFLICT-PATTERN-FEDERATED-CONTINUITY-001`; autonomous builds need not share runtime/state, but bilateral responsibility and effect disposition remain explicit.
- **Parallel writers are locally valid but non-commutative** remains competing-authoritative-mutation/semantic-owner/concurrency conflict.
- **Scalar-compatible analytical result changes kind** remains `G2-CONFLICT-PATTERN-ANALYTICAL-KIND-CONFLATION-001`; a predicate consuming an estimate/AI inference as deterministic fact is not rescued by schema compatibility.
- **Journal/root hash or conforming trace is substituted for external business-effect evidence** remains proof-claim conflation. Integrity/commitment, conformance and effect evidence remain separate proof domains.
- **Fleet/Canvas shows one topology/revision while autonomous local build is different** remains projection/currentness/false-convergence/residual-cohort. Fleet remains non-authoritative by default.
- **AI/low-code composes individually admitted nodes into a graph that hides UNKNOWN, changes analytical kind, introduces an unsatisfiable join or strengthens completion claims** reduces to AI non-amplification plus the existing structural/proof/analytical families.

No ConflictInstance is asserted. No preventive invariant candidate is added: blanket rejection of cancellation, cycles, data-dependent branching, asynchronous children, concurrent writes or federated handoffs would block legitimate processes. Later architecture should instead qualify the analyzable fragment and the obligations that cannot be proven statically.

## 4. Detection candidates and proof obligations

Detection candidates remain research inputs, not implementation:

- typed graph identity/revision checks across definition/use/instance;
- joint control-flow + data-flow reachability/satisfiability under declared presence/type/semantic-owner rules;
- branch overlap/gap and join satisfiability analysis;
- SCC/cycle classification plus explicit recursion/loop termination profile and runtime bounds;
- writer-set/non-commutativity and stale-read analysis;
- parent↔child contract/proof-profile compatibility;
- bilateral federated-edge contract completeness and UNKNOWN responsibility;
- analytical-kind/provenance compatibility at predicates and mappings;
- independent completion verifier that enumerates definition-soundness, termination, trace-conformance, journal-integrity and external-effect claims separately;
- runtime reconciliation for UNKNOWN external effects before unsafe retry/terminal proof;
- revision-qualified local-vs-Fleet/projection drift detection.

Proof obligations carried to later Planning C/D/E and Architecture Reconciliation include: identify the exact formal-analysis fragment; never strengthen a result beyond that fragment; preserve pinned dependency vectors for in-flight instances; prove or explicitly bound recursion/loops/fan-out; distinguish operational termination from semantic completion; require parent-child proof monotonicity; keep federated responsibility/effect evidence bilateral; and preserve analytical kind/provenance through data-flow.

## 5. Evidence / trade-offs

Workflow-net literature provides a useful boundary rather than a universal solution: classical WF-net soundness is decidable, while richer cancellation/reset/inhibitor constructs can cross undecidability boundaries; bounded subclasses can recover decidability but may be PSPACE-hard/complete. This supports an explicit `PROVED_FOR_RESTRICTED_FRAGMENT | BOUNDED_BY_RUNTIME_LIMIT | UNKNOWN | NOT_PROVABLE_BY_SELECTED_ANALYSIS` style of research distinction rather than a universal soundness claim.

Trade-off: restricting control/data semantics improves static proof power but can exclude legitimate enterprise behavior. Allowing richer semantics preserves expressiveness but requires bounded runtime guards, partial proof profiles and explicit UNKNOWN. The research preference remains to expose this boundary, not hide arbitrary imperative code inside nodes or claim total correctness.

## 6. Saturation result

Result: **ELIGIBLE NO-NEW-MATERIAL REVISIT**.

- new local edge scenarios: `0`;
- new cross-capability scenarios: `0`;
- new reusable ConflictPatterns: `0`;
- new preventive invariant candidates: `0`;
- ConflictInstances asserted: `0`;
- Process & Application Modeling local no-material streak remains capped at `2`;
- Process/Application × Workflow × Data/Schema cluster streak remains capped at `2`;
- Full Pass 6 coverage after this revisit: `2/28` capabilities and `2/12` mandatory clusters;
- inventory remains `284` edge scenarios + `123` ConflictPatterns = `407` material findings;
- HIGH/CRITICAL without owner/proof/detection route: `0`;
- negative-space: `NOT_STARTED`;
- saturation: `NOT_SATURATED`;
- Planning C: `BLOCKED`.

## 7. Next rotation

Continue only `RESEARCH_ADVERSARIAL_EDGE_CASE_SATURATION`, Full Pass 6, with **Workflow & Durable Execution** and explicitly exercise **Workflow × Integration × Messaging × external mutation** using techniques materially different from Passes 1–5. Carry formal-profile qualification, Typed Semantic Graph/Federation, explicit control-flow primitives, completion-proof domains and Autonomous Builds/Fleet into durable execution: sync/async child lifecycle, cancellation semantics, UNKNOWN external mutation, reconcile-before-retry, event/correlation/effect identity, fan-out/fan-in under partial children, termination/resource bounds, compensation after downstream adoption, proof composition, provider substitution/residual callbacks, federated handoff responsibility and AI/low-code claim strengthening. Duplicate-screen all 123 ConflictPatterns. Local and cluster streaks are already 2 and must not be inflated. Do not enter Planning C.