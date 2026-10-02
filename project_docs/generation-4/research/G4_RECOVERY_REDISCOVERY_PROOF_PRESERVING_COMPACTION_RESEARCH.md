# G4 Recovery — Proof-Preserving Rediscovery Compaction Research

Date: 2026-09-23
Status: `RESEARCH_ACTIVE / NON_EXECUTABLE`
Scope: documentary P&D only. No product implementation, WBS, Work Package, Sprint, TASK, migration or provider adoption is authorized.

## 1. Question and deduplication

This round extends `G4_RECOVERY_INCREMENTAL_REDISCOVERY_FINITE_DEDUP_RETENTION_RESEARCH.md`. The previous slice established that provider dedup retention may expire while semantic effect identity survives, introduced minimized `EffectFingerprint`, incremental rediscovery lineage, `BELOW_DEDUP_FLOOR`, and stable remediation lineage. This round studies the next unresolved problem: **how to compact incremental rediscovery/effect evidence without erasing the facts still needed to answer live duplicate, contradiction, conservation, remediation, privacy and recovery questions**.

Primary hierarchy remains a research candidate:

`Builder Home/Factory -> Client -> Workspace -> Desktop Sphere -> Application -> Window -> View/Tab/Tool`.

3D remains an optional projection/application, not a navigation foundation.

Constitutional boundaries preserved:

- `Builder != Runtime`; published runtimes remain autonomous.
- `Install != Adopt`; `Register != Deploy`; `Connect != Own`; `Discovered != Verified`.
- `SecretRef != secret value`; `Policy != configuration`.
- `Desired != Observed != Effective`; `Configured != Applied != Effective`.
- `Unified UI != one semantic owner/store`.
- `Deployment Unit != physical server`; `Service identity != raw IP`.
- `Window/session lifecycle != service lifecycle`.
- `Automatic != hidden`; `Adapter normalization != fabricated equivalence`.

Additional boundaries from this slice:

`Compacted != forgotten`

`Summary present != all source evidence retained`

`Old fragment erased != old contradiction resolved`

`Fingerprint compacted != effect identity reset`

`Remediation summary != remediation authority`

`Compaction frontier != settlement frontier`

`Source evidence unavailable != source claim false`

`Below compaction floor != safe to retry`

## 2. External evidence and portable lessons

### 2.1 etcd: compaction creates an explicit historical floor

Current etcd documentation states that compaction removes historical revisions before a compaction revision; reads below that revision fail as compacted. Watch responses expose `compact_revision`, and disaster-recovery guidance uses revision bump plus `mark-compacted` to invalidate stale watcher caches after restoring an old snapshot.

Sources:
- https://etcd.io/docs/v3.8/op-guide/maintenance/
- https://etcd.io/docs/v3.7/learning/api/
- https://etcd.io/docs/v3.7/op-guide/recovery/

Portable lesson: **history removal must create an explicit floor and below-floor behavior**. A consumer must not interpret missing pre-floor detail as non-occurrence. Revision bump/compaction can invalidate false continuity; it cannot reconstruct missing semantic history.

### 2.2 CockroachDB protected timestamps: retention can be claim-scoped

CockroachDB's protected timestamp mechanism can prevent MVCC garbage collection from advancing beyond a protected timestamp for selected targets while unrelated history continues to age out.

Source:
- https://www.cockroachlabs.com/blog/protected-timestamps-for-less-garbage/

Portable lesson: **retention need not be all-or-nothing**. Live proof obligations can pin the minimum evidence/frontier needed for a named subject/invariant while other detail is compacted. A retention pin is a storage/recovery constraint, not business authority.

### 2.3 Incremental backup and tombstones: deletion evidence can disappear

CockroachDB's incremental-backup discussion notes that MVCC deletions are represented by tombstones and that garbage collection can eventually remove old versions/tombstones. This illustrates why a deletion/revocation fact that matters after source GC must be carried forward by a stronger summary/fence or retained evidence.

Source:
- https://www.cockroachlabs.com/blog/implementing-backup/

Portable lesson: **negative evidence must outlive every resurrection/retry path it protects, or be subsumed by a stronger durable fence/summary**.

These products supply interaction/storage grammars only. They do not select etcd, CockroachDB, MVCC, a log engine or a storage provider for G4.

## 3. Candidate object: RediscoveryFrontierSummary

A compaction product is not a prose digest. It is a typed proof-preserving boundary.

Candidate fields:

```text
RediscoveryFrontierSummary
  summaryId
  ClientRef
  EnvironmentRef
  semanticOwnerRef
  RecoveryEpochRef
  coveredEvidenceOccurrenceSetRef
  coverageBoundary
  sourceRevisionRange
  sourceIdentityDigest
  effectIdentityFrontier[]
  duplicateDispositionFrontier[]
  negativeEvidenceFrontier[]
  contradictionSet[]
  parameterConflictSet[]
  unresolvedEffectSet[]
  conservedRightDeficitSet[]
  remediationLineageSet[]
  actionBudgetState[]
  canonicalizationProfileRefs[]
  policyAuthorityBasisRefs[]
  currentnessDisposition
  privacyPurpose
  erasureRedactionProvenance[]
  retainedSourceRefs[]
  erasedSourceClasses[]
  belowFloorLawRef
  supersedesSummaryRefs[]
  integrity/provenance
```

This is a research vocabulary candidate, not a committed schema.

## 4. Findings

### F481 — Compaction is admissible only against named future questions

A source fragment may be erased only when the retained summary can still answer every **live** safety/recovery question for which that fragment is material. Candidate question classes include:

- could this operation already have produced the same effect?;
- is a prior negative/revocation/fencing fact still required?;
- does a parameter conflict remain unresolved?;
- can conserved capacity be safely reissued?;
- has remediation already been attempted/effected?;
- is another compensation admissible?;
- which canonicalization/profile made a fingerprint meaningful?;
- is a gap merely narrowed or actually closed?;
- what privacy/erasure transformation occurred?

`No current UI consumer != no future proof obligation`.

### F482 — Compaction frontier is multidimensional

One scalar revision cannot safely summarize effect identity, negative evidence, contradictions, conserved rights, remediation and privacy provenance simultaneously. A summary may be complete for duplicate detection and incomplete for settlement.

`COMPACTED_FOR_DEDUP != COMPACTED_FOR_SETTLEMENT`.

### F483 — Below-floor is a first-class disposition

If detail below a compaction floor is intentionally unavailable, the result is `BELOW_COMPACTION_FLOOR`, not `NOT_FOUND` and not `NEVER_OCCURRED`.

`BELOW_COMPACTION_FLOOR != SAFE_TO_RETRY`.

### F484 — Negative evidence requires dominance before erasure

A revocation, tombstone, fencing fact, management handoff or old-generation invalidation can be erased only if the summary or a stronger current fence proves that every relevant resurrection/retry path remains blocked.

`New state present != old negative evidence subsumed`.

### F485 — Contradictions survive compaction as contradictions

If fragments A and B conflict, replacing them with the chosen winner alone fabricates certainty. The summary retains the contradiction class, compared claims, qualification basis and current disposition.

`Conflict adjudicated != conflicting historical claim never existed`.

### F486 — Duplicate candidates need confidence/evidence lineage, not only a boolean

A `STRONG_DUPLICATE_CANDIDATE` may depend on evidence that is later erased or becomes inapplicable. The summary records the evidence class and canonicalization/profile basis that justified the candidate so that later requalification can degrade to `UNKNOWN` honestly.

### F487 — Canonicalization identity is part of compacted fingerprint meaning

A digest without schema/canonicalization/profile identity is not durable semantic evidence. Changing the normalizer cannot silently reinterpret historical fingerprints.

`Same bytes/digest != same semantic parameters absent qualified canonicalization`.

### F488 — Remediation lineage must outlive the detail it remediated

A compensation/remediation occurrence needs stable linkage to the affected effect/deficit set and its action budget. Otherwise compaction can make an already compensated deficit look actionable again.

`Source detail erased != remediation budget reset`.

### F489 — Action budgets are compacted state, not recomputed from surviving actions

Attempt/time/cost/compensation budgets survive source-event deletion. Reconstructing a budget only from retained hot history can mint retries after compaction.

### F490 — Conserved-right deficits survive source compaction

If unresolved predecessor/successor consumption reduced safe available rights, that deficit remains until explicitly settled or dominated by stronger evidence.

`Consumption detail compacted != capacity restored`.

### F491 — Gap closure requires dimension-specific closure proof

A summary records whether each recovery dimension is `OPEN`, `NARROWED`, `CLOSED`, `CONTRADICTORY`, `INCOMPARABLE` or `UNKNOWN`. Erasing fragments cannot upgrade `NARROWED` to `CLOSED`.

### F492 — Summary supersession is append-only in semantic lineage

A later summary may dominate an earlier summary for named dimensions, but the supersession relation is explicit. Rewriting one mutable summary in place would hide which proof basis governed earlier decisions.

