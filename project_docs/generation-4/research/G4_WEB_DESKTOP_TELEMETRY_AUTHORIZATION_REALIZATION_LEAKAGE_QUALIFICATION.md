# G4 — Web Desktop Telemetry Authorization Realization & Leakage Qualification

Status: `RESEARCH_ACTIVE / NON_EXECUTABLE`
Execution authority: NONE
Date: 2026-09-23
Scope: G4 Frontend Design System & UI Foundation / Web Desktop Operating Environment

## Purpose

Refine the provider-realization and leakage-test gaps left by `G4_WEB_DESKTOP_DISCLOSURE_SAFE_TELEMETRY_SUBSCRIPTION_CACHE_RESEARCH.md`. This artifact asks how the candidate `TelemetrySubscriptionBroker` can classify provider authorization boundaries, prove safe sharing classes, and measure revocation/currentness without turning cache efficiency into an authority leak.

This is research only. It does not select Grafana, Loki, Tempo, Prometheus, Portainer, n8n, OpenTelemetry, a reverse proxy, a cache, a broker or an authorization engine. It does not authorize implementation, WBS, Work Packages, Sprints or TASKs.

Constitutional alignment:

- `Builder != Runtime`.
- `Projection/cache/telemetry != canonical truth`.
- `Share work != share authority`.
- `Tenant isolation != user/resource authorization`.
- `Provider accepts tenant header != client may choose tenant header`.
- `Dashboard visibility != datasource query authority`.
- `Cache hit != current/admissible evidence`.
- `No data != no problem != no permission`.
- `Revocation requested != revocation observed at every cache/fan-out boundary`.

## Evidence reviewed

Primary/mature sources reviewed on 2026-09-23:

1. Grafana data-source permissions and query/resource caching: query permission and cache behavior are distinct; repeated queries may be served from cache, and datasource query permission can be broader than dashboard visibility.
2. Grafana LBAC for Prometheus/Loki: the same datasource can yield different authorized result domains by team label policy; cross-tenant support is not universal and LBAC has backend-specific constraints.
3. Loki multi-tenancy: `X-Scope-OrgID` identifies tenant scope; tenant isolation is an upstream partition, not proof of per-user disclosure equivalence. Query fairness can additionally distinguish actors within a tenant.
4. Tempo multi-tenancy: `X-Scope-OrgID` scopes reads/writes, but Tempo documents that the header is expected to be set by a trusted authenticating reverse proxy; allowing clients to choose it directly can permit unauthorized cross-tenant access. Cross-tenant federation is a separate capability.
5. Prometheus security model: dashboard permissions do not imply datasource permissions, and arbitrary PromQL access through a datasource/proxy must be treated as a distinct authority surface.
6. Portainer API: API tokens inherit the Portainer user's permissions; a user restricted to one environment is correspondingly restricted through the API. Portainer can also proxy Docker/Kubernetes API calls, so provider API authority may reach underlying effect surfaces.

Sources:

- https://grafana.com/docs/grafana/latest/administration/data-source-management/
- https://grafana.com/docs/grafana/latest/administration/data-source-management/teamlbac/
- https://grafana.com/docs/loki/latest/operations/multi-tenancy/
- https://grafana.com/docs/loki/latest/operations/query-fairness/
- https://grafana.com/docs/tempo/latest/operations/manage-advanced-systems/multitenancy/
- https://grafana.com/docs/tempo/latest/operations/authentication/
- https://grafana.com/docs/tempo/latest/operations/manage-advanced-systems/cross_tenant_query/
- https://prometheus.io/docs/operating/security/
- https://docs.portainer.io/api/access
- https://docs.portainer.io/api/examples

Provider behavior is evidence for qualification patterns, not provider adoption authority.

## 1. Authorization realization is a vector, not one enum

The earlier candidate `TelemetryAuthorizationRealization` remains useful as a headline disposition, but provider qualification needs a vector because tenant routing, user identity, query restriction, resource policy and cache scope may be enforced at different layers.

Candidate record:

```text
TelemetryAuthorizationRealization {
  providerRef
  providerContractRevision

  authenticationBoundary:
    PER_USER | SERVICE_IDENTITY | ON_BEHALF_OF | SHARED_CREDENTIAL | NONE | UNKNOWN

  tenantBoundary:
    UPSTREAM_ENFORCED | TRUSTED_PROXY_ASSERTED | SB_ASSERTED | SINGLE_TENANT | NONE | UNKNOWN

  resourceBoundary:
    UPSTREAM_RESOURCE_POLICY | UPSTREAM_LABEL_POLICY | QUERY_REWRITE_PROVEN |
    BROKER_POST_FILTER_ONLY | NONE | UNKNOWN

  queryAuthority:
    FIXED_QUERY_ONLY | CONSTRAINED_QUERY | ARBITRARY_READ_QUERY |
    READ_PLUS_EFFECT_API | UNKNOWN

  cacheBoundary:
    PROVIDER_AUTH_PARTITIONED | PROVIDER_TENANT_PARTITIONED |
    PROVIDER_SHARED_UNKNOWN | SB_PARTITIONED | NO_CACHE | UNKNOWN

  revocationSignal:
    PUSH | SHORT_LIVED_TOKEN | POLICY_REVISION | RECHECK_ONLY | NONE | UNKNOWN

  crossTenantFederation:
    FORBIDDEN | EXPLICIT_QUALIFIED | AVAILABLE_BUT_NOT_ADMISSIBLE | UNKNOWN

  evidenceCurrentnessModel
  authorizationCurrentnessModel
  verificationEvidenceRefs
}
```

No single field substitutes for another. In particular:

`UPSTREAM_ENFORCED tenant != UPSTREAM_ENFORCED user/resource authorization`.

A provider may strongly isolate tenant A from tenant B while allowing every authenticated principal inside tenant A to query all labels/series. Conversely, a provider may implement fine-grained user/resource authorization without a tenant concept.

## 2. Provider realization examples

### 2.1 Grafana + Prometheus/Mimir/Loki

Candidate qualification when Grafana datasource permissions and LBAC are actually configured and verified:

- authentication: Grafana user/service identity;
- datasource query permission: explicit provider-side gate;
- resource/label boundary: provider-side LBAC for supported backends;
- cache: may exist independently of authorization, so cache compatibility still requires proof;
- query authority: potentially broad inside the authorized label domain.

Important limitation: Grafana documents that a datasource may be queryable independently of dashboard visibility. Therefore an SB integration must not derive query authority from the fact that a user can open one dashboard.

LBAC also has provider/backend limits. A policy proven for Mimir/Grafana Enterprise Metrics cannot be generalized to an arbitrary Prometheus-compatible endpoint merely because PromQL syntax is the same.

Candidate realization: `UPSTREAM_POLICY_PARTITIONED` only when the exact datasource/backend/policy path is qualified; otherwise degrade.

### 2.2 Loki direct

Loki multi-tenancy gives a strong tenant partition when enabled and correctly fronted, but the tenant header is part of the trust boundary. A browser/user-controlled `X-Scope-OrgID` is not a safe authorization realization merely because Loki honors it.

Candidate realization:

- tenant boundary: `TRUSTED_PROXY_ASSERTED` when an authenticated proxy derives tenant from trusted identity;
- user/resource boundary: separately qualified;
- query fairness actor path: scheduling/resource isolation, **not authorization**;
- cross-tenant query: explicit elevated capability requiring separate qualification.

`X-Loki-Actor-Path != authorization principal`.

### 2.3 Tempo direct

Tempo is even more explicit: it does not include its own authentication layer and recommends an authenticating reverse proxy. The tenant header is assumed trusted. Therefore direct browser-to-Tempo with a client-selected tenant header is disqualified for a multi-tenant SB operational surface.

Cross-tenant query support creates a distinct authority edge; availability of federation does not make federation admissible for a given SB user.

Candidate realization: `UPSTREAM_POLICY_PARTITIONED` only behind a qualified auth/proxy boundary; otherwise `UNKNOWN`/`NO_SHARE` for cross-authority result sharing.

### 2.4 Prometheus direct

Prometheus' security guidance warns that dashboard permissions are not datasource permissions and arbitrary query construction is a separate authority surface. A direct Prometheus integration therefore needs a separately qualified proxy/query restriction model when users are not intended to have arbitrary PromQL authority.

