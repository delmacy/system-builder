# G4 — Negotiation Evidence Lifecycle Under Rollout, Partition & Rollback

Status: `RESEARCH_ACTIVE / NON_EXECUTABLE`
Execution authority: NONE
Date: 2026-09-19
Parent family: Shared Semantic Kernel / Capability Exchange Plane / Inter-Capability Boundary Model

## Purpose

Deepen the proof-semantics profile-negotiation research at the point where a profile has already been selected but the world changes underneath it: a fleet rolls forward, a peer retires a profile, a partition hides a newer security floor, queued work is delivered later, a long-lived stream survives deployment change, or an implementation rollback is attempted.

This is not a new macro-family. It selects no broker, RPC stack, workflow engine, service mesh, verifier, update framework or provider and grants no implementation authority.

## Evidence classes reviewed

Primary/mature evidence used in this round:

- QUIC / RFC 9000: a connection commits to its selected protocol version; packets indicating a different version are rejected for that existing connection. Network-path migration does not imply semantic/version renegotiation. Remembered 0-RTT parameters are provisional for a new connection until the handshake establishes the current parameters.
- QUIC Compatible Version Negotiation / RFC 9368: fleet rollout separates Acceptable, Offered and Fully Deployed versions, uses staged addition/removal and explicitly acknowledges downgrade exposure during mixed deployment.
- Apache Kafka rolling-upgrade guidance: binaries can be rolled first while an older inter-broker protocol remains pinned; the protocol is advanced only after fleet verification. Historical guidance also documents points after which downgrade is no longer possible. This is useful evidence for separating implementation rollout from semantic/protocol activation and for treating rollback capability as phase-dependent.
- Kubernetes Deployment rollout/rollback: revision rollback is an operational deployment mechanism with bounded retained history. It demonstrates that implementation generation rollback is a deployment action, not proof that every dependent semantic/security state can move backward safely.
- TUF threat model/update work: rollback/freeze resistance and expiring metadata demonstrate that possession of previously valid material does not imply indefinite current admissibility; currentness and anti-rollback remain separate from artifact integrity.
- Prior G4 work on in-flight contract evolution, offline security floors, evidence-minimal reconciliation, composition-policy anti-rollback, normative semantics snapshots and downgrade-resistant profile negotiation.

Representative references:

- https://www.rfc-editor.org/rfc/rfc9000.html
- https://www.rfc-editor.org/rfc/rfc9368.html
- https://kafka.apache.org/documentation/#upgrade
- https://kubernetes.io/docs/tasks/run-application/update-deployment-rolling/
- https://theupdateframework.io/

## 1. Negotiation has an evidence lifecycle, not a timeless boolean

A successful negotiation is evidence about a bounded relationship at a bounded time. It does not become a permanent property of the two capabilities.

Candidate lifecycle vocabulary:

```text
NEGOTIATED
ACTIVE
REVALIDATION_REQUIRED
DRAINING
EXPIRED
SECURITY_SUPERSEDED
PARTITION_STALE
QUARANTINED
SETTLED
HISTORICAL_ONLY
```

These are research dispositions, not a committed state machine.

Core boundary:

```text
profile negotiated once != profile admissible forever
```

The evidence lifecycle is driven independently by peer identity, contract scope, semantic-profile identity, deployment state, security floor, authority/classification context, dependency currentness and the lifetime of the occurrence/session/work item that relied on the negotiation.

## 2. Pinning scope must be explicit

QUIC provides a strong transport precedent: an established connection is committed to a version; a packet using another version does not silently mutate that connection. G4 should extract the semantic principle without binding itself to QUIC:

```text
selected profile for an admitted semantic scope
!= mutable default profile of the current deployment
```

A negotiation therefore needs an explicit **pinning scope**. Candidate scopes include:

```text
single exchange
request/response occurrence
workflow participant obligation
session
stream generation
queued message occurrence
bounded batch
```

Pinning does not mean an old profile can run forever. It means that changing the deployment default does not silently reinterpret already-admitted work.

## 3. Admission, continuation and new effect are distinct decisions

A long-lived occurrence can have been validly admitted under S2 while the platform now requires S3 for new work. Three questions must remain separate:

```text
Was the occurrence validly admitted under S2?
May the occurrence continue interpreting historical evidence under S2?
May it create a new security-sensitive effect under S2 now?
```

Possible answer: `yes / yes / no`.

Therefore:

```text
historical semantic continuity
!= continuation authority
!= new-effect admissibility
```

This extends the earlier G4 distinction between obligation horizon and security-support horizon into profile negotiation.

## 4. Long-lived streams need generation boundaries

A stream can outlive a rollout. Silently switching the semantic profile mid-stream can make adjacent records incomparable or reinterpret acknowledgements, ordering, currentness or authority semantics.

Candidate rule:

```text
stream continuity != permission for invisible semantic mutation
```

When a material profile change is required, the system needs a visible boundary such as a new stream/session generation, explicit renegotiation checkpoint, or qualified transition marker. The mechanism is not selected; the proof obligation is that consumers can determine which immutable profile governs each semantically relevant segment.

For changes proven conservative for the exact stream contract, continuation may be qualified without a hard reconnect. That preservation claim itself is evidence; it cannot be inferred from schema compatibility or version numbering.

## 5. Queued asynchronous work carries admission semantics forward

Broker enqueue time and consumer delivery time may be separated by minutes, days or a partition. Re-negotiating solely at delivery can silently change the meaning of an already-admitted command; blindly honoring the old profile can violate a newer security floor.

Candidate decomposition:

```text
AdmissionProfileRef
AdmissionPolicy/FloorEvidence
DeliveryTimeCurrentFloor
ExecutionProfileDisposition
```

A queued item therefore needs enough durable evidence to answer both:

1. what semantics governed admission; and
2. whether execution of the still-pending effect remains admissible now.

Possible dispositions:

```text
EXECUTE_PINNED
EXECUTE_AFTER_QUALIFIED_REVALIDATION
MEDIATE_EXPLICITLY
QUARANTINE
EXPIRE
FORWARD_RECOVER
MANUAL_SETTLEMENT
```

`message still in queue` is not authority to execute indefinitely.

## 6. Delivery retry must not become semantic renegotiation

A broker redelivery, RPC retry or failover route can reach a newer provider generation. Retry machinery must not silently select a different semantic profile just because the original target disappeared.

```text
retry/re-route != new semantic admission
```

If the original profile is still admissible and the new provider is qualified to honor it, retry may proceed under the same semantic identity. Otherwise the transition requires explicit revalidation/mediation or a failure disposition.

This protects idempotency and deduplication assumptions as well: the same logical effect must not become two differently interpreted effects merely because delivery crossed a rollout boundary.

## 7. Implementation rollout and semantic activation are separate phases

Kafka's mature rolling-upgrade guidance provides a reusable pattern: new binaries can be deployed while an older inter-broker protocol remains active; only after the fleet is verified is the protocol advanced. Some historical transitions also create a point after which downgrade is no longer possible.

The implementation-independent G4 lesson is:

```text
new implementation present != new semantic profile activated
semantic profile activated != old implementation rollback remains safe
```

Candidate rollout phases:

```text
implementation-capable
profile-acceptable
profile-offerable
profile-active-for-new-admission
profile-fully-deployed-for-scope
old-profile-draining
old-profile-no-new-effects
old-profile-historical-only
```

This deduplicates with the previous Acceptable/Offered/Fully-Deployed model but adds the missing **in-flight evidence/drain** dimension.

## 8. Rollback is multidimensional and may be asymmetric

Kubernetes can roll a Deployment back to a retained ReplicaSet. That is useful operationally, but G4 must not generalize deployment rollback into semantic/security rollback.

```text
implementation rollback
!= semantic-profile rollback
!= security-floor rollback
!= evidence reinterpretation
```

A new binary may be rolled back while the higher semantic/security floor remains monotonic, provided the old binary is qualified to honor that floor. If it is not, rollback may be unavailable even though an old artifact still exists.

Conversely, a semantic activation may cross an irreversible compatibility boundary. Kafka's historical upgrade guidance explicitly documents protocol transitions after which older downgrade is no longer possible. The general rule is that rollback capability is **phase- and dependency-specific**, not a permanent promise.

