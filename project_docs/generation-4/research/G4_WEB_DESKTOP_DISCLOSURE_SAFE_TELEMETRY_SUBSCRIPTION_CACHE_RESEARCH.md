# G4 — Web Desktop Disclosure-Safe Telemetry Subscription & Cache Sharing

Status: `RESEARCH_ACTIVE / NON_EXECUTABLE`
Execution authority: NONE
Date: 2026-09-23
Scope: G4 Frontend Design System & UI Foundation / Web Desktop Operating Environment

## Purpose

Close the operational-performance gap left by the Web Desktop resource and observability research: determine when multiple widgets, windows, browser surfaces or users may share telemetry query work, upstream subscriptions, transport, normalized observations or cached results **without sharing authority or disclosing material one consumer could not obtain independently**.

This document is research only. It does not select Grafana, Prometheus, OpenTelemetry, an authorization engine, a cache, a broker or a transport provider. It does not authorize implementation, WBS, Work Packages, Sprints or TASKs.

Constitutional alignment:

- `Projection/cache/telemetry != canonical truth`.
- `Shared subscription != shared disclosure`.
- `Same query text != same authorized query`.
- `Can READ one result != can DISCOVER the hidden population that produced another result`.
- `Data current != authorization current`.
- `Builder != Runtime`.

## Evidence reviewed

Primary/mature evidence:

1. Grafana data-source management documents independent query permissions and query/resource caching. Repeated equivalent requests may be served from cache rather than the source, reducing upstream load, while access to a data source is separately governed.
2. Grafana Label-Based Access Control for Prometheus/Loki demonstrates that identical-looking queries can be rewritten/constrained by team authorization rules before reaching the source; therefore query text alone is not a safe sharing key.
3. Grafana's data-source security guidance explicitly warns that a user with query access can construct queries permitted by the data-source credentials; backend credentials must therefore be least-privileged and cannot be assumed equivalent to dashboard visibility.
4. Existing G4 Authorization-Aware Data Access research already establishes that authorization belongs in query semantics, not as a final post-filter, because counts, ranking, facets, graph shape, timing and other metadata can disclose hidden entities.

Sources:

- https://grafana.com/docs/grafana/latest/administration/data-source-management/
- https://grafana.com/docs/grafana/latest/administration/data-source-management/teamlbac/
- https://grafana.com/blog/data-source-security-in-grafana-best-practices-and-what-to-avoid/
- `project_docs/generation-4/research/G4_AUTHORIZATION_AWARE_DATA_ACCESS.md`
- `project_docs/generation-4/research/G4_WEB_DESKTOP_OPERATIONAL_OBSERVABILITY_MULTIDISPLAY_EXTERNAL_APPS_RESEARCH.md`
- `project_docs/generation-4/research/G4_WEB_DESKTOP_RESOURCE_BUDGET_STRESS_QUALIFICATION_RESEARCH.md`

These constrain interaction and safety semantics only; they are not provider adoption decisions.

## 1. The central distinction: share work, not authority

A future telemetry broker should distinguish at least five layers:

```text
QueryIntent
  -> AuthorizedQueryPlan
  -> UpstreamAcquisition
  -> Raw/Normalized Observation
  -> DisclosureQualifiedProjection
  -> Render Consumer
```

Sharing eligibility differs at each layer.

Two widgets may safely share a render-independent `DisclosureQualifiedProjection` when their full disclosure envelope is equivalent. They may sometimes share `UpstreamAcquisition` even when their projections differ, but only if the upstream acquisition itself does not create a cross-tenant/cross-authority data leak and downstream isolation is proven. They must never share an authorization decision merely because the query string matches.

Required invariants:

- `Same provider + same query text != same SemanticSubscriptionIdentity`.
- `Same tenant != same authorization envelope`.
- `Same authorization model revision != same relationship/currentness state`.
- `Shared upstream transport != shared result cache`.
- `Shared result cache != shared authorization decision cache`.
- `Cache hit != evidence current`.
- `Cache contains data != current consumer may discover it`.
- `One consumer revocation != permission to keep serving its old material to that consumer because another consumer remains authorized`.

## 2. Candidate SemanticSubscriptionIdentity

A safe sharing key must be semantic, not merely syntactic. Candidate fields:

```text
SemanticSubscriptionIdentity {
  providerRef
  sourceRef
  clientRef
  workspaceRef?
  tenantRef
  environmentRef
  targetSemanticScope
  querySemanticIdentity
  parameters / time range / resolution
  aggregation / downsampling semantics
  evidence/currentness requirement
  disclosure class
  authorization model/policy revision
  authorization relationship/context qualifier
  credential/impersonation mode
  data classification
  provider contract/schema revision
}
```

Not every field must become a literal cache-key component in a future implementation; the research requirement is that **equivalence must be proven across every field capable of changing what may be discovered or what the result means**.

A renderer/window/surface identity normally does not belong in the upstream identity. Multiple windows for the same authorized principal should be able to share qualified work. Conversely, two users on the same monitor wall do not become share-compatible because they are looking at the same tile.

## 3. Sharing classes

Candidate dispositions:

### `NO_SHARE`

Use when acquisition/result material cannot be safely partitioned, authorization is consumer-specific and cannot be proven equivalent, provider credentials expose broader data than the consumer may discover, or leakage risk is unknown.

### `SHARE_TRANSPORT_ONLY`

One physical connection/session may multiplex logically isolated subscriptions, but payload/result caches remain partitioned. The transport must preserve consumer/tenant routing and must not expose subscription names/counts that reveal hidden scopes.

### `SHARE_UPSTREAM_ACQUISITION_WITH_ISOLATED_PROJECTION`

Permitted only when the broker is explicitly trusted/authorized to acquire the superset and can prove disclosure-safe projection before any consumer-visible count, timing, label, exemplar, error or metadata. This is a high-assurance mode, not the default.

### `SHARE_AUTHORIZED_RESULT`

Consumers have equivalent semantic query + disclosure + authorization/currentness envelopes, so one qualified result may fan out. Revocation/currentness invalidation must detach affected consumers independently.

### `SHARE_PUBLIC/NON_SENSITIVE_RESULT`

A declared public/non-sensitive observation may be broadly shared, but its public classification itself requires provenance/currentness and cannot be inferred from absence of access rules.

Unknown equivalence degrades to `NO_SHARE`, not optimistic sharing.

## 4. Authorization-aware cache partitioning

A tenant identifier alone is insufficient. The existing authorization research already notes that a cache key containing tenant does not prove complete authorization partitioning.

Candidate cache envelope:

```text
TelemetryCacheEnvelope {
  semanticSubscriptionIdentity
  resultScope
  producedAt / observedAt / receivedAt
  evidenceWindow
  sourceCurrentness
  authorizationDecisionRef / modelRevision
  authorizationCurrentnessHorizon
  disclosureClass
  consumerCompatibilityPredicate
  provider/schema revision
  invalidation dependencies
}
```

A cache entry has at least two independent clocks:

- **evidence freshness**: whether the telemetry still describes the observed system adequately;
- **authorization freshness**: whether the consumer remains allowed to discover the cached material.

Therefore:

`Telemetry TTL != authorization TTL`.

A result can be evidence-current but authorization-stale, or authorization-current but evidence-stale. UI must represent both rather than flattening them into `cached/current`.

## 5. Revocation and membership change

Revocation is the adversarial center of shared telemetry.

Candidate consumer lifecycle:

```text
ATTACHED_CURRENT
  -> AUTH_RECHECK_REQUIRED
  -> REQUALIFYING
  -> ATTACHED_CURRENT
     | DETACHED_REVOKED
     | DETACHED_UNKNOWN_FAIL_CLOSED
     | ATTACHED_BOUNDED_STALE (only when explicitly permitted)
```

If Alice and Bob share an authorized result and Alice loses access:

- Bob's upstream acquisition need not be torn down if Bob remains qualified;
- Alice must be detached from future fan-out;
- Alice's painted UI becomes redacted/stale according to the disclosure contract rather than remaining silently usable;
- consumer-local caches/materialized exports/history must follow their own revocation policy;
- the shared cache object must not use Bob's continuing authorization as evidence that Alice remains authorized.

`One authorized consumer remains != all previous consumers remain authorized`.

## 6. Side-channel and metadata leakage

Post-filtering raw telemetry is not automatically safe. Hidden material may leak through:

- aggregate counts/cardinality;
- min/max/percentiles computed over unauthorized series;
- label values/autocomplete;
- exemplars and trace IDs;
- error messages naming hidden targets;
- query latency/cache-hit timing;
- presence/absence of a subscription;
- group/incident membership;
- high-cardinality series counts;
- sampling/downsampling boundaries;
- `no data` versus `permission denied` differences.

