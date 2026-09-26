# G4 — Web Desktop Content Deduplication, Artifact Identity & Privacy Research

Status: `RESEARCH_ACTIVE / NON_EXECUTABLE`
Execution authority: NONE
Date: 2026-09-23
Scope: G4 Frontend / Web Desktop & Application Environment

## Purpose

Continue the G4 Web Desktop consolidation at the open boundary between large-transfer finalization, semantic acceptance, storage economics, privacy, retention and cryptographic isolation.

This is documentary P&D only. It does not select a storage provider, deduplication scheme, encryption construction, package, WBS, Work Package, Sprint or TASK and does not authorize product implementation.

The interaction hierarchy remains:

`Builder Home/Factory -> Client -> Workspace -> Desktop Sphere -> Application -> Window -> View/Tab/Tool`.

3D remains an optional projection/application and is not a navigation, storage or authority substrate.

## Inputs deduplicated in this round

The current :00/:10/:20/:40 outputs were treated as upstream constraints rather than repeated:

- Componentes evidence invalidation: evidence currentness is revision- and proof-class-sensitive; dependency reachability is not authority.
- bounded trust-fork reconciliation: mergeable bytes do not imply mergeable authority; historical effects survive reconciliation.
- dynamic release cohort recontainment: invalidation closes the minimum admission frontier; recontainment is a new effect, not time reversal.
- monitoring cost/fairness admission: shared work does not imply shared authority, cost ownership or priority.

The immediately preceding transfer research already separates source snapshot, transfer session, destination commit/version, semantic acceptance and residual cleanup. This round does not reopen that lifecycle. It asks what may be physically shared after semantic acceptance without collapsing business artifact identity, Client isolation, cryptographic domains or retention obligations.

## Core finding

`Content equality != artifact identity != ownership != authorization != retention identity != cryptographic domain`.

A content-addressed/deduplicated storage layer may recognize byte equality as an optimization fact. It must not promote that equality into a cross-Client semantic identity or observable existence fact.

Required distinctions:

- `same bytes != same business artifact`;
- `same content digest != same authorization scope`;
- `same physical blob != shared ownership`;
- `shared physical extent != shared retention policy`;
- `one logical reference deleted != physical bytes deletable`;
- `last visible reference removed != no hidden/legal/backup reference`;
- `content hash known != proof of possession/ownership`;
- `dedup hit != information safe to disclose`;
- `encryption compatible with dedup != confidentiality automatically adequate`;
- `malware verdict shared != disclosure scope shared`;
- `provider object identity != SB semantic artifact identity`;
- `storage saving != authority to widen a dedup domain`.

This extends the existing G4 rule `Dedup scope != global correlation scope` into the Web Desktop/Application storage boundary.

## Benchmark and literature evidence

### Cross-user deduplication creates an existence side channel

Harnik, Pinkas and Shulman-Peleg's work on deduplication side channels identifies the fundamental tension: cross-user deduplication gives better storage savings but can leak whether another user already stores predicted content. A protocol that answers "already present" faster/cheaper or skips upload can itself become an existence oracle.

Architectural consequence:

`DedupDecision` is sensitive internal evidence. It is not ordinary upload progress metadata and should not be projected to a principal unless the disclosure is independently authorized.

### Message-locked/convergent encryption does not make the privacy problem disappear

Bellare, Keelveedhi and Ristenpart formalized message-locked encryption for secure deduplication. Their DupLESS work explicitly notes that conventional convergent encryption derives encryption material from the message and is inherently susceptible to offline brute-force/dictionary attacks for predictable content; server-aided key derivation is proposed to improve resistance.

Architectural consequence:

G4 must not specify `ciphertext = deterministic(content)` or a global convergent-encryption domain merely because it enables deduplication. Encryption/dedup compatibility is a security design decision with a named threat model, not a storage implementation detail.

### Retention/legal hold attaches to logical/versioned obligations, not byte equality

Amazon S3 Object Lock demonstrates that retention and legal holds apply to individual object versions. A protected version can coexist with newer versions of the same key, and legal hold is independent from retention period.

Architectural consequence:

If SB ever shares a physical content extent beneath multiple logical artifacts, each logical artifact/reference still needs its own retention/legal/disposition obligations. One consumer's erasure cannot authorize deletion while another qualifying hold survives.

### Encryption keys create real cryptographic domains

Google Cloud Storage CMEK permits bucket/object key control, records key association, and requires rewrite to re-encrypt existing objects under another key. Disabling/destroying a key can make affected object data unreadable while object metadata/storage can remain. The documentation also warns that object names/most metadata are not protected by the object CMEK.

Architectural consequence:

`same plaintext bytes != same admissible ciphertext/storage realization`. Client/environment/key-domain isolation can legitimately prevent physical deduplication. Key lifecycle and data lifecycle are related but not interchangeable.

## Candidate identity model

Keep these identities independent:

```text
SemanticArtifactRef
  domain/business identity

ArtifactOccurrenceRef
  one accepted/imported occurrence/revision

ContentDigestClaim
  algorithm/profile + digest + byte-length + canonicalization scope

DedupDomainRef
  boundary inside which equality may be evaluated/reused

PhysicalContentRealizationRef
  provider/storage realization; may serve several logical refs only if qualified

EncryptionDomainRef
  key/trust/crypto boundary

RetentionObligationRef
  retention/legal/hold/disposition obligation

MalwareVerdictRef
  scanner/profile/signature/currentness-qualified verdict

ReferenceEntitlementRef
  principal/scope rights to one logical artifact/reference
```

A candidate `ContentEquivalenceClaim` is evidence, not identity:

```text
ContentEquivalenceClaim
  leftSnapshotRef
  rightSnapshotRef
  digestProfileRef
  canonicalizationProfileRef
  byteLength
  evidenceRefs[]
  currentness
  disposition = EQUAL | DIFFERENT | PARTIAL | UNKNOWN
```

Even `EQUAL` does not authorize sharing.

## Deduplication scope taxonomy

Candidate dedup scopes, from least to most privacy-sensitive:

1. `WITHIN_ARTIFACT_REVISION` — repeated chunks inside one occurrence.
2. `WITHIN_WORKSPACE` — content reuse inside one Workspace under one compatible security/retention domain.
3. `WITHIN_CLIENT` — reuse across Workspaces of the same Client when policy, key domain and disclosure rules allow it.
4. `WITHIN_TRUST_DOMAIN` — explicitly governed group of Clients/contexts with common dedup/privacy policy.
5. `CROSS_CLIENT_OPAQUE_BACKEND` — physical optimization hidden below SB semantic/disclosure interfaces.
6. `GLOBAL` — highest correlation/privacy risk; not a default candidate.

The scope is policy/security input, not an optimization chosen dynamically by the storage adapter.

`larger dedup scope -> potentially larger saving + potentially larger correlation surface`.

Unknown scope compatibility fails closed to separate realizations rather than silently broadening correlation.

## Dedup qualification vector

A candidate physical reuse decision needs independent dimensions:

```text
DedupQualification
  contentEquality
  authorizationIsolation
  disclosureIsolation
  encryptionDomainCompatibility
  retentionCompatibility
  residency/placementCompatibility
  malwarePolicyCompatibility
  deletion/erasureCompatibility
  providerCapabilityCompatibility
  migrationPortability
  sideChannelRiskDisposition
  evidenceCurrentness
  disposition
```

No scalar `dedupAllowed=true` is sufficient.

Important rule:

`retention compatible != retention identical`.

Two references may share bytes while having different expiry dates only if the physical realization can survive until every live obligation is settled and deletion/accounting remains reference-aware. If that cannot be proven, sharing is not qualified.

## Logical reference lifecycle over shared physical content

Candidate lifecycle:

```text
ARTIFACT_ACCEPTED
 -> CONTENT_QUALIFIED
 -> DEDUP_SCOPE_QUALIFIED
 -> PHYSICAL_REUSE_PROPOSED
 -> SECURITY/RETENTION/KEY CHECKED
 -> LOGICAL_REFERENCE_ATTACHED
 -> REUSE_EFFECT_VERIFYING
 -> REUSED_EFFECTIVE | SEPARATE_REALIZATION | UNKNOWN
```

