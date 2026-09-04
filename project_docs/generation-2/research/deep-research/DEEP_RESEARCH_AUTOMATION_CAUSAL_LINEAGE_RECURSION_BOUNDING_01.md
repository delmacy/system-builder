# Deep Research — Automation Causal Lineage & Recursion Bounding 01

Status: COMPLETE — RESEARCH RECOMMENDATION / NOT TARGET-ARCHITECTURE AUTHORITY
Phase: `RESEARCH_ADVERSARIAL_EDGE_CASE_SATURATION`

## Question

When event-driven automations legitimately contain cycles, retries, callbacks, reconciliation loops, delayed/offline delivery and provider substitution, what portable evidence is sufficient to distinguish an intentional bounded business cycle from an unsafe self-amplifying causal loop — especially when every hop is locally valid and providers regenerate message/delivery identifiers?

The residual architectural question is narrower than “are cycles dangerous?” The corpus already says they can be. The unresolved question is whether G2 can detect or qualify **causal recurrence across transport/provider identity discontinuities** without requiring all enterprise processes to be DAGs or inventing one universal global workflow theorem prover.

## Why this is architecturally material

`G2-CONFLICT-PATTERN-AUTOMATION-COMPOSITION-001` already establishes that individually safe integrations can compose into recursive or authority-amplifying behavior. `G2-EDGE-MESSAGING-007` similarly identifies recursive fan-out and backlog release. But graph-shape analysis alone is insufficient in distributed event systems:

- a legitimate reconciliation loop may contain a graph cycle but converge because state changes stop re-emission;
- an unsafe loop may traverse external systems and return through a different webhook/provider with completely new transport identifiers;
- delayed or replayed events may re-enter after the original runtime trace/context has expired;
- provider migration may cause old and new subscriptions to duplicate the same causal stimulus;
- “exactly once” delivery within one broker scope does not prove one business occurrence, one downstream publish, or one end-to-end causal chain;
- W3C/OpenTelemetry trace context is observational correlation and can be absent, rewritten or intentionally not propagated; it is not business-effect identity or authority.

If G2 keys recursion safety to provider message IDs or trace IDs, provider substitution and multi-system callbacks can bypass it. If G2 rejects every directed cycle, it breaks valid polling, retry, reconciliation, control and human/business loops. The architecture therefore needs a precise boundary between **transport correlation**, **canonical causal/effect lineage**, **boundedness/progress policy**, and **current authority/effect qualification**.

## SB corpus consumed

- `RESEARCH_PIPELINE_STATE.json` — authoritative phase remains adversarial saturation; Full Pass 1 is active; current breadth is moving through Notifications / Events / Messaging.
- `POST_MATH_ADVERSARIAL_EDGE_CASE_SATURATION_RESEARCH.md` — requires recursive/cyclic definitions, unbounded retries, fan-out explosions, provider divergence, ambiguity and AI/low-code misuse to be challenged.
- `edge-cases/PROCESSUAL_SEMANTIC_CONFLICT_CLASSIFICATION.md` — classifies structural graph, temporal/ordering, resource/capacity, cross-process and AI/low-code composition conflicts; preserves `ConflictPattern != ConflictInstance` and `Signal != ConfirmedConflict`.
- `edge-cases/INTEGRATION_AUTOMATION_EDGE_CASE_REGISTER.md` — `G2-EDGE-INTEGRATION-007` and `G2-CONFLICT-PATTERN-AUTOMATION-COMPOSITION-001` are the immediate input hypotheses.
- `edge-cases/NOTIFICATIONS_EVENTS_MESSAGING_EDGE_CASE_REGISTER.md` — distinguishes canonical event/message identity from provider delivery identity and identifies fan-out/recursive composition, replay, ordering and residual-provider cohorts.
- `deep-research/DEEP_RESEARCH_LOW_CODE_COMPOSITION_AUTHORITY_SEMANTIC_EFFECT_01.md` — already falsifies node-validity → graph-validity and rejects a universal semantic theorem prover.
- Prior effect/transaction deep research remains input, especially `DEEP_RESEARCH_TRANSACTION_COMMIT_EFFECT_01.md` and `DEEP_RESEARCH_COMPOSITE_SAGA_EFFECT_CLOSURE_01.md`, which separate attempt, acknowledgement and semantic effect.

