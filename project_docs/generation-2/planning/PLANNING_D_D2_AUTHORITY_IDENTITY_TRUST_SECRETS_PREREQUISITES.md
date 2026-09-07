# Generation 2 — Planning D D2 Authority, Identity, Trust and Secrets Prerequisites

Status: **DECIDED / PASS FOR D2**  
Phase: `PLANNING_D_DEPENDENCY_MIGRATION_STRATEGY`  
Scope: D2 dependency/migration planning only. No D3+, Planning E, Architecture Reconciliation phase, WBS, Work Packages, executive TASKs, Construction, remediation or product code.

## 1. Authority and decision question

This record executes only the D2 action authorized by `RESEARCH_PIPELINE_STATE.json`, under the D0 migration constitution and D1 semantic/Elicitation coexistence strategy. Planning C remains target-architecture authority; Planning B remains current-state authority. Research remains `CLOSED / SATURATED / PASS` with 408 inherited material findings (284 edge scenarios + 124 reusable `ConflictPattern`s).

Constitutional distinctions remain unchanged:

- `Research != remediation`;
- `ConflictPattern != ConflictInstance`;
- `Signal != ConfirmedConflict`;
- `external identity/group/grant evidence != canonical identity/authority truth`;
- `authentication != authorization`;
- `entitlement != operational permission`;
- `credential possession != current trust`;
- `provider ACK != semantic convergence`;
- `AI inference = candidate`.

D2 answers:

> In what dependency order and coexistence envelopes can Identity/Authentication/Federation, Authorization/Policy/Organization/Multitenancy, Enterprise Trust/PKI/Certificate Lifecycle, Secrets/Configuration/Environment Portability and Security/Resilience/Failure Recovery evolve toward the Planning C target without authority amplification, hidden residual credentials/grants/sessions/trust/config populations, or false claims of revocation/rotation/recovery completeness?

## 2. Decision summary

D2 adopts an **authority-first, trust-qualified, residual-aware coexistence strategy**.

No downstream surface may rely on a stronger identity, authorization, trust, secret/config or recovery claim until the semantic owner, producing revision, effective scope, currentness horizon and residual populations of that claim are qualified.

The governing dependency order is:

`canonical subject/resource/scope identity -> trust/assurance prerequisites -> policy/organization authority semantics -> secret/config references and provider bindings -> shadow evaluation -> bounded coexistence -> explicit writer/authority transfer -> revoke/rotate/fence -> residual drain -> reconciliation -> closure`.

This is a partial order. It does not require one provider or implementation and does not authorize construction.

## 3. D2-DEC-001 — Canonical identity precedes provider identity adoption

External directory IDs, IdP subjects, usernames, emails, group IDs, device identities, certificate subjects and provider account IDs remain provider-qualified references/evidence until mapped to a canonical subject/resource identity under an explicit owner.

Migration MUST preserve:

- canonical subject identity distinct from provider realization identity;
- mapping revision and mapping authority;
- tenant/enterprise/Station/site scope;
- assurance/authentication context and effective period;
- alias/merge/split/supersession lineage;
- unresolved or ambiguous mappings as `PARTIAL`/`UNKNOWN` rather than latest-match truth.

A provider mapping may shadow before it governs. Ambiguous identity linking blocks any authority transfer that depends on it.

## 4. D2-DEC-002 — Authentication state cannot manufacture authorization

Authentication migration may establish subject/session/authentication-context evidence. Authorization remains owned by the authorization/policy semantic owner.

A session or token may carry authorization-related claims, but those claims are inputs to policy evaluation unless explicitly established as the canonical authority source for the declared scope. Cached token claims cannot silently outrank current revoke/deprovision state.

`authenticated == true` therefore never implies permission.

## 5. D2-DEC-003 — Authority migration is non-amplifying

For every migrated permission predicate, D2 requires an explicit comparison of current and target effective authority.

Authority may not increase merely because:

- provider group names match internal roles;
- a legacy role contains broader permissions;
- a token carries stale grants;
- a disconnected Station cannot reach central policy;
- an operator uses break-glass;
- a migration copies historical grants;
- an entitlement or subscription is active;
- an AI or Wizard proposes a role mapping.

When exact equivalence cannot be proven, migration defaults to the narrower admitted authority or remains `BLOCKED/PARTIAL` pending owner disposition.

## 6. D2-DEC-004 — Organization and multitenancy scope are prerequisites, not labels

Tenant, enterprise, Station/site, organization unit, role, resource and delegation scopes must be semantically qualified before imported identity/group/grant data can affect authorization.

