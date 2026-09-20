# Generation 4 — System Builder Product R&D

Status: `RESEARCH_ACTIVE / NON_EXECUTABLE`

Generation 4 is the research-and-development layer for the **System Builder product itself** after Generation 3 architectural scope closure. It does not reopen G3 and does not authorize product implementation, Work Packages, Sprints, TASKs, migrations, provider adoption or architecture replacement.

## Purpose

G3 answers primarily what must be representable, governed, traceable, executable and provable in the System Builder model. G4 asks how the Builder product should realize that architecture with acceptable usability, performance, persistence, infrastructure engineering, operational safety, maintainability and product intelligence.

See `G4_RESEARCH_STATE.md` for consolidated status, boundaries and maturity.

## Active G4 research families

1. **Product UX, Living Canvas & AI-Native Builder** — `research/G4_PRODUCT_UX_AI_NATIVE_BUILDER.md`
2. **Computational Core & Performance Engineering** — `research/G4_COMPUTATIONAL_CORE_PERFORMANCE_ENGINEERING.md`
3. **Data, Persistence, Access & Infrastructure Access** — `research/G4_DATA_INFRA_ACCESS_ENGINEERING_BACKLOG.md`, `research/G4_AUTHORIZATION_AWARE_DATA_ACCESS.md`
4. **Data Treatment Engineering** — `research/G4_DATA_TREATMENT_ENGINEERING_BACKLOG.md`, `research/G4_DATA_TEMPORAL_STREAMING_SEMANTICS.md`, `research/G4_DATA_RETENTION_ERASURE_REPRODUCIBILITY.md`
5. **Infrastructure Engineering & Control Plane** — `research/G4_INFRASTRUCTURE_ENGINEERING_BACKLOG.md`
6. **Engineering Lifecycle, Product Change & Continuous Improvement** — `research/G4_ENGINEERING_LIFECYCLE_CONTINUOUS_IMPROVEMENT.md`
7. **Self-Hosting, Autonomic Control & Bounded Self-Evolution** — `research/G4_SELF_HOSTING_AUTONOMIC_EVOLUTION.md`
8. **Shared Semantic Kernel / Capability Exchange Plane / Inter-Capability Boundary Model**
   - `research/G4_CAPABILITY_EXCHANGE_PLANE_RESEARCH.md`
   - `research/G4_CAPABILITY_EXCHANGE_CONTRACT_COMPATIBILITY.md`
   - `research/G4_CAPABILITY_EXCHANGE_CAUSAL_WORKFLOW_RESEARCH.md`
   - `research/G4_CAPABILITY_EXCHANGE_VERIFICATION_RESEARCH.md`
   - `research/G4_CAPABILITY_EXCHANGE_REFERENCE_MODEL_RESEARCH.md`
   - `research/G4_CAPABILITY_EXCHANGE_EFFECT_COMPOSITION_RESEARCH.md`
   - `research/G4_CAPABILITY_EXCHANGE_HIERARCHICAL_RIGHTS_RESEARCH.md`
   - `research/G4_CAPABILITY_EXCHANGE_NON_FENCEABLE_EFFECTS_RESEARCH.md`
   - `research/G4_CAPABILITY_EXCHANGE_HETEROGENEOUS_EFFECT_COMPOSITION_RESEARCH.md`
   - `research/G4_CAPABILITY_EXCHANGE_INFLIGHT_CONTRACT_EVOLUTION_RESEARCH.md`
   - `research/G4_CAPABILITY_EXCHANGE_OFFLINE_SECURITY_FLOORS_RESEARCH.md`
   - `research/G4_CAPABILITY_EXCHANGE_EVIDENCE_MINIMAL_SECURITY_RECONCILIATION.md`
   - `research/G4_CAPABILITY_EXCHANGE_PRIVACY_PRESERVING_EVIDENCE_FEDERATION.md`
   - `research/G4_CAPABILITY_EXCHANGE_PRIVACY_COLLUSION_METADATA_RESEARCH.md`
   - `research/G4_CAPABILITY_EXCHANGE_PRIVACY_ABUSE_GOVERNANCE_RESEARCH.md`
   - `research/G4_CAPABILITY_EXCHANGE_FEDERATED_ANONYMOUS_BUDGET_CONSERVATION.md`
   - `research/G4_CAPABILITY_EXCHANGE_PRIVACY_PRESERVING_ISSUER_ACCOUNTABILITY.md`
   - `research/G4_CAPABILITY_EXCHANGE_WITNESS_GOVERNANCE_CORRELATED_COMPROMISE.md`
   - `research/G4_CAPABILITY_EXCHANGE_MULTI_DOMAIN_EVIDENCE_COMPOSITION.md`
   - `research/G4_CAPABILITY_EXCHANGE_COMPOSITION_POLICY_LIFECYCLE_RESEARCH.md`
   - `research/G4_CAPABILITY_EXCHANGE_SEMANTIC_POLICY_DIFF_PROOF.md`
   - `research/G4_CAPABILITY_EXCHANGE_PROOF_CARRYING_POLICY_RUNTIME_VERIFICATION.md`
   - `research/G4_CAPABILITY_EXCHANGE_VERIFIER_TRUST_CONTINUITY_DIVERSITY.md`
   - `research/G4_CAPABILITY_EXCHANGE_NORMATIVE_PROOF_SEMANTICS_GOVERNANCE.md`
   - `research/G4_CAPABILITY_EXCHANGE_PROFILE_NEGOTIATION_DOWNGRADE_RESISTANCE.md`
   - `research/G4_CAPABILITY_EXCHANGE_NEGOTIATION_EVIDENCE_LIFECYCLE.md`
   - `research/G4_CAPABILITY_EXCHANGE_SEMANTIC_GENERATION_HANDOFF.md`
   - `research/G4_CAPABILITY_EXCHANGE_HANDOFF_RECOVERY_COMPACTION.md`
   - `research/G4_CAPABILITY_EXCHANGE_CROSS_RUNTIME_FRONTIER_DR.md`
   - `research/G4_CAPABILITY_EXCHANGE_SPLIT_BRAIN_AUTHORITY_REJOIN.md`
   - `research/G4_CAPABILITY_EXCHANGE_PARTITION_DEGRADED_MODE_CONTRACTS.md`
   - `research/G4_CAPABILITY_EXCHANGE_DEGRADED_DEPENDENCY_GUARANTEE_SYNTHESIS.md`
   - `research/G4_CAPABILITY_EXCHANGE_GUARANTEE_EVIDENCE_CACHE_INVALIDATION.md`

