# G4 — Web Desktop Application Portfolio & Integration Qualification

Status: `RESEARCH_ACTIVE / NON_EXECUTABLE`
Execution authority: NONE
Date: 2026-09-22
Scope: G4 Web Desktop & Application Environment — application portfolio, integration boundaries and reusable foundations

## 1. Purpose

This artifact deepens one remaining cross-cutting gap in the Web Desktop research: how System Builder should decide, per application/task, between native SB implementation, API-backed native UX, hybrid UX, embedded external UI, reverse-proxied UI, deep-link integration and a privileged native bridge without turning one integration technique into a universal architecture.

It preserves the candidate hierarchy:

`Builder Home/Factory -> Client -> Workspace -> Desktop Sphere -> Application -> Window -> View/Tab/Tool`.

It does not select providers, authorize implementation, materialize WBS/Work Packages/Sprints/TASKs, or make external products canonical SB authorities.

## 2. Repository evidence consumed and deduplicated

This round reconciles:

- `AGENTS.md`: Builder/runtime separation, compatibility before replacement, replaceable suite modules and explicit contracts;
- `docs/architecture/MASTER_BLUEPRINT.md`: replaceable suite, autonomous runtime, provider-compatible Observe and `Release + Environment = Deployment`;
- `G4_RESEARCH_STATE.md`: OS-like shell remains an interaction model, not an OS kernel; UI/window/deployment/runtime lifecycles remain separate;
- `G4_WEB_DESKTOP_WINDOW_LIFECYCLE_RESEARCH.md`: orthogonal window/resource/content/authority/recovery state axes and command-context separation;
- `G4_PROPRIETARY_EDITOR_SHARED_FOUNDATION_RESEARCH.md`: SharedEditorFoundation owns mechanics, specialized editors retain domain semantics, typed/versioned bindings bridge Workflow/View/Form/Component/Command;
- `G4_WEB_DESKTOP_OPERATIONAL_OBSERVABILITY_MULTIDISPLAY_EXTERNAL_APPS_RESEARCH.md`: Extended Desktop, evidence/currentness envelopes, external-app modes, resource-residency axes and browser coordination as transport rather than authority;
- `G4_WEB_DESKTOP_CROSS_CUTTING_CONFORMANCE_RESEARCH.md`: Application Manager lifecycle, ManagementAuthorityVector, Control Center provenance/inheritance, typed ServiceDefinition, placement, SecretRef boundary and desired/observed/effective conformance.

Deduplicated conclusions are not restated as new findings: `Install != Adopt`, `Register != Deploy`, `Discovered != Verified`, `SecretRef != secret value`, `ProviderArtifact != semantic definition`, `ApplicationWindow != runtime`, `SSO success != authorization equivalence`, and `iframe/proxy/API connectivity != semantic integration` remain governing premises.

## 3. Additional external evidence

Primary-source evidence reviewed in this round:

1. MDN same-origin policy: cross-origin documents are intentionally isolated; embedding does not grant parent/child semantic or storage equivalence. https://developer.mozilla.org/en-US/docs/Web/Security/Defenses/Same-origin_policy
2. MDN CSP `frame-ancestors`: the embedded application controls which ancestors may frame it; an SB desire to embed cannot override the application's security policy. https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Content-Security-Policy/frame-ancestors
3. MDN iframe and Storage Access API: third-party storage/cookie behavior is browser/security-policy dependent; credentialless iframe is not Baseline and uses an ephemeral context, while Storage Access is explicitly permission/state sensitive. https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/iframe and https://developer.mozilla.org/en-US/docs/Web/API/Storage_Access_API/Using
4. Grafana dashboard sharing: authenticated embedding depends on product/deployment mode; panel embedding and anonymous access are not available in Grafana Cloud, while OSS/Enterprise have different options. https://grafana.com/docs/grafana/latest/visualizations/dashboards/share-dashboards-panels/
5. Existing sibling research already reviewed n8n API authentication/Embed and Portainer API access. Their separate API and embedding surfaces reinforce that API integration, embedding and commercial entitlement are independent qualification axes.

