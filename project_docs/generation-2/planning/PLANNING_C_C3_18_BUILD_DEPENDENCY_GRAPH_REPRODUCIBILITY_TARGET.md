# Generation 2 — Planning C — C3.18 Build / Dependency Graph / Reproducibility Target Architecture

Status: **DECIDED / PASS_FOR_CAPABILITY / TARGET_ARCHITECTURE_DECIDED**
Phase: `PLANNING_C_TARGET_ARCHITECTURE`
Capability: **Build / Dependency Graph / Reproducibility**
Decision: `C3.18`
Scope: target-architecture planning only. No product implementation, Work Package, executive TASK, Construction or remediation is authorized by this record.

## 1. Decision authority and inherited constraints

This decision is governed by:

- `RESEARCH_PIPELINE_STATE.json` as phase/current-focus/next-action authority;
- `PLANNING_C_TARGET_ARCHITECTURE_ENTRY_FRAMEWORK.md`;
- C0 Universal Capability Architecture / Semantic Substrate;
- C1 Elicitation & System Understanding Architecture;
- C2 Physical / Peripheral Integration Boundary;
- `PLANNING_A_BUILD_DEPENDENCY_GRAPH_REPRODUCIBILITY_BOUNDARIES.md`;
- `PLANNING_B_BUILD_DEPENDENCY_GRAPH_REPRODUCIBILITY_SB_CURRENT_STATE.md`;
- C3.17 Secrets / Configuration / Environment Portability and earlier target decisions for Provider/Binding, Security/Recovery, Trust/PKI, Storage, Lifecycle and related owners;
- the closed adversarial inventory of **284 material edge scenarios + 124 ConflictPatterns = 408 material findings**.

Constitutional distinctions:

- `declared dependency != resolved dependency != fetched material`;
- `material locator != canonical material identity`;
- `same version label != same material/toolchain`;
- `cache hit != provenance/currentness/reproducibility proof`;
- `build accepted != build executed != outputs validated`;
- `build success != reproducible build`;
- `build output != release != deployed/effective runtime`;
- `generated output != authorized semantic change`;
- `provider/runner success != portable qualification`;
- `offline cache presence != trusted/current dependency closure`;
- `provenance != currentness != authority`;
- `Fleet aggregate != local build truth`;
- `AI suggestion/generated code != build/change authority`;
- `Research != remediation`, `ConflictPattern != ConflictInstance`, and `Signal != ConfirmedConflict`.

## 2. Current-state anchor

Generation 1 already contains a strong bounded deterministic foundation: transitive capability dependency resolution, conflict/cycle diagnostics, stable `AssemblyPlan` normalization and hashing, deterministic compiler normalization, generated-file hashing, aggregate artifact hashing, validation-evidence gating, explicit compiler/runtime versions, symbolic secret-reference handling and deterministic runtime/migration materialization.

That baseline is retained. It proves deterministic behavior for explicit bounded inputs, but not a generalized portable build owner. Missing semantics include generalized material identity, declared-versus-resolved closure, complete build revision vectors, hermeticity/controlled impurity, build-attempt lineage, cache qualification, reproducibility assessment, runner/toolchain substitution and residual-provider/cache cohorts.

C3.18 therefore generalizes the deterministic assembler/compiler without replacing it.

## 3. Target decision

**DECISION C3.18-D1 — establish a provider-neutral, revision-qualified Build & Material Graph Plane that owns canonical build intent, typed material/dependency closure, execution lineage, controlled input boundaries, cache qualification and reproducibility claims, while runners, package managers, compilers, registries and build services remain qualified realizations.**

The capability owns seven linked truth planes:

1. **Build Definition Plane** — build intent, recipe, target, output contract and applicability profile.
2. **Material & Dependency Plane** — declared dependency intent, resolution, fetched materials, integrity and conditional/transitive closure.
3. **Toolchain & Execution Plane** — toolchain, runner and execution environment qualification.
4. **Input-Boundary Plane** — filesystem/network/environment/time/randomness/configuration/secret boundaries and controlled impurity.
5. **Build Attempt & Output Plane** — attempts, execution states, produced output sets, validation and handoff evidence.
6. **Cache & Incremental Plane** — cache identity, provenance/currentness, invalidation and incremental build lineage.
7. **Reproducibility & Portability Plane** — rebuild comparison, equivalence profile, provider/toolchain substitution and portable qualification.