Breadth registers and prior deep researches are hypotheses/conciliation inputs, not independent external proof.

## External evidence ledger

### E1 — AWS EventBridge: valid rules can form infinite event loops

Source: Amazon EventBridge, “Best practices for event patterns” and troubleshooting documentation, accessed 2026-09-04.

AWS explicitly documents that a rule can trigger an action that changes state in a way that fires the rule again, producing an infinite loop and potentially large cost. Its practical recommendation is to make event patterns precise enough that the triggered action does not rematch unintentionally.

Architectural extraction: production event systems do not make local rule validity imply global termination. Loop safety depends on the relation between trigger predicate and resulting effect, not merely on whether each event and target invocation is valid.

Limit: EventBridge pattern filtering is one provider mechanism; it is not a portable proof of boundedness.

### E2 — CloudEvents: event `id` is source-scoped uniqueness, not causal lineage

Source: CNCF CloudEvents Primer / specification repository, accessed 2026-09-04.

CloudEvents describes `id` as unique within an event source and explicitly warns against assigning other semantics to it. A single occurrence may legitimately produce multiple distinct CloudEvents, each with its own `id`; correlation between them requires additional information. When semantic processing turns an incoming event into a new event, the processor may become a distinct event source and change `source` and `id`.

Architectural extraction: provider/event IDs cannot portably identify a business causal root or detect re-entry of the same effect lineage. `EventIdentity != CausalLineageIdentity`.

### E3 — W3C Trace Context: trace identity is distributed tracing context, not business authorization/effect identity

Source: W3C Recommendation, Trace Context, 2021-11-23.

`trace-id` identifies a distributed trace and `parent-id` the immediate parent in tracing propagation. Invalid context must be ignored, and the specification is intentionally about interoperable tracing propagation rather than business-effect uniqueness, authorization, retry eligibility or semantic postconditions.

Architectural extraction: trace context is useful causal evidence when present and trustworthy, but cannot be made canonical business lineage or a required correctness dependency for autonomous/provider-neutral runtime.

### E4 — OpenTelemetry messaging semantics: producer→consumer correlation requires propagated creation context and may not exist

Source: OpenTelemetry Semantic Conventions for messaging spans, accessed 2026-09-04.

OpenTelemetry states that messaging systems may trace transport without correlating producers to consumers; direct producer-consumer correlation requires another message creation context propagated through the message. It also distinguishes `messaging.message.id` from `messaging.message.conversation_id` and leaves exact propagation mechanisms to transports/bindings.

Architectural extraction: observability correlation is valuable evidence but incomplete by construction. Missing trace/conversation propagation cannot be interpreted as a new causal root.

### E5 — Google Cloud Pub/Sub: duplicates can have different message IDs

Source: Google Cloud Pub/Sub exactly-once delivery documentation, current documentation accessed 2026-09-04.

Pub/Sub documents that publish-side duplicates may occur even with exactly-once delivery enabled, and distinct publish retries can yield duplicate logical publications with **different message IDs**. Exactly-once delivery is also scoped to supported pull subscriptions/regions and does not cover arbitrary downstream business effects.

Architectural extraction: message-ID-based loop suppression can fail precisely when a publisher repeats the same semantic stimulus through a new publish. Delivery uniqueness and causal/effect uniqueness are distinct.

### E6 — Google Cloud Pub/Sub reliability: delayed duplicates and failover can cross long time horizons

Source: Google Cloud Pub/Sub reliability guidance, accessed 2026-09-04.

Reliability guidance notes that duplicate processing must be tolerated and that duplicates can arrive substantially later under regional redundancy/failure scenarios. Ordering and exactly-once guarantees are scoped.

Architectural extraction: recursion/boundedness analysis needs explicit horizon/currentness semantics. “No recurrence recently” does not prove the causal chain is closed when durable backlog or residual provider cohorts remain eligible.

### E7 — Workflow-net soundness literature: cycles are not equivalent to unsound workflows

Source: van der Aalst et al., “Soundness of workflow nets: classification, decidability, and analysis,” Formal Aspects of Computing 23(3), 2011.

Workflow-net soundness concerns termination options, proper completion, liveness/dead tasks and related anomalies. The formal problem is **sound behavior**, not prohibition of every structural cycle. Petri-net analysis provides boundedness/liveness tools for classes where such modeling is feasible.

