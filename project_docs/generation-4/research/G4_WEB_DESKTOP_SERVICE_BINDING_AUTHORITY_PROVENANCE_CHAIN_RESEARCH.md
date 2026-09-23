# G4 — Web Desktop Service Binding Authority & Provenance Chain Research

Status: `RESEARCH_ACTIVE / NON_EXECUTABLE`
Execution authority: NONE
Date: 2026-09-22
Scope: G4 Web Desktop & Application Environment — Application Manager / Control Center / declarative service deployment / environment + secret auto-binding / observability

## 1. Purpose

This round addresses the highest-value transversal gap remaining after Application Adoption, in-flight management handoff, durable WorkspaceSession, Application Portfolio and cross-cutting conformance research: how a registered/adopted application becomes configured, bound, deployed, observed and reconciled without collapsing semantic intent into provider artifacts or turning automatic binding into hidden authority.

This is research only. It does not authorize implementation, WBS, Work Packages, Sprints, TASKs, provider adoption, package changes or runtime changes.

## 2. Repository evidence consumed and deduplicated

The repository already establishes:

- `Builder != Runtime`; published runtime autonomy; replaceable suite modules; explicit bounded-context contracts.
- `Release + Environment = Deployment`; provider artifacts are downstream materializations rather than canonical business/system meaning.
- `Install != Adopt`; `Register != Deploy`; `Discovered != Verified`.
- management relationship is a versioned binding and management authority is operation/field scoped rather than a boolean.
- authority transition and effect lineage are orthogonal; successor management does not reidentify predecessor effects.
- `SecretRef != secret value`; secret source currentness, delivery, consumer use and old-credential fencing are distinct.
- `Desired != Observed != Effective`; provider ACK is not effect.
- `Automatic != hidden`; auto-binding must expose source, rule, target, scope, authority and currentness.
- Control Center is a federated projection over semantic owners, not one universal settings owner.
- Window/session/UI lifecycle is independent from runtime/service lifecycle.

Accordingly this round does not repeat lifecycle taxonomy or Window Manager work. It deepens the chain connecting Application Manager, Control Center, ServiceDefinition, Binding resolution, Vault/environment references, provider compilation and operational evidence.

## 3. External evidence and contradictory lessons

### 3.1 Vault leases: a binding is temporal, not merely referential

Vault dynamic secrets and service tokens carry leases with TTL, renewal and revocation semantics. Once a lease expires, the consumer can no longer assume the secret remains valid. Revocation can invalidate the credential before its original TTL. This means a `SecretRef` resolving successfully once is not durable evidence of continuing admissibility.

Portable lesson:

`SECRET_REF_RESOLVED != LEASE_CURRENT != CONSUMER_USING != TARGET_ACCEPTING`.

### 3.2 Vault Kubernetes integrations: one semantic need admits multiple delivery realizations

Vault documents multiple Kubernetes integrations with materially different storage/delivery models (operator, CSI, agent). Therefore provider/delivery selection cannot be inferred from the semantic requirement “service needs credential X”. The binding must preserve a semantic requirement plus a qualified realization.

Portable lesson:

`BindingRequirement != BindingRealization`.

### 3.3 OpenTelemetry resources: observation identity must be explicit

OpenTelemetry resources distinguish logical `service.name`, service version, instance identity, host and deployment environment. Environment/host detection can be automatic, but detected resource attributes remain observations of a running resource rather than authority to redefine SB semantic service identity.

Portable lesson:

`Detected environment/host != desired environment/placement authority`.

### 3.4 Backstage catalog: catalog registration/lifecycle is not deployment authority

Backstage models catalog entities with owner/lifecycle/relations and processing status. This is useful evidence that catalog knowledge and lifecycle classification can exist independently from runtime deployment management.

Portable lesson:

`Catalog registration != deployment ownership`.

## 4. Core finding — use a provenance-preserving chain, not a magic deploy object

Candidate chain:

```text
ApplicationDefinitionRef
  -> ApplicationRegistrationRef
  -> ManagementBindingRef
  -> ConfigurationResolutionRef
  -> ServiceDefinitionRef
  -> BindingRequirementRefs[]
  -> BindingResolutionPlanRef
  -> BindingRealizationRefs[]
  -> DeploymentIntentRef
  -> ProviderCompilationRef
  -> ProviderSubmissionRef
  -> ObservedDeploymentRef
  -> EffectiveServiceClaimRef
```

