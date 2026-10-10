# G4 — Capability Exchange Non-Fenceable External Effects Research

Status: `RESEARCH_ACTIVE / NON_EXECUTABLE`
Execution authority: NONE
Date: 2026-09-18
Parent family: Shared Semantic Kernel / Capability Exchange Plane / Inter-Capability Boundary Model

## Purpose

Deepen the eighth G4 family after reservation/escrow and hierarchical-rights research by studying final effect domains that cannot reject stale fencing epochs/tokens. Typical examples include third-party SaaS APIs, physical devices, human-mediated actions, legacy systems and APIs that offer only idempotency keys or conditional mutation of a provider-local resource.

The research question is deliberately negative as well as constructive: which weaker mechanisms can preserve a declared hard invariant, and when must G4 explicitly classify offline delegation/reallocation as **not semantically qualified** rather than hide the limitation behind retries, leases, adapters or infrastructure?

This is a material subfront, not a ninth macro-family. It selects no provider, database, lock service, broker, gateway, transaction engine or fencing implementation and grants no implementation authority.

Core rules:

```text
Idempotency != fencing
Conditional write != cross-domain reservation by inheritance
One-shot token != exclusive right unless target atomically consumes it
Provider-local atomicity != cross-capability atomicity
Delayed reuse != proof of stale-holder exclusion
Compensation != invariant preservation before compensation
Manual settlement != hard safety mechanism
Adapter cannot upgrade a weak target into a stronger semantic guarantee by assertion
```

## Evidence classes reviewed

- RFC 9110 conditional request semantics: `If-Match` / `If-None-Match` make an HTTP operation conditional on representation state. This is useful optimistic concurrency at the target resource; it does not establish a business reservation or stale-holder fence for unrelated effect domains.
- Amazon S3 conditional writes: `If-None-Match` can make create-if-absent atomic for an object key and concurrent conditional writers result in one success while later writers fail; `If-Match` protects an expected ETag. This is strong target-local admission evidence, but only for the S3 object/version boundary.
- Google Cloud Storage generation/metageneration preconditions: mutations proceed only when immutable version properties match; `ifGenerationMatch=0` provides create-if-absent behavior. Google explicitly frames preconditions as protection against races and unexpected object versions. Again, the guarantee is scoped to the storage object operation.
- Amazon DynamoDB transaction idempotency: a `ClientRequestToken` makes identical `TransactWriteItems` retries idempotent only within a documented 10-minute window; after the window the same token is treated as a new request. This is direct evidence that idempotency has a retention/horizon contract and cannot be treated as permanent stale-holder exclusion.
- Amazon DynamoDB conditional writes: a condition tied to the value being updated can make an ambiguous retry safe for that item transition. This demonstrates target-state preconditions as a stronger mechanism than blind retry, while remaining scoped to the DynamoDB mutation.
- Azure Architecture Center API guidance: idempotency is a retry-safety property; asynchronous request/reply guidance uses idempotency keys to avoid duplicate work-item creation after a lost response. This reinforces that idempotency protects repeated invocation identity, not exclusive ownership of a transferable reservation.
- Prior G4 reservation/hierarchical-rights research: hard fencing requires the final protected effect boundary to reject stale holders; allocator sophistication alone cannot manufacture this property.

## 1. Start from the protected invariant, not the mechanism name

A non-fenceable provider must be qualified against the actual invariant and effect domain.

Candidate questions:

```text
What invariant must never be violated?
What concrete effect consumes/changes the protected resource?
Can the final target atomically test a precondition and apply the effect?
Can a stale holder present something the target can reject?
Can duplicate invocation be made observationally harmless?
Can a right be reused/reallocated while an old holder may still act?
Is the effect reversible, compensable, or irreversible?
What evidence survives timeout/partition/provider unavailability?
```

The answer is not derived from whether the API is HTTP, RPC, asynchronous or local.

## 2. Target-side conditional admission can approximate fencing only for a scoped target state

S3 `If-None-Match` and Cloud Storage `ifGenerationMatch` show a useful pattern:

```text
caller carries expected target state/version
        |
        v
target atomically checks precondition + mutation
        |
   pass | fail
```

When the hard invariant is exactly expressible as that target precondition, this may provide sufficient stale-operation exclusion for that **specific resource transition**.

Examples of potentially qualifying shapes:

```text
create resource R only if R does not already exist
replace R only if generation == G
consume slot represented by target row only if status == AVAILABLE
```

But:

```text
Target CAS succeeds != remote payment/device/human effect also reserved
ETag changed != business authority revision
Object key uniqueness != global business uniqueness unless the contract defines that object as the authoritative admission boundary
```

A driver may expose the provider precondition mechanism, but semantic qualification must prove that the protected invariant actually terminates at that target boundary.

