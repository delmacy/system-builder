# Generation 2 — Planning C — C3.19 Artifact / Release / SBOM / Provenance Target Architecture

Status: **DECIDED / PASS_FOR_CAPABILITY / TARGET_ARCHITECTURE_DECIDED**
Phase: `PLANNING_C_TARGET_ARCHITECTURE`
Capability: **Artifact / Release / SBOM / Provenance**
Decision: `C3.19`
Scope: target-architecture planning only. No product implementation, Work Package, executive TASK, Construction or remediation is authorized by this record.

## 1. Decision authority and inherited constraints

This decision is governed by `RESEARCH_PIPELINE_STATE.json`, the Planning C entry framework, C0 Universal Capability Architecture / Semantic Substrate, C1 Elicitation & System Understanding, C2 Physical / Peripheral Integration Boundary, Planning A/B for this capability, C3.18 Build / Dependency Graph / Reproducibility, the earlier target decisions for Trust/PKI, Security/Recovery, Provider/Binding, Lifecycle, Governance, Privacy, Deployment/Runtime, Observability and the closed adversarial inventory of **284 material edge scenarios + 124 ConflictPatterns = 408 material findings**.

Constitutional distinctions remain mandatory:

- `build output != canonical artifact != logical release != deployed/effective runtime`;
- `artifact digest equality != release identity != release authority`;
- `tag/channel/provider version != immutable artifact/release identity`;
- `SBOM present != complete/current component closure`;
- `provenance present != trusted/current/admitted artifact`;
- `signature cryptographically valid != signer currently trusted != release authorized`;
- `provider upload success != distribution convergence`;
- `replicated copy != source-of-truth transfer`;
- `rollback existed historically != rollback currently eligible`;
- `release published != consumer admitted != deployed != runtime effective`;
- `Fleet aggregate != local artifact availability/currentness`;
- `AI-generated release notes/proposals != release authority`;
- `Research != remediation`, `ConflictPattern != ConflictInstance`, `Signal != ConfirmedConflict`.

## 2. Current-state anchor and disposition

Generation 1 already has a strong bounded foundation: SHA-256 content-addressed artifact payload identity, exact payload/manifest verification, immutable/idempotent same-content publication, canonical logical release identity `releaseId@version`, explicit publication, `published -> deprecated -> archived` lifecycle, durable storage, typed evidence provenance and downstream artifact-hash continuity.

C3.19 therefore adopts **KEEP + HARDEN + GENERALIZE + INTEGRATE** as the primary disposition. It does not replace working release/artifact foundations and does not invent a proprietary registry. The compiler/build output naming compression is not treated as canonical architecture; C3.18 remains owner of `BuildOutputSet`, while C3.19 owns explicit adoption into canonical artifact/release identity.

## 3. Target decision

**DECISION C3.19-D1 — establish a provider-neutral, revision-qualified Artifact & Release Evidence Plane that owns immutable canonical artifact identity, logical release composition, adoption/promotion/distribution lifecycle, SBOM and provenance statement identity/coverage, signature/attestation qualification, release admission/withdrawal and current rollback eligibility, while registries, signing services, SBOM/provenance encodings and distribution providers remain qualified realizations.**

The capability owns eight linked truth planes:

1. **Artifact Adoption Plane** — explicit transition from validated build outputs into immutable canonical artifact revisions.
2. **Release Composition Plane** — logical release identity/revision and its immutable artifact population by target/profile.
3. **Evidence Plane** — SBOM, provenance, signatures, attestations and verification/coverage statements.
4. **Qualification & Admission Plane** — release-specific current policy/trust/security/compatibility qualification.
5. **Promotion Plane** — governed channel/stage eligibility and promotion history.
6. **Distribution Plane** — provider publication, replicas, mirrors, local/offline copies and convergence evidence.
7. **Withdrawal & Rollback Plane** — deprecation, withdrawal, revocation, supersession and current rollback eligibility.
8. **Operability Plane** — queue/backlog/capacity/currentness/ownership/reconciliation evidence for release operations.

