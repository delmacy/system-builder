# G4 Capability Exchange — Settlement Finality, Reversibility, and Long-Tail Remediation

Status: `RESEARCH_ACTIVE / NON_EXECUTABLE`
Date: 2026-09-22
Family: Shared Semantic Kernel / Capability Exchange Plane / Inter-Capability Boundary Model

> Research candidate != implementation authority. This document does not select a payment rail, payment provider, broker, workflow engine, transaction coordinator, ledger, dispute system, gateway, or protocol. It does not reopen G3 and does not authorize product work.

## 1. Research question

Prior G4 research separated provider ACK, business effect, settlement evidence, `UNKNOWN`, compensation, and cross-provider re-admission. The remaining gap is finality: when may an effect be considered sufficiently final for a named invariant if the surrounding system admits reversals, chargebacks, asynchronous rejection, dispute windows, scheme arbitration, operational remediation, or exceptional reopening?

Core findings:

`COMMITTED != SETTLED != IRREVERSIBLE != FINAL_FOR_EVERY_INVARIANT`.

`provider terminal status != universal economic/legal/business finality`.

`reversible later != not committed now`.

`finality is effect-, rule-set-, horizon-, and invariant-scoped`.

A payment, transfer, message, entitlement, reservation, document publication, external command, or physical action may be committed and operationally usable while remaining exposed to a later counter-effect. G4 therefore should not model finality as one global boolean or silently map provider-specific `final` labels into a universal primitive.

## 2. Evidence reviewed

Primary documentation and mature operational rules:

- Adyen's generic dispute flow distinguishes `ChargebackReversed`, pre-arbitration, scheme arbitration, and `SecondChargeback`; a returned amount can still be challenged until the applicable flow reaches its own final stage. <https://docs.adyen.com/risk-management/understanding-disputes/dispute-process-and-flow>
- Adyen's Accel/STAR guidance gives a concrete example where `ChargebackReversed` can initially return funds while the issuer still reviews the defense, with a later pre-arbitration/second-chargeback path; other paths mark `ChargebackReversed` final only after pre-arbitration is won. <https://docs.adyen.com/risk-management/chargeback-guidelines/accel-star-chargebacks>
- Adyen's American Express guidance states that `ChargebackReversed` is normally final but, exceptionally, a cardholder can provide new evidence and a previously closed dispute can reopen into `SecondChargeback`. <https://docs.adyen.com/risk-management/chargeback-guidelines/american-express-chargebacks>
- Adyen's JCB/NYCE/PULSE guidance documents bounded windows in which a returned amount can still be challenged and debited again. These demonstrate scheme-specific finality horizons rather than one portable status vocabulary. <https://docs.adyen.com/risk-management/chargeback-guidelines/jcb-chargebacks>, <https://docs.adyen.com/risk-management/chargeback-guidelines/nyce-chargebacks>, <https://docs.adyen.com/risk-management/chargeback-guidelines/pulse-chargebacks>
- PayPal's current Disputes API documentation models disputes as a lifecycle from inquiry/dispute through later resolution stages rather than equating payment completion with dispute completion. <https://developer.paypal.com/platforms/disputes/handle-disputes/use-disputes-api/>
- Nacha rules distinguish ACH settlement from reversal/return mechanisms. A reversing entry is a new corrective entry, must satisfy specific conditions, and generally must be made available within five banking days of the erroneous entry's settlement date; improper reversals themselves can be returned under defined windows. <https://www.nacha.org/rules/reversals-and-enforcement>
- Nacha operational guidance reiterates that an original ACH entry settles before or together with its reversal and that reversal is a distinct corrective operation rather than time-reversal of the original fact. <https://www.nacha.org/news/second-chance-understanding-ach-reversals>

These are benchmarks only. Provider/scheme terminology is not promoted into G4 canonical semantics.

## 3. Finality must be a qualified claim

Candidate distinction:

```text
ACCEPTED
  -> ADMITTED
  -> EFFECT_COMMITTED
  -> EFFECT_OBSERVED
  -> OPERATIONALLY_SETTLED
  -> REVERSAL_WINDOW_BOUNDED/CLOSED
  -> FINAL_FOR(invariant, rule-set, horizon)
```

This is not a mandatory universal state machine. Different effects skip or reorder operational stages. The important point is that the claims are not synonyms.

