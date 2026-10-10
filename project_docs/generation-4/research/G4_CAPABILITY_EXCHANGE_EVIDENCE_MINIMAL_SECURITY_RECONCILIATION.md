# G4 — Evidence-Minimal Security Reconciliation under Retention and Erasure

Status: `RESEARCH_ACTIVE / NON_EXECUTABLE`
Execution authority: NONE
Date: 2026-09-19
Parent family: Shared Semantic Kernel / Capability Exchange Plane / Inter-Capability Boundary Model

## Purpose

Research what minimum durable witness is needed to reconcile security-floor, revocation, artifact identity, authority/currentness and effect disposition after sensitive payloads or replay material have been legitimately erased. This is a focused continuation of offline-security-floor and retention/erasure research, not a new macro-family and not an implementation decision.

The problem is a tension between two valid requirements:

```text
security reconciliation needs historical proof
privacy/retention policy may require historical content to disappear
```

The System Builder must not solve this by retaining full payloads forever, nor by erasing so aggressively that later security reconciliation fabricates certainty.

## Evidence classes reviewed

- Sigstore bundle format and verification documentation: artifact digests/signatures, certificates, signed timestamps, transparency-log entries and inclusion evidence can support offline historical verification without requiring the original signing service to remain online.
- RFC 6962 Certificate Transparency: append-only Merkle trees, signed timestamps, inclusion proofs and consistency proofs demonstrate compact witness patterns for proving membership/history without requiring every verifier to possess the entire log.
- W3C Verifiable Credentials 2.0 family: current standards include cryptographic integrity, selective-disclosure mechanisms and privacy-preserving status/revocation structures, demonstrating that proof/status disclosure can be narrower than full subject data.
- NIST SP 800-92 log-management guidance: security logs themselves can contain sensitive information and therefore require confidentiality, integrity and retention governance rather than being treated as harmless metadata.
- Existing G4 Data Retention/Erasure/Reproducibility research: metadata, hashes, embeddings and provenance are not automatically non-sensitive; residual evidence must be minimized and policy-qualified.
- Existing G4 Offline Security Floors research: security-policy revision, effective time, runtime observation time, artifact identity and effect disposition are distinct proof domains.

These sources are evidence patterns only. G4 does not select Sigstore, Certificate Transparency, VC, a transparency service, PKI, Merkle structure, privacy system or log provider.

## 1. Security evidence and retained payload are separate objects

A reconciliation proof should not require retaining the full business payload merely because a later security question may arise.

Candidate separation:

```text
BusinessPayload
  domain content / personal or classified values

SemanticEffectEvidence
  what effect identity/disposition was observed

SecurityWitness
  what artifact/security-policy basis applied

AuthorityWitness
  what authority/currentness basis was used

ErasureDispositionEvidence
  what material was intentionally erased and under which scope/policy
```

Core invariants:

```text
Evidence sufficient != payload retained
Payload erased != historical effect never existed
Payload erased != security revision unknowable by definition
Evidence retained != permission to reconstruct erased payload
```

## 2. Evidence minimization is purpose-relative

There is no universal smallest evidence record. Sufficiency depends on the future question that must remain answerable.

Candidate proof purposes:

```text
P1 prove artifact identity used
P2 prove security-policy revision/currentness basis used
P3 prove revocation effective/observation ordering
P4 prove business-authority basis used
P5 prove an effect occurred / remained UNKNOWN / was reconciled
P6 prove payload was erased under a governed disposition
P7 prove anti-rollback/security continuity
```

A witness sufficient for P1 may be insufficient for P5. Conversely, retaining fields needed only for hypothetical replay can violate minimization when the declared obligation is merely P1/P2/P6.

Therefore:

```text
Minimal witness
= minimum evidence for declared proof obligations
not minimum bytes globally
```

## 3. Candidate `SecurityReconciliationWitness`

Research vocabulary, not schema:

```text
witnessId
proofPurposeSet
securityDomainRef
securityPolicyRevision
securityPolicyDigest / qualified commitment
revocationRef or compact revocation witness
revocationEffectiveAt?
runtimeObservedAt?
qualifiedTimeBasisRef
artifactRef / artifactDigest / provenanceRef
contractRevisionRef?
authorityRevisionRef or qualified authority commitment?
effectRef / effectClass / effectDisposition
participant/effect-domain ref
occurrence/causal ref where still permitted
classification/tenant scope where still permitted
payloadRetentionDisposition
  PRESENT | REDACTED | ERASED | UNAVAILABLE | UNKNOWN
witnessCreatedAt
witnessRetentionClass / expiry / hold
cryptographic/integrity evidence
supersession/reconciliation refs
```

Every field remains subject to minimization. `tenant`, `occurrence`, artifact digest or even a stable effect identifier can itself be sensitive/linkable and cannot be placed in a universal shared record by convenience.

## 4. Commitments can prove continuity without preserving content — but are not automatically anonymous

Cryptographic hashes, Merkle roots, signatures and transparency inclusion proofs can prove that some exact historical material was committed to or logged. Sigstore and Certificate Transparency demonstrate mature use of such evidence.

But G4's prior retention finding remains binding:

```text
Hash != anonymous by definition
Digest retained != payload safely forgotten by definition
```

A low-entropy identifier, small-domain value or known candidate payload can often be tested against a hash. A stable digest can also become a long-lived correlator across systems.

Therefore a commitment is qualified by:

```text
input entropy / guessability
linkability scope
salt/key strategy if applicable
who can verify
retention horizon
proof purpose
whether deletion requires destruction of verification capability too
```

The Exchange Plane must not standardize one global stable payload hash as a universal evidence primitive.

## 5. Historical proof and current admissibility remain distinct

A retained witness may prove:

```text
artifact A was used
under security revision S7
at effect time Te
runtime had observed policy through S7 at To
```

It does not prove that A remains admissible now.

Likewise, later policy S9 may state that A was revoked effective before Te. Reconciliation must preserve the historical evidence rather than rewrite it:

```text
historicalBasis = S7
laterKnownRevocation = S9
revocationEffectiveAt = Tr
runtimeObservedAt = To2
```

This supports the existing rule:

`Revocation effective time != runtime observation time`.

## 6. Proof of absence is harder than proof of retained evidence

Erasing a payload does not by itself prove that no copy survives in projections, logs, backups, external processors or generated artifacts. Likewise, absence of a witness does not prove that an effect did not happen.

```text
No witness found != no effect
Erasure ACK != system-wide absence proof
```

Security reconciliation therefore needs explicit `UNKNOWN` when required evidence has expired, was never captured, or was intentionally erased.

Retention policy may intentionally downgrade future proof capability:

```text
PROVABLE
PARTIALLY_PROVABLE
EXPLAINABLE_NOT_REPLAYABLE
INTENTIONALLY_UNPROVABLE_FOR_THIS_PURPOSE
UNKNOWN
```

These are research dispositions, not canonical enums.

## 7. Transparency structures are useful witnesses, not universal retention authorities

RFC 6962 shows that Merkle inclusion/consistency proofs can support audit of append-only history and detect equivocation without every client retaining all entries. Sigstore bundles similarly package historical verification evidence for offline checking.

The transferable principle is:

```text
compact proof witness
can outlive online verification infrastructure
```

But public/permanent transparency is not a safe default for private business events. Publishing personal, tenant, classified or business identifiers into an append-only external log can make erasure impossible.

Therefore:

```text
Transparency proof useful
!= publish business payload/identifier globally
```

A future realization would need scope-appropriate commitments, privacy review and retention authority.

## 8. Selective disclosure/status patterns support evidence narrowing

The W3C Verifiable Credentials 2.0 family includes privacy-respecting credential mechanisms, selective-disclosure-capable security formats and a privacy-preserving status-list standard for suspension/revocation. The implementation-independent lesson is that a verifier need not always receive or retain the complete underlying subject record to evaluate a narrowly scoped claim/status.

For G4 this supports a design direction:

```text
reconciliation request
  -> declare proof purpose
  -> disclose minimum qualified witness
  -> avoid unrelated payload fields
```

