# G4 — Web Desktop Cross-Cutting Architecture & Conformance Research

Status: `RESEARCH_ACTIVE / NON_EXECUTABLE`
Execution authority: NONE
Date: 2026-09-22
Scope: G4 Web Desktop & Application Environment — transversal architecture/conformance

## 1. Purpose and repository boundary

This artifact reconciles the Web Desktop research program across Builder Home/client tenancy, Workspace/Desktop taxonomy, Window Manager, Application Portfolio/Application Manager, Control Center, declarative service deployment, placement, Vault/environment bindings, observability surfaces, proprietary editors and external tools.

It preserves the candidate hierarchy:

`Builder Home/Factory -> Client -> Workspace -> Desktop Sphere -> Application -> Window -> View/Tab/Tool`

3D remains an optional projection/application. It is not a mandatory navigation foundation or canonical truth.

This research does not reopen G3, select providers, authorize implementation, or materialize WBS/Work Packages/Sprints/TASKs.

## 2. Inputs consumed

Repository evidence:

- `AGENTS.md` constitutional invariants, especially `Builder != Runtime`, published-runtime autonomy, replaceable suite modules and explicit bounded-context contracts.
- `docs/architecture/MASTER_BLUEPRINT.md`, especially `Release + Environment = Deployment`, autonomous runtime and replaceable-suite boundaries.
- `G4_RESEARCH_STATE.md` and the formal Web Desktop research program.
- recent :00/:10 deltas: `G4_WEB_DESKTOP_WINDOW_LIFECYCLE_RESEARCH.md` and `G4_PROPRIETARY_EDITOR_SHARED_FOUNDATION_RESEARCH.md`.

External primary evidence reviewed:

- Kubernetes object model: `spec` records desired state while `status` reports current state; controllers reconcile them. `observedGeneration` qualifies which generation a status reflects. https://kubernetes.io/docs/concepts/overview/working-with-objects/ and https://kubernetes.io/docs/concepts/workloads/pods/
- Kubernetes API concurrency/Server-Side Apply: `resourceVersion` detects stale updates; managed fields make field-management conflicts explicit rather than silently overwriting another manager. https://kubernetes.io/docs/reference/using-api/api-concepts/
- Crossplane managed-resource policies: Create/Observe/Update/Delete/LateInitialize can be combined, including observe-only and no-delete patterns. This is useful evidence that management authority is a vector, not a boolean. https://docs.crossplane.io/v2.3/managed-resources/managed-resources/
- Terraform/OpenTofu import: existing remote objects can be imported/adopted into managed state, with an explicit warning that one remote object should map to one resource address. https://developer.hashicorp.com/terraform/cli/commands/import and https://opentofu.org/docs/cli/import/
- HashiCorp Vault Secrets Operator: secret source, destination, lease/refresh and rollout/restart behavior are separate concerns; event notifications are not guaranteed and periodic refresh remains recommended. https://developer.hashicorp.com/vault/docs/deploy/kubernetes/vso and https://developer.hashicorp.com/vault/docs/deploy/kubernetes/vso/api-reference
- Sigstore/Cosign: artifact signatures bind to image digests and verification can bind certificate identity/issuer; attestations add independently verifiable supply-chain evidence. https://docs.sigstore.dev/cosign/verifying/verify/ and https://docs.sigstore.dev/cosign/verifying/attestation/

These products are pattern evidence only, not adoption decisions.

## 3. Cross-cutting identity model

The desktop hierarchy is a navigation/context hierarchy, not a cascading ownership hierarchy.

Candidate identities remain distinct:

```text
BuilderFactoryRef
ClientRef
WorkspaceRef
DesktopSphereRef
ApplicationDefinitionRef
ApplicationRegistrationRef
ApplicationInstallationRef?
ApplicationBindingRef
WindowRef
ViewRef
ServiceDefinitionRef
ServiceInstanceRef
DeploymentUnitRef
PlacementRef
EnvironmentRef
SecretRef
ProviderArtifactRef
EvidenceRef
```

The exact primitive set remains research-only, but the separations are material.

New/reaffirmed invariants:

- `Client context != authority grant`.
- `Workspace membership != tenant ownership`.
- `Desktop placement != application ownership`.
- `Application registration != application installation != service deployment`.
- `Application window != application process/service instance`.
- `Service identity != deployment unit != placement != endpoint`.
- `Endpoint/IP != service identity`.
- `Shared infrastructure != shared tenant data/authority`.
- `Application discovered != application verified != application registered`.

A stale ClientRef/WorkspaceRef must fail closed for protected effects or remain explicitly stale/unknown; the shell must never silently fall back to the last active tenant.

## 4. Application Manager — lifecycle and authority vector

### 4.1 Install-new and adopt-existing are different operations

`Install` starts from a desired application/service definition and attempts to create/activate required artifacts/resources.

`Adopt` starts from an already-existing external object/application and establishes a qualified SB relationship to it.

Therefore:

`Install != Adopt`
`Adopt != Discover`
`Discover != Register`
`Register != Deploy`
`Connect != Own`

OpenTofu/Terraform import provides mature evidence for this distinction: import binds an existing remote object to a declared resource address rather than pretending the tool created it.

### 4.2 Management mode must be decomposable

The requested labels remain useful UX summaries:

- `SB_MANAGED`
- `EXTERNALLY_MANAGED`
- `CO_MANAGED`
- `OBSERVE_ONLY`

But they should not be the canonical authority model. Crossplane demonstrates why: create/update/delete/observe/late-initialize rights can vary independently.

Candidate underlying `ManagementAuthorityVector`:

```text
mayDiscover
mayRegister
mayObserve
mayConfigure
mayCreate
mayUpdate
mayRestart
mayUpgrade
mayScale
mayMovePlacement
mayRotateBinding
mayDelete
mayUnregister
mayUninstall
mayAdoptExternalChanges
field/setting ownership qualifiers
```

A UI mode may summarize this vector, but cannot expand it.

Critical invariant:

`management mode label != management authority proof`.

An externally managed application must never be silently upgraded because an SB catalog has a newer version.

### 4.3 Discovery and verification

Discovery produces a candidate with provenance:

```text
DiscoveredApplicationCandidate
  discoverySource
  observedIdentityHints
  endpoints
  versionClaims
  source/artifact claims
  credentialRequirementRefs
  observedAt/currentness
```

Verification is separate and may include identity, endpoint ownership, protocol/profile compatibility, artifact digest/signature/attestation, version claims and credential scope.

`network reachable != verified application`
`version string != artifact identity`
`signature valid != application authorized for this Client/Workspace`.

Sigstore is useful evidence that digest, signer identity and attestation are separately checkable dimensions.

### 4.4 Upgrade/unregister/uninstall semantics

- `Upgrade`: change application/service version or compatible artifact lineage; may imply rollout/restart but not by definition.
- `Unregister`: remove SB's registration/binding while preserving external object unless separate deletion authority exists.
- `Uninstall`: remove SB-installed application artifacts according to explicit ownership/deletion policy.
- `Delete external resource`: distinct destructive operation requiring separate authority/evidence.

Thus:

`Unregister != Uninstall != Delete external service`.

Adopted/external objects default to non-destructive detach semantics unless a later explicit authority transition says otherwise.

## 5. Control Center — unified projection, distributed ownership

The Control Center is researched as a federated configuration/governance surface, not one global settings database.

Candidate setting envelope:

```text
SettingRef
  semanticOwner
  scope
  valueType/schema
  desiredValue or SecretRef
  source/provenance
  inheritanceChain
  effectiveValueProjection
  currentness
  authorityRequirements
  applySemantics
  restart/reloadImpact
  environmentApplicability
  evidenceRefs
```

### 5.1 Scope and inheritance

Candidate scopes may include Builder, Client, Workspace, Environment, Application, Service and Instance/Placement where semantically legitimate.

Inheritance must be explicit and inspectable:

`effective setting = qualified resolution of sources`, not `nearest value wins` by assumption.

Each setting family must declare whether inheritance, override, merge, append, deny/constraint or no-inheritance is legal.

### 5.2 Policy and configuration remain separate

`Policy != configuration`.

A policy may constrain admissible configuration without being another configuration value. A configuration adapter cannot override policy by writing an equivalent-looking provider setting.

### 5.3 Provenance and field ownership

