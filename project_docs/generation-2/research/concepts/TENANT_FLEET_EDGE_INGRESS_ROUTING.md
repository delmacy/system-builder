# Generation 2 — Research Hypothesis: Tenant Fleet, Edge / Ingress & Routing

Status: USER-DIRECTED / MANDATORY CROSS-CAPABILITY RESEARCH HYPOTHESIS / NOT YET A PROMOTED CAPABILITY

## Why this exists

Generation 2 already separates semantic systems, tenancy/authority, provider binding, topology/build/runtime realization, deployment, integration and observability. A fundamental operational question remains: how should one System Builder installation operate a fleet of customer systems/tenants across shared and dedicated infrastructure while preserving domain routing, TLS, tenant isolation, topology independence, migration and provider replaceability?

The target scenario is deliberately ordinary as well as enterprise-capable: tens of customers may share a few servers. Some tenants may share one runtime; some may receive a dedicated runtime/container; larger or sensitive tenants may receive a distributed or dedicated topology. `one tenant = one server`, `one tenant = one container`, `one tenant = one database` and `one domain = one runtime` must not be architectural assumptions.

## Candidate constitutional ideas to falsify or validate

> Tenant identity, external exposure and deployment placement are distinct dimensions.

> A domain/hostname resolves to an admitted exposure of a tenant/system/environment, not directly to an implementation-specific container.

> Edge/Ingress semantics belong to the portable topology/exposure model; Nginx, Caddy, Traefik, Cloudflare, AWS ALB, Kubernetes Gateway API and equivalents are realizations/providers.

> Shared infrastructure is acceptable only when compute, data, network, credential, storage, authority and observability isolation requirements are explicitly satisfied.

> Moving a tenant between runtime pools/servers/providers should be a governed topology migration, not a semantic system rewrite.

## Required separation

Research must distinguish:

- `Tenant` / customer organizational identity;
- `System` / semantic application identity;
- `Environment`;
- `ExternalExposure` / public service interface;
- `DomainBinding` / hostname ownership and resolution;
- `IngressRoute` / admitted routing rule;
- `TenantTopologyBinding` / where that tenant/system/environment is realized;
- `RuntimePool` / shared realization group;
- `DedicatedRuntime` / isolated realization;
- `BackendTarget` / effective runtime endpoint realization;
- `TLSProfile` / certificate/trust realization;
- `TrafficPolicy` / routing/cutover/health behavior;
- `ObservedRoute` / effective routing evidence.

Do not collapse tenant identity, DNS record, reverse-proxy configuration, container address or database placement into one object.

## Fleet realization spectrum

### Shared runtime pool

```text
cliente-a.com ─┐
cliente-b.com ─┼─> Edge/Ingress ─> SharedRuntimePool-01
cliente-c.com ─┘                    ├ tenant A
                                    ├ tenant B
                                    └ tenant C
```

A request must resolve an authoritative tenant/system/environment context before business operations execute. Tenant isolation must not depend on every developer remembering a hand-written `WHERE tenant_id = ...` convention.

### Shared server, dedicated runtimes

```text
Server-01
  Edge/Ingress
    cliente-a.com -> runtime-a
    cliente-b.com -> runtime-b
    cliente-c.com -> runtime-c
```

Dedicated runtime does not imply dedicated physical server.

### Hybrid fleet

Small tenants may share runtime pools; medium tenants may receive dedicated runtime units; large/sensitive tenants may receive multi-unit or dedicated infrastructure. The same semantic system/template may therefore have different customer-specific topology bindings.

## Isolation dimensions to research

At minimum treat these independently:

- compute/process isolation;
- data/database/schema/row isolation;
- network isolation;
- credential/secret isolation;
- storage/document/media isolation;
- cache isolation;
- queue/event isolation;
- observability/log/metric/trace isolation;
- authorization/policy/Station scope isolation;
- failure/blast-radius isolation;
- backup/restore isolation;
- encryption-key isolation;
- operational-admin isolation.

Research should determine which guarantees are mandatory by profile and which realizations may satisfy them with shared infrastructure.

## Edge / ingress / reverse-proxy research

Study mature routing and gateway representatives without universalizing their configuration syntax. Relevant families include:

- Caddy automatic HTTPS and host routing as a simple-system baseline;
- Traefik dynamic provider discovery/routing/middleware;
- NGINX/NGINX Plus reverse-proxy/routing/upstream/health patterns;
- Kubernetes Gateway API / Ingress semantics for mature orchestration;
- Envoy proxy / xDS where useful for dynamic routing and traffic policy;
- Cloudflare proxy/TLS/DNS/edge controls;
- AWS ALB / target groups / health routing;
- service-mesh mechanisms only where they reveal reusable traffic/cutover/identity primitives.

Research must distinguish north-south ingress from internal east-west communication. Internal capability calls must not be forced through the public API gateway merely because public traffic uses it.

## Candidate primitives to stress-test

Names are hypotheses only:

- `ExternalExposure`
- `DomainBinding`
- `TenantExposureBinding`
- `IngressRoute`
- `BackendTarget`
- `RuntimePool`
- `TenantTopologyBinding`
- `TLSProfile`
- `TrafficPolicy`
- `HealthRoutingPolicy`
- `CutoverPolicy`
- `RateLimitProfile`
- `NetworkIsolationProfile`
- `DataIsolationProfile`
- `FleetPlacementPolicy`
- `FleetObservation`
- `RouteRealizationEvidence`
- `TenantMigrationPlan`

