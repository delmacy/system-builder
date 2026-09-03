# Deep Research — Offline Station Escrow, Bounded Rights & Authority 01

Status: DEEP RESEARCH / RESEARCH RECOMMENDATION / NOT TARGET-ARCHITECTURE AUTHORITY

## Question

Can Generation 2 safely let a disconnected or intermittently connected `Station` continue selected operations that would otherwise require global coordination by pre-allocating **bounded resource rights / escrow / leases / budgets**, while preserving `Enterprise → Station → Role → Person` non-amplifying authority, business invariants, provider neutrality, revocation semantics and later reconciliation evidence?

This is the next unresolved question from `DEEP_RESEARCH_TRANSACTION_COMMIT_EFFECT_01.md`. The prior result established that non-confluent invariants require coordination **unless the semantic model is changed** so independent operations become invariant-preserving. The material question here is whether pre-allocation can be that semantic transformation for selected offline/edge Station workloads, and what must remain explicitly impossible.

## Why this is architecturally material

Generation 2 simultaneously wants:

- autonomous/offline capable runtimes and Stations;
- non-amplifying delegated authority;
- longitudinal process gates that advance only on qualified semantic postconditions/evidence;
- correct bounded-resource behavior under concurrency/partition;
- simple-system ergonomics without forcing a central round-trip for every operation;
- provider-neutral semantics with mature mechanics delegated to providers.

These goals conflict when an operation consumes a globally bounded resource, such as stock, quota, budget, seats, permits, capacity or another quantity governed by an invariant like `remaining >= 0`.

If every disconnected Station merely caches the last observed global balance or authorization decision, two Stations can each act correctly against stale local state and jointly violate the invariant. If all such operations require synchronous central coordination, offline autonomy disappears. If an opaque provider lease/token is treated as canonical authority, provider lock-in and authority confusion follow.

The architecture therefore needs to know whether **offline availability is obtained by delegating a bounded slice of the invariant**, not by weakening the invariant.

## SB corpus consumed

The following repository material was treated as hypothesis/input corpus rather than independent factual evidence:

- `RESEARCH_PIPELINE_STATE.json` — phase remains `RESEARCH_ELICITATION`; Transaction/Consistency/Concurrency and Tenant/Fleet/Edge are mandatory unresolved hypotheses; AGWS/Station authority remains non-amplifying.
- `RESEARCH_EVIDENCE_METHOD.md` — requires triangulation across production, standards, literature and engineering evidence and preservation of divergence.
- `ARCHITECTURE_PROOF_QUALITY_METHOD.md` — explicitly requires transaction/concurrency, Station/AGWS authority, offline/autonomous closure, provider substitution, isolation and evidence proofs.
- `CAPABILITY_DISCOVERY_REGISTER.md`, `FINDING_INDEX.md`, `REPRESENTATIVE_COVERAGE.md`, `CAPABILITY_PROOF_MATRIX.md` — current research inventory and proof debt.
- `TENANT_FLEET_EDGE_INGRESS_ROUTING.md` — local/edge operation must preserve tenant/Station scope and isolation; placement is not semantic identity.
- `SYSTEM_BUILDER_STATIONS_AND_ADMINISTRATIVE_SURFACES.md` and `SYSTEM_BUILDER_STATION_CREATION_AND_TOPOLOGY_OPERATIONS.md` — Station composition, offline/restricted operation, deterministic effective surface and no silent authority/secret duplication.
- `EXECUTABLE_CAPABILITY_COMPOSITION_AND_CUMULATIVE_CONTEXT.md` and `SEMANTIC_ASSEMBLY_LINE_PROCESS_MODEL.md` — longitudinal saga progress consumes transversal capabilities; each operation receives minimum authorized projection; gates require qualified evidence.
- `DEEP_RESEARCH_EXECUTABLE_OPERATION_COMPOSITION_01.md` — capability-owned semantic operations remain distinct from workflow control/provider mechanics.
- `DEEP_RESEARCH_TRANSACTION_COMMIT_EFFECT_01.md` — generic `SUCCESS`, universal distributed ACID and provider exactly-once were rejected; invariant-scoped coordination and evidence-qualified gate admission were strengthened.

