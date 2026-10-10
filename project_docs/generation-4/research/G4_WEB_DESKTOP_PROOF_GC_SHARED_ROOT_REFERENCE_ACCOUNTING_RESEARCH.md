# G4 Web Desktop — Proof GC & Shared-Root Reference Accounting Research

Date: 2026-09-23
Status: `RESEARCH_ACTIVE / NON_EXECUTABLE`
Scope: documentary R&D only. No WBS, Work Package, Sprint, TASK, implementation, package/provider adoption, or migration authority is created by this document.

## 1. Question

After repeated renewal-cohort splits, member-local re-anchors, provider exits, erasures and retention changes, when may predecessor roots, reduced proofs, validation material and renewal-chain nodes be compacted or garbage-collected without breaking any still-valid historical proof, restore/audit path, legal hold, offline archive or future renewal?

This extends the Web Desktop/Application Environment corpus while preserving `Builder Home/Factory -> Client -> Workspace -> Desktop Sphere -> Application -> Window -> View/Tab/Tool`, `Window/session != runtime`, `Automatic != hidden`, and `Adapter normalization != fabricated semantic equivalence`.

## 2. Literature-grounded constraints

RFC 4998 and RFC 6283 establish that one timestamped Merkle root may protect many archive objects, while each object can retain a reduced hash tree sufficient for member-local proof. Deletion of one object does not invalidate the provability of other members. They also distinguish timestamp renewal from hash-tree renewal: when the tree digest itself becomes weak, archive objects and predecessor evidence participate in the successor protection.

RFC 9162 is not an ERS retention specification, but its Certificate Transparency model provides a useful contradictory reference: inclusion proof and append-only consistency proof are distinct artifacts, and a signed tree head alone does not prove membership of a particular leaf. This reinforces that `root retained` and `member proof retained` are different liveness conditions.

Therefore byte reachability, semantic proof reachability and future-renewal reachability cannot be collapsed into one reference count.

## 3. Core decision candidate

Define separate durable identities:

- `ProofNode`: immutable proof material such as historical root, timestamp token, reduced-tree sibling set, validation-context artifact, predecessor-chain digest or renewal occurrence.
- `ProofDependencyEdge`: typed dependency from a live evidence claim/member/renewal to a ProofNode.
- `ProofReachabilityClaim`: qualified statement that a ProofNode remains required for a named proof/recovery/audit/renewal purpose.
- `SharedRootReferenceAccount`: aggregate projection of independently owned references to shared proof material; it is not shared authority.
- `ProofGCIntent`: proposed removal/compaction operation with scope and policy provenance.
- `ProofGCSafetyClaim`: evidence that removal cannot break any currently admitted proof path within declared coverage.

Invariants:

`Shared proof bytes != shared authority`.

`Root reference count != member proof liveness`.

`Byte unreachable != semantically disposable`.

`No known reference != proof of no reference`.

`Compacted != forgotten`.

`GC eligible here != globally absent everywhere`.

`Offline path UNKNOWN != safe to delete`.

## 4. Three reachability dimensions

### 4.1 Verification reachability

Can a retained evidence object still be verified from member binding through predecessor evidence to a qualified trust/timestamp context?

A historical root can remain live even when only one member survives. Conversely, keeping the root alone is insufficient if the surviving member's reduced proof has been lost.

### 4.2 Renewal reachability

Can a future renewal still be performed under the applicable crypto policy? Timestamp renewal may depend mainly on predecessor timestamp/evidence material; hash-tree renewal can additionally require current payload/evidence access.

A node that is unnecessary for verification today may still be required by an admitted future renewal procedure. GC therefore evaluates the declared preservation horizon and renewal kind, not only current verifier success.

### 4.3 Recovery/audit reachability

Legal hold, historical audit, DR/offline media, provider-exit verification and forensic inspection may retain independent proof paths. These do not become business authority, but they can keep proof material live.

`Historical inspection need != new-effect authority` remains binding.

## 5. Shared-root reference accounting

Reference accounting is per semantic dependency, not per filesystem/database pointer. Candidate edge classes:

- `MEMBER_VERIFICATION_REQUIRES`;
- `RENEWAL_CHAIN_REQUIRES`;
- `HASH_TREE_RENEWAL_MAY_REQUIRE`;
- `VALIDATION_CONTEXT_REQUIRES`;
- `LEGAL_HOLD_REQUIRES`;
- `RECOVERY_PATH_REQUIRES`;
- `PROVIDER_EXIT_EXPORT_REQUIRES`;
- `OFFLINE_ARCHIVE_MAY_REQUIRE`;
- `UNKNOWN_REACHABILITY`.

The account may summarize counts for operations/UX, but destructive decisions use qualified edges and coverage, not a scalar `refCount`.

Cross-Client shared roots are especially constrained: Client A may keep a root alive without revealing Client B's identity. A UI may state `shared proof material retained by another qualified obligation` without disclosing the peer.

## 6. GC safety qualification

Candidate lifecycle:

`GC_CANDIDATE`
-> `DEPENDENCY_DISCOVERY`
-> `VERIFICATION_REACHABILITY_CHECK`
-> `RENEWAL_REACHABILITY_CHECK`
-> `RETENTION_HOLD_CHECK`
-> `RECOVERY_OFFLINE_COVERAGE_CHECK`
-> `CURRENTNESS_CHECK`
-> one of:
   - `GC_ADMISSIBLE`
   - `GC_BLOCKED_LIVE_REFERENCE`
   - `GC_BLOCKED_HOLD`
   - `GC_BLOCKED_FUTURE_RENEWAL`
   - `GC_BLOCKED_UNKNOWN_PATH`
   - `GC_PARTIAL`
-> `GC_EFFECT_REQUESTED`
-> `GC_EFFECT_OBSERVING`
-> `POST_GC_PROOF_VERIFYING`
-> `GC_EFFECTIVE | RESIDUAL_PRESENT | UNKNOWN`.

`Provider delete ACK != proof material absent`.

`GC_EFFECTIVE != every replica/provider copy physically absent` unless that stronger claim is explicitly proved.

## 7. Compaction instead of deletion

Many old nodes should be compacted rather than removed. A `ProofCompactionEnvelope` may preserve:

- immutable predecessor/root identity;
- member-local reduced proof needed by surviving members;
- cryptographic algorithms/canonicalization profile;
- timestamp/trust/validation context needed for historical verification;
- successor/re-anchor lineage;
- retained safety floors/tombstones;
- coverage and explicit `UNKNOWN`s.

Compaction is admissible only when every live question previously answerable remains answerable or is explicitly downgraded to a qualified disposition accepted by policy.

A fingerprint or summary that cannot reconstruct the required verification relation is not equivalent evidence.

## 8. Offline media and bounded uncertainty

An offline tape/vault/DR site may contain an old member binding or recovery path unknown to the active control plane. Requiring perfect global knowledge would create an unavailable oracle; ignoring the path would permit unsafe GC.

Candidate approach: scope-local coverage declarations plus durable high-water/floor evidence. If an offline domain is within the preservation contract but its reachability state is stale/unknown, destructive GC is blocked for nodes whose safety depends on that domain. Policy may separately retire the entire recovery domain through an explicit authority/retention transition; mere silence/age is insufficient.

`Recovery domain retired by qualified policy != recovery domain merely unreachable`.

## 9. Application Portfolio Matrix delta

The seven integration modes remain valid and intentionally mixed.

| Capability | Preferred modes | Security / authority / currentness | Lifecycle / replaceability / lock-in |
|---|---|---|---|
| Proof dependency inventory | Native SB | Client/purpose-scoped; inventory is evidence, not authority | Canonical semantic model provider-neutral |
| Shared-root accounting | Native SB | Aggregate may hide peer identity; scalar count never authorizes GC | Exportable dependency graph/summaries |
| ERS/Merkle verification | Native SB / Hybrid | Verification grants no effect authority | Standards-based, library replaceable |
| TSA/archive execution | API-backed / Hybrid / Deep-link | Qualified binding + observed provider effect | Provider replaceable if proofs export |
| Proof GC planner | Native SB | Computes admissibility; does not own retention/hold authority | Shared foundation, domain policy external |
| Provider object deletion | API-backed / Hybrid / Deep-link | Delete authority separately qualified; ACK != absence | Preserve provider-specific residual semantics |
| Offline archive inspection | Hybrid / Native bridge | Physical access != retention/GC authority | Bridge only where local media/device requires it |
| Forensic/provider-native console | Deep-link / Embedded qualified | No inherited shell authority | Reuse mature tools rather than clone them |

