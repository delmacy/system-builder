# G4 Web Desktop — Historical Verification Material Retirement & Evidence Survivability Research

Status: `RESEARCH_ACTIVE / NON_EXECUTABLE`
Date: 2026-09-23
Scope: Generation 4 documentary P&D only. No product implementation, WBS, Work Package, Sprint, TASK, migration, provider adoption or architecture replacement is authorized.

## 1. Research question

How should the G4 Web Desktop / Application Environment retire old trust roots, certificates, transparency-log keys and cryptographic algorithms from active trust stores while retained evidence remains auditable for years, without preserving retired issuers as executable authority and without assuming that cryptographic verification remains stable forever?

This round follows `G4_WEB_DESKTOP_TRUST_ROOT_ROTATION_RECOVERY_AUTHORITY_CONTINUITY_RESEARCH.md`. It consumes the current :00 recommendation-provenance work, :10 succession-temporal-join work, :20 late-predecessor-evidence reconciliation, and retains the latest available :40 operational-UX saturation result where no newer :40 branch commit was visible at research time.

Primary hierarchy remains:

`Builder Home/Factory -> Client -> Workspace -> Desktop Sphere -> Application -> Window -> View/Tab/Tool`.

3D remains an optional projection/application, never the navigation foundation.

## 2. Repository invariants preserved

- `Builder != Runtime`; historical verification cannot require permanent Factory availability.
- `Client != Workspace != Desktop != Application != Window`.
- `Module != Capability != Application`.
- `Window/session != runtime`.
- `Install != Adopt`; `Register != Deploy`; `Discovered != Verified`.
- `SecretRef != secret value`.
- `Policy != configuration`.
- `Desired != Observed != Effective`.
- `Automatic != hidden`.
- `Observatory != Monitoring Surface != Operations Desktop`.
- `Display Surface != Workspace`.
- `View != Workflow Activity`; `Form != Workflow State`; `Button != Domain Command`.
- `Adapter normalization != fabricated semantic equivalence`.
- `Historical signature validity != current issuer authority`.
- `Issuer accepted for verification != issuer authorized for new effects`.
- `Old root compromised != every historical statement forged`.

Additional boundaries from this round:

- `Active trust store != historical verification archive`.
- `Issuer retired from new effects != historical evidence unverifiable`.
- `Certificate expired now != signature invalid when produced`.
- `Algorithm disallowed for new protection != automatically unusable for legacy verification`.
- `Historical verification possible today != survivable verification tomorrow`.
- `Archived public verification material != archived private signing authority`.
- `Evidence envelope complete != evidence claim currently admissible`.
- `Timestamp present != trustworthy existence-before-compromise proof`.
- `Renewal performed != original evidence rewritten`.
- `Provider exit != permission to lose provider-independent evidence`.

## 3. Inputs reconciled / deduplication

### :00 — recommendation provenance

Recommendations remain projections over evidence. A recommendation to renew evidence, rotate an algorithm or retain validation material is not the renewal/retention occurrence and carries no effect authority by itself.

### :10 — succession temporal join

Successor authority and predecessor history remain separate. Historical proof material may need to survive organizational succession even after all new effect authority moved to a successor.

### :20 — late predecessor evidence

Late-arriving predecessor evidence cannot be silently ignored merely because a successor epoch is current. This round adds that the verifier also needs enough historical validation material and crypto-policy context to evaluate such evidence without reactivating predecessor authority.

### :40 — operational UX

No new broad monitoring taxonomy is introduced. Existing Observatory/Pinned/Operations separation is sufficient; this round contributes new evidence states and renewal obligations to project.

## 4. External evidence and contradictory lessons

### 4.1 RFC 4998 / RFC 6283 — long-term evidence must itself be renewed

Evidence Record Syntax exists because signatures, hashes, certificates and timestamps do not retain equivalent security indefinitely. RFC 4998 explicitly treats long-lived signed data as vulnerable to later algorithm weakness or certificate invalidity and uses renewed timestamps to prove that evidence existed before a critical event. RFC 6283 further requires monitoring and renewal before timestamp/certificate/hash mechanisms become unreliable and distinguishes timestamp renewal from hash-tree renewal.

Portable G4 lesson:

`historical verification survivability = preserved validation context + evidence continuity + timely crypto renewal`, not merely `keep old public key forever`.

