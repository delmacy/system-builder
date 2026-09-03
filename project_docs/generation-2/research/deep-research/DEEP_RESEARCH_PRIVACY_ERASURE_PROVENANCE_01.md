# Deep Research — Privacy/Erasure vs Immutable Provenance 01

Status: DEEP RESEARCH / RESEARCH RECOMMENDATION / NOT TARGET-ARCHITECTURE AUTHORITY

## Question

When regulation, contractual policy or enterprise retention rules require deletion, anonymisation or restriction of personal/confidential data, what portable semantics allow the System Builder to preserve auditability, provenance and historical interpretation **without retaining forbidden subject data indefinitely, resurrecting erased data through archives/backups, or weakening integrity guarantees**?

This research is architectural, not legal advice. It asks what the platform must be able to represent so deployments can implement applicable law/policy correctly.

## Why this is architecturally material

Generation 2 increasingly depends on immutable evidence, revision-qualified provenance, append-only workflow history, historical interpretation closure and content-addressed identities. Those are attractive for correctness and audit, but they conflict with any architecture that embeds indefinitely retained personal/confidential payloads inside immutable evidence.

The tension is structural:

```text
Audit / provenance goal
  preserve enough history to prove what happened and under which revision

Privacy / erasure goal
  cease retaining or processing data once purpose/legal basis expires,
  and honor valid erasure/anonymisation/restriction requirements
```

If the SB solves auditability by saying "never delete anything", Governance/Compliance/Audit becomes incompatible with privacy. If it solves erasure by physically destroying all history, long-lived workflows, fraud/dispute evidence, non-repudiation and historical interpretation can become impossible.

The architectural question is therefore not "mutable log or immutable log?" but **which semantic facts may remain immutable, which subject-bearing material must remain separately erasable/restrictable, and what evidence proves that disposition happened correctly**.

## SB corpus consumed

Input corpus was treated as hypotheses/evidence inventory, not as independent external proof:

- `RESEARCH_PIPELINE_STATE.json`: `phase=RESEARCH_ELICITATION`, five full cycles complete; deep research must not increment cycle/revisit/saturation.
- `RESEARCH_EVIDENCE_METHOD.md`: requires production + standards + scientific/engineering triangulation and preserved divergence.
- `ARCHITECTURE_PROOF_QUALITY_METHOD.md`: requires explicit authority, failure, version, provider, evidence, rollback, isolation and offline proofs.
- `CAPABILITY_DISCOVERY_REGISTER.md`: current candidate inventory already contains historical closure/evidence-vector directions; this deep research must not create taxonomy by habit.
- `FINDING_INDEX.md`: prior findings distinguish immutable identity/evidence from mutable/effective state and require `INCONCLUSIVE` where dependencies disappear.
- `REPRESENTATIVE_COVERAGE.md`: historical representative coverage remains authoritative in dossiers even where compact ledger omits privacy-specific entries.
- `CAPABILITY_PROOF_MATRIX.md`: Governance/Audit retains retention evidence debt; Storage, Lifecycle, Artifact/Provenance, Security and Workflow all require migration/recovery/evidence proofs.
- `DEEP_RESEARCH_HISTORICAL_INTERPRETATION_CLOSURE_01.md`: establishes that historical meaning requires preservation/interpretation/validation closure, but deliberately left privacy/erasure as the next contradiction.
- `DEEP_RESEARCH_LONG_LIVED_GATE_CRITERIA_EVOLUTION_01.md`: distinguishes historical truth from current actuation qualification.
- `DEEP_RESEARCH_COMPOSITE_SAGA_EFFECT_CLOSURE_01.md`: Gate truth derives from qualified evidence, not generic success/ACK.
- `SEMANTIC_ASSEMBLY_LINE_PROCESS_MODEL.md`: longitudinal progression consumes qualified evidence; provenance should therefore survive privacy disposition without turning erased payloads into current process inputs.

## External evidence ledger

