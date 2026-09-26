# G4 — Handoff Recovery and Generation-Frontier Evidence Compaction

Status: `RESEARCH_ACTIVE / NON_EXECUTABLE`
Execution authority: NONE
Date: 2026-09-19
Parent family: Shared Semantic Kernel / Capability Exchange Plane / Inter-Capability Boundary Model

## Purpose

Research the minimum durable evidence required to recover a partially completed semantic-generation handoff after crash, partition or delayed delivery, and when old branch/frontier history may be compacted without making late redelivery, replay, settlement or stale authority indistinguishable from fresh work.

This continues `G4_CAPABILITY_EXCHANGE_SEMANTIC_GENERATION_HANDOFF.md`. It selects no log, broker, workflow engine, snapshot format, database or coordinator and grants no implementation authority.

Core separations:

```text
Recoverable state != retained full history
Compaction != semantic forgetting
Transport retention != semantic evidence retention
Message absent != effect absent
Checkpoint complete != external effects settled
Dedup window expired != old obligation became new
Historical resolvability != current effect authority
Compaction floor != security floor
```

## Evidence classes reviewed

Primary/mature-system evidence:

- Apache Kafka log compaction: compaction removes superseded records while preserving ordering and stable offsets; tombstones are retained only for a bounded delete-retention window, after which sufficiently lagging consumers can miss deletion evidence. https://kafka.apache.org/design/
- Apache Pulsar retention/expiry and topic compaction: acknowledged and unacknowledged retention are separate concerns; compaction is distinct from retention/expiry and keeps a shallow per-key image rather than complete history. https://pulsar.apache.org/docs/next/concepts-messaging/ and https://pulsar.apache.org/docs/4.2.x/concepts-topic-compaction/
- etcd MVCC history compaction: revisions before the compaction point become unavailable; watch clients that fall behind the compacted revision receive an explicit compacted-revision boundary instead of fabricated continuity. https://etcd.io/docs/v3.8/op-guide/maintenance/ and https://etcd.io/docs/v3.6/learning/api/
- Apache Flink checkpointing: a completed checkpoint is a consistent recovery snapshot of operator state and source positions; aligned barriers delimit a logical cut, while exactly-once state recovery does not automatically imply exactly-once external effects unless sinks participate transactionally or idempotently. https://nightlies.apache.org/flink/flink-docs-stable/docs/learn-flink/fault_tolerance/
- RabbitMQ quorum queues: acknowledged/log-truncatable progress, redelivery counters, dead-letter transfer and delivery limits illustrate that bounded operational history and retry handling can intentionally discard or relocate transport records; broker disposition still does not prove business-effect settlement. https://www.rabbitmq.com/docs/quorum-queues
- Prior G4 effect composition, causal workflow, in-flight evolution, negotiation lifecycle and semantic-generation handoff findings.

These systems are benchmarks for recovery and retention boundaries only.

## 1. Recovery requires a semantic cut, not a complete event archive

The previous handoff research introduced a branch/invariant-scoped frontier. Recovery does not require retaining every transport event forever if a durable summary proves all facts needed to distinguish:

- what semantic generation/profile each surviving obligation belongs to;
- which predecessor relations still matter;
- which old-generation effect rights remain live, fenced, expired, transferred, settled or `UNKNOWN`;
- which joins remain unsatisfied;
- what authority/currentness basis governed admission and what basis is required for any new effect;
- which late messages/replays can still legitimately arrive.

Research candidate:

```text
RecoverableGenerationFrontier
  occurrenceRef
  frontierRevision
  branchSummaries[]
    branchRef
    semanticGenerationRef
    profileRef
    predecessorFloor
    pendingObligationRefs[]
    effectRightSummaries[]
    settlementDisposition
  invariantScopeSummaries[]
  joinSummaries[]
  authority/currentness evidence refs
  dedup/replay horizon refs
  unresolved UNKNOWN/conflict refs
  compactionBasisRef
```

This is research vocabulary, not a schema decision.

Invariant:

`Recoverable state != retained full history`.

