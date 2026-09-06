# Generation 2 — Enterprise Trust / PKI / Certificate Lifecycle — Full Pass 7 Revisit

Status: `ELIGIBLE NO-NEW-MATERIAL REVISIT`
Phase: `RESEARCH_ADVERSARIAL_EDGE_CASE_SATURATION`
Full pass: 7
Disposition: `CATALOGUE + CLASSIFY + DETECTION_CANDIDATE + FUTURE_REMEDIATION_ROUTE`

## Authority and scope

Research only. This revisit follows `RESEARCH_PIPELINE_STATE.json`, `POST_MATH_ADVERSARIAL_EDGE_CASE_SATURATION_RESEARCH.md`, `PROCESSUAL_SEMANTIC_CONFLICT_CLASSIFICATION.md`, `ADVERSARIAL_SATURATION_STATE.json`, prior Trust/PKI revisits, the bounded Physical/Peripheral integration-plane boundary and the new `OPERABILITY_ELICITATION_LENS_RESEARCH.md`.

Preserve:

- `ConflictPattern != ConflictInstance`;
- `Signal != ConfirmedConflict`;
- `cryptographic validity != semantic authority`;
- `certificate/path validity != current organizational authorization`;
- `provider/device identity != canonical subject/site identity`;
- `external provider state != canonical authority != physical truth`;
- `feature completeness != production readiness != runtime health != business convergence`;
- `Fleet aggregate != runtime truth != control authority`.

No product code, Work Package, executable TASK, Construction, remediation or Planning C architecture was performed.

## Full Pass 7 techniques

1. **operability-question subtraction** — hold the functional trust design constant while removing owner/SLO/currentness/recovery/reconciliation/change-safety answers;
2. **recovery-cut mutation** — restore trust stores, provider mappings, certificates or enrollment state from different temporal cuts and inspect resurrected authority/currentness;
3. **provider/device/site identity permutation** — reuse provider-local/device identifiers across sites/tenants/replacements while certificate syntax remains valid;
4. **offline-cohort mutation** — offline controllers/devices retain old certificates, revocation evidence, trust bundles or policy revisions after central rotation;
5. **split-view currentness** — verifier cohorts receive different revocation/status/bundle evidence under queue/backlog/rate-limit pressure;
6. **queue-capacity stress** — revocation bursts, certificate renewals, HSM/CA/status-provider quotas, reconnect storms and exporter gaps;
7. **control-boundary mutation** — expose trust/health visibility through Fleet and test accidental inference of remote actuation or permission authority;
8. **brownfield/legacy trust assimilation** — imported certificates, undocumented anchors, vendor consoles and unsupported profile semantics;
9. **change-safety subtraction** — rollout without explicit canary/abort/rollback and mixed-version residual-cohort evidence;
10. **causal non-strengthening** — Fleet correlation between certificate failures and rollout/provider/site events remains analytical only;
11. **AI/low-code composition** — generated fallback/provider/trust mapping broadens accepted trust or treats certificate validity as authorization;
12. duplicate-screen against all 124 reusable `G2-CONFLICT-PATTERN-*` families.

## External evidence refreshed

### Operational readiness and production launch practice

Google SRE's launch guidance treats capacity, dependency failures, timeouts/retries, monitoring, alerts, backup/restore, external dependencies, staged rollout and documented procedures as launch-readiness questions rather than feature semantics. AWS ORR similarly derives operational questions from incidents, near misses and feared failure modes and requires identified ownership, runbooks/playbooks and support readiness.

Sources, accessed 2026-09-06:

- https://sre.google/sre-book/reliable-product-launches/
- https://sre.google/sre-book/launch-checklist/
- https://docs.aws.amazon.com/wellarchitected/latest/operational-readiness-reviews/wa-operational-readiness-reviews.html
- https://docs.aws.amazon.com/wellarchitected/latest/operational-readiness-reviews/the-orr-tool.html
- https://docs.aws.amazon.com/wellarchitected/latest/operational-excellence-pillar/operational-readiness.html

These sources support the new portable separation `feature completeness != production readiness` and the need for explicit operability evidence.

### Trust currentness remains time-qualified

Prior evidence remains authoritative: RFC 5280 certificate/path validity is evaluated against a time and application policy; RFC 6960 OCSP carries distinct `thisUpdate`, `nextUpdate`, `producedAt` and `revocationTime`; RFC 9608 permits profiles in which revocation information is intentionally unavailable; SPIFFE federation treats trust-bundle rotation as a propagation problem across trust domains.

Sources, accessed 2026-09-06:

- https://www.rfc-editor.org/rfc/rfc5280
- https://www.rfc-editor.org/rfc/rfc6960
- https://www.rfc-editor.org/rfc/rfc9608
- https://spiffe.io/docs/latest/spiffe-specs/spiffe_federation/

## Operability Elicitation Lens applied to Trust/PKI

A Trust/PKI design is not production-ready merely because certificate issuance/verification mechanics are specified. Candidate elicitation questions include:

### Success / SLO / currentness

