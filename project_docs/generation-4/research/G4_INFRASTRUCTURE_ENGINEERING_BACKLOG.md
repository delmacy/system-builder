# G4 — Infrastructure Engineering & Control Plane R&D

Status: `RESEARCH_ACTIVE / NON_EXECUTABLE`
Execution authority: NONE

## Purpose

G3 established implementation-independent concepts for deployment topology, providers, hosts, workloads, managed/external resources, desired/observed/effective state, authority, recovery and evidence. G4 investigates the operational engineering required to manage real infrastructure safely and at scale.

`Provision != Configure != Deploy != Operate != Observe != Scale != Repair != Recover != Upgrade != Decommission`.

## Research vectors

- Resource lifecycle: discovery, adoption, provisioning, configuration, mutation, replacement, retirement and destruction.
- Compute substrates: process, container, VM, bare metal, serverless and edge as realizations rather than semantic identity.
- Fleet/host engineering: inventory, bootstrap, OS baseline, packages, runtimes, patching, reboot, drain, agentless SSH vs optional host agent, reconnect behavior.
- Network engineering: DNS, IPAM, routing, ingress/egress, firewall, NAT, proxy/gateway, VPN/tunnels, load balancing, service discovery and cross-site connectivity.
- Traffic engineering: routing, failover, canary, blue/green, rate limiting, circuit breaking and controlled cutover.
- Identity infrastructure: workload/service identity, PKI, certificates, short-lived credentials, rotation and revocation.
- Configuration engineering: desired configuration, distribution, revision, drift, rollout and rollback.
- Time/coordination: clock sync, lease/expiry, ordering, leader election, fencing tokens, distributed locks and timeouts.
- Scheduling/placement: CPU/RAM/storage/GPU, affinity/anti-affinity, locality, failure domains, residency, cost and performance constraints.
- Capacity/autoscaling: headroom, saturation, horizontal/vertical scaling, queue/backlog signals and burst behavior.
- Availability/resilience: redundancy, replicas, fault domains, degraded modes, failover, backup, restore, RPO/RTO and disaster drills.
- Storage infrastructure: block/file/object/network storage, volumes, snapshots, replication and durability.
- Middleware infrastructure: queues, brokers, caches, registries and API gateways with provider-neutral semantics.
- Observability infrastructure: collectors, logs, metrics, traces, profiling, routing, storage, query and alerts.
- SRE/operations: SLOs, incidents, maintenance, on-call, runbooks, remediation and change safety.
- Patch/vulnerability management: OS/runtime/image/package vulnerability handling, upgrade waves and rollback.
- Supply chain to runtime: registries, signing, attestations, SBOM/provenance, promotion and running-artifact identity.
- Multi-region/edge/offline: site topology, intermittent connectivity, local autonomy and delayed reconciliation.
- Tenant isolation: quotas, noisy-neighbor control and network/storage/runtime partitioning.
- FinOps: cost allocation, unit economics, idle capacity, rightsizing and cost forecasting without automatic authority.
- Physical/bare-metal: hardware inventory, firmware, disks, NICs, sensors and BMC/IPMI-like out-of-band control where applicable.
- Bootstrap/emergency recovery: first credential, first agent, rescue console and break-glass when normal control is down.
- Governance/decommissioning: policy, maintenance gates, evidence, drain, revoke, wipe, endpoint/secret cleanup and residual verification.
- Simulation/digital twin: placement, outage, capacity, topology-change and upgrade simulation before execution.

## First deep evidence consolidation — control-loop safety and failure semantics