Each arrow is a typed derivation/transition with provenance and evidence. No node is permitted to overwrite predecessor meaning.

New/reaffirmed invariants:

```text
APPLICATION REGISTRATION != SERVICE DEFINITION
SERVICE DEFINITION != DEPLOYMENT INTENT
BINDING REQUIREMENT != BINDING REALIZATION
SECRET REF != CREDENTIAL MATERIAL
AUTO-BIND CANDIDATE != AUTO-BIND DECISION
BINDING RESOLVED != BINDING DELIVERED
BINDING DELIVERED != CONSUMER EFFECTIVE
PROVIDER ARTIFACT != SEMANTIC DEFINITION
PROVIDER ACK != OBSERVED PRESENT
OBSERVED PRESENT != EFFECTIVE FOR CONTRACT
DETECTED PLACEMENT != DESIRED PLACEMENT
TELEMETRY RESOURCE IDENTITY != MANAGEMENT AUTHORITY
```

The chain should remain inspectable in both Application Manager and Control Center while preserving distributed semantic ownership.

## 5. BindingRequirement and BindingRealization

Candidate requirement envelope:

```text
BindingRequirement
  requirementIdentity
  semanticOwner
  service/application scope
  environment/classification scope
  kind: secret | database | storage | network | endpoint | queue | external-api | telemetry | other
  required contract/profile
  authority requirements
  confidentiality/disclosure class
  currentness requirements
  rotation/renewal requirements
  availability/degradation policy
  placement/trust-zone constraints
  consumer reload/restart semantics
```

Candidate realization envelope:

```text
BindingRealization
  requirementRef
  provider/binding adapter ref
  external target identity
  environment/placement scope
  SecretRef or non-secret resource ref
  delivery mechanism class
  lease/currentness evidence refs
  compatibility evidence refs
  authority evidence refs
  generated provider-artifact refs
  observed/effective evidence refs
```

A realization satisfies a requirement only through qualified evidence. Name equality, reachability or a successful provider API call is insufficient.

## 6. Auto-binding is a proposal protocol

Automatic resolution is useful, but should behave as an inspectable proposal/qualification protocol:

```text
REQUIREMENT_DECLARED
-> CANDIDATES_DISCOVERED
-> CANDIDATES_QUALIFIED
-> PREFERRED_CANDIDATE_PROPOSED
-> POLICY/AUTHORITY_CHECKED
-> IMPACT_PREVIEWED
-> BINDING_DESIRED
-> REALIZATION_SUBMITTED
-> REALIZATION_OBSERVED
-> CONSUMER_EFFECT_VERIFYING
-> EFFECTIVE | PARTIAL | STALE | UNKNOWN | RECONCILIATION_REQUIRED
```

`AUTO_SELECTED` is not an authority state. For low-risk deterministic cases policy may allow automatic progression, but the rule, evidence and consequence remain inspectable after the fact.

A rejected automatic candidate must remain explainable: incompatible profile, wrong Client/Environment, insufficient authority, stale evidence, disclosure violation, placement mismatch, lease horizon too short, unsupported reload semantics or provider-specific lock-in may all be legitimate reasons.

## 7. Lease/currentness vector for secrets and other ephemeral bindings

Secret/currentness should not be represented by one expiry timestamp. Candidate evidence dimensions:

```text
BindingCurrentnessVector
  source identity currentness
  source authorization currentness
  lease validity / renewal horizon
  delivered material generation
  consumer-observed generation
  target acceptance/fencing evidence
  provider/adapter compatibility currentness
  environment/policy floor
```

A binding may therefore be `source lease current + consumer generation stale`, or `consumer using credential + target-side revocation unknown`.

No aggregate green state may hide a hard `UNKNOWN/STALE` dimension.

## 8. Control Center provenance algebra

Control Center should project configuration resolution as an explainable derivation rather than flattening it to one effective value.

Candidate source classes:

```text
product default
application default
Client policy constraint
Workspace preference
Environment binding/default
Application configuration
Service configuration
Placement/provider realization
runtime observation
emergency/operator override
```

