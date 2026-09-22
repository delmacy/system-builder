# G4 Capability Exchange — Finality Rule Evolution and Historical Reinterpretation

Status: `RESEARCH_ACTIVE / NON_EXECUTABLE`
Date: 2026-09-22
Family: Shared Semantic Kernel / Capability Exchange Plane / Inter-Capability Boundary Model

> Research candidate != implementation authority. This document does not select a payment rail, provider, rule engine, ledger, workflow engine, transaction coordinator, gateway, or protocol. It does not reopen G3 and does not authorize product work.

## 1. Research question

Prior G4 research established that settlement finality is effect-, rule-set-, horizon-, and invariant-scoped, and that a later reversal/remediation changes current disposition without rewriting historical occurrence. The next gap is rule evolution itself: what happens when the governing rules change after an effect, decision, settlement observation, or finality decision already occurred?

Core findings:

`rule-set changed != historical proof was wrong`.

`historically valid under R1 != currently sufficient under R2`.

`new rule published != new rule effective for every subject/effect immediately`.

`current rule != applicable rule for every historical occurrence`.

`retroactivity must be explicit evidence, never inferred from version recency`.

The model therefore needs two distinct questions:

1. Was decision D justified at decision time under the rule/evidence context that actually governed it?
2. What disposition or obligation is valid now, after later rule changes, successor rules, transition periods, clarifications, or genuinely retroactive changes?

Those questions may have different answers without contradiction.

## 2. Evidence reviewed

Primary standards/rule documentation and mature operational governance:

- PCI SSC documents explicit transition periods between major PCI DSS versions and future-dated requirements. Requirements designated as future-dated are best practices before their effective date and become applicable when that date arrives. This demonstrates that publication, availability, effective date, and applicability are distinct temporal facts. <https://www.pcisecuritystandards.org/faqs/1176/>
- PCI SSC FAQ 1585 similarly states that future-dated requirements can remain not applicable in assessments before the effective date but must be considered once effective. <https://www.pcisecuritystandards.org/faqs/1585/>
- Nacha publishes rule amendments with explicit effective dates and staged applicability. Its 2026 fraud-monitoring rules used Phase 1 and Phase 2 with different covered populations and dates; the practical Phase 2 date shifted to the next banking day because June 19 was a federal holiday. <https://www.nacha.org/rules/risk-management-topics-fraud-monitoring-phase-1>, <https://www.nacha.org/rules/risk-management-topics-fraud-monitoring-phase-2>
- Nacha's current summary of upcoming changes lists multiple future effective dates rather than treating approval/publication as immediate universal applicability. <https://www.nacha.org/content/summary-upcoming-rule-changes>
- Nacha Operations Bulletin #1-2024 documents an already-approved requirement whose effective date was extended by six months, while another portion of the same rules package retained its earlier effective date. This demonstrates that a rule package/version alone is insufficient to determine applicability; individual provisions may have different temporal activation. <https://www.nacha.org/news/ach-operations-bulletin-1-2024-changes-upcoming-rules-effective-dates>
- Nacha's 2021 reversals rule changed permissible reversal reasons while explicitly retaining the existing five-banking-day timing requirement. This is a useful example of partial semantic change: one dimension of a rule evolves while another remains stable. <https://www.nacha.org/rules/reversals-and-enforcement>

These sources are benchmarks for temporal governance. G4 must not encode PCI/Nacha-specific business rules as universal semantics.

## 3. Rule identity is not enough; applicability is a qualified relation

A bare `RuleSetVersion = R2` cannot answer whether R2 governs effect E or decision D.

Candidate distinction:

```text
RuleSetRef
RuleProvisionRef
PublishedAt
EffectiveFrom / EffectiveUntil
ApplicabilityPredicate
JurisdictionOrDomainRef (when material)
Subject/operation/effect scope
TransitionPolicyRef
RetroactivitySemantics
SupersedesRef / ClarifiesRef / AmendsRef
EvidenceCurrentness
```

Candidate rule:

`latest rule-set != applicable rule-set`.

Applicability can depend on effect time, settlement time, decision time, party class, transaction class, jurisdiction, amount, provider/scheme, rollout phase, or an explicit transition/grandfathering rule.

The Shared Semantic Kernel may carry qualified references/time/revision/evidence primitives; it must not become the owner of PCI, ACH, payment, legal, or capability-specific applicability logic.

## 4. Four clocks must not be collapsed

At minimum, rule evolution can involve:

- `publication time`: rule text becomes known;
- `effective time`: provision begins to govern its declared scope;
- `occurrence/commitment time`: protected effect happened;
- `decision/evaluation time`: capability relied on evidence to make a decision.

Additional domains may need filing, settlement, discovery, notification, or remediation times.

