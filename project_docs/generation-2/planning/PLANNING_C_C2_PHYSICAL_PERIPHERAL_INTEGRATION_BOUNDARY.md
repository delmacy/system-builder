# Generation 2 — Planning C C2: Physical / Peripheral Integration Boundary

Status: **DECIDED / C2 COMPLETE**  
Phase: `PLANNING_C_TARGET_ARCHITECTURE`  
Decision scope: Physical / Peripheral Integration boundary only.  
Entry branch head revalidated before persistence: `0921b4015e23525303421b32f44850aab3832c77`.

This record decides the target architecture boundary for specialized physical/peripheral systems. It does not execute C3, Planning D/E, Architecture Reconciliation, WBS, Work Packages, executive TASKs, Construction or product code.

## 1. Authorities and inherited constraints

Authoritative inputs:

- `RESEARCH_PIPELINE_STATE.json` — C2 is the authorized next decision;
- `PLANNING_C_TARGET_ARCHITECTURE_ENTRY_FRAMEWORK.md`;
- `PLANNING_C_C0_UNIVERSAL_CAPABILITY_ARCHITECTURE_SEMANTIC_SUBSTRATE.md`;
- `PLANNING_C_C1_ELICITATION_SYSTEM_UNDERSTANDING_ARCHITECTURE.md`;
- `PHYSICAL_PERIPHERAL_OPERATIONS_INTEGRATION_PLANE_BOUNDARY.md`;
- inherited adversarial inventory: 284 edge scenarios + 124 reusable `ConflictPattern`s = 408 material findings.

Standing invariants remain mandatory:

- `Research != remediation`;
- `ConflictPattern != ConflictInstance`;
- `Signal != ConfirmedConflict`;
- `provider reported state != physical truth`;
- `last reported state != current physical truth`;
- `local evidence != exported telemetry != Fleet aggregate != control authority`;
- `visibility != authority`;
- `provisioning capability != actuation capability`;
- `AI inference = candidate`, never authority.

## 2. C2 decision summary

Planning C adopts a **bounded Physical / Peripheral Integration and Governance Plane**.

System Builder owns portable semantic integration concerns: external-system inventory and bindings, scoped identity/resource/grant/site mappings, provider qualification, read/query/status/event/telemetry ingestion, provisioning/deprovisioning where explicitly supported, drift detection, reconciliation, provenance/currentness, operability and policy/governance projections.

Specialized external systems remain the default media/control/runtime planes for physical-domain mechanics. Examples include VMS, access-control systems, BMS/HVAC controllers, PDV/payment/fiscal terminal platforms, industrial/device-management systems and biometric matching/template systems.

C2 explicitly **does not admit a generic direct physical actuation capability into Generation 2**. Direct physical actuation is not inherited from Integration, Provider/Binding, Workflow, AI/low-code, Fleet visibility or external-resource discovery.

Provider-/domain-specific externally executed operations may be represented only as explicit specialized operation classes when a provider contract already exposes them, but such representation does not create a canonical generic actuation capability. Any future proposal for a first-class actuation capability requires an explicit later architecture/taxonomy decision with separate safety, authority, hazard, locality, currentness and proof obligations.

## 3. C2-DEC-001 — Specialized physical systems remain external control/media planes by default

**Decision:** DECIDED.

System Builder is not the default replacement for specialized control/media platforms.

Portable ownership is limited to semantic integration, governance, lifecycle, evidence and reconciliation. Domain-specialized mechanics remain external, including where applicable:

- video streaming, codecs, recording and media retention;
- access-controller low-level operation;
- BMS/HVAC closed-loop control and controller-local setpoint mechanics;
- fiscal/payment-terminal execution;
- industrial motion/control loops;
- biometric matching/template-processing mechanics;
- device firmware/control functions whose semantics are provider/domain specific.

A provider may expose these mechanics, but provider exposure does not make them portable System Builder semantics.

## 4. C2-DEC-002 — Canonical model distinguishes semantic capability, external system, device class and device instance

**Decision:** DECIDED.

C2 requires distinct identities for at least:

- canonical semantic capability/reference;
- `ExternalSpecializedSystem` / external control plane;
- provider/binding/profile revision;
- `DeviceClass` or resource class;
- `DeviceInstance` / external resource realization;
- client/tenant/site context;
- external account/user/subject/resource/grant/group identifiers;
- connector/edge-gateway realization where present.