### E1 — GDPR Article 17 and Article 5 storage limitation

Sources:
- Regulation (EU) 2016/679, Article 17, EUR-Lex.
- Article 5(1)(e) storage limitation as quoted/interpreted in CJEU materials.

Evidence:
- personal data may need erasure without undue delay where legal grounds apply;
- retention in identifiable form is limited to what is necessary for the processing purpose;
- erasure is not absolute: Article 17(3) contains exceptions including legal obligation/public interest and establishment/exercise/defence of legal claims.

Architectural consequence: `RETENTION_REQUIRED`, `ERASURE_REQUIRED`, `RESTRICTION_REQUIRED` and `ANONYMISATION_ACCEPTED` cannot be collapsed into one lifecycle. The system must preserve the legal/policy basis and scope of a retention/disposition decision.

### E2 — EDPB final blockchain guidelines (2026)

Source:
- EDPB, Guidelines on processing of personal data through blockchain technologies, final version published 2026.

Evidence:
- directly identifiable data placed on tamper-resistant replicated ledgers may be practically impossible to delete;
- storage limitation still applies;
- data subject erasure/object rights must be supported by design;
- where actual deletion is impracticable, architecture must make personal data effectively anonymisable; off-chain material enabling identification must be erasable;
- encrypted or hashed data is not automatically anonymous;
- if strong immutable properties are unnecessary, controllers should consider other technologies.

Architectural consequence: **immutable provenance must not require immutable personal payload**. A digest/hash/pseudonym can remain personal if realistic linkage/re-identification persists.

### E3 — EDPB anonymisation/pseudonymisation guidance

Source:
- EDPB anonymisation/pseudonymisation topic and 2026 anonymisation guidance work.

Evidence:
- pseudonymisation reduces linkability but preserves a possible link and therefore remains personal data;
- true anonymisation makes the data unlinkable to an individual and removes it from data-protection scope.

Architectural consequence: deleting a lookup table or key is only sufficient if **the remaining evidence is no longer reasonably linkable by any relevant retained material/party/context**. `PSEUDONYMISED` must never be silently treated as `ANONYMISED`.

### E4 — ICO erasure/backups guidance

Source:
- UK ICO, Right to erasure.

Evidence:
- valid erasure normally requires action on backups as well as live systems;
- backups may remain temporarily until overwritten, but data should be put "beyond use" and not processed for other purposes;
- erasure exceptions include legal obligations, public-interest archival/research contexts and legal claims.

Architectural consequence: backup/restore is part of erasure correctness. A restore that resurrects erased data into active use is a privacy failure even when backup retention was temporarily permissible.

### E5 — NIST SP 800-88 Rev. 2 (2025) media sanitization

Source:
- NIST SP 800-88 Rev. 2, Guidelines for Media Sanitization.

Evidence:
- sanitization means making access to target data infeasible for a specified effort level;
- Rev. 2 explicitly retains cryptographic erase as a common sanitization technique and adds stronger program/validation guidance.

Architectural consequence: cryptographic erase is a legitimate **mechanical realization** of destruction/unrecoverability when assumptions hold, but the SB must own the semantic requirement (`this subject-bearing material must become unrecoverable under profile X`) and evidence of completion; it must not canonically depend on AWS KMS, a disk command or another provider operation.

### E6 — AWS KMS key deletion as production realization

Source:
- AWS KMS `ScheduleKeyDeletion` / developer guide.

Evidence:
- after final deletion, KMS key material is irrecoverable and ciphertext under that key can no longer be decrypted;
- multi-region replicas and external/imported key material complicate the closure;
- deleting one KMS object does not imply every external copy/key-equivalent is gone.

Architectural consequence: crypto-erasure requires a **key/material closure proof**, not `provider returned deletion accepted`. Shared keys are especially dangerous: deleting one shared DEK/KEK can erase unrelated records; retaining another replica can make claimed erasure false.

### E7 — Kafka tombstones/log compaction

