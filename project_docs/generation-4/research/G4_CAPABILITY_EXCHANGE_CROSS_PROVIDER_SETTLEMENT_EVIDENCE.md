# G4 Capability Exchange — Cross-Provider Settlement Evidence Without an Authoritative Status Oracle

Status: `RESEARCH_ACTIVE / NON_EXECUTABLE`
Date: 2026-09-22
Family: Shared Semantic Kernel / Capability Exchange Plane / Inter-Capability Boundary Model

> Research candidate != implementation authority. This document does not select a payment provider, broker, workflow engine, transaction coordinator, database, reconciliation service, gateway, or protocol. It does not reopen G3 and does not authorize product work.

## 1. Research question

Prior G4 research established that explicit re-admission of work whose predecessor effect is `UNKNOWN/POSSIBLY_COMMITTED` requires effect-safety evidence in addition to fresh authority. The remaining hard case is cross-provider settlement when provider P1 cannot supply an authoritative query that proves whether an ambiguous effect occurred, yet failover/re-admission to P2 is operationally desirable.

Core finding:

`no authoritative provider status != permission to infer NOT_COMMITTED`.

But equally:

`no authoritative provider status != every case must remain UNKNOWN forever`.

`UNKNOWN` may be narrowed only by evidence whose semantics actually constrain the protected effect: conserved-right accounting, commitment-adjacent target evidence, qualified receipts/witnesses, authoritative downstream reconciliation, or an explicit compensation/recovery law. Absence of observation, timeout expiry, missing webhook, or an empty search result is not sufficient by itself.

## 2. Evidence reviewed

Primary documentation, standards-adjacent distributed-systems evidence, and mature operational guidance:

- Google Cloud Spanner documents the **unknown commit status** problem: after an out-of-band connection break, the application cannot know whether failure occurred before or after commit; automatic retry without deduplication can execute business logic twice. Official clients therefore surface the unknown outcome rather than pretending abort. <https://docs.cloud.google.com/spanner/docs/queues/queues-at-most-once>
- Adyen documents `Received` and `Pending` as intermediate payment states whose final status may arrive minutes, hours, or days later, and recommends business logic based on asynchronous AUTHORISATION webhooks rather than treating an immediate result code as final. <https://docs.adyen.com/online-payments/build-your-integration/payment-result-codes>
- Adyen also documents webhook retries for up to 30 days when delivery fails and explicitly warns that duplicate webhook events can occur. Missing or delayed notification therefore cannot be normalized to non-occurrence. <https://docs.adyen.com/development-resources/webhooks/troubleshoot> and <https://docs.adyen.com/development-resources/webhooks/handle-webhook-events>
- Stripe exposes retrieval of a PaymentIntent by stable identifier and a state machine whose terminal/intermediate status is provider state. This is an example of a provider-local authoritative query when one exists; it is not a universal assumption for all effects/providers. <https://docs.stripe.com/api/payment_intents/retrieve>
- Braintree exposes transaction lookup and status history, including authorization/settlement states. Again, this is a provider capability benchmark rather than a portable guarantee. <https://developer.paypal.com/braintree/docs/reference/response/transaction/node>
- Amazon SQS FIFO documents only a five-minute deduplication interval; if a successful send loses its acknowledgement and is retried after that interval, SQS cannot detect the duplicate. This demonstrates why dedup retention is not settlement evidence after its horizon. <https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/designing-for-outage-recovery-scenarios.html>
- Atomic-commit research distinguishes a decision/termination protocol from ordinary message observation: commitment protocols exist precisely because local participants cannot infer a globally safe outcome from missing communication alone. The DNB-AC work is used here only as distributed-systems evidence for this distinction, not as a technology candidate. DOI 10.1109/SPDP.1995.530658.
- Saga guidance distinguishes compensable work from a pivot/point-of-no-return. Compensation is a forward recovery action and is not evidence that the original effect never occurred. <https://learn.microsoft.com/en-us/azure/architecture/patterns/saga>

These systems are benchmarks only; none is selected.

## 3. Settlement evidence is a qualified claim, not a receipt-shaped blob

Candidate distinction:

```text
Evidence observed
  != evidence authentic
  != evidence complete for effect X
  != evidence current
  != settlement disposition
```