A device class is a semantic description of a kind of external resource. A device instance is a provider/site-qualified realization. Provider-local identifiers never become canonical identities without an explicit mapping.

Mappings are revisioned, provenance-qualified and scoped by provider/tenant/client/site as required. Display names, usernames, e-mail addresses, aliases or raw numeric IDs are not sufficient cross-provider/cross-site identity.

## 5. C2-DEC-003 — Provider adapter, protocol and edge gateway are realization layers, not semantic owners

**Decision:** DECIDED.

Provider adapters, protocol bridges and edge/site gateways translate portable semantics into provider/domain mechanics and translate provider observations back into qualified evidence.

They do not own canonical business meaning and cannot strengthen authority.

An edge gateway may provide locality-sensitive transport, protocol conversion, buffering/store-and-forward, credential isolation, site-local discovery and offline evidence retention. It is **not** a central device controller by default and does not create global/Fleet actuation authority.

Provider-specific extensions remain namespaced and explicitly qualified. Portable clients must be able to distinguish portable semantics from provider-only operations/fields.

## 6. C2-DEC-004 — External identity, account, subject, resource, grant and site mappings are explicit semantic objects

**Decision:** DECIDED.

The architecture must preserve explicit mapping relationships rather than copying external identifiers into canonical identity fields.

Relevant mapping subjects include:

- external account ↔ canonical principal/organization;
- external user/subject ↔ canonical subject;
- external group/role/grant ↔ canonical authority/policy reference where equivalence is actually established;
- external resource/device ↔ canonical resource reference;
- provider tenant/domain ↔ client/tenant context;
- provider site/location ↔ canonical site context.

External role/group/grant labels are provider evidence, not canonical permission semantics. Shared external accounts or shared infrastructure require explicit scoped governance; they never imply shared truth or authority.

## 7. C2-DEC-005 — Read/query/event/telemetry state is qualified evidence, never physical truth

**Decision:** DECIDED.

Provider observations must carry source, provider/binding/profile revision, subject/resource/site scope, event/observation time, ingestion time, currentness/freshness, completeness qualification and evidence lineage where applicable.

The architecture preserves distinctions among:

- last successful observation;
- current provider-reported state;
- inferred state;
- canonical desired state;
- provider-accepted request;
- provider-observed effective state;
- actual physical state/effect, which may remain unknown unless independently evidenced.

Pagination, filtering, event gaps, unsupported provider scopes, out-of-order delivery, offline buffering and stale caches can produce `PARTIAL` or `UNKNOWN`. Absence from one provider response is not proof of physical absence or canonical deletion.

Fleet/global views are qualified aggregations of evidence and may never promote themselves into omniscient physical truth or actuation authority.

## 8. C2-DEC-006 — Provisioning/deprovisioning is governed lifecycle integration, distinct from physical actuation

**Decision:** DECIDED.

Where a provider contract supports identity/resource/grant provisioning, System Builder may express and track lifecycle intent through the integration plane.

Lifecycle state must distinguish at least, when applicable:

`REQUESTED -> ACCEPTED/REJECTED -> APPLIED/NOT_APPLIED/PARTIAL/UNKNOWN -> OBSERVED -> RECONCILED`.

Deprovision/revoke requires equivalent evidence and may not be declared converged merely because an API request succeeded.

Retry/idempotency, provider quotas, backlog, residual grants/sessions, rate limits, timeout/`UNKNOWN`, pagination/checkpoints and reconciliation are first-class operability concerns.

Provisioning a user, credential reference, schedule, grant or resource configuration does not imply authority to trigger a physical action.

## 9. C2-DEC-007 — Source-of-truth is declared per semantic concern; no single physical truth store is assumed

**Decision:** DECIDED.

C2 rejects a universal source-of-truth claim for physical integrations.

Examples:

- canonical identity/policy intent may be System Builder-owned;
- provider-native device existence/configuration may be provider-owned;
- site-local observations may be edge/local evidence;
- physical/media outcome may remain provider/domain-observed or independently evidenced;
- Fleet is a projection/coordination surface, not an automatic truth owner.

Each integration contract must declare source-of-truth by semantic concern and define reconciliation direction where bidirectional drift is possible.

Brownfield discovery remains evidence/candidate state until a semantic owner maps/adopts it.