Source:
- Apache Kafka design documentation.

Evidence:
- a tombstone records logical deletion, while background compaction later removes older keyed records and eventually the tombstone itself subject to retention semantics.

Architectural consequence: `TOMBSTONED`/`LOGICALLY_DELETED` is not equivalent to `PHYSICALLY_ABSENT` or `UNRECOVERABLE`. The SB should be able to express staged disposition and delayed physical cleanup without misreporting erasure completion.

### E8 — Redactable/sanitizable signatures and redactable-ledger research

Sources:
- Kundu, Atallah, Bertino, Leakage-free redactable signatures, CODASPY 2012.
- Samelin et al., Redactable vs. Sanitizable Signatures, 2012.
- later redactable-blockchain/chameleon-hash literature including peer-reviewed work.

Evidence:
- cryptographic integrity can be designed so authorized redaction removes selected material while preserving verifiability of the retained structure;
- redactable and sanitizable signatures have materially different security semantics;
- chameleon-hash systems move trust into redaction/trapdoor/committee authority and therefore introduce governance/abuse risks.

Architectural consequence: "integrity requires literal immutability of every byte" is false, but redactability is **not free**. If used, redaction authority, redaction evidence and non-redactable structural fields must be explicit. Provider-specific chameleon-hash objects must not become universal SB primitives.

## Competing models

### Model A — Immutable audit log containing full personal payload

```text
Event {
  subjectName
  email
  document
  action
  result
  signature
}
// never deleted
```

Strength: simple audit/replay.

Failure: directly conflicts with storage limitation/erasure where no retention exception exists; replicated backups/exports multiply deletion difficulty.

Disposition: `DO_NOT_BUILD` as universal model.

### Model B — Hash everything and call it anonymous

Strength: small immutable evidence.

Failure: low-entropy values are dictionary-testable; salted hashes remain linkable if salt survives; hashes/pseudonyms can remain personal where a controller/third party can reasonably relink them.

Disposition: `DO_NOT_BUILD` as a universal anonymisation rule.

### Model C — Append-only semantic envelope + erasable subject-bearing payload

```text
Immutable/retained evidence envelope
  event/effect type
  time
  process/workflow revision
  authority/policy revision
  provider/attempt lineage
  non-identifying integrity commitments as lawful/necessary
  disposition lineage

Separately governed subject material
  direct identifiers
  sensitive fields
  documents/media
  provider-native personal receipts
  re-identification/linkage maps
  per-record encryption material
```

Subject material can be erased/anonymised/restricted while structural provenance remains if the retained envelope is lawful, necessary and no longer reasonably identifying.

Disposition: strongest portable baseline; `KEEP/GENERALIZE`.

### Model D — Per-record encryption + crypto-shredding

Strength: supports erasure across immutable backups/archives without rewriting every physical copy when unique key closure can be proven.

Failure modes:
- shared key destroys too much;
- replica/exported key survives;
- plaintext appears elsewhere/index/cache/log;
- remaining ciphertext/hash/metadata remains identifying;
- key deletion cannot satisfy a legal need for literal removal in every context.

Disposition: `SPECIALIZE/PROVIDERIZE` as one erasure mechanism, never the semantic definition of erasure/anonymisation.

### Model E — Authorized cryptographic redaction of evidence object

Strength: can preserve structural/signature verification while removing selected content.

Failure: introduces redaction authority/trapdoor governance, new compromise class and provider/crypto assumptions; may obscure whether original and redacted versions are distinguishable enough for audit.

Disposition: `DEFER/SPECIALIZE`; useful for high-assurance signed artifacts but not a universal requirement.

### Model F — Keep everything under "audit/legal claims" forever

Strength: avoids losing evidence.

Failure: Article 17 exceptions are scoped to necessity; "audit" is not an unlimited retention magic word. Enterprise policy may require expiration even when a log is useful.

Disposition: `DO_NOT_BUILD` as default. Retention exceptions must be explicit, scoped, reviewable and expiring where applicable.