No package coordinate, lockfile line, path, runner ID, cache key, image tag or provider run ID becomes canonical semantic identity merely because one realization treats it as stable.

## 4. Canonical identities and revision vector

The target introduces or qualifies identities such as:

- `BuildDefinitionId` and `BuildDefinitionRevisionId`;
- `BuildRecipeId` and `BuildRecipeRevisionId`;
- `BuildTargetId` and `BuildTargetRevisionId`;
- `BuildInputId`;
- `MaterialId` and `MaterialRevisionId`;
- `DependencyIntentId`;
- `DependencyResolutionId`;
- `MaterialClosureId`;
- `ToolchainProfileId` and revision;
- `RunnerQualificationId`;
- `BuildAttemptId`;
- `BuildOutputSetId`;
- `CacheEntryId` as an optimization realization identity, never canonical truth by itself;
- `ReproducibilityAssessmentId`;
- `ResidualBuildCohortId`.

A build-relevant `RevisionVector` may include source revision, dependency/material closure revision, build recipe revision, toolchain/compiler/interpreter revision, target/platform profile, runner qualification, relevant configuration references, generated-input revisions and declared external-input epochs.

Changing only a display version does not preserve identity if the underlying material changes. Conversely, provider substitution need not change canonical build intent when semantic behavior and qualified evidence remain equivalent.

## 5. Typed material and dependency graph

**DECISION C3.18-D2 — the dependency graph is a typed semantic graph whose declared edge, resolved edge and fetched material are separate records.**

A minimum edge model distinguishes:

- dependency kind: source, library/module/package, generated input, tool/plugin, compiler/interpreter, base image/root filesystem, schema/interface, asset, migration, platform/SDK or other qualified material;
- declared selector/constraint;
- resolution policy revision;
- resolved canonical material revision;
- provider/package-manager/registry locator as realization metadata;
- integrity evidence/digest set where applicable;
- conditions: platform, architecture, feature, optionality, environment profile or build target;
- provenance/currentness;
- transitive parent/child lineage;
- availability/revocation/admission disposition.

`declared dependency != resolved dependency != fetched material` is non-negotiable. A lockfile can be strong evidence of a resolution decision, but it is not itself the entire material graph unless every build-influencing input is represented or explicitly classified outside it.

Graph closure can be `COMPLETE`, `PARTIAL`, `CONFLICTED`, `BLOCKED`, `UNSUPPORTED` or `INCONCLUSIVE`; a successful resolver exit does not automatically imply complete influence closure.

## 6. Resolution, lockfiles and conditional dependencies

**DECISION C3.18-D3 — resolution is revisioned and condition-qualified; lockfiles preserve resolution evidence but cannot erase platform/feature/context semantics.**

The target records:

`declared intent -> resolver/policy revision -> candidate universe/currentness -> selected material revision -> fetched bytes/object -> integrity/admission -> closure membership`.

A package name and version can resolve to different bytes across registries, republishing events, architectures or mutable tags. Canonical material identity therefore requires stronger qualification than a label alone.

Optional, peer, feature-gated, platform-specific and conditional dependencies remain explicit edges. A closure for Linux/amd64 does not silently prove a closure for another target. Missing or unsupported conditional branches remain visible rather than being summarized away.

## 7. Build definition, recipe and output contract

A `BuildDefinitionRevision` declares:

- source/material roots;
- build recipe or graph transformation;
- target/platform profile;
- expected primary output set and equivalence profile;
- allowed/forbidden network/filesystem/environment interactions;
- permitted configuration/secret references;
- required toolchain capabilities;
- cache/incremental policy;
- generated-code/plugin policy;
- reproducibility profile;
- validation and evidence obligations.