## 4. Canonical identities and revision vectors

The target introduces or qualifies identities such as:

- `CanonicalArtifactId` and immutable `ArtifactRevisionId`;
- `ArtifactContentDigestSet`;
- `ArtifactAdoptionId`;
- `ReleaseId` and `ReleaseRevisionId`;
- `ReleaseCompositionId`;
- `ReleaseChannelId` and `PromotionId`;
- `SbomStatementId` and statement revision;
- `ProvenanceStatementId` and statement revision;
- `AttestationId`, `SignatureEvidenceId`, `VerificationEvidenceId`;
- `ReleaseQualificationId` / `AdmissionDecisionId`;
- `DistributionPublicationId` and provider realization identity;
- `ReplicaId` / `MirrorCohortId` / `ResidualDistributionCohortId`;
- `ReleaseWithdrawalId`, `SupersessionId`, `RollbackEligibilityAssessmentId`.

An artifact/release qualification revision vector may include artifact digest/content revision, release-composition revision, SBOM/profile revision, provenance predicate/profile revision, signature/attestation set, verifier policy revision, trust bundle/currentness revision, governance/security policy revision, provider binding/support revision, distribution cohort revision, target compatibility/schema/configuration revisions and evidence horizon.

Mutable labels remain bindings/pointers. A tag such as `latest`, `stable`, `candidate`, environment name or provider-generated version does not become canonical identity merely because consumers use it.

## 5. Build output adoption

**DECISION C3.19-D2 — a validated `BuildOutputSet` becomes a canonical artifact only through an explicit adoption transition whose subject population, integrity evidence, release authority and intended artifact profile are pinned.**

The lineage is:

`BuildOutputSet -> adoption proposal -> authority/policy evaluation -> artifact identity minted/adopted -> integrity/evidence attached -> release composition updated -> qualification -> promotion/publication`.

Adoption is not inferred from file existence, compiler success, object-store upload or registry push. Re-adopting identical bytes may yield the same content identity while still representing a different adoption occurrence, evidence horizon or logical release membership.

Correction never mutates bytes under an existing immutable revision. It creates a new artifact/release revision plus explicit supersession/withdrawal lineage where applicable.

## 6. Release composition and channels

**DECISION C3.19-D3 — a logical release is a revisioned semantic composition of immutable artifacts and release evidence; channels/stages are governed eligibility relations, not identities or mutable-byte containers.**

A release may contain multiple artifacts by platform/architecture/profile, associated migration/schema/configuration requirements, documentation/evidence references and compatibility predicates. A release revision is immutable once adopted as authoritative history.

Promotion into `candidate`, `stable`, `production` or other channels is a governed transition over a release revision. Channel pointers can move; history must preserve which release revision was eligible/effective at each interval.

`channel == release` and `tag == artifact` are forbidden compressions.

## 7. SBOM semantics

**DECISION C3.19-D4 — SBOM is a typed, subject-bound evidence statement with explicit lifecycle stage, component/material population, relationship graph, generator/profile identity, coverage/completeness claim, currentness and applicability; presence alone is never completeness proof.**

Portable SBOM semantics include:

- immutable statement identity and revision;
- exact subject(s): artifact, release, component population or other explicitly qualified scope;
- lifecycle/source mode such as design/source/build/analyzed/deployed/runtime where relevant;
- component/material identities and relationships;
- generator/tool/profile/version;
- population and coverage declaration;
- known exclusions/unsupported scopes;
- derivation/enrichment lineage;
- creation/observation/currentness timestamps;
- integrity and optional signature/attestation evidence;
- privacy/redaction/minimization policy;
- reconciliation status against build/material truth and observed distribution/runtime evidence when applicable.

SPDX 3.0.1 and CycloneDX 1.7 are useful interoperability realizations because they model rich element/component relationships and multiple SBOM lifecycle perspectives. They do not define SB's canonical semantic owner. Future format revisions remain adapters/projections over the portable internal semantics.

