# G4 Research State — System Builder Product R&D

Date: 2026-09-18
Status: `RESEARCH_ACTIVE / NON_EXECUTABLE`
Execution authority: NONE

## Purpose

Generation 4 follows G3 architectural closure and studies how the System Builder product should realize that semantic substrate with usable interaction, measurable performance, robust data/infrastructure engineering, controlled lifecycle management, bounded self-management and interoperable capability boundaries. G4 does not reopen G3 and does not authorize implementation, WBS, Work Packages, Sprints, TASKs, migrations or provider adoption.

## Current research families

1. Product UX, Living Canvas & AI-native Builder interaction.
2. Computational Core & Performance Engineering.
3. Data, Persistence, Access & Infrastructure Access Engineering.
4. Data Treatment Engineering.
5. Infrastructure Engineering & Control Plane R&D.
6. Engineering Lifecycle, Product Change & Continuous Improvement.
7. Self-Hosting, Autonomic Control & Bounded Self-Evolution.
8. Shared Semantic Kernel / Capability Exchange Plane / Inter-Capability Boundary Model.

These families may later be deduplicated or recomposed. A research family is not automatically a product module.

## Cross-cutting rules

- `G3 semantic decision != G4 technology binding`.
- `Research candidate != implementation authority`.
- `Polyglot-ready != Polyglot-from-day-one`.
- `Measured bottleneck -> qualified specialization candidate`.
- `Builder != Runtime`; published client runtimes remain autonomous.
- `Projection/index/cache/vector/telemetry != canonical truth`.
- `Provider ACK != effective state`.
- `AI inference != authority`.
- `Self-managing != unrestricted self-modifying`.
- `Temporal history != infinite retention` and `Auditability != immutable personal data forever`.
- `Heartbeat/lease freshness != proof of semantic health or safe replacement`.
- `Retry != resilience by default`.
- `Lease expiry != fencing`; `Leadership != universal authority`.
- `Geometric zoom != semantic zoom`; `Progressive disclosure != authorization`.
- `Explore != Design != Simulate != Propose != Authorize != Act != Verify`.
- `Preview passed != production will succeed`.
- `Fluent AI explanation != correctness/evidence/authority`.
- `Fast kernel != fast operation`; `Microbenchmark win != product workload win`.
- `WASM/native/worker availability != specialization authority`.
- `Shared primitives != shared business ownership`.
- `Logical Exchange Plane != single broker`.
- `Interface compatibility != contract compatibility`.
- `Driver may normalize mechanism but must not fabricate semantic equivalence`.
- `Exchange Plane owns exchange semantics; capability owns business semantics`.
- `Schema compatibility != semantic contract compatibility`.
- `Correlation/trace context != identity or authority proof`.
- `Message/broker acceptance != consumer/business effect`.
- `Cross-capability reference != ownership transfer`.
- `Compatibility is multidimensional`; schema/version acceptance cannot stand in for semantic, authority, currentness, delivery/effect, ordering, error, deadline or evidence compatibility.
- `Provider advertisement != qualification proof`; `Version overlap != guarantee overlap`.
- `Binding substitution != semantic equivalence by default`.
- `Transport reconnected != semantic convergence`.
- `Backlog present != backlog executable`.
- `Replication checkpoint != business convergence`.
- `Deterministic technical winner != business truth`.
- `Offline autonomy != indefinite delegated authority`.
- `Metadata/data/authorization convergence are separate proof domains`.
- `Trace/correlation != business causation != authority`.
- `Workflow progress != transport progress`.
- `Compensation != rollback/time reversal`; compensation is a new governed business effect.
- `Reconnect order != causal/business order`.
- `Orchestration/choreography != Exchange Plane ownership`.
- `Cancel requested != downstream effect cancelled`.

## Research progression

```text
G3 CLOSED/FROZEN
 -> G4 research inventory
 -> workload / user / operational evidence
 -> benchmarks + prototypes + failure cases
 -> implementation-independent product architecture
 -> provider/technology comparison
 -> explicit planning authorization
 -> WBS / Work Packages / implementation
```

## Current maturity