### F493 — Retention pins are scoped proof dependencies

A live unresolved effect, contradiction, legal hold, recovery gap or remediation may pin selected source evidence against compaction. Pins require owner/purpose/currentness and release conditions.

`Retention pin != indefinite retention permission`.

### F494 — Privacy erasure may legitimately degrade proof capability

If policy/law requires erasing source data needed for stronger duplicate or settlement proof, the system records the transformation and degrades the affected proof disposition. It must not retain prohibited payload merely to preserve convenience.

`Erased for privacy != effect never occurred`.

### F495 — Summary minimization itself requires privacy review

Effect fingerprints, correlation IDs and contradiction sets can remain identifying or linkable even without raw payload. Summary fields are purpose/Client scoped; low-entropy identifiers are not made safe merely by hashing.

### F496 — Source deletion needs verifiable coverage, not best-effort background GC

Before source evidence is eligible for irreversible deletion, the compactor must establish that an effective qualified summary covers it for all declared live proof classes. Provider GC ACK alone is not this proof.

`GC completed != semantic compaction valid`.

### F497 — Compaction is a lifecycle with configured/applied/effective states

A policy can request a retention/compaction rule, a compactor can apply it, and proof capability can become effective only after coverage validation. Preserve:

`Configured != Applied != Effective`.

### F498 — Incremental summaries require overlap/continuity proof

Summary S2 that starts after S1 must prove continuity or explicitly expose a gap. Adjacent storage offsets alone do not prove semantic coverage when filters, tenant scope or provider loss are involved.

### F499 — Compaction cannot cross Client authority silently

Shared infrastructure may physically store multiple Clients, but summary identities, retention pins, searches and deletion scopes remain Client-qualified.

`Shared storage != shared evidence authority`.

### F500 — Control Center is a projection/coordinator of compaction policy

Control Center may show retention policy, pins, blast radius, source coverage, proof degradation and planned deletion. It does not become the owner of Application effects, recovery truth or secret values.

### F501 — Application Manager lifecycle evidence cannot be collapsed into deployment presence

Install/adopt/register/deploy/upgrade/unregister/uninstall occurrences remain distinct through compaction. A compacted Application summary cannot turn a discovered app into verified/adopted state or an externally managed app into SB-managed state.

### F502 — Supply-chain/source-integrity evidence has a separate compaction horizon

Artifact provenance/signature/source verification may have different retention requirements from effect dedup or runtime currentness. One summary cannot silently stand in for all three.

### F503 — Provider artifacts remain projections after compaction

Raw YAML/manifests, provider ACKs and deployment logs may be summarized or erased without becoming canonical desired state. A retained provider digest does not reidentify Service by IP/server.

### F504 — Placement migration does not reset compaction lineage

Effect fingerprints, unresolved effects and fencing evidence remain tied to semantic Service/effect identity across shared-managed, dedicated-managed, external/BYOI or existing-service placement changes.

### F505 — Secret values are excluded from compaction summaries

A summary may retain `SecretRef`, credential generation, binding identity, revocation/fencing disposition and provenance where material. It never retains secret values merely to preserve dedup/recovery evidence.

### F506 — Automatic bindings that affect proof retention must be explainable

If an Environment/Vault/network/storage/placement binding causes evidence to be pinned, compacted, invalidated or requalified, that dependency and rule are inspectable. `Automatic != hidden`.

### F507 — Derived indexes are disposable only if their completeness state is explicit

Search/index/cache misses after source compaction cannot be interpreted as absence unless the index proves coverage over the relevant summary frontier. Rebuild may use summaries; an index is never canonical truth.

### F508 — Window/session state cannot release proof obligations

Closing a reconciliation window, dismissing a notification, unpinning a monitoring surface or closing a browser tab does not release retention pins, action budgets, remediation lineage or unresolved effects.

### F509 — Summary export/import requires semantic profile qualification

Moving a summary to another runtime/provider requires schema/canonicalization/Client/RecoveryEpoch and integrity qualification. Parseability is not semantic equivalence.

### F510 — Compaction can be local without creating a central oracle

Published runtimes may compact locally from durable contracts and locally sufficient evidence. Factory/Control Center availability is not required for ordinary compaction, although policy/currentness horizons still apply.

## 5. Candidate compaction lifecycle

