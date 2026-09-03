# Generation 2 Deep Research — Temporal Authority & Evidence Semantics 01

Status: COMPLETE — RESEARCH RECOMMENDATION / NOT TARGET-ARCHITECTURE AUTHORITY

## Question

Does Generation 2 need a small, portable **typed temporal-evidence relation** to qualify authority, evidence, revocation, leases, offline Station horizons and historical verification, or should time semantics remain entirely capability-specific?

The question is deliberately narrower than generic time representation. `DR-RRHV-01` established that historical verification must distinguish current trust from historical verification eligibility and left an unresolved gap: a single `revoked_at` cannot distinguish compromise, discovery, publication/effectiveness, occurrence, observation and trusted witnessing. This Deep Research asks whether that distinction is structurally reusable enough to deserve a small UCA-level relation without creating a universal clock, timeline, lease or PKI model.

## Why this is architecturally material

A generic timestamp field silently conflates materially different facts:

```text
act occurred at T1
observer received it at T2
authority became invalid at T3
revocation was processed/published at T4
witness proved the signature existed no later than T5
system evaluated the claim at T6
```

Those times can differ legitimately. Correctness questions often depend on a **relation** between them, not on any one scalar:

- Was an approval produced before the signer became invalid?
- Was a revocation known/effective before an offline Station acted?
- Did a lease definitely expire before a new writer was admitted?
- Does a timestamp prove existence of the payload, the signature, or merely receipt by one observer?
- Was an OCSP response fresh for the validation instant, even though it was signed at another instant?
- Is an event late because it occurred late, arrived late, or was processed late?
- Is a historical claim invalid, valid, or `INCONCLUSIVE` when compromise time is only suspected within an interval?

If G2 stores only `timestamp`, `revoked_at`, `expires_at` or `observed_at`, providers will supply superficially compatible values with incompatible semantics. If G2 instead invents a universal global clock primitive, it risks imposing physical-time assumptions where epochs/fencing/causal ordering are stronger and simpler.

## Corpus of SB input

Mandatory Generation 2 corpus reviewed before external research:

- `RESEARCH_PIPELINE_STATE.json` — `phase=RESEARCH_ELICITATION`; six full cycles complete; cycle 7 has 24/25 breadth capabilities revisited. This Deep Research does not advance breadth rotation, counters or saturation.
- `RESEARCH_EVIDENCE_METHOD.md` — requires triangulation across production systems, standards, literature and engineering evidence; conflicts remain explicit.
- `ARCHITECTURE_PROOF_QUALITY_METHOD.md` — requires authority/security, stale evidence, ordering/replay, version/coexistence, provider substitution, offline closure and objective falsification paths.
- `CAPABILITY_DISCOVERY_REGISTER.md`, `FINDING_INDEX.md`, `REPRESENTATIVE_COVERAGE.md`, `CAPABILITY_PROOF_MATRIX.md` — treated as research hypotheses/inventories rather than final authority.
- `DR-HIC-01` — historical interpretation requires transitive semantic/validation closure.
- `DR-LGCE-01` — long-lived operations require typed revision axes and freshness/requalification.
- `DR-QDCE-01` — qualified derived claims bind subject, evaluator/profile, evidence closure and applicability/freshness.
- `DR-ABRT-01` — authority-bearing claims require externally rooted, scoped and current trust closure.
- `DR-SRFE-01` — failure suspicion is not stale-owner exclusion; safe reclaim can use qualified expiry, generation fencing or hard fencing.
- `DR-RARSOD-01` — recovery/root transition creates authority epochs and requires requalification.
- `DR-RRHV-01` — historical verification eligibility is distinct from current trust admission; exact timestamp scope and compromise uncertainty matter.
- Cycle-7 findings across Lifecycle, Security, AI, Self-hosting and Architecture Reconciliation — evidence freshness/replay horizons, ambiguous outcomes, residual cohorts and offline/reconnect qualification increasingly depend on exact temporal applicability.

The breadth corpus is input only. The external ledger below attempts to falsify a universal temporal relation as well as the opposite hypothesis that all time semantics must remain isolated.

