# G4 — Privacy Collusion & Metadata Correlation at Capability Boundaries

Status: `RESEARCH_ACTIVE / NON_EXECUTABLE`
Execution authority: NONE
Date: 2026-09-19
Parent family: Shared Semantic Kernel / Capability Exchange Plane / Inter-Capability Boundary Model

## Purpose

Deepen the privacy-preserving evidence/currentness federation research by asking which privacy claims survive collusion among issuer, verifier, relay/gateway, broker and observability operators, and which claims fail because transport/application metadata relinks presentations that are cryptographically unlinkable.

This is a focused continuation of `G4_CAPABILITY_EXCHANGE_PRIVACY_PRESERVING_EVIDENCE_FEDERATION.md`. It does not create a new macro-family, select a cryptosuite, relay, broker, credential framework or anonymity network, or authorize implementation.

## Evidence classes reviewed

- W3C Data Integrity BBS Cryptosuites v1.0 (current Candidate Recommendation): BBS provides selective disclosure and unlinkable derived proofs, while the specification warns that globally unambiguous identifiers and even proof options/mandatory reveals can create linkage.
- W3C Bitstring Status List v1.0 Recommendation (2025): group-oriented status can reduce per-subject lookup leakage, but the specification explicitly states that malicious issuer/verifier collusion can circumvent group privacy and that unique lists/keys can create one-to-one tracking handles.
- RFC 9458 Oblivious HTTP: split relay/gateway knowledge can hide client network identity from the gateway and plaintext from the relay, but its privacy goal depends on non-collocation/non-collusion and the RFC explicitly leaves traffic analysis outside its core guarantee; configuration, key identifiers, URIs and differential treatment can partition anonymity sets.
- Existing G4 purpose-bounded linkability, evidence-minimal reconciliation, offline security-floor, trace/correlation and Exchange Plane findings.

## 1. Cryptographic unlinkability is not operational unlinkability

A presentation can satisfy a cryptographic unlinkability property and still be operationally correlatable through surrounding observations.

Candidate invariant:

```text
Cryptographically unlinkable
!= operationally unlinkable
```

Operational observations include, depending on topology and trust boundaries:

- source/destination network identity;
- timing and inter-arrival patterns;
- request/response size and shape;
- route, endpoint, topic, partition, queue or stream identity;
- status-list/list-partition selection;
- relay/gateway configuration and key identifier;
- retry cadence, timeout and error class;
- trace/span/baggage/correlation identifiers;
- tenant/classification/routing headers;
- cache hit/miss and refresh cadence;
- rate-limit or abuse-treatment behavior;
- unique proof options, challenges, domains or mandatory reveals.

Therefore privacy qualification must evaluate the complete observable exchange path, not only the credential/proof payload.

## 2. Collusion changes the guarantee, not merely the risk score

A split-knowledge design is useful only relative to a declared non-collusion assumption. RFC 9458 demonstrates the principle clearly: a relay can know client network origin while the gateway knows plaintext; the privacy property relies on those roles not being operated as one correlating observer. W3C Bitstring Status List similarly warns that issuer/verifier collusion can defeat group privacy.

Candidate rule:

```text
Privacy guarantee
= mechanism + observable surfaces + collusion assumptions
```

A contract must not say merely `UNLINKABLE`. It needs a threat/observer profile such as:

```text
ObserverSet
  ISSUER
  VERIFIER
  RELAY
  GATEWAY
  BROKER
  STATUS_SERVICE
  OBSERVABILITY_OPERATOR
  NETWORK_OBSERVER

CollusionSets[]
  {ISSUER, VERIFIER}
  {RELAY, GATEWAY}
  {BROKER, OBSERVABILITY_OPERATOR}
  ...
```

These are research vocabulary, not canonical enums.

If a claimed privacy property fails under an allowed collusion set, that failure is a contract limitation, not an implementation footnote.

## 3. Correlation budget as a vector, not a scalar score

A single numeric privacy score would hide important failure modes. Candidate `CorrelationBudget` is instead a vector of deliberately exposed surfaces and horizons:

```text
CorrelationBudget
  identityScope
  dedupScope
  timeResolution
  retentionHorizon
  networkOriginVisibility
  destinationGranularity
  route/topicGranularity
  sizeGranularity
  statusQueryGranularity
  traceContinuityScope
  retryLinkability
  verifier/issuerVisibility
  permittedObserverSets
  prohibitedCollusionSets
  residualLeakage[]
```

