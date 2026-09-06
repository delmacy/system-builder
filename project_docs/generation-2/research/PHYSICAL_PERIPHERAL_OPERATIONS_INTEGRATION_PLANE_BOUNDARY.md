# Generation 2 — Physical / Peripheral Operations Integration-Plane Boundary

Status: ACTIVE CROSS-CUTTING RESEARCH BOUNDARY / ARCHITECTURE HYPOTHESIS ONLY
Phase: `RESEARCH_ADVERSARIAL_EDGE_CASE_SATURATION`
Authority: `RESEARCH_PIPELINE_STATE.json`, `POST_MATH_ADVERSARIAL_EDGE_CASE_SATURATION_RESEARCH.md`, `PROCESSUAL_SEMANTIC_CONFLICT_CLASSIFICATION.md`

Research only. This artifact narrows the standing Edge / Physical Fleet / Site Operations front. It does not authorize target architecture, remote actuation, Work Packages, TASKs, Construction, replacement of VMS/BMS/access/PDV suites, central biometric matching/storage, or a Fleet runtime/control dependency.

Preserve `ConflictPattern != ConflictInstance`, `Signal != ConfirmedConflict`, `external provider state != canonical authority != physical truth`, `last reported state != current physical truth`, `local evidence != exported telemetry != Fleet aggregate != control authority`, and `Shared infrastructure != shared truth/authority`.

## 1. Bounded objective

Treat Physical / Peripheral Operations as an **integration-observability and reconciliation plane**. System Builder/Fleet may discover and project external systems, sites, resources, accounts, grants, events, connector health and sync/drift state. Specialized external suites remain their media/control/runtime planes by default.

The default boundary is:

`observe / inventory / provision where contractually supported / reconcile / diagnose != unrestricted remote physical actuation`.

A future actuation extension, if ever justified, would require separate explicit client/site/device context, authority, provider capability qualification, safety constraints, version targeting and rollback/recovery proof. None is authorized here.

## 2. Candidate projection hierarchy — HYPOTHESIS / IN RESEARCH

`Enterprise -> Client -> Site -> External Specialized System/Provider -> Resource Group -> External Resource/Device -> External User/Grant/Event`

This is a projection, not committed canonical truth. Non-tree relationships remain possible. Client/site boundaries must remain explicit through provider identifiers, pagination, reconciliation, telemetry and any supported provisioning lifecycle.

The projection must retain source/provenance/currentness. Provider-native identifiers are realization identities and must not silently become canonical subjects.

## 3. Operational integration vector

Candidate `ExternalIntegrationOperationalVector` dimensions:

- last successful sync and age;
- requested/accepted/effective provisioning state;
- provisioning/deprovision success/failure/`PARTIAL`/`UNKNOWN`;
- deprovision lag and oldest unresolved revoke age;
- unresolved identity/resource/grant drift;
- stale external-state age/currentness/confidence;
- event gap / last event / backlog age;
- provider API/connector health;
- rate-limit/quota pressure and retry ancestry;
- pagination/checkpoint completeness;
- account/resource inventory drift;
- token/session expiry/revocation currentness;
- provider profile/version/capability qualification;
- client/site binding revision;
- evidence source and observation time.

`multidimensional facts != scalar health score`. Any later scalarization/ranking is policy, must be explicit/versioned/auditable, and cannot strengthen stale or incomplete evidence.

## 4. Domain boundaries

### Camera / VMS
Fleet may project inventory, device/stream health metadata, access-mapping state, authorized session/link metadata and audit references. Raw video/media remains the VMS/provider media plane by default.

### Access control
Fleet may project/synchronize people, credential references, groups, areas, schedules, reader/controller inventory and event-ingestion currentness where provider contracts permit. Door/gate actuation is not a default Fleet objective.

### PDV / kiosk
Fleet may project terminal/user mapping, connector health, data/event synchronization and transaction/status ingestion. Fiscal/payment terminal control remains provider-specific.

### HVAC / BMS
Fleet may project topology, readings, alarms and status/currentness. Low-level control loops and setpoints remain the specialized BMS/controller responsibility by default.

### Biometrics
Fleet may project provisioning/reference mapping, currentness and privacy/governance status. Central biometric matching/template storage is not a default System Builder/Fleet responsibility.

## 5. Queue / flow / capacity scope

Queueing research focuses on connector/API/event flows rather than physical actuation throughput:

`canonical change/event -> connector admission -> provider request/API -> provider processing -> query/event observation -> reconciliation -> local evidence/export -> Fleet projection`.

Relevant dimensions include arrival rate `λ`, effective service rate `μ`, utilization `ρ`, backlog depth/age, wait/service/sojourn time, retry amplification, provider quota/rate-limit, pagination throughput, event-ingestion lag, reconciliation latency and store-and-forward retention.

Preserve:

`observed low utilization != current queue health != sustainable capacity != headroom != transient burst tolerance != stability margin`.

A healthy connector endpoint does not prove grant/revoke convergence. A small average backlog does not prove bounded tail latency for high-priority deprovisioning. Provider quota is not internal capacity.

## 6. Identity / provisioning evidence witnesses

Portable standards reinforce the boundary:

- SCIM RFC 7643 defines service-provider `id` as stable/non-reassignable within the provider, while `externalId` belongs to the provisioning client and is scoped to the provisioning domain. This supports explicit `{provider/tenant/client/site, provider-id, external-id}` qualification rather than treating a bare external identifier as canonical identity.
- SCIM RFC 7644 list responses are paginated and may return only subsets of total resources. Inventory/reconciliation therefore needs explicit pagination/checkpoint/completeness semantics; a completed page cannot prove complete external inventory.
- OpenID Connect Core defines the stable end-user identity for an RP as `(iss, sub)` and warns that email, phone, name and preferred username are not stable unique identifiers. This supports issuer/provider namespace qualification and forbids cross-site/provider identity correlation by display attributes alone.

