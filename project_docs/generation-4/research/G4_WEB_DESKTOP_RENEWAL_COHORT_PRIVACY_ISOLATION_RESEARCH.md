# G4 Web Desktop — Renewal Cohort Privacy & Isolation Research

Date: 2026-09-23
Status: `RESEARCH_ACTIVE / NON_EXECUTABLE`
Scope: documentary P&D only in Generation 4. No product implementation, WBS, Work Package, Sprint, TASK, migration, package/provider adoption or architecture replacement is authorized.

## 1. Question, deduplication and scope

This slice continues the historical-evidence/crypto-agility line at the unresolved boundary: **how can long-term-evidence renewal gain Merkle/TSA batching economics without making one Client's evidence lifecycle, privacy, erasure, retention or failure authority depend on another Client?**

The repository remains authoritative. The constitutional hierarchy remains:

`Builder Home/Factory -> Client -> Workspace -> Desktop Sphere -> Application -> Window -> View/Tab/Tool`.

3D remains an optional projection/application, not navigation foundation. `Builder != Runtime`; published runtimes remain autonomous.

This slice does not reopen established distinctions: `Client != Workspace != Desktop != Application != Window`; `Module != Capability != Application`; `Window/session != runtime`; `Install != Adopt`; `Register != Deploy`; `Discovered != Verified`; `SecretRef != secret value`; `Policy != configuration`; `Desired != Observed != Effective`; `Automatic != hidden`; `Adapter normalization != fabricated semantic equivalence`.

Additional boundaries from this slice:

- `Renewal cohort != authority cohort`.
- `Shared timestamp root != shared evidence ownership`.
- `Merkle membership proof != permission to disclose cohort membership`.
- `Batch failure != every member semantically failed`.
- `Member erasure != shared root erasure`.
- `Shared proof anchor != shared retention policy`.
- `Same renewal deadline != same disclosure domain`.
- `Provider-side batching != semantic cross-Client batching`.
- `Cost allocation != authority allocation`.
- `Cryptographic aggregation != tenant/trust-domain collapse`.

## 2. External evidence and contradictory lessons

### 2.1 RFC 6283: batching unrelated archive objects is explicitly an economic optimization

RFC 6283 states that timestamping many archived objects can be expensive/time-consuming and that an LTA may collect many otherwise unrelated archive objects into one hash tree, timestamp one root, then retain reduced hash-tree material sufficient to bind each object to that timestamp. This strongly supports batching as a legitimate preservation optimization.

Sources:
- https://www.rfc-editor.org/rfc/rfc6283
- https://datatracker.ietf.org/doc/html/rfc6283

Portable lesson: **a shared root can amortize a TSA operation without semantically merging the protected objects**.

### 2.2 RFC 4998: reduced hash trees preserve object-local proof

RFC 4998 defines reduced hash trees as the sibling-hash material necessary to prove one data object's membership under a timestamped root. The verifier need not retain the entire cohort tree merely to validate one member.

Source:
- https://datatracker.ietf.org/doc/html/rfc4998

Portable lesson: **proof extraction can be member-local even when anchoring was shared**. This is useful for Client isolation, export and provider exit.

### 2.3 RFC 6283 creates a privacy tension, not a privacy solution

XMLERS defines an Archive Time-Stamp as relating to a data-object group only when it relates to every object in that group and no other object. Verification may therefore need group-membership semantics when the application claims a group rather than an individual object. The standard does not define multi-tenant confidentiality or tenant-isolation policy.

Portable lesson: **ERS/XMLERS permits aggregation but does not prove that arbitrary cross-tenant aggregation is privacy-safe**. G4 must add its own isolation/disclosure law rather than infer one from Merkle cryptography.

### 2.4 Shared proof material can disclose structure even without plaintext

A reduced Merkle proof necessarily carries sibling hash material and tree-position/structure information sufficient to reconstruct the root path. Hashes are not automatically anonymous: low-entropy or externally known candidate objects can still support correlation tests, and operational metadata such as cohort time, provider, tree size or renewal occurrence can create linkability.

Portable lesson: **`digest-only != disclosure-free`**. Privacy review applies to proof metadata, not only payload.

## 3. Candidate objects

```text
RenewalCohort
  cohortId
  cohortProfileRef
  memberCommitmentSetRef
  batchingScope
  disclosureClass
  ClientIsolationMode
  trustDomainRef?
  renewalKind
  providerBindingRef
  cryptoProfileRef
  deadlineWindow
  rootCommitment
  rootRenewalOccurrenceRef
  durabilityDisposition
  currentnessDisposition
  provenance

RenewalMemberBinding
  memberBindingId
  ClientRef
  EvidencePreservationEnvelopeRef
  memberCommitment
  canonicalizationProfileRef
  reducedProofRef
  rootCommitmentRef
  renewalOccurrenceRef
  retentionDisposition
  erasureDisposition
  exportDisposition
  currentnessDisposition
  provenance

RenewalCohortIsolationPolicy
  permittedBatchingScopes
  prohibitedDisclosureClasses
  crossClientMode
  crossTrustDomainMode
  metadataMinimizationRules
  proofExportRules
  providerVisibilityRules
  costAllocationRuleRef
  failureIsolationRuleRef
  erasureLawRef
  retentionLawRef
  authorityBasisRefs
```

