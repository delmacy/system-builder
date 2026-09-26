# G4 Web Desktop — Renewal Cohort Split & Re-anchor Research

Date: 2026-09-23
Status: `RESEARCH_ACTIVE / NON_EXECUTABLE`
Scope: documentary R&D only. No WBS, Work Package, Sprint, TASK, implementation, package/provider adoption, or migration authority is created by this document.

## 1. Question

How can long-term evidence that was economically batched into one timestamp/Merkle cohort later diverge by Client, retention, erasure, crypto policy, residency, provider or trust domain without losing historical proof continuity, forcing unrelated members to retain payload, or turning a shared cryptographic root into shared lifecycle/authority?

This research extends the existing Web Desktop/Application Environment corpus. It does not change the hierarchy `Builder Home/Factory -> Client -> Workspace -> Desktop Sphere -> Application -> Window -> View/Tab/Tool`, and it preserves `Window/session != runtime` and `Automatic != hidden`.

## 2. Literature-grounded constraints

RFC 4998 establishes several facts that materially constrain the model:

- one Archive Timestamp can cover a group of data objects through a Merkle/hash tree;
- a reduced hash tree can preserve proof for one object;
- deletion of one object from the original group does not destroy provability of other members;
- Timestamp Renewal can renew the previous timestamp without accessing archived payload;
- Hash-Tree Renewal is different: when the tree hash becomes insecure, archived data objects and previous evidence must be accessed and hashed again;
- during Hash-Tree Renewal the selected objects are those still present/not deleted, so a successor tree need not preserve the original membership set.

RFC 6283 independently confirms that one timestamp may economically cover many otherwise unrelated archive objects, with reduced proofs per object, and that hash-tree renewal with a new digest requires the archive objects and evidence chain to be processed again.

Therefore the original cohort is best modeled as a historical proof occurrence, not a permanent lifecycle group.

## 3. Core decision candidate

### 3.1 Historical root versus successor renewal set

Define:

- `HistoricalCohortOccurrence`: immutable statement that a set of commitments was bound to root R at time/event T.
- `RenewalMemberBinding`: member-local proof linking one evidence object/envelope to that historical occurrence.
- `SuccessorRenewalSet`: the set of members admissible and available for a later renewal operation.
- `ReanchorOccurrence`: a new preservation occurrence that protects one or more predecessor evidence chains under a new cryptographic/provider/policy context.

Invariants:

`Historical cohort membership != successor renewal membership`.

`Shared historical root != shared future lifecycle`.

`Member removed from successor set != historical membership rewritten`.

`Cohort split != evidence fork`.

`Re-anchor != re-sign original history`.

The historical root remains immutable. Future preservation may branch into multiple successor cohorts.

### 3.2 Split is normal, not exceptional

A cohort may need to split because members diverge in:

- Client/trust domain;
- retention or legal-hold horizon;
- erasure disposition;
- classification/residency;
- crypto-policy floor;
- TSA/archive provider admissibility;
- provider exit/availability;
- payload reachability (hot, cold, offline, deleted);
- algorithm transition deadline;
- evidentiary policy.

No one dimension is globally authoritative. A split planner computes compatible successor sets; it does not transfer business ownership.

## 4. Renewal modes after divergence

### 4.1 Timestamp-chain renewal

When only the timestamp/public-key side needs renewal and the prior evidence chain remains cryptographically suitable, successor preservation can often cover prior timestamp/evidence material without reopening original payload.

This is the cheapest and least coupling-prone mode.

### 4.2 Hash-tree renewal

When the hash used for the tree itself is no longer acceptable, payload/evidence access is required for the objects being renewed. At this point historical batching cannot force continued co-membership.

A new tree can contain only members that are still present and admissible for renewal. Members with different Clients, policies or deadlines may be placed into different new trees.

### 4.3 Member-local re-anchor

A member can be re-anchored independently by binding:

1. the member's canonical/current payload commitment when payload access is required and allowed;
2. its prior Archive Timestamp Sequence / preservation envelope lineage;
3. a new timestamp/root under the successor policy.