## Strongest conclusion

> **Immutable provenance and erasure are compatible only when the architecture separates durable semantic/audit structure from subject-bearing material, treats identifiability/linkability as a first-class property, and makes privacy disposition itself a governed, evidenced lifecycle rather than an ad-hoc delete operation.**

A durable audit fact can survive while its subject payload does not.

Example:

```text
Before disposition:
  Evidence E92
    actorRef -> Person P17
    approvalDocument -> D44
    decision = APPROVED
    policyRevision = A10

After valid erasure/anonymisation:
  Evidence E92
    actorRef -> ERASED/ANONYMOUS ACTOR TOKEN (only if no realistic relink remains)
    approvalDocument -> ERASED
    decision = APPROVED
    policyRevision = A10
    privacyDisposition -> PD7

PD7 proves:
  what scope was disposed
  why/by whose authority
  mechanism/profile
  completion evidence
  residual/retained fields and basis
  backup/archive propagation status
```

The historical proposition "an authorized approval occurred under A10" may remain provable without retaining a person's name, email or document forever. Where the identity itself is legally necessary for claims/regulatory retention, that fact is **retained under a scoped exception**, not mislabeled as erased/anonymised.

## Candidate privacy disposition semantics

Exact IR names remain deferred. Research recommends preserving at least these distinctions:

```text
ACTIVE
RESTRICTED / BEYOND_USE
ERASURE_PENDING
ERASED_UNRECOVERABLE
ANONYMISED_UNLINKABLE
PSEUDONYMISED_LINKABLE
RETAINED_UNDER_EXCEPTION
DISPOSITION_INCONCLUSIVE
```

These are semantic states, not proposed final enum names.

Important invariants:

1. `PSEUDONYMISED_LINKABLE != ANONYMISED_UNLINKABLE`.
2. Logical tombstone != physical absence != cryptographic unrecoverability.
3. Provider ACK != disposition completed.
4. Erasure of canonical store != erasure closure if backup/export/cache/index/provider copies remain actionable.
5. Historical provenance must not be used to reconstruct erased personal payload unless an explicit lawful retained source still exists.
6. Restore/replay must reapply disposition state before erased subject material can become visible/processable.
7. An erasure/anonymisation operation must not delete unrelated evidence or subjects because of shared encryption/material coupling.
8. Retention exceptions require explicit scope/basis/horizon rather than implicit "audit forever".
9. AI/AGWS/Station users cannot broaden retention, cancel erasure or access restricted tombstoned material without delegated authority.
10. Privacy disposition does not rewrite the historical semantic fact; it changes what identifying representation remains available and which future processing is permitted.

## Historical interpretation closure after erasure

`DR-HIC-01` should be generalized:

```text
HistoricalInterpretationClosure
  = semantic interpretation dependencies
  + validation dependencies
  + retained evidence permitted by disposition
  - forbidden/erased subject-bearing dependencies
```

If interpreting an old fact requires material that has legitimately been erased, the correct answer may be:

```text
Historical event existence: VERIFIED
Original semantic type/revision: VERIFIED
Subject identity: ERASED / NOT AVAILABLE
Specific subject-qualified claim: INCONCLUSIVE
```

The architecture must prefer partial qualified truth over secretly retaining forbidden material merely to avoid `INCONCLUSIVE`.

## Privacy disposition as an effect-obligation vector

Erasure usually spans heterogeneous sinks:

```text
PrivacyDisposition PD7
  ├─ primary DB row                  REQUIRED
  ├─ search index                    REQUIRED
  ├─ object/document store           REQUIRED
  ├─ provider CRM copy               REQUIRED
  ├─ analytics projection            REQUIRED / profile-specific
  ├─ active cache                     REQUIRED
  ├─ backup                          BEYOND_USE → eventual purge
  ├─ immutable evidence envelope      RETAIN or REDACT according to basis
  └─ encryption key replicas          REQUIRED if crypto-erasure chosen
```

