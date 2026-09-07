# Generation 2 — Planning C C3.10: Security / Resilience / Failure Recovery Target Architecture

Status: **DECIDED / PASS_FOR_CAPABILITY**  
Phase: `PLANNING_C_TARGET_ARCHITECTURE`  
Capability: `Security / Resilience / Failure Recovery`  
Decision scope: canonical target architecture only. No implementation, Planning D/E execution, WBS, Work Packages, executive TASKs, Construction or product code.

Entry branch head revalidated before persistence: `7f7aac22ed21f4d0680518e03b2bed1a9774e852`.

## 1. Authorities and inherited constraints

Authoritative inputs include `RESEARCH_PIPELINE_STATE.json`, Planning C entry framework, C0 semantic substrate, C1 Elicitation/System Understanding, C2 Physical/Peripheral boundary, C3.9 Governance target, Planning A/B Security boundaries/current-state artifacts, and the inherited adversarial inventory of **284 edge scenarios + 124 ConflictPatterns = 408 material findings** with zero HIGH/CRITICAL lacking owner/proof/detection route.

Constitutional invariants:

- `security control realization != governance assessment`;
- `backup exists != restorable current system`;
- `restore completed != service/effect currentness`;
- `recovery workflow done != verified recovery`;
- `provider healthy != local secure state`;
- `stale trust/authorization/config != safe recovery`;
- `degraded mode != authority expansion`;
- `Fleet aggregate != local security truth`;
- `observed absence of attack != proof of security`;
- `AI recommendation != recovery/security authority`;
- `Research != remediation`; `ConflictPattern != ConflictInstance`; `Signal != ConfirmedConflict`.

NIST CSF 2.0 remains a useful external reference model because it treats Govern, Identify, Protect, Detect, Respond and Recover as a lifecycle rather than making recovery equivalent to a single restore action. NIST SP 800-61r3 likewise integrates incident response with broader risk management rather than isolating recovery as a terminal workflow step.

## 2. Decision summary

Planning C adopts a **revision-qualified Canonical Security, Resilience & Recovery Plane** over C0 identity, evidence/currentness, execution/effect, authority/trust, federation/locality and proof-claim primitives.

The capability owns portable semantics for:

1. security posture and security-control realization state;
2. threat/risk references without absorbing Governance ownership;
3. failure, degradation, isolation and recovery state;
4. fencing, split-brain and concurrency-safety claims;
5. backup, restore, recovery-point/recovery-time and restored-state qualification;
6. re-protection and currentness after restore/failover;
7. ambiguous external effects and reconcile-before-retry;
8. residual authority/provider/session/worker cohorts;
9. local/offline/Fleet security truth and tenant/Station isolation;
10. provider substitution and security evidence/provenance;
11. incident-to-recovery handoff and capacity/backpressure under failure;
12. Brownfield/manual/emergency procedures as evidence-bearing, revisioned procedures rather than implicit truth.

## 3. Canonical identities and revisions

The architecture requires distinct stable identities/revisions for at least:

- `SecurityPostureRef` / revision;
- `SecurityControlRealizationRef` / revision;
- `ThreatReferenceRef` and `RiskReferenceRef`;
- `FailureDomainRef`;
- `DegradedModeDefinitionRef` / revision;
- `RecoveryPolicyRef` / revision;
- `RecoveryOccurrenceRef`;
- `RecoveryCutRef`;
- `BackupSetRef` / revision;
- `RestoreOccurrenceRef`;
- `FencingLeaseRef` / epoch;
- `ResidualSecurityCohortRef`;
- `SecurityEvidenceRef`;
- `IncidentHandoffRef`;
- provider/local/Fleet realization references.

Provider IDs, backup job IDs, session IDs, node IDs and device IDs remain realization identities unless explicitly mapped.

## 4. Security posture is multidimensional

A canonical security posture is not a scalar `secure=true`. It is a qualified vector over applicable dimensions such as confidentiality, integrity, availability, identity/trust, authorization, isolation, configuration/currentness, resilience/recovery readiness, evidence freshness and unresolved risk.

Each dimension may be `SATISFIED`, `PARTIAL`, `INCONCLUSIVE`, `FAILED`, `BLOCKED`, `DEFERRED` or explicitly `NOT_APPLICABLE` with rationale. Missing/stale evidence cannot be collapsed to success.

## 5. Threat/risk references do not collapse Governance ownership

Security may reference threats, attack paths, hazards and risks to decide or evaluate technical control realization. Governance remains owner of obligation/applicability/compliance assessment and accepted-risk/waiver semantics.

`risk accepted != control disabled` and `control realized != compliant`.

## 6. Failure and degraded-mode semantics are explicit

Failure modes must distinguish at least unavailable, partitioned, stale, overloaded, isolated, partially functional, externally ambiguous and compromised/suspect states.

A degraded mode declares:

- affected capability/scope;
- admitted operations;
- prohibited operations;
- authority ceiling;
- evidence/currentness requirements;
- local/offline constraints;
- expiry/review condition;
- recovery transition.

Degradation cannot create permissions or trust that did not exist before failure.

## 7. Fencing and split-brain safety are first-class

