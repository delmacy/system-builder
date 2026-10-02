# G4 — Conflict-Aware Proof Compaction and Historical Effect Settlement

Status: `RESEARCH_ACTIVE / NON_EXECUTABLE`
Date: 2026-09-20
Scope: Generation 4 product R&D only. No implementation authority.

## 1. Research question

After a succession/relationship fork is detected and a qualified recovery selects/fences a branch, when may contested dependency commitments and negative/fencing evidence be compacted without resurrecting losing-branch authority, erasing historical external effects, or forcing permanent retention of a global identity graph?

This document extends the existing handoff recovery/compaction, split-brain, non-fenceable effects, conflicting succession and derived-proof conflict-propagation research. It does not create a new macro-family and does not reopen G3.

## 2. Evidence base

Primary standards, mature-system documentation and production evidence reviewed:

- RFC 9162 Certificate Transparency v2: append-only consistency/inclusion proofs permit compact verification of historical log claims; an audit failure yields evidence of misbehavior but does not prescribe business adjudication.
- RFC 9943 SCITT Architecture (2026): transparency receipts are independently verifiable evidence of registration; transparency supports durable historical accountability without becoming issuer/business authority.
- Apache Kafka 4.x design/Streams: exactly-once processing is scoped to Kafka input offsets, state stores and Kafka output records because those participate in the transaction; external systems with side effects are outside that atomic boundary unless separately integrated.
- Apache Kafka Connect: exactly-once source support requires meaningful source offsets and the ability to resume the external source exactly at those positions; unsupported guarantees must be reported explicitly rather than fabricated.
- Microsoft Azure Architecture Center Saga and Compensating Transaction guidance (updated 2026): local commits cannot simply be rolled back across independently managed services; compensations are forward operations, can fail, may require business-specific rules/manual intervention, and must record progress/idempotency.
- Google Photon production paper: geographically distributed stream joins distinguish immediate at-most-once/near-exact output from eventual exactly-once completion, demonstrating that settlement/completeness can mature over time rather than being one instantaneous boolean.
- Existing G4 artifacts on handoff recovery/compaction, effect composition, non-fenceable effects, split-brain rejoin, guarantee-evidence invalidation, conflicting succession and derived-proof propagation.

These are architectural evidence only. No log, workflow engine, saga framework, broker, database, Merkle structure or settlement provider is selected.

## 3. Material findings

### 3.1 Recovery closure is not settlement closure

A branch may be authoritatively defeated while effects previously emitted by it remain real, unknown, compensating, disputed or externally irreversible.

`Branch recovery complete != historical effects settled`.

`Losing branch fenced for future effects != losing branch never produced effects`.

The recovery frontier therefore needs two independent questions: may this branch create new protected effects, and what is the disposition of effects already attempted/committed?

### 3.2 Compaction eligibility follows live proof questions, not branch age

Contested lineage detail becomes compactable only when every still-live safety, settlement, audit and resurrection question can be answered by a smaller durable summary or by an explicit below-retention disposition.

`Old conflict != compactable conflict`.

`Branch fenced != all conflict evidence deletable`.

A wall-clock retention policy cannot decide semantic compaction by itself.

### 3.3 Historical effect identity must survive longer than payload when needed

The platform need not retain full business payload or a permanent identity graph to remember that an external effect occurred or remains unresolved. A minimal historical witness can preserve occurrence/effect identity, original branch/profile, target scope, attempt/settlement disposition, provenance and any compensation/fencing dependency.

`Effect witness != business payload archive`.

`Historical effect identity != current subject authority`.

This supports privacy/erasure while retaining the minimum evidence needed to prevent duplicate/resurrected effects and to explain prior outcomes.

### 3.4 Settlement dispositions are richer than success/failure

Candidate research dispositions include `NOT_ATTEMPTED`, `ATTEMPTED_UNKNOWN`, `COMMITTED`, `REJECTED`, `COMPENSATION_REQUIRED`, `COMPENSATION_IN_PROGRESS`, `COMPENSATED`, `IRREVERSIBLE_ACCEPTED`, `DISPUTED`, `HISTORICAL_ONLY` and `BELOW_RETENTION`.

`Effect ACK != settlement`.

`Compensation requested != compensated`.

`Compensated != history erased`.

This preserves the existing G4 rule that compensation is not rollback/time reversal.

### 3.5 Compensation is a new effect with its own lineage

Mature Saga/compensating-transaction guidance shows that distributed compensation executes additional business operations and may itself fail or require retries/manual intervention. Therefore a compensation cannot rewrite the original effect as if it never occurred.

