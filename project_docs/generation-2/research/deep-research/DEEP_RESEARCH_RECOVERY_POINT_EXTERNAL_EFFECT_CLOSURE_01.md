# Deep Research — Recovery-Point Rewind vs External-Effect Closure 01

Status: DEEP RESEARCH / RESEARCH RECOMMENDATION / NOT TARGET-ARCHITECTURE AUTHORITY
Phase: `RESEARCH_ADVERSARIAL_EDGE_CASE_SATURATION`
Affected capability: Security / Resilience / Failure Recovery
Primary cross-capability junction: Security/Recovery × Workflow × Integration × Messaging × Transaction/Consistency × Commercial/Payment × Provider/Binding × qualified evidence

## Question

When System Builder restores canonical runtime/data/workflow state to a recovery point `R`, what evidence is sufficient to resume privileged/business actuation safely when effects initiated after `R` may still exist outside the restored closure — for example payments, messages, provider mutations, emails, provisioned resources, human approvals/actions or physical work — and some of those external outcomes are delayed, duplicated or `UNKNOWN`?

More sharply:

> Can a locally consistent and healthy restore be treated as a globally safe business recovery point if the outside world did not roll back with it?

## Why this is architecturally material

The current G2 corpus already rejects several unsafe equivalences:

- provider acknowledgement != business effect;
- workflow completion != domain truth;
- deployment health != recovery qualification;
- backup presence != usable/safe restore;
- `UNKNOWN` mutating effect != `NOT_APPLIED`;
- compensation != “never happened”.

However, disaster recovery introduces a stronger temporal composition problem. Point-in-time recovery deliberately rewinds one state closure. External systems, people, physical assets and independently durable channels usually do not rewind to the same point. A restored system can therefore be internally valid yet causally inconsistent with effects that survived outside the restored state.

Example:

```text
10:00 canonical DB: payment = PENDING
10:01 provider charge succeeds
10:01 local receipt/event is persisted
10:02 backup/recovery point R = 10:00:30
10:03 webhook is delayed or local system fails
10:10 system is restored to R
10:11 workflow sees PENDING and retries charge
```

Every local component can be “correct” according to its own restored snapshot while the composite business result becomes a duplicate charge. The symmetrical failure is also possible: suppressing all post-R replay can lose obligations that truly were `NOT_APPLIED`.

This issue is not solved by one universal distributed transaction because providers, humans, physical acts, brownfield systems and offline Stations frequently sit outside any common rollback closure. It is also not solved by generic idempotency because provider idempotency windows, identity scopes and semantics differ, and an effect may be irreversible or observed only asynchronously.

The architectural question is therefore whether recovery qualification must include a **post-recovery-point external-effect reconciliation closure** before selected actuation resumes, and how that closure can remain provider-neutral without pretending that every effect is reversible.

## SB corpus consumed

This run treated breadth material as hypotheses/input evidence and reconciled it against the current authoritative state.

### Pipeline and research method

- `RESEARCH_PIPELINE_STATE.json`: phase is `RESEARCH_ADVERSARIAL_EDGE_CASE_SATURATION`; Full Pass 1 is active; Security / Resilience / Failure Recovery is the next unchallenged capability; Planning C remains blocked.
- `POST_MATH_ADVERSARIAL_EDGE_CASE_SATURATION_RESEARCH.md`: requires explicit challenge of recovery false-safety, ambiguous effects, replay, residual cohorts, provider divergence and recovery qualification.
- `edge-cases/PROCESSUAL_SEMANTIC_CONFLICT_CLASSIFICATION.md`: requires preservation of `ConflictPattern != ConflictInstance` and `Signal != ConfirmedConflict`, with catalogue/classify/detect/remediation-route as the default disposition.
- `RESEARCH_EVIDENCE_METHOD.md`: requires triangulation across mature systems, standards, literature and engineering evidence, preserving divergence.
- `ARCHITECTURE_PROOF_QUALITY_METHOD.md`: explicitly requires recovery, ambiguity, idempotency/order, provider-substitution and evidence proofs and rejects provider/API health as semantic proof.

### Existing G2 findings/candidates/coverage/proofs