These sources are pattern evidence, not provider-selection decisions.

## 4. Material finding — integration mode is a qualified per-task decision

An `Application` must not receive one immutable global label such as `EMBEDDED` or `API_BACKED` when different tasks need different boundaries.

Candidate:

```text
ApplicationIntegrationProfile
  applicationIdentity
  taskClass
  mode
  semanticOwner
  authorityBoundary
  credentialBoundary
  currentnessModel
  compatibilityProfile
  lifecycleOwner
  licensingEntitlement
  disclosureScope
  failureFallback
  replaceabilityClass
  evidenceRefs[]
```

Therefore:

`Application integration mode != application identity`

`one application != one integration mode`

A monitoring product may be API-backed for Observatory summaries, deep-linked for advanced administration and optionally embedded for a qualified read-only dashboard. These are separate task profiles, not contradictory architecture.

## 5. Application Portfolio Matrix

Legend: N = Native SB; A = API-backed native; H = Hybrid native common path + external advanced path; E = Embedded; P = Proxied external UI; D = Deep-link; B = Native bridge/agent. Entries are candidate preferences, not implementation decisions.

| Task/capability | Preferred candidates | Why / qualification |
|---|---|---|
| Builder Home / Client / Workspace navigation | N | Core identity, tenant context, authority and recovery cannot depend on an external UI. |
| Desktop Sphere / Window Manager / taskbar / session restore | N | Shell state, focus, WindowRef, recovery and multi-display continuity are SB interaction contracts. |
| Control Center common configuration | N/A/H | Native provenance/inheritance/change-plan UX; typed provider APIs underneath; advanced provider-specific settings may escape to original UI. |
| Application Manager / catalog / adopt / verify | N/A/H | SB owns registration/adoption evidence and management-authority projection; provider APIs perform qualified operations. |
| Service deployment / placement common path | N/A/H | ServiceDefinition remains semantic intent; provider APIs/adapters compile/apply; original provider UI may remain advanced escape hatch. |
| Secrets/Vault binding | N/A/H | SB should manipulate SecretRefs/binding metadata, never require embedding a secret console; advanced provider administration can deep-link. |
| Desktop Observatory | N/A | SB owns evidence/currentness envelope and cross-app composition; telemetry source may be external. |
| Pinned Monitoring Surface / Monitor Wall | N/A/H/E/D | Native composition is strongest for cross-source currentness; qualified external dashboards may embed/deep-link when security/licensing allow. |
| Operations / observability deep diagnosis | H/A/D/E | Common triage can be native/API-backed; mature specialist UI often remains valuable for deep investigation. |
| Workflow Designer | N | Proprietary semantic editor; external engines may be providers, not editor semantic authority by default. |
| View/Page Builder | N | SB composition/binding semantics are product-specific. |
| Form Builder | N | Form/component/binding/revision semantics are SB-owned even if runtime rendering reuses standards/libraries. |
| Component Editor / Componentes state lab | N | Product-specific state/evidence inventory and reusable design-system contract. |
| Rules/Decision Editor | N/H | SB semantic wrapper and binding/evidence required; specialized external rule engine/editor may be a qualified provider if semantics map. |
| System/Module Designer | N | Cross-artifact semantic integration is SB-specific. |
| Elicitation/Requirements | N/H | SB traceability is native; external document/issue systems may integrate by API/deep-link. |
| Preview/Sandbox | N/H | SB must declare equivalence/substitution scope; external provider preview may be incorporated as evidence, not silently trusted. |
| Revision/Diff / impact analysis | N | Semantic diff across SB artifacts is product-specific. |
| Database administration | A/H/D/E | Prefer typed common operations and status; retain mature DB UI for advanced work. Embedding only if qualified. |
| Object/file storage administration | A/H/D | Common inventory/health may be native; specialist lifecycle/admin remains replaceable external tooling. |
| Container/host administration | A/H/D/E/P | API-backed common path + original UI is preferable; proxy is exceptional due to origin/session/WebSocket/CSP maintenance. |
| Log exploration | A/H/D/E | Native contextual slices + mature external exploration; large-volume specialist UX need not be rebuilt. |
| Metrics/dashboard authoring | H/D/E/A | SB should not rebuild mature visualization suites without a product-specific semantic need. |
| Local OS/device integration | B/N | Native bridge only for capabilities impossible/sufficiently poor through web APIs; strongest trust/update/OS-scope burden. |
| Legacy intranet app with no API | D/E/P/B | Start with deep-link; embed/proxy only after security/session compatibility proof; bridge only for unavoidable local/legacy protocol access. |

