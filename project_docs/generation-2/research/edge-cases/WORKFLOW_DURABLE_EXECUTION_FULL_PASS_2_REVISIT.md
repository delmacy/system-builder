# Generation 2 — Workflow & Durable Execution — Full Pass 2 Revisit

Status: FULL PASS 2 — MATERIAL FINDINGS / LOCAL STREAK 0 / PAIRED CLUSTER STREAK 0
Capability: Workflow & Durable Execution
Paired cluster: Workflow × Integration × Messaging × external mutation
Phase: `RESEARCH_ADVERSARIAL_EDGE_CASE_SATURATION`

Research-only disposition: `CATALOGUE + CLASSIFY + DETECTION_CANDIDATE + FUTURE_REMEDIATION_ROUTE`. This artifact does not create implementation work, target architecture or a `ConflictInstance`. Preserve `ConflictPattern != ConflictInstance`, `Signal != ConfirmedConflict`, provider IDs non-canonical, `Enterprise → Station → Role → Person`, AI/AGWS non-amplification and `UNKNOWN → reconcile-before-retry`.

Linked campaign artifacts: `EDGE_CASE_INDEX.md`, `CROSS_CAPABILITY_EDGE_CASE_MATRIX.md`, `ADVERSARIAL_SATURATION_STATE.json`, `PROCESSUAL_SEMANTIC_CONFLICT_CLASSIFICATION.md`.

## Revisit method and duplicate screen

Full Pass 1 already catalogued duplicate/out-of-order signals, timer/cancel/approval races, ambiguous action-then-state persistence, revision skew, stale human-task authority, work amplification, provider-ack/effective-state collapse, idempotency-scope mismatch, compensation versus delayed original messages and residual-provider coexistence.

Pass 2 therefore used materially different probes: correlation-cardinality ambiguity, liveness/fairness under valid priority and backpressure, authority/currentness changes around manual redrive, externally completed work without canonical acknowledgement, cross-process adoption before compensation, durable waits whose wake predicate becomes permanently ineligible, replay under changed formula/provider/identity revisions, and aggregate AI/low-code orchestration.

Duplicate-screen result:

- permanent wake ineligibility after authority/policy change maps to `G2-CONFLICT-PATTERN-AUTHORITY-LIVENESS-001` plus existing workflow revision/currentness patterns;
- simultaneous timers/events producing incompatible progress maps to `G2-CONFLICT-PATTERN-TEMPORAL-001`;
- compensation after downstream adoption maps to `G2-CONFLICT-PATTERN-CROSS-PROCESS-COMPENSATION-001`;
- replay across revision vectors maps to existing revision/version/currentness patterns;
- external work with missing acknowledgement maps to acknowledgement/effect and reconciliation-currentness patterns;
- aggregate AI/low-code retry/callback loops map to `G2-CONFLICT-PATTERN-AUTOMATION-COMPOSITION-001`;
- two classes survived duplicate screening: correlation-cardinality ambiguity and starvation/fairness under valid scheduling constraints.

## External evidence anchors

- AWS Step Functions redrive preserves successful prior step results/history while rerunning unsuccessful work; retry counters for redriven Task/Parallel/Inline Map states reset. A Wait state whose timestamp is already past exits immediately on redrive. This supports treating redrive as explicit attempt lineage rather than proof that prior external effects or temporal assumptions remain current.
- Azure Durable Functions documents deterministic replay constraints and warns that direct external I/O from orchestrators can duplicate or become nondeterministic under replay. This supports separating replay-safe orchestration state from externally effective mutations.

Sources:
- https://docs.aws.amazon.com/step-functions/latest/dg/redrive-executions.html
- https://learn.microsoft.com/azure/azure-functions/durable/durable-functions-code-constraints

## New local material scenarios

### G2-EDGE-WORKFLOW-007 — correlation cardinality is semantically ambiguous despite individually valid events

