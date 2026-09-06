# Generation 2 — Enterprise Trust / PKI / Certificate Lifecycle — Full Pass 8 Revisit

Status: `ELIGIBLE NO-NEW-MATERIAL REVISIT`
Phase: `RESEARCH_ADVERSARIAL_EDGE_CASE_SATURATION`
Full pass: 8
Disposition: `CATALOGUE + CLASSIFY + DETECTION_CANDIDATE + FUTURE_REMEDIATION_ROUTE`

## Authority and scope

Research only. This revisit follows `RESEARCH_PIPELINE_STATE.json`, `POST_MATH_ADVERSARIAL_EDGE_CASE_SATURATION_RESEARCH.md`, `PROCESSUAL_SEMANTIC_CONFLICT_CLASSIFICATION.md`, `ADVERSARIAL_SATURATION_STATE.json`, prior Trust/PKI research, `OPERABILITY_ELICITATION_LENS_RESEARCH.md`, Elicitation/System Understanding research, Legacy Mirroring, Autonomous Builds/Fleet research and the bounded Physical/Peripheral integration-plane boundary.

Preserve:

- `Research != remediation`;
- `ConflictPattern != ConflictInstance`;
- `Signal != ConfirmedConflict`;
- `cryptographic validity != semantic authority`;
- `certificate/path validity-at-T != current organizational authorization`;
- `historical signature proof != current permission to act`;
- `restored trust material != currently qualified trust material`;
- `external provider/device identity != canonical subject/site identity`;
- `external provider state != canonical authority != physical truth`;
- `local trust decision != exported telemetry != Fleet aggregate != control authority`;
- `feature completeness != Production Readiness Coverage != runtime health != business convergence`.

No product code, Work Package, executive TASK, Construction, remediation or Planning C architecture was performed.

## Full Pass 8 adversarial techniques

This revisit deliberately uses different probes from the prior pass:

1. **trust-epoch crossing** — rotate certificate, key or trust anchor while restore points, offline cohorts and in-flight executions belong to different trust epochs;
2. **restore-cut differential** — compare restored trust store, restored provider mapping and restored canonical authorization against current policy and revocation state;
3. **validity/authority subtraction** — keep signature/path validity true while independently withdrawing role, site, tenant, provider or organizational authority;
4. **revocation split-view mutation** — give verifier cohorts different CRL/OCSP/bundle freshness under backlog, rate limiting, intermittent connectivity and provider outage;
5. **anchor-set permutation** — introduce/remove/reorder provider/enterprise/site trust anchors while preserving syntactically valid certificate chains;
6. **signer/verifier identity qualification** — separate signing key identity, certificate subject/SAN, issuer, trust anchor, application policy, canonical actor and current delegated authority;
7. **offline residual-cohort mutation** — controllers/connectors/workloads continue with old trust bundles or cached revocation evidence and later reconnect in a burst;
8. **provider-substitution differential** — substitute CA/HSM/status/bundle/provider while feature labels match but trust profile, assurance, namespace or currentness semantics differ;
9. **Brownfield evidence falsification** — import certificate/config/archive evidence with missing issuing context, unknown historical trust-store contents, undocumented vendor roots or ambiguous site ownership;
10. **queue-network stress** — synchronized renewal/revocation, HSM/CA/status-provider bottlenecks, retries, priorities, finite queues and reconnect storms;
11. **operability-readiness subtraction** — retain functional PKI mechanics while removing owner, SLO, alert action, runbook, recovery/reconciliation, capacity assumption or post-change validation;
12. **human emergency path mutation** — emergency vendor-console/manual certificate procedures interact with canonical authority and audit/currentness;
13. **causal non-strengthening** — Fleet correlation between rollout/provider/site and trust failures remains analysis, not automatic authority to mutate trust;
14. **AI/low-code proof strengthening probe** — generated logic attempts to infer current authorization from cryptographic success or silently broadens accepted anchors/profiles;
15. duplicate-screen against all 124 reusable `G2-CONFLICT-PATTERN-*` families.

## External evidence refreshed — 2026-09-06