Additional criteria: semantic reachability fidelity, offline coverage, member/root separation, cross-Client disclosure, retention/hold fidelity, future-renewal impact, provider residual visibility, exportability, licensing, currentness, `PARTIAL/UNKNOWN` preservation and lock-in.

## 10. Desktop/Application Environment synthesis

### Desktop Sphere taxonomy

No taxonomy change. Desktop Spheres remain guided functional contexts. Proof retention/GC belongs to Security/Operations/Data-oriented spheres, not the shell itself.

### Observatory vs Pinned Monitoring Surface vs Operations Desktop

- **Desktop Observatory**: read-oriented projection of proof-storage growth, GC eligibility, blocked references, stale offline coverage and renewal pressure.
- **Pinned Monitoring Surface**: compact signals such as `proof GC blocked: offline coverage unknown`; no destructive authority.
- **Operations Desktop**: qualified application context for retention reconciliation, compaction and GC effects.

`Observatory != Monitoring Surface != Operations Desktop` remains binding.

### Window Manager / multi-display

A GC Window is an interaction session. Closing it cannot cancel a durable GC/verification occurrence. Secondary displays project currentness-qualified state only; stale `GC_ADMISSIBLE` cannot authorize deletion after a new hold/reference appears.

### Application Manager lifecycle

`Install != Adopt`; `Discovered != Verified`. A provider/archive adapter may be installed/discovered while still unqualified for proof export, deletion, residual observation or long-term verification. GC authority remains Client/policy scoped.

### Control Center

Control Center should expose provenance for retention/hold policy, preservation horizon, crypto-policy floor, provider binding, offline-domain coverage and effective GC disposition. It must explain why a node is retained without leaking another Client's identity.

### Declarative deployment / auto-binding / hosting

Semantic service definitions may request archive/timestamp/proof-store capabilities. Provider YAML/artifacts remain projections. Auto-binding selects only qualified providers compatible with residency, security, licensing, proof portability and lifecycle requirements, and exposes the choice because `Automatic != hidden`.

Placement of proof indexes, proof blobs and verification workers is independent from application/window placement. `Display Surface != Workspace`; `Window/session != runtime`.

### External mature tool reuse and open boundaries

Reuse provider archive/TSA/KMS/storage consoles and standards-compatible verification libraries where mature. SB owns semantic intent, qualification, provenance and cross-provider proof accounting; adapters/plugins own provider translation only. `Adapter normalization != fabricated semantic equivalence`.

### Proprietary editor family / semantic bridge

Shared editor primitives remain schema-driven inspector, command registry, provenance/currentness badges, diff/validation surfaces, graph/list projections and evidence panels. Workflow/View/Form/Component bindings remain separate: a GC button invokes a qualified domain command; it is not itself authority or workflow state.

`View != Workflow Activity`; `Form != Workflow State`; `Button != Domain Command`.

### Declarative + opinionated UX

Opinionated default: **inspect dependencies -> explain blockers -> qualify coverage/currentness -> preview semantic impact -> authorize -> observe provider effect -> re-verify surviving proofs**. Automation may precompute candidates but must not silently delete proof material.

### Accessibility / small-screen equivalence

No graph/tree-only requirement. Every dependency/root/member relation requires an equivalent keyboard/screen-reader/small-screen list representation with status, reason, scope, currentness, blocker and next safe action. Focus order follows semantic operation, not spatial topology.

## 11. Performance/resource budget implications

No numeric threshold is invented. Future measurable budgets should cover:

- proof-node/edge cardinality and index bytes;
- shared-root fan-out distribution;
- dependency discovery latency p50/p95/p99;
- verification CPU/hash bytes read;
- GC candidate scan rate;
- offline-domain reconciliation lag;
- proof-blob storage growth;
- compaction ratio versus verification cost;
- provider API/delete/HEAD/list cost and rate limits;
- cross-region/egress cost;
- post-GC verification throughput;
- minority-critical blockers hidden by aggregate counts.

Optimization must preserve exact `UNKNOWN/PARTIAL/BLOCKED` semantics.

## 12. Componentization complexity map

### C1 — presentation/shared UI

