# G4 — Emergency Trust-Governance Recovery for Proprietary Editors

Status: `RESEARCH_ACTIVE / NON_EXECUTABLE`
Execution authority: NONE
Date: 2026-09-23

## Scope

Continuation of the proprietary-editor shared-foundation research, especially `G4_EDITOR_BOUNDED_TRUST_FORK_RECONCILIATION_RESEARCH.md`. This round studies break-glass/emergency recovery when normal reconciliation authorities, trust anchors, or quorum members are unavailable, suspected compromised, or mutually inconsistent. It remains P&D documentation only: no implementation, provider selection, WBS, Work Package, Sprint or TASK is authorized.

Current interface program remains `Builder Home/Factory -> Client -> Workspace -> Desktop Sphere -> Application -> Window -> View/Tab/Tool`; 3D remains optional.

## External pattern evidence reviewed

- NIST SP 800-57 Part 2 requires compromise-recovery policy to prescribe roles, responsibilities, facilities and procedures, including recognition/reporting, notification, replacement, recording of recovery actions, and destruction/de-registration where appropriate. Part 1 emphasizes contingency planning and the tension between redundancy for continuity and increased compromise surface.
- TUF documents that compromise of a threshold of Root keys requires Root metadata to be re-issued out-of-band. This is a useful pattern for recovery from loss of the normal trust-update path, but not a product/provider selection.
- Sigstore/TUF uses offline root keys, threshold signing, rotation, compromise-time-aware revocation and freshness. Threshold governance reduces single-key risk but does not itself establish semantic/business authority.
- RFC 5011 distinguishes trust-anchor addition, hold-down, revocation and emergency rollover; revocation is not equivalent to simply removing a key from the observed set.
- CISA IAM guidance recommends separation of duties and, for emergency administrative access, tightly protected break-glass accounts with multiple-user coordination and extensive logging/auditing. This supports bounded emergency authority rather than a permanent omnipotent super-root.

## F143 — Emergency recovery is a distinct authority mode, not ordinary reconciliation with a bypass flag

Normal `ReconciliationAuthorityPolicy` assumes enough trusted authority remains to evaluate a fork. Emergency recovery begins when that assumption is itself false or unprovable.

Candidate:

```text
EmergencyTrustRecoveryPolicy
  trustDomainId
  policyRevision
  activationPredicates[]
  recoveryAuthorities[]
  threshold/independenceRequirements
  permittedOperationClasses[]
  maximumAuthorityScope
  activationHorizon
  recoveryPackageRequirements[]
  audit/evidenceRequirements[]
  exitConditions[]
  successorQualificationRequirements[]
```

`normal authority unavailable != emergency authority automatically active`.

Emergency mode requires explicit evidence that its activation predicate is satisfied.

## F144 — Break-glass must be pre-bounded; it must not create an immortal super-root

A recovery mechanism that can override every future policy is a latent permanent root. Emergency authority therefore needs bounded scope, time/currentness horizon, operation classes and explicit termination.

Candidate lifecycle:

`DORMANT -> ACTIVATION_REQUESTED -> ACTIVATION_QUALIFIED -> ACTIVE_BOUNDED -> RECOVERY_COMMITTED -> EXIT_PENDING -> RETIRED`.

`break-glass credential exists != break-glass authority currently admissible`.

After exit, emergency credentials/authority cannot silently remain a normal administrative path.

## F145 — Recovery authority should prefer threshold + separation of duties over a single emergency principal

Where the risk warrants it, emergency activation should require multiple independently governed factors/subjects. Threshold satisfaction remains evidence under a named policy, not majority truth.

Independence assumptions must be explicit: two signatures controlled by the same compromised administrative domain do not necessarily provide two independent trust facts.

`two signers != two independent authorities`.

## F146 — Emergency recovery needs a bootstrap trust root that is narrower than business authority

The recovery root's job is to restore/replace trust governance, not to authorize arbitrary domain Commands or Effects.

Candidate operation classes:

- `RECOVER_TRUST_METADATA`
- `REVOKE_COMPROMISED_TRUST`
- `INSTALL_SUCCESSOR_TRUST`
- `QUARANTINE_ADMISSIONS`
- `AUTHORIZE_RECOVERY_PACKAGE`

Explicitly excluded unless separately authorized:

- arbitrary `DOMAIN_COMMAND`
- arbitrary `WORKFLOW_TRANSITION`
- arbitrary `DATA_MUTATION`
- arbitrary `EXTERNAL_EFFECT`

`authority to recover trust != authority to perform business effects`.

