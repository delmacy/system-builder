# Generation 2 — Privacy / Data Governance / Retention / Legal Hold / Residency Edge-Case Register

Status: ACTIVE RESEARCH
Phase: `RESEARCH_ADVERSARIAL_EDGE_CASE_SATURATION`
Full pass: 1
Disposition: `CATALOGUE + CLASSIFY + DETECTION_CANDIDATE + FUTURE_REMEDIATION_ROUTE`

Canonical distinctions preserved: lawful/authorized processing != purpose/use eligibility; retention expiry != delete eligibility; logical invisibility != physical disposition != population-wide erasure closure; provider acknowledgement != effective governed-population convergence; provider region label != qualified residency; `ConflictPattern != ConflictInstance`; `Signal != ConfirmedConflict`; `UNKNOWN -> reconcile-before-retry`; provider IDs are non-canonical; `Enterprise → Station → Role → Person`; AI/AGWS cannot amplify authority.

## Evidence ledger

1. AWS S3 Object Lock separates fixed retention periods from legal holds. Legal holds have no expiration and remain until explicitly removed; retention and legal hold can coexist, and Object Lock protects a specific object version rather than every object sharing the same key. Source: AWS S3 Object Lock documentation, accessed 2026-09-04.
2. Google Cloud Object Retention Lock permits per-object retention and can coexist with bucket retention. An object remains protected until all applicable retention conditions are satisfied; locked retention is irreversible in the reducing direction. Google also documents object holds as separate protection mechanisms. Sources: Google Cloud Storage Object Retention Lock, Bucket Lock and object-hold documentation, accessed 2026-09-04.
3. Azure Immutable Blob Storage separately models time-based retention and legal hold; both can apply at overlapping scopes, with legal hold remaining until explicitly cleared. Source: Microsoft Azure Immutable Storage overview, accessed 2026-09-04.
4. ICO right-to-erasure guidance explicitly treats live systems and backups differently: valid erasure may require backup handling even where immediate overwrite is unavailable, with backup data kept beyond use until established replacement/expiry mechanisms act. It also recognizes legal obligations/claims as exceptions to erasure. Source: ICO Right to Erasure guidance, accessed 2026-09-04.
5. Google Assured Workloads residency controls are package/service/resource scoped and document that some controls constrain creation to selected regions while some services or data classes may be out of scope. This supports residency as a qualified support vector rather than a region-name equality. Sources: Google Assured Workloads framework and data-boundary documentation, accessed 2026-09-04.
6. Planning A owns governed-population identity, independently revisioned purpose/use, retention, hold and residency obligations, qualified provider support, residual population disposition and evidence currentness. Planning B found adjacent storage/compliance/migration hooks but no current first-class portable owner in SB.

Portable conclusion: each provider mechanism can be locally valid while the composed privacy/governance state is invalid or inconclusive because obligation precedence, population coverage, producing revisions, residency scope, authority or evidence currentness disagree.

## Local material edge cases

### G2-EDGE-PRIVACY-001 — purpose/use or lawful-basis state becomes stale while processing continues
- Activation: purpose, consent/lawful-basis where applicable, data classification, recipient/use scope or governing policy changes during a long-running workflow, export, analytics job or automation.
- Expected safe behavior: processing eligibility is bound to governed-population identity, declared purpose/use, applicable obligation revisions and evidence horizon; changed/stale applicability yields `DENY` or `INCONCLUSIVE` according to owner policy.
- Forbidden behavior: prior collection, prior consent, old policy approval or current technical access is treated as timeless permission for a new purpose/use.
- Effect disposition: `ALLOW | DENY | INCONCLUSIVE | PARTIAL` with producing revisions explicit.
- Owners: Privacy/Data Governance + Governance/Compliance + Authorization + process owner.
- Evidence/currentness: purpose/use revision, applicable legal/policy basis revision, data-population classification and current subject/context linkage.
- Recovery/future route: requalify use against current owner truth; preserve previous processing evidence without retroactively rewriting it.
- Blast radius: record→enterprise/external parties. Severity: CRITICAL. Confidence: strongly supported. Detectability: pre-use/runtime. Reversibility: potentially irreversible after disclosure/use. Time-to-harm: immediate/latent. Misuse likelihood: plausible/adversarial.
- Proof obligation: stale or different-purpose authority cannot silently qualify current processing.

