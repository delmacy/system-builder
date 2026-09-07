# Generation 2 — Planning C C3.11: Enterprise Trust / PKI / Certificate Lifecycle Target Architecture

Status: **DECIDED / PASS_FOR_CAPABILITY**  
Phase: `PLANNING_C_TARGET_ARCHITECTURE`  
Capability: `Enterprise Trust / PKI / Certificate Lifecycle`  
Decision scope: canonical target architecture only. No implementation, Planning D/E execution, WBS, Work Packages, executive TASKs, Construction or product code.

Entry branch head revalidated before persistence: `bfa68203a9d64a8692956cd70968b5f922f2594c`.

## 1. Authorities and inherited constraints

Authoritative inputs include `RESEARCH_PIPELINE_STATE.json`, Planning C entry framework, C0 Universal Capability Architecture semantic substrate, C1 Elicitation/System Understanding, C2 Physical/Peripheral boundary, C3.7 Identity/Authentication/Federation, C3.8 Authorization/Policy/Organization/Multitenancy, C3.10 Security/Resilience/Failure Recovery, Planning A/B Enterprise Trust/PKI artifacts, and the inherited adversarial inventory of **284 edge scenarios + 124 ConflictPatterns = 408 material findings** with zero HIGH/CRITICAL lacking owner/proof/detection route.

External standards are used as semantic challenge evidence, not implementation mandates. RFC 5280 demonstrates that certificate-path validity is qualified by a selected trust anchor, time and application/policy inputs. RFC 6960 separates `good`, `revoked` and `unknown`, and distinguishes `thisUpdate`, `nextUpdate`, `producedAt` and `revocationTime`. SPIFFE demonstrates an independently named trust-domain-to-bundle association, changing trust bundles, workload credential rotation and distribution to consumers. NIST key-management guidance reinforces lifecycle, cryptoperiod, compromise and revocation distinctions.

Constitutional invariants:

- `Research != remediation`;
- `ConflictPattern != ConflictInstance`;
- `Signal != ConfirmedConflict`;
- `cryptographic validity != current authorization`;
- `signature verification != semantic truth`;
- `certificate chain valid != applicable policy/currentness satisfied`;
- `revocation unknown != valid`;
- `credential/key possession != current trust`;
- `issued != distributed != consumer-effective != currently accepted`;
- `provider/CA healthy != local verifier trust current`;
- `restored trust store != current trust state`;
- `Fleet aggregate != local verifier truth`;
- `AI recommendation != trust/issuance/revocation authority`;
- Physical/Peripheral remains inside the C2 integration/governance plane; no generic direct physical actuation is inferred.

## 2. Decision summary

Planning C adopts a **provider-neutral, revision-qualified Canonical Enterprise Trust & PKI Plane** specialized over C0 identity, revision, evidence/currentness, authority, effect, provider-binding, federation/locality and residual-cohort primitives.

The capability owns portable semantics for:

1. trust domains and trust relationships;
2. trust anchors/bundles and their revisions/generations;
3. issuer/CA identities and issuer generations;
4. logical keys, certificates and other governed credentials without owning raw secret persistence;
5. issuance/enrollment, distribution/materialization and consumer-effective adoption;
6. certificate/key usage and policy constraints;
7. renewal, rotation, overlap, revocation, deprovision and retirement;
8. validation/path/status/currentness evidence and explicit `INCONCLUSIVE/UNKNOWN` states;
9. signer/verifier qualification and signed-evidence semantics;
10. provider/CA substitution, federation and residual trust cohorts;
11. bounded offline verification and reconnect requalification;
12. backup/restore trust-state crossing and post-recovery requalification;
13. tenant/Station/Fleet trust isolation;
14. queue/capacity/operability of issuance, rotation, revocation and reconciliation;
15. Brownfield/manual certificate operations as evidence-bearing procedures.

The capability does not own canonical human identity, business authorization, generic secret storage, generic runtime orchestration, governance/compliance assessment, provider admission/cutover mechanics, every security control, protocol standards, or physical control truth.

