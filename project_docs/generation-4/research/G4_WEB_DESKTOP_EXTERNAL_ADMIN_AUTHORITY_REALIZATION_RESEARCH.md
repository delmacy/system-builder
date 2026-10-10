# G4 — Web Desktop External Admin Authority Realization Research

Status: `RESEARCH_ACTIVE / NON_EXECUTABLE`
Execution authority: NONE
Date: 2026-09-23
Scope: G4 Frontend / Web Desktop / external mature applications / operational UX

## Purpose

Refine the remaining provider-realization gap from `G4_WEB_DESKTOP_TELEMETRY_AUTHORIZATION_REALIZATION_LEAKAGE_QUALIFICATION.md` for mature operational/admin applications, especially n8n, Cockpit/NetworkManager and database/admin consoles.

This is research only. It does not select providers, integration mode, packages, APIs, WBS, Work Packages, Sprints or TASKs.

Constitutional alignment:

- `Builder != Runtime`.
- `External UI != SB authority`.
- `Authenticated to provider != authorized for every provider effect`.
- `Provider session != SB session`.
- `Visible resource != authorized mutation`.
- `Administrative access available != administrative access currently active`.
- `Same host != same authority boundary`.
- `External app healthy != managed resource healthy`.
- `External app current != SB evidence current`.
- `Original advanced UI remains an independent authority surface unless equivalence is proven`.

## Evidence reviewed

Primary/mature documentation reviewed on 2026-09-23:

- n8n workflow sharing, project membership and credential behavior: https://docs.n8n.io/workflows/sharing/
- n8n security audit and owner-only audit API: https://docs.n8n.io/hosting/securing/security-audit/
- n8n environments/source-control role distinctions: https://docs.n8n.io/source-control-environments/create-environments/
- Cockpit privileges and permissions: https://docs.cockpit-project.org/cockpit-guide/main/guide/privileges.html
- Cockpit SSO: https://docs.cockpit-project.org/cockpit-guide/365/guide/sso.html
- Cockpit NetworkManager integration: https://cockpit-project.org/guide/195/feature-networkmanager.html
- Cockpit multi-host warning/deprecation context: https://docs.cockpit-project.org/cockpit-guide/361/guide/multi-host.html
- Cockpit object caching: https://cockpit-project.org/guide/latest/cockpit-cache
- NetworkManager current API/manual and Polkit examples: https://networkmanager.dev/docs/api/latest/ and https://networkmanager.dev/docs/api/latest/nmcli-examples.html
- pgAdmin user management/authentication/server connection documentation: https://www.pgadmin.org/docs/pgadmin4/9.17/user_management.html, https://www.pgadmin.org/docs/pgadmin4/9.17/oauth2.html, https://www.pgadmin.org/docs/pgadmin4/development/server_dialog.html

Provider behavior is evidence for integration qualification, not provider adoption authority.

## 1. New finding: authority is a chain, not an application property

The prior provider vector is necessary but external admin tools require an explicit authority chain:

```text
SB Principal
  -> SB Application/Window admission
  -> Integration identity mapping
  -> External application session/API principal
  -> External application resource/project/environment policy
  -> Downstream host/service/database identity
  -> Privilege elevation / assumed role when applicable
  -> Requested observation or effect
  -> Provider ACK
  -> Observed/effective state
```

Every arrow is separately qualified.

`Can open external application != can perform its actions`.

`Can perform provider action != SB has authority to request that action`.

`Provider ACK != effective state` remains mandatory.

This makes a generic `ExternalAppPermission = allowed` inadequate.

Candidate record:

```text
ExternalAdminAuthorityRealization {
  providerRef
  providerVersionOrContractRevision
  integrationMode
  sbPrincipalRef
  externalPrincipalRealization
  resourceScopeRealization
  downstreamPrincipalRealization
  elevationModel
  observationAuthority
  effectAuthority
  credentialExposureDisposition
  sessionCurrentnessModel
  authorizationCurrentnessModel
  recoveryModel
  versionDriftRisk
  evidenceRefs
}
```