## External evidence ledger

### E1 — RFC 5280: invalidity time can precede revocation processing time

Source: https://www.rfc-editor.org/rfc/rfc5280

RFC 5280 defines `invalidityDate` as the date on which the private key is known or suspected to have been compromised, or the certificate otherwise became invalid. It explicitly permits that date to precede the CRL entry's revocation date, which is when the CA processed the revocation.

**Extraction:** `became/suspected-invalid` and `revocation processed/published` are distinct temporal predicates. A scalar `revoked_at` loses security-relevant uncertainty and can incorrectly bless signatures produced after compromise but before revocation publication.

**Limit:** PKIX semantics are domain-specific; `invalidityDate` should not become a universal SB field name.

### E2 — RFC 6960 / RFC 5019: one status response legitimately carries multiple non-equivalent times

Sources:
- https://www.rfc-editor.org/rfc/rfc6960.html
- https://www.rfc-editor.org/rfc/rfc5019.html

OCSP distinguishes:

- `thisUpdate`: most recent time the status was known correct;
- `nextUpdate`: deadline by which newer status information will exist;
- `producedAt`: time the response was signed;
- `revocationTime`: time the certificate was revoked or placed on hold.

The lightweight profile additionally requires clients to use an accurate source of current time to decide freshness.

**Extraction:** `asserted status effective at`, `evidence produced at`, `evidence fresh until`, `revocation effective at` and `evaluation now` are not aliases. Provider adapters must preserve their temporal roles instead of flattening them.

### E3 — RFC 3161 / RFC 9921: trusted-time evidence is about a bound subject, not generic wall-clock truth

Sources:
- https://www.rfc-editor.org/rfc/rfc3161
- https://www.rfc-editor.org/rfc/rfc9921.html

RFC 3161 timestamps a message imprint. RFC 9921 makes the semantic distinction adversarially explicit: timestamping a payload before signing proves a different fact from timestamping the signature after it exists. Validators must not treat a payload-only timestamp as proof that a later signature existed before key revocation.

**Extraction:** every trusted-time claim needs at least **what fact/bytes were witnessed**, **who/what provided the witness**, and **what temporal relation is justified** (`existed no later than`, `signed response at`, etc.). A generic `timestamp=T` is unsafe.

### E4 — RFC 9162 Certificate Transparency: witness timestamp, inclusion and consistency are separate claims

Source: https://www.rfc-editor.org/rfc/rfc9162.html

Certificate Transparency signs timestamps for submitted entries and separately supports inclusion and consistency proofs over append-only Merkle trees. A signed timestamp can later be challenged by requiring proof that the promised entry actually appears in the log; inconsistent views are a separate misbehavior class.

**Extraction:** a witness time is not automatically proof of durable inclusion, global observation or causal truth. Temporal evidence must preserve the **witness role and proof class**.

### E5 — RFC 8915 Network Time Security: authenticated time still has uncertainty and bootstrapping limits

Source: https://www.rfc-editor.org/rfc/rfc8915.html

NTS authenticates time synchronization and protects replay/request-response integrity. Its security discussion acknowledges bootstrapping difficulty when a client clock is not yet trustworthy and discusses bounding timing error under delay attacks rather than claiming perfect time.

**Extraction:** authenticated source identity does not imply exact time. Time evidence can require an uncertainty/bound or confidence/applicability statement. Systems should be able to distinguish `trusted source` from `sufficient accuracy for this correctness claim`.

### E6 — Gray & Cheriton leases: time-based safety depends on clock assumptions

Source: C. Gray and D. Cheriton, “Leases: An Efficient Fault-Tolerant Mechanism for Distributed File Cache Consistency,” SOSP 1989. Public copy: https://www.cs.cmu.edu/afs/cs.cmu.edu/academic/class/15712-s12/www/papers/gray89.pdf

Leases use physical clocks to grant rights for bounded terms and tolerate message/host failures under their stated non-Byzantine assumptions. Clock failure is outside the safety assumptions.

**Extraction:** `leaseExpiredAt=T` is not self-proving. Safe expiry depends on the lease protocol's clock/error assumptions and often on waiting out uncertainty. This supports qualified temporal evidence, not a universal raw wall-clock field.

