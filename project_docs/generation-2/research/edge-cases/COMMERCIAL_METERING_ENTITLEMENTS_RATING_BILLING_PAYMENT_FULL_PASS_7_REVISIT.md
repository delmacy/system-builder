# Generation 2 — Commercial Metering / Entitlements / Rating / Billing / Payment — Full Pass 7 Revisit

Status: ACTIVE / ELIGIBLE NO-NEW-MATERIAL REVISIT
Phase: `RESEARCH_ADVERSARIAL_EDGE_CASE_SATURATION`
Full pass: 7
Capability: Commercial Metering / Entitlements / Rating / Billing / Payment
Mandatory cluster: Commercial Metering × Entitlements × Rating × Billing × Payment
Priority hypothesis: Typed Semantic Graph/Federation + Workflow/Execution proof research + Autonomous Builds/Fleet as non-authoritative hypotheses + bounded Legacy Mirroring/Brownfield Assimilation lens.
Authority: `RESEARCH_PIPELINE_STATE.json`, `POST_MATH_ADVERSARIAL_EDGE_CASE_SATURATION_RESEARCH.md`, `PROCESSUAL_SEMANTIC_CONFLICT_CLASSIFICATION.md`.

Research only. `ConflictPattern != ConflictInstance`; `Signal != ConfirmedConflict`. No remediation, product implementation, Work Package, TASK or Construction is authorized by this dossier.

## 1. Technique rotation

This revisit deliberately changes the attack shape from Pass 6. It uses brownfield-source permutation and temporal/proof subtraction across the commercial claim chain:

- source-of-truth permutation across one-time import, mirror, scheduled sync, CDC/event sync, bidirectional sync, coexistence/shadow, staged cutover, external-source-of-truth, SB-source-of-truth and archive-only ingestion;
- entity-resolution mutation: reused IDs, aliases, split identities, false joins, deleted/recreated subjects and cross-file composite keys;
- historical-cut permutation: identical commercial records interpreted under producing versus current meter/rate/customer/schema mappings;
- spreadsheet semantic subtraction: formulas, named/external links, hidden content, manual overrides and implicit formatting are removed from an otherwise plausible import to test silent semantic loss;
- synchronization braid: late usage, tombstones, retries, out-of-order CDC, provider outage and residual legacy edits are interleaved with rerating/invoice/payment/settlement stages;
- lineage relation permutation: `observedFrom`, `derivedFrom`, `causedBy`, `authorizedBy`, `mappedTo` and `supersedes` are intentionally substituted;
- commercial claim-lattice subtraction: remove usage-cut, mapping approval, entitlement, rating, invoice, payment, settlement or reconciliation evidence from a nominal completion bundle;
- dimensional/vector mutation: currency, unit, billing period, timezone, rounding profile and multidimensional allocation vectors are permuted while scalar values remain equal;
- queue/capacity mutation: bulk imports, correction storms and retry waves make reconciliation backlog unstable despite apparently healthy ingestion;
- AI-assisted mapping authority attack: inferred customer/entity/rule/formula mappings are presented with high confidence and then tested against semantic owner approval requirements.

Duplicate-screen baseline: all 124 reusable `G2-CONFLICT-PATTERN-*`, existing `G2-EDGE-COMMERCIAL-001..009`, `G2-XEDGE-COMMERCIAL-001..006`, prior Commercial revisits, and the bounded Legacy Mirroring candidate classes requested for this campaign.

## 2. Fresh external evidence used as comparative witnesses

### 2.1 Usage ingestion is not a closed commercial cut

Stripe documents that meter events are processed asynchronously; meter-event summaries and upcoming invoices may temporarily omit newly received usage. Stripe also supports CSV and S3 bulk usage ingestion. A meter-event adjustment can cancel a recently received event, but cancelling usage already included on a finalized invoice does not rewrite that invoice.

Portable consequence: `source record accepted != aggregation complete != invoice complete != historical truth rewritten`. Brownfield import success cannot be promoted to commercial convergence without a qualified cut, correction/adoption lineage and downstream disposition.

Evidence: https://docs.stripe.com/billing/subscriptions/usage-based/recording-usage ; https://docs.stripe.com/billing/subscriptions/usage-based/meters/configure

### 2.2 Metering identity and billable identity can legitimately differ

Current OpenMeter documentation distinguishes event `subject` from managed billable Customer, allows several subjects to map to one customer, and warns that custom subject values colliding with customer keys/IDs can attribute usage to the wrong customer.

Portable consequence: legacy identifiers, spreadsheet row IDs, aliases and provider-native subject keys are evidence for entity resolution, not canonical customer identity. `source-system identifier equality != entity equivalence != approved billing attribution`.

Evidence: https://openmeter.io/docs/metering/subjects ; https://openmeter.io/docs/billing/customer/overview

