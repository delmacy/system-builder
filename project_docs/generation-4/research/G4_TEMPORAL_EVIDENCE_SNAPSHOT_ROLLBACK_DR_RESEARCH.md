# G4 — Temporal Evidence Durability, Snapshot Rollback & DR Research

Status: `RESEARCH_ACTIVE / NON_EXECUTABLE`
Execution authority: NONE
Date: 2026-09-23

## Scope

This round consolidates the G4 Web Desktop & Application Environment around the next temporal-authority gap: snapshot/restore, disaster recovery, replica promotion and storage rollback can restore bytes while silently losing newer negative evidence, authority floors, revocations, fencing observations or currentness frontiers.

This is documentation-only P&D on `research/g4-product-rnd-foundations`. It does not authorize product implementation, WBS, Work Packages, Sprints, TASKs, migrations or provider adoption.

Primary candidate hierarchy remains:

`Builder Home/Factory -> Client -> Workspace -> Desktop Sphere -> Application -> Window -> View/Tab/Tool`.

3D remains an optional projection/application, not a navigation prerequisite.

## Inputs reconciled

Repository constitutional constraints remain `Builder != Runtime`, published runtime autonomy, compatibility before replacement, replaceable suite modules and explicit bounded-context contracts.

Recent :00/:10 deltas materially constrain this round:

- emergency recovery policy itself is governed evidence; policy presence/signature does not imply current admissibility; ambiguity must not widen authority; trust continuity can become unprovable and require explicit re-bootstrap;
- historical promotion/gate decisions bind immutable policy/evidence/trust/verifier context; current policy does not rewrite historical decisions; replay/counterfactual evaluation is distinct from a new admission occurrence.

These combine with prior temporal research: wall-clock rollback does not restore authority, suspend does not pause every horizon, and remote timestamps do not create trusted order without qualification.

## External pattern evidence reviewed

### etcd snapshot/restore

etcd documents that restoring an older snapshot can make revisions go backwards from a client's perspective. Its recovery guidance recommends revision bump plus compaction marking when clients maintain watch/informer caches, specifically so restored state does not masquerade as an ordinary continuation and stale caches are invalidated. A restored cluster is also assigned new cluster/member identity rather than silently rejoining as the old cluster.

Portable lesson: restored bytes and restored semantic/currentness frontier are distinct; a recovery mechanism may need an explicit epoch/floor discontinuity and cache invalidation rather than pretending the old monotonic history continued.

### Hardware/TEE attestation

AWS Nitro Enclaves and Azure confidential-VM guest attestation provide signed/measured evidence about the executing environment. Nitro attestation binds measurements such as image/application and parent-instance attributes; Azure guest attestation verifies hardware-backed TEE/secure-boot properties.

Portable lesson: attestation can qualify *where/what is running*. It does not by itself prove that the runtime possesses the newest business-policy revision, newest revocation, newest temporal floor, or complete negative evidence.

`ATTESTED_RUNTIME != ROLLBACK_RESISTANT_BUSINESS_STATE`.

### TPM/vTPM

TPM/vTPM patterns provide hardware-rooted storage/measurement primitives. They are useful candidates for anchoring local anti-rollback state, but a hardware counter or measured boot state is not itself System Builder business authority.

`TPM_COUNTER_PRESENT != BUSINESS_AUTHORITY_PROVEN`.

## Primary finding — recovery needs a durable monotonic evidence frontier, not merely a restored database

Candidate concept:

```text
TemporalEvidenceFrontier
  frontierId
  subjectRef
  clientId
  environmentRef
  trustEpochRef
  recoveryEpochRef
  policyFloorRefs[]
  authorityFloorRefs[]
  securityFloorRefs[]
  revocationFrontierRefs[]
  fencingFrontierRefs[]
  negativeEvidenceRefs[]
  unresolvedEffectRefs[]
  placementGenerationRefs[]
  credentialGenerationRefs[]
  localSequenceFloor
  witnessReceipts[]
  anchorDisposition
  currentnessDisposition
```

The frontier is not one scalar global version. Each protected invariant may require a different monotonic dimension.

Hard invariants:

`SNAPSHOT_RESTORED != TEMPORAL_FLOOR_MAY_ROLLBACK`

`PERSISTED_LOCALLY != ROLLBACK_RESISTANT`

`REPLICA_PROMOTED != REPLICA_HAS_LATEST_NEGATIVE_EVIDENCE`

`BYTES_COMPLETE != SAFETY_FRONTIER_COMPLETE`.

## F1 — Snapshot restore is a recovery occurrence, not transparent continuation

