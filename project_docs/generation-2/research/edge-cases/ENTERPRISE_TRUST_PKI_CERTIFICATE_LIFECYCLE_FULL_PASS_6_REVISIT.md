# Generation 2 — Enterprise Trust / PKI / Certificate Lifecycle — Full Pass 6 Revisit

Status: `ELIGIBLE NO-NEW-MATERIAL REVISIT`
Phase: `RESEARCH_ADVERSARIAL_EDGE_CASE_SATURATION`
Full pass: 6
Disposition: `CATALOGUE + CLASSIFY + DETECTION_CANDIDATE + FUTURE_REMEDIATION_ROUTE`

## Authority and scope

Research only. This revisit follows `RESEARCH_PIPELINE_STATE.json`, `POST_MATH_ADVERSARIAL_EDGE_CASE_SATURATION_RESEARCH.md`, `PROCESSUAL_SEMANTIC_CONFLICT_CLASSIFICATION.md`, `ADVERSARIAL_SATURATION_STATE.json`, prior Enterprise Trust / PKI registers/revisits and the active semantic-graph/federation proof research. It preserves `ConflictPattern != ConflictInstance`, `Signal != ConfirmedConflict`, `cryptographic validity != semantic authority`, `certificate/path validity != workflow/effect proof`, `historical validity != current authorization`, `observed fact != forecast/simulation/counterfactual`, and `Fleet aggregate != runtime truth/control authority`.

No product code, Work Package, executable TASK, Construction, remediation or Planning C architecture was performed.

## Full Pass 6 techniques

This pass deliberately changes technique from the earlier Trust revisit and applies the new operational-mathematics lens:

1. **valid-time / transaction-time slicing** — evaluate certificate/key/anchor/profile validity at issuance, transaction, observation and later audit time independently;
2. **status-flow queue model** — treat issuance, bundle distribution, OCSP/CRL/status publication, revocation propagation and verifier refresh as bounded/asynchronous flows rather than instantaneous booleans;
3. **split-view cohort mutation** — different deployments/builds/verifiers possess different trust bundles, revocation evidence or policy revisions at the same wall-clock time;
4. **queue/backpressure adversarial stress** — burst revocations, provider quotas, status-service saturation, retry storms, stale caches, offline verifiers and delayed telemetry;
5. **decision-kind subtraction** — preserve a valid path while removing the policy/application decision that would authorize the business action;
6. **provenance-chain mutation** — preserve certificate bytes/signature while changing enrollment, issuer, rotation, recovery or trust-domain provenance;
7. **graph-revision mutation** — change trust-domain/anchor topology after proof production and test whether historical proof is silently strengthened under the new graph;
8. **algorithm/profile coexistence** — old/new algorithms, validation profiles and verifier capabilities coexist across autonomous builds;
9. **capacity-state separation** — distinguish observed low verifier utilization, current status-queue health, sustainable validation capacity, headroom, burst tolerance and stability margin;
10. **causal-claim subtraction** — test whether Fleet correlation between certificate failures and provider/deployment changes is promoted into causal or control authority;
11. **human emergency procedure interleaving** — continuity runbook, compromise containment, break-glass trust expansion and later reconciliation conflict;
12. **AI/low-code authority amplification** — generated trust configuration, fallback or provider selection widens trust or treats weak/stale evidence as strong evidence;
13. duplicate-screen against all 124 reusable `G2-CONFLICT-PATTERN-*` families before considering novelty.

## External evidence refreshed

### RFC 5280 — validity and path-validation time are explicit inputs

RFC 5280 defines certificate validity by `notBefore`/`notAfter` and its path-validation algorithm evaluates a path with respect to a supplied time; applications may additionally restrict otherwise valid paths. This is direct evidence that certificate/path validity is a time-qualified cryptographic claim, not a timeless business authorization.

Source: RFC 5280, sections 4.1.2.5 and 6, RFC Editor, accessed 2026-09-06: https://www.rfc-editor.org/rfc/rfc5280

### RFC 6960 — revocation/status evidence has multiple clocks and freshness semantics

OCSP distinguishes `thisUpdate`, `nextUpdate`, `producedAt` and `revocationTime`. A response may be cryptographically valid yet stale/unreliable for the consumer's currentness requirement. This supports preserving source/status time, observation time and decision time independently.

Source: RFC 6960 section 2.4–2.5, RFC Editor, accessed 2026-09-06: https://www.rfc-editor.org/rfc/rfc6960

### RFC 9608 — some certificate profiles intentionally have no revocation channel