## 3. C3.11-DEC-001 — Canonical trust identity is distinct from provider-native identity

The target architecture requires distinct stable identities/revisions for at least:

- `TrustDomainRef` / revision;
- `TrustRelationshipRef` / revision;
- `TrustAnchorSetRef` / bundle revision;
- `IssuerRef` / issuer generation;
- `CertificateProfileRef` / revision;
- `LogicalKeyRef` / key generation;
- `CertificateCredentialRef` / credential generation;
- `CertificateRealizationRef`;
- `EnrollmentOccurrenceRef`;
- `IssuanceOccurrenceRef`;
- `DistributionOccurrenceRef`;
- `ConsumerTrustAdoptionRef` / effective generation;
- `RevocationOccurrenceRef` / status generation;
- `TrustValidationOccurrenceRef`;
- `TrustEvidenceRef`;
- `ResidualTrustCohortRef`;
- C0 `ProviderBindingRef`, `RevisionVector`, `EvidenceEnvelope`, `CurrentnessHorizon`, `AuthorityEnvelope` and effect-disposition references.

Provider certificate IDs, CA resource IDs, HSM slot IDs, file paths, Kubernetes Secret names, thumbprints, serial numbers, issuer DNs, hostnames and provider-native trust-store IDs remain realization identities/evidence unless an explicit mapping/adoption rule says otherwise.

Value equality does not collapse identity. A certificate serial number is meaningful only in its issuer namespace; a subject/SAN is a claim, not canonical identity by itself.

## 4. C3.11-DEC-002 — Trust state is a revision vector, not one mutable version

Material trust state is qualified across independently changing revisions such as:

`policy revision × trust-anchor/bundle revision × issuer generation × key/credential generation × revocation/status generation × provider-binding revision × consumer-effective generation × local evidence horizon`.

A single `version` cannot prove trust convergence. Consumers may legitimately coexist across generations during rotation or migration. The architecture therefore preserves overlap, supersession, effective intervals and residual cohorts.

`desired trust revision != materialized trust revision != consumer-effective trust revision != current validation evidence`.

## 5. C3.11-DEC-003 — Trust domains and relationships are explicit semantic objects

A `TrustDomain` identifies a governed namespace/administrative trust scope. A `TrustRelationship` states which domain/entity may be trusted for which purposes, populations and constraints.

A relationship carries or references, as applicable:

- subject/peer trust domains;
- permitted purposes/usages;
- relying populations;
- accepted anchor/bundle generations;
- policy/profile revision;
- name/identity constraints;
- currentness/status requirements;
- maximum offline evidence horizon;
- provider realization/support profile;
- authority and ownership;
- effective interval and supersession;
- reconciliation/retirement obligations.

Federation between trust domains is explicit. Importing a foreign bundle or root does not create unrestricted mutual trust.

## 6. C3.11-DEC-004 — Anchors/bundles are authoritative only for qualified scope and generation

A trust anchor/bundle is not a universal `trusted=true` object. It is authoritative only within a declared trust-domain relationship, purpose, policy/currentness context and effective interval.

Anchor admission, removal and bundle rotation are separately authorized transitions. Distribution of a new bundle does not prove that all relying consumers have adopted it.

Empty, missing, stale, unsupported or partially processed bundles yield explicit failure/degraded/inconclusive outcomes according to policy; they are never silently treated as continuing old trust indefinitely.

## 7. C3.11-DEC-005 — Issuer/CA generation is distinct from trust-domain identity

A trust domain may be realized by multiple issuer generations over time or by multiple qualified issuers/providers. `IssuerRef` represents logical issuer identity while `issuer generation` qualifies key/certificate lineage and validity.

Issuer rotation preserves lineage between old and new generations and declares overlap/cutover requirements. A new CA key does not create a new trust domain by default; conversely retaining a trust-domain name does not imply unchanged cryptographic generation.

Compromise or retirement of an issuer generation does not retroactively rewrite historical evidence; it changes current acceptance according to policy and effective time.

## 8. C3.11-DEC-006 — Key, certificate and credential identities remain separate

