# G4 — Application Adoption & Management Authority Transition Research

Status: `RESEARCH_ACTIVE / NON_EXECUTABLE`
Execution authority: NONE
Date: 2026-09-22
Scope: G4 Web Desktop & Application Environment — Application Manager / Control Center / declarative deployment / external-tool integration

## 1. Purpose

This artifact deepens the cross-cutting Web Desktop research around the highest-value unresolved gap: how an application or service moves between discovery, verification, registration, observation, adoption, co-management, SB management and external management without changing semantic identity, silently expanding authority, destroying externally owned resources, or confusing management state with runtime/service state.

It extends `G4_WEB_DESKTOP_CROSS_CUTTING_CONFORMANCE_RESEARCH.md` and reconciles the recent workspace-session recovery and proprietary-editor publish-bundle deltas. It does not authorize implementation, provider selection, WBS, Work Packages, Sprints or TASKs.

## 2. Repository inputs consumed

- `AGENTS.md`: `Builder != Runtime`, published-runtime autonomy, compatibility before replacement, replaceable suite modules, explicit contracts between bounded contexts.
- `docs/architecture/MASTER_BLUEPRINT.md`: `Release + Environment = Deployment`, replaceable suite, compatibility-first modernization and autonomous runtime.
- `project_docs/generation-4/README.md` and `G4_RESEARCH_STATE.md`: research-only status and cumulative G4 invariants.
- `G4_WEB_DESKTOP_CROSS_CUTTING_CONFORMANCE_RESEARCH.md`: `Install != Adopt`, management authority as a vector, Control Center as federated projection, typed ServiceDefinition, placement identity separation, explicit SecretRef and desired/observed/effective separation.
- recent :00 delta `G4_WEB_DESKTOP_WORKSPACE_SESSION_RECOVERY_RESEARCH.md`: restored shell/session state cannot restore authority/currentness by implication; Client/Workspace switches require context requalification.
- recent :10 delta `G4_PROPRIETARY_EDITOR_SHARED_FOUNDATION_RESEARCH.md`: publish bundles preserve independent artifact identities and revisions; grouping/integration does not collapse semantic ownership.

## 3. External evidence reviewed

### 3.1 Crossplane management policies

Crossplane v2.3 exposes independent `Create`, `Observe`, `Update`, `Delete` and `LateInitialize` management policies. Observe-only and no-delete combinations are first-class. This is evidence that management authority is better modeled as decomposable permissions than as one managed/unmanaged boolean.

Portable lesson: a summary mode can be useful UX, but the enforceable authority must remain operation/field scoped.

Source: https://docs.crossplane.io/v2.3/managed-resources/managed-resources/

### 3.2 Terraform import and non-destructive removal

Terraform import binds an existing remote object to a resource address and explicitly warns that one remote object should normally map to one managed resource address. After import, plan/apply compares declared configuration with observed remote state; import does not prove that desired configuration is already safe or equivalent.

Terraform `removed` with `destroy = false` removes management binding while preserving the external resource, explicitly supporting handoff to another tool/team. This is strong evidence for separating management detachment from destruction.

Sources:
- https://developer.hashicorp.com/terraform/cli/import/usage
- https://developer.hashicorp.com/terraform/language/state/remove
- https://developer.hashicorp.com/terraform/language/block/removed

### 3.3 Kubernetes field management

Kubernetes Server-Side Apply tracks field managers and surfaces ownership conflicts instead of treating all writers as one authority. This is evidence for field/setting-level management provenance in co-managed applications.

Portable lesson: co-management requires an explicit conflict/ownership model; last-writer-wins is not a safe default for semantically material settings.

Source: https://kubernetes.io/docs/reference/using-api/server-side-apply/

### 3.4 Sigstore/Cosign supply-chain verification

Cosign verification binds signatures to artifact digests and can qualify certificate identity/issuer; attestations are separate evidence. Verification of artifact provenance/integrity is therefore distinct from authorization to register, install, adopt or upgrade that artifact in a Client/Workspace.

