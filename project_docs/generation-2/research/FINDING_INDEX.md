# Generation 2 — Finding Index

Prior stable findings remain authoritative in their capability dossiers, earlier index revisions and pipeline history. Compacting this index does not revoke them.

## Cycle 7 — Identity / Authentication / Federation revisit 6
- **G2-FINDING-IAF-45** — Authentication claims require explicit applicability across relying party/Station, purpose, assurance, authenticator/session class, federation/trust, provider, policy and evidence horizon.
- **G2-FINDING-IAF-46** — Authentication assurance is a revision-qualified relation; credential validity or historical login cannot self-prove current assurance.
- **G2-FINDING-IAF-47** — Federated IdP and RP sessions are independent lifecycle identities; upstream session termination cannot be treated as downstream closure proof.
- **G2-FINDING-IAF-48** — Trust-bundle possession is necessary evidence, not perpetual trust; trust-domain association and currentness qualify validation.
- **G2-FINDING-IAF-49** — Identity stability/support is a mixed vector across mapping, authenticator, assurance, session, revocation, federation/trust, offline and evidence semantics.
- **G2-FINDING-IAF-50** — Provider/authenticator substitution requires residual session, credential, mapping and trust cohort drainage; destination login success does not close migration.
- **G2-FINDING-IAF-51** — Qualified offline authentication continuity does not imply current privileged authority; stale revocation/trust/policy/assurance requires reconnect requalification.
- **G2-FINDING-IAF-52** — Identity context is provenance and cannot amplify AGWS/AI authority into authorization, provider administration, account linking or canonical mutation.

## Cycle 7 — Authorization / Policy / Organization / Multitenancy revisit 6
- **G2-FINDING-APOM-45** — Effective authority is an applicability-scoped claim over subject/actor, semantic scope, policy/model/schema, relationship/topology, delegation/lease, identity-security, evaluator, consistency, enforcement and evidence horizon; possession of a valid decision or policy revision alone is insufficient.
- **G2-FINDING-APOM-46** — Policy-currentness is realization-specific: publication/admission of a policy does not prove every evaluator or enforcement cohort has loaded or applied it; distributed uptake must be evidenced.
- **G2-FINDING-APOM-47** — Authorization conformance is revision-qualified across both policy and the interpretation schema/entity model; prior validation cannot automatically survive schema/semantic evolution.
- **G2-FINDING-APOM-48** — Contextual or token-derived authorization facts are provenance-bearing, applicability-bounded evidence, not canonical relationships; source-token lifetime can exceed underlying membership validity and therefore requires explicit freshness/revocation policy.
- **G2-FINDING-APOM-49** — Authorization evidence has a replay horizon distinct from historical event validity; retention/GC of exact snapshots, policies, schemas or trust material can make later exact re-evaluation unavailable and must propagate proof qualification.
- **G2-FINDING-APOM-50** — Authorization portability/support is a mixed vector across policy semantics, schema/entity interpretation, relationship model, consistency/freshness, temporal/contextual grants, delegation, distribution, enforcement and evidence; binary provider compatibility is unsafe.
- **G2-FINDING-APOM-51** — Role/policy/provider migration closes only after residual evaluator, active-session/contextual-claim, temporary-grant and enforcement consumer cohorts are drained or explicitly dispositioned; destination decision success is not cutover closure.
- **G2-FINDING-APOM-52** — Qualified local/offline authorization and delegated administration are non-amplifying: authority is bounded by explicit facet attenuation and policy/revocation/trust/evidence horizons, with mandatory reconnect requalification before privileged continuation.

## Cycle 7 — Data / Schema / Migrations revisit 6
- **G2-FINDING-DSM-45** — Effective data/schema truth is an applicability-scoped claim over schema/model, dataset/population, tenant/Station, provider realization, transaction profile, consumer cohort, CDC/checkpoint, compatibility, authority/trust and evidence horizon; no single database status is globally authoritative.
- **G2-FINDING-DSM-46** — Data-currentness is realization- and consumer-specific: primary/schema success does not prove replicas, CDC, indexes/materialized projections, caches, writers/readers or external consumers have converged to the same effective epoch.
- **G2-FINDING-DSM-47** — Data conformance is revision-qualified across semantic schema, data population, transaction/invariant profile, provider realization and validation rules; schema compatibility alone cannot prove business-invariant safety.
- **G2-FINDING-DSM-48** — Migration actuation has distinct attempted, accepted, persisted, converged and validated states; acknowledgement loss or timeout creates OUTCOME_UNKNOWN and requires reconcile-before-retry rather than blind replay.
- **G2-FINDING-DSM-49** — Data/migration evidence has a replay horizon distinct from historical validity; loss/GC of WAL/log positions, CDC offsets, schema history, old revisions or validation populations makes exact reconstruction unavailable and must propagate INCONCLUSIVE/new-baseline semantics.
- **G2-FINDING-DSM-50** — Database/provider portability is a mixed support vector across schema/constraint semantics, transaction/isolation, online DDL, backfill, CDC/checkpoint/ordering, derived-read freshness, rollback/forward-fix and evidence; nominal schema compatibility is insufficient.
- **G2-FINDING-DSM-51** — Provider/schema migration closes only after residual source writers, old readers, dual-write divergence, backfill, CDC and derived-consumer cohorts are drained or explicitly dispositioned; destination success does not transfer data authority by itself.
- **G2-FINDING-DSM-52** — Qualified local/offline data operation and delegated Station administration are non-amplifying and horizon-bounded; reconnect after superior schema/data/trust/authority advancement requires reconciliation before privileged writes, migration or cutover continue.

## Historical authority
All findings from prior capabilities and cycles remain authoritative in their dossiers, earlier `FINDING_INDEX.md` revisions and `RESEARCH_PIPELINE_STATE.json` history.