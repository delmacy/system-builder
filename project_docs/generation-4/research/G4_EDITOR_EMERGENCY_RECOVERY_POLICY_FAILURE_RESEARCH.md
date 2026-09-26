# G4 — Emergency Recovery Policy Failure, Ambiguity & Constitutional Floor Research

Status: `RESEARCH_ACTIVE / NON_EXECUTABLE`
Execution authority: NONE
Date: 2026-09-23

## Scope

Continuation of the proprietary-editor/shared-foundation research, especially `G4_EDITOR_EMERGENCY_TRUST_GOVERNANCE_RECOVERY_RESEARCH.md`, `G4_EDITOR_BOUNDED_TRUST_FORK_RECONCILIATION_RESEARCH.md`, `G4_EDITOR_TRUST_INCIDENT_RECORD_PRIVACY_RETENTION_DISCLOSURE_RESEARCH.md`, and `G4_EDITOR_EMERGENCY_RECOVERY_CUSTODY_ESCROW_RESEARCH.md`.

This round studies the harder case where `EmergencyTrustRecoveryPolicy` itself is stale, ambiguous, forked, unavailable, internally inconsistent, or was authorized by authorities later shown to be compromised. This is documentation-only P&D. It does not authorize implementation, provider selection, WBS, Work Package, Sprint or TASK.

Current interface program remains `Builder Home/Factory -> Client -> Workspace -> Desktop Sphere -> Application -> Window -> View/Tab/Tool`; 3D remains optional.

## External pattern evidence reviewed

- TUF root rotation requires the successor root to satisfy both the old trusted root threshold and the new root threshold. This is a continuity pattern: the new policy cannot simply self-authorize its own installation. TUF also uses monotonically increasing root versions and rollback/freeze defenses.
- TUF explicitly requires out-of-band root re-issuance when a threshold of root keys is compromised. Out-of-band is a recovery transport/bootstrap path, not evidence that arbitrary replacement policy is valid.
- RFC 5011 permits automated recovery while at least one uncompromised trust anchor remains; if all trust anchors are compromised, manual/out-of-band update is required. It also makes trust-anchor update acceptance a local resolver-owner decision.
- RFC 4986 requires compromise recovery when at least one known-uncompromised trust anchor remains and requires rollover not to degrade the existing trust relation.
- RFC 6024 requires recovery from loss/compromise of trust-anchor-management keys and notes that at least one trust-anchor manager must be established during initial trust-store configuration; it also warns that trust-manager errors can cause denial of service or serious security consequences.
- NIST SP 800-57 requires documented compromise-recovery plans with named roles, replacement procedures, inventory, monitoring and recording of compromise/recovery actions. This supports explicit governance lifecycle rather than implicit emergency discretion.
- Sigstore/TUF operational patterns use offline threshold roots, rotation, revocation, compromise-time awareness and freshness. These are patterns for bounded continuity, not authority for System Builder to adopt any provider or trust topology.

## F188 — Recovery policy is governed evidence, not an immortal constitutional root

`EmergencyTrustRecoveryPolicy` must have provenance, immutable revision identity, activation/admissibility conditions, currentness, authority basis and supersession/revocation lineage.

`policy present != policy currently admissible`.

`policy once authorized != policy authoritative forever`.

A recovery policy is itself subject to trust evolution. Treating one bootstrap document as permanently supreme would recreate the concentrated super-root that the recovery model is intended to avoid.

## F189 — Policy validity, policy clarity and policy applicability are independent

Candidate dimensions:

```text
RecoveryPolicyAssessment
  provenanceDisposition
  signatureDisposition
  authorityDisposition
  currentnessDisposition
  ambiguityDisposition
  internalConsistencyDisposition
  incidentApplicabilityDisposition
  dependencyDisposition
  observedFloorCompatibility
  overallAdmissionDisposition
```

A correctly signed policy can still be stale, ambiguous, internally contradictory or inapplicable to the current incident.

`signature valid != policy unambiguous != policy applicable`.

## F190 — Ambiguity must fail closed for authority-expanding operations without freezing all interpretation

