# Generation 2 — Commercial Metering / Entitlements / Rating / Billing / Payment — Full Pass 5 Revisit

Status: ACTIVE / ELIGIBLE NO-NEW-MATERIAL REVISIT
Phase: `RESEARCH_ADVERSARIAL_EDGE_CASE_SATURATION`
Full pass: 5
Capability: Commercial Metering / Entitlements / Rating / Billing / Payment
Mandatory cluster: Commercial Metering × Entitlements × Rating × Billing × Payment
Priority hypothesis: `Typed Semantic Graph` + capability-use nodes + executable workflow subgraphs/composite capabilities + `ExecutionEnvelope + delta + ExecutionJournal`; Autonomous Builds/Fleet Observability carried as non-authoritative research hypotheses.
Authority: `RESEARCH_PIPELINE_STATE.json`, `POST_MATH_ADVERSARIAL_EDGE_CASE_SATURATION_RESEARCH.md`, `PROCESSUAL_SEMANTIC_CONFLICT_CLASSIFICATION.md`

Research only. `ConflictPattern != ConflictInstance`; `Signal != ConfirmedConflict`. Default disposition remains `CATALOGUE + CLASSIFY + DETECTION_CANDIDATE + FUTURE_REMEDIATION_ROUTE`. No implementation, remediation, Work Package, TASK or Construction is authorized by this dossier.

## 1. Technique rotation

This revisit concentrates on graph/workflow composition rather than repeating the Pass-4 temporal-lattice screen:

- typed data-flow closure across usage event → metering subject → entitlement → rating profile → charge/obligation → invoice → payment/settlement;
- control-flow/data-flow mismatch, including dead monetary joins, impossible waits, duplicate authoritative fan-out and false dependency closure;
- capability-use aliasing where the same reusable commercial capability is instantiated under different customer, currency, revision, provider or authority contexts;
- field/semantic ownership mutation across `ExecutionEnvelope` and deltas, including duplicate writers and nondeterministic merge order;
- revision-sliced aggregation and stale-child/subworkflow revision analysis;
- sync/async child billing/payment workflows with cancellation, retry, compensation and `UNKNOWN` mutating outcomes;
- cross-workflow shared-resource analysis for balances, credits, quotas, invoice obligations, settlement identities and dedupe namespaces;
- graph realization differential: direct call versus queue/API/provider, residual old-provider cohorts, topology/version skew and autonomous-runtime subsets;
- resource/cardinality/cost amplification and recursive automation loops;
- static graph-analysis/model-checking/property-based detection candidates without promoting detector signals to confirmed conflicts;
- human-procedure and AI/low-code composition where locally valid actions can create an invalid aggregate monetary outcome.

Duplicate-screen baseline: all 119 reusable `G2-CONFLICT-PATTERN-*`, existing `G2-EDGE-COMMERCIAL-001..009`, and `G2-XEDGE-COMMERCIAL-001..006`.

## 2. Current external evidence used as portable support

OpenMeter documentation continues to separate the metering `subject` from the managed billable `Customer`: a subject identifies who produced usage while the Customer is the entity that subscribes, pays and owns entitlements. This is a representative witness that equality or linkage of identifiers does not collapse semantic roles.

FOCUS 1.4 continues to distinguish `Billed Cost` from `Effective Cost`; both are valid monetary claims but answer different questions and can diverge by design. FOCUS also models Billing Period as an explicit dataset with interval and status dimensions rather than treating a timestamp match as sufficient billing-state equivalence.

These sources support portable principles only. They do not make OpenMeter, FOCUS, GraphDB or any provider-specific mechanism canonical SB architecture.

## 3. Adversarial graph/workflow candidate screen

### Candidate A — typed reachability is mistaken for billable/economic closure

A semantic graph may contain a complete-looking path from usage through entitlement/rating/invoice/payment while one edge lacks the required customer ownership, currency/unit profile, revision, billing-period status, provider realization, authority or settlement qualification. Every node can be locally valid while the composed monetary claim is not jointly qualified.

Disposition: not a new reusable class. Existing semantic-ownership, qualified-join/currentness, commercial-stage-collapse, revision-vector, provider-support and false-convergence families cover it. Detection candidate: static typed-edge requirements plus pre-execution qualification of owner/revision/profile/provider/currentness. False-positive risk: intentionally provisional graphs and forecast-only edges must not be rejected as executable conflicts.

### Candidate B — capability-use aliasing duplicates one economic fact into multiple obligations

A reusable usage/rating capability is instantiated in two subgraphs that legitimately consume the same event but each independently closes into an invoice obligation because composition loses obligation lineage or dedupe scope. The individual subgraphs are correct; aggregate fan-out double-bills.

