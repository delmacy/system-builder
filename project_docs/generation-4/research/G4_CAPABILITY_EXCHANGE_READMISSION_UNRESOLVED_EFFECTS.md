# G4 Capability Exchange — Re-admission Proof for Unresolved Effects

Status: `RESEARCH_ACTIVE / NON_EXECUTABLE`
Date: 2026-09-22
Family: Shared Semantic Kernel / Capability Exchange Plane / Inter-Capability Boundary Model

> Research candidate != implementation authority. This document does not select a broker, workflow engine, API gateway, idempotency store, transaction coordinator, provider, or protocol. It does not reopen G3 and does not authorize product work.

## 1. Research question

Prior G4 research established that authority re-parenting cannot launder historical admission lineage: a new authority edge may authorize future admission but does not retroactively authorize old queued/retrying work. The remaining gap is the hard case where old work is eligible for explicit re-admission but an earlier effect attempt is unresolved (`UNKNOWN` / possibly committed).

Core finding:

`new authority valid + old attempt UNKNOWN != safe re-admission`.

Re-admission requires a proof bundle showing that a successor attempt cannot create an inadmissible second effect, or that the protected business invariant explicitly tolerates/repairs that multiplicity.

Equally:

`idempotency advertised != duplicate-effect safety proven`.

Idempotency is scoped by provider operation, key namespace, parameter equivalence, retention horizon, region/resource scope, and the provider's actual commitment semantics.

## 2. Evidence reviewed

Primary documentation and mature operational guidance:

- AWS EC2 idempotency documents client-token based requests: retrying the same successful request with the same token and parameters avoids an additional action, while parameter mismatch is rejected. AWS also distinguishes regional and zonal idempotency scopes for some operations. <https://docs.aws.amazon.com/ec2/latest/devguide/ec2-api-idempotency.html>
- AWS ECS similarly scopes `RunTask` idempotency to a cluster; the same client token in another cluster is a separate request. <https://docs.aws.amazon.com/AmazonECS/latest/developerguide/ECS_Idempotency.html>
- Stripe idempotency stores a result after endpoint execution begins, compares parameters on reuse, and permits pruning keys after at least 24 hours; reuse after pruning creates a new request. <https://docs.stripe.com/api/idempotent_requests>
- Google Cloud Storage distinguishes always-idempotent, conditionally-idempotent and never-idempotent operations. Preconditions such as generation/metageneration matching can make otherwise unsafe mutations conditionally safe to retry. <https://cloud.google.com/storage/docs/retry-strategy>
- Google Cloud Pub/Sub documents at-least-once delivery by default and warns that a message can be redelivered even after an acknowledgment request returns successfully; exactly-once delivery is scoped to qualifying subscriber/region behavior and does not make duplicate publications the same message. <https://cloud.google.com/pubsub/docs/subscription-overview> and <https://cloud.google.com/pubsub/docs/exactly-once-delivery>
- Azure retry guidance explicitly calls out the ambiguous case where a service processes a request successfully but the response fails; blindly retrying a non-idempotent operation can execute the effect twice. <https://learn.microsoft.com/azure/architecture/patterns/retry>

These systems are benchmarks only; none is selected.

## 3. Re-admission is a new authorization decision over an old effect lineage

Suppose occurrence Q was admitted under authority lineage L1, attempt T1 was sent, and the result is unknown. L1 is then revoked or superseded and Q becomes eligible for authority lineage L2.

A safe model is not:

`Q + L2 -> retry`.

Instead:

```text
Occurrence Q
  EffectIdentity E
  Admission A1 / Authority L1
    Attempt T1 -> UNKNOWN
  ReAdmission R1
    Admission A2 / Authority L2
    successor attempt T2 only if effect-safety proof permits
```

Candidate invariant:

`re-admission changes admission authority; it does not reset effect history`.

The stable effect identity and unresolved predecessor attempt remain part of the successor proof context.

## 4. Minimal candidate re-admission proof bundle

A research-level `ReAdmissionProofBundle` needs at least independently qualified evidence for:

1. **Occurrence continuity** — successor work is explicitly related to the prior occurrence rather than silently recreated.
2. **Stable effect identity** — the protected effect has an identity that survives authority/provider/transport change where deduplication or settlement depends on it.
3. **Prior attempt disposition** — `NOT_STARTED`, `REJECTED_BEFORE_COMMIT`, `COMMITTED`, `UNKNOWN/POSSIBLY_COMMITTED`, or another contract-qualified state; transport timeout is not a business disposition.
4. **Successor authority/currentness** — fresh authority under the new lineage for this effect/resource/tenant/classification context.
5. **Duplicate-effect control** — provider idempotency, target deduplication, fencing, conditional mutation/precondition, reservation/escrow, or another invariant-qualified mechanism.
6. **Scope binding** — exact operation, resource, provider/account/region/cluster, parameter equivalence, semantic profile and key namespace covered by the duplicate-effect mechanism.
7. **Retention/currentness horizon** — proof that the dedup/idempotency/fence record still exists and is authoritative for the entire retry/re-admission window.
8. **Settlement evidence** — how a late result from T1 and a result from T2 are reconciled without relabeling history.
9. **Failure behavior** — what happens when duplicate-effect evidence is unavailable, expired, contradictory or provider-scoped differently.

No single field above is implementation authority or an approved schema.

## 5. Provider idempotency is scoped, not a universal semantic primitive

AWS EC2 client-token behavior shows a mature pattern: same token plus same parameters can suppress duplicate action, while changed parameters are rejected. But AWS also documents regional/zonal scope distinctions. ECS makes the point even more directly: `RunTask` idempotency is cluster-scoped.

Universal lesson:

`same idempotency key outside its qualified scope != same effect`.

Therefore re-admission across provider, account, region, cluster, resource or API-operation boundaries must not inherit an idempotency proof merely because the string key is preserved.

Candidate `IdempotencyScopeRef` dimensions include:

- provider/contract profile;
- operation/effect kind;
- resource/effect target;
- account/tenant/project/cluster/region where material;
- key namespace and parameter-equivalence rule;
- retention horizon;
- result replay semantics;
- semantic generation/currentness constraints.

## 6. Retention horizon is part of safety

Stripe's documented behavior is a strong adversarial: an idempotency key may be pruned after at least 24 hours, after which reuse creates a new request.

Thus:

`stable key identity != indefinitely retained duplicate suppression`.

A queued item can outlive the provider's idempotency record. A G4 re-admission proof must therefore carry or derive a `DedupRetentionHorizonRef` rather than assuming permanent provider memory.

If the prior attempt remains `UNKNOWN` after the provider's duplicate-suppression horizon has expired, re-admission cannot be classified safe merely by resending the same key.

## 7. Conditional idempotency is stronger than blind retry but narrower than effect settlement

Google Cloud Storage documents mutations that are conditionally idempotent only when generation/metageneration/ETag-like preconditions are supplied.

This supports:

`precondition can turn state transition into one-success transition`.

But it does not prove every external business effect is settled. A conditional write can safely avoid overwriting a changed object while a separate payment, email, physical action or provider side effect remains unresolved.

Candidate rule:

`resource-state precondition != external-effect settlement unless the contract binds them atomically`.

## 8. Exactly-once delivery is not exactly-once business effect

Google Pub/Sub documents at-least-once delivery by default, possible redelivery, and exactly-once delivery with explicit scope limitations. It also states that duplicate publications are distinct messages even when exactly-once delivery is enabled.

Therefore:

`exactly-once delivery != exactly-once publication != exactly-once business effect`.

A broker delivery guarantee can contribute evidence to the proof bundle but cannot replace target/effect idempotency or settlement when the business effect occurs outside the broker's atomic boundary.

## 9. Ambiguous timeout is the canonical hard case

Azure retry guidance captures the central ambiguity: the service may have processed the request successfully while the response was lost.

For G4:

`timeout/disconnect != NOT_COMMITTED`.