## 3. One-shot target tokens are strong only when consumption is atomic with the effect

A one-shot token can substitute for a reusable fencing epoch only under a narrower model:

```text
right R issues token T
holder presents T
final effect boundary atomically:
  verifies T is valid for this exact effect/invariant scope
  marks T consumed
  performs or commits the protected effect
replay T -> rejected / returns same settled result without a second effect
```

Candidate rule:

`One-shot token qualifies only when token consumption and protected effect share an atomic/authoritative boundary or an explicitly proven equivalent.`

Unsafe variant:

```text
gateway marks T consumed
        |
        X crash/partition
        |
external provider effect status UNKNOWN
```

The gateway has prevented a retry without proving whether the external effect happened. Conversely, marking T consumed after the provider call allows duplicate effects if the response is lost and the caller retries.

Therefore a token consumed outside the final effect boundary is an idempotency/reconciliation aid, not automatically a hard fence.

## 4. Idempotency keys are retry contracts with scope and horizon

DynamoDB documents a concrete 10-minute idempotency window for transaction client tokens. After that horizon, the same token is a new request. This makes an important general boundary explicit:

```text
Idempotency key accepted != permanent deduplication
Same key != same semantic intent forever
Dedup horizon < stale-holder horizon -> hard exclusion not proven
```

Candidate qualification dimensions:

```text
idempotency scope
semantic request fingerprint
retention/dedup horizon
result replay behavior
parameter mismatch behavior
concurrent duplicate behavior
provider failover/region scope
whether external side effects are inside the dedup boundary
```

For a hard invariant, the dedup horizon must cover every period in which a stale holder/replay can legitimately reappear, or reuse must remain quarantined until stronger evidence exists.

## 5. Reservation-at-target is stronger than allocator-only reservation

If the external provider itself can reserve the scarce business resource and later consume/release that reservation, G4 can reason about the provider reservation as a distinct effect-domain contract:

```text
ALLOCATOR RIGHT
      |
      v
TARGET RESERVATION
      |
      v
TARGET EFFECT
```

But the semantic profile must answer:

```text
Is reservation creation atomic against competing reservations?
Does reservation expiry prevent later stale consumption?
Can reservation IDs be replayed?
Can release race with consume?
Does provider ACK mean reservation effective?
Does provider failover preserve reservation identity/state?
Can authority revocation invalidate consumption?
```

`Reservation-at-target` can remove the need for an SB-generated fencing epoch only when the target contract itself enforces the relevant exclusivity/invariant.

## 6. Delayed reuse is a quarantine policy, not proof

A tempting workaround is to wait longer than an old holder's expected lifetime before reissuing capacity.

```text
old holder lost
wait H
reallocate right
```

This can reduce probability but is a hard-safety proof only if the contract establishes a maximum stale-action horizon and the final effect cannot occur after it.

```text
Clock/lease TTL elapsed != stale external request impossible
Process presumed dead != delayed packet impossible
Provider timeout expired != provider operation cancelled
```

Candidate classification:

- **PROVEN_HORIZON:** target contract provides a bounded validity/expiry that it enforces at effect time;
- **OPERATIONAL_GRACE:** waiting reduces risk but cannot prove exclusion;
- **UNBOUNDED_STALE_RISK:** no safe automatic reuse while prior effect remains possible/UNKNOWN.

Only the first can support a hard invariant without another exclusion mechanism.

## 7. Idempotent effect can make duplicate invocation harmless, but not conflicting ownership harmless

If the protected effect is naturally or provider-enforced idempotent, retries may be safe:

```text
apply desired state S
apply desired state S again
=> same authoritative effect
```

This does **not** solve two generations legitimately asking for different effects:

```text
old holder -> set S_old
new holder -> set S_new
```

Both operations may be individually idempotent while racing indefinitely or leaving the wrong final state.

```text
Idempotent(A) != stale A cannot overwrite newer B
Idempotency != ordering
Idempotency != authority currentness
```

Conditional revision checks or a target-owned reservation/version may still be required.

## 8. Compensation is recovery, not hard-invariant preservation

For effects such as payments, notifications, physical motion or external publication, a compensating action may reduce business harm after a stale/duplicate effect. It does not prove the hard invariant was never violated.

```text
duplicate charge
then refund
```

is not equivalent to:

```text
second charge never occurred
```

Therefore compensation can qualify **recoverability**, not a safety property that forbids the intermediate effect. A contract may legitimately choose this weaker profile, but it must not be labeled as hard exclusion.

## 9. Manual settlement is an honest terminal strategy for irreducible UNKNOWN

Some external domains cannot expose enough evidence to decide automatically whether an effect happened. In those cases, a correct platform may prefer:

```text
UNKNOWN_EXTERNAL_EFFECT
-> quarantine right/reallocation
-> collect evidence
-> manual/business reconciliation
-> settle or compensate
```

