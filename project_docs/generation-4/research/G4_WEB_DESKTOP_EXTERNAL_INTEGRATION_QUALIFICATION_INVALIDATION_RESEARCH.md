# G4 — Web Desktop External Integration Qualification Invalidation Research

Status: `RESEARCH_ACTIVE / NON_EXECUTABLE`
Execution authority: NONE
Date: 2026-09-23
Scope: G4 Frontend / Web Desktop / external mature applications / operational UX

## Purpose

Refine the remaining version/configuration-drift gap in the Web Desktop external-application research: determine when a previously qualified native/API-backed/hybrid/embedded/proxied/deep-link/native-bridge integration must be requalified after provider, plugin, agent, API, permission-model, configuration or managed-system change.

This is research only. It does not select providers, packages, versions, integration modes, WBS, Work Packages, Sprints or TASKs.

Constitutional alignment:

- `Builder != Runtime`.
- `Previously qualified != indefinitely qualified`.
- `Provider reachable != integration compatible`.
- `API endpoint still responds != semantic contract preserved`.
- `Version unchanged != configuration unchanged`.
- `Patch/minor label != proof of harmless semantic change`.
- `Provider upgrade != permission to reinterpret historical evidence`.
- `Rollback available != rollback semantically safe`.
- `UI still renders != authority/currentness preserved`.
- `Provider ACK != effective state`.

## Evidence reviewed

Primary provider documentation reviewed on 2026-09-23:

- Grafana 13 RBAC behavior changes: https://grafana.com/whats-new/2026-05-05-what-s-new--rbac-behavior-changes-with-grafana-13/
- Grafana breaking changes v10.3: https://grafana.com/docs/grafana/latest/breaking-changes/breaking-changes-v10-3/
- Grafana v12 upgrade guide: https://grafana.com/docs/grafana/latest/upgrade-guide/upgrade-v12.0/
- Grafana data-source management and permissions: https://grafana.com/docs/grafana/latest/administration/data-source-management/
- Grafana plugin compatibility example: https://grafana.com/docs/plugins/grafana-oracle-datasource/latest/install/
- Cockpit package/API compatibility guidance: https://docs.cockpit-project.org/cockpit-guide/362/guide/packages.html
- Portainer lifecycle policy: https://docs.portainer.io/start/lifecycle
- Portainer release notes: https://docs.portainer.io/release-notes
- Portainer Docker/Kubernetes update guidance: https://docs.portainer.io/start/upgrade/docker and https://docs.portainer.io/start/upgrade/kubernetes
- Portainer rollback guidance: https://docs.portainer.io/sts/faqs/upgrading/how-can-i-roll-back-to-a-previous-version-of-portainer

Provider behavior is qualification evidence, never provider-adoption authority.

## 1. Main finding: qualification binds a contract fingerprint, not a product name

The prior external-admin research correctly models authority as a chain. This round adds a lifecycle rule: a qualification is valid only against the provider realization that was actually examined.

Candidate record:

```text
ExternalIntegrationQualification {
  qualificationRef
  providerIdentity
  providerEdition
  providerVersion
  pluginSetFingerprint
  agentSetFingerprint
  managedSystemCompatibilityFingerprint
  apiSurfaceFingerprint
  authnModelFingerprint
  authzModelFingerprint
  resourceScopeModelFingerprint
  elevationModelFingerprint
  sessionModelFingerprint
  embeddingSecurityFingerprint
  configurationFingerprint
  featureFlagFingerprint
  integrationMode
  qualifiedOperations
  qualifiedGuarantees
  knownUnknowns
  evidenceRefs
  qualifiedAt
  invalidationPolicy
  currentnessDisposition
}
```

`Same provider name != same qualified realization`.

A qualification can remain usable across a change only when the affected guarantee vector is shown to remain compatible. A cosmetic UI change need not invalidate an API-only observation path; an RBAC change can invalidate effect admission even when the endpoint shape is unchanged.

## 2. Invalidation dimensions

Provider drift is not one boolean. Candidate dimensions:

```text
API_SHAPE
API_BEHAVIOR
IDENTITY_MODEL
AUTHORIZATION_MODEL
RESOURCE_SCOPE_MODEL
ELEVATION_MODEL
SESSION_LIFECYCLE
EMBEDDING_SECURITY
PLUGIN_COMPATIBILITY
AGENT_COMPATIBILITY
MANAGED_SYSTEM_COMPATIBILITY
DATA_MODEL
CURRENTNESS_SEMANTICS
CONFIGURATION
FEATURE_FLAGS
LICENSING_EDITION
```

