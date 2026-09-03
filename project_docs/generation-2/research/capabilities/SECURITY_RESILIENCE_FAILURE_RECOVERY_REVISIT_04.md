# Security / Resilience / Failure Recovery — Revisit 4 (Cycle 5)

## Research question
How should Generation 2 distinguish threat/failure truth, containment, recovery eligibility, recovery actuation and post-recovery qualification so a technically successful restore/failover cannot silently reintroduce compromised state, exceed delegated authority, weaken tenant/Station isolation or claim semantic recovery from incomplete evidence?

## Representatives and evidence/source ledger

| Representative | Evidence class | Material mechanism / implication | Coverage |
|---|---|---|---|
| NIST SP 800-61 Rev. 3 (2025) | official cybersecurity standard/guidance | incident response is integrated across Govern/Identify/Protect/Detect/Respond/Recover; recovery is part of lifecycle risk management, not an isolated technical command | DEEP |
| NIST SP 800-160 Vol. 2 Rev. 1 | official systems-security engineering guidance | cyber resilience explicitly covers anticipate, withstand, recover and adapt; containment and recovery are designed system properties under adversarial conditions | DEEP |
| NIST IR 8374 Rev. 1 (2026) / ransomware resilience corpus | current official ransomware guidance | ransomware/destructive-event recovery requires protecting recovery material and treating compromise/integrity as first-class recovery concerns | DEEP |
| AWS Backup logically air-gapped vault + Multi-party approval | official provider architecture | immutable/locked recovery material and separate-account / multi-party access reduce correlated compromise, but recovery access and restore remain separately authorized operations | DEEP |
| AWS Well-Architected Reliability — RTO/RPO | official provider engineering guidance | RTO and RPO bound downtime/data-loss objectives selected by business requirements; they do not themselves prove integrity, authorization validity or semantic postconditions | DEEP |
| Kubernetes / etcd operations and restore | official platform documentation | Kubernetes depends on etcd as backing state; recovery relies on snapshots/restore and cluster-state discipline; availability and safe authoritative state are distinct concerns | DEEP |

### Source ledger
- NIST SP 800-61 Rev. 3, finalized April 2025: https://csrc.nist.gov/pubs/sp/800/61/r3/final
- NIST SP 800-160 Vol. 2 Rev. 1 announcement/publication context: https://www.nist.gov/news-events/news/2021/12/developing-cyber-resilient-systems-systems-security-engineering-approach
- NIST ransomware protection/response publication index, including IR 8374 Rev. 1 finalized 2026-06-11: https://csrc.nist.gov/Projects/ransomware-protection-and-response/publications
- AWS logically air-gapped vault: https://docs.aws.amazon.com/aws-backup/latest/devguide/logicallyairgappedvault.html
- AWS Backup multi-party approval: https://docs.aws.amazon.com/aws-backup/latest/devguide/multipartyapproval.html
- AWS Well-Architected REL13-BP01: https://docs.aws.amazon.com/wellarchitected/2023-10-03/framework/rel_planning_for_recovery_objective_defined_recovery.html
- Kubernetes etcd operations: https://kubernetes.io/docs/tasks/administer-cluster/configure-upgrade-etcd/

## Primitives, source of truth, identity and lifecycle
The capability needs separate identities for the adverse condition and for each response/recovery realization. Generation 2 should not collapse an incident, a control invocation and a recovered realization into one mutable status.

A portable lifecycle is:

`ThreatOrFailureObservation → IncidentRevision → ContainmentIntent → ContainmentRealization → RecoveryIntentRevision → RecoveryEligibilityDecision → RecoveryAttempt → EffectiveRecoveryObservation → SemanticPostconditionEvidence → RecoveryQualification → ResidualRiskDisposition`

Each recovery attempt is bound to a lifecycle revision vector that includes at least release/artifact, schema/data position, workflow/in-flight state, configuration, trust/credential state, provider/binding, topology/routing, tenant/Station scope, authority/approval revision and recovery-point identity.

