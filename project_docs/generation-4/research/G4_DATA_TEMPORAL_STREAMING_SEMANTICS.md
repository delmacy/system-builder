# G4 — Temporal, Streaming & Replay Semantics

Status: `RESEARCH_ACTIVE / NON_EXECUTABLE`
Execution authority: NONE
Last evidence consolidation: 2026-09-18

## Purpose

Deepen the temporal/streaming portion of Data Treatment without selecting a stream processor, broker or database. The goal is to preserve meaning, currentness and replay safety across event time, processing time, late data, CDC, checkpoints, identity correction and external effects.

This file is a focused evidence consolidation for the broader `G4_DATA_TREATMENT_ENGINEERING_BACKLOG.md`; it is not a new G4 macro-family.

## Evidence base

Primary/mature references examined in this consolidation:

- Apache Beam programming model: event time vs processing time, watermarks, windows, triggers, allowed lateness and accumulating/discarding panes.
- Apache Flink: event-time late-data behavior, checkpoint semantics, replay/recovery, exactly-once state guarantees and external-sink constraints.
- Apache Kafka design: transactional producer/consumer-offset coupling and the bounded conditions under which exactly-once processing is obtained.
- Debezium Outbox Event Router: transactional-outbox pattern, stable event IDs and CDC publication without dual-writing application state and messages.
- PostgreSQL transaction/time semantics: transaction, statement and wall-clock time are distinct; snapshot visibility depends on isolation level.
- W3C PROV: changing things can be represented by distinct provenance entities linked through specialization/alternate/derivation rather than destructive identity collapse.
- HL7 FHIR Patient linking: mature operational evidence that duplicate/same-subject records may remain separately addressable while `replaces`, `replaced-by`, `refer` and `seealso` express different identity-resolution dispositions.
- Apache Iceberg snapshot/time-travel semantics: a historical snapshot can carry its own schema, while branch-oriented access may use the current table schema, demonstrating that historical bytes and interpretation schema are separable choices.

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

## 2. Event-time completeness is an estimate

Watermarks are progress/completeness mechanisms for event time; data may arrive out of order or after a watermark/window boundary. SB must not translate a watermark into semantic certainty.

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

Early/on-time/late publication trades completeness against latency and compute cost. SB should preserve the policy that produced a materialized result rather than presenting every aggregation as equally final.

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

## 4. Correction and retraction are first-class

Late data, backdated business facts and source corrections can change previously published derivations. The architecture should support revision rather than silent overwrite.

```text
source event/fact
 -> temporal derivation R1
 -> late/correcting input
 -> derivation R2
 -> R2 supersedes/corrects R1
```

Invariants:

- `Correction != deletion of prior evidence`.
- `Recomputed != originally observed`.
- `Backdated effective state != backdated observation`.
- `Superseded result != result that never existed`.

## 5. Exactly-once must be scoped

Exactly-once managed state is not automatically end-to-end exactly-once. SB should never expose an unqualified `exactlyOnce: true`.

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

## 6. Replay is a new execution context, not time travel

Replay occurs later, often under changed code, schemas, reference data and external environments. SB should qualify replay context explicitly.

Candidate `ReplayContext`:

```text
source checkpoint/range
original processing revision
replay processing revision
schema/contract revisions
reference-data revision policy
identity-resolution revision policy
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

`Backfill finished != live/backfill convergence proven`.

## 8. CDC publication is not canonical business truth

Transactional outbox is useful evidence for avoiding application dual writes, but publication remains distinct from downstream effect and business authority.

- `Outbox committed != consumer applied effect`.
- `CDC record != business semantic event by default`.
- `Database row change != domain event`.
- `Stable event ID != global semantic identity`.

## 9. Ordering is scoped, not global

Ordering guarantees must state scope explicitly.

```text
orderingDomain
partition/key
sourceSequence/offset
causal/correlation refs
occurredAt
recordedAt
```

`Timestamp A < Timestamp B != A caused B`.

## 10. Temporal queries need declared perspective

"What was true at T?" may mean what was business-effective, recorded, observed, or what today's corrected knowledge says was effective then.

Candidate query qualification:

```text
TemporalPerspective
  valid/effective time
  recorded/system time
  observation cutoff
  correction policy
  source/revision scope
  interpretation policy
  identity-resolution policy
