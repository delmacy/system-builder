# Deep Research — Station Reclaim, Fencing & Epoch Safety 01

Status: DEEP RESEARCH / RESEARCH RECOMMENDATION / NOT TARGET-ARCHITECTURE AUTHORITY

## Question

When a `Station` that holds exclusive ownership, a lease, or preallocated bounded-resource rights becomes unreachable or is presumed failed, **what evidence is sufficient to reclaim/reassign those rights without creating split-brain double ownership or stale-writer actuation**?

More specifically: can Generation 2 define provider-neutral reclaim semantics using failure suspicion, lease expiry, epochs/generations, fencing and qualified postcondition evidence, while keeping simple-system ergonomics, offline Station autonomy and `Enterprise → Station → Role → Person` authority non-amplifying?

This is the highest-value residual question from `DEEP_RESEARCH_OFFLINE_STATION_ESCROW_AUTHORITY_01.md`. That research strengthened preallocated rights as a way to keep selected bounded-resource operations available offline, but deliberately left reclaim after presumed Station death unresolved.

## Why this is architecturally material

A preallocated right is useful precisely because the Station may continue without the central control plane. That same property makes reclaim dangerous.

If Station A owns 20 offline inventory rights and becomes unreachable, the parent system may want to reassign those 20 units to Station B. But "unreachable" is observationally compatible with multiple realities:

- A crashed permanently;
- A is alive but partitioned;
- A is paused and will resume;
- A was restored from an older snapshot;
- A is malicious or compromised;
- A completed effects whose evidence has not yet reached the parent;
- A still possesses valid local authority and provider access.

Blind reclaim can therefore create two simultaneously effective owners of the same conserved right.

The problem spans Transaction/Consistency/Concurrency, Tenant/Fleet/Edge, Security/Resilience/Recovery, Lifecycle, Station/AGWS authority, provider negotiation and longitudinal saga gates. It is also a critical boundary for runtime autonomy: an autonomous Station must not become unsafe merely because the parent declared it dead too early.

## SB corpus consumed

Repository material was treated as research hypotheses/input corpus, not independent external evidence:

- `RESEARCH_PIPELINE_STATE.json` — phase remains `RESEARCH_ELICITATION`; cycle count and saturation are unaffected by deep research.
- `RESEARCH_EVIDENCE_METHOD.md` — requires triangulation across mature systems, standards/specifications, scientific literature and engineering evidence; contradictions must be preserved.
- `ARCHITECTURE_PROOF_QUALITY_METHOD.md` — requires failure/recovery, concurrency, authority, isolation, offline closure, version/evidence and adversarial proofs; its Security/Recovery proof explicitly calls for split-brain fencing or refusal/read-only degradation.
- `CAPABILITY_DISCOVERY_REGISTER.md`, `FINDING_INDEX.md`, `REPRESENTATIVE_COVERAGE.md`, `CAPABILITY_PROOF_MATRIX.md` — current candidate/finding/proof inventory and unresolved cross-cutting debt.
- `SYSTEM_BUILDER_STATIONS_AND_ADMINISTRATIVE_SURFACES.md`, `SYSTEM_BUILDER_STATION_CREATION_AND_TOPOLOGY_OPERATIONS.md`, `TENANT_FLEET_EDGE_INGRESS_ROUTING.md` — Station scope, delegated administration, topology and offline/edge boundaries.
- `SEMANTIC_ASSEMBLY_LINE_PROCESS_MODEL.md` — longitudinal saga progression must cross gates only with qualified semantic conditions, authority and evidence.
- `DEEP_RESEARCH_TRANSACTION_COMMIT_EFFECT_01.md` — rejects generic `SUCCESS`, blind retry and provider-level exactly-once as business correctness.
- `DEEP_RESEARCH_OFFLINE_STATION_ESCROW_AUTHORITY_01.md` — separates semantic authority from conserved resource rights and identifies reclaim/transfer generation as an unresolved correctness boundary.
- latest Lifecycle findings (`G2-FINDING-LVEM-30..37`) — revision vectors, attempted/effective distinction, ambiguous actuation reconciliation, consumer-effective transition closure and local/offline requalification.

