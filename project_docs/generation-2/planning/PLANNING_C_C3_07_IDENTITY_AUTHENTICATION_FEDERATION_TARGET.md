# Generation 2 — Planning C C3.7: Identity / Authentication / Federation Target Architecture

Status: **DECIDED / PASS_FOR_CAPABILITY**  
Phase: `PLANNING_C_TARGET_ARCHITECTURE`  
Capability: `Identity / Authentication / Federation`  
Decision scope: canonical target architecture only. No implementation, Planning D/E execution, WBS, Work Packages, executive TASKs, Construction or product code.

Entry branch head revalidated before persistence: `d60dffc931c67d652f77a79ea3e938da29362385`.

## 1. Authorities and inherited constraints

Authoritative inputs:

- `RESEARCH_PIPELINE_STATE.json` — C3.7 is the only authorized next decision;
- `PLANNING_C_TARGET_ARCHITECTURE_ENTRY_FRAMEWORK.md`;
- `PLANNING_C_C0_UNIVERSAL_CAPABILITY_ARCHITECTURE_SEMANTIC_SUBSTRATE.md`;
- `PLANNING_C_C1_ELICITATION_SYSTEM_UNDERSTANDING_ARCHITECTURE.md`;
- `PLANNING_C_C2_PHYSICAL_PERIPHERAL_INTEGRATION_BOUNDARY.md`;
- `PLANNING_A_IDENTITY_AUTHENTICATION_FEDERATION_BOUNDARIES.md`;
- `PLANNING_B_IDENTITY_AUTHENTICATION_FEDERATION_SB_CURRENT_STATE.md`;
- inherited adversarial inventory: 284 edge scenarios + 124 reusable `ConflictPattern`s = 408 material findings, with zero HIGH/CRITICAL lacking owner/proof/detection route.

External conceptual precedents used to challenge target semantics, not as implementation mandates:

- NIST SP 800-63 Revision 4 separates identity proofing/enrollment, authentication/authenticator management and federation/assertions into distinct assurance concerns;
- OpenID Connect qualifies subject identifiers by issuer/client/sector and distinguishes pairwise subject identifiers from globally correlatable identifiers;
- WebAuthn-style authenticator evidence demonstrates that credential/device-related signals require interpretation and cannot be promoted directly to canonical-human truth;
- SCIM-style external resource identifiers and lifecycle operations are useful realization precedents but are not canonical SB identity semantics;
- SRE/production-readiness practice remains controlling for owner, currentness, failure, recovery, capacity, reconciliation and change-safety coverage.

Standing invariants:

- `Research != remediation`;
- `ConflictPattern != ConflictInstance`;
- `Signal != ConfirmedConflict`;
- `authentication evidence != authorization`;
- `credential possession != canonical identity truth`;
- `provider subject/account ID != canonical identity`;
- `external group/role != canonical permission`;
- `last successful authentication != current session/identity validity`;
- `cryptographic validity != semantic identity authority`;
- `AI inference/proposal != identity-link authority`;
- `provider-reported biometric/device identity != canonical human identity`;
- `Fleet observation != local truth != control authority`.

## 2. Decision summary

Planning C adopts a **provider-neutral, revision-qualified Canonical Identity & Authentication semantic layer** specialized over C0 identity, evidence, currentness, effect and authority primitives.

The capability owns the semantics required to answer:

1. **Who or what is the canonical subject/principal?**
2. **Which external/account/credential/session identities are currently linked to it, under which namespace and revision?**
3. **How was the subject authenticated, with what method, assurance, provenance and currentness?**
4. **Which federation/trust relationship produced the assertion and how is the subject mapping qualified?**
5. **Which identity/authentication lifecycle facts remain unresolved, residual, stale, ambiguous or `INCONCLUSIVE`?**

It does **not** own permissions, Role/Station semantics, tenant authorization, trust-anchor/PKI lifecycle, provider admission/cutover mechanics, generic secret storage, protocol conformance, privacy-law resolution, UI composition or physical truth.

The target architecture extends the useful current foundation — provider-neutral logical identity refs, separate provider refs, secret-reference separation, opaque expiring sessions and authentication/authorization separation — without making the current in-memory session realization universal.

## 3. C3.7-DEC-001 — Canonical subject identity is distinct from every realization identity

Identity requires distinct identities for at least:

- `CanonicalSubjectRef` — stable semantic subject/principal identity;
- `CanonicalSubjectRevisionRef` — immutable revision of subject state where material;
- `ExternalIdentityBindingRef` — explicit mapping between canonical subject and external identity;
- `ExternalIdentityRef` — provider-qualified external account/directory/subject identity;
- `CredentialRef` / `AuthenticatorRef` — logical credential/authenticator identity;
- `CredentialRealizationRef` — provider/device/secret/certificate-backed realization where applicable;
- `AuthenticationCeremonyRef` — one authentication attempt/ceremony;
- `AuthenticationAssertionRef` — one qualified assertion/evidence object;
- `SessionRef` — logical authenticated session identity;
- `TokenRef` — opaque/logical token identity when token lifecycle matters;
- `FederationRelationshipRef` — relying-party/issuer/trust relationship identity;
- `IdentityProofingOccurrenceRef` — proofing/enrollment occurrence;
- `IdentityTransitionRef` — link/unlink/merge/split/recovery/revoke/deprovision transition;
- C0 `ProviderBindingRef`, `RevisionVector`, `EvidenceEnvelope`, `CurrentnessHorizon` and `AuthorityEnvelope` references.

Email addresses, usernames, phone numbers, directory IDs, OIDC `sub`, SCIM `id`/`externalId`, certificate subjects, biometric template IDs, device IDs, session IDs and token IDs are realization identities/evidence by default. Value equality never makes them canonical identity.

External identity equality is namespace-qualified. At minimum, qualification can include provider, issuer, tenant/directory, site, client/audience/sector, account namespace and provider/binding revision where relevant.

## 4. C3.7-DEC-002 — Canonical subject state is revisioned and lineage-preserving

A canonical subject is not a mutable row whose history may be overwritten. Material identity transitions preserve lineage and effective intervals.

Supported semantic transition families include:

`DISCOVERED/CANDIDATE -> ENROLLED -> ACTIVE -> SUSPENDED/DISABLED -> RETIRED`

plus governed link/unlink, merge/split, correction/supersession, provider migration and recovery transitions where explicitly enabled.

Merge does not erase source identities or historical evidence. Split does not retroactively rewrite historical assertions. Corrections identify what was corrected, when, by whom/what authority and which historical claims remain valid only under prior revisions.

Delete/recreate is a new lifecycle occurrence. Reuse of an external identifier cannot automatically resurrect a retired canonical subject or inherit old sessions/credentials/memberships.

## 5. C3.7-DEC-003 — External-to-canonical linking is explicit, evidence-backed and non-silent

An `ExternalIdentityBinding` carries at least:

- canonical subject reference;
- qualified external identity reference;
- binding/mapping revision;
- provider/binding/profile revision;
- source/provenance;
- creation/adoption authority;
- proof/evidence references;
- match method/classification;
- confidence only where it is analytical evidence, never authority;
- effective interval/currentness;
- status such as `ACTIVE`, `SUSPENDED`, `UNLINKED`, `SUPERSEDED`, `AMBIGUOUS`;
- collision/reuse/reconciliation state.

Automated correlation by email, name, phone, employee number, device, biometric, provider heuristic or AI produces a candidate or signal. It cannot create, merge or replace a canonical identity without the governed adoption rule applicable to that identity class.

If multiple canonical subjects remain plausible, the result is `INCONCLUSIVE`/`AMBIGUOUS`, not first-match selection.

## 6. C3.7-DEC-004 — Identity proofing, enrollment and authentication are separate semantic stages

Identity proofing establishes evidence about who an applicant is. Enrollment establishes or changes a governed relationship between a canonical subject and one or more authentication means. Authentication establishes that a claimant currently demonstrates the required evidence for a requested context.

Therefore:

`proofed-at-T != enrolled-now != authenticated-now != authorized-now`.

A proofing result may carry an assurance level, source/evidence class, producing policy/profile revision, verification time, expiry/reproof triggers and unresolved discrepancies. Authentication consumes the applicable enrolled authenticator/credential state but cannot retroactively strengthen identity proofing evidence.

## 7. C3.7-DEC-005 — Authentication ceremony and assertion are first-class, qualified evidence

Each material authentication ceremony records or references, as applicable:

