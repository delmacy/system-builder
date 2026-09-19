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

### Proof-carrying policy / runtime verification boundaries

- `Proof verification != re-solving`; consumer-side proof checking is distinct from replaying the producer's solver search.
- `Producer signature/provenance != semantic proof`; origin/authorization evidence and derivational evidence are separate.
- `Proof valid != translation correct`; a sound checker can validate a proof of a mistranslated proposition.
- `Proof-to-policy binding != proof-to-policy-bytes-only binding`; schema, predicate, guarantee and engine-semantic dependencies participate.
- `Proof bytes parse successfully != proof semantics understood`; calculus/rule-set/theory versions are explicit compatibility dimensions.
- `Proof file accepted by tooling != fully independently justified derivation`; trusted/hole/unsupported steps remain visible in the assurance claim.
- `Separate process != independent verification boundary`; a checker that reuses the same unqualified translator/solver remains in the same effective TCB.
- `Producer/checker separation without trust-root separation != compromise containment`.
- `Offline proof verification != infinite proof/dependency currentness`; verifier/security/schema/predicate horizons remain independent.
- `Proof replay != proof requalification`; changed dependencies require invalidation or a new qualification.
- `Proof semantically valid != operationally admissible under every runtime budget`; proof checking needs bounded CPU/memory/size/depth profiles.
- `Proof artifact != policy authority/business truth/currentness authority`; proofs remain evidence about identified canonical/contract artifacts.

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
- **Shared Semantic Kernel / Capability Exchange Plane:** twenty-seven material deep-evidence consolidations are represented across the family artifacts, now extending semantic non-downgrade/policy-diff proof into proof-carrying policy and autonomous runtime verification. `RESEARCH_ACTIVE`, not saturated.

## Latest material consolidation — 2026-09-19

### Proof-carrying exchange policy / runtime verification boundary

Evidence classes: Necula Proof-Carrying Code and proof-carrying code with untrusted proof rules; cvc5 proof production plus Alethe/LFSC external proof formats/checkers; LFSC proof-signature compatibility; Cedar SymCert/SymCC verified symbolic translation; CompCert verified-compilation lessons; prior G4 semantic policy-diff, composition-policy lifecycle, security-floor and runtime-autonomy research.

Material delta:

- separated proof verification from re-solving and from producer signatures/provenance attestations;
- defined the proof-carrying value proposition as replacing trust in a large producer/solver stack with a smaller qualified consumer verifier only for the covered formal subset;
- established that a portable proof must bind the exact proposition plus policy, schema, custom-predicate, guarantee, time/error and other semantic dependencies, not policy bytes alone;
- promoted policy-to-formal-model translation correctness to a first-class proof boundary; a valid proof of a mistranslated formula is not a policy proof;
- distinguished verified translation, translation-validation evidence, conformance/differential evidence and producer attestation as different assurance classes;
- made proof language/calculus, rule/signature version and theory profile explicit compatibility dimensions;
- required trusted/hole/unsupported proof steps to remain visible rather than being silently upgraded to fully independent verification;
- kept verifier bugs, verifier version skew and verifier security retirement inside the TCB/currentness model;
- established that producer compromise containment requires semantic and trust-root independence between producer and verifier, not merely separate processes;
- preserved capability ownership of business predicates and prohibited centralization merely to make proof generation convenient;
- preserved runtime autonomy through local verification of already-qualified artifacts within declared dependency/currentness horizons;
- separated proof replay after restart from requalification after semantic/security dependency changes;
- decomposed portability into proposition, semantic-model, proof-language and verifier portability;
- added proof-check resource budgets as operational semantics and kept resource rejection distinct from proof invalidity/abuse attribution;
- retained proof artifacts as evidence/projections rather than canonical policy/business/currentness authority.

No policy language, solver, theorem prover, proof format, proof checker, compiler, gateway, broker or provider was selected.

Highest-value remaining gap: **proof-verifier trust continuity and diverse-verifier equivalence** — determine how verifier/kernel upgrades are authorized and anti-rollback protected; whether independently implemented verifiers can be qualified as accepting the same proof language/proposition without circular reliance on one common implementation; how differential verification, verified kernels, reproducible builds and proof corpora contribute; and how runtimes transition between verifier generations without requiring a permanent old verifier or accepting proofs under an unqualified new interpretation.

## Prior material progression — compact index

Detailed durable evidence remains in the family documents indexed by `README.md`. Prior material deltas include: reservation/escrow and fencing; effect composition; interaction reference models; semantic verification; causal workflow; multidimensional compatibility; hierarchical rights; non-fenceable/heterogeneous effects; in-flight evolution; security retirement/offline floors; evidence-minimal reconciliation; privacy-preserving evidence federation; collusion/metadata side channels; privacy-preserving abuse/rate/cost governance; federated anonymous budget conservation/Sybil resistance; privacy-preserving issuer accountability/compromise containment; witness/log governance/correlated compromise; multi-domain evidence composition; composition-policy lifecycle/downgrade/rollback safety; and semantic non-downgrade/policy-diff proof.

## Non-goals

- no Rust rewrite decision;
- no graph/vector/search/stream/service-mesh/central-exchange/etcd/Kubernetes adoption decision;
- no workflow/saga/migration engine adoption decision;
- no property-testing/deterministic-simulation/checker adoption decision;
- no global serial-history/linearizability or global transaction requirement for all exchange interactions;
- no CRDT/escrow/reservation/anonymous-credential/nullifier/threshold-issuance/transparency-log/witness-network adoption decision;
- no central allocator, universal identity graph or mandatory global witness/composition service requirement;
- no Cedar/Rego/OPA/SMT/theorem-prover/policy-engine/proof-format/proof-checker adoption decision;
- no decision to make Builder an operating system;
- no unrestricted autonomous self-modification;
- no shared business model/database for integration convenience;
- no mandatory central broker/ESB;
- no G4 implementation before explicit planning authorization.

## Closure target

G4 should eventually produce a deduplicated capability map; workload/interaction profiles; performance/scale budgets; proof obligations; implementation-independent target product architecture; provider qualification matrices; prototype evidence for high-risk choices; G3->G4 traceability; gap against current SB; and a planning handoff without automatically materializing implementation work.