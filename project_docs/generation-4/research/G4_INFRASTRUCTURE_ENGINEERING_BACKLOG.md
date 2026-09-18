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

Do not collapse provider, host, storage, workload, application, network and observability into one opaque status.

Invariants:

- `Provider running != host healthy`.
- `Host reachable != workload ready`.
- `Workload running != application effective`.
- `Storage attached != storage I/O healthy`.
- `Heartbeat current != all host subsystems healthy`.
- `Observability stale != observed failure`; absence/freshness loss remains UNKNOWN where appropriate.
- `Aggregate healthy != every constituent healthy` unless the aggregation contract proves that implication.

### Observation freshness, leases and authority

A heartbeat/lease is evidence of recent contact under a declared timeout policy, not timeless truth. Retain observer identity, observation time, expiry/freshness policy and population/locality qualification.

Invariants:

- `Lease valid != semantic owner authority`.
- `Lease expired != host proven dead`.
- `No heartbeat != safe replacement`.
- `Unreachable != terminated`.
- `Reconnect != reconciliation complete`.

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

### Retry, timeout and amplification safety

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

### Capacity, degradation and criticality

Capacity cannot be reduced to a single QPS or CPU threshold. Preserve resource dimensions, saturation/queue pressure, workload class, criticality, locality/failure domain, currentness and headroom policy.

- `Serving != full-quality service`.
- `Capacity available != capacity safe to consume`.
- `Autoscaling requested != capacity effective`.
- `Failover target exists != failover capacity sufficient`.
- `Recovery traffic != free capacity`.

### Disruption budgets and maintenance safety

A provider-neutral `DisruptionEnvelope` may include population/workload scope, minimum effective capacity or maximum voluntary disruption, failure-domain constraints, maintenance window, current involuntary impairment, criticality and exception/break-glass authority.

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

## Second deep evidence consolidation — fencing, leadership and split-brain safety

Evidence classes reviewed: Kubernetes Lease/leader-election semantics, etcd revision/transaction/watch guarantees, and distributed-systems fencing analysis. These are evidence sources, not selected dependencies.

### Leadership is scoped authority, not global health

Leader election answers a bounded coordination question: which participant currently holds a leadership role according to a coordination authority. It does not prove that the leader is healthy in every subsystem, has current domain state, or remains authorized to mutate every downstream resource.

Candidate `LeadershipEpoch` research dimensions:

```text
coordinationDomain
leaderIdentity
term / epoch / monotonic generation
acquiredAt
renewedAt
freshness/expiry policy
coordinationAuthority
scope of permitted effects
compatibility / version qualification
```

Invariants:

- `Elected leader != globally authoritative actor`.
- `Leader lease current != downstream effect authority accepted`.
- `Leader reachable != leader state sufficiently current`.
- `Leadership acquired != predecessor effects fenced`.
- `Leadership transition != business/infrastructure convergence`.
- `One elected leader in coordination store != one actor capable of producing external effects`.

Kubernetes demonstrates a practical Lease-based election with holder identity, renewal time, lease duration and transition count; optimistic concurrency prevents concurrent acquisition in the coordination store. That is useful coordination evidence, but G4 must preserve a separate downstream-effect safety boundary.

### Lease and fencing are different mechanisms

A lease bounds coordination ownership in time. Fencing protects a resource from stale actors that resume after losing coordination ownership. Time-based expiry alone cannot prevent a paused or partitioned former leader from later issuing a delayed write.

Candidate `FencingToken` semantics:

```text
coordinationDomain
resource/effect scope
epoch/token
issuedBy
issuedAt
predecessor relation
minimumAcceptedEpoch at effect sink
```

Required property for correctness-sensitive effects: the downstream effect authority/sink must reject operations carrying an epoch older than the greatest epoch it has already accepted for that scope.

Invariants:

- `Lease expired != stale actor physically stopped`.
- `New leader elected != old leader unable to write`.
- `Unique lock token != monotonically ordered fencing token`.
- `Fencing token issued != fencing enforced`.
- `Client-side fencing check != sink-side stale-write rejection`.
- `Clock expiry != monotonic authority epoch`.

A fencing token is therefore useful only when the resource or an authoritative mediation layer participates in validation. If an external provider/device cannot enforce fencing, the system must classify the weaker guarantee and use another safe transition mechanism rather than claim split-brain exclusion.

### Partial connectivity and quorum asymmetry

A partition can create asymmetric knowledge: one side may retain coordination quorum while another side still has network access to an external resource. Therefore quorum leadership and effect reachability are separate dimensions.

```text
Site A ---- coordination quorum ----> authority epoch 42
  |
  X partition
  |
Site B ---- still reaches device/provider ----> stale epoch 41
```

Safe operation requires the effect boundary to distinguish epoch 42 from 41, or to establish an equivalent exclusive/fenced transition.

Invariants:

- `Lost quorum != lost external reachability`.
- `Has external reachability != has current authority`.
- `Majority partition != every minority-side effect automatically impossible`.
- `Network healing != authority reconciliation complete`.
- `Same desired state on both sides != safe concurrent actuation`.

This also means split-brain is not merely two leaders in one database. It is any state in which multiple actors can plausibly produce mutually incompatible effects for the same exclusive authority domain.

### Coordination revision, watch and currentness

etcd provides ordered revisions and resumable/reliable watch semantics within retained history, while documenting that watch delivery itself is not linearizable. G4 should therefore avoid treating an event stream/watch as a current authority read without revision qualification.

Candidate coordination observation should preserve:

```text
coordinationRevision
observedLeaderEpoch
watch/read mode
lastAppliedRevision
history-window / compaction disposition
freshness
```

Invariants:

- `Watch event received != latest authoritative state read`.
- `Ordered watch history != linearizable current read`.
- `Watch resumed != no reconciliation needed`.
- `Compacted history != safe assumption about omitted transitions`.
- `Local cache current by timestamp != coordination revision current`.

A controller reconnecting after loss of watch/history must reconcile authoritative state before resuming correctness-sensitive actuation.

### Leadership during rolling upgrades

Kubernetes coordinated leader election explicitly includes candidate version/emulation information to make leadership selection compatible with version-skew constraints. The provider-neutral lesson is that leadership eligibility can depend on protocol/semantic compatibility, not only liveness.

Candidate `LeadershipEligibility` may therefore include:

```text
role/capability compatibility
protocol revision
semantic contract revision
state/schema readability
minimum/maximum supported peer generation
security posture
locality/failure-domain policy
```

Invariants:

- `Alive candidate != eligible leader`.
- `Newest binary != safest leader during mixed-version transition`.
- `Leadership handoff != protocol compatibility proof`.
- `Version-compatible leader != rollback-safe durable state`.

This connects Infrastructure Engineering with Self-Hosting update/skew research without merging their semantic ownership.

### Authority loss must stop new exclusive effects

For a correctness-sensitive exclusive controller, losing the ability to renew/verify authority must cause it to stop initiating new exclusive effects before another epoch can safely take over. This is a fail-closed authority rule, not necessarily a requirement to stop autonomous client runtimes or read-only/degraded local operation.

Candidate dispositions after authority uncertainty:

```text
READ_ONLY / OBSERVE_ONLY
LOCAL_NON_EXCLUSIVE
DEGRADED_BOUNDED_AUTONOMY
RECONCILE_REQUIRED
FENCED
```

Exact vocabulary remains research-only.

- `Control-plane authority lost != client runtime must stop`.
- `Local autonomy != permission for globally exclusive mutation`.
- `Previously authorized operation != indefinitely authorized operation` when its authority envelope expires.
- `Read availability != write authority`.

### Rejoin and delayed-command quarantine

When a previously isolated actor returns, delayed commands, queued retries and cached desired state must not be replayed blindly. Rejoin requires authority-epoch comparison, operation identity reconciliation and downstream-effect inspection where outcome was uncertain.

```text
reconnect
 -> establish current coordination epoch/revision
 -> quarantine stale queued work
 -> reconcile in-flight operation identities/effects
 -> classify obsolete vs still-eligible intent
 -> reacquire authority if required
 -> resume bounded actuation
```

Invariants:

- `Reconnect != resume old queue`.
- `Intent still desired != old command still eligible`.
- `Old command idempotent != old authority still valid`.
- `Reissued under new epoch != previous UNKNOWN effect disappeared`.

### Updated adversarial cases for split-brain

- leader pauses past lease expiry, successor acquires leadership, predecessor resumes and reaches the external resource;
- minority partition loses quorum but retains access to a device/provider while majority elects a successor;
- fencing token is generated but the downstream provider ignores it;
- leader loses coordination connectivity but retains local cached lease state and continues exclusive writes;
- watch stream reconnects after compaction and controller resumes from an incomplete local view;
- two sites have identical desired state but independently issue non-commutative effects;
- rolling upgrade elects a candidate that is alive but cannot safely read/write the durable state revision;
- old queued operation arrives after a newer leadership epoch has already converged the resource;
- coordination clocks skew while token epochs remain ordered, proving why time expiry and fencing are distinct;
- network heals and both sites immediately drain queued work before authority/effect reconciliation.

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
17. Correctness-sensitive exclusive effects carry a current authority epoch/fencing mechanism, or explicitly declare the weaker guarantee when the sink cannot enforce fencing.
18. Leadership acquisition proves predecessor fencing/effect exclusion before exclusive actuation where concurrent stale effects are possible.
19. Coordination/watch observations retain revision/currentness semantics; reconnect after history loss requires authoritative reconciliation.
20. Leadership eligibility during mixed-version operation is compatibility-qualified rather than liveness-only.
21. Rejoining actors quarantine stale queued work and reconcile UNKNOWN/in-flight effects before resuming authority-bound actuation.
22. Loss of global coordination authority does not silently terminate autonomous runtimes, but does bound or stop globally exclusive control-plane mutation.

## Portability / exit path

The research target remains provider-neutral contracts around resource identity, observations, operations, retry/disruption envelopes, capacity, topology/failure domains, leadership epochs, fencing and evidence. Kubernetes Leases/leader election, etcd revisions/transactions/watches and fencing-token patterns are reference evidence only. No Kubernetes, etcd, consensus library, host-agent architecture, cloud provider or distributed-lock implementation is selected by this document.

A provider that cannot expose/enforce fencing may still be supported, but the System Builder must preserve that limitation as a qualified capability/guarantee rather than silently projecting stronger semantics.

## Remaining high-value gaps

- cross-region/site autonomy and delayed reconciliation after long partitions;
- infrastructure identity/PKI bootstrap and rotation under disconnected operation;
- capacity models across heterogeneous work units and cost constraints;
- storage durability/replication proof and restore correctness;
- supply-chain-to-running-artifact identity;
- decommission/wipe/residual-resource proof;
- recovery game-days and simulation evidence contracts;
- formal classification of effect sinks by fencing capability and compensability.
