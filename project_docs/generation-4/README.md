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

## Product direction being researched

The Builder may evolve from a system generator into a broader **operational systems control substrate** capable of modeling, assembling, compiling, deploying, observing, operating and evolving systems — potentially including itself — while remaining above and interoperable with ordinary operating systems, cloud providers, container runtimes and external infrastructure.

The Shared Semantic Kernel / Capability Exchange Plane hypothesis additionally explores whether replaceable suite capabilities can share a very small structural language and explicit interaction contracts while remaining independently owned and deployable. The logical plane is not a requirement for a central broker, shared database or ESB.

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
