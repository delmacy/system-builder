# Generation 2 — Identity / Authentication / Federation — Full Pass 8 Revisit

Status: ACTIVE — ELIGIBLE NO-NEW-MATERIAL REVISIT
Phase: `RESEARCH_ADVERSARIAL_EDGE_CASE_SATURATION`
Capability: Identity / Authentication / Federation
Pass: 8
Authority: `RESEARCH_PIPELINE_STATE.json`, `ADVERSARIAL_SATURATION_STATE.json`, `POST_MATH_ADVERSARIAL_EDGE_CASE_SATURATION_RESEARCH.md`, `PROCESSUAL_SEMANTIC_CONFLICT_CLASSIFICATION.md`, `IDENTITY_AUTHENTICATION_FEDERATION_EDGE_CASE_REGISTER.md`, `OPERABILITY_ELICITATION_LENS_RESEARCH.md`, and standing Generation-2 research lenses.

Research only. No product code, Work Package, TASK, Construction, implementation guard or remediation is authorized. Preserve `ConflictPattern != ConflictInstance`, `Signal != ConfirmedConflict`, `authentication evidence != authorization`, `external provider state != canonical authority != physical truth`, and `Fleet visibility != remote actuation authority`.

## 1. Full-Pass-8 technique rotation

This revisit deliberately avoids repeating the Pass-7 namespace/pagination-first probe set. It uses a different combination:

1. **credential-property state mutation** — distinguish credential identity, authenticator/device locality, backup eligibility, current backup state, user-verification evidence and signature-counter evidence;
2. **revocation-response falsification** — mutate OAuth revocation responses and propagation state so transport/API success cannot be strengthened into proof that all usable credentials have ceased everywhere;
3. **logout fan-out partitioning** — distinguish issuer-qualified session identifiers, RP-local sessions, OP session intent, optional back-channel capabilities and residual sessions;
4. **security-event epistemic mutation** — treat security events as historical evidence of an occurrence, not automatically as current state, command authority or proof of full convergence;
5. **credential lifecycle / account lifecycle decoupling** — registration, backup, recovery, account disable, token/session revocation and canonical-person lifecycle are tested as related but non-identical state machines;
6. **operability-elicitability subtraction** — remove revocation SLO, residual-session evidence, credential inventory owner, currentness horizon, alert owner, recovery proof or reconciliation route from an otherwise feature-complete identity definition;
7. **queue-class starvation** — place token revocation/logout/reconciliation behind enrollment/login/inventory traffic and test whether average connector health hides security-currentness debt;
8. **offline evidence horizon mutation** — continue autonomous local operation while Fleet/exporter or upstream identity provider is unavailable and test which authentication evidence remains qualified locally;
9. **Physical/Peripheral integration-plane identity projection** — observe external users, credential references, biometric-reference mappings and access-resource inventories without treating them as canonical identity or physical-control authority;
10. **causal/counterfactual non-strengthening** — use login failures, revocation lag, credential backup transitions and provider incidents as analytical signals only unless causal assumptions are explicit;
11. **AI/low-code evidence composition** — test whether a generated mapping combines individually valid identity signals into a stronger canonical/authentication/authorization claim than any input supports;
12. **duplicate-screen against all 124 reusable ConflictPatterns** before admitting any material novelty.

## 2. Fresh comparative evidence

Fresh standards/specification review strengthens existing families without producing a 125th reusable ConflictPattern.

### WebAuthn Level 3 (W3C, 2026)

WebAuthn Level 3 distinguishes permanent **backup eligibility** from mutable **backup state** for a credential. A credential may therefore remain the same credential while its current backup condition changes. The specification also states that signature counters may be absent/zero and that a non-increasing counter is a **signal, not proof**, of cloning because malfunction or parallel credential copies are possible explanations. Credential IDs are scoped to RP processing and duplicate registration must be handled deliberately.

Portable consequence: `credential registered != credential bound to one physical device forever`; `backup state != credential identity`; `counter anomaly != confirmed compromise`; and operational evidence must retain source, time/currentness and confidence.

Source: https://www.w3.org/TR/webauthn-3/ (accessed 2026-09-06).