Ambiguity can concern threshold, eligible authorities, scope, precedence, expiry, compromise window or allowed operation classes.

Candidate rule:

- ambiguity affecting `AUTHORIZE`, `PUBLISH`, `NEW_EFFECT`, trust replacement or floor reduction -> `BLOCKED/UNKNOWN`;
- ambiguity irrelevant to historical read/verification may permit `HISTORICAL_VERIFY` if evidence remains sufficient;
- drafting/review/simulation can continue as explicitly non-effective.

`ambiguous authority != broadest plausible authority`.

`ambiguous recovery policy != entire editor unusable`.

## F191 — A forked recovery policy is a governance fork, not a last-write-wins document conflict

Two descendants of the same policy revision may each be internally valid yet authorize incompatible recovery authorities or thresholds.

Candidate `RecoveryPolicyFork`:

```text
RecoveryPolicyFork
  commonAncestor
  branchHeads[]
  branchAuthorityBases[]
  branchCurrentness[]
  branchObservedFloors[]
  changedAuthorityScopes[]
  changedThresholds[]
  affectedOperationClasses[]
  affectedMaterialGenerations[]
  effects/admissionsUnderEachBranch[]
  reconciliationDisposition
```

`higher version != authoritative winner`.

`later timestamp != governance winner`.

The fork is reconciled using authority/invariant evidence; it is never silently merged by text or CRDT rules.

## F192 — Compromise discovered after policy authorization creates temporal taint, not automatic timeless invalidity

If an authority that signed policy P5 is later proven compromised, the system must reason about compromise time/evidence and the policy's authorization occurrence.

Candidate dispositions:

- `PRE_COMPROMISE_ADMISSION_REMAINS_HISTORICALLY_VALID`
- `RETROSPECTIVE_REVIEW_REQUIRED`
- `ADMISSION_INVALIDATED_FOR_SCOPE`
- `NEW_USE_BLOCKED`
- `COMPROMISE_TIME_UNKNOWN`

`authority compromised now != every historical act was compromised`.

Conversely, unknown compromise time cannot be presented as proof that old authorization was safe.

## F193 — Recovery cannot be justified solely by a policy whose authority is the thing being recovered

A circular bootstrap occurs if P5 says “P5 may replace itself” and P5's own compromised signers are the only proof for that statement.

Candidate continuity requires at least one independently qualified continuity path, such as:

- predecessor-policy authorization still above the observed floor;
- precommitted successor/recovery authority;
- independently held recovery threshold/custody path established before the incident;
- locally pinned trust-store bootstrap constraint;
- qualified out-of-band reinitialization ceremony under a separately governed owner/operator decision.

No single path is universally mandatory; the important property is non-circularity.

`self-asserted recovery authority != recovered authority`.

## F194 — Minimal recovery invariants may survive policy failure, but they must constrain rather than grant authority

The product needs a small class of constitutional safety invariants that remain meaningful even when ordinary recovery policy is unusable. These invariants must be negative/limiting, not an immortal positive super-root.

Candidate minimal invariants:

1. never lower an already observed trust/security floor merely because recovery is difficult;
2. never treat `UNKNOWN` as permission;
3. recovery authority does not imply business-effect authority;
4. transport/location/possession does not manufacture authority;
5. irreversible historical effects remain facts and are not erased by governance replacement;
6. new trust must have explicit provenance and a non-circular bootstrap basis;
7. ambiguity cannot widen authority;
8. historical interpretation, continuation and new-effect admission remain separate;
9. local autonomous runtimes may remain safely degraded rather than accept weaker trust;
10. any manual/out-of-band reset is explicit re-bootstrap/reinitialization evidence, not silent continuity.

These are safety constraints on recovery, not keys, people, providers or permanent principals.

`constitutional floor != constitutional super-user`.

## F195 — Full trust exhaustion may require explicit re-bootstrap rather than pretending continuity

If all policy-authorizing trust is compromised or unresolvable and no independent precommitted recovery path remains, continuity may be unprovable.

Candidate disposition: `TRUST_CONTINUITY_UNPROVABLE_REBOOTSTRAP_REQUIRED`.

