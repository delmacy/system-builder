# G4 — Computational Core & Performance Engineering

Status: `RESEARCH_ACTIVE / NON_EXECUTABLE`
Execution authority: NONE
Last evidence consolidation: 2026-09-18

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
- Rust via Node-API/native bindings;
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

## Deep evidence consolidation — baseline qualification, boundary cost and specialization economics

Evidence classes reviewed: Node.js runtime documentation for Worker Threads, transfer/cloning semantics, performance/event-loop instrumentation, V8 heap diagnostics and stable Node-API; SPEC benchmark run rules for controlled/disclosed benchmark environments; and empirical WebAssembly-vs-native performance research. These are evidence sources, not technology selections.

### 1. Benchmark the end-to-end workload before the kernel

A fast inner function can remain irrelevant if query planning, database access, serialization, transfer, allocation, GC, orchestration or rendering dominates the user-visible operation. G4 therefore needs a cost decomposition before it can call a component a hotspot.

Candidate `PerformanceWorkloadEnvelope`:

```text
workloadIdentity / revision
semantic operation
input shape + size/distribution
output shape + size
concurrency / arrival model
interactive | analytical | batch class
hardware/OS/runtime revision
storage/cache state
warmup / steady-state / cold-start mode
correctness oracle
latency distribution
throughput
CPU time/utilization
memory high-water + allocation/GC pressure
event-loop delay/utilization where applicable
I/O/query time
serialization/copy/transfer bytes + time
queue/wait time
recovery/rebuild behavior
cost/resource consumption
```

Invariants:

- `Fast kernel != fast operation`.
- `CPU hotspot != end-to-end bottleneck by definition`.
- `Microbenchmark win != product workload win`.
- `Average latency != tail latency`.
- `Warm steady-state != cold-start behavior`.
- `One hardware/runtime result != portable performance claim`.

SPEC's mature run rules reinforce the general principle that benchmark environment, runtime state and tuning must be controlled and disclosed. Node's `perf_hooks` provides event-loop utilization/delay and histograms, while V8 exposes heap statistics/snapshots; the lesson is that the TypeScript/Node baseline is instrumentable enough to establish evidence before a rewrite.

### 2. TypeScript/Node baseline has multiple optimization stages

The baseline should not mean one naive single-thread implementation. Qualification should normally test, in order where applicable:

```text
semantic/query/algorithm correction
 -> data-shape + allocation reduction
 -> batching/caching/indexing where semantically safe
 -> bounded Node optimization
 -> worker pool / parallel partitioning
 -> specialized realization candidate
```

This prevents a native rewrite from merely accelerating an avoidable algorithm, N+1 query, oversized materialization or serialization-heavy boundary.

`Native implementation of pathological algorithm != qualified specialization`.

### 3. Worker Threads are a CPU-concurrency candidate, not free parallelism

Node documents Worker Threads as useful for CPU-intensive JavaScript and explicitly notes that asynchronous I/O generally does not benefit in the same way. It also recommends pooling workers rather than spawning one for every task because worker creation overhead can exceed the benefit.

Data crossing a worker boundary may be structured-cloned, transferred or shared depending on representation. Node documents that some Buffer-backed `ArrayBuffer`s cannot be transferred and are cloned, potentially copying an entire pool and increasing memory use. Therefore worker qualification must include boundary cost and ownership semantics.

Candidate worker measurements:

```text
pool startup / warmup
queue wait
compute time
structured-clone time + bytes
transfer time + detached-buffer consequences
shared-memory synchronization cost
per-worker heap/RSS
worker failure/restart cost
main event-loop relief
parallel efficiency vs worker count
```

Invariants:

- `Worker available != workload parallelizable`.
- `More workers != proportional speedup`.
- `Worker compute faster != request faster if queue/transfer dominates`.
- `Transferable buffer != semantically safe ownership transfer`.
- `Shared memory != synchronization-free memory`.
- `I/O-bound workload != worker-thread candidate by default`.

### 4. Specialization needs a crossover point, not a headline speedup

For each candidate realization, G4 should estimate total cost rather than only kernel execution:

```text
T_total = T_prepare
        + T_boundary_in
        + T_compute
        + T_boundary_out
        + T_integrate
        + T_queue
```

A native/WASM/daemon realization becomes interesting only where reduced `T_compute` dominates the new boundary/operational costs for a material workload range. This produces a **crossover region** by input size, concurrency and data shape rather than a universal claim that one realization is faster.

Candidate `SpecializationQualification`:

```text
baseline workload envelope
candidate realization + revision
correctness/equivalence evidence
crossover region
latency/throughput delta
memory delta
serialization/boundary delta
startup/warmup delta
deploy/platform matrix
debug/profile/observability parity
failure isolation
rollback/disable path
supply-chain/security delta
build/CI maintenance burden
operator complexity
net benefit conclusion
```