Where concurrent actors can mutate shared or externally authoritative state, recovery/failover must qualify who currently owns the right to act. A `FencingLease` or equivalent epoch/term mechanism must bind actor, resource/scope, epoch, authority source, validity interval and supersession.

`new leader elected != old actor unable to act`.

Proof of recovery therefore includes old-path quiescence or explicit residual-cohort disposition when duplicate/late effects remain possible.

## 8. Backup semantics are population-, revision- and integrity-qualified

A backup is not merely a successful job. It must identify protected population, source revision/vector, capture cut/time, consistency semantics, encryption/trust context, integrity evidence, excluded/unsupported populations and restore prerequisites.

`backup success != complete protected population != restorable current system`.

Brownfield exports, spreadsheets, manual archives and provider snapshots remain qualified evidence and cannot be silently promoted to complete canonical backup coverage.

## 9. Restore uses a recovery cut and preserves historical truth

A restore creates a new operational lineage from a defined `RecoveryCut`. It does not rewrite history. The architecture must preserve:

- restored source revision/cut;
- current target revision;
- objects/resources omitted or reconstructed;
- identities, credentials, trust anchors and policies crossing the cut;
- external effects that occurred after the cut;
- caches/watchers/materialized views whose revision is now ahead of restored source state;
- reconciliation obligations.

`restored data integrity != current authority != external convergence`.

## 10. Recovery-point and recovery-time are typed claims

RPO/RTO and analogous objectives are declared units-bearing targets with explicit scope, clock and population. Actual recovery measurements are separate observations with provenance and uncertainty.

Meeting a service-level timer does not prove semantic recovery, security re-protection or downstream convergence.

## 11. Re-protection after restore/failover is mandatory

A recovery cannot be considered verified until applicable protection state is requalified, including where relevant:

- credential/session validity and revocation;
- authorization/policy revision;
- trust-anchor/certificate/key state;
- secrets/configuration revision;
- tenant/Station isolation;
- logging/audit/monitoring availability;
- backup protection and legal/privacy constraints;
- provider bindings;
- offline/local/Fleet security state.

Stale restored trust or authorization is not safe merely because service starts.

## 12. Ambiguous external effects require reconciliation before retry

Security/recovery inherits C0 `EffectDisposition = NOT_APPLIED | APPLIED | PARTIAL | UNKNOWN`.

If failure obscures whether an externally visible mutation occurred, `UNKNOWN` is preserved. Retry is permitted only when duplicate safety is proven for the qualified scope; otherwise reconcile before retry.

Provider acknowledgment, timeout or recovery workflow completion does not establish business-effect disposition.

## 13. Residual cohorts are explicit

Recovery/failover/provider substitution must track residual cohorts such as:

- stale sessions/tokens;
- old workers/agents;
- old provider bindings;
- stale caches/watchers;
- old credentials/trust anchors;
- offline Stations/devices;
- delayed callbacks/events;
- unrevoked grants;
- backup/restore populations still on old revision.

A cutover is not complete while a material residual cohort remains unresolved or explicitly accepted under bounded authority.

## 14. Local/offline/Fleet security uses qualified local closure

Offline/local operation may continue only under an explicit bounded closure defining local authority, credential/trust freshness, allowed operations, maximum staleness, reconciliation obligations and fail-safe behavior.

Fleet aggregation is an observation/control-intent projection, not a substitute for local current proof. `Fleet green != every Station secure/current`.

## 15. Tenant and Station isolation survive failure

Isolation constraints are invariant across degraded mode, recovery and operator emergency actions. Queue starvation, failover, restore, provider substitution or shared emergency credentials must not collapse tenant/Station boundaries.

Any emergency override is separately authorized, time-bounded, scoped, auditable and followed by drain/revoke verification.

## 16. Provider substitution is semantic, not merely operational

A substitute security/recovery provider is admitted through capability-support vectors covering semantics, identity, authority/trust, currentness, offline behavior, recovery guarantees, evidence export, residual cleanup and known unsupported dimensions.

`provider API compatible != security semantics equivalent`.

Provider-native health/status remains evidence only.

## 17. Security evidence and provenance are non-strengthening

Security claims consume qualified evidence with producer identity/revision, scope/population, observation time, currentness horizon, method, confidence/uncertainty, redaction/access limits and correction/supersession lineage.

Absence of alerts, clean scans or successful restore tests cannot be generalized beyond their evidenced population and method.

## 18. Incident-to-recovery handoff is explicit

Incident response and recovery remain linked but distinct occurrences. The handoff records affected scope, containment assumptions, residual compromise hypotheses, trusted recovery source, authority, recovery prerequisites and unresolved questions.

Recovery cannot silently declare an incident resolved; incident closure requires its owning evidence/decision path.

## 19. Capacity/backpressure under failure is part of correctness

Recovery semantics expose queue/backlog populations for revoke, reconcile, replay, reindex, reissue, reauthenticate and residual-cohort cleanup. A technically correct per-item process is not operationally convergent if arrival/backlog pressure prevents drain within required horizons.

Capacity debt remains multidimensional, not a single quality score.

## 20. Brownfield/manual/emergency recovery procedures