```

Historical reconstruction should state its perspective instead of returning an unlabeled snapshot.

## 11. Temporal identity must preserve record history across resolution

Entity resolution is itself a revisioned interpretation. Two records believed to represent different subjects at T1 may later be merged; one record may later be split after evidence shows that observations belonged to different subjects. Historical source/evidence identity must not be destructively rewritten to match the current resolution.

W3C PROV provides a useful provider-neutral precedent: multiple provenance entities may represent fixed aspects/versions/perspectives of an underlying changing thing and can be related through specialization, alternate and derivation relationships. HL7 FHIR provides an operational precedent in which duplicate/same-person patient records remain separately identifiable while links express `replaces`, `replaced-by`, `refer` or `seealso`; the relationship does not require erasing the historical record.

Candidate distinction:

```text
SourceRecordIdentity      stable identity of the observed/received record
SubjectIdentity           domain subject asserted by an authority
ResolutionAssertion       evidence-backed relation among identities
ResolutionRevision        version of the resolution graph/policy
CanonicalSubjectView      current projection under a declared revision
```

A resolution assertion should carry at least provenance/evidence, authority, effective/recorded time, confidence/disposition where applicable, revision, and supersession/correction lineage.

Invariants:

- `Same-subject assertion != same record identity`.
- `Merge != destruction of predecessor identities`.
- `Current canonical subject != only historical subject interpretation`.
- `Split != retroactive deletion of the former merge decision`.
- `Entity-resolution revision != source-data mutation`.
- `Duplicate record != duplicate event/fact by default`.
- `Canonical identity redirect != evidence rewrite`.

For current operational views, an old identity may redirect to a replacement. Historical/audit views must still be able to explain which identity and resolution revision were in force when a decision/effect occurred.

### Merge and split are asymmetric changes

A merge can often be represented as several historical identities resolving to one current subject while retaining aliases/predecessors. A later split is harder: downstream aggregates, permissions, decisions or effects may already have been computed under the merged identity. Therefore a split requires impact analysis and selective recomputation/reconciliation rather than a simple pointer reversal.

```text
A ----\
       > Resolution R7 -> Subject X
B ----/

later evidence:

Resolution R8
A -> Subject X1
B -> Subject X2

R8 supersedes R7
but R7 remains historical evidence
```

`Resolution corrected != all downstream consequences automatically corrected`.

## 12. Replay must declare interpretation policy

Historical bytes alone do not determine historical meaning. Schema, reference/master data, rules and identity-resolution state may have changed since original processing.

Apache Iceberg offers a concrete mature example of this distinction: time travel to a snapshot can use that snapshot's schema, while branch-oriented access can use the table's current schema. The important SB lesson is not Iceberg adoption; it is that **data revision and interpretation revision are separate axes**.

Candidate `InterpretationContext`:

```text
schemaRevision
contractRevision
referenceDataRevision
masterDataRevision
identityResolutionRevision
rule/policyRevision
transformationRevision
mode: PINNED | CURRENT | EXPLICIT_MIXED
justification
```

Three replay intents should remain distinguishable:

```text
FORENSIC_REPRODUCTION
  use historically pinned interpretation where available
  answer: "what would/ did the system conclude then?"

CURRENT_REINTERPRETATION
  apply current approved interpretation to historical source
  answer: "what do we conclude now about then?"

CONTROLLED_MIXED
  explicit revision selection per dependency
  requires stronger provenance because it did not exist as one historical execution context
```

Invariants:

- `Historical source snapshot != historical interpretation snapshot`.
- `Current schema over old data != historical reproduction`.
- `Pinned schema != pinned reference/master data`.
- `Same source bytes + different reference data may yield different meaning`.
- `Current reinterpretation != correction of original observation`.
- `Replay result != original result even when source range is identical` unless the complete interpretation context is equivalent and deterministic proof holds.

A replay that cannot recover a required historical dependency revision must report degraded/inconclusive reproducibility rather than silently substituting the current revision.

## 13. Derived generations need interpretation lineage

Every rebuildable projection/aggregate/index that can influence decisions should be able to identify not just its source range but the interpretation context that produced it.

Candidate lineage:

```text
DerivedGeneration
  source identities/range
  source checkpoint/snapshot
  interpretation context
  treatment/transformation revision
  producedAt
  completeness qualification
  supersedes generation?
