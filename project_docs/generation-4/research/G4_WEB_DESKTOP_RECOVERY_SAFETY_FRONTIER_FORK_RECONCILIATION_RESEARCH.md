# G4 Web Desktop — Recovery Safety Frontier Fork Reconciliation Research

Status: RESEARCH_ACTIVE / NON_EXECUTABLE
Scope: Generation 4 documentary P&D only. This artifact does not materialize WBS, Work Packages, Sprints, TASKs, product code, providers, migrations, or implementation authority.

## 1. Research question

The prior recovery-safety work established that a recovery point is historical state while a `RecoverySafetyFrontier` (RSF) carries later negative safety evidence that must not be rolled back during restore. The remaining distributed-systems gap is what happens when two or more isolated DR sites legitimately evolve different safety knowledge and later reconnect.

The critical case is not merely stale replication. It is a fork:

`F0 -> FA` at DR site A while `F0 -> FB` at DR site B.

Examples include A learning a credential revocation while B learns a key-retirement fence; issuer/trust rotation can also occur during isolation. Neither last writer wins, provider replication order, nor wall-clock order is sufficient authority to discard one branch.

## 2. Constitutional deductions

Preserve the existing G4 invariants and add:

- `RecoveryPoint != RecoverySafetyFrontier != RestoreAuthority != RestoredRuntime`.
- `Valid signature != current frontier`.
- `Later wall clock != safer frontier`.
- `Provider replication order != semantic causality`.
- `Fork detected != conflict automatically resolvable`.
- `Mergeable negative evidence != mergeable positive authority`.
- `Safe join != union of arbitrary claims`.
- `No known conflicting claim != proof of global agreement`.
- `Compacted frontier != forgotten live fence`.
- `Issuer rotation != retroactive invalidation of historically valid evidence`.
- `Display Surface != Workspace`; secondary surfaces may project frontier state but do not own it.
- `Observatory != Monitoring Surface != Operations Desktop`; observation of a fork is not authority to resolve it.

The RSF is therefore better modeled as a partially ordered safety knowledge structure than as a single mutable configuration document.

## 3. Candidate semantic model

### 3.1 Frontier identity

Candidate `RecoverySafetyFrontierEnvelope` fields:

- `frontier_id`
- `scope_ref` (Client / Workspace / recovery domain as declared)
- `generation_ref` (local monotonic generation, not a wall-clock timestamp)
- `parents[]`
- `issuer_epoch_ref`
- `claim_set_digest`
- `coverage_descriptor`
- `negative_claims[]`
- `safety_floors{}`
- `unknowns[]`
- `signatures_or_attestations[]`
- `compaction_proof_ref?`
- `created_observed_time` only as diagnostic metadata, never conflict authority

`generation_ref` is meaningful only within its declared generation lineage. Comparing raw integer generations from independent forks is invalid unless a shared monotonic authority is explicitly proved.

### 3.2 Claim classes

Do not merge all RSF data with one rule. Candidate classes:

1. **Monotonic negative facts** — credential/user revocation epochs, retired-key floors, artifact-erasure tombstones, authority fences, superseded recovery generations, minimum trust/security floors.
2. **Qualified negative facts** — malware/quarantine verdicts whose validity depends on scanner/profile/currentness evidence.
3. **Positive grants** — restore permission, emergency elevation, renewed credential authority. These are not grow-only safety facts and require fresh authority/currentness.
4. **Governance constraints** — legal hold/retention may be monotonic only inside a specific policy epoch; release of a hold is not inferred from absence on another branch.
5. **Unknown/coverage claims** — absence of observation must remain distinct from a negative assertion.

### 3.3 Partial order and dominance

Define semantic dominance only when scopes and claim schemas are compatible.

`F2 dominates F1` iff F2 proves that every still-live safety obligation represented by F1 is preserved or superseded by a stronger qualified claim, and F2 does not silently erase an `UNKNOWN` or coverage requirement.

This is not byte-set inclusion. A compacted frontier can dominate an older frontier while containing fewer records if its compaction proof demonstrates preservation of all live safety meaning.

### 3.4 Safe join

Candidate operation:

`SafeJoin(FA, FB) -> JOINED | QUARANTINED_CONFLICT | PARTIAL_UNKNOWN | REQUIRES_AUTHORITY_RECONCILIATION`

For compatible monotonic negative claims, the join preserves the stricter/maximal safety floor and union of live tombstones/fences. For non-monotonic or authority-bearing claims, no automatic union is permitted.

Examples:

- A says credential epoch >= 8 revoked; B says key K generation <= 4 retired: both survive.
- A says recovery authority R revoked at epoch 7; B contains a positive grant to R based on epoch 5: revocation dominates the stale grant.
- A and B contain incompatible issuer-rotation histories with no common qualified successor: quarantine/conflict, not last-writer-wins.
- A says malware verdict clean under profile P1; B says quarantined under newer qualified profile P2: currentness/profile qualification decides applicability; the adapter must not fabricate equivalence.

## 4. State machine

Candidate reconciliation state machine:

`ISOLATED_CURRENT`
`-> PEER_DISCOVERED`
`-> FRONTIER_EXCHANGED`
`-> AUTHENTICITY_CHECKING`
`-> LINEAGE_CHECKING`
`-> COVERAGE_COMPARING`
`-> DOMINANCE_EVALUATING`
`-> CLAIM_CLASSIFYING`
`-> SAFE_JOIN_EVALUATING`
`-> {JOINED, QUARANTINED_CONFLICT, PARTIAL_UNKNOWN, AUTHORITY_RECONCILIATION_REQUIRED}`
`-> DURABILITY_REPLICATING`
`-> DURABILITY_VERIFYING`
`-> RECOVERY_ADMISSIBILITY_REEVALUATING`
`-> EFFECTIVE_FRONTIER`

Failure branches include `SIGNATURE_INVALID`, `ISSUER_UNKNOWN`, `PARENT_GAP`, `ROLLBACK_SUSPECTED`, `SCHEMA_INCOMPATIBLE`, `COVERAGE_GAP`, `COMPACTION_PROOF_UNAVAILABLE`, `PEER_STALE`, and `DURABILITY_UNKNOWN`.

A joined frontier is not effective for restore until durability and restore-admissibility are re-evaluated for the relevant recovery domain.

## 5. Issuer/trust rotation during partition

Issuer rotation is especially dangerous because frontier authenticity and trust evolution depend on each other.

Candidate rule: trust rotation must form an independently verifiable lineage with bounded overlap/transition evidence. A frontier signed by an old issuer may remain historically authentic without remaining sufficient to authorize new restore operations.

Required distinctions:

- `historically_signature_valid`
- `issuer_currently_trusted`
- `issuer_authorized_for_claim_class`
- `rotation_lineage_complete`
- `rotation_conflict_present`

If A rotates from issuer I0 to IA while B rotates from I0 to IB and both claim exclusivity without a common authority/witness proving reconciliation, the system must not choose by timestamp. Recovery may remain available only in quarantine/historical-inspection or bounded emergency modes according to separately qualified authority.

## 6. Compaction and causal stability

Distributed replicated-data literature shows why tombstones/causal metadata cannot be discarded merely because they are old: remove information may be required to prevent a disconnected replica from resurrecting an element. Version-vector/dotted-version-vector work likewise demonstrates that causality can be represented compactly without treating wall-clock order as causal order.

For G4, the design implication is semantic rather than an implementation mandate:

`TOMBSTONE_COMPACTION_ALLOWED` requires evidence that every recovery path still admissible is either beyond the relevant safety floor or will merge a dominating compact frontier before effective restore.

Candidate `CompactionSafetyProof` records:

- compacted frontier lineage
- dominated input frontiers
- recovery-point reachability set or conservative coverage proof
- minimum retained safety floors
- live tombstone/fence summary
- excluded/unknown recovery paths
- issuer/trust lineage used for proof

If an offline tape, vault, DR account, or provider copy cannot be proved covered, its resurrection risk remains `UNKNOWN`; compaction may still proceed only if the retained compact representation preserves the necessary negative safety meaning for that path.

## 7. Web Desktop synthesis

### Desktop Sphere taxonomy