- requested context/relying party;
- canonical or candidate subject;
- provider/binding/federation relationship;
- credential/authenticator class and logical reference without exposing secret values;
- authentication method(s);
- required and achieved assurance dimensions;
- step-up/re-authentication requirement/result;
- producing policy/profile revision;
- challenge/ceremony identity where relevant;
- issued/observed/effective time;
- freshness/currentness horizon;
- source/provenance/evidence references;
- failure/inconclusive reason;
- privacy/redaction classification.

Authentication disposition preserves at least:

- `AUTHENTICATED`;
- `NOT_AUTHENTICATED`;
- `INCONCLUSIVE`.

`AUTHENTICATED` is context-qualified; it is not a permanent subject property. `INCONCLUSIVE` is used when evidence is stale, missing, ambiguous, unverifiable, insufficiently scoped or currentness cannot be established.

## 8. C3.7-DEC-006 — Assurance is vector/claim-qualified, not a scalar universal truth

Identity does not reduce assurance to one global score. Required/achieved assurance is represented as qualified dimensions or named profiles whose semantics are revisioned.

Material dimensions may include:

- identity-proofing assurance;
- authenticator strength/resistance properties;
- authentication freshness;
- federation assertion assurance/context;
- device/endpoint evidence when relevant;
- recovery-path strength;
- phishing/replay resistance where supported;
- provider/issuer trust qualification;
- evidence completeness/currentness.

A stronger value in one dimension cannot silently compensate for a blocked critical dimension. Provider-specific assurance labels are mapped explicitly and may remain `PARTIAL` or unsupported.

## 9. C3.7-DEC-007 — Credential/authenticator lifecycle is independent from canonical identity lifecycle

Credentials/authenticators can be registered, bound, activated, rotated, recovered, suspended, revoked, expired, replaced and retired without changing canonical subject identity.

A subject may hold multiple credentials/authenticators. Loss or revocation of one credential does not imply canonical subject deletion. Conversely an active canonical subject does not imply any usable credential remains.

Credential possession, successful challenge response, device registration, authenticator counter behavior, backup state or biometric-provider match are evidence about an authenticator ceremony. They are never, alone, canonical-human identity truth.

Recovery creates its own governed transition/evidence lineage. A recovery path cannot implicitly lower assurance or bypass SoD/approval requirements.

## 10. C3.7-DEC-008 — Sessions and tokens are residual populations with independent currentness

An authenticated session is a logical state derived from prior authentication evidence and session policy. It carries at least:

- canonical subject ref;
- producing authentication assertion/ceremony;
- provider/federation/binding revision where relevant;
- issued/start time;
- expiry/currentness horizon;
- last requalification/step-up where relevant;
- client/site/device context only when semantically warranted;
- revocation/disablement relationship;
- session cohort/revision.

Tokens are credentials/realizations used to carry or reference session/authentication state; token validity does not become canonical identity truth.

Revocation, disablement, provider migration, credential compromise, mapping change or federation-policy change may invalidate future use while old tokens/sessions remain physically present. Therefore:

`revocation requested != revocation propagated != residual sessions drained`.

Residual sessions/tokens remain an explicit cohort until expired, revoked, rejected on use, reconciled or otherwise dispositioned.

## 11. C3.7-DEC-009 — Federation relationships and subject mappings are revision-qualified

A federation relationship includes at least:

- issuer/identity authority identity;
- relying-party/audience/client identity;
- trust relationship/profile revision;
- accepted subject namespace/type;
- mapping/link policy revision;
- assertion validation requirements;
- assurance/context mapping;
- metadata/trust-currentness requirements;
- attribute minimization and disclosure policy references;
- session/logout/revocation expectations where applicable;
- provider capability/support qualification.

Cryptographically valid assertions are candidate authentication evidence until issuer/audience/context/currentness and external-to-canonical subject mapping are qualified.

Subject identifiers must be interpreted in their proper issuer/client/sector namespace. A provider may issue different pairwise subject identifiers for the same human across relying parties; conversely identifier reuse/collision in a provider namespace must not collapse canonical subjects.

## 12. C3.7-DEC-010 — Authentication remains constitutionally separate from authorization

Identity emits principal/authentication facts and qualified claims. Authorization independently evaluates whether the principal may perform an action on a resource in a tenant/Station/organization context.

The following are never direct permission grants:

- successful login;
- external provider group/role;
- directory membership;
- token scope emitted by a foreign provider;
- certificate subject/SAN;
- device ownership/registration;
- biometric match;
- AGWS surface visibility;
- Fleet reachability;
- AI-generated identity correlation.

