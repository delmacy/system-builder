# Generation 2 Deep Research — Recovery Root Rotation & Historical Verification Continuity 01

Status: COMPLETE — RESEARCH RECOMMENDATION / NOT TARGET-ARCHITECTURE AUTHORITY

## Question

After trust-root, signing-key, certificate, verifier, Station authority or provider-trust rotation — including emergency re-root after suspected compromise — what minimum historical verification closure must remain available so Generation 2 can continue proving that old approvals, signatures, provenance, Gate evidence and provider receipts were valid under their historical authority context, while guaranteeing that retired or compromised roots cannot authorize any new privileged actuation?

The question is deliberately narrower than general historical interpretation. `DR-HIC-01` already established that historical evidence requires a transitive representation/validation closure. `DR-RARSOD-01` established that re-root/recovery changes effective authority ancestry and requires a new authority epoch. The unresolved point is whether retaining old verification material accidentally keeps old authority alive, and what exact evidence distinguishes:

```text
historically valid under root R7 at T1
```

from:

```text
currently authorized by root R7 at T2
```

This question affects long-lived workflow/Gate evidence, Station offline reconciliation, provider substitution, release/provenance verification, identity/authorization lifecycle, auditability and autonomous runtime closure.

## Why this is architecturally material

A naive implementation can fail in opposite directions.

### Failure direction A — delete old trust material on rotation

```text
R7 retired / compromised
  → delete old public key / cert / policy / revocation evidence
  → historical approval A41 can no longer be verified
```

The system successfully prevents future use of R7 but destroys the auditability of the past. Old Gate evidence, signed provenance, provider receipts or approval chains become opaque.

### Failure direction B — keep old root as generally trusted

```text
R7 retained so old evidence can verify
  → verifier still treats R7 as active trust anchor
  → attacker uses compromised R7 to sign a new approval at T2
```

Historical continuity is preserved at the cost of silently resurrecting the old authority.

The architecture therefore needs a principled separation between **historical verification eligibility** and **current actuation authority**. This separation can change:

- the Universal Capability Architecture's qualified-evidence model;
- trust-root and identity lifecycle semantics;
- historical interpretation closure;
- root rotation/recovery and break-glass rules;
- long-lived workflow Gate qualification;
- offline Station reconciliation and stale-root fencing;
- provider substitution conformance;
- provenance/SBOM/release verification;
- retention policy for certificates, public keys, CRLs/OCSP material, trust metadata and timestamps.

## Corpus of SB input

Mandatory Generation 2 corpus reviewed before external research:

- `RESEARCH_PIPELINE_STATE.json` — `phase=RESEARCH_ELICITATION`; six full cycles complete; cycle 7 is active. This Deep Research does not advance breadth cycles/revisits or declare saturation.
- `RESEARCH_EVIDENCE_METHOD.md` — requires cross-source triangulation, preserves contradictions and forbids promotion from a single elegant representative.
- `ARCHITECTURE_PROOF_QUALITY_METHOD.md` — requires version/coexistence, authority, provider substitution, offline closure, evidence, replay and recovery falsification paths.
- `CAPABILITY_DISCOVERY_REGISTER.md`, `FINDING_INDEX.md`, `REPRESENTATIVE_COVERAGE.md`, `CAPABILITY_PROOF_MATRIX.md` — research inventories/hypotheses, not automatic conclusions.
- `DR-HIC-01` — historical interpretation is a transitive preservation/validation closure, not byte retention; historical validity is distinct from current actuation.
- `DR-LGCE-01` — long-lived evidence is revision-qualified; current authority/trust may need requalification even when historical interpretation remains pinned.
- `DR-QDCE-01` — a derived claim can be historically valid while no longer currently applicable.
- `DR-ABRT-01` — authority-bearing claim consumption must terminate in externally admitted, scoped, current, non-amplifying roots.
- `DR-TICCAF-01` — multi-party/root strength depends on actual independence/common-cause evidence.
- `DR-RARSOD-01` — compromised-root recovery is not normal rotation; re-root creates a new authority epoch and successful recovery does not imply steady-state re-entry.
- Artifact / Release / SBOM / Provenance, Authorization, Identity, Governance/Audit and Station dossiers/revisits — all already depend on exact revision/trust/evidence lineage and autonomous verification.

The breadth corpus is treated as input hypotheses. The external evidence below attempts to falsify or narrow them.

## External evidence ledger