These are research vocabulary candidates, not committed schemas.

## 4. Findings

### F1 — Default semantic cohort scope should be Client-qualified

The safest default is `WITHIN_CLIENT`, optionally narrower by trust/classification/retention domain. Cross-Client batching may be physically/economically possible, but requires an explicit privacy/isolation profile and must not become the semantic identity of the renewal operation.

`Shared infrastructure != shared evidence authority`.

### F2 — Provider-side aggregation can remain opaque to SB

A TSA or preservation provider may internally batch many requests. SB does not need to know or model those foreign members if the provider returns a qualified member-local timestamp/proof satisfying the contract.

`Provider batches globally != SB cohort is global`.

This is a major anti-lock-in and privacy advantage: economics can sometimes be delegated without exposing cross-Client membership to the Builder.

### F3 — Cross-Client SB-managed batching needs a non-disclosure contract

If SB itself constructs a shared root across Clients, the cohort becomes a privacy-sensitive structural artifact. At minimum, ordinary Client surfaces must not expose peer Client identities, member counts attributable to peers, sibling-object metadata, retention state, application identity or business classification.

A Client receives only the proof material required for its own member plus root-level public/provider evidence.

### F4 — Reduced proof portability is a first-class requirement

Each `RenewalMemberBinding` must remain independently exportable/verifiable after the cohort scheduler, another Client, or even SB itself is unavailable. Otherwise batching violates runtime/evidence portability.

`Cohort service unavailable != historical evidence unverifiable`.

### F5 — Member erasure does not require deleting a historical root

A Merkle root/timestamp can remain valid evidence that some committed value existed without retaining the erased payload. Erasure eligibility is evaluated against the member's retained proof metadata, legal/policy obligations and linkability risk.

`Payload erased != root invalidated`.

However, keeping a member commitment may itself be prohibited or privacy-sensitive. In that case the system records proof degradation rather than retaining forbidden metadata silently.

### F6 — One Client cannot pin another Client's payload retention merely because they shared a root

Hash-tree renewal can require access to protected objects when the tree hash itself weakens. A shared cohort must not imply that Client A's long retention forces Client B to retain payload beyond B's authority/policy.

Therefore future hash-tree renewal may **split** an old cohort into new member-local or policy-compatible successor cohorts.

`Shared predecessor root != shared successor cohort`.

### F7 — Timestamp renewal and hash-tree renewal have different isolation consequences

Timestamp renewal can often renew the prior timestamp/evidence without rereading every payload. Hash-tree renewal may require rehashing protected data/evidence and therefore reopens data-access, residency, erasure and cold-storage boundaries.

A cohort safe for timestamp renewal is not automatically safe for hash-tree renewal.

### F8 — Cohort membership must not create shared failure authority

Provider outage, root-generation failure or durability uncertainty affects scheduling/evidence status, but it does not authorize another Client to change policy, retry budget, provider binding, retention or erasure for peers.

Failures are projected member-locally with a cohort-level cause reference.

### F9 — Root success is insufficient for member success

A root timestamp may succeed while a member binding/proof is not durably stored, is associated with the wrong canonicalization profile, or cannot later be exported. Preserve:

`ROOT_TIMESTAMPED != MEMBER_PROOF_DURABLE != MEMBER_RENEWAL_EFFECTIVE`.

### F10 — Membership ordering/canonicalization must be deterministic without becoming identity authority

Tree construction needs deterministic member commitment handling, but sort position/tree position is not business identity. Cohort rebuild or provider substitution may use a different tree shape while preserving member evidence through a new renewal lineage.

### F11 — Cross-Client batching can create timing and volume side channels

Even when peer identities are hidden, observable cohort cadence, tree size, latency, proof shape or provider request volume may reveal activity. Isolation policy therefore names what metadata is exposed to Clients, operators, providers and telemetry consumers.

### F12 — Cost allocation remains accounting, not semantic ownership

Shared TSA/provider cost may be apportioned by member count, bytes, urgency or policy, but cost allocation cannot grant mutation authority or reveal peer membership unnecessarily.

### F13 — Telemetry must aggregate without becoming a membership oracle

Observatory may show platform-level renewal throughput/cost/provider health. Client-scoped views show only the Client's members and appropriately coarse shared-provider facts. Raw cohort identifiers spanning Clients are not ordinary Client-visible correlation keys.

