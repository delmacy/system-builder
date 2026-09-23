# G4 Recovery — Incremental Rediscovery, Finite Dedup Retention & Effect Fingerprint Research

Date: 2026-09-23
Status: `RESEARCH_ACTIVE / NON_EXECUTABLE`
Execution authority: NONE

## 1. Research question

After `REBOOTSTRAP_WITH_GAP`, predecessor evidence may reappear incrementally over hours, days, or later recovery cycles while provider idempotency records, broker sequence state, caches, detailed audit payloads, and privacy-permitted records have finite retention. How can the G4 Web Desktop/Application Environment preserve enough effect lineage to prevent duplicate effects, double-spend, repeated compensation, or oscillating containment without turning finite provider dedup windows into permanent semantic truth or retaining prohibited payload indefinitely?

This round is documentary P&D only. It does not authorize implementation, WBS, Work Packages, Sprints, TASKs, migrations, provider adoption, or product changes.

Primary hierarchy remains the candidate:

`Builder Home/Factory -> Client -> Workspace -> Desktop Sphere -> Application -> Window -> View/Tab/Tool`.

3D remains an optional projection/application, not a mandatory navigation foundation.

## 2. Repository boundaries preserved

- `Builder != Runtime`; published runtimes remain autonomous.
- `Install != Adopt`; `Register != Deploy`; `Connect != Own`; `Discovered != Verified`.
- `SecretRef != secret value`.
- `Policy != configuration`.
- `Desired != Observed != Effective`; `Configured != Applied != Effective`.
- `Unified UI != one semantic owner/store`.
- `Deployment Unit != physical server`; `Service identity != raw IP`.
- `Window/session lifecycle != service lifecycle`.
- `Automatic != hidden`.
- `Adapter normalization != fabricated equivalence`.
- `Dedup window expired != old obligation became new`.
- `Rediscovered predecessor evidence != automatic rollback`.
- `Successor effect already occurred != evidence may be ignored`.
- `Gap narrowed != gap closed`.
- `Compensation != time reversal`.

## 3. Inputs reconciled from the concurrent research program

### 3.1 Post-freeze backlog fairness

The recent editor research separates urgency/priority/fairness from authority/admissibility/safety. This matters here because incremental rediscovery can suddenly expose many old obligations or remediation candidates. A rediscovery burst must not be converted into bulk execution merely because items are old, overdue, high priority, or fairness-deprived.

Portable boundary:

`rediscovered backlog priority != effect authority`.

### 3.2 Desktop attention and notification orchestration

The recent Web Desktop research separates producer severity, user interruption, acknowledgement, action, effectiveness, and resolution. Incremental rediscovery therefore must not create notification storms or allow dismiss/acknowledge to alter semantic reconciliation state.

Portable boundaries:

`notification coalescing != semantic deduplication`;
`UI dismiss != reconciliation resolved`;
`badge count != canonical effect count`.

## 4. External grammars reviewed

### 4.1 AWS idempotency tokens

Current AWS EC2 documentation states that retries with the same client token and the same parameters can return successfully without repeating the operation, while reuse of the same token with materially different parameters yields an idempotency mismatch. AWS Well-Architected guidance recommends stable tokens across downstream calls, warns against timestamp-derived keys and inconsistent keys, and explicitly allows old token records to be expired/removed for storage and performance reasons.

Portable lessons:

`stable idempotency token != permanent semantic memory`;
`token TTL expired != historical effect became new`;
`same token + incompatible parameters != safe duplicate`.

### 4.2 Stripe finite idempotency retention

Stripe documents that idempotency results can be pruned after at least 24 hours; reuse of a pruned key can generate a new request. This is direct evidence that a provider's finite idempotency window is an operational duplicate-suppression contract, not a permanent historical identity oracle.

Portable lesson:

`provider forgot key != effect never happened`.

### 4.3 Apache Kafka producer idempotence

