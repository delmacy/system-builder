# Generation 2 — Privacy Retention / Hold / Residency Centralized Proof

Status: RESOLVED_BY_MULTI_REPRESENTATIVE_RESEARCH / NO_NEW_PROMOTION
Phase: RESEARCH_ELICITATION
Owner: promoted `Privacy / Data Governance / Retention / Legal Hold / Residency` CROSS_CUTTING capability
Proof junction: Enterprise Completeness / Negative-Space Review — privacy retention/hold/residency disposition

## Research question

Can Generation 2 prove, without provider-specific canonization, that a technically valid delete, archive, migrate or replicate transition is denied or left inconclusive whenever a controlling retention obligation, legal/investigative hold, purpose/use restriction or residency/jurisdiction rule applies; that these obligations evolve independently from data/schema/provider revisions; that provider or region substitution triggers requalification; and that historical disposition remains replayable against the revisions that produced it?

## Representatives and evidence ledger

1. **EU GDPR — Regulation (EU) 2016/679**. Article 5 establishes purpose limitation and storage limitation; Article 17 establishes erasure while also recognizing exceptions including processing necessary for legal obligations/public tasks and legal claims. This proves that destructive eligibility is obligation-dependent rather than a property of storage or delete authority alone.
   - https://eur-lex.europa.eu/eli/reg/2016/679/oj
2. **Microsoft Purview retention / eDiscovery**. Purview retention logic preserves an item under eDiscovery hold before ordinary retention/deletion evaluation; hard-delete operations leave items preserved while a hold/retention source still applies. Priority Cleanup exists as a narrowly privileged, audited override path rather than ordinary deletion semantics.
   - https://learn.microsoft.com/en-us/purview/retention-flowchart
   - https://learn.microsoft.com/en-us/purview/edisc-hold-delete-recoverable-items
   - https://learn.microsoft.com/en-us/purview/priority-cleanup-exchange
3. **NARA records schedules**. Approved records schedules are legal disposition authority defining whether/when records may be destroyed or must be preserved/transferred; agencies may not dispose of covered records outside approved authority. NARA also requires current disposition authority to be verified where schedules may have been superseded.
   - https://www.archives.gov/records-mgmt/sch-appraisal
   - https://www.archives.gov/records-mgmt/rcs
4. **Google Cloud residency controls**. Assured Workloads/data-residency capabilities are workload/service qualified; organization-policy location constraints can reject creation/restore operations violating allowed locations, while pre-existing resources may require separate treatment. This proves current effective residency is operation- and population-scoped, not a static tenant-level region label.
   - https://cloud.google.com/terms/data-residency
   - https://docs.cloud.google.com/backup-disaster-recovery/docs/concepts/drz
5. **AWS Control Tower data-residency controls**. Preventive and detective controls constrain creation/sharing/copying outside selected Regions at OU/member-account scope but explicitly contain service exemptions. This proves residency conformance depends on provider/service support and exact applicability scope.
   - https://docs.aws.amazon.com/controltower/latest/controlreference/data-residency-controls.html
6. **Open Policy Agent**. OPA provides a provider-neutral policy decision/enforcement boundary and revisioned distributable policy realization; it can realize obligation decisions without becoming the semantic owner of privacy, retention, hold or residency rules.
   - https://www.openpolicyagent.org/docs

Representative coverage for this proof: GDPR purpose/storage/erasure/legal-obligation semantics `DEEP`; Microsoft Purview retention/eDiscovery/override `DEEP`; NARA records/disposition authority `DEEP`; Google Cloud residency enforcement `DEEP`; AWS Control Tower residency support/applicability `DEEP`; OPA policy decision/enforcement boundary `DEEP`.

## Proof model

Canonical evaluation is not `canDelete(data)` or `regionAllowed(region)`. The proof subject is a revision-qualified `GovernedTransitionQualification`:

`subject/population + requested transition + purpose/use revision + retention-schedule revision + hold-set revision + residency/jurisdiction revision + provider/control realization revision + observed effective-coverage evidence + evidence-currentness horizon -> ALLOW | DENY | INCONCLUSIVE`

The following identities are distinct and never silently collapsed:

- `GovernedDataPopulationId`
- `TransitionAttemptId`
- `ProcessingPurposeRevisionId`
- `RetentionScheduleRevisionId`
- `HoldRevisionId`
- `ResidencyRuleRevisionId`
- `ProviderControlRealizationId`
- `EffectiveCoverageClaimId`
- `DispositionEvidenceId`

## Falsification suite

### F1 — Delete is not authoritative over controlling preservation obligations
Given a technically valid delete request with storage permission and provider support, an active controlling retention schedule or legal/eDiscovery hold forces `DENY`/`BLOCKED_BY_OBLIGATION`; absence or stale status of hold evidence forces `INCONCLUSIVE`, never implicit allow. Purview and NARA independently demonstrate that preservation/disposition authority can override ordinary delete mechanics.

### F2 — Purpose/use limitation is independently versioned
A data population remaining byte-identical does not preserve processing eligibility if the controlling purpose/use basis changes. Historical processing/disposition evidence remains replayable against the producing purpose/obligation revision; a newer revision governs only claims whose applicability interval includes it.

### F3 — Retention expiry is necessary but not sufficient for destruction
Expiry of one retention schedule does not prove deletion eligibility while another hold, schedule, preservation rule, legal obligation or downstream governed cohort remains controlling. Eligibility resolution joins all applicable obligations and records precedence/disposition.

### F4 — Residency applies to movement and realization, not only storage-at-rest labels
A migrate/replicate/restore/create transition is denied when target jurisdiction or provider/service realization violates the current residency rule. If provider support or enforcement coverage is unknown/partial, result is `INCONCLUSIVE` rather than compliant-by-assumption.

### F5 — Provider/region substitution triggers requalification
Moving from provider A/region X to provider B/region Y requires fresh qualification of residency support, retention/hold semantics, evidence export/currentness and residual-population handling. Matching labels such as “retention” or “EU region” do not prove semantic parity.

### F6 — Policy changes do not rewrite history
Disposition evidence stores the exact producing revisions and effective-coverage evidence. A later retention, hold, purpose or residency revision may change current eligibility but cannot retroactively mutate the recorded basis of a historical decision. Supersession is append-only/referential.

### F7 — Effective coverage is distinct from authored policy
A canonical obligation authored or provider policy accepted does not prove every replica, backup, index, export, cache or downstream consumer is covered. Closure requires observed effective coverage plus explicit drainage/requalification/disposition of residual governed cohorts.

### F8 — Delegation and AI/AGWS remain non-amplifying
`Enterprise → Station → Role → Person` may narrow purposes, regions, retention bounds or delegated disposition actions, but a Station/Role/Person cannot weaken a mandatory superior obligation or invent exception authority. AI/AGWS may classify, propose and orchestrate only under delegated authority and cannot release holds, override retention, grant residency exceptions or obtain provider-admin power implicitly.

## Failure semantics

- `ALLOW`: all controlling obligation revisions are known, current enough for the transition class, effectively realized for the governed population, provider support is qualified and no blocking obligation applies.
- `DENY`: at least one controlling obligation explicitly forbids the transition.
- `INCONCLUSIVE`: applicability, revision currentness, provider support, effective coverage or residual-population state is unknown/stale/partial.
- `OUTCOME_UNKNOWN`: external destructive/movement actuation may have occurred but acknowledgement is ambiguous; observe/reconcile-before-retry.
- `PARTIAL`: only a subset of governed populations/cohorts transitioned or was qualified.
- `NON_CONFORMING`: observed location/preservation/use state contradicts governing obligations.

## Lifecycle and evidence currentness

`request transition -> resolve applicable obligation revisions -> qualify provider/control support -> verify effective governed-population coverage -> ALLOW/DENY/INCONCLUSIVE -> actuate if allowed -> observe result -> reconcile ambiguous effects -> requalify residual populations -> record disposition evidence -> close`.

Policy and evidence revisions have independent lifecycles. A policy may be current while provider enforcement is stale; provider configuration may be current while consumer/storage cohorts have not converged. Offline/local operation therefore requires a policy-defined evidence horizon by transition class. Privileged destructive or cross-jurisdiction movement after horizon expiry must deny or remain inconclusive until requalification.

## Provider boundary and portability

Universal semantics stay canonical in SB: subject/population identity, purpose/use, retention schedule, hold, deletion eligibility, residency/jurisdiction intent, precedence, exception authority, effective qualification and disposition evidence.