The architecture distinguishes:

- logical key identity and generation;
- key realization/provider/HSM reference;
- certificate/credential identity and generation;
- certificate realization/encoded material reference;
- subject/workload/principal/resource identity from C3.7/C2;
- usage/policy profile;
- issuance/enrollment occurrence;
- signer/verifier context.

A key may be reused or rotated according to profile; a certificate may be renewed with the same or a different key. Neither raw private-key material nor secret values become durable canonical payloads. Secrets/Configuration owns secure value/reference realization.

`key exists != certificate valid != certificate accepted != holder authorized`.

## 9. C3.11-DEC-007 — Enrollment/authorization/issuance/materialization/effectiveness are distinct facts

Portable lifecycle semantics are:

`request -> authorize -> enroll/prove possession where required -> issue -> distribute/materialize -> consumer observe -> validate/qualify -> effective use -> renew/rotate -> requalify -> drain residual cohorts -> revoke/retire -> retain evidence`.

Each stage has its own occurrence/evidence and may fail independently.

CA/provider acknowledgement of issuance proves neither delivery nor consumer adoption. A mounted certificate/key proves neither workload reload nor accepted trust. A successful handshake proves one qualified interaction, not Fleet-wide convergence.

## 10. C3.11-DEC-008 — Certificate profiles and usage constraints are portable semantics

A `CertificateProfile` declares the portable semantic constraints applicable to a credential class, including where relevant:

- intended usage/purpose;
- subject/identity mapping requirements;
- key type/algorithm constraints;
- validity/renewal policy;
- SAN/name constraints;
- key usage/extended key usage expectations;
- issuer/trust-domain constraints;
- assurance/proofing requirements;
- status/currentness requirements;
- offline-verification rules;
- exportability/hardware-backed requirements where semantically necessary;
- retention/audit requirements;
- provider capability requirements.

Provider-specific profile names/OIDs remain mapped realization details unless explicitly adopted. Protocol validity cannot override superior enterprise policy.

## 11. C3.11-DEC-009 — Validation is a qualified occurrence, never timeless truth

A `TrustValidationOccurrence` records at least:

- target credential/evidence identity;
- selected trust anchor/bundle generation;
- candidate path/issuer generation;
- validation time and clock source/quality where relevant;
- applicable policy/profile revision;
- name/purpose/usage context;
- status/revocation evidence and freshness;
- verifier identity/version/location;
- provider/binding revision where relevant;
- evidence provenance;
- disposition and reason.

Disposition preserves at least `VALID_FOR_CONTEXT`, `INVALID`, and `INCONCLUSIVE`.

`VALID_FOR_CONTEXT` means the evidenced path/status/policy checks succeeded for that context and time. It does not establish semantic truth of signed content or business authorization of the signer.

## 12. C3.11-DEC-010 — Revocation/currentness uses explicit epistemic states

Revocation status distinguishes confirmed states from inability to determine status. At minimum:

- `NOT_REVOKED_AS_OF_EVIDENCE`;
- `REVOKED`;
- `UNKNOWN/INCONCLUSIVE`;
- `STALE/EXPIRED_EVIDENCE` where useful.

The architecture preserves status-evidence observation time, producer time, applicable horizon, next-update expectation and revocation effective time when known.

`good response != certificate was issued/currently valid for every purpose`; `unknown != valid`; absence of a revocation record is not automatically a universal positive claim.

Policy decides fail-closed, bounded degrade or alternate-source behavior for `UNKNOWN/STALE`; the PKI capability preserves the state rather than coercing it.

## 13. C3.11-DEC-011 — Signer/verifier and signed evidence remain semantically qualified

Signature verification establishes a cryptographic relationship between signed bytes, credential/key and verification context. It does not establish truth, freshness, completeness, authorization or current organizational acceptance of the claim.

Signed evidence therefore references:

- payload/claim identity and canonicalization where applicable;
- signer/credential identity;
- verifier and validation occurrence;
- signing/observation/verification time;
- trust relationship/policy revision;
- provenance/currentness;
- payload semantic owner;
- any transparency/attestation evidence as separate claims.