A snapshot restore should create an explicit `RecoveryOccurrence` / `RecoveryEpoch` when semantic currentness may have regressed.

Candidate dimensions:

```text
RecoveryOccurrence
  restoredArtifactRef
  restoredDataRevision
  preFailureFrontierKnown?
  recoveredFrontier
  missingFrontierDimensions[]
  witnessComparison[]
  recoveryEpoch
  admissionDisposition
  reconciliationObligations[]
```

`same service identity != same recovery epoch`.

Service semantic identity can survive a restore while the evidence/currentness epoch changes.

## F2 — Negative evidence is first-class DR state

Revocations, fencing observations, old-manager exclusion, old-placement exclusion, secret revocation, anti-rollback floors and known-unsafe findings can be more safety-critical than positive desired state.

A replica containing the desired configuration but missing a later revocation is not semantically complete.

`DESIRED_STATE_RESTORED != REVOCATION_STATE_RESTORED`.

`CONFIGURATION_COMPLETE != NEGATIVE_EVIDENCE_COMPLETE`.

## F3 — Recovery completeness is multidimensional

Candidate coverage vector:

```text
RecoveryCoverage
  payload
  configuration
  policy
  authority
  trust
  securityFloor
  revocation
  fencing
  credentials
  placement
  externalEffects
  unresolvedUnknowns
  evidenceCurrentness
```

A single `backup succeeded` badge cannot represent this vector.

`BACKUP_VALID != RECOVERY_ADMISSIBLE`.

## F4 — Local anti-rollback anchors are useful but cannot become a universal oracle

A local anchor can record a digest/counter/frontier high-water mark outside ordinary mutable application storage. Candidate anchor classes include hardware-backed state, hypervisor/platform attestation plus sealed state, append-only local media, independent control-domain state or qualified remote witness receipts.

No one class is universally required.

`ANCHOR_AHEAD_OF_RESTORE -> rollback detected` can be useful.

But:

`ANCHOR_EQUAL != ALL_SEMANTIC_STATE_COMPLETE`.

A counter proves at most the counter relation it actually covers.

## F5 — External witnessing must be optional/composable, not a mandatory online Builder oracle

A runtime may periodically publish a privacy-minimized commitment to one or more independent witnesses:

```text
WitnessReceipt
  subjectRef/pseudonymousScope
  frontierDigest
  monotonicGeneration
  trustEpoch
  issuedAt/temporalQualification
  witnessIdentity
  signature/provenance
```

On restore, a local frontier below a qualified witness can prove rollback or staleness.

However:

`EXTERNAL_WITNESS != GLOBAL_ONLINE_ORACLE`.

Normal runtime operation must not require constant Builder connectivity. Multiple witnesses can reduce correlated rollback risk but do not create business authority or universal consensus.

## F6 — Witness absence is not proof that rollback did not occur

If the latest witness is unavailable, the disposition can become `UNKNOWN` for claims whose safety depends on it.

`NO_WITNESS_RESPONSE != LOCAL_STATE_CURRENT`.

Offline autonomy remains bounded by locally sufficient evidence and explicit horizons.

## F7 — Restore must not resurrect revoked authority

A snapshot can contain an old `SB_MANAGED` binding, old waiver, old secret lease or old placement right that was revoked after the snapshot.

Candidate admission rule:

- preserve historical interpretation of the restored record;
- block authority-expanding/new-effect operations until relevant monotonic floors are reconciled;
- permit only explicitly safe degraded operations whose LocalAutonomyContract does not require the missing frontier.

`RESTORED_AUTHORITY_RECORD != CURRENT_AUTHORITY`.

`RESTORED_WAIVER != CURRENT_WAIVER`.

## F8 — Application Manager boundaries survive restore

After restore:

`Install != Adopt`

`Register != Deploy`

`Connect != Own`

`Discovered != Verified`.

A discovered application cannot be adopted merely because the restored registry once contained it. An `EXTERNALLY_MANAGED` application cannot be silently upgraded from a stale restored management binding. `CO_MANAGED` ownership must be requalified where its field/operation frontier may have regressed. `OBSERVE_ONLY` never gains mutation authority.

## F9 — Supply-chain/source integrity and temporal currentness are orthogonal

A restored package can have a valid digest/signature while its admissibility was revoked later.

`ARTIFACT_INTEGRITY_VALID != ARTIFACT_CURRENTLY_ADMISSIBLE`.

Likewise, an attested runtime can execute the expected binary while holding stale policy or revocation state.

## F10 — Secret restoration requires generation/fencing reconciliation

A backup may contain a `SecretRef`, cached token metadata or old credential generation.