`Benchmark faster != product cheaper/simpler/safer`.

### 5. Native in-process bindings trade isolation for call locality

Node-API is a stable ABI for native addons and is intentionally independent of the underlying JavaScript engine, but Node documentation also warns that Node C++, V8 and libuv APIs outside Node-API do not share that ABI guarantee; external libraries can add their own compatibility constraints.

Provider-neutral implications:

- in-process native code may reduce IPC cost but shares process failure/blast radius;
- a crash or memory-safety defect can terminate/corrupt the Builder process depending on realization;
- build artifacts become platform/architecture/toolchain-sensitive;
- ABI stability does not imply dependency/toolchain/supply-chain portability;
- rollback must include the native artifact and compatible JS contract as one qualified generation.

Invariants:

- `Node-API ABI stable != whole native dependency graph portable`.
- `In-process call != zero conversion cost`.
- `Native crash isolation != process/service isolation`.
- `Native speedup != acceptable deployment matrix`.

### 6. Isolated native daemon/service trades boundary cost for fault containment

An isolated worker/daemon can preserve a language-neutral protocol and stronger crash/resource isolation, at the cost of serialization, IPC, lifecycle, supervision and version-skew concerns.

Research should compare at least:

```text
in-process native
vs persistent local daemon
vs remote/dedicated service
```

under identical semantic workloads. For coarse, long-running jobs the boundary may be negligible; for tiny high-frequency calls it may dominate.

`Process isolation != semantic isolation`; the protocol still requires versioning, authority, timeout, cancellation, idempotency and evidence semantics.

### 7. WASM is a portability/sandbox candidate, not a synonym for native speed

Empirical WebAssembly research has found workload-dependent gaps versus native execution rather than universal native parity. For G4, WASM should therefore be qualified for properties such as portable sandboxed computation, deterministic packaging or browser/server reuse where those matter, while measuring host-call/memory-conversion boundaries and actual workload performance.

Invariants:

- `WASM != native-speed guarantee`.
- `Portable bytecode != zero host integration cost`.
- `Sandbox boundary != product authority boundary`.
- `WASM candidate != Rust/native candidate by implication`.

### 8. Parallelism is bounded by dependency structure and shared bottlenecks

Parallel speedup is limited by sequential work, communication/synchronization and shared-resource contention. A graph traversal, compiler phase or reconciliation workload may also contain deterministic ordering, memory-bandwidth or database bottlenecks that do not disappear by adding workers.

Qualification must therefore sweep worker counts and observe efficiency, queueing, memory and shared-resource saturation rather than benchmark only `1 vs max cores`.

`Parallelizable subproblem != linearly scalable operation`.

### 9. Correctness and determinism remain part of the benchmark

Every optimized candidate must produce semantically equivalent output for the declared contract, including adversarial ordering, cancellation, timeout and partial-failure cases. Faster wrong output is not a performance result.

For deterministic engines, compare canonicalized outputs/hashes where valid. For simulations or algorithms with tolerated nondeterminism, declare acceptable equivalence/invariants rather than comparing only wall time.

Benchmark inputs should include representative and adversarial distributions, not only uniform synthetic data. Examples include dense vs sparse graphs, high-degree hubs, deeply nested definitions, repeated aliases, pathological diff shapes, large payloads and skewed partitions.

## Specialization decision ladder

A future performance decision should normally traverse:

```text
Observed user/operational pain
 -> workload identity + budget
 -> instrument TypeScript/Node baseline
 -> locate dominant cost
 -> fix algorithm/query/data-shape pathologies
 -> remeasure
 -> test bounded Node concurrency/worker option
 -> remeasure
 -> qualify native/WASM/service candidates if material gap remains
 -> equivalence + portability + failure + rollback proof
 -> shadow/canary where applicable
 -> adopt only through explicit implementation authority
```

No step in this ladder grants that authority itself.

## Updated adversarial cases

- microbenchmark shows 10x kernel speedup while serialization makes end-to-end operation slower;
- worker-per-request improves compute time but loses overall throughput to startup/queue overhead;
- large Buffer is unexpectedly cloned across workers, causing memory amplification;
- more workers saturate memory bandwidth/database connections and worsen p99 latency;
- native addon crashes the Builder process during a noncritical analytical operation;
- Node-API addon is ABI-compatible but an external native dependency is not available on a target platform;
- WASM compute is fast but repeated host calls dominate the workload;
- benchmark is run warm with hot caches while production workload is mostly cold;
- candidate improves p50 while worsening p99 or memory high-water enough to trigger recovery pressure;
- optimization changes ordering/determinism and produces a subtly different semantic diff/impact result;
- dedicated service benchmarks well locally but network/serialization/version-skew makes rollback and operations materially worse;
- generated client runtime becomes accidentally coupled to a Builder-only specialized engine.