- Scenario: two distinct external events are each structurally eligible to satisfy one durable obligation, or one event is structurally eligible to satisfy multiple competing obligations, without an owner-qualified cardinality rule that establishes whether mapping is 1:1, 1:N or N:1.
- Activation conditions: correlation keys overlap, business aliases merge, provider-native identifiers are reused, matching predicates are broader than canonical obligation identity, or multiple open waits share compatible predicates.
- Incompatible claims/actions/states: each event/wait pair is locally matchable, but the composition cannot prove which obligation consumes the event or whether consumption is exclusive, shared or duplicative.
- Expected safe behavior: matching produces a qualified correlation decision or remains `INCONCLUSIVE`; event consumption and durable progress preserve canonical obligation identity and declared cardinality. Provider IDs may support evidence but cannot become canonical truth by themselves.
- Forbidden behavior: first-arrival/first-match/provider-message-ID silently chooses canonical business ownership; one event advances competing exclusive obligations; two events independently satisfy the same single-consumption obligation.
- Failure/effect disposition: ambiguous mapping → `INCONCLUSIVE`; any already-triggered mutation whose ownership cannot be proven remains `UNKNOWN/PARTIAL` and requires reconciliation before retry or compensation.
- Owner(s): Workflow durable correlation semantics; Integration for external event mapping; Messaging for delivery evidence; affected domain semantic owner for obligation identity/cardinality.
- Authority boundary: correlation cannot confer execution authority; protected follow-on actions still re-evaluate `Enterprise → Station → Role → Person`.
- Evidence/currentness: canonical obligation IDs/revisions, correlation-rule revision, event semantic identity, consumption history, provider generation, current workflow state and competing-open-wait inventory.
- Recovery/reconciliation: freeze unsafe duplicate progression, reconcile event-to-obligation lineage with semantic owner evidence, then resume only qualified obligations; preserve rejected/ambiguous observations.
- Blast radius: workflow instance → multiple process instances/external parties.
- Severity: CRITICAL.
- Confidence: strongly supported.
- Detectability: static/pre-execution candidate plus runtime ambiguity signal.
- Reversibility: bounded before effects; potentially irreversible after external mutations.
- Time-to-harm: immediate.
- Misuse likelihood: plausible accidental; adversarial event shaping possible.
- Evidence currentness: must include current set of open obligations and correlation revision, not only event-time evidence.
- False-positive risk: medium; some domains intentionally permit broadcast or many-to-one aggregation, so detector must consume declared cardinality semantics.
- Proof obligation: `WORKFLOW-P2-PROOF-007` — ambiguous correlation cannot silently establish exclusive canonical progress without owner-qualified cardinality/currentness evidence.
- Architecture consequence candidate: retain explicit correlation/cardinality proof obligation for Planning C; do not prescribe a module here.
- Saturation status: MATERIAL NEW LOCAL CLASS; Workflow local streak remains/resets 0.

### G2-EDGE-WORKFLOW-008 — valid priority and backpressure policies create indefinite starvation without a failed transition

- Scenario: every scheduling, quota and priority decision is individually valid, yet a durable work class can remain perpetually eligible but never selected because higher-priority or continuously replenished work consumes all effective capacity.
- Activation conditions: strict priorities, bounded worker/provider capacity, sustained high-priority arrivals, tenant/station quotas, retry/backoff queues or low-priority human work sharing the same scarce executor.
- Incompatible claims/actions/states: workflow state says work remains eligible/pending; scheduler/provider decisions are locally policy-compliant; process SLA/fairness/liveness claims require eventual progress that composition never provides.
- Expected safe behavior: lack of progress remains observable as a liveness/fairness qualification problem; terminal success, healthy queue or policy compliance must not imply that all eligible cohorts can progress.
- Forbidden behavior: starvation is hidden because no individual transition failed; priority policy silently overrides mandatory SLA/fairness without owner-qualified precedence; AI/low-code increases priority of its own work beyond authorized policy.
- Failure/effect disposition: prolonged non-progress is not `SUCCESS`; qualification may become degraded/`INCONCLUSIVE` according to owner SLA/liveness semantics.
- Owner(s): Workflow execution/liveness; Deployment/Runtime capacity realization; Provider/Binding capacity evidence; Governance/Policy for priority/fairness obligations; FinOps only for economic evidence, not semantic priority ownership.
- Authority boundary: local process or AI cannot weaken inherited enterprise/station fairness or priority constraints.
- Evidence/currentness: queue age by class, eligibility age, dispatch history, priority policy revision, capacity/quota currentness, retries, tenant/station ownership and SLA/fairness obligations.
- Recovery/reconciliation: owner-qualified reprioritization/capacity action or explicit accepted-risk route; preserve starvation evidence and do not fabricate completion.
- Blast radius: task cohort → station/system; cumulative external SLA harm.
- Severity: HIGH.
- Confidence: strongly supported by scheduling/liveness reasoning.
- Detectability: runtime plus pre-execution capacity/liveness model candidate.
- Reversibility: generally bounded operationally, but missed deadlines or human obligations may be irreversible.
- Time-to-harm: delayed/cumulative.
- Misuse likelihood: likely accidental under load; plausible optimization misuse.
- Evidence currentness: queue/capacity observations must be current enough to support liveness inference.
- False-positive risk: medium-high because intentional low-priority delay is legitimate; detector needs declared progress/fairness/SLA semantics and observation horizon.
- Proof obligation: `WORKFLOW-P2-PROOF-008` — locally valid scheduling cannot be reported as globally healthy/converged when an owner-qualified durable cohort is indefinitely starved.
- Architecture consequence candidate: retain liveness/fairness detection and explicit objective-precedence proof obligation; no scheduling algorithm is prescribed.
- Saturation status: MATERIAL NEW LOCAL CLASS; Workflow local streak remains/resets 0.