## 2. n8n: project/workflow/credential authority is not one dimension

n8n provides a useful counterexample to naive UI-derived authority.

Current documentation shows:

- workflow visibility/access can arise through ownership, direct sharing or project membership;
- instance owners/admins can have broader visibility than ordinary users;
- workflow editors may run a workflow even when credentials used by that workflow were not explicitly shared with them;
- unshared credentials restrict editing of nodes that use them, but execution may still use those credentials;
- environment/source-control operations distinguish instance owner/admin from project admin;
- the security-audit API requires instance-owner authority.

Therefore:

`Workflow visible != credential visible != credential usable-by-execution != credential editable != instance-admin authority`.

For SB, n8n integration should qualify at least:

```text
workflow read
workflow edit
workflow execute
execution read
credential metadata read
credential secret access
project administration
instance administration
source-control/environment effect
```

A native SB surface that shows workflow status must not inherit workflow-run or credential authority merely because the same external session could perform it.

An original n8n UI opened from SB remains an explicit external authority boundary. If it is more privileged than the SB role, the UI must not be represented as though SB authorization approved every available action.

## 3. Cockpit/NetworkManager: session identity and privilege elevation are dynamic

Cockpit is especially informative because its documentation states that a logged-in user starts with essentially the privileges they would have through SSH/console, while administrative access may be gained through sudo/Polkit-compatible mechanisms. Current Cockpit also exposes an administrative-access state.

NetworkManager uses D-Bus and Polkit authorization for non-root operations; `nmcli` can expose configured permissions and can act as a Polkit agent.

Therefore:

`Cockpit authenticated != root`.

`User can elevate != session currently elevated`.

`Session currently elevated != SB may silently exercise elevated effects`.

`NetworkManager object visible != network-control effect authorized`.

Candidate state vector:

```text
ExternalPrivilegeState =
  BASE_USER |
  ELEVATION_AVAILABLE |
  ELEVATION_CHALLENGE_REQUIRED |
  ELEVATED_CURRENT |
  ELEVATION_EXPIRED |
  ELEVATION_DENIED |
  UNKNOWN
```

SB should preserve this distinction in native/API-backed/hybrid integrations. A native network-health widget can observe through a bounded read path while a connection mutation may require a separate user-presence/elevation ceremony.

### Security consequence for embedding/proxying

Cockpit's historical/current multi-host documentation warns that code from multiple hosts in one browser context may not be isolated and recommends trusting connected hosts; the multi-host feature is deprecated. This reinforces a broader SB rule:

`Same desktop visual container != same trust domain`.

Do not weaken CSP/same-origin boundaries merely to make a mature admin UI look native. If trustworthy embedding cannot be proven, prefer deep-link/reopen, API-backed native common path, or another qualified boundary.

## 4. Database consoles: console identity and database role are separate

pgAdmin demonstrates another two-layer authority model:

1. pgAdmin server-mode identity/role controls access to pgAdmin itself and associated server definitions;
2. each database connection uses a PostgreSQL identity and may optionally assume another role when membership permits.

It supports multiple authentication sources for the pgAdmin layer, while the database connection has its own username/password/Kerberos/role semantics.

Therefore:

`Authenticated to pgAdmin != authenticated to PostgreSQL as same principal`.

`pgAdmin Administrator != PostgreSQL superuser`.

`Shared server definition != shared database authority`.

`Saved connection != current credential validity`.

This pattern generalizes to storage/database consoles: the external application's user model and the managed system's authority model must remain separate fields in qualification.

## 5. Integration-mode matrix delta

