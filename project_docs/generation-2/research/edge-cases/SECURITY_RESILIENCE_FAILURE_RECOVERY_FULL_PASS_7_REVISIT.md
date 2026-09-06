# Generation 2 — Security / Resilience / Failure Recovery — Full Pass 7 Revisit

Status: ACTIVE — ELIGIBLE NO-NEW-MATERIAL REVISIT
Phase: `RESEARCH_ADVERSARIAL_EDGE_CASE_SATURATION`
Capability: Security / Resilience / Failure Recovery
Pass: 7
Authority: `RESEARCH_PIPELINE_STATE.json`, `ADVERSARIAL_SATURATION_STATE.json`, `POST_MATH_ADVERSARIAL_EDGE_CASE_SATURATION_RESEARCH.md`, `PROCESSUAL_SEMANTIC_CONFLICT_CLASSIFICATION.md`, `SEMANTIC_GRAPH_FEDERATION_SOUNDNESS_EXECUTION_PROOF_RESEARCH.md`, and `PHYSICAL_PERIPHERAL_OPERATIONS_INTEGRATION_PLANE_BOUNDARY.md`.

Research only. No remediation, product work, Work Package, TASK or Construction is authorized. Preserve `ConflictPattern != ConflictInstance`, `Signal != ConfirmedConflict`, `UNKNOWN != probabilistic uncertainty != bounded interval != model confidence`, `provider-reported permission != canonical authority != actual physical/media access success`, and `integrity proof != semantic proof != external-effect proof`.

## 1. Pass-7 lens

This revisit combines the standing formal-assurance, temporal, provenance, decision, dimensional/vector, uncertainty, graph-revision, queue/capacity, causal and Legacy Mirroring lenses with the bounded Physical / IoT / Edge / Peripheral integration-plane constraint.

The physical boundary remains deliberately narrow:

`observe / inventory / provision where explicitly qualified / reconcile / diagnose != unrestricted remote physical actuation`.

Specialized VMS, BMS/HVAC, access-control, PDV, industrial/device-management and biometric matching systems remain provider control/media/runtime planes by default. Security/recovery research therefore attacks recovery of identities, grants, sessions, mappings, inventory, event streams, connector state and evidence; it does not promote Fleet/SB into a physical control loop.

Primary separation:

`backup/restore success != external-account/grant/session convergence != current provider state != current canonical authority != physical/media access outcome != workflow PROVEN_COMPLETED`.

Formal-assurance separation remains:

`model soundness != execution conformance != journal integrity != external-effect proof != recovery qualification != federated/physical convergence`.

## 2. Evidence refresh

1. NIST SP 800-61 Rev. 3, finalized April 3, 2025, treats incident response as an integrated cybersecurity-risk-management activity spanning preparation, detection, response and recovery. Recovery is therefore not a single terminal boolean and does not erase current qualification obligations. Source: https://www.nist.gov/publications/incident-response-recommendations-and-considerations-cybersecurity-risk-management-csf (rechecked 2026-09-06).
2. NIST Cybersecurity Framework recovery material continues to frame recovery as restoration of impaired capabilities/services with maintained recovery processes, not as proof that every dependent external state or authority is current. Source: https://www.nist.gov/cyberframework/recover (rechecked 2026-09-06).
3. ONVIF Profile A explicitly covers granting/revoking credentials, schedules and access rules, while Profile C covers door control/events and Profile D peripherals can participate in grant/deny and locking/unlocking flows. These profiles demonstrate that access-control interfaces may expose both configuration and actuation semantics; an adapter must not infer authority equivalence from profile interoperability. Sources: https://www.onvif.org/profiles/onvif-profile-a/, https://www.onvif.org/profiles/onvif-profile-c/, https://www.onvif.org/profiles/profile-d/ (rechecked 2026-09-06).
4. ONVIF states that security/regulatory suitability remains the responsibility of manufacturers, architects/integrators and use-case design; profile conformance is not universal safety or authorization proof. Source: https://www.onvif.org/profiles/ (rechecked 2026-09-06).
5. OPC UA security architecture permits a Session to survive a broken SecureChannel for a bounded period and be re-established. This is an industrial witness that transport reconnection, session lifetime and current user/application authority are distinct states; recovery of connectivity does not itself prove that a previously valid session should remain authorized after incident-driven revocation or topology change. Source: https://reference.opcfoundation.org/specs/OPC-10000-2/4 (rechecked 2026-09-06).

These sources are comparative witnesses only; they do not select target architecture.

## 3. Physical/peripheral recovery adversarials and duplicate-screen

### 3.1 Restore revives stale external grants or provider users