Kafka's idempotent producer uses producer identity plus sequence numbers so broker retries do not duplicate records. Current documentation also makes the guarantee dependent on producer/session/configuration semantics; application-level re-sends outside the intended lineage cannot simply be assumed deduplicated.

Portable lesson:

`transport/session dedup != end-to-end business dedup`.

### 4.4 Data minimization

NIST privacy guidance emphasizes collecting/processing only information necessary for the stated purpose and notes that retained personal information creates additional privacy/security exposure.

Portable lesson:

`dedup safety requirement != permission to retain full payload forever`.

A durable minimal effect fingerprint must therefore be purpose-scoped and minimized rather than treated as a justification for indefinite raw-event retention.

## 5. Primary finding — dedup retention and effect identity are different lifecycles

The semantic identity of an occurrence may need to outlive the provider mechanism that once suppressed duplicates.

```text
EffectOccurrence
  effectId
  semanticOwner
  clientRef
  environmentRef
  operationClass
  subjectScope
  admittedUnderRef
  externalCorrelationRef?
  occurrenceDisposition

ProviderDedupRecord
  providerRef
  providerScope
  providerTokenRef
  parametersFingerprint
  retentionHorizon
  observedDisposition
  currentness
```

Hard rule:

`PROVIDER_DEDUP_RECORD_EXPIRED != EFFECT_IDENTITY_EXPIRED`.

The provider may legitimately forget a token while the System Builder still must remember that a historical effect may have happened.

## 6. Candidate `EffectFingerprint`

Where full payload retention is unnecessary, prohibited, or disproportionate, a minimized durable fingerprint may preserve enough lineage for later reconciliation.

Candidate fields:

```text
EffectFingerprint
  fingerprintId
  effectId
  clientRef
  environmentRef
  semanticOwnerRef
  operationClass
  canonicalParameterDigest?
  parameterSchemaRef?
  subjectDigestOrScopedRef?
  providerClass?
  externalCorrelationDigest?
  admissionPolicyRef
  recoveryEpochRef
  firstKnownDisposition
  latestKnownDisposition
  effectTimeBasis?
  retentionPurpose
  retentionClass
  privacyClassification
  createdAtEvidenceRef
  supersessionRef?
```

The exact set is operation-specific. The fingerprint is not a universal hash of every payload.

Rules:

```text
FINGERPRINT != FULL PAYLOAD
FINGERPRINT MATCH != EFFECT SETTLED
FINGERPRINT ABSENT != EFFECT ABSENT
HASH EQUALITY != SEMANTIC EQUIVALENCE WITHOUT CANONICALIZATION CONTRACT
```

A digest is useful only when its canonicalization/schema/subject scope is qualified. Otherwise adapters can accidentally or maliciously fabricate equivalence.

## 7. Dedup confidence is a lattice, not a boolean

Candidate dispositions:

```text
PROVEN_SAME_EFFECT
STRONG_DUPLICATE_CANDIDATE
WEAK_DUPLICATE_CANDIDATE
PROVEN_DISTINCT_EFFECT
PARAMETER_CONFLICT
BELOW_DEDUP_FLOOR
PROVIDER_RECORD_EXPIRED
INSUFFICIENT_EVIDENCE
UNKNOWN
```

`DUPLICATE_CANDIDATE` may degrade to `UNKNOWN` when the only supporting evidence expires or becomes unqualified. It must not silently remain green because it was once classified.

Conversely, expiration of a provider record does not automatically destroy stronger durable evidence such as stable semantic effect identity, an external immutable receipt, a qualified effect-side record, or a durable fingerprint whose proof obligations remain satisfied.

## 8. Incremental rediscovery requires a monotonic reconciliation ledger, not repeated fresh guesses

Each predecessor fragment creates a new `RediscoveryEvidenceOccurrence` linked to prior reconciliation state.

```text
RediscoveryEvidenceOccurrence
  rediscoveryId
  clientRef
  environmentRef
  predecessorEpochRef
  successorEpochRef
  evidenceIdentity
  evidenceCoverage
  evidenceCurrentness
  affectedEffectRefs[]
  priorReconciliationRevision
  newComparisonDelta
  gapDelta
  contradictionDelta
  remediationDelta
```