These source classes do not imply one universal precedence order. Each setting family declares an admissible resolution law: replace, merge, append, intersect, constrain, deny, minimum/maximum, no-inheritance or domain-specific resolver.

Candidate effective-value proof:

```text
EffectiveConfigClaim
  settingRef
  semanticOwner
  source revisions
  resolution law/profile
  desired result
  observed result
  effective result
  conflicts/unknown inputs
  authority evidence
  currentness horizon
```

`nearest scope wins` and `latest writer wins` are explicitly unsafe as universal rules.

## 9. Declarative deployment model refinement

`ServiceDefinition` remains portable typed intent. `DeploymentIntent` binds that definition to Environment, placement, configuration and binding realizations without becoming provider syntax.

Candidate separation:

```text
ServiceDefinition
  portable service semantics + requirements

DeploymentIntent
  serviceDefinitionRef
  environmentRef
  placementIntentRef
  configurationResolutionRefs
  bindingResolutionRefs
  rollout/lifecycle intent
  required evidence profile

ProviderCompilation
  deploymentIntentRef
  provider/profile/version
  generated artifacts
  opaque-extension declarations
  portability-loss declarations
  compilation evidence
```

Provider compilation is reproducible evidence of translation, not proof that provider execution preserved semantics.

A provider-specific opaque escape hatch remains allowed as research candidate only if it explicitly carries semantic-opacity, validation-loss and replaceability/lock-in qualifiers.

## 10. Observability closes the chain but does not own it

OpenTelemetry-style resource attributes are useful for correlating service, version, instance, host and environment. They should feed `ObservedDeploymentRef` and evidence claims rather than mutate canonical intent.

Candidate correlation requirements:

- stable logical service identity independent of runtime instance;
- explicit environment and deployment attributes;
- instance/host identity where known;
- artifact/version/profile evidence;
- binding generation/lease correlation where safe and non-secret;
- desired deployment revision correlation;
- currentness timestamps and source quality.

`Telemetry says host=X` may prove observed placement within its evidence scope; it does not authorize desired placement mutation.

Desktop Observatory and Pinned Monitoring Surfaces consume these claims. Operations Desktop/Application Manager/Control Center may propose effects through command/authority boundaries. The surfaces remain distinct.

## 11. Application Portfolio Matrix deltas

The integration-mode matrix remains `Native SB / API-backed / Hybrid / Embedded / Proxied / Deep-link / Native bridge`. This round adds two qualification columns across every mode:

1. **Binding transparency** — can SB identify and explain environment/network/storage/secret/external-service dependencies without obtaining raw secret values?
2. **Effect/currentness observability** — can SB distinguish submission/ACK from observed/effective state and detect stale/unknown binding state?

Implications:

| Task/capability | Preferred candidate modes | Binding/authority research implication |
|---|---|---|
| SB proprietary editors | Native SB | full typed bindings; semantic owner remains editor/domain contract |
| Observatory dashboards | Native SB / API-backed / Hybrid | read evidence; no mutation authority implied |
| mature observability suite | API-backed / Hybrid / Deep-link; Embedded only if qualified | telemetry currentness and tenant scope explicit |
| DB/storage admin | Hybrid / Deep-link / Native bridge where local tool is required | high effect authority; credentials remain provider-bound refs |
| container/service admin | API-backed / Hybrid / Deep-link | desired/observed/effective and external manager ownership required |
| secret administration | API-backed / Hybrid / Deep-link | raw values excluded from desktop/session state; lease/revocation semantics first-class |
| external SaaS operations | API-backed / Deep-link / Hybrid | provider identity/currentness/authorization may remain externally authoritative |
| legacy/native workstation tool | Native bridge / Deep-link | bridge registration is not local-process authority by implication |

No mode is globally preferred. Security, compatibility, licensing, authority, currentness, UX, lifecycle, session-restorability, replaceability, lock-in, binding transparency and effect observability jointly qualify the choice.

## 12. Componentization complexity map delta

This research does not create WBS. It identifies reusable foundations that reduce future proprietary-application cost.

### C0/C1 — primitive/atomic

`SemanticRef`, `RevisionRef`, `CurrentnessRef`, `AuthorityEvidenceRef`, `SecretRef`, `EnvironmentRef`, `PlacementRef`, `BindingRequirementRef`, `BindingRealizationRef`, `EffectEvidenceRef`, status/constraint/critical-state primitives.