### E7 — Spanner / TrueTime: expose uncertainty rather than pretending the clock is exact

Sources:
- https://cloud.google.com/blog/products/databases/strict-serializability-and-external-consistency-in-spanner
- https://docs.cloud.google.com/spanner/docs/whitepapers/life-of-reads-and-writes

TrueTime exposes an interval `[earliest, latest]` that contains real time. Spanner's commit-wait protocol delays visibility until the chosen timestamp is definitely in the past, converting uncertain physical time into a stronger ordering guarantee.

**Extraction:** an interval/bound plus protocol can prove an ordering relation that an unqualified timestamp cannot. Conversely, G2 should own the **required relation** (e.g. `definitely-after`) rather than require TrueTime-style infrastructure universally.

### E8 — fencing tokens: monotonic epochs can dominate physical-time reasoning for stale writers

Sources:
- `DR-SRFE-01` internal corpus;
- Martin Kleppmann, “How to do distributed locking”: https://martin.kleppmann.com/2016/02/08/how-to-do-distributed-locking.html

A sink that rejects lower fencing tokens can exclude stale writers even if a paused client incorrectly believes its old lease remains useful. The correctness proof is monotonic authority generation at the sink, not trusted synchronized wall-clock time at every actor.

**Extraction:** a portable temporal/ordering relation must admit **logical/epoch ordering**. It must not universalize UTC timestamps as the only admissible proof of `before/after/current/stale`.

### E9 — W3C PROV Constraints: temporal ordering can be a relation over provenance events

Source: https://www.w3.org/TR/prov-constraints/

PROV models generation, usage, invalidation, start and end as events with ordering constraints. The semantics are about which events can precede/follow others, not merely about formatting timestamps.

**Extraction:** cross-domain provenance benefits from typed event identities plus ordering relations. This is independent corroboration that a small relation can be universal while concrete event meanings remain domain-owned.

### E10 — Apache Beam: event time, processing time and watermark/completeness are different dimensions

Sources:
- https://beam.apache.org/documentation/basics/
- https://beam.apache.org/documentation/programming-guide/

Beam explicitly distinguishes event time from processing time and treats watermarks as estimates of event-time completeness. Late arrival therefore cannot be inferred from processing-clock time alone.

**Extraction:** `occurred`, `observed/arrived`, `processed/evaluated` and `completeness horizon` are independent temporal roles outside security/PKI. This is strong cross-domain evidence that the distinction is architectural rather than PKI-specific.

### E11 — NIST SP 800-57 Part 1 Rev. 5: key lifecycle transitions are recorded semantic state changes

Source: https://csrc.nist.gov/pubs/sp/800/57/pt1/r5/final

NIST separates active, deactivated, compromised and destroyed key states and requires transition/compromise handling according to key purpose.

**Extraction:** temporal qualification should bind to lifecycle state/revision and event identity. It should not infer authority solely from certificate date arithmetic.

## Competing models

### Model A — Universal scalar timestamp

```text
claim.timestamp = 2026-09-03T12:00:00Z
```

**Strongest argument:** minimal and interoperable representation.

**Failure:** loses role, source, scope, uncertainty, causal relation, freshness and authority semantics. `producedAt`, `thisUpdate`, occurrence time and observation time become indistinguishable.

**Disposition:** **DO_NOT_BUILD** as semantic primitive. RFC 3339/9557 formatting may remain a representation choice.

### Model B — Capability-specific time only

Every capability invents its own `revokedAt`, `occurredAt`, `observedAt`, `expiresAt`, `validUntil`, `watermark`, `leaseEnd`, `evaluatedAt` with no shared relation.

**Strongest argument:** preserves semantic ownership and avoids a mega-object.

**Failure:** repeats evidence qualification, makes provider substitution harder, obscures cross-capability questions such as “was this approval witnessed before this authority became invalid?” and encourages incompatible stale/current semantics.

**Disposition:** **SPECIALIZE domain predicates, but DO_NOT keep the qualification relation entirely isolated**.