This sacrifices liveness/utilization while preserving the declared invariant. Manual settlement is not a failure of architecture when the external effect domain lacks machine-verifiable semantics; fabricated success/reuse would be worse.

## 10. Candidate semantic strength ladder

From strongest stale-holder exclusion to weakest recovery profile:

```text
A. target-enforced fencing/version rejection
B. target-atomic one-shot token + protected effect
C. target-side reservation with exclusive consume semantics
D. target conditional mutation exactly expressing the invariant
E. idempotent same-intent effect + qualified ordering/currentness mechanism
F. finite provider-enforced validity horizon + delayed reuse
G. idempotency key only
H. compensation / forward recovery
I. manual settlement / quarantine
J. no sufficient mechanism -> offline delegation/reallocation NOT QUALIFIED
```

This is not a universal ranking: B-D can be equivalent to A for a narrowly scoped invariant if their proof obligations match the required profile. The ladder exists to prevent a weaker mechanism from being silently advertised as a stronger one.

## 11. Qualification matrix

| Mechanism | Duplicate retry | Stale holder with same intent | Stale holder with conflicting intent | Hard invariant candidate? |
|---|---|---|---|---|
| target fencing/version check | yes, if target rejects stale epoch | yes | yes | yes, within target scope |
| target-atomic one-shot token | yes | yes after consume | yes for same exclusive right | yes, if atomic with effect |
| target reservation | depends on contract | usually | usually within reservation scope | yes, if provider enforces exclusivity |
| conditional write/CAS | yes for qualified transition | yes against changed version | yes if all conflicts map to target version | yes, only for expressible target invariant |
| idempotency key | usually within horizon | same request only | no | not alone |
| delayed reuse | no direct protection | probabilistic unless target-enforced expiry | no | only with proven validity bound |
| compensation | after duplicate | after stale effect | after conflict | no for never-violate invariant |
| manual settlement | prevents unsafe automatic reuse | by quarantine | by quarantine | preserves safety by denying progress, not by executing |

## 12. Explicit rejection criteria

Offline delegation/reallocation should be classified **NOT QUALIFIED** for a hard invariant when all of the following hold:

```text
1. stale holder can still reach the final effect boundary;
2. final boundary cannot reject stale generation/right/revision;
3. duplicate/conflicting effects are not harmless under the invariant;
4. target offers no atomic reservation/one-shot consumption/precondition equivalent;
5. stale-action horizon is not provably bounded by target enforcement;
6. compensation cannot satisfy the invariant because violation itself is forbidden;
7. evidence can remain UNKNOWN after allocator decides to reuse the right.
```

The correct fallback is online admission, non-transferable allocation, single-owner placement, stronger target contract, reduced autonomy, or explicit business redesign. More middleware does not remove the impossibility.

## 13. Exchange Plane / adapter / driver boundary

The Exchange Plane may carry:

```text
rightRef / reservationRef
idempotencyRef
targetRevision / precondition evidence
validity horizon
provider operationRef
UNKNOWN / settlement evidence
```

A driver may normalize a provider's conditional-write, idempotency or reservation API. An adapter may translate a weaker provider contract into a **qualified degradation** when the business contract permits it.

They must not claim:

```text
provider idempotency -> fencing
provider ETag -> business authority
provider timeout -> no effect
provider reservation ACK -> effect complete
local dedup row -> external exactly-once effect
```

`Driver may normalize mechanism but must not fabricate semantic equivalence` remains controlling.

## 14. Mandatory adversarial fixtures

1. Provider accepts effect, response is lost, idempotency key expires, stale holder retries.
2. Old holder and new holder send different idempotent desired states concurrently.
3. One-shot token is consumed in gateway, then provider effect becomes `UNKNOWN`.
4. Provider effect succeeds, gateway crashes before marking token consumed.
5. Conditional target write protects object A while external side effect B duplicates.
6. Reservation expires at provider while delayed request from old holder arrives afterward.
7. Allocator lease expires but provider has no notion of lease/fencing and accepts late request.
8. Delayed reuse horizon is based on local clock while provider accepts request according to different validity rules.
9. Compensation succeeds after hard invariant was temporarily violated; oracle must not label safety preserved.
10. Manual settlement is required while allocator attempts to reclaim capacity for availability.
11. Provider deduplication is regional and failover loses the dedup record.
12. Same idempotency key is reused with changed parameters and provider behavior differs.
13. Target reservation ACK is returned before reservation is durable/effective according to provider contract.
14. Target-side reservation is exclusive, but SB mistakenly treats it as business ownership transfer.
15. Conditional create-if-absent is used as global uniqueness proof even though another effect domain can create the same business identity.
16. Evidence retention expires before stale-holder horizon, making safe automatic reuse unprovable.

## 15. Proof obligations