### OAuth 2.0 Token Revocation — RFC 7009

RFC 7009 specifies that successful revocation invalidates the submitted token, but explicitly acknowledges propagation delay in distributed deployments. Revocation of related access/refresh tokens depends on server policy/support. HTTP 200 is returned both when revocation succeeds and when the submitted token is invalid, while HTTP 503 requires the client to assume the token may still exist and retry later.

Portable consequence: `HTTP 200 revocation response != proof of complete credential/session/grant convergence`; related-token invalidation and distributed propagation require qualified evidence/currentness. This is already covered by authentication-currentness/residual-cohort/effect-evidence families.

Source: https://www.rfc-editor.org/info/rfc7009 (accessed 2026-09-06).

### OpenID Connect Back-Channel Logout 1.0

The final OpenID Connect Back-Channel Logout specification makes support optional, distinguishes generic back-channel logout support from session-ID support, and defines `sid` as unique only in the context of a particular issuer. A logout token may identify one RP session through `sid` or all RP sessions for an issuer-qualified subject when `sid` is absent.

Portable consequence: `sid` must remain issuer-qualified; `logout message accepted != all external/provider sessions globally absent`; and provider capability profile determines which convergence claim is supportable.

Source: https://openid.net/specs/openid-connect-backchannel-1_0.html (accessed 2026-09-06).

### Security Event Token — RFC 8417

A Security Event Token describes a logical security event that has occurred. That is historical evidence, not by itself a universal command or a continuously current state assertion.

Portable consequence: `security event observed != current identity state != control authority`; subsequent state, missing events, ordering/currentness and reconciliation remain separate.

Source: https://www.rfc-editor.org/info/rfc8417/ (accessed 2026-09-06).

These sources are comparative witnesses only and do not decide Planning C architecture.

## 3. Autonomous Builds × Fleet Observability/Capacity

The candidate lineage remains research-only:

`CanonicalCapabilityRef -> CapabilityUse -> BuildRevision/Release -> RuntimeRealization -> Deployment -> NodeInvocation/Attempt`.

Identity/authentication observations may additionally need qualified dimensions such as `{client/site, issuer/provider, provider-profile/version, canonical-subject mapping revision, credential/session/token class, authenticator/credential evidence, requested/accepted/effective/reconciled lifecycle state, source timestamp, observed timestamp, currentness horizon, completeness, residual cohort}`. This is analytical vocabulary, not a committed schema.

Preserve:

`semantic topology != build topology != deployment topology != runtime truth != local evidence != exported telemetry != Fleet aggregate != control authority`.

A system client must remain operational according to its locally qualified identity/authentication contract when SB/Observe/Fleet is unavailable. Export failure produces an observability gap. It does not become a central runtime dependency.

For offline/degraded cases, identity evidence may have a bounded local validity/currentness horizon. Whether privileged work may continue is an owned local policy question; Fleet unavailability cannot silently grant or revoke authority.

## 4. Queueing / flow / capacity mathematics

Identity has multiple workload classes with different harm functions:

`login/authentication -> token/session validation -> enrollment/provisioning -> revoke/deprovision/logout -> inventory/reconciliation -> security-event ingestion -> telemetry/export`.

Treating them as one queue or utilization scalar can hide a critical failure: a connector may report low mean utilization while revoke/logout work experiences a long-tail backlog because normal login/inventory work consumes provider quota or concurrency.

Candidate dimensions remain multidimensional:

- arrival rate `lambda` by operation class;
- effective service rate `mu` by provider/profile and dependency state;
- queue depth and **oldest age**;
- wait/service/sojourn distributions;
- retry rate and duplicate rate;
- provider rate-limit/quota pressure;
- current residual-token/session population;
- evidence/export lag;
- headroom and stability margin under burst/reconnect conditions.

Preserve:

`observed low utilization != current queue health != sustainable capacity != headroom != transient burst tolerance != stability margin`.

Little's Law or M/M/1-like approximations may be useful only where their assumptions are explicitly qualified. Revocation/logout traffic can be bursty and correlated with incidents, provider outages or compromised-account events; those are exactly the conditions under which simple stationary averages are weakest.