No full-cycle counter, revisit marker or saturation state is changed by this deep research.

## External evidence ledger

### E1 — O'Neil, *The Escrow Transactional Method* (ACM TODS, 1986)
Source: https://doi.org/10.1145/7239.7265
Supporting index/abstract: https://bishtref.com/articles/10.1145/7239.7265

Escrow permits concurrent updates to aggregate quantities by reserving portions of the safe update range rather than serializing every long-lived transaction. The method explicitly targets hot spots and long-lived/distributed work, including delayed communication, while retaining recoverability.

**Architectural evidence:** a bounded numeric invariant can sometimes be transformed from globally coordinated mutation into locally admissible mutation by allocating conserved rights. This is not generic eventual consistency: the database/application must understand the invariant/update type.

### E2 — Balegas et al., *Extending Eventually Consistent Cloud Databases for Enforcing Numeric Invariants* (IEEE SRDS 2015)
Sources:
- https://arxiv.org/abs/1503.09052
- https://doi.org/10.1109/SRDS.2015.32

The bounded-counter design applies escrow ideas to geo-replicated/eventually consistent stores. Rights are distributed among replicas; decrements are locally permitted only within owned rights; asynchronous rights transfer restores flexibility. The paper reports lower latency and greater partition availability than centralized strong consistency for the studied numeric invariant.

**Architectural evidence:** preallocated rights can preserve a numeric global invariant during partitions without a central authority on every mutation. The semantic requirement is conservation of rights; CRDT/Riak representation is a realization choice.

### E3 — Bailis et al., *Coordination Avoidance in Database Systems* (PVLDB 2015)
Sources:
- https://www.vldb.org/pvldb/vol8/p185-bailis.pdf
- https://amplab.cs.berkeley.edu/publication/coordination-avoidance-in-database-systems/

Invariant confluence gives a necessary-and-sufficient criterion for coordination-free convergent execution relative to a set of operations and invariants. If the operations are not invariant-confluent, some coordination is required **unless the operation/state model changes**.

**Architectural evidence:** escrow is not a magic infrastructure toggle. It works by changing the available local rights/state so operations become independently invariant-preserving. SB should reason about the invariant and operation semantics, not about `offline=true` as a guarantee.

### E4 — Bailis et al., *Highly Available Transactions: Virtues and Limitations* (PVLDB 2014)
Sources:
- https://amplab.cs.berkeley.edu/publication/highly-available-transactions-virtues-and-limitations/
- https://arxiv.org/abs/1302.0309

The HAT analysis demonstrates that some transactional guarantees cannot coexist with always-available partitioned execution; highly available systems necessarily give up classes of coordination-dependent semantics.

**Architectural evidence:** when a required invariant cannot be transformed into a locally safe form, disconnection must reduce availability or semantic guarantees. SB must fail/degrade explicitly rather than pretend offline equivalence.

### E5 — Gray & Cheriton, *Leases: An Efficient Fault-Tolerant Mechanism for Distributed File Cache Consistency* (SOSP 1989)
Source: https://www.cs.cmu.edu/afs/cs.cmu.edu/academic/class/15712-s12/www/papers/gray89.pdf
DOI: https://doi.org/10.1145/74850.74870

Leases grant rights for a bounded time and tolerate message loss/partition under stated non-Byzantine and clock assumptions. Expiry bounds how long the grant can obstruct or authorize behavior.

**Architectural evidence:** time-bounded grants can reduce coordination but introduce clock/trust/expiry assumptions. A lease is not equivalent to permanent delegated authority and cannot be made provider-neutral by copying a provider's lease object.

