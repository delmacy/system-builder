# Generation 4 — System Builder Product R&D

Status: `RESEARCH_ACTIVE / NON_EXECUTABLE`

Generation 4 is the research-and-development layer for the **System Builder product itself** after Generation 3 architectural scope closure. It does not reopen G3 and does not authorize product implementation, Work Packages, Sprints, TASKs, migrations, provider adoption or architecture replacement.

## Purpose

G3 answers primarily what must be representable, governed, traceable, executable and provable in the System Builder model.

G4 asks how the Builder product should realize that architecture with acceptable usability, performance, persistence, infrastructure engineering, operational safety, maintainability and product intelligence.

## Current research state

See `G4_RESEARCH_STATE.md` for the consolidated research status, boundaries and maturity.

## Active G4 research families

1. **Product UX, Living Canvas & AI-Native Builder**
   - `research/G4_PRODUCT_UX_AI_NATIVE_BUILDER.md`
2. **Computational Core & Performance Engineering**
   - `research/G4_COMPUTATIONAL_CORE_PERFORMANCE_ENGINEERING.md`
3. **Data, Persistence, Access & Infrastructure Access**
   - `research/G4_DATA_INFRA_ACCESS_ENGINEERING_BACKLOG.md`
   - `research/G4_AUTHORIZATION_AWARE_DATA_ACCESS.md`
4. **Data Treatment Engineering**
   - `research/G4_DATA_TREATMENT_ENGINEERING_BACKLOG.md`
   - `research/G4_DATA_TEMPORAL_STREAMING_SEMANTICS.md`
   - `research/G4_DATA_RETENTION_ERASURE_REPRODUCIBILITY.md`
5. **Infrastructure Engineering & Control Plane**
   - `research/G4_INFRASTRUCTURE_ENGINEERING_BACKLOG.md`
6. **Engineering Lifecycle, Product Change & Continuous Improvement**
   - `research/G4_ENGINEERING_LIFECYCLE_CONTINUOUS_IMPROVEMENT.md`
7. **Self-Hosting, Autonomic Control & Bounded Self-Evolution**
   - `research/G4_SELF_HOSTING_AUTONOMIC_EVOLUTION.md`
8. **Shared Semantic Kernel / Capability Exchange Plane / Inter-Capability Boundary Model**
   - `research/G4_CAPABILITY_EXCHANGE_PLANE_RESEARCH.md`
   - `research/G4_CAPABILITY_EXCHANGE_CONTRACT_COMPATIBILITY.md`
   - `research/G4_CAPABILITY_EXCHANGE_CAUSAL_WORKFLOW_RESEARCH.md`
   - `research/G4_CAPABILITY_EXCHANGE_VERIFICATION_RESEARCH.md`
   - `research/G4_CAPABILITY_EXCHANGE_REFERENCE_MODEL_RESEARCH.md`
   - `research/G4_CAPABILITY_EXCHANGE_EFFECT_COMPOSITION_RESEARCH.md`
   - `research/G4_CAPABILITY_EXCHANGE_HIERARCHICAL_RIGHTS_RESEARCH.md`
   - `research/G4_CAPABILITY_EXCHANGE_NON_FENCEABLE_EFFECTS_RESEARCH.md`

These are research families, not committed product modules. Future synthesis may merge, split or providerize them.

## Governing rules