- `CAPABILITY_DISCOVERY_REGISTER.md`: no additional top-level recovery capability candidate is currently required; cross-cutting semantics should first be merged into existing owners/qualified evidence where possible.
- `FINDING_INDEX.md`: preserves provider identity/currentness and reconcile-before-retry findings, especially when external mutation outcome is unknown.
- `REPRESENTATIVE_COVERAGE.md`: mature provider/identity/trust/portability research is already deep; this run targets a residual recovery composition problem rather than reopening broad coverage.
- `CAPABILITY_PROOF_MATRIX.md`: Security/Recovery already requires semantic recovery, persisted-vs-in-flight reconciliation, stale-trust rejection, split-brain/fencing, readiness invalidation and qualified local closure. The explicit persisted/in-flight proof requires classifying resumed work as resume/replay/compensate/quarantine/terminate without duplicate unauthorized effects.
- `PLANNING_B_SECURITY_RESILIENCE_FAILURE_RECOVERY_SB_CURRENT_STATE.md`: current-state reconciliation explicitly records generic recovery-point semantics, restore qualification, `UNKNOWN -> reconcile-before-retry`, business-state validation, reprotection and residual-cohort drainage as G2 gaps, while preserving bounded deployment rollback as a distinct implemented mechanism.

### Prior deep research deliberately not duplicated

- `DEEP_RESEARCH_TRANSACTION_COMMIT_EFFECT_01.md` separates acknowledgement/local commit/business effect/observation/unknown.
- `DEEP_RESEARCH_COMPOSITE_SAGA_EFFECT_CLOSURE_01.md` models heterogeneous effect obligations and rejects universal distributed ACID.
- `DEEP_RESEARCH_STATION_RECLAIM_FENCING_EPOCH_01.md` treats ownership/fencing after unreachable Station failure.
- `DEEP_RESEARCH_RECOVERY_AUTHORITY_ROOT_SEPARATION_OF_DUTIES_01.md` treats recovery authority/root separation and hidden super-roots.
- `DEEP_RESEARCH_RUNTIME_HEALTH_QUALIFICATION_CONVERGENCE_01.md` rejects health/readiness as population-wide semantic/security eligibility.

This run specializes a residual case not closed by those works: **temporal rewind of canonical state while external effects remain forward in time**.

## External evidence ledger

### E1 — Elnozahy et al., *A Survey of Rollback-Recovery Protocols in Message-Passing Systems* (ACM Computing Surveys, 2002)

Source: https://www.cs.cornell.edu/lorenzo/papers/SurveyFinal.pdf

Rollback-recovery literature formalizes the orphan problem: after rollback, surviving processes/effects can depend on events that the recovered process has forgotten. The survey also emphasizes output commit as the boundary between recoverable internal execution and interaction with the outside world.

**Evidence value:** strongest formal analogue for the G2 problem. Once an effect escapes the rollback closure, restoring one participant to an earlier state can create orphan dependencies unless recovery preserves/reconstructs the causal determinant or reconciles the outside effect before progressing.

### E2 — Elnozahy et al. survey, output-commit / message-logging consequence

Same source as E1.

The survey notes that a principal value of message logging is interaction with the outside world, because output cannot simply be retracted when internal state rolls back.

**Evidence value:** supports a portable principle: recovery correctness must reason about externally committed output separately from restorable internal state. It does not prescribe one G2 mechanism.

### E3 — Amazon RDS Point-in-Time Recovery

Source: https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/USER_PIT.html

RDS PITR restores a database to a specified earlier time by creating a new DB instance. The source remains separate. The provider proves a database recovery operation for the selected data closure; it does not claim to rewind external SaaS mutations, queues, people or other independently durable systems.

**Evidence value:** mature-system evidence that PITR has a bounded recovery subject. “Database restored” is not portable evidence that a distributed business process has globally returned to the same time.

### E4 — Google Cloud SQL Point-in-Time Recovery

Source: https://docs.cloud.google.com/sql/docs/sqlserver/backup-recovery/pitr

Cloud SQL PITR likewise restores an instance to a selected point in time and creates a new instance.

**Evidence value:** independent provider convergence on bounded storage-state rewind, strengthening the argument that cross-system effect reconciliation belongs above provider-specific PITR mechanics.

### E5 — Camunda 8 cluster backups / cold recovery

Sources:
- https://docs.camunda.io/docs/next/components/saas/backups/
- https://docs.camunda.io/docs/self-managed/concepts/multi-region/cold-recovery/