RFC 9608 defines `noRevAvail` for cases where revocation information is intentionally not published, including short-lived certificates whose lifetime may be shorter than revocation detection/report/distribution time. Therefore `revocation evidence absent` cannot be universally interpreted as either `good` or `provider failure`; semantics depend on the qualified certificate/profile contract.

Source: RFC 9608, RFC Editor, accessed 2026-09-06: https://www.rfc-editor.org/rfc/rfc9608

### SPIFFE federation — trust-bundle rotation is a propagation problem

SPIFFE Federation requires new keys to be published before use and recommends publication sufficiently in advance for foreign trust domains to retrieve and disseminate the updated bundle; otherwise transient cross-domain authentication failures can occur. It also requires explicit association between trust domain and fetched bundle. The trust-domain/bundle specification exposes a monotonically increasing `spiffe_sequence` for propagation/update ordering when present.

Sources, accessed 2026-09-06:
- https://spiffe.io/docs/latest/spiffe-specs/spiffe_federation/
- https://spiffe.io/docs/latest/spiffe-specs/spiffe_trust_domain_and_bundle/

## Queueing / flow / capacity mathematics applied to trust

### Status and trust propagation as queueing networks

A candidate operational flow is:

`trust/credential change -> issuer/status producer -> publication/cache -> distributor/exporter -> verifier refresh -> local decision`

Each stage may have arrival rate `lambda`, service rate `mu`, queue depth, wait time, service time, sojourn time, concurrency and provider quota. These variables are evidence about flow health; they do not themselves prove certificate validity, revocation state or semantic authority.

Little's Law and M/M/1-family equations are admissible only as model hypotheses under their assumptions. Revocation storms, synchronized rotations, correlated compromise events, cache refresh batching, finite queues, priorities, provider rate limits and heavy-tailed network/service times violate simple stationary/Poisson/exponential assumptions easily.

Therefore preserve:

`observed low utilization != current queue health != sustainable capacity != headroom != transient burst tolerance != stability margin`.

### Adversarial queue cases screened

- **revocation storm / queue amplification:** a compromise produces a burst of revocations and status queries; retry behavior amplifies load;
- **hidden saturation behind averages:** average status latency remains acceptable while tail latency causes some verifier cohorts to exceed freshness horizon;
- **priority inversion/starvation:** ordinary validation traffic starves urgent compromise/revocation propagation, or emergency traffic permanently starves normal issuance;
- **provider quota mistaken for internal capacity:** local verifier/issuer appears healthy while external OCSP/HSM/CA quota is the binding bottleneck;
- **backpressure bypass:** a component drops/ignores status-refresh pressure and continues deciding with stale evidence without exposing `UNKNOWN/PARTIAL`;
- **silent queue loss:** bounded queue overflow loses refresh/status events but exported Fleet averages obscure the missing cohort;
- **unstable feedback:** stale/failing validation triggers retries that increase status-service load and further increase staleness;
- **autoscaling lag:** compute scales after the revocation/status burst but cannot retroactively restore the lost currentness interval;
- **correlated provider failure:** issuer/status/trust-distribution services share dependencies and fail together, invalidating independence assumptions.

All map to existing resource/capacity, currentness, evidence-completeness, residual-cohort, retry/ambiguous-effect or authority families. No new reusable conflict class is required.

## Temporal / uncertainty operational coupling

Trust topology and evidence must be time-qualified. At minimum keep separate:

- certificate/key valid interval;
- trust-anchor/bundle effective interval;
- validation-profile/algorithm revision interval;
- revocation/status evidence interval;
- transaction/effect time;
- observation/export time;
- local verifier refresh time;
- deployment/build effective interval;
- audit/reconciliation time.

A transaction may cross a trust or deployment revision while in flight. A historical signature can remain cryptographically verifiable while current organizational authorization has been withdrawn. A restored/offline deployment may possess an older but internally consistent trust view. These are uncertainty/currentness conditions, not automatic conflicts.

`historical observed fact != forecast != simulation != counterfactual` remains mandatory. Fleet may forecast status-service pressure or simulate anchor rotation, but the forecast cannot mutate local trust semantics or retroactively change historical evidence.

## Causal / counterfactual analysis boundary

Fleet may observe co-movement between certificate failures and a provider change, deployment rollout, algorithm migration, trust-bundle rotation or status-service load. That correlation is useful for hypothesis generation only.

A causal claim requires an explicit causal model/graph, treatment/intervention definition, temporal ordering, candidate confounders, selection/missingness assumptions, cohort compatibility and uncertainty. Examples of confounders include deployment revision, geographic/network path, verifier library/profile, clock state, provider quota, HSM latency, certificate population mix and concurrent policy changes.

