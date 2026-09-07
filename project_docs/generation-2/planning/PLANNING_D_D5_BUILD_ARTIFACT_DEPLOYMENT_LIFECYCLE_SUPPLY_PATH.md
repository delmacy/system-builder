# Generation 2 — Planning D D5 Build, Artifact, Deployment and Lifecycle Supply Path

Status: **DECIDED / PASS FOR D5**  
Phase: `PLANNING_D_DEPENDENCY_MIGRATION_STRATEGY`  
Scope: D5 dependency/migration planning only. No D6+, Planning E, Architecture Reconciliation phase, WBS, Work Packages, executive TASKs, Construction, remediation or product code.

## 1. Authority and decision question

This record executes only the D5 action authorized by `RESEARCH_PIPELINE_STATE.json`, under D0/D1/D2/D3/D4. Planning C remains target-architecture authority and Planning B remains current-state authority. Research remains `CLOSED / SATURATED / PASS` with 408 inherited material findings (284 edge scenarios + 124 reusable `ConflictPattern`s).

Constitutional distinctions remain unchanged:

- `Research != remediation`;
- `ConflictPattern != ConflictInstance`;
- `Signal != ConfirmedConflict`;
- `declared dependency != resolved dependency != fetched material`;
- `build success != reproducible build`;
- `build output != canonical artifact != logical release != deployment != effective runtime`;
- `SBOM/provenance/signature present != complete/current/trusted/admitted`;
- `release published/admitted != deployed != ready != serving/effective`;
- `desired state != provider-accepted state != observed state != effective state`;
- `revision exists != effective adoption`;
- `rollback artifact retained != rollback currently eligible != rollback converged`;
- `provider ACK != convergence`;
- `Fleet aggregate != Station/local runtime truth`;
- `AI-generated build/release/deployment proposal != authority`.

D5 answers:

> In what dependency order and coexistence envelope can the current deterministic build/release/deployment foundations evolve toward the C3.18/C3.19/C3.20/C3.24 target while preserving autonomous client builds, material and release identity, evidence/provenance, provider portability, authority/trust prerequisites, mixed revision cohorts, local/Fleet currentness, finite residual drainage and rollback/roll-forward truth?

## 2. Decision summary

D5 adopts a **material-closure-first, evidence-qualified, immutable-artifact, cohort-aware supply-path migration strategy**.

The governing partial order is:

`source/build intent qualification -> dependency/material closure -> toolchain/runner/environment qualification -> build attempt -> output validation -> reproducibility/equivalence assessment -> canonical artifact adoption -> SBOM/provenance/signature qualification -> release composition/admission -> distribution convergence -> deployment-plan qualification -> desired generation -> provider actuation -> observed runtime -> readiness -> traffic/consumer effectiveness -> residual cohort drain -> lifecycle reconciliation -> closure`.

This is a partial order, not a Work Package sequence. Existing deterministic single-host/local paths remain valid realizations while portable semantics are introduced around them. No migration step may compress multiple semantic identities merely to preserve an existing provider or workflow representation.

## 3. D5-DEC-001 — Supply-path identity is a graph, not a pipeline status

D5 requires distinct identities for at least:

- source/model revision;
- `BuildDefinitionRevision` / recipe revision;
- declared dependency intent;
- dependency resolution;
- fetched `MaterialRevision` and `MaterialClosure`;
- toolchain/runner/environment qualification;
- `BuildAttempt`;
- `BuildOutputSet`;
- canonical `ArtifactRevision`;
- `ReleaseRevision` and release composition;
- SBOM/provenance/attestation/signature evidence;
- distribution publication/replica realization;
- deployment plan and desired generation;
- runtime realization / observed generation / readiness assessment;
- lifecycle transition and `RevisionVector`;
- residual build, distribution and runtime cohorts.

A single `version`, CI run ID, image tag, deployment ID or provider status cannot stand in for this graph.

## 4. D5-DEC-002 — Autonomous-build inputs must become explicit before provider substitution

The existing autonomous generated-client principle is preserved. Migration first makes build influence explicit without making generated systems depend on the Builder at runtime.

Every migration slice must inventory and qualify, where applicable:

- source/model revision and generated inputs;
- dependency selectors, lock/resolution evidence and transitive materials;
- compiler/interpreter/SDK/base-image/tool/plugin revisions;
- target OS/architecture/platform profile;
- filesystem/environment/locale/time/randomness influences;
- network-fetched mutable inputs;
- symbolic config/secret references and permitted influence;
- runner/sandbox capabilities;
- cache inputs and invalidation assumptions;
- external service epochs when controlled impurity is unavoidable.

