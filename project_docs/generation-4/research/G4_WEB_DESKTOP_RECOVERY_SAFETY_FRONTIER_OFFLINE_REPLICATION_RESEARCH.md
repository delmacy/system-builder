# G4 Web Desktop — Recovery Safety Frontier Offline Replication Research

Status: RESEARCH_ACTIVE / NON_EXECUTABLE  
Scope: documentary P&D only. No WBS, Work Package, Sprint or TASK materialization.

## Research question

How can an autonomous G4 runtime admit restore from offline / logically air-gapped recovery points without allowing an older DR medium to resurrect credentials, keys, erased artifacts, trust state or authority that was negatively changed after the backup was created?

The previous restore-admissibility result established that a backup is historical state and restore is a new admission occurrence. This note closes the next gap: replication, authentication, anti-rollback and compaction of the `RecoverySafetyFrontier` (RSF) when the recovery site cannot assume continuous connectivity to a global authority.

## Decision summary

A recovery point and a recovery-safety frontier are distinct artifacts with distinct lifecycles:

`RecoveryPoint != RecoverySafetyFrontier != RestoreAuthority != RestoredRuntime`.

The RSF is not a complete event log and not a global oracle. It is a scope-bounded, authenticated, monotonic negative-evidence summary sufficient to prevent known resurrection classes. A restore may be historically inspectable when the newest qualified frontier is unavailable, but it must not silently become effective operational state.

Core laws:

- `BACKUP AVAILABLE != CURRENT FRONTIER AVAILABLE`.
- `FRONTIER SIGNATURE VALID != FRONTIER CURRENT`.
- `OLDER VALID FRONTIER != SAFE CURRENT FRONTIER`.
- `OFFLINE != AUTHORIZED TO IGNORE NEGATIVE EVIDENCE`.
- `COMPACTED != TOMBSTONE FORGOTTEN`.
- `ACKED REPLICATION != DURABLY PRESENT AT RECOVERY SITE`.
- `EMERGENCY RECOVERY != ROLLBACK AUTHORITY`.
- `RECOVERY MEDIA POSSESSION != RESTORE AUTHORITY`.
- `FRONTIER ABSENT != NO NEGATIVE EVIDENCE`.
- `FRONTIER GENERATION != WALL CLOCK`.

## External evidence and contradiction

Current mature backup systems deliberately maximize survivability. AWS logically air-gapped vaults are locked, can be shared to recovery accounts, and can use multi-party approval so recovery remains possible when the primary account is compromised or inaccessible. Google Backup and DR vaults can enforce immutable retention; CMEK-protected backups may remain restorable through the Backup and DR service agent even if the original workload project disappears, provided the relevant key version remains available.

These are valuable resilience properties, but they create the exact G4 contradiction: a recovery plane intentionally capable of surviving the primary control plane may also survive later revocation, erasure or trust information unless that negative evidence is independently carried into recovery admission.

Therefore provider immutability, vault lock, MPA, cross-account recovery and backup decryptability are inputs to recovery, not proof that restored state is security-current.

## RecoverySafetyFrontier contract

Candidate semantic envelope:

```text
RecoverySafetyFrontier {
  frontier_id
  scope_ref
  generation
  parent_frontier_digest?
  produced_under_policy_revision
  evidence_cut
  negative_claims[]
  security_floors[]
  key_retirement_floors[]
  credential_revocation_floors[]
  artifact_erasure_tombstones[]
  authority_fences[]
  recovery_generation_floors[]
  trust_epoch_floors[]
  malware_or_quarantine_floors[]
  compaction_manifest?
  coverage_claim
  unknown_claims[]
  issuer_set
  signatures_or_attestations[]
  created_observation
}
```

`generation` is a semantic monotonic generation within the declared scope. It is not derived from wall clock and cannot be decreased merely because an older VM snapshot, database backup or DR site is restored.

`coverage_claim` is mandatory. It states what authorities/sources were considered. `NO KNOWN TOMBSTONE` is never promoted to `NO TOMBSTONE EXISTS` when coverage is partial.

## Replication state machine

Candidate lifecycle for each recovery destination:

`FRONTIER_PRODUCED -> REPLICATION_QUEUED -> TRANSFERRED -> DESTINATION_STORED -> DESTINATION_AUTHENTICATED -> MONOTONICITY_CHECKED -> DURABILITY_VERIFIED -> RECOVERY_ADMISSIBLE_COPY`

Failure/uncertainty branches:

- `SIGNATURE_INVALID`
- `ISSUER_NOT_TRUSTED`
- `GENERATION_ROLLBACK_DETECTED`
- `PARENT_CHAIN_GAP`
- `COVERAGE_INCOMPATIBLE`
- `DESTINATION_DURABILITY_UNKNOWN`
- `NEWER_FRONTIER_KNOWN_BUT_UNAVAILABLE`
- `CONFLICTING_FRONTIERS`
- `QUARANTINED`

Replication ACK is not enough. A recovery site needs evidence that the frontier it will rely on is durably retrievable under the same disaster assumptions as the recovery point.

## Anti-rollback without a global oracle

G4 should prefer several independent anti-rollback anchors rather than invent one universal mechanism:

1. provider/versioned immutable storage where available;
2. recovery-site durable highest-seen generation per scope;
3. signed parent/digest chaining so omission/reordering is detectable;
4. independent recovery authority / MPA evidence for exceptional admission;
5. optional hardware/TPM/HSM monotonic anchoring where a deployment can support it;
6. replicated witness/checkpoint records across independent failure domains.

No single anchor is mandatory for every runtime. The semantic contract requires the runtime to declare which anchors support the anti-rollback claim and what remains `UNKNOWN`.

A site that has previously observed generation 84 must not accept generation 71 as current merely because a snapshot restored its local database to generation 70. Highest-seen floors are recovery-critical state and need a persistence strategy independent of the ordinary restore image.

## Late negative evidence

Negative evidence may arrive after a recovery point and even after an older frontier was replicated. The merge law is monotonic for safety floors:

- a later credential revocation is not undone by restoring an earlier credential record;
- a later key-retirement floor is not undone by restoring a backup that still references the key;
- an artifact-erasure tombstone remains admission-relevant while any recoverable occurrence can resurrect the artifact;
- authority/trust epochs cannot be lowered by old state;
- quarantine/malware floors can become stricter without rewriting the historical recovery point.

This is intentionally asymmetric. Positive grants may require fresh current authority; negative safety evidence can survive through a compact frontier.

## Restore modes when frontier currentness is uncertain

The UX and contract should expose distinct modes rather than a generic Restore button:

- `EFFECTIVE_RESTORE`: currentness and required safety coverage qualified.
- `QUARANTINED_RESTORE`: materialize into isolated inspection environment; no production authority, outbound effects or credential/session resurrection.
- `HISTORICAL_INSPECTION_ONLY`: read/forensic access to qualified historical material where policy allows.
- `EMERGENCY_BOUNDED_RESTORE`: explicitly approved, narrow scope, fresh authority, heightened observability, mandatory post-connect reconciliation; it does not declare the missing frontier irrelevant.
- `BLOCKED_FRONTIER_STALE_OR_UNKNOWN`: production restore prohibited.

This keeps availability from becoming fabricated authority.

## Compaction

The RSF cannot grow forever. Compaction is safe only when it preserves every still-live safety implication.

Candidate compaction rule:

`many negative occurrences -> signed compact frontier with semantic floors + retained exceptions + coverage proof`.

A tombstone/fence may be dropped only when there is qualified proof that no admissible recovery point, replica, backup/DR copy, external provider realization or recovery path older than that negative occurrence can reintroduce the subject. Time alone is insufficient unless retention topology and recovery-point expiry are themselves qualified.

Compaction must preserve:

- max security/trust/recovery generations;
- key-retirement and credential-revocation floors;
- artifact tombstones still reachable from retained recovery points;
- unresolved/UNKNOWN residuals;
- policy/issuer lineage required to interpret the frontier;
- proof that the compacted representation dominates its inputs.

`COMPACTION_SUCCESS != SOURCE FRONTIERS DELETABLE` until recovery destinations that depend on them have accepted and durably stored the compacted successor.

## Web Desktop / Application Environment synthesis

The model remains `Builder Home/Factory -> Client -> Workspace -> Desktop Sphere -> Application -> Window -> View/Tab/Tool`. Recovery state does not alter this hierarchy.

