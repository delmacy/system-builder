# Generation 2 — Identity / Authentication / Federation — Full Pass 6 Revisit

Status: ACTIVE — ELIGIBLE NO-NEW-MATERIAL REVISIT
Phase: `RESEARCH_ADVERSARIAL_EDGE_CASE_SATURATION`
Capability: Identity / Authentication / Federation
Pass: 6
Authority: `RESEARCH_PIPELINE_STATE.json`, `ADVERSARIAL_SATURATION_STATE.json`, `POST_MATH_ADVERSARIAL_EDGE_CASE_SATURATION_RESEARCH.md`, `PROCESSUAL_SEMANTIC_CONFLICT_CLASSIFICATION.md`, `IDENTITY_AUTHENTICATION_FEDERATION_EDGE_CASE_REGISTER.md`.

Research only. No product code, Work Package, TASK, Construction, implementation guard or remediation is authorized. Preserve `ConflictPattern != ConflictInstance` and `Signal != ConfirmedConflict`. Default disposition is `CATALOGUE + CLASSIFY + DETECTION_CANDIDATE + FUTURE_REMEDIATION_ROUTE`.

## 1. Pass-6 technique rotation

This revisit deliberately used techniques materially different from Passes 1–5:

1. **time-qualified identity graph slices** — model subject/account/session/credential/issuer/key/link edges with effective intervals, then cross in-flight work over graph revision boundaries;
2. **control-event queue-network falsification** — treat revoke/logout/credential-change/assurance-change/session-revoked signals as flows through transmitter, stream, receiver, cache, verifier and runtime queues; test latency, backlog, loss, priority inversion and partial reachability;
3. **queueing-model assumption audit** — use `λ`, `μ`, utilization `ρ`, queue depth, wait/service/sojourn time and Little's Law only as conditional models; explicitly falsify stationarity, independence, infinite-buffer and light-tail assumptions under bursts, correlated incidents and retries;
4. **stability-margin versus current-health separation** — challenge `low utilization -> sustainable capacity`, `empty queue -> sufficient headroom`, and `successful revocation endpoint response -> globally converged invalidation`;
5. **revision-crossing workload analysis** — retain the identity/authentication cut consumed by a `NodeInvocation/Attempt` when subject/session/key/provider topology changes while work is in flight;
6. **causal/counterfactual boundary analysis** — challenge Fleet correlations such as `IdP latency spike ↔ login failure spike`, `provider substitution ↔ reduced failures` and `risk score ↔ revocation` so co-movement cannot become causal or authority proof without an explicit causal model, assumptions/confounders and uncertainty;
7. **vector preservation** — keep queue pressure, security risk, latency, uncertainty, provider quota and authority/currentness dimensions separate; no scalar score may silently determine identity or access semantics;
8. **autonomous-build outage inversion** — remove SB/Observe/Fleet while preserving local session/journal behavior, then reconnect with delayed/duplicate/out-of-order telemetry and security events;
9. **duplicate-screen** against all 124 authoritative `G2-CONFLICT-PATTERN-*` before admitting novelty.

## 2. Fresh comparative evidence

External evidence reinforces existing conflict families rather than creating a new one:

- **RFC 7009 OAuth 2.0 Token Revocation** states that revocation invalidation is intended immediately but real deployments may have propagation delay where some servers know and others do not; a 200 response therefore does not prove every downstream runtime cohort has converged. Source: https://www.rfc-editor.org/info/rfc7009/
- **RFC 9700 OAuth 2.0 Security BCP** keeps refresh-token/grant lineage explicit and permits security-event-driven revocation such as password change or logout. Source: https://www.rfc-editor.org/info/rfc9700/
- **NIST SP 800-63B-4 session management** states that IdP and RP sessions are managed separately and that termination is independent; RP reauthentication policy remains authoritative for its session. Source: https://pages.nist.gov/800-63-4/sp800-63b/session/
- **OpenID Continuous Access Evaluation Profile 1.0** defines security events such as session revocation, token-claim change, credential change and assurance-level change; event time is an explicit dimension. Source: https://openid.net/specs/openid-caep-1_0.html
- **OpenID Shared Signals Framework 1.0** supports push/poll event streams, stream lifecycle/status and verification; the specification history explicitly clarifies that transmitters may drop events they cannot deliver. This makes delivery completeness/currentness a separate claim from event generation. Source: https://openid.net/specs/openid-sharedsignals-framework-1_0-04.html
- **CAEP Interoperability Profile draft 01 (21 July 2026)** continues to profile cooperating SSF/CAEP implementations for session-security use cases; protocol interoperability does not erase delivery/currentness or local-policy distinctions. Source: https://openid.net/specs/openid-caep-interoperability-profile-1_0.html