Kubernetes Server-Side Apply is useful evidence that multiple managers need explicit field ownership/conflict behavior. SB should preserve analogous semantic provenance without adopting Kubernetes mechanics automatically.

`same setting path != same semantic owner`.

Application-specific advanced settings remain owned by the application/provider contract. Control Center may host/project them through typed adapters; it does not absorb ownership.

### 5.4 Change planning and blast radius

A Control Center change needs a plan before effect where material:

```text
ConfigChangePlan
  target refs
  source/base revisions
  proposed semantic changes
  inheritance/effective-value delta
  affected bindings/deployments/windows?
  reload/restart/redeploy candidates
  secret/currentness implications
  policy findings
  blast-radius confidence/unknown frontier
  required authority/approval
  rollback/recovery candidate
```

`global-looking setting != globally safe operation`.

A setting change that may restart 200 services must expose that effect before commitment. Unknown blast radius remains `UNKNOWN`, not zero.

### 5.5 Desired/configured/applied/effective

At minimum preserve:

`Configured != Applied != Effective`.

For reconciled service state preserve:

`Desired != Observed != Effective`.

Kubernetes `spec/status/observedGeneration` is evidence that observed state must qualify which desired generation it reflects. A provider ACK only proves acceptance at its own boundary.

## 6. Declarative Service Deployment

### 6.1 Canonical service intent is typed, not provider YAML

Candidate:

```text
ServiceDefinition
  serviceIdentity
  serviceKind/contract
  artifactRef + integrity requirements
  version/profile
  environmentBindingRequirements
  configurationRefs
  secretBindingRequirements
  network requirements
  storage requirements
  resource/capacity requirements
  health/readiness/effect evidence requirements
  placement constraints/preferences
  lifecycle/update strategy
  observability contract
```

Provider-specific manifests are compiled/exported artifacts:

`ServiceDefinition -> qualified binding/placement -> ProviderArtifact`.

`ProviderArtifact != canonical service definition`.

A raw-manifest escape hatch may exist for unsupported provider features, but must be explicitly typed as opaque/provider-specific material with portability and verification loss visible. YAML must not silently become canonical architecture.

### 6.2 Deployment Unit is logical

A `DeploymentUnit` is a placement/reconciliation grouping, not a physical server. It may map to one host, many hosts, a namespace/project, an external SaaS target or another provider-specific construct.

`Deployment Unit != physical server`.

### 6.3 Generated identity and bindings

Generated service identity must be stable independently of endpoint/IP/host. Network, storage, environment and secret bindings are explicit references with evidence.

Automatic binding is permitted only when inspectable:

`Automatic != hidden`.

Every auto-binding must expose candidate source, selection rule, resolved target, authority, environment scope, currentness and override/rejection path.

### 6.4 ACK, observed and effective

Candidate lifecycle evidence:

```text
DESIRED
-> COMPILED
-> SUBMITTED
-> PROVIDER_ACKNOWLEDGED
-> OBSERVED_PRESENT
-> READY/AVAILABLE evidence
-> EFFECTIVE_FOR_DECLARED_CONTRACT
```

These are not necessarily one linear enum; they are evidence dimensions.

`Provider ACK != service effective`.
`resource exists != contract effective`.
`health green != semantically compatible`.

## 7. Hosting / placement model

Commercial/example labels such as shared-managed, dedicated-managed, BYOI/external and existing-service are treated as profiles over a general placement model.

Candidate dimensions:

```text
PlacementProfile
  infrastructureOwner
  managementAuthorityVector
  isolation model
  tenancy model
  capacity model
  network/trust zone
  data residency constraints
  provider/runtime class
  lifecycle authority
  observability reach
  secret delivery capability
  migration capabilities/constraints
  cost/FinOps qualifiers
```

This permits profiles without freezing provider names.

Critical invariants:

- `Service semantic identity != placement`.
- `Placement migration != service re-identity`.
- `Shared placement != shared business data`.
- `Dedicated placement != exclusive semantic authority`.
- `Existing service != unmanaged by definition`.
- `External/BYOI != unobservable by definition`.

Migration between placements is a lifecycle transition with old/new endpoint, data/effect, authority, secret and currentness obligations. DNS/routing movement alone is not migration proof.