A compacted frontier may replace detailed history only when the summary is sufficient to answer every still-live safety and recovery question.

## 2. Compaction is proof-preserving summarization, not deletion by age alone

Kafka and Pulsar demonstrate useful operational compaction, but their retention semantics cannot be imported as business semantics. Kafka explicitly permits tombstones to disappear after a configured horizon; a lagging consumer can then miss deletion evidence. etcd goes further by making old revisions explicitly inaccessible and telling a watcher that its requested revision has been compacted.

The G4 consequence is:

`Compaction must leave either sufficient proof or an explicit below-floor condition`.

A recovered participant must never infer `not seen` as `never existed` merely because detailed evidence was compacted.

Candidate dispositions for a reference below the retained frontier:

```text
RESOLVABLE_FROM_SUMMARY
RESOLVABLE_FROM_ARCHIVE
BELOW_COMPACTION_FLOOR_REVALIDATION_REQUIRED
BELOW_COMPACTION_FLOOR_REPLAY_FORBIDDEN
UNKNOWN
```

No adapter, gateway or driver may reconstruct missing semantic history from current defaults.

## 3. Four horizons must remain distinct

A single TTL is insufficient. At minimum, research should keep separate:

1. **Transport replay horizon** — how long a broker/log/file transport may redeliver or replay bytes.
2. **Deduplication horizon** — how long an effect/obligation identity remains directly recognized as duplicate.
3. **Semantic resolvability horizon** — how long old profile/generation/frontier meaning can still be interpreted or summarized safely.
4. **Authority/security horizon** — how long old evidence can authorize continuation or a new effect.

These may have different durations and failure policies.

`Dedup window expired != old obligation became new`.

If transport replay can outlive direct dedup state, the compacted frontier needs another durable lineage/fence mechanism or the transport must be unable to reintroduce the old obligation as admissible fresh work.

## 4. A checkpoint is complete only for the state it actually covers

Flink provides a strong precedent: a checkpoint can consistently capture operator state and source positions, but end-to-end exactly-once external effects require source/sink participation beyond the local snapshot.

Therefore:

`Checkpoint complete != external effects settled`.

A handoff recovery snapshot may compact branch scheduler/history state while still carrying `UNKNOWN` or pending settlement for external effects. Snapshot success cannot convert uncertain external side effects into absence or success.

For a multi-input join, the durable cut must represent each required input frontier or an equivalent proof-preserving summary. A single wall-clock timestamp is not a substitute for that partial-order cut.

## 5. Compaction floors are scoped, not global

The system need not retain one global minimum generation forever. A compaction floor can be scoped by occurrence, branch, invariant, contract/profile family or evidence class.

Candidate concept:

```text
CompactionFloor
  scopeRef
  floorRevision/frontierRef
  semanticSummaryRef
  retainedUnknowns[]
  replayDisposition
  validFrom
  basis/evidenceRef
```

`Compaction floor != security floor`.

A security floor can prohibit old effects while the semantic compaction floor still preserves historical interpretation. Conversely, detailed operational history may be compacted while a small security/fencing witness remains necessary longer.

## 6. Late delivery after compaction must fail closed or resolve through durable lineage

Adversarial sequence:

```text
1. obligation O admitted under S2
2. frontier advances and detailed S2 delivery history is compacted
3. a delayed transport replica/redrive emits O
4. current deployment default is S3
```

O must not become a fresh S3 obligation because its old delivery record disappeared. The receiver needs a stable obligation/effect identity resolvable against retained summary/fence evidence, or it must classify the arrival as below-floor/unknown and reject, quarantine or revalidate according to contract.

`Compacted delivery history != semantic re-admission`.

## 7. Tombstones and negative knowledge need explicit horizons

Kafka tombstones expose a general problem: negative knowledge itself has retention requirements. If a record saying "this right/obligation was revoked, consumed, transferred or deleted" disappears before every legitimate late observer is beyond the replay horizon, stale positive state can resurrect.

Candidate rule:

`Negative evidence may be compacted only after resurrection is impossible or another durable fence subsumes it`.