Camunda requires consistency across its own dependent cluster components for a backup and describes explicit RPO/RTO trade-offs for cold recovery.

**Evidence value:** demonstrates that even a mature workflow platform scopes backup consistency to a declared cluster closure. It strengthens the need to distinguish “workflow/platform recovery consistency” from independently committed external business effects.

### E6 — Stripe webhook duplicate delivery and ordering

Source: https://docs.stripe.com/webhooks

Stripe documents that webhook endpoints can receive duplicate events and that event delivery order is not guaranteed. Events may be retried and can arrive after local disruption/recovery.

**Evidence value:** concrete provider evidence that post-recovery observation can be delayed, duplicated and reordered. A restored local event ledger cannot assume that absence of an event at recovery time means the external effect did not occur.

### E7 — Stripe idempotency semantics are bounded/provider-specific

Source: https://docs.stripe.com/api-v2-overview

Stripe's API documentation distinguishes v1/v2 idempotency scope and retention windows. Idempotent replay is tied to provider API/account/key/window semantics.

**Evidence value:** falsifies a universal “retry with the same idempotency key solves recovery” assumption. Provider idempotency is valuable realization leverage but is not canonical proof that every recovered business operation can be retried safely indefinitely.

### E8 — NIST SP 800-34 Rev. 1, reconstitution

Sources:
- https://csrc.nist.gov/pubs/sp/800/34/r1/upd1/final
- https://nvlpubs.nist.gov/nistpubs/legacy/sp/nistspecialpublication800-34r1.pdf

NIST treats reconstitution as more than restoring files: the recovered system is tested and validated before normal operational status, including data/functionality validation and coordinated recovery responsibilities.

**Evidence value:** standards/governance evidence against “restore completed = return to normal operation”. It supports explicit post-restore qualification, though NIST does not define the G2 external-effect model.

### E9 — NIST compromise recovery / trusted-state requirement

Source: https://csrc.nist.gov/glossary/term/compromise_recovery

NIST defines compromise recovery as restoring to a secure/trusted state and verifying that secure state.

**Evidence value:** reinforces that return-to-service is a qualified claim, not a storage-provider completion event. For G2, business-effect closure is an additional dimension alongside trust/security requalification.

## Competing models

### Model A — Restore closure implies world rewind

```text
restore DB/workflow to R
→ mark recovery complete
→ resume all work from restored state
```

**For:** simplest operator model; common accidental assumption.

**Against:** false whenever post-R output escaped to providers, messages, humans or physical systems. Produces duplicate effects or contradictory states.

**Disposition:** `DO_NOT_BUILD` as portable semantics.

### Model B — Never replay anything after a restore

```text
restore to R
→ assume every post-R intended effect already happened
→ suppress replay
```

**For:** prevents some duplicate external actions.

**Against:** loses obligations that were never applied, failed before provider acceptance, or were only locally staged. It converts uncertainty into false success.

**Disposition:** `DO_NOT_BUILD`.

### Model C — Provider idempotency universally makes replay safe

**For:** excellent when a provider supports stable, long-lived, correctly scoped idempotency tied to the canonical semantic operation.

**Against:** idempotency contracts differ in identity, account scope, retention window, method coverage and outcome semantics; human/physical actions may have none. Provider-native keys also cannot become canonical business identity.

**Disposition:** `PROVIDERIZE` as realization leverage, never universal proof.

### Model D — Restore all systems to the same wall-clock timestamp

**For:** appears to restore a consistent distributed past.

**Against:** independent providers may not expose rollback at all; clocks/time boundaries do not prove causal consistency; external parties/humans/physical acts are not rewindable; rollback can itself violate policy or produce new side effects.

**Disposition:** `DO_NOT_BUILD` as universal requirement. Coordinated snapshots may be used inside a declared closure when supported.

### Model E — Recovery-point effect reconciliation closure

Before an operation whose semantic correctness depends on post-R effects is retried or allowed to advance, reconstruct/reconcile the **effect-obligation frontier** across the recovery cut.

Illustrative concept:

```text
RecoveryCut {
  recoveredSubject + recoveryPoint/revision
  restoredClosure[]
  externalEffectObligations[] {
    semanticOperationIdentity + revision
    obligationIdentity
    correlation/idempotency identity
    last internally known disposition at/before R
    possible post-R attempt window
    external realization/provider binding
    current evidence
    disposition: APPLIED | NOT_APPLIED | PARTIAL | UNKNOWN | INCONCLUSIVE
    reconciliation/compensation/manual route
  }
}
```

The model does **not** require every obligation to block all service. Recovery policy may classify effects by risk and dependency. Read-only or unrelated operations can resume while high-risk ambiguous external mutations remain quarantined.

**Disposition:** strongest model; `KEEP + GENERALIZE + SPECIALIZE + PROVIDERIZE` as research recommendation, merged with existing effect-closure and qualified-evidence semantics rather than promoted as a new capability.

## Strongest evidence for the recommendation

1. Rollback-recovery theory explicitly recognizes orphan states and output-commit boundaries when recovered state forgets events that influenced surviving participants/external world.
2. Mature PITR providers scope recovery to their own database instance/closure; they do not claim global business rollback.
3. Mature workflow backup systems require internal consistency across their own components, again demonstrating bounded recovery closure rather than universal rewind.
4. Stripe demonstrates delayed/duplicate/out-of-order external evidence and provider-bounded idempotency semantics, making “absence after restore” and “blind retry” both unsafe.
5. NIST recovery/reconstitution requires validation before normal operation, supporting a qualified return-to-service boundary.
6. Existing G2 `CompositeEffectClosure` already has the right per-obligation/evidence direction; this research adds the missing **recovery-cut dimension** rather than inventing a competing semantic owner.

## Strongest evidence against over-generalization

The research does **not** prove that every restore requires scanning every external system before any service can resume.

- A purely local operation with no post-R external effect has no such cross-cut obligation.
- Some providers can prove strong idempotent replay or query-by-canonical-correlation semantics, reducing reconciliation cost.
- Some effects are advisory and do not gate core business recovery.
- Coordinated snapshots/logs can close a bounded set of components strongly.
- Recovery procedures may legitimately choose a documented business cut, compensation, write quarantine or manual disposition instead of exact reconstruction.

Therefore the portable invariant should be **risk/obligation-scoped**, not a universal global barrier.

## Contradictions resolved

### C1 — “RPO met” versus “business state safely rewound”

Resolved: RPO describes recoverable state loss for a declared recovery subject; it does not prove that external effects after that point vanished.

### C2 — “Provider idempotency” versus “semantic exactly-once across recovery”

Resolved: provider idempotency is realization-specific evidence. It can strengthen a particular obligation's replay safety but cannot be generalized across providers/effects or beyond its retention/scope.

### C3 — “Workflow/db internally consistent” versus “composite process consistent”

Resolved: internal consistency is necessary but insufficient when effect obligations cross the restored closure.

### C4 — “Compensate external effects” versus “restore means they never happened”

Resolved: compensation is a new semantic effect with lineage. It cannot rewrite historical occurrence.

## Contradictions intentionally left open

1. Exact minimal representation of a `RecoveryCut` or equivalent relation is deferred; it may be representable entirely as qualified effect-obligation evidence plus recovery-point applicability.
2. Which obligations block return-to-service is domain/policy-specific and must remain with semantic owners rather than Security/Recovery inventing business policy.
3. Some external systems cannot be queried strongly enough to resolve `UNKNOWN`; bounded manual/accepted-risk/quarantine dispositions remain necessary.
4. There is no evidence for a single universal retention period for correlation/idempotency evidence.
5. Recovery across disconnected Stations may require additional local-closure and later reconciliation semantics already explored by Station research.

## New conflict pattern

### `G2-CONFLICT-PATTERN-RECOVERY-CUT-001` — Recovery-point rewind conflicts with surviving external effects

**Family:** recovery + state-transition + temporal/order + data/postcondition + provider + cross-process.

**Narrative:** A locally valid restore reverts canonical/workflow state to a point before an external effect, while the external effect itself remains applied or may have been applied. Replaying from the restored state duplicates the effect; suppressing replay may lose an unapplied obligation.

**Activation conditions:**

- a recovery/restore rewinds at least one authoritative state closure to `R`;
- one or more semantic effect obligations could have been attempted after `R`;
- at least one relevant sink is outside the rewind closure or has independent durability/ordering;
- current external-effect evidence is incomplete, delayed, stale, contradictory or `UNKNOWN`; and
- resumed logic can retry, compensate, advance, bill, notify, allocate, provision or otherwise act based on the rewound state.

