# G4 — Data, Persistence, Access & Infrastructure Engineering Backlog

Status: `RESEARCH_BACKLOG_ONLY`
Generation: 4
Scope: Product R&D for the System Builder itself
Execution authority: NONE

## 1. Problem statement

The future System Builder is expected to operate over heterogeneous information and control regimes: canonical transactional data, typed relations/graphs, temporal revisions, documents and artifacts, embeddings/vectors, search indexes, logs/metrics/traces, audit evidence, runtime observations, provider inventories, infrastructure state and external-system data.

The research problem is not to choose a database or infrastructure stack now. It is to establish **provider-neutral persistence, access, movement, query, control, currentness and recovery semantics** so specialized technologies can be introduced only when measured workloads justify them.

Core rule:

```text
Canonical Data
!= Graph Projection
!= Search Index
!= Vector Index
!= Telemetry
!= Cache
!= Artifact Bytes
!= Provider Observation
```

And:

```text
Polyglot-ready != Polyglot-from-day-one
```

## 2. Initial persistence hypothesis

Use PostgreSQL as the initial canonical persistence substrate where practical, with object storage for bytes/artifacts and derived projections/indexes introduced incrementally. Graph, vector, search, analytical and telemetry engines remain candidate providers, not semantic owners.

Candidate initial shape:

```text
Canonical Contracts / Semantic Model
              |
              v
        Canonical Store
         PostgreSQL
              |
       +------+------+------------------+
       |             |                  |
       v             v                  v
Graph Projection  Search/Vector     Object Store
(rebuildable)     (rebuildable)     bytes/artifacts
       |
       +-----------------------------+
                     |
              Projection/CDC
                     |
                 Currentness

Runtime telemetry -> Telemetry Plane
Audit/business evidence -> governed evidence store/model
```

This is a hypothesis for research, not an adoption decision.

## 3. Data classes to distinguish

Research explicit classification and placement semantics for at least:

- Canonical entity/state data.
- Typed graph relations.
- Revision/temporal history.
- Workflow/runtime state.
- Business events versus integration events.
- Audit/evidence records.
- Search documents/indexes.
- Embeddings/vector indexes.
- Documents/files/blobs/media.
- Build/release/deployment artifacts.
- Logs, metrics and traces.
- Analytical/materialized projections.
- Caches/session/ephemeral state.
- Provider observations and discovered external resources.
- Secrets/credential references (never raw-secret-by-default in ordinary model storage).
- Backups/snapshots/archives.

Each class should answer: semantic owner, source of truth, rebuildability, consistency need, access pattern, expected volume/growth, mutation model, retention, temporal/as-of need, classification, tenant scope, locality/residency, backup/restore requirement, portability and exit path.

## 4. Persistence engineering vectors

### 4.1 Canonical relational persistence

Research:
- relational modeling versus JSONB extension points;
- typed relations stored relationally;
- temporal/revision models;
- immutable/evidence records versus mutable operational state;
- partitioning and archival;
- transaction boundaries;
- tenant isolation options;
- schema evolution and online migration;
- query/index design;
- connection pooling and concurrency;
- backup/restore and point-in-time recovery;
- data corruption/integrity proofs.

Invariant: `JSONB flexibility != absence of schema ownership`.

### 4.2 Graph persistence/query

Research graph workloads independently of storage technology:
- bounded traversal;
- dependency and impact paths;
- strongly connected components;
- neighborhood/subgraph queries;
- temporal graph traversal;
- typed-edge filtering;
- locality, authority, classification and currentness filtering;
- graph partitions/materialized adjacency/path indexes;
- relational recursive queries versus graph-native providers;
- rebuildable graph projections;
- graph projection lag/currentness.

Invariant: `Graph model != Graph database`.

### 4.3 Vector/semantic retrieval persistence

Research:
- embedding identity and model/version provenance;
- exact versus approximate nearest-neighbor search;
- HNSW/IVF-like trade-offs;
- index rebuild on model revision;
- tenant/scope/classification-aware retrieval;
- hybrid lexical+vector retrieval;
- chunk/document lineage;
- stale embedding detection;
- provider migration and re-embedding cost.

