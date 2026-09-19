# G4 — Privacy-Preserving Evidence/Currentness Federation

Status: `RESEARCH_ACTIVE / NON_EXECUTABLE`
Execution authority: NONE
Date: 2026-09-19
Parent family: Shared Semantic Kernel / Capability Exchange Plane / Inter-Capability Boundary Model

## Purpose

Research how autonomous runtimes/capabilities can prove narrowly scoped revision, currentness, authority, artifact and effect facts across federation boundaries without turning globally stable identifiers, complete evidence records, central online verifiers or excess tenant/business metadata into mandatory exchange semantics.

This is a focused continuation of evidence-minimal security reconciliation and offline security-floor research. It does not create a new macro-family, select an identity/credential framework, or authorize implementation.

The tension is:

```text
federated reconciliation needs correlation sufficient for the proof purpose
privacy requires disassociability beyond that purpose
```

The desired property is therefore not universal unlinkability. It is **purpose-bounded linkability**: enough continuity to satisfy an explicit proof obligation, no more correlation surface than that obligation requires.

## Evidence classes reviewed

- NIST SP 800-63C-4 federation guidance (2025): pairwise pseudonymous identifiers use different identifiers per relying party/set, prohibit identifying information in the identifier, require unguessability, and treat mappings as sensitive subscriber information. It also separates trust agreements, identifier/key establishment and federation protocol.
- W3C Data Integrity BBS Cryptosuites v1.0 (current Candidate Recommendation): selective disclosure and unlinkable derived proofs demonstrate that a holder can prove selected signed facts without presenting one globally stable complete credential representation. This is evidence of a mechanism class, not a G4 adoption decision.
- W3C Bitstring Status List v1.0 Recommendation (2025): group-oriented status publication, verifier caching/CDN patterns and privacy considerations show that currentness/revocation checks need not expose a per-subject online lookup to the issuer; the specification also warns that global identifiers, unique lists and malicious issuer/verifier collusion can defeat privacy.
- SPIFFE Federation: autonomous trust domains retain distinct bundles/authority; bundles from different trust domains must not be merged, trust-domain/bundle binding must be preserved, and key rotation requires overlap/dissemination. This supports scoped trust federation and rotation semantics, not SPIFFE adoption.
- RFC 9449 DPoP: sender-constrained proof-of-possession demonstrates that possession/replay protection can be bound to a presentation without turning possession proof into business identity or authority semantics.
- Existing G4 evidence-minimal, offline-security-floor, compatibility and Exchange Plane research.

## 1. Privacy boundary: proof continuity is not global identity continuity

A verifier often needs to answer a narrow question:

```text
Did this peer possess evidence satisfying profile P
for occurrence/effect/revision scope S
under acceptable currentness C?
```

It does not automatically need a stable cross-system subject identifier.

Candidate invariants:

```text
Proof continuity != global subject continuity
Evidence correlation != business identity proof
Same underlying subject != same federated identifier by default
Verifier can validate a claim != verifier may correlate every presentation
```

NIST pairwise pseudonymous identifiers provide a mature precedent: identifiers can be stable enough within an RP relationship while intentionally differing across RPs. The transferable principle is **correlation scope is part of the contract**.

## 2. Candidate correlation scopes

Research vocabulary, not canonical enums:

```text
PRESENTATION_EPHEMERAL
VERIFIER_PAIRWISE
TRUST_GROUP_SCOPED
OCCURRENCE_SCOPED
EFFECT_SCOPED
TENANT_SCOPED
GLOBAL   // exceptional, requires explicit justification
```

A proof contract should declare the minimum correlation scope required. Promotion from a narrower to broader scope is a semantic/privacy change, not an implementation optimization.

```text
Dedup requires equality within scope
!= equality must be globally visible
```

## 3. Selective disclosure and derived proof

Selective-disclosure/unlinkable-proof systems demonstrate an important implementation-independent possibility:

```text
source evidence contains A,B,C,D
verifier needs only claim B + qualification Q
presentation need not reveal A,C,D
```