1. `G3 semantic decision != G4 technology binding`.
2. `Research candidate != implementation authority`.
3. `Polyglot-ready != polyglot-from-day-one`.
4. `Measured hotspot -> candidate specialization`; language or database preference alone does not justify migration.
5. Canonical meaning must remain portable across storage, query, index, runtime and infrastructure providers.
6. Generated client runtimes remain autonomous from Builder availability.
7. G4 findings should prefer provider-neutral contracts, migration paths, evidence, benchmarks and exit criteria before adoption.
8. `Self-managing != unrestricted self-modifying`.
9. `Shared lifecycle semantics != shared authority`.
10. UI/Canvas/AI/index/cache/telemetry remain projections or assistants, never silent canonical authority.
11. `Shared primitives != shared business ownership`.
12. `Logical Exchange Plane != single broker`.
13. `Interface compatibility != contract compatibility`.
14. Drivers/adapters/gateways may mediate mechanisms or semantics only within declared guarantees; they must not fabricate equivalence or become accidental canonical business owners.
15. Exchange semantics may be shared; business semantics and business ownership remain capability-local.
16. `Compatibility is multidimensional`; schema/version acceptance alone does not prove semantic, authority, delivery, ordering, temporal or operational substitutability.
17. Provider/binding capability advertisement is an offer requiring qualification against the required contract profile.
18. `Trace/correlation != business causation != authority`; observability propagation cannot become business proof by convenience.
19. `Compensation != rollback`; compensating work is a new governed effect with its own authority, currentness and evidence.
20. `Workflow progress != transport progress`; orchestration/choreography remain business coordination semantics above the logical Exchange Plane.
21. `Same happy-path output != semantic conformance`; binding qualification requires a transport-independent oracle, fault/currentness evidence and explicit treatment of `UNKNOWN`.
22. `One interaction kind != one universal linearization point`; admission, durability, authoritative effect, caller observation, settlement and convergence are distinct proof positions unless a contract proves otherwise.
23. `Safety != liveness`; eventual progress requires explicit environmental/fairness assumptions, while finite missing evidence may legitimately remain qualified `UNKNOWN`.
24. `Convergence != invariant preservation`; deterministic replica agreement cannot substitute for capability-owned business correctness.
25. `Commutativity is contract/invariant-relative`; same final bytes, disjoint writes or mergeability do not prove business effects commute.
26. Coordination scope must follow the invariant: independent/commutative execution, causal ordering, reservation/escrow, scoped serialization or compensation/manual reconciliation are qualified alternatives rather than one global default.
27. `Idempotency != fencing`; retry safety does not prove stale-holder exclusion, conflicting-intent ordering or exclusive reservation ownership.
28. `Target-local atomicity != cross-domain atomicity`; conditional writes, one-shot tokens or target reservations qualify only the effect/invariant scope they actually enforce.
29. Non-fenceable external domains must reduce autonomy, quarantine uncertainty or reject offline delegation/reallocation when no target-side equivalent can preserve the required hard invariant.

## Product direction being researched

The Builder may evolve from a system generator into a broader **operational systems control substrate** capable of modeling, assembling, compiling, deploying, observing, operating and evolving systems — potentially including itself — while remaining above and interoperable with ordinary operating systems, cloud providers, container runtimes and external infrastructure.

The Shared Semantic Kernel / Capability Exchange Plane hypothesis additionally explores whether replaceable suite capabilities can share a very small structural language and explicit interaction contracts while remaining independently owned and deployable. The logical plane is not a requirement for a central broker, shared database or ESB. Contract compatibility is being researched as a guarantee vector rather than a schema/version boolean, so local, RPC, asynchronous and other bindings are substitutable only when the required semantic profile is preserved or an explicit qualified degradation is declared. Cross-capability workflow research further separates durable business causation, compensation and process ownership from transport routing/tracing so the Exchange Plane does not become an accidental business orchestrator. Verification research now treats semantic conformance as a layered evidence problem across stateful generation, binding conformance, fault-injected histories, reconciliation and retention/erasure rather than a set of happy-path integration tests. Reference-model research additionally separates interaction-specific proof domains: commands may have one or several authoritative effect domains, queries qualify observation/currentness rather than mutation, events separate occurrence from delivery/consumer effect, streams use scoped frontiers rather than one global point, and ArtifactRef separates reference/integrity from business interpretation. Effect-composition research now makes application invariants the boundary for concurrency: operations may remain coordination-free only when their permitted independent executions/merge preserve the required invariant profile; otherwise causal ordering, bounded reservation/escrow, scoped exclusion/serialization, compensation or explicit business conflict resolution is required. Hierarchical-rights research extends bounded autonomy through conservation-preserving delegation trees without allowing allocator loss or retirement to mint replacement capacity. Non-fenceable-effect research further requires the final external target to provide a scoped exclusion equivalent—such as target-atomic one-shot consumption, exclusive reservation or an invariant-expressing conditional mutation—before such a mechanism can substitute for fencing; idempotency, delay, compensation or middleware alone cannot manufacture a missing hard-safety guarantee.

This is a research hypothesis, not a product claim or implementation authorization.

## Research workflow

```text
G3 architecture closure
        |
        v
G4 research inventory
        |
        v
benchmarks / prototypes / adversarial cases
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