The system preserves what was learned and why. Later fragments may narrow, contradict, supersede, or leave prior conclusions unchanged.

Rules:

```text
NEW_FRAGMENT != RESTART_RECONCILIATION_FROM_ZERO
MORE_FRAGMENTS != AUTOMATIC_GAP_CLOSURE
SAME_FRAGMENT_REDELIVERED != NEW HISTORICAL FACT
FRAGMENT_ORDER != BUSINESS CAUSAL ORDER
```

## 9. Anti-oscillation semantics

Incremental rediscovery can otherwise cause cycles such as:

`UNKNOWN -> duplicate candidate -> unknown -> compensate -> new evidence -> undo compensation -> compensate again`.

The candidate model separates evidence classification from action commitment.

```text
EvidenceRevision -> ReconciliationAssessment -> ActionPlanRevision -> ActionOccurrence
```

Once an irreversible remediation/compensation effect occurs, later evidence cannot erase it. A new plan must account for the remediation as another historical effect.

Hard rules:

```text
ASSESSMENT_CHANGED != PREVIOUS_ACTION_UNHAPPENED
COMPENSATION_ALREADY_EFFECTIVE != COMPENSATE_AGAIN BY DEFAULT
RECONCILIATION_REOPENED != ACTION BUDGET RESET
```

Candidate containment includes stable action identity, remediation budgets, cooldown/hysteresis for presentation/replanning only, and explicit materiality thresholds. Hysteresis cannot fabricate currentness or suppress a material contradiction.

## 10. Repeated compensation prevention

Every compensation/remediation action needs stable lineage to the effects/unknowns it addresses.

Candidate key:

```text
RemediationLineage
  remediationId
  targetEffectSetRef
  reasonInvariant
  triggeringEvidenceRevision
  actionClass
  authorityRef
  idempotencyRef?
  priorRemediationRefs[]
  currentDisposition
```

Before proposing another compensation, the system asks whether the same semantic deficit was already addressed, whether the previous compensation was effective, and whether the new evidence changes the deficit rather than merely restating it.

`new evidence != new compensation right`.

## 11. Retention tiers

A single retention period is unsafe and privacy-hostile. Candidate tiers are:

1. **Provider operational dedup record** — provider-defined and potentially short-lived.
2. **Local hot dedup cache** — performance aid; loss does not change semantic identity.
3. **Effect fingerprint** — minimized durable lineage for claims that require long-lived duplicate/double-spend reconciliation.
4. **Qualified external receipt/effect-side evidence** — retained according to its own legal/operational purpose.
5. **Full payload/source evidence** — retained only where independently required and authorized.

Rules:

```text
HOT CACHE EVICTED != EFFECT FORGOTTEN
FULL PAYLOAD ERASED != EFFECT IDENTITY MUST BE ERASED
FINGERPRINT RETAINED != RAW DATA RETENTION AUTHORIZED
```

Retention law is claim/purpose-specific. Privacy erasure can remove payload while preserving a legally/operationally justified minimized non-reversible or pseudonymous fingerprint where policy permits; where even that is not permitted, the resulting dedup guarantee must degrade visibly rather than invent continuity.

## 12. Below-floor semantics

When all evidence capable of proving sameness has expired or been erased, the system must not treat an old request as new merely because it cannot deduplicate it.

Candidate disposition:

`BELOW_DEDUP_FLOOR`.

Consequences are operation-specific:

- require effect-side lookup;
- require human/business confirmation;
- create a new effect only after explicit re-admission that acknowledges duplicate risk;
- block if the invariant cannot tolerate duplication;
- use a fresh fence/generation when that makes future effects safe;
- preserve `UNKNOWN` if no safe determination exists.

`BELOW_DEDUP_FLOOR != SAFE_TO_RETRY`.

## 13. Canonicalization and privacy collision risks

