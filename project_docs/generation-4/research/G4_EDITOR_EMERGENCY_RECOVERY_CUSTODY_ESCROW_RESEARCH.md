# G4 — Survivable Emergency-Recovery Custody, Escrow & Ceremony Research

Status: `RESEARCH_ACTIVE / NON_EXECUTABLE`
Execution authority: NONE
Date: 2026-09-23

## Scope

Continuation of the proprietary-editor shared-foundation research, especially `G4_EDITOR_EMERGENCY_TRUST_GOVERNANCE_RECOVERY_RESEARCH.md` and `G4_EDITOR_TRUST_INCIDENT_RECORD_PRIVACY_RETENTION_DISCLOSURE_RESEARCH.md`. This round studies custody/escrow of emergency-recovery material that must survive loss of normal authorities without becoming a concentrated compromise path.

This is P&D documentation only. It does not authorize implementation, provider selection, WBS, Work Package, Sprint or TASK.

Current interface program remains `Builder Home/Factory -> Client -> Workspace -> Desktop Sphere -> Application -> Window -> View/Tab/Tool`; 3D remains optional.

## External pattern evidence reviewed

- NIST SP 800-57 Part 1 Rev. 5 treats key recovery as retrieval/reconstruction from backup/archive and explicitly notes that if operations can continue by re-keying or reconstruction without saved key material, avoiding saved material may reduce compromise exposure. It also distinguishes key types: private signature-key backup is generally undesirable, with limited application-specific exceptions.
- NIST defines split knowledge as dividing a cryptographic key into shares such that fewer than the threshold disclose no key information. This is useful for custody resilience but does not itself prove organizational independence or authorize recovery.
- NIST key-management guidance treats backup storage as independent secure storage and requires lifecycle/destruction treatment for material no longer needed.
- TUF uses separation of signing responsibilities, signature thresholds and offline root keys to reduce single-key compromise risk. If a threshold of Root keys is compromised, Root metadata must be re-issued out-of-band. These are survivability patterns, not a provider choice.
- Manual/offline transfer is only a transport mechanism; physical movement of a device/document containing a key/component does not itself establish authority.

## F173 — Emergency survivability is a portfolio of recovery capabilities, not “back up the root key”

The product should not assume that every trust/recovery artifact needs recoverable secret material. Candidate recovery classes:

- `RECONSTRUCT_FROM_SHARES`
- `RESTORE_FROM_PROTECTED_BACKUP`
- `REKEY_WITH_PREAUTHORIZED_SUCCESSOR`
- `REISSUE_FROM_INDEPENDENT_RECOVERY_AUTHORITY`
- `VERIFY_HISTORICAL_ONLY`
- `NON_RECOVERABLE_BY_DESIGN`

`recoverable != backed-up private key`.

The recovery class is selected per key/material purpose and proof obligation. Signature, encryption, authentication and trust-bootstrap material need not share the same recovery law.

## F174 — Custody, authority and cryptographic possession are independent dimensions

A custodian can possess a share without authority to activate recovery. An authority can approve recovery without possessing enough cryptographic material to execute it.

Candidate separation:

```text
CustodyAssignment
  materialClass
  share/componentRef
  custodianSubject/domain
  storageBoundary
  permittedCustodyOperations[]
  activationAuthorityRef
  independenceAssumptions[]
  currentness/expiry
```

`holds share != can authorize recovery`.

`can authorize recovery != can reconstruct secret`.

## F175 — Threshold cryptography reduces single-share exposure but does not prove independence

NIST split knowledge gives a strong cryptographic property: fewer than the threshold shares disclose no key value. It does not prove that custodians, identity providers, employers, sites or devices fail independently.

Candidate `CustodyIndependenceProfile` dimensions:

- human/organizational control;
- identity/credential domain;
- physical/site failure domain;
- hardware/module boundary;
- administrative account/control plane;
- network/connectivity dependency;
- legal/jurisdictional dependency where material;
- supply-chain/provider dependency.

`k-of-n shares != k independent failure domains`.

## F176 — Custody topology must optimize compromise resistance and survivability together

Centralizing all recovery material maximizes operational simplicity but creates a compromise/disaster concentration. Excessive dispersion can make recovery impossible.

Candidate disposition evaluates both:

`COMPROMISE_CONCENTRATION_RISK` and `RECOVERY_UNAVAILABILITY_RISK`.

A topology is not qualified merely because its threshold arithmetic works. It must survive declared loss/compromise scenarios without silently reducing security floors.

