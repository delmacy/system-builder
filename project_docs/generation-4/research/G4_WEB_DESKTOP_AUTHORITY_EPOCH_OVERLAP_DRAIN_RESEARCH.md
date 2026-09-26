# G4 Web Desktop — Authority-Epoch Overlap, Drain & Zero-Downtime Re-establishment

Date: 2026-09-23
Status: `RESEARCH_ACTIVE / NON_EXECUTABLE`
Scope: documentary P&D only. No WBS, Work Package, Sprint, TASK, provider adoption or product implementation authority.

## 1. Research question

This round follows `G4_WEB_DESKTOP_REMEDIATION_CLOSURE_AUTHORITY_REESTABLISHMENT_RESEARCH.md` and asks how a successor authority epoch can become usable without a global stop-the-world while predecessor work, credentials, provider effects and historical verification remain partially live.

The key separation is:

`NEW EPOCH EFFECTIVE != OLD EPOCH DRAINED != OLD EPOCH FENCED != OLD EPOCH FORGOTTEN`.

A zero-downtime transition is therefore not a moment. It is an invariant-scoped overlap interval with independent admission, execution/effect, settlement, verification and historical-retention frontiers.

## 2. Repository reconciliation and deduplication

This study preserves established G4 rules rather than inventing a second handoff model:

- `Builder != Runtime`; autonomous runtimes cannot depend on Builder availability to decide every effect;
- `UNKNOWN` remains an evidence disposition, never permission to infer safety;
- `Provider ACK != effective state` and `Desired != Observed != Effective`;
- effect identity and origin authority revision survive manager/epoch transition;
- retry/redelivery does not create a fresh semantic admission by default;
- negative/fencing evidence must outlive resurrection paths or be subsumed by a stronger durable fence;
- historical verification authority, continuation authority and new-effect authority remain separate;
- late predecessor evidence can revise admissibility/remediation without rewriting historical occurrence;
- remediation closure is dependency-cut based, not percentage based.

`G4_APPLICATION_MANAGEMENT_INFLIGHT_EFFECT_HANDOFF_RESEARCH.md` already establishes admission frontier versus settlement frontier for manager transitions. This round generalizes only the additional authority-epoch consequences required when the predecessor authority itself is being retired/re-established. It does not duplicate application-management lifecycle.

## 3. External evidence and contradictory lessons

### 3.1 AWS KMS — current-for-new-use can coexist with predecessor-for-old-use

AWS KMS rotation keeps the logical KMS key stable while making new key material current for new encryption. Previous material remains available to decrypt ciphertext created under it. AWS also exposes non-current material as decrypt-only while current material performs new cryptographic protection.

Portable lesson:

`PREDECESSOR RETAINED FOR OLD OBLIGATIONS != PREDECESSOR AUTHORIZED FOR NEW OBLIGATIONS`.

This is a useful overlap pattern, but it is not universal authority semantics. KMS rotation does not re-encrypt old data and does not repair a compromised data key. A System Builder authority transition therefore cannot treat provider rotation as proof that all dependent resources/effects are remediated.

### 3.2 AWS KMS multi-Region — readiness before new use

For AWS-generated multi-Region key material, KMS waits until new material is available across related Regions before using it for cryptographic operations. With externally imported material, the operator must import matching material into each related key before initiating rotation.

Portable lesson:

`SUCCESSOR MATERIAL CREATED != SUCCESSOR READY FOR ADMISSION`.

Readiness is coverage-scoped and can precede predecessor drain.

### 3.3 HashiCorp Vault — active/standby rotation without stopping historical readability

Vault HA rotation adds a new internal encryption key to a keyring; new writes use the new key while entries written with prior material remain decryptable. Standbys receive an upgrade key during rotation. Rekeying and rotation are distinct operations.

Portable lesson:

`NEW-WRITE CUTOVER != OLD-READ RETIREMENT` and `REKEY != ROTATE`.

Again, the transferable pattern is phased capability, not the provider's exact implementation.

### 3.4 Existing G4 in-flight handoff research

