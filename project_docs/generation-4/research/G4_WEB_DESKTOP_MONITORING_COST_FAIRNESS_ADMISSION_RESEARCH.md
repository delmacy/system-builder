# G4 — Web Desktop Monitoring Cost, Fairness and Admission Research

Status: `RESEARCH_ACTIVE / NON_EXECUTABLE`
Execution authority: NONE
Date: 2026-09-23
Scope: G4 Frontend / Web Desktop Operating Environment

## Purpose

Close the remaining documentary gap around cost attribution, fairness, overload isolation and admission for shared/persistent monitoring acquisitions across Clients and Workspaces. This research extends the headless-monitoring and disclosure-safe subscription work. It does not choose an implementation, define numeric quotas, or authorize WBS/Work Packages/Sprints/TASKs.

## Core finding

`Shared work != shared authority != shared cost ownership != shared priority`.

Deduplicating an upstream acquisition is an optimization. It must not collapse authorization, accounting, service class, currentness obligations or overload isolation into one identity.

Required distinctions:

- `Same semantic query != same cost owner`.
- `Same cost owner != same authorization envelope`.
- `Shared upstream acquisition != shared result disclosure`.
- `Shared cache != shared billing/admission identity`.
- `High priority != unlimited concurrency`.
- `Queued != failed`; `admitted != current`; `throttled != unhealthy target`.
- `No viewers != zero monitoring cost`.
- `Many viewers != proportionally many upstream acquisitions`.
- `Cheap query != cheap fan-out/render`; `expensive query != low business value`.
- `Running != Healthy != Ready != Effective` remains mandatory.

## Benchmark evidence

Grafana Mimir's query-scheduler uses tenant-aware queuing and round-robin scheduling between tenants with active queries. Mimir also supports per-tenant limits such as outstanding requests and maximum eligible queriers; shuffle sharding can constrain a tenant to a subset of queriers, reducing blast radius. These are useful evidence that fairness and failure containment should be explicit rather than emergent from FIFO scheduling.

Kubernetes API Priority and Fairness classifies requests into flows and priority levels, uses bounded queuing and fair queuing, and uses shuffle sharding to reduce the ability of one high-volume flow to starve others. Its concept of estimated `seats` is particularly relevant: requests can consume different amounts of concurrency according to estimated work rather than all counting as one identical request.

Prometheus remote-write queue guidance demonstrates the opposite resource boundary: increasing queue capacity or parallel shards can improve throughput but can also increase memory consumption and recovery time. Therefore more concurrency/buffering is not a free fairness solution.

OpenTelemetry batching by metadata is useful evidence that multi-tenant work can be grouped while retaining tenant metadata boundaries; metadata cardinality itself needs a bound. Again, this is benchmark grammar, not a selected SB implementation.

Sources:
- https://grafana.com/docs/mimir/latest/references/architecture/components/query-scheduler/
- https://grafana.com/docs/mimir/latest/configure/configure-shuffle-sharding/
- https://grafana.com/docs/mimir/latest/configure/configuration-parameters/
- https://kubernetes.io/docs/concepts/cluster-administration/flow-control/
- https://prometheus.io/docs/practices/remote_write/
- https://pkg.go.dev/go.opentelemetry.io/collector/processor/batchprocessor

## Candidate accounting identities

Keep three identities independent:

1. `SemanticAcquisitionIdentity`: what upstream work is actually equivalent and therefore potentially shareable.
2. `AuthorityEquivalenceClass`: which consumers may legally participate in a shared acquisition/projection path.
3. `CostAttributionSet`: which Client/Workspace/MonitoringObligation consumers caused or benefit from the work and how cost is attributed.

A fourth identity, `AdmissionFlow`, determines fairness/priority under contention. It must not be inferred from authorization.

Candidate attribution record:

`MonitoringCostAttribution { acquisitionRef, providerRef, clientRef?, workspaceRef?, obligationRefs[], consumerRefs[], serviceClass, estimatedCostClass, measuredCostEnvelope?, retainedVolume?, fanoutCount, attributionPolicyRef, provenance }`.

The model should support one physical acquisition with multiple attribution entries without duplicating provider traffic.

## Cost dimensions

Do not reduce monitoring cost to request count. Candidate dimensions:

- upstream request/query execution;
- bytes read and returned;
- time range/cardinality scanned;
- active streaming/WebSocket/SSE connection cost;
- evaluator CPU/memory;
- queue occupancy and wait time;
- cache/storage/retention volume;
- incident/rule evaluation cost;
- fan-out serialization/network cost;
- browser render/materialization cost;
- external-provider rate-limit consumption.

Some costs are fixed per acquisition, some marginal per consumer, some retention-driven, and some burst-driven. Exact numeric weights require executable fixtures and production evidence.

