# Generation 2 — Deep Research: Privacy Retention / Hold / Residency Transition 01

Status: COMPLETE — RESEARCH RECOMMENDATION / NOT TARGET-ARCHITECTURE AUTHORITY

ID: `DR-PRHRT-01`

Date: 2026-09-03

## Research question

When an otherwise valid data transition — delete, archive, restore, replicate, export, relocate, provider-substitute or cross-region migrate — intersects retention schedules, legal/records holds, purpose/use restrictions, data-subject obligations or residency/jurisdiction constraints, **what portable semantic contract lets Generation 2 decide whether that transition is currently permitted and prove its disposition without confusing policy eligibility, provider actuation and physical/effective closure?**

This is exactly one architectural question. It does not reopen whether Privacy is a capability owner; `G2-CAPABILITY-CANDIDATE-PRIVACY-DATA-GOVERNANCE-RETENTION-LEGAL-HOLD-RESIDENCY` is already promoted CROSS_CUTTING. It also does not repeat `DR-PEIP-01` (erasure versus immutable provenance) or `DR-DDMU-01` (derived-data/unlearning closure). The residual question is **transition qualification at the retention/hold/residency junction**.

## Why this is architecturally material

A generic lifecycle engine can correctly determine that object X is old enough to delete, that replica Y can move to provider B, or that archive Z can be restored and still produce a privacy-invalid effect.

The dangerous collapses are:

```text
retention expired       == delete authorized
provider DELETE accepted == disposition closed
region selected          == residency/jurisdiction compliant
legal hold               == unrestricted processing allowed
migration completed      == old-placement obligations closed
```

All five are falsified by mature regulation and provider behavior.

Generation 2 therefore needs a provider-neutral way to qualify a transition against the **controlling obligation set and its producing revisions**, while preserving capability ownership, provider leverage, historical replay and simple-system ergonomics.

## Mandatory SB corpus consumed

This research re-read the authoritative Generation-2 state and method corpus before source selection and reconciled the branch head immediately before persistence:

- `project_docs/generation-2/RESEARCH_PIPELINE_STATE.json` — `phase=RESEARCH_ELICITATION`, seven full cycles complete; current `next_action` requires exactly this Privacy centralized proof junction and forbids synthesis until remaining centralized proof debt is resolved.
- `research/RESEARCH_EVIDENCE_METHOD.md`.
- `research/ARCHITECTURE_PROOF_QUALITY_METHOD.md`.
- `research/CAPABILITY_DISCOVERY_REGISTER.md` — Privacy/Data Governance/Retention/Legal Hold/Residency is already CROSS_CUTTING / PROMOTED / NOT_SATURATED.
- `research/FINDING_INDEX.md` and historical findings retained by prior revisions/dossiers.
- `research/REPRESENTATIVE_COVERAGE.md` — existing deep coverage includes NIST Privacy Framework, GDPR, Microsoft Purview, Google Assured Workloads/Data Residency, AWS Control Tower Data Residency and OPA.
- `research/CAPABILITY_PROOF_MATRIX.md` — Governance, Storage, Data, Lifecycle, Provider, Security/Recovery and offline closure all retain relevant proof debt.
- `research/ENTERPRISE_COMPLETENESS_ARCHITECTURE_PROOF_BACKFILL.md` — Privacy retention/hold/residency is explicitly the next centralized proof junction.
- prior deep researches: `DR-HIC-01`, `DR-PEIP-01`, `DR-DDMU-01`, `DR-QDCE-01`, `DR-ABRT-01`, `DR-TAES-01`, `DR-SRFE-01`, `DR-RRHV-01` and `DR-LGCE-01`.

Breadth material is treated as hypothesis/input evidence, not independent confirmation.

## External evidence ledger

The centralized state requested 3–8 strong representatives. Eight representative families were used because the residual question spans normative obligation, retention/hold mechanics, physical sanitization, asynchronous deletion, residency/transfer and ongoing qualification.

### E1 — EU GDPR: purpose/storage limitation, erasure, restriction and recipient propagation

Primary source: Regulation (EU) 2016/679, EUR-Lex: https://eur-lex.europa.eu/eli/reg/2016/679/oj

Relevant provisions:

- Article 5(1)(b)/(e): purpose limitation and storage limitation.
- Article 17: erasure can become required when grounds apply, but Article 17(3) preserves scoped exceptions including legal obligations and legal claims.
- Article 18: restriction can require continued storage while prohibiting ordinary processing.
- Article 19: rectification/erasure/restriction can create notification obligations toward recipients to whom the data was disclosed.