Cross-tenant or cross-Station mappings require explicit scope edges and cannot be inferred from globally unique provider IDs. A directory group spanning multiple organizational scopes is not automatically a canonical role in each scope.

Isolation evidence is therefore a D2 prerequisite for downstream data, workflow, integration and UI migrations.

## 7. D2-DEC-005 — Delegation, temporary authority and break-glass have bounded lifecycle

Delegated, temporary and emergency authority must carry, where applicable:

- issuer/delegator and authorization basis;
- subject/resource/action/scope constraints;
- start/effective/expiry/revocation times;
- reason/ticket/incident linkage;
- non-delegability or delegation depth;
- required approvals/SoD constraints;
- evidence/audit obligations;
- residual token/session/grant populations after revocation/expiry.

Break-glass is not a bypass around canonical authority. It is a separately governed authority path with stricter provenance, expiry and post-event review.

## 8. D2-DEC-006 — Separation of duties survives coexistence

Migration cannot collapse SoD constraints into a single broad role for convenience. Conflicting duties, maker-checker controls, approval independence and incompatible role combinations remain explicit predicates.

During coexistence, effective authority is evaluated over the union of all still-valid authority sources and residual cohorts. A target policy that appears safe in isolation is not safe if legacy grants, cached sessions or external groups still provide a conflicting path.

SoD closure therefore occurs only after residual authority populations are drained or explicitly dispositioned.

## 9. D2-DEC-007 — Trust domains and assurance are revision-qualified

Enterprise Trust/PKI migration distinguishes:

- trust domain/anchor identity;
- issuer/intermediate identity;
- credential/certificate identity;
- key/material generation;
- trust-bundle revision;
- status/revocation evidence;
- verifier population and adopted bundle revision;
- provider realization and support vector.

`certificate valid by time != trusted by current policy`; `signature valid != authorized`; `provider-issued != enterprise-admitted`.

Trust-anchor or issuer rotation uses overlap/adoption/drainage, not instantaneous replacement.

## 10. D2-DEC-008 — Rotation is population convergence, not object replacement

Secret, key, certificate, token-signing key, trust bundle and sensitive configuration rotation must model at least:

`new generation admitted -> distribution started -> consumer adoption observed -> old generation fenced/revoked where safe -> residual consumers/sessions/credentials drained -> reconciliation -> closure`.

A rotation is not complete when a provider reports a new version exists. Closure requires evidence over the declared consumer/verifier population and currentness objective.

Unknown consumer adoption remains `PARTIAL/UNKNOWN`.

## 11. D2-DEC-009 — Secret reference, material and effective consumer state remain separate

Canonical secret/config references remain stable across provider or version movement. Durable semantic state must not require secret values.

Migration distinguishes:

- reference identity;
- provider binding;
- material/version/generation identity;
- desired configuration revision;
- resolved/materialized value at a consumer boundary;
- effective consumer revision;
- cache/offline copy and currentness horizon;
- revoke/delete/expiry state.

`desired config != distributed config != effective runtime config`.

Secret values and private key material remain excluded from durable migration evidence except for narrowly controlled value-proof mechanisms that do not persist the material itself.

## 12. D2-DEC-010 — Presence/default/delete semantics cannot collapse

Configuration coexistence must preserve `ABSENT != NULL != DEFAULT != DELETE` when the target semantic domain distinguishes them.

Provider-specific empty-string, omitted-field, inherited-default or tombstone behavior is mapped explicitly. Round-trip mapping that cannot preserve the distinction is marked lossy and cannot silently become canonical.

## 13. D2-DEC-011 — Provider mappings use support vectors, not feature-name equality

IdP, directory, PKI, secret-store, KMS/HSM, policy and security providers are admitted by semantic support vectors.

Qualification must include relevant dimensions such as:

- identity lifecycle and immutable identifiers;
- federation/protocol profile;
- assurance/session semantics;
- group/grant propagation behavior;
- revoke/deprovision latency and evidence;
- certificate/key lifecycle and status semantics;
- secret/config versioning and rotation;
- locality/offline behavior;
- audit/evidence availability;
- quotas/rate limits/backpressure;
- failure/timeout/`UNKNOWN` semantics.

Provider feature-name equality never proves substitution equivalence.

## 14. D2-DEC-012 — Shadow authorization/trust evaluation precedes authority transfer

Where current and target policy/trust mechanisms can be evaluated in parallel, D2 uses shadow comparison before cutover.

Shadow records capture:

- current decision and target decision;
- subject/resource/scope/revision inputs;
- evidence/currentness of both paths;
- divergence classification;
- narrower/broader authority result;
- unsupported dimensions;
- stale provider/group/token/trust/config dependencies;
- candidate owner disposition.