The recipe is not the runner configuration. A provider-specific workflow file may realize the build definition, but provider syntax must not become the portable definition by accident.

## 8. Hermeticity and controlled impurity

**DECISION C3.18-D4 — hermeticity is a qualified support profile; non-hermetic inputs are explicit controlled impurity, never invisible environment truth.**

Potential build-influencing dimensions include:

- filesystem contents and path layout;
- environment variables and locale;
- network-fetched mutable resources;
- system libraries and kernel/platform facilities;
- wall clock/timezone;
- randomness and temporary names;
- process ordering/parallelism when it affects output;
- user/home/global tool configuration;
- package-manager global state;
- remote caches/control planes;
- externally resolved configuration and secret references.

The Reproducible Builds definition requires the relevant source, build environment and instructions to be held constant for bit-for-bit artifact recreation. Time and randomness are known nondeterminism sources; techniques such as a deterministic source-derived epoch may normalize legitimate timestamp inputs, but normalization cannot be used to hide security- or provenance-relevant differences.

A non-hermetic build is allowed when explicitly qualified. Its reproducibility claim is then scoped to the declared controlled impurities and evidence horizon rather than upgraded to universal reproducibility.

## 9. Configuration and secret-reference boundary

C3.17 remains owner of configuration/secret definition, resolution, currentness, rotation and revocation.

Build may consume symbolic references under an explicit profile. Secret values:

- do not become canonical material identity by default;
- must not leak into public provenance, cache keys, logs or generated evidence;
- may influence a build only when that influence is explicitly admitted and the resulting reproducibility/security implications are represented.

A provider-resolved secret version can make two otherwise identical attempts intentionally non-equivalent. That difference must be visible through qualified reference/version lineage without disclosing secret material.

## 10. Toolchain, runner and provider qualification

**DECISION C3.18-D5 — toolchain and runner substitution is a capability-support problem, not command-line compatibility.**

A build support vector can qualify:

- target/platform/architecture support;
- sandbox/input isolation;
- network controls;
- filesystem controls;
- dependency resolution semantics;
- cache semantics;
- toolchain/version pinning;
- clock/randomness control;
- secret/config materialization boundaries;
- concurrency/resource semantics;
- output capture/integrity evidence;
- provenance/attestation support;
- ambiguous remote-effect behavior;
- offline/self-hosted closure;
- audit/diagnostic evidence.

Matching command names, package-manager support or successful completion does not prove equivalent semantics. Toolchain substitution is a potentially material revision unless the applicable equivalence profile is proven.

## 11. Build attempt and execution lineage

Portable lineage distinguishes:

`build request -> authority/admission -> build definition/revision pinned -> dependency closure resolved -> materials admitted/fetched -> runner/toolchain qualified -> execution accepted -> execution started -> outputs produced -> outputs validated -> build result decided -> reproducibility assessment (if requested) -> downstream artifact/release handoff`.

A build attempt records outcome separately from the canonical build definition. Remote execution can use:

- `NOT_APPLIED`;
- `APPLIED`;
- `PARTIAL`;
- `UNKNOWN`.

Where retry can duplicate or corrupt authoritative external state, **`UNKNOWN -> reconcile-before-retry`** unless exact operation/attempt idempotency is independently qualified.

## 12. Determinism, reproducibility and equivalence profiles

**DECISION C3.18-D6 — reproducibility is a `QualifiedClaim`, not a boolean attribute of a project or runner.**

Possible profiles include:

- **BYTE_IDENTICAL** — all declared primary outputs match bit-for-bit;
- **NORMALIZED_EQUIVALENT** — explicitly authorized normalization yields equivalent outputs under a reviewable normalization contract;
- **SEMANTIC_EQUIVALENT** — only where the semantic equivalence relation is formally owned and stronger byte identity is not required;
- **REPEATABLE_ON_PROFILE** — repeatable only within a narrower runner/toolchain/environment profile;
- **INCONCLUSIVE** — evidence population/currentness/closure is insufficient or contradictory.

A claim records subject/output set, exact revision vector, comparison method, evidence population, runner/toolchain qualification, normalization rules, currentness and horizon.