Source: https://docs.sigstore.dev/cosign/verifying/verify/

### 3.5 Vault Secrets Operator

Vault Secrets Operator separates secret source/destination, lease/refresh and rollout-restart behavior. A rotated secret may require a consumer restart when dynamic reload is unsupported.

Portable lesson: credential/binding authority is a separate transition domain. Adoption or management transfer cannot silently widen secret disclosure or assume that credential rotation became effective at the consumer.

Source: https://developer.hashicorp.com/vault/docs/deploy/kubernetes/vso/api-reference

These systems are evidence and counterexample sources only; none is an adoption decision.

## 4. Core finding — management relationship is a versioned binding, not application identity

Candidate separation:

```text
ApplicationDefinitionRef
ApplicationRegistrationRef
ExternalObjectRef?
ApplicationManagementBindingRef
ManagementAuthorityRevision
CredentialBindingRefs[]
EnvironmentBindingRef
PlacementRef?
ServiceIdentityRef?
```

The application/service keeps semantic identity while the management relationship changes.

New invariants:

```text
APPLICATION_IDENTITY != MANAGEMENT_BINDING
MANAGEMENT_MODE != MANAGEMENT_AUTHORITY_PROOF
MANAGEMENT_TRANSFER != APPLICATION_REIDENTIFICATION
MANAGEMENT_TRANSFER != SERVICE_REDEPLOYMENT
MANAGEMENT_TRANSFER != CREDENTIAL_TRANSFER BY DEFAULT
REGISTERED != MANAGED
OBSERVED != OWNED
ADOPTED != CREATED_BY_SB
DETACHED != DESTROYED
```

A management transition is a new relationship revision with evidence, not a rewrite of historical origin.

## 5. Lifecycle is multidimensional, not one state machine

A single linear enum such as `DISCOVERED -> VERIFIED -> REGISTERED -> MANAGED` hides independent dimensions. Candidate dimensions:

### 5.1 Knowledge / trust disposition

```text
UNDISCOVERED
DISCOVERED_UNVERIFIED
IDENTITY_VERIFIED
COMPATIBILITY_QUALIFIED
SUPPLY_CHAIN_QUALIFIED
VERIFICATION_STALE
VERIFICATION_FAILED
```

### 5.2 Registration disposition

```text
UNREGISTERED
REGISTRATION_PROPOSED
REGISTERED
DETACH_PROPOSED
UNREGISTERED_PRESERVED_EXTERNAL
```

### 5.3 Management disposition

UX summary labels remain candidates:

```text
OBSERVE_ONLY
EXTERNALLY_MANAGED
CO_MANAGED
SB_MANAGED
```

But they are projections of an underlying `ManagementAuthorityVector`, not canonical authority.

### 5.4 Runtime/deployment disposition

```text
NOT_DEPLOYED_BY_SB
DESIRED
SUBMITTED
PROVIDER_ACKNOWLEDGED
OBSERVED_PRESENT
READY/AVAILABLE
EFFECTIVE_FOR_DECLARED_CONTRACT
DEGRADED/UNKNOWN
```

### 5.5 Credential/binding disposition

```text
NO_BINDING
BINDING_PROPOSED
BOUND_REFERENCE
DELIVERED/LEASED
CONSUMER_EFFECTIVE
ROTATION_PENDING
REVOKED/EXPIRED/UNKNOWN
```

These dimensions may move independently. For example, an application can be `REGISTERED + OBSERVE_ONLY + EFFECTIVE externally + NO_MUTATING_CREDENTIAL`.

## 6. Adoption protocol candidate

Adoption is not import-and-own. It is a qualification protocol.

Candidate phases:

```text
1 DISCOVER
2 VERIFY_IDENTITY
3 QUALIFY_COMPATIBILITY
4 SNAPSHOT_OBSERVED_CONFIGURATION
5 IDENTIFY_EXISTING_MANAGERS_AND_AUTHORITIES
6 COMPUTE_PROPOSED_MANAGEMENT_AUTHORITY_VECTOR
7 COMPUTE_CONFIG_OWNERSHIP / DRIFT_DIRECTION
8 QUALIFY_CREDENTIAL_SCOPE
9 PLAN_FIRST_RECONCILIATION
10 REVIEW_DESTRUCTIVE_OR_RESTART_EFFECTS
11 COMMIT_MANAGEMENT_BINDING_REVISION
12 OBSERVE_POST_BINDING_EFFECTIVE_STATE
```

No phase implies the next automatically.

### 6.1 First reconciliation is the dangerous boundary

Terraform import provides a useful failure case: imported remote state may differ from declared/default configuration, causing the next plan to propose updates or destruction. Therefore:

```text
IMPORT/ADOPT SUCCESS != FIRST RECONCILIATION SAFE
```

The adoption plan must show the initial desired-vs-observed delta before mutation authority becomes effective.

Candidate requirement:

`No mutating authority becomes active until the first reconciliation plan is inspectable and any required approval/evidence is satisfied.`

This is especially important for co-managed and external-existing services.

## 7. ManagementAuthorityVector refinement

Candidate dimensions:

```text
ManagementAuthorityVector
  observe
  register/unregister
  create
  configure
  update
  restart/reload
  upgrade
  scale
  placementMove
  networkBinding
  storageBinding
  secretBinding
  credentialRotation
  policyAttachment
  delete
  uninstall
  destructiveDataOperation
  adoptExternalChanges
  reconcileDrift
  field/setting ownership qualifiers
  environment/placement scope
  client/workspace scope
  authorityEvidenceRefs
  currentnessHorizon
```

The vector is scoped. `mayUpdate` on application settings does not imply `mayRotateCredential` or `mayDelete`.

### 7.1 UX modes as constrained projections

Candidate interpretation:

- `OBSERVE_ONLY`: observe/read evidence only; no mutation authority.
- `EXTERNALLY_MANAGED`: SB may register/connect/project/observe according to contract; external authority remains primary for mutation.
- `CO_MANAGED`: explicit partition of mutation authority by field/operation/scope.
- `SB_MANAGED`: broad SB management authority, still bounded by policy, Client/Workspace, environment, provider capabilities and destructive-operation controls.

The labels never fabricate rights absent from the vector.

## 8. Co-management requires explicit ownership and conflict semantics

Co-management is not `both can write everything`.

Candidate ownership classes:

```text
SB_OWNED_FIELD
EXTERNAL_OWNED_FIELD
SHARED_WITH_MERGE_LAW
OBSERVED_ONLY_FIELD
POLICY_CONSTRAINED_FIELD
PROVIDER_DERIVED_FIELD
UNKNOWN_OWNER
```

Rules:

- conflicting writers on a material field produce a finding/conflict unless an explicit merge law exists;
- provider-derived/defaulted values remain distinguishable from SB-authored desired values;
- external changes may be adopted only where `adoptExternalChanges` is explicitly allowed;
- force/override requires qualified authority and evidence, not UI convenience;
- `UNKNOWN_OWNER` must not be silently claimed.

New invariants:

```text
CO_MANAGED != SHARED_LAST_WRITER_WINS
FIELD_VISIBLE != FIELD_OWNED
DRIFT_OBSERVED != DRIFT_AUTHORIZED_TO_REMEDIATE
EXTERNAL_CHANGE != SB_DESIRED_CHANGE
```

## 9. Authority transition protocol

A management transition is itself a planned change.

Candidate `ManagementTransitionPlan`:

```text
transitionId
applicationRegistrationRef
externalObjectRef?
fromAuthorityRevision
toAuthorityCandidate
field/operation deltas
credentialScopeDelta
configurationOwnershipDelta
reconciliationDirectionDelta
placement/deployment implications
restart/reload/upgrade implications
destructive capability delta
policy findings
compatibility evidence
supply-chain evidence
currentness evidence
blastRadius + unknownFrontier
required approvals/authority
rollback/detach strategy
post-transition verification obligations
```