**Incompatible claims/actions/states:**

- restored local state claims `effect not yet applied/pending`;
- external world may truthfully contain `effect applied`;
- replay action assumes `NOT_APPLIED`;
- business invariant requires no duplicate/contradictory effect.

**Why local validation may miss it:**

- backup integrity can pass;
- database PITR can pass;
- workflow engine recovery can pass;
- runtime readiness can pass;
- provider API can be healthy;
- every restored object can satisfy its local schema;
- the contradiction exists only across the recovery cut and external causal/effect lineage.

**Falsification path:** demonstrate that all externally meaningful post-R effects are either (a) inside one provably consistent recovery closure, or (b) have durable causal/effect determinants retained outside the rollback and can be deterministically reconstructed/reconciled before any conflicting actuation. If this can be proven for all supported profiles, the pattern narrows substantially. Current evidence across SaaS/human/physical/provider boundaries falsifies such universality.

**Detection stages / candidates:**

- design-time: identify effect obligations whose sink is outside declared recovery closure; require a declared recovery/reconciliation disposition;
- pre-recovery: derive possible post-R external-effect window from recovery point and retained effect lineage;
- post-restore/pre-write: compare restored obligation frontier with external provider/event/correlation evidence;
- runtime: detect replay of an obligation whose pre-failure attempt/effect disposition is `UNKNOWN` or whose correlation evidence survived outside the restored state;
- audit: detect duplicate/contradictory effects whose causal parents straddle the recovery cut.

**Owner set:**

- Security / Resilience / Failure Recovery owns recovery-point/path/return-to-service qualification;
- Workflow/Executable Composition owns stage/resume/replay semantics;
- Transaction/Consistency owns invariant and ambiguity-safe retry constraints;
- Integration/Messaging/Commercial/domain owners own each external semantic effect/postcondition;
- Provider/Binding owns provider support/realization semantics;
- UCA/qualified evidence, if used, owns only structural qualification/provenance envelope, not business truth.

**Severity:** `CRITICAL` for payment, destructive provider mutation, safety/physical actuation, entitlement/credential issuance or externally irreversible effects; `HIGH` for most durable business side effects; lower only for explicitly advisory/idempotent consequences.

**Confidence:** `strongly supported`.

**Detectability:** pre-execution where recovery closure/effect obligations are declared; runtime/post-effect for delayed or provider-dependent evidence; audit-only for some human/physical effects.

**Blast radius:** workflow instance → process → Station/system → enterprise/external parties depending on effect type and replay fan-out.

**Reversibility:** ranges from easy reconciliation to bounded compensation to potentially irreversible.

**Time-to-harm:** immediate for replayed payments/provisioning; delayed/cumulative for duplicated messaging, billing or downstream process forks.

**Misuse likelihood:** accidental `likely` in naïve restore/replay; adversarially exploitable where a restore can intentionally erase local evidence of an external act.

**Evidence currentness:** must be current/applicable to the recovery point, operation revision, provider binding/account, correlation identity and relevant replay/idempotency horizon.

**False-positive risks:**

- effect was purely local and inside the recovery closure;
- provider proves durable idempotent replay for the exact semantic operation and current scope;
- effect is explicitly advisory and duplicate-safe;
- coordinated recovery restored all relevant participants to one causally consistent state;
- operator intentionally selected an accepted-risk business cut with documented compensation/manual route.

**Future remediation routes when a concrete instance is confirmed:**

- reconcile external state before retry;
- quarantine only affected obligations/operations;
- resume from retained external-effect evidence rather than restored local assumption;
- use provider-qualified idempotent replay when its contract still applies;
- compensate with explicit new-effect lineage;
- require human/business-owner disposition when exact reconciliation is impossible;
- accept documented risk under authorized exception;
- choose forward recovery instead of destructive replay where evidence supports it.

Research does not select one universal remediation.

## Preventive invariant candidate

Evidence is strong enough for one narrow, ownerable candidate:

> **A recovery-point rewind must not convert a post-recovery-cut external mutating effect from `APPLIED/PARTIAL/UNKNOWN/INCONCLUSIVE` into inferred `NOT_APPLIED`, nor authorize conflicting replay solely because restored local state predates the effect.**