`published before D != effective for D`.

`effective before current evaluation != necessarily applicable to historical E`.

The PCI future-dated model is a concrete example: a requirement exists in the published standard while remaining future-dated until its activation date.

## 5. Historical proof and current disposition are separate products

Suppose E occurred under R1, and D was legitimately taken from evidence P1 under R1. Later R2 changes the current obligation.

Correct representation:

```text
HistoricalDecisionProof(D):
  applicableRule = R1
  evidence = P1
  decisionTime = t1
  result = JUSTIFIED_UNDER_R1

CurrentDisposition(E, t2):
  applicableRule = R2 or transition(R1,R2)
  evidence = P2
  result = ...
```

not:

```text
rewrite D as if R2 had always governed it
```

Candidate rule:

`historical justification is append-only evidence; current disposition is re-evaluable`.

A later rule can create a new obligation, successor effect, review requirement, reserve, reclassification, or remediation without falsifying the fact that the earlier decision was compliant with the then-applicable rule.

## 6. Retroactivity is a first-class exceptional claim

Some rule changes may genuinely apply to pre-existing facts. G4 cannot assume either universal prospectivity or universal retroactivity.

Candidate rule:

`retroactive(R2, scope S) requires explicit qualified evidence`.

If retroactivity is proven, it changes the current applicability evaluation for affected historical effects. It still does not rewrite which rule was actually used to justify the original decision at t1.

This gives two independent statements:

- `D was justified under R1 at t1`;
- `R2 now imposes obligation O on E despite E predating R2`.

Both can be true.

## 7. Transition periods and staged applicability are semantic, not deployment trivia

PCI DSS transition/future-dated requirements and Nacha phased rules show that coexistence of R1/R2 is normal.

Candidate rule:

`version skew during an authorized transition != incompatibility by itself`.

But a driver/adapter must preserve the applicable transition semantics. It may not map:

`provider reports R2` -> `every historical/current effect governed by R2`.

Nor may it treat two participants using different versions as semantically equivalent unless the interaction contract proves compatibility for the protected invariant.

## 8. Rule amendments can be dimension-selective

The Nacha reversals example changes permissible reversal reasons while retaining the five-banking-day timing rule.

Therefore:

`R2 supersedes R1 != every guarantee dimension changed`.

A useful candidate model is provision/grant-level lineage rather than one opaque whole-rule hash. This supports evidence such as:

- reversal-reason semantics from R2;
- unchanged timing provision carried from R1 lineage;
- transition provision T governing coexistence.

This is not permission to fragment business rules into Shared Kernel entities. It is a research requirement that contract/evidence mapping can identify which guarantee dimensions changed.

## 9. Clarification, amendment, correction, and reinterpretation are not synonyms

A mature governance model needs to distinguish at least:

- editorial/corrective publication with no intended semantic change;
- clarification of existing intended meaning;
- prospective semantic amendment;
- transition/grandfathering change;
- explicit retroactive change;
- external authority reinterpretation that changes current enforcement without changing original text.

Candidate rule:

`new document revision != semantic delta by definition`.

Conversely:

`same textual interface/status vocabulary != unchanged semantic contract`.

Adapters and contract registries need semantic-change evidence, not only schema/text version comparisons.

## 10. Grandfathering is a scoped proof, not immunity by age

A pre-R2 effect may remain governed by R1 only when a transition/grandfathering rule says so.

`effect predates R2 != grandfathered`.

Candidate `GrandfatheringEvidenceRef` needs the protected effect/subject, qualifying cutoff, applicable provision, exclusions, expiry/review conditions, and authority/currentness.

This prevents a runtime from using old evidence indefinitely merely because an occurrence started before a migration.

## 11. Rule-currentness and evidence-currentness are different

A runtime can possess an authentic copy of R1 and still lack evidence about whether R1 remains applicable now.

`rule bytes authentic != applicability current`.

Offline/autonomous runtimes therefore need declared behavior when applicability evidence becomes stale:

- preserve historical decisions and their rule lineage;
- avoid strengthening current-finality claims;
- continue operations whose policy tolerates stale rule-currentness;
- defer operations requiring fresh applicability proof;
- reconcile later without rewriting historical proof.

`offline autonomy != authority to freeze the governing rule forever`.

## 12. Rule change can invalidate a future action without invalidating a past action

Example shape:

```text
at t1: E satisfies FinalityProfile F under R1 -> action A1 allowed
at t2: R2 changes remaining reversal/remediation exposure
at t3: A2 requires fresh FinalityProfile F2 -> old proof insufficient
```

A1 does not become historically unauthorized merely because A2 would now require stronger evidence.

Candidate rule:

`proof sufficiency is evaluated for a named decision at a named time`.