### E6 — Birgisson et al., *Macaroons: Cookies with Contextual Caveats for Decentralized Authorization in the Cloud* (NDSS 2014)
Source: https://www.ndss-symposium.org/ndss2014/ndss-2014-programme/macaroons-cookies-contextual-caveats-decentralized-authorization-cloud/

Macaroons demonstrate attenuable decentralized credentials: delegated authority can be restricted by additional caveats rather than expanded by the delegate.

**Architectural evidence:** local/offline actuation can carry a cryptographically verifiable, attenuated authorization envelope. This supports non-amplification, but it does **not** itself enforce a quantitative resource invariant or solve fresh revocation.

### E7 — OAuth 2.0 Token Introspection, RFC 7662 (IETF, 2015)
Source: https://www.rfc-editor.org/info/rfc7662/

RFC 7662 defines online introspection of whether a token is currently active, including expiry/revocation checks. It explicitly notes the security/performance trade-off when introspection responses are cached: longer caching creates a window in which revoked authority may still be accepted.

**Architectural evidence:** a disconnected verifier cannot simultaneously guarantee immediate centrally driven revocation and remain fully autonomous using cached authorization state. Offline profiles must expose a maximum authority-staleness/revocation window or deny operations requiring fresher authority.

### E8 — OAuth 2.0 Token Exchange, RFC 8693, and Rich Authorization Requests, RFC 9396
Sources:
- https://www.rfc-editor.org/rfc/rfc8693.html
- https://www.rfc-editor.org/rfc/rfc9396.html

RFC 8693 distinguishes delegation from impersonation and allows scope/time restrictions. RFC 9396 demonstrates fine-grained authorization requirements for specific actions/resources/amounts rather than only coarse scopes.

**Architectural evidence:** semantic authorization and delegation can be constrained by subject/action/resource/time/detail. However, OAuth tokens remain authorization artifacts; they do not automatically represent conserved stock/quota rights. SB must not collapse `may perform operation` and `owns N units of globally conserved capacity` into one undifferentiated token concept.

## Competing models

### Model A — Central coordination for every non-confluent operation

Every bounded-resource mutation requires synchronous contact with the authoritative coordinator.

**Strengths:** simplest correctness/revocation model; globally fresh policy/resource state can be checked before each mutation.

**Weaknesses:** destroys offline/partition availability and can impose unnecessary latency for workloads that are safely partitionable.

**Disposition:** KEEP as the mandatory fallback/profile when the invariant cannot be safely delegated or fresh authority is required; DO_NOT universalize as the only architecture.

### Model B — Cache global balance + cached authorization, reconcile later

A Station remembers the last global resource value and last allow decision, performs mutations while offline, then reconciles.

**Strengths:** trivial implementation and maximal offline availability.

**Failure:** two Stations can each consume the same apparent remaining capacity. Revoked authority may continue indefinitely. Reconciliation detects violation after the fact but cannot reliably undo irreversible external/business effects.

**Disposition:** DO_NOT_BUILD for invariants requiring prevention. Allow only where the operation set is proven invariant-confluent or explicit degraded semantics accept later conflict.

### Model C — Bounded invariant rights + independently attenuated authority

Before disconnection, a coordinator/governed process allocates a conserved slice of the bounded resource to a Station and separately delegates only the semantic authority needed to consume it. Offline operation is admitted only when both remain valid.

Conceptually:

```text
EffectiveOfflineActuation
  = OperationAuthority
    ∩ Station/tenant scope
    ∩ Local policy/profile
    ∩ ResourceRight/Budget
    ∩ Validity/Freshness/Trust closure
    ∩ Operation preconditions/invariant profile
```

The Station can consume at most its allocated rights. Unused rights may later be returned/transferred/rebalanced through explicit lineage. Reconnection merges evidence and conserved-right state.

**Strengths:** preserves selected bounded invariants under partition; authority remains non-amplifying; provider implementation can vary.

