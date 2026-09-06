# Generation 2 — Integration & Automation — Full Pass 7 Revisit

Status: ELIGIBLE NO-NEW-MATERIAL REVISIT
Phase: `RESEARCH_ADVERSARIAL_EDGE_CASE_SATURATION`
Capability: Integration & Automation
Pass: 7

Research only. No product code, Work Package, TASK, Construction or remediation is authorized. Preserve `ConflictPattern != ConflictInstance` and `Signal != ConfirmedConflict`.

## 1. Authority and scope

This revisit follows `RESEARCH_PIPELINE_STATE.json`, `POST_MATH_ADVERSARIAL_EDGE_CASE_SATURATION_RESEARCH.md`, and `PROCESSUAL_SEMANTIC_CONFLICT_CLASSIFICATION.md`. Authoritative start: Full Pass 7 at 14/28 capabilities, 12/12 mandatory clusters, 284 material edge scenarios + 124 reusable ConflictPatterns = 408 material findings. Integration local no-material streak was already capped at 2.

The pass applies all standing graph/execution-proof, temporal, provenance, decision, units/vector, uncertainty, graph-revision, queue/capacity, causal research-only and Legacy Mirroring lenses, plus the bounded Physical Systems / IoT / Edge / Peripheral Integration lens. Specialized VMS, access-control, BMS/HVAC, PDV and device-management systems remain provider control/media planes by default. The SB boundary tested here is provisioning, synchronization, read/query/event ingestion, identity/resource mapping, access brokering, currentness and reconciliation. Direct physical actuation remains a non-goal except as a negative-boundary test against accidental authority amplification.

## 2. Physical/provider integration adversarials

### 2.1 Provisioning and deprovision are convergent claims, not request claims

A local create/update/revoke request can succeed while provider mutation fails, partially applies, applies late, or applies to the wrong provider/site/resource. Conversely, a transport timeout can leave the external effect `UNKNOWN`. Provider acknowledgement therefore cannot be promoted to effective external state.

Attack cases: local user created/provider create failed; group membership partly applied; revoke removes one role but leaves session/token/grant; duplicate provider user; external account ID reused; wrong tenant/site mapping; partial pagination; rate-limit truncation; late retry after authority changed; residual provider session after canonical deprovision; stale offline access-controller cache.

Detection/proof candidates: desired/observed/effective state separation, provider+tenant+site+resource-qualified identity, mutation attempt/effect lineage, explicit `APPLIED|NOT_APPLIED|PARTIAL|UNKNOWN`, reconciliation before unsafe retry, residual-grant/session discovery, and post-revoke convergence evidence.

Duplicate-screen disposition: existing ambiguous external mutation, qualified identity/currentness, residual cohort, false convergence, authority non-amplification and provider semantic mismatch families. Candidate classes `EXTERNAL_PERMISSION_DRIFT`, `PARTIAL_DEPROVISION`, `CROSS_SITE_ACCESS_LEAK`, `EXTERNAL_IDENTITY_MISMATCH`, `STALE_EXTERNAL_ACCESS_STATE` do not justify a 125th ConflictPattern.

### 2.2 Provider capability/profile equivalence is qualified, not nominal

ONVIF profiles contain mandatory and conditional features, and ONVIF conformance is tied to a specific firmware/software version. Profile labels therefore cannot be treated as universal feature equivalence across devices or versions. Profile T also includes PTZ/relay-related capabilities; their existence is specifically a reason to prevent a generic read/event/provision adapter from silently acquiring actuation authority.

OPC UA likewise separates authentication from authorization and allows application-specific role/permission mappings down to nodes. A generic `Operator`/`Observer`-style label cannot be assumed semantically equivalent across servers/vendors.

Detection/proof candidates: provider profile/version/capability matrix, unsupported-scope report, explicit conditional-feature qualification, canonical operation kind (`READ`, `EVENT`, `PROVISION`, `BROKER`, exceptional `ACTUATE`) and no operation-kind strengthening by adapter or AI/low-code composition.

Duplicate-screen disposition: provider capability false-equivalence, compatibility direction, authority non-amplification, unsupported-content/silent-drop and revision/currentness families. Candidate `PROVIDER_SCOPE_SEMANTIC_MISMATCH` and `UNSUPPORTED_RESOURCE_SILENT_DROP` are covered.

Evidence:
- ONVIF Profiles / conditional-vs-mandatory feature model: https://www.onvif.org/profiles/
- ONVIF conformance tied to product firmware/software version: https://www.onvif.org/profiles/conformance/
- ONVIF Profile T: https://www.onvif.org/profiles/profile-t/
- OPC UA Security Model — authorization and roles: https://reference.opcfoundation.org/specs/OPC-10000-2/4
- OPC UA Address Space Model — roles and node permissions: https://reference.opcfoundation.org/specs/OPC-10000-3/4.9