Candidate `FinalityEvidenceRef` dimensions:

- `EffectIdentityRef` and occurrence/admission lineage;
- protected invariant or decision being justified;
- effect kind and commitment boundary;
- governing rule-set/scheme/provider/domain identity and immutable version/effective period where material;
- current disposition (`COMMITTED`, `SETTLED`, `REVERSED`, `REMEDIATED`, `CONTESTED`, `UNKNOWN`, etc.);
- reversal/dispute/rejection classes still reachable;
- ordinary reversal horizon and exceptional reopening conditions;
- currentness and evidence source;
- whether the claim is provider-local, economic, legal, operational, security, ownership, or capability-defined;
- successor/counter-effect lineage;
- proof of closure when a negative claim such as `no further ordinary reversal path` is made.

`status string == final != FinalityEvidenceRef universally final`.

## 4. Reversal is a successor effect, not erasure

ACH reversal rules provide a useful mature pattern: the original entry settles, and a reversing entry is a separately constrained corrective entry. Chargebacks likewise create subsequent debits/credits and dispute records.

Candidate rule:

`reversal/counter-effect does not rewrite the predecessor effect into NOT_COMMITTED`.

Historical facts remain:

```text
E1 committed
E2 reversed/remediated E1
```

not:

```text
E1 never happened
```

This preserves auditability, causation, reconciliation, and compensation semantics. It also prevents a late reversal from laundering historical authority/evidence lineage.

## 5. Finality is invariant-relative

The same effect can be sufficiently final for one decision and insufficiently final for another.

Examples:

- shipment preparation may proceed after a qualified authorization/capture policy;
- revenue recognition may require a different accounting rule;
- irreversible fulfillment may require a stronger settlement/reversal posture;
- fraud reserve calculation may intentionally remain exposed to a long-tail dispute horizon;
- an entitlement may be provisionally usable while revocable;
- an external physical action may be irreversible even if its payment remains economically reversible.

Therefore:

`FINAL_FOR(X) != FINAL_FOR(Y)`.

A capability owns the business rule defining which finality claim is sufficient for its invariant. The Exchange Plane may carry/verify the evidence and rule-set identity but must not invent the business threshold.

## 6. Provider `final` is scoped to a provider workflow

Adyen documents flows where the same human-readable concept, such as chargeback reversal, has different continuation possibilities depending on scheme/flow. American Express can exceptionally reopen a dispute that was previously closed in the merchant's favor; other schemes expose pre-arbitration or second-chargeback windows with different timing.

Candidate rule:

`provider terminal != no external successor effect can ever occur`.

Provider terminal may mean only:

- no further transition in that provider-local workflow;
- no ordinary transition under that scheme path;
- liability assigned for that dispute;
- funds moved at that layer;
- provider will not accept further defense material.

Adapters must preserve the qualified meaning. They must not normalize every terminal provider state to an unqualified `FINAL`.

## 7. Ordinary finality and exceptional reopening are separate

Systems need usable finality without claiming metaphysical irreversibility.

Candidate model:

- `PROVISIONAL` — effect exists but normal successor/rejection paths remain open;
- `OPERATIONALLY_SETTLED` — normal execution completed and the effect is usable under declared policy;
- `ORDINARY_FINAL` — ordinary reversal/dispute paths under the named rule-set are closed;
- `EXCEPTIONALLY_REOPENABLE` — ordinary finality holds but explicitly named extraordinary processes can still create a successor effect;
- `IRREVERSIBLE_BY_MECHANISM` — no supported mechanism can undo the physical/technical effect, though remediation may still exist;
- `FINAL_FOR(invariant)` — evidence is sufficient for a named business invariant, irrespective of whether other dimensions remain reversible.

These are research vocabulary candidates, not a committed enum.

`ordinary finality != absolute impossibility of future remediation`.

## 8. Time alone does not create finality without a rule-set

A timeout, TTL, retention period, or elapsed wall-clock interval has no finality semantics by itself.

Candidate rule:

`time elapsed + no governing closure rule != finality`.

A time horizon becomes meaningful only when evidence binds it to a rule such as:

- dispute window closed;
- reversal submission deadline closed;
- provider guarantee says no later transition of class C is accepted;
- conserved right/fence makes a counter-effect structurally impossible;
- capability policy intentionally accepts residual exceptional risk after horizon H.

