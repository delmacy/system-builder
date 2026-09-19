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

### Privacy / federation / proof boundaries

- `Proof continuity != global identity continuity`; `Dedup scope != global correlation scope`.
- `Proof of predicate != disclosure of source record`; `Federation != trust-domain collapse`.
- `Cryptographically unlinkable != operationally unlinkable`; privacy guarantees name observer/collusion assumptions.
- Rate, quota, cost, concurrency, capacity, issuance, redemption and anti-Sybil guarantees remain separately scoped.
- `Append-only transparency != non-equivocation`; quorum validity does not imply currentness.
- `All domains locally valid != cross-domain compatible state`; evidence aggregation cannot fabricate semantic compatibility.
- `Anti-rollback != anti-downgrade`; old/new policy coexistence is not permission union.
- `Text/AST diff != semantic policy diff`; `Same admitted request set != same guarantee vector`.
- `Proof verification != re-solving`; `Proof valid != translation correct`; producer provenance is distinct from semantic derivation.
- `Verifier installed != verifier qualified`; verifier replacement is a TCB/trust transition.
- `Two verifiers agree != proposition semantically valid`; differential disagreement is evidence, not majority truth.
- `Latest semantics != historical semantics`; proofs bind immutable semantic snapshots.
- `Semantic resolvability != current admissibility`; mutable aliases are not semantic identities.

### Profile negotiation / lifecycle boundaries

- `Supported profile != admissible profile for this interaction`; support, admissibility and preference are distinct.
- `Anti-downgrade != always choose numerically newest`; no common admissible profile does not permit fallback to arbitrary support intersection.
- Negotiation binds immutable semantic identity, peer/trust identity, interaction scope and security/currentness context.
- `Negotiated semantics != transport negotiation`; topology substitution preserves selected semantic identity.
- `Discovered support != negotiated contract`; advertisement is not proof of executed semantics.
- `Previously negotiated != indefinitely admissible`; cached evidence has identity/policy/floor/currentness horizons.
- `Negotiated once != admissible forever`; negotiation evidence has declared pinning scope/lifecycle.
- `Stream continuity != invisible semantic mutation`; queued-work admission semantics remain distinct from delivery-time execution admissibility.
- `Retry/redelivery/failover != new semantic admission`.
- `New implementation present != new semantic profile activated`.
- `Implementation rollback != semantic-profile rollback != security-floor rollback`.
- `Floor publication time != floor effective time != runtime observation time != effect time` where material.
- `Topology/path migration != semantic occurrence migration`.
- `Admission drained != effect obligations drained != historical interpretation drained`.

### Semantic generation handoff / partial-order boundaries

- `Occurrence identity != one global semantic generation`; one occurrence may contain independently pinned branches.
- `Per-branch order != global order`; transport-local ordering cannot be extrapolated into total business order.
- `Cutover scope follows the protected invariant`; independent branches may advance separately.
- `All branch messages arrived != join predicate satisfied`; joins name effect/settlement/currentness requirements.
- `Generation marker observed != old generation fenced`; `Queue drained != old generation fenced`.
- `Batch transport boundary != semantic generation boundary`; batching does not create business atomicity.
- `Connection generation != stream/branch semantic generation`.
- `Delivery attempt generation != obligation semantic generation`; retry/redelivery retains lineage absent explicit migration/re-admission.
- Mixed-generation joins require semantic compatibility and authority/currentness qualification, not schema readability alone.
- Failure during handoff preserves a representable partial frontier rather than false completion.

### Handoff recovery / evidence-compaction boundaries

- `Recoverable state != retained full history`; a compacted frontier may replace detailed history only when every still-live safety/recovery question remains answerable.
- `Compaction != semantic forgetting`; missing detail cannot become proof that an effect/right/obligation never existed.
- A participant below the retained frontier receives explicit below-compaction-floor semantics rather than fabricated continuity.
- Transport replay horizon, deduplication horizon, semantic resolvability horizon and authority/security horizon are independent.
- `Dedup window expired != old obligation became new`; late work preserves lineage or becomes explicitly below-floor/unknown.
- `Checkpoint complete != external effects settled`; snapshot scope cannot manufacture settlement of external effects.
- `Compaction floor != security floor`; historical interpretation and current effect admissibility remain independently governed.
- Negative/revocation/fencing evidence must outlive every path that could otherwise resurrect stale positive state, or be subsumed by a stronger durable fence.
- `Compacted delivery history != semantic re-admission`; current deployment defaults cannot reinterpret old delayed work.
- Recovery evidence remains purpose-minimal; recovery does not justify indefinite payload retention or cross-capability canonical ownership.

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
- **Shared Semantic Kernel / Capability Exchange Plane:** thirty-three material deep-evidence consolidations are represented across the family artifacts, now extending semantic-generation handoff into crash/partition recovery and proof-preserving compaction of generation-frontier evidence. `RESEARCH_ACTIVE`, not saturated.

