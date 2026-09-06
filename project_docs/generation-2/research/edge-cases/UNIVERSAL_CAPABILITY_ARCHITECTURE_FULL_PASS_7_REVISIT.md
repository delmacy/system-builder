# Generation 2 — Universal Capability Architecture — Full Pass 7 Revisit

Status: ACTIVE — ELIGIBLE NO-NEW-MATERIAL REVISIT
Phase: `RESEARCH_ADVERSARIAL_EDGE_CASE_SATURATION`
Capability: Universal Capability Architecture (UCA)
Pass: 7
Authority: `RESEARCH_PIPELINE_STATE.json`, `ADVERSARIAL_SATURATION_STATE.json`, `UNIVERSAL_CAPABILITY_ARCHITECTURE_EDGE_CASE_REGISTER.md`, `POST_MATH_ADVERSARIAL_EDGE_CASE_SATURATION_RESEARCH.md`, `PROCESSUAL_SEMANTIC_CONFLICT_CLASSIFICATION.md`, `SEMANTIC_GRAPH_FEDERATION_SOUNDNESS_EXECUTION_PROOF_RESEARCH.md`, and `EDGE_PHYSICAL_FLEET_SITE_OPERATIONS_RESEARCH.md`.

Research only. No product code, Work Package, TASK, Construction, GraphDB implementation, Fleet control plane, global IR implementation, direct-device control plane, automatic remediation or concrete conflict correction is authorized. Preserve `ConflictPattern != ConflictInstance`, `Signal != ConfirmedConflict`, `Research != remediation`, `external provider state != canonical authority != actual physical/media access success`, and `Fleet visibility != remote actuation authority`.

## 1. Revisit method

Full Pass 7 carried all previously active research fronts plus the refined Physical Systems / IoT / Edge / Peripheral Integration scope into UCA. The adversarial method used semantic-identity permutations and governance-plane/control-plane separation rather than assuming a universal physical-device abstraction:

1. permuted `CanonicalCapabilityRef -> CapabilityUse -> ProviderBinding -> ExternalResource/Account -> Build/Deployment -> Invocation/Event` identities and tested whether any provider-native identifier could silently become canonical truth;
2. separated semantic, build, deployment, provider, site/physical, runtime, local-evidence, exported-telemetry and Fleet topologies;
3. tested time-qualified user/account/role/group/resource grants, revocations and provider capability support across stale/offline connector cohorts;
4. challenged external permission synchronization with `APPLIED / NOT_APPLIED / PARTIAL / UNKNOWN`, delayed reads, event gaps and provider-side drift;
5. tested camera/VMS, access-control, BMS/HVAC, PDV and biometric integration under the bounded integration/governance-plane posture, preserving the specialized system as media/control plane by default;
6. challenged identity replacement/rebinding, duplicate external accounts, unsupported scopes, provider API/profile drift, connector replacement and residual external resources;
7. tested whether a generic UCA operation such as `grant`, `invoke`, `read`, `provision` or `sync` could accidentally strengthen into physical actuation authority merely because a provider exposes such an operation;
8. carried temporal/currentness, provenance, decision/calculation/workflow kind, units/vectors/uncertainty, queue/capacity, graph-revision, causal non-strengthening and bounded Legacy Mirroring/Brownfield Assimilation through each permutation.

All 124 reusable ConflictPatterns were duplicate-screened before accepting novelty.

## 2. Evidence refresh

Fresh external evidence supports the bounded integration/governance-plane interpretation without requiring a new UCA-owned primitive.

- RFC 7644 SCIM defines portable User/Group provisioning operations while explicitly allowing a service provider to interpret resource state differently from the submitted representation. PATCH is atomic per resource, bulk operations can contain per-operation outcomes, provider resource versions can qualify updates, and provider IDs remain provider-side identities. This supports `canonical desired identity/permission != provider resource representation/effective state` and reconciliation rather than silent equivalence.
- ONVIF Profile A explicitly covers access-control configuration such as granting/revoking credentials, schedules and access rules, while Profile C covers door access/event management and Profile D includes peripheral credential input and actuation interfaces. The existence of these provider operations demonstrates why feature support and operation class must be qualified: a governance-plane integration may use provisioning/configuration/read/event surfaces without inheriting unrestricted physical actuation authority.
- OPC UA separates authentication from authorization, allows role-to-node permissions and application/endpoint restrictions, and permits centralized authorization management while retaining server/application-specific permission semantics. A shared role label therefore does not prove identical permission scope across providers, nodes, applications or sites.
- NIST SP 800-82 Rev. 3 treats OT as systems interacting with physical processes and emphasizes performance, reliability and safety requirements. This supports retaining specialized control-system ownership and treating generic integration/control expansion as an explicit high-risk decision rather than a default UCA consequence.