For G4, a peer might need to prove only:

- security policy revision >= required floor;
- artifact belongs to an admissible generation set;
- authority evidence satisfied a declared profile at effect time;
- an effect is `EFFECTIVE`, `UNKNOWN` or reconciled under a particular evidence class;
- a revocation/currentness witness was no older than a declared bound.

The verifier should not automatically receive the complete source witness, business payload, internal subject identifier, tenant-wide occurrence graph or unrelated provenance.

Core rule:

`Proof of predicate != disclosure of source record`.

## 4. Currentness queries can themselves leak activity

A per-credential/per-effect online status lookup can reveal to an issuer or status service when and where a particular credential/effect is being checked. W3C Bitstring Status List explicitly discusses group privacy, caching and CDNs as ways to reduce correlatable access patterns, while warning that unique status structures or colluding actors can defeat those protections.

For G4:

```text
Currentness privacy
!= only hiding payload fields
```

Query shape, timing, endpoint, list partition, cache miss and refresh cadence can all leak correlation.

Candidate mitigations to qualify rather than mandate:

- group/batch status structures;
- local cached status material with bounded freshness;
- privacy-preserving distribution mirrors/CDNs;
- coarse partitions sized to avoid one-subject groups;
- verifier-side refresh independent of one business action;
- proof presentations that do not require issuer callback per effect.

Trade-off:

```text
more offline/cache autonomy
→ less live query leakage
→ potentially wider currentness window
```

The security/currentness contract must state that trade-off explicitly.

## 5. Pairwise references and verifier-specific evidence refs

A globally stable `EvidenceRef` is convenient but can become a cross-capability tracking handle. A candidate alternative is a verifier- or trust-group-specific reference derived or mapped from a source-local evidence identity.

Conceptually:

```text
SourceEvidenceId E
  -> Ref(E, verifier A) = EA
  -> Ref(E, verifier B) = EB

EA != EB
```

The mapping authority remains source/local or an explicitly governed privacy mediator. The Exchange Plane must not require a universal reverse map.

Proof obligations:

- refs are unguessable within their threat model;
- equality/correlation scope is explicit;
- rotation/supersession does not silently mint a new business identity;
- a verifier-specific ref does not transfer source business ownership;
- compromise of one verifier's mapping does not automatically expose all peer mappings;
- erasure/retention policy governs the mapping itself.

## 6. Unlinkability and deduplication are in tension, not mutually exclusive

Deduplication requires recognizing sameness over some domain. Unlinkability attempts to prevent recognizing sameness outside an intended domain.

Therefore:

```text
Unlinkable everywhere + deduplicate everywhere
is an incoherent requirement.
```

The contract must define both:

```text
DedupScope
CorrelationScope
```

and require:

`DedupScope <= permitted CorrelationScope`.

Examples:

- duplicate command detection may need stable identity only for one target + idempotency horizon;
- reconciliation may need stable occurrence linkage only among declared participants;
- fraud/security analysis may justify a broader trust-group scope under separate authority;
- unrelated capabilities do not inherit that correlation right.

A global stable key is not justified merely because it simplifies dedup implementation.

## 7. Proof-of-possession is not identity/authority

DPoP demonstrates sender-constrained tokens and replay detection by proving possession of a key. The transferable boundary is:

```text
Proof-of-possession
!= business identity
!= business authority
!= currentness
```

A verifier can know that the presenter controls a key bound to a presentation without learning or being entitled to a global business identifier. Conversely, possession of the right key cannot fabricate an authority revision or current security floor.

## 8. Trust domains remain distinct under federation

SPIFFE Federation provides a useful mature failure boundary: trust bundles from different trust domains must remain distinct; pooling them would allow one domain to impersonate another. Keys rotate and foreign domains must refresh/disseminate updates with overlap.

G4 principle:

```text
Federation != trust-domain collapse
Shared verifier logic != shared root authority
```

