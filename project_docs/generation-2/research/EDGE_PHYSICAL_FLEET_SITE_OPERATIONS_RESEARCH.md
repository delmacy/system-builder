# Generation 2 — Edge / Physical Fleet / Site Operations Research

Status: ACTIVE CROSS-CUTTING RESEARCH FRONT / ARCHITECTURE HYPOTHESIS ONLY
Phase: `RESEARCH_ADVERSARIAL_EDGE_CASE_SATURATION`
Authority: `RESEARCH_PIPELINE_STATE.json`, `POST_MATH_ADVERSARIAL_EDGE_CASE_SATURATION_RESEARCH.md`, `PROCESSUAL_SEMANTIC_CONFLICT_CLASSIFICATION.md`

Research only. This artifact does not authorize target architecture, remote-control implementation, Work Packages, TASKs or Construction. Preserve `ConflictPattern != ConflictInstance`, `Signal != ConfirmedConflict`, `last reported state != current physical truth`, `local evidence != exported telemetry != Fleet aggregate != control authority`, and `Shared infrastructure != shared truth/authority`.

## 1. Research objective

Investigate how Generation 2 can reason about physical sites, edge gateways and device fleets without making Fleet/SB/Observe a runtime dependency or central actuation authority. A site/edge system must continue its authorized local operation when central connectivity or Fleet analytics is unavailable and must degrade according to locally available safety, authority, evidence and capacity semantics.

This front extends, but does not replace, the existing Autonomous Builds × Fleet Observability/Capacity hypothesis. Physical fleets add direct-world effects, attachment/location semantics, device replacement identity, safety state and local control loops that make stale or over-strengthened projections especially dangerous.

## 2. Candidate topology — HYPOTHESIS / IN RESEARCH

Candidate projection hierarchy:

`Enterprise -> Client -> Site -> Building -> Floor/Zone -> EdgeGateway -> DeviceClass -> DeviceInstance -> Sensor/Actuator/Peripheral -> Invocation/Event`

This is a research projection, not a committed canonical graph. The hierarchy may need non-tree edges for shared gateways, redundant controllers, devices serving multiple zones, VMS/controller relationships and physical/electrical/network dependencies.

Required separation candidates:

- semantic topology: what capability/process means and which physical attachment/location constraints are intrinsic;
- build topology: software/firmware/config artifacts and compatible realizations;
- deployment topology: which revisions are targeted/adopted by which gateway/device cohorts;
- runtime/physical truth: what local controller/device is currently doing or sensing;
- local journal/evidence: site-authoritative execution/diagnostic evidence available offline;
- exported telemetry: delayed/duplicated/incomplete projection;
- Fleet aggregate: read/analysis projection across clients/sites/cohorts;
- control authority: explicit authorization to command a concrete site/device under a qualified revision/policy/safety context.

`Fleet visibility != remote actuation authority` and `same capability label != physically substitutable realization`.

## 3. Operational vectors

Candidate physical operational vectors remain multidimensional facts, not scalar health scores.

### `DeviceOperationalVector`

Candidate dimensions: connectivity/currentness, heartbeat age, firmware/software/config revision, CPU/RAM/storage where applicable, queue/backlog, telemetry lag, error/retry rate, battery/power, RF/signal quality, temperature/environment, calibration status, gateway/provider health, physical-state confidence, safety/interlock state and maintenance/quarantine state.

### `EdgeGatewayCapacityVector`

Candidate dimensions: attached device count by protocol/class, protocol-session count, polling/stream arrival rates, message/event throughput, command throughput, queue depth and age, local storage/WAL retention horizon, CPU/RAM/I/O/network pressure, uplink bandwidth, reconnect burst tolerance, provider quotas and dependency health.

### `PhysicalSiteRiskVector`

Candidate dimensions: stale/unobserved cohort size, safety-critical actuator exposure, gateway centrality/cut risk, mixed-version rollout residue, certificate/trust expiry horizon, offline-policy age, telemetry/control resource interference, privacy-sensitive data exposure and recovery/rollback qualification.

These vectors may feed `CapabilityOperationalVector`, `ResourcePressureVector`, `RiskVector` and `ComplexityVector`, but scalarization requires an explicit, versioned, auditable policy and must preserve the causal dimensions used to produce any score/rank.

## 4. Local autonomy and observability

A local runtime or controller should have enough journal/diagnostic state to operate and reconcile locally without Fleet. Export is optional/providerized and should use store-and-forward/buffering subject to bounded storage and pressure policies. Export failure must not block local workflow/control.