## 8. Vault/secret and environment bindings

### 8.1 SecretRef never becomes secret value in the semantic model

`SecretRef != secret value`.

The semantic binding should identify purpose, source/provider reference, target consumer, environment/scope, delivery mechanism class, rotation/currentness policy and disclosure boundary. Raw secret values must not be copied into desktop state, provider artifacts, logs, diff views, observability surfaces or application catalogs unless an explicitly authorized provider boundary requires transient materialization.

### 8.2 Auto-binding must preserve dependency visibility

Vault VSO demonstrates that lease/refresh, destination and restart-on-rotation are distinct. It also documents that event notifications are not guaranteed, so periodic refresh may still be needed.

Therefore:

`secret event observed != all consumers refreshed`.
`secret rotated != application effectively using new secret`.
`auto-bound != dependency-free`.

A consumer that cannot hot-reload may require an explicit rollout/restart effect, which belongs in the change plan/blast radius.

### 8.3 Environment binding

Environment defaults are qualified inputs, not hidden globals. Resolution must retain provenance and permit environment-specific incompatibility.

`same ApplicationDefinition + different EnvironmentBinding` may legitimately produce different provider artifacts while preserving application semantic identity.

## 9. Desktop Observatory and Pinned Monitoring Surfaces

These remain projections over shared telemetry/evidence, not independent polling authorities.

- Observatory = compact contextual summary.
- Pinned Monitoring Surface = persistent configurable monitoring composition.
- Operations application = management/diagnostic capability.

`visible widget != current evidence`.
`pinned != semantic priority`.
`telemetry received != desired/observed/effective reconciliation complete`.

Pinned surfaces must preserve Client/Workspace/Environment scope and disclosure policy. A stale client context is a tenant-leak risk even when the underlying telemetry is technically reachable.

## 10. Proprietary editors and external applications

The :10 editor research is reconciled as a `SharedEditorFoundation` that owns mechanics, not domain semantics. The Desktop shell hosts editor applications/windows; it does not become their document authority.

External tool integration is likewise a portfolio/binding problem. An embedded/proxied/deep-linked/API-backed/native-bridge application needs explicit identity, trust origin, credential boundary, navigation/context transfer and capability/contract profile.

`iframe/proxy/API connectivity != semantic integration`.
`single sign-on != shared authorization semantics`.
`adapter translation != semantic equivalence proof`.

Application-specific settings projected into Control Center retain their semantic owner and adapter provenance.

## 11. Cross-cutting conformance matrix

| Concern | Desired/configured | Observed | Effective | Evidence/currentness |
|---|---|---|---|---|
| Application registration | intended registration/mode | discovered/registered state | usable under declared contract | verification + compatibility evidence |
| Configuration | configured/inherited value | provider/app reports | behavior uses intended value | generation/revision + apply evidence |
| Service deployment | ServiceDefinition | provider/runtime state | contract-ready service | readiness/compatibility/effect evidence |
| Secret binding | SecretRef/binding intent | secret delivery/lease state | consumer uses admissible secret | lease/rotation/reload evidence |
| Placement | placement intent | actual host/provider topology | service contract preserved there | identity/isolation/capacity evidence |
| Monitoring | subscription/layout intent | telemetry samples | operational conclusion | timestamp/currentness/source quality |
| Window | layout/session intent | browser/shell state | usable current application context | revision/authority/currentness evidence |

No row may collapse its four columns into one status badge without preserving drill-down.

## 12. Mandatory adversarial reconciliation