A useful research adversarial is a **security-event/revocation storm**: one provider incident causes many revoke/logout requests while the same outage lowers effective `mu`, creating a positive backlog/currentness feedback loop. This reduces to existing resource/capacity + authentication-currentness + provider degradation families rather than a new semantic family.

## 5. Vector semantics and graph algebra

Identity operations continue to require vectors rather than one health score. Candidate dimensions can contribute to `RiskVector`, `ResourcePressureVector`, `ComplexityVector` and `CapabilityOperationalVector`, but equal scalar outputs must not erase dimensions such as credential assurance, currentness, residual session count, provider quota pressure, offline horizon or cross-tenant blast radius.

Graph analysis may project edges such as canonical-subject mapping, issuer/provider binding, credential ownership, session derivation, token/grant derivation and deployment/provider realization. Any graph metric remains dependent on edge semantics, revision and effective interval.

`graph centrality != authority`; `embedding similarity != identity proof`; `provider co-occurrence != canonical merge`; and scalarization requires explicit versioned policy with units/normalization/missingness treatment.

## 6. Temporal / uncertainty operational coupling

Identity state is time-qualified across at least canonical mapping revision, provider account state, credential registration, credential backup state, token/session issuance, revocation/logout request, provider propagation, local observation, reconciliation and export.

A historical login fact must not be rewritten by a later revocation or late-arriving provider event. A later event may supersede the current interpretation, but the evidence consumed by the historical invocation remains historical.

Relevant distinctions:

- `issued-at != observed-at != revoked-at != propagation-complete-at`;
- `desired disabled != provider accepted disable != all usable credentials absent`;
- `backup eligible != currently backed up`;
- `event received late != event happened late`;
- `missing event != negative evidence`;
- `stale provider inventory != current physical/external truth`.

Unknown propagation, incomplete provider inventory or unavailable upstream currentness may require `PARTIAL/UNKNOWN` rather than false negative claims.

## 7. Causal / counterfactual boundary

Fleet may observe that login failures increase after an issuer rotation, logout backlog increases during provider throttling, or credential backup-state transitions correlate with support incidents. Those are hypotheses.

Any causal analysis requires an explicit causal question, intervention, confounders, selection/missingness assumptions, time ordering, compatible provider/build/site cohorts and uncertainty/sensitivity analysis.

`correlation/Fleet co-movement != causal proof != authority to merge identity, revoke access, change provider binding or alter local policy`.

## 8. Physical / Peripheral integration-plane qualification

Physical/peripheral scope remains integration-observability/reconciliation only.

Fleet may observe external users, provider accounts, credential-reference mappings, access-group/area relationships, reader/controller inventory, biometric reference identifiers or event freshness where authorized. It must not infer that:

- provider user/account identity is the canonical person identity;
- a biometric reference is centrally stored/matched by default;
- visibility of a controller/reader/user grants direct door/gate actuation authority;
- a provider's reported permission is current canonical authorization;
- an external device/resource observation is current physical truth.

Preserve `external provider state != canonical authority != physical truth` and explicit client/site boundaries.

## 9. Operability Elicitation Lens applied to Identity

A feature-complete identity/authentication definition is not production-ready unless the operational questions are sufficiently qualified. Candidate elicitation questions for this capability include:

### Success/currentness

- How do we know authentication is functioning end-to-end for each workload/assurance class?
- What evidence proves a disable/revoke/logout has converged sufficiently?
- Which session/token/credential states may legitimately remain `UNKNOWN` and for how long?
- What freshness horizon applies to issuer metadata, trust material, directory state and provider inventory?

### Ownership and response

- Who owns account/credential/session lifecycle operationally?
- Who owns residual session/token drift and provider reconciliation?
- Which condition pages immediately versus creates a later ticket?
- What runbook exists for provider outage, federation failure, compromised credential or revoke backlog?

### Capacity

- Expected and peak login, enrollment, revoke/logout, reconciliation and event-ingestion load?
- Which provider quota or local bottleneck binds first?
- What revoke/deprovision backlog age is acceptable by class?
- What burst is expected during incident response or reconnect?

### Failure/reconciliation