When T1 is `UNKNOWN/POSSIBLY_COMMITTED`, safe successor behavior falls into a small number of technology-independent classes:

- **query/reconcile first** — obtain authoritative effect disposition before a new attempt;
- **same-effect dedup retry** — retry only inside a qualified idempotency/dedup scope and horizon;
- **fenced successor** — new attempt is accepted only if target-side generation/fence proves T1 cannot still commit incompatibly;
- **conditional transition** — successor uses an authoritative state/version precondition that permits at most one valid transition;
- **reservation/right transfer** — successor consumes the same conserved right under invariant-qualified exclusion;
- **manual/compensating resolution** — where the effect cannot be safely duplicated or automatically fenced;
- **defer/UNKNOWN** — preserve ambiguity rather than manufacture permission.

## 10. Re-admission is not transaction coordination

The Exchange Plane does not need to become a distributed transaction coordinator.

Candidate boundary:

`Exchange Plane preserves proof context; capability/target contract defines effect safety`.

The plane may transport occurrence/effect identity, old/new admission lineage, prior-attempt evidence, idempotency/fencing/settlement refs and dispositions. It does not decide business compensation, own the canonical payment/order state, or fabricate atomicity across providers.

This preserves:

`Logical Exchange Plane != single broker`.

`Exchange Plane owns exchange semantics; capability owns business semantics`.

## 11. Cross-provider re-admission

The hardest transition is:

```text
T1 -> provider P1 -> UNKNOWN
re-parent / failover
T2 -> provider P2
```

Even if P1 and P2 both advertise idempotency, their key stores are normally independent.

`P1 idempotent + P2 idempotent != cross-provider duplicate suppression`.

Safe cross-provider re-admission therefore needs one of:

- shared effect-side fence/dedup authority independent of both providers;
- authoritative settlement from P1 before P2 commits;
- conserved right/reservation transferred with proof that P1 lost effect capability;
- business semantics that tolerate and reconcile duplicates explicitly;
- no automatic re-admission.

This is an exit-path/portability issue: provider-native idempotency can optimize a provider-local path but must not be promoted into a portable semantic guarantee it does not possess.

## 12. Late completion after re-admission

T1 may complete after T2 has been admitted or committed.

Candidate rule:

`late predecessor completion is evidence about E, not a new occurrence`.

If both effects are possible, the system records a conflict/duplicate-effect disposition and invokes the capability's reconciliation law. It must not delete T1 from history or relabel it under L2.

Likewise:

`ACK observed under new authority != effect caused by new authority`.

Causation follows preserved attempt/admission lineage.

## 13. Idempotency key and effect identity are not synonyms

An idempotency key is a mechanism-specific handle. Effect identity is the semantic identity of the protected effect.

One effect may require different provider keys across adapters/providers; conversely, accidental key reuse can refer to semantically different requests and must be rejected.

Candidate relation:

`EffectIdentityRef -> ProviderIdempotencyBindingRef(provider, operation, key, scope, horizon, parameterDigest)`.

This preserves provider replaceability without pretending keys are globally meaningful.

## 14. Authority re-admission and parameter drift

AWS and Stripe both reject or protect against reuse of an idempotency key with changed parameters.

G4 should generalize this as:

`same effect identity + materially changed effect parameters != transparent retry`.

A material change can require a new effect/admission identity or an explicit semantic amendment contract. Authority refresh does not grant permission to mutate amount, resource, recipient, tenant, classification or other effect-defining parameters under an old dedup identity.

## 15. Candidate dispositions

For an unresolved old effect considered for re-admission:

- `READMISSION_SAFE_SAME_EFFECT` — qualified duplicate-effect control remains valid;
- `READMISSION_SAFE_AFTER_SETTLEMENT` — predecessor settled as non-effect/terminal and successor authority is valid;
- `READMISSION_SAFE_WITH_FENCE` — successor has proof that incompatible predecessor effect can no longer commit;
- `READMISSION_BUSINESS_RECONCILABLE` — duplicates are possible but explicitly tolerated/reconciled by capability contract;
- `READMISSION_DEFERRED` — evidence insufficient but recoverable;
- `READMISSION_UNKNOWN` — disposition cannot currently be proven;
- `READMISSION_INCOMPATIBLE` — no safe automatic transition exists.