## 6. Mode qualification matrix

| Mode | Security boundary | Compatibility/currentness | Licensing | UX | Lifecycle | Replaceability / lock-in |
|---|---|---|---|---|---|---|
| Native SB | SB auth/authority is directly enforceable | Highest semantic observability; SB owns projection currentness | SB-owned | Best shell consistency/a11y | SB-owned | Highest code ownership; risk of rebuilding mature tools |
| API-backed native | Credential/token scopes and provider authorization remain distinct | API/profile/version mapping must be qualified; SB can expose evidence age | API/product terms apply | Strong common-path consistency | Provider service + SB adapter evolve independently | Good when adapter contract is provider-neutral |
| Hybrid | Two authority/currentness surfaces must be explicit | Native and external views may observe different revisions/times | Both API and UI entitlements matter | Strong common path + expert escape hatch | Requires context handoff/version compatibility | Often best anti-lock-in compromise |
| Embedded | External origin/session remains authoritative for its UI | Parent cannot assume child state/currentness; frame policy may change | Embedding entitlement may differ from product access | Low navigation friction but focus/a11y/context risks | External UI upgrades can break host assumptions | Medium/high coupling to external UI behavior |
| Proxied UI | Proxy becomes sensitive origin/session/security boundary | Highest drift risk: redirects, cookies, CSRF, WebSockets/SSE, absolute URLs, CSP | Redistribution/proxy terms must be checked | Can appear integrated but is brittle | SB inherits external UI upgrade burden | High accidental lock-in/maintenance |
| Deep-link | Strong separation; external app enforces its own session | Context must be encoded/requalified; return path needed | Usually simplest | Context switch cost, but original UX preserved | Lowest host coupling | High replaceability; robust default escape hatch |
| Native bridge | Local privileged agent boundary | OS/device/API version and agent currentness become material | Packaging/redistribution may matter | Enables otherwise impossible workflows | Install/update/revoke/attest agent lifecycle required | Highest platform/security coupling; use only when justified |

### Qualification rule

No mode is admissible solely because it is technically possible. Candidate selection should satisfy all material axes:

```text
Security
AND semantic compatibility
AND authority containment
AND currentness visibility
AND licensing entitlement
AND accessibility/equivalent path
AND lifecycle supportability
AND failure recovery
AND replaceability/exit path
```

An `UNKNOWN` on a hard axis remains `UNKNOWN/BLOCKED`, not an averaged pass.

## 7. Contradiction resolved — embedding is not the default form of integration

The desktop metaphor can tempt the product toward "every external app opens inside an SB window". Browser and product evidence contradicts that as a universal rule.

- CSP `frame-ancestors` allows the external application to forbid framing.
- Cross-origin isolation limits parent inspection/control.
- third-party cookie/storage behavior is not a stable semantic contract;
- product editions may expose different embedding rights;
- an embedded application may carry broader or differently modeled authority than the surrounding SB context.

Therefore:

`Application Window != iframe requirement`

An SB `ApplicationWindow` may host a native surface, API-backed projection, qualified frame, external-navigation handoff or bridge status. The shell abstraction must be integration-mode agnostic.

## 8. External integration security/currentness envelope

Candidate reusable contract:

```text
ExternalIntegrationBoundary
  applicationRef
  taskProfileRef
  mode
  externalIdentityRef
  endpoint/originRef
  authDisposition
  authorizationMappingDisposition
  credentialRef
  compatibilityDisposition
  providerRevision/profile
  licensingDisposition
  externalObservedAt
  sbProjectionObservedAt
  currentnessDisposition
  disclosureScope
  effectAuthorityDisposition
  fallbackMode
  evidenceRefs[]
```