**Architectural extraction:** retention expiry, erasure eligibility, legal retention/claims and processing restriction are distinct obligations. `PRESERVE` does not imply `USE_ALLOWED`; `ERASURE_REQUESTED` does not imply `DELETE_NOW`; downstream recipients/replicas are part of closure where applicable.

### E2 — EDPB Guidelines 05/2021 + Recommendations 01/2020: transfer qualification is more than storage location

Primary sources:

- EDPB Guidelines 05/2021 Version 2.0 (2023): https://www.edpb.europa.eu/documents/guideline/guidelines-052021-on-the-interplay-between-the-application-of-article-3-and-the_en
- EDPB Recommendations 01/2020 final (2021): https://www.edpb.europa.eu/documents/recommendation/recommendations-012020-on-measures-that-supplement-transfer-tools-to_en

The EDPB treats international-transfer qualification as a relation among exporter/importer/processing circumstances and applicable safeguards, not as a scalar storage-region attribute. Supplementary-measure analysis likewise depends on actual transfer context and effective protection.

**Architectural extraction:** `storageRegion=EU` cannot serve as the universal proof of jurisdiction/transfer compliance. Storage location, processing location, recipient/controller/processor relation, administrative/support access and transfer safeguards can differ. Cross-region/provider movement therefore requires requalification against the applicable placement/transfer policy revision.

### E3 — AWS S3 Object Lock: retention and legal hold are independent controls

Primary source: https://docs.aws.amazon.com/AmazonS3/latest/userguide/object-lock.html

AWS documents retention periods and legal holds as independent. A legal hold has no fixed expiry and can continue protecting an object after its retention period expires. Object Lock applies to versions; creating a delete marker or a new version does not physically erase the protected version. Governance and Compliance modes also have materially different bypass authority.

**Architectural extraction:** `retentionExpired=true` is only one eligibility fact. A controlling hold can still deny deletion. Provider scope/version/bypass semantics are realization details that must map to explicit portable obligations and evidence rather than become canonical Privacy objects.

### E4 — Google Cloud Storage Bucket Lock / holds: multiple retention constraints compose, lock may be irreversible

Primary source: https://cloud.google.com/storage/docs/bucket-lock

Google documents that bucket retention policy can apply retroactively; locked policy cannot be removed or reduced; event-based holds independently block deletion; and an object subject to multiple retention mechanisms remains retained until all controlling requirements are satisfied. Lifecycle deletion waits for retention eligibility.

**Architectural extraction:** the effective constraint is a composition of obligations, not the latest scalar TTL. Changes to retention configuration need their own revision/effective-time lineage. A provider can also make a configuration transition irreversible, which changes rollback feasibility without changing the portable semantic requirement.

### E5 — Azure Immutable Blob Storage: time-based retention and legal holds can coexist

Primary source: https://learn.microsoft.com/azure/storage/blobs/immutable-storage-overview

Azure distinguishes time-based retention from legal hold; both can apply concurrently, and deletion succeeds only when no effective immutable constraint blocks it. Locked retention policies have different mutability from unlocked testing configurations. Legal holds are explicitly cleared rather than expiring by time.

**Architectural extraction:** three major storage providers independently converge on the same principle — time eligibility and hold release are separate predicates — while differing in scope, bypass, locking and version semantics. This is strong evidence for owning the portable requirement but providerizing mechanics.

### E6 — NIST SP 800-88 Rev. 2 (2025): disposal requires outcome assurance, including provider trust

Primary source: NIST publication notice and SP 800-88 Rev. 2: https://csrc.nist.gov/pubs/sp/800/88/r2/final

NIST defines sanitization around rendering access to target data infeasible for a specified level of effort and, in Rev. 2, explicitly emphasizes enterprise sanitization programs, validation, cryptographic erase and trust in vendor implementation of clear/purge techniques.

**Architectural extraction:** a provider API acknowledgement is not by itself proof that a required disposal assurance has been reached. Privacy owns the required disposition outcome/evidence profile; provider-specific purge, crypto-erasure, media sanitation and attestations are mechanics.

### E7 — Amazon DynamoDB TTL + PITR: expiration, service deletion and backup recoverability occur on different timelines

Primary sources:

- TTL: https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/TTL.html
- PITR/delete behavior: https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/PointInTimeRecovery_Howitworks.html

Expired TTL items can remain present for days before asynchronous deletion. With Global Tables, TTL deletion is separately replicated. Deleting a table with PITR enabled creates a system backup retained for 35 days.

**Architectural extraction:** `expired`, `not served`, `deleted from primary`, `replica deletion propagated`, `backup still recoverable` and `disposition closed` are distinct states. The provider's asynchronous timeline must be qualified against the Privacy obligation deadline and restore/non-resurrection policy.

### E8 — NIST Privacy Framework: privacy outcomes span the full data-processing lifecycle and require reassessment

Primary sources:

- Privacy Framework: https://www.nist.gov/privacy-framework
- Getting Started / lifecycle framing: https://www.nist.gov/privacy-framework/getting-started-0
- Using Privacy Framework 1.1: https://www.nist.gov/privacy-framework/using-privacy-framework-11

NIST frames data processing as lifecycle actions including collection, retention, use, disclosure, sharing, transmission and disposal, and emphasizes ongoing reassessment of privacy outcomes rather than one-time configuration.

**Architectural extraction:** retention, transfer and disposal qualification belong to an ongoing governed lifecycle. A previously valid placement/disposition claim can become stale when policy, purpose, subject status, provider realization or obligations change.

## Competing models

### Model A — One scalar retention timestamp controls deletion

```text
if now >= retainUntil:
  delete()
```

**For:** simple and adequate for a narrow unregulated cache.

**Against:** falsified by GDPR exceptions/restrictions and AWS/GCS/Azure independent holds. It also cannot represent purpose restriction, explicit legal obligation, object/version scope, recipient propagation or policy revision.

**Disposition:** `DO_NOT_BUILD` as universal Privacy semantics.

### Model B — Provider-native WORM/retention object is canonical truth

**For:** mature enforcement, operational simplicity, compliance features.

**Against:** S3, GCS and Azure differ materially in scope, bypass, lock mutability, version behavior and composition. Provider replacement would change semantic identity.

**Disposition:** `PROVIDERIZE` mechanics; own portable obligations/evidence.

### Model C — Generic lifecycle transition plus pre-flight privacy check

```text
LifecycleIntent(delete/migrate/archive/replicate)
        ↓
PrivacyQualification(current obligations)
        ↓
ALLOW / DENY / INCONCLUSIVE
        ↓
provider actuation
```

**For:** preserves semantic ownership and prevents ordinary lifecycle operations from bypassing Privacy.

**Against:** insufficient if it treats pre-flight ALLOW as perpetual. Long-running/asynchronous transitions need currentness and postcondition/closure checks.

**Disposition:** `KEEP`, but harden with revision binding, actuation-time requalification and closure evidence.

### Model D — Qualified transition with independently revisioned obligation set and postcondition closure

Conceptually:

```text
TransitionIntent + subject/data-scope revision
+ PrivacyObligationSet revision
+ purpose/use basis revision
+ retention/hold state revision
+ placement/transfer policy revision
+ provider capability/binding revision
+ evidence currentness
        ↓
PrivacyTransitionQualification
        ↓
ALLOW | DENY | INCONCLUSIVE
        ↓
Authorized Actuation
        ↓
Observed Effects / residual copies / recipient-replica-backup state
        ↓
PrivacyDispositionClosure
```

**For:** fits `DR-QDCE`, `DR-LGCE`, `DR-PEIP`, `DR-DDMU` and provider-qualified transition patterns without creating a mega-object. It supports historical replay and currentness invalidation.

**Against:** more explicit metadata than a scalar TTL; requires simple profiles to hide machinery ergonomically.

**Disposition:** strongest portable baseline — `KEEP / GENERALIZE / MERGE` with existing qualified-evidence machinery.

## Strongest evidence for the recommended model

1. **Independent obligation composition is real, not theoretical.** AWS, GCS and Azure all independently model timed retention and legal/explicit hold as separate constraints. Therefore a portable model must represent at least conjunction/precedence of independently sourced obligations rather than one expiration field.
2. **Retention can require storage while use is prohibited.** GDPR Article 18 directly falsifies `preserved == processable`.
3. **Deletion is often asynchronous and multi-copy.** DynamoDB TTL/PITR falsifies `expiry == purge` and `primary delete == no recoverable copy`.
4. **Residency is not a single region label.** EDPB transfer analysis and cloud control packages separate at-rest location from processing/support/access and transfer relationships.
5. **Provider execution needs outcome evidence.** NIST SP 800-88 Rev. 2 makes disposal assurance/validation and vendor trust explicit.
6. **Currentness matters.** NIST Privacy Framework lifecycle reassessment plus G2's existing revision-qualified evidence model support invalidating old Privacy qualifications after relevant obligation/binding changes.