A minimal digest can fail in two directions.

**False split:** semantically identical parameters serialize differently and produce different digests.

**False merge:** over-normalization removes a material distinction and produces the same digest for semantically different effects.

Therefore:

```text
DIGEST ALGORITHM != CANONICALIZATION SEMANTICS
ADAPTER NORMALIZATION != SEMANTIC EQUIVALENCE
```

Every fingerprint binds the canonicalization/schema/profile identity used to derive it. Cross-version comparison requires an explicit compatibility relation; a new adapter cannot reinterpret old fingerprints under new normalization rules silently.

Privacy also matters: low-entropy subject fields can make unsalted/plain hashes reversible by dictionary attack. Fingerprints need purpose-qualified keyed/opaque identifiers or other privacy-preserving construction where appropriate, plus Client scoping to prevent cross-tenant correlation.

## 14. Application Manager consequences

- Discovery/registration records can have shorter retention than semantic ownership/effect lineage; `Discovered != Verified` remains absolute.
- A provider forgetting an install/adopt token does not convert an adopted application into a new install candidate.
- `SB_MANAGED`, `EXTERNALLY_MANAGED`, `CO_MANAGED`, and `OBSERVE_ONLY` remain current-authority modes; dedup history cannot grant mutation authority.
- An externally managed app cannot be silently upgraded because an old provider request token expired.
- Upgrade/unregister/uninstall use distinct operation/effect identities; one cannot deduplicate another merely because parameters look similar.
- Supply-chain/source integrity is independent from dedup/effect identity.

## 15. Control Center consequences

Control Center should project:

- provider dedup horizon versus semantic effect-retention horizon;
- fingerprint coverage and privacy class;
- `BELOW_DEDUP_FLOOR`/`UNKNOWN` populations;
- incremental rediscovery revisions and gap deltas;
- duplicate candidates versus proven duplicates;
- remediation/compensation lineage;
- retention-policy semantic diff and blast radius;
- app-specific advanced retention settings with semantic owner/provenance.

A global retention change can reduce future proof capability and therefore requires explicit semantic impact analysis. It must not trigger unexpected restart or deletion of live semantic obligations.

```text
RETENTION CONFIGURED != RETENTION APPLIED != PROOF CAPABILITY EFFECTIVE
```

## 16. Declarative Service Deployment consequences

- Provider deployment tokens are provider artifacts, not Service identity.
- Expiry of a provider deployment token does not make an existing Service semantically new.
- `Deployment Unit != physical server`; `Service identity != raw IP`.
- Provider ACK or deployment receipt may contribute effect evidence only for its declared claim.
- Raw YAML/manifests remain compiled/exportable provider artifacts; they do not become canonical desired state because they contain a historical token.
- Placement migration preserves Service identity while old/new effect authority and fencing remain separately proven.

## 17. Vault, secret and environment bindings

Dedup fingerprints never contain secret values.

```text
SECRETREF != SECRET VALUE
SAME SECRETREF != SAME CREDENTIAL GENERATION
NEW CREDENTIAL WORKS != OLD CREDENTIAL FENCED
```

Automatic Vault/network/storage/environment bindings must expose the dependency/generation/provenance that matters to effect identity. A hidden automatic binding cannot silently change the canonicalization/fingerprint basis.

Credential rotation may intentionally make old effect-side retries impossible; this is fencing evidence, not proof that historical effects never occurred.

## 18. Hosting/placement consequences

Shared infrastructure does not create shared dedup identity, data ownership, or authority. Fingerprints and rediscovery ledgers are Client/Environment/semantic-owner scoped.

Migration between shared managed, dedicated managed, external/BYOI, and existing-service placements preserves semantic Service identity. Provider-local idempotency scopes may change across placement, so end-to-end effect identity must not be derived solely from provider token scope.

`PLACEMENT MIGRATION != EFFECT IDENTITY RESET`.

## 19. Desktop, Observatory and attention consequences

Desktop Observatory and Pinned Monitoring Surfaces should distinguish:

`PROVEN_DUPLICATE`, `DUPLICATE_CANDIDATE`, `BELOW_DEDUP_FLOOR`, `PARAMETER_CONFLICT`, `UNKNOWN`, `REMEDIATION_PENDING`, `REMEDIATED`.

Attention routing may coalesce repeated rediscovery notifications, but the underlying evidence occurrences remain independently inspectable where authorized.

```text
NOTIFICATION COALESCED != EVIDENCE COALESCED
NOTIFICATION DISMISSED != RECONCILIATION CLOSED
WINDOW CLOSED != SERVICE/REMEDIATION STOPPED
```

Client/Workspace switches requalify visibility before showing fingerprint/effect metadata. Rare-effect presence itself can be sensitive.

## 20. Mandatory adversarials exercised

1. Tenant A fingerprint appears in Client B search -> reject cross-Client cache/index reuse.
2. Stale Client/Workspace context exposes predecessor effect metadata -> requalify before projection/action.
3. Secret value is embedded in fingerprint input -> reject; use SecretRef/generation-safe metadata only.
4. Discovered app with old install token is treated as Verified -> reject.
5. Externally managed app token expires and SB silently upgrades -> reject.
6. Global retention setting prunes fingerprints and restarts services -> require explicit plan/blast radius; retention change != restart authority.
7. Shared provider token namespace is mistaken for shared tenant authority -> reject.
8. Historical provider manifest containing token becomes canonical desired state -> reject.
9. Closing reconciliation Window stops runtime/remediation -> reject UI/runtime coupling.
10. Adapter maps hash equality to semantic equivalence without canonicalization contract -> reject.
11. Placement migration resets effect identity because provider token scope changed -> reject.
12. App-specific retention policy conflicts with Control Center global default -> semantic owner/inheritance/provenance must resolve visibly.
13. Automatic Vault binding changes credential generation but fingerprint dependency is hidden -> reject hidden dependency.
14. Stripe-like provider prunes idempotency key after finite retention; rediscovered request is treated as new -> classify below provider dedup floor, not automatically new.
15. Provider record expires while durable effect-side receipt remains -> stronger qualified evidence continues to support lineage.
16. Provider record expires and no stronger evidence remains -> degrade to `BELOW_DEDUP_FLOOR/UNKNOWN`, not `PROVEN_DISTINCT`.
17. Same idempotency key reappears with different parameters -> parameter conflict, not duplicate success.
18. Timestamp is used as idempotency key across clients -> reject due to collision/clock semantics.
19. Incremental predecessor fragment is redelivered -> same evidence identity does not create a new historical fact.
20. Fragment B contradicts fragment A -> preserve contradiction; do not oscillate silently to latest arrival.
21. Compensation executed after fragment A; fragment B later changes assessment -> compensation remains a historical effect.
22. Same deficit is rediscovered repeatedly -> stable remediation lineage prevents repeated compensation by default.
23. Fingerprint digest uses old schema; new adapter compares under new normalization -> require explicit compatibility proof.
24. Low-entropy PII hashed directly -> reject privacy-unsafe fingerprint construction.
25. Full payload erased under retention policy -> do not claim semantic absence; retain permitted minimized lineage or degrade guarantee visibly.
26. Hot cache eviction is interpreted as permission to retry -> reject.
27. Kafka-like producer session changes -> transport idempotence cannot prove end-to-end business dedup across sessions.
28. Old placement and new placement use independent provider token scopes -> preserve semantic effect identity across migration.
29. Attention layer groups 100 rediscovery events into one toast -> presentation grouping cannot collapse evidence identities.
30. Search/index has no fingerprint -> index absence is not proof of effect absence without completeness/currentness proof.

## 21. New proof obligations

