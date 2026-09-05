# Generation 2 — Semantic Graph, Federation, Soundness & Execution Proof Research

Status: ACTIVE RESEARCH — ARCHITECTURE HYPOTHESIS / NOT A TARGET-ARCHITECTURE DECISION
Phase: `RESEARCH_ADVERSARIAL_EDGE_CASE_SATURATION`
Authority: `RESEARCH_PIPELINE_STATE.json` + adversarial framework + processual/semantic conflict classification.

Research only. No product code, Work Package, TASK, Construction or remediation is authorized. Preserve `ConflictPattern != ConflictInstance`, `Signal != ConfirmedConflict`, and `CATALOGUE + CLASSIFY + DETECTION_CANDIDATE + FUTURE_REMEDIATION_ROUTE`.

## 1. Research question

This increment extends the Typed Semantic Graph hypothesis into four mandatory fronts: inter-system/federated continuity, explicit control-flow primitives, mathematical/analytical graph semantics, and workflow soundness/completion evidence. It does **not** assume GraphDB.

Working hypothesis:

- `CapabilityDefinition` / operation is reusable semantic function;
- `CapabilityUse/Invocation` is an occurrence in a workflow revision;
- workflow is an executable typed path/subgraph;
- a subworkflow may expose a composite capability contract;
- data, documents, authority, policy, formula, provider, revision and inter-system relations are typed graph relations;
- `ExecutionEnvelope` carries bounded context/references and deltas, not unlimited history;
- immutable `ExecutionJournal` records traversal/attempt/evidence history;
- `ExecutionState` is the current execution snapshot;
- business truth remains separately owned;
- PostgreSQL relational graph tables remain the baseline hypothesis; GraphDB is only an optional provider/projection if later evidence justifies it.

## 2. Inter-system / federated graph

Autonomous systems can form process continuity without sharing runtime or mutable state when the boundary is represented as a versioned inter-system contract. The boundary needs qualified identities for producer system/build/workflow revision, consumer system/build/workflow revision, operation/schema contract, correlation/effect identity, authentication/authorization, SLA/currentness, idempotency/reconciliation, privacy/data minimization, metering/billing and failure responsibility.

The Enterprise/Federated Graph is therefore best researched as a **semantic dependency/contract projection**, not a distributed shared-state machine. It may represent provider→consumer relations, shared capabilities, economic dependencies, cross-company workflow edges, capacity and internal charging while each autonomous build retains its own execution state and business truth.

Proof obligations carried forward:

1. a federated edge must not imply shared transactionality or shared state;
2. provider acceptance/ACK must not be promoted to consumer business effect;
3. correlation identity must survive retries/provider substitution without becoming canonical business identity;
4. responsibility for `PARTIAL/UNKNOWN` must remain explicit across the organizational boundary;
5. dependency cycles and correlated capacity/blast radius need bounded analysis;
6. economic/service dependencies must not silently grant authority or data access.

## 3. Control-flow primitives

Candidate portable primitives are explicit `condition/if-then-else`, `switch/case`, bounded `for/for-each`, bounded `while`, wait/timer, fan-out, fan-in/join, recursion, cancellation and compensation. Arbitrary hidden imperative code in a node weakens static reasoning because graph-visible control/data dependencies cease to be complete.

Loops/recursion require explicit termination evidence where a guarantee is claimed: termination predicate, variant/ranking function where expressible, maximum iterations/depth/duration/resource budget, and qualified assumptions. Bounded execution can guarantee resource/termination ceilings without proving the business postcondition. Some useful static properties remain decidable only for restricted graph/control/data languages; unrestricted user code, unbounded recursion and sufficiently expressive data-dependent behavior cross into general program-verification/halting limits. Planning must therefore distinguish `PROVED_FOR_RESTRICTED_FRAGMENT`, `BOUNDED_BY_RUNTIME_LIMIT`, `UNKNOWN`, and `NOT_PROVABLE_BY_SELECTED_ANALYSIS` rather than imply universal decidability.

## 4. Mathematical / analytical graph semantics

Preserve `StoredFact != DerivedValue` and providerized mechanics with portable semantics. Graph relations can make dependency/provenance explicit, but result kinds must remain semantically distinct:

- `DETERMINISTIC_DERIVATION`: same qualified inputs/revisions/semantics imply the same result within declared numeric semantics;
- `STATISTICAL_ESTIMATE`: carries estimator/model, sample/population assumptions, uncertainty/confidence and snapshot;
- `OPTIMIZATION_RESULT`: carries objective(s), constraints, solver/mechanics, feasibility/optimality status and assumptions;
- `AI_INFERENCE`: carries model/provider/revision/context and confidence/uncertainty where meaningful, without deterministic claim;
- `HUMAN_DECISION`: records accountable human disposition and evidence/context, not a mathematical derivation.