G4 already requires old effects to retain origin authority lineage and separates closing admissions from settling effects. The authority-epoch case adds a stronger condition: the predecessor may become inadmissible for **new authority-bearing effects** while still being required to interpret, decrypt, verify, observe or settle old obligations.

## 4. Material finding — overlap is operation/invariant scoped, not epoch-wide co-authority

A transition from `E1` to `E2` must not be represented as a single boolean `activeEpoch=E2` if E1 obligations remain live.

Candidate frontiers:

```text
AuthorityEpochTransition
  predecessorEpochRef
  successorEpochRef
  protectedInvariantScope
  successorReadinessFrontier
  newAdmissionFrontier
  predecessorAdmissionFenceFrontier
  inFlightEffectFrontier
  settlementFrontier
  credentialAcceptanceFrontier
  historicalVerificationFrontier
  residualRecoveryFrontier
  unknownFrontier
  transitionDisposition
```

Core rule:

`ONE EPOCH FOR NEW ADMISSION != ONE EPOCH FOR EVERY LIVE OBLIGATION`.

The architecture should prefer **single-writer/new-admission authority** for conflicting invariants while permitting predecessor participation only for explicitly classified old obligations.

## 5. Candidate authority-epoch dispositions

Per operation/invariant scope:

- `PREDECESSOR_NEW_ADMISSIONS_OPEN`
- `SUCCESSOR_STAGED`
- `SUCCESSOR_READY`
- `SUCCESSOR_NEW_ADMISSIONS_OPEN`
- `PREDECESSOR_NEW_ADMISSIONS_FENCED`
- `PREDECESSOR_INFLIGHT_DRAINING`
- `PREDECESSOR_SETTLEMENT_ONLY`
- `PREDECESSOR_HISTORICAL_VERIFY_ONLY`
- `PREDECESSOR_RESIDUAL_RECOVERY_ONLY`
- `PREDECESSOR_FULLY_FENCED_FOR_EFFECTS`
- `TRANSITION_PARTIAL`
- `CONFLICTING_AUTHORITY`
- `UNKNOWN`

These are research dispositions, not implementation enums.

`OVERLAP != CO-AUTHORITY`.

Two epochs may coexist physically and historically while only one may admit a conflicting class of new effects.

## 6. Admission epoch must bind durable work

Every consequential occurrence admitted during transition needs an immutable `admissionAuthorityEpochRef` plus the authority/security/currentness evidence used at admission.

```text
Occurrence
  effectIdentity
  admissionAuthorityEpochRef
  admissionPolicyRef
  admissionEvidenceRevision
  target/effect scope
  attempts[]
  observedEffectDisposition
  settlementDisposition
```

A queued E1 occurrence does not silently become E2 work when E2 activates.

`QUEUE DELIVERY UNDER E2 != E2 ADMISSION`.

A retry of E1 remains E1 lineage unless an explicit migration/re-admission contract proves semantic and authority safety. If E1 has become inadmissible for continuation, the correct state may be `QUARANTINED`, `RECONCILE`, `COMPENSATE`, `RE-ADMIT_AS_NEW_OCCURRENCE` or `UNKNOWN`; relabeling is forbidden.

## 7. Zero-downtime cutover protocol

Candidate protocol:

```text
1 qualify successor authority material and independent authority path
2 stage successor providers/bindings without opening new admissions
3 prove required successor coverage/readiness for named operation/invariant scopes
4 close predecessor new-admission frontier for conflicting scopes
5 durably publish/fence the predecessor admission floor
6 open successor admissions only after the fence/readiness proof is current
7 preserve predecessor identity for already-admitted occurrences
8 classify predecessor residual work: DRAIN / SETTLE / OBSERVE / QUARANTINE / REMEDIATE / MANUAL
9 rotate/reissue credentials and bindings according to dependency, not wall-clock proximity
10 observe target-side rejection/fencing of predecessor credentials where new effects would conflict
11 reconcile provider-side and external effects
12 downgrade predecessor to settlement/historical-verify/recovery-only as appropriate
13 prove no live new-effect path can resurrect predecessor authority
14 declare predecessor fully drained/fenced only for the scopes whose proof obligations close
```