Invisible ambient inputs are migration debt. They may coexist temporarily, but must be classified and bounded before a reproducibility or provider-substitution claim can become authoritative.

## 5. D5-DEC-003 — Material closure migrates through shadow qualification, not lockfile absolutism

Current lockfiles, manifests and deterministic hashes remain valuable evidence. They are not automatically complete material truth.

Migration proceeds:

`legacy dependency evidence -> typed declared intents -> shadow resolution/material graph -> compare closure and conditional branches -> qualify integrity/currentness -> identify missing/ambient inputs -> adopt canonical material closure -> retain historical resolver/lock evidence`.

Platform-, architecture-, feature- and environment-conditional edges remain explicit. A closure proven for one target cannot be projected onto another without qualification.

Historical builds remain interpretable under the material/toolchain evidence available at their production time. Backfill may classify unknown inputs; it must not invent exact historical provenance.

## 6. D5-DEC-004 — Reproducibility is a scoped qualified claim

Migration must not convert deterministic output in the current bounded path into a universal reproducibility claim.

A `ReproducibilityAssessment` declares:

- exact subject build/output population;
- input/material closure revision;
- toolchain and target profile;
- runner/environment qualification;
- controlled impurity profile;
- comparison/equivalence profile (bitwise or weaker explicitly justified semantics);
- repeated-attempt evidence;
- differences and unresolved influences;
- evidence currentness.

A cache hit is optimization evidence, never reproducibility proof. Provider/runner substitution is admitted only after the required support vector and equivalence evidence are qualified.

## 7. D5-DEC-005 — Build execution providers coexist behind portable build semantics

CI services, local builders, container builders and future remote build providers are D4-qualified realizations. Migration should preserve the current build path while introducing provider-neutral build intent and attempt identity.

Safe coexistence is:

`current builder authoritative -> candidate runner shadow/rebuild -> output/evidence comparison -> bounded cohort admission -> explicit runner/provider cutover -> old runner fencing for authoritative production -> residual job/cache/toolchain drain -> reconciliation`.

Provider success cannot strengthen semantic claims absent from its support vector. A provider that cannot evidence material closure, target isolation or output integrity may remain usable for a bounded profile but cannot silently satisfy a stronger profile.

## 8. D5-DEC-006 — Cache migration is population-aware and non-authoritative

Caches may include dependency caches, generated-output caches, compiler caches, layer caches and remote build caches. Each relevant cache cohort must have:

- cache identity/provider;
- key/input derivation revision;
- producing toolchain/material revisions;
- target/platform scope;
- integrity/provenance evidence where required;
- currentness/invalidation horizon;
- privacy/secret contamination constraints;
- residual drain/eviction disposition.

Old cache presence cannot cause old material to become current authority. Cache poisoning, stale keys or cross-target reuse must remain detectable proof routes for Planning E.

## 9. D5-DEC-007 — Artifact adoption is an explicit authority boundary

Validated `BuildOutputSet` becomes canonical `ArtifactRevision` only through explicit adoption. Migration must preserve:

`build output -> validation -> adoption proposal -> authority/policy qualification -> immutable artifact identity -> evidence attachment -> release composition`.

Registry push, object-store upload or generated-file existence does not constitute adoption. Existing content hashes are retained and generalized; mutable tags/paths/provider coordinates remain realization aliases.

Identical bytes can share content identity while still participating in different adoption occurrences, evidence horizons or logical releases.

## 10. D5-DEC-008 — SBOM and provenance migrate as subject-bound evidence, not decoration

Existing manifests, hashes and build evidence are incrementally mapped into typed evidence. D5 requires explicit subject and coverage for SBOM/provenance claims.

Migration may coexist with multiple encodings/providers, but portable semantics preserve:

- exact artifact/release/build subjects;
- statement/profile revision;
- generator/builder/attestor identity;
- material/component population and known exclusions;
- creation/observation time and currentness;
- verification policy/trust revisions;
- contradictions or unsupported scope.

Historical evidence can remain useful after trust/policy changes without being treated as currently admissible. Backfill may link existing hashes/manifests; it may not fabricate missing builder/material provenance.

## 11. D5-DEC-009 — Cryptographic validity, trust and release authority remain separate

D2 trust prerequisites are mandatory before release admission/promotion. Migration preserves the sequence:

`evidence observed -> subject binding -> cryptographic verification -> signer/attestor trust/currentness -> semantic/predicate qualification -> release admission authority`.

Rotation or revocation may change current admissibility without rewriting historical signature validity. Residual signers, credentials, trust bundles and verification caches are D2 residual cohorts and can block current promotion.

## 12. D5-DEC-010 — Release identity and distribution realization are separated before registry migration

Canonical release composition must be established independently of registry/provider coordinates before provider substitution is considered complete.

Distribution migration follows:

`canonical artifact/release -> target provider qualification -> publish request -> APPLIED/NOT_APPLIED/PARTIAL/UNKNOWN -> availability/integrity observation -> replica/mirror convergence -> consumer cohort transition -> old registry/mirror fencing/withdrawal -> residual copy/reference drain -> reconciliation`.

D3/D4 effect semantics apply. A timeout or upload error cannot be assumed `NOT_APPLIED`; `UNKNOWN -> reconcile-before-retry` unless duplicate safety for the exact operation is proven.

Mutable tags/channels may coexist during transition, but authority remains on immutable release/artifact revisions. Provider replication does not transfer source-of-truth ownership.

## 13. D5-DEC-011 — Release admission is revision-vector qualified

A release can be admitted only for an explicit scope and current `RevisionVector`, including applicable dimensions such as:

- artifact composition;
- material/provenance/SBOM profile;
- trust/signature policy;
- security/governance policy;
- schema/data compatibility;
- config/secret references;
- provider support;
- target/environment profile;
- evidence/test revision and horizon.

`admitted once` does not mean `admitted forever`. New vulnerability/trust/policy/provider evidence may change current admission while preserving historical decisions.

## 14. D5-DEC-012 — Deployment migration separates desired, accepted, observed and effective truth

The existing durable deployment registry and stale-active fencing are retained. Migration generalizes them into the sequence:

`release admitted -> deployment plan qualified -> desired generation committed -> provider actuation -> provider acceptance/effect disposition -> observed generation -> readiness -> traffic serving -> consumer/service effectiveness`.

Each transition is separately evidenced. Provider resource IDs are realization identities. Existing local generated-process deployment remains one provider realization and a reference path for autonomous runtime closure.

A deployment record must not collapse `RUNNING`, `READY`, `REACHABLE` and `EFFECTIVE` into one status during migration.

## 15. D5-DEC-013 — Rollout and cutover are cohort-qualified

Migration from current single-host/single-active assumptions toward Fleet/provider-neutral runtime must proceed by explicit cohorts:

- target environment/site/Station;
- runtime provider/binding;
- release revision;
- config/secret/schema/trust revision vector;
- rollout stage;
- traffic population;
- local/offline cohort.

Portable rollout intent may be realized as rolling, blue/green, canary, partitioned or shadow strategies. Provider mechanisms remain D4 realizations.

Cutover requires explicit criteria and cannot be inferred from resource creation. Residual old generations capable of serving requests, consuming queues, emitting events or holding sessions remain first-class cohorts until drained or dispositioned.

## 16. D5-DEC-014 — Autonomous local runtime closure survives Builder disconnection

D5 preserves the requirement that a generated client/runtime can continue operating within its qualified local closure without a live dependency on the System Builder control plane.

A `QualifiedLocalRuntimeClosure` must identify the locally available and currently admissible revisions of:

- release/artifacts;
- configuration/secret references or locally materialized bounded values;
- schema/data prerequisites;
- trust bundles/status horizon;
- provider bindings required locally;
- policy/authority material required for bounded operation;
- recovery/runbook evidence;
- observability buffering/currentness limits.

Offline does not create new authority. Expired trust, revoked credentials, stale policy or missing required evidence can force degraded/read-only/blocked behavior according to owner policy. Reconnect is a reconciliation boundary, never automatic `latest-wins`.

## 17. D5-DEC-015 — Fleet migration preserves per-member revision/currentness truth

Fleet is a projection over member-local evidence. Migration must preserve, per runtime/Station/member:

- desired and observed release/runtime generation;
- applicable `RevisionVector`;
- observation time/currentness;
- local readiness/effectiveness evidence;
- provider/binding revision;
- residual local artifacts/config/secrets/sessions/jobs;
- offline/disconnected state;
- reconciliation backlog.

`Fleet green != every member current` and `member disconnected != member failed`.

Fleet-level rollout decisions may target cohorts but cannot manufacture local convergence evidence.

## 18. D5-DEC-016 — Rollback, roll-forward and restore are distinct migration strategies