Clock uncertainty and provider observation delay remain material where boundary timing decides admissibility.

## 9. Asynchronous rejection creates a provisional-success interval

An immediate success-shaped response may precede later rejection. Mature payment/dispute systems make this common, but the principle applies to asynchronous integrations generally.

Candidate rule:

`success-shaped observation before rejection closure != final success`.

The exchange contract should declare whether a result means:

- accepted for processing;
- effect committed locally;
- downstream settlement pending;
- rejection still possible;
- ordinary finality reached.

This prevents UIs, workflows, retries, and dependent capabilities from treating `200 OK`, provider ACK, message delivery, or provisional funds availability as the same semantic event.

## 10. Long-tail remediation is not workflow rollback

Late chargeback, legal correction, manual adjustment, refund, entitlement revocation, or physical remediation may happen after the original workflow completed.

Candidate rule:

`workflow completed != all future successor effects prohibited`.

A long-tail remediation creates a new occurrence/effect lineage linked to the predecessor by a qualified relation such as `reverses`, `disputes`, `refunds`, `remediates`, `supersedes`, or `offsets`.

The original workflow need not remain indefinitely open. Instead, the capability can retain a settlement/finality obligation or compacted frontier sufficient to process a future successor effect.

This aligns with prior G4 compaction research: completion of active workflow state must not erase unresolved external-effect questions.

## 11. Bounded residual risk can be explicit

Some domains cannot economically wait for absolute closure. A product needs a way to say:

`evidence sufficient for operation under declared residual-risk policy`

without claiming:

`effect can never be reversed`.

Candidate `FinalityPolicyRef` may name:

- invariant/operation;
- required disposition;
- acceptable open reversal classes;
- maximum residual exposure;
- reserve/escrow/insurance/holdback requirements if capability-owned policy uses them;
- horizon and governing rule-set;
- behavior if a late successor effect occurs.

This is not permission for the Exchange Plane to price risk or own financial policy. The capability owns the threshold; the plane carries the qualified evidence.

## 12. Cross-provider finality does not compose by weakest/strongest status label

If P1 calls a transaction `settled` and P2 calls another `final`, there is no portable ordering unless their guarantees are mapped to the same protected effect and rule-set dimensions.

`provider status ordering != semantic finality ordering`.

Cross-provider comparison requires a guarantee vector: commitment, reversibility classes, horizon, dispute authority, settlement locus, exceptional reopening, evidence currentness, and remediation semantics.

An adapter may state `P1 state S satisfies FinalityProfile F under assumptions A`; it may not fabricate `S == universal FINAL`.

## 13. Finality and compensation remain distinct

A compensating action may restore an economic balance while leaving irreversible side effects intact.

Examples:

- refund restores money but not shipped inventory/time;
- account credit offsets a duplicate charge but does not erase the charge;
- document supersession does not make the earlier publication unseen;
- entitlement revocation does not undo actions already performed under the entitlement.

Therefore:

`compensated != reversed in every dimension != predecessor absent`.

Finality claims must identify which dimension is being settled.

## 14. Negative finality claims require closure evidence

Claiming `no ordinary successor/reversal path remains` is a negative claim.

Candidate rule:

`ordinary-final requires positive evidence that every material ordinary reversal/rejection authority is closed, expired, fenced, or irrelevant for the named invariant`.

Examples of possible evidence:

- authoritative dispute state plus elapsed rule-set window;
- immutable scheme outcome that disallows further ordinary appeal;
- target-side fence preventing successor effect;
- legal/business policy explicitly classifying remaining extraordinary remedies outside the invariant's ordinary-finality scope.

Absence of a chargeback today is not proof that chargeback is no longer possible.

## 15. Finality state may regress operationally without history rewriting

A later valid successor effect can change current disposition:

```text
E1: OPERATIONALLY_SETTLED
E2: chargeback/reversal -> CURRENT_DISPOSITION = REVERSED/CONTESTED
```

But this is not a rewrite of E1's historical observation.

Candidate rule:

`current disposition may change; historical effect occurrence and evidence lineage remain append-only facts`.

This is important for projections and UI: a timeline can show `settled at t1`, `reversed at t2` without asserting that the t1 evidence was fabricated.

## 16. Offline/autonomous runtime implications

Published runtimes remain autonomous from Builder availability. Finality therefore cannot depend on a central Builder oracle.

