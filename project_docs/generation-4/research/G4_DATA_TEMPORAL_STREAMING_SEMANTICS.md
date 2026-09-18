# G4 — Temporal, Streaming & Replay Semantics

Status: `RESEARCH_ACTIVE / NON_EXECUTABLE`
Execution authority: NONE
Last evidence consolidation: 2026-09-18

## Purpose

Deepen the temporal/streaming portion of Data Treatment without selecting a stream processor, broker or database. The goal is to preserve meaning, currentness and replay safety across event time, processing time, late data, CDC, checkpoints and external effects.

This file is a focused evidence consolidation for the broader `G4_DATA_TREATMENT_ENGINEERING_BACKLOG.md`; it is not a new G4 macro-family.

## Evidence base

Primary/mature references examined in this consolidation:

- Apache Beam programming model: event time vs processing time, watermarks, windows, triggers, allowed lateness and accumulating/discarding panes.
- Apache Flink: event-time late-data behavior, checkpoint semantics, replay/recovery, exactly-once state guarantees and external-sink constraints.
- Apache Kafka design: transactional producer/consumer-offset coupling and the bounded conditions under which exactly-once processing is obtained.
- Debezium Outbox Event Router: transactional-outbox pattern, stable event IDs and CDC publication without dual-writing application state and messages.
- PostgreSQL transaction/time semantics: transaction, statement and wall-clock time are distinct; snapshot visibility depends on isolation level.

These systems are evidence sources, not provider choices.

## 1. Time is multidimensional

The System Builder should not model one generic timestamp when the distinctions affect truth or replay.

Candidate semantic dimensions:

```text
OccurredAt       domain/event time: when the represented fact/event happened
EffectiveFrom/To business-valid time: when a rule/state is considered valid
ObservedAt       when an observer learned of it
RecordedAt       when canonical/evidence storage recorded it
IngestedAt       when a treatment pipeline accepted it
ProcessedAt      when a processing stage executed
PublishedAt      when an integration/projection publication occurred
```

Not every datum needs every dimension. Where they differ materially, collapsing them destroys reconstructability.

Invariants:

- `OccurredAt != ObservedAt != RecordedAt != ProcessedAt`.
- `Business-valid time != database transaction time`.
- `Clock timestamp != causal order`.
- `Later arrival != later occurrence`.
- `Current row != truth as-of arbitrary historical time`.

PostgreSQL itself distinguishes transaction start, statement start and actual wall-clock time, which is useful evidence that even one database process has multiple legitimate notions of "now".

## 2. Event-time completeness is an estimate

Beam and Flink treat watermarks as progress/completeness mechanisms for event time; data may arrive out of order or after a watermark/window boundary. Therefore SB must not translate a watermark into semantic certainty.

Candidate distinction:

```text
EventTimeProgressEstimate
  source/partition scope
  watermark
  estimator/provenance
  observedAt
  allowedLatenessPolicy
  confidence/qualification
```

Invariants:

- `Watermark passed != no earlier event can ever arrive`.
- `Window emitted != historical result immutable`.
- `On-time result != complete forever`.
- `Late != invalid`.

A result may need a disposition such as `PRELIMINARY`, `ON_TIME`, `CORRECTED`, `FINAL_BY_POLICY`, or `RETRACTED`; these are research candidates, not mandatory canonical enums.

## 3. Completeness, latency and cost are explicit trade-offs

Beam's trigger model makes a useful product-independent point: early/on-time/late firings trade completeness against latency and compute cost. SB should preserve the policy that produced a materialized result rather than presenting every aggregation as equally final.

Candidate `TemporalMaterializationEvidence`:

```text
window/event-time scope
input revision/checkpoint range
watermark/progress state
trigger/publication policy
allowed lateness
accumulation/retraction mode
result revision
supersedes result revision?
completeness qualification
```

A dashboard value emitted early can be useful without being promoted to authoritative final evidence.

## 4. Correction and retraction are first-class

Late data, backdated business facts and source corrections can change previously published derivations. The architecture should support revision rather than silent overwrite.

```text
source event/fact
 -> temporal derivation R1
 -> late/correcting input
 -> derivation R2
 -> R2 supersedes/corrects R1
```

Preserve both the old evidence and the correction relationship where audit/history requires it.

Invariants:

- `Correction != deletion of prior evidence`.
- `Recomputed != originally observed`.
- `Backdated effective state != backdated observation`.
- `Superseded result != result that never existed`.

## 5. Exactly-once must be scoped

Flink explicitly distinguishes exactly-once managed state from end-to-end effects; end-to-end exactly-once requires replayable sources and transactional or idempotent sinks. Kafka obtains its transactional processing guarantee by atomically coupling produced records with consumed offsets under specific consumer/producer/isolation behavior.

Therefore SB should never expose an unqualified `exactlyOnce: true`.

Candidate guarantee envelope:

```text
ProcessingGuarantee
  sourceBoundary
  sourceReplayability
  orderingScope
  processorStateGuarantee
  checkpointIdentity
  sinkBoundary
  sinkTransactionality/idempotency
  externalSideEffectsIncluded?
  duplicateTolerance
  replayPolicy
  proof/evidence
```

Invariants:

- `Exactly-once processor state != exactly-once external effect`.
- `Checkpoint completed != external side effect committed exactly once`.
- `Message delivered once != business effect applied once`.
- `Idempotency key present != operation proven idempotent`.

For email, payments, device commands or arbitrary provider APIs, uncertain outcomes remain `UNKNOWN` until reconciliation proves effect; a stream framework cannot erase that boundary.