`signature verified != claim true`; `attestation authentic != attested state currently authoritative`.

Artifact/Release/SBOM/Provenance may consume PKI validation but owns release/provenance semantics. PKI does not promote signed artifacts into release authority.

## 14. C3.11-DEC-012 — Identity and Authorization boundaries are non-amplifying

Certificates/SVIDs/device credentials may contribute identity/authentication evidence to C3.7. They do not become canonical Person/workload/device identity merely because a certificate is valid.

Authorization consumes qualified principal/authentication/trust facts and independently decides resource/action authority. Certificate subject/SAN, issuer, EKU, external role claim or possession of a private key is never by itself a business permission.

Issuance authority, revocation authority, anchor admission, trust-policy change, provider administration and business authorization are independently expressible authorities.

## 15. C3.11-DEC-013 — Offline verification is bounded by declared local closure

A local verifier may continue using retained trust material during Fleet/provider disconnection only inside an explicit `QualifiedLocalClosure` defining:

- retained anchors/bundles and generations;
- eligible credential/profile classes;
- maximum status/currentness horizon;
- clock assumptions/tolerance;
- accepted local revocation/status sources;
- prohibited high-risk contexts;
- local audit/evidence retention;
- reconnect requalification and reconciliation;
- failure/degrade behavior after horizon expiry.

Disconnection does not extend certificate validity, policy authority, revocation freshness or delegation. If currentness cannot be established beyond the permitted horizon, the result is `INCONCLUSIVE` or fail-closed according to policy.

## 16. C3.11-DEC-014 — Rotation is overlap + adoption + drainage, not replacement-only

Rotation may involve anchors, issuer keys, leaf/workload keys, certificates, bundles, verifier configuration or provider realizations. A safe rotation declares:

- old/new generations;
- overlap window;
- issuing and accepting populations;
- consumer adoption evidence;
- rollout order;
- rollback/abort conditions while still safe;
- offline/residual cohorts;
- expiry/revocation sequence;
- closure condition.

`new material issued != consumers adopted`; `new anchor distributed != old anchor drained`.

Retirement is complete only when authoritative residual consumers are drained, expired, revoked, fenced or explicitly dispositioned under bounded policy.

## 17. C3.11-DEC-015 — Revocation/deprovision convergence is population-aware

Revocation/deprovision has multiple effects: canonical policy state, CA/status publication, provider state, verifier caches, active sessions/connections, offline consumers and downstream copies.

A revoke request may be `APPLIED`, `NOT_APPLIED`, `PARTIAL` or `UNKNOWN` at an external provider. `UNKNOWN` remote mutation follows reconcile-before-retry unless idempotency/deduplication is qualified.

Revocation closure requires evidence about affected relying populations and maximum residual exposure, not merely successful API/CLI completion.

## 18. C3.11-DEC-016 — Provider/CA substitution is semantic qualification plus coexistence

Provider/Binding owns provider discovery/admission/binding/cutover mechanics. PKI supplies the trust-specific support vector that a realization must satisfy, including:

- trust-domain/issuer identity mapping;
- hierarchy/profile support;
- key-generation/HSM/export constraints;
- enrollment/issuance semantics;
- status/revocation/currentness behavior;
- bundle/anchor distribution;
- overlap/rotation semantics;
- workload/runtime integration;
- audit/provenance export;
- offline/disconnected behavior;
- rate limits/quotas/capacity;
- tenant/site isolation;
- residual cleanup and known unsupported dimensions.

`same protocol/API feature != semantic equivalence`.

Substitution is a fresh qualification event and may require dual-provider overlap. Old provider resources/credentials/status responders/caches form residual cohorts until dispositioned.

## 19. C3.11-DEC-017 — Backup/restore crosses trust epochs and requires requalification

Backup/restore of databases, configuration or trust stores can resurrect historical anchors, certificates, allowlists, revocation caches or provider references. Recovery therefore records a trust-state recovery cut and compares restored revisions against current trust epochs.

`restored trust material != currently qualified trust material`.