**Weaknesses:** stranded rights reduce availability elsewhere; rights transfer/rebalancing becomes its own correctness boundary; revocation remains bounded by expiry/freshness unless online invalidation is available; not every invariant decomposes this way.

**Disposition:** strongest model for selected offline bounded-resource cases. KEEP/GENERALIZE as research recommendation, with primitive naming deferred.

### Model D — One bearer capability token encodes both authority and budget

A signed token says the Station can perform the operation and consume N units; possession is sufficient.

**Strength:** compact transport and easy local verification.

**Failure:** conflates semantic authorization, quantitative invariant rights, identity, freshness and provider/wire representation. Cloning/replay, transfer, revocation and partial consumption become difficult to reason about. A token format can realize the model but should not define it.

**Disposition:** PROVIDERIZE token representation; DO_NOT_BUILD token possession as canonical semantic ownership.

## Strongest conclusion

**Selected non-confluent bounded-resource operations can remain safely available while disconnected only when the operation is transformed into a locally invariant-preserving one by pre-allocating a conserved slice of the resource/invariant — and this resource right remains separate from delegated semantic authority.**

The key architecture is therefore not “offline authorization”. It is the intersection of two independent dimensions:

1. **May this actor/Station perform this semantic operation?** — authorization/delegation.
2. **Does this Station possess enough conserved right to perform this mutation without violating the invariant?** — escrow/budget/right allocation.

Possessing one does not imply the other.

Candidate rule:

> **Authority without resource rights cannot consume the bounded resource; resource rights without current operation authority cannot authorize actuation.**

This generalizes cleanly into the longitudinal process model: an offline saga gate may advance only when its local closure proves both the required semantic authority and the invariant-preserving resource right/postcondition evidence.

## What pre-allocation can and cannot solve

### Strong fit

Preallocation is a strong fit for invariants that are decomposable into conserved rights, including many forms of:

- non-negative inventory/stock decrement;
- quotas and usage budgets;
- limited seats/capacity;
- bounded spending envelopes;
- permits/tickets/credits where units can be partitioned;
- rate/capacity envelopes when time semantics are explicit.

### Conditional fit through namespace/ownership partitioning

Some uniqueness/exclusivity problems can become locally safe if the namespace itself is partitioned, for example allocating distinct ID/name ranges or exclusive ownership domains to Stations.

This is a semantic redesign, not proof that arbitrary uniqueness is coordination-free.

### Weak/no fit without semantic redesign

Preallocation does not generically solve:

- globally ordered sequence decisions;
- uniqueness over an unpartitioned namespace;
- mutual exclusion where the exclusive owner cannot be safely predetermined;
- decisions requiring immediate centrally fresh revocation or policy state;
- arbitrary cross-resource invariants whose safe rights decomposition is unknown;
- external effects whose outcome is ambiguous after network loss.

These cases must coordinate, deny/degrade while disconnected, or adopt a separately justified domain transformation.

## Revocation and freshness are a fundamental boundary

Offline autonomy and instantaneous central revocation cannot both be guaranteed for locally verifiable grants during a partition.

A safe SB profile must therefore make the choice explicit:

- **fresh-authority-required:** operation is unavailable offline;
- **bounded-staleness authority:** locally valid grant may be used until explicit expiry/epoch/freshness bound;
- **pre-revocable local mechanism:** only if the Station has a local authoritative revocation source whose own freshness/partition behavior is qualified.

A signed credential or cached introspection result must never be described simply as “current authority” without naming its policy/authority revision, issue time, validity window and revocation/freshness assumptions.

High-risk operations may legitimately choose availability loss over stale authority.

## Lease versus escrow/right semantics

A lease and a conserved resource right solve different problems and may compose:

- **lease:** time-bounded control/authority relative to a resource or generation; correctness depends on expiry/clock/fencing assumptions;
- **escrow/right/budget:** a conserved quantity or partition of admissible mutations;
- **authorization grant:** who may perform which semantic operation under which scope/conditions.

A Station might require all three. None should automatically be inferred from another.

Example:

```text
Station S
  authority: Inventory.Reserve for tenant A
  resource right: consume <= 20 units from partition P
  validity: policy epoch 41; expires T
  fencing/generation: grant generation 7
```

The exact object/field vocabulary remains for synthesis.

## Rights lifecycle and conservation

The portable semantics should be able to describe, without binding to a database/CRDT/token implementation:

```text
allocate → activate → consume → transfer/rebalance → return/reclaim → expire/revoke → reconcile → close
```

Material invariants:

- issued/allocated rights cannot exceed the authoritative safe budget;
- a right cannot be concurrently spendable by two Stations after transfer/copy;
- consumption survives crash/restart and cannot reset from a stale snapshot;
- transfer requires generation/ownership evidence so old holders cannot continue spending transferred rights;
- expired/revoked rights do not silently reappear after restore;
- reconciliation preserves consumed history and reports missing/ambiguous evidence as `PARTIAL/INCONCLUSIVE`;
- unused stranded rights affect availability/capacity utilization, not invariant correctness.

This suggests rights lifecycle needs revision/generation/ownership lineage similar to other Generation 2 governed transitions.

## Station cloning, splitting and derived profiles consequence

The existing Station hypotheses explicitly warn that copying/splitting a Station must not duplicate credentials or authority. This deep research strengthens that rule for resource rights:

> **Copying or splitting Station configuration must never duplicate a consumable invariant right/budget.**

A cloned profile may describe that a Station *can be eligible* for offline inventory allocation; the actual active grant is separately issued, scoped and evidenced.

A malicious or accidental restore from an old snapshot must not allow the same rights generation to be spent twice. Concrete realizations may use fencing tokens, monotonic generations, trusted counters, server reconciliation or other mechanisms; the portable requirement is single-effective ownership/consumption lineage.

## Cumulative context and longitudinal gate consequence

Offline operation outcome evidence should enter cumulative process context as a qualified fact, not as a boolean success:

```text
OfflineOperationOutcome {
  operation identity/revision
  Station/tenant/subject scope
  authority grant revision/expiry
  resource-right grant identity/generation
  amount/right consumed
  local attempt/effect/postcondition
  provider realization evidence
  local trust/freshness profile
  reconciliation state
}
```

Exact shape is not proposed as final IR.

A longitudinal gate may accept the outcome immediately only when its declared profile permits locally qualified evidence. If the process requires central reconciliation/fresh authority before the next saga stage, the gate remains blocked/pending even though the local business mutation was admissible.

Thus offline capability execution and saga progress are related but not identical.

## Provider-specific versus portable semantics

### Portable candidates

- invariant identity/revision and operation set;
- semantic authorization requirement separate from resource-right ownership;
- bounded/conserved resource-right grant identity, scope, amount/range and generation;
- validity/freshness/expiry policy;
- expected owner/Station/tenant scope;
- consumption and transfer lineage;
- reconciliation/postcondition evidence;
- offline admission profile and explicit unsupported/degraded state;
- single-effective ownership/conservation obligation;
- gate evidence threshold.

### Provider/runtime realization

- SQL escrow rows/locks/transactions;
- bounded-counter CRDT state and merge protocol;
- lease service implementation;
- HSM/TPM/secure-enclave counters;
- signed macaroon/JWT/capability token format;
- OAuth/STSes and provider-specific revocation/introspection;
- concrete fencing token encoding;
- storage/event-log implementation for consumption evidence.

### Do not universalize

- one database's escrow table schema;
- CRDT rights matrix as the universal object model;
- Kubernetes `Lease`, cloud STS credential or OAuth token as canonical Station authority;
- physical-clock lease duration as the only freshness mechanism;
- token possession as proof of both semantic authority and invariant rights;
- `offline=true` as a guarantee independent of invariant/profile.

