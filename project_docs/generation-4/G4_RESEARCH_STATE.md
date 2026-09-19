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

### Constitutional / product boundaries

- `G3 semantic decision != G4 technology binding`; `Research candidate != implementation authority`.
- `Polyglot-ready != Polyglot-from-day-one`; `Measured bottleneck -> qualified specialization candidate`.
- `Builder != Runtime`; published client runtimes remain autonomous.
- `Projection/index/cache/vector/telemetry != canonical truth`; `AI inference != authority`.
- `Self-managing != unrestricted self-modifying`.
- `Shared primitives != shared business ownership`; `Shared lifecycle semantics != shared authority`.
- `Logical Exchange Plane != single broker`; `Exchange Plane owns exchange semantics; capability owns business semantics`.
- `Interface compatibility != contract compatibility`; compatibility is multidimensional.
- Drivers/adapters/gateways may normalize or mediate only declared semantics; they must not fabricate equivalence or become accidental canonical owners.

### Exchange / effect boundaries

- `Provider ACK != effective state`; `Message/broker acceptance != consumer/business effect`.
- `Trace/correlation != business causation != authority`; `Cross-capability reference != ownership transfer`.
- `Workflow progress != transport progress`; `Compensation != rollback/time reversal`.
- `UNKNOWN` is an evidence-domain disposition, not permission to guess.
- `One interaction kind != one universal linearization point`.
- `Safety != liveness`; `Convergence != invariant preservation`; commutativity is contract/invariant-relative.
- Coordination scope follows the invariant; reservation/escrow is not a universal transaction replacement.
- `Idempotency != fencing`; `Target-local atomicity != cross-domain atomicity`.
- `Right transfer ACK != old holder fenced`; `Fencing token generated != fencing enforced`.
- `Ambiguous rights != free capacity`.

### Evolution / security / evidence boundaries

- `Latest deployment != in-flight semantic migration`; `Schema compatibility != obligation compatibility`.
- `Historical semantic continuity != historical executable continuity`; `Security retirement != semantic settlement`.
- `Signature/provenance valid != currently security-admissible`; `Previously trusted != indefinitely security-admissible`.
- `Offline autonomy != unlimited stale-security operation`; `Security currentness != business authority currentness`.
- `Revocation effective time != runtime observation time`; `Golden/A-B rollback != security-floor rollback`.
- `Evidence sufficient != payload retained`; security evidence is not a retention exemption.
- Historical semantic interpretation, continuation authority and new-effect admissibility remain distinct.

### Privacy / federation / resource-governance boundaries

- `Proof continuity != global identity continuity`; `Dedup scope != global correlation scope`.
- `Proof of predicate != disclosure of source record`; `Federation != trust-domain collapse`.
- `Cryptographically unlinkable != operationally unlinkable`; privacy guarantees name observer/collusion assumptions.
- `Backpressure != abuse attribution`; rate, quota, cost, concurrency and capacity are distinct.
- `No token replay != no Sybil/grant multiplication`; issuance/admission and redemption/spend are separate proof domains.
- `Privacy mechanism != conservation mechanism`; anonymous redemption does not imply anonymous minting authority.
- `Token cryptographically valid != issuer remained within issuance authority`; `UNKNOWN issuance != free budget`.
- `After-the-fact auditability != pre-issuance conservation`.
- `Append-only transparency != non-equivocation by itself`.
- `k-of-n signatures != k independent trust failures`; witness security depends on correlated-failure assumptions.
- `Quorum-valid checkpoint != sufficiently current checkpoint`; consistency approval is not semantic/content monitoring.

### Multi-domain evidence / composition-policy boundaries

- `All domains locally valid != cross-domain compatible state`.
- `Cross-domain composition != synthetic global revision number`; autonomous domains retain independent lineage/currentness.
- `Domain checkpoint valid != composition predicate satisfied`.
- `Multiple valid transparency domains != one atomic semantic state`.
- `Evidence aggregation != semantic compatibility fabrication`.
- `Joint hard invariant != global transaction requirement`; preventive coordination is scoped to the named invariant.
- `Anti-rollback != anti-downgrade`; monotonic revision does not prove semantic safety.
- `Old/new policy coexistence != union(old permissions, new permissions)`.
- `Unknown policy semantics != permission to ignore`.

### Proof / verifier / normative-semantics boundaries