This prevents both historical rewriting and unsafe perpetual reuse of stale proofs.

## 13. Rule changes may create successor obligations rather than state mutation

When R2 introduces a new remediation/review obligation for an existing effect, prefer:

```text
E1 historical effect
O2 obligation created under R2, relatesTo E1
E2 remediation/review outcome
```

rather than mutating E1's historical occurrence or authority lineage.

This aligns with prior G4 findings that reversals, compensation, and remediation are successor effects rather than erasure.

## 14. Cross-capability propagation

A capability may publish a qualified finality/evidence claim consumed elsewhere. If its governing rule changes, downstream consumers must not silently reinterpret the old claim.

Candidate envelope/evidence dimensions:

- `RuleSetRef` / provision lineage;
- evaluation timestamp/currentness;
- protected invariant/profile;
- transition/retroactivity qualifiers where material;
- evidence provenance;
- semantic-generation/contract version.

`old evidence received under old contract != automatically re-evaluated under new contract`.

A downstream capability owns its decision about whether new rule evidence requires re-evaluation. The Exchange Plane carries the lineage/currentness and incompatibility signal; it does not become the rule authority.

## 15. Compatibility under rule evolution

Schema compatibility is insufficient. A status field may remain `FINAL` while the rule behind `FINAL` changes.

Candidate compatibility dimensions:

- vocabulary/schema compatibility;
- guarantee compatibility;
- applicability compatibility;
- transition compatibility;
- retroactivity compatibility;
- evidence-currentness compatibility.

`same interface + changed finality rule != contract compatibility`.

If an adapter cannot establish equivalence, the correct result is qualified mediation or `PARTIAL/UNKNOWN/INCOMPATIBLE`, never fabricated equivalence.

## 16. No central rule oracle is required

The model does not require Builder or Exchange Plane to become a universal legal/rule engine.

Possible implementation-independent realizations include:

- capability-local rule packs with signed/versioned provenance;
- provider/scheme authority evidence;
- bounded policy service;
- locally cached rule evidence with expiry/currentness;
- target-side enforcement of a newer mandatory constraint;
- manual governance for exceptional retroactivity.

The invariant is evidence-qualified applicability, not centralization.

`logical exchange semantics != central business-rule ownership`.

## 17. Candidate proof obligations

1. Historical decision proof binds the rule/provision actually applicable at decision time.
2. Current disposition can be re-evaluated without rewriting historical decision evidence.
3. Publication date and effective date are distinct where the authority distinguishes them.
4. Latest rule version is never assumed applicable solely because it is latest.
5. Applicability scope is explicit enough for the protected effect/invariant.
6. Transition periods remain representable.
7. Staged applicability by subject/class/phase remains representable.
8. Retroactivity requires explicit qualified authority evidence.
9. Absence of a non-retroactivity marker is not proof of retroactivity.
10. Pre-existing occurrence is not automatically grandfathered.
11. Grandfathering evidence names cutoff, scope, exceptions, and currentness.
12. A rule amendment can change one guarantee dimension while preserving another.
13. Contract compatibility is evaluated at guarantee semantics, not rule-set version string alone.
14. Same schema/status vocabulary does not prove semantic compatibility across rule versions.
15. Clarification/correction/amendment/retroactive change are not silently collapsed.
16. A later clarification does not silently rewrite historical evidence provenance.
17. A genuinely retroactive rule can create a current obligation over an old effect without claiming the old decision used that rule.
18. Historical rule text/provenance remains auditable after supersession.
19. Current applicability evidence has independent currentness.
20. Authentic cached rule bytes do not imply current applicability.
21. Offline runtime preserves history but does not strengthen stale current-rule claims.
22. A proof sufficient for action A1 is not automatically reusable for later action A2.
23. Rule change can invalidate future reuse without invalidating past justified use.
24. Successor obligations/remediation preserve causation to predecessor effects.
25. Cross-capability evidence carries rule/provision lineage where material.
26. Downstream capability does not silently reinterpret old evidence under a new rule.
27. Exchange Plane does not own business/legal applicability policy.
28. Adapter/driver may normalize mechanism but cannot invent semantic equivalence across rule versions.
29. Unsupported transition/retroactivity semantics degrade explicitly.
30. Provider-local rule version does not become canonical business rule identity.
31. Rule-set rollout and software rollout are separate dimensions.
32. Control-plane ACK of new rule configuration does not prove every effect was evaluated under it.
33. Mixed-version operation requires declared compatibility/transition assumptions.
34. Rule rollback does not erase decisions made while the newer rule was legitimately applicable.
35. Rule provenance survives projection/index/cache rebuilding.
36. AI may explain or compare rule evidence but cannot authoritatively infer retroactivity/applicability.
37. Rule changes do not mutate capability business ownership.
38. Runtime autonomy remains possible without a mandatory central rule oracle.