Provider-native labels, retention engines, records stores, eDiscovery objects, org policies, SCPs, regions, account/OU IDs and decision-engine resources are realization identities only. Provider substitution is evaluated through a mixed support vector including event-based retention, immutable preservation, hold lifecycle, exceptional deletion, location granularity, service exemptions, evidence export, offline behavior and residual-copy closure.

## Symbiotic Proof

The proof succeeds when the same canonical governance intent can be materialized through heterogeneous provider mechanisms while preserving semantic ownership; a stricter controlling obligation blocks an otherwise-valid destructive/movement operation; stale/partial policy realization yields `INCONCLUSIVE`; provider/region substitution exposes unsupported semantics and forces requalification; historical evidence remains replayable using producing revisions; and local Stations remain useful without gaining authority to weaken enterprise obligations.

## Material findings

### G2-FINDING-PRHR-01 — Governed transition eligibility is applicability-scoped across independently versioned obligations
Delete/migrate/archive/replicate authority is a revision-qualified claim over purpose/use, retention, holds, residency, provider/control realization, effective population coverage and evidence currentness.

### G2-FINDING-PRHR-02 — Preservation authority can override technically valid destruction
Active legal/eDiscovery hold or controlling records/retention authority yields `DENY/BLOCKED_BY_OBLIGATION` even when storage deletion is otherwise valid; stale/unknown hold status yields `INCONCLUSIVE`.

### G2-FINDING-PRHR-03 — Retention expiry alone never proves deletion eligibility
Eligibility requires resolution of all controlling obligations and residual governed populations; one expired schedule cannot erase another hold, legal obligation or preservation owner.

### G2-FINDING-PRHR-04 — Residency is transition- and provider-support-qualified
Creation, restore, replication and migration can violate residency independently of existing-data placement; provider/service exemptions and enforcement scope must be explicit.

### G2-FINDING-PRHR-05 — Provider or region substitution requires governance requalification
Semantic parity cannot be inferred from provider feature names; the required retention/hold/residency/evidence support vector must be requalified and residual cohorts dispositioned.

### G2-FINDING-PRHR-06 — Historical disposition evidence is immutable with producing-revision lineage
Subsequent policy/obligation revisions alter future/current applicability but do not rewrite historical decision basis; replay binds to exact producing revisions and evidence.

### G2-FINDING-PRHR-07 — Authored policy and consumer-effective governance coverage are distinct
Policy publication/provider acceptance does not prove all replicas/backups/indexes/exports/caches/downstream cohorts are governed; closure requires observed effective coverage and residual drainage/requalification.

### G2-FINDING-PRHR-08 — Privacy governance delegation is monotonic and non-amplifying
Enterprise→Station→Role→Person may narrow delegated scope but cannot weaken superior preservation/residency/purpose obligations; AI/AGWS cannot acquire hold-release, exceptional-delete, residency-exception or provider-admin authority implicitly.

## Capability/candidate disposition

No new top-level capability is promoted. The already-promoted `Privacy / Data Governance / Retention / Legal Hold / Residency` capability owns these semantics. Existing subordinate PDGR consolidation candidates remain candidates; this centralized proof adds no new candidate because the proof junction is resolved by tightening the promoted owner’s cross-capability contract.

## Repo-validation questions retained

1. Can current SB represent `DENY` versus `INCONCLUSIVE` for destructive/movement transitions independently of provider API failure?
2. Can evidence preserve producing purpose/retention/hold/residency/provider revisions for historical replay?
3. Are replicas/backups/indexes/exports/caches/downstream populations identifiable enough for residual closure?
4. Can provider bindings express unsupported or partially supported retention/hold/residency axes?
5. Is Station delegation structurally incapable of weakening mandatory Enterprise obligations?
6. Are offline destructive/cross-jurisdiction transitions fenced by evidence-currentness horizons?

## Gate disposition

**Privacy retention/hold/residency centralized proof junction: RESOLVED_BY_MULTI_REPRESENTATIVE_RESEARCH_WITHOUT_NEW_PROMOTION.**

This resolution does not advance phase by itself. `CAPABILITY_SYNTHESIS` remains blocked until the remaining centralized proof debts recorded in `RESEARCH_PIPELINE_STATE.json` are resolved.