### E1 — RFC 5280: trust anchor is an input, and validation is time-relative

Source:
- https://www.rfc-editor.org/rfc/rfc5280

RFC 5280 defines certification-path validation relative to a selected trust anchor. The trust anchor is an input to the algorithm rather than a certificate that magically self-establishes trust. The standard validates by default against current time, but allows implementations to validate with respect to a point in the past, provided the certificates in the path were valid at the time in question. Revocation is a separate validation concern.

**Extraction:** the same public key/certificate can participate in a historical validation context without being admitted as a current trust anchor. Trust-anchor selection and validation time are policy inputs. Therefore `stored old certificate` and `currently trusted root` are not equivalent states.

**Limit:** RFC 5280 does not itself define enterprise business authorization or a long-term archival evidence lifecycle. Historical validation also requires revocation/time evidence that may no longer be online.

### E2 — RFC 3161: a timestamp can preserve evidence that a signature existed before revocation/expiry

Source:
- https://datatracker.ietf.org/doc/html/rfc3161

RFC 3161 describes a long-term signature-validation technique in which the signature is timestamped soon after creation. A later verifier checks that the timestamp applies to the signer signature, that the timestamp time falls within the signer certificate validity interval, and that any revocation occurred after the timestamp time. The RFC additionally notes that TSA keys themselves have finite lifetimes and timestamp tokens may need later re-timestamping/notarization.

**Extraction:** historical verification needs an authenticated **time relation** between the signed object and the authority's validity/revocation state. Merely retaining a public key cannot tell whether a signature was created before or after compromise/revocation.

**Limit:** timestamping does not prove business authorization; it proves a cryptographic temporal fact under a TSA/trust policy.

### E3 — RFC 9921 (2026): timestamp scope matters; payload time is not signature time

Source:
- https://www.rfc-editor.org/rfc/rfc9921.html

RFC 9921 defines two COSE/RFC-3161 composition modes. In `COSE, Then Timestamp`, the timestamp covers the signature field and therefore can provide evidence about when that signature existed. In `Timestamp, Then COSE`, the timestamp covers the payload before the COSE signature is created; it cannot be used as evidence that the later signature itself existed at the timestamp time.

**Extraction:** a historical-verification closure must preserve **what exact bytes/fact the trusted time evidence covered**. A generic `timestamp=T1` field is unsafe. Otherwise a post-revocation signature can be laundered through an earlier timestamp on unrelated/pre-signature material.

**Architectural consequence:** typed evidence binding/scope is mandatory wherever time is used to qualify old authority.

### E4 — RFC 4998 Evidence Record Syntax: long-term proof needs renewal before cryptographic mechanisms become unreliable

Source:
- https://www.rfc-editor.org/info/rfc4998/

ERS recognizes that signatures/certificates/algorithms may become invalid or weak during long retention periods. It preserves archive timestamps and permits renewal before a timestamping key, certificate, asymmetric algorithm or hash ceases to be acceptable. The record may include trust anchors, certificates, revocation information and historical algorithm-suitability information useful for validation.

**Extraction:** historical verification continuity is a lifecycle, not a one-time storage operation. A valid proof today may require renewal/anchoring before cryptographic degradation tomorrow. This aligns with `DR-HIC-01`'s preservation-versus-validation distinction.

**Limit:** ERS preserves existence/integrity evidence, not SB domain semantics or current authority.

### E5 — TUF root rotation: preserve a verifiable chain of root versions while old private keys are retired

Sources:
- https://theupdateframework.github.io/specification/
- https://theupdateframework.github.io/specification/v1.0.26/

TUF clients begin with an admitted trusted root. Root version `N+1` must satisfy the threshold of both the trusted root `N` and the new root `N+1`; clients can incrementally retrieve and verify intermediate root metadata versions. Old private root keys can be revoked/removed while the historical root metadata versions remain necessary for an out-of-date client to retrace the trust transition.

**Extraction:** continuity material and signing capability are separable. A system can preserve old **public verification metadata and transition evidence** while destroying/retiring the corresponding private signing authority. Root history supports proof of authorized transition; it need not mean old roots remain eligible for future updates.

**Adversarial boundary:** this normal continuity model assumes the predecessor root is still trustworthy enough to authorize the transition. `DR-RARSOD-01` correctly distinguishes compromised-threshold recovery, which requires an out-of-band newly admitted root rather than self-validation by the compromised chain.

### E6 — Sigstore: trusted-root material is itself lifecycle metadata; verification components have activation intervals