Preserve:

`SecretRef != secret value`.

Candidate chain after restore:

`RESTORED_BINDING -> CURRENT_SECRET_GENERATION_QUALIFICATION -> CONSUMER_ADOPTION -> OLD_GENERATION_REVOCATION/FENCING_EVIDENCE`.

`RESTORED_SECRET_REF != SECRET_CURRENT`.

`OLD_SECRET_MISSING_LOCALLY != OLD_SECRET_FENCED_REMOTELY`.

No diff/evidence UI should expose secret values.

## F11 — Placement migration and DR promotion do not change service semantic identity

`Service identity != raw IP`.

A replica/placement can be promoted without creating a new semantic Service. Conversely, preserving Service identity does not prove the old placement is fenced.

`NEW_PLACEMENT_ACTIVE != OLD_PLACEMENT_FENCED`.

DR promotion must preserve placement generation/effect-right lineage.

## F12 — Deployment Unit is not the restored physical server

`Deployment Unit != physical server`.

A Deployment Unit may be rematerialized onto different hosts/providers after recovery. Provider artifacts/manifests remain compiled projections.

`RESTORED_PROVIDER_MANIFEST != CANONICAL_DESIRED_STATE`.

Raw YAML remains an escape hatch/export/import surface, not canonical semantic truth.

## F13 — etcd-style revision bump illustrates cache invalidation, not semantic proof

A revision bump can ensure consumers observe a monotonic-looking revision and invalidate stale watch caches, but an artificial revision number does not reconstruct missing semantic events.

`REVISION_BUMP != MISSING_EVENT_RECREATED`.

`CACHE_INVALIDATED != EFFECT_SETTLED`.

G4 should preserve this distinction if any storage/index provider exposes revision mechanics.

## F14 — Recovery epoch must propagate to derived indexes and UI projections

Application Portfolio, Application Manager, Control Center global search/diff, Desktop Observatory, Pinned Monitoring Surfaces and proprietary editors can all retain stale derived state across restore.

Candidate key:

`Client × Environment × SubjectRevision × RecoveryEpoch × EvidenceFrontier`.

A cache/index hit from an older recovery epoch is not current evidence.

`INDEX_PRESENT != INDEX_CURRENT`.

## F15 — Workspace/Desktop restore is not runtime/evidence restore authority

A saved Workspace/Desktop Sphere can reopen windows/tabs/tools after DR, but must requalify Client, Workspace, application registration, permissions, recovery epoch and evidence currentness.

`WORKSPACE_RESTORED != CLIENT_CONTEXT_CURRENT`.

`WINDOW_RESTORED != SERVICE_RUNTIME_RESTORED`.

`UI_CLOSE != SERVICE_STOP` remains absolute.

## F16 — Control Center shows provenance/conflict; it does not own recovered truth

Control Center candidate projections:

- recovered vs witnessed frontier;
- dimensions ahead/equal/behind/unknown;
- recovery epoch;
- missing negative evidence;
- restored config/policy provenance;
- authority/management conflicts;
- secret-generation/fencing disposition;
- placement generation/fencing disposition;
- derived-index invalidation;
- change/reconciliation plan and blast radius.

`Unified UI != one semantic owner/store`.

## F17 — Automatic binding must expose recovery-critical dependency

If an Environment default automatically binds a Service to network/storage/Vault/placement, the binding must expose identity, provenance, generation/currentness and recovery consequence.

`Automatic != hidden`.

A restored automatic binding that points at an old storage generation or credential generation must not silently reactivate.

## F18 — Provider adapters cannot fabricate rollback equivalence

Providers expose different primitives: snapshot IDs, generations, revisions, epochs, restore points, attestation documents, TPM/vTPM state, fencing tokens and secret versions.

An adapter may map only declared semantics.

`Adapter normalization != fabricated equivalence`.

`provider snapshot revision == G4 semantic frontier` is forbidden unless a proof contract explicitly establishes the equivalence for the named claims.

## F19 — DR recovery and policy recovery are distinct

Recent emergency-recovery research shows that recovery policy itself may be stale/forked/compromised. Restoring infrastructure does not resolve a recovery-policy fork.

`DATA_RECOVERED != TRUST_CONTINUITY_RECOVERED`.

`TRUST_REBOOTSTRAPPED != BUSINESS_EFFECTS_RECONCILED`.

If trust continuity is unprovable, explicit re-bootstrap may create a new trust epoch without rewriting historical effects.

## F20 — Historical replay remains possible without making old state admissible

Recent promotion-policy research separates historical decision replay from current admission. A restored snapshot can support forensic reconstruction of a historical decision even when the same state is blocked for new effects.