Before implementation planning, prove or explicitly bound:

1. the hard invariant and final protected effect boundary are named;
2. stale-holder exclusion is enforced at that boundary or the contract explicitly accepts a weaker profile;
3. target-local conditional atomicity is never generalized beyond its resource/effect scope;
4. one-shot token consumption is atomic with the protected effect or ambiguity is represented as `UNKNOWN` without unsafe reuse;
5. idempotency scope, fingerprint, concurrency behavior and retention horizon are explicit;
6. dedup retention covers the maximum stale/replay horizon whenever it is used as a safety argument;
7. target reservation semantics cover creation, consume, release, expiry, failover and ambiguous ACKs;
8. delayed reuse is used for hard safety only when target-enforced maximum validity makes late effect impossible;
9. idempotent same-intent retry is not confused with conflicting-intent ordering/currentness;
10. compensation is never used as proof that a never-violate invariant remained true;
11. irreducible `UNKNOWN` can quarantine rights/capacity instead of forcing a guessed success/failure;
12. adapters/drivers expose provider limitations and cannot promote weaker semantics to stronger guarantees;
13. provider migration/failover requalifies dedup, reservation, precondition and evidence semantics;
14. offline delegation is rejected when no mechanism can preserve the required hard invariant;
15. autonomous runtime operation is bounded by what was actually prequalified for the external target, not by local allocator confidence.

## 16. Portability / exit path

Portable semantic artifacts should include:

```text
invariant + effect-domain identity
required stale-holder exclusion profile
target precondition/reservation/token semantics
idempotency scope + horizon
validity/expiry semantics
UNKNOWN/reconciliation policy
compensation/manual-settlement classification
provider qualification evidence + adversarial fixtures
```

Provider-specific ETags, generation numbers, request tokens, reservation IDs and operation IDs remain binding evidence. A provider change must requalify their semantic strength rather than map field names mechanically.

## 17. Trade-offs

| Strategy | Partition autonomy | Hard-safety potential | Utilization | Operational burden |
|---|---:|---:|---:|---:|
| online target admission | low if target unavailable | high within target contract | high | latency/availability dependency |
| target-atomic one-shot token | high for preissued work | high for exact scoped effect | medium | token lifecycle/stranding |
| target reservation | medium-high | high if exclusivity is provider-enforced | medium-high | reservation lifecycle |
| conditional target mutation | medium-high | high only for expressible target invariant | high | revision/precondition management |
| idempotency only | high | low for conflicting stale holders | high | dedup horizon/reconciliation |
| delayed reuse | high | only with proven target expiry | lower | stranded capacity/time assumptions |
| compensation | high | recovery, not never-violate safety | high | compensation failures/cost |
| quarantine/manual | low | preserves safety by refusing uncertain reuse | low | human workload |

No row is a default.

## 18. Research position after consolidation

Material delta exists. The external-effect problem is no longer summarized merely as “no fencing means weaker semantics.” The research now distinguishes target-local conditional admission, target-atomic one-shot consumption, provider reservation, idempotency horizons, provider-enforced expiry, compensation and manual quarantine, and defines when each can or cannot preserve a hard invariant.

Central rule:

```text
A non-fenceable provider may still satisfy a hard invariant
only when its own target semantics provide an equivalent scoped exclusion proof.
Otherwise the platform must reduce autonomy, quarantine uncertainty,
or reject offline delegation/reallocation for that effect domain.
Middleware cannot manufacture a missing final-boundary guarantee.
```

This remains research, not implementation authority.

## 19. Highest-value remaining gaps

1. **Cross-provider composite effects:** one logical business action spans two targets with different exclusion/idempotency strengths; determine safe admission/recovery without global transaction claims.
2. **Rights/invariant migration:** reparent/split/merge budget trees while external target reservations and `UNKNOWN` effects remain outstanding.
3. **Provider qualification protocol:** turn the strength ladder into provider-neutral contract evidence and same-contract adversarial fixtures.
4. **Operational economics:** quantify safe false denial, quarantine duration, reservation stranding and manual-settlement load.

### Sources

Primary documentation/standards reviewed 2026-09-18:

- IETF, RFC 9110 — HTTP Semantics, conditional requests (`If-Match`, `If-None-Match`).
- Amazon S3 User Guide — conditional writes with `If-None-Match` and `If-Match`.
- Google Cloud Storage — request preconditions using generation/metageneration and create-if-absent generation `0`.
- Amazon DynamoDB Developer Guide / API Reference — transaction `ClientRequestToken` idempotency and 10-minute horizon; conditional write idempotence.
- Microsoft Azure Architecture Center — API idempotency and asynchronous request-reply/idempotency-key guidance.
- Prior G4 effect-composition, reservation/escrow lifecycle, hierarchical-rights, contract-compatibility and verification research.