`Compensation != deletion of original effect`.

`Compensation success != original occurrence removed from audit history`.

A compacted witness may link original effect and compensation while allowing their payload-rich operational records to expire independently.

### 3.6 Exactly-once claims are boundary-scoped

Kafka's mature exactly-once model is strong inside the Kafka transaction boundary because consumed offsets, state stores and produced records participate together. It does not magically settle an arbitrary external payment, actuator or legacy system.

`Exactly-once transport/stream processing != exactly-once external business effect`.

Future G4 compaction must therefore retain independent external-effect settlement evidence whenever the effect target is outside the atomic proof boundary.

### 3.7 A durable fence may subsume old negative evidence only within its proof scope

Old per-message/per-branch revocation records can be compacted when a stronger durable fence proves that every resurrection path relevant to the protected invariant is closed.

Candidate examples are monotonic target-side fencing, expired/non-renewable effect capability, authoritative recovery floor plus proven target coverage, or immutable settlement evidence. No mechanism is selected.

`Stronger fence subsumes detail only for covered targets/invariants`.

`Fence at provider P1 != fence at provider P2`.

A branch fenced in one payment rail cannot justify deleting evidence for another still-reachable rail.

### 3.8 Resurrection closure is a proof obligation, not an assumption

Before deleting negative/fencing evidence, the system must be able to show that no legitimate replay, offline runtime, stale credential, archive redrive, failback image, provider route or queued obligation can still exercise the losing authority under the declared contract.

Candidate term: `ResurrectionClosureEvidence`.

`No known replay path != no resurrection path`.

`Queue drained != resurrection impossible`.

This extends earlier replay/dedup/fencing research into a compaction gate.

### 3.9 Historical audit and active authorization use different summaries

A losing branch may remain historically resolvable after it is permanently inadmissible for new effects. Long-term audit needs provenance and settlement facts; active authorization needs current floors/fences and must not interpret historical evidence as live authority.

`Historical resolvability != continuation authority`.

`Archive can explain != archive can authorize`.

Provider migration must preserve this distinction.

### 3.10 Transparency evidence can preserve accountability without becoming business truth

RFC 9162 and RFC 9943 provide mature examples of compact, independently verifiable historical inclusion/consistency/receipt evidence. The G4 lesson is limited: a historical witness can prove that a statement was registered or that a log view extended consistently without retaining all active operational state locally.

`Historical receipt != effect settlement`.

`Append-only consistency != business legitimacy`.

Such evidence can support audit/non-repudiation questions but cannot choose a recovery branch or decide compensation policy.

### 3.11 Non-repudiation is claim-scoped, not universal

A durable signature/receipt can support origin or registration evidence, but it does not prove current authority, semantic correctness, external settlement or absence of later revocation.

`Signed historical witness != complete non-repudiation of business meaning`.

Any future non-repudiation claim must name exactly what is proven: issuer/origin, content integrity, registration time/order, target acknowledgement, settlement or other dimensions.

### 3.12 Conflict compaction must preserve branch-specific effect provenance

If A2 wins over A3, effects produced under A3 cannot be relabeled as A2 effects merely to simplify history. A compacted witness keeps original branch/provenance and later recovery/compensation relations.

`Recovery winner != provenance rewrite`.

`Compaction != proof laundering`.

### 3.13 Partial settlement prevents premature conflict closure

A branch can be fenced for new work while some historical effects remain `ATTEMPTED_UNKNOWN` or `COMPENSATION_IN_PROGRESS`. Conflict-detail compaction may proceed only to the extent that the retained summary still answers those pending questions.

`Authority closed != settlement closed`.

A single `RECOVERED` boolean is therefore insufficient.

### 3.14 Unknown effects require longer-lived identity than retry policy

If an effect's outcome is unknown, dropping its stable effect identity before every duplicate/resurrection path is closed can cause a retry to become a second real effect.

`Retry horizon expired != unknown effect became safe to repeat`.

The minimal witness may outlive transport retention and ordinary dedup caches.

### 3.15 Settlement finality is target/contract qualified

Some targets provide authoritative settlement references; others expose eventual observation, compensability, dispute windows or no machine-verifiable finality at all.

`Provider ACK != universal finality`.

`No further API updates observed != irreversible settlement`.

Drivers/adapters must expose unsupported finality semantics explicitly rather than normalize every provider to `SETTLED`.

### 3.16 Compaction may be asymmetric across evidence classes

Payload, transport records, trace detail, branch topology, effect identity, fencing evidence and audit receipts can have different retention/erasure horizons.