`HISTORICAL_RESOLVABILITY != CURRENT_ADMISSIBILITY`.

`RESTORED_POLICY_ARCHIVE != POLICY_SELECTABLE_FOR_NEW_ADMISSION`.

## F21 — Restore should prefer explicit degraded states over false normality

Candidate dispositions by claim/operation:

`CURRENT`
`RECOVERED_AND_REQUALIFIED`
`RECOVERED_PENDING_RECONCILIATION`
`ROLLBACK_DETECTED`
`FRONTIER_BEHIND_WITNESS`
`NEGATIVE_EVIDENCE_INCOMPLETE`
`AUTHORITY_REQUALIFICATION_REQUIRED`
`TRUST_REBOOTSTRAP_REQUIRED`
`SAFE_DEGRADED_OPERATION_ONLY`
`UNKNOWN`.

No single green `RESTORED` status is sufficient.

## Adversarial matrix

1. **Tenant leak:** witness/cache key shared across Clients causes Client A frontier to qualify B. Forbidden; tenant/trust scope is explicit.
2. **Stale client context:** restored Workspace opens under an old Client binding. Requalification required.
3. **Hidden secret exposure:** backup diff displays secret values. Forbidden; only SecretRef/generation/provenance.
4. **Discovered but unverified app:** restored discovery record becomes `VERIFIED`. Forbidden.
5. **Externally managed silently upgraded:** stale restored `SB_MANAGED` record triggers upgrade. Forbidden.
6. **Global setting triggers restart:** restored config drift triggers mass restart without current authority/blast-radius plan. Forbidden.
7. **Shared infrastructure mistaken for shared data/authority:** same restored database/provider does not merge Client ownership.
8. **Provider artifact canonical:** snapshot/provider manifest becomes desired-state source. Forbidden.
9. **UI close stops runtime:** closing restored window cannot stop service.
10. **Adapter fabricates equivalence:** provider revision mapped to semantic frontier without proof. Forbidden.
11. **Placement migration changes identity:** promoted DR endpoint creates new Service identity. Forbidden.
12. **App settings conflict with Control Center:** restored global setting overwrites app-owned advanced setting. Ownership/provenance resolution required.
13. **Automatic binding hides dependency:** restored Vault/storage binding reactivates old generation invisibly. Forbidden.
14. Snapshot predates a credential revocation; restored runtime attempts a new effect with old credential.
15. Replica contains latest payload but misses a fencing event.
16. Local TPM/high-water anchor is newer than restored disk; runtime ignores mismatch.
17. Hardware attestation passes but policy frontier is stale.
18. Witness is unavailable; absence is interpreted as proof of no rollback.
19. Witness is malicious/stale; signature alone is treated as semantic currentness.
20. Restored revision is artificially bumped and UI claims missing effects occurred.
21. Old placement is still writable after DR promotion.
22. Historical gate PASS is replayed as current admission permission.
23. Recovery policy fork is hidden by choosing latest timestamp.
24. Raw YAML from backup overwrites typed service semantics.
25. Search/index survives restore and returns stale management binding as current.
26. Negative evidence is pruned from backup because payload retention succeeded.
27. `OBSERVE_ONLY` app gains write credential during reconciliation.
28. CO_MANAGED restored owner map becomes last-writer-wins.
29. A restored waiver is treated as current because `expiresAt` is still in the future while revocation frontier is missing.
30. A witness commitment contains cross-tenant correlators beyond its declared purpose.

## New invariants

- `Restored bytes != restored authority`.
- `Backup integrity != recovery admissibility`.
- `Snapshot age != semantic staleness scalar`.
- `Recovery epoch != service identity`.
- `Anchor state != business authority`.
- `Witness receipt != global truth`.
- `Witness unavailable != no rollback`.
- `Attested runtime != current policy`.
- `Revision bump != event reconstruction`.
- `Negative evidence != optional backup metadata`.
- `Historical replay != current admission`.
- `Recovered desired state != external effects settled`.

## Proof obligations PO-321..PO-350

