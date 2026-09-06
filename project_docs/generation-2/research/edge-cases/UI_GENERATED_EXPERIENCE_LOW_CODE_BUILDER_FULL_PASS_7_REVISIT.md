# Generation 2 — UI / Generated Experience / Low-code Builder — Full Pass 7 Revisit

Status: ELIGIBLE NO-NEW-MATERIAL REVISIT
Phase: `RESEARCH_ADVERSARIAL_EDGE_CASE_SATURATION`
Capability: UI / Generated Experience / Low-code Builder
Pass: 7

Research only. No product code, Work Package, TASK, Construction, GraphDB implementation, Canvas implementation, physical-control implementation, remediation or concrete conflict correction is authorized. Preserve `Research != remediation`, `ConflictPattern != ConflictInstance`, `Signal != ConfirmedConflict`.

## Method

This revisit used an explicit Physical Systems/IoT/Edge/Peripheral Integration projection lens in addition to the standing Typed Semantic Graph, ExecutionEnvelope/State/Journal, federation, control-flow, analytical/vector, soundness/proof, temporal, provenance, decision, units, uncertainty, graph-revision and bounded Legacy Mirroring lenses.

The principal attack was projection-strengthening: determine whether a UI/Canvas/AI composition can turn provider-reported capability, user/account mapping, role/grant state, device inventory, telemetry, or successful provisioning request into stronger claims about canonical authority, actual physical/media access, current physical state, or generic actuation authority. All 124 reusable ConflictPatterns were duplicate-screened before classification.

## Evidence refresh

SCIM-style provisioning separates user/group resources and lifecycle/membership mutations from application-specific authorization/effect semantics. ONVIF exposes user management and distinguishes access classes including media read and actuation; role support is capability-qualified rather than a generic promise that every device/provider realizes identical semantics. OPC UA likewise separates authentication from authorization and assigns permissions to roles/nodes; servers may implement only part of the standardized role mechanisms. These are strong witnesses for provider capability qualification and for keeping read/provision/broker operations separate from physical-control authority.

NIST IoT characterization guidance reinforces that inventory and observed network behavior are evidence used to understand devices and secure networks; observed/reported behavior is not equivalent to physical truth or canonical business authority.

## Adversarial results

### External identity/account mapping projection

A UI may legitimately show `CanonicalSubject -> ExternalAccount -> ProviderRole/Group`, but a visually connected path must not imply that account creation succeeded everywhere, that the mapping is unique, that the external identifier is stable, or that the user currently has effective access. Candidate signals include missing provider revision/currentness, duplicate external accounts, stale group membership, unresolved deprovisioning and cross-site identity reuse. Detection candidate: compare canonical subject mapping, provider account identity, desired grant set, observed grant set and reconciliation disposition with explicit timestamps/revisions. Owners: Identity/Authorization + Integration/provider semantic owner + UI projection owner. Blast radius: tenant/site access and privacy. Reversibility: medium where external sessions/grants survive. Currentness: provider-qualified. Proof obligation: UI must not strengthen desired/acknowledged provisioning into effective current authorization. Future route: Planning C/D/E + Architecture Reconciliation. Duplicate-screen result: existing authority/currentness/provider-effect/residual-cohort patterns; no new ConflictPattern.

### Read/query/event projection versus physical truth

Inventory, health, alarms, access logs, camera metadata and telemetry are provider observations with freshness/provenance. A green device icon, door state, presence marker or camera availability badge can be stale even when the provider API responded successfully. `provider reported state != physical truth`; `event received != physical event exhaustiveness`; `no alarm != proof of no fault`. Detection candidate: evidence timestamp, source/provider, collection mode, expected cadence, gap horizon and UNKNOWN/stale disposition. Owners: Integration/Observability/external-resource semantic owner + UI. Blast radius: operational decisions. Reversibility: generally high before downstream action, lower after human/automated reliance. Proof obligation: stale/partial/UNKNOWN evidence cannot be rendered as fresh physical fact. Existing evidence-currentness/false-convergence/proof-claim patterns cover this.

### Capability matrix and false provider equivalence

Two VMS/access/BMS/PDV/IoT providers may both advertise `users`, `roles`, `events` or `devices` while differing in scope, granularity, expiry, revocation, session invalidation, event guarantees or site topology. A low-code palette that exposes a single generic node without qualified support can create false semantic equivalence. Detection candidate: operation contract + provider profile/version + supported scope + unsupported/partial semantics. Owners: canonical integration contract owner + provider adapter owner + UI. Blast radius: multi-provider builds and migrations. Reversibility: medium. Proof obligation: portable semantic surface must not claim guarantees absent from the selected provider profile. Duplicate of provider-semantic-mismatch/conformance/qualified-claim families.

### Provision/revoke and residual access

A successful revoke request or disabled external account does not prove that all sessions/tokens/cached grants/controllers have converged. Conversely, one provider failure in a federated/site fan-out cannot be collapsed into global success or global failure without per-target dispositions. UI needs desired, attempted, acknowledged, observed and reconciled states rather than one boolean. Owners: Identity/Authorization + Integration/provider + Security. Blast radius: cross-site access. Reversibility: potentially low while residual access remains. Time-to-harm: immediate. False-positive risk: material because providers legitimately have bounded propagation. Proof obligation: no `revoked/effective` claim without qualified evidence obligation. Existing partial/UNKNOWN, residual-cohort and revocation-currentness patterns cover this.

### Access brokering versus media/control transport