After restore, applicable identities, anchor/bundle generations, issuer generations, policy revisions, revocation/status evidence, provider bindings and local verifier caches must be requalified before trust-dependent operation is declared recovered.

Historical signatures may still be verifiable under historical evidence without restoring historical authority for new actions.

## 20. C3.11-DEC-018 — Tenant/Station/Fleet trust isolation is explicit

Trust material and authority are scoped by tenant/organization/Station/site/domain as appropriate. Shared provider infrastructure never implies shared trust authority.

`Enterprise -> Station -> Role -> Person` delegation remains monotonic and non-amplifying. Lower scopes may use only trust capabilities/material explicitly delegated by superior policy and cannot:

- admit unapproved anchors;
- weaken currentness/status requirements;
- extend offline horizons;
- gain issuer/revocation/provider-admin authority implicitly;
- broaden name/purpose constraints;
- reinterpret `UNKNOWN` as trusted.

Fleet may aggregate trust observations and coordinate authorized change intent, but Fleet visibility is not local verifier truth and does not itself grant issuance/revocation/anchor authority.

## 21. C3.11-DEC-019 — Physical/Peripheral identity stays inside C2 integration/governance boundary

PKI may model trust references for edge gateways, device management planes, provider endpoints or device credentials when those are exposed by specialized systems. Such evidence is qualified by device/system/provider/site context.

A valid device certificate does not prove current physical state, safety state, operator intent or actuation authorization. PKI status cannot be used to infer generic direct physical actuation authority.

Specialized provider operations remain governed by C2's explicit external-operation boundary.

## 22. C3.11-DEC-020 — Capacity and queue semantics are part of trust correctness

Issuance, renewal, rotation, revocation, status publication, bundle distribution and reconciliation form queue networks with finite service rates and provider quotas.

The capability exposes or derives qualified operational facts such as:

- expected steady issuance/renewal/revocation rates;
- peak/burst assumptions, including mass rotation/incident revoke storms;
- queue depth **and age**;
- effective service rate and retry amplification;
- provider/HSM/CA/status-responder quotas;
- certificate-expiry horizon distribution;
- renewal lead time;
- oldest unresolved revoke/rotation item;
- residual cohort size/age;
- verifier/bundle propagation lag;
- capacity headroom and stability margin;
- local/offline backlog and reconnect burst;
- external-provider cost/usage pressure where material.

Low average utilization cannot prove adequate renewal/revocation capacity. A mathematically stable average system may still violate deadlines if burst or class starvation assumptions are wrong.

No scalar trust-health score may hide a stale revocation population, expiring cohort or partially adopted anchor generation.

## 23. C3.11-DEC-021 — Trust evidence/currentness is vector-qualified

Trust observability uses typed evidence, units and context. Metrics without population, unit, clock and currentness are insufficient for authoritative decisions.

Useful evidence dimensions include certificate population by remaining lifetime, renewal success/age, issuance/revocation latency, status evidence freshness, bundle/anchor revision adoption, path-validation failure reasons, provider dependency health, queue/backlog age, offline cohort age and residual generation counts.

Currentness is evaluated against the semantic claim. A recent CA-health check does not make a stale verifier bundle current; a fresh verifier observation does not prove Fleet completeness.

## 24. C3.11-DEC-022 — Brownfield/manual certificate operations are first-class discovery evidence

Existing certificate operations may live in spreadsheets, shell scripts, vendor consoles, manually copied files, cron jobs, local keystores, tickets, e-mail approvals, verbal procedures or key-person knowledge.

These are recorded as revisioned evidence/procedures with owner, scope, preconditions, provider/tool context, authority source, currentness and known unsupported/ambiguous semantics. Observed manual behavior is not automatically canonical policy.

Legacy Mirroring preserves what actually occurs, including shadow issuers, unmanaged certificates, manual exceptions, undocumented renewal paths and residual trust stores, without silently endorsing them.

## 25. C3.11-DEC-023 — Operability Elicitation Lens is mandatory