Required distinctions:

`reachable != authenticated != authorized != semantically compatible`

`external UI visible != external session valid`

`external success presentation != SB effect verified`

`embed allowed != embed secure/admissible`

`API available != API sufficient for this task`

`license permits use != license permits embedding/redistribution`

## 9. Application Manager implications

Application Manager should manage a portfolio relationship, not merely package installation.

Candidate independent lifecycle dimensions:

```text
Discovery      UNKNOWN | DISCOVERED | VERIFIED | REJECTED
Registration   UNREGISTERED | REGISTERED | DETACHED
Installation   NOT_APPLICABLE | NOT_INSTALLED | INSTALLING | INSTALLED | UPDATE_AVAILABLE | INCOMPATIBLE
Binding        UNBOUND | BINDING | BOUND | DEGRADED | STALE | BROKEN
Integration    UNQUALIFIED | QUALIFYING | QUALIFIED | PARTIAL | INCOMPATIBLE
Management     authority vector, not one enum
ExternalAuth   UNKNOWN | VALID | EXPIRING | EXPIRED | REAUTH_REQUIRED
```

`Adopt` can produce REGISTERED + BOUND with Installation = NOT_APPLICABLE. A deep-linked SaaS application may be fully adopted without any local installation. Conversely an installed package is not necessarily registered/adopted into a Client/Workspace.

## 10. Desktop Sphere taxonomy refinement

Desktop Spheres remain task-context lenses. Candidate taxonomy should be job-oriented rather than module-oriented:

- `DESIGN` — model/edit/compose/preview;
- `OPERATIONS` — act on live systems with explicit effect authority;
- `OBSERVABILITY` — investigate evidence/telemetry without implying management authority;
- `GOVERNANCE` — review/authorize/policy/config provenance;
- `DATA` — inspect/model/administer data surfaces under qualified authority;
- `INFRASTRUCTURE` — deployment/placement/runtime/provider administration;
- `SUPPORT` — incidents/tickets/diagnostics/recovery;
- `FACTORY` — catalog/assembly/release/deployment pipeline;
- `PERSONAL/ROLE_HOME` — role-specific launch/status surface, if justified.

These are candidates, not canonical ownership partitions. One application may appear in multiple spheres. `Desktop placement != semantic ownership`.

Important distinction retained:

`DesktopObservatory` = contextual summary component;
`PinnedMonitoringSurface` = persistent monitoring composition;
`OperationsDesktop` = task sphere containing applications with effect-capable workflows.

An Observatory can appear inside an Operations Desktop without becoming the desktop or acquiring operational authority.

## 11. Foundations that reduce proprietary-app cost

The highest leverage is not a generic mega-editor. It is a small set of reusable mechanics/contracts:

### C0/C1 — atomic/foundation

Identity/currentness/authority/evidence badges; focus/selection; keyboard movement; typed command affordance; disclosure state; loading/partial/stale/error; SecretRef presentation; external-boundary indicator.

### C2 — compounds

TabStrip, WindowTitleBar, Inspector groups, Outliner rows, command groups, RecoveryBanner, ExternalAuthStateIndicator, IntegrationModeBadge, BindingCandidateRow, EvidenceEnvelopeSummary.

### C3 — reusable infrastructure

CommandRegistry, WindowRegistry, EditorDocumentSession, Selection/Focus routing, AutosaveConflictReconcile, BindingBrowser, ValidationFindings, semantic Diff host, Preview host, ExternalIntegrationBoundary, MonitoringEvidenceEnvelope, shared subscription broker, ApplicationIntegrationProfile evaluator/projection.

### C4 — module components/tools

Application Manager inspectors, Control Center change-plan/provenance tools, ServiceDefinition/placement inspectors, External Integration Qualification Inspector, SharedEditorFoundation tools, session recovery, monitoring mosaic editor.

