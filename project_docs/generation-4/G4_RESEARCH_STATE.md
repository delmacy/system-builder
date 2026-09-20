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

### Semantic generation handoff / recovery boundaries

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
- `Recoverable state != retained full history`; compacted frontiers may replace detail only when live safety/recovery questions remain answerable.
- `Compaction != semantic forgetting`; below-floor references require explicit behavior rather than fabricated absence.
- Transport replay, deduplication, semantic resolvability and authority/security horizons are independent.
- `Dedup window expired != old obligation became new`.
- `Checkpoint complete != external effects settled`.
- Negative/revocation/fencing evidence outlives resurrection paths or is subsumed by a stronger durable fence.

### Cross-runtime DR / split-brain boundaries

- `Frontier transferred != frontier admissible here`; evidence coverage across payload, progress, semantics, effects, authority, negative evidence and topology is multidimensional.
- `Replica complete for bytes != complete for semantic recovery`; provider-local cursor/checkpoint progress cannot manufacture effect settlement.
- `Endpoint moved != old effect authority fenced`; promotion is an authority transition where conflicting effects can occur.
- `RPO/RTO != semantic safety proof`; expected loss windows do not justify guessing a missing effect's disposition.
- `Failback != undo failover`; divergent post-promotion histories require reconciliation.
- `Connectivity restored != authority reconciled`; reconnection does not make either local latest state globally authoritative.
- `Histories mergeable != effects jointly admissible`; convergent data and irreversible/non-commutative side effects use different reconciliation laws.
- `Leader/lease elected != stale holder externally fenced`; effect-side exclusion must be enforced where the effect occurs or independently proven.
- `Latest timestamp != semantic winner`; wall-clock recency cannot invent ownership, conservation, settlement or security authority.
- Conflict resolution never erases historical external effects; dual-side effects remain facts with provenance/remediation obligations.
- Rejoin admission follows invariant-scoped authority reconciliation; independent invariants need not share a global barrier.

### Partition policy / degraded-mode boundaries

- `Capability degraded != every operation degraded identically`; degraded behavior is operation/interaction/invariant-scoped.
- `Dependency reachable != operation semantically admissible`; reachability, provider health, contract/profile compatibility, currentness, authority, effect rights and settlement are distinct dimensions.
- `Dependency unreachable != every operation must stop`; bounded stale reads, local convergence, preallocated rights or queue-without-effect may remain safe when explicitly contracted.
- `Health check green != operation admissible`; infrastructure health is not semantic/security authority.
- `Circuit open != business permission denied`; resilience path state is operational evidence, not canonical policy truth.
- `Graceful degradation != guarantee weakening by surprise`; hard safety/security/ownership invariants cannot be silently relaxed for availability.
- `Failover target healthy != failover target contract-compatible`; routing failover preserves or explicitly requalifies negotiated semantics.
- `Control plane unavailable != data plane must stop`; statically stable runtime operation may continue from locally durable state within declared currentness/security horizons.
- `Cached control-plane state != indefinitely current authority`; autonomy remains bounded by freshness/security policy.
- `Resource overload != semantic incompatibility`; load shedding and semantic admission are separate dimensions.
- `Borrowable execution capacity != borrowable authority/quota/effect rights`; resource scheduling cannot transfer business rights.
- `Dependency fallback succeeded != caller's original contract satisfied`; downstream degradation/lossiness propagates as qualified evidence through dependency composition.
- `Dependency healthy again != degraded obligations settled`; recovery requalifies queued, divergent, stale and unknown work.
- No central availability/health oracle becomes mandatory semantic authority for autonomous runtimes.

### Degraded dependency graph / guarantee synthesis boundaries

- `Dependency graph != orchestration ownership`; graph edges express required claims, not authority to own downstream business workflows.
- `Dependency graph != call graph`; semantic requirements can exist without a synchronous call and calls can be operationally incidental.
- `All dependencies returned != end-to-end guarantee satisfied`; root guarantees are constrained by material currentness, compatibility, authority, effect and settlement evidence.
- Hard, optional, alternative, conditional, effect-settlement, currentness/authority and resource-guard relations remain distinct.
- `Optional enrichment != hard dependency`; optionality is scoped to a root operation/guarantee and cannot be generalized globally.
- `Critical path != minimal semantic cut set`; a cut set is defined per protected invariant/guarantee rather than latency/topology centrality.
- `Fallback available != fallback contract-equivalent`; transparent substitution requires the required guarantee vector to remain satisfied.
- Guarantee synthesis cannot strengthen downstream evidence: `PARTIAL -> COMPLETE`, `UNKNOWN effect -> SETTLED`, or stale authority -> current authority requires explicit proof/irrelevance, never relabeling.
- `Retryable locally != safe to retry end-to-end`; retry ownership, stable effect identity and idempotency/dedup/fencing remain explicit.
- Retry/fallback attempt, time, concurrency, cost and queue budgets are end-to-end resources; child layers cannot silently mint additional budget.
- `Graph acyclic structurally != no feedback cycle`; retries, fallback recursion, queues, health flapping and recovery can form dynamic amplification loops.
- Bulkheads/circuit breakers/timeouts/backoff/jitter protect execution and failure domains but do not become business-semantic authority.
- Fan-out/fan-in completion depends on declared branch requirements/dispositions, not response count alone.
- Distributed/local admission from immutable contracts and locally sufficient evidence remains valid; no central graph/availability oracle is mandatory for autonomous runtimes.
- Recovery requalifies queued/retry obligations and drains backlog under bounded resource budgets rather than blindly reopening all paths.

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
- **Shared Semantic Kernel / Capability Exchange Plane:** thirty-seven material deep-evidence consolidations are represented across the family artifacts, now extending degraded-mode capability contracts into dependency-claim graphs, invariant-specific minimal semantic cut sets, end-to-end guarantee synthesis and bounded retry/fallback amplification control. `RESEARCH_ACTIVE`, not saturated.