## Strongest evidence against over-generalization

1. GDPR legal concepts are jurisdiction-specific; they must not become the universal vocabulary for every deployment.
2. “Legal hold” in cloud WORM products is an enforcement feature, not a universal definition of every litigation/records-preservation duty.
3. Residency and international-transfer law differ by jurisdiction; G2 must own a **policy/evidence shape**, not encode EU law as architecture.
4. Physical sanitization guarantees differ by medium/provider; universal `PURGED=true` without assurance profile would overstate correctness.
5. Some simple systems genuinely need only a local retention deadline and delete operation; the model must collapse ergonomically when no extra obligation applies.

## Contradictions resolved

### C1 — Retention expiry versus legal hold

Resolved: **expiry means eligible with respect to that retention obligation, not globally authorized to delete.** All controlling obligations must be satisfied or explicitly dispositioned.

```text
retention satisfied
+ active hold
= delete DENIED
```

### C2 — Hold versus processing authority

Resolved: **preservation authority does not confer ordinary use authority.** Restricted data can be retained while processing remains denied except for the specifically admitted basis/scope.

```text
MUST_PRESERVE
!=
MAY_PROCESS_FOR_ANY_PURPOSE
```

### C3 — Provider ACK versus disposition closure

Resolved: `DELETE accepted`, `TTL expired`, `delete marker created`, `key deletion scheduled` and similar provider outcomes are effect evidence, not portable closure by themselves. Closure depends on the required assurance profile, residual replicas/backups/derivatives and evidence currentness.

### C4 — Region placement versus jurisdiction/transfer compliance

Resolved: **physical storage placement is one axis.** Processing, recipient/importer relation, personnel/admin access, transfer path and applicable safeguards can be separate obligations. `region=EU` cannot be a universal privacy proof.

### C5 — Successful migration versus privacy-compliant cutover

Resolved: migrating to an allowed destination does not close the transition while a prohibited/expired source replica, backup, export or provider-internal cohort remains effective beyond the admitted drainage/disposition rule.

### C6 — New policy revision versus historical truth

Resolved: policy changes do not rewrite the producing decision. Historical disposition remains replayable against the revisions/evidence that produced it; current operations are requalified against current controlling obligations.

## Invariants recommended for synthesis

These are research recommendations, not final IR.

### INV-PRHRT-01 — obligation-qualified transition

No privacy-relevant destructive/replicative/placement transition is considered authorized solely from Lifecycle/Provider capability. It must satisfy the applicable Privacy obligation set.

### INV-PRHRT-02 — independent revision axes

Retention schedule, hold/restriction, purpose/use basis, placement/transfer policy and provider binding/evidence can evolve independently and must not be collapsed into one `privacyVersion` if doing so hides which fact invalidated qualification.

### INV-PRHRT-03 — preservation is non-amplifying

A retention/hold obligation may prevent destruction but never broadens processing, canonical mutation, export or AI/AGWS authority.

### INV-PRHRT-04 — destination success does not erase source obligations

Provider/region substitution closes only after destination qualification **and** source/residual cohort disposition or a declared still-lawful residual state.

### INV-PRHRT-05 — missing controlling evidence is not allow

If applicable hold, retention, purpose, placement/transfer or provider-disposition evidence is missing/stale/unresolvable, result is `DENY` where policy says fail-closed or otherwise `INCONCLUSIVE`; never implicit PASS.

### INV-PRHRT-06 — historical replay

A historical disposition claim binds the producing subject/data scope, obligation/policy revisions, provider realization, evidence closure and observation horizon. Later policy changes create new qualification, not destructive reinterpretation.

### INV-PRHRT-07 — offline boundedness

A disconnected Station cannot promise instantaneous global hold/deletion/residency-currentness under partition. Offline behavior must be explicitly bounded by pre-admitted policy horizon/operation class; reconnect forces reconciliation/requalification.

### INV-PRHRT-08 — provider-neutral outcome, provider-specific mechanics