Shadow output is evidence, not authority. A target `ALLOW` cannot grant access until the target evaluator is explicitly admitted as governing for that population.

## 15. D2-DEC-013 — Sessions, tokens, grants and credentials are residual cohorts

Nominal policy/provider cutover does not terminate already-issued capability.

D2 treats at least these as drainable residual cohorts:

- sessions and refresh tokens;
- access tokens/assertions;
- API keys/service credentials;
- external directory groups and grants;
- cached authorization decisions;
- delegated/temporary grants;
- certificates and trust bundles;
- secret/config cached generations;
- offline Station authority snapshots;
- recovery/emergency credentials.

Each cohort needs population identity, last-issue horizon, expiry/revoke semantics, currentness objective, drain evidence and explicit closure disposition.

## 16. D2-DEC-014 — Revocation/deprovision is end-to-end propagation

`revocation requested != provider acknowledged != consumer enforced != residual authority drained`.

Revocation/deprovision migration therefore requires evidence across canonical authority, provider state, session/token/credential populations, caches, disconnected sites and downstream systems that may have copied authority.

Where the remote effect is ambiguous:

`APPLIED | NOT_APPLIED | PARTIAL | UNKNOWN`

and harmful duplicate mutation follows `UNKNOWN -> reconcile-before-retry` unless operation-specific duplicate safety is independently proven.

## 17. D2-DEC-015 — Offline/local closure cannot broaden authority

A Station/site may use locally admissible identity/trust/policy/config state only within an explicit local closure and stale/currentness horizon.

Disconnection cannot:

- mint broader authority;
- convert expired/revoked credentials into current credentials;
- promote stale group membership into current truth;
- silently extend break-glass expiry;
- treat cached config as globally current;
- make Fleet observation a local authority source.

Reconnect is a reconciliation boundary. Locally produced evidence preserves producing revisions and may reveal conflicts rather than latest-wins replacement.

## 18. D2-DEC-016 — Security/resilience migration preserves degraded and recovery semantics

Security/Resilience/Failure Recovery is a D2 prerequisite because authority/trust migration must be recoverable without silently reintroducing unsafe state.

Recovery planning distinguishes:

- fail-closed, fail-open-by-explicit-policy and degraded modes;
- fencing/split-brain controls;
- backup/restore producing revision and restored-state currentness;
- credential/trust/config state captured in backups;
- re-protection after restore;
- revocations/rotations that occurred after the backup point;
- external effects that cannot be rolled back;
- operator emergency procedures and their authority basis.

`restore succeeded != restored authority/trust state is current`.

Post-restore reconciliation of identity, grants, trust, secrets/config and revocation events is mandatory before normal authority can be claimed current.

## 19. D2-DEC-017 — Rollback is bounded by irreversible authority/trust effects

Rollback may restore a prior software/config revision only where semantic reversibility is proven.

Examples that may require roll-forward/manual reconciliation instead of inverse execution include:

- credentials already disclosed or issued;
- certificates already revoked;
- provider accounts/groups already externally changed;
- sessions already used to cause effects;
- audit/security evidence already emitted;
- secrets already rotated and old material destroyed;
- external systems with non-reversible deprovision/regrant behavior.

D2 therefore preserves D0 dispositions `ROLLED_FORWARD`, `ROLLED_BACK_WHERE_REVERSIBLE` and `MANUAL_RECONCILIATION_REQUIRED`.

## 20. D2-DEC-018 — Queue/backpressure/capacity are trust and revocation obligations

Identity sync, group/grant mapping, policy shadow comparison, token/session invalidation, certificate issuance/renewal/status, trust-bundle distribution, secret/config propagation and deprovision/reconciliation can all accumulate backlog.

Each material population must expose at least:

- queue depth and oldest age;
- arrival/admission assumptions;
- processing/review capacity;
- provider quota/rate-limit constraints;
- retry amplification/backoff behavior;
- blocked-owner age;
- currentness/convergence objective;
- residual population and finite drain condition.

`revocation throughput < revocation arrival rate` is an operational blocker, not a cosmetic metric.

## 21. D2-DEC-019 — Elicitation/System Understanding lens for authority/trust migration

D2 consumes the versioned EKB and capability-specific lenses. Adaptive questions must cover, when applicable:

- who/what is the canonical subject and identity owner?;
- which external identifiers/groups are evidence versus authoritative mappings?;
- what assurance/authentication level is required?;
- who can grant, delegate, approve, override, revoke and deprovision?;
- which actions are state-, field-, resource-, tenant-, Station- or time-dependent?;
- what SoD/maker-checker combinations must never coexist?;
- what happens before/after submit, approval, revoke or emergency override?;
- which sessions/tokens/keys/certificates/config copies survive a change?;
- what is the maximum acceptable revoke/rotation propagation delay?;
- what operates offline, for how long, and with which stale-authority limits?;
- what is source-of-truth for trust anchors, secrets and effective config?;
- what manual/shadow mechanisms, emergency accounts, shared credentials or off-system approvals exist?;
- how is restore followed by re-protection and currentness reconciliation?;
- what evidence proves adoption rather than merely provider acceptance?

Tacit/negative-space probes explicitly include shared accounts, emergency credentials, manual group edits, verbal authorization, spreadsheet access lists, shadow IdPs/directories, copied secrets, long-lived tokens, local password files, bypass scripts, untracked break-glass and provider-console changes.

Answers preserve `Fact | Claim | Assumption | InferredCandidate | Decision | Requirement | Constraint | OpenQuestion | Conflict | Unknown | OutOfScope | Deferred`; different stakeholders do not receive a silent winner.

## 22. D2-DEC-020 — Coverage and sufficiency remain dimensional

D2 does not create an aggregate authority/trust quality score. Applicable coverage dimensions include:

- canonical subject/resource/scope identity;
- authentication/assurance;
- authority owner/source-of-truth;
- grant/delegation/revoke/deprovision;
- SoD/approval/break-glass;
- session/token/credential lifecycle;
- trust domain/issuer/bundle/status;
- secret/config source/version/effective adoption;
- provider mapping/support vector;
- offline/local currentness;
- failure/degraded/recovery;
- residual cohorts;
- queue/capacity/convergence;
- evidence/audit/currentness;
- acceptance/Product Proof route.

States remain `UNTOUCHED | DISCOVERING | PARTIAL | RESOLVED | CONFLICTED | BLOCKED | NOT_APPLICABLE | DEFERRED`.

Critical gaps that prevent false completion include unknown authority owner, ambiguous canonical subject mapping, revoke/deprovision semantics absent, residual token/session/credential population unknown, trust-bundle currentness unknown, secret/config effective adoption unknown, break-glass without expiry/audit, external grant without reconciliation, offline authority without stale horizon and restore without post-restore authority/trust reconciliation.

## 23. Planning D migration guards by slice

### Identity / Authentication / Federation

`DISCOVERED`: identity/provider populations inventoried.  
`QUALIFIED`: canonical subject mapping, assurance and provider semantics known.  
`COEXISTENCE_READY`: mappings can coexist without changing authority.  
`SHADOWING`: authentication/mapping differences observed.  
`PARTIAL_CUTOVER/CUTOVER`: target identity path governs declared population only after mapping/currentness proof.  
`RESIDUAL_DRAIN`: sessions/tokens/legacy identities deprovisioned or explicitly retained.  
`RECONCILED/CLOSED`: no hidden identity/assurance residual capable of unqualified authority.

### Authorization / Policy / Organization / Multitenancy

Shadow policy evaluation precedes writer/authority movement. Cutover requires canonical scope, non-amplification and SoD qualification. Closure requires residual grants/sessions/caches/delegations drained or dispositioned.

### Enterprise Trust / PKI

Overlap of trust generations is explicit. Cutover is verifier-population adoption, not issuer creation. Closure requires residual credentials/bundles/status uncertainty inside declared currentness bounds.

### Secrets / Configuration / Environment Portability

References remain stable while bindings/material generations move. Target config may shadow/compare before becoming governing. Closure requires consumer-effective adoption and stale/offline copy disposition.

### Security / Resilience / Failure Recovery

Recovery controls must be qualified before risky authority/trust cutover. Restore, degraded mode and emergency authority remain revision/currentness qualified; recovery closure requires re-protection and reconciliation.

## 24. Typed dependencies consumed and produced

| Edge | D2 requirement |
|---|---|
| `SEMANTIC_PREREQUISITE` | canonical subject/resource/scope and owner-qualified references from C0/D1 precede identity/grant/trust normalization |
| `AUTHORITY_PREREQUISITE` | explicit canonical authority owner precedes permission writer movement or downstream reliance |
| `REVISION_PREREQUISITE` | policy, mapping, trust, secret/config and recovery revisions qualify coexistence/currentness |
| `EVIDENCE_PREREQUISITE` | shadow decisions, revoke/rotation adoption and recovery state require provenance/currentness |
| `PROVIDER_PREREQUISITE` | external IdP/directory/PKI/KMS/secret/policy providers require support-vector qualification |
| `OPERABILITY_PREREQUISITE` | revoke/rotation/deprovision/recovery queues and finite convergence are visible before closure |
| `TRUST_PREREQUISITE` | assurance/trust/credential prerequisites precede downstream authorization and provider access |
| `LOCALITY_PREREQUISITE` | Station/offline authority and trust state have bounded currentness and reconnect reconciliation |