## 18. Adversarial cases

1. R2 is published today but future-dated; runtime applies it immediately to all effects.
2. R2 becomes effective today; runtime rewrites yesterday's R1-compliant decision as invalid.
3. A phased rule applies only to large participants first; adapter applies it universally.
4. A holiday/practical effective-date adjustment is ignored at a boundary.
5. One provision's effective date is extended while the rest of the package activates; version-only mapping misses the split.
6. R2 changes reversal reasons but not timing; adapter assumes every guarantee changed.
7. R2 keeps the same status vocabulary but changes what `FINAL` guarantees.
8. Historical effect predates R2 and is assumed grandfathered without evidence.
9. Retroactivity is inferred merely because R2 is stricter.
10. Retroactive obligation is ignored merely because the effect predates R2.
11. New rule creates remediation obligation; system mutates predecessor history instead of appending successor obligation.
12. Provider rule cache contains authentic R1 but applicability authority has moved to R2.
13. Offline runtime uses R1 indefinitely because Builder is unavailable.
14. Reconnection rewrites old decision proof to claim R2 was used originally.
15. Projection stores only current rule version and loses historical decision lineage.
16. Schema registry reports compatibility while finality semantics changed.
17. Adapter labels a semantic amendment as editorial because JSON shape did not change.
18. Clarification is treated as retroactive amendment without authority evidence.
19. True retroactive amendment is treated as mere clarification and no new obligation is created.
20. Rule rollout ACK is confused with effective evaluation at every target.
21. Some nodes enforce R2 while others still legitimately operate under transition R1; system marks all mixed state as failure.
22. Some nodes use R1 outside the allowed transition; system treats all version skew as harmless.
23. New provider adopts equivalent-looking rule label with materially different dispute horizon.
24. Downstream capability receives old `FINAL` evidence after R2 changed its required profile and trusts it blindly.
25. Rule rollback causes deletion of obligations legitimately created under R2.
26. Historical evidence is garbage-collected because its rule version is superseded.
27. Current rule text is used to interpret an old provider status whose meaning changed across versions.
28. Majority of providers use R2 and system infers R2 applicability for a minority provider without proof.
29. AI reads a release note and declares all historical effects retroactively governed.
30. Gateway accumulates rule interpretation and becomes a hidden business-policy ESB.
31. Exchange Plane stores canonical legal/business rule state rather than qualified refs/evidence.
32. Shared Kernel receives payment-specific dispute entities for convenience.
33. Rule version is encoded into endpoint identity, causing false identity discontinuity on policy change.
34. Rule change causes a new admission but old effect lineage is dropped.
35. Time-zone/calendar mismatch makes an effective-date boundary early or late.
36. Transition policy expires while a long-running workflow still carries R1 proof and no requalification occurs.
37. A future action reuses a proof whose decision-scoped sufficiency has expired.
38. A retroactive rule creates a successor obligation, but settlement compaction removed the predecessor frontier needed to link it.

## 19. Portability and exit path

Technology-independent requirements:

- preserve rule/provision identity, provenance, applicability, effective interval, transition/retroactivity semantics, and evidence currentness;
- keep historical decision proof separate from current disposition;
- represent successor obligations without rewriting predecessor truth;
- allow explicit incompatibility when a provider cannot expose enough rule semantics;
- avoid provider-specific rule IDs as canonical business ownership;
- allow local/offline evaluation when sufficient qualified evidence exists;
- permit migration between rule engines/providers without losing historical proof lineage.

Provider-specific rule engines, policy languages, payment schemes, gateways, registries, and legal/compliance systems remain replaceable realizations.

## 20. Deduplication against existing G4 research

This round does not reopen:

- generic temporal semantics;
- settlement evidence classification;
- reversals/chargebacks themselves;
- generic contract version skew;
- authority re-parenting;
- provider rollout skew;
- offline delegation;
- workflow compaction.

Material delta:

`settlement finality -> governing rule changes -> historical justification vs current disposition -> publication/effective/applicability clocks -> transition/grandfathering/retroactivity -> successor obligations without historical rewrite`.

## 21. Maturity assessment

State: `RESEARCH_ACTIVE / NON_EXECUTABLE`.

Material boundaries are clearer, but this subproblem is not saturated. The next high-value gap is **rule-authority conflict and precedence**: when two independently legitimate authorities (provider/scheme, jurisdiction/regulator, contractual policy, capability policy, emergency control) simultaneously issue incompatible applicability/finality obligations, determine how evidence can represent precedence, conflict, supersession, and `CONTESTED` states without letting the Exchange Plane invent legal/business precedence or silently choosing the newest/strictest rule.

No implementation authority is created by this document.