Therefore `SHARE_UPSTREAM_ACQUISITION_WITH_ISOLATED_PROJECTION` requires disclosure-safe aggregation semantics, not merely row/series filtering after a broad aggregate was computed.

## 7. Monitor wall and mosaic UX

The Monitoring Mosaic Editor should expose the *semantic* source/currentness/disclosure identity of a widget without exposing sensitive authorization internals.

Candidate operator-visible states:

`LIVE_SHARED`, `LIVE_DEDICATED`, `CACHED_SHARED`, `CACHED_DEDICATED`, `REQUALIFYING`, `STALE`, `PARTIAL`, `SOURCE_UNAVAILABLE`, `AUTH_RECHECK_REQUIRED`, `REDACTED`, `UNKNOWN`.

These are not implementation topology bragging badges. Normally users care about evidence/currentness; sharing mode belongs in diagnostics/Componentes/administration unless it materially affects confidence or cost.

A monitor wall restored after browser sleep must not infer current authorization from an old shared cache. Reconnect sequence is candidate:

`session/auth requalify -> subscription compatibility re-evaluate -> evidence refresh -> consumer projection -> CURRENT`.

## 8. Extended Desktop and browser-local sharing

Multiple top-level browser surfaces belonging to one qualified user/session are the easiest legitimate sharing case, but still require explicit session/currentness handling.

`BroadcastChannel`/`SharedWorker` may be candidates for browser-local fan-out or coordination; they do not become authorization authority or durable cache truth. A surface opened under another account/profile/session must not attach merely because it can reach the same browser-local coordinator.

Window transfer preserves the semantic subscription intent but must requalify the target presentation/session before attaching to shared material. `Move to display != authorization carry-over by presentation epoch`.

If the source surface closes, a shared subscription may remain alive for other qualified consumers. If the last qualified consumer detaches, broker policy may release/hibernate the acquisition after a bounded grace period; a pinned monitoring obligation may instead be represented by a server-side/durable monitoring owner. Browser visibility alone must not decide operational truth.

## 9. External application/provider implications

External systems have different authority models. A future SB provider qualification must record whether authorization is enforced:

- in upstream credentials;
- by per-user impersonation/on-behalf-of flow;
- by provider-side row/label/resource policy;
- by SB query rewriting/pushdown;
- only by downstream filtering (weak/high-risk);
- unknown.

Grafana evidence is instructive: data-source query permission and data-source credentials are separate concerns, and LBAC can add label filters to Prometheus/Loki requests. This means an SB integration cannot assume that `user can see dashboard` implies `arbitrary query through same credentials is safe`.

Candidate provider qualification field: `TelemetryAuthorizationRealization = UPSTREAM_PER_USER | UPSTREAM_POLICY_PARTITIONED | SB_PUSHDOWN_PROVEN | BROKER_SUPERSET_WITH_PROVEN_ISOLATION | DOWNSTREAM_FILTER_ONLY | UNKNOWN`.

`DOWNSTREAM_FILTER_ONLY` and `UNKNOWN` should not qualify for cross-authority result sharing by default.

## 10. Performance/resource findings

The performance objective is not maximum cache hit rate. It is **minimum redundant work subject to disclosure and currentness invariants**.

Useful ratios for NORMAL/STRESS fixtures:

```text
renderedWidgets
semanticQueryIntents
authorizedQueryPlans
upstreamAcquisitions
physicalConnections
cacheEntries
qualifiedFanoutConsumers
```

A healthy system may intentionally have more than one upstream acquisition for the same query text because authority envelopes differ. Therefore `dedup ratio` cannot be optimized without a safety denominator.

Candidate metrics:

- duplicate acquisitions within the *same proven equivalence class*;
- authorization requalification latency;
- revocation-to-consumer-detach latency;
- evidence-currentness latency after cache hit/reconnect;
- cache fragmentation by legitimate authorization partitions;
- fan-out consumers per qualified result;
- percentage of widgets whose polling is independently redundant;
- leakage-test pass/fail, which is a hard gate rather than a performance metric.

STRESS fixture: 80 monitoring widgets across 2 browser surfaces, 3 users/roles, 2 tenants, overlapping query text, membership revocation during live fan-out, one provider-side stale authorization cache, one source outage and one hidden high-cardinality label set. Expected result: bounded acquisition/render work **without cross-envelope disclosure**.