Sources:
- https://docs.sigstore.dev/about/security/
- https://docs.sigstore.dev/cosign/system_config/custom_components/
- https://docs.sigstore.dev/logging/sharding/

Sigstore distributes verification material through a TUF trust root. Its trusted-root construction can associate services/keys with `start-time` and `end-time`; Rekor sharding exists in part to freeze an old log and rotate signing keys while maintaining user verification across shards. Fulcio/Rekor/CT verification material is treated as trust metadata, not as a single forever key.

**Extraction:** production provenance verification already needs multiple historical verifier keys/certificates with applicability intervals. Provider rotation should therefore map into a portable `verification material + applicability interval + evidence identity` concept rather than assuming one current key verifies all history.

**Limit:** Sigstore's exact TUF/trusted-root JSON is provider-specific and should not become canonical SB IR.

### E7 — ETSI/DSS long-term signature validation: validation material must survive source disappearance

Sources:
- https://ec.europa.eu/digital-building-blocks/DSS/webapp-demo/doc/dss-documentation.html
- ETSI EN 319 102 / TS 119 102 family referenced by DSS

AdES Baseline-LT retains or references long-term validation material such as certificate paths and revocation information, while Baseline-LTA adds archival timestamps to preserve availability/integrity of the validation data itself through cryptographic aging.

**Extraction:** retaining only the signer's certificate is insufficient. Historical verification may require the validation chain, revocation evidence, trusted-time evidence and policy/profile under which those facts were evaluated.

**Limit:** qualified electronic-signature regulation has domain-specific assurance requirements; SB should extract the closure principle, not universalize AdES levels.

## Competing models

### Model A — Delete all old trust material when a root is revoked

```text
revoke R7
  → destroy private key
  → delete public key/cert/root metadata
```

**Strongest argument for:** minimizes accidental future trust and retention footprint.

**Failure:** destroys the ability to validate historical signatures/evidence unless every relevant result was previously converted into another independently trustworthy proof.

**Disposition:** **DO_NOT_BUILD** as the universal lifecycle.

### Model B — Retain old root as generally trusted forever

```text
R7 retained in global trust store
  → historical signatures verify
  → new signatures under R7 also verify
```

**Strongest argument for:** simple verification code; no historical/current distinction.

**Failure:** a retired/compromised root can mint new evidence indefinitely. It collapses re-root/revocation semantics.

**Disposition:** **DO_NOT_BUILD**.

### Model C — Store old public material, but trust only by historical applicability interval/purpose

Conceptual shape:

```text
HistoricalClaim C1
  + exact subject/signature bytes
  + historical verifier/root identity R7
  + validity/applicability interval
  + revocation/compromise evidence
  + trusted-time binding
  + verification-policy revision
  + transition/re-root lineage
        ↓
HistoricalVerificationClaim

Current actuation at T2
  + current authority epoch R9
  + current policy/trust closure
        ↓
CurrentAuthorizationDecision
```

Old public verification material remains addressable; old private signing capability is destroyed/disabled; verifiers cannot admit R7 for a new actuation merely because R7 is retained for historical validation.

**Disposition:** **KEEP / GENERALIZE**.

### Model D — Convert every historical signature to a single new-root countersignature, then discard old validation closure

**Strongest argument for:** simplifies future verification to one current root.

**Failure:** a new-root statement such as `old signature was valid` is itself a derived claim whose correctness depends on the original validation inputs. Destroying all original closure removes independent falsifiability/auditability and makes the new root rewrite historical truth. It also creates a single future compromise point for all history.

**Disposition:** **SPECIALIZE only as augmentation; DO_NOT_BUILD as destructive replacement**.

## Strongest synthesis

The external evidence supports a strict separation:

> **Retirement/revocation disables future authority but does not require deleting historical public verification material. Historical verification must be qualified by the authority epoch, applicability interval, exact evidence scope, trusted-time/revocation context and verification-policy revision that applied to the old act.**

The old root can remain part of the **historical interpretation/verification closure** without remaining part of the **current actuation trust closure**.

Conceptually:

```text
                 ┌────────────────────────────┐
                 │ Historical verification   │
                 │ closure                    │
                 │                            │
old public R7 ──▶│ verify C1 @ T1             │
old cert/path ──▶│ revocation state @ T1      │
time proof ─────▶│ exact covered bytes        │
policy V3 ──────▶│ historical applicability   │
                 └────────────────────────────┘
                              │
                              ▼
                     historical claim
                     VALID / INVALID /
                     INCONCLUSIVE

                 X no authority edge

                 ┌────────────────────────────┐
current R9 ─────▶│ Current actuation closure  │
current policy ─▶│ authorization @ T2         │
current grants ─▶│ fencing / authority epoch  │
                 └────────────────────────────┘
```

## Invariants

### I1 — Historical-verification eligibility is not current trust admission

A retained old public key/certificate/root metadata entry MUST NOT by itself make that root eligible to authorize a new actuation.

### I2 — Destroy private authority, preserve public verification closure where retention policy requires history

After retirement/re-root, old private signing/issuance material should be destroyed, disabled, fenced or otherwise rendered unusable according to the provider/security profile. Required public verification material and transition evidence can remain immutable/read-only.

### I3 — Verification is epoch- and purpose-qualified

A verifier must know which authority/trust epoch and purpose applied. `root R7 signed bytes` is insufficient without knowing whether R7 was admitted for that predicate/action at the claimed time.

### I4 — Trusted time must bind the relevant fact

A timestamp on payload bytes is not automatically a timestamp on the signature/approval. The evidence closure must preserve the exact covered object/scope.

### I5 — Revocation is not retroactive invalidation by default

A key/certificate revoked at `T2` may still support a historical claim proven to have existed at `T1 < T2`, subject to the applicable policy and compromise semantics. Conversely, if the compromise time is unknown or predates the alleged act, the correct result may be `INCONCLUSIVE`, not historical validity.

### I6 — Compromise time uncertainty remains explicit

`revoked at T2` does not necessarily prove `safe until T2`. Revocation publication time, known compromise time and policy-effective invalidation time can differ. Historical claims must not invent certainty.

### I7 — Normal rotation and compromised-root recovery have different continuity proofs

Normal rotation can preserve an old→new authorized transition chain. If the old root threshold is itself no longer trustworthy, the new root must be externally admitted; the compromised root cannot validate its own successor.

### I8 — Re-root creates a future-authority fence

New privileged actuation must name/satisfy the current authority epoch. Old-root evidence received after cutover must not silently enter current Gate/admission decisions without explicit historical-only interpretation and, where relevant, requalification.

### I9 — Long-lived workflow history can remain valid while future stages requalify

An approval signed under R7 at T1 can remain historically valid evidence for what occurred at T1. Whether it still satisfies a Gate at T2 is a separate capability-owned freshness/applicability decision under current policy/root R9.

### I10 — Offline Stations cannot extend an old root's future authority past their granted horizon

A Station disconnected before re-root may continue only within explicitly pre-authorized local closure. On reconnect, evidence created under an obsolete root/epoch is classified by its authorized offline interval and fencing rules; it is not automatically current because the Station had not yet learned the new root.

### I11 — Provider substitution preserves verification semantics, not provider IDs

A new CA/TSA/KMS/log/provider may replace an old one only if required historical material remains interpretable or has been safely migrated/anchored. A provider migration that makes old receipts unverifiable is a semantic loss, not mere operational churn.

### I12 — Historical validation outputs are derived claims, not replacements for source evidence

A persisted `VALID_AT_T1` assessment may accelerate audit but remains bound to its input closure/profile. It must not erase the original signature, trust transition, revocation/time evidence or their retention obligations when independent replay is required.

## Failure / adversarial analysis

### F1 — Compromised root signs after revocation using an old timestamped payload

Attacker obtains payload timestamp at T1, signs with compromised R7 after revocation at T2, and presents both as historical evidence.

**Required defense:** evidence binding must distinguish payload timestamp from signature timestamp; RFC 9921 demonstrates why scope matters. Result must be rejected/inconclusive unless there is trusted evidence the signature itself existed before the invalidation point.

### F2 — Old root stays in generic trust store

A verifier chooses any stored root and accepts a new R7-signed approval after R9 cutover.

**Required defense:** trust lookup is purpose/time/epoch-qualified; `historical verifier material` is not included in current authority admission.

### F3 — Revocation list disappears after provider exit

Old signature and certificate remain, but historical CRL/OCSP/revocation status cannot be reconstructed.

**Required defense:** if revocation evidence was a proof requirement, closure is incomplete and result becomes `INCONCLUSIVE`; do not assume `not known revoked == valid`.

### F4 — Old verifier algorithm becomes cryptographically weak

