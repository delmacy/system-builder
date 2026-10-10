# G4 — Authorization-Aware Data Access

Status: `RESEARCH_ACTIVE / NON_EXECUTABLE`
Execution authority: NONE
Last evidence consolidation: 2026-09-18

## Scope

This document deepens the existing Data/Persistence/Access research. It is not a new G4 macrofront and does not select an authorization engine, database, policy language or storage provider.

The problem is to preserve authorization semantics across canonical reads, graph traversal, search, vector retrieval, projections, caches, analytics and federated/external access without treating a single provider decision as global truth.

## Evidence classes reviewed

Primary/mature evidence used in this consolidation:

- PostgreSQL Row Security documentation: row visibility/modification policies, default-deny when RLS is enabled without policies, command-specific policy behavior, and explicit bypass surfaces for owners/superusers/BYPASSRLS.
- OpenFGA documentation: immutable/versioned authorization models, contextual tuples, runtime context, consistency modes, and model testing.
- Zanzibar-family authorization architecture as represented by mature relationship-based authorization systems: relationship graph evaluation and the need to reason about authorization state currentness separately from application-data currentness.

These are evidence sources, not technology selections.

## 1. Authorization is part of query semantics, not a post-filter

Candidate access flow:

```text
QueryIntent
  -> caller/session/purpose context
  -> authorization model revision + required currentness
  -> authorized semantic scope
  -> physical query planning
  -> provider execution
  -> disclosure-safe qualification
  -> result + currentness/evidence
```

Filtering only after retrieval is insufficient for systems where search ranking, counts, autocomplete, graph degree, vector neighborhoods, facets, timing or error shape can disclose hidden entities.

Invariants:

- `Not returned != not disclosed`.
- `Post-filtered result != authorization-safe query by definition`.
- `Can READ object != can DISCOVER object existence`.
- `Can READ field != can traverse every relation from that field/object`.
- `Can query canonical store != can query every derived projection`.

## 2. Policy decision currentness is independent from data currentness

A result can be current with respect to business data and stale with respect to authorization, or the reverse. OpenFGA explicitly exposes a latency-versus-consistency trade-off: cached authorization queries can lag recent relationship changes, while higher-consistency queries bypass cache at additional cost.

Candidate `AuthorizationDecisionEnvelope`:

```text
subject / principal identity
session / tenant / organization context
operation: DISCOVER | READ | TRAVERSE | EXPORT | MUTATE | ...
resource / semantic scope
field / relation restrictions
purpose / contextual facts
authorization model revision
relationship/policy currentness requirement
decision evidence / decision time
expiry / recheck condition
```

Invariants:

- `Data current != authorization current`.
- `Authorization allowed at T1 != authorization allowed at T2`.
- `Cached allow != safe after revocation by assumption`.
- `Policy model latest != relationship state latest`.
- `Token/session valid != underlying membership still valid`.

Proof obligation: every access path that may cache authorization-sensitive material must define its revocation/currentness behavior.

## 3. Pin authorization semantics where reproducibility matters

OpenFGA authorization models are immutable/versioned and its documentation recommends explicitly supplying the model ID in production. The technology-independent lesson is that a decision should be attributable to a policy/model revision when reproducibility, audit or historical explanation matters.

```text
Historical data revision
!= Historical authorization-model revision
!= Historical relationship/context state
```

A forensic question such as “why could actor X see object Y?” may require all three.

`Current policy says DENY != historical decision was illegitimate`.

Likewise, replaying a historical query under current authorization is a different operation from reproducing the historical disclosure decision.

## 4. Contextual authorization facts need provenance and bounded lifetime

Context can include active organization, device/session posture, network zone, time, temporary delegation or claims from an identity token. OpenFGA contextual tuples demonstrate a mature pattern for request-scoped facts that should not necessarily become durable relationship state.

But ephemeral context can become stale: token claims may remain accepted until token expiry even after underlying membership changes.

Invariants:

- `Contextual fact != durable relationship`.
- `Signed claim != indefinitely current claim`.
- `Request context != canonical organizational state`.
- `Ephemeral authorization input != permission to persist it as canonical truth`.

Candidate proof fields include source, observed/issued time, expiry, verification method and currentness class.

## 5. Database RLS is defense-in-depth, not the whole semantic authority model

PostgreSQL RLS is useful evidence that enforcement can live close to canonical rows and can default-deny, but its documented bypass behavior matters: table owners normally bypass RLS, and superusers/BYPASSRLS roles always do. Some operations are outside row-policy coverage.

Therefore:

- `RLS enabled != every execution path constrained`.
- `Database role != product semantic principal by definition`.
- `RLS policy != graph/search/vector authorization automatically`.
- `Defense-in-depth control != sole semantic owner`.

A future SB may use storage-native controls as enforcement layers, but must preserve provider-neutral authorization semantics above them and test privileged/bypass paths explicitly.

## 6. Derived stores require authorization-aware construction and revocation

Search/vector/graph/cache/analytics projections create two broad strategies:

```text
A. index broad data, enforce authorization at query time
B. materialize authorization-partitioned views/indexes
```

Neither dominates universally. A risks disclosure through ranking/facets/timing and expensive per-result checks; B risks combinatorial materialization, stale membership and revocation lag.

Therefore each derived provider needs a declared authorization strategy and revocation proof.

Invariants:

- `Projection rebuildable != projection safe to disclose`.
- `Embedding hidden from UI != embedding inaccessible`.
- `Vector nearest-neighbor candidate != authorized candidate`.
- `Search count/facet != harmless metadata`.
- `Cache key contains tenant != complete authorization partitioning`.

## 7. List/search/traversal authorization differs from single-object Check

A single-object permission check does not by itself solve large list/search/graph workloads. Performing N remote checks after retrieving N candidates can be both expensive and disclosure-prone; prefiltering may require translating semantic policy into provider-specific constraints or using authorization-aware candidate generation.

Research must benchmark separately:

- point read/check;
- paginated list;
- search/autocomplete/facets/counts;
- graph neighborhood/path traversal;
- vector/hybrid retrieval;
- bulk export;
- analytics/aggregation.

`Can efficiently Check one object != can safely List all visible objects`.

Proof obligation: pagination and counts must be defined over the authorized result domain, not accidentally over the hidden physical candidate set.

## 8. Failure and degraded behavior should fail closed without inventing stronger truth

Authorization provider timeout, stale cache, policy-model mismatch or unavailable relationship state should not silently become ALLOW. At the same time, some read-only/offline runtimes may require explicitly bounded cached-authority behavior.

Candidate dispositions:

```text
ALLOW_CURRENT
DENY_CURRENT
ALLOW_BOUNDED_STALE
DENY_BOUNDED_STALE
UNKNOWN_RECHECK_REQUIRED
UNAVAILABLE_FAIL_CLOSED
```

These names are research candidates, not canonical enums.

Invariants:

- `Authorization timeout != DENY as historical fact`.
- `Authorization timeout != ALLOW`.
- `Fail closed != pretend policy evaluated to DENY`.
- `Offline cached authority != unrestricted offline authority`.

## 9. Adversarial cases

- user is removed from a group while a search authorization cache still allows results;
- autocomplete leaks a restricted project name although final document read is denied;
- graph traversal hides nodes but path length reveals hidden intermediates;
- vector retrieval computes candidates across tenants and filters only after similarity ranking;
- count/facet response reveals existence of restricted records;
- page size/continuation behavior changes according to hidden candidate population;
- authorization model revision changes while a long-running export is in progress;
- token remains valid after underlying group membership revocation;
- database connection accidentally uses an RLS-bypass role;
- canonical DB enforces RLS while a read replica/search index does not;
- cached ALLOW survives revocation longer than the declared safety window;
- historical audit re-evaluates old data using current policy and incorrectly claims the old access was unauthorized;
- external/federated source can answer data query but cannot provide authorization currentness evidence.

## 10. Consolidated proof obligations

1. Every access surface distinguishes DISCOVER, READ, TRAVERSE, EXPORT and MUTATE where semantics differ.
2. Authorization is applied before or during candidate generation where post-filtering can leak information.
3. Authorization-model revision and decision-currentness requirements are explicit for material decisions.
4. Revocation propagation is tested across canonical store, graph/search/vector projections, caches, exports and long-running jobs.
5. Pagination, ranking, counts, facets and timing do not expose unauthorized population characteristics beyond the declared disclosure policy.
6. Contextual authorization facts have source/currentness/expiry semantics and do not silently become canonical relationships.
7. Storage-native controls such as RLS are treated as enforcement/defense layers with documented bypass paths, not as the sole cross-provider semantic model.
8. Historical authorization explanation distinguishes data revision, authorization-model revision and relationship/context state.
9. Authorization provider failure has explicit UNKNOWN/fail-closed/degraded semantics; timeout never silently strengthens to ALLOW.
10. Every specialized query provider has an exit path that preserves semantic authorization even if provider-specific pushdown is lost.
11. Single-object checks and list/search/traversal/export workloads are benchmarked independently.
12. AI/Canvas retrieval uses the same disclosure boundary; retrieval context available to AI is not broader merely because output is later filtered.

## Portability / exit path

The semantic contract should express principal, operation, scope, context, model/policy revision, currentness requirement and qualified decision independently of PostgreSQL RLS, OpenFGA/Zanzibar-style engines or any future provider. Provider-specific query pushdown is an optimization/enforcement realization. Replacing it may reduce performance, but must not require redefining who is authorized to discover/read/traverse/export an object.

## Current maturity and next gaps

This subfront now has its first deep evidence consolidation and remains `RESEARCH_ACTIVE`, not saturated. Highest-value remaining gaps:

1. empirical authorization-aware search/list/graph workload fixtures and leakage tests;
2. revocation latency budgets by operation/data classification;
3. long-running export/query semantics when authority changes mid-operation;
4. cross-region/offline authorization currentness and bounded cached authority;
5. relationship/policy migration and dual-read validation across authorization-provider replacement;
6. field/edge-level authorization composition with semantic zoom/lenses and AI retrieval;
7. privacy-preserving aggregates/counts where exact disclosure is itself sensitive.

## Sources

- PostgreSQL Row Security Policies: https://www.postgresql.org/docs/current/ddl-rowsecurity.html
- OpenFGA Query Consistency Modes: https://openfga.dev/docs/interacting/consistency
- OpenFGA Immutable Authorization Models: https://openfga.dev/docs/getting-started/immutable-models
- OpenFGA Contextual Tuples: https://openfga.dev/docs/interacting/contextual-tuples
- OpenFGA Model Testing: https://openfga.dev/docs/modeling/testing

These sources constrain research boundaries only; they do not authorize adoption of PostgreSQL RLS, OpenFGA or any Zanzibar-family implementation.