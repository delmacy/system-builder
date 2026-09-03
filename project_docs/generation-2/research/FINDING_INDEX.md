# Generation 2 — Finding Index

Prior stable findings remain authoritative in their capability dossiers, earlier index revisions and pipeline history. Compacting this index does not revoke them.

## Cycle 7 — Extension / Plugin / Marketplace Architecture revisit 6
- **G2-FINDING-EPM-45** — Effective extension qualification is applicability-scoped: package installation, publisher trust, workspace/Station context, requested permissions, granted permissions and runtime-effective capabilities are independent revision-qualified claims.
- **G2-FINDING-EPM-46** — Extension requested capability, granted capability and effective runtime capability require separate typed lineage; runtime consent/revocation or host/workspace scope can make an installed extension less privileged than its manifest request.
- **G2-FINDING-EPM-47** — Published/downloaded/installed/running extension revision are distinct states; update currentness must be cohort-qualified because idle gating, active sessions or administrative pinning can leave consumers on older effective revisions.
- **G2-FINDING-EPM-48** — Containment is an explicit support vector, not an inherent property of `plugin`: ecosystems range from host-equivalent extension authority to network/process isolation, so semantic admission cannot infer blast radius from package type.
- **G2-FINDING-EPM-49** — Extension trust and compatibility evidence has an independent replay/currentness horizon; publisher/signature/workspace/admission evidence may remain historically replayable while no longer qualifying the current grant, host or runtime revision.
- **G2-FINDING-EPM-50** — Ambiguous install/update/activation must use expected-base plus observed installed/runtime revision and reconcile-before-retry; retry without observation can duplicate hooks/processes or overwrite newer effective state.
- **G2-FINDING-EPM-51** — Extension portability is a mixed support vector across package, compatibility, permission model, containment, lifecycle/update, state, offline verification, marketplace and observability; provider substitution closes only after residual version/session/cache/hook/grant/consumer cohorts are drained or dispositioned.
- **G2-FINDING-EPM-52** — Qualified local/offline extension closure and AGWS/AI composition are non-amplifying: locally cached trust/grants have bounded horizons, reconnect requalifies superior state, and composition cannot mint install, marketplace/provider-admin, deployment/recovery or canonical-change authority.

## Cycle 7 — Observability / Operations / Incident revisit 6
- **G2-FINDING-OOI-47** — Effective operational health is an applicability-scoped claim across subject/runtime generation, traffic/cohort, expected population, instrumentation, selection, pipeline, query/evaluation, provider, policy and observation/evidence horizon; no globally current `healthy` fact exists.
- **G2-FINDING-OOI-48** — Signal, selection decision, collection receipt, query/evaluation, alert, notification, incident, acknowledgement, remediation attempt and postcondition are distinct typed identities; success at one boundary cannot prove another.
- **G2-FINDING-OOI-49** — Operational conformance/currentness is revision- and observation-qualified: old green evidence cannot qualify a newer runtime generation, traffic binding, expected population, rule or observation window.
- **G2-FINDING-OOI-50** — NoData, Error, MissingSeries/Stale, PARTIAL and INCONCLUSIVE are evidence states independent of provider presentation; mapping them to Normal/KeepLast/Resolved cannot manufacture observed health or recovery.
- **G2-FINDING-OOI-51** — Operational evidence has independent selection and replay horizons; sampling/retention changes what can be concluded or re-evaluated, and expiry can make later proof unavailable without invalidating historical facts.
- **G2-FINDING-OOI-52** — Alert/incident/remediation mutations with ambiguous acknowledgement require reconcile-before-retry against current incident, ownership, target and expected-base state; blind retry can overwrite newer state or duplicate actuation.
- **G2-FINDING-OOI-53** — Observability/incident provider portability is a mixed support vector, and cutover closes only after semantic comparison plus drainage/disposition of residual signal buffers, rules, notification queues, incidents, escalation/on-call state and consumer cohorts.
- **G2-FINDING-OOI-54** — Qualified local/offline operations and AGWS/AI are non-amplifying: local conclusions/acts remain bounded by delegated closure, reconnect requalifies superior state, and diagnosis/proposal cannot mint incident-command/provider-admin/deployment/recovery/canonical authority.

## Cycle 7 — Deployment / Environment / Runtime revisit 6
- **G2-FINDING-DER-46** — Effective deployment/runtime readiness is applicability-scoped across release, intent/admission, environment/runtime binding, config/secret/schema, provider generation, realization, traffic, readiness/domain evidence, policy/trust and observation horizon.
- **G2-FINDING-DER-47** — QualifiedRelease, DeploymentIntent, AdmissionDecision, RolloutAttempt, RuntimeRealization, ReplicaRevision, TrafficBinding, ReadinessEvidence, RollbackPoint and QualificationClaim are distinct typed identities.
- **G2-FINDING-DER-48** — Runtime readiness/conformance is revision- and observation-qualified.
- **G2-FINDING-DER-49** — Deployment evidence has independent replay horizons.
- **G2-FINDING-DER-50** — Deployment provider portability is a mixed support vector.
- **G2-FINDING-DER-51** — Rollout/rollback/traffic ambiguity requires reconcile-before-retry.
- **G2-FINDING-DER-52** — Provider/environment cutover requires residual runtime/traffic/session/cache/discovery/consumer drainage.
- **G2-FINDING-DER-53** — Qualified local/offline Station runtime operation and AGWS/AI deployment requests are non-amplifying.

## Cycle 7 — Artifact / Release / SBOM / Provenance revisit 6
Findings `G2-FINDING-ARSP-46..53` remain authoritative in the capability dossier and prior index revision.

## Cycle 7 — Build / Dependency Graph / Reproducibility revisit 6
Findings `G2-FINDING-BDGR-45..52` remain authoritative in the capability dossier and prior index revision.

## Cycle 7 — Notifications / Events / Messaging revisit 6
Findings `G2-FINDING-NEM-45..52` remain authoritative in the capability dossier and prior index revision.

## Historical authority
Detailed findings for all other capabilities remain authoritative in their dossiers, earlier index revisions and pipeline history.