A critical contradiction is preserved: retrospective discovery that an algorithm was already weak can invalidate assumptions in a historical evidence chain with no perfect retroactive repair. Therefore the SB must represent `UNKNOWN` / `EVIDENCE_GAP` rather than fabricate continuity.

### 4.2 NIST transition guidance — generation and legacy verification have different policy states

NIST SP 800-131A Rev. 2 remains the current final transition publication while Rev. 3 is still an initial public draft as of this research date. NIST transition practice demonstrates that an algorithm can become disallowed for applying new protection while legacy removal/verification of already-protected data remains permitted in bounded cases. NIST's TDEA transition is a concrete example: new protection was disallowed while legacy decryption/key-unwrapping/MAC verification remained available.

Portable G4 lesson:

`algorithm status` must be operation-class aware. A single `allowed=false` flag is insufficient.

Candidate dispositions:

```text
GENERATE_ALLOWED
VERIFY_CURRENT_ALLOWED
VERIFY_HISTORICAL_ALLOWED
LEGACY_VERIFY_ONLY
RENEWAL_REQUIRED
QUARANTINED
DISALLOWED
UNKNOWN
```

This is policy evidence, not a universal hard-coded NIST policy.

### 4.3 TUF / Sigstore — active root distribution is not an archival verification system

TUF metadata has expiration and rollback protections so clients can reject stale active metadata. Sigstore uses TUF to distribute trust material and has experienced client compatibility constraints during root metadata evolution. This is excellent for current trust distribution but exposes a key boundary: an archive cannot assume that the active online TUF repository years later will preserve every historical key, certificate, log key, policy interpretation and client parser needed for old evidence.

Portable G4 lesson:

`current trust distribution != durable historical validation package`.

Historical evidence should carry or reference a preservation envelope sufficient to reconstruct the historical verification context under a current policy, without importing the old issuer into the active authority set.

## 5. Primary finding — separate active authority from preservation material

Candidate identities:

```text
HistoricalEvidenceRef
EvidencePreservationEnvelopeRef
HistoricalVerificationContextRef
CryptoPolicyEpochRef
AlgorithmDispositionRef
VerificationMaterialRef
EvidenceRenewalOccurrenceRef
HistoricalAdmissibilityClaimRef
```

Candidate `EvidencePreservationEnvelope` fields:

```text
evidenceRef
contentDigestSet[]
signatureArtifacts[]
certificateChainArtifacts[]
revocationEvidence[]
transparencyInclusionEvidence[]
timestampEvidence[]
trustEpochRefs[]
issuerRoleAtEvidenceTime
algorithmIdentifiers[]
cryptoPolicyEpochRefs[]
canonicalizationProfileRef?
providerEvidenceRefs[]
renewalChainRefs[]
coverageVector
unknowns[]
```

The envelope contains verification material, not executable private authority. Private signing keys, recovery secrets and live provider credentials do not belong in it merely because they once participated in producing evidence.

## 6. Historical verification state model

Candidate lifecycle:

```text
EVIDENCE_CAPTURED
-> PRESERVATION_CONTEXT_COLLECTING
-> PRESERVATION_CONTEXT_QUALIFYING
-> HISTORICAL_VERIFIABLE
-> CRYPTO_POLICY_MONITORING
-> RENEWAL_DUE
-> RENEWAL_QUALIFYING
-> RENEWAL_PERFORMED
-> RENEWAL_VERIFIED
-> HISTORICAL_VERIFIABLE_RENEWED
```

Degraded branches:

```text
MISSING_VALIDATION_CONTEXT
ALGORITHM_WEAKENED_BEFORE_RENEWAL
REVOCATION_STATUS_UNRESOLVED
COMPROMISE_BOUND_UNKNOWN
TIMESTAMP_CHAIN_BROKEN
CANONICALIZATION_UNAVAILABLE
PARSER_COMPATIBILITY_GAP
PROVIDER_EVIDENCE_UNAVAILABLE
QUARANTINED_HISTORICAL
EVIDENCE_GAP
UNKNOWN
```

`RENEWAL_PERFORMED != RENEWAL_VERIFIED`.

## 7. Crypto-agility without historical rewriting

Crypto migration for evidence must preserve the original artifact and original signatures. A stronger timestamp/hash renewal attests to continuity of the existing evidence package; it does not rewrite the old signature as if it had originally used the new algorithm.

