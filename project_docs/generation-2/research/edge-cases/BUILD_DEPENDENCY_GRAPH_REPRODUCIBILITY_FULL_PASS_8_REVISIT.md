# Generation 2 — Build / Dependency Graph / Reproducibility — Full Pass 8 Revisit

Status: FULL PASS 8 — ELIGIBLE NO-NEW-MATERIAL REVISIT / LOCAL STREAK REMAINS 2 / PAIRED CLUSTER STREAK REMAINS 2
Capability: Build / Dependency Graph / Reproducibility
Paired mandatory cluster: Build × Artifact/Release × Deployment × Runtime
Phase: `RESEARCH_ADVERSARIAL_EDGE_CASE_SATURATION`

Research-only disposition: `CATALOGUE + CLASSIFY + DETECTION_CANDIDATE + FUTURE_REMEDIATION_ROUTE`. This artifact authorizes no product implementation, Work Package, TASK, Construction, release, build execution or remediation. Preserve `Research != remediation`, `ConflictPattern != ConflictInstance`, `Signal != ConfirmedConflict`, `UNKNOWN -> reconcile-before-retry`, `observed input != approved input`, `provenance != authority != causality`, and `AI inference = candidate`.

## Authority and entry

`RESEARCH_PIPELINE_STATE.json` and `ADVERSARIAL_SATURATION_STATE.json` were re-read against branch head `a034c5a01465b2e15967c84e3b859c3046a4ebc9` immediately before persistence. They require Full Pass 8 to continue with Build / Dependency Graph / Reproducibility and explicitly exercise Build × Artifact/Release × Deployment × Runtime. Entering inventory is 284 material edge scenarios + 124 reusable ConflictPatterns = 408 material findings, with zero HIGH/CRITICAL findings lacking owner/proof/detection route. Build and the paired cluster already have no-material streak 2 and must not inflate absent material novelty. Planning C remains blocked.

## Full-Pass-8 technique rotation

This revisit intentionally differs from Full Pass 7's bitemporal build-cut, cache-lineage and graph-rewrite emphasis. It combines **elicitation completeness subtraction, discovered-vs-approved input separation, lock/pin semantic falsification, Brownfield build reconstruction, human release-procedure contradiction, shared-build attribution pressure, offline/autonomous currentness and AI/low-code supply-chain composition**.

1. **elicitation completeness subtraction** — remove build owner, approved input set, toolchain source, trust source, release authority, offline behavior, rebuild evidence or rollback/recovery route from an otherwise plausible build specification and test false `RESOLVED`/implementation-ready/publish-ready claims;
2. **discovered-vs-approved input mutation** — discover ambient tools, network fetches, environment variables, generated files, local caches, plugins, actions/workflows and provider metadata and challenge promotion from observed dependency to approved canonical dependency;
3. **pinning-semantic falsification** — hold a nominal pin/lock constant while varying whether the reference is immutable, repository-qualified, platform-qualified, transitive-complete or still resolves provider-side aliases;
4. **conditional/platform closure mutation** — vary OS/CPU/feature flag/locale/timezone/provider/build mode while the visible graph remains stable and test hidden target-specific dependencies;
5. **cache-key subtraction** — remove tenant, builder/trust profile, environment/toolchain revision or conditional input from cache qualification and test false equivalence or cross-tenant contamination;
6. **Brownfield build reconstruction** — inventory CI YAML, shell/PowerShell scripts, Dockerfiles, Makefiles, lockfiles, package-manager config, local operator instructions, credential/provider setup and downloaded tooling while preserving `observed build behavior != approved build semantics`;
7. **human release contradiction** — compare release runbook/manual approval claims against actual workflow/build provenance and challenge undocumented steps, emergency overrides and stale procedures;
8. **residual cohort falsification** — promote a new artifact while old build/runtime/provider cohorts remain active, cached, offline or independently deployed;
9. **shared-build queue/attribution pressure** — inject bursty builds, retries, matrix fan-out, cache misses, long-tail service times and multiple tenants while observing attribution, starvation and priority inversion;
10. **offline/autonomous evidence partition** — remove Fleet/control-plane availability and require local build provenance/currentness to remain independently meaningful without allowing stale central observation to certify convergence;
11. **Physical/Peripheral boundary check** — adapter SDKs, generated clients or vendor build tools may be dependencies, but their presence never expands SB into physical actuation authority;
12. **AI/low-code composition** — let generated build pipelines choose actions/plugins/base images/toolchains from semantically similar candidates and test unsupported or stale assumptions, supply-chain authority widening and false completeness;
13. **causal restraint** — vary one build input after a failure and reject `changedWith -> causedBy` without an explicit causal model/assumptions/evidence;
14. **proof-bundle boundary** — attempt to import successful build/reproducibility/provenance evidence into `WorkflowCompletionCertificate`/`ProcessProofBundle` as terminal execution truth and require rejection of claim strengthening.