`One retention period != one semantic retention period`.

Privacy minimization may remove payload early while a tiny settlement/fence witness remains; conversely, legal audit retention cannot be treated as current authority.

### 3.17 Provider migration requires proof-preserving settlement mapping

Migrating effect or archival providers must preserve the distinction between `UNKNOWN`, `COMMITTED`, `COMPENSATED`, `DISPUTED`, `HISTORICAL_ONLY` and related states. If the target supports only a boolean success flag, the migration is lossy/incompatible for those proofs.

`Provider schema simplification != semantic settlement`.

An adapter cannot fabricate finality to fit a target model.

### 3.18 Offline runtimes can retain compact historical closure locally

Published runtime autonomy does not require the Builder or a central settlement oracle if the runtime possesses the declared compact recovery/fence/settlement evidence and resolvable immutable semantics.

`Builder unavailable != historical closure unavailable`.

When a required external settlement authority is genuinely unavailable, the runtime represents `UNKNOWN/UNRESOLVED` according to contract rather than guessing.

### 3.19 Set reconciliation may optimize discovery but cannot define truth

Research on efficient set reconciliation shows that peers can exchange compact summaries to discover differences after partition. Such techniques may reduce recovery bandwidth, but membership in a reconciled set does not decide business settlement or branch legitimacy.

`Efficient difference discovery != semantic reconciliation`.

No set-reconciliation algorithm is selected.

### 3.20 The Exchange Plane may carry closure evidence but does not own settlement

The logical Exchange Plane can transport historical effect refs, settlement/fencing evidence, compensation lineage and compaction dispositions. It does not become the canonical ledger of business effects, compensation policy owner or identity graph.

`Exchange Plane carries settlement evidence != Exchange Plane owns business settlement`.

Capability-local contracts determine what constitutes settlement, compensation and audit sufficiency.

## 4. Candidate research vocabulary

Research vocabulary only; no schema is authorized.

- `HistoricalEffectWitnessRef` — minimal durable reference/evidence for an attempted or realized historical effect.
- `EffectSettlementDisposition` — qualified state of an effect/compensation, not a transport status.
- `RecoveryClosureRef` — evidence that branch adjudication/recovery has reached a named frontier.
- `ResurrectionClosureEvidenceRef` — evidence that declared stale/replay/offline paths can no longer exercise losing authority for a scope.
- `SettlementEvidenceRef` — provider/target-qualified evidence about external effect outcome/finality.
- `CompensationLineageRef` — relation from original effect to later compensating/remediation effects.
- `HistoricalAuditProfileRef` — declares which historical claims/evidence must remain verifiable after active authority expires.
- `CompactionEligibilityEvidenceRef` — evidence that detailed conflict/effect records may be replaced by a sufficient summary.

## 5. Candidate proof obligations

1. Branch recovery/adjudication and historical effect settlement remain independently representable.
2. Fencing a losing branch for future effects never erases effects already attempted or committed.
3. Conflict/effect detail is compacted only when every live safety, settlement, audit and resurrection question remains answerable by retained evidence or explicit below-retention semantics.
4. Historical effect witnesses retain original branch/profile/provenance without becoming current authority.
5. Full business payload is not retained merely to preserve effect identity when a smaller witness suffices.
6. `ATTEMPTED_UNKNOWN` cannot be relabeled `NOT_ATTEMPTED`, `FAILED` or `SETTLED` because detailed transport history disappeared.
7. Compensation is represented as a new effect/lineage and never rewrites the original occurrence out of history.
8. Compensation progress/failure remains retryable/auditable according to its own idempotency and settlement rules.
9. Exactly-once guarantees are scoped to the resources participating in the atomic proof boundary; external effects retain independent settlement evidence.
10. Negative/fencing evidence is dropped only after a stronger durable fence or resurrection-closure proof subsumes every relevant stale path.
11. Fence coverage is target/invariant qualified; one provider's fence cannot silently fence another target.
12. Offline runtimes, archive redrive, failback images, stale credentials and queued obligations are included in resurrection-closure reasoning when applicable.
13. Historical audit evidence and active authorization evidence remain distinct after compaction.
14. Transparency/receipt/signature evidence proves only its declared claim and never fabricates business settlement or legitimacy.
15. Recovery never rewrites losing-branch historical effects as winning-branch effects.
16. Partial/unknown settlement blocks only the compaction dimensions that depend on it; unrelated evidence can still be minimized.
17. Stable effect identity outlives ordinary retry/dedup caches when an unknown outcome could otherwise be repeated.
18. Settlement/finality semantics are provider/contract qualified and unsupported guarantees are explicit incompatibilities.
19. Evidence classes may have independent retention/erasure horizons without creating one global retention period.
20. Provider migration preserves settlement/compensation/fencing dispositions or declares lossiness/incompatibility.
21. A runtime can evaluate historical closure locally when its declared evidence closure is present; Builder availability is not required.
22. Missing external settlement authority yields `UNKNOWN/UNRESOLVED` rather than guessed success/failure.
23. Difference/set reconciliation mechanisms cannot become semantic adjudicators.
24. Exchange Plane transports closure evidence without becoming canonical business ledger, compensation owner or identity graph.