### G2-EDGE-PRIVACY-002 — retention expiry is misread as deletion eligibility despite active hold or superior preservation duty
- Activation: retention deadline expires while legal/investigative hold, statutory preservation, dispute, audit or superior policy still applies.
- Expected safe behavior: all applicable preservation obligations are resolved independently; expiry of one timer changes only that obligation's state and triggers fresh qualification.
- Forbidden behavior: `retentionExpired=true` directly invokes destructive disposition or clears another hold.
- Effect disposition: deletion remains `DENY`/`INCONCLUSIVE` while any applicable preservation blocker remains current.
- Owners: Privacy/Data Governance + Governance/Compliance + relevant legal/policy authority.
- Evidence/currentness: complete current hold set, retention revisions, precedence/applicability evidence and exceptional-release authority.
- Recovery/future route: requalify after hold/restriction release; no automatic delete implied.
- Blast radius: object→case/dataset/enterprise. Severity: CRITICAL. Confidence: strongly supported. Detectability: pre-delete. Reversibility: potentially irreversible. Time-to-harm: immediate. Misuse likelihood: likely.
- Proof obligation: individually valid retention and hold mechanisms cannot compose into unauthorized destruction.

### G2-EDGE-PRIVACY-003 — primary deletion succeeds while replicas, backups, caches, indexes, exports or downstream copies remain governed
- Activation: erasure/disposition is accepted on the primary store but residual populations remain, have delayed expiry, are beyond immediate overwrite, or were never included in the operation.
- Expected safe behavior: closure is population-scoped; primary deletion records only its covered effect, while residual populations remain explicit as retained-under-obligation, beyond-use, pending-disposition, `PARTIAL` or `INCONCLUSIVE`.
- Forbidden behavior: provider/API success on one store is promoted to global erasure completion.
- Effect disposition: `PARTIAL` until all applicable populations have qualified disposition or governed residual state.
- Owners: Privacy/Data Governance + Storage + Provider/Binding + downstream data owners.
- Evidence/currentness: population inventory/topology, deletion receipts, backup/index/cache schedules, downstream acknowledgement and currentness horizons.
- Recovery/future route: reconcile residual cohorts and prohibit normal use of populations classified beyond-use/pending disposition.
- Blast radius: subject/dataset→enterprise/external parties. Severity: CRITICAL. Confidence: strongly supported. Detectability: post-effect/audit. Reversibility: difficult. Time-to-harm: delayed/latent. Misuse likelihood: likely.
- Proof obligation: `logical delete != population-wide erasure closure`.

### G2-EDGE-PRIVACY-004 — residency claim is valid for one resource/operation but false for replicas, backups, metadata, support or cross-border processing
- Activation: provider/region substitution, replication, restore, export, logging, support access or service change occurs under a residency requirement.
- Expected safe behavior: residency is qualified by data class, operation, service/resource type, region/jurisdiction, replication/backup behavior, support/access path, provider control revision and evidence coverage.
- Forbidden behavior: matching provider region label or successful resource creation proves end-to-end residency for every data population and operation.
- Effect disposition: `CONFORMING | NON_CONFORMING | PARTIAL | INCONCLUSIVE` by qualified support vector.
- Owners: Privacy/Data Governance + Provider/Binding + Deployment/Runtime + Storage.
- Evidence/currentness: current provider control package, supported-service scope, actual placement/topology and residual-provider cohorts.
- Recovery/future route: requalify exact support vector before/after transition; residual old-provider populations remain governed.
- Blast radius: dataset→enterprise/jurisdiction. Severity: CRITICAL. Confidence: strongly supported. Detectability: design-time/pre-operation/runtime. Reversibility: migration may be required. Time-to-harm: immediate/latent. Misuse likelihood: plausible.
- Proof obligation: provider geography labels cannot self-promote to canonical residency compliance.

### G2-EDGE-PRIVACY-005 — subject identity/linkage ambiguity causes over-erasure or under-erasure
- Activation: duplicate identities, merged/split accounts, imported brownfield records, pseudonymous identifiers, provider-native IDs or stale linkage maps represent the same or different real-world subjects ambiguously.
- Expected safe behavior: governed-population selection uses canonical subject/linkage evidence with confidence/currentness; ambiguous linkage is surfaced and destructive fan-out is bounded.
- Forbidden behavior: provider ID equality, fuzzy matching or AI inference alone expands an erasure/hold scope into canonical identity truth.
- Effect disposition: ambiguous target population yields `INCONCLUSIVE` or human/owner qualification rather than silent destructive expansion.
- Owners: Privacy/Data Governance + Identity + Data/Schema.
- Evidence/currentness: identity-adoption/linkage revision, provenance and population membership evidence.
- Recovery/future route: reconcile identity/population membership before irreversible action.
- Blast radius: record→multiple subjects/enterprise. Severity: CRITICAL. Confidence: supported. Detectability: pre-effect. Reversibility: potentially irreversible. Time-to-harm: immediate. Misuse likelihood: plausible/adversarial.
- Proof obligation: uncertain subject linkage cannot manufacture destructive authority or silently omit affected governed data.

