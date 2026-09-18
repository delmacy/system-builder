# G4 — Infrastructure Engineering & Control Plane R&D

Status: `RESEARCH_BACKLOG_ONLY`
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

## Control-plane separation

`Infrastructure State != Host Configuration State != Workload State != Network State != Observability State`.

A valid combined observation may be:

```text
Provider: RUNNING
Host: REACHABLE
Runtime: RUNNING
Workload: DEGRADED
Network: PARTIAL
Observability: STALE
```

Do not collapse this into one opaque status.

## Reboot/disruptive operations

Treat reboot as a durable governed operation:

```text
request -> impact analysis -> maintenance/security gate -> drain/checkpoint
-> reboot issued -> host disappears -> host returns -> identity verified
-> storage/network verified -> workloads reconciled -> post-reboot proof -> effective
```

`Connection lost after reboot command != reboot succeeded`.

## Reconciliation loop

```text
Canonical Desired State
 -> Controller
 -> Provider / Host Agent / Runtime
 -> Observed State
 -> Effective State
 -> Reconcile
```

Prefer multiple bounded controllers over one monolithic daemon.

## Proof obligations

1. Provider ACK cannot become effective truth.
2. Known resource does not imply authorized resource.
3. Host/workload/network/observability states remain separately observable.
4. Reboot/upgrade/recovery operations survive controller restarts.
5. Credentials/trust can be rotated and revoked.
6. Control-plane upgrade need not stop autonomous client runtimes where architecture permits.
7. Backup and restore are proven, not merely configured.
8. Failure of SB control plane leaves published runtimes autonomous.
9. Decommissioning verifies residual resources/secrets/endpoints.
10. Every infrastructure binding has an exit/recovery strategy.