1. **Tenant leak:** cached Window/Monitoring Surface reopens under Client B with Client A bindings. Required response: scope mismatch blocks protected data/effects and requires explicit requalification.
2. **Stale client context:** shell visually says Client A while command context carries old Workspace B. Context identity must be bound to commands and evidence, not inferred from chrome.
3. **Hidden secret exposure:** diff/export/provider manifest includes raw secret. SecretRef boundary must prevent accidental materialization/disclosure.
4. **Discovered but unverified app:** reachable endpoint appears in catalog. It remains candidate/unverified; no install/adopt/credential grant by discovery alone.
5. **Externally managed app silently upgraded:** management authority vector forbids upgrade unless explicit transition/authority exists.
6. **Global setting causes restart:** change plan must expose restart/redeploy blast radius before commitment.
7. **Shared infrastructure mistaken for shared authority:** co-placement never merges Client/data/policy ownership.
8. **Provider artifact becomes canonical:** generated YAML differs from provider observed state. Canonical semantic intent remains ServiceDefinition plus qualified bindings; artifact and observed state are evidence/projections.
9. **UI close stops runtime:** forbidden by independent Window/Application/Service lifecycles.
10. **Adapter fabricates equivalence:** provider lacks required guarantee. Adapter must expose incompatibility/lossiness rather than relabel success.
11. **Placement migration changes identity:** endpoint/host changes but ServiceRef remains stable; new placement must prove contract continuity.
12. **App settings conflict with Control Center:** semantic owner/field provenance and conflict handling prevent last-writer-wins overwrite.
13. **Automatic binding hides dependency:** auto-selected Vault/network/storage binding must remain inspectable with source/rule/currentness.
14. **Provider ACK false success:** submit returns success while readiness/effect never converges; UI remains acknowledged/not-effective.
15. **Observe-only drift remediation:** observed drift must not trigger write because observation authority does not imply update authority.
16. **Adopt duplicate identity:** same external service is adopted twice under separate local identities; identity-resolution/conflict evidence must prevent silent double ownership.
17. **Secret rotation with non-reloading consumer:** secret source is current but application still uses predecessor credential; effective state remains divergent until reload/restart evidence.
18. **Raw escape hatch expands silently:** provider-specific opaque field becomes required semantic dependency; portability loss must be surfaced and cannot silently redefine canonical service meaning.

## 13. New/reconciled proof obligations

PO-1. Every protected command/effect binds Client + Workspace + Environment context explicitly enough to prevent stale-context tenant crossover.

PO-2. Management authority is at least operation-scoped; `OBSERVE_ONLY` can never imply update/delete/upgrade.

PO-3. Adoption of an existing application/resource preserves external identity/provenance and cannot fabricate creation ownership.

PO-4. Unregistering an adopted/external application cannot delete the external resource without independently proven deletion authority.

PO-5. Application artifact/version verification and Client/Workspace authorization remain separate evidence domains.

PO-6. Control Center can explain effective configuration provenance and conflicts without becoming the semantic owner of every setting.

PO-7. Policy constraints cannot be overridden through a configuration adapter that merely produces provider-compatible syntax.

PO-8. Any setting change with restart/redeploy/secret-rotation consequences exposes the qualified blast radius or explicit `UNKNOWN` before effect.

PO-9. Provider acceptance cannot be presented as service effectiveness; observed generation/currentness must be tied to the intended revision where possible.

PO-10. Provider artifacts/raw manifests are reproducible/exportable projections and never silently become canonical semantic truth.

PO-11. Raw-manifest escape hatches declare provider lock-in, semantic opacity and validation limitations.

PO-12. Service identity survives endpoint/host/placement migration unless an explicit semantic replacement operation occurs.

PO-13. Placement profiles preserve isolation, authority, residency and capacity constraints independently of marketing/profile names.

PO-14. Automatic network/storage/secret/environment binding remains inspectable and rejectable; no critical dependency is hidden.

PO-15. Secret values are excluded from ordinary desktop/session/config/diff/telemetry state; only SecretRefs and qualified evidence cross semantic/UI boundaries by default.

PO-16. Secret rotation is not effective until the consuming application's declared reload/restart/use evidence is satisfied.

PO-17. Monitoring surfaces preserve tenant/environment/disclosure scope and do not promote stale telemetry to current evidence.

PO-18. Closing/minimizing/suspending a Window cannot mutate remote service lifecycle unless the user invokes a distinct service operation with its own authority.

PO-19. External application embedding/connectivity/SSO does not fabricate shared semantic authorization or ownership.

PO-20. Application-specific advanced settings retain owner/provenance and conflict semantics when projected into Control Center.

PO-21. Supply-chain verification binds immutable artifact identity (for example digest) plus signer/attestation policy where required; mutable tags/version labels alone are insufficient evidence.

PO-22. Discovery, verification, registration, installation/adoption, deployment and effective readiness are independently representable states/evidence.