Candidate transition dispositions:

```text
PLANNED
QUALIFIED
BLOCKED
COMMITTED
OBSERVED
EFFECTIVE
PARTIALLY_EFFECTIVE
FAILED
RECONCILIATION_REQUIRED
```

These are research dispositions, not an implementation enum.

Critical separation:

```text
TRANSITION_COMMITTED != NEW AUTHORITY EFFECTIVE EVERYWHERE
```

Credential revocation, controller shutdown, old automation disablement and external writer cessation may lag or fail. The old manager may still be capable of effects after the new binding is recorded.

## 10. External -> co-managed -> SB-managed transition

The transition toward more SB authority must prove at least:

1. stable external identity mapping;
2. current compatibility profile;
3. current supply-chain/source evidence where artifact lineage matters;
4. observed configuration snapshot/currentness;
5. existing manager/automation inventory to the extent discoverable;
6. proposed field/operation ownership;
7. credential scope no broader than required;
8. first reconciliation delta;
9. destructive/restart/upgrade blast radius;
10. policy/Client/Workspace authority;
11. post-transition observation proving intended authority became effective.

If old external automation cannot be proven stopped/fenced, the transition may be `PARTIALLY_EFFECTIVE` or `UNKNOWN`, not silently `SB_MANAGED`.

New invariant:

`NEW MANAGER REGISTERED != OLD MANAGER FENCED`.

This mirrors the broader G4 rule `leader/lease elected != stale holder externally fenced`.

## 11. SB-managed -> co-managed/external transition

Handing management back must be first-class and non-destructive by default.

Terraform's `removed { destroy = false }` is strong mature evidence that management binding can be removed while the external object remains.

Candidate handoff protocol:

```text
1 freeze or bound new SB mutations for transferred scopes
2 produce current desired/observed/effective snapshot
3 export portable configuration/contracts/evidence where allowed
4 identify credentials/secrets that must be rotated/revoked/transferred
5 transfer field/operation ownership explicitly
6 establish successor manager readiness where required
7 disable SB reconciliation for transferred scopes
8 verify no pending SB effect can mutate transferred scope unexpectedly
9 detach registration/binding as requested
10 preserve audit/provenance/history without preserving mutation authority
```

Critical invariants:

```text
DETACH != DELETE
HANDOFF_ACK != OLD_RECONCILER_FENCED
EXPORT_COMPLETE != SUCCESSOR_MANAGER_EFFECTIVE
SECRET_REFERENCE_TRANSFER != SECRET_VALUE DISCLOSURE
HISTORICAL_PROVENANCE_RETAINED != ACTIVE AUTHORITY RETAINED
```

## 12. Credential boundaries during adoption/transfer

Credential scope is independent of management mode.

Examples:

- discovery may require no credential or read-only discovery credential;
- verification may require metadata/artifact trust evidence only;
- observe-only should not receive mutation credentials;
- co-management may require separate credentials for distinct operation sets;
- upgrade authority does not imply data-destructive authority;
- detachment may require credential revocation/rotation without revealing secret values.

Candidate evidence:

```text
CredentialBindingRef
  purpose
  target application/service
  operation scope
  Client/Workspace/Environment scope
  source SecretRef
  lease/currentness
  delivery evidence
  consumer-effective evidence?
  revocation/rotation evidence
```

`SecretRef != secret value` remains absolute at the semantic layer.

`credential issued != credential effective at consumer`.

`credential revoked at source != stale credential unable to cause effect` unless the target enforces revocation/currentness accordingly.

## 13. Version compatibility and upgrade authority

Adoption must bind a compatibility profile, not merely a version string.

Candidate dimensions:

```text
protocol/API profile
contract/guarantee profile
configuration schema profile
artifact/source identity
management capability profile
credential/auth model
observability/evidence profile
upgrade/downgrade constraints
```

Therefore:

```text
VERSION STRING MATCH != CONTRACT COMPATIBILITY
SIGNATURE VALID != VERSION ADMISSIBLE
UPGRADE AVAILABLE != UPGRADE AUTHORIZED
```

An externally managed application may advertise a newer version without granting SB permission to upgrade it. A co-managed application may allow configuration changes but reserve upgrade ownership externally.

Rolling version skew must remain representable; Application Manager cannot label the whole registration simply `current` when instances/providers disagree.

## 14. Control Center interaction

Control Center may project application/provider settings, but management ownership remains visible.

For each setting it should be possible to answer:

- who semantically owns this setting?
- which manager currently owns mutation authority?
- what value is desired by each legitimate source?
- what value is observed?
- what value is effective?
- what provenance/inheritance produced the effective projection?
- would changing it cause reload/restart/redeploy/credential rotation?
- is the setting currently writable from this Client/Workspace/application context?

A management transition can therefore change which Control Center fields are writable without changing their semantic identity.

New invariant:

`CONTROL CENTER EDITABILITY != SETTING SEMANTIC OWNERSHIP`.

## 15. Declarative deployment interaction

Adopting an existing service must not silently manufacture a new `ServiceDefinition` that claims SB created or fully understands it.

Candidate distinctions:

```text
DECLARED_BY_SB
IMPORTED_AND_QUALIFIED
PARTIALLY_MODELED
OPAQUE_EXTERNAL
```

A typed ServiceDefinition may progressively model an adopted service, but unsupported/provider-specific dimensions remain explicit gaps/opaque extensions.

`observed provider state -> generated semantic definition` is a hypothesis requiring qualification, not guaranteed inversion.

New invariant:

`PROVIDER OBSERVATION != LOSSLESS CANONICAL INTENT`.

Raw manifests may aid adoption/export but remain provider artifacts, not canonical truth.

## 16. Placement and management authority remain orthogonal

Moving a service between shared managed, dedicated managed, external/BYOI or existing-service placements does not inherently change who manages the application.

Likewise, transferring management authority does not require placement migration.

```text
PLACEMENT TRANSITION != MANAGEMENT TRANSITION
MANAGEMENT TRANSITION != SERVICE REIDENTIFICATION
```

If a placement migration also changes management authority, the two plans must be composed explicitly so partial completion remains representable.

Example failure: data moved and endpoint switched, but old external automation still has update credentials. This is not a completed authority transition merely because placement migration succeeded.

## 17. Workspace/session and editor reconciliation

The :00 recovery research requires Client/Workspace/revision/authority/currentness requalification on restore. Therefore a restored window must not restore a stale management mode as active authority.

```text
RESTORED MANAGEMENT LABEL != RESTORED AUTHORITY
```

The :10 publish-bundle research preserves independent artifact identity/revision. Therefore an application management transition cannot silently repin or republish editor artifacts merely because the application registration changed manager.

```text
APPLICATION MANAGEMENT TRANSITION != ARTIFACT PUBLISH
```

A transition may make an old publish target unavailable or unauthorized; that produces a finding/requalification requirement rather than rewriting the bundle.

## 18. Desktop Observatory and evidence

Observability surfaces should expose management relationship drift without becoming management authority.

Useful candidate observations:

- desired management mode vs effective authority evidence;
- old-manager activity after transfer;
- field ownership conflicts;
- drift remediation blocked by insufficient authority;
- credential rotation/revocation currentness;
- version/profile skew;
- adoption verification staleness;
- unresolved first-reconciliation plan;
- detach completed but external service still healthy (expected, not incident).

`OBSERVED OLD-MANAGER WRITE != AUTHORITY TO REVERSE IT`.

## 19. Adversarial cases