## Fairness model

Candidate hierarchy:

`System capacity -> service class -> Client flow -> Workspace/obligation flow -> acquisition work units`.

Fairness goal: when aggregate demand exceeds capacity, independent Clients/Workspaces continue to make bounded progress according to declared service class/policy rather than one noisy tenant consuming all capacity.

Candidate service classes are semantic only, not numeric budgets:

- `SAFETY_CRITICAL_OBSERVATION`
- `ACTIVE_INCIDENT`
- `PERSISTENT_OPERATIONAL`
- `INTERACTIVE_DIAGNOSTIC`
- `BACKGROUND_ENRICHMENT`
- `OPTIONAL_VISUALIZATION`

Service class affects admission/queueing/degradation policy, not authorization or truth. An `ACTIVE_INCIDENT` request does not gain access to data the principal could not otherwise observe.

## Admission dispositions

Candidate dispositions:

`ADMITTED | ADMITTED_SHARED | QUEUED | DEGRADED_CADENCE | DEGRADED_DETAIL | DEFERRED | RATE_LIMITED_PROVIDER | REJECTED_POLICY | REJECTED_CAPACITY | UNKNOWN`.

Admission must be observable separately from evidence currentness. A widget may be `QUEUED` while its last evidence is still current; later it may become stale. Conversely, an admitted acquisition can still fail at the provider.

Admission must preserve the distinction between local resource pressure and remote service health.

## Degradation ladder under pressure

Prefer semantic degradation before unbounded resource growth:

1. reuse already-qualified acquisition/cache work;
2. coalesce superseded refresh requests;
3. reduce optional visualization/render cadence;
4. reduce non-critical interactive/background acquisition cadence within declared currentness bounds;
5. reduce detail/downsample only when semantics are explicitly marked approximate;
6. queue bounded work using fair scheduling;
7. shed optional/background work;
8. preserve critical persistent observation where policy requires;
9. expose coverage/currentness degradation when obligations cannot be met.

Never silently stretch an evidence-currentness horizon and continue showing `CURRENT`.

`Downsampled != exact`; `degraded cadence != normal cadence`; `admission denied != target healthy`.

## Shared acquisition attribution

A shared acquisition can have fixed and marginal cost. Candidate accounting policies to research later include:

- `INITIATOR_PAYS_FIXED + BENEFICIARIES_PAY_MARGINAL`;
- `EQUAL_BENEFIT_SPLIT`;
- `WEIGHTED_BY_OBLIGATION/SERVICE_CLASS`;
- `CLIENT_RESERVED_CAPACITY + SHARED_POOL`;
- `SYSTEM_POLICY_FUNDED` for mandatory monitoring.

No policy is selected here. The architectural requirement is that attribution be explicit and auditable rather than inferred from whichever Window happened to open first.

If Alice closes her Desktop but a persistent obligation still requires the acquisition, the cost remains attached to the obligation/owner policy, not to Alice's vanished browser surface.

## Avoiding optimization gaming

Cost accounting must not create incentives to weaken security or currentness:

- never broaden credentials to obtain a cheaper shared superset query;
- never merge tenant scopes solely to improve cache hit rate;
- never mark approximate/downsampled evidence exact to avoid expensive acquisition;
- never stop a mandatory persistent obligation merely because there are zero viewers;
- never keep unnecessary acquisition alive merely to preserve a cache-hit metric.

`Cheaper != qualified`.

## Provider rate limits and external apps

External systems may impose rate/concurrency limits independent of SB. Provider `429`, quota exhaustion or connection limits should become provider-capacity/admission evidence, not remote target health.

External mature UIs may consume the same provider budget outside SB. Therefore SB cannot assume it owns the entire rate-limit envelope. Candidate integration qualification should record whether quota/rate-limit telemetry is observable and whether SB traffic has an isolated credential/quota class.

For opaque embeds, SB may be unable to meter their provider calls. Their resource disposition should remain `PROVIDER_CONTROLLED/UNKNOWN`, not folded into precise SB acquisition accounting.

## Headless monitoring interaction

Persistent `MonitoringObligation` remains the semantic cost owner when no Desktop is open. Execution lease/failover may move work between evaluators without changing attribution identity.

Failover overlap can temporarily increase cost. That overlap must be bounded and attributed as recovery overhead rather than silently counted as two independent obligations.

An `ORPHANED` obligation may have zero execution cost while still representing a severe coverage failure. Therefore low spend is never evidence of healthy monitoring.

## Multi-display interaction

Multiple BrowserSurfaces of the same Workspace should generally add fan-out/render cost, not duplicate upstream acquisition where sharing is qualified. Closing a secondary display may reduce presentation cost while leaving persistent acquisition cost unchanged.