Rollback eligibility is reassessed at the time of use. Retaining an old artifact is only one prerequisite.

Eligibility may depend on:

- schema/data compatibility and irreversible migrations;
- workflow/in-flight semantics;
- config/secret/trust currentness;
- provider availability/support;
- policy/security/privacy changes;
- external effects already committed;
- consumer contract compatibility;
- local/Fleet residual state.

D5 distinguishes:

- deployment rollback to a previously qualified generation;
- roll-forward to a corrected generation;
- provider fencing/routing reversal;
- domain compensation for external effects;
- data/state restore under Security/Recovery;
- manual reconciliation when no safe inverse exists.

`rollback converged` never means prior external effects were undone unless independently proven.

## 19. D5-DEC-017 — Lifecycle coordination owns transition truth, not owner-specific mechanics

C3.24 Lifecycle coordinates revision succession, readiness, coexistence, cutover, residual drainage and closure across Build/Artifact/Deployment owners. It does not absorb their semantics.

A D5 supply-path transition carries a sparse, cohort-aware `RevisionVector`. `ABSENT`, `NOT_APPLICABLE`, explicit revision and `UNKNOWN` remain distinct. Compatibility is directional and scope-qualified.

Mixed revisions are expected during migration. Historical builds/releases/deployments remain interpretable under producing revisions. `latest` is never a migration algorithm.

## 20. D5-DEC-018 — Residual supply-path cohorts are explicit and drainable

Residual populations include, where applicable:

- old build runners/jobs/toolchains;
- dependency and build caches;
- mutable tags and legacy registry references;
- registry/mirror replicas;
- old SBOM/provenance/signature formats or verification caches;
- previous release channels/pointers;
- old runtime generations/replicas/processes;
- sessions/connections/traffic routes;
- migration jobs;
- config/secret/trust material;
- offline Stations and edge caches;
- provider-side jobs/callbacks;
- manual deployment/build procedures.

Every residual cohort requires owner, producing revisions, authority/effect capability, population estimate/coverage, oldest age, currentness objective, fence/drain/revoke/reconcile route and closure evidence.

No D5 migration closes because the primary cohort moved while a residual cohort can still produce authoritative or externally visible effects.

## 21. D5-DEC-019 — Queueing/capacity is part of migration correctness

Supply-path migration contains interacting queues:

- dependency resolution/fetch;
- build admission/execution;
- cache fill/eviction;
- signing/SBOM/provenance generation;
- artifact replication/publication;
- release qualification/promotion;
- deployment/rollout;
- readiness assessment;
- runtime drain;
- Fleet reconciliation;
- operator/manual exception review.

Each material queue requires expected/peak arrival, depth, oldest age, service/drain rate, concurrency, provider quota, retry amplification, headroom and finite convergence objective.

`average CI utilization low` does not prove burst headroom; `deployment queue empty` does not prove runtime residual cohorts drained. Closure is multidimensional.

## 22. D5-DEC-020 — Environment qualification spans build and runtime without conflating them

Build environment and deployment environment are separate scopes linked by compatibility claims.

Build qualification concerns toolchain, runner, target platform and controlled inputs. Runtime environment concerns site/Station/tenant, provider, policy, config/secrets, trust, schema/data, placement, capacity and dependency availability.

A build produced for a target profile may be incompatible with a specific runtime environment despite successful compilation. Conversely, runtime environment labels such as `prod` do not prove build or release qualification.

Provider-specific environment names remain realization aliases.

## 23. D5-DEC-021 — Brownfield/manual supply paths remain evidence-first

Existing CI workflows, scripts, local commands, registry procedures, manual signing, deployment runbooks, ad-hoc rollback steps and operator knowledge are discovered as evidence/candidates.

Migration classifies them using D1 epistemic semantics and records:

- source/revision/currentness;
- actor/authority actually used;
- inputs/outputs and hidden dependencies;
- side effects;
- manual gates/bypasses;
- provider/tool assumptions;
- failure/recovery behavior;
- tacit steps and negative space;
- evidence of real versus intended behavior.

`observed procedure != intended procedure != approved canonical procedure`. Shadow mapping precedes canonical adoption.

## 24. D5-DEC-022 — Elicitation Lens for the supply path

D5 extends C1 with a capability-aware `Build / Artifact / Deployment / Lifecycle Elicitation Lens`.

Adaptive questions must cover at least:

- What exact inputs can change the build output?
- Which dependencies/materials are conditional or fetched dynamically?
- What proves dependency/material closure for each target?
- What does “reproducible” mean for this artifact and what evidence falsifies it?
- Which runner/toolchain/provider is used, and what portable support is actually required?
- What makes a build output an authorized canonical artifact?
- What exact population does the SBOM/provenance statement cover, and what is excluded?
- Which trust/policy revisions make a release currently admissible?
- Which registry/mirror copies and mutable aliases remain after cutover?
- What distinguishes deployment desired, accepted, observed, ready, serving and consumer-effective state?
- Which rollout cohorts can coexist, and what fences the old cohort?
- What makes rollback currently safe rather than historically possible?
- Which Stations can operate offline, for how long, under which revision/currentness horizons?
- What residual build/artifact/runtime/config/secret/trust cohorts can still produce effects?
- What queue/backlog/capacity could prevent finite convergence?
- Who owns each unresolved or `UNKNOWN` transition and what evidence clears it?
- What would falsify the claim that the supply-path migration is complete?

Question provenance records why each question was asked, which gap triggered it, expected evidence and downstream blocked artifacts. AI may suggest follow-ups and mappings; `AI inference = candidate`.

## 25. Production Readiness Coverage remains separate

Feature/supply-path modeling completeness cannot substitute for operational readiness.

D5 Production Readiness Coverage must independently qualify:

- build/release/deployment SLOs and latency objectives;
- expected and peak build/deployment rates;
- queue depth and age;
- dependency/registry/provider availability and quotas;
- cache and storage capacity;
- signing/attestation throughput;
- rollout concurrency and headroom;
- timeout/UNKNOWN/retry/idempotency behavior;
- residual-cohort drainage rate;
- local/offline retention horizons;
- Fleet reconciliation capacity;
- alertability/ownership/escalation;
- recovery/rollback/roll-forward readiness;
- post-change validation;
- cost/usage evidence where operationally material.

No scalar completeness score can hide a HIGH/CRITICAL gap, stale trust/evidence, unresolved `UNKNOWN`, undrained authoritative cohort or unsustainable queue.

## 26. Cross-cutting mathematical/analytical semantics

D5 preserves mathematical semantics as cross-cutting rather than creating a new capability. Supply-path assessments may use typed expressions for queueing, capacity, rates, distributions, uncertainty, rollout thresholds and equivalence comparisons.

Every material calculation preserves units, population, window, assumptions, uncertainty and provenance. Examples such as arrival rate `λ`, service rate `μ`, utilization or estimated drain horizon are valid only under declared assumptions; an average cannot hide burst, tail latency, provider quota or cohort skew.

Analytical/AI projections remain decision inputs, not authority.

## 27. D5 dependency matrix

| Transition | Required predecessor | Edge kinds | Closure condition |
|---|---|---|---|
| Material graph adoption | D1 semantic/evidence; source/build identity | `SEMANTIC_PREREQUISITE`, `EVIDENCE_PREREQUISITE`, `REVISION_PREREQUISITE` | declared/resolved/fetched identities and target-conditional closure qualified |
| Runner/toolchain substitution | D4 provider qualification; D2 trust/secrets where applicable | `PROVIDER_PREREQUISITE`, `TRUST_PREREQUISITE`, `OPERABILITY_PREREQUISITE` | support vector + shadow/rebuild evidence + residual job/cache plan |
| Reproducibility claim | material closure + environment/toolchain profile | `EVIDENCE_PREREQUISITE`, `REVISION_PREREQUISITE` | scoped equivalence assessment with known impurities/exclusions |
| Artifact adoption | validated build output + authority/policy | `DATA_PREREQUISITE`, `AUTHORITY_PREREQUISITE`, `EVIDENCE_PREREQUISITE` | immutable artifact identity and adoption occurrence established |
| Release admission | artifact composition + evidence + D2 trust + policy | `TRUST_PREREQUISITE`, `AUTHORITY_PREREQUISITE`, `EVIDENCE_PREREQUISITE`, `REVISION_PREREQUISITE` | current scope/revision-vector qualification |
| Distribution provider cutover | release identity + D4 target provider | `PROVIDER_PREREQUISITE`, `EVIDENCE_PREREQUISITE`, `OPERABILITY_PREREQUISITE` | availability/integrity converged; old mutable/effecting paths fenced; residual copies tracked |
| Deployment desired-generation cutover | admitted release + runtime prerequisites | `DATA_PREREQUISITE`, `TRUST_PREREQUISITE`, `AUTHORITY_PREREQUISITE`, `PROVIDER_PREREQUISITE` | desired generation committed under qualified deployment plan |
| Runtime convergence | provider actuation + Observability evidence | `EVIDENCE_PREREQUISITE`, `OPERABILITY_PREREQUISITE`, `LOCALITY_PREREQUISITE` | observed/ready/serving/effective states qualified for target cohorts |
| Lifecycle closure | all owner transitions + residual drains | all applicable D0 kinds | revision-vector reconciliation complete; residual cohorts drained/dispositioned; proof routes retained |