Portable conclusion: UCA may describe a typed capability/use/binding relationship, but external integration semantics remain operation-, provider-, revision-, site-, authority- and currentness-qualified. `supports access control` or `supports write/execute` is not a portable grant of control authority.

## 3. Adversarial candidates and duplicate-screen

### A — provider grant acknowledged while effective physical/media access remains unknown

Activation: a connector receives success for account/role/resource grant, while downstream VMS/controller caches, sessions, offline devices or local policy have not been observed converged. Incompatible claims: `provider API accepted desired grant` versus `subject can/cannot actually access the physical/media resource now`. Detection candidates: provider resource reread/version, session/token currentness, device/controller reconciliation, event/audit evidence. Owners: Integration/Provider Binding + Identity/Authorization + specialized-system owner. Severity HIGH depending on resource; blast radius user/resource/site; currentness mixed; reversibility bounded before consequential use. Future route: preserve staged effect/evidence and reconcile. Duplicate families: provider acknowledgement versus canonical effect, partial/unknown effect, false convergence, evidence currentness. No new ConflictPattern.

### B — revoke/deprovision succeeds centrally but residual provider/session/device cohort remains effective

Activation: user disable/delete or grant revoke is acknowledged while existing sessions, cached credentials, offline controllers, duplicated accounts or provider-local mappings remain. Incompatible claims: `revoked in canonical/governance plane` versus `all external access paths are ineffective`. Detection candidates: residual-account/resource inventory, session/token expiry/currentness, controller/device sync state, provider event/audit gaps. Owners: Authorization + Integration/Provider + specialized-system owner. Severity HIGH–CRITICAL for sensitive sites. Future route: explicit residual-cohort reconciliation and bounded currentness claims. Duplicate families: residual cohort, authority currentness, false convergence/rollback, provider drift. No new ConflictPattern.

### C — generic capability label silently expands governance integration into physical actuation

Activation: a provider exposes read/configure/grant plus open/close/write/execute operations under one product/profile or broad credential; a low-code/AI composition binds a generic `control` or `invoke` operation without explicit high-risk authority semantics. Incompatible claims: `connector is authorized to integrate/manage permissions` versus `connector is authorized to cause direct physical effect`. Detection candidates: operation-class taxonomy, provider capability matrix, explicit site/resource/authority scope, control-plane boundary, pre-execution policy. Owners: UCA semantic operation owner + Authorization/Policy + Integration/Provider + physical-system owner. Severity CRITICAL; misuse plausible; physical effects may be irreversible. Future route: route any concrete actuation proposal to explicit Planning C decision/proof; research does not create a control capability. Duplicate families: authority non-amplification, provider semantic mismatch, compatibility direction, AI/low-code composition, confused deputy. No new ConflictPattern.

### D — external resource replacement inherits old canonical binding

Activation: camera/controller/terminal/gateway/account is replaced or recreated and provider ID/name/site alias is reused or inferred. Incompatible claims: `same provider label/slot` versus `same canonical subject/resource/trust/attachment`. Detection candidates: adoption/commissioning evidence, external identity/version, physical/site attachment, trust/config revision. Owners: Identity/Binding + Integration + site/specialized-system owner. Severity HIGH–CRITICAL. Future route: explicit rebinding/reconciliation. Duplicate families: false entity convergence, identity drift, provider substitution, semantic ownership. No new ConflictPattern.

### E — unsupported permission scope is silently dropped

Activation: canonical desired policy contains site/group/resource/schedule dimensions that a provider/profile cannot represent; connector maps the representable subset and reports generic success. Incompatible claims: `desired permission synchronized` versus `provider realization omitted a material constraint`. Detection candidates: provider capability matrix, mapping completeness, unsupported-scope diagnostics, post-write reread/semantic diff. Owners: Authorization semantic owner + Integration/Provider Binding. Severity HIGH; blast radius resource/site/tenant; misuse plausible during provider substitution. Future route: explicit unsupported/partial disposition; no silent drop. Duplicate families: provider semantic-support mismatch, compatibility direction, qualified-claim weakening, partial effect. No new ConflictPattern.