D2 produces prerequisites for D3+: stable subject/resource/scope references, explicit authority ownership, revision-qualified trust/credential/config state, residual-cohort semantics, revoke/rotation/recovery currentness and provider-qualified trust boundaries.

## 25. Planning E proof obligations carried forward

D2 registers, but does not execute, proof obligations including:

1. external identity/group equality cannot silently establish canonical identity or role;
2. authentication success cannot grant operational authorization;
3. target policy shadow `ALLOW` cannot become authority before explicit cutover;
4. migration cannot increase effective authority through union with legacy grants;
5. cross-tenant/Station identity or grant mappings require explicit scope qualification;
6. SoD remains valid across legacy + target authority sources;
7. break-glass/delegation expires, is bounded, auditable and cannot silently persist;
8. stale token/session/group claims cannot outrank current revoke/deprovision state;
9. revocation provider ACK cannot prove residual authority drained;
10. ambiguous external revoke/deprovision remains `UNKNOWN` and reconciles before harmful retry;
11. trust-anchor/issuer rotation proves verifier adoption and residual-bundle drainage;
12. certificate time validity cannot substitute for current trust/policy admission;
13. secret reference survives provider/version rotation without exposing durable secret value;
14. desired config, distributed config and effective consumer config remain distinguishable;
15. `ABSENT/null/default/delete` survive provider/config round trips when semantically distinct;
16. offline Station cannot broaden authority or extend stale credentials beyond declared horizon;
17. reconnect reconciles identity/grant/trust/config by identity/revision rather than latest-wins;
18. restore cannot resurrect revoked authority/credential/trust/config state without detection/reconciliation;
19. security recovery proves re-protection and post-restore currentness before normal readiness;
20. provider substitution cannot claim parity when support-vector dimensions differ;
21. residual session/token/key/certificate/config populations remain visible through drain/disposition;
22. queue depth/age and processing capacity demonstrate finite revoke/rotation/deprovision convergence;
23. Elicitation contradictions remain unresolved until owner/evidence disposition, not AI consensus;
24. no scalar coverage score can mask an unknown HIGH/CRITICAL authority/trust gap;
25. Fleet observation cannot prove Station-local current authority/trust/config state.

## 26. Brownfield / Legacy Mirroring

Brownfield authority/trust assimilation remains evidence-first:

`discover -> source/revision -> extract -> map -> fidelity classify -> preserve unresolved semantics -> propose -> owner adopt -> canonical revision`.

Legacy directories, spreadsheets, ACLs, shell scripts, hard-coded credentials, shared accounts, local certificate stores, provider-console configuration, emergency procedures, manual approvals and unofficial overrides remain evidence/candidates until the proper owner adopts them. Observed permissive behavior is not proof that such permission is intended or approved.

## 27. Physical / Peripheral boundary

D2 may migrate device/service identity, provider trust, credentials, permissions, topology, telemetry trust/currentness, command authorization evidence and recovery state only in the C2 integration/governance plane.

D2 creates no generic direct physical actuation capability. A credential or permission capable of causing a physical effect remains specialized-domain/provider-qualified; ambiguous command/effect state preserves `PARTIAL/UNKNOWN` and reconciliation obligations.

## 28. D2 closure result

**Result: PASS_FOR_D2.**

D2 establishes that downstream migration may rely on stronger authority/trust claims only after canonical identity/scope, non-amplifying policy ownership, trust/credential/config revisions, provider support vectors, residual sessions/tokens/grants/credentials/config copies, revoke/rotation/deprovision currentness, offline/local closure, failure/recovery semantics and finite operational convergence are explicit.

No product migration has been executed. No Planning E proof has been run. No research finding has been converted into a remediation or `ConflictInstance`.

### Next ordered Planning D action

Proceed only to **D3 — Data, Workflow and External-Effect Semantics** in a later action. Plan Data/Schema/Migrations, Workflow/Durable Execution, Integration/Automation and Notifications/Events/Messaging coexistence around in-flight revisions, `ExecutionEnvelope/ExecutionState/ExecutionJournal`, external-effect identity, `APPLIED | NOT_APPLIED | PARTIAL | UNKNOWN`, idempotency horizons, replay/reconciliation, queues/backpressure/capacity, historical producer revision preservation, Brownfield evidence, Elicitation/System Understanding coverage and separate Production Readiness Coverage. Do not execute D4+, Planning E or later phases in the same action.