Central dashboards must carry freshness/age, gap/completeness and confidence semantics. A green last-reported heartbeat or shadow is a projection about a past observation, not proof that a device, actuator, door, camera or controller is currently healthy or in the same physical state.

Representative evidence:

- OPC UA PubSub status distinguishes publisher status updates, timestamp/next-report-time and subscriber inference when expected cyclic updates are missed: https://reference.opcfoundation.org/specs/OPC-10000-14/7.2.5.5.5
- AWS IoT Greengrass supports local shadow operations separately from optional cloud synchronization, demonstrating a concrete local-first state projection pattern: https://docs.aws.amazon.com/greengrass/v2/developerguide/interact-with-shadows-in-components.html
- NIST SP 800-82 Rev. 3 treats OT as systems that monitor/control direct physical processes and emphasizes their special reliability, performance and safety requirements: https://csrc.nist.gov/pubs/sp/800/82/r3/final

Portable consequence: the central representation must expose observation time/currentness and must not silently strengthen historical reported state into current physical truth.

## 5. Queueing / flow / capacity

Physical fleets form interacting queue networks rather than one utilization scalar. Relevant queues include sensor sampling/polling, gateway ingress, local processing, video metadata/events, commands, audit/event export, firmware/config rollout, offline storage/WAL, reconnect replay and provider uplink.

Research distinctions remain:

`observed low utilization != current queue health != sustainable capacity != headroom != transient burst tolerance != stability margin`.

Key adversarial regimes:

- reconnect storm after site/uplink recovery;
- telemetry flood competing with local control/command processing;
- camera/VMS metadata or stream load saturating shared uplink/storage;
- access/turnstile bursts exceeding controller/gate service capacity;
- kiosk/PDV offline queue replay producing duplicates or stale operations;
- retries amplifying provider/device command load;
- shared edge gateway acting as cut/bottleneck and blast-radius multiplier;
- priority inversion/starvation where low-value telemetry delays safety/business-critical control;
- finite local buffers silently dropping evidence;
- provider quota mistaken for intrinsic gateway/device capacity.

Little's Law, M/M/1-like models and steady-state queue models are analysis tools only when their assumptions are qualified. Bursty, correlated, heavy-tailed, finite-buffer and revision-changing physical workloads require empirical distributions, uncertainty and topology-qualified analysis.

## 6. Device/update rollout semantics

Firmware/software/config rollout must remain cohort- and revision-qualified. Research must preserve canary/staged rollout, compatibility matrix, maintenance window, signed artifact/config evidence, rollback eligibility, quarantine and residual mixed-version cohorts.

AWS IoT Jobs provides representative evidence that fleet rollouts expose explicit rollout rate, abort threshold, timeout, retry and maintenance-window controls and that cancellation may leave in-progress or terminal device executions unaffected or only eventually reflected centrally: https://docs.aws.amazon.com/iot/latest/developerguide/jobs-configurations-details.html and https://docs.aws.amazon.com/iot/latest/developerguide/manage-job-cli.html

AWS IoT Greengrass also documents that devices offline during a deployment receive the latest target deployment when they reconnect and that deployment failure can trigger local rollback, demonstrating that central desired state and per-device effective state are distinct cuts: https://docs.aws.amazon.com/greengrass/v2/developerguide/manage-deployments.html

Portable consequence: `rollout requested != device notified != device accepted != device effective != physical/business behavior converged`. A mixed cohort is not an error by definition, but it must remain visible and compatibility-qualified.

## 7. Domain-specific lenses

### Camera / VMS

Default research posture: VMS/provider remains the media plane where appropriate; Fleet observes health, metadata, authorized links/projections and resource pressure rather than becoming a central raw-video dependency. Preserve bandwidth, storage, retention, privacy and site-local analytics trade-offs. ONVIF's transition from Profile S toward Profile T is representative evidence that interoperability profile/version/security assumptions evolve independently from camera semantic identity: https://www.onvif.org/pressrelease/onvif-to-end-support-for-profile-s/

### PDV / kiosk / peripherals

Preserve station/device pairing, device-instance identity, local transaction queue identity, offline replay, signed config/update, maintenance windows and residual cohorts. Device replacement must not silently inherit the old device's trust, attachment or authoritative station binding without qualified adoption.

### Access / turnstile / gate

Preserve controller/reader/actuator topology, credential-policy revision, offline cache age, local authorization autonomy, audit/export gaps and emergency/manual mode. Fleet may surface stale-policy exposure but cannot infer unrestricted command authority from visibility.

