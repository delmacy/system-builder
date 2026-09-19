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
- `Cryptographically unlinkable != operationally unlinkable`; privacy guarantees require explicit observer/collusion assumptions.
- `Backpressure != abuse attribution`; rate, quota, cost, concurrency and capacity are distinct dimensions.
- `Accountability for bounded resource consumption != global subject linkability`.
- `No token replay != no Sybil/grant multiplication`; issuance/admission and redemption/spend are separate proof domains.
- `Privacy mechanism != conservation mechanism`; `Anonymous redemption != anonymous minting authority`.
- `Per-issuer uniqueness != federation-wide uniqueness`; anti-Sybil claims must name the proposition and scope actually proven.
- `Token cryptographically valid != issuer remained within issuance authority`; `UNKNOWN issuance != free budget`.
- `After-the-fact auditability != pre-issuance conservation`; `Aggregate arithmetic proof valid != issuance ledger complete`.
- `Append-only transparency != non-equivocation by itself`; `Liability accountability != holder identity disclosure`.
- `Duplicate observation != proven holder abuse`.
- `k-of-n signatures != k independent trust failures`; witness quorum security depends on declared correlated-failure assumptions.
- `New witness policy valid != old/new histories joined`; `Checkpoint non-equivocation != witness-policy non-equivocation`.
- `Quorum-valid checkpoint != sufficiently current checkpoint`; `Witness consistency approval != semantic/content monitoring`.

### Multi-domain evidence / composition-policy boundaries

- `All domains locally valid != cross-domain compatible state`; a boolean AND over independently green proofs is insufficient.
- `Cross-domain composition != synthetic global revision number`; autonomous proof domains retain independent lineage/currentness.
- `Domain checkpoint valid != composition predicate satisfied`; evolution evidence and cross-domain admissibility are distinct proof objects.
- `Multiple valid transparency domains != one atomic semantic state`; redundancy/diversity is not semantic atomicity.
- `One stale/forked domain != every domain invalid`; blast radius follows declared proof dependencies.
- `Evidence aggregation != semantic compatibility fabrication`; gateway/adapter mediation cannot invent missing compatibility.
- `Joint hard invariant != global transaction requirement`; preventive coordination is scoped to the named invariant.
- `Anti-rollback != anti-downgrade`; monotonic policy revision does not prove semantic safety.
- `Old/new policy coexistence != union(old permissions, new permissions)`; overlap must itself be qualified.
- `Fresh composition policy != fresh dependent security evidence`; proof horizons remain independent.
- `Unknown policy semantics != permission to ignore`; unsupported successor predicates require explicit incompatibility/quarantine/bounded fallback.

### Semantic policy-diff proof boundaries

- `Text/AST diff != semantic policy diff`; classification is a relation over qualified decisions and guarantees.
- `UNSAT in a modeled semantics != universal business/security preservation`; solver proofs carry explicit scope and assumptions.
- `Policy validates != policy is semantically correct/equivalent`; schema validation and transition proof are distinct.
- `Rule-local classification != policy-set classification`; combining/default/error semantics participate in the proof.
- `Unknown/custom predicate != semantic equality`; unmodeled semantics degrade to conditional/unproven.
- `Same admitted request set != same guarantee vector`; protected security/authority/currentness dimensions participate in non-downgrade.
- `Same policy bytes + changed schema/domain semantics != same proven behavior`; proof dependencies require invalidation/requalification.
- `Counterexample absence != proof` unless translation/search completeness is established for the declared scope.
- `Formalizable predicate != shared business ownership`; capability-owned business semantics remain capability-owned.

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
- **Shared Semantic Kernel / Capability Exchange Plane:** twenty-six material deep-evidence consolidations are represented across the family artifacts, now extending multi-domain evidence composition through composition-policy lifecycle into semantic non-downgrade/policy-diff proof. `RESEARCH_ACTIVE`, not saturated.

## Latest material consolidation — 2026-09-19

### Semantic non-downgrade / policy-diff proof