A runtime may continue from locally durable finality evidence within declared horizons. If a required rule-set/currentness dependency expires while disconnected, the runtime can:

- preserve historical settlement state;
- stop claiming stronger current finality;
- permit operations whose `FinalityPolicyRef` tolerates the stale horizon;
- defer irreversible successor actions requiring fresh closure evidence;
- reconcile later without rewriting historical lineage.

`offline autonomy != perpetual finality-currentness`.

## 17. Candidate proof obligations

1. `COMMITTED`, `SETTLED`, `REVERSED`, `REMEDIATED`, `ORDINARY_FINAL`, and `FINAL_FOR(invariant)` are not silently collapsed.
2. Every finality claim names the protected effect and invariant/decision it justifies.
3. Provider-local terminal status is preserved with provider/rule-set semantics rather than normalized to universal finality.
4. Reversal/remediation creates a successor effect relation and does not rewrite the predecessor as absent.
5. Historical occurrence/evidence lineage remains stable after current disposition changes.
6. Asynchronous rejection windows remain representable.
7. Ordinary and exceptional reopening paths are distinguished where the source rule-set distinguishes them.
8. Elapsed time proves closure only when bound to a qualified rule-set/window.
9. Clock/currentness uncertainty remains visible where it can change closure.
10. Negative `no further ordinary reversal` claims require completeness/closure evidence.
11. Missing webhook/dispute is never normalized to ordinary finality by itself.
12. Cross-provider finality comparison uses guarantee semantics, not status-name similarity.
13. Adapter/driver may map a provider state to a qualified finality profile only under explicit assumptions.
14. Unsupported reversal semantics degrade to `PARTIAL/UNKNOWN/INCOMPATIBLE`, never invented equivalence.
15. Compensation/remediation is not interpreted as predecessor non-occurrence.
16. Economic, operational, legal/security/ownership and physical irreversibility dimensions remain separable where material.
17. Capability-owned policy determines which finality profile is sufficient for a business invariant.
18. Exchange Plane transports/verifies finality evidence but does not own dispute/business risk policy.
19. Workflow completion does not discard long-tail settlement/finality obligations.
20. Compaction retains enough frontier/evidence to link a later reversal/remediation to the predecessor effect.
21. Late successor effects preserve causation and authority lineage.
22. A provider rule-set change cannot silently reinterpret historical finality evidence.
23. Historical evidence binds the applicable rule-set/version/effective period when material.
24. Current finality evidence remains independently currentness-qualified.
25. Offline runtime does not strengthen stale finality evidence merely because Builder/control plane is unavailable.
26. Reconnection/reconciliation does not rewrite historical evidence to match the newest disposition.
27. Projection/UI may show current disposition but must preserve access to relevant historical transitions/evidence.
28. A terminal provider workflow does not imply all external legal/manual/physical remedies are impossible.
29. Exceptional reopening does not make ordinary finality meaningless; it remains a scoped claim.
30. Residual-risk acceptance is explicit capability policy, not an Exchange Plane default.
31. Reserve/holdback/insurance mechanisms, when present, mitigate exposure but do not change historical effect truth.
32. `finality profile satisfied` does not imply every downstream dependent invariant is satisfied.
33. Re-admission/failover uses the finality requirement of the protected effect, not a generic provider terminal flag.
34. Finality evidence cannot be upgraded by majority voting among weaker observations.
35. Target-side finality/fencing evidence is strong only to the extent it is coupled to the protected effect.
36. No central finality oracle is required when runtimes possess locally sufficient qualified evidence.

## 18. Adversarial cases