`build success != reproducible build`. One successful execution cannot establish a reproducibility population by itself. One matching hash does not prove material-closure completeness.

## 13. Cache identity, provenance and contamination

**DECISION C3.18-D7 — caches are optimization realizations with explicit producing lineage, applicability and invalidation; a cache key is not proof.**

A cache entry records or references:

- producing build/material revision vector;
- cache namespace/scope;
- output/intermediate kind;
- producer runner/toolchain qualification;
- integrity evidence;
- applicability predicates;
- creation/currentness horizon;
- security/revocation status;
- consuming attempts;
- invalidation/disposition lineage.

Cache reuse must be rejected or weakened when dependency resolution policy, material integrity/revocation, toolchain, target, configuration semantics, security policy or relevant producing context changed.

Cross-tenant/site cache reuse requires explicit isolation proof. A fast `100% hit` is not a correctness signal by itself. Residual caches from retired providers/runners remain visible as cohorts until unable to produce authoritative build results.

## 14. Incremental graph invalidation

Incremental builds are modeled as graph transformations from a prior qualified closure/output state to a new one. Invalidation must be dependency-aware and revision-qualified.

A changed node invalidates all outputs whose derivation relation depends on that node unless a narrower non-effect relation is itself proven. Timestamp-only heuristics, path mtime or provider cache heuristics cannot silently replace semantic dependency edges when stronger correctness is claimed.

Graph-transform proof obligations are revision-specific: a proof or cache valid for `N` is not inherited by `N+1` unless the changed transformation preserves the predicates on which that proof depended.

## 15. Generated code, plugins and execution authority

Generated code, build plugins, code generators, compilers and macros can execute semantics during build. Their identity, revision, permissions and material influence belong in the build graph/support profile when relevant.

AI-generated code remains a proposal/change candidate. The fact that generated code compiles or that a plugin successfully emits output does not authorize semantic changes to canonical process/data/security/authority models.

Build-time plugins cannot obtain broader source, secret, network or provider authority merely because the build runner possesses it. Authority is least-privilege and delegated, not ambient.

## 16. Artifact / Release / SBOM / Provenance handoff

Build owns outputs and producing evidence. Artifact/Release owns adoption into canonical artifact/release identity, SBOM/provenance packaging/attestation, promotion, signing/distribution and release lifecycle.

The target preserves:

`BuildOutputSet -> explicit release/adoption transition -> ReleaseArtifact/Release`.

SLSA provenance is useful as an interoperability/evidence model because it distinguishes a build definition, external/internal parameters, resolved dependencies, builder and output subjects. C3.18 can map to such evidence without making SLSA fields the canonical internal semantic model or treating provenance presence as proof of reproducibility/currentness.

## 17. Supply-chain and trust crossings

Trust/PKI, Security/Recovery and Artifact/Release own their respective policy/attestation/admission domains. Build contributes material identity, integrity, producing lineage, controlled-input and reproducibility evidence.

A historically reproducible build may become currently inadmissible because a material, signer, toolchain or provider is compromised/revoked. Historical truth is not rewritten; current trust/admission changes independently.

Fetched material acceptance therefore requires the current applicable security/trust policy, not merely a matching legacy digest.

## 18. Local, offline and self-hosted build closure

An offline/self-hosted build profile must declare its `QualifiedLocalClosure`:

- source/material availability;
- package/toolchain/SDK availability;
- integrity/trust information needed locally;
- configuration/secret references and currentness boundaries;
- required registries/caches mirrored locally;
- license/entitlement constraints where applicable;
- time/randomness assumptions;
- runner resources;
- reconnect/update/reconciliation behavior.

`offline cache presence != trusted/current dependency closure`.

When remote currentness cannot be re-established, the system must surface `STALE`, `PARTIAL`, `BLOCKED` or `INCONCLUSIVE` as appropriate rather than silently elevating local presence to authority.

Fleet-level evidence does not prove every Station/local builder has the same valid closure.

## 19. Queue, capacity and parallelism semantics