### HVAC / building / OT

Preserve local controller loops, zones/sensors/actuators, setpoint policy, occupancy evidence, energy/cost/capacity vectors, interlocks, safety state and manual override. An enterprise optimizer may propose changes only within explicit physical compatibility, authority and safety constraints. It must not fight a local controller or erase local/manual override semantics.

## 8. FinOps coupling

Physical fleet costs create shared-resource allocation problems: gateway hardware, site uplink, VMS/storage, energy, support labor, provider subscriptions and shared licenses can serve many devices or zones. FOCUS 1.4 split-cost allocation is representative evidence that shared-resource cost allocation depends on explicit allocation method/details and allocated-resource identity rather than arithmetic alone: https://focus.finops.org/docs/specification/v1-4/features/data-generator-calculated-split-cost-allocation/

`BilledCost != EffectiveCost != allocated physical-site cost != operational capacity entitlement != authority to change placement/config`.

Missing physical telemetry cannot become zero use/cost, and a cost optimizer must not "move" a capability to a cheaper device/site when physical location, attachment, safety certification, local data residency or device class is part of semantic compatibility.

## 9. Adversarial candidate screen against existing ConflictPatterns

The following candidates are material to the research front but duplicate-screen into existing reusable families; no new `G2-CONFLICT-PATTERN-*` is created in this increment.

### A — stale green dashboard during site outage

Activation: last successful heartbeat/health is retained while site/uplink/gateway is unreachable. Incompatible claims: `last observed healthy` versus `currently physically healthy/reachable`. Detection: observation age, expected-report interval, topology/site reachability, local journal on reconnection. Owners: Observability + site/runtime owner + physical capability owner. Severity HIGH–CRITICAL depending on actuator/safety role; confidence strongly supported; detectability runtime/audit; blast radius device-to-site; reversibility easy for display claim, potentially irreversible if acted upon; time-to-harm immediate; misuse accidental/plausible; evidence stale; false-positive risk medium during planned offline periods. Future route: downgrade confidence/currentness and require local/current evidence before consequential action. Duplicate families: evidence currentness/presence, proof-claim conflation, runtime-versus-projection.

### B — telemetry flood starves local control

Activation: export/diagnostic/video/event load shares bounded gateway CPU/RAM/I/O/network/queue resources with local control. Incompatible claims: `observability load is non-functional/advisory` versus `same resources are required for time-sensitive local operation`. Detection: class-aware queue/service latency, dropped control events, pressure vectors, priority/resource partition evidence. Owners: site runtime + observability + physical-control owner. Severity CRITICAL for safety/control; confidence supported; detectability runtime; blast radius gateway/site; reversibility bounded before physical effect; time-to-harm immediate; misuse plausible; evidence current; false-positive risk medium because some sites overprovision. Future route: owner-qualified admission/resource isolation or shedding policy in later architecture; research does not implement it. Duplicate families: resource/capacity conflict, objective conflict, observability/runtime proof boundary.

### C — reconnect storm overwhelms gateway/provider and creates false recovery

Activation: offline devices reconnect together and replay buffered telemetry/events/commands. Incompatible claims: `connectivity restored` versus `system stable/converged`. Detection: arrival-rate burst, queue age/depth, retry ancestry, local-versus-export completeness, device cohort progress. Owners: runtime/provider/observability. Severity HIGH; confidence strongly supported; detectability runtime; blast radius site/provider; reversibility bounded; time-to-harm immediate/cumulative; misuse accidental; evidence mixed/late; false-positive risk low. Future route: bounded replay/admission/backpressure policy candidate. Duplicate families: retry amplification, resource/capacity, false convergence, temporal/currentness.

### D — wrong device binding after replacement

Activation: device is physically replaced but station/site/config/trust/provider identifiers are reused or inferred from the old device. Incompatible claims: `replacement provides equivalent function` versus `replacement is the same canonical physical subject/authorized attachment`. Detection: hardware/device identity, commissioning/adoption evidence, site/zone/station binding revision, trust/config revision. Owners: identity/binding + site owner + security/trust + capability owner. Severity HIGH–CRITICAL; confidence strongly supported; detectability commissioning/pre-execution; blast radius station/site; reversibility bounded before actuation; time-to-harm immediate; misuse plausible; evidence currentness must be explicit; false-positive risk medium where approved replacement intentionally inherits a station role. Future route: explicit adoption/rebinding/reconciliation. Duplicate families: false entity convergence, identity drift, semantic ownership, provider/binding substitution.

### E — Fleet optimizer selects a physically impossible or unauthorized realization