A receipt, webhook, ledger row, target observation, provider status, queue acknowledgement, or human reconciliation record contributes only the guarantee it actually proves.

Candidate `SettlementEvidenceRef` dimensions:

- protected `EffectIdentityRef` / occurrence lineage;
- evidence kind and producer;
- trust/provenance/authenticity claim;
- effect/resource/provider/tenant/classification scope;
- observation/event/commit time semantics where known;
- completeness model (`positive-only`, `closed-world`, `bounded-window`, `authoritative-state`, `witness-only`, `derived`);
- currentness/retention horizon;
- relation to admission/attempt/provider lineage;
- whether it can prove `COMMITTED`, `NOT_COMMITTED`, only `OBSERVED`, or merely `NO_EVIDENCE`;
- reconciliation/contradiction behavior.

`evidence authentic != evidence semantically sufficient`.

## 4. Positive and negative settlement evidence are asymmetric

A cryptographically authentic provider receipt tied to the exact effect may strongly prove that an effect occurred. The absence of such a receipt usually does not prove the opposite.

Candidate rule:

`positive effect witness can prove occurrence; finite non-observation cannot prove non-occurrence unless the observation domain is itself proven complete for that effect`.

Examples:

- webhook received with qualified provider identity -> positive evidence;
- webhook not received -> not proof of no effect because delivery can be delayed/retried;
- search returns no record -> negative evidence only if the contract proves the search namespace/time horizon is complete for the exact effect identity;
- local telemetry saw no outbound ACK -> no proof that remote commit did not occur;
- provider API returns a terminal `failed-before-commit` state under a contract that makes the state authoritative -> candidate negative settlement evidence.

Thus:

`NO_EVIDENCE != NOT_COMMITTED`.

## 5. Evidence classes for reducing UNKNOWN

### 5.1 Authoritative provider state

Where P1 exposes a stable effect identifier plus a contractually authoritative terminal status, this is the simplest settlement source. Stripe PaymentIntent retrieval and Braintree transaction lookup/status history are mature examples of provider-local status surfaces.

But portability requires:

`provider has query endpoint != query is authoritative for every external effect`.

The contract must establish whether the status covers authorization, capture, settlement, downstream delivery, or only provider acceptance.

### 5.2 Commitment-adjacent target evidence

When the protected effect lands in a target the runtime can inspect independently of P1, target evidence may dominate provider uncertainty.

Examples include an immutable target ledger entry, target-side fence generation, versioned state transition, conserved-right consumption, or another record atomically coupled to the protected effect.

Candidate rule:

`target-side evidence can settle provider ambiguity only when the target record is inside or provably coupled to the effect commitment boundary`.

A log emitted before commit or telemetry emitted asynchronously afterward is not automatically such evidence.

### 5.3 Conserved rights / reservations

If exactly one conserved right can authorize the effect and the system can prove where that right currently resides, an ambiguous provider attempt may be bounded without querying provider history directly.

For example, a successor attempt can be safe if a durable fence/reservation proves P1 no longer possesses a usable right and P2 exclusively owns the same conserved right.

But:

`right transferred != predecessor effect absent`.

The transfer proves future exclusion; historical settlement still needs evidence if duplicate historical effects matter.

### 5.4 Independent witnesses

A bank/network receipt, target ledger, external audit log, hardware/physical sensor, or independent downstream service can be a witness.

Witness evidence is useful only if its observation relationship to the effect is declared. Multiple copies of the same upstream event are correlated, not independent.

`N witnesses != N independent witnesses`.

A witness can prove `effect observed` without proving `effect unique`, and may prove neither if its capture path is lossy or replayable.

### 5.5 Reconciliation records

Periodic reconciliation against an authoritative downstream ledger can convert a long-lived ambiguity into a qualified disposition.

Candidate distinction:

`reconciliation result != original provider ACK`.

Reconciliation is a later evidence-producing process. It must preserve which occurrence/effect/attempt it resolves, the coverage interval, matching rule, ambiguity set, and whether unmatched means `NOT_COMMITTED` or only `NOT_FOUND_UNDER_THIS_MATCH`.

### 5.6 Compensation evidence