### 2.3 Access-control and biometric boundary

ONVIF Profile A/C/D evidence shows that access-control integrations may include credentials, schedules, access rules, readers and biometric peripherals. Profile D can also carry commands to grant/deny access or operate outputs. This is a provider-specific control-plane capability, not evidence that SB core should become a generic physical actuator.

For SB integration research, the safe semantic boundary remains identity-reference/enrollment integration, user/credential/group/area/schedule synchronization, read/event ingestion and reconciliation. Biometric templates/raw biometric data should not be centralized merely because a provider API exposes them; provider-side matching and minimization remain the default hypothesis.

Proof candidates: explicit subject/credential/provider identity mapping, tenant/site/area qualification, revoke/deprovision convergence, offline-cache currentness, minimization/retention qualification for biometric references, and an explicit exceptional-authority profile before any actuation-capable operation can be invoked.

Evidence:
- ONVIF Profile D: https://www.onvif.org/profiles/profile-d/
- ONVIF access-control profile overview: https://www.onvif.org/blog/2021/08/04/do-you-know-your-onvif-profiles/

### 2.4 Event/read truth is not physical truth

Camera/VMS events, access events, BMS telemetry and edge readings can be delayed, lost, duplicated, stale or incomplete. ONVIF Profile M/T standardize event/metadata interfaces, but standardized transport semantics do not prove complete observation or current physical state. OPC UA monitored-item queues can overflow and explicitly report lost values; therefore a healthy subscription is not proof of lossless telemetry.

Preserve:

`provider-reported permission != canonical authority != actual physical/media access success`

and

`event received != complete observation != current physical truth != causal proof`.

Detection/proof candidates: source/provider/site/resource identity, observed-at/effective-at/received-at distinctions, gap/overflow markers, sequence/watermark where qualified, currentness horizon, reconciliation snapshots, and `UNKNOWN` when evidence coverage is insufficient.

Evidence:
- ONVIF Profile M: https://www.onvif.org/profiles/profile-m/
- OPC UA monitored-item queue overflow/lost-value semantics: https://reference.opcfoundation.org/specs/OPC-30001/4.2

### 2.5 SCIM-style identity provisioning is not authorization equivalence

SCIM provides standardized User/Group create/update/delete and PATCH semantics, including group-member removal, but protocol-level provisioning does not establish that provider-native groups/resources mean the same thing as canonical authority. Version/precondition support also matters for concurrent changes.

Attack cases: group removal accepted while downstream session remains; provider group alias points to different site; bulk request partially succeeds; stale local membership overwrites newer provider state; provider ID reused after delete/recreate.

Proof candidates: external identity lifecycle lineage, mapping revision/owner, concurrency/currentness preconditions where available, group/resource semantic qualification, residual-session checks and post-provision reconciliation.

Evidence:
- RFC 7644 SCIM Protocol: https://www.rfc-editor.org/rfc/rfc7644

## 3. Standing formal-assurance lenses applied

Integration remains subject to the same proof separation as workflow execution:

`model/graph validity != connector capability qualification != request acceptance != external effect != observed convergence != journal integrity != PROVEN_COMPLETED`.

A tamper-evident journal can prove recorded evidence integrity within its profile; it cannot manufacture missing provider evidence, physical truth, current authority or semantic equivalence. A WorkflowCompletionCertificate/ProcessProofBundle that includes physical/provider integrations must bind provider/site/resource identity, connector/profile revision, attempt/effect identity, unresolved `UNKNOWN`, reconciliation evidence and residual-grant/session disposition. Missing or stale external evidence must yield `UNKNOWN/INCONCLUSIVE`, not completion strengthening.

Temporal: in-flight provisioning and event streams must remain qualified to the producing connector/provider/profile revision and effective-time cut. Current projection cannot rewrite historical evidence.

Provenance: `derivedFrom != causedBy != authorizedBy`; provider event lineage cannot be promoted to causal or authority proof.

Decision semantics: provider-side access/routing decisions, canonical policy decisions and workflow control-flow decisions remain distinct result kinds.

Units/vector semantics: telemetry shape compatibility does not prove unit, timezone, coordinate, rate/total or multidimensional semantic compatibility.

Uncertainty: stale/incomplete telemetry, AI confidence and probabilistic estimates remain distinct from `UNKNOWN` external mutation outcome.

Graph transformation: adapter/profile/resource remapping requires semantic diff and proof invalidation/preservation analysis; visual or identifier continuity is insufficient.

Queue/capacity: rate limits, partial pagination, edge buffering and event backlog can create false synchronization; observed low utilization does not prove stable sustainable capacity.

