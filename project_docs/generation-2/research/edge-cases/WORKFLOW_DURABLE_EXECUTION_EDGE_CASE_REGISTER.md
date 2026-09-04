# Generation 2 — Workflow & Durable Execution Adversarial Edge-Case Register

Status: FULL PASS 1 — MATERIAL FINDINGS / LOCAL STREAK 0 / CLUSTER STREAK 0
Capability: Workflow & Durable Execution
Paired cluster: Workflow × Integration × Messaging × external mutation
Phase: `RESEARCH_ADVERSARIAL_EDGE_CASE_SATURATION`

Research posture: catalogue/classify/proof obligations only. No target architecture, implementation task, Work Package or remediation is authorized here. `ConflictPattern != ConflictInstance`; `Signal != ConfirmedConflict`.

## Evidence anchors

- SB Planning A establishes revision-qualified durable execution ownership, explicit attempted→accepted→applied/effective→converged→validated lineage, `UNKNOWN → reconcile-before-retry`, distinct messaging/integration ownership, version coexistence and authority re-evaluation.
- SB Planning B confirms a deterministic provider-neutral state-machine baseline plus SQL-backed current state, but no durable history/attempt lineage/timers/retry/idempotency/compensation/version coexistence; current action-then-state persistence is split and can yield an applied domain effect followed by failed workflow-state persistence.
- AWS Step Functions documents typed retry/catch semantics and notes that redrive resets retry attempt counts for eligible states; successful prior steps are retained when redriven. This supports treating redrive as a new governed attempt lineage rather than proof that prior side effects did not occur.
- Apache Kafka documents that exactly-once guarantees rely on idempotent/transactional semantics inside the Kafka domain; Kafka Streams atomicity covers consumed offsets, state stores and Kafka outputs. This is not evidence that arbitrary external mutations participate in the same exactly-once boundary.
- Temporal documents durable resumption after crashes/network/infrastructure failures. This supports durability as a separate property from application-level external-effect idempotency/reconciliation.

Sources:
- https://docs.aws.amazon.com/step-functions/latest/dg/concepts-error-handling.html
- https://docs.aws.amazon.com/step-functions/latest/dg/redrive-executions.html
- https://kafka.apache.org/10/streams/core-concepts/
- https://kafka.apache.org/39/configuration/producer-configs/
- https://docs.temporal.io/

## Local material scenarios

### G2-EDGE-WORKFLOW-001 — duplicate/out-of-order signal advances an incompatible transition
- Preconditions / activation: a durable instance waits for a correlated signal/event; transport permits duplication, reordering or delayed delivery; correlation remains valid for more than one observation.
- Incompatible claims/actions/states: transport says “deliverable message”; workflow state may already have advanced or consumed an equivalent signal.
- Expected safe behavior: correlate against instance + signal semantic identity + admissible state/revision; duplicate/stale/out-of-order observations cannot silently create a second authoritative transition.
- Forbidden behavior: arrival order or provider message ID alone selects business truth; duplicate delivery causes duplicate transition/effect.
- Owner(s): Workflow durable state/correlation; Notifications/Messaging delivery evidence; Integration for external trigger mapping.
- Effect/failure disposition: known stale/duplicate → rejected/ignored with evidence; insufficient currentness → `INCONCLUSIVE`; ambiguous prior mutation remains `UNKNOWN`.
- Evidence/currentness: current workflow state/revision, correlation identity, consumed-signal evidence, message attempt/ordering evidence.
- Recovery/reconciliation: re-read durable state and correlation history; reconcile any dependent external effect before retry/redrive.
- Blast radius: workflow instance → process/external parties if duplicated effect escapes.
- Severity: CRITICAL. Misuse likelihood: plausible accidental, adversarial replay possible. Detectability: runtime/pre-execution.
- Reversibility: bounded only if downstream effects compensate; potentially irreversible externally. Time-to-harm: immediate.
- Proof obligation: `WORKFLOW-ADV-PROOF-001` — duplicate/reordered/delayed equivalent signals cannot create >1 authoritative semantic transition.