`SBOM syntactically valid != SBOM population complete != SBOM currently applicable`.

## 8. Provenance and attestations

**DECISION C3.19-D5 — provenance is a typed claim about artifact production and lineage, with explicit subject, predicate/profile, builder/attestor identity, build/material references, statement production evidence and verification horizon; it is not release authorization by itself.**

The architecture can map to the in-toto Attestation Framework and SLSA Provenance, which distinguish attestation subject from predicate and separate build definition from run details/builder evidence. C3.19 consumes C3.18 build/material truth rather than redefining it.

A provenance record must preserve at least:

- statement/attestation identity;
- subject digest/identity population;
- predicate type/profile revision;
- referenced build definition/attempt/output evidence;
- referenced material/dependency evidence;
- builder/attestor identity and qualification;
- statement creation/capture time;
- cryptographic/integrity evidence where present;
- verification result, verifier identity/policy/trust revisions;
- applicability/currentness horizon;
- contradictions, missing fields or unsupported predicate scope.

`provenance present != trusted provenance != complete build influence closure != release admitted`.

## 9. Signatures, trust and release authorization

**DECISION C3.19-D6 — cryptographic verification, semantic attestation qualification and release authorization are three separate decisions.**

Required sequence:

`signature/attestation observed -> subject binding verified -> cryptographic validity checked -> signer/attestor trust/currentness qualified -> statement/predicate policy evaluated -> release policy/admission authority evaluated`.

Enterprise Trust/PKI owns trust anchors, certificate/path/revocation/currentness. Governance owns approvals/obligations/exceptions. Security/Resilience owns compromise/security posture. Artifact/Release composes their qualified evidence into release-specific admission/promotion/withdrawal decisions.

A historically valid signature remains historical evidence even if the signer or trust root is later compromised/revoked. Current admission can change without rewriting history.

## 10. Distribution, registries and provider realization

**DECISION C3.19-D7 — registry coordinates, tags, object keys and provider publication IDs are realization bindings; canonical artifact identity is content/revision bound and distribution convergence is independently observed.**

OCI-style content digests and subject/referrer relationships are useful realizations. OCI Distribution's distinction between digest-addressed content and tags, and its referrers mechanism for signatures/SBOMs/attestations, validates the portability requirement that provider pointers and associated metadata remain distinct from canonical release semantics.

Each distribution realization records:

- provider/binding/support-vector revision;
- canonical artifact/release subject;
- provider repository/object/package coordinates;
- immutable digest/version where supported;
- publication attempt and effect disposition;
- replica/mirror topology;
- current availability/integrity evidence;
- referrer/metadata completeness where applicable;
- retention/deletion/withdrawal semantics;
- quota/rate-limit/backlog/currentness;
- residency/locality constraints;
- residual copies/cohorts after cutover/withdrawal.

A provider success response proves only the provider operation result under that API contract. It does not prove every mirror, CDN, Station or disconnected consumer converged.

## 11. Ambiguous remote effects and reconciliation

Mutating provider operations use:

- `NOT_APPLIED`;
- `APPLIED`;
- `PARTIAL`;
- `UNKNOWN`.

Publication, tag/channel mutation, signature attachment, mirror replication, withdrawal and deletion can become `UNKNOWN` on timeout/connection loss. Where replay could create contradictory aliases, duplicate evidence, inconsistent promotion or unwanted deletion, **`UNKNOWN -> reconcile-before-retry`** unless operation-specific idempotency is independently proven.

Reconciliation compares canonical desired publication/evidence state with provider-observed state under qualified currentness. It never upgrades stale absence into proof of non-application.

## 12. Provider/registry substitution and residual cohorts

Provider substitution follows:

`discover -> qualify -> bind -> replicate/shadow -> verify -> coexist -> cut over -> fence old authority -> observe -> drain/disposition residual copies`.