This does not require global synchronization and does not prohibit legitimate replay. It requires current qualified evidence or an explicit domain/provider recovery disposition before a potentially conflicting external mutation is repeated.

Related separation:

```text
RestoredStateConsistency
    != ExternalEffectClosure
    != SecurityReprotection
    != ReturnToServiceEligibility
```

All four can contribute to recovery qualification but remain separately ownered.

## Provider-specific versus portable semantics

### Portable candidates

- recovery subject/closure identity and revision;
- recovery point/cut applicability;
- semantic effect-obligation identity/correlation lineage;
- externally escaped effect classification;
- effect disposition `APPLIED | NOT_APPLIED | PARTIAL | UNKNOWN | INCONCLUSIVE` where applicable;
- evidence provenance/currentness/scope;
- reconcile-before-conflicting-retry invariant for unresolved mutating effects;
- explicit compensation/manual/accepted-risk lineage;
- return-to-service claim scoped by unresolved high-risk obligations.

### Providerized mechanics

- RDS/Cloud SQL PITR mechanics;
- database WAL/binlog/checkpoint details;
- Kafka/broker offset and transaction mechanisms;
- Stripe idempotency keys, event IDs, object queries and retry windows;
- Camunda/Temporal backup/history recovery;
- provider resource version/ETag/request IDs;
- payment reversal/refund APIs;
- cloud resource import/discovery after restore.

### Do not universalize

- provider wall-clock recovery timestamp as global causal cut;
- one provider's event/request ID as canonical operation identity;
- one idempotency retention window;
- one compensation verb such as `refund` as generic rollback;
- one workflow engine history as complete external effect truth;
- `backup restored`, `runtime healthy` or `webhook absent` as proof that an effect did not happen.

## Consequences for existing findings/candidates/hypotheses

### `DEEP_RESEARCH_COMPOSITE_SAGA_EFFECT_CLOSURE_01`

**KEEP + GENERALIZE.** Add recovery-cut applicability: effect obligations must remain interpretable across restore, and a recovery process must not lose externally escaped obligation evidence needed to classify replay safety.

### Security / Resilience / Failure Recovery

**KEEP + SPECIALIZE.** Security/Recovery owns recovery-point/path and return-to-service qualification, but must not become the semantic owner of payment, messaging, workflow or domain postconditions.

### Transaction / Consistency / Concurrency

**KEEP + GENERALIZE.** `UNKNOWN -> reconcile-before-retry` is especially material across rollback cuts. The relevant invariant is not universal exactly-once but prevention of duplicate/conflicting semantic effects under uncertainty.

### Workflow & Durable Execution

**SPECIALIZE.** Resume/replay decisions must distinguish a recovered execution history from current external-effect truth.

### Provider / Binding

**PROVIDERIZE.** Provider-specific idempotency/query/recovery capabilities become support dimensions that can strengthen or weaken reconciliation routes without changing canonical effect identity.

### Universal Capability Architecture

**DEFER exact representation.** Reuse qualified evidence/effect lineage if sufficient. `DO_NOT_BUILD` a universal recovery god-object or generic “world snapshot”.

### Capability taxonomy

**DO_NOT_PROMOTE** a new 29th capability from this finding. Ownership is cross-capability but not ownerless.

## Failure/adversarial analysis

### F1 — Payment applied after recovery point; local receipt lost by PITR

Risk: duplicate charge on workflow replay.

Safe research expectation: classify payment obligation as unresolved/applied only after current provider/correlation evidence; no blind retry from restored `PENDING`.

### F2 — Provider create timed out before failure; restored system has no external ID

Risk: duplicate leaked external resource after retry.

Safe expectation: reconcile using canonical correlation/provider search support where possible; otherwise retain `UNKNOWN` and quarantine/manual disposition.

### F3 — Message published after R; consumer acted; producer DB restored before publish marker

Risk: producer republishes and consumer duplicates downstream mutation.

Safe expectation: external publication/consumer effect evidence must survive or be reconciled; broker ACK semantics alone do not prove downstream domain acceptance.

### F4 — Human approval/action occurred after R

Risk: restored workflow asks for duplicate approval or repeats physical task.