### X.509 path validity is time- and policy-qualified

RFC 5280 path validation evaluates certificates with respect to the time in question and permits applications to impose additional policy/usage constraints. Trust anchors are explicit inputs to path validation and may themselves carry organization/application-specific limitations. Therefore a mathematically valid path is not a universal authorization result.

Source:
- https://www.rfc-editor.org/rfc/rfc5280

Portable semantic consequence:

`valid certificate path at T under trust-anchor/policy set P != canonical authority at T2 under organizational policy Q`.

### Revocation evidence has its own currentness semantics

RFC 6960 separates `thisUpdate`, `nextUpdate`, `producedAt` and `revocationTime`; it also defines `unknown` certificate status and requires authorization of OCSP responders. A signed status response can therefore be authentic while too stale, too early, semantically unknown or outside the intended responder authority for a current decision.

Source:
- https://www.rfc-editor.org/rfc/rfc6960

Portable semantic consequence:

`status response received != status current enough != current authority safe to infer`.

### Trust-bundle identity and rotation must remain qualified

SPIFFE federation requires an explicit association between a trust domain name and its bundle. Bundle contents are expected to change over time as keys are added/removed; clients use the latest bundle on subsequent connections so key rotation can propagate. This supports treating trust-domain identity, bundle revision/currentness and distribution convergence as separate facts.

Sources:
- https://spiffe.io/docs/latest/spiffe-specs/spiffe_federation/
- https://spiffe.io/docs/latest/spiffe-specs/spiffe_trust_domain_and_bundle/

Portable semantic consequence:

`same bundle bytes without qualified trust-domain association != same trust semantics`, and `bundle published != all verifier cohorts converged`.

### Key recovery does not restore current authority automatically

NIST SP 800-57 Part 1 Rev. 5 treats key compromise recovery as a lifecycle operation: compromised keys are revoked, affected keys replaced as needed and damage assessed; recovery/backup has security consequences and may require re-protection. Restoring old keying material therefore does not prove that the restored material is still currently authorized or safe.

Source:
- https://doi.org/10.6028/NIST.SP.800-57pt1r5

Portable semantic consequence:

`key recovered/restored != key currently qualified for the same role/policy/epoch`.

### Trust-anchor minimization remains a distinct operational/security concern

NIST SP 800-52 Rev. 2 requires path validation and revocation checking in its TLS guidance and recommends minimizing trust anchors needed for client authentication. This reinforces the distinction between a syntactically available anchor set and the smaller policy-qualified set an application should trust.

Source:
- https://doi.org/10.6028/NIST.SP.800-52r2

## Autonomous Builds × Fleet Observability/Capacity

Candidate lineage remains:

`CanonicalCapabilityRef -> CapabilityUse -> BuildRevision/Release -> RuntimeRealization -> Deployment -> NodeInvocation/Attempt`.

For Trust/PKI, analysis may additionally qualify:

`TrustDecisionContext = {tenant/client, site, canonical actor/resource, build/release, deployment/runtime, verifier profile, certificate/chain fingerprint, issuer, trust-domain, anchor/bundle revision, status-evidence kind/time, provider, policy/authority revision}`.

This is research vocabulary, not architecture materialization.

Preserve:

`semantic topology != build topology != deployment topology != runtime truth != local evidence != exported telemetry != Fleet aggregate != control authority`.

A client/site runtime must not depend on SB/Observe/Fleet availability for locally qualified execution. Fleet may project trust/currentness/expiry/revocation/bundle/provider evidence for analysis, but a Fleet aggregate must not become an implicit authorization service or remote physical-control authority.

## Queueing / flow / capacity mathematics

Candidate trust flow:

`enroll/issue/rotate/revoke -> issuer/HSM/status producer -> publish/distribute -> verifier refresh/cache -> local validation/decision -> telemetry/export/reconciliation`.

Queue/capacity dimensions where observable:

- arrival rate `λ` and service rate `μ` for issue/renew/revoke/status/bundle work;
- utilization `ρ` only when the modeled queue assumptions are explicit;
- queue depth and oldest-item age;
- wait/service/sojourn distributions rather than only averages;
- retry ancestry and duplicate work;
- CA/HSM/OCSP/CRL/provider quotas;
- priority classes such as compromise revocation versus routine renewal;
- freshness horizon consumed while evidence waits in queues;
- offline reconnect burst and store-and-forward backlog;
- exporter/telemetry backlog separately from local trust decision capacity.

Preserve:

`observed low utilization != current queue health != sustainable capacity != headroom != transient burst tolerance != stability margin`.

Little's Law or M/M/1 may be useful as bounded models only when assumptions hold. Synchronized certificate expiry, compromise/revocation storms, heavy-tailed HSM/provider latency, finite queues, rate limits, retry storms, priorities and correlated provider failures can invalidate stationary/simple models.

A particularly dangerous operational illusion is `low average HSM/CA utilization + old revocation backlog`. The conflict class is already represented by the existing capacity/currentness patterns; this revisit does not create a new pattern.

## Temporal / uncertainty operational coupling

Trust facts require time qualification. Candidate distinctions:

- certificate validity interval;
- signature creation/verification time;
- policy/authorization effective interval;
- trust-anchor/bundle effective interval;
- revocation-event time;
- status-evidence `thisUpdate/nextUpdate/producedAt`;
- provider-binding effective interval;
- restore point and restored trust epoch;
- deployment/build cohort effective interval;
- local evidence observation time versus Fleet ingestion time.

In-flight work can cross trust revisions. A signature valid when an action began may remain valid as historical evidence while current continuation/approval authority changes. Research therefore preserves historical observed facts independently from current qualification, forecasts, simulations or counterfactuals.

`historical proof remains evidence of what was valid/observed then; it does not silently re-authorize action now`.

## Causal / counterfactual boundary

Fleet may observe co-movement such as certificate failures increasing after a provider migration, trust-bundle rollout or site reconnect. Causal analysis can be useful only when assumptions, causal graph/model, confounders and uncertainty are explicit.

Examples of confounders include concurrent software rollout, clock error, network partition, provider outage, site maintenance, load burst and certificate cohort age.

Preserve:

`correlation/co-movement != causal effect != authority to mutate provider/trust policy`.

## Legacy Mirroring / Brownfield

Brownfield trust imports may contain:

- certificates without reliable provenance of original enrollment;
- undocumented enterprise/vendor roots;
- duplicated serial/provider-local identifiers;
- archived CRLs/status evidence without currentness semantics;
- site/controller mappings inferred from filenames or operator convention;
- vendor-console configuration that bypasses canonical workflows;
- historical signatures whose signer was valid then but is no longer authorized;
- unsupported certificate extensions/profiles silently ignored by an importer.

The portable requirement remains epistemic: preserve `SUPPORTED / PARTIAL / UNKNOWN / UNSUPPORTED` and source/currentness rather than inventing certainty. Imported evidence can support investigation/reconciliation without becoming canonical authority by default.

## Physical / Peripheral Integration — integration plane only

For VMS, access-control, PDV, BMS/HVAC, biometric and similar specialized systems:

- Fleet may observe connector certificate/token/session expiry, trust/provider health, resource mappings, provisioning drift and event freshness;
- external specialized systems remain their control/media/runtime planes by default;
- a valid reader/controller/gateway certificate does not prove current physical state or canonical human/site authorization;
- old anchors retained by an offline controller are a currentness/reconciliation problem, not permission for Fleet to actuate the device;
- cross-site trust-anchor or account/resource mapping leakage is forbidden even when provider-native identity is syntactically valid;
- queue/capacity focus stays on connector/API/event/reconciliation pressure, not physical actuation throughput unless explicitly approved later.

## Operability Elicitation Lens applied to Trust/PKI

Candidate questions that must be answerable for a production-ready Trust capability include:

### Function and degradation

- Como saberemos que certificate/path/status/bundle verification is functioning end-to-end for each verifier class?
- Como saberemos que está degradado — by freshness age, failure distribution, residual cohort, provider health, queue age, or another qualified signal?
- Which results can remain `UNKNOWN/PARTIAL`, for how long, and what local operation is still allowed?
- What loss/delay of revocation or bundle updates is acceptable, and where does the deadline originate?