Examples include a monotonic fencing epoch, irreversible target-side settlement reference, expired cryptographic/authority capability, or a summary that dominates all earlier states. No particular mechanism is selected.

## 8. Recovery should prefer a snapshot-plus-tail model when qualified

A mature pattern across logs/checkpoints is to retain a durable snapshot/frontier plus the non-compacted tail needed to advance from it.

Implementation-independent hypothesis:

```text
Recovered handoff state
  = qualified frontier snapshot
  + post-frontier evidence tail
  + independently unresolved external-effect witnesses
```

The snapshot must bind its semantic generation/profile identities and partial-order frontier. The tail must not be replayed under mutable current defaults. External witnesses may outlive both when settlement remains independently unresolved.

This is not an event-sourcing requirement and does not make the Exchange Plane canonical business truth.

## 9. Compaction eligibility is dependency-based

A record becomes compactable not merely because it is old or acknowledged, but because no live proof obligation depends on its detailed form.

Candidate eligibility questions:

- Is every successor branch that depends on this predecessor represented in the retained frontier?
- Are conflicting old-generation effect rights fenced or represented as `UNKNOWN`?
- Can every legitimate late replay be recognized without this record?
- Has every required join either settled or retained a summary of the dependency?
- Is the normative profile/contract identity still resolvable independently?
- Are audit, privacy, legal-retention and erasure constraints satisfied?
- Does deletion of this detail preserve the ability to distinguish old work from new admission?

This deliberately separates semantic retention from blanket indefinite event retention.

## 10. Privacy and minimization still apply

Recovery evidence must remain purpose-qualified. Compaction is an opportunity to replace payload-rich operational history with minimal refs, hashes, dispositions, epochs and settlement witnesses when those are sufficient.

`Recovery requirement != retain business payload forever`.

Artifact bytes, sensitive payloads or cross-capability business entities should not be retained in the Exchange Plane merely because a frontier needs durable identity/provenance. Existing G4 evidence-minimization and privacy findings continue to govern.

## 11. Candidate proof obligations

1. A recovered handoff can distinguish every still-live obligation from fresh admission without relying on mutable deployment defaults.
2. Compaction never turns absence of retained detail into proof that an effect/right/obligation never existed.
3. Every compacted predecessor needed by a live join is represented by a sufficient summary or explicit unresolved state.
4. Old-generation conflicting effect rights are fenced/expired/transferred/settled or retained as `UNKNOWN` before their detailed evidence is discarded.
5. Late redelivery below the retained frontier is rejected, quarantined, revalidated or resolved through durable lineage; it is never silently re-admitted.
6. Transport replay, deduplication, semantic resolvability and authority/security horizons are explicit and independently qualified.
7. Dedup state is not compacted earlier than all possible replay paths unless a stronger durable fence/identity mechanism subsumes it.
8. Negative evidence cannot disappear while stale positive state can still legitimately reappear and produce an effect.
9. Snapshot completion does not imply settlement of external effects outside the snapshot's proof scope.
10. Recovery preserves `UNKNOWN`/conflicted dispositions rather than guessing from missing history.
11. A compacted frontier preserves the declared partial order needed for pending joins/invariants without inventing a global order.
12. Compaction floors are scoped and cannot silently become a platform-wide semantic revision.
13. Security-floor advancement may prohibit new effects independently of historical frontier compaction.
14. Semantic/profile identities referenced by retained summaries remain resolvable for the required interpretation horizon.
15. A participant starting below the compaction floor receives an explicit below-floor/recovery disposition rather than fabricated continuity.
16. Provider/broker/log retention policy cannot silently redefine semantic evidence retention.
17. Payload minimization/erasure can remove unnecessary content while preserving the minimal proof required for live safety obligations.
18. Local/in-process and distributed realizations use equivalent compaction/recovery semantics for the same contract.
19. Builder unavailability does not prevent autonomous runtime recovery when all declared runtime-local evidence dependencies are present.
20. Compaction/archival artifacts remain evidence/projections and never become canonical cross-capability business ownership.

## 12. Adversarial cases