No breadth capability is marked revisited, no full-cycle counter changes, and no saturation claim is made here.

## External evidence ledger

### E1 — Chandra & Toueg, *Unreliable Failure Detectors for Reliable Distributed Systems* (JACM, 1996)
Sources:
- https://research.ibm.com/publications/unreliable-failure-detectors-for-reliable-distributed-systems
- DOI: https://doi.org/10.1145/226643.226647

The paper formalizes failure detectors in asynchronous crash-prone systems through **completeness** and **accuracy**. A detector can suspect correct processes; failure suspicion is intentionally not identical to factual proof of death.

**Architectural evidence:** timeout/unreachability is a liveness signal, not sufficient safety evidence for reissuing an exclusive or conserved right. SB must distinguish `suspected failed/unreachable` from `fenced/non-actuating`.

### E2 — Gray & Cheriton, *Leases: An Efficient Fault-Tolerant Mechanism for Distributed File Cache Consistency* (SOSP, 1989)
Source: https://web.stanford.edu/class/archive/cs/cs240/cs240.1056/readings/89-leases.pdf
DOI: https://doi.org/10.1145/74850.74870

Leases grant rights for a bounded period and maintain consistency under stated non-Byzantine host/network failures using physical-clock assumptions. The work makes lease duration, recovery and clock behavior part of the correctness model rather than invisible implementation details.

**Architectural evidence:** one safe reclaim strategy is to wait until the old right is guaranteed expired under the profile's clock/failure assumptions before making a conflicting grant effective. Lease expiry is not portable magic: the assumptions and enforcement point must be explicit.

### E3 — Burrows, *The Chubby lock service for loosely-coupled distributed systems* (OSDI, 2006)
Sources:
- https://research.google/pubs/the-chubby-lock-service-for-loosely-coupled-distributed-systems/
- https://storage.googleapis.com/gweb-research2023-media/pubtools/4444.pdf

Chubby explicitly addresses the stale-holder problem. A lock holder can obtain a **sequencer** containing the lock generation; protected servers are expected to reject a sequencer that is no longer valid or older than what they have observed. The paper also gives the simpler acquisition-count example: pass a monotonically increasing lock acquisition count with a write and reject writes carrying an older count. For systems not modified to validate sequencers, Chubby offers only an imperfect `lock-delay` after a holder becomes inaccessible.

**Architectural evidence:** safe reassignment does not require proving the old process is physically dead if the actual mutation/effect sink can **fence stale generations**. Generation must be checked at the point capable of committing the protected effect; merely issuing a newer lease at a coordinator is insufficient for external resources.

### E4 — etcd concurrency/lease documentation and engineering note
Sources:
- https://etcd.io/docs/v3.5/dev-guide/api_concurrency_reference_v3/
- https://etcd.io/docs/v3.5/learning/why/
- https://etcd.io/blog/2020/jepsen-343-results/

etcd locks are lease-backed and expose revision-based ownership tests. Its documentation explicitly warns that the server may revoke a lease while the client still believes it holds it, and that an etcd lock by itself cannot safely protect an external resource unless that resource participates in version/revision validation. The Jepsen-related engineering note similarly distinguishes lock ownership inside etcd from safe access to external resources.

**Architectural evidence:** a lease/lock provider can satisfy coordination for its own state while failing the end-to-end SB proof. Provider compatibility for exclusive actuation must include an **effect-sink fencing capability** or an equivalent hard fence.

### E5 — Kubernetes client-go leader election
Sources:
- https://github.com/kubernetes/client-go/blob/master/tools/leaderelection/leaderelection.go
- https://pkg.go.dev/k8s.io/kubernetes/pkg/client/leaderelection

The implementation documentation explicitly states that it **does not guarantee only one client is acting as leader (fencing)**. It relies on locally observed timestamps and configurable lease/renew deadlines and discusses tolerance to clock skew rate.