### G2-EDGE-WORKFLOW-002 — timer/cancellation/approval race produces mutually incompatible terminal claims
- Preconditions / activation: timer/escalation and human approval/cancellation become eligible near-simultaneously; each action is locally valid against stale pre-race state.
- Incompatible claims/actions/states: approve/complete vs cancel/timeout/escalate terminal or side-effecting branches.
- Expected safe behavior: exactly one compatible authoritative transition wins under current state/revision/authority evidence; losers become explicit rejected/stale observations, not parallel truth.
- Forbidden behavior: both branches commit terminal state or trigger effects because each independently validated before the race.
- Owner(s): Workflow transition semantics; Authorization for human action; temporal provider for firing evidence.
- Effect/failure disposition: winner `APPLIED` only after qualified state/effect evidence; loser rejected; split external effects may become `PARTIAL/UNKNOWN`.
- Evidence/currentness: transition base state/revision, timer firing identity, approval/cancellation authority/currentness and commit evidence.
- Recovery/reconciliation: compare authoritative workflow state with all triggered effects; reconcile/compensate only according to declared semantics.
- Blast radius: workflow instance/process; external downstream effects.
- Severity: CRITICAL. Misuse likelihood: likely under concurrency. Detectability: runtime.
- Reversibility: bounded compensation to potentially irreversible. Time-to-harm: immediate.
- Proof obligation: `WORKFLOW-ADV-PROOF-002` — mutually incompatible transitions cannot both become authoritative under concurrent eligibility.

### G2-EDGE-WORKFLOW-003 — activity effect succeeds but durable transition persistence fails
- Preconditions / activation: mutating activity/entity operation completes; subsequent workflow-state/history persistence fails or times out. Current SB Planning B evidences an action-then-state split for local SQL execution.
- Incompatible claims/actions/states: domain/external state may be changed while workflow durable state still claims pre-effect position.
- Expected safe behavior: effect disposition becomes `UNKNOWN` unless independent qualified evidence proves `APPLIED/NOT_APPLIED`; unsafe retry waits for reconciliation or target-qualified idempotency.
- Forbidden behavior: transport/database failure after the action is interpreted as `NOT_APPLIED`; retry blindly repeats mutation.
- Owner(s): Workflow attempt/effect lineage; Integration/Data target operation semantics; provider binding support facts.
- Effect/failure disposition: `UNKNOWN` by default for uncertain mutating effect; potentially `PARTIAL` if some required postconditions are known.
- Evidence/currentness: operation identity/idempotency scope, target receipts/reads, workflow attempt and durable-state write evidence.
- Recovery/reconciliation: query/reconcile target by canonical operation/effect identity before redrive; never infer from provider acknowledgement alone.
- Blast radius: record → workflow/process → external financial/physical effect.
- Severity: CRITICAL. Misuse likelihood: plausible operational failure. Detectability: runtime/post-effect.
- Reversibility: operation-specific; potentially irreversible. Time-to-harm: immediate/delayed.
- Proof obligation: `WORKFLOW-ADV-PROOF-003` — split failure cannot silently convert ambiguous mutation into retry-safe failure.

### G2-EDGE-WORKFLOW-004 — in-flight instance crosses executable/provider/schema/policy revision skew
- Preconditions / activation: long-running instance persists while executable workflow, worker code, provider binding, schema or authority policy changes.
- Incompatible claims/actions/states: current runtime interprets old durable position/inputs under new semantics without compatibility evidence.
- Expected safe behavior: preserve/pin producing revision or require explicit qualified migration/coexistence decision; current/latest must not be assumed compatible.
- Forbidden behavior: new worker/provider silently reinterprets old state, retries or human tasks according to current definitions.
- Owner(s): Workflow compatibility predicates; Lifecycle generic coexistence/migration; Provider/Binding; affected Data/Auth owners.
- Effect/failure disposition: incompatible known skew → reject/intervene; insufficient compatibility evidence → `INCONCLUSIVE`.
- Evidence/currentness: revision vector, residual-cohort inventory, provider support profile, schema/policy compatibility and outstanding effect/task state.
- Recovery/reconciliation: pin, migrate with evidence, complete on retained revision or explicitly disposition instance.
- Blast radius: cohort/process/system.
- Severity: CRITICAL. Misuse likelihood: likely during evolution. Detectability: pre-execution/runtime.
- Reversibility: migration required; potentially hard after external effects. Time-to-harm: latent/immediate at next step.
- Proof obligation: `WORKFLOW-ADV-PROOF-004` — no in-flight instance executes under a revision/provider interpretation lacking applicability/compatibility evidence.

