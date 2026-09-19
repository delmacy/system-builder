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

- `G3 semantic decision != G4 technology binding`.
- `Research candidate != implementation authority`.
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
- `One interaction kind != one universal linearization point`; admission, durability, authoritative effect, caller observation, settlement and convergence remain distinct unless proven equivalent.
- `Safety != liveness`; `Convergence != invariant preservation`; `Commutativity is contract/invariant-relative`.
- Coordination scope follows the invariant; reservation/escrow is not a universal transaction replacement.
- `Idempotency != fencing`; `Target-local atomicity != cross-domain atomicity`.
- `Right transfer ACK != old holder fenced`; `Fencing token generated != fencing enforced`.
- `Ambiguous rights != free capacity`; holder/node loss does not prove rights safely recoverable.

### Evolution / security / evidence boundaries

- `Latest deployment != in-flight semantic migration`; `Schema compatibility != obligation compatibility`.
- `Historical semantic continuity != historical executable continuity`; `Security retirement != semantic settlement`.
- `Signature/provenance valid != currently security-admissible`; `Previously trusted != indefinitely security-admissible`.
- `Offline autonomy != unlimited stale-security operation`; `Security currentness != business authority currentness`.
- `Revocation effective time != runtime observation time`; `Golden/A-B rollback != security-floor rollback`.
- `Evidence sufficient != payload retained`; `Security evidence store != retention exemption`.
- `No witness != no effect`; `Signed/tamper-evident != non-sensitive/permanently retainable`.

### Privacy / federation / resource-governance boundaries

- `Proof continuity != global identity continuity`; `Dedup scope != global correlation scope`.
- `Proof of predicate != disclosure of source record`; `Federation != trust-domain collapse`.
- `Cryptographic key rotation != semantic identity rotation != correlation-reference rotation`.
- `Cryptographically unlinkable != operationally unlinkable`; timing, routing, trace, size, issuer/configuration and status-query metadata remain correlation surfaces.
- Privacy guarantees require explicit observer/collusion assumptions; payload privacy does not imply telemetry privacy.
- `Backpressure != abuse attribution`; rate, quota, cost, concurrency and capacity are distinct dimensions.
- `Accountability for bounded resource consumption != global subject linkability`.
- `Unlinkable presentations != unlimited presentations`; budget metadata itself belongs to the correlation budget.
- `No token replay != no Sybil/grant multiplication`; issuance/admission and redemption/spend are separate proof domains.
- `Anonymous right != unaccounted right`; offline spend remains bounded by conserved delegated capacity.
- `Privacy mechanism != conservation mechanism`; unlinkable grants still need qualified issuance authority against a shared invariant.
- `Anonymous redemption != anonymous minting authority`; offline issuers consume predelegated issuance authority rather than future global budget.
- `Per-issuer uniqueness != federation-wide uniqueness`; anti-Sybil claims must name the uniqueness proposition and scope actually proven.
- `Token cryptographically valid != issuer remained within issuance authority`; issuer compromise/over-minting is independent from token-format validity.
- `UNKNOWN issuance != free budget`; ambiguous allocation/grant capacity is consumed or quarantined until settlement.

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

- **Data/Persistence/Access:** authorization-aware access deeply consolidated; long-running revocation/currentness and empirical leakage tests remain open. `RESEARCH_ACTIVE`, not saturated.
- **Data Treatment:** temporal/streaming/replay, temporal identity/interpretation revision and retention/erasure/reproducibility consolidated. `RESEARCH_ACTIVE`, not saturated.
- **Infrastructure Engineering:** decomposed health/control-loop safety and leadership/lease/fencing/split-brain coordination consolidated. `RESEARCH_ACTIVE`, not saturated.
- **Computational Core/Performance:** workload envelopes, TypeScript/Node baseline instrumentation, worker/serialization boundaries, specialization crossover, native isolation and WASM qualification consolidated; representative SB empirical benchmarks remain absent. `RESEARCH_ACTIVE`, not saturated.
- **Lifecycle/Continuous Improvement:** incident/postmortem/action separation, semantic lifecycle graph, multidimensional closure and improvement-effect evidence consolidated. `RESEARCH_ACTIVE`, not saturated.
- **Self-Hosting/Autonomic Evolution:** secure update trust, generation consistency, version skew, anti-rollback/recovery, durable-state rollback, promotion evidence and failed-update-loop containment consolidated. `RESEARCH_ACTIVE`, not saturated.
- **Product UX/AI-native Builder:** semantic zoom, lens composition, disclosure security, Explore-to-Act separation, Preview fidelity, evidence-linked AI, accessibility and interaction workloads consolidated. `RESEARCH_ACTIVE`, not saturated.
- **Shared Semantic Kernel / Capability Exchange Plane:** twenty-one material deep-evidence consolidations are represented across the family artifacts, progressing from exchange foundations and multidimensional compatibility through causal workflow, verification, effect composition, hierarchical rights, non-fenceable/heterogeneous effects, in-flight evolution, security retirement/offline floors, evidence-minimal reconciliation, privacy-preserving federation, collusion/metadata side channels, privacy-preserving abuse governance and federated anonymous budget conservation. `RESEARCH_ACTIVE`, not saturated.