**Architectural evidence / negative evidence:** mature leader-election/lease mechanisms may deliberately provide liveness coordination without stale-actor fencing. SB must not infer exclusive effect safety merely from a provider capability named `Lease`, `Lock`, or `LeaderElection`.

### E6 — Apache Hadoop HDFS High Availability fencing
Source: https://hadoop.apache.org/docs/r2.10.2/hadoop-project-dist/hadoop-hdfs/HDFSHighAvailabilityWithNFS.html

HDFS documentation calls out split brain explicitly: if the old Active cannot be verified to have relinquished active state, fencing must cut its access to shared edits storage before the new Active safely proceeds. Failover is blocked if fencing cannot succeed.

**Architectural evidence:** physical/resource fencing is a second safe pattern: rather than relying on cooperative stale-token checks, make the old holder unable to perform the protected effect at all. Importantly, failure suspicion alone does not authorize promotion.

### E7 — Pacemaker / ClusterLabs fencing (STONITH)
Source: https://clusterlabs.org/projects/pacemaker/doc/3.0/Pacemaker_Explained/pdf/Pacemaker_Explained.pdf

Pacemaker defines fencing as making a node unable to run resources even when the node is unresponsive. It exists specifically to protect against split brain where nodes cannot communicate but may still be active. Fencing may cut power or remove access to a capability such as shared storage/network.

**Architectural evidence:** for non-cooperating/legacy resources, hard fencing can be the only reliable way to make reassignment safe. Provider mechanics vary, but the portable requirement is proof that the old generation can no longer actuate the protected resource.

### E8 — Chubby session jeopardy / epoch behavior
Source: Burrows 2006, above.

During uncertain failover Chubby clients enter a jeopardy/grace interval and block application calls rather than continue as though session validity were certain. Client/master communication includes epoch checks; old-epoch requests are rejected after master change.

**Architectural evidence:** uncertainty should produce **quiesce/degrade/quarantine**, not optimistic authority. Epoch changes are useful only when all relevant acceptance points enforce them or the old actor is otherwise fenced.

## Competing models

### Model A — Timeout means dead; immediately reclaim

When Station A misses heartbeats for N seconds, parent reallocates all of A's rights to B.

**Strength:** very simple; maximizes capacity utilization and failover speed.

**Failure:** asynchronous systems cannot distinguish a slow/partitioned live Station from a dead one using timeout alone. A can resume and spend the same rights. If effects are external/physical, later reconciliation cannot necessarily undo the violation.

**Disposition:** DO_NOT_BUILD for exclusive or conserved rights.

### Model B — Lease expiry alone is sufficient everywhere

Every right has a TTL; after parent time passes expiry, it can be reassigned.

**Strength:** simple bounded recovery delay; no explicit fencing service needed in cooperative environments.

**Failure:** correctness depends on clock/failure assumptions and on the old Station/effect sink actually respecting expiry. A paused or partitioned client may resume with stale local belief. External systems may accept stale requests after expiry unless they check generation/validity. Byzantine/rollback cases exceed the classic lease model.

**Disposition:** KEEP only for profiles where expiration semantics are end-to-end enforceable and assumptions are explicit. DO_NOT universalize.

### Model C — Monotonic generation/epoch + fencing at every effect sink

Reassignment creates a strictly newer ownership generation. Every protected actuation carries that generation; the authoritative mutation/effect boundary rejects stale generations.

Conceptually:

```text
Grant(A, resource R, generation 41)
partition / suspected failure
Grant(B, resource R, generation 42)

EffectSink(R):
  accept g iff g >= accepted_generation(R)
  persist accepted_generation atomically with protected effect where required

A resumes with g=41 → REJECT
B acts with g=42 → eligible
```

**Strength:** safety does not depend on old Station cooperation or perfect failure detection; Chubby/etcd-style evidence supports it for resources capable of conditional/version validation.