## F147 — Out-of-band recovery is a transport path, not a source of authority

TUF's out-of-band root recovery is a useful pattern. For G4, USB/file/manual transfer, Factory delivery or operator import can carry an `EmergencyTrustRecoveryPackage`, but transport provenance cannot manufacture authority.

```text
EmergencyTrustRecoveryPackage
  incidentRef
  affectedTrustDomain
  predecessorTrustHeads[]
  compromise/unavailabilityEvidence[]
  activationPolicyRef
  recoveryAuthorityAttestations[]
  revoked/suspendedSubjects[]
  successorTrustSetRevision
  antiRollbackFloor
  validity/currentnessConstraints
  requiredPostRecoveryQualification[]
```

The receiving runtime evaluates the package locally against its durable recovery policy/floor.

## F148 — Recovery must distinguish suspected compromise, proven compromise and authority loss

These situations require different consequences:

- `SUSPECTED_COMPROMISE`
- `PROVEN_COMPROMISE`
- `AUTHORITY_UNAVAILABLE`
- `QUORUM_UNREACHABLE`
- `AUTHORITY_FORKED`
- `RECOVERY_POLICY_UNRESOLVABLE`

Suspicion may justify quarantine/new-effect blocking without retroactively declaring every historical proof invalid. Proven compromise may trigger a bounded retrospective review from a qualified compromise time/window.

`incident detected != historical evidence automatically false`.

## F149 — Emergency admission is operation-scoped and should fail closed for new irreversible effects

A trust incident need not make the entire editor unusable. Candidate operation matrix remains explicit:

`HISTORICAL_VERIFY`, `READ`, `EDIT_DRAFT`, `SIMULATE`, `AUTHORIZE`, `PUBLISH`, `NEW_EFFECT`, `COMPENSATE`, `RECOVER_TRUST`.

Typical conservative disposition during unresolved root compromise: historical/read/draft may remain available under visible qualification; new publish/effect is `BLOCKED/UNKNOWN`; trust recovery remains available only through the emergency path.

`recovery availability != business-effect availability`.

## F150 — Recovery cannot lower a durable ObservedTrustFloor merely to regain availability

Emergency recovery is not an anti-rollback exception. A recovery package must meet or explicitly supersede the local floor through a qualified stronger transition rule.

If no admissible bridge exists, the runtime remains quarantined even if an older root would restore connectivity.

`emergency != permission to downgrade`.

## F151 — A recovery event creates a new trust lineage; it does not rewrite the compromised branch

The compromised/unavailable trust history remains immutable evidence. Recovery produces a successor lineage with explicit relation to predecessor heads and incident evidence.

Historical admissions/effects remain attributable to the trust revision under which they occurred. Subsequent reclassification is an additional disposition, not deletion.

`recovered history != rewritten history`.

## F152 — Emergency recovery requires post-recovery qualification before normal authority resumes

Installing a successor root is not enough. Normal operation resumes only after required verifiers, bridges, policy/currentness floors and affected PublishBundles have been requalified to the declared extent.

Candidate vector:

```text
PostRecoveryQualification
  trustSetCurrentness
  verifierCurrentness
  bridgeCurrentness
  authorityPolicyCurrentness
  publishBundleImpactDisposition
  historicalReviewDisposition
  effectRemediationDisposition
```

`successor trust installed != system fully qualified`.

## F153 — Recovery of trust governance and remediation of external effects are separate workflows

If compromised authority caused payments, messages, provisioning or other external effects, replacing trust metadata does not undo them. Effect Lineage remains authoritative for occurrence facts; compensation/reconciliation follows each effect's own contract.

`trust recovered != effects compensated`.

## F154 — Recovery policy itself needs survivable, testable evidence

A break-glass plan that has never been exercised may fail exactly when needed. Research candidate: periodic non-effective rehearsal in Preview/Sandbox against pinned trust snapshots, with evidence that the recovery package can be parsed, validated, authorized and locally applied in simulation.

Rehearsal never activates effective emergency authority.

`recovery drill PASS != production recovery activated`.

## F155 — Shared Editor Foundation needs Emergency Trust Review as a reusable projection

Reusable projection should expose:

- incident class/evidence and current confidence;
- normal authority availability;
- emergency activation prerequisites;
- recovery authority subjects and independence assumptions;
- scope/time/operation bounds;
- predecessor heads and successor candidate;
- observed floors and downgrade checks;
- affected verifiers/bridges/bundles/effects;
- post-recovery qualification obligations;
- exit/retirement status;
- immutable audit/evidence lineage.