Candidate realization: often `SB_PUSHDOWN_PROVEN` or a trusted policy proxy, not automatically `UPSTREAM_PER_USER`.

### 2.5 Portainer / Docker / Kubernetes

Portainer is materially different from telemetry-only providers. API access is per-user and follows that user's Portainer permissions, which is favorable for on-behalf-of/provider-side authorization. However, Portainer also exposes/proxies underlying Docker/Kubernetes API operations. A credential that is acceptable for observation can therefore have effect authority as well.

Required split:

```text
ProviderObservationAuthority != ProviderEffectAuthority
```

An SB monitoring integration should qualify read surfaces independently from start/stop/delete/deploy operations. A token with broad effect authority must not be placed into a browser merely because the current widget performs GET requests.

Candidate realization: `UPSTREAM_PER_USER` for appropriately scoped API access, with an independent effect-authority qualification.

### 2.6 n8n and other mature admin tools

No universal realization is assumed. Their APIs/UI/projects/credentials may have different authority boundaries across edition/version. Until a concrete provider/version/identity path is qualified, classify as `UNKNOWN` rather than inferring authority from UI visibility or project membership.

The same conservative rule applies to Cockpit/NetworkManager, database consoles and storage/admin UIs.

## 3. Leakage fixture taxonomy

A safe broker needs adversarial fixtures that compare **what a consumer can infer**, not only whether forbidden rows are returned.

### L1 — direct payload leakage

Hidden series/log/trace/resource appears in returned payload.

Hard failure.

### L2 — aggregate leakage

Unauthorized population changes count, sum, min/max, percentile, histogram, cardinality or ranking visible to the consumer.

Example: broker acquires prod+secret series, computes p95, then removes secret series. The p95 already incorporated unauthorized data.

Hard failure unless the aggregate itself is explicitly authorized as a released statistic.

### L3 — namespace/label leakage

Autocomplete, label values, resource names, facets, exemplars, trace IDs, incident membership or error messages reveal hidden existence/topology.

Hard failure for protected classes.

### L4 — presence/timing leakage

Cache-hit timing, query latency, connection/subscription existence, response size or error distinction reveals whether protected material exists.

Qualification depends on classification/threat model; unknown sensitivity defaults conservative.

### L5 — cross-consumer lifecycle leakage

One user's attach/detach/revocation changes another user's visible latency/count/status in a way that reveals protected membership or activity.

Must be tested in shared fan-out fixtures.

### L6 — historical leakage

A currently unauthorized user can recover old authorized material from browser cache, persisted mosaic state, screenshot/thumbnail, exported table, saved query result or hibernation checkpoint.

This requires a separate retention/revocation policy; live fan-out detachment alone is insufficient.

## 4. Leakage fixture method

For each candidate sharing class, build paired logical worlds that differ only in hidden material:

```text
World A: authorized-visible set V
World B: same V + hidden set H
```

For consumer C, compare every consumer-observable channel permitted by the fixture:

```text
payload
aggregates
labels/facets/autocomplete
errors/status codes
response metadata
rendered counts/ranking
cache/share diagnostics exposed to C
latency buckets where material
network-visible request shape where in threat model
accessibility tree/live announcements
saved/restored widget state
```

The proof obligation is not bitwise indistinguishability for every provider. It is that any observable difference is either:

1. explicitly authorized information;
2. bounded and accepted by the declared disclosure/threat model; or
3. a qualification failure that downgrades sharing.

`Post-filter passes row test != leakage fixture passes`.

## 5. Revocation budgets are classification-specific

A single global `authorization TTL` is too weak. Candidate budget record:

```text
RevocationBudget {
  dataClass
  operationClass
  providerAuthorizationRealization
  maxDecisionStaleness
  maxFanoutDetachLatency
  maxPaintedMaterialPersistence
  maxLocalCachePersistence
  maxServerCacheReuseWithoutRecheck
  reconnectRequiresRequalification
  offlineUseDisposition
  failureMode
}
```

Candidate qualitative classes for research fixtures, **not product constants**:

- `PUBLIC/NON_SENSITIVE`: revocation may be irrelevant or policy-only.
- `INTERNAL_LOW`: bounded stale reuse may be admissible when explicitly declared.
- `OPERATIONAL_SENSITIVE`: short requalification horizon; reconnect/focus restoration cannot silently reuse old authority.
- `SECURITY/PRIVILEGED`: fail closed on authorization uncertainty; no cross-authority shared result unless provider/policy isolation is proven.
- `EFFECT_CAPABLE_ADMIN`: observation and effect credentials separated where possible; stale authority cannot authorize new effects.

No numeric milliseconds/seconds are standardized by this research. Future executable qualification must measure provider/session behavior and choose budgets by policy/criticality rather than inventing one frontend constant.

## 6. Revocation sequence and observable UI

Candidate sequence:

```text
POLICY/MEMBERSHIP CHANGE
  -> invalidation or horizon expiry
  -> AUTH_RECHECK_REQUIRED
  -> stop new privileged query/effect admission
  -> detach consumer from incompatible fan-out
  -> invalidate consumer-visible material according to data class
  -> requalify provider/session/query plan
  -> CURRENT | REDACTED | UNKNOWN_FAIL_CLOSED | BOUNDED_STALE
```

The Monitor Wall must distinguish:

- `EVIDENCE_STALE` — observation age problem;
- `AUTH_STALE` — authorization proof age problem;
- `SOURCE_UNAVAILABLE` — acquisition problem;
- `REDACTED` — current consumer may not see the material;
- `UNKNOWN` — qualification cannot currently decide.

A green last value underneath `AUTH_STALE` is not a current operational assertion to that consumer.

## 7. Browser-local and Extended Desktop implications

A shared browser-local coordinator may optimize one user's multiple surfaces, but it remains untrusted as durable authorization authority.

Required invariants:

- `Same browser profile != same active SB principal forever`.
- `Same WorkspaceSession != same authorization revision forever`.
- `Surface restored from BFCache/freeze/discard != authorization current`.
- `Presentation epoch current != data authorization current`.
- `Move to display != permission transfer`.

After freeze/discard or auth/session change, target surfaces requalify before attaching to privileged cached telemetry. WindowRegistry recovery preserves semantic intent, not authority proof.

## 8. External application matrix delta

Add these dimensions to future provider qualification:

| Dimension | Question |
|---|---|
| Identity realization | Which principal does provider actually see? |
| Tenant realization | Who is trusted to choose tenant/environment? |
| Query scope | Fixed, constrained, arbitrary read, or read+effect? |
| Resource policy | Provider-enforced, query rewrite, downstream only, unknown? |
| Cache partition | Does provider cache respect the same authority envelope? |
| Cross-tenant capability | Can one request federate scopes, and who may invoke it? |
| Revocation signal | Push, token expiry, revision, recheck only, none? |
| Effect adjacency | Can same credential mutate underlying runtime/infrastructure? |
| Error leakage | Do denial/not-found/errors reveal hidden resources? |
| Version drift | Can upgrade broaden query/effect authority or change policy semantics? |

An embedded/original advanced UI is not exempt. Its session may be more privileged than the SB user; if authority equivalence is unproven, open/deep-link it under its own explicit auth boundary rather than silently presenting it as an SB-authorized surface.

## 9. Performance and resource implications

Authorization safety changes the performance objective.

Useful measurements:

```text
widgets
semantic intents
authorized plans
provider acquisitions
qualified shared results
fanout consumers
revocation events
requalifications
leakage-fixture failures
```

Performance wins count only inside a proven equivalence class. A lower acquisition count obtained by broadening credentials or post-filtering unsafe aggregates is a regression, not an optimization.

Additional NORMAL/STRESS scenarios:

- 30 equivalent widgets, one user, two displays -> dedup expected if authorization/currentness equivalent;
- 30 same-text widgets, two roles with different LBAC -> separate authorized plans/results;
- 80-widget mosaic, 3 users, 2 tenants -> bounded acquisitions without cross-tenant result cache;
- one user revoked during fan-out -> detach within declared budget while others continue;
- provider auth backend unavailable -> privileged class fails closed; bounded-stale only where explicitly permitted;
- label autocomplete under high cardinality -> virtualization/performance cannot bypass disclosure qualification;
- source outage plus auth expiry -> preserve both dispositions; do not collapse into generic offline.