- How will we know trust verification is functioning end-to-end for each verifier/workload class?
- What freshness horizon applies to revocation/status/trust-bundle evidence?
- Which trust result may remain `UNKNOWN/PARTIAL`, for how long, and what local operation is still permitted under that uncertainty?
- What p50/p95/p99 validation/refresh latency, status age or bundle lag matters operationally?

### Ownership / escalation

- Who owns issuer/CA/HSM/status provider, trust-domain/bundle, client/device enrollment, authorization semantics and recovery independently?
- Who acts on certificate-expiry, revocation-staleness, bundle-lag or cross-site trust-leakage alerts?
- What escalation exists for emergency vendor-console changes or contested trust ownership?

### Failure / degraded mode

- What happens if CA/HSM/OCSP/CRL/trust-distribution/provider APIs fail?
- Can autonomous local runtimes continue under bounded cached evidence, and how is age/confidence exposed?
- Which failures must yield `UNKNOWN/PARTIAL` rather than silent fail-open?
- Can a Fleet/exporter outage occur without blocking local verification/workflow?

### Recovery / reconciliation

- What must be reconciled after trust-store restore, device/controller return from offline, certificate rotation or provider recovery?
- How are revoked/rotated credentials surviving in residual cohorts detected?
- How is historical proof preserved while current authority is requalified?
- What evidence is required before a dashboard can claim trust recovery/convergence?

### Capacity / queueing

- Renewal/revocation/status-query arrival rates and bursts?
- HSM/CA/status-provider quotas and binding bottlenecks?
- Queue/backlog age, retry behavior and freshness-deadline consumption?
- How does reconnect/offline catch-up change load distribution?
- What constitutes sustainable trust-service capacity versus transient burst tolerance?

### Change safety

- Canary/staged rollout semantics for anchors, algorithms, profiles, certificate chains or provider substitutions?
- Compatibility matrix across verifier libraries/builds/device cohorts/providers?
- Abort/rollback eligibility and evidence?
- Which residual/offline cohorts remain on old trust material after declared completion?

### Security/privacy/audit

- Which trust evidence is retained for incident/audit without overcollecting identity/device/location metadata?
- How are emergency trust changes, enrollment/provisioning changes and trust-policy revisions auditable?
- Does certificate validity remain explicitly separate from authorization/physical-control permission?

## Production Readiness Coverage candidate for Trust

The cross-cutting readiness dimensions apply independently:

`OBSERVABILITY | OWNERSHIP | FAILURE_HANDLING | RECOVERY | CAPACITY | CURRENTNESS | SECURITY | RECONCILIATION | CHANGE_SAFETY | COST | DOCUMENTATION`

with states:

`UNTOUCHED | PARTIAL | RESOLVED | CONFLICTED | BLOCKED | NA`.

No single scalar readiness/health score is authoritative. A Trust capability can be functionally complete while `CURRENTNESS` or `RECOVERY` remains `BLOCKED`; that blocked dimension must not disappear behind an aggregate green status.

## Autonomous Builds × Fleet Observability/Capacity

Candidate lineage remains:

`CanonicalCapabilityRef -> CapabilityUse -> BuildRevision/Release -> RuntimeRealization -> Deployment -> NodeInvocation/Attempt`

Trust analysis may additionally require verifier profile, certificate/chain, trust-domain/anchor/bundle revision, status-evidence kind/time and provider/site/device context.

Preserve:

`semantic topology != build topology != deployment topology != runtime truth != local journal/evidence != exported telemetry != Fleet aggregate != control authority`.

Operational interpretation:

- client/site runtime remains correct when SB/Observe/Fleet is unavailable;
- local evidence is sufficient for the locally qualified decision contract;
- exporter failure creates an observability gap, not a workflow blocker;
- Fleet aggregation across builds/providers is allowed only after compatibility of the relevant trust semantics is established;
- shared infrastructure does not imply shared trust namespace, tenant/site authority or physical-control authority.

## Queueing / flow / capacity mathematics

Candidate trust flow:

`enrollment/rotation/revocation -> issuer/status producer -> publication/distribution -> verifier refresh -> local validation/decision`.

Track `lambda`, `mu`, queue depth, backlog age, wait/service/sojourn time, concurrency, retry ancestry, quota and freshness-horizon consumption where observable.

Preserve:

`observed low utilization != current queue health != sustainable capacity != headroom != transient burst tolerance != stability margin`.

M/M/1 or Little's-Law-style models are usable only as qualified models under valid assumptions. Compromise/revocation storms, synchronized renewal, reconnect bursts, priorities, finite queues, heavy tails, provider quotas and correlated dependency failures can invalidate simple stationary assumptions.

## Physical / Peripheral integration-plane boundary

For VMS/BMS/access/PDV/biometric/device ecosystems, Trust/PKI research remains integration-plane bounded by default:

- Fleet may observe certificate/token/session expiry, connector trust health, external-resource/device mapping, enrollment/provisioning currentness and drift;
- specialized external system remains its control/media/runtime authority unless a later explicit architecture decision says otherwise;
- a valid device/controller certificate does not prove current canonical user/site authorization or physical state;
- Fleet visibility must not confer remote gate/door/HVAC/media actuation authority.