**Weakness:** every relevant external effect sink must participate. A provider that cannot reject stale generations cannot satisfy this profile. Multiple independent sinks may require coordinated generation transition or conservative gate semantics.

**Disposition:** strongest portable pattern for cooperative mutable resources. KEEP/GENERALIZE as a provider requirement/profile, not as one provider token format.

### Model D — Hard/physical/resource fencing before reassignment

Before B's grant becomes effective, a fencing mechanism proves A can no longer access the protected actuator/resource (power off, revoke storage reservation, cut route, revoke workload identity at an authoritative enforcement point, etc.).

**Strength:** works for resources that cannot understand generation tokens; robust against stale process state when fencing truly controls the actuator.

**Weakness:** operationally heavier; fencing mechanism itself can fail; false fencing harms availability; scope must match all ways the old Station could actuate. A successful API response is not enough unless postconditions prove the fence is effective.

**Disposition:** KEEP as mandatory fallback for non-cooperating exclusive resources; PROVIDERIZE mechanics.

### Model E — Never reclaim automatically; require original Station reconciliation

Rights remain stranded until A reconnects and explicitly returns them or an operator manually resolves the situation.

**Strength:** safest simple semantics; no split-brain reclaim.

**Weakness:** potentially severe availability/capacity loss after permanent failure.

**Disposition:** KEEP as valid simple/conservative profile and mandatory fallback when neither end-to-end fencing nor trustworthy expiry is available. This directly supports mature-system semantics with simple-system ergonomics: a simple deployment may prefer stranded capacity over unsafe distributed reclamation.

## Strongest conclusion

**Failure suspicion is never sufficient evidence to make a conflicting right effective. Safe reclaim requires proving non-overlap of effective actuation, not proving ontological death of the old Station.**

There are three defensible portable ways to establish that non-overlap:

1. **Expiry closure:** the old right is guaranteed no longer effective under an explicit lease/clock/trust profile, and all effect points honor that expiry.
2. **Generation fencing:** a newer epoch/generation is issued and every relevant effect sink rejects stale generations before committing protected effects.
3. **Hard fencing:** an independently evidenced mechanism makes the old holder unable to actuate the protected resource.

If none can be proven, the architecture should **strand/quarantine the right and lose availability**, not reassign it speculatively.

Candidate rule:

> **Reclaim readiness = failure suspicion + authoritative ownership transition + stale-owner exclusion evidence. Suspicion starts recovery; fencing/expiry closes safety.**

## Failure detector versus fence

Generation 2 should keep these concepts semantically distinct:

```text
FailureDetector / HealthObservation
    says: "holder may be unavailable"

OwnershipTransition
    says: "a new generation is proposed/authorized"

Fence / ExpiryClosure
    says: "old generation can no longer produce accepted protected effects"

PostconditionEvidence
    says: "the exclusion mechanism is effective for the exact resource/scope/revision"
```

Collapsing them into `Station.status = DEAD` would erase the central correctness distinction.

A Station can be `UNREACHABLE` while still able to actuate an external provider. Conversely, a Station can be fenced from one resource while still operational for unrelated capabilities. Fencing should therefore be **resource/scope specific** unless a node-level fence intentionally removes all actuation.

## Epoch/generation semantics

A useful portable ownership transition should carry at least conceptually:

```text
resource / right scope
prior owner + prior generation
new owner + new generation
transition attempt identity
expected-base ownership revision
reason / authority
fencing/expiry profile
fence attempt + effective evidence
activation condition
consumed/remaining-right reconciliation status
```

Exact schema is deferred.

Generation must have these properties when used for fencing:

- ordered strongly enough for stale-vs-current comparison within the protected scope;
- never reused after rollback/restore;
- persisted independently of Station local snapshots;
- tied to exact resource/right scope;
- propagated to every protected effect path;
- rejected if absent/stale when the profile requires fencing;
- historical evidence remains immutable even after a later generation supersedes it.

