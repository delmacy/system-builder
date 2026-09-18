# G4 Research State — System Builder Product R&D

Date: 2026-09-17
Status: `RESEARCH_ACTIVE / NON_EXECUTABLE`
Execution authority: NONE

## Purpose

Generation 4 is the product R&D layer that follows G3 architectural closure. G3 defines the implementation-independent semantic/operational substrate; G4 studies how the System Builder product should realize that substrate with usable interaction, measurable performance, robust data/infrastructure engineering, controlled lifecycle management and bounded self-management.

G4 does not reopen G3 and does not authorize implementation, WBS, Work Packages, Sprints, TASKs, migrations or provider adoption.

## Current research families

1. Product UX, Living Canvas & AI-native Builder interaction.
2. Computational Core & Performance Engineering.
3. Data, Persistence, Access & Infrastructure Access Engineering.
4. Data Treatment Engineering.
5. Infrastructure Engineering & Control Plane R&D.
6. Engineering Lifecycle, Product Change & Continuous Improvement.
7. Self-Hosting, Autonomic Control & Bounded Self-Evolution.

These families may later be deduplicated or recomposed. A research family is not automatically a product module.

## Cross-cutting rules

- `G3 semantic decision != G4 technology binding`.
- `Research candidate != implementation authority`.
- `Polyglot-ready != Polyglot-from-day-one`.
- `Measured bottleneck -> qualified specialization candidate`.
- `Technology preference -> no migration authority`.
- `Builder != Runtime`; published client runtimes remain autonomous.
- `Projection/index/cache/vector/telemetry != canonical truth`.
- `Provider ACK != effective state`.
- `AI inference != authority`.
- self-management must remain governed, reversible and externally recoverable.
- every durable technology binding requires an exit/migration path compatible with anti-lock-in goals.

## Research progression

```text
G3 CLOSED/FROZEN
      |
      v
G4 research inventory
      |
      v
workload / user / operational evidence
      |
      v
benchmarks + prototypes + failure cases
      |
      v
implementation-independent product architecture
      |
      v
provider/technology comparison
      |
      v
explicit planning authorization
      |
      v
WBS / Work Packages / implementation
```

## Current maturity

- Data/Persistence/Access: substantial backlog captured.
- Data Treatment: substantial backlog captured.
- Infrastructure Engineering: consolidated research backlog captured.
- Computational Core/Performance: consolidated initial architecture and qualification rules captured.
- Lifecycle/Continuous Improvement: consolidated initial lifecycle model captured.
- Self-Hosting/Autonomic Evolution: consolidated guarded self-management architecture captured.
- Product UX/AI-native Builder: initial product R&D program captured; deeper usability research remains open.

## Non-goals at this stage

- no decision to rewrite the Builder in Rust;
- no decision to introduce a graph database, vector database, search cluster, stream broker or Kubernetes;
- no decision to make the Builder an operating system;
- no autonomous self-modification without external trust/recovery boundaries;
- no replacement of the current G2 execution plan;
- no G4 implementation before explicit planning authorization.

## Closure target for G4 research

G4 research should eventually produce:

1. a deduplicated product capability map;
2. workload and interaction profiles;
3. performance and scale budgets;
4. data/infrastructure/lifecycle/self-hosting proof obligations;
5. implementation-independent target product architecture;
6. technology/provider qualification matrices;
7. prototype evidence for high-risk interaction or performance choices;
8. G3 -> G4 traceability;
9. gap against the then-current System Builder;
10. a planning handoff, without materializing work automatically.