For each trust domain, relationship, certificate profile, issuer/provider, relying population and integration, elicitation asks at minimum:

- Como saberemos que está funcionando?
- Como saberemos que está degradado?
- Quem é responsável e quem está on-call/escalation owner?
- Que evidência precisamos e por quanto tempo?
- Qual estado pode permanecer `UNKNOWN/INCONCLUSIVE`, por quanto tempo e para quais usages?
- Qual perda, atraso ou stale window é aceitável?
- Como recuperar?
- Como reconciliar?
- Como validar depois de mudança/deploy/rotation/provider cutover?
- Quais SLO/SLA e currentness horizons se aplicam?
- Qual throughput esperado, peak/burst e renewal/revocation storm assumption?
- Quais filas/backlogs existem e qual idade máxima aceitável?
- Quais timeout/retry/idempotency semantics existem para CA/provider effects?
- Quais failure modes existem para CA, HSM, status responder, bundle distribution, clocks, local verifiers and external providers?
- Quais maintenance windows e overlap periods são necessários?
- Quais quotas/rate limits/cost pressures podem impedir convergência?
- Como funciona offline/degraded verification e reconnect?
- Como são detectados residual consumers, stale trust stores and abandoned in-flight operations?
- Quais privacy/minimization/redaction requirements se aplicam à trust telemetry?
- Quem autoriza issuance, revocation, anchor admission, provider administration, emergency trust changes and exceptions?

Elicitation does not close a capability merely because certificate issuance works. It must cover operational ownership, failure/recovery/currentness/reconciliation and evidence sufficient for the intended production scope.

## 26. C3.11-DEC-024 — Production Readiness Coverage is separate from feature completeness

Trust/PKI uses the cross-cutting readiness dimensions:

`OBSERVABILITY`, `OWNERSHIP`, `FAILURE_HANDLING`, `RECOVERY`, `CAPACITY`, `CURRENTNESS`, `SECURITY`, `RECONCILIATION`, `CHANGE_SAFETY`, `COST`, `DOCUMENTATION`.

Each is `UNTOUCHED | PARTIAL | RESOLVED | CONFLICTED | BLOCKED | NA` with rationale/evidence. No scalar score may convert a blocked critical dimension into overall green.

Examples of false readiness that remain invalid:

- certificate feature fully specified but no operational owner;
- CA integration without timeout/reconciliation;
- dashboard without freshness/currentness;
- retry without provider-qualified idempotency;
- expiry/revocation alert without action owner/runbook;
- metric without unit/population/context;
- failure mode without recovery;
- rotation rollout without rollback/abort and residual-cohort plan;
- capacity claim without peak/mass-rotation assumptions;
- audit/compliance requirement without evidence retention.

## 27. C3.11-DEC-025 — Security/privacy/governance boundaries preserve ownership

Security/Resilience consumes trust state for posture, degradation, incident and recovery qualification; it does not own trust lifecycle truth.

Governance/Compliance/Audit owns obligations, control applicability, assessment, exceptions and audit interpretation. PKI supplies trust evidence and lifecycle state but cannot declare compliance.

Privacy/Data Governance owns retention, deletion/legal-hold, residency and minimization obligations. PKI declares the evidence/currentness needed for trust operation and relies on privacy-safe telemetry/redaction where possible.

Secrets/Configuration owns secure key/secret material realization and environment configuration. Possession or restoration of secret material does not prove current trust.

## 28. C3.11-DEC-026 — AI/low-code and causality remain non-strengthening

AI may propose certificate inventories, probable mappings, expiry risks, rotation plans, likely contradictions, provider support gaps, anomaly hypotheses and evidence requests. Low-code may materialize explicitly authorized trust workflows.

Neither may:

- admit anchors or trust domains;
- issue/revoke credentials without explicit authority;
- promote provider observations to canonical trust truth;
- convert `UNKNOWN/INCONCLUSIVE/PARTIAL` into trusted;
- infer business authorization from certificate properties;
- infer causal compromise from correlation alone;
- strengthen signed/attested evidence beyond its stated claim;
- create generic physical actuation authority.