## New paired-cluster material scenario

### G2-XEDGE-WORKFLOW-INTEGRATION-MSG-005 — ambiguous correlation maps one event/effect to competing durable obligations

- Scenario: Integration legitimately normalizes an external event and Messaging legitimately delivers it, while multiple durable workflow obligations independently accept the normalized correlation predicate; alternatively, distinct external events map to a single obligation with exclusive-consumption semantics.
- Activation conditions: shared business key, alias reuse, provider substitution, event replay, multiple workflows waiting on the same external fact, or correlation rule revision while waits are in flight.
- Incompatible claims/actions/states: Integration says the normalized event is valid; Messaging says delivery is valid; each Workflow waiter says the event is admissible; domain semantics require an owner-qualified consumption/cardinality decision that the composition lacks.
- Expected safe behavior: `Signal != ConfirmedConflict`; ambiguous mapping remains diagnosable and cannot silently create multiple authoritative effects. Canonical obligation/effect identity survives provider substitution and delivery retries.
- Forbidden behavior: provider event ID or delivery order acts as canonical ownership; broadcast is inferred from multiple matches; single consumption is inferred from first consumer without domain evidence.
- Failure/effect disposition: pre-effect ambiguity → `INCONCLUSIVE`; post-effect ambiguity → `PARTIAL/UNKNOWN` until reconciled.
- Owner(s): Workflow + Integration + Messaging + target semantic owner; Provider/Binding qualifies realization semantics only.
- Evidence/currentness: normalized event identity/revision, all candidate durable obligations and their revisions, declared cardinality/consumption semantics, provider binding generation, delivery/consumption history and target-effect evidence.
- Recovery/reconciliation: reconcile obligation/effect lineage first; only then redrive, compensate or continue according to the owning process semantics.
- Blast radius: multiple workflow/process instances and external effects.
- Severity: CRITICAL.
- Confidence: strongly supported.
- Detectability: pre-execution/runtime correlation collision candidate; audit confirmation after effects.
- Reversibility: potentially irreversible after external action.
- Time-to-harm: immediate.
- Misuse likelihood: plausible accidental; provider substitution/replay raises likelihood.
- Evidence currentness: current open-wait set plus correlation/provider revision is mandatory.
- False-positive risk: medium because intentional fan-out/fan-in exists; detector must distinguish declared broadcast/aggregation from accidental ambiguity.
- Proof obligation: `XWORKFLOW-P2-PROOF-005` — cross-capability event correlation must not infer obligation cardinality from transport/provider mechanics.
- Future remediation disposition: reconcile owner-qualified correlation/consumption semantics; no implementation chosen in research.
- Saturation status: MATERIAL NEW CLUSTER CLASS; Workflow × Integration × Messaging × external mutation streak remains/resets 0.

## New reusable ConflictPatterns

### G2-CONFLICT-PATTERN-CORRELATION-CARDINALITY-001 — valid local correlations disagree on consumption cardinality

- Family: semantic ownership + data/consistency + provider/integration + cross-process.
- Narrative: multiple mappings are locally valid, but composition lacks a canonical rule for whether an event/effect belongs to one, many or aggregated obligations.
- Preconditions / activation conditions: overlapping correlation predicates or aliases; concurrent open obligations; replay/substitution/revision changes; undeclared or stale cardinality semantics.
- Incompatible claims/actions/states: several consumers claim exclusive ownership, or several events independently claim the same single-consumption obligation.
- Why local validation may miss it: each producer/delivery/consumer validates its own contract; contradiction appears only when all candidate mappings are considered together.
- Detection stage/candidate: static overlap/cardinality analysis where definitions are available; pre-execution collision check over current open obligations; runtime competing-consumption signal; audit lineage check post-effect.
- Required evidence: owner-qualified correlation/cardinality revision, current candidate obligations, event semantic identity, delivery/consumption lineage and provider generation.
- Owner(s): affected domain semantic owner + Workflow; Integration/Messaging realization owners; Provider/Binding as qualification owner.
- Severity: HIGH–CRITICAL.
- Confidence: strongly supported.
- Detectability: static/pre-execution/runtime/post-effect depending data availability.
- Blast radius: instance → process/system/external parties.
- Reversibility: easy before effect; potentially irreversible after competing effects.
- Time-to-harm: immediate.
- Misuse likelihood: plausible accidental, adversarial replay possible.
- Evidence currentness: current open-obligation set and correlation revision required.
- False-positive risk: medium; valid broadcast/aggregation patterns must be explicitly representable.
- Static prevention feasibility: candidate only when a declared exclusive cardinality invariant exists; universal rejection of overlapping correlation would over-constrain legitimate processes.
- Future remediation disposition: `CATALOGUE + CLASSIFY + DETECTION_CANDIDATE + FUTURE_REMEDIATION_ROUTE`; when observed, require owner-qualified reconciliation/selection or explicit broadcast/aggregation semantics.
- Proof/test candidate: property tests/model-check candidate over event↔obligation cardinality and competing durable waits.
- Preventive invariant candidate: bounded candidate — only for explicitly exclusive owner semantics; not a universal ban on overlap.
- Saturation status: NEW MATERIAL PATTERN.