Therefore the composite-effect result from `DR-CSEC-01` applies directly: disposition closes only from its declared obligation vector and evidence thresholds. One failed/unknown required sink produces `DISPOSITION_INCONCLUSIVE/PENDING`, not false success.

## Backup/restore invariant

A backup may lawfully remain temporarily beyond-use under a defined retention profile, but restore must not resurrect erased material into ordinary processing.

Candidate rule:

> **Restore eligibility includes privacy-disposition reconciliation.**

Conceptually:

```text
restore snapshot S(old)
  + disposition ledger/current tombstone closure
  + retention/exception state
  -> reconciled restore
  -> only then re-enable normal read/write authority
```

This is stronger than relying on the backup snapshot alone.

## Provider-specific vs portable semantics

Portable SB semantics should own:

- subject/data-category scope;
- retention purpose/basis/horizon;
- disposition intent/state;
- unlinkability/identifiability requirement;
- required sinks/copies and closure policy;
- authority required to request/approve/override;
- evidence proving completion/exception;
- restore/replay non-resurrection rule;
- residual historical claims allowed after disposition.

Providerized mechanics may include:

- SQL delete/anonymisation;
- object-store lifecycle/delete markers;
- Kafka tombstones/compaction;
- search-index deletion;
- KMS/key destruction;
- SaaS provider deletion APIs;
- redactable signatures/chameleon-hash mechanisms;
- backup expiry/secure media sanitization.

A provider is conformant only if it can satisfy the declared semantic disposition profile; "has delete API" is not enough.

## Consequences for existing findings/candidates/hypotheses

### KEEP / HARDEN

- historical interpretation remains distinct from current actuation;
- evidence/provenance identity remains revision-qualified;
- provider mechanics remain non-canonical;
- `INCONCLUSIVE` propagation remains required when closure dependencies disappear.

### GENERALIZE

1. **Historical Interpretation Closure** must become **privacy-filtered historical closure**: preservation dependencies are retained only while lawful/necessary; erased subject-bearing dependencies create scoped information loss rather than silent indefinite retention.
2. **Composite Effect Closure** applies to privacy disposition across stores/providers/backups/key replicas.
3. **Multi-axis revision/evidence vectors** should include `retention/disposition-policy revision` and disposition evidence where relevant.
4. **Qualified local/offline closure** must include privacy tombstones/disposition state so an offline Station cannot resurrect or expose erased data from stale local snapshots.

### SPECIALIZE

- per-record cryptographic erasure;
- anonymisation transforms with measurable re-identification assumptions;
- redactable/sanitizable signatures;
- backup beyond-use windows.

These are mechanism/profile choices, not universal primitives.

### PROVIDERIZE

KMS, Kafka compaction, object-store lifecycle, SaaS erasure APIs, redactable-ledger implementations and storage-specific sanitization remain realization mechanisms.

### DO_NOT_BUILD

- immutable full-personal-data audit log as universal design;
- `hash == anonymous`;
- `delete API ACK == erasure complete`;
- `audit == retain forever`;
- restore-from-backup without disposition replay/reconciliation;
- shared encryption keying that makes one-subject erasure inseparable from unrelated data unless explicitly allowed by profile.

### Candidate promotion disposition

Do **not** promote a new top-level capability from this deep research alone. The semantics appear cross-cutting across Governance/Compliance/Audit, Storage, Lifecycle, Security, Artifact/Provenance, Workflow and Provider/Binding. Capability Synthesis should decide whether `Retention/Privacy Disposition` is a universal lifecycle primitive or a Governance-owned cross-cutting specialization.

## Adversarial/failure analysis