The source of truth for recovery is therefore not "the reachable replica" or "the latest backup". It is the qualified relationship among incident/threat state, accepted recovery intent, eligible recovery source, actual effective realization and postcondition evidence.

## Versioning and stale evidence
Security and recovery evidence is revision-vector and threat-state scoped. A previously valid restore test, readiness decision or security qualification becomes stale when a material release/config/schema/trust/topology/provider/routing/authority change occurs, or when new compromise evidence changes the assumed threat boundary.

A backup can remain byte-identical while becoming ineligible because the trust material, schema compatibility, malware/integrity disposition, provider binding or authority context needed to consume it has changed.

## Failure semantics
### Containment is not availability
Containment can deliberately reduce availability to preserve integrity, confidentiality or blast-radius boundaries. Quarantine, read-only mode, revoked credentials, fenced writers, disabled automation and isolated Stations are valid outcomes. Generation 2 must not treat degraded availability as control failure when the declared security objective is containment.

### Restore success is not recovery eligibility
A provider reporting `RESTORE_COMPLETED` proves only a provider operation outcome. Recovery qualification additionally requires the recovery point/source to be eligible for the incident class, its integrity/trust to be acceptable, the restored state position to be understood, dependent revisions to be compatible and semantic postconditions to pass.

### Ambiguous recovery actuation
Timeout or acknowledgement loss around promotion, restore, failover, credential rotation, route cutover or isolation can leave the external state unknown. Blind retry can create dual writers, duplicate restores, contradictory routing or repeated destructive action. The universal result is `OUTCOME_UNKNOWN`/`INCONCLUSIVE` followed by reconciliation of effective state before retry or further promotion.

### Rollback, restore and forward-fix remain distinct
Rollback changes realization/configuration toward a retained prior revision. Restore reconstructs persisted state from a recovery source. Forward-fix advances to a new revision. Security containment can coexist with any of these and can prohibit otherwise technically possible rollback/restore when the retained material is suspected compromised.

## Extensibility and provider boundaries
Provider-specific mechanisms include immutable vaults, snapshots, replication, malware scanners, quorum/lease primitives, backup catalogs, isolated accounts, HSM/KMS controls and traffic failover. These remain provider realizations.

Portable SB semantics should own recovery requirements and evidence profiles: recovery-point identity, integrity/eligibility, revision-vector closure, containment state, authority required, permitted degraded modes, RTO/RPO objectives, effective-state reconciliation, postconditions and residual-risk disposition.

A provider replacement during recovery is not closed merely when a new provider is reachable. Residual use of the prior provider/source, replay/drainage state, trust/credential exposure, copied recovery material and unresolved compromise assumptions must be dispositioned.

## Governance and faceted authority
Recovery requires explicit facets rather than a generic administrator bit:

`ObserveThreat ≠ ClassifyIncident ≠ Contain ≠ AdmitRecovery ≠ AccessRecoveryMaterial ≠ RestoreState ≠ PromoteWriter ≠ ChangeRouting ≠ RotateTrust ≠ BreakGlass ≠ QualifyRecovery ≠ ChangeCanonicalDomain`

Break-glass is a separately governed authority path. It must be scoped by subject, operation, resource/Station/tenant, expiry, reason, approval threshold and evidence obligations. Loss of the normal control plane cannot manufacture broader authority.

AWS Backup multi-party approval is useful representative evidence: access to protected recovery material can be deliberately separated from ordinary account control and require threshold approval. The universal primitive is distributed/scoped authorization for exceptional recovery, not AWS MPA itself.

## Observability and qualified recovery evidence
A qualified recovery evidence set should express at least:
- incident/threat revision and assumed compromise boundary;
- containment state and blast-radius scope;
- recovery-point/source identity, integrity and eligibility disposition;
- effective release/schema/data/workflow/config/trust/provider/topology revision vector;
- RTO/RPO measurements against declared objectives;
- exclusive-writer/routing authority where applicable;
- in-flight workflow/message/automation disposition;
- tenant/Station coverage and exceptions;
- domain postconditions and validation freshness;
- residual-risk/source disposition;
- evidence collector/provider health and freshness.

