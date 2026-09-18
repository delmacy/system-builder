# G4 Research State — System Builder Product R&D

Date: 2026-09-18
Status: `RESEARCH_ACTIVE / NON_EXECUTABLE`
Execution authority: NONE

## Purpose

Generation 4 is the product R&D layer that follows G3 architectural closure. G3 defines the implementation-independent semantic/operational substrate; G4 studies how the System Builder product should realize that substrate with usable interaction, measurable performance, robust data/infrastructure engineering, controlled lifecycle management and bounded self-management.

G4 does not reopen G3 and does not authorize implementation, WBS, Work Packages, Sprints, TASKs, migrations or provider adoption.

## Current research families

1. Product UX, Living Canvas & AI-native Builder interaction.
2. Computational Core & Performance Engineering.
3. Data, Persistence, Access & Infrastructure Access Engineering.
4. Data Treatment Engineering.
5. Infrastructure Engineering & Control Plane R&D.
6. Engineering Lifecycle, Product Change & Continuous Improvement.
7. Self-Hosting, Autonomic Control & Bounded Self-Evolution.

These families may later be deduplicated or recomposed. A research family is not automatically a product module.

## Cross-cutting rules

- `G3 semantic decision != G4 technology binding`.
- `Research candidate != implementation authority`.
- `Polyglot-ready != Polyglot-from-day-one`.
- `Measured bottleneck -> qualified specialization candidate`.
- `Technology preference -> no migration authority`.
- `Builder != Runtime`; published client runtimes remain autonomous.
- `Projection/index/cache/vector/telemetry != canonical truth`.
- `Provider ACK != effective state`.
- `AI inference != authority`.
- self-management must remain governed, reversible and externally recoverable.
- every durable technology binding requires an exit/migration path compatible with anti-lock-in goals.
- `Temporal history != infinite retention`.
- `Auditability != immutable personal data forever`.
- intentional governed erasure may legitimately reduce future reproducibility, but must not be disguised as successful replay or silently rewritten history.
- `Heartbeat/lease freshness != proof of semantic health or safe replacement`.
- `Retry != resilience by default`; retries consume capacity and can amplify failure.
- `Voluntary disruption budget != availability guarantee`.
- `Lease expiry != fencing`; stale actors may remain physically capable of producing effects.
- `Leadership != universal authority`; authority remains scope/epoch/effect-boundary qualified.
- `Coordination quorum != exclusive downstream reachability`.

## Research progression

```text
G3 CLOSED/FROZEN
      |
      v
G4 research inventory
      |
      v
workload / user / operational evidence
      |
      v
benchmarks + prototypes + failure cases
      |
      v
implementation-independent product architecture
      |
      v
provider/technology comparison
      |
      v
explicit planning authorization
      |
      v
WBS / Work Packages / implementation
```

## Current maturity

- Data/Persistence/Access: substantial backlog captured; deep evidence consolidation still required.
- Data Treatment: **deep evidence consolidation covers temporal/streaming/replay, temporal identity/interpretation revision, and retention/erasure/reproducibility boundaries**. Material findings include multidimensional time, scoped processing guarantees, correction/retraction, replay/backfill convergence, merge/split identity lineage, pinned-vs-current interpretation, finite reproducibility envelopes, distributed erasure convergence, derived-data deletion impact, backup restore reconciliation and explicit holds/exceptions. Other treatment vectors still require deep consolidation; family remains `RESEARCH_ACTIVE`, not saturated.
- Infrastructure Engineering: **two deep evidence consolidations completed**. Control-loop safety now covers decomposed health, leases/currentness, bounded retries, overload, disruption, failover and recovery evidence. Coordination safety now separates leadership, lease, fencing and downstream effect authority; models partial-connectivity split-brain, authority epochs, revision-qualified watch/reconnect, mixed-version leadership eligibility and stale-work quarantine. Still `RESEARCH_ACTIVE`, not saturated.
- Computational Core/Performance: consolidated initial architecture and qualification rules captured; workload benchmarks not yet materialized.
- Lifecycle/Continuous Improvement: first deep evidence consolidation completed for incident/postmortem/action separation, work hierarchy vs semantic graph, multidimensional closure, outcome/effectiveness measurement and lesson lineage. Still `RESEARCH_ACTIVE`, not saturated.
- Self-Hosting/Autonomic Evolution: first deep evidence consolidation completed for secure update trust, generation consistency, version skew, anti-rollback vs recovery, state/schema rollback, promotion evidence, reboot identity and failed-update-loop containment. Still `RESEARCH_ACTIVE`, not saturated.
- Product UX/AI-native Builder: initial product R&D program captured; deeper usability research remains open.

## Material research log

### 2026-09-18 — Infrastructure fencing, leadership and split-brain safety

Evidence classes: Kubernetes Lease/leader-election semantics, etcd revision/transaction/watch guarantees, and distributed-systems fencing analysis.

Material delta:

- separated elected leadership from global semantic/effect authority;
- separated lease expiry from downstream fencing and required stale-epoch rejection at the effect sink or an authoritative mediation boundary for correctness-sensitive exclusive effects;
- introduced research candidates `LeadershipEpoch`, `FencingToken` and compatibility-qualified `LeadershipEligibility`;
- established that quorum possession and downstream resource reachability are independent under partial connectivity;
- defined split-brain operationally as multiple actors plausibly capable of incompatible exclusive effects, not merely duplicate leaders in one coordination database;
- required coordination observations to retain revision/currentness semantics and rejected watch delivery as a substitute for authoritative current reads;
- required reconnect after history loss/compaction to reconcile before correctness-sensitive actuation;
- linked rolling-upgrade leadership eligibility to protocol/semantic/state compatibility without merging Infrastructure and Self-Hosting ownership;
- required authority loss to bound/stop new globally exclusive mutation while preserving autonomous runtimes and explicitly permitted degraded/local non-exclusive behavior;
- required rejoining actors to quarantine stale queued work and reconcile UNKNOWN/in-flight effects before resuming authority-bound actuation.

No Kubernetes, etcd, consensus implementation, distributed-lock library or cloud provider was selected as canonical.

Next highest-value infrastructure gaps: cross-site autonomy/delayed reconciliation after long partitions, disconnected PKI bootstrap/rotation, heterogeneous capacity modeling, storage durability/restore proof, supply-chain-to-running-artifact identity, decommission residual proof and classification of effect sinks by fencing capability/compensability. Cross-family priority may supersede these.

### 2026-09-18 — Infrastructure control-loop safety, health decomposition and disruption semantics

Evidence classes: mature declarative controller/lease/disruption behavior (Kubernetes), provider-separated infrastructure health checks (Amazon EC2), and production retry/overload/degradation engineering (Google SRE and Amazon Builders' Library).

Material delta: separated provider/host/storage/workload/application/network/observability health; established heartbeat/lease as freshness evidence rather than death/authority proof; introduced bounded `RetryEnvelope`; made retry amplification explicit; separated degraded serving from full effectiveness; introduced provider-neutral disruption semantics; strengthened reboot proof; modeled failover as governed topology transition; and made RPO/RTO evidence-backed claims.

### 2026-09-18 — Retention, erasure and reproducibility boundaries

Evidence classes: data-protection regulation, provenance standard and mature snapshot/time-travel lifecycle behavior (EU GDPR Article 17, W3C PROV, Apache Iceberg).

Material delta: rejected infinite-retention assumptions; separated logical visibility, semantic invalidation, physical erasure and recovery disposition; modeled erasure as distributed convergence; introduced `ReproducibilityEnvelope`; required derived-data erasure impact; required post-restore erasure reconciliation; made holds explicit authority; linked identity lineage to deletion scope; and prohibited replay/backfill from silently republishing erased data.

### 2026-09-18 — Temporal identity, merge/split lineage and replay interpretation

Evidence classes: W3C PROV, HL7 FHIR and Apache Iceberg.

Material delta: separated source-record identity from subject identity and resolution revision; preserved merge/split lineage; required impact/reconciliation after split; separated source snapshot from interpretation snapshot; introduced `InterpretationContext`; distinguished forensic reproduction, current reinterpretation and controlled mixed replay; and required derived generations to preserve interpretation/treatment lineage.

### 2026-09-18 — Temporal, streaming and replay semantics

Evidence classes: Apache Beam, Apache Flink, Apache Kafka, Debezium and PostgreSQL.

Material delta: separated temporal dimensions; rejected watermark as absolute completeness; scoped exactly-once guarantees; introduced replay context; required live/backfill convergence; preserved CDC/outbox vs canonical/effective-state boundaries; scoped ordering; and required declared temporal perspective for historical queries.

### 2026-09-18 — Lifecycle learning and improvement-effectiveness semantics

Evidence classes: Google SRE, DORA and GitHub Issues.

Material delta: separated incident/postmortem/findings/actions/work; distinguished hierarchy from N:N lifecycle graph; introduced multidimensional closure and `ImprovementEffectEvidence`; preserved `INCONCLUSIVE`; added lesson lineage/supersession and proof obligations for review authority/effectiveness/AI non-authority.

### 2026-09-17 — Self-hosting secure-update protocol foundations

Evidence classes: TUF, Uptane, Kubernetes and systemd.

Material delta: separated authenticity from update authorization; introduced threshold/role-separated root trust, complete-generation consistency, anti-rollback vs recovery distinction, compatibility/skew envelopes, durable-state rollback obligations, layered promotion evidence, reboot identity and external failed-update-loop containment.

## Non-goals at this stage

- no decision to rewrite the Builder in Rust;
- no decision to introduce a graph database, vector database, search cluster, stream broker, etcd or Kubernetes;
- no decision to make the Builder an operating system;
- no autonomous self-modification without external trust/recovery boundaries;
- no replacement of the current G2 execution plan;
- no G4 implementation before explicit planning authorization.

## Closure target for G4 research

G4 research should eventually produce:

1. a deduplicated product capability map;
2. workload and interaction profiles;
3. performance and scale budgets;
4. data/infrastructure/lifecycle/self-hosting proof obligations;
5. implementation-independent target product architecture;
6. technology/provider qualification matrices;
7. prototype evidence for high-risk interaction or performance choices;
8. G3 -> G4 traceability;
9. gap against the then-current System Builder;
10. a planning handoff, without materializing work automatically.