Support qualification includes immutability guarantees, digest semantics, tag mutability, referrer/attestation support, pagination/completeness, retention/deletion, replication/currentness, quotas, audit evidence, residency, offline mirror support, permissions and ambiguous-effect behavior.

Equivalent API shape is insufficient. OCI compatibility, package-format compatibility or matching tag semantics do not prove equivalent retention, deletion, trust, referrer, replication or reconciliation semantics.

Cutover is incomplete while obsolete providers, mirrors, caches or removable media can still distribute a release as authoritative contrary to current policy.

## 13. Withdrawal, supersession and compromise

Withdrawal/revocation is a current-state authority transition over future admission/distribution, not destruction of historical evidence. It may coexist with already distributed or running cohorts.

Supply-chain compromise can affect:

- source/material/build evidence;
- artifact bytes/digest collision assumptions;
- builder/provider qualification;
- signer/attestor trust;
- SBOM/provenance completeness;
- registry integrity/access control;
- release policy/admission.

The system preserves historical facts and appends current compromise/withdrawal/admission disposition. It never rewrites a historical release from "was published" to "never existed" merely because it is now unsafe.

## 14. Rollback eligibility

**DECISION C3.19-D8 — rollback eligibility is a current `QualifiedClaim`, not a permanent attribute on a release.**

Eligibility can depend on:

- immutable artifact availability and integrity;
- current trust/admission status;
- schema/data migration compatibility;
- configuration/secret compatibility;
- runtime/platform/provider support;
- required companion artifacts;
- retention/residency constraints;
- known vulnerabilities/compromise disposition;
- distribution/local availability;
- operational recovery policy.

A release that was deployable last month may now be `DENIED`, `UNSUPPORTED` or `INCONCLUSIVE` as a rollback target.

## 15. Artifact retention, replication, residency and privacy

Artifact/Release owns release-domain retention/replica/distribution requirements while consuming Privacy/Data Governance and Storage semantics.

Release evidence can contain sensitive source paths, repository identifiers, usernames, tenant names, build parameters, dependency metadata or infrastructure details. Observability and attestations must apply minimization/redaction without destroying the evidence needed for incident response, legal/audit obligations or subject binding.

Retention/archival policies distinguish canonical metadata/evidence from provider copies. Deleting one registry object does not prove all replicas/caches/backups/offline media are gone. Residency obligations apply to actual copies/evidence locations, not only canonical metadata location.

## 16. Local/offline/self-hosted artifact closure

A disconnected Station/site may operate from a `QualifiedLocalArtifactClosure` containing:

- required immutable artifact revisions;
- required SBOM/provenance/signature/verification evidence;
- local trust/currentness material;
- local admission policy snapshot and validity horizon;
- required platform/profile variants;
- rollback candidates and compatibility evidence;
- mirror/index metadata and completeness proof;
- local storage capacity/retention state;
- reconnect reconciliation procedures.

`artifact cached locally != currently admissible artifact closure`.

If global trust/security/provider currentness cannot be established past its allowed horizon, the state becomes `STALE`, `PARTIAL`, `BLOCKED` or `INCONCLUSIVE` rather than silently extending authority. Fleet can report aggregated closure but cannot prove a specific Station's local copy or trust state.

## 17. Queueing, flow and capacity mathematics

Release operations form finite-capacity queue networks: adoption, SBOM generation/enrichment, provenance generation/verification, signing, vulnerability/policy qualification, publication, replication, mirror synchronization, withdrawal, reconciliation and offline resynchronization.

Operational evidence must preserve units/populations/windows and can include:

- arrival rate `λ` by operation class;
- service rate `μ` by provider/worker class;
- utilization `ρ` only under declared queue assumptions;
- queue depth and age;
- oldest unresolved publication/reconciliation age;
- signing/verification latency distribution;
- replication lag and residual cohort count/age;
- quota/rate-limit pressure;
- retry amplification;
- publication/withdrawal `UNKNOWN` backlog;
- storage/retention headroom;
- reconnect/offline synchronization bursts.

