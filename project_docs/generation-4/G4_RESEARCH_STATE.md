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

### Verifier trust-continuity / diversity boundaries

- `Verifier installed != verifier qualified`; verifier replacement is a TCB/trust transition.
- `Verifier artifact signature valid != verifier generation current`; integrity and currentness/anti-rollback are separate.
- `Two verifiers agree != proposition semantically valid`; diversity is meaningful only relative to a normative semantics/profile.
- `Differential disagreement != automatic majority truth`; disagreement identifies unresolved semantic/implementation divergence.
- `Passes common corpus != semantic equivalence for all proofs`; finite conformance suites are qualification evidence, not universal proof.
- `Verified implementation != independent implementation`; formal refinement and implementation diversity cover different failure classes.
- `Independent implementation != formally sound implementation`.
- `Reproducible build != semantic correctness != verifier diversity`; reproducibility establishes source/build correspondence under a declared perimeter.
- `DDC/source-binary correspondence != proof-calculus correctness`.
- `Verifier upgrade != proof reinterpretation permission`; a proof remains bound to its original immutable semantics/rule profile.
- `Historical verifier reference != executable verifier retention forever`; historical evidence can preserve identity/provenance without keeping retired code active.
- `Verifier integrity valid != verifier security-admissible`; emergency revocation can supersede normal upgrade.
- Diversity claims must expose shared parser/rule/library/toolchain/update-authority/trust-root failure domains.

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
- **Shared Semantic Kernel / Capability Exchange Plane:** twenty-eight material deep-evidence consolidations are represented across the family artifacts, now extending proof-carrying runtime verification into verifier trust continuity, anti-rollback/currentness and diverse-verifier qualification. `RESEARCH_ACTIVE`, not saturated.

## Latest material consolidation — 2026-09-19

### Proof-verifier trust continuity and diverse-verifier equivalence

Evidence classes: TUF specification/security model and multi-client conformance; Lean independent proof-checker ecosystem and Lean Kernel Arena; Alethe/Carcara and LFSC checker/profile behavior; seL4 explicit verification-property/assumption model; Reproducible Builds; Diverse Double-Compiling; prior G4 proof-carrying, semantic policy-diff, composition-policy lifecycle and security-floor research.

Material delta:

- promoted verifier replacement from package maintenance to an explicit TCB/trust transition with local anti-rollback/currentness;
- separated verifier binary integrity from verifier generation currentness/security admissibility;
- established that multiple verifier agreement is supporting evidence only relative to one normative proof-semantics/profile, not truth by voting;
- separated differential disagreement from majority resolution and required `DISAGREE/UNSUPPORTED/RESOURCE_EXHAUSTED` to remain representable;
- classified conformance corpora as finite qualification/regression evidence rather than universal semantic-equivalence proofs;
- separated formal verification from implementation diversity as complementary assurance classes;
- separated reproducible-build source/binary correspondence from semantic correctness and implementation diversity;
- bounded DDC/diverse-build value to supply-chain/source-binary correspondence rather than proof-calculus correctness;
- introduced same-semantics replacement, semantics extension, semantics correction and breaking replacement as distinct verifier-transition classes;
- prohibited silent reinterpretation of historical proof bytes under changed rule/profile semantics;
- established bounded V1/V2 overlap as a possible qualification mechanism without requiring permanent retention of V1 in the active TCB;
- separated historical verifier identity/provenance retention from executable verifier retention;
- made emergency verifier revocation independent from normal upgrade while preserving historical evidence;
- required diversity claims to name shared implementation/parser/rule/toolchain/update-authority/trust-root failure domains;
- preserved autonomous runtime verification by allowing locally persisted verifier qualification/currentness evidence within declared security horizons;
- kept verifier qualification artifacts as evidence, never capability business authority or canonical business truth.

No verifier, proof language, theorem prover, update framework, reproducible-build stack, DDC tool, compiler, gateway, broker or provider was selected.

Highest-value remaining gap: **normative proof-semantics governance and ambiguity containment** — determine how a proof language/rule profile itself is authored, versioned, tested and evolved without making one implementation the specification; how ambiguities and errata are resolved without retroactively changing historical proof meaning; how custom/theory rules enter or leave a profile; and how independent verifiers bind to immutable semantics snapshots while security fixes still supersede unsafe interpretations.

## Prior material progression — compact index

Detailed durable evidence remains in the family documents indexed by `README.md`. Prior material deltas include: reservation/escrow and fencing; effect composition; interaction reference models; semantic verification; causal workflow; multidimensional compatibility; hierarchical rights; non-fenceable/heterogeneous effects; in-flight evolution; security retirement/offline floors; evidence-minimal reconciliation; privacy-preserving evidence federation; collusion/metadata side channels; privacy-preserving abuse/rate/cost governance; federated anonymous budget conservation/Sybil resistance; privacy-preserving issuer accountability/compromise containment; witness/log governance/correlated compromise; multi-domain evidence composition; composition-policy lifecycle/downgrade/rollback safety; semantic non-downgrade/policy-diff proof; and proof-carrying runtime verification.

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
- no decision to make Builder an operating system;
- no unrestricted autonomous self-modification;
- no shared business model/database for integration convenience;
- no mandatory central broker/ESB;
- no G4 implementation before explicit planning authorization.

## Closure target

G4 should eventually produce a deduplicated capability map; workload/interaction profiles; performance/scale budgets; proof obligations; implementation-independent target product architecture; provider qualification matrices; prototype evidence for high-risk choices; G3->G4 traceability; gap against current SB; and a planning handoff without automatically materializing implementation work.