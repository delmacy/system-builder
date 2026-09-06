# Generation 2 — Build / Dependency Graph / Reproducibility — Full Pass 7 Revisit

Status: FULL PASS 7 — ELIGIBLE NO-NEW-MATERIAL REVISIT / LOCAL STREAK CAPPED AT 2 / CLUSTER STREAK CAPPED AT 2
Capability: Build / Dependency Graph / Reproducibility
Paired mandatory cluster: Build × Artifact/Release × Deployment × Runtime
Phase: `RESEARCH_ADVERSARIAL_EDGE_CASE_SATURATION`

Research posture: `CATALOGUE + CLASSIFY + DETECTION_CANDIDATE + FUTURE_REMEDIATION_ROUTE`. Research only. This dossier does not authorize architecture materialization, product implementation, Work Packages, TASKs, Construction or remediation. Preserve `ConflictPattern != ConflictInstance` and `Signal != ConfirmedConflict`.

## 1. Revalidation and scope

Authoritative `RESEARCH_PIPELINE_STATE.json` and `ADVERSARIAL_SATURATION_STATE.json` place Full Pass 7 at 6/28 capabilities and 6/12 mandatory clusters, with Build / Dependency Graph / Reproducibility as the next capability and Build × Artifact/Release × Deployment × Runtime as the next mandatory cluster. The reusable inventory is 284 edge scenarios + 124 ConflictPatterns = 408 material findings. Build and the paired cluster already have no-material streak 2 and therefore cannot inflate absent material novelty.

This pass deliberately differs from Pass 6. Pass 6 focused on claim-lattice falsification, witness subtraction, reproducibility metamorphism and proof-profile substitution. Pass 7 focuses on **temporal cuts, dynamic dependency activation, cache/provenance lineage, graph-transformation invalidation, queue stability/shared-build pressure, bitemporal release/build truth and counterfactual overclaim**.

## 2. Adversarial propositions challenged

The following implications were attacked and rejected as universal rules:

1. `current dependency graph == dependency graph effective when historical build executed`;
2. `lock/pin present == every conditional or ambient dependency was actually captured`;
3. `cache hit == equivalent execution under equivalent authority/trust/currentness`;
4. `content identity == producing-lineage identity`;
5. `graph rewrite preserving visible shape == proof-preserving semantic rewrite`;
6. `low observed build utilization == stable/sustainable shared build capacity`;
7. `historical artifact rebuild under current graph == historical producing truth`;
8. `build correlation/provenance relation == causal or authorization proof`;
9. `successful build/release chain == runtime convergence or workflow PROVEN_COMPLETED`.

All candidate failures duplicate-screen into existing temporal/currentness, hidden-effective-input, provenance-over-attribution, qualified-identity, graph-revision/proof-invalidation, resource/capacity/fairness, residual-cohort, false-convergence, authority-non-amplification and proof-claim-conflation families. No 125th reusable ConflictPattern survived duplicate-screening.

## 3. Technique rotation

### 3.1 Bitemporal build-cut permutation

For the same logical build request, permute:
- graph valid-time;
- graph transaction-time;
- lock/toolchain/provider metadata transaction-time;
- dependency registry resolution time;
- policy/trust effective time;
- release eligibility time;
- runtime deployment/adoption time.

Challenge whether a later `current` projection can silently rewrite what inputs and authorities were effective for a historical build. Required distinction: `current truth != historical truth != future/planned truth != effective truth at T`.

### 3.2 Conditional-dependency activation mutation

Keep the visible typed dependency graph stable while varying target platform, feature flags, optional dependency predicates, environment predicates, toolchain mode and provider resolution. Challenge whether an apparently closed graph actually identifies the dependency closure activated for the concrete build cut.

### 3.3 Cache-lineage permutation

Hold action/cache key apparently stable while varying builder identity, tenant, trust horizon, provenance completeness profile or hidden input assumptions. Challenge whether a cache hit is being strengthened into execution, provenance, authority or semantic equivalence.

### 3.4 Graph rewrite and proof survivorship

Apply semantic transformations that preserve visual shape or user-level node labels while changing edge predicates, conditional dependencies, node identity, provider binding or build target semantics. Reuse an old build proof and ask whether it remains valid, must be downgraded, or becomes `UNKNOWN/INCONCLUSIVE`.

### 3.5 Shared-build queue instability

Keep average observed utilization apparently healthy while injecting burstiness, correlated long builds, priority traffic, retries/cache misses, fan-out target matrices and shared bottlenecks. Challenge `observed utilization -> sustainable capacity` and detect starvation/priority inversion/backpressure without turning the signal itself into a confirmed conflict.

### 3.6 Provenance relation typing

Attempt to replace `builtFrom/derivedFrom` evidence with `causedBy`, `authorizedBy` or `approvedForRelease`. Require explicit relation semantics and evidence rather than infer stronger relations from graph connectivity.