Missing mandatory evidence propagates `PARTIAL`/`INCONCLUSIVE`; it is not converted to PASS because a provider health endpoint is green.

## Portability and lock-in
RTO/RPO, recovery-point eligibility, containment requirements, integrity criteria, authority facets, residual-risk disposition and semantic postconditions are portable. Vault Lock, AWS MPA, etcd snapshot commands and vendor failover APIs are replaceable realizations.

A generated system remains portable only when recovery history and qualification evidence can be interpreted without the original provider control plane. Exporting bytes without recovery-point lineage, trust/authority context and postcondition evidence is insufficient portability.

## Product-specific mechanism versus universal primitive
**Provider/product-specific:** AWS logically air-gapped vault, AWS MPA, KMS implementation, Kubernetes/etcd snapshot/restore commands, cloud-specific failover/routing APIs, malware scanners.

**Universal:** threat/failure identity; containment realization; qualified recovery-point eligibility; revision-vector recovery evidence; ambiguous recovery-actuation disposition; faceted break-glass authority; residual-risk/source disposition; qualified local/offline recovery closure.

## Convergent patterns
1. Incident response and recovery are lifecycle activities, not one terminal command.
2. Recovery material must be protected from correlated compromise.
3. Availability objectives and security/integrity objectives can conflict and require explicit policy.
4. RTO/RPO are necessary objectives but insufficient semantic proof.
5. Exceptional recovery authority benefits from separation/threshold controls.
6. Effective state after recovery must be observed and qualified, not inferred from request acceptance.
7. Restore/failover automation requires safe handling of ambiguous outcomes.

## Divergent patterns
Representatives differ in replication consistency, backup immutability, malware scanning, approval topology, restore granularity, failover automation and local-control availability. Those differences belong in provider capabilities/effective profiles, not in canonical SB identity.

## Subcapabilities
- threat/failure observation and incident identity;
- containment/quarantine/isolation and blast-radius control;
- recovery-point catalog, integrity and eligibility;
- backup/restore and DR objectives/evidence;
- failover/fencing/promotion/routing recovery;
- trust/credential recovery;
- in-flight execution/message disposition;
- residual-risk/source disposition;
- break-glass and multi-party exceptional authority;
- qualified local/offline/air-gapped recovery;
- post-recovery semantic qualification and reconnection requalification.

## Comparison with SB — bounded evidence only
No new repository-wide implementation claim is made in RESEARCH_ELICITATION. Fresh `main` archaeology remains reserved for `PLANNING_B_SB_CURRENT_STATE_RECONCILIATION`. This revisit only generates repo-validation questions that can later be tested against actual code/contracts.

## Reconciliation hypotheses
- **GENERALIZE** incident/recovery lineage around threat/failure identity plus revision-vector effective-state evidence.
- **HARDEN** recovery admission with explicit recovery-point integrity/eligibility and residual-risk disposition.
- **HARDEN** ambiguous restore/failover/promotion actuation with reconciliation-before-retry.
- **INTEGRATE** recovery evidence with Lifecycle revision vectors, qualified evidence, Provider/Binding cutover evidence and Observability freshness/coverage.
- **PROVIDERIZE** backup engines, immutable vaults, malware scanners, quorum/fencing mechanisms, DR orchestration and cloud-specific MPA realization.
- **HARDEN** Station/tenant blast-radius boundaries and break-glass non-amplification.
- **DEFER** concrete provider choices and existing-SB implementation claims to Planning B/C.
- **DO_NOT_BUILD** generic consensus, storage replication or cloud backup machinery inside SB.