### C5 — specialized applications

Workflow Designer, View/Page Builder, Form Builder, Componentes, Rules/Decision Editor, System/Module Designer, Requirements, Preview/Sandbox, Revision/Diff, Application Manager, Control Center, Operations/Observability applications.

### C6/C7 — workspace/system composition

Desktop Sphere, multi-display WorkspaceSession, Builder Home/Factory and cross-application task pages/system views.

The reusable foundation owns mechanics and evidence presentation. Specialized applications still need their own semantic grammar, domain validation, typed bindings and effect/authority contracts. That is the irreducible custom cost.

## 12. Declarative/opinionated UX implication

Opinionated UX should reduce invalid choices without hiding integration boundaries.

Examples:

- prefer API-backed native common task when API coverage is qualified;
- expose `Open advanced UI` when the external tool owns specialist functionality;
- refuse iframe when frame policy/licensing/currentness/a11y cannot be qualified;
- recommend deep-link instead of silently weakening CSP;
- show why a provider-specific feature forces an opaque escape hatch;
- preserve provider replacement information and exported semantic intent;
- auto-bind only with visible source, rule, selected target, scope, currentness and override path.

`Automatic != hidden` and `opinionated != irreversible`.

## 13. Performance/resource implications

Integration mode affects budgets and must be visible to future planning:

- native/API-backed surfaces can share normalized queries/subscriptions and virtualize data;
- iframe memory/network/resource use is controlled partly by the external application and cannot be assumed suspendable by SB;
- reverse proxy can add server/network/session overhead and failure modes;
- bridge adds local process/resource/update cost;
- deep-link has minimal SB residency cost;
- hybrid should avoid running both heavy native and embedded surfaces when one is inactive.

Future resource budgets should be measured by application/window residency class and integration mode, not only window count.

`Window count != resource cost`.

## 14. Accessibility and small-screen equivalence

Essential SB tasks cannot depend exclusively on a third-party embed whose accessibility contract is unknown. Qualification must record keyboard reachability, focus handoff/return, accessible naming, zoom/reflow behavior, status semantics and non-drag equivalents where relevant.

Small-screen equivalence is task equivalence, not pixel/layout parity. A phone-sized surface may offer inspect/review/approve/recover/open-advanced rather than a fake miniature multi-window desktop. The semantic command/effect path remains the same.

If an external advanced task has no qualified embedded accessibility, deep-link to the original accessible UI may be more correct than wrapping it.

## 15. Adversarial proof matrix

| Scenario | Required proof/disposition |
|---|---|
| External app is reachable but identity/version unverified | remains discovered/unverified; no credential or authority expansion |
| API common path works but advanced API is missing | Hybrid/deep-link escape hatch explicit; no fabricated semantic equivalence |
| iframe blocked by `frame-ancestors` | fallback to qualified API/deep-link; do not weaken external policy |
| iframe session expires while old UI remains painted | explicit `REAUTH_REQUIRED/STALE`; protected effects blocked/requalified |
| provider UI has broader admin rights than SB actor | embedding cannot expand SB effect authority; boundary visible |
| API returns success/202 | provider ACK only; desired/observed/effective remains unresolved until evidence qualifies effect |
| external product upgrade changes API/profile | compatibility becomes stale/qualifying; adapter evidence revalidated |
| external product changes embedding entitlement | embedding mode degrades/falls back without losing application identity |
| reverse proxy breaks WebSocket/CSRF/origin assumption | integration becomes degraded/incompatible; deep-link escape path remains |
| user switches Client/Environment before deep link | context is requalified; no silent fallback to old tenant/environment |
| external dashboard sample is old but green | `STALE`, never healthy-by-cache |
| native bridge is outdated/revoked | local privileged effects blocked until bridge trust/currentness requalified |
| same app used for read-only Observatory and admin Operations | separate task profiles/authority envelopes; no authority inheritance from app identity |
| mobile surface cannot host multi-window editor | equivalent review/status/recovery commands remain available; no false desktop parity |
| external tool disappears permanently | semantic SB definitions/data/export remain portable enough for replacement; integration loss is not semantic loss |