### G2-EDGE-WORKFLOW-005 — human-task authority drifts while task remains open
- Preconditions / activation: task assigned/visible while Role/Station/person delegation changes before claim/approve/complete.
- Incompatible claims/actions/states: historical assignment/visibility remains true, current authority no longer permits protected action.
- Expected safe behavior: sensitive action re-authorizes against qualified current `Enterprise → Station → Role → Person` context; assignment does not confer authority.
- Forbidden behavior: stale task token/UI visibility/notification is treated as continuing permission; AI/AGWS suggests or executes around revoked authority.
- Owner(s): Workflow task lifecycle + Authorization/Identity; AGWS presentation only.
- Effect/failure disposition: stale/insufficient authority → deny or `INCONCLUSIVE`, never inherited allow.
- Evidence/currentness: task revision/state, current membership/delegation/policy evidence, actor/session assurance.
- Recovery/reconciliation: reassign/escalate through governed owner; preserve prior task history.
- Blast radius: protected business action/process/station.
- Severity: CRITICAL. Misuse likelihood: plausible accidental/adversarial. Detectability: pre-execution.
- Reversibility: operation-specific. Time-to-harm: immediate.
- Proof obligation: `WORKFLOW-ADV-PROOF-005` — open human tasks cannot preserve revoked or moved authority across scope changes.

### G2-EDGE-WORKFLOW-006 — valid fan-out/retry composition exhausts queue/provider/cost capacity
- Preconditions / activation: high-cardinality Map/fan-out or automation loop combines with retries/backoff and slow downstream provider/consumer.
- Incompatible claims/actions/states: every branch is locally valid, but aggregate work exceeds queue, provider quota, worker capacity or economic guardrails.
- Expected safe behavior: bounded concurrency/retry/resource evidence must prevent silent overload from being interpreted as progress; backlog degradation remains explicit.
- Forbidden behavior: unbounded fan-out/retry amplification, fallback that bypasses authority/idempotency, or success based only on enqueue acknowledgement.
- Owner(s): Workflow execution policy; Provider/Binding support/capacity; Deployment runtime capacity; FinOps economic evidence.
- Effect/failure disposition: `PARTIAL`/degraded where only subset completes; `INCONCLUSIVE` if backlog/currentness prevents convergence claim.
- Evidence/currentness: queue depth/age, per-provider quotas, concurrency budget, retry lineage, completion/effect evidence and cost projection.
- Recovery/reconciliation: throttle, pause/redrive eligible work after effect reconciliation; drain residual messages/attempts before provider substitution.
- Blast radius: system/provider/external parties; economic spillover.
- Severity: HIGH. Misuse likelihood: likely accidental via low-code/AI composition. Detectability: pre-execution/runtime.
- Reversibility: operationally bounded but may leave external partial effects. Time-to-harm: cumulative/immediate under surge.
- Proof obligation: `WORKFLOW-ADV-PROOF-006` — valid composition cannot create unbounded work amplification without an explicit bounded/degraded disposition.

## Cross-capability material scenarios — Workflow × Integration × Messaging × external mutation

### G2-XEDGE-WORKFLOW-INTEGRATION-MSG-001 — provider acknowledgement is mistaken for effective business state
- Activation: connector/message provider acknowledges request/publication while downstream mutation is asynchronous/eventually consistent or later rejected.
- Incompatible claims: integration provider says accepted; workflow assumes business postcondition true.
- Safe behavior: acceptance remains separate from `APPLIED/effective/converged/validated`; wait/reconcile on owner-qualified evidence.
- Forbidden: advance irreversible/terminal workflow state solely on HTTP/queue/provider acknowledgement.
- Owners: Integration + Workflow + target semantic owner + Messaging evidence.
- Disposition: accepted/unknown until postcondition evidence; `PARTIAL/UNKNOWN` where ambiguous.
- Evidence/currentness: canonical operation identity, provider receipt, downstream target read/event, workflow revision/state.
- Recovery: reconcile target then continue/redrive/compensate as allowed.
- Blast radius: workflow/process/external parties. Severity: CRITICAL. Misuse: likely. False-positive risk: medium where contract explicitly guarantees synchronous application.
- Proof: `XWORKFLOW-ADV-PROOF-001`.