Architectural extraction: static graph analysis and model checking are valuable detection/proof candidates, but “cycle exists” is only a signal. Legitimate iterative processes must remain expressible.

## Competing models

### Model A — Reject every directed cycle

Any automation/process graph cycle is invalid.

**Falsified / over-restrictive.** Reconciliation, bounded polling, retry, human review, control loops and many workflow patterns are intentionally cyclic. Formal workflow analysis reasons about liveness/boundedness/soundness rather than universally banning cycles.

Disposition: `DO_NOT_BUILD` as a universal rule.

### Model B — Provider message/delivery ID deduplication is sufficient

Store recently seen event IDs and stop duplicates.

**Falsified.** CloudEvents IDs are source-scoped and may change after semantic processing; Pub/Sub can produce duplicate logical publications with different IDs. Provider substitution and multi-system callbacks create identity discontinuities.

Disposition: `PROVIDERIZE` transport deduplication as a useful local mechanism; `DO_NOT_GENERALIZE` into business causal closure.

### Model C — Trace/correlation ID is the canonical causal root

Propagate W3C/OpenTelemetry trace context and treat repeated trace IDs as loops.

**Insufficient and unsafe as canonical semantics.** Trace context can be absent, sampled, reset, rewritten, intentionally not propagated, or span multiple legitimate repeated business acts. It is observability evidence, not authorization/effect identity.

Disposition: `KEEP_AS_EVIDENCE`, not canonical truth.

### Model D — Global universal event DAG + total causal history

Require every event/effect in every provider to join one immutable global causal DAG; reject anything that cannot.

**Overreaches.** It would make runtime correctness depend on universal propagation across brownfield providers and offline Stations, leak operational topology into canonical semantics, and impose unbounded history/storage. It also does not by itself decide whether a repeated cycle is legitimate.

Disposition: `DO_NOT_BUILD`.

### Model E — Qualified causal/effect ancestry + owner-declared boundedness/progress + current actuation/effect checks

Preserve enough canonical ancestry to relate a consequential automation-triggered invocation/effect to the intent/effect that caused it, while allowing bounded summaries/links and provider evidence. Then evaluate owner-declared termination/progress/resource/authority constraints against that lineage. If ancestry required for safety is missing or stale, do not claim loop safety; classify the result `INCONCLUSIVE/UNKNOWN` or route it for owner-qualified handling. Re-authorize consequential actuation under current authority regardless of lineage.

**Best-supported model.** It does not require all processes to be DAGs or one global trace. It gives static analysis, runtime loop detection, quota/cost controls and effect reconciliation a portable semantic subject without making any provider ID canonical.

Disposition: `KEEP + GENERALIZE + SPECIALIZE + PROVIDERIZE + DEFER`.

## Strongest evidence for

1. EventBridge demonstrates real self-trigger feedback loops despite each rule/target being individually valid.
2. CloudEvents explicitly separates event source-scoped ID from correlation and allows semantic processors to emit new source/ID identities.
3. Pub/Sub demonstrates the failure of “different message ID means different semantic stimulus.”
4. OpenTelemetry demonstrates that transport/message IDs, conversation IDs and propagated creation/trace context are different evidence kinds and propagation can be incomplete.
5. Workflow-net literature supports reasoning about boundedness/liveness rather than globally banning cycles.
6. Existing G2 effect-closure work already requires semantic effect lineage distinct from transport ACK/attempt identity; causal recurrence is a natural specialization of that lineage rather than a new capability.

## Strongest evidence against overgeneralization

1. Not every event-driven cycle is a defect; some are the intended control structure.
2. A finite hop count is not universally correct: long-running approval/reconciliation loops may legitimately exceed arbitrary depth.
3. A cost/rate budget is policy-specific and cannot define semantic termination for every domain.
4. Trace context is optional operational evidence and cannot be a hard universal dependency.
5. Some external/brownfield systems will not propagate SB lineage metadata; G2 needs reconciliation/qualification paths rather than pretending full ancestry always exists.
6. Privacy/governance may constrain how much lineage metadata may be propagated externally; portable semantics should permit references/digests or locally retained mapping rather than mandatory full-chain disclosure.