## Duplicate-screen against 124 reusable ConflictPatterns

No distinct 125th reusable pattern survived.

| Candidate composition | Existing coverage / disposition |
| --- | --- |
| trust mechanics fully specified but no operational owner/currentness/recovery answers | semantic ownership + evidence/currentness + recovery/readiness gap — DUPLICATE |
| certificate valid while current organizational/site authorization was withdrawn | crypto-authority + authorization currentness — DUPLICATE |
| revoked credential survives offline controller/device and later reconnects | residual cohort + currentness + recovery qualification — DUPLICATE |
| trust-store restore resurrects old anchor/provider mapping | restore resurrection + version/recovery + trust namespace — DUPLICATE |
| provider/device external ID reused after replacement/cross-site move | identity mapping + provider namespace + cross-tenant/site leakage — DUPLICATE |
| green trust dashboard based on last export while site/provider is offline | evidence currentness/completeness + stale-green analytical claim — DUPLICATE |
| revocation/renewal queue backlog hidden by average verifier utilization | resource/capacity + analytical-kind conflation + currentness — DUPLICATE |
| alert exists but no owner/runbook/escalation path | responsibility/human-procedure + operational ownership — DUPLICATE |
| rollout completes centrally while mixed/offline cohorts retain old trust profile | residual cohort + version/currentness + false convergence — DUPLICATE |
| provider/profile substitution broadens accepted certificate semantics | provider qualification + compatibility direction + authority non-amplification — DUPLICATE |
| Fleet certificate visibility treated as remote physical-control authority | observability/control authority conflation — DUPLICATE |
| causal correlation between rollout and failure authorizes automatic provider/trust mutation | analytical-kind conflation + authority non-amplification — DUPLICATE |
| AI-generated fallback accepts stale/weak trust evidence or merges trust domains | AI composition + trust namespace + proof strengthening — DUPLICATE |

No `ConflictInstance` is asserted. No signal is promoted to `ConfirmedConflict`.

## Detection candidates and future remediation routes

Research-only candidates:

1. operability metadata presence/currentness checks for Trust/PKI contexts;
2. explicit trust-decision inputs: verifier profile, time, certificate/chain, trust-domain/anchor/bundle revision, status evidence and provider/site/device context;
3. alert-to-owner/runbook/escalation linkage;
4. stale/split-view cohort detection by build/deployment/provider/trust revision;
5. queue/backlog/freshness-horizon and provider-quota qualification without authority inference;
6. residual/offline credential and trust-material reconciliation evidence;
7. rollout/rollback compatibility and post-change validation evidence;
8. cross-tenant/site trust namespace checks;
9. explicit separation between cryptographic validity, canonical authorization and physical-control authority;
10. readiness coverage revisioning so materially changed trust/provider/deployment semantics invalidate stale readiness evidence.

These remain `DETECTION_CANDIDATE + FUTURE_REMEDIATION_ROUTE` / proof-obligation inputs only.

## Planning C / D / E carry-forward — research only

Carry forward without materializing architecture:

- operational elicitation metadata for Trust/PKI;
- Production Readiness Coverage separate from feature completeness;
- trust currentness/freshness semantics;
- queue/capacity/stability and workload-admission proof domains;
- local-autonomy and Fleet non-authority proof;
- owner/escalation/runbook semantics;
- recovery/reconciliation and residual-cohort proofs;
- change/rollout/rollback safety;
- provider/site/device trust namespace isolation;
- observe-versus-control authority boundary;
- product proofs for expiry/revocation, split-view currentness, offline recovery, exporter outage and post-change convergence.

## Saturation disposition

- new local material edge scenarios: **0**;
- new cross-capability material scenarios: **0**;
- new reusable ConflictPatterns: **0**;
- new ConflictInstances: **0**;
- new preventive invariant candidates: **0**;
- HIGH/CRITICAL without owner/proof/detection route: **0**;
- Enterprise Trust / PKI / Certificate Lifecycle local no-material streak: remains **2 capped**;
- mandatory cluster streaks: remain **2 capped**;
- material edge inventory: **284**;
- reusable ConflictPattern inventory: **124**;
- combined material findings: **408**;
- Full Pass 7 capability coverage after this visit: **20/28**;
- Full Pass 7 mandatory cluster coverage: **12/12**;
- completed full passes: **6/8 minimum**;
- negative-space: `NOT_STARTED`;
- saturation: `NOT_SATURATED`;
- Planning C: `BLOCKED`.

## Next research target

Continue only Full Pass 7 with **Privacy / Data Governance / Retention / Legal Hold / Residency**. Carry the new Operability Elicitation Lens into retention/deletion/legal-hold currentness, ownership, evidence retention, privacy-safe telemetry, provider/residency drift, deletion/reconciliation queues, restore resurrection, offline/Fleet gaps, change safety and production-readiness coverage. Duplicate-screen all 124 reusable ConflictPatterns. Privacy streak is already capped at 2; do not inflate it absent material novelty.