### F14 — Application Manager does not own preservation authority

A TSA/archive integration can be discovered, installed, adopted and qualified through Application Manager lifecycle, but evidence membership/retention remains owned by the relevant preservation/domain authority.

`Install provider != adopt provider != qualify provider != authorize cross-Client batching`.

### F15 — Control Center owns policy projection/co-ordination, not evidence truth

Control Center can expose inherited batching policy, provenance, effective scope, provider selection, privacy mode, costs and proof degradation. It does not become canonical evidence owner.

### F16 — Auto-binding must preserve isolation predicates

Automatic provider/cohort selection is admissible only among bindings satisfying Client, trust-domain, residency, classification, licensing, algorithm, retention and disclosure constraints. The UI must explain why a binding/cohort was selected.

`Automatic != hidden`.

### F17 — External mature tooling should be reused at provider-specialist boundaries

SB should not rebuild full TSA/PKI/HSM/archive consoles. Native SB value is semantic intent, policy/provenance, member evidence lineage, qualification, scheduling and portability. Provider-specific certificate/HSM/archive forensics remain API-backed/Hybrid/Deep-link, with Native bridge only where local hardware genuinely requires it.

### F18 — Window/session state remains irrelevant to durable renewal

Closing a renewal window, browser tab or secondary display does not cancel a durable renewal attempt or release proof obligations. A restored session rehydrates projection from durable state.

### F19 — Accessibility and small-screen equivalence require semantic summaries

A Merkle/tree visualization may aid experts but cannot be the only representation. Keyboard/screen-reader/small-screen flows need textual member status, root status, isolation scope, deadline, provider, proof durability and failure cause. `3D/graphical proof view != required interaction mode`.

### F20 — No new desktop taxonomy is required

Existing separation remains stable: Observatory observes cohort/provider risk; Pinned Monitoring Surface signals deadline/failure; Operations Desktop performs qualified renewal/reconciliation actions. A monitoring widget is not a management application.

## 5. Application Portfolio Matrix delta

| Capability | Preferred modes | Security / authority | UX/currentness | Lifecycle/replaceability/lock-in |
|---|---|---|---|---|
| Evidence inventory & member lineage | Native SB | Client-qualified semantic authority | explain proof/currentness | portable canonical refs |
| Renewal scheduler/cohort derivation | Native SB | no cross-Client authority creation | deadline/criticality visible | replaceable execution backend |
| TSA/archive timestamp execution | API-backed / Hybrid / Deep-link | provider qualification required | provider status != member effect | avoid provider-only evidence |
| Merkle proof generation/verification | Native SB or qualified library | deterministic/profile-bound | member-local verification | export reduced proofs |
| PKI/cert/revocation specialist admin | API-backed / Hybrid / Deep-link | external authority remains explicit | specialist recovery UX | do not rebuild mature console |
| HSM/KMS | API-backed / Hybrid / Deep-link / Native bridge | hardware/key authority explicit | currentness + custody visible | bridge only when local hardware requires |
| Offline archive renewal | Hybrid / Native bridge | offline authority/currentness bounded | explicit stale/unknown | portable bundles/proofs |
| Provider-exit reanchor | Native semantic orchestration + API/Hybrid | no silent semantic downgrade | migration/proof gaps explicit | primary anti-lock-in path |
| Cross-Client economic batching | Native policy + provider/API execution, only if qualified | no peer authority/disclosure | Client-local member projection | optional; must be splittable |

Mode selection remains task-specific; no single mode is forced.

## 6. Componentization complexity map for future decomposition

No WBS is materialized here.

### C0 — leaf/value primitives (low)

`ClientRef`, `EvidenceRef`, `CohortRef`, `MemberCommitment`, `RootCommitment`, `ReducedProofRef`, `CryptoProfileRef`, `DisclosureClass`, `BatchingScope`, `RenewalKind`, `DeadlineDisposition`.

### C1 — reusable semantic compounds (low-medium)

`RenewalMemberBinding`, `CohortIsolationPolicy`, `ProofExportDescriptor`, `ProviderQualificationRef`, `RenewalDeadline`, `MemberCurrentnessDisposition`.

### C2 — reusable inspectors/projections (medium)

member proof inspector; cohort isolation inspector; deadline/risk list; provider concentration panel; proof export inspector; cost/currentness panel; accessible textual proof view.

### C3 — shared foundations (high leverage / medium-high complexity)

- `RenewalCohortDerivationBoundary`
- `RenewalCohortIsolationBoundary`
- `MemberProofExtractionBoundary`
- `MemberProofDurabilityBoundary`
- `CrossClientDisclosureBoundary`
- `CohortSplitRenewalBoundary`
- `TimestampVsHashTreeRenewalQualificationBoundary`
- `RenewalTelemetryMinimizationBoundary`
- `ProviderOpaqueBatchingBoundary`
- `ProofExportPortabilityBoundary`
- `RenewalCostAllocationBoundary`
- `CohortFailureProjectionBoundary`

