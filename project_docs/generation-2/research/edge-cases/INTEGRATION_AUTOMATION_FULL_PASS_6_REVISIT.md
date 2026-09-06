# Generation 2 — Integration & Automation — Full Pass 6 Revisit

Status: ELIGIBLE NO-NEW-MATERIAL REVISIT
Phase: `RESEARCH_ADVERSARIAL_EDGE_CASE_SATURATION`
Capability: Integration & Automation
Pass: 6

Research only. No product code, Work Package, TASK, Construction or concrete remediation is authorized. Preserve `ConflictPattern != ConflictInstance` and `Signal != ConfirmedConflict`. Default disposition remains `CATALOGUE + CLASSIFY + DETECTION_CANDIDATE + FUTURE_REMEDIATION_ROUTE`.

## 1. Authority and scope

This revisit follows `RESEARCH_PIPELINE_STATE.json`, `POST_MATH_ADVERSARIAL_EDGE_CASE_SATURATION_RESEARCH.md` and `PROCESSUAL_SEMANTIC_CONFLICT_CLASSIFICATION.md`. The authoritative starting state was Full Pass 6 at 14/28 capabilities, 12/12 mandatory clusters, 284 material edge scenarios + 124 reusable ConflictPatterns = 408 material findings, with Integration local no-material streak already capped at 2.

This pass deliberately used techniques materially different from Passes 1–5: temporal-slice mutation, provenance-edge subtraction, decision-kind permutation, dimensional-contract mutation, uncertainty-kind substitution, graph-transformation semantic diff, queue-network stress reasoning, causal-claim falsification, federated contract cut analysis and proof-claim non-strengthening.

All candidate findings were duplicate-screened against the authoritative inventory of 124 reusable `G2-CONFLICT-PATTERN-*` families. No candidate survived as a new reusable family or capability-specific material scenario.

## 2. Adversarial vectors exercised

### 2.1 Temporal / dynamic graph

A trigger edge may be valid when configured but stale, future-effective, superseded or no longer authorized when the external occurrence, delivery, retry or callback is processed. Conversely, an event generated under revision R can legitimately arrive after revision R+1 becomes current. A current graph projection must not rewrite the historical qualification cut that produced the event.

Activation probes included overlapping validity intervals; retroactive corrections; future-dated bindings; trigger-at-T1/delivery-at-T2; long-running instances pinned to an old connector revision; residual provider registrations; topology drift; clock skew; and provider/schema/authority validity changing between observation and actuation.

Detection candidates: valid-time + transaction-time qualification where needed, explicit producing revision/cut, pre-effect currentness requalification, residual-cohort detection and post-effect reconciliation. False-positive risk is material when late but legitimate historical events are treated as stale merely because they are not current.

Disposition: covered by existing temporal/currentness, revision/coexistence, residual-cohort, compatibility-direction and false-convergence families. No new ConflictPattern.

### 2.2 Provenance / lineage handoff

A connector boundary containing several inputs and outputs does not prove exact source→target or field→field lineage. OpenLineage now supports explicit job/dataset lineage specifically to avoid false Cartesian-product inference between every event input and every event output. W3C PROV likewise distinguishes provenance relation kinds and warns against treating broad influence as a more specific relation without evidence.

Adversarial probes: incomplete lineage; forged or provider-asserted lineage; wrong revision; lineage cycles; superseded/corrected lineage; cross-system handoff missing producing identity; field-level lineage loss; and conflation of `derivedFrom`, `causedBy` and `authorizedBy`.

Detection candidates: asserted/observed/inferred lineage kind, producer/evidence identity, revision/currentness qualification, cycle checks and consumer-side refusal to strengthen coarse lineage into exact derivation.

Disposition: duplicate of `G2-CONFLICT-PATTERN-PROVENANCE-EDGE-OVERATTRIBUTION-001` plus qualified identity/currentness and proof-claim-conflation. No new pattern.

Evidence:
- OpenLineage Lineage Job Facet — https://openlineage.io/docs/spec/facets/job-facets/lineage/
- OpenLineage Lineage Dataset Facet — https://openlineage.io/docs/spec/facets/dataset-facets/lineage/
- W3C PROV FAQ — https://www.w3.org/2001/sw/wiki/PROV-FAQ

### 2.3 Decision semantics across integration boundaries

A connector can hide a decision inside routing rules, filters, expressions or low-code conditions. Two integrations can therefore be shape-compatible while using incompatible hit policies, priorities, default fallthroughs or decision revisions. A decision is not merely a calculation and neither is identical to workflow control flow.