PO-23. A shared infrastructure substrate cannot collapse tenant isolation or authorize cross-client reads/effects.

PO-24. Desired/Observed/Effective/Currentness/Evidence remain inspectable across Application Manager, Control Center, Deployment, Placement, Vault binding and monitoring views.

## 14. Contradictions and trade-offs found

### T1 — simple management modes vs real authority

Four management-mode labels are useful for humans but insufficient as architecture. Mature infrastructure controllers expose independent create/update/delete/observe behavior. Resolution: retain labels as projections over an operation/field-scoped authority vector.

### T2 — convenient auto-binding vs dependency transparency

Auto-binding reduces configuration burden but can hide Vault/network/storage/environment coupling. Resolution: automation is allowed only with provenance, selection rule, resolved target, currentness and override/rejection visibility.

### T3 — unified Control Center vs distributed ownership

A single UI improves search/diff/operations, but one global store would create ownership and coupling hazards. Resolution: federated semantic owners + normalized projection/adapters + explicit provenance/conflicts.

### T4 — declarative portability vs provider-specific power

A portable typed ServiceDefinition cannot model every provider feature. Resolution: provider-specific opaque extensions/raw escape hatch remain explicit, bounded and visibly non-portable; they do not redefine portable core semantics.

### T5 — adoption convenience vs accidental ownership

Import/adopt makes existing services manageable, but full management after adoption can be destructive. Resolution: adoption establishes identity/binding first; management rights are negotiated/declared separately.

### T6 — secret synchronization convenience vs actual consumer state

A secret operator can refresh destination material, yet an application may not reload it. Resolution: secret-source currentness, delivered-secret currentness and consumer-effective credential state are distinct.

## 15. Maturity / saturation by domain

- **Shell/window lifecycle:** `PARTIALLY_MATURE`; recent :00 research has a solid orthogonal-state model. Remaining multi-surface recovery/close protocol gaps.
- **Proprietary editor shared foundation:** `PARTIALLY_MATURE`; :10 research established mechanics-vs-domain boundary. Cross-editor publish bundle/authority remains open.
- **Application Manager:** `MATERIAL / NOT_SATURATED`; lifecycle and authority vector are now materially clearer. Highest gaps: identity resolution for adoption, compatibility negotiation, upgrade planning and destructive detach/uninstall proof.
- **Control Center:** `MATERIAL / NOT_SATURATED`; provenance/inheritance/field ownership/blast-radius model established. Highest gap: formal scope/inheritance algebra and cross-owner transactional/change-plan semantics.
- **Declarative Service Deployment:** `MATERIAL / NOT_SATURATED`; typed intent/provider-artifact separation and evidence ladder established. Highest gap: service schema/profile compatibility and provider compilation conformance.
- **Placement/hosting:** `MATERIAL / NOT_SATURATED`; generalized profile dimensions established. Highest gap: placement migration frontier and data/effect continuity proof.
- **Vault/environment bindings:** `MATERIAL / NOT_SATURATED`; secret-ref, rotation and consumer-effective distinctions established. Highest gap: credential lease/revocation/rotation under offline/autonomous runtime and co-managed providers.
- **Observatory/pinned monitoring:** `PARTIALLY_MATURE`; role separation exists. Highest gap: telemetry subscription ownership, disclosure propagation and stale-context recovery.
- **External application integration:** `EARLY_MATERIAL`; portfolio semantics exist but trust-origin/credential/navigation/compatibility matrix is still thin.

No domain is declared saturated in this round.

## 16. Next highest-value gap

The next transversal gap is **Application Adoption + Management Authority Transition Protocol**.

It should determine how an existing service/application moves through:

`DISCOVERED -> VERIFIED -> REGISTERED -> OBSERVE_ONLY/EXTERNAL -> CO_MANAGED? -> SB_MANAGED?`

without identity duplication, accidental takeover, hidden field ownership, credential overreach or destructive uninstall semantics. It should include version/profile compatibility, authority delegation/revocation, field/operation ownership, drift direction, migration back to external management, and evidence needed before every transition.

This gap is higher-value than adding more desktop surfaces because it sits at the boundary between anti-lock-in, existing-system compatibility, Control Center, declarative deployment and provider reconciliation.