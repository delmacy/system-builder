# G4 Research State — System Builder Product R&D

Date: 2026-09-19
Status: `RESEARCH_ACTIVE / NON_EXECUTABLE`
Execution authority: NONE

## Purpose

Generation 4 follows G3 architectural closure and studies how the System Builder product should realize that semantic substrate with usable interaction, measurable performance, robust data/infrastructure engineering, controlled lifecycle management, bounded self-management and interoperable capability boundaries. G4 does not reopen G3 and does not authorize implementation, WBS, Work Packages, Sprints, TASKs, migrations or provider adoption.

This file is the compact consolidated state. Detailed evidence, adversarials, trade-offs and source-specific findings live in the dedicated documents under `project_docs/generation-4/research/`; compaction here does not supersede those durable research artifacts.

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
- `One interaction kind != one universal linearization point`; linearizability is a contract property, not an Exchange Plane default.
- `Admission != durability != authoritative effect != caller observation != settlement != convergence` unless the contract proves equivalence for that interaction.
- `Safety != liveness`; eventual progress requires declared assumptions and bounded-liveness claims require explicit time/resource/workload envelopes.
- `UNKNOWN` is an evidence-domain disposition, not a generic transport failure or permission to guess.
- `Convergence != invariant preservation`; deterministic agreement is not business correctness by itself.
- `Commutativity is contract/invariant-relative`; same final bytes, disjoint writes or mergeability do not prove business effects commute.
- `Coordination-free != correctness-free`; an operation/invariant pair needs proof that permitted independent executions and merge preserve the invariant.
- `Reservation/escrow != global transaction replacement`; rights are useful only for safely decomposable invariants and require transfer/currentness/fencing semantics.
- `Serializable local domain != atomic external multi-domain effect`.
- `Reservation allocation != business authority`; the capability owns the invariant and allocation policy semantics.
- `Right transfer ACK != old holder fenced`; transfer settlement and stale-holder exclusion are separate proof domains.
- `Fencing token generated != fencing enforced`; the protected effect boundary must reject stale epochs or an explicitly weaker profile applies.
- `Holder/node loss != rights safely recoverable`; recovery requires evidence excluding prior consumption.
- `Ambiguous rights != free capacity`; UNKNOWN transfer/recovery reduces availability rather than weakening a hard invariant.
- `Idempotency != fencing`; retry safety does not prove stale-holder exclusion or conflicting-intent ordering.
- `Target-local atomicity != cross-domain atomicity`.
- `Latest deployment != in-flight semantic migration`.
- `Schema compatibility != obligation compatibility`.
- `Historical semantic continuity != historical executable continuity`.
- `Security retirement != semantic settlement`.
- `Signature/provenance valid != currently security-admissible`.
- `Previously trusted != indefinitely security-admissible`.
- `Offline autonomy != unlimited stale-security operation`.
- `Security currentness != business authority currentness`.
- `Revocation effective time != runtime observation time`.
- `Golden/A-B rollback != security-floor rollback`.
- `Evidence sufficient != payload retained`.
- `Security evidence store != retention exemption`.
- `No witness != no effect`.
- `Signed/tamper-evident != non-sensitive/permanently retainable`.
- `Proof continuity != global identity continuity`.
- `Dedup scope != global correlation scope`.
- `Proof of predicate != disclosure of source record`.
- `Federation != trust-domain collapse`.
- `Cryptographic key rotation != semantic identity rotation != correlation-reference rotation`.

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
- **Infrastructure Engineering:** deep evidence consolidations cover decomposed health/control-loop safety and leadership/lease/fencing/split-brain coordination. `RESEARCH_ACTIVE`, not saturated.
- **Computational Core/Performance:** deep evidence consolidation covers workload envelopes, TypeScript/Node baseline instrumentation, worker/serialization boundaries, specialization crossover, native isolation and WASM qualification. Representative SB empirical benchmarks remain absent. `RESEARCH_ACTIVE`, not saturated.
- **Lifecycle/Continuous Improvement:** deep evidence consolidation covers incident/postmortem/action separation, semantic lifecycle graph, multidimensional closure and improvement-effect evidence. `RESEARCH_ACTIVE`, not saturated.
- **Self-Hosting/Autonomic Evolution:** deep evidence consolidation covers secure update trust, generation consistency, version skew, anti-rollback/recovery, durable-state rollback, promotion evidence and failed-update-loop containment. `RESEARCH_ACTIVE`, not saturated.
- **Product UX/AI-native Builder:** deep evidence consolidation covers semantic zoom, lens composition, disclosure security, Explore-to-Act separation, Preview fidelity, evidence-linked AI, accessibility and interaction workloads. `RESEARCH_ACTIVE`, not saturated.
- **Shared Semantic Kernel / Capability Exchange Plane:** eighteen material deep-evidence consolidations are represented across the family artifacts: foundations; multidimensional compatibility; time-separated exchange; federated reconnect; causal workflow/saga; in-flight workflow migration/history compaction; semantic verification; interaction-specific reference model; effect-domain composition/commutativity; reservation/escrow lifecycle; hierarchical/delegated rights; non-fenceable external effects; heterogeneous cross-provider effect composition; in-flight contract evolution; security retirement/remediation; offline security floors; evidence-minimal security reconciliation; and privacy-preserving evidence/currentness federation. `RESEARCH_ACTIVE`, not saturated.