- status/currentness/provenance badges;
- dependency list/tree projections;
- blocker/explanation panels;
- accessible evidence timeline;
- operation progress surfaces.

### C2 — reusable semantic/application foundations

- `ProofNodeBoundary`;
- `ProofDependencyBoundary`;
- `ProofReachabilityBoundary`;
- `SharedRootReferenceAccountingBoundary`;
- `ProofGCIntentBoundary`;
- `ProofGCSafetyQualificationBoundary`;
- `ProofCompactionEnvelopeBoundary`;
- `OfflineRecoveryCoverageBoundary`;
- `PostGCVerificationBoundary`;
- `CrossClientProofDisclosureBoundary`;
- `ProviderResidualObservationBoundary`.

### C3 — application/domain-owned specifics

- legal retention/hold interpretation;
- evidentiary weight/acceptance;
- Client erasure authority;
- provider-specific destructive procedure;
- regulatory archive policy;
- workflow/business compensation;
- publication/deployment authority.

The reusable layer reduces cost for Evidence, Security, Storage, Backup/DR, Control Center and Operations applications without centralizing their business authority.

## 13. Adversarial proof obligations

1. One surviving member is the only live reference to a historical root.
2. Root retained but that member's reduced proof is missing.
3. Reduced proof retained but timestamp/validation context was GC'd.
4. Client B erases payload while Client A still needs the shared root.
5. Client A exits provider while B remains.
6. Legal hold arrives after GC candidate calculation but before effect.
7. Offline tape is within contract but has stale/unknown inventory.
8. Offline recovery domain was explicitly retired versus merely unreachable.
9. Timestamp renewal no longer needs payload, but future hash-tree renewal may.
10. Tree digest deprecation deadline moves earlier after GC qualification.
11. Provider delete ACK succeeds but a retained version/replica remains.
12. Provider object is gone but local proof index still claims it exists.
13. Scalar refCount reaches zero while an unindexed semantic dependency survives.
14. Duplicate edges inflate count but do not change semantic liveness.
15. Compaction summary cannot reconstruct member verification.
16. Cross-Client UI leaks peer identity through blocker detail.
17. Cross-Client UI leaks peer volume through exact shared reference count.
18. Provider opaque batching means peer membership is unknown to SB.
19. `UNKNOWN` offline coverage is accidentally treated as zero references.
20. Root is needed only by historical audit, not new-effect authority.
21. Historical verifier/trust material is retired from active trust but required for audit.
22. Re-anchor succeeds for one member and predecessor root is prematurely deleted for another.
23. New successor root ACKed but member proof not durable.
24. Hash-tree renewal requires predecessor evidence already compacted beyond reconstructability.
25. Retention expiry and crypto renewal race.
26. Erasure and legal hold race.
27. GC worker retries after policy/authority epoch changed.
28. Secondary display shows stale `GC_ADMISSIBLE` after a blocker appears.
29. Provider adapter upgrade changes meaning of `deleted`/`archived` state.
30. 9,999 disposable nodes plus one minority-critical live root are summarized as `99.99% reclaimable`.
31. Compaction reduces storage but creates pathological verification CPU/latency.
32. A provider exit leaves proofs portable but validation context provider-dependent.

## 14. Saturation and remaining gaps

- Web Desktop hierarchy/taxonomy/window/multi-display: **high conceptual saturation**.
- Application Portfolio/Application Manager/Control Center: **medium-high**.
- renewal cohort privacy/split/re-anchor: **medium-high conceptual saturation**.
- shared-root semantic reference accounting: **medium-high conceptual**.
- proof GC safety under known online coverage: **medium-high conceptual**.
- offline/vault/tape reachability and retirement proof: **medium**.
- provider residual/physical deletion semantics: **medium**.
- proof compaction economics/performance thresholds: **medium-low empirical**.
- accessibility/small-screen equivalence: **medium-high contractual**.

## 15. Next research vector

The next material gap is **offline recovery-domain retirement and bounded GC finalization**: how to prove that a tape/vault/DR domain no longer participates in admissible recovery or historical-verification obligations; distinguish explicit retirement from temporary invisibility; carry retirement/fencing evidence to media that may later reappear; and eventually permit bounded GC without either a global oracle or permanent retention of every predecessor proof.