## 6. Adversarial cases

1. Recovery chooses A2 and deletes all A3 history although A3 already charged a card.
2. A3 is fenced at provider P1 but still has a live credential at P2; global `FENCED` is recorded.
3. `ATTEMPTED_UNKNOWN` payment is compacted to `FAILED` and retried, producing a duplicate charge.
4. Compensation request ACK is treated as proof that compensation completed.
5. Successful refund causes the original debit to disappear from audit history.
6. Kafka-like exactly-once stream processing is presented as exactly-once external payment settlement.
7. Queue drain is treated as resurrection closure while an offline runtime still holds a valid effect capability.
8. Dedup cache expires before an unknown external effect's dispute/observation window closes.
9. Failback restores a VM image containing a losing-branch credential after negative evidence was deleted.
10. Archive redrive emits a losing-branch command after its direct tombstone was compacted.
11. A transparency receipt is interpreted as proof that the registered business action was legitimate and settled.
12. Signature on a historical witness is presented as proof of current authority.
13. Recovery rewrites A3 provenance to A2 to simplify reporting.
14. Provider migration maps `DISPUTED` and `UNKNOWN` to `success=false`, destroying retry/compensation semantics.
15. A settlement provider exposes only eventual observations; driver fabricates `FINAL` after a timeout.
16. Full customer/payment payload is retained indefinitely although only effect identity and settlement disposition are needed.
17. Privacy erasure deletes the only effect identity because identity was never separated from payload.
18. Legal archive retention is reused as authorization evidence for a new effect.
19. One global conflict-retention TTL deletes high-risk unresolved effects together with low-risk settled reads.
20. A compensation itself is duplicated because its stable effect identity was compacted after the first ACK.
21. A branch is considered closed because no differences are found by set reconciliation, despite an external effect outside the compared set.
22. Builder becomes mandatory to interpret historical witnesses, violating runtime autonomy.
23. Gateway stores every historical business effect centrally to simplify audit and becomes accidental canonical ledger.
24. Compaction removes the normative semantic/profile reference needed to interpret a retained historical witness.

## 7. Portability / exit path

This hypothesis does not require Kafka, Flink, Temporal, a Saga framework, Certificate Transparency, SCITT, Merkle trees, a graph database, event sourcing, blockchain, a broker or centralized settlement service.

Any future realization must preserve:

- independent recovery, fencing, settlement and compensation dimensions;
- historical effect provenance without current-authority leakage;
- proof-scoped compaction and explicit below-retention semantics;
- resurrection-closure proof before dropping negative/fencing evidence;
- external-effect settlement outside transport/stream exactly-once claims;
- minimal durable witnesses rather than indefinite payload retention;
- target-qualified finality/fencing semantics;
- provider/transport portability without fabricated settlement;
- bounded offline runtime autonomy;
- Exchange Plane non-ownership of business settlement.

## 8. Deduplication against existing G4 research

This round does not reopen generic compaction, saga/workflow design, split-brain recovery, conflict propagation, exactly-once transport, privacy retention or non-fenceable effects. The material delta is their intersection at the **post-recovery historical closure boundary**: deciding when conflict/negative/fencing detail can safely disappear while historical external effects, unknown outcomes, compensation lineage and resurrection protection remain provable.

## 9. Maturity and next gap

Maturity: `RESEARCH_ACTIVE / NON_EXECUTABLE`, not saturated.

The next high-value gap is **settlement-witness portability and trust continuity across provider/archive migration**: determine how a compact historical effect witness remains verifiable when the original provider, signing key, schema, API, archive or trust root is retired; how to distinguish cryptographic verifiability from semantic/finality verifiability; and how long-term verification avoids retaining a live provider dependency or turning the Exchange Plane into a permanent settlement oracle.

No implementation, provider, workflow engine, settlement model, archive format, cryptographic mechanism or architecture binding is authorized by this research.