## Latest material consolidation — 2026-09-19

### Privacy-preserving evidence/currentness federation

Evidence classes: NIST SP 800-63C-4 federation and pairwise pseudonymous identifiers; W3C Data Integrity BBS selective-disclosure/unlinkable-proof work; W3C Bitstring Status List privacy/currentness patterns; SPIFFE federation/trust-domain bundle isolation and rotation; RFC 9449 DPoP sender-constrained proof-of-possession; prior G4 evidence-minimal/offline-security/Exchange Plane findings.

Material delta:

- made **purpose-bounded linkability** the target rather than universal unlinkability or universal correlation;
- separated proof continuity from global subject identity continuity;
- introduced explicit `CorrelationScope` and `DedupScope`, requiring dedup correlation not to exceed the privacy scope authorized by the contract;
- established `Proof of predicate != disclosure of source record` as a cross-capability evidence boundary;
- qualified pairwise/verifier-specific evidence references as a candidate way to preserve local reconciliation without global stable handles;
- recognized status/currentness query patterns, timing, cache misses and endpoint structure as privacy leakage channels independent of payload disclosure;
- separated proof-of-possession from business identity, authority and currentness;
- preserved issuer/trust-domain bindings across federation instead of pooling trust authorities;
- separated cryptographic key rotation, semantic identity continuity and correlation-reference rotation;
- defined reconnect after long partitions as selective reconciliation of required effect scopes, not authority to reconstruct a global identity graph;
- added explicit adversarials for colluding issuer/verifier, global IDs leaking through broker/trace metadata, pairwise refs relinked by stable digests, and dedup implementations that retain broader identity maps than their horizon requires.

No identity system, credential format, cryptosuite, status mechanism, federation framework, broker, PKI or provider was selected.

Highest-value remaining gap: **privacy-preserving reconciliation under multi-party collusion and metadata side channels** — determine which privacy guarantees survive issuer/verifier/gateway/broker collusion; formalize correlation budgets across timing, routing, trace, size and status-query metadata; and identify when a cryptographically unlinkable/pairwise design remains operationally linkable.

## Prior material progression — compact index

Detailed durable evidence remains in the family documents indexed by `README.md`. Prior material deltas include: reservation/escrow lifecycle and fencing; effect-domain composition and invariant-relative commutativity; interaction reference models and safety/liveness; semantic verification/stateful fault models; workflow migration/history compaction; causal saga/compensation semantics; long-partition federation/reconnect; queued-command validity; multidimensional contract compatibility; Shared Semantic Kernel/Exchange Plane foundations; hierarchical rights; non-fenceable effects; heterogeneous provider composition; in-flight contract evolution; security retirement; offline security-floor propagation; and evidence-minimal reconciliation under erasure.

This compact index replaces duplicated log prose in this state file; it does not supersede or erase the detailed research artifacts.

## Non-goals

- no Rust rewrite decision;
- no graph/vector/search/stream/service-mesh/central-exchange/etcd/Kubernetes adoption decision;
- no workflow/saga/migration engine adoption decision;
- no property-testing/deterministic-simulation/checker adoption decision;
- no global serial-history/linearizability requirement for all exchange interactions;
- no global transaction/coordination requirement for all cross-capability effects;
- no CRDT/escrow/reservation adoption decision;
- no central allocator requirement;
- no identity/credential/selective-disclosure/status-list framework adoption decision;
- no global stable identity/evidence-reference requirement;
- no decision to make Builder an operating system;
- no unrestricted autonomous self-modification;
- no shared business model/database for integration convenience;
- no mandatory central broker/ESB;
- no G4 implementation before explicit planning authorization.

## Closure target

G4 should eventually produce a deduplicated capability map; workload/interaction profiles; performance/scale budgets; proof obligations; implementation-independent target product architecture; provider qualification matrices; prototype evidence for high-risk choices; G3->G4 traceability; gap against current SB; and a planning handoff without automatically materializing implementation work.