1. **Dictionary attack after "anonymisation"** — retained unsalted/known-domain hash identifies the subject. Result: `PSEUDONYMISED/LINKABLE`, not anonymous.
2. **Key replica survives crypto-erasure** — canonical KMS key deleted but exported/replica material remains. Result: erasure incomplete.
3. **Shared DEK blast radius** — deleting one key destroys records of multiple subjects. Architecture must prevent accidental over-erasure or explicitly model cohort-level erasure.
4. **Stale Station resurrection** — disconnected Station restores old snapshot containing erased subject data. It must ingest qualified disposition/tombstone state before exposing data or remain restricted.
5. **Backup restore resurrection** — archived copy is restored for disaster recovery. Erasure ledger/reconciliation must reapply dispositions before normal service resumes.
6. **Search/index leak** — DB row deleted but autocomplete/search/vector index still returns subject data. Required sink closure remains incomplete.
7. **Provider deletion ambiguity** — timeout after external delete request. Reconcile-before-retry to avoid false completion.
8. **Retained metadata re-identifies** — exact timestamps, unique job/Station/provider IDs and rare event pattern identify a person despite direct-ID removal. Anonymisation proof must assess contextual linkage, not fields in isolation.
9. **Audit exception abuse** — operator marks all data `RETAINED_UNDER_EXCEPTION` with no expiry/basis. Require authority, policy and review evidence.
10. **Erasure destroys legal evidence prematurely** — automatic delete ignores active legal hold/mandatory retention. Disposition engine must evaluate applicable hold/exception and surface conflict, not blindly delete.
11. **Redaction authority compromise** — attacker with chameleon/trapdoor privilege rewrites evidence. Redaction authority must be separated, thresholded/profiled as required, and redaction itself evidenced.
12. **AI privacy amplification** — AI infers/reconstructs erased identity from retained correlated context. Generated surfaces/tools must enforce the same restricted evidence view; AI has no special resurrection authority.

## Proof obligations — DR-PEIP

1. **Direct-ID erasure with retained audit envelope** — erase subject name/email/document while proving process event/revision still interpretable; verify no ordinary API/UI/AGWS path can recover identifiers.
2. **Pseudonym ≠ anonymisation negative proof** — retain a reversible mapping or realistic linkage source; system must refuse `ANONYMISED` status.
3. **Hash dictionary adversarial proof** — hash low-entropy identifier; demonstrate re-identification and failure of anonymisation claim.
4. **Crypto-erasure closure proof** — per-record encrypted payload exists in primary, backup and replica; destroy all required key material and prove decryption infeasible under declared profile while unrelated records remain accessible.
5. **Surviving-key negative proof** — leave one authorized/exported key replica; disposition remains `INCONCLUSIVE/PENDING`.
6. **Shared-key blast-radius proof** — attempt subject-specific erasure where same key protects unrelated subjects; system rejects unsafe erasure or requires explicit cohort disposition.
7. **Composite sink proof** — DB/search/object/provider/cache all required; fail one sink and prove no `ERASED` final state.
8. **Provider ACK ambiguity proof** — lose response after provider deletion; reconcile actual provider state before retry/completion.
9. **Backup beyond-use proof** — erased record remains in immutable backup window but is inaccessible for ordinary processing; on restore, reconciliation re-applies erasure before service resumes.
10. **Stale Station restore proof** — offline Station with pre-erasure snapshot reconnects; erased subject cannot reappear before disposition-state reconciliation.
11. **Retention exception proof** — active legal hold prevents erasure only for explicitly scoped fields/horizon; unrelated data still disposes normally.
12. **Exception expiry proof** — hold expires; retention no longer silently persists and disposition becomes due/requalified.
13. **Historical partial-truth proof** — after subject identity erasure, verifier can prove event type/revision/time while subject-qualified claim returns `ERASED/INCONCLUSIVE`, not fabricated identity.
14. **Redactable-signature proof** — if profile uses cryptographic redaction, remove designated field while retained signature/proof verifies allowed redaction; unauthorized redaction fails and redaction lineage is auditable.
15. **Provider substitution proof** — implement same disposition profile using physical delete on provider A and per-record crypto-erasure on provider B; portable semantic state/evidence remains comparable while mechanism lineage differs.
16. **Metadata linkage adversarial proof** — remove direct IDs but preserve rare timestamp/location/role combination sufficient to re-identify; anonymisation validator must fail or downgrade status.
17. **AI/AGWS authority proof** — Person/Role/AI can request permitted erasure but cannot cancel legal hold, read restricted backup data, recover keys or broaden retention without delegated authority.
18. **Archive/export proof** — identify a previously exported artifact containing subject data; until disposition/exception of that copy is evidenced, global erasure closure remains incomplete.