Counterfactual questions such as "would failure rate have fallen without the provider switch?" are research/analysis products. They do not grant authority to rotate keys, revoke identities, alter trust stores, switch providers or weaken policy automatically.

## Autonomous Builds × Fleet Observability/Capacity

The candidate lineage remains:

`CanonicalCapabilityRef -> CapabilityUse -> BuildRevision/Release -> RuntimeRealization -> Deployment -> NodeInvocation/Attempt`

For Trust/PKI analysis, joins may additionally require certificate/profile/trust-policy/anchor/status-evidence revisions. Semantic aggregation across builds is safe only when those dimensions are demonstrated compatible for the claim being made.

Preserve the planes:

`semantic topology != build topology != deployment topology != runtime truth != local journal/evidence != exported telemetry != Fleet aggregate != control authority`.

Operational consequences under research:

- local autonomous builds retain sufficient trust/currentness evidence to execute according to their qualified contract without SB/Observe/Fleet;
- exporter failure cannot block workflow;
- offline verification exposes the horizon/quality of revocation/trust evidence rather than silently converting uncertainty to `VALID`;
- Fleet may measure verification throughput/latency/errors, stale-bundle cohorts, status age, queue depth, retries, provider quotas, trust-policy/build dimensions and pressure vectors;
- Fleet rollups must preserve `UNKNOWN/PARTIAL`, missingness and cohort dimensions before aggregation;
- placement/provider-selection optimization is analysis/advice unless semantic, authority, trust, locality and version constraints explicitly authorize actuation;
- shared infrastructure does not create shared trust namespace or shared control authority;
- multidimensional trust/operational facts must not be collapsed into a scalar risk/capacity score unless the scalarization policy is explicit, versioned and auditable.

## ResourcePressureVector / RiskVector / ComplexityVector / CapabilityOperationalVector

Trust operational analysis benefits from preserving dimensions such as:

- status/validation arrival and service rates;
- p50/p95/p99 validation and refresh latency;
- queue depth/backlog age;
- verifier concurrency;
- cache age and freshness horizon;
- failed/unknown/partial validation proportions;
- trust-bundle sequence/revision lag;
- provider quotas/rate limits;
- CPU/RAM/network/HSM/I/O pressure;
- tenant/client attribution;
- trust-domain centrality/fan-in/fan-out;
- blast-radius exposure;
- cost and recovery pressure.

No single scalar is truth. Scalarization, if researched later for prioritization, must identify policy revision, weights/utility function, normalization/units, missing-data treatment and authority boundary.

## Duplicate-screen against 124 reusable ConflictPatterns

No distinct 125th reusable pattern survived.

| Challenged composition | Existing coverage / disposition |
| --- | --- |
| certificate/path valid at audit time promoted to authorization at transaction/current time | proof-claim conflation + authentication/authorization currentness + temporal qualification — DUPLICATE |
| valid historical signature after signer/role/organization authority withdrawal | crypto-authority + authority currentness + historical/current claim separation — DUPLICATE |
| OCSP/status cryptographically valid but stale or future-skewed | evidence-currentness + temporal/presence semantics — DUPLICATE |
| revocation/status propagation queue backlog creates split-view verifier cohorts | residual-cohort + resource/capacity + currentness families — DUPLICATE |
| short-lived/noRevAvail profile interpreted as status-provider outage or universal GOOD | provider/profile qualification + evidence-kind/presence families — DUPLICATE |
| trust-bundle rotation valid locally but foreign cohorts not yet refreshed | trust/currentness + federation continuity + residual cohort — DUPLICATE |
| trust-domain graph/anchor transformation silently reinterprets old proof | graph/revision proof invalidation + certificate composition + proof-claim families — DUPLICATE |
| valid path under one algorithm/profile treated as portable to incompatible verifier/build cohort | revision-vector compatibility + provider/standards qualification — DUPLICATE |
| low average verifier utilization interpreted as sustainable trust-service capacity | analytical-kind conflation + resource/capacity model-qualification — DUPLICATE |
| provider quota/correlated dependency hidden behind healthy local verifier metrics | resource-pressure + provider-qualification + source-population completeness — DUPLICATE |
| Fleet co-movement promoted to causal claim or automatic key/provider action | analytical-kind conflation + authority non-amplification — DUPLICATE |
| emergency runbook widens trust to preserve continuity while containment policy requires contraction | human-procedure + policy/authority + recovery qualification — DUPLICATE |
| AI/low-code generated fallback merges trust domains or strengthens stale/weak evidence | trust namespace + AI composition + authority non-amplification — DUPLICATE |
| local offline build remains operational while Fleet lacks telemetry and central aggregate marks it failed | telemetry completeness/currentness + autonomous runtime/Fleet non-authority — DUPLICATE |