These are research vocabulary, not runtime enums.

## 16. Candidate proof obligations

1. Re-admission preserves original occurrence and prior attempt lineage.
2. A new authority lineage never rewrites the authority under which a prior attempt occurred.
3. `UNKNOWN` prior effect is never normalized to `NOT_COMMITTED` because of timeout, disconnect, failover or authority replacement.
4. Stable effect identity survives a successor admission when duplicate suppression/settlement relies on continuity.
5. Provider idempotency evidence is bound to its actual operation/resource/account/region/cluster/key namespace scope.
6. Idempotency retention/currentness horizon covers the successor attempt or the proof degrades.
7. Reuse of a provider idempotency key after its retention horizon is not assumed safe.
8. Material parameter change cannot silently reuse an old effect/idempotency identity.
9. Conditional idempotency/precondition evidence names the state/version predicate it protects.
10. Resource precondition is not promoted to external-effect settlement without an atomicity proof.
11. Broker exactly-once delivery is not promoted to exactly-once business effect.
12. Duplicate publications remain distinct unless a higher-level stable effect identity explicitly relates them.
13. Retry/redelivery does not create fresh business authority.
14. Re-admission obtains current successor authority independently of duplicate-effect evidence.
15. Current successor authority does not itself prove the predecessor effect absent.
16. Cross-provider idempotency is not inferred from independent provider-local idempotency mechanisms.
17. Cross-provider re-admission requires settlement, shared effect-side exclusion, conserved-right transfer, explicit duplicate-tolerant semantics, or deferral.
18. Late predecessor completion remains attached to predecessor attempt/admission lineage.
19. Settlement after re-admission reconciles all known attempts for the same effect identity.
20. A late ACK cannot relabel the causing authority lineage based on current route/credential state.
21. Dedup/fence evidence is itself currentness- and provenance-qualified.
22. Restore/rollback cannot resurrect a dedup state older than a locally known effect/fencing floor.
23. Adapter/driver normalization cannot fabricate an idempotency scope larger than the provider contract.
24. Same API/interface does not imply same duplicate-effect guarantees across providers.
25. If the protected effect is non-fenceable and predecessor settlement is unavailable, automatic re-admission remains explicitly unsafe/unknown unless duplicates are business-tolerated.
26. Re-admission policy is operation/invariant scoped rather than capability-global.
27. Read/query continuation does not grant mutation/effect re-admission automatically.
28. Queue age is compared with dedup/idempotency retention horizon before automatic re-admission.
29. Retry budgets remain end-to-end bounded across old and new admission generations.
30. Re-admission does not reset attempt/cost/time budgets unless the contract explicitly authorizes a new budget.
31. Exchange Plane transports proof context but does not become canonical business-effect owner.
32. Capability owns compensation/reconciliation law for duplicate or conflicting effects.
33. Offline runtime may re-admit only from locally sufficient authority plus effect-safety evidence within declared horizons.
34. Builder availability is not required for a published runtime to settle or safely retry when its declared local proof bundle is sufficient.
35. Unsupported provider semantics produce explicit incompatibility/unknown rather than fabricated equivalence.
36. Evidence compaction retains enough attempt/effect/admission lineage to decide future re-admission safely.

## 17. Adversarial cases