### G2-XEDGE-WORKFLOW-INTEGRATION-MSG-002 — idempotency scope mismatch duplicates external mutation
- Activation: workflow reuses an idempotency key across an operation/provider horizon or scope that differs from the connector/target contract, or provider substitution changes semantics.
- Incompatible claims: workflow thinks retry is deduplicated; target treats retry as a new mutation.
- Safe behavior: retry eligibility is qualified against exact operation, target, key scope, revision and dedup horizon; otherwise reconcile first.
- Forbidden: infer portable idempotency from matching feature names or provider-native IDs.
- Owners: Integration target semantics + Provider/Binding support + Workflow retry policy.
- Disposition: `UNKNOWN` until reconciled when scope/horizon uncertain.
- Evidence/currentness: idempotency contract revision, key/effect identity, provider support/currentness, prior attempt evidence.
- Recovery: target reconciliation; new attempt only when safe lineage established.
- Blast radius: external record/payment/order/resource. Severity: CRITICAL. Misuse: plausible/likely. False-positive risk: low with explicit contract qualification.
- Proof: `XWORKFLOW-ADV-PROOF-002`.

### G2-XEDGE-WORKFLOW-INTEGRATION-MSG-003 — compensation races with delayed original/retry message
- Activation: workflow enters compensation/cancellation while old delivery/retry remains in transit or residual subscription/queue still active.
- Incompatible claims: compensation reverses effect while delayed original later reapplies it; both branches individually follow local semantics.
- Safe behavior: residual attempt/message inventory is part of compensation/closure evidence; stale deliveries are fenced/rejected or reconciled before final convergence claim.
- Forbidden: declare compensation complete while authoritative old deliveries can still mutate target state.
- Owners: Workflow compensation + Messaging delivery/replay + Integration operation semantics + Lifecycle/provider drainage.
- Disposition: `PARTIAL/UNKNOWN` until residual cohorts drained/reconciled.
- Evidence/currentness: message/subscription generations, attempt/effect lineage, compensation target state, provider drainage evidence.
- Recovery: reconcile/fence residual attempts; validate postcondition after drainage.
- Blast radius: process/external system. Severity: CRITICAL. Misuse: plausible. False-positive risk: medium for transports with proven cancellation/fencing semantics.
- Proof: `XWORKFLOW-ADV-PROOF-003`.

### G2-XEDGE-WORKFLOW-INTEGRATION-MSG-004 — provider substitution leaves residual old subscriptions/messages authoritative
- Activation: connector/message provider is replaced while workflow instances and queued/subscribed work remain in flight.
- Incompatible claims: new provider handles current work while old provider continues delivering semantically authoritative events/effects.
- Safe behavior: canonical workflow/effect identity survives provider change; cutover remains incomplete until residual cohorts are inventoried, fenced/drained or explicitly dispositioned.
- Forbidden: provider switch timestamp alone establishes convergence; external/provider IDs become canonical dedup keys.
- Owners: Provider/Binding + Integration + Messaging + Workflow cohort semantics + Lifecycle.
- Disposition: `PARTIAL/INCONCLUSIVE` while residual authority/currentness unresolved.
- Evidence/currentness: provider generation/binding, subscription/queue inventory, active workflow cohort, dedup/reconciliation evidence.
- Recovery: coexistence/drain/fence, then qualified cutover validation.
- Blast radius: system/process/external parties. Severity: HIGH–CRITICAL. Misuse: likely during migration. False-positive risk: low if residual inventory is complete.
- Proof: `XWORKFLOW-ADV-PROOF-004`.

## Reusable processual / semantic conflict patterns

### G2-CONFLICT-PATTERN-TEMPORAL-001 — locally valid transitions become jointly contradictory under race/order skew
- Family: temporal + state-transition + cross-process.
- Narrative: approval, cancellation, timeout, escalation or delayed message are each valid against their observed precondition, but composition permits incompatible states/effects.
- Activation conditions: concurrent eligibility, stale reads, non-total transport ordering or delayed delivery.
- Incompatible claims/actions/states: mutually exclusive terminal/postcondition claims.
- Why local validation misses it: each transition validates against a local snapshot; conflict appears only across commit/order boundary.
- Detection candidates: transition conflict graph, compare-and-commit state/currentness, late-event classification, concurrent mutation signal.
- Owners: Workflow + affected domain owner; Messaging/Integration as realization evidence owners.
- Severity: HIGH–CRITICAL; confidence: strongly supported; detectability: static candidate + runtime; blast radius: instance→process/external; reversibility: bounded to potentially irreversible; time-to-harm: immediate; misuse likelihood: likely accidental.
- Evidence currentness: current authoritative state/revision + event/attempt chronology; false-positive risk: medium because some domains intentionally permit commutative transitions.
- Future remediation disposition: `CATALOGUE + CLASSIFY + DETECTION_CANDIDATE + FUTURE_REMEDIATION_ROUTE`; when observed, serialize/re-evaluate/reconcile according to semantic owner.
- Proof candidate: `WORKFLOW-CONFLICT-PROOF-001`.