- `Text/AST diff != semantic policy diff`; proof results carry explicit modeled scope and assumptions.
- `Same admitted request set != same guarantee vector`.
- `Proof verification != re-solving`; producer provenance is distinct from semantic derivation.
- `Proof valid != translation correct`; translation is a qualified proof boundary.
- `Proof file accepted != fully independently justified derivation`; trusted/hole/unsupported steps remain visible.
- `Separate process != independent TCB`; compromise containment requires qualified trust-root/semantic separation.
- `Offline proof verification != infinite dependency currentness`.
- Proof artifacts remain evidence/projections, not policy authority, business truth or currentness authority.
- `Verifier installed != verifier qualified`; replacement is a TCB/trust transition.
- `Two verifiers agree != proposition semantically valid`; diversity is relative to normative semantics/profile.
- `Differential disagreement != majority truth`.
- `Passes common corpus != semantic equivalence for all proofs`.
- `Verified implementation != independent implementation`; formal verification and diversity cover different failures.
- `Reproducible build != semantic correctness != verifier diversity`.
- `Verifier upgrade != proof reinterpretation permission`.
- `Latest semantics != historical semantics`; proofs bind immutable semantic snapshots.
- `Erratum recorded != historical semantics rewritten`.
- `Reference implementation behavior != normative semantics`; tests/implementations are qualification evidence.
- `Semantic resolvability != current admissibility`.
- `Mutable alias != semantic identity`.

### Profile negotiation / lifecycle boundaries

- `Supported profile != admissible profile for this interaction`; support, admissibility and preference are distinct.
- `Anti-downgrade != always choose numerically newest`.
- `No common admissible profile != fallback to any common supported profile`.
- Negotiation binds immutable semantic identity, peer/trust identity, interaction scope and security/currentness context.
- `Negotiated semantics != transport negotiation`; topology substitution preserves selected semantic identity.
- `Version skew allowance = relationship-specific contract`.
- Gateways/meshes/brokers cannot silently weaken semantic guarantees.
- `Discovered support != negotiated contract`; advertisement is not proof of executed semantics.
- `Consistent profile view != sufficiently current profile view`.
- `Network endpoint reached != intended semantic peer authenticated`.
- `Previously negotiated != indefinitely admissible`; cached evidence has identity/policy/floor/currentness horizons.
- `Negotiated once != admissible forever`; negotiation evidence has declared pinning scope/lifecycle.
- `Selected profile for admitted scope != mutable deployment default`.
- `Stream continuity != invisible semantic mutation`.
- `Queued work admission semantics != delivery-time execution admissibility`.
- `Retry/redelivery/failover != new semantic admission`.
- `New implementation present != new semantic profile activated`.
- `Implementation rollback != semantic-profile rollback != security-floor rollback`.
- `Floor publication time != floor effective time != runtime observation time != effect time` where material.
- `Profile change != global stop-the-world`; revalidation is scoped to changed invariants and pending obligations.
- `Topology/path migration != semantic occurrence migration`.
- `Admission drained != effect obligations drained != historical interpretation drained`.

### Semantic generation handoff / partial-order boundaries

- `Occurrence identity != one global semantic generation`; one occurrence may legitimately contain independently pinned branches.
- `Per-branch order != global order`; partition/stream/mailbox ordering cannot be extrapolated into a total business order.
- `No declared predecessor relation != permission to fabricate global order`.
- `Cutover scope follows the protected invariant`; independent branches may advance separately, shared hard invariants require shared qualification.
- `All branch messages arrived != join predicate satisfied`; joins name required effect/settlement/currentness semantics.
- `Generation marker observed != old generation fenced`.
- `Queue drained != old generation fenced`; conflicting new effect rights require invariant-qualified exclusion/settlement evidence.
- `Batch transport boundary != semantic generation boundary`; batching does not create business atomicity.
- `Connection generation != stream/branch semantic generation`; multiplexing scope does not dictate semantic cutover scope.
- `Delivery attempt generation != obligation semantic generation`; retry/redelivery retains lineage absent explicit migration/re-admission.
- Mixed-generation joins require semantic compatibility and authority/currentness qualification, not schema readability alone.
- `One branch pinned != whole occurrence pinned`; liveness may progress independently where the protected invariants are independent.
- Failure during handoff preserves a representable partial frontier rather than false completion.

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

- **Data/Persistence/Access:** `RESEARCH_ACTIVE`, not saturated.
- **Data Treatment:** `RESEARCH_ACTIVE`, not saturated.
- **Infrastructure Engineering:** `RESEARCH_ACTIVE`, not saturated.
- **Computational Core/Performance:** representative SB empirical benchmarks remain absent. `RESEARCH_ACTIVE`, not saturated.
- **Lifecycle/Continuous Improvement:** `RESEARCH_ACTIVE`, not saturated.
- **Self-Hosting/Autonomic Evolution:** `RESEARCH_ACTIVE`, not saturated.
- **Product UX/AI-native Builder:** `RESEARCH_ACTIVE`, not saturated.
- **Shared Semantic Kernel / Capability Exchange Plane:** thirty-two material deep-evidence consolidations are represented across the family artifacts, now extending negotiation-evidence lifecycle into semantic-generation handoff across multiplexed, parallel and partially ordered exchanges. `RESEARCH_ACTIVE`, not saturated.