- **PO-321** Every recovery occurrence identifies Client, Environment, subject/service identity, restored artifact/snapshot identity and recovery epoch.
- **PO-322** Recovery admission proves each material frontier dimension independently; one storage revision cannot stand in for all dimensions.
- **PO-323** A restored state below a qualified anti-rollback anchor/witness is represented as rollback/stale, never silently accepted.
- **PO-324** Local anchors declare exactly which claims/dimensions they cover and cannot be promoted to business authority.
- **PO-325** External witnesses are optional/composable and do not create mandatory Builder availability for normal runtime operation.
- **PO-326** Witness provenance, tenant/purpose scope, trust qualification and currentness are verified before use.
- **PO-327** Witness absence/unavailability remains `UNKNOWN` where material rather than proving currentness.
- **PO-328** Negative/revocation/fencing evidence required to prevent stale-effect resurrection survives every admissible restore path or is subsumed by a stronger durable fence.
- **PO-329** Replica promotion proves material negative-evidence coverage, not only payload/configuration completeness.
- **PO-330** Restored management mode is requalified before any authority-expanding Application Manager action.
- **PO-331** `EXTERNALLY_MANAGED` and `OBSERVE_ONLY` boundaries survive restore; `CO_MANAGED` ownership is operation/field-qualified.
- **PO-332** Discovered application records never become verified/adopted solely because they exist in a restored catalog.
- **PO-333** Supply-chain integrity and current admissibility remain independently evidenced.
- **PO-334** Secret values never enter witness commitments, diffs, evidence records or recovery UI; only qualified references/generations/provenance.
- **PO-335** Restored secret bindings requalify current generation, consumer adoption and old-generation fencing separately.
- **PO-336** Service semantic identity survives placement recovery independently of physical endpoint identity.
- **PO-337** DR promotion does not claim old placement fencing without effect-side or independently qualified evidence.
- **PO-338** Deployment Unit identity remains logical and is not equated with a restored server/VM/container.
- **PO-339** Raw/provider manifests remain projections/escape hatches and cannot become canonical desired state after restore.
- **PO-340** Provider revision/generation/snapshot identifiers are mapped claim-by-claim; adapters never fabricate semantic-frontier equivalence.
- **PO-341** Revision bump/cache invalidation cannot be reported as reconstruction of missing business/effect events.
- **PO-342** Derived indexes/caches/search projections bind recovery epoch/frontier currentness and invalidate stale pre-restore results.
- **PO-343** Restored Workspace/Desktop state requalifies Client/Workspace/application/permission/evidence context before effective actions.
- **PO-344** Window/session lifecycle remains independent of service/deployment/recovery lifecycle.
- **PO-345** Control Center diff/reconciliation preserves semantic ownership/provenance and cannot overwrite app-specific advanced settings by UI centrality.
- **PO-346** Automatic Environment/network/storage/Vault/placement bindings expose recovery-critical dependencies, generations and consequences.
- **PO-347** Recovery-policy/trust discontinuity is represented independently of infrastructure/data recovery.
- **PO-348** Historical decision replay remains bound to historical policy/evidence context and cannot authorize a new deployment/effect.
- **PO-349** Unresolved external effects survive restore as explicit obligations/`UNKNOWN`; backup success never settles them.
- **PO-350** Privacy-minimized witness/anchor evidence cannot introduce cross-Client correlation or secret disclosure beyond declared proof purpose.

## Saturation assessment

`MATERIAL_DELTA / NON_EXECUTABLE`.

Relatively mature in principle:

- restored bytes vs semantic/currentness frontier separation;
- negative evidence as DR-critical state;
- recovery epoch distinct from service identity;
- local anchor/witness as scoped evidence rather than business authority;
- historical replay vs current admission;
- provider artifact/revision non-canonicity.

Material / not saturated:

- witness quorum/diversity and correlated rollback assumptions;
- exact anchor portability across bare metal, VM, container and managed hosting;
- privacy-preserving frontier commitments;
- restore admission when some frontier dimensions are provably irrelevant;
- offline restore when witnesses are unreachable;
- dual-placement fencing after asynchronous DR.

Early material:

- provider-native TPM/vTPM/TEE/snapshot mappings;
- cross-provider anti-rollback evidence portability.

No domain is declared saturated.

## Next highest-value gap

**Witness/anchor governance under correlated rollback, migration and provider loss.**

Questions:

- How many independent witnesses/anchors are sufficient for a named invariant without inventing global consensus?
- How does a runtime migrate providers when the old hardware-rooted anchor cannot move?
- How do we distinguish `anchor unavailable`, `anchor destroyed`, `anchor contradicted`, and `anchor legitimately superseded`?
- Can a new placement establish a successor anti-rollback anchor without allowing a stale snapshot to self-authorize its own frontier?
- How are privacy/minimization and Client isolation preserved when witnesses must compare frontier commitments?

Entry invariants:

`More witnesses != automatic truth`.

`Anchor migration != authority reset`.

`Old provider unavailable != old negative evidence irrelevant`.

`Successor anchor != self-authorized rollback acceptance`.

`Witness quorum != business consensus`.