- What happens on timeout after a mutating provisioning/revocation operation?
- Which operation is idempotent, under which identity/scope/window?
- How are residual sessions, duplicated events and missing inventory pages reconciled?
- What does a 200/accepted response actually prove for the selected provider/profile?

### Credential/authenticator semantics

- Which authenticator/credential properties affect policy: user verification, backup eligibility/state, attestation, phishing resistance or other assurance evidence?
- Are those properties immutable, mutable or only observed at assertion time?
- What is signal versus confirmed compromise (for example signature-counter anomalies)?
- What recovery path exists if a single-device credential is lost or a backed-up credential changes state?

### Offline/autonomy

- What authentication evidence remains usable locally when upstream IdP or Fleet is unavailable?
- For how long and for which operation classes?
- How is reconnect/requalification performed without rewriting historical local evidence?

### Change safety

- What happens when issuer/provider/profile, keys, mappings or logout capabilities change?
- Which residual sessions/credentials belong to the old epoch?
- What rollback is actually eligible, and what external state is not rolled back with local configuration?

### Privacy/security

- Which identity/security telemetry is necessary and how is it minimized/redacted?
- Are biometric/reference metadata, access events or location/site identity unnecessarily exposed to Fleet?
- Who can inspect operational identity evidence and how is access audited?

Production Readiness Coverage remains separate from feature completeness across `OBSERVABILITY`, `OWNERSHIP`, `FAILURE_HANDLING`, `RECOVERY`, `CAPACITY`, `CURRENTNESS`, `SECURITY`, `RECONCILIATION`, `CHANGE_SAFETY`, `COST`, and `DOCUMENTATION`, using `UNTOUCHED | PARTIAL | RESOLVED | CONFLICTED | BLOCKED | NA`. No scalar readiness score is authoritative.

## 10. Adversarial candidate duplicate-screen

| Candidate | Strongest incompatible claim | Assessment / duplicate-screen |
| --- | --- | --- |
| backed-up WebAuthn credential is treated as proof that one credential is permanently tied to one physical device | `credential identity -> fixed device locality` | HIGH where device-locality assumptions gate policy; evidence currentness required; duplicate of identity mapping/evidence-currentness/qualified authentication semantics. WebAuthn explicitly separates credential identity from mutable backup state. |
| signature counter regression is automatically classified as confirmed clone/compromise | `detector signal -> confirmed security fact` | HIGH; potentially account/system blast radius; false-positive risk explicit in WebAuthn; duplicate of `Signal != ConfirmedConflict`, evidence-confidence and security-detection families. |
| OAuth revocation HTTP 200 is surfaced as “all access removed” | `request response -> globally converged related-token/session state` | CRITICAL; propagation and cascade support vary; duplicate of `AUTHENTICATION-CURRENTNESS-001`, residual cohort and provider-effect evidence families. |
| revocation 503/error is treated as NOT_APPLIED and immediately retried without operation qualification | `transport failure -> token absent/not applied` | HIGH–CRITICAL; duplicate of `UNKNOWN` mutation/retry/provider degradation families. RFC 7009 specifically says 503 requires assuming the token still exists. |
| OIDC logout `sid` is treated as globally unique or logout acceptance as global sign-out proof | `provider-local session id/event -> canonical/global session convergence` | HIGH–CRITICAL; duplicate of qualified identity, federation coexistence and currentness families; `sid` is issuer-qualified and provider support is optional. |
| security event is used as current-state command/authority | `event that occurred -> current state/control permission` | CRITICAL when linked to mutation; duplicate of evidence/currentness, event/provenance and authority non-amplification families. |
| incident-triggered revoke storm starves security work while aggregate auth utilization remains green | `low mean utilization -> revoke capacity/currentness healthy` | CRITICAL; duplicate of resource/capacity + authentication-currentness + stale-green observability families. |
| Fleet sees biometric/access identity reference and AI resolves it to canonical person or central control authority | `likely mapping/visibility -> identity adoption/authorization/actuation` | CRITICAL; high false-positive risk for heuristic matches; duplicate of `IDENTITY-MAPPING-001`, AI authority/evidence amplification and Physical/Peripheral no-central-control boundary. |
| feature-complete identity capability has no revoke SLO, residual-session proof or operational owner | `feature complete -> production ready` | HIGH; duplicate of false completeness/ownership/currentness/recovery families; Operability Elicitation makes the missing dimension explicit rather than creating a new conflict family. |
| provider incident and login/revoke drift co-move, and Fleet recommends automatic provider/authority change as causal fact | `correlation -> causal proof -> control authority` | HIGH; duplicate of analytical-kind/causal non-strengthening and authority families. |