Disposition: not a new class. Existing qualified identity/dedupe-scope, semantic ownership, fan-out/duplicate-authoritative-work, commercial lineage and cross-process conflict patterns cover it. Detection candidate: obligation/effect lineage keyed by qualified owner + source + revision + economic purpose, not scalar event equality alone.

### Candidate C — graph join equates semantically different monetary values

`Billed Cost`, `Effective Cost`, rated charge, invoice amount, payment amount and settlement amount may be numerically equal at one instant while having different semantic owners, periods, currencies, revisions and correction semantics. A generic typed numeric edge or merge can falsely treat equality as substitutability.

Disposition: existing semantic-type/ownership, formula dimension/profile, commercial-stage-collapse and historical-reproduction patterns cover it. Detection candidate: semantic type + owner + revision + period + currency/unit profile on graph edges. Static prevention should reject only unauthorized substitution, not legitimate explicitly declared mappings.

### Candidate D — duplicate delta ownership creates nondeterministic commercial truth

Two child workflows return deltas for the same invoice/credit/balance field after independently valid rerating/refund/credit operations. Merge order changes the resulting value or lineage.

Disposition: existing multi-writer/lost-update, semantic-owner, correction/compensation, ambiguous-effect and journal/runtime-truth patterns cover it. Detection candidate: field/fact owner map plus commutativity/idempotency/conservation proof where concurrent deltas are allowed. `ExecutionJournal` records are evidence of attempted/applied transitions, not automatic proof of the current external monetary state.

### Candidate E — stale child revision crosses a billing cut

A parent workflow pins one rating/entitlement revision while an asynchronous child starts or resumes under another revision, then both contribute to one invoice or correction chain. Each revision is valid in isolation.

Disposition: existing revision-vector, historical reproduction, compatibility-direction, supersession/correction lineage and long-running-currentness patterns cover it. Detection candidate: explicit parent/child revision binding and billing-cut qualification; signals require evidence before claiming conflict.

### Candidate F — async child terminality is mistaken for economic quiescence

A payment/refund/chargeback child workflow may be terminal locally while provider settlement, webhook delivery, dispute state or downstream ledger adoption remains pending/unknown. Parent closure can therefore falsely mark the economic dependency as settled.

Disposition: existing acknowledgement/effect, residual-cohort, convergence/currentness, `UNKNOWN → reconcile-before-retry`, downstream-adoption and commercial-stage-collapse patterns cover it. Detection candidate: effect-specific quiescence/settlement evidence rather than child-terminal state alone.

### Candidate G — cancellation/retry/compensation branches double-reverse an obligation

Parent cancellation starts compensation while an async provider refund or chargeback later succeeds; both are individually valid recovery paths but aggregate to a duplicate reversal.

Disposition: existing ambiguous mutation/idempotency, compensation race, obligation/effect lineage, provider coexistence and cross-process adoption patterns cover it. Future remediation route if observed: freeze unsafe retry, reconcile qualified effect lineage, then route to the commercial semantic owner.

### Candidate H — hidden shared mutable commercial resource creates cross-workflow conflict

Separate workflows legitimately consume the same prepaid balance, credit pool, entitlement quota, commitment, budget or invoice adjustment capacity. The resource is omitted from the semantic dependency graph, so static closure appears safe while runtime composition overspends/double-allocates it.

Disposition: existing resource/capacity conflict, hidden effective input, stale-capacity and cross-process patterns cover it. Detection candidate: explicit resource-ownership/consumption edges where semantics require them plus pre-actuation requalification; not every shared read must become a serialized resource edge.

### Candidate I — provider substitution changes realization while canonical graph identity stays stable

The same semantic node is realized first by provider A and later provider B; residual A webhooks/refunds/settlements continue. A graph keyed only by canonical node identity can merge incompatible provider effect namespaces or currentness horizons.

Disposition: existing provider-native identity non-canonicity, residual-provider cohort, trust/namespace qualification, revision/currentness and provider-substitution patterns cover it. Detection candidate: realization identity and cohort remain qualified dimensions beneath stable semantic identity.

### Candidate J — graph recursion/fan-out creates valid but pathological monetary work

A generated workflow recursively rerates downstream dependents, or high-cardinality usage dimensions fan out into unbounded corrections/invoices/provider calls. Every local edge is valid, but aggregate work/cost grows without a bounded termination/resource policy.

Disposition: existing recursive termination, fan-out/resource-boundedness, backlog/starvation, provider quota and objective-governance patterns cover it. Detection candidate: static cycle/recursion policy, bounded expansion estimates and runtime budget/backlog signals.