These foundations reduce cost across Documents, Data, Security, Backup/DR, Control Center and Operations.

### C4 — application/domain-specific (must remain specific)

legal retention classification; business acceptance of evidence; Client-specific erasure law; workflow compensation; publication/deployment authority; regulated evidentiary weight; provider-specialist forensic procedures.

`Shared primitive != shared business ownership`.

## 7. Adversarial proof matrix

Future contracts must survive at least these cases:

1. two Clients share a root; one erases its payload;
2. one Client has 20-year retention and another 30-day retention;
3. tree hash weakens after one member payload is legally erased;
4. TSA root succeeds but one member proof is lost;
5. provider returns root ACK before durable member evidence exists;
6. reduced proof leaks cohort size/activity pattern;
7. low-entropy member commitment permits dictionary/correlation testing;
8. raw cross-Client cohort ID leaks through telemetry;
9. one Client attempts to enumerate peer members;
10. Client A provider migration while Client B remains;
11. provider exit requires reanchor of only a subset;
12. timestamp renewal can proceed but hash-tree renewal cannot access cold payload;
13. member canonicalization profile is missing;
14. cohort rebuild changes tree ordering;
15. one member is `UNKNOWN` while root is valid;
16. provider outage near deadline for minority-critical member;
17. automatic binding selects cheaper but residency-incompatible TSA;
18. licensing forbids multi-tenant use despite technical compatibility;
19. external archive batches globally without exposing peer membership to SB;
20. Application Manager uninstall occurs while historical member proofs remain required;
21. Window closes during durable renewal;
22. secondary display shows stale `SAFE` after member durability failure;
23. Observatory aggregates cross-Client metrics too finely;
24. cost allocation reveals another Client's volume;
25. trust-domain rotation splits an existing cohort;
26. crypto-policy deprecates only one member's admissible profile;
27. erasure removes commitment metadata and degrades historical proof;
28. provider API changes reduced-proof format;
29. embedded external UI attempts shell authority inheritance;
30. `9,999 ROOT_OK + 1 MEMBER_PROOF_UNKNOWN` is incorrectly shown as 100% renewed.

## 8. Required closure-target impact

This slice does not reopen the Web Desktop ADR, desktop taxonomy, Window Manager or multi-display model; they remain stable. It materially refines:

- Application Portfolio Matrix;
- external-app integration/security matrix;
- Application Manager qualification/lifecycle boundaries;
- Control Center policy/inheritance/provenance;
- Vault/environment auto-binding constraints;
- monitoring/telemetry privacy;
- accessibility/small-screen equivalence;
- performance/resource budgets;
- failure/recovery of durable renewal sessions;
- adversarial proof matrix;
- componentization complexity map.

Workflow/View/Form/Component remains unchanged: a renewal View is not a workflow activity; a Form is not a renewal state; a Button is not a domain command. Proprietary editor foundations should reuse shared inspectors/status/currentness/provenance primitives rather than invent a renewal-specific interaction grammar.

## 9. Performance/resource budget dimensions

Do not invent thresholds. Future measurement must cover:

- members/root and proof bytes/member;
- root-build hashing CPU/memory;
- member-proof extraction latency;
- TSA requests avoided by batching;
- provider request/cost concentration;
- proof durability lag;
- cold-media bytes read for hash-tree renewal;
- split-cohort amplification;
- telemetry cardinality after Client-safe aggregation;
- export/reanchor throughput;
- deadline slack for minority-critical members;
- privacy-preserving batching overhead.

A cheaper root is not a win if proof export, privacy, retention independence or future hash-tree renewal becomes materially worse.

## 10. Saturation and next vector

Maturity after this slice:

- Web Desktop hierarchy/taxonomy/window/multi-display: **high conceptual saturation**;
- Application Portfolio/Application Manager/Control Center: **medium-high**;
- renewal cohort economics: **medium-high conceptual**;
- member-local proof portability: **medium-high**;
- cross-Client privacy/isolation: **medium**;
- hash-tree-renewal split semantics: **medium**;
- provider-opaque batching: **medium-high**;
- telemetry side-channel controls: **medium**;
- empirical performance/resource thresholds: **medium-low**.

Material gaps remain; research is not complete.

Next vector: **cohort splitting/re-anchoring under erasure, retention divergence and crypto-policy divergence** — especially how a historical shared root can remain verifiable while successor renewals split into independently governed Client/trust/retention cohorts, without rereading prohibited payload, losing member proof continuity, or creating a stop-the-world renewal barrier.