### 3.7 Counterfactual restraint

Compare `artifact failed after dependency/provider/toolchain change` against the stronger claim `that change caused the failure`. Require explicit assumptions/model/evidence before causal or counterfactual conclusions drive release authority.

## 4. Fresh comparative evidence

### 4.1 SLSA v1.2-rc build requirements and provenance

SLSA states that provenance completeness is qualified by the builder; external parameters can require full enumeration at stronger levels while `resolvedDependencies` completeness remains best effort. It also states that build communication with control planes/caches is generally implied by `builder.id`; if such communication changes the build definition, it should instead appear as a resolved dependency. The provenance model separates `buildDefinition`, `runDetails`, builder identity and subjects, and treats builder identity as a transitive trust boundary.

Portable consequence: authentic provenance and a stable artifact digest do not prove that every conditional/ambient/effective dependency was captured, nor that a later graph projection represents the historical producing cut. A verifier must qualify the claim by builder/profile/currentness and refuse stronger claims when required evidence is absent.

Sources consulted 2026-09-06:
- https://slsa.dev/spec/v1.2-rc1/build-requirements
- https://slsa.dev/spec/v1.2-rc2/build-provenance
- https://slsa.dev/spec/v1.0/provenance

### 4.2 Reproducible Builds

Reproducible Builds continues to document environment variance including time, username, CPU/system version, filesystem/build path and locale as relevant reproducibility dimensions, and recommends rebuilding under controlled variations.

Portable consequence: reproducibility is a qualified relational claim over a declared variation envelope. `same bytes` does not prove equivalent producing lineage, authority, temporal cut or semantic graph; `different bytes` under a permitted target/environment difference does not itself prove semantic conflict.

Sources consulted 2026-09-06:
- https://reproducible-builds.org/docs/plans/
- https://reproducible-builds.org/de/docs/env-variations/

### 4.3 Bazel remote cache as comparative evidence

Bazel documents remote-cache hits in terms of action identity/cacheability and provides execution/build-event evidence to diagnose whether apparently identical actions hit cache. This is useful evidence that cache identity is an execution-system claim and must not be silently promoted into semantic/provenance/authority equivalence.

Source consulted 2026-09-06:
- https://bazel.build/remote/cache-remote

### 4.4 Nix content-addressed derivations as comparative evidence

Nix content-addressed derivations associate output paths/trust with content addressing and require explicit opt-in/qualification. This is useful comparative evidence for separating content identity from broader producing semantics and policy eligibility.

Source consulted 2026-09-06:
- https://wiki.nixos.org/wiki/Ca-derivations

Provider/system-specific mechanisms remain comparative evidence only and are not adopted as canonical System Builder semantics.

## 5. Duplicate-screened material candidates

### 5.1 Historical build cut overwritten by current dependency projection

**Activation:** a historical build was produced under graph/toolchain/provider/policy cut T1; current projection T2 supersedes or retroactively corrects metadata and an audit/rebuild treats T2 as if it were the producing truth.

**Conflict:** historical evidence versus current projection; later currentness silently rewrites producing lineage.

**Classification:** temporal + version + provenance; HIGH potential severity; scope build→artifact→runtime; activation revision/time-dependent; detectability audit/pre-release; likely blast radius system/external consumer; confidence strongly supported.

**Owners:** Build; Lifecycle; Artifact/Release; Provider/Binding; Governance/Trust where policy/currentness participates.

**Detection route:** compare producing transaction/valid-time cut, provenance/build definition and current graph; a mismatch is a `Signal`, not automatically a confirmed conflict because authorized supersession may be intentional.

**Proof obligation:** historical build claims bind the producing graph/build/toolchain/provider/policy cut and cannot be recomputed from current projection without an explicit reinterpretation/migration claim.

**Duplicate-screen:** existing temporal-currentness, revision-vector, supersession-lineage, provenance-over-attribution and historical-recomputation families. No new pattern.

### 5.2 Conditional dependency omitted from visible graph closure

**Activation:** target/feature/environment/provider predicate activates a dependency not represented in the canonical graph closure used for a stronger build claim.

**Conflict:** graph closure claim versus effective build closure.

**Classification:** semantic + provider + data/version; MEDIUM–HIGH; static/build-time; plausible accidental misuse.

**Owners:** Build; Provider/Binding; capability owner defining conditional semantics.

**Detection route:** target-specific closure derivation + provenance/resolved-dependency comparison + metamorphic target/feature permutations.

**Proof obligation:** build proof identifies target/predicate/environment profile and distinguishes declared graph closure from effective resolved closure; missing capture yields bounded `UNKNOWN/INCONCLUSIVE` for stronger claims.

**Duplicate-screen:** hidden-effective-input, qualified identity/currentness, provider-support and proof-claim-conflation families.