Attack: restore canonical/provisioning state from recovery cut `R` after an external user, credential, group membership, camera/resource grant or site binding had been revoked or changed after `R`. The restored local state again shows the old relationship while the provider may still be revoked, may have recreated the account, or may still carry a residual session/cache.

Candidate conflict classes: `STALE_EXTERNAL_ACCESS_STATE`, `EXTERNAL_PERMISSION_DRIFT`, `HISTORICAL_REINTERPRETATION`.

Disposition: duplicate-screened into existing recovery-cut/currentness, residual-cohort, identity-mapping, historical-non-rewrite and false-convergence ConflictPatterns. No new reusable pattern.

Owners: Security/Recovery + Identity + Authorization + Provider/Binding + site/client authority owner.

Detection route: compare recovery cut, canonical mapping revision, provider account/grant inventory, session/token/cache currentness and post-recovery reconciliation evidence.

Proof obligation: restored historical access evidence must not become current authority without explicit current qualification; recovery must expose residual provider-side identities/grants/sessions until reconciled.

### 3.2 Partial deprovision during provider outage

Attack: SB records revoke/deprovision intent; one provider-side mutation succeeds, another times out, offline edge controllers retain cached credentials, or a provider outage prevents verification. A local recovery sequence retries from stale evidence and may duplicate, resurrect or broaden grants.

Candidate conflict classes: `PARTIAL_DEPROVISION`, `DUAL_WRITE_SPLIT_BRAIN`, `STALE_EXTERNAL_ACCESS_STATE`.

Disposition: covered by ambiguous external mutation, `UNKNOWN` reconcile-before-retry, residual-cohort, retry/idempotency and provider-coexistence families.

Owners: Identity/Authorization + Integration/Provider + Security/Recovery.

Detection route: requested/acknowledged/effective state vector; residual-account/grant/session inventory; offline-controller/cache horizon; retry ancestry; provider observation timestamp.

Proof obligation: `UNKNOWN/PARTIAL` revoke remains non-terminal; unsafe retry is blocked until operation-specific idempotency or reconciliation evidence qualifies the prior effect.

### 3.3 Recovery crosses tenant/site/resource namespaces

Attack: disaster recovery, brownfield remapping or provider rebootstrap reuses an external account ID, device ID, camera/group alias, credential reference or spreadsheet-derived mapping under the wrong client/site/provider tenant.

Candidate conflict classes: `CROSS_SITE_ACCESS_LEAK`, `EXTERNAL_IDENTITY_MISMATCH`, `FALSE_ENTITY_CONVERGENCE`.

Disposition: existing qualified-identity, cross-tenant leakage, entity-resolution and provider-namespace families cover the class.

Owners: Identity + Authorization + Provider/Binding + Security/Recovery + client/site owner.

Detection route: namespace-qualified identity tuple, mapping lineage/revision, provider tenant/site/resource inventory, collision/reuse audit.

Proof obligation: recovery and restore proofs bind canonical subject plus provider/issuer/tenant/site/resource namespace and mapping revision; bare external IDs cannot prove identity continuity.

### 3.4 Recovered dashboard claims synchronized while permission/event state is stale

Attack: connector health recovers before full inventory pagination, event replay, revoke backlog or permission reconciliation completes. UI/AI presents green status or recovered health and operators infer that camera/access/BMS/PDV state is current.

Candidate conflict classes: `STALE_EXTERNAL_ACCESS_STATE`, `UNSUPPORTED_RESOURCE_SILENT_DROP`, false convergence.

Disposition: existing observability coverage/currentness, presence semantics, proof-claim conflation and capacity/backlog families cover the class.

Owners: Observability + Integration/Provider + Security/Recovery + relevant domain owner.

Detection route: last-success age, pagination/checkpoint completeness, event-gap horizon, backlog age, unresolved mapping/grant drift, unsupported-scope report.

Proof obligation: recovered connector/process health cannot strengthen incomplete external evidence into `SYNCHRONIZED`, `REVOKED`, `SAFE` or `PROVEN_COMPLETED`.

### 3.5 Provider/profile substitution after incident widens operation class

Attack: failover from provider/profile A to B maps a portable-looking capability name to a broader vendor-specific permission set, including operations capable of physical actuation. Example witnesses include ONVIF profiles where access configuration and door/peripheral control are distinct feature families but can coexist in one integrated product.

Candidate conflict class: `PROVIDER_SCOPE_SEMANTIC_MISMATCH` plus accidental authority amplification.

Disposition: covered by provider semantic mismatch, capability negotiation, authority non-amplification, compatibility-direction and revision-vector families.

Owners: Provider/Binding + Authorization + Security/Recovery + external-system/site owner.

Detection route: provider/profile/version capability contract, operation-class diff, unsupported/narrowed/broadened scope report, authority requalification.