It does not imply adoption of Verifiable Credentials or that selective disclosure alone satisfies all retention/erasure obligations.

## 9. Security/audit logs are themselves governed sensitive data

NIST log-management guidance explicitly notes that logs can contain sensitive information and require confidentiality/integrity protection. This blocks a common failure mode:

```text
payload erased from business DB
but full payload survives forever in audit/security logs
```

Candidate invariant:

`Security evidence store != retention exemption`.

A security witness needs its own retention class, access policy, erasure/hold behavior and minimization rules.

## 10. Reconciliation after payload erasure

Example:

```text
t1 runtime executes effect E using artifact A under security revision S7
t2 sensitive payload P is legitimately erased
t3 central policy S9 is received; A was revoked effective at t0 < t1
```

A useful minimal witness may still allow the system to determine:

- which artifact generation was involved;
- which security revision the runtime had observed;
- revocation effective time versus runtime observation time;
- effect class/disposition;
- authority/contract revision references if required;
- whether business recovery/manual review is required;
- that P itself is intentionally unavailable.

It must not silently regenerate P from old logs, backups or deterministic replay merely to improve reconciliation.

```text
Reconciliation need != fresh authority to resurrect erased data
```

## 11. Evidence destruction can be a valid terminal security/privacy outcome

Some policies may require destruction not only of payload but also of linkable proof material. If so, future security reconciliation may legitimately become less precise.

The architecture must represent that loss instead of keeping a shadow copy:

```text
witness expired/erased by policy
→ future disposition may become UNKNOWN / aggregate-only / manual
```

This is not necessarily corruption. It can be a governed consequence of finite retention.

`Finite evidence retention != falsified history`.

## 12. Witness integrity and witness confidentiality are independent

Signing a witness proves integrity/authenticity under a declared trust model; it does not make the witness safe to disclose.

```text
Signed evidence != non-sensitive evidence
Encrypted evidence != justified retention
Tamper-evident != permanently retainable
```

A future evidence plane must qualify both integrity and disclosure/retention policy.

## 13. Cross-capability evidence references should not transfer business ownership

A capability may expose a minimal evidence reference allowing another capability to verify a security/effect fact. That reference must not turn the receiving capability or Exchange Plane into owner of the source business entity.

Candidate rule:

```text
EvidenceRef
  identifies/qualifies a proof object
  does not imply ownership of source entity
  does not imply permission to fetch erased payload
```

This extends `Cross-capability reference != ownership transfer`.

## 14. Candidate proof obligations

Before implementation planning, prove or explicitly bound:

1. reconciliation can answer each declared security proof purpose using no more retained content than its policy permits;
2. full business payload is not required merely to prove artifact/security revision/effect disposition when a narrower witness suffices;
3. hashes/digests/IDs are classified by linkability and guessability rather than labeled anonymous metadata;
4. revocation effective time, runtime observation time and effect time remain distinguishable after payload erasure when the declared reconciliation purpose requires them;
5. historical provenance evidence cannot be mistaken for current security admissibility;
6. evidence absence/expiry cannot be strengthened into proof that an effect did not occur;
7. witness retention/erasure has explicit authority, scope, horizon, hold and access semantics;
8. security/audit evidence stores participate in deletion/retention impact analysis rather than receiving a blanket exemption;
9. transparency/append-only mechanisms cannot receive sensitive business identifiers unless policy explicitly permits that irreversible disclosure/retention consequence;
10. cross-capability evidence references do not transfer canonical business ownership or authorize retrieval of erased payload;
11. replay/backfill cannot resurrect erased payload solely to satisfy later security reconciliation;
12. witness integrity, confidentiality, currentness and retention are separate proof domains;
13. intentionally erased witness material downgrades future reconciliation explicitly instead of being silently reconstructed from ungoverned copies;
14. replacement runtimes/providers can import enough portable witness semantics to continue reconciliation without importing provider-specific logs as canonical truth;
15. compaction preserves the declared proof witness while deleting reconstructive payload where policy requires;
16. a witness is never treated as evidence for a proof purpose outside the purpose/profile it actually supports.