## 10. Accessibility

Leakage qualification includes accessibility outputs.

- visual graph, list, table, textual fallback and accessibility tree consume the same disclosure-qualified projection;
- hidden counts/labels cannot appear in `aria-label`, descriptions, live regions or offscreen DOM;
- revocation does not silently remove focused content; replace with a stable focusable `REDACTED/AUTH_RECHECK_REQUIRED` state;
- announcements distinguish evidence stale from authorization stale;
- high-volume requalification/revocation is coalesced so assistive technology is not flooded;
- no privileged external UI becomes the only keyboard-accessible path for an essential SB operation.

## 11. Componentes impact

Candidate additions/refinements:

- `TelemetryAuthorizationRealizationPanel`
- `ProviderAuthorityVectorInspector`
- `TenantBoundaryBadge`
- `QueryAuthorityBadge`
- `CrossTenantFederationWarning`
- `AuthorizationStalenessBoundary`
- `RevocationBudgetInspector`
- `TelemetryLeakageFixtureHarness`
- `AggregateLeakageScenario`
- `LabelNamespaceLeakageScenario`
- `TimingLeakageScenario`
- `HistoricalTelemetryRedactionState`
- `ProviderEffectAdjacencyWarning`

Each needs state matrix, provenance/currentness, keyboard/screen-reader behavior, failure/recovery and multi-surface cases.

## 12. Proof obligations

1. Same query + same LBAC envelope -> sharing can be proven without widening label scope.
2. Same query + different LBAC -> no shared authorized result.
3. Loki tenant header is derived by trusted boundary; browser cannot select arbitrary tenant.
4. Tempo client cannot escalate via cross-tenant `X-Scope-OrgID` composition.
5. Prometheus arbitrary-query authority is not inferred from dashboard visibility.
6. Portainer read widget does not receive unnecessary Docker/Kubernetes effect credential in browser.
7. Hidden series changes percentile -> fixture detects aggregate leak.
8. Hidden label appears only in autocomplete -> fixture fails despite clean main payload.
9. Hidden resource changes error text/status -> classified as disclosure channel.
10. Cache hit reveals protected existence through diagnostics/timing -> threat-model disposition recorded.
11. Revoked user detaches while other authorized consumers keep shared acquisition alive.
12. Authorization backend unavailable -> privileged data does not remain indefinitely painted as current/admissible.
13. Evidence current + authorization stale -> two dispositions remain visible.
14. Authorization current + evidence stale -> no healthy inference.
15. Browser surface resumes after freeze -> requalifies before privileged fan-out attach.
16. Display transfer preserves semantic query intent but not stale authorization proof.
17. Historical mosaic restore cannot resurrect revoked payload from persisted state.
18. Accessible fallback exposes no more data than visual projection.
19. Provider upgrade changes authorization semantics -> qualification invalidates/re-runs.
20. Cross-tenant federation available but user not qualified -> feature remains unavailable rather than silently narrowing/expanding.
21. Shared cache consumer count does not disclose hidden participants to ordinary operators.
22. `No data` due to redaction remains distinguishable from evidence that no series/events exist.
23. Performance stress does not trigger unsafe fallback to broader service credential.
24. Effect-capable provider token cannot authorize a new effect from stale telemetry authorization state.

## 13. Maturity and next gaps

Maturity: `PARTIALLY_MATURE / MATERIAL_DELTA`.

This round turns the previous provider-realization placeholder into a multidimensional qualification model and converts leakage/revocation from prose risks into fixture families and measurable policy envelopes. It still does not prove provider implementations.

Highest-value remaining gaps:

1. concrete n8n/Cockpit/NetworkManager/database/storage-console authorization realization by supported version/edition;
2. server-side versus browser-side monitoring ownership across hibernation when no interactive consumer remains;
3. privacy-safe cost/accounting attribution when one physical acquisition serves multiple authorized consumers;
4. provider-schema/policy revision invalidation protocol and historical qualification provenance;
5. future executable leakage harnesses and numeric revocation budgets after real provider/browser measurements exist.

Until executable evidence exists, the safe default remains: `unknown realization -> NO_SHARE across authority envelopes`, and `unknown revocation currentness -> no new privileged admission`.