Reference disposal is a separate lifecycle:

```text
REFERENCE_DELETE_REQUESTED
 -> REFERENCE_AUTHORITY_QUALIFIED
 -> LOGICAL_REFERENCE_REMOVED
 -> RESIDUAL_OBLIGATIONS_RECONCILING
 -> PHYSICAL_DELETE_ELIGIBLE | PHYSICAL_CONTENT_STILL_REQUIRED | UNKNOWN
 -> PHYSICAL_DELETE_SUBMITTED?
 -> PHYSICAL_DELETE_VERIFIED?
```

`REFERENCE_REMOVED != PHYSICAL_DELETE_ELIGIBLE`.

The residual set includes other logical references, legal/retention holds, quarantine, migration copies, backup/DR obligations, in-flight readers/effects and provider-side protected versions where relevant.

## Erasure and legal-hold contradiction

A user/Client may have a valid erasure request for one logical artifact while another Client or regulated context has an independent retention/legal obligation over equal bytes.

A globally shared blob makes "delete my bytes" physically ambiguous unless logical/cryptographic isolation is designed for it.

Candidate outcomes:

- detach only the requesting logical reference and preserve shared bytes for surviving lawful obligations;
- crypto-shred only a per-reference/per-domain key wrapping layer if the cryptographic construction actually provides independent unreadability;
- create separate physical realizations when erasure independence is a hard requirement;
- block/qualify deletion when legal hold dominates according to explicit policy;
- preserve evidence that a reference was erased without retaining payload as an audit shortcut.

`evidence retention != payload retention exemption` remains mandatory.

## Encryption-domain implications

Deduplication and encryption pull in opposite directions when equality must remain hidden across tenants.

Candidate architecture must keep these questions explicit:

- Is equality computed before or after encryption?
- Who can observe equality tags/digests?
- Are keys Client-, Workspace-, Environment-, artifact- or global-scoped?
- Can two equal plaintexts under different key domains share a physical realization without widening decryption authority?
- Does rekey require rewrite/new realization?
- Does key destruction make only one logical reference unreadable or every reference sharing the ciphertext?
- Is low-entropy/predictable content vulnerable to dictionary confirmation?
- Can a malicious tenant probe existence using upload timing, bandwidth, quota delta or API response shape?

No global convergent-encryption policy is selected here.

## Proof-of-ownership is not business ownership

Research literature often uses proof-of-ownership/possession protocols to prevent an attacker from claiming a deduplicated file merely by knowing its digest.

G4 must preserve a semantic distinction:

`cryptographic proof of possession != domain ownership != authorization to attach artifact reference`.

A principal that possesses the bytes of a confidential template may still lack authority to create a reference in a protected Client, publish it, disclose another Client's existence, or inherit metadata/retention labels.

Proof-of-possession can be one security input. It never becomes the Application Manager or domain authorization model.

## Malware/scanning verdict sharing

Content-addressed storage creates an attractive optimization: scan bytes once and reuse the verdict. That is safe only if the verdict is qualified by scanner engine/profile/signatures/policy/time and the content identity is proven equivalent.

Candidate:

```text
MalwareVerdict
  contentClaimRef
  scannerProfileRef
  signatureSetRevision
  policyProfileRef
  scannedAt
  evidenceRefs[]
  disposition
```

Rules:

- `same bytes + same current scanner profile` may justify reuse of a scan result within allowed disclosure boundaries;
- a verdict becoming stale invalidates the malware claim, not artifact identity;
- a later malicious verdict can quarantine every logical reference depending on the same physical content only according to each Client's policy/authority;
- one Client must not learn "another Client already uploaded this malware/sample" through verdict-reuse UI;
- quarantine of one logical reference does not automatically transfer business authority over other references.

`Shared malware evidence != shared incident authority`.

## Content-addressed naming and privacy

A digest can be useful as an internal correlation key but is not automatically safe UI/telemetry metadata. For predictable documents, a known digest can act as a membership probe. Therefore:

- raw global content digests should not be default browser-visible identifiers;
- telemetry should prefer scoped opaque refs and size/cardinality buckets;
- logs must avoid exposing global dedup-hit status across Clients;
- provider object keys should not embed sensitive filenames/business metadata by default;
- content digest equality across encryption/trust domains is a security-sensitive relation;
- metrics can expose aggregate dedup ratio without exposing which artifact matched which tenant.