Compensation does not prove the predecessor absent. A refund after a duplicate charge proves at least one charge existed and a compensating action occurred.

`compensated != never happened`.

For non-reversible effects, compensation may only create a business remediation state. Historical external effects remain facts.

## 6. Closed-world negative evidence requires a completeness proof

The hardest settlement claim is `NOT_COMMITTED` without provider status.

Candidate rule:

`NOT_COMMITTED from absence requires a closed-world proof over every effect-capable commitment path for the protected effect`.

A qualified closed-world proof may derive from:

- a target ledger proven complete for every valid effect of kind X;
- a conserved-right invariant proving no right was consumed;
- a commitment-adjacent monotonic sequence/fence proving the predecessor generation never committed;
- an authoritative downstream settlement file whose coverage is contractually complete for the interval/effect namespace;
- structural exclusion proving the attempt never crossed the commitment boundary.

Without such a closure argument, the disposition remains `UNKNOWN` or `PARTIAL`.

This mirrors earlier G4 route/source-completeness work: negative evidence requires positive proof of completeness/exclusion rather than absence of observation.

## 7. Provider receipts and business settlement are not synonyms

A provider may return:

- request accepted;
- authorized;
- captured;
- submitted for settlement;
- settled;
- delivered;
- reversed;
- compensated.

These are not interchangeable.

Adyen explicitly distinguishes intermediate `Received/Pending` from final outcome, and Braintree exposes a multi-stage authorization/settlement status history.

Therefore:

`receipt/status name != protected business effect disposition unless the contract binds that status to the effect`.

The Exchange Plane must preserve the provider/status semantics rather than normalize every success-shaped state into `COMMITTED`.

## 8. Missing webhook is not negative settlement evidence

Adyen retries failed webhook delivery for up to 30 days and warns that duplicate webhook events can occur. This provides a concrete mature failure case:

`webhook absence at time t != event absence`.

Likewise:

`webhook duplicate != duplicate business effect`.

Webhook delivery lineage and business effect lineage remain distinct.

A webhook can become strong positive evidence when authenticated and semantically bound to the effect, but a missing webhook can be used as negative evidence only if the provider contract supplies a complete bounded-delivery guarantee and that bound has been proven satisfied. Otherwise absence remains non-conclusive.

## 9. Search/query absence needs namespace and horizon closure

A query such as `find(transactionId)` can be authoritative if the provider guarantees stable identity and complete lookup for that identifier. A broad search by amount/time/customer is weaker because multiple effects can match or indexing can lag.

Candidate ordering of evidence strength for exact settlement, not a universal product ranking:

```text
exact immutable effect-id lookup with authoritative terminal semantics
  > complete target ledger keyed by effect identity
  > provider reconciliation file with declared coverage
  > qualified independent witness set
  > heuristic attribute/time search
  > local telemetry / missing callback
```

Even the stronger classes remain scope/currentness qualified.

## 10. Unknown commit status is a first-class terminal-for-now disposition

Google Spanner's unknown-commit-status guidance is useful because it refuses to convert communication failure into transaction failure.

G4 candidate rule:

`UNKNOWN may be stable and operationally actionable without being semantically collapsed`.

Possible actions while `UNKNOWN` persists:

- defer successor effect;
- continue read-only/local-safe work;
- query/reconcile asynchronously;
- require manual review;
- reserve/fence successor capacity without committing it;
- compensate only under a capability-owned recovery law;
- expire user-facing workflow while retaining settlement obligation.

The system need not block every unrelated operation, but it must not fabricate a settlement result for the protected invariant.

## 11. Cross-provider successor safety without P1 settlement query

For:

```text
T1 -> P1 -> UNKNOWN
T2 -> P2 ?
```

safe automatic T2 requires at least one qualified path:

1. **shared target-side dedup/fence** — P1 and P2 converge on an effect-side authority that admits at most one protected effect;
2. **conserved-right transfer plus historical-safe invariant** — P2 exclusively owns the future right and duplicate historical effects are separately settled/tolerated;
3. **complete downstream ledger/reconciliation** — evidence proves T1 absent or already committed;
4. **business duplicate tolerance** — capability contract explicitly admits multiplicity and owns reconciliation/compensation;
5. **structural proof T1 never reached commitment** — not merely transport failure;
6. **defer/manual resolution**.