Candidate rule:

```text
OriginalEvidence immutable
+ RenewalOccurrence(new algorithm, new timestamp/evidence)
+ lineage to predecessor evidence
= extended survivability
```

Do not mutate old algorithm identifiers, signature bytes, issuer identity, original policy epoch or claimed production time.

Algorithm deprecation must trigger targeted proof obligations:

- Is the weak algorithm used only for historical verification or for new effects?
- Was a stronger renewal anchored before the critical weakness/compromise bound?
- Does the current verifier still implement the legacy parser/algorithm safely enough for historical verification?
- Can verification occur in an isolated compatibility environment rather than re-enabling the legacy algorithm globally?

## 8. Historical-verification material retirement

Retirement has two independent operations:

1. remove material from active issuance/effect trust;
2. preserve bounded public verification context for historical evidence.

Candidate issuer dispositions:

```text
ACTIVE_ISSUER
ACTIVE_VERIFIER
VERIFY_HISTORICAL_ONLY
ARCHIVED_VERIFICATION_ONLY
QUARANTINED_HISTORICAL
RETIRED_NO_REQUIRED_EVIDENCE
DESTROYED_PRIVATE_AUTHORITY
UNKNOWN
```

A root/certificate/log key can leave active trust stores and remain in an immutable preservation envelope. Historical material must be namespace/scope-bound so importing an archive cannot silently expand current trust.

## 9. Certificate expiry, revocation and compromise

Current certificate expiry is not sufficient to reject an old signature that can be proven to have existed during an admissible interval. Conversely, a valid cryptographic signature plus an untrusted file timestamp is not enough to prove pre-revocation/pre-compromise production.

Historical evaluation may require:

- trusted timestamp or equivalent existence evidence;
- certificate chain as it was relevant to the historical policy;
- revocation evidence available at/before renewal;
- compromise-bound evidence;
- transparency-log inclusion/checkpoint material where relevant;
- policy epoch that defines how those facts are interpreted.

`historical cryptographic validity != current business admissibility`; current legal/security policy may still quarantine or reject the effect while preserving the evidence.

## 10. Transparency-log and provider exit survivability

A provider-hosted log or PKI endpoint may disappear. Therefore provider-native identifiers alone are insufficient for long retention.

Preservation may require bounded copies/proofs such as:

- signed log checkpoints/tree heads;
- inclusion/consistency proof material where applicable;
- log public keys and key-rotation lineage;
- certificate chain and revocation artifacts;
- provider semantic/version identifiers;
- canonical bytes/digests necessary to reproduce verification.

This does not require mirroring the provider's entire database. Preserve the minimum qualified proof envelope needed by the retained claim class.

## 11. Web Desktop synthesis

### Desktop Sphere taxonomy

No taxonomy change. Historical evidence belongs in Security/Audit/Operations guided spheres and applications. It does not justify a new desktop class.

### Window Manager / multi-display

`WindowSession` projects a historical-verification session; it does not own evidence lifetime or trust. Secondary displays can show evidence status but destructive/renewal operations requalify context/current policy at action time.

### Observatory vs Monitoring Surface vs Operations Desktop

- Observatory: portfolio-level projection of evidence health, algorithm exposure, renewal backlog and unknown coverage.
- Pinned Monitoring Surface: concise signals such as `renewal due`, `historical evidence quarantined`, `provider proof at risk`.
- Operations Desktop: qualified renewal/export/provider-exit actions.

### Application Manager

Installing/adopting a verification provider does not establish historical admissibility. Discovery of an old certificate/log key is only a claim until provenance and historical applicability are qualified.

### Control Center

Owns declarative policy intent for retention class, evidence preservation profile, renewal horizon, algorithm-policy source, provider bindings and inheritance/provenance. Effective historical verifiability remains observed evidence.

### Declarative service deployment / auto-binding / Vault

A service definition may declare evidence-retention/verification capabilities. Provider YAML remains a realization. Auto-binding may choose a timestamp/verification/archive service only with visible capability/currentness/provenance. Secret values remain outside evidence envelopes.

### Hosting / placement

Evidence preservation benefits from failure-domain diversity, but `different storage provider != independent cryptographic evidence`. Independent evidence requires qualified assumptions about keys, timestamp authorities, algorithms and administrative domains.