Historical evidence still verifies mechanically under an algorithm no longer considered secure.

**Required defense:** long-term archival policy can renew/anchor evidence before deprecation; verification profile records historical algorithm suitability and renewal lineage.

### F5 — Root transition metadata is missing

System has R7 and R9 but no trustworthy evidence that R7 legitimately transitioned to R9 under normal rotation.

**Required defense:** do not fabricate continuity. Either preserve transition metadata or classify R9 as independently/out-of-band admitted under a new root epoch.

### F6 — Station produces approvals after Enterprise re-root while disconnected

Station S4 continues using R7 after Enterprise moved to R9.

**Required defense:** evaluate local delegation horizon/epoch. Evidence inside an explicitly granted offline interval can be historically classifiable; anything beyond its horizon is rejected/inconclusive and cannot amplify future authority.

### F7 — New provider cannot interpret old provider signature/receipt

Provider substitution removes access to old verification API/key metadata.

**Required defense:** provider exit requires export/preservation of portable verification closure before cutover, or explicit non-portable evidence classification with migration/anchoring proof.

### F8 — Current root re-signs all old records after losing originals

A compromised current root can manufacture plausible history.

**Required defense:** countersign/renewal evidence is additive and provenance-linked. It cannot replace original signed bytes/time/revocation/transition evidence when the claim requires independent historical verification.

## Provider-specific versus portable semantics

### Portable semantics G2 should own

- identity of historical claim/evidence and exact subject bytes/digest;
- authority/trust epoch and purpose/scope;
- verifier/profile revision;
- validity/applicability interval;
- historical versus current qualification distinction;
- trusted-time binding scope where time is material;
- revocation/compromise/invalidation evidence references;
- root transition/re-root lineage;
- completeness/uncertainty and `INCONCLUSIVE`;
- provider-normalized evidence sufficient for later verification;
- current-actuation fencing against retired epochs.

### Providerized mechanics

- X.509 chains, CRLs, OCSP and TSA protocols;
- TUF root metadata and threshold signatures;
- Sigstore TUF/Fulcio/Rekor/CT trusted-root formats;
- KMS/HSM key disable/destroy/version mechanisms;
- ETSI AdES validation-data packaging;
- RFC 3161/ERS timestamp and archival-record syntax;
- provider-specific certificate/log/key IDs and APIs.

The SB should own the requirement/evidence semantics and delegate mature crypto/PKI/transparency mechanics to providers.

## Consequences for existing findings / candidates / hypotheses

### Historical Interpretation Closure (`DR-HIC-01`)

**HARDEN.** Trust material in interpretation closure needs lifecycle semantics: retained-for-historical-verification is distinct from active-for-current-trust. Add temporal/purpose qualification and renewal evidence where cryptographic aging is material.

### Long-Lived Gate Criteria Evolution (`DR-LGCE-01`)

**KEEP / HARDEN.** Historical approval can remain pinned and interpretable, while current Gate progression may require authority/trust requalification. A re-root does not rewrite the past.

### Qualified Derived Claims (`DR-QDCE-01`)

**GENERALIZE.** Historical verification itself is a qualified derived claim bound to subject, verifier/profile, evidence closure, applicability time and authority epoch. It does not create actuation authority.

### Authority-bearing Recursive Trust (`DR-ABRT-01`)

**HARDEN.** Current authority closure must exclude roots marked historical-only/retired. Root selection cannot be inferred from availability in a trust archive.

### Recovery Root / Separation of Duties (`DR-RARSOD-01`)

**HARDEN.** New-root admission must establish a future-authority epoch and a post-recovery historical-verification disposition for the old root. Compromise recovery may require explicit uncertainty for signatures near/after the unknown compromise window.

### Station authority / offline closure

**HARDEN.** Reconnect reconciliation needs both authority epoch and authorized offline horizon. Old-root Station evidence is not categorically invalid, but neither is it automatically current.

### Provider / Binding

**GENERALIZE.** Provider exit/cutover obligations include exportability or preservation of historical verification material. Provider substitution conformance must test old-evidence replay after the old provider is unavailable.

### Artifact / Release / SBOM / Provenance

**KEEP / HARDEN.** Provenance verification must retain historical signer/log/CA material and transition metadata as applicable. Current release signing keys remain separate from historical verification keys.

## Proposed research dispositions