- **PO-446** — Semantic effect identity outlives provider dedup records whenever the protected invariant requires longer reconciliation.
- **PO-447** — Provider dedup retention/expiry is represented explicitly; expiry cannot relabel an old obligation as new.
- **PO-448** — Every durable `EffectFingerprint` binds Client, Environment, semantic owner, operation class, retention purpose, and derivation/canonicalization identity.
- **PO-449** — Fingerprint retention is minimized and purpose-qualified; full payload retention is independently authorized.
- **PO-450** — Fingerprint absence cannot prove effect absence without completeness/currentness evidence.
- **PO-451** — Hash/digest equality cannot establish semantic equivalence without a qualified canonicalization/schema contract.
- **PO-452** — Cross-version fingerprint comparison requires explicit compatibility; adapters cannot silently reinterpret old fingerprints.
- **PO-453** — Same idempotency/effect identity with incompatible parameters remains a visible conflict.
- **PO-454** — `DUPLICATE_CANDIDATE` records their evidence basis and can degrade to `UNKNOWN/BELOW_DEDUP_FLOOR` when that basis expires.
- **PO-455** — Stronger durable evidence may preserve duplicate lineage after provider token expiry without pretending provider retention still exists.
- **PO-456** — Incremental rediscovery occurrences have stable evidence identity so redelivery is not counted as a new historical fact.
- **PO-457** — Rediscovery fragments preserve prior reconciliation lineage and contradictions; arrival order is not semantic winner authority.
- **PO-458** — Gap deltas distinguish narrowing, closure for a named claim/invariant, contradiction addition, and newly exposed unknowns.
- **PO-459** — Reconciliation assessment changes cannot erase already-effective remediation/compensation occurrences.
- **PO-460** — Remediation/compensation uses stable lineage to the target effect/deficit set and cannot repeat merely because equivalent evidence is rediscovered.
- **PO-461** — Reconciliation action budgets/cooldowns do not reset on evidence redelivery or connectivity flap.
- **PO-462** — Hysteresis/debounce may contain operational oscillation but cannot fabricate currentness or suppress material contradiction.
- **PO-463** — `BELOW_DEDUP_FLOOR` is explicit and cannot be consumed as `SAFE_TO_RETRY`.
- **PO-464** — Retry below the dedup floor requires operation-specific re-admission, effect-side evidence, fresh fencing, or explicit qualified risk disposition.
- **PO-465** — Conserved-right accounting includes unresolved predecessor/successor potential consumption even when dedup records expired.
- **PO-466** — Provider-local idempotency scope cannot become cross-placement semantic effect identity.
- **PO-467** — Placement migration preserves Service/effect lineage while old/new effect authority/fencing is separately proven.
- **PO-468** — `EXTERNALLY_MANAGED` and `OBSERVE_ONLY` modes cannot gain mutation authority from dedup/reconciliation evidence.
- **PO-469** — `CO_MANAGED` reconciliation preserves field/operation ownership and does not use fingerprint match as wholesale merge authority.
- **PO-470** — Application discovery/registration/install/adopt/upgrade/unregister/uninstall retain distinct effect identities and lifecycles.
- **PO-471** — Supply-chain/source integrity remains independent from idempotency/dedup/effect-history claims.
- **PO-472** — Control Center retention changes expose provenance, semantic diff, affected proof capability, and blast radius before mutation.
- **PO-473** — Provider manifests/tokens remain projections/artifacts and never become canonical desired state or semantic owner.
- **PO-474** — Secret values never enter fingerprints, rediscovery diffs, witness commitments, search indexes, or attention payloads.
- **PO-475** — Automatic bindings expose generation/provenance/currentness when they materially affect effect identity or dedup safety.
- **PO-476** — Client/Workspace switches requalify effect/fingerprint visibility and prevent tenant metadata leakage.
- **PO-477** — Window/session lifecycle remains independent from reconciliation, remediation, and service lifecycle.
- **PO-478** — Notification grouping/coalescing never collapses underlying semantic/evidence identities.
- **PO-479** — Search/index/cache absence cannot prove no historical effect without completeness/currentness proof.
- **PO-480** — Privacy/erasure that removes evidence degrades the corresponding dedup guarantee explicitly rather than fabricating continuity.