## 11. Accessibility

Sharing is invisible infrastructure; accessibility semantics must remain consumer-local and disclosure-qualified.

- A shared cache must not cause a screen reader to announce hidden series/incident counts from another consumer.
- Redaction/requalification/currentness changes are exposed textually and without color-only meaning.
- Reauthorization does not steal focus.
- A widget whose access is revoked provides a stable focusable explanation/recovery action rather than disappearing from the accessibility tree without context.
- Rate-bounded operational announcements remain required during fan-out storms.
- Equivalent list/table/text views consume the same disclosure-qualified projection as visual graphs; accessibility fallback is not allowed to bypass authorization because it uses another renderer.

## 12. Componentes impact

Candidate inventory/state-lab records:

- `TelemetrySubscriptionBrokerStatus`
- `SemanticSubscriptionInspector`
- `SubscriptionSharingDispositionBadge`
- `TelemetryEvidenceCurrentnessBadge`
- `AuthorizationCurrentnessBadge`
- `TelemetryRequalificationBoundary`
- `RevokedTelemetryWidgetState`
- `DisclosureQualifiedProjectionInspector`
- `SharedCacheDiagnosticPanel`
- `ProviderTelemetryAuthorizationQualification`
- `SubscriptionFanoutInspector`
- `TelemetryLeakageAdversarialFixture`

Each needs state matrix, provenance/currentness, keyboard/screen-reader behavior, failure/recovery and multi-surface scenarios.

## 13. Proof obligations / adversarials

1. Two widgets, same user/scope/query -> one acquisition where equivalence is proven; both retain independent render cadence.
2. Same query text, different tenants -> never share result/cache by text identity.
3. Same tenant, different field/label disclosure -> sharing does not reveal hidden labels/counts.
4. Alice/Bob share qualified result; Alice revoked -> Alice detaches within declared horizon while Bob continues.
5. Authorization provider unavailable during recheck -> no optimistic continued sharing unless an explicit bounded-stale contract exists.
6. Evidence fresh but authorization stale -> UI blocks/redacts according to policy; does not label result simply `CURRENT`.
7. Authorization fresh but evidence stale -> visible `STALE/UNKNOWN`, not healthy-by-permission.
8. Superset acquisition computes percentile before filtering -> fixture detects disclosure-semantic mismatch and disqualifies sharing.
9. Label autocomplete/facet exposes hidden target -> hard failure.
10. Cache-hit timing distinguishes existence of restricted series -> leakage test/mitigation required for sensitive class.
11. Provider credentials broader than SB user -> no authority expansion; provider qualification records the mismatch.
12. External auth expires while shared result remains painted -> explicit reauth/redaction; no effects/query expansion.
13. Secondary display closes -> shared acquisition remains only if another qualified consumer/monitoring owner exists.
14. Window moved to another surface -> target requalifies session before fan-out attach.
15. SharedWorker/BroadcastChannel restart -> reconstruct from semantic intent; local coordinator cache is not authority.
16. 80-widget stress mosaic -> redundant work bounded within proven equivalence classes, not across them.
17. Accessible table and visual graph receive identical disclosure-qualified domain.
18. `No data` caused by redaction cannot be presented as service healthy/no series without explicit disclosure-safe semantics.
19. Provider policy revision changes -> compatibility classes invalidate/requalify before reuse.
20. Historical cached evidence inspected for audit -> historical disclosure decision and current disclosure permission remain distinct.

## 14. Maturity and next gaps

Maturity: `EMERGING_TO_PARTIALLY_MATURE / MATERIAL_DELTA`.

This closes the main conceptual gap between telemetry deduplication and authorization-aware data access. It does **not** prove an implementation strategy or safe universal cache key.

Highest-value remaining gaps:

1. empirical leakage fixtures for counts/labels/timing/aggregates under shared telemetry;
2. revocation/currentness budgets by data classification and operational criticality;
3. provider qualification examples for Prometheus/Grafana, logs/traces, Docker/Portainer, n8n and infrastructure consoles;
4. browser-local versus server-side subscription ownership during hibernation/freeze/discard;
5. cache invalidation under authorization-model and provider-schema revision churn;
6. privacy-safe cost/usage accounting when a physical acquisition serves multiple authorized consumers.

Until these are empirically qualified, cross-user/cross-authority sharing remains conservative: **share only inside a proven semantic + authorization equivalence class; otherwise isolate**.
