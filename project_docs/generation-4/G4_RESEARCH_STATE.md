# G4 Research State — System Builder Product R&D

Date: 2026-09-18
Status: `RESEARCH_ACTIVE / NON_EXECUTABLE`
Execution authority: NONE

## Purpose

Generation 4 is the product R&D layer that follows G3 architectural closure. G3 defines the implementation-independent semantic/operational substrate; G4 studies how the System Builder product should realize that substrate with usable interaction, measurable performance, robust data/infrastructure engineering, controlled lifecycle management, bounded self-management and interoperable capability boundaries.

G4 does not reopen G3 and does not authorize implementation, WBS, Work Packages, Sprints, TASKs, migrations or provider adoption.

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
- `Geometric zoom != semantic zoom`; large canonical models should not imply render-all interfaces.
- `Progressive disclosure != authorization`; disclosure must be enforced across graph/search/count/AI paths.
- `Explore != Design != Simulate != Propose != Authorize != Act != Verify`.
- `Preview passed != production will succeed`; preview fidelity and substitutions must be explicit.
- `Fluent AI explanation != correctness/evidence/authority`.
- `Fast kernel != fast operation`; performance qualification includes query/I/O/serialization/queue/memory/GC/boundary costs.
- `Microbenchmark win != product workload win`.
- `WASM/native/worker availability != specialization authority`; a measured workload crossover and portability/rollback proof are required.
- `Shared primitives != shared business ownership`.
- `Logical Exchange Plane != single broker`.
- `Interface compatibility != contract compatibility`.
- `Driver may normalize mechanism but must not fabricate semantic equivalence`.
- `Exchange Plane owns exchange semantics; capability owns business semantics`.
- `Schema compatibility != semantic contract compatibility`.
- `Correlation/trace context != identity or authority proof`.
- `Message/broker acceptance != consumer/business effect`.
- `Cross-capability reference != ownership transfer`.

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

- Data/Persistence/Access: **first deep evidence consolidation completed** for authorization-aware data access. Authorization is now treated as part of query semantics rather than a post-filter; data currentness and authorization currentness are independent; RLS/provider controls remain enforcement layers rather than global semantic authority. Long-running revocation/currentness and empirical search/list/graph/vector leakage tests remain open. Family is `RESEARCH_ACTIVE`, not saturated.
- Data Treatment: **deep evidence consolidation covers temporal/streaming/replay, temporal identity/interpretation revision, and retention/erasure/reproducibility boundaries**. Material findings include multidimensional time, scoped processing guarantees, correction/retraction, replay/backfill convergence, merge/split identity lineage, pinned-vs-current interpretation, finite reproducibility envelopes, distributed erasure convergence, derived-data deletion impact, backup restore reconciliation and explicit holds/exceptions. Other treatment vectors still require deep consolidation; family remains `RESEARCH_ACTIVE`, not saturated.
- Infrastructure Engineering: **two deep evidence consolidations completed**. Control-loop safety covers decomposed health, leases/currentness, bounded retries, overload, disruption, failover and recovery evidence. Coordination safety separates leadership, lease, fencing and downstream effect authority; models partial-connectivity split-brain, authority epochs, revision-qualified watch/reconnect, mixed-version leadership eligibility and stale-work quarantine. Still `RESEARCH_ACTIVE`, not saturated.
- Computational Core/Performance: **first deep evidence consolidation completed** for end-to-end workload envelopes, TypeScript/Node baseline instrumentation, worker/serialization boundaries, specialization crossover economics, native ABI/isolation trade-offs and WASM/parallelism qualification. Representative SB workload fixtures and empirical benchmarks are still absent; family remains `RESEARCH_ACTIVE`, not saturated.
- Lifecycle/Continuous Improvement: first deep evidence consolidation completed for incident/postmortem/action separation, work hierarchy vs semantic graph, multidimensional closure, outcome/effectiveness measurement and lesson lineage. Still `RESEARCH_ACTIVE`, not saturated.
- Self-Hosting/Autonomic Evolution: first deep evidence consolidation completed for secure update trust, generation consistency, version skew, anti-rollback vs recovery, state/schema rollback, promotion evidence, reboot identity and failed-update-loop containment. Still `RESEARCH_ACTIVE`, not saturated.
- Product UX/AI-native Builder: **first deep evidence consolidation completed** for semantic zoom/multiscale materialization, lens composition, disclosure/security, Explore-to-Act mode separation, Preview fidelity, evidence-linked AI proposal interaction, accessibility and interaction-workload performance. Still `RESEARCH_ACTIVE`, not saturated; user-role/task research and empirical prototypes remain open.
- Shared Semantic Kernel / Capability Exchange Plane: **first deep evidence consolidation completed**. Research now separates capability business ownership from shared structural primitives; contract from interface/provider/binding/driver/adapter/gateway/controller; interaction semantics from transport; schema compatibility from semantic contract compatibility; and transport/broker acceptance from business effect. A logical exchange plane is supported as a hypothesis, not a central broker/module mandate. Family remains `RESEARCH_ACTIVE`, not saturated.