These sources are witnesses only. They do not decide System Builder target architecture.

## 3. Autonomous Builds × Fleet Observability/Capacity

`HIPÓTESE DE ARQUITETURA / EM PESQUISA` only.

Candidate operational lineage remains:

`CanonicalCapabilityRef -> CapabilityUse -> BuildRevision/Release -> RuntimeRealization -> Deployment -> NodeInvocation/Attempt`

For identity/authentication, an invocation may additionally reference a qualified evidence cut such as `{canonical-subject-ref?, issuer/provider, subject-namespace, session/ref, credential/assurance evidence, mapping revision, trust/key epoch, observed-at, effective interval, policy/currentness horizon}`. This is research vocabulary, not a materialized schema.

Preserve:

`semantic topology != build topology != deployment topology != runtime truth != local journal/evidence != exported telemetry != Fleet aggregate != control authority`.

Also preserve:

- `revocation accepted != revocation globally effective`;
- `event generated != event delivered != event processed != runtime behavior converged`;
- `authentication evidence != authorization`;
- `current queue health != sustainable capacity != transient burst tolerance != stability margin`;
- `provider quota != internal capacity`;
- `Fleet co-movement != causal effect`;
- `forecast/simulation/counterfactual != historical observed fact`;
- `shared infrastructure != shared truth/authority`.

SB/Observe/Fleet outage must not block a correctly configured autonomous client runtime. Local policy may intentionally bound offline evidence lifetime; once that horizon is exceeded, privileged claims become insufficient/`INCONCLUSIVE` according to owned policy rather than silently extending authority.

## 4. Queueing / flow / capacity mathematics

Queueing models are useful only with explicit assumptions.

For a security-control propagation stage with arrival rate `λ` and effective service rate `μ`, `ρ = λ/μ` can be a useful local pressure indicator, but `ρ < 1` under an averaged interval does not prove bounded delay when arrivals are bursty/correlated, service times heavy-tailed, buffers finite, priorities exist, retries amplify load, downstream quotas bind or telemetry is delayed. Little's Law (`L = λW`) may relate average population, throughput and sojourn time only for a stable, consistently defined system over the measurement window; it must not be used as authority/currentness proof.

Identity-specific adversarial cases screened:

| Candidate | Activation conditions | Incompatible claims/actions/states | Detection candidate | Owner(s) | Assessment / disposition |
| --- | --- | --- | --- | --- | --- |
| revocation queue backlog exceeds the allowed authority/currentness horizon while login traffic still appears healthy | burst/security incident, shared queue, slow downstream receiver, provider quota | `revoked/current` at producer versus `accepted/current` at stale consumer | event-age distribution, backlog, oldest-unprocessed age, residual-session audit, receiver currentness cut | Identity + Provider/Binding + Authorization policy owner | HIGH, supported, runtime/pre-execution, system blast radius, bounded revocation/reconciliation, immediate/delayed harm, plausible misuse, evidence may be stale/incomplete, false positives where policy explicitly tolerates window; **duplicate** of authentication-currentness + federation-coexistence + resource-boundedness/federated-continuity families |
| priority inversion/starvation delays security-control signals behind ordinary telemetry or refresh workload | shared finite queue / priority policy | low-risk throughput objective versus security currentness obligation | per-class queue age/service rate, starvation detector, deadline-miss signal | Identity + Messaging/Integration realization owner + security policy owner | HIGH, hypothesis-supported, runtime, system/enterprise blast radius, reversible by reconciliation but harm may be immediate; **duplicate**, no new pattern |
| delayed/dropped CAEP/SSF event is interpreted as proof no revocation/credential change occurred | intermittent delivery, dropped event, paused stream, receiver outage | absence-of-signal versus current identity state | stream status/currentness, local expiry horizon, independent requalification, gap detection | Identity + provider realization owner | CRITICAL, strongly supported, pre-execution/runtime/audit, potentially enterprise; **duplicate** of authentication-currentness + federated-continuity + evidence qualification/presence semantics |
| Fleet observes correlated IdP latency and failures and an optimizer automatically changes provider or access policy | shared cause, incident, topology change, delayed telemetry | correlation/forecast signal versus causal/authority claim | causal-model declaration, confounder/uncertainty review, policy/authority gate | Observability analysis owner + Identity/Provider/Authorization owners | HIGH, supported, pre-execution/audit; false positives likely without causal assumptions; **duplicate** of analytical-kind-conflation + authority non-amplification + provider qualification |
| autoscaling or balancing reacts to delayed identity telemetry and oscillates, changing provider placement faster than session/revocation cohorts converge | delayed measurements, scaling lag, residual sessions | capacity objective versus coexistence/currentness safety | control-loop lag/oscillation signals, cohort convergence evidence, revision-targeting audit | Runtime/Provider realization + Identity semantic owner | HIGH, hypothesis, runtime; system blast radius; **duplicate** of federation coexistence + revision/currentness + objective/optimization conflict families |