Safe expectation: human task/workflow completion record is not enough if it was lost; authoritative human/domain evidence must be reconciled where materially required.

### F5 — Refund/compensation occurred after R

Risk: restore resurrects original obligation and charges again because compensation lineage disappeared locally.

Safe expectation: compensation is an effect obligation with historical lineage and must not be erased by restore semantics.

### F6 — Provider idempotency window expired during outage

Risk: replay with same key is no longer guaranteed duplicate-safe.

Safe expectation: provider support/currentness must be requalified; key reuse is not universal proof.

### F7 — Old provider still delivers delayed callback after provider substitution during recovery

Risk: restored/new provider state plus old callback creates cross-provider duplicate or state regression.

Safe expectation: provider binding/revision is part of evidence applicability; old-provider callback remains evidence about old obligation realization, not automatic current mutation authority.

### F8 — Offline Station reconnects with post-R valid effects

Risk: central restore treats Station work as lost and reallocates/replays it.

Safe expectation: Station's qualified local closure/effect evidence must reconcile before reclaimed resources or duplicate acts are authorized; preserve non-amplification and existing fencing/escrow research.

### F9 — AI/operator sees healthy restored system and triggers bulk retry

Risk: confidence/operational convenience manufactures false `NOT_APPLIED` for unresolved effects.

Safe expectation: AGWS/AI may propose reconciliation but cannot strengthen evidence or gain recovery actuation authority.

## Proof obligations

### `DR-RPEEC-01` — payment survives local PITR
Restore canonical state to before a provider-confirmed charge whose local receipt is outside the recovery point. Prove recovery does not replay a second charge solely from restored `PENDING` state.

### `DR-RPEEC-02` — truly not-applied external mutation
Restore across an attempted provider create that is authoritatively proven `NOT_APPLIED`. Prove replay remains possible under current authority/provider profile and does not over-quarantine safe work.

### `DR-RPEEC-03` — timeout/UNKNOWN create across restore
Lose acknowledgement after provider create, then restore before the local external binding was recorded. Prove result remains `UNKNOWN`/reconcile-before-retry until external identity is recovered or manually dispositioned.

### `DR-RPEEC-04` — provider idempotency horizon expiry
Recover after the provider's documented idempotency retention horizon. Prove stale idempotency evidence cannot be treated as current duplicate-prevention proof.

### `DR-RPEEC-05` — duplicate/out-of-order callback after restore
Deliver a pre-failure provider event twice and out of order after recovery. Prove no state regression or duplicate canonical effect occurs merely due to restored event-consumption history.

### `DR-RPEEC-06` — message externalized, local outbox/marker rewound
Publish an event and cause downstream domain acceptance, then restore producer state before its publication marker. Prove producer recovery cannot infer `NOT_PUBLISHED` and blindly duplicate a non-idempotent downstream effect.

### `DR-RPEEC-07` — compensation survives recovery cut
Apply original effect, apply compensation, then restore local state to between them. Prove recovery preserves/reconciles both historical effect lineages and does not treat compensation as never having happened.

### `DR-RPEEC-08` — human/physical effect outside rollback closure
Complete a human/physical task after `R`, lose local completion evidence, restore to `R`, and prove the system requires appropriate current evidence/manual reconciliation before issuing a conflicting duplicate instruction where harm is material.

### `DR-RPEEC-09` — unrelated service resumes under partial recovery closure
Keep one high-risk external obligation `UNKNOWN` but prove unrelated read/write domains may resume when their declared recovery dependencies are satisfied. This falsifies an over-broad global recovery barrier.

### `DR-RPEEC-10` — provider substitution during recovery
Old provider has ambiguous post-R effect; new provider is bound during restore. Prove substitution does not erase the old obligation lineage or reinterpret old provider IDs as current canonical identity.

### `DR-RPEEC-11` — Station offline effect crosses central recovery cut
Execute a valid bounded offline Station effect after central recovery point; restore central state before it; reconnect. Prove central recovery does not duplicate/reclaim the effect before Station evidence reconciliation and does not grant the Station new authority.

### `DR-RPEEC-12` — stale trust/authority plus externally applied effect
Restore an operation whose external effect exists but whose current authority/trust would no longer permit a new invocation. Prove historical effect recognition does not authorize replay or fresh actuation.