## Material research log

### 2026-09-18 — Shared Semantic Kernel / Capability Exchange Plane foundations

Evidence classes: DDD/Anti-Corruption Layer practice; CloudEvents; AsyncAPI 3; gRPC retry/status semantics; Kafka delivery/transaction boundaries; RabbitMQ confirms/acknowledgements; transactional outbox; Envoy circuit breaking/external authorization; mature schema-registry compatibility models.

Material delta:

- established a research hypothesis for a minimal `Shared Semantic Kernel` containing only unusually stable cross-cutting structural primitives, with explicit exclusion of domain-owned business entities;
- established `Capability Exchange Plane` as a logical responsibility set for exchange semantics, routing/binding, policy context, delivery/currentness/provenance/evidence/reconciliation, explicitly not a required broker/process/ESB or business semantic owner;
- proposed `Capability Core -> Ports -> Contracts -> Exchange Policies -> Exchange Plane -> Binding/Transport -> Target Boundary` without framework binding;
- separated Capability, Contract, Interface, Provider, Binding, Driver, Adapter, Gateway and Controller roles and prohibited superficial synonymy;
- separated COMMAND, QUERY, RESPONSE, EVENT, NOTIFICATION, STREAM and ARTIFACT_REF interaction semantics from generic transport messages;
- proposed a transport-neutral `ExchangeEnvelope` carrying contract revision, producer/target, refs, time/currentness, correlation/causation/trace, provenance/evidence, tenant/classification/authority and delivery-related qualifiers as required by the interaction;
- required semantic translation/ACL mediation to declare lossiness, unsupported/defaulted concepts and preserved authority/currentness/provenance instead of inventing equivalence;
- established that direct/in-process, IPC/RPC, broker/queue, stream/log, file/artifact and gateway/adapter are replaceable realizations only when the promised contract remains true;
- scoped ACK, delivery, consumer acceptance and effective business convergence as separate states and retained UNKNOWN/conflicted outcomes;
- separated schema readability compatibility from semantic/authority/delivery/ordering/currentness contract compatibility;
- required authorization/revocation, tenant/classification metadata, rate/cost/backpressure and long-lived queued-work semantics at the corridor;
- preserved autonomous client runtimes by rejecting a mandatory Builder-central exchange service or single-broker topology;
- added adversarials for shared-model monolith, shared database ownership, ESB/gateway business accumulation, service-mesh semantic overclaim, retry duplicates, version skew, schema-compatible semantic break, metadata loss, cross-capability ownership leakage and local/remote semantic drift.

No broker, service mesh, RPC framework, schema registry, API gateway or event specification was selected as canonical.

Highest-value remaining gaps: multidimensional contract-compatibility/negotiation; empirical same-contract fixtures across in-process/RPC/async realizations; revocation/currentness for queued work; long-partition federation; registry decomposition without central semantic ownership; reference lifecycle; gateway anti-ESB decomposition; provider capability negotiation; and common semantic contract tests across transports.

### 2026-09-18 — Authorization-aware data access

Evidence classes: PostgreSQL Row-Level Security, OpenFGA immutable/versioned models, contextual tuples, consistency modes and mature Zanzibar-family authorization patterns.

Material delta: authorization moved into query semantics; `DISCOVER/READ/TRAVERSE/EXPORT/MUTATE` are distinguished; authorization currentness is independent from data currentness; historical authorization explanation pins model/context state; contextual facts remain bounded; storage-native controls are defense-in-depth; list/search/graph/vector authorization is separated from point checks; failure retains UNKNOWN/fail-closed semantics. No authorization engine was selected.

### 2026-09-18 — Computational Core baseline qualification and specialization economics

Evidence classes: Node.js Worker Threads/transfer/performance/V8/Node-API documentation; SPEC benchmark run rules; empirical WebAssembly-vs-native research.

Material delta: end-to-end `PerformanceWorkloadEnvelope`; optimization ladder before specialization; worker boundary costs; workload-specific specialization crossover; native in-process vs daemon/service isolation; narrower Node-API portability claim; WASM portability/sandbox separated from speed; parallel-scaling and correctness/tail/memory evidence required.