Activation: devices/gates/controllers expose equivalent capability labels, while physical location/attachment, safety certification, authority, data locality or provider contract differs. Incompatible claims: `semantic feature compatibility` versus `physical substitutability for this invocation`. Detection: time-qualified topology + attachment constraints + capability contract + authority/policy + locality + safety evidence. Owners: semantic capability + site/physical owner + authorization/policy + optimization owner. Severity CRITICAL; confidence strongly supported; detectability design/pre-execution; blast radius site/external parties; reversibility potentially irreversible after physical effect; time-to-harm immediate; misuse likely for generic optimizers; evidence currentness current/unknown; false-positive risk low when constraints are explicit. Future route: optimizer must remain inside qualified feasible set and advisory/authorized boundary. Duplicate families: compatibility direction, provider semantic mismatch, authority non-amplification, objective/optimization conflict, structural topology conflict.

### F — firmware/config rollout leaves a residual unsafe cohort

Activation: rollout target includes incompatible/offline devices; abort/cancel/rollback occurs after some devices applied changes. Incompatible claims: `rollout canceled/failed centrally` versus `all devices reverted/safe`. Detection: per-device revision/effective state, rollback evidence, compatibility matrix, residual cohort inventory, safety state. Owners: lifecycle/deployment + device trust + site owner. Severity HIGH–CRITICAL; confidence strongly supported; detectability runtime/post-effect; blast radius cohort/site/fleet; reversibility migration/field-service may be required; time-to-harm immediate/latent; misuse accidental; evidence incomplete during offline periods; false-positive risk low. Future route: residual-cohort reconciliation/quarantine/rollback qualification. Duplicate families: partial/unknown effect, residual cohort, false rollback safety, version coexistence.

### G — cross-site command caused by projection or tenant aliasing

Activation: dashboard/automation resolves a command target through stale/ambiguous provider IDs, site aliases or aggregate topology. Incompatible claims: `target has requested capability` versus `target belongs to authorized client/site/device context`. Detection: explicit client/site/device canonical identity, current binding revision, authority scope, command intent and local acceptance evidence. Owners: authorization + site/device identity/binding + runtime. Severity CRITICAL; confidence supported; detectability pre-execution/runtime; blast radius external parties/physical safety; reversibility potentially irreversible; time-to-harm immediate; misuse accidental/adversarial; evidence currentness must be current; false-positive risk low. Future route: explicit scoped target qualification and local authority checks in later architecture. Duplicate families: authority non-amplification, cross-tenant leakage, identity/entity resolution, confused deputy.

## 10. Causal / counterfactual boundary

Fleet correlation may help form hypotheses about site outages, gateway pressure, firmware rollout effects, HVAC energy changes, camera bandwidth saturation or access congestion, but correlation/co-movement is not causal proof and never grants control authority.

Any future causal/counterfactual analysis must state the causal question/intervention, graph/model, confounders, temporal topology/revision, selection/missingness, offline cohorts and uncertainty. Historical observed facts, forecasts, simulations and counterfactuals must remain typed separately.

## 11. Carry-forward to Planning C/D/E

Planning must consume, without prematurely implementing:

- site/edge topology and attachment semantics;
- local autonomy and local-journal sufficiency;
- explicit `last reported != current physical truth` currentness UX;
- physical/device/gateway operational vectors without scalar collapse;
- queue/network stability, backpressure, reconnect-burst and physical-throughput proof obligations;
- rollout/update/rollback/residual-cohort model;
- device replacement/rebinding and quarantine semantics;
- remote-control authority boundary with explicit client/site/device context;
- no cross-site/tenant leakage proof obligations;
- media-plane/VMS provider boundary and privacy minimization;
- physical placement/optimization feasible-set constraints;
- causal-analysis non-authority boundary.

This artifact intentionally stops at architecture hypotheses, detection candidates and future proof obligations.

## 12. Disposition

- New canonical capability: **0**.
- New mandatory cluster: **0 in this increment**; treat Edge/Physical Fleet/Site Operations as a mandatory cross-cutting lens for remaining passes unless later evidence justifies taxonomy/cluster backfill.
- New edge IDs: **0**.
- New cross-edge IDs: **0**.
- New reusable ConflictPatterns: **0** after duplicate-screen against the existing 124-pattern catalogue.
- ConflictInstances: **0**.
- Preventive implementation work: **0**.

Research disposition remains `CATALOGUE + CLASSIFY + DETECTION_CANDIDATE + FUTURE_REMEDIATION_ROUTE`.