## F177 — Backup, escrow, archive and active emergency material are semantically different

Candidate states/classes:

- `ACTIVE_OPERATIONAL`
- `DORMANT_RECOVERY`
- `BACKUP_RECOVERABLE`
- `ARCHIVED_HISTORICAL`
- `ESCROWED_CONDITIONALLY_RELEASABLE`
- `RETIRED_PENDING_DESTRUCTION`
- `DESTROYED_ATTESTED`

`stored somewhere != admissible for recovery`.

A historical verification key can remain available while its corresponding signing capability is retired/non-recoverable.

## F178 — Recovery ceremony is a first-class governed occurrence

Reconstruction/import/use of emergency material should be represented as a bounded ceremony, not an invisible admin action.

Candidate:

```text
RecoveryCeremonyOccurrence
  incidentRef
  policyRevision
  requestedOperation
  participatingCustodians[]
  participatingAuthorities[]
  independenceEvaluation
  materialComponentsUsed[]
  environment/device attestations[]
  activationWindow
  resultingTrustRevision/package
  destruction/zeroization obligations[]
  evidenceRefs[]
  disposition
```

`shares assembled != recovery authorized`.

`recovery authorized != ceremony completed safely`.

## F179 — Secret reconstruction should be avoided when threshold use can remain non-exportable

Where the cryptographic mechanism permits threshold/independent operations without materializing a complete secret outside protected boundaries, that pattern has lower concentration risk than reconstructing a long-lived root in general memory.

This remains technology-neutral research; it does not select threshold-signature, HSM or MPC providers.

`threshold authorization != requirement to reconstruct one portable private key`.

If reconstruction is unavoidable, the ceremony needs an explicit ephemeral exposure boundary and post-use destruction evidence.

## F180 — Recovery material has its own currentness and anti-rollback lifecycle

A perfectly protected share of a superseded recovery generation must not resurrect stale authority.

Candidate `RecoveryMaterialGeneration` binds:

- recovery-policy revision;
- trust-domain scope;
- material/share generation;
- algorithm/security profile;
- activation horizon;
- successor/predecessor relation;
- revocation/suspension status;
- observed recovery floor.

`share cryptographically valid != share currently admissible`.

## F181 — Custodian replacement must not silently lower threshold or independence

Loss, departure or compromise of a custodian requires a governed resharing/rekey/reissue transition. Temporarily changing 3-of-5 to 1-of-2 for convenience is a security-policy change, not maintenance.

`custodian unavailable != threshold may be weakened`.

A replacement ceremony preserves or explicitly requalifies the declared security/independence profile.

## F182 — Lost shares and suspected compromise need different remediation

`LOST_UNAVAILABLE`, `SUSPECTED_EXPOSED`, `PROVEN_EXPOSED`, `DESTROYED_CONFIRMED`, `CUSTODIAN_UNTRUSTED` and `STATUS_UNKNOWN` have different consequences.

A lost-but-confidential share may primarily reduce availability. A copied/exposed share changes compromise margin and can force generation replacement. `UNKNOWN` cannot be treated as destroyed.

## F183 — Recovery-policy and recovery-material lifecycles must be mutually pinned

A dangerous circularity appears if old material can activate a new policy merely because the new policy references it, or if a new policy can retroactively authorize old material.

Candidate admission requires a qualified relation among:

`policy revision × material generation × trust floor × authority set × operation class`.

`policy current != material current` and `material current != policy current`.

This prepares the next research vector: stale/ambiguous/compromised `EmergencyTrustRecoveryPolicy` itself.

## F184 — Geographic/site diversity is evidence only when correlated dependencies are modeled

Putting shares in two buildings does not create independent custody if both depend on the same cloud identity, administrator, HSM cluster, power domain or organizational principal.

The editor should expose correlated-dependency findings rather than presenting “N locations” as a security score.

`different location != independent failure domain`.

## F185 — Recovery rehearsal must test custody reachability without activating effective trust

Preview/Sandbox can run non-effective drills that test:

- custodian reachability and succession contacts;
- policy/material generation matching;
- threshold/independence evaluation;
- package parsing/verification;
- offline transport procedure;
- ceremony role separation;
- destruction/zeroization checklist;
- post-recovery qualification plan.

No production secret should be unnecessarily reconstructed merely to prove that the process exists.

`drill success != production authority activated`.

## F186 — Shared Editor Foundation needs Custody Topology and Recovery Ceremony projections

Reusable projections should expose material classes/generations, custody assignments, threshold and independence requirements, failure-domain overlays, lifecycle/currentness, rehearsal status, unresolved risks and evidence.