Invariants:
- `Embedding != Meaning`.
- `Similarity != Semantic Relation`.
- vector indexes should normally be rebuildable projections.

### 4.4 Search/index engineering

Research:
- PostgreSQL FTS baseline;
- external search providers when justified;
- fuzzy/prefix/tokenization/facets;
- ranking and hybrid retrieval;
- multilingual search and terminology expansion;
- authorization before delivery;
- revocation/index invalidation;
- tombstones/supersession;
- alias/currentness semantics;
- query explainability;
- index lag and degraded/partial states.

Invariant: `Search result != canonical truth`.

### 4.5 Object/artifact storage

Research:
- object identity versus physical bytes;
- content hashes/checksums;
- deduplication;
- large-file upload/download;
- retention/versioning;
- encryption and access control;
- signed/temporary access;
- evidence linkage;
- artifact immutability;
- lifecycle/archival tiers;
- MinIO/S3-like provider portability.

Candidate split:

```text
DB: identity + semantics + governance + metadata
Object store: physical bytes
```

### 4.6 Telemetry and evidence separation

Research explicit distinction:

```text
Operational Telemetry != Audit / Business Evidence
```

Telemetry may include high-volume logs, metrics and traces with bounded retention. Evidence may require stronger retention, identity, authority, immutability/tamper-evidence, lineage and legal/business semantics.

Do not rely on an observability backend as the sole source for canonical approval, security, financial or business evidence.

## 5. Data access engineering

A separate access plane should be researched instead of allowing each module to talk directly to every physical store.

Candidate vectors:

### 5.1 Query routing

```text
Intent / Query
   -> authorization/scope
   -> query planner/router
   -> canonical store | graph | search | vector | analytics
   -> qualified result
   -> currentness/evidence
```

Research deterministic query routing, cost-aware routing, fallback/degraded behavior and cross-provider result qualification.

### 5.2 Read models and CQRS-like projections

Research when read-optimized projections are justified versus direct canonical queries. Projection identity, revision, lag, rebuildability and failure state must be explicit.

### 5.3 Federated query

Research bounded queries across multiple stores/systems without pretending atomic global truth. Include partial results, timeouts, cross-system currentness, schema/semantic mapping, authorization and query budgets.

### 5.4 API/data-access contracts

Research stable repository/query/service contracts above persistence providers so storage replacement does not leak through application semantics.

### 5.5 Streaming/CDC/event access

Research transactional outbox, logical CDC, event streams, idempotent projection updates, ordering, replay, checkpoints, dead letters and reconciliation.

### 5.6 Bulk/analytical access

Research OLTP versus analytical workloads, batch export, columnar/warehouse/lakehouse candidates, read replicas/materialized views and resource isolation.

## 6. Data movement and synchronization

Research data movement as a first-class controlled flow:

- import/export;
- replication;
- CDC;
- event publication;
- ETL/ELT;
- migrations;
- projection rebuilds;
- backfills;
- reindex/re-embedding;
- archival/restore;
- cross-region/tenant movement;
- provider migration.

Every movement should qualify source, target, revision/checkpoint, transformation, lossiness, classification, locality, authorization, currentness and reconciliation evidence.

Invariant: `Copy completed != semantic synchronization proven`.

## 7. Consistency, reconciliation and failure semantics

Research:
- strong versus eventual consistency by data class;
- dual-write avoidance;
- UNKNOWN after uncertain side effects;
- reconcile-before-retry;
- idempotency and deduplication;
- stale projections;
- partial rebuilds;
- conflict resolution;
- distributed transaction alternatives;
- compensating actions;
- disaster recovery and restore validation.

Candidate currentness states should remain explicit rather than collapsed into healthy/unhealthy.

## 8. Infrastructure access & control engineering

Separate **knowing infrastructure**, **observing infrastructure**, and **being authorized to mutate infrastructure**.

```text
Known Resource != Authorized Resource
Provider Credential != Semantic Authority
Provider ACK != Effective State
```

Research the following access families.

### 8.1 Infrastructure provider access

