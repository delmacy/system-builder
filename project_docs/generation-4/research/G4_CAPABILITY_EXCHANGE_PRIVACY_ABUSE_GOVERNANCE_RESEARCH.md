# G4 — Privacy-Preserving Abuse, Rate & Cost Governance at Capability Boundaries

Status: `RESEARCH_ACTIVE / NON_EXECUTABLE`
Execution authority: NONE
Date: 2026-09-19
Parent family: Shared Semantic Kernel / Capability Exchange Plane / Inter-Capability Boundary Model

## Purpose

Deepen the existing privacy/collusion research by asking how rate limits, quotas, replay defense, cost budgets, backpressure and abuse controls can remain enforceable when cross-capability identifiers are deliberately pairwise, ephemeral or unlinkable.

This is not a new macro-family and does not select Privacy Pass, ARC, anonymous credentials, a rate limiter, broker, gateway, identity system or provider.

## Evidence classes reviewed

- IETF RFC 9576 Privacy Pass Architecture: privacy-preserving authorization, one-time redemption, anonymity-set partitioning, deployment/collusion considerations, issuance rate limiting and token-hoarding risks.
- IETF work-in-progress `draft-yun-privacypass-arc-01`: Anonymous Rate-Limited Credentials, fixed presentation limits, evolving presentation state, contextual binding and explicit double-spend tag checks. This is evidence of a mechanism class, not a stable standard or adoption candidate.
- Mature operational rate limiting patterns: request/session/account/IP-based counting demonstrates the governance need but also why naive stable identifiers widen correlation.
- Existing G4 purpose-bounded linkability, collusion/metadata, reservation/escrow, hierarchical rights, currentness and evidence findings.

## 1. Privacy does not imply unmeterability

The false dichotomy is:

```text
stable global identity OR no enforceable quota
```

Privacy-preserving authorization systems demonstrate a third class: bounded spend/redeem rights can be issued after qualification and later consumed without revealing a stable subject identity at every effect boundary.

Candidate invariant:

```text
Accountability for bounded resource consumption
!= global subject linkability
```

This does not mean every abuse policy can be made anonymous. Some fraud decisions genuinely require longitudinal identity or device evidence. The requirement is to prove that broader correlation is necessary for the policy rather than introducing it because counters are convenient.

## 2. Separate admission identity from spend identity

A capability may need to know that an actor is entitled to a budget without every downstream provider learning who that actor is.

Research vocabulary:

```text
BudgetGrant
  grantScope
  resourceClass
  amount / presentationLimit
  validityHorizon
  issuer/authority basis
  spendContext
  replay/double-spend profile
  revocation/currentness profile
  evidence policy
```

The grant is not a business entity and does not transfer ownership to the Exchange Plane.

Candidate rule:

```text
Entitlement qualification identity
!= per-effect correlation identity
```

An issuer/attester may know more during admission than an origin/provider needs during spend. Conversely, if issuer and spender collude, the privacy profile must state whether linkage remains protected or collapses.

## 3. Budgeted unlinkability is not unlimited anonymity

Privacy Pass and ARC-like work demonstrate that unlinkable presentations can coexist with bounded issuance/presentation counts. The important principle is that privacy can be bounded by a scarce capability/right rather than a stable identity at every request.

Candidate boundary:

```text
Unlinkable presentations
!= unlimited presentations
```

But the budget itself can become a fingerprint. A unique limit, validity interval, issuer key, resource class or redemption context can partition an anonymity set.

Therefore:

```text
Budget metadata
is part of the correlation budget
```

A privacy profile must evaluate whether a rare quota such as `137 requests / 43 minutes` becomes effectively identifying.

## 4. Replay defense and rate governance are different proof domains

One-time redemption or double-spend detection can prove that the same spend right is not reused. It does not prove that a subject did not obtain multiple independent grants.

```text
No token replay
!= no Sybil/grant multiplication
```

Issuance/admission therefore owns a separate obligation: bound how many rights can be created for the qualified principal/context. Redemption owns spend uniqueness within the declared scope.

Likewise:

```text
Rate limit satisfied
!= business authorization valid
```

A valid budget does not authorize a business effect whose capability authority/currentness checks fail.

## 5. Anonymous budget state can still require bounded state

The ARC draft explicitly retains tags for double-spend checks. This is a useful architectural lesson: privacy-preserving does not mean stateless.

Candidate state classes include:

- spent/nullifier/tag sets scoped to the minimum required context;
- aggregate counters that do not retain subject identity;
- expiring grant frontiers;
- coarse resource-class usage;
- reconciliation evidence for ambiguous spends.

State must have an explicit retention horizon. Retaining every spend tag forever can recreate a long-lived correlation/evidence store even if the tags were initially pseudonymous.

```text
Pseudonymous anti-replay state
!= retention-free state
```