Manual runbooks, vendor-console steps, spreadsheets, verbal escalation paths, off-channel approvals and key-person knowledge are first-class discovery evidence. They must be revisioned, ownered and classified as canonical, provider-specific, ambiguous, unsupported or superseded only through explicit adoption/disposition.

Observed manual behavior is not automatically intended process or authorized recovery policy.

## 21. Elicitation / System Understanding Lens

Security/Recovery elicitation cannot be marked complete while any applicable HIGH/CRITICAL dimension remains `UNTOUCHED`, `PARTIAL`, `CONFLICTED` or `BLOCKED` without disposition.

Questions must cover at least authority, source-of-truth, threat/failure assumptions, degradation, rollback/restore, recovery cut, revocation/deprovision, trust/credential currentness, privacy, offline/local/Fleet, tenant/Station isolation, provider substitution, residual cohorts, exception paths, abuse/misuse, evidence, observability, capacity/backpressure and ownership.

Required stakeholder lenses include security, operations/SRE, application owner, identity/authorization owner, data owner, audit/compliance, support, provider/vendor and affected business/process owner where applicable.

`answered != understood`; `stakeholder claim != canonical truth`; AI-generated inference remains `InferredCandidate` until authorized adoption.

## 22. Cross-artifact consistency checks

Planning D/E must preserve checks across:

- security policy/control realization vs authorization;
- recovery workflow vs backup/restore semantics;
- incident state vs recovery state;
- data/storage revision vs runtime/provider state;
- identity/session/revocation state vs restored configuration;
- Governance assessment vs technical security evidence;
- runbook/use case/scenario/acceptance vs actual exception and failure paths.

Contradictions remain visible and owner-routed; summarization cannot select a silent winner.

## 23. Production Readiness Coverage

Publish/operation sufficiency is separate from abstraction/architecture/implementation sufficiency. Security/Recovery production readiness requires evidence for applicable dimensions including restore testing, fencing/residual cleanup, re-protection, provider/offline behavior, tenant isolation, incident/recovery ownership, queue drainability, monitoring/evidence continuity and operator procedures.

A successful installation, green provider status or passing happy-path recovery test cannot independently satisfy publish readiness.

## 24. Physical/Peripheral bounded scope

This capability may govern security posture, identity/trust, connectivity, provider state, recovery evidence and reconciliation for Physical/Peripheral integrations within C2. It does not acquire generic direct physical actuation authority.

Security emergency or recovery status cannot infer permission to actuate doors, machinery or other physical endpoints.

## 25. AI / low-code boundary

AI may propose threats, controls, recovery steps, mappings, likely contradictions and evidence requests. Low-code tooling may materialize declared recovery/control workflows. Neither may:

- promote inference to requirement/fact;
- grant authority;
- weaken a security constraint silently;
- convert `UNKNOWN/PARTIAL/INCONCLUSIVE` into success;
- declare recovery verified from workflow completion;
- infer provider/local/Fleet truth beyond evidence.

Material proposals require provenance, revision, owner and explicit adoption/disposition.

## 26. Planning D constraints

Planning D must preserve migration sequencing for identity/revision adoption, existing security mechanisms, backup populations, provider bindings, authority/trust transitions, residual cohorts, Brownfield procedures and coexistence. Migration must not assume a flag day and must expose unsupported/ambiguous mappings.

No migration step may expand authority merely to simplify cutover.

## 27. Planning E proof obligations

Planning E must include at least these proof families:

1. security-posture dimensional/non-scalar proof;
2. security-control-realization vs Governance-assessment separation;
3. degraded-mode authority non-amplification;
4. fencing/old-path-quiescence proof;
5. backup-population and restore-integrity qualification;
6. recovery-cut/currentness/non-rewrite proof;
7. RPO/RTO units/scope/evidence proof;
8. re-protection after restore/failover;
9. `UNKNOWN -> reconcile-before-retry` for ambiguous external effects;
10. residual authority/provider/session/worker cohort drain/disposition;
11. offline/local/Fleet currentness proof;
12. tenant/Station isolation under failure;
13. provider-substitution support-vector proof;
14. security-evidence provenance/currentness/non-strengthening;
15. incident-to-recovery handoff proof;
16. queue/backpressure drainability under failure;
17. Brownfield/manual/emergency procedure provenance/adoption proof;
18. Elicitation no-false-complete and cross-artifact contradiction proof;
19. Physical/Peripheral non-actuation boundary proof;
20. AI/low-code non-strengthening proof.

## 28. Findings disposition

This Planning C decision creates **no remediation**, no `ConflictInstance`, no new `ConflictPattern` and no new material edge finding. The inherited 408 findings remain active as architecture constraints and Planning E proof routes. Any future repository-specific observation remains a `Signal` until confirmed through its proper route.

## 29. Capability gate

**C3.10 = DECIDED / PASS_FOR_CAPABILITY.**

Planning C remains **ACTIVE / OPEN**. This advances C3 coverage to **10/28**. C3.11 and later capabilities remain untouched in this action; Planning D/E, Architecture Reconciliation, WBS, Work Packages, executive TASKs, Construction and product code remain blocked.