### `DR-RPEEC-13` — recovery health cannot imply external closure
Make database/runtime/workflow health checks all pass while one high-risk external effect is `UNKNOWN`. Prove return-to-service evidence preserves that unresolved dimension rather than upgrading it to fully safe business convergence.

### `DR-RPEEC-14` — AI/low-code bulk replay non-amplification
Ask AI/AGWS to “replay everything lost after backup” when external evidence is incomplete. Prove it cannot manufacture `NOT_APPLIED`, bypass reconciliation or expand its actuation authority.

### `DR-RPEEC-15` — provider conformance differential
Run the same semantic recovery case against two providers with materially different idempotency/event-query semantics. Prove canonical effect identity/disposition remains stable while provider support vector and reconciliation route differ.

### `DR-RPEEC-16` — causal/orphan recovery model candidate
Model-check or property-test a minimal two-participant system where local state rolls back but an external effect survives. Required property: no conflicting replay is authorized while the prior effect can still be `APPLIED` or `UNKNOWN`; liveness test must also show operations proven `NOT_APPLIED` can eventually proceed.

## Research dispositions

- **KEEP** the existing evidence-qualified effect lifecycle and `UNKNOWN -> reconcile-before-retry` principle.
- **GENERALIZE** composite effect closure with explicit recovery-point/cut applicability.
- **SPECIALIZE** recovery qualification so Security/Recovery owns recovery-point/path/return-to-service claims while domain owners retain business postconditions.
- **PROVIDERIZE** PITR, message-log, idempotency, callback-query, refund/reversal and provider-discovery mechanics.
- **MERGE** with existing qualified-evidence, historical-lineage and residual-cohort research rather than creating a new top-level primitive prematurely.
- **DEFER** exact target representation (`RecoveryCut`, effect frontier, relation/envelope naming) to Planning C after adversarial saturation.
- **DO_NOT_BUILD** a universal “restore means the world returned to timestamp R” semantic, a generic global retry-after-restore, or a universal idempotency abstraction that hides provider expiry/scope.

## Confidence

**Overall: STRONGLY SUPPORTED.**

The failure class is supported independently by formal rollback-recovery literature, mature PITR products, workflow recovery semantics, asynchronous provider/event behavior and NIST reconstitution principles. The exact G2 representation is intentionally not frozen.

## Saturation impact

This deep dive does not increment Full Pass count and does not mark Security / Resilience / Failure Recovery as breadth-covered.

`G2-CONFLICT-PATTERN-RECOVERY-CUT-001` is material. When consumed by the adversarial breadth register, the Security/Recovery local streak must be/reset remain `0`. It also materially affects these existing high-risk clusters, whose streaks should remain/reset `0` if the breadth reconciliation judges this activation family not already subsumed:

- Workflow × Integration × Messaging × external mutation;
- Observability × Security/Recovery × runtime truth;
- Commercial Metering × Entitlements × Rating × Billing × Payment where external settlement is involved;
- Provider/Binding × external realizations;
- Data/Schema × Storage × Lifecycle where PITR/recovery cuts are used.

No 13th mandatory cluster is proposed.

## Unresolved questions

1. Should the recovery-cut frontier be represented as a specialization of `CompositeEffectEvidence`, a qualified relation over recovery-point applicability, or only as proof-time composition? Target architecture must decide the smallest sufficient shape.
2. How should large fan-out systems efficiently discover possible post-R external effects when provider query APIs are incomplete or rate-limited?
3. Which business owners may accept an irreducible `UNKNOWN` as documented risk, and how does that authority compose with Enterprise → Station → Role → Person without recovery privilege amplification?
4. How long must correlation/effect determinants survive relative to maximum backup age, provider idempotency/event-retention windows and legal/privacy obligations?
5. How should a recovery cut interact with intentional event-sourcing replay where external side effects are normally suppressed or rederived through separate projections?

## Recommended next deep question

After the breadth Security/Recovery register materializes, the next highest-value deep question should be selected from its residual contradictions rather than assumed now. A likely candidate, only if still unresolved, is:

> **How should security containment and business recovery race when the quickest recovery path requires re-enabling a cohort/provider/credential that incident containment has intentionally quarantined, and both actions are locally valid under different objectives?**

That question would attack a true processual conflict between containment invariants and recovery/RTO pressure without repeating root-recovery or recovery-cut semantics.