A re-bootstrap is a new trust-establishment occurrence with explicit owner/operator authority, local ceremony/evidence, scope and migration consequences. It must not be mislabeled as ordinary rollover/reconciliation.

This follows the external pattern that all-anchor compromise can require manual/out-of-band reinitialization/update.

`no safe continuity path != choose the least bad stale policy`.

## F196 — Re-bootstrap does not rewrite historical trust lineage

Installing a new root after catastrophic trust exhaustion creates a new trust epoch/lineage edge. Historical proofs retain their original trust context and may become `HISTORICALLY_INTERPRETABLE_ONLY`, `UNDER_REVIEW`, or `UNRESOLVABLE` depending on evidence.

`new root installed != old history re-signed`.

`new epoch != proof that prior epoch was trustworthy`.

Revision/Diff and Evidence lineage must show the discontinuity explicitly.

## F197 — Policy currentness cannot depend only on wall-clock expiry

Offline runtimes may lack reliable time, and a future timestamp alone cannot prove semantic/security freshness. Candidate currentness inputs include monotonic policy revision/floor, observed revocation/compromise evidence, bounded time when trustworthy, predecessor/successor lineage and locally durable anti-rollback state.

`not expired != current`.

`clock unavailable != stale policy becomes indefinitely valid`.

Currentness may become `UNKNOWN`, which can selectively block sensitive operations while preserving safe historical access.

## F198 — Successor-policy admission should prove continuity across both sides of the transition when continuity is claimed

TUF's old-threshold + new-threshold root transition is a useful primitive pattern. G4 should generalize the semantic idea without binding to TUF:

```text
RecoveryPolicyTransitionEvidence
  predecessorPolicyRef
  successorPolicyRef
  predecessorAuthorizationProof
  successorSelfQualificationProof
  changedAuthority/threshold/scope
  observedFloorProof
  compromise/revocationWindow
  transitionDisposition
```

Where continuity is claimed, successor self-authorization alone is insufficient.

`new policy threshold satisfied != predecessor continuity proven`.

Catastrophic re-bootstrap is the explicit exception because it declares discontinuity rather than fabricating continuity.

## F199 — Policy interpretation itself needs a qualified semantic profile

A policy can be syntactically intact but ambiguous because predicate semantics, defaults, precedence or referenced schemas changed.

Candidate pinning:

`policy revision × normative semantics profile × schema/canonicalization profile × verifier qualification`.

This connects recovery-policy failure to prior canonicalization/proof-longevity research.

`same policy bytes != same interpreted authority` when semantics/defaults changed.

Unknown/custom predicates degrade admission rather than being ignored.

## F200 — Manual human judgment is an explicit authority occurrence, not an invisible escape hatch

When automation cannot establish continuity, a human/legal/organizational owner may need to authorize re-bootstrap. That decision must be represented as an explicit occurrence with scope, identity/role basis, evidence, conflicts of interest, review/threshold where required, and consequences.

`human decided != automatically trustworthy`.

`manual != unaudited`.

The UI must never hide a manual re-bootstrap behind a generic “force” button.

## F201 — Recovery-policy replacement and business-state reconciliation remain independent

A policy fork may have admitted effects on both branches. Resolving the governance fork cannot erase those effects.

`policy reconciled != effects reconciled`.

Workflow conformance, Domain State, Commands/Actions and external Effect Lineage retain their own reconciliation/compensation laws.

## F202 — Shared Editor Foundation needs Recovery Policy Failure Review and explicit trust-epoch discontinuity

Reusable projections should expose:

- policy revision/provenance/currentness;
- predecessor/successor continuity;
- fork ancestry and semantic diff;
- authority/threshold/scope changes;
- compromise windows and temporal taint;
- ambiguity/unknown predicates;
- observed trust floor;
- affected recovery material/custody generations;
- operation-class dispositions;
- re-bootstrap necessity and trust-epoch boundary;
- post-recovery qualification obligations;
- historical effects that survive policy replacement.

All spatial views require list/tree/Inspector/keyboard equivalents. Drag/drop never authorizes trust changes.