- **Data/Persistence/Access:** first deep evidence consolidation completed for authorization-aware data access. Authorization is part of query semantics; data currentness and authorization currentness are independent; RLS/provider controls remain enforcement layers. Long-running revocation/currentness and empirical search/list/graph/vector leakage tests remain open. `RESEARCH_ACTIVE`, not saturated.
- **Data Treatment:** deep evidence consolidation covers temporal/streaming/replay, temporal identity/interpretation revision and retention/erasure/reproducibility. Other treatment vectors remain open. `RESEARCH_ACTIVE`, not saturated.
- **Infrastructure Engineering:** two deep evidence consolidations cover decomposed health/control-loop safety and leadership/lease/fencing/split-brain coordination. `RESEARCH_ACTIVE`, not saturated.
- **Computational Core/Performance:** first deep evidence consolidation covers workload envelopes, TypeScript/Node baseline instrumentation, worker/serialization boundaries, specialization crossover, native isolation and WASM qualification. Representative SB empirical benchmarks remain absent. `RESEARCH_ACTIVE`, not saturated.
- **Lifecycle/Continuous Improvement:** first deep evidence consolidation covers incident/postmortem/action separation, semantic lifecycle graph, multidimensional closure and improvement-effect evidence. `RESEARCH_ACTIVE`, not saturated.
- **Self-Hosting/Autonomic Evolution:** first deep evidence consolidation covers secure update trust, generation consistency, version skew, anti-rollback/recovery, durable-state rollback, promotion evidence and failed-update-loop containment. `RESEARCH_ACTIVE`, not saturated.
- **Product UX/AI-native Builder:** first deep evidence consolidation covers semantic zoom, lens composition, disclosure security, Explore-to-Act separation, Preview fidelity, evidence-linked AI, accessibility and interaction workloads. User/task research and empirical prototypes remain open. `RESEARCH_ACTIVE`, not saturated.
- **Shared Semantic Kernel / Capability Exchange Plane:** **five deep evidence consolidations completed**: (1) minimal shared structural kernel and exchange-boundary vocabulary; (2) multidimensional contract compatibility/negotiation; (3) same-contract fixtures, delayed-command authority/currentness, ambiguous timeout/retry/effect, replay/dead-letter semantics; (4) federated long-partition/reconnect reconciliation; and (5) cross-capability causal/workflow/saga semantics. The fifth consolidation separates durable business causation from trace/correlation, workflow progress from transport progress, compensation from rollback, and orchestration/choreography from Exchange Plane ownership; it adds causal-frontier, pivot/irreversibility, cancellation races and in-flight authority/contract revision proof domains. `RESEARCH_ACTIVE`, not saturated.

## Material research log

### 2026-09-18 — Cross-capability causal consistency, saga/workflow and compensation

Evidence classes: AWS Prescriptive Guidance saga orchestration/choreography; Azure Architecture Center Saga and Compensating Transaction patterns; W3C Trace Context; OpenTelemetry context propagation/baggage; prior G4 temporal/federation findings.

Material delta:

- separated business process/saga ownership from Exchange Plane routing and delivery semantics;
- separated correlation, trace lineage, durable business causation, workflow occurrence identity and authority;
- required business causation needed for replay/compensation/audit to survive telemetry sampling/retention independently;
- modeled long-lived workflow progress separately from broker/transport backlog progress;
- treated compensation as a new domain-specific governed effect that can fail, race with concurrent work and require human reconciliation;
- introduced pivot/irreversibility qualification and forward-recovery semantics rather than fictional rollback;
- introduced a `CausalFrontier` research hypothesis for partition/reconnect without claiming a global serializable transaction;
- required reconnect to reconcile predecessor/effect evidence before workflow continuation;
- kept orchestration and choreography as business coordination patterns above the Exchange Plane;
- added cancellation/supersession races and mid-workflow authority/contract revision as explicit adversarial/proof domains;
- preserved autonomous runtime behavior and prohibited trace/baggage from becoming identity/authority proof.

No workflow engine, saga framework, broker, tracing stack or orchestration topology was selected.

Highest-value remaining gap: in-flight workflow definition/contract migration and causal-history compaction under finite retention/erasure, including retired compensation contracts without indefinite preservation of executable historical code or sensitive payloads.

### 2026-09-18 — Federated exchange after long partitions and reconnect

Evidence classes: Apache CouchDB disconnected replication/conflict model; Apache Kafka MirrorMaker 2 cross-cluster replication/checkpoints/configuration; Azure Service Bus/Event Hubs geo-replication, failover, checkpoint and RBAC behavior.

Material delta:

- established `Transport reconnected != semantic convergence` and separated data, exchange, authority, contract and topology convergence;
- proposed partition/reconnect lineage and scoped high-water/checkpoint evidence without selecting a protocol;
- required reconnect negotiation/reconciliation before backlog drain;
- classified backlog into safe fact import, reinterpret/revalidate, stale intent, conflict, incompatibility, quarantine, UNKNOWN or effect eligibility rather than generic replay;
- preserved disconnected divergent histories and prohibited deterministic storage winners/last-write-wins from becoming business truth by default;
- required authority-sensitive queued work to revalidate after partition unless explicit durable delegation says otherwise;
- required old-revision queued work to qualify against current contract/provider guarantees before mediation/effect;
- separated endpoint/topology continuity from semantic identity, state continuity and authority continuity;
- assigned exchange-state classification/evidence to the Exchange Plane while retaining business merge/effect authority in the owning capability;
- added federation adversarials for stale revocation, duplicate effects, checkpoint drift, metadata-without-data convergence, data-without-RBAC convergence, clock divergence, replication-agent configuration races, failover duplicates and erasure resurrection.

No federation protocol, broker, conflict-resolution algorithm or replication technology was selected.