## 16. Proof obligations

1. Every external integration task names its mode and qualification evidence; mode is not inferred from visual presentation.
2. Application identity survives mode change (`E -> D`, `A -> H`, etc.) without fabricating continuity of external session/currentness.
3. No integration mode can expand SB authority merely because the external application supports a stronger action.
4. External credentials remain scoped references/boundaries and are never copied into window/session state.
5. `UNKNOWN` security, licensing, compatibility or effect authority on a hard task axis cannot be averaged into `QUALIFIED`.
6. Embedded/proxied UI cannot be the only path for an essential task unless its security/accessibility/lifecycle contract is qualified.
7. Provider/API/UI upgrade invalidates only materially dependent integration evidence, but that evidence must actually become stale when its assumptions change.
8. Deep links preserve or requalify Client/Workspace/Environment/revision context and provide a safe return/recovery path.
9. API-backed projections expose their own observedAt/currentness separately from the external application's state.
10. Reverse proxy is never chosen solely for visual integration; its security/session/protocol/upgrade obligations must be explicitly justified.
11. Native bridge requires explicit install/trust/update/revoke/OS-scope lifecycle and is not a convenience fallback for ordinary web integration.
12. External-tool replacement does not require changing canonical SB semantic definitions when the integration contract remains compatible.
13. Desktop Observatory, Pinned Monitoring Surface and Operations Desktop remain different composition/authority classes even when they display the same underlying telemetry.
14. `ApplicationWindow` remains agnostic to whether its content is native, API-backed, embedded, external-handoff or bridge-mediated.
15. Componentes scenarios cover every integration mode's loading/auth/currentness/error/recovery/permission states and impossible combinations.

## 17. Application Portfolio deltas

Material deltas from this round:

- integration mode is qualified per **task profile**, not globally per application;
- `ApplicationWindow` is explicitly integration-mode agnostic;
- embedding is demoted from intuitive desktop default to one conditional mode among seven;
- licensing/entitlement is promoted to a first-class qualification axis independent of technical embeddability;
- API-backed + deep-link/hybrid is the strongest general anti-lock-in pattern where common tasks can be normalized but specialist UI is mature;
- resource budgets must account for integration mode, not only window count;
- application adoption can be complete with `Installation = NOT_APPLICABLE` for external/SaaS tools;
- external integration currentness requires separate external-observation and SB-projection timestamps/evidence;
- Desktop Sphere taxonomy is task/job-oriented and explicitly non-owning.

## 18. Maturity / saturation / remaining gaps

Disposition: `MATERIAL_DELTA / APPLICATION_PORTFOLIO_PARTIALLY_MATURE`.

Saturation signals:

- application integration mode taxonomy: **medium-high**;
- external security/currentness boundary: **medium-high**;
- proprietary editor shared foundation: **medium-high**, with cross-app semantics still materially open;
- Window lifecycle: **medium-high**, with persisted session reconciliation still open;
- Desktop Sphere taxonomy: **medium**, requires scenario testing against complete jobs;
- Application Manager lifecycle: **medium-high**, exact adoption/ownership transfer and destructive authority still need deeper proof;
- Control Center: **medium-high**, inheritance/conflict algebra needs further qualification;
- declarative service deployment/auto-binding: **medium-high**, provider-neutral binding/reconciliation evidence remains open;
- accessibility/small-screen: **medium**, needs per-task equivalence matrix and third-party integration qualification;
- performance/resource budgets: **medium-low empirically** despite strong conceptual model; NORMAL/STRESS measurements remain absent.

Highest-value next vector: **durable WorkspaceSession + WindowRegistry reconciliation across multiple browser surfaces**, including transfer epochs, stale-peer detection, close-with-dirty/pending-effect protocol, session restore after browser/process crash, command-context requalification and resource-budget behavior under many mixed integration modes. This is now the main unresolved foundation connecting Window Manager, multi-display, external applications, recovery and future WBS decomposition.