```text
IDENTIFY_CANDIDATE_RANGE
 -> ENUMERATE_LIVE_PROOF_QUESTIONS
 -> RESOLVE_RETENTION_PINS
 -> BUILD_TYPED_SUMMARY
 -> VALIDATE_COVERAGE
 -> VALIDATE_CONTRADICTION/NEGATIVE_EVIDENCE_PRESERVATION
 -> VALIDATE_PRIVACY/MINIMIZATION
 -> PUBLISH_SUMMARY_REVISION
 -> MARK_COMPACTION_FLOOR
 -> SOURCE_DELETION_ELIGIBLE
 -> VERIFY_DELETION/ARCHIVAL_DISPOSITION
 -> MONITOR_PROOF_DEGRADATION
```

Failure at any proof-preservation gate leaves source deletion ineligible. This is not a distributed transaction requirement; each protected invariant names its required coverage.

## 6. Control Center and cross-application consequences

Control Center research should expose:

- configured/applied/effective compaction policy and provenance;
- summary frontier per Client/Environment/RecoveryEpoch;
- live retention pins and release conditions;
- proof classes preserved/degraded;
- contradictions and unresolved effects that survive compaction;
- action/remediation budgets;
- source classes proposed for deletion and blast radius;
- privacy/erasure transformations;
- automatic-binding dependencies;
- provider/storage projection versus canonical semantic owner.

A global retention change may affect many Applications and therefore requires semantic diff/change planning/blast-radius evidence. It **does not** authorize Application restart, upgrade or runtime stop.

Application-specific advanced settings may narrow or extend retention only within policy/authority bounds. Conflict with Client/global policy is explicit rather than last-writer-wins.

## 7. Declarative deployment / hosting consequences

Typed service schemas may declare proof-retention dependencies without embedding provider-specific YAML as canonical truth. Deployment Units and placement groups can project storage/retention realization, but:

`Deployment Unit != physical server`.

Provider-native compaction/GC settings are compiled/exported artifacts. Provider acknowledgement that retention was configured does not prove semantic coverage or effective proof preservation.

Placement migration carries semantic effect/summary lineage. Old-placement fencing remains separate from new-placement activation.

## 8. Adversarial matrix

1. Tenant leak: shared compactor merges fingerprints across Clients.
2. Stale Client context deletes evidence under an old Client selection.
3. Hidden secret value appears inside a summary digest input or debug export.
4. Discovered-but-unverified app becomes `VERIFIED` because discovery fragments were compacted.
5. Externally managed app becomes upgradeable because old management-mode evidence was erased.
6. Global retention setting silently triggers Application restart.
7. Shared infrastructure is mistaken for shared evidence/data authority.
8. Provider manifest digest becomes canonical Service truth.
9. Closing reconciliation UI releases a retention pin.
10. Adapter re-normalizes old fingerprints under a new canonicalizer and fabricates equivalence.
11. Placement migration starts a fresh effect/dedup history.
12. App-specific retention setting silently defeats Client Control Center floor.
13. Automatic Vault/storage binding hides why evidence is retained/deleted.
14. Tombstone/revocation is erased while stale snapshot can still resurrect old state.
15. Contradictory fragments are compacted to only the preferred winner.
16. Remediation detail is erased and compensation executes twice.
17. Action-attempt history is deleted and retry budget resets.
18. Conserved-right consumption detail disappears and capacity is reissued.
19. `gap narrowed` becomes `gap closed` because source fragments are gone.
20. Provider GC success is treated as semantic compaction success.
21. Summary exists but omits canonicalization profile.
22. Summary hash contains low-entropy PII and becomes a correlation oracle.
23. Privacy erasure removes evidence but UI still shows `PROVEN_DUPLICATE`.
24. Search index miss after compaction is treated as non-occurrence.
25. Old summary is overwritten in place, hiding historical decision basis.
26. Two adjacent summaries leave a filtered gap but storage offsets appear contiguous.
27. Source evidence is deleted before summary publication becomes durable.
28. Imported summary parses successfully but belongs to another RecoveryEpoch.
29. Provider-local retention horizon is presented as end-to-end proof horizon.
30. Window/session close is treated as service/remediation lifecycle action.

## 9. Proof obligations PO-481..PO-515