Guided UX should make the safe path easier: incompatible recovery candidates disabled with reasons, missing evidence surfaced before authorization, and `UNKNOWN` never rendered as success.

Every action must have keyboard/list/tree/Inspector equivalents; drag/spatial review is optional.

## F156 — Revision/Diff needs Emergency Recovery Diff distinct from artifact/trust-fork diff

Candidate facets:

`INCIDENT`, `ACTIVATION BASIS`, `RECOVERY AUTHORITY`, `REVOKED/SUSPENDED TRUST`, `SUCCESSOR TRUST`, `SECURITY FLOOR`, `POST-RECOVERY QUALIFICATION`, `EFFECT IMPACT`, `EXIT/RETIREMENT`, `CURRENTNESS`.

This allows a small trust-metadata change to expose its governance and blast radius without confusing it with Workflow/Form/Component source changes.

## Semantic bridge findings

The typed chain remains:

```text
Workflow/View/Form/Component/Rule revision
 -> Command/Action intent
 -> Permission/Policy authority
 -> PublishBundle qualification
 -> verifier + TrustSetRevision/TrustBridgeQualification
 -> ProofEnvelope / Preview evidence
 -> runtime EffectOccurrence
 -> trust incident/fork evidence
 -> EmergencyTrustRecoveryPolicy/Package
 -> successor trust lineage + post-recovery qualification
 -> Evidence currentness + Revision/Diff projection
```

Ownership remains separate. `Button != Domain Command`; `Component event != authorized action`; `View != Workflow Activity`; `Form != Workflow State`; `visual transition != business transition`; and emergency trust authority does not collapse any of these boundaries.

## Required/adversarial scenarios

1. Normal 3-of-5 reconciliation quorum loses three members: emergency path does not activate merely because quorum is inconvenient.
2. Two normal root holders are suspected compromised but not proven: new irreversible effects block; historical evidence remains separately interpretable.
3. Threshold of normal Root keys is compromised: successor trust requires qualified out-of-band recovery under pre-bounded emergency policy.
4. One emergency custodian attempts unilateral activation where policy requires independent 2-of-3: reject.
5. Two emergency signatures are produced from principals controlled by the same compromised identity domain: independence requirement remains unsatisfied/UNKNOWN.
6. Factory is unavailable but runtime has valid local emergency policy/package evidence: recovery can be evaluated locally; Factory is not an online oracle.
7. Imported recovery package is cryptographically valid but below runtime's ObservedTrustFloor: reject/quarantine.
8. Emergency package grants a signer arbitrary Domain Command authority: reject as scope expansion.
9. Successor trust is installed but verifier/bridge qualification is stale: normal publish/effect remains blocked until required post-recovery qualification.
10. Compromised trust previously authorized an irreversible external payment: trust recovery preserves the occurrence and opens effect remediation; it does not erase payment history.
11. Emergency credential remains present after recovery: retirement/exit state prevents silent continued use.
12. Recovery drill succeeds in Preview but production trust differs: drill evidence is stale/non-effective for production activation.
13. Compromise evidence later narrows the affected time window: historical review disposition updates without rewriting original occurrence/evidence.
14. Schema/canonicalization changes during recovery: successor proof requires qualified representation bridge where material; re-signing bytes is not semantic requalification.
15. Drag UI is unavailable: full incident/recovery review and authorization remains possible by keyboard/list/Inspector.
16. 100k bundles depend on affected verifier/trust: findings aggregate by root cause while preserving blocking/UNKNOWN minority truth.

## Reusable primitives / editor integration

### Shared primitive

`TrustIncidentRef`, `EmergencyTrustRecoveryPolicyRef`, `EmergencyRecoveryPackageRef`, `RecoveryAuthorityRef`, `PostRecoveryQualificationRef`, recovery lifecycle/disposition badges.

### Editor infrastructure

- Emergency Trust Review projection;
- activation-prerequisite/authority Inspector;
- operation-scoped admission matrix;
- package viewer/import review;
- affected-set/root-cause findings;
- post-recovery qualification tracker;
- non-spatial/keyboard authorization flow;
- impact-graph edges for incident/recovery/successor dependencies.

### Proprietary apps