Each dimension can be `UNCHANGED | COMPATIBLE_CHANGE | REQUALIFICATION_REQUIRED | INCOMPATIBLE | UNKNOWN`.

This prevents a common failure mode: treating SemVer alone as the compatibility oracle.

`SemVer classification != SB guarantee compatibility proof`.

## 3. Grafana demonstrates permission and API drift independent of UI continuity

Grafana 13 tightened RBAC behavior for custom roles and data-source-scoped permissions. Some role definitions that were previously accepted can fail after upgrade. Earlier Grafana releases also removed legacy data-source permission endpoints and required migration to access-control endpoints.

Therefore:

`Dashboard still opens != prior RBAC realization remains valid`.

`HTTP 200 from Grafana != same permission semantics`.

`Endpoint replacement != transparent contract continuity`.

Grafana also documents plugin/version compatibility constraints and recommends plugin updates after Grafana upgrades because older plugins can stop working correctly. The Oracle datasource documentation provides an explicit version-compatibility table and records breaking driver/configuration changes.

The Web Desktop must therefore qualify at least the tuple:

```text
Grafana core version
+ plugin identity/version
+ datasource type/version
+ RBAC/data-source permission realization
+ provisioning/configuration mode
```

A core upgrade can invalidate plugin qualification; a plugin auto-update can invalidate a previously stable integration even when Grafana core itself did not change.

## 4. Configuration drift can be as material as binary version drift

Grafana's datasource documentation separates permissions from provisioning. A provisioned datasource is read-only in the UI regardless of the user's datasource permission level. A manually created copy pointing at the same backend is an independent resource whose later credential/URL changes do not follow the provisioned source.

Therefore:

`Same backend != same managed resource identity`.

`Same software version != same effect surface`.

`Permission unchanged != configuration authority unchanged`.

Feature flags, provisioning mode, reverse-proxy settings, authentication mode, CSP/frame policy and provider-side role assignments belong in qualification provenance when they affect an SB guarantee.

A useful candidate is a normalized `QualificationRelevantConfigurationFingerprint`: not a dump of every provider setting, but a digest over settings known to affect the qualified operations and guarantees.

## 5. Cockpit demonstrates documented/public API versus internal behavior

Cockpit package documentation states that APIs or behavior not explicitly documented are internal and may change at any time. Packages can also declare a required Cockpit version in their manifest.

This yields a strong integration rule:

`Observed browser behavior != supported integration contract`.

An SB integration that relies on undocumented DOM structure, internal JavaScript objects or accidental URLs has a weaker qualification than one using documented interfaces. Such a dependency should be marked `FRAGILE_INTERNAL_DEPENDENCY` and requalified on every provider update unless stronger evidence exists.

CSP overrides in package manifests reinforce the same boundary: security policy is part of the realization fingerprint when embedding is involved.

## 6. Portainer demonstrates provider/agent/managed-system compatibility as a tuple

Portainer's current update guidance requires Server and Agent versions to match. Its release history also contains removed/deprecated API endpoints and examples where a Docker Engine change broke older Portainer versions.

Therefore:

`Portainer Server compatible != Portainer Agent compatible != Docker/Kubernetes target compatible`.

Candidate compatibility tuple:

```text
Portainer server version
× agent/edge-agent version
× managed platform kind/version
× API endpoint contract
× edition/license capabilities
× access-control realization
```

The known Docker Engine 29 compatibility incident is especially useful adversarial evidence: an external managed system can invalidate the integration without the external admin application itself changing.

This generalizes to database consoles, storage consoles and infrastructure managers.

## 7. Change detection versus semantic invalidation

A change signal is not itself proof of incompatibility.

Candidate pipeline:

```text
CHANGE_OBSERVED
  -> CHANGE_CLASSIFIED
  -> AFFECTED_QUALIFICATION_DIMENSIONS
  -> GUARANTEE_IMPACT_ANALYSIS
  -> REQUALIFICATION_REQUIRED | COMPATIBLE_WITH_EVIDENCE | INCOMPATIBLE | UNKNOWN
  -> UI/operation disposition
```

Possible change signals include:

- provider version/API discovery change;
- plugin/agent version change;
- managed-system version change;
- feature-flag/configuration fingerprint change;
- authn/authz/elevation behavior change;
- license/edition change;
- endpoint deprecation/removal;
- CSP/frame/origin policy change;
- repeated contract-shaped errors after an upgrade;
- explicit provider release-note breaking change.

`Change detected != integration broken`.