### Model C — Universal wall-clock/time-service primitive

All correctness relies on a globally trusted UTC clock or time provider.

**Strongest argument:** makes comparisons straightforward.

**Failure:** leases expose clock-failure assumptions; TrueTime requires special uncertainty machinery; offline Stations may lack online trustworthy time; fencing/epochs can provide stronger stale-owner exclusion without synchronized wall clock; causal/event-time systems need non-wall-clock ordering.

**Disposition:** **DO_NOT_BUILD** as mandatory UCA primitive.

### Model D — Small typed temporal-evidence / ordering relation

Conceptual shape, not frozen IR:

```text
TemporalEvidence
  subject/fact/event identity
  semantic temporal predicate owned by capability
  relation: before | after | no-later-than | no-earlier-than | overlaps | within | order/epoch-dominates ...
  reference event/authority/revision when applicable
  witness/provider identity
  evidence/proof class
  observation/evaluation instant
  bound/uncertainty/applicability
  provenance
        ↓
Qualified temporal relation
        ↓
capability-owned decision
```

Physical timestamp, bounded interval, signed timestamp token, append-only log checkpoint, monotonic epoch, fencing token, lease proof or local observation can be provider/mechanism-specific evidence for a portable required relation.

**Disposition:** **GENERALIZE narrowly**; exact vocabulary/schema deferred to synthesis and cross-domain proof.

## Strongest evidence for generalization

Three independent families converge:

1. **PKI/trust:** RFC 5280 and OCSP distinguish invalidity, revocation processing, status-effective time, production and freshness.
2. **Distributed correctness:** leases and TrueTime make clock assumptions/uncertainty explicit; fencing can replace wall-clock timing with monotonic ordering.
3. **Data/provenance:** PROV and Beam separate event occurrence/order from processing/observation/completeness.

The reusable invariant is therefore not “everything has a timestamp.” It is:

> **When correctness depends on time/order, evidence must state which semantic event/fact is being ordered, relative to what, by which witness/mechanism, under what uncertainty/applicability, and what relation the evidence actually proves.**

## Strongest evidence against over-generalization

The domains still disagree on what temporal facts mean:

- `invalidityDate` is a security/PKI concept;
- `watermark` is an estimated completeness frontier, not revocation;
- lease expiry is a protocol entitlement boundary;
- fencing generation is logical authority ordering, not wall-clock time;
- timestamp tokens prove bounded existence of an imprinted object, not business occurrence;
- processing time is an operational observation, not event truth.

Therefore UCA must not define universal domain states such as `REVOKED`, `EXPIRED`, `LATE`, `COMMITTED`, `COMPROMISED`, `VALID`, or a universal `Clock` authority.

## Contradictions resolved

### C1 — “Revocation time tells us when authority stopped being safe”

**Resolved: false in general.** RFC 5280 explicitly allows suspected invalidity/compromise to precede revocation processing. Historical evaluation may therefore be `INCONCLUSIVE` if the compromise interval cannot be bounded strongly enough.

### C2 — “A trusted timestamp proves the event happened then”

**Resolved: false.** It proves a relation about the exact object/imprint covered under the TSA/log's semantics. RFC 9921 shows how confusing payload time with signature time creates a security vulnerability.

### C3 — “Reliable distributed authority needs synchronized physical clocks”

**Resolved: false universally.** Some lease protocols do depend on bounded clocks; fencing/epochs can establish stale-writer exclusion through monotonic ordering instead.

### C4 — “Logical ordering makes wall-clock evidence unnecessary”

**Resolved: false universally.** Historical signature validity, retention deadlines, legal/audit periods, human deadlines and provider certificates may depend on real-time evidence. The architecture needs both families without conflating them.

### C5 — “Observation time is a safe proxy for occurrence time”

**Resolved: false.** Beam's event-time/processing-time distinction and asynchronous transparency/OCSP behavior show that delayed observation is normal.

## Invariants