## Reconciled distinctions / invariants

Preserve:

`EventIdentity != DeliveryIdentity != TraceIdentity != ConversationIdentity != CanonicalCausalLineage`

`GraphCycleSignal != ActivatedRecursiveConflict`

`RepeatedDelivery != RepeatedSemanticStimulus != RepeatedBusinessEffect`

`BoundedTransportRetries != BoundedBusinessRecursion`

`CausalRelatedness != Authorization`

`CausalLineageAvailable != EffectQualified`

`NoObservedLoop != ProvenClosure`

### Preventive invariant candidate — narrow and universal enough

> A consequential automation MUST NOT claim recursion safety, unique causal root, or closed effect lineage solely from provider delivery/message IDs, trace IDs, recent non-observation, or local node validity. When an owner-declared safety property depends on causal recurrence, the system must retain or reconstruct sufficiently qualified causal/effect ancestry to evaluate that property; missing material ancestry remains `INCONCLUSIVE/UNKNOWN`, not “new independent root”.

This does **not** require every process to be acyclic, every message to carry a global root ID, or every cycle to be rejected.

A second already-established invariant remains independent:

> Every privileged/canonical actuation is authorized under current non-amplifying authority; inherited causal lineage does not grant authority by itself.

## New reusable conflict pattern

### G2-CONFLICT-PATTERN-AUTOMATION-CAUSALITY-001 — causal-lineage discontinuity hides recursive amplification

- **Family:** structural graph + temporal/ordering + provider/integration + resource/capacity + cross-process + AI/low-code.
- **Narrative:** automation A causes an external mutation; provider/system B emits a new event with a fresh transport/event/trace identity; that event re-enters automation A or a semantically equivalent upstream path. Every delivery and action is locally valid, but a loop detector/deduplicator keyed to local IDs treats each recurrence as a new root and permits unbounded effects.
- **Activation conditions:** event-driven callback/re-entry or provider-to-provider chain; semantic processing regenerates source/ID or loses tracing context; loop/resource safety depends on causal recurrence; no sufficiently qualified mapping relates the new event/effect to prior causal ancestry.
- **Incompatible claims/actions/states:** transport/provider says “new valid event/message”; local automation says “new admissible invocation”; process/resource/authority owner requires “this act belongs to an existing causal chain whose recurrence/budget/progress must be evaluated.”
- **Why local validation may miss it:** each provider validates its own event identity, subscription and action. Cross-system ancestry is outside each local contract, and regenerated IDs make simple duplicate detectors pass.
- **Falsification path:** construct a two-provider loop where every hop emits a fresh event ID and valid signature. If boundedness/recursion safety still holds without any causal/effect relation or state-progress condition beyond local IDs, the pattern is weakened. Conversely, reproduce continued actuation under fresh IDs while semantic state oscillates or remains unchanged and the pattern is confirmed for that system/revision.
- **Detection stages/candidates:** design-time graph SCC/cycle and trigger-effect dependency analysis; publish-time declared progress/termination/resource-budget qualification; runtime causal/effect ancestry correlation across provider ID changes; recurrence density/state-progress/quota/cost signals; post-effect/audit reconstruction where lineage is incomplete. A detector signal is not a confirmed conflict.
- **Owner set:** Integration & Automation for invocation/trigger realization; Notifications/Events/Messaging for communication lineage evidence; Workflow/Process semantic owner for intended cyclic semantics/progress; domain owner for effect identity/postcondition; Authorization for actuation authority; Provider/Binding for provider support; Observability/FinOps for operational/cost evidence.
- **Severity:** HIGH–CRITICAL; CRITICAL where destructive, financial, disclosure, security or high-cost effects recurse.
- **Confidence:** strongly supported.
- **Detectability:** static + pre-execution + runtime + audit depending on topology; may be audit-only for opaque brownfield hops.
- **Blast radius:** workflow/process → system/enterprise → external parties/provider account.
- **Reversibility:** easy for purely internal advisory loops; bounded compensation to potentially irreversible for external/financial/disclosure effects.
- **Time to harm:** immediate or cumulative.
- **Misuse likelihood:** accidental/plausible; adversarial when attacker can induce callbacks/fan-out.
- **Evidence currentness:** graph/subscription/provider-binding/authority/resource constraints and residual-cohort state must be current enough for the claimed safety horizon.
- **False-positive risks:** intentional bounded polling/reconciliation/control loops; repeated legitimate independent occurrences; long-duration workflows with sparse progress; trace sampling/context loss without actual recurrence. Detectors must use owner-declared semantic recurrence/progress/effect relations, not topology or rate alone.
- **Future remediation route:** `CATALOGUE + CLASSIFY + DETECTION_CANDIDATE + FUTURE_REMEDIATION_ROUTE`; when activated, route to the relevant semantic/process owner for boundedness/progress/authority/effect reconciliation. Quarantine/rate-limit/reject are possible future dispositions only after qualified activation, not automatic research-time fixes.
- **Preventive invariant candidate:** only the narrow “do not claim loop safety/new root from provider IDs or missing lineage when safety depends on causal recurrence” rule above.