Desktop taxonomy remains functional. Observatory may show RSF health/currentness and recovery obligations; Pinned Monitoring Surface may expose bounded read-only frontier status; Operations Desktop may perform qualified restore/recovery commands. A desktop widget is never the recovery-management application.

Window/session semantics remain independent: restoring a Workspace/Window layout does not restore credentials, provider sessions, device trust or effect authority. Multi-display surfaces share semantic state only under the existing session/fencing model; a stale secondary display cannot downgrade a recovery frontier.

Application Manager `Install != Adopt`, `Register != Deploy`, and `Discovered != Verified` remain intact after DR. Restored application registrations are historical observations until lifecycle/provider/currentness are requalified.

Control Center may present desired/effective recovery policy, inheritance and provenance, but policy is not configuration and configuration is not proof that a frontier reached an air-gapped destination.

Declarative service definitions may declare backup/frontier replication intent and provider bindings. Provider YAML/API artifacts remain compiled realizations, not the semantic RSF definition. Vault/environment auto-binding must bind references/authority, never secret values into frontier payloads.

## Application Portfolio Matrix delta

The seven integration modes remain plural:

| Capability | Preferred modes | RSF-specific criteria |
|---|---|---|
| Recovery intent/admissibility | Native SB | semantic authority, provenance, currentness, quarantine modes, replaceability |
| Backup/vault operations | API-backed / Hybrid | provider fidelity, immutable retention, recovery-point identity, effect verification |
| Air-gapped vault specialist recovery | Hybrid / Deep-link | MPA/recovery-account semantics, provider-native diagnostics, no fabricated equivalence |
| KMS/HSM recovery | API-backed / Hybrid / Deep-link / Native bridge where required | key-version fidelity, external-key semantics, local hardware boundary |
| Recovery observability | Native SB + API-backed | frontier generation/currentness, residual UNKNOWN, disclosure minimization |
| Forensic historical inspection | Native SB / Hybrid / Embedded only if isolation is provable | no operational authority inheritance, sandboxing, licensing/security |
| External mature backup console | Deep-link / Embedded only when qualified | SSO/session boundary, framing policy, currentness, authority and lifecycle separation |

Additional portfolio criteria: frontier portability, anti-rollback evidence, offline durability, issuer/trust portability, compaction fidelity, negative-evidence merge, emergency-recovery semantics, provider replacement behavior, recovery-account isolation, licensing, UX/accessibility and lock-in of provider-native recovery metadata.

No mode is universal. API/Hybrid remains preferable for mature provider operations; Native SB owns semantic intent/admissibility/proof; Deep-link preserves specialist recovery surfaces when normalization would fabricate equivalence.

## Proprietary editor/shared foundations impact

The editor family should consume common recovery/currentness primitives rather than implement backup logic. Shared primitives include read-only stale/current badges, provenance inspectors, effect/authority fences, quarantined-mode shells, evidence timelines and accessible status summaries. Workflow/View/Form/Component semantics remain unchanged: `View != Workflow Activity`, `Form != Workflow State`, `Button != Domain Command`. A restored form draft does not restore command authority.

Declarative + opinionated UX should make the safe path obvious: select recovery point -> inspect frontier compatibility -> explain blocked negative evidence -> choose effective/quarantine/historical mode -> acquire fresh authority -> execute -> verify -> reconcile. Automatic qualification may reduce clicks but must remain explainable (`Automatic != hidden`).

## Componentization complexity map delta

High-reuse foundations (future decomposition input, not WBS):

- `RecoverySafetyFrontierBoundary`
- `FrontierIssuerTrustBoundary`
- `FrontierReplicationBoundary`
- `FrontierDurabilityVerificationBoundary`
- `FrontierMonotonicityBoundary`
- `FrontierConflictReconciliationBoundary`
- `NegativeEvidenceMergeBoundary`
- `RecoverySafetyCompactionBoundary`
- `RecoveryPointReachabilityBoundary`
- `EmergencyRestoreQualificationBoundary`
- `QuarantinedRestoreBoundary`
- `PostRestoreFrontierReconciliationBoundary`