But also:

`No explicit breaking-change notice != integration proven compatible`.

## 8. Candidate currentness state machine

```text
QUALIFIED_CURRENT
  -> CHANGE_SUSPECTED
  -> REQUALIFICATION_PENDING
  -> QUALIFIED_COMPATIBLE
     | QUALIFIED_WITH_RESTRICTIONS
     | INCOMPATIBLE
     | UNKNOWN
```

Effect-capable operations should fail closed or degrade to observation when their authority/contract dimension becomes `REQUALIFICATION_PENDING` or `UNKNOWN` and the affected guarantee is safety-sensitive.

Observation may remain available when its own contract is independently qualified, but the UI must expose the weaker disposition.

`Effect path invalidated != every observation path invalidated`.

`Observation path current != effect path current`.

## 9. Historical evidence and upgrade boundaries

Provider upgrades must not rewrite the interpretation of evidence captured under an older qualification.

Historical records should bind:

```text
provider realization fingerprint
integration qualification ref
operation/query identity
principal/authority realization
observation/effect timestamps
result/evidence refs
```

A new provider version can supersede the active qualification without mutating old evidence into the new semantics.

`Latest qualification != historical qualification`.

This matters for incidents and conformance: a historical Grafana query, Portainer effect or Cockpit observation remains attributable to the contract realization under which it occurred.

## 10. Rollback is multidimensional

Portainer documents that newer releases generally bump the database schema and that a newer database cannot simply be used with an older Portainer version; rollback requires the matching backup. Grafana upgrade documentation likewise includes migrations and breaking changes that may not be transparently reversible.

Therefore:

`Binary rollback available != state rollback safe`.

Candidate rollback dimensions:

```text
BINARY
DATABASE_SCHEMA
PLUGIN_SET
AGENT_SET
CONFIGURATION
AUTHORIZATION_MODEL
EXTERNAL_EFFECTS
HISTORICAL_EVIDENCE
```

An upgrade that already issued external effects cannot be made semantically nonexistent by rolling the admin console back.

## 11. Operational UX / Desktop Observatory implications

External-integration qualification becomes visible operational context, not a hidden developer concern.

Candidate states for an integration surface:

```text
CURRENT
CHANGE_SUSPECTED
REQUALIFYING
RESTRICTED
INCOMPATIBLE
UNKNOWN
```

Rules:

- a monitoring widget may continue to show last evidence while marking the provider path `REQUALIFYING`; it must not display cached green as current;
- `No alert != healthy` remains unchanged when the alert provider itself is version-incompatible;
- an incident/control card must distinguish `provider unreachable`, `provider contract incompatible`, `authorization requalification required` and `remote service unhealthy`;
- a provider upgrade must not turn local client-health degradation into remote-service degradation;
- currentness/evidence badges remain independent from integration-qualification badges.

This preserves `Running != Healthy != Ready != Effective` and adds `Compatible != Healthy` as another independent dimension.

## 12. Extended Desktop implications

`WindowRegistry` stores semantic Window identity, not a frozen promise that its external integration remains valid.

- moving a Window to another display does not reset qualification;
- a surface restored after sleep/freeze/discard must re-read the current integration qualification before enabling effects;
- a secondary surface holding a pre-upgrade UI cannot remain effect-authoritative after the Workspace has observed an invalidating provider change;
- independent zoom/layout remains presentation-local;
- provider-change notices are Workspace-semantic and may be projected on every affected surface without stealing focus.

`Presentation epoch current != integration qualification current` remains mandatory.

## 13. Performance/resource lifecycle implications

Requalification must not become a polling storm.

Candidate pattern:

```text
shared provider/version/config discovery
  -> bounded change events/checks
  -> qualification dependency graph
  -> invalidate only affected guarantees
  -> fan out disposition to consumers
```

Every widget must not independently poll `/version`, plugin inventories and permission endpoints.

`Shared qualification discovery != shared user authority`.

Version/config discovery can often be shared more broadly than data queries, but any discovery response that reveals sensitive topology, edition or resource membership remains disclosure-qualified.

Background/hibernated Windows do not need full re-rendering when qualification changes; their registry entry can become stale/restricted and rehydrate on demand.

## 14. External-app matrix delta