The budget is not a promise that each dimension is independently controllable. It forces the contract to state where correlation is necessary and where it is merely accidental.

Core rule:

```text
Correlation budget exceeded
!= harmless telemetry detail
```

Crossing the declared scope can change privacy/classification semantics even when business payload and cryptographic proof remain unchanged.

## 4. Anonymity sets are topology- and behavior-dependent

RFC 9458 notes that client configuration can partition anonymity sets and that differential treatment such as rate limiting can reveal information. W3C status-list guidance similarly shows that a list containing a unique credential provides little group privacy.

Therefore:

```text
Shared relay/list exists
!= meaningful anonymity set exists
```

A future qualification must consider effective group size after partitioning by:

- trust domain;
- tenant/classification;
- gateway key/configuration;
- endpoint/route;
- time window;
- message size class;
- status partition;
- retry/error behavior;
- policy/rate-limit treatment.

A nominal group of 10,000 may collapse to one after these dimensions are combined.

## 5. Metadata minimization must include observability

Existing G4 already states `Trace/correlation != business causation != authority`. This round adds the privacy counterpart:

```text
Payload privacy != telemetry privacy
```

A selectively disclosed or pairwise presentation can be relinked if the same global trace ID, baggage value, occurrence ID or tenant-wide routing key crosses boundaries.

Candidate proof obligations:

- trace continuity is scoped no wider than operational need;
- cross-boundary trace propagation does not silently widen the declared correlation scope;
- observability backends do not become undeclared global identity/evidence maps;
- dead-letter, retry and error paths preserve the same privacy budget as the happy path;
- debugging overrides are explicit governed disclosures, not permanent default headers.

This does not imply that tracing must be removed. It means traceability and unlinkability are competing requirements whose scope must be declared.

## 6. Timing, size and routing leakage are first-class limitations

Padding, batching, cover traffic, mixing, delayed dispatch or oblivious relays are possible mechanism classes, but each adds latency, bandwidth, cost, complexity or weaker currentness. No mechanism is selected.

Candidate decision principle:

```text
Do not spend anonymity cost universally.
Qualify it where the proof purpose and threat model require it.
```

For many enterprise exchanges, pairwise identifiers plus bounded telemetry may be sufficient. For a higher-risk proof, timing/size correlation may make that profile inadequate even with unlinkable cryptography.

The Exchange Plane therefore must not advertise a generic `privacy-preserving` capability. It should qualify the observable/collusion profile it can actually satisfy.

## 7. Status/currentness privacy under collusion

Group status publication can avoid a direct issuer callback per presentation, but privacy degrades when:

- issuer creates one unique list/key per subject;
- verifier reports the presented credential/ref back to issuer;
- status partition is so narrow that the subject is unique;
- cache misses align one-to-one with business actions;
- list URL or key identifier is itself a stable correlator.

Thus:

```text
Offline/group status
!= collusion-resistant status privacy
```

Candidate mitigations to qualify, not mandate:

- sufficiently populated/coarse groups;
- verifier-independent refresh cadence;
- mirrors/CDNs or split relays;
- avoiding unique per-subject status URLs/keys;
- locally cached currentness material within an explicit freshness bound;
- proof systems that reveal only required predicates.

## 8. Relay/gateway split is a trust decomposition, not magic anonymity

RFC 9458 supplies a mature example of split knowledge:

```text
relay sees origin + encrypted content
gateway sees plaintext + relay origin
```

This can materially reduce information available to either actor alone. But:

```text
relay + gateway collusion
→ split-knowledge privacy collapses
```

and traffic analysis remains a separate concern.

For G4, a relay/gateway/broker/adapter must therefore declare what it observes and which non-collusion assumption its privacy profile requires. A gateway cannot claim semantic privacy merely because payload encryption exists.

## 9. Candidate privacy guarantee ladder

Research vocabulary only:

```text
CONTENT_MINIMIZED
PAIRWISE_LINKABLE
SELECTIVELY_DISCLOSED
CRYPTOGRAPHICALLY_UNLINKABLE
TRANSPORT_ORIGIN_SEPARATED
METADATA_BOUNDED
COLLUSION_BOUNDED
```

These are dimensions/profiles, not a monotonic universal maturity scale. A system may have strong payload unlinkability but weak timing privacy, or strong network-origin separation but deliberately pairwise business correlation.

## 10. Proof obligations

Before implementation planning, prove or explicitly bound:

1. every privacy claim names the observer/collusion model under which it holds;
2. cryptographic unlinkability is not promoted into operational unlinkability without metadata analysis;
3. correlation and dedup remain within their declared scopes/horizons;
4. globally stable trace/baggage/routing IDs do not bypass pairwise/selective-disclosure boundaries;
5. issuer/verifier collusion is either resisted for the declared profile or documented as a limitation;
6. relay/gateway non-collusion is explicit where split knowledge is relied upon;
7. effective anonymity/group size is evaluated after configuration/routing/time/size partitioning;
8. unique status URLs, lists, keys or partitions cannot silently create one-to-one handles in a profile claiming group privacy;
9. cache/status refresh behavior does not reveal one business action per lookup when the profile claims bounded activity privacy;
10. error, retry, dead-letter and reconciliation paths obey the same correlation budget;
11. observability retention and access are included in the privacy threat model;
12. replacement transports/providers can state `INCOMPATIBLE` if they expose metadata beyond the required profile;
13. privacy mediation never fabricates business identity, authority or effect semantics;
14. padding/batching/mixing, if ever used, have explicit latency/cost/currentness budgets;
15. a verifier cannot infer authorization merely because it can correlate presentations;
16. erased pairwise mappings are not silently reconstructed from telemetry to improve reconciliation;
17. long-partition reconnect does not automatically widen observer/correlation scope;
18. residual leakage is represented as a limitation rather than omitted from the guarantee.

## 11. Adversarial cases

1. BBS-derived proofs are unlinkable, but the same global trace ID appears in every request.
2. Pairwise refs differ, but all presentations have a unique fixed byte length.
3. Issuer and verifier collude and share presentation timestamps.
4. Relay and gateway are nominally separate services but operated by the same correlation backend.
5. One status list exists per credential, defeating group privacy.
6. A shared list contains many entries, but each tenant uses a unique URL path.
7. Gateway key ID uniquely identifies one customer deployment.
8. Rate limiting applies only to one subject and reveals that subject class to the gateway.
9. Retry cadence fingerprints one runtime after a partition.
10. Dead-letter payload strips business ID but retains globally stable baggage.
11. Broker topic name embeds tenant or occurrence identity.
12. Message size reveals the business action despite encrypted content.
13. CDN hides verifier IP but cache misses align exactly with each presentation.
14. Observability operator and broker operator collude using timestamps and partition offsets.
15. A privacy mediator stores a universal reverse map and becomes the strongest correlator in the platform.
16. Padding reduces size leakage but unique timing remains sufficient to relink.
17. Batching improves timing privacy but violates required currentness/deadline bounds.
18. A reconnect bulk reconciliation exposes a complete occurrence graph that normal operation intentionally kept pairwise.
19. Debug mode adds full identifiers and is accidentally left enabled in production.
20. Provider replacement preserves proof format but changes metadata exposure, silently violating the privacy profile.

## 12. Portability / exit path

Portable semantics are the proof purpose, correlation/dedup scopes, observer/collusion assumptions, currentness bound, required disclosure, observable-metadata budget, residual leakage, retention horizon and evidence limitations.

BBS, OHTTP, status-list encoding, CDN, relay, broker, tracing backend, padding or batching strategy remain realization details. A replacement must be allowed to report `INCOMPATIBLE` when it cannot preserve the declared privacy/correlation profile.

## 13. Deduplication against existing G4 research

This round does not reopen identity architecture, evidence retention, general authorization, security-floor dissemination, general observability or Exchange Plane fundamentals. It extends the existing privacy-preserving federation artifact specifically from **purpose-bounded identifiers/selective proofs** to **collusion and operational metadata surfaces**.

Materially new boundaries:

```text
Cryptographically unlinkable != operationally unlinkable
Payload privacy != telemetry privacy
Split knowledge != collusion resistance
Shared group mechanism != meaningful anonymity set
Privacy guarantee = mechanism + observable surfaces + collusion assumptions
```

## 14. Maturity and next gap

Material delta exists. Family 8 remains `RESEARCH_ACTIVE / NON_EXECUTABLE` and is not saturated.

The next highest-value gap is **privacy versus abuse prevention/rate-cost governance at the Exchange Plane boundary**: determine how quotas, replay defense, rate/cost budgets, fraud/abuse detection and backpressure can operate when identifiers are pairwise/ephemeral and metadata correlation is intentionally minimized, without forcing a global identity graph or allowing privacy mechanisms to become a bypass for resource governance.

No cryptosuite, relay, anonymity network, credential/status framework, broker, gateway, tracing system or provider is selected.