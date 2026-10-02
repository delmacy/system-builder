# G4 — Heterogeneous Cross-Provider Effect Composition Research

Status: `RESEARCH_ACTIVE / NON_EXECUTABLE`
Execution authority: NONE
Date: 2026-09-18
Parent family: Shared Semantic Kernel / Capability Exchange Plane / Inter-Capability Boundary Model

## Purpose

Deepen the eighth G4 family where one business intent spans effect domains with unequal semantic strength—for example, a target with conditional atomicity followed by a provider that offers only idempotency, asynchronous acknowledgement or compensation. The question is not how to manufacture a global transaction, but which composition contracts can preserve a declared invariant and when the correct result is `NOT_QUALIFIED`.

This is a material subfront, not a ninth macro-family. It selects no workflow engine, transaction coordinator, provider, broker or saga implementation and grants no implementation authority.

Core rules:

```text
Strong A + weak B != strong A+B
Local atomic admission != global atomic outcome
Reservation acquired != downstream effect committed
Compensation available != hard invariant preserved
Pivot chosen != prior uncertainty resolved
Forward recovery != original intent fully satisfied
Exchange Plane coordinates evidence; capability owns business recovery semantics
```

## Evidence classes reviewed

- Azure Architecture Center Saga pattern: a saga decomposes work into local transactions; pivot transactions mark a point of no return, and later retryable transactions are expected to drive the process toward a consistent terminal state.
- Azure Compensating Transaction pattern: compensation is application-specific, may not execute in exact reverse order, can itself fail, must account for concurrent work and may require human intervention. This directly constrains any claim that compensation restores atomicity.
- AWS Prescriptive Guidance Saga patterns: continuation and compensation are distinct recovery principles; saga complexity increases with the number of participating services.
- Google Cloud Workflows guidance: retries and saga-style compensation are mechanisms for workflows spanning multiple services; they do not turn independent services into one ACID domain.
- Prior G4 non-fenceable-effects research: target-local CAS, one-shot tokens, provider reservations and idempotency qualify only the effect boundary they actually enforce.

## 1. Composition strength is bounded by the weakest material effect domain

For a business intent touching domains `A..N`, each domain has its own admission, effect, evidence, retry, ordering and recovery profile. A strong primitive in one domain cannot be inherited by another.

```text
A: conditional atomic mutation
B: idempotent API with finite dedup horizon
C: irreversible physical/human effect

A strong
+ B retry-safe for a window
+ C observationally weak
!= atomic(A,B,C)
```

Candidate rule:

`End-to-end guarantee <= guarantees actually composed across every material effect domain and transition.`

This does not mean every composition collapses to the weakest single primitive. Ordering, reservation and recovery can produce a useful higher-level contract, but only if the business invariant tolerates the intermediate states that remain possible.

## 2. Separate admission safety from outcome atomicity

A strong first domain can be valuable as an authoritative admission gate:

```text
A atomically admits intent I
  -> durable business occurrence / reservation
  -> B attempted
  -> C attempted
```

This can prove `at most one admitted occurrence I` while still failing to prove `all downstream effects happen exactly once`.

Therefore:

```text
Admission unique != downstream effect unique
Admission committed != workflow completed
Admission rejected != no downstream effect unless causally impossible by contract
```

The composition profile must name which invariant terminates at admission and which invariants depend on later effect domains.

## 3. Ordering should minimize irreversible uncertainty, not imitate 2PC

A useful implementation-independent question is which effect should occur first. Candidate ordering heuristics:

1. establish reversible/exclusive reservations before irreversible effects when target contracts support them;
2. perform validation and authority/currentness checks before committing scarce/irreversible resources;
3. delay the pivot/irreversible effect until prerequisite reservations are proven effective;
4. after a pivot, prefer forward recovery for required downstream work rather than pretending rollback remains available;
5. never treat provider ACK as effect evidence unless the provider contract says so.

Ordering is not universal. Holding reservations longer can reduce availability and increase cost; placing an irreversible effect early can simplify later retries but increase compensation exposure.

## 4. Pivot is a semantic boundary, not merely a workflow step

Azure's saga guidance makes the pivot useful as the point after which backward recovery no longer represents the process adequately. For G4, a pivot must be qualified against the actual effect domains.

Candidate `CompositionPivot` evidence:

```text
pivotEffectRef
preconditions/reservations proven before pivot
irreversibility/compensability classification
required post-pivot obligations
forward-recovery contract
UNKNOWN handling
manual-settlement route
```

```text
Pivot ACK != pivot effect proven
Pivot effect proven != post-pivot obligations complete
Compensable before pivot != safe to compensate after unrelated concurrent effects
```

## 5. Hard invariants require stronger rejection criteria

A composition is `NOT_QUALIFIED` for a hard invariant when a permitted partial history can violate the invariant before any compensation/reconciliation can repair it.

Example:

```text
Invariant: customer must never be charged twice.
A prevents duplicate local order admission.
B payment provider can duplicate after dedup horizon.
Refund is available.
```

Refund improves recoverability but does not preserve the never-double-charge invariant. The composition needs a stronger payment-side exclusion/idempotency horizon, a target reservation/token contract, reduced retry/reallocation freedom, or a weaker business invariant.

Candidate rule:

`If violation itself is forbidden, eventual compensation cannot be the safety proof.`

## 6. Recovery matrix for heterogeneous domains

A multi-domain occurrence should classify each effect independently rather than use one global success boolean.

| A | B | C | Composition disposition candidate |
|---|---|---|---|
| EFFECTIVE | EFFECTIVE | EFFECTIVE | settled, subject to business verification |
| EFFECTIVE | REJECTED | NOT_ATTEMPTED | compensate A or forward-recover B depending on pivot/profile |
| EFFECTIVE | UNKNOWN | NOT_ATTEMPTED | quarantine/reconcile B; do not blindly repeat irreversible B |
| EFFECTIVE | EFFECTIVE | UNKNOWN | post-pivot UNKNOWN; reconcile/forward/manual according to C |
| COMPENSATED | EFFECTIVE | — | not automatically rolled back; business conflict/recovery required |
| UNKNOWN | EFFECTIVE | — | reconstruct causal/effect evidence before retrying A |

`One domain compensated != occurrence globally compensated`.

## 7. Forward recovery is first-class after irreversible commitment

After a pivot, the safest semantics may be to finish required downstream obligations rather than undo earlier effects. AWS saga guidance distinguishes continuation from compensation; Azure classifies retryable post-pivot transactions as the path toward eventual consistency.

Candidate rule:

```text
pre-pivot failure -> compensation MAY be eligible
post-pivot failure -> forward recovery SHOULD be considered first
```

This is not a universal mandate. Capability-owned business semantics decide whether forward completion, compensation, alternative fulfillment or manual settlement is valid.

## 8. Reservations across providers do not compose automatically

Two providers can each offer exclusive reservations while the pair still lacks atomic acquisition.

```text
reserve A -> success
reserve B -> timeout/UNKNOWN
```

The system now owns a partial reservation state. Safe handling requires explicit release/expiry/reconciliation semantics. Acquiring B first merely moves the asymmetry.

Possible composition strategies:

```text
ORDERED_RESERVATION_WITH_RELEASE
PARALLEL_RESERVATION_WITH_PARTIAL_RECONCILIATION
SINGLE_AUTHORITATIVE_ADMISSION_THEN_TARGET_RESERVATIONS
PIVOT_AFTER_ALL_REQUIRED_RESERVATIONS
NO_OFFLINE_COMPOSITION
```

None is a default or a global transaction substitute.

## 9. Cross-provider UNKNOWN must remain factored

`UNKNOWN` is domain-specific evidence state:

```text
A admission = EFFECTIVE
B payment = UNKNOWN
C fulfillment = NOT_ATTEMPTED
```

Flattening this to `FAILED` risks duplicate B; flattening it to `SUCCESS` fabricates C. The Exchange Plane may preserve and route these dispositions, but capability-owned policy decides whether to wait, query, retry, compensate, substitute provider or escalate.

## 10. Provider substitution during partial execution is a contract migration

Failing over from B1 to B2 while B1 is `UNKNOWN` can create duplicate effects even when B2 is individually safe.

```text
B1 UNKNOWN
-> bind B2
-> execute same intent
```

Before substitution, prove one of:

- B1 effect is absent;
- duplicate cross-provider effect is harmless under the invariant;
- a shared authoritative reservation/token excludes duplicate effect across both providers;
- business semantics explicitly accept dual-attempt/compensation risk.

Therefore:

`Provider failover != retry by another endpoint`.

## 11. Exchange Plane boundary

The logical Exchange Plane may carry:

```text
occurrenceRef
per-domain effect disposition
reservationRefs
provider operationRefs
pivot/causal evidence
authority/currentness/contract revisions
retry/idempotency horizons
compensation/forward-recovery refs
UNKNOWN/conflict evidence
```

It may route recovery and preserve evidence. It must not decide that a refund is equivalent to no charge, that alternate fulfillment is business-equivalent, or that a provider failover is semantically safe. Those are capability-owned business decisions.

## 12. Candidate `EffectCompositionProfile`

```text
compositionId
businessInvariantRefs[]
participatingEffectDomains[]
admissionDomainRef
orderedPrerequisites[]
reservationRequirements[]
pivotRef / irreversibility frontier
per-domain RequiredContractProfile
partial-state vocabulary
UNKNOWN policy
retry/idempotency horizons
compensation contracts
forward-recovery contracts
provider-substitution rules
settlement predicate
evidence requirements
```

This is research vocabulary, not a product schema.

## 13. Mandatory adversarial fixtures