No taxonomy reversal is justified. Guided functional spheres remain preferable to free-form spatial navigation. Recovery/security work belongs primarily in Operations/Security/Recovery applications, with concise status projections elsewhere.

### Window Manager / multi-display

A `WindowSession` can show a frontier inspector, but window state does not own frontier state. Multi-display projections share semantic identity while retaining independent presentation state. A stale secondary display must show its observed generation/currentness and cannot authorize restore or conflict resolution.

### Observatory vs Pinned Monitoring Surface vs Operations Desktop

- **Desktop Observatory:** read-mostly projection of fork/currentness/durability health.
- **Pinned Monitoring Surface:** compact persistent signal such as `RSF fork detected`, `frontier stale`, `restore blocked`; no destructive authority.
- **Operations Desktop:** qualified application surface for reconciliation, recovery qualification, provider inspection, and explicitly authorized effects.

A monitoring alarm must not be interpreted as acknowledgement or resolution.

### Application Manager

Application install/adopt/discovery lifecycle remains separate from RSF state. A recovery-provider application may be discovered but unverified; that must not make its frontier claims trusted. `Install != Adopt`, `Discovered != Verified` remain unchanged.

### Control Center

Control Center should expose policy/configuration/provenance for recovery domains, issuers, replication targets, retention of safety evidence, and emergency modes. Effective frontier state remains observed/effective evidence, not configuration. `Policy != configuration`; `Desired != Observed != Effective`.

### Declarative deployment / auto-binding / Vault

A service definition may declare recovery/frontier capabilities and SecretRefs, but YAML/provider artifacts do not become semantic definitions. Auto-binding can propose/select compatible providers only when visible provenance, environment, authority, currentness and trust qualification remain inspectable. `Automatic != hidden`; `SecretRef != secret value`.

### Hosting / placement

Placement can deliberately separate recovery/frontier witnesses from primary runtime failure domains. This is a resilience choice, not a mandate for centralization. Autonomous runtimes must retain enough local evidence to reject rollback without depending on the Builder at runtime.

### External mature tool reuse

Reuse provider vault/KMS/backup consoles and APIs for provider-native semantics. Do not rebuild mature forensic/provider recovery consoles merely for visual uniformity. SB owns semantic intent, cross-provider evidence normalization where equivalence is real, recovery qualification, and lineage; adapters must preserve provider-specific unknowns/conflicts.

### Proprietary editor family / semantic bridge

Shared editor primitives should include evidence timelines, provenance inspectors, qualified status chips, diff/compare, conflict panels, safety-floor visualization, policy/currentness badges, and effect confirmation. These primitives also serve Workflow/View/Form/Component editors. `View != Workflow Activity`, `Form != Workflow State`, `Button != Domain Command`: a restore/reconcile button only invokes a separately authorized domain command.

### Declarative + opinionated UX

Opinionated default flow:

`detect fork -> explain branches -> classify automatically mergeable safety facts -> expose unresolved authority/trust conflicts -> show recovery impact -> require qualified reconciliation where necessary -> verify replicated joined frontier -> re-evaluate restore admissibility`.

Do not expose CRDT/vector-clock jargon as the default operator mental model; advanced evidence inspectors may show lineage details.

### Plugin / adapter boundaries

Plugins/adapters may normalize common claims such as provider recovery-point identity, KMS state, immutable-vault state, replication evidence and currentness. They must not fabricate semantic equivalence between provider generation numbers, clocks, retention states, or trust models.

## 8. Application Portfolio Matrix delta

The seven integration modes remain valid; no universal mode is selected.

| Capability/task | Preferred portfolio shape | Why / boundary |
|---|---|---|
| RSF semantic model, lineage, safe-join qualification | Native SB | Cross-provider semantic invariant and proof surface |
| Backup/vault inventory and restore execution | API-backed / Hybrid | Mature provider APIs; SB qualifies intent/currentness |
| Provider-native forensic recovery | Deep-link / Hybrid | Preserve expert semantics and licensing/support boundaries |
| KMS/HSM administration | API-backed / Hybrid / Deep-link; Native bridge only when device-local | Avoid rebuilding mature key consoles; preserve hardware locality |
| RSF Observatory projection | Native SB | Needs normalized cross-app evidence and disclosure control |
| Air-gapped/offline recovery media inspection | Hybrid / Native bridge where local media/hardware requires it | Local capability is not portable; reacquisition and authority are explicit |
| External recovery console inside shell | Embedded only after isolation/capability qualification | Embedding does not inherit shell authority or permissions |

