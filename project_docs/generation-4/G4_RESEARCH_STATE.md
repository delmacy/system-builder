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
- `Temporal history != infinite retention`; `Auditability != immutable personal data forever`.
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
- `Definition deployable != in-flight occurrence migratable`.
- `Workflow migration != version reassignment`; migration is a qualified semantic transformation.
- `Historical semantic evidence != historical executable artifact != historical sensitive payload`.
- `History compacted != history never happened`; `Current state reconstructable != causal proof sufficient`.
- `Deprecated for new work != safe to delete for in-flight obligations`.
- `Same happy-path output != semantic conformance`; a binding must be checked against the required semantic profile.
- `Deterministic replay != production equivalence`; simulation evidence is scoped to its model/environment.
- `Fault injection != business oracle`; semantic faults include authority, contract, migration, retention and currentness changes.
- `Checkpoint loads != checkpoint sufficient`; sufficiency is operation-specific.

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

- **Data/Persistence/Access:** first deep evidence consolidation completed for authorization-aware data access. Long-running revocation/currentness and empirical leakage tests remain open. `RESEARCH_ACTIVE`, not saturated.
- **Data Treatment:** deep evidence consolidation covers temporal/streaming/replay, temporal identity/interpretation revision and retention/erasure/reproducibility. `RESEARCH_ACTIVE`, not saturated.
- **Infrastructure Engineering:** two deep evidence consolidations cover decomposed health/control-loop safety and leadership/lease/fencing/split-brain coordination. `RESEARCH_ACTIVE`, not saturated.
- **Computational Core/Performance:** first deep evidence consolidation covers workload envelopes, TypeScript/Node baseline instrumentation, worker/serialization boundaries, specialization crossover, native isolation and WASM qualification. Representative SB empirical benchmarks remain absent. `RESEARCH_ACTIVE`, not saturated.
- **Lifecycle/Continuous Improvement:** first deep evidence consolidation covers incident/postmortem/action separation, semantic lifecycle graph, multidimensional closure and improvement-effect evidence. `RESEARCH_ACTIVE`, not saturated.
- **Self-Hosting/Autonomic Evolution:** first deep evidence consolidation covers secure update trust, generation consistency, version skew, anti-rollback/recovery, durable-state rollback, promotion evidence and failed-update-loop containment. `RESEARCH_ACTIVE`, not saturated.
- **Product UX/AI-native Builder:** first deep evidence consolidation covers semantic zoom, lens composition, disclosure security, Explore-to-Act separation, Preview fidelity, evidence-linked AI, accessibility and interaction workloads. `RESEARCH_ACTIVE`, not saturated.
- **Shared Semantic Kernel / Capability Exchange Plane:** **seven deep evidence consolidations completed**: minimal kernel/exchange vocabulary; multidimensional compatibility; same-contract delayed-command fixtures; federated reconnect; causal workflow/saga semantics; in-flight workflow migration + causal-history compaction; and semantic verification/fault-model strategy. The seventh consolidation turns prior fixtures into a layered verification model with transport-independent semantic histories/oracles, stateful generation, metamorphic binding conformance, fault-injected histories, operation-specific checkpoint sufficiency and privacy-aware counterexample retention. `RESEARCH_ACTIVE`, not saturated.

## Material research log

### 2026-09-18 — Semantic verification, stateful fault model and checkpoint sufficiency

Evidence classes: FoundationDB deterministic simulation/testing; Antithesis deterministic simulation/fault injection; Hypothesis rule-based state machines; Jepsen/Elle generated-history checking; prior G4 contract, federation, causal-workflow, migration and retention findings.

Material delta:

- replaced a flat list of same-contract examples with layered verification evidence: examples -> stateful model/property tests -> binding conformance -> fault-injected histories -> recovery/convergence checks -> production-assumption qualification;
- introduced a transport-independent `SemanticHistoryRecord`/oracle boundary that records caller observation separately from transport disposition and authoritative effect evidence;
- proposed metamorphic same-scenario qualification across local/RPC/async/federated bindings, comparing only dimensions promised equivalent by the `RequiredContractProfile`;
- required stateful generation of histories combining timeout/UNKNOWN, partition, authority revision, contract upgrade, workflow migration, compaction, erasure, retry and reconnect;
- separated infrastructure faults from semantic faults: healed network or available storage does not prove authority/currentness/contract/evidence convergence;
- made ambiguous `UNKNOWN` windows intentional test targets rather than incidental failures;
- converted `CausalCheckpoint` proof into an operation-sufficiency matrix for resume, retry/dedup, compensation, migration, federation, audit and erasure;
- identified test seeds, minimized counterexamples, traces and snapshots as retention/erasure surfaces that must not become shadow archives of sensitive payloads;
- bounded deterministic-simulation claims and required portable semantic scenarios/oracles so simulation and real multi-process evidence remain complementary;
- added dependency/history checking and semantic-witness-preserving failure shrinking rather than timestamp-only ordering or lower-level assertion minimization.