## Repo-validation questions
1. Does current SB distinguish incident identity from recovery-plan/attempt/effective-state identity?
2. Can a recovery point be marked available yet ineligible because integrity/trust/schema/threat assumptions fail?
3. Is recovery actuation able to represent `OUTCOME_UNKNOWN` and reconcile before retry?
4. Are RTO/RPO represented separately from semantic/integrity qualification?
5. Can recovery readiness become stale after release/config/schema/trust/provider/topology/authority changes?
6. Are Station/tenant containment and blast-radius boundaries first-class and non-weakenable by local fallback?
7. Is break-glass authority facet-, scope-, expiry- and evidence-bound rather than generic admin escalation?
8. Can provider replacement prove residual-source/provider/trust disposition before closure?
9. Can local/offline recovery operate from declared closure and force requalification on reconnection?

## Adaptive Governed Work Surfaces cross-check
Adaptive Governed Work Surfaces remains a distinct promoted capability. During containment/recovery, `Enterprise → Station → Role → Person` is re-evaluated against the currently admissible capability set. A Station or Person cannot regain quarantined capability exposure through cached UI state, stale provider binding or local automation.

AGWS may surface degraded state, evidence gaps, recovery proposals and authorized controls. It does not gain canonical domain, provider-admin, secret, writer-promotion or break-glass authority from incident urgency. AI remains materializer/proposer under the same faceted authority; recommendation confidence never substitutes for admission or actuation authority.

## Qualified local/offline/air-gapped recovery closure
A recovery closure is profile-specific and can include retained artifacts/releases, schemas/migrations, data/checkpoints, workflow histories, local provider/runtime definitions, trust roots/revocation material, secrets/config references, fencing/epoch state, recovery procedures, integrity metadata, approval/break-glass policy and local validators.

Offline availability does not imply eligibility. Missing integrity, authority, revocation or fencing evidence can force quarantine/read-only/`INCONCLUSIVE`. On reconnection, external authority/trust/provider/threat updates invalidate local assumptions as required and trigger explicit requalification before privileged synchronization or promotion.

## Symbiotic Proof
A ransomware/destructive-event scenario compromises the primary control plane and one provider while an air-gapped recovery point and a local Station remain available. The system must (1) bind the incident to a threat/failure revision; (2) contain affected provider/tenant/Station scopes without expanding authority; (3) prove recovery-point integrity/eligibility against the incident assumptions; (4) obtain separately scoped exceptional authority when normal control is unavailable; (5) restore into a non-authoritative/quarantined realization first where exclusivity or integrity is unresolved; (6) reconcile effective release/data/schema/workflow/config/trust/provider state; (7) verify RTO/RPO plus semantic postconditions; (8) disposition residual provider/source risk; and (9) requalify local/offline decisions on reconnection. A provider `restore completed` event alone must fail this proof.

## Stable findings
- **G2-FINDING-SRFR-31 — Threat/Failure Identity Is Distinct from Control and Recovery Realization.** Incident truth, containment action, recovery attempt and effective recovered realization require separate identities and lineage.
- **G2-FINDING-SRFR-32 — Containment and Availability Are Orthogonal, Blast-Radius-Scoped Objectives.** Safe recovery may intentionally reduce availability; quarantine/read-only/isolation cannot be treated as failure when required to preserve integrity or tenant/Station boundaries.
- **G2-FINDING-SRFR-33 — Recovery-Point Availability Does Not Establish Recovery Eligibility.** A snapshot/backup must be qualified for integrity, threat assumptions, revision compatibility, trust and required postconditions before authoritative use.
- **G2-FINDING-SRFR-34 — Ambiguous Recovery Actuation Requires Effective-State Reconciliation Before Retry or Promotion.** Lost acknowledgements around restore/failover/promotion/routing can create destructive duplicates or split authority if blindly retried.
- **G2-FINDING-SRFR-35 — Security and Recovery Readiness Evidence Is Threat-State and Revision-Vector Scoped.** Release, config, schema, trust, topology, provider, routing, authority or compromise-assumption changes can stale prior readiness and restore-test evidence.
- **G2-FINDING-SRFR-36 — RTO/RPO Evidence Is Distinct from Integrity, Recoverability and Semantic Qualification.** Meeting time/data-loss objectives does not prove an uncompromised, authorized or semantically correct system.
- **G2-FINDING-SRFR-37 — Provider-Recovery Closure Requires Residual Source/Risk Disposition.** Replacement is incomplete while prior provider/source use, copied recovery material, exposed trust/credentials or unresolved compromise assumptions can still affect the system.
- **G2-FINDING-SRFR-38 — Break-Glass and Local/Offline Recovery Must Be Non-Amplifying and Requalified on Reconnection.** Exceptional recovery authority must be explicit, scoped, expiring and auditable; disconnected operation cannot manufacture broader rights and must reconcile against fresher authority/trust/threat state later.