No global pause is required when independent scopes can transition separately.

## 8. Credential overlap and resurrection resistance

Credential rotation is not one event. Distinguish:

```text
successor credential issued
successor credential distributed
consumer switched
provider accepts successor
predecessor credential revocation requested
predecessor credential rejection observed
cached/session-derived predecessor authority expired or fenced
```

A stale browser session, worker token, provider API token or offline credential that still works is a **resurrection path**, even when the UI says E2 is current.

`OLD CREDENTIAL NOT USED RECENTLY != OLD CREDENTIAL FENCED`.

Where a provider cannot prove rejection, the state remains bounded `UNKNOWN/PARTIAL`; the adapter must not normalize it to strong fencing.

## 9. Read versus write overlap

The AWS KMS/Vault patterns demonstrate a valuable but bounded asymmetry: predecessor material can remain necessary for decrypt/read/historical verification while successor material handles new protection/writes.

G4 should generalize this only through declared operation classes:

- `NEW_EFFECT_MUTATION`
- `OLD_EFFECT_SETTLEMENT`
- `READ/DECRYPT_OLD_STATE`
- `HISTORICAL_VERIFY`
- `RECOVERY_INSPECTION`
- `ADMIN/REKEY/ROTATE`

Authority is qualified per class. A predecessor allowed to decrypt old state does not thereby regain permission to mint credentials, deploy, publish, mutate or admit new workflow effects.

## 10. Failure and recovery during overlap

### Successor fails before admissions open

Safe rollback may return to E1 only if E1 was not security-retired/fenced below the required floor. `Implementation rollback != security-floor rollback`.

### Successor fails after admissions open

Already-admitted E2 work remains E2 lineage. Reopening E1 new admissions requires a fresh authority/security qualification; it is not automatic failback.

### Predecessor disappears while draining

E1 residual work becomes `UNKNOWN/PARTIAL` unless target-side evidence independently proves effect/settlement. E2 can continue independent new admissions where the named invariant is unaffected.

### Both remain reachable

Reachability is not co-authority. The admission fence determines new-effect authority; target-side fencing/credentials determine whether stale E1 can still realize conflicting effects.

## 11. Web Desktop synthesis

### Desktop Sphere taxonomy

No structural change. Security/Recovery/Operations remains a functional Desktop Sphere. `Client != Workspace != Desktop != Application != Window`; 3D remains an optional application/projection.

### Observatory vs Pinned Monitoring Surface vs Operations Desktop

- **Desktop Observatory:** successor readiness, admission epoch, predecessor drain frontier, residual effect classes, credential-fence evidence, critical `UNKNOWN`s and currentness.
- **Pinned Monitoring Surface:** compact alerts such as `SUCCESSOR READY / OLD ADMISSIONS FENCED`, `OLD CREDENTIAL STILL ACCEPTED`, `DRAIN PARTIAL`, `CONFLICTING AUTHORITY`; no mutation authority.
- **Operations Desktop:** qualified cutover, credential rotation, fencing, reconciliation, quarantine and closure actions.

`NEW EPOCH GREEN != OLD EPOCH DRAINED`.

### Window Manager / multi-display / restore

Window remains an interaction session. A command surface binds an authority/evidence revision at preflight but must revalidate at execution admission. Restored windows and secondary displays cannot reuse stale E1 authority merely because their visual session predates cutover.

`DISPLAY SURFACE != AUTHORITY SURFACE`.

Small-screen/accessibility equivalence requires a textual/table representation of active admission epoch, predecessor residual classes, blockers and proof currentness; graph/timeline visuals are optional projections.

## 12. Application Manager lifecycle implications

Application Manager must preserve:

`Install != Adopt != Qualify != Authorize`.

During epoch overlap, application/provider lifecycle and authority lifecycle remain orthogonal. An installed successor adapter/provider can be staged without authority. An old application can remain installed for historical/settlement duties after losing new-effect authority.

Candidate projection:

```text
Application/provider
  installed
  verified
  adopted
  authorityRolesByEpochAndOperation
  newAdmissionDisposition
  residualEffectDisposition
  credentialFenceDisposition
  historicalVerificationDisposition
```

Uninstall is never a fencing proof.

## 13. Control Center / declarative deployment / auto-binding

Control Center should expose provenance for:

- current admission epoch by operation/scope;
- successor readiness and coverage;
- predecessor fence and residual obligations;
- credential/provider acceptance evidence;
- desired/observed/effective placement/configuration;
- inherited/local authority and security policy;
- unresolved `UNKNOWN`s.

Declarative service definitions remain semantic. Provider YAML/artifacts are projections. Auto-binding may stage or choose a successor only among policy-qualified bindings and must reveal why it was chosen.

`AUTO-BIND SUCCESS != AUTHORITY CUTOVER COMPLETE`.

Placement cutover, service cutover and authority cutover remain independent transitions.

## 14. Application Portfolio Matrix delta

No universal integration mode is justified.

| Capability/task | Preferred modes | Why / decision criteria |
|---|---|---|
| Authority epoch registry / admission frontier | Native SB | Canonical semantic identity, provenance, currentness and portability are product-level concerns. |
| PKI/CA issuer transition | API-backed / Hybrid / Deep-link | Reuse mature CA lifecycle; SB owns semantic lineage/qualification, not CA internals. |
| KMS/HSM key transition | API-backed / Hybrid / Deep-link / Native bridge | Native bridge only for local hardware; preserve provider-specific rotation/fencing guarantees. |
| IAM/session/token drain | API-backed / Hybrid | Provider effect/revocation observation is essential; do not fabricate universal session fencing. |
| Deployment/binding cutover | Native SB + Hybrid / Deep-link | Semantic desired state and authority lineage stay portable; provider execution is external. |
| Historical verification/decrypt | Native SB / Hybrid / Embedded-qualified | Old-use capability must remain distinct from new-effect authority. |
| Queue/job drain and lineage | Native SB + API-backed / Hybrid | Admission epoch is semantic; broker/runtime observations are provider-specific. |
| Forensic/provider console | Deep-link / Embedded-qualified | Mature tool reuse with explicit trust/currentness boundaries. |

Mandatory evaluation criteria remain security, compatibility, licensing, authority, currentness, UX, lifecycle, replaceability and lock-in, extended here by operation-class fidelity, admission-epoch lineage, target-side fence observability, residual-effect visibility, failback semantics, provider-exit portability and honest `PARTIAL/UNKNOWN` representation.

## 15. External integration / open-source / plugin / adapter boundary

Adapters may normalize common facts such as `rotation requested`, `successor material current`, `old token rejected observed`, or `old material decrypt-only`, but may not claim semantic equivalence when providers differ in cancellation, revocation propagation, session invalidation, historical decrypt, rollback or residual effects.

`ADAPTER NORMALIZATION != FABRICATED SEMANTIC EQUIVALENCE`.

Open-source/mature tools should be reused for PKI, KMS/HSM, IAM, queue, observability and deployment execution when contracts permit. SB-specific value is the cross-tool semantic authority/effect lineage and qualified UX, not rebuilding every mature console.

## 16. Proprietary editor foundation / semantic bridge

No new bespoke editor family is justified by this finding. Reusable foundations suffice:

- immutable evidence viewer;
- epoch/frontier timeline;
- authority/provenance/currentness badges;
- dependency/critical-cut explorer;
- desired/observed/effective diff;
- effect-lineage table;
- qualified command shell with preflight and execution-time revalidation;
- accessible non-graph projection.

Workflow/View/Form/Component separation remains intact:

`View != Workflow Activity`; `Form != Workflow State`; `Button != Domain Command`.

A UI button may request a cutover command; the durable authority transition is not the button state.

## 17. Componentization complexity map delta

High-reuse C3 foundations:

- `AuthorityEpochTransitionBoundary`
- `AdmissionAuthorityEpochBoundary`
- `SuccessorReadinessBoundary`
- `PredecessorAdmissionFenceBoundary`
- `EpochOverlapPolicyBoundary`
- `InFlightEpochLineageBoundary`
- `CredentialDrainBoundary`
- `TargetSideFenceObservationBoundary`
- `PredecessorResidualObligationBoundary`
- `EpochFailbackQualificationBoundary`
- `EpochDrainClosureBoundary`
- `StaleSessionRevalidationBoundary`

C2 shared UI/projection primitives:

- frontier/timeline projection;
- operation-class authority matrix;
- residual obligation list;
- evidence-currentness badge;
- epoch diff;
- accessible table projection.

Application/domain-owned specifics remain PKI ceremony, HSM operation, IAM provider session semantics, payment/irreversible compensation, workflow-specific continuation law and physical recovery procedures.

The cost-reduction strategy is therefore to build shared lineage/frontier/evidence/qualified-command foundations once, while keeping provider/domain semantics behind explicit adapters/contracts.

## 18. Performance/resource budget implications

No numeric threshold is invented. Future empirical budgets must measure:

- transition-frontier cardinality;
- number of live predecessor occurrences by operation class;
- credential/session drain time distribution;
- provider revocation/fence observation latency;
- queue age and oldest predecessor admission;
- effect reconciliation throughput;
- evidence refresh cost;
- UI projection cost for large residual sets;
- retry amplification during cutover;
- time from successor-ready to successor-admissions-open;
- time from successor-admissions-open to predecessor-new-effect-fenced;
- time from fence to residual settlement/closure.

Percent complete is operational telemetry, never semantic closure proof.

## 19. Adversarial proof matrix

1. E2 is ready but one Region/provider replica cannot use successor material.
2. E2 opens admissions before E1 new admissions are durably fenced.
3. E1 queue item is delivered after E2 cutover and silently relabeled E2.
4. E1 retry receives a new effect identity and duplicates an irreversible effect.
5. E1 API token is revoked centrally but still accepted by a target cache.
6. Browser session created under E1 survives cutover and invokes a consequential command.
7. Worker with E1 credential reconnects after being offline for hours.
8. E1 remains decrypt-capable and is accidentally treated as mint/deploy-capable.
9. E1 historical signer is reactivated for new signatures.
10. Successor key exists but was derived from compromised predecessor material.
11. E2 provider ACK is mistaken for application/service effectiveness.
12. E1 controller is uninstalled and UI reports it fenced without target evidence.
13. E2 fails before admissions open; safe E1 rollback is still possible.
14. E2 fails after admissions open; system blindly reopens E1 despite raised security floor.
15. E1 disappears with unresolved external effects; E2 continues independent work but dashboard reports full drain.
16. E1 and E2 are both reachable; routing load-balancer sends conflicting writes to both.
17. Read/decrypt overlap is safe, but adapter exposes generic `active=true` and grants mutation.
18. Old credential revocation request succeeds but provider session remains valid.
19. New credential issued but one consumer still uses predecessor credential.
20. Secret source rotated but consumer reload did not occur.
21. Queue drained but provider-side asynchronous effect remains unsettled.
22. Provider-side effect settled but local observation is stale/unknown.
23. Secondary display shows E1 as current after E2 cutover.
24. Restored window replays stale preflight authorization from E1.
25. Auto-binding chooses E2 provider violating residency/licensing/security constraints.
26. Placement cutover is mistaken for authority cutover.
27. Authority cutover is mistaken for service readiness.
28. Shared infrastructure is used to infer shared authority between Clients.
29. Cross-Client telemetry leaks another Client's drain state or authority identity.
30. `99.99% drained` hides one root/issuer/worker with critical new-effect authority.
31. One offline HSM is `UNKNOWN`; it blocks only the scope it can resurrect, not unrelated Clients/operations.
32. Old epoch is fully fenced for mutation but still required for historical decrypt; GC deletes it prematurely.
33. Historical material retained for decrypt is later compromised; current E2 new-effect authority remains independently qualified but historical exposure is surfaced separately.
34. Provider adapter upgrades during drain and changes semantics of `revoked` without requalification.
35. Clock skew makes a credential appear post-cutover although admitted pre-cutover; lineage must use durable admission evidence, not wall-clock inference.
36. Network partition makes both sides believe they own new admissions; target-side fence/authority epoch must prevent conflicting effects or surface `CONFLICTING_AUTHORITY`.