`P2 availability != permission to forget P1 ambiguity`.

## 12. Settlement evidence composition is not majority voting

Different evidence sources can disagree:

```text
P1 callback absent
local timeout observed
bank ledger shows debit
provider search heuristic shows no match
```

The correct result is not `3 vs 1 -> NOT_COMMITTED`.

Candidate rule:

`evidence disagreement is resolved by semantic authority/completeness, not source count`.

A single commitment-adjacent authoritative record may dominate many weak negative observations. Conversely, an authentic but pre-commit provider receipt may not dominate a target ledger proving no committed state transition.

Conflicting high-authority evidence yields `CONTESTED` and reconciliation, not silent selection.

## 13. Currentness and retention of settlement evidence

Settlement evidence has lifecycle semantics:

- a terminal immutable receipt may remain historically valid indefinitely;
- a provider query result saying `pending` becomes stale;
- a negative reconciliation result is bounded by its coverage interval;
- a dedup record expires independently of historical settlement;
- a reversal/chargeback can change business disposition after an earlier successful payment;
- local compaction cannot discard unresolved effect lineage merely because transport retention expired.

Candidate rule:

`historical occurrence evidence may be durable while current business disposition continues to evolve`.

This is why `COMMITTED`, `SETTLED`, `REVERSED`, `COMPENSATED`, and `FINAL_FOR_INVARIANT_X` may need separate semantics rather than one boolean success.

## 14. Reconciliation matching must preserve ambiguity

Where no stable cross-provider effect ID exists, reconciliation may use amount, account, time, reference, beneficiary, artifact hash, or other attributes. Such matching can be non-unique.

Candidate dispositions:

- `MATCH_EXACT_QUALIFIED`;
- `MATCH_UNIQUE_WITHIN_CLOSED_SCOPE`;
- `MATCH_AMBIGUOUS`;
- `NO_MATCH_IN_CLOSED_SCOPE`;
- `NO_MATCH_IN_OPEN_SCOPE`;
- `CONFLICTED`.

Only a qualified closed scope can turn `NO_MATCH` into negative settlement evidence.

`heuristic match confidence != semantic proof probability`.

AI may assist reconciliation search/ranking but `AI inference != authority` remains absolute.

## 15. Exchange Plane boundary

The Exchange Plane may carry:

- `EffectIdentityRef` and attempt/admission lineage;
- provider receipt/status evidence with exact semantics;
- witness/reconciliation references;
- completeness/currentness/coverage metadata;
- duplicate-effect/fence/right evidence;
- settlement disposition and conflicts.

It does not:

- own the canonical payment/order/business ledger;
- choose compensation policy;
- declare a weak witness authoritative;
- convert missing evidence to non-occurrence;
- coordinate a global transaction across providers;
- require all client runtimes to contact Builder for settlement.

`Exchange Plane preserves settlement evidence semantics; capability owns business settlement semantics`.

## 16. Autonomous-runtime implications

Published runtimes must remain able to handle settlement from locally sufficient evidence while Builder is unavailable.

Candidate local closure can include:

- durable unresolved-effect frontier;
- stable effect/attempt/admission lineage;
- locally cached immutable receipts/witnesses;
- target-side fences or conserved-right state;
- provider-specific query/reconciliation adapters when locally available;
- monotonic effect/revocation/fencing floors;
- explicit offline/currentness horizons.

Builder/central services may improve observability or reconciliation throughput but do not become mandatory online settlement oracles.

## 17. Candidate settlement dispositions

Research vocabulary, not runtime enums:

- `EFFECT_NOT_STARTED_PROVEN`;
- `EFFECT_REJECTED_BEFORE_COMMIT_PROVEN`;
- `EFFECT_COMMITTED_PROVEN`;
- `EFFECT_SETTLED_PROVEN`;
- `EFFECT_REVERSED_PROVEN`;
- `EFFECT_COMPENSATED_PROVEN`;
- `EFFECT_ABSENT_IN_CLOSED_SCOPE`;
- `EFFECT_OBSERVED_PARTIAL`;
- `EFFECT_UNKNOWN`;
- `EFFECT_CONTESTED`;
- `EFFECT_INCOMPATIBLE_TO_AUTOMATIC_READMISSION`.