### 2.3 Event deduplication is scoped and does not prove business uniqueness

OpenMeter documents deduplication by CloudEvents `(source,id)`. The same logical business usage represented under a different source or rewritten legacy identifier can therefore evade that dedupe scope, while a mistakenly reused pair can suppress a distinct event.

Portable consequence: `transport/event identity != business effect identity != historical source identity`. Brownfield replay/dedupe requires explicit identity scope and provenance.

Evidence: https://openmeter.io/docs/metering/events/usage-events

### 2.4 Spreadsheet artifacts can contain semantics outside visible cell values

Microsoft documents workbook links/external references in cells, names, objects, chart titles and chart series, and notes that users can configure links not to refresh, leaving stale values without an obvious prompt. External data connections can also be disabled by trust settings.

Portable consequence: extracting only visible values/formulas is not proof that a legacy billing workbook was semantically assimilated. External references, hidden/stale linked values and recalculation state can change the meaning of imported commercial evidence.

Evidence: https://support.microsoft.com/en-US/Excel/external-links-found ; https://support.microsoft.com/Excel/manage-workbook-links ; https://support.microsoft.com/pt-BR/Excel/create-edit-and-manage-connections-to-external-data

### 2.5 CDC correctness is revision-position qualified

Debezium SQL Server documentation keeps schema history so change events after schema changes are interpreted using the table structure that existed at the relevant log position; restart resumes from the last read position with the corresponding schema history.

Portable consequence: `current schema != producing schema`. A brownfield CDC stream without producing-position/schema lineage can be structurally parseable yet semantically wrong.

Evidence: https://debezium.io/documentation/reference/connectors/sqlserver.html

## 3. Legacy Mirroring / Brownfield Assimilation candidate screen

### Candidate A — false entity convergence causes wrong billing attribution

Activation: legacy customer/subject IDs are reused, aliased, deleted/recreated or collide with canonical/provider keys; imported usage is joined by apparent identifier equality.

Incompatible claims: `source identifier matches` versus `same canonical billable entity`.

Detection route: source-qualified identity graph + mapping approval + collision/split/merge evidence + temporal validity of identifiers; wrong-attribution deviation is a `Signal` until canonical owner evidence confirms a conflict.

Owners: Commercial semantic owner + Data/Schema identity owner + Integration/Legacy mapping owner + Privacy where personal data is involved.

Assessment: HIGH/CRITICAL for monetary misattribution; cross-capability; runtime/revision-dependent; potentially externally harmful.

Duplicate-screen: qualified identity, semantic ownership, provider-native identity leakage, historical/currentness and false-convergence families already cover the unsafe promotion. No new ConflictPattern.

### Candidate B — source-of-truth transition creates dual-write split brain

Activation: legacy billing sheet/API/provider remains editable after SB cutover or scheduled/bidirectional synchronization overlaps with canonical mutation.

Incompatible claims: legacy and SB each consider their write current/authoritative for usage, entitlement, rate, credit or customer state.

Detection route: explicit source-of-truth mode + temporal cutover authority + residual writer/cohort telemetry + reconciliation of conflicting writes/tombstones.

Owners: Commercial + Integration + Lifecycle/Provider Binding + Governance.

Assessment: HIGH/CRITICAL; concurrency/revision-dependent; blast radius customer through enterprise.

Duplicate-screen: residual-provider/cohort, multiple authoritative transition, source ownership, migration/coexistence and false-convergence families. No new pattern.

### Candidate C — unsupported spreadsheet semantics are silently dropped

Activation: migration ingests visible values but omits external links, macros/scripts, hidden ranges, implicit formatting/status, stale link/recalculation state or unsupported formulas used in commercial derivation.

Incompatible claims: importer reports complete migration while source semantics contain unrepresented dependencies/rules.

Detection route: artifact inventory/coverage report + explicit unsupported-content disposition + mapping-owner review + reconciliation against source-produced outputs; absence is not proof of non-existence when extractor coverage is incomplete.

Owners: Data/Schema + Commercial calculation owner + Integration/Legacy mapping owner + Governance/Security for executable artifacts.

Assessment: HIGH when omitted semantics affect charges/entitlements; confidence supported; detectability pre-execution/audit; false-positive risk medium because some omitted content may be non-semantic.

Duplicate-screen: presence semantics, hidden effective input, provenance incompleteness, proof-claim conflation, migration readiness and false convergence already express the material hazard. `UNSUPPORTED_ARTIFACT_SILENT_DROP` remains a useful detection label, not a new reusable ConflictPattern.

### Candidate D — imported historical values are reinterpreted under current rate/formula semantics

Activation: archived invoices/usage/spreadsheets lack producing meter/rate/formula/schema mapping revision; current canonical mapping is applied retroactively.

Incompatible claims: historical evidence versus a current recomputation presented as historical truth.