## Processual / semantic conflict classification

All required families were explicitly screened: structural graph; state-transition; semantic ownership; rule/formula/condition; temporal/ordering; resource/capacity; authority/responsibility/SoD; policy/compliance; data/consistency; provider/integration; version/migration/coexistence; exception/compensation/recovery; human-procedure/instruction; cross-process; objective/optimization; and AI/low-code composition.

The strongest reusable candidate is a composition where all local trust artifacts are individually valid but time/profile/cohort/currentness qualifiers differ, causing one component to strengthen a narrow cryptographic claim into current semantic authority. This is already represented by existing proof-claim, currentness, revision, federation, residual-cohort and authority patterns.

No `ConflictInstance` is asserted. No signal is promoted to `ConfirmedConflict`.

## Detection candidates and future remediation routes

Research-only candidates for later architecture/proof phases:

1. preserve validation decision inputs: verifier profile, trust-domain/anchor revision, validation time, status evidence time/currentness and result kind;
2. expose `VALID / INVALID / UNKNOWN / PARTIAL` or equivalent qualified semantics where the underlying provider/profile supports uncertainty rather than coercing uncertainty into success;
3. detect stale/split-view trust cohorts by build/deployment/trust-policy/status-evidence dimensions;
4. monitor queue depth, backlog age, retry amplification, freshness-horizon consumption and provider quota without treating these metrics as authority;
5. qualify historical proof separately from current organizational authorization;
6. invalidate or requalify proof interpretations when trust topology/profile transformations change the proof domain;
7. preserve explicit owner boundaries among identity, authorization, enterprise trust, provider realization, recovery and workflow semantics;
8. keep human emergency trust procedures versioned and reconcile widened trust after the emergency condition ends;
9. keep causal/counterfactual products labelled analytical and non-authoritative unless a later explicit policy grants a bounded actuation path.

These are `DETECTION_CANDIDATE + FUTURE_REMEDIATION_ROUTE` / proof-obligation inputs only, not implementation mandates.

## Planning C / D / E handoff candidates — research only

Carry forward, without materializing architecture now:

- time-qualified trust/certificate/status semantics;
- queue/capacity semantics for trust/status propagation and freshness deadlines;
- stability/pressure model that keeps multidimensional vectors intact;
- workload/admission/degradation semantics for trust providers without silent fail-open strengthening;
- vector/scalarization policy boundary;
- optimization provider boundary constrained by semantic/authority/trust/data-locality/version contracts;
- causal-analysis boundary with explicit assumptions and non-authoritative default;
- product proofs for autonomous operation during Fleet outage, split-view/currentness exposure, trust-domain isolation, historical/current claim separation and evidence lineage.

## Saturation disposition

- new local material edge scenarios: **0**;
- new cross-capability material scenarios: **0**;
- new reusable ConflictPatterns: **0**;
- new ConflictInstances: **0**;
- new preventive invariant candidates: **0**;
- HIGH/CRITICAL without owner/proof/detection route: **0**;
- Enterprise Trust / PKI / Certificate Lifecycle local no-material streak: remains **2 capped**; no inflation;
- mandatory cluster streaks: remain **2 capped**; no inflation;
- material edge inventory: **284**;
- reusable ConflictPattern inventory: **124**;
- combined material findings: **408**;
- Full Pass 6 capability coverage after this visit: **20/28**;
- Full Pass 6 mandatory cluster coverage: **12/12**;
- completed full passes: **5/8 minimum**;
- negative-space: `NOT_STARTED`;
- saturation: `NOT_SATURATED`;
- Planning C: `BLOCKED`.

## Next research target

Continue only Full Pass 6 with **Privacy / Data Governance / Retention / Legal Hold / Residency**. Duplicate-screen all 124 reusable ConflictPatterns and apply the operational-mathematics lens to privacy-purpose/currentness, retention/deletion/legal-hold queues, residency/provider changes, delayed/offline telemetry and deletion evidence, derived/inferred data, backup/restore resurrection, cross-tenant attribution, resource/capacity pressure, temporal topology, uncertainty, causal overclaim and AI/low-code composition. Preserve autonomous-client operation, Fleet non-authority and GraphDB optional/provider-level. Do not enter Planning C.