A future Exchange Plane may carry issuer/trust-domain qualification and currentness evidence, but must preserve the binding between evidence and its authority domain. It must not normalize multiple authorities into an undifferentiated global trust pool.

## 9. Key rotation and privacy-reference rotation are separate

Rotating signing/verification keys should not require changing the semantic identity of an effect. Rotating a pairwise/pseudonymous reference may intentionally reduce future linkability.

Therefore:

```text
Cryptographic key rotation
!= semantic identity rotation
!= correlation-reference rotation
```

A proof profile needs explicit rules for:

- key overlap and old-proof verification;
- verifier-specific ref rotation;
- mapping retention horizon;
- outstanding occurrence/effect reconciliation;
- compromised-key revocation;
- whether pre-rotation and post-rotation presentations are intentionally linkable;
- how `UNKNOWN` is represented when old mappings were legitimately erased.

## 10. Long partitions and reconnect

Suppose A and B federate, then disconnect. During the partition both rotate keys/references and accumulate effects. On reconnect, forcing one side to reveal a global identity graph merely to reconcile history defeats the privacy boundary.

Candidate reconnect sequence:

```text
1. re-establish trust-domain/key continuity
2. negotiate proof/currentness profiles
3. exchange coarse frontiers / qualified status evidence
4. identify only the occurrence/effect scopes requiring reconciliation
5. disclose verifier-specific/selective witnesses for those scopes
6. preserve CONFLICTED/UNKNOWN where legitimate mappings/evidence expired
7. avoid reconstructing erased global identity links
```

`Reconnect != authority to widen correlation scope`.

## 11. Candidate `FederatedEvidencePresentationProfile`

Research vocabulary only:

```text
proofPurpose
issuer/trustDomainRef
verifier/trustGroupRef
requiredPredicates[]
correlationScope
dedupScope
presentationLifetime
currentnessBound
statusFreshnessBasis
selectiveDisclosurePolicy
holder/senderBinding?
antiReplayProfile
referenceMode
  EPHEMERAL | PAIRWISE | GROUP_SCOPED | OCCURRENCE_SCOPED | EXPLICIT_GLOBAL
keyRevision / trustBundleRevision
rotationContinuityPolicy
retention/erasureClass
proofLimitations[]
```

The profile describes required semantics, not a credential format.

## 12. Proof obligations

Before implementation planning, prove or explicitly bound:

1. a verifier receives only attributes/evidence needed for the declared proof purpose unless broader disclosure is separately authorized;
2. stable identifiers are scoped to the minimum correlation domain required by the contract;
3. deduplication does not require correlation beyond its declared scope/horizon;
4. pairwise/verifier-specific references are unguessable and their mappings are governed sensitive data;
5. selective disclosure does not hide a field required to evaluate authority/currentness/effect semantics;
6. proof-of-possession cannot be promoted into identity, authority or business-effect proof;
7. currentness/status checks account for query-pattern leakage, not only response payload privacy;
8. cached/group status material has an explicit freshness bound and cannot silently become current forever;
9. issuer/trust-domain bindings survive federation and are not pooled into one authority namespace;
10. key rotation preserves historical verification where required without requiring permanent cross-verifier correlation;
11. correlation-reference rotation has explicit continuity/erasure semantics for outstanding obligations;
12. reconnect after partition can reconcile declared effect scopes without demanding a global identity graph;
13. expired/erased pairwise mappings yield qualified `UNKNOWN` rather than fabricated non-equivalence or new identity;
14. malicious/colluding verifier/issuer cases are represented in the threat model; privacy claims are not based only on honest participants;
15. transport/gateway logs do not reintroduce the global stable identifiers that the presentation layer removed;
16. replacement providers can preserve proof-purpose/correlation semantics without adopting provider-specific identifiers as canonical truth;
17. cross-capability evidence verification does not transfer business ownership;
18. tenant/classification policy remains enforceable even when identity disclosure is minimized.

## 13. Adversarial cases