1. **Temporal-role invariant:** occurrence, observation, production, evaluation, invalidation/revocation, freshness and deadline times are not interchangeable.
2. **Scope invariant:** a trusted-time witness proves only the subject/fact actually bound by its evidence.
3. **Uncertainty invariant:** if correctness depends on an ordering that clock uncertainty prevents proving, the result is not silently rounded into certainty.
4. **Logical-order invariant:** physical time is not mandatory when a stronger monotonic epoch/fencing relation proves the required ordering.
5. **No-laundering invariant:** an earlier timestamp on payload/evidence cannot validate a later signature/approval/effect unless the proof explicitly covers the later object.
6. **Historical/current separation:** historically valid temporal evidence does not automatically establish current authority/applicability.
7. **Witness qualification:** an authenticated witness/provider is not automatically trusted for every temporal predicate or assurance level.
8. **Freshness-as-policy invariant:** freshness is evaluated relative to a capability-owned profile/obligation; it is not globally synonymous with “recent.”
9. **Offline non-amplification:** missing trusted-time closure must not cause an offline Station to broaden authority; it must use a permitted bounded/epoch-based profile or degrade/return `INCONCLUSIVE`.
10. **Provider substitution:** replacing a time/log/PKI/provider cannot weaken the required temporal relation silently.
11. **Evidence preservation:** historical temporal claims preserve enough witness/proof/profile material to be re-evaluated under their historical semantics when required.
12. **No false precision:** a timestamp with unknown/insufficient accuracy is not represented as exact merely because the serialization has nanoseconds.

## Failure / adversarial analysis

### Compromise discovered late

Key K signs approval A at 10:00. At 15:00 investigators discover evidence suggesting compromise began sometime between 09:30 and 11:00. Revocation is published at 15:10.

A scalar `revoked_at=15:10` incorrectly classifies A as safely pre-revocation. A typed model preserves an uncertainty interval/suspected invalidity relation and can yield `INCONCLUSIVE` pending stronger evidence.

### Payload timestamp laundering

Payload P is timestamped at 09:00. Signer key is revoked at 10:00. Attacker signs P at 11:00 and presents the 09:00 timestamp.

A generic timestamp validator may accept it. RFC 9921 requires distinguishing payload-only timestamp semantics from signature-existence timestamp semantics.

### OCSP freshness collapse

Responder produces a cached OCSP response at 12:00 describing status known correct at 11:55 and fresh until 12:30. A model that stores only `timestamp=12:00` cannot reconstruct whether a validation at 12:40 used stale status.

### Offline Station with bad wall clock

A Station is disconnected and its RTC jumps backwards. If authority is represented solely by `expires_at`, an old lease/grant may appear live again. A safe profile must rely on monotonic trusted local state, bounded secure time evidence, or epoch/fencing semantics; otherwise privileged actuation degrades.

### Lease holder pauses beyond term

A process pauses, its lease expires, a new holder receives a higher generation, then the old process resumes. Physical local time believed by the old process is not sufficient. Sink-side fencing can reject stale generation.

### Transparency timestamp without inclusion

A log promises an entry with a signed timestamp but later cannot prove inclusion. The timestamp is evidence of the log's promise, not evidence that append-only durable inclusion actually occurred. Composite proof class must remain explicit.

### Provider downgrade

Provider A supplies bounded authenticated time; Provider B supplies only local wall-clock timestamps. Both serialize ISO 8601. If the requirement needs `definitely before invalidity`, B is not semantically equivalent even though field formats match.

### Observation reorder

Events E1 and E2 occur in order E1→E2 but arrive at a central service in reverse order. Processing timestamps cannot rewrite event ordering without domain evidence; if order matters, event/causal/sequence evidence must be retained.

## Provider-specific versus portable semantics

### Portable / candidate shared semantics

G2 may own a small relation/envelope for:

- identity of the subject/fact/event being temporally qualified;
- identity of the reference event/epoch when the claim is relational;
- the **relation claimed** rather than a bare timestamp;
- witness/provider/evidence identity;
- uncertainty/bounds or explicit absence thereof;
- evidence/profile revision and applicability/freshness;
- provenance and `INCONCLUSIVE` when the required relation cannot be established.

### Capability-owned semantics

Remain with the relevant owner:

- compromise/revocation semantics — Identity/Security/Authorization;
- leases, fencing and rights — Transaction/Consistency + Station/Security as applicable;
- event time/watermarks — Messaging/Data/Workflow/Observability depending on the semantic owner;
- retention/legal deadlines — Governance/Storage;
- workflow/Gate deadlines — Workflow/business capability;
- provider certificate validity — Identity/Provider binding;
- deployment/release windows — Deployment/Lifecycle;
- commercial billing periods — Commercial capability.

### Providerized mechanics

Examples only, not canonical objects:

- RFC 3161 TSA / COSE timestamp tokens;
- CRL/OCSP;
- transparency logs;
- NTP/NTS/PTP/secure clocks;
- TrueTime-style uncertainty services;
- provider-generated sequence/epoch/fencing tokens;
- database commit timestamps;
- stream watermarks;
- HSM/KMS signing-time metadata.

## Consequences for existing findings, candidates and hypotheses

### `DR-QDCE-01`

**HARDEN.** `applicability/freshness` should not be modeled as one unqualified timestamp. A qualified derived claim may reference typed temporal evidence sufficient for its domain predicate.

### `DR-ABRT-01`

**HARDEN.** Current/rooted authority closure must distinguish current applicability from historical occurrence and account for invalidity/compromise uncertainty rather than only revocation publication.

### `DR-SRFE-01`

**KEEP/HARDEN.** Expiry is only one safe stale-owner exclusion family. Generation/fencing remains a non-wall-clock alternative and should be expressible through the same small ordering-evidence relation without becoming a `Time` object.

### `DR-RARSOD-01`

**HARDEN.** Recovery evidence needs transition-event ordering and authority epochs; emergency action time, discovery time and steady-state re-entry time remain separate.

### `DR-RRHV-01`

**GENERALIZE the residual.** Historical verification should consume typed evidence for signature existence, invalidity/compromise, revocation publication/status freshness and verification time. It should not invent a new PKI-only timestamp hierarchy.

### Cycle-7 applicability/evidence-horizon findings

**MERGE conceptually.** Evidence replay/retention horizons and reconnect requalification should state which temporal frontier is being tested: occurrence horizon, evidence freshness horizon, authority/delegation horizon, support applicability horizon or consumer-observation horizon.

### Capability candidate decision

No new top-level capability is warranted. The evidence supports a **small UCA-level relation candidate for synthesis**, preferably merged into qualified evidence / qualified derived claim machinery. Do not create `Temporal Authority` as a standalone business capability from this research alone.

## Proof obligations / falsification paths

The following are research obligations, not executed tests.

### DR-TAES-01 — invalidity precedes revocation
Create a certificate/authority timeline where suspected compromise at T1 precedes revocation processing at T2. A claim produced in `(T1,T2)` must not become historically valid merely because it predates `revocationTime`; expected result is policy-dependent INVALID or `INCONCLUSIVE` with evidence of the invalidity interval.

### DR-TAES-02 — revocation published after act
Produce an act at T1, revocation publication at T2, and independently prove compromise only after T1. Historical validation may remain valid while current authority is revoked.

### DR-TAES-03 — unknown compromise onset
Revocation is known, but compromise onset cannot be bounded. Historical act falls inside the uncertainty window. Require `INCONCLUSIVE`, not automatic pre-revocation validity.

### DR-TAES-04 — OCSP temporal-role preservation
Map an OCSP response where `thisUpdate != producedAt != nextUpdate`. Provider adapter must preserve the three roles; flattening to one timestamp fails conformance.

### DR-TAES-05 — stale OCSP response
Validate after `nextUpdate`; cached provider success/HTTP response cannot satisfy freshness.

### DR-TAES-06 — payload timestamp laundering
Timestamp payload before revocation, sign it after revocation, and require rejection when the claim requires proof of signature existence before revocation.

### DR-TAES-07 — signature-bound timestamp
Timestamp the signature itself under a qualified TSA/profile and prove the exact scope; historical evaluator may use that relation subject to revocation/compromise policy.