### C2 — compound

`ProvenanceBadge/Trail`, `BindingDispositionIndicator`, `LeaseCurrentnessIndicator`, `DesiredObservedEffectiveIndicator`, `AuthorityScopeSummary`, `AutoBindingExplanation`, `ResolutionConflictCard`.

### C3 — shared foundations

`ConfigurationResolverBoundary`, `BindingResolverBoundary`, `BindingQualificationBoundary`, `SecretMaterializationBoundary`, `DeploymentIntentCompilerBoundary`, `ProviderCompilationBoundary`, `EvidenceCorrelationBoundary`, `ImpactPreviewBoundary`, plus existing `CommandRegistry`, `WindowRegistry`, `EditorDocumentSession`, `SubscriptionBroker` and session/checkpoint foundations.

### C4 — tools/inspectors

`BindingInspector`, `ConfigurationProvenanceInspector`, `Lease/RotationInspector`, `DeploymentIntentDiff`, `ProviderCompilationDiff`, `EffectReconciliationInspector`, `AutoBindingCandidateInspector`.

### C5 — module/application components

Application Manager, Control Center, Deployment Manager, Operations/Observability apps and proprietary editor-specific binding panels. Domain-specific semantic grammar remains specialized here; shared foundations own mechanics only.

### C6/C7 — workspace/system views

Desktop Spheres, Workspace and Builder Home compose the above but do not acquire their authority. 3D remains optional projection/application.

## 13. Adversarial proof matrix additions

1. **Wrong-environment auto-bind:** same secret/database name exists in staging and production. Name match cannot authorize binding; Client/Environment identity must be explicit.
2. **Lease expires after successful deploy:** provider artifact remains unchanged while credential expires. Effective binding degrades independently from deployment artifact identity.
3. **Secret rotates but consumer does not reload:** source current, delivery current, consumer stale; service must not be shown fully current.
4. **Consumer reloads but old credential still accepted:** target-side fencing remains unknown/partial where exclusivity matters.
5. **Provider detects host different from desired placement:** observed placement drift is evidence, not permission to rewrite desired placement.
6. **Control Center inheritance conflict:** Client policy forbids a value allowed by application default. Configuration syntax compatibility cannot override policy.
7. **Opaque provider field becomes operationally required:** portability loss must become visible; portable ServiceDefinition cannot silently absorb provider-specific semantics.
8. **Adopted external service already has another manager:** auto-binding/configuration cannot activate mutation authority merely because discovery and compatibility succeed.
9. **Provider ACK with missing telemetry:** submission remains acknowledged; effective status is `UNKNOWN/PENDING`, not success.
10. **Telemetry says service healthy under stale deployment revision:** health does not prove current intended revision effective.
11. **External tool deep-link opens correct app but wrong tenant/environment:** context transfer must be qualified; URL navigation is not authorization proof.
12. **SB unavailable after deployment:** generated runtime/service must continue according to locally materialized bindings/credentials and their independent leases; Builder unavailability cannot become a hidden runtime dependency.
13. **Automatic binding rule changes:** existing effective bindings do not silently migrate; rule revision triggers impact/requalification and an explicit desired transition.
14. **Credential provider unavailable during renewal:** current lease may remain valid until its horizon; `provider unavailable != credential immediately invalid`, but expiry cannot be guessed away.
15. **Binding candidate reachable but compatibility evidence stale:** reachability cannot upgrade stale compatibility to verified.

## 14. Proof obligations

PO-1. Every effective service claim can trace to a ServiceDefinition, DeploymentIntent, binding/configuration revisions and material provider/effect evidence without treating provider artifacts as canonical semantic truth.

PO-2. Auto-binding records candidate set, selection rule, selected target, authority/policy qualification, evidence currentness and impact; automation never becomes hidden authority.

PO-3. Secret values do not enter ordinary desktop/session/config/diff/telemetry state; semantic/UI layers carry `SecretRef` and non-secret evidence only.

PO-4. Binding requirement identity survives provider/delivery realization replacement where semantic requirements remain unchanged.

PO-5. A successful binding resolution does not imply delivery or consumer-effective use.

PO-6. Lease expiry/revocation/renewal can lower binding currentness independently of application registration or deployment artifact revision.