No property framework, simulator, checker, broker, workflow engine or provider was selected.

Highest-value remaining gap: formalize the reference-model boundary and candidate linearization/effect points per interaction kind (`COMMAND`, `QUERY`, `EVENT`, `STREAM`, `ARTIFACT_REF`), distinguishing safety invariants from liveness/eventual assumptions and identifying where finite evidence requires a legitimate `UNKNOWN` rather than a universal single linearization point.

### 2026-09-18 — In-flight workflow migration, contract retirement and causal-history compaction

Evidence classes: Camunda 8 process-instance migration/versioning/data-migration limitations/data retention; Apache Kafka log compaction; GDPR Article 5 storage limitation/data minimisation; prior G4 causal-workflow and retention/erasure research.

Material delta: migration is a semantic transformation; pinning and migration have distinct risks; semantic evidence/executables/sensitive payloads have distinct retention; causal checkpoints preserve only qualified future proof; admission and obligation retirement horizons differ; retention may intentionally reduce reproducibility without falsifying history.

### 2026-09-18 — Cross-capability causal consistency, saga/workflow and compensation

Evidence classes: AWS saga orchestration/choreography; Azure Saga/Compensating Transaction; W3C Trace Context; OpenTelemetry; prior G4 temporal/federation findings.

Material delta: business causation separated from trace/correlation; workflow progress separated from transport progress; compensation treated as new governed effect; pivot/irreversibility and causal-frontier semantics added; orchestration/choreography kept above Exchange Plane; cancellation and mid-workflow authority/contract revision added as proof domains.

### 2026-09-18 — Federated exchange after long partitions and reconnect

Evidence classes: CouchDB disconnected replication/conflicts; Kafka MirrorMaker 2; Azure Service Bus/Event Hubs geo-replication/failover.

Material delta: transport reconnect separated from semantic convergence; backlog classification/revalidation; conflict preservation; authority-sensitive queued work revalidation; exchange-state classification remains separate from business merge/effect authority.

### 2026-09-18 — Time-separated exchange fixtures and queued-command validity

Evidence classes: gRPC deadlines; RabbitMQ TTL/dead-lettering; Kafka transaction boundaries; Amazon EventBridge replay.

Material delta: same-contract fixtures observe caller result, transport evidence, authoritative effect and reconciliation; delayed command validity separated from TTL; ambiguous timeout/retry/external-effect made mandatory; replay is a qualified delivery context.

### 2026-09-18 — Capability Exchange contract compatibility and negotiation

Evidence classes: schema-registry compatibility; AsyncAPI/CloudEvents bindings; HTTP idempotency; gRPC deadlines; RabbitMQ confirms; Kafka idempotence/transactions.

Material delta: compatibility became a multidimensional guarantee vector; `RequiredContractProfile` compared to `ProviderOffer`; transport substitution classified; schema/contract/provider registries separated; common semantic fixtures proposed as portability proof.

### 2026-09-18 — Shared Semantic Kernel / Capability Exchange Plane foundations

Evidence classes: DDD/ACL; Ports & Adapters; CloudEvents; AsyncAPI; gRPC; Kafka; RabbitMQ; transactional outbox; Envoy; schema registries.

Material delta: minimal shared structural kernel; logical non-central Exchange Plane; explicit role vocabulary; interaction taxonomy; exchange envelope; semantic mediation/lossiness; ACK/delivery/effect separation; authorization/currentness/rate/backpressure propagation; autonomous runtimes without mandatory central broker/ESB.

### Earlier 2026-09-18 consolidations

Authorization-aware data access; Computational Core baseline qualification; Product UX semantic zoom/AI/Preview safety; Infrastructure fencing/leadership/split-brain; Infrastructure control-loop safety; Retention/erasure/reproducibility; Temporal identity/replay interpretation; Temporal/streaming/replay semantics; Lifecycle learning/improvement effectiveness; Self-hosting secure-update foundations.

## Non-goals

- no Rust rewrite decision;
- no graph/vector/search/stream/service-mesh/central-exchange/etcd/Kubernetes adoption decision;
- no workflow/saga/migration engine adoption decision;
- no property-testing/deterministic-simulation/checker adoption decision;
- no decision to make Builder an operating system;
- no unrestricted autonomous self-modification;
- no shared business model/database for integration convenience;
- no mandatory central broker/ESB;
- no G4 implementation before explicit planning authorization.

## Closure target

G4 should eventually produce a deduplicated capability map; workload/interaction profiles; performance/scale budgets; proof obligations; implementation-independent target product architecture; provider qualification matrices; prototype evidence for high-risk choices; G3->G4 traceability; gap against current SB; and a planning handoff without automatically materializing implementation work.