C0/C1 semantic atoms: `FrontierRef`, `FrontierGenerationRef`, `SafetyFloorRef`, `NegativeClaimRef`, `CoverageClaimRef`, `RecoveryPointRef`, `RestoreModeRef`, `AntiRollbackEvidenceRef`, `DurabilityEvidenceRef`, `CompactionManifestRef`.

C2 compounds: frontier/currentness card, recovery compatibility summary, negative-evidence blocker, emergency-restore qualification, recovery-point reachability, stale-frontier warning.

C4 application-specific surfaces: Recovery inspector, Security/Key inspector, Backup/DR provider inspector, Operations recovery flow. Provider-specific MPA/vault-lock/KMS tooling remains external or adapter-backed where mature.

## Performance/resource budgets

RSF is intentionally compact, but cost is not free. Future empirical budgets must measure: frontier cardinality by scope, signature verification latency, negative-claim merge cost, recovery-point reachability indexing, offline media replication size, compaction amplification, startup/admission latency, and Observatory fan-out. No numeric threshold is invented in research.

A large raw event log must not be required on the critical restore path. Conversely, compaction cannot trade correctness for small payload size.

## Accessibility and small-screen equivalence

Recovery safety must not depend on a wallboard or multi-window arrangement. A single narrow surface must expose the same complete task: recovery point, frontier generation/currentness, blockers/UNKNOWN, restore mode, authority acquisition, destructive consequences and verification result. Color, spatial position and animations are supplementary; text/state semantics and keyboard/screen-reader operability are mandatory.

## Adversarial proof obligations

At minimum future proofs must cover:

1. recovery point present, latest frontier missing;
2. valid signed but older frontier replayed;
3. local DR database rolled back below highest-seen generation;
4. late credential revocation after backup;
5. late key retirement after backup;
6. artifact erasure tombstone after backup;
7. retained ciphertext that must remain non-restorable;
8. logically air-gapped vault reachable from recovery account after primary compromise;
9. emergency MPA restore with stale frontier;
10. two independently signed conflicting frontiers;
11. issuer key rotation/revocation;
12. frontier replication ACK followed by destination loss;
13. compaction dropping a tombstone while an old recovery point remains reachable;
14. recovery point expiry permitting safe tombstone retirement;
15. backup copy in another provider/region omitted from reachability graph;
16. restored clock older than security floor;
17. restored user/API credential record already revoked;
18. restored KMS reference whose key is destroyed;
19. stale malware/quarantine state;
20. restored external-app session or Native bridge handle;
21. secondary display showing older frontier as current;
22. offline Operations Desktop attempting effective restore without qualified frontier;
23. 9,999 claims current plus one critical UNKNOWN;
24. provider migration changes frontier durability semantics;
25. adapter upgrade changes interpretation of provider recovery state;
26. dedup/shared physical content with erasure scoped to one Client;
27. emergency bounded restore trying to persist as normal authority after reconnect;
28. quarantine environment attempting outbound side effects;
29. signed compact frontier whose parent inputs cannot be proven dominated;
30. old DR media physically possessed by an operator after recovery authority was revoked.

## Saturation / remaining gaps

- Web Desktop hierarchy/taxonomy/window/session: HIGH conceptual saturation.
- Application Portfolio/Application Manager/Control Center: MEDIUM-HIGH.
- restore admissibility after erasure: MEDIUM-HIGH.
- RSF semantic contract: MEDIUM-HIGH.
- offline replication and anti-rollback: MEDIUM conceptually; deployment mechanisms remain intentionally plural.
- compaction/reachability proof: MEDIUM; needs deeper work around expiry and distributed disagreement.
- provider-native air-gap/recovery integration: MEDIUM-HIGH for architectural boundaries, not implementation detail.
- accessibility/small-screen equivalence: MEDIUM-HIGH contractual.
- performance/resource budgets: MEDIUM-LOW empirically.

## Next research vector

The next material gap is **distributed disagreement and fork reconciliation for RecoverySafetyFrontier replicas**: two disconnected DR sites can each learn different negative evidence, issuer/trust rotation can occur while isolated, and later reconnection must compute a safe join without treating last-writer-wins, wall clock or provider replication order as authority. Research should focus on monotonic safety joins, incompatible policy generations, conflict disclosure, quorum/witness options, bounded emergency authority and compaction after fork reconciliation.
