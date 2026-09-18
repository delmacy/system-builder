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
- Data Treatment: **deep evidence consolidation now covers temporal/streaming/replay, temporal identity/interpretation revision, and retention/erasure/reproducibility boundaries**. Material findings include multidimensional time, scoped processing guarantees, correction/retraction, replay/backfill convergence, merge/split identity lineage, pinned-vs-current interpretation, finite reproducibility envelopes, distributed erasure convergence, derived-data deletion impact, backup restore reconciliation and explicit holds/exceptions. Other treatment vectors still require deep consolidation; family remains `RESEARCH_ACTIVE`, not saturated.
- Infrastructure Engineering: **first deep evidence consolidation completed for control-loop safety and failure semantics**. Provider/host/storage/workload/application/network/observability health are separated; heartbeat/lease freshness is not death/authority proof; reconciliation/retry requires bounded effect-aware policies; overload/retry amplification, graceful degradation, disruption envelopes, failover capacity/fencing and post-disruption effectiveness are explicit proof surfaces. Still `RESEARCH_ACTIVE`, not saturated.
- Computational Core/Performance: consolidated initial architecture and qualification rules captured; workload benchmarks not yet materialized.
- Lifecycle/Continuous Improvement: first deep evidence consolidation completed for incident/postmortem/action separation, work hierarchy vs semantic graph, multidimensional closure, outcome/effectiveness measurement and lesson lineage. Still `RESEARCH_ACTIVE`, not saturated.
- Self-Hosting/Autonomic Evolution: first deep evidence consolidation completed for secure update trust, generation consistency, version skew, anti-rollback vs recovery, state/schema rollback, promotion evidence, reboot identity and failed-update-loop containment. Still `RESEARCH_ACTIVE`, not saturated.
- Product UX/AI-native Builder: initial product R&D program captured; deeper usability research remains open.

## Material research log

### 2026-09-18 — Infrastructure control-loop safety, health decomposition and disruption semantics

Evidence classes: mature declarative controller/lease/disruption behavior (Kubernetes), provider-separated infrastructure health checks (Amazon EC2), and production retry/overload/degradation engineering (Google SRE and Amazon Builders' Library).

Material delta:

- separated provider, host, storage, workload, application, network and observability health rather than collapsing them into one status;
- established heartbeat/lease as freshness-qualified evidence, not proof of semantic health, death or safe replacement;
- required bounded controllers to declare semantic ownership, actuation boundary, currentness/convergence requirements and restart-safe operation identity;
- introduced research candidate `RetryEnvelope` with effect/idempotency semantics, attempt budget, deadline, backoff, jitter, overload disposition and reconcile-on-UNKNOWN behavior;
- made retry amplification/thundering-herd behavior an explicit control-plane adversarial surface;
- separated degraded serving from full effectiveness and capacity presence from safe usable headroom;
- introduced provider-neutral `DisruptionEnvelope` semantics for voluntary maintenance while preserving that involuntary failures can consume availability outside the budget;
- strengthened reboot proof to require layered provider/host/storage/workload/application evidence after return;
- modeled failover as a governed topology/state transition requiring target capacity/state eligibility and source fencing/reconciliation where effects may continue;
- made RPO/RTO and recovery readiness evidence-backed claims rather than configuration truth.

No Kubernetes, AWS, orchestrator, host-agent architecture or cloud provider was selected as canonical.

Next highest-value infrastructure gaps: fencing/leases/split-brain under partial connectivity, cross-site autonomy/delayed reconciliation, disconnected PKI bootstrap/rotation, heterogeneous capacity modeling, storage durability/restore proof, supply-chain-to-running-artifact identity and decommission residual proof. Cross-family priority may supersede these.

### 2026-09-18 — Retention, erasure and reproducibility boundaries

Evidence classes: data-protection regulation, provenance standard and mature snapshot/time-travel lifecycle behavior (EU GDPR Article 17, W3C PROV, Apache Iceberg).

Material delta:

- established that audit/replay requirements do not imply infinite retention and that governed erasure may legitimately reduce future reproducibility;
- separated logical visibility, semantic invalidation, physical erasure and recovery disposition;
- modeled erasure as population-qualified distributed convergence rather than primary-store delete ACK;
- required residual provenance/disposition evidence to be minimized and non-reconstructive under applicable policy rather than assuming metadata/hashes/embeddings are harmless;
- introduced candidate `ReproducibilityEnvelope` so historical replay capability has explicit retention horizons for source and interpretation dependencies;
- required derived-data lineage to support erase/rebuild/invalidate impact across search, graph, vector, cache, aggregate and model-feature surfaces;
- established `Restored backup != authorized resurrection of erased data` and requires post-restore erasure reconciliation before authoritative promotion where applicable;
- made retention holds/exceptions explicit governed authority with scope, permitted use and lifecycle;
- linked merge/split identity lineage to deletion-scope reasoning without treating historical same-subject assertions as permanent identity equivalence;
- prohibited replay/backfill from silently republishing intentionally erased data.

No privacy platform, provenance store, lakehouse, event-sourcing architecture or jurisdiction-specific policy engine was selected as canonical.

Next highest-value gaps: cross-region/offline erasure convergence, cryptographic erasure/key lifecycle, immutable/signed evidence under retention holds, and adversarial replay/restore/delete proofs. Cross-family priority may supersede these based on comparative maturity.

### 2026-09-18 — Temporal identity, merge/split lineage and replay interpretation

Evidence classes: provenance standard, mature cross-record identity-link semantics and snapshot/schema time-travel behavior (W3C PROV, HL7 FHIR, Apache Iceberg).

Material delta: separated source-record identity from subject identity and resolution revision; preserved merge/split lineage; required impact/reconciliation after split; separated source snapshot from interpretation snapshot; introduced `InterpretationContext`; distinguished forensic reproduction, current reinterpretation and controlled mixed replay; required degraded/inconclusive reproducibility when historical interpretation dependencies are unavailable; and required derived generations to preserve interpretation/treatment lineage.

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
- no decision to introduce a graph database, vector database, search cluster, stream broker or Kubernetes;
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