This produces continuity without pretending that the new cohort existed historically.

### 4.4 Re-anchor without forbidden payload

If payload was legitimately erased and only a reduced historical proof remains, a future tree-hash failure creates a hard limit: the system must not fabricate a fresh payload hash. Depending on the surviving evidence and policy, disposition may be:

- `HISTORICAL_PROOF_RETAINED_NO_FUTURE_REHASH`;
- `RENEWABLE_VIA_PREDECESSOR_EVIDENCE_ONLY` where standards/policy permit;
- `EVIDENCE_GAP`;
- `UNKNOWN`.

Erasure is not reversed merely to improve preservation convenience.

`Preservation optimization != retention authority`.

## 5. Candidate state machine

`COHORT_ACTIVE`
-> `DIVERGENCE_SIGNAL_OBSERVED`
-> `MEMBER_POLICY_REQUALIFYING`
-> `SUCCESSOR_SET_DERIVING`
-> `RENEWAL_KIND_QUALIFYING`
-> one of:
   - `TIMESTAMP_RENEWAL_ELIGIBLE`
   - `HASH_TREE_RENEWAL_REQUIRED`
   - `MEMBER_REANCHOR_REQUIRED`
   - `HISTORICAL_ONLY`
   - `BLOCKED`
   - `UNKNOWN`
-> `SUCCESSOR_PROOF_BUILDING`
-> `PROVIDER_EFFECT_OBSERVING`
-> `MEMBER_PROOF_PERSISTING`
-> `MEMBER_PROOF_DURABILITY_VERIFYING`
-> `SUCCESSOR_EFFECTIVE`

Partial completion remains explicit. A successful new root is not enough until each intended member has a durable, independently exportable proof binding.

`ROOT_OK != EVERY_MEMBER_OK`.

## 6. Erasure and retention divergence

A Client's erasure of its payload does not invalidate another member's reduced proof. RFC 4998's reduced-tree model explicitly supports continued provability of remaining members after deletion of another object.

The SB must therefore avoid two opposite errors:

1. retaining Client B payload solely because Client A needs long-term renewal;
2. deleting shared proof material needed by A because B exited or erased its own payload.

The unit of retention accounting is consequently not the whole cohort. It is the member binding plus shared root material with reference accounting.

Candidate invariant:

`Member payload retention != root/proof retention != peer payload retention`.

Shared root bytes may remain while peer identity/business metadata is minimized.

## 7. Crypto-policy divergence

Different members may receive different algorithm deadlines due to classification, jurisdiction, risk appetite or policy epoch. Therefore:

`One cohort root != one permanent crypto policy`.

A successor planner groups only members whose effective crypto policy, deadline, trust/provider constraints and payload availability are compatible for the particular renewal kind.

Policy provenance remains visible in Control Center:

`Declared policy -> inherited policy -> overrides -> Effective policy -> observed renewal evidence`.

No adapter may normalize two algorithm policies into equivalence merely because the provider accepts both.

## 8. No stop-the-world barrier

The system must not require every historical member to be reachable before any member can renew. Such a barrier would let one offline/deleted/unreachable member endanger unrelated evidence.

Required property:

`Minority member unavailable != cohort-wide renewal blockade`.

However, a member whose own payload is required for hash-tree renewal cannot be marked renewed merely because peers succeeded.

This implies member-local progress and cohort-level aggregation:

- `SUCCESSOR_ROOT_PENDING`;
- `MEMBER_READY`;
- `MEMBER_BLOCKED_PAYLOAD_UNAVAILABLE`;
- `MEMBER_POLICY_CONFLICT`;
- `MEMBER_PROOF_DURABLE`;
- `MEMBER_UNKNOWN`.

Aggregates never strengthen member evidence.

## 9. Application Portfolio Matrix delta

The existing seven integration modes remain valid; no single mode is forced.

