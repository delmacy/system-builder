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

### Normative proof-semantics governance boundaries

- `Latest semantics != historical semantics`; proofs bind immutable semantics snapshots rather than mutable current/latest aliases.
- `Erratum recorded != historical semantics rewritten`; corrections and ambiguity resolutions are explicit relations among snapshots.
- `S1 security-inadmissible now != S1 never existed`; future-admission security supersession does not falsify historical audit semantics.
- `Reference implementation behavior != normative semantics`; implementation behavior cannot become specification authority by accident.
- `Common test corpus != normative semantics`; finite tests constrain/qualify implementations but do not define the language.
- Multiple normative representations require an explicit precedence/derivation/discrepancy model.
- `Same language version != same semantic profile`; calculus/rules, theories and extensions are separately identified dimensions.
- `New rules added != old propositions preserved automatically`; conservative extension is a preservation proposition to establish.
- `Called clarification != semantically non-breaking`; ambiguity resolution is classified by conformance/semantic effect.
- `Unknown historical interpretation != choose current interpretation`; uncertainty remains representable.
- `Semantic resolvability != current admissibility`; local possession of old semantics does not defeat security/currentness floors.
- `Mutable alias != semantic identity`; routing/discovery pointers cannot replace immutable proof/profile references.

### Proof-semantics profile negotiation / downgrade-resistance boundaries

- `Supported profile != admissible profile for this interaction`; support, admissibility and preference are distinct sets.
- `Anti-downgrade != always choose numerically newest`; selection prevents unauthorized weakening relative to declared policy/floors.
- `No common admissible profile != fallback to any common supported profile`; incompatibility/qualified mediation remains explicit.
- Negotiation binds immutable semantic identity, peer/trust identity, interaction scope and relevant security/currentness context.
- `Negotiated semantics != transport negotiation`; transport/topology substitution must preserve selected semantic identity.
- `Version skew allowance = relationship-specific contract`; skew is bounded and asymmetric where declared, not accidental tolerance.
- Gateways/meshes/brokers may carry negotiation context but cannot silently weaken semantic guarantees.
- Unsupported theories/extensions require explicit incompatibility or qualified mediation; protocol translation cannot fabricate semantic equivalence.
- `Discovered support != negotiated contract`; registry/discovery advertisements are claims, not canonical truth.
- `Peer advertises profile != effect executed under profile`; negotiation evidence remains separate from effect evidence.
- `Consistent profile view != sufficiently current profile view`; consistency and freshness are independent.
- `Network endpoint reached != intended semantic peer authenticated`; topology redirection cannot substitute semantic authority silently.
- `Previously negotiated != indefinitely admissible`; cached negotiation evidence is bounded by identity, policy, floor and currentness horizons.
- Profile negotiation remains distinct from command ACK, business effect and convergence.

### Negotiation-evidence lifecycle / rollout-partition-rollback boundaries

- `Negotiated once != admissible forever`; negotiation evidence has a declared pinning scope and lifecycle.
- `Selected profile for admitted scope != mutable deployment default`; rollout does not silently reinterpret admitted work.
- `Historical semantic continuity != continuation authority != new-effect admissibility`.
- `Stream continuity != invisible semantic mutation`; material profile changes require an explicit generation/transition boundary unless preservation is qualified.
- `Queued work admission semantics != delivery-time execution admissibility`; both bases remain representable.
- `Retry/redelivery/failover != new semantic admission`; delivery machinery cannot silently renegotiate meaning.
- `New implementation present != new semantic profile activated`; implementation rollout and semantic activation are separate phases.
- `Implementation rollback != semantic-profile rollback != security-floor rollback`; rollback availability is phase- and dependency-specific.
- `Floor publication time != floor effective time != runtime observation time != effect time` where those distinctions are material.
- Partition reconciliation preserves action-time evidence and classifies later conflict/currentness without rewriting historical profile identity.
- `Profile change != global stop-the-world`; revalidation is scoped to changed invariants and still-pending obligations.
- `Cached profile evidence != freshly revalidated profile evidence`; provisional reuse requires explicit risk/currentness/replay qualification.
- `Topology/path migration != semantic occurrence migration`; provider/host/path changes preserve profile lineage or trigger explicit transition.
- `Admission drained != effect obligations drained != historical interpretation drained`; retirement names the horizon being closed.
- Intermediaries that buffer/reroute work preserve required profile/tenant/classification/authority/currentness evidence or expose qualified lossiness/incompatibility.

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
- **Shared Semantic Kernel / Capability Exchange Plane:** thirty-one material deep-evidence consolidations are represented across the family artifacts, now extending downgrade-resistant profile negotiation into negotiation-evidence lifecycle across concurrent rollout, queue/stream delay, partition reconciliation and rollback. `RESEARCH_ACTIVE`, not saturated.