These deliberately distinguish historical occurrence from later business remediation.

## 18. Candidate proof obligations

1. Timeout, disconnect, provider outage, missing ACK or missing webhook never imply `NOT_COMMITTED` by themselves.
2. `NO_EVIDENCE` remains distinct from `NOT_COMMITTED`.
3. Negative settlement evidence names a closed observation/commitment scope and proves its completeness.
4. Positive evidence is bound to the exact protected effect or remains partial.
5. Provider receipt semantics are preserved; `accepted/authorized/captured/settled/delivered` are not normalized into one success state.
6. Provider query authority is operation/effect scoped rather than provider-global.
7. Search/index absence is not negative proof without namespace/indexing/currentness completeness.
8. Missing webhook is not non-occurrence unless bounded complete delivery is contractually proven.
9. Duplicate webhook/event delivery is not duplicate business effect by itself.
10. Commitment-adjacent target evidence identifies the atomicity/coupling relation to the protected effect.
11. A log emitted before commit cannot prove commit.
12. An asynchronously emitted audit event cannot prove atomic coupling without contract evidence.
13. Conserved-right transfer proves future authority/exclusion only to the extent declared; it does not erase historical effect ambiguity.
14. Witness independence/correlation assumptions are explicit.
15. Multiple correlated witnesses cannot be counted as independent settlement proof.
16. Witness occurrence evidence does not imply uniqueness unless separately proven.
17. Reconciliation evidence declares coverage interval, effect namespace, matching rule and completeness semantics.
18. Heuristic matching preserves ambiguity rather than fabricating exact identity.
19. `NO_MATCH` becomes negative evidence only inside a proven closed scope.
20. Cross-provider re-admission preserves P1 ambiguity until settlement/exclusion/duplicate-tolerance proof resolves it.
21. P2 availability or fresh authority never resets P1 effect history.
22. Provider-local idempotency/dedup expiry cannot be used as settlement evidence.
23. Shared target-side dedup/fencing must cover both predecessor and successor providers/effect paths.
24. Structural proof that T1 never reached commitment names every material commitment path or a universal target-side exclusion invariant.
25. Evidence conflict is resolved by semantic authority/completeness, not source majority.
26. Conflicting high-authority evidence yields `CONTESTED` rather than silent winner selection.
27. Compensation remains a new forward effect with its own lineage; it does not rewrite predecessor occurrence.
28. Reversal/chargeback/remediation remains distinguishable from historical commit.
29. Settlement currentness and historical occurrence validity are modeled separately where business disposition can evolve.
30. Unresolved external effects survive queue/message/log retention and proof compaction.
31. Restore/rollback cannot resurrect an older `UNKNOWN`/absence claim over a locally known committed/settled effect floor.
32. Exchange Plane transports/verifies settlement evidence but does not own canonical business settlement.
33. Capability owns duplicate tolerance, compensation and final business reconciliation law.
34. AI-assisted reconciliation cannot become settlement authority.
35. Autonomous runtime can settle from locally sufficient evidence without Builder availability.
36. Unsupported/opaque provider settlement semantics yield `UNKNOWN/PARTIAL/INCOMPATIBLE`, never fabricated equivalence.
37. A provider status surface is not assumed authoritative beyond its documented lifecycle stage.
38. External downstream evidence cannot be attributed to the wrong attempt/authority merely because it arrived later.
39. Late evidence updates disposition monotonically where justified without rewriting historical provenance.
40. Cross-provider evidence composition preserves each source's trust domain, scope and currentness rather than creating a synthetic global revision.

## 19. Adversarial cases