`low mean utilization != sustainable peak capacity != bounded queue age != release readiness`.

No scalar fleet-health score may hide a critical registry/site cohort with stale artifacts, unprocessed revocations or exhausted signing quota.

## 18. Operability Elicitation Lens

For every artifact class, release workflow, SBOM/provenance generator, signer/verifier and distribution provider, elicitation MUST ask:

- **Como saberemos que está funcionando?** Which authoritative success evidence proves adoption, qualification, publication and local availability?
- **Como saberemos que está degradado?** Which queue age, replication lag, stale evidence, partial referrer population, quota pressure or residual cohort indicates degradation?
- **Quem é responsável?** Owner, on-call, escalation and provider/account ownership for generation, signing, promotion, reconciliation, withdrawal and recovery.
- **Que evidência precisamos?** Artifact digest, subject binding, SBOM coverage, provenance, trust verification, approvals, provider observations and incident/audit retention.
- **Qual estado pode permanecer UNKNOWN?** Which remote effects can remain unresolved and for how long before blocking promotion/admission?
- **Qual perda/atraso é aceitável?** Publication lag, mirror lag, SBOM generation delay, evidence loss tolerance and offline horizon.
- **Como recuperar?** Restore canonical metadata, reconstruct provider bindings, republish immutable bytes, re-sign/re-attest when authorized, and re-establish admission without rewriting history.
- **Como reconciliar?** Compare canonical release/evidence/distribution intent with provider/mirror/local observed state and resolve residual copies safely.
- **Como validar depois de mudança/deploy?** Re-check digest identity, evidence subject/coverage, trust/currentness, channel binding, replica convergence and consumer admission.

Additional mandatory questions cover SLO/SLA, expected throughput, peak/burst, latency, queue/backlog, retry/idempotency, timeout/UNKNOWN, dependency health, maintenance windows, provider quotas, degraded/offline operation, rollback, capacity headroom, usage/cost, audit and incident response.

## 19. Production Readiness Coverage

Feature completeness remains separate from operational readiness. Each release-domain target carries multidimensional coverage:

`OBSERVABILITY | OWNERSHIP | FAILURE_HANDLING | RECOVERY | CAPACITY | CURRENTNESS | SECURITY | RECONCILIATION | CHANGE_SAFETY | COST | DOCUMENTATION`

with states:

`UNTOUCHED | PARTIAL | RESOLVED | CONFLICTED | BLOCKED | NA`.

No scalar average can convert a critical `BLOCKED` or `CONFLICTED` dimension into readiness. Examples that must remain visible include: release fully specified but no operational owner; registry integration without timeout/reconciliation; SBOM dashboard without freshness; retry without idempotency; alert without action owner; metric without unit/context; withdrawal without recovery/drainage; promotion without rollback; capacity without peak assumptions; audit evidence without retention.

## 20. Brownfield / Legacy Mirroring

Brownfield evidence may include manually copied binaries, shared-folder releases, removable media, shell scripts, human checklists, spreadsheet version logs, ticket approvals, mutable registry tags, package-server conventions, vendor consoles and tribal knowledge.

These are captured as revisioned evidence/procedures/candidate mappings. They do not become canonical release policy automatically.

Explicit adoption is required to map:

`observed binary/provider tag/manual procedure -> candidate canonical artifact/release/evidence relation -> contradiction/coverage review -> governed adoption`.

Unknown provenance, missing SBOM, reused version labels, mutable files, undocumented signing keys and residual distribution channels remain visible as `PARTIAL`, `CONFLICTED`, `BLOCKED` or `INCONCLUSIVE`; AI may assist mapping but cannot manufacture lineage or authority.

## 21. Physical / Peripheral Integration boundary

Firmware, edge-agent packages, gateway software, device profiles and specialized-system artifacts may use this release plane for immutable identity, provenance, signing, distribution and update eligibility.