### External mature tool reuse

Do not rebuild mature PKI/TSA/transparency/KMS consoles. Use provider APIs and deep links for specialist administration; keep semantic evidence identity, lineage, policy epoch and admissibility native to SB.

### Proprietary editor family / semantic bridge

Workflow/View/Form/Component editors consume common evidence/currentness/admissibility primitives. They do not invent crypto-policy semantics. `Button != Domain Command` remains binding.

## 12. Application Portfolio Matrix delta

No universal integration mode.

| Capability | Candidate modes | Critical qualification |
|---|---|---|
| Evidence inventory / lineage | Native SB | semantic identity, retention, scope and lineage are SB concerns |
| Signature/certificate verification | Native SB + API-backed/Hybrid | local deterministic common path; external specialist validation where needed |
| TSA / archive timestamp renewal | API-backed + Hybrid + Deep-link | mature external service; SB owns renewal intent/evidence lineage |
| Transparency-log verification | API-backed + Native verification + Deep-link | preserve proofs/checkpoints; do not depend only on live provider UI |
| PKI/CA administration | API-backed + Hybrid + Deep-link | provider-native safety and licensing; avoid console rebuild |
| HSM/KMS historical-key administration | Hybrid + Deep-link; Native bridge for local hardware | historical public material distinct from private key authority |
| Offline archive inspection | Native SB + Hybrid/Native bridge | isolate legacy parsers/algorithms; archive import remains untrusted until qualified |
| Evidence export/provider exit | Native SB + API-backed/Hybrid | export proof envelope, provenance and provider semantics, not only raw artifact |

Refined criteria:

- security and trust-scope binding;
- historical/current authority separation;
- algorithm-policy fidelity;
- certificate/revocation/timestamp fidelity;
- transparency-proof portability;
- currentness and renewal support;
- parser/format compatibility;
- licensing and embed constraints;
- provider-exit survivability;
- lifecycle/retention fidelity;
- replaceability and lock-in;
- ability to preserve `UNKNOWN`, `QUARANTINED`, `EVIDENCE_GAP`.

## 13. Componentization complexity map

### C0/C1 — semantic atoms and evidence references

High reuse, foundational:

- `HistoricalEvidenceRef`
- `VerificationMaterialRef`
- `CryptoPolicyEpochRef`
- `AlgorithmDispositionRef`
- `EvidenceRenewalOccurrenceRef`
- `HistoricalAdmissibilityClaimRef`
- provenance/currentness/coverage/unknown primitives

### C2 — reusable compounds

Medium-high complexity:

- evidence-health badge/card;
- algorithm exposure summary;
- renewal-due indicator;
- preservation-envelope inspector;
- certificate/revocation/timestamp timeline;
- provider-exit readiness card;
- quarantine/evidence-gap disclosure.

### C3 — shared foundations

High complexity, high leverage:

- `EvidencePreservationEnvelopeBoundary`
- `HistoricalVerificationContextBoundary`
- `HistoricalAdmissibilityBoundary`
- `CryptoPolicyDispositionBoundary`
- `EvidenceRenewalBoundary`
- `LegacyVerificationIsolationBoundary`
- `TransparencyEvidencePreservationBoundary`
- `ProviderExitEvidenceBoundary`
- `HistoricalTrustMaterialBoundary`
- `EvidenceSurvivabilityMonitorBoundary`
- `HistoricalEvidenceExportBoundary`

### Application/domain-owned

Must remain specific:

- legal evidentiary weight;
- domain retention schedules;
- business acceptance/rejection of historical claims;
- workflow compensation;
- publication/deployment authority;
- regulated archive requirements;
- provider-specific forensic procedures.

## 14. Performance/resource implications

Historical evidence can become large due to certificates, CRLs/OCSP responses, timestamps, log proofs and renewal chains. Do not load complete envelopes into every Desktop session.

Budget dimensions for later empirical calibration:

- envelope metadata index cardinality;
- proof blob storage;
- renewal scan rate;
- verification CPU and legacy-parser isolation cost;
- network cost for provider validation/renewal;
- cache age/currentness;
- batch timestamp/hash-tree amortization;
- offline archive import cost.

No numeric thresholds are selected without measurement.

## 15. Accessibility and small-screen equivalence