| Mode | Authority benefit | Primary risk | Candidate disposition |
|---|---|---|---|
| Native SB surface | SB can expose only qualified common-path actions | accidental service-credential broadening | preferred when API authority can be bounded |
| API-backed | explicit contracts, observable requests/results | API principal may be broader than UI user | preferred with per-action qualification |
| Hybrid | native common path + advanced original UI | authority discontinuity between surfaces | good if boundary is visible and requalified |
| Embedded iframe | original UI fidelity | session/CSP/frame/auth mismatch; hidden privilege escalation | conditional only |
| Reverse proxy | can unify routing/auth edge | cookies, origin, CSRF, WebSockets, absolute URLs, version drift, privilege confusion | high qualification cost |
| Deep link | preserves provider security boundary | tenant/environment/revision context can be lost | strong fallback when link context is qualified |
| Native bridge | can reach host-native APIs | strongest local privilege/effect adjacency | exceptional/high-assurance path |

No mode automatically preserves SB authority. `Hybrid` is often preferable for mature tools: SB owns a bounded common operational path; the original UI remains available for advanced work under its own clearly marked authority/session boundary.

## 6. External-session currentness

A mature app can remain visually rendered after its auth/elevation/session state is no longer valid.

Candidate independent states:

```text
ExternalSessionCurrentness =
  CURRENT |
  EXPIRING |
  REAUTH_REQUIRED |
  PRIVILEGE_REQUALIFICATION_REQUIRED |
  PROVIDER_UNREACHABLE |
  VERSION_INCOMPATIBLE |
  UNKNOWN
```

The SB Window must not leave an old embedded/API-backed screen looking authoritative when the provider session expires.

`Rendered external UI != current external authority`.

For API-backed surfaces, authorization failure should invalidate effect admission and requalify observation. For embeds, where SB cannot reliably inspect internal session state, the integration disposition must remain weaker and recovery may require reopening/re-authenticating the original UI.

## 7. Desired / observed / effective integration semantics

External tools must not collapse operational state:

```text
SB desired action
  != provider request submitted
  != provider request accepted
  != downstream effect observed
  != service ready
  != service healthy
  != intended operational outcome effective
```

Examples:

- n8n workflow activation accepted does not prove every downstream credential/integration is healthy;
- NetworkManager accepts a connection change but connectivity/effective routing still requires observation;
- database role/session establishment does not prove a migration/query effect succeeded;
- Cockpit service restart acknowledgement does not prove the service became ready/effective.

This preserves `Running != Healthy != Ready != Effective` across external applications.

## 8. Multi-display and WindowRegistry implications

External authority is attached to the semantic Window/application context, not to a physical display.

Required invariants:

- `Move to display != transfer provider authentication proof`.
- `Presentation epoch current != external session current`.
- target surface requalifies external session before effect-capable controls become active;
- if an embedded tool cannot checkpoint dirty state, transfer is `REOPEN_ONLY`, `USER_CONFIRM_REQUIRED` or `TRANSFER_UNSUPPORTED` rather than pretending seamless migration;
- secondary-display loss preserves SB recovery metadata but cannot promise preservation of opaque provider-local unsaved state;
- independent local zoom/layout does not change tenant/environment/resource identity.

## 9. Performance/resource lifecycle delta

External applications create a resource-control asymmetry: SB can suspend its own React view but may not control an embedded application's timers, sockets, workers or caches.

Candidate resource qualification:

```text
ExternalResourceControllability =
  FULLY_BOUNDED_API |
  NATIVE_SB_RENDER_ONLY |
  EMBED_VISIBILITY_ONLY |
  PROVIDER_CONTROLLED |
  UNKNOWN
```

Consequences:

- `SB Window hidden != external app suspended`;
- `iframe hidden != WebSocket/polling stopped`;
- opaque embeds do not count as `HIBERNATED` without evidence;
- under memory pressure, prefer destroying/reopening a qualified external UI when dirty-state semantics permit, rather than retaining an unbounded invisible iframe;
- API-backed/native views can participate in shared subscription/polling budgets; original UIs remain separately metered where observable.

NORMAL/STRESS fixtures should include multiple external tools, at least one reconnecting WebSocket/poller, provider auth expiry, hidden secondary surface and one opaque embed that refuses bounded suspension.

## 10. Accessibility

An original advanced UI must not become the only accessible route for an essential SB common-path operation unless its accessibility is itself qualified.