External group/role/membership claims may be inputs to an Authorization-owned mapping/adoption rule. Identity preserves their provenance and revision; it does not own the resulting canonical permission.

## 13. C3.7-DEC-011 — Provider substitution/coexistence preserves canonical identity and exposes residual cohorts

Provider/Binding owns provider admission, support qualification, binding, cutover and coexistence. Identity supplies the semantic requirements that a candidate realization must support.

Provider substitution qualifies at least:

- canonical/external mapping preservation/requalification;
- subject identifier semantics and reuse risk;
- authenticator/credential portability or reenrollment requirements;
- assurance mapping;
- session/token/revocation behavior;
- federation metadata/trust/currentness;
- recovery/deprovision behavior;
- audit/provenance export;
- offline/local behavior;
- rate/capacity/operability;
- privacy/residency/minimization.

Cutover does not imply old-provider drainage. Old accounts, credentials, sessions, assertions, caches, recovery channels and asynchronous deprovision/revoke jobs form residual cohorts with explicit status.

`same protocol name != semantic equivalence`.

## 14. C3.7-DEC-012 — Remote account/link/deprovision effects preserve ambiguity

Identity lifecycle may require external mutating operations through Integration & Automation. Those operations preserve C0/C3.6 effect dispositions including:

- `APPLIED`;
- `NOT_APPLIED`;
- `PARTIAL`;
- `UNKNOWN`.

Timeout or ambiguous provider response after create/link/unlink/revoke/deprovision is not safe to retry automatically unless the target-specific idempotency/deduplication contract is qualified.

Default rule:

`UNKNOWN remote identity mutation -> reconcile-before-retry`.

Provider acknowledgement cannot prove residual sessions/tokens/downstream copies are drained.

## 15. C3.7-DEC-013 — Local/offline authentication is a qualified closure, not indefinite trust

A generated system may authenticate locally during Fleet/provider disconnection only where the capability declares a `QualifiedLocalClosure` containing:

- eligible subject/credential classes;
- retained verifier/evidence set;
- maximum offline/currentness horizon;
- local revocation/disablement knowledge horizon;
- acceptable assurance degradation, if any;
- excluded high-risk operations/contexts;
- clock/time assumptions;
- audit retention;
- reconnect requalification/reconciliation procedure.

Provider/Fleet outage cannot silently extend a session, federation assertion or revocation cache beyond its declared horizon. When evidence becomes too stale, the result is `INCONCLUSIVE` or fail-closed according to the applicable policy.

Reconnect reconciles local identity/session events with upstream/canonical state while preserving event time versus observation time.

## 16. C3.7-DEC-014 — Fleet identity visibility is observational unless separately authorized

Fleet may aggregate qualified identity operational facts such as:

- authentication success/failure rates;
- stale federation metadata;
- mapping ambiguity;
- residual sessions/credentials;
- provider health/currentness;
- backlog/queue age for provisioning/revocation/reconciliation;
- identity-capacity pressure;
- unresolved recovery/deprovision operations.

Fleet aggregation does not become canonical identity truth merely because it is global. Fleet-initiated identity control/change requires explicit Authorization-owned authority and the target site/provider must still report/reconcile actual effect.

Local observations can be fresher than Fleet; Fleet can be more complete across populations but stale for a site. Currentness and population coverage are therefore always qualified.

## 17. C3.7-DEC-015 — Privacy/minimization and sensitive/biometric boundaries are explicit

Identity collects only evidence needed for declared identity/authentication purposes and exposes privacy-safe telemetry by default.

The target architecture distinguishes:

- canonical identity facts;
- provider/external identifiers;
- verification evidence references;
- sensitive attributes;
- authentication telemetry;
- biometric/device evidence references;
- raw secret/biometric material.

Raw credential secrets, biometric templates/raw samples and unnecessary PII are not portable canonical identity payloads. Where a specialized provider/device performs biometric matching, SB may retain a provider-qualified reference/result/provenance/currentness contract without claiming possession of physical biometric truth.

Privacy/Data Governance owns retention, deletion/legal-hold, residency and purpose obligations. Identity declares the semantic evidence needed for audit/replay and accepts Privacy-governed retention/disposition outcomes without silently rewriting identity history.

Monitoring must support redaction/minimization, access auditing, suspicious-activity signals and privacy-safe aggregation.

## 18. C3.7-DEC-016 — Physical/Peripheral identity mappings remain bounded to the integration plane