A UUID that merely identifies a lease is not a fencing token unless the effect sink can determine staleness relative to newer ownership.

## Reclaim of conserved quantity rights is stricter than leader failover

For a pure exclusive lock, rejecting all stale-generation writes may be enough.

For **consumable escrow/budget rights**, reclaim must also account for unknown consumption already performed by the missing Station.

Example:

```text
A was allocated 20 units.
Central evidence confirms only 8 consumed.
A becomes unreachable.
```

The parent cannot safely conclude `12 unspent` merely because 8 is all it has observed. A may have consumed 5 additional units locally while partitioned.

Therefore reclaimed quantity must be bounded by one of:

- authoritative proof that A's local consumption log/state up to the fence point has converged;
- provider/effect-sink evidence that all accepted effects for generation A are enumerated through a closed position/range;
- a lease/expiry design where no unreported local consumption can become externally effective after the close point and local-only unreported consumption is treated as abandoned/quarantined;
- explicit conservative write-off/stranding of the uncertain remainder.

Candidate rule:

> **Fencing prevents future stale spending; it does not retroactively prove how much the old holder already spent.**

This is a major distinction from ordinary leader election and links directly to qualified evidence and `PARTIAL/INCONCLUSIVE` outcomes.

## Station snapshot/restore and cloning adversary

A reclaim design must assume that an old Station image can return.

If generation 41 is stored only inside A's snapshot, restoring the snapshot can resurrect obsolete ownership. Safe profiles therefore require the acceptance point to know that generation 42 superseded 41, or require a hard fence that blocks the restored instance.

Likewise, Station clone/split must never duplicate an active right generation. Clone may copy **eligibility/configuration**, but active consumable ownership must be separately issued.

This strengthens the previous deep-research rule that rights/authority/credentials are not ordinary configuration bytes.

## Longitudinal saga consequence

The assembly-line process model gains a precise recovery rule.

A saga stage waiting on a bounded/exclusive resource may observe:

```text
Station unreachable
→ recovery suspicion raised
→ reassignment proposed
→ old-generation exclusion unresolved
```

At this point the longitudinal Gate must not advance as though the new owner were effective.

Only after the stage's required profile has qualified stale-owner exclusion and any consumed-right reconciliation can the process cross the recovery/reassignment gate.

Possible outcomes:

- `FENCED_AND_REASSIGNED` — new generation effective;
- `EXPIRED_AND_REASSIGNED` — expiry closure proven;
- `STRANDED` — safe but unavailable;
- `PARTIAL/INCONCLUSIVE` — exclusion or consumed quantity cannot be proven;
- `QUARANTINED` — conflicting/stale actuation observed;
- `MANUAL_RECOVERY_REQUIRED` — irreversible/legacy boundary cannot be automatically resolved.

Exact vocabulary is deferred to synthesis.

## Authority boundary

Recovery safety must not collapse into recovery authorization.

A valid fencing mechanism proves an operation can be safe; it does not prove the caller is authorized to fence or reassign.

Generation 2 should preserve separate facets for at least:

- observe/suspect failure;
- propose reclaim;
- authorize fence;
- execute fence;
- validate fence postcondition;
- authorize ownership/right reassignment;
- activate new generation;
- reconcile old effects;
- write off/compensate uncertain remainder.

`Station Operator`, AGWS user or AI competence must not gain these facets merely because they can diagnose the failure.

## Provider-specific versus portable semantics

### Portable requirements/candidates

- failure suspicion distinct from fenced/effective-dead-for-resource;
- ownership generation/epoch identity and expected-base precondition;
- explicit protected resource/right scope;
- stale-holder exclusion requirement;
- expiry profile or fencing profile;
- evidence-qualified fence outcome;
- new-generation activation only after required exclusion evidence;
- consumed-right reconciliation status for quantitative rights;
- `INCONCLUSIVE`/stranded fallback;
- authority facets for reclaim/fence/reassign;
- historical transition lineage.

### Provider/runtime realization