1. **Discovered becomes managed automatically.** Discovery only creates a candidate; no registration/credential/mutation authority follows.
2. **Verified artifact treated as authorized application.** Integrity/provenance verification does not grant Client/Workspace authority.
3. **Imported object receives default configuration on first reconcile.** Adoption must expose first-reconciliation delta before mutation authority activates.
4. **Same external object adopted twice.** Stable external identity mapping must detect or surface duplicate ownership rather than silently creating two managers.
5. **Externally managed app silently upgraded.** Upgrade requires explicit operation authority and compatibility evidence.
6. **Co-managed writers fight.** Field/operation ownership conflict remains visible; no generic last-writer-wins.
7. **SB-managed label survives authority revocation.** UI summary must degrade when authority evidence/currentness expires.
8. **Detach destroys external resource.** Detach/unregister defaults non-destructive; destruction requires separate authority/plan.
9. **Uninstall revokes unrelated external data.** Application installation ownership cannot imply ownership of external business data.
10. **Old manager keeps reconciling after handoff.** New binding remains partially effective/unknown until old conflicting effect rights are fenced or bounded.
11. **Credential copied during handoff.** SecretRef/credential purpose remains explicit; transfer does not imply raw-value disclosure.
12. **Credential revoked but stale session remains valid.** Revocation evidence must be qualified against target enforcement/currentness.
13. **Placement move treated as authority handoff.** Placement and management transitions remain orthogonal.
14. **Authority handoff treated as redeploy.** Existing effective service may continue unchanged while manager changes.
15. **Provider manifest becomes imported truth.** Provider artifact remains observation/artifact; unsupported intent stays unknown/opaque.
16. **Control Center takes ownership because it can render a field.** UI projection does not own application semantics.
17. **Automatic binding grants broader credential than needed.** Binding selection must expose purpose/scope and reject privilege expansion.
18. **Version label matches but management API guarantees differ.** Compatibility remains multidimensional.
19. **Supply-chain signature valid but signer not admissible for this Client.** Trust verification and policy authorization remain separate.
20. **Window restore revives stale management authority.** Restore requalifies authority/currentness independently of shell state.
21. **Application close stops reconciler/service.** Window/session lifecycle remains independent of management/runtime lifecycle.
22. **Adopted object is deleted externally.** Observation reports disappearance; recreate is allowed only if explicit `Create` authority/desired semantics exist.
23. **External change is silently imported as desired state.** Observation and adoption of drift are separate authority decisions.
24. **Management transfer has provider ACK only.** ACK does not prove old manager stopped or new policy effective.

## 20. Proof obligations

PO-01. One external object cannot silently acquire two conflicting SB management identities.

PO-02. Discovery cannot grant registration, credentials or mutation authority.

PO-03. Verification evidence is current and scoped to the identity/artifact/profile being adopted.

PO-04. Supply-chain verification cannot substitute for Client/Workspace authorization.

PO-05. Adoption preserves external origin/provenance and does not claim SB creation.

PO-06. First reconciliation delta is inspectable before newly granted mutation authority can produce material effects.

PO-07. UX management modes cannot expand the underlying authority vector.

PO-08. Co-managed fields/operations have explicit ownership or an explicit merge/conflict law.

PO-09. Unknown field ownership cannot silently become SB-owned.

PO-10. Drift observation does not grant remediation authority.

PO-11. Upgrade requires separate authority from configure/update where contracts distinguish them.

PO-12. Delete/uninstall/destructive-data authority is independently represented and never inferred from registration/adoption.

PO-13. Unregister/detach can preserve the external service and its semantic identity.

PO-14. Management transfer preserves application/service identity unless an explicit identity migration is separately justified.

PO-15. Transition commitment does not claim effective authority until required old/new manager evidence is qualified.

PO-16. Old conflicting manager/effect rights are fenced, disabled, expired under a target-enforced rule, or remain explicitly `UNKNOWN/PARTIAL`.

PO-17. Credential scope does not widen implicitly during adoption or authority transition.