### DR-TAES-08 — transparency promise without inclusion
Receive signed timestamp/promise but make inclusion proof unavailable or inconsistent. Do not upgrade `witnessed submission` to `durably included`.

### DR-TAES-09 — time-provider uncertainty
Use a time source whose uncertainty interval overlaps a security deadline. The system must wait, obtain stronger evidence, use an alternate logical proof or return `INCONCLUSIVE`; it must not compare midpoint timestamps as exact.

### DR-TAES-10 — lease clock failure
Inject backward/forward clock fault in a lease holder. Prove the declared lease profile either contains the fault through bounded secure time/fencing or refuses unsafe actuation.

### DR-TAES-11 — fencing without wall-clock
Run stale-writer exclusion with monotonic generations and deliberately skew actor clocks. Sink-side higher-generation evidence must reject the stale writer without requiring synchronized wall clocks.

### DR-TAES-12 — Station offline clock rollback
Restore an offline Station snapshot with an older wall clock after authority horizon/re-root. It must not resurrect expired/revoked authority; expected result uses monotonic/epoch evidence or degraded `INCONCLUSIVE`.

### DR-TAES-13 — event time versus observation time
Deliver events out of order. Reprocessing/observation timestamps must not overwrite domain occurrence/order evidence.

### DR-TAES-14 — freshness profile revision
Evidence valid under profile F1 becomes insufficient under stricter F2. Preserve historical F1 evaluation but require current requalification; no destructive rewrite.

### DR-TAES-15 — provider substitution strong→weak time
Replace a bounded authenticated-time provider with a local wall-clock provider. If the required relation is `definitely-before/after` within a bound B that the new provider cannot prove, binding becomes PARTIAL/INCOMPATIBLE rather than silently accepted.

### DR-TAES-16 — provider substitution time→epoch
Replace a physical-time lease realization with a monotonic fencing realization. If both prove the same portable stale-owner exclusion relation, semantic requirement identity remains stable despite different mechanics.

### DR-TAES-17 — evidence retention expiry
Delete required TSA/OCSP/log/profile evidence while retaining only a scalar timestamp. Historical claim becomes `INCONCLUSIVE`; no synthetic current-provider timestamp repairs the original fact.

### DR-TAES-18 — witness compromise
Compromise the time/log witness after it issued evidence. Historical treatment follows witness/root/time-compromise policy and does not automatically equal either current trust or blanket historical invalidity.

### DR-TAES-19 — simple-system ergonomics
A single-node local system with no high-assurance time requirement can use local observation/time metadata without deploying TSA, CT, TrueTime or distributed clocks. Advanced temporal closure is required only when the semantic obligation demands it.

### DR-TAES-20 — cross-domain primitive reuse
Demonstrate one small temporal-evidence relation reused across at least three independent domains — e.g. historical signature qualification, Station lease/fencing applicability and event/evidence freshness — while each domain retains its own predicate/result schema. Failure to reuse without semantic leakage falsifies UCA promotion.

### DR-TAES-21 — relation/type confusion
Attempt to feed `observedAt` evidence where a proof requires `occurredBefore`, or a payload timestamp where signature-existence evidence is required. Type/profile checking must reject or produce `INCONCLUSIVE`.

### DR-TAES-22 — no false precision
Supply a provider timestamp with coarse/unknown error but nanosecond serialization. The qualification must retain actual uncertainty/assurance rather than infer precision from representation.

## Unresolved questions

1. What is the minimum portable relation vocabulary? A fixed enum may be too rigid; an extensible predicate/profile could be safer.
2. Should uncertainty be represented numerically as intervals, categorically as assurance classes, or provider-specific evidence with only portable predicates exposed?
3. Which logical-order relations belong in the same relation as physical-time evidence versus a broader `qualified ordering` primitive?
4. How should legal/regulatory “effective time” interact with technical observation/publication time when law defines retroactive or delayed effect?
5. For offline Stations, what minimum persistent monotonic state is required to prevent snapshot/clock rollback from resurrecting authority?
6. How long must temporal verification evidence survive relative to privacy/retention obligations?
7. Which domains require trusted external time versus signed local monotonic evidence?

These remain synthesis/planning questions; none justifies inventing a universal clock service now.