| Capability | Preferred modes | Security/authority/currentness | Lifecycle/replaceability/lock-in |
|---|---|---|---|
| Historical/member proof inventory | Native SB | Client-scoped authority; member-local currentness | High portability; canonical semantic model stays provider-neutral |
| Merkle/reduced-proof verification | Native SB / Hybrid | Pure verification does not grant effect authority | Prefer standard formats; library replaceability required |
| TSA/archive execution | API-backed / Hybrid / Deep-link | Provider effect requires qualified binding and observed result | Provider replaceable if proof export is durable |
| Cohort split planner | Native SB | Computes compatibility; does not own retention/erasure authority | Shared foundation; policy remains domain-owned |
| Hash-tree renewal | Hybrid / API-backed | Requires payload-access authorization and crypto-policy qualification | Avoid provider-only opaque membership semantics |
| Member re-anchor | Native SB + API-backed/Hybrid | Re-anchor authority is member/Client scoped | Must export predecessor lineage + successor proof |
| Offline/cold archive retrieval | Hybrid / Native bridge | Retrieval capability != retention authority | Native bridge only when local device/media access requires it |
| Provider forensic/recovery UI | Deep-link / Embedded qualified | No inherited SB authority; explicit currentness | Reuse mature tools rather than clone them |
| HSM/KMS operations | API-backed / Hybrid / Deep-link / Native bridge | SecretRef != secret; key use/rotation separately authorized | Preserve key/provider portability where feasible |

Additional matrix criteria introduced here: successor-set independence, historical-root immutability, member-proof exportability, retention independence, erasure independence, hash-tree-renewal payload reachability, policy divergence, provider-exit re-anchor, partial/unknown fidelity, cross-Client disclosure, cost allocation and stop-the-world avoidance.

## 10. Desktop/Application Environment implications

### Desktop taxonomy

No taxonomy change. Desktop Spheres remain guided functional contexts. Renewal management belongs primarily to Operations/Security-oriented spheres, not to the desktop shell itself.

### Observatory vs Pinned Monitoring Surface vs Operations Desktop

- **Desktop Observatory**: read-oriented projection of cohort risk, deadlines, divergence and member coverage.
- **Pinned Monitoring Surface**: small persistent signals such as `3 critical members require split renewal`; no management authority.
- **Operations Desktop**: qualified operational application context for split/re-anchor actions.

`Observatory != Monitoring Surface != Operations Desktop` remains binding.

### Window Manager / multi-display

A renewal Window is an interaction session only. Closing/moving it does not cancel durable renewal. Secondary displays can project state but do not become authority. Stale surfaces must expose observation/currentness age; a stale `ROOT_OK` must not mask a later member failure.

### Application Manager

`Discovered TSA != Verified TSA != Adopted TSA != Authorized for this Client/policy`.

Provider adoption and renewal authorization remain separate lifecycle transitions. A provider can be adopted generally yet inadmissible for one successor cohort due to residency, licensing, crypto policy or disclosure.

### Control Center

Must eventually be able to explain, without hidden automation:

- effective isolation scope;
- cohort/successor policy provenance;
- provider binding provenance;
- algorithm policy and deadline;
- retention/erasure constraints;
- payload reachability class;
- why a member split or remained grouped;
- observed versus desired renewal state.

### Declarative deployment / auto-binding / hosting

A declarative service definition may request `timestamping`/`archive-preservation` capabilities semantically. Provider YAML/artifacts remain projections. Auto-binding may choose among qualified providers only when compatibility/security/licensing/residency/authority/currentness constraints are satisfied and the effective choice is observable.

`Register != Deploy`; `Automatic != hidden`; `YAML/provider artifact != semantic definition`.

### Vault/environment binding

Only `SecretRef`/key references flow through bindings. Cohort metadata must not require disclosure of peer Client identity to providers beyond what the chosen provider protocol strictly requires.

### External mature tool reuse