However, C2 remains authoritative: `firmware/release admitted != physical actuation authorized != device state changed`. Artifact distribution to a peripheral/gateway stays inside bounded integration/governance semantics and never infers a generic direct physical actuation capability.

## 22. Observe / control / change authority

The architecture classifies actions explicitly:

- **observe** — read artifact/evidence/distribution/currentness state;
- **control** — pause/fence distribution, quarantine release eligibility, require reconciliation, apply approved channel controls;
- **change** — adopt artifact, publish/promote/withdraw release, modify channel binding, approve rollback eligibility, bind/unbind providers.

UI/AGWS, Fleet and AI may expose/aggregate/propose within delegated authority but cannot cross from observe into control/change by inference. Alert generation is not promotion/withdrawal authority.

## 23. Interoperability references and portable extraction

C3.19 intentionally extracts semantics rather than canonizing standards:

- **SLSA Provenance v1.2**: useful for subject-bound provenance, build definition, run details and builder identity;
- **in-toto Attestation Framework v1.0**: useful for `Statement(subject, predicateType, predicate)` separation;
- **SPDX 3.0.1**: useful for typed elements/relationships and SBOM lifecycle perspectives;
- **CycloneDX 1.7**: useful for component/service/dependency relationships, BOM lifecycle and enrichment/provenance concepts;
- **OCI Image/Distribution 1.1+**: useful for digest-addressed manifests, mutable tags as pointers, subject/referrer associations, pagination and provider fallback semantics.

The canonical SB model remains independent of any one version/encoding/provider.

## 24. Cross-capability boundaries

- **Build / Dependency Graph / Reproducibility** owns material closure, build execution, outputs and reproducibility claims; Artifact/Release owns adoption, release evidence and distribution lifecycle.
- **Deployment / Runtime** owns desired/effective workload state; release publication/admission does not prove deployment or runtime health.
- **Enterprise Trust / PKI** owns trust anchors/certificates/revocation/currentness; Artifact/Release consumes qualified trust for verification/admission.
- **Security / Resilience** owns compromise containment/recovery posture; Artifact/Release exposes release evidence and withdrawal/admission effects.
- **Governance / Compliance / Audit** owns policy, approvals, obligations and exceptions; release evidence is input, not authority.
- **Privacy / Data Governance** owns minimization/retention/residency obligations; Artifact/Release applies them to release evidence/copies.
- **Provider / Binding** owns provider discovery/support/admission/binding; Artifact/Release owns release-domain semantic requirements.
- **Lifecycle / Versioning** supplies generic revision/coexistence/migration primitives; Artifact/Release applies them to artifact/release history.
- **Observability / Operations / Incident** owns general telemetry/incident semantics; Artifact/Release supplies domain-specific signals/currentness/reconciliation evidence.
- **Standards / Interoperability / API Contracts** owns encoding/protocol conformance; C3.19 owns semantic subject/applicability/authority independent of format.

## 25. Planning D migration constraints

Planning D must preserve these constraints:

1. KEEP current SHA-256 content-addressed artifact verification and immutable conflict rejection.
2. KEEP `releaseId@version` as a useful logical identity foundation while formalizing explicit `ReleaseRevisionId`/composition semantics without destructive replacement.
3. Separate current compiler `ReleaseArtifact` naming from canonical BuildOutputSet -> ArtifactAdoption semantics incrementally.
4. Generalize existing `ReleaseEvidenceProvenance`; do not discard working evidence lineage.
5. Add SBOM/provenance/signature semantics behind provider-neutral interfaces; avoid proprietary registry lock-in.
6. Introduce distribution/provider effect disposition and reconciliation before enabling unsafe automatic retry.
7. Preserve historical release records while adding supersession/withdrawal/current-admission semantics.
8. Make rollback eligibility recomputed/current rather than a stored permanent boolean.
9. Add provider support/currentness/residual-cohort semantics before registry substitution/cutover.
10. Preserve local/offline/self-hosted closure and Fleet != local truth.
11. Carry Operability Elicitation and Production Readiness Coverage metadata into migration sequencing.
12. Physical/peripheral firmware distribution remains bounded by C2; no generic actuation path may emerge from migration convenience.