Causal analysis remains research/decision support unless a separate governed proof route establishes the stronger claim.

## 29. Cross-capability graph and algebra constraints

Trust dependencies form a revision-qualified graph, not an untyped ownership graph. Edge classes include `ISSUED_BY`, `TRUSTS_FOR`, `VALIDATED_BY`, `MATERIALIZED_AT`, `ADOPTED_BY`, `REVOKED_BY`, `STATUS_FROM`, `FEDERATED_WITH`, `REALIZED_BY_PROVIDER`, `RESIDUAL_ON`, and evidence/provenance links.

Reachability does not imply transitive semantic authority. If A trusts B for workload identity and B trusts C for another purpose, the graph cannot infer A trusts C for workload identity without an explicit compatible relationship.

Graph composition must preserve edge type, scope, revision, effective interval, tenant/site/locality and currentness. AI graph completion remains candidate inference only.

## 30. Planning D migration constraints

Planning D must preserve incremental coexistence with today's bounded PostgreSQL TLS verification and Brownfield trust mechanisms. It must not assume flag-day replacement.

Migration sequencing must account for:

- introduction of canonical trust-domain/anchor/issuer/credential identities beside current config/path references;
- provenance/currentness backfill limits;
- existing provider/CA and local trust stores;
- overlap between old/new anchors/issuers/providers;
- consumer-effective adoption and residual cohorts;
- certificate/key reenrollment or non-portability;
- offline/local verifier horizons;
- restore/recovery interactions;
- trust authority/delegation changes;
- unsupported provider semantics and manual exceptions;
- preservation of PostgreSQL `verify-ca`/`verify-full` behavior and autonomous Runtime parity until deliberately superseded by a proven migration path.

No migration shortcut may mark old trust drained without evidence or expand authority to simplify cutover.

## 31. Planning E proof obligations

Planning E must include at least these proof families:

1. canonical trust identity vs provider-native identity;
2. revision-vector and trust-epoch qualification;
3. trust-domain/relationship scope and non-transitive-authority proof;
4. anchor/bundle generation and consumer-adoption proof;
5. issuer-generation/key/certificate identity separation;
6. issuance vs materialization vs consumer-effective separation;
7. profile/usage/policy constraint enforcement;
8. validation occurrence context/time/currentness proof;
9. revocation `UNKNOWN/STALE` non-coercion proof;
10. signature/attestation non-strengthening proof;
11. Identity vs Authorization boundary proof;
12. bounded offline-verification horizon and reconnect requalification;
13. rotation overlap + residual-cohort drainage;
14. revoke/deprovision ambiguous-effect reconciliation;
15. provider/CA substitution support-vector and coexistence;
16. backup/restore trust-epoch crossing and requalification;
17. tenant/Station/Fleet isolation and delegation non-amplification;
18. Physical/Peripheral non-actuation boundary;
19. queue/capacity proof for expiry/rotation/revocation storms;
20. evidence currentness/units/population proof;
21. Brownfield/manual trust-operation provenance/adoption proof;
22. Elicitation no-false-complete proof;
23. multidimensional Production Readiness Coverage proof;
24. Security/Governance/Privacy/Secrets owner-boundary proof;
25. AI/low-code/causality non-strengthening proof;
26. migration preservation of proven PostgreSQL positive-verification behavior and autonomous-runtime parity.

## 32. Findings disposition

This Planning C decision creates **no remediation**, no `ConflictInstance`, no new `ConflictPattern` and no new material edge finding. The inherited **408 findings** remain active as architecture constraints and Planning E proof routes. Any future repository-specific observation remains a `Signal` until confirmed through its proper route.

## 33. Capability gate

**C3.11 = DECIDED / PASS_FOR_CAPABILITY / TARGET_ARCHITECTURE_DECIDED.**

Planning C remains **ACTIVE / OPEN**. This advances C3 coverage to **11/28**. C3.12 and later capabilities remain untouched in this action; Planning D/E, Architecture Reconciliation, WBS, Work Packages, executive TASKs, Construction and product code remain blocked.