## Latest material consolidation — 2026-09-19

### Federated anonymous budget conservation & Sybil resistance

Evidence classes: IETF RFC 9576 Privacy Pass Architecture; current Privacy Pass ARC Internet-Draft; 2026 CFRG Anonymous Credit Tokens Internet-Draft; current CFRG BBS per-verifier linkability work; Walfish et al. distributed quota-enforcement research; prior G4 reservation/escrow, hierarchical-rights, privacy-federation, collusion/metadata and abuse-governance findings.

Material delta:

- established that a privacy mechanism is not a conservation mechanism: unlinkable grants do not solve who is authorized to mint shared budget;
- separated anonymous redemption from anonymous minting authority;
- formalized the hard-partition boundary: exact shared global conservation across independent offline issuers requires preallocated/conserved issuance rights, shared admission coordination, disjoint scopes or an explicitly weaker bounded-oversubscription contract;
- separated per-issuer uniqueness from federation-wide uniqueness and required the exact anti-Sybil proposition (`human`, `device`, `account`, `organization`, etc.) to be named;
- qualified federation-scoped nullifiers/pseudonyms as correlation-budget consumers rather than free privacy primitives;
- carried existing rights-transfer/fencing obligations into issuer allocation/rebalancing and required outstanding anonymous grants to remain accounted for after allocation reduction;
- introduced `UNKNOWN issuance != free budget` for ambiguous allocation/grant delivery and crash recovery;
- separated token cryptographic validity from evidence that an issuer remained inside delegated minting authority;
- identified issuer identity/configuration diversity itself as an anonymity-set partitioning/fingerprinting surface;
- retained runtime autonomy: offline issuers/runtimes may consume predelegated rights without Builder availability, but cannot infer or mint unobserved future global remainder.

No anonymous-credential scheme, allocator, issuer topology, consensus service, identity system, nullifier construction, threshold scheme, broker or provider was selected.

Highest-value remaining gap: **privacy-preserving issuer accountability and compromise containment without subject-level disclosure** — determine what aggregate/commitment/transparency evidence can prove that an issuer stayed within delegated minting authority; prevent issuer equivocation across disconnected verifiers; rotate/revoke a compromised issuer without deanonymizing historical holders; and classify which guarantees require online/shared state versus can be verified after the fact.

## Prior material progression — compact index

Detailed durable evidence remains in the family documents indexed by `README.md`. Prior material deltas include: reservation/escrow lifecycle and fencing; effect-domain composition and invariant-relative commutativity; interaction reference models and safety/liveness; semantic verification/stateful fault models; workflow migration/history compaction; causal saga/compensation semantics; long-partition federation/reconnect; queued-command validity; multidimensional contract compatibility; Shared Semantic Kernel/Exchange Plane foundations; hierarchical rights; non-fenceable effects; heterogeneous provider composition; in-flight contract evolution; security retirement; offline security-floor propagation; evidence-minimal reconciliation under erasure; privacy-preserving evidence/currentness federation; collusion/metadata-side-channel analysis; and privacy-preserving abuse/rate/cost governance.

This compact index replaces duplicated log prose in this state file; it does not supersede or erase the detailed research artifacts.

## Non-goals

- no Rust rewrite decision;
- no graph/vector/search/stream/service-mesh/central-exchange/etcd/Kubernetes adoption decision;
- no workflow/saga/migration engine adoption decision;
- no property-testing/deterministic-simulation/checker adoption decision;
- no global serial-history/linearizability requirement for all exchange interactions;
- no global transaction/coordination requirement for all cross-capability effects;
- no CRDT/escrow/reservation/anonymous-credential/nullifier/threshold-issuance adoption decision;
- no central allocator or universal identity graph requirement;
- no decision to make Builder an operating system;
- no unrestricted autonomous self-modification;
- no shared business model/database for integration convenience;
- no mandatory central broker/ESB;
- no G4 implementation before explicit planning authorization.

## Closure target

G4 should eventually produce a deduplicated capability map; workload/interaction profiles; performance/scale budgets; proof obligations; implementation-independent target product architecture; provider qualification matrices; prototype evidence for high-risk choices; G3->G4 traceability; gap against current SB; and a planning handoff without automatically materializing implementation work.