## Latest material consolidation — 2026-09-19

### Semantic generation handoff for multiplexed and partially ordered exchanges

Evidence classes: Apache Kafka per-partition ordering and parallel consumer model; gRPC per-stream ordering, independent bidirectional streams and flow-control semantics; RabbitMQ orthogonal publisher-confirm/consumer-ack semantics, concurrent in-flight delivery, requeue/redelivery and batch acknowledgements; Akka sender-relative mailbox ordering; prior G4 causal workflow, effect composition, in-flight contract evolution, profile negotiation and negotiation-evidence lifecycle research.

Material delta:

- replaced an implicit occurrence-wide cutover assumption with branch/lane/invariant-scoped semantic generations;
- made partial order first-class and prohibited transport-local ordering from becoming accidental global business order;
- introduced a research-only generation-handoff frontier carrying branch lineage, predecessor frontier, old-generation effect rights and settlement/reconciliation evidence;
- made joins explicit semantic boundaries that qualify mixed-generation predecessor effects rather than simple scheduler barriers;
- identified old-generation effect-right fencing as the decisive safety boundary before conflicting new-generation rights are admitted;
- established that queue drain, stream completion, generation-marker observation and batch acknowledgement do not by themselves prove fencing or business settlement;
- separated connection/transport generation from stream/branch semantic generation in multiplexed transports;
- preserved original semantic lineage across retry/redelivery/failover unless explicit migration/re-admission occurs;
- allowed independent branches to progress without global lockstep when they do not share the changed hard invariant;
- required transport substitution to preserve the declared semantic partial order or expose incompatibility/qualified mediation.

No Kafka, RabbitMQ, gRPC, actor framework, broker, stream platform, workflow engine, gateway, service mesh or provider was selected.

Highest-value remaining gap: **handoff recovery and compaction of generation-frontier evidence** — determine the minimum durable evidence needed to recover a partially completed multi-branch handoff after crash/partition, the retention/resolvability horizon for old generation and fencing evidence, and safe compaction rules that do not make late redelivery, replay or settlement indistinguishable from fresh work.

## Prior material progression — compact index

Detailed durable evidence remains in the family documents indexed by `README.md`. Prior material deltas include reservation/escrow and fencing; effect composition; interaction reference models; semantic verification; causal workflow; multidimensional compatibility; hierarchical rights; non-fenceable/heterogeneous effects; in-flight evolution; security retirement/offline floors; evidence-minimal reconciliation; privacy-preserving evidence federation; collusion/metadata side channels; privacy-preserving abuse/rate/cost governance; federated anonymous budget conservation/Sybil resistance; privacy-preserving issuer accountability/compromise containment; witness/log governance/correlated compromise; multi-domain evidence composition; composition-policy lifecycle/downgrade/rollback safety; semantic non-downgrade/policy-diff proof; proof-carrying runtime verification; verifier trust continuity/diversity; normative proof-semantics governance/ambiguity containment; downgrade-resistant proof-semantics profile negotiation; and negotiation-evidence lifecycle across rollout, partitions and rollback.

## Non-goals

- no Rust rewrite decision;
- no graph/vector/search/stream/service-mesh/central-exchange/etcd/Kubernetes adoption decision;
- no workflow/saga/migration engine adoption decision;
- no property-testing/deterministic-simulation/checker adoption decision;
- no global serial-history/linearizability or global transaction requirement for all exchange interactions;
- no CRDT/escrow/reservation/anonymous-credential/nullifier/threshold-issuance/transparency-log/witness-network adoption decision;
- no central allocator, universal identity graph or mandatory global witness/composition service requirement;
- no Cedar/Rego/OPA/SMT/theorem-prover/policy-engine/proof-format/proof-checker adoption decision;
- no TUF/Lean/Alethe/LFSC/Carcara/seL4/reproducible-build/DDC adoption decision;
- no W3C/RFC/SMT-LIB/WebAssembly governance or semantics format adoption decision;
- no TLS/QUIC/SPIFFE/HTTP negotiation/Kubernetes skew-policy adoption decision;
- no Kafka/RabbitMQ/gRPC/Akka lifecycle or generation-handoff mechanism adoption decision;
- no decision to make Builder an operating system;
- no unrestricted autonomous self-modification;
- no shared business model/database for integration convenience;
- no mandatory central broker/ESB;
- no G4 implementation before explicit planning authorization.

## Closure target

G4 should eventually produce a deduplicated capability map; workload/interaction profiles; performance/scale budgets; proof obligations; implementation-independent target product architecture; provider qualification matrices; prototype evidence for high-risk choices; G3->G4 traceability; gap against current SB; and a planning handoff without automatically materializing implementation work.