### G2-CONFLICT-PATTERN-PROVIDER-001 — retry/idempotency semantics are composition-incompatible across owners/providers
- Family: provider + integration + state.
- Narrative: workflow retry policy and connector/provider idempotency contract are each valid independently but differ in key scope, lifetime, operation identity or substitution generation.
- Activation: retry/redrive after timeout/failure, provider upgrade/substitution, dedup horizon expiry.
- Incompatible claims: workflow says duplicate-safe; provider says new mutation eligible.
- Detection candidates: semantic support-vector comparison, idempotency scope/horizon compatibility check, provider differential conformance corpus.
- Owners: Integration semantic owner + Provider/Binding + Workflow retry owner.
- Severity: CRITICAL; confidence: strongly supported; detectability: pre-execution/runtime; blast radius: external parties/system; reversibility: potentially irreversible; time-to-harm: immediate; misuse likelihood: plausible/likely.
- Evidence currentness: operation/idempotency contract revision and provider qualification; false-positive risk: low when target contract is explicit.
- Future remediation: default catalogue/classify; observed mismatch routes to reconcile-before-retry, provider isolation or qualified operation-specific guard.
- Proof candidate: `WORKFLOW-CONFLICT-PROOF-002`.

### G2-CONFLICT-PATTERN-RECOVERY-001 — compensation/recovery conflicts with residual authoritative work
- Family: exception/compensation/recovery + version/provider.
- Narrative: compensation/recovery is individually valid, yet delayed original attempts, retries, messages, old workers or old providers remain capable of reapplying the superseded effect.
- Activation: cancellation/compensation, redrive, provider migration or recovery while residual cohorts remain live.
- Incompatible claims: recovery claims restored/converged state while residual path can mutate it again.
- Detection candidates: residual-cohort inventory, in-flight attempt/message/subscription generation check, post-recovery convergence observation.
- Owners: Workflow recovery + Integration/Messaging + Lifecycle/Provider Binding.
- Severity: CRITICAL; confidence: strongly supported; detectability: pre-execution/runtime/post-effect; blast radius: process/system/external; reversibility: migration/compensation required; time-to-harm: delayed; misuse likelihood: plausible.
- Evidence currentness: current residual-cohort/drainage evidence; false-positive risk: medium if provider offers proven fencing semantics.
- Future remediation: catalogue/classify; observed case routes to fence/drain/reconcile then validate recovery, never “rollback succeeded” by artifact/state alone.
- Proof candidate: `WORKFLOW-CONFLICT-PROOF-003`.

### G2-CONFLICT-PATTERN-AUTHORITY-001 — durable assignment conflicts with current authority/responsibility
- Family: authority/responsibility/separation-of-duty + human-procedure.
- Narrative: a task was correctly assigned under an earlier Role/Station/policy state, but later organizational change makes its completion unauthorized or assigns responsibility elsewhere.
- Activation: long-running human task spans membership/delegation/policy/Station revision.
- Incompatible claims: workflow task assignment says actor/candidate; current authorization/organization says actor cannot perform protected transition.
- Detection candidates: commit-time authority re-evaluation, stale assignment/currentness signal, responsibility/SoD analysis.
- Owners: Authorization/Organization authoritative policy + Workflow task lifecycle; AGWS remains presentation only.
- Severity: HIGH–CRITICAL; confidence: strongly supported; detectability: pre-execution; blast radius: task/process/station; reversibility: operation-specific; time-to-harm: immediate; misuse likelihood: accidental/adversarial plausible.
- Evidence currentness: current identity/membership/delegation/policy and task revision; false-positive risk: medium where policy explicitly grants grandfathered authority.
- Future remediation: catalogue/classify; observed case routes to deny/reassign/escalate or documented authorized exception; never let stale UI/task token grant authority.
- Proof candidate: `WORKFLOW-CONFLICT-PROOF-004`.

## Saturation impact

This is the first eligible adversarial visit for Workflow & Durable Execution and cluster `Workflow × Integration × Messaging × external mutation` in Full Pass 1. Material findings were discovered, so both no-material streaks are reset/remain `0`.

No HIGH/CRITICAL scenario is left without an owner set and proof obligation. No conflict pattern is asserted as a current defect or ConflictInstance.