Causality: correlation between device/event state and business outcome is research evidence only unless an explicit causal model, assumptions, evidence and owner qualify the claim.

Legacy Mirroring: imported provider inventory/events remain observed external evidence until mapping/source-of-truth transitions are explicitly approved; mirror/sync must not silently promote provider-native identity or permission semantics to canonical truth.

## 4. Conflict classification and duplicate screen

The revisit deliberately searched structural graph, state-transition, semantic ownership, temporal/ordering, resource/capacity, authority/SoD, data/consistency, provider/integration, migration/coexistence, recovery, human-procedure, cross-process, objective and AI/low-code conflict families.

Physical candidate classes screened: `EXTERNAL_PERMISSION_DRIFT`, `PARTIAL_DEPROVISION`, `CROSS_SITE_ACCESS_LEAK`, `EXTERNAL_IDENTITY_MISMATCH`, `PROVIDER_SCOPE_SEMANTIC_MISMATCH`, `STALE_EXTERNAL_ACCESS_STATE`, `UNSUPPORTED_RESOURCE_SILENT_DROP`. All map to existing reusable ConflictPatterns; no new ID is created. No `ConflictInstance` is asserted. A reconciliation mismatch, stale state or queue gap remains a `Signal` until qualified evidence confirms a concrete conflict.

Material result:
- new local material edge scenarios: **0**;
- new cross-capability scenario IDs: **0**;
- new reusable ConflictPatterns: **0**;
- new preventive invariant candidates: **0**;
- material inventory remains **284 edges + 124 ConflictPatterns = 408**;
- HIGH/CRITICAL without owner/proof/detection route: **0**.

## 5. Planning C/D/E and Architecture Reconciliation proof obligations

1. **Provisioning convergence proof:** desired request, provider acknowledgement and observed/effective external state remain separate claims.
2. **Revoke/deprovision proof:** prove disposition of grants, memberships, sessions/tokens, offline caches and residual provider cohorts; partial/unknown revoke blocks false convergence.
3. **External identity proof:** bind canonical subject to provider account/credential/resource with tenant/site/provider namespace, lifecycle and mapping revision; detect reuse/duplicate/split identity.
4. **Isolation proof:** no cross-tenant/site/resource leakage under mapping drift, stale session, provider substitution or ambiguous aliases.
5. **Capability qualification proof:** adapter operations are bounded by provider profile/version/conditional feature semantics; unsupported scopes/resources are explicit, never silently dropped.
6. **Currentness proof:** dashboard/read/event claims expose source and currentness; stale/partial/gapped telemetry cannot be rendered as synchronized physical truth.
7. **Ambiguous mutation proof:** `UNKNOWN` external effects require reconciliation before unsafe retry unless operation-specific idempotency/effect semantics prove safety.
8. **Event coverage proof:** gap/overflow/partial-page/buffer-loss evidence is retained; healthy subscription does not imply complete observation.
9. **Non-actuation boundary proof:** read/provision/broker adapters and AI/low-code composition cannot acquire physical actuation/control-loop authority by feature-label or provider-profile equivalence.
10. **Biometric minimization proof:** identity-reference/enrollment integration does not imply central template/raw biometric retention or matching authority.
11. **Federated responsibility proof:** provider/site/runtime responsibility and evidence handoff are explicit under outage/offline operation and recovery.
12. **Proof-bundle non-strengthening:** journal/signature/provider evidence integrity cannot be promoted into semantic/current physical completion without the required external evidence.

Planning E future acceptance should include: provider create succeeds locally/fails remotely; partial revoke with residual session; duplicate/reused external ID; wrong-site mapping; unsupported role/resource reporting; profile/version drift; partial pagination/rate limit; stale offline access cache; event gap/overflow; provider outage with `UNKNOWN`; cross-tenant camera/resource isolation; biometric minimization; and an AI/low-code attempt to turn read/provision capability into actuation authority.

## 6. Saturation disposition and next rotation

Result: **ELIGIBLE NO-NEW-MATERIAL REVISIT**. Integration & Automation local no-material streak remains **2 / capped**. All 12 mandatory cluster streaks remain capped at 2. Full Pass 7 advances to **15/28 capabilities**, with **6/8 minimum full passes complete**. Negative-space remains `NOT_STARTED`; saturation remains `NOT_SATURATED`; Planning C remains blocked.

Next: **Identity / Authentication / Federation**. Carry the Physical Systems/IoT/Edge/Peripheral lens into external account/credential identity, federation namespace/site qualification, external ID reuse, enrollment/deprovision, stale sessions/tokens, provider substitution, offline access identity, cross-tenant/site correlation, authentication-versus-authorization, biometric identity references, currentness/provenance, `PARTIAL/UNKNOWN`, and AI/low-code evidence strengthening. Do not materialize architecture.