## 9. Partitioned runtimes need action-time evidence and reconciliation-time classification

An autonomous runtime can become partitioned after negotiating S2. While disconnected, the global/federated security floor may advance to S3. The runtime cannot pretend to have observed that change, but reconnect also cannot erase what physically happened.

Candidate evidence should preserve at least:

```text
profile used
local floor/policy snapshot used
snapshot currentness horizon
last trusted floor/checkpoint observed
local action/effect time evidence
partition/disconnection evidence where available
peer/tenant/classification scope
later observed successor floor and its effective semantics
```

On reconciliation, classify rather than rewrite:

```text
VALID_UNDER_OBSERVED_LOCAL_BASIS
VALID_HISTORICALLY_BUT_NOW_RETIRED
OUTSIDE_DECLARED_OFFLINE_HORIZON
CONFLICTED_WITH_SUCCESSOR_SECURITY_FLOOR
CURRENTNESS_UNKNOWN
REQUIRES_MANUAL_OR_FORWARD_RECOVERY
```

These names are illustrative.

Core boundary:

```text
runtime learned of floor S3 later
!= runtime had S3 evidence at action time
!= effect never happened
```

The system preserves historical truth while allowing policy to classify the effect as non-admissible, conflicted or requiring remediation under the successor security regime.

## 10. Effective-time semantics must be explicit

A security floor can be published at time T2 but declare an effective rule whose applicability differs by policy. The model must not infer retroactivity from observation time alone.

```text
floor publication time
!= floor effective time
!= runtime observation time
!= effect time
```

If policy declares emergency revocation effective immediately or from a named cutover, reconciliation uses that declared semantics. If no trustworthy temporal relation can be established, `UNKNOWN` remains representable rather than manufacturing a false success or false historical rewrite.

## 11. Revalidation should be scoped, not global lockstep

A profile retirement need not stop every occurrence. Revalidation is required at the boundary where a still-pending action depends on a changed invariant.

Examples:

- historical proof interpretation may continue under an old immutable profile;
- a read-only stream may continue if its required semantics remain qualified;
- a new authority-bearing command may require immediate floor revalidation;
- an already-effective irreversible external action cannot be undone by renegotiation and instead moves to reconciliation/settlement.

Therefore:

```text
profile change != global stop-the-world
```

but also:

```text
occurrence already admitted != bypass successor safety gate for future effects
```

## 12. Provisional reuse is weaker than completed revalidation

QUIC 0-RTT provides a useful analogy: remembered parameters from a previous connection can be reused provisionally for early data, but the new handshake establishes current parameters, and 0-RTT carries explicit replay limitations.

For G4, cached negotiation may permit bounded low-risk continuation only where the interaction contract declares that provisional reuse is safe. It must not be generalized to security-sensitive side effects merely for latency.

```text
cached profile evidence != freshly revalidated profile evidence
```

A provisional path needs a declared risk class, replay/idempotency treatment, currentness horizon and reconciliation rule.

## 13. Topology migration must preserve occurrence identity and profile lineage

QUIC path migration demonstrates that network path can change while connection identity persists. The implementation-independent lesson is useful for the Exchange Plane:

```text
topology/path migration != semantic occurrence migration
```

Failover from one host, pod, process, broker partition or network path to another must preserve the occurrence's selected profile lineage unless an explicit semantic transition occurs. The new endpoint/provider must prove qualification for the pinned profile or force an explicit revalidation disposition.

## 14. Drain is an evidence problem, not merely a traffic problem

Stopping new admissions to S2 does not prove S2 is retired. There may still be:

- active sessions;
- queued commands;
- delayed retries;
- offline runtimes holding bounded cached evidence;
- unresolved `UNKNOWN` effects;
- historical proofs requiring S2 interpretation;
- compensation/settlement obligations created under S2.

Candidate distinction:

```text
admission drained
!= effect obligations drained
!= executable dependency drained
!= historical interpretation drained
```

Retirement criteria must name which horizon is closing.

## 15. Exchange intermediaries cannot erase lifecycle evidence

A broker, gateway, service mesh or adapter that buffers/retries/reroutes work must preserve or explicitly transform the semantic lifecycle evidence required by the contract.

It must not:

- replace an immutable profile ref with `latest`;
- drop admission-time floor/currentness evidence;
- treat redelivery as fresh admission;
- strip tenant/classification/authority context;
- silently switch provider/profile after failover;
- turn a quarantine/revalidation requirement into success;
- become the canonical business owner of the occurrence.

`transport continuity != semantic continuity` remains explicit.

## 16. Candidate negotiation-evidence record

Research vocabulary only:

```text
NegotiationEvidence
  negotiationRef
  initiator/responder trust refs
  interaction/contract ref
  immutableProfileRef
  pinningScope
  admittedAt
  admissionPolicyRef
  admissionSecurityFloorRef
  admissionCurrentnessEvidence
  profileDeploymentScopeRef
  validity/currentness horizon
  occurrence/workflow/stream generation ref
  transition/revalidation evidence refs[]
  lifecycleDisposition
  supersession/revocation refs[]
  settlement/reconciliation refs[]
```

The record is evidence, not canonical business truth. Capability-owned business state remains capability-owned.

## 17. Candidate proof obligations

Before implementation planning, prove or explicitly bound:

1. profile negotiation evidence has a declared pinning scope and lifetime;
2. changing the deployment default cannot silently reinterpret already-admitted work;
3. admission validity, continuation authority and new-effect admissibility remain separate decisions;
4. long-lived streams expose a semantic generation boundary when a material profile change occurs;
5. queued work preserves admission-time profile/policy evidence until settlement or qualified expiry;
6. delivery-time execution rechecks the dimensions whose currentness/security contract requires it;
7. retry/redelivery/failover cannot silently become semantic renegotiation;
8. a new provider generation must prove qualification for the pinned profile or trigger explicit revalidation/mediation;
9. implementation rollout can precede semantic activation without claiming the new semantics are already effective;
10. rollback capability is explicitly bounded by semantic, data, security and dependency state;
11. implementation rollback cannot lower a monotonic security floor by accident;
12. a partitioned runtime records enough local basis to explain what it believed/admitted at action time;
13. later reconciliation does not rewrite the immutable historical profile under which evidence was created;
14. successor floor publication/effective/observation/effect times remain distinct where material;
15. offline work beyond its declared currentness/security horizon becomes explicit `UNKNOWN`/conflicted/quarantined rather than false success;
16. profile retirement can block new effects without destroying historical interpretability;
17. revalidation is scoped to changed invariants/obligations rather than requiring global lockstep;
18. cached/provisional negotiation reuse is distinguishable from freshly revalidated evidence;
19. topology/path changes preserve semantic occurrence/profile lineage unless an explicit transition is recorded;
20. draining new traffic is not mistaken for draining all outstanding semantic obligations;
21. intermediaries preserve required profile/tenant/classification/authority/currentness evidence across buffering and rerouting;
22. client runtimes can continue autonomously within declared local horizons without live Builder/central negotiation services;
23. an irreversible external effect that becomes security-conflicted moves to reconciliation/settlement rather than being fictionally rolled back;
24. historical-only profile support cannot be reactivated for new effects merely by implementation rollback.

## 18. Adversarial cases

1. S2 session remains open while S3 becomes the new floor and continues issuing privileged commands indefinitely;
2. broker queues a command under S2 and delivers it after S2 is security-revoked;
3. consumer treats delayed delivery as fresh admission and silently executes under S3 despite S2-specific command semantics;
4. retry reaches a new provider generation that only approximates S2 and claims success;
5. stream changes from S2 to S3 mid-sequence with no generation marker;
6. gateway replaces pinned `profileRef=S2` with `latest` during failover;
7. deployment rollback restores S2 binary and accidentally lowers the security floor from S3;
8. old binary cannot enforce S3 but orchestrator still marks rollback healthy;
9. profile activation changes an on-disk/message format and later binary rollback cannot interpret it;
10. partitioned runtime keeps admitting S2 effects after its declared offline horizon expires;
11. runtime reconnects and rewrites historical S2 evidence as if S3 had governed it;
12. successor policy is observed at T4 and incorrectly assumed retroactive to all effects before T4;
13. emergency revocation effective at T2 is ignored because disconnected runtime learned it only at T5;
14. stale cache says S2 remains admissible after retirement;
15. load balancer moves an occurrence to a replica that never qualified the pinned profile;
16. service mesh authenticates transport peer and is treated as proof that semantic generation remained unchanged;
17. broker redelivery loses tenant/classification metadata and reuses negotiation evidence from another scope;
18. new admissions stop, but delayed retries keep S2 effect rights alive indefinitely;
19. historical verifier/profile retention is mistaken for permission to execute new S2 business effects;
20. central registry outage causes all in-flight local work to fail despite still-current locally durable evidence;
21. provisional cached negotiation is used for a non-idempotent high-impact effect without replay qualification;
22. rollback UI advertises `rollback available` without exposing that semantic/security rollback is forbidden;
23. adapter mediates S2->S3 but drops a guarantee and does not record lossiness;
24. one broker outage causes platform-wide semantic renegotiation because negotiation identity was coupled to broker topology.