Candidate contract families for cloud/bare-metal APIs:
- inventory/discovery;
- capability advertisement;
- plans/dry-run where supported;
- create/update/delete/start/stop/reboot/resize;
- networks/firewalls/IP/load-balancer/volume operations;
- quotas/regions/pricing/currentness;
- async operation IDs;
- observe/reconcile;
- rollback/compensation where meaningful.

Compare native provider APIs with OpenTofu/Terraform-style delegation without making IaC state canonical truth.

### 8.2 Host access

Research:
- agentless SSH;
- optional privileged/unprivileged SB Host Agent;
- mTLS/device identity;
- command capability allowlists;
- no unrestricted hidden shell by default;
- package/runtime/service/file/cert/user/mount management;
- patch/reboot/drain;
- evidence and replay protection;
- offline/unreachable states;
- bootstrap and recovery.

### 8.3 Workload/runtime access

Research provider-neutral workload operations across systemd/process/container/orchestrator/serverless realizations:
- materialize/start/stop/restart;
- scale/drain;
- rollout/rollback;
- health/currentness;
- logs/metrics/traces;
- config/secrets bindings;
- endpoints/volumes;
- runtime generation/cohort identity.

### 8.4 Network access

Research:
- service identity versus IP/hostname;
- DNS/service discovery;
- ingress/egress;
- firewalls/policy;
- TLS/PKI/certificate lifecycle;
- private networks/VPN/tunnels;
- NAT/proxy/gateway/load-balancing;
- cross-site/edge connectivity;
- provider-neutral endpoint/binding model.

### 8.5 Secret/credential access

Research secret-reference-only contracts, vault/provider adapters, leases, rotation, revocation, minimal scopes, short-lived credentials, SSH certificates, OAuth/service accounts, workload identity, project/tenant separation and break-glass access.

### 8.6 Out-of-band/emergency access

Research provider rescue consoles, serial/IPMI/BMC-like channels where applicable, bootstrap credentials, emergency access with reason/time/scope, immutable evidence and mandatory post-review.

## 9. External-system and provider data access

Research external APIs, databases, SaaS, file systems, legacy applications and partner systems as explicit external boundaries.

Candidate access patterns:
- API client/provider;
- database read/write integration;
- file drop/pickup;
- message/event subscription;
- webhook;
- polling;
- browser/RPA only as bounded last-resort integration;
- legacy workstation/gateway/bridge;
- partner federation.

Every access path should qualify contract/schema, identity/auth, source-of-truth status, authority, timeout, retry/idempotency, rate limits, currentness, data classification, evidence and reconciliation.

## 10. Access governance and policy

Research a uniform policy envelope around data/infrastructure access:

- who/what is the caller;
- purpose/context;
- resource scope;
- operation;
- field/relationship restrictions;
- classification;
- locality/residency;
- time/expiry;
- approval/security gate;
- evidence/audit requirement;
- rate/cost budget;
- break-glass semantics.

Preserve `READ != DISCOVER != MUTATE != APPROVE != EXPORT != ADMINISTER`.

## 11. Caching and acceleration

Research only after classifying semantics:
- local/process caches;
- distributed cache;
- query/result cache;
- graph adjacency cache;
- search/vector caches;
- CDN/static cache;
- invalidation/currentness;
- tenant/security partitioning;
- cache stampede/failure;
- stale-while-revalidate when acceptable.

Invariant: `Cache != source of truth`.

## 12. Performance, scale and native-engine boundaries

Coordinate with G4 Computational Core & Performance Architecture.

Research measured workloads before migration:
- query latency/throughput;
- graph traversal cost;
- memory footprint;
- serialization/deserialization;
- projection lag;
- index build/rebuild time;
- vector recall/latency;
- storage growth;
- backup/restore time;
- ingestion rate;
- browser/Canvas data volume.

Candidate specialization paths may include Rust/native/WASM engines, dedicated graph/search/vector/columnar stores, partitioning and worker pools.

Rule:

```text
Measured bottleneck -> qualified specialization candidate
Technology preference -> no migration authority
```

## 13. Candidate G4 capabilities / control-plane components

Research candidates, not committed modules:

- Data Catalog.
- Storage Registry.
- Schema/Contract Registry.
- Data Placement Policy.
- Storage Binding Resolver.
- Query Router / Query Planner.
- Projection Manager.
- Index Manager.
- Graph Projection Manager.
- Vector/Embedding Manager.
- CDC/Event Projection Pipeline.
- Data Movement/Migration Engine.
- Lineage/Provenance Manager.
- Retention/Archival Manager.
- Backup/Recovery Manager.
- Reconciliation Engine.
- Infrastructure Provider Registry.
- Infrastructure Control Adapter layer.
- Host Management Provider layer.
- Workload Provider layer.
- Network/Endpoint Registry.
- Secret/Credential Broker abstraction.
- Access Policy/Gate integration.
- Capacity/Cost/FinOps observer.

Run all candidates through Minimal Primitive Basis and semantic-owner review before any architecture decision.

## 14. Technology families to benchmark later

Do not adopt merely because listed here. Compare by workload and exit/migration characteristics.

- PostgreSQL and extensions.
- pgvector/vector providers.
- graph-native databases and relational-graph approaches.
- OpenSearch/Elasticsearch-like search systems.
- ClickHouse/columnar analytical and observability systems.
- Redis/Valkey-like cache/ephemeral stores.
- MinIO/S3-compatible object stores.
- Kafka/Redpanda/NATS-like event/stream systems.
- warehouse/lakehouse technologies where justified.
- OpenTelemetry ecosystem.
- OpenTofu/Terraform and native cloud APIs.
- SSH/configuration-management and optional agent approaches.
- Vault/KMS/secret-provider technologies.

Technology is realization/provider, not semantic architecture.

## 15. Adversarial research cases

- graph model fits relational DB until one traversal becomes pathological;
- graph DB becomes accidental canonical owner;
- vector index contains stale/revoked restricted content;
- search autocomplete leaks hidden entity existence;
- CDC misses/reorders events and projection claims current;
- rebuild produces a projection different from canonical revision;
- cache returns data after authorization/revocation change;
- telemetry retention deletes legally required evidence;
- object metadata exists but bytes are missing/corrupt;
- backup exists but restore is unproven;
- multi-tenant index/cache mixes tenants;
- provider API ACK succeeds while resource never converges;
- Terraform/OpenTofu state disagrees with provider observation;
- host is unreachable while infrastructure provider reports RUNNING;
- workload is degraded while host and infra are healthy;
- expired credential remains cached by a worker;
- cross-store query presents inconsistent temporal snapshots as one truth;
- schema migration blocks or corrupts a large tenant;
- dedicated technology increases operational complexity more than it improves workload performance;
- Rust/native engine improves CPU but worsens deployment/debugging/portability enough to be a net loss.

## 16. Proof obligations for future planning

Before selecting technology or materializing a G4 implementation plan, research should be able to demonstrate at least:

1. Canonical store can be identified for each material datum.
2. Every projection/index is rebuildable or explicitly justified otherwise.
3. Projection lag/currentness is observable.
4. Revocation/classification changes propagate to all searchable/indexed/cache surfaces.
5. Cross-tenant isolation holds across canonical DB, indexes, cache, artifacts and telemetry.
6. Backup restore is actually proven, not merely configured.
7. Provider migration/exit path exists for every nontrivial persistence or infrastructure binding.
8. A provider ACK cannot silently become effective truth.
9. External/managed ownership boundaries remain explicit.
10. Query routing preserves authorization, temporal/currentness and evidence semantics.
11. Search/vector similarity never silently creates canonical graph relations.
12. Data movement records source, target, transformation/checkpoint and reconciliation evidence.
13. Temporary/degraded states remain explicit rather than strengthened.
14. Specialized DB/native-engine adoption is backed by benchmarked workload evidence.
15. Builder shutdown does not break already-published autonomous client runtimes.

## 17. Future planning output

When G4 is explicitly authorized for planning, this backlog should be converted first into research questions and benchmarks, then into an implementation-independent target architecture and only afterward into WBS/Work Packages.

Expected sequence:

```text
Backlog
  -> workload/data inventory
  -> benchmark & evidence plan
  -> access/persistence contract research
  -> provider comparison
  -> architecture reconciliation
  -> target architecture
  -> migration/exit strategy
  -> proof matrix
  -> WBS / Work Packages (only with explicit authorization)
```