## Failure / adversarial analysis

### F1 — Fresh-ID ping-pong across providers
A writes B; B emits event with new ID; event invokes A again. Each provider sees unique valid work.

### F2 — Same causal stimulus produces multiple event types
One domain occurrence emits `created` and `updated` events, each distinct. Two automations independently react and create converging or conflicting effects. Event-ID uniqueness does not imply causal independence.

### F3 — Delayed duplicate re-enters after dedup cache expires
The automation appears stable, then a delayed provider duplicate or offline backlog event restarts the same causal chain beyond the local dedup horizon.

### F4 — Provider cutover duplicates causal entry
Old and new subscriptions both deliver semantically equivalent callbacks with unrelated provider IDs. Residual-cohort coexistence doubles recurrence pressure.

### F5 — Legitimate reconciliation loop is falsely rejected
A periodic reconciler intentionally rechecks until state converges. Static SCC detection flags a cycle, but every iteration observes monotonic progress or exits when the owner-defined fixed point is reached.

### F6 — Oscillation without growth
Two rules alternately set state A/B. Fan-out is one each time, so rate may appear bounded, yet there is no progress/termination and effects/cost continue indefinitely.

### F7 — Bounded hop count causes unsafe truncation
A legitimate human escalation loop crosses many revisions. Arbitrary depth cap stops required work despite no amplification. Hop count is a policy profile, not universal semantics.

### F8 — Trace reset hides recurrence
A provider strips trace context or a new process starts a new trace. Operational traces show independent roots even though semantic effect ancestry is recursive.

### F9 — Trace preservation falsely conflates independent acts
A batch/conversation keeps one trace/conversation context while multiple independent authorized business effects occur. Treating trace ID as effect identity incorrectly deduplicates legitimate work.

### F10 — AI composes a “self-healing” rule that self-triggers
Each action is authorized and syntactically valid. Generated correction emits the same class of event that triggers correction, causing an EventBridge-like loop. AI proposal authority does not validate boundedness.

### F11 — Offline Station returns accumulated callbacks
Station reconnects and publishes backlog whose original causal roots overlap with central provider activity completed during disconnection. Fresh provider IDs obscure duplicate causal chains.

### F12 — Ambiguous external effect branches recursion
An upstream mutation is `UNKNOWN`; a callback later arrives and triggers a downstream action while recovery logic also retries the upstream action. Causal/effect closure and reconcile-before-retry must remain linked.

## Provider-specific versus portable semantics

### Portable semantics G2 should own/preserve

- canonical semantic intent/effect identity remains domain-owned;
- typed causal/effect relation sufficient to say “this invocation/effect was caused/derived/replayed/compensated from that canonical lineage” where evidence supports it;
- explicit uncertainty when ancestry is incomplete;
- graph/revision/provider-binding scope of the qualification;
- owner-declared boundedness/progress/termination/resource constraints rather than universal constants;
- current authority re-evaluation for consequential actuation;
- effect disposition and `UNKNOWN → reconcile-before-retry`;
- residual provider/subscription cohort identity and currentness.

Research does **not** prove the need for one globally materialized `CausalGraph` object. A bounded relation/envelope or reconstructable evidence closure may suffice; exact target representation is deferred.

### Providerized mechanics