| Integration mode | Drift sensitivity | Requalification emphasis |
|---|---|---|
| Native SB surface | API/authz/data-model drift | operation contract + authority realization |
| API-backed | endpoint/schema/behavior/authz drift | API and guarantee compatibility |
| Hybrid | all API risks plus original-UI session drift | explicit boundary on both paths |
| Embedded | CSP/frame/session/DOM/UI drift | security + session + opaque-state qualification |
| Reverse proxy | origin/cookie/CSRF/WebSocket/path drift | end-to-end transport/security assumptions |
| Deep link | route/tenant/environment/revision identity drift | locator semantics + reauthorization |
| Native bridge | host API/privilege/ABI drift | strongest requalification and effect containment |

No mode is permanently safe by category.

## 15. Accessibility

Qualification drift must not silently remove the accessible path.

Requirements:

- `REQUALIFYING`, `RESTRICTED`, `INCOMPATIBLE` and `UNKNOWN` have textual/non-color semantics;
- effect controls disabled by requalification expose the reason and safe recovery path;
- provider-change notices do not steal focus or create live-region storms;
- fallback list/table/text views consume the same current qualification as visual widgets;
- an embedded UI becoming incompatible cannot leave an inaccessible dead frame as the only explanation;
- historical evidence remains navigable even when the live provider path is incompatible.

## 16. Componentes impact

Candidate additions/refinements:

- `ExternalQualificationCurrentnessBadge`
- `ProviderRealizationFingerprintInspector`
- `ProviderChangeNotice`
- `RequalificationBoundary`
- `QualifiedOperationMatrix`
- `CompatibilityRestrictionBanner`
- `ManagedSystemCompatibilityBadge`
- `PluginAgentCompatibilityPanel`
- `HistoricalQualificationReference`
- `ExternalRollbackDispositionPanel`

State-lab scenarios must cover provider core upgrade, plugin-only upgrade, agent mismatch, managed-system upgrade, feature-flag change, permission-model change, CSP change, endpoint removal, compatible change, UNKNOWN drift and rollback with irreversible external effects.

## 17. Proof obligations

Future executable qualification should prove at minimum:

1. a provider version change invalidates only qualifications whose dependency set includes that version/behavior;
2. unchanged provider version with authz/config drift still triggers requalification when material;
3. Grafana RBAC behavior change cannot leave old effect permissions represented as current;
4. removed Grafana permission endpoints cannot be treated as transient provider unreachability;
5. plugin upgrade can independently invalidate datasource qualification;
6. plugin/core incompatibility is distinguishable from backend datasource failure;
7. Cockpit undocumented/internal dependencies are marked fragile and cannot claim stable compatibility;
8. Cockpit CSP/security-policy change requalifies embedding independently of API observation;
9. Portainer Server/Agent mismatch is distinguishable from managed workload failure;
10. Docker/Kubernetes target upgrade can invalidate Portainer integration without Portainer changing;
11. provider release-note absence does not automatically preserve qualification;
12. compatible change can retain unaffected guarantees with evidence rather than forcing universal outage;
13. effect admission fails safely while affected qualification is `UNKNOWN`;
14. independently qualified observation can remain available when effect qualification is invalidated;
15. cached monitoring evidence does not become current merely because provider UI still renders;
16. every affected Window receives semantic requalification without each Window polling independently;
17. freeze/discard recovery re-reads current qualification before enabling effects;
18. historical evidence remains bound to its historical provider/qualification fingerprint;
19. rollback does not erase external effects already produced;
20. database/schema rollback requirements are not collapsed into binary rollback;
21. accessibility fallback observes the same qualification state as visual controls;
22. deep-link route changes preserve or explicitly fail tenant/environment/revision context;
23. reverse-proxy WebSocket/origin/auth behavior is requalified after relevant provider change;
24. licensing/edition change cannot silently expose or remove effect authority;
25. qualification discovery is bounded/shared without leaking user/resource authority.

## 18. Maturity / saturation

`EXTERNAL_INTEGRATION_QUALIFICATION_INVALIDATION = PARTIALLY_MATURE / MATERIAL_DELTA`.

This closes the largest remaining conceptual gap in external-app lifecycle research: prior qualification now has an explicit provenance and invalidation model rather than an implicit assumption of provider stability.

The broader :40 operational UX / observability / Extended Desktop / external-app / performance corpus is now close to conceptual saturation. Remaining high-value gaps are narrower:

1. server-side ownership of monitoring when no interactive Web Desktop consumer exists;
2. cost attribution/fairness for shared telemetry acquisitions across Workspaces/users;
3. executable NORMAL/STRESS/leakage/revocation measurements;
4. provider-specific qualification fixtures rather than additional generic taxonomies.

Further documentary rounds should prefer these remaining boundaries or record `NO_MATERIAL_DELTA`.