Requirements:

- authority/elevation/session state has textual, non-color semantics;
- native common-path actions remain keyboard reachable;
- privilege challenge/re-auth is explicit and focus-safe;
- an inaccessible or opaque embed has a deep-link/original-UI escape plus a native textual status equivalent where feasible;
- multi-display transfer/recovery does not depend on pointer drag;
- `REAUTH_REQUIRED`, `ELEVATION_REQUIRED`, `UNKNOWN` and `EFFECT_UNVERIFIED` are announced without live-region storms.

## 11. Componentes impact

Candidate catalog/state-lab additions:

- `ExternalAuthorityBoundary`
- `ExternalPrincipalIndicator`
- `ExternalPrivilegeStateBadge`
- `ExternalSessionCurrentnessBoundary`
- `ExternalEffectQualificationPanel`
- `ProviderReauthAction`
- `ProviderElevationAction`
- `ExternalResourceControllabilityBadge`
- `HybridIntegrationBoundary`
- `OriginalAdvancedUIAction`
- `ExternalTransferDispositionBadge`
- `ExternalEffectVerificationBoundary`

State matrices must include base/elevated/expired/denied/unknown authority, provider unreachable, version incompatible, move-to-display, hidden/background, dirty/reopen-only and effect accepted-but-unverified.

## 12. Proof obligations

At minimum, future executable qualification must prove:

1. n8n workflow read does not silently grant workflow edit/run.
2. n8n workflow run with an unshared credential does not expose the credential secret through SB.
3. project membership changes requalify native/API-backed surfaces.
4. n8n instance-owner-only operations cannot be inferred from ordinary workflow visibility.
5. Cockpit base-user session is distinguishable from elevated administrative access.
6. expired/dropped Cockpit elevation disables effect admission without hiding already observed evidence.
7. NetworkManager read access does not imply `network-control` effect authority.
8. a Polkit challenge is not bypassed by a cached SB session.
9. provider auth expiry cannot leave stale effect controls looking current.
10. pgAdmin application role does not imply PostgreSQL role/superuser equivalence.
11. shared pgAdmin server definitions do not leak saved credentials or imply database authority.
12. reverse proxy preserves origin/CSRF/WebSocket/auth assumptions or is disqualified.
13. CSP/frame restrictions are not weakened solely to preserve iframe integration.
14. deep links preserve Client/Workspace/tenant/environment/resource context without embedding bearer authority.
15. display transfer does not broaden provider authority.
16. opaque embed with unknown dirty state cannot claim seamless transfer/hibernation.
17. hidden external UI cannot consume unbounded background resources without diagnostic visibility.
18. provider ACK remains distinct from observed/effective state.
19. accessible fallback consumes the same authority-qualified state as the visual surface.
20. provider upgrade/version drift forces requalification when identity/permission/elevation semantics change.

## 13. Maturity / saturation

`EXTERNAL_ADMIN_AUTHORITY_REALIZATION = PARTIALLY_MATURE / MATERIAL_DELTA`.

This closes most of the previously explicit n8n/Cockpit/NetworkManager/database-console qualification gap at the conceptual level. It does not prove exact versions/configurations and intentionally leaves numeric revocation/performance budgets to executable fixtures.

Remaining high-value gaps for the :40 program:

1. provider-contract/version-drift invalidation and provenance: what exact evidence invalidates a prior integration qualification after upgrade/config change;
2. server-side ownership of monitoring when no interactive Web Desktop consumer exists;
3. cost attribution/fairness for shared telemetry acquisitions across Workspaces/users;
4. executable NORMAL/STRESS/leakage fixtures and measured revocation budgets;
5. storage/admin provider realization beyond the Cockpit/udisks pattern where materially different.

The operational UX / observability / Extended Desktop / external-app / resource-lifecycle corpus is now conceptually close to saturation. Further rounds should prefer narrow unresolved proof boundaries or `NO_MATERIAL_DELTA` rather than creating parallel taxonomies.