1. P1 charges successfully, response is lost, and failover blindly charges through P2.
2. No P1 webhook arrives, so the system marks the payment failed; webhook arrives hours later.
3. Webhook is delivered twice and is mistaken for two payments.
4. P1 says `Received`; adapter maps it to `COMMITTED`.
5. P1 says `Authorized`; business treats it as final settlement despite later reversal.
6. Local trace lacks ACK and is used as proof of no remote commit.
7. Broad provider search by amount/time returns no row because indexing lags.
8. Broad search returns two plausible rows and adapter chooses one by timestamp proximity.
9. Target audit log is emitted before durable commit and is treated as commitment proof.
10. Audit log is emitted after commit but can be lost; its absence is treated as no commit.
11. Reconciliation file covers only one region/account but is treated as provider-global.
12. Reconciliation file is complete for capture but not downstream fulfillment.
13. Bank ledger shows debit but system assumes this proves exactly one charge.
14. Two witnesses both derive from the same provider webhook and are counted as independent.
15. Conserved right moves to P2, but P1 had already committed before losing the right.
16. Fence blocks future P1 commits but history is rewritten as if P1 never committed.
17. Dedup window expires and absence of dedup record is treated as no prior effect.
18. Queue retention expires while unresolved external effect still exists.
19. DLQ deletion is treated as business-effect cancellation.
20. P2 uses fresh authority and same textual idempotency key, but no shared effect-side dedup exists.
21. Compensation/refund succeeds and original charge is erased from historical evidence.
22. Refund itself is retried ambiguously and creates a second unresolved effect lineage.
23. Provider terminal status is cached forever although later reversal/chargeback semantics exist.
24. Immutable historical receipt is discarded because current provider API no longer returns the record.
25. Local snapshot restore predates known settlement evidence and reopens a successor attempt.
26. `NO_MATCH` from an open-world witness set is converted to `NOT_COMMITTED`.
27. AI reconciliation assigns a likely provider row and the probability is treated as proof.
28. Majority of weak sources says absent while one authoritative target ledger proves commit.
29. Two high-authority sources conflict and the newer timestamp is chosen automatically.
30. Wall-clock order is used to attribute a late receipt to the successor attempt.
31. Provider status lookup proves authorization but not capture; adapter labels effect settled.
32. Target state proves object write but not external notification/payment coupled to it.
33. One provider exposes exact lookup; driver assumes every provider implementation has equivalent settlement semantics.
34. Builder outage prevents a runtime from using locally sufficient target-side settlement evidence.
35. Exchange Plane accumulates canonical payment state and becomes transaction coordinator/business owner.
36. Central reconciliation service outage blocks unrelated runtime-local safe effects.
37. Cross-provider reconciliation merges tenant/classification scopes and leaks evidence.
38. Provider report is authentic but its completeness interval excludes the ambiguous attempt.
39. Late negative evidence overwrites a stronger monotonic committed-effect floor.
40. Provider callback signature is valid but callback semantics are only `accepted`, not `effect committed`.

## 20. Portability / exit path

Portable G4 semantics should be expressed as proof obligations and qualified evidence relations rather than provider-specific status names.

Provider-native exact lookup, idempotency, webhooks and reconciliation files are optimizations/evidence sources. A provider can be replaced when the successor path can satisfy the required settlement/effect-safety vector through another mechanism.

This preserves:

`provider feature != portable semantic primitive`.

`receipt format != settlement semantics`.

`provider exit != permission to forget unresolved predecessor effects`.

## 21. Deduplication against existing G4 research

This round does **not** reopen:

- generic retry/idempotency semantics;
- authority re-parenting/readmission lineage;
- generic Saga/compensation research;
- broker exactly-once semantics;
- generic evidence federation/witness governance;
- route/source completeness;
- split-brain/DR reconciliation;
- generic data lineage.

Material delta is narrower:

```text
re-admission with predecessor UNKNOWN
 -> provider has no authoritative settlement query
 -> classify evidence by effect-coupling/completeness
 -> positive/negative evidence asymmetry
 -> closed-world proof for NOT_COMMITTED
 -> target/witness/reconciliation/conserved-right alternatives
 -> cross-provider successor safety without a transaction coordinator
```

## 22. Maturity and next gap

Maturity: `RESEARCH_ACTIVE / NON_EXECUTABLE`; material delta found; not saturated.

The next highest-value gap is **settlement finality under reversals, chargebacks, asynchronous rejection and long-tail remediation**: determine how an effect can be `COMMITTED` or operationally `SETTLED` at one layer while remaining economically/business-reversible at another, how finality horizons should be represented without indefinite blocking, and which guarantees may rely on provisional settlement versus irreversible/final settlement. This should remain distinct from provider payment semantics and from generic workflow completion.