### G2-CONFLICT-PATTERN-SCHEDULING-STARVATION-001 — policy-valid scheduling violates owner-qualified liveness/fairness

- Family: temporal + resource/capacity + objective/optimization + policy.
- Narrative: every dispatch decision obeys local priority/capacity policy, yet a durable cohort never progresses and therefore conflicts with an independent SLA/fairness/liveness obligation.
- Preconditions / activation conditions: sustained contention, strict priority or quota, insufficient reserved capacity, continually refreshed higher-priority work, or interaction between retry queues and normal work.
- Incompatible claims/actions/states: scheduler claims compliant allocation; workflow/process owner claims eventual progress/fairness/SLA; both can be locally valid under different horizons/objectives.
- Why local validation may miss it: no single transition or dispatch is invalid; contradiction is cumulative and appears only over time across objectives.
- Detection stage/candidate: pre-execution capacity/liveness analysis when bounds are known; runtime starvation-age/fairness signal; post-SLA audit.
- Required evidence: eligibility age, dispatch/queue history, priority/fairness/SLA revisions, capacity/quota currentness and ownership scope.
- Owner(s): Workflow/process liveness owner + Governance/Policy objective precedence; Runtime/Provider for capacity realization evidence.
- Severity: MEDIUM–HIGH, CRITICAL only for safety/legally time-bound workflows.
- Confidence: strongly supported.
- Detectability: runtime primarily; static/model-check candidate for bounded schedulers.
- Blast radius: task cohort → station/system.
- Reversibility: usually bounded, but missed deadlines may be irreversible.
- Time-to-harm: delayed/cumulative.
- Misuse likelihood: likely accidental; plausible optimization abuse.
- Evidence currentness: observation horizon must be long enough for the owner-qualified liveness obligation.
- False-positive risk: medium-high; intentional deferral and best-effort work are legitimate.
- Static prevention feasibility: generally undesirable without declared liveness/fairness semantics; warning/detection is safer than a universal scheduler constraint.
- Future remediation disposition: `CATALOGUE + CLASSIFY + DETECTION_CANDIDATE + FUTURE_REMEDIATION_ROUTE`; when observed, route to policy/capacity owner for precedence, reprioritization, additional evidence or accepted risk.
- Proof/test candidate: bounded starvation/fairness model and workload property tests.
- Preventive invariant candidate: NO universal invariant proposed; requires explicit owner semantics to avoid blocking legitimate strict-priority processes.
- Saturation status: NEW MATERIAL PATTERN.

## Saturation result

- New local edge scenarios: 2 (`G2-EDGE-WORKFLOW-007..008`).
- New paired-cluster scenarios: 1 (`G2-XEDGE-WORKFLOW-INTEGRATION-MSG-005`).
- New reusable ConflictPatterns: 2.
- Workflow local no-material streak: 0 because material findings survived duplicate screening.
- Workflow × Integration × Messaging × external mutation cluster streak: 0 because a material interaction finding survived duplicate screening.
- HIGH/CRITICAL new scenarios without owner/proof/detection route: 0.
- No 13th mandatory cluster is proposed.
- Planning C remains blocked.

## Next rotation recommendation

Continue Full Pass 2 with `Data / Schema / Migrations` and paired `Data/Schema × Privacy × Storage × Lifecycle`, using techniques materially different from Full Pass 1. Challenge negative-space around multi-version reads/writes whose individually compatible projections are not jointly lossless; schema default/backfill semantics that manufacture canonical facts absent source evidence; constraints that become unsatisfiable only after privacy/retention/legal-hold composition; dual-write or CDC ordering where each sink is valid but no common cut/currentness exists; identity/key re-use across migration cohorts; online index/constraint changes crossing long-running writes; correction/supersession after downstream derived snapshots; restoration of deleted/held data through old schema/provider cohorts; and AI/low-code migration plans that are syntactically valid but alter semantic ownership, retention or authority. Duplicate-screen against the 111 reusable ConflictPatterns before cataloguing anything new.