### G2-EDGE-PRIVACY-006 — recovery, restore or migration resurrects disposed/restricted data or an obsolete obligation state
- Activation: disaster recovery, point-in-time restore, migration rollback, provider failback or offline replica rejoins after erasure, hold release, purpose restriction or residency policy changed.
- Expected safe behavior: restored data and retained obligation evidence are requalified against current privacy/governance truth before normal use; tombstones/disposition lineage and current holds/purpose/residency constraints survive recovery semantics.
- Forbidden behavior: infrastructure restore success re-authorizes data use or treats old backup policy state as current.
- Effect disposition: restored cohort is quarantined/restricted/`INCONCLUSIVE` until current qualification; no silent canonical resurrection.
- Owners: Privacy/Data Governance + Security/Recovery + Data/Migrations + Storage.
- Evidence/currentness: restore point, disposition/hold lineage after that point, current obligation revision and population reconciliation evidence.
- Recovery/future route: reconcile restored cohort against post-backup governance history.
- Blast radius: dataset→enterprise. Severity: CRITICAL. Confidence: strongly supported. Detectability: recovery-time/post-effect. Reversibility: difficult after downstream propagation. Time-to-harm: immediate. Misuse likelihood: likely.
- Proof obligation: recovery cannot roll privacy/governance truth backward merely because data bytes are restorable.

### G2-EDGE-PRIVACY-007 — scale, offline horizons or AI/low-code composition turns incomplete governance evidence into apparent permission
- Activation: huge lineage/population graphs, high-cardinality copy topology, provider throttling, disconnected Station operation, stale obligation caches, or AI/low-code generated workflows that broaden purpose, shorten retention, clear holds, move regions or sample only part of evidence.
- Expected safe behavior: evaluation exposes coverage, truncation, stale horizons and delegated authority; privileged/destructive/cross-jurisdiction actions remain denied/inconclusive outside qualified evidence/authority bounds.
- Forbidden behavior: timeout, sampled lineage, green UI, generated rule or offline cached decision is treated as complete proof of eligibility.
- Effect disposition: bounded `PARTIAL`/`INCONCLUSIVE`; no silent fail-open.
- Owners: Privacy/Data Governance + Observability + Authorization + Provider/Binding + AI/AGWS authority owner.
- Evidence/currentness: population coverage cardinality, omitted cohorts, evidence horizon, authority/postcondition diff and provider support currentness.
- Recovery/future route: re-evaluate bounded scope with current evidence or route to responsible owner; no mechanism selected.
- Blast radius: Station→enterprise/external parties. Severity: HIGH/CRITICAL. Confidence: supported. Detectability: pre-action/runtime/post-effect. Reversibility: mixed. Time-to-harm: immediate/cumulative. Misuse likelihood: likely/adversarial.
- Proof obligation: scale/offline/generated composition cannot coerce incomplete privacy evidence into `ALLOW`.

## Reusable processual / semantic conflict patterns

### G2-CONFLICT-PATTERN-PURPOSE-USE-001 — technically authorized processing conflicts with current purpose/use eligibility
- Family: semantic ownership / policy / authority / temporal.
- Activation conditions: user/system has technical access and an earlier valid processing basis, but purpose/use, recipient, classification or applicable obligation revision changes.
- Incompatible claims/actions/states: Authorization says actor may invoke operation; Privacy/Data Governance says this purpose/use is not currently qualified.
- Why local validation may miss it: access control validates actor/action, not data-specific processing purpose and obligation applicability.
- Detection candidate: pre-use composition of authorization result + purpose/use revision + governed-population classification + current obligation evidence.
- Owner set: Privacy/Data Governance + Authorization + Governance/Compliance + process owner.
- Severity: CRITICAL; confidence: strongly supported; detectability: pre-use/runtime; blast radius: subject→enterprise/external parties; reversibility: potentially irreversible; time-to-harm: immediate; misuse likelihood: plausible/adversarial; evidence currentness: current required.
- False-positive risk: the same technical action can be legitimate under another explicitly qualified purpose; detector must not infer law or purpose from endpoint name alone.
- Future remediation disposition: `CATALOGUE + CLASSIFY + DETECTION_CANDIDATE + FUTURE_REMEDIATION_ROUTE`; requalify purpose/use when observed, no global implementation prescribed.
- Proof obligation: authorization cannot amplify into privacy-processing eligibility.