## F203 — Revision/Diff must distinguish policy text, semantic authority and trust-continuity diffs

Candidate facets:

`TEXT/AST`, `NORMATIVE SEMANTICS`, `AUTHORITY SET`, `THRESHOLD`, `SCOPE`, `PRECEDENCE`, `CURRENTNESS`, `COMPROMISE TAINT`, `MATERIAL PINNING`, `TRUST FLOOR`, `CONTINUITY`, `REBOOTSTRAP`, `EFFECT IMPACT`.

`textually small diff != small authority diff`.

A one-line threshold/default change may be more material than a large descriptive rewrite.

## Findings by editor

- **Workflow Designer:** recovery-policy failure may block recovery/authorization activities while historical Workflow inspection remains available. Workflow state does not become trust state.
- **Component Editor / Componentes:** components project `STALE`, `BLOCKED`, `PERMISSION_DENIED`, `PENDING`, `UNKNOWN` and `EFFECTIVE` only from qualified semantics. A component event cannot invoke re-bootstrap authority merely because a control is enabled.
- **View/Page Builder:** views can expose recovery status and findings but cannot make hidden/withheld authority look absent. Permission changes affecting the view remain distinct from trust-policy changes.
- **Form Builder:** emergency/re-bootstrap forms collect required inputs/evidence but `Form != Recovery State`; submit is an intent until authority and policy admission succeed.
- **Rules/Decision Editor:** most directly affected: ambiguity, precedence, unknown predicates, threshold/scope and semantic-profile pinning require findings and semantic diff. Rule text is not authority.
- **System/Module Designer:** shows trust/recovery dependencies and affected modules without making topology an authority graph.
- **Elicitation/Requirements:** captures recovery objectives, organizational owner, unacceptable authority concentration, required offline survivability and proof obligations with provenance; elicited intent is not current policy.
- **Preview/Sandbox:** can simulate stale/forked/compromised-policy scenarios pinned to exact revisions/profiles. Preview success is not effective recovery or trust installation.
- **Revision/Diff:** projects policy semantic/authority/continuity changes and trust-epoch discontinuity; it does not own Trust or Evidence.

## Shared reusable primitives

### Shared primitive

`RecoveryPolicyRef`, `RecoveryPolicyAssessment`, `RecoveryPolicyForkRef`, `RecoveryPolicyTransitionEvidenceRef`, `TrustEpochRef`, `TrustContinuityDisposition`, `CompromiseTemporalDisposition`, `RebootstrapOccurrenceRef`, `ConstitutionalRecoveryInvariantRef`.

### Editor infrastructure

- Recovery Policy Failure Review;
- policy ancestry/fork browser;
- semantic authority diff;
- compromise-window/temporal-taint projection;
- observed-floor/currentness Inspector;
- transition continuity checker projection;
- re-bootstrap ceremony/evidence review;
- trust-epoch lineage;
- operation-scoped findings/status;
- accessible list/tree alternative to every graph/topology view.

### Proprietary app boundary

Each proprietary editor consumes typed Trust/Evidence/Permission/Command/Domain references. No editor becomes canonical owner of recovery authority, trust continuity, Domain Commands or external effects.

### Cross-app semantic integration

```text
Workflow/View/Form/Component/Rule revision
 -> Command/Action intent
 -> Permission/Policy authority
 -> PublishBundle qualification
 -> verifier + TrustSetRevision/TrustBridgeQualification
 -> ProofEnvelope / EffectOccurrence
 -> trust incident/fork
 -> EmergencyTrustRecoveryPolicy revision
 -> RecoveryMaterialGeneration/Custody
 -> policy assessment/fork/compromise evidence
 -> RecoveryPolicyTransitionEvidence OR explicit RebootstrapOccurrence
 -> successor TrustEpoch
 -> post-recovery qualification
 -> effect/domain reconciliation where separately required
 -> Evidence + Revision/Diff projection
```

Preserved invariants: `View != Workflow Activity`; `Form != Workflow State`; `Button != Domain Command`; `Component event != authorized action`; `visual transition != business transition`; `recovery authority != business-effect authority`; `policy recovery != effect reconciliation`.