## 26. Planning E proof candidates

Planning E should define executable/inspectable proofs including at least:

1. build output cannot become canonical release artifact without explicit adoption;
2. artifact bytes cannot mutate under the same immutable revision;
3. identical digest does not collapse distinct logical release revisions/authority;
4. mutable tag/channel always resolves to immutable identity with history;
5. SBOM statement is bound to explicit subject and lifecycle/profile revision;
6. missing/excluded components keep SBOM coverage PARTIAL/INCONCLUSIVE;
7. provenance subject mismatch fails qualification;
8. valid signature from untrusted/revoked signer does not authorize release;
9. stale trust/verifier policy cannot be silently reused;
10. publication timeout produces UNKNOWN and reconcile-before-retry where idempotency is unsafe;
11. provider upload success does not mark mirror/fleet convergence automatically;
12. partial pagination/referrer discovery remains PARTIAL rather than complete;
13. provider substitution verifies support vector before cutover;
14. residual old-provider/mirror copies remain tracked after cutover;
15. withdrawal preserves historical evidence while preventing new admission as policy requires;
16. rollback eligibility changes when trust/schema/config/provider prerequisites change;
17. release published does not imply deployed/effective runtime;
18. local/offline artifact closure becomes stale when currentness horizon expires;
19. Fleet aggregate cannot overwrite contradictory local artifact evidence;
20. queue-age/capacity proof detects release-pipeline starvation even with low average utilization;
21. privacy-safe telemetry redacts/minimizes protected metadata without breaking subject binding;
22. Brownfield mutable/manual release evidence remains candidate until explicit adoption;
23. AI proposal/release notes cannot promote, sign, withdraw or authorize rollback;
24. Physical/Peripheral firmware release qualification cannot invoke direct physical actuation authority.

## 27. Adversarial carry-forward

Inherited adversarial proof obligations remain active. Particularly relevant patterns include:

- feature/release fully specified but operational ownership absent;
- provider integration without timeout/reconciliation;
- dashboard/currentness ambiguity;
- retry without idempotency;
- alert without action owner;
- metric without unit/population/time context;
- failure/withdrawal without recovery/drainage;
- rollout/promotion without rollback eligibility;
- capacity without peak assumptions;
- compliance/audit evidence without retention;
- signature/provenance/SBOM presence incorrectly upgraded to admission authority;
- stale/offline/local and Fleet disagreement;
- provider revision/support drift;
- residual distribution cohorts after cutover/withdrawal;
- Legacy Mirroring evidence promoted without governed adoption.

No new ConflictPattern or ConflictInstance is created by this target decision.

## 28. Decision summary

**PASS_FOR_CAPABILITY / TARGET_ARCHITECTURE_DECIDED.** C3.19 establishes canonical artifact/release identity and immutable history, explicit build-output adoption, release composition/channels, subject-bound SBOM/provenance/attestation semantics, cryptographic-vs-semantic-vs-authority separation, provider-neutral distribution/reconciliation, current rollback eligibility, offline/self-hosted closure, queue/capacity operability and Brownfield adoption boundaries.

Generation 1's content-addressed artifact and logical release foundations are retained and generalized. Standards such as SLSA, in-toto, SPDX, CycloneDX and OCI are interoperability realizations, not canonical semantic owners. Physical/Peripheral artifact distribution remains inside C2's bounded integration/governance plane and does not admit generic direct physical actuation.

Planning C may advance only to the next capability authorized by `RESEARCH_PIPELINE_STATE.json` after this decision and stale-state reconciliation. No Planning D/E, WBS, Work Package, executive TASK, Construction or product code is authorized by this artifact.