## 10. C2-DEC-008 — Offline/local evidence remains locally authoritative only for its bounded observation domain

**Decision:** DECIDED.

Site-local runtime/gateway operation may continue during central disconnection where the provider/local system permits it. Locally recorded events, checkpoints and observations retain their own provenance and observation time.

When connectivity returns, reconciliation must not rewrite history into a false monotonic narrative. Late, duplicate, conflicting or superseded observations remain qualified.

Central absence of telemetry does not mean local failure; local success does not prove Fleet-wide convergence; Fleet green status does not prove site/device physical state.

## 11. C2-DEC-009 — Provider-specific extensions are explicit and cannot contaminate portable semantics

**Decision:** DECIDED.

Each provider/binding may expose a qualified capability matrix/profile. Unsupported operations, semantics, limits and evidence quality remain explicit.

Provider-only fields/operations are namespaced extensions with version/profile identity. A provider-specific feature may be consumed by an application only through an explicit dependency on that extension.

Substitution/migration must not silently downgrade or reinterpret semantics. Planning D must later order coexistence and migration around these qualification boundaries.

## 12. C2-DEC-010 — Direct physical actuation is explicitly NOT a generic Generation 2 capability

**Decision:** DECIDED — **NO GENERIC DIRECT PHYSICAL ACTUATION CAPABILITY ADMITTED**.

Generic Integration, Provider/Binding, Workflow, AI/low-code, Fleet, Authorization or resource visibility does not grant authority to actuate doors, gates, HVAC setpoints, industrial devices, cameras, terminals or other physical systems.

If an external provider already exposes an operation that can cause a physical effect, Generation 2 may model it only as a **provider-/domain-qualified external operation** with explicit operation class. Before execution can ever be considered valid, the future target capability record/proof route must make explicit:

- requesting actor and authority source;
- client/tenant/site/device scope;
- provider/binding/profile revision;
- operation semantics and provider support;
- safety/hazard/interlock prerequisites where domain-relevant;
- stale-state/currentness constraints;
- timeout/retry/idempotency and `UNKNOWN` effect semantics;
- human confirmation/four-eyes/break-glass constraints where policy requires;
- local/offline behavior;
- audit/provenance and evidence of provider acknowledgement;
- independent qualification of physical effect when that claim matters;
- rollback/compensation limits, including irreversible effects.

Such an operation remains an externally executed specialized effect. It does not establish a reusable central physical-control plane.

Any future proposal to add a first-class canonical actuation capability must go through explicit taxonomy/architecture reconciliation; C2 does not pre-authorize it.

## 13. C2-DEC-011 — Physical/Peripheral Elicitation Lens and Production Readiness Coverage are mandatory consumers of C1

**Decision:** DECIDED.

Physical/peripheral integrations must consume the C1 EKB model rather than inventing a separate questionnaire/truth store.

The capability lens must elicit, where applicable:

- business purpose and non-goals;
- specialized-system owner/operator;
- client/tenant/site boundaries;
- resource/device classes and instances;
- identity/grant/site mappings;
- provider source-of-truth and reconciliation direction;
- read/query/event/telemetry semantics and evidence currentness;
- pagination/inventory completeness;
- provisioning/revocation convergence;
- offline/local operation;
- SLO/SLA, latency, queues/backlog, retry/idempotency, quotas and headroom;
- failure/recovery/reconciliation ownership and escalation;
- security/privacy/retention, especially video/biometric/access/location evidence;
- provider-version/profile change;
- operation classes and explicit actuation exclusion or specialized obligations;
- acceptance/product-proof evidence.

A positive answer such as “the camera is integrated” or “the access system works” cannot close coverage without identifying which operation classes, evidence populations, provider/site/revision and readiness dimensions were actually proven.

## 14. C2-DEC-012 — Security, privacy and authority remain owner-preserving cross-capability concerns

**Decision:** DECIDED.

C2 does not create duplicate security/privacy/authorization owners.

Physical integration references canonical owners for identity, authorization/policy, privacy/data governance, secrets/configuration, observability, governance/audit and provider/binding semantics.

Particularly sensitive media/biometric/access/location payloads should be minimized in Fleet/global projections. Raw media and biometric templates are not central System Builder defaults.

Visibility of an external resource does not imply read access to sensitive payloads, and read access does not imply mutation/actuation authority.