- **PO-481** Every compaction names the Client, Environment, semantic owner and RecoveryEpoch.
- **PO-482** Every source-deletion decision enumerates the live proof classes whose answerability must survive.
- **PO-483** Below-floor queries return an explicit below-floor/unknown disposition, never fabricated absence.
- **PO-484** Negative/revocation/fencing evidence is retained or demonstrably dominated by a stronger durable fence/summary.
- **PO-485** Contradictions survive summary construction with qualification/disposition lineage.
- **PO-486** Duplicate dispositions retain their evidence class and canonicalization/profile basis.
- **PO-487** Fingerprint meaning is bound to immutable schema/canonicalization identity.
- **PO-488** Effect identity survives provider token/cache/source compaction.
- **PO-489** Remediation/compensation lineage survives source deletion.
- **PO-490** Attempt/time/cost/compensation budgets cannot reset through compaction.
- **PO-491** Conserved-right deficits survive until explicit settlement/dominance proof.
- **PO-492** Gap state is dimension-qualified; `NARROWED` cannot become `CLOSED` by deletion.
- **PO-493** Summary supersession is explicit and historical decision basis remains resolvable.
- **PO-494** Retention pins carry purpose, owner, currentness and release conditions.
- **PO-495** Retention pins do not authorize indefinite unrelated payload retention.
- **PO-496** Privacy erasure records proof degradation instead of fabricating non-occurrence.
- **PO-497** Summary minimization is reviewed for linkability/low-entropy disclosure.
- **PO-498** Source deletion is gated on effective semantic coverage, not provider GC ACK.
- **PO-499** Configured/applied/effective compaction states remain distinct.
- **PO-500** Incremental summaries prove overlap/continuity or expose a gap.
- **PO-501** Shared storage never collapses Client/tenant evidence authority.
- **PO-502** Application lifecycle summary preserves install/adopt/register/deploy distinctions.
- **PO-503** `EXTERNALLY_MANAGED`, `CO_MANAGED`, `OBSERVE_ONLY` boundaries survive compaction.
- **PO-504** Supply-chain/source-integrity evidence has independent retention/currentness qualification.
- **PO-505** Raw manifests/provider ACKs cannot become canonical desired/effective truth through retention.
- **PO-506** Placement migration preserves Service/effect/summary identity and old-placement fencing obligations.
- **PO-507** Secret values are excluded from summaries; SecretRef/generation/fencing evidence remains separately qualified.
- **PO-508** Automatic binding retention consequences are inspectable and provenance-bearing.
- **PO-509** Derived indexes expose summary-frontier coverage before absence can be inferred.
- **PO-510** Window/session/notification lifecycle cannot release semantic retention/remediation obligations.
- **PO-511** Imported summaries require Client/epoch/profile/integrity qualification.
- **PO-512** Local autonomous compaction remains bounded by policy/currentness without requiring Factory availability.
- **PO-513** Control Center global retention changes expose semantic diff and blast radius before destructive application.
- **PO-514** Application-specific retention settings cannot silently override Client/security/legal floors.
- **PO-515** Provider-native retention/GC realization cannot fabricate semantic coverage equivalence.

## 10. Maturity and saturation

- provider/source compaction vs semantic forgetting: **HIGH**;
- explicit below-floor semantics: **HIGH**;
- negative evidence / contradiction preservation: **MEDIUM-HIGH**;
- remediation/action-budget preservation: **MEDIUM-HIGH**;
- `RediscoveryFrontierSummary` minimal field set: **MEDIUM / NOT SATURATED**;
- privacy-preserving summary/fingerprint retention: **MEDIUM / NOT SATURATED**;
- incremental summary overlap/supersession: **MEDIUM / NOT SATURATED**;
- provider-native mappings: **EARLY MATERIAL**.

No domain is declared fully saturated.

## 11. Next highest-value gap

The next gap is **retention-pin lifecycle and proof-obligation liveness under indefinitely unresolved external effects**. A proof-preserving compactor can otherwise accumulate permanent pins and recreate unbounded history through safety requirements.

Questions:

- when may a negative-evidence/contradiction/effect pin be replaced by a stronger fence or bounded summary?;
- who may release a pin, and under what current authority/evidence?;
- how do legal/privacy maximum-retention rules interact with safety pins that would prefer longer retention?;
- what happens when an external effect can remain `UNKNOWN` forever?;
- can an unresolved effect be converted to a bounded business loss/insurance/manual settlement disposition without fabricating technical settlement?;
- how are pin pressure, storage budgets and proof degradation surfaced without making resource pressure a reason to weaken safety silently?

Entry invariants:

`Storage pressure != permission to erase required proof`

`Retention pin != infinite payload retention entitlement`

`Manual settlement != technical effect settlement`

`Stronger fence may subsume old detail != stronger fence rewrites history`

`Privacy maximum retention != permission to fabricate absence`

`UNKNOWN forever != free retry forever`.