## Contradictions resolved

### “Non-confluent means offline impossible” — narrowed

The prior transaction research correctly states that non-confluent operations require coordination **for the original state/operation model**. Escrow/bounded rights show that some business invariants can be reformulated so each Station operates only over a safe local rights partition. Coordination moves to allocation/transfer/rebalancing boundaries rather than every mutation.

### “Delegated authority is enough for offline action” — falsified for bounded resources

Authorization answers whether an actor may act; it does not prove enough globally conserved capacity remains. A permitted actor can still overspend stale stock/quota without a resource-right mechanism.

### “Escrow right is authority” — falsified

A resource right protects a quantitative invariant but does not answer whether the current person/role/Station is authorized for the semantic action. Non-amplifying authority remains independently required.

### “Reconnect/reconcile can repair everything” — falsified

Reconciliation can merge evidence, return/rebalance rights and detect conflicts. It cannot guarantee semantic repair for an irreversible effect performed beyond valid rights/authority. Prevention remains mandatory where the invariant requires it.

## Failure / adversarial analysis

- **Double allocation:** coordinator allocates overlapping rights to two Stations; invariant can fail despite locally correct clients.
- **Snapshot rollback:** Station restores a checkpoint from before consumption and reuses already-spent rights.
- **Clone attack:** copied Station identity/grant is active in two places and both spend the same budget.
- **Transfer race:** rights are transferred to Station B while Station A continues on stale ownership evidence.
- **Clock failure:** expired lease/grant is accepted because local time is stale or manipulated.
- **Revocation during partition:** central authority revokes the actor/Station, but disconnected Station cannot learn the revocation before expiry.
- **Stranded capacity:** disconnected Station owns unused rights while connected Stations exhaust theirs; correctness holds but availability/utilization degrades.
- **Provider downgrade:** replacement provider cannot prove durable consumption/generation semantics yet binding is accepted anyway.
- **Rights without authorization:** attacker obtains/recovers budget state but lacks current operation authority.
- **Authorization without rights:** valid user repeatedly acts against cached global balance after local allocation is exhausted.
- **Ambiguous external effect:** an operation is locally authorized and within budget but external provider outcome is unknown; escrow does not solve effect reconciliation.
- **AGWS/AI amplification:** UI/agent attempts to mint, enlarge, transfer or reset offline budget without the required allocation/authority facet.

## Consequences for existing findings/candidates/hypotheses

1. **Transaction / Consistency / Concurrency — KEEP / GENERALIZE:** invariant-scoped coordination remains correct, but add explicit semantic redesign by partitioned rights/escrow as a way to move coordination from each operation to rights-allocation boundaries.
2. **Tenant Fleet / Edge — KEEP / GENERALIZE:** offline/edge autonomy should be profile-qualified by invariant closure, not merely by local runtime/provider reachability.
3. **AGWS / Station authority — HARDEN:** effective offline actuation is an intersection of Station/Role/Person authority and invariant rights; neither dimension may amplify the other.
4. **Station copy/split/derive — HARDEN:** structural cloning must not clone active consumable rights, generations, credentials or authority.
5. **Workflow longitudinal gates — SPECIALIZE:** a gate may admit locally effective evidence only when its policy/invariant/authority freshness profile allows it; some stages require post-reconnect reconciliation before progress.
6. **Qualified local closure — GENERALIZE:** local closure for mutating bounded resources must include invariant/right state, consumption lineage, authority/trust freshness material and reconciliation rules, not only executable bytes/data.
7. **Provider/Binding — HARDEN:** provider admission must prove required rights durability/fencing/reconciliation semantics; a provider lacking them is incompatible/partial rather than silently weaker.
8. **Candidate primitive — DEFER exact shape:** research supports a cross-cutting concept analogous to a **Qualified Offline Actuation Grant/Envelope** composed from authority + resource rights + validity/trust + evidence obligations. Do not promote a universal object/class until synthesis proves reuse beyond numeric/bounded-resource cases.