- CloudEvents/provider event IDs;
- W3C/OpenTelemetry trace/context propagation;
- broker message IDs, ordering keys, dedup windows and exactly-once delivery features;
- EventBridge/Event Grid/filter rules;
- provider retry/DLQ/redrive mechanisms;
- graph SCC/model-checking engines;
- rate limits, concurrency caps and quota/budget alarms;
- distributed tracing stores and correlation indexes.

Provider mechanics may strengthen detection/evidence but cannot define canonical causal/effect identity or actuation authority.

## Consequences for existing findings/candidates/hypotheses

1. **KEEP + DEEPEN** `G2-CONFLICT-PATTERN-AUTOMATION-COMPOSITION-001`; it remains the broad composition/recursion class.
2. **ADD/SPECIALIZE** `G2-CONFLICT-PATTERN-AUTOMATION-CAUSALITY-001` for the narrower failure where cross-provider identity discontinuity hides recurrence from otherwise valid local controls.
3. **MERGE conceptually** with `G2-CONFLICT-PATTERN-INTEGRATION-IDENTITY-001`: delivery/request/effect identity separation is a prerequisite, while the new pattern adds causal ancestry and boundedness consequences.
4. **KEEP** `G2-CONFLICT-PATTERN-ORDERING-SCOPE-001`: causal ancestry does not imply global total order.
5. **KEEP** low-code `PrimitiveValid != CompositionAdmissible`; this research adds a concrete runtime/durable evidence requirement for recurrence-sensitive compositions.
6. **GENERALIZE** qualified evidence/currentness to causal-lineage claims: missing or stale lineage cannot be upgraded to “independent root.”
7. **KEEP** `UNKNOWN → reconcile-before-retry`, especially where ambiguous upstream effects and callbacks can create forked causal chains.
8. **PROVIDERIZE** trace/message IDs, event filters, graph analyzers and quota mechanisms.
9. **DO_NOT_BUILD** universal DAG-only workflows, canonical trace ID, provider-ID business deduplication or global infinite causal history.
10. **DEFER** exact target-architecture shape/name (`CausalLineage`, `EffectAncestry`, relation envelope, etc.) until Planning C reconciles with existing qualified evidence/effect-closure primitives.

No 29th canonical capability is recommended.

## Proof obligations

### DR-ACLRB-01 — fresh provider IDs do not hide two-system recursion
Construct A→provider B→event→A where every recurrence has a fresh provider/event ID. Prove the system does not claim each recurrence is an independent root when the declared safety property depends on ancestry.

### DR-ACLRB-02 — legitimate bounded cycle remains admissible
Model a reconciliation loop with owner-declared convergence/progress. Prove cycle detection alone does not reject it and completion is established by semantic progress/postcondition, not arbitrary graph acyclicity.

### DR-ACLRB-03 — oscillating non-progress cycle is detectable
Create A↔B state oscillation with bounded one-for-one fan-out. Prove a recurrence/progress detector can signal risk even without exponential growth.

### DR-ACLRB-04 — delayed duplicate beyond provider dedup horizon
Inject a semantically duplicate event after the provider/local dedup horizon with a new message ID. Prove safe handling depends on qualified semantic/effect ancestry/idempotency evidence rather than recent-ID cache alone.

### DR-ACLRB-05 — trace-context loss is not a new-root proof
Strip/reset W3C/OpenTelemetry context at one hop. Prove missing tracing data is represented as incomplete lineage evidence, not evidence of causal independence.

### DR-ACLRB-06 — shared trace does not collapse distinct business effects
Place multiple legitimate independent effects in one trace/conversation. Prove trace equality alone does not deduplicate canonical effect identity.

### DR-ACLRB-07 — provider cutover residual cohorts
Run old and new subscriptions concurrently with different provider IDs for semantically equivalent callbacks. Prove recurrence and duplication analysis includes residual-cohort evidence.

### DR-ACLRB-08 — ambiguous upstream effect + callback + retry
Force upstream mutation to `UNKNOWN`, deliver a callback, and attempt recovery retry. Prove callback ancestry/effect evidence participates in reconcile-before-retry and duplicate external actuation is not silently authorized.

### DR-ACLRB-09 — offline Station backlog
Disconnect a Station, generate overlapping central effects, then replay Station backlog with new provider IDs. Prove autonomy is preserved while lineage gaps become explicit and conflicting actuation is reconciled rather than assumed independent.