## 20. Proof obligations

- PO-AE1. Every consequential occurrence retains immutable admission-authority-epoch lineage across queueing, retry, failover and UI/session loss.
- PO-AE2. Successor readiness is scope/coverage qualified and does not itself open admissions.
- PO-AE3. Conflicting predecessor new admissions are fenced before successor admissions become effective for the same protected invariant, unless a proven overlap law permits coexistence.
- PO-AE4. Predecessor settlement/historical-read capability cannot imply predecessor new-effect authority.
- PO-AE5. Queue drain cannot prove external-effect settlement.
- PO-AE6. Credential rotation distinguishes issuance, distribution, consumer adoption, predecessor revocation and target-side rejection.
- PO-AE7. Stale sessions/workers/providers cannot regain predecessor authority merely by reconnecting.
- PO-AE8. Failback after successor admission requires fresh authority/security qualification and cannot lower a monotonic security floor silently.
- PO-AE9. Adapter/provider ACKs preserve provider-specific fencing/revocation semantics and `PARTIAL/UNKNOWN` where guarantees differ.
- PO-AE10. `New epoch effective` and `old epoch drained/fenced` remain separately observable closure claims.
- PO-AE11. Historical verification/decrypt dependencies survive only for declared old-use classes and cannot mint new authority.
- PO-AE12. UI/window/display lifecycle cannot create, transfer, drain or resurrect authority.
- PO-AE13. Automatic binding/cutover exposes provenance, policy, authority and consequences.
- PO-AE14. Multi-Client shared infrastructure never fabricates shared authority or leaks protected transition state.
- PO-AE15. Critical minority paths dominate semantic closure; percentages remain non-authoritative.
- PO-AE16. Performance budgets measure transition cost without redefining safety/currentness semantics.

## 21. Contradictions and trade-offs

### Zero downtime vs exclusive new-effect authority

Availability favors overlap; safety often favors one admission authority. Resolution: overlap old obligations, not conflicting new admissions, unless the named invariant has a proven merge/ownership law.

### Historical readability vs aggressive retirement

KMS/Vault patterns retain old material to read old state. Security may require stronger retirement after compromise. Resolution: classify old-use capability separately and allow re-encryption/re-anchor/remediation when historical material itself becomes inadmissible.

### Fast failback vs monotonic security floor

Operational rollback is attractive when E2 fails. If E1 was retired for security, automatic failback would be a security rollback. Resolution: failback is a fresh qualification, not a deployment toggle.

### Uniform adapter UX vs provider truth

A single `rotated/revoked/drained` boolean is attractive but false across providers. Resolution: common semantic envelope plus provider-specific guarantee vector and explicit unknowns.

## 22. Saturation and remaining gaps

- Web Desktop hierarchy/taxonomy: **high**.
- Window/session/multi-display authority separation: **high**.
- Observatory vs Monitoring Surface vs Operations Desktop: **high**.
- Application Portfolio / external integration mode plurality: **medium-high**.
- Application Manager / Control Center authority projection: **medium-high**.
- Authority-epoch overlap semantic model: **medium-high**.
- Admission-epoch lineage and queue/retry behavior: **medium-high**.
- Credential/session drain across heterogeneous providers: **medium**.
- Target-side fencing observability: **medium**.
- Zero-downtime failback semantics: **medium**.
- Empirical performance/resource budgets: **medium-low**.

Material gaps remain; research is not complete.

## 23. Next vector

Highest-value next deep gap:

**stale-session / delegated-authority drain under long-lived and intermittently connected clients** — determine how browser sessions, service workers, native bridges, offline agents, delegated capability tokens and provider sessions bind authority epochs; how reconnection proves a monotonic authority/security floor without Builder availability; how to distinguish historical read/settlement rights from new-effect rights; and how to close an epoch when some delegates may remain offline beyond the normal drain horizon without requiring eternal retention or global stop-the-world.

This remains research only.