## DNS and TLS materialization

Research whether a portable declaration such as:

```text
Expose system/customer/environment at hostname X with TLS required
```

can be materialized through DNS + certificate + ingress providers while preserving separate identities/revisions/evidence for domain ownership, DNS realization, certificate/trust material, route activation and backend health.

Automatic TLS is a provider mechanism, not canonical semantic authority. Certificate rotation/failure must not rewrite `DomainBinding` identity.

## Tenant context and authority

For shared runtimes, an ingress request should be admitted into a canonical context carrying an authoritative tenant/system/environment scope. Research must test:

- host/domain spoofing and unknown-host denial;
- tenant resolution before business-data access;
- non-amplifying `Enterprise -> Station -> Role -> Person` authority inside the resolved tenant scope;
- service credentials not widening tenant authority;
- asynchronous continuation preserving tenant/correlation scope;
- tenant context across queues/events/workflows;
- protection against confused-deputy and cross-tenant cache/object/reference leakage.

## Fleet Workbench hypothesis

The System Builder operator should be able to inspect a fleet view such as:

```text
Customer     SystemRev   TopologyRev   Placement       Exposure           Health
A            8.4         12            shared-01       cliente-a.com      OK
B            8.4         13            shared-01       cliente-b.com      OK
C            8.3         21            dedicated-02    cliente-c.com      WARN
D            8.4         42            distributed     cliente-d.com      OK
```

Candidate governed actions:

- inspect topology/exposure;
- validate route/TLS/provider compatibility;
- build/release/deploy relevant units;
- move tenant between runtime pools/servers/providers;
- scale dedicated units;
- rotate/cut over exposure;
- upgrade compatible cohorts;
- quarantine/disable exposure without deleting semantic tenant/system identity.

## Tenant/server migration

Moving a tenant should use explicit lineage:

`MigrationIntent -> Validate target topology/isolation -> Materialize target -> State/data synchronization if needed -> Health/conformance -> Traffic cutover -> Observe -> Retire/retain rollback source -> Postcondition evidence`.

Hostname/domain identity should normally remain stable while backend realization changes. Routing rollback and state/semantic recovery must remain distinct.

## Required proofs / adversarial scenarios

1. **Twenty-customer shared-edge proof** — at least 20 hostname bindings route deterministically to the correct tenant/system/environment across a small number of shared servers/runtimes.
2. **Unknown-host denial proof** — an unregistered/spoofed hostname never falls through into another tenant.
3. **Shared-runtime isolation proof** — two tenants sharing one runtime cannot read/write each other's domain data, cache entries, storage objects, queues or secrets.
4. **Dedicated-runtime proof** — one tenant can move from shared runtime to dedicated runtime without changing semantic system identity or external hostname.
5. **Hybrid fleet proof** — shared pools, dedicated runtimes and distributed customer topologies coexist behind one fleet/edge model.
6. **No 1:1 assumption proof** — tenant/container/server/database mappings may independently be 1:N, N:1 or 1:1 when policy permits.
7. **TLS lifecycle proof** — certificate issuance/rotation/failure is observed and recovered without changing semantic `DomainBinding` identity.
8. **Edge-provider substitution proof** — same exposure requirements can be realized by a simple provider (e.g. Caddy/Traefik class) and a mature cloud/orchestrated provider where profiles are compatible.
9. **Provider insufficiency proof** — provider lacking mandatory health routing/TLS/isolation/rate-limit properties is partial/incompatible, never silently accepted.
10. **Zero/low-downtime tenant move proof** — backend target can cut over after readiness with explicit rollback window and route evidence.
11. **Cross-tenant authority proof** — valid user/service credentials for tenant A cannot be replayed to gain tenant B authority through alternate host/routing paths.
12. **Async tenant-lineage proof** — queued/workflow work started for tenant A remains tenant A after retries, replay and provider hops.
13. **Observability isolation proof** — fleet views can aggregate health while tenant-sensitive logs/traces remain scoped and access-controlled.
14. **Failure-domain proof** — failure of one shared runtime exposes its affected tenant cohort without falsely marking unrelated dedicated runtimes unhealthy.
15. **Autonomous routing proof** — generated edge/runtime deployment continues routing according to qualified local closure when Builder control plane is unavailable.
16. **Simple-operations proof** — tens of small customers can run with a small shared edge/provider stack without Kubernetes-scale operational ceremony.

## Cross-capability research obligations

This hypothesis must be cross-tested by Authorization/Multitenancy, Data, Storage, Events/Messaging, Workflow, Integration/API Contracts, Secrets, Provider/Binding, Deployment/Runtime, Topology/Build Realization, Observability, Lifecycle/Migration, Security/Recovery and AGWS/Operator Experience.

## Negative-space / synthesis gate

Enterprise Completeness Review and Capability Synthesis must explicitly decide ownership for tenant fleet placement, external exposure, edge routing, multi-dimensional isolation, route/TLS lifecycle and tenant migration. This hypothesis must not disappear into an implementation-specific reverse-proxy configuration.