## Guided/declarative UX findings

Valid composition should be easier than invalid composition:

- successor policy choices filtered by predecessor continuity, floor and authority prerequisites;
- self-authorizing/circular transitions blocked with explicit reason;
- missing predecessor proof, unknown predicates, expired/stale dependencies and compromised signers surfaced before authorization;
- fork branches shown from common ancestor rather than flattened into latest versions;
- “manual re-bootstrap” visually and semantically distinct from “continue trust lineage”;
- required evidence/owner/threshold inputs surfaced before ceremony;
- no “force anyway” path that silently converts UNKNOWN into permission;
- offline draft/review allowed while effective authorization remains blocked;
- accessibility equivalent for every drag/graph operation;
- Preview badges exact policy/profile/trust epoch and remains non-effective.

## Required/adversarial scenarios

1. P5 is correctly signed but expired/stale; its signers are still available: possession does not extend currentness.
2. P5 and P5b descend from P4 and both meet local thresholds but define incompatible recovery authorities: no last-write-wins.
3. P5 signer is proven compromised after P5 admission, with compromise time after signing: historical admission may remain valid while new use is blocked.
4. Compromise time is before P5 signing: retrospective review/invalidation is required for affected scope.
5. Compromise time is unknown: UI must not claim pre-compromise safety.
6. P5 says its own signer may replace P5, and no independent continuity evidence exists: circular recovery is rejected.
7. Old policy P4 authorizes transition to P5 and P5 satisfies its own threshold: continuity can be qualified when all other floors/currentness hold.
8. All old authorities are compromised and no precommitted recovery path remains: declare `TRUST_CONTINUITY_UNPROVABLE_REBOOTSTRAP_REQUIRED` rather than selecting a stale policy.
9. Re-bootstrap installs a new trust epoch: historical proofs are not silently reinterpreted under the new root.
10. Runtime is offline with P5 and no reliable wall clock: expiry alone cannot establish currentness; operation-scoped UNKNOWN is representable.
11. Runtime observed revocation/floor G6 before snapshot rollback to G5: old recovery policy cannot lower the observed floor.
12. Policy text is byte-identical but a referenced predicate/default changed meaning: semantic profile mismatch blocks authority-sensitive use.
13. Policy fork branches admitted external effects before detection: governance reconciliation does not erase either effect lineage.
14. Factory recommends a successor policy while Client-local evidence cannot prove continuity: Factory recommendation does not create local authority.
15. USB carries a replacement policy signed by unknown authorities: transport does not create authority.
16. A human owner performs catastrophic re-bootstrap: decision is explicit, scoped, auditable and distinguishable from ordinary rollover.
17. Human owner role itself is disputed: re-bootstrap remains blocked/UNKNOWN until organizational authority is qualified under the applicable bootstrap law.
18. Form submits a complete recovery request but authorization is ambiguous: form completion does not make recovery effective.
19. UI button is enabled by stale cached permission: component event cannot bypass current trust-policy admission.
20. Drag interaction unavailable: fork review, policy diff and re-bootstrap review remain fully operable by list/tree/Inspector/keyboard.
21. Preview successfully simulates P6: production P5 remains effective until an actual qualified transition/re-bootstrap occurs.
22. Policy ambiguity affects only a descriptive notification field: do not over-block unrelated historical/read operations.
23. Policy ambiguity affects threshold precedence: block authority-expanding recovery operations.
24. A new policy lowers threshold from 4-of-7 to 1-of-1 while claiming emergency necessity: treat as security-policy change; emergency does not defeat observed floor.

## Proof/test obligations for later qualification