### DR-ACLRB-10 — authority remains independent from causal ancestry
Replay a perfectly reconstructed causal chain after Role/Station authority is revoked. Prove valid lineage cannot authorize current privileged actuation.

### DR-ACLRB-11 — AI/low-code self-healing loop
Have AI compose individually valid trigger/action nodes that re-trigger themselves. Prove local node validity and AI proposal status do not establish boundedness/admissibility.

### DR-ACLRB-12 — resource/cost boundedness profile is owner-qualified
Use two legitimate cycles with different expected iteration/rate/cost envelopes. Prove one universal hop/rate threshold is not required; violations are judged against declared profile/current provider capacity where applicable.

### DR-ACLRB-13 — provider differential conformance
Exercise equivalent automation using at least two event providers with materially different delivery IDs/dedup/ordering semantics. Prove portable causal/effect claims survive substitution without importing provider IDs as canonical truth.

### DR-ACLRB-14 — privacy-safe lineage representation
Exercise a path where full external propagation of lineage metadata is prohibited by privacy/policy. Prove the architecture can retain sufficient local/reconstructable evidence for safety without requiring sensitive full-chain disclosure.

### DR-ACLRB-15 — static signal remains a signal
Provide a graph SCC/cycle that is demonstrably safe under owner-declared termination/progress. Prove the detector records `Signal`, not `ConfirmedConflict`, until activation evidence satisfies the conflict pattern.

### DR-ACLRB-16 — chaos/backlog amplification
Inject provider outage, accumulated retries/backlog, then recovery. Prove resumed delivery does not create unbounded recursive fan-out and that residual/ambiguous effects retain lineage and bounded failure semantics.

## Unresolved questions

1. What is the smallest reusable G2 representation for causal/effect ancestry: direct parent relation, root + relation edges, effect-obligation linkage, or reconstructable qualified evidence closure?
2. Which boundedness classes are portable enough to express generically (termination predicate, monotonic progress witness, iteration/resource budget, fixed-point condition) without becoming a universal process language?
3. How much lineage must autonomous/offline runtimes retain locally to reconcile after long disconnection while satisfying privacy/storage constraints?
4. When opaque brownfield systems cannot propagate lineage metadata, what evidence combination is sufficient to classify recurrence versus merely signal it?
5. How should compensation/retraction create causal relations without making compensation itself appear as forbidden recursion?

These are Planning-C or later bounded-proof questions unless further adversarial evidence changes semantic ownership.

## Confidence

**Strongly supported** for the material claim that provider/message/trace identity is insufficient to prove causal independence or recursion safety, and that valid cycles must not be globally prohibited.

**Supported but not final** for the exact reusable primitive shape. Evidence supports a qualified causal/effect relation/closure, but does not yet justify one concrete canonical object or global graph.

## Research disposition

- `KEEP` — `G2-CONFLICT-PATTERN-AUTOMATION-COMPOSITION-001`, semantic effect identity, current actuation authorization, reconcile-before-retry.
- `GENERALIZE` — qualified evidence to causal/effect ancestry and incomplete-lineage currentness.
- `SPECIALIZE` — new `G2-CONFLICT-PATTERN-AUTOMATION-CAUSALITY-001` for hidden recurrence across identity discontinuities.
- `MERGE` — causal ancestry with existing effect/attempt lineage rather than creating an unrelated parallel subsystem.
- `PROVIDERIZE` — message IDs, trace context, broker dedup/order, filters, graph analyzers, quotas/rate controls.
- `DEFER` — exact `CausalLineage`/`EffectAncestry` target representation and boundedness vocabulary to Planning C after adversarial saturation.
- `DO_NOT_BUILD` — DAG-only process restriction; provider-message-ID business lineage; canonical trace-ID authority; universal global event history; arbitrary universal hop limit.

## Saturation consequence

This is a **material cross-capability finding**. It does not increment `completed_full_passes` or mark Notifications/Messaging or Integration as breadth-covered. When consumed by the adversarial registers, it should keep/reset to `0` the affected local/cluster saturation streaks for:

- Workflow × Integration × Messaging × external mutation;
- Provider/Binding × external realizations;
- AI/low-code composition where event-driven automation is involved;
- Observability/FinOps only insofar as operational/cost evidence is used to qualify amplification.

No 13th mandatory cluster is justified by this deep dive.