### 5.3 Cache hit strengthened into provenance/authority equivalence

**Activation:** cached result is reused across build executions, tenants, authority/trust horizons or builder modes and the reuse is interpreted as if a fresh equivalent authorized execution occurred.

**Conflict:** content/action cache equivalence versus producing execution/provenance/authority identity.

**Classification:** provenance + authority + security + temporal; HIGH potential severity; pre-release/build-time; cross-tenant blast radius possible.

**Owners:** Build; Enterprise Trust; Governance; Artifact/Release.

**Detection route:** cache-key/profile audit including builder/trust/tenant/effective-input boundaries; mismatch is a signal requiring qualification.

**Proof obligation:** cache evidence states what equivalence relation it establishes; cache reuse cannot manufacture a new producing execution, approval or stronger provenance relation.

**Duplicate-screen:** qualified identity, provenance-edge over-attribution, authority non-amplification and proof-claim conflation.

### 5.4 Shape-preserving graph transformation reuses stale build proof

**Activation:** Canvas/model transformation preserves visible structure or labels but changes semantic edge predicate, node identity, provider binding or conditional dependency meaning; previous build proof remains attached.

**Conflict:** visual/structural similarity versus semantic proof validity.

**Classification:** structural + semantic + version; HIGH; design/pre-release; blast radius artifact/system.

**Owners:** Process/Application Modeling; Build; Lifecycle; Provider/Binding where relevant.

**Detection route:** semantic diff + proof-dependency impact analysis; inability to establish preservation yields `UNKNOWN/INCONCLUSIVE` rather than proof reuse.

**Proof obligation:** graph transformation declares which proof obligations are preserved, invalidated or require revalidation; node/edge identity reuse alone cannot preserve proof.

**Duplicate-screen:** graph-revision/proof-invalidation, stale-proof/currentness and compatibility-direction families.

### 5.5 Shared build infrastructure appears healthy while queue is unstable

**Activation:** average utilization looks acceptable, but burstiness/correlated service times/priority classes/retries/fan-out create queue growth, head-of-line blocking or starvation.

**Conflict:** observed utilization/throughput snapshot versus sustainable capacity/stability claim.

**Classification:** resource + temporal + cross-process; MEDIUM–HIGH; runtime/operational; delayed/cumulative harm.

**Owners:** Build; Developer/Operator Experience; Technology Economic Governance / FinOps for economic qualification; provider owner if external build service.

**Detection route:** arrival/service distributions, backlog age, priority/fairness, retry amplification and bottleneck-specific telemetry. Queue-growth signal is not itself proof of a semantic conflict until activation conditions and ownership are confirmed.

**Proof obligation:** capacity claims identify workload envelope, burst assumptions, bottlenecks, priority/fairness policy and observation horizon; `utilization < 100%` is not sufficient proof of stability.

**Duplicate-screen:** resource/capacity/fairness, objective-conflict and provider-quota families.

### 5.6 Provenance connectivity promoted to causality or release authority

**Activation:** artifact/dependency lineage demonstrates a derivation/production relation and an operator/AI infers that a dependency caused a failure or that provenance itself authorizes promotion.

**Conflict:** `derivedFrom/builtFrom` versus `causedBy/authorizedBy`.

**Classification:** provenance + causal + authority; HIGH if used to gate release; audit/pre-release; plausible AI/automation misuse.

**Owners:** Build; Governance/Trust; Artifact/Release; causal-analysis owner where such analysis is explicitly used.

**Detection route:** typed relation validation and evidence/assumption audit; correlation/lineage is a `Signal`, not a causal conclusion.

**Proof obligation:** causal or authorization claims require explicit model/assumptions/authority evidence and may not be inferred solely from provenance graph connectivity.

**Duplicate-screen:** `G2-CONFLICT-PATTERN-PROVENANCE-EDGE-OVERATTRIBUTION-001`, authority non-amplification and proof-claim conflation.

## 6. Mandatory cluster exercise — Build × Artifact/Release × Deployment × Runtime

The cluster was challenged across a temporal and provenance-qualified chain:

`effective graph cut at T -> target/conditional closure -> builder/toolchain/provider cut -> cache/remote execution -> artifact + provenance -> release decision -> deployment cohort -> runtime adoption/effective truth`.

Portable non-strengthening rules remain:

- build graph validity does not prove effective target closure;
- cache hit does not prove fresh execution or authorization;
- artifact/content identity does not prove producing-lineage identity;
- provenance authenticity does not prove semantic completeness;
- release approval does not prove deployment or runtime adoption;
- deployment acknowledgement does not prove cohort convergence;
- current projection does not rewrite historical producing truth;
- runtime health does not prove workflow/process completion;
- a build/artifact proof cannot be imported as `PROVEN_COMPLETED` evidence without the workflow/effect obligations required by that claim.