## 22. Reconciliations and contradictions

### Reconciled

- Finite provider idempotency is compatible with long-lived semantic effect identity when the latter is represented separately.
- Privacy minimization is compatible with durable reconciliation when a purpose-scoped minimal fingerprint suffices; it does not justify indefinite payload retention.
- Incremental rediscovery is compatible with autonomous runtimes when reconciliation lineage is locally durable and does not require the Factory as an online oracle.
- Attention coalescing is compatible with semantic multiplicity when presentation and evidence identities remain distinct.
- Placement/provider migration is compatible with effect continuity when semantic identity is independent of provider token scope.

### Contradictions/trade-offs preserved

- Longer fingerprint retention improves late duplicate detection but increases privacy, storage, and correlation exposure.
- Aggressive erasure improves minimization but can force `UNKNOWN/BELOW_DEDUP_FLOOR` for old effects.
- Strong canonicalization improves match rate but increases the risk of false semantic merge if material fields are normalized away.
- Conservative retry blocking protects against duplicates but can harm liveness when effect-side evidence is permanently unavailable.
- Hysteresis reduces operational oscillation but can delay response to genuinely new material evidence; it cannot be semantic suppression.

## 23. Saturation assessment

| Domain | Maturity after this round | Saturation |
|---|---|---|
| provider dedup retention vs semantic effect identity | HIGH | principle stable; provider mappings remain open |
| incremental rediscovery lineage | MEDIUM-HIGH | material model stable; large-scale indexing/compaction open |
| minimal effect fingerprint | MEDIUM | privacy/canonicalization profiles not saturated |
| below-dedup-floor semantics | MEDIUM-HIGH | invariant-specific policies still open |
| anti-oscillation/repeated compensation | MEDIUM | cross-domain action-budget composition open |
| privacy/erasure interaction | MEDIUM | legal/purpose profiles remain open |
| cross-placement/provider idempotency | MEDIUM | provider-native mappings open |

Overall: `ADVANCED_EMERGING / MATERIAL_DELTA / NON_EXECUTABLE`.

No domain is declared fully saturated.

## 24. Architecture gaps after this round

1. **Effect fingerprint canonicalization governance** — how canonicalization profiles evolve without false split/merge and how old fingerprints remain comparable.
2. **Privacy-preserving long-horizon matching** — how to retain useful lineage under erasure/minimization without creating cross-tenant correlation identifiers.
3. **External effect lookup capability** — how adapters express whether a provider can authoritatively query an old effect after its idempotency record expires.
4. **Cross-domain remediation budgets** — preventing repeated compensation when multiple applications independently discover evidence about the same semantic deficit.
5. **Compaction of rediscovery ledger** — preserving contradictions, unresolved rights, remediation lineage, and below-floor semantics without retaining every fragment forever.

## 25. Next highest-value gap

**Proof-preserving compaction of incremental rediscovery/effect-fingerprint history.**

The next round should determine what a compacted `RediscoveryFrontierSummary` must preserve so that old fragments can be erased/archived without losing:

- unresolved duplicate candidates and `UNKNOWN` effects;
- negative evidence and parameter conflicts;
- conserved-right consumption/deficit;
- remediation/compensation lineage and action budgets;
- fingerprint canonicalization/profile identity;
- privacy/erasure provenance;
- gap-narrowed-vs-gap-closed distinctions;
- completeness/currentness limits.

Entry invariants:

```text
COMPACTED != FORGOTTEN
SUMMARY PRESENT != ALL SOURCE EVIDENCE RETAINED
OLD FRAGMENT ERASED != OLD CONTRADICTION RESOLVED
FINGERPRINT COMPACTED != EFFECT IDENTITY RESET
REMEDIATION SUMMARY != REMEDIATION AUTHORITY
```

The objective is a provider-neutral, privacy-aware summary that remains sufficient to answer every live safety/recovery question without making the Factory or Control Center a mandatory runtime oracle.