Detection route: producing revision/time cut + lineage + semantic-kind qualification + explicit supersession/correction path.

Owners: Commercial + FinOps/Calculation + Data/Lifecycle.

Assessment: HIGH; cumulative/latent; potentially audit/legal impact.

Duplicate-screen: historical recomputation, temporal/currentness, analytical-kind conflation, supersession lineage and provenance families. No new pattern.

### Candidate E — partial sync or missed tombstone resurrects billable usage/customer state

Activation: sync page/export is partial, CDC delete/tombstone is missed, retry order differs, late arrival follows deletion, or outage resumes from an incorrect position.

Incompatible claims: source says deleted/superseded while canonical mirror treats old state as current and billable.

Detection route: synchronization watermark/cursor + completeness evidence + tombstone lineage + monotonic source-position checks + post-cut reconciliation.

Owners: Integration + Commercial + Data/Lifecycle.

Assessment: HIGH; runtime/provider-dependent; reversible only through explicit correction after adoption.

Duplicate-screen: ordering/replay, partial/unknown effect, stale evidence, migration/coexistence, historical lineage and false convergence. No new pattern.

### Candidate F — imported formula/rule is promoted to business authority

Activation: spreadsheet formula, macro, conditional formatting, AI-inferred rule or observed operator workaround is copied into canonical rating/entitlement semantics without owner approval.

Incompatible claims: `observed/derived/inferred behavior` versus `approved business rule/decision authority`.

Detection route: semantic mapping approval + result-kind/decision-kind typing + rule owner + formula revision + provenance; AI confidence remains non-authoritative evidence.

Owners: Commercial semantic owner + Mathematical Expressions semantics + Governance/Authorization + AI/low-code governance.

Assessment: HIGH/CRITICAL where it changes customer obligation; plausible accidental or AI-assisted misuse.

Duplicate-screen: analytical-kind conflation, provenance-edge over-attribution, authority non-amplification, AI/low-code composition, human-procedure and semantic ownership. `FALSE_PROCESS_RECONSTRUCTION` / `MAPPING_SEMANTIC_DRIFT` are detection labels, not new patterns here.

### Candidate G — migration counts reconcile while semantic value is lost

Activation: source and target row/event counts match, but identity joins, currency/unit/timezone, precision, formula provenance, permissions or referential relations differ.

Incompatible claims: quantitative count parity versus semantic migration completeness.

Detection route: multidimensional reconciliation over identities/relationships/units/revisions/permissions/unsupported-content, not row count alone.

Owners: Data/Schema + Commercial + Privacy/Governance + Integration.

Assessment: HIGH; detectability pre-cutover/post-effect; false-positive risk low if proof profile explicitly narrows the claim.

Duplicate-screen: proof-claim conflation, dimensional mismatch, permission/authority, provenance, referential integrity and false-convergence families. No new pattern.

### Candidate H — reconciliation backlog makes a healthy mirror economically unstable

Activation: import/correction/retry arrival rate persistently exceeds validation/rating/reconciliation service capacity; dashboards expose ingestion throughput but not unresolved economic backlog.

Incompatible claims: observed connector health/utilization versus sustainable convergence of commercial truth.

Detection route: queue growth/age, service-rate and correction-work measurements, bounded cut closure and residual `UNKNOWN` count; Little's-Law-style summaries only under stated stability assumptions.

Owners: Integration/Operations + Commercial + FinOps/Capacity owner.

Assessment: HIGH under sustained monetary drift; cumulative; resource-dependent.

Duplicate-screen: queue/capacity/fairness, observability coverage and false convergence. No new pattern.

## 4. Formal assurance and migration-completion proof obligations

No mechanism is implemented. Carry these obligations to Planning C/D/E and Architecture Reconciliation:

1. **Source-mode binding** — proof states whether evidence came from import, mirror, CDC, bidirectional coexistence, cutover, external source-of-truth, SB source-of-truth or archive-only ingestion; modes are not interchangeable.
2. **No-silent-loss coverage** — migration proof includes an artifact/content coverage manifest and explicit unsupported-content report; unsupported or unparsed content cannot be silently treated as absent.
3. **Mapping approval** — inferred schema/entity/process/rule/formula mappings remain hypotheses until approved by the relevant semantic owner; AI confidence does not supply authority.
4. **Entity-resolution proof** — imported usage/customer attribution binds source namespace, identifier validity interval, aliases/merge/split decisions and mapping revision.
5. **Historical non-rewrite** — current mappings/rates/formulas cannot retroactively strengthen or reinterpret historical evidence without an explicit correction/supersession lineage.
6. **Qualified reconciliation** — count/hash parity alone is insufficient; proof profile identifies required semantic dimensions such as relationships, currency/unit/timezone, precision, permissions, source position and unsupported content.
7. **Source-of-truth transition** — cutover proof binds authority transition time/revision and disposes residual writers/cohorts; dual-write remains `PARTIAL/UNKNOWN` until reconciled.
8. **CDC/sync completeness** — watermarks/cursors/schema-history/tombstone handling and late-event policy are part of the evidence where streaming assimilation claims completeness.
9. **Commercial claim separation** — imported usage acceptance, aggregate, entitlement, rating, invoice, payment, refund/chargeback, settlement and accounting adoption remain distinct proof domains.
10. **External `UNKNOWN` preservation** — unavailable legacy/provider evidence blocks stronger completion claims and requires reconciliation rather than unsafe retry or invented success.
11. **Permission intent** — permission/ACL equivalence or intentional delta is explicit where source artifacts carry access semantics; connectivity does not broaden authority.
12. **Rollback/residual disposition** — rollback viability includes source edit state, provider/cohort state and downstream commercial adoption, not only imported bytes/rows.
13. **Post-cut divergence detection** — shadow/coexistence periods require explicit divergence evidence and an owner-defined acceptance threshold; deviation remains a signal until assessed.
14. **Queue/capacity qualification** — completion proof bounds unresolved reconciliation backlog and cannot infer convergence from connector health alone.
15. **Offline verifier non-strengthening** — missing current external/source evidence yields `UNKNOWN/INCONCLUSIVE`; journal integrity, model soundness or source checksum cannot prove missing commercial effects or semantics.

## 5. Planning E candidate proofs strengthened by this revisit

In addition to the existing formal-assurance acceptance set, later Planning E should include brownfield/commercial cases for:

- two legacy IDs falsely merging into one billable customer must be rejected or remain unresolved;
- complete row count with an unsupported external workbook link must not pass no-silent-loss completion;
- stale legacy writer after cutover must prevent source-of-truth convergence;
- missed tombstone/out-of-order CDC must be detected as divergence signal and must not silently resurrect current billable truth;
- historical usage without producing rate/mapping revision must remain `UNKNOWN/INCONCLUSIVE` for exact historical recomputation;
- AI-inferred formula/customer mapping must not become authoritative without owner approval;
- imported usage proof must not imply invoice/payment/settlement proof;
- reconciliation backlog growth must prevent a false convergence certificate when the selected profile requires bounded closure.

## 6. Duplicate-screen disposition

Candidate labels requested by the Legacy Mirroring front were screened as follows:

- `SILENT_DATA_LOSS` → presence/hidden-input/provenance/migration/false-convergence families;
- `SOURCE_OF_TRUTH_CONFLICT` → semantic ownership/multiple-authority/residual-cohort/migration families;
- `FALSE_ENTITY_CONVERGENCE` → qualified identity/identity-drift/provider-native-identity families;
- `MAPPING_SEMANTIC_DRIFT` → currentness/revision/provenance/semantic-ownership families;
- `DUAL_WRITE_SPLIT_BRAIN` → concurrent authoritative mutation/coexistence/false-convergence families;
- `PROVENANCE_BREAK` → provenance over-attribution/lineage/currentness families;
- `PERMISSION_BROADENING` → authority non-amplification/policy/identity families;
- `FALSE_PROCESS_RECONSTRUCTION` → provenance over-attribution/analytical-kind/human-procedure/AI composition families;
- `HISTORICAL_REINTERPRETATION` → historical non-rewrite/currentness/supersession lineage families;
- `UNSUPPORTED_ARTIFACT_SILENT_DROP` → presence semantics/hidden effective input/proof-claim conflation/migration readiness.

No candidate survived duplicate-screen as a materially distinct 125th reusable ConflictPattern. These labels remain useful adversarial/detection vocabulary only.

## 7. Result and saturation disposition

Result: **ELIGIBLE NO-NEW-MATERIAL REVISIT**.

- New material edge scenarios: 0.
- New cross-capability edge IDs: 0.
- New reusable ConflictPatterns: 0.
- New ConflictInstances: 0.
- Preventive invariants adopted: 0.
- Inventory remains 284 edge scenarios + 124 ConflictPatterns = 408 material findings.
- Commercial local streak remains 2, capped; mandatory Commercial cluster streak remains 2, capped.
- `HIGH/CRITICAL` without semantic owner/proof obligation/detection route remains 0.
- Legacy Mirroring/Brownfield Assimilation remains a cross-cutting research lens; this revisit does not promote it to a 29th canonical capability or materialize target architecture.

Canonical separation strengthened:

`source observed != mapping inferred != mapping approved != canonical entity != derived projection != historical evidence != current business truth`

and

`migration/import completeness != semantic reconciliation != source-of-truth convergence != commercial-stage completion != settlement finality != workflow PROVEN_COMPLETED`.

Planning C remains blocked until adversarial research is `CLOSED / SATURATED / PASS`.