1. T1 commits but response is lost; L1 is revoked; T2 is blindly sent under L2.
2. Same provider key is reused after provider retention pruning.
3. Same idempotency key is reused in another cluster/region where scope is independent.
4. Adapter assumes provider-local idempotency is globally portable.
5. P1 attempt is unknown; failover to P2 uses the same textual key but P2 has no knowledge of P1.
6. Queue retains work longer than provider dedup horizon.
7. Re-admission changes amount/recipient/resource but keeps old effect identity.
8. Broker exactly-once delivery is treated as exactly-once external payment.
9. Duplicate publish creates two broker message IDs for one intended business effect.
10. Conditional object write succeeds once but external webhook/payment is duplicated.
11. Timeout is converted to `FAILED` despite possible commit.
12. Retry obtains new credential under L2 and loses L1 attempt lineage.
13. Late T1 ACK arrives after T2 success and is discarded as stale noise.
14. Late T1 ACK is incorrectly attributed to L2 because L2 is current.
15. Dedup cache restore predates a known committed effect.
16. Provider changes idempotency retention policy and old proof remains `CURRENT`.
17. Driver reports `supportsIdempotency=true` without operation/scope/horizon qualifiers.
18. Same endpoint exposes two operations with different retry safety but adapter collapses them.
19. Retry budget resets on re-admission, producing unbounded attempts across authority generations.
20. Re-admission creates a new effect ID, defeating target dedup while claiming to be the same operation.
21. Re-admission keeps effect ID when business parameters materially changed.
22. P1 settlement API is stale and reports absent while effect later appears.
23. Target fence is generated but not enforced on one legacy effect path.
24. New provider accepts a conserved-right transfer before old provider is fenced.
25. Capability declares duplicate-tolerant semantics but compensation is unavailable for one irreversible branch.
26. Offline runtime retries after local idempotency evidence horizon expired.
27. Central scanner says provider idempotency current but runtime uses a different region/account scope.
28. Idempotency result replay returns old response but external secondary side effect had not been atomically coupled.
29. Message redelivery after successful ACK causes duplicate effect in a non-idempotent consumer.
30. Exactly-once subscriber guarantee is assumed across multiple regions despite provider scope limits.
31. Adapter changes provider operation during fallback while preserving key and calling it same retry.
32. A manual operator replays UNKNOWN work under L2 without preserving occurrence/effect lineage.
33. Settlement record stores only current authority, erasing predecessor causation.
34. Compaction deletes the parameter digest needed to detect unsafe idempotency-key reuse.
35. `READMISSION_DEFERRED` is operationally treated as permission after timeout.
36. Exchange Plane starts deciding compensation/business winner and becomes accidental workflow/business owner.

## 18. Portability and exit path

Portable semantics should be expressed in terms of effect identity, attempt lineage, qualified duplicate-effect guarantees, currentness horizons and settlement/fencing evidence. Provider-native client tokens, ETags, generations, broker message IDs or dedup stores are bindings/evidence for those claims, not canonical business identity.

A provider can therefore be replaced without rewriting business semantics, but the replacement must requalify provider-specific duplicate-effect guarantees. If no equivalent guarantee exists, the contract must expose mediation, weaker semantics, explicit reconciliation, or incompatibility.

## 19. Shared Semantic Kernel / Exchange Plane implications

Potential structural primitives remain narrow:

- `EffectIdentityRef`;
- `AttemptRef` / `AttemptDispositionRef`;
- `AdmissionLineageRef` / `ReAdmissionRef`;
- `IdempotencyScopeRef`;
- `DedupRetentionHorizonRef`;
- `FenceEvidenceRef`;
- `SettlementEvidenceRef`;
- `ParameterDigestRef`;
- `CurrentnessRef` / `EvidenceRef`.

No payment/order/domain entity belongs in the Shared Semantic Kernel.

The Exchange Plane may preserve these refs across direct calls, RPC, broker, stream, queue or file-mediated exchange. It does not own the protected business effect.

## 20. Maturity and next gap

This closes a material gap between authority re-parenting and effect-safe retry: **explicit re-admission is only safe when authority proof and unresolved-effect safety proof compose without erasing predecessor lineage**.

The family remains `RESEARCH_ACTIVE / NON_EXECUTABLE`.

Highest-value next gap:

**cross-provider settlement evidence when neither provider offers an authoritative query for whether an ambiguous effect committed** — determine when witness evidence, conserved rights, reconciliation records, compensability or target-side receipts can bound `UNKNOWN` without inventing a transaction coordinator or turning absence of observation into proof of non-effect.