G2 owns required outcome/evidence semantics; WORM modes, bucket locks, TTL, purge, replication, cryptographic erase and regional-control products remain provider realizations.

## Failure / adversarial analysis

### F1 — hold arrives after deletion qualification but before actuation

Prior ALLOW becomes stale. Actuation must requalify or enforce a sufficiently tight validity/lease window. If provider deletion outcome is already ambiguous, reconcile actual state before deciding whether hold can still be satisfied.

### F2 — hold arrives while asynchronous purge is underway

The system cannot claim hold satisfaction merely because a logical record remains in one backup. It must classify what copies are still preservable, what have irreversibly disappeared and whether the legal/enterprise obligation can still be met. Outcome may be `INCONCLUSIVE`/exception/escalation rather than synthetic success.

### F3 — delete primary while backup remains restorable

Primary serving state can become absent while disposition closure remains pending. Restore paths must carry non-resurrection controls from `DR-PEIP-01`; restored state needs privacy requalification before becoming active.

### F4 — migrate EU→EU but provider support/admin path changes

Same storage geography can still change transfer/access/support conditions. Provider substitution therefore invalidates prior placement qualification unless equivalence is proven for the controlling policy axes.

### F5 — move data to allowed region but leave source replica behind

Destination readiness does not close source residency obligation. Residual source copies require drainage/deletion/restriction evidence or explicit retained-lawful status.

### F6 — change retention policy retroactively

Provider features may apply retention changes retroactively to existing objects. G2 must preserve both provider-effective behavior and the enterprise/legal policy revision/authority that admitted the change; a provider accepting a shorter policy does not prove the organization was authorized to shorten it.

### F7 — AI requests privacy waiver to finish an operation

AGWS/AI can surface conflict or draft a disposition proposal but cannot create a legal-hold release, broaden purpose, choose an otherwise prohibited jurisdiction or bypass provider immutability unless separately delegated authority exists. Enterprise → Station → Role → Person remains non-amplifying.

### F8 — Station is offline when Enterprise issues hold/delete/residency change

There is an unavoidable partition trade-off. If local continued operation is allowed, the architecture must state the maximum stale-policy horizon and which data actions remain permitted. On reconnect, unresolved local actions must be reconciled; G2 must not retroactively claim they were governed by a revision the Station could not observe.

### F9 — provider reports “deleted” but assurance semantics are weaker

A provider that can only prove logical non-serving cannot satisfy a policy requiring purge/unrecoverability without additional evidence/mechanism. Provider negotiation returns unsupported/partial/inconclusive rather than silently mapping to strong closure.

## Provider-specific vs portable semantics

### Portable semantics G2 should own

- identity/scope of the governed data or data class;
- transition intent and operation class;
- independently revisioned controlling obligation/policy references;
- purpose/use restriction and allowed-operation scope;
- retention eligibility and hold/restriction applicability;
- placement/transfer requirements expressed as policy requirements, not provider region objects;
- qualification result with reasons: `ALLOW`, `DENY`, `INCONCLUSIVE` (exact final vocabulary synthesis-controlled);
- currentness/applicability/evidence provenance;
- residual-copy/recipient/replica/backup disposition obligations;
- historical producing-revision replay;
- authority required to create/release exception/hold or change policy.

### Providerized mechanics

- S3 Object Lock Governance/Compliance, legal hold, bucket policy condition keys;
- GCS Bucket Lock/Object Retention/Event-based Hold;
- Azure immutable blob WORM/legal hold;
- DynamoDB TTL/PITR/global-table deletion propagation;
- KMS/HSM/media sanitization and cryptographic erase;
- cloud region/org-policy/sovereign-control packages;
- backup retention, purge APIs, replication controls and provider audit receipts.

Provider conformance must state which portable obligations each mechanism can prove and at what assurance/currentness level.

## Consequences for existing findings/candidates/hypotheses

### Privacy candidate

`G2-CAPABILITY-CANDIDATE-PRIVACY-DATA-GOVERNANCE-RETENTION-LEGAL-HOLD-RESIDENCY` should **KEEP** its promoted CROSS_CUTTING status. This research does not justify another top-level capability.

The owner should be hardened around a small semantic boundary:

> **Privacy owns the controlling data-use/disposition/placement obligation and qualification semantics; Lifecycle owns transition progression; Provider Binding owns realization capability; Data/Storage own concrete data identity/topology; Governance/Audit owns evidence and exception accountability; Security/Recovery owns restore/recovery mechanics.**