Formula/analysis dependency edges should support impact analysis when input or revision changes, while historical outputs retain the original qualified snapshot. A current recomputation is not a historical correction unless explicitly superseding with lineage.

## 5. Workflow soundness and completion evidence

Research distinguishes five claims that must not be collapsed:

1. **definition soundness** — the workflow definition can reach proper completion and does not leave required work/tokens stranded under the selected formal model;
2. **termination guarantee** — loops/recursion terminate under declared preconditions/variants/bounds;
3. **execution conformance** — observed trace conforms to the expected workflow revision/contracts;
4. **journal integrity** — recorded evidence has not been undetectably altered relative to a commitment;
5. **external-effect evidence** — required external business effects actually occurred to the confidence/currentness required by their contracts.

Petri/workflow-net soundness, reachability, liveness/deadlock analysis, temporal logic/model checking and SAT/SMT are candidate analysis families, not a single universal solver. Their applicability and decidability depend on the chosen workflow fragment, boundedness and data semantics.

Candidate execution-evidence bundle (provisional name only): `WorkflowCompletionCertificate` / `ProcessProofBundle` containing graph/workflow revision commitment, build/deployment identity, input commitments, ordered invocation/edge trace, node result/effect dispositions, output commitments, terminal state, satisfied invariants/proof obligations, unresolved `UNKNOWN`s, journal root/hash-chain/Merkle commitment and optional signature/attestation.

A hash/Merkle root proves a commitment/integrity relation, **not semantic correctness**. RFC 9162 inclusion proofs establish inclusion in a committed tree and consistency proofs establish append-only consistency between tree states; neither proves that a workflow transition was semantically valid or that an external effect occurred. An independent verifier would need the model/revision, trace, contracts/invariants and qualified effect evidence in addition to integrity commitments.

Candidate status lattice for later Planning C/D/E research: `COMPLETED`, `COMPLETED_WITH_UNVERIFIED_EXTERNAL_EFFECT`, `PROVEN_COMPLETED` (provisional), `PARTIAL`, `UNKNOWN`, `FAILED`. `PROVEN_COMPLETED` is only a candidate when terminal-state, required joins/children/effects, invariants and evidence obligations are all satisfied under an explicit verifier profile.

Child-proof composition is safe only if the parent verifies at least child certificate authenticity/integrity, child workflow/contract revision, parent↔child input/output commitments, required effect/evidence profile, terminal disposition and absence/allowed treatment of unresolved `UNKNOWN`. A parent cannot infer semantic completion merely from a child root hash or `COMPLETED` flag.

## 6. Relational persistence and projections

PostgreSQL remains a plausible baseline: typed definition/revision/node/edge tables; bounded JSONB configuration; workflow instance/node execution/edge traversal/journal tables; separate business truth. PostgreSQL recursive CTEs and `CYCLE` support traversal/cycle detection, demonstrating that graph-shaped semantics do not imply GraphDB. GraphDB remains optional for query/projection workloads if later product proofs show relational traversal is insufficient.

Canvas/Graph Explorer remains a projection, with candidate zoom `Enterprise -> Workspace -> Workflow -> Subworkflow -> Capability -> Contract/Provider` and Process/Capability/Data/Authority/Provider/Runtime/Risk views. Projection must never strengthen evidence: hidden/collapsed edges are not proof of absence, and visual reachability is not authority/currentness/effect proof.

## 7. New reusable ConflictPatterns

### G2-CONFLICT-PATTERN-PROOF-CLAIM-CONFLATION-001

- activation conditions: an integrity/trace/soundness/termination/effect claim is reused as if it proved one or more of the other proof domains;
- incompatible claims/actions/states: `journal committed` or `definition sound` versus `execution semantically correct / external effects proven`;
- detection stage/candidate: static certificate-profile validation + independent verifier claim lattice + audit comparison of evidence obligations;
- owners: Workflow & Durable Execution; Governance/Compliance/Audit; Security/Resilience for integrity; external-effect semantic owners;
- severity: HIGH; confidence: strongly supported; detectability: static/pre-execution/post-effect depending claim;
- blast radius: workflow instance through external parties; reversibility: potentially irreversible after external actuation;
- time-to-harm: immediate or delayed; misuse likelihood: plausible/likely through overclaim;
- evidence currentness: must be revision/effect qualified; false-positive risk: MEDIUM if verifier profile intentionally makes only a narrow claim;
- proof obligation: every certificate/verifier output must enumerate exactly which proof domains it establishes and unresolved obligations;
- future remediation disposition: Planning C/D/E + Architecture Reconciliation candidate; no implementation now.

### G2-CONFLICT-PATTERN-FEDERATED-CONTINUITY-001