No candidate survives duplicate-screen as a new material local edge case, cross-capability edge case or reusable ConflictPattern.

## 11. Conflict classification disposition

All standing conflict families were screened: structural, state-transition, semantic ownership, formula/rule, temporal/order, resource/capacity, authority/SoD, policy/compliance, data/consistency, provider/integration, version/coexistence, recovery, human-procedure, cross-process, objective/optimization and AI/low-code.

The strongest Pass-8 composition is still a combination of locally valid facts that do not constitute one current qualified cut: a canonical mapping may be valid, a credential signature may verify, a provider may accept revocation/logout, a Fleet event may be fresh enough for one purpose, and a local session may remain active — yet those facts differ in issuer/provider, revision, effective time, completeness and authority scope. Existing `IDENTITY-MAPPING-001`, `AUTHENTICATION-CURRENTNESS-001`, `FEDERATION-COEXISTENCE-001`, residual-cohort, provider-evidence and authority non-amplification patterns already represent the material risk.

`ConflictPattern != ConflictInstance`; `Signal != ConfirmedConflict`. No current product defect is asserted.

## 12. Planning C / D / E carry-forward candidates

Research-only carry-forward, without materializing architecture:

- **Planning C:** qualified credential/session/token evidence; explicit issuer/provider/client/site namespace and currentness; desired/accepted/effective/reconciled identity lifecycle; credential-property state separate from canonical identity; local-first autonomous authentication evidence; per-operation queue/capacity dimensions; Production Readiness Coverage; observe/control/change separation; no Physical/Peripheral central-control inference.
- **Planning D:** migrations/provider substitutions must preserve identity mapping lineage, issuer/session namespace, credential/provider profile differences, residual tokens/sessions, logout/revocation capabilities, offline cohorts and reconciliation checkpoints.
- **Planning E:** proofs should challenge revocation propagation, related-token residuals, logout support mismatch, issuer-qualified `sid`, credential backup-state change, signature-counter false-positive handling, incident revoke storms, offline currentness, stale-green Fleet, cross-site external identity references, AI-generated identity adoption and causal overclaim.

These are architecture/proof consequence candidates only.

## 13. Saturation disposition

- new local material edge scenarios: **0**;
- new cross-capability scenarios: **0**;
- new reusable ConflictPatterns: **0**;
- new ConflictInstances: **0**;
- new preventive invariants: **0**;
- Identity / Authentication / Federation no-material streak: **2 (preserved; capped, not inflated)**;
- mandatory-cluster streaks: **2 (preserved; 12/12 mandatory clusters already covered in Full Pass 8)**;
- material edge scenario inventory: **284**;
- reusable ConflictPattern inventory: **124**;
- combined material findings: **408**;
- HIGH/CRITICAL without owner/proof/detection route: **0**;
- Full Pass 8 capability coverage after this revisit: **16/28**;
- completed full passes: **7/8 minimum**;
- target: **12**, no maximum;
- negative-space review: **NOT_STARTED**;
- saturation: **NOT_SATURATED**;
- Planning C: **BLOCKED**.

## 14. Next rotation

Continue Full Pass 8 with **Authorization / Policy / Organization / Multitenancy**. Use materially different probes around external/provider claims versus canonical authorization, policy decision/effect currentness, delegation/break-glass/SoD, tenant/site-qualified scope, policy revision crossing in-flight work, deprovision/revoke propagation, queue/admission/fairness under policy evaluation pressure, autonomous local authorization while Fleet is unavailable, operability ownership/currentness/readiness, Physical/Peripheral external grants strictly as integration-plane evidence, Legacy/Brownfield authority assimilation, causal non-strengthening and AI/low-code authority composition. Authorization streak is already 2 and must remain capped absent material novelty. Planning C remains blocked.