## Latest material consolidation — 2026-09-19

### Handoff recovery and compaction of generation-frontier evidence

Evidence classes: Apache Kafka log compaction/tombstone retention; Apache Pulsar retention, expiry and per-key topic compaction; etcd MVCC history compaction and explicit compacted-revision behavior; Apache Flink aligned checkpoint/recovery semantics and external-sink qualification; RabbitMQ quorum-queue log truncation, redelivery/dead-letter and delivery-limit behavior; prior G4 effect-composition, causal-workflow, in-flight evolution, negotiation lifecycle and semantic-generation handoff research.

Material delta:

- defined recovery sufficiency as a durable semantic cut/frontier rather than indefinite full event-history retention;
- made compaction proof-preserving summarization: discarded detail must be subsumed by sufficient summary or produce explicit below-floor behavior;
- separated transport replay, deduplication, semantic resolvability and authority/security horizons;
- established that expiry of direct dedup state cannot make an old obligation fresh if any legitimate replay path remains;
- separated checkpoint/state recovery from settlement of external effects and required unresolved effects to survive as `UNKNOWN`/pending evidence;
- made compaction floors scope-qualified rather than a synthetic platform-wide revision and kept them independent from security floors;
- required late delivery after compaction to resolve through durable lineage/fence evidence or fail closed/revalidate, never inherit current deployment defaults;
- identified negative/revocation/fencing evidence as subject to a resurrection-safety horizon: it cannot disappear while stale positive state can still return and produce an effect;
- introduced a qualified snapshot-plus-tail recovery hypothesis while explicitly rejecting an event-sourcing requirement or Exchange Plane business ownership;
- made compaction eligibility dependency-based: pending joins, unresolved rights/effects, replay paths, normative semantic resolvability, privacy/erasure and audit obligations constrain when detail can disappear.

No Kafka, Pulsar, etcd, Flink, RabbitMQ, event store, checkpoint format, broker, archive, workflow engine, gateway, service mesh or provider was selected.

Highest-value remaining gap: **cross-runtime frontier transfer and disaster recovery under independent retention domains** — determine how a runtime proves/transfers a compacted frontier to a replacement host/region or autonomous peer whose replay windows, archives and security floors differ, without turning Builder/shared archive into mandatory runtime authority or accepting an incomplete frontier as current truth.

## Prior material progression — compact index

Detailed durable evidence remains in the family documents indexed by `README.md`. Prior material deltas include reservation/escrow and fencing; effect composition; interaction reference models; semantic verification; causal workflow; multidimensional compatibility; hierarchical rights; non-fenceable/heterogeneous effects; in-flight evolution; security retirement/offline floors; evidence-minimal reconciliation; privacy-preserving evidence federation; collusion/metadata side channels; privacy-preserving abuse/rate/cost governance; federated anonymous budget conservation/Sybil resistance; privacy-preserving issuer accountability/compromise containment; witness/log governance/correlated compromise; multi-domain evidence composition; composition-policy lifecycle/downgrade/rollback safety; semantic non-downgrade/policy-diff proof; proof-carrying runtime verification; verifier trust continuity/diversity; normative proof-semantics governance/ambiguity containment; downgrade-resistant proof-semantics profile negotiation; negotiation-evidence lifecycle across rollout, partitions and rollback; and semantic-generation handoff across multiplexed/partially ordered exchanges.

## Non-goals

- no Rust rewrite decision;
- no graph/vector/search/stream/service-mesh/central-exchange/etcd/Kubernetes adoption decision;
- no workflow/saga/migration/checkpoint/event-store engine adoption decision;
- no global serial-history/linearizability or global transaction requirement for all exchange interactions;
- no mandatory central broker/ESB/shared archive;
- no decision to make Builder an operating system;
- no unrestricted autonomous self-modification;
- no shared business model/database for integration convenience;
- no G4 implementation before explicit planning authorization.

## Closure target

G4 should eventually produce a deduplicated capability map; workload/interaction profiles; performance/scale budgets; proof obligations; implementation-independent target product architecture; provider qualification matrices; prototype evidence for high-risk choices; G3->G4 traceability; gap against current SB; and a planning handoff without automatically materializing implementation work.