### `DR-PEIP-01`

**KEEP/HARDEN.** Its multi-sink erasure closure becomes one specialization of a broader privacy-transition qualification. Provider delete ACK remains insufficient.

### `DR-DDMU-01`

**KEEP.** Derived/influence removal is a specialized descendant-closure problem after Privacy determines the controlling disposition obligation.

### `DR-QDCE-01`

**MERGE.** `PrivacyTransitionQualification` should reuse the qualified-derived-claim relation rather than invent a parallel generic evaluation system.

### `DR-LGCE-01` / revision vectors

**HARDEN.** Privacy obligation axes can change independently. Old ALLOW evidence must become stale when a controlling axis changes.

### `DR-TAES-01`

**MERGE.** Retention eligibility, hold effective interval, disposition deadline and offline policy horizon need typed temporal evidence, not one generic timestamp.

### Provider leverage hypothesis

**KEEP.** Mature WORM, TTL, backup, region and sanitization mechanics should be delegated to providers where they conform. The SB owns requirements, qualification and evidence closure.

## Explicit research dispositions

- **KEEP** — promoted Privacy/Data Governance/Retention/Legal Hold/Residency semantic owner.
- **GENERALIZE** — privacy-relevant transition qualification across delete/archive/restore/replicate/migrate/provider-substitute operations.
- **MERGE** — with existing qualified-derived-claim, revision/currentness, temporal evidence, residual-cohort and historical replay machinery.
- **SPECIALIZE** — erasure, restriction, records/legal hold, retention schedule, data-subject response, international transfer, residency/sovereignty and derived-data deletion profiles.
- **PROVIDERIZE** — WORM/object-lock/bucket-lock/TTL/PITR/purge/KMS/region-control and provider audit mechanics.
- **DEFER** — jurisdiction-specific legal vocabulary and automated legal-rule interpretation to policy packs/adapters, not universal architecture.
- **DO_NOT_BUILD** — universal scalar `retainUntil`, `legalHold=true` as complete semantics, `region=country` as jurisdiction truth, provider `DELETE accepted` as disposition closure, hold as processing authority, or migration success as proof that source/residual obligations are closed.

## Proof obligations — `DR-PRHRT-01..24`

Each material conclusion has an adversarial falsification path.

1. **Retention-expiry + active-hold proof:** retention expires while a controlling hold remains active. Delete must be DENIED.
2. **Hold-release proof:** release the hold under authorized revision while retention is already satisfied. Prior DENY becomes stale; new qualification may ALLOW if no other obligation blocks.
3. **Restriction-with-storage proof:** processing is restricted while storage is still required. Read/use/export is denied except admitted scope; deletion is not falsely forced.
4. **Erasure-exception proof:** valid erasure request conflicts with independently applicable legal/records obligation. Preserve scoped retained state and basis rather than global delete or retain-all.
5. **Purpose-expiry proof:** retention period has not elapsed but original processing purpose/basis is no longer valid for ordinary use. Retention cannot be used as permission to process.
6. **Policy-revision currentness proof:** qualify delete under policy P1, introduce controlling P2 before actuation, and prove P1 ALLOW becomes stale/inapplicable.
7. **Independent-axis proof:** change hold revision without changing retention schedule revision; evidence must identify the actual invalidating axis rather than bumping an opaque privacy version only.
8. **Provider-ACK negative proof:** provider accepts DELETE but physical/backup disposition evidence is still pending. Result cannot be `DISPOSITION_CLOSED`.
9. **TTL-lag proof:** item expires but remains present during provider TTL lag. Expiry/eligibility and provider physical state remain distinguishable.
10. **Backup-resurrection proof:** delete active state while PITR/backup still contains the data, then restore. Restored data must not silently return to active lawful use without privacy requalification.
11. **Replica propagation proof:** delete one replica while another remains effective; closure stays partial/inconclusive until residual disposition is known.
12. **Legal-hold + versioning proof:** create delete marker/new version while protected prior version remains. User-visible absence cannot masquerade as erasure.
13. **Residency-destination proof:** migrate into an allowed region but leave a disallowed source replica. Transition is not closed.
14. **Transfer-path proof:** source/destination storage regions are individually allowed but the transfer/recipient path violates controlling transfer policy. Migration must be DENIED/INCONCLUSIVE.
15. **Administrative-access proof:** data stays in allowed storage region while provider support/admin access profile changes to a disallowed jurisdiction/personnel class. Prior residency/sovereignty qualification becomes stale.
16. **Provider-substitution proof:** substitute provider A with B claiming the same region label but weaker hold/purge/residency evidence. Require capability/evidence requalification, not semantic equivalence by label.
17. **Locked-policy irreversibility proof:** provider retention policy becomes irreversibly locked. Architecture must expose rollback infeasibility rather than treat provider config as an ordinary reversible setting.
18. **Historical replay proof:** after privacy policy evolves from P1 to P2, replay why historical transition T1 was allowed/denied under P1 without claiming P1 authorizes new acts.
19. **Late-hold race proof:** hold arrives after preflight ALLOW and before deletion actuation. Actuation-time currentness check must block or classify ambiguous outcome.
20. **Offline-Station hold proof:** Station misses a new Enterprise hold while disconnected. Local action is judged under explicit stale-policy horizon; reconnect requires reconciliation and must not invent observation of the unseen revision.
21. **Offline-Station deletion proof:** Enterprise issues deletion while Station is offline. System must expose pending residual local disposition and bound continued processing; instantaneous global deletion cannot be claimed.
22. **AI/AGWS non-amplification proof:** AI/Role/Person asks to bypass hold, widen purpose or choose forbidden region. Proposal/escalation may occur; authoritative policy/hold mutation remains denied without explicit delegated authority.
23. **Sanitization-assurance proof:** provider supplies logical-delete evidence while policy requires purge/unrecoverability. Provider satisfaction is PARTIAL/INCONCLUSIVE until stronger admitted evidence exists.
24. **Simple-system ergonomics proof:** a one-node local system with one retention rule and no hold/residency constraints can satisfy the same semantics with a small direct policy + delete evidence path, without requiring distributed policy, WORM or cloud-control infrastructure.

