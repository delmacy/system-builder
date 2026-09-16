# Generation 4 — System Builder Product R&D

Status: `RESEARCH_BACKLOG_ONLY`

Generation 4 is reserved for research and development of the **System Builder product itself** after Generation 3 scope closure/reconciliation. It does not reopen G3 and does not authorize product implementation, Work Packages, Sprints, TASKs, migrations, provider adoption, or architecture replacement.

## Purpose

G3 answers primarily what must be representable, governed, traceable, executable and provable in the System Builder model. G4 investigates how the Builder product should realize those semantics with acceptable usability, performance, persistence, infrastructure access, operational cost and maintainability.

Initial G4 R&D families include:

- Human/System Interaction and Living Canvas productization.
- AI-native Builder interaction and assisted engineering.
- Computational Core & Performance Architecture, including measured TypeScript/Node hotspots and qualified Rust/WASM/native-engine candidates.
- Data, Persistence & Access Engineering.
- Infrastructure, Provider & Control Access Engineering.
- Product experimentation, benchmarking and technology qualification.

## Governing rules

1. `G3 semantic decision != G4 technology binding`.
2. `Research candidate != implementation authority`.
3. `Polyglot-ready != polyglot-from-day-one`.
4. `Measured hotspot -> candidate specialization`; language or database preference alone does not justify migration.
5. Canonical business/system meaning must remain portable across storage, query, index, runtime and infrastructure providers.
6. Generated client runtimes remain autonomous from Builder availability.
7. G4 findings should prefer provider-neutral contracts, migration paths, evidence, benchmarks and exit criteria before concrete adoption.

## Current first research record

See `research/G4_DATA_INFRA_ACCESS_ENGINEERING_BACKLOG.md` for the initial Data/Persistence/Access/Infrastructure research map.