Evidence classes: Cedar policy language/reference and validation soundness documentation; Amazon Science SymCert verified SMT-based Cedar analyses (FMCAD 2026); Open Policy Agent partial-evaluation and translatable-fragment documentation; USENIX OSDI 2022 Blockaid; prior G4 composition-policy lifecycle, multi-domain evidence, contract-compatibility and security-floor research.

Material delta:

- defined restrictive/expansive/equivalent/incomparable as implication relations over a declared request/state universe rather than syntax/AST edit size;
- established that SMT/SAT results prove properties only inside the modeled semantics and assumptions; a naked `UNSAT` is not universal business/security preservation;
- separated schema/type validation from semantic transition proof;
- made policy-set combining/default/error semantics part of the comparison rather than classifying rules independently;
- established a mechanically provable subset boundary: unknown/custom predicates degrade to conditional/unproven instead of being ignored or fabricated as equivalent;
- promoted `CONDITIONALLY_SAFE` to a first-class transition result carrying prerequisite evidence such as security floors/provider qualification;
- established that proof scope includes language semantics, schema, request universe, custom-predicate contracts, security/authority/currentness assumptions and time/error semantics;
- established that same allow/deny set does not prove preservation of the guarantee vector; security/authority/currentness quality can downgrade while happy-path decisions remain unchanged;
- treated concrete counterexamples as durable proof/review artifacts and distinguished `no counterexample found` from a completeness-backed proof;
- preserved capability ownership of business predicates and required explicit incompatibility rather than centralizing domain semantics into the shared kernel;
- treated policy-engine migration and proof caching as semantic dependency problems requiring conformance/invalidation evidence;
- preserved runtime autonomy: qualified proof/policy artifacts may be verified locally within declared horizons without live Builder/solver dependency.

No Cedar/Rego/OPA adoption, SMT solver, theorem prover, policy engine, proof format, gateway, broker or provider was selected.

Highest-value remaining gap: **proof-carrying exchange policy and runtime verification boundary** — determine the minimal portable proof/evidence artifact a runtime needs to verify a policy transition locally without trusting the Builder or a specific solver; distinguish proof replay/verification from re-solving; qualify proof-engine/compiler bugs and version skew; and determine when proof-carrying artifacts materially reduce runtime trust versus merely moving trust into the proof producer/compiler.

## Prior material progression — compact index

Detailed durable evidence remains in the family documents indexed by `README.md`. Prior material deltas include: reservation/escrow and fencing; effect composition; interaction reference models; semantic verification; causal workflow; multidimensional compatibility; hierarchical rights; non-fenceable/heterogeneous effects; in-flight evolution; security retirement/offline floors; evidence-minimal reconciliation; privacy-preserving evidence federation; collusion/metadata side channels; privacy-preserving abuse/rate/cost governance; federated anonymous budget conservation/Sybil resistance; privacy-preserving issuer accountability/compromise containment; witness/log governance/correlated compromise; multi-domain evidence composition; and composition-policy lifecycle/downgrade/rollback safety.

## Non-goals

- no Rust rewrite decision;
- no graph/vector/search/stream/service-mesh/central-exchange/etcd/Kubernetes adoption decision;
- no workflow/saga/migration engine adoption decision;
- no property-testing/deterministic-simulation/checker adoption decision;
- no global serial-history/linearizability or global transaction requirement for all exchange interactions;
- no CRDT/escrow/reservation/anonymous-credential/nullifier/threshold-issuance/transparency-log/witness-network adoption decision;
- no central allocator, universal identity graph or mandatory global witness/composition service requirement;
- no Cedar/Rego/OPA/SMT/theorem-prover/policy-engine adoption decision;
- no decision to make Builder an operating system;
- no unrestricted autonomous self-modification;
- no shared business model/database for integration convenience;
- no mandatory central broker/ESB;
- no G4 implementation before explicit planning authorization.

## Closure target

G4 should eventually produce a deduplicated capability map; workload/interaction profiles; performance/scale budgets; proof obligations; implementation-independent target product architecture; provider qualification matrices; prototype evidence for high-risk choices; G3->G4 traceability; gap against current SB; and a planning handoff without automatically materializing implementation work.