## 6. Rate, quota and cost are not synonyms

A request count is often a poor proxy for operational burden. G4 should preserve distinct dimensions:

```text
rate       = operations / time window
quota      = allowed quantity in a scope/horizon
cost       = qualified resource/economic weight consumed
concurrency = simultaneous admitted work
capacity   = currently available execution resource
```

A privacy-preserving budget may therefore represent weighted units rather than request count. A cheap query and a GPU-heavy analysis must not become semantically equal because both redeem one generic token.

Candidate rule:

```text
One redemption != one equal-cost effect
```

Cost classification remains capability/provider policy; the Exchange Plane may carry/enforce declared exchange budgets but must not invent business pricing or resource semantics.

## 7. Backpressure is not identity punishment

Backpressure protects downstream capacity and can often be applied without identifying a subject globally:

- bounded queues;
- concurrency permits;
- per-binding/provider capacity budgets;
- resource-class admission;
- coarse tenant/capability budgets where contractually allowed;
- explicit retry-after/currentness information.

Candidate boundary:

```text
Backpressure
!= abuse attribution
```

A provider may be overloaded even when no actor is abusive. Conversely, an abusive actor may remain below a single provider's capacity threshold while violating a business/fraud policy.

## 8. Federated budgets require conservation or qualified oversubscription

If an autonomous runtime receives offline spend rights, federation inherits the reservation/escrow obligations already researched by G4.

```text
central budget = 100
runtime A receives 30
runtime B receives 20
```

A and B may spend their qualified local rights while disconnected, but neither may infer or mint the unused global remainder. Transfers, expiry, recovery and UNKNOWN consumption remain conservation problems.

Thus privacy-preserving budget grants must not bypass hierarchical-rights rules merely because the spend tokens are unlinkable.

```text
Anonymous right != unaccounted right
```

## 9. Revocation and dynamic abuse response expose a fundamental trade-off

Pre-issued unlinkable rights improve privacy and disconnected operation but weaken immediate subject-specific revocation: a holder may retain already-issued spend capacity until the grant expires or a target-side mechanism rejects it.

Candidate rule:

```text
Pre-issued privacy-preserving budget
creates a bounded revocation exposure
```

That exposure must be explicit in the contract. Candidate controls include short validity horizons, bounded issuance, online refresh, target-enforced currentness, non-transferable grants, risk-tiered budgets or quarantine. None is universally required.

A system must not claim immediate revocation if already-issued rights remain spendable.

## 10. Cost governance must not become a covert identity graph

A central FinOps/rate service that receives every pairwise reference and maintains a universal reverse map would defeat the privacy architecture while appearing operationally convenient.

Candidate invariant:

```text
Global cost visibility
!= global subject visibility
```

Aggregate cost accounting can be separated from subject-level fraud investigation. Where per-customer billing legally/business-wise requires identity, that identity scope should be explicit and not automatically reused for unrelated cross-capability correlation.

## 11. Escalation should be capability/policy governed

When a privacy-preserving budget is exhausted or abuse is suspected, candidate dispositions include:

```text
REJECT
DEFER / RETRY_AFTER
REQUIRE_FRESH_GRANT
STEP_UP_ATTESTATION
REDUCE_BUDGET
QUARANTINE
MANUAL_REVIEW
```

The Exchange Plane can transport/enforce a declared disposition. It must not decide that a suspicious pattern changes business authority or ownership.

`STEP_UP_ATTESTATION` is particularly important: stronger identification may be justified for a high-risk action, but it is an explicit privacy transition rather than a silent enrichment of every request.

## 12. Candidate governance profile

Research vocabulary only:

```text
AbuseGovernanceProfile
  resourceClass
  rateWindow
  quotaHorizon
  weightedCostModelRef
  concurrencyBudget
  issuance/admissionScope
  spendScope
  dedupScope
  correlationScope
  offlineSpendAllowance
  revocationExposure
  antiReplayProfile
  doubleSpendProfile
  backpressureDisposition
  escalationPolicyRef
  evidenceRetention
  residualPrivacyLeakage
```

This is not a schema proposal. It identifies proof dimensions that a future contract may need.

## 13. Proof obligations

Before implementation planning, prove or explicitly bound:

1. rate/quota/cost enforcement does not require a correlation scope wider than declared;
2. unlinkable/pairwise presentations cannot mint additional budget merely by rotating identifiers;
3. issuance limits and redemption/double-spend limits are separate and both qualified where required;
4. anti-replay state is scoped and retained no longer than its proof horizon requires;
5. budget metadata does not silently collapse the claimed anonymity set;
6. a spend right does not substitute for business authorization/currentness;
7. weighted cost semantics are capability/provider qualified rather than fabricated by the corridor;
8. offline/federated rights conserve the admitted budget or declare bounded oversubscription explicitly;
9. ambiguous spend remains UNKNOWN/consumed-conservatively rather than becoming free capacity;
10. pre-issued rights have an explicit revocation-exposure horizon;
11. provider failover cannot reset counters or create fresh spend rights for the same obligation;
12. retries do not consume multiple units unless the contract intentionally prices attempts rather than effects;
13. failed/UNKNOWN effects state whether budget is consumed, reserved, refundable or reconciliation-required;
14. backpressure is not misrepresented as fraud/identity evidence;
15. step-up identification is an explicit governed privacy transition;
16. cost/FinOps aggregation does not require a universal subject reverse map unless explicitly authorized;
17. observability, dead-letter and abuse analytics obey the same retention/correlation profile;
18. provider replacement can report `INCOMPATIBLE` when it cannot preserve privacy plus governance guarantees;
19. privacy controls cannot be bypassed by obtaining multiple grants through parallel issuers/attesters unless cross-issuer oversubscription is intentionally allowed;
20. the runtime can enforce its locally delegated budget without live Builder dependency when the topology promises offline autonomy.

## 14. Adversarial cases

1. A client rotates pairwise IDs on every request and bypasses a counter keyed only by identifier.
2. Replay protection works, but the client obtains ten independent grants from parallel issuers.
3. A unique quota value fingerprints one tenant despite unlinkable tokens.
4. A stable issuer key partitions the anonymity set to one deployment.
5. A provider counts attempts while the capability contract budgets authoritative effects, charging retries multiple times.
6. An UNKNOWN provider timeout refunds the token immediately; the original effect later succeeds.
7. A failed request consumes the budget forever even though the contract promised effect-based accounting.
8. Provider failover starts a fresh rate bucket and doubles allowed spend.
9. Two autonomous runtimes each assume they own the full global quota while partitioned.
10. A runtime exhausts local rights and mints new pseudonymous grants because the central allocator is unavailable.
11. Anti-replay tags are retained indefinitely and become a durable behavioral fingerprint store.
12. FinOps joins pairwise refs across tenants into a global identity graph for convenience.
13. Abuse analytics exports raw network/trace metadata and defeats the declared correlation budget.
14. A malicious origin chooses unusual rate-limit metadata to tag a client across presentations.
15. A client hoards pre-issued rights and spends them after the subject has been revoked.
16. Short expiry improves revocation but makes offline operation impossible despite a declared autonomy profile.
17. Backpressure rejection is interpreted by another capability as proof that the actor is malicious.
18. A privacy mediator becomes the only service capable of mapping every grant to every subject.
19. Cost weighting changes between versions and in-flight grants are silently reinterpreted under the new model.
20. A broker retry consumes another anonymous token and converts transport instability into quota exhaustion.

## 15. Portability / exit path

Portable semantics are the budget/resource class, issuance/admission scope, spend scope, weighted-cost meaning, rate/quota/concurrency horizons, offline allowance, revocation exposure, anti-replay/double-spend guarantee, backpressure disposition, correlation/dedup limits, evidence horizon and ambiguity treatment.

Privacy Pass, ARC/ACT, blind signatures, anonymous credentials, token formats, Redis-like counters, gateway rate limiters, brokers and cloud products remain realization details. A replacement must be able to declare `INCOMPATIBLE` rather than widening identity/correlation or weakening budget conservation silently.

## 16. Deduplication against existing G4 research

This round does not reopen identity architecture, commercial metering, generic FinOps, reservation/escrow, authorization or privacy fundamentals. It connects existing purpose-bounded privacy with exchange-boundary resource governance.

Materially new boundaries:

```text
Accountability for bounded resource consumption != global subject linkability
Unlinkable presentations != unlimited presentations
No token replay != no Sybil/grant multiplication
Budget metadata is part of the correlation budget
Backpressure != abuse attribution
Anonymous right != unaccounted right
Pre-issued privacy-preserving budget creates bounded revocation exposure
Global cost visibility != global subject visibility
```

## 17. Maturity and next gap

Material delta exists. Family 8 remains `RESEARCH_ACTIVE / NON_EXECUTABLE` and is not saturated.

The next highest-value gap is **cross-issuer/federated anonymous budget conservation and Sybil resistance**: determine how multiple autonomous issuers/attesters can grant privacy-preserving spend rights against a shared or overlapping budget without creating a global identity graph, double issuance, central online dependency or false equivalence between issuer trust domains. This should include issuer compromise, partitioned issuance, budget transfer/rebalancing, revocation/currentness, recovery after ambiguous issuance, and whether some global quotas are fundamentally incompatible with strong unlinkability plus offline multi-issuer autonomy.

No cryptosuite, anonymous credential, rate limiter, identity framework, counter store, broker, gateway or provider is selected.