### F — event/read projection is treated as current physical truth or authority

Activation: delayed/gapped VMS/access/BMS/PDV event or status is consumed as current physical state or as permission to act. Incompatible claims: `last observed external state/event` versus `current physical/media/business truth` or `authority`. Detection candidates: source timestamp, ingest timestamp, expected cadence/gap, provider/site health, local evidence. Owners: specialized-system owner + Integration + Observability. Severity HIGH–CRITICAL depending on downstream action. Future route: preserve source/currentness/provenance and non-authority. Duplicate families: evidence currentness, runtime-versus-projection, proof-claim conflation. No new ConflictPattern.

## 4. UCA hypothesis pressure

The refined physical integration scope strengthens boundaries rather than promoting a new canonical capability.

Surviving research constraints:

- `CapabilityDefinition != CapabilityUse/Invocation != ProviderBinding != ExternalResourceRealization`;
- `external account/resource/provider state != canonical identity/authority`;
- `provider acknowledgement != effective specialized-system state != physical/media access success`;
- semantic topology != provider topology != site/physical topology != build/deployment/runtime topology;
- local specialized-system/runtime evidence remains necessary for local truth; exported Fleet evidence is a delayed projection;
- provider capability support is operation-specific and revision-qualified; unsupported scope must be explicit;
- identity/permission synchronization requires residual-cohort and drift semantics;
- physical/media control authority is not inherited from generic integration, visibility, provider credentials or capability labels;
- VMS/access-controller/BMS/PDV/device-management suites remain specialized control/media planes by default;
- edge/site gateways remain optional locality/protocol/offline-buffering providers, not mandatory central controllers;
- biometrics remain provider-side enrollment/matching/reference integrations by default; central raw template/image ownership is not implied;
- GraphDB remains optional/provider-level; no finding requires graph storage as canonical runtime authority.

No 29th capability, physical-control primitive or architecture consequence is promoted in this revisit.

## 5. Other mandatory fronts

Temporal graph qualification remains necessary for permission/provider/schema/profile availability and in-flight revisions. Provenance/lineage must preserve source and currentness but does not create authority or causal proof. Decision/calculation/workflow remain distinct semantic kinds. Units/vectors/uncertainty remain typed and non-scalar by default. Queue/capacity pressure applies to provisioning, reconciliation, event ingestion and reconnect bursts; current utilization does not prove sustainable synchronization capacity. Graph transformation/revision must expose invalidated provider/resource bindings and residual cohorts. Causal/counterfactual analysis remains research-only. Legacy/brownfield imported users/resources/permissions remain evidence requiring owner-qualified adoption rather than canonical truth by import.

## 6. Saturation disposition

- new local edge IDs: **0**;
- new cross-edge IDs: **0**;
- new reusable ConflictPatterns: **0**;
- new ConflictInstances: **0**;
- new preventive invariants: **0**;
- bounded Planning-A backfill: **0**;
- material findings inventory: **408 = 284 edge scenarios + 124 ConflictPatterns**;
- UCA local no-material streak: **0 -> 1**;
- mandatory cluster streaks: unchanged/capped at **2**;
- HIGH/CRITICAL without owner/proof/detection route: **0**;
- negative-space: `NOT_STARTED`;
- saturation: `NOT_SATURATED`;
- Planning C: **BLOCKED**.

This is an eligible no-new-material revisit. It does not claim absence of bugs or conflicts.

## 7. Next rotation

Continue only Full Pass 7 with **UI / Generated Experience / Low-code Builder**. Carry the refined integration/governance-plane boundary into explicit client/site/external-system context, external user/role/resource mapping, permission-sync/drift state, source/currentness/provenance, provider capability matrix, unsupported-scope diagnostics, reconciliation queues and explicit separation between read/provision/broker operations and exceptional physical actuation. Challenge Canvas/Graph Explorer and AI/low-code composition against stale projections, false provider equivalence, cross-tenant/site target confusion, lineage over-attribution, silent scalarization/determinization, queue/capacity false stability and accidental strengthening of integration into control authority. Duplicate-screen all **124 ConflictPatterns**. UI streak is already 2 and must remain capped absent material novelty. Do not enter Planning C.