Suggested later test layers: property/contract for disposition-state transitions; provider conformance for delete/crypto-erasure; integration for multi-sink closure; E2E for subject erasure + audit preservation; migration/recovery drill for backup/Station resurrection; security/adversarial for re-identification and authority.

## Unresolved questions

1. What re-identification risk model/profile is sufficient to call evidence `ANONYMISED_UNLINKABLE` across different jurisdictions/industries?
2. Should the portable primitive be `DataDisposition`, `RetentionDisposition`, a generalized lifecycle transition, or remain Governance-owned policy plus Storage/Provider effects?
3. How should legal hold/conflicting jurisdictions compose across tenant/Station boundaries?
4. Can a generic proof vocabulary express `beyond use` backup status without implying physical deletion?
5. Which historical fields are structurally necessary to prove authority without retaining subject identity, and where is identity itself legally constitutive?
6. How should derived ML/vector/analytics artifacts prove deletion influence or unlearning where raw subject data is gone? This may be separate negative-space research rather than part of generic storage erasure.
7. What formal/empirical anonymisation conformance suite is realistic enough for generated systems without pretending anonymisation is mechanically decidable in all contexts?

## Confidence

**HIGH** on these principles:

- full personal payload must not be the universal immutable provenance model;
- pseudonymisation/hash is not automatically anonymisation;
- erasure is a multi-sink closure problem with backup/restore consequences;
- crypto-erasure is a valid realization under qualified key/material closure, not universal semantics;
- retention exceptions must be scoped and governed;
- historical interpretation may degrade partially after legitimate erasure rather than retaining forbidden data indefinitely.

**MEDIUM** on making a universal `PrivacyDisposition/DataDisposition` primitive. The semantics recur strongly, but Capability Synthesis should reconcile ownership with Governance, Lifecycle, Storage, Security and Provider/Binding before promotion.

**LOW/MEDIUM** on universal cryptographic redaction. Research proves feasibility but also introduces nontrivial redaction-authority and crypto-governance assumptions; keep specialized unless stronger cross-domain demand appears.

## Research recommendation summary

> **KEEP/HARDEN** immutable provenance as immutable *semantic lineage*, not immutable personal payload.
>
> **GENERALIZE** historical closure and composite effect closure with privacy-disposition/retention semantics and explicit `INCONCLUSIVE` when required deletion dependencies cannot be proven.
>
> **SPECIALIZE/PROVIDERIZE** physical deletion, crypto-erasure, tombstones/compaction and cryptographic redaction as alternative mechanics under a portable disposition requirement.
>
> **DO_NOT_BUILD** `hash == anonymous`, `audit == retain forever`, `delete ACK == erased`, or restore paths that can resurrect disposed data.
>
> **DEFER** promotion of a new top-level capability until synthesis reconciles whether Data/Privacy Disposition is universal lifecycle semantics or Governance-owned cross-cutting behavior.

## Next high-value deep question

**Derived-data deletion / machine-unlearning closure:** when erased personal data has already influenced aggregates, embeddings, search indexes, recommendations, trained models or AI memory, what evidence proves that the subject's information is no longer materially recoverable or influential without demanding impossible full retraining for every deletion? This question can change the boundary among Data, AI-native Engineering, Storage, Governance/Audit, qualified evidence and Commercial/analytics negative-space, and is not solved by raw-record deletion alone.