## 19. Material synthesis

Durable boundaries added/refined by this round:

```text
Negotiated once != admissible forever
Selected profile for admitted scope != mutable deployment default
Historical semantic continuity != continuation authority != new-effect admissibility
Stream continuity != invisible semantic mutation
Queued work admission semantics != delivery-time execution admissibility
Retry/redelivery != new semantic admission
New implementation present != new semantic profile activated
Implementation rollback != semantic-profile rollback != security-floor rollback
Rollback capability is phase- and dependency-specific
Floor publication time != floor effective time != runtime observation time != effect time
Profile change != global stop-the-world
Cached profile evidence != freshly revalidated profile evidence
Topology/path migration != semantic occurrence migration
Admission drained != effect obligations drained != historical interpretation drained
```

The implementation-independent hypothesis is therefore that negotiation produces **scoped, durable evidence with a lifecycle**, not a timeless compatibility bit. An admitted occurrence pins immutable semantic identity for the scope necessary to interpret its history, while continuation and future effects remain subject to explicit currentness/security revalidation. Rolling deployment, semantic activation and rollback are separate transitions. Partitions preserve action-time evidence and reconcile later without rewriting history; security floors may supersede future authority without pretending prior physical effects did not occur. Queues, streams, retries, gateways and topology changes must preserve profile lineage or expose an explicit qualified transition.

## 20. Deduplication against existing G4 research

This round does not reopen the earlier in-flight contract-evolution model. That work already established per-obligation lineage, `PIN | MEDIATE | MIGRATE | FORWARD_RECOVER`, obligation horizons and `UNKNOWN` as a migration barrier. The material addition here is narrower: it binds **negotiation evidence itself** to occurrence/session/stream/queue lifecycles and separates implementation rollout, semantic activation, security-floor advancement, partition reconciliation and rollback availability.

It also does not duplicate offline-security research: offline horizons remain authoritative. The new delta is how a previously negotiated profile is classified and preserved across a later partition/reconnect and how queued/in-flight work is prevented from turning stale negotiation into fresh authority.

## 21. Portability / exit path

The model intentionally does not require a single broker, registry, mesh, workflow engine or central negotiator. A portable realization needs only to preserve the declared evidence semantics across transports:

- immutable profile identity;
- pinning scope/generation;
- admission basis and relevant currentness/security horizon;
- transition/revalidation evidence;
- explicit failure/quarantine/settlement dispositions.

Direct calls, RPC, IPC, broker delivery, streams and file exchange can realize these semantics differently. A provider that cannot preserve required lifecycle evidence is incompatible for that contract; an adapter may mediate only with explicit qualification/lossiness.

## 22. Maturity and next gap

This round materially changes the concurrent-rollout/partition/rollback boundary, so it is not `NO_MATERIAL_DELTA`.

Family 8 remains `RESEARCH_ACTIVE / NON_EXECUTABLE` and not saturated.

Highest-value remaining gap: **semantic generation handoff for multiplexed and partially ordered exchanges** — determine how one logical occurrence containing parallel branches, multiple streams, batched commands or actor/mailbox traffic crosses a profile-generation boundary without assuming one global cutover point; how per-branch pinning composes at joins; and how revalidation/settlement evidence proves that no old-generation effect right leaks across a cutover while preserving autonomous progress where branches are independent.