### Ownership and response

- Who owns CA/issuer, HSM, status provider, trust domain/bundle, enrollment, provider binding, canonical authorization and incident response separately?
- Who receives and acts on expiry, stale revocation, bundle divergence, failed rotation, cross-site leakage or provider-quota alerts?
- What runbook/escalation exists for emergency/vendor-console procedures?

### Capacity and dependencies

- Expected issue/renew/revoke/status rates, peak/burst and reconnect storm shape?
- HSM/CA/OCSP/CRL/provider quotas and shared bottlenecks?
- What headroom and stability margin are required for compromise events rather than only routine traffic?
- Which dependency outage creates `UNKNOWN` versus bounded local degraded operation?

### Recovery and reconciliation

- What trust epoch does a backup/restore belong to?
- How are restored anchors, keys, provider mappings and revocation caches requalified against current policy?
- How are offline/residual cohorts discovered and reconciled?
- Which post-recovery evidence proves service recovery, trust requalification and business convergence independently?

### Change safety

- Canary/staged rollout for anchors, algorithms, profiles, providers and verifier libraries?
- Compatibility matrix across build/deployment/provider/device cohorts?
- Abort/rollback eligibility and residual-cohort handling?
- What post-change validation prevents central rollout success from hiding old-trust cohorts?

### Audit/privacy/cost

- What certificate/device/site identity evidence must be retained, and for how long, without overcollecting personal/location metadata?
- Which emergency changes require immutable/auditable lineage?
- What provider/HSM/status usage/cost/quota dimensions matter operationally without becoming pricing or authorization authority?

Production Readiness Coverage remains independent across:

`OBSERVABILITY | OWNERSHIP | FAILURE_HANDLING | RECOVERY | CAPACITY | CURRENTNESS | SECURITY | RECONCILIATION | CHANGE_SAFETY | COST | DOCUMENTATION`

with:

`UNTOUCHED | PARTIAL | RESOLVED | CONFLICTED | BLOCKED | NA`.

No scalar readiness/health score is authoritative.

## Duplicate-screen against all 124 reusable ConflictPatterns

No distinct 125th reusable pattern survived.

| Candidate | Classification / existing coverage |
| --- | --- |
| restore from epoch E1 resurrects anchor/key withdrawn in current epoch E2 | restore resurrection + version/recovery + trust currentness — DUPLICATE |
| certificate/path remains cryptographically valid after role/site/provider authority withdrawal | proof/authority conflation + authority currentness — DUPLICATE |
| OCSP/CRL/bundle split-view leaves verifier cohorts disagreeing while each local parser is healthy | evidence currentness/completeness + residual cohort + false convergence — DUPLICATE |
| offline controller retains old trust anchor and reconnects after rotation | residual cohort + stale evidence + reconciliation — DUPLICATE |
| provider substitution exposes same feature label with broader trust namespace/profile | provider semantic mismatch + authority non-amplification — DUPLICATE |
| same trust material associated to wrong tenant/site/trust domain | namespace/identity mapping + cross-tenant/site leakage — DUPLICATE |
| HSM/CA low average utilization hides revocation backlog whose age exceeds freshness/SLO | resource/capacity conflict + currentness + analytical-kind conflation — DUPLICATE |
| compromise-revocation work starves behind routine renewal traffic | priority/starvation + resource/capacity + time-to-harm — DUPLICATE |
| telemetry/exporter shows green from last successful sample while local trust source/provider is partitioned | stale-green evidence + observability/currentness conflation — DUPLICATE |
| emergency vendor-console certificate change is operationally necessary but has unclear owner/audit/reconciliation | human-procedure + semantic/authority ownership conflict — DUPLICATE |
| Brownfield certificate/config import silently ignores unsupported extension/profile | unsupported semantic scope + evidence completeness + Brownfield assimilation — DUPLICATE |
| valid signed artifact/device credential is treated by AI/generated workflow as current authorization | AI proof-strengthening + authority non-amplification — DUPLICATE |
| Fleet correlates failures with provider rollout and automatically switches trust provider/anchors | causal overclaim + control-authority amplification — DUPLICATE |
| feature-complete Trust implementation has no owner, recovery proof, freshness threshold or post-change validation | Production Readiness false completeness + ownership/recovery/currentness — DUPLICATE |