1. A commits unique admission; B effect succeeds but response is lost; retry after B's dedup horizon duplicates effect.
2. A reservation succeeds; B reservation is UNKNOWN; A expires while B later becomes effective.
3. A and B reservations succeed; authority is revoked before irreversible C.
4. Pivot C succeeds; response is lost; workflow incorrectly compensates A/B and then retries C.
5. B1 is UNKNOWN; failover to B2 succeeds; B1 later proves effective.
6. Compensation of A races with unrelated concurrent work that depended on A's original effect.
7. Compensation itself fails after B is effective.
8. All provider ACKs succeed but one ACK means queued/accepted rather than effective.
9. Local admission is serializable but external B/C effects remain partially committed.
10. A provider supports permanent conditional versioning; B only has finite idempotency; composition falsely advertises A's strength globally.
11. Manual settlement is required but automated availability logic releases reservations early.
12. Contract revision changes compensation or forward-recovery semantics while occurrence is in-flight.
13. Provider substitution changes idempotency namespace/horizon.
14. Reservation release is UNKNOWN and allocator immediately reallocates scarce capacity.
15. Parallel effects commute in final storage state but emit externally observable notifications in different orders.
16. Builder/control services are unavailable; autonomous runtime continues only if all required prequalified local/external rights remain valid.

## 14. Proof obligations

Before implementation planning, prove or explicitly bound:

1. every material effect domain and its semantic owner are named;
2. each domain's admission/effect/ACK/UNKNOWN semantics are qualified independently;
3. end-to-end claims do not inherit the strongest participant guarantee;
4. the protected invariant is checked against every permitted partial history, not only terminal convergence;
5. admission uniqueness is not confused with downstream atomicity;
6. reservation acquisition/release/expiry across providers has explicit partial-state handling;
7. pivot placement is justified by irreversibility/compensability rather than workflow convenience;
8. post-pivot obligations have forward-recovery or manual-settlement semantics;
9. compensation is not used as proof for a never-violate invariant;
10. retries respect each provider's idempotency scope/horizon and do not cross providers silently;
11. provider substitution while prior effect is UNKNOWN is explicitly qualified;
12. per-domain UNKNOWN remains representable until evidence permits settlement;
13. authority/currentness is revalidated at the effect boundary required by the contract;
14. adapters/gateways/drivers cannot promote a weak provider into a stronger global composition guarantee;
15. autonomous runtime behavior during Builder/control-plane outage is bounded to prequalified contracts/reservations/rights;
16. if no composition preserves a hard invariant, the profile is rejected or the business invariant/process is redesigned rather than hidden behind compensation.

## 15. Portability / exit path

Portable artifacts should include the business invariant, domain identities, admission/pivot/recovery ordering, required contract profiles, reservation semantics, idempotency horizons, partial/UNKNOWN vocabulary, compensation/forward-recovery contracts, provider-substitution rules and adversarial fixtures. Provider-specific operation IDs, reservation IDs, idempotency keys and workflow-engine state remain binding evidence rather than canonical business truth.

Changing a provider requires requalification of the affected domain and any composition proof depending on its guarantee; matching interfaces are insufficient.

## 16. Trade-offs

| Strategy | Safety potential | Availability | Recovery complexity | Main risk |
|---|---|---|---|---|
| strong online atomic domain | high inside domain | lower under outage | low-medium | boundary does not include external effects |
| reserve-all-before-pivot | high when reservations are real/exclusive | medium | medium-high | partial reservation/expiry |
| ordered saga + compensation | business-dependent | high-medium | high | temporary invariant violation |
| post-pivot forward recovery | strong for completion-oriented contracts | medium-high | high | long-lived obligations/UNKNOWN |
| parallel independent effects | high only if proven commutative | high | medium | hidden ordering/external observations |
| manual quarantine/settlement | preserves safety by denying progress | low | operationally high | stranded resources |

No row is a default.

## 17. Research position

Material delta exists. Heterogeneous provider composition must be reasoned about as a set of independently authoritative effect domains joined by an explicit composition contract. A strong participant cannot donate its guarantee to weaker participants. Admission, reservation, pivot, effect, compensation, forward recovery and settlement remain distinct proof positions.

Central rule:

```text
A composition is only as strong as the guarantees proven
for every partial history that the business invariant forbids.
Terminal convergence or successful compensation cannot erase
an intermediate hard-invariant violation.
```

This remains research, not implementation authority.

## 18. Highest-value remaining gaps

1. empirical/property-based composition fixtures for provider substitution during `UNKNOWN`, reservation expiry races and post-pivot recovery;
2. contract evolution while heterogeneous occurrences remain in flight;
3. cost/capacity impact of reserve-all-before-pivot versus compensation-oriented flows;
4. human/physical effect domains where machine-verifiable settlement evidence is intrinsically incomplete;
5. synthesis criteria for declaring family-8 composition semantics mature enough to stop adding new subdocuments and consolidate the vocabulary.