- Chubby sequencer/acquisition count;
- etcd lease/revision checks;
- Kubernetes Lease object and leader-election timings;
- HDFS fencing scripts/shared-edits fencing;
- Pacemaker STONITH/power/fabric fencing;
- SCSI persistent reservations;
- cloud IAM/session revocation APIs;
- network ACL/firewall route isolation;
- provider-native lock/lease object formats.

### Do not universalize

- Kubernetes `Lease` as canonical SB lease object;
- etcd revision number as universal fencing token;
- Chubby sequencer byte string;
- HDFS NameNode active/standby lifecycle;
- Pacemaker STONITH action names;
- a single timeout value or clock model;
- `node unreachable == node dead`.

## Contradictions resolved

### "Lease expiry means the old holder is gone"
Rejected. Lease expiry can establish safe reassignment only under the lease profile's assumptions and enforcement. It is not evidence that the process is dead.

### "Consensus/leader election already prevents split brain"
Rejected as an end-to-end claim. Kubernetes explicitly documents non-fencing leader election; etcd documents that external resources require version validation; Chubby added sequencers specifically because lock ownership alone does not protect delayed external requests.

### "A newer generation solves everything"
Rejected. Generation only works if the effect sink enforces it. It also does not reveal unobserved consumption that happened before fencing.

### "Hard fencing is always required"
Rejected as universal. Cooperative resources can safely reject stale generations without powering off a Station. Hard fencing remains necessary/valuable when effect sinks cannot participate or when the protected scope cannot otherwise be closed.

## Failure/adversarial analysis

- **False suspicion:** healthy but partitioned A is suspected; B must not become conflicting effective owner until stale-A exclusion is proven.
- **GC/pause/resume:** A pauses beyond lease, B acquires newer generation, A resumes and sends delayed effect; sink rejects A.
- **Clock failure/skew:** lease expiry cannot be used beyond declared assumptions; profile degrades/blocks rather than asserting safety.
- **Fence API ACK lost:** fence attempt becomes `OUTCOME_UNKNOWN`; reconcile effective access before retrying destructive fencing or activating B.
- **Fence API ACK but ineffective:** postcondition probe shows A still has access; reassignment remains blocked.
- **Partial fencing:** A loses database write access but retains external payment API credential; resource-specific closure is incomplete.
- **Station snapshot rollback:** restored A with old generation attempts actuation; effect sink rejects generation.
- **Cloned Station:** two instances hold copied credentials/config; only the currently admitted ownership generation can actuate.
- **Unreported escrow spending:** fencing succeeds but parent lacks closed consumption evidence; future spending is blocked, uncertain remainder stays `PARTIAL/STRANDED`.
- **Malicious/compromised Station:** cooperative local expiry is insufficient; use sink-side fencing or hard fence for profiles that include hostile/stale actors.
- **Provider migration:** new provider cannot enforce generation; compatibility admission must reject automatic reclaim profile or require hard fencing.
- **Multiple effect sinks:** DB accepts epoch but message/external actuator does not; gate cannot claim globally fenced unless every mandatory effect path is qualified.

## Consequences for existing findings/candidates/hypotheses

1. **KEEP / GENERALIZE — qualified local closure:** offline autonomy requires not only local authority/state but also a defined ownership/fencing closure for reclaimable exclusive/bounded resources.
2. **GENERALIZE — revision vector:** active ownership generation belongs in the effective realization/recovery revision vector; restoring older bytes cannot roll it back.
3. **SPECIALIZE — ambiguous outcome:** fencing and reassignment are independent actuation attempts; ACK loss requires effective-state reconciliation just like provider create/migration operations.
4. **KEEP — Station authority non-amplification:** failure diagnosis does not confer fence/reassign authority.
5. **GENERALIZE — provider admission:** provider capability negotiation must state whether the realization can enforce stale-generation rejection, only provides lease/liveness, or requires external hard fencing.
6. **SPECIALIZE — escrow rights:** fencing closes future stale consumption but requires a second proof for already-consumed/unknown quantity before reclaiming residual budget.
7. **DO_NOT_BUILD — timeout-only automatic reclaim** for exclusive/conserved rights.
8. **DEFER — universal `Fence` primitive:** evidence supports a universal **stale-owner exclusion requirement**, but physical fence, sink-side generation validation and lease-expiry closure are distinct realizations. Synthesis should decide whether one primitive adds value or obscures these differences.