### 2026-09-18 — Time-separated exchange fixtures and queued-command validity

Evidence classes: gRPC deadlines; RabbitMQ TTL/dead-lettering; Kafka transaction boundaries; Amazon EventBridge replay.

Material delta: same-contract fixtures now observe caller result, transport evidence, authoritative effect and reconciliation; delayed command validity is separate from TTL; effect-time authority/currentness revalidation is explicit; ambiguous timeout/retry/external-effect is mandatory; replay is a new qualified delivery context; dead-letter is unresolved exchange disposition; dedup retention is reasoned against duplicate/replay horizon.

### 2026-09-18 — Capability Exchange contract compatibility and negotiation

Evidence classes: schema-registry compatibility; AsyncAPI/CloudEvents bindings; HTTP idempotency; gRPC deadlines; RabbitMQ confirms; Kafka idempotence/transactions.

Material delta: compatibility became a multidimensional guarantee vector; `RequiredContractProfile` is compared to `ProviderOffer`; version/schema acceptance is separated from semantic qualification; transport substitution is classified; mediation must disclose preserved/degraded/unsupported semantics; schema/contract/provider registries are distinct responsibilities; common semantic fixtures are the candidate portability proof.

### 2026-09-18 — Shared Semantic Kernel / Capability Exchange Plane foundations

Evidence classes: DDD/ACL; Ports & Adapters; CloudEvents; AsyncAPI; gRPC; Kafka; RabbitMQ; transactional outbox; Envoy; schema registries.

Material delta: minimal shared structural kernel; logical non-central Exchange Plane; explicit role vocabulary; interaction taxonomy; exchange envelope; semantic mediation/lossiness; ACK/delivery/effect separation; authorization/currentness/rate/backpressure propagation; autonomous runtimes without mandatory central broker/ESB.

### 2026-09-18 — Authorization-aware data access

Authorization moved into query semantics; `DISCOVER/READ/TRAVERSE/EXPORT/MUTATE` are distinguished; authorization currentness is independent from data currentness; storage-native controls are defense-in-depth; list/search/graph/vector authorization is distinct from point checks.

### 2026-09-18 — Computational Core baseline qualification

End-to-end workload envelope; optimization ladder before specialization; worker boundary costs; workload-specific specialization crossover; native in-process vs daemon/service isolation; WASM portability/sandbox separated from speed.

### 2026-09-18 — Product UX semantic zoom, AI interaction and Preview safety

Semantic vs geometric zoom; bounded Canvas materialization; lens semantics; progressive-disclosure security; Explore-to-Act separation; Preview fidelity classes; evidence-linked AI; accessibility and interaction-workload budgets.

### 2026-09-18 — Infrastructure fencing, leadership and split-brain safety

Leadership separated from effect authority; lease expiry separated from fencing; authority epochs/fencing; quorum vs downstream reachability; revision-qualified reconnect and stale-work quarantine.

### 2026-09-18 — Infrastructure control-loop safety

Provider/host/storage/workload/application/network health separation; heartbeat currentness; bounded retries; overload; disruption envelope; reboot proof; governed failover; evidence-backed RPO/RTO.

### 2026-09-18 — Retention, erasure and reproducibility

Finite retention; distributed erasure convergence; reproducibility envelope; derived-data erasure; restore reconciliation; explicit holds; replay/backfill cannot silently republish erased data.

### 2026-09-18 — Temporal identity and replay interpretation

Source identity vs subject identity/resolution revision; merge/split lineage; source snapshot vs interpretation snapshot; forensic reproduction vs current reinterpretation.

### 2026-09-18 — Temporal, streaming and replay semantics

Multidimensional time; watermark limitations; scoped exactly-once; replay context; live/backfill convergence; CDC/outbox boundaries; scoped ordering.

### 2026-09-18 — Lifecycle learning and improvement effectiveness

Incident/postmortem/findings/actions separation; hierarchy vs N:N lifecycle graph; multidimensional closure; improvement-effect evidence; lesson lineage/supersession.

### 2026-09-17 — Self-hosting secure-update foundations

Authenticity vs update authorization; threshold/root trust; generation consistency; anti-rollback vs recovery; compatibility/skew; state/schema rollback; promotion evidence; reboot identity; failed-update-loop containment.

## Non-goals

- no Rust rewrite decision;
- no graph/vector/search/stream/service-mesh/central-exchange/etcd/Kubernetes adoption decision;
- no workflow/saga engine adoption decision;
- no decision to make Builder an operating system;
- no unrestricted autonomous self-modification;
- no shared business model/database for integration convenience;
- no mandatory central broker/ESB;
- no G4 implementation before explicit planning authorization.

## Closure target

G4 should eventually produce a deduplicated capability map; workload/interaction profiles; performance/scale budgets; proof obligations; implementation-independent target product architecture; provider qualification matrices; prototype evidence for high-risk choices; G3->G4 traceability; gap against current SB; and a planning handoff without automatically materializing implementation work.
