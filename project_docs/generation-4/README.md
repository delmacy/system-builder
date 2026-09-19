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

## Product direction being researched

The Builder may evolve from a system generator into a broader **operational systems control substrate** capable of modeling, assembling, compiling, deploying, observing, operating and evolving systems — potentially including itself — while remaining above and interoperable with ordinary operating systems, cloud providers, container runtimes and external infrastructure.

The Shared Semantic Kernel / Capability Exchange Plane hypothesis explores whether replaceable suite capabilities can share a very small structural language and explicit interaction contracts while remaining independently owned and deployable. The logical plane is not a requirement for a central broker, shared database or ESB. Contract compatibility is a guarantee vector rather than a schema/version boolean. Long-lived occurrences additionally require per-obligation contract lineage. Security support is an independent horizon. Autonomous runtime security requires locally durable trust continuity, bounded security-policy freshness and explicit reconciliation after disconnection. Late security reconciliation should retain only purpose-qualified witness material. Federated evidence exchange needs purpose-bounded correlation. Privacy-preserving resource governance must distinguish issuance conservation from redemption privacy. Issuer accountability separates preventive conservation from retrospective detection. Witness governance makes quorum security conditional on declared correlated-failure assumptions. Multi-domain evidence composition keeps independently valid evidence as a qualified vector. Composition-policy lifecycle adds anti-rollback, semantic non-downgrade and bounded overlap. Semantic policy-diff proof requires decision/guarantee implication over an explicit proof scope. Proof-carrying policy research adds the consumer verification boundary: a runtime may verify a qualified derivation locally, but only when proposition/dependency binding, translation assurance, proof calculus/rules, trusted steps, verifier TCB/currentness and resource bounds are explicit.

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