A Canvas action may broker an authorized provider token/session/link for a camera or specialized console without making SB the streaming/media/control plane. Rendering `Open camera` or `Open VMS` as if SB itself owns media availability, retention, codec or analytics semantics would erase the provider boundary. Owners: Integration/provider + Authorization + UI. Detection candidate: classify operation as broker/read/provision versus provider-specific control/media operation and retain provider target/session scope. Blast radius: privacy and accidental architecture expansion. Proof obligation: broker success proves only the qualified broker contract, not media delivery or specialized-system correctness. Existing semantic-ownership/provider-boundary/proof-claim patterns cover this.

### Exceptional physical actuation

ONVIF's explicit separation of access classes such as media read and ACTUATE is a useful witness that physical-effect operations require distinct authority. A UI/AI composer must not infer `open door`, `move PTZ`, `change setpoint`, `disable device` or similar actuation merely because read/provision/inventory integration exists. Such operations remain NON-GOAL/provider-specific exceptional extensions unless separately justified later. Candidate detection: operation effect class + target/site + provider capability + authority + safety proof profile. Owners: Planning-C future architecture owner + domain safety/authorization owner + provider adapter owner. Blast radius: physical/site safety. Reversibility: potentially low. Time-to-harm: immediate. Proof obligation: read/provision capability cannot imply actuation authority. This duplicate-screens into authority amplification/provider capability/physical-effect proof families; no implementation invariant is authorized here.

### Cross-tenant/site target confusion

A valid external account, role and device identifier can each be individually valid yet compose against different tenant/site/provider contexts. Canvas auto-completion or AI composition can accidentally connect them. Detection candidate: explicit tenant/site/external-system identity on mapping and invocation edges; reject only when concrete qualification later proves mismatch. Owners: Identity/Authorization + Integration + UI. Blast radius: cross-tenant/site leakage. Reversibility: low after access/data exposure. Proof obligation: aggregate visual reachability is not target authorization. Existing target-scope/authority/federation conflict families cover this.

### Legacy Mirroring intersection

Imported spreadsheets/Drive inventories or old access lists can seed candidate device/user/permission mappings, but inferred mappings remain candidates. Historical external grants imported during modernization must not be rendered as current canonical authorization without owner approval/currentness evidence. Existing Mirroring provenance/authority/currentness patterns cover this; no new canonical capability is inferred.

### Temporal, provenance, units/vector/uncertainty and graph revision

Provider inventories, grants and telemetry need temporal validity and provenance. Graph revision N->N+1 can change external-resource mapping or provider binding while an in-flight provisioning/revoke operation still targets N. Risk/capacity/health projections may be vectors or uncertain observations; scalar badges are qualified projections only. Existing temporal/revision, provenance-overattribution, analytical-kind, uncertainty and qualified-projection families cover the cases.

### AI/low-code composition

AI may strengthen `supports user management` into `supports equivalent authorization`, `revoke accepted` into `access removed`, `camera online` into `video physically available`, or `read node` into `safe write/call`. These remain ConflictSignals until qualified evidence establishes activation. Candidate detection is aggregate semantic review over operation effect class, authority, tenant/site target, provider profile, evidence currentness, provenance and UNKNOWN state. No automatic remediation is authorized.

## Architecture-hypothesis disposition

Physical Systems/IoT/Edge/Peripheral Integration remains a bounded cross-cutting integration/governance-plane research lens, not a 29th canonical capability and not committed architecture. The likely ownership decomposition remains Identity/Authorization + Integration + external-resource/device registry semantics + provider adapters, with specialized VMS/access/BMS/PDV/device-management systems retaining media/control-plane ownership by default.

Typed Semantic Graph remains useful as a hypothesis because it can distinguish semantic capability, CapabilityUse/Invocation, external system, device/resource class and instance, external account, grant, provider adapter/profile, event/telemetry observation and optional physical effect while preserving temporal/provenance qualifiers. PostgreSQL relational graph remains a plausible baseline; GraphDB remains optional/provider-level. Canvas/Graph Explorer remains a projection, never authority.

Carry-forward remains mandatory: Planning C must decide provisioning/read/event versus specialized-control boundaries and any exceptional actuation proof profile; Planning D must address provider migration/coexistence and residual external accounts/grants/sessions; Planning E must prove provisioning, revoke, permission drift/reconciliation, camera/access isolation, read/event currentness, provider outage behavior, no cross-tenant/site leakage and no accidental expansion into specialized control software.

## Saturation disposition

- new local material edge scenarios: **0**;
- new cross-capability material scenarios: **0**;
- new reusable ConflictPatterns: **0**;
- ConflictInstances: **0**;
- preventive invariant candidates: **0**;
- UI no-material streak: **remains capped at 2**;
- mandatory-cluster streaks: **unchanged, capped at 2**;
- campaign inventory: **284 edge scenarios + 124 ConflictPatterns = 408 material findings**;
- HIGH/CRITICAL without owner/proof/detection route: **0**;
- negative-space: **NOT_STARTED**;
- saturation: **NOT_SATURATED**;
- Planning C: **BLOCKED**.

## Next rotation

Continue Full Pass 7 with `Integration & Automation`. Carry the refined Physical Systems/IoT/Edge/Peripheral lens directly into provider provisioning, permission sync, external-resource identity, event ingestion, edge/offline buffering, drift/reconciliation, partial/UNKNOWN effects and explicit source-of-truth/currentness. Challenge automation against accidental actuation authority, unsafe retry after ambiguous external mutation, cross-site target confusion, provider-profile false equivalence, residual grants/sessions, stale telemetry, federated responsibility and AI/low-code evidence strengthening. Carry all standing semantic/modeling and bounded Legacy Mirroring lenses. Duplicate-screen all 124 ConflictPatterns. Do not enter Planning C.