## 28. Migration states specialized for D5

D0 states remain authoritative. D5 interprets them as:

- `DISCOVERED` — existing build/release/deployment path inventoried;
- `QUALIFIED` — identities, revisions, hidden inputs, authority/trust/provider/evidence gaps classified;
- `COEXISTENCE_READY` — target semantic identities and provider support can coexist without authority ambiguity;
- `SHADOWING` — alternate resolution/build/evidence/provider/runtime observation compared non-authoritatively;
- `PARTIAL_CUTOVER` — bounded target/cohort uses target path with explicit old-path authority;
- `CUTOVER` — target path is authoritative for declared scope;
- `RESIDUAL_DRAIN` — old runners/caches/registries/runtimes/config/secret/trust cohorts are fenced/draining;
- `RECONCILED` — desired/observed/effective and revision-vector evidence agree within declared scope;
- `CLOSED` — residuals/evidence/proofs satisfy closure.

`PARTIAL`, `UNKNOWN`, `CONFLICTED`, `BLOCKED` and manual reconciliation remain explicit dispositions.

## 29. Planning E proof obligations carried forward

D5 records proof routes only; Planning E is not executed here. At minimum:

1. declared/resolved/fetched dependency identities cannot collapse;
2. conditional target material closure cannot be falsely generalized;
3. hidden ambient input blocks strong reproducibility claim;
4. cache hit cannot prove provenance/reproducibility;
5. runner/provider substitution preserves output/evidence profile or reports lossiness;
6. historical provenance backfill does not invent missing facts;
7. build output cannot self-promote to canonical artifact;
8. mutable tag/provider coordinate cannot replace immutable artifact identity;
9. SBOM presence cannot imply population completeness/currentness;
10. provenance/signature validity cannot imply release admission;
11. trust revocation can change current admission without rewriting history;
12. distribution ACK cannot imply replica/mirror convergence;
13. ambiguous publication effect preserves `UNKNOWN` and reconcile-before-retry;
14. release admission cannot imply deployment/runtime effectiveness;
15. desired/accepted/observed/ready/serving/effective deployment states remain distinct;
16. rollout cannot close while authoritative residual runtime cohorts remain;
17. Fleet aggregate cannot hide stale/offline member revision;
18. offline Station cannot gain authority through disconnection;
19. rollback retained artifact cannot imply current rollback eligibility;
20. rollback cannot imply external effects undone;
21. reconnect cannot use silent latest-wins;
22. unsustainable queue/backlog prevents false convergence;
23. HIGH/CRITICAL elicitation gap or contradiction blocks false completeness;
24. Production Readiness Coverage remains distinct from feature/supply-path coverage;
25. AI-generated build/release/deployment output remains candidate until governed adoption;
26. Brownfield observed procedure cannot self-promote to canonical desired process;
27. residual config/secret/trust/provider cohorts block false supply-path closure;
28. provider support-vector loss cannot be hidden by successful command execution.

## 30. D5 closure and next Planning D boundary

D5 is `PASS` when the build-to-runtime supply path has a migration partial order that:

- preserves current deterministic/autonomous foundations;
- introduces typed material/build/artifact/release/deployment/lifecycle identities without big-bang rewrite;
- preserves D2 authority/trust/secrets and D3/D4 external-effect/provider disciplines;
- separates desired/observed/effective truth;
- supports provider/runner/registry/runtime coexistence and substitution;
- preserves local/offline/Fleet currentness;
- treats rollback, roll-forward, restore and compensation separately;
- makes residual cohorts and queue/capacity finite convergence obligations explicit;
- integrates C1 adaptive elicitation and separate Production Readiness Coverage;
- carries proof routes forward without executing Planning E.

No product remediation or implementation is performed by this decision.

**D5 result: DECIDED / PASS FOR D5.**

The next ordered Planning D action must be determined by a fresh read of `RESEARCH_PIPELINE_STATE.json` after D5 persistence. D5 itself does not authorize D6+, Planning E or any later phase.