## Proof obligations

### DR-OSEA-01 — Two disconnected Stations preserve one global bound
Allocate disjoint rights from a global quantity to Stations A and B, disconnect both, consume concurrently to each local maximum, then reconcile. The global invariant must hold and total consumption must not exceed allocated supply.

### DR-OSEA-02 — Authority without rights is denied
Give a person valid `Inventory.Reserve` authority but exhaust the Station's offline stock rights. Further reservation must fail/degrade even though authorization remains valid.

### DR-OSEA-03 — Rights without semantic authority are denied
Give a Station unused offline rights but revoke/remove the person's operation authority before disconnection or in the locally authoritative profile. Possession of rights cannot create permission.

### DR-OSEA-04 — Bounded revocation window is explicit
Issue an offline grant with a declared validity/freshness bound, disconnect, revoke centrally, and test before/after local expiry. Evidence must expose the accepted stale-authority window; operations requiring immediate revocation must have been classified unavailable offline.

### DR-OSEA-05 — Snapshot rollback cannot double-spend
Consume part of a right allocation, crash, restore an older local checkpoint and attempt reuse. Durable generation/consumption evidence must prevent previously consumed capacity from becoming spendable again or must force `INCONCLUSIVE`/quarantine.

### DR-OSEA-06 — Station clone/split cannot duplicate rights
Clone/split a Station profile while an active offline budget exists. The new Station must not receive a second spendable copy of that grant without an explicit rights transfer/allocation transition.

### DR-OSEA-07 — Rights transfer is fenced
Transfer unused rights A→B, then allow stale A to attempt consumption under the previous generation. Exactly one effective owner/generation may consume transferred rights.

### DR-OSEA-08 — Stranded rights affect availability, not correctness
Partition Station A while it holds unused rights and exhaust Station B's allocation. B may become unavailable for additional consumption even though global unused capacity exists; the invariant must remain intact and the condition must be observable rather than bypassed.

### DR-OSEA-09 — Non-decomposable invariant refuses fake offline support
Model a global uniqueness/exclusivity requirement without a safe namespace/ownership partition. Provider admission must reject full offline semantics or require explicit redesign; stale-cache reconciliation must not be presented as equivalent correctness.

### DR-OSEA-10 — Provider substitution preserves right semantics
Realize the same bounded invariant with two materially different mechanisms (for example transactional escrow and bounded-counter/replicated rights). Operation/invariant/right identities remain portable; realization evidence changes and conformance is re-proven.

### DR-OSEA-11 — Offline saga gate uses qualified threshold
Perform a locally admissible bounded-resource operation while disconnected. One workflow profile may advance on locally qualified effect evidence; another requiring central reconciliation must remain pending. Engine/task completion alone cannot decide the gate.

### DR-OSEA-12 — AGWS/AI cannot mint or enlarge budget
From a Person/Role surface or agent, request an increase/reset/transfer of offline rights without the allocation authority facet. AI may propose/escalate; active conserved rights remain unchanged.

### DR-OSEA-13 — Clock/trust failure is bounded
For a time-limited grant/lease, inject clock rollback/skew or invalidate the signing/trust epoch. The Station must fail closed/degrade/return `INCONCLUSIVE` according to profile rather than extending authority implicitly.

### DR-OSEA-14 — External-effect ambiguity remains separate
Consume a valid local right and invoke an external provider; lose acknowledgement after possible effect. The system must still enter the transaction deep-research `OUTCOME_UNKNOWN`/reconciliation path. Resource escrow cannot be used as proof that the external effect occurred exactly once.

## Falsification paths

The main recommendation should be rejected or narrowed if later evidence proves any of the following:

- a materially broader class of non-confluent invariants can be made safely offline without conserved rights, coordination or domain partitioning;
- the proposed separation between authorization and resource rights cannot be maintained across representative real systems without semantic duplication;
- offline rights cannot be made crash/clone/transfer safe without so much centralized coordination that the model loses practical availability value;
- Station semantics do not survive synthesis and the same requirements are fully owned by another universal runtime/tenant primitive;
- provider conformance cannot express the needed conservation/fencing/reconciliation guarantees portably enough to avoid provider-specific workflow semantics.

## Unresolved questions

1. What is the smallest universal vocabulary for `right/budget/reservation/lease`, if any, versus domain-specific invariant contracts?
2. Should a right be represented as a first-class semantic resource, an operation precondition/evidence object, or a specialization of entitlement/quota?
3. How should Commercial Metering / Entitlements / Rating distinguish **commercial entitlement**, **authorization**, **operational quota** and **consistency-preserving escrow right** when negative-space research reaches that area?
4. What secure local primitives are required to resist snapshot rollback/cloned Station identities in threat models stronger than non-Byzantine crash recovery?
5. Which operations may accept bounded stale authority, and which categories require online freshness by constitutional policy?
6. How are nested rights handled when a Station delegates further to Role/Person/child Station without increasing the conserved total?
7. Can rights be represented generically enough for money, inventory, quotas and capacity without inventing a false universal domain model?
8. How should stranded capacity/rebalancing policy interact with SLOs and fleet placement?
9. What evidence is sufficient to reclaim rights from a presumed-dead/offline Station without risking split-brain double ownership?
10. How should a longitudinal saga expose “locally effective but globally unreconciled” versus “globally reconciled” outcomes to downstream stages?

## Confidence

**High** for the negative conclusions:

- stale cached global balance/authorization is insufficient for bounded invariants;
- authorization and conserved resource rights are distinct;
- immediate central revocation is incompatible with unrestricted partitioned offline use unless a local authoritative revocation mechanism exists;
- not every invariant is safely decomposable;
- provider tokens/leases/CRDT objects must not become canonical SB semantics.

**Medium-high** for the positive recommendation that preallocated rights/escrow should be a first-class architectural pattern/profile for selected offline Station operations. The underlying literature is strong, but the exact reusable SB primitive and secure crash/clone/reclaim model remain synthesis/security questions.

## Proposed research dispositions

- **KEEP / GENERALIZE** invariant-scoped coordination semantics.
- **GENERALIZE** partitioned/escrow rights as an admitted semantic transformation for selected bounded invariants.
- **KEEP / HARDEN** `Enterprise → Station → Role → Person` non-amplification independently of resource-right ownership.
- **SPECIALIZE** offline saga-gate admission by authority/right/freshness/evidence profile.
- **PROVIDERIZE** escrow storage, bounded-counter CRDT, leases, fencing implementation and credential/token wire formats.
- **DEFER** exact universal `OfflineActuationGrant` / `ResourceRight` object model until Capability Synthesis and Commercial Entitlements negative-space reconciliation.
- **DO_NOT_BUILD** cached global balance + cached allow as a correctness mechanism for non-confluent bounded-resource mutation.
- **DO_NOT_BUILD** instantaneous-revocation claims for disconnected locally verified grants without an explicit local revocation authority/freshness mechanism.
- **DO_NOT_BUILD** Station copy/snapshot restore that duplicates consumable rights or effective authority.

## Next high-value question recommendation

**State/authority reclaim after presumed Station death:** when a Station holding exclusive/bounded rights or leases is unreachable, what portable fencing/epoch/failure-detector evidence is sufficient to reclaim or reassign its rights without creating split-brain double ownership? This directly intersects Security/Resilience, Lifecycle/Migration, Tenant Fleet/Edge, Secrets/Trust and the offline proof obligations above, and determines whether the positive escrow recommendation is operationally complete rather than only safe during clean partitions.