### G2-CONFLICT-PATTERN-PRESERVATION-DISPOSITION-001 — valid deletion schedule conflicts with valid preservation hold
- Family: policy/compliance / temporal / state-transition / human-procedure.
- Activation conditions: one valid retention/disposition rule says eligible to delete while an independently valid legal/investigative hold or superior preservation rule remains applicable.
- Incompatible claims/actions/states: retention scheduler says due; preservation owner says must retain.
- Why local validation may miss it: each mechanism can be correct for its own obligation and scope.
- Detection candidate: pre-delete complete applicable-obligation set, precedence/authority resolution and hold currentness check.
- Owner set: Privacy/Data Governance + Governance/Compliance + responsible legal/policy owner.
- Severity: CRITICAL; confidence: strongly supported; detectability: pre-effect; blast radius: record→case/enterprise; reversibility: potentially irreversible; time-to-harm: immediate; misuse likelihood: likely; evidence currentness: current.
- False-positive risk: expired/released/non-applicable holds must not block indefinitely; detector requires subject/scope/revision applicability rather than keyword matching.
- Future remediation disposition: catalogue and route concrete occurrence to owner-qualified disposition; no universal arbitrary rule ordering.
- Preventive invariant candidate: destructive actuation must not proceed when a current applicable preservation blocker is unresolved; later architecture must prove owner/applicability semantics before treating this as structural guard.
- Proof obligation: retention expiry alone never proves delete eligibility.

### G2-CONFLICT-PATTERN-RESIDENCY-PLACEMENT-001 — locally compliant placement conflicts with cross-population residency obligations
- Family: provider / policy / version / data-consistency.
- Activation conditions: primary resource is placed in an allowed region while backup, replica, metadata, log, support path, derived data or old-provider cohort is outside the qualified boundary or out of scope of the control.
- Incompatible claims/actions/states: local resource reports compliant region; privacy owner cannot establish whole required support vector/population coverage.
- Why local validation may miss it: provider location controls are service/resource/operation scoped and may omit related populations.
- Detection candidate: provider support-vector qualification + actual governed-population topology + residual-cohort inventory.
- Owner set: Privacy/Data Governance + Provider/Binding + Storage/Deployment.
- Severity: CRITICAL; confidence: strongly supported; detectability: design-time/pre-operation/runtime; blast radius: dataset→enterprise/jurisdiction; reversibility: migration may be required; time-to-harm: immediate/latent; misuse likelihood: plausible; evidence currentness: current.
- False-positive risk: some data/metadata categories may be explicitly out of scope under the controlling requirement; detector must use declared applicability rather than assume every byte shares one rule.
- Future remediation disposition: catalogue and require owner/provider requalification when signalled; no provider selected.
- Proof obligation: locally valid region placement cannot establish broader residency closure without qualified coverage.

### G2-CONFLICT-PATTERN-ERASURE-RECOVERY-001 — valid recovery objective conflicts with current erasure/restriction truth
- Family: recovery / data / policy / version-coexistence / objective.
- Activation conditions: backup/replica created before erasure or restriction is restored after current governance truth changed.
- Incompatible claims/actions/states: recovery owner says restore point is valid; privacy owner says some restored records are disposed, beyond-use, restricted, held differently or residency-incompatible under current truth.
- Why local validation may miss it: backup integrity/recovery success does not include post-backup privacy history.
- Detection candidate: restore-point versus post-point governance/disposition ledger diff + current obligation requalification before read/write exposure.
- Owner set: Privacy/Data Governance + Security/Recovery + Data/Migrations + Storage.
- Severity: CRITICAL; confidence: strongly supported; detectability: recovery-time/post-effect; blast radius: dataset→enterprise; reversibility: difficult; time-to-harm: immediate; misuse likelihood: likely; evidence currentness: current.
- False-positive risk: historical restore into isolated forensic space may be legitimate under explicit preservation authority and bounded non-use; normal-service exposure is the unsafe claim.
- Future remediation disposition: catalogue, reconcile restored population against current governance truth, route residuals; no recovery mechanism prescribed.
- Proof obligation: successful restore cannot silently supersede later erasure/restriction obligations.

## Cross-capability deepening

No 13th mandatory cluster is added. This visit materially deepens `Data/Schema × Privacy × Storage × Lifecycle`, `Provider/Binding × external realizations`, `Observability × Security/Recovery × runtime truth`, and `Identity × Authorization × Station × AGWS × AI`. In particular: governed-population membership and subject linkage must survive schema/provider/recovery changes; privacy eligibility remains distinct from technical authorization; provider acknowledgement and regional placement remain evidence rather than canonical closure; and AI/AGWS cannot weaken superior purpose, preservation or residency obligations.

## Saturation result

Material findings were discovered. Privacy / Data Governance / Retention / Legal Hold / Residency local streak is `0`; affected mandatory-cluster streaks remain `0`. No `ConflictInstance` is claimed and no remediation implementation is authorized. Full Pass 1 remains incomplete until all 28 capabilities are challenged.