PO-18. Secret values are not persisted into semantic registration, desktop/session, diff, observability or export artifacts by convenience.

PO-19. Credential rotation/revocation distinguishes source action from consumer/target effectiveness.

PO-20. Placement migration does not alter semantic application/service identity by itself.

PO-21. Placement migration and authority transition can fail independently and partial state remains representable.

PO-22. Control Center rendering/editability does not transfer semantic ownership of application/provider settings.

PO-23. Application-specific advanced settings preserve adapter provenance and owner-specific conflict semantics.

PO-24. Imported/provider observations cannot be inverted into canonical intent without declared qualification/lossiness.

PO-25. Raw provider artifacts remain non-canonical even when used to bootstrap adoption.

PO-26. Restored WorkspaceSession requalifies management authority/currentness before protected mutation.

PO-27. Application management transition cannot silently republish, repin or mutate editor publish bundles.

PO-28. Version compatibility is multidimensional and cannot be reduced to version-string equality.

PO-29. Externally managed applications cannot be silently upgraded by catalog/recommendation automation.

PO-30. Provider/controller ACK does not prove management transition effectiveness.

PO-31. Detach retains sufficient provenance/audit evidence without retaining mutation authority.

PO-32. `UNKNOWN` in manager fencing, credential revocation, compatibility or first-reconcile impact cannot be converted to success by UI summarization.

## 21. Reconciliations and contradictions

### 21.1 Managed-mode labels vs real authority

Resolved by treating the four requested labels as UX projections over a scoped authority vector. This preserves usability without losing conformance detail.

### 21.2 Adopt existing vs declarative desired state

Resolved by making adoption qualification precede mutating reconciliation. Declarative intent may be progressively established, but observed external state is not automatically desired truth.

### 21.3 Anti-lock-in vs SB-managed convenience

Resolved by first-class non-destructive detach/handoff. Strong SB management does not require permanent ownership; export, authority handoff and external continuation are explicit lifecycle concerns.

### 21.4 Co-management vs deterministic reconciliation

Not fully resolved. Determinism is possible only inside explicitly owned fields/operations or declared merge laws. Arbitrary concurrent writers remain a conflict domain.

### 21.5 Automatic bindings vs transparency

Resolved at principle level: automatic selection is allowed only with inspectable rule, target, authority, scope, currentness and consequences. Automation cannot erase the dependency.

## 22. Maturity / saturation

### Materially mature at principle level

- `Install != Adopt`;
- `Discover != Verify != Register`;
- management authority is a scoped vector, not one boolean;
- detach/unregister is distinct from uninstall/delete;
- management transfer preserves application/service identity;
- co-management requires explicit field/operation ownership;
- first reconciliation after adoption is a distinct safety boundary;
- placement and management transitions are orthogonal;
- credentials and secret bindings have independent authority/currentness;
- restored UI/session state cannot restore management authority by implication.

### Not saturated

- exact external identity matching under provider/version changes;
- conflict laws for genuinely shared/co-managed fields;
- proof of old-manager fencing for heterogeneous external systems;
- transition behavior for long-running upgrades/restarts while authority changes;
- portable export package for handoff to an external manager;
- compatibility negotiation when management API and runtime API versions skew independently;
- multi-manager observation when some writers are undiscoverable.

## 23. Next highest-value gap

The next highest-value gap is **management handoff with in-flight effects and reconciler overlap**.

Research should determine how pending restart/upgrade/configuration/secret-rotation/placement effects behave when management authority changes mid-flight; how effect identity and old/new manager lineage survive retries; when the old manager must drain, fence or merely stop new admissions; how to represent a transition that is committed but not yet effective; and how to prevent a new manager from retrying an ambiguous old effect as if it were new work.

This directly connects Application Manager, Control Center, declarative deployment, Vault bindings, placement migration and the existing G4 effect/settlement invariants without introducing a global transaction or central semantic owner.