## Confidence

### High confidence

- a generic scalar `timestamp` is semantically insufficient for authority/evidence correctness;
- invalidity/compromise, revocation processing/publication, occurrence, evidence production, observation and evaluation are distinct temporal roles;
- trusted-time evidence is scope-bound and does not prove arbitrary event time;
- physical-time correctness claims need explicit clock/uncertainty assumptions;
- fencing/epochs can prove selected ordering/exclusion properties without synchronized wall clocks;
- missing temporal proof can legitimately produce `INCONCLUSIVE`.

### Medium-high confidence

- the recurring structure is broad enough for a small UCA-level typed temporal/ordering-evidence relation merged with qualified evidence/derived claims;
- provider conformance should prove the required relation rather than mere timestamp format compatibility.

### Medium confidence

- exact relation vocabulary, interval model and whether logical epochs live inside the same primitive should be decided only during cross-domain synthesis/proof design.

## Proposed research dispositions

### KEEP

- domain ownership of revocation, leases, deadlines, event time, retention, billing periods and workflow timing;
- `INCONCLUSIVE` for insufficient/stale/ambiguous temporal evidence;
- historical/current applicability separation.

### HARDEN

- `DR-QDCE-01` applicability/freshness with typed temporal evidence;
- `DR-ABRT-01` authority closure with compromise/invalidity uncertainty;
- `DR-SRFE-01` with explicit time-assumption versus epoch/fencing proof families;
- `DR-RRHV-01` with typed temporal-role and witness-scope qualification.

### GENERALIZE

A small **qualified temporal/ordering evidence relation** across UCA/evidence machinery, subject to synthesis proving reuse without erasing domain ownership.

### MERGE

Merge the relation into qualified evidence / qualified derived claim / historical interpretation machinery rather than creating a standalone top-level capability.

### SPECIALIZE

- PKI invalidity/revocation/status freshness;
- lease expiry and fencing;
- event-time/watermark semantics;
- legal/commercial deadlines;
- recovery/re-root transition timing.

### PROVIDERIZE

TSA/RFC3161, OCSP/CRL, CT/transparency logs, NTP/NTS/PTP, TrueTime-style services, database commit clocks, stream watermarks and provider sequence/fencing mechanics.

### DEFER

- exact universal relation vocabulary;
- universal uncertainty representation;
- whether physical and logical ordering share one exact schema;
- legal-effect-time ontology.

### DO_NOT_BUILD

- universal `timestamp` as semantic truth;
- universal `revoked_at` as compromise truth;
- mandatory global trusted-clock service;
- `timestamp precision == accuracy`;
- payload timestamp as signature-time proof;
- observation/processing time as occurrence time;
- lease timeout alone as stale-writer proof when its clock assumptions are not qualified;
- provider timestamp-format compatibility as temporal semantic compatibility.

## Research recommendation

Generation 2 should **not** promote a general Time capability or universal Clock primitive. It should carry into Capability Synthesis a much smaller hypothesis:

> **A correctness-relevant temporal claim is qualified evidence about a typed relation between semantic events/facts, with explicit witness/proof scope, applicability and uncertainty/order assumptions; domain capabilities own the event meanings and decisions, while providers supply concrete clocks, timestamps, logs, epochs or fencing mechanisms.**

This preserves `mature-system semantics with simple-system ergonomics`: a simple system may use straightforward local time where no stronger obligation exists, while a mature/offline/high-assurance system can substitute bounded clocks, timestamp authorities, transparency witnesses or monotonic fencing without changing the canonical domain meaning.

## Recommended next deep question

**Temporal Evidence versus Causal / Epoch Ordering Closure.** The remaining high-value boundary is whether physical-time relations (`before`, `no-later-than`, freshness interval) and logical authority/order relations (revision vector, fencing epoch, Lamport/causal order, provider generation) should share one generalized `qualified ordering evidence` primitive or remain two sibling relations. The falsifier should be cross-domain reuse: if one relation cannot serve historical verification, workflow/message causality and stale-writer exclusion without semantic leakage or false comparability, synthesis should split them.