Under C2, Identity may represent provider-qualified external accounts/subjects associated with VMS, BMS, access-control, PDV, device-management or other specialized systems.

It may model:

- canonical person/service -> specialized-system account mapping;
- provider/resource namespace;
- grant/account lifecycle evidence;
- provisioning/deprovisioning/reconciliation state;
- device/reader-reported authentication event evidence;
- freshness/currentness and site qualification.

It does not infer that a badge, biometric match, reader event, camera classification, device identity or provider account is canonical human identity truth. It does not create generic direct physical actuation authority.

`provider-reported identity/event != independent physical truth`.

## 19. C3.7-DEC-017 — Brownfield / Legacy Mirroring is evidence-first and ambiguity-preserving

Brownfield identity discovery may ingest directory exports, spreadsheets, HR identifiers, emails, legacy usernames, badges, certificates, local accounts, scripts, group mappings, old IdP configurations, access-control identities and manual recovery procedures.

The path is:

`discover -> source/revision -> classify -> candidate external identity -> candidate canonical mapping -> contradiction/ambiguity analysis -> owner-governed adoption -> canonical binding/revision`.

A legacy identifier with high apparent match confidence remains an `InferredCandidate` until the applicable owner/gate adopts it. Duplicate emails, recycled employee IDs, renamed accounts, mergers, split organizations and provider identifier reuse must remain representable without forced merge.

Historical successful logins do not prove current identity linkage or session validity.

## 20. C3.7-DEC-018 — Identity evidence/provenance is claim-scoped and replayable

Material identity/authentication decisions produce qualified evidence linking, as applicable:

- canonical subject/revision;
- external binding/revision;
- provider/federation relationship revision;
- proofing/enrollment occurrence;
- credential/authenticator logical reference;
- authentication ceremony/assertion;
- assurance/profile revision;
- timestamps/currentness;
- session/token cohort;
- identity transition/revocation/recovery event;
- authority for state-changing identity transitions;
- reconciliation outcome;
- supersession/correction lineage.

Evidence proves only the claim its source supports. A valid signature can prove integrity/authenticity of an assertion under a trust context; it cannot prove canonical subject mapping, current permission or physical-human identity by itself.

Historical replay uses the producing revision vector. It cannot silently reinterpret old evidence under a newer mapping/policy/provider profile.

## 21. C3.7-DEC-019 — Queueing, flow and capacity are identity operability semantics when they affect safety/currentness

Identity has multiple service classes, not one generic throughput number. Material queues can include:

- interactive authentication ceremonies;
- federation metadata/key refresh;
- identity proofing/enrollment;
- provisioning/deprovisioning;
- revoke/disable propagation;
- reconciliation/readback;
- recovery/manual review;
- audit/evidence export.

Capacity reasoning must qualify arrival rate `lambda`, service rate `mu`, burst/peak assumptions, queue depth **and age**, retry amplification, provider quotas, concurrency constraints, priority/starvation, maintenance windows and residual-cohort drainage.

A healthy average login latency can coexist with an unsafe revocation backlog. Therefore:

`low mean utilization != all identity queues healthy != sufficient revoke/recovery headroom`.

Critical safety/currentness queues such as revoke/deprovision/reconciliation may require independent SLOs and alert ownership.

## 22. C3.7-DEC-020 — Operability Elicitation Lens is mandatory for identity realizations

For every identity capability slice, provider/federation relationship and critical workflow, elicitation asks at minimum:

- Como saberemos que está funcionando?
- Como saberemos que está degradado?
- Quem é responsável e qual é o on-call/escalation owner?
- Que evidência precisamos para autenticação, linking, recovery, revoke e reconciliation?
- Qual estado pode permanecer `UNKNOWN`/`INCONCLUSIVE`, por quanto tempo e para quais ações?
- Qual perda/atraso é aceitável para auth events, metadata, revoke/deprovision, reconciliation e audit evidence?
- Como recuperar após provider outage, credential compromise, mapping error ou session-store loss?
- Como reconciliar contas externas, sessões, tokens e mappings?
- Como validar depois de mudança/deploy/provider cutover?

The elicitation record also captures:

- SLO/SLA and interactive latency;
- expected throughput, peak/burst and capacity headroom;
- queue/backlog/age by service class;
- retry/idempotency and timeout/`UNKNOWN` behavior;
- dependency health and federation/provider freshness;
- retention of identity/auth evidence;
- alert threshold -> action owner -> runbook;
- maintenance windows;
- provider quotas/rate limits/pagination;
- degraded/offline behavior;
- source-of-truth direction;
- recovery/rollback/reconciliation;
- credential/session expiry/revocation;
- suspicious activity signals;
- privacy minimization/redaction;
- cost/usage dimensions without making observability a pricing authority.

## 23. C3.7-DEC-021 — Production Readiness Coverage remains separate from feature completeness

A fully specified identity feature is not production-ready merely because its happy path is complete.

Identity carries separate `ProductionReadinessCoverage` dimensions:

- `OBSERVABILITY`;
- `OWNERSHIP`;
- `FAILURE_HANDLING`;
- `RECOVERY`;
- `CAPACITY`;
- `CURRENTNESS`;
- `SECURITY`;
- `RECONCILIATION`;
- `CHANGE_SAFETY`;
- `COST`;
- `DOCUMENTATION`.

Each dimension uses:

`UNTOUCHED | PARTIAL | RESOLVED | CONFLICTED | BLOCKED | NA`.

No scalar readiness score can hide a critical `BLOCKED` or `CONFLICTED` dimension.

Required adversarial checks include at least:

- identity feature complete but no operational owner;
- federation integration without timeout/reconciliation;
- auth dashboard without freshness/currentness;
- retryable provisioning without idempotency;
- alert without action owner/runbook;
- metric without unit/context/namespace;
- failure mode without recovery;
- provider rollout without rollback/residual-cohort plan;
- capacity claim without peak assumptions;
- audit/compliance claim without evidence-retention definition.

## 24. C3.7-DEC-022 — Control, observe and change authority are separate

Identity surfaces classify operations at least as:

- `OBSERVE` — inspect qualified identity/authentication facts/evidence;
- `CONTROL` — execute already-governed operational actions such as authorized session invalidation/reconciliation within a bounded contract;
- `CHANGE` — alter identity mappings, lifecycle state, federation relationships, assurance requirements or provider realization.

UI/AGWS visibility does not grant control/change. AI may summarize, detect anomalies or propose mappings/recovery steps, but cannot merge identities, link accounts, weaken assurance, revive credentials, extend currentness or revoke/deprovision without the applicable deterministic/authorized path.

## 25. Cross-capability ownership contract

### Authorization / Policy / Organization / Multitenancy

Consumes canonical principal/authentication facts; owns permission, Role/Station/tenant context, delegation, SoD and policy decisions.

### Provider / Binding / Capability Negotiation

Owns provider discovery/support/admission/binding/fallback/cutover. Identity owns the portable identity/authentication/federation semantics and mapping requirements.

### Integration & Automation

Owns external account/link/provision/deprovision invocation/effect/reconciliation mechanics. Identity owns the desired semantic identity lifecycle and interpretation.

### Enterprise Trust / PKI

Owns certificates, trust anchors, path/revocation qualification and workload/service trust material. Identity consumes qualified trust evidence but owns subject/authentication meaning.

### Secrets / Configuration

Owns secret-value/reference realization and secret rotation mechanisms. Identity owns credential/authenticator semantics and authentication consequences.

### Privacy / Data Governance

Owns retention, residency, purpose/use, deletion/legal hold and minimization obligations. Identity owns identity/authentication semantic facts.

### AGWS / UI

Consumes authenticated identity plus independent Authorization result. Person identity never collapses Role/Station or visible surface into authority.

### Fleet / Observability

Consumes qualified operational evidence. Fleet aggregation is not canonical identity truth or mutation authority.

### Physical / Peripheral specialized systems

Expose only bounded integration-plane external account/subject/event evidence unless separately owned by a specialized domain capability.

## 26. Planning D migration constraints carried forward

Planning D must preserve at least these migration constraints:

1. current `CompilerRuntimeIdentity.id/subjectRef` cannot be silently reinterpreted as a provider-global/canonical-human identifier;
2. current provider references must migrate additively toward qualified external identity/federation mappings;
3. existing opaque local sessions remain a realization cohort, not the universal session architecture;
4. authentication/authorization separation must remain intact through migration;
5. old/new identity-provider coexistence requires explicit mapping requalification and residual session/credential drainage;
6. historical identity/session evidence must retain producing revision semantics;
7. delete/recreate and external-ID reuse cannot reconnect to old canonical subjects by value equality alone;
8. migration cannot require raw secret/biometric material to become canonical payload;
9. remote account/link/revoke/deprovision `UNKNOWN` effects require reconciliation-safe transition planning;
10. offline/local behavior must declare bounded currentness horizons before migration can claim equivalent operability;
11. identity telemetry/backlog capacity must not be evaluated only by aggregate average utilization;
12. Brownfield identity assimilation must preserve ambiguity and explicit adoption.