1. A successor policy cannot claim continuity solely from its own signatures.
2. Claimed continuity verifies predecessor authorization and successor qualification under exact pinned semantics.
3. Rollback/snapshot restore cannot lower an observed recovery/trust floor.
4. Policy ambiguity cannot widen effective authority.
5. Unknown predicate semantics cannot be silently ignored for authority-sensitive operations.
6. A policy fork cannot be resolved by timestamp/version alone.
7. Compromise after signing is distinguishable from compromise before signing and from unknown compromise time.
8. Catastrophic re-bootstrap is explicitly distinguishable from ordinary rollover/reconciliation.
9. Re-bootstrap creates a visible trust-epoch boundary and cannot rewrite historical evidence.
10. Out-of-band transport cannot manufacture recovery authority.
11. Recovery authority cannot manufacture Domain Command/business-effect authority.
12. Governance reconciliation cannot erase external effects admitted on either branch.
13. Historical verification/read can remain available when new-effect authorization is blocked, where evidence permits.
14. Preview/Sandbox cannot satisfy effective trust-transition evidence.
15. Cached/stale UI permission cannot bypass current policy/trust admission.
16. Policy/schema/semantic-profile mismatch is surfaced as UNKNOWN/BLOCKED, not guessed compatibility.
17. Manual human re-bootstrap produces explicit provenance/evidence rather than an unlogged override.
18. Constitutional recovery invariants only constrain unsafe transitions; none grants a permanent principal universal authority.
19. Every graph/spatial operation has a non-spatial keyboard-accessible equivalent.
20. Revision/Diff distinguishes textual, semantic-authority and trust-continuity changes.

## Componentization complexity / dependency hotspots

- **P0 LOW/MEDIUM:** refs, status/disposition badges, explicit stale/ambiguous/forked/unknown states, trust-epoch identity.
- **P1 MEDIUM/HIGH:** policy ancestry/fork browser, currentness Inspector, semantic diff, compromise-window projection, operation-scoped findings, accessible alternatives.
- **P2 HIGH/VERY HIGH:** editor adapters, transition continuity review, re-bootstrap review, semantic-profile/canonicalization pinning, offline package assessment.
- **P3 EXTREME:** non-circular bootstrap qualification, all-authority compromise, temporal taint under uncertain compromise time, forked governance with already-effective external effects, anti-rollback across offline epochs, manual organizational re-bootstrap without a permanent super-root.

Primary complexity product:

`policy revision × semantics profile × authority set × threshold × compromise interval × fork branch × recovery material generation × observed floor × trust epoch × operation class × effect disposition`.

## Maturity / saturation

Subfront status: `ADVANCED_EMERGING / MATERIAL_DELTA`.

This round closes the assumption that emergency recovery always has a usable authoritative policy. The model now admits policy failure itself and distinguishes continuity-preserving transition from explicit catastrophic re-bootstrap. The constitutional floor is deliberately negative/limiting; it does not introduce an immortal recovery principal.

## Remaining gaps / next vector

Highest-value next vector: **organizational bootstrap authority and succession when the human/legal owner itself is disputed, unavailable, reorganized or split across jurisdictions**, including whether client-local ownership evidence can remain portable without Factory becoming a root of sovereignty. Closely related gaps are offline/currentness evidence for policy expiry when reliable time is unavailable, and proof obligations for multi-epoch historical verification after re-bootstrap.

A later empirical phase should also benchmark the editor projections at S0–S4 corpus sizes; no latency/FPS budget is asserted here without measurement.

## Sources

- TUF specification, root update workflow: https://theupdateframework.github.io/specification/draft/
- TUF FAQ, compromised Root threshold/out-of-band recovery: https://theupdateframework.io/docs/faq/
- RFC 5011, Automated Updates of DNSSEC Trust Anchors: https://www.rfc-editor.org/rfc/rfc5011.html
- RFC 4986, DNSSEC Trust Anchor Rollover Requirements: https://www.rfc-editor.org/rfc/rfc4986.html
- RFC 6024, Trust Anchor Management Requirements: https://www.rfc-editor.org/rfc/rfc6024.html
- NIST SP 800-57 Part 1 Rev. 5, Recommendation for Key Management: https://doi.org/10.6028/NIST.SP.800-57pt1r5
- NIST SP 800-57 Part 2 Rev. 1, Best Practices for Key Management Organizations: https://doi.org/10.6028/NIST.SP.800-57pt2r1
- Sigstore threat model: https://docs.sigstore.dev/about/threat-model/