## Latest material consolidation — 2026-09-19

### Degraded-mode dependency graph and end-to-end guarantee synthesis

Evidence classes: AWS Builders' Library timeout/retry/backoff/jitter and Well-Architected retry guidance; Azure Bulkhead, Circuit Breaker, Retry Storm and Gateway Aggregation patterns; Google Aequitas distributed RPC admission-control research; Google CAPA containment/regulation research; prior G4 effect-composition, causal-workflow, compatibility, negotiation, handoff, DR, split-brain and degraded-mode artifacts.

Material delta:

- promoted dependency composition from coarse service health/call topology to an operation-scoped **dependency-claim graph** whose edges name the guarantee they contribute without transferring business ownership;
- distinguished hard, optional-enrichment, alternative, conditional, effect-settlement, currentness/authority and resource-guard relations, preventing one caller's optionality from becoming a global property of a capability;
- introduced **minimal semantic cut sets** per protected invariant/guarantee, explicitly separating them from latency critical paths, topology centrality or slowest dependencies;
- defined end-to-end guarantee synthesis as a multidimensional evidence vector over completeness, currentness, semantic compatibility, authority/security, effect rights, ordering/delivery, settlement, resource budgets, provenance and reconciliation obligations;
- established that fallback is contract substitution rather than routing substitution: same schema/interface or healthy endpoint is insufficient when guarantee vectors differ;
- prohibited guarantee strengthening during composition: partial/stale/unknown downstream evidence cannot be silently relabeled complete/current/settled upstream;
- made retry ownership and retry/fallback budgets end-to-end concerns so nested layers cannot multiply attempts, deadlines, concurrency or cost independently;
- expanded cycle analysis beyond static dependency DAGs to dynamic retry, fallback, queue, health-flap and recovery feedback loops;
- separated bulkheads, breakers, timeouts, backoff/jitter and admission controls as complementary operational containment mechanisms rather than semantic authority;
- required fan-out/fan-in joins to use declared branch requirements and dispositions instead of response counts or accidental quorum semantics;
- preserved autonomous runtime operation: guarantee evaluation may be distributed/local from immutable contracts and sufficient local evidence, without mandatory Builder or central availability/graph oracle;
- made recovery obligation-aware: queued/retry work is requalified against current security/profile/currentness/effect evidence and backlog drain remains resource-bounded to avoid a second recovery storm.

No AWS retry stack, Azure resilience pattern, Aequitas implementation, CAPA implementation, graph engine, workflow engine, circuit-breaker library, service mesh, gateway, broker or provider was selected.

Highest-value remaining gap: **distributed guarantee evidence caching and invalidation under high fan-out** — determine how runtimes can cache dependency qualification/cut-set evidence without consulting every capability on every operation, while preventing stale authority/currentness/profile claims from creating false admissibility; define cache-key scope, dependency invalidation, negative evidence, stampede control and offline behavior without a central guarantee oracle.

## Prior material progression — compact index

Detailed durable evidence remains in the family documents indexed by `README.md`. Prior material deltas include reservation/escrow and fencing; effect composition; interaction reference models; semantic verification; causal workflow; multidimensional compatibility; hierarchical rights; non-fenceable/heterogeneous effects; in-flight evolution; security retirement/offline floors; evidence-minimal reconciliation; privacy-preserving evidence federation; collusion/metadata side channels; privacy-preserving abuse/rate/cost governance; federated anonymous budget conservation/Sybil resistance; privacy-preserving issuer accountability/compromise containment; witness/log governance/correlated compromise; multi-domain evidence composition; composition-policy lifecycle/downgrade/rollback safety; semantic non-downgrade/policy-diff proof; proof-carrying runtime verification; verifier trust continuity/diversity; normative proof-semantics governance/ambiguity containment; downgrade-resistant proof-semantics profile negotiation; negotiation-evidence lifecycle; semantic-generation handoff; handoff recovery/compaction; cross-runtime frontier transfer/disaster recovery; split-brain authority rejoin after mutually progressing runtimes; and operation-scoped degraded-mode capability contracts.

## Non-goals

- no Rust rewrite decision;
- no graph/vector/search/stream/service-mesh/central-exchange/etcd/Kubernetes adoption decision;
- no workflow/saga/migration/checkpoint/event-store/circuit-breaker engine adoption decision;
- no global serial-history/linearizability or global transaction requirement for all exchange interactions;
- no mandatory central broker/ESB/shared archive/availability/guarantee oracle;
- no decision to make Builder an operating system;
- no unrestricted autonomous self-modification;
- no shared business model/database for integration convenience;
- no G4 implementation before explicit planning authorization.

## Closure target

G4 should eventually produce a deduplicated capability map; workload/interaction profiles; performance/scale budgets; proof obligations; implementation-independent target product architecture; provider qualification matrices; prototype evidence for high-risk choices; G3->G4 traceability; gap against current SB; and a planning handoff without automatically materializing implementation work.