Mature TSA/PKI/HSM/archive consoles should be reused by API/Hybrid/Deep-link rather than rebuilt wholesale. Native SB value lies in semantic policy, provenance, portfolio qualification, member-local lifecycle and cross-provider proof continuity.

### Proprietary editor family/shared primitives

No new domain editor is justified. Existing shared editor primitives should support provenance inspector, policy-diff, member-status table, proof-lineage viewer, conflict/UNKNOWN rendering and accessible textual equivalents. Tree visualization is optional projection, not the only interaction mode.

### Workflow/View/Form/Component bridge

A renewal workflow activity may open a View/Form, but:

`View != Workflow Activity`;
`Form != Workflow State`;
`Button != Domain Command`.

UI controls issue explicit commands such as `RequestMemberReanchor`; they do not become semantic state transitions merely by being clicked.

## 11. Componentization complexity map delta

### C0 — primitives / low complexity

- `RenewalMemberRef`
- `HistoricalCohortRef`
- `SuccessorRenewalSetRef`
- `ReanchorOccurrenceRef`
- `RenewalKind`
- `MemberRenewalDisposition`

### C1 — reusable semantic compounds

- member proof metadata/provenance;
- payload reachability classification;
- crypto-policy compatibility vector;
- retention/erasure compatibility vector;
- provider qualification vector.

### C2 — stateful foundations

- `SuccessorSetDerivationBoundary`;
- `RenewalKindQualificationBoundary`;
- `MemberProofContinuityBoundary`;
- `HistoricalRootReferenceAccountingBoundary`;
- `MemberPayloadReachabilityBoundary`;
- `RenewalPartialProgressBoundary`;
- `ProviderExitReanchorBoundary`.

### C3 — orchestration/high complexity

- `CohortSplitPlannerBoundary`;
- `MemberReanchorBoundary`;
- `HashTreeRenewalCoordinatorBoundary`;
- `MinorityCriticalRenewalBoundary`;
- `CrossClientIsolationBoundary`;
- `RenewalDurabilityReconciliationBoundary`;
- `RenewalCostAllocationBoundary`.

These foundations reduce duplication across Evidence, Security, Documents, Storage, Backup/DR, Operations and Control Center. They must not own legal retention decisions, business evidentiary weight, domain erasure policy, workflow compensation or publication/deployment authority.

## 12. Performance/resource obligations

No numeric thresholds are invented. Future measurement must include:

- payload bytes reread for hash-tree renewal;
- proof bytes retained per member;
- root/shared-proof reference cardinality;
- hashing CPU and memory;
- cold/offline retrieval latency/cost;
- TSA/API request volume;
- egress and provider costs;
- successor-set cardinality and split amplification;
- minimum deadline slack for critical members;
- blocked/unknown minority count;
- member-proof durability lag;
- provider concentration and algorithm-family concentration.

A split can increase TSA requests while decreasing lifecycle coupling. Optimization must therefore compare total preservation risk/cost, not request count alone.

## 13. Accessibility and small-screen equivalence

Every tree/cohort visualization requires an equivalent structured textual/table representation exposing:

- member identity within authorized scope;
- historical root identity;
- successor set;
- renewal kind;
- deadline;
- currentness;
- payload reachability;
- proof durability;
- blocking reason;
- provenance.

Keyboard and screen-reader users must be able to inspect and initiate the same authorized commands without spatial/tree manipulation. Small-screen mode may serialize navigation but cannot collapse semantic distinctions.

## 14. Failure/recovery obligations

- lost provider ACK => reconcile, do not blindly duplicate;
- new root persisted but one member proof missing => root success/member partial;
- member proof persisted but root durability unknown => not effective;
- crash during split => predecessor historical proof remains immutable; successor attempts are resumable/reconcilable;
- provider outage => unaffected members may move to another qualified provider;
- payload becomes unavailable after planning => member requalification required;
- policy changes during renewal => desired/observed/effective remain separate; no silent mutation of in-flight occurrence;
- restore from stale backup must not resurrect superseded cohort authority or erase successor lineage.

## 15. Adversarial proof matrix