These are research families, not committed product modules. Future synthesis may merge, split or providerize them.

## Governing rules

The detailed cumulative boundary set is canonicalized in `G4_RESEARCH_STATE.md` and in the dedicated research artifacts. The following constitutional rules govern every G4 round and must not be weakened by compaction:

- `G3 semantic decision != G4 technology binding`; `Research candidate != implementation authority`.
- `Polyglot-ready != polyglot-from-day-one`; `Measured hotspot -> candidate specialization`.
- Canonical meaning remains portable across storage, query, index, runtime and infrastructure providers.
- Generated client runtimes remain autonomous from Builder availability.
- `Self-managing != unrestricted self-modifying`; `Shared lifecycle semantics != shared authority`.
- UI/Canvas/AI/index/cache/telemetry remain projections or assistants, never silent canonical authority.
- `Shared primitives != shared business ownership`; `Logical Exchange Plane != single broker`.
- `Interface compatibility != contract compatibility`; compatibility is multidimensional.
- Drivers/adapters/gateways may mediate only declared guarantees and must not fabricate semantic equivalence or become canonical business owners.
- Exchange semantics may be shared; business semantics and business ownership remain capability-local.
- `Trace/correlation != business causation != authority`; `Compensation != rollback`; `Workflow progress != transport progress`.
- `UNKNOWN` is a qualified evidence disposition, never permission to guess.
- Coordination scope follows the named invariant; idempotency, fencing, reservation, convergence and atomicity are not synonyms.
- Historical semantic continuity, executable continuity, security admissibility and settlement remain independent dimensions.
- Offline autonomy is bounded by explicit security/currentness horizons and cannot imply perpetual trust.
- Privacy, identity, correlation, deduplication, conservation, admission, redemption and anti-Sybil guarantees remain separately scoped.
- Transparency, witness quorum, currentness and semantic/content monitoring remain separate proof domains.
- Multi-domain evidence composition does not create a synthetic global revision or global transaction requirement.
- `Anti-rollback != anti-downgrade`; old/new policy coexistence is not the union of their permissions.
- `Text/AST diff != semantic policy diff`; solver results are scoped to their modeled semantics and assumptions.
- `Same admitted request set != same guarantee vector`; unknown/custom predicates degrade proof rather than fabricate equivalence.
- `Proof verification != re-solving`; a runtime proof checker verifies a derivation rather than trusting or replaying the producer's search process.
- `Producer signature/provenance != semantic proof`; origin/authorization and machine-checkable derivation are separate evidence domains.
- `Proof valid != translation correct`; policy-to-formal-model translation is itself a qualified proof boundary.
- `Proof file accepted != fully independently justified derivation`; unsupported/trusted/hole steps must remain visible in the assurance claim.
- `Separate producer/checker process != independent TCB`; compromise containment requires qualified semantic and trust-root separation.
- `Offline proof verification != infinite dependency currentness`; verifier, security floor, schema and predicate dependencies retain independent horizons.
- Proof artifacts remain evidence/projections, not canonical policy authority, business truth or currentness authority.
- `Verifier installed != verifier qualified`; verifier replacement is a TCB/trust transition, not an ordinary package update.
- `Two verifiers agree != proposition semantically valid`; diverse implementations require binding to a normative semantics/profile.
- `Differential disagreement != majority truth`; disagreement is evidence requiring qualification/reconciliation.
- `Passes common corpus != semantic equivalence for all proofs`; conformance corpora are finite qualification evidence.
- `Verified implementation != independent implementation`; formal verification and implementation diversity cover different failure classes.
- `Reproducible build != semantic correctness != verifier diversity`; reproducibility strengthens source/build correspondence and provenance only.
- `Verifier upgrade != proof reinterpretation permission`; proof rule/profile meaning cannot change silently under the same identity.
- Historical verifier references do not require indefinite executable verifier retention in the active TCB.
- `Latest semantics != historical semantics`; proof evidence binds an immutable normative semantics snapshot, not a mutable latest alias.
- `Erratum recorded != historical semantics rewritten`; substantive corrections and ambiguity resolutions create explicit successor/correction relations.
- `Reference implementation behavior != normative semantics`; tests and implementations are qualification evidence, not accidental semantic authority.
- `Semantic resolvability != current admissibility`; local possession of an old semantics snapshot does not defeat security/currentness floors.
- `Supported profile != admissible profile for this interaction`; negotiation operates over policy-qualified admissibility, not arbitrary support intersection.
- `Anti-downgrade != always choose numerically newest`; selection must prevent unauthorized weakening while respecting explicit compatibility/deployment constraints.
- `Negotiated semantics != transport negotiation`; selected immutable semantic identity survives transport/topology substitution.
- `Discovered support != negotiated contract`; advertisements are claims, not canonical truth or proof of executed semantics.
- `Previously negotiated != indefinitely admissible`; cached negotiation evidence remains bounded by identity, policy, security-floor and currentness horizons.
- `Negotiated once != admissible forever`; negotiation evidence has a declared pinning scope and lifecycle.
- `Historical semantic continuity != continuation authority != new-effect admissibility`; profile retirement may preserve interpretation while blocking future effects.
- `Retry/redelivery != new semantic admission`; queueing, failover and topology change must preserve profile lineage or expose explicit revalidation.
- `Implementation rollback != semantic-profile rollback != security-floor rollback`; rollback availability is phase- and dependency-specific.
- `Occurrence identity != one global semantic generation`; generation may be branch/lane scoped when hard invariants are independent.
- `Per-branch order != global order`; transport lanes cannot fabricate a total business order.
- `Generation marker observed != old effect rights fenced`; conflicting new rights require invariant-qualified exclusion/settlement evidence.
- `Batch acknowledgement != semantic atomicity`; batching does not create a business transaction or generation boundary.
- Mixed-generation joins require explicit semantic compatibility and settlement predicates, not schema readability alone.
- `Recoverable state != retained full history`; frontier compaction may summarize history only when every live safety/recovery question remains answerable.
- `Compaction != semantic forgetting`; references below a retained frontier require explicit below-floor behavior rather than fabricated absence.
- Transport replay, deduplication, semantic resolvability and authority/security horizons are distinct.
- `Dedup window expired != old obligation became new`; late work preserves lineage or becomes explicitly below-floor/unknown.
- `Checkpoint complete != external effects settled`; unresolved external effects survive snapshots and compaction as qualified evidence.
- Negative/fencing evidence must outlive every path that could otherwise resurrect stale work, or be subsumed by a stronger durable fence.
- `Frontier transferred != frontier admissible here`; DR evidence coverage is multidimensional and provider-local progress cannot manufacture semantic/effect completeness.
- `Endpoint moved != old effect authority fenced`; promotion/failback are authority transitions where conflicting effects are possible.
- `Connectivity restored != authority reconciled`; split-brain rejoin classifies convergent state, conserved rights, security state and irreversible effects under distinct reconciliation laws.
- `Leader/lease elected != stale holder externally fenced`; effect-side exclusion must be enforced where the effect occurs or otherwise independently proven.
- `Capability degraded != every operation degraded identically`; degraded behavior is operation/invariant-scoped.
- `Health check green != operation admissible`; reachability, capacity, semantic compatibility, currentness, authority and effect rights remain separate dimensions.
- `Graceful degradation != guarantee weakening by surprise`; hard safety/security/ownership invariants are never silently relaxed for availability.
- `Failover target healthy != failover target contract-compatible`; routing resilience cannot become semantic downgrade.
- `Resource overload != semantic incompatibility`; shedding/priority/capacity borrowing cannot manufacture business authority or transfer semantic rights.
- `Dependency healthy again != degraded obligations settled`; normal-mode resumption requalifies queued, divergent and unknown work.
- `Dependency graph != orchestration ownership`; graph edges describe required claims, not permission for the Exchange Plane to own business workflow.
- `All dependencies returned != end-to-end guarantee satisfied`; effective guarantees are multidimensional and constrained by material dependency evidence.
- `Optional enrichment != hard dependency`; optionality is scoped to a root operation/guarantee and cannot be generalized globally.
- `Critical path != minimal semantic cut set`; cut sets are invariant/guarantee-specific, not inferred from latency or topology.
- `Fallback available != fallback contract-equivalent`; substitution is transparent only when the required guarantee vector is preserved.
- `Retryable locally != safe to retry end-to-end`; retry authority, stable effect identity and attempt/time/cost budgets remain bounded across layers.
- `Graph acyclic structurally != no feedback cycle`; retries, fallbacks, queues and recovery can create dynamic amplification cycles.
- `Circuit breaker state != semantic admission authority`; resilience machinery protects execution but does not own business truth.
- `Cache hit != current/admissible evidence`; evidence reuse is claim-, tenant-, trust-, profile-, authority- and floor-scoped.
- `Invalidation sent != invalidation observed everywhere`; correctness cannot depend solely on global invalidation delivery.
- `Stale-but-allowed != current`; stale reuse remains explicit in the synthesized guarantee vector and may be forbidden for security-sensitive claims.
- `Cached absence != proof of non-occurrence`; negative evidence remains claim-scoped, bounded and distinct from `UNKNOWN`.
- `Older fetched evidence != permission to roll back local floor`; monotonic security/profile state survives cache refresh and restart.
- `Cache stampede control != permission to extend semantic freshness`; refresh coalescing and jitter remain operational containment only.