Matrix criteria added/refined: fork detectability, causal/lineage fidelity, anti-rollback evidence, issuer-rotation fidelity, claim-class semantics, safe-join transparency, conflict preservation, compaction-proof portability, offline durability, restore-admissibility coupling, security/disclosure, licensing, currentness, replaceability, provider lock-in, and `UNKNOWN/PARTIAL/CONFLICT` fidelity.

## 9. Componentization complexity map

This is a research decomposition map, not a WBS.

### C0 — primitive semantics, low UI complexity / very high correctness leverage

`FrontierRef`, `FrontierParentRef`, `FrontierGenerationRef`, `IssuerEpochRef`, `SafetyFloorRef`, `NegativeClaimRef`, `CoverageRef`, `UnknownClaimRef`, `CompactionProofRef`, `ForkRef`, `DominanceDisposition`, `JoinDisposition`.

### C1 — shared semantic services, high correctness complexity

- `FrontierLineageBoundary`
- `FrontierAuthenticityBoundary`
- `FrontierDominanceBoundary`
- `FrontierClaimClassifierBoundary`
- `FrontierSafeJoinBoundary`
- `IssuerRotationQualificationBoundary`
- `FrontierForkDetectionBoundary`
- `FrontierConflictReconciliationBoundary`
- `CompactionSafetyProofBoundary`
- `RecoveryPathCoverageBoundary`
- `FrontierDurabilityBoundary`
- `RestoreAdmissibilityReevaluationBoundary`

These foundations reduce cost across Backup/DR, Security, Operations, Control Center, Application Manager and provider integrations.

### C2 — shared interaction compounds, medium/high UI complexity

- frontier/fork status card
- currentness + durability indicator
- branch compare/diff
- claim provenance inspector
- safety-floor timeline
- unresolved conflict panel
- restore-impact preview
- quarantine/historical-only banner
- compacted-lineage inspector
- multi-display stale-projection indicator

### C3 — application-specific semantics that should remain specific

- legal retention/hold release authority
- domain-specific erasure eligibility
- workflow/business compensation after restore
- publication/effect authority
- provider-specific forensic operations
- emergency organizational approval policy
- application-specific semantic duplicate/merge rules

Do not pull these upward merely to maximize reuse.

## 10. Performance/resource-budget implications

No empirical thresholds are asserted yet. The architecture must budget for frontier cardinality, lineage depth, signature verification, branch comparison, claim indexing, compaction proof generation, offline replication payload, provider inventory reconciliation, and UI virtualization for long evidence timelines.

Important scaling distinction:

`historical claims population != live safety claims != indexed claims != visible UI rows`.

Compaction is therefore desirable, but only behind semantic safety proof. Performance pressure is not authority to delete safety evidence.

## 11. Accessibility and small-screen equivalence

Conflict resolution cannot rely on spatial branch diagrams alone. Every graph/fork view needs a linear semantic equivalent exposing branch identity, issuer, currentness, unresolved claims, impact and available actions. Keyboard navigation, focus restoration, non-color-only conflict/currentness indicators, accessible status announcements and explicit confirmation for destructive/recovery effects remain mandatory.

Small screens may serialize panels and defer advanced inspectors, but must preserve complete task semantics: detect, understand, qualify, reconcile, verify and inspect evidence. `small-screen equivalence != pixel-equivalent desktop`.

## 12. Failure/recovery obligations

A reconciliation attempt itself is resumable evidence-bearing work. Lost response after publishing a joined frontier is `UNKNOWN`, not failure. On reconnect the system must reconcile by frontier/effect identity before retrying. Browser/tab closure cannot be the only persistence boundary.

A stale window restored from browser/session state must re-read effective frontier/currentness before exposing effect-bearing recovery commands.

## 13. Adversarial proof matrix

At minimum future proof work must cover:

1. A learns credential revocation, B learns key retirement, then reconnect.
2. Both branches carry valid signatures and equal local generation numbers.
3. Wall clocks disagree by hours/days.
4. Provider replication delivers older branch last.
5. A rotates issuer I0->IA; B rotates I0->IB while partitioned.
6. Old issuer remains historically valid but no longer effect-authorized.
7. One branch contains an `UNKNOWN` recovery path the other lacks.
8. Malware clean verdict conflicts with newer quarantine evidence.
9. Legal hold release appears on only one branch.
10. Emergency restore grant exists on stale branch after authority revocation.
11. Compaction removed raw tombstones but retained a valid dominating floor.
12. Compaction proof is missing at one DR site.
13. Offline tape returns after tombstone compaction.
14. Restore point predates both fork branches.
15. Restore point postdates one branch but not the other.
16. Joined frontier published; ACK lost; retry occurs.
17. Joined frontier reaches provider A but not provider B.
18. 9,999 claims join cleanly; one critical authority conflict remains.
19. Secondary display shows old `SAFE` while Operations Desktop detects fork.
20. Observatory cache is stale but provider recovery point is current.
21. Adapter maps incomparable provider generations into one scalar.
22. External console mutates recovery state during reconciliation.
23. Browser restores a stale window/session after effective frontier advances.
24. Air-gapped recovery account has backup but not newest frontier.
25. Multi-party emergency recovery is available while issuer lineage is conflicted.
26. Client A frontier metadata is visible to Client B through shared monitoring.
27. Safe-join payload exceeds local storage/network budget.
28. Signature verification dependency is unavailable offline.
29. Frontier schema evolves while one DR site remains isolated.
30. Plugin/provider replacement occurs while a fork is unresolved.
31. Compaction uses time-to-live alone and would permit resurrection.
32. A positive grant is accidentally unioned as if it were monotonic negative evidence.

## 14. Contradictions resolved / intentionally preserved

Resolved:

- Availability versus safety: backups may remain available while effective restore is blocked/quarantined.
- Offline autonomy versus anti-rollback: local operation can continue with declared coverage/currentness; lack of global knowledge is represented as `UNKNOWN`, not fabricated certainty.
- Compaction versus resurrection safety: compact semantic floors/proofs, not blindly age-based deletion.
- External-tool reuse versus semantic authority: provider consoles remain useful without becoming SB semantic authority.

Intentionally preserved:

- No universal consensus/CRDT algorithm is selected yet.
- No assumption that all claim classes form a lattice.
- No requirement for a global always-online coordinator.
- No claim that provider clocks/generations are cross-provider comparable.
- No empirical performance thresholds yet.

## 15. Research saturation and next vector

Current maturity after this delta:

- Web Desktop hierarchy / Window / multi-display: high conceptual saturation.
- Desktop taxonomy / Observatory vs Monitoring vs Operations: high conceptual saturation.
- Application Portfolio / external integration boundaries: medium-high.
- RecoverySafetyFrontier base contract: medium-high.
- Fork detection and monotonic negative-claim join: medium-high conceptual.
- Issuer/trust rotation during partition: medium.
- Compaction causal-stability proof: medium.
- Offline cryptographic verification/witness strategy: medium-low empirically.
- Accessibility/small-screen equivalence: medium-high contractually.
- Performance/resource budgets: medium-low empirically.

Material gaps remain, so research is not complete.

Recommended next deep-gap vector: **issuer/trust-root rotation and recovery authority continuity under prolonged partition**, especially cross-signing/overlap windows, compromised old issuer, offline verification material, emergency authority, and proving when historical evidence remains authentic while no longer authorizing new effects. This can still change trust contracts, RSF state machines, Vault/KMS integration, Application Portfolio, and component boundaries.

## 16. Research basis

This synthesis uses the repository's G4 constitutional/research state and mature distributed/recovery literature. External anchors include AWS Backup logically air-gapped vault / multi-party approval documentation, Google Cloud Backup and DR vault/CMEK documentation, and distributed replicated-data literature on CRDT tombstones, causal stability, version vectors and dotted version vectors. These sources are used for contradictory evidence and semantic constraints, not as implementation prescriptions.