- dedup entries expire in 24h but a broker/archive can replay an S2 command after seven days;
- a Kafka-like tombstone is removed before an offline consumer observes the revocation and stale state resurrects;
- queue ACK causes deletion even though an external side effect is still `UNKNOWN`;
- a checkpoint records source offsets but not the external sink's unsettled transaction/effect;
- one branch frontier is compacted before a mixed-generation join records its dependency;
- recovery loads the latest profile alias instead of the immutable profile pinned by the snapshot;
- old delivery history disappears and a retry is assigned a fresh S3 correlation/effect identity;
- compaction uses wall-clock age although a partitioned runtime remains within a legitimate replay horizon;
- a gateway treats `below compaction floor` as `not found` and proceeds;
- archived evidence exists but its normative semantics/profile reference was garbage-collected;
- negative/fencing evidence is deleted while an old provider credential remains usable;
- security policy revokes S2 but recovery mistakenly restores S2 effect authority from a historical snapshot;
- payload erasure removes the only value needed for dedup because identity was never separated from payload;
- privacy minimization is skipped and entire business payloads are retained forever for a one-bit settlement proof;
- transport migration shortens retention below the declared semantic replay horizon;
- broker failover restores messages older than the consumer's local dedup window;
- compaction of one lane is interpreted as proof that sibling lanes are equally advanced;
- a stale snapshot plus an incomplete tail produces false `HANDOFF_COMPLETE`;
- a recovered runtime contacts Builder to reconstruct frontier state even though runtime autonomy requires local recovery evidence;
- archive loss is silently interpreted as settled history rather than evidence loss/`UNKNOWN`.

## 13. Transport-independent decision criteria

A direct/local call may compact transient call detail quickly only when stable obligation/effect lineage and unresolved external effects remain recoverable under the same contract as remote realization.

RPC history may be discarded after response only when retries, downstream effects and settlement obligations are independently represented; a successful response is not a universal compaction certificate.

A queue/broker may delete acknowledged bytes according to transport policy, but semantic lineage/fencing evidence must outlive them when late redelivery, external settlement or dedup obligations require it.

A replayable stream may use log compaction/retention, but semantic recovery must explicitly define what a consumer below the retained frontier does.

A gateway/adapter may archive or translate evidence only if identity, generation, authority/currentness and lossiness remain explicit; it cannot reconstruct missing history from current policy.

## 14. Deduplication against existing G4 findings

This round does not reopen generic evidence minimization, privacy retention, effect composition, causal workflow, in-flight contract evolution, profile negotiation, negotiation-evidence lifecycle or the partial-order generation-handoff model.

Material delta is narrower: it defines the **recovery sufficiency boundary** for a partially completed generation handoff, separates **four retention horizons**, treats compaction as **proof-preserving summarization with explicit below-floor semantics**, and adds the requirement that **negative/fencing evidence outlive every path that could otherwise resurrect stale work**.

## 15. Portability and exit path

No Kafka compaction, Pulsar retention, etcd MVCC, Flink checkpoint, RabbitMQ log or event-sourcing mechanism is required. A provider/transport can be replaced when the replacement preserves or explicitly requalifies:

- recoverable branch/invariant frontier;
- immutable semantic/profile lineage;
- pending joins and partial-order dependencies;
- effect-right/fencing/settlement dispositions;
- replay/dedup/resolvability/security horizons;
- explicit below-compaction-floor behavior;
- retained `UNKNOWN`/conflict states;
- privacy/minimization and audit requirements.

If those cannot be preserved, replacement is a semantic recovery migration rather than transparent storage/transport substitution.

## 16. Maturity and next gap

Material delta: **YES**.

This subfront is materially stronger but not saturated. The next highest-value gap is **cross-runtime frontier transfer and disaster recovery under independent retention domains**: determine how a runtime proves a compacted frontier to a replacement host/region or autonomous peer when their replay windows, archives and security floors differ, without turning a shared archive/Builder into mandatory runtime authority or accepting an incomplete frontier as current truth.

No implementation authority follows from this document.