## Capability candidates
- `G2-CAPABILITY-CANDIDATE-SRFR-THREAT-RECOVERY-REVISION-VECTOR-EVIDENCE` — **CROSS_CUTTING / CONSOLIDATION_CANDIDATE**; reconcile with Lifecycle revision-vector transition closure and qualified operational evidence.
- `G2-CAPABILITY-CANDIDATE-SRFR-RECOVERY-POINT-INTEGRITY-ELIGIBILITY-EVIDENCE` — **CROSS_CUTTING / CONSOLIDATION_CANDIDATE**; test merge with storage integrity/provenance and unified evidence qualification while retaining Security/Recovery semantic ownership.
- `G2-CAPABILITY-CANDIDATE-SRFR-AMBIGUOUS-RECOVERY-ACTUATION-DISPOSITION` — **CROSS_CUTTING / CONSOLIDATION_CANDIDATE**; merge with universal ambiguous-outcome disposition across Integration, Deployment, Lifecycle and Architecture Reconciliation.
- `G2-CAPABILITY-CANDIDATE-SRFR-NONAMPLIFYING-BREAKGLASS-LOCAL-RECOVERY-CLOSURE` — **CROSS_CUTTING / CONSOLIDATION_CANDIDATE**; reconcile with faceted authority, qualified local closure and Station hierarchy.

No candidate is promoted in this revisit.

## Architecture proof-backfill obligations
1. **Compromised recovery-point negative proof:** provider restore succeeds from a recovery point later classified as compromised; authoritative promotion must remain denied/INCONCLUSIVE.
2. **Containment-vs-availability proof:** isolate one tenant/Station/provider cohort; unaffected cohorts remain available while quarantined scope cannot regain capability via stale binding/AGWS cache.
3. **Ambiguous promotion proof:** lose acknowledgement after writer promotion; reconciliation must determine effective authority before retrying or promoting another writer.
4. **Stale restore-test proof:** pass a restore test, then change schema/trust/provider or threat assumptions; prior test evidence must become inapplicable until requalified.
5. **RTO/RPO insufficiency proof:** recover inside declared objectives but violate a domain or integrity postcondition; recovery qualification must fail despite meeting RTO/RPO.
6. **Residual-source proof:** cut to replacement provider while a consumer still reads/replays from the compromised/old source; closure must remain incomplete.
7. **Break-glass non-amplification proof:** approve emergency restore but not provider-admin/domain mutation; attempts outside granted facets remain denied even under incident severity.
8. **Multi-party exceptional-authority proof:** required threshold approval is incomplete; recovery material remains inaccessible/non-authoritative rather than silently falling back to single actor.
9. **Offline closure proof:** local Station has artifacts and backup but lacks current revocation/fencing evidence; privileged recovery remains degraded/INCONCLUSIVE.
10. **Reconnection requalification proof:** after offline recovery, reconnect to fresher trust/authority/threat state that conflicts with local assumptions; synchronization/promotion pauses until explicit disposition.

## Value / risk / priority / next question
**Value:** prevents disaster recovery from converting an outage or attack into authoritative propagation of compromised/stale state. **Risk:** critical because restore/failover is unusually privileged and often occurs while evidence and normal controls are degraded. **Priority:** critical cross-cutting. **Next question:** how AI-native engineering can assist threat diagnosis and recovery planning while keeping context provenance, approvals, deterministic validators, hard actuation boundaries and exceptional authority outside probabilistic model control.