`Move to display != new acquisition identity`.

A surface reconnect after freeze/discard should attach to current qualified fan-out rather than creating an uncontrolled parallel poller.

## Operational UX

Desktop Observatory should expose overload/admission only when operationally relevant. Candidate operator-facing distinctions:

- evidence current but refresh queued;
- evidence stale because cadence was degraded;
- provider rate-limited;
- local Desktop render degraded while server-side monitoring remains healthy;
- persistent obligation coverage degraded because system capacity could not satisfy policy.

Do not expose internal billing details to users without permission. Cost/fairness diagnostics themselves are disclosure-controlled operational data.

Candidate components/refinements:

- `MonitoringAdmissionBadge`
- `MonitoringFairnessInspector`
- `AcquisitionCostAttributionInspector`
- `ProviderRateLimitStatus`
- `MonitoringServiceClassBadge`
- `EvidenceCadenceDegradationNotice`
- `SharedAcquisitionEconomicsPanel`
- `MonitoringCapacityPressureBanner`

## Accessibility

Capacity pressure must not degrade only the accessible representation. If a graph is retained while its textual/table equivalent is shed, the system has created an accessibility regression. Degradation policy should preserve an equivalent accessible path, even if both representations reduce detail/cadence together.

Queue/rate-limit/currentness states require textual, non-color semantics. Live regions should announce material transitions (`CURRENT -> STALE`, `normal -> degraded cadence`, persistent coverage failure) rather than queue-depth churn.

## Proof obligations / adversarials

1. One Client opens 80 expensive diagnostic queries -> another Client's persistent monitoring continues making bounded progress.
2. Two Clients request identical query text under different authority envelopes -> no unsafe sharing despite cost pressure.
3. Fifty widgets consume one qualified acquisition -> upstream work remains bounded while fan-out cost is measurable.
4. Zero viewers remain for a persistent obligation -> cost remains attributable to the obligation/policy.
5. Last interactive consumer closes an ephemeral query -> acquisition can retire without affecting persistent obligations.
6. A high-priority incident query lacks authorization -> priority never grants disclosure.
7. Provider returns `429` -> target is not labeled unhealthy solely from provider admission failure.
8. Queue wait exceeds currentness horizon -> evidence becomes stale/unknown rather than silently current.
9. Downsampling activates -> UI labels approximation; exact evidence is not implied.
10. Background enrichment floods queue -> persistent operational flow is isolated.
11. One pathological query crashes/overloads executors -> blast radius is bounded; other Clients continue where architecture permits.
12. Shared acquisition initiator disconnects -> remaining beneficiaries retain correct attribution/ownership.
13. A new beneficiary joins an existing acquisition -> no historical data disclosure beyond its authorization/currentness envelope.
14. Revocation removes one beneficiary -> acquisition may continue for others without retaining revoked fan-out.
15. Executor failover overlaps acquisition -> duplicate cost is bounded and stale epochs cannot duplicate semantic effects.
16. Secondary display freezes and reconnects -> no uncontrolled duplicate poller appears.
17. Opaque external embed continues polling in background -> SB reports resource controllability unknown/provider-controlled.
18. External provider quota is shared with its native UI -> SB does not assume exclusive quota ownership.
19. Accessibility fallback under pressure -> equivalent semantic access remains available.
20. Cost dashboard itself contains cross-tenant utilization -> disclosure policy prevents unauthorized tenant inference.
21. A Client with many cheap queries competes with one expensive query -> scheduler reasons about estimated work, not request count alone.
22. Queue capacity is increased -> memory/recovery cost is observed; capacity growth is not treated as free fairness.
23. Optional 3D System Map consumes GPU/render budget -> 2D/list/table/graph operational paths remain available and monitoring obligations are unaffected.
24. Capacity pressure prevents required monitoring cadence -> system exposes coverage/effectiveness failure; `No alert` never becomes evidence of health.

## Maturity and next gaps

`MONITORING_COST_FAIRNESS_ADMISSION = PARTIALLY_MATURE / MATERIAL_DELTA`.

This closes the documentary question of how shared acquisitions can remain economically bounded without coupling authorization, attribution and priority. Exact scheduling algorithm, cost weights, concurrency shares, queue sizes, rate budgets and SLO thresholds require executable NORMAL/STRESS fixtures and production/provider evidence and must not be invented here.

Remaining narrow gaps for the :40 program:

1. concrete external-provider examples for persistent monitoring ownership/notification continuity;
2. empirical NORMAL/STRESS/leakage/revocation/failover fixtures and numeric budgets;
3. accessibility/performance validation under long reconnect histories and capacity pressure.

If a future documentary round cannot materially refine these without executable evidence, record `NO_MATERIAL_DELTA` instead of creating another parallel taxonomy.