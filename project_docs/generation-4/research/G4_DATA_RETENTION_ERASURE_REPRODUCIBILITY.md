# G4 — Data Retention, Erasure & Reproducibility Boundaries

Status: `RESEARCH_ACTIVE / NON_EXECUTABLE`
Execution authority: NONE
Date: 2026-09-18

## Purpose

Deepen the Data Treatment/Data Access boundary where retention, deletion/privacy obligations, replay, provenance, historical interpretation and derived generations conflict. This is a focused cross-cutting consolidation, not a new G4 macro-family and not a technology selection.

The central problem is that audit/replay pressure tends to preserve historical inputs and interpretation dependencies, while retention/privacy/security policy may require those same materials to become unavailable. System Builder must represent that conflict explicitly instead of assuming infinite history or treating logical invisibility as physical erasure.

## Evidence base

Primary/mature evidence examined:

- EU GDPR Article 17: personal data may be subject to erasure without undue delay when specified grounds apply; the right is conditional rather than a universal command to preserve history forever.
- W3C PROV: invalidation explicitly models the destruction, cessation or expiry of an entity and its time/activity lineage; provenance therefore need not imply perpetual usability of the invalidated entity.
- Apache Iceberg maintenance/time-travel semantics: historical snapshots enable time travel/rollback while snapshot expiration removes old snapshots and uniquely referenced files; references/retention policies constrain what can be expired. This is evidence that historical reproducibility has a finite retention envelope and cleanup is part of lifecycle semantics.

These are requirement/failure-mode evidence, not provider or legal-framework adoption. Product implementation will require jurisdiction/policy-specific authority rather than hard-coded GDPR semantics.

## 1. Retention and reproducibility are competing governed objectives

Historical reproducibility is not an unconditional invariant.

```text
ReproducibilityNeed
  forensic/audit purpose
  required source revisions
  required interpretation revisions
  required derived generations
  required provenance

RetentionAuthority
  purpose/legal/policy basis
  retention class
  minimum/maximum duration
  hold/exception
  deletion/anonymization rule
  scope
```

Invariants:

- `Auditable != retain all source data forever`.
- `Replayable today != replayable forever`.
- `Historical provenance != perpetual permission to retain payload`.
- `Retention expired != historical event never existed`.
- `Policy permits retention != policy requires retention`.

## 2. Logical deletion, invalidation and physical erasure are distinct

A generic `deleted=true` cannot express the lifecycle safely.

Candidate distinctions:

```text
LogicalVisibilityState
  visible / hidden / tombstoned

SemanticValidityState
  valid / superseded / invalidated / expired

PhysicalDisposition
  present / queued-for-erasure / erased / unknown

RecoveryDisposition
  recoverable / recoverable-under-hold / intentionally-unrecoverable / unknown
```

W3C PROV's invalidation concept is useful evidence for preserving the fact and lineage of cessation without asserting continued usability of the entity itself.

Invariants:

- `Hidden != erased`.
- `Tombstone != payload retained`.
- `Invalidated != physically destroyed by definition`.
- `Delete request ACK != physical erasure effective`.
- `Primary-store deletion != system-wide erasure`.
- `Physical erasure != proof that every derived disclosure disappeared`.

This extends the existing G2/G4 rule `ACK != effective state` to deletion.

## 3. Erasure is a distributed convergence problem

Relevant data may exist in canonical storage, replicas, indexes, search/vector projections, caches, object stores, logs, analytics, backups, exports, client runtimes and external processors/providers. A deletion operation therefore needs scope and convergence evidence.

Candidate `ErasureOperation` research shape:

```text
request/authority
subject/data scope
policy/legal basis
requestedAt
required targets
exceptions/holds
propagation plan
per-target disposition
unreachable/unknown targets
verification evidence
completedAt?
residual risk/qualification
```

A target may legitimately report `PENDING`, `ERASED`, `NOT_APPLICABLE`, `RETAINED_UNDER_HOLD`, `UNREACHABLE`, `UNKNOWN`, or another qualified disposition; these names are candidates, not canonical enums.

Proof rule:

`Erasure complete` may only be claimed for a declared population/scope with evidence. Unknown or unreachable targets cannot silently strengthen to complete.

## 4. Provenance after erasure must minimize content

Deleting a payload does not necessarily require deleting every fact that a governed deletion occurred. Conversely, keeping a richly identifying provenance graph can defeat the purpose of erasure.

Candidate split:

```text
ContentProvenance
  may contain reconstructive/identifying material

DispositionEvidence
  minimal evidence that an item/class was erased,
  by which authority/policy, when, and with what scope/result
```

Research principle:

- preserve only the minimum non-reconstructive disposition evidence justified by policy;
- do not preserve hashes, identifiers, embeddings, excerpts or linkage merely because they are called "metadata" if they remain identifying or reconstructive;
- where even residual identifiers are prohibited, use policy-approved aggregation, keyed/pseudonymous references, external legal/audit evidence, or accept reduced historical explainability.

Invariants:

- `Metadata != non-personal/non-sensitive by definition`.
- `Hash != anonymous by definition`.
- `Embedding != safe residual evidence`.
- `Provenance preserved != payload reconstructable`.

## 5. Replay capability has an explicit retention envelope

The prior temporal research requires `ReplayContext` and `InterpretationContext`. This consolidation adds a qualification: the dependencies they reference may lawfully expire.

Candidate:

```text
ReproducibilityEnvelope
  source retention horizon
  schema/contract retention horizon
  reference/master-data retention horizon
  identity-resolution retention horizon
  rule/policy retention horizon
  transformation artifact retention horizon
  cryptographic/key availability horizon
  expected reproducibility grade after each boundary
```

Possible research-grade outcomes:

```text
EXACTLY_REPRODUCIBLE
SEMANTICALLY_RECONSTRUCTABLE
PARTIALLY_REPRODUCIBLE
EXPLAINABLE_NOT_REPLAYABLE
INTENTIONALLY_UNREPRODUCIBLE
UNKNOWN
```

These are not mandatory product enums. The requirement is to avoid claiming forensic replay after required material has been intentionally erased.

Invariants:

- `Missing historical dependency != permission to substitute current dependency`.
- `Intentional erasure != data corruption`.
- `Cannot replay != cannot explain anything`.
- `Cannot reconstruct payload != cannot preserve qualified disposition evidence`.

## 6. Derived data inherits deletion obligations by dependency, not storage type

Search documents, aggregates, embeddings, graph edges, caches and model features may encode or reveal erased source information even when they are not byte-for-byte copies.

Candidate dependency relation:

```text
Source datum
  -> treatment/derivation
  -> DerivedGeneration
  -> projection/index/vector/aggregate/model feature
```

Erasure planning needs a dependency/impact query that can classify derived outputs as:

- rebuild without erased contribution;
- redact/remove selected derived item;
- invalidate and regenerate whole generation;
- retain under an explicit exception/hold;
- impossible/unknown, requiring escalation.

Invariants:

- `Derived != exempt from erasure`.
- `Aggregate != anonymous by definition`.
- `Vector/embedding != source-independent`.
- `Projection rebuild complete != old projection artifacts physically erased`.

## 7. Backups require different semantics from live deletion

Immediate in-place deletion from every backup may be infeasible or may destroy backup integrity. The architecture should therefore distinguish active recoverable copies from isolated backup generations and define restore-time controls.

Research requirements:

```text
BackupRetentionPolicy
  generation horizon
  access isolation
  restore authority
  erasure ledger/checkpoint
  post-restore re-erasure/reconciliation requirement
  expiry/destruction evidence
```

Critical rule:

`Restored backup != authorized resurrection of erased data`.

A restore workflow must reconcile deletion/disposition state before the restored generation becomes an authoritative/live source where policy requires it.

## 8. Holds and exceptions are explicit authority, not silent bypass

Retention may sometimes remain authorized or required despite an erasure request. The model should not encode this as a failed delete or administrator override without lineage.

Candidate `RetentionHold`:

```text
scope
basis/authority
issuedAt
review/expiry condition
permitted uses
access restrictions
supersession/release lineage
```

Invariants:

- `Hold != ordinary retention policy`.
- `Hold active != unrestricted use`.
- `Erasure exception != erasure request never existed`.
- `Policy conflict != automatic precedence`; precedence requires explicit governing authority.

## 9. Erasure and identity-resolution lineage interact

A subject may have predecessor/merged/split identities. Erasure scoped only to the current canonical identifier can miss historical aliases and derived outputs.

Therefore deletion impact should traverse declared identity-resolution lineage under an explicit resolution revision/policy while avoiding the opposite error of deleting unrelated records merely because a historical merge was later found wrong.

`Current canonical identity != complete erasure scope by default`.

`Historical merge relation != unconditional authority to erase both post-split subjects`.

This requires qualified identity traversal plus evidence/authority, especially after unmerge/split.

## 10. Adversarial/failure cases

- canonical row erased while search/vector projection still exposes content;
- erase operation reports success after only the primary database ACK;
- old backup restore resurrects records erased months earlier;
- forensic replay silently substitutes current reference data because the historical revision was intentionally deleted;
- audit log retains full identifying payload under a "metadata" label;
- a hash of an erased identifier remains linkable through a small domain;
- a merged identity is erased after a later split and unrelated subject data is removed;
- a derived aggregate leaks a small cohort after source deletion;
- external processor is unreachable and local UI reports global erasure complete;
- retention hold has no expiry/review and becomes permanent shadow retention;
- encryption key destruction makes data intentionally unrecoverable but replicas still retain plaintext;
- snapshot metadata expires while a UI still advertises exact time-travel/replay capability;
- deleted source is absent, but stale generated artifact can regenerate the sensitive value;
- replay/backfill uses a pre-erasure snapshot and republishes erased data into a current projection.

## 11. Proof obligations

1. Retention/deletion claims identify governing authority, purpose, scope and applicable exceptions/holds.
2. Logical visibility, semantic invalidation and physical erasure cannot be conflated.
3. Erasure completion is population-qualified and preserves `UNKNOWN`/unreachable targets.
4. Canonical, replica, projection, cache, object, log, backup and external-processor surfaces are considered by dependency/scope rather than primary-store assumption.
5. Residual disposition/provenance evidence is demonstrably non-reconstructive/minimized to the applicable policy, or its retention is separately authorized.
6. Historical replay declares when required dependencies have expired and downgrades reproducibility rather than silently substituting current revisions.
7. Derived generations expose enough lineage to determine erase/rebuild/invalidate impact where required.
8. Backup restore cannot silently resurrect data whose disposition requires continued erasure; restore has reconciliation before authoritative promotion.
9. Holds/exceptions have explicit authority, scope, permitted use, lifecycle and review/expiry semantics.
10. Identity merge/split lineage is considered in erasure scope without treating historical same-subject assertions as permanent identity equivalence.
11. Replayed/backfilled historical generations cannot republish erased data without fresh authority.
12. Provider/storage deletion ACK remains distinct from independently evidenced effective erasure.
13. Product UX must not advertise exact historical reconstruction beyond the current `ReproducibilityEnvelope`.
14. Security/privacy-sensitive residuals such as hashes, embeddings and logs are classified by actual re-identification/reconstruction risk, not storage label.

## 12. Provider/technology posture

No decision is made to adopt Iceberg, a lakehouse, immutable event sourcing, a provenance database, a privacy platform or any jurisdiction-specific policy engine.

The implementation-independent requirement is to support finite, governed history with explicit loss of reproducibility when required, rather than assuming either infinite retention or destructive deletion with no evidence.

`Temporal history != infinite retention`.
`Auditability != immutable personal data forever`.
`Erasure != silent history rewrite`.
`Privacy deletion != permission to falsify prior operational evidence`.

## 13. Next research gaps

- cross-region/offline deletion convergence and unreachable replicas/devices;
- cryptographic erasure and key-lifecycle proof versus physical media deletion;
- retention semantics for immutable/signed evidence and legal/audit holds;
- property-based adversarial model combining replay/backfill with deletion/restore;
- UX representation of intentionally reduced historical reproducibility;
- workload/cost impact of dependency-aware erasure and regeneration.