## Centralized proof disposition

Research recommendation: **`privacy retention/hold/residency disposition` is RESOLVED_BY_MULTI_REPRESENTATIVE_RESEARCH**, subject to gate reconciliation.

The proof is not “Privacy always allows or denies correctly because a provider says so.” The portable claim is narrower and testable:

> **Any privacy-relevant transition is qualified against the currently applicable, independently revisioned obligation set. A controlling retention/hold/purpose/use/placement/transfer rule can DENY or make an otherwise valid transition INCONCLUSIVE. Provider actuation never closes disposition by itself; closure requires observed residual-state/evidence appropriate to the required assurance. Provider/region substitution and obligation revision invalidate prior qualification unless equivalence/currentness is proven. Historical decisions remain replayable against their producing revisions.**

This resolves the current Enterprise Completeness proof junction without promoting another capability.

## Unresolved questions

1. Exact canonical names/schema for obligation sets, transition qualifications and closure claims remain synthesis-controlled.
2. Jurisdiction-specific precedence/conflict resolution belongs in legal/policy profiles; research does not claim one global law ordering.
3. The minimum universal placement-policy vocabulary (storage/process/access/recipient/transfer axes) should be consolidated during Capability Synthesis; do not prematurely encode every sovereignty concept.
4. Privacy-safe disposal of learned models remains governed by `DR-DDMU-01`; this research does not redefine machine-unlearning guarantees.
5. Offline compliance horizons depend on operation/data class and legal profile; no universal duration is justified.

## Confidence

- **High** — timed retention and hold/restriction are independent obligations; preservation does not imply ordinary processing authority.
- **High** — provider ACK/TTL expiry is weaker than full disposition closure where residual replicas/backups/purge assurance matter.
- **High** — provider/region substitution needs requalification rather than label equivalence.
- **High** — historical disposition must bind producing policy/evidence revisions.
- **Medium-high** — a small generalized privacy-transition qualification is the right synthesis shape; exact fields and owner interfaces need cross-capability synthesis.
- **Medium** — the minimum portable vocabulary for jurisdiction/sovereignty beyond storage/process/access/transfer dimensions remains policy-profile dependent.

## Recommended next deep question

After this centralized junction is reconciled, follow the live pipeline state rather than this artifact by habit. If the state continues to prioritize the remaining Enterprise Completeness debt, the highest-value next question is expected to be **AI evaluation qualification and stale-evidence rejection**: what exact revision/evidence closure makes model/prompt/evaluator/provider safety evaluation portable, and which changes invalidate prior PASS without turning AI evaluation into an authority source.