No material interaction fell outside the existing 124-pattern catalogue. The mandatory-cluster streak remains 2 capped.

## 7. Formal assurance / proof obligations carried forward

Planning C/D/E and Architecture Reconciliation should consume these as obligations, not architecture already chosen:

1. **Bitemporal build-proof binding:** graph/build/toolchain/provider/policy identities are qualified by producing effective-time/transaction-time cut where relevant.
2. **Historical non-rewrite:** current graph or dependency projection cannot silently replace historical producing evidence.
3. **Conditional-closure proof:** target/platform/feature/provider predicates are part of the build claim profile and effective dependency closure.
4. **Provenance non-strengthening:** `builtFrom/derivedFrom != causedBy != authorizedBy != approvedForRelease` absent explicit evidence.
5. **Cache-equivalence typing:** cache/action identity states the equivalence it proves and cannot fabricate producing execution, approval or trust.
6. **Graph-transformation preservation proof:** semantic diff determines proof preservation/invalidation/revalidation; visual shape and reused IDs are insufficient.
7. **Queue/capacity qualification:** sustainable-capacity claims include arrival/service/burst/backlog/fairness/bottleneck assumptions; observed utilization alone is insufficient.
8. **Cohort-aware release/deployment proof:** successful build/release cannot imply system-wide adoption without runtime cohort evidence and directed compatibility.
9. **Offline/autonomous currentness:** local producing truth remains independently qualified; stale central/Fleet observation cannot rewrite it or certify convergence.
10. **Independent verifier downgrade:** incomplete dependency/provenance/currentness/cohort evidence yields `UNKNOWN/INCONCLUSIVE` for stronger claims, never silent success.
11. **AI/low-code non-strengthening:** generated transformations or release recommendations cannot strengthen provenance, causality, authority, certainty or proof validity.
12. **Planning E candidate tests:** historical-cut replay versus current graph; conditional-dependency activation with stable visible graph; cache hit under changed trust/tenant profile; shape-preserving semantic rewrite invalidating stale proof; bursty shared-build queue instability; lineage relation refusing causal/authority promotion; mixed runtime cohorts preventing false convergence; build proof refusing promotion to workflow `PROVEN_COMPLETED`.

These complement the global Planning E obligations for sound workflow models, bounded loop/recursion, invalid/deadlocking graph rejection, trace conformance, tamper detection, external `UNKNOWN` preventing false completion, child-proof composition and offline verification.

## 8. `WorkflowCompletionCertificate` / `ProcessProofBundle` interaction

A build proof may be referenced in a process proof bundle only for the exact claim it supports: graph/build revision, produced subject, builder/trust profile, relevant provenance and target cut. It cannot prove that workflow nodes executed, external effects occurred, child workflows completed, compensations ran, journal events are complete, or business invariants converged.

An independent verifier must therefore distinguish at minimum:
- model/revision identity evidence;
- build/artifact provenance evidence;
- execution trace/conformance evidence;
- journal-integrity evidence;
- child-proof references;
- external-effect evidence;
- terminal/invariant evidence;
- unresolved `UNKNOWN/PARTIAL/INCONCLUSIVE` claims.

`valid build proof != valid execution proof != PROVEN_COMPLETED`.

## 9. Saturation disposition

Result: **ELIGIBLE NO-NEW-MATERIAL REVISIT**.

- New local edge scenarios: **0**.
- New cross-capability scenarios: **0**.
- New reusable ConflictPatterns: **0**.
- New ConflictInstances: **0**.
- New preventive invariants: **0**.
- Proof-obligation/detection refinements: **12**, mapped to existing families and future Planning C/D/E / Architecture Reconciliation.
- Build local no-material streak remains **2**, capped.
- Build × Artifact/Release × Deployment × Runtime cluster streak remains **2**, capped.
- Material inventory remains **284 edge scenarios + 124 ConflictPatterns = 408 material findings**.
- HIGH/CRITICAL findings without owner/proof/detection route remain **0**.
- Full Pass 7 advances to **7/28 capabilities + 7/12 mandatory clusters**.
- Completed full passes remain **6/8 minimum**; target **12**, no maximum.
- Negative-space remains `NOT_STARTED`; saturation remains `NOT_SATURATED`.
- Planning C remains blocked.

Next eligible focus: **Artifact / Release / SBOM / Provenance**, explicitly exercising **Enterprise Trust/PKI × Identity × Artifact/Release × provider substitution**. Use temporal attestation validity, subject-set completeness, signer/builder/verifier distinction, provenance relation typing, SBOM/provenance partiality, provider-substitution residual cohorts, graph/release transformation, queue/capacity pressure, offline currentness, causal non-strengthening and AI/low-code promotion authority. Local and cluster streaks are already 2 capped and must not inflate absent material novelty.