| Disposition | Recommendation |
|---|---|
| KEEP | historical signatures/evidence remain immutable and revision-qualified |
| HARDEN | Historical Interpretation Closure with trust/time/revocation/root-transition qualification |
| GENERALIZE | a small `historical verification qualification` pattern using existing Qualified Derived Claim machinery |
| MERGE | authority epoch + evidence closure + applicability/freshness + provider-normalized evidence |
| SPECIALIZE | PKIX/AdES/TUF/Sigstore/TSA-specific validation and archival-renewal rules |
| PROVIDERIZE | certificate paths, CRL/OCSP, TUF metadata, transparency logs, KMS/HSM key lifecycle, RFC3161/ERS mechanics |
| DEFER | one universal cryptographic archival profile or mandatory TSA for all evidence |
| DO_NOT_BUILD | `old key deleted => history unverifiable`, `old key retained => still trusted now`, generic `timestamp=T`, destructive replacement of old evidence by current-root countersignature |

These are research recommendations, not target-architecture authority.

## Proof obligations

### DR-RRHV-01 — Historical verification after current-root rotation

Create an approval under R7, rotate normally to R8/R9, remove R7 from current authority, then verify the old approval successfully under its historical closure. A new R7-signed approval after cutover MUST fail current authorization.

### DR-RRHV-02 — Compromised old root cannot mint post-cutover authority

Mark R7 compromised/retired and attempt new Gate/admission evidence signed by R7. The cryptographic signature may verify, but semantic result MUST be `NOT_CURRENTLY_AUTHORIZED` (or equivalent), with no protected side effect.

### DR-RRHV-03 — Missing historical revocation evidence

Remove required CRL/OCSP/revocation evidence for a historical certificate. Historical verification MUST become `INCONCLUSIVE`, not silently valid.

### DR-RRHV-04 — Known historical validity before later revocation

Provide trusted evidence that signature existed at T1 and revocation took effect at T2 > T1. Historical claim may validate according to policy while current use of the same root remains forbidden.

### DR-RRHV-05 — Unknown compromise time

Revocation occurs at T2 but compromise may have occurred before T1. System MUST preserve uncertainty and follow policy; publication of revocation at T2 alone cannot prove the signature was safe at T1.

### DR-RRHV-06 — Timestamp scope attack

Timestamp payload at T1, create signature after revocation at T2 and attempt to claim signature existed at T1. Verifier MUST distinguish payload timestamp from signature timestamp and reject/inconclusive the claim.

### DR-RRHV-07 — Exact signature timestamp

Timestamp the signature itself before expiry/revocation, preserve revocation/path evidence and verify later after certificate expiry. Expected result is historical validity under the declared verification profile.

### DR-RRHV-08 — TUF-style continuity rotation

Verify sequential root N→N+1 transition using predecessor and successor thresholds. An out-of-date verifier can traverse preserved intermediate roots but cannot use root N for a new current update once current epoch is N+k.

### DR-RRHV-09 — Compromised-root re-root has no false continuity

Compromise threshold of R7. Admit R9 through independent recovery ceremony. System MUST record new-root admission as externally recovered/re-rooted rather than claiming R7 authorized R9.

### DR-RRHV-10 — Provider exit replay

Retire old PKI/TSA/transparency provider entirely. Using exported retained verification material, verify qualifying old evidence. If provider-specific online state was essential and not preserved, result MUST be explicit non-portable/inconclusive.

### DR-RRHV-11 — Provider substitution does not weaken required semantics

Replace provider A with B whose API cannot preserve historical revocation/time evidence. Binding conformance MUST reject full substitution or mark partial capability rather than silently dropping historical verification.

### DR-RRHV-12 — Offline Station across re-root

Disconnect Station S under R7, re-root Enterprise to R9, allow S to produce only within an explicit pre-authorized local horizon, then reconnect. Evidence inside horizon is classified historically; evidence after horizon cannot become current authority.

### DR-RRHV-13 — Stale Station cannot reintroduce R7 as current root

On reconnect, S presents old root metadata and attempts to overwrite current Enterprise trust state. Epoch/fencing rules MUST prevent rollback.

### DR-RRHV-14 — Long-lived Gate history versus current progression

Stage 1 approval under R7 remains historically valid. Stage 2 after R9 cutover requires current trust/authority according to Gate policy. Workflow MUST not rewrite Stage 1 or infer that R7 can authorize Stage 2.

### DR-RRHV-15 — Archival renewal under algorithm deprecation