- activation conditions: two autonomous systems connect workflows through a contract edge while correlation, revision, authority, effect disposition or responsibility is incomplete/ambiguous;
- incompatible claims/actions/states: producer says handed-off/complete while consumer has not accepted/applied, or each side assigns reconciliation responsibility to the other;
- detection stage/candidate: design-time contract completeness + pre-execution revision/authority qualification + runtime correlation/effect reconciliation;
- owners: Integration & Automation; Workflow; Provider/Binding; Identity/Authorization; Governance for responsibility; Commercial/Privacy where applicable;
- severity: HIGH; confidence: strongly supported; detectability: static + runtime + audit;
- blast radius: cross-system/cross-company/external parties; reversibility: bounded to potentially irreversible;
- time-to-harm: immediate/delayed; misuse likelihood: plausible;
- evidence currentness: bilateral/current; false-positive risk: MEDIUM because asynchronous handoff is legitimate when explicitly modeled;
- proof obligation: the inter-system edge must expose versioned contract, correlation/effect identity, ownership and `UNKNOWN` reconciliation semantics without implying shared state;
- future remediation disposition: Planning C/D/E + Architecture Reconciliation candidate.

### G2-CONFLICT-PATTERN-CERTIFICATE-COMPOSITION-001

- activation conditions: parent workflow accepts a child completion/proof artifact without qualifying child revision, contract mapping, effect/evidence profile or unresolved `UNKNOWN`;
- incompatible claims/actions/states: child artifact valid in its own profile while parent claims stronger completion/effect semantics;
- detection stage/candidate: static parent↔child proof-profile compatibility + verifier checks at join/completion;
- owners: Workflow & Durable Execution; Governance/Audit; child capability semantic owner;
- severity: HIGH; confidence: supported; detectability: static/pre-completion;
- blast radius: parent workflow/process/external parties; reversibility: bounded to potentially irreversible;
- time-to-harm: at join/terminalization; misuse likelihood: plausible;
- evidence currentness: pinned revisions required; false-positive risk: MEDIUM if parent deliberately requires a weaker profile;
- proof obligation: prove monotonic/non-strengthening composition of child claims into parent claims;
- future remediation disposition: Planning C/D/E + Architecture Reconciliation candidate.

### G2-CONFLICT-PATTERN-ANALYTICAL-KIND-CONFLATION-001

- activation conditions: deterministic derivation, statistical estimate, optimization result, AI inference or human decision is consumed as another kind without explicit semantic conversion/owner qualification;
- incompatible claims/actions/states: uncertain/model-dependent result used as deterministic fact, or human/AI judgment used as canonical formula result;
- detection stage/candidate: typed graph/result-kind checking + provenance/currentness validation + consumer contract qualification;
- owners: Mathematical Expressions cross-cutting semantics; Data/Schema; consuming capability semantic owner; AI/AGWS where applicable;
- severity: HIGH; confidence: strongly supported; detectability: static/pre-execution/audit;
- blast radius: record through enterprise/external financial or operational decisions; reversibility: bounded to migration/correction required;
- time-to-harm: immediate/cumulative; misuse likelihood: likely without typed distinction;
- evidence currentness: snapshot/revision qualified; false-positive risk: LOW-MEDIUM when explicit conversion semantics exist;
- proof obligation: consumers must declare accepted analytical kind and required assumptions/confidence/provenance rather than rely on scalar type compatibility;
- future remediation disposition: Planning C/D/E + Architecture Reconciliation candidate.

None of these patterns is a `ConflictInstance`. No preventive invariant is adopted here; candidate proof obligations are carried forward for architecture/product-proof evaluation.

## 8. Evidence and trade-offs

- PostgreSQL documentation (v17, accessed 2026-09-05) documents recursive CTE graph traversal and a `CYCLE` clause that tracks paths/cycle detection. This supports relational graph feasibility but does not prove target-scale performance.
- RFC 9162 Certificate Transparency v2 defines Merkle inclusion proofs and consistency proofs. This supports tamper-evident/offline-verifiable journal commitments while sharply limiting the claim to inclusion/append-only consistency, not semantic correctness.
- Workflow-net/Petri-net soundness literature is relevant to proper completion and deadlock/liveness analysis, but G2 must not assume those decidability results survive unrestricted data, arbitrary code, external effects or unbounded recursion.

Trade-off summary: stronger explicit semantics and proof profiles improve analyzability/auditability but increase model/compiler/verifier complexity and may constrain arbitrary low-code behavior. The research preference is not to ban expressiveness universally; it is to make the analyzable subset and the boundary to `UNKNOWN/not statically proven` explicit.

## 9. Planning handoff candidates

If adversarial saturation later reaches `CLOSED / SATURATED / PASS`, carry this artifact to Planning C/D/E and Architecture Reconciliation as decision input for: semantic graph IR; federated graph contracts; explicit control-flow primitives; analytical result kinds; proof-domain lattice; completion status lattice; verifier architecture; append-only journal commitments; proof composition; relational persistence; GraphDB optionality; and product acceptance proofs/cost bounds.

Planning C remains blocked now.