The future architecture must prove at least these cases:

1. Client A retains 20 years; Client B erases after 30 days.
2. A and B shared the historical root; B payload is deleted; A remains verifiable.
3. Tree hash weakens after B erasure; B is not silently marked renewed.
4. A can rehash/re-anchor without requiring B payload.
5. B historical membership is not rewritten out of the old root.
6. A policy moves to algorithm X; B remains temporarily on Y.
7. Provider P exits while only a subset needs immediate renewal.
8. Root timestamp succeeds but A reduced proof is lost.
9. Root durable, member proof durability unknown.
10. Member proof durable, provider effect currentness unknown.
11. 9,999 members renew; one critical member is blocked.
12. Aggregate UI must not display 100% safe for case 11.
13. Offline member returns after peers split and renewed.
14. Late legal hold applies to one member only.
15. Erasure request arrives during successor-tree construction.
16. Client boundary changes; shared historical proof must not transfer authority.
17. Residency change makes old provider inadmissible for new renewal only.
18. Provider internally batches globally but SB sees member-local proof only.
19. Cohort identifier leaks peer correlation through telemetry.
20. Secondary display remains stale on predecessor state.
21. Application provider is installed/adopted but not authorized for this Client.
22. Auto-binding chooses cheapest provider that violates residency.
23. Hash-tree renewal is attempted without required payload access authority.
24. Timestamp renewal is incorrectly used although tree digest is weak.
25. Historical evidence format/parser becomes unavailable.
26. Provider-specific proof cannot be exported during exit.
27. Two successor cohorts independently preserve the same predecessor member; duplicate preservation must not create duplicate business identity.
28. Crash after provider effect but before local ACK.
29. Retry preserves renewal occurrence/effect identity rather than minting an unrelated history.
30. UNKNOWN member is not counted as successful by cost/performance aggregation.
31. Shared root reference is garbage-collected while another member still depends on it.
32. One member's lifecycle action cannot delete another Client's proof material.

## 16. Contradictions resolved / intentionally preserved

Resolved:

- **"shared root means shared future"** — false; successor membership can diverge.
- **"erasing one member breaks all proofs"** — false for properly retained reduced proofs/root material.
- **"one successful new root means every member renewed"** — false; member proof durability is independent.
- **"batching requires stop-the-world renewal"** — false; successor sets can be independently derived.

Intentionally preserved:

- if the tree digest weakens and a member's payload has been legitimately erased, full hash-tree renewal for that member may be impossible. The architecture must preserve `EVIDENCE_GAP/HISTORICAL_ONLY/UNKNOWN` rather than fabricate continuity.
- privacy and maximum batching efficiency remain a trade-off. Cross-Client batching is not made default merely because it reduces TSA requests.

## 17. Saturation and next gap

Current saturation after this study:

- Web Desktop hierarchy/taxonomy/window/multi-display: **high conceptual saturation**;
- Application Portfolio/Application Manager/Control Center: **medium-high**;
- renewal cohort privacy/isolation: **medium-high conceptual**;
- cohort split semantics: **medium-high conceptual**;
- member-local re-anchor: **medium**;
- erased-payload behavior under future tree-hash failure: **medium, with irreducible evidence-gap cases**;
- provider-exit portability: **medium**;
- performance/resource budgets: **medium-low empirically**.

Next material vector: **proof garbage collection and shared-root reference accounting after repeated cohort splits/re-anchors**. The remaining risk is deleting predecessor/root/proof material too early, or retaining it forever because lineage reachability is not formally modeled. Research should determine safe liveness/reachability criteria, compaction rules, provider-exit behavior and how `UNKNOWN` offline archives block or qualify collection without creating a global stop-the-world oracle.

## 18. Sources

- RFC 4998 — Evidence Record Syntax (ERS), especially Sections 1.2, 4 and 5.
- RFC 6283 — XML Evidence Record Syntax (XMLERS), especially generation, hash-tree batching and renewal sections.

No source in this document creates implementation authority.