No top-level capability promotion is recommended from this deep dive alone.

## Proof obligations created/refined

### DR-SRFE-01 — False-positive failure detector
Partition Station A from the parent while A remains able to reach the protected effect sink. Parent suspects failure and proposes B. Expected: B cannot become conflicting effective owner until the selected exclusion profile succeeds.

### DR-SRFE-02 — Stale generation rejection
A holds generation 41, B receives 42 after valid transition, then delayed A writes with 41. Effect sink rejects 41 and evidence identifies exact resource, generation and rejection reason.

### DR-SRFE-03 — Lease expiry without sink fencing negative proof
Use a provider where coordinator lease expires but external sink accepts stale requests. Expected: provider profile is rejected for end-to-end exclusive reclaim or requires hard fencing; lease name alone does not pass conformance.

### DR-SRFE-04 — Hard fencing postcondition
Fence A by cutting exact actuator access. Simulate fence command ACK before access is actually removed. B remains inactive until an independent/effect-qualified postcondition proves A can no longer actuate.

### DR-SRFE-05 — Fence ACK loss / ambiguous actuation
Fence succeeds but response is lost. Reconciliation detects effective fence; system must not blindly repeat a destructive fence nor simultaneously activate B before effective state is known.

### DR-SRFE-06 — Partial-resource fence
Remove A's DB access but leave another required provider actuator reachable. Recovery gate remains `PARTIAL/INCONCLUSIVE` for the composite operation rather than claiming fully fenced.

### DR-SRFE-07 — Snapshot resurrection
Restore A from a snapshot containing an old active grant/generation after B is current. A cannot produce an accepted protected effect.

### DR-SRFE-08 — Station clone/split
Clone Station configuration while an active consumable right exists. Clone receives no duplicate spendable generation; eligibility may copy, active ownership may not.

### DR-SRFE-09 — Unknown consumed escrow remainder
A owns 20, central sees 8 consumed, then A is fenced. Without a closed consumption range/position, system must not reissue assumed remaining 12 as fully safe; uncertain quantity remains reserved/stranded or explicitly dispositioned.

### DR-SRFE-10 — Closed consumption proof
Same scenario, but provider/local journal supplies complete, integrity-qualified consumption through the fence boundary. Only the proven unconsumed remainder may be reassigned.

### DR-SRFE-11 — Provider substitution
Provider X supports atomic generation validation at effect sink; Provider Y offers only TTL lease. Same semantic requirement is admitted on Y only with a compatible alternative exclusion profile; mandatory semantics are not silently weakened.

### DR-SRFE-12 — Authority facet proof
Person/AI can diagnose Station loss but lacks `fence`/`reassign` authority. It may propose/escalate; no ownership generation or actuator access changes.

### DR-SRFE-13 — Longitudinal recovery gate
A saga awaits an exclusive/bounded-resource stage. Failure suspicion alone cannot cross the gate; gate advances only with the configured stale-owner exclusion plus required consumed/effect evidence.

### DR-SRFE-14 — Simple-system conservative profile
Run a small single-runtime/self-hosted profile with no distributed fencing provider. On ambiguous owner loss, system strands the right and requests/manualizes recovery rather than requiring enterprise HA machinery or performing unsafe automatic reclaim.

### DR-SRFE-15 — Clock/failure assumption invalidation
Inject clock skew/rate or trust failure beyond lease profile bounds. Existing expiry readiness becomes stale/inapplicable; reassign is blocked or switches to a different fence profile.