Build readiness and reproducibility claims can be invalidated operationally by queue/backlog/capacity behavior even when the graph is correct.

Evidence can include:

- queued build attempts;
- age of oldest request;
- material-fetch backlog;
- dependency-resolution latency distributions;
- cache pressure/eviction rates;
- runner concurrency and saturation;
- provider throttling;
- failed/unknown attempt backlog;
- reproducibility verification queue;
- residual runner/cache cohort age;
- offline synchronization debt.

Parallelism is not semantically neutral if race/order affects generated outputs. A reproducibility profile must either control order-sensitive behavior or include it in the input/equivalence contract.

A fleet aggregate such as `99% builds healthy` cannot hide a critical Station/provider cohort with stale materials or non-drainable verification debt.

## 20. Brownfield / Legacy Mirroring assimilation

Brownfield discovery may observe:

- shell scripts and Makefiles;
- package-manager manifests and lockfiles;
- CI workflow files;
- container/image build definitions;
- local developer instructions;
- spreadsheets/runbooks listing dependency versions;
- global machine setup steps;
- manual downloads and copied binaries;
- private mirrors/caches;
- generated code checked into source;
- hidden environment variables;
- SDK/firmware packaging steps;
- emergency/manual build procedures.

Observed scripts are evidence of behavior, not canonical build intent. Assimilation follows:

`discover -> identify owners/source/currentness -> extract candidate build graph and input boundaries -> detect undeclared dependencies/shadow steps -> classify Fact/Claim/Assumption/InferredCandidate -> resolve contradictions -> explicit adopt/defer/out-of-scope -> create revisioned canonical lineage`.

`observed behavior != intended process != approved canonical process` remains mandatory.

Physical/Peripheral SDK/toolchain/firmware packaging remains within bounded integration/governance semantics. Producing or packaging firmware does not infer generic direct physical actuation authority.

## 21. C1 Elicitation Lens — Build / Dependency Graph / Reproducibility

Adaptive elicitation asks, at minimum:

- What exactly is being built, and what is the canonical source/build target?
- Which dependencies are declared, which are resolved, and which bytes/materials are actually fetched?
- Which transitive/conditional/platform-specific dependencies exist?
- Which lockfile/resolution policy is authoritative, and can package labels be republished or resolved differently?
- Which compiler/interpreter/SDK/tool/plugin versions influence output?
- Which filesystem, network, environment, locale, time, randomness and parallelism inputs can affect output?
- Is the build expected to be hermetic, controlled-impure or simply repeatable under a narrower profile?
- What exact artifacts are expected to reproduce, and under which equivalence relation?
- Which caches exist, who owns them, and how are provenance/currentness/invalidation proven?
- Which remote runners/providers are authoritative, and what happens on timeout/UNKNOWN outcome?
- What is required for offline/self-hosted building?
- Which secrets/configuration references are consumed, and may they influence output?
- Which generated-code/plugin steps execute with privileges?
- What is the source of truth for build scripts versus manual/operator knowledge?
- Are there shadow build machines, copied dependencies, private mirrors, manual patching or emergency procedures?
- Who may change dependencies, toolchains, generated code, reproducibility policy and release handoff?

Ambiguous answers trigger follow-up; duplicate/cross-capability questions route to their semantic owner rather than being silently asked/adopted twice.

`answered != understood`: a stakeholder saying “CI builds successfully” does not answer dependency closure, hermeticity, reproducibility, currentness, trust or portability.

## 22. Elicitation coverage and sufficiency gates

Coverage remains multidimensional with `UNTOUCHED`, `DISCOVERING`, `PARTIAL`, `RESOLVED`, `CONFLICTED`, `BLOCKED`, `NOT_APPLICABLE`, `DEFERRED`, all evidence/currentness-qualified.

Critical build dimensions include:

- canonical source/target ownership;
- dependency/material closure;
- resolution authority/currentness;
- toolchain/runner identity;
- environment/input boundaries;
- cache semantics;
- reproducibility/equivalence expectation;
- secret/config crossing;
- trust/security admission;
- failure/UNKNOWN/retry;
- offline/local closure;
- queue/capacity;
- Brownfield/manual paths;
- downstream release boundary;
- evidence/proof ownership.