## 15. C2-DEC-013 — Operability is multidimensional; connector health is not convergence

**Decision:** DECIDED.

The integration plane must be able to represent, where applicable:

- connector/provider dependency health;
- last successful sync and sync age;
- inventory/pagination completeness;
- event gap/backlog age;
- expected/peak load;
- queue depth/age, retry amplification and effective service rate;
- provider quotas/rate limits;
- oldest unresolved provisioning/revoke item;
- residual grants/sessions/resources;
- reconciliation lag;
- local/offline backlog and retention;
- evidence currentness;
- owner/escalation/on-call route;
- cost/usage where material.

No scalar health score may hide a critical stale revoke, missing site, unsupported operation or `UNKNOWN` external effect.

## 16. Alternatives considered

### A. System Builder as universal physical control plane

**Rejected.** It collapses specialized control/media domains into generic Integration, amplifies authority, weakens provider qualification and would require safety/real-time/domain mechanics outside the established Generation 2 boundary.

### B. Observation-only integration with no provisioning/reconciliation

**Rejected as too narrow.** Research supports governed provisioning/deprovisioning, mapping, drift detection and reconciliation where providers explicitly support those contracts.

### C. Provider-first model where external suites own all semantics

**Rejected.** It creates lock-in and prevents portable identity/policy/lifecycle/governance semantics.

### D. Bounded integration/governance plane with specialized external control planes

**Chosen.** It preserves portable semantics and owner boundaries while allowing rich external-system integration without pretending to replace specialist platforms.

## 17. Semantic owners and affected capabilities

Primary target owners/references include:

- Integration / interoperability semantics;
- Provider / Binding / Capability Negotiation;
- Identity;
- Authorization / Policy / Organization / Multitenancy;
- Secrets / Configuration / Environment Portability;
- Notifications / Events / Messaging where event ingestion is used;
- Observability;
- Governance / Compliance / Audit;
- Privacy / Data Governance;
- Deployment / Runtime / Autonomous Operation and Fleet/local evidence boundaries;
- Elicitation/System Understanding as cross-cutting infrastructure from C1.

No new canonical capability is created by C2.

## 18. Planning D migration constraints carried forward

Planning D must later account for, without implementation in C2:

- coexistence of free-form/current integrations with structured external-system/resource/mapping evidence;
- provider adapter/profile qualification and version migration;
- incremental canonical identity/resource/grant/site mapping;
- provenance/currentness backfill limits;
- local/edge/offline evidence coexistence;
- reconciliation introduction without assuming existing provider data is complete/current;
- explicit provider extensions and unsupported-operation handling;
- no migration shortcut that interprets existing remote-control integrations as generic canonical actuation authority.

## 19. Planning E product-proof obligations carried forward

Planning E must later define proofs for at least:

- no cross-client/site identity/resource/grant leakage;
- provider/local/Fleet evidence qualification and currentness;
- incomplete pagination/event populations producing `PARTIAL/UNKNOWN` rather than false absence;
- provisioning/deprovisioning/revoke convergence and residual-cohort detection;
- provider substitution/version/profile qualification without semantic downgrade;
- offline/local buffering and reconciliation without history erasure;
- connector health not masquerading as business/access convergence;
- provider reported state not masquerading as physical truth;
- read/observe/provision visibility not amplifying into actuation authority;
- AI/low-code unable to infer actuation authority from discoverability;
- specialized provider operation, if used, proving operation-class authority/safety/evidence obligations explicitly;
- Production Readiness Coverage remaining separate from feature completeness.

## 20. C2 disposition

- Decision status: **DECIDED / PASS FOR C2**.
- Target pattern: **bounded Physical / Peripheral Integration and Governance Plane**.
- Generic direct physical actuation capability: **NOT ADMITTED**.
- Specialized provider/domain operation class: **allowed only as explicit, qualified external operation; does not create generic actuation authority**.
- Specialized VMS/BMS/access/PDV/industrial/biometric systems: **remain external media/control/runtime planes by default**.
- New canonical capability: **0**.
- ConflictInstances created: **0**.
- Research findings remediated: **0**.
- Product code / Construction / Work Packages / executive TASKs: **0**.
- Architecture-level blocker discovered in C2: **none**.

C2 is complete. The next Planning C stage is C3 canonical capability target architecture, but C3 is intentionally not executed in this action.