### Candidate K — local-first versus Fleet evidence disagreement is promoted to monetary truth

Autonomous runtime has newer local usage/payment evidence while Fleet export is delayed, sampled, partial or unavailable. A central optimization/reconciliation process treats Fleet as authoritative and issues a correction against stale aggregate evidence.

Disposition: existing observability-coverage/currentness, local/effective truth, stale evidence, correction lineage and authority patterns cover it. Fleet remains non-authoritative by default; its signal must not overwrite qualified local commercial truth without owner-approved evidence rules.

### Candidate L — human or AI composition is locally authorized but aggregate monetary authority is wider

One procedure/agent may rerate, another refund, another apply credit, and each action may be independently authorized. A generated composite workflow chains them so aggregate exposure exceeds policy, separation-of-duty or intended correction semantics.

Disposition: existing human-procedure, AI/low-code composition, aggregate-authority non-amplification, SoD, objective/policy and compensation patterns cover it. Detection candidate: aggregate effect/authority analysis across the composed graph, with explicit owner review for exceptions.

## 4. Static/model/property-based detection candidates

No detector is treated as proof by itself. Candidate research hooks include:

- static typed-edge validation for semantic role, owner, revision, currency/unit, period and provider-realization requirements;
- reachability/orphan/dead-join/cycle analysis over executable commercial subgraphs;
- write-set/read-set overlap analysis for invoice, obligation, balance, quota and correction lineage;
- model-checking candidates over `invoice × payment × settlement × dispute × correction × provider effect` state products;
- property-based generation of reorder/retry/cancel/late-event sequences with invariants such as no duplicate obligation/economic reversal and reproducible historical lineage;
- conservation checks only where the semantic owner defines a valid conservation law and rounding/conversion residuals;
- runtime residual-cohort and competing-authoritative-effect signals;
- post-effect comparison of journaled intent versus provider/ledger/runtime truth.

GraphDB remains only a storage/provider hypothesis. The same semantic graph obligations could be represented in a relational typed graph, JSONB, event/journal stores or an optional graph projection. Storage technology must not be confused with semantic ownership or executable qualification.

## 5. Conflict-classification result

No candidate survives duplicate-screen as a genuinely new `G2-CONFLICT-PATTERN-*` family. No new `G2-EDGE-*` or `G2-XEDGE-*` ID is created merely to advance coverage. No preventive invariant candidate is newly elevated: the universal/material obligations already exist, while stronger generic prohibitions would block legitimate multi-customer attribution, explicit multi-currency mappings, asynchronous settlement, authorized correction styles, provider coexistence or bounded composite workflows.

Research disposition remains `CATALOGUE + CLASSIFY + DETECTION_CANDIDATE + FUTURE_REMEDIATION_ROUTE`.

## 6. Saturation result

- New local material edge scenarios: 0.
- New mandatory-cluster material scenarios: 0.
- New reusable ConflictPatterns: 0 after duplicate-screen against 119 patterns.
- New preventive invariant candidates: 0.
- Commercial local no-material streak: remains **2** (capped; no inflation).
- Commercial Metering × Entitlements × Rating × Billing × Payment cluster streak: remains **2** (capped; no inflation).
- HIGH/CRITICAL new scenarios without owner/proof/detection route: 0.
- Full Pass 5 capability coverage after this revisit: **11/28**.
- Full Pass 5 mandatory cluster coverage after this revisit: **10/12**.
- Material inventory remains **284 edge scenarios + 119 ConflictPatterns = 403 findings**.
- Negative-space remains `NOT_STARTED`.
- Saturation remains `NOT_SATURATED`.
- Planning C remains blocked.

## 7. Next bounded handoff

Continue only `RESEARCH_ADVERSARIAL_EDGE_CASE_SATURATION`, Full Pass 5, with **Technology Economic Governance / FinOps** and explicitly exercise **Mathematical Expressions × Workflow × Data × UI/Form × Commercial/FinOps** without inflating its already-satisfied streak above 2. Carry Typed Semantic Graph + ExecutionEnvelope + Autonomous Builds/Fleet Observability into cost-allocation/ownership graphs, formula/rate/budget/forecast revisions, shared commitment/provider resources, late-cost corrections after showback/chargeback adoption, `Billed Cost` versus `Effective Cost`, currency/unit/rounding conservation joins, historical reproduction, residual provider cohorts, `PARTIAL/UNKNOWN`, resource/cardinality/cost exhaustion, contradictory human procedures, objective conflicts and AI/low-code optimization. Fleet remains non-authoritative by default; GraphDB remains optional/provider-level. Do not enter Planning C.