The guided UX should make unsafe composition difficult:

- incompatible custodian combinations disabled with reasons;
- threshold shortfall and correlated-control dependencies surfaced before authorization;
- stale material visually distinct from missing material;
- policy/material generation mismatch blocking effective recovery;
- recovery actions requiring explicit purpose/incident/operation scope;
- keyboard/list/tree/Inspector equivalents for all topology actions.

Spatial topology is optional; accessibility never depends on drag.

## F187 — Revision/Diff needs custody-semantic diff, not merely member-list diff

A change from custodians `[A,B,C]` to `[A,D,E]` can preserve count while radically changing independence and recovery posture.

Candidate facets:

`CUSTODIANS`, `THRESHOLD`, `INDEPENDENCE`, `FAILURE DOMAINS`, `MATERIAL GENERATION`, `POLICY PINNING`, `STORAGE/TRANSPORT`, `CURRENTNESS`, `REHEARSAL`, `DESTRUCTION`, `RECOVERY CAPABILITY`.

`same n/k != same custody guarantee`.

## Semantic bridge findings

The typed chain becomes:

```text
Workflow/View/Form/Component/Rule revision
 -> Command/Action intent
 -> Permission/Policy authority
 -> PublishBundle qualification
 -> verifier + TrustSetRevision/TrustBridgeQualification
 -> ProofEnvelope / runtime EffectOccurrence
 -> trust incident/fork
 -> EmergencyTrustRecoveryPolicy
 -> RecoveryMaterialGeneration + CustodyAssignment
 -> RecoveryCeremonyOccurrence
 -> EmergencyTrustRecoveryPackage / successor trust lineage
 -> post-recovery qualification
 -> Evidence currentness + Revision/Diff projection
```

Ownership remains separate. `View != Workflow Activity`; `Form != Workflow State`; `Button != Domain Command`; `Component event != authorized action`; `visual transition != business transition`; `custodian != recovery authority`; and `recovery authority != business-effect authority`.

## Required/adversarial scenarios

1. Five shares are stored at five addresses but all custodians authenticate through one compromised IdP: threshold arithmetic passes; independence remains failed/UNKNOWN.
2. One custodian leaves the organization: replacement does not silently weaken 3-of-5 or reuse their old share indefinitely.
3. One share is lost but no compromise is suspected: availability margin changes; historical trust is not declared compromised.
4. One share is copied by an attacker: compromise margin changes and generation replacement may be required.
5. A stale share from generation G3 is presented during G5 recovery: anti-rollback rejects it even if its cryptographic checksum is valid.
6. Policy P5 expects material G5, but two custodians hold G4: recovery remains blocked/UNKNOWN.
7. All shares are in one safe/HSM/site: physical loss or compromise demonstrates concentration risk.
8. Shares are geographically separate but controlled by the same administrator account: correlated-control finding remains blocking where independence is required.
9. Threshold is met by two signatures from the same underlying organizational controller: independence obligation is not fabricated.
10. Recovery can be achieved by issuing a preauthorized successor without restoring the old private signing key: prefer successor/rekey path where contract allows.
11. A private signature key is archived “just in case” despite policy declaring it non-recoverable: finding blocks qualification.
12. Ceremony reconstructs a secret in exportable memory and fails to prove destruction: recovery outcome remains qualified/at-risk rather than silently clean.
13. Factory is unavailable but local policy/material/evidence are sufficient: runtime can evaluate recovery locally; Factory is not an online oracle.
14. USB carries a valid share/package: transport provenance does not grant activation authority.
15. Recovery drill uses simulated shares and passes: it proves procedure compatibility, not production-key possession/effective recovery.
16. Policy expires while custodians are offline: possession of shares does not extend policy currentness.
17. One custodian is under legal/administrative hold: hold on records does not automatically make secret material usable forever.
18. Custody map is partially redacted for the viewer: UI distinguishes withheld topology from absent custody.
19. 10k clients report recovery posture to Factory: fleet aggregate does not reveal raw custodian identities or create cross-client stable identities.
20. Drag UI is unavailable: full custody review, threshold evaluation and ceremony review remain accessible through list/tree/Inspector/keyboard.

## Proof/test obligations for later qualification