No Planning D execution occurs in C3.7.

## 27. Planning E proof candidates carried forward

Planning E should later define executable or inspectable proofs for at least:

- provider subject/account ID cannot silently become canonical subject;
- duplicate/reused external identifier does not resurrect old canonical identity;
- ambiguous external mapping returns `INCONCLUSIVE` rather than auto-merge;
- authentication success does not create permissions;
- external group/role claim does not become canonical permission without Authorization-owned mapping;
- stale/expired federation/session evidence cannot satisfy a fresh assurance requirement;
- step-up/re-authentication produces separately qualified evidence;
- revoked/disabled credential/session residual cohorts are detectable and drainable;
- provider cutover preserves canonical identity while old sessions/credentials remain explicitly residual until dispositioned;
- `UNKNOWN` remote link/revoke/deprovision reconciles before unsafe retry;
- offline authentication stops or becomes `INCONCLUSIVE` after declared currentness horizon;
- reconnect preserves event time versus observation time and requalifies stale local evidence;
- provider-reported biometric/device identity cannot establish canonical human identity by itself;
- AI-generated identity-link candidate cannot mutate canonical identity without governed adoption;
- Production Readiness Coverage can be `BLOCKED` despite feature completeness;
- revoke/deprovision queue starvation can be detected independently of interactive login latency;
- post-change/deploy/provider-cutover validation proves intended identity/federation currentness and residual-cohort status.

No Planning E execution occurs in C3.7.

## 28. Adversarial obligations inherited without remediation

C3.7 consumes the existing 408 material adversarial findings as design/proof obligations. No new ConflictPattern, ConflictInstance or remediation is created here.

High-risk inherited families especially relevant to Identity include:

- semantic-vs-realization identity conflation;
- stale/currentness strengthening;
- evidence/authority conflation;
- provider substitution and residual cohorts;
- delete/recreate and identifier reuse;
- partial/unknown effect semantics;
- offline/federated evidence divergence;
- queue/backlog starvation and misleading scalar health;
- privacy/evidence-retention tension;
- Brownfield false unification;
- Physical/Peripheral reported identity versus physical/human truth;
- AI/low-code authority amplification;
- causal/correlation overclaim.

## 29. Symbiotic architecture proof

The target boundary is coherent if a generated SB system can:

1. preserve one stable canonical Person while two identity providers coexist;
2. maintain explicit provider-qualified subject/account mappings without treating either external ID as canonical;
3. authenticate through either provider with revision/currentness/assurance evidence;
4. let Authorization independently decide the Person's current Station/Role access;
5. revoke or migrate one provider while exposing residual sessions/credentials;
6. continue only bounded local authentication during disconnection;
7. reconcile on reconnect without rewriting event time or historical evidence;
8. reject ambiguous/reused external identifiers as `INCONCLUSIVE` rather than merge silently;
9. ingest specialized access-control/device identity events only as qualified integration evidence;
10. permit AI to propose links or explain anomalies but never acquire identity-link/change authority.

## 30. Planning C C3.7 decision

**PASS_FOR_CAPABILITY / TARGET_ARCHITECTURE_DECIDED.**

Generation 2 adopts a portable Identity / Authentication / Federation architecture centered on stable canonical subject identity, explicit revision-qualified external mappings, first-class proofing/enrollment/authentication/federation evidence, vector/profile-qualified assurance, independent credential/session lifecycles, residual-cohort drainage, bounded offline closure, privacy-safe evidence, explicit `INCONCLUSIVE`/`UNKNOWN`, owner-preserving provider integration and strict authentication/authorization separation.

The current SB runtime identity/session slice is retained as a useful local realization foundation and generalized rather than replaced wholesale. Provider/account/token/device/biometric identities remain realization evidence; none can silently become canonical human identity or authority.

This decision does not execute C3.8, Planning D/E, Architecture Reconciliation, WBS, Work Packages, executive TASKs, Construction or product code.