DMN 1.5 provides a useful comparative witness: hit policy is explicit; `Unique` forbids overlapping rules, while other policies intentionally define how overlap is resolved. This supports retaining rule-overlap/gap/priority semantics rather than relying on accidental rule order.

Adversarial probes included overlapping routing predicates, ambiguous priority, provider-native default fallthrough, stale decision revision, AI result treated as deterministic rule result, and workflow-condition spaghetti bypassing the owner of a decision.

Detection candidates: explicit decision-kind/hit-policy metadata, overlap/gap analysis, revision binding, owner qualification and runtime signal when effective routing diverges from declared semantics.

Disposition: covered by rule/formula/condition conflict, analytical-kind conflation, semantic ownership, authority and revision/currentness families. No new pattern.

Evidence:
- OMG DMN 1.5 — https://www.omg.org/spec/DMN/1.5/PDF

### 2.4 Units / dimensional analysis across connectors

Schema compatibility does not imply dimensional compatibility. A connector can preserve numeric shape while changing unit, currency, timezone basis, rate-vs-total meaning, affine scale or rounding profile. A scalar payload can therefore be structurally valid but semantically invalid for the receiving expression/decision.

Adversarial probes: hours vs seconds; percentage vs ratio; rate vs total; gross vs net; local currency vs reporting currency; local time vs UTC interval; affine temperature-style units; stale unit metadata; and accumulation of provider-side rounding.

Detection candidates: dimensional type/profile checks before evaluation or actuation, explicit conversion ownership/revision, and result-kind preservation. False positives arise where the domain intentionally permits dimensionless normalization or explicit conversions.

Disposition: covered by mathematical unit/currency/precision families, semantic ownership and compatibility-direction. No new pattern.

### 2.5 Uncertainty propagation

A provider can return interval, distribution, confidence, score or incomplete observation while the integration contract exposes a scalar. Downstream automation can then manufacture certainty without any transport or schema error.

Adversarial probes: interval→point collapse; distribution→mean collapse; invalid independence assumptions when aggregating providers; stale distributions; uncertainty amplification through fan-out; Monte Carlo seed/reproducibility drift; nominal optimization used as robust commitment; uncertain SLA/pricing evidence treated as guaranteed fact; and AI confidence interpreted as probability.

Canonical distinction preserved: `UNKNOWN != probabilistic uncertainty != bounded interval != model confidence`.

Detection candidates: analytical-kind/profile checks, uncertainty metadata/currentness, bounded propagation rules owned by the calculation/decision domain, and explicit refusal to strengthen a weaker result kind.

Disposition: covered by `G2-CONFLICT-PATTERN-ANALYTICAL-KIND-CONFLATION-001`, proof-claim-conflation, presence/UNKNOWN semantics and semantic ownership. No new pattern.

### 2.6 Graph transformation / revision

A low-code change can preserve visual shape or node count while changing edge semantics, provider binding, decision ownership, target population or data/effect footprint. Reusing node identity after semantic replacement can make old execution/proof references appear current.

Adversarial probes: node-ID reuse; edge rewrite ambiguity; partial transformation; incremental revalidation that misses a distant invariant; in-flight instances pinned to pre-transform semantics; stale proof reuse; orphaned references; and semantic diff that reports cosmetic equivalence despite changed authority/effect semantics.

Detection candidates: semantic rather than purely structural diff, identity-preserving versus identity-breaking transformation classification, affected-subgraph closure, revision binding and proof invalidation/preservation rules.

Disposition: covered by revision/currentness, compatibility-direction, supersession lineage, certificate/proof composition and false convergence. No new pattern.

### 2.7 Queueing / flow / capacity

A typed graph can be structurally live while its realized queue network is operationally unstable. Observed utilization below a nominal threshold does not prove sustainable capacity under burstiness, correlated service times, retries or shared bottlenecks.

RabbitMQ documents that multiple consumers, redeliveries, priority and federation can change effective ordering; federation can also duplicate messages when federated exchanges and queues interact. Consumer prefetch bounds in-flight deliveries but is not a proof of end-to-end queue stability.

Adversarial probes: arrival rate persistently exceeding service rate; hidden backlog growth; head-of-line blocking; starvation; priority inversion; retry storms; backpressure propagating across workflow branches; shared provider quotas; Little's-Law misuse outside stable conditions; and cross-queue bottlenecks hidden by per-queue health.