`hash != harmless metadata`.

## Application Portfolio Matrix delta

The seven integration modes remain valid and intentionally non-exclusive:

| Capability/task | Candidate mode(s) | Dedup/storage-specific qualification |
|---|---|---|
| SB artifact/document browser | Native SB / API-backed | Native semantic identity and authority; backend storage may be external |
| large import/export | Hybrid / API-backed / Native bridge where local capability is required | transfer/finalize identity, source privacy, content-equality non-disclosure |
| object-storage administration | Hybrid + Deep-link; API-backed common path | provider version/lock/key semantics preserved; advanced provider-native UI remains available |
| malware/content scanning | API-backed / Hybrid | verdict currentness, tenant disclosure isolation, replaceability |
| retention/legal-hold administration | Native SB semantic policy + API-backed provider realization; Deep-link for specialist recovery | policy != provider config; hold evidence and effect verification required |
| encryption/KMS administration | Hybrid/API-backed + Deep-link | SecretRef/key refs only; key authority and provider-native lifecycle preserved |
| desktop Observatory | Native projection over API-backed evidence | aggregate savings/cost/currentness without cross-Client existence disclosure |
| Operations Desktop remediation | Native coordination + API-backed effects | explicit authority; no dedup optimization grants mutation authority |
| external mature storage console | Deep-link / Embedded only when qualified | external session/currentness/licensing/security boundaries remain explicit |
| local filesystem/device ingest | Native bridge / browser-local capability + API-backed transfer | local handle non-portability and source snapshot qualification preserved |

New portfolio criteria added by this round:

1. dedup-scope visibility/control;
2. cross-tenant existence-leak resistance;
3. content-identity disclosure behavior;
4. encryption-domain compatibility;
5. per-reference retention/hold fidelity;
6. erasure independence;
7. physical-reference accounting;
8. malware-verdict currentness/reuse fidelity;
9. provider lock/version semantics;
10. key rotation/rewrite portability;
11. content-address portability;
12. migration behavior for shared extents;
13. ability to represent `PARTIAL/UNKNOWN` residuals;
14. lock-in created by provider-native dedup/key/retention coupling.

An integration that saves storage but cannot explain or preserve these dimensions is not automatically preferable.

## Mandatory synthesis against the Web Desktop model

### Desktop Sphere taxonomy

No taxonomy change. DESIGN, OPERATIONS, OBSERVABILITY, GOVERNANCE, DATA, INFRASTRUCTURE, SUPPORT and FACTORY-style spheres remain job-oriented. Storage/dedup is a capability surfaced through applications, not a new Desktop identity.

### Window Manager / multi-display

No authority moves with a Window. A transfer/dedup inspector opened on another display attaches to the same semantic operation/evidence; it does not create a new content identity, reference or retention obligation. Sensitive equality/digest data remains disclosure-qualified per SurfaceSession/DeviceSession.

### Observatory vs Pinned Monitoring Surface vs Operations Desktop

Observatory may show dedup ratio, physical/logical storage, residual obligations and provider cost as qualified aggregate evidence. A pinned surface is a presentation of selected evidence. Operations Desktop may issue authorized quarantine/delete/rekey/reconcile effects. None of these three is interchangeable.

### Application Manager lifecycle

`Install != Adopt != Register != Deploy` remains unchanged. Adopting an external storage/scanner/KMS console does not adopt its global content identity or retention model. Application Manager records integration/management boundaries; semantic artifact ownership remains with the owning domain/application.

### Control Center

Control Center is the natural projection for dedup scope policy, storage placement, encryption-domain selection, retention defaults and provider bindings, with provenance/inheritance visible. It must preserve `Policy != configuration` and `Desired != Observed != Effective`.

### Declarative service deployment / auto-binding / hosting

Storage services may declare requirements such as object storage, KMS, scanner or retention capability. Auto-binding may propose compatible realizations but cannot silently widen a dedup domain, merge key domains or choose a weaker retention implementation to save cost. `Automatic != hidden`.