No candidate survives duplicate-screen as a genuinely new reusable conflict class.

## 5. Temporal / uncertainty coupling

Identity topology is time-qualified. The same subject/account/session/provider edges may be valid in different intervals without being jointly valid at one actuation cut. Planned provider migration, key rotation, role change, revocation and session expiry must remain distinguishable from effective state.

For in-flight work crossing a revision boundary, preserve the consumed authentication/identity evidence and later authority requalification semantics. Do not rewrite history using the latest mapping. Delayed observations carry both event/source time where available and observation/ingestion time; clock skew and missing event timestamps increase uncertainty and may prevent precise ordering.

Forecasts such as expected revocation drain time, session population decay, capacity headroom or incident blast radius remain forecasts. Simulation/counterfactual results remain separate from observed runtime facts.

## 6. Causal / counterfactual research boundary

Fleet can support hypothesis generation: provider latency may correlate with authentication failure, a credential campaign may correlate with revocation load, or a deployment may correlate with session errors. None of those establishes causality.

Any later causal analysis should declare at least: target estimand/question, causal graph/model, intervention/exposure, outcome, confounders, selection/missingness assumptions, temporal ordering, cohort/build/provider compatibility, uncertainty/sensitivity and evidence currentness. Counterfactuals remain analytical artifacts, never runtime authority. A causal estimate must not directly revoke sessions, change identity mappings, widen/narrow authorization, switch providers or rewrite workflow semantics without an independently authorized policy/actuation path.

## 7. Processual / semantic conflict classification

All required families were screened. Queue/backpressure adds a useful operational lens to temporal, resource/capacity, provider, recovery and objective conflicts but does not create a new family. The strongest composition remains: individually correct issuer/session/revocation-stream/receiver/runtime components can disagree because their effective intervals and queue positions never formed one current cut.

`ConflictPattern != ConflictInstance`; `Signal != ConfirmedConflict`.

No concrete System Builder defect is asserted.

## 8. Planning C / D / E handoff candidates

Research-only consequences to carry forward, without materializing architecture now:

- **Planning C:** classify queue/capacity semantics for control-event propagation; preserve pressure/stability vectors and explicit currentness horizons; keep vector facts distinct from scalarized policy decisions; keep Fleet read/analysis plane by default; define a provider/optimizer boundary that cannot change workflow or identity semantics.
- **Planning D:** migration strategy must account for residual issuer/session/event-stream cohorts, queue drain, replay/gap reconciliation, time-qualified topology and version-targeted rollback rather than assuming cutover ACK implies convergence.
- **Planning E:** product proofs should challenge bursty revocation, delayed/dropped events, queue starvation, offline intervals, duplicate/out-of-order delivery, clock skew, provider quota, stale Fleet data, unstable scaling/feedback loops, causal overclaim and autonomous operation while SB/Observe/Fleet is unavailable.

These are proof/architecture consequence candidates, not implementation instructions.

## 9. Saturation disposition

- new local material edge scenarios: **0**;
- new cross-capability scenarios: **0**;
- new reusable ConflictPatterns: **0**;
- new ConflictInstances: **0**;
- new preventive invariants: **0**;
- Identity / Authentication / Federation no-material streak: **2 (preserved; capped, not inflated)**;
- mandatory-cluster streaks: **2 (preserved; all 12 already covered in Pass 6)**;
- material edge scenario inventory: **284**;
- reusable ConflictPattern inventory: **124**;
- combined material findings: **408**;
- HIGH/CRITICAL without owner/proof/detection route: **0**;
- Full Pass 6 capability coverage after this revisit: **16/28**;
- completed full passes: **5/8 minimum**;
- target: **12**, no maximum;
- negative-space review: **NOT_STARTED**;
- saturation: **NOT_SATURATED**;
- Planning C: **BLOCKED**.

## 10. Next rotation

Continue Full Pass 6 with **Authorization / Policy / Organization / Multitenancy**, duplicate-screening all 124 ConflictPatterns and using the same new operational-mathematics lenses where relevant: authorization-decision currentness, policy propagation queues, grant/revoke/use races, tenancy/fairness/noisy-neighbor, reservations/quotas/admission control, policy-graph bottlenecks, break-glass and SoD, temporal policy topology, residual/offline cohorts, Fleet correlation versus causal authority, multiobjective placement/optimization under authority/data-locality constraints and AI/low-code authority amplification. Authorization streak is already 2 and must not be inflated absent material novelty. Planning C remains blocked.