No `ConflictInstance` is asserted. No `ConflictSignal` is promoted to `ConfirmedConflict`. No remediation is executed.

## Material finding assessment

New material local edge findings: **0**.
New cross-capability material findings: **0**.
New reusable ConflictPatterns: **0**.
New ConflictInstances: **0**.
New preventive invariant candidates: **0**.
HIGH/CRITICAL without owner/proof/detection route: **0**.

The strongest probes remain materially covered by existing reusable classes. Therefore the Enterprise Trust local no-material streak remains **2 capped**; the already-covered mandatory cluster streaks remain **2 capped** and are not inflated.

## Detection candidates and future proof obligations — research only

Carry forward as detection/proof candidates, not implementation:

1. trust decisions record qualified time, trust-domain/anchor/bundle revision, verifier profile, status evidence and canonical/provider/site context;
2. restore/recovery proof requalifies trust material against current policy/authority rather than trusting backup provenance alone;
3. residual/offline cohort detection across build/deployment/provider/trust revision;
4. revocation/status/bundle freshness and backlog-age visibility without scalar-green masking;
5. trust namespace isolation across tenant/client/site/provider;
6. explicit separation between cryptographic proof, authentication identity, canonical authorization and physical-control authority;
7. alert-to-owner/runbook/escalation traceability;
8. queue/stability qualification for routine and incident burst classes;
9. staged rotation/provider-substitution compatibility and post-change convergence evidence;
10. Brownfield unsupported/unknown trust semantics surfaced rather than silently discarded;
11. local-autonomy proof showing Fleet/SB/Observe outage cannot block already-qualified client execution;
12. causal/AI analysis cannot strengthen evidence into control authority.

## Planning C / D / E carry-forward — research only

Carry forward without materializing architecture:

- time-qualified trust/currentness semantics and trust epochs;
- operational elicitation metadata and multidimensional Production Readiness Coverage;
- trust namespace/site/tenant/provider boundaries;
- local-autonomy and Fleet non-authority proofs;
- recovery/reconciliation and residual-cohort proof domains;
- queue/capacity/stability and incident-burst assumptions;
- provider qualification/substitution compatibility;
- observe-versus-control/change authority separation;
- Brownfield evidence/currentness/unsupported-scope semantics;
- product proofs for revocation freshness, trust rotation, restore requalification, offline cohort reconciliation, exporter outage and post-change convergence.

## Saturation disposition

- Full Pass 8 capability coverage after this visit: **20/28**;
- Full Pass 8 mandatory cluster coverage: **12/12**;
- completed full passes: **7/8 minimum**;
- Enterprise Trust local streak: **2 capped**;
- mandatory cluster streaks: **2 capped**;
- material edge inventory: **284**;
- reusable ConflictPattern inventory: **124**;
- combined material findings: **408**;
- negative-space: `NOT_STARTED`;
- saturation: `NOT_SATURATED`;
- Planning C: `BLOCKED`.

## Next research target

Continue only Full Pass 8 with **Privacy / Data Governance / Retention / Legal Hold / Residency**. Carry Elicitation/System Understanding and Operability Elicitation into retention/deletion/legal-hold precedence, ownership, evidence retention, privacy-safe telemetry, provider/residency drift, deletion/reconciliation queues, restore resurrection, derived/inferred data, offline/Fleet gaps, currentness, change safety and Production Readiness Coverage. Preserve `legal/retention policy != runtime effect`, `deletion requested != deletion converged`, historical observed facts versus forecast/simulation/counterfactual, and the Physical/Peripheral integration-plane boundary. Duplicate-screen all 124 ConflictPatterns. Privacy streak is already 2 and remains capped absent material novelty. Do not enter Planning C.