### External mature tool reuse

Mature object-storage/KMS/scanner consoles should be reused where they carry specialist provider semantics. SB should own semantic intent, authority, provenance, evidence correlation and common-path orchestration rather than clone every provider console.

### Proprietary editor family/shared primitives

Document/media/data editors should reuse a shared artifact-reference picker, upload/finalization state, version guard, retention indicator, quarantine/evidence projection and conflict/recovery grammar. They should not each implement storage dedup logic.

### Workflow/View/Form/Component bridge

A file/content field is a typed artifact binding, not a Workflow state. Upload completion is not a Workflow transition unless the workflow contract declares it. A button such as "Replace file" is an affordance for a domain command; it is not the command identity itself. Content equality does not merge Workflow occurrences.

### Declarative + opinionated UX

Default UX should hide physical dedup mechanics from ordinary users while keeping material consequences explainable: retention blocked, quarantine, rekey required, duplicate business artifact detected within authorized scope, storage optimization unavailable due to security domain, or residual physical retention. Opinionated defaults must never conceal weaker security/currentness.

### Open-source/plugin/adapter boundaries

Storage/dedup/KMS/scanner adapters normalize only declared capabilities. They must not manufacture equivalence between provider ETag/hash/generation, SB content digest, semantic revision, retention guarantee or encryption domain. Plugin-specific opaque semantics remain qualified and can force separate realizations.

## Componentization complexity map delta

This is a future decomposition aid only; it is not WBS.

### C0/C1 — primitive contracts/state

- `SemanticArtifactRef`
- `ArtifactOccurrenceRef`
- `ContentDigestClaimRef`
- `DedupDomainRef`
- `PhysicalContentRealizationRef`
- `EncryptionDomainRef`
- `RetentionObligationRef`
- `ReferenceEntitlementRef`
- `MalwareVerdictRef`
- `ResidualReferenceClaim`
- `DedupDisposition`

### C2 — reusable compounds

- `ArtifactIdentityBadge`
- `RetentionHoldBadge`
- `EncryptionDomainBadge`
- `QuarantineStatus`
- `PhysicalReuseNotice` only for authorized diagnostic users
- `ResidualReferenceSummary`
- `RekeyRequiredNotice`
- `ContentEvidenceCurrentnessBadge`

### C3 — shared foundations with high cost-reduction leverage

- `ArtifactReferenceRegistryBoundary`
- `ContentEquivalenceBoundary`
- `DedupScopeQualificationBoundary`
- `PhysicalReferenceAccountingBoundary`
- `EncryptionDomainQualificationBoundary`
- `RetentionObligationResolverBoundary`
- `ErasureEligibilityBoundary`
- `MalwareVerdictQualificationBoundary`
- `ContentDisclosureBoundary`
- `SharedExtentMigrationBoundary`
- `ResidualPhysicalEvidenceBoundary`
- `ContentTelemetryDisclosureBoundary`

These foundations reduce repeated implementation in Document, Data, Media, Deployment/Storage and import/export applications.

### C4 — inspectors/tools

- artifact/reference lineage inspector;
- retention/hold inspector;
- encryption/key-domain inspector;
- dedup qualification inspector;
- residual physical-reference inspector;
- quarantine/malware evidence inspector;
- migration/rekey impact inspector.

### C5 — application-specific semantics

Must remain application/domain-owned:

- what constitutes a business duplicate;
- whether equal content should reuse, fork or reject a semantic artifact;
- overwrite/version policy;
- domain metadata and referential integrity;
- publication/effect authority;
- retention classification and legal basis;
- malware response policy;
- export/disclosure policy;
- compensation/remediation semantics.

### C6/C7 — composition

Desktop Sphere, Workspace and Builder Home compose projections of the above without owning content or storage authority.

## Adversarial proof matrix

Future Product Proof should cover at least:

1. Client A uploads predictable file; Client B must not learn A has it from response shape/timing/bytes skipped.
2. Equal bytes in two Clients with incompatible encryption domains produce separate realizations or a proven safe sharing construction.
3. One reference deleted while another has active legal hold; bytes remain required.
4. One Client's legal hold expires while another's does not.
5. Provider reports dedup success but reference accounting is `UNKNOWN`; no physical-delete eligibility is inferred.
6. Global digest leaks into telemetry and is correlated across Clients — must be detected as disclosure failure.
7. Low-entropy file under naive convergent encryption permits dictionary confirmation — threat model rejects unqualified scheme.
8. Malware verdict was clean under old signatures, then becomes stale; artifact identity remains while verdict currentness degrades.
9. Later malicious verdict affects shared bytes; each logical reference receives policy-scoped quarantine/remediation handling.
10. Scanner unavailable; cached verdict outside currentness horizon does not remain `CURRENT`.
11. Key rotation changes encryption domain; old shared realization cannot be assumed reusable.
12. Key destroyed for one domain; unrelated Client reference must remain readable if isolation promised.
13. Provider migration cannot preserve shared-extent semantics; migration expands to separate copies without semantic identity merge.
14. Retention provider lacks per-version hold fidelity; adapter cannot fabricate it.
15. S3-style locked V1 plus newer V2: deleting current key/delete marker does not prove V1 gone.
16. Erasure request conflicts with lawful hold; payload disposition follows explicit policy while audit evidence remains payload-minimal.
17. Two equal files have different business metadata; dedup must not merge semantic artifacts.
18. Same file imported twice into one Workflow; content equality must not collapse occurrence identity.
19. Cross-device resume recomputes digest but source snapshot changed; no old equivalence claim is reused blindly.
20. Hash algorithm/profile is deprecated; equality evidence becomes stale without declaring content different.
21. Canonicalization profile changes; semantic/content equivalence is requalified selectively.
22. Provider object ETag is mistaken for SB content digest — proof must fail.
23. Deep-linked provider console mutates retention outside SB; observed/effective reconciliation detects drift.
24. External storage console can see global dedup state but SB principal cannot; embedding must not widen disclosure.
25. Shared physical object becomes unavailable; all dependent logical references are correlated for impact without merging authority.
26. `9,999` references settled and one residual `UNKNOWN`; physical deletion remains not proven.
27. Backup/DR copy survives primary deletion; erasure evidence remains `PARTIAL` until scope is reconciled.
28. Cost optimizer proposes cross-Client dedup; policy forbids scope widening and saving is rejected.
29. Dedup cache/index is lost; semantic artifacts remain intact and optimization can rebuild.
30. Dedup index says match but byte-integrity verification contradicts it; no reference is attached to the suspect realization.

## Performance/resource-budget implications

Deduplication can reduce storage and transfer, but it adds hashing, indexing, lookup, reference accounting, scanning and potentially key-service work. Performance budgets therefore need separate dimensions:

- hashing CPU and memory;
- chunk-index cardinality/memory/storage;
- lookup latency before upload/finalize;
- proof-of-possession/security protocol cost if used;
- KMS/key-server latency and quotas;
- scan-verdict lookup/currentness cost;
- physical/logical reference fan-out;
- garbage-collection/residual reconciliation cost;
- rekey/rewrite amplification;
- migration expansion when dedup domains change.

Do not set numeric thresholds from literature alone. The current empirical budget domain remains unsaturated and requires fixtures/traces later under separate execution authority.

## Failure/recovery implications

Dedup index/cache loss is recoverable optimization-state loss, not semantic artifact loss, if canonical reference/content mappings survive. Conversely, loss of physical realization with many logical references increases blast radius and must be visible.

Recovery rules:

- rebuild indexes from qualified canonical/reference evidence where possible;
- do not attach references based solely on stale dedup cache hits;
- preserve `UNKNOWN` when physical residual/reference completeness is not proven;
- restore retention/key/malware evidence currentness independently;
- session/window restore does not restore content-disclosure authority;
- cross-device continuation never transfers secret key material or local handles by implication.

## Contradictions resolved

### "Content-addressed storage is naturally the canonical artifact model"

Rejected. Content addressing is an excellent physical/integrity identity technique but cannot represent business artifact identity, occurrence, ownership, retention, authority or workflow semantics by itself.

### "Global dedup maximizes efficiency, so it should be default"