## Product direction being researched

The Builder may evolve from a system generator into a broader **operational systems control substrate** capable of modeling, assembling, compiling, deploying, observing, operating and evolving systems — potentially including itself — while remaining above and interoperable with ordinary operating systems, cloud providers, container runtimes and external infrastructure.

The Shared Semantic Kernel / Capability Exchange Plane hypothesis explores whether replaceable suite capabilities can share a very small structural language and explicit interaction contracts while remaining independently owned and deployable. The logical plane is not a requirement for a central broker, shared database or ESB. Contract compatibility is a guarantee vector rather than a schema/version boolean. Long-lived occurrences additionally require per-obligation contract lineage. Security support is an independent horizon. Autonomous runtime security requires locally durable trust continuity, bounded security-policy freshness and explicit reconciliation after disconnection. Late security reconciliation should retain only purpose-qualified witness material. Federated evidence exchange needs purpose-bounded correlation. Privacy-preserving resource governance must distinguish issuance conservation from redemption privacy. Issuer accountability separates preventive conservation from retrospective detection. Witness governance makes quorum security conditional on declared correlated-failure assumptions. Multi-domain evidence composition keeps independently valid evidence as a qualified vector. Composition-policy lifecycle adds anti-rollback, semantic non-downgrade and bounded overlap. Semantic policy-diff proof requires decision/guarantee implication over an explicit proof scope. Proof-carrying policy research adds the consumer verification boundary. Verifier trust-continuity research adds checker-generation qualification against immutable normative semantics. Normative proof-semantics governance adds immutable semantic snapshots and explicit errata/supersession. Downgrade-resistant profile negotiation separates support, admissibility and preference. Negotiation-evidence lifecycle adds pinning scope and separate admission/continuation/new-effect decisions. Semantic-generation handoff adds partial-order generation frontiers and invariant-scoped cutover. Handoff recovery/compaction adds proof-preserving frontier summaries and explicit below-floor semantics. Cross-runtime DR adds multidimensional evidence coverage, authority-aware promotion/failback and runtime-local recovery dependency closure. Split-brain rejoin adds qualified divergence frontiers and state/effect-specific reconciliation laws. Degraded-mode contract research adds operation-scoped failure behavior, multidimensional dependency qualification, guarantee-preserving composition, static-stable autonomy and the rule that infrastructure health/failover/resource pressure cannot silently redefine business semantics. Degraded dependency synthesis adds dependency-claim graphs, invariant-specific minimal semantic cut sets, explicit hard/optional/alternative relations, end-to-end guarantee vectors, bounded retry/fallback budgets and dynamic feedback-cycle containment without turning the Exchange Plane into an orchestrator. Distributed guarantee-evidence caching adds claim-scoped multidimensional freshness, negative-evidence discipline, monotonic floor-aware revalidation, derived-evidence lineage, bounded offline horizons and stampede containment without a central guarantee oracle.

This is a research hypothesis, not a product claim or implementation authorization.

## Research workflow

```text
G3 architecture closure
        |
        v
G4 research inventory
        |
        v
benchmarks / prototypes / failure cases
        |
        v
implementation-independent product architecture
        |
        v
provider / technology qualification
        |
        v
explicit planning authorization
        |
        v
WBS / Work Packages / implementation
```

Do not materialize G4 automatically from these documents.