## Anti-patterns

- rewriting by language preference;
- pushing all graph data into a graph DB before measuring graph workloads;
- moving CPU work to native code while leaving pathological I/O/query architecture intact;
- optimizing cold paths while Canvas hot paths remain slow;
- coupling semantic contracts to Rust/Node-specific types;
- using one opaque benchmark score instead of workload profiles;
- benchmarking only the specialized kernel while excluding transfer/serialization/queueing;
- reporting only mean throughput without tail latency and memory behavior;
- treating a worker pool, native addon or WASM module as an architecture decision before a measured crossover exists.

## Consolidated proof obligations

1. Engine boundary can be replaced without semantic redesign.
2. Benchmark reproduces representative and adversarial workload shapes and records environment/revisions.
3. Correctness/equivalence tests compare baseline and candidate realization.
4. Failure/timeout/cancellation/retry semantics remain explicit.
5. Observability survives engine replacement.
6. Deployment and rollback are bounded and platform requirements are declared.
7. Measured end-to-end gain exceeds added boundary and operational complexity.
8. Generated client runtime is not coupled to Builder engine choice unless explicitly compiled that way.
9. TypeScript/Node baseline has been profiled and algorithm/query/data-shape pathologies addressed before native specialization.
10. Worker/native/WASM/service comparisons include serialization/copy/transfer/queue/startup costs rather than compute time alone.
11. Parallel scaling is measured across concurrency levels and shared-resource saturation rather than assumed linear.
12. Tail latency, memory/GC and event-loop impact are measured where user-facing responsiveness can be affected.
13. Native dependency/ABI/platform/supply-chain compatibility and failure blast radius are part of qualification.
14. WASM portability/sandbox claims remain separate from performance claims and are workload-tested.
15. A specialization has an explicit crossover region and exit/disable path; no global `faster technology` claim substitutes for workload evidence.

## Relationship to self-hosting

A future self-managing Builder may itself detect a hotspot and propose a new engine, but the normal controlled lifecycle remains:

```text
Finding -> Candidate -> Benchmark -> Compatibility Proof
-> Shadow/Canary -> Governed Release -> Observe -> Promote/Rollback
```

Self-diagnosis does not create self-change authority.

## Current maturity and next gaps

This family now has its first deep evidence consolidation for baseline instrumentation, workload envelopes, worker/serialization boundaries, specialization crossover economics, native ABI/isolation trade-offs and WASM/parallelism qualification. It remains `RESEARCH_ACTIVE`, not saturated, because representative SB workloads and empirical benchmark fixtures have not yet been materialized.

Highest-value remaining gaps:

1. define representative graph/impact/diff/compiler/simulation/reconciliation workload families from realistic System Builder models;
2. define interactive/analytical/batch budgets and experiment methodology, including cold/warm state and concurrency distributions;
3. benchmark TypeScript/Node algorithmic baselines before any Rust/WASM/native prototype;
4. research cancellation/preemption and resource-budget semantics for long-running engines;
5. research deterministic parallelism/reproducibility requirements for compilation, diff and simulation;
6. connect Canvas interaction workloads to server-side computational workloads without conflating browser rendering with core compute;
7. define cost/FinOps evidence for persistent worker/service specialization.

## Sources / evidence class

Primary/mature sources used in this consolidation:

- Node.js Worker Threads documentation — CPU-intensive use, worker pooling, structured clone/transfer/shared-memory semantics: https://nodejs.org/api/worker_threads.html
- Node.js Performance Measurement APIs — event-loop utilization/delay and histograms: https://nodejs.org/api/perf_hooks.html
- Node.js V8 diagnostics — heap statistics/snapshots and runtime-specific diagnostics: https://nodejs.org/api/v8.html
- Node.js Node-API documentation — stable native-addon ABI and limits of that guarantee: https://nodejs.org/api/n-api.html
- SPEC CPU benchmark run rules — controlled/disclosed environment and correctness/run methodology: https://www.spec.org/cpu2017/Docs/runrules.html
- Jangda et al., *Not So Fast: Analyzing the Performance of WebAssembly vs. Native Code*, USENIX ATC 2019 / arXiv:1901.09056 — empirical evidence that WebAssembly/native performance gaps are workload/runtime dependent.

These sources establish measurement and boundary requirements only. They do not select Node Worker Threads, Rust, Node-API, WASM, SPEC workloads or any particular engine as canonical System Builder technology.