1. A global evidence ID is reused across every capability and becomes a platform-wide tracking handle.
2. Pairwise refs are different, but a globally stable artifact/effect digest trivially relinks them.
3. Selective disclosure hides tenant/classification context required to authorize the proof use.
4. Verifier queries issuer for one unique status entry per business action, revealing activity timing.
5. Status list contains only one credential/effect and therefore provides no meaningful group privacy.
6. CDN/cache hides verifier IP but URL path remains globally unique per subject.
7. Dedup implementation stores a global reverse map indefinitely although the contract requires only 24-hour target-local dedup.
8. Key rotation changes pairwise identifiers and an outstanding effect is treated as belonging to a new business entity.
9. Old/new references remain linkable through unrotated telemetry trace IDs.
10. Broker headers preserve a global subject identifier omitted from the selectively disclosed payload.
11. Proof-of-possession is accepted as proof that the presenter still has business authority.
12. Trust bundles from independent domains are merged for convenience, allowing cross-domain impersonation.
13. One federation proxy sees every pairwise mapping and becomes an undeclared global correlation authority.
14. Colluding issuer/verifier defeats status-list privacy by issuing unique lists/keys per subject.
15. Reconnect protocol demands complete source evidence to reconcile one narrow currentness fact.
16. Legitimately erased mapping is silently reconstructed from logs/backups.
17. Random pseudonyms are low entropy or derived from guessable business IDs.
18. A verifier-specific ref leaks through error messages or dead-letter payloads to unrelated consumers.
19. Selective proof is unlinkable cryptographically but timing/size/routing metadata makes presentations trivially correlatable.
20. Privacy-preserving presentation prevents legitimate duplicate-effect detection because dedup and correlation scopes were never declared.

## 14. Portability / exit path

Portable semantics are the proof purpose, predicates, issuer/trust-domain qualification, verifier/correlation scope, dedup scope, currentness bound, anti-replay/sender-binding requirements, rotation continuity, retention/erasure disposition and explicit proof limitations.

Provider-specific DID methods, credential formats, BBS suites, token formats, SPIFFE IDs, OAuth tokens, status-list encodings, broker headers or storage keys remain realization details unless explicitly qualified into a contract.

A replacement realization must be allowed to say `INCOMPATIBLE` when it cannot preserve correlation/privacy/currentness guarantees. An adapter must not fabricate unlinkability or semantic continuity.

## 15. Trade-offs

| Strategy | Benefit | Risk / cost |
|---|---|---|
| global stable identifier | simplest correlation/dedup | platform-wide tracking/coupling |
| pairwise pseudonymous ref | bounded cross-verifier correlation | mapping lifecycle/rotation complexity |
| ephemeral presentation | strong disassociability | weak long-lived reconciliation/dedup |
| selective disclosure | less unnecessary metadata | proof-system/key lifecycle complexity |
| group/batch status | reduced issuer observation | coarser/fresher-state trade-offs |
| live per-item status | freshest status possible | activity leakage + online dependency |
| cached status | autonomy/privacy | bounded staleness |
| federation proxy | protocol simplification | correlation concentration / trust expansion |

No strategy is a universal default.

## 16. Deduplication against existing G4 research

This document does not reopen identity architecture, general authorization, evidence retention, security-floor dissemination or Exchange Plane fundamentals.

Material delta is narrower: **how evidence/currentness crosses autonomous trust/capability boundaries with deliberately bounded correlation and disclosure, including the unavoidable trade-off between unlinkability, deduplication and long-lived reconciliation**.

## 17. Maturity and next gap

Material delta exists. Family 8 remains `RESEARCH_ACTIVE / NON_EXECUTABLE` and is not saturated.

The next highest-value gap is **privacy-preserving reconciliation under multi-party collusion and metadata side channels**: determine which privacy guarantees survive issuer/verifier/gateway/broker collusion; formalize correlation budgets across timing, routing, trace, size and status-query metadata; and identify when a claimed pairwise/selective-disclosure design is cryptographically unlinkable yet operationally linkable.

No identity system, credential format, cryptosuite, federation framework, status mechanism, broker, PKI or provider is selected.