Evidence classes reviewed: mature declarative reconciliation/control loops and node liveness semantics (Kubernetes), provider-separated infrastructure health checks (Amazon EC2), and production overload/retry/degradation engineering (Google SRE and Amazon Builders' Library). These systems are evidence sources, not selected product dependencies.

### Control-plane separation

`Infrastructure State != Host Configuration State != Workload State != Network State != Storage State != Application State != Observability State`.

A valid combined observation may be:

```text
Provider: RUNNING
Host: REACHABLE
Storage: REACHABLE
Runtime: RUNNING
Workload: DEGRADED
Application: PARTIAL
Network: PARTIAL
Observability: STALE
```

Do not collapse this into one opaque status. Mature EC2 status checks independently expose system, instance, attached-storage and optional application health; Kubernetes separately models Node conditions and heartbeat freshness. The SB model should preserve the same principle without inheriting either provider's exact status vocabulary.

New invariants:

- `Provider running != host healthy`.
- `Host reachable != workload ready`.
- `Workload running != application effective`.
- `Storage attached != storage I/O healthy`.
- `Heartbeat current != all host subsystems healthy`.
- `Observability stale != observed failure`; absence/freshness loss must remain UNKNOWN where appropriate.
- `Aggregate healthy != every constituent healthy` unless the aggregation contract proves that implication.

### Observation freshness, leases and authority

A heartbeat/lease is evidence of recent contact under a declared timeout policy, not timeless truth. A control plane must retain observer identity, observation time, expiry/freshness policy and population/locality qualification.

```text
Observation
  observer
  subject
  observedAt
  receivedAt
  freshnessPolicy
  expiresAt / lease semantics
  locality / population
  evidence revision
```

Kubernetes uses lightweight Lease renewals independently from less-frequent Node status updates. This is useful evidence for separating liveness/freshness transport from richer health state.

Invariants:

- `Lease valid != semantic owner authority`.
- `Lease expired != host proven dead`.
- `No heartbeat != safe replacement`.
- `Unreachable != terminated`.
- `Reconnect != reconciliation complete`.

For stateful or externally effective operations, an unreachable controller/host creates an uncertainty problem. Replacement, retry or failover may require fencing/reconciliation rather than interpreting timeout as absence.

### Reconciliation loop and controller boundaries

```text
Canonical Desired State
 -> bounded Controller
 -> Provider / Host Agent / Runtime
 -> Observed State
 -> Effective State
 -> Reconcile
```

Prefer multiple bounded controllers over one monolithic daemon. A controller should have explicit semantic ownership, watched inputs, actuation boundary, idempotency/retry contract, observation freshness requirement, convergence condition and failure disposition.

`Reconcile requested != reconcile executed != convergence proven`.

Controller restarts must not erase durable operation identity or cause blind duplicate side effects. A controller may compute a candidate action from stale observations only as a proposal; eligibility for actuation depends on the applicable authority/currentness gates.

### Retry, timeout and amplification safety

Mature SRE practice shows that retries can amplify overload and cascading failure. Automatic infrastructure reconciliation therefore needs an explicit retry policy rather than a generic "eventually retry" rule.

Candidate `RetryEnvelope` research fields:

```text
operationClass
idempotency / duplicate-effect semantics
attemptBudget
backoffPolicy
jitterPolicy
deadline
overloadDisposition
reconciliationRequiredOnUnknown
retryAuthority
```

Invariants:

- `Timeout != operation did not happen`.
- `Retriable transport error != retry-safe business/infrastructure effect`.
- `Idempotent request token != effect convergence proof`.
- `Controller retry != unlimited retry`.
- `Independent retries at every layer != resilience`; they may multiply load.
- `Backoff without jitter != desynchronized recovery`.

The control plane should model retry budgets and overload/load-shedding semantics at bounded choke points. Recovery work itself consumes capacity and can worsen an incident.

### Capacity, degradation and criticality

Capacity cannot be reduced to a single QPS or CPU threshold. Work units may have materially different cost and criticality. Research should preserve at least:

```text
CapacityObservation
  resource dimensions
  saturation / queue pressure
  workload class
  criticality
  locality / failure domain
  currentness
  headroom policy
```

Graceful degradation and load shedding are controlled operational modes, not silent success. A degraded response or reduced feature set must remain observable as degraded effectiveness.

- `Serving != full-quality service`.
- `Capacity available != capacity safe to consume`.
- `Autoscaling requested != capacity effective`.
- `Failover target exists != failover capacity sufficient`.
- `Recovery traffic != free capacity`.

### Disruption budgets and maintenance safety

Mature orchestrators distinguish voluntary from involuntary disruption and allow budgets for controlled maintenance. This supports a provider-neutral SB concept of a `DisruptionEnvelope` rather than adopting Kubernetes PDB semantics directly.

Candidate dimensions:

```text
population / workload scope
minimum effective capacity or maximum voluntary disruption
failure-domain constraints
maintenance window
current involuntary impairment
criticality
exception / break-glass authority
```

Important boundary: a disruption budget can govern voluntary action but cannot guarantee availability against involuntary failure.

- `Within disruption budget != availability guaranteed`.
- `Drain permitted != drain completed`.
- `Workload evicted != replacement ready`.
- `Maintenance authorized != disruption safe under stale health evidence`.

### Reboot/disruptive operations

Treat reboot as a durable governed operation:

```text
request -> impact analysis -> disruption/capacity gate -> maintenance/security gate
-> drain/checkpoint -> reboot issued -> host disappears -> host returns
-> boot identity/freshness verified -> storage/network verified
-> workloads reconciled -> application/effect proof -> effective
```

`Connection lost after reboot command != reboot succeeded`.

A host returning network reachability is insufficient; post-reboot proof must distinguish provider/system health, host identity/boot generation, storage I/O, runtime/workload readiness and application effectiveness.

### Failure-domain and failover semantics

Failover is a topology change with capacity, authority and uncertainty consequences, not merely a route flip.

```text
FailureObservation
 -> qualify scope/currentness
 -> determine affected failure domain
 -> verify target capacity + state eligibility
 -> fence/reconcile uncertain source where required
 -> controlled traffic/workload transition
 -> prove target effectiveness
 -> observe residual/source state
```

- `Source unreachable != source inactive`.
- `Target healthy != target synchronized`.
- `Replica present != replica current enough for declared objective`.
- `Traffic switched != service recovered`.
- `Multi-region != independent failure domains by assumption`.

RPO/RTO remain objectives/claims requiring evidence from drills and actual recovery, not configuration values that become truth by declaration.

## Updated proof obligations

1. Provider ACK cannot become effective truth.
2. Known resource does not imply authorized resource.
3. Provider/host/storage/workload/application/network/observability states remain separately observable and freshness-qualified.
4. Heartbeat/lease loss does not silently become proof of death or safe replacement.
5. Reboot/upgrade/recovery operations survive controller restarts with durable operation identity.
6. Retry eligibility is scoped by idempotency/effect uncertainty, bounded attempt budgets, backoff/jitter and overload policy.
7. Credentials/trust can be rotated and revoked.
8. Control-plane upgrade need not stop autonomous client runtimes where architecture permits.
9. Backup and restore are proven, not merely configured.
10. Failure of SB control plane leaves published runtimes autonomous.
11. Decommissioning verifies residual resources/secrets/endpoints.
12. Every infrastructure binding has an exit/recovery strategy.
13. Voluntary disruption checks account for already-observed involuntary impairment and evidence freshness.
14. Failover proves source fencing/reconciliation where needed, target state eligibility, target capacity and post-cutover effectiveness.
15. Load shedding/degraded operation remains visible and cannot be promoted to full effectiveness.
16. RPO/RTO and recovery readiness are supported by drill/operation evidence, not configuration alone.

## Adversarial cases now required

- provider says RUNNING while host kernel/filesystem is impaired;
- host heartbeat is current while attached storage or application is failing;
- heartbeat expires during a network partition but workload continues producing effects;
- controller restarts after ACK but before effect observation and considers retry;
- multiple controller/provider layers each retry and amplify an overloaded dependency;
- fleet-wide periodic reconciliation synchronizes after outage and creates a thundering herd;
- maintenance drain begins while unrelated involuntary failures already consumed the disruption envelope;
- failover target is reachable but stale or lacks capacity for recovered traffic;
- source region becomes unreachable, target activates, then source returns without fencing/reconciliation;
- autoscaler ACKs scale-out but capacity arrives too late to prevent overload;
- observability becomes stale and automation incorrectly interprets missing failures as healthy;
- degraded mode serves reduced semantics while UI/API reports ordinary success.

## Portability / exit path

The research target remains provider-neutral contracts around resource identity, observations, operations, retry/disruption envelopes, capacity, topology/failure domains and evidence. Kubernetes Leases/PDBs/controllers, EC2 status checks and cloud-specific recovery APIs are reference implementations/pattern evidence only. No Kubernetes, AWS, agent architecture or orchestrator is selected by this document.

## Remaining high-value gaps

- fencing tokens, leases, split-brain and leader-election safety under partial connectivity;
- cross-region/site autonomy and delayed reconciliation;
- infrastructure identity/PKI bootstrap and rotation under disconnected operation;
- capacity models across heterogeneous work units and cost constraints;
- storage durability/replication proof and restore correctness;
- supply-chain-to-running-artifact identity;
- decommission/wipe/residual-resource proof;
- recovery game-days and simulation evidence contracts.