No scalar “95% complete” can override a HIGH/CRITICAL unresolved dimension or an undisposed contradiction.

Stage gates:

- **Sufficient for abstraction** — semantic owner, source/target, dependency categories, truth boundaries and major unsupported/unknown dimensions are known.
- **Sufficient for architecture** — material identity/closure, revision vectors, provider/toolchain boundaries, cache/input/currentness semantics and contradictions have architectural disposition.
- **Sufficient for implementation** — each applicable dependency/input/output/failure/authority path has implementable semantics and acceptance evidence obligations.
- **Sufficient for publish/operation** — reproducibility/readiness evidence population is current, critical queues/residual cohorts are bounded, offline/provider paths are qualified and no HIGH/CRITICAL gap remains unresolved without approved disposition.

`Deferred != Resolved`; `OutOfScope != NotApplicable`; `NotApplicable` requires rationale and owner where the dimension could otherwise hide risk.

## 23. Cross-artifact consistency checks

Planning D/E must preserve machine-checkable or reviewable consistency between:

- requirement/story claiming reproducibility and the actual build equivalence profile;
- use case saying “offline build” and material/trust/local closure;
- build workflow and dependency/toolchain graph;
- permissions and who may change dependencies/toolchains/runners;
- configuration/secret declarations and build input boundary;
- release acceptance and actual BuildOutputSet/reproducibility evidence;
- provider support claims and the support vector;
- operational readiness and queue/cache/residual-cohort evidence.

Contradictions remain visible. Summarization cannot choose a silent winner.

## 24. Production Readiness Coverage

Production readiness is separate from feature completeness. Required coverage may include:

- deterministic graph resolution within stated profiles;
- integrity/admission of all required materials;
- current toolchain/runner qualification;
- cache isolation/provenance/currentness;
- bounded queue/backlog and verification debt;
- failure/UNKNOWN reconciliation;
- reproducibility evidence appropriate to claimed profile;
- offline/self-hosted closure where promised;
- provider substitution/coexistence/drainage;
- secret non-disclosure;
- supply-chain/trust crossing;
- incident/recovery procedures for compromised dependencies or caches;
- diagnostics capable of identifying which closure/input changed.

Build success alone cannot satisfy this gate.

## 25. Planning D migration constraints

Planning D must preserve:

1. the current deterministic assembler/compiler as KEEP/HARDEN foundation;
2. introduction of generalized material/build identities without breaking bounded existing `AssemblyPlan` identity;
3. separation of pre-release BuildOutputSet from Artifact/Release identity;
4. compatibility/migration for current compiler/runtime version fields into a richer revision vector;
5. adoption of existing dependency manifests/lockfiles/scripts as Brownfield evidence before canonical promotion;
6. no provider/runner/toolchain migration before support-vector qualification;
7. cache coexistence with explicit old/new namespaces, currentness and drainage;
8. no secret-value migration into canonical material/provenance records;
9. preserved historical build evidence across graph/toolchain revisions;
10. explicit handling of partial/unknown remote attempts and residual runner/cache cohorts;
11. cross-owner handoff to Artifact/Release, Security/Trust and C3.17 without semantic collapse;
12. no generic Physical/Peripheral actuation introduced through SDK/firmware build tooling.

## 26. Planning E proof obligations

Planning E must derive executable/inspectable product proofs at least for these families:

