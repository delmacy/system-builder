# G4 — Computational Core & Performance Engineering

Status: `RESEARCH_BACKLOG_ONLY`
Execution authority: NONE

## Problem

The System Builder may become conceptually and computationally large: graph traversal, impact analysis, constraint solving, compilation, semantic diff/merge, simulation, indexing, transformation and large-scale reconciliation can become CPU-, memory- or I/O-intensive.

The research objective is not to rewrite the product in a lower-level language. It is to preserve language-neutral boundaries so measured hotspots can be replaced by specialized engines without semantic redesign.

## Core architecture hypothesis

```text
Experience Plane       -> TypeScript/React/Next.js candidate
Application Plane      -> orchestration / APIs / authority / product workflows
Semantic Contract Plane-> language-neutral contracts
Computational Engines  -> replaceable realizations
Persistence/Providers  -> replaceable stores/providers
```

Candidate heavy engines:

- graph traversal and dependency analysis;
- blast-radius/change propagation;
- semantic diff/merge;
- compiler/build transformations;
- constraint/placement solver;
- simulation/what-if;
- indexing/search preparation;
- process-mining/analytical transforms;
- large schema/contract reconciliation;
- bulk parsing/transformation.

## Invariants

- `Builder complexity != runtime complexity`.
- `Builder performance != generated runtime performance`.
- `High-level language != measured bottleneck`.
- `Measured hotspot -> specialization candidate`.
- `Specialization candidate != rewrite authority`.
- `ImplementationLanguage != SemanticIdentity`.

## Performance classes

Research separate service-level expectations for:

1. **Interactive** — Canvas/navigation/editing/query feedback.
2. **Analytical** — graph analysis, impact analysis, search, simulation.
3. **Compilation/Batch** — build, index rebuild, re-embedding, large reconciliation.

A batch operation taking seconds or minutes may be acceptable while an interactive action with the same latency is not.

## Candidate realization paths

For a hot engine, compare:

- TypeScript/Node baseline;
- worker threads/process pools;
- Rust via N-API/native bindings;
- Rust as isolated worker/daemon over IPC;
- WASM module;
- dedicated service;
- specialized database/query engine;
- parallel/distributed worker execution.

Selection must include deployment/debugging/portability/operational cost, not CPU speed alone.

## Required measurement

Before specialization:

- p50/p95/p99 latency;
- throughput;
- memory high-water mark;
- allocation/GC pressure;
- serialization cost;
- database/query cost;
- browser payload/render cost;
- cache hit/miss behavior;
- projection lag;
- rebuild/recovery duration;
- concurrency behavior;
- cost per operation/workload.

## Anti-patterns

- rewriting by language preference;
- pushing all graph data into a graph DB before measuring graph workloads;
- moving CPU work to native code while leaving pathological I/O/query architecture intact;
- optimizing cold paths while Canvas hot paths remain slow;
- coupling semantic contracts to Rust/Node-specific types;
- using one opaque benchmark score instead of workload profiles.

## Proof obligations

1. engine boundary can be replaced without semantic redesign;
2. benchmark reproduces real or adversarial workload;
3. correctness/equivalence tests compare old and candidate realization;
4. failure/timeout/retry semantics remain explicit;
5. observability survives engine replacement;
6. deployment and rollback are bounded;
7. measured gain exceeds added operational complexity;
8. generated client runtime is not coupled to Builder engine choice unless explicitly compiled that way.

## Relationship to self-hosting

A future self-managing Builder may itself detect a hotspot and propose a new engine, but the normal controlled lifecycle remains:

```text
Finding -> Candidate -> Benchmark -> Compatibility Proof
-> Shadow/Canary -> Governed Release -> Observe -> Promote/Rollback
```

Self-diagnosis does not create self-change authority.