- Workflow Designer: projects affected workflow proofs/effects and remediation obligations; does not own trust recovery.
- Componentes: reuses `STALE`, `READ_ONLY`, `DISABLED`, `BLOCKED`, `PERMISSION_DENIED`, `PENDING`, `EFFECTIVE` only where semantically applicable; trust state is not encoded as arbitrary visual variant explosion.
- View/Page/Form: drafts may remain editable while authorize/publish/effect is blocked; binding findings remain distinct from trust findings.
- Rules/Decision: can express/review recovery policy candidates but cannot self-authorize activation.
- System/Module Designer: declares trust-domain/recovery topology requirements without making topology authority.
- Elicitation/Requirements: captures incident rationale/recovery requirements; cannot activate trust.
- Preview/Sandbox: rehearses recovery against pinned snapshots; never proves effective activation.
- Revision/Diff: primary projection for recovery lineage/impact; not trust owner.

### Cross-app semantic integration

P3 remains the hotspot: emergency authority, trust revisions, verifier/bridge currentness, PublishBundle qualification and runtime EffectOccurrence histories must remain independently owned/versioned while being reviewable as one recovery incident.

## Componentization / dependency complexity

- **P0 LOW/MEDIUM:** incident/policy/package refs, lifecycle and disposition primitives.
- **P1 MEDIUM/HIGH:** Emergency Trust Review, operation matrix, findings aggregation, package viewer, post-recovery tracker.
- **P2 HIGH/VERY HIGH:** app-specific impact adapters and Preview/Revision projections.
- **P3 EXTREME:** emergency authority qualification, independence assumptions, anti-rollback floors, out-of-band bootstrap, compromise windows, cross-domain bridges and effect remediation.

State-explosion hotspot: `incident × trust branch × recovery policy revision × authority set × independence assumption × operation class × observed floor × verifier/bridge revision × environment × effect disposition`. UI must query/project this state rather than encode it as component variants.

## Proof obligations

1. Emergency authority activates only under an explicit qualified activation predicate.
2. Emergency authority is scope/time/operation bounded and has explicit exit/retirement.
3. Recovery authority cannot silently become arbitrary business-command/effect authority.
4. Threshold evaluation uses exact policy revision/scope and declared independence assumptions.
5. Out-of-band transport never manufactures authority.
6. Recovery cannot lower an ObservedTrustFloor merely to restore availability.
7. Historical admissions/effects remain auditable after recovery.
8. Successor trust installation does not imply verifier/bridge/bundle qualification is complete.
9. Trust recovery never erases or manufactures external-effect settlement.
10. Suspected/proven compromise and simple authority unavailability remain distinct.
11. Preview/rehearsal evidence cannot activate production recovery implicitly.
12. Emergency credentials/authority cannot remain silently active after exit.
13. Every recovery action has a keyboard/non-drag equivalent and preserves semantic focus.
14. Findings aggregation preserves blocking/UNKNOWN minority truth.
15. Incremental affected-set calculation is equivalent to full qualification for qualified fixtures or degrades to UNKNOWN/full requalification.
16. Representation/canonicalization migration during recovery requires its own qualified semantic bridge when material.

## Research maturity / saturation

`EDITOR_EMERGENCY_TRUST_GOVERNANCE_RECOVERY = ADVANCED_EMERGING / MATERIAL_DELTA`.

High-confidence conclusions:

- break-glass is a distinct, pre-bounded governance mode, not a universal bypass;
- recovery authority should be narrower than business authority and should not become an immortal super-root;
- out-of-band recovery can preserve autonomous runtime operation without making Factory an online oracle;
- anti-rollback floors and historical effect lineage survive emergency recovery;
- successor trust requires explicit post-recovery qualification before normal operation resumes;
- shared editor infrastructure can project emergency recovery consistently without collapsing ownership.

Open gaps / next vector:

1. privacy, retention and disclosure rules for incident/fork/admission/recovery records themselves;
2. survivable custody/escrow of emergency recovery material without creating a concentrated compromise target;
3. policy evolution when the emergency policy itself is stale, ambiguous or signed by now-compromised authorities;
4. empirical recovery drills and proof-currentness budgets for long-offline runtimes;
5. bounded human factors: preventing panic-driven scope expansion while keeping emergency recovery operable.

## Source notes

- NIST SP 800-57 Part 2 Rev. 1, §6.2.14 Compromise Recovery; Part 1 Rev. 5 contingency/compromise-recovery guidance.
- The Update Framework FAQ: threshold Root compromise requires Root metadata re-issuance out-of-band.
- Sigstore Threat Model: offline threshold root keys, rotation, compromise-time-aware revocation and freshness.
- RFC 5011 / RFC 4986: trust-anchor update, revocation, normal versus emergency rollover patterns.
- CISA Identity and Access Management / cloud guidance: separation of duties, protected break-glass access and extensive audit/logging.

Pattern evidence only; no external technology is selected.