## Latest material consolidation — 2026-09-19

### Negotiation evidence lifecycle under concurrent rollout, partition and rollback

Evidence classes: QUIC connection-version commitment/path migration/0-RTT remembered-parameter behavior; QUIC compatible-version staged fleet rollout; Apache Kafka staged binary/protocol rolling upgrades and phase-dependent downgrade limits; Kubernetes Deployment revision rollback as an operational deployment mechanism; TUF rollback/freeze/currentness threat model; prior G4 in-flight contract evolution, offline security floors, evidence reconciliation, composition-policy anti-rollback, normative semantics and downgrade-resistant negotiation research.

Material delta:

- made negotiation evidence lifecycle-scoped rather than a timeless compatibility result;
- introduced explicit pinning scope for exchange/session/workflow obligation/stream generation/queued occurrence semantics;
- separated valid historical admission, continuation authority and admissibility of new effects;
- required long-lived streams to expose semantic generation boundaries for material profile changes unless preservation is explicitly qualified;
- required queued work to retain admission-time profile/policy/floor evidence while separately evaluating delivery-time execution admissibility;
- prohibited retries, redelivery and failover from silently becoming fresh semantic negotiation;
- separated implementation rollout from semantic-profile activation and added the in-flight/drain dimension to staged deployment;
- established rollback as multidimensional and potentially asymmetric: implementation rollback does not imply semantic or security-floor rollback;
- required partitioned runtimes to preserve action-time local basis and later reconcile against successor floors without rewriting history;
- separated floor publication, effective, observation and effect times where policy semantics require them;
- scoped revalidation to changed invariants/obligations instead of global lockstep;
- distinguished cached/provisional negotiation reuse from freshly revalidated evidence;
- required topology/path/provider migration to preserve occurrence/profile lineage or record an explicit qualified transition;
- separated admission drain, outstanding effect-obligation drain and historical interpretation horizon;
- required gateways/brokers/meshes/adapters that buffer or reroute work to preserve lifecycle evidence or expose explicit lossiness/incompatibility.

No broker, RPC stack, workflow engine, service mesh, verifier, update framework, deployment mechanism or provider was selected.

Highest-value remaining gap: **semantic generation handoff for multiplexed and partially ordered exchanges** — determine how one logical occurrence containing parallel branches, multiple streams, batched commands or actor/mailbox traffic crosses a profile-generation boundary without assuming one global cutover point; how per-branch pinning composes at joins; and how revalidation/settlement evidence proves that no old-generation effect right leaks across a cutover while preserving autonomous progress where branches are independent.

## Prior material progression — compact index

Detailed durable evidence remains in the family documents indexed by `README.md`. Prior material deltas include: reservation/escrow and fencing; effect composition; interaction reference models; semantic verification; causal workflow; multidimensional compatibility; hierarchical rights; non-fenceable/heterogeneous effects; in-flight evolution; security retirement/offline floors; evidence-minimal reconciliation; privacy-preserving evidence federation; collusion/metadata side channels; privacy-preserving abuse/rate/cost governance; federated anonymous budget conservation/Sybil resistance; privacy-preserving issuer accountability/compromise containment; witness/log governance/correlated compromise; multi-domain evidence composition; composition-policy lifecycle/downgrade/rollback safety; semantic non-downgrade/policy-diff proof; proof-carrying runtime verification; verifier trust continuity/diversity; normative proof-semantics governance/ambiguity containment; and downgrade-resistant proof-semantics profile negotiation.

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
- no Kafka/Kubernetes/TUF/QUIC lifecycle mechanism adoption decision;
- no decision to make Builder an operating system;
- no unrestricted autonomous self-modification;
- no shared business model/database for integration convenience;
- no mandatory central broker/ESB;
- no G4 implementation before explicit planning authorization.

## Closure target

G4 should eventually produce a deduplicated capability map; workload/interaction profiles; performance/scale budgets; proof obligations; implementation-independent target product architecture; provider qualification matrices; prototype evidence for high-risk choices; G3->G4 traceability; gap against current SB; and a planning handoff without automatically materializing implementation work.