### DR-SRFE-16 — Multi-sink composite fencing
One operation can affect DB, queue and external provider. Prove that a new owner is not declared fully effective until every mandatory sink is either generation-fenced, hard-fenced, or otherwise proven non-overlapping according to the operation's effect profile.

## Falsification paths

This recommendation should be weakened or specialized if evidence demonstrates any of the following:

- a general asynchronous technique can safely reclaim conflicting rights from an unreachable actor without expiry assumptions, sink cooperation or hard fencing;
- monotonic generation validation is shown insufficient even when atomically enforced at every protected mutation point under the stated non-Byzantine model;
- the SB Station model proves it never permits offline holders to retain independently effective external actuation, eliminating this problem structurally;
- provider conformance shows a simpler primitive can express all three safe non-overlap mechanisms without losing their assumptions/failure semantics.

Until such evidence exists, timeout-only reclaim remains falsified.

## Unresolved questions

1. Should `OwnershipGeneration` be universal shared lineage or specialized under Resource Rights / Provider Binding / Recovery?
2. Should `FenceRequirement` be one portable primitive with profiles (`expiry`, `generation`, `hard`) or three distinct requirement families?
3. How should multiple heterogeneous effect sinks define one composite fence closure without reintroducing distributed transaction semantics?
4. What is the minimal evidence needed to close pre-fence consumable-right history when a Station is permanently lost?
5. How should malicious/Byzantine Stations change the trust model? Hard fencing may need cryptographic/provider revocation plus anti-rollback hardware roots.
6. Can commercial entitlements/usage budgets reuse the same conserved-right + fencing semantics without coupling billing semantics to runtime resource coordination?
7. Which operations are worth automatic reclaim versus conservative stranding based on business criticality and RTO?
8. How are outstanding human tasks/workflow waits tied to a Station ownership generation during failover?

## Confidence

**High** for the negative conclusion that unreachability/timeout alone cannot safely authorize conflicting reclaim.

**High** for the general requirement that the old generation must be excluded at the actual effect boundary (or through an equivalent hard fence/expiry closure) before the new conflicting grant becomes effective.

**High-medium** that monotonically ordered ownership generation should appear in portable semantics where sink-side fencing is required; exact universal primitive ownership is not yet justified.

**Medium** for a unified three-profile reclaim abstraction (`expiry`, `generation fencing`, `hard fencing`); synthesis should test whether this generalization improves clarity or hides materially different failure models.

## Proposed research dispositions

- **KEEP:** failure suspicion as recovery trigger only, never exclusive-right safety proof.
- **GENERALIZE:** stale-owner exclusion as a cross-cutting recovery/reassignment requirement.
- **GENERALIZE:** ordered ownership generation/epoch where effect sinks support fencing.
- **SPECIALIZE:** escrow/budget reclaim requires both future fencing and closed/qualified prior-consumption evidence.
- **PROVIDERIZE:** lease implementation, sequencer/revision format, STONITH, storage reservation, IAM/network fence and concrete postcondition probes.
- **KEEP:** explicit conservative `STRANDED / MANUAL_RECOVERY_REQUIRED` profile for simple systems and unsupported boundaries.
- **DO_NOT_BUILD:** timeout-only or health-status-only automatic reclaim of exclusive/conserved rights.
- **DEFER:** exact universal primitive/schema names until Capability Synthesis reconciles Security/Recovery, Provider/Binding, Lifecycle, Transaction/Consistency and Tenant/Station findings.

## Recommended next deep question

**Composite saga effect closure across heterogeneous sinks:** when one longitudinal capability operation commits effects to multiple boundaries (database, message/event channel, external provider, human/physical action), what portable evidence model lets a Gate decide `BUSINESS_EFFECTIVE` or `INCONCLUSIVE` without requiring universal distributed ACID and without treating each sink's ACK as equivalent semantic success?

This directly composes DR-TCE outcome semantics with the longitudinal process model and the present fencing result, and can determine whether `Gate`/postcondition evidence can remain simple while handling mature enterprise side effects.