Historical evidence state must not depend on color, hover, graph position or multi-window layout. Small screens require equivalent textual disclosure of:

- historical/current distinction;
- algorithm disposition;
- renewal due/overdue;
- evidence gaps/unknowns;
- quarantine state;
- action consequence and authority.

Evidence graphs require list/table/tree alternatives with keyboard navigation and deterministic focus restoration.

## 16. Failure/recovery/session restore

Restoring a Window restores navigation context, not historical-verification truth. On resume:

- re-read current crypto policy;
- requalify renewal/currentness;
- preserve immutable evidence identity;
- invalidate stale action affordances;
- keep historical verification distinct from effect authority.

An offline runtime may inspect locally preserved evidence but must disclose missing current policy/currentness when an effect depends on it.

## 17. Adversarial proof matrix

At minimum prove behavior for:

1. issuer retired for new effects but old evidence remains auditable;
2. certificate expired after a trusted timestamped signature;
3. certificate revoked for key compromise with unknown compromise time;
4. certificate revoked for cessation only;
5. SHA/signature algorithm later deprecated;
6. algorithm disallowed for generation but allowed for bounded legacy verification;
7. algorithm weakness discovered after the supposed renewal window;
8. renewal timestamp obtained after predecessor evidence became untrustworthy;
9. original artifact mutated while renewal chain survives;
10. archived public root imported into active trust accidentally;
11. private signing key mistakenly included in preservation package;
12. transparency-log provider exits;
13. transparency-log key rotates and live endpoint no longer serves old key;
14. inclusion proof exists but checkpoint authenticity is missing;
15. OCSP/CRL endpoint disappears;
16. historical revocation artifact exists but provenance is unknown;
17. old parser/canonicalization implementation no longer runs safely;
18. legacy parser is exploitable and must be sandboxed;
19. evidence package references provider-specific object no longer resolvable;
20. provider export omits policy/version semantics;
21. two redundant evidence records use the same vulnerable algorithm family;
22. one redundant evidence chain survives and one fails;
23. offline archive misses latest crypto-policy transition;
24. current policy permits inspection but forbids new effect;
25. secondary display shows `VERIFIED` from stale cache;
26. restored Window revives a renewal action based on obsolete policy;
27. 9,999 envelopes healthy + 1 critical `EVIDENCE_GAP`;
28. renewal job ACKed but new evidence blob not durably stored;
29. new timestamp stored but lineage to original evidence broken;
30. provider migration changes canonical representation;
31. organizational successor has current authority but lacks predecessor validation material;
32. old trust material remains necessary for audit but must never authorize restore/deploy.

Minority-critical states remain first-class: `Aggregation != silent omission`.

## 18. Saturation / maturity

- Web Desktop hierarchy/taxonomy: **high conceptual saturation**.
- Window Manager/multi-display authority separation: **high conceptual saturation**.
- Observatory/Pinned/Operations distinction: **high conceptual saturation**.
- Application Portfolio: **medium-high**.
- Application Manager / Control Center semantic boundaries: **medium-high**.
- historical/current trust separation: **high conceptual maturity**.
- evidence preservation envelope: **medium-high conceptual maturity**.
- algorithm-transition/renewal semantics: **medium-high**, empirical/provider qualification remains.
- transparency/provider-exit survivability: **medium**.
- legacy-parser isolation: **medium**.
- performance/resource budgets: **medium-low empirically**.
- accessibility/small-screen equivalence: **medium-high contractually**.

Research remains active because material gaps remain.

## 19. Remaining gaps / next vector

The next material vector is **crypto-agility renewal scheduling and evidence-preservation economics at scale**:

- millions of retained evidence objects with different retention horizons;
- when to batch/hash-tree timestamp versus renew individually;
- how policy/algorithm transitions trigger bounded renewal cohorts without stop-the-world behavior;
- how to prove a renewal cohort is complete when archives/providers are partially offline;
- how to prioritize minority-critical evidence over bulk low-risk evidence;
- provider/TSA failure or price shock near a deprecation deadline;
- algorithm diversity versus correlated cryptographic failure;
- storage/CPU/network budgets and measurable thresholds;
- preserving replaceability so a renewal service does not become a new lock-in boundary.

Status remains `RESEARCH_ACTIVE / NON_EXECUTABLE`.