1. Fewer than the declared cryptographic threshold cannot satisfy a reconstruction/use claim.
2. Threshold satisfaction cannot satisfy an unmet organizational-independence requirement.
3. A custodian cannot gain activation authority solely by holding a share.
4. An activation authority cannot fabricate possession of required material.
5. Stale/superseded material cannot lower the observed recovery/trust floor.
6. Custodian replacement preserves or explicitly requalifies threshold and independence guarantees.
7. `LOST` cannot be rendered as `COMPROMISED`, and `UNKNOWN` cannot be rendered as `DESTROYED`.
8. Recovery transport cannot create authority.
9. Policy/material generation mismatch blocks effective activation.
10. Rehearsal evidence cannot satisfy production effective-recovery evidence.
11. Reconstruction exposure and required destruction/zeroization remain evidence-producing states.
12. Historical verification can remain available after signing capability retirement where policy permits.
13. Custody topology aggregation cannot expose withheld identities through derived indexes/tooltips/export.
14. Revision/Diff reports semantic guarantee changes even when n/k counts remain unchanged.
15. Offline recovery does not require Factory connectivity when locally sufficient qualified evidence exists.
16. Emergency recovery cannot authorize arbitrary Domain Commands/effects.
17. Every spatial custody operation has an equivalent non-spatial accessible operation.
18. Preview/Sandbox remains visibly non-effective and pinned to explicit policy/material generations.

## Reusable primitives / editor integration

### Shared primitive

`RecoveryMaterialGenerationRef`, `CustodyAssignmentRef`, `CustodyIndependenceProfileRef`, `RecoveryCeremonyOccurrenceRef`, `RecoveryCapabilityDisposition`, `MaterialLifecycleState`.

### Editor infrastructure

- Custody Topology projection;
- Recovery Ceremony Review;
- threshold + independence evaluator;
- correlated-failure-domain findings;
- material/policy currentness Inspector;
- rehearsal evidence projection;
- custody-semantic Revision/Diff facets;
- accessible list/tree alternative to topology canvas.

### Proprietary apps

- **Workflow Designer:** may reference recovery/human-authorization activities but does not own custody/trust semantics.
- **Component Editor / Componentes:** states for `STALE`, `BLOCKED`, `PERMISSION_DENIED`, `PENDING`, `EFFECTIVE` must remain projection states, not authority.
- **View/Page Builder + Form Builder:** disclosure-safe custody/recovery projections and required-input forms; forms do not become recovery state machines.
- **Rules/Decision Editor:** can express policy predicates but rule text/AST is not cryptographic possession or recovery authority.
- **System/Module Designer:** shows dependency/failure-domain impact without converting topology into trust ownership.
- **Elicitation/Requirements:** captures recovery objectives, custodian constraints and evidence obligations with provenance.
- **Preview/Sandbox:** rehearses pinned non-effective recovery scenarios; simulation never becomes effective trust.
- **Revision/Diff:** compares custody guarantees/currentness/material lineage, not only member lists.

### Cross-app semantic integration

Custody/recovery references remain typed edges into Trust/Evidence semantics. Editors consume and project these contracts; none silently owns or collapses them.

## Componentization complexity / dependency hotspots

- **P0 LOW/MEDIUM:** lifecycle/status refs, material-generation badges, explicit missing/withheld/unknown states.
- **P1 MEDIUM/HIGH:** threshold/independence Inspector, Custody Topology, ceremony timeline, accessible list/tree, rehearsal projections.
- **P2 HIGH/VERY HIGH:** editor adapters, disclosure-safe topology, semantic Revision/Diff, offline package review.
- **P3 EXTREME:** correlated-failure-domain qualification, resharing/rekey transitions, anti-rollback across offline material generations, ceremony evidence/currentness, survivability-versus-compromise optimization.

Primary complexity product:

`material class × generation × policy revision × threshold × independence domains × storage/transport boundary × currentness × trust floor × incident state × operation class`.

## Maturity / saturation

Subfront status: `ADVANCED_EMERGING / MATERIAL_DELTA`.

This round materially closes the simplistic “escrow/backup” gap: survivability is modeled as recovery capability + custody + authority + independence + currentness + ceremony, rather than one copied super-root.

## Remaining gaps / next vector

Highest-value next vector: **what happens when `EmergencyTrustRecoveryPolicy` itself is stale, ambiguous, mutually forked, or signed by authorities later proven compromised**. Research should distinguish policy provenance from current admissibility, establish whether any constitutional/minimal recovery invariants can survive policy loss without becoming an immortal super-root, and define bounded human/governance intervention when no policy branch is safely admissible.

Secondary gaps: privacy/retention of custody maps and ceremony records beyond the already-established incident-record rules; empirical recovery-drill evidence; and cryptographic/provider-specific feasibility only after later executive authorization.