Proof obligation: failover/recovery must prove operation-class compatibility; read/provision/broker authority must never silently widen into door/gate/HVAC/media/control actuation.

### 3.6 Session/connection recovery preserves stale authority

Attack: transport recovers and a provider session survives or is rebound while canonical user authority, site membership, incident quarantine or credential status changed. OPC UA's separation between SecureChannel and Session provides a concrete witness that reconnectable session state can outlive a transport break.

Candidate classes: stale session, partial deprovision, provider identity mismatch.

Disposition: existing authentication-currentness, revocation propagation, residual-session and temporal-authority families cover the class.

Owners: Identity/Authn + Authorization + Security/Recovery + Provider/Binding.

Detection route: session creation/last-auth time, current credential/user status, authority revision, provider-side session inventory, incident/quarantine epoch.

Proof obligation: connection/session continuity is not authorization continuity; post-recovery use requires current authority/profile qualification when policy demands it.

### 3.7 Event-buffer recovery fabricates physical truth

Attack: offline edge/VMS/BMS/access/PDV buffers replay late or out of order after recovery; gaps, duplicate events, clock skew or truncated buffers are projected as exact physical chronology. Workflow/process reconstruction may then infer causality or completion incorrectly.

Candidate classes: `FALSE_PROCESS_RECONSTRUCTION`, provenance break, historical reinterpretation.

Disposition: existing event-order/currentness, observability-coverage, provenance-overattribution, temporal/historical and process-mining/causal non-strengthening families cover the class.

Owners: Messaging/Integration + Observability + Security/Recovery + process/domain owner.

Detection route: event source/sequence/watermark, gap/overflow markers, clock qualification, replay epoch, producing provider/profile revision, provenance lineage.

Proof obligation: replayed event chronology remains evidence with declared gaps/order guarantees; it cannot establish physical causality, intended process or authority without additional evidence.

### 3.8 Brownfield recovery resurrects unsupported or hidden artifacts

Attack: migration/recovery restores visible rows/files while missing hidden spreadsheet formulas/macros/external links, inaccessible Drive artifacts, provider-native ACL details, tombstones or historical mappings. Count parity falsely claims complete restoration.

Candidate classes: `SILENT_DATA_LOSS`, `UNSUPPORTED_ARTIFACT_SILENT_DROP`, `PROVENANCE_BREAK`, `PERMISSION_BROADENING`.

Disposition: existing brownfield no-silent-loss, evidence completeness, permission-equivalence, provenance and historical-integrity families cover the class.

Owners: Data/Storage + Security/Recovery + Privacy/Governance + migration/source owner.

Detection route: source coverage manifest, unsupported-content report, permission/ACL delta, lineage completeness, tombstone/referential checks and post-cutover divergence detection.

Proof obligation: migration/restore completion requires explicit unsupported-content accounting and semantic reconciliation; record counts/checksums alone cannot prove business or permission equivalence.

## 4. Formal-assurance attacks

The priority graph/workflow hypothesis was re-exercised under recovery and physical integration boundaries:

- `ExecutionEnvelope` restored from an old cut can carry stale provider/site/authority bindings;
- a model may be sound while a required external revoke remains `UNKNOWN`;
- a terminal workflow state can coexist with residual provider sessions, offline-controller caches or missing event pages;
- journal hash/Merkle integrity can prove the preserved journal horizon while omitted provider-console activity, truncation or split-view telemetry remains outside that proof;
- child/peer proof from a specialized external system may prove only its local revision/effect domain, not canonical authority or end-to-end physical convergence;
- failover/retry loops can be structurally bounded but operationally unstable when provider rate limits, offline replay and reconciliation arrivals exceed service rate;
- recovery graph transformation can preserve visual shape while changing tenant/site/resource mapping or operation class, invalidating prior proofs;
- AI/low-code incident automation can strengthen weak evidence by treating `provider accepted`, `session recovered` or `last sync successful` as `effective/revoked/safe`.

No candidate survived duplicate-screen as a distinct 125th reusable ConflictPattern.

## 5. Processual/semantic conflict screen

All 16 required conflict families were screened. Especially material compositions include:

- two locally valid recovery owners issuing incompatible provider mutations;
- restored canonical membership conflicting with later provider-side revoke;
- security failover selecting a provider/profile whose nominal role maps to broader physical operations;
- incident runbook requiring immediate revocation while provider/offline capacity cannot meet the deadline;
- legal/privacy retention limiting recovery evidence while security demands investigation continuity;
- operator vendor-console emergency change racing with canonical recovery automation;
- AI inference declaring root cause or safe restoration from correlation/event chronology alone.

`ConflictSignal` remains evidence only. Examples: residual grant detected, stale session, pagination gap, unexpected access event or scope mismatch can signal a candidate conflict; confirmation requires owner-qualified current evidence.