Detection candidates: runtime backlog/age/arrival/service telemetry, explicit resource topology, bounded retry/fan-out analysis and model-check/property-test candidates for critical queue networks. A queue-pressure signal remains a `Signal`, not a `ConfirmedConflict`.

Disposition: covered by resource/capacity, temporal/ordering, fan-out/retry, provider semantics and observability/false-convergence families. No new pattern.

Evidence:
- RabbitMQ Queues / ordering — https://www.rabbitmq.com/docs/4.2/queues
- RabbitMQ Federated Queues — https://www.rabbitmq.com/docs/4.2/federated-queues
- RabbitMQ Consumers / prefetch — https://www.rabbitmq.com/docs/consumers

### 2.8 Causality / counterfactuals — research only

Integration telemetry and lineage can support candidate causal models, but correlation, temporal precedence or `derivedFrom` lineage does not establish causation. Counterfactual use for pricing, capacity, logistics or business intervention requires explicit assumptions, graph/model, intervention semantics, evidence scope and owner.

Adversarial probes: provider change correlated with latency improvement while demand mix also changed; queue depth correlated with failures but both driven by upstream burst; pricing intervention evaluated without selection effects; and AI-generated causal narrative consumed as decision authority.

Detection candidate: require explicit causal-claim kind and assumptions before downstream use; otherwise retain as correlation/observational evidence. No automatic decision authority is implied.

Disposition: covered by analytical-kind conflation, provenance-edge overattribution, proof-claim conflation, objective/optimization and authority non-amplification. No new pattern.

## 3. Graph/workflow + formal-assurance falsification

### 3.1 Event identity is not invocation/effect identity

CloudEvents requires `(source,id)` uniqueness for distinct events and permits a duplicate re-send to retain the same `id`. The primer explicitly notes that one occurrence can emit multiple distinct events and that correlation requires additional data. Therefore event identity is insufficient to prove occurrence identity, invocation identity, business-effect identity or safe retry.

Evidence:
- CloudEvents specification — https://github.com/cloudevents/spec/blob/main/cloudevents/spec.md
- CloudEvents primer — https://github.com/cloudevents/spec/blob/main/cloudevents/primer.md

### 3.2 Transport order is not semantic happens-before

RabbitMQ FIFO guarantees are qualified by channel, consumer, priority and redelivery behavior; multiple channels interleave, redelivery can reorder, and federation can reorder messages that take different routes. Therefore an A→B semantic dependency cannot be proven from queue topology alone.

Detection candidates: causal/correlation identity, operation-specific ordering guarantees, runtime currentness checks and post-effect reconciliation. Existing temporal/ordering/provider-contract patterns cover the class.

### 3.3 Authenticity and journal integrity do not prove current semantic eligibility

A correctly signed callback or tamper-evident journal entry can prove integrity/authenticity within its evidence profile, while the callback is stale, from a superseded provider registration, outside current authority, or semantically insufficient to establish the external effect. Preserve:

`authenticity != currentness != semantic eligibility != external-effect proof != PROVEN_COMPLETED`.

No new proof family is needed beyond proof-claim-conflation, currentness, certificate composition and federated continuity.

### 3.4 `PARTIAL/UNKNOWN` remains non-strengthenable

Timeout, transport error or incomplete callback does not prove `NOT_APPLIED`; provider acceptance does not prove business convergence. Reconcile-before-retry remains required when mutation outcome is `UNKNOWN` unless an operation-specific qualified idempotency/effect contract proves retry safety.

### 3.5 Human and AI redrive can strengthen weak evidence

A runbook or AI agent can see a failed-delivery signal and conclude “safe to retry,” although a downstream effect may already have occurred or later state has adopted the result. Similarly, an AI can synthesize exact lineage from coarse connector boundaries or interpret an authenticated callback as authorization.

Detection candidates: claim-kind preservation, current authority/state requalification, effect-lineage reconciliation, and bounded human escalation. Existing human-procedure, AI/low-code composition, authority non-amplification, ambiguous-mutation and provenance overattribution patterns cover this.

## 4. Proof obligations / Planning C-D-E handoff candidates

Research-only proof obligations refined by this revisit:

1. **Temporal qualification:** a trigger/effect claim binds the producing graph/connector revision and effective-time cut; current projection cannot rewrite historical qualification.
2. **Lineage non-invention:** coarse input/output boundaries cannot be expanded into exact source→target/field derivation without producer evidence or a declared inferred-lineage profile.
3. **Decision-kind preservation:** decision, calculation, routing/control-flow and AI/human result kinds remain distinguishable across connector boundaries.
4. **Dimensional contract:** numeric compatibility does not imply unit/currency/time/rate compatibility; conversions bind owner and revision.
5. **Uncertainty non-strengthening:** interval/distribution/confidence/UNKNOWN may not silently collapse into a deterministic authoritative scalar.
6. **Transformation proof invalidation:** graph/Canvas transformation must classify semantic identity preservation versus proof/revision invalidation; visual equivalence is insufficient.
7. **Ordering qualification:** transport/queue configuration proves only documented ordering properties; semantic happens-before requires qualified evidence.
8. **Capacity non-strengthening:** observed utilization/consumer capacity is not by itself proof of queue-network stability or sustainable capacity.
9. **Causal claim discipline:** provenance/correlation/temporal order are not automatically causal evidence; causal use requires explicit model/assumptions/owner.
10. **Effect proof separation:** authentic delivery/callback/journal evidence is not automatically proof of current external business effect or `PROVEN_COMPLETED`.
11. **Offline/federated verifier behavior:** insufficient, stale or unqualified external evidence yields `UNKNOWN/INCONCLUSIVE`, not strengthened completion.
12. **AI/low-code non-amplification:** generated automation cannot manufacture lineage, certainty, causality, authority or replay safety absent qualifying evidence.

Planning E future tests should include temporal-revision trigger mismatch, exact-lineage overattribution rejection, overlapping decision-rule detection, incompatible-unit rejection, uncertainty-kind preservation, semantic graph-diff invalidation, redelivery/reordering trace cases, queue-overload signal handling, causal-claim non-strengthening and external `UNKNOWN` preventing false completion.

## 5. Conflict classification / saturation disposition

The revisit deliberately exercised structural graph, state-transition, semantic ownership, rule/formula/condition, temporal/ordering, resource/capacity, authority/responsibility/SoD, policy/compliance, data/consistency, provider/integration, version/migration/coexistence, exception/compensation/recovery, human-procedure, cross-process, objective/optimization and AI/low-code composition.

Material candidate classification fields were considered for activation, incompatible claims/actions/states, detection stage, owners, severity, confidence, detectability, blast radius, reversibility, time-to-harm, misuse likelihood, evidence currentness and false-positive risk before duplicate screening. Every candidate mapped to an existing reusable family. No `ConflictInstance` is asserted and no detector signal is promoted to a confirmed conflict.

Result:

- new local material edge scenarios: **0**;
- new cross-capability scenario IDs: **0**;
- new reusable ConflictPatterns: **0**;
- new preventive invariant candidates: **0**;
- Integration & Automation local no-material streak: **remains 2 / capped**;
- mandatory-cluster streaks: **unchanged / capped at 2**;
- material edge inventory: **284**;
- reusable ConflictPatterns: **124**;
- combined material findings: **408**;
- HIGH/CRITICAL without owner/proof/detection route: **0**;
- Full Pass 6 capability coverage after this revisit: **15/28**;
- Full Pass 6 mandatory clusters: **12/12**;
- completed full passes: **5/8 minimum**;
- negative-space review: **NOT_STARTED**;
- saturation: **NOT_SATURATED**;
- Planning C: **BLOCKED**.

No `EDGE_CASE_INDEX.md` or `CROSS_CAPABILITY_EDGE_CASE_MATRIX.md` material entry is added because no new material scenario survived duplicate-screening.

## 6. Next rotation

Continue only Full Pass 6 with **Identity / Authentication / Federation** using the same mandatory new adversarial vectors where applicable and techniques materially different from earlier passes. Challenge temporal subject/session/credential validity; identifier reassignment; asserted/observed/inferred identity provenance; decision ownership in authentication/risk; units/time windows where claims carry durations; uncertainty/confidence in identity/risk evidence; graph transformation of account-link/federation topology; queue/backpressure around revocation/session propagation; causal/correlation overclaim across identities; issuer/subject/session/key revision skew; IdP substitution and residual sessions; recovery/reset; offline/stale tokens; cross-tenant correlation; trust-namespace collapse; current authentication evidence versus current Authorization/Station/AGWS authority; `PARTIAL/UNKNOWN`; human recovery; and AI/low-code use of authentication evidence as authorization.

Identity local streak is already 2 and must not be inflated absent material novelty. All 12 mandatory clusters remain covered. Preserve `authentication evidence != authorization`, `identity proof != current authority`, Fleet non-authority and GraphDB optionality. Do not enter Planning C.