## Adversarial result and duplicate screen against all 124 ConflictPatterns

No distinct 125th reusable ConflictPattern survived screening.

- incomplete build elicitation marked sufficient maps to false-completeness, unknown-owner/authority, evidence/currentness and cross-capability dependency-gap families;
- discovered ambient input promoted directly to approved canonical input maps to assumption/inference promotion, hidden-effective-input and provenance/currentness families;
- nominal lock/tag/pin treated as immutable identity maps to qualified-identity, revision/currentness and provider-semantic-mismatch families;
- target-specific dependency activation outside the visible graph maps to hidden-effective-input and conditional closure families;
- cache reuse under omitted tenant/trust/toolchain dimensions maps to qualified identity, authority non-amplification, cross-tenant leakage and proof-claim conflation;
- Brownfield build scripts/config promoted to desired architecture maps to inference/authority, provenance, migration/coexistence and historical reinterpretation families;
- human release instruction conflicting with observed build/release state maps to human-procedure, authority and version/currentness conflict families;
- new release coexisting with old build/runtime cohorts maps to residual-cohort, false-convergence, rollback-eligibility and directed-compatibility families;
- healthy average build utilization with growing backlog maps to resource/capacity/fairness and objective-conflict families;
- local/autonomous evidence overwritten by stale Fleet observation maps to currentness, evidence-source and false-convergence families;
- vendor SDK/tool dependency interpreted as physical authority maps to provider-boundary and authority-strengthening families;
- AI-generated dependency or pipeline selection promoted directly to trusted requirement/release authority maps to AI/low-code composition, inference-promotion and authority non-amplification families;
- provenance/correlation promoted to causal blame maps to provenance-overattribution and causal-claim qualification families;
- build proof promoted to terminal workflow completion maps to proof-claim conflation and execution/effect separation families.

The strongest candidate is a refined **build-input completeness fallacy**: the build can be reproducible under a declared envelope and carry authentic provenance while one or more effective inputs, transitive dependencies or ambient conditions remain incomplete, unapproved or semantically misclassified. This is material but already covered by hidden-effective-input, provenance qualification, currentness/revision, false completeness and proof-claim separation. No `ConflictInstance` is asserted.

## Evidence refresh — 2026-09-06

Current primary documentation reinforces the duplicate-screen result:

- SLSA Build v1.2 states that external parameters must be fully enumerated at stronger levels while completeness of `resolvedDependencies` remains best effort. It also distinguishes build-platform isolation from hermeticity and requires remote influence that changes the build definition to be represented as external parameters. Therefore authentic provenance does not prove complete semantic closure of every effective dependency.
- SLSA verification guidance notes that incomplete `resolvedDependencies` constrain recursive verification and that an abstraction with impractical external parameters may itself indicate an inadequate build type. This supports a proof obligation to qualify what the provenance actually covers rather than infer full dependency closure.
- GitHub Actions security guidance states that a full-length commit SHA is the immutable way to pin an action; tags can move or be deleted. A human answer such as “the action is pinned to v1” therefore does not establish immutable revision identity.
- GitHub's immutable releases protect release assets/tags after publication, but this remains release-integrity evidence, not proof that a build's transitive inputs, deployment cohorts or runtime state converged.
- Nix documents `impureEnvVars`, showing that even a build-oriented system can deliberately admit selected ambient environment variables under qualified semantics. Presence of a derivation/lock abstraction must therefore not be over-read as universal hermeticity.

Evidence anchors consulted on 2026-09-06:

- https://slsa.dev/spec/v1.2/build-requirements
- https://slsa.dev/spec/v1.0-rc2/verifying-artifacts
- https://docs.github.com/en/actions/reference/security/secure-use
- https://docs.github.com/en/code-security/concepts/supply-chain-security/immutable-releases
- https://nix.dev/manual/nix/2.31/language/advanced-attributes

Provider/system-specific mechanisms remain comparative evidence only and are not adopted blindly as canonical System Builder semantics.

## Elicitation & System Understanding adversarial lens

For Build / Dependency Graph / Reproducibility, `answered != understood` is exercised through these critical dimensions:

- semantic/build owner and release/approval authority;
- declared inputs versus observed/discovered inputs versus approved canonical inputs;
- source/currentness of dependency, toolchain, base image, action/workflow and provider references;
- immutable versus floating references and revision qualification;
- conditional/platform-specific closure;
- offline/network access and ambient environment assumptions;
- cache equivalence and tenant/trust boundaries;
- reproducibility envelope: which dimensions are held fixed or intentionally varied;
- provenance completeness profile and verifier expectations;
- failure, retry, `PARTIAL/UNKNOWN`, rebuild and reconciliation semantics;
- concurrency/queue/capacity and shared-build attribution;
- release/promotion/deployment/residual-cohort lifecycle;
- Brownfield scripts/manual steps/shadow build paths;
- audit/observability/support evidence;
- rollback/recovery eligibility;
- AI/low-code inference and authority limits.

A build capability cannot be marked `SUFFICIENT_FOR_IMPLEMENTATION` or `SUFFICIENT_FOR_PUBLISH_OPERATION` merely because a pipeline runs or produces reproducible bytes. Applicable HIGH/CRITICAL unanswered dimensions, unresolved contradictions, stale evidence, unsupported `NOT_APPLICABLE`, sole-source AI inference or unowned Brownfield behavior keep the relevant dimension `PARTIAL`, `CONFLICTED` or `BLOCKED`.

Candidate elicitation conflict labels such as `FALSE_ELICITATION_COMPLETENESS`, `STAKEHOLDER_COVERAGE_GAP`, `ASSUMPTION_PROMOTED_TO_FACT`, `UNRESOLVED_CONTRADICTION_HIDDEN`, `HAPPY_PATH_ONLY_SPECIFICATION`, `ELICITATION_PROVENANCE_BREAK`, `CROSS_CAPABILITY_QUESTION_ROUTING_GAP` and `AI_INFERENCE_PROMOTED_TO_REQUIREMENT` remain labels for duplicate-screening; no new IDs are created because their activation conditions are represented by existing reusable patterns.

## Mandatory cluster exercise — Build × Artifact/Release × Deployment × Runtime

Result: **ELIGIBLE NO-NEW-MATERIAL EXERCISE**.

The cluster was challenged across:

`elicited/approved inputs -> effective build closure -> toolchain/builder/provider cut -> cache/execution -> artifact/provenance -> release authority -> deployment cohort -> runtime adoption/effective truth`.

Non-strengthening boundaries:

- `question answered != effective build closure proven`;
- `observed/discovered dependency != approved dependency`;
- `lock/tag present != immutable identity`;
- `reproducible bytes != complete provenance != semantic equivalence`;
- `cache hit != fresh authorized execution`;
- `artifact attested != release authorized`;
- `release published != deployment converged`;
- `deployment acknowledged != all runtime cohorts adopted`;
- `runtime healthy != workflow/process PROVEN_COMPLETED`;
- `current dependency graph != historical producing truth`.

No new `G2-XEDGE-*` or reusable `G2-CONFLICT-PATTERN-*` survived duplicate-screening. Paired-cluster streak remains capped at 2.

## Formal assurance / proof obligations carried forward

Planning C/D/E and Architecture Reconciliation should consume these obligations without architecture materialization:

1. **No-false-elicitation-complete:** Build sufficiency is multidimensional and gate-relative; HIGH/CRITICAL unanswered/contradicted/unowned dimensions block stronger gates.
2. **Discovered-vs-approved input separation:** observed/ambient/Brownfield dependencies remain evidence/candidates until owner-approved canonicalization.
3. **Effective-closure proof:** target/platform/feature/provider/environment conditions are bound to the concrete build claim; incomplete evidence yields `UNKNOWN/INCONCLUSIVE` for stronger closure claims.
4. **Immutable-reference qualification:** a pin states repository/namespace/revision and mutability semantics; human labels such as `latest`, `v1` or provider aliases cannot substitute for immutable identity.
5. **Historical non-rewrite:** current dependency/toolchain/provider projections cannot silently rewrite historical producing truth.
6. **Provenance non-strengthening:** authentic provenance does not imply dependency completeness, release authorization, causality, deployment convergence or execution completion.
7. **Cache-equivalence typing:** cache reuse states its equivalence dimensions and cannot fabricate tenant/trust/authority/provenance identity.
8. **Brownfield no-silent-canonicalization:** imported scripts/config/manual steps require provenance, currentness, owner and explicit semantic adoption; unsupported/hidden build behavior is reported, not silently dropped.
9. **Graph/revision proof invalidation:** semantic build-graph transformation declares proof preservation/invalidation/revalidation; visual or label similarity is insufficient.
10. **Queue/capacity qualification:** sustainable build capacity uses workload/burst/service/backlog/fairness assumptions; observed utilization alone is insufficient.
11. **Residual-cohort proof:** release/deployment completion requires disposition of old build/runtime/provider cohorts and directed compatibility.
12. **Offline/autonomous currentness:** local producing evidence remains independently qualified; Fleet/control-plane absence or staleness cannot rewrite local truth or certify global convergence.
13. **Human-procedure consistency:** runbooks/manual approvals are revisioned evidence and contradictions with canonical workflow/authority/provenance remain explicit until dispositioned.
14. **Physical/Peripheral non-authority:** vendor SDK/client/tool dependencies do not expand canonical authority into device actuation/control loops.
15. **Causal restraint:** correlation, temporal adjacency or lineage does not establish causal responsibility without assumptions/model/evidence.
16. **AI/low-code non-strengthening:** generated pipeline/dependency choices remain candidates; they cannot strengthen trust, authority, provenance, completeness or proof validity.
17. **ProcessProofBundle boundary:** build/artifact evidence can support only its qualified build claims and cannot prove workflow trace completion, external effects, child completion or business convergence.
18. **Planning E adversarials:** omitted ambient dependency; mutable tag presented as immutable pin; platform-specific hidden dependency; cache reuse across changed tenant/trust profile; Brownfield script silently canonicalized; stale runbook contradiction; bursty shared-build queue instability; mixed runtime cohorts; offline local build with stale Fleet projection; AI-selected supply-chain component lacking approved owner/currentness; build proof refusing promotion to `PROVEN_COMPLETED`.

## Conflict classification and detection disposition

No signal is promoted to `ConfirmedConflict`; no remediation is executed.

Detection candidates:

- **static/design-time:** floating/mutable refs; unresolved conditional dependencies; build graph cycles; missing input owners; cache-key/profile omissions; cross-tenant namespace overlap; AI-generated unapproved dependencies;
- **elicitation/pre-execution:** unanswered owner/source-of-truth/toolchain/provenance/release-authority/offline/recovery questions; stale source evidence; Brownfield observed-only dependencies; unsupported `NOT_APPLICABLE`;
- **runtime/build-time:** unexpected network/tool/environment access; cache attribution mismatch; `PARTIAL/UNKNOWN` provider/build effects; queue/backlog growth; concurrent build influence; provider drift;
- **post-build/pre-release:** artifact/provenance subject mismatch; resolved dependency gaps; runbook/provenance contradiction; release authority mismatch; semantic-diff/proof invalidation;
- **deployment/audit:** residual cohort inventory; deployment/runtime adoption divergence; historical producing-cut verification; stale Fleet/global projection; proof-profile rejection of build evidence as workflow completion.

## Eligibility and campaign disposition

- Local result: **ELIGIBLE NO-NEW-MATERIAL REVISIT**.
- Paired-cluster result: **ELIGIBLE NO-NEW-MATERIAL EXERCISE**.
- New local edge scenarios: **0**.
- New cross-capability scenarios: **0**.
- New reusable ConflictPatterns: **0**.
- New ConflictInstances: **0**.
- New preventive invariants: **0**.
- New capability promotion/backfill: **0**.
- HIGH/CRITICAL without owner/proof/detection route: **0**.
- Build local streak: **2 -> 2 capped**.
- Build × Artifact/Release × Deployment × Runtime streak: **2 -> 2 capped**.
- Material inventory remains **284 edge scenarios + 124 ConflictPatterns = 408**.
- Full Pass 8 advances to **7/28 capabilities + 7/12 mandatory clusters**.
- Completed full passes remain **7/8 minimum**; target **12**, no maximum.
- Negative-space remains `NOT_STARTED`.
- Saturation remains `NOT_SATURATED`.
- Planning C remains blocked.

## Next rotation

Continue only Full Pass 8 with **Artifact / Release / SBOM / Provenance** and explicitly exercise **Enterprise Trust/PKI × Identity × Artifact/Release × provider substitution**. Use materially different probes centered on subject-set completeness, attestation identity and trust horizon, SBOM/provenance partiality, signer/build/verifier identity separation, immutable/mutable release references, release-channel/cohort semantics, provider substitution, offline verification/currentness, residual artifacts, revocation/rotation, Brownfield release archives/manual promotion, queue pressure, `PARTIAL/UNKNOWN`, Physical/Peripheral adapter artifact trust, elicitation coverage and AI/low-code signing/promotion inference. Duplicate-screen all 124 ConflictPatterns. Artifact and paired cluster streaks are already capped at 2; do not inflate absent material novelty. Do not enter Planning C.