PO-7. Configuration resolution is explainable from source revisions and declared resolution law; no universal nearest-scope/latest-writer rule fabricates precedence.

PO-8. Policy constraints remain distinct from configuration sources and cannot be overridden by adapter/provider syntax.

PO-9. Provider compilation records opaque extensions and portability/validation loss; opaque material cannot silently redefine portable service semantics.

PO-10. Provider ACK, resource existence, health/readiness and effective-for-contract remain separately representable.

PO-11. Observed telemetry/resource detection cannot mutate desired placement/environment/service identity or management authority.

PO-12. Binding/telemetry evidence is Client/Workspace/Environment scoped sufficiently to prevent cross-tenant reuse.

PO-13. Automatic rule changes do not mutate existing bindings without a new desired transition and impact/reconciliation path.

PO-14. Runtime autonomy is preserved: the Builder may manage/reconcile when available but is not a mandatory online dependency for published runtime operation; ephemeral leases retain their own explicit availability/currentness consequences.

PO-15. Application Portfolio integration modes expose binding transparency and effect/currentness observability; adapters may normalize shape but not fabricate missing guarantees.

PO-16. External provider/service management authority and SB management authority remain independently qualified during adoption/co-management.

PO-17. Failure/recovery preserves pending/unknown binding effects and does not turn retry/reconnect into a fresh semantic effect by default.

PO-18. Small-screen/text/table equivalents expose the same critical binding, provenance, authority and stale/unknown dispositions without requiring spatial/desktop interaction.

## 15. Contradictions and trade-offs

### Convenience vs explainability

Fully automatic environment/secret/network resolution is attractive, but opaque automation conflicts with auditability, tenant safety and anti-lock-in. Resolution: deterministic/policy-authorized automation may execute automatically, but provenance and decision evidence remain queryable and critical impacts remain previewable when material.

### Runtime autonomy vs short-lived credentials

Short-lived credentials improve security but introduce renewal dependencies. Runtime autonomy cannot mean “no external dependencies”; it means no mandatory Builder dependency. Credential-provider availability and locally retained lease horizon must be modeled honestly.

### Portability vs provider power

A portable semantic definition cannot express every provider feature. Explicit opaque extensions are preferable to either forbidding mature provider features or silently making provider YAML canonical.

### Unified Control Center vs ownership collapse

A single surface is useful for search, provenance, diff and impact. It must remain a federated projection over semantic owners and adapters, not a universal settings database.

### Observability richness vs authority confusion

Automatic resource detection improves diagnosis but observed facts must not become desired-state or management authority by inference.

## 16. Saturation and remaining gaps

- Web Desktop hierarchy / Window identity: high conceptual maturity.
- Application Portfolio integration modes: medium-high; binding/effect qualification strengthened this round.
- Application Manager adoption/management transition: medium-high, still open around destructive transitions and provider-specific authority loss.
- Control Center provenance/inheritance: medium-high; generic precedence is rejected, but domain-specific resolution-law catalog remains open.
- Declarative service deployment: medium-high; typed ServiceDefinition -> DeploymentIntent -> ProviderCompilation chain is now clearer. Provider compilation conformance remains open.
- Vault/environment auto-binding: medium-high conceptually; empirical provider/offline/renewal behavior and consumer reload/fencing profiles remain open.
- Monitoring/telemetry: medium-high conceptually; evidence-correlation completeness and subscription/resource budgets remain open.
- Accessibility/small-screen: medium-high contractually; interaction prototypes/empirical testing remain open.
- Performance/resource budgets: medium-low empirically; no SB traces yet.

Research is not complete.

## 17. Next highest-value vector

The next deep gap should be **provider compilation conformance + binding realization portability under upgrade/migration**:

- prove which ServiceDefinition/DeploymentIntent semantics survive translation to different provider artifacts;
- model provider version/API drift without fabricating compatibility;
- qualify binding migration (Vault delivery mode, database endpoint, storage/network provider) while preserving requirement identity;
- distinguish compilation success from provider semantic equivalence;
- preserve in-flight effects, leases and consumer currentness during binding/provider migration;
- determine when a raw/opaque extension makes migration impossible or requires explicit re-authoring.

This is more valuable than adding another Desktop surface because it determines whether the Web Desktop's anti-lock-in/declarative promise is actually provable.