1. **Declared/resolved/fetched separation proof** — same declared selector can resolve differently without identity collapse.
2. **Material identity proof** — same version label with different bytes/material provenance does not become the same canonical revision.
3. **Transitive/conditional closure proof** — hidden platform/feature dependency prevents false COMPLETE closure.
4. **Revision-vector proof** — stale source/toolchain/recipe/target evidence cannot validate a new build revision.
5. **Hermeticity/controlled-impurity proof** — undeclared network/filesystem/time/randomness influence cannot silently preserve a stronger claim.
6. **Reproducibility non-strengthening proof** — build success or one hash match cannot become a reproducibility PASS without required population/closure.
7. **Equivalence-profile proof** — normalization cannot erase security/provenance-relevant differences.
8. **Cache provenance/currentness proof** — key match alone cannot authorize reuse after relevant revisions/revocations change.
9. **Cache isolation proof** — tenant/site/provider namespace collision cannot leak authoritative intermediates.
10. **Incremental invalidation proof** — changed dependency invalidates all affected derived outputs unless non-effect is proven.
11. **Remote UNKNOWN proof** — ambiguous execution/cache mutation reconciles before unsafe retry.
12. **Runner/toolchain substitution proof** — provider success does not establish portable qualification.
13. **Residual-cohort proof** — withdrawn runners/caches cannot continue producing authoritative outputs after cutover without explicit coexistence authorization.
14. **Build/release separation proof** — BuildOutputSet does not become ReleaseArtifact without explicit adoption.
15. **Secret non-disclosure proof** — secret material never appears in canonical build identity/public evidence/cache keys.
16. **Generated-code authority proof** — AI/plugin/generated output cannot alter canonical semantic truth merely because it compiles.
17. **Offline closure proof** — local cache presence cannot masquerade as current/trusted closure when remote trust/currentness is unavailable.
18. **Fleet/local truth proof** — aggregate fleet health cannot mask a critical local build cohort.
19. **Queue/capacity proof** — non-drainable build/verification debt blocks stronger readiness claims.
20. **Brownfield non-canonicalization proof** — scripts/manual instructions remain evidence/candidates until explicit owner adoption.
21. **Elicitation no-false-complete proof** — HIGH/CRITICAL unresolved build dimensions or contradictions block completion.
22. **Cross-artifact consistency proof** — story/use case/workflow/permissions/config/release claims cannot remain silently incompatible.
23. **Historical non-rewrite proof** — later trust/revocation changes affect current admission without rewriting historical build facts.
24. **Physical/Peripheral boundary proof** — SDK/firmware packaging does not infer direct physical actuation authority.

All proof obligations remain subject to `Signal != ConfirmedConflict`; a failed proof can surface a signal/finding route without automatically becoming a confirmed product conflict absent the required evidence/disposition.

## 27. Adversarial carry-forward and conflict ownership

No new material finding is created by this Planning C decision. The inherited 408 research findings remain active as architectural constraints/proof routes.

Candidate classes from the Elicitation/System Understanding front — including `FALSE_ELICITATION_COMPLETENESS`, `STAKEHOLDER_COVERAGE_GAP`, `ASSUMPTION_PROMOTED_TO_FACT`, `UNRESOLVED_CONTRADICTION_HIDDEN`, `HAPPY_PATH_ONLY_SPECIFICATION`, `ELICITATION_PROVENANCE_BREAK`, `CROSS_CAPABILITY_QUESTION_ROUTING_GAP`, `AI_INFERENCE_PROMOTED_TO_REQUIREMENT` — remain duplicate-screened against the closed 124 ConflictPattern inventory. Planning C does not allocate new IDs absent new material semantics.

Owners/detection routes are preserved through C1 coverage gates, build graph/revision validators, provider-support qualification, provenance/currentness checks, reconciliation queues, cross-artifact consistency checks and Planning E proof suites.

## 28. Decision disposition

**PASS_FOR_CAPABILITY / TARGET_ARCHITECTURE_DECIDED.**

Generation 2 shall retain the current deterministic assembler/compiler foundation and generalize it into a typed, provider-neutral, revision-qualified Build / Dependency Graph / Reproducibility owner. The target architecture makes material closure, build inputs, toolchain/runner qualification, controlled impurity, cache lineage, execution effects and reproducibility claims explicit without collapsing them into Release, Deployment, Security, Secrets or provider truth.

Planning C remains open until all 28 canonical capability decisions are complete. This record authorizes no C3.19 work and no Planning D/E, Architecture Reconciliation, WBS, Work Package, TASK, Construction or product-code action.