## 6. Replay is a new execution context, not time travel

Flink recovery and event-log systems depend on replay, but replay occurs later, often under changed code, schemas, reference data and external environments. SB should qualify replay context explicitly.

Candidate `ReplayContext`:

```text
source checkpoint/range
original processing revision
replay processing revision
schema/contract revisions
reference-data revision policy
side-effect mode
output namespace/generation
replay reason
initiator/authority
```

Replay modes may include rebuild-only, shadow, correction/backfill, recovery and controlled re-effect. Replaying canonical inputs must not automatically repeat irreversible external effects.

Invariants:

- `Same input != same result under different transformation revision`.
- `Replay-safe state transform != replay-safe external side effect`.
- `Rebuild projection != repeat business action`.
- `Historical reconstruction != executing historical commands again`.

## 7. Backfill and live processing need a convergence contract

A backfill can race with the live stream and create duplicates, regressions or stale overwrites. Treat backfill as a qualified generation/range with an explicit cutover/reconciliation point.

```text
LIVE checkpoint C
      |
BACKFILL [A..C]
      |
validate overlap/dedup/revision
      |
catch up / reconcile
      |
promote derived generation
```

Required research questions include event identity, source offsets/checkpoints, ordering scope, overlap ownership, tombstones/corrections and whether derived outputs are replaceable generations or in-place mutations.

`Backfill finished != live/backfill convergence proven`.

## 8. CDC publication is not canonical business truth

Debezium's outbox pattern is useful evidence for avoiding application dual writes: business state and an outbox record can share the local database transaction, then CDC publishes the event. The outbox event ID can support consumer deduplication.

But:

- `Outbox committed != consumer applied effect`.
- `CDC record != business semantic event by default`.
- `Database row change != domain event`.
- `Stable event ID != global semantic identity`.

Research should distinguish raw change capture, integration publication and intentionally modeled business events.

## 9. Ordering is scoped, not global

Stream systems commonly provide ordering only within a partition/key or another bounded channel. SB should state ordering scope explicitly and avoid inventing a total order from timestamps.

Candidate fields:

```text
orderingDomain
partition/key
sourceSequence/offset
causal/correlation refs
occurredAt
recordedAt
```

Where cross-stream causality matters, explicit causal references/evidence are stronger than timestamp comparison alone.

`Timestamp A < Timestamp B != A caused B`.

## 10. Temporal queries need declared perspective

"What was true at T?" is ambiguous. It may mean:

1. what the business considered effective at T;
2. what the system had recorded by T;
3. what an observer knew by T;
4. what today's corrected knowledge says was effective at T.

This motivates bitemporal/as-of research without requiring a universal bitemporal table for every entity.

Candidate query qualification:

```text
TemporalPerspective
  valid/effective time
  recorded/system time
  observation cutoff
  correction policy
  source/revision scope
```

Historical reconstruction should state its perspective instead of returning an unlabeled snapshot.

## 11. Failure/adversarial cases

- a late event changes a previously invoiced aggregate;
- watermark advances because one source appears idle, then old events resume;
- clock skew makes processing timestamps appear before occurrence timestamps;
- replay under a new transformation revision changes historical derived output;
- backfill and live stream both write the same projection range;
- checkpoint restores processor state but an external API call had already succeeded;
- consumer retries a payment/email/device command after uncertain ACK;
- outbox event is published twice after connector recovery;
- schema/reference data changed between original execution and replay;
- tombstone/correction arrives before the original event on another partition;
- a dashboard treats an early pane as final business evidence;
- a global ordering claim is inferred from per-partition offsets.

## 12. Proof obligations

1. Every material timestamp has declared semantics; generic `createdAt` is insufficient where multiple clocks matter.
2. Historical/as-of queries declare temporal perspective and revision/correction policy.
3. Late/correcting input cannot silently rewrite prior evidence without lineage/supersession.
4. Watermark/window completion cannot be promoted to absolute source completeness.
5. Processing guarantees state source, processor-state, sink and external-effect boundaries.
6. Replay declares code/schema/reference-data revisions and side-effect policy.
7. Backfill/live overlap has explicit ownership, deduplication and convergence proof.
8. CDC/outbox publication remains distinct from consumer effect and canonical business authority.
9. Ordering guarantees declare their scope; timestamps alone do not create causality.
10. Projection rebuild/replay can be performed without re-triggering business side effects unless separately authorized.
11. UNKNOWN outcome after uncertain external effect survives retries/replay until reconciliation.
12. Temporal materializations expose whether they are preliminary, corrected, superseded or final-by-policy where material.

## 13. Technology/provider posture

No decision is made to adopt Beam, Flink, Kafka, Debezium or a dedicated temporal database. Their models are evidence for requirements and failure modes.

Initial product research should prefer:

- explicit temporal semantics in provider-neutral contracts;
- PostgreSQL/outbox/ordinary job mechanisms where workloads permit;
- replayable/rebuildable projections;
- idempotent/reconciled consumers;
- specialized stream infrastructure only after measured latency/volume/state requirements justify it.

`Streaming semantics != requirement for a streaming platform`.

## 14. Next research gaps

- temporal identity under corrections, merges/splits and entity-resolution revisions;
- schema/reference-data version pinning versus reinterpretation during replay;
- deletion/retention interaction with replay and historical reconstruction;
- cross-region/offline clocks, causality and reconciliation;
- property-based/adversarial test model for late/out-of-order/replayed data;
- workload thresholds that justify a dedicated streaming engine over PostgreSQL/outbox/jobs.