Preserve long-term evidence, then mark original signature/timestamp algorithm unsuitable. A previously established renewal/anchor can sustain the historical proof according to profile; absence of required renewal degrades assurance explicitly.

### DR-RRHV-16 — Current-root countersignature is additive

Create a current-root statement attesting that an old signature validated. Remove original verification closure and attempt independent replay. System MUST show that the countersignature is a derived claim, not a substitute for missing source evidence when replayability is required.

### DR-RRHV-17 — Historical material cannot leak private authority

Archive contains all public verification material but no active private signing/issuance key. Attempt to sign/mint under historical root using archival interfaces MUST be impossible.

### DR-RRHV-18 — Simple-system ergonomics

A simple self-hosted deployment with one local root can rotate R1→R2, keep minimal read-only historical public material and verify one old approval without requiring TUF, transparency log, TSA or enterprise PKI unless its assurance profile demands them.

### DR-RRHV-19 — Evidence retention expiry

When policy legitimately allows disposal of old verification material after a retention horizon, later historical verification MUST report `UNAVAILABLE/INCONCLUSIVE` rather than reconstructing trust from current roots.

### DR-RRHV-20 — Historical trust archive corruption

Corrupt a stored historical key/certificate/root-metadata object. Content/integrity verification MUST detect corruption; current trust state MUST remain unaffected.

### DR-RRHV-21 — Wrong historical root laundering

Present an old signature under root R6 but claim R7. Verifier must bind exact root/verifier identity and reject mismatched lineage rather than trying all archived roots until one works.

### DR-RRHV-22 — Break-glass/recovery evidence survives re-entry without preserving break-glass authority

Use exceptional recovery authority, complete steady-state re-entry and retire/fence emergency credentials. Historical audit can still verify the recovery act, but the old break-glass material cannot authorize any new actuation.

## Unresolved questions

1. What exact portable vocabulary should distinguish `historical-verification-only`, `current-trust`, `retired`, `compromised`, `unknown-compromise-window` and `disposed` without overfitting PKI?
2. Should historical trust material be a specialized preservation dependency under `DR-HIC`, or should UCA expose a generic `VerificationProfile/VerifierRevision` relation sufficient for all domains?
3. Which claim classes require trusted time, and which can rely on ordered append-only logs, consensus epochs, monotonic revision/fencing or other temporal witnesses?
4. How should legal/regulatory retention requirements interact with privacy erasure when certificates/log metadata contain subject-identifying information?
5. When a Station remains offline across several root transitions, what compact root-transition closure is minimally sufficient for autonomous later verification?
6. At what assurance level does long-term evidence renewal become mandatory rather than optional? This likely belongs to profile/policy, not the universal primitive.
7. Should provider capability negotiation expose `historicalVerificationExport`, `revocationEvidenceRetention`, `trustedTime`, `rootTransitionExport` and related support-vector dimensions, or should those be inferred from proof suites?

## Confidence

**High** on the following conclusions:

- historical verification material and current authority admission must be separate;
- old public verification material can remain retained without retaining old private authority;
- time/revocation/root-transition context is required to distinguish past validity from future authorization;
- root rotation/re-root must advance future authority independently from historical evidence retention;
- provider substitution that destroys required historical verification is semantically incomplete;
- timestamp scope must be explicit.

**Medium** on the exact universal envelope fields and provider capability-vector dimensions. Those should be resolved during Capability Synthesis rather than frozen by Deep Research.

## Research recommendation

The evidence supports **HARDEN / GENERALIZE / MERGE**, not a new top-level capability.

Generation 2 should preserve the architectural law:

> **A retired root may remain a verifier of qualified historical facts without remaining an authorizer of any future act. Historical verification asks whether evidence was valid under a past authority epoch; current actuation asks whether authority is valid now. Those are different closures and must never be collapsed by key retention, provider convenience or root rotation.**

The most important implementation-neutral consequence is a one-way boundary:

```text
HistoricalTrustArchive
        │
        ├── may validate past evidence
        │
        └── MUST NOT mint/admit current authority
```

The next deep question should target **Temporal Authority Semantics: revocation time, compromise time, observation time and trusted-time witnesses**. This research exposed that `revoked_at` alone is insufficient: the architecture may need to distinguish when compromise actually happened, when it was discovered, when revocation became effective/published, when an act occurred, and which temporal witness proves each relation. The question can falsify whether G2 needs a small typed temporal-evidence relation or should keep time qualification entirely domain-specific.