### 2026-09-18 — Product UX semantic zoom, AI interaction and Preview safety

Evidence classes: information-visualization/HCI research, large-graph aggregation, production renderer guidance, Human-AI Interaction research, mature dry-run semantics and WCAG 2.2.

Material delta: semantic vs geometric zoom; bounded Canvas materialization; lens semantics; progressive-disclosure security; `Explore -> Design -> Simulate -> Propose -> Authorize -> Act -> Verify`; Preview fidelity classes; evidence-linked AI interaction; accessibility and interaction-workload budgets.

### 2026-09-18 — Infrastructure fencing, leadership and split-brain safety

Evidence classes: Kubernetes Lease/leader-election semantics, etcd revision/transaction/watch guarantees and distributed-systems fencing analysis.

Material delta: leadership separated from effect authority; lease expiry separated from fencing; `LeadershipEpoch`, `FencingToken`, compatibility-qualified eligibility; quorum vs downstream reachability; split-brain as competing effect capability; revision/currentness-qualified coordination; stale-work quarantine after reconnect.

### 2026-09-18 — Infrastructure control-loop safety, health decomposition and disruption semantics

Evidence classes: Kubernetes reconciliation/leases/disruption, Amazon EC2 health checks, Google SRE and Amazon Builders' Library.

Material delta: provider/host/storage/workload/application/network/observability health separation; heartbeat as freshness evidence; bounded retry envelope; retry amplification; degraded serving; disruption envelope; reboot proof; governed failover; evidence-backed RPO/RTO.

### 2026-09-18 — Retention, erasure and reproducibility boundaries

Evidence classes: EU GDPR Article 17, W3C PROV and Apache Iceberg snapshot/time-travel lifecycle.

Material delta: finite retention; visibility/invalidation/physical erasure/recovery separation; distributed erasure convergence; `ReproducibilityEnvelope`; derived-data erasure impact; restore reconciliation; explicit holds; identity-lineage deletion scope; replay/backfill cannot silently republish erased data.

### 2026-09-18 — Temporal identity, merge/split lineage and replay interpretation

Evidence classes: W3C PROV, HL7 FHIR and Apache Iceberg.

Material delta: source-record identity vs subject identity/resolution revision; merge/split lineage; downstream reconciliation after split; source snapshot vs interpretation snapshot; `InterpretationContext`; forensic reproduction vs current reinterpretation; derived-generation interpretation lineage.

### 2026-09-18 — Temporal, streaming and replay semantics

Evidence classes: Apache Beam, Apache Flink, Apache Kafka, Debezium and PostgreSQL.

Material delta: multidimensional time; watermark not absolute completeness; scoped exactly-once; replay context; live/backfill convergence; CDC/outbox vs canonical/effective-state boundaries; scoped ordering; declared temporal perspective for historical queries.

### 2026-09-18 — Lifecycle learning and improvement-effectiveness semantics

Evidence classes: Google SRE, DORA and GitHub Issues.

Material delta: incident/postmortem/findings/actions/work separation; hierarchy vs N:N lifecycle graph; multidimensional closure; `ImprovementEffectEvidence`; preserved `INCONCLUSIVE`; lesson lineage/supersession; review/effectiveness/AI non-authority proof obligations.

### 2026-09-17 — Self-hosting secure-update protocol foundations

Evidence classes: TUF, Uptane, Kubernetes and systemd.

Material delta: authenticity vs update authorization; threshold/role-separated root trust; complete-generation consistency; anti-rollback vs recovery; compatibility/skew envelopes; durable-state rollback obligations; layered promotion evidence; reboot identity; external failed-update-loop containment.

## Non-goals at this stage

- no decision to rewrite the Builder in Rust;
- no decision to introduce a graph database, vector database, search cluster, stream broker, service mesh, central exchange daemon, etcd or Kubernetes;
- no decision to make the Builder an operating system;
- no autonomous self-modification without external trust/recovery boundaries;
- no shared business model/database merely to simplify capability integration;
- no mandatory central broker/ESB for client runtimes;
- no replacement of the current G2 execution plan;
- no G4 implementation before explicit planning authorization.

## Closure target for G4 research

G4 research should eventually produce:

1. a deduplicated product capability map;
2. workload and interaction profiles;
3. performance and scale budgets;
4. data/infrastructure/lifecycle/self-hosting/exchange proof obligations;
5. implementation-independent target product architecture;
6. technology/provider qualification matrices;
7. prototype evidence for high-risk interaction, exchange or performance choices;
8. G3 -> G4 traceability;
9. gap against the then-current System Builder;
10. a planning handoff, without materializing work automatically.