Rejected. Global scope maximizes correlation/side-channel surface and can conflict with encryption/key/retention isolation. Scope is a security/governance decision.

### "Encrypting deduplicated data solves tenant privacy"

Rejected as a general statement. Deterministic/message-derived encryption has a specific threat model and predictable-content risks; ordinary per-tenant encryption can intentionally prevent cross-tenant dedup.

### "Deleting the last SB reference means the provider object can be deleted"

Rejected. Hidden residuals, legal holds, provider versions, backup/DR copies, quarantine and unknown accounting can survive.

### "Same bytes should mean one artifact in the UI"

Rejected. The UI may offer an authorized duplicate/reuse affordance, but semantic identity remains domain-owned.

## Closure status against required Web Desktop research outputs

No previously closed target is reopened. This round strengthens:

- Application Portfolio Matrix — delta material;
- external-app integration/security matrix — delta material for storage/KMS/scanner consoles;
- Control Center provenance/policy — delta material for dedup/encryption/retention scope;
- hosting/placement and provider portability — delta material for shared extents/key domains;
- monitoring/telemetry — delta material for digest/dedup disclosure;
- proprietary editor foundation — delta material for artifact bindings/retention/quarantine primitives;
- Workflow/View/Form/Component binding — delta material for typed artifact binding versus workflow state;
- performance/resource budgets — conceptual delta, still empirically unsaturated;
- failure/recovery — delta material for index loss/shared-extent blast radius;
- adversarial proof matrix — expanded;
- componentization complexity map — expanded.

Web Desktop ADR, Desktop taxonomy, Window Manager/multi-display and accessibility/small-screen equivalence remain stable; no material contradiction in this round requires reopening their core contracts.

## Saturation

- content/artifact identity separation: `HIGH_CONCEPTUAL`;
- dedup scope/privacy side-channel model: `MEDIUM_HIGH`;
- retention/hold reference accounting: `MEDIUM_HIGH`;
- encryption-domain interaction: `MEDIUM`, because cryptographic construction is deliberately unselected;
- malware-verdict reuse/currentness: `MEDIUM_HIGH`;
- cross-provider shared-extent portability: `MEDIUM`;
- erasure/legal-hold coexistence: `MEDIUM_HIGH_CONCEPTUAL`;
- performance/resource thresholds: `MEDIUM_LOW_EMPIRICAL`;
- accessibility/small-screen equivalence: unchanged `MEDIUM_HIGH_CONTRACTUAL`.

Research is not complete while material gaps remain.

## Remaining material gaps / next vector

Highest-value next vector:

**shared physical-content migration/rekey/retention reconciliation under changing dedup domains**.

Questions likely to change contracts or future decomposition:

- how to split one shared physical realization when one Client changes key, residency, retention or provider while others remain;
- whether rekey/rewrite creates a new physical generation while logical artifact identity remains stable;
- how to prove no reference was stranded during split/merge of dedup domains;
- how legal holds and erasure requests behave while copies coexist during migration;
- how malware/quarantine evidence follows content versus physical generation;
- how old provider/shared extents are retired without using `copy ACK` as deletion proof;
- how cost attribution changes when a shared extent is deliberately de-deduplicated for isolation;
- how to avoid a global stop-the-world barrier when only one Client/reference needs migration.

This remains `RESEARCH_ACTIVE / NON_EXECUTABLE`.

## Sources reviewed

- Danny Harnik, Benny Pinkas, Alexandra Shulman-Peleg, *Side Channels in Cloud Services: Deduplication in Cloud Storage*, IEEE Security & Privacy, 2010.
- Mihir Bellare, Sriram Keelveedhi, Thomas Ristenpart, *Message-Locked Encryption and Secure Deduplication*, EUROCRYPT 2013.
- Mihir Bellare, Sriram Keelveedhi, Thomas Ristenpart, *DupLESS: Server-Aided Encryption for Deduplicated Storage*, USENIX Security 2013.
- Amazon S3 documentation, Object Lock / retention / legal holds / versioning interaction.
- Google Cloud Storage documentation, customer-managed encryption keys and key rotation/rewrite behavior.

All external systems are benchmark/pattern evidence only. No provider or cryptographic scheme is selected.