1. Payment provider returns `settled`; a later chargeback is possible, but adapter emits universal `FINAL`.
2. `ChargebackReversed` returns funds; issuer is still inside a second-chargeback window.
3. Provider documentation calls a state final for its workflow; a separate legal/manual remedy remains possible and is material to the business invariant.
4. American Express-like exceptional reopening is ignored because the normal flow was closed.
5. Five banking days pass, but the implementation assumes every ACH return/remedy path is impossible.
6. Missing dispute webhook is treated as proof that dispute window closed.
7. Workflow closes and deletes effect lineage; a chargeback arrives months later.
8. Refund is interpreted as proof the original debit never happened.
9. Inventory shipment is considered rolled back because payment was reversed.
10. Same status string from two providers is treated as same finality guarantee.
11. Provider changes dispute rules; old evidence is reinterpreted under the new rule-set.
12. Runtime clock skew causes premature closure of a reversal window.
13. Index lag hides a newly opened dispute while projection shows `final`.
14. Offline runtime retains an old terminal status beyond its currentness horizon and approves an irreversible dependent effect.
15. UI shows only current `reversed`, erasing the earlier legitimate settlement and its provenance.
16. UI shows only historical `settled`, hiding a current reversal.
17. Exchange Plane begins deciding whether a merchant should accept residual chargeback risk.
18. Gateway holds funds and is treated as canonical business settlement owner.
19. Compensation succeeds financially but a physical/external side effect remains irreversible.
20. Second chargeback arrives after local active workflow state was compacted without a predecessor frontier.
21. A manual adjustment has no provider transaction ID and is incorrectly discarded as unrelated.
22. `200 OK` from an asynchronous provider is treated as ordinary finality.
23. Message consumed exactly once is treated as economic finality of the consumer's external side effect.
24. Provider terminal status is used to infer target-side effect uniqueness without dedup/fencing evidence.
25. A chargeback reserve is treated as evidence that chargeback cannot occur.
26. A long dispute horizon blocks unrelated operations because finality was modeled globally instead of invariant-scoped.
27. A capability accepts provisional finality for reversible work, but the same policy is reused for irreversible work.
28. Exceptional reopening is modeled as `UNKNOWN` forever, preventing useful ordinary-final decisions despite a declared residual-risk policy.
29. Rule-set closure is inferred from elapsed wall-clock time without authoritative effective-date/window semantics.
30. Two weak observers report no reversal and outvote one authoritative reversal record.
31. A provider-local dispute `final` is assumed to settle a separate downstream ledger discrepancy.
32. A downstream ledger is updated after chargeback, but predecessor occurrence history is overwritten.
33. Failover to another provider starts because P1 is `settled`, although the relevant invariant requires ordinary dispute finality.
34. Re-admission is blocked forever because the model cannot distinguish operational settlement from absolute irreversibility.
35. Builder outage causes runtime either to halt all work or to pretend stale finality is current, because no bounded offline policy exists.
36. Adapter maps an unsupported scheme-specific reopening path to `cannot reverse` rather than explicit incompatibility.

## 19. Portability and exit path

The portable abstraction is not a payment-specific chargeback enum. It is the ability to represent:

- effect occurrence and current disposition separately;
- qualified reversal/rejection/remediation paths;
- governing rule-set identity and horizon;
- invariant-scoped finality requirements;
- successor-effect lineage;
- evidence/currentness/closure claims;
- explicit unsupported semantics.

A provider can be replaced when its states can be mapped into the required finality profile without fabricating equivalence. If a provider cannot expose enough evidence for a required profile, the correct result is reduced guarantee, additional target-side mediation, manual reconciliation, or incompatibility—not a stronger normalized status.

## 20. Deduplication against existing G4 research

This round does not reopen:

- generic settlement evidence or `UNKNOWN` resolution;
- retry/idempotency/deduplication;
- Saga/compensation mechanics;
- authority re-parenting;
- cross-provider failover mechanics;
- semantic-generation handoff;
- generic temporal semantics;
- archival/compaction design.

Material delta:

`settlement evidence -> current effect disposition -> reversible successor paths -> ordinary vs exceptional finality -> invariant-scoped finality profile -> long-tail remediation without historical rewrite`.

## 21. Maturity and remaining gap

This subproblem materially advances the Exchange Plane hypothesis but remains `RESEARCH_ACTIVE / NON_EXECUTABLE`.

The next highest-value gap is **finality-rule evolution and historical reinterpretation**: how to preserve a historical decision made correctly under rule-set R1 when provider/scheme/legal policy later changes to R2, including retroactive rules, extended dispute windows, emergency exceptions, or newly discovered evidence, without rewriting historical proof and without pretending the current decision must remain unchanged.

That problem should distinguish:

- historical decision correctness under then-applicable evidence/rules;
- current disposition under successor rules/evidence;
- genuinely retroactive rule applicability;
- remediation/reopening authority;
- audit/provenance requirements;
- offline runtime behavior across rule-set transitions.

No architecture or provider selection is authorized by this research.