## 15. Adversarial cases

1. Payload erased from canonical DB but remains verbatim in security logs.
2. Global stable hash of a low-entropy identifier enables dictionary recovery after erasure.
3. Artifact digest is retained correctly but runtime security-policy revision is lost, making historical admissibility unknowable.
4. Revocation effective time retained but runtime observation time erased, falsely making stale-window execution look knowingly noncompliant.
5. Runtime observation time retained but trusted-time basis is gone, overstating precision.
6. Public transparency log contains tenant/subject identifier that policy later requires erased.
7. Security witness contains full command payload “for audit convenience”.
8. Witness expires and reconciliation code interprets missing evidence as `NO_EFFECT`.
9. Backup restore resurrects erased evidence and payload into active reconciliation indexes.
10. Derived search/vector index still exposes erased payload while evidence store correctly reports `ERASED`.
11. Reconciliation replays an old workflow and republishes erased data to reconstruct an effect.
12. Signature proves witness integrity but broad access policy leaks sensitive correlation graph.
13. Same digest is reused across tenants and becomes a cross-tenant correlator.
14. Keyed commitment key is destroyed; system continues advertising independently verifiable proof it can no longer produce.
15. Compaction preserves current state but removes the revocation/effect ordering witness required for a later incident.
16. EvidenceRef is treated as permission to dereference an erased business entity.
17. Legal/security hold is released but evidence remains indefinitely because no disposal lifecycle exists.
18. Provider audit log is treated as canonical truth even though provider retention expired and delivery/effect semantics were weaker than assumed.
19. Witness contains authority revision but not authority scope, causing later verifier to overgeneralize it.
20. Aggregate-only evidence is presented as proof of one specific individual's effect.

## 16. Portability / exit path

Portable evidence semantics should preserve proof purpose, security-policy revision/commitment, artifact/provenance reference, revocation effective/observation ordering where required, authority/contract refs where required, effect disposition, retention disposition, integrity evidence and explicit proof limitations.

Provider-specific log IDs, transparency services, storage keys, broker offsets and audit-product record IDs remain realization details unless their semantics are explicitly part of the qualified contract.

A replacement provider must not require resurrection of erased payload merely because it cannot understand the prior compact witness. Incompatibility should be explicit.

## 17. Trade-offs

| Strategy | Benefit | Risk / cost |
|---|---|---|
| retain full payload/history | maximum replay potential | privacy/security exposure; retention conflict; storage cost |
| compact signed witness | lower retained content; portable integrity | may remain linkable; proof scope limited |
| public transparency evidence | strong append-only/inclusion proof | irreversible disclosure/linkability risk |
| keyed/pseudonymous commitments | reduced public linkability | key lifecycle and verifier portability complexity |
| short witness retention | strong minimization | later incidents may become partially provable/UNKNOWN |
| long witness retention | stronger late reconciliation | greater breach/privacy surface and governance burden |
| aggregate evidence | lower individual exposure | cannot prove individual effect by itself |

No strategy is a universal default.

## 18. Deduplication against existing G4 research

This document does not reopen general retention/erasure mechanics already covered by `G4_DATA_RETENTION_ERASURE_REPRODUCIBILITY.md`, nor offline security-floor dissemination covered by `G4_CAPABILITY_EXCHANGE_OFFLINE_SECURITY_FLOORS_RESEARCH.md`.

Material delta is narrower: **what causal/security witness must survive after content erasure so later cross-capability security reconciliation remains qualified without retaining reconstructive business history forever**.

## 19. Maturity and next gap

Material delta exists. Family 8 remains `RESEARCH_ACTIVE / NON_EXECUTABLE` and is not saturated.

The next highest-value gap is **privacy-preserving federation of evidence/currentness across autonomous runtimes**: how peers prove revision/currentness/effect facts to one another without exchanging globally stable correlators or excessive tenant/business metadata, including unlinkability versus dedup/correlation trade-offs, selective disclosure, verifier-specific references, key rotation and reconnect reconciliation.

No implementation, evidence store, transparency log, VC framework, PKI, database or provider is selected.