## 6. Planning C/D/E and Architecture Reconciliation proof obligations

Carry forward without materializing architecture:

1. **Physical-integration recovery boundary proof** — operation classes explicitly distinguish observe/read/event/provision/broker from exceptional actuation; recovery/failover cannot widen authority.
2. **External identity/grant recovery proof** — bind canonical subject, provider/tenant/site/resource namespace, mapping revision, requested/acknowledged/effective state and currentness.
3. **Revoke/deprovision convergence proof** — include residual grants, sessions, credentials and offline caches; `PARTIAL/UNKNOWN` blocks false completion.
4. **Reconcile-before-retry proof** — ambiguous mutating effects require operation-qualified idempotency or provider reconciliation before replay.
5. **Cross-tenant/site isolation proof** — fail restore/substitution when namespace/mapping evidence is ambiguous rather than guessing identity/resource continuity.
6. **Provider capability/profile proof** — bind provider/profile/version and explicit unsupported/broadened/narrowed scope report.
7. **Recovery evidence coverage proof** — inventory pagination, checkpoint, event-gap/overflow, queue backlog and observation horizon qualify negative/complete claims.
8. **Historical non-rewrite proof** — recovery from cut `R` preserves historical evidence but separately evaluates current authority/provider state.
9. **Tamper-evident journal boundary proof** — journal commitment proves integrity/completeness only for its declared horizon/sources; missing provider-console/offline evidence remains explicit.
10. **Federated child/peer proof composition** — specialized provider proof does not self-promote into canonical authority, physical outcome or parent workflow completion.
11. **Brownfield no-silent-loss recovery proof** — source coverage manifest, unsupported artifacts, ACL/permission deltas, lineage and tombstones are explicit.
12. **Capacity-qualified security recovery proof** — revoke/reconcile/event backlogs expose age/coverage; healthy average utilization is not sustainable-capacity proof.
13. **Decision/uncertainty/causal discipline** — human/rule/AI decisions, confidence, probability, bounded uncertainty and causal analysis retain their result kinds and explicit owners.
14. **Planning E adversarial corpus** — include stale grant after restore, partial revoke with offline cache, cross-site ID reuse, provider-profile scope widening, recovered session with revoked authority, incomplete event replay, unsupported brownfield artifact and external `UNKNOWN` preventing false completion.

## 7. Preventive-invariant disposition

No new preventive invariant is elevated. Existing universal candidates remain sufficient:

- degraded/recovery modes must not amplify authority;
- current canonical/provider qualification must not be inferred from historical restore success;
- `UNKNOWN` external mutations require reconciliation before unsafe retry or stronger completion claims;
- residual provider/session/grant cohorts remain explicit until disposition is proven;
- external integration visibility/configuration must not silently become physical actuation authority;
- proof domains remain non-strengthening.

## 8. Saturation disposition

Duplicate-screen against all **124** reusable ConflictPatterns found no materially new local edge scenario, cross-capability scenario or reusable conflict family.

- new local edge scenarios: **0**;
- new cross-capability edge IDs: **0**;
- new reusable ConflictPatterns: **0**;
- new ConflictInstances: **0**;
- preventive invariant candidates adopted: **0**;
- Security local no-material streak: **preserve 2 (capped; no inflation)**;
- mandatory-cluster streaks: **unchanged, all 12 remain capped at 2**;
- material inventory: **284 edge scenarios + 124 ConflictPatterns = 408**;
- HIGH/CRITICAL without owner/proof/detection route: **0**;
- Full Pass 7 capability coverage after revisit: **19/28**;
- mandatory cluster coverage: **12/12**;
- completed full passes: **6/8 minimum**;
- negative-space review: **NOT_STARTED**;
- saturation: **NOT_SATURATED**;
- Planning C: **BLOCKED**.

## 9. Next rotation

Continue only Full Pass 7 with **Enterprise Trust / PKI / Certificate Lifecycle**. Carry all standing formal-assurance, temporal/provenance/decision/units/vector/uncertainty/graph-revision/queue-capacity/causal and Legacy Mirroring lenses plus the bounded Physical/Peripheral integration-plane boundary into trust recovery: provider/device/client certificate identity versus canonical subject/site; key/certificate/anchor validity across incident and restore cuts; revoked or rotated credentials surviving offline controllers/devices; trust-store rollback; split-view revocation/currentness; provider/profile substitution changing certificate/security requirements; federated proof signatures across rotation/recovery; biometric/device enrollment evidence; emergency vendor-console trust changes; cross-tenant/site trust-anchor leakage; and AI/low-code actions that broaden trust or infer authorization from certificate validity. Trust streak is already capped at 2; do not inflate absent material novelty. Do not enter Planning C.