These are witnesses only; they do not decide Planning C.

## 7. Adversarial screen against existing ConflictPatterns

No new reusable pattern is admitted in this bounded increment.

### A — stale green sync dashboard
Activation: last sync succeeded but connector/provider/site is now unavailable or later pages/events were not consumed. Incompatible claims: `last successful observation` versus `current external state complete/current`. Detection candidate: sync age, checkpoint/pagination completion, event-gap age, provider health, expected cadence. Owners: Integration + Provider/Binding + Observability. Severity HIGH; confidence strongly supported; detectability runtime/audit; blast radius site/system; reversibility easy for projection, larger if acted upon; time-to-harm delayed/immediate for revoke drift; misuse accidental; evidence stale/incomplete; false-positive risk medium during planned offline periods. Future route: qualify freshness/completeness and expose `PARTIAL/UNKNOWN`. Duplicate: evidence-currentness/presence + proof-claim conflation.

### B — revoke/deprovision backlog hidden by aggregate health
Activation: ordinary sync succeeds while a priority revoke queue, provider rate limit or residual session/grant cohort lags. Incompatible claims: `connector healthy` versus `external access lifecycle converged`. Detection candidate: per-operation-class backlog age, oldest unresolved revoke, residual grants/sessions, provider response/effective-state correlation. Owners: Identity + Authorization + Integration/Provider. Severity CRITICAL; confidence supported; detectability runtime/audit; blast radius subject/site/system; reversibility bounded but harm may be immediate; false-positive risk where policy explicitly allows a bounded window. Future route: currentness horizon/reconciliation proof. Duplicate: authentication-currentness/federation-coexistence + resource/capacity + residual-cohort families.

### C — cross-site account/resource mapping
Activation: provider IDs, usernames, emails or resource aliases collide/reuse across clients/sites or provider tenants. Incompatible claims: provider-local identity versus canonical client/site subject. Detection candidate: explicit provider/issuer/tenant/site namespace, canonical mapping revision, collision/reuse audit. Owners: Identity + Provider/Binding + site/client authority owner. Severity CRITICAL; confidence strongly supported; detectability static/pre-execution/runtime; blast radius cross-tenant/site; reversibility migration/reconciliation; time-to-harm immediate; misuse plausible/adversarial; false-positive risk medium for legitimate shared external accounts that are explicitly governed. Future route: explicit scoped mapping/adoption. Duplicate: identity-mapping + cross-tenant leakage + entity-resolution families.

### D — provider pagination/filter omission silently interpreted as absence
Activation: inventory/reconciliation traverses partial pages, provider changes page ordering, unsupported filters/scopes are ignored, or checkpoint resumes from an incompatible cut. Incompatible claims: `not observed` versus `does not exist/is revoked`. Detection candidate: total/result/page metadata, checkpoint lineage, repeated inventory hashes, unsupported-feature qualification, gap audit. Owners: Integration + Provider/Binding + Identity/Authorization according to resource type. Severity HIGH–CRITICAL for permission inventory; confidence strongly supported; detectability runtime/audit; blast radius resource group/site/system; reversibility bounded; time-to-harm cumulative; false-positive risk medium under concurrent provider mutation. Future route: completeness/consistency qualification before negative claims. Duplicate: presence semantics + provider qualification + evidence completeness/currentness.

### E — integration visibility becomes implicit actuation authority
Activation: a dashboard/AI/low-code automation can observe a provider resource and infers ability to operate the physical device or specialized suite. Incompatible claims: `resource visible/linked` versus `remote actuation authorized and semantically supported`. Detection candidate: operation-class contract, explicit authority/context, provider scope, site boundary, audit lineage. Owners: Authorization + Integration + Provider/Binding + external-system owner. Severity CRITICAL; confidence strongly supported; detectability design/pre-execution; blast radius site/external parties; reversibility potentially irreversible; time-to-harm immediate; misuse plausible/adversarial; false-positive risk low. Future route: keep read/provision/broker operations distinct from exceptional actuation extension. Duplicate: authority non-amplification + provider semantic mismatch + AI/low-code composition conflict.

## 8. Planning C / D / E carry-forward

Carry forward only as research inputs:

- integration observability model with source/currentness/completeness;
- explicit provider resource/user/grant/site topology;
- sync/deprovision/reconciliation queue and deadline semantics;
- no-cross-client/site leakage proof obligations;
- external account/access lifecycle and residual grant/session evidence;
- provider pagination/checkpoint and unsupported-scope qualification;
- privacy-minimized metadata projection, especially biometric/video/access/location data;
- explicit `no central control plane by default` boundary;
- Fleet read/analysis semantics distinct from actuation authority;
- local/external specialized system remains operationally authoritative for its own control/media plane unless a later explicit contract proves otherwise.

No architecture is materialized in this phase.

## 9. Disposition

- New canonical capability: **0**.
- New mandatory cluster: **0**.
- New edge IDs: **0**.
- New cross-edge IDs: **0**.
- New reusable ConflictPatterns: **0** after duplicate-screen against 124 existing patterns.
- ConflictInstances: **0**.
- Preventive implementation work: **0**.

Default route remains `CATALOGUE + CLASSIFY + DETECTION_CANDIDATE + FUTURE_REMEDIATION_ROUTE`.