```

This permits two derived generations over the same source data to coexist legitimately when one is a forensic reconstruction and another is a current reinterpretation.

`Same source range != same derived generation semantics`.

## 14. Failure/adversarial cases

- a late event changes a previously invoiced aggregate;
- replay under a new transformation revision changes historical derived output;
- backfill and live stream both write the same projection range;
- checkpoint restores processor state but an external API call had already succeeded;
- schema/reference data changed between original execution and replay;
- a dashboard treats an early pane as final business evidence;
- two customer records are merged, then later evidence requires a split;
- permissions granted to a merged subject must be re-evaluated after split;
- an old identifier redirects to a new canonical subject and audit code accidentally rewrites historical attribution;
- replay pins schema but silently uses today's tax/routing/reference table;
- forensic replay cannot retrieve an expired historical reference-data revision;
- current reinterpretation is mislabeled as the original historical decision;
- identity resolution changes while a backfill is in progress, producing mixed-resolution output;
- dedup logic treats two records resolved to one subject as duplicate business events and drops a legitimate occurrence.

## 15. Proof obligations

1. Every material timestamp has declared semantics where multiple clocks matter.
2. Historical/as-of queries declare temporal perspective and revision/correction policy.
3. Late/correcting input cannot silently rewrite prior evidence without lineage/supersession.
4. Watermark/window completion cannot be promoted to absolute source completeness.
5. Processing guarantees state source, processor-state, sink and external-effect boundaries.
6. Replay declares code/schema/reference-data/identity-resolution revisions and side-effect policy.
7. Backfill/live overlap has explicit ownership, deduplication and convergence proof.
8. CDC/outbox publication remains distinct from consumer effect and canonical business authority.
9. Ordering guarantees declare their scope; timestamps alone do not create causality.
10. Projection rebuild/replay can be performed without re-triggering business side effects unless separately authorized.
11. UNKNOWN outcome after uncertain external effect survives retries/replay until reconciliation.
12. Temporal materializations expose whether they are preliminary, corrected, superseded or final-by-policy where material.
13. Merge/split/canonicalization preserves predecessor record identities and resolution lineage.
14. Historical decisions/effects can state which identity-resolution revision they relied on.
15. A split identifies downstream derivations/effects requiring recomputation or reconciliation; pointer reversal alone is insufficient proof.
16. Replay states whether interpretation is historically pinned, current, or explicitly mixed.
17. Missing historical schema/reference/master/rule/resolution revisions cannot be silently replaced by current versions when forensic reproduction is claimed.
18. Derived generations preserve source range plus interpretation/treatment revision lineage.
19. Current reinterpretation cannot overwrite or masquerade as original historical observation/evidence.
20. Deduplication remains scoped to event/fact identity rules and cannot infer duplicate occurrence solely from merged subject identity.

## 16. Technology/provider posture

No decision is made to adopt Beam, Flink, Kafka, Debezium, Iceberg, FHIR, W3C PROV storage, a master-data product or a dedicated temporal database. Their models are evidence for requirements and failure modes.

Initial product research should prefer explicit provider-neutral temporal/identity contracts, PostgreSQL/outbox/ordinary job mechanisms where workloads permit, replayable projections, and specialized infrastructure only after measured requirements justify it.

`Streaming semantics != requirement for a streaming platform`.
`Temporal provenance != requirement for a temporal database`.
`Identity-resolution semantics != requirement for an MDM product`.

## 17. Next research gaps

- deletion/retention interaction with replay, identity lineage and historical reconstruction;
- cross-region/offline clocks, causality and reconciliation;
- property-based/adversarial test model for late/out-of-order/replayed/merge-split data;
- workload thresholds that justify a dedicated streaming engine over PostgreSQL/outbox/jobs;
- retention strategy for historical interpretation dependencies without violating privacy/deletion obligations.
